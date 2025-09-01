import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToolbarGroup, ToolbarButton, Dropdown, MenuItem, MenuGroup, SlotFillProvider, Popover, } from '@wordpress/components';
import { Icon, chevronDown } from '@wordpress/icons';
import clsx from 'clsx';
import { useTranslate } from 'i18n-calypso';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import './style.scss';
export default function DropdownGroup({ children, className = '', hideRatio = 0.99, showRatio = 1, rootMargin = '0px', onClick = () => null, initialActiveIndex = -1, initialActiveIndexes, isMultiSelection, }) {
    const classes = clsx('responsive-toolbar-group__dropdown', className);
    const defaultActiveIndexes = useMemo(() => {
        if (isMultiSelection) {
            return initialActiveIndexes || [];
        }
        return initialActiveIndex !== -1 ? [initialActiveIndex] : [];
    }, [isMultiSelection, initialActiveIndex, initialActiveIndexes]);
    const containerRef = useRef(null);
    const [calculatedOnce, setCalculatedOnce] = useState(false);
    const [activeIndexes, setActiveIndexes] = useState(new Set(defaultActiveIndexes));
    const [groupedIndexes, setGroupedIndexes] = useState({});
    const { current: shadowListItems } = useRef([]);
    const translate = useTranslate();
    const onSelect = (index) => {
        setActiveIndexes((currentActiveIndexes) => {
            if (!isMultiSelection) {
                return new Set([index]);
            }
            if (!currentActiveIndexes.has(index)) {
                currentActiveIndexes.add(index);
            }
            else if (currentActiveIndexes.size > 1) {
                currentActiveIndexes.delete(index);
            }
            return currentActiveIndexes;
        });
    };
    const assignRef = (index, element) => {
        shadowListItems[index] = element;
    };
    const getChildrenToRender = () => Object.keys(groupedIndexes).map((index) => ({
        index,
        grouped: groupedIndexes[index],
        child: children[parseInt(index)],
    }));
    const renderChildren = (type = 'grouped') => {
        if (type === 'all') {
            return children.map((child, index) => (_jsx(ToolbarButton, { ref: (el) => assignRef(index, el), className: "responsive-toolbar-group__button-item", children: child }, `shadow-item-${index}`)));
        }
        return getChildrenToRender()
            .filter(({ grouped }) => !grouped)
            .map(({ index, child }) => (_jsx(ToolbarButton, { isActive: activeIndexes.has(parseInt(index)), onClick: () => {
                onSelect(parseInt(index));
                onClick(parseInt(index));
            }, className: "responsive-toolbar-group__button-item", children: child }, `button-item-${index}`)));
    };
    const maybeRenderMore = (always = false) => {
        const containGroupedIndexes = !!Object.values(groupedIndexes).find((index) => index);
        if (containGroupedIndexes || always) {
            return (_jsxs(SlotFillProvider, { children: [_jsx(Popover.Slot, {}), _jsx(Dropdown, { renderToggle: ({ onToggle }) => (_jsxs(ToolbarButton, { className: clsx('responsive-toolbar-group__more-item', 'responsive-toolbar-group__button-item'), isActive: Array.from(activeIndexes).some((index) => groupedIndexes[index]), onClick: () => {
                                onToggle();
                            }, children: [translate('More'), _jsx(Icon, { icon: chevronDown })] })), renderContent: ({ onClose }) => (_jsx(MenuGroup, { children: getChildrenToRender()
                                .filter(({ grouped }) => grouped)
                                .map(({ index, child }) => (_jsx(MenuItem, { onClick: () => {
                                    onSelect(parseInt(index));
                                    onClick(parseInt(index));
                                    onClose();
                                }, className: clsx('responsive-toolbar-group__menu-item', activeIndexes.has(parseInt(index)) ? 'is-selected' : ''), children: child }, `menu-item-${index}`))) })) })] }));
        }
        return;
    };
    // I have to optimize this callback so it doesn't do unnecesary updates
    const interceptionCallback = useCallback((index, entries) => {
        const entry = entries[0];
        if (index === 0) {
            return;
        }
        if (entry.intersectionRatio >= showRatio) {
            // is last child becoming visible just showcase it.
            if (index === children.length - 1) {
                setGroupedIndexes((state) => ({
                    ...state,
                    [index]: false,
                    [index - 1]: false,
                }));
            }
            else {
                setGroupedIndexes((state) => ({
                    ...state,
                    [index - 1]: false,
                }));
            }
        }
        // always hide sets of two to give space to the "more" item.
        if (entry.intersectionRatio <= hideRatio) {
            setGroupedIndexes((state) => ({
                ...state,
                [index]: true,
                [index - 1]: true,
            }));
        }
        setCalculatedOnce((calculated) => {
            if (!calculated) {
                return true;
            }
            return calculated;
        });
    }, [children, hideRatio, showRatio]);
    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        const observers = [];
        shadowListItems.forEach((listItem, index) => {
            observers[index] = new IntersectionObserver(interceptionCallback.bind(DropdownGroup, index), {
                root: containerRef.current,
                rootMargin,
                threshold: [hideRatio, showRatio],
            });
            observers[index].observe(listItem);
        });
        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [shadowListItems, interceptionCallback, hideRatio, showRatio, rootMargin]);
    // Reset active on prop change from above
    useEffect(() => {
        setActiveIndexes(new Set(defaultActiveIndexes));
    }, [defaultActiveIndexes]);
    return (_jsxs("div", { className: classes, ref: containerRef, children: [_jsxs(ToolbarGroup, { className: "responsive-toolbar-group__full-list", children: [renderChildren('all'), maybeRenderMore(true)] }), _jsxs(ToolbarGroup, { className: clsx('responsive-toolbar-group__grouped-list', {
                    'is-visible': calculatedOnce,
                    'is-multi': isMultiSelection,
                }), children: [renderChildren(), maybeRenderMore()] })] }));
}
//# sourceMappingURL=dropdown-group.js.map