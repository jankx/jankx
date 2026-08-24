import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
export default function Edit({ attributes, setAttributes }) {
    const { label = '', placeholder = '', inputType = 'text', required = false, disabled = false, inputName = '', inputValue = '', width = '100%', borderRadius = 4, iconPosition = 'left', } = attributes;
    const { clientId } = useBlockProps();
    // Detect if text-input is a child of advanced-filter
    const isInsideAdvancedFilter = useSelect((select) => {
        const { getBlockParents, getBlock } = select('core/block-editor');
        const parents = getBlockParents(clientId) || [];
        return parents.some((id) => getBlock(id)?.name === 'jankx/advanced-filter');
    }, [clientId]);
    const blockProps = useBlockProps({
        className: `jankx-text-input-wrapper jankx-text-input-wrapper--has-icon jankx-text-input-wrapper--icon-${iconPosition}`,
        style: {
            width: width,
            position: 'relative',
        },
    });
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Input Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('Label', 'jankx'), value: label, onChange: (v) => setAttributes({ label: v }), help: __('Optional label text above the input', 'jankx') }), _jsx(TextControl, { label: __('Placeholder', 'jankx'), value: placeholder, onChange: (v) => setAttributes({ placeholder: v }) }), _jsx(SelectControl, { label: __('Input Type', 'jankx'), value: inputType, options: [
                                { label: __('Text', 'jankx'), value: 'text' },
                                { label: __('Email', 'jankx'), value: 'email' },
                                { label: __('Phone', 'jankx'), value: 'tel' },
                                { label: __('URL', 'jankx'), value: 'url' },
                                { label: __('Search', 'jankx'), value: 'search' },
                                { label: __('Password', 'jankx'), value: 'password' },
                                { label: __('Number', 'jankx'), value: 'number' },
                            ], onChange: (v) => setAttributes({ inputType: v }) }), !isInsideAdvancedFilter && (_jsx(TextControl, { label: __('Input Name', 'jankx'), value: inputName, onChange: (v) => setAttributes({ inputName: v }), help: __('Name attribute for form submission', 'jankx') })), isInsideAdvancedFilter && (_jsx("div", { style: { padding: '8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px', color: '#555' }, children: __('Input Name is automatically set to "keyword" when inside Advanced Filter', 'jankx') })), _jsx(TextControl, { label: __('Default Value', 'jankx'), value: inputValue, onChange: (v) => setAttributes({ inputValue: v }) }), _jsx(TextControl, { label: __('Width', 'jankx'), value: width, onChange: (v) => setAttributes({ width: v }), help: __('CSS width value (e.g., 100%, 300px, 50%)', 'jankx') }), _jsx(RangeControl, { label: __('Border Radius (px)', 'jankx'), value: borderRadius, onChange: (v) => setAttributes({ borderRadius: v ?? 4 }), min: 0, max: 50 }), _jsx(ToggleControl, { label: __('Required', 'jankx'), checked: required, onChange: (v) => setAttributes({ required: v }) }), _jsx(ToggleControl, { label: __('Disabled', 'jankx'), checked: disabled, onChange: (v) => setAttributes({ disabled: v }) }), _jsx(SelectControl, { label: __('Icon Position', 'jankx'), value: iconPosition, options: [
                                { label: __('Left', 'jankx'), value: 'left' },
                                { label: __('Right', 'jankx'), value: 'right' },
                            ], onChange: (v) => setAttributes({ iconPosition: v }) })] }) }), _jsxs("div", { ...blockProps, children: [label && _jsx("label", { className: "jankx-text-input-label", children: label }), _jsxs("div", { className: "jankx-text-input-container", style: { position: 'relative', display: 'flex', alignItems: 'center' }, children: [_jsx("div", { className: "jankx-text-input-icon-container", style: {
                                    position: 'absolute',
                                    [iconPosition]: '10px',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                }, children: _jsx(InnerBlocks, { allowedBlocks: ['jankx/svg-icon'], template: [['jankx/svg-icon', {}]], templateLock: false }) }), _jsx("input", { type: inputType, placeholder: placeholder, name: isInsideAdvancedFilter ? 'keyword' : inputName, value: inputValue, required: required, disabled: disabled, className: "jankx-text-input", style: {
                                    borderRadius: `${borderRadius}px`,
                                    paddingLeft: iconPosition === 'left' ? '35px' : '10px',
                                    paddingRight: iconPosition === 'right' ? '35px' : '10px',
                                    width: '100%',
                                } })] })] })] }));
}
