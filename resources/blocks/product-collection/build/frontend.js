/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/product-collection/legacy-events.ts":
/*!****************************************************!*\
  !*** ./blocks/product-collection/legacy-events.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dispatchEvent: () => (/* binding */ dispatchEvent),
/* harmony export */   triggerProductListRenderedEvent: () => (/* binding */ triggerProductListRenderedEvent),
/* harmony export */   triggerViewedProductEvent: () => (/* binding */ triggerViewedProductEvent)
/* harmony export */ });
//  TODO - move this to shared code once the product collection block is converted to use script modules.
/**
 * Internal dependencies
 */

/**
 * Wrapper function to dispatch an event.
 */
const dispatchEvent = (name, {
  bubbles = false,
  cancelable = false,
  element,
  detail = {}
}) => {
  if (!CustomEvent) {
    return;
  }
  if (!element) {
    element = document.body;
  }
  const event = new CustomEvent(name, {
    bubbles,
    cancelable,
    detail
  });
  element.dispatchEvent(event);
};
const triggerProductListRenderedEvent = payload => {
  dispatchEvent('wc-blocks_product_list_rendered', {
    bubbles: true,
    cancelable: true,
    detail: payload
  });
};
const triggerViewedProductEvent = payload => {
  dispatchEvent('wc-blocks_viewed_product', {
    bubbles: true,
    cancelable: true,
    detail: payload
  });
};

/***/ }),

/***/ "./blocks/product-collection/style.scss":
/*!**********************************************!*\
  !*** ./blocks/product-collection/style.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/interactivity":
/*!***************************************!*\
  !*** external ["wp","interactivity"] ***!
  \***************************************/
/***/ ((module) => {

module.exports = window["wp"]["interactivity"];

/***/ }),

/***/ "@wordpress/interactivity-router":
/*!*********************************************!*\
  !*** external ["wp","interactivityRouter"] ***!
  \*********************************************/
/***/ ((module) => {

module.exports = window["wp"]["interactivityRouter"];

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
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
/*!***********************************************!*\
  !*** ./blocks/product-collection/frontend.ts ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _legacy_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legacy-events */ "./blocks/product-collection/legacy-events.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./blocks/product-collection/style.scss");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


// @wordpress/i18n is not available on the frontend.
function isRTL() {
  return document.documentElement?.dir === 'rtl';
}
function isValidLink(ref) {
  return ref !== null && ref instanceof window.HTMLAnchorElement && !!ref.href && (!ref.target || ref.target === '_self') && ref.origin === window.location.origin;
}
const checkIfButtonsDisabled = (productTemplate, currentScroll) => {
  if (!productTemplate) {
    return {
      isDisabledPrevious: true,
      isDisabledNext: true
    };
  }
  const SCROLL_OFFSET = 5;
  const {
    scrollWidth,
    clientWidth
  } = productTemplate;
  if (isRTL()) {
    return {
      isDisabledPrevious: currentScroll > -SCROLL_OFFSET,
      isDisabledNext: currentScroll <= clientWidth - scrollWidth + SCROLL_OFFSET
    };
  }
  return {
    isDisabledPrevious: currentScroll < SCROLL_OFFSET,
    isDisabledNext: currentScroll >= scrollWidth - clientWidth - SCROLL_OFFSET
  };
};

/**
 * Scrolls the carousel by 90% of the container width and updates
 * the isDisabledPrevious and isDisabledNext context values.
 *
 * @param direction - The direction to scroll.
 */
const scrollCarousel = direction => {
  const {
    ref
  } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
  const productCollection = ref?.closest('.wp-block-woocommerce-product-collection');
  const productTemplate = productCollection?.querySelector('.wc-block-product-template');
  if (!productTemplate) {
    return;
  }
  const productCollectionWidth = productCollection?.clientWidth;
  // Arbitrary value to scroll the carousel by 90% of the container width.
  const scrollBy = productCollectionWidth ? 0.9 * productCollectionWidth : 400;
  const multiplier = isRTL() ? -1 : 1;
  productTemplate?.scrollBy({
    left: multiplier * (direction === 'left' ? -scrollBy : scrollBy),
    behavior: 'smooth'
  });
  const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
  const {
    scrollLeft
  } = productTemplate;
  // scrollBy doesn't return the final position, so we need to calculate it.
  const finalPosition = direction === 'left' ? scrollLeft - multiplier * scrollBy : scrollLeft + multiplier * scrollBy;
  const {
    isDisabledPrevious,
    isDisabledNext
  } = checkIfButtonsDisabled(productTemplate, finalPosition);
  context.isDisabledPrevious = isDisabledPrevious;
  context.isDisabledNext = isDisabledNext;
};
const onKeyDown = event => {
  if (event.code === 'ArrowRight') {
    event.preventDefault();
    scrollCarousel('right');
  }
  if (event.code === 'ArrowLeft') {
    event.preventDefault();
    scrollCarousel('left');
  }
};
function isValidEvent(event) {
  return event.button === 0 &&
  // Left clicks only.
  !event.metaKey &&
  // Open in new tab (Mac).
  !event.ctrlKey &&
  // Open in new tab (Windows).
  !event.altKey &&
  // Download.
  !event.shiftKey && !event.defaultPrevented;
}
const productCollectionStore = {
  actions: {
    *navigate(event) {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (isValidLink(ref) && isValidEvent(event)) {
        event.preventDefault();
        const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
        const routerRegionId = ref.closest('[data-wp-router-region]')?.getAttribute('data-wp-router-region');
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.navigate(ref.href);
        ctx.isPrefetchNextOrPreviousLink = ref.href;

        // Moves focus to the product link.
        const product = document.querySelector(`[data-wp-router-region=${routerRegionId}] .wc-block-product-template .wc-block-product a`);
        product?.focus();
        (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerProductListRenderedEvent)({
          collection: ctx.collection
        });
      }
    },
    /**
     * We prefetch the next or previous button page on hover.
     * Optimizes user experience by preloading content for faster access.
     */
    *prefetchOnHover() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (isValidLink(ref)) {
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.prefetch(ref.href);
      }
    },
    *viewProduct() {
      const {
        collection,
        productId
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (productId) {
        (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerViewedProductEvent)({
          collection,
          productId
        });
      }
    },
    // Next/Previous Buttons block actions
    onClickPrevious: () => {
      scrollCarousel('left');
    },
    onClickNext: () => {
      scrollCarousel('right');
    },
    onKeyDownPrevious: event => {
      onKeyDown(event);
    },
    onKeyDownNext: event => {
      onKeyDown(event);
    },
    watchScroll: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (ref) {
        const {
          isDisabledPrevious,
          isDisabledNext
        } = checkIfButtonsDisabled(ref, ref.scrollLeft);
        context.isDisabledPrevious = isDisabledPrevious;
        context.isDisabledNext = isDisabledNext;
      }
    }
  },
  callbacks: {
    /**
     * Prefetches content for next or previous links after initial user interaction.
     * Reduces perceived load times for subsequent page navigations.
     */
    *prefetch() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (isValidLink(ref) && context.isPrefetchNextOrPreviousLink) {
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.prefetch(ref.href);
      }
    },
    *onRender() {
      const {
        collection
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerProductListRenderedEvent)({
        collection
      });
    },
    initResizeObserver: () => {
      const scrollableElement = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)()?.ref;
      if (!scrollableElement) {
        return;
      }
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const observer = new ResizeObserver(() => {
        const hasOverflowX = scrollableElement.scrollWidth > scrollableElement.clientWidth;
        context.hideNextPreviousButtons = !hasOverflowX;
      });
      observer.observe(scrollableElement);
    }
  }
};
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('woocommerce/product-collection', productCollectionStore, {
  lock: true
});
})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map