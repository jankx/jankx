import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber } from 'lodash';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, DropdownMenu, ExternalLink, MenuGroup, MenuItem, NavigableMenu, Popover, TextControl, ToggleControl, ToolbarButton, ToolbarGroup, __experimentalToolsPanel as ToolsPanel, // eslint-disable-line
__experimentalToolsPanelItem as ToolsPanelItem, // eslint-disable-line
__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue, // eslint-disable-line
 } from '@wordpress/components';
import { BlockControls, ContrastChecker, InspectorControls, JustifyToolbar, MediaUpload, useBlockProps, withColors, useBlockEditingMode, __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, // eslint-disable-line
__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, // eslint-disable-line
__experimentalUseGradient as useGradient, // eslint-disable-line
__experimentalLinkControl as LinkControl, // eslint-disable-line
__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles, // eslint-disable-line
 } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { displayShortcut, isKeyboardEvent, DOWN } from '@wordpress/keycodes';
import { code, flipHorizontal as flipH, flipVertical as flipV, link, media as mediaIcon, rotateRight, } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import { CustomInserterModal, IconDropZone, IconPlaceholder, InserterModal, DimensionControl, } from './components';
import { flattenIconsArray, parseIcon, parseUploadedMediaAndSetIcon, } from './utils';
import { bolt as defaultIcon } from './icons/bolt';
import getIcons from './icons';
import { useToolsPanelDropdownMenuProps } from './utils/hooks';
const NEW_TAB_REL = 'noreferrer noopener';
/**
 * The edit function for the Icon Block.
 *
 * @param {Object} props All props passed to this function.
 */
export function Edit(props) {
    const { clientId, attributes, iconBackgroundColor, iconColor, setAttributes, setIconBackgroundColor, setIconColor, } = props;
    const { flipHorizontal, flipVertical, hasNoIconFill, icon, iconBackgroundColorValue, iconColorValue, iconName, itemsJustification, label, linkRel, linkTarget, linkUrl, rotate, title, width, height, 
    // Deprecated
    percentWidth, } = attributes;
    useEffect(() => {
        // If percentWidth is set (deprecated in v1.4.0), set as width value
        // and remove the attribute.
        if (percentWidth) {
            setAttributes({
                width: `${percentWidth}%`,
                percentWidth: undefined,
            });
        }
    });
    // Allowed types for the current user.
    const { allowedMimeTypes, mediaUpload } = useSelect((select) => {
        const { getSettings } = select('core/block-editor');
        return {
            allowedMimeTypes: getSettings().allowedMimeTypes,
            mediaUpload: getSettings().mediaUpload,
        };
    }, []);
    const isSVGUploadAllowed = allowedMimeTypes
        ? Object.values(allowedMimeTypes).includes('image/svg+xml')
        : false;
    const { gradientClass, gradientValue, setGradient } = useGradient();
    const [isInserterOpen, setInserterOpen] = useState(false);
    const [isQuickInserterOpen, setQuickInserterOpen] = useState(false);
    const [isCustomInserterOpen, setCustomInserterOpen] = useState(false);
    const [isEditingURL, setIsEditingURL] = useState(false);
    // Allow users to disable custom SVG icons.
    const enableCustomIcons = applyFilters('iconBlock.enableCustomIcons', true);
    const isContentOnlyMode = useBlockEditingMode() === 'contentOnly';
    const linkRef = useRef(null);
    const isURLSet = !!linkUrl;
    const opensInNewTab = linkTarget === '_blank';
    const iconsAll = flattenIconsArray(getIcons());
    const namedIcon = iconsAll.filter((i) => i.name === iconName);
    let customIcon = defaultIcon;
    if (icon && isEmpty(namedIcon)) {
        customIcon = parseIcon(icon);
        if (isEmpty(customIcon?.props)) {
            customIcon = defaultIcon;
        }
    }
    let printedIcon = !isEmpty(namedIcon) ? namedIcon[0].icon : customIcon;
    // Icons provided by third-parties are generally strings.
    if (typeof printedIcon === 'string') {
        printedIcon = parseIcon(printedIcon);
    }
    function setRotate(value) {
        const currentValue = !value || !isNumber(value) ? 0 : value;
        let newValue = 0;
        if (currentValue < 90) {
            newValue = 90;
        }
        else if (currentValue < 180) {
            newValue = 180;
        }
        else if (currentValue < 270) {
            newValue = 270;
        }
        setAttributes({ rotate: newValue });
    }
    function unlink() {
        setAttributes({
            linkUrl: undefined,
            linkTarget: undefined,
            linkRel: undefined,
        });
        setIsEditingURL(false);
    }
    function resetAll() {
        setAttributes({
            label: undefined,
            width: undefined,
            height: undefined,
        });
    }
    function onToggleOpenInNewTab(value) {
        const newLinkTarget = value ? '_blank' : undefined;
        let updatedRel = linkRel;
        if (newLinkTarget && !linkRel) {
            updatedRel = NEW_TAB_REL;
        }
        else if (!newLinkTarget && linkRel === NEW_TAB_REL) {
            updatedRel = undefined;
        }
        setAttributes({
            linkTarget: newLinkTarget,
            linkRel: updatedRel,
        });
    }
    function onKeyDown(event) {
        if (isKeyboardEvent.primary(event, 'k')) {
            // Prevent the command palette from opening.
            event.preventDefault();
            setIsEditingURL(true);
        }
        else if (isKeyboardEvent.primaryShift(event, 'k')) {
            unlink();
            linkRef.current?.focus();
        }
    }
    const openOnArrowDown = (event) => {
        if (event.keyCode === DOWN) {
            event.preventDefault();
            event.target.click();
        }
    };
    const replaceText = icon || iconName
        ? __('Replace', 'icon-block')
        : __('Add icon', 'icon-block');
    const customIconText = icon || iconName
        ? __('Add/edit custom icon', 'icon-block')
        : __('Add custom icon', 'icon-block');
    const replaceDropdown = (_jsx(Dropdown, { renderToggle: ({ isOpen, onToggle }) => (_jsx(ToolbarButton, { "aria-expanded": isOpen, "aria-haspopup": "true", onClick: onToggle, onKeyDown: openOnArrowDown, children: replaceText })), renderContent: ({ onClose }) => (_jsxs(NavigableMenu, { children: [_jsxs(MenuGroup, { children: [_jsx(MenuItem, { onClick: () => {
                                setInserterOpen(true);
                                onClose(true);
                            }, icon: defaultIcon, children: __('Browse Icon Library', 'icon-block') }), isSVGUploadAllowed && (_jsx(MediaUpload, { onSelect: (media) => {
                                parseUploadedMediaAndSetIcon(media, attributes, setAttributes);
                                onClose(true);
                            }, allowedTypes: ['image/svg+xml'], render: ({ open }) => (_jsx(MenuItem, { onClick: open, icon: mediaIcon, children: __('Open Media Library', 'icon-block') })) })), enableCustomIcons && (_jsx(MenuItem, { onClick: () => {
                                setCustomInserterOpen(true);
                                onClose(true);
                            }, icon: code, children: customIconText }))] }), (icon || iconName) && (_jsx(MenuGroup, { children: _jsx(MenuItem, { onClick: () => {
                            setAttributes({
                                icon: undefined,
                                iconName: undefined,
                            });
                            onClose(true);
                        }, children: __('Reset', 'icon-block') }) }))] })) }));
    const blockControls = (_jsxs(_Fragment, { children: [(icon || iconName) && (_jsx(BlockControls, { group: "block", children: _jsxs(ToolbarGroup, { className: classnames('components-toolbar-group', {
                        'wp-block-outermost-icon-block__toolbar': !isContentOnlyMode,
                    }), children: [!isContentOnlyMode && (_jsx(JustifyToolbar, { allowedControls: [
                                'left',
                                'center',
                                'right',
                            ], value: itemsJustification, onChange: (value) => setAttributes({
                                itemsJustification: value,
                            }) })), _jsx(ToolbarButton, { ref: linkRef, name: "link", icon: link, title: __('Link', 'icon-block'), shortcut: displayShortcut.primary('k'), onClick: () => setIsEditingURL(true), isActive: isURLSet }), isEditingURL && (_jsx(Popover, { className: "wp-block-outermost-icon-block__link-popover", anchor: linkRef?.current, offset: 12, placement: "bottom", onClose: () => {
                                setIsEditingURL(false);
                                linkRef.current?.focus();
                            }, focusOnMount: isEditingURL ? 'firstElement' : false, variant: "alternate", children: _jsx(LinkControl, { value: { url: linkUrl, opensInNewTab }, onChange: ({ url: newURL = '', opensInNewTab: newOpensInNewTab, }) => {
                                    setAttributes({ linkUrl: newURL });
                                    if (opensInNewTab !== newOpensInNewTab) {
                                        onToggleOpenInNewTab(newOpensInNewTab);
                                    }
                                }, onRemove: () => {
                                    unlink();
                                    linkRef.current?.focus();
                                } }) })), !isContentOnlyMode && (_jsxs(_Fragment, { children: [_jsx(ToolbarButton, { className: `outermost-icon-block__rotate-button-${rotate}`, icon: rotateRight, label: __('Rotate', 'icon-block'), onClick: () => setRotate(rotate), isPressed: rotate }), _jsx(ToolbarButton, { icon: flipH, label: __('Flip Horizontal', 'icon-block'), onClick: () => setAttributes({
                                        flipHorizontal: !flipHorizontal,
                                    }), isPressed: flipHorizontal }), _jsx(ToolbarButton, { icon: flipV, label: __('Flip Vertical', 'icon-block'), onClick: () => setAttributes({
                                        flipVertical: !flipVertical,
                                    }), isPressed: flipVertical })] }))] }) })), _jsx(BlockControls, { group: isContentOnlyMode ? 'inline' : 'other', children: _jsx(_Fragment, { children: enableCustomIcons || isSVGUploadAllowed ? (replaceDropdown) : (_jsx(ToolbarButton, { onClick: () => {
                            setInserterOpen(true);
                        }, children: replaceText })) }) }), isContentOnlyMode && (icon || iconName) && (
            // Add some extra controls for content attributes when content only mode is active.
            // With content only mode active, the inspector is hidden, so users need another way
            // to edit these attributes.
            _jsx(BlockControls, { group: "other", children: _jsx(ToolbarGroup, { className: "components-toolbar-group", children: _jsx(DropdownMenu, { icon: "", popoverProps: {
                            className: 'outermost-icon-block__replace-popover is-alternate',
                        }, text: __('Label', 'icon-block'), children: () => (_jsx(TextControl, { className: "wp-block-outermost-icon-block__toolbar_content", label: __('Label', 'icon-block'), value: label || '', onChange: (value) => setAttributes({ label: value }), help: __('Briefly describe the icon to help screen reader users.', 'icon-block'), __nextHasNoMarginBottom: true })) }) }) }))] }));
    const colorSettings = [
        {
            colorLabel: __('Icon color', 'icon-block'),
            colorValue: iconColor.color || iconColorValue,
            onChange: (colorValue) => {
                setIconColor(colorValue);
                setAttributes({
                    iconColorValue: colorValue,
                });
            },
            resetAllFilter: () => {
                setIconColor(undefined);
                setAttributes({ iconColorValue: undefined });
            },
        },
        {
            colorLabel: __('Background color', 'icon-block'),
            colorValue: iconBackgroundColor.color || iconBackgroundColorValue,
            colorGradientValue: gradientValue,
            onChange: (colorValue) => {
                setIconBackgroundColor(colorValue);
                setAttributes({
                    iconBackgroundColorValue: colorValue,
                });
            },
            onGradientChange: setGradient,
            resetAllFilter: () => {
                setIconBackgroundColor(undefined);
                setAttributes({ iconBackgroundColorValue: undefined });
            },
        },
    ];
    const colorGradientSettings = useMultipleOriginColorsAndGradients();
    const dropdownMenuProps = useToolsPanelDropdownMenuProps();
    // In WordPress <=6.2 this will return null, so default to true in those cases.
    const hasColorsOrGradients = colorGradientSettings?.hasColorsOrGradients ?? true;
    const inspectorControls = (icon || iconName) && (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { group: "settings", children: _jsxs(ToolsPanel, { label: __('Settings'), resetAll: resetAll, dropdownMenuProps: dropdownMenuProps, children: [_jsx(ToolsPanelItem, { label: __('Label', 'icon-block'), isShownByDefault: true, hasValue: () => !!label, onDeselect: () => setAttributes({ label: undefined }), children: _jsx(TextControl, { label: __('Label', 'icon-block'), help: __('Briefly describe the icon to help screen reader users.', 'icon-block'), value: label || '', onChange: (value) => setAttributes({ label: value }), __nextHasNoMarginBottom: true }) }), _jsx(ToolsPanelItem, { label: __('Width', 'icon-block'), isShownByDefault: true, hasValue: () => !!width, onDeselect: () => setAttributes({ width: undefined }), children: _jsx(DimensionControl, { label: __('Width', 'icon-block'), value: width, onChange: (value) => setAttributes({ width: value }) }) }), _jsx(ToolsPanelItem, { label: __('Height', 'icon-block'), isShownByDefault: false, hasValue: () => !!height, onDeselect: () => setAttributes({ height: undefined }), children: _jsx(DimensionControl, { label: __('Height', 'icon-block'), value: height, onChange: (value) => setAttributes({ height: value }), units: ['px', 'em', 'rem', 'vh', 'vw'] }) }), _jsx(ToolsPanelItem, { label: __('Rotation', 'icon-block'), isShownByDefault: false, hasValue: () => !!rotate, onDeselect: () => setAttributes({ rotate: undefined }), children: _jsx(DimensionControl, { label: __('Rotation', 'icon-block'), value: `${rotate}deg`, onChange: (value) => setAttributes({
                                    rotate: parseQuantityAndUnitFromRawValue(value)[0],
                                }), units: ['deg'] }) })] }) }), hasColorsOrGradients && (_jsxs(InspectorControls, { group: "color", children: [colorSettings.map(({ colorLabel, colorValue, colorGradientValue, onChange, onGradientChange, resetAllFilter, }) => (_jsx(ColorGradientSettingsDropdown, { __experimentalIsRenderedInSidebar: true, settings: [
                            {
                                label: colorLabel,
                                colorValue,
                                gradientValue: colorGradientValue,
                                onColorChange: onChange,
                                onGradientChange,
                                isShownByDefault: true,
                                resetAllFilter,
                                enableAlpha: true,
                            },
                        ], panelId: clientId, ...colorGradientSettings }, `icon-block-color-${colorLabel}`))), (iconColor.color || iconColorValue) && (_jsxs(_Fragment, { children: [_jsx("p", { className: "outermost-icon-block__color-settings__help", children: __('Any color or fill values in the SVG icon itself will take precedent over the chosen color.', 'icon-block') }), _jsx(ToggleControl, { className: "outermost-icon-block__color-settings__apply-fill", checked: !hasNoIconFill, label: __('Apply icon color to fill', 'icon-block'), help: __('Set the SVG fill value to the chosen icon color. Disable as needed.', 'icon-block'), onChange: () => setAttributes({
                                    hasNoIconFill: !hasNoIconFill,
                                }) })] })), _jsx(ContrastChecker, { textColor: iconColorValue,
                        backgroundColor: iconBackgroundColorValue, isLargeText: false })] })), _jsxs(InspectorControls, { group: "advanced", children: [_jsx(TextControl, { label: __('Link rel', 'icon-block'), value: linkRel || '', onChange: (value) => setAttributes({ linkRel: value }), __nextHasNoMarginBottom: true }), _jsx(TextControl, { label: __('Title attribute', 'icon-block'), className: "outermost-icon-block__title-control", value: title || '', onChange: (value) => setAttributes({ title: value }), help: _jsxs(_Fragment, { children: [__('Describe the role of this icon on the page.', 'icon-block'), _jsx(ExternalLink, { href: "https://www.w3.org/TR/html52/dom.html#the-title-attribute", children: __('Note: many devices and browsers do not display this text', 'icon-block') })] }), __nextHasNoMarginBottom: true })] })] }));
    const blockProps = useBlockProps();
    const borderProps = getBorderClassesAndStyles(attributes);
    const themeIconBackgroundColor = iconBackgroundColor?.slug || attributes.iconBackgroundColor;
    const themeIconColor = iconColor?.slug || attributes.iconColor;
    const iconClasses = classnames('icon-container', borderProps?.className, {
        'has-icon-color': iconColor.color || iconColorValue,
        'has-no-icon-fill-color': hasNoIconFill,
        'has-icon-background-color': iconBackgroundColor.color ||
            iconBackgroundColorValue ||
            gradientValue,
        'has-background-gradient': gradientValue,
        [`has-${themeIconColor}-color`]: themeIconColor,
        [`has-${themeIconBackgroundColor}-background-color`]: themeIconBackgroundColor,
        [gradientClass]: gradientClass,
        [`items-justified-${itemsJustification}`]: itemsJustification,
    });
    const [widthQuantity, widthUnit] = parseQuantityAndUnitFromRawValue(width);
    // Default icon width when there is no height set.
    let iconWidth = !height ? '48px' : undefined;
    if (widthQuantity) {
        iconWidth = widthUnit
            ? `${widthQuantity}${widthUnit}`
            : `${widthQuantity}px`;
    }
    const rotateValue = rotate ? `${rotate}deg` : '0deg';
    const scaleXValue = flipHorizontal ? '-1' : '1';
    const scaleYValue = flipVertical ? '-1' : '1';
    const iconStyles = {
        background: gradientValue,
        backgroundColor: iconBackgroundColorValue,
        ...blockProps.style,
        ...borderProps.style,
        color: iconColorValue,
        width: iconWidth,
        height: height || undefined,
        transform: `rotate(${rotateValue}) scaleX(${scaleXValue}) scaleY(${scaleYValue})`,
        // Margin is applied to the wrapper container, so unset.
        marginBottom: undefined,
        marginLeft: undefined,
        marginRight: undefined,
        marginTop: undefined,
    };
    // And even though margin is set on the main block div, we need to handle it
    // manually since all other styles are applied to the inner div.
    const blockMargin = {
        marginBottom: blockProps.style?.marginBottom,
        marginLeft: blockProps.style?.marginLeft,
        marginRight: blockProps.style?.marginRight,
        marginTop: blockProps.style?.marginTop,
    };
    const iconMarkup = (_jsx(_Fragment, { children: !icon && !iconName ? (_jsx(IconPlaceholder, { setInserterOpen: setInserterOpen, isQuickInserterOpen: isQuickInserterOpen, setQuickInserterOpen: setQuickInserterOpen, isCustomInserterOpen: isCustomInserterOpen, setCustomInserterOpen: setCustomInserterOpen, attributes: attributes, setAttributes: setAttributes, enableCustomIcons: enableCustomIcons, isSVGUploadAllowed: isSVGUploadAllowed })) : (_jsx("div", { className: iconClasses, style: iconStyles, children: printedIcon })) }));
    return (_jsxs(_Fragment, { children: [blockControls, inspectorControls, _jsxs("div", { ...useBlockProps({
                    className: itemsJustification &&
                        `items-justified-${itemsJustification}`,
                    //ref,
                    onKeyDown,
                }), 
                // This is a bit of a hack. we only want the margin styles
                // applied to the main block div.
                style: blockMargin, children: [iconMarkup, _jsx(IconDropZone, { attributes: attributes, setAttributes: setAttributes, mediaUpload: mediaUpload, isSVGUploadAllowed: isSVGUploadAllowed })] }), _jsx(InserterModal, { isInserterOpen: isInserterOpen, setInserterOpen: setInserterOpen, attributes: attributes, setAttributes: setAttributes }), enableCustomIcons && (_jsx(CustomInserterModal, { isCustomInserterOpen: isCustomInserterOpen, setCustomInserterOpen: setCustomInserterOpen, attributes: attributes, setAttributes: setAttributes }))] }));
}
const iconColorAttributes = {
    iconColor: 'icon-color',
    iconBackgroundColor: 'icon-background-color',
};
export default withColors(iconColorAttributes)(Edit);
