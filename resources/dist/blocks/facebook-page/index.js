import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';
const locales = [
    { label: 'Tiếng Việt (vi_VN)', value: 'vi_VN' },
    { label: 'English (en_US)', value: 'en_US' },
    { label: '日本語 (ja_JP)', value: 'ja_JP' },
    { label: '한국어 (ko_KR)', value: 'ko_KR' },
];
registerBlockType('jankx/facebook-page', {
    title: __('Facebook Page', 'jankx'),
    icon: 'share',
    category: 'jankx',
    attributes: {
        href: { type: 'string', default: '' },
        tabs: { type: 'string', default: 'timeline,events,messages' },
        width: { type: 'number', default: 380 },
        hideCover: { type: 'boolean', default: false },
        showFacepile: { type: 'boolean', default: true },
        smallHeader: { type: 'boolean', default: false },
        adaptContainerWidth: { type: 'boolean', default: true },
        locale: { type: 'string', default: 'vi_VN' },
        className: { type: 'string' },
    },
    edit({ attributes, setAttributes }) {
        const blockProps = useBlockProps({ className: 'jankx-facebook-page' });
        const { href, tabs, width, hideCover, showFacepile, smallHeader, adaptContainerWidth, locale } = attributes;
        return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Cấu hình Page Plugin', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('Facebook Page URL', 'jankx'), value: href, onChange: (v) => setAttributes({ href: v }), placeholder: "https://www.facebook.com/YourPage" }), _jsx(TextControl, { label: __('Tabs (CSV)', 'jankx'), help: __('Ví dụ: timeline,events,messages', 'jankx'), value: tabs, onChange: (v) => setAttributes({ tabs: v }) }), _jsx(NumberControl, { label: __('Chiều rộng (px)', 'jankx'), value: width, onChange: (v) => setAttributes({ width: typeof v === 'number' ? v : 380 }), min: 180, max: 1200 }), _jsx(SelectControl, { label: __('Ngôn ngữ SDK', 'jankx'), value: locale, options: locales, onChange: (v) => setAttributes({ locale: v }) }), _jsx(ToggleControl, { label: __('Ẩn cover', 'jankx'), checked: hideCover, onChange: (v) => setAttributes({ hideCover: v }) }), _jsx(ToggleControl, { label: __('Hiển thị bạn bè', 'jankx'), checked: showFacepile, onChange: (v) => setAttributes({ showFacepile: v }) }), _jsx(ToggleControl, { label: __('Header nhỏ', 'jankx'), checked: smallHeader, onChange: (v) => setAttributes({ smallHeader: v }) }), _jsx(ToggleControl, { label: __('Tự co theo container', 'jankx'), checked: adaptContainerWidth, onChange: (v) => setAttributes({ adaptContainerWidth: v }) })] }) }), _jsx("div", { className: "fb-page-preview", children: _jsx("div", { className: "fb-page", "data-href": href || 'https://www.facebook.com/facebookapp', "data-tabs": tabs, "data-width": String(width), "data-hide-cover": String(hideCover), "data-show-facepile": String(showFacepile), "data-small-header": String(smallHeader), "data-adapt-container-width": String(adaptContainerWidth), "data-locale": locale }) })] }));
    },
    save({ attributes }) {
        const { href, tabs, width, hideCover, showFacepile, smallHeader, adaptContainerWidth, locale } = attributes;
        const blockProps = useBlockProps.save({ className: 'jankx-facebook-page' });
        return (_jsx("div", { ...blockProps, children: _jsx("div", { className: "fb-page", "data-href": href, "data-tabs": tabs, "data-width": String(width), "data-hide-cover": String(hideCover), "data-show-facepile": String(showFacepile), "data-small-header": String(smallHeader), "data-adapt-container-width": String(adaptContainerWidth), "data-locale": locale }) }));
    },
});
