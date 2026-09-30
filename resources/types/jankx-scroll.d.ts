/**
 * Ambient declarations for the shared scroll engine.
 *
 * Every block, extension and plugin consumes scrolling through
 * `window.jankxScroll` — the Lenis instance is never imported directly. The
 * bundle is a separate webpack entry, so this global is the contract between
 * the engine and its consumers.
 *
 * The property is typed as possibly `undefined` on purpose: block scripts can
 * execute before the engine bundle. Consumers must therefore use optional
 * chaining and fall back to native behaviour.
 */
import type { ScrollFacade } from '../js/scroll/types';

declare global {
    interface Window {
        /** Shared scroll facade. Present once the engine bundle has run. */
        jankxScroll?: ScrollFacade;
    }
}

export {};
