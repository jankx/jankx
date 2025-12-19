"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/author-box/block.json": 
        /*!**************************************!*\
          !*** ./blocks/author-box/block.json ***!
          \**************************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/author-box","version":"1.0.0","title":"Author Box","category":"jankx","icon":"admin-users","keywords":["Author","Profile","Bio","Tác giả"],"supports":{"align":["wide","full"],"html":false,"color":{"background":true,"text":true,"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"spacing":{"margin":true,"padding":true,"blockGap":true,"__experimentalDefaultControls":{"margin":true,"padding":true}},"border":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"background":{"backgroundImage":true,"backgroundPosition":true,"backgroundRepeat":true,"backgroundSize":true,"__experimentalDefaultControls":{"backgroundImage":true}},"dimensions":{"minHeight":true},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true,"__experimentalDefaultControls":{"fontSize":true,"fontWeight":true}}},"description":"Hiển thị thông tin tác giả với avatar, tên, bio và social links.","attributes":{"authorId":{"type":"number","default":0},"showAvatar":{"type":"boolean","default":true},"avatarSize":{"type":"number","default":80},"showBio":{"type":"boolean","default":true},"showSocial":{"type":"boolean","default":true},"showPosts":{"type":"boolean","default":false},"postsCount":{"type":"number","default":3},"layout":{"type":"string","default":"horizontal"}},"textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');
            /***/ 
        }),
        /***/ "./blocks/author-box/src/edit.tsx": 
        /*!****************************************!*\
          !*** ./blocks/author-box/src/edit.tsx ***!
          \****************************************/
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
            /* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./blocks/author-box/src/editor.scss");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
            function Edit({ attributes, setAttributes }) {
                const { authorId, showAvatar, avatarSize, showBio, showSocial, showPosts, postsCount, layout } = attributes;
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
                    className: `wp-block-jankx-author-box layout-${layout}`
                });
                // Get current post author or current user
                const { author, posts } = (0, _wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
                    let currentAuthorId = authorId;
                    if (currentAuthorId === 0) {
                        // Try to get post author first
                        const post = select('core/editor')?.getCurrentPost();
                        if (post?.author) {
                            currentAuthorId = post.author;
                        }
                        else {
                            // Fallback to current user
                            currentAuthorId = select('core')?.getCurrentUser()?.id || 0;
                        }
                    }
                    const authorData = currentAuthorId ? select('core')?.getUser(currentAuthorId) : null;
                    // Get author posts if needed
                    const authorPosts = showPosts && currentAuthorId ? select('core')?.getEntityRecords('postType', 'post', {
                        author: currentAuthorId,
                        per_page: postsCount,
                        status: 'publish'
                    }) : [];
                    return {
                        author: authorData,
                        posts: authorPosts || []
                    };
                }, [authorId, showPosts, postsCount]);
                const layoutOptions = [{
                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Horizontal', 'jankx'),
                        value: 'horizontal'
                    }, {
                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Vertical', 'jankx'),
                        value: 'vertical'
                    }];
                if (!author) {
                    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                        ...blockProps,
                        children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Author Box Settings', 'jankx'),
                                    initialOpen: true,
                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
                                        value: layout,
                                        options: layoutOptions,
                                        onChange: value => setAttributes({
                                            layout: value
                                        })
                                    })
                                })
                            }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                                children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading author data...', 'jankx')
                            })]
                    });
                }
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                    ...blockProps,
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Author Box Settings', 'jankx'),
                                initialOpen: true,
                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
                                        value: layout,
                                        options: layoutOptions,
                                        onChange: value => setAttributes({
                                            layout: value
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Avatar', 'jankx'),
                                        checked: showAvatar,
                                        onChange: value => setAttributes({
                                            showAvatar: value
                                        })
                                    }), showAvatar && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Avatar Size (px)', 'jankx'),
                                        value: avatarSize,
                                        onChange: value => setAttributes({
                                            avatarSize: value
                                        }),
                                        min: 40,
                                        max: 200,
                                        step: 10
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Bio', 'jankx'),
                                        checked: showBio,
                                        onChange: value => setAttributes({
                                            showBio: value
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Social Links', 'jankx'),
                                        checked: showSocial,
                                        onChange: value => setAttributes({
                                            showSocial: value
                                        })
                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Recent Posts', 'jankx'),
                                        checked: showPosts,
                                        onChange: value => setAttributes({
                                            showPosts: value
                                        })
                                    }), showPosts && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                        label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of Posts', 'jankx'),
                                        value: postsCount,
                                        onChange: value => setAttributes({
                                            postsCount: value
                                        }),
                                        min: 1,
                                        max: 10,
                                        step: 1
                                    })]
                            })
                        }), showAvatar && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                            className: "author-avatar",
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
                                src: author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || '',
                                alt: author.name,
                                style: {
                                    width: avatarSize,
                                    height: avatarSize
                                }
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                            className: "author-info",
                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
                                    className: "author-name",
                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
                                        href: author.link || '#',
                                        children: author.name
                                    })
                                }), showBio && author.description && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                                    className: "author-bio",
                                    dangerouslySetInnerHTML: {
                                        __html: author.description
                                    }
                                }), showSocial && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                                    className: "author-social",
                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                                        style: {
                                            fontSize: '0.875rem',
                                            color: '#666'
                                        },
                                        children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Social links will appear here', 'jankx')
                                    })
                                }), showPosts && posts.length > 0 && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                    className: "author-posts",
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
                                            className: "posts-title",
                                            children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recent Posts', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("ul", {
                                            className: "posts-list",
                                            children: posts.map(post => /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("li", {
                                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
                                                    href: post.link,
                                                    children: post.title.rendered
                                                })
                                            }, post.id))
                                        })]
                                })]
                        })]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/author-box/src/editor.scss": 
        /*!*******************************************!*\
          !*** ./blocks/author-box/src/editor.scss ***!
          \*******************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            // extracted by mini-css-extract-plugin
            /***/ 
        }),
        /***/ "./blocks/author-box/src/style.scss": 
        /*!******************************************!*\
          !*** ./blocks/author-box/src/style.scss ***!
          \******************************************/
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
        /*!*****************************************!*\
          !*** ./blocks/author-box/src/index.tsx ***!
          \*****************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/author-box/src/style.scss");
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/author-box/src/edit.tsx");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../block.json */ "./blocks/author-box/block.json");
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
            edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
            save: () => null // Server-side rendering
        });
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
