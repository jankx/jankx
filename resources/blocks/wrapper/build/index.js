/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/wrapper/block.json":
/*!***********************************!*\
  !*** ./blocks/wrapper/block.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/wrapper","version":"1.0.0","title":"Wrapper","category":"design","description":"A layout wrapper block with advanced responsive controls.","providesContext":{"jankx/wrapperId":"anchor"},"attributes":{"paddingDesktop":{"type":"number"},"paddingTablet":{"type":"number"},"paddingMobile":{"type":"number"},"marginDesktop":{"type":"number"},"marginTablet":{"type":"number"},"marginMobile":{"type":"number"},"hideOnDesktop":{"type":"boolean","default":false},"hideOnTablet":{"type":"boolean","default":false},"hideOnMobile":{"type":"boolean","default":false},"tagName":{"type":"string","default":"div"},"maxWidth":{"type":"string"},"renderMode":{"type":"string","default":"dynamic"}},"supports":{"html":false,"anchor":true,"spacing":{"margin":false,"padding":false}},"editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css"}');

/***/ }),

/***/ "./blocks/wrapper/edit.tsx":
/*!*********************************!*\
  !*** ./blocks/wrapper/edit.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _js_components_jankx_inspector_JankxInspector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/components/jankx-inspector/JankxInspector */ "./js/components/jankx-inspector/JankxInspector.tsx");
/* harmony import */ var _js_components_jankx_inspector_ResponsiveControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../js/components/jankx-inspector/ResponsiveControl */ "./js/components/jankx-inspector/ResponsiveControl.tsx");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function Edit({
  attributes,
  setAttributes
}) {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: 'jankx-wrapper-block',
    style: {
      '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
      '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
      '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
      '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
      '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
      '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined
    }
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_js_components_jankx_inspector_JankxInspector__WEBPACK_IMPORTED_MODULE_0__.JankxInspector, {
        tabs: [{
          name: 'general',
          title: 'Layout'
        }, {
          name: 'responsive',
          title: 'Responsive'
        }, {
          name: 'advanced',
          title: 'Advanced'
        }],
        children: tab => {
          if (tab.name === 'general') {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
              title: "Basic Layout",
              initialOpen: true,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                label: "HTML Tag",
                value: attributes.tagName,
                options: [{
                  label: 'div',
                  value: 'div'
                }, {
                  label: 'section',
                  value: 'section'
                }, {
                  label: 'article',
                  value: 'article'
                }, {
                  label: 'aside',
                  value: 'aside'
                }, {
                  label: 'main',
                  value: 'main'
                }],
                onChange: tagName => setAttributes({
                  tagName
                })
              })
            });
          }
          if (tab.name === 'responsive') {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                title: "Padding",
                initialOpen: true,
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_js_components_jankx_inspector_ResponsiveControl__WEBPACK_IMPORTED_MODULE_1__.ResponsiveControl, {
                  label: "Inner Space",
                  children: device => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
                    value: device === 'desktop' ? attributes.paddingDesktop : device === 'tablet' ? attributes.paddingTablet : attributes.paddingMobile,
                    onChange: val => {
                      const key = device === 'desktop' ? 'paddingDesktop' : device === 'tablet' ? 'paddingTablet' : 'paddingMobile';
                      setAttributes({
                        [key]: val
                      });
                    },
                    min: 0,
                    max: 200
                  })
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                title: "Margin",
                initialOpen: false,
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_js_components_jankx_inspector_ResponsiveControl__WEBPACK_IMPORTED_MODULE_1__.ResponsiveControl, {
                  label: "Outer Space",
                  children: device => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
                    value: device === 'desktop' ? attributes.marginDesktop : device === 'tablet' ? attributes.marginTablet : attributes.marginMobile,
                    onChange: val => {
                      const key = device === 'desktop' ? 'marginDesktop' : device === 'tablet' ? 'marginTablet' : 'marginMobile';
                      setAttributes({
                        [key]: val
                      });
                    },
                    min: 0,
                    max: 200
                  })
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                title: "Visibility",
                initialOpen: false,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                  label: "Hide on Desktop",
                  checked: attributes.hideOnDesktop,
                  onChange: hideOnDesktop => setAttributes({
                    hideOnDesktop
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                  label: "Hide on Tablet",
                  checked: attributes.hideOnTablet,
                  onChange: hideOnTablet => setAttributes({
                    hideOnTablet
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                  label: "Hide on Mobile",
                  checked: attributes.hideOnMobile,
                  onChange: hideOnMobile => setAttributes({
                    hideOnMobile
                  })
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                title: "Utilities",
                initialOpen: false,
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                  label: "Render Mode",
                  value: attributes.renderMode,
                  options: [{
                    label: 'Dynamic (SSR)',
                    value: 'dynamic'
                  }, {
                    label: 'Static (CSR)',
                    value: 'static'
                  }],
                  onChange: renderMode => setAttributes({
                    renderMode
                  }),
                  help: "Choose how this block should be rendered."
                })
              })]
            });
          }
          return null;
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {})]
  });
}

/***/ }),

/***/ "./blocks/wrapper/save.tsx":
/*!*********************************!*\
  !*** ./blocks/wrapper/save.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
  const Tag = attributes.tagName || 'div';
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: ['has-jankx-responsive-wrapper', attributes.hideOnDesktop ? 'hide-on-desktop' : '', attributes.hideOnTablet ? 'hide-on-tablet' : '', attributes.hideOnMobile ? 'hide-on-mobile' : ''].filter(Boolean).join(' '),
    style: {
      '--jankx-padding-desktop': attributes.paddingDesktop ? `${attributes.paddingDesktop}px` : undefined,
      '--jankx-padding-tablet': attributes.paddingTablet ? `${attributes.paddingTablet}px` : undefined,
      '--jankx-padding-mobile': attributes.paddingMobile ? `${attributes.paddingMobile}px` : undefined,
      '--jankx-margin-desktop': attributes.marginDesktop ? `${attributes.marginDesktop}px` : undefined,
      '--jankx-margin-tablet': attributes.marginTablet ? `${attributes.marginTablet}px` : undefined,
      '--jankx-margin-mobile': attributes.marginMobile ? `${attributes.marginMobile}px` : undefined
    }
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Tag, {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./js/components/jankx-inspector/JankxInspector.tsx":
/*!**********************************************************!*\
  !*** ./js/components/jankx-inspector/JankxInspector.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JankxInspector: () => (/* binding */ JankxInspector),
/* harmony export */   useDevice: () => (/* binding */ useDevice)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const DeviceContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const useDevice = () => {
  const context = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider (JankxInspector)');
  }
  return context;
};
const JankxInspector = ({
  tabs = [],
  children
}) => {
  const [device, setDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('desktop');
  const defaultTabs = [{
    name: 'general',
    title: 'General',
    className: 'jankx-tab-general'
  }, {
    name: 'style',
    title: 'Style',
    className: 'jankx-tab-style'
  }, {
    name: 'responsive',
    title: 'Responsive',
    className: 'jankx-tab-responsive'
  }, {
    name: 'advanced',
    title: 'Advanced',
    className: 'jankx-tab-advanced'
  }];
  const activeTabs = tabs.length > 0 ? tabs : defaultTabs;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(DeviceContext.Provider, {
    value: {
      device,
      setDevice
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "jankx-inspector",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TabPanel, {
        className: "jankx-inspector-tabs",
        activeClass: "is-active",
        tabs: activeTabs,
        children: tab => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: `jankx-inspector-panel jankx-panel-${tab.name}`,
          children: children(tab)
        })
      })
    })
  });
};

/***/ }),

/***/ "./js/components/jankx-inspector/ResponsiveControl.tsx":
/*!*************************************************************!*\
  !*** ./js/components/jankx-inspector/ResponsiveControl.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveControl: () => (/* binding */ ResponsiveControl)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _JankxInspector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JankxInspector */ "./js/components/jankx-inspector/JankxInspector.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const ResponsiveControl = ({
  label,
  children,
  isRelated = true
}) => {
  const globalState = (0,_JankxInspector__WEBPACK_IMPORTED_MODULE_2__.useDevice)();
  const [localDevice, setLocalDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('desktop');
  const device = isRelated ? globalState.device : localDevice;
  const setDevice = isRelated ? globalState.setDevice : setLocalDevice;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "jankx-responsive-control",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "jankx-responsive-control__header",
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "jankx-responsive-control__label",
        style: {
          fontWeight: 500
        },
        children: label
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ButtonGroup, {
        className: "jankx-device-switcher",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          size: "small",
          variant: device === 'desktop' ? 'primary' : 'secondary',
          onClick: () => setDevice('desktop'),
          title: "Desktop",
          icon: "desktop"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          size: "small",
          variant: device === 'tablet' ? 'primary' : 'secondary',
          onClick: () => setDevice('tablet'),
          title: "Tablet",
          icon: "tablet"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          size: "small",
          variant: device === 'mobile' ? 'primary' : 'secondary',
          onClick: () => setDevice('mobile'),
          title: "Mobile",
          icon: "smartphone"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "jankx-responsive-control__content",
      children: children(device)
    })]
  });
};

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
/*!**********************************!*\
  !*** ./blocks/wrapper/index.tsx ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./blocks/wrapper/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./save */ "./blocks/wrapper/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/wrapper/block.json");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__);




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_1__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map