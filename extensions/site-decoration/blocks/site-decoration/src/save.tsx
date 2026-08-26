import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }: any): JSX.Element {
    const section = attributes.section || 'footer';
    const underline = attributes.headingUnderline || 'ornament';
    const afterImage = attributes.afterBackgroundImage;
    const blockProps = useBlockProps.save({
        className: `jankx-site-decoration jankx-site-decoration--${section} jankx-site-decoration--underline-${underline} jankx-site-decoration--after-${attributes.afterPosition || 'bottom'} jankx-site-decoration--layer-${attributes.afterLayer || 'behind'}`,
        style: {
            '--jankx-decoration-underline-color': attributes.underlineColor || undefined,
            '--jankx-decoration-underline-width': `${attributes.underlineWidth || 48}px`,
            '--jankx-decoration-after-color': attributes.afterBackgroundColor || undefined,
            '--jankx-decoration-after-image': afterImage ? `url(${afterImage})` : undefined,
            '--jankx-decoration-after-size': attributes.afterBackgroundSize || 'auto',
            '--jankx-decoration-after-opacity': attributes.afterOpacity ?? 1,
            '--jankx-decoration-after-height': `${attributes.afterHeight || 72}px`,
            '--jankx-decoration-after-position': attributes.afterPosition || 'bottom',
            '--jankx-decoration-after-z-index': attributes.afterLayer === 'front' ? 1 : -1,
        } as any,
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
