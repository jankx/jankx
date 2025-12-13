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
    console.log('[AdvancedButton] initAdvancedButtons: found', buttons.length, 'buttons');
    buttons.forEach(button => {
      // Check if event listener is already attached (to avoid duplicates if called multiple times)
      if (button.getAttribute('data-jankx-click-attached') === 'true') {
        console.log('[AdvancedButton] listener already attached to', button);
        return;
      }
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const trigger = e.currentTarget;
        // Try the new `data-modal-id` attribute first, then fallback to Micromodal style
        const modalIdAttr = trigger.getAttribute('data-modal-id');
        const micromodalAttr = trigger.getAttribute('data-micromodal-trigger');
        const modalId = modalIdAttr || micromodalAttr;
        console.log('[AdvancedButton] click trigger', {
          modalId,
          modalIdAttr,
          micromodalAttr,
          trigger,
          hasJankxModal: !!window.JankxModal,
          hasMicroModal: !!window.MicroModal
        });
        if (!modalId || modalId.trim() === '') {
          console.warn('[AdvancedButton] missing data-modal-id on trigger', trigger);
          return;
        }

        // Try JankxModal first (wrapper around MicroModal with extras)
        if (window.JankxModal) {
          console.log('[AdvancedButton] using JankxModal.show', modalId);
          window.JankxModal.show(modalId, trigger);
        }
        // Fallback to raw MicroModal
        else if (window.MicroModal) {
          console.log('[AdvancedButton] using MicroModal.show', modalId);
          window.MicroModal.show(modalId);
        }
        // Fallback: Check if modal exists and show it manually (simple toggle)
        else {
          const modal = document.getElementById(modalId);
          if (modal) {
            console.log('[AdvancedButton] manual open modal element', modal);
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
          } else {
            console.warn(`[Jankx Advanced Button] Modal with ID "${modalId}" not found or JankxModal library not loaded.`);
          }
        }
      });

      // Mark as attached
      button.setAttribute('data-jankx-click-attached', 'true');
      console.log('[AdvancedButton] attached click listener to', button);
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    console.log('[AdvancedButton] waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initAdvancedButtons);
  } else {
    console.log('[AdvancedButton] DOM ready, initializing immediately');
    initAdvancedButtons();
  }

  // Optional: Re-init on dynamic content loading (if any custom event exists)
  // document.addEventListener('jankx:content-loaded', initAdvancedButtons);
})();
/******/ })()
;
//# sourceMappingURL=frontend.js.map