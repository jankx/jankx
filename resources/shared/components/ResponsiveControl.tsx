import { __ } from '@wordpress/i18n';
import { Button, RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export interface ResponsiveValue {
    ultrawide?: number;
    desktop: number;
    tablet: number;
    mobile: number;
}

export interface ResponsiveControlProps {
    label: string;
    values: ResponsiveValue;
    onChange: (values: ResponsiveValue) => void;
    min?: number;
    max?: number;
    step?: number;
    help?: {
        desktop?: string;
        tablet?: string;
        mobile?: string;
    };
    className?: string;
}

export default function ResponsiveControl({
    label,
    values,
    onChange,
    min = 1,
    max = 6,
    step = 1,
    help = {},
    className = ''
}: ResponsiveControlProps) {
    const [selectedDevice, setSelectedDevice] = useState<'ultrawide' | 'desktop' | 'tablet' | 'mobile'>('desktop');

    const handleValueChange = (value?: number) => {
        if (value === undefined) return;
        onChange({
            ...values,
            [selectedDevice]: value
        });
    };

    const getCurrentValue = () => values[selectedDevice];
    const getCurrentHelp = () => help[selectedDevice];

    return (
        <div className={`responsive-control ${className}`}>
            <div style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <label style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1e1e1e',
                    margin: 0
                }}>
                    {label}
                </label>
                <div style={{ display: 'flex', gap: '2px' }}>
                    <Button
                        isPressed={selectedDevice === 'ultrawide'}
                        onClick={() => setSelectedDevice('ultrawide')}
                        variant={selectedDevice === 'ultrawide' ? 'primary' : 'secondary'}
                        size="small"
                        title={__('Ultrawide', 'jankx')}
                    >
                        🖥️
                    </Button>
                    <Button
                        isPressed={selectedDevice === 'desktop'}
                        onClick={() => setSelectedDevice('desktop')}
                        variant={selectedDevice === 'desktop' ? 'primary' : 'secondary'}
                        size="small"
                        title={__('Desktop', 'jankx')}
                    >
                        🖥️
                    </Button>
                    <Button
                        isPressed={selectedDevice === 'tablet'}
                        onClick={() => setSelectedDevice('tablet')}
                        variant={selectedDevice === 'tablet' ? 'primary' : 'secondary'}
                        size="small"
                        title={__('Tablet', 'jankx')}
                    >
                        📱
                    </Button>
                    <Button
                        isPressed={selectedDevice === 'mobile'}
                        onClick={() => setSelectedDevice('mobile')}
                        variant={selectedDevice === 'mobile' ? 'primary' : 'secondary'}
                        size="small"
                        title={__('Mobile', 'jankx')}
                    >
                        📱
                    </Button>
                </div>
            </div>

            <RangeControl
                label={__(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} ${label}`, 'jankx')}
                value={getCurrentValue()}
                onChange={handleValueChange}
                min={min}
                max={max}
                step={step}
                help={getCurrentHelp()}
            />
        </div>
    );
}

