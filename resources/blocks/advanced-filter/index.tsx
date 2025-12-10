import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Spinner,
    Placeholder,
} from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';

type FilterAttributes = {
    filterType: 'taxonomy' | 'meta' | 'price' | 'date' | 'author' | 'keyword';
    label?: string;
    enabled?: boolean;
    taxonomy?: string;
    displayStyle?: 'buttons' | 'checkboxes' | 'dropdown' | 'select';
    listingType?: 'ul' | 'ol' | 'none';
    showCount?: boolean;
    showEmptyTerms?: boolean;
    showOnlyTopLevel?: boolean;
    showHierarchy?: boolean;
    multipleSelection?: boolean;
    layout?: 'horizontal' | 'vertical' | 'dropdown' | 'accordion';
    showLabels?: boolean;
    collapsible?: boolean;
    defaultExpanded?: boolean;
    metaKey?: string;
    inputType?: 'text' | 'number' | 'range' | 'date' | 'date-range';
    minValue?: string;
    maxValue?: string;
    placeholder?: string;
    minPrice?: string;
    maxPrice?: string;
    currency?: string;
    dateField?: string;
    dateRange?: boolean;
    showSearchButton?: boolean;
};

interface EditProps {
    attributes: FilterAttributes;
    setAttributes: (attrs: Partial<FilterAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        filterType,
        label,
        enabled,
        taxonomy,
        displayStyle,
        listingType,
        showCount,
        showEmptyTerms,
        showOnlyTopLevel,
        showHierarchy,
        multipleSelection,
        layout,
        showLabels,
        collapsible,
        defaultExpanded,
        metaKey,
        inputType,
        minValue,
        maxValue,
        placeholder,
        minPrice,
        maxPrice,
        currency,
        dateField,
        dateRange,
        showSearchButton,
    } = attributes;

    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);

    // Lấy attributes của block cha để làm fallback (giữ trải nghiệm cũ)
    const parentDefaults = useSelect(
        (select: any) => {
            const { getBlockParents, getBlock } = select('core/block-editor');
            const parents: string[] = getBlockParents(clientId) || [];
            const parentId = parents.find((id) => getBlock(id)?.name === 'jankx/advanced-filters');
            if (!parentId) return {};
            const parent = getBlock(parentId);
            return parent?.attributes || {};
        },
        [clientId]
    ) as Record<string, any>;

    const resolvedTargetPostType = parentDefaults.targetPostType || 'post';
    const resolvedDisplayStyle = displayStyle || parentDefaults.displayStyle || 'buttons';
    const resolvedLayout = layout || parentDefaults.layout || 'horizontal';
    const resolvedShowLabels = showLabels ?? parentDefaults.showLabels ?? true;
    const resolvedShowCount = showCount ?? parentDefaults.showCount ?? false;
    const resolvedShowEmptyTerms = showEmptyTerms ?? parentDefaults.showEmptyTerms ?? true;
    const resolvedShowOnlyTopLevel = showOnlyTopLevel ?? parentDefaults.showOnlyTopLevel ?? false;
    const resolvedShowHierarchy = showHierarchy ?? parentDefaults.showHierarchy ?? false;
    const resolvedMultiple = multipleSelection ?? parentDefaults.multipleSelection ?? true;
    const resolvedCollapsible = collapsible ?? parentDefaults.collapsible ?? false;
    const resolvedDefaultExpanded = defaultExpanded ?? parentDefaults.defaultExpanded ?? true;

    const blockProps = useBlockProps({
        className: 'jankx-advanced-filter',
    });

    const filterTitle = useMemo(() => {
        const typeLabel = filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'Filter';
        return label || `${__('Filter', 'jankx')} (${typeLabel})`;
    }, [label, filterType]);

    // Fetch taxonomies theo post type từ parent
    useEffect(() => {
        if (!resolvedTargetPostType) return;
        setLoadingTaxonomies(true);
        (async () => {
            try {
                const taxData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${resolvedTargetPostType}`,
                });
                const list = Object.values(taxData || {});
                setTaxonomies(list);
            } catch (e) {
                setTaxonomies([]);
            } finally {
                setLoadingTaxonomies(false);
            }
        })();
    }, [resolvedTargetPostType]);

    // Fetch terms theo taxonomy đã chọn (preview cho editor)
    useEffect(() => {
        if (!taxonomy) {
            setTerms([]);
            return;
        }
        setLoadingTerms(true);
        (async () => {
            try {
                const termsData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/${taxonomy}?per_page=20`,
                });
                setTerms(Array.isArray(termsData) ? termsData : []);
            } catch (e) {
                setTerms([]);
            } finally {
                setLoadingTerms(false);
            }
        })();
    }, [taxonomy]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Filter', 'jankx')} initialOpen={true}>
                    <p style={{ marginBottom: '8px', fontSize: '12px', color: '#555' }}>
                        {__('Post type kế thừa từ Advanced Filters:', 'jankx')} <strong>{resolvedTargetPostType}</strong>
                    </p>
                    <SelectControl
                        label={__('Filter Type', 'jankx')}
                        value={filterType}
                        options={[
                            { label: __('Taxonomy', 'jankx'), value: 'taxonomy' },
                            { label: __('Meta Field', 'jankx'), value: 'meta' },
                            { label: __('Price', 'jankx'), value: 'price' },
                            { label: __('Date', 'jankx'), value: 'date' },
                            { label: __('Author', 'jankx'), value: 'author' },
                            { label: __('Keyword', 'jankx'), value: 'keyword' },
                        ]}
                        onChange={(value) => setAttributes({ filterType: value as FilterAttributes['filterType'] })}
                    />

                    <TextControl
                        label={__('Label (Optional)', 'jankx')}
                        value={label || ''}
                        onChange={(value) => setAttributes({ label: value })}
                        placeholder={__('Custom label for this filter', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Enabled', 'jankx')}
                        checked={enabled !== false}
                        onChange={(value) => setAttributes({ enabled: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Filter Settings', 'jankx')} initialOpen={true}>
                    {filterType === 'taxonomy' && (
                        <>
                            <SelectControl
                                label={__('Taxonomy', 'jankx')}
                                value={taxonomy || ''}
                                options={[
                                    { label: loadingTaxonomies ? __('Loading...', 'jankx') : __('-- Select --', 'jankx'), value: '' },
                                    ...taxonomies.map((tax: any) => ({
                                        label: tax.name,
                                        value: tax.slug,
                                    })),
                                ]}
                                onChange={(value) => setAttributes({ taxonomy: value })}
                                help={__('Taxonomy lấy theo post type của block cha', 'jankx')}
                            />

                            <SelectControl
                                label={__('Display Style', 'jankx')}
                                value={resolvedDisplayStyle}
                                options={[
                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                    { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                    { label: __('Select', 'jankx'), value: 'select' },
                                ]}
                                onChange={(value) => setAttributes({ displayStyle: value as FilterAttributes['displayStyle'] })}
                            />

                            {resolvedDisplayStyle === 'checkboxes' && (
                                <SelectControl
                                    label={__('Listing Type', 'jankx')}
                                    value={listingType || 'ul'}
                                    options={[
                                        { label: __('Unordered List (•)', 'jankx'), value: 'ul' },
                                        { label: __('Ordered List (1, 2, 3)', 'jankx'), value: 'ol' },
                                        { label: __('No List', 'jankx'), value: 'none' },
                                    ]}
                                    onChange={(value) => setAttributes({ listingType: value as FilterAttributes['listingType'] })}
                                />
                            )}

                            <ToggleControl
                                label={__('Show Post Counts', 'jankx')}
                                checked={resolvedShowCount}
                                onChange={(value) => setAttributes({ showCount: value })}
                            />

                            <ToggleControl
                                label={__('Show Empty Terms', 'jankx')}
                                checked={resolvedShowEmptyTerms}
                                onChange={(value) => setAttributes({ showEmptyTerms: value })}
                            />

                            <ToggleControl
                                label={__('Show Only Top Level Terms', 'jankx')}
                                checked={resolvedShowOnlyTopLevel}
                                onChange={(value) => setAttributes({ showOnlyTopLevel: value })}
                            />

                            <ToggleControl
                                label={__('Show Hierarchy', 'jankx')}
                                checked={resolvedShowHierarchy}
                                onChange={(value) => setAttributes({ showHierarchy: value })}
                            />

                            <ToggleControl
                                label={__('Multiple Selection', 'jankx')}
                                checked={resolvedMultiple}
                                onChange={(value) => setAttributes({ multipleSelection: value })}
                            />

                            <div style={{ marginTop: '10px' }}>
                                <strong style={{ display: 'block', marginBottom: '6px' }}>
                                    {__('Preview terms', 'jankx')}
                                </strong>
                                {loadingTerms ? (
                                    <Spinner />
                                ) : terms.length === 0 ? (
                                    <Placeholder>{__('No terms found', 'jankx')}</Placeholder>
                                ) : (
                                    <ul style={{ maxHeight: '120px', overflow: 'auto', paddingLeft: '16px' }}>
                                        {terms.map((term: any) => (
                                            <li key={term.id}>
                                                {term.name} {term.count !== undefined ? `(${term.count})` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}

                    {filterType === 'meta' && (
                        <>
                            <TextControl
                                label={__('Meta Key', 'jankx')}
                                value={metaKey || ''}
                                onChange={(value) => setAttributes({ metaKey: value })}
                                placeholder={__('e.g., _price, custom_field', 'jankx')}
                            />

                            <SelectControl
                                label={__('Input Type', 'jankx')}
                                value={inputType || 'text'}
                                options={[
                                    { label: __('Text', 'jankx'), value: 'text' },
                                    { label: __('Number', 'jankx'), value: 'number' },
                                    { label: __('Number Range', 'jankx'), value: 'range' },
                                    { label: __('Date', 'jankx'), value: 'date' },
                                    { label: __('Date Range', 'jankx'), value: 'date-range' },
                                ]}
                                onChange={(value) => setAttributes({ inputType: value as FilterAttributes['inputType'] })}
                            />

                            {inputType === 'range' && (
                                <>
                                    <TextControl
                                        label={__('Min Value', 'jankx')}
                                        value={minValue || ''}
                                        onChange={(value) => setAttributes({ minValue: value })}
                                        type="number"
                                    />
                                    <TextControl
                                        label={__('Max Value', 'jankx')}
                                        value={maxValue || ''}
                                        onChange={(value) => setAttributes({ maxValue: value })}
                                        type="number"
                                    />
                                </>
                            )}

                            <TextControl
                                label={__('Placeholder', 'jankx')}
                                value={placeholder || ''}
                                onChange={(value) => setAttributes({ placeholder: value })}
                            />
                        </>
                    )}

                    {filterType === 'price' && (
                        <>
                            <TextControl
                                label={__('Min Price', 'jankx')}
                                value={minPrice || ''}
                                onChange={(value) => setAttributes({ minPrice: value })}
                                type="number"
                            />
                            <TextControl
                                label={__('Max Price', 'jankx')}
                                value={maxPrice || ''}
                                onChange={(value) => setAttributes({ maxPrice: value })}
                                type="number"
                            />
                            <TextControl
                                label={__('Currency Symbol', 'jankx')}
                                value={currency || 'VND'}
                                onChange={(value) => setAttributes({ currency: value })}
                            />
                        </>
                    )}

                    {filterType === 'date' && (
                        <>
                            <SelectControl
                                label={__('Date Field', 'jankx')}
                                value={dateField || 'post_date'}
                                options={[
                                    { label: __('Post Date', 'jankx'), value: 'post_date' },
                                    { label: __('Modified Date', 'jankx'), value: 'post_modified' },
                                ]}
                                onChange={(value) => setAttributes({ dateField: value })}
                            />
                            <ToggleControl
                                label={__('Date Range', 'jankx')}
                                checked={dateRange !== undefined ? dateRange : true}
                                onChange={(value) => setAttributes({ dateRange: value })}
                                help={__('Allow users to select a date range', 'jankx')}
                            />
                        </>
                    )}

                    {filterType === 'author' && (
                        <>
                            <SelectControl
                                label={__('Display Style', 'jankx')}
                                value={resolvedDisplayStyle}
                                options={[
                                    { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                ]}
                                onChange={(value) => setAttributes({ displayStyle: value as FilterAttributes['displayStyle'] })}
                            />
                            <ToggleControl
                                label={__('Multiple Selection', 'jankx')}
                                checked={resolvedMultiple}
                                onChange={(value) => setAttributes({ multipleSelection: value })}
                                help={__('Allow users to select multiple authors', 'jankx')}
                            />
                        </>
                    )}

                    {filterType === 'keyword' && (
                        <>
                            <TextControl
                                label={__('Placeholder', 'jankx')}
                                value={placeholder || __('Search...', 'jankx')}
                                onChange={(value) => setAttributes({ placeholder: value })}
                            />
                            <ToggleControl
                                label={__('Show Search Button', 'jankx')}
                                checked={showSearchButton !== undefined ? showSearchButton : false}
                                onChange={(value) => setAttributes({ showSearchButton: value })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={resolvedLayout}
                        options={[
                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                            { label: __('Vertical', 'jankx'), value: 'vertical' },
                            { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                            { label: __('Accordion', 'jankx'), value: 'accordion' },
                        ]}
                        onChange={(value) => setAttributes({ layout: value as FilterAttributes['layout'] })}
                    />

                    <ToggleControl
                        label={__('Show Labels', 'jankx')}
                        checked={resolvedShowLabels}
                        onChange={(value) => setAttributes({ showLabels: value })}
                    />

                    <ToggleControl
                        label={__('Collapsible', 'jankx')}
                        checked={resolvedCollapsible}
                        onChange={(value) => setAttributes({ collapsible: value })}
                        help={__('Make filter collapsible', 'jankx')}
                    />

                    {resolvedCollapsible && (
                        <ToggleControl
                            label={__('Default Expanded', 'jankx')}
                            checked={resolvedDefaultExpanded}
                            onChange={(value) => setAttributes({ defaultExpanded: value })}
                            help={__('Show filter expanded by default', 'jankx')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <strong>{filterTitle}</strong>
                <div style={{ fontSize: '12px', color: '#555' }}>
                    <div>{__('Type', 'jankx')}: {filterType}</div>
                    {taxonomy && <div>{__('Taxonomy', 'jankx')}: {taxonomy}</div>}
                    {label && <div>{__('Label', 'jankx')}: {label}</div>}
                </div>
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null,
} as any);


