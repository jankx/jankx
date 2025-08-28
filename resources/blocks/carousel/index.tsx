import { registerBlockType } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import attributes from './attributes';
import icon from './icon';

import './style.scss';

import exampleImage1 from './example-1.webp';
import exampleImage2 from './example-2.webp';
import exampleImage3 from './example-3.webp';

registerBlockType('jankx/carousel', {
	apiVersion: 2,
	title: __('Carousel', 'jankx'),
	category: 'design',
	supports: {
		align: ['wide', 'full'],
		className: false,
	},
	attributes,
	providesContext: {
		'jankx/carousel-scaleFactor': 'scaleFactor',
		'jankx/carousel-backgroundColor': 'backgroundColor',
		'jankx/carousel-color': 'color',
	},
	edit: Edit,
	save,
	icon,
	example: {
		attributes: {
			title: __('Carousel', 'jankx'),
			hasDescription: true,
			description: sprintf('<p>%s</p>', __('This is a description.', 'jankx')),
			slidesPerView: '3',
			spaceBetween: '10',
			hasPagination: 'true',
			hasNavigation: 'true',
		},
		innerBlocks: [
			{
				name: 'jankx/slide',
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							url: exampleImage1,
							alt: __('Image', 'jankx'),
						},
					},
				],
			},
			{
				name: 'jankx/slide',
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							url: exampleImage2,
							alt: __('Image', 'jankx'),
						},
					},
				],
			},
			{
				name: 'jankx/slide',
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							url: exampleImage3,
							alt: __('Image', 'jankx'),
						},
					},
				],
			},
			{
				name: 'jankx/slide',
			},
		],
	},
});
