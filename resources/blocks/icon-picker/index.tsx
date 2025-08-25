import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import React from 'react';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { starFilled } from '@wordpress/icons';


import IconPicker from './components/IconPicker';
import IconSettings from './components/IconSettings';
import LinkSettings from './components/LinkSettings';

type IconType = 'material' | 'fontawesome' | 'custom';
type LabelPosition = 'before' | 'after' | 'above' | 'below';
type Alignment = 'left' | 'center' | 'right';

interface IconPickerAttributes {
    iconName: string;
    iconType: IconType;
    iconCategory: string;
    iconSize: string;
    iconColor: string;
    iconAlignment: Alignment;
    iconStyle: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';
    linkUrl: string;
    linkTarget: '_self' | '_blank' | '_parent' | '_top';
    linkRel: string;
    showLabel: boolean;
    iconLabel: string;
    labelPosition: LabelPosition;
    customClassName?: string;
}

interface EditProps {
    attributes: IconPickerAttributes;
    setAttributes: (attrs: Partial<IconPickerAttributes>) => void;
}

const Edit = ({ attributes, setAttributes }: EditProps): JSX.Element => {
    const {
        iconName,
        iconType,
        iconCategory,
        iconSize,
        iconColor,
        iconAlignment,
        iconStyle,
        linkUrl,
        linkTarget,
        linkRel,
        showLabel,
        iconLabel,
        labelPosition,
        customClassName
    } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-icon-picker-block jankx-icon-picker-block--${iconAlignment} ${customClassName || ''}`.trim()
    });

    const handleIconChange = (icon: { name: string; category?: string }): void => {
        setAttributes({
            iconName: icon.name,
            iconCategory: icon.category || ''
        });
    };

    const handleIconTypeChange = (value: IconType): void => {
        setAttributes({ iconType: value });
    };

    const handleIconCategoryChange = (value: string): void => {
        setAttributes({ iconCategory: value });
    };

    const renderIcon = (): JSX.Element | null => {
        if (!iconName) {
            return (
                <div className="jankx-icon-picker-placeholder">
                    {__('Chọn icon từ Jankx Font Icons', 'jankx')}
                </div>
            );
        }

        if (iconType === 'material') {
            const styleClass = iconStyle !== 'filled' ? `material-icons-${iconStyle}` : 'material-icons';
            return (
                <span
                    className={styleClass}
                    style={{ fontSize: iconSize, color: iconColor }}
                >
                    {iconName}
                </span>
            );
        } else if (iconType === 'fontawesome') {
            const prefix = iconCategory === 'brands' ? 'fab' :
                          iconCategory === 'regular' ? 'far' : 'fas';
            return (
                <i
                    className={`${prefix} fa-${iconName}`}
                    style={{ fontSize: iconSize, color: iconColor }}
                />
            );
        } else if (iconType === 'custom') {
            return (
                <span
                    className={`icon icon-${iconName}`}
                    style={{ fontSize: iconSize, color: iconColor }}
                />
            );
        }

        return null;
    };

    const renderContent = (): JSX.Element => {
        const iconElement = renderIcon();

        if (linkUrl) {
            return (
                <a
                    href={linkUrl}
                    target={linkTarget}
                    rel={linkRel}
                    className="jankx-icon-picker-block__link"
                >
                    {iconElement}
                    {showLabel && iconLabel && (
                        <span className={`jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`}>
                            {iconLabel}
                        </span>
                    )}
                </a>
            );
        }

        return (
            <>
                {iconElement}
                {showLabel && iconLabel && (
                    <span className={`jankx-icon-picker-block__label jankx-icon-picker-block__label--${labelPosition}`}>
                        {iconLabel}
                    </span>
                )}
            </>
        );
    };

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={iconAlignment}
                    onChange={(alignment: Alignment | undefined) => setAttributes({ iconAlignment: alignment || 'left' })}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody
                    title={__('Icon Selection', 'jankx')}
                    icon={starFilled}
                    initialOpen={true}
                >
                    <IconPicker
                        value={iconName ? { name: iconName, category: iconCategory } : null}
                        onChange={handleIconChange}
                        iconType={iconType}
                        category={iconCategory}
                        onIconTypeChange={handleIconTypeChange}
                        onCategoryChange={handleIconCategoryChange}
                    />
                </PanelBody>

                <IconSettings
                    iconSize={iconSize}
                    iconColor={iconColor}
                    iconAlignment={iconAlignment}
                    iconStyle={iconStyle}
                    showLabel={showLabel}
                    iconLabel={iconLabel}
                    labelPosition={labelPosition}
                    onIconSizeChange={(value: string) => setAttributes({ iconSize: value })}
                    onIconColorChange={(value: string) => setAttributes({ iconColor: value })}
                    onIconAlignmentChange={(value: Alignment) => setAttributes({ iconAlignment: value })}
                    onIconStyleChange={(value: IconPickerAttributes['iconStyle']) => setAttributes({ iconStyle: value })}
                    onShowLabelChange={(value: boolean) => setAttributes({ showLabel: value })}
                    onIconLabelChange={(value: string) => setAttributes({ iconLabel: value })}
                    onLabelPositionChange={(value: LabelPosition) => setAttributes({ labelPosition: value })}
                />

                <LinkSettings
                    linkUrl={linkUrl}
                    linkTarget={linkTarget}
                    linkRel={linkRel}
                    onLinkChange={(value: string) => setAttributes({ linkUrl: value })}
                    onLinkTargetChange={(value: IconPickerAttributes['linkTarget']) => setAttributes({ linkTarget: value })}
                    onLinkRelChange={(value: string) => setAttributes({ linkRel: value })}
                />
            </InspectorControls>

            <div {...blockProps}>
                <div
                    className="jankx-icon-picker-block__content"
                    style={{ textAlign: iconAlignment }}
                >
                    {renderContent()}
                </div>
            </div>
        </>
    );
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
        iconSize: { type: 'string', default: '24px' },
        iconColor: { type: 'string', default: '#333333' },
        iconAlignment: { type: 'string', default: 'left' },
        linkUrl: { type: 'string', default: '' },
        linkTarget: { type: 'string', default: '_self' },
        linkRel: { type: 'string', default: '' },
        showLabel: { type: 'boolean', default: false },
        iconLabel: { type: 'string', default: '' },
        labelPosition: { type: 'string', default: 'after' },
        customClassName: { type: 'string', default: '' },
        iconStyle: { type: 'string', default: 'filled' }
    },
    edit: Edit
});


