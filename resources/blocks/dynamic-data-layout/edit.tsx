import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    Spinner,
    TextControl,
    FormTokenField,
    Button,
    BaseControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState, useMemo, useRef } from '@wordpress/element';
import type { CSSProperties } from 'react';
type TokenLike = string | { value: string; [key: string]: unknown };
import { ResponsiveControl, ResponsiveValue } from '../../shared/components';
import './style.scss';
import './editor.scss';

interface TaxQueryItem {
    taxonomy: string;
    terms: number[];
    operator: 'IN' | 'NOT IN' | 'AND' | 'EXISTS' | 'NOT EXISTS';
}

interface MetaQueryItem {
    key: string;
    value: string;
    compare: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' | 'EXISTS' | 'NOT EXISTS';
    type?: 'NUMERIC' | 'BINARY' | 'CHAR' | 'DATE' | 'DATETIME' | 'DECIMAL' | 'SIGNED' | 'TIME' | 'UNSIGNED';
}

interface TaxonomyItem {
    slug: string;
    name: string;
}

interface TermItem {
    id: number;
    name: string;
}

interface AuthorItem {
    id: number;
    name: string;
}

interface QueryPresetOption {
    value: string;
    label: string;
    postType?: string | null;
    help?: string;
}

interface OrderByOption {
    value: string;
    label: string;
    postType?: string | null;
    metaKey?: string;
}

interface OrderOption {
    value: 'ASC' | 'DESC';
    label: string;
}

interface MetaTypeOption {
    value: string;
    label: string;
}

interface QueryOptions {
    queryPresets?: QueryPresetOption[];
    orderBy?: OrderByOption[];
    order?: OrderOption[];
    metaTypes?: MetaTypeOption[];
}

interface LayoutInfo {
    name: string;
    title: string;
    postType?: string;
    supportedOptions?: string[];
    readOnlyOptions?: string[];
}

interface LayoutsData {
    layoutsByPostType: Record<string, LayoutInfo[]>;
    commonLayouts: LayoutInfo[];
}

interface PostType {
    name: string;
    slug: string;
    viewable: boolean;
}

interface WordPressApiFetch {
    (options: { path: string }): Promise<unknown>;
}

interface WordPressWindow {
    wp?: {
        apiFetch: WordPressApiFetch;
    };
    jankxQueryOptions?: QueryOptions;
    jankxDynamicDataLayouts?: LayoutsData;
}

interface WordPressSelect {
    (store: 'core'): {
        getPostTypes: (options: { per_page: number }) => PostType[];
    };
}

declare global {
    interface Window extends WordPressWindow {}
}

const normalizeTokens = (tokens: TokenLike[]): string[] => {
    return tokens
        .map((token) => {
            if (typeof token === 'string') {
                return token.trim();
            }
            if (token && typeof token.value === 'string') {
                return token.value.trim();
            }
            return '';
        })
        .filter((value): value is string => value.length > 0);
};

// Image ratio presets
const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'] as const;
type PresetImageRatio = typeof PRESET_IMAGE_RATIOS[number];
type ImageRatioSelectValue = '' | 'custom' | PresetImageRatio;

type QueryPreset =
    | 'default'
    | 'related'
    | 'custom'
    | 'on-sale'
    | 'featured'
    | 'related-products'
    | 'best-sellers'
    | 'top-rated'
    | 'upsells'
    | 'new-arrivals'
    | 'recently-viewed';

interface DynamicDataLayoutAttributes {
    queryPreset: QueryPreset;
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    responsiveColumns: ResponsiveValue;
    includeStickyPosts: boolean;
    orderBy: string;
    order: string;
    queryId?: string;
    enablePagination: boolean;
    paginationStyle: 'numbers' | 'simple' | 'arrows' | 'load-more';
    paginationAlignment: 'left' | 'center' | 'right';
    showPaginationNumbers: boolean;
    paginationPrevText: string;
    paginationNextText: string;
    offset: number;
    taxQuery: TaxQueryItem[];
    metaQuery: MetaQueryItem[];
    keyword: string;
    authorIn: number[];
    authorNotIn: number[];
    postIn: number[];
    postNotIn: number[];
    metaKey: string;
    metaType: string;
    postStatus: string[];
    postParent: number;
    postParentIn: number[];
    postParentNotIn: number[];
    customQueryId: string;
    // Carousel specific attributes
    slidesToScroll?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
    showArrows?: boolean;
    showDots?: boolean;
    carouselAlign?: 'start' | 'center' | 'end';
    carouselAxis?: 'x' | 'y';
    carouselDirection?: 'ltr' | 'rtl';
    carouselStartIndex?: number;
    carouselDuration?: number;
    carouselDragFree?: boolean;
    carouselDragThreshold?: number;
    carouselSkipSnaps?: boolean;
    carouselContainScroll?: 'false' | 'trimSnaps' | 'keepSnaps';
    carouselInViewThreshold?: number;
    // Display options
    showTitle?: boolean;
    showExcerpt?: boolean;
    showFeaturedImage?: boolean;
    thumbnailPosition?: 'top' | 'bottom' | 'left' | 'right';
    imageRatio?: string;
    showDate?: boolean;
    showAuthor?: boolean;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showRating?: boolean;
    excerptLength?: number;
}

interface EditProps {
    attributes: DynamicDataLayoutAttributes;
    setAttributes: (attrs: Partial<DynamicDataLayoutAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    console.log('[DEBUG Edit] ========== EDIT FUNCTION START ==========');
    console.log('[DEBUG Edit] Function called with:', { attributes, clientId });
    console.log('[DEBUG Edit] Component render timestamp:', new Date().toISOString());
    
    const {
        queryPreset = 'custom',
        postType = 'post',
        postsPerPage = 10,
        layout = 'grid',
        columns = 3,
        columnsTablet = 2,
        columnsMobile = 1,
        responsiveColumns,
        includeStickyPosts = false,
        orderBy = 'date',
        order = 'DESC',
        queryId,
        enablePagination = false,
        paginationStyle = 'numbers',
        paginationAlignment = 'center',
        showPaginationNumbers = true,
        paginationPrevText = '',
        paginationNextText = '',
        offset = 0,
        taxQuery = [],
        metaQuery = [],
        keyword = '',
        authorIn = [],
        authorNotIn = [],
        postIn = [],
        postNotIn = [],
        metaKey = '',
        metaType = '',
        postStatus = ['publish'],
        postParent = 0,
        postParentIn = [],
        postParentNotIn = [],
        customQueryId = '',
        slidesToScroll = 1,
        loop = false,
        autoplay = false,
        autoplayDelay = 3000,
        showArrows = true,
        showDots = true,
        carouselAlign = 'start',
        carouselAxis = 'x',
        carouselDirection = 'ltr',
        carouselStartIndex = 0,
        carouselDuration = 25,
        carouselDragFree = false,
        carouselDragThreshold = 10,
        carouselSkipSnaps = false,
        carouselContainScroll = 'trimSnaps',
        carouselInViewThreshold = 0,
        showTitle = true,
        showExcerpt = true,
        showFeaturedImage = true,
        thumbnailPosition = 'top',
        imageRatio = '',
        showDate = true,
        showAuthor = false,
        showPrice = true,
        showAddToCart = true,
        showRating = false,
        excerptLength = 55,
    } = attributes;
    
    console.log('[DEBUG Edit] Destructured attributes:', {
        queryPreset,
        postType,
        postsPerPage,
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        queryId,
        orderBy,
        order
    });

    // States for taxonomies and authors
    console.log('[DEBUG Edit] [HOOK-1] About to call useState for taxonomies');
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
    console.log('[DEBUG Edit] [HOOK-1] useState taxonomies completed, value:', taxonomies);
    
    console.log('[DEBUG Edit] [HOOK-2] About to call useState for authors');
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    console.log('[DEBUG Edit] [HOOK-2] useState authors completed, value:', authors);
    
    console.log('[DEBUG Edit] [HOOK-3] About to call useState for taxonomyTerms');
    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});
    console.log('[DEBUG Edit] [HOOK-3] useState taxonomyTerms completed, value:', taxonomyTerms);

    console.log('[DEBUG Edit] [HOOK-4] About to call useRef for isMountedRef');
    const isMountedRef = useRef(true);
    console.log('[DEBUG Edit] [HOOK-4] useRef isMountedRef completed, value:', isMountedRef.current);

    console.log('[DEBUG Edit] [HOOK-5] About to call useEffect (mount effect)');
    useEffect(() => {
        console.log('[DEBUG Edit] [HOOK-5] Mount effect running');
        isMountedRef.current = true;
        console.log('[DEBUG Edit] [HOOK-5] isMountedRef set to true');
        return () => {
            console.log('[DEBUG Edit] [HOOK-5] Unmount effect running');
            isMountedRef.current = false;
            console.log('[DEBUG Edit] [HOOK-5] isMountedRef set to false');
        };
    }, []);
    console.log('[DEBUG Edit] [HOOK-5] useEffect (mount effect) registered');

    // Generate unique queryId if not set
    console.log('[DEBUG Edit] [HOOK-6] About to call useEffect (queryId effect)');
    useEffect(() => {
        console.log('[DEBUG Edit] [HOOK-6] queryId effect - queryId:', queryId, 'clientId:', clientId);
        if (!queryId) {
            console.log('[DEBUG Edit] [HOOK-6] Generating new queryId from clientId');
            // Generate unique ID from clientId hash
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const newQueryId = String(Math.abs(hash));
            console.log('[DEBUG Edit] [HOOK-6] Generated queryId:', newQueryId);
            setAttributes({ queryId: newQueryId });
        } else {
            console.log('[DEBUG Edit] [HOOK-6] queryId already exists, skipping generation');
        }
    }, [queryId, clientId, setAttributes]);
    console.log('[DEBUG Edit] [HOOK-6] useEffect (queryId effect) registered');

    // Reset queryPreset if current preset is not valid for the current postType
    console.log('[DEBUG Edit] [HOOK-7] About to call useEffect (queryPreset validation)');
    useEffect(() => {
        console.log('[DEBUG Edit] [HOOK-7] queryPreset validation effect - postType:', postType, 'queryPreset:', queryPreset);
        const allPresets: QueryPresetOption[] = window.jankxQueryOptions?.queryPresets || [];
        console.log('[DEBUG Edit] [HOOK-7] All presets:', allPresets);
        
        const validPresets = allPresets.filter((preset: QueryPresetOption) => 
            !preset.postType || preset.postType === postType
        );
        console.log('[DEBUG Edit] [HOOK-7] Valid presets for postType:', validPresets);
        
        const currentPresetValid = validPresets.some((preset: QueryPresetOption) => preset.value === queryPreset);
        console.log('[DEBUG Edit] [HOOK-7] Current preset valid?', currentPresetValid);
        
        if (!currentPresetValid && validPresets.length > 0 && validPresets[0]?.value) {
            // Reset to first valid preset
            const newPreset = validPresets[0].value as QueryPreset;
            console.log('[DEBUG Edit] [HOOK-7] Resetting queryPreset to:', newPreset);
            setAttributes({ queryPreset: newPreset });
        }
    }, [postType, queryPreset, setAttributes]);
    console.log('[DEBUG Edit] [HOOK-7] useEffect (queryPreset validation) registered');

    // Fetch taxonomies and authors when postType changes
    console.log('[DEBUG Edit] [HOOK-8] About to call useEffect (fetch taxonomies/authors)');
    useEffect(() => {
        console.log('[DEBUG Edit] [HOOK-8] Fetch taxonomies/authors effect - postType:', postType);
        
        const fetchTaxonomiesAndAuthors = async () => {
            console.log('[DEBUG Edit] fetchTaxonomiesAndAuthors called');
            
            if (!window.wp?.apiFetch) {
                console.log('[DEBUG Edit] window.wp.apiFetch not available');
                return;
            }

            try {
                console.log('[DEBUG Edit] Fetching taxonomies for postType:', postType);
                const taxonomiesData = await window.wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                }) as Record<string, TaxonomyItem> | undefined;
                console.log('[DEBUG Edit] Raw taxonomiesData:', taxonomiesData);

                if (!isMountedRef.current) {
                    console.log('[DEBUG Edit] Component unmounted, skipping state update');
                    return;
                }

                const taxArray = Object.values(taxonomiesData || {}).filter(
                    (item): item is TaxonomyItem => typeof item?.slug === 'string' && typeof item?.name === 'string'
                );
                console.log('[DEBUG Edit] Filtered taxonomies array:', taxArray);
                setTaxonomies(taxArray);
                console.log('[DEBUG Edit] setTaxonomies called with:', taxArray);

                console.log('[DEBUG Edit] Fetching authors');
                const authorsData = await window.wp.apiFetch({
                    path: '/wp/v2/users?who=authors&per_page=100',
                }) as Array<Record<string, unknown>> | undefined;
                console.log('[DEBUG Edit] Raw authorsData:', authorsData);

                if (!isMountedRef.current) {
                    console.log('[DEBUG Edit] Component unmounted, skipping state update');
                    return;
                }

                const normalizedAuthors = (authorsData || [])
                    .map((author) => {
                        const id = typeof author?.id === 'number' ? author.id : Number(author?.id);
                        const name =
                            typeof author?.name === 'string' && author.name.length > 0
                                ? author.name
                                : typeof author?.slug === 'string'
                                    ? author.slug
                                    : '';

                        return {
                            id: Number.isFinite(id) ? id : 0,
                            name,
                        };
                    })
                    .filter((author): author is AuthorItem => author.id > 0 && author.name.length > 0);
                
                console.log('[DEBUG Edit] Normalized authors:', normalizedAuthors);
                setAuthors(normalizedAuthors);
                console.log('[DEBUG Edit] setAuthors called with:', normalizedAuthors);
            } catch (error) {
                console.error('[DEBUG Edit] Error fetching taxonomies/authors:', error);

                if (!isMountedRef.current) {
                    console.log('[DEBUG Edit] Component unmounted, skipping error state update');
                    return;
                }

                setTaxonomies([]);
                setAuthors([]);
                console.log('[DEBUG Edit] Reset taxonomies and authors to empty arrays');
            }
        };

        fetchTaxonomiesAndAuthors();
    }, [postType]);
    console.log('[DEBUG Edit] [HOOK-8] useEffect (fetch taxonomies/authors) registered');

    // Function to fetch terms for a specific taxonomy
    console.log('[DEBUG Edit] [HOOK-9] About to call useCallback (fetchTermsForTaxonomy)');
    const fetchTermsForTaxonomy = useCallback(async (taxonomy: string) => {
        console.log('[DEBUG Edit] fetchTermsForTaxonomy called with taxonomy:', taxonomy);
        
        if (taxonomyTerms[taxonomy]) {
            console.log('[DEBUG Edit] Terms already loaded for taxonomy:', taxonomy);
            return; // Already loaded
        }

        if (!window.wp?.apiFetch) {
            console.log('[DEBUG Edit] window.wp.apiFetch not available');
            return;
        }

        try {
            console.log('[DEBUG Edit] Fetching terms for taxonomy:', taxonomy);
            const termsResponse = await window.wp.apiFetch({
                path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
            }) as Array<Record<string, unknown>> | undefined;
            console.log('[DEBUG Edit] Raw termsResponse:', termsResponse);

            if (!isMountedRef.current) {
                console.log('[DEBUG Edit] Component unmounted, skipping state update');
                return;
            }

            const normalizedTerms = (termsResponse || [])
                .map((term) => {
                    const id = typeof term?.id === 'number' ? term.id : Number(term?.id);
                    const name = typeof term?.name === 'string' ? term.name : '';
                    return {
                        id: Number.isFinite(id) ? id : 0,
                        name,
                    };
                })
                .filter((term): term is TermItem => term.id > 0 && term.name.length > 0);
            
            console.log('[DEBUG Edit] Normalized terms:', normalizedTerms);

            setTaxonomyTerms(prev => {
                const newState = {
                    ...prev,
                    [taxonomy]: normalizedTerms,
                };
                console.log('[DEBUG Edit] Setting taxonomyTerms to:', newState);
                return newState;
            });
        } catch (error) {
            console.error(`[DEBUG Edit] Error fetching terms for ${taxonomy}:`, error);

            if (!isMountedRef.current) {
                console.log('[DEBUG Edit] Component unmounted, skipping error state update');
                return;
            }

            setTaxonomyTerms(prev => {
                const newState = {
                    ...prev,
                    [taxonomy]: [],
                };
                console.log('[DEBUG Edit] Setting taxonomyTerms to empty array for taxonomy:', taxonomy);
                return newState;
            });
        }
    }, [taxonomyTerms]);
    console.log('[DEBUG Edit] [HOOK-9] useCallback (fetchTermsForTaxonomy) registered');

    console.log('[DEBUG Edit] [HOOK-10] About to call useBlockProps');
    const blockProps = useBlockProps({
        className: `dynamic-data-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
        style: {
            '--columns-desktop': columns,
            '--columns-tablet': columnsTablet,
            '--columns-mobile': columnsMobile,
        } as CSSProperties,
    });
    console.log('[DEBUG Edit] [HOOK-10] useBlockProps completed, blockProps:', blockProps);

    const resolvedResponsiveColumns = responsiveColumns && typeof responsiveColumns === 'object'
        ? responsiveColumns
        : { desktop: columns, tablet: columnsTablet, mobile: columnsMobile };
    console.log('[DEBUG Edit] resolvedResponsiveColumns:', resolvedResponsiveColumns);

    console.log('[DEBUG Edit] [HOOK-11] About to call useEffect (responsiveColumns sync)');
    useEffect(() => {
        console.log('[DEBUG Edit] [HOOK-11] responsiveColumns sync effect');
        const expected = {
            desktop: columns,
            tablet: columnsTablet,
            mobile: columnsMobile,
        };
        console.log('[DEBUG Edit] [HOOK-11] Expected responsiveColumns:', expected);
        console.log('[DEBUG Edit] [HOOK-11] Current responsiveColumns:', responsiveColumns);

        const needsUpdate =
            !responsiveColumns ||
            responsiveColumns.desktop !== expected.desktop ||
            responsiveColumns.tablet !== expected.tablet ||
            responsiveColumns.mobile !== expected.mobile;
        
        console.log('[DEBUG Edit] [HOOK-11] Needs update?', needsUpdate);

        if (needsUpdate) {
            console.log('[DEBUG Edit] [HOOK-11] Updating responsiveColumns to:', expected);
            setAttributes({ responsiveColumns: expected });
        }
    }, [columns, columnsTablet, columnsMobile, responsiveColumns, setAttributes]);
    console.log('[DEBUG Edit] [HOOK-11] useEffect (responsiveColumns sync) registered');

    // Get available post types
    console.log('[DEBUG Edit] [HOOK-12] About to call useSelect (postTypes)');
    const postTypes = useSelect((select: WordPressSelect) => {
        const { getPostTypes } = select('core');
        const types = getPostTypes({ per_page: -1 }) || [];
        console.log('[DEBUG Edit] [HOOK-12] useSelect postTypes:', types);
        return types;
    }, []);
    console.log('[DEBUG Edit] [HOOK-12] useSelect (postTypes) completed, value:', postTypes);

    const postTypeOptions = postTypes
        .filter((type: PostType) => type.viewable && type.slug !== 'attachment')
        .map((type: PostType) => ({
            label: type.name,
            value: type.slug,
        }));
    console.log('[DEBUG Edit] postTypeOptions:', postTypeOptions);

    // Get layouts data from PHP
    const layoutsData: LayoutsData = window.jankxDynamicDataLayouts || {
        layoutsByPostType: {},
        commonLayouts: [],
    };
    console.log('[DEBUG Edit] layoutsData:', layoutsData);

    // Get available layouts for current post type
    console.log('[DEBUG Edit] [HOOK-13] About to call useMemo (availableLayouts)');
    const availableLayouts = useMemo(() => {
        console.log('[DEBUG Edit] [HOOK-13] useMemo availableLayouts - postType:', postType);
        const layouts: Array<{ name: string; title: string; supportedOptions?: string[] }> = [];
        
        // Add common layouts
        if (layoutsData.commonLayouts) {
            console.log('[DEBUG Edit] Processing commonLayouts:', layoutsData.commonLayouts);
            layoutsData.commonLayouts.forEach((layoutInfo: LayoutInfo) => {
                const layoutItem: { name: string; title: string; supportedOptions?: string[] } = {
                    name: layoutInfo.name || '',
                    title: layoutInfo.title || layoutInfo.name || '',
                };
                if (layoutInfo.supportedOptions) {
                    layoutItem.supportedOptions = layoutInfo.supportedOptions;
                }
                layouts.push(layoutItem);
            });
        }
        
        // Add post type specific layouts
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            console.log('[DEBUG Edit] Processing layoutsByPostType for', postType, ':', layoutsData.layoutsByPostType[postType]);
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: LayoutInfo) => {
                const layoutItem: { name: string; title: string; supportedOptions?: string[] } = {
                    name: layoutInfo.name || '',
                    title: layoutInfo.title || layoutInfo.name || '',
                };
                if (layoutInfo.supportedOptions) {
                    layoutItem.supportedOptions = layoutInfo.supportedOptions;
                }
                layouts.push(layoutItem);
            });
        }
        
        console.log('[DEBUG Edit] [HOOK-13] Final availableLayouts:', layouts);
        return layouts;
    }, [postType, layoutsData]);
    console.log('[DEBUG Edit] [HOOK-13] useMemo (availableLayouts) completed, value:', availableLayouts);

    // Layout options for SelectControl
    console.log('[DEBUG Edit] [HOOK-14] About to call useMemo (layoutOptions)');
    const layoutOptions = useMemo(() => {
        const options = availableLayouts.map((layoutInfo) => ({
            label: layoutInfo.title,
            value: layoutInfo.name,
        }));
        console.log('[DEBUG Edit] [HOOK-14] layoutOptions:', options);
        return options;
    }, [availableLayouts]);
    console.log('[DEBUG Edit] [HOOK-14] useMemo (layoutOptions) completed, value:', layoutOptions);

    // Get current layout's supported options
    const currentLayout = availableLayouts.find((l) => l.name === layout);
    console.log('[DEBUG Edit] currentLayout:', currentLayout, 'for layout:', layout);
    
    const supportedOptions: string[] = currentLayout?.supportedOptions || [];
    const readOnlyOptions: string[] = currentLayout?.readOnlyOptions || [];
    console.log('[DEBUG Edit] supportedOptions:', supportedOptions);
    console.log('[DEBUG Edit] readOnlyOptions:', readOnlyOptions);

    // Check if post type is product
    const isProduct = postType === 'product';

    // Image ratio handling
    const imageRatioSelectValue = useMemo<ImageRatioSelectValue>(() => {
        if (!imageRatio) {
            return '';
        }
        if ((PRESET_IMAGE_RATIOS as readonly string[]).includes(imageRatio)) {
            return imageRatio as PresetImageRatio;
        }
        return 'custom';
    }, [imageRatio]);

    const isCustomImageRatio = imageRatioSelectValue === 'custom';
    const customImageRatioValue = isCustomImageRatio && imageRatio ? imageRatio : '';

    // Pre-compute orderBy options outside conditional render to avoid React hooks error
    console.log('[DEBUG Edit] [HOOK-15] About to call useMemo (orderByOptions)');
    const orderByOptions = useMemo(() => {
        const allOrderByOptions: OrderByOption[] = window.jankxQueryOptions?.orderBy || [];
        console.log('[DEBUG Edit] [HOOK-15] Computing orderByOptions - allOrderByOptions:', allOrderByOptions);
        // Filter order by options based on postType:
        // - Common options: postType is null (available for all post types)
        // - Specific options: postType matches current postType
        const filtered = allOrderByOptions
            .filter((option: OrderByOption) => 
                !option.postType || option.postType === postType
            )
            .map((option: OrderByOption) => ({
                label: option.label,
                value: option.value,
            }));
        console.log('[DEBUG Edit] [HOOK-15] Filtered orderByOptions:', filtered);
        return filtered;
    }, [postType]);
    console.log('[DEBUG Edit] [HOOK-15] useMemo (orderByOptions) completed, value:', orderByOptions);

    // Pre-compute order options outside conditional render
    console.log('[DEBUG Edit] [HOOK-16] About to call useMemo (orderOptions)');
    const orderOptions = useMemo(() => {
        const options = window.jankxQueryOptions?.order || [
            { label: __('Descending', 'jankx'), value: 'DESC' as const },
            { label: __('Ascending', 'jankx'), value: 'ASC' as const },
        ];
        console.log('[DEBUG Edit] [HOOK-16] orderOptions:', options);
        return options;
    }, []);
    console.log('[DEBUG Edit] [HOOK-16] useMemo (orderOptions) completed, value:', orderOptions);

    // Pre-compute query preset options outside JSX
    console.log('[DEBUG Edit] [HOOK-17] About to call useMemo (queryPresetOptions)');
    const queryPresetOptions = useMemo(() => {
        const allPresets: QueryPresetOption[] = window.jankxQueryOptions?.queryPresets || [];
        console.log('[DEBUG Edit] [HOOK-17] All query presets:', allPresets);
        // Filter presets based on postType:
        // - Common presets: postType is null (available for all post types)
        // - Specific presets: postType matches current postType
        const filtered = allPresets
            .filter((preset: QueryPresetOption) => 
                !preset.postType || preset.postType === postType
            )
            .map((preset: QueryPresetOption) => ({
                label: preset.label,
                value: preset.value,
            }));
        console.log('[DEBUG Edit] [HOOK-17] Filtered query preset options:', filtered);
        return filtered;
    }, [postType]);
    console.log('[DEBUG Edit] [HOOK-17] useMemo (queryPresetOptions) completed, value:', queryPresetOptions);

    // Pre-compute query preset help text outside JSX
    console.log('[DEBUG Edit] [HOOK-18] About to call useMemo (queryPresetHelp)');
    const queryPresetHelp = useMemo(() => {
        const allPresets: QueryPresetOption[] = window.jankxQueryOptions?.queryPresets || [];
        const currentPreset = allPresets.find((p: QueryPresetOption) => p.value === queryPreset);
        const helpText = currentPreset?.help || __('Select a query preset', 'jankx');
        console.log('[DEBUG Edit] [HOOK-18] queryPresetHelp:', helpText);
        return helpText;
    }, [queryPreset]);
    console.log('[DEBUG Edit] [HOOK-18] useMemo (queryPresetHelp) completed, value:', queryPresetHelp);

    // Debug: Log when queryPreset is 'default'
    console.log('[DEBUG Edit] ===== START RENDER =====');
    console.log('[DEBUG Edit] queryPreset:', queryPreset);
    console.log('[DEBUG Edit] postType:', postType);
    console.log('[DEBUG Edit] layout:', layout);
    console.log('[DEBUG Edit] columns:', { desktop: columns, tablet: columnsTablet, mobile: columnsMobile });
    console.log('[DEBUG Edit] supportedOptions:', supportedOptions);
    console.log('[DEBUG Edit] currentLayout:', currentLayout);
    console.log('[DEBUG Edit] All attributes:', attributes);

    console.log('[DEBUG Edit] ========== ALL HOOKS COMPLETED ==========');
    console.log('[DEBUG Edit] Total hooks called: 18');
    console.log('[DEBUG Edit] ========== ABOUT TO RENDER JSX ==========');
    console.log('[DEBUG Edit] queryPreset at render time:', queryPreset);
    console.log('[DEBUG Edit] Will render Order By controls?', queryPreset !== 'default');
    console.log('[DEBUG Edit] Will render custom panels?', queryPreset === 'custom');
    console.log('[DEBUG Edit] Conditional render check - queryPreset !== "default":', queryPreset !== 'default');
    console.log('[DEBUG Edit] Conditional render check - queryPreset === "custom":', queryPreset === 'custom');
    
    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={queryPresetOptions}
                        onChange={(value) => {
                            console.log('[DEBUG Edit] queryPreset onChange:', value);
                            setAttributes({ queryPreset: value as QueryPreset });
                        }}
                        help={queryPresetHelp}
                    />

                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value) => {
                            console.log('[DEBUG Edit] postType onChange:', value);
                            setAttributes({ postType: value });
                        }}
                        help={queryPreset === 'default' ? __('Select post type for the main query', 'jankx') : undefined}
                    />

                    {/* Posts Per Page - Show for all presets */}
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value) => setAttributes({ postsPerPage: value || 10 })}
                        min={1}
                        max={50}
                        help={__('Number of posts to display', 'jankx')}
                    />

                    {postType === 'post' ? (
                        <ToggleControl
                            label={__('Include Sticky Posts', 'jankx')}
                            checked={includeStickyPosts}
                            onChange={(value) => setAttributes({ includeStickyPosts: value })}
                            help={__('Include sticky posts in the query (disabled by default).', 'jankx')}
                        />
                    ) : null}

                    {/* Order By and Order - Show for related and custom presets */}
                    {(() => {
                        const shouldRender = queryPreset !== 'default';
                        console.log('[DEBUG Edit] [CONDITIONAL-1] Checking queryPreset !== "default":', shouldRender, 'queryPreset:', queryPreset);
                        if (!shouldRender) {
                            console.log('[DEBUG Edit] [CONDITIONAL-1] Not rendering Order By controls (queryPreset is "default")');
                            return null;
                        }
                        console.log('[DEBUG Edit] [CONDITIONAL-1] Rendering Order By controls');
                        return (
                            <>
                                <SelectControl
                                    label={__('Order By', 'jankx')}
                                    value={orderBy}
                                    options={orderByOptions}
                                    onChange={(value) => {
                                        console.log('[DEBUG Edit] orderBy onChange:', value);
                                        const allOrderByOptions: OrderByOption[] = window.jankxQueryOptions?.orderBy || [];
                                        const selectedOption = allOrderByOptions.find((opt: OrderByOption) => opt.value === value);
                                        
                                        // Auto-set metaKey if option has metaKey property
                                        const updates: Partial<DynamicDataLayoutAttributes> = { orderBy: value };
                                        if (selectedOption?.metaKey) {
                                            updates.metaKey = selectedOption.metaKey;
                                            // Set orderBy to meta_value_num if value is numeric (like total_sales, _price)
                                            if (['total_sales', '_price'].includes(value)) {
                                                updates.orderBy = 'meta_value_num';
                                            }
                                        }
                                        
                                        console.log('[DEBUG Edit] Setting attributes:', updates);
                                        setAttributes(updates);
                                    }}
                                    help={__('Sort posts by which criteria', 'jankx')}
                                />
                                <SelectControl
                                    label={__('Order', 'jankx')}
                                    value={order as 'ASC' | 'DESC'}
                                    options={orderOptions}
                                    onChange={(value) => {
                                        console.log('[DEBUG Edit] order onChange:', value);
                                        setAttributes({ order: value as 'ASC' | 'DESC' });
                                    }}
                                />
                            </>
                        );
                    })()}
                </PanelBody>

                {/* Layout Settings */}
                <PanelBody title={__('Layout', 'jankx')} initialOpen={true}>
                            <SelectControl
                                label={__('Layout Type', 'jankx')}
                                value={layout}
                                options={layoutOptions.length > 0 ? layoutOptions : [
                                    { label: __('Grid', 'jankx'), value: 'grid' },
                                    { label: __('List', 'jankx'), value: 'list' },
                                    { label: __('Card', 'jankx'), value: 'card' },
                                    { label: __('Carousel', 'jankx'), value: 'carousel' },
                                ]}
                                onChange={(value) => {
                                    console.log('[DEBUG Edit] layout onChange:', value);
                                    setAttributes({ layout: value });
                                }}
                            />
                            {supportedOptions.includes('columns') ? (
                                <ResponsiveControl
                                    label={__('Columns', 'jankx')}
                                    values={resolvedResponsiveColumns}
                                    onChange={(values) => setAttributes({
                                        columns: values.desktop,
                                        columnsTablet: values.tablet,
                                        columnsMobile: values.mobile,
                                        responsiveColumns: values
                                    })}
                                    min={1}
                                    max={6}
                                    help={{
                                        desktop: __('Number of columns on large screens (>1024px)', 'jankx'),
                                        tablet: __('Number of columns on tablet (768px - 1024px)', 'jankx'),
                                        mobile: __('Number of columns on mobile (<768px)', 'jankx')
                                    }}
                                />
                            ) : null}
                        </PanelBody>
                    
                    {/* Carousel Specific Settings */}
                    {layout === 'carousel' ? (
                        <>
                            <RangeControl
                                label={__('Slides To Scroll', 'jankx')}
                                value={slidesToScroll}
                                onChange={(value) => setAttributes({ slidesToScroll: value || 1 })}
                                min={1}
                                max={columns || 3}
                                help={__('Number of slides to scroll at a time', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Loop', 'jankx')}
                                checked={loop}
                                onChange={(value) => setAttributes({ loop: value })}
                                help={__('Enable infinite loop', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Autoplay', 'jankx')}
                                checked={autoplay}
                                onChange={(value) => setAttributes({ autoplay: value })}
                                help={__('Automatically advance slides', 'jankx')}
                            />
                            {autoplay ? (
                                <RangeControl
                                    label={__('Autoplay Delay (ms)', 'jankx')}
                                    value={autoplayDelay}
                                    onChange={(value) => setAttributes({ autoplayDelay: value || 3000 })}
                                    min={1000}
                                    max={10000}
                                    step={500}
                                    help={__('Time between autoplay transitions', 'jankx')}
                                />
                            ) : null}
                            <ToggleControl
                                label={__('Show Arrows', 'jankx')}
                                checked={showArrows}
                                onChange={(value) => setAttributes({ showArrows: value })}
                                help={__('Display navigation arrows', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Show Dots', 'jankx')}
                                checked={showDots}
                                onChange={(value) => setAttributes({ showDots: value })}
                                help={__('Display pagination dots', 'jankx')}
                            />
                        </>
                    ) : null}

                {/* Pagination Settings */}
                <PanelBody title={__('Pagination', 'jankx')} initialOpen={false}>
                        <ToggleControl
                            label={__('Enable Pagination', 'jankx')}
                            checked={enablePagination}
                            onChange={(value) => setAttributes({ enablePagination: value })}
                            help={__('Display pagination to paginate posts', 'jankx')}
                        />

                        {enablePagination ? (
                            <>
                                <SelectControl
                                    label={__('Pagination Style', 'jankx')}
                                    value={paginationStyle}
                                    options={[
                                        { label: __('Numbers', 'jankx'), value: 'numbers' },
                                        { label: __('Simple (Prev/Next)', 'jankx'), value: 'simple' },
                                        { label: __('Arrows', 'jankx'), value: 'arrows' },
                                        { label: __('Load More', 'jankx'), value: 'load-more' },
                                    ]}
                                    onChange={(value) => setAttributes({ paginationStyle: value as 'numbers' | 'simple' | 'arrows' | 'load-more' })}
                                    help={__('Choose pagination display style', 'jankx')}
                                />

                                <SelectControl
                                    label={__('Pagination Alignment', 'jankx')}
                                    value={paginationAlignment}
                                    options={[
                                        { label: __('Left', 'jankx'), value: 'left' },
                                        { label: __('Center', 'jankx'), value: 'center' },
                                        { label: __('Right', 'jankx'), value: 'right' },
                                    ]}
                                    onChange={(value) => setAttributes({ paginationAlignment: value as 'left' | 'center' | 'right' })}
                                    help={__('Align pagination position', 'jankx')}
                                />

                                {paginationStyle === 'numbers' ? (
                                    <ToggleControl
                                        label={__('Show All Page Numbers', 'jankx')}
                                        checked={showPaginationNumbers}
                                        onChange={(value) => setAttributes({ showPaginationNumbers: value })}
                                        help={__('Show all page numbers instead of abbreviated', 'jankx')}
                                    />
                                ) : null}

                                <TextControl
                                    label={__('Previous Button Text', 'jankx')}
                                    value={paginationPrevText}
                                    onChange={(value) => setAttributes({ paginationPrevText: value })}
                                    help={__('Leave empty to use default text. Can use HTML/SVG.', 'jankx')}
                                    placeholder={__('Example: « Previous or <svg>...</svg>', 'jankx')}
                                />

                                <TextControl
                                    label={__('Next Button Text', 'jankx')}
                                    value={paginationNextText}
                                    onChange={(value) => setAttributes({ paginationNextText: value })}
                                    help={__('Leave empty to use default text. Can use HTML/SVG.', 'jankx')}
                                    placeholder={__('Example: Next » or <svg>...</svg>', 'jankx')}
                                />
                            </>
                        ) : null}
                </PanelBody>

                {/* Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                        <PanelBody title={__('Query Parameters', 'jankx')} initialOpen={false}>
                        <RangeControl
                            label={__('Offset', 'jankx')}
                            value={offset}
                            onChange={(value) => setAttributes({ offset: value || 0 })}
                            min={0}
                            max={50}
                            help={__('Skip the first N posts', 'jankx')}
                        />

                        {/* Meta Key for meta_value ordering */}
                        {(orderBy === 'meta_value' || orderBy === 'meta_value_num') ? (
                            <>
                                <TextControl
                                    label={__('Meta Key', 'jankx')}
                                    value={metaKey}
                                    onChange={(value) => setAttributes({ metaKey: value })}
                                    help={__('Meta key for sorting (required when using meta_value)', 'jankx')}
                                    placeholder={__('Example: price, views, rating', 'jankx')}
                                />
                                {orderBy === 'meta_value' ? (
                                    <SelectControl
                                        label={__('Meta Type', 'jankx')}
                                        value={metaType}
                                        options={window.jankxQueryOptions?.metaTypes || [
                                            { label: __('-- Auto --', 'jankx'), value: '' },
                                            { label: 'NUMERIC', value: 'NUMERIC' },
                                        ]}
                                        onChange={(value) => setAttributes({ metaType: value })}
                                        help={__('Specify data type for accurate sorting', 'jankx')}
                                    />
                                ) : null}
                            </>
                        ) : null}
                        </PanelBody>
                ) : null}

                {/* Advanced Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                    <PanelBody title={__('🔧 Advanced Query Parameters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Query ID', 'jankx')}
                            value={customQueryId}
                            onChange={(value) => setAttributes({ customQueryId: value })}
                            help={__('Set a name for this query to apply final filters: jankx/post-layout/query-args/{query_id}', 'jankx')}
                            placeholder={__('Example: featured-posts, sidebar-posts', 'jankx')}
                        />

                        <BaseControl
                            label={__('Post Status', 'jankx')}
                            help={__('Post status to fetch (default: publish)', 'jankx')}
                        >
                            <FormTokenField
                                value={postStatus}
                                suggestions={['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any']}
                                onChange={(tokens) => setAttributes({ postStatus: normalizeTokens(tokens as TokenLike[]) })}
                            />
                        </BaseControl>

                        <TextControl
                            label={__('Post Parent ID', 'jankx')}
                            type="number"
                            value={postParent}
                            onChange={(value) => setAttributes({ postParent: parseInt(value) || 0 })}
                            help={__('Filter posts by parent ID (0 = all)', 'jankx')}
                        />

                        <TextControl
                            label={__('Post Parent IDs (Include)', 'jankx')}
                            value={postParentIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentIn: ids });
                            }}
                            help={__('Only fetch posts with parents in this list', 'jankx')}
                            placeholder={__('Example: 1, 2, 3', 'jankx')}
                        />

                        <TextControl
                            label={__('Post Parent IDs (Exclude)', 'jankx')}
                            value={postParentNotIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentNotIn: ids });
                            }}
                            help={__('Exclude posts with parents in this list', 'jankx')}
                            placeholder={__('Example: 4, 5, 6', 'jankx')}
                        />
                    </PanelBody>
                ) : null}

                {/* Keyword Search Filter - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                    <PanelBody title={__('🔍 Keyword Search', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Search Keyword', 'jankx')}
                            value={keyword}
                            onChange={(value) => setAttributes({ keyword: value })}
                            help={__('Search by title, content, excerpt', 'jankx')}
                            placeholder={__('Enter keyword...', 'jankx')}
                        />
                    </PanelBody>
                ) : null}

                {/* Author Filters - Only show for custom preset */}
                {queryPreset === 'custom' && authors.length > 0 ? (
                    <PanelBody title={__('👤 Author Filters', 'jankx')} initialOpen={false}>
                        <BaseControl
                            label={__('Authors (Include)', 'jankx')}
                            help={__('Only display posts from these authors', 'jankx')}
                        >
                            <FormTokenField
                                value={authors.filter((author) => authorIn.includes(author.id)).map((author) => author.name)}
                                suggestions={authors.map((author) => author.name)}
                                onChange={(tokens) => {
                                    const normalizedTokens = normalizeTokens(tokens as TokenLike[]);
                                    const selectedIds = normalizedTokens
                                        .map((tokenName) => {
                                            const author = authors.find((item) => item.name === tokenName);
                                            return author?.id ?? 0;
                                        })
                                        .filter((id) => id > 0);
                                    setAttributes({ authorIn: selectedIds });
                                }}
                            />
                        </BaseControl>
                        <BaseControl
                            label={__('Authors (Exclude)', 'jankx')}
                            help={__('Exclude posts from these authors', 'jankx')}
                        >
                            <FormTokenField
                                value={authors.filter((author) => authorNotIn.includes(author.id)).map((author) => author.name)}
                                suggestions={authors.map((author) => author.name)}
                                onChange={(tokens) => {
                                    const normalizedTokens = normalizeTokens(tokens as TokenLike[]);
                                    const selectedIds = normalizedTokens
                                        .map((tokenName) => {
                                            const author = authors.find((item) => item.name === tokenName);
                                            return author?.id ?? 0;
                                        })
                                        .filter((id) => id > 0);
                                    setAttributes({ authorNotIn: selectedIds });
                                }}
                            />
                        </BaseControl>
                    </PanelBody>
                ) : null}

                {/* Post ID Filters - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                    <PanelBody title={__('🔢 Post ID Filters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Post IDs (Include)', 'jankx')}
                            value={postIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postIn: ids });
                            }}
                            help={__('Only display posts with these IDs (comma separated)', 'jankx')}
                            placeholder={__('Example: 1, 2, 3', 'jankx')}
                        />
                        <TextControl
                            label={__('Post IDs (Exclude)', 'jankx')}
                            value={postNotIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postNotIn: ids });
                            }}
                            help={__('Exclude posts with these IDs (comma separated)', 'jankx')}
                            placeholder={__('Example: 4, 5, 6', 'jankx')}
                        />
                    </PanelBody>
                ) : null}

                {/* Meta Query Filters - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                    <PanelBody title={__('⚙️ Meta Query Filters', 'jankx')} initialOpen={false}>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const newMetaQuery = [...metaQuery];
                                newMetaQuery.push({
                                    key: '',
                                    value: '',
                                    compare: '=',
                                });
                                setAttributes({ metaQuery: newMetaQuery });
                            }}
                        >
                            {__('+ Add Meta Query', 'jankx')}
                        </Button>

                        {metaQuery.map((mq, index) => (
                            <div key={index} style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <strong>{__('Meta Query', 'jankx')} #{index + 1}</strong>
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => {
                                            const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                                            setAttributes({ metaQuery: newMetaQuery });
                                        }}
                                    >
                                        {__('Remove', 'jankx')}
                                    </Button>
                                </div>

                                <TextControl
                                    label={__('Meta Key', 'jankx')}
                                    value={mq.key}
                                    onChange={(value) => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) {
                                            return;
                                        }
                                        newMetaQuery[index] = {
                                            ...targetQuery,
                                            key: value,
                                        };
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                    placeholder={__('Example: price, rating, views', 'jankx')}
                                />

                                <SelectControl
                                    label={__('Compare', 'jankx')}
                                    value={mq.compare}
                                    options={[
                                        { label: '= (Equal)', value: '=' },
                                        { label: '!= (Not Equal)', value: '!=' },
                                        { label: '> (Greater Than)', value: '>' },
                                        { label: '>= (Greater or Equal)', value: '>=' },
                                        { label: '< (Less Than)', value: '<' },
                                        { label: '<= (Less or Equal)', value: '<=' },
                                        { label: 'LIKE (Contains)', value: 'LIKE' },
                                        { label: 'NOT LIKE (Not Contains)', value: 'NOT LIKE' },
                                        { label: 'IN (In List)', value: 'IN' },
                                        { label: 'NOT IN (Not In List)', value: 'NOT IN' },
                                        { label: 'EXISTS (Exists)', value: 'EXISTS' },
                                        { label: 'NOT EXISTS (Not Exists)', value: 'NOT EXISTS' },
                                    ]}
                                    onChange={(value) => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) {
                                            return;
                                        }
                                        newMetaQuery[index] = {
                                            ...targetQuery,
                                            compare: value as MetaQueryItem['compare'],
                                        };
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                />

                                {!['EXISTS', 'NOT EXISTS'].includes(mq.compare) ? (
                                    <TextControl
                                        label={__('Value', 'jankx')}
                                        value={mq.value}
                                        onChange={(value) => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            newMetaQuery[index] = {
                                                ...targetQuery,
                                                value,
                                            };
                                            setAttributes({ metaQuery: newMetaQuery });
                                        }}
                                        placeholder={__('Enter value...', 'jankx')}
                                    />
                                ) : null}

                                <SelectControl
                                    label={__('Type (Optional)', 'jankx')}
                                    value={mq.type || ''}
                                    options={[
                                        { label: __('-- Auto --', 'jankx'), value: '' },
                                        { label: 'NUMERIC', value: 'NUMERIC' },
                                        { label: 'BINARY', value: 'BINARY' },
                                        { label: 'CHAR', value: 'CHAR' },
                                        { label: 'DATE', value: 'DATE' },
                                        { label: 'DATETIME', value: 'DATETIME' },
                                        { label: 'DECIMAL', value: 'DECIMAL' },
                                        { label: 'TIME', value: 'TIME' },
                                        { label: 'SIGNED', value: 'SIGNED' },
                                        { label: 'UNSIGNED', value: 'UNSIGNED' },
                                    ]}
                                    onChange={(value) => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) {
                                            return;
                                        }
                                        const updatedQuery: MetaQueryItem = { ...targetQuery };
                                        const nextType = value ? (value as MetaQueryItem['type']) : undefined;
                                        if (nextType) {
                                            updatedQuery.type = nextType;
                                        } else if ('type' in updatedQuery) {
                                            delete (updatedQuery as { type?: MetaQueryItem['type'] }).type;
                                        }
                                        newMetaQuery[index] = updatedQuery;
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                    help={__('Specify data type for accurate comparison', 'jankx')}
                                />
                            </div>
                        ))}
                    </PanelBody>
                ) : null}

                {/* Taxonomy Filters - Only show for custom preset */}
                {queryPreset === 'custom' && taxonomies.length > 0 ? taxonomies.map((taxonomy: TaxonomyItem) => {
                    // Find existing query for this taxonomy
                    const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
                    const hasQuery = existingQueryIndex >= 0;
                    const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
                    const terms = taxonomyTerms[taxonomy.slug];

                    return (
                        <PanelBody
                            key={taxonomy.slug}
                            title={`🏷️ ${taxonomy.name}`}
                            initialOpen={hasQuery}
                            onToggle={(isOpen) => {
                                if (isOpen) {
                                    // Fetch terms when panel opens
                                    fetchTermsForTaxonomy(taxonomy.slug);
                                }
                            }}
                        >
                            {!hasQuery ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        const newTaxQuery = [...taxQuery];
                                        newTaxQuery.push({
                                            taxonomy: taxonomy.slug,
                                            terms: [],
                                            operator: 'IN'
                                        });
                                        setAttributes({ taxQuery: newTaxQuery });
                                        fetchTermsForTaxonomy(taxonomy.slug);
                                    }}
                                >
                                    {__('Add Filter', 'jankx')} {taxonomy.name}
                                </Button>
                            ) : (
                                currentQuery ? (
                                    <>
                                        <SelectControl
                                            label={__('Operator', 'jankx')}
                                            value={currentQuery.operator}
                                            options={[
                                                { label: __('IN (Include)', 'jankx'), value: 'IN' },
                                                { label: __('NOT IN (Exclude)', 'jankx'), value: 'NOT IN' },
                                                { label: __('AND (Must Have All)', 'jankx'), value: 'AND' },
                                                { label: __('EXISTS (Has Terms)', 'jankx'), value: 'EXISTS' },
                                                { label: __('NOT EXISTS (No Terms)', 'jankx'), value: 'NOT EXISTS' },
                                            ]}
                                            onChange={(value) => {
                                                const newTaxQuery = [...taxQuery];
                                                const targetQuery = newTaxQuery[existingQueryIndex];
                                                if (!targetQuery) {
                                                    return;
                                                }
                                                newTaxQuery[existingQueryIndex] = {
                                                    ...targetQuery,
                                                    operator: value as TaxQueryItem['operator'],
                                                };
                                                setAttributes({ taxQuery: newTaxQuery });
                                            }}
                                            help={__('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx')}
                                        />

                                        {/* Only show term selection if operator is not EXISTS/NOT EXISTS */}
                                        {!['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) ? (
                                            <>
                                                {terms ? (
                                                    <BaseControl
                                                        label={__('Select Terms', 'jankx')}
                                                        help={__('Select terms from dropdown', 'jankx')}
                                                    >
                                                        <FormTokenField
                                                            value={terms
                                                                .filter((term) => currentQuery.terms.includes(term.id))
                                                                .map((term) => term.name)}
                                                            suggestions={terms.map((term) => term.name)}
                                                            onChange={(tokens) => {
                                                                const selectedNames = normalizeTokens(tokens as TokenLike[]);
                                                                const selectedIds = selectedNames
                                                                    .map((tokenName) => {
                                                                        const term = terms.find((item) => item.name === tokenName);
                                                                        return term?.id ?? 0;
                                                                    })
                                                                    .filter((id) => id > 0);

                                                                const newTaxQuery = [...taxQuery];
                                                                const targetQuery = newTaxQuery[existingQueryIndex];
                                                                if (!targetQuery) {
                                                                    return;
                                                                }
                                                                newTaxQuery[existingQueryIndex] = {
                                                                    ...targetQuery,
                                                                    terms: selectedIds,
                                                                };
                                                                setAttributes({ taxQuery: newTaxQuery });
                                                            }}
                                                        />
                                                    </BaseControl>
                                                ) : (
                                                    <Spinner />
                                                )}
                                            </>
                                        ) : null}

                                        <Button
                                            isDestructive
                                            variant="secondary"
                                            onClick={() => {
                                                const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                                                setAttributes({ taxQuery: newTaxQuery });
                                            }}
                                            style={{ marginTop: '10px' }}
                                        >
                                            {__('Remove Filter', 'jankx')}
                                        </Button>
                                    </>
                                ) : null
                            )}
                        </PanelBody>
                    );
                }) : null}

                {/* Display Options */}
                <PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
                    {supportedOptions.includes('showFeaturedImage') && (
                        <>
                            <ToggleControl
                                label={__('Show Featured Image', 'jankx')}
                                checked={showFeaturedImage}
                                onChange={(value) => setAttributes({ showFeaturedImage: value })}
                                disabled={readOnlyOptions.includes('showFeaturedImage')}
                            />
                            {showFeaturedImage && (
                                <>
                                    {supportedOptions.includes('thumbnailPosition') && (
                                        <SelectControl
                                            label={__('Thumbnail Position', 'jankx')}
                                            value={thumbnailPosition || 'top'}
                                            options={[
                                                { label: __('Top (Default)', 'jankx'), value: 'top' },
                                                { label: __('Bottom', 'jankx'), value: 'bottom' },
                                                { label: __('Left', 'jankx'), value: 'left' },
                                                { label: __('Right', 'jankx'), value: 'right' },
                                            ]}
                                            onChange={(value) => setAttributes({ thumbnailPosition: value as DynamicDataLayoutAttributes['thumbnailPosition'] })}
                                            help={__('Choose where the featured image appears relative to the content.', 'jankx')}
                                        />
                                    )}
                                    <SelectControl
                                        label={__('Image Aspect Ratio', 'jankx')}
                                        value={imageRatioSelectValue}
                                        onChange={(value) => {
                                            if (value === 'custom') {
                                                setAttributes({ imageRatio: '' });
                                            } else {
                                                setAttributes({ imageRatio: value || '' });
                                            }
                                        }}
                                        help={__('Set the aspect ratio for featured images', 'jankx')}
                                        options={[
                                            { label: __('Default (3:2)', 'jankx'), value: '' },
                                            { label: __('16:9 (Landscape)', 'jankx'), value: '16/9' },
                                            { label: __('4:3 (Landscape)', 'jankx'), value: '4/3' },
                                            { label: __('21:9 (Ultra Wide)', 'jankx'), value: '21/9' },
                                            { label: __('1:1 (Square)', 'jankx'), value: '1/1' },
                                            { label: __('3:4 (Portrait)', 'jankx'), value: '3/4' },
                                            { label: __('2:3 (Portrait)', 'jankx'), value: '2/3' },
                                            { label: __('9:16 (Vertical)', 'jankx'), value: '9/16' },
                                            { label: __('Custom', 'jankx'), value: 'custom' },
                                        ]}
                                    />
                                    {isCustomImageRatio && (
                                        <TextControl
                                            label={__('Custom Ratio', 'jankx')}
                                            value={customImageRatioValue}
                                            onChange={(value) => {
                                                const ratioPattern = /^\d+\/\d+$/;
                                                if (!value || ratioPattern.test(value)) {
                                                    setAttributes({ imageRatio: value || '' });
                                                }
                                            }}
                                            help={__('Enter aspect ratio in format: width/height (e.g., 16/9, 3/4)', 'jankx')}
                                            placeholder="16/9"
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {supportedOptions.includes('showTitle') && (
                        <ToggleControl
                            label={__('Show Title', 'jankx')}
                            checked={showTitle}
                            onChange={(value) => setAttributes({ showTitle: value })}
                            disabled={readOnlyOptions.includes('showTitle')}
                        />
                    )}
                    {!isProduct && supportedOptions.includes('showExcerpt') && (
                        <>
                            <ToggleControl
                                label={__('Show Excerpt', 'jankx')}
                                checked={showExcerpt}
                                onChange={(value) => setAttributes({ showExcerpt: value })}
                                disabled={readOnlyOptions.includes('showExcerpt')}
                            />
                            {showExcerpt && (
                                <RangeControl
                                    label={__('Excerpt Length', 'jankx')}
                                    value={excerptLength}
                                    onChange={(value) => setAttributes({ excerptLength: value || 55 })}
                                    min={10}
                                    max={200}
                                    help={__('Number of characters to display in excerpt', 'jankx')}
                                />
                            )}
                        </>
                    )}
                    {!isProduct && supportedOptions.includes('showDate') && (
                        <ToggleControl
                            label={__('Show Date', 'jankx')}
                            checked={showDate}
                            onChange={(value) => setAttributes({ showDate: value })}
                            disabled={readOnlyOptions.includes('showDate')}
                        />
                    )}
                    {supportedOptions.includes('showAuthor') && (
                        <ToggleControl
                            label={__('Show Author', 'jankx')}
                            checked={showAuthor}
                            onChange={(value) => setAttributes({ showAuthor: value })}
                            disabled={readOnlyOptions.includes('showAuthor')}
                        />
                    )}
                    {isProduct && (
                        <>
                            <ToggleControl
                                label={__('Show Price', 'jankx')}
                                checked={showPrice}
                                onChange={(value) => setAttributes({ showPrice: value })}
                            />
                            <ToggleControl
                                label={__('Show Add To Cart Button', 'jankx')}
                                checked={showAddToCart}
                                onChange={(value) => setAttributes({ showAddToCart: value })}
                            />
                            <ToggleControl
                                label={__('Show Rating', 'jankx')}
                                checked={showRating}
                                onChange={(value) => setAttributes({ showRating: value })}
                            />
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Chỉ render wrapper, template block sẽ tự render items */}
                {(() => {
                    const blocks = useSelect(
                        (select) => select(blockEditorStore).getBlocks(clientId),
                        [clientId]
                    );
                    
                    const hasTemplateBlock = blocks && blocks.length > 0;
                    
                    if (!hasTemplateBlock) {
                        return (
                            <div style={{ 
                                padding: '1rem',
                                border: '2px dashed #0073aa',
                                borderRadius: '4px',
                                backgroundColor: '#f0f6fc',
                            }}>
                                <div style={{ 
                                    fontSize: '0.85rem',
                                    color: '#0073aa',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                }}>
                                    {__('Add Dynamic Data Template to define item layout', 'jankx')}
                                </div>
                                <InnerBlocks 
                                    allowedBlocks={['jankx/dynamic-data-template']}
                                    templateLock={false}
                                    renderAppender={InnerBlocks.ButtonBlockAppender}
                                />
                            </div>
                        );
                    }
                    
                    return (
                        <InnerBlocks 
                            allowedBlocks={['jankx/dynamic-data-template']}
                            templateLock={false}
                            renderAppender={InnerBlocks.DefaultBlockAppender}
                        />
                    );
                })()}
            </div>
        </>
    );
}

export default Edit;
