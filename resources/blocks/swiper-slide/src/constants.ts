import { applyFilters } from '@wordpress/hooks';

export const BLOCK_CLASS_NAME = 'jankx-swiper-slide';

export const ALLOWED_BLOCKS = applyFilters('jankx.swiper-slide.allowed_blocks', [
	'core/image',
	'core/paragraph',
	'core/heading',
	'core/group',
]);
