import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { formatNumber as formatNumberI18n } from '@automattic/number-formatters';
import { arrowDown, arrowUp, Icon } from '@wordpress/icons';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Card } from '../';
import Popover from '../popover';
import { subtract, formatNumber } from './lib/numbers';
export function TooltipContent({ value, label, note, previousValue }) {
    const difference = subtract(value, previousValue);
    let trendClass = 'highlight-card-tooltip-count-difference-positive';
    let trendIcon = arrowUp;
    if (difference !== null && difference < 0) {
        trendClass = 'highlight-card-tooltip-count-difference-negative';
        trendIcon = arrowDown;
    }
    /**
     * TODO clk - We are currently in the process of unifying numberFormat from i18n-calypso with the one from number-formatters.
     * Once settled, we should consider where to place the "-" default for null values.
     */
    const tooltipCount = value !== null ? formatNumberI18n(value) : '—';
    return (_jsxs("div", { className: "highlight-card-tooltip-content", children: [_jsxs("span", { className: "highlight-card-tooltip-counts", children: [tooltipCount, label && ` ${label}`] }), difference !== null && difference !== 0 && (_jsxs("span", { className: trendClass, children: [_jsx(Icon, { size: 18, icon: trendIcon }), formatNumberI18n(Math.abs(difference))] })), note && _jsx("div", { className: "highlight-card-tooltip-note", children: note })] }));
}
export default function CountCard({ heading, icon, label, note, value, showValueTooltip, }) {
    const textRef = useRef(null);
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    // Tooltips are used to show the full number instead of the shortened number.
    // Non-numeric values are not shown in the tooltip.
    const shouldShowTooltip = showValueTooltip && typeof value === 'number';
    return (_jsxs(Card, { className: "highlight-card", children: [icon && _jsx("div", { className: "highlight-card-icon", children: icon }), heading && _jsx("div", { className: "highlight-card-heading", children: heading }), _jsx("div", { className: clsx('highlight-card-count', {
                    'is-pointer': showValueTooltip,
                }), onMouseEnter: () => setTooltipVisible(true), onMouseLeave: () => setTooltipVisible(false), children: _jsx("span", { className: "highlight-card-count-value", ref: textRef, children: typeof value === 'number' ? formatNumber(value, true) : value }) }), shouldShowTooltip && (_jsx(Popover, { className: "tooltip tooltip--darker highlight-card-tooltip", isVisible: isTooltipVisible, position: "bottom right", context: textRef.current, children: _jsx(TooltipContent, { value: value, label: label, note: note }) }))] }));
}
//# sourceMappingURL=count-card.js.map