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

function stableStringify(value: unknown): string {
    const seen = new WeakSet<object>();
    const normalize = (v: unknown): unknown => {
        if (v === null || typeof v !== 'object') {
            return v;
        }
        if (seen.has(v as object)) {
            return null;
        }
        seen.add(v as object);

        if (Array.isArray(v)) {
            return v.map(normalize);
        }

        const obj = v as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        Object.keys(obj)
            .sort()
            .forEach((k) => {
                out[k] = normalize(obj[k]);
            });
        return out;
    };

    try {
        return JSON.stringify(normalize(value));
    } catch (e) {
        return '';
    }
}

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
    help?: string | undefined;
}

interface OrderByOption {
    value: string;
    label: string;
    postType?: string | null;
    metaKey?: string | undefined;
}

interface OrderOption {
    value: 'ASC' | 'DESC';
    label: string;
}

interface QueryOptions {
    queryPresets?: QueryPresetOption[];
    orderBy?: OrderByOption[];
    order?: OrderOption[];
}

interface LayoutInfo {
    name: string;
    title: string;
    postType?: string;
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
    jankxDynamicSsrLayouts?: LayoutsData;
}

interface WordPressSelect {
    (store: 'core'): {
        getPostTypes: (options: { per_page: number }) => PostType[];
    };
}

declare global {
    interface Window extends WordPressWindow { }
}

const normalizeQueryPresets = (rawPresets: unknown): QueryPresetOption[] => {
    if (!Array.isArray(rawPresets)) {
        return [];
    }
    return (rawPresets as Array<Record<string, unknown>>)
        .map((preset) => {
            const value = typeof preset?.value === 'string' ? preset.value : '';
            const label = typeof preset?.label === 'string' ? preset.label : '';
            const postType = typeof preset?.postType === 'string' ? preset.postType : null;
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
            return {
                name,
                title,
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

const normalizeTokens = (tokens: TokenLike[]): string[] => {
    return tokens.map((token) => {
        if (typeof token === 'string') {
            return token;
        }
        if (typeof token === 'object' && token !== null && typeof token.value === 'string') {
            return token.value;
        }
        return String(token);
    });
};

type QueryPreset = 'default' | 'related' | 'custom' | 'on-sale' | 'featured' | 'related-products' | 'best-sellers' | 'top-rated' | 'upsells' | 'new-arrivals' | 'recently-viewed';

interface DynamicSsrLayoutAttributes {
    queryPreset: QueryPreset;
    postType: string;
    useMultiPostType: boolean;
    postTypes: string[];
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    responsiveColumns?: { desktop: number; tablet: number; mobile: number };
    includeStickyPosts: boolean;
    orderBy: string;
    order: string;
    queryId?: string;
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
    // Pagination specific attributes
    enablePagination?: boolean;
    paginationStyle?: 'numbers' | 'simple' | 'arrows' | 'load-more';
    paginationAlignment?: 'left' | 'center' | 'right';
    showPaginationNumbers?: boolean;
    paginationPrevText?: string;
    paginationNextText?: string;
}

interface EditProps {
    attributes: DynamicSsrLayoutAttributes;
    setAttributes: (attrs: Partial<DynamicSsrLayoutAttributes>) => void;
    clientId: string;
    isSelected?: boolean;
}

function Edit({ attributes, setAttributes, clientId, isSelected = false }: EditProps) {
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
        enablePagination = false,
        paginationStyle = 'numbers',
        paginationAlignment = 'center',
        showPaginationNumbers = true,
        paginationPrevText = '',
        paginationNextText = '',
    } = attributes;

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});

    const [previewHtml] = useState<string>('');
    const [loadingPreview] = useState<boolean>(false);

    const innerBlocks = useSelect(
        (select) => (select as any)(blockEditorStore).getBlocks(clientId),
        [clientId]
    );

    const templateBlockAttrs = useMemo(() => {
        if (!Array.isArray(innerBlocks)) {
            return null;
        }
        const templateBlock = innerBlocks.find((b: any) => b?.name === 'jankx/dynamic-ssr-template');
        if (!templateBlock) {
            return null;
        }
        return templateBlock.attributes || null;
    }, [innerBlocks]);

    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const newQueryId = String(Math.abs(hash));
            setAttributes({ queryId: newQueryId });
        }
    }, [queryId, clientId, setAttributes]);

    // Fetch taxonomies and authors when postType changes
    useEffect(() => {
        const fetchTaxonomiesAndAuthors = async () => {
            if (!window.wp?.apiFetch) {
                return;
            }

            try {
                const taxonomiesData = await window.wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                }) as unknown as Record<string, TaxonomyItem>;

                const taxArray = Object.values(taxonomiesData || {}).filter(
                    (item): item is TaxonomyItem => typeof item?.slug === 'string' && typeof item?.name === 'string'
                );
                setTaxonomies(taxArray);

                const authorsData = await window.wp.apiFetch({
                    path: '/wp/v2/users?who=authors&per_page=100',
                }) as Array<Record<string, unknown>> | undefined;

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
                setTaxonomies([]);
                setAuthors([]);
            }
        };

        fetchTaxonomiesAndAuthors();
    }, [postType]);

    // Function to fetch terms for a specific taxonomy
    const fetchTermsForTaxonomy = useCallback(async (taxonomy: string) => {
        if (taxonomyTerms[taxonomy]) {
            return;
        }

        if (!window.wp?.apiFetch) {
            return;
        }

        try {
            const termsResponse = await window.wp.apiFetch({
                path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
            }) as Array<Record<string, unknown>> | undefined;

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

            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: normalizedTerms,
            }));
        } catch (error) {
            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: [],
            }));
        }
    }, [taxonomyTerms]);

    const blockProps = useBlockProps({
        className: [
            'dynamic-ssr-layout',
            `dynamic-ssr-layout--${layout}`,
            `view-type-layout-${layout}`,
            `columns-${columns}`,
            `columns-tablet-${columnsTablet}`,
            `columns-mobile-${columnsMobile}`,
        ].join(' '),
    });

    useEffect(() => { }, []);

    const resolvedResponsiveColumns = (responsiveColumns && typeof responsiveColumns === 'object')
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
            (responsiveColumns as any).desktop !== expected.desktop ||
            (responsiveColumns as any).tablet !== expected.tablet ||
            (responsiveColumns as any).mobile !== expected.mobile;
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

    // Get layouts data from PHP
    const layoutsData: LayoutsData = normalizeLayoutsData(window.jankxDynamicSsrLayouts);

    const postTypeOptions = (() => {
        const map = new Map<string, string>();
        wpPostTypes
            .filter((type: PostType) => type.slug !== 'attachment')
            .forEach((type: PostType) => {
                if (!map.has(type.slug)) {
                    map.set(type.slug, type.name);
                }
            });
        publicPostTypes
            .filter((pt) => pt.slug !== 'attachment')
            .forEach((pt) => {
                if (!map.has(pt.slug)) {
                    map.set(pt.slug, pt.name || pt.slug);
                }
            });
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
        const map = new Map<string, LayoutInfo>();
        (layoutsData.commonLayouts || []).forEach((layoutInfo: LayoutInfo) => {
            if (layoutInfo?.name) {
                map.set(layoutInfo.name, layoutInfo);
            }
        });
        const specific = (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) ? layoutsData.layoutsByPostType[postType] : [];
        specific.forEach((layoutInfo: LayoutInfo) => {
            if (layoutInfo?.name) {
                map.set(layoutInfo.name, layoutInfo);
            }
        });
        return Array.from(map.values());
    }, [postType, layoutsData]);

    const layoutOptions = useMemo(() => {
        const options = availableLayouts.map((layoutInfo) => ({
            label: layoutInfo.title,
            value: layoutInfo.name,
        }));
        if (options.length === 0) {
            return [
                { label: __('Grid', 'jankx'), value: 'grid' },
                { label: __('List', 'jankx'), value: 'list' },
                { label: __('Card', 'jankx'), value: 'card' },
                { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                { label: __('Default', 'jankx'), value: 'default' },
            ];
        }
        return options;
    }, [availableLayouts]);

    // Pre-compute orderBy options
    const orderByOptions = useMemo(() => {
        const fallback: OrderByOption[] = [
            { label: __('Date', 'jankx'), value: 'date' },
            { label: __('Title', 'jankx'), value: 'title' },
            { label: __('Modified', 'jankx'), value: 'modified' },
            { label: __('Menu Order', 'jankx'), value: 'menu_order' },
        ];
        const allOrderByOptions: OrderByOption[] = normalizeOrderByOptions(window.jankxQueryOptions?.orderBy, fallback);
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

    // Pre-compute order options
    const orderOptions = useMemo(() => {
        const defaultOptions: OrderOption[] = [
            { label: __('Descending', 'jankx'), value: 'DESC' },
            { label: __('Ascending', 'jankx'), value: 'ASC' },
        ];
        const options = normalizeOrderOptions(window.jankxQueryOptions?.order, defaultOptions);
        return options;
    }, []);

    // Pre-compute query preset options
    const normalizedPresets = useMemo<QueryPresetOption[]>(() => normalizeQueryPresets(window.jankxQueryOptions?.queryPresets), []);

    const queryPresetOptions = useMemo(() => {
        const allPresets: QueryPresetOption[] = normalizedPresets;
        const filtered = allPresets
            .filter((preset: QueryPresetOption) =>
                !preset.postType || preset.postType === postType
            );
        return filtered.map((preset: QueryPresetOption) => ({
            label: preset.label,
            value: preset.value,
            help: preset.help,
        }));
    }, [postType, normalizedPresets]);


    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value: string) => setAttributes({ postType: value })}
                    />
                    <SelectControl
                        label={__('Layout Type', 'jankx')}
                        value={layout}
                        options={layoutOptions}
                        onChange={(value: string) => setAttributes({ layout: value })}
                    />
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value?: number) => setAttributes({ postsPerPage: value ?? 10 })}
                        min={1}
                        max={50}
                    />
                    <ResponsiveControl
                        label={__('Columns', 'jankx')}
                        values={resolvedResponsiveColumns as ResponsiveValue}
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
                            mobile: __('Number of columns on mobile (<768px)', 'jankx'),
                        }}
                    />
                </PanelBody>

                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={queryPresetOptions}
                        onChange={(value: string) => setAttributes({ queryPreset: value as QueryPreset })}
                        help={(() => {
                            const selected = queryPresetOptions.find(opt => opt.value === queryPreset);
                            return selected?.help;
                        })()}
                    />

                    {!useMultiPostType ? (
                        <SelectControl
                            label={__('Post Type', 'jankx')}
                            value={postType}
                            options={postTypeOptions}
                            onChange={(value: string) => {
                                setAttributes({ postType: value, useMultiPostType: false });
                            }}
                            help={queryPreset === 'default' ? __('Select post type for the main query', 'jankx') : undefined}
                        />
                    ) : null}

                    <ToggleControl
                        label={__('Multi Post Type', 'jankx')}
                        checked={useMultiPostType}
                        onChange={(value: boolean) => {
                            setAttributes({ useMultiPostType: value });
                            if (!value) {
                                // When turning off multi, keep first selected as single postType
                                const first = Array.isArray(postTypes) && postTypes.length > 0 ? postTypes[0] : postType;
                                if (first) {
                                    setAttributes({ postType: first });
                                }
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
                                    if (selectedSlugs.length > 0 && selectedSlugs[0]) {
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
                        onChange={(value?: number) => setAttributes({ postsPerPage: value ?? 10 })}
                        min={1}
                        max={50}
                        help={__('Number of posts to display', 'jankx')}
                    />

                    {postType === 'post' ? (
                        <ToggleControl
                            label={__('Include Sticky Posts', 'jankx')}
                            checked={includeStickyPosts}
                            onChange={(value: boolean) => setAttributes({ includeStickyPosts: value })}
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
                                    onChange={(value: string) => {
                                        const allOrderByOptions: OrderByOption[] = window.jankxQueryOptions?.orderBy || [];
                                        const selectedOption = allOrderByOptions.find((opt: OrderByOption) => opt.value === value);

                                        // Auto-set metaKey if option has metaKey property
                                        const updates: Partial<DynamicSsrLayoutAttributes> = { orderBy: value };
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
                                    value={order}
                                    options={orderOptions}
                                    onChange={(value: string) => {
                                        setAttributes({ order: value as 'ASC' | 'DESC' });
                                    }}
                                />
                            </>
                        );
                    })()}
                </PanelBody>

                {/* Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' ? (
                    <PanelBody title={__('Query Parameters', 'jankx')} initialOpen={false}>
                        <RangeControl
                            label={__('Offset', 'jankx')}
                            value={offset}
                            onChange={(value?: number) => setAttributes({ offset: value ?? 0 })}
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
                                    onChange={(value: string) => setAttributes({ metaKey: value })}
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
                                            { label: 'BINARY', value: 'BINARY' },
                                            { label: 'CHAR', value: 'CHAR' },
                                            { label: 'DATE', value: 'DATE' },
                                            { label: 'DATETIME', value: 'DATETIME' },
                                            { label: 'DECIMAL', value: 'DECIMAL' },
                                            { label: 'SIGNED', value: 'SIGNED' },
                                            { label: 'TIME', value: 'TIME' },
                                            { label: 'UNSIGNED', value: 'UNSIGNED' },
                                        ]}
                                        onChange={(value: string) => setAttributes({ metaType: value })}
                                        help={__('Meta field type for proper sorting', 'jankx')}
                                    />
                                ) : null}
                            </>
                        ) : null}
                    </PanelBody>
                ) : null}

                {queryPreset === 'custom' ? (
                    <PanelBody title={__('Advanced Query Parameters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Query ID', 'jankx')}
                            value={customQueryId}
                            onChange={(value) => setAttributes({ customQueryId: value })}
                        />
                        <BaseControl
                            label={__('Post Status', 'jankx')}
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
                            value={String(postParent)}
                            onChange={(value) => setAttributes({ postParent: parseInt(value) || 0 })}
                        />
                        <TextControl
                            label={__('Post Parent IDs (Include)', 'jankx')}
                            value={postParentIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentIn: ids });
                            }}
                        />
                        <TextControl
                            label={__('Post Parent IDs (Exclude)', 'jankx')}
                            value={postParentNotIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentNotIn: ids });
                            }}
                        />
                    </PanelBody>
                ) : null}

                {queryPreset === 'custom' ? (
                    <PanelBody title={__('Keyword Search', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Search Keyword', 'jankx')}
                            value={keyword}
                            onChange={(value) => setAttributes({ keyword: value })}
                        />
                    </PanelBody>
                ) : null}

                {queryPreset === 'custom' && authors.length > 0 ? (
                    <PanelBody title={__('Author Filters', 'jankx')} initialOpen={false}>
                        <BaseControl
                            label={__('Authors (Include)', 'jankx')}
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

                {queryPreset === 'custom' ? (
                    <PanelBody title={__('Post ID Filters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Post IDs (Include)', 'jankx')}
                            value={postIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postIn: ids });
                            }}
                        />
                        <TextControl
                            label={__('Post IDs (Exclude)', 'jankx')}
                            value={postNotIn.join(', ')}
                            onChange={(value) => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postNotIn: ids });
                            }}
                        />
                    </PanelBody>
                ) : null}

                {queryPreset === 'custom' ? (
                    <PanelBody title={__('Meta Query Filters', 'jankx')} initialOpen={false}>
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
                                />
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => {
                                        const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                    style={{ marginTop: '10px' }}
                                >
                                    {__('Remove', 'jankx')}
                                </Button>
                            </div>
                        ))}
                    </PanelBody>
                ) : null}

                {queryPreset === 'custom' && taxonomies.length > 0 ? taxonomies.map((taxonomy: TaxonomyItem) => {
                    const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
                    const hasQuery = existingQueryIndex >= 0;
                    const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
                    const terms = taxonomyTerms[taxonomy.slug];
                    return (
                        <PanelBody
                            key={taxonomy.slug}
                            title={taxonomy.name}
                            initialOpen={hasQuery}
                            onToggle={(isOpen) => {
                                if (isOpen) {
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
                                        />
                                        {!['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) ? (
                                            <>
                                                {terms ? (
                                                    <BaseControl
                                                        label={__('Select Terms', 'jankx')}
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

                {layout === 'carousel' && (
                    <PanelBody title={__('Carousel Settings', 'jankx')} initialOpen={false}>
                        <RangeControl
                            label={__('Slides to Scroll', 'jankx')}
                            value={slidesToScroll}
                            onChange={(value?: number) => setAttributes({ slidesToScroll: value ?? 1 })}
                            min={1}
                            max={6}
                        />
                        <ToggleControl
                            label={__('Loop', 'jankx')}
                            checked={loop}
                            onChange={(value: boolean) => setAttributes({ loop: value })}
                        />
                        <ToggleControl
                            label={__('Autoplay', 'jankx')}
                            checked={autoplay}
                            onChange={(value: boolean) => setAttributes({ autoplay: value })}
                        />
                        {autoplay && (
                            <RangeControl
                                label={__('Autoplay Delay (ms)', 'jankx')}
                                value={autoplayDelay}
                                onChange={(value?: number) => setAttributes({ autoplayDelay: value ?? 3000 })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                        )}
                        <ToggleControl
                            label={__('Show Arrows', 'jankx')}
                            checked={showArrows}
                            onChange={(value: boolean) => setAttributes({ showArrows: value })}
                        />
                        <ToggleControl
                            label={__('Show Dots', 'jankx')}
                            checked={showDots}
                            onChange={(value: boolean) => setAttributes({ showDots: value })}
                        />
                    </PanelBody>
                )}

                <PanelBody title={__('Pagination Settings', 'jankx')} initialOpen={false}>
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
                {isSelected ? (
                    (() => {
                        const hasTemplateBlock = Array.isArray(innerBlocks) && innerBlocks.length > 0;
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
                                        {__('Add Dynamic SSR Template to define item layout', 'jankx')}
                                    </div>
                                    <InnerBlocks
                                        allowedBlocks={['jankx/dynamic-ssr-template', 'core/heading']}
                                        templateLock={false}
                                        renderAppender={InnerBlocks.ButtonBlockAppender}
                                    />
                                </div>
                            );
                        }
                        return (
                            <InnerBlocks
                                allowedBlocks={['jankx/dynamic-ssr-template', 'core/heading']}
                                templateLock={false}
                                renderAppender={InnerBlocks.DefaultBlockAppender}
                            />
                        );
                    })()
                ) : (
                    <InnerBlocks
                        allowedBlocks={['jankx/dynamic-ssr-template', 'core/heading']}
                        templateLock={false}
                        renderAppender={InnerBlocks.DefaultBlockAppender}
                    />
                )}
            </div>
        </>
    );
}

export default Edit;
