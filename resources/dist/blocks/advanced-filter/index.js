import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl, Spinner, Placeholder, } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';
function Edit({ attributes, setAttributes, clientId }) {
    const { filterType, label, enabled, taxonomy, displayStyle, listingType, showCount, showEmptyTerms, showOnlyTopLevel, showHierarchy, multipleSelection, layout, showLabels, collapsible, defaultExpanded, metaKey, inputType, minValue, maxValue, placeholder, minPrice, maxPrice, currency, dateField, dateRange, showSearchButton, searchButtonText, searchButtonDisplay, searchButtonIcon, keywordAction, filterValue, filterValueMin, filterValueMax, filterValueStart, filterValueEnd, } = attributes;
    const [taxonomies, setTaxonomies] = useState([]);
    const [terms, setTerms] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    // Kiểm tra parent block và lấy attributes
    const { isSmartTabChild, parentDefaults } = useSelect((select) => {
        const { getBlockParents, getBlock } = select('core/block-editor');
        const parents = getBlockParents(clientId) || [];
        // Tìm parent là smart-tab trước (cho advanced filter trigger)
        let parentId = parents.find((id) => getBlock(id)?.name === 'jankx/smart-tab');
        if (parentId) {
            const parent = getBlock(parentId);
            const attrs = parent?.attributes || {};
            const triggerSettings = (attrs.triggerSettings || {});
            const targetBlockId = triggerSettings.targetBlockId;
            // Tìm dynamic-data-layout block để lấy post type
            let targetPostType = 'post';
            if (targetBlockId) {
                const allBlocks = select('core/block-editor').getBlocks();
                const findBlock = (blocks) => {
                    for (const block of blocks) {
                        if (block.name === 'jankx/dynamic-data-layout') {
                            const queryId = block.attributes?.queryId || block.clientId;
                            if (String(queryId) === targetBlockId) {
                                return block;
                            }
                        }
                        if (block.innerBlocks?.length > 0) {
                            const found = findBlock(block.innerBlocks);
                            if (found)
                                return found;
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
    }, [clientId]);
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
        className: 'jankx-advanced-filter',
    });
    const filterTitle = useMemo(() => {
        const typeLabel = filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'Filter';
        return label || `${__('Filter', 'jankx')} (${typeLabel})`;
    }, [label, filterType]);
    // Fetch taxonomies theo post type từ parent
    useEffect(() => {
        if (!resolvedTargetPostType)
            return;
        setLoadingTaxonomies(true);
        (async () => {
            try {
                const taxData = await window.wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${resolvedTargetPostType}`,
                });
                const list = Object.values(taxData || {});
                setTaxonomies(list);
            }
            catch (e) {
                setTaxonomies([]);
            }
            finally {
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
                const termsData = await window.wp.apiFetch({
                    path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
                });
                setTerms(Array.isArray(termsData) ? termsData : []);
            }
            catch (e) {
                setTerms([]);
            }
            finally {
                setLoadingTerms(false);
            }
        })();
    }, [taxonomy]);
    // Fetch authors khi filterType là author
    useEffect(() => {
        if (filterType !== 'author') {
            setAuthors([]);
            return;
        }
        setLoadingAuthors(true);
        (async () => {
            try {
                const usersData = await window.wp.apiFetch({
                    path: '/wp/v2/users?per_page=100&orderby=name&order=asc',
                });
                setAuthors(Array.isArray(usersData) ? usersData : []);
            }
            catch (e) {
                setAuthors([]);
            }
            finally {
                setLoadingAuthors(false);
            }
        })();
    }, [filterType]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Filter', 'jankx'), initialOpen: true, children: [_jsxs("p", { style: { marginBottom: '8px', fontSize: '12px', color: '#555' }, children: [__('Post type kế thừa từ Advanced Filters:', 'jankx'), " ", _jsx("strong", { children: resolvedTargetPostType })] }), _jsx(SelectControl, { label: __('Filter Type', 'jankx'), value: filterType, options: [
                                    { label: __('Taxonomy', 'jankx'), value: 'taxonomy' },
                                    { label: __('Meta Field', 'jankx'), value: 'meta' },
                                    { label: __('Price', 'jankx'), value: 'price' },
                                    { label: __('Date', 'jankx'), value: 'date' },
                                    { label: __('Author', 'jankx'), value: 'author' },
                                    { label: __('Keyword', 'jankx'), value: 'keyword' },
                                ], onChange: (value) => setAttributes({ filterType: value }) }), _jsx(TextControl, { label: __('Label (Optional)', 'jankx'), value: label || '', onChange: (value) => setAttributes({ label: value }), placeholder: __('Custom label for this filter', 'jankx') }), _jsx(ToggleControl, { label: __('Enabled', 'jankx'), checked: enabled !== false, onChange: (value) => setAttributes({ enabled: value }) }), _jsx(ToggleControl, { label: __('Hide Label', 'jankx'), checked: !resolvedShowLabels, onChange: (value) => setAttributes({ showLabels: !value }) })] }), _jsxs(PanelBody, { title: __('Filter Settings', 'jankx'), initialOpen: true, children: [filterType === 'taxonomy' && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Taxonomy', 'jankx'), value: taxonomy || '', options: [
                                            { label: loadingTaxonomies ? __('Loading...', 'jankx') : __('-- Select --', 'jankx'), value: '' },
                                            ...taxonomies.map((tax) => ({
                                                label: tax.name,
                                                value: tax.slug,
                                            })),
                                        ], onChange: (value) => setAttributes({ taxonomy: value }), help: __('Taxonomy lấy theo post type của block cha', 'jankx') }), !isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Display Style', 'jankx'), value: normalizedDisplayStyle, options: [
                                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                                ], onChange: (value) => setAttributes({ displayStyle: value }) }), normalizedDisplayStyle === 'checkboxes' && (_jsx(SelectControl, { label: __('Listing Type', 'jankx'), value: listingType || 'ul', options: [
                                                    { label: __('Unordered List (•)', 'jankx'), value: 'ul' },
                                                    { label: __('Ordered List (1, 2, 3)', 'jankx'), value: 'ol' },
                                                    { label: __('No List', 'jankx'), value: 'none' },
                                                ], onChange: (value) => setAttributes({ listingType: value }) })), _jsx(ToggleControl, { label: __('Show Post Counts', 'jankx'), checked: resolvedShowCount, onChange: (value) => setAttributes({ showCount: value }) }), _jsx(ToggleControl, { label: __('Show Empty Terms', 'jankx'), checked: resolvedShowEmptyTerms, onChange: (value) => setAttributes({ showEmptyTerms: value }) }), _jsx(ToggleControl, { label: __('Show Only Top Level Terms', 'jankx'), checked: resolvedShowOnlyTopLevel, onChange: (value) => setAttributes({ showOnlyTopLevel: value }) }), _jsx(ToggleControl, { label: __('Show Hierarchy', 'jankx'), checked: resolvedShowHierarchy, onChange: (value) => setAttributes({ showHierarchy: value }) }), _jsx(ToggleControl, { label: __('Multiple Selection', 'jankx'), checked: resolvedMultiple, onChange: (value) => setAttributes({ multipleSelection: value }) })] })), isSmartTabChild && taxonomy && (_jsx(SelectControl, { label: __('Select Term', 'jankx'), value: filterValue || 'all', options: [
                                            { label: __('Tất cả', 'jankx'), value: 'all' },
                                            ...(loadingTerms ? [] : terms.map((term) => ({
                                                label: `${term.name}${term.count !== undefined ? ` (${term.count})` : ''}`,
                                                value: String(term.id),
                                            }))),
                                        ], onChange: (value) => setAttributes({ filterValue: value === 'all' ? '' : value }), help: __('Chọn "Tất cả" để hiển thị tất cả data, hoặc chọn term cụ thể để filter', 'jankx') })), !isSmartTabChild && (_jsxs("div", { style: { marginTop: '10px' }, children: [_jsx("strong", { style: { display: 'block', marginBottom: '6px' }, children: __('Preview terms', 'jankx') }), loadingTerms ? (_jsx(Spinner, {})) : terms.length === 0 ? (_jsx(Placeholder, { children: __('No terms found', 'jankx') })) : (_jsx("ul", { style: { maxHeight: '120px', overflow: 'auto', paddingLeft: '16px' }, children: terms.map((term) => (_jsxs("li", { children: [term.name, " ", term.count !== undefined ? `(${term.count})` : ''] }, term.id))) }))] }))] })), filterType === 'meta' && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Meta Key', 'jankx'), value: metaKey || '', onChange: (value) => setAttributes({ metaKey: value }), placeholder: __('e.g., _price, custom_field', 'jankx') }), !isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Input Type', 'jankx'), value: inputType || 'text', options: [
                                                    { label: __('Text', 'jankx'), value: 'text' },
                                                    { label: __('Number', 'jankx'), value: 'number' },
                                                    { label: __('Number Range', 'jankx'), value: 'range' },
                                                    { label: __('Date', 'jankx'), value: 'date' },
                                                    { label: __('Date Range', 'jankx'), value: 'date-range' },
                                                ], onChange: (value) => setAttributes({ inputType: value }) }), inputType === 'range' && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Min Value', 'jankx'), value: minValue || '', onChange: (value) => setAttributes({ minValue: value }), type: "number" }), _jsx(TextControl, { label: __('Max Value', 'jankx'), value: maxValue || '', onChange: (value) => setAttributes({ maxValue: value }), type: "number" })] })), _jsx(TextControl, { label: __('Placeholder', 'jankx'), value: placeholder || '', onChange: (value) => setAttributes({ placeholder: value }) })] })), isSmartTabChild && metaKey && (_jsx(TextControl, { label: __('Meta Value', 'jankx'), value: filterValue || '', onChange: (value) => setAttributes({ filterValue: value }), placeholder: __('Nhập giá trị meta để filter', 'jankx'), help: __('Giá trị meta để filter khi tab được click', 'jankx') }))] })), filterType === 'price' && (_jsxs(_Fragment, { children: [!isSmartTabChild && (_jsx(TextControl, { label: __('Currency Symbol', 'jankx'), value: currency || 'VND', onChange: (value) => setAttributes({ currency: value }) })), isSmartTabChild ? (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Min Price', 'jankx'), value: filterValueMin || '', onChange: (value) => setAttributes({ filterValueMin: value }), type: "number", placeholder: __('Giá tối thiểu', 'jankx') }), _jsx(TextControl, { label: __('Max Price', 'jankx'), value: filterValueMax || '', onChange: (value) => setAttributes({ filterValueMax: value }), type: "number", placeholder: __('Giá tối đa', 'jankx') })] })) : (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Min Price', 'jankx'), value: minPrice || '', onChange: (value) => setAttributes({ minPrice: value }), type: "number" }), _jsx(TextControl, { label: __('Max Price', 'jankx'), value: maxPrice || '', onChange: (value) => setAttributes({ maxPrice: value }), type: "number" })] }))] })), filterType === 'date' && (_jsxs(_Fragment, { children: [!isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Date Field', 'jankx'), value: dateField || 'post_date', options: [
                                                    { label: __('Post Date', 'jankx'), value: 'post_date' },
                                                    { label: __('Modified Date', 'jankx'), value: 'post_modified' },
                                                ], onChange: (value) => setAttributes({ dateField: value }) }), _jsx(ToggleControl, { label: __('Date Range', 'jankx'), checked: dateRange !== undefined ? dateRange : true, onChange: (value) => setAttributes({ dateRange: value }), help: __('Allow users to select a date range', 'jankx') })] })), isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Start Date', 'jankx'), type: "date", value: filterValueStart || '', onChange: (value) => setAttributes({ filterValueStart: value }), help: __('Ngày bắt đầu để filter', 'jankx') }), _jsx(TextControl, { label: __('End Date', 'jankx'), type: "date", value: filterValueEnd || '', onChange: (value) => setAttributes({ filterValueEnd: value }), help: __('Ngày kết thúc để filter', 'jankx') })] }))] })), filterType === 'author' && (_jsxs(_Fragment, { children: [!isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Display Style', 'jankx'), value: normalizedDisplayStyle, options: [
                                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                                ], onChange: (value) => setAttributes({ displayStyle: value }) }), _jsx(ToggleControl, { label: __('Multiple Selection', 'jankx'), checked: resolvedMultiple, onChange: (value) => setAttributes({ multipleSelection: value }), help: __('Allow users to select multiple authors', 'jankx') })] })), isSmartTabChild && (_jsx(SelectControl, { label: __('Select Author', 'jankx'), value: filterValue || '', options: [
                                            { label: loadingAuthors ? __('Loading...', 'jankx') : __('-- Select Author --', 'jankx'), value: '' },
                                            ...authors.map((author) => ({
                                                label: author.name,
                                                value: String(author.id),
                                            })),
                                        ], onChange: (value) => setAttributes({ filterValue: value }), help: __('Chọn author để filter khi tab được click', 'jankx') }))] })), filterType === 'keyword' && (_jsxs(_Fragment, { children: [!isSmartTabChild && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Placeholder', 'jankx'), value: placeholder || __('Search...', 'jankx'), onChange: (value) => setAttributes({ placeholder: value }) }), _jsx(ToggleControl, { label: __('Show Search Button', 'jankx'), checked: showSearchButton !== undefined ? showSearchButton : false, onChange: (value) => setAttributes({ showSearchButton: value }) }), showSearchButton ? (_jsx(SelectControl, { label: __('Search Action', 'jankx'), value: resolvedKeywordAction, options: [
                                                    { label: __('Filter while typing', 'jankx'), value: 'typing' },
                                                    { label: __('Only when clicking Search', 'jankx'), value: 'button' },
                                                ], onChange: (value) => setAttributes({ keywordAction: value }), help: __('Chọn cách kích hoạt filter cho ô tìm kiếm', 'jankx') })) : null, showSearchButton ? (_jsx(TextControl, { label: __('Search Button Text', 'jankx'), value: resolvedSearchButtonText, onChange: (value) => setAttributes({ searchButtonText: value }), placeholder: __('Search', 'jankx') })) : null, showSearchButton ? (_jsx(SelectControl, { label: __('Search Button Display', 'jankx'), value: resolvedSearchButtonDisplay, options: [
                                                    { label: __('Text only', 'jankx'), value: 'text' },
                                                    { label: __('SVG/Icon only', 'jankx'), value: 'icon' },
                                                    { label: __('Icon + Text', 'jankx'), value: 'icon-text' },
                                                ], onChange: (value) => setAttributes({ searchButtonDisplay: value }), help: __('Chọn hiển thị nút: chỉ text, chỉ icon, hoặc icon + text', 'jankx') })) : null, showSearchButton && resolvedSearchButtonDisplay !== 'text' ? (_jsx(TextControl, { label: __('Search Button Icon (SVG/HTML)', 'jankx'), value: resolvedSearchButtonIcon, onChange: (value) => setAttributes({ searchButtonIcon: value }), placeholder: '<svg>...</svg>', help: __('Dán SVG hoặc HTML icon. Sử dụng cẩn thận.', 'jankx') })) : null] })), isSmartTabChild && (_jsx(TextControl, { label: __('Search Keyword', 'jankx'), value: filterValue || '', onChange: (value) => setAttributes({ filterValue: value }), placeholder: __('Nhập từ khóa để filter', 'jankx'), help: __('Từ khóa để filter khi tab được click', 'jankx') }))] }))] })] }), _jsxs("div", { ...blockProps, children: [_jsx("strong", { children: filterTitle }), _jsxs("div", { style: { fontSize: '12px', color: '#555' }, children: [_jsxs("div", { children: [__('Type', 'jankx'), ": ", filterType] }), taxonomy && _jsxs("div", { children: [__('Taxonomy', 'jankx'), ": ", taxonomy] }), label && _jsxs("div", { children: [__('Label', 'jankx'), ": ", label] })] })] })] }));
}
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null,
});
