import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { cloneElement, isValidElement } from 'react';
import './style.scss';
export const ListTile = ({ className, contentClassName, title, subtitle, leading, trailing, }) => {
    if (typeof title === 'string') {
        title = _jsxs("h2", { className: "list-tile__title", children: [" ", title, " "] });
    }
    if (typeof subtitle === 'string') {
        subtitle = _jsxs("span", { className: "list-tile__subtitle", children: [" ", subtitle, " "] });
    }
    const leadingElement = typeof leading === 'string' ? (_jsx("div", { className: "list-tile__leading", children: leading })) : isValidElement(leading) ? (cloneElement(leading, {
        className: clsx('list-tile__leading', leading.props.className),
    })) : null;
    const trailingElement = typeof trailing === 'string' ? (_jsx("div", { className: "list-tile__trailing", children: trailing })) : isValidElement(trailing) ? (cloneElement(trailing, {
        className: clsx('list-tile__trailing', trailing.props.className),
    })) : null;
    return (_jsxs("div", { className: clsx('list-tile', className), children: [leadingElement, _jsxs("div", { className: clsx('list-tile__content', contentClassName), children: [title, subtitle] }), trailingElement] }));
};
//# sourceMappingURL=index.js.map