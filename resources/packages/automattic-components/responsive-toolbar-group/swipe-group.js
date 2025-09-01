import { jsx as _jsx } from "react/jsx-runtime";
import { ToolbarGroup, ToolbarButton as BaseToolbarButton } from '@wordpress/components';
import clsx from 'clsx';
import { useState, useRef, useEffect, useMemo } from 'react';
import './style.scss';
const ToolbarButton = BaseToolbarButton;
export default function SwipeGroup({ children, className = '', onClick = () => null, initialActiveIndex = -1, initialActiveIndexes, isMultiSelection, hrefList = [], }) {
    const classes = clsx('responsive-toolbar-group__swipe', className);
    const defaultActiveIndexes = useMemo(() => {
        if (isMultiSelection) {
            return initialActiveIndexes || [];
        }
        return initialActiveIndex !== -1 ? [initialActiveIndex] : [];
    }, [isMultiSelection, initialActiveIndex, initialActiveIndexes]);
    const [activeIndexes, setActiveIndexes] = useState(new Set(defaultActiveIndexes));
    // Set active on prop change from above
    useEffect(() => {
        setActiveIndexes(new Set(defaultActiveIndexes));
    }, [defaultActiveIndexes]);
    const ref = useRef(null);
    // Scroll to category on load
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ block: 'end', inline: 'center' });
        }
    }, []);
    // Scroll to the beginning when activeIndexes changes to 0. This indicates a state reset.
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ block: 'end', inline: 'center' });
        }
    }, [activeIndexes]);
    return (_jsx("div", { className: classes, children: _jsx(ToolbarGroup, { className: "responsive-toolbar-group__swipe-list", children: children.map((child, index) => (_jsx(ToolbarButton, { id: `button-item-${index}`, isActive: activeIndexes.has(index), href: hrefList[index], ref: activeIndexes.has(index) ? ref : null, onClick: (event) => {
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
                    onClick(index);
                    if (typeof hrefList[index] === 'string') {
                        event.preventDefault();
                    }
                }, className: "responsive-toolbar-group__swipe-item", children: child }, `button-item-${index}`))) }) }));
}
//# sourceMappingURL=swipe-group.js.map