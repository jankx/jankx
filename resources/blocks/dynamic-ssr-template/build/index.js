/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-ssr-template/block.json":
/*!************************************************!*\
  !*** ./blocks/dynamic-ssr-template/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-ssr-template","title":"Dynamic SSR Template","category":"jankx","parent":["jankx/dynamic-ssr-layout"],"description":"Server-rendered template cho từng item trong Dynamic SSR Layout","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css","usesContext":["queryId","postType","displayLayout","postsPerPage","columns","columnsTablet","columnsMobile","slidesToScroll","loop","autoplay","autoplayDelay","showArrows","showDots","carouselAlign","carouselAxis","carouselDirection","carouselStartIndex","carouselDuration","carouselDragFree","carouselDragThreshold","carouselSkipSnaps","carouselContainScroll","carouselInViewThreshold"],"attributes":{"templateSlug":{"type":"string","default":"post-layouts/loop-item"},"thumbnailPosition":{"type":"string","default":"top"},"imageRatio":{"type":"string","default":""},"itemSpacing":{"type":"string","default":"normal"},"showItemBorder":{"type":"boolean","default":false},"itemBorderRadius":{"type":"number","default":0},"showExcerpt":{"type":"boolean","default":true},"excerptLength":{"type":"number","default":55},"showTitle":{"type":"boolean","default":true},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"showPrice":{"type":"boolean","default":true},"showAddToCart":{"type":"boolean","default":true},"showRating":{"type":"boolean","default":false}},"supports":{"reusable":false,"html":false,"align":["wide","full"],"layout":true,"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true}}}');

/***/ }),

/***/ "./blocks/dynamic-ssr-template/editor.scss":
/*!*************************************************!*\
  !*** ./blocks/dynamic-ssr-template/editor.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/dynamic-ssr-template/style.scss":
/*!************************************************!*\
  !*** ./blocks/dynamic-ssr-template/style.scss ***!
  \************************************************/
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
/*!***********************************************!*\
  !*** ./blocks/dynamic-ssr-template/index.tsx ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-ssr-template/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-ssr-template/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./blocks/dynamic-ssr-template/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









function Edit({
  attributes,
  setAttributes,
  context
}) {
  const {
    templateSlug = 'post-layouts/loop-item',
    thumbnailPosition = 'top',
    imageRatio = '',
    itemSpacing = 'normal',
    showItemBorder = false,
    itemBorderRadius = 0,
    showExcerpt = true,
    excerptLength = 55,
    showTitle = true,
    showDate = true,
    showAuthor = false,
    showPrice = true,
    showAddToCart = true,
    showRating = false
  } = attributes;
  const postType = context?.postType || 'post';
  const layoutsData = window.jankxDynamicDataContentLoopLayouts || {
    layoutsByPostType: {},
    commonLayouts: []
  };
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const common = layoutsData.commonLayouts || [];
    const specific = (layoutsData.layoutsByPostType || {})[postType] || [];
    const merged = [...common];
    const names = new Set(merged.map(l => l.name));
    for (const l of specific) {
      if (!names.has(l.name)) {
        merged.push(l);
      }
    }
    return merged.map(l => ({
      label: l.title || l.name,
      value: l.name
    }));
  }, [postType, layoutsData]);

  // Template options from views directory
  const templateOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const availableTemplates = window.jankxDynamicSsrTemplate?.availableTemplates || [];

    // Default template options
    const defaultTemplates = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default Loop Item', 'jankx'),
      value: 'post-layouts/loop-item'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Large Item', 'jankx'),
      value: 'post-layouts/large-item'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Only', 'jankx'),
      value: 'post-layouts/thumbnail'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Term Item', 'jankx'),
      value: 'post-layouts/term-item'
    }];

    // Add available templates from PHP
    const phpTemplates = availableTemplates.map(template => ({
      label: template.title,
      value: template.slug
    }));
    return [...defaultTemplates, ...phpTemplates];
  }, []);
  const [previewHtml, setPreviewHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: `dynamic-ssr-template dynamic-ssr-template--${templateSlug.replace('/', '-')}`,
    ...(imageRatio && {
      'data-image-ratio': imageRatio
    })
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref0, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14;
    const ajaxUrlRaw = window.jankxDynamicSsrTemplate?.ajaxUrl || '/wp-admin/admin-ajax.php';
    const nonce = window.jankxDynamicSsrTemplate?.nonce || '';
    let ajaxUrl = ajaxUrlRaw;
    if (ajaxUrl.startsWith('/')) {
      ajaxUrl = window.location.origin + ajaxUrl;
    } else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
      ajaxUrl = window.location.origin + '/' + ajaxUrl.replace(/^\//, '');
    }
    if (!nonce) {
      return;
    }
    const ssrAttrs = {
      templateSlug,
      thumbnailPosition,
      imageRatio,
      itemSpacing,
      showItemBorder,
      itemBorderRadius,
      showExcerpt,
      excerptLength,
      showTitle,
      showDate,
      showAuthor,
      showPrice,
      showAddToCart,
      showRating
    };
    const parentAttrs = {
      postType: context?.postType || 'post',
      layout: context?.displayLayout || 'grid',
      postsPerPage: context?.postsPerPage || 6,
      columns: context?.columns || undefined,
      columnsTablet: context?.columnsTablet || undefined,
      columnsMobile: context?.columnsMobile || undefined,
      slidesToScroll: (_ref = context?.slidesToScroll) !== null && _ref !== void 0 ? _ref : undefined,
      loop: (_ref2 = context?.loop) !== null && _ref2 !== void 0 ? _ref2 : undefined,
      autoplay: (_ref3 = context?.autoplay) !== null && _ref3 !== void 0 ? _ref3 : undefined,
      autoplayDelay: (_ref4 = context?.autoplayDelay) !== null && _ref4 !== void 0 ? _ref4 : undefined,
      showArrows: (_ref5 = context?.showArrows) !== null && _ref5 !== void 0 ? _ref5 : undefined,
      showDots: (_ref6 = context?.showDots) !== null && _ref6 !== void 0 ? _ref6 : undefined,
      carouselAlign: (_ref7 = context?.carouselAlign) !== null && _ref7 !== void 0 ? _ref7 : undefined,
      carouselAxis: (_ref8 = context?.carouselAxis) !== null && _ref8 !== void 0 ? _ref8 : undefined,
      carouselDirection: (_ref9 = context?.carouselDirection) !== null && _ref9 !== void 0 ? _ref9 : undefined,
      carouselStartIndex: (_ref0 = context?.carouselStartIndex) !== null && _ref0 !== void 0 ? _ref0 : undefined,
      carouselDuration: (_ref1 = context?.carouselDuration) !== null && _ref1 !== void 0 ? _ref1 : undefined,
      carouselDragFree: (_ref10 = context?.carouselDragFree) !== null && _ref10 !== void 0 ? _ref10 : undefined,
      carouselDragThreshold: (_ref11 = context?.carouselDragThreshold) !== null && _ref11 !== void 0 ? _ref11 : undefined,
      carouselSkipSnaps: (_ref12 = context?.carouselSkipSnaps) !== null && _ref12 !== void 0 ? _ref12 : undefined,
      carouselContainScroll: (_ref13 = context?.carouselContainScroll) !== null && _ref13 !== void 0 ? _ref13 : undefined,
      carouselInViewThreshold: (_ref14 = context?.carouselInViewThreshold) !== null && _ref14 !== void 0 ? _ref14 : undefined
    };
    const params = new URLSearchParams();
    params.append('action', 'jankx_dynamic_ssr_template_preview');
    params.append('nonce', nonce);
    params.append('attributes', JSON.stringify(ssrAttrs));
    params.append('parent_attributes', JSON.stringify(parentAttrs));
    setLoading(true);
    fetch(ajaxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params,
      credentials: 'same-origin'
    }).then(res => res.json()).then(data => {
      if (data?.success && typeof data.data?.html === 'string') {
        setPreviewHtml(data.data.html);
      } else {
        setPreviewHtml('');
      }
    }).catch(() => {
      setPreviewHtml('');
    }).finally(() => setLoading(false));
  }, [templateSlug, thumbnailPosition, imageRatio, itemSpacing, showItemBorder, itemBorderRadius, showExcerpt, excerptLength, showTitle, showDate, showAuthor, showPrice, showAddToCart, showRating, context?.postType, context?.displayLayout, context?.postsPerPage, context?.columns, context?.columnsTablet, context?.columnsMobile, context?.slidesToScroll, context?.loop, context?.autoplay, context?.autoplayDelay, context?.showArrows, context?.showDots, context?.carouselAlign, context?.carouselAxis, context?.carouselDirection, context?.carouselStartIndex, context?.carouselDuration, context?.carouselDragFree, context?.carouselDragThreshold, context?.carouselSkipSnaps, context?.carouselContainScroll, context?.carouselInViewThreshold]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('SSR Template Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template File', 'jankx'),
          value: templateSlug,
          options: templateOptions,
          onChange: value => setAttributes({
            templateSlug: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template file from views directory. Can be overridden in child theme.', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Item Spacing', 'jankx'),
          value: itemSpacing,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
            value: 'none'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Compact', 'jankx'),
            value: 'compact'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Normal', 'jankx'),
            value: 'normal'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loose', 'jankx'),
            value: 'loose'
          }],
          onChange: value => setAttributes({
            itemSpacing: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Item Border', 'jankx'),
          checked: !!showItemBorder,
          onChange: value => setAttributes({
            showItemBorder: value
          })
        }), !!showItemBorder && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx'),
          value: itemBorderRadius,
          onChange: value => setAttributes({
            itemBorderRadius: value || 0
          }),
          min: 0,
          max: 50
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Position', 'jankx'),
          value: thumbnailPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top', 'jankx'),
            value: 'top'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom', 'jankx'),
            value: 'bottom'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'jankx'),
            value: 'left'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'jankx'),
            value: 'right'
          }],
          onChange: value => setAttributes({
            thumbnailPosition: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Ratio (e.g. 16/9)', 'jankx'),
          value: imageRatio,
          onChange: value => setAttributes({
            imageRatio: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Title', 'jankx'),
          checked: !!showTitle,
          onChange: value => setAttributes({
            showTitle: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Excerpt', 'jankx'),
          checked: !!showExcerpt,
          onChange: value => setAttributes({
            showExcerpt: value
          })
        }), !!showExcerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Excerpt Length', 'jankx'),
          value: excerptLength,
          onChange: value => setAttributes({
            excerptLength: value || 55
          }),
          min: 10,
          max: 200
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Date', 'jankx'),
          checked: !!showDate,
          onChange: value => setAttributes({
            showDate: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Author', 'jankx'),
          checked: !!showAuthor,
          onChange: value => setAttributes({
            showAuthor: value
          })
        })]
      }), (postType === 'product' || postType === 'tour') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Commerce Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Price', 'jankx'),
          checked: !!showPrice,
          onChange: value => setAttributes({
            showPrice: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Add to Cart', 'jankx'),
          checked: !!showAddToCart,
          onChange: value => setAttributes({
            showAddToCart: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Rating', 'jankx'),
          checked: !!showRating,
          onChange: value => setAttributes({
            showRating: value
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: loading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        style: {
          padding: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading preview…', 'jankx')
      }) : previewHtml ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: previewHtml
        }
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        style: {
          padding: '12px'
        },
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template:', 'jankx'), " ", templateSlug, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("br", {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No preview available', 'jankx')]
      })
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  edit: Edit,
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map