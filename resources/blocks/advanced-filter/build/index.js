/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-filter/block.json":
/*!*******************************************!*\
  !*** ./blocks/advanced-filter/block.json ***!
  \*******************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-filter","version":"1.0.0","title":"Advanced Filter","category":"jankx","parent":["jankx/advanced-filters","jankx/smart-tab"],"icon":"filter","description":"Một filter đơn lẻ dùng bên trong Advanced Filters.","textdomain":"jankx","supports":{"html":false,"reusable":false},"attributes":{"filterType":{"type":"string","default":"taxonomy","enum":["taxonomy","meta","price","date","author","keyword"]},"label":{"type":"string","default":""},"enabled":{"type":"boolean","default":true},"taxonomy":{"type":"string","default":""},"displayStyle":{"type":"string","default":"buttons","enum":["buttons","checkboxes","dropdown","select"]},"listingType":{"type":"string","default":"ul","enum":["ul","ol","none"]},"showCount":{"type":"boolean","default":false},"showEmptyTerms":{"type":"boolean","default":true},"showOnlyTopLevel":{"type":"boolean","default":false},"showHierarchy":{"type":"boolean","default":false},"multipleSelection":{"type":"boolean","default":true},"layout":{"type":"string","default":"horizontal","enum":["horizontal","vertical","dropdown","accordion"]},"showLabels":{"type":"boolean","default":true},"collapsible":{"type":"boolean","default":false},"defaultExpanded":{"type":"boolean","default":true},"metaKey":{"type":"string","default":""},"inputType":{"type":"string","default":"text","enum":["text","number","range","date","date-range"]},"minValue":{"type":"string","default":""},"maxValue":{"type":"string","default":""},"placeholder":{"type":"string","default":""},"minPrice":{"type":"string","default":""},"maxPrice":{"type":"string","default":""},"currency":{"type":"string","default":"VND"},"dateField":{"type":"string","default":"post_date"},"dateRange":{"type":"boolean","default":true},"showSearchButton":{"type":"boolean","default":false},"filterValue":{"type":"string","default":""},"filterValueMin":{"type":"string","default":""},"filterValueMax":{"type":"string","default":""},"filterValueStart":{"type":"string","default":""},"filterValueEnd":{"type":"string","default":""}},"editorScript":"file:./build/index.js"}');

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
/*!******************************************!*\
  !*** ./blocks/advanced-filter/index.tsx ***!
  \******************************************/
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
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-filter/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
  const {
    filterType,
    label,
    enabled,
    taxonomy,
    displayStyle,
    listingType,
    showCount,
    showEmptyTerms,
    showOnlyTopLevel,
    showHierarchy,
    multipleSelection,
    layout,
    showLabels,
    collapsible,
    defaultExpanded,
    metaKey,
    inputType,
    minValue,
    maxValue,
    placeholder,
    minPrice,
    maxPrice,
    currency,
    dateField,
    dateRange,
    showSearchButton,
    filterValue,
    filterValueMin,
    filterValueMax,
    filterValueStart,
    filterValueEnd
  } = attributes;
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [terms, setTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [loadingTerms, setLoadingTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [loadingAuthors, setLoadingAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);

  // Kiểm tra parent block và lấy attributes
  const {
    isSmartTabChild,
    parentDefaults
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const {
      getBlockParents,
      getBlock
    } = select('core/block-editor');
    const parents = getBlockParents(clientId) || [];

    // Tìm parent là smart-tab trước (cho advanced filter trigger)
    let parentId = parents.find(id => getBlock(id)?.name === 'jankx/smart-tab');
    if (parentId) {
      const parent = getBlock(parentId);
      const attrs = parent?.attributes || {};
      const triggerSettings = attrs.triggerSettings || {};
      const targetBlockId = triggerSettings.targetBlockId;

      // Tìm dynamic-data-layout block để lấy post type
      let targetPostType = 'post';
      if (targetBlockId) {
        const allBlocks = select('core/block-editor').getBlocks();
        const findBlock = blocks => {
          for (const block of blocks) {
            if (block.name === 'jankx/dynamic-data-layout') {
              const queryId = block.attributes?.queryId || block.clientId;
              if (String(queryId) === targetBlockId) {
                return block;
              }
            }
            if (block.innerBlocks?.length > 0) {
              const found = findBlock(block.innerBlocks);
              if (found) return found;
            }
          }
          return null;
        };
        const targetBlock = findBlock(allBlocks);
        if (targetBlock) {
          targetPostType = targetBlock.attributes?.postType || 'post';
        }
      }
      return {
        isSmartTabChild: true,
        parentDefaults: {
          targetPostType
        }
      };
    }

    // Fallback: tìm parent là advanced-filters
    parentId = parents.find(id => getBlock(id)?.name === 'jankx/advanced-filters');
    if (parentId) {
      const parent = getBlock(parentId);
      return {
        isSmartTabChild: false,
        parentDefaults: parent?.attributes || {}
      };
    }
    return {
      isSmartTabChild: false,
      parentDefaults: {}
    };
  }, [clientId]);
  const resolvedTargetPostType = parentDefaults.targetPostType || 'post';
  const resolvedDisplayStyle = displayStyle || parentDefaults.displayStyle || 'buttons';
  const resolvedLayout = layout || parentDefaults.layout || 'horizontal';
  const resolvedShowLabels = (_ref = showLabels !== null && showLabels !== void 0 ? showLabels : parentDefaults.showLabels) !== null && _ref !== void 0 ? _ref : true;
  const resolvedShowCount = (_ref2 = showCount !== null && showCount !== void 0 ? showCount : parentDefaults.showCount) !== null && _ref2 !== void 0 ? _ref2 : false;
  const resolvedShowEmptyTerms = (_ref3 = showEmptyTerms !== null && showEmptyTerms !== void 0 ? showEmptyTerms : parentDefaults.showEmptyTerms) !== null && _ref3 !== void 0 ? _ref3 : true;
  const resolvedShowOnlyTopLevel = (_ref4 = showOnlyTopLevel !== null && showOnlyTopLevel !== void 0 ? showOnlyTopLevel : parentDefaults.showOnlyTopLevel) !== null && _ref4 !== void 0 ? _ref4 : false;
  const resolvedShowHierarchy = (_ref5 = showHierarchy !== null && showHierarchy !== void 0 ? showHierarchy : parentDefaults.showHierarchy) !== null && _ref5 !== void 0 ? _ref5 : false;
  const resolvedMultiple = (_ref6 = multipleSelection !== null && multipleSelection !== void 0 ? multipleSelection : parentDefaults.multipleSelection) !== null && _ref6 !== void 0 ? _ref6 : true;
  const resolvedCollapsible = (_ref7 = collapsible !== null && collapsible !== void 0 ? collapsible : parentDefaults.collapsible) !== null && _ref7 !== void 0 ? _ref7 : false;
  const resolvedDefaultExpanded = (_ref8 = defaultExpanded !== null && defaultExpanded !== void 0 ? defaultExpanded : parentDefaults.defaultExpanded) !== null && _ref8 !== void 0 ? _ref8 : true;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: 'jankx-advanced-filter'
  });
  const filterTitle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const typeLabel = filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : 'Filter';
    return label || `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter', 'jankx')} (${typeLabel})`;
  }, [label, filterType]);

  // Fetch taxonomies theo post type từ parent
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!resolvedTargetPostType) return;
    setLoadingTaxonomies(true);
    (async () => {
      try {
        const taxData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${resolvedTargetPostType}`
        });
        const list = Object.values(taxData || {});
        setTaxonomies(list);
      } catch (e) {
        setTaxonomies([]);
      } finally {
        setLoadingTaxonomies(false);
      }
    })();
  }, [resolvedTargetPostType]);

  // Fetch terms theo taxonomy đã chọn (preview cho editor)
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!taxonomy) {
      setTerms([]);
      return;
    }
    setLoadingTerms(true);
    (async () => {
      try {
        const termsData = await window.wp.apiFetch({
          path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
        });
        setTerms(Array.isArray(termsData) ? termsData : []);
      } catch (e) {
        setTerms([]);
      } finally {
        setLoadingTerms(false);
      }
    })();
  }, [taxonomy]);

  // Fetch authors khi filterType là author
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (filterType !== 'author') {
      setAuthors([]);
      return;
    }
    setLoadingAuthors(true);
    (async () => {
      try {
        const usersData = await window.wp.apiFetch({
          path: '/wp/v2/users?per_page=100&orderby=name&order=asc'
        });
        setAuthors(Array.isArray(usersData) ? usersData : []);
      } catch (e) {
        setAuthors([]);
      } finally {
        setLoadingAuthors(false);
      }
    })();
  }, [filterType]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("p", {
          style: {
            marginBottom: '8px',
            fontSize: '12px',
            color: '#555'
          },
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post type kế thừa từ Advanced Filters:', 'jankx'), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
            children: resolvedTargetPostType
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Type', 'jankx'),
          value: filterType,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy', 'jankx'),
            value: 'taxonomy'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Field', 'jankx'),
            value: 'meta'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Price', 'jankx'),
            value: 'price'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date', 'jankx'),
            value: 'date'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Author', 'jankx'),
            value: 'author'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Keyword', 'jankx'),
            value: 'keyword'
          }],
          onChange: value => setAttributes({
            filterType: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label (Optional)', 'jankx'),
          value: label || '',
          onChange: value => setAttributes({
            label: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom label for this filter', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enabled', 'jankx'),
          checked: enabled !== false,
          onChange: value => setAttributes({
            enabled: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Settings', 'jankx'),
        initialOpen: true,
        children: [filterType === 'taxonomy' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy', 'jankx'),
            value: taxonomy || '',
            options: [{
              label: loadingTaxonomies ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading...', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Select --', 'jankx'),
              value: ''
            }, ...taxonomies.map(tax => ({
              label: tax.name,
              value: tax.slug
            }))],
            onChange: value => setAttributes({
              taxonomy: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy lấy theo post type của block cha', 'jankx')
          }), !isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Style', 'jankx'),
              value: resolvedDisplayStyle,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Buttons', 'jankx'),
                value: 'buttons'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Checkboxes', 'jankx'),
                value: 'checkboxes'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dropdown', 'jankx'),
                value: 'dropdown'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select', 'jankx'),
                value: 'select'
              }],
              onChange: value => setAttributes({
                displayStyle: value
              })
            }), resolvedDisplayStyle === 'checkboxes' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Listing Type', 'jankx'),
              value: listingType || 'ul',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unordered List (•)', 'jankx'),
                value: 'ul'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ordered List (1, 2, 3)', 'jankx'),
                value: 'ol'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No List', 'jankx'),
                value: 'none'
              }],
              onChange: value => setAttributes({
                listingType: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Post Counts', 'jankx'),
              checked: resolvedShowCount,
              onChange: value => setAttributes({
                showCount: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Empty Terms', 'jankx'),
              checked: resolvedShowEmptyTerms,
              onChange: value => setAttributes({
                showEmptyTerms: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Only Top Level Terms', 'jankx'),
              checked: resolvedShowOnlyTopLevel,
              onChange: value => setAttributes({
                showOnlyTopLevel: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Hierarchy', 'jankx'),
              checked: resolvedShowHierarchy,
              onChange: value => setAttributes({
                showHierarchy: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Multiple Selection', 'jankx'),
              checked: resolvedMultiple,
              onChange: value => setAttributes({
                multipleSelection: value
              })
            })]
          }), isSmartTabChild && taxonomy && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Term', 'jankx'),
            value: filterValue || 'all',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tất cả', 'jankx'),
              value: 'all'
            }, ...(loadingTerms ? [] : terms.map(term => ({
              label: `${term.name}${term.count !== undefined ? ` (${term.count})` : ''}`,
              value: String(term.id)
            })))],
            onChange: value => setAttributes({
              filterValue: value === 'all' ? '' : value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chọn "Tất cả" để hiển thị tất cả data, hoặc chọn term cụ thể để filter', 'jankx')
          }), !isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            style: {
              marginTop: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
              style: {
                display: 'block',
                marginBottom: '6px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preview terms', 'jankx')
            }), loadingTerms ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {}) : terms.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No terms found', 'jankx')
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("ul", {
              style: {
                maxHeight: '120px',
                overflow: 'auto',
                paddingLeft: '16px'
              },
              children: terms.map(term => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("li", {
                children: [term.name, " ", term.count !== undefined ? `(${term.count})` : '']
              }, term.id))
            })]
          })]
        }), filterType === 'meta' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'jankx'),
            value: metaKey || '',
            onChange: value => setAttributes({
              metaKey: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('e.g., _price, custom_field', 'jankx')
          }), !isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Input Type', 'jankx'),
              value: inputType || 'text',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text', 'jankx'),
                value: 'text'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number', 'jankx'),
                value: 'number'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Number Range', 'jankx'),
                value: 'range'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date', 'jankx'),
                value: 'date'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date Range', 'jankx'),
                value: 'date-range'
              }],
              onChange: value => setAttributes({
                inputType: value
              })
            }), inputType === 'range' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Min Value', 'jankx'),
                value: minValue || '',
                onChange: value => setAttributes({
                  minValue: value
                }),
                type: "number"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max Value', 'jankx'),
                value: maxValue || '',
                onChange: value => setAttributes({
                  maxValue: value
                }),
                type: "number"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Placeholder', 'jankx'),
              value: placeholder || '',
              onChange: value => setAttributes({
                placeholder: value
              })
            })]
          }), isSmartTabChild && metaKey && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Value', 'jankx'),
            value: filterValue || '',
            onChange: value => setAttributes({
              filterValue: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nhập giá trị meta để filter', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Giá trị meta để filter khi tab được click', 'jankx')
          })]
        }), filterType === 'price' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [!isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Currency Symbol', 'jankx'),
            value: currency || 'VND',
            onChange: value => setAttributes({
              currency: value
            })
          }), isSmartTabChild ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Min Price', 'jankx'),
              value: filterValueMin || '',
              onChange: value => setAttributes({
                filterValueMin: value
              }),
              type: "number",
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Giá tối thiểu', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max Price', 'jankx'),
              value: filterValueMax || '',
              onChange: value => setAttributes({
                filterValueMax: value
              }),
              type: "number",
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Giá tối đa', 'jankx')
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Min Price', 'jankx'),
              value: minPrice || '',
              onChange: value => setAttributes({
                minPrice: value
              }),
              type: "number"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max Price', 'jankx'),
              value: maxPrice || '',
              onChange: value => setAttributes({
                maxPrice: value
              }),
              type: "number"
            })]
          })]
        }), filterType === 'date' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [!isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date Field', 'jankx'),
              value: dateField || 'post_date',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Date', 'jankx'),
                value: 'post_date'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modified Date', 'jankx'),
                value: 'post_modified'
              }],
              onChange: value => setAttributes({
                dateField: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date Range', 'jankx'),
              checked: dateRange !== undefined ? dateRange : true,
              onChange: value => setAttributes({
                dateRange: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Allow users to select a date range', 'jankx')
            })]
          }), isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start Date', 'jankx'),
              type: "date",
              value: filterValueStart || '',
              onChange: value => setAttributes({
                filterValueStart: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ngày bắt đầu để filter', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('End Date', 'jankx'),
              type: "date",
              value: filterValueEnd || '',
              onChange: value => setAttributes({
                filterValueEnd: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ngày kết thúc để filter', 'jankx')
            })]
          })]
        }), filterType === 'author' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [!isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Style', 'jankx'),
              value: resolvedDisplayStyle,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dropdown', 'jankx'),
                value: 'dropdown'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Checkboxes', 'jankx'),
                value: 'checkboxes'
              }],
              onChange: value => setAttributes({
                displayStyle: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Multiple Selection', 'jankx'),
              checked: resolvedMultiple,
              onChange: value => setAttributes({
                multipleSelection: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Allow users to select multiple authors', 'jankx')
            })]
          }), isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Author', 'jankx'),
            value: filterValue || '',
            options: [{
              label: loadingAuthors ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading...', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Select Author --', 'jankx'),
              value: ''
            }, ...authors.map(author => ({
              label: author.name,
              value: String(author.id)
            }))],
            onChange: value => setAttributes({
              filterValue: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chọn author để filter khi tab được click', 'jankx')
          })]
        }), filterType === 'keyword' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [!isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Placeholder', 'jankx'),
              value: placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search...', 'jankx'),
              onChange: value => setAttributes({
                placeholder: value
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Search Button', 'jankx'),
              checked: showSearchButton !== undefined ? showSearchButton : false,
              onChange: value => setAttributes({
                showSearchButton: value
              })
            })]
          }), isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search Keyword', 'jankx'),
            value: filterValue || '',
            onChange: value => setAttributes({
              filterValue: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nhập từ khóa để filter', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Từ khóa để filter khi tab được click', 'jankx')
          })]
        })]
      }), !isSmartTabChild && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout', 'jankx'),
          value: resolvedLayout,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Horizontal', 'jankx'),
            value: 'horizontal'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vertical', 'jankx'),
            value: 'vertical'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dropdown', 'jankx'),
            value: 'dropdown'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Accordion', 'jankx'),
            value: 'accordion'
          }],
          onChange: value => setAttributes({
            layout: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Labels', 'jankx'),
          checked: resolvedShowLabels,
          onChange: value => setAttributes({
            showLabels: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collapsible', 'jankx'),
          checked: resolvedCollapsible,
          onChange: value => setAttributes({
            collapsible: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Make filter collapsible', 'jankx')
        }), resolvedCollapsible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Default Expanded', 'jankx'),
          checked: resolvedDefaultExpanded,
          onChange: value => setAttributes({
            defaultExpanded: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show filter expanded by default', 'jankx')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      ...blockProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("strong", {
        children: filterTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        style: {
          fontSize: '12px',
          color: '#555'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type', 'jankx'), ": ", filterType]
        }), taxonomy && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Taxonomy', 'jankx'), ": ", taxonomy]
        }), label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'jankx'), ": ", label]
        })]
      })]
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_6__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_6__,
  edit: Edit,
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map