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
		galleryHeight,
	} = attributes;
	const isMasonry = layout === 'masonry';
	const isHorizontalMasonry = layout === 'horizontal-masonry';
	const desktopColumns = isMasonry ? deskCol : 1;
	const tabletColumns = isMasonry ? tabCol : 1;
	const phoneColumns = isMasonry ? phoneCol : 1;

	const additionalClasses = isHorizontalMasonry
		? 'gallery-horizontal-scroll gallery-column hide-scrollbars ltr focus-within'
		: '';

	// Helper to distribute images into columns ensuring each column totals 100% height
	const distributeIntoColumns = (items: any[], columnsCount: number) => {
		const columns: Array<Array<{ image: any; fraction: number }>> = Array.from({ length: Math.max(columnsCount, 1) }, () => []);
		if (!items || items.length === 0) return columns;
		let colIndex = 0;
		for (let i = 0; i < items.length; ) {
			const current = items[i];
			const ratio = current?.width && current?.height ? current.height / current.width : 1;
			const target = columns[colIndex % columnsCount];
			if (ratio >= 1.2) {
				target.push({ image: current, fraction: 1 });
				i += 1;
				colIndex += 1;
			} else {
				const first = current;
				const second = items[i + 1];
				if (second) {
					target.push({ image: first, fraction: 0.5 });
					target.push({ image: second, fraction: 0.5 });
					i += 2;
				} else {
					target.push({ image: first, fraction: 1 });
					i += 1;
				}
				colIndex += 1;
			}
		}
		return columns;
	};

	return (
		<div
			{...useBlockProps.save({
				className: `layout__${layout} dc__${desktopColumns} tc__${tabletColumns} pc__${phoneColumns} dg__${deskGap} tg__${tabGap} pg__${phoneGap} ${isHorizontalMasonry ? `rows__${rows}` : ''} ${additionalClasses} ${isMasonry && galleryHeight ? 'fixed__height' : ''}`,
				style: isMasonry && galleryHeight ? ({ ['--gallery-height' as any]: `${galleryHeight}px` } as any) : undefined,
			})}
			data-id={galleryId}
			id={galleryId}
		>
			{images &&
				(isMasonry && galleryHeight
					? distributeIntoColumns(images, desktopColumns).map((col, idx) => (
							<div className="gallery-col" key={`col-${idx}`}>
								{col.map(({ image, fraction }) =>
									enableLightbox ? (
										<a
											className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
											href={image.url}
											style={{ height: `${fraction * 100}%` }}
										>
											<img
												src={image.url}
												alt={image.alt ? image.alt : __('Gallery Image', 'jankx')}
												className={`wp-image-${image.id}`}
											/>
										</a>
									) : (
										<div
											className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
											style={{ height: `${fraction * 100}%` }}
										>
											<img
												src={image.url}
												alt={image.alt ? image.alt : __('Gallery Image', 'jankx')}
												className={`wp-image-${image.id}`}
											/>
										</div>
									)
								)}
							</div>
					  ))
					: images.map((image) => {
							return enableLightbox ? (
								<a
									className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
									href={image.url}
								>
									<img
										src={image.url}
										alt={image.alt ? image.alt : __('Gallery Image', 'jankx')}
										className={`wp-image-${image.id}`}
									/>
								</a>
							) : (
								<div
									className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
								>
									<img
										src={image.url}
										alt={image.alt ? image.alt : __('Gallery Image', 'jankx')}
										className={`wp-image-${image.id}`}
									/>
								</div>
							);
					  }))}
		</div>
	);
}
