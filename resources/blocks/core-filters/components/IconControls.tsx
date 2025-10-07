/**
 * Icon Controls Component
 *
 * UI controls để chọn và cấu hình icons cho core blocks
 */

import { __ } from '@wordpress/i18n';
import {
    ToggleControl,
    SelectControl,
    TextControl,
    RangeControl,
    Button,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import MaterialIconPicker from './MaterialIconPicker';
import SvgIconInput from './SvgIconInput';

interface IconControlsProps {
    attributes: any;
    setAttributes: (attrs: any) => void;
}

const IconControls = ({ attributes, setAttributes }: IconControlsProps) => {
    const {
        hasIcon,
        iconType,
        iconName,
        iconStyle,
        iconSize,
        iconColor,
        iconPosition,
        imageUrl,
        imageAlt,
        imageSize,
        imageMarginRight,
        icon,
        width,
    } = attributes;

    return (
        <>
            <ToggleControl
                label={__('Enable Icon', 'jankx')}
                checked={hasIcon}
                onChange={(value) => setAttributes({ hasIcon: value })}
                help={__('Add an icon to this block', 'jankx')}
            />

            {hasIcon && (
                <>
                    <SelectControl
                        label={__('Icon Type', 'jankx')}
                        value={iconType}
                        options={[
                            { label: __('-- Select Icon Type --', 'jankx'), value: '' },
                            { label: __('Material Icon', 'jankx'), value: 'jankx/icon-button' },
                            { label: __('Image Icon', 'jankx'), value: 'jankx/image-button' },
                            { label: __('SVG Icon', 'jankx'), value: 'jankx/svg-icon' },
                        ]}
                        onChange={(value) => setAttributes({ iconType: value })}
                        help={__('Choose the type of icon to display', 'jankx')}
                    />

                    <SelectControl
                        label={__('Icon Position', 'jankx')}
                        value={iconPosition}
                        options={[
                            { label: __('Before Text', 'jankx'), value: 'before' },
                            { label: __('After Text', 'jankx'), value: 'after' },
                        ]}
                        onChange={(value) => setAttributes({ iconPosition: value })}
                    />

                    {/* Material Icon Settings */}
                    {iconType === 'jankx/icon-button' && (
                        <>
                            <MaterialIconPicker
                                value={iconName}
                                onChange={(value) => setAttributes({ iconName: value })}
                            />

                            <SelectControl
                                label={__('Icon Style', 'jankx')}
                                value={iconStyle}
                                options={[
                                    { label: __('Filled', 'jankx'), value: 'filled' },
                                    { label: __('Outlined', 'jankx'), value: 'outlined' },
                                    { label: __('Rounded', 'jankx'), value: 'rounded' },
                                    { label: __('Sharp', 'jankx'), value: 'sharp' },
                                    { label: __('Two Tone', 'jankx'), value: 'two-tone' },
                                ]}
                                onChange={(value) => setAttributes({ iconStyle: value })}
                            />

                            <UnitControl
                                label={__('Icon Size', 'jankx')}
                                value={iconSize}
                                onChange={(value) => setAttributes({ iconSize: value })}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                            />

                            <TextControl
                                label={__('Icon Color', 'jankx')}
                                value={iconColor}
                                onChange={(value) => setAttributes({ iconColor: value })}
                                help={__('CSS color value (e.g., #ff0000, red)', 'jankx')}
                            />
                        </>
                    )}

                    {/* Image Icon Settings */}
                    {iconType === 'jankx/image-button' && (
                        <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => {
                                        setAttributes({
                                            imageUrl: media.url,
                                            imageAlt: media.alt || '',
                                        });
                                    }}
                                    allowedTypes={['image']}
                                    value={imageUrl}
                                    render={({ open }) => (
                                        <>
                                            <Button
                                                onClick={open}
                                                variant="secondary"
                                                style={{ marginBottom: '10px' }}
                                            >
                                                {imageUrl
                                                    ? __('Change Image', 'jankx')
                                                    : __('Select Image', 'jankx')}
                                            </Button>
                                            {imageUrl && (
                                                <Button
                                                    onClick={() =>
                                                        setAttributes({ imageUrl: '', imageAlt: '' })
                                                    }
                                                    variant="link"
                                                    isDestructive
                                                >
                                                    {__('Remove Image', 'jankx')}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                />
                            </MediaUploadCheck>

                            {imageUrl && (
                                <div style={{ marginBottom: '15px' }}>
                                    <img
                                        src={imageUrl}
                                        alt={imageAlt}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}

                            <TextControl
                                label={__('Image Alt Text', 'jankx')}
                                value={imageAlt}
                                onChange={(value) => setAttributes({ imageAlt: value })}
                            />

                            <UnitControl
                                label={__('Image Height', 'jankx')}
                                value={imageSize}
                                onChange={(value) => setAttributes({ imageSize: value })}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                            />

                            <UnitControl
                                label={__('Image Margin Right', 'jankx')}
                                value={imageMarginRight}
                                onChange={(value) => setAttributes({ imageMarginRight: value })}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                            />
                        </>
                    )}

                    {/* SVG Icon Settings */}
                    {iconType === 'jankx/svg-icon' && (
                        <>
                            <SvgIconInput
                                value={icon}
                                onChange={(value) => setAttributes({ icon: value })}
                            />

                            <UnitControl
                                label={__('Icon Width', 'jankx')}
                                value={width}
                                onChange={(value) => setAttributes({ width: value })}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                            />

                            <TextControl
                                label={__('Icon Color', 'jankx')}
                                value={iconColor}
                                onChange={(value) => setAttributes({ iconColor: value })}
                                help={__('CSS color value (e.g., #ff0000, red)', 'jankx')}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default IconControls;

