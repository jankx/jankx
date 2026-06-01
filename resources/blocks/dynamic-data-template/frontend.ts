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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHoverAnimations);
    } else {
        initHoverAnimations();
    }
})();
