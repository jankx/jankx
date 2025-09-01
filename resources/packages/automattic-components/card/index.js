import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { createElement, forwardRef, memo } from 'react';
import Gridicon from '../gridicon';
import './style.scss';
const Card = ({ children, className, compact, displayAsLink, highlight, tagName = 'div', href, target, showLinkIcon = true, ...props }, forwardedRef // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
    const elementClass = clsx('card', className, {
        'is-card-link': displayAsLink || href,
        'is-clickable': props.onClick,
        'is-compact': compact,
        'is-highlight': highlight,
    }, highlight ? 'is-' + highlight : false);
    return href ? (_jsxs("a", { ...props, href: href, target: target, className: elementClass, ref: forwardedRef, children: [showLinkIcon && (_jsx(Gridicon, { className: "card__link-indicator", icon: target ? 'external' : 'chevron-right' })), children] })) : (createElement(tagName, { ...props, className: elementClass, ref: forwardedRef }, displayAsLink && (_jsx(Gridicon, { className: "card__link-indicator", icon: target ? 'external' : 'chevron-right' })), children));
};
const ForwardedRefCard = forwardRef(Card);
ForwardedRefCard.displayName = 'Card';
export default memo(ForwardedRefCard);
//# sourceMappingURL=index.js.map