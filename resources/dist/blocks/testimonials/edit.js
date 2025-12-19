import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
export default function Edit({ attributes, setAttributes }) {
    const { asSlide, layout, slidesPerView, spaceBetween, loop, autoplay, autoplayDelay, navigation, pagination, height, minHeight, className, } = attributes;
    const updateLayout = (val) => {
        setAttributes({
            layout: val,
            asSlide: val === 'carousel' || val === 'banner',
        });
    };
    const blockProps = useBlockProps({
        className: `jankx-testimonials-editor ${className || ''}`.trim(),
        style: {
            '--swiper-height': `${height}px`,
            '--swiper-min-height': `${minHeight}px`,
        },
    });
    const innerBlocksProps = useInnerBlocksProps({ className: layout === 'carousel' || layout === 'banner' ? 'swiper-wrapper' : 'testimonials-wrapper' }, {
        allowedBlocks: ['jankx/testimonial'],
        templateLock: false,
        orientation: 'horizontal',
        renderAppender: () => _jsx(InnerBlocks.ButtonBlockAppender, {})
    });
    return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Testimonials Container', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Layout', 'jankx'), value: layout || 'default', options: [
                                { label: 'Default', value: 'default' },
                                { label: 'Grid', value: 'grid' },
                                { label: 'List', value: 'list' },
                                { label: 'Carousel', value: 'carousel' },
                                { label: 'Banner', value: 'banner' },
                            ], onChange: (v) => updateLayout(v) }), (layout === 'carousel' || layout === 'banner') && (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Slides per view', 'jankx'), value: slidesPerView || 1, min: 1, max: 6, onChange: (v) => setAttributes({ slidesPerView: v }) }), _jsx(RangeControl, { label: __('Space between', 'jankx'), value: spaceBetween || 30, min: 0, max: 100, onChange: (v) => setAttributes({ spaceBetween: v }) }), _jsx(ToggleControl, { label: __('Loop', 'jankx'), checked: !!loop, onChange: (v) => setAttributes({ loop: v }) }), _jsx(ToggleControl, { label: __('Autoplay', 'jankx'), checked: !!autoplay, onChange: (v) => setAttributes({ autoplay: v }) }), autoplay && (_jsx(RangeControl, { label: __('Autoplay Delay (ms)', 'jankx'), value: autoplayDelay || 3000, min: 1000, max: 10000, step: 500, onChange: (v) => setAttributes({ autoplayDelay: v }) })), _jsx(ToggleControl, { label: __('Navigation', 'jankx'), checked: navigation !== false, onChange: (v) => setAttributes({ navigation: v }) }), _jsx(ToggleControl, { label: __('Pagination', 'jankx'), checked: pagination !== false, onChange: (v) => setAttributes({ pagination: v }) })] })), _jsx(RangeControl, { label: __('Height (px)', 'jankx'), value: height || 50, min: 50, max: 1000, step: 50, onChange: (v) => setAttributes({ height: v }) }), _jsx(RangeControl, { label: __('Min Height (px)', 'jankx'), value: minHeight || 50, min: 50, max: 600, step: 50, onChange: (v) => setAttributes({ minHeight: v }) })] }) }), (layout === 'carousel' || layout === 'banner') ? (_jsxs("div", { className: "swiper", children: [_jsx("div", { ...innerBlocksProps }), navigation && (_jsxs(_Fragment, { children: [_jsx("div", { className: "swiper-button-prev" }), _jsx("div", { className: "swiper-button-next" })] })), pagination && _jsx("div", { className: "swiper-pagination" })] })) : (_jsx("div", { ...innerBlocksProps }))] }));
}
