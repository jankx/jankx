import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
export default function Edit({ attributes, setAttributes, clientId }) {
    const { imageSize = 'cover' } = attributes;
    const blockProps = useBlockProps({
        className: `swiper-slide image-size-${imageSize}`,
        'data-image-size': imageSize
    });
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        templateLock: false
    });
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: false, children: _jsx(SelectControl, { label: __('Background Image Size', 'jankx'), value: imageSize, options: [
                            { label: __('Cover', 'jankx'), value: 'cover' },
                            { label: __('Contain', 'jankx'), value: 'contain' },
                            { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
                        ], onChange: (val) => setAttributes({ imageSize: val }), help: __('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx') }) }) }), _jsx("div", { ...innerBlocksProps })] }));
}
