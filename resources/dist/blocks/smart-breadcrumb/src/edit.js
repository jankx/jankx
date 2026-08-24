import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, useBlockProps, MediaUpload, MediaUploadCheck, } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import ServerSideRender from '@wordpress/server-side-render';
import { SelectControl, ToggleControl, TextControl, TextareaControl, Panel, PanelBody, PanelRow, Spinner, RangeControl, Button, BaseControl, } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { getBreadcrumbStylePresetOptions } from './style-presets';
import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
    const { showHome, homeItemType, homeItemText, homeItemIcon, homeItemSvg, homeItemImage, showHomeText, separator, showCurrent, maxDepth, stylePreset, useSeoPlugin, fallbackToCustom } = attributes;
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
    const controls = (_jsx(BlockControls, { group: "block" }));
    const controlssidebar = (_jsxs(InspectorControls, { children: [_jsx(Panel, { children: _jsxs(PanelBody, { title: __('Breadcrumb Settings', 'jankx'), children: [_jsx(ToggleControl, { label: __('Show Home Link', 'jankx'), help: __('Display home page link in breadcrumb', 'jankx'), checked: showHome, onChange: (value) => setAttributes({ showHome: value }) }), showHome && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Home Item Type', 'jankx'), value: homeItemType, options: [
                                        { label: __('Text', 'jankx'), value: 'text' },
                                        { label: __('CSS Icon (FontAwesome, etc.)', 'jankx'), value: 'css' },
                                        { label: __('SVG Code', 'jankx'), value: 'svg' },
                                        { label: __('Image', 'jankx'), value: 'image' },
                                    ], onChange: (value) => setAttributes({ homeItemType: value }) }), homeItemType === 'text' && (_jsx(TextControl, { label: __('Home Text', 'jankx'), value: homeItemText, onChange: (value) => setAttributes({ homeItemText: value }) })), homeItemType === 'css' && (_jsx(TextControl, { label: __('Icon Class', 'jankx'), help: __('e.g. fa fa-home', 'jankx'), value: homeItemIcon, onChange: (value) => setAttributes({ homeItemIcon: value }) })), homeItemType === 'svg' && (_jsx(TextareaControl, { label: __('SVG Code', 'jankx'), help: __('Paste raw SVG code here', 'jankx'), value: homeItemSvg, onChange: (value) => setAttributes({ homeItemSvg: value }) })), homeItemType === 'image' && (_jsx(BaseControl, { label: __('Home Image', 'jankx'), children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: (media) => setAttributes({ homeItemImage: { id: media.id, url: media.url } }), allowedTypes: ['image'], value: homeItemImage?.id, render: ({ open }) => (_jsx("div", { className: "jankx-media-upload-preview", children: homeItemImage?.url ? (_jsxs(_Fragment, { children: [_jsx("img", { src: homeItemImage.url, alt: "", style: { maxWidth: '100%', display: 'block', marginBottom: '10px' } }), _jsx(Button, { isSecondary: true, onClick: open, children: __('Replace Image', 'jankx') }), _jsx(Button, { isDestructive: true, onClick: () => setAttributes({ homeItemImage: null }), style: { marginLeft: '10px' }, children: __('Remove', 'jankx') })] })) : (_jsx(Button, { isPrimary: true, onClick: open, children: __('Select Image', 'jankx') })) })) }) }) })), homeItemType !== 'text' && (_jsx(ToggleControl, { label: __('Show Home Text', 'jankx'), checked: showHomeText, onChange: (value) => setAttributes({ showHomeText: value }) })), showHomeText && homeItemType !== 'text' && (_jsx(TextControl, { label: __('Home Text', 'jankx'), value: homeItemText, onChange: (value) => setAttributes({ homeItemText: value }) }))] })), _jsx(TextControl, { label: __('Separator', 'jankx'), help: __('Character or symbol to separate breadcrumb items', 'jankx'), value: separator, onChange: (value) => setAttributes({ separator: value }) }), _jsx(ToggleControl, { label: __('Show Current Page', 'jankx'), help: __('Display current page title in breadcrumb', 'jankx'), checked: showCurrent, onChange: (value) => setAttributes({ showCurrent: value }) }), _jsx(RangeControl, { label: __('Maximum Depth', 'jankx'), help: __('Maximum number of breadcrumb levels to display', 'jankx'), value: maxDepth, onChange: (value) => setAttributes({ maxDepth: value }), min: 1, max: 5 })] }) }), _jsx(Panel, { children: _jsxs(PanelBody, { title: __('SEO Plugin Integration', 'jankx'), icon: "admin-site", initialOpen: false, children: [_jsx(ToggleControl, { label: __('Use SEO Plugin Breadcrumb', 'jankx'), help: __('Try to use breadcrumb from installed SEO plugins (RankMath, Yoast, etc.)', 'jankx'), checked: useSeoPlugin, onChange: (value) => setAttributes({ useSeoPlugin: value }) }), _jsx(ToggleControl, { label: __('Fallback to Custom Breadcrumb', 'jankx'), help: __('Generate custom breadcrumb if SEO plugin breadcrumb is not available', 'jankx'), checked: fallbackToCustom, onChange: (value) => setAttributes({ fallbackToCustom: value }) })] }) }), _jsx(Panel, { children: _jsx(PanelBody, { title: __('Styles', 'jankx'), icon: "admin-appearance", initialOpen: false, children: _jsx(SelectControl, { label: __('Style Preset', 'jankx'), value: stylePreset, options: getBreadcrumbStylePresetOptions().map(option => ({
                            label: __(option.label, 'jankx'),
                            value: option.value
                        })), onChange: (value) => setAttributes({ stylePreset: value }) }) }) })] }));
    return (_jsxs("div", { ...blockProps, children: [controls, controlssidebar, autoupdateOption &&
                (isSaving || isSavingNonPostChanges) ? (_jsx(Spinner, {})) : (_jsx(ServerSideRender, { block: "jankx/smart-breadcrumb", attributes: attributes }))] }));
}
