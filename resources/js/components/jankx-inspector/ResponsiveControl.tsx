
import { ButtonGroup, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDevice, Device } from './JankxInspector';

interface ResponsiveControlProps {
    label: string;
    children: (device: Device) => React.ReactNode;
    isRelated?: boolean;
}

export const ResponsiveControl = ({ label, children, isRelated = true }: ResponsiveControlProps) => {
    const globalState = useDevice();
    const [localDevice, setLocalDevice] = useState<Device>('desktop');

    const device = isRelated ? globalState.device : localDevice;
    const setDevice = isRelated ? globalState.setDevice : setLocalDevice;

    return (
        <div className="jankx-responsive-control">
            <div className="jankx-responsive-control__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="jankx-responsive-control__label" style={{ fontWeight: 500 }}>{label}</span>
                <ButtonGroup className="jankx-device-switcher">
                    <Button
                        size="small"
                        variant={device === 'ultrawide' ? 'primary' : 'secondary'}
                        onClick={() => setDevice('ultrawide')}
                        title="Ultrawide"
                        icon="desktop"
                    />
                    <Button
                        size="small"
                        variant={device === 'desktop' ? 'primary' : 'secondary'}
                        onClick={() => setDevice('desktop')}
                        title="Desktop"
                        icon="desktop"
                    />
                    <Button
                        size="small"
                        variant={device === 'tablet' ? 'primary' : 'secondary'}
                        onClick={() => setDevice('tablet')}
                        title="Tablet"
                        icon="tablet"
                    />
                    <Button
                        size="small"
                        variant={device === 'mobile' ? 'primary' : 'secondary'}
                        onClick={() => setDevice('mobile')}
                        title="Mobile"
                        icon="smartphone"
                    />
                </ButtonGroup>
            </div>
            <div className="jankx-responsive-control__content">
                {children(device)}
            </div>
        </div>
    );
};
