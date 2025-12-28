import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
(function() {
    // Track all carousel instances
    const carouselInstances = new Map();
    
    function initCarousel(root) {
        const carousels = root ? root.querySelectorAll('.wp-block-jankx-dynamic-ssr-layout.view-type-layout-carousel') : 
                               document.querySelectorAll('.wp-block-jankx-dynamic-ssr-layout.view-type-layout-carousel');
        
        carousels.forEach((carousel) => {
            if (carousel._carouselInitialized) return;
            
            const container = carousel.querySelector('.carousel-container');
            if (!container) return;
            
            const instanceId = 'carousel-' + Math.random().toString(36).substr(2, 9);
            const instance = {
                carousel,
                container,
                embla: null,
                slides: [],
                autoplayTimeout: null,
                isPaused: false
            };
            
            const computed = getComputedStyle(carousel);
            const cssSlides = parseInt(computed.getPropertyValue('--slides-per-view')) || NaN;
            const cssSpace = parseInt(computed.getPropertyValue('--space-between')) || NaN;
            const dataSlides = parseInt(carousel.getAttribute('data-slides-per-view')) || NaN;
            const dataColumns = parseInt(carousel.getAttribute('data-columns')) || NaN;
            const dataSpace = parseInt(carousel.getAttribute('data-space-between')) || NaN;
            instance.slidesPerView = (dataSlides || dataColumns || cssSlides || 1);
            instance.spaceBetween = (dataSpace || cssSpace || 16);
            instance.autoplay = carousel.getAttribute('data-autoplay') === 'true';
            instance.autoplayDelay = Math.max(3000, parseInt(carousel.getAttribute('data-autoplay-delay')) || 5000);
            instance.showArrows = carousel.classList.contains('has-arrows');
            instance.showDots = carousel.classList.contains('has-dots');
            
            container.style.setProperty('--slides-per-view', instance.slidesPerView);
            container.style.setProperty('--space-between', `${instance.spaceBetween}px`);
            carousel.style.setProperty('--slides-per-view', instance.slidesPerView);
            carousel.style.setProperty('--space-between', `${instance.spaceBetween}px`);
            
            container.classList.add('embla__viewport');
            let track = container.querySelector('.embla__container');
            if (!track) {
                track = document.createElement('div');
                track.className = 'embla__container';
                while (container.firstChild) {
                    const node = container.firstChild;
                    const isElement = node.nodeType === 1;
                    const isText = node.nodeType === 3;
                    const isComment = node.nodeType === 8;
                    if (isText) {
                        const text = node.nodeValue || '';
                        if (text.trim() === '') {
                            container.removeChild(node);
                            continue;
                        }
                    }
                    if (isComment) {
                        container.removeChild(node);
                        continue;
                    }
                    if (isElement && node.classList && node.classList.contains('carousel-slide')) {
                        track.appendChild(node);
                    } else {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'carousel-slide';
                        container.removeChild(node);
                        wrapper.appendChild(node);
                        track.appendChild(wrapper);
                    }
                }
                container.appendChild(track);
            }
            
            instance.slides = Array.from(container.querySelectorAll('.carousel-slide'));
            
            const plugins = instance.autoplay
                ? [Autoplay({ delay: instance.autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })]
                : [];
            instance.embla = EmblaCarousel(container, {
                loop: true,
                duration: 25,
                align: 'start'
            }, plugins);
            
            carouselInstances.set(container, instance);
            carousel._carouselInitialized = true;
            
            if (instance.showArrows) {
                // Use existing navigation if present, otherwise create
                const prevExisting = carousel.querySelector('.carousel-prev');
                const nextExisting = carousel.querySelector('.carousel-next');
                if (prevExisting && nextExisting) {
                    prevExisting.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        instance.embla.scrollPrev();
                        const ap = instance.embla.plugins?.().autoplay;
                        if (ap) ap.reset();
                    }, { passive: true });
                    nextExisting.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        instance.embla.scrollNext();
                        const ap = instance.embla.plugins?.().autoplay;
                        if (ap) ap.reset();
                    }, { passive: true });
                    instance.prevBtn = prevExisting;
                    instance.nextBtn = nextExisting;
                } else {
                    createNavigationButtons(carousel, container, instance);
                }
            }
            
            if (instance.showDots) {
                // Use existing dots container if present
                const dotsExisting = carousel.querySelector('.carousel-dots');
                if (dotsExisting) {
                    instance.dotsContainer = dotsExisting;
                    // Populate dots based on slide count
                    const slides = instance.embla.slideNodes();
                    const totalSlides = slides.length;
                    const dotsCount = Math.ceil(totalSlides / instance.slidesPerView);
                    dotsExisting.innerHTML = '';
                    for (let i = 0; i < dotsCount; i++) {
                        const dot = document.createElement('button');
                        dot.className = 'carousel-dot';
                        dot.setAttribute('role', 'tab');
                        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                        dot.addEventListener('click', (e) => {
                            e.preventDefault();
                            instance.embla.scrollTo(i * instance.slidesPerView);
                            const ap = instance.embla.plugins?.().autoplay;
                            if (ap) ap.reset();
                        }, { passive: true });
                        dotsExisting.appendChild(dot);
                    }
                } else {
                    createPaginationDots(carousel, container, instance);
                }
            }
            
            setupEmblaListeners(instance);

            if (instance.autoplay) {
                const ap = instance.embla.plugins?.().autoplay;
                if (ap) {
                    carousel.addEventListener('mouseenter', () => ap.stop(), { passive: true });
                    carousel.addEventListener('mouseleave', () => ap.play(), { passive: true });
                    carousel.addEventListener('touchstart', () => ap.stop(), { passive: true });
                    carousel.addEventListener('touchend', () => ap.play(), { passive: true });
                }
            }
            
            updateCarousel(instance);
        });
    }

function createNavigationButtons(carousel, container, instance) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        instance.embla.scrollPrev();
        resetAutoplay(instance);
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        instance.embla.scrollNext();
        resetAutoplay(instance);
    });
    
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);
    
    instance.prevBtn = prevBtn;
    instance.nextBtn = nextBtn;
}

function createPaginationDots(carousel, container, instance) {
    const slides = instance.embla.slideNodes();
    if (slides.length <= 1) return;
    
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.setAttribute('role', 'tablist');
    
    const totalSlides = slides.length;
    const dotsCount = Math.ceil(totalSlides / instance.slidesPerView);
    
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            instance.embla.scrollTo(i * instance.slidesPerView);
            resetAutoplay(instance);
        });
        
        dotsContainer.appendChild(dot);
    }
    
    carousel.appendChild(dotsContainer);
    instance.dotsContainer = dotsContainer;
}

// Autoplay handled via embla-carousel-autoplay plugin above

function setupEmblaListeners(instance) {
    const { embla, carousel } = instance;
    embla.on('select', () => {
        updateDots(instance);
        updateNavigation(instance);
    });
    embla.on('reInit', () => {
        updateCarousel(instance);
        updateDots(instance);
        updateNavigation(instance);
    });
    if (instance.autoplay) {
        const ap = instance.embla.plugins?.().autoplay;
        if (ap) {
            carousel.addEventListener('mouseenter', () => ap.stop(), { passive: true });
            carousel.addEventListener('mouseleave', () => ap.play(), { passive: true });
            carousel.addEventListener('touchstart', () => ap.stop(), { passive: true });
            carousel.addEventListener('touchend', () => ap.play(), { passive: true });
        }
    }
}

function updateCarousel(instance) {
    const { embla, slidesPerView, showDots, showArrows } = instance;
    
    if (!embla) return;
    
    const selected = embla.selectedScrollSnap();
    
    if (showDots && instance.dotsContainer) {
        updateDots(instance);
    }
    
    if (showArrows) {
        updateNavigation(instance);
    }
}

function updateDots(instance) {
    const { dotsContainer, slidesPerView, embla } = instance;
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    if (!dots || !dots.length) return;
    
    const activeDotIndex = Math.floor(embla.selectedScrollSnap() / slidesPerView);
    
    dots.forEach((dot, index) => {
        const isActive = index === activeDotIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

function updateNavigation(instance) {
    const { prevBtn, nextBtn, embla } = instance;
    
    if (prevBtn) {
        const disabled = !embla.canScrollPrev();
        prevBtn.disabled = disabled;
        prevBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
    
    if (nextBtn) {
        const disabled = !embla.canScrollNext();
        nextBtn.disabled = disabled;
        nextBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
}

// Initialize carousels when DOM is ready
    function initializeCarousels() {
        initCarousel();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCarousels);
    } else {
        initializeCarousels();
    }
    
    setTimeout(initializeCarousels, 100);
    
    document.addEventListener('jankx:reinitialize-carousel', e => {
        const element = e?.detail?.element || null;
        initCarousel(element || undefined);
    });
    
    window.initCarousel = initCarousel;
    
    window.JankxCarousel = {
        init: initCarousel,
        next: (container) => {
            const instance = carouselInstances.get(container);
            if (instance) {
                instance.embla.scrollNext();
                const ap = instance.embla.plugins?.().autoplay;
                if (ap) ap.reset();
            }
        },
        prev: (container) => {
            const instance = carouselInstances.get(container);
            if (instance) {
                instance.embla.scrollPrev();
                const ap = instance.embla.plugins?.().autoplay;
                if (ap) ap.reset();
            }
        },
        goTo: (container, index) => {
            const instance = carouselInstances.get(container);
            if (instance) {
                instance.embla.scrollTo(index);
                const ap = instance.embla.plugins?.().autoplay;
                if (ap) ap.reset();
            }
        },
        update: (container) => {
            const instance = carouselInstances.get(container);
            if (instance) {
                updateCarousel(instance);
            }
        }
    };
    
})();
