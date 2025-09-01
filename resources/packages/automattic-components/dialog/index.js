import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, close as closeIcon } from '@wordpress/icons';
import clsx from 'clsx';
import { useCallback } from 'react';
import Modal from 'react-modal';
import ButtonBar from './button-bar';
import './style.scss';
const Dialog = ({ additionalClassNames, additionalOverlayClassNames, buttons, baseClassName = 'dialog', className, children, isBackdropVisible = true, isFullScreen = true, isVisible = false, label = '', leaveTimeout = 200, onClose, shouldCloseOnEsc, showCloseIcon = false, shouldCloseOnOverlayClick = true, labelledby, describedby, bodyOpenClassName, }) => {
    const close = useCallback(() => onClose?.(), [onClose]);
    const onButtonClick = useCallback((button) => {
        if (button.onClick) {
            button.onClick(() => onClose?.(button.action));
        }
        else {
            onClose?.(button.action);
        }
    }, [onClose]);
    // Previous implementation used a `<Card />`, styling still relies on the 'card' class being present
    const dialogClassName = clsx(baseClassName, 'card', additionalClassNames);
    const backdropClassName = clsx(baseClassName + '__backdrop', additionalOverlayClassNames, {
        'is-full-screen': isFullScreen,
        'is-hidden': !isBackdropVisible,
    });
    const contentClassName = clsx(baseClassName + '__content', className);
    return (_jsxs(Modal, { aria: { labelledby, describedby }, isOpen: isVisible, onRequestClose: close, closeTimeoutMS: leaveTimeout, contentLabel: label, overlayClassName: backdropClassName, className: dialogClassName, htmlOpenClassName: "ReactModal__Html--open", role: "dialog", shouldCloseOnEsc: shouldCloseOnEsc, shouldCloseOnOverlayClick: shouldCloseOnOverlayClick, bodyOpenClassName: bodyOpenClassName, children: [showCloseIcon && (_jsx("button", { "aria-label": "Close", className: "dialog__action-buttons-close", onClick: () => onClose?.(this), children: _jsx(Icon, { icon: closeIcon, size: 24 }) })), _jsx("div", { className: contentClassName, tabIndex: -1, children: children }), _jsx(ButtonBar, { buttons: buttons, onButtonClick: onButtonClick, baseClassName: baseClassName })] }));
};
export default Dialog;
//# sourceMappingURL=index.js.map