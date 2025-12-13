/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./blocks/advanced-button/frontend.ts ***!
  \********************************************/
/**
 * Advanced Button Frontend Script
 */

// Define global interfaces

(function () {
  'use strict';

  function initAdvancedButtons() {
    const buttons = document.querySelectorAll('.jankx-button-modal-trigger');
    buttons.forEach(button => {
      // Check if event listener is already attached (to avoid duplicates if called multiple times)
      if (button.getAttribute('data-jankx-click-attached') === 'true') {
        return;
      }
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const trigger = e.currentTarget;
        const modalId = trigger.getAttribute('data-modal-id');
        if (!modalId) {
          return;
        }

        // Try JankxModal first (wrapper around MicroModal with extras)
        if (window.JankxModal) {
          window.JankxModal.show(modalId, trigger);
        }
        // Fallback to raw MicroModal
        else if (window.MicroModal) {
          window.MicroModal.show(modalId);
        }
        // Fallback: Check if modal exists and show it manually (simple toggle)
        else {
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
          } else {
            console.warn(`[Jankx Advanced Button] Modal with ID "${modalId}" not found or JankxModal library not loaded.`);
          }
        }
      });

      // Mark as attached
      button.setAttribute('data-jankx-click-attached', 'true');
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedButtons);
  } else {
    initAdvancedButtons();
  }

  // Optional: Re-init on dynamic content loading (if any custom event exists)
  // document.addEventListener('jankx:content-loaded', initAdvancedButtons);
})();
/******/ })()
;
//# sourceMappingURL=frontend.js.map