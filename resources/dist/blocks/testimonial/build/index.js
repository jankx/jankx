"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/testimonial/block.json": 
        /*!***************************************!*\
          !*** ./blocks/testimonial/block.json ***!
          \***************************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/testimonial","version":"1.0.0","title":"Testimonial","category":"jankx","icon":"testimonial","description":"Một testimonial item độc lập, tuỳ chỉnh nội dung và kiểu hiển thị bằng PHP","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","usesContext":["asSlide","layoutType"],"supports":{"html":false,"anchor":true,"spacing":{"margin":true,"padding":true},"color":{"background":true,"text":true},"typography":{"fontSize":true,"lineHeight":true}},"attributes":{"author":{"type":"string","default":""},"role":{"type":"string","default":""},"company":{"type":"string","default":""},"date":{"type":"string","default":""},"rating":{"type":"number","default":0},"excerpt":{"type":"string","default":""},"avatarId":{"type":"number","default":0},"link":{"type":"string","default":""}},"example":{"attributes":{"author":"Customer Name","role":"CTO","company":"Awesome Inc","rating":5,"excerpt":"Sản phẩm tuyệt vời, dịch vụ nhanh!"}}}');
            /***/ 
        }),
        /***/ "./blocks/testimonial/edit.tsx": 
        /*!*************************************!*\
          !*** ./blocks/testimonial/edit.tsx ***!
          \*************************************/
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
            /* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
            /* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
            function Edit({ attributes, setAttributes, context }) {
                const { author, role, company, date, rating, excerpt, avatarId, link, className } = attributes;
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
                    className: `jankx-testimonial-editor ${className || ''}`.trim()
                });
                const media = (0, _wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => avatarId ? select('core').getMedia(avatarId) : null, [avatarId]);
                const asSlide = !!(context && context.asSlide);
                const itemClasses = `testimonial-item${asSlide ? ' swiper-slide' : ''}`;
                const stars = '★'.repeat(Math.min(rating || 0, 5)) + '☆'.repeat(Math.max(0, 5 - Math.min(rating || 0, 5)));
                const metaParts = [role || '', company || ''].filter(Boolean);
                const meta = metaParts.length ? metaParts.join(' • ') : '';
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                    ...blockProps,
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Testimonial', 'jankx'),
                                initialOpen: true,
                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Author', 'jankx'),
                                        value: author || '',
                                        onChange: v => setAttributes({
                                            author: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Role', 'jankx'),
                                        value: role || '',
                                        onChange: v => setAttributes({
                                            role: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Company', 'jankx'),
                                        value: company || '',
                                        onChange: v => setAttributes({
                                            company: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
                                        value: date || '',
                                        onChange: v => setAttributes({
                                            date: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating', 'jankx'),
                                        value: rating || 0,
                                        min: 0,
                                        max: 5,
                                        onChange: v => setAttributes({
                                            rating: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link', 'jankx'),
                                        value: link || '',
                                        onChange: v => setAttributes({
                                            link: v
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                                            onSelect: media => setAttributes({
                                                avatarId: media?.id || 0
                                            }),
                                            allowedTypes: ['image'],
                                            value: avatarId || 0,
                                            render: ({ open }) => /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                                                variant: "primary",
                                                onClick: open,
                                                children: avatarId ? (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Avatar', 'jankx') : (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Avatar', 'jankx')
                                            })
                                        })
                                    })]
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                            className: itemClasses,
                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                                    className: "testimonial-header",
                                    children: [avatarId && media?.source_url ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                            className: "testimonial-avatar",
                                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
                                                className: "avatar",
                                                src: media.source_url,
                                                alt: media.alt_text || ''
                                            })
                                        }) : null, /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                                            className: "testimonial-info",
                                            children: [author ? link ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                                                    className: "testimonial-link",
                                                    href: link,
                                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                                        className: "testimonial-author",
                                                        children: author
                                                    })
                                                }) : /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                                    className: "testimonial-author",
                                                    children: author
                                                }) : null, rating ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                                    className: "testimonial-rating",
                                                    "aria-label": `${rating}/5`,
                                                    children: stars
                                                }) : null]
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                                    className: "testimonial-body",
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                            className: "testimonial-quote-icon",
                                            children: "\u201C"
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                                            tagName: "div",
                                            className: "testimonial-content",
                                            value: excerpt || '',
                                            placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nội dung testimonial...', 'jankx'),
                                            onChange: v => setAttributes({
                                                excerpt: v
                                            })
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                                    className: "testimonial-footer",
                                    children: [meta ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                            className: "testimonial-meta",
                                            children: meta
                                        }) : null, date ? /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                                            className: "testimonial-date",
                                            children: date
                                        }) : null]
                                })]
                        })]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/testimonial/style.scss": 
        /*!***************************************!*\
          !*** ./blocks/testimonial/style.scss ***!
          \***************************************/
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
        /*!**************************************!*\
          !*** ./blocks/testimonial/index.tsx ***!
          \**************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/testimonial/edit.tsx");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/testimonial/block.json");
        /* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./blocks/testimonial/style.scss");
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
            ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
            edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
            save: () => null
        });
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
