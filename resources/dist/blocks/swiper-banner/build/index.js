"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/swiper-banner/block.json": 
        /*!*****************************************!*\
          !*** ./blocks/swiper-banner/block.json ***!
          \*****************************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/swiper-banner","title":"Swiper Banner","category":"jankx","description":"Banner slide for Swiper with customizable styles and links","keywords":["banner","slide","swiper","image","link"],"textdomain":"jankx","parent":["jankx/swiper"],"attributes":{"imageId":{"type":"number","default":0},"imageUrl":{"type":"string","default":""},"imageAlt":{"type":"string","default":""},"imageCaption":{"type":"string","default":""},"linkUrl":{"type":"string","default":""},"linkTarget":{"type":"string","enum":["_self","_blank"],"default":"_self"},"bannerStyle":{"type":"string","enum":["banner","circles","square"],"default":"banner"},"overlayOpacity":{"type":"number","default":0.3},"overlayColor":{"type":"string","default":"#000000"},"textAlign":{"type":"string","enum":["left","center","right"],"default":"center"},"textPosition":{"type":"string","enum":["top","middle","bottom"],"default":"middle"},"showCaption":{"type":"boolean","default":true},"height":{"type":"number","default":0},"imageSize":{"type":"string","enum":["contain","cover","fullwidth"],"default":"cover"},"className":{"type":"string"}},"supports":{"html":false,"anchor":true,"spacing":{"margin":true,"padding":true},"color":{"background":true,"text":true},"border":{"color":true,"radius":true,"style":true,"width":true}},"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');
            /***/ 
        }),
        /***/ "./blocks/swiper-banner/edit.tsx": 
        /*!***************************************!*\
          !*** ./blocks/swiper-banner/edit.tsx ***!
          \***************************************/
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
            function Edit({ attributes, setAttributes }) {
                const { imageId, imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, height = 0, imageSize = 'cover' } = attributes;
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
                    className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
                });
                const onSelectImage = media => {
                    setAttributes({
                        imageId: media.id,
                        imageUrl: media.url,
                        imageAlt: media.alt || '',
                        imageCaption: media.caption || ''
                    });
                };
                const removeImage = () => {
                    setAttributes({
                        imageId: 0,
                        imageUrl: '',
                        imageAlt: '',
                        imageCaption: ''
                    });
                };
                const renderImage = () => {
                    if (!imageUrl) {
                        return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
                            icon: "format-image",
                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Swiper Banner', 'jankx'),
                            instructions: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select an image to create a banner slide', 'jankx'),
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                                    onSelect: onSelectImage,
                                    allowedTypes: ['image'],
                                    value: imageId,
                                    render: ({ open }) => /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                                        variant: "primary",
                                        onClick: open,
                                        children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Image', 'jankx')
                                    })
                                })
                            })
                        });
                    }
                    const imageStyles = {
                        backgroundImage: `url(${imageUrl})`,
                        '--overlay-color': overlayColor,
                        '--overlay-opacity': overlayOpacity
                    };
                    // Apply fullwidth styles
                    if (imageSize === 'fullwidth') {
                        imageStyles.backgroundSize = '100% 100%';
                        imageStyles.backgroundPosition = 'center';
                    }
                    else if (imageSize === 'contain') {
                        imageStyles.backgroundSize = 'contain';
                    }
                    else {
                        imageStyles.backgroundSize = 'cover';
                    }
                    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                        className: `swiper-banner__image image-size-${imageSize}`,
                        style: imageStyles,
                        children: showCaption && imageCaption && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                            className: "swiper-banner__caption",
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
                                className: "swiper-banner__caption-content",
                                children: imageCaption
                            })
                        })
                    });
                };
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                    ...blockProps,
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Settings', 'jankx'),
                                    initialOpen: true,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
                                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                                                onSelect: onSelectImage,
                                                allowedTypes: ['image'],
                                                value: imageId,
                                                render: ({ open }) => /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                                                    variant: "secondary",
                                                    onClick: open,
                                                    style: {
                                                        width: '100%',
                                                        marginBottom: '10px'
                                                    },
                                                    children: imageUrl ? (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Image', 'jankx') : (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Image', 'jankx')
                                                })
                                            })
                                        }), imageUrl && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                                            variant: "link",
                                            isDestructive: true,
                                            onClick: removeImage,
                                            style: {
                                                width: '100%'
                                            },
                                            children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Image', 'jankx')
                                        }), imageUrl && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
                                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Size', 'jankx'),
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
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Alt Text', 'jankx'),
                                                    value: imageAlt,
                                                    onChange: val => setAttributes({
                                                        imageAlt: val
                                                    }),
                                                    help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Describe the image for accessibility', 'jankx')
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Caption', 'jankx'),
                                                    value: imageCaption,
                                                    onChange: val => setAttributes({
                                                        imageCaption: val
                                                    }),
                                                    help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text to display over the image', 'jankx')
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Caption', 'jankx'),
                                                    checked: showCaption,
                                                    onChange: val => setAttributes({
                                                        showCaption: val
                                                    })
                                                })]
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link URL', 'jankx'),
                                            value: linkUrl,
                                            onChange: val => setAttributes({
                                                linkUrl: val
                                            }),
                                            placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('https://example.com', 'jankx'),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Optional link for the banner', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Target', 'jankx'),
                                            value: linkTarget,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Same Window', 'jankx'),
                                                    value: '_self'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('New Window', 'jankx'),
                                                    value: '_blank'
                                                }],
                                            onChange: val => setAttributes({
                                                linkTarget: val
                                            })
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Style Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Banner Style', 'jankx'),
                                            value: bannerStyle,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Banner', 'jankx'),
                                                    value: 'banner'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Circles', 'jankx'),
                                                    value: 'circles'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Square', 'jankx'),
                                                    value: 'square'
                                                }],
                                            onChange: val => setAttributes({
                                                bannerStyle: val
                                            })
                                        }), bannerStyle === 'circles' && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Height (px)', 'jankx'),
                                            value: height || 0,
                                            onChange: val => setAttributes({
                                                height: val || 0
                                            }),
                                            min: 50,
                                            max: 1000,
                                            step: 10,
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set height for circle banner. Width will automatically match height.', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text Alignment', 'jankx'),
                                            value: textAlign,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'jankx'),
                                                    value: 'left'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Center', 'jankx'),
                                                    value: 'center'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'jankx'),
                                                    value: 'right'
                                                }],
                                            onChange: val => setAttributes({
                                                textAlign: val
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text Position', 'jankx'),
                                            value: textPosition,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top', 'jankx'),
                                                    value: 'top'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Middle', 'jankx'),
                                                    value: 'middle'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom', 'jankx'),
                                                    value: 'bottom'
                                                }],
                                            onChange: val => setAttributes({
                                                textPosition: val
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Opacity', 'jankx'),
                                            value: overlayOpacity,
                                            onChange: val => setAttributes({
                                                overlayOpacity: val
                                            }),
                                            min: 0,
                                            max: 1,
                                            step: 0.1,
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Darkness of overlay over image', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
                                                    children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Color', 'jankx')
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                                                    color: overlayColor,
                                                    onChange: val => setAttributes({
                                                        overlayColor: val
                                                    }),
                                                    disableAlpha: false
                                                })]
                                        })]
                                })]
                        }), renderImage()]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/swiper-banner/editor.scss": 
        /*!******************************************!*\
          !*** ./blocks/swiper-banner/editor.scss ***!
          \******************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            // extracted by mini-css-extract-plugin
            /***/ 
        }),
        /***/ "./blocks/swiper-banner/save.tsx": 
        /*!***************************************!*\
          !*** ./blocks/swiper-banner/save.tsx ***!
          \***************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */Save)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
            /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
            function Save({ attributes }) {
                const { imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, imageSize = 'cover' } = attributes;
                const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
                    className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`,
                    'data-image-size': imageSize
                });
                const imageStyles = {
                    backgroundImage: `url(${imageUrl})`,
                    '--overlay-color': overlayColor,
                    '--overlay-opacity': overlayOpacity
                };
                // Apply fullwidth styles
                if (imageSize === 'fullwidth') {
                    imageStyles.backgroundSize = '100% 100%';
                    imageStyles.backgroundPosition = 'center';
                }
                else if (imageSize === 'contain') {
                    imageStyles.backgroundSize = 'contain';
                }
                else {
                    imageStyles.backgroundSize = 'cover';
                }
                const content = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    className: `swiper-banner__image image-size-${imageSize}`,
                    style: imageStyles,
                    children: showCaption && imageCaption && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                        className: "swiper-banner__caption",
                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                            className: "swiper-banner__caption-content",
                            children: imageCaption
                        })
                    })
                });
                if (linkUrl) {
                    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                        ...blockProps,
                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
                            href: linkUrl,
                            target: linkTarget,
                            rel: linkTarget === '_blank' ? 'noopener noreferrer' : undefined,
                            className: "swiper-banner__link",
                            children: content
                        })
                    });
                }
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                    ...blockProps,
                    children: content
                });
            }
            /***/ 
        }),
        /***/ "./blocks/swiper-banner/style.scss": 
        /*!*****************************************!*\
          !*** ./blocks/swiper-banner/style.scss ***!
          \*****************************************/
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
        /*!****************************************!*\
          !*** ./blocks/swiper-banner/index.tsx ***!
          \****************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
        /* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/swiper-banner/edit.tsx");
        /* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/swiper-banner/save.tsx");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/swiper-banner/block.json");
        /* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./blocks/swiper-banner/style.scss");
        /* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./blocks/swiper-banner/editor.scss");
        /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
        /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
            ..._block_json__WEBPACK_IMPORTED_MODULE_4__,
            edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
            save: _save__WEBPACK_IMPORTED_MODULE_3__["default"],
            // Migration to remove .swiper-banner__content wrapper from old blocks
            migrate: (attributes, innerBlocks) => {
                return [attributes, innerBlocks];
            },
            // Deprecated version to handle old HTML structure with .swiper-banner__content
            deprecated: [{
                    attributes: _block_json__WEBPACK_IMPORTED_MODULE_4__.attributes,
                    save: ({ attributes }) => {
                        // OLD save function that included .swiper-banner__content wrapper
                        // This matches the old HTML structure in database
                        const { imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, imageSize = 'cover' } = attributes;
                        const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
                            className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
                        });
                        const imageStyles = {
                            backgroundImage: `url(${imageUrl})`,
                            '--overlay-color': overlayColor,
                            '--overlay-opacity': overlayOpacity
                        };
                        if (imageSize === 'fullwidth') {
                            imageStyles.backgroundSize = '100% 100%';
                            imageStyles.backgroundPosition = 'center';
                        }
                        else if (imageSize === 'contain') {
                            imageStyles.backgroundSize = 'contain';
                        }
                        else {
                            imageStyles.backgroundSize = 'cover';
                        }
                        const imageContent = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                            className: `swiper-banner__image image-size-${imageSize}`,
                            style: imageStyles,
                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                                    className: "swiper-banner__overlay"
                                }), showCaption && imageCaption && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                                    className: "swiper-banner__caption",
                                    children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                                        className: "swiper-banner__caption-content",
                                        children: imageCaption
                                    })
                                })]
                        });
                        // OLD structure with .swiper-banner__content wrapper
                        const content = /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                            className: "swiper-banner__content",
                            children: imageContent
                        });
                        if (linkUrl) {
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                                ...blockProps,
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("a", {
                                    href: linkUrl,
                                    target: linkTarget,
                                    rel: linkTarget === '_blank' ? 'noopener noreferrer' : undefined,
                                    className: "swiper-banner__link",
                                    children: content
                                })
                            });
                        }
                        return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                            ...blockProps,
                            children: content
                        });
                    },
                    // Migration function: attributes stay the same, WordPress will use new save function
                    migrate: attributes => {
                        return attributes;
                    }
                }]
        });
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
