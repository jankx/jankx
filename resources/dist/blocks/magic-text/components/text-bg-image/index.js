import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./style.scss";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useMemo } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton, MediaUpload, MediaUploadCheck, } from "@wordpress/block-editor";
import { Popover, Button, FontSizePicker } from "@wordpress/components";
import IconBgImage from "./icon-text-bg-image";
const textDomain = "jankx";
const LABEL_POPOVER_TITLE = __("Custmze the Text background image", textDomain) ||
    "Text Bg ImagCustmze the Text background image";
const LABEL_TOOLBAR_TITLE = __("Text bg image", textDomain) || "Text Bg Image";
const LABEL_BUTTON_APPLY = __("Apply", textDomain) || "Apply";
const TextBgImageUI = ({ onClose, onChange, setImageUrl, popoverAnchor, fontSize, setFontSize, }) => {
    const ALLOWED_MEDIA_TYPES = ["image"];
    const LABEL_OPEN_MEDIA = __("Open Media Library", textDomain) || "Open Media Library";
    const fontSizes = [
        {
            name: __("Small"),
            slug: "small",
            size: 12,
        },
        {
            name: __("Big"),
            slug: "big",
            size: 26,
        },
    ];
    const fallbackFontSize = 16;
    return (_jsx(Popover, { anchor: popoverAnchor, className: "jankx-popover", children: _jsxs("div", { style: { minWidth: "320px", padding: "16px" }, children: [_jsx("h4", { style: { marginBottom: "12px" }, children: LABEL_POPOVER_TITLE }), _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { allowedTypes: ALLOWED_MEDIA_TYPES, onSelect: (media) => setImageUrl(media.url), render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, style: { marginBottom: "12px", width: "100%" }, children: LABEL_OPEN_MEDIA })) }) }), _jsx(FontSizePicker, { __next40pxDefaultSize: true, fallbackFontSize: fallbackFontSize, fontSizes: fontSizes, value: fontSize, onChange: (newFontSize) => setFontSize(newFontSize) }), _jsx(Button, { variant: "primary", onClick: () => {
                        onChange();
                        onClose();
                    }, style: { width: "100%" }, children: LABEL_BUTTON_APPLY })] }) }));
};
const TextBgImage = ({ value, onChange, isActive }) => {
    const [isAddingTxtBg, setIsAddingTxtBg] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState();
    const [imageUrl, setImageUrl] = useState("");
    const [fontSize, setFontSize] = useState("20");
    const applyTxtBg = useCallback(() => {
        onChange(toggleFormat(value, {
            type: "jankx/text-bg-image",
            attributes: {
                style: `--text-bg-image: url('${imageUrl}'); --text-size: ${fontSize}`,
                class: "jankx-bg-image",
            },
        }));
    }, [onChange, value, imageUrl, fontSize]);
    const handleToolbarClick = useCallback(() => {
        if (isActive) {
            onChange(toggleFormat(value, { type: "jankx/text-bg-image" }));
        }
        else {
            setIsAddingTxtBg(true);
        }
    }, [isActive, onChange, value]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: setPopoverAnchor, children: _jsx(RichTextToolbarButton, { icon: IconBgImage, title: LABEL_TOOLBAR_TITLE, onClick: handleToolbarClick, isActive: isActive }) }), !isActive && isAddingTxtBg && (_jsx(TextBgImageUI, { onClose: () => setIsAddingTxtBg(false), onChange: applyTxtBg, setImageUrl: setImageUrl, popoverAnchor: popoverAnchor, fontSize: fontSize, setFontSize: setFontSize }))] }));
};
registerFormatType("jankx/text-bg-image", {
    title: __("Text bg", "jankx"),
    tagName: "span",
    className: 'jankx-bg-image',
    attributes: {
        style: "style",
    },
    edit: TextBgImage,
});
