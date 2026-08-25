/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	RichText,
	InnerBlocks,
} from '@wordpress/block-editor';

interface SaveProps {
	attributes: {
		triggerType: string;
		buttonType: string;
		modalId: string;
		modalShareObjectId: boolean;
		modalSharePostTitle: boolean;
		modalShareCurrentUrl: boolean;
		modalShareFeaturedImageId?: boolean;
		modalShareFeaturedImageUrl?: boolean;
		modalFeaturedImageSize?: string;
		formData: Array<{ key: string; value: string }>;
		formMappings?: Array<{ source: string; selector: string; mode?: 'value' | 'attribute'; attributeName?: string }>;
		text: string;
		url: string;
		title: string;
		linkTarget: string;
		rel: string;
		backgroundColor: string;
		textColor: string;
		gradient: string;
		style: Record<string, any>;
		useIconBlocks: boolean;
		iconPosition: string;
		showLabel: boolean;
		conditionType?: string;
		showForPostType?: string;
		hoverAnimation: string;
		unhoverAnimation: string;
		className?: string;
		renderIconOutside: boolean;
	};
}

/**
 * The save function for the Advanced Button Block.
 */
export default function Save(props: SaveProps) {
	const {
		triggerType = 'link',
		buttonType = 'button',
		modalId = '',
		modalShareObjectId = false,
		modalSharePostTitle = false,
		modalShareCurrentUrl = false,
		modalShareFeaturedImageId = false,
		modalShareFeaturedImageUrl = false,
		formData = [],
		formMappings = [],
		text,
		url,
		title,
		linkTarget,
		rel,
		backgroundColor,
		textColor,
		gradient,
		iconPosition = 'left',
		showLabel = true,
		conditionType = 'always',
		showForPostType = '',
		hoverAnimation = 'none',
		unhoverAnimation = 'none',
		renderIconOutside = false,
	} = props.attributes;

	// Always render the button - InnerBlocks.Content will handle inner blocks if they exist
	// Don't return null here because:
	// 1. If showLabel=true and text exists → render text
	// 2. If showLabel=true and no text but has inner blocks → InnerBlocks.Content will render them
	// 3. If showLabel=false → button can still have inner blocks (icon-only buttons)
	// We can't reliably check for inner blocks in save function, so we always render

	const blockProps = useBlockProps.save();

	// Get border props (border radius) from attributes.style.border
	const borderRadius = props.attributes.style?.border?.radius;
	const borderStyle: Record<string, any> = {};
	if (borderRadius) {
		if (typeof borderRadius === 'object') {
			// Individual corner radii
			const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius as any;
			borderStyle.borderRadius = `${topLeft || '0'} ${topRight || '0'} ${bottomRight || '0'} ${bottomLeft || '0'}`;
		} else {
			borderStyle.borderRadius = borderRadius;
		}
	}
	const borderProps = { className: '', style: borderStyle };


	// Check if button has no color settings
	const hasNoColorSettings = !backgroundColor &&
		!textColor &&
		!gradient &&
		!props.attributes.style?.color?.background &&
		!props.attributes.style?.color?.text &&
		!props.attributes.style?.color?.gradient;

	// Check style variants
	const isOutline = props.attributes.className?.includes('is-style-outline');
	const isTextLink = props.attributes.className?.includes('is-style-text-link');

	const buttonClasses = classnames('jankx-advanced-button__link', borderProps?.className, {
		[`has-${backgroundColor}-background-color`]: backgroundColor && !isOutline,
		[`has-${textColor}-color`]: textColor,
		[`has-${gradient}-gradient-background`]: gradient,
		[`icon-position-${iconPosition}`]: iconPosition,
		'is-default-colors': hasNoColorSettings,
		[`hover-ani-${hoverAnimation}`]: hoverAnimation !== 'none',
		[`unhover-ani-${unhoverAnimation}`]: unhoverAnimation !== 'none',
		// Add classes for custom colors (WordPress may add these automatically)
		'has-background': props.attributes.style?.color?.background || props.attributes.style?.color?.gradient,
		'has-text-color': props.attributes.style?.color?.text,
		// Modal trigger class
		'jankx-button-modal-trigger': triggerType === 'modal',
	});

	// Build button styles - include custom background/text colors from style.color
	const buttonStyles: Record<string, any> = {
		...(blockProps.style || {}),
		...borderProps?.style,
	};

	// Copy spacing (padding, margin) from blockProps if needed
	// Border radius is already included from borderProps.style above

	// Apply custom text color from style.color.text if set (highest priority)
	if (props.attributes.style?.color?.text) {
		buttonStyles.color = props.attributes.style.color.text;
	}

	// Apply gradient if set (gradient takes priority over background color)
	if (props.attributes.style?.color?.gradient) {
		buttonStyles.background = props.attributes.style.color.gradient;
		// Remove backgroundColor when gradient is set
		delete buttonStyles.backgroundColor;
	} else if (props.attributes.style?.color?.background) {
		// Only apply background color if no gradient is set
		buttonStyles.backgroundColor = props.attributes.style.color.background;
	}

	// For Outline style, force transparent background and apply border color
	if (isOutline) {
		delete buttonStyles.backgroundColor;
		delete buttonStyles.background;
		// Use text color for border color
		if (buttonStyles.color) {
			buttonStyles.borderColor = buttonStyles.color;
		}
	}

	// For Text Link style, force transparency and remove padding
	if (isTextLink) {
		delete buttonStyles.backgroundColor;
		delete buttonStyles.background;
		buttonStyles.border = 'none';
		buttonStyles.padding = '0';
	}

	// Sanitize text content to remove any nested anchor tags
	// This prevents invalid HTML like <a><a>text</a></a>
	const sanitizeText = (html: string): string => {
		if (!html) return '';
		// Remove any anchor tags but keep their content
		return html.replace(/<\/?a[^>]*>/gi, '');
	};

	const sanitizedText = text ? sanitizeText(text) : '';

	// Always render in same order - use CSS to control visual position
	const textMarkup = (
		<>
			{!renderIconOutside && (
				<span className="button-icon-wrapper">
					<InnerBlocks.Content />
				</span>
			)}
			{showLabel && (
				<RichText.Content
					tagName="span"
					className="button-text"
					value={sanitizedText}
				/>
			)}
		</>
	);

	const iconMarkup = renderIconOutside ? (
		<span className="button-icon-wrapper">
			<InnerBlocks.Content />
		</span>
	) : null;


	// Render button element based on trigger type
	let buttonElement = null;

	switch (triggerType) {
		case 'link':
			buttonElement = (
				<a
					className={buttonClasses}
					href={url || '#'}
					target={linkTarget || undefined}
					rel={rel || undefined}
					style={buttonStyles}
					title={title}
					data-condition-type={conditionType}
					data-show-for-post-type={showForPostType || undefined}
					data-trigger-type="link"
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{textMarkup}
				</a>
			);
			break;

		case 'button':
			buttonElement = (
				<button
					className={buttonClasses}
					type={buttonType as any}
					style={buttonStyles}
					title={title}
					data-condition-type={conditionType}
					data-show-for-post-type={showForPostType || undefined}
					data-trigger-type="button"
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{textMarkup}
				</button>
			);
			break;

		case 'detail-link':
			// href="#" will be replaced by PHP with actual permalink
			buttonElement = (
				<a
					className={buttonClasses + ' jankx-button-detail-link'}
					href="#"
					data-trigger-type="detail-link"
					data-condition-type={conditionType}
					data-show-for-post-type={showForPostType || undefined}
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{textMarkup}
				</a>
			);
			break;

		case 'modal':
			// Build data attributes object for Micromodal
			const modalDataAttrs: any = {
				'data-micromodal-trigger': modalId || '', // Micromodal standard attribute
				'data-modal-id': modalId || '', // Keep for backward compatibility
				'data-trigger-type': 'modal'
			};
			modalDataAttrs['data-condition-type'] = conditionType;
			if (showForPostType) {
				modalDataAttrs['data-show-for-post-type'] = showForPostType;
			}
			if (hoverAnimation !== 'none') {
				modalDataAttrs['data-hover-ani'] = hoverAnimation;
			}
			if (unhoverAnimation !== 'none') {
				modalDataAttrs['data-unhover-ani'] = unhoverAnimation;
			}

			// Add share data attributes if enabled
			if (modalShareObjectId) {
				modalDataAttrs['data-share-object-id'] = 'true';
			}
			if (modalSharePostTitle) {
				modalDataAttrs['data-share-post-title'] = 'true';
			}
			if (modalShareCurrentUrl) {
				modalDataAttrs['data-share-current-url'] = 'true';
			}
			if (modalShareFeaturedImageId) {
				modalDataAttrs['data-share-featured-image-id'] = 'true';
			}
			if (modalShareFeaturedImageUrl) {
				modalDataAttrs['data-share-featured-image-url'] = 'true';
				modalDataAttrs['data-featured-image-size'] = props.attributes.modalFeaturedImageSize || 'full';
			}

			// Add form mapping data if exists
			if (formMappings && formMappings.length > 0) {
				modalDataAttrs['data-form-mappings'] = JSON.stringify(formMappings);
			}

			buttonElement = (
				<button
					className={buttonClasses}
					type="button"
					style={buttonStyles}
					title={title}
					{...modalDataAttrs}
				>
					{textMarkup}
				</button>
			);
			break;
	}

	// Render wrapper with icon outside if enabled
	if (!renderIconOutside) {
		return <div {...blockProps}>{buttonElement}</div>;
	}

	return (
		<div {...blockProps}>
			{iconPosition === 'left' || iconPosition === 'top' ? iconMarkup : null}
			{buttonElement}
			{iconPosition === 'right' || iconPosition === 'bottom' ? iconMarkup : null}
		</div>
	);
}
