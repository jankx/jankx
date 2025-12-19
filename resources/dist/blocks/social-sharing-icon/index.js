import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
// Available social networks
const AVAILABLE_NETWORKS = [
    { value: 'facebook', label: 'Facebook', icon: 'f' },
    { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'W' },
    { value: 'telegram', label: 'Telegram', icon: 'T' },
    { value: 'pinterest', label: 'Pinterest', icon: 'P' },
    { value: 'reddit', label: 'Reddit', icon: 'R' },
    { value: 'email', label: 'Email', icon: '@' },
    { value: 'copy', label: 'Copy Link', icon: '🔗' },
    { value: 'messenger', label: 'Messenger', icon: 'M' },
    { value: 'viber', label: 'Viber', icon: 'V' },
    { value: 'line', label: 'Line', icon: 'L' },
];
const getNetworkData = (network) => {
    return AVAILABLE_NETWORKS.find((n) => n.value === network) || AVAILABLE_NETWORKS[0];
};
const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const { network, iconStyle, iconSize, showLabel, customIcon, customLabel } = attributes;
    // Check if block has inner blocks
    const hasInnerBlocks = useSelect((select) => {
        const { getBlockCount } = select('core/block-editor');
        return getBlockCount(clientId) > 0;
    }, [clientId]);
    const networkData = getNetworkData(network);
    const displayIcon = customIcon || networkData.icon;
    const displayLabel = customLabel || networkData.label;
    const blockProps = useBlockProps({
        className: 'social-sharing-icon-block',
    });
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsx(PanelBody, { title: __('Cài đặt mạng xã hội', 'jankx'), initialOpen: true, children: _jsx(SelectControl, { label: __('Mạng xã hội', 'jankx'), value: network, options: AVAILABLE_NETWORKS.map((n) => ({
                                label: n.label,
                                value: n.value,
                            })), onChange: (value) => setAttributes({ network: value }) }) }), _jsxs(PanelBody, { title: __('Kiểu hiển thị', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Kiểu icon', 'jankx'), value: iconStyle, options: [
                                    { label: __('Mặc định', 'jankx'), value: 'default' },
                                    { label: __('Có viền', 'jankx'), value: 'outlined' },
                                    { label: __('Đầy màu', 'jankx'), value: 'filled' },
                                    { label: __('Tròn', 'jankx'), value: 'rounded' },
                                    { label: __('Vuông', 'jankx'), value: 'square' },
                                ], onChange: (value) => setAttributes({ iconStyle: value }) }), _jsx(SelectControl, { label: __('Kích thước', 'jankx'), value: iconSize, options: [
                                    { label: __('Nhỏ', 'jankx'), value: 'small' },
                                    { label: __('Trung bình', 'jankx'), value: 'medium' },
                                    { label: __('Lớn', 'jankx'), value: 'large' },
                                ], onChange: (value) => setAttributes({ iconSize: value }) }), _jsx(ToggleControl, { label: __('Hiển thị nhãn', 'jankx'), checked: showLabel, onChange: (value) => setAttributes({ showLabel: value }) })] }), _jsxs(PanelBody, { title: __('Tùy chỉnh', 'jankx'), initialOpen: false, children: [_jsx("p", { className: "components-base-control__help", children: __('Chèn block icon (Icon Picker, SVG Icon, hoặc Image) bên dưới để custom icon. Nếu không chèn, sẽ dùng icon mặc định hoặc icon text.', 'jankx') }), _jsx(TextControl, { label: __('Icon tùy chỉnh (text)', 'jankx'), value: customIcon, onChange: (value) => setAttributes({ customIcon: value }), help: __('Chỉ dùng khi không chèn block icon', 'jankx') }), _jsx(TextControl, { label: __('Nhãn tùy chỉnh', 'jankx'), value: customLabel, onChange: (value) => setAttributes({ customLabel: value }), help: __('Để trống để dùng nhãn mặc định', 'jankx') })] })] }), _jsx("div", { ...blockProps, children: _jsxs("button", { className: `sharing-icon-button ${network} style-${iconStyle} size-${iconSize}`, "data-network": network, type: "button", children: [_jsx("span", { className: "sharing-icon sharing-icon-with-fallback", "data-fallback-icon": displayIcon, children: _jsx(InnerBlocks, { allowedBlocks: ['jankx/icon-picker', 'jankx/svg-icon', 'core/image'], template: [], templateLock: false, renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender }) }), showLabel && _jsx("span", { className: "sharing-label", children: displayLabel })] }) })] }));
};
const Save = (props) => {
    const { attributes } = props;
    const { network, iconStyle, iconSize, showLabel, customIcon, customLabel } = attributes;
    const networkData = getNetworkData(network);
    const displayIcon = customIcon || networkData.icon;
    const displayLabel = customLabel || networkData.label;
    const blockProps = useBlockProps.save({
        className: 'social-sharing-icon-block',
    });
    return (_jsx("div", { ...blockProps, children: _jsxs("button", { className: `sharing-icon-button ${network} style-${iconStyle} size-${iconSize}`, "data-network": network, type: "button", children: [_jsx("span", { className: "sharing-icon sharing-icon-with-fallback", "data-fallback-icon": displayIcon, children: _jsx(InnerBlocks.Content, {}) }), showLabel && _jsx("span", { className: "sharing-label", children: displayLabel })] }) }));
};
registerBlockType('jankx/social-sharing-icon', {
    edit: Edit,
    save: Save,
});
