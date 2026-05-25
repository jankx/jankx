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
type TokenLike = string | { value: string;[key: string]: unknown };
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
    rest_base?: string;
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

interface SettingDefinition {
    name?: string;
    label?: string;
    type: 'text' | 'number' | 'range' | 'toggle' | 'select' | 'panel';
    default?: any;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
    help?: string;
    condition?: Record<string, any>;
    title?: string; // For panel
    initialOpen?: boolean; // For panel
    controls?: SettingDefinition[]; // For panel
}

interface LayoutInfo {
    name: string;
    title: string;
    postType?: string;
    supportedOptions?: string[];
    readOnlyOptions?: string[];
    settingsDefinition?: SettingDefinition[];
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

// ---- Helpers to guard runtime data coming from PHP/localize ----
const normalizeQueryPresets = (rawPresets: unknown): QueryPresetOption[] => {
    if (!Array.isArray(rawPresets)) {
        return [];
    }
    return (rawPresets as Array<Record<string, unknown>>)
        .map((preset) => {
            const value = typeof preset?.value === 'string' ? preset.value : '';
            const label = typeof preset?.label === 'string' ? preset.label : '';
            const postType = typeof preset?.postType === 'string' ? preset.postType : null;

            // help text must be string; fall back to errorMsg/message if provided
            let help: string | undefined;
            if (typeof preset?.help === 'string') {
                help = preset.help;
            } else if (typeof (preset as { errorMsg?: unknown })?.errorMsg === 'string') {
                help = (preset as { errorMsg: string }).errorMsg;
            } else if (typeof (preset as { message?: unknown })?.message === 'string') {
                help = (preset as { message: string }).message;
            }

            return {
                value,
                label,
                postType,
                help,
            };
        })
        .filter((preset) => preset.value.length > 0 && preset.label.length > 0);
};

const normalizeLayouts = (rawLayouts: unknown): LayoutInfo[] => {
    if (!Array.isArray(rawLayouts)) {
        return [];
    }

    return (rawLayouts as Array<Record<string, unknown>>)
        .map((layout) => {
            const name = typeof layout?.name === 'string' ? layout.name : '';
            const title = typeof layout?.title === 'string' ? layout.title : name;
            const supportedOptions = Array.isArray(layout?.supportedOptions)
                ? (layout.supportedOptions as string[])
                : undefined;
            const readOnlyOptions = Array.isArray(layout?.readOnlyOptions)
                ? (layout.readOnlyOptions as string[])
                : undefined;
            const settingsDefinition = Array.isArray(layout?.settingsDefinition)
                ? (layout.settingsDefinition as SettingDefinition[])
                : undefined;

            return {
                name,
                title,
                supportedOptions,
                readOnlyOptions,
                settingsDefinition,
            };
        })
        .filter((layout) => layout.name.length > 0 && layout.title.length > 0);
};

const normalizeLayoutsData = (raw: unknown): LayoutsData => {
    if (!raw || typeof raw !== 'object') {
        return {
            layoutsByPostType: {},
            commonLayouts: [],
        };
    }

    const obj = raw as Record<string, unknown>;
    const commonLayouts = normalizeLayouts(obj.commonLayouts);

    const layoutsByPostType: Record<string, LayoutInfo[]> = {};
    if (obj.layoutsByPostType && typeof obj.layoutsByPostType === 'object') {
        Object.entries(obj.layoutsByPostType as Record<string, unknown>).forEach(([postType, layouts]) => {
            const normalized = normalizeLayouts(layouts);
            if (normalized.length > 0) {
                layoutsByPostType[postType] = normalized;
            }
        });
    }

    return {
        layoutsByPostType,
        commonLayouts,
    };
};

const normalizeOrderByOptions = (raw: unknown, fallback: OrderByOption[]): OrderByOption[] => {
    if (!Array.isArray(raw)) {
        return fallback;
    }

    const normalized = (raw as Array<Record<string, unknown>>)
        .map((item) => {
            const value = typeof item?.value === 'string' ? item.value : '';
            const label = typeof item?.label === 'string' ? item.label : '';
            const postType = typeof item?.postType === 'string' ? item.postType : null;
            const metaKey = typeof item?.metaKey === 'string' ? item.metaKey : undefined;
            return { value, label, postType, metaKey };
        })
        .filter((item) => item.value.length > 0 && item.label.length > 0);

    return normalized.length > 0 ? normalized : fallback;
};

const normalizeOrderOptions = (raw: unknown, fallback: OrderOption[]): OrderOption[] => {
    if (!Array.isArray(raw)) {
        return fallback;
    }

    const normalized = (raw as Array<Record<string, unknown>>)
        .map((item) => {
            const value = item?.value === 'ASC' || item?.value === 'DESC' ? item.value : null;
            const label = typeof item?.label === 'string' ? item.label : '';
            return value ? { value, label } : null;
        })
        .filter((item): item is OrderOption => !!item && item.label.length > 0);

    return normalized.length > 0 ? normalized : fallback;
};

const toSafeHelpText = (input: unknown, fallback: string): string => {
    if (typeof input === 'string') {
        return input;
    }
    if (input && typeof input === 'object') {
        const message = (input as { errorMsg?: unknown }).errorMsg;
        const message2 = (input as { message?: unknown }).message;
        if (typeof message === 'string') {
            return message;
        }
        if (typeof message2 === 'string') {
            return message2;
        }
    }
    return fallback;
};

declare global {
    interface Window extends WordPressWindow { }
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
    useMultiPostType?: boolean;
    postTypes?: string[];
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
    spaceBetween?: number;
}

interface EditProps {
    attributes: DynamicDataLayoutAttributes;
    setAttributes: (attrs: Partial<DynamicDataLayoutAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {

    const {
        queryPreset = 'custom',
        postType = 'post',
        useMultiPostType = false,
        postTypes = [],
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
        spaceBetween = 16,
    } = attributes;

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);

    const [authors, setAuthors] = useState<AuthorItem[]>([]);

    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            // Generate unique ID from clientId hash
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const newQueryId = String(Math.abs(hash));
            setAttributes({ queryId: newQueryId });
        }
    }, [queryId, clientId, setAttributes]);

    // Reset queryPreset if current preset is not valid for the current postType
    useEffect(() => {
        const allPresets: QueryPresetOption[] = window.jankxQueryOptions?.queryPresets || [];

        const validPresets = allPresets.filter((preset: QueryPresetOption) =>
            !preset.postType || preset.postType === postType
        );

        const currentPresetValid = validPresets.some((preset: QueryPresetOption) => preset.value === queryPreset);

        if (!currentPresetValid && validPresets.length > 0 && validPresets[0]?.value) {
            // Reset to first valid preset
            const newPreset = validPresets[0].value as QueryPreset;
            setAttributes({ queryPreset: newPreset });
        }
    }, [postType, queryPreset, setAttributes]);

    // Fetch taxonomies and authors when postType changes
    useEffect(() => {

        const fetchTaxonomiesAndAuthors = async () => {

            if (!window.wp?.apiFetch) {
                return;
            }

            try {
                const taxonomiesData = await window.wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                }) as Record<string, TaxonomyItem> | undefined;

                if (!isMountedRef.current) {
                    return;
                }

                const taxArray = Object.values(taxonomiesData || {}).filter(
                    (item): item is TaxonomyItem => typeof item?.slug === 'string' && typeof item?.name === 'string'
                ).map(item => ({
                    slug: item.slug,
                    name: item.name,
                    rest_base: item.rest_base
                }));
                setTaxonomies(taxArray);

                const authorsData = await window.wp.apiFetch({
                    path: '/wp/v2/users?who=authors&per_page=100',
                }) as Array<Record<string, unknown>> | undefined;

                if (!isMountedRef.current) {
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

                setAuthors(normalizedAuthors);
            } catch (error) {

                if (!isMountedRef.current) {
                    return;
                }

                setTaxonomies([]);
                setAuthors([]);
            }
        };

        fetchTaxonomiesAndAuthors();
    }, [postType]);

    // Function to fetch terms for a specific taxonomy
    const fetchTermsForTaxonomy = useCallback(async (taxonomySlug: string) => {

        if (taxonomyTerms[taxonomySlug]) {
            return; // Already loaded
        }

        if (!window.wp?.apiFetch) {
            return;
        }

        const taxonomy = taxonomies.find(t => t.slug === taxonomySlug);
        const restBase = taxonomy?.rest_base || taxonomySlug;

        try {
            const termsResponse = await window.wp.apiFetch({
                path: `/wp/v2/${restBase}?per_page=100&orderby=name&order=asc`,
            }) as Array<Record<string, unknown>> | undefined;

            if (!isMountedRef.current) {
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


            setTaxonomyTerms(prev => {
                const newState = {
                    ...prev,
                    [taxonomySlug]: normalizedTerms,
                };
                return newState;
            });
        } catch (error) {

            if (!isMountedRef.current) {
                return;
            }

            setTaxonomyTerms(prev => {
                const newState = {
                    ...prev,
                    [taxonomySlug]: [],
                };
                return newState;
            });
        }
    }, [taxonomyTerms, taxonomies]);

    const styleColor = attributes.style && attributes.style.color ? attributes.style.color : undefined;
    const backgroundColorSlug = attributes.backgroundColor || styleColor?.background?.slug;
    const textColorSlug = attributes.textColor || styleColor?.text?.slug;
    const gradient = attributes.gradient || styleColor?.gradient;
    const hasBackground = !!(styleColor?.background || gradient || backgroundColorSlug);
    const hasTextColor = !!(styleColor?.text || textColorSlug);

    const editorClassName = [
        'dynamic-data-layout',
        `dynamic-data-layout--${layout}`,
        `columns-${columns}`,
        `columns-tablet-${columnsTablet}`,
        `columns-mobile-${columnsMobile}`,
        backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined,
        textColorSlug ? `has-${textColorSlug}-color` : undefined,
        hasBackground ? 'has-background' : undefined,
        hasTextColor ? 'has-text-color' : undefined,
    ].filter(Boolean).join(' ');

    const editorStyle: CSSProperties = {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
    } as CSSProperties;

    if (styleColor) {
        const bg = typeof styleColor.background === 'object' ? styleColor.background?.color : styleColor.background;
        const text = typeof styleColor.text === 'object' ? styleColor.text?.color : styleColor.text;
        const grad = typeof styleColor.gradient === 'object' ? styleColor.gradient?.gradient : styleColor.gradient;
        if (bg) editorStyle.backgroundColor = bg as any;
        if (text) editorStyle.color = text as any;
        if (grad) editorStyle.background = grad as any;
    }

    const blockProps = useBlockProps({
        className: editorClassName,
        style: editorStyle,
    });

    const resolvedResponsiveColumns = responsiveColumns && typeof responsiveColumns === 'object'
        ? responsiveColumns
        : { desktop: columns, tablet: columnsTablet, mobile: columnsMobile };

    useEffect(() => {
        const expected = {
            desktop: columns,
            tablet: columnsTablet,
            mobile: columnsMobile,
        };

        const needsUpdate =
            !responsiveColumns ||
            responsiveColumns.desktop !== expected.desktop ||
            responsiveColumns.tablet !== expected.tablet ||
            responsiveColumns.mobile !== expected.mobile;

        if (needsUpdate) {
            setAttributes({ responsiveColumns: expected });
        }
    }, [columns, columnsTablet, columnsMobile, responsiveColumns, setAttributes]);

    // Get available post types
    const wpPostTypes = useSelect((select: WordPressSelect) => {
        const { getPostTypes } = select('core');
        const types = getPostTypes({ per_page: -1 }) || [];
        return types;
    }, []);

    const publicPostTypes: Array<{ slug: string; name: string }> = Array.isArray((window as any).jankxPublicPostTypes)
        ? (window as any).jankxPublicPostTypes
        : [];

    // Get layouts data from PHP (normalize to avoid objects being rendered)
    const layoutsData: LayoutsData = normalizeLayoutsData(window.jankxDynamicDataLayouts);

    const postTypeOptions = (() => {
        const map = new Map<string, string>();
        // From core store (REST-visible types)
        wpPostTypes
            .filter((type: PostType) => type.slug !== 'attachment')
            .forEach((type: PostType) => {
                if (!map.has(type.slug)) {
                    map.set(type.slug, type.name);
                }
            });
        // From PHP localized public post types (includes non-REST CPTs like product/tour)
        publicPostTypes
            .filter((pt) => pt.slug !== 'attachment')
            .forEach((pt) => {
                if (!map.has(pt.slug)) {
                    map.set(pt.slug, pt.name || pt.slug);
                }
            });
        // Fallback: ensure keys present in layouts data are also available
        const layoutPostTypes = Object.keys((layoutsData && layoutsData.layoutsByPostType) || {});
        layoutPostTypes
            .filter((slug) => slug !== 'attachment')
            .forEach((slug) => {
                if (!map.has(slug)) {
                    map.set(slug, slug);
                }
            });
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    })();

    // Get available layouts for current post type
    const availableLayouts = useMemo(() => {
        const layouts: Array<{ name: string; title: string; supportedOptions?: string[]; readOnlyOptions?: string[]; settingsDefinition?: SettingDefinition[] }> = [];

        // Add common layouts
        if (layoutsData.commonLayouts) {
            layoutsData.commonLayouts.forEach((layoutInfo: LayoutInfo) => {
                const layoutItem: { name: string; title: string; supportedOptions?: string[]; readOnlyOptions?: string[]; settingsDefinition?: SettingDefinition[] } = {
                    name: layoutInfo.name || '',
                    title: layoutInfo.title || layoutInfo.name || '',
                };
                if (layoutInfo.supportedOptions) {
                    layoutItem.supportedOptions = layoutInfo.supportedOptions;
                }
                if (layoutInfo.readOnlyOptions) {
                    layoutItem.readOnlyOptions = layoutInfo.readOnlyOptions;
                }
                if (layoutInfo.settingsDefinition) {
                    layoutItem.settingsDefinition = layoutInfo.settingsDefinition;
                }
                layouts.push(layoutItem);
            });
        }

        // Add post type specific layouts
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: LayoutInfo) => {
                const layoutItem: { name: string; title: string; supportedOptions?: string[]; readOnlyOptions?: string[]; settingsDefinition?: SettingDefinition[] } = {
                    name: layoutInfo.name || '',
                    title: layoutInfo.title || layoutInfo.name || '',
                };
                if (layoutInfo.supportedOptions) {
                    layoutItem.supportedOptions = layoutInfo.supportedOptions;
                }
                if (layoutInfo.readOnlyOptions) {
                    layoutItem.readOnlyOptions = layoutInfo.readOnlyOptions;
                }
                if (layoutInfo.settingsDefinition) {
                    layoutItem.settingsDefinition = layoutInfo.settingsDefinition;
                }
                layouts.push(layoutItem);
            });
        }

        return layouts;
    }, [postType, layoutsData]);

    // Layout options for SelectControl
    const layoutOptions = useMemo(() => {
        const options = availableLayouts.map((layoutInfo) => ({
            label: layoutInfo.title,
            value: layoutInfo.name,
        }));
        return options;
    }, [availableLayouts]);

    // Get current layout's supported options
    const currentLayout = availableLayouts.find((l) => l.name === layout);

    // Define default supported options for standard layouts
    const standardLayoutDefaults: Record<string, string[]> = {
        'grid': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
        'card': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
        'carousel': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
        'list': ['showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
    };

    const supportedOptions: string[] = currentLayout?.supportedOptions || standardLayoutDefaults[layout] || [];
    const readOnlyOptions: string[] = currentLayout?.readOnlyOptions || [];
    const settingsDefinition: SettingDefinition[] = currentLayout?.settingsDefinition || [];

    // Check if post type is product
    const isProduct = postType === 'product';
    const hasCommerceFeatures = ['product', 'tour'].includes(postType);

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

    // Helper to render dynamic settings
    const renderSettingsControl = (setting: SettingDefinition, index: number): JSX.Element | null => {
        // Check conditions
        if (setting.condition) {
            const shouldRender = Object.entries(setting.condition).every(([key, value]) => {
                return (attributes as any)[key] === value;
            });
            if (!shouldRender) {
                return null;
            }
        }

        const commonProps = {
            key: index,
            label: setting.label,
            help: setting.help,
        };

        switch (setting.type) {
            case 'text':
                return (
                    <TextControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default || ''}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'number':
                return (
                    <TextControl
                        {...commonProps}
                        type="number"
                        value={(attributes as any)[setting.name!] || setting.default || ''}
                        onChange={(value) => setAttributes({ [setting.name!]: Number(value) })}
                    />
                );
            case 'range':
                return (
                    <RangeControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                    />
                );
            case 'toggle':
                return (
                    <ToggleControl
                        {...commonProps}
                        checked={(attributes as any)[setting.name!] ?? setting.default}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'select':
                return (
                    <SelectControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default}
                        options={setting.options || []}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'panel':
                return (
                    <PanelBody title={setting.title} initialOpen={setting.initialOpen} key={index}>
                        {setting.controls?.map((childSetting, childIndex) =>
                            renderSettingsControl(childSetting, childIndex)
                        )}
                    </PanelBody>
                );
            default:
                return null;
        }
    };

    // Pre-compute orderBy options outside conditional render to avoid React hooks error
    const orderByOptions = useMemo(() => {
        const fallback: OrderByOption[] = [
            { label: __('Date', 'jankx'), value: 'date' },
            { label: __('Title', 'jankx'), value: 'title' },
            { label: __('Modified', 'jankx'), value: 'modified' },
            { label: __('Menu Order', 'jankx'), value: 'menu_order' },
        ];
        const allOrderByOptions: OrderByOption[] = normalizeOrderByOptions(window.jankxQueryOptions?.orderBy, fallback);
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
        return filtered;
    }, [postType]);

    // Pre-compute order options outside conditional render
    const orderOptions = useMemo(() => {
        const defaultOptions: OrderOption[] = [
            { label: __('Descending', 'jankx'), value: 'DESC' },
            { label: __('Ascending', 'jankx'), value: 'ASC' },
        ];
        const options = normalizeOrderOptions(window.jankxQueryOptions?.order, defaultOptions);
        return options;
    }, []);

    // Pre-compute query preset options outside JSX
    const normalizedPresets = useMemo<QueryPresetOption[]>(() => normalizeQueryPresets(window.jankxQueryOptions?.queryPresets), []);

    const queryPresetOptions = useMemo(() => {
        const allPresets: QueryPresetOption[] = normalizedPresets;
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
        return filtered;
    }, [postType, normalizedPresets]);

    // Pre-compute query preset help text outside JSX
    const queryPresetHelp = useMemo(() => {
        const currentPreset = normalizedPresets.find((p: QueryPresetOption) => p.value === queryPreset);
        const helpText = toSafeHelpText(currentPreset?.help, __('Select a query preset', 'jankx'));
        return helpText;
    }, [queryPreset, normalizedPresets]);

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={queryPresetOptions}
                        onChange={(value) => {
                            setAttributes({ queryPreset: value as QueryPreset });
                        }}
                        help={queryPresetHelp}
                    />

                    {!useMultiPostType ? (
                        <SelectControl
                            label={__('Post Type', 'jankx')}
                            value={postType}
                            options={postTypeOptions}
                            onChange={(value) => {
                                setAttributes({ postType: value, useMultiPostType: false });
                            }}
                            help={queryPreset === 'default' ? __('Select post type for the main query', 'jankx') : undefined}
                        />
                    ) : null}

                    <ToggleControl
                        label={__('Multi Post Type', 'jankx')}
                        checked={useMultiPostType}
                        onChange={(value) => {
                            setAttributes({ useMultiPostType: value });
                            if (!value) {
                                // When turning off multi, keep first selected as single postType
                                const first = Array.isArray(postTypes) && postTypes.length > 0 ? postTypes[0] : postType;
                                setAttributes({ postType: first });
                            }
                        }}
                        help={__('Enable selecting multiple post types', 'jankx')}
                    />
                    {useMultiPostType ? (
                        <BaseControl
                            label={__('Post Types (Multiple)', 'jankx')}
                            help={__('Select multiple post types to include', 'jankx')}
                        >
                            <FormTokenField
                                value={postTypes.map((slug) => {
                                    const found = postTypeOptions.find((opt) => opt.value === slug);
                                    return found?.label || slug;
                                })}
                                suggestions={postTypeOptions.map((opt) => opt.label)}
                                onChange={(tokens) => {
                                    const names = normalizeTokens(tokens as TokenLike[]);
                                    const selectedSlugs = names
                                        .map((name) => {
                                            const opt = postTypeOptions.find((o) => o.label === name);
                                            return opt?.value || '';
                                        })
                                        .filter((slug) => slug.length > 0);
                                    setAttributes({ postTypes: selectedSlugs });
                                    if (selectedSlugs.length > 0) {
                                        setAttributes({ postType: selectedSlugs[0] });
                                    }
                                }}
                            />
                        </BaseControl>
                    ) : null}

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
                        if (!shouldRender) {
                            return null;
                        }
                        return (
                            <>
                                <SelectControl
                                    label={__('Order By', 'jankx')}
                                    value={orderBy}
                                    options={orderByOptions}
                                    onChange={(value) => {
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

                                        setAttributes(updates);
                                    }}
                                    help={__('Sort posts by which criteria', 'jankx')}
                                />
                                <SelectControl
                                    label={__('Order', 'jankx')}
                                    value={order as 'ASC' | 'DESC'}
                                    options={orderOptions}
                                    onChange={(value) => {
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
                    <RangeControl
                        label={__('Space Between', 'jankx')}
                        value={spaceBetween}
                        onChange={(value) => setAttributes({ spaceBetween: value || 0 })}
                        min={0}
                        max={100}
                        help={__('Space between items in pixels', 'jankx')}
                    />
                </PanelBody>

                {/* Layout Specific Settings (Dynamic) */}
                {settingsDefinition.length > 0 && (
                    <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={true}>
                        {settingsDefinition.map((setting, index) => renderSettingsControl(setting, index))}
                    </PanelBody>
                )}

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
                                    <SelectControl
                                        label={__('Thumbnail Position', 'jankx')}
                                        value={thumbnailPosition}
                                        options={[
                                            { label: __('Top', 'jankx'), value: 'top' },
                                            { label: __('Bottom', 'jankx'), value: 'bottom' },
                                            { label: __('Left', 'jankx'), value: 'left' },
                                            { label: __('Right', 'jankx'), value: 'right' },
                                        ]}
                                        onChange={(value) => setAttributes({ thumbnailPosition: value as 'top' | 'bottom' | 'left' | 'right' })}
                                        help={__('Position of the featured image relative to content', 'jankx')}
                                    />
                                    {isCustomImageRatio ? (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '1em' }}>
                                            <div style={{ flex: 1 }}>
                                                <SelectControl
                                                    label={__('Image Ratio', 'jankx')}
                                                    value={imageRatioSelectValue}
                                                    options={[
                                                        { label: __('Original', 'jankx'), value: '' },
                                                        { label: '16:9', value: '16/9' },
                                                        { label: '4:3', value: '4/3' },
                                                        { label: '1:1', value: '1/1' },
                                                        { label: '3:2', value: '3/2' },
                                                        { label: '3:4', value: '3/4' },
                                                        { label: '9:16', value: '9/16' },
                                                        { label: __('Custom', 'jankx'), value: 'custom' },
                                                    ]}
                                                    onChange={(value) => {
                                                        if (value === 'custom') {
                                                            setAttributes({ imageRatio: '16/9' });
                                                        } else {
                                                            setAttributes({ imageRatio: value });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <TextControl
                                                    label={__('Custom Ratio', 'jankx')}
                                                    value={customImageRatioValue}
                                                    onChange={(value) => {
                                                        const ratioPattern = /^\d+\/\d+$/;
                                                        if (!value || ratioPattern.test(value)) {
                                                            setAttributes({ imageRatio: value || '' });
                                                        }
                                                    }}
                                                    placeholder="16/9"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <SelectControl
                                            label={__('Image Ratio', 'jankx')}
                                            value={imageRatioSelectValue}
                                            options={[
                                                { label: __('Original', 'jankx'), value: '' },
                                                { label: '16:9', value: '16/9' },
                                                { label: '4:3', value: '4/3' },
                                                { label: '1:1', value: '1/1' },
                                                { label: '3:2', value: '3/2' },
                                                { label: '3:4', value: '3/4' },
                                                { label: '9:16', value: '9/16' },
                                                { label: __('Custom', 'jankx'), value: 'custom' },
                                            ]}
                                            onChange={(value) => {
                                                if (value === 'custom') {
                                                    setAttributes({ imageRatio: '16/9' });
                                                } else {
                                                    setAttributes({ imageRatio: value });
                                                }
                                            }}
                                            help={__('Aspect ratio for the featured image', 'jankx')}
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

                    {hasCommerceFeatures && (
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
                                    allowedBlocks={['jankx/dynamic-data-template', 'core/heading']}
                                    templateLock={false}
                                    renderAppender={InnerBlocks.ButtonBlockAppender}
                                />
                            </div>
                        );
                    }

                    return (
                        <InnerBlocks
                            allowedBlocks={['jankx/dynamic-data-template', 'core/heading']}
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
