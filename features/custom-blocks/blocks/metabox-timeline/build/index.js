/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./custom-blocks/blocks/metabox-timeline/block.json":
/*!**********************************************************!*\
  !*** ./custom-blocks/blocks/metabox-timeline/block.json ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/metabox-timeline","version":"1.0.0","title":"Metabox Timeline","category":"jankx","icon":"schedule","description":"Hiển thị timeline từ metabox","supports":{"html":false,"inserter":true,"color":{"text":true,"background":true,"__experimentalSkipSerialization":true},"spacing":{"margin":true,"padding":true,"__experimentalSkipSerialization":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true},"typography":{"fontSize":true,"lineHeight":true,"fontStyle":true,"fontWeight":true,"textDecoration":true,"textTransform":true,"letterSpacing":true,"__experimentalSkipSerialization":true}},"selectors":{"root":".jankx-timeline","color":{"text":".jankx-timeline-time, .jankx-timeline-title, .jankx-timeline-desc","background":".jankx-timeline-card"},"spacing":{"root":".jankx-timeline","padding":".jankx-timeline-card, .jankx-timeline-item","margin":".jankx-timeline-item"},"border":{"root":".jankx-timeline-card"},"typography":{"fontSize":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","lineHeight":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","fontStyle":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","fontWeight":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","textDecoration":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","textTransform":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time","letterSpacing":".jankx-timeline-title, .jankx-timeline-desc, .jankx-timeline-time"}},"keywords":["timeline","lịch trình","metabox"],"textdomain":"jankx","style":"file:./build/style.css","editorStyle":"file:./build/style.css","editorScript":"file:./build/index.js","render":"file:./render.php"}');

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
/*!*********************************************************!*\
  !*** ./custom-blocks/blocks/metabox-timeline/index.tsx ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./custom-blocks/blocks/metabox-timeline/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);




// @ts-ignore


// Main metabox timeline block: provides editor template

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit() {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-metabox-timeline-editor'
    });
    // Template: header and items wrapper with default children
    const TEMPLATE = [['jankx/timelime-header', {}], ['jankx/timelime-items', {}, [['jankx/timelime-time', {
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thời gian', 'jankx')
    }], ['jankx/timelime-title', {
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tiêu đề', 'jankx')
    }], ['jankx/timelime-description', {
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mô tả', 'jankx')
    }]]]];
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cấu hình', 'jankx'),
          initialOpen: true
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
        allowedBlocks: ['jankx/timelime-header', 'jankx/timelime-items'],
        template: TEMPLATE,
        templateLock: false
      })]
    });
  },
  save() {
    return null;
  }
});

// Header block: allow heading, image, svg icon
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/timelime-header', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Timeline Header', 'jankx'),
  category: 'jankx',
  icon: 'heading',
  supports: {
    html: false,
    color: {
      text: true,
      background: true,
      gradients: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      textDecoration: true,
      textTransform: true,
      letterSpacing: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    border: {
      style: true,
      color: true,
      width: true,
      radius: true
    }
  },
  edit() {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-timelime-header'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
        allowedBlocks: ['core/heading', 'core/image', 'jankx/svg-icon'],
        templateLock: false
      })
    });
  },
  save() {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, {});
  }
});

// Items wrapper: allow time/title/description children
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/timelime-items', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Timeline Items', 'jankx'),
  category: 'jankx',
  icon: 'list-view',
  supports: {
    html: false,
    spacing: {
      margin: true,
      padding: true
    },
    border: {
      style: true,
      color: true,
      width: true,
      radius: true
    },
    color: {
      background: true
    }
  },
  edit() {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-timelime-items'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
        allowedBlocks: ['jankx/timelime-time', 'jankx/timelime-title', 'jankx/timelime-description'],
        renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.ButtonBlockAppender,
        templateLock: false
      })
    });
  },
  save() {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, {});
  }
});

// Leaf: time
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/timelime-time', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Timeline Time', 'jankx'),
  category: 'jankx',
  icon: 'clock',
  attributes: {
    content: {
      type: 'string',
      source: 'text',
      selector: 'p'
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  supports: {
    html: false,
    color: {
      text: true,
      background: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true,
      textTransform: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    border: {
      style: true,
      color: true,
      width: true,
      radius: true
    }
  },
  edit({
    attributes,
    setAttributes
  }) {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-timelime-time'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      ...blockProps,
      tagName: "p",
      value: attributes.content,
      onChange: val => setAttributes({
        content: val
      }),
      placeholder: attributes.placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thời gian', 'jankx')
    });
  },
  save({
    attributes
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
      className: 'jankx-timelime-time'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      ...blockProps,
      tagName: "p",
      value: attributes.content
    });
  }
});

// Leaf: title
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/timelime-title', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Timeline Title', 'jankx'),
  category: 'jankx',
  icon: 'text',
  attributes: {
    content: {
      type: 'string',
      source: 'text',
      selector: 'h4'
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  supports: {
    html: false,
    color: {
      text: true,
      background: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true,
      textTransform: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    border: {
      style: true,
      color: true,
      width: true,
      radius: true
    }
  },
  edit({
    attributes,
    setAttributes
  }) {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-timelime-title'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      ...blockProps,
      tagName: "h4",
      value: attributes.content,
      onChange: val => setAttributes({
        content: val
      }),
      placeholder: attributes.placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tiêu đề', 'jankx')
    });
  },
  save({
    attributes
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
      className: 'jankx-timelime-title'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      ...blockProps,
      tagName: "h4",
      value: attributes.content
    });
  }
});

// Leaf: description
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/timelime-description', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Timeline Description', 'jankx'),
  category: 'jankx',
  icon: 'editor-paragraph',
  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'p'
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  supports: {
    html: false,
    color: {
      text: true,
      background: true
    },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true
    },
    spacing: {
      margin: true,
      padding: true
    },
    border: {
      style: true,
      color: true,
      width: true,
      radius: true
    }
  },
  edit({
    attributes,
    setAttributes
  }) {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'jankx-timelime-description'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      ...blockProps,
      tagName: "p",
      value: attributes.content,
      onChange: val => setAttributes({
        content: val
      }),
      placeholder: attributes.placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mô tả', 'jankx')
    });
  },
  save({
    attributes
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
      className: 'jankx-timelime-description'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      ...blockProps,
      tagName: "p",
      value: attributes.content
    });
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map