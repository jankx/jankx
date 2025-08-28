import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

export const TITLE_TAG = applyFilters('jankx.block-carousel.title.tag', 'h3');

export const HAS_TITLE_DEFAULT = applyFilters('jankx.block-carousel.has_title.default', true);
export const HAS_DESCRIPTION_DEFAULT = applyFilters('jankx.block-carousel.has_description.default', false);
export const HAS_PAGINATION_DEFAULT = applyFilters('jankx.block-carousel.has_pagination.default', false);
export const HAS_NAVIGATION_DEFAULT = applyFilters('jankx.block-carousel.has_navigation.default', false);

export const SLIDES_PER_VIEW_MAX = applyFilters('jankx.block-carousel.slides_per_view.max', 6);
export const SLIDES_PER_VIEW_DEFAULT = applyFilters('jankx.block-carousel.slides_per_view.default', 'auto');

export const SPACE_BETWEEN_DEFAULT = applyFilters('jankx.block-carousel.space_between', 30);

export const ALLOW_PAGINATION = applyFilters('jankx.block-carousel.allow_pagination', true);
export const ALLOW_NAVIGATION = applyFilters('jankx.block-carousel.allow_navigation', true);
export const ALLOW_AUTOPLAY = applyFilters('jankx.block-carousel.allow_autoplay', true);
export const ALLOW_LOOP = applyFilters('jankx.block-carousel.allow_loop', true);

export const AUTOPLAY_DEFAULT = applyFilters('jankx.block-carousel.autoplay_delay', false);
export const LOOP_DEFAULT = applyFilters('jankx.block-carousel.loop.default', false);

export const ALLOWED_BLOCKS = ['jankx/slide'];

export const TEMPLATE = applyFilters('jankx.block-carousel.template', [['jankx/slide', {}]]);

// Integration with Logos block
export const SCALE_FACTOR_DEFAULT = applyFilters('jankx.block-logos.scale_factor.default', 525);
export const COLOR_SCHEMES = applyFilters('jankx.block-logos.color.schemes', [
	{
		name: __('Dark', 'jankx'),
		color: '#000',
	},
	{
		name: __('Light', 'jankx'),
		color: '#fff',
	},
]);
export const BACKGROUND_COLOR_DEFAULT = applyFilters('jankx.block-logos.background_color.default', undefined);
export const COLOR_DEFAULT = applyFilters('jankx.block-logos.color.default', undefined);
