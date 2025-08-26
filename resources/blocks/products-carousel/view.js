/**
 * Products Carousel Frontend Script
 * Initializes Swiper.js carousel for products
 */

document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.jankx-products-carousel');

    carousels.forEach(function(carousel) {
        if (!carousel) return;

        // Get carousel options from data attributes
        const options = {
            slidesPerView: parseInt(carousel.dataset.slidesPerView) || 3,
            spaceBetween: parseInt(carousel.dataset.spaceBetween) || 20,
            loop: carousel.dataset.loop === 'true',
            autoplay: carousel.dataset.autoplay === 'true' ? {
                delay: parseInt(carousel.dataset.autoplaySpeed) || 3000,
                disableOnInteraction: false
            } : false,
            navigation: carousel.dataset.navigation === 'true' ? {
                nextEl: carousel.querySelector('.swiper-button-next'),
                prevEl: carousel.querySelector('.swiper-button-prev')
            } : false,
            pagination: carousel.dataset.pagination === 'true' ? {
                el: carousel.querySelector('.swiper-pagination'),
                clickable: true
            } : false,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: Math.min(2, parseInt(carousel.dataset.slidesPerView) || 3),
                    spaceBetween: 15
                },
                1024: {
                    slidesPerView: parseInt(carousel.dataset.slidesPerView) || 3,
                    spaceBetween: parseInt(carousel.dataset.spaceBetween) || 20
                }
            }
        };

        // Initialize Swiper
        if (typeof Swiper !== 'undefined') {
            new Swiper(carousel, options);
        } else {
            // Fallback for when Swiper is not loaded
            console.warn('Swiper.js not loaded for products carousel');
        }
    });
});

// Handle responsive behavior
window.addEventListener('resize', function() {
    const carousels = document.querySelectorAll('.jankx-products-carousel');
    carousels.forEach(function(carousel) {
        if (carousel.swiper) {
            carousel.swiper.update();
        }
    });
});
