/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/carousel/constants/index.ts":
/*!********************************************!*\
  !*** ./blocks/carousel/constants/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLOCK_CLASS_NAME: () => (/* binding */ BLOCK_CLASS_NAME)
/* harmony export */ });
const BLOCK_CLASS_NAME = 'wpd-block-carousel';


/***/ }),

/***/ "./node_modules/@wordpress/dom-ready/build-module/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@wordpress/dom-ready/build-module/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ domReady)
/* harmony export */ });
/**
 * @typedef {() => void} Callback
 *
 * TODO: Remove this typedef and inline `() => void` type.
 *
 * This typedef is used so that a descriptive type is provided in our
 * automatically generated documentation.
 *
 * An in-line type `() => void` would be preferable, but the generated
 * documentation is `null` in that case.
 *
 * @see https://github.com/WordPress/gutenberg/issues/18045
 */

/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Callback} callback A function to execute after the DOM is ready.
 *
 * @example
 * ```js
 * import domReady from '@wordpress/dom-ready';
 *
 * domReady( function() {
 * 	//do something after DOM loads.
 * } );
 * ```
 *
 * @return {void}
 */
function domReady(callback) {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.readyState === 'complete' ||
  // DOMContentLoaded + Images/Styles/etc loaded, so we call directly.
  document.readyState === 'interactive' // DOMContentLoaded fires at this point, so we call directly.
  ) {
    return void callback();
  }

  // DOMContentLoaded has not fired yet, delay callback until then.
  document.addEventListener('DOMContentLoaded', callback);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./blocks/carousel/view.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/dom-ready */ "./node_modules/@wordpress/dom-ready/build-module/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./blocks/carousel/constants/index.ts");
/* eslint-disable import/no-unresolved */


(0,_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__["default"])(async () => {
    console.log('Carousel view script loaded');
    const elements = document.querySelectorAll(`.${_constants__WEBPACK_IMPORTED_MODULE_1__.BLOCK_CLASS_NAME} .swiper`);
    console.log('Found carousel elements:', elements.length);
    if (!elements.length) {
        console.log('No carousel elements found');
        return;
    }
    // Get Swiper from global window
    const Swiper = window.Swiper;
    if (!Swiper) {
        console.error('Swiper not found in global scope. Make sure Swiper CDN is loaded.');
        return;
    }
    console.log('Swiper from global:', Swiper);
    window.jankx = window.jankx || {};
    window.jankx.blocks = window.jankx.blocks || {};
    window.jankx.blocks.carousel = window.jankx.blocks.carousel || [];
    const handler = async (element) => {
        console.log('Handler called for element:', element);
        // Cast to HTMLElement to access dataset
        const htmlElement = element;
        console.log('HTML element dataset:', htmlElement.dataset);
        const { slidesPerView = 'auto', spaceBetween = '0', hasPagination, hasNavigation, shouldAutoplay, shouldLoop } = htmlElement.dataset;
        console.log('Carousel settings:', {
            slidesPerView,
            spaceBetween,
            hasPagination,
            hasNavigation,
            shouldAutoplay,
            shouldLoop
        });
        // Modules are now installed directly in Swiper constructor
        console.log('Creating Swiper instance...');
        try {
            const swiperInstance = new Swiper(element, {
                // Install modules - Swiper 11 bundle includes all modules by default
                modules: [],
                // Optional parameters
                slidesPerView: slidesPerView !== 'auto' ? parseInt(slidesPerView, 10) : slidesPerView,
                spaceBetween: parseInt(spaceBetween, 10),
                loop: shouldLoop === 'true',
                // Navigation arrows
                navigation: hasNavigation === 'true' ? {
                    nextEl: '[data-swiper-button-next]',
                    prevEl: '[data-swiper-button-prev]'
                } : false,
                // Pagination
                pagination: hasPagination === 'true' ? {
                    el: '.swiper-pagination',
                    clickable: true
                } : false,
                // Autoplay
                autoplay: shouldAutoplay === 'true' ? {
                    delay: 3000,
                    disableOnInteraction: false
                } : false
            });
            console.log('Swiper instance created successfully:', swiperInstance);
            window.jankx.blocks.carousel.push(swiperInstance);
        }
        catch (error) {
            console.error('Error creating Swiper instance:', error);
        }
    };
    if (typeof window.IntersectionObserver === 'undefined') {
        [].map.call(elements, handler);
        return;
    }
    const observer = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            handler(entry.target);
            observer.unobserve(entry.target);
        });
    });
    [].map.call(elements, element => {
        observer.observe(element);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=view.js.map