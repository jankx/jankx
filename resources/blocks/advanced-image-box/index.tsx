/**
 * WordPress dependencies
 */
import type { BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { image as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import type { AdvancedImageBoxAttributes } from './types';

const { name } = metadata;

export { metadata, name };

export const settings: BlockConfiguration<AdvancedImageBoxAttributes> = {
	icon,
	example: {
		attributes: {
			url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
			alt: __('Mont Blanc appears—still, snowy, and serene.'),
			showOverlayOnHover: true,
			overlayAnimation: 'fadeIn',
			overlayPosition: 'center'
		},
		innerBlocks: [
			{
				name: 'core/heading',
				attributes: {
					level: 3,
					content: __('Beautiful Mountain'),
					textAlign: 'center'
				}
			},
			{
				name: 'core/paragraph',
				attributes: {
					content: __('Discover the beauty of nature with this stunning mountain view.'),
					textAlign: 'center'
				}
			},
			{
				name: 'core/button',
				attributes: {
					text: __('Learn More'),
					className: 'is-style-outline',
					textAlign: 'center'
				}
			}
		]
	},
	edit,
	save,
	deprecated,
	merge: (a: AdvancedImageBoxAttributes, { url = '', alt = '' }: Partial<AdvancedImageBoxAttributes>) => ({
		...a,
		url: a.url || url,
		alt: a.alt || alt,
	}),
};

// Register the block
registerBlockType(name as string, settings);
