
const { useBlockProps, InnerBlocks } = wp.blockEditor;

export default function save({ attributes }: any) {
    const Tag = attributes.tagName || 'div';
    const blockProps = useBlockProps.save({
        className: 'has-jankx-responsive-wrapper',
        style: {
            '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
            '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
            '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
            '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
            '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
            '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined,
        }
    });

    return (
        <Tag { ...blockProps } >
        <InnerBlocks.Content />
        </Tag>
    );
}
