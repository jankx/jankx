import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Modal, Notice, RangeControl, TextareaControl, } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import { bolt } from './../../icons/bolt';
import { parseIcon } from './../../utils';
export default function CustomInserterModal(props) {
    const { isCustomInserterOpen, setCustomInserterOpen, attributes, setAttributes, } = props;
    const { icon, iconName } = attributes;
    const [customIcon, setCustomIcon] = useState(!iconName ? icon : '');
    const [iconSize, setIconSize] = useState(100);
    // Reset values when modal is closed.
    useEffect(() => {
        if (!isCustomInserterOpen) {
            setIconSize(100);
        }
    }, [isCustomInserterOpen]);
    // If a SVG icon is inserted from the Media Library, we need to update
    // the custom icon editor in the modal.
    useEffect(() => setCustomIcon(icon), [icon]);
    if (!isCustomInserterOpen) {
        return null;
    }
    const insertCustomIcon = () => {
        setAttributes({
            icon: customIcon,
            iconName: '',
        });
        setCustomInserterOpen(false);
    };
    const closeModal = () => {
        setCustomInserterOpen(false);
    };
    let iconToRender = parseIcon(customIcon);
    const isSVG = !isEmpty(iconToRender?.props);
    // Render the defualt lightning bolt if the icon is not a valid SVG.
    iconToRender = isSVG ? iconToRender : bolt;
    return (_jsx(Modal, { className: "wp-block-outermost-icon-custom-inserter__modal", title: __('Custom Icon', 'icon-block'), onRequestClose: closeModal, isFullScreen: true, children: _jsxs("div", { className: "icon-custom-inserter", children: [_jsx("div", { className: "icon-custom-inserter__content", children: _jsx(TextareaControl, { label: __('Custom icon', 'icon-block'), hideLabelFromVision: true, value: customIcon, onChange: setCustomIcon, placeholder: __('Paste the SVG code for your custom icon.', 'icon-block') }) }), _jsxs("div", { className: "icon-custom-inserter__sidebar", children: [_jsx(IconPreview, { iconToRender: isSVG ? iconToRender : bolt, iconSize: iconSize, setIconSize: setIconSize, isSVG: isSVG }), customIcon && !isSVG && (_jsx(Notice, { status: "error", isDismissible: false, children: __('The custom icon does not appear to be in a valid SVG format or contains non-SVG elements.', 'icon-block') })), _jsx(IconInsertButtons, { customIcon: customIcon, isSVG: isSVG, onClear: () => setCustomIcon(''), onInsert: insertCustomIcon })] })] }) }));
}
function IconPreview({ iconToRender, iconSize, setIconSize, isSVG }) {
    return (_jsxs("div", { className: "icon-preview", children: [_jsx("div", { className: classnames('icon-preview__window', {
                    'is-default': !isSVG,
                }), children: _jsx(Icon, { icon: iconToRender, size: iconSize }) }), _jsx("div", { className: "icon-controls", children: _jsxs("div", { className: "icon-controls__size", children: [_jsx("span", { children: __('Preview size', 'icon-block') }), _jsx(RangeControl, { min: 24, max: 400, value: iconSize, onChange: setIconSize, withInputField: false, __nextHasNoMarginBottom: true })] }) })] }));
}
function IconInsertButtons({ customIcon, isSVG, onClear, onInsert }) {
    return (_jsxs("div", { className: "icon-insert-buttons", children: [_jsx(Button, { label: __('Clear custom icon', 'icon-block'), variant: "secondary", disabled: !customIcon, onClick: onClear, children: __('Clear', 'icon-block') }), _jsx(Button, { label: __('Insert custom icon', 'icon-block'), variant: "primary", disabled: !isSVG || !customIcon, onClick: onInsert, children: __('Insert custom icon', 'icon-block') })] }));
}
