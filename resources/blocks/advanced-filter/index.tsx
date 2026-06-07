import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    InnerBlocks,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ToggleControl,
    Spinner,
    Placeholder,
} from '@wordpress/components';
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
import metadata from './block.json';

type FilterAttributes = {
    filterType: 'taxonomy' | 'meta' | 'price' | 'date' | 'author' | 'keyword';
    label?: string;
    enabled?: boolean;
    taxonomy?: string;
    displayStyle?: 'buttons' | 'checkboxes' | 'dropdown' | 'select' | undefined;
    listingType?: 'ul' | 'ol' | 'none' | undefined;
    showCount?: boolean;
    showEmptyTerms?: boolean;
    showOnlyTopLevel?: boolean;
    showHierarchy?: boolean;
    multipleSelection?: boolean;
    layout?: 'horizontal' | 'vertical' | 'dropdown' | 'accordion' | 'row' | 'stack' | undefined;
    showLabels?: boolean;
    collapsible?: boolean;
    defaultExpanded?: boolean;
    metaKey?: string;
    inputType?: 'text' | 'number' | 'range' | 'date' | 'date-range' | undefined;
    minValue?: string;
    maxValue?: string;
    placeholder?: string;
    minPrice?: string;
    maxPrice?: string;
    currency?: string;
    dateField?: 'post_date' | 'post_modified';
    dateRange?: boolean;
    showSearchButton?: boolean;
    searchButtonText?: string;
    searchButtonDisplay?: 'text' | 'icon' | 'icon-text';
    searchButtonIcon?: string;
    keywordAction?: 'typing' | 'button';
    filterValue?: string;
    filterValueMin?: string;
    filterValueMax?: string;
    filterValueStart?: string;
    filterValueEnd?: string;
    containerLayout?: 'row' | 'stack';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap?: string;
};

interface EditProps {
    attributes: FilterAttributes;
    setAttributes: (attrs: Partial<FilterAttributes>) => void;
    clientId: string;
}

// Define templates for each filter type
const getFilterTemplate = (filterType: FilterAttributes['filterType']) => {
    switch (filterType) {
        case 'keyword':
            return [
                [
                    'jankx/text-input',
                    {
                        placeholder: __('Search...', 'jankx'),
                        inputType: 'text',
                        className: 'jankx-filter-keyword-input',
                        width: 'auto',
                        inputName: 's',
                    },
                ],
                [
                    'jankx/advanced-button',
                    {
                        text: __('Search', 'jankx'),
                        buttonType: 'submit',
                        triggerType: 'button',
                        className: 'jankx-filter-keyword-button filter-search-button',
                    },
                ],
            ];
        case 'taxonomy':
            return [
                [
                    'core/group',
                    {
                        className: 'jankx-filter-taxonomy-group',
                    },
                    [],
                ],
            ];
        case 'meta':
            return [
                [
                    'jankx/text-input',
                    {
                        placeholder: __('Enter value...', 'jankx'),
                        inputType: 'text',
                        className: 'jankx-filter-meta-input',
                        width: 'auto',
                    },
                ],
            ];
        case 'price':
            return [
                [
                    'jankx/text-input',
                    {
                        placeholder: __('Min price', 'jankx'),
                        inputType: 'number',
                        className: 'jankx-filter-price-min',
                        width: 'auto',
                    },
                ],
                [
                    'jankx/text-input',
                    {
                        placeholder: __('Max price', 'jankx'),
                        inputType: 'number',
                        className: 'jankx-filter-price-max',
                        width: 'auto',
                    },
                ],
            ];
        case 'date':
            return [
                [
                    'jankx/text-input',
                    {
                        inputType: 'date',
                        className: 'jankx-filter-date-start',
                        width: 'auto',
                    },
                ],
                [
                    'jankx/text-input',
                    {
                        inputType: 'date',
                        className: 'jankx-filter-date-end',
                        width: 'auto',
                    },
                ],
            ];
        case 'author':
            return [
                [
                    'core/group',
                    {
                        className: 'jankx-filter-author-group',
                    },
                    [],
                ],
            ];
        default:
            return [];
    }
};

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
        searchButtonText,
        searchButtonDisplay,
        searchButtonIcon,
        keywordAction,
        filterValue,
        filterValueMin,
        filterValueMax,
        filterValueStart,
        filterValueEnd,
        containerLayout,
        justifyContent,
        alignItems,
        gap,
    } = attributes;

    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const hasInitializedInnerBlocks = useRef(false);

    // Kiểm tra parent block và lấy attributes
    const { isSmartTabChild, parentDefaults } = useSelect(
        (select: any) => {
            const { getBlockParents, getBlock } = select('core/block-editor');
            const parents: string[] = getBlockParents(clientId) || [];

            // Tìm parent là smart-tab trước (cho advanced filter trigger)
            let parentId = parents.find((id) => getBlock(id)?.name === 'jankx/smart-tab');
            if (parentId) {
                const parent = getBlock(parentId);
                const attrs = parent?.attributes || {};
                const triggerSettings = (attrs.triggerSettings || {}) as Record<string, unknown>;
                const targetBlockId = triggerSettings.targetBlockId as string | undefined;

                // Tìm dynamic-data-layout block để lấy post type
                let targetPostType = 'post';
                if (targetBlockId) {
                    const allBlocks = select('core/block-editor').getBlocks();
                    const findBlock = (blocks: any[]): any => {
                        for (const block of blocks) {
                            if (block.name === 'jankx/dynamic-data-layout' || block.name === 'jankx/dynamic-ssr-layout') {
                                const queryId = block.attributes?.queryId || block.clientId;
                                if (String(queryId) === targetBlockId) {
                                    return block;
                                }
                            }
                            if (block.innerBlocks?.length > 0) {
                                const found = findBlock(block.innerBlocks);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    const targetBlock = findBlock(allBlocks);
                    if (targetBlock) {
                        targetPostType = targetBlock.attributes?.postType || 'post';
                    }
                }

                return {
                    isSmartTabChild: true,
                    parentDefaults: {
                        targetPostType,
                    },
                };
            }

            // Fallback: tìm parent là advanced-filters
            parentId = parents.find((id) => getBlock(id)?.name === 'jankx/advanced-filters');
            if (parentId) {
                const parent = getBlock(parentId);
                return {
                    isSmartTabChild: false,
                    parentDefaults: parent?.attributes || {},
                };
            }

            return {
                isSmartTabChild: false,
                parentDefaults: {},
            };
        },
        [clientId]
    );

    const resolvedTargetPostType = parentDefaults.targetPostType || 'post';
    const resolvedDisplayStyle = displayStyle || parentDefaults.displayStyle || 'buttons';
    const normalizedDisplayStyle = ['buttons', 'checkboxes'].includes(resolvedDisplayStyle || '') ? resolvedDisplayStyle : 'buttons';
    const resolvedLayout = layout || parentDefaults.layout || 'horizontal';
    const resolvedShowLabels = showLabels ?? parentDefaults.showLabels ?? true;
    const resolvedShowCount = showCount ?? parentDefaults.showCount ?? false;
    const resolvedShowEmptyTerms = showEmptyTerms ?? parentDefaults.showEmptyTerms ?? true;
    const resolvedShowOnlyTopLevel = showOnlyTopLevel ?? parentDefaults.showOnlyTopLevel ?? false;
    const resolvedShowHierarchy = showHierarchy ?? parentDefaults.showHierarchy ?? false;
    const resolvedMultiple = multipleSelection ?? parentDefaults.multipleSelection ?? true;
    const resolvedCollapsible = collapsible ?? parentDefaults.collapsible ?? false;
    const resolvedDefaultExpanded = defaultExpanded ?? parentDefaults.defaultExpanded ?? true;
    const resolvedKeywordAction = keywordAction || 'typing';
    const resolvedSearchButtonText = searchButtonText || __('Search', 'jankx');
    const resolvedSearchButtonDisplay = searchButtonDisplay || 'text';
    const resolvedSearchButtonIcon = searchButtonIcon || '';

    const blockProps = useBlockProps({
        className: `jankx-advanced-filter jankx-advanced-filter--layout-${containerLayout || 'row'}`,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'jankx-advanced-filter__content',
            style: {
                display: 'flex',
                flexDirection: containerLayout === 'stack' ? 'column' : 'row',
                justifyContent: justifyContent,
                alignItems: alignItems,
                gap: gap,
                flexWrap: 'wrap',
            } as React.CSSProperties,
        },
        {
            templateLock: false,
            allowedBlocks: ['jankx/text-input', 'core/group', 'jankx/advanced-button', 'core/heading', 'core/paragraph', 'core/columns', 'core/column', 'jankx/svg-icon'],
        }
    );

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
                // Tìm rest_base của taxonomy
                const taxObject = taxonomies.find((t: any) => t.slug === taxonomy);
                const restBase = taxObject?.rest_base || taxonomy;

                const termsData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/${restBase}?per_page=100&orderby=name&order=asc`,
                });
                setTerms(Array.isArray(termsData) ? termsData : []);
            } catch (e) {
                setTerms([]);
            } finally {
                setLoadingTerms(false);
            }
        })();
    }, [taxonomy, taxonomies]);

    // Fetch authors khi filterType là author
    useEffect(() => {
        if (filterType !== 'author') {
            setAuthors([]);
            return;
        }
        setLoadingAuthors(true);
        (async () => {
            try {
                const usersData = await (window as any).wp.apiFetch({
                    path: '/wp/v2/users?per_page=100&orderby=name&order=asc',
                });
                setAuthors(Array.isArray(usersData) ? usersData : []);
            } catch (e) {
                setAuthors([]);
            } finally {
                setLoadingAuthors(false);
            }
        })();
    }, [filterType]);

    // Auto-insert inner blocks when filterType changes
    useEffect(() => {
        if (!filterType) return;

        // Get current inner blocks
        const { getBlock } = select('core/block-editor');
        const block = getBlock(clientId);
        if (!block) return;

        const currentInnerBlocks = block.innerBlocks || [];

        // Only insert blocks if:
        // 1. This is the first initialization (no inner blocks yet)
        // 2. Or the filter type has changed and we want to update the template
        // For now, we'll only insert on first initialization to avoid overwriting user changes
        if (currentInnerBlocks.length === 0 && !hasInitializedInnerBlocks.current) {
            const template = getFilterTemplate(filterType);
            if (template.length > 0) {
                const { replaceInnerBlocks } = dispatch('core/block-editor') as any;
                // Create blocks from template
                const { createBlock } = (window as any).wp.blocks;
                const newBlocks = template.map((templateBlock) => {
                    const [blockName, blockAttributes, innerBlocks] = templateBlock;
                    return createBlock(blockName, blockAttributes, innerBlocks);
                });

                replaceInnerBlocks(clientId, newBlocks, false);
                hasInitializedInnerBlocks.current = true;
            }
        }
    }, [filterType, clientId]);

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

                    <ToggleControl
                        label={__('Hide Label', 'jankx')}
                        checked={!resolvedShowLabels}
                        onChange={(value) => setAttributes({ showLabels: !value })}
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

                            {/* Ẩn display settings khi parent là smart-tab */}
                            {!isSmartTabChild && (
                                <>
                                    <SelectControl
                                        label={__('Display Style', 'jankx')}
                                        value={normalizedDisplayStyle}
                                        options={[
                                            { label: __('Buttons', 'jankx'), value: 'buttons' },
                                            { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                        ]}
                                        onChange={(value) => setAttributes({ displayStyle: value as FilterAttributes['displayStyle'] })}
                                    />

                                    {normalizedDisplayStyle === 'checkboxes' && (
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
                                </>
                            )}

                            {/* Hiển thị UI chọn term khi parent là smart-tab */}
                            {isSmartTabChild && taxonomy && (
                                <SelectControl
                                    label={__('Select Term', 'jankx')}
                                    value={filterValue || 'all'}
                                    options={[
                                        { label: __('Tất cả', 'jankx'), value: 'all' },
                                        ...(loadingTerms ? [] : terms.map((term: any) => ({
                                            label: `${term.name}${term.count !== undefined ? ` (${term.count})` : ''}`,
                                            value: String(term.id),
                                        }))),
                                    ]}
                                    onChange={(value) => setAttributes({ filterValue: value === 'all' ? '' : value })}
                                    help={__('Chọn "Tất cả" để hiển thị tất cả data, hoặc chọn term cụ thể để filter', 'jankx')}
                                />
                            )}

                            {!isSmartTabChild && (
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
                            )}
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

                            {!isSmartTabChild && (
                                <>
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

                            {/* Hiển thị UI nhập meta value khi parent là smart-tab */}
                            {isSmartTabChild && metaKey && (
                                <TextControl
                                    label={__('Meta Value', 'jankx')}
                                    value={filterValue || ''}
                                    onChange={(value) => setAttributes({ filterValue: value })}
                                    placeholder={__('Nhập giá trị meta để filter', 'jankx')}
                                    help={__('Giá trị meta để filter khi tab được click', 'jankx')}
                                />
                            )}
                        </>
                    )}

                    {filterType === 'price' && (
                        <>
                            {!isSmartTabChild && (
                                <TextControl
                                    label={__('Currency Symbol', 'jankx')}
                                    value={currency || 'VND'}
                                    onChange={(value) => setAttributes({ currency: value })}
                                />
                            )}

                            {/* Hiển thị UI nhập price range khi parent là smart-tab */}
                            {isSmartTabChild ? (
                                <>
                                    <TextControl
                                        label={__('Min Price', 'jankx')}
                                        value={filterValueMin || ''}
                                        onChange={(value) => setAttributes({ filterValueMin: value })}
                                        type="number"
                                        placeholder={__('Giá tối thiểu', 'jankx')}
                                    />
                                    <TextControl
                                        label={__('Max Price', 'jankx')}
                                        value={filterValueMax || ''}
                                        onChange={(value) => setAttributes({ filterValueMax: value })}
                                        type="number"
                                        placeholder={__('Giá tối đa', 'jankx')}
                                    />
                                </>
                            ) : (
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
                                </>
                            )}
                        </>
                    )}

                    {filterType === 'date' && (
                        <>
                            {!isSmartTabChild && (
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

                            {/* Hiển thị UI chọn date range khi parent là smart-tab */}
                            {isSmartTabChild && (
                                <>
                                    <TextControl
                                        label={__('Start Date', 'jankx')}
                                        type="date"
                                        value={filterValueStart || ''}
                                        onChange={(value) => setAttributes({ filterValueStart: value })}
                                        help={__('Ngày bắt đầu để filter', 'jankx')}
                                    />
                                    <TextControl
                                        label={__('End Date', 'jankx')}
                                        type="date"
                                        value={filterValueEnd || ''}
                                        onChange={(value) => setAttributes({ filterValueEnd: value })}
                                        help={__('Ngày kết thúc để filter', 'jankx')}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {filterType === 'author' && (
                        <>
                            {!isSmartTabChild && (
                                <>
                                    <SelectControl
                                        label={__('Display Style', 'jankx')}
                                        value={normalizedDisplayStyle}
                                        options={[
                                            { label: __('Buttons', 'jankx'), value: 'buttons' },
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

                            {/* Hiển thị UI chọn author khi parent là smart-tab */}
                            {isSmartTabChild && (
                                <SelectControl
                                    label={__('Select Author', 'jankx')}
                                    value={filterValue || ''}
                                    options={[
                                        { label: loadingAuthors ? __('Loading...', 'jankx') : __('-- Select Author --', 'jankx'), value: '' },
                                        ...authors.map((author: any) => ({
                                            label: author.name,
                                            value: String(author.id),
                                        })),
                                    ]}
                                    onChange={(value) => setAttributes({ filterValue: value })}
                                    help={__('Chọn author để filter khi tab được click', 'jankx')}
                                />
                            )}
                        </>
                    )}

                    {filterType === 'keyword' && (
                        <>
                            {!isSmartTabChild && (
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
                                    {showSearchButton ? (
                                        <SelectControl
                                            label={__('Search Action', 'jankx')}
                                            value={resolvedKeywordAction}
                                            options={[
                                                { label: __('Filter while typing', 'jankx'), value: 'typing' },
                                                { label: __('Only when clicking Search', 'jankx'), value: 'button' },
                                            ]}
                                            onChange={(value) => setAttributes({ keywordAction: value as 'typing' | 'button' })}
                                            help={__('Chọn cách kích hoạt filter cho ô tìm kiếm', 'jankx')}
                                        />
                                    ) : null}
                                    {showSearchButton ? (
                                        <TextControl
                                            label={__('Search Button Text', 'jankx')}
                                            value={resolvedSearchButtonText}
                                            onChange={(value) => setAttributes({ searchButtonText: value })}
                                            placeholder={__('Search', 'jankx')}
                                        />
                                    ) : null}
                                    {showSearchButton ? (
                                        <SelectControl
                                            label={__('Search Button Display', 'jankx')}
                                            value={resolvedSearchButtonDisplay}
                                            options={[
                                                { label: __('Text only', 'jankx'), value: 'text' },
                                                { label: __('SVG/Icon only', 'jankx'), value: 'icon' },
                                                { label: __('Icon + Text', 'jankx'), value: 'icon-text' },
                                            ]}
                                            onChange={(value) => setAttributes({ searchButtonDisplay: value as 'text' | 'icon' | 'icon-text' })}
                                            help={__('Chọn hiển thị nút: chỉ text, chỉ icon, hoặc icon + text', 'jankx')}
                                        />
                                    ) : null}
                                    {showSearchButton && resolvedSearchButtonDisplay !== 'text' ? (
                                        <TextControl
                                            label={__('Search Button Icon (SVG/HTML)', 'jankx')}
                                            value={resolvedSearchButtonIcon}
                                            onChange={(value) => setAttributes({ searchButtonIcon: value })}
                                            placeholder={'<svg>...</svg>'}
                                            help={__('Dán SVG hoặc HTML icon. Sử dụng cẩn thận.', 'jankx')}
                                        />
                                    ) : null}
                                </>
                            )}

                            {/* Hiển thị UI nhập keyword khi parent là smart-tab */}
                            {isSmartTabChild && (
                                <TextControl
                                    label={__('Search Keyword', 'jankx')}
                                    value={filterValue || ''}
                                    onChange={(value) => setAttributes({ filterValue: value })}
                                    placeholder={__('Nhập từ khóa để filter', 'jankx')}
                                    help={__('Từ khóa để filter khi tab được click', 'jankx')}
                                />
                            )}
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout Type', 'jankx')}
                        value={containerLayout || 'row'}
                        options={[
                            { label: __('Row (Horizontal)', 'jankx'), value: 'row' },
                            { label: __('Stack (Vertical)', 'jankx'), value: 'stack' },
                        ]}
                        onChange={(value) => setAttributes({ containerLayout: value as 'row' | 'stack' })}
                    />
                    <SelectControl
                        label={__('Justify Content', 'jankx')}
                        value={justifyContent || 'flex-start'}
                        options={[
                            { label: __('Flex Start', 'jankx'), value: 'flex-start' },
                            { label: __('Center', 'jankx'), value: 'center' },
                            { label: __('Flex End', 'jankx'), value: 'flex-end' },
                            { label: __('Space Between', 'jankx'), value: 'space-between' },
                            { label: __('Space Around', 'jankx'), value: 'space-around' },
                        ]}
                        onChange={(value) => setAttributes({ justifyContent: value })}
                    />
                    <SelectControl
                        label={__('Align Items', 'jankx')}
                        value={alignItems || 'center'}
                        options={[
                            { label: __('Flex Start', 'jankx'), value: 'flex-start' },
                            { label: __('Center', 'jankx'), value: 'center' },
                            { label: __('Flex End', 'jankx'), value: 'flex-end' },
                            { label: __('Stretch', 'jankx'), value: 'stretch' },
                        ]}
                        onChange={(value) => setAttributes({ alignItems: value })}
                    />
                    <TextControl
                        label={__('Gap', 'jankx')}
                        value={gap || '1rem'}
                        onChange={(value) => setAttributes({ gap: value })}
                    />
                </PanelBody>

            </InspectorControls>

            <div {...blockProps}>
                {resolvedShowLabels && (
                    <strong className="jankx-advanced-filter__label">{filterTitle}</strong>
                )}
                <div {...innerBlocksProps} />
                {/* Debug info - can be removed in production */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '8px', opacity: 0.7 }}>
                        <div>{__('Type', 'jankx')}: {filterType}</div>
                        {taxonomy && <div>{__('Taxonomy', 'jankx')}: {taxonomy}</div>}
                        {label && <div>{__('Label', 'jankx')}: {label}</div>}
                    </div>
                )}
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => <InnerBlocks.Content />,
} as any);


