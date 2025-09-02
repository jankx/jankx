/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { getEntitiesInfo } from '../../utils';

interface Author {
	id: string | number;
	name: string;
}

interface AuthorControlProps {
	value: string | number | undefined;
	onChange: (query: { author: string }) => void;
}

const AUTHORS_QUERY = {
	who: 'authors',
	per_page: -1,
	_fields: 'id,name',
	context: 'view',
} as const;

function AuthorControl({ value, onChange }: AuthorControlProps) {
	const authorsList = useSelect<Author[]>((select) => {
		const { getUsers } = select(coreStore);
		return getUsers(AUTHORS_QUERY);
	}, []);

	if (!authorsList) {
		return null;
	}
	const authorsInfo = getEntitiesInfo(authorsList);
	/**
	 * We need to normalize the value because the block operates on a
	 * comma(`,`) separated string value and `FormTokenField` needs an
	 * array.
	 */
	const normalizedValue = !value ? [] : value.toString().split(',');
	// Returns only the existing authors ids. This prevents the component
	// from crashing in the editor, when non existing ids are provided.
	const sanitizedValue = normalizedValue.reduce<Array<{ id: string | number; value: string }>>(
		(accumulator, authorId) => {
			const author = authorsInfo.mapById[authorId];
			if (author) {
				accumulator.push({
					id: authorId,
					value: author.name,
				});
			}
			return accumulator;
		},
		[]
	);

	const getIdByValue = (entitiesMappedByName: Record<string, Author>, authorValue: string | { id: string | number; value: string }) => {
		const id = typeof authorValue === 'object' ? authorValue.id : entitiesMappedByName[authorValue]?.id;
		if (id) {
			return id;
		}
	};
	const onAuthorChange = (newValue: Array<string | { id: string | number; value: string }>) => {
		const ids = Array.from(
			newValue.reduce<Set<string | number>>((accumulator, author) => {
				// Verify that new values point to existing entities.
				const id = getIdByValue(authorsInfo.mapByName, author);
				if (id) {
					accumulator.add(id);
				}
				return accumulator;
			}, new Set())
		);
		onChange({ author: ids.join(',') });
	};
	return (
		<FormTokenField
			label={__('Authors')}
			value={sanitizedValue}
			suggestions={authorsInfo.names}
			onChange={onAuthorChange}
			__experimentalShowHowTo={false}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	);
}

export default AuthorControl;
