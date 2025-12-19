import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { InspectorControls, useBlockProps, InnerBlocks, BlockControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl, ColorPicker, Button, ButtonGroup, __experimentalBoxControl as BoxControl } from '@wordpress/components';
import { layout as icon, settings, fullscreen, desktop } from '@wordpress/icons';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
/**
 * Edit component for Modal block
 */
export default function Edit({ attributes, setAttributes, clientId }) {
    const { modalId, triggerType, triggerText, triggerUrl, triggerTarget, customSelector, modalSize, customWidth, customWidthUnit, closeOnOverlayClick, closeOnEscape, showCloseButton, animationType, animationDuration, backdropColor, backdropBlur, zIndex, disableScroll, disableFocus, awaitOpenAnimation, awaitCloseAnimation } = attributes;
    const [isPreviewMode, setIsPreviewMode] = useState(true); // Default to true so users can edit content
    const [generatedId, setGeneratedId] = useState('');
    // Generate unique ID if not set
    useEffect(() => {
        if (!modalId) {
            const newId = `modal-${clientId}`;
            setGeneratedId(newId);
            setAttributes({ modalId: newId });
        }
        else {
            setGeneratedId(modalId);
        }
    }, [modalId, clientId, setAttributes]);
    const blockProps = useBlockProps({
        className: `wp-block-jankx-modal-wrapper ${isPreviewMode ? 'modal-preview' : ''}`,
        'data-modal-id': generatedId,
        'data-close-on-overlay-click': closeOnOverlayClick,
        'data-close-on-escape': closeOnEscape,
        'data-animation-type': animationType,
        'data-backdrop-blur': backdropBlur,
        style: modalSize === 'custom' ? {
            '--modal-custom-width': `${customWidth}${customWidthUnit}`
        } : {}
    });
    const innerBlocksProps = useInnerBlocksProps({
        className: 'wp-block-jankx-modal__inner'
    }, {
        // Accept ALL blocks - no restrictions
        template: [
            ['core/heading', { level: 3, placeholder: __('Modal Title', 'jankx') }],
            ['core/paragraph', { placeholder: __('Add your modal content here...', 'jankx') }]
        ],
        templateLock: false
    });
    const renderTrigger = () => {
        switch (triggerType) {
            case 'button':
                return (_jsx("button", { type: "button", className: "wp-block-jankx-modal__trigger", onClick: () => setIsPreviewMode(!isPreviewMode), children: triggerText || __('Open Modal', 'jankx') }));
            case 'anchor':
                return (_jsx("a", { href: triggerUrl || '#', className: "wp-block-jankx-modal__trigger", target: triggerTarget, onClick: (e) => {
                        e.preventDefault();
                        setIsPreviewMode(!isPreviewMode);
                    }, children: triggerText || __('Open Modal', 'jankx') }));
            case 'custom':
                return (_jsx("div", { className: "wp-block-jankx-modal__custom-trigger", children: customSelector || __('Custom Selector', 'jankx') }));
            default:
                return null;
        }
    };
    // Removed preview modal - just show content directly in editor
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsx(ToolbarGroup, { children: _jsx(ToolbarButton, { icon: isPreviewMode ? fullscreen : desktop, label: isPreviewMode ? __('Hide Preview', 'jankx') : __('Show Preview', 'jankx'), onClick: () => setIsPreviewMode(!isPreviewMode) }) }) }), _jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Trigger Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Trigger Type', 'jankx'), value: triggerType, options: [
                                    { label: __('Button', 'jankx'), value: 'button' },
                                    { label: __('Link', 'jankx'), value: 'anchor' },
                                    { label: __('Custom Selector', 'jankx'), value: 'custom' }
                                ], onChange: (value) => setAttributes({ triggerType: value }) }), triggerType === 'button' && (_jsx(TextControl, { label: __('Button Text', 'jankx'), value: triggerText, onChange: (value) => setAttributes({ triggerText: value }), placeholder: __('Open Modal', 'jankx') })), triggerType === 'anchor' && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Link Text', 'jankx'), value: triggerText, onChange: (value) => setAttributes({ triggerText: value }), placeholder: __('Open Modal', 'jankx') }), _jsx(TextControl, { label: __('Link URL', 'jankx'), value: triggerUrl, onChange: (value) => setAttributes({ triggerUrl: value }), placeholder: "#" }), _jsx(SelectControl, { label: __('Link Target', 'jankx'), value: triggerTarget, options: [
                                            { label: __('Same Window', 'jankx'), value: '_self' },
                                            { label: __('New Window', 'jankx'), value: '_blank' }
                                        ], onChange: (value) => setAttributes({ triggerTarget: value }) })] })), triggerType === 'custom' && (_jsx(TextControl, { label: __('Custom Selector', 'jankx'), value: customSelector, onChange: (value) => setAttributes({ customSelector: value }), placeholder: ".my-trigger, #my-button", help: __('CSS selector for elements that should trigger the modal', 'jankx') }))] }), _jsxs(PanelBody, { title: __('Modal Settings', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Modal ID', 'jankx'), value: modalId, onChange: (value) => setAttributes({ modalId: value }), help: __('Unique identifier for the modal. Leave empty to auto-generate.', 'jankx') }), _jsx(SelectControl, { label: __('Modal Size', 'jankx'), value: modalSize, options: [
                                    { label: __('Small (400px)', 'jankx'), value: 'small' },
                                    { label: __('Medium (600px)', 'jankx'), value: 'medium' },
                                    { label: __('Large (800px)', 'jankx'), value: 'large' },
                                    { label: __('Fullscreen', 'jankx'), value: 'fullscreen' },
                                    { label: __('Custom Width', 'jankx'), value: 'custom' }
                                ], onChange: (value) => setAttributes({ modalSize: value }) }), modalSize === 'custom' && (_jsx(_Fragment, { children: _jsxs("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-end' }, children: [_jsx("div", { style: { flex: 1 }, children: _jsx(RangeControl, { label: __('Custom Width', 'jankx'), value: customWidth, onChange: (value) => setAttributes({ customWidth: value }), min: 200, max: 1200, step: 10, help: __('Width of the modal content', 'jankx') }) }), _jsx("div", { style: { minWidth: '80px' }, children: _jsx(SelectControl, { label: __('Unit', 'jankx'), value: customWidthUnit, options: [
                                                    { label: 'px', value: 'px' },
                                                    { label: '%', value: '%' },
                                                    { label: 'rem', value: 'rem' },
                                                    { label: 'em', value: 'em' },
                                                    { label: 'vw', value: 'vw' }
                                                ], onChange: (value) => setAttributes({ customWidthUnit: value }) }) })] }) })), _jsx(ToggleControl, { label: __('Close on Overlay Click', 'jankx'), checked: closeOnOverlayClick, onChange: (value) => setAttributes({ closeOnOverlayClick: value }) }), _jsx(ToggleControl, { label: __('Close on Escape Key', 'jankx'), checked: closeOnEscape, onChange: (value) => setAttributes({ closeOnEscape: value }) }), _jsx(ToggleControl, { label: __('Show Close Button', 'jankx'), checked: showCloseButton, onChange: (value) => setAttributes({ showCloseButton: value }) })] }), _jsxs(PanelBody, { title: __('Animation Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Animation Type', 'jankx'), value: animationType, options: [
                                    { label: __('Fade', 'jankx'), value: 'fade' },
                                    { label: __('Slide', 'jankx'), value: 'slide' },
                                    { label: __('Zoom', 'jankx'), value: 'zoom' },
                                    { label: __('None', 'jankx'), value: 'none' }
                                ], onChange: (value) => setAttributes({ animationType: value }) }), _jsx(RangeControl, { label: __('Animation Duration (ms)', 'jankx'), value: animationDuration, onChange: (value) => setAttributes({ animationDuration: value }), min: 100, max: 1000, step: 50 })] }), _jsxs(PanelBody, { title: __('Backdrop Settings', 'jankx'), initialOpen: false, children: [_jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Backdrop Color', 'jankx') }), _jsx(ColorPicker, { color: backdropColor, onChange: (value) => setAttributes({ backdropColor: value }) })] }), _jsx(ToggleControl, { label: __('Backdrop Blur', 'jankx'), checked: backdropBlur, onChange: (value) => setAttributes({ backdropBlur: value }) }), _jsx(RangeControl, { label: __('Z-Index', 'jankx'), value: zIndex, onChange: (value) => setAttributes({ zIndex: value }), min: 1000, max: 99999, step: 100 })] }), _jsxs(PanelBody, { title: __('Advanced Settings', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Disable Scroll', 'jankx'), checked: disableScroll, onChange: (value) => setAttributes({ disableScroll: value }), help: __('Disable page scroll when modal is open', 'jankx') }), _jsx(ToggleControl, { label: __('Disable Auto Focus', 'jankx'), checked: disableFocus, onChange: (value) => setAttributes({ disableFocus: value }), help: __('Disable auto focus on first focusable element', 'jankx') }), _jsx(ToggleControl, { label: __('Await Open Animation', 'jankx'), checked: awaitOpenAnimation, onChange: (value) => setAttributes({ awaitOpenAnimation: value }), help: __('Wait for CSS animation to finish before focusing', 'jankx') }), _jsx(ToggleControl, { label: __('Await Close Animation', 'jankx'), checked: awaitCloseAnimation, onChange: (value) => setAttributes({ awaitCloseAnimation: value }), help: __('Wait for CSS animation before removing from DOM', 'jankx') })] })] }), _jsx("div", { ...blockProps, children: _jsxs("div", { className: "wp-block-jankx-modal__editor-wrapper", children: [_jsxs("div", { className: "wp-block-jankx-modal__trigger-preview", children: [_jsx("div", { className: "wp-block-jankx-modal__label", children: __('🔘 Modal Trigger:', 'jankx') }), renderTrigger(), _jsx("div", { style: { marginTop: '8px', fontSize: '12px', color: '#666' }, children: isPreviewMode
                                        ? __('👁️ Preview mode is ON - Modal content shown below', 'jankx')
                                        : __('👁️ Click toolbar button or trigger to show modal content', 'jankx') })] }), isPreviewMode && (_jsxs("div", { className: "wp-block-jankx-modal__editor-content", children: [_jsxs("div", { className: "wp-block-jankx-modal__label", children: [__('📄 Modal Content (ID: ', 'jankx'), _jsx("code", { children: generatedId }), "):"] }), _jsxs("div", { className: `wp-block-jankx-modal__content-editor wp-block-jankx-modal__container--${modalSize}`, children: [showCloseButton && (_jsx("div", { className: "wp-block-jankx-modal__close-preview", title: __('Close button will appear here', 'jankx'), children: "\u2715" })), _jsx("div", { ...innerBlocksProps })] })] })), !isPreviewMode && (_jsxs("div", { style: {
                                padding: '20px',
                                margin: '16px 0',
                                border: '2px dashed #ddd',
                                borderRadius: '8px',
                                textAlign: 'center',
                                background: '#f9f9f9'
                            }, children: [_jsx("p", { style: { margin: '0 0 12px 0', fontSize: '14px', color: '#666' }, children: __('📝 Modal content is hidden', 'jankx') }), _jsx("button", { type: "button", className: "components-button is-primary", onClick: () => setIsPreviewMode(true), children: __('Show Modal Content to Edit', 'jankx') })] }))] }) })] }));
}
