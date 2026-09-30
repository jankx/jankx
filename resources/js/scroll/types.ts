/**
 * Public type contract for the Jankx scroll engine.
 *
 * Extensions, plugins and blocks must only rely on these types. The underlying
 * Lenis instance is intentionally hidden behind the facade so the implementation
 * can be swapped (Lenis → native → another lib) without breaking consumers.
 */

/** Options accepted by {@link ScrollFacade.scrollTo}. Mirrors Lenis `ScrollToOptions`. */
export type ScrollToOptions = {
    /**
     * Pixels added to the computed target. Use a negative value to pull the
     * target *down*, e.g. `offset: -80` to land a heading below an 80px
     * sticky header.
     */
    offset?: number;
    /** Skip animation and jump straight to the target. */
    immediate?: boolean;
    /** Animation duration in seconds. */
    duration?: number;
    /** Easing function. */
    easing?: (t: number) => number;
    /** LERP intensity between 0 and 1. Lower = longer glide. */
    lerp?: number;
    /** Force the scroll even while the engine is locked. */
    force?: boolean;
    /** Called when the animation starts. */
    onStart?: () => void;
    /** Called when the animation finishes. */
    onComplete?: () => void;
};

/** Anything that can be used as a scroll destination. */
export type ScrollTarget = number | string | HTMLElement;

/** Snapshot of the scroll state, passed to every scroll listener. */
export type ScrollState = {
    /** Current animated scroll offset in pixels. */
    scroll: number;
    /** Total scrollable distance in pixels. */
    limit: number;
    /** `scroll / limit`, clamped to 0..1. `0` when the page cannot scroll. */
    progress: number;
    /** Pixels per second. Positive = scrolling down. */
    velocity: number;
    /** `1` when moving down, `-1` when moving up, `0` when idle. */
    direction: 1 | -1 | 0;
    /** `true` while a scroll animation is in flight. */
    isScrolling: boolean;
};

/** Listener signature for {@link ScrollFacade.on}. */
export type ScrollListener = (state: ScrollState) => void;

/** Signature for {@link ScrollFacade.ready}. */
export type ReadyListener = (api: ScrollFacade) => void;

/** Runtime configuration, injected from PHP via `wp_localize_script`. */
export type ScrollConfig = {
    /** Master switch. When `false` the native browser scroll is left untouched. */
    enabled: boolean;
    /** LERP intensity for wheel scrolling. Lower = smoother. */
    lerp: number;
    /** Multiplier applied to raw wheel deltas. */
    wheelMultiplier: number;
    /** Multiplier applied to touch deltas. */
    touchMultiplier: number;
    /** Smooth touch scrolling (mimics native inertia). */
    syncTouch: boolean;
    /** Let Lenis handle `href="#id"` anchors automatically. */
    anchors: boolean;
    /** Let Lenis start/stop from the wrapper's CSS `overflow`. */
    autoToggle: boolean;
    /** Allow nested scroll containers to keep their native behaviour. */
    allowNestedScroll: boolean;
    /**
     * Honour `prefers-reduced-motion`. When the user asks for reduced motion,
     * smoothing is disabled and programmatic scrolls become instant.
     */
    respectReducedMotion: boolean;
    /**
     * Auto-offset for `scrollTo` targets so they are not hidden behind the
     * sticky header. Set to `0` to disable.
     */
    stickyOffset: number;
    /** Extra pixels added on top of the detected sticky offset. */
    offsetPadding: number;
    /**
     * Class added to `<html>` while the scroll lock is held in native mode.
     * In engine mode Lenis maintains its own `lenis-stopped` class.
     */
    lockedClass: string;
};

/**
 * The object exposed as `window.jankxScroll`.
 *
 * Every method is safe to call before initialisation: calls made early are
 * queued or fall back to native scrolling, so consumers never have to guess
 * whether the engine has booted.
 */
export type ScrollFacade = {
    /** `true` when Lenis is actually running (not just configured). */
    readonly enabled: boolean;
    /** `true` while scrolling is locked by one or more owners. */
    readonly locked: boolean;
    /** Live scroll state. Available before init, populated from native scroll. */
    readonly state: ScrollState;
    /**
     * Register a scroll listener. Returns an unsubscribe function.
     * Listeners registered before init are replayed immediately on the next
     * scroll event once the engine boots.
     */
    on(listener: ScrollListener): () => void;
    /** Remove a previously registered listener. */
    off(listener: ScrollListener): void;
    /**
     * Run a callback as soon as the engine is initialised. If it is already
     * initialised the callback runs synchronously.
     */
    ready(callback: ReadyListener): void;
    /**
     * Smooth-scroll to a target. Accepts a pixel value, a CSS selector or an
     * element. When the engine is disabled this degrades to native smooth
     * scrolling (or an instant jump if the user prefers reduced motion).
     */
    scrollTo(target: ScrollTarget, options?: ScrollToOptions): void;
    /** Lock scrolling. Reference counted — every `lock()` needs a matching `unlock()`. */
    lock(): void;
    /** Release one lock. Scrolling resumes when the count reaches zero. */
    unlock(): void;
    /**
     * Measure a DOM element and return the Y position it should be scrolled to,
     * accounting for the sticky header and the configured padding. Useful for
     * custom scroll logic that needs the same offset maths as `scrollTo`.
     */
    offsetFor(element: HTMLElement): number;
    /** Re-measure page dimensions. Call after DOM changes that alter height. */
    resize(): void;
    /** The raw Lenis instance, or `null` when the engine is disabled. */
    readonly instance: unknown;
};
