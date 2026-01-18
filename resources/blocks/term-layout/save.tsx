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
        'dynamic-ssr-layout',
        `dynamic-ssr-layout--${layout}`,
        `columns-${columns}`,
        `columns-tablet-${columnsTablet}`,
        `columns-mobile-${columnsMobile}`,
        backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined,
        textColorSlug ? `has-${textColorSlug}-color` : undefined,
        hasBackground ? 'has-background' : undefined,
        hasTextColor ? 'has-text-color' : undefined,
    ].filter(Boolean).join(' ');

    // Collect styles (CSS variables for columns + color styles from style.color)
    const inlineStyle: Record<string, any> = {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
        '--slides-per-view': columns,
        '--space-between': '16px',
    };

    // Add carousel specific styles if layout is carousel
    if (layout === 'carousel') {
        inlineStyle['--slides-per-view'] = columns;
        inlineStyle['--space-between'] = '16px';
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

    // Add data attributes for carousel functionality
    const dataAttributes: Record<string, any> = {
        'data-layout': layout,
    };

    if (layout === 'carousel') {
        dataAttributes['data-slides-per-view'] = columns;
        dataAttributes['data-space-between'] = '16';
        dataAttributes['data-loop'] = attrs.loop || false;
        dataAttributes['data-autoplay'] = attrs.autoplay || false;
        dataAttributes['data-autoplay-delay'] = attrs.autoplayDelay || 3000;
    }

    const blockProps = useBlockProps.save({
        className,
        style: inlineStyle,
        ...dataAttributes
    });

    return (
        <div {...blockProps}>
            <div className={`carousel-container ${layout === 'carousel' ? 'is-carousel' : ''}`}>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
