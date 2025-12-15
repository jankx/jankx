/* eslint-disable no-unused-vars */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		galleryId,
		images,
		deskCol,
		tabCol,
		phoneCol,
		deskGap,
		tabGap,
		phoneGap,
		enableLightbox,
		imageHoverEffect,
		layout,
		rows,
	} = attributes;
	const isMasonry = layout === 'masonry';
	const isHorizontalMasonry = layout === 'horizontal-masonry';
	const desktopColumns = isMasonry ? deskCol : 1;
	const tabletColumns = isMasonry ? tabCol : 1;
	const phoneColumns = isMasonry ? phoneCol : 1;

	const additionalClasses = isHorizontalMasonry
		? 'gallery-horizontal-scroll gallery-column hide-scrollbars ltr focus-within'
		: '';

	return (
		<div
			{...useBlockProps.save({
				className: `layout__${layout} dc__${desktopColumns} tc__${tabletColumns} pc__${phoneColumns} dg__${deskGap} tg__${tabGap} pg__${phoneGap} ${isHorizontalMasonry ? `rows__${rows}` : ''} ${additionalClasses}`,
			})}
			data-id={galleryId}
			id={galleryId}
		>
			{images &&
				images.map((image) => {
					return enableLightbox ? (
						<a
							className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
							href={image.url}
						>
							<img
								src={image.url}
								alt={
									image.alt
										? image.alt
										: __(
												'Gallery Image',
												'jankx'
										  )
								}
								className={`wp-image-${image.id}`}
							/>
						</a>
					) : (
						<div
							className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
						>
							<img
								src={image.url}
								alt={
									image.alt
										? image.alt
										: __(
												'Gallery Image',
												'jankx'
										  )
								}
								className={`wp-image-${image.id}`}
							/>
						</div>
					);
				})}
		</div>
	);
}
