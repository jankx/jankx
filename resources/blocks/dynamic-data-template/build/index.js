/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-data-template/block.json":
/*!*************************************************!*\
  !*** ./blocks/dynamic-data-template/block.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-data-template","title":"Dynamic Data Template","category":"jankx","parent":["jankx/dynamic-data-layout"],"description":"Markup template để render từng item trong Dynamic Data Layout block","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css","usesContext":["queryId","postType","displayLayout","postsPerPage","columns","columnsTablet","columnsMobile"],"supports":{"reusable":false,"html":false,"align":["wide","full"],"layout":true,"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"spacing":{"margin":true,"padding":true,"blockGap":{"__experimentalDefault":"1.25em"},"__experimentalDefaultControls":{"blockGap":true,"padding":false,"margin":false}},"interactivity":{"clientNavigation":true},"__experimentalBorder":{"radius":true,"color":true,"width":true,"style":true}},"attributes":{"contentLoopLayout":{"type":"string","default":"default"},"className":{"type":"string","default":""},"itemSpacing":{"type":"string","default":"normal","enum":["none","compact","normal","loose"]},"showItemBorder":{"type":"boolean","default":false},"itemBorderRadius":{"type":"number","default":0},"itemPadding":{"type":"object","default":{"top":"0","right":"0","bottom":"0","left":"0"}},"thumbnailPosition":{"type":"string","default":"top","enum":["top","bottom","left","right"]},"imageRatio":{"type":"string","default":""}}}');

/***/ }),

/***/ "./blocks/dynamic-data-template/edit.tsx":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-template/edit.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






// Image ratio presets
const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
function Edit({
  attributes,
  setAttributes,
  clientId,
  context
}) {
  const {
    contentLoopLayout = 'default',
    itemSpacing = 'normal',
    showItemBorder = false,
    itemBorderRadius = 0,
    thumbnailPosition = 'top',
    imageRatio = ''
  } = attributes;

  // Image ratio handling
  const imageRatioSelectValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    if (!imageRatio) {
      return '';
    }
    if (PRESET_IMAGE_RATIOS.includes(imageRatio)) {
      return imageRatio;
    }
    return 'custom';
  }, [imageRatio]);
  const isCustomImageRatio = imageRatioSelectValue === 'custom';
  const customImageRatioValue = isCustomImageRatio && imageRatio ? imageRatio : '';

  // Get post type and settings from context
  const postType = context?.query?.postType || context?.postType || 'post';
  const postsPerPage = context?.postsPerPage || 10;
  const displayLayout = context?.displayLayout || 'grid';
  const columns = context?.columns || 3;
  const columnsTablet = context?.columnsTablet || 2;
  const columnsMobile = context?.columnsMobile || 1;

  // Get layouts data from PHP
  const layoutsData = window.jankxDynamicDataContentLoopLayouts || {
    layoutsByPostType: {},
    commonLayouts: []
  };

  // Get available layouts for current post type
  const availableLayouts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const layouts = [];

    // Use layoutsByPostType which already includes common layouts
    // This avoids duplicates since getLayoutsForPostType() already merges common + post type specific
    if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
      layoutsData.layoutsByPostType[postType].forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    } else if (layoutsData.commonLayouts) {
      // Fallback to common layouts if post type specific layouts not found
      layoutsData.commonLayouts.forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    }
    return layouts;
  }, [postType, layoutsData]);

  // Layout options for SelectControl
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    return availableLayouts.map(layoutInfo => ({
      label: layoutInfo.title || layoutInfo.name,
      value: layoutInfo.name
    }));
  }, [availableLayouts]);

  // Get default blocks for post type
  const defaultBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const defaultBlocksData = window.jankxDynamicDataTemplateDefaultBlocks || {};
    return defaultBlocksData[postType] || [];
  }, [postType]);

  // Convert default blocks to template format
  const defaultTemplate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    return defaultBlocks.map(blockConfig => [blockConfig.blockName, blockConfig.attrs]);
  }, [defaultBlocks]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `dynamic-data-template dynamic-data-template--${contentLoopLayout}`
  });

  // InnerBlocks props cho tất cả items (tất cả đều editable)
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'dynamic-data-template__inner-blocks'
  }, {
    template: defaultTemplate.length > 0 ? defaultTemplate : undefined,
    templateLock: false,
    // Allow editing inner blocks
    allowedBlocks: undefined // Allow all blocks
  });

  // Dispatch để có thể update blocks
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);

  // Get current template block innerBlocks từ store
  const templateBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlock(clientId), [clientId]);
  const currentInnerBlocks = templateBlock?.innerBlocks || [];

  // Shared state cho tất cả items - dùng React state để đồng nhất
  const [sharedInnerBlocks, setSharedInnerBlocks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(currentInnerBlocks);
  const isSyncingRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(false);
  const lastSyncedBlocksRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)('');

  // Sync: khi innerBlocks của template block thay đổi, update shared state
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (isSyncingRef.current) {
      return; // Đang sync, bỏ qua
    }
    const currentBlocksStr = JSON.stringify(currentInnerBlocks);

    // Chỉ sync nếu thực sự có thay đổi
    if (currentBlocksStr !== lastSyncedBlocksRef.current) {
      lastSyncedBlocksRef.current = currentBlocksStr;
      setSharedInnerBlocks(currentInnerBlocks);
    }
  }, [currentInnerBlocks]);

  // Calculate total items to display (including editable one)
  const totalItems = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    // Giới hạn tối đa 12 items cho performance
    return Math.min(Math.max(1, postsPerPage), 12);
  }, [postsPerPage]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Loop Layout', 'jankx'),
          value: contentLoopLayout,
          options: layoutOptions,
          onChange: value => setAttributes({
            contentLoopLayout: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Item Border', 'jankx'),
          checked: showItemBorder,
          onChange: value => setAttributes({
            showItemBorder: value
          })
        }), showItemBorder && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx'),
          value: itemBorderRadius,
          onChange: value => setAttributes({
            itemBorderRadius: value || 0
          }),
          min: 0,
          max: 50
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Position', 'jankx'),
          value: thumbnailPosition || 'top',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top (Default)', 'jankx'),
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
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose where the featured image appears relative to the content.', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Aspect Ratio', 'jankx'),
          value: imageRatioSelectValue,
          onChange: value => {
            if (value === 'custom') {
              setAttributes({
                imageRatio: ''
              });
            } else {
              setAttributes({
                imageRatio: value || ''
              });
            }
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the aspect ratio for featured images', 'jankx'),
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default (3:2)', 'jankx'),
            value: ''
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('16:9 (Landscape)', 'jankx'),
            value: '16/9'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('4:3 (Landscape)', 'jankx'),
            value: '4/3'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('21:9 (Ultra Wide)', 'jankx'),
            value: '21/9'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1:1 (Square)', 'jankx'),
            value: '1/1'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('3:4 (Portrait)', 'jankx'),
            value: '3/4'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('2:3 (Portrait)', 'jankx'),
            value: '2/3'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('9:16 (Vertical)', 'jankx'),
            value: '9/16'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'jankx'),
            value: 'custom'
          }]
        }), isCustomImageRatio && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Ratio', 'jankx'),
          value: customImageRatioValue,
          onChange: value => {
            const ratioPattern = /^\d+\/\d+$/;
            if (!value || ratioPattern.test(value)) {
              setAttributes({
                imageRatio: value || ''
              });
            }
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter aspect ratio in format: width/height (e.g., 16/9, 3/4)', 'jankx'),
          placeholder: "16/9"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
        style: {
          '--columns-desktop': columns,
          '--columns-tablet': columnsTablet,
          '--columns-mobile': columnsMobile,
          display: displayLayout === 'grid' || displayLayout === 'card' ? 'grid' : 'block',
          gridTemplateColumns: displayLayout === 'grid' || displayLayout === 'card' ? `repeat(${columns}, 1fr)` : 'none',
          gap: '1rem'
        },
        children: Array.from({
          length: totalItems
        }).map((_, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "dynamic-data-template__item",
          "data-item-index": index,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            ...innerBlocksProps
          })
        }, `template-item-${index}`))
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/dynamic-data-template/save.tsx":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-template/save.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Save({
  attributes
}) {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./blocks/dynamic-data-template/style.scss":
/*!*************************************************!*\
  !*** ./blocks/dynamic-data-template/style.scss ***!
  \*************************************************/
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

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

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
/*!************************************************!*\
  !*** ./blocks/dynamic-data-template/index.tsx ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-data-template/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/dynamic-data-template/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/dynamic-data-template/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-data-template/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map