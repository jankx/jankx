"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/smart-breadcrumb/block.json": 
        /*!********************************************!*\
          !*** ./blocks/smart-breadcrumb/block.json ***!
          \********************************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/smart-breadcrumb","version":"1.0.0","title":"Smart Breadcrumb","category":"jankx","icon":"arrow-right-alt","keywords":["breadcrumb","navigation","seo","rankmath","yoast"],"supports":{"align":["wide","full"],"html":false,"color":{"background":true,"text":true,"gradients":true,"link":true},"spacing":{"margin":true,"padding":true,"blockGap":true},"border":{"color":true,"radius":true,"style":true,"width":true},"background":{"backgroundImage":true,"backgroundPosition":true,"backgroundRepeat":true,"backgroundSize":true},"dimensions":{"minHeight":true},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true}},"description":"Breadcrumb navigation tương thích với RankMath, Yoast SEO và các plugin SEO khác.","attributes":{"showHome":{"type":"boolean","default":true},"homeText":{"type":"string","default":"Trang chủ"},"separator":{"type":"string","default":"›"},"showCurrent":{"type":"boolean","default":true},"maxDepth":{"type":"integer","default":3},"stylePreset":{"type":"string","default":"default"},"useSeoPlugin":{"type":"boolean","default":true},"fallbackToCustom":{"type":"boolean","default":true}},"textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');
            /***/ 
        }),
        /***/ "./blocks/smart-breadcrumb/src/edit.js": 
        /*!*********************************************!*\
          !*** ./blocks/smart-breadcrumb/src/edit.js ***!
          \*********************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */Edit)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
            /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
            /* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
            /* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
            /* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_3__);
            /* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
            /* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__);
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
            /* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
            /* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
            /* harmony import */ var _style_presets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style-presets */ "./blocks/smart-breadcrumb/src/style-presets.js");
            /* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./editor.scss */ "./blocks/smart-breadcrumb/src/editor.scss");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
            function Edit({ attributes, setAttributes }) {
                const { showHome, homeText, separator, showCurrent, maxDepth, stylePreset, useSeoPlugin, fallbackToCustom } = attributes;
                // Get block props with core styling support
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
                    className: ['wp-block-jankx-smart-breadcrumb', stylePreset && stylePreset !== 'default' ? `breadcrumb-style-${stylePreset}` : ''].filter(Boolean).join(' ')
                });
                // Get the autoupdate option from WordPress php.
                const autoupdateOption = (0, _wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
                    const optionValue = select('core').getSite()?.jankx_autoupdate_enabled;
                    if (Number(optionValue) !== 1) {
                        return true;
                    }
                    return false;
                }, []);
                const { isSaving, isSavingNonPostChanges } = (0, _wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
                    const { isSavingPost, isSavingNonPostEntityChanges } = select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_3__.store);
                    return {
                        isSaving: isSavingPost(),
                        isSavingNonPostChanges: isSavingNonPostEntityChanges()
                    };
                });
                const advpanelicon = 'settings';
                const controls = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, {
                    group: "block"
                });
                const controlssidebar = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Panel, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Breadcrumb Settings', 'jankx'),
                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Home Link', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display home page link in breadcrumb', 'jankx'),
                                            checked: showHome,
                                            onChange: value => setAttributes({
                                                showHome: value
                                            })
                                        })
                                    }), showHome && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Home Text', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text for home page link', 'jankx'),
                                            value: homeText,
                                            onChange: value => setAttributes({
                                                homeText: value
                                            })
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Separator', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Character or symbol to separate breadcrumb items', 'jankx'),
                                            value: separator,
                                            onChange: value => setAttributes({
                                                separator: value
                                            })
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Current Page', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display current page title in breadcrumb', 'jankx'),
                                            checked: showCurrent,
                                            onChange: value => setAttributes({
                                                showCurrent: value
                                            })
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.RangeControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum Depth', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum number of breadcrumb levels to display', 'jankx'),
                                            value: maxDepth,
                                            onChange: value => setAttributes({
                                                maxDepth: value
                                            }),
                                            min: 1,
                                            max: 5
                                        })
                                    })]
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Panel, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('SEO Plugin Integration', 'jankx'),
                                icon: "admin-site",
                                initialOpen: false,
                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use SEO Plugin Breadcrumb', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Try to use breadcrumb from installed SEO plugins (RankMath, Yoast, etc.)', 'jankx'),
                                            checked: useSeoPlugin,
                                            onChange: value => setAttributes({
                                                useSeoPlugin: value
                                            })
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fallback to Custom Breadcrumb', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Generate custom breadcrumb if SEO plugin breadcrumb is not available', 'jankx'),
                                            checked: fallbackToCustom,
                                            onChange: value => setAttributes({
                                                fallbackToCustom: value
                                            })
                                        })
                                    })]
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Panel, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styles', 'jankx'),
                                icon: "admin-appearance",
                                initialOpen: false,
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelRow, {
                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.SelectControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Style Preset', 'jankx'),
                                        value: stylePreset,
                                        options: (0, _style_presets__WEBPACK_IMPORTED_MODULE_7__.getBreadcrumbStylePresetOptions)().map(option => ({
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(option.label, 'jankx'),
                                            value: option.value
                                        })),
                                        onChange: value => setAttributes({
                                            stylePreset: value
                                        })
                                    })
                                })
                            })
                        })]
                });
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
                    ...blockProps,
                    children: [controls, controlssidebar, autoupdateOption && (isSaving || isSavingNonPostChanges) ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Spinner, {}) : /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4___default()), {
                            block: "jankx/smart-breadcrumb",
                            attributes: attributes
                        })]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/smart-breadcrumb/src/editor.scss": 
        /*!*************************************************!*\
          !*** ./blocks/smart-breadcrumb/src/editor.scss ***!
          \*************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            // extracted by mini-css-extract-plugin
            /***/ 
        }),
        /***/ "./blocks/smart-breadcrumb/src/save.js": 
        /*!*********************************************!*\
          !*** ./blocks/smart-breadcrumb/src/save.js ***!
          \*********************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */save)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
            function save() {
                // This block uses server-side rendering, so we don't need to save any content
                // The content will be generated dynamically on the frontend
                return null;
            }
            /***/ 
        }),
        /***/ "./blocks/smart-breadcrumb/src/style-presets.js": 
        /*!******************************************************!*\
          !*** ./blocks/smart-breadcrumb/src/style-presets.js ***!
          \******************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ BREADCRUMB_STYLE_PRESETS: () => ( /* binding */BREADCRUMB_STYLE_PRESETS),
                /* harmony export */ getBreadcrumbStylePresetOptions: () => ( /* binding */getBreadcrumbStylePresetOptions)
                /* harmony export */ 
            });
            /**
             * Style Presets for the Smart Breadcrumb Block.
             *
             * To add a new style preset:
             * 1. Add the preset object to the BREADCRUMB_STYLE_PRESETS array
             * 2. Add the corresponding CSS in style.css and editor.scss
             * 3. The preset will automatically appear in the editor dropdown
             */
            const BREADCRUMB_STYLE_PRESETS = [{
                    value: 'default',
                    label: 'Default',
                    description: 'Simple breadcrumb with default styling',
                    preview: {
                        separator: '›',
                        textColor: 'inherit'
                    }
                }, {
                    value: 'minimal',
                    label: 'Minimal',
                    description: 'Clean minimal breadcrumb without decoration',
                    preview: {
                        separator: '/',
                        textColor: '#666'
                    }
                }, {
                    value: 'modern',
                    label: 'Modern',
                    description: 'Modern breadcrumb with hover effects',
                    preview: {
                        separator: '→',
                        textColor: '#0073aa'
                    }
                }, {
                    value: 'boxed',
                    label: 'Boxed',
                    description: 'Breadcrumb items with box background',
                    preview: {
                        separator: '',
                        backgroundColor: '#f5f5f5'
                    }
                }, {
                    value: 'underlined',
                    label: 'Underlined',
                    description: 'Links with underline decoration',
                    preview: {
                        separator: '›',
                        textColor: '#0073aa'
                    }
                }, {
                    value: 'badge',
                    label: 'Badge',
                    description: 'Breadcrumb items as badges',
                    preview: {
                        separator: '',
                        backgroundColor: '#0073aa',
                        textColor: '#ffffff'
                    }
                }];
            function getBreadcrumbStylePresetOptions() {
                return BREADCRUMB_STYLE_PRESETS;
            }
            /***/ 
        }),
        /***/ "./blocks/smart-breadcrumb/src/style.scss": 
        /*!************************************************!*\
          !*** ./blocks/smart-breadcrumb/src/style.scss ***!
          \************************************************/
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
        /***/ "@wordpress/data": 
        /*!******************************!*\
          !*** external ["wp","data"] ***!
          \******************************/
        /***/ ((module) => {
            module.exports = window["wp"]["data"];
            /***/ 
        }),
        /***/ "@wordpress/editor": 
        /*!********************************!*\
          !*** external ["wp","editor"] ***!
          \********************************/
        /***/ ((module) => {
            module.exports = window["wp"]["editor"];
            /***/ 
        }),
        /***/ "@wordpress/element": 
        /*!*********************************!*\
          !*** external ["wp","element"] ***!
          \*********************************/
        /***/ ((module) => {
            module.exports = window["wp"]["element"];
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
        /***/ "@wordpress/server-side-render": 
        /*!******************************************!*\
          !*** external ["wp","serverSideRender"] ***!
          \******************************************/
        /***/ ((module) => {
            module.exports = window["wp"]["serverSideRender"];
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
        /*!**********************************************!*\
          !*** ./blocks/smart-breadcrumb/src/index.js ***!
          \**********************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/smart-breadcrumb/src/style.scss");
        /* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./blocks/smart-breadcrumb/src/editor.scss");
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/smart-breadcrumb/src/edit.js");
        /* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/smart-breadcrumb/src/save.js");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../block.json */ "./blocks/smart-breadcrumb/block.json");
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
            edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
            save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
        });
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
