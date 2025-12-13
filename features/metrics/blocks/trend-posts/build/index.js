/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./metrics/blocks/trend-posts/style.scss":
/*!***********************************************!*\
  !*** ./metrics/blocks/trend-posts/style.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

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
/*!**********************************************!*\
  !*** ./metrics/blocks/trend-posts/index.tsx ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./metrics/blocks/trend-posts/style.scss");






const generateMockTitle = index => {
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Sample trending post %d', 'jankx'), index + 1);
};
const mockExcerpt = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('This is a preview excerpt that gives a quick summary of the post content for demonstration.', 'jankx');
const mockDate = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('January 1, 2025', 'jankx');
const mockViews = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('12.3K views', 'jankx');
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('jankx/trend-posts', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Trend Posts', 'jankx'),
  category: 'widgets',
  icon: 'chart-line',
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Display trending posts based on view count', 'jankx'),
  attributes: {
    postsPerPage: {
      type: 'number',
      default: 1
    },
    showThumbnail: {
      type: 'boolean',
      default: true
    },
    showTitle: {
      type: 'boolean',
      default: true
    },
    showExcerpt: {
      type: 'boolean',
      default: false
    },
    showDate: {
      type: 'boolean',
      default: true
    },
    showViews: {
      type: 'boolean',
      default: true
    },
    includeStickyPosts: {
      type: 'boolean',
      default: false
    }
  },
  edit: function Edit({
    attributes,
    setAttributes
  }) {
    var _blockProps$className;
    const {
      postsPerPage,
      showThumbnail,
      showTitle,
      showExcerpt,
      showDate,
      showViews,
      includeStickyPosts
    } = attributes;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
      className: 'jankx-trend-posts-block'
    });
    const className = (_blockProps$className = blockProps.className) !== null && _blockProps$className !== void 0 ? _blockProps$className : '';
    const isHotBadgeStyle = className.includes('is-style-hot-badge');
    const displayCount = isHotBadgeStyle ? 1 : Math.max(1, Math.min(postsPerPage, 5));
    const mockPosts = Array.from({
      length: displayCount
    }).map((_, index) => ({
      title: generateMockTitle(index),
      excerpt: mockExcerpt,
      date: mockDate,
      views: mockViews,
      id: index
    }));
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings', 'jankx')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Number of Posts', 'jankx'),
      value: postsPerPage,
      onChange: value => setAttributes({
        postsPerPage: value
      }),
      min: 1,
      max: 10
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Thumbnail', 'jankx'),
      checked: showThumbnail,
      onChange: value => setAttributes({
        showThumbnail: value
      }),
      disabled: isHotBadgeStyle,
      help: isHotBadgeStyle ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Thumbnails are hidden in Hot Badge style.', 'jankx') : undefined
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Title', 'jankx'),
      checked: showTitle,
      onChange: value => setAttributes({
        showTitle: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Excerpt', 'jankx'),
      checked: showExcerpt,
      onChange: value => setAttributes({
        showExcerpt: value
      }),
      disabled: isHotBadgeStyle,
      help: isHotBadgeStyle ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Excerpt is hidden in Hot Badge style.', 'jankx') : undefined
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Date', 'jankx'),
      checked: showDate,
      onChange: value => setAttributes({
        showDate: value
      }),
      disabled: isHotBadgeStyle,
      help: isHotBadgeStyle ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Date is hidden in Hot Badge style.', 'jankx') : undefined
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Views', 'jankx'),
      checked: showViews,
      onChange: value => setAttributes({
        showViews: value
      }),
      disabled: isHotBadgeStyle,
      help: isHotBadgeStyle ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('View counter is hidden in Hot Badge style.', 'jankx') : undefined
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Include Sticky Posts', 'jankx'),
      checked: includeStickyPosts,
      onChange: value => setAttributes({
        includeStickyPosts: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Enable to allow sticky posts to appear in the trending list.', 'jankx')
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "trend-posts-container"
    }, mockPosts.map(post => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("article", {
      key: post.id,
      className: `trend-post-item${isHotBadgeStyle ? ' trend-post-item-hot' : ''}`
    }, showThumbnail && !isHotBadgeStyle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "trend-post-thumbnail"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "trend-post-thumbnail-placeholder",
      "aria-hidden": "true"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "trend-post-content"
    }, isHotBadgeStyle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "trend-post-badge",
      "aria-hidden": "true"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Xu hướng HOT', 'jankx')), showTitle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "trend-post-title"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, post.title)), showExcerpt && !isHotBadgeStyle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "trend-post-excerpt"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, post.excerpt)), !isHotBadgeStyle && (showDate || showViews) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "trend-post-meta"
    }, showDate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "trend-post-date"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("time", {
      dateTime: "2025-01-01"
    }, post.date)), showViews && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "trend-post-views"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": "true"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, post.views)))))))));
  },
  save: function save() {
    return null; // Dynamic block
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map