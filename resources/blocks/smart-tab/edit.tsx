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
import { useSelect } from '@wordpress/data';
import { useMemo, useState, useEffect, useRef } from '@wordpress/element';
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

    // Advanced Filter Trigger State - Declare before useMemo to avoid initialization error
    const [advancedFilterBlocks, setAdvancedFilterBlocks] = useState<AdvancedFilterBlock[]>([]);
    const [selectedFilterBlock, setSelectedFilterBlock] = useState<AdvancedFilterBlock | null>(null);
    const [availableFilters, setAvailableFilters] = useState<AdvancedFilter[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<AdvancedFilter | null>(null);
    const [filterTerms, setFilterTerms] = useState<Term[]>([]);
    const [loadingTerms, setLoadingTerms] = useState<boolean>(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loadingAuthors, setLoadingAuthors] = useState<boolean>(false);
    // Cache for loaded terms and authors to avoid unnecessary reloads
    // Use refs to avoid re-renders and dependency issues
    const termsCacheRef = useRef<Record<string, Term[]>>({});
    const authorsCacheRef = useRef<Author[] | null>(null);
    const lastTaxonomyRef = useRef<string>('');
    const lastFilterTypeRef = useRef<string>('');

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

            // Hide advanced-filter trigger if no advanced-filters blocks are available
            if (trigger === 'advanced-filter' || advancedFilterBlocks.length > 0) {
                return options;
            }

            // Filter out advanced-filter trigger if no blocks available
            return options.filter((opt) => opt.value !== 'advanced-filter');
        },
        [triggersMap, advancedFilterBlocks.length, trigger]
    );

    const triggerConfig = (triggersMap[trigger] ?? triggersMap.manual ?? fallbackTrigger) as SmartTabTriggerConfig;
    const triggerSupports = triggerConfig?.supports || {};
    const allowCustomTitle = triggerSupports.customTitle !== false;
    const allowCustomContent = triggerSupports.customContent !== false;
    const allowCustomIcon = triggerSupports.icon !== false;
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

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'smart-tab__content',
            style: contentStyles,
        },
        {
            templateLock: false,
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

        setAttributes(updatedAttributes);
    };

    // Find advanced-filters blocks on the page (always check for availability)
    useEffect(() => {
        const findAdvancedFiltersBlocks = (): void => {
            try {
                const wpData = window.wp?.data;
                if (!wpData) {
                    setAdvancedFilterBlocks([]);
                    return;
                }
                const currentBlocks = wpData.select('core/block-editor').getBlocks() as Block[];
                if (!currentBlocks || currentBlocks.length === 0) {
                    setAdvancedFilterBlocks([]);
                    return;
                }

                const findBlocks = (blocks: Block[]): AdvancedFilterBlock[] => {
                    const found: AdvancedFilterBlock[] = [];
                    
                    blocks.forEach((block: Block) => {
                        if (block.name === 'jankx/advanced-filters') {
                            const blockId = block.clientId;
                            const attrs = (block.attributes || {}) as Record<string, unknown>;
                            found.push({
                                id: blockId,
                                clientId: blockId,
                                attributes: attrs,
                            });
                        }
                        
                        if (block.innerBlocks && block.innerBlocks.length > 0) {
                            found.push(...findBlocks(block.innerBlocks));
                        }
                    });
                    
                    return found;
                };

                const filterBlocks = findBlocks(currentBlocks);
                setAdvancedFilterBlocks(filterBlocks);

                // Restore selected block from triggerSettings (only if trigger is advanced-filter)
                if (trigger === 'advanced-filter') {
                    const savedBlockId = (triggerSettings as Record<string, unknown>)?.filterBlockId as string | undefined;
                    if (savedBlockId) {
                        const block = filterBlocks.find((b: AdvancedFilterBlock) => b.id === savedBlockId);
                        if (block) {
                            setSelectedFilterBlock(block);
                        }
                    }
                }
            } catch (error) {
                console.error('Error finding advanced-filters blocks:', error);
                setAdvancedFilterBlocks([]);
            }
        };

        findAdvancedFiltersBlocks();

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
                findAdvancedFiltersBlocks();
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

    // Load filters from selected block
    useEffect(() => {
        if (trigger !== 'advanced-filter' || !selectedFilterBlock) {
            setAvailableFilters([]);
            return;
        }

        const attrs = selectedFilterBlock.attributes || {};
        const allFilters: AdvancedFilter[] = [];

        // Combine all filter types
        const taxonomyFilters = (attrs.taxonomyFilters as AdvancedFilter[]) || [];
        const metaFilters = (attrs.metaFilters as AdvancedFilter[]) || [];
        const priceFilters = (attrs.priceFilters as AdvancedFilter[]) || [];
        const dateFilters = (attrs.dateFilters as AdvancedFilter[]) || [];
        const authorFilters = (attrs.authorFilters as AdvancedFilter[]) || [];
        const keywordFilter = (attrs.keywordFilter as { enabled?: boolean; placeholder?: string; label?: string }) || {};

        taxonomyFilters.forEach((filter: AdvancedFilter, index: number) => {
            if (filter.enabled !== false) {
                allFilters.push({
                    ...filter,
                    filterType: 'taxonomy',
                    filterIndex: index,
                    filterId: `taxonomy_${index}_${filter.taxonomy || ''}`,
                    label: filter.label || filter.taxonomy || `Taxonomy Filter ${index + 1}`,
                });
            }
        });

        metaFilters.forEach((filter: AdvancedFilter, index: number) => {
            if (filter.enabled !== false) {
                allFilters.push({
                    ...filter,
                    filterType: 'meta',
                    filterIndex: index,
                    filterId: `meta_${index}_${filter.metaKey || ''}`,
                    label: filter.label || filter.metaKey || `Meta Filter ${index + 1}`,
                });
            }
        });

        priceFilters.forEach((filter: AdvancedFilter, index: number) => {
            if (filter.enabled !== false) {
                allFilters.push({
                    ...filter,
                    filterType: 'price',
                    filterIndex: index,
                    filterId: `price_${index}`,
                    label: filter.label || __('Price Filter', 'jankx'),
                });
            }
        });

        dateFilters.forEach((filter: AdvancedFilter, index: number) => {
            if (filter.enabled !== false) {
                allFilters.push({
                    ...filter,
                    filterType: 'date',
                    filterIndex: index,
                    filterId: `date_${index}`,
                    label: filter.label || __('Date Filter', 'jankx'),
                });
            }
        });

        authorFilters.forEach((filter: AdvancedFilter, index: number) => {
            if (filter.enabled !== false) {
                allFilters.push({
                    ...filter,
                    filterType: 'author',
                    filterIndex: index,
                    filterId: `author_${index}`,
                    label: filter.label || __('Author Filter', 'jankx'),
                });
            }
        });

        if (keywordFilter.enabled) {
            allFilters.push({
                ...keywordFilter,
                filterType: 'keyword',
                filterIndex: 0,
                filterId: 'keyword_0',
                label: keywordFilter.label || __('Keyword Search', 'jankx'),
            });
        }

        setAvailableFilters(allFilters);

        // Restore selected filter from triggerSettings
        const savedFilterId = (triggerSettings as Record<string, unknown>)?.filterId as string | undefined;
        if (savedFilterId) {
            const filter = allFilters.find((f: AdvancedFilter) => f.filterId === savedFilterId);
            if (filter) {
                setSelectedFilter(filter);
            }
        }
    }, [trigger, selectedFilterBlock, triggerSettings]);

    // Load terms for taxonomy filter
    // Only reload when taxonomy actually changes, not when selectedFilter object reference changes
    useEffect(() => {
        if (trigger !== 'advanced-filter' || !selectedFilter || selectedFilter.filterType !== 'taxonomy') {
            setFilterTerms([]);
            lastFilterTypeRef.current = '';
            lastTaxonomyRef.current = '';
            return;
        }

        const taxonomy = selectedFilter.taxonomy || '';
        const filterType = selectedFilter.filterType || '';
        
        if (!taxonomy) {
            setFilterTerms([]);
            lastTaxonomyRef.current = '';
            return;
        }

        // Only reload if taxonomy actually changed
        if (lastTaxonomyRef.current === taxonomy && lastFilterTypeRef.current === filterType) {
            // Taxonomy hasn't changed, use cached terms if available
            if (termsCacheRef.current[taxonomy] && termsCacheRef.current[taxonomy].length > 0) {
                setFilterTerms(termsCacheRef.current[taxonomy]);
                return;
            }
        }

        // Taxonomy changed or not in cache, need to load
        lastTaxonomyRef.current = taxonomy;
        lastFilterTypeRef.current = filterType;
        
        // Check cache first - if terms for this taxonomy are already loaded, use them
        if (termsCacheRef.current[taxonomy] && termsCacheRef.current[taxonomy].length > 0) {
            setFilterTerms(termsCacheRef.current[taxonomy]);
            return;
        }

        // Not in cache, need to load
        setLoadingTerms(true);
        
        const wpApiFetch = window.wp?.apiFetch;
        if (!wpApiFetch) {
            setLoadingTerms(false);
            return;
        }
        
        wpApiFetch({
            path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
        })
            .then((terms: unknown) => {
                const termsArray = (terms as Term[]) || [];
                setFilterTerms(termsArray);
                // Cache the loaded terms
                termsCacheRef.current[taxonomy] = termsArray;
            })
            .catch((error: Error) => {
                console.error('Error loading terms:', error);
                setFilterTerms([]);
            })
            .finally(() => {
                setLoadingTerms(false);
            });
    }, [trigger, selectedFilter?.filterType, selectedFilter?.taxonomy]);

    // Load authors for author filter
    // Only reload when filter type changes to author, use cache otherwise
    useEffect(() => {
        if (trigger !== 'advanced-filter' || !selectedFilter || selectedFilter.filterType !== 'author') {
            setAuthors([]);
            lastFilterTypeRef.current = '';
            return;
        }

        const filterType = selectedFilter.filterType || '';
        
        // Only reload if filter type actually changed to author
        if (lastFilterTypeRef.current === filterType && authorsCacheRef.current && authorsCacheRef.current.length > 0) {
            // Filter type hasn't changed, use cached authors
            setAuthors(authorsCacheRef.current);
            return;
        }

        // Filter type changed or not in cache, need to load
        lastFilterTypeRef.current = filterType;

        // Check cache first - if authors are already loaded, use them
        if (authorsCacheRef.current && authorsCacheRef.current.length > 0) {
            setAuthors(authorsCacheRef.current);
            return;
        }

        // Only load if not in cache
        setLoadingAuthors(true);
        
        const wpApiFetch = window.wp?.apiFetch;
        if (!wpApiFetch) {
            setLoadingAuthors(false);
            return;
        }
        
        wpApiFetch({
            path: '/wp/v2/users?per_page=100&orderby=name&order=asc',
        })
            .then((users: unknown) => {
                const usersArray = (users as Author[]) || [];
                setAuthors(usersArray);
                // Cache the loaded authors
                authorsCacheRef.current = usersArray;
            })
            .catch((error: Error) => {
                console.error('Error loading authors:', error);
                setAuthors([]);
            })
            .finally(() => {
                setLoadingAuthors(false);
            });
    }, [trigger, selectedFilter?.filterType]);

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
                            {advancedFilterBlocks.length === 0 ? (
                                <p style={{ color: '#d63638' }}>
                                    {__('No advanced-filters blocks found on this page. Add an advanced-filters block first.', 'jankx')}
                                </p>
                            ) : (
                                <>
                                    <SelectControl
                                        label={__('Filter Block', 'jankx')}
                                        value={(triggerSettings as Record<string, unknown>)?.filterBlockId as string || ''}
                                        options={[
                                            { label: __('-- Select Block --', 'jankx'), value: '' },
                                            ...advancedFilterBlocks.map((block: AdvancedFilterBlock) => ({
                                                label: `Advanced Filters Block (${block.id.substring(0, 8)}...)`,
                                                value: block.id,
                                            })),
                                        ]}
                                        onChange={(value: string) => {
                                            const block = advancedFilterBlocks.find((b: AdvancedFilterBlock) => b.id === value);
                                            setSelectedFilterBlock(block || null);
                                            setAttributes({
                                                triggerSettings: {
                                                    ...triggerSettings,
                                                    filterBlockId: value,
                                                    filterId: '',
                                                    filterValue: '',
                                                },
                                            });
                                        }}
                                        help={__('Select the advanced-filters block to use', 'jankx')}
                                    />

                                    {selectedFilterBlock && (
                                        <>
                                            <SelectControl
                                                label={__('Filter', 'jankx')}
                                                value={(triggerSettings as Record<string, unknown>)?.filterId as string || ''}
                                                options={[
                                                    { label: __('-- Select Filter --', 'jankx'), value: '' },
                                                    ...availableFilters.map((filter: AdvancedFilter) => ({
                                                        label: filter.label || filter.filterId,
                                                        value: filter.filterId,
                                                    })),
                                                ]}
                                                onChange={(value: string) => {
                                                    const filter = availableFilters.find((f: AdvancedFilter) => f.filterId === value);
                                                    setSelectedFilter(filter || null);
                                                    setAttributes({
                                                        triggerSettings: {
                                                            ...triggerSettings,
                                                            filterId: value,
                                                            filterValue: '',
                                                        },
                                                    });
                                                }}
                                                help={__('Select the filter to apply', 'jankx')}
                                            />

                                            {selectedFilter && (
                                                <div style={{ marginTop: '15px' }}>
                                                    {selectedFilter.filterType === 'taxonomy' && (
                                                        <>
                                                            <SelectControl
                                                                label={__('Filter Value (Term)', 'jankx')}
                                                                value={(triggerSettings as Record<string, unknown>)?.filterValue as string || ''}
                                                                options={[
                                                                    { label: __('-- Select Term --', 'jankx'), value: '' },
                                                                    ...filterTerms.map((term: Term) => ({
                                                                        label: term.name + (term.count ? ` (${term.count})` : ''),
                                                                        value: String(term.id),
                                                                    })),
                                                                ]}
                                                                onChange={(value: string) => {
                                                                    setAttributes({
                                                                        triggerSettings: {
                                                                            ...triggerSettings,
                                                                            filterValue: value,
                                                                        },
                                                                    });
                                                                }}
                                                                disabled={loadingTerms}
                                                                help={loadingTerms ? __('Loading terms...', 'jankx') : __('Select a term to filter by', 'jankx')}
                                                            />
                                                        </>
                                                    )}

                                                    {selectedFilter.filterType === 'meta' && (
                                                        <TextControl
                                                            label={__('Filter Value', 'jankx')}
                                                            value={(triggerSettings as Record<string, unknown>)?.filterValue as string || ''}
                                                            onChange={(value: string) => {
                                                                setAttributes({
                                                                    triggerSettings: {
                                                                        ...triggerSettings,
                                                                        filterValue: value,
                                                                    },
                                                                });
                                                            }}
                                                            placeholder={selectedFilter.placeholder || __('Enter value...', 'jankx')}
                                                            help={__('Enter the meta value to filter by', 'jankx')}
                                                        />
                                                    )}

                                                    {selectedFilter.filterType === 'price' && (
                                                        <>
                                                            <TextControl
                                                                label={__('Min Price', 'jankx')}
                                                                type="number"
                                                                value={(triggerSettings as Record<string, unknown>)?.filterValueMin as string || ''}
                                                                onChange={(value: string) => {
                                                                    setAttributes({
                                                                        triggerSettings: {
                                                                            ...triggerSettings,
                                                                            filterValueMin: value,
                                                                        },
                                                                    });
                                                                }}
                                                                placeholder={selectedFilter.minPrice || __('Min', 'jankx')}
                                                            />
                                                            <TextControl
                                                                label={__('Max Price', 'jankx')}
                                                                type="number"
                                                                value={(triggerSettings as Record<string, unknown>)?.filterValueMax as string || ''}
                                                                onChange={(value: string) => {
                                                                    setAttributes({
                                                                        triggerSettings: {
                                                                            ...triggerSettings,
                                                                            filterValueMax: value,
                                                                        },
                                                                    });
                                                                }}
                                                                placeholder={selectedFilter.maxPrice || __('Max', 'jankx')}
                                                            />
                                                        </>
                                                    )}

                                                    {selectedFilter.filterType === 'date' && (
                                                        <>
                                                            <TextControl
                                                                label={__('Start Date', 'jankx')}
                                                                type="date"
                                                                value={(triggerSettings as Record<string, unknown>)?.filterValueStart as string || ''}
                                                                onChange={(value: string) => {
                                                                    setAttributes({
                                                                        triggerSettings: {
                                                                            ...triggerSettings,
                                                                            filterValueStart: value,
                                                                        },
                                                                    });
                                                                }}
                                                            />
                                                            <TextControl
                                                                label={__('End Date', 'jankx')}
                                                                type="date"
                                                                value={(triggerSettings as Record<string, unknown>)?.filterValueEnd as string || ''}
                                                                onChange={(value: string) => {
                                                                    setAttributes({
                                                                        triggerSettings: {
                                                                            ...triggerSettings,
                                                                            filterValueEnd: value,
                                                                        },
                                                                    });
                                                                }}
                                                            />
                                                        </>
                                                    )}

                                                    {selectedFilter.filterType === 'author' && (
                                                        <SelectControl
                                                            label={__('Author', 'jankx')}
                                                            value={(triggerSettings as Record<string, unknown>)?.filterValue as string || ''}
                                                            options={[
                                                                { label: __('-- Select Author --', 'jankx'), value: '' },
                                                                ...authors.map((author: Author) => ({
                                                                    label: author.name,
                                                                    value: String(author.id),
                                                                })),
                                                            ]}
                                                            onChange={(value: string) => {
                                                                setAttributes({
                                                                    triggerSettings: {
                                                                        ...triggerSettings,
                                                                        filterValue: value,
                                                                    },
                                                                });
                                                            }}
                                                            disabled={loadingAuthors}
                                                            help={loadingAuthors ? __('Loading authors...', 'jankx') : __('Select an author to filter by', 'jankx')}
                                                        />
                                                    )}

                                                    {selectedFilter.filterType === 'keyword' && (
                                                        <TextControl
                                                            label={__('Search Keyword', 'jankx')}
                                                            value={(triggerSettings as Record<string, unknown>)?.filterValue as string || ''}
                                                            onChange={(value: string) => {
                                                                setAttributes({
                                                                    triggerSettings: {
                                                                        ...triggerSettings,
                                                                        filterValue: value,
                                                                    },
                                                                });
                                                            }}
                                                            placeholder={selectedFilter.placeholder || __('Enter keyword...', 'jankx')}
                                                            help={__('Enter the search keyword', 'jankx')}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </>
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

