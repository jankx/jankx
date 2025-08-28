/* eslint-disable import/no-unresolved */

import domReady from '@wordpress/dom-ready';

import { BLOCK_CLASS_NAME } from './constants';

domReady(async () => {
	console.log('Carousel view script loaded');

	const elements = document.querySelectorAll(`.${BLOCK_CLASS_NAME} .swiper`);
	console.log('Found carousel elements:', elements.length);

	if (!elements.length) {
		console.log('No carousel elements found');
		return;
	}

	// Get Swiper from global window
	const Swiper = (window as any).Swiper;
	if (!Swiper) {
		console.error('Swiper not found in global scope. Make sure Swiper CDN is loaded.');
		return;
	}

	console.log('Swiper from global:', Swiper);

	(window as any).jankx = (window as any).jankx || {};
	(window as any).jankx.blocks = (window as any).jankx.blocks || {};
	(window as any).jankx.blocks.carousel = (window as any).jankx.blocks.carousel || [];

	const handler = async (element: Element) => {
		console.log('Handler called for element:', element);

		// Cast to HTMLElement to access dataset
		const htmlElement = element as HTMLElement;
		console.log('HTML element dataset:', htmlElement.dataset);

		const {
			slidesPerView = 'auto',
			spaceBetween = '0',
			hasPagination,
			hasNavigation,
			shouldAutoplay,
			shouldLoop,
		} = htmlElement.dataset;

		console.log('Carousel settings:', {
			slidesPerView,
			spaceBetween,
			hasPagination,
			hasNavigation,
			shouldAutoplay,
			shouldLoop
		});

		// Modules are now installed directly in Swiper constructor

		console.log('Creating Swiper instance...');
		try {
			const swiperInstance = new Swiper(element as HTMLElement, {
				// Install modules - Swiper 11 bundle includes all modules by default
				modules: [],
				// Optional parameters
				slidesPerView: slidesPerView !== 'auto' ? parseInt(slidesPerView, 10) : slidesPerView,
				spaceBetween: parseInt(spaceBetween, 10),
				loop: shouldLoop === 'true',

				// Navigation arrows
				navigation: hasNavigation === 'true' ? {
					nextEl: '[data-swiper-button-next]',
					prevEl: '[data-swiper-button-prev]',
				} : false,

				// Pagination
				pagination: hasPagination === 'true' ? {
					el: '.swiper-pagination',
					clickable: true,
				} : false,

				// Autoplay
				autoplay: shouldAutoplay === 'true' ? {
					delay: 3000,
					disableOnInteraction: false,
				} : false,
			});
			console.log('Swiper instance created successfully:', swiperInstance);
			(window as any).jankx.blocks.carousel.push(swiperInstance);
		} catch (error) {
			console.error('Error creating Swiper instance:', error);
		}
	};

	if (typeof window.IntersectionObserver === 'undefined') {
		[].map.call(elements, handler);

		return;
	}

	const observer = new window.IntersectionObserver((entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (!entry.isIntersecting) {
				return;
			}

			handler(entry.target);

			observer.unobserve(entry.target);
		});
	});

	[].map.call(elements, (element: Element) => {
		observer.observe(element);
	});
});
