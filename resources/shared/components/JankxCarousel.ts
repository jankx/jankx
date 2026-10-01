import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

export default class JankxCarousel {
    public carousel: any;
    public options: any;
    public container!: HTMLElement;
    public config: any;
    public embla: any;
    public prevBtn: HTMLButtonElement | null = null;
    public nextBtn: HTMLButtonElement | null = null;
    public dotsContainer: HTMLElement | null = null;
    public updateDotsCallback: (() => void) | null = null;

    constructor(carousel: any, options: any = {}) {
        if (!carousel || carousel._carouselInitialized) return;
        this.carousel = carousel;
        this.options = options;
        const container = carousel.querySelector('.embla__viewport') || carousel.querySelector('.carousel-container') || carousel.querySelector('.jankx-carousel-container');

        if (!container) return;
        this.container = container;

        this.init();
    }

    init() {
        this.setupConfig();
        this.prepareDOM();
        this.initEmbla();
        this.setupNavigation();
        this.setupPagination();
        this.setupEventListeners();

        this.carousel._carouselInitialized = true;
        this.carousel.classList.add('carousel-initialized');

        this.updateUI();
    }

    /**
     * Read the full block attribute payload that the PHP renderers embed as
     * JSON on the block wrapper. Dynamic layout blocks ship every attribute
     * here, which lets us pick up carousel options without having to mirror
     * each one into an individual data-* attribute.
     */
    readBlockSettings(): Record<string, any> {
        const raw = this.carousel.getAttribute?.('data-block-settings');
        if (!raw) return {};

        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }

    private pickEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
        return allowed.includes(value as T) ? (value as T) : fallback;
    }

    private pickNumber(value: unknown, fallback: number, min?: number, max?: number): number {
        const parsed = typeof value === 'number' ? value : parseFloat(String(value));
        if (!isFinite(parsed)) return fallback;
        if (min !== undefined && parsed < min) return fallback;
        if (max !== undefined && parsed > max) return fallback;
        return parsed;
    }

    /**
     * block.json declares carouselContainScroll as an enum of strings
     * ("false" | "trimSnaps" | "keepSnaps"), while Embla expects a real boolean
     * for the disabled case. Normalise both shapes.
     */
    private resolveContainScroll(value: unknown): false | 'trimSnaps' | 'keepSnaps' {
        if (value === false || value === 'false' || value === 0 || value === '0') return false;
        if (value === 'keepSnaps') return 'keepSnaps';
        return 'trimSnaps';
    }

    setupConfig() {
        const computed = getComputedStyle(this.carousel);
        const cssSlides = parseInt(computed.getPropertyValue('--slides-per-view')) || NaN;
        const cssSpace = parseInt(computed.getPropertyValue('--space-between')) || NaN;

        const dataSlides = parseInt(this.carousel.getAttribute('data-slides-per-view')) || NaN;
        const dataColumns = parseInt(this.carousel.getAttribute('data-columns')) || NaN;
        const dataSpace = parseInt(this.carousel.getAttribute('data-space-between')) || NaN;

        const settings = this.readBlockSettings();

        const dataLoop = this.carousel.getAttribute('data-loop');
        const loop = dataLoop !== null ? dataLoop !== 'false' : settings.loop !== false;

        const dataSlidesToScroll = this.carousel.getAttribute('data-slides-to-scroll');

        // The two layout renderers only emit data-autoplay/data-loop, while
        // has-arrows/has-dots classes are added by a couple of secondary render
        // paths. Resolve visibility from the block settings first so the
        // Inspector toggles behave the same on every path.
        const dataShowArrows = this.carousel.getAttribute('data-show-arrows');
        const dataShowDots = this.carousel.getAttribute('data-show-dots');
        const showArrows = dataShowArrows !== null
            ? dataShowArrows !== 'false'
            : (typeof settings.showArrows === 'boolean'
                ? settings.showArrows
                : (this.carousel.classList.contains('has-arrows') || this.carousel.classList.contains('show-arrows')));
        const showDots = dataShowDots !== null
            ? dataShowDots !== 'false'
            : (typeof settings.showDots === 'boolean'
                ? settings.showDots
                : (this.carousel.classList.contains('has-dots') || this.carousel.classList.contains('show-dots')));

        this.config = {
            slidesPerView: (dataSlides || dataColumns || cssSlides || 1),
            spaceBetween: (dataSpace || cssSpace || 16),
            peekAmount: parseFloat(this.carousel.getAttribute('data-peek-amount') || '0') || 0,
            autoplay: this.carousel.getAttribute('data-autoplay') === 'true' || this.carousel.classList.contains('has-autoplay'),
            autoplayDelay: Math.max(3000, parseInt(this.carousel.getAttribute('data-autoplay-delay')) || 5000),
            showArrows: showArrows,
            showDots: showDots,
            loop: loop,
            dotsPerPage: this.carousel.getAttribute('data-dots-per-page') === 'true' || this.options.dotsPerPage || false,
            align: this.pickEnum(settings.carouselAlign, ['start', 'center', 'end'] as const, 'start'),
            axis: this.pickEnum(settings.carouselAxis, ['x', 'y'] as const, 'x'),
            direction: this.pickEnum(settings.carouselDirection, ['ltr', 'rtl'] as const, 'ltr'),
            containScroll: this.resolveContainScroll(settings.carouselContainScroll),
            startIndex: this.pickNumber(settings.carouselStartIndex, 0, 0),
            duration: this.pickNumber(settings.carouselDuration, 25, 0),
            dragFree: settings.carouselDragFree === true,
            dragThreshold: this.pickNumber(settings.carouselDragThreshold, 10, 0),
            skipSnaps: settings.carouselSkipSnaps === true,
            inViewThreshold: this.pickNumber(settings.carouselInViewThreshold, 0, 0, 1),
            paginationAlignment: this.pickEnum(settings.paginationAlignment, ['left', 'center', 'right'] as const, 'center'),
            ...this.options
        };

        // dotsPerPage relies on Embla's "auto" slide detection, so it wins over
        // the explicit slidesToScroll value.
        this.config.slidesToScroll = this.config.dotsPerPage
            ? 'auto'
            : this.pickNumber(
                dataSlidesToScroll !== null ? dataSlidesToScroll : settings.slidesToScroll,
                1,
                1
            );

        // If not specified, default these to true for certain block types or if they have specific classes
        if (dataShowArrows === null && settings.showArrows === undefined && !this.config.showArrows) {
            this.config.showArrows = this.carousel.classList.contains('wp-block-jankx-dynamic-data-layout');
        }
        if (dataShowDots === null && settings.showDots === undefined && !this.config.showDots) {
            this.config.showDots = this.carousel.classList.contains('wp-block-jankx-dynamic-data-layout');
        }

        // Let CSS handle --slides-per-view responsively via @media queries and variables.
        // this.container.style.setProperty('--slides-per-view', this.config.slidesPerView);
        this.container.style.setProperty('--space-between', `${this.config.spaceBetween}px`);
        this.container.style.setProperty('--peek-amount', `${this.config.peekAmount}%`);
    }

    prepareDOM() {
        this.container.classList.add('embla__viewport');
        let track = this.container.querySelector('.embla__container');
        if (!track) {
            track = document.createElement('div');
            track.className = 'embla__container';
            while (this.container.firstChild) {
                const node = this.container.firstChild as ChildNode;
                if (node.nodeType === 3 && !(node.nodeValue || '').trim()) {
                    this.container.removeChild(node);
                    continue;
                }
                if (node.nodeType === 8) {
                    this.container.removeChild(node);
                    continue;
                }

                if (node.nodeType === 1 && (node as HTMLElement).classList.contains('carousel-slide')) {
                    track.appendChild(node);
                } else {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'carousel-slide';
                    this.container.removeChild(node);
                    wrapper.appendChild(node);
                    track.appendChild(wrapper);
                }
            }
            this.container.appendChild(track);
        }
    }

    initEmbla() {
        const plugins = this.config.autoplay ? [Autoplay({ delay: this.config.autoplayDelay, stopOnInteraction: true, stopOnMouseEnter: true })] : [];

        this.embla = EmblaCarousel(this.container, {
            loop: this.config.loop,
            duration: this.config.duration,
            align: this.config.align,
            axis: this.config.axis,
            direction: this.config.direction,
            containScroll: this.config.containScroll,
            startIndex: this.config.startIndex,
            dragFree: this.config.dragFree,
            dragThreshold: this.config.dragThreshold,
            skipSnaps: this.config.skipSnaps,
            inViewThreshold: this.config.inViewThreshold,
            slidesToScroll: this.config.slidesToScroll
        }, plugins);
    }

    setupNavigation() {
        if (!this.config.showArrows) return;

        let prevBtn = this.carousel.querySelector('.carousel-prev');
        let nextBtn = this.carousel.querySelector('.carousel-next');

        if (!prevBtn || !nextBtn) {
            prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav carousel-prev';
            prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav carousel-next';
            nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

            this.carousel.appendChild(prevBtn);
            this.carousel.appendChild(nextBtn);
        }

        prevBtn.onclick = (e: MouseEvent) => {
            e.preventDefault();
            this.embla.scrollPrev();
        };
        nextBtn.onclick = (e: MouseEvent) => {
            e.preventDefault();
            this.embla.scrollNext();
        };

        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
    }

    setupPagination() {
        if (!this.config.showDots) return;

        let dotsContainer = this.carousel.querySelector('.carousel-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            this.carousel.appendChild(dotsContainer);
        }

        dotsContainer.dataset.alignment = this.config.paginationAlignment;
        dotsContainer.style.justifyContent = this.config.paginationAlignment;

        const updateDots = () => {
            const scrollSnaps = this.embla.scrollSnapList();
            dotsContainer.innerHTML = '';

            if (scrollSnaps.length <= 1) return;

            scrollSnaps.forEach((_: any, index: number) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                if (index === this.embla.selectedScrollSnap()) dot.classList.add('is-active');
                dot.onclick = () => this.embla.scrollTo(index);
                dotsContainer.appendChild(dot);
            });
        };

        this.dotsContainer = dotsContainer;
        this.updateDotsCallback = updateDots;
        updateDots();
    }

    setupEventListeners() {
        this.embla.on('select', () => this.updateUI());
        this.embla.on('reInit', () => {
            if (this.updateDotsCallback) this.updateDotsCallback();
            this.updateUI();
        });

        if (this.config.autoplay) {
            const ap = this.embla.plugins().autoplay;
            if (ap) {
                this.carousel.addEventListener('mouseenter', () => ap.stop());
                this.carousel.addEventListener('mouseleave', () => ap.play());
            }
        }
    }

    updateUI() {
        if (this.prevBtn) this.prevBtn.disabled = !this.embla.canScrollPrev();
        if (this.nextBtn) this.nextBtn.disabled = !this.embla.canScrollNext();

        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            const activeIndex = this.embla.selectedScrollSnap();
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === activeIndex);
            });
        }
    }

    destroy() {
        if (this.embla) {
            this.embla.destroy();
        }
        this.carousel._carouselInitialized = false;
        this.carousel.classList.remove('carousel-initialized');
    }
}
