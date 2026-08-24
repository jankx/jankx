import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { InspectorControls } from '@wordpress/block-editor';
/**
 * Shared InspectorTabs component để chuẩn hóa cấu trúc tabs
 * Giống như core blocks và svg-icon block
 */
export default function InspectorTabs({ children, showSettings = true, showColor = true, showAdvanced = true, showTypography = false, showLayout = false, showSpacing = false, showBorder = false, showEffects = false, showCustomCSS = false }) {
    return (_jsxs(_Fragment, { children: [showSettings && (_jsx(InspectorControls, { group: "settings", children: children })), showColor && (_jsx(InspectorControls, { group: "color" })), showTypography && (_jsx(InspectorControls, { group: "typography" })), showLayout && (_jsx(InspectorControls, { group: "layout" })), showSpacing && (_jsx(InspectorControls, { group: "spacing" })), showBorder && (_jsx(InspectorControls, { group: "border" })), showEffects && (_jsx(InspectorControls, { group: "effects" })), showAdvanced && (_jsx(InspectorControls, { group: "advanced" })), showCustomCSS && (_jsx(InspectorControls, { group: "custom-css" }))] }));
}
