import EmblaCarousel from 'embla-carousel';

document.addEventListener('DOMContentLoaded', () => {
  const swiperBlocks = document.querySelectorAll('.wp-block-jankx-swiper');

  swiperBlocks.forEach((block) => {
    const container = block.querySelector('.embla');
    if (!container) return;

    const loadSwiper = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      const applyViewportMinusHeader = () => {
        if (!block.classList.contains('fit-vh-minus-header')) {
          return;
        }
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const computed = Math.max(0, viewportHeight - headerHeight);
        block.style.setProperty('--swiper-height', `${computed}px`);
        container.dataset.swiperHeight = `${computed}`;
      };

      applyViewportMinusHeader();
      window.addEventListener('resize', applyViewportMinusHeader, { passive: true });
      window.addEventListener('orientationchange', applyViewportMinusHeader, { passive: true });

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
      const isMobileViewport = (window.innerWidth || document.documentElement.clientWidth) <= 768;
      const slideNodes = container.querySelectorAll('.embla__slide').length 
        ? container.querySelectorAll('.embla__slide') 
        : container.querySelectorAll('.swiper-slide');
      const slidesCount = slideNodes.length;
      const initialEffect = isMobileViewport && ['cube', 'flip', 'coverflow'].includes(effect) ? 'slide' : effect;
      const spaceBetweenMobile = Math.min(spaceBetween, 16);
      const spaceBetweenTablet = Math.min(spaceBetween, 24);
      const adjustedSpeed = slidesCount > 6 ? Math.min(speed, 400) : speed;
      const useAutoplay = autoplay && slidesCount <= 10;
      const finalAutoplayDelay = Math.max(autoplayDelay, 4000);

      const bannerStyle = container.dataset.bannerStyle || 'default';
      const bannerTextColor = container.dataset.bannerTextColor || '#ffffff';
      const bannerBackgroundColor = container.dataset.bannerBackgroundColor || 'rgba(0,0,0,0.5)';
      const bannerPadding = parseInt(container.dataset.bannerPadding) || 20;
      const bannerBorderRadius = parseInt(container.dataset.bannerBorderRadius) || 0;

      const gradientOverlay = container.dataset.gradientOverlay === 'true';
      const gradientColor = container.dataset.gradientColor || '#000000';
      const gradientOpacity = parseFloat(container.dataset.gradientOpacity) || 0.7;
      const gradientHeight = parseInt(container.dataset.gradientHeight) || 60;

      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };

      const gradientRgb = hexToRgb(gradientColor);

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
      block.style.setProperty('--space-between', `${spaceBetween}px`);

      const nextEl = block.querySelector('.embla__button--next');
      const prevEl = block.querySelector('.embla__button--prev');
      const paginationEl = block.querySelector('.embla__dots');

      container.classList.add('embla__viewport');
      const track = container.querySelector('.embla__container') || container.querySelector('.swiper-wrapper');
      if (track) {
        track.classList.add('embla__container');
      }

      const embla = EmblaCarousel(container, {
        loop: loop,
        duration: adjustedSpeed,
        align: 'start'
      });

      if (navigation && nextEl && prevEl) {
        nextEl.addEventListener('click', () => embla.scrollNext(), { passive: true });
        prevEl.addEventListener('click', () => embla.scrollPrev(), { passive: true });
      }

      let autoplayTimer = null;
      const startAutoplay = () => {
        if (!useAutoplay) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          if (embla.canScrollNext()) {
            embla.scrollNext();
          } else {
            embla.scrollTo(0);
          }
        }, finalAutoplayDelay);
      };
      const stopAutoplay = () => {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      };
      startAutoplay();
      container.addEventListener('pointerdown', () => stopAutoplay(), { passive: true });

      let bullets = [];
      const setupPagination = () => {
        if (!pagination || !paginationEl) return;
        const slides = embla.slideNodes();
        paginationEl.innerHTML = '';
        bullets = slides.map((_, index) => {
          const b = document.createElement('span');
          b.className = 'embla__dot';
          b.addEventListener('click', () => embla.scrollTo(index), { passive: true });
          paginationEl.appendChild(b);
          return b;
        });
        setActiveBullet(embla.selectedScrollSnap());
      };
      const setActiveBullet = (index) => {
        bullets.forEach((b, i) => {
          if (i === index) {
            b.classList.add('is-active');
          } else {
            b.classList.remove('is-active');
          }
        });
      };
      setupPagination();
      embla.on('select', () => {
        setActiveBullet(embla.selectedScrollSnap());
        updateCircleBannerWidths(container);
      });
      embla.on('reInit', () => {
        setupPagination();
        updateCircleBannerWidths(container);
      });

      function updateCircleBannerWidths(swiperContainer) {
        const swiperHeight = swiperContainer.dataset.swiperHeight;

        if (!swiperHeight || parseFloat(swiperHeight) <= 0) {
          const circleBanners = swiperContainer.querySelectorAll('.embla-banner--circles, .embla-banner--square');
          circleBanners.forEach((banner) => {
            banner.style.removeProperty('width');
          });
          return;
        }

        const circleBanners = swiperContainer.querySelectorAll('.embla-banner--circles, .embla-banner--square');
        circleBanners.forEach((banner) => {
          banner.style.setProperty('width', `${swiperHeight}px`, 'important');
        });
      }

      updateCircleBannerWidths(container);
    };

    loadSwiper();
  });
}); 
