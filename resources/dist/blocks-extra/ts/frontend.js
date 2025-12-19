/**
 * Blocks Extra Frontend TypeScript
 *
 * Handles client-side rendering for blocks marked with CSR mode
 * and provides enhanced responsive features.
 */
'use strict';
// Constants
const CSR_BLOCK_SELECTOR = '.jankx-csr-block';
const LOADING_CLASS = 'jankx-csr-loading';
const LOADED_CLASS = 'jankx-csr-loaded';
const BLOCK_ENHANCEMENTS = {
    'core/image': enhanceImageBlock,
    'core/gallery': enhanceGalleryBlock,
    'core/heading': enhanceHeadingBlock
};
/**
 * Handle Client-Side Rendering blocks
 */
function handleCSRBlocks() {
    const csrBlocks = document.querySelectorAll(CSR_BLOCK_SELECTOR);
    csrBlocks.forEach((block) => {
        const blockName = block.dataset.blockName ?? '';
        const blockAttrsString = block.dataset.blockAttrs ?? '{}';
        let blockAttrs;
        try {
            blockAttrs = JSON.parse(blockAttrsString);
        }
        catch (error) {
            console.warn('Jankx Blocks Extra: Failed to parse block attributes', error);
            blockAttrs = {};
        }
        // Initialize CSR rendering for this block
        initializeCSRBlock(block, blockName, blockAttrs);
    });
}
/**
 * Initialize individual CSR block
 */
function initializeCSRBlock(block, blockName, attributes) {
    // Add loading state
    block.classList.add(LOADING_CLASS);
    // Simulate async rendering - in real implementation, this would
    // fetch data or perform complex client-side operations
    setTimeout(() => {
        block.classList.remove(LOADING_CLASS);
        block.classList.add(LOADED_CLASS);
        // Add event listeners or interactive features based on block type
        addBlockInteractivity(block, blockName, attributes);
    }, 100);
}
/**
 * Add interactivity to blocks based on type
 */
function addBlockInteractivity(block, blockName, attributes) {
    const enhancementFunction = BLOCK_ENHANCEMENTS[blockName];
    if (enhancementFunction) {
        enhancementFunction(block, attributes);
    }
}
/**
 * Enhanced image block features
 */
function enhanceImageBlock(block, attributes) {
    const img = block.querySelector('img');
    if (!img)
        return;
    // Add lazy loading enhancement
    img.loading = 'lazy';
    // Add zoom on click for CSR mode
    img.style.cursor = 'zoom-in';
    const handleClick = () => {
        // Simple zoom implementation
        if (img.style.transform === 'scale(1.5)') {
            img.style.transform = 'scale(1)';
            img.style.zIndex = '';
            img.style.position = '';
        }
        else {
            img.style.transform = 'scale(1.5)';
            img.style.zIndex = '1000';
            img.style.position = 'relative';
        }
    };
    img.addEventListener('click', handleClick);
}
/**
 * Enhanced gallery block features
 */
function enhanceGalleryBlock(block, attributes) {
    const images = block.querySelectorAll('img');
    const imageArray = Array.from(images);
    // Add lightbox functionality
    imageArray.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(imageArray, index));
    });
}
/**
 * Enhanced heading block features
 */
function enhanceHeadingBlock(block, attributes) {
    // Add copy-to-clipboard functionality
    block.style.cursor = 'pointer';
    const handleClick = () => {
        const text = block.textContent?.trim() ?? '';
        if (navigator.clipboard && text) {
            navigator.clipboard.writeText(text).then(() => {
                // Show copied feedback
                const originalBg = block.style.backgroundColor;
                block.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    block.style.backgroundColor = originalBg;
                }, 300);
            }).catch((error) => {
                console.warn('Jankx Blocks Extra: Failed to copy text to clipboard', error);
            });
        }
    };
    block.addEventListener('click', handleClick);
}
/**
 * Simple lightbox implementation
 */
function openLightbox(images, startIndex) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'jankx-lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
    `;
    // Show current image
    const currentImg = document.createElement('img');
    currentImg.src = images[startIndex]?.src ?? '';
    currentImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    imgContainer.appendChild(currentImg);
    lightbox.appendChild(imgContainer);
    document.body.appendChild(lightbox);
    // Close on click
    const closeLightbox = () => {
        if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
        }
        document.removeEventListener('keydown', handleKey);
    };
    lightbox.addEventListener('click', closeLightbox);
    // Keyboard navigation
    let currentIndex = startIndex;
    const handleKey = (e) => {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                    currentImg.src = images[currentIndex]?.src ?? '';
                }
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    currentIndex--;
                    currentImg.src = images[currentIndex]?.src ?? '';
                }
                break;
        }
    };
    document.addEventListener('keydown', handleKey);
}
/**
 * Initialize responsive enhancements
 */
function initResponsiveEnhancements() {
    // Add responsive container classes
    addResponsiveContainerClasses();
    // Initialize responsive image handling
    initResponsiveImages();
    // Add responsive typography
    initResponsiveTypography();
}
/**
 * Add responsive container classes
 */
function addResponsiveContainerClasses() {
    const containers = document.querySelectorAll('.wp-block-group, .wp-block-cover');
    containers.forEach((container) => {
        // Add responsive width classes
        if (!container.classList.contains('jankx-responsive-container')) {
            container.classList.add('jankx-responsive-container');
        }
    });
}
/**
 * Initialize responsive image handling
 */
function initResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        // Ensure images are responsive
        if (!img.style.maxWidth) {
            img.style.maxWidth = '100%';
        }
        if (!img.style.height) {
            img.style.height = 'auto';
        }
    });
}
/**
 * Initialize responsive typography
 */
function initResponsiveTypography() {
    // Add responsive font sizes based on viewport
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        heading.classList.add('jankx-responsive-text');
    });
}
/**
 * Main initialization function
 */
function initializeBlocksExtraFrontend() {
    // Handle CSR blocks
    handleCSRBlocks();
    // Initialize responsive enhancements
    initResponsiveEnhancements();
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlocksExtraFrontend);
}
else {
    initializeBlocksExtraFrontend();
}
// Export API for potential external use
const JankxBlocksExtra = {
    handleCSRBlocks,
    initializeCSRBlock,
    initResponsiveEnhancements
};
// Make API available globally
window.JankxBlocksExtra = JankxBlocksExtra;
export { JankxBlocksExtra };
