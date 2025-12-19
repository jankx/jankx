import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';
registerBlockType('jankx/sticky-box', {
    edit: ({ attributes, setAttributes }) => {
        const { stickyEnabled = true, offsetTop = 16 } = attributes;
        const blockProps = useBlockProps({
            className: `jankx-sticky-box ${stickyEnabled ? 'sticky-enabled' : ''}`,
            style: { ['--sticky-top']: `${offsetTop}px` },
        });
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Sticky Settings', 'jankx'), initialOpen: true, children: [_jsx(ToggleControl, { label: __('Enable Sticky', 'jankx'), checked: stickyEnabled, onChange: (value) => setAttributes({ stickyEnabled: value }) }), _jsx(RangeControl, { label: __('Offset Top (px)', 'jankx'), value: offsetTop, onChange: (value) => setAttributes({ offsetTop: value ?? 16 }), min: 0, max: 200 })] }) }), _jsx("div", { ...blockProps, children: _jsx(InnerBlocks, {}) })] }));
    },
    save: () => _jsx(InnerBlocks.Content, {}),
});
