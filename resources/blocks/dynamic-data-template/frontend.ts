/**
 * Dynamic Data Template - Frontend Script
 * Handles animate.css hover/unhover effects on each template item.
 */
(function () {
    'use strict';

    function initHoverAnimations(): void {
        const items = Array.from(
            document.querySelectorAll<HTMLElement>('.dynamic-data-template__item[data-hover-ani], .dynamic-data-template__item[data-unhover-ani]')
        );

        items.forEach((item) => {
            const hoverAni = item.getAttribute('data-hover-ani');
            const unhoverAni = item.getAttribute('data-unhover-ani');

            if (!hoverAni && !unhoverAni) return;

            item.addEventListener('mouseenter', () => {
                if (hoverAni) {
                    item.classList.remove('animate__animated', `animate__${hoverAni}`, `animate__${unhoverAni}`);
                    void item.offsetWidth; // Force reflow
                    item.classList.add('animate__animated', `animate__${hoverAni}`);
                }
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('animate__animated', `animate__${hoverAni}`, `animate__${unhoverAni}`);
                if (unhoverAni) {
                    void item.offsetWidth; // Force reflow
                    item.classList.add('animate__animated', `animate__${unhoverAni}`);
                }
            });

            item.addEventListener('animationend', () => {
                item.classList.remove('animate__animated', `animate__${hoverAni}`, `animate__${unhoverAni}`);
            });
        });
    }

    function initRevealAnimations(): void {
        const revealItems = document.querySelectorAll('.jankx-reveal');
        if (!revealItems.length) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers: show all items immediately
            revealItems.forEach(item => item.classList.add('is-in-view'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                    // Once animated, we can stop observing this element
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealItems.forEach(item => {
            observer.observe(item);
        });
    }

    function initAnimations(): void {
        initHoverAnimations();
        initRevealAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
