import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, useInnerBlocksProps, BlockControls, } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl, Button, ToolbarGroup, ToolbarButton, } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';
import { useMemo } from '@wordpress/element';
/**
 * Edit component for Smart Tabs block
 */
export default function Edit({ attributes, setAttributes, clientId }) {
    const { tabType, styleType, activeTab, tabAlignment, hideTabsBorderBottom, centerNavigation, hideTabContent = false, label = '', showLabel = false, } = attributes;
    const { innerBlocks, selectedBlockClientId } = useSelect((select) => {
        const blockEditorSelect = select('core/block-editor');
        return {
            innerBlocks: blockEditorSelect.getBlocks(clientId),
            selectedBlockClientId: blockEditorSelect.getSelectedBlockClientId(),
        };
    }, [clientId]);
    const dispatch = useDispatch('core/block-editor');
    const { insertBlock, selectBlock } = dispatch;
    const manualTriggerFallback = useMemo(() => ({
        key: 'manual',
        label: __('Custom Content', 'jankx'),
        description: __('Use manual tab title and content.', 'jankx'),
        previewTitle: __('Tab', 'jankx'),
        supports: {
            customTitle: true,
            customContent: true,
            icon: true,
        },
    }), []);
    const triggersMap = useMemo(() => {
        const items = (window?.JankxSmartTabTriggers?.items ?? {});
        if (Object.keys(items).length === 0) {
            return { manual: manualTriggerFallback };
        }
        return {
            manual: manualTriggerFallback,
            ...items,
        };
    }, [manualTriggerFallback]);
    const tabItems = innerBlocks.map((block) => ({
        clientId: block.clientId,
        title: (() => {
            const triggerKey = block.attributes.trigger || 'manual';
            const triggerConfig = triggersMap[triggerKey] ?? triggersMap.manual;
            const supports = triggerConfig?.supports || {};
            const allowCustomTitle = supports.customTitle !== false;
            const blockTitle = block.attributes.title || '';
            if (allowCustomTitle && blockTitle) {
                return blockTitle;
            }
            return (triggerConfig?.previewTitle ||
                triggerConfig?.label ||
                blockTitle ||
                __('Tab', 'jankx'));
        })(),
        trigger: block.attributes.trigger || 'manual',
        previewTitle: (() => {
            const triggerKey = block.attributes.trigger || 'manual';
            const triggerConfig = triggersMap[triggerKey] ?? triggersMap.manual;
            return triggerConfig?.previewTitle || triggerConfig?.label || '';
        })(),
        icon: block.attributes.icon || '',
        iconType: block.attributes.iconType || '',
        normalTabTextColor: block.attributes.normalTabTextColor || '',
        normalTabBackgroundColor: block.attributes.normalTabBackgroundColor || '',
        normalTabGradient: block.attributes.normalTabGradient || '',
        activeTabTextColor: block.attributes.activeTabTextColor || '',
        activeTabBackgroundColor: block.attributes.activeTabBackgroundColor || '',
        activeTabGradient: block.attributes.activeTabGradient || '',
        contentTextColor: block.attributes.contentTextColor || '',
        contentBackgroundColor: block.attributes.contentBackgroundColor || '',
        contentGradient: block.attributes.contentGradient || '',
    }));
    // Handle tab click in editor
    const handleTabClick = (index, tabClientId) => {
        setAttributes({ activeTab: index });
        selectBlock(tabClientId);
    };
    // Add new tab
    const addNewTab = () => {
        const newTab = createBlock('jankx/smart-tab', {
            title: __('New Tab', 'jankx'),
            trigger: 'manual',
        });
        insertBlock(newTab, innerBlocks.length, clientId, false);
        setAttributes({ activeTab: innerBlocks.length });
    };
    const blockProps = useBlockProps({
        className: `smart-tabs smart-tabs--${tabType} smart-tabs--style-${styleType}${hideTabsBorderBottom ? ' smart-tabs--hide-border-bottom' : ''}${centerNavigation ? ' smart-tabs--center-navigation' : ''}${hideTabContent ? ' smart-tabs--hide-content' : ''}`,
    });
    const innerBlocksProps = useInnerBlocksProps({ className: 'smart-tabs__content' }, {
        allowedBlocks: ['jankx/smart-tab'],
        template: [
            ['jankx/smart-tab', { title: __('Tab 1', 'jankx') }],
            ['jankx/smart-tab', { title: __('Tab 2', 'jankx') }],
        ],
        orientation: 'vertical',
        renderAppender: false,
    });
    // Determine which tab is active
    const currentActiveTab = Math.min(activeTab, tabItems.length - 1);
    return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsxs(ToolbarGroup, { children: [_jsx(ToolbarButton, { icon: "editor-alignleft", title: __('Align Left', 'jankx'), onClick: () => setAttributes({ tabAlignment: 'left' }), isActive: tabAlignment === 'left' }), _jsx(ToolbarButton, { icon: "editor-aligncenter", title: __('Align Center', 'jankx'), onClick: () => setAttributes({ tabAlignment: 'center' }), isActive: tabAlignment === 'center' }), _jsx(ToolbarButton, { icon: "editor-alignright", title: __('Align Right', 'jankx'), onClick: () => setAttributes({ tabAlignment: 'right' }), isActive: tabAlignment === 'right' }), _jsx(ToolbarButton, { icon: "editor-justify", title: __('Justify', 'jankx'), onClick: () => setAttributes({ tabAlignment: 'justify' }), isActive: tabAlignment === 'justify' })] }) }), _jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Tab Settings', 'jankx'), initialOpen: true, children: [_jsx(ToggleControl, { label: __('Hide Tabs Border Bottom', 'jankx'), checked: hideTabsBorderBottom, onChange: (value) => setAttributes({ hideTabsBorderBottom: value }), help: __('Hide the border bottom of tabs navigation', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Center Navigation', 'jankx'), checked: centerNavigation, onChange: (value) => setAttributes({ centerNavigation: value }), help: __('Center the tabs navigation with fit-content width', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(ToggleControl, { label: __('Hide Tab Content', 'jankx'), checked: hideTabContent, onChange: (value) => setAttributes({ hideTabContent: value }), help: __('Ẩn phần nội dung của tab (hữu ích khi tab trigger tự xử lý).', 'jankx'), __nextHasNoMarginBottom: true }), _jsx(SelectControl, { label: __('Tab Type', 'jankx'), value: tabType, options: [
                                    { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                                    { label: __('Vertical', 'jankx'), value: 'vertical' },
                                ], onChange: (value) => setAttributes({ tabType: value }), help: __('Choose the tab layout orientation', 'jankx') }), _jsx(SelectControl, { label: __('Style Type', 'jankx'), value: styleType, options: [
                                    { label: __('Default', 'jankx'), value: 'default' },
                                    { label: __('Minimal', 'jankx'), value: 'minimal' },
                                    { label: __('Modern', 'jankx'), value: 'modern' },
                                    { label: __('Boxed', 'jankx'), value: 'boxed' },
                                    { label: __('Bordered', 'jankx'), value: 'bordered' },
                                ], onChange: (value) => setAttributes({ styleType: value }), help: __('Choose the visual style for tabs', 'jankx') }), _jsx(SelectControl, { label: __('Tab Alignment', 'jankx'), value: tabAlignment, options: [
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Right', 'jankx'), value: 'right' },
                                    { label: __('Justify', 'jankx'), value: 'justify' },
                                ], onChange: (value) => setAttributes({ tabAlignment: value }), help: __('Align tabs horizontally', 'jankx') })] }), _jsxs(PanelBody, { title: __('Label Settings', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Label', 'jankx'), checked: showLabel, onChange: (value) => setAttributes({ showLabel: value }), help: __('Display a label before the tabs navigation', 'jankx'), __nextHasNoMarginBottom: true }), showLabel && (_jsx(TextControl, { label: __('Label Text', 'jankx'), value: label, onChange: (value) => setAttributes({ label: value }), placeholder: __('Enter label text', 'jankx'), help: __('Text to display as label before tabs', 'jankx') }))] })] }), _jsx(BlockControls, { children: _jsx(ToolbarGroup, { children: _jsx(ToolbarButton, { icon: plus, label: __('Add Tab', 'jankx'), onClick: addNewTab }) }) }), _jsxs("div", { ...blockProps, children: [_jsxs("div", { className: "smart-tabs__navigation", children: [showLabel && label && (_jsx("div", { className: "smart-tabs__label", children: label })), _jsxs("div", { className: `smart-tabs__nav-list align-${tabAlignment}`, children: [tabItems.map((tab, index) => {
                                        const isActiveTab = index === currentActiveTab;
                                        return (_jsxs("button", { className: `smart-tabs__nav-item${isActiveTab ? ' is-active' : ''}`, onClick: () => handleTabClick(index, tab.clientId), type: "button", children: [tab.iconType !== 'none' && tab.icon && (_jsx("span", { className: "smart-tabs__nav-icon", dangerouslySetInnerHTML: { __html: tab.icon } })), _jsx("span", { className: "smart-tabs__nav-label", children: tab.title })] }, tab.clientId));
                                    }), _jsx(Button, { className: "smart-tabs__add-tab", icon: plus, label: __('Add Tab', 'jankx'), onClick: addNewTab, variant: "secondary" })] })] }), _jsx("div", { ...innerBlocksProps })] })] }));
}
