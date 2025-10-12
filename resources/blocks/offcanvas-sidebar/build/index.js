/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/offcanvas-sidebar/block.json":
/*!*********************************************!*\
  !*** ./blocks/offcanvas-sidebar/block.json ***!
  \*********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","name":"jankx/offcanvas-sidebar","title":"Offcanvas Sidebar","category":"widgets","icon":"menu","description":"Create animated offcanvas sidebar with multiple transition effects","keywords":["sidebar","offcanvas","menu","navigation","animation","transition"],"textdomain":"jankx","supports":{"html":false,"align":["wide","full"],"color":{"background":true,"gradients":true,"text":true,"link":false},"background":{"backgroundImage":true,"backgroundSize":true},"spacing":{"margin":true,"padding":true}},"innerBlocks":{"allowedBlocks":["core/paragraph","core/heading","core/image","core/gallery","core/list","core/quote","core/buttons","core/separator","core/spacer","core/social-links","core/navigation","core/search","core/calendar","core/latest-posts","core/latest-comments","core/rss","core/audio","core/video","core/file","core/code","core/html","core/preformatted","core/pullquote","core/table","core/verse","core/media-text","core/columns","core/group","core/cover","core/embed","jankx/language-switcher","jankx/icon-button","jankx/offcanvas-sidebar"],"template":[["core/heading",{"level":3,"content":"Sidebar Content"}],["core/paragraph",{"content":"Add your content here using any available blocks."}]],"templateLock":false},"attributes":{"sidebarPosition":{"type":"string","default":"left"},"animationEffect":{"type":"string","default":"slide-in"},"sidebarWidth":{"type":"string","default":"300px"},"overlayColor":{"type":"string","default":"rgba(0,0,0,0.2)"},"showCloseButton":{"type":"boolean","default":true},"closeButtonPosition":{"type":"string","default":"top-right"},"closeButtonSize":{"type":"string","default":"medium"},"closeButtonStyle":{"type":"string","default":"circle"},"closeButtonColor":{"type":"string","default":"inherit"},"triggerText":{"type":"string","default":"Menu"},"triggerIcon":{"type":"string","default":"menu"},"showOverlay":{"type":"boolean","default":true},"closeOnOverlayClick":{"type":"boolean","default":true},"closeOnEscape":{"type":"boolean","default":true},"autoClose":{"type":"boolean","default":false},"autoCloseDelay":{"type":"number","default":5000},"menuItems":{"type":"array","default":[{"id":"home","text":"Home","url":"#","icon":"home"},{"id":"about","text":"About","url":"#","icon":"info"},{"id":"services","text":"Services","url":"#","icon":"cog"},{"id":"contact","text":"Contact","url":"#","icon":"email"}]},"className":{"type":"string"}},"editorScript":"file:./build/index.js","viewScript":"file:./build/frontend.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css"}');

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

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

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
/*!********************************************!*\
  !*** ./blocks/offcanvas-sidebar/index.tsx ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/offcanvas-sidebar/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





// @ts-ignore


// Animation effects available
const ANIMATION_EFFECTS = [{
  label: 'Slide In',
  value: 'slide-in'
}, {
  label: 'Slide Down',
  value: 'slide-down'
}];
function OffcanvasSidebarEdit({
  attributes,
  setAttributes
}) {
  const {
    sidebarPosition,
    animationEffect,
    sidebarWidth,
    overlayColor,
    showOverlay,
    closeOnOverlayClick,
    showCloseButton,
    closeButtonPosition,
    closeButtonSize,
    closeButtonStyle,
    closeButtonColor,
    className,
    style
  } = attributes;

  // Add 'sidebar-open' class to root container in editor to show sidebar
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const rootContainer = document.querySelector('.is-root-container');
    const hamburgerContainer = document.querySelector('.hamburger-container');
    if (!hamburgerContainer?.classList.contains('active') && rootContainer) {
      rootContainer.classList.add('sidebar-open');
    }
  }, []); // Run once on mount

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: `offcanvas-sidebar-block ${className || ''}`
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useInnerBlocksProps)({
    className: 'sidebar-content'
  }, {
    allowedBlocks: ['core/paragraph', 'core/heading', 'core/image', 'core/gallery', 'core/list', 'core/quote', 'core/buttons', 'core/separator', 'core/spacer', 'core/social-links', 'core/navigation', 'core/search', 'core/calendar', 'core/latest-posts', 'core/latest-comments', 'core/rss', 'core/audio', 'core/video', 'core/file', 'core/code', 'core/html', 'core/preformatted', 'core/pullquote', 'core/table', 'core/verse', 'core/media-text', 'core/columns', 'core/group', 'core/cover', 'core/embed', 'jankx/language-switcher', 'jankx/icon-button', 'jankx/offcanvas-sidebar'],
    template: [['core/heading', {
      level: 3,
      content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sidebar Content', 'jankx')
    }], ['core/paragraph', {
      content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add your content here using any available blocks.', 'jankx')
    }]],
    templateLock: false
  });

  // Memoize sidebar style to prevent re-creation on every render
  const sidebarStyle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => ({
    width: sidebarWidth,
    ...style
  }), [sidebarWidth, style]);

  // Render sidebar preview (always visible in editor)
  const renderSidebarPreview = () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: `offcanvas-sidebar-preview effect-${animationEffect} position-${sidebarPosition}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "offcanvas-sidebar editor-sidebar",
        style: sidebarStyle,
        children: [showCloseButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          className: `close-button editor-close-button position-${closeButtonPosition} size-${closeButtonSize} style-${closeButtonStyle}`,
          type: "button",
          disabled: true,
          style: {
            color: closeButtonColor
          },
          children: "\xD7"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          ...innerBlocksProps
        })]
      })
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sidebar Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Position', 'jankx'),
          value: sidebarPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Left', 'jankx'),
            value: 'left'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Right', 'jankx'),
            value: 'right'
          }],
          onChange: value => setAttributes({
            sidebarPosition: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation Effect', 'jankx'),
          value: animationEffect,
          options: ANIMATION_EFFECTS,
          onChange: value => setAttributes({
            animationEffect: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sidebar Width', 'jankx'),
          value: sidebarWidth,
          onChange: value => setAttributes({
            sidebarWidth: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('e.g., 300px, 25vw, 20rem', 'jankx')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Settings', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "color-picker-group",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Color', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
            type: "color",
            value: overlayColor,
            onChange: e => setAttributes({
              overlayColor: e.target.value
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Behavior', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Overlay', 'jankx'),
          checked: showOverlay,
          onChange: value => setAttributes({
            showOverlay: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close on Overlay Click', 'jankx'),
          checked: closeOnOverlayClick,
          onChange: value => setAttributes({
            closeOnOverlayClick: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close Button', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Close Button', 'jankx'),
          checked: showCloseButton,
          onChange: value => setAttributes({
            showCloseButton: value
          })
        }), showCloseButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Position', 'jankx'),
            value: closeButtonPosition,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top Right', 'jankx'),
              value: 'top-right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top Left', 'jankx'),
              value: 'top-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bottom Right', 'jankx'),
              value: 'bottom-right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bottom Left', 'jankx'),
              value: 'bottom-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Center Right', 'jankx'),
              value: 'center-right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Center Left', 'jankx'),
              value: 'center-left'
            }],
            onChange: value => setAttributes({
              closeButtonPosition: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Size', 'jankx'),
            value: closeButtonSize,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Small', 'jankx'),
              value: 'small'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Medium', 'jankx'),
              value: 'medium'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Large', 'jankx'),
              value: 'large'
            }],
            onChange: value => setAttributes({
              closeButtonSize: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Style', 'jankx'),
            value: closeButtonStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Circle', 'jankx'),
              value: 'circle'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Square', 'jankx'),
              value: 'square'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rounded', 'jankx'),
              value: 'rounded'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Minimal', 'jankx'),
              value: 'minimal'
            }],
            onChange: value => setAttributes({
              closeButtonStyle: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            className: "color-picker-group",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Color', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
              type: "color",
              value: closeButtonColor === 'inherit' ? '#ffffff' : closeButtonColor,
              onChange: e => setAttributes({
                closeButtonColor: e.target.value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
              type: "button",
              className: "button button-small",
              onClick: () => setAttributes({
                closeButtonColor: 'inherit'
              }),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Inherit', 'jankx')
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      ...blockProps,
      children: renderSidebarPreview()
    })]
  });
}
function OffcanvasSidebarSave() {
  // For dynamic blocks with InnerBlocks, we need to save the InnerBlocks content
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, {});
}

// @ts-ignore
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  edit: OffcanvasSidebarEdit,
  save: OffcanvasSidebarSave
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map