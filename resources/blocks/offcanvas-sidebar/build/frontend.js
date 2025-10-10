/******/ (() => { // webpackBootstrap
/*!**********************************************!*\
  !*** ./blocks/offcanvas-sidebar/frontend.ts ***!
  \**********************************************/
/**
 * Offcanvas Sidebar Frontend TypeScript
 * Handles sidebar interactions and animations
 */

(function () {
  'use strict';

  // Offcanvas Sidebar Class
  class OffcanvasSidebar {
    constructor(element) {
      this.element = element;
      this.trigger = null; // Trigger is now external
      this.sidebar = element.querySelector('.offcanvas-sidebar');
      this.overlay = element.querySelector('.offcanvas-overlay');
      this.closeButton = element.querySelector('.close-button');
      this.isOpen = false;
      this.autoCloseTimer = null;
      this.previousFocus = null;
      this.init();
    }
    init() {
      this.bindEvents();
      this.setupAccessibility();
    }
    bindEvents() {
      // External trigger buttons
      document.addEventListener('click', e => {
        const target = e.target;
        const triggerButton = target.closest('.offcanvas-trigger');
        if (triggerButton) {
          const targetSidebarId = triggerButton.getAttribute('data-target-sidebar');

          // If no specific target, trigger the first sidebar
          if (!targetSidebarId || targetSidebarId === this.element.id) {
            e.preventDefault();
            this.toggle();
          }
        }
      });

      // Close button click
      if (this.closeButton) {
        this.closeButton.addEventListener('click', e => {
          e.preventDefault();
          this.close();
        });
      }

      // Overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', e => {
          e.preventDefault();
          const closeOnOverlayClick = this.element.dataset.closeOnOverlayClick === 'true';
          if (closeOnOverlayClick) {
            this.close();
          }
        });
      }

      // Escape key to close sidebar
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Prevent body scroll when sidebar is open
      document.body.addEventListener('transitionend', () => {
        if (this.isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    }
    setupAccessibility() {
      // Add ARIA attributes for sidebar
      if (this.sidebar) {
        this.sidebar.setAttribute('role', 'dialog');
        this.sidebar.setAttribute('aria-modal', 'true');
        this.sidebar.setAttribute('aria-label', 'Sidebar navigation');
      }
      if (this.closeButton) {
        this.closeButton.setAttribute('aria-label', 'Close sidebar');
      }
    }
    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      document.documentElement.classList.add('sidebar-open');

      // Add active class to all hamburger triggers
      this.toggleHamburgerTriggers(true);

      // Focus management
      this.focusTrap();

      // Auto close functionality
      this.setupAutoClose();

      // Dispatch custom event
      this.dispatchEvent('offcanvasSidebarOpened', {
        element: this.element,
        sidebar: this.sidebar
      });
    }
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      document.documentElement.classList.remove('sidebar-open');

      // Remove active class from all hamburger triggers
      this.toggleHamburgerTriggers(false);

      // Clear auto close timer
      this.clearAutoClose();

      // Restore focus
      this.restoreFocus();

      // Dispatch custom event
      this.dispatchEvent('offcanvasSidebarClosed', {
        element: this.element,
        sidebar: this.sidebar
      });
    }
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
    focusTrap() {
      if (!this.sidebar) return;

      // Focus the first focusable element in the sidebar
      const focusableElements = this.sidebar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Store the element that had focus before opening
      this.previousFocus = document.activeElement;
    }
    restoreFocus() {
      // Restore focus to the previous element
      if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
        this.previousFocus.focus();
      }
    }
    setupAutoClose() {
      const autoClose = this.element.dataset.autoClose === 'true';
      const autoCloseDelay = parseInt(this.element.dataset.autoCloseDelay || '5000');
      if (autoClose && autoCloseDelay > 0) {
        this.autoCloseTimer = window.setTimeout(() => {
          this.close();
        }, autoCloseDelay);
      }
    }
    clearAutoClose() {
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }
    }
    toggleHamburgerTriggers(isActive) {
      // Find all hamburger triggers that target this sidebar
      const triggers = document.querySelectorAll('.offcanvas-trigger[data-target-sidebar="' + this.element.id + '"]');

      // If no specific triggers, toggle all hamburger triggers
      const allTriggers = triggers.length > 0 ? triggers : document.querySelectorAll('.offcanvas-trigger');
      allTriggers.forEach(trigger => {
        const hamburgerContainer = trigger.querySelector('.hamburger-container');
        if (hamburgerContainer) {
          if (isActive) {
            hamburgerContainer.classList.add('active');
          } else {
            hamburgerContainer.classList.remove('active');
          }
        }
      });
    }
    dispatchEvent(eventName, detail) {
      const event = new CustomEvent(eventName, {
        detail: detail,
        bubbles: true,
        cancelable: true
      });
      this.element.dispatchEvent(event);
    }

    // Public methods for external control
    getState() {
      return {
        isOpen: this.isOpen,
        element: this.element,
        sidebar: this.sidebar
      };
    }
    destroy() {
      this.clearAutoClose();
      this.close();
      // Remove event listeners if needed
    }
  }

  // Global functions for external access
  window.OffcanvasSidebar = OffcanvasSidebar;

  // Initialize all offcanvas sidebars
  function initOffcanvasSidebars() {
    const sidebars = document.querySelectorAll('.offcanvas-sidebar-block');
    const sidebarInstances = [];
    sidebars.forEach(sidebar => {
      const instance = new OffcanvasSidebar(sidebar);
      sidebarInstances.push(instance);

      // Store instance on element for external access
      sidebar.offcanvasInstance = instance;
    });

    // Store all instances globally
    window.offcanvasSidebarInstances = sidebarInstances;
    return sidebarInstances;
  }

  // Global control functions
  window.openOffcanvasSidebar = function (blockId) {
    const sidebar = document.getElementById(blockId);
    if (sidebar && sidebar.offcanvasInstance) {
      sidebar.offcanvasInstance.open();
    }
  };
  window.closeOffcanvasSidebar = function (blockId) {
    const sidebar = document.getElementById(blockId);
    if (sidebar && sidebar.offcanvasInstance) {
      sidebar.offcanvasInstance.close();
    }
  };
  window.toggleOffcanvasSidebar = function (blockId) {
    const sidebar = document.getElementById(blockId);
    if (sidebar && sidebar.offcanvasInstance) {
      sidebar.offcanvasInstance.toggle();
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOffcanvasSidebars();
    });
  } else {
    // DOM already loaded
    initOffcanvasSidebars();
  }

  // Re-initialize on AJAX content load
  document.addEventListener('content-loaded', function () {
    initOffcanvasSidebars();
  });

  // Handle dynamic content (for themes that support it)
  if (typeof wp !== 'undefined' && wp.domReady) {
    wp.domReady(function () {
      initOffcanvasSidebars();
    });
  }

  // MutationObserver for dynamic content
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && node.classList && node.classList.contains('offcanvas-sidebar-block')) {
              const element = node;
              if (!element.offcanvasInstance) {
                new OffcanvasSidebar(element);
              }
            }
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
/******/ })()
;
//# sourceMappingURL=frontend.js.map