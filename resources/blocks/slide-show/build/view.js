/******/ (() => { // webpackBootstrap
/*!***********************************!*\
  !*** ./blocks/slide-show/view.js ***!
  \***********************************/
/**
 * Slideshow Block Frontend Script
 * Handles PhotoSwipe integration and slideshow functionality
 */

(function () {
  'use strict';

  // PhotoSwipe integration
  class SlideshowBlock {
    constructor(element) {
      this.element = element;
      this.currentSlide = 0;
      this.autoplayTimer = null;
      this.isAutoplay = false;
      this.settings = this.getSettings();
      this.images = this.getImages();
      this.init();
    }
    getSettings() {
      const data = this.element.dataset;
      return {
        autoplay: data.autoplay === 'true',
        autoplayDelay: parseInt(data.autoplayDelay) || 3000,
        fullscreen: data.fullscreen === 'true',
        showThumbnails: data.showThumbnails === 'true',
        showNavigation: data.showNavigation === 'true',
        showPagination: data.showPagination === 'true',
        transitionEffect: data.transitionEffect || 'slide',
        transitionSpeed: parseInt(data.transitionSpeed) || 300,
        enableLightbox: data.enableLightbox === 'true'
      };
    }
    getImages() {
      const images = [];
      const slides = this.element.querySelectorAll('.slideshow-slide');
      console.log('Slideshow: Found', slides.length, 'slides');
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const caption = slide.querySelector('.slideshow-caption');
        if (img) {
          console.log('Slideshow: Slide', index, 'has image:', img.src);
          images.push({
            id: index,
            src: img.src,
            srcset: img.srcset,
            width: img.naturalWidth || 800,
            height: img.naturalHeight || 600,
            alt: img.alt,
            caption: caption ? caption.innerHTML : '',
            element: slide
          });
        } else {
          console.warn('Slideshow: Slide', index, 'has no image');
        }
      });
      console.log('Slideshow: Total images loaded:', images.length);
      return images;
    }
    init() {
      this.setupEventListeners();
      this.loadPhotoSwipe();
      this.initSlideshow();
      if (this.settings.autoplay) {
        this.startAutoplay();
      }
    }
    setupEventListeners() {
      // Thumbnail clicks
      const thumbnails = this.element.querySelectorAll('.slideshow-thumbnail');
      thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => this.goToSlide(index));
      });

      // Navigation buttons
      const prevBtn = this.element.querySelector('.slideshow-nav-prev');
      const nextBtn = this.element.querySelector('.slideshow-nav-next');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.goToPrevious());
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.goToNext());
      }

      // Pagination dots
      const paginationDots = this.element.querySelectorAll('.slideshow-pagination-dot');
      paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });

      // Fullscreen button
      const fullscreenBtn = this.element.querySelector('.slideshow-fullscreen-btn');
      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => this.openPhotoSwipe());
      }

      // Autoplay button
      const autoplayBtn = this.element.querySelector('.slideshow-autoplay-btn');
      if (autoplayBtn) {
        autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
      }

      // Click on main image to open PhotoSwipe (only if enableLightbox is true)
      if (this.settings.enableLightbox) {
        const mainImages = this.element.querySelectorAll('.slideshow-slide img');
        mainImages.forEach((img, index) => {
          img.addEventListener('click', () => this.openPhotoSwipe(index));
          img.style.cursor = 'pointer';
        });
      }

      // Click on thumbnails to navigate slideshow (not open PhotoSwipe)
      const thumbnailBtns = this.element.querySelectorAll('.slideshow-thumbnail');
      thumbnailBtns.forEach((thumb, index) => {
        thumb.addEventListener('click', e => {
          e.preventDefault();
          this.goToSlide(index);
        });
      });

      // Keyboard navigation
      this.element.addEventListener('keydown', e => {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.goToPrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.goToNext();
            break;
          case 'Escape':
            this.stopAutoplay();
            break;
        }
      });

      // Touch/swipe support
      this.addTouchSupport();
    }
    addTouchSupport() {
      let startX = 0;
      let startY = 0;
      let distX = 0;
      let distY = 0;
      this.element.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      this.element.addEventListener('touchmove', e => {
        if (!startX || !startY) return;
        distX = e.touches[0].clientX - startX;
        distY = e.touches[0].clientY - startY;
      });
      this.element.addEventListener('touchend', () => {
        if (!startX || !startY) return;
        const threshold = 50;
        if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
          if (distX > 0) {
            this.goToPrevious();
          } else {
            this.goToNext();
          }
        }
        startX = 0;
        startY = 0;
        distX = 0;
        distY = 0;
      });
    }
    loadPhotoSwipe() {
      // Skip PhotoSwipe loading for now and use custom lightbox with autoplay
      console.log('Using custom lightbox with autoplay functionality');
      return Promise.resolve();
    }
    initSlideshow() {
      this.element.classList.add('photoswipe-enabled');
      this.goToSlide(0);
    }
    goToSlide(index) {
      if (index < 0 || index >= this.images.length) return;
      this.currentSlide = index;
      this.updateSlideshow();
      this.updateThumbnails();
      this.updatePagination();
    }
    goToPrevious() {
      const prevIndex = (this.currentSlide - 1 + this.images.length) % this.images.length;
      this.goToSlide(prevIndex);
    }
    goToNext() {
      const nextIndex = (this.currentSlide + 1) % this.images.length;
      this.goToSlide(nextIndex);
    }
    updateSlideshow() {
      const track = this.element.querySelector('.slideshow-track');
      const slides = this.element.querySelectorAll('.slideshow-slide');
      if (!track || !slides.length) return;
      console.log('Slideshow: Updating to slide', this.currentSlide, 'of', slides.length);

      // Update slide visibility
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === this.currentSlide);
        if (this.settings.transitionEffect === 'slide') {
          // For slide effect, use transform
          const translateX = (index - this.currentSlide) * 100;
          slide.style.transform = `translateX(${translateX}%)`;
          slide.style.opacity = '1';
          console.log('Slideshow: Slide', index, 'transform:', translateX + '%');
        } else if (this.settings.transitionEffect === 'fade') {
          // For fade effect, use opacity
          slide.style.opacity = index === this.currentSlide ? '1' : '0';
          slide.style.transform = 'translateX(0)';
          console.log('Slideshow: Slide', index, 'opacity:', slide.style.opacity);
        }
      });
    }
    updateThumbnails() {
      const thumbnails = this.element.querySelectorAll('.slideshow-thumbnail');
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === this.currentSlide);
      });
    }
    updatePagination() {
      const dots = this.element.querySelectorAll('.slideshow-pagination-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });

      // Update navigation button states
      const prevBtn = this.element.querySelector('.slideshow-pagination-prev');
      const nextBtn = this.element.querySelector('.slideshow-pagination-next');
      if (prevBtn) {
        prevBtn.disabled = this.currentSlide === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = this.currentSlide === this.images.length - 1;
      }
    }
    startAutoplay() {
      this.stopAutoplay();
      this.isAutoplay = true;
      this.autoplayTimer = setInterval(() => {
        this.goToNext();
      }, this.settings.autoplayDelay);
      this.element.classList.add('autoplay-active');
    }
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
      this.isAutoplay = false;
      this.element.classList.remove('autoplay-active');
    }
    toggleAutoplay() {
      if (this.isAutoplay) {
        this.stopAutoplay();
      } else {
        this.startAutoplay();
      }
    }
    openPhotoSwipe(index = this.currentSlide) {
      // Use enhanced lightbox with autoplay functionality
      this.openLightboxWithAutoplay(index);
    }
    openLightbox(index = this.currentSlide) {
      if (!this.images.length) return;

      // Create lightbox overlay
      const lightbox = document.createElement('div');
      lightbox.className = 'slideshow-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-overlay">
          <div class="lightbox-container">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&larr;</button>
            <button class="lightbox-next">&rarr;</button>
            <div class="lightbox-image-container">
              <img class="lightbox-image" src="${this.images[index].src}" alt="${this.images[index].alt}">
              <div class="lightbox-caption">${this.images[index].caption}</div>
            </div>
            <div class="lightbox-counter">${index + 1} / ${this.images.length}</div>
          </div>
        </div>
      `;

      // Add styles
      const styles = document.createElement('style');
      styles.textContent = `
        .slideshow-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-close, .lightbox-prev, .lightbox-next {
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          z-index: 10001;
          transition: background 0.2s ease;
        }
        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
          background: rgba(255, 255, 255, 1);
        }
        .lightbox-close {
          top: 20px;
          right: 20px;
          font-size: 30px;
        }
        .lightbox-prev {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .lightbox-next {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .lightbox-image-container {
          text-align: center;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
        }
        .lightbox-caption {
          color: white;
          margin-top: 20px;
          padding: 0 20px;
          font-size: 14px;
          line-height: 1.5;
        }
        .lightbox-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }
      `;
      document.head.appendChild(styles);
      document.body.appendChild(lightbox);

      // Event handlers
      let currentIndex = index;
      const updateLightbox = () => {
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        img.src = this.images[currentIndex].src;
        img.alt = this.images[currentIndex].alt;
        caption.innerHTML = this.images[currentIndex].caption;
        counter.textContent = `${currentIndex + 1} / ${this.images.length}`;

        // Update navigation button states
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        prevBtn.style.display = this.images.length > 1 ? 'block' : 'none';
        nextBtn.style.display = this.images.length > 1 ? 'block' : 'none';
      };
      const closeLightbox = () => {
        document.body.removeChild(lightbox);
        document.head.removeChild(styles);
      };

      // Event listeners
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeLightbox();
      });
      if (this.images.length > 1) {
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + this.images.length) % this.images.length;
          updateLightbox();
        });
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % this.images.length;
          updateLightbox();
        });
      }

      // Keyboard navigation
      const handleKeydown = e => {
        switch (e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowLeft':
            if (this.images.length > 1) {
              currentIndex = (currentIndex - 1 + this.images.length) % this.images.length;
              updateLightbox();
            }
            break;
          case 'ArrowRight':
            if (this.images.length > 1) {
              currentIndex = (currentIndex + 1) % this.images.length;
              updateLightbox();
            }
            break;
        }
      };
      document.addEventListener('keydown', handleKeydown);

      // Clean up event listener when lightbox closes
      const originalClose = closeLightbox;
      closeLightbox = () => {
        document.removeEventListener('keydown', handleKeydown);
        originalClose();
      };
      updateLightbox();
    }
    openLightboxWithAutoplay(index = this.currentSlide) {
      if (!this.images.length) return;

      // Create enhanced lightbox with autoplay
      const lightbox = document.createElement('div');
      lightbox.className = 'slideshow-lightbox slideshow-lightbox-autoplay';
      lightbox.innerHTML = `
        <div class="lightbox-overlay">
          <div class="lightbox-container">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&larr;</button>
            <button class="lightbox-next">&rarr;</button>
            <button class="lightbox-autoplay-toggle" title="Toggle slideshow">
              <span class="play-icon" style="display: none;">▶</span>
              <span class="pause-icon">⏸</span>
            </button>
            <div class="lightbox-image-container">
              <img class="lightbox-image" src="${this.images[index].src}" alt="${this.images[index].alt}">
              <div class="lightbox-caption">${this.images[index].caption}</div>
            </div>
            <div class="lightbox-counter">${index + 1} / ${this.images.length}</div>
            <div class="lightbox-progress-bar">
              <div class="lightbox-progress-fill"></div>
            </div>
          </div>
        </div>
      `;

      // Add enhanced styles
      const styles = document.createElement('style');
      styles.textContent = `
        .slideshow-lightbox-autoplay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-close, .lightbox-prev, .lightbox-next, .lightbox-autoplay-toggle {
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          z-index: 10001;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover, .lightbox-autoplay-toggle:hover {
          background: rgba(255, 255, 255, 1);
        }
        .lightbox-close {
          top: 20px;
          right: 20px;
          font-size: 30px;
        }
        .lightbox-prev {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .lightbox-next {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .lightbox-autoplay-toggle {
          top: 20px;
          left: 20px;
          font-size: 18px;
        }
        .lightbox-image-container {
          text-align: center;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
        }
        .lightbox-caption {
          color: white;
          margin-top: 20px;
          padding: 0 20px;
          font-size: 14px;
          line-height: 1.5;
        }
        .lightbox-counter {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.7);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }
        .lightbox-progress-bar {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .lightbox-progress-fill {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          width: 0%;
          transition: width linear;
        }
        .lightbox-progress-fill.running {
          animation: progressAnimation linear;
        }
        @keyframes progressAnimation {
          from { width: 0%; }
          to { width: 100%; }
        }
      `;
      document.head.appendChild(styles);
      document.body.appendChild(lightbox);

      // Event handlers
      let currentIndex = index;
      let isAutoplay = true; // Mặc định bật autoplay khi mở fullscreen
      let autoplayTimer = null;
      let progressTimer = null;
      const updateLightbox = () => {
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        img.src = this.images[currentIndex].src;
        img.alt = this.images[currentIndex].alt;
        caption.innerHTML = this.images[currentIndex].caption;
        counter.textContent = `${currentIndex + 1} / ${this.images.length}`;

        // Update navigation button states
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        prevBtn.style.display = this.images.length > 1 ? 'block' : 'none';
        nextBtn.style.display = this.images.length > 1 ? 'block' : 'none';

        // Restart autoplay if it's running
        if (isAutoplay) {
          startAutoplay();
        }
      };
      const startAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
        if (progressTimer) clearInterval(progressTimer);
        const progressFill = lightbox.querySelector('.lightbox-progress-fill');
        progressFill.classList.add('running');
        progressFill.style.animationDuration = `${this.settings.autoplayDelay}ms`;
        autoplayTimer = setTimeout(() => {
          currentIndex = (currentIndex + 1) % this.images.length;
          updateLightbox();
        }, this.settings.autoplayDelay);
      };
      const stopAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
        if (progressTimer) clearInterval(progressTimer);
        const progressFill = lightbox.querySelector('.lightbox-progress-fill');
        progressFill.classList.remove('running');
        progressFill.style.animationDuration = '0ms';
      };
      const toggleAutoplay = () => {
        isAutoplay = !isAutoplay;
        const toggleBtn = lightbox.querySelector('.lightbox-autoplay-toggle');
        const playIcon = toggleBtn.querySelector('.play-icon');
        const pauseIcon = toggleBtn.querySelector('.pause-icon');
        if (isAutoplay) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'inline';
          startAutoplay();
        } else {
          playIcon.style.display = 'inline';
          pauseIcon.style.display = 'none';
          stopAutoplay();
        }
      };
      let closeLightbox = () => {
        stopAutoplay();
        document.body.removeChild(lightbox);
        document.head.removeChild(styles);
      };

      // Event listeners
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeLightbox();
      });
      if (this.images.length > 1) {
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + this.images.length) % this.images.length;
          updateLightbox();
        });
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % this.images.length;
          updateLightbox();
        });
      }
      lightbox.querySelector('.lightbox-autoplay-toggle').addEventListener('click', toggleAutoplay);

      // Keyboard navigation
      const handleKeydown = e => {
        switch (e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowLeft':
            if (this.images.length > 1) {
              currentIndex = (currentIndex - 1 + this.images.length) % this.images.length;
              updateLightbox();
            }
            break;
          case 'ArrowRight':
            if (this.images.length > 1) {
              currentIndex = (currentIndex + 1) % this.images.length;
              updateLightbox();
            }
            break;
          case ' ':
            e.preventDefault();
            toggleAutoplay();
            break;
        }
      };
      document.addEventListener('keydown', handleKeydown);

      // Clean up event listener when lightbox closes
      const originalClose = closeLightbox;
      closeLightbox = () => {
        document.removeEventListener('keydown', handleKeydown);
        originalClose();
      };
      updateLightbox();

      // Tự động bắt đầu autoplay khi mở fullscreen
      setTimeout(() => {
        startAutoplay();
      }, 100);
    }
    destroy() {
      this.stopAutoplay();
      this.element.removeEventListener('keydown', this.handleKeydown);
      // Remove other event listeners as needed
    }
  }

  // Initialize slideshow blocks
  function initSlideshows() {
    const slideshowBlocks = document.querySelectorAll('.slideshow-block[data-slideshow]');
    slideshowBlocks.forEach(element => {
      if (!element.slideshowInstance) {
        element.slideshowInstance = new SlideshowBlock(element);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshows);
  } else {
    initSlideshows();
  }

  // Re-initialize on AJAX content load (for dynamic content)
  document.addEventListener('jankx:content-loaded', initSlideshows);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    const slideshowBlocks = document.querySelectorAll('.slideshow-block[data-slideshow]');
    slideshowBlocks.forEach(element => {
      if (element.slideshowInstance) {
        element.slideshowInstance.destroy();
      }
    });
  });
})();
/******/ })()
;
//# sourceMappingURL=view.js.map