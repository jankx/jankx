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
		text,
		url,
		title,
		linkTarget,
		rel,
		backgroundColor,
		textColor,
		gradient,
		useIconBlocks = false,
		iconPosition = 'left',
		showLabel = true,
	} = props.attributes;

	// Always render the button - InnerBlocks.Content will handle inner blocks if they exist
	// Don't return null here because:
	// 1. If showLabel=true and text exists → render text
	// 2. If showLabel=true and no text but has inner blocks → InnerBlocks.Content will render them
	// 3. If showLabel=false → button can still have inner blocks (icon-only buttons)
	// We can't reliably check for inner blocks in save function, so we always render

	const blockProps = useBlockProps.save();

	// Check if button has no color settings
	const hasNoColorSettings = !backgroundColor &&
	                           !textColor &&
	                           !gradient &&
	                           !props.attributes.style?.color?.background &&
	                           !props.attributes.style?.color?.text &&
	                           !props.attributes.style?.color?.gradient;

	const buttonClasses = classnames('jankx-advanced-button__link', {
		[`has-${backgroundColor}-background-color`]: backgroundColor,
		[`has-${textColor}-color`]: textColor,
		[`has-${gradient}-gradient-background`]: gradient,
		[`icon-position-${iconPosition}`]: iconPosition,
		'has-base-color': hasNoColorSettings,
		// Add classes for custom colors (WordPress may add these automatically)
		'has-background': props.attributes.style?.color?.background || props.attributes.style?.color?.gradient,
		'has-text-color': props.attributes.style?.color?.text,
	});

	// Build button styles - include custom background/text colors from style.color
	const buttonStyles: Record<string, any> = {};
	
	// Copy padding and other spacing from blockProps
	if (blockProps.style) {
		Object.keys(blockProps.style).forEach((key) => {
			if (key.startsWith('padding') || key.startsWith('margin')) {
				buttonStyles[key] = blockProps.style[key];
			}
		});
	}
	
	// Apply custom background color from style.color.background if set
	if (props.attributes.style?.color?.background) {
		buttonStyles.backgroundColor = props.attributes.style.color.background;
	}
	
	// Apply custom text color from style.color.text if set
	if (props.attributes.style?.color?.text) {
		buttonStyles.color = props.attributes.style.color.text;
	}
	
	// Apply gradient if set (gradient takes priority over background color)
	if (props.attributes.style?.color?.gradient) {
		buttonStyles.background = props.attributes.style.color.gradient;
		// Remove backgroundColor when gradient is set
		delete buttonStyles.backgroundColor;
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
			<span className="button-icon-wrapper">
				<InnerBlocks.Content />
			</span>
			{showLabel && (
				<RichText.Content
					tagName="span"
					className="button-text"
					value={sanitizedText}
				/>
			)}
		</>
	);

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
					data-trigger-type="link"
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
					data-trigger-type="button"
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
					style={buttonStyles}
					title={title}
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

			// Add share data attributes if enabled
			// These will be read by the modal's view.js when triggered
			if (modalShareObjectId) {
				modalDataAttrs['data-share-object-id'] = 'true';
				modalDataAttrs['data-current-object-id'] = '{{CURRENT_POST_ID}}';
			}
			if (modalSharePostTitle) {
				modalDataAttrs['data-share-post-title'] = 'true';
				modalDataAttrs['data-current-post-title'] = '{{CURRENT_POST_TITLE}}';
			}
			if (modalShareCurrentUrl) {
				modalDataAttrs['data-share-current-url'] = 'true';
				modalDataAttrs['data-current-url'] = '{{CURRENT_POST_URL}}';
			}

			buttonElement = (
				<button
					className={buttonClasses + ' jankx-button-modal-trigger'}
					type="button"
					{...modalDataAttrs}
					style={buttonStyles}
					title={title}
				>
					{textMarkup}
				</button>
			);
			break;

		default:
			buttonElement = (
				<a
					className={buttonClasses}
					href="#"
					style={buttonStyles}
					title={title}
					data-trigger-type="link"
				>
					{textMarkup}
				</a>
			);
	}

	return (
		<div {...blockProps}>
			{buttonElement}
		</div>
	);
}
