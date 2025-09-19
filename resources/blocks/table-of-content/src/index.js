import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

registerBlockType( metadata, {
	icon: 'list-view',
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
