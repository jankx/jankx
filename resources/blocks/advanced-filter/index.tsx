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
import { useSelect, dispatch, select } from '@wordpress/data';
import metadata from './block.json';

type FilterAttributes = {
    filterType: 'taxonomy' | 'meta' | 'price' | 'date' | 'author' | 'keyword';
    label?: string;
    enabled?: boolean;
    taxonomy?: string;
    displayStyle?: 'buttons' | 'checkboxes' | 'dropdown' | 'select' | 'tabs' | undefined;
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
    width?: 'full' | 'fit';
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
        searchButtonText,
        searchButtonDisplay,
        searchButtonIcon,
        keywordAction,
        filterValue,
        filterValueMin,
        filterValueMax,
        filterValueStart,
        filterValueEnd,
        width,
    } = attributes;

    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);
    const [loadingAuthors, setLoadingAuthors] = useState(false);

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

            // Kiểm tra nếu nằm trực tiếp trong smart-tabs (không qua smart-tab)
            parentId = parents.find((id) => getBlock(id)?.name === 'jankx/smart-tabs');
            if (parentId) {
                return {
                    isSmartTabChild: true,
                    parentDefaults: {},
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
    const resolvedLayout = layout || parentDefaults.layout || 'row';
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
        className: `jankx-advanced-filter jankx-advanced-filter--layout-${resolvedLayout} jankx-advanced-filter--width-${width || 'full'}`,
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


    // Khi nằm trong smart-tab, không render inspector controls — smart-tab xử lý tất cả
    if (isSmartTabChild) {
        return (
            <div {...blockProps}>
                <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                    [{filterType}{taxonomy ? `: ${taxonomy}` : ''}]
                </span>
            </div>
        );
    }

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

                            <SelectControl
                                label={__('Display Style', 'jankx')}
                                value={normalizedDisplayStyle}
                                options={[
                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                    { label: __('Tabs', 'jankx'), value: 'tabs' },
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
                                label={__('Currency Symbol', 'jankx')}
                                value={currency || 'VND'}
                                onChange={(value) => setAttributes({ currency: value })}
                            />

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
                                value={normalizedDisplayStyle}
                                options={[
                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                    { label: __('Tabs', 'jankx'), value: 'tabs' },
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
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Width', 'jankx')}
                        value={(attributes as any).width || 'full'}
                        options={[
                            { label: __('Full Width', 'jankx'), value: 'full' },
                            { label: __('Fit Content', 'jankx'), value: 'fit' },
                        ]}
                        onChange={(value) => setAttributes({ width: value as 'full' | 'fit' })}
                        help={__('Choose how the filter should display: full width or fit to content.', 'jankx')}
                    />
                </PanelBody>

            </InspectorControls>

            <div {...blockProps}>
                {resolvedShowLabels && (
                    <strong className="jankx-advanced-filter__label">{filterTitle}</strong>
                )}
                <div className="jankx-advanced-filter__preview">
                    <span style={{ fontSize: '12px', color: '#777', fontStyle: 'italic' }}>
                        [{filterType}{taxonomy ? `: ${taxonomy}` : ''}{label ? ` — ${label}` : ''}]
                    </span>
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


