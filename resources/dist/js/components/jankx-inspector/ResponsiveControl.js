import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonGroup, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDevice } from './JankxInspector';
export const ResponsiveControl = ({ label, children, isRelated = true }) => {
    const globalState = useDevice();
    const [localDevice, setLocalDevice] = useState('desktop');
    const device = isRelated ? globalState.device : localDevice;
    const setDevice = isRelated ? globalState.setDevice : setLocalDevice;
    return (_jsxs("div", { className: "jankx-responsive-control", children: [_jsxs("div", { className: "jankx-responsive-control__header", style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("span", { className: "jankx-responsive-control__label", style: { fontWeight: 500 }, children: label }), _jsxs(ButtonGroup, { className: "jankx-device-switcher", children: [_jsx(Button, { size: "small", variant: device === 'ultrawide' ? 'primary' : 'secondary', onClick: () => setDevice('ultrawide'), title: "Ultrawide", icon: "desktop" }), _jsx(Button, { size: "small", variant: device === 'desktop' ? 'primary' : 'secondary', onClick: () => setDevice('desktop'), title: "Desktop", icon: "desktop" }), _jsx(Button, { size: "small", variant: device === 'tablet' ? 'primary' : 'secondary', onClick: () => setDevice('tablet'), title: "Tablet", icon: "tablet" }), _jsx(Button, { size: "small", variant: device === 'mobile' ? 'primary' : 'secondary', onClick: () => setDevice('mobile'), title: "Mobile", icon: "smartphone" })] })] }), _jsx("div", { className: "jankx-responsive-control__content", children: children(device) })] }));
};
