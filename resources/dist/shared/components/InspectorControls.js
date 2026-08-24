import { jsx as _jsx } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { InspectorControls as WPInspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
/**
 * Shared InspectorControls component với ToolsPanel support
 * Giống như svg-icon block và core blocks
 */
export default function InspectorControls({ group = 'settings', children, useToolsPanel = false, toolsPanelLabel, resetAll, dropdownMenuProps }) {
    if (useToolsPanel) {
        return (_jsx(WPInspectorControls, { group: group, children: _jsx(ToolsPanel, { label: toolsPanelLabel || __('Settings', 'jankx'), resetAll: resetAll, dropdownMenuProps: dropdownMenuProps, children: children }) }));
    }
    return (_jsx(WPInspectorControls, { group: group, children: children }));
}
/**
 * Shared ToolsPanelItem component để wrap các controls
 */
export function InspectorToolsPanelItem({ label, children, isShownByDefault = true, hasValue, onDeselect }) {
    return (_jsx(ToolsPanelItem, { label: label, isShownByDefault: isShownByDefault, hasValue: hasValue, onDeselect: onDeselect, children: children }));
}
/**
 * Predefined InspectorControls cho các groups phổ biến
 */
export const InspectorGroups = {
    Settings: ({ children, useToolsPanel = false, ...props }) => (_jsx(InspectorControls, { group: "settings", useToolsPanel: useToolsPanel, ...props, children: children })),
    Color: ({ children }) => (_jsx(InspectorControls, { group: "color", children: children })),
    Typography: ({ children }) => (_jsx(InspectorControls, { group: "typography", children: children })),
    Layout: ({ children }) => (_jsx(InspectorControls, { group: "layout", children: children })),
    Spacing: ({ children }) => (_jsx(InspectorControls, { group: "spacing", children: children })),
    Border: ({ children }) => (_jsx(InspectorControls, { group: "border", children: children })),
    Effects: ({ children }) => (_jsx(InspectorControls, { group: "effects", children: children })),
    Advanced: ({ children }) => (_jsx(InspectorControls, { group: "advanced", children: children }))
};
