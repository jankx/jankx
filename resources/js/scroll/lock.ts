/**
 * Shared page scroll-lock helper.
 *
 * Blocks must not manipulate `document.body.style.overflow/position` directly:
 * that technique freezes the body with `position: fixed`, which desynchronises
 * from the scroll engine and causes a visible jump when scrolling resumes.
 *
 * `jankxScroll.lock()` is reference counted, so nesting a modal inside an
 * offcanvas panel is safe — each owner pairs one `lock()` with one `unlock()`.
 */

const COMPENSATION_CLASS = 'jankx-scrollbar-compensated';

/**
 * Prevent the page from scrolling while an overlay is open.
 *
 * @param lockClass Optional extra class placed on `<html>` for overlay styling.
 */
export function lockPageScroll(lockClass?: string): void {
    const scroll = window.jankxScroll;

    if (scroll) {
        scroll.lock();
    } else {
        // Engine bundle not loaded yet: fall back to the native equivalent.
        document.documentElement.classList.add('jankx-scroll-locked');
    }

    if (lockClass) {
        document.documentElement.classList.add(lockClass);
    }

    compensateScrollbar();
}

/**
 * Resume page scrolling once every overlay has closed.
 *
 * @param lockClass Optional extra class previously passed to {@link lockPageScroll}.
 */
export function unlockPageScroll(lockClass?: string): void {
    const scroll = window.jankxScroll;

    if (scroll) {
        scroll.unlock();
    } else {
        document.documentElement.classList.remove('jankx-scroll-locked');
    }

    if (lockClass) {
        document.documentElement.classList.remove(lockClass);
    }

    restoreScrollbar();
}

/**
 * Padding compensates for the scrollbar vanishing while scrolling is locked,
 * which otherwise shifts the whole layout to the left.
 */
function compensateScrollbar(): void {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap <= 0) {
        return;
    }
    document.documentElement.style.setProperty('--jankx-scrollbar-gap', `${gap}px`);
    document.documentElement.classList.add(COMPENSATION_CLASS);
}

function restoreScrollbar(): void {
    document.documentElement.classList.remove(COMPENSATION_CLASS);
    document.documentElement.style.removeProperty('--jankx-scrollbar-gap');
}

/**
 * Opt a nested scroll container out of engine smoothing.
 *
 * Lenis already honours this attribute, so the only work here is adding it.
 * Use it on dropdowns, carousels and long modal bodies whose content scrolls
 * independently of the document.
 */
export function markNestedScroll(element: HTMLElement): void {
    element.setAttribute('data-lenis-prevent', '');
}
