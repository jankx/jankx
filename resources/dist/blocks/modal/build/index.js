"use strict";
/******/ (() => {
    /******/ "use strict";
    /******/ var __webpack_modules__ = ({
        /***/ "./blocks/modal/block.json": 
        /*!*********************************!*\
          !*** ./blocks/modal/block.json ***!
          \*********************************/
        /***/ ((module) => {
            module.exports = /*#__PURE__*/ JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/modal","title":"Modal","category":"jankx","description":"A modal block with trigger and content areas. Supports inner blocks and custom selectors.","keywords":["modal","popup","overlay","trigger","inner blocks"],"textdomain":"jankx","attributes":{"align":{"type":"string","default":"center"},"modalId":{"type":"string","default":""},"triggerType":{"type":"string","default":"button","enum":["button","anchor","custom"]},"triggerText":{"type":"string","default":"Open Modal"},"triggerUrl":{"type":"string","default":""},"triggerTarget":{"type":"string","default":"_self"},"customSelector":{"type":"string","default":""},"modalSize":{"type":"string","default":"medium","enum":["small","medium","large","fullscreen","custom"]},"customWidth":{"type":"number","default":600},"customWidthUnit":{"type":"string","default":"px","enum":["px","%","rem","em","vw"]},"closeOnOverlayClick":{"type":"boolean","default":true},"closeOnEscape":{"type":"boolean","default":true},"showCloseButton":{"type":"boolean","default":true},"animationType":{"type":"string","default":"fade","enum":["fade","slide","zoom","none"]},"animationDuration":{"type":"number","default":300},"backdropColor":{"type":"string","default":"rgba(0, 0, 0, 0.5)"},"backdropBlur":{"type":"boolean","default":false},"zIndex":{"type":"number","default":999999},"disableScroll":{"type":"boolean","default":true},"disableFocus":{"type":"boolean","default":false},"awaitOpenAnimation":{"type":"boolean","default":false},"awaitCloseAnimation":{"type":"boolean","default":false}},"supports":{"anchor":true,"align":["left","center","right","wide","full"],"alignWide":true,"html":false,"innerBlocks":true,"reusable":false,"interactivity":{"clientNavigation":true},"color":{"text":false,"background":false,"gradients":true,"__experimentalSkipSerialization":true},"spacing":{"margin":true,"padding":true,"__experimentalDefaultControls":{"margin":true,"padding":true}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"shadow":{"__experimentalSkipSerialization":true}},"selectors":{"border":".wp-block-jankx-modal__content","shadow":".wp-block-jankx-modal__content"},"styles":[{"name":"default","label":"Default","isDefault":true},{"name":"centered","label":"Centered"},{"name":"fullscreen","label":"Fullscreen"},{"name":"minimal","label":"Minimal"}],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","viewScript":"file:./build/view.js"}');
            /***/ 
        }),
        /***/ "./blocks/modal/edit.js": 
        /*!******************************!*\
          !*** ./blocks/modal/edit.js ***!
          \******************************/
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
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
            /* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
            /* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/desktop.js");
            /* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/fullscreen.js");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
            /**
             * WordPress dependencies
             */
            /**
             * Edit component for Modal block
             */
            function Edit({ attributes, setAttributes, clientId }) {
                const { modalId, triggerType, triggerText, triggerUrl, triggerTarget, customSelector, modalSize, customWidth, customWidthUnit, closeOnOverlayClick, closeOnEscape, showCloseButton, animationType, animationDuration, backdropColor, backdropBlur, zIndex, disableScroll, disableFocus, awaitOpenAnimation, awaitCloseAnimation } = attributes;
                const [isPreviewMode, setIsPreviewMode] = (0, _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(true); // Default to true so users can edit content
                const [generatedId, setGeneratedId] = (0, _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
                // Generate unique ID if not set
                (0, _wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
                    if (!modalId) {
                        const newId = `modal-${clientId}`;
                        setGeneratedId(newId);
                        setAttributes({
                            modalId: newId
                        });
                    }
                    else {
                        setGeneratedId(modalId);
                    }
                }, [modalId, clientId, setAttributes]);
                const blockProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
                    className: `wp-block-jankx-modal-wrapper ${isPreviewMode ? 'modal-preview' : ''}`,
                    'data-modal-id': generatedId,
                    'data-close-on-overlay-click': closeOnOverlayClick,
                    'data-close-on-escape': closeOnEscape,
                    'data-animation-type': animationType,
                    'data-backdrop-blur': backdropBlur,
                    style: modalSize === 'custom' ? {
                        '--modal-custom-width': `${customWidth}${customWidthUnit}`
                    } : {}
                });
                const innerBlocksProps = (0, _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useInnerBlocksProps)({
                    className: 'wp-block-jankx-modal__inner'
                }, {
                    // Accept ALL blocks - no restrictions
                    template: [['core/heading', {
                                level: 3,
                                placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal Title', 'jankx')
                            }], ['core/paragraph', {
                                placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add your modal content here...', 'jankx')
                            }]],
                    templateLock: false
                });
                const renderTrigger = () => {
                    switch (triggerType) {
                        case 'button':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
                                type: "button",
                                className: "wp-block-jankx-modal__trigger",
                                onClick: () => setIsPreviewMode(!isPreviewMode),
                                children: triggerText || (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open Modal', 'jankx')
                            });
                        case 'anchor':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
                                href: triggerUrl || '#',
                                className: "wp-block-jankx-modal__trigger",
                                target: triggerTarget,
                                onClick: e => {
                                    e.preventDefault();
                                    setIsPreviewMode(!isPreviewMode);
                                },
                                children: triggerText || (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open Modal', 'jankx')
                            });
                        case 'custom':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                className: "wp-block-jankx-modal__custom-trigger",
                                children: customSelector || (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Selector', 'jankx')
                            });
                        default:
                            return null;
                    }
                };
                // Removed preview modal - just show content directly in editor
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, {
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, {
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
                                    icon: isPreviewMode ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
                                    label: isPreviewMode ? (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide Preview', 'jankx') : (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Preview', 'jankx'),
                                    onClick: () => setIsPreviewMode(!isPreviewMode)
                                })
                            })
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trigger Settings', 'jankx'),
                                    initialOpen: true,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trigger Type', 'jankx'),
                                            value: triggerType,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button', 'jankx'),
                                                    value: 'button'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link', 'jankx'),
                                                    value: 'anchor'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Selector', 'jankx'),
                                                    value: 'custom'
                                                }],
                                            onChange: value => setAttributes({
                                                triggerType: value
                                            })
                                        }), triggerType === 'button' && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button Text', 'jankx'),
                                            value: triggerText,
                                            onChange: value => setAttributes({
                                                triggerText: value
                                            }),
                                            placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open Modal', 'jankx')
                                        }), triggerType === 'anchor' && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Text', 'jankx'),
                                                    value: triggerText,
                                                    onChange: value => setAttributes({
                                                        triggerText: value
                                                    }),
                                                    placeholder: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open Modal', 'jankx')
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link URL', 'jankx'),
                                                    value: triggerUrl,
                                                    onChange: value => setAttributes({
                                                        triggerUrl: value
                                                    }),
                                                    placeholder: "#"
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Target', 'jankx'),
                                                    value: triggerTarget,
                                                    options: [{
                                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Same Window', 'jankx'),
                                                            value: '_self'
                                                        }, {
                                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('New Window', 'jankx'),
                                                            value: '_blank'
                                                        }],
                                                    onChange: value => setAttributes({
                                                        triggerTarget: value
                                                    })
                                                })]
                                        }), triggerType === 'custom' && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Selector', 'jankx'),
                                            value: customSelector,
                                            onChange: value => setAttributes({
                                                customSelector: value
                                            }),
                                            placeholder: ".my-trigger, #my-button",
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CSS selector for elements that should trigger the modal', 'jankx')
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal ID', 'jankx'),
                                            value: modalId,
                                            onChange: value => setAttributes({
                                                modalId: value
                                            }),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unique identifier for the modal. Leave empty to auto-generate.', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal Size', 'jankx'),
                                            value: modalSize,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Small (400px)', 'jankx'),
                                                    value: 'small'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Medium (600px)', 'jankx'),
                                                    value: 'medium'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Large (800px)', 'jankx'),
                                                    value: 'large'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fullscreen', 'jankx'),
                                                    value: 'fullscreen'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Width', 'jankx'),
                                                    value: 'custom'
                                                }],
                                            onChange: value => setAttributes({
                                                modalSize: value
                                            })
                                        }), modalSize === 'custom' && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
                                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '8px',
                                                    alignItems: 'flex-end'
                                                },
                                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                        style: {
                                                            flex: 1
                                                        },
                                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
                                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Width', 'jankx'),
                                                            value: customWidth,
                                                            onChange: value => setAttributes({
                                                                customWidth: value
                                                            }),
                                                            min: 200,
                                                            max: 1200,
                                                            step: 10,
                                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width of the modal content', 'jankx')
                                                        })
                                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                        style: {
                                                            minWidth: '80px'
                                                        },
                                                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unit', 'jankx'),
                                                            value: customWidthUnit,
                                                            options: [{
                                                                    label: 'px',
                                                                    value: 'px'
                                                                }, {
                                                                    label: '%',
                                                                    value: '%'
                                                                }, {
                                                                    label: 'rem',
                                                                    value: 'rem'
                                                                }, {
                                                                    label: 'em',
                                                                    value: 'em'
                                                                }, {
                                                                    label: 'vw',
                                                                    value: 'vw'
                                                                }],
                                                            onChange: value => setAttributes({
                                                                customWidthUnit: value
                                                            })
                                                        })
                                                    })]
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close on Overlay Click', 'jankx'),
                                            checked: closeOnOverlayClick,
                                            onChange: value => setAttributes({
                                                closeOnOverlayClick: value
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close on Escape Key', 'jankx'),
                                            checked: closeOnEscape,
                                            onChange: value => setAttributes({
                                                closeOnEscape: value
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Close Button', 'jankx'),
                                            checked: showCloseButton,
                                            onChange: value => setAttributes({
                                                showCloseButton: value
                                            })
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Type', 'jankx'),
                                            value: animationType,
                                            options: [{
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade', 'jankx'),
                                                    value: 'fade'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide', 'jankx'),
                                                    value: 'slide'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom', 'jankx'),
                                                    value: 'zoom'
                                                }, {
                                                    label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
                                                    value: 'none'
                                                }],
                                            onChange: value => setAttributes({
                                                animationType: value
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Duration (ms)', 'jankx'),
                                            value: animationDuration,
                                            onChange: value => setAttributes({
                                                animationDuration: value
                                            }),
                                            min: 100,
                                            max: 1000,
                                            step: 50
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Backdrop Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                            className: "components-base-control",
                                            children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
                                                    className: "components-base-control__label",
                                                    children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Backdrop Color', 'jankx')
                                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPicker, {
                                                    color: backdropColor,
                                                    onChange: value => setAttributes({
                                                        backdropColor: value
                                                    })
                                                })]
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Backdrop Blur', 'jankx'),
                                            checked: backdropBlur,
                                            onChange: value => setAttributes({
                                                backdropBlur: value
                                            })
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Z-Index', 'jankx'),
                                            value: zIndex,
                                            onChange: value => setAttributes({
                                                zIndex: value
                                            }),
                                            min: 1000,
                                            max: 99999,
                                            step: 100
                                        })]
                                }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                                    title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Settings', 'jankx'),
                                    initialOpen: false,
                                    children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable Scroll', 'jankx'),
                                            checked: disableScroll,
                                            onChange: value => setAttributes({
                                                disableScroll: value
                                            }),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable page scroll when modal is open', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable Auto Focus', 'jankx'),
                                            checked: disableFocus,
                                            onChange: value => setAttributes({
                                                disableFocus: value
                                            }),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable auto focus on first focusable element', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Await Open Animation', 'jankx'),
                                            checked: awaitOpenAnimation,
                                            onChange: value => setAttributes({
                                                awaitOpenAnimation: value
                                            }),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Wait for CSS animation to finish before focusing', 'jankx')
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
                                            label: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Await Close Animation', 'jankx'),
                                            checked: awaitCloseAnimation,
                                            onChange: value => setAttributes({
                                                awaitCloseAnimation: value
                                            }),
                                            help: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Wait for CSS animation before removing from DOM', 'jankx')
                                        })]
                                })]
                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                            ...blockProps,
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                className: "wp-block-jankx-modal__editor-wrapper",
                                children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                        className: "wp-block-jankx-modal__trigger-preview",
                                        children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                className: "wp-block-jankx-modal__label",
                                                children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔘 Modal Trigger:', 'jankx')
                                            }), renderTrigger(), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                style: {
                                                    marginTop: '8px',
                                                    fontSize: '12px',
                                                    color: '#666'
                                                },
                                                children: isPreviewMode ? (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('👁️ Preview mode is ON - Modal content shown below', 'jankx') : (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('👁️ Click toolbar button or trigger to show modal content', 'jankx')
                                            })]
                                    }), isPreviewMode && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                        className: "wp-block-jankx-modal__editor-content",
                                        children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                                className: "wp-block-jankx-modal__label",
                                                children: [(0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('📄 Modal Content (ID: ', 'jankx'), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("code", {
                                                        children: generatedId
                                                    }), "):"]
                                            }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                                className: `wp-block-jankx-modal__content-editor wp-block-jankx-modal__container--${modalSize}`,
                                                children: [showCloseButton && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                        className: "wp-block-jankx-modal__close-preview",
                                                        title: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close button will appear here', 'jankx'),
                                                        children: "\u2715"
                                                    }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                                                        ...innerBlocksProps
                                                    })]
                                            })]
                                    }), !isPreviewMode && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                                        style: {
                                            padding: '20px',
                                            margin: '16px 0',
                                            border: '2px dashed #ddd',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            background: '#f9f9f9'
                                        },
                                        children: [/*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
                                                style: {
                                                    margin: '0 0 12px 0',
                                                    fontSize: '14px',
                                                    color: '#666'
                                                },
                                                children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('📝 Modal content is hidden', 'jankx')
                                            }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
                                                type: "button",
                                                className: "components-button is-primary",
                                                onClick: () => setIsPreviewMode(true),
                                                children: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Modal Content to Edit', 'jankx')
                                            })]
                                    })]
                            })
                        })]
                });
            }
            /***/ 
        }),
        /***/ "./blocks/modal/save.js": 
        /*!******************************!*\
          !*** ./blocks/modal/save.js ***!
          \******************************/
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
            /**
             * WordPress dependencies
             */
            /**
             * Save component for Modal block
             */
            function Save({ attributes }) {
                const { modalId, triggerType, triggerText, triggerUrl, triggerTarget, customSelector, modalSize, customWidth, customWidthUnit, closeOnOverlayClick, closeOnEscape, showCloseButton, animationType, animationDuration, backdropColor, backdropBlur, zIndex, disableScroll, disableFocus, awaitOpenAnimation, awaitCloseAnimation } = attributes;
                // Generate unique ID if not set
                const finalModalId = modalId || 'modal-' + Math.random().toString(36).substr(2, 9);
                // No wrapper - apply block props directly to modal
                const modalProps = {
                    'data-close-on-overlay-click': closeOnOverlayClick,
                    'data-close-on-escape': closeOnEscape,
                    'data-animation-type': animationType,
                    'data-backdrop-blur': backdropBlur,
                    'data-modal-id': finalModalId,
                    'data-disable-scroll': disableScroll,
                    'data-disable-focus': disableFocus,
                    'data-await-open-animation': awaitOpenAnimation,
                    'data-await-close-animation': awaitCloseAnimation
                };
                const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
                    className: 'wp-block-jankx-modal__content-inner'
                });
                const triggerId = finalModalId + '-trigger';
                const modalContentId = finalModalId + '-content';
                // Build trigger HTML
                const renderTrigger = () => {
                    switch (triggerType) {
                        case 'button':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
                                type: "button",
                                id: triggerId,
                                className: "wp-block-jankx-modal__trigger",
                                "data-micromodal-trigger": finalModalId,
                                children: triggerText || 'Open Modal'
                            });
                        case 'anchor':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
                                href: triggerUrl || '#',
                                id: triggerId,
                                className: "wp-block-jankx-modal__trigger",
                                "data-micromodal-trigger": finalModalId,
                                target: triggerTarget,
                                children: triggerText || 'Open Modal'
                            });
                        case 'custom':
                            return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                                className: "wp-block-jankx-modal__custom-trigger",
                                "data-custom-selector": customSelector,
                                "data-micromodal-trigger": finalModalId
                            });
                        default:
                            return null;
                    }
                };
                // Build modal HTML - following Micromodal structure
                const renderModal = () => {
                    return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                        ..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save(),
                        ...modalProps,
                        id: finalModalId,
                        className: `wp-block-jankx-modal ${modalSize === 'fullscreen' ? 'modal-fullscreen' : ''}`,
                        "aria-hidden": "true",
                        style: {
                            '--modal-backdrop-color': backdropColor,
                            '--modal-animation-duration': `${animationDuration}ms`,
                            '--modal-z-index': zIndex,
                            '--modal-backdrop-blur': backdropBlur ? 'blur(5px)' : 'none',
                            ...(modalSize === 'custom' && {
                                '--modal-custom-width': `${customWidth}${customWidthUnit}`
                            })
                        },
                        children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                            className: "wp-block-jankx-modal__overlay",
                            tabIndex: "-1",
                            "data-micromodal-close": true,
                            children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                                className: `wp-block-jankx-modal__container wp-block-jankx-modal__container--${modalSize}`,
                                role: "dialog",
                                "aria-modal": "true",
                                "aria-labelledby": `${finalModalId}-title`,
                                children: /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
                                    className: "wp-block-jankx-modal__content",
                                    id: modalContentId,
                                    children: [showCloseButton && /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
                                            className: "wp-block-jankx-modal__close",
                                            "aria-label": "Close modal",
                                            "data-micromodal-close": true
                                        }), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                                            ...innerBlocksProps
                                        })]
                                })
                            })
                        })
                    });
                };
                return /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
                    children: [renderTrigger(), renderModal()]
                });
            }
            /***/ 
        }),
        /***/ "./node_modules/@wordpress/icons/build-module/library/desktop.js": 
        /*!***********************************************************************!*\
          !*** ./node_modules/@wordpress/icons/build-module/library/desktop.js ***!
          \***********************************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */desktop_default)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
            // packages/icons/src/library/desktop.tsx
            var desktop_default = /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
                    d: "M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"
                })
            });
            /***/ 
        }),
        /***/ "./node_modules/@wordpress/icons/build-module/library/fullscreen.js": 
        /*!**************************************************************************!*\
          !*** ./node_modules/@wordpress/icons/build-module/library/fullscreen.js ***!
          \**************************************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */fullscreen_default)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
            // packages/icons/src/library/fullscreen.tsx
            var fullscreen_default = /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
                    d: "M6 4a2 2 0 0 0-2 2v3h1.5V6a.5.5 0 0 1 .5-.5h3V4H6Zm3 14.5H6a.5.5 0 0 1-.5-.5v-3H4v3a2 2 0 0 0 2 2h3v-1.5Zm6 1.5v-1.5h3a.5.5 0 0 0 .5-.5v-3H20v3a2 2 0 0 1-2 2h-3Zm3-16a2 2 0 0 1 2 2v3h-1.5V6a.5.5 0 0 0-.5-.5h-3V4h3Z"
                })
            });
            /***/ 
        }),
        /***/ "./node_modules/@wordpress/icons/build-module/library/layout.js": 
        /*!**********************************************************************!*\
          !*** ./node_modules/@wordpress/icons/build-module/library/layout.js ***!
          \**********************************************************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ "default": () => ( /* binding */layout_default)
                /* harmony export */ 
            });
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
            /* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
            // packages/icons/src/library/layout.tsx
            var layout_default = /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
                    d: "M18 5.5H6a.5.5 0 00-.5.5v3h13V6a.5.5 0 00-.5-.5zm.5 5H10v8h8a.5.5 0 00.5-.5v-7.5zm-10 0h-3V18a.5.5 0 00.5.5h2.5v-8zM6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                })
            });
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
        /***/ "@wordpress/primitives": 
        /*!************************************!*\
          !*** external ["wp","primitives"] ***!
          \************************************/
        /***/ ((module) => {
            module.exports = window["wp"]["primitives"];
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
        /*!*******************************!*\
          !*** ./blocks/modal/index.js ***!
          \*******************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
            /* harmony export */ metadata: () => ( /* reexport default export from named module */_block_json__WEBPACK_IMPORTED_MODULE_5__),
            /* harmony export */ name: () => ( /* binding */name),
            /* harmony export */ settings: () => ( /* binding */settings)
            /* harmony export */ 
        });
        /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
        /* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
        /* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/layout.js");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
        /* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
        /* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/modal/edit.js");
        /* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/modal/save.js");
        /* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/modal/block.json");
        /**
         * WordPress dependencies
         */
        /**
         * Internal dependencies
         */
        const { name } = _block_json__WEBPACK_IMPORTED_MODULE_5__;
        const settings = {
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
            example: {
                attributes: {
                    triggerType: 'button',
                    triggerText: 'Open Modal',
                    modalSize: 'medium',
                    showCloseButton: true,
                    animationType: 'fade'
                },
                innerBlocks: [{
                        name: 'core/heading',
                        attributes: {
                            level: 3,
                            content: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modal Title', 'jankx')
                        }
                    }, {
                        name: 'core/paragraph',
                        attributes: {
                            content: (0, _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This is the modal content. You can add any blocks here.', 'jankx')
                        }
                    }]
            },
            edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
            save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
        };
        (0, _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(name, settings);
    })();
    /******/ 
})();
//# sourceMappingURL=index.js.map
