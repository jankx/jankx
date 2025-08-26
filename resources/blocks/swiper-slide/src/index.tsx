import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import Save from './save';
import icon from './icon';

type SwiperSlideAttributes = {
    imageId?: number;
    imageUrl?: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    linkUrl?: string;
    linkTarget?: string;
    className?: string;
};

registerBlockType<SwiperSlideAttributes>('jankx/swiper-slide', {
    title: __('Swiper Slide', 'jankx'),
    category: 'design',
    icon,
    description: __('Individual slide for the Swiper slider with image and content.', 'jankx'),
    keywords: ['slide', 'image', 'content'],
    textdomain: 'jankx',
    supports: {
        html: false,
        align: ['wide', 'full']
    },
    parent: ['jankx/swiper-slider'],
    attributes: {
        imageId: { type: 'number' },
        imageUrl: { type: 'string' },
        imageAlt: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        linkUrl: { type: 'string' },
        linkTarget: { type: 'string', default: '_self' },
        className: { type: 'string' }
    },
    edit: Edit,
    save: Save,
});
