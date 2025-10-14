import {
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

interface GalleryItem {
	id: number;
	url: string;
	alt: string;
	caption: string;
	title: string;
}

interface SaveProps {
	attributes: {
		galleryId: string;
		items: GalleryItem[];
		autoplay: boolean;
		autoplayDelay: number;
		showThumbnails: boolean;
		showNavigation: boolean;
		showPagination: boolean;
		showCaptions: boolean;
		thumbnailPosition: string;
		imageSize: string;
		aspectRatio: string;
		transitionEffect: string;
		transitionDuration: number;
		enableFullscreen: boolean;
		fullscreenAutoplay: boolean;
		fullscreenAutoplayDelay: number;
		fullscreenText: string;
		captionPosition: string;
	};
}

export default function Save({ attributes }: SaveProps) {
	const {
		galleryId,
		items,
		autoplay,
		autoplayDelay,
		showThumbnails,
		showNavigation,
		showPagination,
		showCaptions,
		thumbnailPosition,
		imageSize,
		aspectRatio,
		transitionEffect,
		transitionDuration,
		enableFullscreen,
		fullscreenAutoplay,
		fullscreenAutoplayDelay,
		fullscreenText,
		captionPosition,
	} = attributes;

	if (!items || items.length === 0) {
		return null;
	}

	// Use WordPress block props with built-in supports
	const blockProps = useBlockProps.save({
		className: `wp-block-jankx-gallery-builder gallery-${galleryId}`,
	});

	// Generate data attributes for JavaScript
	const dataAttributes = {
		'data-gallery-id': galleryId,
		'data-autoplay': autoplay,
		'data-autoplay-delay': autoplayDelay,
		'data-show-thumbnails': showThumbnails,
		'data-show-navigation': showNavigation,
		'data-show-pagination': showPagination,
		'data-show-captions': showCaptions,
		'data-thumbnail-position': thumbnailPosition,
		'data-image-size': imageSize,
		'data-aspect-ratio': aspectRatio,
		'data-transition-effect': transitionEffect,
		'data-transition-duration': transitionDuration,
		'data-enable-fullscreen': enableFullscreen,
		'data-fullscreen-autoplay': fullscreenAutoplay,
		'data-fullscreen-autoplay-delay': fullscreenAutoplayDelay,
		'data-fullscreen-text': fullscreenText,
		'data-caption-position': captionPosition,
	};

	return (
		<div
			{...blockProps}
			{...dataAttributes}
		>
			<div className="gallery-builder-container">
				{/* Thumbnails Top */}
				{showThumbnails && thumbnailPosition === 'top' && (
					<div className="gallery-thumbnails top">
						{items.map((item, index) => (
							<div
								key={item.id}
								className="thumbnail"
								data-slide={index}
							>
								<img
									src={item.url}
									alt={item.alt}
									loading="lazy"
								/>
							</div>
						))}
					</div>
				)}

				{/* Main Gallery */}
				<div className="gallery-main">
					{/* Navigation Arrows */}
					{showNavigation && items.length > 1 && (
						<>
							<button className="gallery-nav prev" aria-label="Previous image">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
								</svg>
							</button>
							<button className="gallery-nav next" aria-label="Next image">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
								</svg>
							</button>
						</>
					)}

					{/* Slides Container */}
					<div className="gallery-slides">
						{items.map((item, index) => (
							<div
								key={item.id}
								className={`gallery-slide ${index === 0 ? 'active' : ''}`}
								data-slide={index}
							>
								<div className="slide-image-container">
									<img
										src={item.url}
										alt={item.alt}
										className="main-image"
										loading={index === 0 ? 'eager' : 'lazy'}
									/>
								</div>

								{/* Caption */}
								{showCaptions && item.caption && (
									<div className="slide-caption">
										<div
											className="caption-content"
											dangerouslySetInnerHTML={{ __html: item.caption }}
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Thumbnails Bottom */}
				{showThumbnails && thumbnailPosition === 'bottom' && (
					<div className="gallery-thumbnails bottom">
						{items.map((item, index) => (
							<div
								key={item.id}
								className="thumbnail"
								data-slide={index}
							>
								<img
									src={item.url}
									alt={item.alt}
									loading="lazy"
								/>
							</div>
						))}
					</div>
				)}

				{/* Pagination */}
				{showPagination && items.length > 1 && (
					<div className="gallery-pagination">
						{items.map((_, index) => (
							<button
								key={index}
								className="pagination-dot"
								data-slide={index}
								aria-label={`Go to slide ${index + 1}`}
							>
								{index + 1}
							</button>
						))}
					</div>
				)}

				{/* Controls */}
				<div className="gallery-controls">
					{/* Fullscreen Button */}
					{enableFullscreen && (
						<button className="fullscreen-button" aria-label="Open fullscreen slideshow">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
							</svg>
							{__('Fullscreen', 'jankx')}
						</button>
					)}

					{/* Autoplay Controls */}
					{autoplay && (
						<button className="autoplay-toggle" aria-label="Toggle autoplay">
							<svg className="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M8 5v14l11-7z"/>
							</svg>
							<svg className="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
