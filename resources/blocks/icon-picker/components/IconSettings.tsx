import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ColorPicker,
    RangeControl,
    ToggleControl,
    Button,
    Flex,
    FlexItem
} from '@wordpress/components';
import {
    color,
    typography,
    alignLeft,
    alignCenter,
    alignRight
} from '@wordpress/icons';

interface IconSettingsProps {
    iconSize: string;
    iconColor: string;
    iconAlignment: 'left' | 'center' | 'right';
    iconStyle: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';
    showLabel: boolean;
    iconLabel: string;
    labelPosition: 'before' | 'after' | 'above' | 'below';
    labelSize: string;
    labelColor: string;
    onIconSizeChange: (size: string) => void;
    onIconColorChange: (color: string) => void;
    onIconAlignmentChange: (alignment: 'left' | 'center' | 'right') => void;
    onIconStyleChange: (style: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone') => void;
    onShowLabelChange: (show: boolean) => void;
    onIconLabelChange: (label: string) => void;
    onLabelPositionChange: (position: 'before' | 'after' | 'above' | 'below') => void;
    onLabelSizeChange: (size: string) => void;
    onLabelColorChange: (color: string) => void;
}

type SizeUnit = 'px' | 'em' | 'rem' | '%';

const IconSettings = ({
    iconSize,
    iconColor,
    iconAlignment,
    iconStyle,
    showLabel,
    iconLabel,
    labelPosition,
    labelSize,
    labelColor,
    onIconSizeChange,
    onIconColorChange,
    onIconAlignmentChange,
    onIconStyleChange,
    onShowLabelChange,
    onIconLabelChange,
    onLabelPositionChange,
    onLabelSizeChange,
    onLabelColorChange
}: IconSettingsProps) => {
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
    const parseSize = (size: string): { value: number; unit: SizeUnit } => {
        const match = size.match(/^([\d.]+)(px|em|rem|%)?$/);
        if (match) {
            return {
                value: parseFloat(match[1]),
                unit: (match[2] as SizeUnit) || 'px'
            };
        }
        return { value: 24, unit: 'px' };
    };

    const getIconSizeData = () => parseSize((iconSize ?? '24px') as string);
    const getLabelSizeData = () => parseSize((labelSize ?? '14px') as string);

    const iconSizeData = getIconSizeData();
    const labelSizeData = getLabelSizeData();

    // Get max values based on unit
    const getMaxValue = (unit: SizeUnit): number => {
        switch (unit) {
            case 'px': return 100;
            case 'em': return 10;
            case 'rem': return 10;
            case '%': return 200;
            default: return 100;
        }
    };

    const getMinValue = (unit: SizeUnit): number => {
        switch (unit) {
            case 'px': return 8;
            case 'em': return 0.5;
            case 'rem': return 0.5;
            case '%': return 10;
            default: return 8;
        }
    };

    const getStepValue = (unit: SizeUnit): number => {
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

    const handleLabelSizeChange = (value: number | undefined): void => {
        if (value !== undefined) {
            onLabelSizeChange(`${value}${labelSizeData.unit}`);
        }
    };

    const handleIconUnitChange = (unit: SizeUnit): void => {
        const newValue = Math.min(Math.max(iconSizeData.value, getMinValue(unit)), getMaxValue(unit));
        onIconSizeChange(`${newValue}${unit}`);
    };

    const handleLabelUnitChange = (unit: SizeUnit): void => {
        const newValue = Math.min(Math.max(labelSizeData.value, getMinValue(unit)), getMaxValue(unit));
        onLabelSizeChange(`${newValue}${unit}`);
    };

    const handleIconColorChange = (color: string): void => {
        onIconColorChange(color);
        // Nếu label color chưa được set riêng, tự động sync với icon color
        if (!labelColor || labelColor === iconColor) {
            onLabelColorChange(color);
        }
    };

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
                onChange={(value: string) => onIconStyleChange(value as IconSettingsProps['iconStyle'])}
                help={__('Chọn style cho icon (Material Icons)', 'jankx')}
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
                            onChange={(value: string) => handleIconUnitChange(value as SizeUnit)}
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
                    onChangeComplete={(color) => handleIconColorChange(typeof color === 'string' ? color : color.hex)}
                    enableAlpha={false}
                />
            </div>

            <SelectControl
                label={__('Alignment', 'jankx')}
                value={iconAlignment}
                options={alignmentOptions.map(option => ({
                    label: option.label,
                    value: option.value
                }))}
                onChange={(value: string) => onIconAlignmentChange(value as IconSettingsProps['iconAlignment'])}
            />

            <ToggleControl
                label={__('Show Label', 'jankx')}
                checked={showLabel}
                onChange={onShowLabelChange}
                help={__('Hiển thị text label cùng với icon', 'jankx')}
            />

            {showLabel && (
                <>
                    <TextControl
                        label={__('Label Text', 'jankx')}
                        value={iconLabel}
                        onChange={onIconLabelChange}
                        placeholder={__('Enter label text...', 'jankx')}
                    />

                    <SelectControl
                        label={__('Label Position', 'jankx')}
                        value={labelPosition}
                        options={labelPositionOptions}
                        onChange={(value: string) => onLabelPositionChange(value as IconSettingsProps['labelPosition'])}
                    />

                    <div className="jankx-size-control">
                        <label className="jankx-size-control__label">
                            {__('Label Size', 'jankx')}
                        </label>
                        <Flex gap={2} align="flex-end">
                            <FlexItem>
                                <RangeControl
                                    value={labelSizeData.value}
                                    onChange={handleLabelSizeChange}
                                    min={getMinValue(labelSizeData.unit)}
                                    max={getMaxValue(labelSizeData.unit)}
                                    step={getStepValue(labelSizeData.unit)}
                                    help={__('Kích thước text label', 'jankx')}
                                />
                            </FlexItem>
                            <FlexItem>
                                <SelectControl
                                    value={labelSizeData.unit}
                                    options={unitOptions}
                                    onChange={(value: string) => handleLabelUnitChange(value as SizeUnit)}
                                    hideLabelFromVision={true}
                                    className="jankx-size-control__unit-select"
                                />
                            </FlexItem>
                        </Flex>
                    </div>

                    <div className="jankx-icon-settings__color">
                        <label className="jankx-icon-settings__label">
                            {__('Label Color', 'jankx')}
                        </label>
                        <ColorPicker
                            color={labelColor || iconColor}
                            onChangeComplete={(color) => onLabelColorChange(typeof color === 'string' ? color : color.hex)}
                            enableAlpha={false}
                        />
                        {(!labelColor || labelColor === iconColor) && (
                            <p className="jankx-icon-settings__color-help">
                                {__('Màu text giống với màu icon', 'jankx')}
                            </p>
                        )}
                    </div>
                </>
            )}
        </PanelBody>
    );
};

export default IconSettings;
