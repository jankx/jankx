import { applyFilters } from '@wordpress/hooks';

export const BLOCK_CLASS_NAME = 'jankx-slide';

export const ALLOWED_BLOCKS = applyFilters('jankx.slide.allowed_blocks', [
	'core/image',
]);
