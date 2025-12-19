import { jsx as _jsx } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow } from '@wordpress/components';
/**
 * Shared InspectorPanel component để chuẩn hóa các panel
 * Giống như core blocks và svg-icon block
 */
export default function InspectorPanel({ title, children, initialOpen = true, icon, className }) {
    return (_jsx(PanelBody, { title: title, icon: icon, initialOpen: initialOpen, className: className, children: children }));
}
/**
 * Shared InspectorPanelRow component để wrap các controls trong panel
 */
export function InspectorPanelRow({ children }) {
    return _jsx(PanelRow, { children: children });
}
/**
 * Predefined panels cho các use cases phổ biến
 */
export const CommonPanels = {
    Settings: ({ children, initialOpen = true }) => (_jsx(InspectorPanel, { title: __('Settings', 'jankx'), initialOpen: initialOpen, children: children })),
    Typography: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Typography', 'jankx'), initialOpen: initialOpen, children: children })),
    Colors: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Colors', 'jankx'), initialOpen: initialOpen, children: children })),
    Layout: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Layout', 'jankx'), initialOpen: initialOpen, children: children })),
    Spacing: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Spacing', 'jankx'), initialOpen: initialOpen, children: children })),
    Border: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Border', 'jankx'), initialOpen: initialOpen, children: children })),
    Effects: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Effects', 'jankx'), initialOpen: initialOpen, children: children })),
    Advanced: ({ children, initialOpen = false }) => (_jsx(InspectorPanel, { title: __('Advanced', 'jankx'), initialOpen: initialOpen, children: children }))
};
