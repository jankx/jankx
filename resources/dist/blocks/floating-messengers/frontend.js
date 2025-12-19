"use strict";
/**
 * Floating Messengers - frontend behavior
 */
(function () {
    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target)
            return;
        const trigger = target.closest('.jankx-floating-messengers.trigger-toggle .fm-trigger');
        if (trigger) {
            const root = trigger.closest('.jankx-floating-messengers');
            if (root) {
                root.classList.toggle('is-open');
            }
        }
    });
    // Initialize count-based class for expansion positioning
    function initCountClass() {
        document.querySelectorAll('.jankx-floating-messengers').forEach((root) => {
            const list = root.querySelector('.fm-list');
            if (!list)
                return;
            const count = list.querySelectorAll('.fm-node').length;
            root.dataset.count = String(count);
        });
    }
    document.addEventListener('DOMContentLoaded', initCountClass);
    initCountClass();
})();
