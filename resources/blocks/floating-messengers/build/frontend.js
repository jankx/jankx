/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./blocks/floating-messengers/frontend.ts ***!
  \************************************************/
/**
 * Floating Messengers - frontend behavior
 */
(function () {
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (!target) return;
    const trigger = target.closest('.jankx-floating-messengers.trigger-toggle .fm-trigger');
    if (trigger) {
      const root = trigger.closest('.jankx-floating-messengers');
      if (root) {
        root.classList.toggle('is-open');
      }
    }
  });
})();
/******/ })()
;
//# sourceMappingURL=frontend.js.map