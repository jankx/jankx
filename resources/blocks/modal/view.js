/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality using Micromodal library
 */

import MicroModal from 'micromodal';
import { lockPageScroll, unlockPageScroll, markNestedScroll } from '../../js/scroll/lock';

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initModals();
    });

    // Initialize global share data object
    window.jankxShareData = window.jankxShareData || {};

    document.addEventListener('jankx:modal:show', function(event) {
        const detail = event.detail || {};
        console.log('[Modal] Received shared data:', detail.sharedData);
        console.log('[Modal] Modal element:', detail.modalElement);
        if (detail.triggerElement) {
            console.log('[Modal] Trigger element:', detail.triggerElement);
            console.log('[Modal] Form mappings:', detail.triggerElement.getAttribute('data-form-mappings'));
        } else {
            console.log('[Modal] Trigger element: null');
        }
    });

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

        // Freeze the page through the shared scroll engine. Using the engine
        // instead of `position: fixed` on <body> keeps the scroll position
        // intact, so nothing needs restoring on close.
        lockPageScroll('modal-open');

        // Add backdrop blur if enabled
        if (wrapper && (wrapper.dataset.backdropBlur === 'true' || wrapper.dataset.backdropBlur === true)) {
            document.body.classList.add('modal-backdrop-blur');
        }

        // Dispatch event with shared data
        document.dispatchEvent(new CustomEvent('jankx:modal:show', {
            detail: {
                modalId,
                modalElement: modal,
                sharedData: window.jankxShareData[modalId] || {},
                triggerElement
            }
        }));
    }

    function stopMediaInModal(modal) {
        // Stop all iframes (YouTube, Vimeo, etc.)
        const iframes = modal.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const src = iframe.src;
            iframe.src = ''; // Clear src to stop playback
            iframe.src = src; // Restore src
        });

        // Pause all HTML5 videos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        // Pause all HTML5 audios
        const audios = modal.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`);
        const animationType = wrapper ? (wrapper.dataset.animationType || 'fade') : 'fade';
        const animationDuration = wrapper ? (parseInt(wrapper.dataset.animationDuration) || 300) : 300;

        // Stop all media playback
        stopMediaInModal(modal);

        // Remove classes first to trigger transition
        modal.classList.remove('is-open', 'modal-showing', 'modal-animation-' + animationType);
        modal.setAttribute('aria-hidden', 'true');

        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, animationDuration);

        // Release the scroll lock. The engine never moved the page, so the
        // scroll position is already correct and needs no restoration.
        unlockPageScroll('modal-open');
        document.body.classList.remove('modal-backdrop-blur');

        // Dispatch event
        document.dispatchEvent(new CustomEvent('jankx:modal:close', {
            detail: { modalId, modalElement: modal }
        }));
    }

    function initModals() {
        // Get all modals directly (no wrapper)
        const allModals = document.querySelectorAll('.wp-block-jankx-modal');
        const modalConfigs = {};

        // Modal bodies scroll independently of the document. Opt them out of
        // engine smoothing so wheel gestures inside a long modal do not fight
        // the page-level scroll lock.
        document.querySelectorAll('.wp-block-jankx-modal__content').forEach(markNestedScroll);

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
                    }
                }

                // Freeze the page via the shared scroll engine (see showModal).
                lockPageScroll('modal-open');
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
                        sharedData: window.jankxShareData[modal.id] || {},
                        triggerElement: trigger
                    }
                }));
            },
            onClose: function(modal) {
                // Stop all media playback in modal
                stopMediaInModal(modal);

                // Release the scroll lock (see hideModal).
                unlockPageScroll('modal-open');

                // Remove backdrop blur
                document.body.classList.remove('modal-backdrop-blur');

                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('jankx:modal:close', {
                    detail: { modalId: modal.id, modalElement: modal }
                }));
            },
            openClass: 'is-open',
            // The scroll lock is owned by the shared scroll engine (see
            // onShow). MicroModal's own `disableScroll` uses `overflow: hidden`
            // on <body>, which bypasses the engine and fights it, so it stays off.
            disableScroll: false,
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
                }
            }
        });
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
