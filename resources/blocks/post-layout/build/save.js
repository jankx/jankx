/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
/*!************************************!*\
  !*** ./blocks/post-layout/save.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function save({
  attributes
}) {
  const {
    postType,
    postsPerPage,
    orderBy,
    order,
    offset,
    exclude,
    include,
    taxonomyFilters,
    metaFilters,
    presetFilters,
    customFilters,
    layout,
    pagination,
    displayOptions,
    styling,
    responsive
  } = attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: 'jankx-post-layout'
  });

  // Validate required attributes
  const validateAttributes = () => {
    const errors = [];
    if (!postType || typeof postType !== 'string') {
      errors.push('postType is required and must be a string');
    }
    if (!postsPerPage || typeof postsPerPage !== 'number' || postsPerPage < 1) {
      errors.push('postsPerPage must be a positive number');
    }
    if (orderBy && typeof orderBy !== 'string') {
      errors.push('orderBy must be a string');
    }
    if (order && !['ASC', 'DESC'].includes(order)) {
      errors.push('order must be either ASC or DESC');
    }
    if (offset && (typeof offset !== 'number' || offset < 0)) {
      errors.push('offset must be a non-negative number');
    }
    if (exclude && !Array.isArray(exclude)) {
      errors.push('exclude must be an array');
    }
    if (include && !Array.isArray(include)) {
      errors.push('include must be an array');
    }
    if (taxonomyFilters && typeof taxonomyFilters !== 'object') {
      errors.push('taxonomyFilters must be an object');
    }
    if (metaFilters && typeof metaFilters !== 'object') {
      errors.push('metaFilters must be an object');
    }
    if (errors.length > 0) {
      throw new Error(`Post Layout Block Configuration Error: ${errors.join(', ')}`);
    }
  };
  try {
    // Validate attributes before rendering
    validateAttributes();
  } catch (error) {
    console.error('Post Layout Block Error:', error.message);
    // Return error state instead of crashing
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "jankx-post-layout-error",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
          children: ["L\u1ED7i c\u1EA5u h\xECnh block: ", error.message]
        })
      })
    });
  }

  // Embed configuration as JSON for frontend JavaScript
  const config = {
    postType: postType || 'post',
    postsPerPage: postsPerPage || 6,
    orderBy: orderBy || 'date',
    order: order || 'DESC',
    offset: offset || 0,
    exclude: exclude || [],
    include: include || [],
    taxonomyFilters: taxonomyFilters || {},
    metaFilters: metaFilters || {},
    presetFilters: presetFilters || [],
    customFilters: customFilters || [],
    layout: layout || 'grid',
    pagination: pagination || {
      enabled: true,
      type: 'numbers'
    },
    displayOptions: displayOptions || {
      showImage: true,
      showTitle: true,
      showExcerpt: true,
      showMeta: true
    },
    styling: styling || {
      viewType: 'grid',
      hoverEffect: 'lift',
      borderRadius: 8,
      shadow: 'medium'
    },
    responsive: responsive || {
      mobile: true,
      tablet: true,
      desktop: true
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "jankx-post-layout-config",
      "data-config": JSON.stringify(config),
      style: {
        display: 'none'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "jankx-post-layout-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "jankx-post-layout-loading",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "jankx-post-layout-loading__spinner"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
          children: "\u0110ang t\u1EA3i..."
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "jankx-post-layout-pagination",
      style: {
        display: 'none'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "jankx-post-layout-pagination__links"
      })
    })]
  });
}
})();

/******/ })()
;
//# sourceMappingURL=save.js.map