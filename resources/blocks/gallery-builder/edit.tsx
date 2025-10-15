import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	ButtonGroup,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { trash, edit, plus } from '@wordpress/icons';

// editor style
import './editor.scss';

interface GalleryItem {
	id: number;
	url: string;
	alt: string;
	caption: string;
	title: string;
}

export default function Edit({ attributes, setAttributes, clientId }) {
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

	const [editingItem, setEditingItem] = useState<number | null>(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	// Set gallery ID
	if (!galleryId) {
		setAttributes({ galleryId: clientId.slice(0, 8) });
	}

	// Use WordPress block props with built-in supports
	const blockProps = useBlockProps({
		className: 'gallery-builder-editor',
	});

	// Handle media selection
	const onSelectMedia = (media: GalleryItem[]) => {
		const galleryItems = media.map((item) => ({
			id: item.id,
			url: item.url,
			alt: item.alt || '',
			caption: item.caption || '',
			title: item.title || '',
		}));
		setAttributes({ items: galleryItems });
	};

	// Handle caption update
	const updateCaption = (itemId: number, caption: string) => {
		const updatedItems = items.map((item) =>
			item.id === itemId ? { ...item, caption } : item
		);
		setAttributes({ items: updatedItems });
	};

	// Handle item removal
	const removeItem = (itemId: number) => {
		const updatedItems = items.filter((item) => item.id !== itemId);
		setAttributes({ items: updatedItems });
		if (currentSlide >= updatedItems.length) {
			setCurrentSlide(Math.max(0, updatedItems.length - 1));
		}
	};

	// Handle add more images
	const addMoreImages = (media: GalleryItem[]) => {
		const newItems = media.map((item) => ({
			id: item.id,
			url: item.url,
			alt: item.alt || '',
			caption: item.caption || '',
			title: item.title || '',
		}));
		setAttributes({ items: [...items, ...newItems] });
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Gallery Settings', 'jankx')} initialOpen={true}>
					<ToggleControl
						label={__('Autoplay', 'jankx')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>
					{autoplay && (
						<RangeControl
							label={__('Autoplay Delay (ms)', 'jankx')}
							value={autoplayDelay}
							onChange={(value) => setAttributes({ autoplayDelay: value })}
							min={1000}
							max={10000}
							step={500}
						/>
					)}
					<SelectControl
						label={__('Transition Effect', 'jankx')}
						value={transitionEffect}
						options={[
							{ label: __('Slide', 'jankx'), value: 'slide' },
							{ label: __('Fade', 'jankx'), value: 'fade' },
							{ label: __('Zoom', 'jankx'), value: 'zoom' },
						]}
						onChange={(value) => setAttributes({ transitionEffect: value })}
					/>
					<RangeControl
						label={__('Transition Duration (ms)', 'jankx')}
						value={transitionDuration}
						onChange={(value) => setAttributes({ transitionDuration: value })}
						min={200}
						max={2000}
						step={100}
					/>
				</PanelBody>

				<PanelBody title={__('Display Options', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Show Thumbnails', 'jankx')}
						checked={showThumbnails}
						onChange={(value) => setAttributes({ showThumbnails: value })}
					/>
					<ToggleControl
						label={__('Show Navigation Arrows', 'jankx')}
						checked={showNavigation}
						onChange={(value) => setAttributes({ showNavigation: value })}
					/>
					<ToggleControl
						label={__('Show Pagination', 'jankx')}
						checked={showPagination}
						onChange={(value) => setAttributes({ showPagination: value })}
					/>
					<ToggleControl
						label={__('Show Captions', 'jankx')}
						checked={showCaptions}
						onChange={(value) => setAttributes({ showCaptions: value })}
					/>
					{showThumbnails && (
						<SelectControl
							label={__('Thumbnail Position', 'jankx')}
							value={thumbnailPosition}
							options={[
								{ label: __('Top', 'jankx'), value: 'top' },
								{ label: __('Bottom', 'jankx'), value: 'bottom' },
								{ label: __('Left', 'jankx'), value: 'left' },
								{ label: __('Right', 'jankx'), value: 'right' },
							]}
							onChange={(value) => setAttributes({ thumbnailPosition: value })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Image Settings', 'jankx')} initialOpen={false}>
					<SelectControl
						label={__('Image Size', 'jankx')}
						value={imageSize}
						options={[
							{ label: __('Thumbnail', 'jankx'), value: 'thumbnail' },
							{ label: __('Medium', 'jankx'), value: 'medium' },
							{ label: __('Large', 'jankx'), value: 'large' },
							{ label: __('Full Size', 'jankx'), value: 'full' },
						]}
						onChange={(value) => setAttributes({ imageSize: value })}
					/>
					<SelectControl
						label={__('Aspect Ratio', 'jankx')}
						value={aspectRatio}
						options={[
							{ label: __('16:9', 'jankx'), value: '16:9' },
							{ label: __('4:3', 'jankx'), value: '4:3' },
							{ label: __('1:1', 'jankx'), value: '1:1' },
							{ label: __('3:2', 'jankx'), value: '3:2' },
							{ label: __('Free', 'jankx'), value: 'free' },
						]}
						onChange={(value) => setAttributes({ aspectRatio: value })}
					/>
					<SelectControl
						label={__('Caption Position', 'jankx')}
						value={captionPosition}
						options={[
							{ label: __('Overlay on Image', 'jankx'), value: 'overlay' },
							{ label: __('Below Image', 'jankx'), value: 'below' },
							{ label: __('Stack Below (50/50)', 'jankx'), value: 'stack' },
						]}
						onChange={(value) => setAttributes({ captionPosition: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Fullscreen Settings', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Fullscreen Button', 'jankx')}
						checked={enableFullscreen}
						onChange={(value) => setAttributes({ enableFullscreen: value })}
					/>
					{enableFullscreen && (
						<>
							<ToggleControl
								label={__('Fullscreen Autoplay', 'jankx')}
								checked={fullscreenAutoplay}
								onChange={(value) => setAttributes({ fullscreenAutoplay: value })}
							/>
							{fullscreenAutoplay && (
								<RangeControl
									label={__('Fullscreen Autoplay Delay (ms)', 'jankx')}
									value={fullscreenAutoplayDelay}
									onChange={(value) => setAttributes({ fullscreenAutoplayDelay: value })}
									min={1000}
									max={10000}
									step={500}
								/>
							)}
							<TextareaControl
								label={__('Fullscreen Text', 'jankx')}
								value={fullscreenText}
								onChange={(value) => setAttributes({ fullscreenText: value })}
								placeholder={__('Enter text to display in fullscreen mode...', 'jankx')}
								help={__('This text will be displayed in fullscreen slideshow mode', 'jankx')}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{items.length > 0 && (
				<BlockControls>
					<ToolbarGroup>
						<MediaUploadCheck>
							<MediaUpload
								multiple={true}
								onSelect={addMoreImages}
								allowedTypes={['image']}
								render={({ open }) => (
									<ToolbarButton
										label={__('Add More Images', 'jankx')}
										onClick={open}
										icon={plus}
									/>
								)}
							/>
						</MediaUploadCheck>
					</ToolbarGroup>
				</BlockControls>
			)}

			<div {...blockProps}>
				{items.length === 0 ? (
					<MediaPlaceholder
						multiple={true}
						onSelect={onSelectMedia}
						allowedTypes={['image']}
						labels={{
							title: __('Add Gallery Images', 'jankx'),
							instructions: __(
								'Select multiple images to create a professional gallery viewer',
								'jankx'
							),
						}}
					/>
				) : (
					<div className={`gallery-builder-preview caption-${captionPosition}`}>
						{/* Thumbnails */}
						{showThumbnails && thumbnailPosition === 'top' && (
							<div className="gallery-thumbnails top">
								{items.map((item, index) => (
									<div
										key={item.id}
										className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
										onClick={() => setCurrentSlide(index)}
									>
										<img src={item.url} alt={item.alt} />
									</div>
								))}
							</div>
						)}

						{/* Main Gallery Container */}
						<div className="gallery-main">
							{/* Navigation Arrows */}
							{showNavigation && items.length > 1 && (
								<>
									<button
										className="gallery-nav prev"
										onClick={() =>
											setCurrentSlide(
												currentSlide === 0 ? items.length - 1 : currentSlide - 1
											)
										}
									>
										‹
									</button>
									<button
										className="gallery-nav next"
										onClick={() =>
											setCurrentSlide(
												currentSlide === items.length - 1 ? 0 : currentSlide + 1
											)
										}
									>
										›
									</button>
								</>
							)}

							{/* Main Image */}
							<div className="gallery-slide">
								<div className="slide-image-container">
									<img
										src={items[currentSlide]?.url}
										alt={items[currentSlide]?.alt}
										className="main-image"
									/>
									<div className="slide-actions">
										<Button
											icon={edit}
											onClick={() => setEditingItem(items[currentSlide]?.id)}
											label={__('Edit Caption', 'jankx')}
										/>
										<Button
											icon={trash}
											onClick={() => removeItem(items[currentSlide]?.id)}
											label={__('Remove Image', 'jankx')}
										/>
									</div>
								</div>

								{/* Caption */}
								{showCaptions && (
									<div className="slide-caption">
										{editingItem === items[currentSlide]?.id ? (
											<RichText
												tagName="div"
												value={items[currentSlide]?.caption || ''}
												onChange={(value) =>
													updateCaption(items[currentSlide]?.id, value)
												}
												onBlur={() => setEditingItem(null)}
												placeholder={__('Enter caption...', 'jankx')}
												allowedFormats={['bold', 'italic', 'link']}
											/>
										) : (
											<div
												className="caption-display"
												onClick={() => setEditingItem(items[currentSlide]?.id)}
											>
												{items[currentSlide]?.caption || (
													<span className="caption-placeholder">
														{__('Click to add caption', 'jankx')}
													</span>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Thumbnails Bottom */}
						{showThumbnails && thumbnailPosition === 'bottom' && (
							<div className="gallery-thumbnails bottom">
								{items.map((item, index) => (
									<div
										key={item.id}
										className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
										onClick={() => setCurrentSlide(index)}
									>
										<img src={item.url} alt={item.alt} />
									</div>
								))}
							</div>
						)}

						{/* Controls */}
						<div className="gallery-controls">
							<div className="gallery-controls-left">
								{/* Fullscreen Button */}
								{enableFullscreen && (
									<Button
										onClick={() => {/* Fullscreen functionality will be handled by frontend JS */}}
										variant="secondary"
										className="fullscreen-button"
										data-fslightbox={galleryId}
									>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
											<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
										</svg>
										{fullscreenText || __('Xem tự động', 'jankx')}
									</Button>
								)}

								{/* Autoplay Button */}
								{autoplay && (
									<Button
										onClick={() => setAttributes({ autoplay: !autoplay })}
										variant="secondary"
									>
										{autoplay ? __('Stop Autoplay', 'jankx') : __('Start Autoplay', 'jankx')}
									</Button>
								)}
							</div>

							<div className="gallery-controls-right">
								{/* Pagination Numbers */}
								{showPagination && items.length > 1 && (
									<div className="gallery-pagination-numbers">
										{items.map((_, index) => (
											<button
												key={index}
												className={`pagination-number ${index === currentSlide ? 'active' : ''}`}
												onClick={() => setCurrentSlide(index)}
											>
												{index + 1}
											</button>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</Fragment>
	);
}
