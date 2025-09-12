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
		borderRadius
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

	// Create overlay content if enabled
	const overlayContent = showOverlayOnHover && (
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
			<InnerBlocks.Content />
		</div>
	);

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
