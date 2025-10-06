/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality using Micromodal library
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initModals();
    });

    function initModals() {
        // Find all modal blocks
        const modalBlocks = document.querySelectorAll('.wp-block-jankx-modal-wrapper');

        modalBlocks.forEach(function(block) {
            const modalId = block.querySelector('[data-micromodal-trigger]')?.getAttribute('data-micromodal-trigger');
            if (!modalId) return;

            const modal = document.getElementById(modalId);
            if (!modal) return;

            // Get configuration from data attributes
            const closeOnOverlayClick = block.dataset.closeOnOverlayClick !== 'false';
            const closeOnEscape = block.dataset.closeOnEscape !== 'false';
            const animationType = block.dataset.animationType || 'fade';

            // Configure Micromodal
            MicroModal.init({
                onShow: function(modal) {
                    // Add animation classes
                    const modalElement = document.getElementById(modal.id);
                    if (modalElement) {
                        modalElement.classList.add('modal-showing');
                        modalElement.classList.add(`modal-animation-${animationType}`);
                    }
                },
                onClose: function(modal) {
                    // Remove animation classes
                    const modalElement = document.getElementById(modal.id);
                    if (modalElement) {
                        modalElement.classList.remove('modal-showing');
                        modalElement.classList.remove(`modal-animation-${animationType}`);
                    }
                },
                openTrigger: `[data-micromodal-trigger="${modalId}"]`,
                closeTrigger: '[data-micromodal-close]',
                openClass: 'is-open',
                disableScroll: true,
                disableFocus: false,
                restoreFocus: true,
                awaitOpenAnimation: true,
                awaitCloseAnimation: true,
                debugMode: false
            });

            // Handle custom selectors
            const customTrigger = block.querySelector('.wp-block-jankx-modal__custom-trigger');
            if (customTrigger) {
                const customSelector = customTrigger.dataset.customSelector;
                if (customSelector) {
                    const customElements = document.querySelectorAll(customSelector);
                    customElements.forEach(function(element) {
                        element.addEventListener('click', function(e) {
                            e.preventDefault();
                            MicroModal.show(modalId);
                        });
                    });
                }
            }

            // Handle programmatic show/hide
            window[`showModal${modalId.replace(/[^a-zA-Z0-9]/g, '')}`] = function() {
                MicroModal.show(modalId);
            };

            window[`hideModal${modalId.replace(/[^a-zA-Z0-9]/g, '')}`] = function() {
                MicroModal.close(modalId);
            };

            // Handle escape key
            if (closeOnEscape) {
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                        MicroModal.close(modalId);
                    }
                });
            }

            // Handle overlay click
            if (closeOnOverlayClick) {
                const overlay = modal.querySelector('.wp-block-jankx-modal__overlay');
                if (overlay) {
                    overlay.addEventListener('click', function(e) {
                        if (e.target === overlay) {
                            MicroModal.close(modalId);
                        }
                    });
                }
            }
        });
    }

    // Expose global functions for external use
    window.JankxModal = {
        show: function(modalId) {
            MicroModal.show(modalId);
        },
        hide: function(modalId) {
            MicroModal.close(modalId);
        },
        init: initModals
    };

})();

