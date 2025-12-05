import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, store as blockEditorStore } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    FormTokenField,
    Button,
    BaseControl,
    Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState, useMemo, useRef } from '@wordpress/element';
import { renderLayout, getLayoutStructure, getPostItemStructure } from './layout-renderer';

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

type TokenLike = string | { value: string; [key: string]: unknown };

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

interface MasterDataLayoutAttributes {
    queryPreset: QueryPreset;
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
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
    // Carousel specific
    slidesToScroll?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
    showArrows?: boolean;
    showDots?: boolean;
}

interface MasterDataLayoutEditProps {
    attributes: MasterDataLayoutAttributes;
    setAttributes: (attributes: Partial<MasterDataLayoutAttributes>) => void;
    clientId: string;
}

export default function Edit({ attributes, setAttributes, clientId }: MasterDataLayoutEditProps): JSX.Element {
    const {
        queryPreset,
        postType,
        postsPerPage,
        layout,
        columns,
        columnsTablet,
        columnsMobile,
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

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<TaxonomyItem[]>([]);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState<Record<string, TermItem[]>>({});

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return (): void => {
            isMountedRef.current = false;
        };
    }, []);

    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            setAttributes({ queryId: Math.abs(hash) });
        }
    }, [queryId, clientId, setAttributes]);

    // Reset queryPreset if current preset is not valid for the current postType
    useEffect(() => {
        const allPresets = (window as Record<string, unknown>).jankxQueryOptions?.queryPresets || [];
        const validPresets = (allPresets as Array<Record<string, unknown>>).filter((preset: Record<string, unknown>) =>
            !preset.postType || preset.postType === postType
        );
        const currentPresetValid = validPresets.some((preset: Record<string, unknown>) => preset.value === queryPreset);

        if (!currentPresetValid && validPresets.length > 0) {
            setAttributes({ queryPreset: validPresets[0].value as QueryPreset });
        }
    }, [postType, queryPreset, setAttributes]);

    // Fetch taxonomies and authors when postType changes
    useEffect(() => {
        const fetchTaxonomiesAndAuthors = async (): Promise<void> => {
            try {
                const taxonomiesData = await (window as Record<string, unknown>).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                }) as Record<string, TaxonomyItem> | undefined;

                if (!isMountedRef.current) {
                    return;
                }

                const taxArray = Object.values(taxonomiesData || {}).filter(
                    (item): item is TaxonomyItem => typeof item?.slug === 'string' && typeof item?.name === 'string'
                );
                setTaxonomies(taxArray);

                const authorsData = await (window as Record<string, unknown>).wp.apiFetch({
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
    const fetchTermsForTaxonomy = useCallback(async (taxonomy: string): Promise<void> => {
        if (taxonomyTerms[taxonomy]) {
            return;
        }

        try {
            const termsResponse = await (window as Record<string, unknown>).wp.apiFetch({
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
        className: `master-data-layout layout-${layout}`,
    });

    const isProduct = postType === 'product';

    // Get inner blocks from template block
    const innerBlocks = useSelect(
        (select: unknown) => {
            const { getBlocks } = select(blockEditorStore) as { getBlocks: (clientId: string) => unknown[] };
            const blocks = getBlocks(clientId) || [];
            const templateBlock = blocks.find((block: any) => block.name === 'jankx/master-data-template');
            return templateBlock?.innerBlocks || [];
        },
        [clientId]
    );

    // Preview HTML for editor (generated from structure)
    const [previewHtml, setPreviewHtml] = useState<string>('');

    // Generate preview HTML from structure when attributes change
    useEffect(() => {
        const generatePreview = (): void => {
            const layoutStructure = getLayoutStructure(layout);
            const postItemStructure = getPostItemStructure();

            if (!layoutStructure || !postItemStructure) {
                setPreviewHtml('');
                return;
            }

            // Update container structure with current columns
            const updatedStructure = {
                ...layoutStructure,
                container: {
                    ...layoutStructure.container,
                    classes: [
                        ...(layoutStructure.container.classes || []).filter((cls: string) => 
                            !cls.startsWith('columns-')
                        ),
                        `columns-${columns}`,
                        `columns-tablet-${columnsTablet}`,
                        `columns-mobile-${columnsMobile}`,
                    ],
                    styles: {
                        ...(layoutStructure.container.styles || {}),
                        '--columns-desktop': String(columns),
                        '--columns-tablet': String(columnsTablet),
                        '--columns-mobile': String(columnsMobile),
                    },
                },
            };

            // Generate preview with sample posts data
            // Use inner blocks from template to determine what to show
            const innerBlockNames = innerBlocks.map((block: any) => block.name);
            const hasFeaturedImage = innerBlockNames.includes('core/post-featured-image');
            const hasTitle = innerBlockNames.includes('core/post-title') || innerBlockNames.includes('woocommerce/product-title');
            const hasDate = innerBlockNames.includes('core/post-date');
            const hasExcerpt = innerBlockNames.includes('core/post-excerpt');
            const hasPrice = innerBlockNames.includes('woocommerce/product-price');
            const hasButton = innerBlockNames.includes('woocommerce/product-button');

            const samplePosts = Array.from({ length: Math.min(postsPerPage, 6) }, (_, i) => ({
                id: i + 1,
                title: `Sample Post ${i + 1}`,
                date: new Date().toLocaleDateString(),
                excerpt: 'This is a sample excerpt for preview purposes...',
                author: 'Sample Author',
                featuredImage: hasFeaturedImage ? '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect fill=\'%23ddd\' width=\'800\' height=\'600\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3E800x600%3C/text%3E%3C/svg%3E" alt="Sample" />' : '',
                price: hasPrice ? '$99.99' : '',
                button: hasButton ? '<button>Add to Cart</button>' : '',
                link: '#',
            }));

            const renderedHtml = renderLayout(
                updatedStructure,
                samplePosts,
                postItemStructure,
                {
                    showFeaturedImage: hasFeaturedImage,
                    showTitle: hasTitle,
                    showDate: hasDate,
                    showAuthor: false,
                    showExcerpt: hasExcerpt,
                    showPrice: hasPrice,
                    showAddToCart: hasButton,
                    showRating: false,
                    thumbnailPosition,
                    imageRatio,
                }
            );

            setPreviewHtml(renderedHtml);
        };

        // Debounce preview generation
        const timeoutId = setTimeout(() => {
            generatePreview();
        }, 300);

        return (): void => clearTimeout(timeoutId);
    }, [
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        thumbnailPosition,
        imageRatio,
        postsPerPage,
        innerBlocks, // Add innerBlocks dependency
    ]);

    // Get available post types
    const postTypes = useSelect((select: unknown) => {
        const { getPostTypes } = select('core') as { getPostTypes: (args: Record<string, unknown>) => unknown[] };
        return getPostTypes({ per_page: -1 }) || [];
    }, []);

    const postTypeOptions = (postTypes as Array<Record<string, unknown>>)
        .filter((type: Record<string, unknown>) => type.viewable && type.slug !== 'attachment')
        .map((type: Record<string, unknown>) => ({
            label: type.name,
            value: type.slug,
        }));

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={useMemo(() => {
                            const allPresets = (window as Record<string, unknown>).jankxQueryOptions?.queryPresets || [];
                            return (allPresets as Array<Record<string, unknown>>)
                                .filter((preset: Record<string, unknown>) =>
                                    !preset.postType || preset.postType === postType
                                )
                                .map((preset: Record<string, unknown>) => ({
                                    label: preset.label,
                                    value: preset.value,
                                }));
                        }, [postType])}
                        onChange={(value: string): void => setAttributes({ queryPreset: value as QueryPreset })}
                        help={useMemo(() => {
                            const allPresets = (window as Record<string, unknown>).jankxQueryOptions?.queryPresets || [];
                            const currentPreset = (allPresets as Array<Record<string, unknown>>).find((p: Record<string, unknown>) => p.value === queryPreset);
                            return (currentPreset?.help as string) || __('Select a query preset', 'jankx');
                        }, [queryPreset])}
                    />

                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions as Array<{ label: string; value: string }>}
                        onChange={(value: string): void => setAttributes({ postType: value })}
                        help={queryPreset === 'default' ? __('Select post type for the main query', 'jankx') : undefined}
                    />

                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value: number | undefined): void => setAttributes({ postsPerPage: value || 10 })}
                        min={1}
                        max={50}
                        help={__('Number of posts to display', 'jankx')}
                    />

                    {postType === 'post' && (
                        <ToggleControl
                            label={__('Include Sticky Posts', 'jankx')}
                            checked={includeStickyPosts}
                            onChange={(value: boolean): void => setAttributes({ includeStickyPosts: value })}
                            help={__('Include sticky posts in the query (disabled by default).', 'jankx')}
                        />
                    )}

                    {queryPreset !== 'default' && (
                        <>
                            <SelectControl
                                label={__('Order By', 'jankx')}
                                value={orderBy}
                                options={useMemo(() => {
                                    const allOrderByOptions = (window as Record<string, unknown>).jankxQueryOptions?.orderBy || [];
                                    return (allOrderByOptions as Array<Record<string, unknown>>)
                                        .filter((option: Record<string, unknown>) =>
                                            !option.postType || option.postType === postType
                                        )
                                        .map((option: Record<string, unknown>) => ({
                                            label: option.label,
                                            value: option.value,
                                        }));
                                }, [postType])}
                                onChange={(value: string): void => {
                                    const allOrderByOptions = (window as Record<string, unknown>).jankxQueryOptions?.orderBy || [];
                                    const selectedOption = (allOrderByOptions as Array<Record<string, unknown>>).find((opt: Record<string, unknown>) => opt.value === value);

                                    const updates: Partial<MasterDataLayoutAttributes> = { orderBy: value };
                                    if (selectedOption?.metaKey) {
                                        updates.metaKey = selectedOption.metaKey as string;
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
                                options={(window as Record<string, unknown>).jankxQueryOptions?.order as Array<{ label: string; value: string }> || [
                                    { label: __('Descending', 'jankx'), value: 'DESC' },
                                    { label: __('Ascending', 'jankx'), value: 'ASC' },
                                ]}
                                onChange={(value: string): void => setAttributes({ order: value })}
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
                            ((window as Record<string, unknown>).jankxSupportedPostTypeLayouts as Array<{ title: string; name: string }> | undefined)?.map((layout: { title: string; name: string }) => ({
                                label: layout.title,
                                value: layout.name,
                            })) || [
                                { label: __('Grid', 'jankx'), value: 'grid' },
                                { label: __('List', 'jankx'), value: 'list' },
                                { label: __('Card', 'jankx'), value: 'card' },
                                { label: __('Carousel', 'jankx'), value: 'carousel' },
                            ]
                        }
                        onChange={(value: string): void => setAttributes({ layout: value })}
                    />

                    <RangeControl
                        label={__('Columns (Desktop)', 'jankx')}
                        value={columns}
                        onChange={(value: number | undefined): void => setAttributes({ columns: value || 3 })}
                        min={1}
                        max={6}
                        help={__('Number of columns on desktop', 'jankx')}
                    />

                    <RangeControl
                        label={__('Columns (Tablet)', 'jankx')}
                        value={columnsTablet}
                        onChange={(value: number | undefined): void => setAttributes({ columnsTablet: value || 2 })}
                        min={1}
                        max={6}
                        help={__('Number of columns on tablet', 'jankx')}
                    />

                    <RangeControl
                        label={__('Columns (Mobile)', 'jankx')}
                        value={columnsMobile}
                        onChange={(value: number | undefined): void => setAttributes({ columnsMobile: value || 1 })}
                        min={1}
                        max={3}
                        help={__('Number of columns on mobile', 'jankx')}
                    />

                    {layout === 'carousel' && (
                        <>
                            <RangeControl
                                label={__('Slides To Scroll', 'jankx')}
                                value={slidesToScroll}
                                onChange={(value: number | undefined): void => setAttributes({ slidesToScroll: value || 1 })}
                                min={1}
                                max={columns || 3}
                                help={__('Number of slides to scroll at a time', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Loop', 'jankx')}
                                checked={loop}
                                onChange={(value: boolean): void => setAttributes({ loop: value })}
                                help={__('Enable infinite loop', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Autoplay', 'jankx')}
                                checked={autoplay}
                                onChange={(value: boolean): void => setAttributes({ autoplay: value })}
                                help={__('Automatically advance slides', 'jankx')}
                            />
                            {autoplay && (
                                <RangeControl
                                    label={__('Autoplay Delay (ms)', 'jankx')}
                                    value={autoplayDelay}
                                    onChange={(value: number | undefined): void => setAttributes({ autoplayDelay: value || 3000 })}
                                    min={1000}
                                    max={10000}
                                    step={500}
                                    help={__('Time between autoplay transitions', 'jankx')}
                                />
                            )}
                            <ToggleControl
                                label={__('Show Arrows', 'jankx')}
                                checked={showArrows}
                                onChange={(value: boolean): void => setAttributes({ showArrows: value })}
                                help={__('Display navigation arrows', 'jankx')}
                            />
                            <ToggleControl
                                label={__('Show Dots', 'jankx')}
                                checked={showDots}
                                onChange={(value: boolean): void => setAttributes({ showDots: value })}
                                help={__('Display pagination dots', 'jankx')}
                            />
                        </>
                    )}
                </PanelBody>

                {/* Display Options */}
                <PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Featured Image', 'jankx')}
                        checked={showFeaturedImage}
                        onChange={(value: boolean): void => setAttributes({ showFeaturedImage: value })}
                    />
                    {showFeaturedImage && (
                        <SelectControl
                            label={__('Thumbnail Position', 'jankx')}
                            value={thumbnailPosition}
                            options={[
                                { label: __('Top', 'jankx'), value: 'top' },
                                { label: __('Bottom', 'jankx'), value: 'bottom' },
                                { label: __('Left', 'jankx'), value: 'left' },
                                { label: __('Right', 'jankx'), value: 'right' },
                            ]}
                            onChange={(value: string): void => setAttributes({ thumbnailPosition: value as 'top' | 'bottom' | 'left' | 'right' })}
                        />
                    )}
                    <ToggleControl
                        label={__('Show Title', 'jankx')}
                        checked={showTitle}
                        onChange={(value: boolean): void => setAttributes({ showTitle: value })}
                    />
                    {!isProduct && (
                        <>
                            <ToggleControl
                                label={__('Show Excerpt', 'jankx')}
                                checked={showExcerpt}
                                onChange={(value: boolean): void => setAttributes({ showExcerpt: value })}
                            />
                            {showExcerpt && (
                                <RangeControl
                                    label={__('Excerpt Length', 'jankx')}
                                    value={excerptLength}
                                    onChange={(value: number | undefined): void => setAttributes({ excerptLength: value || 55 })}
                                    min={10}
                                    max={200}
                                />
                            )}
                            <ToggleControl
                                label={__('Show Date', 'jankx')}
                                checked={showDate}
                                onChange={(value: boolean): void => setAttributes({ showDate: value })}
                            />
                        </>
                    )}
                    <ToggleControl
                        label={__('Show Author', 'jankx')}
                        checked={showAuthor}
                        onChange={(value: boolean): void => setAttributes({ showAuthor: value })}
                    />
                    {isProduct && (
                        <>
                            <ToggleControl
                                label={__('Show Price', 'jankx')}
                                checked={showPrice}
                                onChange={(value: boolean): void => setAttributes({ showPrice: value })}
                            />
                            <ToggleControl
                                label={__('Show Add To Cart', 'jankx')}
                                checked={showAddToCart}
                                onChange={(value: boolean): void => setAttributes({ showAddToCart: value })}
                            />
                            <ToggleControl
                                label={__('Show Rating', 'jankx')}
                                checked={showRating}
                                onChange={(value: boolean): void => setAttributes({ showRating: value })}
                            />
                        </>
                    )}

                    <ToggleControl
                        label={__('Enable Pagination', 'jankx')}
                        checked={enablePagination}
                        onChange={(value: boolean): void => setAttributes({ enablePagination: value })}
                    />

                    {enablePagination && (
                        <>
                            <SelectControl
                                label={__('Pagination Style', 'jankx')}
                                value={paginationStyle}
                                options={[
                                    { label: __('Numbers', 'jankx'), value: 'numbers' },
                                    { label: __('Simple', 'jankx'), value: 'simple' },
                                    { label: __('Arrows', 'jankx'), value: 'arrows' },
                                    { label: __('Load More', 'jankx'), value: 'load-more' },
                                ]}
                                onChange={(value: string): void => setAttributes({ paginationStyle: value as 'numbers' | 'simple' | 'arrows' | 'load-more' })}
                            />

                            <SelectControl
                                label={__('Pagination Alignment', 'jankx')}
                                value={paginationAlignment}
                                options={[
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Right', 'jankx'), value: 'right' },
                                ]}
                                onChange={(value: string): void => setAttributes({ paginationAlignment: value as 'left' | 'center' | 'right' })}
                            />

                            {paginationStyle === 'numbers' && (
                                <ToggleControl
                                    label={__('Show All Page Numbers', 'jankx')}
                                    checked={showPaginationNumbers}
                                    onChange={(value: boolean): void => setAttributes({ showPaginationNumbers: value })}
                                />
                            )}

                            <TextControl
                                label={__('Previous Button Text', 'jankx')}
                                value={paginationPrevText}
                                onChange={(value: string): void => setAttributes({ paginationPrevText: value })}
                                placeholder={__('← Previous', 'jankx')}
                            />

                            <TextControl
                                label={__('Next Button Text', 'jankx')}
                                value={paginationNextText}
                                onChange={(value: string): void => setAttributes({ paginationNextText: value })}
                                placeholder={__('Next →', 'jankx')}
                            />
                        </>
                    )}
                </PanelBody>

                {/* Query Parameters - Only for custom preset */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('Query Parameters', 'jankx')} initialOpen={false}>
                        <RangeControl
                            label={__('Offset', 'jankx')}
                            value={offset}
                            onChange={(value: number | undefined): void => setAttributes({ offset: value || 0 })}
                            min={0}
                            max={50}
                            help={__('Skip the first N posts', 'jankx')}
                        />

                        {(orderBy === 'meta_value' || orderBy === 'meta_value_num') && (
                            <>
                                <TextControl
                                    label={__('Meta Key', 'jankx')}
                                    value={metaKey}
                                    onChange={(value: string): void => setAttributes({ metaKey: value })}
                                    help={__('Meta key for sorting', 'jankx')}
                                    placeholder={__('price, views, rating', 'jankx')}
                                />
                                {orderBy === 'meta_value' && (
                                    <SelectControl
                                        label={__('Meta Type', 'jankx')}
                                        value={metaType}
                                        options={(window as Record<string, unknown>).jankxQueryOptions?.metaTypes as Array<{ label: string; value: string }> || [
                                            { label: __('-- Auto --', 'jankx'), value: '' },
                                            { label: 'NUMERIC', value: 'NUMERIC' },
                                        ]}
                                        onChange={(value: string): void => setAttributes({ metaType: value })}
                                    />
                                )}
                            </>
                        )}
                    </PanelBody>
                )}

                {/* Advanced Query Parameters */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('🔧 Advanced Query Parameters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Query ID', 'jankx')}
                            value={customQueryId}
                            onChange={(value: string): void => setAttributes({ customQueryId: value })}
                            help={__('Set a name for this query to apply filters', 'jankx')}
                            placeholder={__('featured-posts, sidebar-posts', 'jankx')}
                        />

                        <BaseControl
                            label={__('Post Status', 'jankx')}
                            help={__('Post status to fetch (default: publish)', 'jankx')}
                        >
                            <FormTokenField
                                value={postStatus}
                                suggestions={['publish', 'pending', 'draft', 'future', 'private']}
                                onChange={(tokens: TokenLike[]): void => setAttributes({ postStatus: normalizeTokens(tokens) })}
                            />
                        </BaseControl>

                        <TextControl
                            label={__('Post Parent ID', 'jankx')}
                            type="number"
                            value={String(postParent)}
                            onChange={(value: string): void => setAttributes({ postParent: parseInt(value) || 0 })}
                            help={__('Filter posts by parent ID', 'jankx')}
                        />

                        <TextControl
                            label={__('Post Parent IDs (Include)', 'jankx')}
                            value={postParentIn.join(', ')}
                            onChange={(value: string): void => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentIn: ids });
                            }}
                            placeholder={__('1, 2, 3', 'jankx')}
                        />

                        <TextControl
                            label={__('Post Parent IDs (Exclude)', 'jankx')}
                            value={postParentNotIn.join(', ')}
                            onChange={(value: string): void => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postParentNotIn: ids });
                            }}
                            placeholder={__('4, 5, 6', 'jankx')}
                        />
                    </PanelBody>
                )}

                {/* Keyword Search */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('🔍 Keyword Search', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Search Keyword', 'jankx')}
                            value={keyword}
                            onChange={(value: string): void => setAttributes({ keyword: value })}
                            help={__('Search by title, content, excerpt', 'jankx')}
                            placeholder={__('Enter keyword...', 'jankx')}
                        />
                    </PanelBody>
                )}

                {/* Author Filters */}
                {queryPreset === 'custom' && authors.length > 0 && (
                    <PanelBody title={__('👤 Author Filters', 'jankx')} initialOpen={false}>
                        <BaseControl
                            label={__('Authors (Include)', 'jankx')}
                            help={__('Only display posts from these authors', 'jankx')}
                        >
                            <FormTokenField
                                value={authors.filter((author) => authorIn.includes(author.id)).map((author) => author.name)}
                                suggestions={authors.map((author) => author.name)}
                                onChange={(tokens: TokenLike[]): void => {
                                    const normalizedTokens = normalizeTokens(tokens);
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
                                onChange={(tokens: TokenLike[]): void => {
                                    const normalizedTokens = normalizeTokens(tokens);
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

                {/* Post ID Filters */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('🔢 Post ID Filters', 'jankx')} initialOpen={false}>
                        <TextControl
                            label={__('Post IDs (Include)', 'jankx')}
                            value={postIn.join(', ')}
                            onChange={(value: string): void => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postIn: ids });
                            }}
                            help={__('Only display posts with these IDs', 'jankx')}
                            placeholder={__('1, 2, 3', 'jankx')}
                        />
                        <TextControl
                            label={__('Post IDs (Exclude)', 'jankx')}
                            value={postNotIn.join(', ')}
                            onChange={(value: string): void => {
                                const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                setAttributes({ postNotIn: ids });
                            }}
                            help={__('Exclude posts with these IDs', 'jankx')}
                            placeholder={__('4, 5, 6', 'jankx')}
                        />
                    </PanelBody>
                )}

                {/* Meta Query Filters */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('⚙️ Meta Query Filters', 'jankx')} initialOpen={false}>
                        <Button
                            variant="primary"
                            onClick={(): void => {
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
                            <div key={index} style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <strong>{__('Meta Query', 'jankx')} #{index + 1}</strong>
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={(): void => {
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
                                    onChange={(value: string): void => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) return;
                                        newMetaQuery[index] = { ...targetQuery, key: value };
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                    placeholder={__('price, rating, views', 'jankx')}
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
                                        { label: 'NOT LIKE', value: 'NOT LIKE' },
                                        { label: 'IN (In List)', value: 'IN' },
                                        { label: 'NOT IN', value: 'NOT IN' },
                                        { label: 'EXISTS', value: 'EXISTS' },
                                        { label: 'NOT EXISTS', value: 'NOT EXISTS' },
                                    ]}
                                    onChange={(value: string): void => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) return;
                                        newMetaQuery[index] = { ...targetQuery, compare: value as MetaQueryItem['compare'] };
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                />

                                {!['EXISTS', 'NOT EXISTS'].includes(mq.compare) && (
                                    <TextControl
                                        label={__('Value', 'jankx')}
                                        value={mq.value}
                                        onChange={(value: string): void => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) return;
                                            newMetaQuery[index] = { ...targetQuery, value };
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
                                    onChange={(value: string): void => {
                                        const newMetaQuery = [...metaQuery];
                                        const targetQuery = newMetaQuery[index];
                                        if (!targetQuery) return;
                                        const updatedQuery = { ...targetQuery };
                                        if (value) {
                                            updatedQuery.type = value as MetaQueryItem['type'];
                                        } else {
                                            delete updatedQuery.type;
                                        }
                                        newMetaQuery[index] = updatedQuery;
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                />
                            </div>
                        ))}
                    </PanelBody>
                )}

                {/* Taxonomy Filters */}
                {queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map((taxonomy: TaxonomyItem) => {
                    const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
                    const hasQuery = existingQueryIndex >= 0;
                    const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
                    const terms = taxonomyTerms[taxonomy.slug];

                    return (
                        <PanelBody
                            key={taxonomy.slug}
                            title={`🏷️ ${taxonomy.name}`}
                            initialOpen={hasQuery}
                            onToggle={(isOpen: boolean): void => {
                                if (isOpen) {
                                    fetchTermsForTaxonomy(taxonomy.slug);
                                }
                            }}
                        >
                            {!hasQuery ? (
                                <Button
                                    variant="secondary"
                                    onClick={(): void => {
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
                                            onChange={(value: string): void => {
                                                const newTaxQuery = [...taxQuery];
                                                const targetQuery = newTaxQuery[existingQueryIndex];
                                                if (!targetQuery) return;
                                                newTaxQuery[existingQueryIndex] = {
                                                    ...targetQuery,
                                                    operator: value as TaxQueryItem['operator'],
                                                };
                                                setAttributes({ taxQuery: newTaxQuery });
                                            }}
                                            help={__('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx')}
                                        />

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
                                                            onChange={(tokens: TokenLike[]): void => {
                                                                const selectedNames = normalizeTokens(tokens);
                                                                const selectedIds = selectedNames
                                                                    .map((tokenName) => {
                                                                        const term = terms.find((item) => item.name === tokenName);
                                                                        return term?.id ?? 0;
                                                                    })
                                                                    .filter((id) => id > 0);

                                                                const newTaxQuery = [...taxQuery];
                                                                const targetQuery = newTaxQuery[existingQueryIndex];
                                                                if (!targetQuery) return;
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
                                            onClick={(): void => {
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
                {/* Preview - render exactly like frontend, no labels, borders, or extra styling */}
                {/* This ensures editor preview matches frontend output for consistency */}
                {previewHtml ? (
                    layout === 'carousel' ? (
                        // For carousel, previewHtml already contains full structure from PHP
                        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    )
                ) : (
                    // Show InnerBlocks for editing when preview is not ready
                    <InnerBlocks 
                        template={[
                            ['jankx/master-data-template', {}]
                        ]}
                        templateLock="all" 
                        allowedBlocks={['jankx/master-data-template']}
                        renderAppender={false}
                    />
                )}
            </div>
        </>
    );
}
