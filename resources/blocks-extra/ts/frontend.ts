/**
 * Blocks Extra Frontend TypeScript
 * 
 * Handles client-side rendering for blocks marked with CSR mode
 * and provides enhanced responsive features.
 */

'use strict';

// Type definitions
type RenderMode = 'ssr' | 'csr';
type BlockName = string;
type BlockAttributes = Record<string, any>;

interface CSRBlockData {
    blockName: BlockName;
    blockAttrs: BlockAttributes;
}

interface JankxBlocksExtraAPI {
    handleCSRBlocks: () => void;
    initializeCSRBlock: (block: HTMLElement, blockName: BlockName, attributes: BlockAttributes) => void;
    initResponsiveEnhancements: () => void;
    initScrollReveal: () => void;
}

// Constants
const CSR_BLOCK_SELECTOR = '.jankx-csr-block';
const LOADING_CLASS = 'jankx-csr-loading';
const LOADED_CLASS = 'jankx-csr-loaded';

const BLOCK_ENHANCEMENTS: Record<string, (block: HTMLElement, attributes: BlockAttributes) => void> = {
    'core/image': enhanceImageBlock,
    'core/gallery': enhanceGalleryBlock,
    'core/heading': enhanceHeadingBlock
};

/**
 * Handle Client-Side Rendering blocks
 */
function handleCSRBlocks(): void {
    const csrBlocks: NodeListOf<HTMLElement> = document.querySelectorAll(CSR_BLOCK_SELECTOR);

    csrBlocks.forEach((block: HTMLElement): void => {
        const blockName: BlockName = block.dataset.blockName ?? '';
        const blockAttrsString: string = block.dataset.blockAttrs ?? '{}';

        let blockAttrs: BlockAttributes;
        try {
            blockAttrs = JSON.parse(blockAttrsString);
        } catch (error) {
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
function initializeCSRBlock(block: HTMLElement, blockName: BlockName, attributes: BlockAttributes): void {
    // Add loading state
    block.classList.add(LOADING_CLASS);

    // Simulate async rendering - in real implementation, this would
    // fetch data or perform complex client-side operations
    setTimeout((): void => {
        block.classList.remove(LOADING_CLASS);
        block.classList.add(LOADED_CLASS);

        // Add event listeners or interactive features based on block type
        addBlockInteractivity(block, blockName, attributes);
    }, 100);
}

/**
 * Add interactivity to blocks based on type
 */
function addBlockInteractivity(block: HTMLElement, blockName: BlockName, attributes: BlockAttributes): void {
    const enhancementFunction = BLOCK_ENHANCEMENTS[blockName];

    if (enhancementFunction) {
        enhancementFunction(block, attributes);
    }
}

/**
 * Enhanced image block features
 */
function enhanceImageBlock(block: HTMLElement, attributes: BlockAttributes): void {
    const img: HTMLImageElement | null = block.querySelector('img');
    if (!img) return;

    // Add lazy loading enhancement
    img.loading = 'lazy';

    // Add zoom on click for CSR mode
    img.style.cursor = 'zoom-in';

    const handleClick = (): void => {
        // Simple zoom implementation
        if (img.style.transform === 'scale(1.5)') {
            img.style.transform = 'scale(1)';
            img.style.zIndex = '';
            img.style.position = '';
        } else {
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
function enhanceGalleryBlock(block: HTMLElement, attributes: BlockAttributes): void {
    const images: NodeListOf<HTMLImageElement> = block.querySelectorAll('img');
    const imageArray: HTMLImageElement[] = Array.from(images);

    // Add lightbox functionality
    imageArray.forEach((img: HTMLImageElement, index: number): void => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (): void => openLightbox(imageArray, index));
    });
}

/**
 * Enhanced heading block features
 */
function enhanceHeadingBlock(block: HTMLElement, attributes: BlockAttributes): void {
    // Add copy-to-clipboard functionality
    block.style.cursor = 'pointer';

    const handleClick = (): void => {
        const text: string = block.textContent?.trim() ?? '';

        if (navigator.clipboard && text) {
            navigator.clipboard.writeText(text).then((): void => {
                // Show copied feedback
                const originalBg: string = block.style.backgroundColor;
                block.style.backgroundColor = '#e8f5e8';

                setTimeout((): void => {
                    block.style.backgroundColor = originalBg;
                }, 300);
            }).catch((error: Error): void => {
                console.warn('Jankx Blocks Extra: Failed to copy text to clipboard', error);
            });
        }
    };

    block.addEventListener('click', handleClick);
}

/**
 * Simple lightbox implementation
 */
function openLightbox(images: HTMLImageElement[], startIndex: number): void {
    // Create lightbox overlay
    const lightbox: HTMLDivElement = document.createElement('div');
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
    const imgContainer: HTMLDivElement = document.createElement('div');
    imgContainer.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
    `;

    // Show current image
    const currentImg: HTMLImageElement = document.createElement('img');
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
    const closeLightbox = (): void => {
        if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
        }
        document.removeEventListener('keydown', handleKey);
    };

    lightbox.addEventListener('click', closeLightbox);

    // Keyboard navigation
    let currentIndex: number = startIndex;

    const handleKey = (e: KeyboardEvent): void => {
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
function initResponsiveEnhancements(): void {
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
function addResponsiveContainerClasses(): void {
    const containers: NodeListOf<HTMLElement> = document.querySelectorAll('.wp-block-group, .wp-block-cover');

    containers.forEach((container: HTMLElement): void => {
        // Add responsive width classes
        if (!container.classList.contains('jankx-responsive-container')) {
            container.classList.add('jankx-responsive-container');
        }
    });
}

/**
 * Initialize responsive image handling
 */
function initResponsiveImages(): void {
    const images: NodeListOf<HTMLImageElement> = document.querySelectorAll('img');

    images.forEach((img: HTMLImageElement): void => {
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
function initResponsiveTypography(): void {
    // Add responsive font sizes based on viewport
    const headings: NodeListOf<HTMLHeadingElement> = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading: HTMLHeadingElement): void => {
        heading.classList.add('jankx-responsive-text');
    });
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal(): void {
    const revealElements: NodeListOf<HTMLElement> = document.querySelectorAll('.jankx-reveal');
    if (revealElements.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            const el = entry.target as HTMLElement;
            const isReverse = el.classList.contains('jankx-reveal--reverse');

            if (entry.isIntersecting) {
                el.classList.add('is-in-view');
            } else {
                // Only remove class if reverse animation is enabled
                if (isReverse) {
                    el.classList.remove('is-in-view');
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Main initialization function
 */
function initializeBlocksExtraFrontend(): void {
    // Handle CSR blocks
    handleCSRBlocks();

    // Initialize responsive enhancements
    initResponsiveEnhancements();

    // Initialize scroll reveal
    initScrollReveal();

    // Inject responsive dimensions CSS
    injectResponsiveDimensionsCSS();

    // Inject line-clamp CSS
    injectLineClampCSS();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlocksExtraFrontend);
} else {
    initializeBlocksExtraFrontend();
}

// Export API for potential external use
const JankxBlocksExtra: JankxBlocksExtraAPI = {
    handleCSRBlocks,
    initializeCSRBlock,
    initResponsiveEnhancements,
    initScrollReveal
};

// Make API available globally
(window as any).JankxBlocksExtra = JankxBlocksExtra;

// Export types
export type { RenderMode, BlockName, BlockAttributes, CSRBlockData, JankxBlocksExtraAPI };
export { JankxBlocksExtra };

/**
 * Inject global CSS to apply responsive dimensions via CSS variables
 */
function injectResponsiveDimensionsCSS(): void {
    const STYLE_ID = 'jankx-responsive-dimensions-css';
    if (document.getElementById(STYLE_ID)) {
        return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        .has-jankx-responsive-dimensions.has-jankx-padding {
            padding: var(--jankx-padding-desktop, initial);
        }
        .has-jankx-responsive-dimensions.has-jankx-margin {
            margin: var(--jankx-margin-desktop, initial);
        }
        .has-jankx-responsive-dimensions.has-jankx-gap {
            gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
            --wp--style--block-gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
        }
        .has-jankx-responsive-dimensions.has-jankx-flex-order {
            order: var(--jankx-flex-order-desktop, initial);
        }
        @media (max-width: 1024px) {
            .has-jankx-responsive-dimensions.has-jankx-padding {
                padding: var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial));
            }
            .has-jankx-responsive-dimensions.has-jankx-margin {
                margin: var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial));
            }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
                --wp--style--block-gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
            }
            .has-jankx-responsive-dimensions.has-jankx-flex-order {
                order: var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-responsive-dimensions.has-jankx-padding {
                padding: var(--jankx-padding-mobile, var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial)));
            }
            .has-jankx-responsive-dimensions.has-jankx-margin {
                margin: var(--jankx-margin-mobile, var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial)));
            }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
                --wp--style--block-gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
            }
            .has-jankx-responsive-dimensions.has-jankx-flex-order {
                order: var(--jankx-flex-order-mobile, var(--jankx-flex-order-tablet, var(--jankx-flex-order-desktop, initial)));
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Inject line-clamp CSS
 */
function injectLineClampCSS(): void {
    const STYLE_ID = 'jankx-line-clamp-css';
    if (document.getElementById(STYLE_ID)) {
        return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        .has-jankx-line-clamp {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: var(--jankx-line-clamp, initial);
            line-clamp: var(--jankx-line-clamp, initial);
        }
        @media (max-width: 1024px) {
            .has-jankx-line-clamp {
                -webkit-line-clamp: var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial));
                line-clamp: var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-line-clamp {
                -webkit-line-clamp: var(--jankx-line-clamp-mobile, var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial)));
                line-clamp: var(--jankx-line-clamp-mobile, var(--jankx-line-clamp-tablet, var(--jankx-line-clamp, initial)));
            }
        }
    `;
    document.head.appendChild(style);
}
