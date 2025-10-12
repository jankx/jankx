/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./blocks/modal/view.js ***!
  \******************************/
/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality - works standalone or with Micromodal library
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initModals();
  });

  // Simple modal show/hide functions (no external library needed)
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn('Modal not found:', modalId);
      return;
    }
    const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`)?.closest('.wp-block-jankx-modal-wrapper');
    const animationType = wrapper ? wrapper.dataset.animationType || 'fade' : 'fade';

    // Add classes
    modal.classList.add('is-open', 'modal-showing', 'modal-animation-' + animationType);
    modal.setAttribute('aria-hidden', 'false');

    // Disable scroll
    document.body.style.overflow = 'hidden';

    // Add backdrop blur if enabled
    if (wrapper && wrapper.dataset.backdropBlur === 'true') {
      document.body.classList.add('modal-backdrop-blur');
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('jankx:modal:show', {
      detail: {
        modalId,
        modalElement: modal
      }
    }));
    console.log('Modal opened:', modalId);
  }
  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const wrapper = modal.closest('.wp-block-jankx-modal-wrapper');
    const animationType = wrapper ? wrapper.dataset.animationType || 'fade' : 'fade';

    // Remove classes
    modal.classList.remove('is-open', 'modal-showing', 'modal-animation-' + animationType);
    modal.setAttribute('aria-hidden', 'true');

    // Re-enable scroll
    document.body.style.overflow = '';
    document.body.classList.remove('modal-backdrop-blur');

    // Dispatch event
    document.dispatchEvent(new CustomEvent('jankx:modal:close', {
      detail: {
        modalId,
        modalElement: modal
      }
    }));
    console.log('Modal closed:', modalId);
  }
  function initModals() {
    // Find ALL trigger buttons (from modal block AND from button block)
    const allTriggers = document.querySelectorAll('[data-micromodal-trigger], [data-modal-id], .jankx-button-modal-trigger');
    allTriggers.forEach(function (trigger) {
      // Get modal ID from various attributes
      const modalId = trigger.getAttribute('data-micromodal-trigger') || trigger.getAttribute('data-modal-id') || trigger.dataset.modalId;
      if (!modalId) return;
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.warn('Modal not found for trigger:', modalId);
        return;
      }

      // Add click handler
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        showModal(modalId);
      });
      console.log('Registered trigger for modal:', modalId);
    });

    // Find all modals and set up close handlers
    const allModals = document.querySelectorAll('.wp-block-jankx-modal');
    allModals.forEach(function (modal) {
      const modalId = modal.id;
      if (!modalId) return;
      const wrapper = modal.closest('.wp-block-jankx-modal-wrapper');
      const closeOnOverlayClick = !wrapper || wrapper.dataset.closeOnOverlayClick !== 'false';
      const closeOnEscape = !wrapper || wrapper.dataset.closeOnEscape !== 'false';

      // Close button
      const closeButtons = modal.querySelectorAll('.wp-block-jankx-modal__close, [data-micromodal-close]');
      closeButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          hideModal(modalId);
        });
      });

      // Overlay click
      if (closeOnOverlayClick) {
        const overlay = modal.querySelector('.wp-block-jankx-modal__overlay');
        if (overlay) {
          overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
              hideModal(modalId);
            }
          });
        }
      }

      // Escape key
      if (closeOnEscape) {
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            hideModal(modalId);
          }
        });
      }

      // Custom selectors
      const customTrigger = wrapper?.querySelector('.wp-block-jankx-modal__custom-trigger');
      if (customTrigger) {
        const customSelector = customTrigger.dataset.customSelector;
        if (customSelector) {
          const customElements = document.querySelectorAll(customSelector);
          customElements.forEach(function (element) {
            element.addEventListener('click', function (e) {
              e.preventDefault();
              showModal(modalId);
            });
          });
        }
      }
      console.log('Registered modal:', modalId);
    });
  }

  // Expose global functions for external use
  window.JankxModal = {
    show: showModal,
    hide: hideModal,
    init: initModals
  };
})();
/******/ })()
;
//# sourceMappingURL=view.js.map