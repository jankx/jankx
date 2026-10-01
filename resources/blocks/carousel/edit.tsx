import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	ColorPicker,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useSelect, dispatch } from '@wordpress/data';
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
import type { CarouselProps } from './types';
import {
	NavButtonStyleSettings,
	NavIconSettings,
	NavPreviewButton,
} from '../../shared/components/CarouselNavSettings';

// Utility function to convert hex to RGB
const hexToRgb = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: { r: 0, g: 0, b: 0 };
};

const OVERLAY_BLOCK = 'jankx/carousel-inner-blocks-overlay';
const SLIDE_BLOCK = 'jankx/carousel-slide';
const BANNER_BLOCK = 'jankx/carousel-banner';

export default function Edit({
	attributes,
	setAttributes,
	clientId,
}: CarouselProps): JSX.Element {
	const {
		slidesPerView,
		slidesPerViewTablet,
		slidesPerViewMobile,
		spaceBetween,
		loop,
		autoplay,
		autoplayDelay,
		speed,
		navigation,
		pagination,
		height,
		minHeight,
		contentMode,
		galleryImages,
		bannerStyle,
		bannerTextColor,
		bannerBackgroundColor,
		bannerPadding,
		bannerBorderRadius,
		gradientOverlay,
		gradientColor,
		gradientOpacity,
		gradientHeight,
		className,
		fitViewportMinusHeader = false,
		fullHeight = false,
		arrowsPosition = 'inside',
		alwaysShowArrows = false,
		...navAttributes
	} = attributes;

	const [activeIndex, setActiveIndex] = useState(0);
	const seededRef = useRef(false);

	// Style variation (registered as native block styles in block.json).
	const styleVariation = useMemo(() => {
		const match = className?.match(/is-style-(\w+)/);
		return match ? match[1] : 'default';
	}, [className]);

	const { hasInnerBlocks, innerBlocks, slideCount } = useSelect(
		(select: any) => {
			const block = select('core/block-editor')?.getBlock?.(clientId);
			const inner = block?.innerBlocks || [];
			return {
				hasInnerBlocks: inner.length > 0,
				innerBlocks: inner,
				slideCount: inner.filter((b: any) => b.name !== OVERLAY_BLOCK)
					.length,
			};
		},
		[clientId]
	);

	// Index (among slides) of the inner block currently selected in the editor,
	// or -1 when the selection is outside this carousel. Keeps the visible
	// slide in sync with what the user is editing.
	const selectedSlideIndex = useSelect((select: any) => {
		const editor = select('core/block-editor');
		if (!editor || typeof editor.getSelectedBlock !== 'function') {
			return -1;
		}
		const selected = editor.getSelectedBlock();
		if (!selected || !selected.clientId) return -1;

		const chain: any[] = [];
		let current = editor.getBlock(selected.clientId);
		while (current && current.clientId !== clientId) {
			chain.push(current);
			if (!current.parentId) return -1;
			current = editor.getBlock(current.parentId);
		}
		if (!current || chain.length === 0) return -1;

		const topChild = chain[chain.length - 1];
		const block = editor.getBlock(clientId);
		if (!block) return -1;

		let index = -1;
		for (const inner of block.innerBlocks) {
			if (inner.name === OVERLAY_BLOCK) continue;
			index++;
			if (inner.clientId === topChild.clientId) return index;
		}
		return -1;
	}, [clientId]);

	const slides = useMemo(
		() => innerBlocks.filter((b: any) => b.name !== OVERLAY_BLOCK),
		[innerBlocks]
	);

	// How far the track can slide: show `slidesPerView` slides at once.
	const perView = Math.max(1, Math.ceil(slidesPerView || 1));
	const maxIndex = Math.max(0, slideCount - perView);

	// Follow selection into a slide.
	useEffect(() => {
		if (selectedSlideIndex >= 0 && selectedSlideIndex <= maxIndex) {
			setActiveIndex((prev) =>
				prev === selectedSlideIndex ? prev : selectedSlideIndex
			);
		}
	}, [selectedSlideIndex, maxIndex]);

	// Keep the active index in range when slides are added/removed.
	useEffect(() => {
		setActiveIndex((prev) => (prev > maxIndex ? maxIndex : prev));
	}, [maxIndex]);

	// Seed new carousels with two empty slides so the block is immediately
	// usable (mirrors the `template` behaviour, but only for slide mode).
	useEffect(() => {
		if (seededRef.current) return;
		seededRef.current = true;
		if (contentMode !== 'slides' || hasInnerBlocks) return;
		dispatch('core/block-editor').replaceInnerBlocks(clientId, [
			createBlock(SLIDE_BLOCK),
			createBlock(SLIDE_BLOCK),
		]);
	}, [contentMode, hasInnerBlocks, clientId]);

	const goTo = (index: number) => {
		if (slideCount <= 0) return;
		let next = index;
		if (next > maxIndex) next = loop ? 0 : maxIndex;
		if (next < 0) next = loop ? maxIndex : 0;
		setActiveIndex(next);
	};

	const addSlide = () => {
		dispatch('core/block-editor').replaceInnerBlocks(clientId, [
			...innerBlocks,
			createBlock(SLIDE_BLOCK),
		]);
	};

	const removeSlide = (slideClientId: string) => {
		dispatch('core/block-editor').replaceInnerBlocks(
			clientId,
			innerBlocks.filter((b: any) => b.clientId !== slideClientId)
		);
	};

	const jumpToSlide = (index: number, slideClientId: string) => {
		setActiveIndex(index);
		dispatch('core/block-editor').selectBlock(slideClientId);
	};

	// Handle gallery image selection
	const onSelectGalleryImages = (images: any[]) => {
		const galleryData = images.map((img) => ({
			id: img.id,
			url: img.url,
			alt: img.alt || '',
			caption: img.caption || '',
		}));

		setAttributes({ galleryImages: galleryData });

		// Create carousel-banner blocks for each image
		const bannerBlocks = images.map((img) =>
			createBlock(BANNER_BLOCK, {
				imageId: img.id,
				imageUrl: img.url,
				imageAlt: img.alt || '',
				imageCaption: img.caption || '',
			})
		);

		// Replace inner blocks with banner blocks
		dispatch('core/block-editor').replaceInnerBlocks(
			clientId,
			bannerBlocks
		);
	};

	const gradientRgb = hexToRgb(gradientColor || '#000000');

	// One slide-step of the track, in % + px of the track width.
	const trackOffset = `calc(-${activeIndex} * ((100% - ${
		(perView - 1) * spaceBetween
	}px) / ${perView} + ${spaceBetween}px))`;

	const blockProps = useBlockProps({
		className: [
			'carousel-block',
			`banner-style-${bannerStyle}`,
			gradientOverlay ? 'has-gradient-overlay' : '',
			className || '',
			fitViewportMinusHeader ? 'fit-vh-minus-header' : '',
			fullHeight ? 'is-full-height' : '',
			arrowsPosition !== 'inside'
				? `carousel-arrows-position-${arrowsPosition}`
				: '',
		]
			.filter(Boolean)
			.join(' '),
		style: {
			'--carousel-height': fullHeight ? '100vh' : `${height}px`,
			'--carousel-min-height': `${minHeight}px`,
			'--banner-style': bannerStyle,
			'--banner-text-color': bannerTextColor,
			'--banner-background-color': bannerBackgroundColor,
			'--banner-padding': `${bannerPadding}px`,
			'--banner-border-radius': `${bannerBorderRadius}px`,
			'--gradient-overlay-enabled': gradientOverlay ? '1' : '0',
			'--gradient-color-r': gradientRgb.r,
			'--gradient-color-g': gradientRgb.g,
			'--gradient-color-b': gradientRgb.b,
			'--gradient-opacity': gradientOpacity,
			'--gradient-height': `${gradientHeight}%`,
			'--slides-per-view-desktop': slidesPerView,
			'--slides-per-view-tablet': slidesPerViewTablet,
			'--slides-per-view-mobile': slidesPerViewMobile,
			'--space-between': `${spaceBetween}px`,
		} as React.CSSProperties,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'carousel-wrapper' },
		{
			allowedBlocks:
				contentMode === 'slides'
					? [SLIDE_BLOCK, OVERLAY_BLOCK]
					: [BANNER_BLOCK, OVERLAY_BLOCK],
			templateLock: false,
			orientation: 'horizontal',
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const prevDisabled = !loop && activeIndex <= 0;
	const nextDisabled = !loop && activeIndex >= maxIndex;

	const renderArrows = (side: 'prev' | 'next') => (
		<NavPreviewButton
			side={side}
			attributes={navAttributes as any}
			disabled={side === 'prev' ? prevDisabled : nextDisabled}
			onClick={() => goTo(side === 'prev' ? activeIndex - 1 : activeIndex + 1)}
		/>
	);

	const dotCount = maxIndex + 1;

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Content', 'jankx')} initialOpen={true}>
					<SelectControl
						label={__('Content type', 'jankx')}
						value={contentMode}
						options={[
							{
								label: __(
									'Slides — editable blocks',
									'jankx'
								),
								value: 'slides',
							},
							{
								label: __(
									'Image gallery — pick photos',
									'jankx'
								),
								value: 'gallery',
							},
						]}
						onChange={(value: string) =>
							setAttributes({
								contentMode: value as
									| 'slides'
									| 'gallery',
							})
						}
						help={__(
							'Slides: add and edit each slide like normal blocks. Gallery: select a set of photos once and banner slides are generated automatically.',
							'jankx'
						)}
					/>

					{contentMode === 'gallery' && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectGalleryImages}
								allowedTypes={['image']}
								multiple={true}
								value={galleryImages.map((img) => img.id)}
								render={({ open }: { open: () => void }) => (
									<Button
										variant="primary"
										onClick={open}
										style={{
											width: '100%',
											marginTop: '10px',
										}}
									>
										{galleryImages.length > 0
											? __('Change Images', 'jankx')
											: __('Select Images', 'jankx')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					)}
				</PanelBody>

				{contentMode === 'slides' && (
					<PanelBody title={__('Slides', 'jankx')} initialOpen={true}>
						{slides.length === 0 ? (
							<p className="components-base-control__help">
								{__(
									'No slides yet — add the first one below.',
									'jankx'
								)}
							</p>
						) : (
							<ul className="jx-carousel-slide-list">
								{slides.map((slide: any, index: number) => (
									<li
										key={slide.clientId}
										className={
											index === activeIndex
												? 'is-active'
												: ''
										}
									>
										<button
											type="button"
											className="jx-carousel-slide-list__jump"
											onClick={() =>
												jumpToSlide(
													index,
													slide.clientId
												)
											}
										>
											<span className="jx-carousel-slide-list__index">
												{index + 1}
											</span>
											<span className="jx-carousel-slide-list__label">
												{slide.name === BANNER_BLOCK
													? __('Banner', 'jankx')
													: __('Slide', 'jankx')}
											</span>
										</button>
										<button
											type="button"
											className="jx-carousel-slide-list__remove"
											aria-label={__(
												'Delete slide',
												'jankx'
											)}
											onClick={() =>
												removeSlide(slide.clientId)
											}
										>
											<svg
												viewBox="0 0 24 24"
												width="14"
												height="14"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
											</svg>
										</button>
									</li>
								))}
							</ul>
						)}
						<Button
							variant="primary"
							onClick={addSlide}
							style={{ width: '100%', marginTop: '10px' }}
						>
							{__('Add slide', 'jankx')}
						</Button>
					</PanelBody>
				)}

				<PanelBody
					title={__('Slider settings', 'jankx')}
					initialOpen={true}
				>
					{styleVariation === 'carousel' ||
					styleVariation === 'testimonial' ? (
						<>
							<RangeControl
								label={__(
									'Slides Per View (Desktop)',
									'jankx'
								)}
								value={slidesPerView}
								onChange={(val: number) =>
									setAttributes({ slidesPerView: val })
								}
								min={1}
								max={6}
								step={1}
								help={__(
									'Number of slides visible on desktop screens (≥1024px)',
									'jankx'
								)}
							/>
							<RangeControl
								label={__('Slides Per View (Tablet)', 'jankx')}
								value={slidesPerViewTablet}
								onChange={(val: number) =>
									setAttributes({ slidesPerViewTablet: val })
								}
								min={1}
								max={4}
								step={1}
								help={__(
									'Number of slides visible on tablet screens (768px - 1023px)',
									'jankx'
								)}
							/>
							<RangeControl
								label={__('Slides Per View (Mobile)', 'jankx')}
								value={slidesPerViewMobile}
								onChange={(val: number) =>
									setAttributes({ slidesPerViewMobile: val })
								}
								min={1}
								max={2}
								step={1}
								help={__(
									'Number of slides visible on mobile screens (<768px)',
									'jankx'
								)}
							/>
						</>
					) : (
						<RangeControl
							label={__('Slides Per View', 'jankx')}
							value={slidesPerView}
							onChange={(val: number) =>
								setAttributes({ slidesPerView: val })
							}
							min={1}
							max={4}
							step={1}
						/>
					)}

					<RangeControl
						label={__('Space Between (px)', 'jankx')}
						value={spaceBetween}
						onChange={(val: number) =>
							setAttributes({ spaceBetween: val })
						}
						min={0}
						max={100}
						step={10}
					/>

					<RangeControl
						label={__('Speed (ms)', 'jankx')}
						value={speed}
						onChange={(val: number) =>
							setAttributes({ speed: val })
						}
						min={100}
						max={2000}
						step={100}
					/>

					<RangeControl
						label={__('Height (px)', 'jankx')}
						value={height}
						onChange={(val?: number) =>
							setAttributes({ height: val || 400 })
						}
						min={50}
						max={1000}
						step={50}
						help={__(
							'Height for desktop (max-height on mobile)',
							'jankx'
						)}
					/>

					<RangeControl
						label={__('Min Height (px)', 'jankx')}
						value={minHeight}
						onChange={(val?: number) =>
							setAttributes({ minHeight: val || 50 })
						}
						min={50}
						max={600}
						step={50}
						help={__('Minimum height on mobile devices', 'jankx')}
					/>
					<ToggleControl
						label={__('Fit Viewport (Minus Header)', 'jankx')}
						checked={!!fitViewportMinusHeader}
						onChange={(val: boolean) =>
							setAttributes({ fitViewportMinusHeader: val })
						}
						help={__(
							'Khi bật, Carousel sẽ lấp đầy phần còn lại của viewport sau header.',
							'jankx'
						)}
					/>

					<ToggleControl
						label={__('Full Viewport Height (100vh)', 'jankx')}
						checked={!!fullHeight}
						onChange={(val: boolean) =>
							setAttributes({ fullHeight: val })
						}
						help={__(
							'Bật để Carousel cao bằng toàn bộ màn hình (thường dùng cho Hero).',
							'jankx'
						)}
					/>

					<ToggleControl
						label={__('Loop', 'jankx')}
						checked={loop}
						onChange={(val: boolean) =>
							setAttributes({ loop: val })
						}
					/>

					<ToggleControl
						label={__('Autoplay', 'jankx')}
						checked={autoplay}
						onChange={(val: boolean) =>
							setAttributes({ autoplay: val })
						}
					/>

					{autoplay && (
						<RangeControl
							label={__('Autoplay Delay (ms)', 'jankx')}
							value={autoplayDelay}
							onChange={(val: number) =>
								setAttributes({ autoplayDelay: val })
							}
							min={1000}
							max={10000}
							step={500}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Navigation', 'jankx')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show arrows', 'jankx')}
						checked={navigation}
						onChange={(val: boolean) =>
							setAttributes({ navigation: val })
						}
					/>
					<ToggleControl
						label={__('Show pagination dots', 'jankx')}
						checked={pagination}
						onChange={(val: boolean) =>
							setAttributes({ pagination: val })
						}
					/>

					{navigation && (
						<>
							<SelectControl
								label={__('Arrows position', 'jankx')}
								value={arrowsPosition}
								options={[
									{
										label: __('Inside (sides)', 'jankx'),
										value: 'inside',
									},
									{
										label: __('Outside edges', 'jankx'),
										value: 'outside',
									},
									{
										label: __('Bottom', 'jankx'),
										value: 'bottom',
									},
								]}
								onChange={(value: string) =>
									setAttributes({
										arrowsPosition: value as
											| 'inside'
											| 'outside'
											| 'bottom',
									})
								}
							/>
							<ToggleControl
								label={__('Always show arrows', 'jankx')}
								help={__(
									'Always keep buttons visible even when at the start or end of slides.',
									'jankx'
								)}
								checked={alwaysShowArrows}
								onChange={(val: boolean) =>
									setAttributes({ alwaysShowArrows: val })
								}
							/>
							<NavIconSettings
								attributes={navAttributes as any}
								setAttributes={
									setAttributes as any
								}
							/>
							<NavButtonStyleSettings
								attributes={navAttributes as any}
								setAttributes={
									setAttributes as any
								}
							/>
						</>
					)}
				</PanelBody>

				{(styleVariation === 'banner' ||
					contentMode === 'gallery') && (
					<PanelBody
						title={__('Banner style', 'jankx')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Banner Style', 'jankx')}
							value={bannerStyle}
							options={[
								{
									label: __('Default', 'jankx'),
									value: 'default',
								},
								{
									label: __('Circles', 'jankx'),
									value: 'circles',
								},
								{
									label: __('Square', 'jankx'),
									value: 'square',
								},
								{
									label: __('Banner', 'jankx'),
									value: 'banner',
								},
							]}
							onChange={(val: string) =>
								setAttributes({ bannerStyle: val })
							}
						/>

						<div style={{ marginBottom: '16px' }}>
							<label
								style={{
									display: 'block',
									marginBottom: '8px',
									fontWeight: 'bold',
								}}
							>
								{__('Text Color', 'jankx')}
							</label>
							<ColorPicker
								color={bannerTextColor || '#ffffff'}
								onChange={(color: string) =>
									setAttributes({ bannerTextColor: color })
								}
								enableAlpha={false}
							/>
						</div>

						<div style={{ marginBottom: '16px' }}>
							<label
								style={{
									display: 'block',
									marginBottom: '8px',
									fontWeight: 'bold',
								}}
							>
								{__('Background Color', 'jankx')}
							</label>
							<ColorPicker
								color={bannerBackgroundColor || '#000000'}
								onChange={(color: string) =>
									setAttributes({
										bannerBackgroundColor: color,
									})
								}
								enableAlpha={false}
							/>
						</div>

						<RangeControl
							label={__('Padding (px)', 'jankx')}
							value={bannerPadding}
							onChange={(val: number) =>
								setAttributes({ bannerPadding: val })
							}
							min={0}
							max={50}
							step={5}
						/>

						<RangeControl
							label={__('Border Radius (px)', 'jankx')}
							value={bannerBorderRadius}
							onChange={(val: number) =>
								setAttributes({ bannerBorderRadius: val })
							}
							min={0}
							max={20}
							step={1}
						/>

						<ToggleControl
							label={__('Enable Gradient Overlay', 'jankx')}
							checked={!!gradientOverlay}
							onChange={(val: boolean) =>
								setAttributes({ gradientOverlay: val })
							}
							help={__(
								'Add a gradient overlay from bottom to top with decreasing transparency',
								'jankx'
							)}
						/>

						{gradientOverlay && (
							<>
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											display: 'block',
											marginBottom: '8px',
											fontWeight: 'bold',
										}}
									>
										{__('Gradient Color', 'jankx')}
									</label>
									<ColorPicker
										color={gradientColor || '#000000'}
										onChange={(color: string) =>
											setAttributes({
												gradientColor: color,
											})
										}
										enableAlpha={false}
									/>
								</div>

								<RangeControl
									label={__('Gradient Opacity', 'jankx')}
									value={gradientOpacity}
									onChange={(val: number) =>
										setAttributes({ gradientOpacity: val })
									}
									min={0}
									max={1}
									step={0.1}
									help={__(
										'Transparency of the gradient (0 = fully transparent, 1 = fully opaque)',
										'jankx'
									)}
								/>

								<RangeControl
									label={__('Gradient Height (%)', 'jankx')}
									value={gradientHeight}
									onChange={(val: number) =>
										setAttributes({ gradientHeight: val })
									}
									min={10}
									max={100}
									step={5}
									help={__(
										'Height of the gradient overlay as percentage of slide height',
										'jankx'
									)}
								/>
							</>
						)}
					</PanelBody>
				)}
			</InspectorControls>

			<div className="embla">
				{!hasInnerBlocks && (
					<div className="carousel-empty-hint">
						{__(
							'Carousel trống — nhấn nút + để thêm slide hoặc banner.',
							'jankx'
						)}
					</div>
				)}

				<div
					{...innerBlocksProps}
					className={`${innerBlocksProps.className} embla__container`}
					style={
						{
							'--jx-track-offset': trackOffset,
							transform: `translateX(var(--jx-track-offset))`,
							transition: 'transform 350ms ease',
						} as React.CSSProperties
					}
				/>

				{navigation && slideCount > 1 && arrowsPosition === 'inside' && (
					<>
						{renderArrows('prev')}
						{renderArrows('next')}
					</>
				)}

				{pagination && dotCount > 1 && (
					<div className="embla__dots">
						{Array.from({ length: dotCount }, (_, index) => (
							<button
								key={index}
								type="button"
								className={`embla__dot${
									index === activeIndex
										? ' is-active'
										: ''
								}`}
								aria-label={__(
									'Go to slide',
									'jankx'
								)}
								onClick={() => goTo(index)}
							/>
						))}
					</div>
				)}
			</div>

			{navigation && slideCount > 1 && arrowsPosition === 'outside' && (
				<>
					{renderArrows('prev')}
					{renderArrows('next')}
				</>
			)}

			{navigation && slideCount > 1 && arrowsPosition === 'bottom' && (
				<div className="carousel-arrows-bottom-row">
					{renderArrows('prev')}
					{renderArrows('next')}
				</div>
			)}
		</div>
	);
}
