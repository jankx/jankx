import EmblaCarousel from 'embla-carousel';

function initDynamicDataCarousel(root) {
    const carousels = root ? root.querySelectorAll('.wp-block-jankx-dynamic-data-layout[data-layout="carousel"]') : 
                           document.querySelectorAll('.wp-block-jankx-dynamic-data-layout[data-layout="carousel"]');
    
    carousels.forEach(carousel => {
        if (carousel.classList.contains('carousel-initialized')) return;
        
        const container = carousel.querySelector('.carousel-container');
        if (!container) return;
        
        carousel.classList.add('carousel-initialized');
        
        const slidesPerView = parseInt(carousel.getAttribute('data-slides-per-view')) || 
                            parseInt(getComputedStyle(carousel).getPropertyValue('--slides-per-view')) || 1;
        const spaceBetween = parseInt(carousel.getAttribute('data-space-between')) || 
                           parseInt(getComputedStyle(carousel).getPropertyValue('--space-between')) || 16;
        const autoplay = carousel.getAttribute('data-autoplay') === 'true';
        const autoplayDelay = Math.max(3000, parseInt(carousel.getAttribute('data-autoplay-delay')) || 5000);
        const loop = carousel.getAttribute('data-loop') === 'true';
        const showArrows = carousel.classList.contains('has-arrows') || true;
        const showDots = carousel.classList.contains('has-dots') || true;
        
        container.style.setProperty('--slides-per-view', slidesPerView);
        container.style.setProperty('--space-between', `${spaceBetween}px`);
        
        container.classList.add('carousel-container', 'embla__viewport');
        let track = container.querySelector('.embla__container');
        if (!track) {
            track = document.createElement('div');
            track.className = 'embla__container';
            while (container.firstChild) {
                const node = container.firstChild;
                if (node.classList && node.classList.contains('carousel-slide')) {
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
        
        const slides = Array.from(container.children);
        const embla = EmblaCarousel(container, {
            loop: loop,
            duration: 25,
            align: 'start'
        });
        
        if (showArrows) {
            createNavigationButtons(carousel, container, embla);
        }
        
        if (showDots) {
            createPaginationDots(carousel, container, embla);
        }
        
        if (autoplay) {
            setupAutoplay(carousel, container, embla, autoplayDelay);
        }
        
        const onSelect = () => {
            updateActiveDot(carousel, container, embla);
            updateNavigationButtons(carousel, container, embla);
        };
        embla.on('select', onSelect);
        embla.on('reInit', onSelect);
        onSelect();
    });
}

function createNavigationButtons(carousel, container, embla) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    prevBtn.addEventListener('click', () => embla.scrollPrev(), { passive: true });
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    nextBtn.addEventListener('click', () => embla.scrollNext(), { passive: true });
    
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);
}

function createPaginationDots(carousel, container, embla) {
    const slides = embla.slideNodes();
    if (slides.length <= 1) return;
    
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => embla.scrollTo(index), { passive: true });
        
        dotsContainer.appendChild(dot);
    });
    
    carousel.appendChild(dotsContainer);
}

function setupAutoplay(carousel, container, embla, delay) {
    let autoplayInterval;
    
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (embla.canScrollNext()) {
                embla.scrollNext();
            } else {
                embla.scrollTo(0);
            }
        }, delay);
    };
    
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };
    
    startAutoplay();
    
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    carousel.addEventListener('touchstart', stopAutoplay);
    carousel.addEventListener('touchend', startAutoplay);
}

function updateActiveDot(carousel, container, embla) {
    const dots = carousel.querySelectorAll('.carousel-dot');
    if (dots.length === 0) return;
    
    const currentIndex = embla.selectedScrollSnap();
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === currentIndex);
    });
}

function updateNavigationButtons(carousel, container, embla) {
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.disabled = !embla.canScrollPrev();
    }
    
    if (nextBtn) {
        nextBtn.disabled = !embla.canScrollNext();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDynamicDataCarousel();
    
    if (typeof wp !== 'undefined' && wp.data && wp.data.subscribe) {
        wp.data.subscribe(() => {
            setTimeout(() => {
                initDynamicDataCarousel();
            }, 100);
        });
    }
});

// Export for potential manual initialization
if (typeof window !== 'undefined') {
    window.JankxCarousel = {
        init: initDynamicDataCarousel
    };
}

// Re-initialize carousels when custom event is fired
document.addEventListener('jankx:reinitialize-carousel', e => {
    const element = e?.detail?.element || null;
    initDynamicDataCarousel(element || undefined);
});
