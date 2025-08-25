import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ColorPicker,
    RangeControl,
    ToggleControl
} from '@wordpress/components';
import {
    color,
    typography,
    alignLeft,
    alignCenter,
    alignRight
} from '@wordpress/icons';

const IconSettings = ({
    iconSize,
    iconColor,
    iconAlignment,
    iconStyle,
    showLabel,
    iconLabel,
    labelPosition,
    onIconSizeChange,
    onIconColorChange,
    onIconAlignmentChange,
    onIconStyleChange,
    onShowLabelChange,
    onIconLabelChange,
    onLabelPositionChange
}) => {
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

    return (
        <PanelBody
            title={__('Icon Settings', 'jankx')}
            icon={color}
            initialOpen={false}
        >
            <SelectControl
                label={__('Icon Style', 'jankx')}
                value={iconStyle}
                options={iconStyleOptions}
                onChange={onIconStyleChange}
                help={__('Chọn style cho icon (Material Icons)', 'jankx')}
            />

            <TextControl
                label={__('Icon Size', 'jankx')}
                value={iconSize}
                onChange={onIconSizeChange}
                placeholder="24px"
                help={__('Kích thước icon (px, em, rem)', 'jankx')}
            />

            < div className = "jankx-icon-settings__color" >
                < label className = "jankx-icon-settings__label" >
                    {__('Icon Color', 'jankx')}
                <  / label >
                < ColorPicker
                    color = {iconColor}
                    onChangeComplete = {(color) => onIconColorChange(color.hex)}
                    enableAlpha = {false}
                /  >
            <  / div >

            < SelectControl
                label = {__('Alignment', 'jankx')}
                value = {iconAlignment}
                options = {alignmentOptions.map(option => ({
                    label: option.label,
                    value: option.value
                }))}
                onChange = {onIconAlignmentChange}
            /  >

            < ToggleControl
                label = {__('Show Label', 'jankx')}
                checked = {showLabel}
                onChange = {onShowLabelChange}
                help = {__('Hiển thị text label cùng với icon', 'jankx')}
            /  >

            {showLabel && (
                <  >
                    < TextControl
                        label = {__('Label Text', 'jankx')}
                        value = {iconLabel}
                        onChange = {onIconLabelChange}
                        placeholder = {__('Enter label text...', 'jankx')}
                    /  >

                    < SelectControl
                        label = {__('Label Position', 'jankx')}
                        value = {labelPosition}
                        options = {labelPositionOptions}
                        onChange = {onLabelPositionChange}
                    /  >
                <  / >
            )}
        <  / PanelBody >
    );
};

export default IconSettings;
