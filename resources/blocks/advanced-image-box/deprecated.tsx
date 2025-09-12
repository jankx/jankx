/**
 * Deprecated versions of Advanced Image Box block
 */

import { AdvancedImageBoxAttributes } from './types';

/**
 * Migrate old attributes to new structure
 */
export const migrateAttributes = (oldAttributes: any): AdvancedImageBoxAttributes => {
	return {
		...oldAttributes,
		// Map old attributes to new structure
		showOverlayOnHover: oldAttributes.showOverlay !== undefined ? oldAttributes.showOverlay : true,
		overlayAnimation: oldAttributes.animation || 'fadeIn',
		overlayPosition: oldAttributes.position || 'center',
		overlayBackground: oldAttributes.overlayColor || 'rgba(0, 0, 0, 0.7)',
		overlayOpacity: oldAttributes.opacity !== undefined ? oldAttributes.opacity : 1,
		imageHoverEffect: oldAttributes.hoverEffect || 'zoom',
		borderRadius: oldAttributes.radius || '0px'
	};
};

/**
 * Version 1 - Initial version with basic overlay support
 */
export const v1 = {
	attributes: {
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src'
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt'
		},
		title: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'title'
		},
		id: {
			type: 'number'
		},
		showOverlay: {
			type: 'boolean',
			default: true
		},
		animation: {
			type: 'string',
			default: 'fadeIn'
		},
		position: {
			type: 'string',
			default: 'center'
		},
		overlayColor: {
			type: 'string',
			default: 'rgba(0, 0, 0, 0.7)'
		},
		opacity: {
			type: 'number',
			default: 1
		},
		hoverEffect: {
			type: 'string',
			default: 'zoom'
		},
		radius: {
			type: 'string',
			default: '0px'
		}
	},
	save({ attributes }: { attributes: any }) {
		const {
			url,
			alt,
			title,
			id,
			showOverlay,
			animation,
			position,
			overlayColor,
			opacity,
			hoverEffect,
			radius
		} = attributes;

		const imageElement = (
			<img
				src={url}
				alt={alt || ''}
				title={title}
				className={`wp-block-jankx-advanced-image-box__image ${hoverEffect !== 'none' ? `has-hover-${hoverEffect}` : ''}`}
				style={{
					borderRadius: radius
				}}
			/>
		);

		const overlayContent = showOverlay && (
			<div
				className={`wp-block-jankx-advanced-image-box__overlay wp-block-jankx-advanced-image-box__overlay--${position} animated ${animation}`}
				style={{
					backgroundColor: overlayColor,
					opacity: opacity
				}}
			>
				{/* Inner blocks content would be here */}
			</div>
		);

		return (
			<figure className="wp-block-jankx-advanced-image-box">
				{imageElement}
				{overlayContent}
			</figure>
		);
	}
};

/**
 * Version 2 - Added inner blocks support
 */
export const v2 = {
	attributes: {
		...v1.attributes,
		innerBlocks: {
			type: 'array',
			default: []
		}
	},
	save({ attributes }: { attributes: any }) {
		const {
			url,
			alt,
			title,
			id,
			showOverlay,
			animation,
			position,
			overlayColor,
			opacity,
			hoverEffect,
			radius,
			innerBlocks
		} = attributes;

		const imageElement = (
			<img
				src={url}
				alt={alt || ''}
				title={title}
				className={`wp-block-jankx-advanced-image-box__image ${hoverEffect !== 'none' ? `has-hover-${hoverEffect}` : ''}`}
				style={{
					borderRadius: radius
				}}
			/>
		);

		const overlayContent = showOverlay && (
			<div
				className={`wp-block-jankx-advanced-image-box__overlay wp-block-jankx-advanced-image-box__overlay--${position} animated ${animation}`}
				style={{
					backgroundColor: overlayColor,
					opacity: opacity
				}}
			>
				{/* Render inner blocks */}
				{innerBlocks && innerBlocks.map((block: any, index: number) => (
					<div key={index} className={`wp-block-${block.name.replace('/', '-')}`}>
						{/* Basic block rendering - in real implementation, this would use proper block rendering */}
						{block.attributes?.content && (
							<div dangerouslySetInnerHTML={{ __html: block.attributes.content }} />
						)}
					</div>
				))}
			</div>
		);

		return (
			<figure className="wp-block-jankx-advanced-image-box">
				{imageElement}
				{overlayContent}
			</figure>
		);
	}
};

/**
 * Export deprecated versions
 */
export default [v2, v1];
