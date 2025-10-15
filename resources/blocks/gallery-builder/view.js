/**
 * Gallery Builder Frontend JavaScript
 *
 * Handles gallery navigation, autoplay, and interactive features
 * Integrated with fslightbox for fullscreen functionality
 */

// Import fslightbox
import 'fslightbox';

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
        this.fslightboxInstance = null;

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
        this.setupFslightbox();

        if (this.settings.autoplay) {
            this.startAutoplay();
        }
    }

    cacheElements() {
        this.slides = this.container.querySelectorAll('.gallery-slide');
        this.thumbnails = this.container.querySelectorAll('.thumbnail');
        this.paginationNumbers = this.container.querySelectorAll('.pagination-number');
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

        // Pagination numbers
        this.paginationNumbers.forEach((number, index) => {
            number.addEventListener('click', () => this.goToSlide(index));
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
        this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe support
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

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

    setupFslightbox() {
        // Create fslightbox instance for this gallery
        this.fslightboxInstance = new FsLightbox();

        // Prepare sources array from gallery images
        const sources = Array.from(this.slides).map(slide => {
            const img = slide.querySelector('img');
            return {
                src: img.src,
                alt: img.alt,
                caption: slide.querySelector('.caption-content')?.innerHTML || ''
            };
        });

        // Configure fslightbox
        this.fslightboxInstance.props.sources = sources.map(source => source.src);
        this.fslightboxInstance.props.captions = sources.map(source => source.caption);
        this.fslightboxInstance.props.types = sources.map(() => 'image');
        this.fslightboxInstance.props.maxYoutubeVideoDimensions = {
            width: 1920,
            height: 1080
        };
        this.fslightboxInstance.props.loadOnlyCurrentSource = true;
        this.fslightboxInstance.props.showThumbsOnMount = this.settings.showThumbnails;
        this.fslightboxInstance.props.thumbsPosition = this.settings.thumbnailPosition === 'top' ? 'top' : 'bottom';

        // Autoplay settings - Always enable autoplay in fullscreen
        this.fslightboxInstance.props.autoplay = true;

        // Event handlers
        this.fslightboxInstance.props.onOpen = () => {
            this.pauseAutoplay(); // Pause main gallery autoplay
            this.container.classList.add('fslightbox-open');
        };

        this.fslightboxInstance.props.onClose = () => {
            this.container.classList.remove('fslightbox-open');
            // Resume main gallery autoplay if it was active
            if (this.settings.autoplay && this.isAutoplayActive) {
                this.startAutoplay();
            }
        };

        this.fslightboxInstance.props.onSlideChange = (index) => {
            // Sync with main gallery
            if (index !== this.currentSlide) {
                this.currentSlide = index;
                this.updateActiveStates();
            }
        };
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
        this.paginationNumbers.forEach((number, index) => {
            number.classList.toggle('active', index === this.currentSlide);
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
        if (this.fslightboxInstance) {
            // Open fslightbox at current slide
            this.fslightboxInstance.open(this.currentSlide);
        }
    }


    destroy() {
        this.pauseAutoplay();

        // Close fslightbox if open
        if (this.fslightboxInstance) {
            this.fslightboxInstance.close();
        }

        // Remove event listeners
        this.container.removeEventListener('keydown', this.handleKeyboard);
        this.container.removeEventListener('touchstart', this.handleTouchStart);
        this.container.removeEventListener('touchend', this.handleTouchEnd);
    }
}

// Initialize all gallery builders on page load
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainers = document.querySelectorAll('.wp-block-jankx-gallery-builder');

    galleryContainers.forEach(container => {
        new GalleryBuilder(container);
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryBuilder;
}
