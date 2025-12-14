/**
 * Floating Messengers - frontend behavior
 */
(function () {
    document.addEventListener('click', function (e) {
        const target = e.target as HTMLElement;
        if (!target) return;
        const trigger = target.closest('.jankx-floating-messengers.trigger-toggle .fm-trigger') as HTMLElement | null;
        if (trigger) {
            const root = trigger.closest('.jankx-floating-messengers') as HTMLElement | null;
            if (root) {
                root.classList.toggle('is-open');
            }
        }
    });
    // Initialize count-based class for expansion positioning
    function initCountClass() {
        document.querySelectorAll<HTMLElement>('.jankx-floating-messengers').forEach((root) => {
            const list = root.querySelector('.fm-list');
            if (!list) return;
            const count = list.querySelectorAll('.fm-node').length;
            root.dataset.count = String(count);
        });
    }
    document.addEventListener('DOMContentLoaded', initCountClass);
    initCountClass();
})();
