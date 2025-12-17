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

      // Fit viewport minus header: compute height dynamically if enabled via class
      const applyViewportMinusHeader = () => {
        if (!block.classList.contains('fit-vh-minus-header')) {
          return;
        }
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const computed = Math.max(0, viewportHeight - headerHeight);
        // Apply to CSS var used by styles
        block.style.setProperty('--swiper-height', `${computed}px`);
        // Also set dataset for circle/square banners width sync
        container.dataset.swiperHeight = `${computed}`;
      };

      // Apply at start and on resize
      applyViewportMinusHeader();
      window.addEventListener('resize', applyViewportMinusHeader, { passive: true });

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
      
      // Get gradient overlay settings from data attributes
      const gradientOverlay = container.dataset.gradientOverlay === 'true';
      const gradientColor = container.dataset.gradientColor || '#000000';
      const gradientOpacity = parseFloat(container.dataset.gradientOpacity) || 0.7;
      const gradientHeight = parseInt(container.dataset.gradientHeight) || 60;
      
      // Utility function to convert hex to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      
      // Convert gradient color to RGB
      const gradientRgb = hexToRgb(gradientColor);
      
      // Apply banner style class and CSS variables to the block
      block.classList.add(`banner-style-${bannerStyle}`);
      if (gradientOverlay) {
        block.classList.add('has-gradient-overlay');
      }
      block.style.setProperty('--banner-style', bannerStyle);
      block.style.setProperty('--banner-text-color', bannerTextColor);
      block.style.setProperty('--banner-background-color', bannerBackgroundColor);
      block.style.setProperty('--banner-padding', `${bannerPadding}px`);
      block.style.setProperty('--banner-border-radius', `${bannerBorderRadius}px`);
      block.style.setProperty('--gradient-overlay-enabled', gradientOverlay ? '1' : '0');
      block.style.setProperty('--gradient-color-r', gradientRgb.r);
      block.style.setProperty('--gradient-color-g', gradientRgb.g);
      block.style.setProperty('--gradient-color-b', gradientRgb.b);
      block.style.setProperty('--gradient-opacity', gradientOpacity);
      block.style.setProperty('--gradient-height', `${gradientHeight}%`);

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
