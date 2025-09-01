import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __experimentalText as Text, __experimentalHStack as HStack, Button, VisuallyHidden, } from '@wordpress/components';
import { useResizeObserver, useMergeRefs } from '@wordpress/compose';
import { useI18n } from '@wordpress/react-i18n';
import clsx from 'clsx';
import { useState, forwardRef, useRef } from 'react';
import Menu from '../menu';
import './style.scss';
function BreadcrumbsMenu({ items }) {
    const { __ } = useI18n();
    return (_jsx("li", { className: "a8c-components-breadcrumbs__item-wrapper", children: _jsxs(Menu, { placement: "bottom-start", children: [_jsx(Menu.TriggerButton, { className: "a8c-components-breadcrumbs__item", render: _jsx(Button, { size: "compact", text: __('…'), label: __('More breadcrumb items') }) }), _jsx(Menu.Popover, { children: items.map((item, index) => (_jsx(Menu.Item, { onClick: item.onClick, render: _jsx("a", { href: item.href }), children: _jsx(Menu.ItemLabel, { children: item.label }) }, `${item.label}-${index}`))) })] }) }));
}
function BreadcrumbItem({ item: { label, href, onClick } }) {
    return (_jsx("li", { className: "a8c-components-breadcrumbs__item-wrapper", children: _jsx("a", { href: href, onClick: onClick, className: "a8c-components-breadcrumbs__item", children: label }) }));
}
function BreadcrumbCurrentItem({ item: { label }, visible = false, }) {
    const content = (_jsx(Text, { as: "span", className: "a8c-components-breadcrumbs__item", "aria-current": "page", children: label }));
    return visible ? (_jsx("li", { className: "a8c-components-breadcrumbs__item-wrapper is-current", children: content })) : (_jsx(VisuallyHidden, { as: "li", children: content }));
}
const BreadcrumbsNav = forwardRef(function BreadcrumbsNav({ isOffscreen, items, showCurrentItem = false, variant = 'default', ...props }, ref) {
    // Always show the first item. The last item (current page) is rendered
    // conditionally based on the `showCurrentItem` prop.
    const hasMiddleItems = items.length > 3;
    const firstItem = items[0];
    const middleItems = hasMiddleItems ? items.slice(1, -2) : [];
    // Always show the parent item if there are more than 2 items. If there
    // are only 2 items, the parent item is the first item and is already shown.
    const parentItem = items.length > 2 && items[items.length - 2];
    /**
     * As the container shrinks, multiple breadcrumb items between the first and
     * last visible item should collapse into a dropdown menu to avoid wrapping.
     * The current approach is to keep a ref of the `offScreen (full-width)`
     * container and observe for `inlineSize` changes. If the `offScreen` container
     * would overflow, we should render the compact variant.
     * Noting that we prioritize the `isCompact` prop over the `width` checks.
     */
    const isCompact = !isOffscreen && hasMiddleItems && variant === 'compact';
    return (_jsx("nav", { className: clsx('a8c-components-breadcrumbs', { 'is-offscreen': isOffscreen }), ref: ref, ...(isOffscreen && { 'aria-hidden': true, inert: '' }), ...props, children: _jsxs(HStack, { as: "ul", className: "a8c-components-breadcrumbs__list", spacing: 0, justify: "flex-start", expanded: false, children: [_jsx(BreadcrumbItem, { item: firstItem }), isCompact ? (_jsx(BreadcrumbsMenu, { items: middleItems })) : (middleItems.map((item, index) => (_jsx(BreadcrumbItem, { item: item }, `${item.label}-${index}`)))), parentItem && _jsx(BreadcrumbItem, { item: parentItem }), _jsx(BreadcrumbCurrentItem, { item: items[items.length - 1], visible: showCurrentItem })] }) }));
});
function UnforwardedBreadcrumbs({ items, 'aria-label': ariaLabel, ...props }, ref) {
    const { __ } = useI18n();
    const computedAriaLabel = ariaLabel ?? __('Breadcrumbs');
    const offScreenWidth = useRef(0);
    const containerWidth = useRef(0);
    const [shouldRenderCompact, setShouldRenderCompact] = useState(false);
    const computeShouldRenderCompact = () => {
        setShouldRenderCompact(offScreenWidth.current > containerWidth.current);
    };
    const offScreenRef = useResizeObserver((resizeObserverEntries) => {
        offScreenWidth.current = resizeObserverEntries[0].borderBoxSize[0].inlineSize;
        computeShouldRenderCompact();
    });
    const containerRef = useResizeObserver((resizeObserverEntries) => {
        containerWidth.current = resizeObserverEntries[0].borderBoxSize[0].inlineSize;
        computeShouldRenderCompact();
    });
    const mergedRefs = useMergeRefs([ref, containerRef]);
    if (!items.length || items.length === 1) {
        return null;
    }
    const computedVariant = shouldRenderCompact ? 'compact' : props.variant;
    return (_jsxs(_Fragment, { children: [_jsx(BreadcrumbsNav, { ref: offScreenRef, items: items, ...props, variant: computedVariant, isOffscreen: true }), _jsx(BreadcrumbsNav, { ref: mergedRefs, items: items, ...props, variant: computedVariant, "aria-label": computedAriaLabel })] }));
}
/**
 * The `Breadcrumbs` component provides a secondary navigation aid that shows
 * users their current location within a site's or application's hierarchy.
 * It helps users understand the structure of the site, retrace their steps,
 * and easily navigate to higher-level pages.
 *
 * For accessibility, **it is important that the current page is included as the
 * final item in the breadcrumb trail**. This ensures screen reader users
 * receive the full navigational context.
 */
export const Breadcrumbs = forwardRef(UnforwardedBreadcrumbs);
//# sourceMappingURL=index.js.map