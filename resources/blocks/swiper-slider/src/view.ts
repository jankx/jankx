/* eslint-disable import/no-unresolved */

import domReady from '@wordpress/dom-ready';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { BLOCK_CLASS_NAME } from './constants';

domReady(async () => {
    const elements = document.querySelectorAll(`.${BLOCK_CLASS_NAME} .swiper-container`);

    elements.forEach((element) => {
        const container = element as HTMLElement;
        const slidesPerView = parseInt(container.dataset.slidesPerView || '1');
        const spaceBetween = parseInt(container.dataset.spaceBetween || '30');
        const autoplay = container.dataset.autoplay === 'true';
        const autoplayDelay = parseInt(container.dataset.autoplayDelay || '3000');
        const loop = container.dataset.loop === 'true';
        const pagination = container.dataset.pagination === 'true';
        const navigation = container.dataset.navigation === 'true';

        const swiperConfig: any = {
            modules: [Navigation, Pagination, Autoplay],
            slidesPerView,
            spaceBetween,
            loop,
        };

        if (autoplay) {
            swiperConfig.autoplay = {
                delay: autoplayDelay,
                disableOnInteraction: false,
            };
        }

        if (pagination) {
            swiperConfig.pagination = {
                el: container.querySelector('.swiper-pagination'),
                clickable: true,
            };
        }

        if (navigation) {
            swiperConfig.navigation = {
                nextEl: container.querySelector('.swiper-button-next'),
                prevEl: container.querySelector('.swiper-button-prev'),
            };
        }

        new Swiper(container, swiperConfig);
    });
});
