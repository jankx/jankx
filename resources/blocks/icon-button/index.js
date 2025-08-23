import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import React from 'react';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    RichText,
    URLInput,
    ColorPalette,
    useSetting,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    Button,
    ButtonGroup,
    __experimentalBoxControl as BoxControl
} from '@wordpress/components';
import {
    button,
    settings,
    link,
    unlink,
    plus,
    trash
} from '@wordpress/icons';

// Import IconPicker block
import IconPicker from '../icon-picker/components/IconPicker';

const Edit = ({ attributes, setAttributes, isSelected }) => {
    const {
        text,
        url,
        linkTarget,
        rel,
        buttonType,
        buttonSize,
        buttonStyle,
        buttonWidth,
        iconPosition,
        iconSpacing,
        showIcon,
        iconType,
        fontIcon,
        customIcon,
        iconSize,
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-icon-button jankx-icon-button--${buttonType} jankx-icon-button--${buttonSize} jankx-icon-button--${buttonStyle} ${customClassName || ''}`.trim()
    });

    const colors = useSetting('color.palette') || [];
    const hasColors = colors.length > 0;

    const buttonTypeOptions = [
        { label: __('Primary', 'jankx'), value: 'primary' },
        { label: __('Secondary', 'jankx'), value: 'secondary' },
        { label: __('Success', 'jankx'), value: 'success' },
        { label: __('Warning', 'jankx'), value: 'warning' },
        { label: __('Danger', 'jankx'), value: 'danger' },
        { label: __('Info', 'jankx'), value: 'info' },
        { label: __('Light', 'jankx'), value: 'light' },
        { label: __('Dark', 'jankx'), value: 'dark' }
    ];

    const buttonSizeOptions = [
        { label: __('Small', 'jankx'), value: 'small' },
        { label: __('Medium', 'jankx'), value: 'medium' },
        { label: __('Large', 'jankx'), value: 'large' },
        { label: __('Extra Large', 'jankx'), value: 'xlarge' }
    ];

    const buttonStyleOptions = [
        { label: __('Filled', 'jankx'), value: 'filled' },
        { label: __('Outlined', 'jankx'), value: 'outlined' },
        { label: __('Text', 'jankx'), value: 'text' },
        { label: __('Rounded', 'jankx'), value: 'rounded' }
    ];

    const buttonWidthOptions = [
        { label: __('Auto', 'jankx'), value: 'auto' },
        { label: __('Full Width', 'jankx'), value: 'full' },
        { label: __('Custom', 'jankx'), value: 'custom' }
    ];

    const iconPositionOptions = [
        { label: __('Left', 'jankx'), value: 'left' },
        { label: __('Right', 'jankx'), value: 'right' }
    ];

    const iconTypeOptions = [
        { label: __('Font Icon', 'jankx'), value: 'font' },
        { label: __('Custom Image', 'jankx'), value: 'custom' }
    ];

    const handleFontIconChange = (icon) => {
        setAttributes({ fontIcon: icon });
    };

    const handleCustomIconChange = (media) => {
        if (media && media.url) {
            setAttributes({
                customIcon: {
                    id: media.id,
                    url: media.url,
                    alt: media.alt || 'Button Icon'
                }
            });
        }
    };

    const removeCustomIcon = () => {
        setAttributes({ customIcon: null });
    };

    const renderButtonContent = () => {
        const content = [];

        if (showIcon && iconPosition === 'left') {
            content.push(
                <span key="left-icon" className="jankx-icon-button__icon jankx-icon-button__icon--left">
                    {iconType === 'font' ? (
                        <i className="material-icons" style={{ fontSize: iconSize }}>{fontIcon}</i>
                    ) : customIcon ? (
                        <img
                            src={customIcon.url}
                            alt={customIcon.alt}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <i className="material-icons" style={{ fontSize: iconSize }}>arrow_forward</i>
                    )}
                </span>
            );
        }

        content.push(
            <RichText
                key="button-text"
                tagName="span"
                value={text}
                onChange={(value) => setAttributes({ text: value })}
                placeholder={__('Button text...', 'jankx')}
                allowedFormats={[]}
                className="jankx-icon-button__text"
            />
        );

        if (showIcon && iconPosition === 'right') {
            content.push(
                <span key="right-icon" className="jankx-icon-button__icon jankx-icon-button__icon--right">
                    {iconType === 'font' ? (
                        <i className="material-icons" style={{ fontSize: iconSize }}>{fontIcon}</i>
                    ) : customIcon ? (
                        <img
                            src={customIcon.url}
                            alt={customIcon.alt}
                            style={{
                                width: iconSize,
                                height: iconSize,
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <i className="material-icons" style={{ fontSize: iconSize }}>arrow_forward</i>
                    )}
                </span>
            );
        }

        return content;
    };

    const renderButton = () => {
        const buttonClasses = [
            'jankx-icon-button__button',
            `jankx-icon-button__button--${buttonType}`,
            `jankx-icon-button__button--${buttonSize}`,
            `jankx-icon-button__button--${buttonStyle}`,
            buttonWidth === 'full' ? 'jankx-icon-button__button--full-width' : ''
        ].filter(Boolean).join(' ');

        const buttonStyle = {
            width: buttonWidth === 'custom' ? '200px' : 'auto'
        };

        if (url) {
            return (
                <a
                    href={url}
                    target={linkTarget}
                    rel={rel}
                    className={buttonClasses}
                    style={buttonStyle}
                >
                    {renderButtonContent()}
                </a>
            );
        }

        return (
            <button
                type="button"
                className={buttonClasses}
                style={buttonStyle}
            >
                {renderButtonContent()}
            </button>
        );
    };

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={null}
                    onChange={() => {}}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody
                    title={__('Button Settings', 'jankx')}
                    icon={button}
                    initialOpen={true}
                >
                    <SelectControl
                        label={__('Button Type', 'jankx')}
                        value={buttonType}
                        options={buttonTypeOptions}
                        onChange={(value) => setAttributes({ buttonType: value })}
                    />

                    <SelectControl
                        label={__('Button Size', 'jankx')}
                        value={buttonSize}
                        options={buttonSizeOptions}
                        onChange={(value) => setAttributes({ buttonSize: value })}
                    />

                    <SelectControl
                        label={__('Button Style', 'jankx')}
                        value={buttonStyle}
                        options={buttonStyleOptions}
                        onChange={(value) => setAttributes({ buttonStyle: value })}
                    />

                    <SelectControl
                        label={__('Button Width', 'jankx')}
                        value={buttonWidth}
                        options={buttonWidthOptions}
                        onChange={(value) => setAttributes({ buttonWidth: value })}
                    />
                </PanelBody>

                <PanelBody
                    title={__('Link Settings', 'jankx')}
                    icon={link}
                    initialOpen={false}
                >
                    <URLInput
                        value={url}
                        onChange={(value) => setAttributes({ url: value })}
                        placeholder={__('Enter URL...', 'jankx')}
                    />

                    <SelectControl
                        label={__('Open in', 'jankx')}
                        value={linkTarget}
                        options={[
                            { label: __('Same window', 'jankx'), value: '_self' },
                            { label: __('New window', 'jankx'), value: '_blank' },
                            { label: __('Parent frame', 'jankx'), value: '_parent' },
                            { label: __('Top frame', 'jankx'), value: '_top' }
                        ]}
                        onChange={(value) => setAttributes({ linkTarget: value })}
                    />

                    <TextControl
                        label={__('Link Rel', 'jankx')}
                        value={rel}
                        onChange={(value) => setAttributes({ rel: value })}
                        placeholder="nofollow noreferrer"
                        help={__('Thêm rel attributes cho link (tùy chọn)', 'jankx')}
                    />
                </PanelBody>

                <PanelBody
                    title={__('Icon Settings', 'jankx')}
                    icon={settings}
                    initialOpen={false}
                >
                    <ToggleControl
                        label={__('Show Icon', 'jankx')}
                        checked={showIcon}
                        onChange={(value) => setAttributes({ showIcon: value })}
                        help={__('Hiển thị icon trong button', 'jankx')}
                    />

                    {showIcon && (
                        <>
                            <SelectControl
                                label={__('Icon Type', 'jankx')}
                                value={iconType}
                                options={iconTypeOptions}
                                onChange={(value) => setAttributes({ iconType: value })}
                            />

                            <SelectControl
                                label={__('Icon Position', 'jankx')}
                                value={iconPosition}
                                options={iconPositionOptions}
                                onChange={(value) => setAttributes({ iconPosition: value })}
                            />

                            <RangeControl
                                label={__('Icon Size', 'jankx')}
                                value={parseInt(iconSize)}
                                onChange={(value) => setAttributes({ iconSize: value + 'px' })}
                                min={12}
                                max={48}
                                step={2}
                                help={__('Kích thước của icon', 'jankx')}
                            />

                            <RangeControl
                                label={__('Icon Spacing', 'jankx')}
                                value={parseInt(iconSpacing)}
                                onChange={(value) => setAttributes({ iconSpacing: value + 'px' })}
                                min={0}
                                max={32}
                                step={1}
                                help={__('Khoảng cách giữa icon và text', 'jankx')}
                            />

                            {iconType === 'font' && (
                                <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#666' }}>
                                        {__('Font Icon Picker', 'jankx')}
                                    </p>
                                    <IconPicker
                                        value={fontIcon}
                                        onChange={handleFontIconChange}
                                        iconType="material"
                                        category="navigation"
                                    />
                                </div>
                            )}

                            {iconType === 'custom' && (
                                <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#666' }}>
                                        {__('Custom Image Icon', 'jankx')}
                                    </p>

                                    {customIcon ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <img
                                                src={customIcon.url}
                                                alt={customIcon.alt}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    objectFit: 'contain',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                {customIcon.alt}
                                            </span>
                                            <Button
                                                icon={trash}
                                                label={__('Remove icon', 'jankx')}
                                                onClick={removeCustomIcon}
                                                variant="tertiary"
                                                size="small"
                                            />
                                        </div>
                                    ) : (
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={handleCustomIconChange}
                                                allowedTypes={['image']}
                                                value={customIcon?.id}
                                                render={({ open }) => (
                                                    <Button
                                                        icon={plus}
                                                        onClick={open}
                                                        variant="secondary"
                                                        style={{ width: '100%' }}
                                                    >
                                                        {__('Choose Image', 'jankx')}
                                                    </Button>
                                                )}
                                            />
                                        </MediaUploadCheck>
                                    )}

                                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#999' }}>
                                        {__('Hỗ trợ PNG, SVG. Kích thước khuyến nghị: 24x24px đến 48x48px', 'jankx')}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </PanelBody>

                <PanelBody
                    title={__('Advanced', 'jankx')}
                    icon={settings}
                    initialOpen={false}
                >
                    <TextControl
                        label={__('CSS Class', 'jankx')}
                        value={customClassName}
                        onChange={(value) => setAttributes({ customClassName: value })}
                        placeholder={__('custom-button-class', 'jankx')}
                        help={__('Thêm CSS class tùy chỉnh', 'jankx')}
                    />

                    <TextControl
                        label={__('HTML Anchor', 'jankx')}
                        value={anchor}
                        onChange={(value) => setAttributes({ anchor: value })}
                        placeholder={__('button-anchor', 'jankx')}
                        help={__('Thêm HTML anchor cho button', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderButton()}
            </div>
        </>
    );
};

// Register the block
registerBlockType('jankx/icon-button', {
    title: __('Icon Button', 'jankx'),
    category: 'design',
    icon: 'button',
    description: __('Button với khả năng thêm icon từ Jankx Font Icons System hoặc upload custom icon', 'jankx'),
    keywords: ['button', 'icon', 'link', 'cta', 'action', 'jankx'],
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
            background: true,
            gradients: true
        },
        typography: {
            fontSize: true,
            lineHeight: true,
            fontFamily: true,
            fontWeight: true,
            fontStyle: true,
            letterSpacing: true
        },
        border: {
            color: true,
            radius: true,
            style: true,
            width: true
        }
    },
    attributes: {
        text: {
            type: 'string',
            default: 'Click me'
        },
        url: {
            type: 'string',
            default: ''
        },
        linkTarget: {
            type: 'string',
            default: '_self'
        },
        rel: {
            type: 'string',
            default: ''
        },
        buttonType: {
            type: 'string',
            default: 'primary'
        },
        buttonSize: {
            type: 'string',
            default: 'medium'
        },
        buttonStyle: {
            type: 'string',
            default: 'filled'
        },
        buttonWidth: {
            type: 'string',
            default: 'auto'
        },
        iconPosition: {
            type: 'string',
            default: 'left'
        },
        iconSpacing: {
            type: 'string',
            default: '8px'
        },
        showIcon: {
            type: 'boolean',
            default: false
        },
        iconType: {
            type: 'string',
            default: 'font'
        },
        fontIcon: {
            type: 'string',
            default: 'arrow_forward'
        },
        customIcon: {
            type: 'object',
            default: null
        },
        iconSize: {
            type: 'string',
            default: '20px'
        },
        customClassName: {
            type: 'string',
            default: ''
        },
        anchor: {
            type: 'string',
            default: ''
        }
    },
    edit: Edit
});
