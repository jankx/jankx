import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __experimentalVStack as VStack, __experimentalHStack as HStack, __experimentalText as Text, Button, Icon, } from '@wordpress/components';
import { chevronRight } from '@wordpress/icons';
import clsx from 'clsx';
import { forwardRef } from 'react';
import CoreBadge from '../core-badge';
import './style.scss';
function BadgesList({ badges }) {
    if (!badges?.length) {
        return null;
    }
    return (_jsx(HStack, { spacing: 1, justify: "flex-start", as: "span", wrap: true, expanded: false, children: badges?.map((badge) => (_jsx(CoreBadge, { intent: badge.intent, children: badge.text }, badge.text))) }));
}
function UnforwardedSummaryButton({ title, href, decoration, description, strapline, badges, showArrow = true, onClick, disabled, density = 'low', }, ref) {
    const hasLowDensity = density === 'low';
    return (_jsx(Button, { ref: ref, href: href, onClick: onClick, className: clsx('summary-button', `has-density-${density}`), disabled: disabled, accessibleWhenDisabled: true, children: _jsxs(HStack, { spacing: 4, justify: "flex-start", alignment: "flex-start", as: "span", children: [!!decoration && _jsx("span", { className: "summary-button-decoration", children: decoration }), _jsxs(HStack, { justify: "space-between", spacing: 4, as: "span", wrap: true, children: [_jsxs(VStack, { alignment: "flex-start", as: "span", spacing: 3, justify: "flex-start", children: [_jsxs(VStack, { alignment: "flex-start", as: "span", spacing: 2, justify: "flex-start", children: [strapline && hasLowDensity && (_jsx(Text, { variant: "muted", size: 10, upperCase: true, className: "summary-button-strapline", children: strapline })), _jsx(Text, { className: "summary-button-title", children: title }), description && hasLowDensity && _jsx(Text, { variant: "muted", children: description })] }), hasLowDensity && _jsx(BadgesList, { badges: badges })] }), !hasLowDensity && _jsx(BadgesList, { badges: badges })] }), showArrow && _jsx(Icon, { icon: chevronRight, className: "summary-button-navigation-icon" })] }) }));
}
export const SummaryButton = forwardRef(UnforwardedSummaryButton);
/**
 * The SummaryButton component provides a quick overview of a related page
 * (often settings). It includes a title, supporting description, and may
 * optionally display key field values or status indicators (e.g. a "2FA enabled" badge)
 * to surface the current state of settings at a glance.
 */
export default SummaryButton;
//# sourceMappingURL=index.js.map