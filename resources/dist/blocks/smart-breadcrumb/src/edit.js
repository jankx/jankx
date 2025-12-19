import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, BlockControls, useBlockProps, } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import ServerSideRender from '@wordpress/server-side-render';
import { SelectControl, ToggleControl, TextControl, Panel, PanelBody, PanelRow, Spinner, RangeControl, } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { getBreadcrumbStylePresetOptions } from './style-presets';
import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
    const { showHome, homeText, separator, showCurrent, maxDepth, stylePreset, useSeoPlugin, fallbackToCustom } = attributes;
    // Get block props with core styling support
    const blockProps = useBlockProps({
        className: [
            'wp-block-jankx-smart-breadcrumb',
            stylePreset && stylePreset !== 'default' ? `breadcrumb-style-${stylePreset}` : '',
        ].filter(Boolean).join(' '),
    });
    // Get the autoupdate option from WordPress php.
    const autoupdateOption = useSelect((select) => {
        const optionValue = select('core').getSite()?.jankx_autoupdate_enabled;
        if (Number(optionValue) !== 1) {
            return true;
        }
        return false;
    }, []);
    const { isSaving, isSavingNonPostChanges } = useSelect((select) => {
        const { isSavingPost, isSavingNonPostEntityChanges } = select(editorStore);
        return {
            isSaving: isSavingPost(),
            isSavingNonPostChanges: isSavingNonPostEntityChanges(),
        };
    });
    const advpanelicon = 'settings';
    const controls = (_jsx(BlockControls, { group: "block" }));
    const controlssidebar = (_jsxs(InspectorControls, { children: [_jsx(Panel, { children: _jsxs(PanelBody, { title: __('Breadcrumb Settings', 'jankx'), children: [_jsx(PanelRow, { children: _jsx(ToggleControl, { label: __('Show Home Link', 'jankx'), help: __('Display home page link in breadcrumb', 'jankx'), checked: showHome, onChange: (value) => setAttributes({ showHome: value }) }) }), showHome && (_jsx(PanelRow, { children: _jsx(TextControl, { label: __('Home Text', 'jankx'), help: __('Text for home page link', 'jankx'), value: homeText, onChange: (value) => setAttributes({ homeText: value }) }) })), _jsx(PanelRow, { children: _jsx(TextControl, { label: __('Separator', 'jankx'), help: __('Character or symbol to separate breadcrumb items', 'jankx'), value: separator, onChange: (value) => setAttributes({ separator: value }) }) }), _jsx(PanelRow, { children: _jsx(ToggleControl, { label: __('Show Current Page', 'jankx'), help: __('Display current page title in breadcrumb', 'jankx'), checked: showCurrent, onChange: (value) => setAttributes({ showCurrent: value }) }) }), _jsx(PanelRow, { children: _jsx(RangeControl, { label: __('Maximum Depth', 'jankx'), help: __('Maximum number of breadcrumb levels to display', 'jankx'), value: maxDepth, onChange: (value) => setAttributes({ maxDepth: value }), min: 1, max: 5 }) })] }) }), _jsx(Panel, { children: _jsxs(PanelBody, { title: __('SEO Plugin Integration', 'jankx'), icon: "admin-site", initialOpen: false, children: [_jsx(PanelRow, { children: _jsx(ToggleControl, { label: __('Use SEO Plugin Breadcrumb', 'jankx'), help: __('Try to use breadcrumb from installed SEO plugins (RankMath, Yoast, etc.)', 'jankx'), checked: useSeoPlugin, onChange: (value) => setAttributes({ useSeoPlugin: value }) }) }), _jsx(PanelRow, { children: _jsx(ToggleControl, { label: __('Fallback to Custom Breadcrumb', 'jankx'), help: __('Generate custom breadcrumb if SEO plugin breadcrumb is not available', 'jankx'), checked: fallbackToCustom, onChange: (value) => setAttributes({ fallbackToCustom: value }) }) })] }) }), _jsx(Panel, { children: _jsx(PanelBody, { title: __('Styles', 'jankx'), icon: "admin-appearance", initialOpen: false, children: _jsx(PanelRow, { children: _jsx(SelectControl, { label: __('Style Preset', 'jankx'), value: stylePreset, options: getBreadcrumbStylePresetOptions().map(option => ({
                                label: __(option.label, 'jankx'),
                                value: option.value
                            })), onChange: (value) => setAttributes({ stylePreset: value }) }) }) }) })] }));
    return (_jsxs("div", { ...blockProps, children: [controls, controlssidebar, autoupdateOption &&
                (isSaving || isSavingNonPostChanges) ? (_jsx(Spinner, {})) : (_jsx(ServerSideRender, { block: "jankx/smart-breadcrumb", attributes: attributes }))] }));
}
