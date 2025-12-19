import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./style.scss";
import { __ } from "@wordpress/i18n";
import { useState, useCallback } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { Popover, Button, ColorPicker } from "@wordpress/components";
import IconUnderlineCurve from "./icon-underline-curve";
const UnderlineEffectUI = ({ onClose, onChange, popoverAnchor, borderColor, setBorderColor, LABEL_APPLY_UNDERLINE, LABEL_POPOVER_TITLE, }) => {
    return (_jsxs(Popover, { className: 'jankx-popover', anchor: popoverAnchor, children: [_jsx("h4", { children: LABEL_POPOVER_TITLE }), _jsx(ColorPicker, { color: borderColor, onChange: (color) => setBorderColor(color) }), _jsx(Button, { variant: "primary", onClick: () => {
                    onChange();
                    onClose();
                }, children: LABEL_APPLY_UNDERLINE })] }));
};
const UnderlineEffect = ({ isActive, onChange, value, textDomain = "jankx", }) => {
    const [isAddingUnderline, setIsAddingUnderline] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState();
    const [borderColor, setBorderColor] = useState("hsl(130 80% 50%)");
    const LABEL_APPLY_UNDERLINE = __("Apply", textDomain) || "Apply";
    const LABEL_POPOVER_TITLE = __("Customize Underline", textDomain) || "Customize Underline";
    const applyUnderlineEffect = useCallback(() => {
        onChange(toggleFormat(value, {
            type: "jankx/underline-effect",
            attributes: {
                style: `--underline-border-color: ${borderColor};`,
                class: "jankx-underline-clip-effect",
            },
        }));
    }, [borderColor, onChange, value]);
    const handleToolbarClick = useCallback(() => {
        if (isActive) {
            onChange(toggleFormat(value, { type: "jankx/underline-effect" }));
        }
        else {
            setIsAddingUnderline(true);
        }
    }, [isActive, onChange, value]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: setPopoverAnchor, children: _jsx(RichTextToolbarButton, { icon: IconUnderlineCurve, title: __("Underline Effect", "jankx"), onClick: handleToolbarClick, isActive: isActive }) }), !isActive && isAddingUnderline && (_jsx(UnderlineEffectUI, { onClose: () => setIsAddingUnderline(false), onChange: applyUnderlineEffect, popoverAnchor: popoverAnchor, borderColor: borderColor, setBorderColor: setBorderColor, LABEL_APPLY_UNDERLINE: LABEL_APPLY_UNDERLINE, LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE }))] }));
};
registerFormatType("jankx/underline-effect", {
    title: __("Underline Curve", "jankx"),
    tagName: "span",
    className: "jankx-underline-clip-effect",
    attributes: {
        style: "style",
        class: "class",
    },
    edit: UnderlineEffect,
});
