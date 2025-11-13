/**
 * Embla Carousel initialization for Post Type Layout Block
 * 
 * @package Jankx
 * @since 1.0.0
 */

import EmblaCarousel from 'embla-carousel';

type EmblaHandlerMap = {
    mouseEnter?: (event: MouseEvent) => void;
    mouseLeave?: (event: MouseEvent) => void;
    prevButton?: { button: HTMLButtonElement; handler: EventListener };
    nextButton?: { button: HTMLButtonElement; handler: EventListener };
};

type EmblaContainerElement = HTMLElement & {
    emblaCarousel?: ReturnType<typeof EmblaCarousel>;
    emblaCleanup?: () => void;
    __emblaHandlers?: EmblaHandlerMap;
};

/**
 * Initialize Embla Carousel for all carousel layouts on the page
 */
function initCarousels(containerScope: ParentNode | Document = document): void {
    // Find all carousel containers
    const carouselContainers = containerScope.querySelectorAll<HTMLElement>(
        '.post-type-layout-carousel[data-embla-carousel]'
    );

    if (!carouselContainers.length) {
        return;
    }

    carouselContainers.forEach((element) => {
        const container = element as EmblaContainerElement;

        if (typeof container.emblaCleanup === 'function') {
            container.emblaCleanup();
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
        container.emblaCarousel = embla;
        const handlerMap: EmblaHandlerMap = {};
        container.__emblaHandlers = handlerMap;

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

            const startAutoplay = () => {
                autoplayTimeout = setTimeout(playEmbla, autoplayDelay);
            };

            const stopAutoplay = () => {
                if (autoplayTimeout) {
                    clearTimeout(autoplayTimeout);
                    autoplayTimeout = null;
                }
            };

            startAutoplay();

            const mouseEnterHandler = () => {
                stopAutoplay();
            };

            const mouseLeaveHandler = () => {
                if (autoplay) {
                    startAutoplay();
                }
            };

            container.addEventListener('mouseenter', mouseEnterHandler);
            container.addEventListener('mouseleave', mouseLeaveHandler);
            handlerMap.mouseEnter = mouseEnterHandler;
            handlerMap.mouseLeave = mouseLeaveHandler;
        }

        // Setup navigation arrows if present
        const prevButton = container.querySelector<HTMLButtonElement>(
            '.embla__button--prev'
        );
        const nextButton = container.querySelector<HTMLButtonElement>(
            '.embla__button--next'
        );

        if (prevButton) {
            const prevClickHandler = () => {
                embla.scrollPrev();
            };
            prevButton.addEventListener('click', prevClickHandler);
            handlerMap.prevButton = { button: prevButton, handler: prevClickHandler };

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
            const nextClickHandler = () => {
                embla.scrollNext();
            };
            nextButton.addEventListener('click', nextClickHandler);
            handlerMap.nextButton = { button: nextButton, handler: nextClickHandler };

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
            dotsContainer.innerHTML = '';
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
            if (handlerMap.mouseEnter) {
                container.removeEventListener('mouseenter', handlerMap.mouseEnter);
            }
            if (handlerMap.mouseLeave) {
                container.removeEventListener('mouseleave', handlerMap.mouseLeave);
            }
            if (handlerMap.prevButton) {
                handlerMap.prevButton.button.removeEventListener('click', handlerMap.prevButton.handler);
            }
            if (handlerMap.nextButton) {
                handlerMap.nextButton.button.removeEventListener('click', handlerMap.nextButton.handler);
            }
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
            }
            container.emblaCarousel = null;
            container.__emblaHandlers = undefined;
            container.emblaCleanup = undefined;
        };

        // Store cleanup function
        container.emblaCleanup = cleanup;
    });
}

function initCarouselsFromPayload(root: ParentNode | Document = document): void {
    const blocks = root.querySelectorAll<HTMLElement>('.wp-block-jankx-post-type-layout[data-layout="carousel"]');

    blocks.forEach((block) => {
        const layoutDataAttr = block.getAttribute('data-layout-js');
        if (!layoutDataAttr) {
            return;
        }

        try {
            const layoutData = JSON.parse(layoutDataAttr);
            if (!layoutData || layoutData.key !== 'carousel') {
                return;
            }

            const payload = layoutData.payload || {};
            const container = block.querySelector<HTMLElement>('.post-type-layout-carousel-editor');
            if (!container) {
                return;
            }

            // Replace editor container with frontend structure
            container.className = 'post-type-layout-carousel';
            container.setAttribute('data-embla-carousel', '');
            container.setAttribute('data-slides-per-view', String(payload.columns ?? 3));
            container.setAttribute('data-slides-to-scroll', String(payload.slidesToScroll ?? 1));

            if (payload.loop) {
                container.setAttribute('data-loop', 'true');
            } else {
                container.removeAttribute('data-loop');
            }

            if (payload.autoplay) {
                container.setAttribute('data-autoplay', 'true');
                container.setAttribute('data-autoplay-delay', String(payload.autoplayDelay ?? 3000));
            } else {
                container.removeAttribute('data-autoplay');
                container.removeAttribute('data-autoplay-delay');
            }

            const classes: string[] = ['post-type-layout-carousel'];
            if (payload.columns) {
                classes.push(`columns-${payload.columns}`);
                container.style.setProperty('--carousel-columns', String(payload.columns));
            }
            if (payload.columnsTablet) {
                classes.push(`columns-tablet-${payload.columnsTablet}`);
                container.style.setProperty('--carousel-columns-tablet', String(payload.columnsTablet));
            }
            if (payload.columnsMobile) {
                classes.push(`columns-mobile-${payload.columnsMobile}`);
                container.style.setProperty('--carousel-columns-mobile', String(payload.columnsMobile));
            }
            classes.forEach((className) => container.classList.add(className));
        } catch (error) {
            console.error('Failed to parse layout js payload', error);
        }
    });

    initCarousels(root);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCarouselsFromPayload());
} else {
    initCarouselsFromPayload();
}

// Re-initialize carousels after AJAX load more (if needed)
document.addEventListener('jankx:loadMoreComplete', (event: Event) => {
    const detail = (event as CustomEvent).detail;
    const newItems: HTMLElement[] = detail?.newItems || [];
    if (newItems.length === 0) {
        initCarousels();
        return;
    }

    const tempContainer = document.createElement('div');
    newItems.forEach((item) => tempContainer.appendChild(item.cloneNode(true)));
    initCarouselsFromPayload(tempContainer);
});

