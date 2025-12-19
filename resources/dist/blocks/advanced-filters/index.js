import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl, Placeholder, Spinner, } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
// Import styles - editor.scss already imports style.scss
import './editor.scss';
function Edit({ attributes, setAttributes, clientId }) {
    const { blockId, targetBlockIds, filterType, layout, showLabels, showResetButton, resetButtonText, ajaxEnabled, updateUrl, scrollToResults, taxonomyFilters, metaFilters, priceFilters, dateFilters, authorFilters, keywordFilter, displayStyle, showCount, showEmptyTerms, showOnlyTopLevel, showHierarchy, displayAsDropdown, multipleSelection, collapsible, defaultExpanded, } = attributes;
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    // Lấy danh sách block con advanced-filter
    const innerFilterBlocks = useSelect((select) => {
        const block = select('core/block-editor').getBlock(clientId);
        return block?.innerBlocks || [];
    }, [clientId]);
    // Dùng useMemo để tránh setAttributes lặp lại nếu dữ liệu không đổi
    const normalizedFilters = useMemo(() => {
        const nextTax = [];
        const nextMeta = [];
        const nextPrice = [];
        const nextDate = [];
        const nextAuthor = [];
        const nextKeyword = [];
        innerFilterBlocks.forEach((block) => {
            const filter = block.attributes || {};
            const type = filter.filterType || 'taxonomy';
            switch (type) {
                case 'taxonomy':
                    nextTax.push(filter);
                    break;
                case 'meta':
                    nextMeta.push(filter);
                    break;
                case 'price':
                    nextPrice.push(filter);
                    break;
                case 'date':
                    nextDate.push(filter);
                    break;
                case 'author':
                    nextAuthor.push(filter);
                    break;
                case 'keyword':
                    nextKeyword.push(filter);
                    break;
                default:
                    break;
            }
        });
        return {
            taxonomyFilters: nextTax,
            metaFilters: nextMeta,
            priceFilters: nextPrice,
            dateFilters: nextDate,
            authorFilters: nextAuthor,
            keywordFilter: nextKeyword[0] || keywordFilter || {},
        };
    }, [innerFilterBlocks, keywordFilter]);
    // Get post type from target block
    const targetPostType = targetBlockIds.length > 0 && availableBlocks.length > 0
        ? availableBlocks.find(b => b.id === targetBlockIds[0])?.postType || 'post'
        : 'post';
    // Ensure blockId is set to clientId for frontend matching
    useEffect(() => {
        if (!blockId && clientId) {
            setAttributes({ blockId: clientId });
        }
    }, [blockId, clientId, setAttributes]);
    // Use blockProps without additional classes since PHP render already includes full wrapper
    const blockProps = useBlockProps();
    // Đồng bộ filters từ block con lên attributes để render PHP/SSR
    useEffect(() => {
        const nextAttributes = {
            taxonomyFilters: normalizedFilters.taxonomyFilters,
            metaFilters: normalizedFilters.metaFilters,
            priceFilters: normalizedFilters.priceFilters,
            dateFilters: normalizedFilters.dateFilters,
            authorFilters: normalizedFilters.authorFilters,
            keywordFilter: normalizedFilters.keywordFilter,
            targetPostType,
        };
        const currentSnapshot = JSON.stringify({
            taxonomyFilters,
            metaFilters,
            priceFilters,
            dateFilters,
            authorFilters,
            keywordFilter,
            targetPostType,
        });
        const nextSnapshot = JSON.stringify(nextAttributes);
        if (currentSnapshot !== nextSnapshot) {
            setAttributes(nextAttributes);
        }
    }, [
        normalizedFilters,
        taxonomyFilters,
        metaFilters,
        priceFilters,
        dateFilters,
        authorFilters,
        keywordFilter,
        targetPostType,
        setAttributes,
    ]);
    // Helper function to find dynamic-data-layout blocks recursively
    const findDynamicDataLayoutBlocks = (blocks) => {
        const found = [];
        const traverse = (blockList) => {
            blockList.forEach((block) => {
                if (block.name === 'jankx/dynamic-data-layout') {
                    const queryId = block.attributes?.queryId || block.clientId;
                    found.push({
                        id: String(queryId || block.clientId),
                        name: `${block.attributes?.postType || 'post'} Layout`,
                        postType: block.attributes?.postType || 'post',
                        source: 'current_page',
                    });
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    traverse(block.innerBlocks);
                }
            });
        };
        traverse(blocks);
        return found;
    };
    // Get available dynamic-data-layout blocks from current page only
    useEffect(() => {
        const getAvailableBlocks = () => {
            setLoadingBlocks(true);
            try {
                // Get blocks from current page/post context only
                const currentBlocks = window.wp.data.select('core/block-editor').getBlocks();
                if (currentBlocks && currentBlocks.length > 0) {
                    const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
                    setAvailableBlocks(dynamicDataLayoutBlocks);
                }
                else {
                    setAvailableBlocks([]);
                }
            }
            catch (error) {
                console.error('Error getting blocks from current page:', error);
                setAvailableBlocks([]);
            }
            finally {
                setLoadingBlocks(false);
            }
        };
        // Get blocks immediately
        getAvailableBlocks();
        // Subscribe to block changes to update list when blocks are added/removed
        let timeoutId = null;
        const unsubscribe = window.wp.data.subscribe(() => {
            // Debounce to avoid too many updates
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const currentBlocks = window.wp.data.select('core/block-editor').getBlocks();
                if (currentBlocks) {
                    const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
                    setAvailableBlocks(dynamicDataLayoutBlocks);
                }
            }, 300);
        });
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);
    // Use the appender in block content to add filters
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsx(PanelBody, { title: __('Target Blocks', 'jankx'), initialOpen: true, children: loadingBlocks ? (_jsx(Spinner, {})) : (_jsxs(_Fragment, { children: [_jsx("p", { children: __('Select Dynamic Data Layout blocks to filter:', 'jankx') }), availableBlocks.length === 0 ? (_jsx(Placeholder, { children: _jsx("p", { children: __('No Dynamic Data Layout blocks found in this page. Add a Dynamic Data Layout block to this page first.', 'jankx') }) })) : (_jsxs("div", { style: { marginTop: '10px' }, children: [_jsx(SelectControl, { label: __('Target Block(s)', 'jankx'), value: targetBlockIds.length > 0 ? targetBlockIds[0] : '', options: [
                                                { label: __('-- Select Block --', 'jankx'), value: '' },
                                                ...availableBlocks.map((block) => ({
                                                    label: `${block.name || `Block ${block.id}`}${block.source ? ` (${block.source})` : ''}`,
                                                    value: block.id,
                                                })),
                                            ], onChange: (value) => {
                                                if (value) {
                                                    // Single selection for now, can be extended to multiple
                                                    setAttributes({
                                                        targetBlockIds: [value],
                                                    });
                                                }
                                                else {
                                                    setAttributes({
                                                        targetBlockIds: [],
                                                    });
                                                }
                                            }, help: __('Select the Dynamic Data Layout block you want to filter.', 'jankx') }), targetBlockIds.length > 0 && (_jsxs("div", { style: { marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }, children: [_jsx("strong", { children: __('Selected:', 'jankx') }), _jsx("ul", { style: { margin: '5px 0', paddingLeft: '20px' }, children: targetBlockIds.map((id) => {
                                                        const block = availableBlocks.find((b) => b.id === id);
                                                        return (_jsxs("li", { children: [block?.name || id, block?.source && ` (${block.source})`] }, id));
                                                    }) })] }))] }))] })) }), _jsx(PanelBody, { title: __('Filters', 'jankx'), initialOpen: false, children: targetBlockIds.length === 0 ? (_jsx("p", { style: { color: '#d63638', marginBottom: '10px' }, children: __('Please select a target block first to configure filters.', 'jankx') })) : (_jsxs("p", { style: { marginBottom: '10px', fontSize: '12px', color: '#666' }, children: [__('Post Type:', 'jankx'), " ", _jsx("strong", { children: targetPostType })] })) }), _jsxs(PanelBody, { title: __('AJAX Settings', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Enable AJAX', 'jankx'), checked: ajaxEnabled, onChange: (value) => setAttributes({ ajaxEnabled: value }), help: __('Update results without page reload', 'jankx') }), _jsx(ToggleControl, { label: __('Update URL', 'jankx'), checked: updateUrl, onChange: (value) => setAttributes({ updateUrl: value }), help: __('Update browser URL with filter parameters', 'jankx'), disabled: !ajaxEnabled }), _jsx(ToggleControl, { label: __('Scroll to Results', 'jankx'), checked: scrollToResults, onChange: (value) => setAttributes({ scrollToResults: value }), help: __('Scroll to target block after filtering', 'jankx'), disabled: !ajaxEnabled })] }), _jsxs(PanelBody, { title: __('Reset Button', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Reset Button', 'jankx'), checked: showResetButton, onChange: (value) => setAttributes({ showResetButton: value }) }), showResetButton && (_jsx(TextControl, { label: __('Reset Button Text', 'jankx'), value: resetButtonText, onChange: (value) => setAttributes({ resetButtonText: value }) }))] })] }), _jsxs("div", { ...blockProps, children: [_jsx("div", { style: { marginBottom: '15px' }, children: _jsx(InnerBlocks, { allowedBlocks: ['jankx/advanced-filter'], renderAppender: () => _jsx(InnerBlocks.ButtonBlockAppender, {}) }) }), targetBlockIds.length === 0 ? (_jsx(Placeholder, { icon: "filter", label: __('Advanced Filters', 'jankx'), children: _jsx("p", { children: __('Please select at least one target block to filter in the sidebar.', 'jankx') }) })) : (_jsx(ServerSideRender, { block: "jankx/advanced-filters", attributes: attributes }))] })] }));
}
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => _jsx(InnerBlocks.Content, {}), // Lưu block con để giữ cấu hình filter
});
