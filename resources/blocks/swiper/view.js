/**
 * Swiper Block Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const swiperBlocks = document.querySelectorAll('.wp-block-jankx-swiper');

  swiperBlocks.forEach((block) => {
    const container = block.querySelector('.swiper');
    if (!container) return;

    const loadSwiper = async () => {
      if (typeof window.Swiper === 'undefined') {
        // Load CSS
        if (!document.querySelector('link[href*="swiper-bundle"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
          document.head.appendChild(link);
        }

        // Load JS
        if (!document.querySelector('script[src*="swiper-bundle"]')) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
      }

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

      // Initialize Swiper
      new window.Swiper(container, {
        modules: [
          window.Swiper.Navigation,
          window.Swiper.Pagination,
          window.Swiper.Autoplay,
          window.Swiper.EffectFade,
          window.Swiper.EffectCube,
          window.Swiper.EffectCoverflow,
          window.Swiper.EffectFlip,
          window.Swiper.EffectCards
        ].filter(Boolean),
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
        cardsEffect: { perSlideOffset: 8, perSlideRotate: 2 }
      });
    };

    loadSwiper();
  });
});
