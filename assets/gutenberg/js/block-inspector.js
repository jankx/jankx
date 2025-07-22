/**
 * Block Inspector
 *
 * Debug script to inspect blocks in Gutenberg editor
 */

(function() {
    'use strict';

    // Check if we're in the editor
    if (typeof wp === 'undefined' || !wp.blocks) {
        return;
    }

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if wp.blocks is available
        if (wp.blocks) {
            // Get all registered blocks
            const blockTypes = wp.blocks.getBlockTypes();

            // Find our blocks
            const jankxBlocks = blockTypes.filter(block =>
                block.name && block.name.startsWith('jankx/')
            );

            // Check if testimonial block exists
            const testimonialBlock = blockTypes.find(block =>
                block.name === 'jankx/testimonial'
            );

            // Check if test-simple block exists
            const testSimpleBlock = blockTypes.find(block =>
                block.name === 'jankx/test-simple'
            );

        }

        // Check block inserter
        setTimeout(() => {
            const inserter = document.querySelector('.block-editor-inserter__menu');
            if (inserter) {
                // Listen for inserter opening
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            // Check for our blocks in inserter
                            const blockItems = inserter.querySelectorAll('.block-editor-inserter__block');

                            blockItems.forEach(item => {
                                const blockName = item.getAttribute('data-block-name');
                                if (blockName && blockName.startsWith('jankx/')) {
                                    // Found Jankx block in inserter
                                }
                            });
                        }
                    });
                });

                observer.observe(inserter, { childList: true, subtree: true });

            }
        }, 2000);
    });

})();