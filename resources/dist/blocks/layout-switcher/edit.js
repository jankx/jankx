import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, Placeholder, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
export default function Edit({ attributes, setAttributes, context }) {
    const { supportedLayouts, displayType, alignment } = attributes;
    const { postType, displayLayout } = context;
    const blockProps = useBlockProps({
        className: `jankx-layout-switcher-edit layout-switcher--align-${alignment}`
    });
    // Get layouts from localized data
    const layoutsData = window.jankxDynamicDataLayouts || {
        layoutsByPostType: {},
        commonLayouts: {}
    };
    const layoutsByPostType = layoutsData.layoutsByPostType || {};
    const availableLayouts = {
        ...(layoutsData.commonLayouts || {}),
        ...(postType && layoutsByPostType[postType] ? layoutsByPostType[postType] : {})
    };
    const layoutOptions = Object.keys(availableLayouts).map(name => ({
        name,
        title: availableLayouts[name]?.title || name,
        icon: availableLayouts[name]?.icon || 'layout'
    }));
    const toggleLayout = (name) => {
        const newLayouts = supportedLayouts.includes(name)
            ? supportedLayouts.filter(l => l !== name)
            : [...supportedLayouts, name];
        setAttributes({ supportedLayouts: newLayouts });
    };
    if (!context.queryId) {
        return (_jsx("div", { ...blockProps, children: _jsx(Placeholder, { icon: "layout", label: __('Layout Switcher', 'jankx'), instructions: __('Please place this block inside a Dynamic Data Layout block.', 'jankx') }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsx(AlignmentToolbar, { value: alignment, onChange: (val) => setAttributes({ alignment: val }) }) }), _jsxs(InspectorControls, { children: [_jsx(PanelBody, { title: __('Display Settings', 'jankx'), children: _jsx(SelectControl, { label: __('Display Type', 'jankx'), value: displayType, options: [
                                { label: __('Icons Only', 'jankx'), value: 'icons' },
                                { label: __('Labels Only', 'jankx'), value: 'labels' },
                                { label: __('Both', 'jankx'), value: 'both' }
                            ], onChange: (val) => setAttributes({ displayType: val }) }) }), _jsx(PanelBody, { title: __('Supported Layouts', 'jankx'), children: layoutOptions.map(layout => (_jsx(CheckboxControl, { label: layout.title, checked: supportedLayouts.includes(layout.name), onChange: () => toggleLayout(layout.name) }, layout.name))) })] }), _jsx("div", { ...blockProps, children: _jsx("div", { className: `jankx-layout-switcher layout-switcher--type-${displayType}`, children: _jsx("ul", { className: "layout-options", children: layoutOptions.filter(l => supportedLayouts.includes(l.name)).map(layout => (_jsx("li", { className: `layout-option ${displayLayout === layout.name ? 'is-active' : ''}`, children: _jsxs("button", { type: "button", children: [displayType !== 'labels' && (_jsx("span", { className: `layout-icon dashicons dashicons-${layout.icon.replace('dashicons-', '')}` })), displayType !== 'icons' && (_jsx("span", { className: "layout-label", children: layout.title }))] }) }, layout.name))) }) }) })] }));
}
