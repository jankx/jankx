
import { createContext, useContext, useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';

export type Device = 'ultrawide' | 'desktop' | 'tablet' | 'mobile';

interface DeviceContextType {
    device: Device;
    setDevice: (device: Device) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice must be used within a DeviceProvider (JankxInspector)');
    }
    return context;
};

interface JankxInspectorProps {
    tabs?: Array<{
        name: string;
        title: string;
        className?: string;
    }>;
    children: (tab: any) => React.ReactNode;
}

export const JankxInspector = ({ tabs = [], children }: JankxInspectorProps) => {
    const [device, setDevice] = useState<Device>('desktop');

    const defaultTabs = [
        {
            name: 'general',
            title: 'General',
            className: 'jankx-tab-general',
        },
        {
            name: 'style',
            title: 'Style',
            className: 'jankx-tab-style',
        },
        {
            name: 'responsive',
            title: 'Responsive',
            className: 'jankx-tab-responsive',
        },
        {
            name: 'advanced',
            title: 'Advanced',
            className: 'jankx-tab-advanced',
        }
    ];

    const activeTabs = tabs.length > 0 ? tabs : defaultTabs;

    return (
        <DeviceContext.Provider value={{ device, setDevice }}>
            <div className="jankx-inspector">
                <TabPanel
                    className="jankx-inspector-tabs"
                    activeClass="is-active"
                    tabs={activeTabs}
                >
                    {(tab) => (
                        <div className={`jankx-inspector-panel jankx-panel-${tab.name}`}>
                            {children(tab)}
                        </div>
                    )}
                </TabPanel>
            </div>
        </DeviceContext.Provider>
    );
};
