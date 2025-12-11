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

	const imageElement = (
		<img
			src={url}
			alt={alt || ''}
			title={title}
			className={imageClasses}
			style={imageStyle}
		/>
	);

	// Always render inner blocks content (for PHP to extract when preset is active)
	// When preset is active, overlay won't be shown but inner blocks will be extracted by PHP
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

	// When preset is active, render inner blocks in hidden container for PHP to extract
	const presetInnerBlocks = preset && !showOverlayOnHover && innerBlocksContent;

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
			{presetInnerBlocks}
			{!RichText.isEmpty(caption) && (
				<RichText.Content
					className="wp-block-jankx-advanced-image-box__caption"
					tagName="figcaption"
					value={caption}
				/>
			)}
		</figure>
	);
}
