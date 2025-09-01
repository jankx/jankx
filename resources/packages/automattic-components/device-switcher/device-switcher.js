import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useResizeObserver } from '@wordpress/compose';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { DEVICE_TYPES } from './constants';
import DeviceSwitcherToolbar from './toolbar';
import './device-switcher.scss';
// Transition animation delay
const ANIMATION_DURATION = 250;
const { COMPUTER, TABLET, PHONE } = DEVICE_TYPES;
const DeviceSwitcher = ({ children, className = '', defaultDevice = COMPUTER, isShowDeviceSwitcherToolbar, isShowFrameBorder, isShowFrameShadow = true, isFullscreen, frameRef, onDeviceChange, onViewportChange, }) => {
    const [device, setDevice] = useState(defaultDevice);
    const [containerResizeListener, { width, height }] = useResizeObserver();
    const timerRef = useRef(null);
    const handleDeviceClick = (nextDevice) => {
        setDevice(nextDevice);
        onDeviceChange?.(nextDevice);
    };
    // Animate on viewport size update
    useEffect(() => {
        const clearAnimationEndTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
        // Trigger animation end after the duration
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            const frameHeight = frameRef?.current?.getBoundingClientRect()?.height;
            if (frameHeight) {
                onViewportChange?.(frameHeight);
            }
        }, ANIMATION_DURATION);
        return clearAnimationEndTimer;
    }, [width, height]);
    return (_jsxs("div", { className: clsx(className, 'device-switcher__container', {
            'device-switcher__container--frame-shadow': isShowFrameShadow,
            'device-switcher__container--frame-bordered': isShowFrameBorder,
            'device-switcher__container--is-computer': device === COMPUTER,
            'device-switcher__container--is-tablet': device === TABLET,
            'device-switcher__container--is-phone': device === PHONE,
            'device-switcher__container--is-fullscreen': isFullscreen,
        }), children: [_jsx("div", { className: "device-switcher__header", children: isShowDeviceSwitcherToolbar && (_jsx(DeviceSwitcherToolbar, { device: device, onDeviceClick: handleDeviceClick })) }), _jsx("div", { className: "device-switcher__frame", ref: frameRef, children: children }), containerResizeListener] }));
};
export default DeviceSwitcher;
//# sourceMappingURL=device-switcher.js.map