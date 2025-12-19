import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ColorPicker, RangeControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
// Animation skin options
const ANIMATION_SKIN_OPTIONS = [
    { label: __('Hamburger to X', 'jankx'), value: 'hamburger-to-x' },
    { label: __('Hamburger Expand', 'jankx'), value: 'hamburger-expand' },
    { label: __('Hamburger Arrow', 'jankx'), value: 'hamburger-arrow' },
    { label: __('Hamburger Spin', 'jankx'), value: 'hamburger-spin' },
    { label: __('Simple (No Animation)', 'jankx'), value: 'simple' }
];
// Display options
const DISPLAY_OPTIONS = [
    { label: __('All Devices', 'jankx'), value: 'all' },
    { label: __('Desktop Only', 'jankx'), value: 'desktop' },
    { label: __('Tablet & Below', 'jankx'), value: 'tablet-down' },
    { label: __('Mobile Only', 'jankx'), value: 'mobile' },
    { label: __('Tablet Only', 'jankx'), value: 'tablet' }
];
// Bar length options
const BAR_LENGTH_OPTIONS = [
    { label: __('Equal Length', 'jankx'), value: 'equal' },
    { label: __('Long-Short-Long', 'jankx'), value: 'long-short-long' },
    { label: __('Progressive', 'jankx'), value: 'progressive' }
];
function OffcanvasTriggerEdit({ attributes, setAttributes }) {
    const { targetSidebarId, animationSkin, barColor, barThickness, barWidth, barSpacing, barLengths, displayOn, className } = attributes;
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const blockProps = useBlockProps({
        className: `offcanvas-trigger-block display-${displayOn} ${className || ''} editor-always-visible`
    });
    // Handle click in editor - toggle active state for preview
    const handleClick = (e) => {
        e.preventDefault();
        setIsActive(!isActive);
        // Use native DOM instead of jQuery for better performance
        const target = e.currentTarget;
        const container = target.closest('.is-root-container');
        if (container) {
            container.classList.toggle('sidebar-open');
        }
    };
    // Render hamburger bars
    const renderHamburger = () => {
        // Calculate bar widths based on barLengths setting
        const getBarWidth = (barType) => {
            switch (barLengths) {
                case 'long-short-long':
                    return barType === 'middle' ? barWidth * 0.6 : barWidth;
                case 'progressive':
                    return barType === 'top' ? barWidth :
                        barType === 'middle' ? barWidth * 0.8 : barWidth * 0.6;
                default: // equal
                    return barWidth;
            }
        };
        const topBarStyle = {
            backgroundColor: barColor,
            height: `${barThickness}px`,
            width: `${getBarWidth('top')}px`
        };
        const middleBarStyle = {
            backgroundColor: barColor,
            height: `${barThickness}px`,
            width: `${getBarWidth('middle')}px`
        };
        const bottomBarStyle = {
            backgroundColor: barColor,
            height: `${barThickness}px`,
            width: `${getBarWidth('bottom')}px`
        };
        const containerStyle = {
            '--bar-spacing': `${barSpacing}px`,
            '--bar-thickness': `${barThickness}px`,
            '--bar-width': `${barWidth}px`,
            '--bar-color': barColor
        };
        return (_jsxs("div", { className: `hamburger-container skin-${animationSkin} lengths-${barLengths} ${isActive ? 'active' : ''}`, style: containerStyle, children: [_jsx("span", { className: "bar bar-top", style: topBarStyle }), _jsx("span", { className: "bar bar-middle", style: middleBarStyle }), _jsx("span", { className: "bar bar-bottom", style: bottomBarStyle })] }));
    };
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Animation Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Animation Skin', 'jankx'), value: animationSkin, options: ANIMATION_SKIN_OPTIONS, onChange: (value) => setAttributes({ animationSkin: value }), help: __('Choose the animation style for the hamburger menu toggle.', 'jankx') }), _jsx(TextControl, { label: __('Target Sidebar ID', 'jankx'), value: targetSidebarId, onChange: (value) => setAttributes({ targetSidebarId: value }), help: __('Enter the ID of the offcanvas sidebar to trigger. Leave empty to trigger the first sidebar found.', 'jankx') }), _jsx(SelectControl, { label: __('Bar Lengths', 'jankx'), value: barLengths, options: BAR_LENGTH_OPTIONS, onChange: (value) => setAttributes({ barLengths: value }), help: __('Choose the length pattern for hamburger bars.', 'jankx') })] }), _jsxs(PanelBody, { title: __('Appearance', 'jankx'), initialOpen: false, children: [_jsxs("div", { className: "color-control", children: [_jsx("label", { children: __('Bar Color', 'jankx') }), _jsx(Button, { variant: "secondary", onClick: () => setIsColorPickerOpen(!isColorPickerOpen), style: {
                                            backgroundColor: barColor,
                                            color: '#fff',
                                            width: '100%',
                                            justifyContent: 'center',
                                            marginTop: '8px'
                                        }, children: barColor }), isColorPickerOpen && (_jsx("div", { className: "color-picker-popup", style: { marginTop: '8px' }, children: _jsx(ColorPicker, { color: barColor, onChange: (color) => setAttributes({ barColor: color }) }) }))] }), _jsx(RangeControl, { label: __('Bar Thickness (px)', 'jankx'), value: barThickness, onChange: (value) => {
                                    if (value !== undefined) {
                                        setAttributes({ barThickness: value });
                                    }
                                }, min: 1, max: 10, step: 1 }), _jsx(RangeControl, { label: __('Bar Width (px)', 'jankx'), value: barWidth, onChange: (value) => {
                                    if (value !== undefined) {
                                        setAttributes({ barWidth: value });
                                    }
                                }, min: 20, max: 60, step: 1 }), _jsx(RangeControl, { label: __('Bar Spacing (px)', 'jankx'), value: barSpacing, onChange: (value) => {
                                    if (value !== undefined) {
                                        setAttributes({ barSpacing: value });
                                    }
                                }, min: 3, max: 15, step: 1, help: __('Distance between the bars.', 'jankx') })] }), _jsx(PanelBody, { title: __('Display Settings', 'jankx'), initialOpen: false, children: _jsx(SelectControl, { label: __('Display On', 'jankx'), value: displayOn, options: DISPLAY_OPTIONS, onChange: (value) => setAttributes({ displayOn: value }), help: __('Control which devices this trigger button appears on. Note: The trigger is always visible in the editor for easy editing.', 'jankx') }) })] }), _jsx("div", { ...blockProps, children: _jsx("button", { className: "offcanvas-trigger hamburger-trigger", onClick: handleClick, "data-target-sidebar": targetSidebarId, "aria-label": __('Toggle menu', 'jankx'), children: renderHamburger() }) })] }));
}
function OffcanvasTriggerSave() {
    return null; // Dynamic block
}
// Register block - metadata loaded from block.json
registerBlockType('jankx/offcanvas-trigger', {
    edit: OffcanvasTriggerEdit,
    save: OffcanvasTriggerSave,
});
