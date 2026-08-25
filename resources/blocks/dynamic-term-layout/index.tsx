import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// Deprecated v1: old save used only data-layout + data-columns, no extra classes or CSS vars
const deprecated = [
    {
        attributes: metadata.attributes,
        migrate(attributes: Record<string, any>) {
            return attributes;
        },
        save({ attributes }: { attributes: Record<string, any> }): JSX.Element {
            const layout = attributes.layout || 'grid';
            const columns = attributes.columns || 3;
            const blockProps = useBlockProps.save({
                'data-layout': layout,
                'data-columns': columns,
            });
            return (
                <div {...blockProps}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
    // Deprecated v2: save without minHeight
    {
        attributes: metadata.attributes,
        migrate(attributes: Record<string, any>) {
            return attributes;
        },
        save({ attributes }: { attributes: Record<string, any> }): JSX.Element {
            const attrs = attributes as Record<string, any>;
            const layout = attrs.layout || 'grid';
            const columns = attrs.columns || 3;
            const columnsTablet = attrs.columnsTablet || 2;
            const columnsMobile = attrs.columnsMobile || 1;

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

            const inlineStyle: Record<string, any> = {
                '--columns-desktop': columns,
                '--columns-tablet': columnsTablet,
                '--columns-mobile': columnsMobile,
                '--slides-per-view': columns,
                '--space-between': '16px',
            };

            if (layout === 'carousel') {
                inlineStyle['--slides-per-view'] = columns;
                inlineStyle['--space-between'] = '16px';
            }

            if (styleColor) {
                const bg = typeof styleColor.background === 'object' ? styleColor.background?.color : styleColor.background;
                const text = typeof styleColor.text === 'object' ? styleColor.text?.color : styleColor.text;
                const grad = typeof styleColor.gradient === 'object' ? styleColor.gradient?.gradient : styleColor.gradient;
                if (bg) inlineStyle.backgroundColor = bg;
                if (text) inlineStyle.color = text;
                if (grad) {
                    inlineStyle.background = grad;
                    delete inlineStyle.backgroundColor;
                }
            }

            const dataAttributes: Record<string, any> = {
                'data-layout': layout,
                'data-slides-per-view': columns,
                'data-space-between': '16',
            };

            if (layout === 'carousel') {
                dataAttributes['data-autoplay'] = attributes.autoplay || false;
                dataAttributes['data-autoplay-delay'] = attributes.autoplayDelay || 3000;
                dataAttributes['data-loop'] = attributes.loop || false;
            }

            const blockProps = useBlockProps.save({
                className,
                style: inlineStyle,
                ...dataAttributes,
            });

            return (
                <div {...blockProps}>
                    <div className={`carousel-container ${layout === 'carousel' ? 'is-carousel' : ''}`}>
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
    deprecated,
});

