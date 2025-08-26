import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import Save from './save';
import attributes from './attributes';
import icon from './icon';

type SwiperSliderAttributes = {
    slidesPerView: number;
    spaceBetween: number;
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    pagination: boolean;
    navigation: boolean;
    className?: string;
};

registerBlockType<SwiperSliderAttributes>('jankx/swiper-slider', {
    title: __('Swiper Slider', 'jankx'),
    category: 'design',
    icon,
    description: __('Responsive slider with Swiper.js for images, cards, and content.', 'jankx'),
    keywords: ['slider', 'carousel', 'swiper', 'slideshow'],
    textdomain: 'jankx',
    supports: {
        html: false,
        align: ['wide', 'full'],
        spacing: {
            margin: true,
            padding: true
        }
    },
    attributes,
    edit: Edit,
    save: Save,
});
