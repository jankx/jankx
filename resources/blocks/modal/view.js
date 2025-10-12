/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality using Micromodal library
 */

import MicroModal from 'micromodal';

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initModals();
    });

    // Initialize global share data object
    window.jankxShareData = window.jankxShareData || {};

    // Simple modal show/hide functions (no external library needed)
    function showModal(modalId, triggerElement) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn('Modal not found:', modalId);
            return;
        }

        const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`);
        const animationType = wrapper ? (wrapper.dataset.animationType || 'fade') : 'fade';

        // Collect and share data from trigger element
        if (triggerElement) {
            const shareData = {};

            // Check which data to share based on data attributes
            if (triggerElement.dataset.shareObjectId === 'true' && triggerElement.dataset.currentObjectId) {
                shareData.objectId = triggerElement.dataset.currentObjectId;
            }

            if (triggerElement.dataset.sharePostTitle === 'true' && triggerElement.dataset.currentPostTitle) {
                shareData.postTitle = triggerElement.dataset.currentPostTitle;
            }

            if (triggerElement.dataset.shareCurrentUrl === 'true' && triggerElement.dataset.currentUrl) {
                shareData.currentUrl = triggerElement.dataset.currentUrl;
            }

            // Store in global object with modal ID as key
            if (Object.keys(shareData).length > 0) {
                window.jankxShareData[modalId] = shareData;
                console.log('Shared data for modal:', modalId, shareData);
            }
        }

        // Set display first, then add classes after a tiny delay to ensure transition works
        modal.style.display = 'block';

        // Use requestAnimationFrame to ensure display is applied before adding classes
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('is-open', 'modal-showing', 'modal-animation-' + animationType);
                modal.setAttribute('aria-hidden', 'false');
            });
        });

        // Disable scroll
        document.body.style.overflow = 'hidden';

        // Add backdrop blur if enabled
        if (wrapper && (wrapper.dataset.backdropBlur === 'true' || wrapper.dataset.backdropBlur === true)) {
            document.body.classList.add('modal-backdrop-blur');
        }

        // Dispatch event with shared data
        document.dispatchEvent(new CustomEvent('jankx:modal:show', {
            detail: {
                modalId,
                modalElement: modal,
                sharedData: window.jankxShareData[modalId] || {}
            }
        }));

        console.log('Modal opened:', modalId);
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`);
        const animationType = wrapper ? (wrapper.dataset.animationType || 'fade') : 'fade';
        const animationDuration = wrapper ? (parseInt(wrapper.dataset.animationDuration) || 300) : 300;

        // Remove classes first to trigger transition
        modal.classList.remove('is-open', 'modal-showing', 'modal-animation-' + animationType);
        modal.setAttribute('aria-hidden', 'true');

        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, animationDuration);

        // Re-enable scroll
        document.body.style.overflow = '';
        document.body.classList.remove('modal-backdrop-blur');

        // Dispatch event
        document.dispatchEvent(new CustomEvent('jankx:modal:close', {
            detail: { modalId, modalElement: modal }
        }));

        console.log('Modal closed:', modalId);
    }

    function initModals() {
        // Get all modals directly (no wrapper)
        const allModals = document.querySelectorAll('.wp-block-jankx-modal');
        const modalConfigs = {};

        allModals.forEach(function(modal) {
            const modalId = modal.dataset.modalId || modal.id;
            if (!modalId) return;

            const closeOnOverlayClick = modal.dataset.closeOnOverlayClick !== 'false';
            const closeOnEscape = modal.dataset.closeOnEscape !== 'false';
            const animationDuration = parseInt(modal.dataset.animationDuration) || 300;
            const backdropBlur = modal.dataset.backdropBlur === 'true';
            const disableScroll = modal.dataset.disableScroll !== 'false';
            const disableFocus = modal.dataset.disableFocus === 'true';
            const awaitOpenAnimation = modal.dataset.awaitOpenAnimation === 'true';
            const awaitCloseAnimation = modal.dataset.awaitCloseAnimation === 'true';

            modalConfigs[modalId] = {
                closeOnOverlayClick,
                closeOnEscape,
                animationDuration,
                backdropBlur,
                disableScroll,
                disableFocus,
                awaitOpenAnimation,
                awaitCloseAnimation
            };
        });

        // Get default config from first modal wrapper (if exists)
    const firstModal = allModals[0];
    const defaultConfig = firstModal ? {
        disableScroll: firstModal.dataset.disableScroll !== 'false',
        disableFocus: firstModal.dataset.disableFocus === 'true',
        awaitOpenAnimation: firstModal.dataset.awaitOpenAnimation === 'true',
        awaitCloseAnimation: firstModal.dataset.awaitCloseAnimation === 'true'
    } : {
        disableScroll: true,
        disableFocus: false,
        awaitOpenAnimation: false,
        awaitCloseAnimation: false
    };

        // Initialize Micromodal with global config
        MicroModal.init({
            onShow: function(modal, trigger) {
                console.log('Modal opened:', modal.id);
                console.log('Modal element:', modal);
                console.log('Modal has is-open class:', modal.classList.contains('is-open'));

                // Collect and share data from trigger element
                if (trigger) {
                    const shareData = {};

                    // Check which data to share based on data attributes
                    if (trigger.dataset.shareObjectId === 'true' && trigger.dataset.currentObjectId) {
                        shareData.objectId = trigger.dataset.currentObjectId;
                    }

                    if (trigger.dataset.sharePostTitle === 'true' && trigger.dataset.currentPostTitle) {
                        shareData.postTitle = trigger.dataset.currentPostTitle;
                    }

                    if (trigger.dataset.shareCurrentUrl === 'true' && trigger.dataset.currentUrl) {
                        shareData.currentUrl = trigger.dataset.currentUrl;
                    }

                    // Store in global object with modal ID as key
                    if (Object.keys(shareData).length > 0) {
                        window.jankxShareData[modal.id] = shareData;
                        console.log('Shared data for modal:', modal.id, shareData);
                    }
                }

                // Apply backdrop blur if enabled
                const config = modalConfigs[modal.id];
                if (config && config.backdropBlur) {
                    document.body.classList.add('modal-backdrop-blur');
                }

                // Dispatch custom event with shared data
                document.dispatchEvent(new CustomEvent('jankx:modal:show', {
                    detail: {
                        modalId: modal.id,
                        modalElement: modal,
                        sharedData: window.jankxShareData[modal.id] || {}
                    }
                }));
            },
            onClose: function(modal) {
                console.log('Modal closed:', modal.id);

                // Remove backdrop blur
                document.body.classList.remove('modal-backdrop-blur');

                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('jankx:modal:close', {
                    detail: { modalId: modal.id, modalElement: modal }
                }));
            },
            openClass: 'is-open',
            disableScroll: defaultConfig.disableScroll,
            disableFocus: defaultConfig.disableFocus,
            awaitOpenAnimation: defaultConfig.awaitOpenAnimation,
            awaitCloseAnimation: defaultConfig.awaitCloseAnimation,
            debugMode: true // Always enable for easier troubleshooting
        });

        // Handle custom selector triggers
        allModals.forEach(function(modal) {
            const customTrigger = modal.querySelector('.wp-block-jankx-modal__custom-trigger');
            if (customTrigger) {
                const customSelector = customTrigger.dataset.customSelector;
                const modalId = modal.dataset.modalId || modal.id;

                if (customSelector && modalId) {
                    const customElements = document.querySelectorAll(customSelector);
                    customElements.forEach(function(element) {
                        element.addEventListener('click', function(e) {
                            e.preventDefault();
                            MicroModal.show(modalId);
                        });
                    });
                    console.log('Registered custom triggers for modal:', modalId);
                }
            }
        });

        console.log('Micromodal initialized with configs:', modalConfigs);
    }

    // Expose global functions for external use (both custom and Micromodal methods)
    window.JankxModal = {
        show: function(modalId, triggerElement) {
            // Check if modal exists first
            const modalElement = document.getElementById(modalId);
            if (!modalElement) {
                console.error('JankxModal.show: Modal not found with ID:', modalId);
                return;
            }

            // Use Micromodal if available, otherwise fallback to custom implementation
            if (typeof MicroModal !== 'undefined' && MicroModal.show) {
                try {
                    MicroModal.show(modalId);
                } catch (error) {
                    console.error('JankxModal.show error:', error);
                    // Fallback to custom implementation
                    showModal(modalId, triggerElement);
                }
            } else {
                showModal(modalId, triggerElement);
            }
        },
        hide: function(modalId) {
            // Check if modal exists first
            const modalElement = document.getElementById(modalId);
            if (!modalElement) {
                console.error('JankxModal.hide: Modal not found with ID:', modalId);
                return;
            }

            // Use Micromodal if available, otherwise fallback to custom implementation
            if (typeof MicroModal !== 'undefined' && MicroModal.close) {
                try {
                    MicroModal.close(modalId);
                } catch (error) {
                    console.error('JankxModal.hide error:', error);
                    // Fallback to custom implementation
                    hideModal(modalId);
                }
            } else {
                hideModal(modalId);
            }
        },
        init: initModals,
        // Direct access to Micromodal instance
        MicroModal: MicroModal
    };

})();

