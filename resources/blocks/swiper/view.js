/**
 * Swiper Block Frontend JavaScript
 */

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

document.addEventListener('DOMContentLoaded', () => {
  const swiperBlocks = document.querySelectorAll('.wp-block-jankx-swiper');

  swiperBlocks.forEach((block) => {
    const container = block.querySelector('.swiper');
    if (!container) return;

    const loadSwiper = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

            // Get settings from data attributes
      const slidesPerView = parseInt(container.dataset.slidesPerView) || 1;
      const slidesPerViewTablet = parseInt(container.dataset.slidesPerViewTablet) || slidesPerView;
      const slidesPerViewMobile = parseInt(container.dataset.slidesPerViewMobile) || slidesPerView;
      const spaceBetween = parseInt(container.dataset.spaceBetween) || 30;      
      const loop = container.dataset.loop === 'true';
      const autoplay = container.dataset.autoplay === 'true';
      const autoplayDelay = parseInt(container.dataset.autoplayDelay) || 3000;  
      const speed = parseInt(container.dataset.speed) || 300;
      const navigation = container.dataset.navigation === 'true';
      const pagination = container.dataset.pagination === 'true';
      const effect = container.dataset.effect || 'slide';
      
      // Get banner style settings from data attributes
      const bannerStyle = container.dataset.bannerStyle || 'default';
      const bannerTextColor = container.dataset.bannerTextColor || '#ffffff';
      const bannerBackgroundColor = container.dataset.bannerBackgroundColor || 'rgba(0,0,0,0.5)';
      const bannerPadding = parseInt(container.dataset.bannerPadding) || 20;
      const bannerBorderRadius = parseInt(container.dataset.bannerBorderRadius) || 0;
      
      // Apply banner style class and CSS variables to the block
      block.classList.add(`banner-style-${bannerStyle}`);
      block.style.setProperty('--banner-style', bannerStyle);
      block.style.setProperty('--banner-text-color', bannerTextColor);
      block.style.setProperty('--banner-background-color', bannerBackgroundColor);
      block.style.setProperty('--banner-padding', `${bannerPadding}px`);
      block.style.setProperty('--banner-border-radius', `${bannerBorderRadius}px`);

            // Get navigation and pagination elements
      const nextEl = block.querySelector('.swiper-button-next');
      const prevEl = block.querySelector('.swiper-button-prev');
      const paginationEl = block.querySelector('.swiper-pagination');

      // Initialize Swiper
      const swiperConfig = {
        slidesPerView,
        spaceBetween,
        loop,
        speed,
        effect,
        breakpoints: {
          320: {
            slidesPerView: slidesPerViewMobile,
            spaceBetween: spaceBetween
          },
          768: {
            slidesPerView: slidesPerViewTablet,
            spaceBetween: spaceBetween
          },
          1024: {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetween
          }
        },
        autoplay: autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false
        } : false,
        fadeEffect: { crossFade: true },
        cubeEffect: { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },                                                                  
        coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },                                                               
        flipEffect: { slideShadows: true, limitRotation: true },
        cardsEffect: { perSlideOffset: 8, perSlideRotate: 2 }
      };

      // Only add navigation if enabled and elements exist
      if (navigation && nextEl && prevEl) {
        swiperConfig.navigation = {
          nextEl,
          prevEl
        };
      }

      // Only add pagination if enabled and element exists
      if (pagination && paginationEl) {
        swiperConfig.pagination = {
          el: paginationEl,
          clickable: true
        };
      }

            // Add on callbacks to config
      swiperConfig.on = {
        init: function() {
          // Fix width for circle/square style banners to match height
          updateCircleBannerWidths(container);
        },
        slideChange: function() {
          updateCircleBannerWidths(container);
        },
        resize: function() {
          updateCircleBannerWidths(container);
        }
      };

      const swiper = new Swiper(container, swiperConfig);

      // Function to update banner widths to match heights from Swiper block settings
      // Only for circles and square banner styles
      function updateCircleBannerWidths(swiperContainer) {
        // Get height from Swiper block settings (parent block)
        const swiperHeight = swiperContainer.dataset.swiperHeight;

        if (!swiperHeight || parseFloat(swiperHeight) <= 0) {
          // No height set, remove width override
          const circleBanners = swiperContainer.querySelectorAll('.swiper-banner--circles, .swiper-banner--square');
          circleBanners.forEach((banner) => {
            banner.style.removeProperty('width');
          });
          return;
        }

        // Only apply width=height for circles and square styles
        const circleBanners = swiperContainer.querySelectorAll('.swiper-banner--circles, .swiper-banner--square');
        circleBanners.forEach((banner) => {
          // Set width to match height from Swiper block settings
          banner.style.setProperty('width', `${swiperHeight}px`, 'important');
        });
      }

      // Initial call to fix widths
      updateCircleBannerWidths(container);
    };

    loadSwiper();
  });
});
