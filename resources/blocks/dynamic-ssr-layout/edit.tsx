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
import { useCallback, useEffect, useState, useMemo } from '@wordpress/element';
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

type QueryPreset = 'default' | 'related' | 'custom';

interface DynamicSsrLayoutAttributes {
    queryPreset: QueryPreset;
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
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
}

interface EditProps {
    attributes: DynamicSsrLayoutAttributes;
    setAttributes: (attrs: Partial<DynamicSsrLayoutAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        queryPreset = 'custom',
        postType = 'post',
        postsPerPage = 10,
        layout = 'grid',
        columns = 3,
        columnsTablet = 2,
        columnsMobile = 1,
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
    } = attributes;

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});

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
        className: `dynamic-ssr-layout dynamic-ssr-layout--${layout}`,
    });

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
    const layoutsData: LayoutsData = normalizeLayoutsData(window.jankxDynamicDataLayouts);

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
        const layouts: LayoutInfo[] = [];
        
        if (layoutsData.commonLayouts) {
            layoutsData.commonLayouts.forEach((layoutInfo: LayoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: LayoutInfo) => {
                layouts.push(layoutInfo);
            });
        }
        
        return layouts;
    }, [postType, layoutsData]);

    const layoutOptions = useMemo(() => {
        const options = availableLayouts.map((layoutInfo) => ({
            label: layoutInfo.title,
            value: layoutInfo.name,
        }));
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

    const TEMPLATE: any = [['jankx/dynamic-ssr-template']];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value: string) => setAttributes({ postType: value })}
                    />
                    <SelectControl
                        label={__('Layout', 'jankx')}
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
                    {layout !== 'carousel' && (
                        <>
                            <RangeControl
                                label={__('Columns', 'jankx')}
                                value={columns}
                                onChange={(value?: number) => setAttributes({ columns: value ?? 3 })}
                                min={1}
                                max={6}
                            />
                            <RangeControl
                                label={__('Tablet Columns', 'jankx')}
                                value={columnsTablet}
                                onChange={(value?: number) => setAttributes({ columnsTablet: value ?? 2 })}
                                min={1}
                                max={4}
                            />
                            <RangeControl
                                label={__('Mobile Columns', 'jankx')}
                                value={columnsMobile}
                                onChange={(value?: number) => setAttributes({ columnsMobile: value ?? 1 })}
                                min={1}
                                max={3}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={queryPresetOptions}
                        onChange={(value: string) => setAttributes({ queryPreset: value as QueryPreset })}
                    />
                    <SelectControl
                        label={__('Order By', 'jankx')}
                        value={orderBy}
                        options={orderByOptions}
                        onChange={(value: string) => setAttributes({ orderBy: value })}
                    />
                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={orderOptions}
                        onChange={(value: string) => setAttributes({ order: value })}
                    />
                    <ToggleControl
                        label={__('Include Sticky Posts', 'jankx')}
                        checked={includeStickyPosts}
                        onChange={(value: boolean) => setAttributes({ includeStickyPosts: value })}
                    />
                    <RangeControl
                        label={__('Offset', 'jankx')}
                        value={offset}
                        onChange={(value?: number) => setAttributes({ offset: value ?? 0 })}
                        min={0}
                        max={100}
                    />
                </PanelBody>

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
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    template={TEMPLATE}
                    templateLock="all"
                />
            </div>
        </>
    );
}

export default Edit;
