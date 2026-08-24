import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Save({ attributes }) {
    const attrs = attributes;
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
        'dynamic-term-layout',
        `dynamic-term-layout--${layout}`,
        `columns-${columns}`,
        `columns-tablet-${columnsTablet}`,
        `columns-mobile-${columnsMobile}`,
        backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined,
        textColorSlug ? `has-${textColorSlug}-color` : undefined,
        hasBackground ? 'has-background' : undefined,
        hasTextColor ? 'has-text-color' : undefined,
    ].filter(Boolean).join(' ');
    // Collect styles (CSS variables for columns + color styles from style.color)
    const inlineStyle = {
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
    // Add data attributes for carousel
    const dataAttributes = {
        'data-layout': layout,
        'data-slides-per-view': columns,
        'data-space-between': '16',
    };
    if (layout === 'carousel') {
        dataAttributes['data-autoplay'] = attributes.autoplay || false;
        dataAttributes['data-autoplay-delay'] = attributes.autoplayDelay || 3000;
        dataAttributes['data-slides-per-view'] = columns;
        dataAttributes['data-space-between'] = '16';
        dataAttributes['data-loop'] = attributes.loop || false;
    }
    const blockProps = useBlockProps.save({
        className,
        style: inlineStyle,
        ...dataAttributes
    });
    return (_jsx("div", { ...blockProps, children: _jsx("div", { className: `carousel-container ${layout === 'carousel' ? 'is-carousel' : ''}`, children: _jsx(InnerBlocks.Content, {}) }) }));
}
