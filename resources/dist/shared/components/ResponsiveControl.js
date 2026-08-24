import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { ButtonGroup, Button, RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
export default function ResponsiveControl({ label, values, onChange, min = 1, max = 6, step = 1, help = {}, className = '' }) {
    const [selectedDevice, setSelectedDevice] = useState('desktop');
    const handleValueChange = (value) => {
        if (value === undefined)
            return;
        onChange({
            ...values,
            [selectedDevice]: value
        });
    };
    const getCurrentValue = () => values[selectedDevice];
    const getCurrentHelp = () => help[selectedDevice];
    return (_jsxs("div", { className: `responsive-control ${className}`, children: [_jsxs("div", { style: {
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }, children: [_jsx("label", { style: {
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#1e1e1e',
                            margin: 0
                        }, children: label }), _jsxs(ButtonGroup, { children: [_jsx(Button, { isPressed: selectedDevice === 'ultrawide', onClick: () => setSelectedDevice('ultrawide'), variant: selectedDevice === 'ultrawide' ? 'primary' : 'secondary', size: "small", title: __('Ultrawide', 'jankx'), children: "\uD83D\uDDA5\uFE0F" }), _jsx(Button, { isPressed: selectedDevice === 'desktop', onClick: () => setSelectedDevice('desktop'), variant: selectedDevice === 'desktop' ? 'primary' : 'secondary', size: "small", title: __('Desktop', 'jankx'), children: "\uD83D\uDDA5\uFE0F" }), _jsx(Button, { isPressed: selectedDevice === 'tablet', onClick: () => setSelectedDevice('tablet'), variant: selectedDevice === 'tablet' ? 'primary' : 'secondary', size: "small", title: __('Tablet', 'jankx'), children: "\uD83D\uDCF1" }), _jsx(Button, { isPressed: selectedDevice === 'mobile', onClick: () => setSelectedDevice('mobile'), variant: selectedDevice === 'mobile' ? 'primary' : 'secondary', size: "small", title: __('Mobile', 'jankx'), children: "\uD83D\uDCF1" })] })] }), _jsx(RangeControl, { label: __(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} ${label}`, 'jankx'), value: getCurrentValue(), onChange: handleValueChange, min: min, max: max, step: step, help: getCurrentHelp() })] }));
}
