/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/post-type-layout/block.json":
/*!********************************************!*\
  !*** ./blocks/post-type-layout/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/post-type-layout","version":"1.0.0","title":"Post Type Layout","category":"design","icon":"layout","description":"Hiển thị danh sách posts theo layout tùy chỉnh","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","query":{"postType":"postType","perPage":"postsPerPage","pages":0,"offset":"offset","order":"order","orderBy":"orderBy","inherit":false}},"usesContext":["queryId","query"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom","enum":["default","related","custom"]},"postType":{"type":"string","default":"post"},"postsPerPage":{"type":"number","default":10},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"showTitle":{"type":"boolean","default":true},"showExcerpt":{"type":"boolean","default":true},"showFeaturedImage":{"type":"boolean","default":true},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"excerptLength":{"type":"number","default":55},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"number"},"enablePagination":{"type":"boolean","default":false},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""}}}');

/***/ }),

/***/ "./blocks/post-type-layout/editor.scss":
/*!*********************************************!*\
  !*** ./blocks/post-type-layout/editor.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/post-type-layout/style.scss":
/*!********************************************!*\
  !*** ./blocks/post-type-layout/style.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./shared/components/ResponsiveControl.tsx":
/*!*************************************************!*\
  !*** ./shared/components/ResponsiveControl.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResponsiveControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function ResponsiveControl({
  label,
  values,
  onChange,
  min = 1,
  max = 6,
  step = 1,
  help = {},
  className = ''
}) {
  const [selectedDevice, setSelectedDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('desktop');
  const handleValueChange = value => {
    if (value === undefined) return;
    onChange({
      ...values,
      [selectedDevice]: value
    });
  };
  const getCurrentValue = () => values[selectedDevice];
  const getCurrentHelp = () => help[selectedDevice];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `responsive-control ${className}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      style: {
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#1e1e1e',
          margin: 0
        },
        children: label
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'desktop',
          onClick: () => setSelectedDevice('desktop'),
          variant: selectedDevice === 'desktop' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop', 'jankx'),
          children: "\uD83D\uDDA5\uFE0F"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'tablet',
          onClick: () => setSelectedDevice('tablet'),
          variant: selectedDevice === 'tablet' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tablet', 'jankx'),
          children: "\uD83D\uDCF1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'mobile',
          onClick: () => setSelectedDevice('mobile'),
          variant: selectedDevice === 'mobile' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mobile', 'jankx'),
          children: "\uD83D\uDCF1"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} ${label}`, 'jankx'),
      value: getCurrentValue(),
      onChange: handleValueChange,
      min: min,
      max: max,
      step: step,
      help: getCurrentHelp()
    })]
  });
}

/***/ }),

/***/ "./shared/components/index.ts":
/*!************************************!*\
  !*** ./shared/components/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveControl: () => (/* reexport safe */ _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useResponsiveValue: () => (/* reexport safe */ _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__.useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ResponsiveControl */ "./shared/components/ResponsiveControl.tsx");
/* harmony import */ var _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useResponsiveValue */ "./shared/components/useResponsiveValue.ts");



/***/ }),

/***/ "./shared/components/useResponsiveValue.ts":
/*!*************************************************!*\
  !*** ./shared/components/useResponsiveValue.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useResponsiveValue: () => (/* binding */ useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function useResponsiveValue(initialValues = {}) {
  const [values, setValues] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    desktop: initialValues.desktop || 3,
    tablet: initialValues.tablet || 2,
    mobile: initialValues.mobile || 1
  });
  const updateValue = (device, value) => {
    setValues(prev => ({
      ...prev,
      [device]: value
    }));
  };
  const updateValues = newValues => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };
  const resetToDefaults = defaults => {
    setValues(defaults);
  };
  return {
    values,
    updateValue,
    updateValues,
    resetToDefaults
  };
}

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

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

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
/*!*******************************************!*\
  !*** ./blocks/post-type-layout/index.tsx ***!
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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/components */ "./shared/components/index.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./block.json */ "./blocks/post-type-layout/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./style.scss */ "./blocks/post-type-layout/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./editor.scss */ "./blocks/post-type-layout/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    queryPreset,
    postType,
    postsPerPage,
    layout,
    columns,
    columnsTablet,
    columnsMobile,
    showTitle,
    showExcerpt,
    showFeaturedImage,
    showDate,
    showAuthor,
    excerptLength,
    orderBy,
    order,
    queryId,
    enablePagination,
    offset,
    taxQuery,
    metaQuery,
    keyword,
    authorIn,
    authorNotIn,
    postIn,
    postNotIn,
    metaKey,
    metaType,
    postStatus,
    postParent,
    postParentIn,
    postParentNotIn,
    customQueryId
  } = attributes;

  // Debounced attributes for ServerSideRender
  const [debouncedAttributes, setDebouncedAttributes] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(attributes);
  const [cachedHtml, setCachedHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(true);

  // States for taxonomies and authors
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)({});

  // Debounce attributes update để giảm số lần re-render
  const updateDebouncedAttributes = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__.debounce)(newAttributes => {
    setDebouncedAttributes(newAttributes);
    setIsLoading(true);
  }, 800), []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    updateDebouncedAttributes(attributes);
  }, [attributes, updateDebouncedAttributes]);

  // Generate unique queryId if not set
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (!queryId) {
      // Generate numeric ID from clientId hash
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      setAttributes({
        queryId: Math.abs(hash)
      });
    }
  }, [queryId, clientId, setAttributes]);

  // Fetch taxonomies and authors when postType changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const fetchTaxonomiesAndAuthors = async () => {
      setLoadingTaxonomies(true);
      try {
        // Fetch taxonomies for this post type
        const taxonomiesData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${postType}`
        });

        // Convert object to array
        const taxArray = Object.values(taxonomiesData || {});
        setTaxonomies(taxArray);

        // Fetch authors
        const authorsData = await window.wp.apiFetch({
          path: '/wp/v2/users?who=authors&per_page=100'
        });
        setAuthors(authorsData || []);
      } catch (error) {
        console.error('Error fetching taxonomies/authors:', error);
        setTaxonomies([]);
        setAuthors([]);
      } finally {
        setLoadingTaxonomies(false);
      }
    };
    fetchTaxonomiesAndAuthors();
  }, [postType]);

  // Function to fetch terms for a specific taxonomy
  const fetchTermsForTaxonomy = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(async taxonomy => {
    if (taxonomyTerms[taxonomy]) {
      return; // Already loaded
    }
    try {
      const terms = await window.wp.apiFetch({
        path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
      });
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: terms || []
      }));
    } catch (error) {
      console.error(`Error fetching terms for ${taxonomy}:`, error);
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: []
      }));
    }
  }, [taxonomyTerms]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: `post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
    style: {
      '--columns-desktop': columns,
      '--columns-tablet': columnsTablet,
      '--columns-mobile': columnsMobile
    }
  });

  // Get available post types
  const postTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    const {
      getPostTypes
    } = select('core');
    return getPostTypes({
      per_page: -1
    }) || [];
  }, []);
  const postTypeOptions = postTypes.filter(type => type.viewable && type.slug !== 'attachment').map(type => ({
    label: type.name,
    value: type.slug
  }));

  // Get current layout's supported options
  const supportedLayouts = window.jankxSupportedPostTypeLayouts || [];
  const currentLayout = supportedLayouts.find(l => l.name === layout);
  const supportedOptions = currentLayout?.supportedOptions || [];
  const readOnlyOptions = currentLayout?.readOnlyOptions || [];

  // Create stable key based on actual query attributes only
  // Chỉ re-render khi các attributes này thay đổi
  const renderKey = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    const keyAttributes = {
      postType: debouncedAttributes.postType,
      postsPerPage: debouncedAttributes.postsPerPage,
      layout: debouncedAttributes.layout,
      columns: debouncedAttributes.columns,
      showTitle: debouncedAttributes.showTitle,
      showExcerpt: debouncedAttributes.showExcerpt,
      showFeaturedImage: debouncedAttributes.showFeaturedImage,
      showDate: debouncedAttributes.showDate,
      showAuthor: debouncedAttributes.showAuthor,
      excerptLength: debouncedAttributes.excerptLength,
      orderBy: debouncedAttributes.orderBy,
      order: debouncedAttributes.order,
      enablePagination: debouncedAttributes.enablePagination,
      offset: debouncedAttributes.offset,
      taxQuery: debouncedAttributes.taxQuery,
      metaQuery: debouncedAttributes.metaQuery,
      keyword: debouncedAttributes.keyword,
      authorIn: debouncedAttributes.authorIn,
      authorNotIn: debouncedAttributes.authorNotIn,
      postIn: debouncedAttributes.postIn,
      postNotIn: debouncedAttributes.postNotIn,
      metaKey: debouncedAttributes.metaKey,
      metaType: debouncedAttributes.metaType,
      postStatus: debouncedAttributes.postStatus,
      postParent: debouncedAttributes.postParent,
      postParentIn: debouncedAttributes.postParentIn,
      postParentNotIn: debouncedAttributes.postParentNotIn,
      customQueryId: debouncedAttributes.customQueryId
    };
    return JSON.stringify(keyAttributes);
  }, [debouncedAttributes]);

  // Fetch posts từ REST API thay vì dùng ServerSideRender
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        // Use wp.apiFetch để tự động handle authentication
        const data = await window.wp.apiFetch({
          path: `/wp/v2/block-renderer/jankx/post-type-layout?context=edit`,
          method: 'POST',
          data: {
            attributes: debouncedAttributes
          }
        });
        if (data.rendered) {
          setCachedHtml(data.rendered);
        } else {
          setCachedHtml('<div class="placeholder">No content</div>');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setCachedHtml(`<div class="error">${error?.message || 'Error rendering block'}</div>`);
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [renderKey, debouncedAttributes]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "settings",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Preset', 'jankx'),
          value: queryPreset,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Default (Main Query)', 'jankx'),
            value: 'default'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Related Posts (Same Taxonomy)', 'jankx'),
            value: 'related'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Query', 'jankx'),
            value: 'custom'
          }],
          onChange: value => setAttributes({
            queryPreset: value
          }),
          help: queryPreset === 'default' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sử dụng main query của WordPress. Các query parameters sẽ bị ẩn.', 'jankx') : queryPreset === 'related' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hiển thị posts liên quan (cùng taxonomy với post hiện tại).', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tùy chỉnh query parameters theo ý bạn.', 'jankx')
        }), queryPreset !== 'default' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => setAttributes({
            postType: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value || 10
          }),
          min: 1,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số lượng posts hiển thị', 'jankx')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout Type', 'jankx'),
          value: layout,
          options: window.jankxSupportedPostTypeLayouts?.map(layout => ({
            label: layout.title,
            value: layout.name
          })) || [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Grid', 'jankx'),
            value: 'grid'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('List', 'jankx'),
            value: 'list'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Masonry', 'jankx'),
            value: 'masonry'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Card', 'jankx'),
            value: 'card'
          }],
          onChange: value => setAttributes({
            layout: value
          })
        }), supportedOptions.includes('columns') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_7__.ResponsiveControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Columns', 'jankx'),
          values: {
            desktop: columns,
            tablet: columnsTablet,
            mobile: columnsMobile
          },
          onChange: values => setAttributes({
            columns: values.desktop,
            columnsTablet: values.tablet,
            columnsMobile: values.mobile
          }),
          min: 1,
          max: 6,
          help: {
            desktop: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số cột trên màn hình lớn (>1024px)', 'jankx'),
            tablet: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số cột trên tablet (768px - 1024px)', 'jankx'),
            mobile: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số cột trên mobile (<768px)', 'jankx')
          }
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Settings', 'jankx'),
        initialOpen: false,
        children: [supportedOptions.includes('showFeaturedImage') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Featured Image', 'jankx'),
          checked: showFeaturedImage,
          onChange: value => setAttributes({
            showFeaturedImage: value
          }),
          disabled: readOnlyOptions.includes('showFeaturedImage')
        }), supportedOptions.includes('showTitle') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Title', 'jankx'),
          checked: showTitle,
          onChange: value => setAttributes({
            showTitle: value
          }),
          disabled: readOnlyOptions.includes('showTitle')
        }), supportedOptions.includes('showExcerpt') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Excerpt', 'jankx'),
            checked: showExcerpt,
            onChange: value => setAttributes({
              showExcerpt: value
            }),
            disabled: readOnlyOptions.includes('showExcerpt')
          }), showExcerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Excerpt Length', 'jankx'),
            value: excerptLength,
            onChange: value => setAttributes({
              excerptLength: value || 55
            }),
            min: 10,
            max: 200,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Số ký tự hiển thị trong excerpt', 'jankx')
          })]
        }), supportedOptions.includes('showDate') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Date', 'jankx'),
          checked: showDate,
          onChange: value => setAttributes({
            showDate: value
          }),
          disabled: readOnlyOptions.includes('showDate')
        }), supportedOptions.includes('showAuthor') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Author', 'jankx'),
          checked: showAuthor,
          onChange: value => setAttributes({
            showAuthor: value
          }),
          disabled: readOnlyOptions.includes('showAuthor')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value || 10
          }),
          min: 1,
          max: 50
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Offset', 'jankx'),
          value: offset,
          onChange: value => setAttributes({
            offset: value || 0
          }),
          min: 0,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bỏ qua N bài viết đầu tiên', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order By', 'jankx'),
          value: orderBy,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date (Ngày đăng)', 'jankx'),
            value: 'date'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modified (Ngày sửa)', 'jankx'),
            value: 'modified'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title (Tiêu đề)', 'jankx'),
            value: 'title'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Name (Slug)', 'jankx'),
            value: 'name'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Author (Tác giả)', 'jankx'),
            value: 'author'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type (Post Type)', 'jankx'),
            value: 'type'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID', 'jankx'),
            value: 'ID'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Menu Order', 'jankx'),
            value: 'menu_order'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Random (Ngẫu nhiên)', 'jankx'),
            value: 'rand'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Comment Count (Số bình luận)', 'jankx'),
            value: 'comment_count'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Relevance (Độ liên quan)', 'jankx'),
            value: 'relevance'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Value (Giá trị meta)', 'jankx'),
            value: 'meta_value'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Value Num (Giá trị meta số)', 'jankx'),
            value: 'meta_value_num'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post__in (Thứ tự trong mảng)', 'jankx'),
            value: 'post__in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Name__in (Thứ tự slug)', 'jankx'),
            value: 'post_name__in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent__in (Thứ tự parent)', 'jankx'),
            value: 'post_parent__in'
          }],
          onChange: value => setAttributes({
            orderBy: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sắp xếp posts theo tiêu chí nào', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order', 'jankx'),
          value: order,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Descending (Giảm dần)', 'jankx'),
            value: 'DESC'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ascending (Tăng dần)', 'jankx'),
            value: 'ASC'
          }],
          onChange: value => setAttributes({
            order: value
          })
        }), (orderBy === 'meta_value' || orderBy === 'meta_value_num') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'jankx'),
            value: metaKey,
            onChange: value => setAttributes({
              metaKey: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta key để sắp xếp (bắt buộc khi dùng meta_value)', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: price, views, rating', 'jankx')
          }), orderBy === 'meta_value' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Type', 'jankx'),
            value: metaType,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }, {
              label: 'CHAR',
              value: 'CHAR'
            }, {
              label: 'DATE',
              value: 'DATE'
            }, {
              label: 'DATETIME',
              value: 'DATETIME'
            }, {
              label: 'DECIMAL',
              value: 'DECIMAL'
            }],
            onChange: value => setAttributes({
              metaType: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xác định kiểu dữ liệu để sắp xếp chính xác', 'jankx')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bật phân trang', 'jankx'),
          checked: enablePagination,
          onChange: value => setAttributes({
            enablePagination: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hiển thị pagination để phân trang posts', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔧 Advanced Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query ID', 'jankx'),
          value: customQueryId,
          onChange: value => setAttributes({
            customQueryId: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Đặt tên cho query này để apply filters cuối cùng: jankx/post-layout/query-args/{query_id}', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: featured-posts, sidebar-posts', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Status', 'jankx'),
          value: postStatus,
          suggestions: ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any'],
          onChange: tokens => setAttributes({
            postStatus: tokens
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trạng thái bài viết cần lấy (mặc định: publish)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent ID', 'jankx'),
          type: "number",
          value: postParent,
          onChange: value => setAttributes({
            postParent: parseInt(value) || 0
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Lọc posts theo parent ID (0 = tất cả)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent IDs (Include)', 'jankx'),
          value: postParentIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chỉ lấy posts có parent trong danh sách này', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Parent IDs (Exclude)', 'jankx'),
          value: postParentNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loại trừ posts có parent trong danh sách này', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: 4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔍 Keyword Search', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Từ khóa tìm kiếm', 'jankx'),
          value: keyword,
          onChange: value => setAttributes({
            keyword: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tìm kiếm theo title, content, excerpt', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nhập từ khóa...', 'jankx')
        })
      }), queryPreset === 'custom' && authors.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('👤 Author Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Authors (Include)', 'jankx'),
          value: authors.filter(a => authorIn.includes(a.id)).map(a => a.name),
          suggestions: authors.map(a => a.name),
          onChange: tokens => {
            const selectedIds = tokens.map(token => {
              const author = authors.find(a => a.name === token);
              return author?.id || 0;
            }).filter(id => id > 0);
            setAttributes({
              authorIn: selectedIds
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chỉ hiển thị bài viết của các tác giả này', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Authors (Exclude)', 'jankx'),
          value: authors.filter(a => authorNotIn.includes(a.id)).map(a => a.name),
          suggestions: authors.map(a => a.name),
          onChange: tokens => {
            const selectedIds = tokens.map(token => {
              const author = authors.find(a => a.name === token);
              return author?.id || 0;
            }).filter(id => id > 0);
            setAttributes({
              authorNotIn: selectedIds
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loại trừ bài viết của các tác giả này', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔢 Post ID Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post IDs (Include)', 'jankx'),
          value: postIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chỉ hiển thị các bài viết có ID này (phân cách bằng dấu phẩy)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post IDs (Exclude)', 'jankx'),
          value: postNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loại trừ các bài viết có ID này (phân cách bằng dấu phẩy)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: 4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('⚙️ Meta Query Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "primary",
          onClick: () => {
            const newMetaQuery = [...metaQuery];
            newMetaQuery.push({
              key: '',
              value: '',
              compare: '='
            });
            setAttributes({
              metaQuery: newMetaQuery
            });
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('+ Thêm Meta Query', 'jankx')
        }), metaQuery.map((mq, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          style: {
            marginTop: '15px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("strong", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Query', 'jankx'), " #", index + 1]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => {
                const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                setAttributes({
                  metaQuery: newMetaQuery
                });
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xóa', 'jankx')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Meta Key', 'jankx'),
            value: mq.key,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].key = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ví dụ: price, rating, views', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Compare', 'jankx'),
            value: mq.compare,
            options: [{
              label: '= (Bằng)',
              value: '='
            }, {
              label: '!= (Khác)',
              value: '!='
            }, {
              label: '> (Lớn hơn)',
              value: '>'
            }, {
              label: '>= (Lớn hơn hoặc bằng)',
              value: '>='
            }, {
              label: '< (Nhỏ hơn)',
              value: '<'
            }, {
              label: '<= (Nhỏ hơn hoặc bằng)',
              value: '<='
            }, {
              label: 'LIKE (Chứa)',
              value: 'LIKE'
            }, {
              label: 'NOT LIKE (Không chứa)',
              value: 'NOT LIKE'
            }, {
              label: 'IN (Trong danh sách)',
              value: 'IN'
            }, {
              label: 'NOT IN (Không trong danh sách)',
              value: 'NOT IN'
            }, {
              label: 'EXISTS (Tồn tại)',
              value: 'EXISTS'
            }, {
              label: 'NOT EXISTS (Không tồn tại)',
              value: 'NOT EXISTS'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].compare = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            }
          }), !['EXISTS', 'NOT EXISTS'].includes(mq.compare) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Value', 'jankx'),
            value: mq.value,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].value = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nhập giá trị...', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type (Optional)', 'jankx'),
            value: mq.type || '',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }, {
              label: 'CHAR',
              value: 'CHAR'
            }, {
              label: 'DATE',
              value: 'DATE'
            }, {
              label: 'DATETIME',
              value: 'DATETIME'
            }, {
              label: 'DECIMAL',
              value: 'DECIMAL'
            }, {
              label: 'SIGNED',
              value: 'SIGNED'
            }, {
              label: 'UNSIGNED',
              value: 'UNSIGNED'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              newMetaQuery[index].type = value;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xác định kiểu dữ liệu để so sánh chính xác', 'jankx')
          })]
        }, index))]
      }), queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map(taxonomy => {
        // Find existing query for this taxonomy
        const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
        const hasQuery = existingQueryIndex >= 0;
        const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : null;
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: `🏷️ ${taxonomy.name}`,
          initialOpen: hasQuery,
          onToggle: isOpen => {
            if (isOpen) {
              // Fetch terms when panel opens
              fetchTermsForTaxonomy(taxonomy.slug);
            }
          },
          children: !hasQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
            variant: "secondary",
            onClick: () => {
              const newTaxQuery = [...taxQuery];
              newTaxQuery.push({
                taxonomy: taxonomy.slug,
                terms: [],
                operator: 'IN'
              });
              setAttributes({
                taxQuery: newTaxQuery
              });
              fetchTermsForTaxonomy(taxonomy.slug);
            },
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thêm bộ lọc', 'jankx'), " ", taxonomy.name]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Operator', 'jankx'),
              value: currentQuery.operator,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('IN (Bao gồm)', 'jankx'),
                value: 'IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('NOT IN (Loại trừ)', 'jankx'),
                value: 'NOT IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AND (Phải có tất cả)', 'jankx'),
                value: 'AND'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EXISTS (Tồn tại)', 'jankx'),
                value: 'EXISTS'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('NOT EXISTS (Không tồn tại)', 'jankx'),
                value: 'NOT EXISTS'
              }],
              onChange: value => {
                const newTaxQuery = [...taxQuery];
                newTaxQuery[existingQueryIndex].operator = value;
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EXISTS/NOT EXISTS kiểm tra taxonomy có term nào không', 'jankx')
            }), !['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
              children: taxonomyTerms[taxonomy.slug] ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormTokenField, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Terms', 'jankx'),
                value: taxonomyTerms[taxonomy.slug].filter(term => currentQuery.terms.includes(term.id)).map(term => term.name),
                suggestions: taxonomyTerms[taxonomy.slug].map(term => term.name),
                onChange: tokens => {
                  const selectedIds = tokens.map(token => {
                    const term = taxonomyTerms[taxonomy.slug].find(t => t.name === token);
                    return term?.id || 0;
                  }).filter(id => id > 0);
                  const newTaxQuery = [...taxQuery];
                  newTaxQuery[existingQueryIndex].terms = selectedIds;
                  setAttributes({
                    taxQuery: newTaxQuery
                  });
                },
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Chọn các terms từ dropdown', 'jankx')
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {})
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              isDestructive: true,
              variant: "secondary",
              onClick: () => {
                const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              style: {
                marginTop: '10px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xóa bộ lọc', 'jankx')
            })]
          })
        }, taxonomy.slug);
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      ...blockProps,
      children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Đang tải posts...', 'jankx')
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: cachedHtml
        }
      })
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_8__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_8__,
  edit: Edit,
  save: () => null // Server-side rendering
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map