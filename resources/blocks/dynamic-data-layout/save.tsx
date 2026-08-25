import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface SaveProps {
    attributes: Record<string, unknown>;
}

export default function Save({ attributes }: SaveProps): JSX.Element {
    const attrs = attributes as Record<string, any>;

    const layout = attrs.layout || 'grid';
    const columns = attrs.columns || 3;
    const columnsTablet = attrs.columnsTablet || 2;
    const columnsMobile = attrs.columnsMobile || 1;

    // Build classes consistent with editor and styles
    const styleColor = attrs.style && attrs.style.color ? attrs.style.color : undefined;
    const backgroundColorSlug = attrs.backgroundColor || attrs.style?.color?.backgroundSlug || attrs.style?.color?.background?.slug;
    const textColorSlug = attrs.textColor || attrs.style?.color?.textSlug || attrs.style?.color?.text?.slug;
    const gradient = attrs.gradient || attrs.style?.color?.gradient;

    const hasBackground = !!(styleColor?.background || gradient || backgroundColorSlug);
    const hasTextColor = !!(styleColor?.text || textColorSlug);

    const className = [
        'dynamic-data-layout',
        `dynamic-data-layout--${layout}`,
        `columns-${columns}`,
        `columns-tablet-${columnsTablet}`,
        `columns-mobile-${columnsMobile}`,
        backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined,
        textColorSlug ? `has-${textColorSlug}-color` : undefined,
        hasBackground ? 'has-background' : undefined,
        hasTextColor ? 'has-text-color' : undefined,
        // Carousel specific classes
        layout === 'carousel' ? 'jankx-carousel' : undefined,
        layout === 'carousel' && attrs.showArrows !== false ? 'has-arrows' : undefined,
        layout === 'carousel' && attrs.showDots !== false ? 'has-dots' : undefined,
        layout === 'carousel' && attrs.autoplay ? 'has-autoplay' : undefined,
    ].filter(Boolean).join(' ');

    // Collect styles (CSS variables for columns + color styles from style.color)
    const inlineStyle: Record<string, any> = {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
        '--slides-per-view': columns,
        '--space-between': '16px',
    };

    // Apply responsive minHeight as CSS variables
    const minHeight = attrs.minHeight;
    if (minHeight && typeof minHeight === 'object') {
        if (minHeight.desktop) {
            inlineStyle['--min-height-desktop'] = minHeight.desktop;
            inlineStyle.minHeight = minHeight.desktop;
        }
        if (minHeight.tablet) inlineStyle['--min-height-tablet'] = minHeight.tablet;
        if (minHeight.mobile) inlineStyle['--min-height-mobile'] = minHeight.mobile;
    } else if (typeof minHeight === 'string' && minHeight) {
        inlineStyle.minHeight = minHeight;
    }

    // Add carousel specific styles if layout is carousel
    if (layout === 'carousel') {
        inlineStyle['--slides-per-view'] = columns;
        inlineStyle['--space-between'] = '16px';
        inlineStyle['--peek-amount'] = `${attrs.carouselPeek || 0}%`;
    }

    if (styleColor) {
        // background may be either a string or an object { color: string, slug? }
        const bg = typeof styleColor.background === 'object' ? styleColor.background?.color : styleColor.background;
        const text = typeof styleColor.text === 'object' ? styleColor.text?.color : styleColor.text;
        const grad = typeof styleColor.gradient === 'object' ? styleColor.gradient?.gradient : styleColor.gradient;
        if (bg) {
            inlineStyle.backgroundColor = bg;
        }
        if (text) {
            inlineStyle.color = text;
        }
        if (grad) {
            inlineStyle.background = grad;
            delete inlineStyle.backgroundColor;
        }
    }

    // Add data attributes for query filtering (PHP can read these for WP_Query)
    const queryDataAttributes: Record<string, any> = {
        'data-query-preset': attrs.queryPreset || 'custom',
        'data-post-type': attrs.postType || 'post',
        'data-posts-per-page': attrs.postsPerPage || 10,
        'data-layout': layout,
        'data-columns': columns,
        'data-columns-tablet': columnsTablet,
        'data-columns-mobile': columnsMobile,
        'data-order-by': attrs.orderBy || 'date',
        'data-order': attrs.order || 'DESC',
        'data-offset': attrs.offset || 0,
        'data-keyword': attrs.keyword || '',
        'data-enable-pagination': attrs.enablePagination || false,
        'data-pagination-style': attrs.paginationStyle || 'numbers',
        'data-pagination-alignment': attrs.paginationAlignment || 'center',
        'data-show-pagination-numbers': attrs.showPaginationNumbers || true,
        'data-show-title': attrs.showTitle !== false,
        'data-show-excerpt': attrs.showExcerpt !== false,
        'data-show-featured-image': attrs.showFeaturedImage !== false,
        'data-show-date': attrs.showDate !== false,
        'data-show-author': attrs.showAuthor !== false,
        'data-show-price': attrs.showPrice !== false,
        'data-show-add-to-cart': attrs.showAddToCart !== false,
        'data-show-rating': attrs.showRating !== false,
    };

    if (layout === 'carousel') {
        queryDataAttributes['data-autoplay'] = attrs.autoplay || false;
        queryDataAttributes['data-autoplay-delay'] = attrs.autoplayDelay || 3000;
        queryDataAttributes['data-loop'] = attrs.loop || false;
        queryDataAttributes['data-slides-per-view'] = columns;
        queryDataAttributes['data-space-between'] = '16';
        queryDataAttributes['data-peek-amount'] = attrs.carouselPeek || 0;
        queryDataAttributes['data-show-arrows'] = attrs.showArrows !== false;
        queryDataAttributes['data-show-dots'] = attrs.showDots !== false;
    }

    const blockProps = useBlockProps.save({ 
        className, 
        style: inlineStyle,
        ...queryDataAttributes
    });

    return (
        <div {...blockProps}>
            <div className={`carousel-container ${layout === 'carousel' ? 'is-carousel' : ''}`}>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
