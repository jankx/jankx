import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
export default function Edit({ attributes, setAttributes, clientId }) {
    const { imageSize = 'cover', overlayColor = 'rgba(0,0,0,0.4)', overlayOpacity = 40 } = attributes;
    const blockProps = useBlockProps({
        className: `carousel-slide embla__slide image-size-${imageSize}`,
        'data-image-size': imageSize
    });
    const innerBlocksProps = useInnerBlocksProps({
        className: 'carousel-slide__content'
    }, {
        templateLock: false
    });
    const opacity = overlayOpacity / 100;
    const overlayStyle = {
        backgroundColor: overlayColor,
        opacity: opacity,
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
    };
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsx(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: false, children: _jsx(SelectControl, { label: __('Background Image Size', 'jankx'), value: imageSize, options: [
                                { label: __('Cover', 'jankx'), value: 'cover' },
                                { label: __('Contain', 'jankx'), value: 'contain' },
                                { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
                            ], onChange: (val) => setAttributes({ imageSize: val }), help: __('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx') }) }), _jsxs(PanelBody, { title: __('Overlay Settings', 'jankx'), initialOpen: false, children: [_jsx("p", { children: __('Overlay Color', 'jankx') }), _jsx(ColorPalette, { value: overlayColor, onChange: (val) => setAttributes({ overlayColor: val || '' }) }), _jsx(RangeControl, { label: __('Overlay Opacity', 'jankx'), value: overlayOpacity, onChange: (val) => setAttributes({ overlayOpacity: val ?? 40 }), min: 0, max: 100 })] })] }), _jsxs("div", { ...blockProps, children: [_jsx("div", { className: "carousel-slide__overlay", style: overlayStyle }), _jsx("div", { ...innerBlocksProps })] })] }));
}
