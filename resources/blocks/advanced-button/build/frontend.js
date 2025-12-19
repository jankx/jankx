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
    const links = Array.from(document.querySelectorAll('.jankx-advanced-button__link'));
    const bodyClass = document.body.className || '';
    const match = bodyClass.match(/post-type-([^\s]+)/);
    links.forEach(link => {
      const layout = link.closest('.wp-block-jankx-dynamic-data-layout');
      const contextPostType = layout && layout.getAttribute('data-post-type') || (match ? match[1] : '');
      const conditionType = link.getAttribute('data-condition-type') || 'always';
      const targetPostType = link.getAttribute('data-show-for-post-type') || '';
      if (conditionType === 'post-type') {
        const wrapper = link.closest('.wp-block-jankx-advanced-button');
        if (targetPostType && contextPostType && targetPostType !== contextPostType) {
          if (wrapper) {
            wrapper.style.display = 'none';
          } else {
            link.style.display = 'none';
          }
        }
      }
    });
    const buttons = document.querySelectorAll('.jankx-button-modal-trigger');
    console.log('[AdvancedButton] initAdvancedButtons: found', buttons.length, 'buttons');
    const applyFormMappings = (trigger, modalId) => {
      try {
        const mappingsAttr = trigger.getAttribute('data-form-mappings');
        if (!mappingsAttr) return;
        const mappings = JSON.parse(mappingsAttr || '[]');
        if (!Array.isArray(mappings) || mappings.length === 0) return;
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const resolveValue = source => {
          switch (source) {
            case 'button_title':
              return trigger.getAttribute('title') || trigger.querySelector('.button-text')?.textContent || '';
            case 'current_post_title':
              return trigger.getAttribute('data-current-post-title') || '';
            case 'current_post_id':
              return trigger.getAttribute('data-current-object-id') || '';
            case 'current_url':
              return trigger.getAttribute('data-current-url') || window.location.href;
            case 'current_featured_image_url':
              return trigger.getAttribute('data-current-featured-image-url') || '';
            case 'current_featured_image_id':
              return trigger.getAttribute('data-current-featured-image-id') || '';
            default:
              return '';
          }
        };
        mappings.forEach(({
          source,
          selector,
          mode,
          attributeName
        }) => {
          if (!selector) return;
          const target = modal.querySelector(selector);
          if (!target) return;
          const value = resolveValue(source);
          if (value === undefined || value === null) return;
          if ((mode || 'value') === 'attribute' && attributeName) {
            target.setAttribute(attributeName, value);
          } else if ((mode || 'value') === 'text') {
            target.textContent = value;
          } else {
            const tag = target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
              target.value = value;
              target.dispatchEvent(new Event('input', {
                bubbles: true
              }));
              target.dispatchEvent(new Event('change', {
                bubbles: true
              }));
            } else if (tag === 'img') {
              target.src = value;
            } else {
              target.textContent = value;
            }
          }
        });
      } catch (err) {
        // ignore malformed JSON
      }
    };
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

        // Extract dynamic form data and dispatch event
        const formData = {};
        Array.from(trigger.attributes).forEach(attr => {
          if (attr.name.startsWith('data-form-')) {
            const key = attr.name.replace('data-form-', '');
            formData[key] = attr.value;
          }
        });
        if (Object.keys(formData).length > 0) {
          console.log('[AdvancedButton] dispatching formello:update', formData);
          document.dispatchEvent(new CustomEvent('formello:update', {
            detail: {
              data: formData,
              triggerId: trigger.id
            }
          }));
        }
        if (!modalId || modalId.trim() === '') {
          console.warn('[AdvancedButton] missing data-modal-id on trigger', trigger);
          return;
        }

        // Apply form mappings before showing modal
        applyFormMappings(trigger, modalId);

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