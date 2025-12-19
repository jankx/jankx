import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
// Available social networks from vanilla-sharing
const AVAILABLE_NETWORKS = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'email', label: 'Email' },
    { value: 'copy', label: 'Copy Link' },
    { value: 'messenger', label: 'Messenger' },
    { value: 'viber', label: 'Viber' },
    { value: 'line', label: 'Line' },
];
const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const { networks, iconSize, showLabels, style, alignment, showHeading, headingText } = attributes;
    const { replaceInnerBlocks } = useDispatch('core/block-editor');
    const innerBlocks = useSelect((select) => select('core/block-editor').getBlocks(clientId), [clientId]);
    // Sync inner blocks with networks attribute
    useEffect(() => {
        const currentNetworks = innerBlocks.map((block) => block.attributes.network);
        const networksChanged = networks.length !== currentNetworks.length ||
            networks.some((net) => !currentNetworks.includes(net));
        if (networksChanged) {
            const newBlocks = networks.map((network) => createBlock('jankx/social-sharing-icon', {
                network,
                iconStyle: style,
                iconSize,
                showLabel: showLabels,
            }));
            replaceInnerBlocks(clientId, newBlocks, false);
        }
    }, [networks, clientId, replaceInnerBlocks]);
    // Update child blocks when parent settings change
    useEffect(() => {
        if (innerBlocks.length > 0) {
            const updatedBlocks = innerBlocks.map((block) => ({
                ...block,
                attributes: {
                    ...block.attributes,
                    iconStyle: style,
                    iconSize,
                    showLabel: showLabels,
                }
            }));
            replaceInnerBlocks(clientId, updatedBlocks, false);
        }
    }, [iconSize, showLabels, style]);
    const blockProps = useBlockProps({
        className: `social-sharing-block alignment-${alignment}`,
    });
    const innerBlocksProps = useInnerBlocksProps({ className: 'sharing-buttons' }, {
        allowedBlocks: ['jankx/social-sharing-icon'],
        template: networks.map((network) => [
            'jankx/social-sharing-icon',
            {
                network,
                iconStyle: style,
                iconSize,
                showLabel: showLabels,
            }
        ]),
        templateLock: 'insert',
        renderAppender: false,
    });
    const toggleNetwork = (network) => {
        const newNetworks = networks.includes(network)
            ? networks.filter((n) => n !== network)
            : [...networks, network];
        setAttributes({ networks: newNetworks });
    };
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Cài đặt mạng xã hội', 'jankx'), initialOpen: true, children: [_jsx("p", { children: _jsx("strong", { children: __('Chọn các nền tảng chia sẻ:', 'jankx') }) }), AVAILABLE_NETWORKS.map((network) => (_jsx(CheckboxControl, { label: network.label, checked: networks.includes(network.value), onChange: () => toggleNetwork(network.value) }, network.value)))] }), _jsxs(PanelBody, { title: __('Hiển thị', 'jankx'), initialOpen: true, children: [_jsx(ToggleControl, { label: __('Hiển thị tiêu đề', 'jankx'), checked: showHeading, onChange: (value) => setAttributes({ showHeading: value }) }), showHeading && (_jsx(TextControl, { label: __('Nội dung tiêu đề', 'jankx'), value: headingText, onChange: (value) => setAttributes({ headingText: value }), placeholder: __('Chia sẻ:', 'jankx') })), _jsx(SelectControl, { label: __('Kích thước icon', 'jankx'), value: iconSize, options: [
                                    { label: __('Nhỏ', 'jankx'), value: 'small' },
                                    { label: __('Trung bình', 'jankx'), value: 'medium' },
                                    { label: __('Lớn', 'jankx'), value: 'large' },
                                ], onChange: (value) => setAttributes({ iconSize: value }) }), _jsx(ToggleControl, { label: __('Hiển thị nhãn', 'jankx'), checked: showLabels, onChange: (value) => setAttributes({ showLabels: value }) }), _jsx(SelectControl, { label: __('Kiểu hiển thị', 'jankx'), value: style, options: [
                                    { label: __('Mặc định', 'jankx'), value: 'default' },
                                    { label: __('Có viền', 'jankx'), value: 'outlined' },
                                    { label: __('Đầy màu', 'jankx'), value: 'filled' },
                                    { label: __('Tròn', 'jankx'), value: 'rounded' },
                                ], onChange: (value) => setAttributes({ style: value }) }), _jsx(SelectControl, { label: __('Căn chỉnh', 'jankx'), value: alignment, options: [
                                    { label: __('Trái', 'jankx'), value: 'left' },
                                    { label: __('Giữa', 'jankx'), value: 'center' },
                                    { label: __('Phải', 'jankx'), value: 'right' },
                                ], onChange: (value) => setAttributes({ alignment: value }) })] })] }), _jsx("div", { ...blockProps, children: networks.length > 0 ? (_jsxs(_Fragment, { children: [showHeading && headingText && (_jsx("div", { className: "sharing-title", children: _jsx("strong", { children: headingText }) })), _jsx("div", { ...innerBlocksProps })] })) : (_jsx("p", { className: "no-networks", children: __('Vui lòng chọn ít nhất một mạng xã hội từ panel bên phải', 'jankx') })) })] }));
};
const Save = (props) => {
    const { attributes } = props;
    const { alignment, showHeading, headingText } = attributes;
    const blockProps = useBlockProps.save({
        className: `social-sharing-block alignment-${alignment}`,
    });
    return (_jsxs("div", { ...blockProps, children: [showHeading && headingText && (_jsx("div", { className: "sharing-title", children: _jsx("strong", { children: headingText }) })), _jsx("div", { className: "sharing-buttons", children: _jsx(InnerBlocks.Content, {}) })] }));
};
registerBlockType('jankx/social-sharing', {
    edit: Edit,
    save: Save,
});
