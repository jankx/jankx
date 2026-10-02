import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
	Button,
	Placeholder,
} from '@wordpress/components';
import metadata from './block.json';
import './editor.scss';

interface OrderByOption {
	value: string;
	label: string;
	postType?: string | null;
	metaKey?: string;
}

interface OrderOption {
	value: 'ASC' | 'DESC';
	label: string;
}

interface MetaTypeOption {
	value: string;
	label: string;
}

interface QueryOptions {
	orderBy?: OrderByOption[];
	order?: OrderOption[];
	metaTypes?: MetaTypeOption[];
}

interface WordPressWindow {
	jankxQueryOptions?: QueryOptions;
}

declare global {
	interface Window extends WordPressWindow {}
}

interface SortRule {
	orderBy: string;
	order: 'ASC' | 'DESC';
	metaKey: string;
	metaType: string;
}

interface SortRulesAttributes {
	enabled: boolean;
	rules: SortRule[];
}

const FALLBACK_ORDER_BY: OrderByOption[] = [
	{ value: 'date', label: __('Date', 'jankx') },
	{ value: 'modified', label: __('Modified Date', 'jankx') },
	{ value: 'title', label: __('Title', 'jankx') },
	{ value: 'name', label: __('Slug', 'jankx') },
	{ value: 'author', label: __('Author', 'jankx') },
	{ value: 'type', label: __('Type (Post Type)', 'jankx') },
	{ value: 'ID', label: __('ID', 'jankx') },
	{ value: 'menu_order', label: __('Menu Order', 'jankx') },
	{ value: 'rand', label: __('Random', 'jankx') },
	{ value: 'comment_count', label: __('Comment Count', 'jankx') },
	{ value: 'meta_value', label: __('Meta Value', 'jankx') },
	{ value: 'meta_value_num', label: __('Meta Value Numeric', 'jankx') },
];

const FALLBACK_ORDER: OrderOption[] = [
	{ value: 'DESC', label: __('Descending', 'jankx') },
	{ value: 'ASC', label: __('Ascending', 'jankx') },
];

const FALLBACK_META_TYPES: MetaTypeOption[] = [
	{ value: '', label: __('-- Auto --', 'jankx') },
	{ value: 'NUMERIC', label: 'NUMERIC' },
];

const META_ORDER_BY = ['meta_value', 'meta_value_num'];

const isMetaOrderBy = (orderBy: string): boolean =>
	META_ORDER_BY.indexOf(orderBy) !== -1;

const normalizeOrderByOptions = (raw: unknown): OrderByOption[] => {
	if (!Array.isArray(raw)) {
		return FALLBACK_ORDER_BY;
	}

	const normalized = (raw as Array<Record<string, unknown>>)
		.map((item) => {
			const value = typeof item?.value === 'string' ? item.value : '';
			const label = typeof item?.label === 'string' ? item.label : '';
			const postType =
				typeof item?.postType === 'string' ? item.postType : null;
			const metaKey =
				typeof item?.metaKey === 'string' ? item.metaKey : undefined;
			return { value, label, postType, metaKey };
		})
		.filter((item) => item.value.length > 0 && item.label.length > 0);

	return normalized.length > 0 ? normalized : FALLBACK_ORDER_BY;
};

const normalizeOrderOptions = (raw: unknown): OrderOption[] => {
	if (!Array.isArray(raw)) {
		return FALLBACK_ORDER;
	}

	const normalized = (raw as Array<Record<string, unknown>>)
		.map((item) => {
			const value =
				item?.value === 'ASC' || item?.value === 'DESC'
					? item.value
					: null;
			const label = typeof item?.label === 'string' ? item.label : '';
			return value ? { value, label } : null;
		})
		.filter((item): item is OrderOption => !!item && item.label.length > 0);

	return normalized.length > 0 ? normalized : FALLBACK_ORDER;
};

const createRule = (): SortRule => ({
	orderBy: 'date',
	order: 'DESC',
	metaKey: '',
	metaType: '',
});

const normalizeRule = (raw: unknown): SortRule => {
	const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<
		string,
		unknown
	>;

	const orderBy = typeof obj.orderBy === 'string' ? obj.orderBy : '';
	const order = obj.order === 'ASC' ? 'ASC' : 'DESC';

	return {
		orderBy: orderBy.length > 0 ? orderBy : 'date',
		order,
		metaKey: typeof obj.metaKey === 'string' ? obj.metaKey : '',
		metaType: typeof obj.metaType === 'string' ? obj.metaType : '',
	};
};

const describeRule = (
	rule: SortRule,
	orderByOptions: OrderByOption[],
	orderOptions: OrderOption[]
): string => {
	const label =
		orderByOptions.find((option) => option.value === rule.orderBy)?.label ||
		rule.orderBy;
	const dir =
		orderOptions.find((option) => option.value === rule.order)?.label || '';

	return dir ? `${label} · ${dir}` : label;
};

export default function Edit({
	attributes,
	setAttributes,
}: {
	attributes: SortRulesAttributes;
	setAttributes: (attrs: Partial<SortRulesAttributes>) => void;
}): JSX.Element {
	const { enabled = false, rules = [] } = attributes;

	const blockProps = useBlockProps();

	const orderByOptions = normalizeOrderByOptions(
		window.jankxQueryOptions?.orderBy
	);
	const orderOptions = normalizeOrderOptions(window.jankxQueryOptions?.order);
	const metaTypeOptions =
		window.jankxQueryOptions?.metaTypes || FALLBACK_META_TYPES;

	const normalizedRules: SortRule[] = rules.map(normalizeRule);

	const setRules = (nextRules: SortRule[]) => {
		setAttributes({ rules: nextRules });
	};

	const updateRule = (index: number, patch: Partial<SortRule>) => {
		const nextRules = [...normalizedRules];
		nextRules[index] = { ...nextRules[index], ...patch };
		setRules(nextRules);
	};

	const addRule = () => {
		setRules([...normalizedRules, createRule()]);
	};

	const removeRule = (index: number) => {
		const nextRules = normalizedRules.filter(
			(_rule, i) => i !== index
		);
		setRules(nextRules);
	};

	const moveRule = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= normalizedRules.length) {
			return;
		}
		const nextRules = [...normalizedRules];
		const [moved] = nextRules.splice(index, 1);
		nextRules.splice(target, 0, moved);
		setRules(nextRules);
	};

	const renderRulePanel = (rule: SortRule, index: number) => (
		<PanelBody
			key={index}
			title={__(
				`Rule ${index + 1}: ${describeRule(
					rule,
					orderByOptions,
					orderOptions
				)}`,
				'jankx'
			)}
			initialOpen={false}
		>
			<SelectControl
				label={__('Order By', 'jankx')}
				value={rule.orderBy}
				options={orderByOptions}
				onChange={(value) => {
					const selected = orderByOptions.find(
						(option) => option.value === value
					);
					const patch: Partial<SortRule> = { orderBy: value };

					if (selected?.metaKey) {
						patch.metaKey = selected.metaKey;
					}

					updateRule(index, patch);
				}}
				help={__('Sort posts by which criteria', 'jankx')}
			/>
			<SelectControl
				label={__('Order', 'jankx')}
				value={rule.order}
				options={orderOptions}
				onChange={(value) =>
					updateRule(index, { order: value as 'ASC' | 'DESC' })
				}
			/>
			{isMetaOrderBy(rule.orderBy) ? (
				<>
					<TextControl
						label={__('Meta Key', 'jankx')}
						value={rule.metaKey}
						onChange={(value) =>
							updateRule(index, { metaKey: value })
						}
						help={__(
							'Meta key for sorting (required when using meta_value)',
							'jankx'
						)}
						placeholder={__('Example: price, views, rating', 'jankx')}
					/>
					{rule.orderBy === 'meta_value' ? (
						<SelectControl
							label={__('Meta Type', 'jankx')}
							value={rule.metaType}
							options={metaTypeOptions}
							onChange={(value) =>
								updateRule(index, { metaType: value })
							}
							help={__(
								'Specify data type for accurate sorting',
								'jankx'
							)}
						/>
					) : null}
				</>
			) : null}
			<div
				style={{
					display: 'flex',
					gap: '8px',
					marginTop: '12px',
				}}
			>
				<Button
					variant="tertiary"
					disabled={index === 0}
					onClick={() => moveRule(index, -1)}
					label={__('Move up', 'jankx')}
					text={__('Up', 'jankx')}
				/>
				<Button
					variant="tertiary"
					disabled={index === normalizedRules.length - 1}
					onClick={() => moveRule(index, 1)}
					label={__('Move down', 'jankx')}
					text={__('Down', 'jankx')}
				/>
				<Button
					variant="tertiary"
					isDestructive
					onClick={() => removeRule(index)}
					label={__('Remove rule', 'jankx')}
					text={__('Remove', 'jankx')}
				/>
			</div>
		</PanelBody>
	);

	return (
		<>
			<BlockControls>
				<Button
					variant="tertiary"
					onClick={() => setAttributes({ enabled: !enabled })}
					label={
						enabled
							? __('Disable sort rules', 'jankx')
							: __('Enable sort rules', 'jankx')
					}
					text={
						enabled
							? __('Sort rules on', 'jankx')
							: __('Sort rules off', 'jankx')
					}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Sort Rules', 'jankx')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Enable custom sort rules', 'jankx')}
						help={__(
							'When enabled these rules replace the Order setting in Query Settings. Rules are applied from top to bottom.',
							'jankx'
						)}
						checked={enabled}
						onChange={(value) => setAttributes({ enabled: value })}
					/>
					{enabled ? (
						<>
							{normalizedRules.map((rule, index) =>
								renderRulePanel(rule, index)
							)}
							<Button
								variant="secondary"
								onClick={addRule}
								label={__('Add sort rule', 'jankx')}
								text={__('Add rule', 'jankx')}
							/>
						</>
					) : null}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Placeholder
					icon={metadata.icon as string}
					label={__('Sort Rules', 'jankx')}
					instructions={
						enabled
							? __(
									`${normalizedRules.length} rule(s) will be applied, highest priority first.`,
									'jankx'
							  )
							: __(
									'Add sort rules in the block settings to control the query order.',
									'jankx'
							  )
					}
				/>
			</div>
		</>
	);
}