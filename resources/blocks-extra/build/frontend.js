/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./blocks-extra/ts/frontend.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JankxBlocksExtra: () => (/* binding */ JankxBlocksExtra)
/* harmony export */ });
/**
 * Blocks Extra Frontend TypeScript
 * 
 * Handles client-side rendering for blocks marked with CSR mode
 * and provides enhanced responsive features.
 */



// Type definitions
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
  csrBlocks.forEach(block => {
    var _block$dataset$blockN, _block$dataset$blockA;
    const blockName = (_block$dataset$blockN = block.dataset.blockName) !== null && _block$dataset$blockN !== void 0 ? _block$dataset$blockN : '';
    const blockAttrsString = (_block$dataset$blockA = block.dataset.blockAttrs) !== null && _block$dataset$blockA !== void 0 ? _block$dataset$blockA : '{}';
    let blockAttrs;
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
  if (!img) return;

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
    var _block$textContent$tr;
    const text = (_block$textContent$tr = block.textContent?.trim()) !== null && _block$textContent$tr !== void 0 ? _block$textContent$tr : '';
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(() => {
        // Show copied feedback
        const originalBg = block.style.backgroundColor;
        block.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
          block.style.backgroundColor = originalBg;
        }, 300);
      }).catch(error => {
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
  var _images$startIndex$sr;
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
  currentImg.src = (_images$startIndex$sr = images[startIndex]?.src) !== null && _images$startIndex$sr !== void 0 ? _images$startIndex$sr : '';
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
  const handleKey = e => {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) {
          var _images$currentIndex$;
          currentIndex++;
          currentImg.src = (_images$currentIndex$ = images[currentIndex]?.src) !== null && _images$currentIndex$ !== void 0 ? _images$currentIndex$ : '';
        }
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) {
          var _images$currentIndex$2;
          currentIndex--;
          currentImg.src = (_images$currentIndex$2 = images[currentIndex]?.src) !== null && _images$currentIndex$2 !== void 0 ? _images$currentIndex$2 : '';
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

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.jankx-reveal');
  if (revealElements.length === 0) return;
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
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
function initializeBlocksExtraFrontend() {
  // Handle CSR blocks
  handleCSRBlocks();

  // Initialize responsive enhancements
  initResponsiveEnhancements();

  // Initialize scroll reveal
  initScrollReveal();

  // Inject responsive dimensions CSS
  injectResponsiveDimensionsCSS();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlocksExtraFrontend);
} else {
  initializeBlocksExtraFrontend();
}

// Export API for potential external use
const JankxBlocksExtra = {
  handleCSRBlocks,
  initializeCSRBlock,
  initResponsiveEnhancements,
  initScrollReveal
};

// Make API available globally
window.JankxBlocksExtra = JankxBlocksExtra;

// Export types



/**
 * Inject global CSS to apply responsive dimensions via CSS variables
 */
function injectResponsiveDimensionsCSS() {
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
                --wp--style--block-gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
            }
        }
    `;
  document.head.appendChild(style);
}
/******/ })()
;
//# sourceMappingURL=frontend.js.map