"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/swiper-slide/block.json": 
        /*!****************************************!*\
          !*** ./blocks/swiper-slide/block.json ***!
          \****************************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/swiper-slide","title":"Swiper Slide","category":"jankx","description":"Single slide for Swiper slider","keywords":["slide","swiper"],"textdomain":"jankx","parent":["jankx/swiper"],"attributes":{"slideId":{"type":"string"},"imageSize":{"type":"string","enum":["contain","cover","fullwidth"],"default":"cover"}},"supports":{"html":false,"reusable":false,"spacing":{"margin":false,"padding":true},"color":{"background":true,"text":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true,"backgroundPosition":true,"backgroundRepeat":true,"__experimentalDefaultControls":{"backgroundImage":true}},"dimensions":{"minHeight":true}},"usesContext":["jankx/swiperId"],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');
            /***/ 
        }),
        /***/ "./blocks/swiper-slide/edit.tsx": 
        /*!**************************************!*\
          !*** ./blocks/swiper-slide/edit.tsx ***!
          \**************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */Edit)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
            /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
            function Edit({ attributes, setAttributes, clientId }) {
                const { imageSize = 'cover' } = attributes;
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
                    className: `swiper-slide image-size-${imageSize}`,
                    'data-image-size': imageSize
                });
                const innerBlocksProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)(blockProps, {
                    templateLock: false
                });
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Settings', 'jankx'),
                                initialOpen: false,
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background Image Size', 'jankx'),
                                    value: imageSize,
                                    options: [{
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cover', 'jankx'),
                                            value: 'cover'
                                        }, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Contain', 'jankx'),
                                            value: 'contain'
                                        }, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fullwidth', 'jankx'),
                                            value: 'fullwidth'
                                        }],
                                    onChange: val => setAttributes({
                                        imageSize: val
                                    }),
                                    help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx')
                                })
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                            ...innerBlocksProps
                        })]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/swiper-slide/editor.scss": 
        /*!*****************************************!*\
          !*** ./blocks/swiper-slide/editor.scss ***!
          \*****************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            // extracted by mini-css-extract-plugin
            /***/ 
        }),
        /***/ "./blocks/swiper-slide/style.scss": 
        /*!****************************************!*\
          !*** ./blocks/swiper-slide/style.scss ***!
          \****************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            // extracted by mini-css-extract-plugin
            /***/ 
        }),
        /***/ "@wordpress/block-editor": 
        /*!*************************************!*\
          !*** external ["wp","blockEditor"] ***!
          \*************************************/
        /***/ ((module) => {
            module.exports = window["wp"]["blockEditor"];
            /***/ 
        }),
        /***/ "@wordpress/blocks": 
        /*!********************************!*\
          !*** external ["wp","blocks"] ***!
          \********************************/
        /***/ ((module) => {
            module.exports = window["wp"]["blocks"];
            /***/ 
        }),
        /***/ "@wordpress/components": 
        /*!************************************!*\
          !*** external ["wp","components"] ***!
          \************************************/
        /***/ ((module) => {
            module.exports = window["wp"]["components"];
            /***/ 
        }),
        /***/ "@wordpress/i18n": 
        /*!******************************!*\
          !*** external ["wp","i18n"] ***!
          \******************************/
        /***/ ((module) => {
            module.exports = window["wp"]["i18n"];
            /***/ 
        }),
        /***/ "react/jsx-runtime": 
        /*!**********************************!*\
          !*** external "ReactJSXRuntime" ***!
          \**********************************/
        /***/ ((module) => {
            module.exports = window["ReactJSXRuntime"];
            /***/ 
        })
        /******/ 
    });
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/ }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/ 
        };
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/ 
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/ (() => {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = (module) => {
            /******/ var getter = module && module.__esModule ?
                /******/ () => (module['default']) :
                /******/ () => (module);
            /******/ __webpack_require__.d(getter, { a: getter });
            /******/ return getter;
            /******/ 
        };
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/ (() => {
        /******/ // define getter functions for harmony exports
        /******/ __webpack_require__.d = (exports, definition) => {
            /******/ for (var key in definition) {
                /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    /******/ }
                /******/ }
            /******/ 
        };
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ (() => {
        /******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
        /******/ 
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ (() => {
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = (exports) => {
            /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/ }
            /******/ Object.defineProperty(exports, '__esModule', { value: true });
            /******/ 
        };
        /******/ 
    })();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
    (() => {
        /*!***************************************!*\
          !*** ./blocks/swiper-slide/index.tsx ***!
          \***************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
        /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/swiper-slide/edit.tsx");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./blocks/swiper-slide/block.json");
        /* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./blocks/swiper-slide/style.scss");
        /* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./blocks/swiper-slide/editor.scss");
        /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
        /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
            ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
            edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
            save: ({ attributes }) => {
                const { imageSize = 'cover' } = attributes;
                const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
                    className: `swiper-slide image-size-${imageSize}`,
                    'data-image-size': imageSize
                });
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                    ...blockProps,
                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
                });
            }
        });
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
