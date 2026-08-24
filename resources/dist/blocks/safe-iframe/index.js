import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, RangeControl, CheckboxControl, BaseControl, Notice, } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
const SANDBOX_OPTIONS = [
    { label: __('Allow Scripts', 'jankx'), value: 'allow-scripts' },
    { label: __('Allow Same Origin', 'jankx'), value: 'allow-same-origin' },
    { label: __('Allow Forms', 'jankx'), value: 'allow-forms' },
    { label: __('Allow Popups', 'jankx'), value: 'allow-popups' },
    { label: __('Allow Pointer Lock', 'jankx'), value: 'allow-pointer-lock' },
    { label: __('Allow Top Navigation', 'jankx'), value: 'allow-top-navigation' },
    { label: __('Allow Modals', 'jankx'), value: 'allow-modals' },
];
const ASPECT_RATIO_PRESETS = [
    { label: __('Custom', 'jankx'), value: '' },
    { label: __('16:9 (Video)', 'jankx'), value: '16/9' },
    { label: __('4:3 (Classic)', 'jankx'), value: '4/3' },
    { label: __('21:9 (Ultrawide)', 'jankx'), value: '21/9' },
    { label: __('1:1 (Square)', 'jankx'), value: '1/1' },
    { label: __('9:16 (Vertical)', 'jankx'), value: '9/16' },
];
function Edit({ attributes, setAttributes }) {
    const { url = '', title = 'Embedded Content', width = '100%', height = '500px', aspectRatio = '', useAspectRatio = false, allowFullscreen = true, loading = 'lazy', sandbox = ['allow-scripts', 'allow-same-origin'], allow = '', borderRadius = 0, showBorder = false, borderWidth = 1, borderColor = '#ddd', showShadow = false, customCSS = '', } = attributes;
    const [isValidUrl, setIsValidUrl] = useState(true);
    useEffect(() => {
        if (url) {
            try {
                new URL(url);
                setIsValidUrl(true);
            }
            catch {
                setIsValidUrl(false);
            }
        }
        else {
            setIsValidUrl(true);
        }
    }, [url]);
    const iframeStyles = {
        width: useAspectRatio ? '100%' : width,
        height: useAspectRatio ? '100%' : height,
        border: showBorder ? `${borderWidth}px solid ${borderColor}` : 'none',
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        boxShadow: showShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : undefined,
    };
    const containerStyles = useAspectRatio && aspectRatio
        ? {
            position: 'relative',
            width: '100%',
            paddingBottom: `calc(100% / (${aspectRatio}))`,
        }
        : {};
    const iframeContainerStyles = useAspectRatio && aspectRatio
        ? {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        }
        : {};
    const blockProps = useBlockProps({
        className: 'safe-iframe-block',
    });
    const sandboxValue = Array.isArray(sandbox) ? sandbox.join(' ') : '';
    const allowValue = allow || undefined;
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Iframe Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('URL', 'jankx'), value: url, onChange: (value) => setAttributes({ url: value }), help: __('Enter the URL to embed', 'jankx'), placeholder: "https://example.com" }), !isValidUrl && (_jsx(Notice, { status: "error", isDismissible: false, children: __('Please enter a valid URL', 'jankx') })), _jsx(TextControl, { label: __('Title', 'jankx'), value: title, onChange: (value) => setAttributes({ title: value }), help: __('Accessibility title for screen readers', 'jankx') })] }), _jsxs(PanelBody, { title: __('Dimensions', 'jankx'), initialOpen: true, children: [_jsx(ToggleControl, { label: __('Use Aspect Ratio', 'jankx'), checked: useAspectRatio, onChange: (value) => setAttributes({ useAspectRatio: value }), help: __('Maintain aspect ratio for responsive design', 'jankx') }), useAspectRatio ? (_jsx(SelectControl, { label: __('Aspect Ratio', 'jankx'), value: aspectRatio, options: ASPECT_RATIO_PRESETS, onChange: (value) => setAttributes({ aspectRatio: value }) })) : (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Width', 'jankx'), value: width, onChange: (value) => setAttributes({ width: value }), help: __('e.g., 100%, 800px, 50vw', 'jankx') }), _jsx(TextControl, { label: __('Height', 'jankx'), value: height, onChange: (value) => setAttributes({ height: value }), help: __('e.g., 500px, 100vh', 'jankx') })] }))] }), _jsxs(PanelBody, { title: __('Security Settings', 'jankx'), initialOpen: false, children: [_jsx(BaseControl, { label: __('Sandbox Permissions', 'jankx'), help: __('Control what the iframe can do', 'jankx'), children: _jsx("div", { style: { marginTop: '8px' }, children: SANDBOX_OPTIONS.map((option) => (_jsx(CheckboxControl, { label: option.label, checked: sandbox.includes(option.value), onChange: (checked) => {
                                            const newSandbox = checked
                                                ? [...sandbox, option.value]
                                                : sandbox.filter((v) => v !== option.value);
                                            setAttributes({ sandbox: newSandbox });
                                        } }, option.value))) }) }), _jsx(TextControl, { label: __('Allow Permissions', 'jankx'), value: allow, onChange: (value) => setAttributes({ allow: value }), help: __('e.g., camera; microphone; geolocation', 'jankx'), placeholder: "camera; microphone" })] }), _jsxs(PanelBody, { title: __('Display Options', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Allow Fullscreen', 'jankx'), checked: allowFullscreen, onChange: (value) => setAttributes({ allowFullscreen: value }) }), _jsx(SelectControl, { label: __('Loading Strategy', 'jankx'), value: loading, options: [
                                    { label: __('Lazy (Load when visible)', 'jankx'), value: 'lazy' },
                                    { label: __('Eager (Load immediately)', 'jankx'), value: 'eager' },
                                ], onChange: (value) => setAttributes({ loading: value }) })] }), _jsxs(PanelBody, { title: __('Styling', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Border', 'jankx'), checked: showBorder, onChange: (value) => setAttributes({ showBorder: value }) }), showBorder && (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Border Width', 'jankx'), value: borderWidth, onChange: (value) => setAttributes({ borderWidth: value || 1 }), min: 1, max: 10 }), _jsx(BaseControl, { label: __('Border Color', 'jankx'), children: _jsx("input", { type: "color", value: borderColor, onChange: (e) => setAttributes({ borderColor: e.target.value }), style: { width: '100%', height: '40px', cursor: 'pointer' } }) })] })), _jsx(RangeControl, { label: __('Border Radius', 'jankx'), value: borderRadius, onChange: (value) => setAttributes({ borderRadius: value || 0 }), min: 0, max: 50 }), _jsx(ToggleControl, { label: __('Show Shadow', 'jankx'), checked: showShadow, onChange: (value) => setAttributes({ showShadow: value }) }), _jsx(TextControl, { label: __('Custom CSS', 'jankx'), value: customCSS, onChange: (value) => setAttributes({ customCSS: value }), help: __('Additional CSS for the iframe container', 'jankx'), placeholder: ".safe-iframe-block { ... }" })] })] }), _jsxs("div", { ...blockProps, children: [!url ? (_jsxs("div", { className: "safe-iframe-placeholder", children: [_jsx("div", { className: "safe-iframe-placeholder__icon", children: "\uD83D\uDDBC\uFE0F" }), _jsx("p", { className: "safe-iframe-placeholder__text", children: __('Enter an iframe URL in the block settings', 'jankx') })] })) : !isValidUrl ? (_jsxs("div", { className: "safe-iframe-error", children: [_jsx("div", { className: "safe-iframe-error__icon", children: "\u26A0\uFE0F" }), _jsx("p", { className: "safe-iframe-error__text", children: __('Invalid URL. Please check the URL and try again.', 'jankx') })] })) : (_jsx("div", { style: containerStyles, children: _jsx("div", { style: iframeContainerStyles, children: _jsx("iframe", { src: url, title: title, style: iframeStyles, sandbox: sandboxValue || undefined, allow: allowValue, allowFullScreen: allowFullscreen, loading: loading }) }) })), customCSS && (_jsx("style", { dangerouslySetInnerHTML: { __html: customCSS } }))] })] }));
}
function Save() {
    return null; // Dynamic block, rendered via PHP
}
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
