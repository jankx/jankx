import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Save({ attributes }) {
    const { label = '', placeholder = '', inputType = 'text', required = false, disabled = false, inputName = '', inputValue = '', width = '100%', borderRadius = 4, iconPosition = 'left', } = attributes;
    const blockProps = useBlockProps.save({
        className: `jankx-text-input-wrapper jankx-text-input-wrapper--has-icon jankx-text-input-wrapper--icon-${iconPosition}`,
        style: {
            width: width,
            position: 'relative',
        },
    });
    return (_jsxs("div", { ...blockProps, children: [label && _jsx("label", { className: "jankx-text-input-label", children: label }), _jsxs("div", { className: "jankx-text-input-container", style: { position: 'relative', display: 'flex', alignItems: 'center' }, children: [_jsx("div", { className: "jankx-text-input-icon-container", style: {
                            position: 'absolute',
                            [iconPosition]: '15px',
                            zIndex: 1,
                            pointerEvents: 'none',
                            display: 'flex',
                        }, children: _jsx(InnerBlocks.Content, {}) }), _jsx("input", { type: inputType, placeholder: placeholder, name: inputName, value: inputValue, required: required, disabled: disabled, className: "jankx-text-input", style: {
                            borderRadius: `${borderRadius}px`,
                            paddingLeft: iconPosition === 'left' ? '35px' : '10px',
                            paddingRight: iconPosition === 'right' ? '35px' : '10px',
                            width: '100%',
                        } })] })] }));
}
