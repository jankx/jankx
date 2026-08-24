import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ColorPicker } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
export default function Edit({ attributes, setAttributes }) {
    const { displayType = 'absolute', position, offsetX, offsetY, backgroundColor, textColor, borderRadius, showLabel } = attributes;
    // Prepare styles for preview
    const style = {
        backgroundColor,
        color: textColor,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        padding: '8px 12px',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        boxShadow: displayType === 'absolute' ? '0 4px 10px rgba(0,0,0,0.12)' : 'none',
        lineHeight: 1,
        display: 'inline-block',
    };
    if (displayType === 'absolute') {
        style.position = 'absolute';
        if (position.includes('top'))
            style.top = offsetY;
        else
            style.bottom = offsetY;
        if (position.includes('right'))
            style.right = offsetX;
        else
            style.left = offsetX;
        style.zIndex = 20;
    }
    else {
        style.position = 'static';
        style.marginBottom = '0.5em';
    }
    const blockProps = useBlockProps({
        className: `jankx-post-type-badge ${displayType === 'absolute' ? `position-${position}` : 'display-normal'}`,
        style: displayType === 'absolute' ? { position: 'relative', minHeight: '50px', border: '1px dashed #ddd' } : {}
    });
    return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Position & Style', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Display Type', 'jankx'), value: displayType, options: [
                                { label: __('Absolute', 'jankx'), value: 'absolute' },
                                { label: __('Normal', 'jankx'), value: 'normal' },
                            ], onChange: (value) => setAttributes({ displayType: value }) }), displayType === 'absolute' && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Position', 'jankx'), value: position, options: [
                                        { label: __('Top Right', 'jankx'), value: 'top-right' },
                                        { label: __('Top Left', 'jankx'), value: 'top-left' },
                                        { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                        { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                    ], onChange: (value) => setAttributes({ position: value }) }), _jsx(TextControl, { label: __('Offset X (eg. 12px)', 'jankx'), value: offsetX, onChange: (value) => setAttributes({ offsetX: value }) }), _jsx(TextControl, { label: __('Offset Y (eg. 12px)', 'jankx'), value: offsetY, onChange: (value) => setAttributes({ offsetY: value }) })] })), _jsxs("div", { style: { marginTop: '12px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '6px' }, children: __('Background Color', 'jankx') }), _jsx(ColorPicker, { color: backgroundColor, onChangeComplete: (value) => setAttributes({ backgroundColor: value.hex }) })] }), _jsxs("div", { style: { marginTop: '12px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '6px' }, children: __('Text Color', 'jankx') }), _jsx(ColorPicker, { color: textColor, onChangeComplete: (value) => setAttributes({ textColor: value.hex }) })] }), _jsx(TextControl, { label: __('Border radius (px)', 'jankx'), type: "number", value: borderRadius, onChange: (value) => setAttributes({ borderRadius: parseInt(value) || 0 }) })] }) }), displayType === 'absolute' ? (_jsxs(_Fragment, { children: [_jsx("div", { style: style, children: __('Post Type', 'jankx') }), _jsx("div", { style: { padding: '20px', textAlign: 'center', opacity: 0.5 }, children: __('Post Content Area', 'jankx') })] })) : (_jsx("div", { style: style, children: __('Post Type', 'jankx') }))] }));
}
