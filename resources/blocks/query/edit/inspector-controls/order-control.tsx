/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface OrderByOption {
	label: string;
	value: string;
}

interface OrderControlProps {
	order: string;
	orderBy: string;
	orderByOptions?: OrderByOption[];
	onChange: (query: { order: string; orderBy: string }) => void;
}

const defaultOrderByOptions: OrderByOption[] = [
	{
		label: __('Newest to oldest'),
		value: 'date/desc',
	},
	{
		label: __('Oldest to newest'),
		value: 'date/asc',
	},
	{
		/* translators: Label for ordering posts by title in ascending order. */
		label: __('A → Z'),
		value: 'title/asc',
	},
	{
		/* translators: Label for ordering posts by title in descending order. */
		label: __('Z → A'),
		value: 'title/desc',
	},
];

function OrderControl({
	order,
	orderBy,
	orderByOptions = defaultOrderByOptions,
	onChange,
}: OrderControlProps) {
	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={__('Order by')}
			value={`${orderBy}/${order}`}
			options={orderByOptions}
			onChange={(value) => {
				const [newOrderBy, newOrder] = value.split('/');
				onChange({ order: newOrder, orderBy: newOrderBy });
			}}
		/>
	);
}

export default OrderControl;
