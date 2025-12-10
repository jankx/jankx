/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    // @ts-ignore - Experimental API may not be in types
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
    // @ts-ignore - Experimental API may not be in types
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    withColors,
} from '@wordpress/block-editor';
import { BlockControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    Button,
    Dropdown,
    MenuGroup,
    MenuItem,
    ColorPicker,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo, useState, useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { code, brush } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { 
    SmartTabProps, 
    SmartTabTriggerConfig,
    AdvancedFilterBlock,
    AdvancedFilter,
    Term,
    Author,
} from './types';

interface Block {
    name: string;
    clientId: string;
    attributes?: Record<string, unknown>;
    innerBlocks?: Block[];
}
import IconPicker from '../../shared/components/IconPicker';
import {
    CustomInserterModal,
    IconDropZone,
    IconPlaceholder,
    InserterModal,
} from '../svg-icon/components';
import {
    flattenIconsArray,
    parseIcon,
    parseUploadedMediaAndSetIcon,
} from '../svg-icon/utils';
import getIcons from '../svg-icon/icons';

/**
 * Edit component for Smart Tab block
 */
export default function Edit({ attributes, setAttributes, clientId, context }: SmartTabProps): JSX.Element {
    const {
        title,
        trigger = 'manual',
        triggerSettings = {},
        iconType,
        icon,
        iconName,
        iconSet,
        iconPosition,
        iconSize,
        iconColor,
        normalTabTextColor,
        normalTabBackgroundColor,
        normalTabGradient,
        activeTabTextColor,
        activeTabBackgroundColor,
        activeTabGradient,
        contentTextColor,
        contentBackgroundColor,
        contentGradient,
    } = attributes;

    const activeTabIndex = context?.['jankx/activeTab'] ?? 0;

    // Get inner blocks to check if advanced-filter already exists
    const innerBlocks = useSelect(
        (select: any) => {
            const block = select('core/block-editor').getBlock(clientId);
            return block?.innerBlocks || [];
        },
        [clientId]
    );

    const { insertBlocks } = useDispatch('core/block-editor');

    // Advanced Filter Trigger State - Declare before useMemo to avoid initialization error
    const [dynamicDataLayoutBlocks, setDynamicDataLayoutBlocks] = useState<Array<{ id: string; clientId: string; postType: string; name: string }>>([]);
    const [selectedTargetBlock, setSelectedTargetBlock] = useState<{ id: string; postType: string } | null>(null);

    const rawTriggerConfig = (window?.JankxSmartTabTriggers?.items ?? {}) as Record<string, SmartTabTriggerConfig>;
    const fallbackTrigger: SmartTabTriggerConfig = useMemo(
        () => ({
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
        }),
        []
    );

    const triggersMap = useMemo(() => {
        if (Object.keys(rawTriggerConfig).length === 0) {
            return { manual: fallbackTrigger } as Record<string, SmartTabTriggerConfig>;
        }

        return {
            manual: fallbackTrigger,
            ...rawTriggerConfig,
        } as Record<string, SmartTabTriggerConfig>;
    }, [rawTriggerConfig, fallbackTrigger]);

    const triggerOptions = useMemo(
        () => {
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
        },
        [triggersMap, dynamicDataLayoutBlocks.length, trigger]
    );

    const triggerConfig = (triggersMap[trigger] ?? triggersMap.manual ?? fallbackTrigger) as SmartTabTriggerConfig;
    // Override supports for advanced-filter trigger to allow custom content
    const resolvedSupports = trigger === 'advanced-filter' 
        ? { ...triggerConfig.supports, customContent: true }
        : triggerConfig.supports || {};
    const allowCustomTitle = resolvedSupports.customTitle !== false;
    const allowCustomContent = resolvedSupports.customContent !== false;
    const allowCustomIcon = resolvedSupports.icon !== false;
    const previewTitle =
        triggerConfig.previewTitle || triggerConfig.label || (title ? title : __('Tab', 'jankx'));

    // Color and gradient settings
    const colorGradientSettings = useMultipleOriginColorsAndGradients() || {};

    const { blockIndex } = useSelect(
        (select: (store: string) => { getBlockIndex: (clientId: string) => number }) => {
            const editorSelect = select('core/block-editor');
            return {
                blockIndex: editorSelect.getBlockIndex(clientId),
            };
        },
        [clientId]
    );

    const isActive = blockIndex === activeTabIndex;

    // Build content styles
    const contentStyles: React.CSSProperties = {};
    if (contentTextColor) {
        contentStyles.color = contentTextColor;
    }
    if (contentGradient) {
        contentStyles.background = contentGradient;
    } else if (contentBackgroundColor) {
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

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'smart-tab__content',
            style: contentStyles,
        },
        {
            templateLock: false,
            allowedBlocks: allowedBlocks,
            // Chỉ tab active mới có block appender
            renderAppender: isActive ? undefined : (false as unknown as undefined),
        }
    );

    // Handle icon selection from picker
    const handleIconSelect = (selectedIcon: { name: string; category?: string; iconSet?: string }): void => {
        if (selectedIcon && selectedIcon.name) {
            setAttributes({
                iconName: selectedIcon.name,
                iconSet: selectedIcon.iconSet || iconSet,
                iconType: 'picker',
            });
        }
    };

    // Parse and set SVG icon
    const handleCustomSvg = (svgContent: string): void => {
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

    const handleTriggerChange = (value: string): void => {
        const newTriggerKey = triggersMap[value] ? value : 'manual';
        const config = (triggersMap[newTriggerKey] ?? triggersMap.manual ?? fallbackTrigger) as SmartTabTriggerConfig;

        const updatedAttributes: Partial<SmartTabProps['attributes']> = {
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
            const hasAdvancedFilterBlock = innerBlocks.some((block: any) => block.name === 'jankx/advanced-filter');
            if (!hasAdvancedFilterBlock) {
                const defaultAttributes = {
                    filterType: 'taxonomy',
                    enabled: true,
                };
                insertBlocks(createBlock('jankx/advanced-filter', defaultAttributes as any), undefined, clientId);
            }
        }

        setAttributes(updatedAttributes);
    };

    // Find dynamic-data-layout blocks on the page (always check for availability)
    useEffect(() => {
        const findDynamicDataLayoutBlocks = (): void => {
            try {
                const wpData = window.wp?.data;
                if (!wpData) {
                    setDynamicDataLayoutBlocks([]);
                    return;
                }
                const currentBlocks = wpData.select('core/block-editor').getBlocks() as Block[];
                if (!currentBlocks || currentBlocks.length === 0) {
                    setDynamicDataLayoutBlocks([]);
                    return;
                }

                const findBlocks = (blocks: Block[]): Array<{ id: string; clientId: string; postType: string; name: string }> => {
                    const found: Array<{ id: string; clientId: string; postType: string; name: string }> = [];
                    
                    blocks.forEach((block: Block) => {
                        if (block.name === 'jankx/dynamic-data-layout') {
                            const attrs = (block.attributes || {}) as Record<string, unknown>;
                            const queryId = attrs.queryId || block.clientId;
                            const postType = (attrs.postType as string) || 'post';
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
                    const savedBlockId = (triggerSettings as Record<string, unknown>)?.targetBlockId as string | undefined;
                    if (savedBlockId) {
                        const block = layoutBlocks.find((b) => b.id === savedBlockId);
                        if (block) {
                            setSelectedTargetBlock({ id: block.id, postType: block.postType });
                        }
                    }
                }
            } catch (error) {
                console.error('Error finding dynamic-data-layout blocks:', error);
                setDynamicDataLayoutBlocks([]);
            }
        };

        findDynamicDataLayoutBlocks();

        // Subscribe to block changes
        let timeoutId: NodeJS.Timeout | null = null;
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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tab Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Trigger', 'jankx')}
                        value={trigger}
                        options={triggerOptions}
                        onChange={handleTriggerChange}
                        help={triggerConfig?.description || __('Select behaviour for this tab.', 'jankx')}
                    />

                    <TextControl
                        label={__('Tab Title', 'jankx')}
                        value={allowCustomTitle ? title : previewTitle}
                        onChange={(value: string) => {
                            if (!allowCustomTitle) {
                                return;
                            }
                            setAttributes({ title: value });
                        }}
                        placeholder={__('Enter tab title', 'jankx')}
                        disabled={!allowCustomTitle}
                        help={
                            allowCustomTitle
                                ? undefined
                                : __('Title is managed by the selected trigger.', 'jankx')
                        }
                    />

                    {/* Advanced Filter Trigger Settings */}
                    {trigger === 'advanced-filter' && (
                        <PanelBody title={__('Filter Settings', 'jankx')} initialOpen={true}>
                            {dynamicDataLayoutBlocks.length === 0 ? (
                                <p style={{ color: '#d63638' }}>
                                    {__('No Dynamic Data Layout blocks found on this page. Add a Dynamic Data Layout block first.', 'jankx')}
                                </p>
                            ) : (
                                <>
                                    <SelectControl
                                        label={__('Target Block', 'jankx')}
                                        value={(triggerSettings as Record<string, unknown>)?.targetBlockId as string || ''}
                                        options={[
                                            { label: __('-- Select Block --', 'jankx'), value: '' },
                                            ...dynamicDataLayoutBlocks.map((block) => ({
                                                label: `${block.name} (${block.postType})`,
                                                value: block.id,
                                            })),
                                        ]}
                                        onChange={(value: string) => {
                                            const block = dynamicDataLayoutBlocks.find((b) => b.id === value);
                                            setSelectedTargetBlock(block ? { id: block.id, postType: block.postType } : null);
                                            setAttributes({
                                                triggerSettings: {
                                                    ...triggerSettings,
                                                    targetBlockId: value,
                                                },
                                            });
                                        }}
                                        help={__('Select the Dynamic Data Layout block to filter', 'jankx')}
                                    />

                                    {selectedTargetBlock && (
                                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }}>
                                            <p style={{ margin: 0, fontSize: '12px' }}>
                                                <strong>{__('Post Type:', 'jankx')}</strong> {selectedTargetBlock.postType}
                                            </p>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                                                {__('Configure the filter using the Advanced Filter block below.', 'jankx')}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </PanelBody>
                    )}
                </PanelBody>

                {allowCustomIcon && (
                <PanelBody title={__('Tab Icon', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Icon Type', 'jankx')}
                        value={iconType}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('SVG Code', 'jankx'), value: 'svg' },
                            { label: __('Icon Picker', 'jankx'), value: 'picker' },
                        ]}
                        onChange={(value: string) => setAttributes({ iconType: value as 'none' | 'svg' | 'picker' })}
                    />

                    {iconType === 'svg' && (
                        <>
                            <InserterModal
                                isInserterOpen={false}
                                setInserterOpen={() => {}}
                                onSelect={(selectedIcon: { icon?: string }) => {
                                    if (selectedIcon?.icon) {
                                        handleCustomSvg(selectedIcon.icon);
                                    }
                                }}
                                icons={allIcons}
                            />
                            <TextControl
                                label={__('SVG Code', 'jankx')}
                                value={icon}
                                onChange={handleCustomSvg}
                                placeholder={__('Paste SVG code here', 'jankx')}
                                help={__('Paste your SVG code', 'jankx')}
                            />
                        </>
                    )}

                    {iconType === 'picker' && (
                        <div className="smart-tab-icon-picker">
                            <IconPicker
                                value={iconName ? ({ name: iconName, iconSet: iconSet } as { name: string; iconSet?: string }) : null}
                                onChange={handleIconSelect}
                                iconType={iconSet}
                            />
                        </div>
                    )}

                    {iconType !== 'none' && icon && (
                        <>
                            <SelectControl
                                label={__('Icon Position', 'jankx')}
                                value={iconPosition}
                                options={[
                                    { label: __('Before', 'jankx'), value: 'before' },
                                    { label: __('After', 'jankx'), value: 'after' },
                                ]}
                                onChange={(value: string) =>
                                    setAttributes({ iconPosition: value as 'before' | 'after' })
                                }
                            />

                            <UnitControl
                                label={__('Icon Size', 'jankx')}
                                value={iconSize}
                                onChange={(value: string | undefined) =>
                                    setAttributes({ iconSize: value || '16px' })
                                }
                            />

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Icon Color', 'jankx')}
                                </label>
                                <Dropdown
                                    renderToggle={({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
                                        <Button
                                            icon={brush as unknown as React.ComponentType<{}>}
                                            onClick={onToggle}
                                            aria-expanded={isOpen}
                                            variant="secondary"
                                        >
                                            {__('Choose Color', 'jankx')}
                                        </Button>
                                    )}
                                    renderContent={() => (
                                        <ColorPicker
                                            color={iconColor}
                                            onChange={(value: string) => setAttributes({ iconColor: value })}
                                            enableAlpha
                                            defaultValue="#000000"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}
                </PanelBody>
                )}
            </InspectorControls>

            <div {...blockProps}>
                {allowCustomContent ? (
                    <div {...innerBlocksProps} />
                ) : (
                    <div className="smart-tab__content smart-tab__content--locked">
                        <p>
                            {triggerConfig?.description ||
                                __('Content is generated by the selected trigger.', 'jankx')}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

