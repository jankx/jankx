/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/floating-messengers/editor.scss":
/*!************************************************!*\
  !*** ./blocks/floating-messengers/editor.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/floating-messengers/style.scss":
/*!***********************************************!*\
  !*** ./blocks/floating-messengers/style.scss ***!
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
/*!**********************************************!*\
  !*** ./blocks/floating-messengers/index.tsx ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./blocks/floating-messengers/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./blocks/floating-messengers/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function channelUrl(type, channels) {
  switch (type) {
    case 'messenger':
      if (channels.messenger.pageId) return `https://m.me/${channels.messenger.pageId}`;
      return '#';
    case 'whatsapp':
      if (channels.whatsapp.phone) return `https://wa.me/${channels.whatsapp.phone.replace(/\D/g, '')}`;
      return '#';
    case 'zalo':
      if (channels.zalo.phone) return `https://zalo.me/${channels.zalo.phone.replace(/\D/g, '')}`;
      return '#';
    case 'telegram':
      if (channels.telegram.username) return `https://t.me/${channels.telegram.username.replace(/^@/, '')}`;
      return '#';
    case 'phone':
      if (channels.phone.phone) return `tel:${channels.phone.phone.replace(/\s/g, '')}`;
      return '#';
    case 'sms':
      if (channels.sms.phone) return `sms:${channels.sms.phone.replace(/\s/g, '')}`;
      return '#';
    default:
      return '#';
  }
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/floating-messengers', {
  edit: ({
    attributes,
    setAttributes
  }) => {
    const {
      expandStyle = 'vertical',
      verticalAlign = 'bottom',
      expandDistance = 72,
      idleAnimation = 'none',
      position = 'right',
      bottomOffset = '24px',
      showLabels = false,
      triggerMode = 'toggle',
      channels = {
        messenger: {
          enabled: false,
          label: 'Messenger'
        },
        whatsapp: {
          enabled: false,
          label: 'WhatsApp'
        },
        zalo: {
          enabled: false,
          label: 'Zalo'
        },
        telegram: {
          enabled: false,
          label: 'Telegram'
        },
        phone: {
          enabled: false,
          label: 'Gọi'
        },
        sms: {
          enabled: false,
          label: 'SMS'
        }
      }
    } = attributes;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: ['jankx-floating-messengers', `position-${position}`, `trigger-${triggerMode}`, `expand-${expandStyle}`, `v-${verticalAlign}`, idleAnimation !== 'none' ? `idle-${idleAnimation}` : '', showLabels ? 'show-labels' : ''].filter(Boolean).join(' '),
      style: verticalAlign === 'bottom' ? {
        bottom: bottomOffset
      } : {
        top: '50%',
        transform: 'translateY(-50%)'
      }
    });
    const enabledTypes = Object.keys(channels).filter(t => channels[t]?.enabled);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vị trí hiển thị', 'jankx'),
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vị trí', 'jankx'),
            value: position,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bên trái', 'jankx'),
              value: 'left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bên phải', 'jankx'),
              value: 'right'
            }],
            onChange: value => setAttributes({
              position: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Căn theo trục Y', 'jankx'),
            value: verticalAlign,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dưới cùng', 'jankx'),
              value: 'bottom'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Giữa màn hình', 'jankx'),
              value: 'center'
            }],
            onChange: value => setAttributes({
              verticalAlign: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Khoảng cách dưới', 'jankx'),
            value: bottomOffset,
            onChange: value => setAttributes({
              bottomOffset: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: 24px, 2rem', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chế độ hiển thị', 'jankx'),
            value: triggerMode,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nút toggle', 'jankx'),
              value: 'toggle'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Luôn hiển thị', 'jankx'),
              value: 'always'
            }],
            onChange: value => setAttributes({
              triggerMode: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hiển thị nhãn', 'jankx'),
            checked: showLabels,
            onChange: value => setAttributes({
              showLabels: value
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Kiểu bung nút', 'jankx'),
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Kiểu bung', 'jankx'),
            value: expandStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thẳng đứng', 'jankx'),
              value: 'vertical'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xòe quạt', 'jankx'),
              value: 'fan'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hai bên', 'jankx'),
              value: 'bidirectional'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tách trên/dưới', 'jankx'),
              value: 'split'
            }],
            onChange: value => setAttributes({
              expandStyle: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Khoảng cách bung (px)', 'jankx'),
            value: expandDistance,
            onChange: value => setAttributes({
              expandDistance: value || 72
            }),
            min: 40,
            max: 160
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hiệu ứng rảnh', 'jankx'),
          initialOpen: false,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Items Idle Animation', 'jankx'),
            value: idleAnimation,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Không', 'jankx'),
              value: 'none'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pulsating Ring', 'jankx'),
              value: 'pulse-ring'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Wiggle', 'jankx'),
              value: 'wiggle'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Float', 'jankx'),
              value: 'float'
            }],
            onChange: value => setAttributes({
              idleAnimation: value
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Kênh liên hệ', 'jankx'),
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Messenger', 'jankx'),
            checked: !!channels.messenger?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                messenger: {
                  ...(channels.messenger || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.messenger?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Page ID/User', 'jankx'),
              value: channels.messenger?.pageId || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  messenger: {
                    ...(channels.messenger || {}),
                    pageId: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.messenger?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  messenger: {
                    ...(channels.messenger || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.messenger?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  messenger: {
                    ...(channels.messenger || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('WhatsApp', 'jankx'),
            checked: !!channels.whatsapp?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                whatsapp: {
                  ...(channels.whatsapp || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.whatsapp?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số điện thoại', 'jankx'),
              value: channels.whatsapp?.phone || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  whatsapp: {
                    ...(channels.whatsapp || {}),
                    phone: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.whatsapp?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  whatsapp: {
                    ...(channels.whatsapp || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.whatsapp?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  whatsapp: {
                    ...(channels.whatsapp || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Zalo', 'jankx'),
            checked: !!channels.zalo?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                zalo: {
                  ...(channels.zalo || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.zalo?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số điện thoại', 'jankx'),
              value: channels.zalo?.phone || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  zalo: {
                    ...(channels.zalo || {}),
                    phone: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.zalo?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  zalo: {
                    ...(channels.zalo || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.zalo?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  zalo: {
                    ...(channels.zalo || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Telegram', 'jankx'),
            checked: !!channels.telegram?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                telegram: {
                  ...(channels.telegram || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.telegram?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Username', 'jankx'),
              value: channels.telegram?.username || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  telegram: {
                    ...(channels.telegram || {}),
                    username: value.replace(/^@/, '')
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.telegram?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  telegram: {
                    ...(channels.telegram || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.telegram?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  telegram: {
                    ...(channels.telegram || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Gọi điện', 'jankx'),
            checked: !!channels.phone?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                phone: {
                  ...(channels.phone || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.phone?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số điện thoại', 'jankx'),
              value: channels.phone?.phone || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  phone: {
                    ...(channels.phone || {}),
                    phone: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.phone?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  phone: {
                    ...(channels.phone || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.phone?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  phone: {
                    ...(channels.phone || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SMS', 'jankx'),
            checked: !!channels.sms?.enabled,
            onChange: value => setAttributes({
              channels: {
                ...channels,
                sms: {
                  ...(channels.sms || {}),
                  enabled: value
                }
              }
            })
          }), !!channels.sms?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số điện thoại', 'jankx'),
              value: channels.sms?.phone || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  sms: {
                    ...(channels.sms || {}),
                    phone: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'),
              value: channels.sms?.label || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  sms: {
                    ...(channels.sms || {}),
                    label: value
                  }
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextareaControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('SVG Icon', 'jankx'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dán mã SVG để tùy chỉnh icon', 'jankx'),
              value: channels.sms?.iconSvg || '',
              onChange: value => setAttributes({
                channels: {
                  ...channels,
                  sms: {
                    ...(channels.sms || {}),
                    iconSvg: value
                  }
                }
              })
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        ...blockProps,
        "data-count": enabledTypes.length,
        style: {
          ...(blockProps.style || {}),
          ['--fm-distance']: `${expandDistance}px`
        },
        children: [triggerMode === 'toggle' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          className: "fm-trigger",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mở danh sách liên hệ', 'jankx'),
          type: "button",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
            className: "fm-trigger-dot"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "fm-list",
          children: enabledTypes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "fm-placeholder",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chọn kênh liên hệ trong panel bên phải', 'jankx')
          }) : enabledTypes.map((t, idx) => {
            const label = channels[t]?.label || (t === 'phone' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Gọi', 'jankx') : t.charAt(0).toUpperCase() + t.slice(1));
            const customSvg = channels[t]?.iconSvg;
            const svgIcon = (() => {
              switch (t) {
                case 'messenger':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M12 2C6.48 2 2 6.09 2 10.91c0 2.73 1.41 5.18 3.67 6.87v3.22l3.36-1.85c.93.26 1.92.4 2.97.4 5.52 0 10-4.09 10-8.91S17.52 2 12 2zm1.23 10.46l-2.1-2.23-4.1 2.23 4.51-4.87 2.15 2.23 4.03-2.23-4.49 4.87z"
                    })
                  });
                case 'whatsapp':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M20.52 3.48A10.69 10.69 0 0012 0C5.37 0 0 5.37 0 12c0 2.1.56 4.16 1.62 5.97L0 24l6.2-1.63A11.97 11.97 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zm-8.52 18.3c-1.9 0-3.76-.5-5.38-1.45l-.38-.22-3.69.97.99-3.59-.25-.37A9.47 9.47 0 012.56 12C2.56 6.74 6.74 2.56 12 2.56c2.52 0 4.89.98 6.67 2.77a9.41 9.41 0 012.77 6.67c0 5.26-4.18 9.44-9.44 9.44zm5.48-6.96c-.3-.15-1.77-.87-2.05-.96-.28-.1-.48-.15-.68.15-.2.3-.78.95-.96 1.15-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.82.38-.3.3-1.08 1.06-1.08 2.58 0 1.51 1.11 2.97 1.26 3.18.15.2 2.18 3.34 5.27 4.54.74.32 1.32.5 1.77.64.74.23 1.41.2 1.94.12.59-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.27-.2-.58-.34z"
                    })
                  });
                case 'zalo':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M4 3h12a5 5 0 015 5v8a5 5 0 01-5 5H4a1 1 0 01-1-1V4a1 1 0 011-1zm3.5 6.5h-2V17h2V9.5zm1.5 0V17h5v-1.5h-3.5V9.5H9zm9.5 0H16V17h2v-4h1.5V9.5z"
                    })
                  });
                case 'telegram':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M23.5 2.5L1.5 11.2c-1 .4-.9 1.8.2 2.1l5.5 1.7 2.1 6.7c.3 1 1.6 1.2 2.2.2l3.3-5.2 5.8 4.3c1 .7 2.3.1 2.6-1.1l3.2-15c.3-1.2-1-2.1-2.1-1.6z"
                    })
                  });
                case 'phone':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M6.6 10.2c1.2 2.4 3.1 4.3 5.5 5.5l1.8-1.8c.4-.4 1-.5 1.5-.3 1.6.5 3.3.8 5.1.8.8 0 1.5.7 1.5 1.5V20c0 .8-.7 1.5-1.5 1.5C10.7 21.5 2.5 13.3 2.5 3.5 2.5 2.7 3.2 2 4 2h3.6c.8 0 1.5.7 1.5 1.5 0 1.8.3 3.5.8 5.1.2.5.1 1.1-.3 1.5l-2 2.1z"
                    })
                  });
                case 'sms':
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("svg", {
                    viewBox: "0 0 24 24",
                    width: "20",
                    height: "20",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
                      fill: "currentColor",
                      d: "M20 2H4C2.9 2 2 2.9 2 4v14c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2zm-6 8H6v-2h6v2z"
                    })
                  });
                default:
                  return null;
              }
            })();
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
              className: `fm-node fm-${t}`,
              style: {
                ['--index']: idx + 1
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("a", {
                className: `fm-button`,
                href: channelUrl(t, channels),
                target: "_blank",
                rel: "noopener",
                "aria-label": label,
                children: [customSvg ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "fm-icon",
                  "aria-hidden": "true",
                  dangerouslySetInnerHTML: {
                    __html: customSvg
                  }
                }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "fm-icon",
                  "aria-hidden": "true",
                  children: svgIcon
                }), showLabels && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "fm-label",
                  children: label
                }), !showLabels && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "fm-tooltip",
                  children: label
                })]
              })
            }, t);
          })
        })]
      })]
    });
  },
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map