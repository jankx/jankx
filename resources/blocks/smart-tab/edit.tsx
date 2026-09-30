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
    CheckboxControl,
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
    IconType,
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
 * Icon blocks that can be inserted as inner blocks to represent a tab icon.
 */
const ICON_BLOCK_NAMES = [
    'jankx/svg-icon',
    'jankx/advanced-image-box',
    'jankx/icon-picker',
];

/**
 * Map icon type to the inner block that carries the icon configuration.
 */
const ICON_TYPE_TO_BLOCK: Record<string, string> = {
    svg: 'jankx/svg-icon',
    image: 'jankx/advanced-image-box',
    picker: 'jankx/icon-picker',
};

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

    const { insertBlocks, replaceInnerBlocks, selectBlock } = useDispatch('core/block-editor');

    // Advanced Filter Trigger State - Declare before useMemo to avoid initialization error
    const [dynamicDataLayoutBlocks, setDynamicDataLayoutBlocks] = useState<Array<{ id: string; clientId: string; postType: string; name: string }>>([]);
    const [selectedTargetBlock, setSelectedTargetBlock] = useState<{ id: string; postType: string } | null>(null);

    const rawTriggerConfig = (window?.JankxSmartTabTriggers?.items ?? {}) as Record<string, SmartTabTriggerConfig>;
    const fallbackTriggers = useMemo<Record<string, SmartTabTriggerConfig>>(
        () => ({
            manual: {
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
            },
            'advanced-filter': {
                key: 'advanced-filter',
                label: __('Advanced Filter', 'jankx'),
                description: __('Trigger advanced filter when tab is clicked. Configure filter using Advanced Filter block inside this tab. Updates dynamic-data-layout blocks with filtered results.', 'jankx'),
                previewTitle: __('Advanced Filter Tab', 'jankx'),
                supports: {
                    customTitle: true,
                    customContent: true,
                    icon: true,
                },
                settingsSchema: [],
            },
            'open-link': {
                key: 'open-link',
                label: __('Open Link', 'jankx'),
                description: __('Open external or internal link when tab is clicked.', 'jankx'),
                previewTitle: __('Link Tab', 'jankx'),
                supports: {
                    customTitle: true,
                    customContent: false,
                    icon: true,
                },
                settingsSchema: [],
            },
        }),
        []
    );

    const triggersMap = useMemo(() => {
        return {
            ...fallbackTriggers,
            ...rawTriggerConfig,
        } as Record<string, SmartTabTriggerConfig>;
    }, [rawTriggerConfig, fallbackTriggers]);

    const triggerOptions = useMemo(
        () => {
            return Object.values(triggersMap).map((config) => ({
                label: config.label,
                value: config.key,
            }));
        },
        [triggersMap]
    );

    const triggerConfig = (triggersMap[trigger] ?? triggersMap.manual ?? fallbackTriggers.manual) as SmartTabTriggerConfig;
    // Override supports for advanced-filter trigger to allow custom content
    const resolvedSupports = trigger === 'advanced-filter' 
        ? { ...triggerConfig.supports, customContent: true }
        : triggerConfig.supports || {};
    const allowCustomTitle = resolvedSupports.customTitle !== false;
    const allowCustomContent = resolvedSupports.customContent !== false;
    const allowCustomIcon = resolvedSupports.icon !== false;
    const previewTitle = useMemo(() => {
        const baseTitle = triggerConfig.previewTitle || triggerConfig.label || (title ? title : __('Tab', 'jankx'));
        
        // Add posts count for advanced filter trigger
        if (trigger === 'advanced-filter' && attributes.postsCount && attributes.postsCount > 0) {
            return `${baseTitle} (${attributes.postsCount}件)`;
        }
        
        return baseTitle;
    }, [triggerConfig, title, trigger, attributes.postsCount]);

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
        className: `smart-tab${isActive ? ' is-active' : ''}${iconType !== 'none' ? ' smart-tab--has-icon' : ''}`,
        'data-trigger': trigger,
        // Chỉ hiển thị tab đang active để tập trung edit
        style: {
            display: isActive ? 'block' : 'none',
        },
    });

    // Determine allowed blocks based on trigger
    const allowedBlocks = useMemo(() => {
        if (trigger === 'advanced-filter') {
            return ['jankx/advanced-filter', ...ICON_BLOCK_NAMES];
        }
        return undefined; // Allow all blocks for other triggers
    }, [trigger]);

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'smart-tab__content',
            style: contentStyles,
        },
        {
            templateLock: trigger === 'advanced-filter' ? 'all' : false,
            allowedBlocks: allowedBlocks,
            // Chỉ tab active và không phải trigger advanced-filter mới có block appender
            renderAppender: (isActive && trigger !== 'advanced-filter') ? undefined : (false as unknown as undefined),
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

    // When the icon type changes on a content-capable tab, keep a single matching
    // icon inner block in sync (insert/remove/replace) instead of storing attributes.
    const handleIconTypeChange = (value: IconType): void => {
        // Locked triggers (e.g. open-link) have no editable inner blocks, so keep
        // the legacy attribute-based icon for them.
        if (!allowCustomContent) {
            setAttributes({ iconType: value });
            return;
        }

        const targetBlockName = ICON_TYPE_TO_BLOCK[value];
        const existingIconBlocks = innerBlocks.filter((inner: Block) =>
            ICON_BLOCK_NAMES.includes(inner.name)
        );
        const contentBlocks = innerBlocks.filter(
            (inner: Block) => !ICON_BLOCK_NAMES.includes(inner.name)
        );

        let nextBlocks: Block[] = contentBlocks;
        if (targetBlockName) {
            const alreadyInserted = existingIconBlocks.some(
                (inner: Block) => inner.name === targetBlockName
            );
            if (!alreadyInserted) {
                nextBlocks = [
                    createBlock(targetBlockName) as unknown as Block,
                    ...contentBlocks,
                ];
            } else {
                nextBlocks = innerBlocks;
            }
        }

        if (nextBlocks !== innerBlocks) {
            replaceInnerBlocks(clientId, nextBlocks, false);
        }

        setAttributes({ iconType: value });
    };

    // Focus the inserted icon block so the user can configure it right away.
    const handleEditIconBlock = (): void => {
        const iconInnerBlock = innerBlocks.find((inner: Block) =>
            ICON_BLOCK_NAMES.includes(inner.name)
        );
        if (iconInnerBlock) {
            selectBlock(iconInnerBlock.clientId);
        }
    };

    // Position/size/color controls that style the icon inside the tabs navigation.
    const renderIconPositionControls = (): JSX.Element => (
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
    );

    // Migrate legacy attribute-based icons into inner icon blocks on load so
    // existing tabs keep working with the new flow.
    useEffect(() => {
        if (!allowCustomContent || iconType === 'none') {
            return;
        }

        const targetBlockName = ICON_TYPE_TO_BLOCK[iconType];
        if (!targetBlockName) {
            return;
        }

        const hasIconBlock = innerBlocks.some((inner: Block) =>
            ICON_BLOCK_NAMES.includes(inner.name)
        );
        if (hasIconBlock) {
            return;
        }

        const seedAttributes: Record<string, unknown> = {};
        if (iconType === 'svg' && icon) {
            seedAttributes.icon = icon;
        } else if (iconType === 'picker' && iconName) {
            seedAttributes.iconName = iconName;
            seedAttributes.iconType = iconSet || 'material';
        }

        insertBlocks(
            [createBlock(targetBlockName, seedAttributes)],
            0,
            clientId,
            false
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowCustomContent, iconType, innerBlocks, icon, iconName, iconSet]);

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

    // Fetch posts count for advanced filter trigger
    useEffect(() => {
        if (!(trigger === 'advanced-filter' && selectedTargetBlock)) {
            return;
        }
        
        // Only fetch if we have a valid advanced filter block
        const advancedFilterBlock = innerBlocks.find((block: any) => block.name === 'jankx/advanced-filter');
        if (!advancedFilterBlock) {
            setAttributes({ postsCount: 0 });
            return;
        }

        // Check if nonce is available
        const nonce = window.jankxDynamicSsrTemplate?.postsCountNonce;
        if (!nonce) {
            console.warn('Posts count nonce not available');
            setAttributes({ postsCount: 0 });
            return;
        }

        // Debounce to prevent multiple rapid requests
        const timeoutId = setTimeout(() => {
            const fetchPostsCount = async () => {
                try {
                    const filterAttrs = advancedFilterBlock.attributes as Record<string, unknown>;
                    const filterType = filterAttrs.filterType as string;
                    
                    // Build filter settings object based on filter type
                    const filterSettings: Record<string, any> = {};
                    
                    switch (filterType) {
                        case 'taxonomy':
                            if (filterAttrs.taxonomy && filterAttrs.terms) {
                                filterSettings.taxonomy = filterAttrs.taxonomy;
                                filterSettings.terms = filterAttrs.terms;
                            }
                            break;
                        case 'author':
                            if (filterAttrs.authors) {
                                filterSettings.authors = filterAttrs.authors;
                            }
                            break;
                        case 'keyword':
                            if (filterAttrs.keyword) {
                                filterSettings.keyword = filterAttrs.keyword;
                            }
                            break;
                        case 'price':
                            if (filterAttrs.minPrice || filterAttrs.maxPrice) {
                                filterSettings.minPrice = filterAttrs.minPrice;
                                filterSettings.maxPrice = filterAttrs.maxPrice;
                            }
                            break;
                        case 'date':
                            if (filterAttrs.dateFrom || filterAttrs.dateTo) {
                                filterSettings.dateFrom = filterAttrs.dateFrom;
                                filterSettings.dateTo = filterAttrs.dateTo;
                            }
                            break;
                    }

                    // Make AJAX request to get posts count using WP_Query
                    const formData = new FormData();
                    formData.append('action', 'jankx_posts_count');
                    formData.append('nonce', nonce);
                    formData.append('postType', selectedTargetBlock.postType);
                    formData.append('filterType', filterType);
                    formData.append('filterSettings', JSON.stringify(filterSettings));

                    const response = await fetch('/wp-admin/admin-ajax.php', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const result = await response.json();
                    
                    if (result.success) {
                        setAttributes({ postsCount: result.data.count });
                    } else {
                        console.error('Error fetching posts count:', result.data?.message || 'Unknown error');
                        setAttributes({ postsCount: 0 });
                    }
                } catch (error) {
                    console.error('Error fetching posts count:', error);
                    setAttributes({ postsCount: 0 });
                }
            };

            fetchPostsCount();
        }, 500); // 500ms debounce

        // Cleanup timeout on unmount or dependencies change
        return () => clearTimeout(timeoutId);
    }, [trigger, selectedTargetBlock, innerBlocks]);

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
                        const attrs = (block.attributes || {}) as Record<string, unknown>;
                        if (
                            block.name === 'jankx/dynamic-data-layout' ||
                            block.name === 'jankx/dynamic-ssr-layout' ||
                            block.name === 'jankx/advanced-filters'
                        ) {
                            const queryId = attrs.customQueryId || attrs.queryId || block.clientId;
                            const postType = (attrs.postType as string) || 'post';
                            found.push({
                                id: String(queryId || block.clientId),
                                clientId: block.clientId,
                                postType: postType,
                                name: `${postType} Layout`,
                            });
                        } else if (block.name === 'jankx/dynamic-term-layout') {
                            const queryId = attrs.customQueryId || attrs.queryId || block.clientId;
                            const taxonomy = (attrs.taxonomy as string) || 'category';
                            found.push({
                                id: String(queryId || block.clientId),
                                clientId: block.clientId,
                                postType: taxonomy,
                                name: `${taxonomy} Terms`,
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
                const freshBlock = wpData.select('core/block-editor').getBlock(clientId);
                const freshAttrs = (freshBlock?.attributes || {}) as Record<string, unknown>;
                if (freshAttrs.trigger === 'advanced-filter') {
                    const currentSettings = (freshAttrs.triggerSettings || {}) as Record<string, unknown>;
                    const savedBlockIds = (currentSettings.targetBlockIds as string[] | undefined) ||
                        (currentSettings.targetBlockId ? [currentSettings.targetBlockId as string] : []);
                    const targetId = savedBlockIds[0];
                    if (targetId) {
                        const block = layoutBlocks.find((b) => b.id === targetId) ||
                            layoutBlocks.find((b) => b.clientId === targetId);
                        if (block) {
                            setSelectedTargetBlock({ id: block.id, postType: block.postType });
                            const healedIds = savedBlockIds.map((id) => {
                                const match = layoutBlocks.find((b) => b.id === id) ||
                                    layoutBlocks.find((b) => b.clientId === id);
                                return match ? match.id : id;
                            });
                            const healedSettings = {
                                ...currentSettings,
                                targetBlockIds: healedIds,
                                targetBlockId: healedIds[0] || '',
                                targetBlockPostType: block.postType,
                            };
                            const needsHeal = healedIds.some((id, i) => id !== savedBlockIds[i]) ||
                                currentSettings.targetBlockId !== healedSettings.targetBlockId ||
                                currentSettings.targetBlockPostType !== block.postType;
                            if (needsHeal) {
                                setAttributes({ triggerSettings: healedSettings });
                            }
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
        const targetableNames = [
            'jankx/dynamic-data-layout',
            'jankx/dynamic-ssr-layout',
            'jankx/advanced-filters',
            'jankx/dynamic-term-layout',
        ];
        const getLayoutSignature = (): string => {
            const parts: string[] = [];
            const walk = (blocks: Block[]): void => {
                blocks.forEach((block) => {
                    if (targetableNames.includes(block.name)) {
                        const attrs = (block.attributes || {}) as Record<string, unknown>;
                        parts.push(`${block.name}:${String(attrs.customQueryId || attrs.queryId || '')}:${block.clientId}`);
                    }
                    if (block.innerBlocks && block.innerBlocks.length > 0) {
                        walk(block.innerBlocks);
                    }
                });
            };
            walk(wpData.select('core/block-editor').getBlocks() || []);
            return parts.join('|');
        };
        let lastSignature = getLayoutSignature();
        const unsubscribe = wpData.subscribe(() => {
            const signature = getLayoutSignature();

            if (signature === lastSignature) {
                return;
            }

            lastSignature = signature;

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
    }, [trigger]);

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
                                    {__('No Dynamic Data Layout or Dynamic Term Layout blocks found on this page. Add one first.', 'jankx')}
                                </p>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '8px' }}>
                                        <strong>{__('Target Blocks', 'jankx')}</strong>
                                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#666' }}>
                                            {__('Select one or more layout blocks to filter. All selected blocks are filtered when this tab is clicked.', 'jankx')}
                                        </p>
                                    </div>
                                    {dynamicDataLayoutBlocks.map((block) => {
                                        const savedIds = ((triggerSettings as Record<string, unknown>)?.targetBlockIds as string[]) ||
                                            ((triggerSettings as Record<string, unknown>)?.targetBlockId ? [(triggerSettings as Record<string, unknown>)?.targetBlockId as string] : []);
                                        const checked = savedIds.includes(block.id);
                                        return (
                                            <CheckboxControl
                                                key={block.id}
                                                label={`${block.name} (${block.postType})`}
                                                checked={checked}
                                                onChange={(isChecked: boolean) => {
                                                    const savedIds = ((triggerSettings as Record<string, unknown>)?.targetBlockIds as string[]) ||
                                                        ((triggerSettings as Record<string, unknown>)?.targetBlockId ? [(triggerSettings as Record<string, unknown>)?.targetBlockId as string] : []);
                                                    const isKnownId = (id: string) =>
                                                        dynamicDataLayoutBlocks.some((b) => b.id === id || b.clientId === id);
                                                    const baseIds = dynamicDataLayoutBlocks.length > 0 ? savedIds.filter(isKnownId) : savedIds;
                                                    const newIds = isChecked
                                                        ? [...baseIds, block.id]
                                                        : baseIds.filter((id) => id !== block.id && id !== block.clientId);
                                                    setSelectedTargetBlock(
                                                        newIds.length > 0
                                                            ? { id: newIds[0], postType: dynamicDataLayoutBlocks.find((b) => b.id === newIds[0])?.postType || '' }
                                                            : null
                                                    );
                                                    setAttributes({
                                                        triggerSettings: {
                                                            ...triggerSettings,
                                                            targetBlockIds: newIds,
                                                            targetBlockId: newIds[0] || '',
                                                            targetBlockPostType: newIds.length > 0
                                                                ? dynamicDataLayoutBlocks.find((b) => b.id === newIds[0])?.postType || ''
                                                                : '',
                                                        },
                                                    });
                                                }}
                                            />
                                        );
                                    })}

                                    {selectedTargetBlock && (
                                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }}>
                                            <p style={{ margin: 0, fontSize: '12px' }}>
                                                <strong>{selectedTargetBlock.postType}</strong>
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

                    {/* Open Link Trigger Settings */}
                    {trigger === 'open-link' && (
                        <PanelBody title={__('Open Link Settings', 'jankx')} initialOpen={true}>
                            <TextControl
                                label={__('URL', 'jankx')}
                                value={(triggerSettings as Record<string, unknown>)?.url as string || ''}
                                onChange={(value: string) =>
                                    setAttributes({
                                        triggerSettings: {
                                            ...triggerSettings,
                                            url: value,
                                        },
                                    })
                                }
                                placeholder="https://example.com"
                                help={__('Enter the destination URL', 'jankx')}
                            />
                            <SelectControl
                                label={__('Open In', 'jankx')}
                                value={(triggerSettings as Record<string, unknown>)?.target as '_self' | '_blank' || '_self'}
                                options={[
                                    { label: __('Same Tab', 'jankx'), value: '_self' },
                                    { label: __('New Tab', 'jankx'), value: '_blank' },
                                ]}
                                onChange={(value: string) =>
                                    setAttributes({
                                        triggerSettings: {
                                            ...triggerSettings,
                                            target: value,
                                        },
                                    })
                                }
                            />
                            <TextControl
                                label={__('Rel', 'jankx')}
                                value={(triggerSettings as Record<string, unknown>)?.rel as string || ''}
                                onChange={(value: string) =>
                                    setAttributes({
                                        triggerSettings: {
                                            ...triggerSettings,
                                            rel: value,
                                        },
                                    })
                                }
                                placeholder="noopener noreferrer"
                                help={__('Optional rel attribute (e.g. noopener, noreferrer, nofollow)', 'jankx')}
                            />
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
                            { label: __('SVG Icon', 'jankx'), value: 'svg' },
                            { label: __('Image', 'jankx'), value: 'image' },
                            { label: __('Icon Picker', 'jankx'), value: 'picker' },
                        ]}
                        onChange={(value: string) => handleIconTypeChange(value as IconType)}
                        help={
                            allowCustomContent
                                ? __('An icon block is inserted at the top of this tab. Configure the icon inside that block and set its position below.', 'jankx')
                                : undefined
                        }
                    />

                    {allowCustomContent ? (
                        iconType !== 'none' && (
                            <>
                                <div style={{ margin: '8px 0 12px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                        {__('Configure the icon inside the block at the top of this tab.', 'jankx')}
                                    </p>
                                    <Button
                                        variant="secondary"
                                        onClick={handleEditIconBlock}
                                    >
                                        {__('Edit Icon Block', 'jankx')}
                                    </Button>
                                </div>
                                {renderIconPositionControls()}
                            </>
                        )
                    ) : (
                        iconType !== 'none' && (
                            <>
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

                                {renderIconPositionControls()}
                            </>
                        )
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
