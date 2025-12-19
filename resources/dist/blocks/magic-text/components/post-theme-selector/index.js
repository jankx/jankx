import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from "@wordpress/i18n";
import { ListAvailableThemes } from "./options";
import { useState, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { ToggleControl } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";
import './themes';
const textDomain = "jankx";
const LABEL_SETTING_PANEL_TITLE = __("Display Mode", textDomain);
const ThemeDocumentSettingsPanel = () => {
    const { savedTheme } = useSelect((select) => ({
        savedTheme: select("core/editor").getEditedPostAttribute("meta")?.dro_magic_text_theme_meta
    }));
    const [enableThemeSelector, setEnableThemeSelector] = useState(() => savedTheme !== undefined && savedTheme !== "default");
    const { editPost } = useDispatch("core/editor");
    useEffect(() => {
        const applyThemeClasses = () => {
            const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
            const iframe = iframeWrapper?.querySelector('iframe');
            const iframeBody = iframe?.contentDocument?.body;
            const editorContainer = document.querySelector('.editor-styles-wrapper');
            const elementsToStyle = [iframeBody, editorContainer].filter(Boolean);
            elementsToStyle.forEach(element => {
                // console.debug('1', element);
                element.classList.remove(...ListAvailableThemes.map(theme => `magic-theme-${theme.value}`));
                element.classList.remove(...ListAvailableThemes.map(theme => `theme-${theme.value}`));
            });
            if (enableThemeSelector && savedTheme && savedTheme !== "default") {
                // alert(`theme-${savedTheme}`);
                elementsToStyle.forEach(element => {
                    // console.debug('2', element);
                    element.classList.add(`magic-theme-${savedTheme}`);
                    element.classList.add(`theme-${savedTheme}`);
                });
            }
            else {
                // alert('none')
            }
        };
        setTimeout(() => applyThemeClasses(), 100);
        // applyThemeClasses();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
                if (iframeWrapper) {
                    const iframe = iframeWrapper.querySelector('iframe');
                    if (iframe && iframe.contentDocument) {
                        applyThemeClasses();
                    }
                }
            });
        });
        const editorArea = document.querySelector('.block-editor-iframe__scale-container')?.parentNode;
        if (editorArea) {
            observer.observe(editorArea, {
                childList: true,
                subtree: true
            });
        }
        return () => {
            observer.disconnect();
        };
    }, [savedTheme, enableThemeSelector]);
    return (_jsx(PluginDocumentSettingPanel, { name: "magic-text-display-mode", title: LABEL_SETTING_PANEL_TITLE, className: "jankx-post-theme-selector-panel", initialOpen: true, children: _jsxs("div", { className: "jankx-post-theme-selector-panel__content", children: [_jsx(ToggleControl, { label: __("Enable Theme Selector", textDomain), checked: enableThemeSelector, onChange: (checked) => {
                        setEnableThemeSelector(checked);
                        editPost({
                            meta: {
                                dro_magic_text_theme_meta: checked
                                    ? savedTheme || ListAvailableThemes[0].value
                                    : "default"
                            }
                        });
                    } }), (enableThemeSelector || savedTheme) && (_jsxs("div", { className: "theme-selector-wrapper", children: [_jsx("label", { htmlFor: "magic-text-display-mode", children: __("Display Mode", textDomain) }), _jsx("select", { id: "magic-text-display-mode", value: savedTheme || "default", onChange: (e) => {
                                editPost({
                                    meta: { dro_magic_text_theme_meta: e.target.value }
                                });
                            }, children: ListAvailableThemes.map((theme) => (_jsx("option", { value: theme.value, children: __(theme.name, textDomain) }, theme.value))) })] }))] }) }));
};
registerPlugin("jankx-post-theme-selector", {
    render: ThemeDocumentSettingsPanel,
    icon: "star-half",
});
