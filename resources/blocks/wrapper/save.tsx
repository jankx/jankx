
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }: any) {
    const Tag = attributes.tagName || 'div';
    const blockProps = useBlockProps.save({
        className: [
            'has-jankx-responsive-wrapper',
            attributes.hideOnDesktop ? 'hide-on-desktop' : '',
            attributes.hideOnTablet ? 'hide-on-tablet' : '',
            attributes.hideOnMobile ? 'hide-on-mobile' : '',
        ].filter(Boolean).join(' '),
        style: {
            '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
            '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
            '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
            '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
            '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
            '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined,
        } as any
    });

    return (
        <Tag {...blockProps}>
            <InnerBlocks.Content />
        </Tag>
    );
}
