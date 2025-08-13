import { __ } from '@wordpress/i18n';
import React from 'react';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    ToggleControl,
    ColorPicker,
    RangeControl
} from '@wordpress/components';
import {
    starFilled,
    settings,
    link
} from '@wordpress/icons';

// Import components
import IconPicker from './components/IconPicker';
import IconSettings from './components/IconSettings';
import LinkSettings from './components/LinkSettings';

const Edit = ({ attributes, setAttributes }) => {
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

    const handleIconChange = (icon) => {
        setAttributes({
            iconName: icon.name,
            iconCategory: icon.category || ''
        });
    };

    const handleIconTypeChange = (value) => {
        setAttributes({ iconType: value });
    };

    const handleIconCategoryChange = (value) => {
        setAttributes({ iconCategory: value });
    };

    const renderIcon = () => {
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
                ></i>
            );
        } else if (iconType === 'custom') {
            return (
                <span 
                    className={`icon icon-${iconName}`}
                    style={{ fontSize: iconSize, color: iconColor }}
                ></span>
            );
        }

        return null;
    };

    const renderContent = () => {
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

    return React.createElement(React.Fragment, null,
        React.createElement(BlockControls, null,
            React.createElement(AlignmentToolbar, {
                value: iconAlignment,
                onChange: (alignment) => setAttributes({ iconAlignment: alignment })
            })
        ),
        React.createElement(InspectorControls, null,
            React.createElement(PanelBody, {
                title: __('Icon Selection', 'jankx'),
                icon: starFilled,
                initialOpen: true
            },
                React.createElement(IconPicker, {
                    value: iconName ? { name: iconName, category: iconCategory } : null,
                    onChange: handleIconChange,
                    iconType: iconType,
                    category: iconCategory,
                    onIconTypeChange: handleIconTypeChange,
                    onCategoryChange: handleIconCategoryChange
                })
            ),
            React.createElement(IconSettings, {
                iconSize: iconSize,
                iconColor: iconColor,
                iconAlignment: iconAlignment,
                iconStyle: iconStyle,
                showLabel: showLabel,
                iconLabel: iconLabel,
                labelPosition: labelPosition,
                onIconSizeChange: (value) => setAttributes({ iconSize: value }),
                onIconColorChange: (value) => setAttributes({ iconColor: value }),
                onIconAlignmentChange: (value) => setAttributes({ iconAlignment: value }),
                onIconStyleChange: (value) => setAttributes({ iconStyle: value }),
                onShowLabelChange: (value) => setAttributes({ showLabel: value }),
                onIconLabelChange: (value) => setAttributes({ iconLabel: value }),
                onLabelPositionChange: (value) => setAttributes({ labelPosition: value })
            }),
            React.createElement(LinkSettings, {
                linkUrl: linkUrl,
                linkTarget: linkTarget,
                linkRel: linkRel,
                onLinkChange: (value) => setAttributes({ linkUrl: value }),
                onLinkTargetChange: (value) => setAttributes({ linkTarget: value }),
                onLinkRelChange: (value) => setAttributes({ linkRel: value })
            })
        ),
        React.createElement('div', blockProps,
            React.createElement('div', {
                className: 'jankx-icon-picker-block__content',
                style: { textAlign: iconAlignment }
            },
                renderContent()
            )
        )
    );
};

export default Edit;
