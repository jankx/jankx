import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls, BlockPreview, BlockContextProvider, store as blockEditorStore, MediaUpload, } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { useResizeObserver } from '@wordpress/compose';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl, Button, ButtonGroup, Tooltip, } from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlocksFromTemplate } from '@wordpress/blocks';
const DEFAULT_LAYOUTS_DATA = {
    layoutsByPostType: {},
    commonLayouts: [],
};
const DEFAULT_BLOCKS_DATA = {};
const LAYOUT_ICONS = {
    default: (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "8", rx: "1", fill: "currentColor", fillOpacity: "0.2", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "4", y: "15", width: "16", height: "1.5", rx: "0.75", fill: "currentColor" }), _jsx("rect", { x: "4", y: "18.5", width: "10", height: "1.5", rx: "0.75", fill: "currentColor" })] })),
    boxed: (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "1", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "6", y: "6", width: "12", height: "8", fill: "currentColor", fillOpacity: "0.2", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "6", y: "16", width: "12", height: "1.2", rx: "0.6", fill: "currentColor" })] })),
    horizontal: (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "4", y: "6", width: "7", height: "12", rx: "1", fill: "currentColor", fillOpacity: "0.2", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "13", y: "8", width: "7", height: "1.5", rx: "0.75", fill: "currentColor" }), _jsx("rect", { x: "13", y: "11", width: "7", height: "1.5", rx: "0.75", fill: "currentColor" }), _jsx("rect", { x: "13", y: "14", width: "4", height: "1.5", rx: "0.75", fill: "currentColor" })] })),
    'overlap-card': (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "10", rx: "1", fill: "currentColor", fillOpacity: "0.2", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "6", y: "11", width: "12", height: "9", rx: "1", fill: "white", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "8", y: "13.5", width: "8", height: "1.2", rx: "0.6", fill: "currentColor" }), _jsx("rect", { x: "8", y: "16", width: "6", height: "1.2", rx: "0.6", fill: "currentColor" })] })),
    'hero-overlay': (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "1", fill: "currentColor", fillOpacity: "0.2", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "1", fill: "url(#hero-gradient)", fillOpacity: "0.3" }), _jsx("rect", { x: "6", y: "14", width: "12", height: "1.5", rx: "0.75", fill: "currentColor" }), _jsx("rect", { x: "6", y: "16.5", width: "8", height: "1.5", rx: "0.75", fill: "currentColor" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "hero-gradient", x1: "4", y1: "4", x2: "20", y2: "20", gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { stopColor: "currentColor", stopOpacity: "0.6" }), _jsx("stop", { offset: "1", stopColor: "currentColor", stopOpacity: "0.1" })] }) })] })),
};
const GET_LAYOUT_TEMPLATE = (layout) => {
    switch (layout) {
        case 'horizontal':
            return [
                ['core/columns', {}, [
                        ['core/column', { width: '33.33%' }, [
                                ['core/paragraph', { className: 'jankx-term-count', fontSize: 'small' }]
                            ]],
                        ['core/column', { width: '66.66%' }, [
                                ['core/heading', { level: 3, className: 'jankx-term-name' }],
                                ['core/paragraph', { className: 'jankx-term-description' }]
                            ]]
                    ]]
            ];
        case 'overlap-card':
            return [
                ['core/group', { className: 'overlap-card-content' }, [
                        ['core/heading', { level: 3, className: 'jankx-term-name' }],
                        ['core/paragraph', { className: 'jankx-term-count' }]
                    ]]
            ];
        case 'boxed':
            return [
                ['core/group', { style: { spacing: { padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' } } } }, [
                        ['core/heading', { level: 3, className: 'jankx-term-name' }],
                        ['core/paragraph', { className: 'jankx-term-count' }],
                        ['core/paragraph', { className: 'jankx-term-description' }]
                    ]]
            ];
        case 'hero-overlay':
            return [
                ['core/heading', { level: 3, className: 'jankx-term-name' }],
                ['core/paragraph', { className: 'jankx-term-description' }]
            ];
        default:
            return [
                ['core/heading', { level: 3, className: 'jankx-term-name' }],
                ['core/paragraph', { className: 'jankx-term-description' }],
                ['core/paragraph', { className: 'jankx-term-count' }]
            ];
    }
};
/**
 * Build inline styles for template item from block attributes
 */
const buildTemplateItemStyle = (attributes) => {
    const styles = {};
    const attrStyle = attributes?.style;
    if (!attrStyle) {
        return styles;
    }
    // Spacing - padding
    if (attrStyle?.spacing?.padding) {
        const p = attrStyle.spacing.padding;
        if (p.top)
            styles.paddingTop = p.top;
        if (p.right)
            styles.paddingRight = p.right;
        if (p.bottom)
            styles.paddingBottom = p.bottom;
        if (p.left)
            styles.paddingLeft = p.left;
    }
    // Spacing - margin
    if (attrStyle?.spacing?.margin) {
        const m = attrStyle.spacing.margin;
        if (m.top)
            styles.marginTop = m.top;
        if (m.right)
            styles.marginRight = m.right;
        if (m.bottom)
            styles.marginBottom = m.bottom;
        if (m.left)
            styles.marginLeft = m.left;
    }
    // Colors - background
    if (attrStyle?.color?.background) {
        styles.backgroundColor = attrStyle.color.background;
    }
    // Colors - text
    if (attrStyle?.color?.text) {
        styles.color = attrStyle.color.text;
    }
    // Colors - gradient
    if (attrStyle?.color?.gradient) {
        styles.background = attrStyle.color.gradient;
    }
    // Typography - font size
    if (attrStyle?.typography?.fontSize) {
        styles.fontSize = attrStyle.typography.fontSize;
    }
    // Typography - line height
    if (attrStyle?.typography?.lineHeight) {
        styles.lineHeight = attrStyle.typography.lineHeight;
    }
    // Typography - font family
    if (attrStyle?.typography?.fontFamily) {
        styles.fontFamily = attrStyle.typography.fontFamily;
    }
    // Typography - font weight
    if (attrStyle?.typography?.fontWeight) {
        styles.fontWeight = attrStyle.typography.fontWeight;
    }
    // Typography - font style
    if (attrStyle?.typography?.fontStyle) {
        styles.fontStyle = attrStyle.typography.fontStyle;
    }
    // Typography - text transform
    if (attrStyle?.typography?.textTransform) {
        styles.textTransform = attrStyle.typography.textTransform;
    }
    // Typography - text decoration
    if (attrStyle?.typography?.textDecoration) {
        styles.textDecoration = attrStyle.typography.textDecoration;
    }
    // Typography - letter spacing
    if (attrStyle?.typography?.letterSpacing) {
        styles.letterSpacing = attrStyle.typography.letterSpacing;
    }
    // Border
    if (attrStyle?.border) {
        const border = attrStyle.border;
        if (border.radius) {
            styles.borderRadius = border.radius;
        }
        if (border.width) {
            styles.borderWidth = border.width;
        }
        if (border.style) {
            styles.borderStyle = border.style;
        }
        if (border.color) {
            styles.borderColor = border.color;
        }
    }
    return styles;
};
/**
 * Build CSS classes for template item from block attributes
 */
const buildTemplateItemClasses = (attributes) => {
    const classes = [];
    // Add template layout class
    if (attributes?.templateLayout) {
        classes.push(`content-loop-layout--${attributes.templateLayout}`);
    }
    // Add custom className if present
    if (attributes?.className) {
        classes.push(attributes.className);
    }
    // Add color classes if using theme colors
    if (attributes?.backgroundColor) {
        classes.push(`has-${attributes.backgroundColor}-background-color`);
        classes.push('has-background');
    }
    if (attributes?.textColor) {
        classes.push(`has-${attributes.textColor}-color`);
        classes.push('has-text-color');
    }
    if (attributes?.gradient) {
        classes.push(`has-${attributes.gradient}-gradient-background`);
        classes.push('has-background');
    }
    // Add font size class if using preset
    if (attributes?.fontSize) {
        classes.push(`has-${attributes.fontSize}-font-size`);
    }
    return classes.filter(Boolean).join(' ');
};
const PreviewItem = ({ blocks, className, style, index, templateItemStyle, templateItemClassName, }) => {
    const [resizeListener, sizes] = useResizeObserver();
    const width = sizes && sizes.width;
    return (_jsxs("div", { className: className, "data-item-index": index, style: style, children: [resizeListener, _jsx("div", { className: `dynamic-data-template__inner-blocks${templateItemClassName ? ' ' + templateItemClassName : ''}`, style: templateItemStyle, children: !!width && (_jsx(BlockPreview, { blocks: blocks, viewportWidth: width })) })] }));
};
export default function Edit({ attributes, setAttributes, clientId, context, }) {
    const { templateLayout = 'default', className = '', itemSpacing = 'normal', showItemBorder = false, itemBorderRadius = 0, itemPadding = {}, thumbnailPosition = 'top', heroMinHeight = '320px', heroAspectRatio = '', heroOverlayGradient = 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 45%,transparent 100%)', heroFallbackBackground = 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)', heroBorderRadius = '12px', heroContentPadding = '5px 10px', overlayIcon, overlayIconShowMode = 'always-show', overlayIconPosition = 'center', overlayIconSize = 24, overlayIconColor = '#ffffff', overlayIconBackground = 'rgba(0, 0, 0, 0.5)', overlayIconTarget = 'featured-image', overlayIconType = 'class', overlayIconImageId = 0, overlayIconImageUrl = '', overlayIconText = '', overlayIconRotate = 0, animationType = 'none', animationDuration = 1000, animationDelay = 0, animationTarget = 'entry', animationReverse = false, hoverAnimation = 'none', unhoverAnimation = 'none', overlapMarginTop = '-60px', overlapPadding = '20px', overlapBorderRadius = '8px', overlapBackgroundColor = '#ffffff', } = attributes;
    // Get taxonomy and settings from context
    const taxonomy = context?.taxonomy || attributes.taxonomy || 'category';
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
    const carouselPeek = context?.carouselPeek || 0;
    const { replaceInnerBlocks } = useDispatch(blockEditorStore);
    const onLayoutChange = useCallback((newLayout) => {
        setAttributes({ templateLayout: newLayout });
        // Auto replace inner blocks
        const template = GET_LAYOUT_TEMPLATE(newLayout);
        const newBlocks = createBlocksFromTemplate(template);
        replaceInnerBlocks(clientId, newBlocks);
    }, [clientId, setAttributes, replaceInnerBlocks]);
    // Prepare query args for terms
    const queryArgs = useMemo(() => {
        const args = {
            per_page: Math.min(Math.max(1, postsPerPage), 100),
            order: (context.order || 'asc').toLowerCase(),
            orderby: context.orderBy || 'name',
            hide_empty: typeof context.hideEmpty === 'boolean' ? context.hideEmpty : true,
        };
        if (context.keyword)
            args.search = context.keyword;
        if (context.termIn?.length)
            args.include = context.termIn.join(',');
        if (context.termNotIn?.length)
            args.exclude = context.termNotIn.join(',');
        if (context.termParent)
            args.parent = context.termParent;
        return args;
    }, [context, postsPerPage]);
    // Fetch terms
    const { terms, hasResolved } = useSelect((select) => {
        const { getEntityRecords, hasFinishedResolution } = select(coreStore);
        const selectorArgs = ['taxonomy', taxonomy, queryArgs];
        return {
            terms: getEntityRecords(...selectorArgs),
            hasResolved: hasFinishedResolution('getEntityRecords', selectorArgs),
        };
    }, [taxonomy, queryArgs]);
    // Get layouts data from PHP
    const layoutsData = window.jankxDynamicTermContentLoopLayouts || window.jankxDynamicTermLayouts || DEFAULT_LAYOUTS_DATA;
    // Get available layouts for current taxonomy
    const availableLayouts = useMemo(() => {
        const layouts = [];
        // Use layoutsByTaxonomy which already includes common layouts
        if (layoutsData.layoutsByTaxonomy && typeof layoutsData.layoutsByTaxonomy === 'object' && taxonomy in layoutsData.layoutsByTaxonomy && Array.isArray(layoutsData.layoutsByTaxonomy[taxonomy])) {
            layoutsData.layoutsByTaxonomy[taxonomy].forEach((layoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        else if (layoutsData.commonLayouts) {
            // Fallback to common layouts if taxonomy specific layouts not found
            layoutsData.commonLayouts.forEach((layoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        return layouts;
    }, [taxonomy, layoutsData]);
    // Get default blocks for term items
    const defaultBlocks = useMemo(() => {
        const defaultBlocksData = window.jankxDynamicTermTemplateDefaultBlocks;
        if (Array.isArray(defaultBlocksData) && defaultBlocksData.length > 0) {
            return defaultBlocksData;
        }
        // Fallback: default term template (Name + Description + Count)
        return [
            { blockName: 'core/heading', attrs: { level: 3, className: 'jankx-term-name' } },
            { blockName: 'core/paragraph', attrs: { className: 'jankx-term-description' } },
            { blockName: 'core/paragraph', attrs: { className: 'jankx-term-count' } },
        ];
    }, []);
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
        className: `dynamic-data-template content-loop-layout--${templateLayout}`,
        ...(thumbnailPosition && { 'data-thumbnail-position': thumbnailPosition }),
        style: templateLayout === 'overlap-card' ? {
            '--jankx-overlap-margin-top': overlapMarginTop,
            '--jankx-overlap-padding': overlapPadding,
            '--jankx-overlap-radius': overlapBorderRadius,
            '--jankx-overlap-bg': overlapBackgroundColor,
        } : undefined,
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
        if (hasResolved && terms) {
            return Math.max(1, terms.length);
        }
        // Giới hạn tối đa 12 items cho performance khi loading
        return Math.min(Math.max(1, postsPerPage), 12);
    }, [postsPerPage, hasResolved, terms]);
    const viewportRef = useRef(null);
    const scrollBySlides = useCallback((n) => {
        const vp = viewportRef.current;
        if (!vp)
            return;
        const width = vp.clientWidth;
        const perSlide = width / Math.max(1, columns);
        vp.scrollBy({ left: n * perSlide * Math.max(1, slidesToScroll), behavior: 'smooth' });
    }, [columns, slidesToScroll]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Template Settings', 'jankx'), initialOpen: true, children: [_jsxs("div", { className: "jankx-layout-chooser", children: [_jsx("label", { className: "jankx-layout-chooser__label", children: __('Content Loop Layout', 'jankx') }), _jsx(ButtonGroup, { className: "jankx-layout-chooser__group", children: [
                                            { label: __('Default', 'jankx'), value: 'default' },
                                            { label: __('Boxed', 'jankx'), value: 'boxed' },
                                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                                            { label: __('Overlap Card', 'jankx'), value: 'overlap-card' },
                                            { label: __('Hero Overlay', 'jankx'), value: 'hero-overlay' },
                                        ].map((option) => (_jsx(Tooltip, { text: option.label, children: _jsx(Button, { isPressed: templateLayout === option.value, onClick: () => onLayoutChange(option.value), className: "jankx-layout-chooser__button", variant: templateLayout === option.value ? 'primary' : 'secondary', children: LAYOUT_ICONS[option.value] || option.label }) }, option.value))) }), _jsx("p", { className: "jankx-layout-chooser__help", children: __('Choose the overall item layout style. Changing this will reset item content.', 'jankx') })] }), _jsx(SelectControl, { label: __('Item Spacing', 'jankx'), value: itemSpacing, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Compact', 'jankx'), value: 'compact' },
                                    { label: __('Normal', 'jankx'), value: 'normal' },
                                    { label: __('Loose', 'jankx'), value: 'loose' },
                                ], onChange: (value) => setAttributes({ itemSpacing: value }) }), _jsx(ToggleControl, { label: __('Show Item Border', 'jankx'), checked: showItemBorder, onChange: (value) => setAttributes({ showItemBorder: value }) }), showItemBorder && (_jsx(RangeControl, { label: __('Border Radius', 'jankx'), value: itemBorderRadius, onChange: (value) => setAttributes({ itemBorderRadius: value || 0 }), min: 0, max: 50 }))] }), templateLayout === 'overlap-card' && (_jsxs(PanelBody, { title: __('Overlap Card Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('Margin Top', 'jankx'), value: overlapMarginTop, onChange: (value) => setAttributes({ overlapMarginTop: value }), help: __('Tiếp xúc với hình ảnh, e.g. -60px', 'jankx') }), _jsx(TextControl, { label: __('Padding', 'jankx'), value: overlapPadding, onChange: (value) => setAttributes({ overlapPadding: value }), help: __('e.g. 20px', 'jankx') }), _jsx(TextControl, { label: __('Border Radius', 'jankx'), value: overlapBorderRadius, onChange: (value) => setAttributes({ overlapBorderRadius: value }), help: __('e.g. 8px', 'jankx') }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Background Color', 'jankx') }), _jsx("div", { className: "components-color-palette-control__color-indicator-wrapper", children: _jsx("input", { type: "color", value: overlapBackgroundColor || '#ffffff', onChange: (e) => setAttributes({ overlapBackgroundColor: e.target.value }), style: { width: '100%', height: '40px' } }) })] })] })), templateLayout === 'hero-overlay' && (_jsxs(PanelBody, { title: __('Hero Overlay Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('Min Height', 'jankx'), value: heroMinHeight, onChange: (value) => setAttributes({ heroMinHeight: value }), help: __('e.g. 320px, 50vh', 'jankx') }), _jsx(TextControl, { label: __('Border Radius', 'jankx'), value: heroBorderRadius, onChange: (value) => setAttributes({ heroBorderRadius: value }), help: __('e.g. 12px, 0px', 'jankx') }), _jsx(TextControl, { label: __('Content Padding', 'jankx'), value: heroContentPadding, onChange: (value) => setAttributes({ heroContentPadding: value }), help: __('e.g. 5px 10px', 'jankx') }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Fallback Background', 'jankx') }), _jsx(TextControl, { label: "", value: heroFallbackBackground, onChange: (value) => setAttributes({ heroFallbackBackground: value }), help: __('Color or gradient shown when no featured image. e.g. #1a1a2e or linear-gradient(...)', 'jankx') })] }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Overlay Gradient', 'jankx') }), _jsx(TextControl, { label: "", value: heroOverlayGradient, onChange: (value) => setAttributes({ heroOverlayGradient: value }), help: __('CSS gradient for the dark overlay on top of the image.', 'jankx') })] })] })), _jsx(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: false, children: _jsx(SelectControl, { label: __('Thumbnail Position', 'jankx'), value: thumbnailPosition || 'top', options: [
                                { label: __('Top (Default)', 'jankx'), value: 'top' },
                                { label: __('Bottom', 'jankx'), value: 'bottom' },
                                { label: __('Left', 'jankx'), value: 'left' },
                                { label: __('Right', 'jankx'), value: 'right' },
                            ], onChange: (value) => setAttributes({ thumbnailPosition: value }), help: __('Choose where the featured image appears relative to the content.', 'jankx') }) })] }), _jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Overlay Icon Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Overlay Source', 'jankx'), value: (overlayIconType || 'class'), options: [
                                    { label: __('Icon Class', 'jankx'), value: 'class' },
                                    { label: __('Image', 'jankx'), value: 'image' },
                                    { label: __('Small Text/Symbol', 'jankx'), value: 'text' },
                                ], onChange: (value) => setAttributes({ overlayIconType: value }) }), overlayIconType === 'image' ? (_jsxs(_Fragment, { children: [_jsx(MediaUpload, { onSelect: (media) => {
                                            const url = media?.url || '';
                                            const id = media?.id || 0;
                                            setAttributes({
                                                overlayIconImageUrl: url,
                                                overlayIconImageId: id,
                                            });
                                        }, allowedTypes: ['image'], value: overlayIconImageId || 0, render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, children: overlayIconImageUrl ? __('Change Overlay Image', 'jankx') : __('Select Overlay Image', 'jankx') })) }), overlayIconImageUrl && (_jsxs("div", { style: { marginTop: 8 }, children: [_jsx("img", { src: overlayIconImageUrl, alt: "", style: { maxWidth: '100%', height: 'auto' } }), _jsx(Button, { variant: "secondary", onClick: () => setAttributes({ overlayIconImageUrl: '', overlayIconImageId: 0 }), style: { marginTop: 8 }, children: __('Remove Image', 'jankx') })] }))] })) : overlayIconType === 'text' ? (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Symbol Text', 'jankx'), value: overlayIconText, onChange: (value) => setAttributes({ overlayIconText: value }), help: __('Ví dụ: ▶, ★, ▷', 'jankx') }), _jsx(RangeControl, { label: __('Rotate (deg)', 'jankx'), value: overlayIconRotate || 0, onChange: (value) => setAttributes({ overlayIconRotate: value || 0 }), min: -180, max: 180, step: 1 })] })) : (_jsx(TextControl, { label: __('Icon Class', 'jankx'), value: overlayIcon, onChange: (value) => setAttributes({ overlayIcon: value }), help: __('Enter icon class (e.g., fas fa-play, dashicons-video-alt3)', 'jankx') })), (overlayIconType === 'image' ? !!overlayIconImageUrl : (overlayIconType === 'text' ? !!overlayIconText : !!overlayIcon)) && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Display Mode', 'jankx'), value: overlayIconShowMode || 'always-show', options: [
                                            { label: __('Always Show', 'jankx'), value: 'always-show' },
                                            { label: __('Show on Hover', 'jankx'), value: 'hover-show' },
                                            { label: __('Hide on Hover', 'jankx'), value: 'hover-hide' },
                                        ], onChange: (value) => setAttributes({ overlayIconShowMode: value }) }), _jsx(SelectControl, { label: __('Icon Position', 'jankx'), value: overlayIconPosition || 'center', options: [
                                            { label: __('Center', 'jankx'), value: 'center' },
                                            { label: __('Top Left', 'jankx'), value: 'top-left' },
                                            { label: __('Top Right', 'jankx'), value: 'top-right' },
                                            { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                            { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                        ], onChange: (value) => setAttributes({ overlayIconPosition: value }) }), _jsx(SelectControl, { label: __('Target Area', 'jankx'), value: overlayIconTarget || 'featured-image', options: [
                                            { label: __('Featured Image', 'jankx'), value: 'featured-image' },
                                            { label: __('Entry Image', 'jankx'), value: 'entry-image' },
                                            { label: __('Entire Item', 'jankx'), value: 'entire-item' },
                                        ], onChange: (value) => setAttributes({ overlayIconTarget: value }), help: __('Choose where the overlay icon should appear', 'jankx') }), _jsx(RangeControl, { label: __('Icon Size', 'jankx'), value: overlayIconSize || 24, onChange: (value) => setAttributes({ overlayIconSize: value || 24 }), min: 10, max: 100, step: 1 }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Icon Color', 'jankx') }), _jsx("div", { className: "components-color-palette-control__color-indicator-wrapper", children: _jsx("input", { type: "color", value: overlayIconColor || '#ffffff', onChange: (e) => setAttributes({ overlayIconColor: e.target.value }), style: { width: '100%', height: '40px' } }) })] }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Icon Background', 'jankx') }), _jsx("div", { className: "components-color-palette-control__color-indicator-wrapper", children: _jsx("input", { type: "color", value: overlayIconBackground || 'rgba(0, 0, 0, 0.5)', onChange: (e) => setAttributes({ overlayIconBackground: e.target.value }), style: { width: '100%', height: '40px' } }) }), _jsx("p", { className: "components-base-control__help", children: __('Use RGBA format for transparency (e.g., rgba(0,0,0,0.5))', 'jankx') })] })] }))] }), _jsxs(PanelBody, { title: __('Scroll Animation', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Animation Type', 'jankx'), value: animationType || 'none', options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Fade In', 'jankx'), value: 'fade-in' },
                                    { label: __('Fade In Up', 'jankx'), value: 'fade-in-up' },
                                    { label: __('Fade In Down', 'jankx'), value: 'fade-in-down' },
                                    { label: __('Fade In Left', 'jankx'), value: 'fade-in-left' },
                                    { label: __('Fade In Right', 'jankx'), value: 'fade-in-right' },
                                    { label: __('Zoom In', 'jankx'), value: 'zoom-in' },
                                    { label: __('Rotate In', 'jankx'), value: 'rotate-in' },
                                    { label: __('Flip In X', 'jankx'), value: 'flip-in-x' },
                                    { label: __('Flip In Y', 'jankx'), value: 'flip-in-y' },
                                    { label: __('Slide In Up', 'jankx'), value: 'slide-in-up' },
                                    { label: __('Slide In Down', 'jankx'), value: 'slide-in-down' },
                                    { label: __('Slide In Left', 'jankx'), value: 'slide-in-left' },
                                    { label: __('Slide In Right', 'jankx'), value: 'slide-in-right' },
                                ], onChange: (value) => setAttributes({ animationType: value }) }), animationType !== 'none' && (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Animation Duration (ms)', 'jankx'), value: animationDuration || 1000, onChange: (value) => setAttributes({ animationDuration: value || 1000 }), min: 100, max: 5000, step: 100 }), _jsx(RangeControl, { label: __('Animation Delay (ms)', 'jankx'), value: animationDelay || 0, onChange: (value) => setAttributes({ animationDelay: value || 0 }), min: 0, max: 5000, step: 100 }), _jsx(SelectControl, { label: __('Animation Target', 'jankx'), value: animationTarget || 'entry', options: [
                                            { label: __('Whole Item (Entry)', 'jankx'), value: 'entry' },
                                            { label: __('Thumbnail Only', 'jankx'), value: 'thumbnail' },
                                        ], onChange: (value) => setAttributes({ animationTarget: value }) }), _jsx(ToggleControl, { label: __('Reverse Animation on Scroll Out', 'jankx'), checked: animationReverse, onChange: (value) => setAttributes({ animationReverse: value }), help: __('Hide item when scroll back up', 'jankx') })] }))] }), _jsxs(PanelBody, { title: __('Hover Animation', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Hover Animation', 'jankx'), value: hoverAnimation, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Bounce', 'jankx'), value: 'bounce' },
                                    { label: __('Flash', 'jankx'), value: 'flash' },
                                    { label: __('Pulse', 'jankx'), value: 'pulse' },
                                    { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                                    { label: __('Shake X', 'jankx'), value: 'shakeX' },
                                    { label: __('Shake Y', 'jankx'), value: 'shakeY' },
                                    { label: __('Head Shake', 'jankx'), value: 'headShake' },
                                    { label: __('Swing', 'jankx'), value: 'swing' },
                                    { label: __('Tada', 'jankx'), value: 'tada' },
                                    { label: __('Wobble', 'jankx'), value: 'wobble' },
                                    { label: __('Jello', 'jankx'), value: 'jello' },
                                    { label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
                                    { label: __('Back In Down', 'jankx'), value: 'backInDown' },
                                    { label: __('Back In Up', 'jankx'), value: 'backInUp' },
                                    { label: __('Back In Left', 'jankx'), value: 'backInLeft' },
                                    { label: __('Back In Right', 'jankx'), value: 'backInRight' },
                                    { label: __('Bounce In', 'jankx'), value: 'bounceIn' },
                                    { label: __('Bounce In Down', 'jankx'), value: 'bounceInDown' },
                                    { label: __('Bounce In Up', 'jankx'), value: 'bounceInUp' },
                                    { label: __('Fade In', 'jankx'), value: 'fadeIn' },
                                    { label: __('Fade In Down', 'jankx'), value: 'fadeInDown' },
                                    { label: __('Fade In Up', 'jankx'), value: 'fadeInUp' },
                                    { label: __('Flip', 'jankx'), value: 'flip' },
                                    { label: __('Flip In X', 'jankx'), value: 'flipInX' },
                                    { label: __('Flip In Y', 'jankx'), value: 'flipInY' },
                                    { label: __('Light Speed In Right', 'jankx'), value: 'lightSpeedInRight' },
                                    { label: __('Light Speed In Left', 'jankx'), value: 'lightSpeedInLeft' },
                                    { label: __('Rotate In', 'jankx'), value: 'rotateIn' },
                                    { label: __('Zoom In', 'jankx'), value: 'zoomIn' },
                                    { label: __('Zoom Out', 'jankx'), value: 'zoomOut' },
                                    { label: __('Slide In Down', 'jankx'), value: 'slideInDown' },
                                    { label: __('Slide In Up', 'jankx'), value: 'slideInUp' },
                                    { label: __('Slide In Left', 'jankx'), value: 'slideInLeft' },
                                    { label: __('Slide In Right', 'jankx'), value: 'slideInRight' },
                                ], onChange: (value) => setAttributes({ hoverAnimation: value }), help: __('animate.css effect when hovering over an item', 'jankx') }), _jsx(SelectControl, { label: __('Unhover Animation', 'jankx'), value: unhoverAnimation, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('Bounce Out', 'jankx'), value: 'bounceOut' },
                                    { label: __('Bounce Out Down', 'jankx'), value: 'bounceOutDown' },
                                    { label: __('Bounce Out Up', 'jankx'), value: 'bounceOutUp' },
                                    { label: __('Fade Out', 'jankx'), value: 'fadeOut' },
                                    { label: __('Fade Out Down', 'jankx'), value: 'fadeOutDown' },
                                    { label: __('Fade Out Up', 'jankx'), value: 'fadeOutUp' },
                                    { label: __('Fade Out Left', 'jankx'), value: 'fadeOutLeft' },
                                    { label: __('Fade Out Right', 'jankx'), value: 'fadeOutRight' },
                                    { label: __('Flip Out X', 'jankx'), value: 'flipOutX' },
                                    { label: __('Flip Out Y', 'jankx'), value: 'flipOutY' },
                                    { label: __('Light Speed Out Right', 'jankx'), value: 'lightSpeedOutRight' },
                                    { label: __('Light Speed Out Left', 'jankx'), value: 'lightSpeedOutLeft' },
                                    { label: __('Rotate Out', 'jankx'), value: 'rotateOut' },
                                    { label: __('Zoom Out', 'jankx'), value: 'zoomOut' },
                                    { label: __('Slide Out Down', 'jankx'), value: 'slideOutDown' },
                                    { label: __('Slide Out Up', 'jankx'), value: 'slideOutUp' },
                                    { label: __('Slide Out Left', 'jankx'), value: 'slideOutLeft' },
                                    { label: __('Slide Out Right', 'jankx'), value: 'slideOutRight' },
                                    { label: __('Bounce', 'jankx'), value: 'bounce' },
                                    { label: __('Flash', 'jankx'), value: 'flash' },
                                    { label: __('Pulse', 'jankx'), value: 'pulse' },
                                    { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                                    { label: __('Shake X', 'jankx'), value: 'shakeX' },
                                    { label: __('Tada', 'jankx'), value: 'tada' },
                                ], onChange: (value) => setAttributes({ unhoverAnimation: value }), help: __('animate.css effect when mouse leaves an item', 'jankx') })] })] }), _jsx("div", { ...blockProps, children: displayLayout === 'carousel' ? (_jsxs("div", { className: `dynamic-data-template__carousel columns-${columns}`, children: [showArrows ? (_jsxs("div", { className: "dynamic-data-template__carousel-nav", children: [_jsx("button", { type: "button", className: "carousel-button prev", onClick: () => scrollBySlides(-1), children: "Prev" }), _jsx("button", { type: "button", className: "carousel-button next", onClick: () => scrollBySlides(1), children: "Next" })] })) : null, _jsx("div", { ref: viewportRef, className: "dynamic-data-template__carousel-viewport", style: {
                                overflow: 'hidden',
                            }, children: _jsx("div", { className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`, style: {
                                    '--columns-desktop': columns,
                                    '--columns-tablet': columnsTablet,
                                    '--columns-mobile': columnsMobile,
                                    display: 'flex',
                                    gap: '1rem',
                                    scrollSnapType: 'x mandatory',
                                }, children: Array.from({ length: totalItems }).map((_, index) => {
                                    const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
                                    const effectiveCols = Math.max(0.1, (columns || 1) + ((carouselPeek || 0) / 100));
                                    const itemStyle = {
                                        flex: `0 0 calc(100% / ${effectiveCols})`,
                                        width: `calc(100% / ${effectiveCols})`,
                                        maxWidth: `calc(100% / ${effectiveCols})`,
                                        scrollSnapAlign: carouselAlign,
                                    };
                                    if (animationType !== 'none') {
                                        itemStyle['--jankx-animation-duration'] = `${animationDuration}ms`;
                                        itemStyle['--jankx-animation-delay'] = `${index * animationDelay}ms`;
                                    }
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
                                    const termData = terms && terms[index] ? terms[index] : null;
                                    const contextValue = termData ? { postId: termData.id, postType: 'term', taxonomy, termId: termData.id } : {};
                                    if (index === 0) {
                                        return (_jsx("div", { className: `dynamic-data-template__item ${animationClass}`, "data-item-index": index, style: itemStyle, children: termData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx("div", { ...innerBlocksProps }) })) : (_jsx("div", { ...innerBlocksProps })) }, `item-${index}`));
                                    }
                                    return (_jsx("div", { className: `dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`, "data-item-index": index, style: itemStyle, children: termData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks, templateItemStyle: buildTemplateItemStyle(attributes), templateItemClassName: buildTemplateItemClasses(attributes) }) })) : (_jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks, templateItemStyle: buildTemplateItemStyle(attributes), templateItemClassName: buildTemplateItemClasses(attributes) })) }, `item-${index}`));
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
                        const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
                        const termData = terms && terms[index] ? terms[index] : null;
                        const contextValue = termData ? { postId: termData.id, postType: 'term', taxonomy, termId: termData.id } : {};
                        if (index === 0) {
                            const itemStyle2 = {};
                            if (animationType !== 'none') {
                                itemStyle2['--jankx-animation-duration'] = `${animationDuration}ms`;
                                itemStyle2['--jankx-animation-delay'] = `${index * animationDelay}ms`;
                            }
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
                            return (_jsx("div", { className: `dynamic-data-template__item ${animationClass}`, "data-item-index": index, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, style: itemStyle2, children: termData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx("div", { ...innerBlocksProps }) })) : (_jsx("div", { ...innerBlocksProps })) }, `item-${index}`));
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
                        return (_jsx("div", { className: `dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`, "data-item-index": index, "data-hover-ani": hoverAnimation !== 'none' ? hoverAnimation : undefined, "data-unhover-ani": unhoverAnimation !== 'none' ? unhoverAnimation : undefined, style: itemStyle3, children: termData ? (_jsx(BlockContextProvider, { value: contextValue, children: _jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks, templateItemStyle: buildTemplateItemStyle(attributes), templateItemClassName: buildTemplateItemClasses(attributes) }) })) : (_jsx(PreviewItem, { index: index, blocks: sharedInnerBlocks, templateItemStyle: buildTemplateItemStyle(attributes), templateItemClassName: buildTemplateItemClasses(attributes) })) }, `item-${index}`));
                    }) })) })] }));
}
