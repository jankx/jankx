/**
 * Jankx Gutenberg Editor Script
 *
 * Main entry point for all Gutenberg blocks
 */

(function() {
    'use strict';

    // Check if we're in the editor
    if (typeof wp === 'undefined' || !wp.blocks) {
        return;
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize blocks if data is available
        if (window.jankxGutenberg && window.jankxGutenberg.blocks) {
            // Blocks data available
        }
    });

    // Global object for external access
    window.JankxGutenberg = {
        version: '2.0.0',
        blocks: {},
        init: function() {
            // Initialize Jankx Gutenberg
        }
    };

})();