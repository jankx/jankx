import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@wordpress/components';
import { Icon, desktop, mobile, tablet } from '@wordpress/icons';
import clsx from 'clsx';
import { translate } from 'i18n-calypso';
import { useRef } from 'react';
import { DEVICES_SUPPORTED, DEVICE_TYPES } from './constants';
import './toolbar.scss';
const DeviceSwitcherToolbar = ({ device: currentDevice, onDeviceClick }) => {
    const devices = useRef({
        [DEVICE_TYPES.COMPUTER]: { title: translate('Desktop'), icon: desktop, iconSize: 24 },
        [DEVICE_TYPES.TABLET]: { title: translate('Tablet'), icon: tablet, iconSize: 24 },
        [DEVICE_TYPES.PHONE]: { title: translate('Phone'), icon: mobile, iconSize: 24 },
    });
    return (_jsx("div", { className: "device-switcher__toolbar", children: _jsx("div", { className: "device-switcher__toolbar-devices", children: DEVICES_SUPPORTED.map((device) => (_jsx(Button, { "aria-label": devices.current[device].title, className: clsx({
                    [device]: true,
                    'is-selected': device === currentDevice,
                }), onClick: () => onDeviceClick(device), children: _jsx(Icon, { icon: devices.current[device].icon, size: devices.current[device].iconSize }) }, device))) }) }));
};
export default DeviceSwitcherToolbar;
//# sourceMappingURL=toolbar.js.map