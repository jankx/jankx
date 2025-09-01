import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatNumberCompact } from '@automattic/number-formatters';
import { Icon } from '@wordpress/icons';
import { TrendComparison } from './count-comparison-card';
import './style.scss';
function MobileHighlightCard({ heading, count, previousCount, icon, preformattedValue, }) {
    // We'll accept a count or a preformatted string as our value.
    // If both are provided, we'll use the preformatted string for display.
    if (!preformattedValue && count === null) {
        return null;
    }
    // We require a heading to go with our value.
    if (!heading) {
        return null;
    }
    // The icon and trendline are optional.
    // Trendline depends on having a previous count value.
    const displayTrendline = Number.isFinite(previousCount);
    const displayIcon = icon !== undefined;
    return (_jsxs("div", { className: "mobile-highlight-cards__item", children: [displayIcon && (_jsx("span", { className: "mobile-highlight-cards__item-icon", children: _jsx(Icon, { icon: icon }) })), _jsx("span", { className: "mobile-highlight-cards__item-heading", children: heading }), displayTrendline && (_jsx("span", { className: "mobile-highlight-cards__item-trend", children: _jsx(TrendComparison, { count: count, previousCount: previousCount }) })), _jsx("span", { className: "mobile-highlight-cards__item-count", children: preformattedValue ? (preformattedValue) : (_jsx("span", { className: "shortened-number", children: count !== null ? formatNumberCompact(count) : '-' })) })] }));
}
export default function MobileHighlightCardListing({ highlights, }) {
    return (_jsx("div", { className: "mobile-highlight-cards-listing", children: highlights.map((highlight) => (_jsx(MobileHighlightCard, { heading: highlight.heading, count: highlight.count, previousCount: highlight.previousCount, icon: highlight.icon, preformattedValue: highlight.preformattedValue }, highlight.heading))) }));
}
//# sourceMappingURL=mobile-highlight-cards.js.map