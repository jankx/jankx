import { jsx as _jsx } from "react/jsx-runtime";
import { Popover } from '@wordpress/components';
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
/**
 * Adds a11y support to the submenu popover.
 * - Closes the popover when pressing Escape.
 * - Closes the popover when pressing Tab and the focus is on the last element.
 */
function useCloseSubmenuA11y() {
    return useCallback(({ event, lastChild, setIsVisible, }) => {
        const isEscape = event.key === 'Escape';
        const tabOnLastChild = event.key === 'Tab' && !event.shiftKey && lastChild === event.target;
        if (isEscape || tabOnLastChild) {
            setIsVisible(false);
        }
    }, []);
}
/**
 * Checks if the submenu popover has enough space to be displayed on the right.
 * If not, it will return false to be displayed on the left.
 */
function useHasRightSpace(parentElement, isVisible) {
    const [widthSubmenu, setWidthSubmenu] = useState(0);
    useEffect(() => {
        if (isVisible && parentElement) {
            const submenuElement = parentElement.querySelector('.submenu-popover');
            if (submenuElement) {
                setWidthSubmenu(submenuElement.offsetWidth);
            }
        }
    }, [parentElement, isVisible]);
    return useMemo(() => {
        if (!parentElement) {
            return true;
        }
        const calculatedThreshold = widthSubmenu;
        const { right } = parentElement.getBoundingClientRect();
        return window.innerWidth - right > calculatedThreshold;
    }, [parentElement, widthSubmenu]);
}
export function useSubmenuPopoverProps(options = {
    offset: 0,
    flip: true,
    resize: true,
    inline: false,
}) {
    const { offset, inline, flip, resize } = options;
    const [isVisible, setIsVisible] = useState(false);
    const anchor = useRef();
    const parentElement = anchor?.current;
    const hasRightSpace = useHasRightSpace(parentElement, isVisible);
    const closeSubmenuA11y = useCloseSubmenuA11y();
    const submenu = {
        isVisible,
        placement: hasRightSpace ? 'right-start' : 'left-start',
        anchor: anchor?.current,
        offset,
        flip,
        resize,
        inline,
    };
    const parent = {
        ref: anchor,
        onMouseOver: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
        onClick: () => setIsVisible(true),
        onKeyDown: (event) => {
            const lastChild = anchor.current?.querySelector('.submenu-popover > :last-child > :last-child');
            closeSubmenuA11y({ event, lastChild, setIsVisible });
        },
    };
    return {
        parent,
        submenu,
    };
}
function SubmenuPopover(props) {
    const { children, isVisible = false, ...rest } = props;
    if (!isVisible) {
        return null;
    }
    return (_jsx(Popover, { className: "submenu-popover", ...rest, children: children }));
}
export default SubmenuPopover;
//# sourceMappingURL=index.js.map