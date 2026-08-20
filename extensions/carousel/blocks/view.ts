import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

(function () {
  function initCarousels() {
    const elements = document.querySelectorAll('.wp-block-jankx-embla-carousel');

    elements.forEach((el) => {
      if (el.dataset.emblaInitialized === 'true') return;
      el.dataset.emblaInitialized = 'true';

      const viewport = el.querySelector('.embla-carousel__viewport');
      if (!viewport) return;

      // Read settings from data attributes
      const loop = el.dataset.loop === 'true';
      const align = el.dataset.align || 'center';
      const isAutoplay = el.dataset.autoplay === 'true';
      const delay = parseInt(el.dataset.autoplayDelay || '4500', 10);
      const stopOnInteraction = el.dataset.stopOnInteraction === 'true';
      const stopOnHover = el.dataset.stopOnHover === 'true';
      const enableKeyboard = el.dataset.keyboard === 'true';
      const enableParallax = el.dataset.parallax === 'true';
      const duration = parseInt(el.dataset.duration || '25', 10);

      // Build plugins
      const plugins = [];
      if (isAutoplay) {
        plugins.push(
          Autoplay({
            delay,
            stopOnInteraction,
            stopOnMouseEnter: stopOnHover,
          })
        );
      }

      // Initialize Embla
      const embla = EmblaCarousel(viewport as HTMLElement, {
        loop,
        align,
        duration,
        dragFree: el.dataset.dragFree === 'true',
        watchDrag: el.dataset.draggable === 'true',
      }, plugins);

      // Navigation arrows
      const prevBtn = el.querySelector('[data-embla-prev]') as HTMLButtonElement | null;
      const nextBtn = el.querySelector('[data-embla-next]') as HTMLButtonElement | null;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => embla.scrollPrev());
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => embla.scrollNext());
      }

      const updateButtons = () => {
        if (prevBtn) {
          const disabled = !loop && !embla.canScrollPrev();
          prevBtn.disabled = disabled;
          prevBtn.setAttribute('aria-disabled', String(disabled));
        }
        if (nextBtn) {
          const disabled = !loop && !embla.canScrollNext();
          nextBtn.disabled = disabled;
          nextBtn.setAttribute('aria-disabled', String(disabled));
        }
      };

      // Dots pagination
      const dotsContainer = el.querySelector('[data-embla-dots]') as HTMLElement | null;
      const dotType = dotsContainer?.dataset.dotType || 'bullets';

      const buildDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';

        if (dotType === 'counter') {
          const counter = document.createElement('div');
          counter.className = 'embla-carousel__counter';
          counter.innerHTML = `<span class="is-active">01</span> / <span>00</span>`;
          dotsContainer.appendChild(counter);
          return;
        }

        const total = embla.scrollSnapList().length;
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.className = 'embla-carousel__dot';
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);

          if (dotType === 'numbers') {
            dot.textContent = String(i + 1);
          }

          dot.addEventListener('click', () => embla.scrollTo(i));
          dotsContainer.appendChild(dot);
        }
      };

      const updateDots = () => {
        if (!dotsContainer) return;
        const selected = embla.selectedScrollSnap();

        if (dotType === 'counter') {
          const counter = dotsContainer.querySelector('.embla-carousel__counter');
          if (counter) {
            const total = embla.scrollSnapList().length;
            counter.innerHTML = `<span class="is-active">${String(selected + 1).padStart(2, '0')}</span> / <span>${String(total).padStart(2, '0')}</span>`;
          }
          return;
        }

        const dots = dotsContainer.querySelectorAll('.embla-carousel__dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === selected);
        });
      };

      // Progress bar
      const progressBar = el.querySelector('[data-embla-progress]') as HTMLElement | null;
      const updateProgress = () => {
        if (!progressBar) return;
        const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
        progressBar.style.width = `${progress * 100}%`;
      };

      // Parallax effect
      const applyParallax = () => {
        if (!enableParallax) return;

        const engine = embla.internalEngine();
        const scrollProgress = embla.scrollProgress();
        const slidesInView = embla.slidesInView();

        embla.scrollSnapList().forEach((scrollSnap, snapIndex) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex];
          if (!slidesInSnap) return;

          slidesInSnap.forEach((slideIndex: number) => {
            if (!slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem: any) => {
                const target = loopItem.target();
                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
                  if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  }
                  if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                }
              });
            }

            const slideNode = embla.slideNodes()[slideIndex] as HTMLElement;
            if (slideNode) {
              const bgTranslate = diffToTarget * -100 * 0.35;
              const contentTranslate = diffToTarget * -100 * 0.18;

              slideNode.style.setProperty('--embla-parallax-bg', `${bgTranslate.toFixed(2)}%`);
              slideNode.style.setProperty('--embla-parallax-content', `${contentTranslate.toFixed(2)}%`);
            }
          });
        });
      };

      // Keyboard navigation
      if (enableKeyboard) {
        const container = el as HTMLElement;
        if (!container.hasAttribute('tabindex')) {
          container.setAttribute('tabindex', '0');
        }

        const handleKeyDown = (e: KeyboardEvent) => {
          const activeEl = document.activeElement;
          if (
            activeEl &&
            (activeEl.tagName === 'INPUT' ||
              activeEl.tagName === 'TEXTAREA' ||
              (activeEl as HTMLElement).contentEditable === 'true')
          ) {
            return;
          }

          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              embla.scrollPrev();
              break;
            case 'ArrowRight':
              e.preventDefault();
              embla.scrollNext();
              break;
            case 'Home':
              e.preventDefault();
              embla.scrollTo(0);
              break;
            case 'End':
              e.preventDefault();
              embla.scrollTo(embla.scrollSnapList().length - 1);
              break;
          }
        };

        container.addEventListener('keydown', handleKeyDown);

        // Also handle mouse hover for global keyboard
        let isHovered = false;
        container.addEventListener('mouseenter', () => { isHovered = true; });
        container.addEventListener('mouseleave', () => { isHovered = false; });
        window.addEventListener('keydown', (e) => {
          if (isHovered) handleKeyDown(e);
        });
      }

      // Events
      const onSelect = () => {
        updateButtons();
        updateDots();
        updateProgress();
      };

      const onScroll = () => {
        updateProgress();
        applyParallax();
      };

      embla.on('select', onSelect);
      embla.on('reInit', onSelect);
      embla.on('scroll', onScroll);
      embla.on('reInit', applyParallax);

      // Initialize
      buildDots();
      onSelect();
      onScroll();
      applyParallax();
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }

  // Re-init on Jankx content reload (AJAX)
  document.addEventListener('jankx:content-loaded', initCarousels);
})();
