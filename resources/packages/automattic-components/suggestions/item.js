import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { escapeRegExp } from 'lodash';
import { useEffect, memo, forwardRef } from 'react';
function escapeRegExpWithSpace(str) {
    return escapeRegExp(str).replace(/\s/g, '\\s');
}
const createTextWithHighlight = (text, query) => {
    const re = new RegExp('(' + escapeRegExpWithSpace(query) + ')', 'gi');
    const parts = text.split(re);
    // Replaces char code 160 (&nbsp;) with 32 (space)
    const match = query.toLowerCase().replace(/\s/g, ' ');
    return parts.map((part, i) => {
        const key = text + i;
        const lowercasePart = part.toLowerCase();
        const spanClass = clsx('suggestions__label', {
            'is-emphasized': lowercasePart === match,
        });
        return (_jsx("span", { className: spanClass, children: part }, key));
    });
};
const Item = ({ label, hasHighlight = false, query = '', onMount, onMouseDown, onMouseOver }, forwardedRef) => {
    useEffect(() => {
        onMount();
        // Disable reason: We don't want to re-fire `onMount` if it changes, literally only fire it onMount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleMouseDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        onMouseDown();
    };
    const className = clsx('suggestions__item', { 'has-highlight': hasHighlight });
    return (_jsx("button", { className: className, onMouseDown: handleMouseDown, onFocus: handleMouseDown, onMouseOver: onMouseOver, ref: forwardedRef, children: createTextWithHighlight(label, query) }));
};
export default memo(forwardRef(Item));
//# sourceMappingURL=item.js.map