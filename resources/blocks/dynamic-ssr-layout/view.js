import EmblaCarousel from 'embla-carousel';

function initEmbla(root) {
  const carousels = root ? root.querySelectorAll('[data-embla-carousel]') : document.querySelectorAll('[data-embla-carousel]');
  carousels.forEach((el) => {
    const viewport = el.querySelector('.embla__viewport');
    const container = el.querySelector('.embla__container');
    if (!viewport || !container) return;

    const options = {};
    const slidesToScrollAttr = el.getAttribute('data-slides-to-scroll');
    const loopAttr = el.getAttribute('data-loop');
    const autoplayAttr = el.getAttribute('data-autoplay');
    const autoplayDelayAttr = el.getAttribute('data-autoplay-delay');

    if (slidesToScrollAttr) {
      const n = parseInt(slidesToScrollAttr, 10);
      if (!isNaN(n)) options.slidesToScroll = n;
    }
    if (loopAttr === 'true') {
      options.loop = true;
    }

    const embla = EmblaCarousel(viewport, options);

    const prevBtn = el.querySelector('.embla__button--prev');
    const nextBtn = el.querySelector('.embla__button--next');
    if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext());

    if (autoplayAttr === 'true') {
      const delay = Math.max(1000, parseInt(autoplayDelayAttr || '3000', 10));
      let timer = null;
      const start = () => {
        stop();
        timer = setInterval(() => embla.scrollNext(), delay);
      };
      const stop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };
      start();
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', start);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEmbla();
});

document.addEventListener('jankx:reinitialize-carousel', (e) => {
  const element = e?.detail?.element || null;
  initEmbla(element || undefined);
});

