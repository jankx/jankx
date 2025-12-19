import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';
// @ts-ignore
import metadata from './block.json';
// Animation effects available
const ANIMATION_EFFECTS = [
    { label: 'Slide In', value: 'slide-in' },
    { label: 'Slide Down', value: 'slide-down' }
];
function OffcanvasSidebarEdit({ attributes, setAttributes }) {
    const { sidebarPosition, animationEffect, sidebarWidth, overlayColor, showOverlay, closeOnOverlayClick, showCloseButton, closeButtonPosition, closeButtonSize, closeButtonStyle, closeButtonColor, className, style } = attributes;
    // Add 'sidebar-open' class to root container in editor to show sidebar
    useEffect(() => {
        const rootContainer = document.querySelector('.is-root-container');
        const hamburgerContainer = document.querySelector('.hamburger-container');
        if (!hamburgerContainer?.classList.contains('active') && rootContainer) {
            rootContainer.classList.add('sidebar-open');
        }
    }, []); // Run once on mount
    const blockProps = useBlockProps({
        className: `offcanvas-sidebar-block ${className || ''}`
    });
    // Extract WordPress generated classes for sidebar
    const sidebarClasses = useMemo(() => {
        const classes = ['offcanvas-sidebar', 'editor-sidebar'];
        // Add WordPress background classes to sidebar
        if (blockProps.className) {
            const blockClasses = blockProps.className.split(' ');
            const backgroundClasses = blockClasses.filter(cls => cls.includes('has-') && (cls.includes('background') ||
                cls.includes('text-color') ||
                cls.includes('link-color')));
            classes.push(...backgroundClasses);
        }
        return classes.join(' ');
    }, [blockProps.className]);
    const innerBlocksProps = useInnerBlocksProps({ className: 'sidebar-content' }, {
        allowedBlocks: [
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/gallery',
            'core/list',
            'core/quote',
            'core/buttons',
            'core/separator',
            'core/spacer',
            'core/social-links',
            'core/navigation',
            'core/search',
            'core/calendar',
            'core/latest-posts',
            'core/latest-comments',
            'core/rss',
            'core/audio',
            'core/video',
            'core/file',
            'core/code',
            'core/html',
            'core/preformatted',
            'core/pullquote',
            'core/table',
            'core/verse',
            'core/media-text',
            'core/columns',
            'core/group',
            'core/cover',
            'core/embed',
            'core/site-logo',
            'jankx/language-switcher',
            'jankx/icon-button',
            'jankx/offcanvas-sidebar'
        ],
        template: [
            ['core/heading', { level: 3, content: __('Sidebar Content', 'jankx') }],
            ['core/paragraph', { content: __('Add your content here using any available blocks.', 'jankx') }]
        ],
        templateLock: false
    });
    // Memoize sidebar style to prevent re-creation on every render
    const sidebarStyle = useMemo(() => {
        const styles = {
            width: sidebarWidth,
        };
        // Add background styles from block supports
        if (style?.color?.background) {
            styles.backgroundColor = style.color.background;
        }
        if (style?.color?.gradient) {
            styles.background = style.color.gradient;
        }
        if (style?.color?.text) {
            styles.color = style.color.text;
        }
        if (style?.background?.backgroundImage) {
            const bgImage = style.background.backgroundImage;
            if (bgImage.url) {
                styles.backgroundImage = `url(${bgImage.url})`;
            }
            if (bgImage.backgroundSize) {
                styles.backgroundSize = bgImage.backgroundSize;
            }
            if (bgImage.backgroundPosition) {
                styles.backgroundPosition = bgImage.backgroundPosition;
            }
            if (bgImage.backgroundRepeat) {
                styles.backgroundRepeat = bgImage.backgroundRepeat;
            }
        }
        return styles;
    }, [sidebarWidth, style]);
    // Render sidebar preview (always visible in editor)
    const renderSidebarPreview = () => {
        return (_jsx("div", { className: `offcanvas-sidebar-preview effect-${animationEffect} position-${sidebarPosition}`, style: { width: sidebarWidth }, children: _jsxs("div", { className: sidebarClasses, style: sidebarStyle, children: [showCloseButton && (_jsx("button", { className: `close-button editor-close-button position-${closeButtonPosition} size-${closeButtonSize} style-${closeButtonStyle}`, type: "button", disabled: true, style: { color: closeButtonColor }, title: __('Close button preview', 'jankx'), children: "\u00D7" })), _jsxs("div", { className: "sidebar-content-wrapper", children: [_jsxs("div", { className: "content-area-indicator", children: [_jsx("span", { className: "dashicons dashicons-edit" }), _jsx("span", { children: __('Edit sidebar content here', 'jankx') })] }), _jsx("div", { ...innerBlocksProps })] })] }) }));
    };
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Layout & Appearance', 'jankx'), initialOpen: true, children: [_jsxs("div", { style: { marginBottom: '16px', padding: '12px', background: '#f0f6fc', borderRadius: '4px', border: '1px solid #c5d9ed' }, children: [_jsxs("p", { style: { margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#0073aa' }, children: ["\uD83D\uDCA1 ", __('Quick Setup', 'jankx')] }), _jsx("p", { style: { margin: '0', fontSize: '11px', color: '#666' }, children: __('Configure how your sidebar appears and behaves on the frontend.', 'jankx') })] }), _jsx(SelectControl, { label: __('Sidebar Position', 'jankx'), value: sidebarPosition, options: [
                                    { label: __('Left Side', 'jankx'), value: 'left' },
                                    { label: __('Right Side', 'jankx'), value: 'right' }
                                ], onChange: (value) => setAttributes({ sidebarPosition: value }), help: __('Choose which side of the screen the sidebar slides in from', 'jankx') }), _jsx(SelectControl, { label: __('Animation Style', 'jankx'), value: animationEffect, options: ANIMATION_EFFECTS, onChange: (value) => setAttributes({ animationEffect: value }), help: __('How the sidebar appears and disappears', 'jankx') }), _jsx(TextControl, { label: __('Sidebar Width', 'jankx'), value: sidebarWidth, onChange: (value) => setAttributes({ sidebarWidth: value }), help: __('Examples: 300px, 25vw, 20rem, 50%', 'jankx'), placeholder: "300px" })] }), _jsxs(PanelBody, { title: __('Background & Colors', 'jankx'), initialOpen: true, children: [_jsx("div", { style: { marginBottom: '12px', padding: '8px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }, children: _jsxs("p", { style: { margin: '0', fontSize: '11px', color: '#856404' }, children: ["\uD83C\uDFA8 ", __('Use the color controls above to set background and text colors', 'jankx')] }) }), _jsxs("div", { className: "color-picker-group", children: [_jsx("label", { children: __('Overlay Background', 'jankx') }), _jsx("input", { type: "color", value: overlayColor, onChange: (e) => setAttributes({ overlayColor: e.target.value }) }), _jsx("small", { style: { display: 'block', marginTop: '4px', color: '#666' }, children: __('Background color when sidebar is open', 'jankx') })] })] }), _jsxs(PanelBody, { title: __('Behavior Settings', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Background Overlay', 'jankx'), checked: showOverlay, onChange: (value) => setAttributes({ showOverlay: value }), help: __('Display a semi-transparent overlay behind the sidebar', 'jankx') }), _jsx(ToggleControl, { label: __('Close When Clicking Overlay', 'jankx'), checked: closeOnOverlayClick, onChange: (value) => setAttributes({ closeOnOverlayClick: value }), help: __('Allow users to close sidebar by clicking the overlay', 'jankx') })] }), _jsxs(PanelBody, { title: __('Close Button', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Close Button', 'jankx'), checked: showCloseButton, onChange: (value) => setAttributes({ showCloseButton: value }), help: __('Display an X button to close the sidebar', 'jankx') }), showCloseButton && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Button Position', 'jankx'), value: closeButtonPosition, options: [
                                            { label: __('Top Right', 'jankx'), value: 'top-right' },
                                            { label: __('Top Left', 'jankx'), value: 'top-left' },
                                            { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                            { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                            { label: __('Center Right', 'jankx'), value: 'center-right' },
                                            { label: __('Center Left', 'jankx'), value: 'center-left' }
                                        ], onChange: (value) => setAttributes({ closeButtonPosition: value }) }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("div", { style: { flex: 1 }, children: _jsx(SelectControl, { label: __('Size', 'jankx'), value: closeButtonSize, options: [
                                                        { label: __('Small', 'jankx'), value: 'small' },
                                                        { label: __('Medium', 'jankx'), value: 'medium' },
                                                        { label: __('Large', 'jankx'), value: 'large' }
                                                    ], onChange: (value) => setAttributes({ closeButtonSize: value }) }) }), _jsx("div", { style: { flex: 1 }, children: _jsx(SelectControl, { label: __('Style', 'jankx'), value: closeButtonStyle, options: [
                                                        { label: __('Circle', 'jankx'), value: 'circle' },
                                                        { label: __('Square', 'jankx'), value: 'square' },
                                                        { label: __('Rounded', 'jankx'), value: 'rounded' },
                                                        { label: __('Minimal', 'jankx'), value: 'minimal' }
                                                    ], onChange: (value) => setAttributes({ closeButtonStyle: value }) }) })] }), _jsxs("div", { className: "color-picker-group", children: [_jsx("label", { children: __('Button Color', 'jankx') }), _jsxs("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' }, children: [_jsx("input", { type: "color", value: closeButtonColor === 'inherit' ? '#ffffff' : closeButtonColor, onChange: (e) => setAttributes({ closeButtonColor: e.target.value }), style: { width: '40px', height: '32px' } }), _jsx("button", { type: "button", className: "button button-small", onClick: () => setAttributes({ closeButtonColor: 'inherit' }), style: { fontSize: '11px' }, children: __('Inherit Text Color', 'jankx') })] })] })] }))] })] }), _jsx("div", { ...blockProps, children: renderSidebarPreview() })] }));
}
function OffcanvasSidebarSave() {
    // Save InnerBlocks content - required for blocks with inner content
    // Style attributes will be passed to render callback via $block object
    return _jsx(InnerBlocks.Content, {});
}
// @ts-ignore
registerBlockType(metadata.name, {
    ...metadata,
    edit: OffcanvasSidebarEdit,
    save: OffcanvasSidebarSave,
});
