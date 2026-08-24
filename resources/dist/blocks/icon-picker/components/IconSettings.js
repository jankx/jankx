import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl, ColorPicker, RangeControl, ToggleControl, Flex, FlexItem } from '@wordpress/components';
import { color, alignLeft, alignCenter, alignRight } from '@wordpress/icons';
const IconSettings = ({ iconSize, iconColor, iconAlignment, iconStyle, showLabel, iconLabel, labelPosition, labelSize, labelColor, onIconSizeChange, onIconColorChange, onIconAlignmentChange, onIconStyleChange, onShowLabelChange, onIconLabelChange, onLabelPositionChange, onLabelSizeChange, onLabelColorChange }) => {
    const alignmentOptions = [
        { label: __('Left', 'jankx'), value: 'left', icon: alignLeft },
        { label: __('Center', 'jankx'), value: 'center', icon: alignCenter },
        { label: __('Right', 'jankx'), value: 'right', icon: alignRight }
    ];
    const labelPositionOptions = [
        { label: __('Before icon', 'jankx'), value: 'before' },
        { label: __('After icon', 'jankx'), value: 'after' },
        { label: __('Above icon', 'jankx'), value: 'above' },
        { label: __('Below icon', 'jankx'), value: 'below' }
    ];
    const iconStyleOptions = [
        { label: __('Filled', 'jankx'), value: 'filled' },
        { label: __('Outlined', 'jankx'), value: 'outlined' },
        { label: __('Rounded', 'jankx'), value: 'rounded' },
        { label: __('Sharp', 'jankx'), value: 'sharp' },
        { label: __('Two-tone', 'jankx'), value: 'two-tone' }
    ];
    const unitOptions = [
        { label: 'px', value: 'px' },
        { label: 'em', value: 'em' },
        { label: 'rem', value: 'rem' },
        { label: '%', value: '%' }
    ];
    // Parse size and unit
    const parseSize = (size) => {
        const match = size.match(/^([\d.]+)(px|em|rem|%)?$/);
        if (match) {
            return {
                value: parseFloat(match[1]),
                unit: match[2] || 'px'
            };
        }
        return { value: 24, unit: 'px' };
    };
    const getIconSizeData = () => parseSize((iconSize ?? '24px'));
    const getLabelSizeData = () => parseSize((labelSize ?? '14px'));
    const iconSizeData = getIconSizeData();
    const labelSizeData = getLabelSizeData();
    // Get max values based on unit
    const getMaxValue = (unit) => {
        switch (unit) {
            case 'px': return 100;
            case 'em': return 10;
            case 'rem': return 10;
            case '%': return 200;
            default: return 100;
        }
    };
    const getMinValue = (unit) => {
        switch (unit) {
            case 'px': return 8;
            case 'em': return 0.5;
            case 'rem': return 0.5;
            case '%': return 10;
            default: return 8;
        }
    };
    const getStepValue = (unit) => {
        switch (unit) {
            case 'px': return 1;
            case 'em': return 0.1;
            case 'rem': return 0.1;
            case '%': return 5;
            default: return 1;
        }
    };
    const handleIconSizeChange = (value) => {
        if (value !== undefined) {
            onIconSizeChange(`${value}${iconSizeData.unit}`);
        }
    };
    const handleLabelSizeChange = (value) => {
        if (value !== undefined) {
            onLabelSizeChange(`${value}${labelSizeData.unit}`);
        }
    };
    const handleIconUnitChange = (unit) => {
        const newValue = Math.min(Math.max(iconSizeData.value, getMinValue(unit)), getMaxValue(unit));
        onIconSizeChange(`${newValue}${unit}`);
    };
    const handleLabelUnitChange = (unit) => {
        const newValue = Math.min(Math.max(labelSizeData.value, getMinValue(unit)), getMaxValue(unit));
        onLabelSizeChange(`${newValue}${unit}`);
    };
    const handleIconColorChange = (color) => {
        onIconColorChange(color);
        // Nếu label color chưa được set riêng, tự động sync với icon color
        if (!labelColor || labelColor === iconColor) {
            onLabelColorChange(color);
        }
    };
    return (_jsxs(PanelBody, { title: __('Icon Settings', 'jankx'), icon: color, initialOpen: false, children: [_jsx(SelectControl, { label: __('Icon Style', 'jankx'), value: iconStyle, options: iconStyleOptions, onChange: (value) => onIconStyleChange(value), help: __('Chọn style cho icon (Material Icons)', 'jankx') }), _jsxs("div", { className: "jankx-size-control", children: [_jsx("label", { className: "jankx-size-control__label", children: __('Icon Size', 'jankx') }), _jsxs(Flex, { gap: 2, align: "flex-end", children: [_jsx(FlexItem, { children: _jsx(RangeControl, { value: iconSizeData.value, onChange: handleIconSizeChange, min: getMinValue(iconSizeData.unit), max: getMaxValue(iconSizeData.unit), step: getStepValue(iconSizeData.unit), help: __('Kích thước icon', 'jankx') }) }), _jsx(FlexItem, { children: _jsx(SelectControl, { value: iconSizeData.unit, options: unitOptions, onChange: (value) => handleIconUnitChange(value), hideLabelFromVision: true, className: "jankx-size-control__unit-select" }) })] })] }), _jsxs("div", { className: "jankx-icon-settings__color", children: [_jsx("label", { className: "jankx-icon-settings__label", children: __('Icon Color', 'jankx') }), _jsx(ColorPicker, { color: iconColor, onChangeComplete: (color) => handleIconColorChange(typeof color === 'string' ? color : color.hex), enableAlpha: false })] }), _jsx(SelectControl, { label: __('Alignment', 'jankx'), value: iconAlignment, options: alignmentOptions.map(option => ({
                    label: option.label,
                    value: option.value
                })), onChange: (value) => onIconAlignmentChange(value) }), _jsx(ToggleControl, { label: __('Show Label', 'jankx'), checked: showLabel, onChange: onShowLabelChange, help: __('Hiển thị text label cùng với icon', 'jankx') }), showLabel && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Label Text', 'jankx'), value: iconLabel, onChange: onIconLabelChange, placeholder: __('Enter label text...', 'jankx') }), _jsx(SelectControl, { label: __('Label Position', 'jankx'), value: labelPosition, options: labelPositionOptions, onChange: (value) => onLabelPositionChange(value) }), _jsxs("div", { className: "jankx-size-control", children: [_jsx("label", { className: "jankx-size-control__label", children: __('Label Size', 'jankx') }), _jsxs(Flex, { gap: 2, align: "flex-end", children: [_jsx(FlexItem, { children: _jsx(RangeControl, { value: labelSizeData.value, onChange: handleLabelSizeChange, min: getMinValue(labelSizeData.unit), max: getMaxValue(labelSizeData.unit), step: getStepValue(labelSizeData.unit), help: __('Kích thước text label', 'jankx') }) }), _jsx(FlexItem, { children: _jsx(SelectControl, { value: labelSizeData.unit, options: unitOptions, onChange: (value) => handleLabelUnitChange(value), hideLabelFromVision: true, className: "jankx-size-control__unit-select" }) })] })] }), _jsxs("div", { className: "jankx-icon-settings__color", children: [_jsx("label", { className: "jankx-icon-settings__label", children: __('Label Color', 'jankx') }), _jsx(ColorPicker, { color: labelColor || iconColor, onChangeComplete: (color) => onLabelColorChange(typeof color === 'string' ? color : color.hex), enableAlpha: false }), (!labelColor || labelColor === iconColor) && (_jsx("p", { className: "jankx-icon-settings__color-help", children: __('Màu text giống với màu icon', 'jankx') }))] })] }))] }));
};
export default IconSettings;
