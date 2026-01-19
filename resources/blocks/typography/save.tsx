
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }: any) {
    const blockProps = useBlockProps.save({
        className: 'has-jankx-typography',
        style: {
            '--jankx-font-size-desktop': attributes.fontSizeDesktop ? `${attributes.fontSizeDesktop}px` : undefined,
            '--jankx-font-size-tablet': attributes.fontSizeTablet ? `${attributes.fontSizeTablet}px` : undefined,
            '--jankx-font-size-mobile': attributes.fontSizeMobile ? `${attributes.fontSizeMobile}px` : undefined,
            '--jankx-line-clamp-desktop': attributes.lineClampDesktop || undefined,
            '--jankx-line-clamp-tablet': attributes.lineClampTablet || undefined,
            '--jankx-line-clamp-mobile': attributes.lineClampMobile || undefined,
            'color': attributes.textColor
        }
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
