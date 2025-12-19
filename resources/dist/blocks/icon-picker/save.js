import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useBlockProps } from '@wordpress/block-editor';
const Save = ({ attributes }) => {
    const { iconName, iconType, iconCategory, iconSize, iconColor, iconAlignment, iconStyle, linkUrl, linkTarget, linkRel, showLabel, iconLabel, labelPosition, customClassName } = attributes;
    const blockProps = useBlockProps.save({
        className: `jankx-icon-picker-block jankx-icon-picker-block--${iconAlignment} ${customClassName || ''}`.trim()
    });
    const renderIcon = () => {
        if (!iconName) {
            return null;
        }
        if (iconType === 'material') {
            const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
            return (_jsx("span", { className: styleClass, style: { fontSize: iconSize, color: iconColor }, children: iconName }));
        }
        else if (iconType === 'fontawesome') {
            const prefix = iconCategory === 'brands' ? 'fab' :
                iconCategory === 'regular' ? 'far' : 'fas';
            return (_jsx("i", { className: `${prefix} fa-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        else if (iconType === 'custom') {
            return (_jsx("span", { className: `icon icon-${iconName}`, style: { fontSize: iconSize, color: iconColor } }));
        }
        return null;
    };
    const renderContent = () => {
        const iconElement = renderIcon();
        if (linkUrl) {
            return (_jsxs("a", { href: linkUrl, target: linkTarget, rel: linkRel, className: "jankx-icon-picker-block__link", children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, children: iconLabel }))] }));
        }
        return (_jsxs(_Fragment, { children: [iconElement, showLabel && iconLabel && (_jsx("span", { className: `jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`, children: iconLabel }))] }));
    };
    return (_jsx("div", { ...blockProps, children: _jsx("div", { className: "jankx-icon-picker-block__content", style: { textAlign: iconAlignment }, children: renderContent() }) }));
};
export default Save;
