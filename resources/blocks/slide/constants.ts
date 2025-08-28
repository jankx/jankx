import { applyFilters } from '@wordpress/hooks';

export const BLOCK_CLASS_NAME = 'wpd-block-slide';

export const ALLOWED_BLOCKS = applyFilters('wpd.block-slide.allowed_blocks', [
	'wpd/block-card',
	'wpd/block-logo',
	'core/image',
]);
