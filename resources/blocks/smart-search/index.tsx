/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { search as searchIcon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

const settings = {
	...metadata,
	icon: searchIcon,
	example: {
		attributes: {
			placeholder: __('Search...', 'jankx'),
			enableAutoSuggestion: true,
		},
	},
	edit: Edit,
	save: Save,
};

/**
 * Register the Smart Search Block.
 */
registerBlockType(metadata.name, settings as any);

