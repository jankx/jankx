/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	InnerBlocks,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { AdvancedImageBoxSaveProps } from './types';
import { validateBlockContent } from './validationUtils';

export default function save({ attributes, className }: AdvancedImageBoxSaveProps) {
	const {
		url,
		alt,
		title,
		id,
		width,
		height,
		aspectRatio,
		scale,
		href,
		linkTarget,
		rel,
		caption,
		showOverlayOnHover,
		overlayAnimation,
		overlayAnimationDuration,
		overlayAnimationDelay,
		overlayPosition,
		overlayBackground,
		overlayOpacity,
		imageHoverEffect,
		borderRadius,
		preset
	} = attributes;

	// Support presetOptions and provide a visible fallback when there is no image
	const presetOptions = (attributes as any).presetOptions || {};
	const hasImage = Boolean(url && String(url).trim() !== '');
	// Prefer preset titleBackground (used by bordered-frame), then overlayBackground
	const fallbackBg = String(presetOptions.titleBackground ?? overlayBackground ?? 'transparent');
	const fallbackMinHeight = height || '240px';

	// Validate content before saving
	const validation = validateBlockContent(attributes, []);

	if (!validation.isValid && validation.issues) {
		console.warn('Advanced Image Box validation issues:', validation.issues);
	}

	const borderProps = getBorderClassesAndStyles(attributes);
	const shadowProps = getShadowClassesAndStyles(attributes);

	const imageClasses = clsx(
		'wp-block-jankx-advanced-image-box__image',
		borderProps.className,
		{
			[`wp-image-${id}`]: !!id,
			[`has-hover-${imageHoverEffect}`]: imageHoverEffect && imageHoverEffect !== 'none',
		}
	);

	const imageStyle = {
		...borderProps.style,
		...shadowProps.style,
		aspectRatio,
		objectFit: scale,
		width,
		height,
		borderRadius,
	};

	const imageElement = hasImage ? (
		<img
			src={url}
			alt={alt || ''}
			title={title}
			className={imageClasses}
			style={imageStyle}
		/>
	) : (
		// Fallback element when no image is provided: show minimal structure and rely on preset CSS
		// Do not apply inline border-radius, background-color, or min-height to avoid forcing styles
		<div
			className={clsx('wp-block-jankx-advanced-image-box__no-image', imageClasses)}
			style={{
				// Keep border and shadow styles, but omit borderRadius if present
				...(() => {
					const tempStyle: Record<string, unknown> = { ...borderProps.style, ...shadowProps.style };
					// Remove borderRadius property if exists on borderProps.style
					if ('borderRadius' in tempStyle) {
						delete tempStyle.borderRadius;
					}
					return tempStyle;
				})(),
				// Keep aspect ratio/size information if necessary
				aspectRatio,
				objectFit: scale,
				width,
				height,
			}}>
			{!hasImage && alt && (
				<div
					className="wp-block-jankx-advanced-image-box__no-image__alt"
					style={{ color: String(presetOptions.titleColor ?? '#ffffff') }}
				>
					{alt}
				</div>
			)}
			{/* Inner blocks and preset elements will be rendered separately below */}
		</div>
	);

	// Always render inner blocks content - needed for all scenarios
	// This ensures inner blocks are saved regardless of preset/overlay settings
	const innerBlocksContent = (
		<div className="wp-block-jankx-advanced-image-box__overlay__content">
			<InnerBlocks.Content />
		</div>
	);

	// Create overlay content if enabled (but not when preset is active)
	const overlayContent = showOverlayOnHover && !preset && (
		<div
			className={clsx(
				'wp-block-jankx-advanced-image-box__overlay',
				`wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`,
				'animated',
				overlayAnimation
			)}
			style={{
				backgroundColor: overlayBackground,
				opacity: overlayOpacity,
				animationDuration: `${overlayAnimationDuration}ms`,
				animationDelay: `${overlayAnimationDelay}ms`,
			}}
		>
			{innerBlocksContent}
		</div>
	);

	// When preset is active, do not render the preset frame/title wrapper in saved output
	// The server-side render (render_callback) will insert the markup to avoid duplicate elements
	const presetContent = null;

	// When no preset and no overlay, render inner blocks in hidden container (for editing)
	const hiddenContent = !preset && !showOverlayOnHover && innerBlocksContent;

	// Wrap image with link if href is provided
	const wrappedImage = href ? (
		<a
			href={href}
			target={linkTarget}
			rel={rel}
			className="wp-block-jankx-advanced-image-box__link"
		>
			{imageElement}
		</a>
	) : (
		imageElement
	);

	const blockClasses = clsx(
		className,
		'wp-block-jankx-advanced-image-box',
		{
			'has-overlay': showOverlayOnHover,
			'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none',
		}
	);

	return (
		<figure { ...useBlockProps.save({ className: blockClasses }) }>
			{wrappedImage}
			{overlayContent}
			{/* preset content is injected server-side via render_callback; do not duplicate it here */}
			{hiddenContent}
			{caption && !RichText.isEmpty(caption) && (
				<RichText.Content
					className="wp-block-jankx-advanced-image-box__caption"
					tagName="figcaption"
					value={caption}
				/>
			)}
		</figure>
	);
}
