import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    RangeControl,
    ColorPicker,
    Flex,
    FlexItem
} from '@wordpress/components';
import { color } from '@wordpress/icons';

interface IconSettingsProps {
    hasIcon: boolean;
    iconName: string;
    iconSet: string;
    iconPosition: 'before' | 'after';
    iconSize: string;
    iconColor: string;
    iconStyle: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';
    onHasIconChange: (value: boolean) => void;
    onIconNameChange: (name: string) => void;
    onIconSetChange: (set: string) => void;
    onIconPositionChange: (position: 'before' | 'after') => void;
    onIconSizeChange: (size: string) => void;
    onIconColorChange: (color: string) => void;
    onIconStyleChange: (style: IconSettingsProps['iconStyle']) => void;
}

const IconSettings = ({
    hasIcon,
    iconName,
    iconSet,
    iconPosition,
    iconSize,
    iconColor,
    iconStyle,
    onHasIconChange,
    onIconNameChange,
    onIconSetChange,
    onIconPositionChange,
    onIconSizeChange,
    onIconColorChange,
    onIconStyleChange
}: IconSettingsProps) => {
    // Parse size value and unit
    const parseSize = (size: string): { value: number; unit: string } => {
        const match = size.match(/^([\d.]+)(px|em|rem|%)$/);
        if (match) {
            return { value: parseFloat(match[1]), unit: match[2] };
        }
        return { value: 16, unit: 'px' };
    };

    const iconSizeData = parseSize(iconSize);

    const unitOptions = [
        { label: 'px', value: 'px' },
        { label: 'em', value: 'em' },
        { label: 'rem', value: 'rem' },
        { label: '%', value: '%' }
    ];

    const positionOptions = [
        { label: __('Before text', 'jankx'), value: 'before' },
        { label: __('After text', 'jankx'), value: 'after' }
    ];

    const iconSetOptions = [
        { label: 'Material Icons', value: 'material' },
        { label: 'FontAwesome', value: 'fontawesome' },
        { label: 'Dashicons', value: 'dashicons' }
    ];

    const styleOptions = [
        { label: __('Filled', 'jankx'), value: 'filled' },
        { label: __('Outlined', 'jankx'), value: 'outlined' },
        { label: __('Rounded', 'jankx'), value: 'rounded' },
        { label: __('Sharp', 'jankx'), value: 'sharp' },
        { label: __('Two-tone', 'jankx'), value: 'two-tone' }
    ];

    const getMinValue = (unit: string): number => {
        switch (unit) {
            case 'px': return 8;
            case 'em': return 0.5;
            case 'rem': return 0.5;
            case '%': return 10;
            default: return 8;
        }
    };

    const getMaxValue = (unit: string): number => {
        switch (unit) {
            case 'px': return 100;
            case 'em': return 10;
            case 'rem': return 10;
            case '%': return 200;
            default: return 100;
        }
    };

    const getStepValue = (unit: string): number => {
        switch (unit) {
            case 'px': return 1;
            case 'em': return 0.1;
            case 'rem': return 0.1;
            case '%': return 5;
            default: return 1;
        }
    };

    const handleIconSizeChange = (value: number | undefined): void => {
        if (value !== undefined) {
            onIconSizeChange(`${value}${iconSizeData.unit}`);
        }
    };

    const handleIconUnitChange = (unit: string): void => {
        const newValue = Math.min(Math.max(iconSizeData.value, getMinValue(unit)), getMaxValue(unit));
        onIconSizeChange(`${newValue}${unit}`);
    };

    return (
        <PanelBody
            title={__('Icon Settings', 'jankx')}
            icon={color}
            initialOpen={false}
        >
            <ToggleControl
                label={__('Show Icon', 'jankx')}
                checked={hasIcon}
                onChange={onHasIconChange}
                help={__('Thêm icon vào button', 'jankx')}
            />

            {hasIcon && (
                <>
                    <SelectControl
                        label={__('Icon Set', 'jankx')}
                        value={iconSet}
                        options={iconSetOptions}
                        onChange={(value: string) => onIconSetChange(value)}
                    />

                    <SelectControl
                        label={__('Icon Position', 'jankx')}
                        value={iconPosition}
                        options={positionOptions}
                        onChange={(value: string) => onIconPositionChange(value as 'before' | 'after')}
                    />

                    <SelectControl
                        label={__('Icon Style', 'jankx')}
                        value={iconStyle}
                        options={styleOptions}
                        onChange={(value: string) => onIconStyleChange(value as IconSettingsProps['iconStyle'])}
                    />

                    <div className="jankx-size-control">
                        <label className="jankx-size-control__label">
                            {__('Icon Size', 'jankx')}
                        </label>
                        <Flex gap={2} align="flex-end">
                            <FlexItem>
                                <RangeControl
                                    value={iconSizeData.value}
                                    onChange={handleIconSizeChange}
                                    min={getMinValue(iconSizeData.unit)}
                                    max={getMaxValue(iconSizeData.unit)}
                                    step={getStepValue(iconSizeData.unit)}
                                    help={__('Kích thước icon', 'jankx')}
                                />
                            </FlexItem>
                            <FlexItem>
                                <SelectControl
                                    value={iconSizeData.unit}
                                    options={unitOptions}
                                    onChange={(value: string) => handleIconUnitChange(value)}
                                    hideLabelFromVision={true}
                                    className="jankx-size-control__unit-select"
                                />
                            </FlexItem>
                        </Flex>
                    </div>

                    <div className="jankx-icon-settings__color">
                        <label className="jankx-icon-settings__label">
                            {__('Icon Color', 'jankx')}
                        </label>
                        <ColorPicker
                            color={iconColor}
                            onChangeComplete={(color) => onIconColorChange(typeof color === 'string' ? color : color.hex)}
                            enableAlpha={false}
                        />
                    </div>
                </>
            )}
        </PanelBody>
    );
};

export default IconSettings;
