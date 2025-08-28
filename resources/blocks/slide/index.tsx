import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import save from './save';
import icon from './icon';

registerBlockType('jankx/slide', {
	apiVersion: 2,
	title: 'Slide',
	category: 'design',
	attributes: {
		className: {
			type: 'string',
			default: ''
		}
	},
	supports: {
		className: false,
	},
	edit: Edit,
	save,
	icon,
	parent: ['jankx/carousel'],
});
