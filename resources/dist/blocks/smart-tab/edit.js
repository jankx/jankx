import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, useInnerBlocksProps, 
// @ts-ignore - Experimental API may not be in types
__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, Button, Dropdown, ColorPicker, __experimentalUnitControl as UnitControl, } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { brush } from '@wordpress/icons';
import IconPicker from '../../shared/components/IconPicker';
import { InserterModal, } from '../svg-icon/components';
import { flattenIconsArray, } from '../svg-icon/utils';
import getIcons from '../svg-icon/icons';
/**
 * Edit component for Smart Tab block
 */
export default function Edit({ attributes, setAttributes, clientId, context }) {
    const { title, trigger = 'manual', triggerSettings = {}, iconType, icon, iconName, iconSet, iconPosition, iconSize, iconColor, normalTabTextColor, normalTabBackgroundColor, normalTabGradient, activeTabTextColor, activeTabBackgroundColor, activeTabGradient, contentTextColor, contentBackgroundColor, contentGradient, } = attributes;
    const activeTabIndex = context?.['jankx/activeTab'] ?? 0;
    // Get inner blocks to check if advanced-filter already exists
    const innerBlocks = useSelect((select) => {
        const block = select('core/block-editor').getBlock(clientId);
        return block?.innerBlocks || [];
    }, [clientId]);
    const { insertBlocks } = useDispatch('core/block-editor');
    // Advanced Filter Trigger State - Declare before useMemo to avoid initialization error
    const [dynamicDataLayoutBlocks, setDynamicDataLayoutBlocks] = useState([]);
    const [selectedTargetBlock, setSelectedTargetBlock] = useState(null);
    const rawTriggerConfig = (window?.JankxSmartTabTriggers?.items ?? {});
    const fallbackTrigger = useMemo(() => ({
        key: 'manual',
        label: __('Custom Content', 'jankx'),
        description: __('Use manual tab title and content.', 'jankx'),
        previewTitle: __('Tab', 'jankx'),
        supports: {
            customTitle: true,
            customContent: true,
            icon: true,
        },
        settingsSchema: [],
    }), []);
    const triggersMap = useMemo(() => {
        if (Object.keys(rawTriggerConfig).length === 0) {
            return { manual: fallbackTrigger };
        }
        return {
            manual: fallbackTrigger,
            ...rawTriggerConfig,
        };
    }, [rawTriggerConfig, fallbackTrigger]);
    const triggerOptions = useMemo(() => {
        const options = Object.values(triggersMap).map((config) => ({
            label: config.label,
            value: config.key,
        }));
        // Hide advanced-filter trigger if no dynamic-data-layout blocks are available
        if (trigger === 'advanced-filter' || dynamicDataLayoutBlocks.length > 0) {
            return options;
        }
        // Filter out advanced-filter trigger if no blocks available
        return options.filter((opt) => opt.value !== 'advanced-filter');
    }, [triggersMap, dynamicDataLayoutBlocks.length, trigger]);
    const triggerConfig = (triggersMap[trigger] ?? triggersMap.manual ?? fallbackTrigger);
    // Override supports for advanced-filter trigger to allow custom content
    const resolvedSupports = trigger === 'advanced-filter'
        ? { ...triggerConfig.supports, customContent: true }
        : triggerConfig.supports || {};
    const allowCustomTitle = resolvedSupports.customTitle !== false;
    const allowCustomContent = resolvedSupports.customContent !== false;
    const allowCustomIcon = resolvedSupports.icon !== false;
    const previewTitle = triggerConfig.previewTitle || triggerConfig.label || (title ? title : __('Tab', 'jankx'));
    // Color and gradient settings
    const colorGradientSettings = useMultipleOriginColorsAndGradients() || {};
    const { blockIndex } = useSelect((select) => {
        const editorSelect = select('core/block-editor');
        return {
            blockIndex: editorSelect.getBlockIndex(clientId),
        };
    }, [clientId]);
    const isActive = blockIndex === activeTabIndex;
    // Build content styles
    const contentStyles = {};
    if (contentTextColor) {
        contentStyles.color = contentTextColor;
    }
    if (contentGradient) {
        contentStyles.background = contentGradient;
    }
    else if (contentBackgroundColor) {
        contentStyles.backgroundColor = contentBackgroundColor;
    }
    const blockProps = useBlockProps({
        className: `smart-tab${isActive ? ' is-active' : ''}`,
        'data-trigger': trigger,
        // Chỉ hiển thị tab đang active để tập trung edit
        style: {
            display: isActive ? 'block' : 'none',
        },
    });
    // Determine allowed blocks based on trigger
    const allowedBlocks = useMemo(() => {
        if (trigger === 'advanced-filter') {
            return ['jankx/advanced-filter'];
        }
        return undefined; // Allow all blocks for other triggers
    }, [trigger]);
    const innerBlocksProps = useInnerBlocksProps({
        className: 'smart-tab__content',
        style: contentStyles,
    }, {
        templateLock: false,
        allowedBlocks: allowedBlocks,
        // Chỉ tab active mới có block appender
        renderAppender: isActive ? undefined : false,
    });
    // Handle icon selection from picker
    const handleIconSelect = (selectedIcon) => {
        if (selectedIcon && selectedIcon.name) {
            setAttributes({
                iconName: selectedIcon.name,
                iconSet: selectedIcon.iconSet || iconSet,
                iconType: 'picker',
            });
        }
    };
    // Parse and set SVG icon
    const handleCustomSvg = (svgContent) => {
        // parseIcon returns React element, but we need to store as string
        // So we just store the original SVG content
        if (svgContent && svgContent.trim()) {
            setAttributes({
                icon: svgContent,
                iconType: 'svg',
            });
        }
    };
    const allIcons = flattenIconsArray(getIcons());
    const handleTriggerChange = (value) => {
        const newTriggerKey = triggersMap[value] ? value : 'manual';
        const config = (triggersMap[newTriggerKey] ?? triggersMap.manual ?? fallbackTrigger);
        const updatedAttributes = {
            trigger: newTriggerKey,
            triggerSettings: {},
        };
        if (config?.supports?.customTitle === false) {
            updatedAttributes.title = '';
        }
        if (config?.supports?.icon === false) {
            updatedAttributes.iconType = 'none';
            updatedAttributes.icon = '';
            updatedAttributes.iconName = '';
        }
        // If switching to advanced-filter trigger, automatically add advanced-filter inner block
        if (newTriggerKey === 'advanced-filter') {
            const hasAdvancedFilterBlock = innerBlocks.some((block) => block.name === 'jankx/advanced-filter');
            if (!hasAdvancedFilterBlock) {
                const defaultAttributes = {
                    filterType: 'taxonomy',
                    enabled: true,
                };
                insertBlocks(createBlock('jankx/advanced-filter', defaultAttributes), undefined, clientId);
            }
        }
        setAttributes(updatedAttributes);
    };
    // Find dynamic-data-layout blocks on the page (always check for availability)
    useEffect(() => {
        const findDynamicDataLayoutBlocks = () => {
            try {
                const wpData = window.wp?.data;
                if (!wpData) {
                    setDynamicDataLayoutBlocks([]);
                    return;
                }
                const currentBlocks = wpData.select('core/block-editor').getBlocks();
                if (!currentBlocks || currentBlocks.length === 0) {
                    setDynamicDataLayoutBlocks([]);
                    return;
                }
                const findBlocks = (blocks) => {
                    const found = [];
                    blocks.forEach((block) => {
                        if (block.name === 'jankx/dynamic-data-layout' || block.name === 'jankx/dynamic-ssr-layout') {
                            const attrs = (block.attributes || {});
                            const queryId = attrs.queryId || block.clientId;
                            const postType = attrs.postType || 'post';
                            found.push({
                                id: String(queryId || block.clientId),
                                clientId: block.clientId,
                                postType: postType,
                                name: `${postType} Layout`,
                            });
                        }
                        if (block.innerBlocks && block.innerBlocks.length > 0) {
                            found.push(...findBlocks(block.innerBlocks));
                        }
                    });
                    return found;
                };
                const layoutBlocks = findBlocks(currentBlocks);
                setDynamicDataLayoutBlocks(layoutBlocks);
                // Restore selected block from triggerSettings (only if trigger is advanced-filter)
                if (trigger === 'advanced-filter') {
                    const savedBlockId = triggerSettings?.targetBlockId;
                    if (savedBlockId) {
                        const block = layoutBlocks.find((b) => b.id === savedBlockId);
                        if (block) {
                            setSelectedTargetBlock({ id: block.id, postType: block.postType });
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error finding dynamic-data-layout blocks:', error);
                setDynamicDataLayoutBlocks([]);
            }
        };
        findDynamicDataLayoutBlocks();
        // Subscribe to block changes
        let timeoutId = null;
        const wpData = window.wp?.data;
        if (!wpData) {
            return;
        }
        const unsubscribe = wpData.subscribe(() => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                findDynamicDataLayoutBlocks();
            }, 300);
        });
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [trigger, triggerSettings]);
    // Update trigger config to allow custom content when advanced-filter trigger is selected
    const resolvedTriggerConfig = useMemo(() => {
        if (trigger === 'advanced-filter') {
            return {
                ...triggerConfig,
                supports: {
                    ...triggerConfig.supports,
                    customContent: true, // Allow inner blocks for advanced-filter
                },
            };
        }
        return triggerConfig;
    }, [trigger, triggerConfig]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Tab Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Trigger', 'jankx'), value: trigger, options: triggerOptions, onChange: handleTriggerChange, help: triggerConfig?.description || __('Select behaviour for this tab.', 'jankx') }), _jsx(TextControl, { label: __('Tab Title', 'jankx'), value: allowCustomTitle ? title : previewTitle, onChange: (value) => {
                                    if (!allowCustomTitle) {
                                        return;
                                    }
                                    setAttributes({ title: value });
                                }, placeholder: __('Enter tab title', 'jankx'), disabled: !allowCustomTitle, help: allowCustomTitle
                                    ? undefined
                                    : __('Title is managed by the selected trigger.', 'jankx') }), trigger === 'advanced-filter' && (_jsx(PanelBody, { title: __('Filter Settings', 'jankx'), initialOpen: true, children: dynamicDataLayoutBlocks.length === 0 ? (_jsx("p", { style: { color: '#d63638' }, children: __('No Dynamic Data Layout blocks found on this page. Add a Dynamic Data Layout block first.', 'jankx') })) : (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Target Block', 'jankx'), value: triggerSettings?.targetBlockId || '', options: [
                                                { label: __('-- Select Block --', 'jankx'), value: '' },
                                                ...dynamicDataLayoutBlocks.map((block) => ({
                                                    label: `${block.name} (${block.postType})`,
                                                    value: block.id,
                                                })),
                                            ], onChange: (value) => {
                                                const block = dynamicDataLayoutBlocks.find((b) => b.id === value);
                                                setSelectedTargetBlock(block ? { id: block.id, postType: block.postType } : null);
                                                setAttributes({
                                                    triggerSettings: {
                                                        ...triggerSettings,
                                                        targetBlockId: value,
                                                    },
                                                });
                                            }, help: __('Select the Dynamic Data Layout block to filter', 'jankx') }), selectedTargetBlock && (_jsxs("div", { style: { marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }, children: [_jsxs("p", { style: { margin: 0, fontSize: '12px' }, children: [_jsx("strong", { children: __('Post Type:', 'jankx') }), " ", selectedTargetBlock.postType] }), _jsx("p", { style: { margin: '5px 0 0 0', fontSize: '12px', color: '#666' }, children: __('Configure the filter using the Advanced Filter block below.', 'jankx') })] }))] })) })), trigger === 'open-link' && (_jsxs(PanelBody, { title: __('Open Link Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('URL', 'jankx'), value: triggerSettings?.url || '', onChange: (value) => setAttributes({
                                            triggerSettings: {
                                                ...triggerSettings,
                                                url: value,
                                            },
                                        }), placeholder: "https://example.com", help: __('Enter the destination URL', 'jankx') }), _jsx(SelectControl, { label: __('Open In', 'jankx'), value: triggerSettings?.target || '_self', options: [
                                            { label: __('Same Tab', 'jankx'), value: '_self' },
                                            { label: __('New Tab', 'jankx'), value: '_blank' },
                                        ], onChange: (value) => setAttributes({
                                            triggerSettings: {
                                                ...triggerSettings,
                                                target: value,
                                            },
                                        }) }), _jsx(TextControl, { label: __('Rel', 'jankx'), value: triggerSettings?.rel || '', onChange: (value) => setAttributes({
                                            triggerSettings: {
                                                ...triggerSettings,
                                                rel: value,
                                            },
                                        }), placeholder: "noopener noreferrer", help: __('Optional rel attribute (e.g. noopener, noreferrer, nofollow)', 'jankx') })] }))] }), allowCustomIcon && (_jsxs(PanelBody, { title: __('Tab Icon', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Icon Type', 'jankx'), value: iconType, options: [
                                    { label: __('None', 'jankx'), value: 'none' },
                                    { label: __('SVG Code', 'jankx'), value: 'svg' },
                                    { label: __('Icon Picker', 'jankx'), value: 'picker' },
                                ], onChange: (value) => setAttributes({ iconType: value }) }), iconType === 'svg' && (_jsxs(_Fragment, { children: [_jsx(InserterModal, { isInserterOpen: false, setInserterOpen: () => { }, onSelect: (selectedIcon) => {
                                            if (selectedIcon?.icon) {
                                                handleCustomSvg(selectedIcon.icon);
                                            }
                                        }, icons: allIcons }), _jsx(TextControl, { label: __('SVG Code', 'jankx'), value: icon, onChange: handleCustomSvg, placeholder: __('Paste SVG code here', 'jankx'), help: __('Paste your SVG code', 'jankx') })] })), iconType === 'picker' && (_jsx("div", { className: "smart-tab-icon-picker", children: _jsx(IconPicker, { value: iconName ? { name: iconName, iconSet: iconSet } : null, onChange: handleIconSelect, iconType: iconSet }) })), iconType !== 'none' && icon && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Icon Position', 'jankx'), value: iconPosition, options: [
                                            { label: __('Before', 'jankx'), value: 'before' },
                                            { label: __('After', 'jankx'), value: 'after' },
                                        ], onChange: (value) => setAttributes({ iconPosition: value }) }), _jsx(UnitControl, { label: __('Icon Size', 'jankx'), value: iconSize, onChange: (value) => setAttributes({ iconSize: value || '16px' }) }), _jsxs("div", { className: "components-base-control", children: [_jsx("label", { className: "components-base-control__label", children: __('Icon Color', 'jankx') }), _jsx(Dropdown, { renderToggle: ({ isOpen, onToggle }) => (_jsx(Button, { icon: brush, onClick: onToggle, "aria-expanded": isOpen, variant: "secondary", children: __('Choose Color', 'jankx') })), renderContent: () => (_jsx(ColorPicker, { color: iconColor, onChange: (value) => setAttributes({ iconColor: value }), enableAlpha: true, defaultValue: "#000000" })) })] })] }))] }))] }), _jsx("div", { ...blockProps, children: allowCustomContent ? (_jsx("div", { ...innerBlocksProps })) : (_jsx("div", { className: "smart-tab__content smart-tab__content--locked", children: _jsx("p", { children: triggerConfig?.description ||
                            __('Content is generated by the selected trigger.', 'jankx') }) })) })] }));
}
