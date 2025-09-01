import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, warning, info, check, closeSmall } from '@wordpress/icons';
import clsx from 'clsx';
import { alert } from '../icons';
import './style.scss';
const getIconByLevel = (level) => {
    switch (level) {
        case 'error':
            return alert;
        case 'warning':
            return info;
        case 'info':
            return info;
        case 'success':
            return check;
        default:
            return warning;
    }
};
export default function NoticeBanner({ level = 'info', title, children, actions, hideCloseButton = false, onClose, }) {
    return (_jsxs("div", { className: clsx('notice-banner', `is-${level}`), children: [_jsx("div", { className: "notice-banner__icon-wrapper", children: _jsx(Icon, { icon: getIconByLevel(level), className: "notice-banner__icon" }) }), _jsxs("div", { className: "notice-banner__main-content", children: [title ? _jsx("div", { className: "notice-banner__title", children: title }) : null, children, actions && actions.length > 0 && (_jsx("div", { className: "notice-banner__action-bar", children: actions.map((action, index) => (_jsx("div", { children: action }, index))) }))] }), !hideCloseButton && (_jsx("button", { "aria-label": "close", className: "notice-banner__close-button", onClick: onClose, children: _jsx(Icon, { icon: closeSmall }) }))] }));
}
//# sourceMappingURL=index.js.map