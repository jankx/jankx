/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality using Micromodal library
 */

(function() {
    'use strict';

    // Wait for DOM to be ready and MicroModal to be available
    function waitForMicroModal() {
        if (typeof MicroModal !== 'undefined') {
            initModals();
        } else {
            // Retry after a short delay
            setTimeout(waitForMicroModal, 100);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        waitForMicroModal();
    });

    function initModals() {
        // Initialize Micromodal once for all modals
        try {
            MicroModal.init({
                onShow: function(modal) {
                    // Find the wrapper for this modal
                    const modalElement = document.getElementById(modal.id);
                    if (modalElement) {
                        const wrapper = modalElement.closest('.wp-block-jankx-modal-wrapper');
                        const animationType = wrapper ? (wrapper.dataset.animationType || 'fade') : 'fade';

                        // Add animation classes
                        modalElement.classList.add('modal-showing');
                        modalElement.classList.add('modal-animation-' + animationType);

                        // Add backdrop blur effect
                        if (wrapper && wrapper.dataset.backdropBlur === 'true') {
                            document.body.classList.add('modal-backdrop-blur');
                        }
                    }

                    // Dispatch custom event
                    document.dispatchEvent(new CustomEvent('jankx:modal:show', {
                        detail: { modalId: modal.id, modalElement: modalElement }
                    }));
                },
                onClose: function(modal) {
                    // Find the wrapper for this modal
                    const modalElement = document.getElementById(modal.id);
                    if (modalElement) {
                        const wrapper = modalElement.closest('.wp-block-jankx-modal-wrapper');
                        const animationType = wrapper ? (wrapper.dataset.animationType || 'fade') : 'fade';

                        // Remove animation classes
                        modalElement.classList.remove('modal-showing');
                        modalElement.classList.remove('modal-animation-' + animationType);

                        // Remove backdrop blur effect
                        document.body.classList.remove('modal-backdrop-blur');
                    }

                    // Dispatch custom event
                    document.dispatchEvent(new CustomEvent('jankx:modal:close', {
                        detail: { modalId: modal.id, modalElement: modalElement }
                    }));
                },
                openClass: 'is-open',
                disableScroll: true,
                disableFocus: false,
                restoreFocus: true,
                awaitOpenAnimation: true,
                awaitCloseAnimation: true,
                debugMode: false
            });

            console.log('Micromodal initialized successfully');
        } catch (e) {
            console.error('Failed to initialize Micromodal:', e);
        }

        // Find all modal blocks
        const modalBlocks = document.querySelectorAll('.wp-block-jankx-modal-wrapper');

        modalBlocks.forEach(function(block) {
            const triggerElement = block.querySelector('[data-micromodal-trigger]');
            if (!triggerElement) return;

            const modalId = triggerElement.getAttribute('data-micromodal-trigger');
            if (!modalId) return;

            const modal = document.getElementById(modalId);
            if (!modal) return;

            // Debug log
            console.log('Registered modal:', modalId);

            // Get configuration from data attributes
            const closeOnOverlayClick = block.dataset.closeOnOverlayClick !== 'false';
            const closeOnEscape = block.dataset.closeOnEscape !== 'false';

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
            window['showModal' + modalId.replace(/[^a-zA-Z0-9]/g, '')] = function() {
                MicroModal.show(modalId);
            };

            window['hideModal' + modalId.replace(/[^a-zA-Z0-9]/g, '')] = function() {
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

