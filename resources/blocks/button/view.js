/**
 * Button Block Frontend JavaScript
 * Handles detail-link buttons and modal data sharing
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initDetailLinkButtons();
        initModalTriggerButtons();
    });

    /**
     * Initialize detail-link buttons
     * Replaces href="#" with current page permalink
     */
    function initDetailLinkButtons() {
        // Find all detail-link buttons
        const detailLinkButtons = document.querySelectorAll('a.jankx-button-detail-link[href="#"], a[data-trigger-type="detail-link"][href="#"]');

        if (detailLinkButtons.length === 0) {
            return;
        }

        // Get current page URL
        const currentUrl = window.location.href;

        detailLinkButtons.forEach(function(button) {
            // Replace href="#" with current page URL
            button.setAttribute('href', currentUrl);

            // Remove data-trigger-type to prevent confusion
            button.removeAttribute('data-trigger-type');

            if (window.console && console.log) {
                console.log('Detail-link button updated:', button.textContent.trim(), '→', currentUrl);
            }
        });
    }

    /**
     * Initialize modal trigger buttons
     * Log modal trigger buttons (data attributes are already set by PHP)
     */
    function initModalTriggerButtons() {
        // Find all modal trigger buttons
        const modalTriggers = document.querySelectorAll('button[data-micromodal-trigger], button.jankx-button-modal-trigger[data-trigger-type="modal"]');

        if (modalTriggers.length === 0) {
            return;
        }

        // Log modal triggers for debugging (data is already set by PHP, no need to override)
        modalTriggers.forEach(function(button) {
            if (window.console && console.log) {
                console.log('Modal trigger button found:', {
                    modalId: button.getAttribute('data-micromodal-trigger') || button.getAttribute('data-modal-id'),
                    shareData: {
                        objectId: button.getAttribute('data-current-object-id'),
                        postTitle: button.getAttribute('data-current-post-title'),
                        url: button.getAttribute('data-current-url')
                    }
                });
            }
        });
    }

    // Expose global functions for manual initialization
    window.JankxButton = window.JankxButton || {};
    window.JankxButton.initDetailLinks = initDetailLinkButtons;
    window.JankxButton.initModalTriggers = initModalTriggerButtons;

})();

