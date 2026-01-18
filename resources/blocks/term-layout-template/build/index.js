/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-ssr-template/block.json":
/*!************************************************!*\
  !*** ./blocks/dynamic-ssr-template/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-ssr-template","title":"Dynamic SSR Template","category":"jankx","parent":["jankx/dynamic-ssr-layout"],"description":"Server-rendered template cho từng item trong Dynamic SSR Layout","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css","usesContext":["queryId","postType","displayLayout","postsPerPage","columns","columnsTablet","columnsMobile","slidesToScroll","loop","autoplay","autoplayDelay","showArrows","showDots","carouselAlign","carouselAxis","carouselDirection","carouselStartIndex","carouselDuration","carouselDragFree","carouselDragThreshold","carouselSkipSnaps","carouselContainScroll","carouselInViewThreshold"],"attributes":{"templateSlug":{"type":"string","default":"layouts/loop/item-default"},"thumbnailPosition":{"type":"string","default":"top"},"imageRatio":{"type":"string","default":""},"itemSpacing":{"type":"string","default":"normal"},"showItemBorder":{"type":"boolean","default":false},"itemBorderRadius":{"type":"number","default":0},"showExcerpt":{"type":"boolean","default":true},"excerptLength":{"type":"number","default":55},"showTitle":{"type":"boolean","default":true},"overlayIcon":{"type":"string","default":""},"overlayIconPosition":{"type":"string","default":"center"},"overlayIconSize":{"type":"number","default":24},"overlayIconColor":{"type":"string","default":"#ffffff"},"overlayIconBackground":{"type":"string","default":"rgba(0, 0, 0, 0.5)"},"overlayIconShowMode":{"type":"string","default":"always-show","enum":["always-show","hover-hide","hover-show"]},"overlayIconTarget":{"type":"string","default":"featured-image","enum":["featured-image","entry-image","entire-item"]},"overlayIconType":{"type":"string","default":"class","enum":["class","image","text"]},"overlayIconText":{"type":"string","default":""},"overlayIconRotate":{"type":"number","default":0},"overlayIconImageId":{"type":"number","default":0},"overlayIconImageUrl":{"type":"string","default":""},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"showPrice":{"type":"boolean","default":true},"showAddToCart":{"type":"boolean","default":true},"showRating":{"type":"boolean","default":false},"animationType":{"type":"string","default":"none","enum":["none","fade-in","fade-in-up","fade-in-down","fade-in-left","fade-in-right","zoom-in","slide-in-up"]},"animationDuration":{"type":"number","default":1000},"animationDelay":{"type":"number","default":0},"animationTarget":{"type":"string","default":"entry","enum":["entry","thumbnail"]},"animationReverse":{"type":"boolean","default":false}},"supports":{"reusable":false,"html":false,"align":["wide","full"],"layout":true,"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true}}}');

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
    templateSlug = 'layouts/loop/item-default',
    thumbnailPosition = 'top',
    imageRatio = '',
    itemSpacing = 'normal',
    showItemBorder = false,
    itemBorderRadius = 0,
    showExcerpt = true,
    excerptLength = 55,
    showTitle = true,
    overlayIcon = '',
    overlayIconPosition = 'center',
    overlayIconSize = 24,
    overlayIconColor = '#ffffff',
    overlayIconBackground = 'rgba(0, 0, 0, 0.5)',
    overlayIconShowMode = 'always-show',
    overlayIconTarget = 'featured-image',
    overlayIconType = 'class',
    overlayIconImageId = 0,
    overlayIconImageUrl = '',
    overlayIconText = '',
    overlayIconRotate = 0,
    showDate = true,
    showAuthor = false,
    showPrice = true,
    showAddToCart = true,
    showRating = false,
    animationType = 'none',
    animationDuration = 1000,
    animationDelay = 0,
    animationTarget = 'entry',
    animationReverse = false
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
      value: 'layouts/loop/item-default'
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
    var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref0, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35;
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
      overlayIcon,
      overlayIconPosition,
      overlayIconSize,
      overlayIconColor,
      overlayIconBackground,
      overlayIconShowMode,
      overlayIconTarget,
      overlayIconType,
      overlayIconImageId,
      overlayIconImageUrl,
      overlayIconText,
      overlayIconRotate,
      showDate,
      showAuthor,
      showPrice,
      showAddToCart,
      showRating,
      animationType,
      animationDuration,
      animationDelay,
      animationTarget,
      animationReverse
    };
    const parentAttrs = {
      postType: context?.postType || 'post',
      layout: context?.displayLayout || 'grid',
      postsPerPage: context?.postsPerPage || 6,
      useMultiPostType: (_ref = context?.useMultiPostType) !== null && _ref !== void 0 ? _ref : undefined,
      postTypes: (_ref2 = context?.postTypes) !== null && _ref2 !== void 0 ? _ref2 : undefined,
      columns: context?.columns || undefined,
      columnsTablet: context?.columnsTablet || undefined,
      columnsMobile: context?.columnsMobile || undefined,
      slidesToScroll: (_ref3 = context?.slidesToScroll) !== null && _ref3 !== void 0 ? _ref3 : undefined,
      loop: (_ref4 = context?.loop) !== null && _ref4 !== void 0 ? _ref4 : undefined,
      autoplay: (_ref5 = context?.autoplay) !== null && _ref5 !== void 0 ? _ref5 : undefined,
      autoplayDelay: (_ref6 = context?.autoplayDelay) !== null && _ref6 !== void 0 ? _ref6 : undefined,
      showArrows: (_ref7 = context?.showArrows) !== null && _ref7 !== void 0 ? _ref7 : undefined,
      showDots: (_ref8 = context?.showDots) !== null && _ref8 !== void 0 ? _ref8 : undefined,
      carouselAlign: (_ref9 = context?.carouselAlign) !== null && _ref9 !== void 0 ? _ref9 : undefined,
      carouselAxis: (_ref0 = context?.carouselAxis) !== null && _ref0 !== void 0 ? _ref0 : undefined,
      carouselDirection: (_ref1 = context?.carouselDirection) !== null && _ref1 !== void 0 ? _ref1 : undefined,
      carouselStartIndex: (_ref10 = context?.carouselStartIndex) !== null && _ref10 !== void 0 ? _ref10 : undefined,
      carouselDuration: (_ref11 = context?.carouselDuration) !== null && _ref11 !== void 0 ? _ref11 : undefined,
      carouselDragFree: (_ref12 = context?.carouselDragFree) !== null && _ref12 !== void 0 ? _ref12 : undefined,
      carouselDragThreshold: (_ref13 = context?.carouselDragThreshold) !== null && _ref13 !== void 0 ? _ref13 : undefined,
      carouselSkipSnaps: (_ref14 = context?.carouselSkipSnaps) !== null && _ref14 !== void 0 ? _ref14 : undefined,
      carouselContainScroll: (_ref15 = context?.carouselContainScroll) !== null && _ref15 !== void 0 ? _ref15 : undefined,
      carouselInViewThreshold: (_ref16 = context?.carouselInViewThreshold) !== null && _ref16 !== void 0 ? _ref16 : undefined,
      queryPreset: (_ref17 = context?.queryPreset) !== null && _ref17 !== void 0 ? _ref17 : undefined,
      includeStickyPosts: (_ref18 = context?.includeStickyPosts) !== null && _ref18 !== void 0 ? _ref18 : undefined,
      orderBy: (_ref19 = context?.orderBy) !== null && _ref19 !== void 0 ? _ref19 : undefined,
      order: (_ref20 = context?.order) !== null && _ref20 !== void 0 ? _ref20 : undefined,
      offset: (_ref21 = context?.offset) !== null && _ref21 !== void 0 ? _ref21 : undefined,
      taxQuery: (_ref22 = context?.taxQuery) !== null && _ref22 !== void 0 ? _ref22 : undefined,
      metaQuery: (_ref23 = context?.metaQuery) !== null && _ref23 !== void 0 ? _ref23 : undefined,
      keyword: (_ref24 = context?.keyword) !== null && _ref24 !== void 0 ? _ref24 : undefined,
      authorIn: (_ref25 = context?.authorIn) !== null && _ref25 !== void 0 ? _ref25 : undefined,
      authorNotIn: (_ref26 = context?.authorNotIn) !== null && _ref26 !== void 0 ? _ref26 : undefined,
      postIn: (_ref27 = context?.postIn) !== null && _ref27 !== void 0 ? _ref27 : undefined,
      postNotIn: (_ref28 = context?.postNotIn) !== null && _ref28 !== void 0 ? _ref28 : undefined,
      metaKey: (_ref29 = context?.metaKey) !== null && _ref29 !== void 0 ? _ref29 : undefined,
      metaType: (_ref30 = context?.metaType) !== null && _ref30 !== void 0 ? _ref30 : undefined,
      postStatus: (_ref31 = context?.postStatus) !== null && _ref31 !== void 0 ? _ref31 : undefined,
      postParent: (_ref32 = context?.postParent) !== null && _ref32 !== void 0 ? _ref32 : undefined,
      postParentIn: (_ref33 = context?.postParentIn) !== null && _ref33 !== void 0 ? _ref33 : undefined,
      postParentNotIn: (_ref34 = context?.postParentNotIn) !== null && _ref34 !== void 0 ? _ref34 : undefined,
      customQueryId: (_ref35 = context?.customQueryId) !== null && _ref35 !== void 0 ? _ref35 : undefined
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
  }, [templateSlug, thumbnailPosition, imageRatio, itemSpacing, showItemBorder, itemBorderRadius, showExcerpt, excerptLength, showTitle, overlayIcon, overlayIconPosition, overlayIconSize, overlayIconColor, overlayIconBackground, overlayIconShowMode, overlayIconTarget, overlayIconType, overlayIconImageId, overlayIconImageUrl, overlayIconText, overlayIconRotate, showDate, showAuthor, showPrice, showAddToCart, showRating, animationType, animationDuration, animationDelay, animationTarget, animationReverse, context?.postType, context?.useMultiPostType, context?.postTypes, context?.displayLayout, context?.postsPerPage, context?.columns, context?.columnsTablet, context?.columnsMobile, context?.slidesToScroll, context?.loop, context?.autoplay, context?.autoplayDelay, context?.showArrows, context?.showDots, context?.carouselAlign, context?.carouselAxis, context?.carouselDirection, context?.carouselStartIndex, context?.carouselDuration, context?.carouselDragFree, context?.carouselDragThreshold, context?.carouselSkipSnaps, context?.carouselContainScroll, context?.carouselInViewThreshold, context?.queryPreset, context?.includeStickyPosts, context?.orderBy, context?.order, context?.offset, context?.taxQuery, context?.metaQuery, context?.keyword, context?.authorIn, context?.authorNotIn, context?.postIn, context?.postNotIn, context?.metaKey, context?.metaType, context?.postStatus, context?.postParent, context?.postParentIn, context?.postParentNotIn, context?.customQueryId]);
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
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Icon Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Source', 'jankx'),
          value: overlayIconType,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Class', 'jankx'),
            value: 'class'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'jankx'),
            value: 'image'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text Symbol', 'jankx'),
            value: 'text'
          }],
          onChange: value => setAttributes({
            overlayIconType: value
          })
        }), overlayIconType === 'class' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Class', 'jankx'),
          value: overlayIcon,
          onChange: value => setAttributes({
            overlayIcon: value
          })
        }), overlayIconType === 'text' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Symbol Text', 'jankx'),
            value: overlayIconText,
            onChange: value => setAttributes({
              overlayIconText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ví dụ: ▶, ★, ▷', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rotate (deg)', 'jankx'),
            value: overlayIconRotate,
            onChange: value => setAttributes({
              overlayIconRotate: value || 0
            }),
            min: -180,
            max: 180,
            step: 1
          })]
        }), overlayIconType === 'image' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
            onSelect: media => {
              const url = media?.url || '';
              const id = media?.id || 0;
              setAttributes({
                overlayIconImageUrl: url,
                overlayIconImageId: id
              });
            },
            allowedTypes: ['image'],
            value: overlayIconImageId || 0,
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              variant: "primary",
              onClick: open,
              children: overlayIconImageUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Overlay Image', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Overlay Image', 'jankx')
            })
          }), overlayIconImageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            style: {
              marginTop: 8
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
              src: overlayIconImageUrl,
              alt: "",
              style: {
                maxWidth: '100%',
                height: 'auto'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              variant: "secondary",
              onClick: () => setAttributes({
                overlayIconImageUrl: '',
                overlayIconImageId: 0
              }),
              style: {
                marginTop: 8
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Image', 'jankx')
            })]
          })]
        }), (overlayIconType === 'image' ? !!overlayIconImageUrl : overlayIconType === 'text' ? !!overlayIconText : !!overlayIcon) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Mode', 'jankx'),
            value: overlayIconShowMode,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Always Show', 'jankx'),
              value: 'always-show'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show on Hover', 'jankx'),
              value: 'hover-show'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide on Hover', 'jankx'),
              value: 'hover-hide'
            }],
            onChange: value => setAttributes({
              overlayIconShowMode: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Position', 'jankx'),
            value: overlayIconPosition,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Center', 'jankx'),
              value: 'center'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Left', 'jankx'),
              value: 'top-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Right', 'jankx'),
              value: 'top-right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Left', 'jankx'),
              value: 'bottom-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Right', 'jankx'),
              value: 'bottom-right'
            }],
            onChange: value => setAttributes({
              overlayIconPosition: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Target Area', 'jankx'),
            value: overlayIconTarget,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured Image', 'jankx'),
              value: 'featured-image'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entry Image', 'jankx'),
              value: 'entry-image'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entire Item', 'jankx'),
              value: 'entire-item'
            }],
            onChange: value => setAttributes({
              overlayIconTarget: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Size', 'jankx'),
            value: overlayIconSize,
            min: 10,
            max: 100,
            step: 1,
            onChange: value => setAttributes({
              overlayIconSize: value || 24
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Color', 'jankx'),
            value: overlayIconColor,
            onChange: value => setAttributes({
              overlayIconColor: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use CSS color value, e.g., #ffffff', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Background', 'jankx'),
            value: overlayIconBackground,
            onChange: value => setAttributes({
              overlayIconBackground: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use RGBA for transparency, e.g., rgba(0,0,0,0.5)', 'jankx')
          })]
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
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scroll Animation', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Type', 'jankx'),
          value: animationType || 'none',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
            value: 'none'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In', 'jankx'),
            value: 'fade-in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Up', 'jankx'),
            value: 'fade-in-up'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Down', 'jankx'),
            value: 'fade-in-down'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Left', 'jankx'),
            value: 'fade-in-left'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Right', 'jankx'),
            value: 'fade-in-right'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom In', 'jankx'),
            value: 'zoom-in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide In Up', 'jankx'),
            value: 'slide-in-up'
          }],
          onChange: value => setAttributes({
            animationType: value
          })
        }), animationType !== 'none' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Duration (ms)', 'jankx'),
            value: animationDuration,
            onChange: value => setAttributes({
              animationDuration: value || 1000
            }),
            min: 100,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Delay (ms)', 'jankx'),
            value: animationDelay,
            onChange: value => setAttributes({
              animationDelay: value || 0
            }),
            min: 0,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Target', 'jankx'),
            value: animationTarget || 'entry',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Whole Item (Entry)', 'jankx'),
              value: 'entry'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Only', 'jankx'),
              value: 'thumbnail'
            }],
            onChange: value => setAttributes({
              animationTarget: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reverse Animation on Scroll Out', 'jankx'),
            checked: animationReverse,
            onChange: value => setAttributes({
              animationReverse: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide item when scroll back up', 'jankx')
          })]
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