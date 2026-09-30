import Lenis from 'lenis';
import type {
    ReadyListener,
    ScrollConfig,
    ScrollFacade,
    ScrollListener,
    ScrollState,
    ScrollTarget,
    ScrollToOptions,
} from './types';

const DEFAULT_CONFIG: ScrollConfig = {
    enabled: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false,
    anchors: false,
    autoToggle: false,
    allowNestedScroll: true,
    respectReducedMotion: true,
    stickyOffset: 0,
    offsetPadding: 0,
    lockedClass: 'jankx-scroll-locked',
};

const GLOBAL_KEY = 'jankxScroll';

const OFFSET_VAR = '--jankx-scroll-offset';

const EMPTY_STATE: ScrollState = {
    scroll: 0,
    limit: 0,
    progress: 0,
    velocity: 0,
    direction: 0,
    isScrolling: false,
};

/**
 * Single source of truth for page scrolling.
 *
 * Owns the Lenis lifecycle and exposes a stable facade on `window.jankxScroll`.
 * The facade is deliberately defensive: every method works before
 * initialisation and after the engine has been disabled, so blocks and
 * extensions never have to branch on "is Lenis running".
 */
export class ScrollManager implements ScrollFacade {
    private lenis: Lenis | null = null;
    private config: ScrollConfig;
    private listeners = new Set<ScrollListener>();
    private readyCallbacks = new Set<ReadyListener>();
    private lockCount = 0;
    private booted = false;
    private lastState: ScrollState = EMPTY_STATE;
    private nativeScrollHandler: (() => void) | null = null;
    private lastPublishedOffset = 0;

    constructor(config: Partial<ScrollConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    get enabled(): boolean {
        return this.lenis !== null;
    }

    get locked(): boolean {
        return this.lockCount > 0;
    }

    get state(): ScrollState {
        return this.lastState;
    }

    get instance(): unknown {
        return this.lenis;
    }

    /**
     * Merge server-provided configuration. Called before {@link init} so PHP
     * options always win over the build-time defaults.
     */
    public configure(config: Partial<ScrollConfig>): this {
        this.config = { ...this.config, ...config };
        return this;
    }

    /**
     * Boot the engine. Safe to call twice — the second call is a no-op.
     *
     * When `enabled` is false, or Lenis is unavailable, the manager stays in
     * native mode and keeps mirroring scroll state so listeners still fire.
     */
    public init(): void {
        if (this.booted) {
            return;
        }
        this.booted = true;

        this.lastState = this.readNativeState();
        this.listenNativeScroll();
        this.measureStickyHeader();

        if (!this.config.enabled) {
            this.flushReady();
            return;
        }

        try {
            this.lenis = new Lenis({
                lerp: this.config.lerp,
                wheelMultiplier: this.config.wheelMultiplier,
                touchMultiplier: this.config.touchMultiplier,
                syncTouch: this.config.syncTouch,
                anchors: this.config.anchors,
                autoToggle: this.config.autoToggle,
                allowNestedScroll: this.config.allowNestedScroll,
                respectReducedMotion: this.config.respectReducedMotion,
                autoRaf: true,
            });
        } catch (error) {
            // Never let a scroll library break the page.
            this.lenis = null;
            console.warn('[Jankx] Smooth scroll unavailable, falling back to native scroll.', error);
        }

        if (this.lenis) {
            this.lenis.on('scroll', this.handleLenisScroll);
        }

        this.flushReady();
    }

    /** Tear the engine down and restore native scrolling. */
    public destroy(): void {
        if (this.lenis) {
            this.lenis.off('scroll', this.handleLenisScroll);
            this.lenis.destroy();
            this.lenis = null;
        }
        if (this.nativeScrollHandler) {
            window.removeEventListener('scroll', this.nativeScrollHandler);
            this.nativeScrollHandler = null;
        }
        document.documentElement.classList.remove(this.config.lockedClass);
        this.lockCount = 0;
        this.booted = false;
        this.flushReady();
    }

    public on(listener: ScrollListener): () => void {
        this.listeners.add(listener);
        listener(this.lastState);
        return () => this.off(listener);
    }

    public off(listener: ScrollListener): void {
        this.listeners.delete(listener);
    }

    public ready(callback: ReadyListener): void {
        this.readyCallbacks.add(callback);
        if (this.booted) {
            callback(this);
        }
    }

    /**
     * Scroll to a target using the engine when available.
     *
     * When the target is an element (or a selector matching one) the sticky
     * header offset is applied automatically unless the caller passes an
     * explicit `offset`.
     */
    public scrollTo(target: ScrollTarget, options: ScrollToOptions = {}): void {
        const resolved = this.resolveTarget(target);
        const hasExplicitOffset = options.offset !== undefined;

        if (this.lenis && !this.locked) {
            this.lenis.scrollTo(resolved, {
                ...options,
                offset: hasExplicitOffset ? options.offset : this.autoOffset(resolved),
            });
            return;
        }

        this.nativeScrollTo(resolved, hasExplicitOffset ? options.offset : this.autoOffset(resolved), options);
    }

    /**
     * Reference-counted scroll lock so overlapping owners (e.g. a modal opened
     * from an offcanvas panel) cannot unlock each other.
     */
    public lock(): void {
        this.lockCount += 1;
        if (this.lockCount > 1) {
            return;
        }
        if (this.lenis) {
            this.lenis.stop();
        } else {
            document.documentElement.classList.add(this.config.lockedClass);
        }
    }

    public unlock(): void {
        if (this.lockCount === 0) {
            return;
        }
        this.lockCount -= 1;
        if (this.lockCount > 0) {
            return;
        }
        if (this.lenis) {
            this.lenis.start();
        } else {
            document.documentElement.classList.remove(this.config.lockedClass);
        }
    }

    /**
     * Y position an element should be scrolled to so it clears the sticky
     * header. Exposed for extensions implementing custom scroll logic.
     */
    public offsetFor(element: HTMLElement): number {
        return this.autoOffset(element);
    }

    /**
     * Re-measure page dimensions and the sticky offset. Call after DOM changes
     * that alter height, and when a sticky header toggles its state.
     */
    public resize(): void {
        this.measureStickyHeader();
        this.lenis?.resize();
        this.lastState = this.enabled ? this.lastState : this.readNativeState();
    }

    // ── Internals ───────────────────────────────────────────────────────────

    private handleLenisScroll = (lenis: Lenis): void => {
        const limit = lenis.limit ?? 0;
        const scroll = lenis.animatedScroll ?? lenis.scroll ?? 0;
        this.lastState = {
            scroll,
            limit,
            progress: limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0,
            velocity: lenis.velocity ?? 0,
            direction: lenis.direction ?? 0,
            isScrolling: Math.abs(lenis.velocity ?? 0) > 0.01,
        };
        this.emit();
    };

    /**
     * Mirror native scroll events in native mode so consumers behave
     * identically whether or not the engine booted.
     */
    private listenNativeScroll(): void {
        if (this.nativeScrollHandler) {
            return;
        }
        this.nativeScrollHandler = () => {
            this.lastState = this.readNativeState();
            this.emit();
        };
        window.addEventListener('scroll', this.nativeScrollHandler, { passive: true });
    }

    private readNativeState(): ScrollState {
        const scroll = window.scrollY || document.documentElement.scrollTop || 0;
        const limit = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
        );
        return {
            scroll,
            limit,
            progress: limit > 0 ? Math.min(1, Math.max(0, scroll / limit)) : 0,
            velocity: 0,
            direction: 0,
            isScrolling: false,
        };
    }

    private emit(): void {
        this.listeners.forEach((listener) => {
            try {
                listener(this.lastState);
            } catch (error) {
                console.error('[Jankx] Scroll listener failed.', error);
            }
        });
    }

    private flushReady(): void {
        this.readyCallbacks.forEach((callback) => {
            try {
                callback(this);
            } catch (error) {
                console.error('[Jankx] Scroll ready callback failed.', error);
            }
        });
    }

    /**
     * Turn a selector or element into a concrete scroll destination. Strings
     * that are not a selector (e.g. `"120"`) are treated as pixel values.
     */
    private resolveTarget(target: ScrollTarget): number | string | HTMLElement {
        if (typeof target === 'number') {
            return target;
        }
        if (typeof target === 'string') {
            if (/^-?\d+(\.\d+)?$/.test(target.trim())) {
                return parseFloat(target);
            }
            return target;
        }
        return target;
    }

    /**
     * Sticky-aware offset. Only applied to element/selector targets — a raw
     * pixel value is an explicit destination and must not be shifted.
     */
    private autoOffset(target: ScrollTarget): number {
        const element = this.toElement(target);
        if (!element) {
            return 0;
        }
        const sticky = this.config.stickyOffset || this.measureStickyHeader();
        return -1 * (sticky + this.config.offsetPadding);
    }

    private toElement(target: ScrollTarget): HTMLElement | null {
        if (typeof target === 'string') {
            if (/^-?\d+(\.\d+)?$/.test(target.trim())) {
                return null;
            }
            try {
                return document.querySelector<HTMLElement>(target);
            } catch {
                return null;
            }
        }
        if (target && typeof (target as HTMLElement).getBoundingClientRect === 'function') {
            return target as HTMLElement;
        }
        return null;
    }

    /** Height of the live sticky header, 0 when none is active. */
    private measureStickyHeader(): number {
        const header = document.querySelector<HTMLElement>('header.is-sticky');
        if (!header) {
            return this.publishOffset(0);
        }
        const style = window.getComputedStyle(header);
        if (style.position !== 'fixed' && style.position !== 'sticky') {
            return this.publishOffset(0);
        }
        return this.publishOffset(header.offsetHeight);
    }

    /**
     * Mirror the measured offset into a CSS custom property so that native
     * fragment navigation is compensated as well. Returns the value so
     * callers can reuse it as a scroll offset.
     */
    private publishOffset(value: number): number {
        const offset = this.config.stickyOffset || value;
        if (offset === this.lastPublishedOffset) {
            return offset;
        }
        this.lastPublishedOffset = offset;
        document.documentElement.style.setProperty(OFFSET_VAR, `${offset}px`);
        return offset;
    }

    /**
     * Fallback path used when the engine is disabled or the page is locked.
     * Avoids `scroll-behavior` so the caller's easing options are respected.
     */
    private nativeScrollTo(
        target: number | string | HTMLElement,
        offset: number,
        options: ScrollToOptions
    ): void {
        const element = this.toElement(target);
        const top =
            typeof target === 'number'
                ? target + offset
                : element
                  ? element.getBoundingClientRect().top + window.scrollY + offset
                  : null;

        if (top === null) {
            return;
        }

        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const instant = options.immediate === true || prefersReduced === true;
        window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
        options.onComplete?.();
    }
}

/**
 * Install the facade on `window` exactly once. Extensions and plugins call
 * this helper to obtain the shared instance without importing a bundle, so
 * Lenis is never initialised twice.
 */
export function getScrollManager(config?: Partial<ScrollConfig>): ScrollManager {
    const scope = window as unknown as Record<string, ScrollManager | undefined>;
    if (!scope[GLOBAL_KEY]) {
        scope[GLOBAL_KEY] = new ScrollManager(config);
    } else if (config) {
        scope[GLOBAL_KEY].configure(config);
    }
    return scope[GLOBAL_KEY] as ScrollManager;
}
