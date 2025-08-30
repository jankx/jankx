import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import React from 'react';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    RichText,
    withColors,
    useBlockStyleVariations
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    RangeControl,
    __experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { link, settings } from '@wordpress/icons';

import IconPicker from '../../shared/components/IconPicker';
import IconSettings from './components/IconSettings';

interface IconButtonAttributes {
    text: string;
    url: string;
    linkTarget: string;
    rel: string;
    placeholder: string;
    hasIcon: boolean;
    iconName: string;
    iconSet: string;
    iconPosition: 'before' | 'after';
    iconSize: string;
    iconColor: string;
    iconStyle: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';
    backgroundColor: string;
    textColor: string;
    gradient: string;
    customGradient: string;
    borderRadius: number;
    style: any;
    className: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    textTransform: string;
    letterSpacing: string;
    lineHeight: string;
    width: number;
    justification: string;
    opensInNewTab: boolean;
}

interface EditProps {
    attributes: IconButtonAttributes;
    setAttributes: (attrs: Partial<IconButtonAttributes>) => void;
    backgroundColor: any;
    setBackgroundColor: (color: any) => void;
    textColor: any;
    setTextColor: (color: any) => void;
}

/**
 * Hàm chung để render icon, được sử dụng cho cả component Edit và Save.
 * Điều này đảm bảo cấu trúc HTML của icon luôn giống nhau.
 */
const renderIcon = (attributes: IconButtonAttributes, finalTextColor?: string): JSX.Element | null => {
    const { hasIcon, iconName, iconSet, iconSize, iconColor, iconStyle } = attributes;

    if (!hasIcon || !iconName) {
        return null;
    }

    const finalIconColor = iconColor || finalTextColor || '#333333';

    if (iconSet === 'material') {
        const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
        return (
            <span
                className={styleClass}
                style={{ fontSize: iconSize, color: finalIconColor }}
            >
                {iconName}
            </span>
        );
    } else if (iconSet === 'fontawesome') {
        return (
            <i
                className={`fas fa-${iconName}`}
                style={{ fontSize: iconSize, color: finalIconColor }}
            />
        );
    } else if (iconSet === 'dashicons') {
        return (
            <span
                className={`dashicons dashicons-${iconName}`}
                style={{ fontSize: iconSize, color: finalIconColor }}
            />
        );
    }

    return null;
};

const Edit = ({
    attributes,
    setAttributes,
    backgroundColor,
    setBackgroundColor,
    textColor,
    setTextColor
}: EditProps): JSX.Element => {
    const {
        text,
        url,
        linkTarget,
        rel,
        placeholder,
        hasIcon,
        iconName,
        iconSet,
        iconPosition,
        iconSize,
        iconColor,
        iconStyle,
        borderRadius,
        fontSize,
        fontFamily,
        fontWeight,
        textTransform,
        letterSpacing,
        lineHeight,
        width,
        justification,
        opensInNewTab
    } = attributes;

    const blockProps = useBlockProps({
        className: 'jankx-icon-button-block'
    });

    const handleIconChange = (icon: { name: string; category?: string; iconSet?: string }): void => {
        setAttributes({
            iconName: icon.name,
            iconSet: icon.iconSet || 'material'
        });
    };

    const iconElement = renderIcon(attributes, props.textColor?.color); // Sử dụng hàm render icon chung

    const renderButtonContent = (): JSX.Element => {
        return (
            <span style={{ color: props.textColor?.color || '#333333' }}>
                {attributes.iconPosition === 'before' && iconElement}
                <RichText
                    value={attributes.text}
                    onChange={(value: string) => setAttributes({ text: value })}
                    placeholder={attributes.placeholder || __('Add text...', 'jankx')}
                    className="jankx-icon-button__text"
                    // ... (styles)
                />
                {attributes.iconPosition === 'after' && iconElement}
            </span>
        );
    };


    const getButtonStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if (backgroundColor?.color) {
            styles.backgroundColor = backgroundColor.color;
        }

        if (textColor?.color) {
            styles.color = textColor.color;
        }

        if (borderRadius !== undefined) {
            styles.borderRadius = `${borderRadius}px`;
        }

        if (width) {
            styles.width = `${width}px`;
        }

        if (justification) {
            styles.justifyContent = justification;
        }

        if (fontSize && fontSize !== '0px') {
            styles.fontSize = fontSize;
        }

        return styles;
    };

    const getLinkRel = (): string => {
        const relArray = [];
        if (linkTarget === '_blank') {
            relArray.push('noopener');
        }
        if (rel?.includes('nofollow')) {
            relArray.push('nofollow');
        }
        return relArray.join(' ');
    };

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={justification}
                    onChange={(value: string | undefined) => setAttributes({ justification: value || 'left' })}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody
                    title={__('Button Settings', 'jankx')}
                    icon={settings}
                    initialOpen={true}
                >
                    <TextControl
                        label={__('URL', 'jankx')}
                        value={url}
                        onChange={(value: string) => setAttributes({ url: value })}
                        placeholder={__('https://example.com', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Open in new tab', 'jankx')}
                        checked={opensInNewTab}
                        onChange={(value: boolean) => {
                            setAttributes({ opensInNewTab: value });
                            if (value) {
                                setAttributes({ linkTarget: '_blank' });
                            } else {
                                setAttributes({ linkTarget: '_self' });
                            }
                        }}
                    />

                    <SelectControl
                        label={__('Link Rel', 'jankx')}
                        value={rel}
                        options={[
                            { label: __('None', 'jankx'), value: '' },
                            { label: 'nofollow', value: 'nofollow' },
                            { label: 'noopener', value: 'noopener' },
                            { label: 'nofollow noopener', value: 'nofollow noopener' }
                        ]}
                        onChange={(value: string) => setAttributes({ rel: value })}
                    />
                </PanelBody>

                <IconSettings
                    hasIcon={hasIcon}
                    iconName={iconName}
                    iconSet={iconSet}
                    iconPosition={iconPosition}
                    iconSize={iconSize}
                    iconColor={iconColor}
                    iconStyle={iconStyle}
                    onHasIconChange={(value: boolean) => setAttributes({ hasIcon: value })}
                    onIconNameChange={(name: string) => setAttributes({ iconName: name })}
                    onIconSetChange={(set: string) => setAttributes({ iconSet: set })}
                    onIconPositionChange={(position: 'before' | 'after') => setAttributes({ iconPosition: position })}
                    onIconSizeChange={(size: string) => setAttributes({ iconSize: size })}
                    onIconColorChange={(color: string) => setAttributes({ iconColor: color })}
                    onIconStyleChange={(style: IconButtonAttributes['iconStyle']) => setAttributes({ iconStyle: style })}
                />

                {hasIcon && (
                    <PanelBody
                        title={__('Icon Selection', 'jankx')}
                        icon={link}
                        initialOpen={false}
                    >
                        <IconPicker
                            value={iconName ? { name: iconName, iconSet: iconSet } : null}
                            onChange={handleIconChange}
                            iconType="material"
                            category="navigation"
                            onIconTypeChange={() => { }}
                            onCategoryChange={() => { }}
                        />
                    </PanelBody>
                )}

                <PanelBody
                    title={__('Typography', 'jankx')}
                    initialOpen={false}
                >
                    <UnitControl
                        label={__('Font Size', 'jankx')}
                        value={fontSize}
                        onChange={(value: string) => setAttributes({ fontSize: value })}
                        units={[
                            { value: 'px', label: 'px', default: 16 },
                            { value: 'em', label: 'em', default: 1 },
                            { value: 'rem', label: 'rem', default: 1 },
                            { value: '%', label: '%', default: 100 }
                        ]}
                    />

                    <SelectControl
                        label={__('Font Weight', 'jankx')}
                        value={fontWeight}
                        options={[
                            { label: __('Normal', 'jankx'), value: 'normal' },
                            { label: __('Bold', 'jankx'), value: 'bold' },
                            { label: '100', value: '100' },
                            { label: '200', value: '200' },
                            { label: '300', value: '300' },
                            { label: '400', value: '400' },
                            { label: '500', value: '500' },
                            { label: '600', value: '600' },
                            { label: '700', value: '700' },
                            { label: '800', value: '800' },
                            { label: '900', value: '900' }
                        ]}
                        onChange={(value: string) => setAttributes({ fontWeight: value })}
                    />

                    <SelectControl
                        label={__('Text Transform', 'jankx')}
                        value={textTransform}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Uppercase', 'jankx'), value: 'uppercase' },
                            { label: __('Lowercase', 'jankx'), value: 'lowercase' },
                            { label: __('Capitalize', 'jankx'), value: 'capitalize' }
                        ]}
                        onChange={(value: string) => setAttributes({ textTransform: value })}
                    />

                    <UnitControl
                        label={__('Letter Spacing', 'jankx')}
                        value={letterSpacing}
                        onChange={(value: string) => setAttributes({ letterSpacing: value })}
                        units={[
                            { value: 'px', label: 'px', default: 0 },
                            { value: 'em', label: 'em', default: 0 },
                            { value: 'rem', label: 'rem', default: 0 }
                        ]}
                    />

                    <UnitControl
                        label={__('Line Height', 'jankx')}
                        value={lineHeight}
                        onChange={(value: string) => setAttributes({ lineHeight: value })}
                        units={[
                            { value: '', label: 'none', default: 1.2 },
                            { value: 'px', label: 'px', default: 20 },
                            { value: 'em', label: 'em', default: 1.2 },
                            { value: 'rem', label: 'rem', default: 1.2 }
                        ]}
                    />
                </PanelBody>

                <PanelBody
                    title={__('Layout', 'jankx')}
                    initialOpen={false}
                >
                    <RangeControl
                        label={__('Border Radius', 'jankx')}
                        value={borderRadius}
                        onChange={(value: number | undefined) => setAttributes({ borderRadius: value || 0 })}
                        min={0}
                        max={50}
                        step={1}
                    />

                    <UnitControl
                        label={__('Width', 'jankx')}
                        value={width ? `${width}px` : ''}
                        onChange={(value: string) => {
                            const numValue = parseInt(value);
                            setAttributes({ width: isNaN(numValue) ? undefined : numValue });
                        }}
                        units={[
                            { value: 'px', label: 'px', default: 200 }
                        ]}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {url ? (
                    <a
                        href={url}
                        target={linkTarget}
                        rel={getLinkRel()}
                        className="jankx-icon-button"
                        style={getButtonStyles()}
                        data-icon-position={iconPosition}
                    >
                        {renderButtonContent()}
                    </a>
                ) : (
                    <button
                        className="jankx-icon-button"
                        style={getButtonStyles()}
                        data-icon-position={iconPosition}
                    >
                        {renderButtonContent()}
                    </button>
                )}
            </div>
        </>
    );
};

const Save = ({ attributes }: { attributes: IconButtonAttributes }): JSX.Element => {
    const {
        text,
        url,
        linkTarget,
        rel,
        iconPosition,
        borderRadius,
        fontSize,
        fontFamily,
        fontWeight,
        textTransform,
        letterSpacing,
        lineHeight,
        width,
        justification
    } = attributes;

    const blockProps = useBlockProps.save({
        className: 'jankx-icon-button-block'
    });

    const iconElement = renderIcon(attributes); // Sử dụng hàm render icon chung

    const renderButtonContent = (): JSX.Element => {
        return (
            <span>
                {attributes.iconPosition === 'before' && iconElement}
                <RichText.Content
                    value={attributes.text}
                    className="jankx-icon-button__text"
                    // ... (styles)
                />
                {attributes.iconPosition === 'after' && iconElement}
            </span>
        );
    };

    const getButtonStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if (borderRadius !== undefined) {
            styles.borderRadius = `${borderRadius}px`;
        }

        if (width) {
            styles.width = `${width}px`;
        }

        if (justification) {
            styles.justifyContent = justification;
        }

        return styles;
    };

    const getLinkRel = (): string => {
        const relArray = [];
        if (linkTarget === '_blank') {
            relArray.push('noopener');
        }
        if (rel?.includes('nofollow')) {
            relArray.push('nofollow');
        }
        return relArray.join(' ');
    };

    return (
        <div {...blockProps}>
            {url ? (
                <a
                    href={url}
                    target={linkTarget}
                    rel={getLinkRel()}
                    className="jankx-icon-button"
                    style={getButtonStyles()}
                >
                    {renderButtonContent()}
                </a>
            ) : (
                <button
                    className="jankx-icon-button"
                    style={getButtonStyles()}
                >
                    {renderButtonContent()}
                </button>
            )}
        </div>
    );
};

// Enhanced Edit component with color support
const EnhancedEdit = withColors(
    'backgroundColor',
    { textColor: 'color' }
)(Edit);

registerBlockType('jankx/icon-button', {
    title: __('Icon Button', 'jankx'),
    category: 'design',
    icon: 'button',
    description: __('Button with icon, supports all features of core button plus icon selection', 'jankx'),
    keywords: ['button', 'icon', 'link', 'cta', 'action', 'jankx'],
    supports: {
        html: false,
        align: ['left', 'center', 'right', 'wide', 'full'],
        alignWide: true,
        spacing: {
            margin: true,
            padding: true
        },
        color: {
            text: true,
            background: true,
            gradients: true,
            link: true
        },
        typography: {
            fontSize: true,
            lineHeight: true,
            fontFamily: true,
            fontWeight: true,
            textTransform: true,
            letterSpacing: true
        },
        border: {
            color: true,
            radius: true,
            style: true,
            width: true
        },
        reusable: false
    },
    attributes: {
        text: {
            type: 'string',
            source: 'html',
            selector: 'span'
        },
        url: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'href'
        },
        linkTarget: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'target'
        },
        rel: {
            type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'rel'
        },
        placeholder: {
            type: 'string'
        },
        hasIcon: {
            type: 'boolean',
            default: false
        },
        iconName: {
            type: 'string',
            default: ''
        },
        iconSet: {
            type: 'string',
            default: 'material'
        },
        iconPosition: {
            type: 'string',
            default: 'before'
        },
        iconSize: {
            type: 'string',
            default: '16px'
        },
        iconColor: {
            type: 'string',
            default: ''
        },
        iconStyle: {
            type: 'string',
            default: 'filled'
        },
        backgroundColor: {
            type: 'string'
        },
        textColor: {
            type: 'string'
        },
        gradient: {
            type: 'string'
        },
        customGradient: {
            type: 'string'
        },
        borderRadius: {
            type: 'number'
        },
        style: {
            type: 'object'
        },
        className: {
            type: 'string'
        },
        fontSize: {
            type: 'string'
        },
        fontFamily: {
            type: 'string'
        },
        fontWeight: {
            type: 'string'
        },
        textTransform: {
            type: 'string'
        },
        letterSpacing: {
            type: 'string'
        },
        lineHeight: {
            type: 'string'
        },
        width: {
            type: 'number'
        },
        justification: {
            type: 'string'
        },
        opensInNewTab: {
            type: 'boolean',
            default: false
        }
    },
    edit: EnhancedEdit,
    save: Save
});