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
    ].filter(Boolean).join(' ');

    // Collect styles (CSS variables for columns + color styles from style.color)
    const inlineStyle: Record<string, any> = {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
    };

    const styleColor = attrs.style && attrs.style.color ? attrs.style.color : undefined;
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

    const blockProps = useBlockProps.save({ className, style: inlineStyle });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}

