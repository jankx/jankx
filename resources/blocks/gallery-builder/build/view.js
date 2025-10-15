/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/gallery-builder/view.js":
/*!****************************************!*\
  !*** ./blocks/gallery-builder/view.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Gallery Builder Frontend JavaScript
 *
 * Handles gallery navigation, autoplay, and interactive features
 */

class GalleryBuilder {
  constructor(container) {
    this.container = container;
    this.galleryId = container.dataset.galleryId;
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.autoplayInterval = null;
    this.isAutoplayActive = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.fullscreenModal = null;
    this.fullscreenAutoplayInterval = null;
    this.isFullscreenAutoplayActive = false;

    // Get settings from data attributes
    this.settings = {
      autoplay: container.dataset.autoplay === 'true',
      autoplayDelay: parseInt(container.dataset.autoplayDelay) || 5000,
      showThumbnails: container.dataset.showThumbnails === 'true',
      showNavigation: container.dataset.showNavigation === 'true',
      showPagination: container.dataset.showPagination === 'true',
      showCaptions: container.dataset.showCaptions === 'true',
      thumbnailPosition: container.dataset.thumbnailPosition || 'top',
      transitionEffect: container.dataset.transitionEffect || 'slide',
      transitionDuration: parseInt(container.dataset.transitionDuration) || 500,
      enableFullscreen: container.dataset.enableFullscreen === 'true',
      fullscreenAutoplay: container.dataset.fullscreenAutoplay === 'true',
      fullscreenAutoplayDelay: parseInt(container.dataset.fullscreenAutoplayDelay) || 4000,
      fullscreenText: container.dataset.fullscreenText || '',
      captionPosition: container.dataset.captionPosition || 'overlay'
    };
    this.init();
  }
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setupInitialState();
    if (this.settings.autoplay) {
      this.startAutoplay();
    }
  }
  cacheElements() {
    this.slides = this.container.querySelectorAll('.gallery-slide');
    this.thumbnails = this.container.querySelectorAll('.thumbnail');
    this.paginationDots = this.container.querySelectorAll('.pagination-dot');
    this.navPrev = this.container.querySelector('.gallery-nav.prev');
    this.navNext = this.container.querySelector('.gallery-nav.next');
    this.autoplayToggle = this.container.querySelector('.autoplay-toggle');
    this.totalSlides = this.slides.length;
  }
  bindEvents() {
    // Navigation arrows
    if (this.navPrev) {
      this.navPrev.addEventListener('click', () => this.previousSlide());
    }
    if (this.navNext) {
      this.navNext.addEventListener('click', () => this.nextSlide());
    }

    // Thumbnails
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.goToSlide(index));
    });

    // Pagination dots
    this.paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Autoplay toggle
    if (this.autoplayToggle) {
      this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
    }

    // Fullscreen button
    const fullscreenButton = this.container.querySelector('.fullscreen-button');
    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', () => this.openFullscreen());
    }

    // Keyboard navigation
    this.container.addEventListener('keydown', e => this.handleKeyboard(e));

    // Touch/swipe support
    this.container.addEventListener('touchstart', e => this.handleTouchStart(e), {
      passive: true
    });
    this.container.addEventListener('touchend', e => this.handleTouchEnd(e), {
      passive: true
    });

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.settings.autoplay && this.isAutoplayActive) {
        this.startAutoplay();
      }
    });

    // Visibility API - pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else if (this.settings.autoplay && this.isAutoplayActive) {
        this.startAutoplay();
      }
    });
  }
  setupInitialState() {
    // Set initial active states
    this.updateActiveStates();

    // Make container focusable for keyboard navigation
    this.container.setAttribute('tabindex', '0');
  }
  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides || index === this.currentSlide) {
      return;
    }
    const previousSlide = this.currentSlide;
    this.currentSlide = index;
    this.animateSlide(previousSlide, this.currentSlide);
    this.updateActiveStates();
  }
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }
  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }
  animateSlide(fromIndex, toIndex) {
    const fromSlide = this.slides[fromIndex];
    const toSlide = this.slides[toIndex];
    if (!fromSlide || !toSlide) return;

    // Remove active class from previous slide
    fromSlide.classList.remove('active');

    // Add active class to new slide
    toSlide.classList.add('active');

    // Apply transition effect
    this.applyTransitionEffect(fromSlide, toSlide);
  }
  applyTransitionEffect(fromSlide, toSlide) {
    const duration = this.settings.transitionDuration;
    switch (this.settings.transitionEffect) {
      case 'fade':
        this.applyFadeTransition(fromSlide, toSlide, duration);
        break;
      case 'slide':
        this.applySlideTransition(fromSlide, toSlide, duration);
        break;
      case 'zoom':
        this.applyZoomTransition(fromSlide, toSlide, duration);
        break;
      default:
        // Default fade effect
        this.applyFadeTransition(fromSlide, toSlide, duration);
    }
  }
  applyFadeTransition(fromSlide, toSlide, duration) {
    // Fade effect is handled by CSS opacity transition
    // No additional JavaScript needed
  }
  applySlideTransition(fromSlide, toSlide, duration) {
    const direction = this.currentSlide > this.previousSlide ? 'next' : 'prev';

    // Add transition classes
    fromSlide.style.transition = `transform ${duration}ms ease-in-out`;
    toSlide.style.transition = `transform ${duration}ms ease-in-out`;
    if (direction === 'next') {
      fromSlide.style.transform = 'translateX(-100%)';
      toSlide.style.transform = 'translateX(0)';
    } else {
      fromSlide.style.transform = 'translateX(100%)';
      toSlide.style.transform = 'translateX(0)';
    }

    // Clean up after transition
    setTimeout(() => {
      fromSlide.style.transition = '';
      toSlide.style.transition = '';
      fromSlide.style.transform = '';
      toSlide.style.transform = '';
    }, duration);
  }
  applyZoomTransition(fromSlide, toSlide, duration) {
    fromSlide.style.transition = `transform ${duration}ms ease-in-out`;
    toSlide.style.transition = `transform ${duration}ms ease-in-out`;
    fromSlide.style.transform = 'scale(1.1)';
    toSlide.style.transform = 'scale(1)';
    setTimeout(() => {
      fromSlide.style.transition = '';
      toSlide.style.transition = '';
      fromSlide.style.transform = '';
      toSlide.style.transform = '';
    }, duration);
  }
  updateActiveStates() {
    // Update slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Update thumbnails
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.classList.toggle('active', index === this.currentSlide);
    });

    // Update pagination dots
    this.paginationDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }
  startAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    this.isAutoplayActive = true;
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.settings.autoplayDelay);

    // Update toggle button state
    if (this.autoplayToggle) {
      this.autoplayToggle.classList.remove('paused');
    }
  }
  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    this.isAutoplayActive = false;

    // Update toggle button state
    if (this.autoplayToggle) {
      this.autoplayToggle.classList.add('paused');
    }
  }
  toggleAutoplay() {
    if (this.isAutoplayActive) {
      this.pauseAutoplay();
    } else {
      this.startAutoplay();
    }
  }
  handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case ' ':
        e.preventDefault();
        this.toggleAutoplay();
        break;
      case 'Escape':
        this.pauseAutoplay();
        break;
    }
  }
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        this.nextSlide();
      } else {
        // Swipe right - previous slide
        this.previousSlide();
      }
    }
  }
  openFullscreen() {
    this.createFullscreenModal();
    this.showFullscreenModal();
    if (this.settings.fullscreenAutoplay) {
      this.startFullscreenAutoplay();
    }
  }
  createFullscreenModal() {
    if (this.fullscreenModal) {
      return;
    }
    const modal = document.createElement('div');
    modal.className = 'gallery-fullscreen-modal';
    modal.innerHTML = `
            <div class="fullscreen-content">
                <div class="fullscreen-header">
                    <div class="fullscreen-text">${this.settings.fullscreenText}</div>
                    <button class="fullscreen-close" aria-label="Close fullscreen">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="fullscreen-slides">
                    ${this.slides.map((slide, index) => `
                        <div class="fullscreen-slide ${index === this.currentSlide ? 'active' : ''}" data-slide="${index}">
                            <img src="${slide.querySelector('img').src}" alt="${slide.querySelector('img').alt}" />
                        </div>
                    `).join('')}
                </div>
                <div class="fullscreen-controls">
                    <button class="fullscreen-nav prev" aria-label="Previous image">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <div class="fullscreen-pagination">
                        ${this.slides.map((_, index) => `
                            <button class="pagination-dot ${index === this.currentSlide ? 'active' : ''}" data-slide="${index}"></button>
                        `).join('')}
                    </div>
                    <button class="fullscreen-nav next" aria-label="Next image">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

    // Add event listeners
    const closeBtn = modal.querySelector('.fullscreen-close');
    const prevBtn = modal.querySelector('.fullscreen-nav.prev');
    const nextBtn = modal.querySelector('.fullscreen-nav.next');
    const paginationDots = modal.querySelectorAll('.fullscreen-pagination .pagination-dot');
    closeBtn.addEventListener('click', () => this.closeFullscreen());
    prevBtn.addEventListener('click', () => this.fullscreenPreviousSlide());
    nextBtn.addEventListener('click', () => this.fullscreenNextSlide());
    paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.fullscreenGoToSlide(index));
    });

    // Close on background click
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        this.closeFullscreen();
      }
    });

    // Keyboard navigation
    modal.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Escape':
          this.closeFullscreen();
          break;
        case 'ArrowLeft':
          this.fullscreenPreviousSlide();
          break;
        case 'ArrowRight':
          this.fullscreenNextSlide();
          break;
      }
    });
    document.body.appendChild(modal);
    this.fullscreenModal = modal;
  }
  showFullscreenModal() {
    if (this.fullscreenModal) {
      this.fullscreenModal.classList.add('active');
      this.fullscreenModal.focus();
    }
  }
  closeFullscreen() {
    if (this.fullscreenModal) {
      this.fullscreenModal.classList.remove('active');
      setTimeout(() => {
        if (this.fullscreenModal) {
          document.body.removeChild(this.fullscreenModal);
          this.fullscreenModal = null;
        }
      }, 300);
    }
    this.stopFullscreenAutoplay();
  }
  fullscreenGoToSlide(index) {
    if (index < 0 || index >= this.totalSlides || index === this.currentSlide) {
      return;
    }
    const fullscreenSlides = this.fullscreenModal.querySelectorAll('.fullscreen-slide');
    const fullscreenDots = this.fullscreenModal.querySelectorAll('.fullscreen-pagination .pagination-dot');

    // Update slides
    fullscreenSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update pagination
    fullscreenDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    this.currentSlide = index;
  }
  fullscreenNextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.fullscreenGoToSlide(nextIndex);
  }
  fullscreenPreviousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.fullscreenGoToSlide(prevIndex);
  }
  startFullscreenAutoplay() {
    if (this.fullscreenAutoplayInterval) {
      clearInterval(this.fullscreenAutoplayInterval);
    }
    this.isFullscreenAutoplayActive = true;
    this.fullscreenAutoplayInterval = setInterval(() => {
      this.fullscreenNextSlide();
    }, this.settings.fullscreenAutoplayDelay);
  }
  stopFullscreenAutoplay() {
    if (this.fullscreenAutoplayInterval) {
      clearInterval(this.fullscreenAutoplayInterval);
      this.fullscreenAutoplayInterval = null;
    }
    this.isFullscreenAutoplayActive = false;
  }
  destroy() {
    this.pauseAutoplay();
    this.closeFullscreen();

    // Remove event listeners
    this.container.removeEventListener('keydown', this.handleKeyboard);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Initialize all gallery builders on page load
document.addEventListener('DOMContentLoaded', function () {
  const galleryContainers = document.querySelectorAll('.wp-block-jankx-gallery-builder');
  galleryContainers.forEach(container => {
    new GalleryBuilder(container);
  });
});

// Export for potential external use
if ( true && module.exports) {
  module.exports = GalleryBuilder;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./blocks/gallery-builder/view.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=view.js.map