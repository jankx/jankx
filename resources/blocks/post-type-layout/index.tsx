import { createBlock, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    Spinner,
    Placeholder,
    TextControl,
    FormTokenField,
    Button,
    BaseControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState, useMemo, useRef } from '@wordpress/element';
import type { CSSProperties } from 'react';
type TokenLike = string | { value: string; [key: string]: unknown };
import ServerSideRender from '@wordpress/server-side-render';
import { debounce } from '@wordpress/compose';
import { ResponsiveControl, ResponsiveValue } from '../../shared/components';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import useEmblaCarousel from 'embla-carousel-react';

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

const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'] as const;

type PresetImageRatio = typeof PRESET_IMAGE_RATIOS[number];
type ImageRatioSelectValue = '' | 'custom' | PresetImageRatio;

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

interface PostTypeLayoutAttributes {
    queryPreset: QueryPreset;
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    responsiveColumns: ResponsiveValue;
    showTitle: boolean;
    showExcerpt: boolean;
    showFeaturedImage: boolean;
    includeStickyPosts: boolean;
    thumbnailPosition: 'top' | 'bottom' | 'left' | 'right';
    imageRatio: string;
    showDate: boolean;
    showAuthor: boolean;
    showPrice: boolean;
    showAddToCart: boolean;
    showRating: boolean;
    excerptLength: number;
    orderBy: string;
    order: string;
    queryId?: number;
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
}

interface EditProps {
    attributes: PostTypeLayoutAttributes;
    setAttributes: (attrs: Partial<PostTypeLayoutAttributes>) => void;
    clientId: string;
}

type DebouncedAttributesUpdater = ((attrs: PostTypeLayoutAttributes) => void) & {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
};

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        queryPreset,
        postType,
        postsPerPage,
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        responsiveColumns,
        showTitle,
        showExcerpt,
        showFeaturedImage,
        includeStickyPosts = false,
        thumbnailPosition = 'top',
        imageRatio,
        showDate,
        showAuthor,
        showPrice = true,
        showAddToCart = true,
        showRating = false,
        excerptLength,
        orderBy,
        order,
        queryId,
        enablePagination,
        paginationStyle,
        paginationAlignment,
        showPaginationNumbers,
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
    } = attributes;

    // Use ServerSideRender for initial render (better UX, SSR)
    // Only use AJAX fetch when needed for complex interactions
    const useAjaxRender = true;
    
    // Debounced attributes for AJAX render (only when useAjaxRender is true)
    const [debouncedAttributes, setDebouncedAttributes] = useState(attributes);
    const [cachedHtml, setCachedHtml] = useState<string>('');
    const [carouselSlidesHtml, setCarouselSlidesHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Embla Carousel refs for carousel layout preview in editor
    // Always initialize hook, but only use it when layout is carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll,
        loop,
        skipSnaps: false,
        dragFree: false,
    });
    
    // Re-initialize carousel when settings change (for carousel layout only)
    useEffect(() => {
        if (layout === 'carousel' && emblaApi && cachedHtml) {
            // Embla will auto-update when options change via props
            emblaApi.reInit();
        }
    }, [layout, slidesToScroll, loop, cachedHtml, emblaApi]);

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});

    const innerBlocks = useSelect(
        (select: any) => select(blockEditorStore).getBlock(clientId)?.innerBlocks ?? [],
        [clientId]
    );
    const { replaceInnerBlocks } = useDispatch<any>(blockEditorStore);

    // Debounce attributes update để giảm số lần re-render (only when using AJAX)
    const updateDebouncedAttributes = useMemo<DebouncedAttributesUpdater>(() => {
        const debounced = debounce((...args: unknown[]) => {
            const [newAttributes] = args as [PostTypeLayoutAttributes];
            setDebouncedAttributes(newAttributes);
            if (useAjaxRender) {
                setIsLoading(true);
            }
        }, 800);

        return debounced as DebouncedAttributesUpdater;
    }, [setDebouncedAttributes, setIsLoading, useAjaxRender]);

    const attributesHash = useMemo(() => JSON.stringify(attributes), [attributes]);
    const previousAttributesHashRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!useAjaxRender) {
            return;
        }
        if (previousAttributesHashRef.current === attributesHash) {
            return;
        }
        previousAttributesHashRef.current = attributesHash;
        setIsLoading(true);
        updateDebouncedAttributes(attributes);
    }, [attributes, attributesHash, updateDebouncedAttributes, useAjaxRender]);

    useEffect(() => {
        return () => {
            updateDebouncedAttributes.cancel();
        };
    }, [updateDebouncedAttributes]);

    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            // Generate numeric ID from clientId hash
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            setAttributes({ queryId: Math.abs(hash) });
        }
    }, [queryId, clientId, setAttributes]);

    // Reset queryPreset if current preset is not valid for the current postType
    useEffect(() => {
        const allPresets = (window as any).jankxQueryOptions?.queryPresets || [];
        const validPresets = allPresets.filter((preset: any) => 
            !preset.postType || preset.postType === postType
        );
        const currentPresetValid = validPresets.some((preset: any) => preset.value === queryPreset);
        
        if (!currentPresetValid && validPresets.length > 0) {
            // Reset to first valid preset
            setAttributes({ queryPreset: validPresets[0].value as 'default' | 'related' | 'custom' | 'on-sale' });
        }
    }, [postType, queryPreset, setAttributes]);

    // Fetch taxonomies and authors when postType changes
    useEffect(() => {
        const fetchTaxonomiesAndAuthors = async () => {
            try {
                const taxonomiesData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                }) as Record<string, TaxonomyItem> | undefined;

                if (!isMountedRef.current) {
                    return;
                }

                const taxArray = Object.values(taxonomiesData || {}).filter(
                    (item): item is TaxonomyItem => typeof item?.slug === 'string' && typeof item?.name === 'string'
                );
                setTaxonomies(taxArray);

                const authorsData = await (window as any).wp.apiFetch({
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
                console.error('Error fetching taxonomies/authors:', error);

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
    const fetchTermsForTaxonomy = useCallback(async (taxonomy: string) => {
        if (taxonomyTerms[taxonomy]) {
            return; // Already loaded
        }

        try {
            const termsResponse = await (window as any).wp.apiFetch({
                path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
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

            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: normalizedTerms,
            }));
        } catch (error) {
            console.error(`Error fetching terms for ${taxonomy}:`, error);

            if (!isMountedRef.current) {
                return;
            }

            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: [],
            }));
        }
    }, [taxonomyTerms]);

const blockProps = useBlockProps({
    className: `post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
    style: {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
    } as CSSProperties,
});

const isProduct = postType === 'product';

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
 
const desiredInnerBlocks = useMemo(() => {
    const templateInnerBlocks = [];

    if (showFeaturedImage) {
        templateInnerBlocks.push('core/post-featured-image');
    }

    if (showTitle) {
        templateInnerBlocks.push(isProduct ? 'woocommerce/product-title' : 'core/post-title');
    }

    if (!isProduct && showDate) {
        templateInnerBlocks.push('core/post-date');
    }

    if (showAuthor) {
        templateInnerBlocks.push('core/post-author');
    }

    if (!isProduct && showExcerpt) {
        templateInnerBlocks.push('core/post-excerpt');
    }

    if (isProduct && showPrice) {
        templateInnerBlocks.push('woocommerce/product-price');
    }

    if (isProduct && showAddToCart) {
        templateInnerBlocks.push('woocommerce/product-button');
    }

    if (isProduct && showRating) {
        templateInnerBlocks.push('woocommerce/product-rating');
    }

    return templateInnerBlocks;
}, [
    showFeaturedImage,
    showTitle,
    showDate,
    showAuthor,
    showExcerpt,
    showPrice,
    showAddToCart,
    showRating,
    isProduct,
]);

useEffect(() => {
    if (!replaceInnerBlocks) {
        return;
    }

    const templateBlock = innerBlocks[0];
    const existingInnerBlocks = templateBlock?.innerBlocks ?? [];

    const existingNames = templateBlock ? existingInnerBlocks.map((block: any) => block.name) : [];
    const desiredNames = desiredInnerBlocks;

    const hasDifferences =
        existingNames.length !== desiredNames.length ||
        !existingNames.every((name: string) => desiredNames.includes(name));

    if (!templateBlock || templateBlock.name !== 'jankx/post-layout-template' || hasDifferences) {
        const newInnerBlocks = desiredNames.map((name) => createBlock(name));
        replaceInnerBlocks(
            clientId,
            [createBlock('jankx/post-layout-template', {}, newInnerBlocks)],
            false
        );
    }
}, [desiredInnerBlocks, innerBlocks, replaceInnerBlocks, clientId]);

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

    // Get available post types
    const postTypes = useSelect((select: any) => {
        const { getPostTypes } = select('core');
        return getPostTypes({ per_page: -1 }) || [];
    }, []);

    const postTypeOptions = postTypes
        .filter((type: any) => type.viewable && type.slug !== 'attachment')
        .map((type: any) => ({
            label: type.name,
            value: type.slug,
        }));

    // Get current layout's supported options
    const supportedLayouts = (window as any).jankxSupportedPostTypeLayouts || [];
    const currentLayout = supportedLayouts.find((l: any) => l.name === layout);
    const supportedOptions = currentLayout?.supportedOptions || [];
    const readOnlyOptions = currentLayout?.readOnlyOptions || [];

    // Create stable key based on actual query attributes only (for AJAX render)
    // Chỉ re-render khi các attributes này thay đổi
    const renderKey = useMemo(() => {
        if (!useAjaxRender) {
            return '';
        }
        const keyAttributes = {
            postType: debouncedAttributes.postType,
            postsPerPage: debouncedAttributes.postsPerPage,
            layout: debouncedAttributes.layout,
            columns: debouncedAttributes.columns,
            responsiveColumns: debouncedAttributes.responsiveColumns,
            showTitle: debouncedAttributes.showTitle,
            showExcerpt: debouncedAttributes.showExcerpt,
            showFeaturedImage: debouncedAttributes.showFeaturedImage,
            includeStickyPosts: debouncedAttributes.includeStickyPosts,
            thumbnailPosition: debouncedAttributes.thumbnailPosition,
            imageRatio: debouncedAttributes.imageRatio,
            showDate: debouncedAttributes.showDate,
            showAuthor: debouncedAttributes.showAuthor,
            excerptLength: debouncedAttributes.excerptLength,
            orderBy: debouncedAttributes.orderBy,
            order: debouncedAttributes.order,
            enablePagination: debouncedAttributes.enablePagination,
            paginationStyle: debouncedAttributes.paginationStyle,
            paginationAlignment: debouncedAttributes.paginationAlignment,
            showPaginationNumbers: debouncedAttributes.showPaginationNumbers,
            paginationPrevText: debouncedAttributes.paginationPrevText,
            paginationNextText: debouncedAttributes.paginationNextText,
            offset: debouncedAttributes.offset,
            taxQuery: debouncedAttributes.taxQuery,
            metaQuery: debouncedAttributes.metaQuery,
            keyword: debouncedAttributes.keyword,
            authorIn: debouncedAttributes.authorIn,
            authorNotIn: debouncedAttributes.authorNotIn,
            postIn: debouncedAttributes.postIn,
            postNotIn: debouncedAttributes.postNotIn,
            metaKey: debouncedAttributes.metaKey,
            metaType: debouncedAttributes.metaType,
            postStatus: debouncedAttributes.postStatus,
            postParent: debouncedAttributes.postParent,
            postParentIn: debouncedAttributes.postParentIn,
            postParentNotIn: debouncedAttributes.postParentNotIn,
            customQueryId: debouncedAttributes.customQueryId,
            slidesToScroll: debouncedAttributes.slidesToScroll,
            loop: debouncedAttributes.loop,
            autoplay: debouncedAttributes.autoplay,
            autoplayDelay: debouncedAttributes.autoplayDelay,
            showArrows: debouncedAttributes.showArrows,
            showDots: debouncedAttributes.showDots,
        };
        return JSON.stringify(keyAttributes);
    }, [debouncedAttributes, useAjaxRender]);

    // Fetch posts từ REST API (only when useAjaxRender is true)
    useEffect(() => {
        if (!useAjaxRender) {
            return;
        }

        const fetchPosts = async () => {
            try {
                if (isMountedRef.current) {
                    setIsLoading(true);
                }

                if (layout === 'carousel') {
                    setCarouselSlidesHtml('');
                }

                // Use wp.apiFetch để tự động handle authentication
                const data = await (window as any).wp.apiFetch({
                    path: `/wp/v2/block-renderer/jankx/post-type-layout?context=edit`,
                    method: 'POST',
                    data: {
                        attributes: debouncedAttributes,
                    },
                });

                if (!isMountedRef.current) {
                    return;
                }

                if (data.rendered) {
                    setCachedHtml(data.rendered);
                    if (layout === 'carousel') {
                        let slidesHtml = '';

                        try {
                            if (typeof window !== 'undefined' && typeof (window as any).DOMParser !== 'undefined') {
                                const parser = new window.DOMParser();
                                const parsedDocument = parser.parseFromString(data.rendered, 'text/html');
                                const containerElement = parsedDocument.querySelector('.post-type-layout-carousel .embla__container');

                                if (containerElement) {
                                    slidesHtml = containerElement.innerHTML;
                                }
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse carousel markup for editor preview:', parseError);
                        }

                        setCarouselSlidesHtml(slidesHtml);
                    } else {
                        setCarouselSlidesHtml('');
                    }
                } else {
                    setCachedHtml('<div class="placeholder">No content</div>');
                    setCarouselSlidesHtml('');
                }

                if (isMountedRef.current) {
                    setIsLoading(false);
                }
            } catch (error: any) {
                console.error('Error fetching posts:', error);

                if (!isMountedRef.current) {
                    return;
                }

                setCachedHtml(`<div class="error">${error?.message || 'Error rendering block'}</div>`);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [layout, renderKey, useAjaxRender]); // Only fetch when useAjaxRender is true


    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={useMemo(() => {
                            const allPresets = (window as any).jankxQueryOptions?.queryPresets || [];
                            // Filter presets based on postType:
                            // - Common presets: postType is null (available for all post types)
                            // - Specific presets: postType matches current postType
                            return allPresets
                                .filter((preset: any) => 
                                    !preset.postType || preset.postType === postType
                                )
                                .map((preset: any) => ({
                                    label: preset.label,
                                    value: preset.value,
                                }));
                        }, [postType])}
                        onChange={(value) => setAttributes({ queryPreset: value as QueryPreset })}
                        help={useMemo(() => {
                            const allPresets = (window as any).jankxQueryOptions?.queryPresets || [];
                            const currentPreset = allPresets.find((p: any) => p.value === queryPreset);
                            return currentPreset?.help || __('Select a query preset', 'jankx');
                        }, [queryPreset])}
                    />

                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value) => setAttributes({ postType: value })}
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

                    {postType === 'post' && (
                        <ToggleControl
                            label={__('Include Sticky Posts', 'jankx')}
                            checked={includeStickyPosts}
                            onChange={(value) => setAttributes({ includeStickyPosts: value })}
                            help={__('Include sticky posts in the query (disabled by default).', 'jankx')}
                        />
                    )}

                    {/* Order By and Order - Show for related and custom presets */}
                    {queryPreset !== 'default' && (
                        <>
                            <SelectControl
                                label={__('Order By', 'jankx')}
                                value={orderBy}
                                options={useMemo(() => {
                                    const allOrderByOptions = (window as any).jankxQueryOptions?.orderBy || [];
                                    // Filter order by options based on postType:
                                    // - Common options: postType is null (available for all post types)
                                    // - Specific options: postType matches current postType
                                    return allOrderByOptions
                                        .filter((option: any) => 
                                            !option.postType || option.postType === postType
                                        )
                                        .map((option: any) => ({
                                            label: option.label,
                                            value: option.value,
                                        }));
                                }, [postType])}
                                onChange={(value) => {
                                    const allOrderByOptions = (window as any).jankxQueryOptions?.orderBy || [];
                                    const selectedOption = allOrderByOptions.find((opt: any) => opt.value === value);
                                    
                                    // Auto-set metaKey if option has metaKey property
                                    const updates: any = { orderBy: value };
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
                                options={(window as any).jankxQueryOptions?.order || [
                                    { label: __('Descending', 'jankx'), value: 'DESC' },
                                    { label: __('Ascending', 'jankx'), value: 'ASC' },
                                ]}
                                onChange={(value) => setAttributes({ order: value })}
                            />
                        </>
                    )}
                </PanelBody>

                {/* Layout Settings */}
                <PanelBody title={__('Layout', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Layout Type', 'jankx')}
                        value={layout}
                        options={
                            (window as any).jankxSupportedPostTypeLayouts?.map((layout: any) => ({
                                label: layout.title,
                                value: layout.name,
                            })) || [
                                { label: __('Grid', 'jankx'), value: 'grid' },
                                { label: __('List', 'jankx'), value: 'list' },
                                { label: __('Masonry', 'jankx'), value: 'masonry' },
                                { label: __('Card', 'jankx'), value: 'card' },
                                { label: __('Carousel', 'jankx'), value: 'carousel' },
                            ]
                        }
                        onChange={(value) => setAttributes({ layout: value })}
                    />
                    {supportedOptions.includes('columns') && (
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
                    )}
                    
                    {/* Carousel Specific Settings */}
                    {layout === 'carousel' && (
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
                            {autoplay && (
                                <RangeControl
                                    label={__('Autoplay Delay (ms)', 'jankx')}
                                        value={autoplayDelay}
                                        onChange={(value) => setAttributes({ autoplayDelay: value || 3000 })}
                                    min={1000}
                                    max={10000}
                                    step={500}
                                    help={__('Time between autoplay transitions', 'jankx')}
                                />
                            )}
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
                    )}
                </PanelBody>

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
                                            onChange={(value) => setAttributes({ thumbnailPosition: value as PostTypeLayoutAttributes['thumbnailPosition'] })}
                                            help={__('Choose where the featured image appears relative to the content.', 'jankx')}
                                        />
                                    )}
                                    <SelectControl
                                        label={__('Image Aspect Ratio', 'jankx')}
                                        value={imageRatioSelectValue}
                                        onChange={(value) => {
                                            if (value === 'custom') {
                                                // Set to empty string to show TextControl, user will enter custom value
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
                                                // Validate format: should be "number/number" or empty
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

                    {/* Pagination Settings */}
                    <ToggleControl
                        label={__('Enable Pagination', 'jankx')}
                        checked={enablePagination}
                        onChange={(value) => setAttributes({ enablePagination: value })}
                        help={__('Display pagination to paginate posts', 'jankx')}
                    />

                    {enablePagination && (
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

                            {paginationStyle === 'numbers' && (
                                <ToggleControl
                                    label={__('Show All Page Numbers', 'jankx')}
                                    checked={showPaginationNumbers}
                                    onChange={(value) => setAttributes({ showPaginationNumbers: value })}
                                    help={__('Show all page numbers instead of abbreviated', 'jankx')}
                                />
                            )}

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
                    )}
                </PanelBody>

                {/* Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' && (
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
                    {(orderBy === 'meta_value' || orderBy === 'meta_value_num') && (
                        <>
                            <TextControl
                                label={__('Meta Key', 'jankx')}
                                value={metaKey}
                                onChange={(value) => setAttributes({ metaKey: value })}
                                help={__('Meta key for sorting (required when using meta_value)', 'jankx')}
                                placeholder={__('Example: price, views, rating', 'jankx')}
                            />
                            {orderBy === 'meta_value' && (
                                <SelectControl
                                    label={__('Meta Type', 'jankx')}
                                    value={metaType}
                                    options={(window as any).jankxQueryOptions?.metaTypes || [
                                        { label: __('-- Auto --', 'jankx'), value: '' },
                                        { label: 'NUMERIC', value: 'NUMERIC' },
                                    ]}
                                    onChange={(value) => setAttributes({ metaType: value })}
                                    help={__('Specify data type for accurate sorting', 'jankx')}
                                />
                            )}
                        </>
                    )}
                </PanelBody>
                )}

                {/* Advanced Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' && (
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
                )}

                {/* Keyword Search Filter - Only show for custom preset */}
                {queryPreset === 'custom' && (
                <PanelBody title={__('🔍 Keyword Search', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Search Keyword', 'jankx')}
                        value={keyword}
                        onChange={(value) => setAttributes({ keyword: value })}
                        help={__('Search by title, content, excerpt', 'jankx')}
                        placeholder={__('Enter keyword...', 'jankx')}
                    />
                </PanelBody>
                )}

                {/* Author Filters - Only show for custom preset */}
                {queryPreset === 'custom' && authors.length > 0 && (
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
                )}

                {/* Post ID Filters - Only show for custom preset */}
                {queryPreset === 'custom' && (
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
                )}

                {/* Meta Query Filters - Only show for custom preset */}
                {queryPreset === 'custom' && (
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

                            {!['EXISTS', 'NOT EXISTS'].includes(mq.compare) && (
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
                            )}

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
                )}

                {/* Taxonomy Filters - Only show for custom preset */}
                {queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map((taxonomy: TaxonomyItem) => {
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
                                currentQuery && (
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
                                        {!['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && (
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
                                        )}

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
                                )
                            )}
                        </PanelBody>
                    );
                })}
            </InspectorControls>

            <div {...blockProps}>
                {useAjaxRender && isLoading ? (
                    <Placeholder>
                        <Spinner />
                        <p>{__('Loading posts...', 'jankx')}</p>
                    </Placeholder>
                ) : useAjaxRender && layout === 'carousel' && cachedHtml ? (
                    // Render carousel preview in editor using Embla Carousel React (AJAX mode)
                    (() => {
                        const carouselClasses = [
                            'post-type-layout-carousel',
                        ];

                        if (columns) {
                            carouselClasses.push(`columns-${columns}`);
                        }
                        if (columnsTablet) {
                            carouselClasses.push(`columns-tablet-${columnsTablet}`);
                        }
                        if (columnsMobile) {
                            carouselClasses.push(`columns-mobile-${columnsMobile}`);
                        }
                        if ((postType || '').toLowerCase() === 'product') {
                            carouselClasses.push('wc-block-product-template');
                        }

                        const carouselStyle: CSSProperties = {};
                        (carouselStyle as any)['--carousel-columns'] = String(columns || 3);
                        (carouselStyle as any)['--carousel-columns-tablet'] = String(columnsTablet || 2);
                        (carouselStyle as any)['--carousel-columns-mobile'] = String(columnsMobile || 1);

                        const carouselAttributes: Record<string, string> = {
                            'data-embla-carousel': '',
                            'data-slides-per-view': String(columns || 3),
                            'data-slides-to-scroll': String(slidesToScroll || 1),
                        };

                        if (loop) {
                            carouselAttributes['data-loop'] = 'true';
                        }

                        if (autoplay) {
                            carouselAttributes['data-autoplay'] = 'true';
                            carouselAttributes['data-autoplay-delay'] = String(autoplayDelay || 3000);
                        }

                        return (
                            <div
                                className={carouselClasses.join(' ')}
                                style={carouselStyle}
                                {...carouselAttributes}
                            >
                                <div className="embla__viewport" ref={emblaRef}>
                                    <div
                                        className="embla__container"
                                        dangerouslySetInnerHTML={{ __html: carouselSlidesHtml || '' }}
                                    />
                                </div>
                                {showArrows !== false && emblaApi && (
                                    <>
                                        <button
                                            className="embla__button embla__button--prev"
                                            type="button"
                                            onClick={() => emblaApi.scrollPrev()}
                                            aria-label={__('Previous slide', 'jankx')}
                                            disabled={loop === false && !emblaApi.canScrollPrev()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <button
                                            className="embla__button embla__button--next"
                                            type="button"
                                            onClick={() => emblaApi.scrollNext()}
                                            aria-label={__('Next slide', 'jankx')}
                                            disabled={loop === false && !emblaApi.canScrollNext()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })()
                ) : useAjaxRender && cachedHtml ? (
                    // AJAX mode - render cached HTML
                    <div dangerouslySetInnerHTML={{ __html: cachedHtml }} />
                ) : (
                    <InnerBlocks templateLock={false} renderAppender={undefined} />
                )}
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null, // Server-side rendering
} as any);
