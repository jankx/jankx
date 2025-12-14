/**
 * Blocks Extra Frontend JavaScript
 * 
 * Handles client-side rendering for blocks marked with CSR mode
 * and provides enhanced responsive features.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle CSR blocks
    handleCSRBlocks();
    
    // Initialize responsive enhancements
    initResponsiveEnhancements();
});

/**
 * Handle Client-Side Rendering blocks
 */
function handleCSRBlocks() {
    const csrBlocks = document.querySelectorAll('.jankx-csr-block');
    
    csrBlocks.forEach(block => {
        const blockName = block.dataset.blockName;
        const blockAttrs = JSON.parse(block.dataset.blockAttrs || '{}');
        
        // Initialize CSR rendering for this block
        initializeCSRBlock(block, blockName, blockAttrs);
    });
}

/**
 * Initialize individual CSR block
 */
function initializeCSRBlock(block, blockName, attributes) {
    // Add loading state
    block.classList.add('jankx-csr-loading');
    
    // Simulate async rendering - in real implementation, this would
    // fetch data or perform complex client-side operations
    setTimeout(() => {
        block.classList.remove('jankx-csr-loading');
        block.classList.add('jankx-csr-loaded');
        
        // Add event listeners or interactive features based on block type
        addBlockInteractivity(block, blockName, attributes);
    }, 100);
}

/**
 * Add interactivity to blocks based on type
 */
function addBlockInteractivity(block, blockName, attributes) {
    switch (blockName) {
        case 'core/image':
            enhanceImageBlock(block, attributes);
            break;
        case 'core/gallery':
            enhanceGalleryBlock(block, attributes);
            break;
        case 'core/heading':
            enhanceHeadingBlock(block, attributes);
            break;
        // Add more block types as needed
    }
}

/**
 * Enhanced image block features
 */
function enhanceImageBlock(block, attributes) {
    const img = block.querySelector('img');
    if (!img) return;
    
    // Add lazy loading enhancement
    img.loading = 'lazy';
    
    // Add zoom on click for CSR mode
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
        // Simple zoom implementation
        if (img.style.transform === 'scale(1.5)') {
            img.style.transform = 'scale(1)';
        } else {
            img.style.transform = 'scale(1.5)';
            img.style.zIndex = '1000';
            img.style.position = 'relative';
        }
    });
}

/**
 * Enhanced gallery block features
 */
function enhanceGalleryBlock(block, attributes) {
    const images = block.querySelectorAll('img');
    
    // Add lightbox functionality
    images.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(images, index));
    });
}

/**
 * Enhanced heading block features
 */
function enhanceHeadingBlock(block, attributes) {
    // Add copy-to-clipboard functionality
    block.style.cursor = 'pointer';
    block.addEventListener('click', function() {
        const text = block.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
            // Show copied feedback
            const originalBg = block.style.backgroundColor;
            block.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                block.style.backgroundColor = originalBg;
            }, 300);
        });
    });
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
    currentImg.src = images[startIndex].src;
    currentImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    
    imgContainer.appendChild(currentImg);
    lightbox.appendChild(imgContainer);
    document.body.appendChild(lightbox);
    
    // Close on click
    lightbox.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    // Keyboard navigation
    let currentIndex = startIndex;
    const handleKey = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', handleKey);
        } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
            currentIndex++;
            currentImg.src = images[currentIndex].src;
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            currentImg.src = images[currentIndex].src;
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
    
    containers.forEach(container => {
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
    
    images.forEach(img => {
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
    
    headings.forEach(heading => {
        heading.classList.add('jankx-responsive-text');
    });
}

// Export functions for potential external use
window.JankxBlocksExtra = {
    handleCSRBlocks,
    initializeCSRBlock,
    initResponsiveEnhancements
};
