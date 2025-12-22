/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./blocks/dynamic-data-layout/view.js ***!
  \********************************************/
// Vanilla JS Carousel with CSS Scroll Snap for Dynamic Data Layout
function initDynamicDataCarousel(root) {
  const carousels = root ? root.querySelectorAll('.wp-block-jankx-dynamic-data-layout.dynamic-data-layout--carousel') : document.querySelectorAll('.wp-block-jankx-dynamic-data-layout.dynamic-data-layout--carousel');
  carousels.forEach(carousel => {
    const container = carousel.querySelector('.carousel-container');
    if (!container) return;

    // Get configuration from data attributes or CSS variables
    const slidesPerView = parseInt(carousel.getAttribute('data-slides-per-view')) || parseInt(getComputedStyle(carousel).getPropertyValue('--slides-per-view')) || 1;
    const spaceBetween = parseInt(carousel.getAttribute('data-space-between')) || parseInt(getComputedStyle(carousel).getPropertyValue('--space-between')) || 16;
    const autoplay = carousel.getAttribute('data-autoplay') === 'true';
    const autoplayDelay = Math.max(3000, parseInt(carousel.getAttribute('data-autoplay-delay')) || 5000);
    const showArrows = carousel.classList.contains('has-arrows');
    const showDots = carousel.classList.contains('has-dots');

    // Set CSS variables
    container.style.setProperty('--slides-per-view', slidesPerView);
    container.style.setProperty('--space-between', `${spaceBetween}px`);

    // Create navigation buttons
    if (showArrows) {
      createNavigationButtons(carousel, container);
    }

    // Create pagination dots
    if (showDots) {
      createPaginationDots(carousel, container);
    }

    // Setup autoplay
    if (autoplay) {
      setupAutoplay(carousel, container, autoplayDelay);
    }

    // Setup scroll event listeners
    setupScrollEvents(carousel, container);

    // Setup drag functionality
    setupDragScroll(container);
  });
}
function createNavigationButtons(carousel, container) {
  // Create prev button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav carousel-prev';
  prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
  prevBtn.addEventListener('click', () => {
    container.scrollBy({
      left: -container.offsetWidth,
      behavior: 'smooth'
    });
  });

  // Create next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav carousel-next';
  nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
  nextBtn.addEventListener('click', () => {
    container.scrollBy({
      left: container.offsetWidth,
      behavior: 'smooth'
    });
  });
  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);
}
function createPaginationDots(carousel, container) {
  const slides = container.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return;
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    if (index === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      const slideWidth = slides[0].offsetWidth;
      const gap = parseInt(getComputedStyle(container).gap) || 0;
      const scrollPosition = index * (slideWidth + gap);
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
  });
  carousel.appendChild(dotsContainer);
}
function setupAutoplay(carousel, container, delay) {
  let autoplayInterval;
  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 1) {
        // Reached end, scroll to beginning
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        container.scrollBy({
          left: container.offsetWidth,
          behavior: 'smooth'
        });
      }
    }, delay);
  };
  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  // Start autoplay
  startAutoplay();

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Pause on touch
  carousel.addEventListener('touchstart', stopAutoplay);
  carousel.addEventListener('touchend', startAutoplay);
}
function setupScrollEvents(carousel, container) {
  let isScrolling = false;
  container.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateActiveDot(carousel, container);
        updateNavigationButtons(carousel, container);
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
}
function updateActiveDot(carousel, container) {
  const dots = carousel.querySelectorAll('.carousel-dot');
  if (dots.length === 0) return;
  const slides = container.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  const slideWidth = slides[0].offsetWidth;
  const gap = parseInt(getComputedStyle(container).gap) || 0;
  const currentIndex = Math.round(container.scrollLeft / (slideWidth + gap));
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentIndex);
  });
}
function updateNavigationButtons(carousel, container) {
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  if (prevBtn) {
    prevBtn.disabled = container.scrollLeft <= 0;
  }
  if (nextBtn) {
    const maxScroll = container.scrollWidth - container.clientWidth;
    nextBtn.disabled = container.scrollLeft >= maxScroll - 1;
  }
}
function setupDragScroll(container) {
  let isDown = false;
  let startX;
  let scrollLeft;
  container.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });
  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });
  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });
  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDynamicDataCarousel();
});

// Re-initialize carousels when custom event is fired
document.addEventListener('jankx:reinitialize-carousel', e => {
  const element = e?.detail?.element || null;
  initDynamicDataCarousel(element || undefined);
});
/******/ })()
;
//# sourceMappingURL=view.js.map