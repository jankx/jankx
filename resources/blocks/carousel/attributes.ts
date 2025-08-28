import { BLOCK_CLASS_NAME } from './constants';
import {
	HAS_TITLE_DEFAULT,
	HAS_DESCRIPTION_DEFAULT,
	SLIDES_PER_VIEW_DEFAULT,
	SPACE_BETWEEN_DEFAULT,
	HAS_PAGINATION_DEFAULT,
	HAS_NAVIGATION_DEFAULT,
	AUTOPLAY_DEFAULT,
	LOOP_DEFAULT,
	// Logo integration
	SCALE_FACTOR_DEFAULT,
	BACKGROUND_COLOR_DEFAULT,
	COLOR_DEFAULT,
} from './constants/editor';

export default {
	hasTitle: {
		type: 'boolean',
		default: HAS_TITLE_DEFAULT,
	},
	title: {
		type: 'string',
		source: 'html',
		selector: `.${BLOCK_CLASS_NAME}__title`,
	},
	hasDescription: {
		type: 'boolean',
		default: HAS_DESCRIPTION_DEFAULT,
	},
	description: {
		type: 'string',
		source: 'html',
		selector: `.${BLOCK_CLASS_NAME}__description`,
	},
	slidesPerView: {
		type: 'string',
		default: SLIDES_PER_VIEW_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-slides-per-view',
	},
	spaceBetween: {
		type: 'string',
		default: SPACE_BETWEEN_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-space-between',
	},
	hasPagination: {
		type: 'string',
		default: HAS_PAGINATION_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-has-pagination',
	},
	hasNavigation: {
		type: 'string',
		default: HAS_NAVIGATION_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-has-navigation',
	},
	shouldAutoplay: {
		type: 'string',
		default: AUTOPLAY_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-should-autoplay',
	},
	shouldLoop: {
		type: 'string',
		default: LOOP_DEFAULT,
		source: 'attribute',
		selector: `.${BLOCK_CLASS_NAME} .swiper`,
		attribute: 'data-should-loop',
	},
	// Logo integration
	scaleFactor: {
		type: 'number',
		default: SCALE_FACTOR_DEFAULT,
	},
	backgroundColor: {
		type: 'string',
		default: BACKGROUND_COLOR_DEFAULT,
	},
	color: {
		type: 'string',
		default: COLOR_DEFAULT,
	},
};
