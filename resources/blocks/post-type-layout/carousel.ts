/**
 * Embla Carousel initialization for Post Type Layout Block
 * 
 * @package Jankx
 * @since 1.0.0
 */

import EmblaCarousel from 'embla-carousel';

/**
 * Initialize Embla Carousel for all carousel layouts on the page
 */
function initCarousels(): void {
    // Find all carousel containers
    const carouselContainers = document.querySelectorAll<HTMLElement>(
        '.post-type-layout-carousel[data-embla-carousel]'
    );

    if (!carouselContainers.length) {
        return;
    }

    carouselContainers.forEach((container) => {
        // Check if already initialized
        if ((container as any).emblaCarousel) {
            return;
        }

        const viewport = container.querySelector<HTMLElement>('.embla__viewport');
        if (!viewport) {
            return;
        }

        // Get options from data attributes
        const slidesPerView = parseInt(
            container.getAttribute('data-slides-per-view') || '3',
            10
        );
        const slidesToScroll = parseInt(
            container.getAttribute('data-slides-to-scroll') || '1',
            10
        );
        const loop = container.getAttribute('data-loop') === 'true';
        const autoplay = container.getAttribute('data-autoplay') === 'true';
        const autoplayDelay = parseInt(
            container.getAttribute('data-autoplay-delay') || '3000',
            10
        );

        // Build Embla options
        const emblaOptions: any = {
            slidesToScroll: slidesToScroll,
        };

        if (loop) {
            emblaOptions.loop = true;
        }

        // Initialize Embla Carousel
        const embla = EmblaCarousel(viewport, emblaOptions);

        // Store reference
        (container as any).emblaCarousel = embla;

        // Setup autoplay if enabled
        let autoplayTimeout: ReturnType<typeof setTimeout> | null = null;
        if (autoplay) {
            const playEmbla = () => {
                if (!embla.canScrollNext()) {
                    embla.scrollTo(0); // Reset to start if at end
                } else {
                    embla.scrollNext();
                }
                autoplayTimeout = setTimeout(playEmbla, autoplayDelay);
            };

            autoplayTimeout = setTimeout(playEmbla, autoplayDelay);

            // Pause on hover
            container.addEventListener('mouseenter', () => {
                if (autoplayTimeout) {
                    clearTimeout(autoplayTimeout);
                    autoplayTimeout = null;
                }
            });

            container.addEventListener('mouseleave', () => {
                if (autoplay) {
                    autoplayTimeout = setTimeout(playEmbla, autoplayDelay);
                }
            });
        }

        // Setup navigation arrows if present
        const prevButton = container.querySelector<HTMLButtonElement>(
            '.embla__button--prev'
        );
        const nextButton = container.querySelector<HTMLButtonElement>(
            '.embla__button--next'
        );

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                embla.scrollPrev();
            });

            // Update button state
            const updatePrevButton = () => {
                if (loop) {
                    prevButton.disabled = false;
                } else {
                    prevButton.disabled = !embla.canScrollPrev();
                }
            };

            embla.on('select', updatePrevButton);
            updatePrevButton();
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                embla.scrollNext();
            });

            // Update button state
            const updateNextButton = () => {
                if (loop) {
                    nextButton.disabled = false;
                } else {
                    nextButton.disabled = !embla.canScrollNext();
                }
            };

            embla.on('select', updateNextButton);
            updateNextButton();
        }

        // Setup dots navigation if present
        const dotsContainer = container.querySelector<HTMLElement>(
            '.embla__dots'
        );

        if (dotsContainer) {
            const dots: HTMLElement[] = [];
            const slides = embla.slideNodes();

            // Create dots
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'embla__dot';
                dot.setAttribute('type', 'button');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    embla.scrollTo(index);
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            })

            // Update dots on scroll
            const updateDots = () => {
                const selectedIndex = embla.selectedScrollSnap();
                dots.forEach((dot, index) => {
                    if (index === selectedIndex) {
                        dot.classList.add('embla__dot--selected');
                    } else {
                        dot.classList.remove('embla__dot--selected');
                    }
                });
            };

            embla.on('select', updateDots);
            updateDots();
        }

        // Cleanup on destroy
        const cleanup = () => {
            if (autoplayTimeout) {
                clearTimeout(autoplayTimeout);
            }
            embla.destroy();
            (container as any).emblaCarousel = null;
        };

        // Store cleanup function
        (container as any).emblaCleanup = cleanup;
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}

// Re-initialize carousels after AJAX load more (if needed)
document.addEventListener('jankx:loadMoreComplete', () => {
    setTimeout(initCarousels, 100);
});

