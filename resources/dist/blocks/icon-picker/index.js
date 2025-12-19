import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { starFilled } from '@wordpress/icons';
import IconPicker from '../../shared/components/IconPicker';
import IconSettings from './components/IconSettings';
import LinkSettings from './components/LinkSettings';
const Edit = ({ attributes, setAttributes }) => {
    const { iconName, iconType, iconCategory, iconSet, iconSize, iconColor, iconAlignment, iconStyle, linkUrl, linkTarget, linkRel, showLabel, iconLabel, labelPosition, labelSize, labelColor, customClassName } = attributes;
    const blockProps = useBlockProps({
        className: `jankx-icon-picker-block jankx-icon-picker-block--${iconAlignment} ${customClassName || ''}`.trim()
    });
    const handleIconChange = (icon) => {
        setAttributes({
            iconName: icon.name,
            iconCategory: icon.category || '',
            iconSet: icon.iconSet || 'material'
        });
    };
    const handleIconTypeChange = (value) => {
        setAttributes({ iconType: value });
    };
    const handleIconCategoryChange = (value) => {
        setAttributes({ iconCategory: value });
    };
    const renderIcon = () => {
        if (!iconName) {
            return (_jsx("div", { className: "jankx-icon-picker-placeholder", children: __('Chọn icon từ Jankx Font Icons', 'jankx') }));
        }
        // Render icon based on iconSet
        if (iconSet === 'material') {
            const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
            return (_jsx("span", { className: styleClass, style: { fontSize: iconSize, color: iconColor }, children: iconName }));
        }
        else if (iconSet === 'fontawesome') {
            return (_jsx("i", { className: `fas fa-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        else if (iconSet === 'dashicons') {
            return (_jsx("span", { className: `dashicons dashicons-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        else if (iconType === 'custom') {
            return (_jsx("span", { className: `icon icon-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        // Fallback to material icons
        return (_jsx("span", { className: "material-icons", style: { fontSize: iconSize, color: iconColor }, children: iconName }));
    };
    const renderContent = () => {
        const iconElement = renderIcon();
        const finalLabelColor = labelColor || iconColor;
        if (linkUrl) {
            return (_jsxs("a", { href: linkUrl, target: linkTarget, rel: linkRel, className: "jankx-icon-picker-block__link", children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, style: { fontSize: labelSize, color: finalLabelColor }, children: iconLabel }))] }));
        }
        return (_jsxs(_Fragment, { children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, style: { fontSize: labelSize, color: finalLabelColor }, children: iconLabel }))] }));
    };
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsx(AlignmentToolbar, { value: iconAlignment, onChange: (alignment) => setAttributes({ iconAlignment: alignment || 'left' }) }) }), _jsxs(InspectorControls, { children: [_jsx(PanelBody, { title: __('Icon Selection', 'jankx'), icon: starFilled, initialOpen: true, children: _jsx(IconPicker, { value: iconName ? { name: iconName, category: iconCategory, iconSet: iconSet } : null, onChange: handleIconChange, iconType: iconType, category: iconCategory, onIconTypeChange: (value) => handleIconTypeChange(value), onCategoryChange: handleIconCategoryChange }) }), _jsx(IconSettings, { iconSize: iconSize, iconColor: iconColor, iconAlignment: iconAlignment, iconStyle: iconStyle, showLabel: showLabel, iconLabel: iconLabel, labelPosition: labelPosition, labelSize: labelSize, labelColor: labelColor, onIconSizeChange: (value) => setAttributes({ iconSize: value }), onIconColorChange: (value) => setAttributes({ iconColor: value }), onIconAlignmentChange: (value) => setAttributes({ iconAlignment: value }), onIconStyleChange: (value) => setAttributes({ iconStyle: value }), onShowLabelChange: (value) => setAttributes({ showLabel: value }), onIconLabelChange: (value) => setAttributes({ iconLabel: value }), onLabelPositionChange: (value) => setAttributes({ labelPosition: value }), onLabelSizeChange: (value) => setAttributes({ labelSize: value }), onLabelColorChange: (value) => setAttributes({ labelColor: value }) }), _jsx(LinkSettings, { linkUrl: linkUrl, linkTarget: linkTarget, linkRel: linkRel, onLinkChange: (value) => setAttributes({ linkUrl: value }), onLinkTargetChange: (value) => setAttributes({ linkTarget: value }), onLinkRelChange: (value) => setAttributes({ linkRel: value }) })] }), _jsx("div", { ...blockProps, children: _jsx("div", { className: "jankx-icon-picker-block__content", style: { textAlign: iconAlignment }, children: renderContent() }) })] }));
};
const Save = ({ attributes }) => {
    const { iconName, iconType, iconCategory, iconSet, iconSize, iconColor, iconAlignment, iconStyle, linkUrl, linkTarget, linkRel, showLabel, iconLabel, labelPosition, labelSize, labelColor, customClassName } = attributes;
    const blockProps = useBlockProps.save({
        className: `jankx-icon-picker-block jankx-icon-picker-block--${iconAlignment} ${customClassName || ''}`.trim()
    });
    const renderIcon = () => {
        if (!iconName) {
            return null;
        }
        // Render icon based on iconSet
        if (iconSet === 'material') {
            const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
            return (_jsx("span", { className: styleClass, style: { fontSize: iconSize, color: iconColor }, children: iconName }));
        }
        else if (iconSet === 'fontawesome') {
            return (_jsx("i", { className: `fas fa-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        else if (iconSet === 'dashicons') {
            return (_jsx("span", { className: `dashicons dashicons-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        else if (iconType === 'custom') {
            return (_jsx("span", { className: `icon icon-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        // Fallback to material icons
        return (_jsx("span", { className: "material-icons", style: { fontSize: iconSize, color: iconColor }, children: iconName }));
    };
    const renderContent = () => {
        const iconElement = renderIcon();
        const finalLabelColor = labelColor || iconColor;
        if (linkUrl) {
            return (_jsxs("a", { href: linkUrl, target: linkTarget, rel: linkRel, className: "jankx-icon-picker-block__link", children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, style: { fontSize: labelSize, color: finalLabelColor }, children: iconLabel }))] }));
        }
        return (_jsxs(_Fragment, { children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, style: { fontSize: labelSize, color: finalLabelColor }, children: iconLabel }))] }));
    };
    return (_jsx("div", { ...blockProps, children: _jsx("div", { className: "jankx-icon-picker-block__content", style: { textAlign: iconAlignment }, children: renderContent() }) }));
};
registerBlockType('jankx/icon-picker', {
    title: __('Icon Picker', 'jankx'),
    category: 'widgets',
    icon: 'star-filled',
    description: __('Chọn và hiển thị icon từ Jankx Font Icons System với khả năng thêm link và tùy chỉnh style', 'jankx'),
    keywords: ['icon', 'font', 'link', 'button', 'symbol', 'jankx'],
    supports: {
        html: false,
        align: true,
        alignWide: true,
        spacing: {
            margin: true,
            padding: true
        },
        color: {
            text: true,
            background: true
        },
        typography: {
            fontSize: true,
            lineHeight: true
        }
    },
    attributes: {
        iconName: { type: 'string', default: 'home' },
        iconType: { type: 'string', default: 'material' },
        iconCategory: { type: 'string', default: 'navigation' },
        iconSet: { type: 'string', default: 'material' },
        iconSize: { type: 'string', default: '24px' },
        iconColor: { type: 'string', default: '#333333' },
        iconAlignment: { type: 'string', default: 'left' },
        linkUrl: { type: 'string', default: '' },
        linkTarget: { type: 'string', default: '_self' },
        linkRel: { type: 'string', default: '' },
        showLabel: { type: 'boolean', default: false },
        iconLabel: { type: 'string', default: '' },
        labelPosition: { type: 'string', default: 'after' },
        labelSize: { type: 'string', default: '14px' },
        labelColor: { type: 'string', default: '' },
        customClassName: { type: 'string', default: '' },
        iconStyle: { type: 'string', default: 'filled' }
    },
    edit: Edit,
    save: Save
});
