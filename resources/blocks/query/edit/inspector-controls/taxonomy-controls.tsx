/**
 * WordPress dependencies
 */
import {
	FormTokenField,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal dependencies
 */
import { useTaxonomies } from '../../utils';

interface TaxonomyControlsProps {
	onChange: (query: { taxQuery: Record<string, (string | number)[]> }) => void;
	query: {
		postType: string;
		taxQuery: Record<string, (string | number)[]> | null;
	};
}

interface Taxonomy {
	slug: string;
	name: string;
}

interface Term {
	id: number;
	name: string;
}

const EMPTY_ARRAY: any[] = [];
const BASE_QUERY = {
	order: 'asc',
	_fields: 'id,name',
	context: 'view',
} as const;

// Helper function to get the term id based on user input in terms `FormTokenField`.
const getTermIdByTermValue = (terms: Term[], termValue: string | { id: number; value: string }): number | undefined => {
	// First we check for exact match by `term.id` or case sensitive `term.name` match.
	const termId =
		typeof termValue === 'object' ? termValue.id : terms?.find((term) => term.name === termValue)?.id;
	if (termId) {
		return termId;
	}

	/**
	 * Here we make an extra check for entered terms in a non case sensitive way,
	 * to match user expectations, due to `FormTokenField` behaviour that shows
	 * suggestions which are case insensitive.
	 *
	 * Although WP tries to discourage users to add terms with the same name (case insensitive),
	 * it's still possible if you manually change the name, as long as the terms have different slugs.
	 * In this edge case we always apply the first match from the terms list.
	 */
	if (typeof termValue === 'string') {
		const termValueLower = termValue.toLocaleLowerCase();
		return terms?.find(
			(term) => term.name.toLocaleLowerCase() === termValueLower
		)?.id;
	}
	return undefined;
};

export function TaxonomyControls({ onChange, query }: TaxonomyControlsProps) {
	const { postType, taxQuery } = query;

	const taxonomies = useTaxonomies(postType);
	if (!taxonomies || taxonomies.length === 0) {
		return null;
	}

	return (
		<VStack spacing={4}>
			{taxonomies.map((taxonomy) => {
				const termIds = taxQuery?.[taxonomy.slug] || [];
				const handleChange = (newTermIds: (string | number)[]) =>
					onChange({
						taxQuery: {
							...taxQuery,
							[taxonomy.slug]: newTermIds,
						},
					});

				return (
					<TaxonomyItem
						key={taxonomy.slug}
						taxonomy={taxonomy}
						termIds={termIds}
						onChange={handleChange}
					/>
				);
			})}
		</VStack>
	);
}

interface TaxonomyItemProps {
	taxonomy: Taxonomy;
	termIds: (string | number)[];
	onChange: (termIds: (string | number)[]) => void;
}

/**
 * Renders a `FormTokenField` for a given taxonomy.
 *
 * @param {Object}   props          The props for the component.
 * @param {Object}   props.taxonomy The taxonomy object.
 * @param {number[]} props.termIds  An array with the block's term ids for the given taxonomy.
 * @param {Function} props.onChange Callback `onChange` function.
 * @return {JSX.Element} The rendered component.
 */
function TaxonomyItem({ taxonomy, termIds, onChange }: TaxonomyItemProps) {
	const [search, setSearch] = useState('');
	const [value, setValue] = useState<Array<{ id: number; value: string }>>(EMPTY_ARRAY);
	const [suggestions, setSuggestions] = useState<string[]>(EMPTY_ARRAY);
	const debouncedSearch = useDebounce(setSearch, 250);
	const { searchResults, searchHasResolved } = useSelect<{
		searchResults: Term[];
		searchHasResolved: boolean;
	}>(
		(select) => {
			if (!search) {
				return { searchResults: EMPTY_ARRAY, searchHasResolved: true };
			}
			const { getEntityRecords, hasFinishedResolution } =
				select(coreStore);
			const selectorArgs = [
				'taxonomy',
				taxonomy.slug,
				{
					...BASE_QUERY,
					search,
					orderby: 'name',
					exclude: termIds,
					per_page: 20,
				},
			];
			return {
				searchResults: getEntityRecords(...selectorArgs),
				searchHasResolved: hasFinishedResolution(
					'getEntityRecords',
					selectorArgs
				),
			};
		},
		[search, taxonomy.slug, termIds]
	);
	// `existingTerms` are the ones fetched from the API and their type is `{ id: number; name: string }`.
	// They are used to extract the terms' names to populate the `FormTokenField` properly
	// and to sanitize the provided `termIds`, by setting only the ones that exist.
	const existingTerms = useSelect<Term[]>(
		(select) => {
			if (!termIds?.length) {
				return EMPTY_ARRAY;
			}
			const { getEntityRecords } = select(coreStore);
			return getEntityRecords('taxonomy', taxonomy.slug, {
				...BASE_QUERY,
				include: termIds,
				per_page: termIds.length,
			});
		},
		[taxonomy.slug, termIds]
	);
	// Update the `value` state only after the selectors are resolved
	// to avoid emptying the input when we're changing terms.
	useEffect(() => {
		if (!termIds?.length) {
			setValue(EMPTY_ARRAY);
		}
		if (!existingTerms?.length) {
			return;
		}
		// Returns only the existing entity ids. This prevents the component
		// from crashing in the editor, when non existing ids are provided.
		const sanitizedValue = termIds.reduce<Array<{ id: number; value: string }>>((accumulator, id) => {
			const entity = existingTerms.find((term) => term.id === id);
			if (entity) {
				accumulator.push({
					id,
					value: entity.name,
				});
			}
			return accumulator;
		}, []);
		setValue(sanitizedValue);
	}, [termIds, existingTerms]);
	// Update suggestions only when the query has resolved.
	useEffect(() => {
		if (!searchHasResolved) {
			return;
		}
		setSuggestions(searchResults.map((result) => result.name));
	}, [searchResults, searchHasResolved]);
	const onTermsChange = (newTermValues: Array<string | { id: number; value: string }>) => {
		const newTermIds = new Set<number>();
		for (const termValue of newTermValues) {
			const termId = getTermIdByTermValue(searchResults, termValue);
			if (termId) {
				newTermIds.add(termId);
			}
		}
		setSuggestions(EMPTY_ARRAY);
		onChange(Array.from(newTermIds));
	};
	return (
		<div className="block-library-query-inspector__taxonomy-control">
			<FormTokenField
				label={taxonomy.name}
				value={value}
				onInputChange={debouncedSearch}
				suggestions={suggestions}
				displayTransform={decodeEntities}
				onChange={onTermsChange}
				__experimentalShowHowTo={false}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		</div>
	);
}
