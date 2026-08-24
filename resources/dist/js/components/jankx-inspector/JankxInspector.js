import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
const DeviceContext = createContext(undefined);
export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice must be used within a DeviceProvider (JankxInspector)');
    }
    return context;
};
export const JankxInspector = ({ tabs = [], children }) => {
    const [device, setDevice] = useState('desktop');
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
    return (_jsx(DeviceContext.Provider, { value: { device, setDevice }, children: _jsx("div", { className: "jankx-inspector", children: _jsx(TabPanel, { className: "jankx-inspector-tabs", activeClass: "is-active", tabs: activeTabs, children: (tab) => (_jsx("div", { className: `jankx-inspector-panel jankx-panel-${tab.name}`, children: children(tab) })) }) }) }));
};
