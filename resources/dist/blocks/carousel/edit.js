import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, useInnerBlocksProps, MediaUpload, MediaUploadCheck, BlockControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, Button, TabPanel, ColorPicker, ToolbarGroup, ToolbarButton, TextControl, TextareaControl, BaseControl } from '@wordpress/components';
import { gallery, cover, layout, quote } from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
// Utility function to convert hex to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};
// Render nav icon based on type
const renderNavIcon = (type, imageUrl, svgCode, iconClass, size, color, direction) => {
    const iconStyle = {
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || undefined
    };
    if (type === 'image' && imageUrl) {
        return (_jsx("img", { src: imageUrl, alt: direction === 'prev' ? 'Previous' : 'Next', style: { width: `${size}px`, height: `${size}px`, objectFit: 'contain' } }));
    }
    if (type === 'svg' && svgCode) {
        return (_jsx("span", { style: iconStyle, dangerouslySetInnerHTML: { __html: svgCode } }));
    }
    if (type === 'fonticon' && iconClass) {
        return (_jsx("span", { className: iconClass, style: { fontSize: `${size}px`, lineHeight: 1, color: color || undefined }, "aria-hidden": "true" }));
    }
    // Default: arrow (rendered by CSS ::after, no element needed)
    return null;
};
export default function Edit({ attributes, setAttributes, clientId }) {
    const { slidesPerView, slidesPerViewTablet, slidesPerViewMobile, spaceBetween, loop, autoplay, autoplayDelay, speed, navigation, pagination, effect, height, minHeight, contentMode, galleryImages, bannerStyle, bannerTextColor, bannerBackgroundColor, bannerPadding, bannerBorderRadius, gradientOverlay, gradientColor, gradientOpacity, gradientHeight, className, fitViewportMinusHeader = false, fullHeight = false, 
    // Navigation icon settings
    navIconType = 'arrow', prevIconImageId = 0, prevIconImageUrl = '', nextIconImageId = 0, nextIconImageUrl = '', prevIconSvg = '', nextIconSvg = '', prevIconClass = '', nextIconClass = '', navIconSize = 24, navIconColor = '', 
    // Navigation button settings
    navBtnWidth = 44, navBtnHeight = 44, navBtnBorderRadius = 50, navBtnBgColor = 'rgba(0,0,0,0.7)' } = attributes;
    // Get block's style variation
    const styleVariation = useSelect((select) => {
        const block = select('core/block-editor').getBlock(clientId);
        if (!block)
            return 'default';
        // Extract style variation from className
        const match = className?.match(/is-style-(\w+)/);
        return match ? match[1] : 'default';
    }, [clientId, className]);
    // Function to update style variation
    const updateStyleVariation = (variation) => {
        // Remove existing variation classes
        const currentClassName = className || '';
        const cleanedClassName = currentClassName
            .replace(/\bis-style-\w+\b/g, '')
            .trim();
        // Add new variation class
        const newVariationClass = variation === 'default' ? '' : `is-style-${variation}`;
        const newClassName = [cleanedClassName, newVariationClass].filter(Boolean).join(' ');
        setAttributes({ className: newClassName });
    };
    const gradientRgb = hexToRgb(gradientColor || '#000000');
    const blockProps = useBlockProps({
        className: `carousel-block banner-style-${bannerStyle} ${gradientOverlay ? 'has-gradient-overlay' : ''} ${className || ''} ${fitViewportMinusHeader ? 'fit-vh-minus-header' : ''} ${fullHeight ? 'is-full-height' : ''}`.trim(),
        style: {
            '--carousel-height': fullHeight ? '100vh' : `${height}px`,
            '--carousel-min-height': `${minHeight}px`,
            '--banner-style': bannerStyle,
            '--banner-text-color': bannerTextColor,
            '--banner-background-color': bannerBackgroundColor,
            '--banner-padding': `${bannerPadding}px`,
            '--banner-border-radius': `${bannerBorderRadius}px`,
            '--gradient-overlay-enabled': gradientOverlay ? '1' : '0',
            '--gradient-color-r': gradientRgb.r,
            '--gradient-color-g': gradientRgb.g,
            '--gradient-color-b': gradientRgb.b,
            '--gradient-opacity': gradientOpacity,
            '--gradient-height': `${gradientHeight}%`,
            '--slides-per-view-desktop': slidesPerView,
            '--slides-per-view-tablet': slidesPerViewTablet,
            '--slides-per-view-mobile': slidesPerViewMobile,
            '--space-between': `${spaceBetween}px`
        }
    });
    const innerBlocksProps = useInnerBlocksProps({ className: 'carousel-wrapper' }, {
        allowedBlocks: contentMode === 'slides'
            ? ['jankx/carousel-slide', 'jankx/carousel-inner-blocks-overlay']
            : ['jankx/carousel-banner', 'jankx/carousel-inner-blocks-overlay'],
        templateLock: false,
        orientation: 'horizontal',
        renderAppender: InnerBlocks.ButtonBlockAppender
    });
    const { hasInnerBlocks, slideCount, hasOverlay } = useSelect((select) => {
        const { getBlock } = select('core/block-editor');
        const block = getBlock(clientId);
        if (!block)
            return { hasInnerBlocks: false, slideCount: 0, hasOverlay: false };
        const count = block.innerBlocks.filter((b) => b.name !== 'jankx/carousel-inner-blocks-overlay').length;
        const overlay = block.innerBlocks.some((b) => b.name === 'jankx/carousel-inner-blocks-overlay');
        return {
            hasInnerBlocks: !!block.innerBlocks.length,
            slideCount: count,
            hasOverlay: overlay
        };
    }, [clientId]);
    // Handle gallery image selection
    const onSelectGalleryImages = (images) => {
        const galleryData = images.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt || '',
            caption: img.caption || ''
        }));
        setAttributes({ galleryImages: galleryData });
        // Create carousel-banner blocks for each image
        const bannerBlocks = images.map(img => createBlock('jankx/carousel-banner', {
            imageId: img.id,
            imageUrl: img.url,
            imageAlt: img.alt || '',
            imageCaption: img.caption || ''
        }));
        // Replace inner blocks with banner blocks
        wp.data.dispatch('core/block-editor').replaceInnerBlocks(clientId, bannerBlocks);
    };
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsxs(ToolbarGroup, { children: [_jsx(ToolbarButton, { icon: gallery, title: __('Default', 'jankx'), onClick: () => updateStyleVariation('default'), isActive: styleVariation === 'default' }), _jsx(ToolbarButton, { icon: cover, title: __('Banner', 'jankx'), onClick: () => updateStyleVariation('banner'), isActive: styleVariation === 'banner' }), _jsx(ToolbarButton, { icon: layout, title: __('Carousel', 'jankx'), onClick: () => updateStyleVariation('carousel'), isActive: styleVariation === 'carousel' }), _jsx(ToolbarButton, { icon: quote, title: __('Testimonial', 'jankx'), onClick: () => updateStyleVariation('testimonial'), isActive: styleVariation === 'testimonial' })] }) }), _jsxs("div", { ...blockProps, children: [_jsxs(InspectorControls, { children: [_jsx(TabPanel, { className: "carousel-tabs", activeClass: "is-active", onSelect: (tabName) => {
                                    if (tabName === 'gallery') {
                                        setAttributes({ contentMode: 'gallery' });
                                    }
                                    else {
                                        setAttributes({ contentMode: 'slides' });
                                    }
                                }, tabs: [
                                    {
                                        name: 'slides',
                                        title: __('Slides', 'jankx'),
                                        className: 'tab-slides'
                                    },
                                    {
                                        name: 'gallery',
                                        title: __('Gallery', 'jankx'),
                                        className: 'tab-gallery'
                                    }
                                ], children: (tab) => (_jsxs(_Fragment, { children: [tab.name === 'slides' && (_jsx(PanelBody, { title: __('Add Slides', 'jankx'), initialOpen: true, children: _jsx("p", { children: __('Use the + button to add individual slides', 'jankx') }) })), tab.name === 'gallery' && (_jsxs(PanelBody, { title: __('Select Images', 'jankx'), initialOpen: true, children: [_jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectGalleryImages, allowedTypes: ['image'], multiple: true, value: galleryImages.map(img => img.id), render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, style: { width: '100%', marginBottom: '10px' }, children: galleryImages.length > 0
                                                                ? __('Change Images', 'jankx')
                                                                : __('Select Images', 'jankx') })) }) }), galleryImages.length > 0 && (_jsxs("p", { children: [__('Selected', 'jankx'), ": ", galleryImages.length, " ", __('images', 'jankx')] }))] }))] })) }), _jsxs(PanelBody, { title: __('Slider Settings', 'jankx'), initialOpen: true, children: [(styleVariation === 'carousel' || styleVariation === 'testimonial') ? (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Slides Per View (Desktop)', 'jankx'), value: slidesPerView, onChange: (val) => setAttributes({ slidesPerView: val }), min: 1, max: 6, step: 1, help: __('Number of slides visible on desktop screens (≥1024px)', 'jankx') }), _jsx(RangeControl, { label: __('Slides Per View (Tablet)', 'jankx'), value: slidesPerViewTablet, onChange: (val) => setAttributes({ slidesPerViewTablet: val }), min: 1, max: 4, step: 1, help: __('Number of slides visible on tablet screens (768px - 1023px)', 'jankx') }), _jsx(RangeControl, { label: __('Slides Per View (Mobile)', 'jankx'), value: slidesPerViewMobile, onChange: (val) => setAttributes({ slidesPerViewMobile: val }), min: 1, max: 2, step: 1, help: __('Number of slides visible on mobile screens (<768px)', 'jankx') })] })) : (_jsx(RangeControl, { label: __('Slides Per View', 'jankx'), value: slidesPerView, onChange: (val) => setAttributes({ slidesPerView: val }), min: 1, max: 4, step: 1 })), _jsx(RangeControl, { label: __('Space Between (px)', 'jankx'), value: spaceBetween, onChange: (val) => setAttributes({ spaceBetween: val }), min: 0, max: 100, step: 10 }), _jsx(RangeControl, { label: __('Speed (ms)', 'jankx'), value: speed, onChange: (val) => setAttributes({ speed: val }), min: 100, max: 2000, step: 100 }), _jsx(RangeControl, { label: __('Height (px)', 'jankx'), value: height, onChange: (val) => setAttributes({ height: val || 400 }), min: 50, max: 1000, step: 50, help: __('Height for desktop (max-height on mobile)', 'jankx') }), _jsx(RangeControl, { label: __('Min Height (px)', 'jankx'), value: minHeight, onChange: (val) => setAttributes({ minHeight: val || 50 }), min: 50, max: 600, step: 50, help: __('Minimum height on mobile devices', 'jankx') }), _jsx(ToggleControl, { label: __('Fit Viewport (Minus Header)', 'jankx'), checked: !!fitViewportMinusHeader, onChange: (val) => setAttributes({ fitViewportMinusHeader: val }), help: __('Khi bật, Carousel sẽ lấp đầy phần còn lại của viewport sau header.', 'jankx') }), _jsx(ToggleControl, { label: __('Full Viewport Height (100vh)', 'jankx'), checked: !!fullHeight, onChange: (val) => setAttributes({ fullHeight: val }), help: __('Bật để Carousel cao bằng toàn bộ màn hình (thường dùng cho Hero).', 'jankx') }), _jsx(ToggleControl, { label: __('Loop', 'jankx'), checked: loop, onChange: (val) => setAttributes({ loop: val }) }), _jsx(ToggleControl, { label: __('Navigation', 'jankx'), checked: navigation, onChange: (val) => setAttributes({ navigation: val }) }), _jsx(ToggleControl, { label: __('Pagination', 'jankx'), checked: pagination, onChange: (val) => setAttributes({ pagination: val }) }), _jsx(ToggleControl, { label: __('Autoplay', 'jankx'), checked: autoplay, onChange: (val) => setAttributes({ autoplay: val }) }), autoplay && (_jsx(RangeControl, { label: __('Autoplay Delay (ms)', 'jankx'), value: autoplayDelay, onChange: (val) => setAttributes({ autoplayDelay: val }), min: 1000, max: 10000, step: 500 }))] }), _jsxs(PanelBody, { title: __('Banner Style Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Banner Style', 'jankx'), value: bannerStyle, options: [
                                            { label: __('Default', 'jankx'), value: 'default' },
                                            { label: __('Circles', 'jankx'), value: 'circles' },
                                            { label: __('Square', 'jankx'), value: 'square' },
                                            { label: __('Banner', 'jankx'), value: 'banner' }
                                        ], onChange: (val) => setAttributes({ bannerStyle: val }) }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' }, children: __('Text Color', 'jankx') }), _jsx(ColorPicker, { color: bannerTextColor || '#ffffff', onChange: (color) => setAttributes({ bannerTextColor: color }), enableAlpha: false })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' }, children: __('Background Color', 'jankx') }), _jsx(ColorPicker, { color: bannerBackgroundColor || '#000000', onChange: (color) => setAttributes({ bannerBackgroundColor: color }), enableAlpha: false })] }), _jsx(RangeControl, { label: __('Padding (px)', 'jankx'), value: bannerPadding, onChange: (val) => setAttributes({ bannerPadding: val }), min: 0, max: 50, step: 5 }), _jsx(RangeControl, { label: __('Border Radius (px)', 'jankx'), value: bannerBorderRadius, onChange: (val) => setAttributes({ bannerBorderRadius: val }), min: 0, max: 20, step: 1 })] }), _jsxs(PanelBody, { title: __('Gradient Overlay', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Enable Gradient Overlay', 'jankx'), checked: !!gradientOverlay, onChange: (val) => setAttributes({ gradientOverlay: val }), help: __('Add a gradient overlay from bottom to top with decreasing transparency', 'jankx') }), gradientOverlay && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' }, children: __('Gradient Color', 'jankx') }), _jsx(ColorPicker, { color: gradientColor || '#000000', onChange: (color) => setAttributes({ gradientColor: color }), enableAlpha: false })] }), _jsx(RangeControl, { label: __('Gradient Opacity', 'jankx'), value: gradientOpacity, onChange: (val) => setAttributes({ gradientOpacity: val }), min: 0, max: 1, step: 0.1, help: __('Transparency of the gradient (0 = fully transparent, 1 = fully opaque)', 'jankx') }), _jsx(RangeControl, { label: __('Gradient Height (%)', 'jankx'), value: gradientHeight, onChange: (val) => setAttributes({ gradientHeight: val }), min: 10, max: 100, step: 5, help: __('Height of the gradient overlay as percentage of slide height', 'jankx') })] }))] }), _jsxs(PanelBody, { title: __('Navigation Settings', 'jankx'), initialOpen: false, children: [_jsxs("div", { style: { marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0' }, children: __('Button Container Style', 'jankx') }), _jsx(RangeControl, { label: __('Button Width (px)', 'jankx'), value: navBtnWidth, onChange: (val) => setAttributes({ navBtnWidth: val || 44 }), min: 20, max: 100, step: 2 }), _jsx(RangeControl, { label: __('Button Height (px)', 'jankx'), value: navBtnHeight, onChange: (val) => setAttributes({ navBtnHeight: val || 44 }), min: 20, max: 100, step: 2 }), _jsx(RangeControl, { label: __('Border Radius (%)', 'jankx'), value: navBtnBorderRadius, onChange: (val) => setAttributes({ navBtnBorderRadius: typeof val !== 'undefined' ? val : 50 }), min: 0, max: 50, step: 1, help: __('0 for square, 50 for circle', 'jankx') }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' }, children: __('Button Background Color', 'jankx') }), _jsx(ColorPicker, { color: navBtnBgColor || 'rgba(0,0,0,0.7)', onChange: (color) => setAttributes({ navBtnBgColor: color }), enableAlpha: true })] })] }), _jsx("h4", { style: { margin: '0 0 12px 0' }, children: __('Icon Display', 'jankx') }), _jsx(SelectControl, { label: __('Icon Type', 'jankx'), value: navIconType, options: [
                                            { label: __('Arrow (CSS default)', 'jankx'), value: 'arrow' },
                                            { label: __('Image (PNG/JPG/SVG file)', 'jankx'), value: 'image' },
                                            { label: __('SVG Code', 'jankx'), value: 'svg' },
                                            { label: __('Font Icon (class)', 'jankx'), value: 'fonticon' }
                                        ], onChange: (val) => setAttributes({ navIconType: val }), help: __('Choose how to display the prev/next navigation icons', 'jankx') }), _jsx(RangeControl, { label: __('Icon Size (px)', 'jankx'), value: navIconSize, onChange: (val) => setAttributes({ navIconSize: val || 24 }), min: 12, max: 80, step: 2 }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' }, children: __('Icon Color', 'jankx') }), _jsx(ColorPicker, { color: navIconColor || '#ffffff', onChange: (color) => setAttributes({ navIconColor: color }), enableAlpha: true })] }), navIconType === 'image' && (_jsxs(_Fragment, { children: [_jsx(BaseControl, { label: __('Previous Button Icon', 'jankx'), id: "carousel-prev-icon", children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: (media) => setAttributes({ prevIconImageId: media.id, prevIconImageUrl: media.url }), allowedTypes: ['image'], value: prevIconImageId, render: ({ open }) => (_jsxs("div", { children: [prevIconImageUrl && (_jsx("img", { src: prevIconImageUrl, alt: "Prev icon", style: { width: `${navIconSize}px`, height: `${navIconSize}px`, objectFit: 'contain', display: 'block', marginBottom: '8px' } })), _jsx(Button, { variant: prevIconImageUrl ? 'secondary' : 'primary', onClick: open, style: { width: '100%' }, children: prevIconImageUrl ? __('Change Prev Icon', 'jankx') : __('Select Prev Icon', 'jankx') }), prevIconImageUrl && (_jsx(Button, { variant: "link", isDestructive: true, onClick: () => setAttributes({ prevIconImageId: 0, prevIconImageUrl: '' }), style: { display: 'block', marginTop: '4px' }, children: __('Remove', 'jankx') }))] })) }) }) }), _jsx(BaseControl, { label: __('Next Button Icon', 'jankx'), id: "carousel-next-icon", children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: (media) => setAttributes({ nextIconImageId: media.id, nextIconImageUrl: media.url }), allowedTypes: ['image'], value: nextIconImageId, render: ({ open }) => (_jsxs("div", { children: [nextIconImageUrl && (_jsx("img", { src: nextIconImageUrl, alt: "Next icon", style: { width: `${navIconSize}px`, height: `${navIconSize}px`, objectFit: 'contain', display: 'block', marginBottom: '8px' } })), _jsx(Button, { variant: nextIconImageUrl ? 'secondary' : 'primary', onClick: open, style: { width: '100%' }, children: nextIconImageUrl ? __('Change Next Icon', 'jankx') : __('Select Next Icon', 'jankx') }), nextIconImageUrl && (_jsx(Button, { variant: "link", isDestructive: true, onClick: () => setAttributes({ nextIconImageId: 0, nextIconImageUrl: '' }), style: { display: 'block', marginTop: '4px' }, children: __('Remove', 'jankx') }))] })) }) }) })] })), navIconType === 'svg' && (_jsxs(_Fragment, { children: [_jsx(TextareaControl, { label: __('Previous Button SVG', 'jankx'), value: prevIconSvg, onChange: (val) => setAttributes({ prevIconSvg: val }), placeholder: "<svg viewBox='0 0 24 24'>...</svg>", help: __('Paste the full SVG code for the previous button icon', 'jankx'), rows: 4 }), _jsx(TextareaControl, { label: __('Next Button SVG', 'jankx'), value: nextIconSvg, onChange: (val) => setAttributes({ nextIconSvg: val }), placeholder: "<svg viewBox='0 0 24 24'>...</svg>", help: __('Paste the full SVG code for the next button icon', 'jankx'), rows: 4 })] })), navIconType === 'fonticon' && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Previous Button Icon Class', 'jankx'), value: prevIconClass, onChange: (val) => setAttributes({ prevIconClass: val }), placeholder: "fas fa-chevron-left", help: __('CSS class(es) for the font icon (FontAwesome, Dashicons, etc.)', 'jankx') }), _jsx(TextControl, { label: __('Next Button Icon Class', 'jankx'), value: nextIconClass, onChange: (val) => setAttributes({ nextIconClass: val }), placeholder: "fas fa-chevron-right", help: __('CSS class(es) for the font icon (FontAwesome, Dashicons, etc.)', 'jankx') })] }))] })] }), _jsxs("div", { className: "embla", children: [!hasInnerBlocks && (_jsx("div", { className: "carousel-empty-hint", children: __('Carousel trống — nhấn nút + để thêm slide hoặc banner.', 'jankx') })), _jsx("div", { ...innerBlocksProps, className: `${innerBlocksProps.className} embla__container` }), navigation && slideCount > 1 && (_jsxs(_Fragment, { children: [_jsx("div", { className: `embla__button embla__button--prev${navIconType !== 'arrow' ? ' has-custom-icon' : ''}`, style: {
                                            width: `${navBtnWidth}px`,
                                            height: `${navBtnHeight}px`,
                                            borderRadius: `${navBtnBorderRadius}%`,
                                            backgroundColor: navBtnBgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2,
                                            position: 'absolute',
                                            left: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }, children: renderNavIcon(navIconType, prevIconImageUrl, prevIconSvg, prevIconClass, navIconSize, navIconColor, 'prev') }), _jsx("div", { className: `embla__button embla__button--next${navIconType !== 'arrow' ? ' has-custom-icon' : ''}`, style: {
                                            width: `${navBtnWidth}px`,
                                            height: `${navBtnHeight}px`,
                                            borderRadius: `${navBtnBorderRadius}%`,
                                            backgroundColor: navBtnBgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2,
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }, children: renderNavIcon(navIconType, nextIconImageUrl, nextIconSvg, nextIconClass, navIconSize, navIconColor, 'next') })] })), pagination && _jsx("div", { className: "embla__dots" })] })] })] }));
}
