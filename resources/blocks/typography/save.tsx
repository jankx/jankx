import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }: any) {
	const blockProps = useBlockProps.save({
		className: 'jankx-typography-block',
		style: {
			'--jankx-font-size-desktop': attributes.fontSizeDesktop ? `${attributes.fontSizeDesktop}px` : undefined,
			'--jankx-font-size-tablet': attributes.fontSizeTablet ? `${attributes.fontSizeTablet}px` : undefined,
			'--jankx-font-size-mobile': attributes.fontSizeMobile ? `${attributes.fontSizeMobile}px` : undefined,
			'--jankx-line-clamp-desktop': attributes.lineClampDesktop || undefined,
			'--jankx-line-clamp-tablet': attributes.lineClampTablet || undefined,
			'--jankx-line-clamp-mobile': attributes.lineClampMobile || undefined,
			'color': attributes.textColor,
		} as any,
	});

	return (
		<>
			<style>{`.jankx-typography-block{font-size:var(--jankx-font-size-desktop,initial);display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:var(--jankx-line-clamp-desktop,initial);line-clamp:var(--jankx-line-clamp-desktop,initial)}@media(max-width:1024px){.jankx-typography-block{font-size:var(--jankx-font-size-tablet,var(--jankx-font-size-desktop,initial));-webkit-line-clamp:var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial));line-clamp:var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial))}}@media(max-width:768px){.jankx-typography-block{font-size:var(--jankx-font-size-mobile,var(--jankx-font-size-tablet,var(--jankx-font-size-desktop,initial)));-webkit-line-clamp:var(--jankx-line-clamp-mobile,var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial)));line-clamp:var(--jankx-line-clamp-mobile,var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial)))}}`}</style>
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		</>
	);
}
