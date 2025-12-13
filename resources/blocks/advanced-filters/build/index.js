/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-filters/block.json":
/*!********************************************!*\
  !*** ./blocks/advanced-filters/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-filters","version":"1.0.0","title":"Advanced Filters","category":"jankx","icon":"filter","description":"Hiển thị bộ lọc nâng cao để filter posts trong Post Type Layout blocks","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","viewScript":"file:./build/frontend.js","providesContext":{"jankx/advanced-filters/targetPostType":"targetPostType","jankx/advanced-filters/layout":"layout","jankx/advanced-filters/displayStyle":"displayStyle","jankx/advanced-filters/showLabels":"showLabels","jankx/advanced-filters/showCount":"showCount","jankx/advanced-filters/showEmptyTerms":"showEmptyTerms","jankx/advanced-filters/showOnlyTopLevel":"showOnlyTopLevel","jankx/advanced-filters/showHierarchy":"showHierarchy","jankx/advanced-filters/multipleSelection":"multipleSelection","jankx/advanced-filters/collapsible":"collapsible","jankx/advanced-filters/defaultExpanded":"defaultExpanded"},"supports":{"html":false,"align":["wide","full"],"anchor":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"blockId":{"type":"string","default":""},"targetBlockIds":{"type":"array","default":[]},"filterType":{"type":"string","default":"taxonomy","enum":["taxonomy","meta","price","date","author","keyword","mixed"]},"layout":{"type":"string","default":"horizontal","enum":["horizontal","vertical","dropdown","accordion"]},"targetPostType":{"type":"string","default":"post"},"showLabels":{"type":"boolean","default":true},"showResetButton":{"type":"boolean","default":true},"resetButtonText":{"type":"string","default":"Reset Filters"},"ajaxEnabled":{"type":"boolean","default":true},"updateUrl":{"type":"boolean","default":true},"scrollToResults":{"type":"boolean","default":false},"taxonomyFilters":{"type":"array","default":[]},"metaFilters":{"type":"array","default":[]},"priceFilters":{"type":"array","default":[]},"dateFilters":{"type":"array","default":[]},"authorFilters":{"type":"array","default":[]},"keywordFilter":{"type":"object","default":{"enabled":false,"placeholder":"Search..."}},"displayStyle":{"type":"string","default":"buttons","enum":["buttons","checkboxes","dropdown","select"]},"showCount":{"type":"boolean","default":false},"showEmptyTerms":{"type":"boolean","default":true},"showOnlyTopLevel":{"type":"boolean","default":false},"showHierarchy":{"type":"boolean","default":false},"displayAsDropdown":{"type":"boolean","default":false},"multipleSelection":{"type":"boolean","default":true},"collapsible":{"type":"boolean","default":false},"defaultExpanded":{"type":"boolean","default":true}}}');

/***/ }),

/***/ "./blocks/advanced-filters/editor.scss":
/*!*********************************************!*\
  !*** ./blocks/advanced-filters/editor.scss ***!
  \*********************************************/
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

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["wp"]["serverSideRender"];

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
/*!*******************************************!*\
  !*** ./blocks/advanced-filters/index.tsx ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-filters/block.json");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./editor.scss */ "./blocks/advanced-filters/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);








// Import styles - editor.scss already imports style.scss


function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    blockId,
    targetBlockIds,
    filterType,
    layout,
    showLabels,
    showResetButton,
    resetButtonText,
    ajaxEnabled,
    updateUrl,
    scrollToResults,
    taxonomyFilters,
    metaFilters,
    priceFilters,
    dateFilters,
    authorFilters,
    keywordFilter,
    displayStyle,
    showCount,
    showEmptyTerms,
    showOnlyTopLevel,
    showHierarchy,
    displayAsDropdown,
    multipleSelection,
    collapsible,
    defaultExpanded
  } = attributes;
  const [availableBlocks, setAvailableBlocks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [loadingBlocks, setLoadingBlocks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);

  // Lấy danh sách block con advanced-filter
  const innerFilterBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const block = select('core/block-editor').getBlock(clientId);
    return block?.innerBlocks || [];
  }, [clientId]);

  // Dùng useMemo để tránh setAttributes lặp lại nếu dữ liệu không đổi
  const normalizedFilters = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const nextTax = [];
    const nextMeta = [];
    const nextPrice = [];
    const nextDate = [];
    const nextAuthor = [];
    const nextKeyword = [];
    innerFilterBlocks.forEach(block => {
      const filter = block.attributes || {};
      const type = filter.filterType || 'taxonomy';
      switch (type) {
        case 'taxonomy':
          nextTax.push(filter);
          break;
        case 'meta':
          nextMeta.push(filter);
          break;
        case 'price':
          nextPrice.push(filter);
          break;
        case 'date':
          nextDate.push(filter);
          break;
        case 'author':
          nextAuthor.push(filter);
          break;
        case 'keyword':
          nextKeyword.push(filter);
          break;
        default:
          break;
      }
    });
    return {
      taxonomyFilters: nextTax,
      metaFilters: nextMeta,
      priceFilters: nextPrice,
      dateFilters: nextDate,
      authorFilters: nextAuthor,
      keywordFilter: nextKeyword[0] || keywordFilter || {}
    };
  }, [innerFilterBlocks, keywordFilter]);

  // Get post type from target block
  const targetPostType = targetBlockIds.length > 0 && availableBlocks.length > 0 ? availableBlocks.find(b => b.id === targetBlockIds[0])?.postType || 'post' : 'post';

  // Ensure blockId is set to clientId for frontend matching
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!blockId && clientId) {
      setAttributes({
        blockId: clientId
      });
    }
  }, [blockId, clientId, setAttributes]);

  // Use blockProps without additional classes since PHP render already includes full wrapper
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();

  // Đồng bộ filters từ block con lên attributes để render PHP/SSR
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const nextAttributes = {
      taxonomyFilters: normalizedFilters.taxonomyFilters,
      metaFilters: normalizedFilters.metaFilters,
      priceFilters: normalizedFilters.priceFilters,
      dateFilters: normalizedFilters.dateFilters,
      authorFilters: normalizedFilters.authorFilters,
      keywordFilter: normalizedFilters.keywordFilter,
      targetPostType
    };
    const currentSnapshot = JSON.stringify({
      taxonomyFilters,
      metaFilters,
      priceFilters,
      dateFilters,
      authorFilters,
      keywordFilter,
      targetPostType
    });
    const nextSnapshot = JSON.stringify(nextAttributes);
    if (currentSnapshot !== nextSnapshot) {
      setAttributes(nextAttributes);
    }
  }, [normalizedFilters, taxonomyFilters, metaFilters, priceFilters, dateFilters, authorFilters, keywordFilter, targetPostType, setAttributes]);

  // Helper function to find dynamic-data-layout blocks recursively
  const findDynamicDataLayoutBlocks = blocks => {
    const found = [];
    const traverse = blockList => {
      blockList.forEach(block => {
        if (block.name === 'jankx/dynamic-data-layout') {
          const queryId = block.attributes?.queryId || block.clientId;
          found.push({
            id: String(queryId || block.clientId),
            name: `${block.attributes?.postType || 'post'} Layout`,
            postType: block.attributes?.postType || 'post',
            source: 'current_page'
          });
        }
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          traverse(block.innerBlocks);
        }
      });
    };
    traverse(blocks);
    return found;
  };

  // Get available dynamic-data-layout blocks from current page only
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const getAvailableBlocks = () => {
      setLoadingBlocks(true);
      try {
        // Get blocks from current page/post context only
        const currentBlocks = window.wp.data.select('core/block-editor').getBlocks();
        if (currentBlocks && currentBlocks.length > 0) {
          const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
          setAvailableBlocks(dynamicDataLayoutBlocks);
        } else {
          setAvailableBlocks([]);
        }
      } catch (error) {
        console.error('Error getting blocks from current page:', error);
        setAvailableBlocks([]);
      } finally {
        setLoadingBlocks(false);
      }
    };

    // Get blocks immediately
    getAvailableBlocks();

    // Subscribe to block changes to update list when blocks are added/removed
    let timeoutId = null;
    const unsubscribe = window.wp.data.subscribe(() => {
      // Debounce to avoid too many updates
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        const currentBlocks = window.wp.data.select('core/block-editor').getBlocks();
        if (currentBlocks) {
          const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
          setAvailableBlocks(dynamicDataLayoutBlocks);
        }
      }, 300);
    });
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Use the appender in block content to add filters

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Target Blocks', 'jankx'),
        initialOpen: true,
        children: loadingBlocks ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Dynamic Data Layout blocks to filter:', 'jankx')
          }), availableBlocks.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No Dynamic Data Layout blocks found in this page. Add a Dynamic Data Layout block to this page first.', 'jankx')
            })
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            style: {
              marginTop: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Target Block(s)', 'jankx'),
              value: targetBlockIds.length > 0 ? targetBlockIds[0] : '',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Select Block --', 'jankx'),
                value: ''
              }, ...availableBlocks.map(block => ({
                label: `${block.name || `Block ${block.id}`}${block.source ? ` (${block.source})` : ''}`,
                value: block.id
              }))],
              onChange: value => {
                if (value) {
                  // Single selection for now, can be extended to multiple
                  setAttributes({
                    targetBlockIds: [value]
                  });
                } else {
                  setAttributes({
                    targetBlockIds: []
                  });
                }
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select the Dynamic Data Layout block you want to filter.', 'jankx')
            }), targetBlockIds.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
              style: {
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f0f0f1',
                borderRadius: '4px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Selected:', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
                style: {
                  margin: '5px 0',
                  paddingLeft: '20px'
                },
                children: targetBlockIds.map(id => {
                  const block = availableBlocks.find(b => b.id === id);
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("li", {
                    children: [block?.name || id, block?.source && ` (${block.source})`]
                  }, id);
                })
              })]
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filters', 'jankx'),
        initialOpen: false,
        children: targetBlockIds.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          style: {
            color: '#d63638',
            marginBottom: '10px'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please select a target block first to configure filters.', 'jankx')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("p", {
          style: {
            marginBottom: '10px',
            fontSize: '12px',
            color: '#666'
          },
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Type:', 'jankx'), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
            children: targetPostType
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AJAX Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable AJAX', 'jankx'),
          checked: ajaxEnabled,
          onChange: value => setAttributes({
            ajaxEnabled: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Update results without page reload', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Update URL', 'jankx'),
          checked: updateUrl,
          onChange: value => setAttributes({
            updateUrl: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Update browser URL with filter parameters', 'jankx'),
          disabled: !ajaxEnabled
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scroll to Results', 'jankx'),
          checked: scrollToResults,
          onChange: value => setAttributes({
            scrollToResults: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scroll to target block after filtering', 'jankx'),
          disabled: !ajaxEnabled
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset Button', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Reset Button', 'jankx'),
          checked: showResetButton,
          onChange: value => setAttributes({
            showResetButton: value
          })
        }), showResetButton && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset Button Text', 'jankx'),
          value: resetButtonText,
          onChange: value => setAttributes({
            resetButtonText: value
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        style: {
          marginBottom: '15px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
          allowedBlocks: ['jankx/advanced-filter'],
          renderAppender: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.ButtonBlockAppender, {})
        })
      }), targetBlockIds.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
        icon: "filter",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Advanced Filters', 'jankx'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please select at least one target block to filter in the sidebar.', 'jankx')
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_6___default()), {
        block: "jankx/advanced-filters",
        attributes: attributes
      })]
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_7__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_7__,
  edit: Edit,
  save: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, {}) // Lưu block con để giữ cấu hình filter
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map