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
    useSetting
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
    unlink
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
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-button-with-icon jankx-button-with-icon--${buttonType} jankx-button-with-icon--${buttonSize} jankx-button-with-icon--${buttonStyle} ${customClassName || ''}`.trim()
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
        { label: __('Right', 'jankx'), value: 'right' },
        { label: __('Top', 'jankx'), value: 'top' },
        { label: __('Bottom', 'jankx'), value: 'bottom' }
    ];

    const handleIconChange = (icon) => {
        // Handle icon change from IconPicker
        console.log('Icon selected:', icon);
    };

    const renderButtonContent = () => {
        const content = [];

        if (showIcon && iconPosition === 'left') {
            content.push(
                <IconPicker
                    key="left-icon"
                    value={null}
                    onChange={handleIconChange}
                    iconType="material"
                    category="navigation"
                />
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
                className="jankx-button-with-icon__text"
            />
        );

        if (showIcon && iconPosition === 'right') {
            content.push(
                <IconPicker
                    key="right-icon"
                    value={null}
                    onChange={handleIconChange}
                    iconType="material"
                    category="navigation"
                />
            );
        }

        return content;
    };

    const renderButton = () => {
        const buttonClasses = [
            'jankx-button-with-icon__button',
            `jankx-button-with-icon__button--${buttonType}`,
            `jankx-button-with-icon__button--${buttonSize}`,
            `jankx-button-with-icon__button--${buttonStyle}`,
            buttonWidth === 'full' ? 'jankx-button-with-icon__button--full-width' : ''
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
                                label={__('Icon Position', 'jankx')}
                                value={iconPosition}
                                options={iconPositionOptions}
                                onChange={(value) => setAttributes({ iconPosition: value })}
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

                            <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '500', color: '#666' }}>
                                    {__('Icon Picker (Nested Block)', 'jankx')}
                                </p>
                                <IconPicker
                                    value={null}
                                    onChange={handleIconChange}
                                    iconType="material"
                                    category="navigation"
                                />
                            </div>
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
registerBlockType('jankx/button-with-icon', {
    title: __('Button with Icon', 'jankx'),
    category: 'design',
    icon: 'button',
    description: __('Button với khả năng thêm icon từ Jankx Font Icons System', 'jankx'),
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
