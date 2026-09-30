import 'lenis/dist/lenis.css';
import './style.scss';
import { getScrollManager } from './ScrollManager';
import type { ScrollConfig } from './types';

declare global {
    interface Window {
        jankxScrollConfig?: Partial<ScrollConfig>;
    }
}

/**
 * Bootstrap the shared scroll engine.
 *
 * Configuration is injected by PHP as `window.jankxScrollConfig` (theme option
 * `enable_smooth_scroll` plus filters). The facade is published on
 * `window.jankxScroll` before this runs so blocks loaded in the same tick can
 * already call it.
 */
function boot(): void {
    const manager = getScrollManager(window.jankxScrollConfig || {});

    const start = (): void => manager.init();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

    // Content that loads lazily (infinite scroll, AJAX blocks) changes the
    // document height; let Lenis re-measure when the page settles.
    window.addEventListener('load', () => manager.resize());
}

boot();

export { getScrollManager, ScrollManager } from './ScrollManager';
export type {
    ReadyListener,
    ScrollConfig,
    ScrollFacade,
    ScrollListener,
    ScrollState,
    ScrollTarget,
    ScrollToOptions,
} from './types';
