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

      // Initialize Swiper
      const swiper = new Swiper(container, {
        slidesPerView,
        spaceBetween,
        loop,
        speed,
        effect,
        autoplay: autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false
        } : false,
        navigation: navigation ? {
          nextEl: block.querySelector('.swiper-button-next'),
          prevEl: block.querySelector('.swiper-button-prev')
        } : false,
        pagination: pagination ? {
          el: block.querySelector('.swiper-pagination'),
          clickable: true
        } : false,
        fadeEffect: { crossFade: true },
        cubeEffect: { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },
        coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
        flipEffect: { slideShadows: true, limitRotation: true },
        cardsEffect: { perSlideOffset: 8, perSlideRotate: 2 },
        on: {
          init: function() {
            // Fix width for circle style banners to match height
            updateCircleBannerWidths(container);
          },
          slideChange: function() {
            updateCircleBannerWidths(container);
          },
          resize: function() {
            updateCircleBannerWidths(container);
          }
        }
      });
      
      // Function to update banner widths to match heights from Swiper block settings
      // For all banners (circles, banner, square), width should equal height from Swiper settings
      function updateCircleBannerWidths(swiperContainer) {
        // Get height from Swiper block settings (parent block)
        const swiperHeight = swiperContainer.dataset.swiperHeight;
        
        // Get all swiper banners (not just circles)
        const allBanners = swiperContainer.querySelectorAll('.swiper-banner');
        
        if (!swiperHeight || parseFloat(swiperHeight) <= 0) {
          // No height set in Swiper settings, remove width override to let Swiper handle it
          allBanners.forEach((banner) => {
            banner.style.removeProperty('width');
          });
          return;
        }
        
        // Set width = height for all banners from Swiper settings
        allBanners.forEach((banner) => {
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
