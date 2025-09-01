import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { arrowDown, arrowUp, Icon } from '@wordpress/icons';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Card } from '../';
import Popover from '../popover';
import { formatNumber, formatPercentage, subtract, percentCalculator } from './lib/numbers';
export function TrendComparison({ count, previousCount }) {
    const difference = subtract(count, previousCount);
    const percentage = Number.isFinite(difference)
        ? percentCalculator(Math.abs(difference), previousCount)
        : null;
    // Show nothing if inputs are invalid or if there is no change.
    if (difference === null || difference === 0) {
        return null;
    }
    return Math.abs(difference) === 0 ? null : (_jsxs("span", { className: clsx('highlight-card-difference', {
            'highlight-card-difference--positive': difference < 0,
            'highlight-card-difference--negative': difference > 0,
        }), children: [_jsxs("span", { className: "highlight-card-difference-icon", children: [difference < 0 && _jsx(Icon, { size: 18, icon: arrowDown }), difference > 0 && _jsx(Icon, { size: 18, icon: arrowUp })] }), percentage !== null && (_jsxs("span", { className: "highlight-card-difference-absolute-percentage", children: [' ', formatPercentage(percentage)] }))] }));
}
export function TooltipContent({ count, previousCount }) {
    const difference = subtract(count, previousCount);
    return (_jsx("div", { className: "highlight-card-tooltip-content", children: _jsxs("div", { className: "highlight-card-tooltip-counts", children: [formatNumber(count, false), '  ', difference !== 0 && difference !== null && (_jsxs("span", { className: "highlight-card-tooltip-count-difference", children: ["(", formatNumber(difference, false, true), ")"] }))] }) }));
}
export default function CountComparisonCard({ count, previousCount, icon, heading, showValueTooltip, compact = false, }) {
    const textRef = useRef(null);
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    return (_jsxs(Card, { className: "highlight-card", compact: compact, children: [icon && _jsx("div", { className: "highlight-card-icon", children: icon }), heading && _jsx("div", { className: "highlight-card-heading", children: heading }), _jsxs("div", { className: clsx('highlight-card-count', {
                    'is-pointer': showValueTooltip,
                }), onMouseEnter: () => setTooltipVisible(true), onMouseLeave: () => setTooltipVisible(false), children: [_jsx("span", { className: "highlight-card-count-value", ref: textRef, children: formatNumber(count) }), ' ', _jsx(TrendComparison, { count: count, previousCount: previousCount }), showValueTooltip && (_jsx(Popover, { className: "tooltip tooltip--darker highlight-card-tooltip", isVisible: isTooltipVisible, position: "bottom right", context: textRef.current, children: _jsx(TooltipContent, { count: count, previousCount: previousCount, icon: icon, heading: heading }) }))] })] }));
}
//# sourceMappingURL=count-comparison-card.js.map