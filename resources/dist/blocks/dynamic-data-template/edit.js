import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls, BlockPreview, BlockContextProvider, store as blockEditorStore, } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { useResizeObserver } from '@wordpress/compose';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl, } from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
const DEFAULT_LAYOUTS_DATA = {
    layoutsByPostType: {},
    commonLayouts: [],
};
const DEFAULT_BLOCKS_DATA = {};
const PreviewItem = ({ blocks, className, style, index, }) => {
    const [resizeListener, sizes] = useResizeObserver();
    const width = sizes && sizes.width;
    return (_jsxs("div", { className: className, "data-item-index": index, style: style, children: [resizeListener, _jsx("div", { className: "dynamic-data-template__inner-blocks", children: !!width && (_jsx(BlockPreview, { blocks: blocks, viewportWidth: width })) })] }));
};
export default function Edit({ attributes, setAttributes, clientId, context, }) {
    const { contentLoopLayout = 'default', itemSpacing = 'normal', showItemBorder = false, itemBorderRadius = 0, thumbnailPosition = 'top', overlayIcon = '', overlayIconMode = 'always-show', } = attributes;
    // Get post type and settings from context
    const postType = context?.query?.postType || context?.postType || 'post';
    const postsPerPage = context?.postsPerPage || 10;
    const displayLayout = context?.displayLayout || 'grid';
    const columns = context?.columns || 3;
    const columnsTablet = context?.columnsTablet || 2;
    const columnsMobile = context?.columnsMobile || 1;
    const slidesToScroll = context?.slidesToScroll || 1;
    const showArrows = !!context?.showArrows;
    const showDots = !!context?.showDots;
    const carouselAlign = context?.carouselAlign || 'start';
    // Prepare query args
    const queryArgs = useMemo(() => {
        const args = {
            per_page: postsPerPage,
            offset: context.offset || 0,
            order: context.order || 'DESC',
            orderby: context.orderBy || 'date',
            status: context.postStatus || 'publish',
            _embed: true, // Fetch embedded data like featured media
        };
        if (context.keyword)
            args.search = context.keyword;
        if (context.authorIn?.length)
            args.author = context.authorIn;
        if (context.authorNotIn?.length)
            args.author_exclude = context.authorNotIn;
        if (context.postIn?.length)
            args.include = context.postIn;
        if (context.postNotIn?.length)
            args.exclude = context.postNotIn;
        if (context.postParent)
            args.parent = context.postParent;
        if (context.postParentIn?.length)
            args.parent = context.postParentIn;
        if (context.postParentNotIn?.length)
            args.parent_exclude = context.postParentNotIn;
        // ignore_sticky_posts logic depends on API version but generally REST doesn't sticky by default unless asked?
        // Actually REST API doesn't move sticky posts to top by default like WP_Query.
        // But let's leave it as is.
        return args;
    }, [context, postsPerPage]);
    // Fetch posts
    const { posts, hasResolved } = useSelect((select) => {
        const { getEntityRecords, hasFinishedResolution } = select(coreStore);
        const selectorArgs = ['postType', postType, queryArgs];
        return {
            posts: getEntityRecords(...selectorArgs),
            hasResolved: hasFinishedResolution('getEntityRecords', selectorArgs),
        };
    }, [postType, queryArgs]);
    // Get layouts data from PHP
    const layoutsData = window.jankxDynamicDataContentLoopLayouts || DEFAULT_LAYOUTS_DATA;
    // Get available layouts for current post type
    const availableLayouts = useMemo(() => {
        const layouts = [];
        // Use layoutsByPostType which already includes common layouts
        // This avoids duplicates since getLayoutsForPostType() already merges common + post type specific
        if (layoutsData.layoutsByPostType && typeof layoutsData.layoutsByPostType === 'object' && postType in layoutsData.layoutsByPostType && Array.isArray(layoutsData.layoutsByPostType[postType])) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        else if (layoutsData.commonLayouts) {
            // Fallback to common layouts if post type specific layouts not found
            layoutsData.commonLayouts.forEach((layoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        return layouts;
    }, [postType, layoutsData]);
    // Layout options for SelectControl
    const layoutOptions = useMemo(() => {
        return availableLayouts.map((layoutInfo) => ({
            label: layoutInfo.title || layoutInfo.name,
            value: layoutInfo.name,
        }));
    }, [availableLayouts]);
    // Get default blocks for post type
    const defaultBlocks = useMemo(() => {
        const defaultBlocksData = window.jankxDynamicDataTemplateDefaultBlocks || DEFAULT_BLOCKS_DATA;
        return defaultBlocksData[postType] || [];
    }, [postType]);
    // Recursive function to convert blocks to template format
    const convertToTemplate = useCallback((blocks) => {
        return blocks.map((block) => [
            block.blockName,
            block.attrs || {},
            block.innerBlocks ? convertToTemplate(block.innerBlocks) : []
        ]);
    }, []);
    // Convert default blocks to template format
    const defaultTemplate = useMemo(() => {
        return convertToTemplate(defaultBlocks);
    }, [defaultBlocks, convertToTemplate]);
    const blockProps = useBlockProps({
        className: `dynamic-data-template dynamic-data-template--${contentLoopLayout}`,
        ...(thumbnailPosition && { 'data-thumbnail-position': thumbnailPosition }),
    });
    // InnerBlocks props cho tất cả items (tất cả đều editable)
    const innerBlocksProps = useInnerBlocksProps({
        className: 'dynamic-data-template__inner-blocks',
    }, {
        template: defaultTemplate.length > 0 ? defaultTemplate : undefined,
        templateLock: false, // Allow editing inner blocks
        allowedBlocks: undefined, // Allow all blocks
    });
    // Get current template block innerBlocks từ store
    const templateBlock = useSelect((select) => select(blockEditorStore).getBlock(clientId), [clientId]);
    const currentInnerBlocks = templateBlock?.innerBlocks || [];
    // Shared state cho tất cả items - dùng React state để đồng nhất
    const [sharedInnerBlocks, setSharedInnerBlocks] = useState(currentInnerBlocks);
    const lastSyncedBlocksRef = useRef('');
    // Sync: khi innerBlocks của template block thay đổi, update shared state
    useEffect(() => {
        const currentBlocksStr = JSON.stringify(currentInnerBlocks);
        // Chỉ sync nếu thực sự có thay đổi
        if (currentBlocksStr !== lastSyncedBlocksRef.current) {
            lastSyncedBlocksRef.current = currentBlocksStr;
            setSharedInnerBlocks(currentInnerBlocks);
        }
    }, [currentInnerBlocks]);
    // Calculate total items to display (including editable one)
    const totalItems = useMemo(() => {
        if (hasResolved && posts) {
            return Math.max(1, posts.length);
        }
        // Giới hạn tối đa 12 items cho performance khi loading
        return Math.min(Math.max(1, postsPerPage), 12);
    }, [postsPerPage, hasResolved, posts]);
    const viewportRef = useRef(null);
    const scrollBySlides = useCallback((n) => {
        const vp = viewportRef.current;
        if (!vp)
            return;
        const width = vp.clientWidth;
        const perSlide = width / Math.max(1, columns);
        vp.scrollBy({ left: n * perSlide * Math.max(1, slidesToScroll), behavior: 'smooth' });
    }, [columns, slidesToScroll]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Template Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Content Loop Layout', 'jankx'), value: contentLoopLayout, options: layoutOptions, onChange: (value) => setAttributes({ contentLoopLayout: value }) }), _jsx(SelectControl, { label: __('Item Spacing', 'jankx'), value: itemSpacing, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Compact', 'jankx'), value: 'compact' },
                                    { label: __('Normal', 'jankx'), value: 'normal' },
                                    { label: __('Loose', 'jankx'), value: 'loose' },
                                ], onChange: (value) => setAttributes({ itemSpacing: value }) }), _jsx(ToggleControl, { label: __('Show Item Border', 'jankx'), checked: showItemBorder, onChange: (value) => setAttributes({ showItemBorder: value }) }), showItemBorder && (_jsx(RangeControl, { label: __('Border Radius', 'jankx'), value: itemBorderRadius, onChange: (value) => setAttributes({ itemBorderRadius: value || 0 }), min: 0, max: 50 }))] }), _jsxs(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Thumbnail Position', 'jankx'), value: thumbnailPosition || 'top', options: [
                                    { label: __('Top (Default)', 'jankx'), value: 'top' },
                                    { label: __('Bottom', 'jankx'), value: 'bottom' },
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Right', 'jankx'), value: 'right' },
                                ], onChange: (value) => setAttributes({ thumbnailPosition: value }), help: __('Choose where the featured image appears relative to the content.', 'jankx') }), _jsx(TextControl, { label: __('Overlay Icon Class', 'jankx'), value: overlayIcon, onChange: (value) => setAttributes({ overlayIcon: value }), help: __('Enter icon class (e.g., fas fa-play, dashicons-video-alt3)', 'jankx') }), overlayIcon && (_jsx(SelectControl, { label: __('Overlay Icon Mode', 'jankx'), value: overlayIconMode, options: [
                                    { label: __('Always Show', 'jankx'), value: 'always-show' },
                                    { label: __('Hover to Hide', 'jankx'), value: 'hover-hide' },
                                    { label: __('Hover to Show', 'jankx'), value: 'hover-show' },
                                ], onChange: (value) => setAttributes({ overlayIconMode: value }) }))] })] }), _jsx("div", { ...blockProps, children: displayLayout === 'carousel' ? (_jsxs("div", { className: `dynamic-data-template__carousel columns-${columns}`, children: [showArrows ? (_jsxs("div", { className: "dynamic-data-template__carousel-nav", children: [_jsx("button", { type: "button", className: "carousel-button prev", onClick: () => scrollBySlides(-1), children: "Prev" }), _jsx("button", { type: "button", className: "carousel-button next", onClick: () => scrollBySlides(1), children: "Next" })] })) : null, _jsx("div", { ref: viewportRef, className: "dynamic-data-template__carousel-viewport", style: {
                                overflow: 'hidden',
                            }, children: _jsx("div", { className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`, style: {
                                    '--columns-desktop': columns,
                                    '--columns-tablet': columnsTablet,
                                    '--columns-mobile': columnsMobile,
                                    display: 'flex',
                                    gap: '1rem',
                                    scrollSnapType: 'x mandatory',
                                }, children: Array.from({ length: totalItems }).map((_, index) => {
                                    const itemStyle = {
                                        flex: `0 0 calc(100% / ${columns})`,
                                        scrollSnapAlign: carouselAlign,
                                    };
                                    const spacing = attributes?.style?.spacing;
                                    if (spacing?.padding) {
                                        const p = spacing.padding;
                                        if (p.top)
                                            itemStyle.paddingTop = p.top;
                                        if (p.right)
                                            itemStyle.paddingRight = p.right;
                                        if (p.bottom)
                                            itemStyle.paddingBottom = p.bottom;
                                        if (p.left)
                                            itemStyle.paddingLeft = p.left;
                                    }
                                    if (spacing?.margin) {
                                        const m = spacing.margin;
                                        if (m.top)
                                            itemStyle.marginTop = m.top;
                                        if (m.right)
                                            itemStyle.marginRight = m.right;
                                        if (m.bottom)
                                            itemStyle.marginBottom = m.bottom;
                                        if (m.left)
                                            itemStyle.marginLeft = m.left;
                                    }
                                    const postData = posts && posts[index] ? posts[index] : null;
                                    const contextValue = postData ? { postId: postData.id, postType: postData.type } : {};
                                    if (index === 0) {
                                        return (_jsx("div", { className: "dynamic-data-template__item", "data-item-index": index, style: itemStyle, children: postData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx("div", { ...innerBlocksProps }) })) : (_jsx("div", { ...innerBlocksProps })) }, `item-${index}`));
                                    }
                                    return (_jsx("div", { className: "dynamic-data-template__item dynamic-data-template__item--preview", "data-item-index": index, style: itemStyle, children: postData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks }) })) : (_jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks })) }, `item-${index}`));
                                }) }) }), showDots ? (_jsx("div", { className: "dynamic-data-template__carousel-dots" })) : null] })) : (_jsx("div", { className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`, style: {
                        '--columns-desktop': columns,
                        '--columns-tablet': columnsTablet,
                        '--columns-mobile': columnsMobile,
                        display: displayLayout === 'grid' || displayLayout === 'card' ? 'grid' : 'block',
                        gridTemplateColumns: (displayLayout === 'grid' || displayLayout === 'card')
                            ? `repeat(${columns}, minmax(0, 1fr))`
                            : 'none',
                        gap: '1rem',
                    }, children: Array.from({ length: totalItems }).map((_, index) => {
                        const postData = posts && posts[index] ? posts[index] : null;
                        const contextValue = postData ? { postId: postData.id, postType: postData.type } : {};
                        if (index === 0) {
                            const itemStyle2 = {};
                            const spacing2 = attributes?.style?.spacing;
                            if (spacing2?.padding) {
                                const p2 = spacing2.padding;
                                if (p2.top)
                                    itemStyle2.paddingTop = p2.top;
                                if (p2.right)
                                    itemStyle2.paddingRight = p2.right;
                                if (p2.bottom)
                                    itemStyle2.paddingBottom = p2.bottom;
                                if (p2.left)
                                    itemStyle2.paddingLeft = p2.left;
                            }
                            if (spacing2?.margin) {
                                const m2 = spacing2.margin;
                                if (m2.top)
                                    itemStyle2.marginTop = m2.top;
                                if (m2.right)
                                    itemStyle2.marginRight = m2.right;
                                if (m2.bottom)
                                    itemStyle2.marginBottom = m2.bottom;
                                if (m2.left)
                                    itemStyle2.marginLeft = m2.left;
                            }
                            return (_jsx("div", { className: "dynamic-data-template__item", "data-item-index": index, style: itemStyle2, children: postData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx("div", { ...innerBlocksProps }) })) : (_jsx("div", { ...innerBlocksProps })) }, `item-${index}`));
                        }
                        const itemStyle3 = {};
                        const spacing3 = attributes?.style?.spacing;
                        if (spacing3?.padding) {
                            const p3 = spacing3.padding;
                            if (p3.top)
                                itemStyle3.paddingTop = p3.top;
                            if (p3.right)
                                itemStyle3.paddingRight = p3.right;
                            if (p3.bottom)
                                itemStyle3.paddingBottom = p3.bottom;
                            if (p3.left)
                                itemStyle3.paddingLeft = p3.left;
                        }
                        if (spacing3?.margin) {
                            const m3 = spacing3.margin;
                            if (m3.top)
                                itemStyle3.marginTop = m3.top;
                            if (m3.right)
                                itemStyle3.marginRight = m3.right;
                            if (m3.bottom)
                                itemStyle3.marginBottom = m3.bottom;
                            if (m3.left)
                                itemStyle3.marginLeft = m3.left;
                        }
                        return (_jsx("div", { className: "dynamic-data-template__item dynamic-data-template__item--preview", "data-item-index": index, style: itemStyle3, children: postData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks }) })) : (_jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks })) }, `item-${index}`));
                    }) })) })] }));
}
