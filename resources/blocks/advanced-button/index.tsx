/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { button as buttonIcon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

const settings = {
	...metadata,
	icon: buttonIcon,
	example: {
		attributes: {
			text: __('Advanced Button', 'jankx'),
			backgroundColor: '#007cba',
			textColor: '#ffffff',
			style: {
				border: {
					radius: '4px',
				},
				spacing: {
					padding: {
						top: '12px',
						right: '24px',
						bottom: '12px',
						left: '24px',
					},
				},
			},
		},
	},
	edit: Edit,
	save: Save,
};

/**
 * Register the Advanced Button Block.
 */
registerBlockType(metadata.name, settings as any);

