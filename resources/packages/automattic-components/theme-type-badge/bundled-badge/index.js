import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { useRef, useMemo, useState } from 'react';
import Popover from '../../popover';
import './style.scss';
const BundledBadge = ({ className, color, icon, tooltipContent, tooltipClassName, tooltipPosition = 'bottom right', focusOnShow, isClickable, shouldHideTooltip, children, }) => {
    const divRef = useRef(null);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const isClickableProps = useMemo(() => {
        if (!isClickable) {
            return {};
        }
        return {
            role: 'button',
            tabIndex: 0,
            onBlur: () => {
                setIsPressed(false);
                setIsPopoverVisible(false);
            },
            onClick: () => {
                setIsPressed(!isPopoverVisible);
                setIsPopoverVisible(!isPopoverVisible);
            },
            onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsPressed(!isPopoverVisible);
                    setIsPopoverVisible(!isPopoverVisible);
                }
            },
        };
    }, [isClickable, isPopoverVisible]);
    return (_jsxs("div", { className: clsx('bundled-badge', className, {
            'bundled-badge--is-clickable': isClickable,
        }), style: { backgroundColor: color }, ref: divRef, onMouseEnter: () => {
            if (!isPressed) {
                setIsPopoverVisible(true);
            }
        }, onMouseLeave: () => {
            if (!isPressed) {
                setIsPopoverVisible(false);
            }
        }, ...isClickableProps, children: [icon && _jsx("span", { className: "bundled-badge__icon", children: icon }), _jsx("span", { children: children }), !shouldHideTooltip && (_jsx(Popover, { className: clsx('bundled-badge__popover', tooltipClassName), context: divRef.current, isVisible: isPopoverVisible, position: tooltipPosition, focusOnShow: focusOnShow, children: tooltipContent }))] }));
};
export default BundledBadge;
//# sourceMappingURL=index.js.map