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
})();

