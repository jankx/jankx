import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
export default function Edit({ attributes, setAttributes }) {
    const { tagName = 'hr', thickness = 2, widthPercent = 50, lineAlign = 'center' } = attributes;
    const blockProps = useBlockProps({
        className: `jankx-divider align-${lineAlign}`,
        style: {
            ['--divider-thickness']: `${thickness}px`,
            ['--divider-width']: `${widthPercent}%`,
        },
    });
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Line Settings', 'jankx'), initialOpen: true, children: [_jsx(RangeControl, { label: __('Độ dày (px)', 'jankx'), value: thickness, onChange: (v) => setAttributes({ thickness: v ?? 2 }), min: 1, max: 12 }), _jsx(RangeControl, { label: __('Chiều rộng (%)', 'jankx'), value: widthPercent, onChange: (v) => setAttributes({ widthPercent: v ?? 50 }), min: 10, max: 100 }), _jsx(SelectControl, { label: __('Căn lề', 'jankx'), value: lineAlign, options: [
                                { label: __('Trái', 'jankx'), value: 'left' },
                                { label: __('Giữa', 'jankx'), value: 'center' },
                                { label: __('Phải', 'jankx'), value: 'right' },
                            ], onChange: (v) => setAttributes({ lineAlign: v }) })] }) }), createElement(tagName, blockProps)] }));
}
