/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/product-collection/block.json":
/*!**********************************************!*\
  !*** ./blocks/product-collection/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"woocommerce/product-collection","title":"Product Collection","description":"Display a collection of products from your store.","category":"woocommerce","keywords":["WooCommerce","Products (Beta)","all products","by attribute","by category","by tag"],"textdomain":"woocommerce","attributes":{"queryId":{"type":"number"},"query":{"type":"object"},"tagName":{"type":"string"},"displayLayout":{"type":"object","properties":{"type":{"type":"string","enum":["flex","list","carousel"]},"columns":{"type":"number"},"shrinkColumns":{"type":"boolean"}}},"dimensions":{"type":"object"},"convertedFromProducts":{"type":"boolean","default":false},"collection":{"type":"string"},"hideControls":{"default":[],"type":"array"},"queryContextIncludes":{"type":"array"},"forcePageReload":{"type":"boolean","default":false},"__privatePreviewState":{"type":"object"}},"providesContext":{"queryId":"queryId","query":"query","displayLayout":"displayLayout","dimensions":"dimensions","queryContextIncludes":"queryContextIncludes","collection":"collection","__privateProductCollectionPreviewState":"__privatePreviewState"},"usesContext":["templateSlug","postId"],"supports":{"align":["wide","full"],"anchor":true,"html":false,"__experimentalLayout":true,"interactivity":true},"editorStyle":"file:../woocommerce/product-collection-editor.css","style":"file:../woocommerce/product-collection-style.css"}');

/***/ }),

/***/ "./blocks/product-collection/collections/best-sellers.tsx":
/*!****************************************************************!*\
  !*** ./blocks/product-collection/collections/best-sellers.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chart-bar.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.BEST_SELLERS,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Best Sellers', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recommend your best-selling products.', 'woocommerce'),
  keywords: ['best selling'],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    orderBy: 'popularity',
    order: 'desc',
    perPage: 5,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ORDER, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Best selling products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/by-category.tsx":
/*!***************************************************************!*\
  !*** ./blocks/product-collection/collections/by-category.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/category.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.BY_CATEGORY,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products by Category', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products from specific categories.', 'woocommerce'),
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.HAND_PICKED, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products by Category', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PAGINATION_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/by-tag.tsx":
/*!**********************************************************!*\
  !*** ./blocks/product-collection/collections/by-tag.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/tag.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.BY_TAG,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products by Tag', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products with specific tags.', 'woocommerce'),
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.HAND_PICKED, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products by Tag', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PAGINATION_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/cross-sells.tsx":
/*!***************************************************************!*\
  !*** ./blocks/product-collection/collections/cross-sells.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attributes: () => (/* binding */ attributes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/reusable-block.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.CROSS_SELLS,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cross-Sells', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('By suggesting complementary products in the cart using cross-sells, you can significantly increase the average order value.', 'woocommerce'),
  keywords: ['boost', 'promotion'],
  scope: ['inserter', 'block'],
  usesReference: ['product', 'cart', 'order']
};
const attributes = {
  ..._constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_ATTRIBUTES,
  displayLayout: {
    type: 'flex',
    columns: 4,
    shrinkColumns: true
  },
  query: {
    ..._constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY,
    perPage: 8,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'left',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You may be interested in…', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/featured.tsx":
/*!************************************************************!*\
  !*** ./blocks/product-collection/collections/featured.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/star-filled.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.FEATURED,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured Products', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showcase your featured products.', 'woocommerce'),
  keywords: [],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    featured: true,
    perPage: 5,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FEATURED, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/hand-picked.tsx":
/*!***************************************************************!*\
  !*** ./blocks/product-collection/collections/hand-picked.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   handPickedIcon: () => (/* binding */ handPickedIcon)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const handPickedIcon = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M8.85074 4.8213L7.64702 3.92627L5.56365 6.72818L4.44959 5.89735L3.55286 7.0998L5.87107 8.82862L8.85074 4.8213Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M20 7.75004H11.1111V6.25004H20V7.75004Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M20 12.75H11.1111V11.25H20V12.75Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M6 14C7.10457 14 8 13.1046 8 12C8 10.8955 7.10457 10 6 10C4.89543 10 4 10.8955 4 12C4 13.1046 4.89543 14 6 14ZM6 13C6.55229 13 7 12.5523 7 12C7 11.4478 6.55229 11 6 11C5.44772 11 5 11.4478 5 12C5 12.5523 5.44772 13 6 13Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8 17C8 18.1046 7.10457 19 6 19C4.89543 19 4 18.1046 4 17C4 15.8955 4.89543 15 6 15C7.10457 15 8 15.8955 8 17ZM7 17C7 17.5523 6.55229 18 6 18C5.44772 18 5 17.5523 5 17C5 16.4478 5.44772 16 6 16C6.55229 16 7 16.4478 7 17Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11.1111 17.75H20V16.25H11.1111V17.75Z",
    fill: "currentColor"
  })]
});
const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.HAND_PICKED,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Hand-Picked Products', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: handPickedIcon
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select specific products to recommend to customers.', 'woocommerce'),
  keywords: ['specific', 'choose', 'recommend', 'handpicked', 'hand picked'],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    orderBy: 'post__in'
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.HAND_PICKED, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ORDER]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Recommended products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const pagination = ['core/query-pagination', {
  layout: {
    type: 'flex',
    justifyContent: 'center'
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE, pagination];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/index.tsx":
/*!*********************************************************!*\
  !*** ./blocks/product-collection/collections/index.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getCollectionByName: () => (/* binding */ getCollectionByName),
/* harmony export */   registerCollections: () => (/* binding */ registerCollections)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks-registry'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _best_sellers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./best-sellers */ "./blocks/product-collection/collections/best-sellers.tsx");
/* harmony import */ var _cross_sells__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cross-sells */ "./blocks/product-collection/collections/cross-sells.tsx");
/* harmony import */ var _featured__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./featured */ "./blocks/product-collection/collections/featured.tsx");
/* harmony import */ var _hand_picked__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hand-picked */ "./blocks/product-collection/collections/hand-picked.tsx");
/* harmony import */ var _new_arrivals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./new-arrivals */ "./blocks/product-collection/collections/new-arrivals.tsx");
/* harmony import */ var _on_sale__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./on-sale */ "./blocks/product-collection/collections/on-sale.tsx");
/* harmony import */ var _product_collection__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./product-collection */ "./blocks/product-collection/collections/product-collection.tsx");
/* harmony import */ var _related__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./related */ "./blocks/product-collection/collections/related.tsx");
/* harmony import */ var _top_rated__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./top-rated */ "./blocks/product-collection/collections/top-rated.tsx");
/* harmony import */ var _upsells__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./upsells */ "./blocks/product-collection/collections/upsells.tsx");
/* harmony import */ var _by_category__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./by-category */ "./blocks/product-collection/collections/by-category.tsx");
/* harmony import */ var _by_tag__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./by-tag */ "./blocks/product-collection/collections/by-tag.tsx");
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */















// Order in here is reflected in the Collection Chooser in Editor.
const collections = [_product_collection__WEBPACK_IMPORTED_MODULE_10__["default"], _featured__WEBPACK_IMPORTED_MODULE_6__["default"], _new_arrivals__WEBPACK_IMPORTED_MODULE_8__["default"], _on_sale__WEBPACK_IMPORTED_MODULE_9__["default"], _best_sellers__WEBPACK_IMPORTED_MODULE_4__["default"], _top_rated__WEBPACK_IMPORTED_MODULE_12__["default"], _hand_picked__WEBPACK_IMPORTED_MODULE_7__["default"], _by_category__WEBPACK_IMPORTED_MODULE_14__["default"], _by_tag__WEBPACK_IMPORTED_MODULE_15__["default"], _related__WEBPACK_IMPORTED_MODULE_11__["default"], _upsells__WEBPACK_IMPORTED_MODULE_13__["default"], _cross_sells__WEBPACK_IMPORTED_MODULE_5__["default"]];
const registerCollections = () => {
  collections.forEach(collection => Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks-registry'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(collection));
};
const getCollectionByName = collectionName => {
  if (!collectionName) {
    return null;
  }

  // @ts-expect-error Type definitions are missing
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/selectors.d.ts
  const variations = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.store).getBlockVariations(_block_json__WEBPACK_IMPORTED_MODULE_3__.name);

  // @ts-expect-error Type definitions are missing
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/selectors.d.ts
  return variations.find(({
    name
  }) => name === collectionName);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerCollections);

/***/ }),

/***/ "./blocks/product-collection/collections/new-arrivals.tsx":
/*!****************************************************************!*\
  !*** ./blocks/product-collection/collections/new-arrivals.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/calendar.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.NEW_ARRIVALS,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('New Arrivals', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recommend your newest products.', 'woocommerce'),
  keywords: ['newest'],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    orderBy: 'date',
    order: 'desc',
    perPage: 5,
    pages: 1,
    timeFrame: {
      operator: _types__WEBPACK_IMPORTED_MODULE_4__.ETimeFrameOperator.IN,
      value: '-7 days'
    }
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ORDER, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('New arrivals', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/on-sale.tsx":
/*!***********************************************************!*\
  !*** ./blocks/product-collection/collections/on-sale.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/percent.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.ON_SALE,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On Sale Products', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Highlight products that are currently on sale.', 'woocommerce'),
  keywords: ['discount', 'promotion', 'onsale'],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    woocommerceOnSale: true,
    perPage: 5,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ON_SALE, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On sale products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/product-collection.tsx":
/*!**********************************************************************!*\
  !*** ./blocks/product-collection/collections/product-collection.tsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/loop.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.PRODUCT_CATALOG,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Product Catalog', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: 'Display all products in your catalog. Results can (change to) match the current template, page, or search term.',
  keywords: ['all products'],
  scope: []
};
const innerBlocks = _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_TEMPLATE;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/related.tsx":
/*!***********************************************************!*\
  !*** ./blocks/product-collection/collections/related.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/loop.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.RELATED,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Related Products', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recommend products like this one.', 'woocommerce'),
  keywords: [],
  scope: ['inserter', 'block'],
  usesReference: ['product']
};
const attributes = {
  displayLayout: {
    type: _types__WEBPACK_IMPORTED_MODULE_4__.LayoutOptions.GRID,
    columns: 4,
    shrinkColumns: true
  },
  query: {
    perPage: 4,
    pages: 1
  }
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Related Products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/top-rated.tsx":
/*!*************************************************************!*\
  !*** ./blocks/product-collection/collections/top-rated.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/star-empty.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.TOP_RATED,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Rated Products', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recommend products with the highest review ratings.', 'woocommerce'),
  keywords: [],
  scope: ['inserter', 'block']
};
const attributes = {
  displayLayout: {
    type: 'flex',
    columns: 5,
    shrinkColumns: true
  },
  query: {
    orderBy: 'rating',
    order: 'desc',
    perPage: 5,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ORDER, _types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'center',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top rated products', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/collections/upsells.tsx":
/*!***********************************************************!*\
  !*** ./blocks/product-collection/collections/upsells.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trending-up.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const collection = {
  name: _types__WEBPACK_IMPORTED_MODULE_4__.CoreCollectionNames.UPSELLS,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Upsells', 'woocommerce'),
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"]
  }),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Upsells are typically products that are extra profitable or better quality or more expensive. Experiment with combinations to boost sales.', 'woocommerce'),
  keywords: ['boost', 'promotion'],
  scope: ['inserter', 'block'],
  usesReference: ['product', 'cart', 'order']
};
const attributes = {
  ..._constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_ATTRIBUTES,
  displayLayout: {
    type: 'flex',
    columns: 4,
    shrinkColumns: true
  },
  query: {
    ..._constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY,
    perPage: 8,
    pages: 1
  },
  hideControls: [_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE]
};
const heading = ['core/heading', {
  textAlign: 'left',
  level: 2,
  content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You may also like', 'woocommerce'),
  style: {
    spacing: {
      margin: {
        bottom: '1rem'
      }
    }
  }
}];
const innerBlocks = [heading, _constants__WEBPACK_IMPORTED_MODULE_3__.INNER_BLOCKS_PRODUCT_TEMPLATE];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ...collection,
  attributes,
  innerBlocks
});

/***/ }),

/***/ "./blocks/product-collection/constants.ts":
/*!************************************************!*\
  !*** ./blocks/product-collection/constants.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_ATTRIBUTES: () => (/* binding */ DEFAULT_ATTRIBUTES),
/* harmony export */   DEFAULT_FILTERS: () => (/* binding */ DEFAULT_FILTERS),
/* harmony export */   DEFAULT_QUERY: () => (/* binding */ DEFAULT_QUERY),
/* harmony export */   INNER_BLOCKS_NO_RESULTS_TEMPLATE: () => (/* binding */ INNER_BLOCKS_NO_RESULTS_TEMPLATE),
/* harmony export */   INNER_BLOCKS_PAGINATION_TEMPLATE: () => (/* binding */ INNER_BLOCKS_PAGINATION_TEMPLATE),
/* harmony export */   INNER_BLOCKS_PRODUCT_TEMPLATE: () => (/* binding */ INNER_BLOCKS_PRODUCT_TEMPLATE),
/* harmony export */   INNER_BLOCKS_TEMPLATE: () => (/* binding */ INNER_BLOCKS_TEMPLATE),
/* harmony export */   PRODUCT_COLLECTION_BLOCK_NAME: () => (/* binding */ PRODUCT_COLLECTION_BLOCK_NAME),
/* harmony export */   STOCK_STATUS_OPTIONS: () => (/* binding */ STOCK_STATUS_OPTIONS),
/* harmony export */   coreQueryPaginationBlockName: () => (/* binding */ coreQueryPaginationBlockName),
/* harmony export */   getDefaultStockStatuses: () => (/* binding */ getDefaultStockStatuses),
/* harmony export */   headingBlockName: () => (/* binding */ headingBlockName),
/* harmony export */   nextPreviousButtonsBlockName: () => (/* binding */ nextPreviousButtonsBlockName),
/* harmony export */   paginationDefaultAttributes: () => (/* binding */ paginationDefaultAttributes),
/* harmony export */   productTemplateBlockName: () => (/* binding */ productTemplateBlockName)
/* harmony export */ });
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/settings */ "./node_modules/@woocommerce/settings/build-module/index.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./blocks/product-collection/types.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../atomic/blocks/product-elements/image/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * Purpose of this file:
 * This file defines constants for use in `plugins/woocommerce/client/blocks/assets/js/blocks-registry/product-collection/register-product-collection.tsx`.
 * By isolating constants here, we avoid loading unnecessary JS file on the frontend (e.g., the /shop page), enhancing site performance.
 *
 * Context: https://github.com/woocommerce/woocommerce/pull/48141#issuecomment-2208770592.
 */

/**
 * External dependencies
 */


/**
 * Internal dependencies
 */



const PRODUCT_COLLECTION_BLOCK_NAME = _block_json__WEBPACK_IMPORTED_MODULE_2__.name;
const PRODUCT_TITLE_NAME = `${PRODUCT_COLLECTION_BLOCK_NAME}/product-title`;
const STOCK_STATUS_OPTIONS = (0,_woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__.getSetting)('stockStatusOptions', []);
const GLOBAL_HIDE_OUT_OF_STOCK = (0,_woocommerce_settings__WEBPACK_IMPORTED_MODULE_0__.getSetting)('hideOutOfStockItems', false);
const getDefaultStockStatuses = () => {
  return GLOBAL_HIDE_OUT_OF_STOCK ? Object.keys(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(STOCK_STATUS_OPTIONS, 'outofstock')) : Object.keys(STOCK_STATUS_OPTIONS);
};
const DEFAULT_QUERY = {
  perPage: 9,
  pages: 0,
  offset: 0,
  postType: 'product',
  order: 'asc',
  orderBy: 'title',
  search: '',
  exclude: [],
  inherit: false,
  taxQuery: {},
  isProductCollectionBlock: true,
  featured: false,
  woocommerceOnSale: false,
  woocommerceStockStatus: getDefaultStockStatuses(),
  woocommerceAttributes: [],
  woocommerceHandPickedProducts: [],
  timeFrame: undefined,
  priceRange: undefined,
  filterable: false,
  relatedBy: {
    categories: true,
    tags: true
  }
};
const DEFAULT_ATTRIBUTES = {
  query: DEFAULT_QUERY,
  tagName: 'div',
  displayLayout: {
    type: _types__WEBPACK_IMPORTED_MODULE_3__.LayoutOptions.GRID,
    columns: 3,
    shrinkColumns: true
  },
  dimensions: {
    widthType: _types__WEBPACK_IMPORTED_MODULE_3__.WidthOptions.FILL
  },
  queryContextIncludes: ['collection'],
  forcePageReload: false
};
const DEFAULT_FILTERS = {
  woocommerceOnSale: DEFAULT_QUERY.woocommerceOnSale,
  woocommerceStockStatus: DEFAULT_QUERY.woocommerceStockStatus,
  woocommerceAttributes: DEFAULT_QUERY.woocommerceAttributes,
  woocommerceHandPickedProducts: DEFAULT_QUERY.woocommerceHandPickedProducts,
  taxQuery: DEFAULT_QUERY.taxQuery,
  featured: DEFAULT_QUERY.featured,
  timeFrame: DEFAULT_QUERY.timeFrame,
  priceRange: DEFAULT_QUERY.priceRange
};
const headingBlockName = 'core/heading';
const coreQueryPaginationBlockName = 'core/query-pagination';
const nextPreviousButtonsBlockName = 'woocommerce/product-gallery-large-image-next-previous';
const productTemplateBlockName = 'woocommerce/product-template';

/**
 * Default inner block templates for the product collection block.
 * Exported for use in different collections, e.g., 'New Arrivals' collection.
 */
const INNER_BLOCKS_PRODUCT_TEMPLATE = [productTemplateBlockName, {}, [['woocommerce/product-image', {
  imageSizing: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../atomic/blocks/product-elements/image/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).THUMBNAIL,
  showSaleBadge: false
}, [['woocommerce/product-sale-badge', {
  align: 'right'
}]]], ['core/post-title', {
  textAlign: 'center',
  level: 2,
  fontSize: 'medium',
  style: {
    spacing: {
      margin: {
        bottom: '0.75rem',
        top: '0'
      }
    },
    typography: {
      lineHeight: '1.4'
    }
  },
  isLink: true,
  __woocommerceNamespace: PRODUCT_TITLE_NAME
}], ['woocommerce/product-price', {
  textAlign: 'center',
  fontSize: 'small'
}], ['woocommerce/product-button', {
  textAlign: 'center',
  fontSize: 'small'
}]]];
const paginationDefaultAttributes = {
  layout: {
    type: 'flex',
    justifyContent: 'center'
  }
};
const INNER_BLOCKS_PAGINATION_TEMPLATE = [coreQueryPaginationBlockName, paginationDefaultAttributes];
const INNER_BLOCKS_NO_RESULTS_TEMPLATE = ['woocommerce/product-collection-no-results'];
const INNER_BLOCKS_TEMPLATE = [INNER_BLOCKS_PRODUCT_TEMPLATE, INNER_BLOCKS_PAGINATION_TEMPLATE, INNER_BLOCKS_NO_RESULTS_TEMPLATE];

/***/ }),

/***/ "./blocks/product-collection/edit/ProductPicker.tsx":
/*!**********************************************************!*\
  !*** ./blocks/product-collection/edit/ProductPicker.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/info.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../collections */ "./blocks/product-collection/collections/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * External dependencies
 */







/**
 * Internal dependencies
 */



const ProductPicker = props => {
  const {
    attributes,
    isDeletedProductReference
  } = props;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockProps)();
  const collection = (0,_collections__WEBPACK_IMPORTED_MODULE_7__.getCollectionByName)(attributes.collection);
  if (!collection) {
    return null;
  }
  const infoText = isDeletedProductReference ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previously selected product is no longer available.', 'woocommerce') : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.createInterpolateElement)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: collection title */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('<strong>%s</strong> requires a product to be selected in order to display associated items.', 'woocommerce'), collection.title), {
    strong: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {})
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Placeholder, {
      className: "wc-blocks-product-collection__editor-product-picker",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalHStack, {
        alignment: "center",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
          className: "wc-blocks-product-collection__info-icon"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalText, {
          children: infoText
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        selected: attributes.query?.productReference,
        onChange: (value = []) => {
          var _value$0$id;
          const isValidId = ((_value$0$id = value[0]?.id) !== null && _value$0$id !== void 0 ? _value$0$id : null) !== null;
          if (isValidId) {
            props.setAttributes({
              query: {
                ...attributes.query,
                productReference: value[0].id
              }
            });
          }
        },
        messages: {
          search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a product', 'woocommerce')
        }
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductPicker);

/***/ }),

/***/ "./blocks/product-collection/edit/collection-chooser.tsx":
/*!***************************************************************!*\
  !*** ./blocks/product-collection/edit/collection-chooser.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyCollection: () => (/* binding */ applyCollection),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../collections */ "./blocks/product-collection/collections/index.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);
/**
 * External dependencies
 */







/**
 * Internal dependencies
 */





const applyCollection = (collectionName, clientId, replaceBlock) => {
  const collection = (0,_collections__WEBPACK_IMPORTED_MODULE_8__.getCollectionByName)(collectionName);
  if (!collection) {
    return;
  }
  const newBlock = collection.name === _types__WEBPACK_IMPORTED_MODULE_6__.CoreCollectionNames.PRODUCT_CATALOG ? (0,_utils__WEBPACK_IMPORTED_MODULE_9__.getDefaultProductCollection)() : (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)(_block_json__WEBPACK_IMPORTED_MODULE_7__.name, collection.attributes, (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlocksFromInnerBlocksTemplate)(collection.innerBlocks));
  replaceBlock(clientId, newBlock);
};
const CollectionButton = ({
  title,
  icon,
  description,
  onClick
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
    text: description,
    placement: "top",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      className: "wc-blocks-product-collection__collection-button",
      onClick: onClick,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
        className: "wc-blocks-product-collection__collection-button-icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Icon, {
          icon: icon
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p", {
        className: "wc-blocks-product-collection__collection-button-title",
        children: title
      })]
    })
  });
};
const CreateCollectionButton = props => {
  const {
    description,
    onClick
  } = props;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: "wc-blocks-product-collection__collections-create",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('or', 'woocommerce')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Tooltip, {
      text: description,
      placement: "top",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: onClick,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('create your own', 'woocommerce')
      })
    })]
  });
};
const GridCollectionOptions = props => {
  const {
    onCollectionClick,
    catalogVariation,
    collectionVariations
  } = props;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: "wc-blocks-product-collection__collections-grid",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: "wc-blocks-product-collection__collections-section",
      children: collectionVariations.map(({
        name,
        title,
        icon,
        description
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(CollectionButton, {
        title: title,
        description: description,
        icon: icon,
        onClick: () => onCollectionClick(name)
      }, name))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(CreateCollectionButton, {
      title: catalogVariation.title,
      description: catalogVariation.description,
      icon: catalogVariation.icon,
      onClick: () => onCollectionClick(catalogVariation.name)
    })]
  });
};
const DropdownCollectionOptions = props => {
  const {
    onCollectionClick,
    catalogVariation,
    collectionVariations
  } = props;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: "wc-blocks-product-collection__collections-dropdown",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dropdown, {
      className: "wc-blocks-product-collection__collections-dropdown-toggle",
      contentClassName: "wc-blocks-product-collection__collections-dropdown-content",
      renderToggle: ({
        isOpen,
        onToggle
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: onToggle,
        "aria-expanded": isOpen,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Choose collection', 'woocommerce')
      }),
      renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
        children: collectionVariations.map(({
          name,
          title,
          icon,
          description
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(CollectionButton, {
          title: title,
          description: description,
          icon: icon,
          onClick: () => onCollectionClick(name)
        }, name))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(CreateCollectionButton, {
      title: catalogVariation.title,
      description: catalogVariation.description,
      icon: catalogVariation.icon,
      onClick: () => onCollectionClick(catalogVariation.name)
    })]
  });
};
const CollectionChooser = props => {
  // Get Collections
  const blockCollections = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    // @ts-expect-error Type definitions are missing
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/selectors.d.ts
    const {
      getBlockVariations
    } = select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.store);
    return getBlockVariations(_block_json__WEBPACK_IMPORTED_MODULE_7__.name);
  }, []);
  const productCatalog = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => blockCollections.find(({
    name
  }) => name === _types__WEBPACK_IMPORTED_MODULE_6__.CoreCollectionNames.PRODUCT_CATALOG), [blockCollections]);
  const collectionVariations = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => blockCollections.filter(({
    name,
    scope
  }) => {
    return name !== _types__WEBPACK_IMPORTED_MODULE_6__.CoreCollectionNames.PRODUCT_CATALOG && (
    // Display collections in the Collection Chooser if:
    // 1. They have an explicit "block" scope
    // 2. The scope is undefined (scope defaults to both block and inserter)
    scope === undefined || scope?.includes('block'));
  }), [blockCollections]);
  const [resizeListener, {
    width
  }] = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.useResizeObserver)();
  let OptionsComponent;
  if (width !== null && width >= 600) {
    OptionsComponent = GridCollectionOptions;
  } else {
    OptionsComponent = DropdownCollectionOptions;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
    children: [resizeListener, !!width && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(OptionsComponent, {
      ...props,
      catalogVariation: productCatalog,
      collectionVariations: collectionVariations
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CollectionChooser);

/***/ }),

/***/ "./blocks/product-collection/edit/collection-selection-modal.tsx":
/*!***********************************************************************!*\
  !*** ./blocks/product-collection/edit/collection-selection-modal.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _collection_chooser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./collection-chooser */ "./blocks/product-collection/edit/collection-chooser.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * External dependencies
 */







/**
 * Internal dependencies
 */


const PatternSelectionModal = props => {
  const {
    clientId,
    attributes,
    tracksLocation,
    closePatternSelectionModal
  } = props;
  const {
    collection
  } = attributes;
  // @ts-expect-error Type definitions for this function are missing
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/actions.d.ts
  const {
    replaceBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
  const [chosenCollection, selectCollectionName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(collection);
  const onContinueClick = () => {
    if (chosenCollection) {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_collection_replaced_from_placeholder', {
        from: collection,
        to: chosenCollection,
        location: tracksLocation
      });
      (0,_collection_chooser__WEBPACK_IMPORTED_MODULE_6__.applyCollection)(chosenCollection, clientId, replaceBlock);
    }
  };
  const handleModalClose = action => {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_collection_replaced_from_placeholder', {
      action,
      location: tracksLocation
    });
    closePatternSelectionModal();
  };
  const onCancelClick = () => handleModalClose('cancel');
  const onCloseModal = () => handleModalClose('close');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Modal, {
    overlayClassName: "wc-blocks-product-collection__modal",
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('What products do you want to show?', 'woocommerce'),
    onRequestClose: onCloseModal
    // @ts-expect-error Type definitions are missing in the version we are using i.e. 19.1.5,
    ,
    size: 'large',
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "wc-blocks-product-collection__content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_collection_chooser__WEBPACK_IMPORTED_MODULE_6__["default"], {
        chosenCollection: chosenCollection,
        onCollectionClick: selectCollectionName
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "wc-blocks-product-collection__footer",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "tertiary",
          onClick: onCancelClick,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'woocommerce')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
          variant: "primary",
          onClick: onContinueClick,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Continue', 'woocommerce')
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatternSelectionModal);

/***/ }),

/***/ "./blocks/product-collection/edit/index.tsx":
/*!**************************************************!*\
  !*** ./blocks/product-collection/edit/index.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _product_collection_placeholder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./product-collection-placeholder */ "./blocks/product-collection/edit/product-collection-placeholder.tsx");
/* harmony import */ var _product_collection_content__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./product-collection-content */ "./blocks/product-collection/edit/product-collection-content.tsx");
/* harmony import */ var _collection_selection_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./collection-selection-modal */ "./blocks/product-collection/edit/collection-selection-modal.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var _ProductPicker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ProductPicker */ "./blocks/product-collection/edit/ProductPicker.tsx");
/* harmony import */ var _tracks_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../tracks-utils */ "./blocks/product-collection/tracks-utils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__);
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */








const Edit = props => {
  const {
    clientId,
    attributes,
    context
  } = props;
  const location = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(context, clientId);
  const tracksLocation = (0,_tracks_utils__WEBPACK_IMPORTED_MODULE_11__.useTracksLocation)(context.templateSlug);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const hasInnerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => !!select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).getBlocks(clientId).length, [clientId]);
  const {
    productCollectionUIStateInEditor,
    isLoading
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.useProductCollectionUIState)({
    location,
    attributes,
    hasInnerBlocks,
    usesReference: props.usesReference
  });

  // Show spinner while calculating Editor UI state.
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
      justify: "center",
      align: "center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Spinner, {})
    });
  }
  const productCollectionContentProps = {
    ...props,
    openCollectionSelectionModal: () => setIsSelectionModalOpen(true),
    location,
    isUsingReferencePreviewMode: productCollectionUIStateInEditor === _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.VALID_WITH_PREVIEW
  };
  const renderComponent = () => {
    switch (productCollectionUIStateInEditor) {
      case _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.COLLECTION_PICKER:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_product_collection_placeholder__WEBPACK_IMPORTED_MODULE_6__["default"], {
          ...props,
          tracksLocation: tracksLocation
        });
      case _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.PRODUCT_REFERENCE_PICKER:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_ProductPicker__WEBPACK_IMPORTED_MODULE_10__["default"], {
          ...props,
          isDeletedProductReference: false
        });
      case _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.DELETED_PRODUCT_REFERENCE:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_ProductPicker__WEBPACK_IMPORTED_MODULE_10__["default"], {
          ...props,
          isDeletedProductReference: true
        });
      case _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.VALID:
      case _types__WEBPACK_IMPORTED_MODULE_5__.ProductCollectionUIStatesInEditor.VALID_WITH_PREVIEW:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_product_collection_content__WEBPACK_IMPORTED_MODULE_7__["default"], {
          ...productCollectionContentProps
        });
      default:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_product_collection_placeholder__WEBPACK_IMPORTED_MODULE_6__["default"], {
          ...props,
          tracksLocation: tracksLocation
        });
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
    children: [renderComponent(), isSelectionModalOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_collection_selection_modal__WEBPACK_IMPORTED_MODULE_8__["default"], {
      clientId: clientId,
      attributes: attributes,
      tracksLocation: tracksLocation,
      closePatternSelectionModal: () => setIsSelectionModalOpen(false)
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-advanced-controls/force-page-reload-control.tsx":
/*!**************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-advanced-controls/force-page-reload-control.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./blocks/product-collection/edit/inspector-advanced-controls/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */


const helpTextClientSideNav = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable to enforce full page reload on certain interactions, like using paginations controls.', 'woocommerce');
const helpTextReloadFullPage = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Browsing between pages requires a full page reload.', 'woocommerce');
const helpTextIncompatibleBlocks = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Reload full page can't be disabled because there are incompatible blocks inside the Product Collection block.", 'woocommerce');
const ForcePageReloadControl = props => {
  const {
    clientId,
    forcePageReload,
    setAttributes
  } = props;
  const hasUnsupportedBlocks = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.useHasUnsupportedBlocks)(clientId);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!forcePageReload && hasUnsupportedBlocks) {
      setAttributes({
        forcePageReload: true
      });
    }
  }, [forcePageReload, hasUnsupportedBlocks, setAttributes]);

  // Client side navigation is on (control is off).
  let helpText = helpTextClientSideNav;

  // Client side navigation is off (control is on).
  if (forcePageReload) {
    helpText = helpTextReloadFullPage;
  }

  // Client side navigation is forcefully off (control is on and disabled).
  if (hasUnsupportedBlocks) {
    helpText = helpTextIncompatibleBlocks;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reload full page', 'woocommerce'),
    help: helpText,
    checked: forcePageReload,
    onChange: () => setAttributes({
      forcePageReload: !forcePageReload
    }),
    disabled: hasUnsupportedBlocks
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ForcePageReloadControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-advanced-controls/index.tsx":
/*!******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-advanced-controls/index.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProductCollectionAdvancedInspectorControls)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _force_page_reload_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./force-page-reload-control */ "./blocks/product-collection/edit/inspector-advanced-controls/force-page-reload-control.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


function ProductCollectionAdvancedInspectorControls(props) {
  const {
    clientId,
    attributes,
    setAttributes
  } = props;
  const {
    forcePageReload
  } = attributes;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorAdvancedControls, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_force_page_reload_control__WEBPACK_IMPORTED_MODULE_1__["default"], {
      clientId: clientId,
      forcePageReload: forcePageReload,
      setAttributes: setAttributes
    })
  });
}

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-advanced-controls/utils.tsx":
/*!******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-advanced-controls/utils.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useHasUnsupportedBlocks: () => (/* binding */ useHasUnsupportedBlocks)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



const isBlockSupported = blockName => {
  // Client side navigation can be true in two states:
  // - supports.interactivity === true;
  // - supports.interactivity.clientNavigation === true;

  const blockSupportsInteractivity = Object.is(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore it's a valid supports key
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.getBlockSupport)(blockName, 'interactivity'), true);
  const blockSupportsInteractivityClientNavigation = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.getBlockSupport)(blockName,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore it's a valid supports key
  'interactivity.clientNavigation');
  return blockSupportsInteractivity || blockSupportsInteractivityClientNavigation;
};
const useHasUnsupportedBlocks = clientId => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore No types for this exist yet
  const {
    getClientIdsOfDescendants,
    getBlockName
  } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
  const hasUnsupportedBlocks = getClientIdsOfDescendants(clientId).find(blockId => {
    const blockName = getBlockName(blockId);
    const supported = isBlockSupported(blockName);
    return !supported;
  }) || false;
  return hasUnsupportedBlocks;
}, [clientId]);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/attributes-control.tsx":
/*!**********************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/attributes-control.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-attribute-term-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/settings */ "./node_modules/@woocommerce/settings/build-module/index.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */





/**
 * Internal dependencies
 */



const EDIT_ATTRIBUTES_URL = `${_woocommerce_settings__WEBPACK_IMPORTED_MODULE_2__.ADMIN_URL}edit.php?post_type=product&page=product_attributes`;
const AttributesControl = ({
  query,
  trackInteraction,
  setQueryAttribute
}) => {
  const woocommerceAttributes = query.woocommerceAttributes || [];
  const selectedAttributes = woocommerceAttributes?.map(({
    termId: id
  }) => ({
    id
  }));
  const deselectCallback = () => {
    setQueryAttribute({
      woocommerceAttributes: _constants__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_FILTERS.woocommerceAttributes
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ATTRIBUTES);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Product Attributes', 'woocommerce'),
    hasValue: () => !!woocommerceAttributes?.length,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-attribute-term-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
      messages: {
        search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Attributes', 'woocommerce')
      },
      selected: selectedAttributes || [],
      onChange: searchListItems => {
        const newValue = searchListItems.map(({
          id,
          value
        }) => ({
          termId: id,
          taxonomy: value
        }));
        setQueryAttribute({
          woocommerceAttributes: newValue
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.ATTRIBUTES);
      },
      operator: 'any',
      isCompact: true,
      type: 'token'
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ExternalLink, {
      className: "wc-block-editor-product-collection-panel__manage-attributes-link",
      href: EDIT_ATTRIBUTES_URL,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manage attributes', 'woocommerce')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AttributesControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/columns-control.tsx":
/*!*******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/columns-control.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const columnsLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns', 'woocommerce');
const toggleLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Responsive', 'woocommerce');
const toggleHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatically adjust the number of columns to better fit smaller screens.', 'woocommerce');
const ColumnsControl = props => {
  const {
    type,
    columns,
    shrinkColumns
  } = props.displayLayout;
  const showColumnsControl = type === 'flex';
  const defaultLayout = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getDefaultDisplayLayout)();
  const onShrinkColumnsToggleChange = value => {
    props.setAttributes({
      displayLayout: {
        ...props.displayLayout,
        shrinkColumns: value
      }
    });
  };
  const onPanelDeselect = () => {
    props.setAttributes({
      displayLayout: defaultLayout
    });
  };
  const onColumnsChange = value => props.setAttributes({
    displayLayout: {
      ...props.displayLayout,
      columns: value
    }
  });
  return showColumnsControl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
      label: columnsLabel,
      hasValue: () => defaultLayout?.columns !== columns,
      isShownByDefault: true,
      onDeselect: onPanelDeselect,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        __next40pxDefaultSize: true,
        label: columnsLabel,
        onChange: onColumnsChange,
        value: columns,
        min: 1,
        max: Math.max(6, columns)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
      label: toggleLabel,
      hasValue: () => defaultLayout?.shrinkColumns !== shrinkColumns,
      isShownByDefault: true,
      onDeselect: onPanelDeselect,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        checked: !!shrinkColumns,
        label: toggleLabel,
        help: toggleHelp,
        onChange: onShrinkColumnsToggleChange
      })
    })]
  }) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColumnsControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/created-control.tsx":
/*!*******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/created-control.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const CreatedControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const {
    timeFrame
  } = query;
  const deselectCallback = () => {
    setQueryAttribute({
      timeFrame: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_FILTERS.timeFrame
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.CREATED);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Created', 'woocommerce'),
    hasValue: () => timeFrame?.operator && timeFrame?.value,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
      direction: "column",
      gap: 3,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Created', 'woocommerce'),
          isBlock: true,
          onChange: value => {
            setQueryAttribute({
              timeFrame: {
                ...timeFrame,
                operator: value
              }
            });
            trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.CREATED);
          },
          value: timeFrame?.operator || _types__WEBPACK_IMPORTED_MODULE_2__.ETimeFrameOperator.IN,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
            value: _types__WEBPACK_IMPORTED_MODULE_2__.ETimeFrameOperator.IN,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Within', 'Product Collection query operator', 'woocommerce')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
            value: _types__WEBPACK_IMPORTED_MODULE_2__.ETimeFrameOperator.NOT_IN,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Before', 'Product Collection query operator', 'woocommerce')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RadioControl, {
          onChange: value => {
            setQueryAttribute({
              timeFrame: {
                operator: _types__WEBPACK_IMPORTED_MODULE_2__.ETimeFrameOperator.IN,
                ...timeFrame,
                value
              }
            });
            trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.CREATED);
          },
          options: [{
            label: 'last 24 hours',
            value: '-1 day'
          }, {
            label: 'last 7 days',
            value: '-7 days'
          }, {
            label: 'last 30 days',
            value: '-30 days'
          }, {
            label: 'last 3 months',
            value: '-3 months'
          }],
          selected: timeFrame?.value
        })
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CreatedControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/featured-products-control.tsx":
/*!*****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/featured-products-control.tsx ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const FeaturedProductsControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const deselectCallback = () => {
    setQueryAttribute({
      featured: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_FILTERS.featured
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.FEATURED);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured', 'woocommerce'),
    hasValue: () => query.featured === true,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
      id: "product-collection-featured-products-control",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured', 'woocommerce'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show only featured products', 'woocommerce'),
        checked: query.featured || false,
        onChange: featured => {
          setQueryAttribute({
            featured
          });
          trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.FEATURED);
        }
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FeaturedProductsControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/hand-picked-products-control.tsx":
/*!********************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/hand-picked-products-control.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandPickedProductsControlField: () => (/* binding */ HandPickedProductsControlField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * External dependencies
 */








/**
 * Internal dependencies
 */



/**
 * Returns:
 * - productsMap: Map of products by id and name.
 * - productsList: List of products retrieved.
 */

function useProducts(isLargeCatalog, search, selected = []) {
  // Creating a map for fast lookup of products by id or name.
  const [productsMap, setProductsMap] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(new Map());

  // List of products retrieved
  const [productsList, setProductsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);

  // Flag to check if products are loaded
  const [productsLoaded, setProductsLoaded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    // We take two strategies here because of internal logic of
    // `getProducts` and `getProductsRequests` that skips request for
    // `selected` products for small stores. So fetching products per user's input
    // breaks selected items:
    // 1. For large stores (>100 products) we fetch products as input changes AND
    // `selected` products.
    // 2. For small stores (<=100 products) we fetch all products just once.

    const query = {
      selected: isLargeCatalog ? selected.map(Number) : [],
      queryArgs: isLargeCatalog ? {
        search,
        // Limit search to 40 results. If results are not satisfying
        // user needs to type more characters to get closer to actual
        // product name.
        per_page: 40
      } : {
        // For a small catalog we fetch all the products.
        per_page: 0
      }
    };
    Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(query).then(results => {
      const newProductsMap = new Map();
      results.forEach(product => {
        newProductsMap.set(product.id, product);
        newProductsMap.set(product.name, product);
      });
      setProductsList(results);
      setProductsMap(newProductsMap);
      setProductsLoaded(true);
    });
  }, [isLargeCatalog, search, selected]);
  return {
    productsMap,
    productsList,
    productsLoaded
  };
}
const HandPickedProductsControlField = ({
  query,
  trackInteraction,
  setQueryAttribute
}) => {
  const isLargeCatalog = (Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).productCount || 0) > 100;
  const selectedProductIds = query.woocommerceHandPickedProducts;
  const [searchQuery, setSearchQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const {
    productsMap,
    productsList,
    productsLoaded
  } = useProducts(isLargeCatalog, searchQuery, selectedProductIds);
  const handleSearch = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.useDebounce)(setSearchQuery, 250);

  // Filter out any selected product IDs that no longer exist
  const validSelectedProductIds = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (!selectedProductIds?.length || !productsMap.size) return selectedProductIds || [];
    return selectedProductIds.filter(id => {
      const product = productsMap.get(Number(id));
      return !!product;
    });
  }, [selectedProductIds, productsMap]);

  // Updates the query attribute when invalid products are filtered out
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (validSelectedProductIds.length !== selectedProductIds.length) {
      setQueryAttribute({
        woocommerceHandPickedProducts: validSelectedProductIds
      });
    }
  }, [validSelectedProductIds, selectedProductIds, setQueryAttribute]);
  const onTokenChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(values => {
    // Map the tokens to product ids.
    const newHandPickedProductsSet = values.reduce((acc, nameOrId) => {
      const product = productsMap.get(nameOrId) || productsMap.get(Number(nameOrId));
      if (product) acc.add(String(product.id));
      return acc;
    }, new Set());
    setQueryAttribute({
      woocommerceHandPickedProducts: Array.from(newHandPickedProductsSet)
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_6__.CoreFilterNames.HAND_PICKED);
  }, [setQueryAttribute, trackInteraction, productsMap]);
  const suggestions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return productsList
    // Filter out products that are already selected.
    .filter(product => !validSelectedProductIds?.includes(String(product.id))).map(product => product.name);
  }, [productsList, validSelectedProductIds]);

  /**
   * Transforms a token into a product name.
   * - If the token is a number, it will be used to lookup the product name.
   * - Otherwise, the token will be used as is.
   */
  const transformTokenIntoProductName = token => {
    const parsedToken = Number(token);
    if (Number.isNaN(parsedToken)) {
      return (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__.decodeEntities)(token) || '';
    }
    const product = productsMap.get(parsedToken);
    return (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__.decodeEntities)(product?.name) || '';
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.FormTokenField, {
    displayTransform: transformTokenIntoProductName,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Hand-Picked', 'woocommerce'),
    onChange: onTokenChange,
    onInputChange: isLargeCatalog ? handleSearch : undefined,
    suggestions: suggestions
    // @ts-expect-error Using experimental features
    ,
    __experimentalValidateInput: value => productsMap.has(value),
    value: !productsLoaded ? [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Loading…', 'woocommerce')] : validSelectedProductIds || [],
    __experimentalExpandOnFocus: true,
    __experimentalShowHowTo: false,
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search for products to display…', 'woocommerce')
  });
};
const HandPickedProductsControl = ({
  query,
  trackInteraction,
  setQueryAttribute
}) => {
  const selectedProductIds = query.woocommerceHandPickedProducts;
  const deselectCallback = () => {
    setQueryAttribute({
      woocommerceHandPickedProducts: _constants__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_FILTERS.woocommerceHandPickedProducts
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_6__.CoreFilterNames.HAND_PICKED);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Hand-Picked', 'woocommerce'),
    hasValue: () => !!selectedProductIds?.length,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(HandPickedProductsControlField, {
      query: query,
      trackInteraction: trackInteraction,
      setQueryAttribute: setQueryAttribute
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HandPickedProductsControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/index.tsx":
/*!*********************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/index.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   withUpgradeNoticeControls: () => (/* binding */ withUpgradeNoticeControls)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/ces-feedback-button'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _tracks_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../tracks-utils */ "./blocks/product-collection/tracks-utils.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var _upgrade_notice__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./upgrade-notice */ "./blocks/product-collection/edit/inspector-controls/upgrade-notice.tsx");
/* harmony import */ var _columns_control__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./columns-control */ "./blocks/product-collection/edit/inspector-controls/columns-control.tsx");
/* harmony import */ var _use_page_context_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./use-page-context-control */ "./blocks/product-collection/edit/inspector-controls/use-page-context-control.tsx");
/* harmony import */ var _use_carousel_layout_adjustments__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./use-carousel-layout-adjustments */ "./blocks/product-collection/edit/inspector-controls/use-carousel-layout-adjustments.ts");
/* harmony import */ var _order_by_control_default_query_order_by_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./order-by-control/default-query-order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/default-query-order-by-control.tsx");
/* harmony import */ var _order_by_control_custom_query_order_by_control__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./order-by-control/custom-query-order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/custom-query-order-by-control.tsx");
/* harmony import */ var _on_sale_control__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./on-sale-control */ "./blocks/product-collection/edit/inspector-controls/on-sale-control.tsx");
/* harmony import */ var _stock_status_control__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./stock-status-control */ "./blocks/product-collection/edit/inspector-controls/stock-status-control.tsx");
/* harmony import */ var _keyword_control__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./keyword-control */ "./blocks/product-collection/edit/inspector-controls/keyword-control.tsx");
/* harmony import */ var _attributes_control__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./attributes-control */ "./blocks/product-collection/edit/inspector-controls/attributes-control.tsx");
/* harmony import */ var _taxonomy_controls__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./taxonomy-controls */ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/index.tsx");
/* harmony import */ var _hand_picked_products_control__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./hand-picked-products-control */ "./blocks/product-collection/edit/inspector-controls/hand-picked-products-control.tsx");
/* harmony import */ var _layout_options_control__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./layout-options-control */ "./blocks/product-collection/edit/inspector-controls/layout-options-control.tsx");
/* harmony import */ var _featured_products_control__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./featured-products-control */ "./blocks/product-collection/edit/inspector-controls/featured-products-control.tsx");
/* harmony import */ var _created_control__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./created-control */ "./blocks/product-collection/edit/inspector-controls/created-control.tsx");
/* harmony import */ var _price_range_control__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./price-range-control */ "./blocks/product-collection/edit/inspector-controls/price-range-control/index.tsx");
/* harmony import */ var _linked_product_control__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./linked-product-control */ "./blocks/product-collection/edit/inspector-controls/linked-product-control.tsx");
/* harmony import */ var _width_options_control__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./width-options-control */ "./blocks/product-collection/edit/inspector-controls/width-options-control.tsx");
/* harmony import */ var _related_by_control__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./related-by-control */ "./blocks/product-collection/edit/inspector-controls/related-by-control.tsx");
/* harmony import */ var _products_per_page_control__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./products-per-page-control */ "./blocks/product-collection/edit/inspector-controls/products-per-page-control.tsx");
/* harmony import */ var _offset_control__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./offset-control */ "./blocks/product-collection/edit/inspector-controls/offset-control.tsx");
/* harmony import */ var _max_pages_to_show_control__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./max-pages-to-show-control */ "./blocks/product-collection/edit/inspector-controls/max-pages-to-show-control.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__);
/**
 * External dependencies
 */









/**
 * Internal dependencies
 */



























const prepareShouldShowFilter = hideControls => filter => {
  return !hideControls.includes(filter);
};
const ProductCollectionInspectorControls = props => {
  const {
    attributes,
    context,
    setAttributes,
    clientId
  } = props;
  const {
    query,
    hideControls,
    dimensions,
    displayLayout,
    collection
  } = attributes;
  const tracksLocation = (0,_tracks_utils__WEBPACK_IMPORTED_MODULE_7__.useTracksLocation)(context.templateSlug);
  const trackInteraction = filter => Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_inspector_control_clicked', {
    collection: attributes.collection,
    location: tracksLocation,
    filter
  });
  const inherit = query?.inherit || false;
  const shouldShowFilter = prepareShouldShowFilter(hideControls);
  const isArchiveTemplate = tracksLocation === 'product-catalog' || tracksLocation === 'product-archive';

  // Carousel layout influences the visibility and behavior of some controls.
  const isCarouselLayout = displayLayout?.type === _types__WEBPACK_IMPORTED_MODULE_8__.LayoutOptions.CAROUSEL;
  (0,_use_carousel_layout_adjustments__WEBPACK_IMPORTED_MODULE_13__["default"])(clientId, attributes);
  const showCustomQueryControls = inherit === false;
  const showInheritQueryControl = isArchiveTemplate && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.INHERIT);
  const showFilterableControl = !isArchiveTemplate && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.FILTERABLE);
  const showCustomOrderControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.ORDER);
  const showDefaultOrderControl = !showCustomQueryControls;
  const showOffsetControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.OFFSET);
  const showColumnsControl = !isCarouselLayout;
  const showMaxPagesToShowControl = showCustomQueryControls && !isCarouselLayout && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.MAX_PAGES_TO_SHOW);
  const showProductsPerPageControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.PRODUCTS_PER_PAGE);
  const showOnSaleControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.ON_SALE);
  const showStockStatusControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.STOCK_STATUS);
  const showHandPickedProductsControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.HAND_PICKED);
  const showKeywordControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.KEYWORD);
  const showAttributesControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.ATTRIBUTES);
  const showTaxonomyControls = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.TAXONOMY);
  const showFeaturedControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.FEATURED);
  const showCreatedControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.CREATED);
  const showPriceRangeControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_8__.CoreFilterNames.PRICE_RANGE);
  const setQueryAttributeBind = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => _utils__WEBPACK_IMPORTED_MODULE_9__.setQueryAttribute.bind(null, props), [props]);
  const displayControlProps = {
    setAttributes,
    displayLayout
  };
  const dimensionsControlProps = {
    setAttributes,
    dimensions
  };
  const queryControlProps = {
    setQueryAttribute: setQueryAttributeBind,
    trackInteraction,
    query
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_linked_product_control__WEBPACK_IMPORTED_MODULE_26__["default"], {
      query: props.attributes.query,
      setAttributes: props.setAttributes,
      usesReference: props.usesReference,
      location: props.location
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToolsPanel, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'woocommerce'),
      resetAll: () => {
        const defaultSettings = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.getDefaultSettings)(props.attributes);
        props.setAttributes(defaultSettings);
      },
      className: "wc-block-editor-product-collection__settings_panel",
      children: [showInheritQueryControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_use_page_context_control__WEBPACK_IMPORTED_MODULE_12__.InheritQueryControl, {
        ...queryControlProps
      }), showFilterableControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_use_page_context_control__WEBPACK_IMPORTED_MODULE_12__.FilterableControl, {
        ...queryControlProps
      }), showCustomOrderControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_order_by_control_custom_query_order_by_control__WEBPACK_IMPORTED_MODULE_15__["default"], {
        ...queryControlProps
      }), showDefaultOrderControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_order_by_control_default_query_order_by_control__WEBPACK_IMPORTED_MODULE_14__["default"], {
        trackInteraction: trackInteraction
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_layout_options_control__WEBPACK_IMPORTED_MODULE_22__["default"], {
        ...displayControlProps
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_width_options_control__WEBPACK_IMPORTED_MODULE_27__["default"], {
        ...dimensionsControlProps
      }), showProductsPerPageControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_products_per_page_control__WEBPACK_IMPORTED_MODULE_29__["default"], {
        ...queryControlProps,
        carouselVariant: isCarouselLayout
      }), showColumnsControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_columns_control__WEBPACK_IMPORTED_MODULE_11__["default"], {
        ...displayControlProps
      }), showOffsetControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_offset_control__WEBPACK_IMPORTED_MODULE_30__["default"], {
        ...queryControlProps
      }), showMaxPagesToShowControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_max_pages_to_show_control__WEBPACK_IMPORTED_MODULE_31__["default"], {
        ...queryControlProps
      })]
    }), showCustomQueryControls ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.__experimentalToolsPanel, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filters', 'woocommerce'),
      resetAll: resetAllFilters => {
        resetAllFilters.forEach(resetFilter => {
          resetFilter();
        });
      },
      className: "wc-block-editor-product-collection-inspector-toolspanel__filters",
      children: [showOnSaleControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_on_sale_control__WEBPACK_IMPORTED_MODULE_16__["default"], {
        ...queryControlProps
      }), showStockStatusControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_stock_status_control__WEBPACK_IMPORTED_MODULE_17__["default"], {
        ...queryControlProps
      }), showHandPickedProductsControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_hand_picked_products_control__WEBPACK_IMPORTED_MODULE_21__["default"], {
        ...queryControlProps
      }), showKeywordControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_keyword_control__WEBPACK_IMPORTED_MODULE_18__["default"], {
        ...queryControlProps
      }), showAttributesControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_attributes_control__WEBPACK_IMPORTED_MODULE_19__["default"], {
        ...queryControlProps
      }), showTaxonomyControls && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_taxonomy_controls__WEBPACK_IMPORTED_MODULE_20__["default"], {
        ...queryControlProps,
        collection: collection,
        renderMode: "panel"
      }), showFeaturedControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_featured_products_control__WEBPACK_IMPORTED_MODULE_23__["default"], {
        ...queryControlProps
      }), showCreatedControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_created_control__WEBPACK_IMPORTED_MODULE_24__["default"], {
        ...queryControlProps
      }), showPriceRangeControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_price_range_control__WEBPACK_IMPORTED_MODULE_25__["default"], {
        ...queryControlProps
      })]
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/ces-feedback-button'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
      blockName: `${_block_json__WEBPACK_IMPORTED_MODULE_6__.title} block`,
      wrapper: _wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductCollectionInspectorControls);
const isProductCollection = blockName => blockName === _block_json__WEBPACK_IMPORTED_MODULE_6__.name;
const lessThanThresholdSinceUpdate = t => {
  // Xh * 60m * 60s * 1000ms
  const xHoursFromT = t + Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) * 60 * 60 * 1000;
  return Date.now() < xHoursFromT;
};
const displayedLessThanThreshold = (displayCount = 0) => {
  return displayCount <= Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
};

// Upgrade Notice should be displayed only if:
// - block is converted from Products
// - user haven't acknowledged seeing the notice
// - less than X hours since the notice was first displayed
// - notice was displayed less than X times
const shouldDisplayUpgradeNotice = props => {
  const {
    attributes
  } = props;
  const {
    convertedFromProducts
  } = attributes;
  const {
    status,
    time,
    displayCount
  } = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
  return convertedFromProducts && status === 'notseen' && lessThanThresholdSinceUpdate(time) && displayedLessThanThreshold(displayCount);
};

// Block should be unmarked as converted from Products if:
// block is converted from Products and either:
// - user acknowledged seeing the notice
// - it's more than X hours since the notice was first displayed
// - notice was displayed more than X times
// We do that to prevent showing the notice again after Products on
// other page were updated or local storage was cleared or user
// switched to another machine/browser.
const shouldBeUnmarkedAsConverted = props => {
  const {
    attributes
  } = props;
  const {
    convertedFromProducts
  } = attributes;
  const {
    status,
    time,
    displayCount
  } = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
  return convertedFromProducts && (status === 'seen' || !lessThanThresholdSinceUpdate(time) || !displayedLessThanThreshold(displayCount));
};
const CollectionSpecificControls = props => {
  const {
    collection
  } = props.attributes;
  const setQueryAttributeBind = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => _utils__WEBPACK_IMPORTED_MODULE_9__.setQueryAttribute.bind(null, props), [props]);
  const tracksLocation = (0,_tracks_utils__WEBPACK_IMPORTED_MODULE_7__.useTracksLocation)(props.context.templateSlug);
  const trackInteraction = filter => {
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_inspector_control_clicked', {
      collection,
      location: tracksLocation,
      filter
    });
  };
  const queryControlProps = {
    setQueryAttribute: setQueryAttributeBind,
    trackInteraction,
    query: props.attributes.query
  };
  const isByCategoryOrTag = collection === _types__WEBPACK_IMPORTED_MODULE_8__.CoreCollectionNames.BY_CATEGORY || collection === _types__WEBPACK_IMPORTED_MODULE_8__.CoreCollectionNames.BY_TAG;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
    children: [
    /**
     * "Hand-Picked" collection-specific controls.
     */
    collection === _types__WEBPACK_IMPORTED_MODULE_8__.CoreCollectionNames.HAND_PICKED && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_hand_picked_products_control__WEBPACK_IMPORTED_MODULE_21__.HandPickedProductsControlField, {
        ...queryControlProps
      })
    }),
    /**
     * "Related Products" collection-specific controls.
     */
    collection === _types__WEBPACK_IMPORTED_MODULE_8__.CoreCollectionNames.RELATED && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_related_by_control__WEBPACK_IMPORTED_MODULE_28__["default"], {
      ...queryControlProps
    }),
    /**
     * "Category and Tag" collection-specific controls.
     */
    isByCategoryOrTag && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_taxonomy_controls__WEBPACK_IMPORTED_MODULE_20__["default"], {
        ...queryControlProps,
        collection: collection,
        renderMode: "standalone"
      })
    })]
  });
};
const withCollectionSpecificControls = BlockEdit => props => {
  if (!isProductCollection(props.name)) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(BlockEdit, {
      ...props
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(CollectionSpecificControls, {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(BlockEdit, {
      ...props
    })]
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)('editor.BlockEdit', _block_json__WEBPACK_IMPORTED_MODULE_6__.name, withCollectionSpecificControls);
const withUpgradeNoticeControls = BlockEdit => props => {
  if (!isProductCollection(props.name)) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(BlockEdit, {
      ...props
    });
  }
  const displayUpgradeNotice = shouldDisplayUpgradeNotice(props);
  const unmarkAsConverted = shouldBeUnmarkedAsConverted(props);
  if (unmarkAsConverted) {
    props.setAttributes({
      convertedFromProducts: false
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.Fragment, {
    children: [displayUpgradeNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_upgrade_notice__WEBPACK_IMPORTED_MODULE_10__["default"], {
        revertMigration: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(BlockEdit, {
      ...props
    })]
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)('editor.BlockEdit', _block_json__WEBPACK_IMPORTED_MODULE_6__.name, withUpgradeNoticeControls);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/keyword-control.tsx":
/*!*******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/keyword-control.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */





/**
 * Internal dependencies
 */


const KeywordControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const [querySearch, setQuerySearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(query.search);
  const onChangeDebounced = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useDebounce)(() => {
    if (query.search !== querySearch) {
      setQueryAttribute({
        search: querySearch
      });
      trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.KEYWORD);
    }
  }, 250);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    onChangeDebounced();
    return onChangeDebounced.cancel;
  }, [querySearch, onChangeDebounced]);
  const deselectCallback = () => {
    setQuerySearch('');
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.KEYWORD);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToolsPanelItem, {
    hasValue: () => !!querySearch,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Keyword', 'woocommerce'),
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Keyword', 'woocommerce'),
      value: querySearch,
      onChange: setQuerySearch
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KeywordControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/layout-options-control.tsx":
/*!**************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/layout-options-control.tsx ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


const getHelpText = layoutOptions => {
  switch (layoutOptions) {
    case _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.GRID:
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products using rows and columns.', 'woocommerce');
    case _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.STACK:
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products in a single column.', 'woocommerce');
    case _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.CAROUSEL:
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products in a carousel. It displays a single row of products.', 'woocommerce');
    default:
      return '';
  }
};
const DEFAULT_VALUE = _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.GRID;
const LayoutOptionsControl = props => {
  const {
    type,
    columns,
    shrinkColumns
  } = props.displayLayout;
  const setDisplayLayout = displayLayout => {
    props.setAttributes({
      displayLayout: {
        type: displayLayout,
        columns,
        shrinkColumns
      }
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'woocommerce'),
    hasValue: () => type !== DEFAULT_VALUE,
    isShownByDefault: true,
    onDeselect: () => {
      setDisplayLayout(_types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.GRID);
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'woocommerce'),
      isBlock: true,
      onChange: value => {
        setDisplayLayout(value);
      },
      help: getHelpText(type),
      value: type,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
        value: _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.STACK,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stack', 'woocommerce')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
        value: _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.GRID,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grid', 'woocommerce')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
        value: _types__WEBPACK_IMPORTED_MODULE_2__.LayoutOptions.CAROUSEL,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Carousel', 'woocommerce')
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LayoutOptionsControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/linked-product-control.tsx":
/*!**************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/linked-product-control.tsx ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */








/**
 * Internal dependencies
 */


const REFERENCE_TYPE_PRODUCT = 'product';
const REFERENCE_TYPE_CART = 'cart';
const REFERENCE_TYPE_ORDER = 'order';
const ProductButton = ({
  isOpen,
  onToggle,
  product,
  isLoading
}) => {
  if (isLoading && !product) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Spinner, {});
  }
  const showPlaceholder = !product;
  const showPlaceholderImg = showPlaceholder || !product?.images?.[0]?.src;
  const imgSrc = showPlaceholderImg ? `${Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())}/blocks/product-collection/placeholder.svg` : product.images[0].src;
  const imgAlt = showPlaceholderImg ? '' : product?.name;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    className: "wc-block-product-collection-linked-product-control__button",
    onClick: onToggle,
    "aria-expanded": isOpen,
    disabled: isLoading,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
      direction: "row",
      expanded: true,
      justify: "flex-start",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FlexItem, {
        className: "wc-block-product-collection-linked-product-control__image-container",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
          src: imgSrc,
          alt: imgAlt
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
        direction: "column",
        align: "flex-start",
        gap: 1,
        className: "wc-block-product-collection-linked-product-control__content",
        children: showPlaceholder ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FlexItem, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
            color: "inherit",
            lineHeight: 1,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select product', 'woocommerce')
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
              color: "inherit",
              lineHeight: 1,
              children: product?.name ? (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__.decodeEntities)(product.name) : ''
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
              color: "inherit",
              lineHeight: 1,
              children: product?.sku
            })
          })]
        })
      })]
    })
  });
};
const LinkedProductPopoverContent = ({
  query,
  setAttributes,
  setIsDropdownOpen
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/product-control'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
  selected: query?.productReference,
  onChange: (value = []) => {
    var _value$0$id;
    const productId = (_value$0$id = value[0]?.id) !== null && _value$0$id !== void 0 ? _value$0$id : null;
    if (productId !== null) {
      setAttributes({
        query: {
          ...query,
          productReference: productId
        }
      });
      setIsDropdownOpen(false);
    }
  },
  messages: {
    search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a product', 'woocommerce')
  }
});
var PRODUCT_REFERENCE_TYPE = /*#__PURE__*/function (PRODUCT_REFERENCE_TYPE) {
  PRODUCT_REFERENCE_TYPE["CURRENT_PRODUCT"] = "CURRENT_PRODUCT";
  PRODUCT_REFERENCE_TYPE["SPECIFIC_PRODUCT"] = "SPECIFIC_PRODUCT";
  return PRODUCT_REFERENCE_TYPE;
}(PRODUCT_REFERENCE_TYPE || {});
const getFromCurrentProductRadioLabel = (currentLocation, hasCartReference, hasOrderReference) => {
  if (currentLocation === REFERENCE_TYPE_CART && hasCartReference) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('From products in the cart', 'woocommerce');
  }
  if (currentLocation === REFERENCE_TYPE_ORDER && hasOrderReference) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('From products in the order', 'woocommerce');
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('From the current product', 'woocommerce');
};
const LinkedProductControl = ({
  query,
  setAttributes,
  location,
  usesReference
}) => {
  const isProductLocation = location.type === REFERENCE_TYPE_PRODUCT;
  const hasProductReference = !!usesReference?.includes(REFERENCE_TYPE_PRODUCT);
  const isCartLocation = location.type === REFERENCE_TYPE_CART;
  const hasCartReference = !!usesReference?.includes(REFERENCE_TYPE_CART);
  const isOrderLocation = location.type === REFERENCE_TYPE_ORDER;
  const hasOrderReference = !!usesReference?.includes(REFERENCE_TYPE_ORDER);
  const {
    productReference
  } = query;
  const {
    product,
    isLoading
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.useGetProduct)(productReference);
  const [isDropdownOpen, setIsDropdownOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [radioControlState, setRadioControlState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)((isProductLocation || isCartLocation || isOrderLocation) && Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productReference) ? PRODUCT_REFERENCE_TYPE.CURRENT_PRODUCT : PRODUCT_REFERENCE_TYPE.SPECIFIC_PRODUCT);
  const prevReference = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(undefined);
  const showRadioControl = isProductLocation && hasProductReference || isCartLocation && hasCartReference || isOrderLocation && hasOrderReference;
  const showSpecificProductSelector = showRadioControl ? radioControlState === PRODUCT_REFERENCE_TYPE.SPECIFIC_PRODUCT : !Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productReference);
  const showLinkedProductControl = (showRadioControl || showSpecificProductSelector) && (
  /**
   * Linked control is only useful for collection which uses product, cart or order reference.
   */
  hasProductReference || hasCartReference || hasOrderReference);
  if (!showLinkedProductControl) return null;
  const radioControlHelp = radioControlState === PRODUCT_REFERENCE_TYPE.CURRENT_PRODUCT ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked products will be pulled from the product a shopper is currently viewing', 'woocommerce') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a product to pull the linked products from', 'woocommerce');
  const handleRadioControlChange = newValue => {
    if (newValue === PRODUCT_REFERENCE_TYPE.CURRENT_PRODUCT) {
      const {
        productReference: toSave,
        ...rest
      } = query;
      prevReference.current = toSave;
      setAttributes({
        query: rest
      });
    } else {
      setAttributes({
        query: prevReference.current ? {
          ...query,
          productReference: prevReference.current
        } : query
      });
    }
    setRadioControlState(newValue);
  };
  const fromCurrentProductRadioLabel = getFromCurrentProductRadioLabel(location.type, hasCartReference, hasOrderReference);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Product', 'woocommerce'),
    children: [showRadioControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RadioControl, {
        className: "wc-block-product-collection-product-reference-radio",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products to show', 'woocommerce'),
        help: radioControlHelp,
        selected: radioControlState,
        options: [{
          label: fromCurrentProductRadioLabel,
          value: PRODUCT_REFERENCE_TYPE.CURRENT_PRODUCT
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('From a specific product', 'woocommerce'),
          value: PRODUCT_REFERENCE_TYPE.SPECIFIC_PRODUCT
        }],
        onChange: handleRadioControlChange
      })
    }), showSpecificProductSelector && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Dropdown, {
        className: "wc-block-product-collection-linked-product-control",
        contentClassName: "wc-block-product-collection-linked-product__popover-content",
        popoverProps: {
          placement: 'left-start'
        },
        renderToggle: ({
          isOpen,
          onToggle
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(ProductButton, {
          isOpen: isOpen,
          onToggle: onToggle,
          product: product,
          isLoading: isLoading
        }),
        renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(LinkedProductPopoverContent, {
          query: query,
          setAttributes: setAttributes,
          setIsDropdownOpen: setIsDropdownOpen
        }),
        open: isDropdownOpen,
        onToggle: () => setIsDropdownOpen(!isDropdownOpen)
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LinkedProductControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/max-pages-to-show-control.tsx":
/*!*****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/max-pages-to-show-control.tsx ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const MaxPagesToShowControl = ({
  query,
  setQueryAttribute,
  trackInteraction
}) => {
  const deselectCallback = () => {
    setQueryAttribute({
      pages: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.pages
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.MAX_PAGES_TO_SHOW);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max pages to show', 'woocommerce'),
    hasValue: () => query.pages !== _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.pages,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
      __next40pxDefaultSize: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max pages to show', 'woocommerce'),
      value: query.pages,
      min: 0,
      onChange: newPages => {
        if (isNaN(newPages) || newPages < 0) {
          return;
        }
        setQueryAttribute({
          pages: newPages
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.MAX_PAGES_TO_SHOW);
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Limit the pages you want to show, even if the query has more results. To show all pages use 0 (zero).', 'woocommerce')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MaxPagesToShowControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/offset-control.tsx":
/*!******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/offset-control.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const MIN_OFFSET = 0;
const MAX_OFFSET = 100;
const OffsetControl = ({
  query,
  setQueryAttribute,
  trackInteraction
}) => {
  const deselectCallback = () => {
    setQueryAttribute({
      offset: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.offset
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.OFFSET);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'woocommerce'),
    hasValue: () => query.offset !== _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.offset,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
      __next40pxDefaultSize: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'woocommerce'),
      value: query.offset,
      min: MIN_OFFSET,
      onChange: newOffset => {
        if (isNaN(newOffset) || newOffset < MIN_OFFSET || newOffset > MAX_OFFSET) {
          return;
        }
        setQueryAttribute({
          offset: newOffset
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.OFFSET);
      }
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffsetControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/on-sale-control.tsx":
/*!*******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/on-sale-control.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const OnSaleControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const deselectCallback = () => {
    setQueryAttribute({
      woocommerceOnSale: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_FILTERS.woocommerceOnSale
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.ON_SALE);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On Sale', 'woocommerce'),
    hasValue: () => query.woocommerceOnSale === true,
    isShownByDefault: true,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show only products on sale', 'woocommerce'),
      checked: query.woocommerceOnSale || false,
      onChange: woocommerceOnSale => {
        setQueryAttribute({
          woocommerceOnSale
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.ON_SALE);
      }
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OnSaleControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/order-by-control/custom-query-order-by-control.tsx":
/*!**************************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/order-by-control/custom-query-order-by-control.tsx ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _order_by_control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/order-by-control.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */




const orderOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A → Z', 'woocommerce'),
  value: 'title/asc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Z → A', 'woocommerce'),
  value: 'title/desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Newest to oldest', 'woocommerce'),
  value: 'date/desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Oldest to newest', 'woocommerce'),
  value: 'date/asc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price, high to low', 'woocommerce'),
  value: 'price/desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price, low to high', 'woocommerce'),
  value: 'price/asc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sales, high to low', 'woocommerce'),
  value: 'sales/desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sales, low to high', 'woocommerce'),
  value: 'sales/asc'
}, {
  value: 'rating/desc',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating, high to low', 'woocommerce')
}, {
  value: 'rating/asc',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating, low to high', 'woocommerce')
}, {
  // In WooCommerce, "Manual (menu order + name)" refers to a custom ordering set by the store owner.
  // Products can be manually arranged in the desired order in the WooCommerce admin panel.
  value: 'menu_order/asc',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manual (menu order + name)', 'woocommerce')
}, {
  value: 'random',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Random', 'woocommerce')
}];
const CustomQueryOrderByControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const {
    order,
    orderBy
  } = query;
  const deselectCallback = () => {
    setQueryAttribute({
      orderBy: _constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_QUERY.orderBy
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_1__.CoreFilterNames.ORDER);
  };
  let orderValue = order ? `${orderBy}/${order}` : orderBy;

  // This is to provide backward compatibility as we removed the 'popularity' (Best Selling) option from the order options.
  if (orderBy === 'popularity') {
    orderValue = `sales/${order}`;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_order_by_control__WEBPACK_IMPORTED_MODULE_3__["default"], {
    selectedValue: orderValue,
    hasValue: () => order !== _constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_QUERY.order || orderBy !== _constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_QUERY.orderBy,
    orderOptions: orderOptions,
    onChange: value => {
      const [newOrderBy, newOrder] = value.split('/');
      setQueryAttribute({
        orderBy: newOrderBy,
        order: newOrder || undefined
      });
      trackInteraction(_types__WEBPACK_IMPORTED_MODULE_1__.CoreFilterNames.ORDER);
    },
    onDeselect: deselectCallback,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the products order in this collection.', 'woocommerce')
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CustomQueryOrderByControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/order-by-control/default-query-order-by-control.tsx":
/*!***************************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/order-by-control/default-query-order-by-control.tsx ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/product-collection/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _order_by_control__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/order-by-control.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */


const orderOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Newest to oldest', 'woocommerce'),
  value: 'date'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price, high to low', 'woocommerce'),
  value: 'price-desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price, low to high', 'woocommerce'),
  value: 'price'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sales, high to low', 'woocommerce'),
  value: 'popularity'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rating, high to low', 'woocommerce'),
  value: 'rating'
}, {
  // In WooCommerce, "Manual (menu order + name)" refers to a custom ordering set by the store owner.
  // Products can be manually arranged in the desired order in the WooCommerce admin panel.
  value: 'menu_order',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manual (menu order + name)', 'woocommerce')
}];
const DefaultQueryOrderByControl = ({
  trackInteraction
}) => {
  const settings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core').getEditedEntityRecord('root', 'site');
  const [value, setValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(settings.woocommerce_default_catalog_orderby || 'menu_order');
  const onChange = newValue => {
    setValue(newValue);
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store).editEntityRecord('root', 'site', undefined, {
      [`woocommerce_default_catalog_orderby`]: newValue
    });
    trackInteraction(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/product-collection/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).DEFAULT_ORDER);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_order_by_control__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default sort by', 'woocommerce'),
    selectedValue: value,
    orderOptions: orderOptions,
    onChange: onChange,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All Product Collection blocks using the Default Query will sync to this sort order.', 'woocommerce')
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DefaultQueryOrderByControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/order-by-control/order-by-control.tsx":
/*!*************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/order-by-control/order-by-control.tsx ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



const OrderByControl = ({
  hasValue = () => true,
  orderOptions,
  onChange,
  onDeselect = () => void 0,
  selectedValue,
  label,
  help
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order by', 'woocommerce'),
    hasValue: hasValue,
    isShownByDefault: true,
    onDeselect: onDeselect,
    resetAllFilter: onDeselect,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      value: selectedValue,
      options: orderOptions,
      label: label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order by', 'woocommerce'),
      onChange: onChange,
      help: help
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OrderByControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/price-range-control/PriceTextField.tsx":
/*!**************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/price-range-control/PriceTextField.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/price-format'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External dependencies
 */





const formatNumber = (val, currency) => {
  // Round the number to the correct number of decimals
  const factor = Math.pow(10, currency.minorUnit);
  const roundedValue = `${Math.round(val * factor) / factor}`;

  // Split the number into whole and decimal parts
  let [whole, decimal] = roundedValue.split('.');

  // Apply the thousand separator
  if (currency.thousandSeparator) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandSeparator);
  }

  // If there is no decimal part, we don't need to add decimal separator
  if (!decimal) {
    return whole;
  }

  // Add the decimal separator to the number.
  const decimalSeparator = currency.decimalSeparator || '.';
  return `${whole}${decimalSeparator}${decimal}`;
};
const formatNumberAsCurrency = (val, currency) => {
  if (val === undefined || isNaN(val)) {
    return undefined;
  }
  let formattedNumber = formatNumber(val, currency);

  /**
   * Add the currency symbol to the number.
   * For example, if the currency is USD, the value is 1000.00
   * It should be converted to $1,000.00
   */
  if (currency?.prefix) {
    formattedNumber = `${currency.prefix}${formattedNumber}`;
  }
  if (currency?.suffix) {
    formattedNumber = `${formattedNumber}${currency.suffix}`;
  }
  return formattedNumber;
};
const convertCurrencyStringToNumber = (currencyString = '', currency) => {
  /**
   * 1. Remove all characters that are not numbers or the decimal separator.
   * 2. Replace the decimal separator with a period.
   */
  const cleanedCurrencyString = currencyString.replace(new RegExp(`[^0-9\\${currency.decimalSeparator || ''}]`, 'g'), '').replace(new RegExp(`\\${currency.decimalSeparator}`, 'g'), '.');
  const parsedNumericValue = Number(cleanedCurrencyString);
  if (cleanedCurrencyString === '' || isNaN(parsedNumericValue)) {
    return undefined;
  }

  /**
   * If the value is negative, return 0.
   */
  if (parsedNumericValue < 0) {
    return 0;
  }
  return parsedNumericValue;
};
const PriceTextField = ({
  value,
  onChange,
  label
}) => {
  const [inputValue, setInputValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(`${value || ''}`);
  const currency = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/price-format'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
  const parsedNumericValue = convertCurrencyStringToNumber(inputValue, currency);
  const formattedValue = formatNumberAsCurrency(parsedNumericValue, currency);
  const handleOnChange = val => {
    setInputValue(val);
  };
  const handleOnBlur = () => {
    onChange(parsedNumericValue);
  };

  /**
   * When the user presses the enter key, the new value should be saved.
   */
  const handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      onChange(parsedNumericValue);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: formattedValue,
    onChange: handleOnChange,
    onBlur: handleOnBlur,
    onKeyDown: handleEnterKeyPress,
    label: label,
    prefix: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControlPrefixWrapper, {
      children: label
    }),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Auto', 'woocommerce'),
    hideLabelFromVision: true,
    type: "text",
    style: {
      textAlign: 'right'
    },
    __next40pxDefaultSize: true
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PriceTextField);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/price-range-control/index.tsx":
/*!*****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/price-range-control/index.tsx ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _PriceTextField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PriceTextField */ "./blocks/product-collection/edit/inspector-controls/price-range-control/PriceTextField.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




const PriceRangeControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const value = query.priceRange;
  const deselectCallback = () => {
    setQueryAttribute({
      priceRange: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_FILTERS.priceRange
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.PRICE_RANGE);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price Range', 'woocommerce'),
    hasValue: () => {
      return value?.min !== undefined || value?.max !== undefined;
    },
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    className: "wc-block-product-price-range-control",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl.VisualLabel, {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('PRICE RANGE', 'woocommerce')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalHStack, {
      spacing: "2",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_PriceTextField__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('MIN', 'woocommerce'),
        value: value?.min,
        onChange: val => {
          const min = val === 0 ? undefined : val;
          setQueryAttribute({
            priceRange: {
              min,
              max: value?.max
            }
          });
          trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.PRICE_RANGE);
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_PriceTextField__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('MAX', 'woocommerce'),
        value: value?.max,
        onChange: val => {
          const max = val === 0 ? undefined : val;
          setQueryAttribute({
            priceRange: {
              min: value?.min,
              max
            }
          });
          trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.PRICE_RANGE);
        }
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PriceRangeControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/products-per-page-control.tsx":
/*!*****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/products-per-page-control.tsx ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



const MIN_PRODUCTS_PER_PAGE = 1;
const MAX_PRODUCTS_PER_PAGE = 100;
const CAROUSEL_PERFORMANCE_WARNING_THRESHOLD = 30;
const defaultLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products per page', 'woocommerce');
const carouselLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products in carousel', 'woocommerce');
const getLabel = carouselVariant => {
  return carouselVariant ? carouselLabel : defaultLabel;
};
const ProductsPerPageControl = ({
  query,
  setQueryAttribute,
  trackInteraction,
  carouselVariant
}) => {
  const deselectCallback = () => {
    setQueryAttribute({
      perPage: _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.perPage
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.PRODUCTS_PER_PAGE);
  };
  const label = getLabel(carouselVariant);
  const perPage = query.perPage || _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.perPage;
  const showPerformanceWarning = carouselVariant && perPage > CAROUSEL_PERFORMANCE_WARNING_THRESHOLD;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: label,
    isShownByDefault: true,
    hasValue: () => query.perPage !== _constants__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_QUERY.perPage,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: [showPerformanceWarning && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "warning",
        isDismissible: false,
        className: "wc-block-editor-product-collection__carousel-warning",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('High product counts in carousel may impact performance. Consider reducing the number of products for better user experience.', 'woocommerce')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true,
      label: label,
      min: MIN_PRODUCTS_PER_PAGE,
      max: MAX_PRODUCTS_PER_PAGE,
      onChange: newPerPage => {
        if (newPerPage < MIN_PRODUCTS_PER_PAGE || newPerPage > MAX_PRODUCTS_PER_PAGE) {
          return;
        }
        setQueryAttribute({
          perPage: newPerPage
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.PRODUCTS_PER_PAGE);
      },
      value: perPage
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductsPerPageControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/related-by-control.tsx":
/*!**********************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/related-by-control.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


const RelatedByControl = ({
  query,
  setQueryAttribute,
  trackInteraction
}) => {
  const relatedBy = query?.relatedBy;
  const handleRelatedByChange = (value, type) => {
    const newRelatedBy = {
      ...relatedBy,
      [type]: value
    };
    setQueryAttribute({
      relatedBy: newRelatedBy
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.RELATED_BY);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Related by', 'woocommerce'),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "wc-block-editor-product-collection-inspector-controls__relate-by",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Categories', 'woocommerce'),
        checked: relatedBy?.categories,
        onChange: value => {
          handleRelatedByChange(value, 'categories');
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tags', 'woocommerce'),
        checked: relatedBy?.tags,
        onChange: value => {
          handleRelatedByChange(value, 'tags');
        }
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RelatedByControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/stock-status-control.tsx":
/*!************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/stock-status-control.tsx ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fast-deep-equal/es6 */ "./node_modules/fast-deep-equal/es6/index.js");
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



/**
 * Gets the id of a specific stock status from its text label
 *
 * In theory, we could use a `saveTransform` function on the
 * `FormFieldToken` component to do the conversion. However, plugins
 * can add custom stock statuses which don't conform to our naming
 * conventions.
 */

function getStockStatusIdByLabel(statusLabel) {
  const label = typeof statusLabel === 'string' ? statusLabel : statusLabel.value;
  return Object.entries(_constants__WEBPACK_IMPORTED_MODULE_4__.STOCK_STATUS_OPTIONS).find(([, value]) => value === label)?.[0];
}
const StockStatusControl = props => {
  const {
    query,
    trackInteraction,
    setQueryAttribute
  } = props;
  const deselectCallback = () => {
    setQueryAttribute({
      woocommerceStockStatus: _constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_FILTERS.woocommerceStockStatus
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_3__.CoreFilterNames.STOCK_STATUS);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stock Status', 'woocommerce'),
    hasValue: () => !fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1___default()(query.woocommerceStockStatus, (0,_constants__WEBPACK_IMPORTED_MODULE_4__.getDefaultStockStatuses)()),
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    isShownByDefault: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stock Status', 'woocommerce'),
      onChange: statusLabels => {
        const woocommerceStockStatus = statusLabels.map(getStockStatusIdByLabel).filter(Boolean);
        setQueryAttribute({
          woocommerceStockStatus
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_3__.CoreFilterNames.STOCK_STATUS);
      },
      suggestions: Object.values(_constants__WEBPACK_IMPORTED_MODULE_4__.STOCK_STATUS_OPTIONS),
      validateInput: value => Object.values(_constants__WEBPACK_IMPORTED_MODULE_4__.STOCK_STATUS_OPTIONS).includes(value),
      value: query?.woocommerceStockStatus?.map(key => _constants__WEBPACK_IMPORTED_MODULE_4__.STOCK_STATUS_OPTIONS[key]) || [],
      __experimentalExpandOnFocus: true,
      __experimentalShowHowTo: false
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StockStatusControl);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/index.tsx":
/*!***************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/taxonomy-controls/index.tsx ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useTaxonomies: () => (/* binding */ useTaxonomies)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _taxonomy_item__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./taxonomy-item */ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/taxonomy-item.tsx");
/* harmony import */ var _use_taxonomy_controls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./use-taxonomy-controls */ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/use-taxonomy-controls.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */



/**
 * Hook that returns the taxonomies associated with product post type.
 */

const useTaxonomies = () => {
  const taxonomies = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const {
      getTaxonomies
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    const filteredTaxonomies = getTaxonomies({
      type: 'product',
      per_page: -1
    });
    return filteredTaxonomies;
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return taxonomies?.filter(({
      visibility
    }) => !!visibility?.publicly_queryable);
  }, [taxonomies]);
};

/**
 * Normalize the name so first letter of every word is capitalized.
 */
const normalizeName = name => {
  if (!name) {
    return '';
  }
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
function TaxonomyControls({
  setQueryAttribute,
  trackInteraction,
  query,
  collection,
  renderMode = 'panel'
}) {
  const {
    filteredTaxonomies,
    taxQuery,
    createHandleChange,
    shouldShowTaxonomyControl
  } = (0,_use_taxonomy_controls__WEBPACK_IMPORTED_MODULE_5__["default"])({
    query,
    collection,
    setQueryAttribute,
    trackInteraction,
    isFiltersPanel: renderMode === 'panel'
  });
  if (!shouldShowTaxonomyControl) {
    return null;
  }
  const createTaxonomyControl = taxonomy => {
    const {
      slug
    } = taxonomy;
    const termIds = taxQuery?.[slug] || [];
    const handleChange = createHandleChange(slug);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_taxonomy_item__WEBPACK_IMPORTED_MODULE_4__["default"], {
      taxonomy: taxonomy,
      termIds: termIds,
      onChange: handleChange
    }, slug);
  };
  const createTaxonomyToolsPanelItem = taxonomy => {
    const {
      slug,
      name
    } = taxonomy;
    const termIds = taxQuery?.[slug] || [];
    const handleChange = createHandleChange(slug);
    const deselectCallback = () => handleChange([]);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToolsPanelItem, {
      label: normalizeName(name),
      hasValue: () => termIds.length > 0,
      onDeselect: deselectCallback,
      resetAllFilter: deselectCallback,
      children: createTaxonomyControl(taxonomy)
    }, slug);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: filteredTaxonomies.map(taxonomy => {
      return renderMode === 'panel' ? createTaxonomyToolsPanelItem(taxonomy) : createTaxonomyControl(taxonomy);
    })
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TaxonomyControls);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/taxonomy-item.tsx":
/*!***********************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/taxonomy-controls/taxonomy-item.tsx ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */







/**
 * The default arguments to use when querying terms.
 */
const DEFAULT_QUERY_ARGS = {
  _fields: 'id,name',
  order: 'asc',
  orderby: 'name',
  context: 'view'
};

/**
 * Given a term this will return a token to use in the FormTokenField. Since the
 * field only allows for string values we need to make sure that the name
 * has all of the information needed to identify the term object. We do
 * this by encoding the term ID in the name.
 *
 * @param {Term} term The term to build a token for.
 * @return {string} The token for the term.
 */
const getTokenForTerm = term => {
  // Make sure that the ID is AFTER the name so that the matching
  // in FormTokenField works and the suggestions are rendered.
  return `${term.name} (#${term.id})`;
};

/**
 * Parses a token generated by `getTokenForTerm` into a term object.
 *
 * @param {string} token The token to parse.
 * @return {Term|false} The term if one could be parsed and false if not.
 */
const getTermFromToken = token => {
  var _matches$;
  const matches = token.match(/^(?:(.+) )?\(#(\d+)\)$/);
  if (!matches) {
    return false;
  }
  return {
    name: (_matches$ = matches[1]) !== null && _matches$ !== void 0 ? _matches$ : '',
    id: parseInt(matches[2], 10)
  };
};
const TaxonomyItem = ({
  taxonomy,
  termIds,
  onChange
}) => {
  // We need to get the existing terms so that we can store the term object
  // in the map that we used to render the term name in the FormTokenField.
  const {
    existingTerms,
    isLoadingExistingTerms
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    // There's no need to load any existing terms when there are no terms set.
    if (!termIds || !termIds.length) {
      return {
        existingTerms: [],
        isLoadingExistingTerms: false
      };
    }

    // @ts-expect-error hasFinishedResolution is untyped.
    const {
      getEntityRecords,
      hasFinishedResolution
    } = select('core');
    const selectorArgs = ['taxonomy', taxonomy.slug, {
      ...DEFAULT_QUERY_ARGS,
      include: termIds
    }];
    return {
      existingTerms: getEntityRecords(...selectorArgs),
      isLoadingExistingTerms: !hasFinishedResolution('getEntityRecords', selectorArgs)
    };
  }, [taxonomy, termIds]);

  // A search query will enable us to populate the FormTokenField's suggestion
  // list based on the user supplied search string.
  const [searchQuery, setSearchQuery] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const {
    searchTerms
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    // The FormTokenField requires at least two characters to start showing
    // the suggestions. Let's not waste a web request since it won't do
    // anything useful.
    if (searchQuery.length <= 1) {
      return {
        searchTerms: []
      };
    }
    const {
      getEntityRecords
    } = select('core');
    return {
      searchTerms: getEntityRecords('taxonomy', taxonomy.slug, {
        ...DEFAULT_QUERY_ARGS,
        exclude: termIds,
        search: searchQuery
      })
    };
  }, [taxonomy, termIds, searchQuery]);
  const handleSearch = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.useDebounce)(setSearchQuery, 250);

  // Transform the terms for the FormTokenField control and
  // keep track of any duplicate term names for later.
  const allTermNames = new Set();
  const duplicateNames = new Set();
  const createTokenForTerm = term => {
    if (allTermNames.has(term.name)) {
      duplicateNames.add(term.name);
    }
    allTermNames.add(term.name);
    return getTokenForTerm(term);
  };
  const existingTokens = existingTerms ? existingTerms.map(createTokenForTerm) : [];
  const suggestionTokens = searchTerms ? searchTerms.map(createTokenForTerm) : [];

  // Since the FormTokenField has the term ID encoded in the token
  // we need to pull out the ID in order to update the term IDs.
  const handleChangeTermIDs = tokens => {
    const newTermIds = [];
    tokens.forEach(token => {
      const term = getTermFromToken(token);
      if (!term) {
        return;
      }
      newTermIds.push(term.id);
    });
    onChange(newTermIds);
  };

  // It's possible that a term may have been deleted but still
  // be present in the termIds array. In that case we will
  // display the ID and an indication it was deleted.
  if (existingTerms && termIds.length !== existingTerms.length) {
    // Use a map to make checking for the terms faster.
    const termMap = existingTerms.reduce((acc, term) => {
      acc[term.id] = term;
      return acc;
    }, {});

    // Deleted terms will be displayed as just the ID with no name.
    termIds.forEach(termId => {
      if (!termMap[termId]) {
        existingTokens.push(`(#${termId})`);
      }
    });
  }

  // Since our tokens include some encoding we need to perform some transformations
  // before they can be displayed in the input and in the suggestion list.
  const displayTermName = display => {
    const term = getTermFromToken(display);
    if (term) {
      // Terms that are missing will be identified as such.
      if (!term.name) {
        display = `(#${term.id} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Missing', 'woocommerce')})`;
      }
      // Terms with names that are non-unique will have the ID appended.
      else if (duplicateNames.has(term.name)) {
        display = `${term.name} (#${term.id})`;
      }
      // Terms that fit neither criteria just display the name.
      else {
        display = term.name;
      }
    }

    // Both the API and React will encode any HTML entities in the term name.
    // We need to decode them before they are rendered to undo the
    // API's encoding so that React can display them properly.
    return (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__.decodeEntities)(display) || '';
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "wc-block-editor-product-collection-inspector__taxonomy-control",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FormTokenField, {
      label: taxonomy.name,
      value: existingTokens,
      onInputChange: handleSearch,
      onChange: handleChangeTermIDs,
      suggestions: suggestionTokens,
      disabled: isLoadingExistingTerms,
      displayTransform: displayTermName
      // @ts-expect-error Using experimental features
      ,
      __experimentalShowHowTo: false
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TaxonomyItem);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/use-taxonomy-controls.tsx":
/*!*******************************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/taxonomy-controls/use-taxonomy-controls.tsx ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/index.tsx");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../types */ "./blocks/product-collection/types.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */



/**
 * Shared hook for taxonomy control logic - filters taxonomies based on context and provides common handlers.
 */
function useTaxonomyControls({
  setQueryAttribute,
  trackInteraction,
  query,
  collection,
  isFiltersPanel
}) {
  const {
    taxQuery
  } = query;
  const taxonomies = (0,_index__WEBPACK_IMPORTED_MODULE_1__.useTaxonomies)();
  const filteredTaxonomies = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!taxonomies || taxonomies.length === 0) {
      return [];
    }
    if (collection === _types__WEBPACK_IMPORTED_MODULE_2__.CoreCollectionNames.BY_CATEGORY) {
      return taxonomies.filter(taxonomy =>
      // If it's in filter panel, we want to show everything BUT the category control.
      // Otherwise, it's a collection specific filter and we want to show ONLY the category control.
      isFiltersPanel ? taxonomy.slug !== 'product_cat' : taxonomy.slug === 'product_cat');
    }
    if (collection === _types__WEBPACK_IMPORTED_MODULE_2__.CoreCollectionNames.BY_TAG) {
      return taxonomies.filter(taxonomy =>
      // If it's in filter panel, we want to show everything BUT the tag control.
      // Otherwise, it's a collection specific filter and we want to show ONLY the tag control.
      isFiltersPanel ? taxonomy.slug !== 'product_tag' : taxonomy.slug === 'product_tag');
    }
    return isFiltersPanel ? taxonomies : [];
  }, [taxonomies, collection, isFiltersPanel]);
  const createHandleChange = slug => newTermIds => {
    setQueryAttribute({
      taxQuery: {
        ...taxQuery,
        [slug]: newTermIds
      }
    });
    trackInteraction(`${_types__WEBPACK_IMPORTED_MODULE_2__.CoreFilterNames.TAXONOMY}__${slug}`);
  };
  const shouldShowTaxonomyControl = filteredTaxonomies.length > 0;
  return {
    filteredTaxonomies,
    taxQuery,
    createHandleChange,
    shouldShowTaxonomyControl
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useTaxonomyControls);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/upgrade-notice.tsx":
/*!******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/upgrade-notice.tsx ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-hooks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/upgrade-downgrade-notice'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */







const notice = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createInterpolateElement)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products (Beta) block was upgraded to <strongText />, an updated version with new features and simplified settings.', 'woocommerce'), {
  strongText: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Product Collection`, 'woocommerce')
  })
});
const buttonLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Revert to Products (Beta)', 'woocommerce');
const UpgradeNotice = ({
  revertMigration
}) => {
  const [upgradeNoticeStatus, setUpgradeNoticeStatus] = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-hooks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())());
  const canCountDisplays = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(true);
  const {
    status
  } = upgradeNoticeStatus;
  const handleRemove = () => {
    setUpgradeNoticeStatus({
      status: 'seen',
      time: Date.now()
    });
  };
  const handleRevert = () => {
    revertMigration();
    Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_migration_between_products_beta', {
      transform_to: 'products_beta'
    });
  };

  // Prevent the possibility to count displays multiple times when the
  // block is selected and Inspector Controls are re-rendered multiple times.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const countDisplay = () => {
      if (canCountDisplays.current) {
        Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/blocks/migration-products-to-product-collection'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
        canCountDisplays.current = false;
      }
    };
    return countDisplay;
  }, [canCountDisplays]);
  return status === 'notseen' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/upgrade-downgrade-notice'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    actionLabel: buttonLabel,
    onActionClick: handleRevert,
    onRemove: handleRemove,
    children: notice
  }) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UpgradeNotice);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/use-carousel-layout-adjustments.ts":
/*!**********************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/use-carousel-layout-adjustments.ts ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */


const productTemplateOtherLayouts = {
  layout: {}
};
const productTemplateCarouselLayout = {
  layout: {
    type: 'flex',
    justifyContent: 'left',
    verticalAlignment: 'top',
    flexWrap: 'nowrap',
    orientation: 'horizontal'
  }
};
const createGroupSpaceBetween = innerBlocks => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)('core/group',
// Row variation of the group block
{
  layout: {
    type: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  }
}, innerBlocks);
const createGroupRight = innerBlocks => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)('core/group',
// Row variation of the group block
{
  layout: {
    type: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'right'
  }
}, innerBlocks);

/**
 * Handles the transition to carousel layout:
 * - If there's heading before Product Template block:
 *   - Move heading to the Row block
 *   - Add Next/Previous Buttons block
 * - If there's no heading before Product Template block:
 *   - Add Next/Previous Buttons block
 * - Remove Pagination block (if exists)
 *
 * @param {BlockInstance} productCollectionBlock - The product collection block.
 * @param {ReturnType<typeof useDispatch>} actions - The actions to use.
 */
const handleTransitionToCarouselLayout = (productCollectionBlock, actions) => {
  const {
    removeBlock,
    insertBlock,
    updateBlockAttributes
  } = actions;
  const productTemplateBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.productTemplateBlockName);
  const paginationBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.coreQueryPaginationBlockName);
  const headingBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.headingBlockName);
  const productCollectionClientId = productCollectionBlock?.clientId;
  const productTemplateClientId = productTemplateBlock?.clientId;

  // 1. Change the layout of the product template block
  updateBlockAttributes(productTemplateClientId, productTemplateCarouselLayout);

  // 2. Create and insert the next/previous buttons block
  const nextPrevArrowsBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)(_constants__WEBPACK_IMPORTED_MODULE_5__.nextPreviousButtonsBlockName, {
    layout: {
      type: 'flex',
      flexWrap: 'nowrap'
    }
  });
  if (headingBlock) {
    // @ts-expect-error getBlockIndex is not typed.
    const headingBlockIndex = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store).getBlockIndex(headingBlock.clientId);
    const groupBlock = createGroupSpaceBetween([headingBlock, nextPrevArrowsBlock]);

    // We cannot use replaceBlock directly because it crashes the editor
    // when replacing the product template block with the group block that
    // contains the same product template block.
    removeBlock(headingBlock.clientId, false);
    insertBlock(groupBlock, headingBlockIndex, productCollectionClientId, false);
  } else {
    const productTemplateIndex = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store
    // @ts-expect-error getBlockIndex is not typed.
    ).getBlockIndex(productTemplateClientId);
    const groupBlock = createGroupRight([nextPrevArrowsBlock]);
    insertBlock(groupBlock, productTemplateIndex, productCollectionClientId, false);
  }

  // 3. Remove the pagination block
  if (paginationBlock) {
    removeBlock(paginationBlock.clientId, false);
  }
};

/**
 * Handles the transition from carousel layout:
 * - Remove Next/Previous Buttons block (if exists)
 * - Remove Row block (if empty)
 * - Add Pagination block for default collection (if needed)
 *
 * @param {BlockInstance} productCollectionBlock - The product collection block.
 * @param {ReturnType<typeof useDispatch>} actions - The actions to use.
 * @param {string} collection - The collection.
 */
const handleTransitionFromCarouselLayout = (productCollectionBlock, actions, collection) => {
  const {
    removeBlock,
    insertBlock,
    updateBlockAttributes
  } = actions;
  const productTemplateBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.productTemplateBlockName);

  // 1. Grid and List layouts are handled manually for now so we need to reset it to an empty object.
  updateBlockAttributes(productTemplateBlock?.clientId, productTemplateOtherLayouts);

  // 2. Remove the next/previous buttons block or group block
  // Find the group block containing the next/previous buttons block
  const groupBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, block => {
    return block.name === 'core/group' && block.innerBlocks.some(innerBlock => innerBlock.name === _constants__WEBPACK_IMPORTED_MODULE_5__.nextPreviousButtonsBlockName);
  });
  if (groupBlock) {
    // If next/previous buttons block is the only block in the group block, remove it
    if (groupBlock.innerBlocks.length === 1) {
      removeBlock(groupBlock.clientId, false);
    } else {
      const headingBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(groupBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.headingBlockName);

      // If next/previous buttons and heading are the only blocks in the group block, bring back heading block
      if (headingBlock && groupBlock.innerBlocks.length === 2) {
        const headingBlockIndex = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store
        // @ts-expect-error getBlockIndex is not typed.
        ).getBlockIndex(headingBlock.clientId);
        removeBlock(groupBlock.clientId, false);
        insertBlock(headingBlock, headingBlockIndex, productCollectionBlock.clientId, false);
        // Otherwise remove next previous buttons block and keep the content
      } else {
        const nextPrevButtonsBlock = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.nextPreviousButtonsBlockName);
        removeBlock(nextPrevButtonsBlock?.clientId, false);
      }
    }
  }

  // 3. Add the pagination block for default collection (it has collection attribute undefined).
  if (!collection) {
    insertBlock((0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)(_constants__WEBPACK_IMPORTED_MODULE_5__.coreQueryPaginationBlockName, _constants__WEBPACK_IMPORTED_MODULE_5__.paginationDefaultAttributes), productCollectionBlock.innerBlocks.length, productCollectionBlock.clientId, false);
  }
};

/**
 * Custom hook to adjust the pagination block when switching between layouts.
 *
 * @param {string}                      clientId   - The client ID of the product collection block.
 * @param {ProductCollectionAttributes} attributes - The attributes of the product collection block.
 */
const useCarouselLayoutAdjustments = (clientId, attributes) => {
  const {
    displayLayout,
    collection
  } = attributes;
  const previousLayoutType = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(displayLayout.type);
  const actions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  const {
    productCollectionBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => ({
    productCollectionBlock:
    // @ts-expect-error getBlock is not typed.
    select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store).getBlock(clientId)
  }), [clientId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!clientId) {
      return;
    }

    // When switching TO carousel layout, add Next Previous Buttons block and remove pagination block (if exists).
    if (displayLayout?.type === _types__WEBPACK_IMPORTED_MODULE_6__.LayoutOptions.CAROUSEL && previousLayoutType.current !== _types__WEBPACK_IMPORTED_MODULE_6__.LayoutOptions.CAROUSEL) {
      handleTransitionToCarouselLayout(productCollectionBlock, actions);
    }

    // When switching FROM carousel layout, remove Next Previous Buttons block and add pagination block (if needed).
    if (displayLayout?.type !== _types__WEBPACK_IMPORTED_MODULE_6__.LayoutOptions.CAROUSEL && previousLayoutType.current === _types__WEBPACK_IMPORTED_MODULE_6__.LayoutOptions.CAROUSEL) {
      handleTransitionFromCarouselLayout(productCollectionBlock, actions, collection);
    }
    previousLayoutType.current = displayLayout.type;
  }, [displayLayout.type, clientId, actions, collection]);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useCarouselLayoutAdjustments);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/use-page-context-control.tsx":
/*!****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/use-page-context-control.tsx ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilterableControl: () => (/* binding */ FilterableControl),
/* harmony export */   InheritQueryControl: () => (/* binding */ InheritQueryControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-hooks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * External dependencies
 */





/**
 * Internal dependencies
 */




const label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query type', 'woocommerce');
const defaultOptionLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'woocommerce');
const customOptionLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'woocommerce');
const defaultInheritHelpText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display products based on the current template and allow shoppers to filter.', 'woocommerce');
const defaultFilterableHelpText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show products based on specific criteria and allow shoppers to filter.', 'woocommerce');
const customHelpText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show a list of products based on fixed criteria.', 'woocommerce');
const InheritQueryControl = ({
  setQueryAttribute,
  trackInteraction,
  query
}) => {
  const inherit = query?.inherit;
  const queryObjectBeforeInheritEnabled = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-hooks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(query, value => {
    return value?.inherit === false;
  });
  const defaultValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getDefaultValueOfInherit)(), []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToolsPanelItem, {
    label: label,
    hasValue: () => inherit !== defaultValue,
    isShownByDefault: true,
    onDeselect: () => {
      setQueryAttribute({
        inherit: defaultValue
      });
      trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.INHERIT);
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControl, {
      className: "wc-block-product-collection__inherit-query-control",
      isBlock: true,
      label: label,
      help: inherit ? defaultInheritHelpText : customHelpText,
      value: !!inherit ? 'default' : 'custom',
      onChange: value => {
        if (value === 'default') {
          // If the inherit is enabled, we want to reset the query to the default.
          setQueryAttribute({
            ..._constants__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_QUERY,
            inherit: true
          });
        } else {
          // If the inherit is disabled, we want to reset the query to the previous query before the inherit was enabled.
          setQueryAttribute({
            ..._constants__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_QUERY,
            ...queryObjectBeforeInheritEnabled,
            inherit: false
          });
        }
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.INHERIT);
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControlOption, {
        value: "default",
        label: defaultOptionLabel
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControlOption, {
        value: "custom",
        label: customOptionLabel
      })]
    })
  });
};
const FilterableControl = ({
  setQueryAttribute,
  trackInteraction,
  query
}) => {
  const filterable = query?.filterable;
  const defaultValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getDefaultValueOfFilterable)(), []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToolsPanelItem, {
    label: label,
    hasValue: () => filterable !== defaultValue,
    isShownByDefault: true,
    onDeselect: () => {
      setQueryAttribute({
        filterable: defaultValue
      });
      trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE);
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControl, {
      className: "wc-block-product-collection__inherit-query-control",
      isBlock: true,
      label: label,
      help: filterable ? defaultFilterableHelpText : customHelpText,
      value: !!filterable ? 'default' : 'custom',
      onChange: value => {
        setQueryAttribute({
          filterable: value === 'default'
        });
        trackInteraction(_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.FILTERABLE);
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControlOption, {
        value: "default",
        label: defaultOptionLabel
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalToggleGroupControlOption, {
        value: "custom",
        label: customOptionLabel
      })]
    })
  });
};


/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/width-options-control.tsx":
/*!*************************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/width-options-control.tsx ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */


const getHelpText = type => {
  if (type === _types__WEBPACK_IMPORTED_MODULE_2__.WidthOptions.FILL) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stretch to fill available space.', 'woocommerce');
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specify a fixed width.', 'woocommerce');
};
const WidthOptionsControl = ({
  dimensions,
  setAttributes
}) => {
  const {
    widthType,
    fixedWidth = ''
  } = dimensions;
  const setDimensions = type => {
    setAttributes({
      dimensions: {
        ...dimensions,
        widthType: type
      }
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width', 'woocommerce'),
    hasValue: () => widthType !== _types__WEBPACK_IMPORTED_MODULE_2__.WidthOptions.FILL,
    isShownByDefault: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width', 'woocommerce'),
      value: widthType,
      help: getHelpText(widthType),
      onChange: value => setDimensions(value),
      isBlock: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
        value: _types__WEBPACK_IMPORTED_MODULE_2__.WidthOptions.FILL,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fill', 'woocommerce')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
        value: _types__WEBPACK_IMPORTED_MODULE_2__.WidthOptions.FIXED,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fixed', 'woocommerce')
      })]
    }), widthType === _types__WEBPACK_IMPORTED_MODULE_2__.WidthOptions.FIXED && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalUnitControl, {
      onChange: value => {
        setAttributes({
          dimensions: {
            ...dimensions,
            fixedWidth: value
          }
        });
      },
      value: fixedWidth
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WidthOptionsControl);

/***/ }),

/***/ "./blocks/product-collection/edit/product-collection-content.tsx":
/*!***********************************************************************!*\
  !*** ./blocks/product-collection/edit/product-collection-content.tsx ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! fast-deep-equal/es6 */ "./node_modules/fast-deep-equal/es6/index.js");
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var _inspector_controls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inspector-controls */ "./blocks/product-collection/edit/inspector-controls/index.tsx");
/* harmony import */ var _inspector_advanced_controls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./inspector-advanced-controls */ "./blocks/product-collection/edit/inspector-advanced-controls/index.tsx");
/* harmony import */ var _toolbar_controls__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./toolbar-controls */ "./blocks/product-collection/edit/toolbar-controls/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__);
/**
 * External dependencies
 */







/**
 * Internal dependencies
 */







const useQueryId = (clientId, attributes, ProductCollectionContent) => {
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useInstanceId)(ProductCollectionContent);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore These selectors aren't getting their types loaded for some reason.
  const {
    getBlockParentsByBlockName
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store);

  // In order to properly support pagination this block has a queryId attribute that
  // is initialized to a unique value when the block is first added to the editor.
  // We use the `instanceId` for this purpose. It is stable across saves as long
  // as the order of instances of these blocks in the editor does not change.
  // The block will be re-indexed in that case, however, this won't cause
  // any problems since the queryid only has to be stable across client
  // renders.
  let queryId = instanceId;

  // We need to take special care when handling instances in a sync pattern
  // to avoid an infinite loop. When two instances of a pattern are placed
  // on the same page, updating one will cause the other to be re-inserted.
  // If we change the ID on init it will trigger a loop as each competes
  // to set a new queryId and update the sync pattern.
  const blockParents = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return getBlockParentsByBlockName(clientId, 'core/block');
  }, [getBlockParentsByBlockName, clientId]);
  if (blockParents.length > 0) {
    queryId = attributes.queryId;
  }
  return queryId;
};
const ProductCollectionContent = ({
  preview: {
    setPreviewState,
    initialPreviewState
  } = {},
  ...props
}) => {
  const isInitialAttributesSet = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useRef)(false);
  const {
    clientId,
    attributes,
    setAttributes,
    location,
    isUsingReferencePreviewMode
  } = props;
  (0,_utils__WEBPACK_IMPORTED_MODULE_8__.useSetPreviewState)({
    setPreviewState,
    setAttributes,
    location,
    attributes,
    isUsingReferencePreviewMode
  });
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)();
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)({}, {
    template: _constants__WEBPACK_IMPORTED_MODULE_7__.INNER_BLOCKS_TEMPLATE
  });
  const queryId = useQueryId(clientId, attributes, ProductCollectionContent);
  const defaultAttributesValue = {
    ..._constants__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_ATTRIBUTES,
    query: {
      ..._constants__WEBPACK_IMPORTED_MODULE_7__.DEFAULT_ATTRIBUTES.query,
      inherit: (0,_utils__WEBPACK_IMPORTED_MODULE_8__.getDefaultValueOfInherit)(),
      filterable: (0,_utils__WEBPACK_IMPORTED_MODULE_8__.getDefaultValueOfFilterable)()
    },
    ...attributes,
    queryId,
    // If initialPreviewState is provided, set it as previewState.
    ...(!!attributes.collection && initialPreviewState && {
      __privatePreviewState: initialPreviewState
    })
  };
  let style = {};

  /**
   * Set max-width if fixed width is set.
   */
  if (_types__WEBPACK_IMPORTED_MODULE_6__.WidthOptions.FIXED === attributes?.dimensions?.widthType && attributes?.dimensions?.fixedWidth) {
    style = {
      maxWidth: attributes.dimensions.fixedWidth,
      margin: '0 auto'
    };
  }

  /**
   * Because of issue https://github.com/WordPress/gutenberg/issues/7342,
   * We are using this workaround to set default attributes.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    setAttributes(defaultAttributesValue);
    isInitialAttributesSet.current = true;
  },
  // This hook is only needed on initialization and sets default attributes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  /**
   * If default attributes are not set, we don't wanna render anything.
   * Default attributes are set in the useEffect above.
   */
  isInitialAttributesSet.current = isInitialAttributesSet.current || fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_5___default()(attributes, defaultAttributesValue);
  if (!isInitialAttributesSet.current) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
    ...blockProps,
    children: [attributes.__privatePreviewState?.isPreview && props.isSelected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      variant: "primary",
      size: "small",
      showTooltip: true,
      label: attributes.__privatePreviewState?.previewMessage,
      className: "wc-block-product-collection__preview-button",
      "data-testid": "product-collection-preview-button",
      children: "Preview"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_inspector_controls__WEBPACK_IMPORTED_MODULE_9__["default"], {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_inspector_advanced_controls__WEBPACK_IMPORTED_MODULE_10__["default"], {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_toolbar_controls__WEBPACK_IMPORTED_MODULE_11__["default"], {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      ...innerBlocksProps,
      style: style
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductCollectionContent);

/***/ }),

/***/ "./blocks/product-collection/edit/product-collection-placeholder.tsx":
/*!***************************************************************************!*\
  !*** ./blocks/product-collection/edit/product-collection-placeholder.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _collection_chooser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./collection-chooser */ "./blocks/product-collection/edit/collection-chooser.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */


const ProductCollectionPlaceholder = props => {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();
  const {
    clientId,
    tracksLocation
  } = props;

  // @ts-expect-error Type definitions for this function are missing
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/actions.d.ts
  const {
    replaceBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
  const onCollectionClick = collectionName => {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_collection_chosen_from_placeholder', {
      collection: collectionName,
      location: tracksLocation
    });
    (0,_collection_chooser__WEBPACK_IMPORTED_MODULE_5__.applyCollection)(collectionName, clientId, replaceBlock);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
      className: "wc-blocks-product-collection__placeholder",
      instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('What products do you want to show?', 'woocommerce'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_collection_chooser__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onCollectionClick: onCollectionClick
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductCollectionPlaceholder);

/***/ }),

/***/ "./blocks/product-collection/edit/toolbar-controls/collection-chooser-toolbar.tsx":
/*!****************************************************************************************!*\
  !*** ./blocks/product-collection/edit/toolbar-controls/collection-chooser-toolbar.tsx ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



const CollectionChooserToolbar = props => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarGroup, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButton, {
      onClick: props.openCollectionSelectionModal,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose collection', 'woocommerce')
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CollectionChooserToolbar);

/***/ }),

/***/ "./blocks/product-collection/edit/toolbar-controls/index.tsx":
/*!*******************************************************************!*\
  !*** ./blocks/product-collection/edit/toolbar-controls/index.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ToolbarControls)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _collection_chooser_toolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collection-chooser-toolbar */ "./blocks/product-collection/edit/toolbar-controls/collection-chooser-toolbar.tsx");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../collections */ "./blocks/product-collection/collections/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */



function ToolbarControls(props) {
  const {
    openCollectionSelectionModal
  } = props;
  const collection = (0,_collections__WEBPACK_IMPORTED_MODULE_2__.getCollectionByName)(props.attributes.collection);
  const showCollectionChooserToolbar = collection?.scope?.includes('block') || collection?.scope === undefined;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.BlockControls, {
    children: showCollectionChooserToolbar && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_collection_chooser_toolbar__WEBPACK_IMPORTED_MODULE_1__["default"], {
      openCollectionSelectionModal: openCollectionSelectionModal
    })
  });
}

/***/ }),

/***/ "./blocks/product-collection/icon.tsx":
/*!********************************************!*\
  !*** ./blocks/product-collection/icon.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const Icon = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M19 11H5C4.72386 11 4.5 11.2239 4.5 11.5V17.5C4.5 17.7761 4.72386 18 5 18H19C19.2761 18 19.5 17.7761 19.5 17.5V11.5C19.5 11.2239 19.2761 11 19 11ZM5 9.5H19C20.1046 9.5 21 10.3954 21 11.5V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V11.5C3 10.3954 3.89543 9.5 5 9.5Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M18 7.5C18 7.77614 17.7761 8 17.5 8L6.5 8C6.22386 8 6 7.77614 6 7.5V7.5C6 7.22386 6.22386 7 6.5 7L17.5 7C17.7761 7 18 7.22386 18 7.5V7.5Z",
    fill: "currentColor"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M16 5C16 5.27614 15.7761 5.5 15.5 5.5L8.5 5.5C8.22386 5.5 8 5.27614 8 5V5C8 4.72386 8.22386 4.5 8.5 4.5L15.5 4.5C15.7761 4.5 16 4.72386 16 5V5Z",
    fill: "currentColor"
  })]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Icon);

/***/ }),

/***/ "./blocks/product-collection/save.tsx":
/*!********************************************!*\
  !*** ./blocks/product-collection/save.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QuerySave)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */


function QuerySave({
  attributes: {
    tagName: Tag = 'div'
  }
}) {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save(blockProps);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Tag, {
    ...innerBlocksProps
  });
}

/***/ }),

/***/ "./blocks/product-collection/tracks-utils.ts":
/*!***************************************************!*\
  !*** ./blocks/product-collection/tracks-utils.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTracksLocation: () => (/* binding */ useTracksLocation)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */


var Locations = /*#__PURE__*/function (Locations) {
  Locations["SINGLE_PRODUCT"] = "single-product";
  Locations["PRODUCT_CATALOG"] = "product-catalog";
  Locations["PRODUCT_ARCHIVE"] = "product-archive";
  Locations["ORDER_CONFIRMATION"] = "order-confirmation";
  Locations["CART"] = "cart";
  Locations["CHECKOUT"] = "checkout";
  Locations["POST"] = "post";
  Locations["PAGE"] = "page";
  Locations["OTHER"] = "other";
  return Locations;
}(Locations || {});
const templateSlugToTemplateMap = {
  'single-product': Locations.SINGLE_PRODUCT,
  'archive-product': Locations.PRODUCT_CATALOG,
  'taxonomy-product_cat': Locations.PRODUCT_ARCHIVE,
  'taxonomy-product_tag': Locations.PRODUCT_ARCHIVE,
  'taxonomy-product_attribute': Locations.PRODUCT_ARCHIVE,
  'product-search-results': Locations.PRODUCT_ARCHIVE,
  'order-confirmation': Locations.ORDER_CONFIRMATION,
  'page-cart': Locations.CART,
  'page-checkout': Locations.CHECKOUT
};
const useTracksLocation = templateSlug => {
  const postType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    // @ts-expect-error Type definitions are missing
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/store/selectors.d.ts
    return select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_1__.store).getCurrentPostType();
  }, []);
  if (postType === Locations.PAGE || postType === Locations.POST) {
    return postType;
  }
  if (!templateSlug) {
    return Locations.OTHER;
  }
  const template = templateSlugToTemplateMap[templateSlug];
  if (template) {
    return template;
  }
  if (templateSlug.includes('single-product')) {
    return Locations.SINGLE_PRODUCT;
  }
  if (templateSlug.includes('taxonomy-product_cat') || templateSlug.includes('taxonomy-product_tag')) {
    return Locations.PRODUCT_ARCHIVE;
  }
  return Locations.OTHER;
};

/***/ }),

/***/ "./blocks/product-collection/types.ts":
/*!********************************************!*\
  !*** ./blocks/product-collection/types.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCollectionNames: () => (/* binding */ CoreCollectionNames),
/* harmony export */   CoreFilterNames: () => (/* binding */ CoreFilterNames),
/* harmony export */   ETimeFrameOperator: () => (/* binding */ ETimeFrameOperator),
/* harmony export */   LayoutOptions: () => (/* binding */ LayoutOptions),
/* harmony export */   ProductCollectionUIStatesInEditor: () => (/* binding */ ProductCollectionUIStatesInEditor),
/* harmony export */   WidthOptions: () => (/* binding */ WidthOptions)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */

let ProductCollectionUIStatesInEditor = /*#__PURE__*/function (ProductCollectionUIStatesInEditor) {
  ProductCollectionUIStatesInEditor["COLLECTION_PICKER"] = "collection_chooser";
  ProductCollectionUIStatesInEditor["PRODUCT_REFERENCE_PICKER"] = "product_context_picker";
  ProductCollectionUIStatesInEditor["VALID_WITH_PREVIEW"] = "uses_reference_preview_mode";
  ProductCollectionUIStatesInEditor["VALID"] = "valid";
  ProductCollectionUIStatesInEditor["DELETED_PRODUCT_REFERENCE"] = "deleted_product_reference"; // Future states
  // INVALID = 'invalid',
  return ProductCollectionUIStatesInEditor;
}({});
let LayoutOptions = /*#__PURE__*/function (LayoutOptions) {
  LayoutOptions["GRID"] = "flex";
  LayoutOptions["STACK"] = "list";
  LayoutOptions["CAROUSEL"] = "carousel";
  return LayoutOptions;
}({});
let WidthOptions = /*#__PURE__*/function (WidthOptions) {
  WidthOptions["FILL"] = "fill";
  WidthOptions["FIXED"] = "fixed";
  return WidthOptions;
}({});
let ETimeFrameOperator = /*#__PURE__*/function (ETimeFrameOperator) {
  ETimeFrameOperator["IN"] = "in";
  ETimeFrameOperator["NOT_IN"] = "not-in";
  return ETimeFrameOperator;
}({});
let CoreCollectionNames = /*#__PURE__*/function (CoreCollectionNames) {
  CoreCollectionNames["PRODUCT_CATALOG"] = "woocommerce/product-collection/product-catalog";
  CoreCollectionNames["BEST_SELLERS"] = "woocommerce/product-collection/best-sellers";
  CoreCollectionNames["FEATURED"] = "woocommerce/product-collection/featured";
  CoreCollectionNames["NEW_ARRIVALS"] = "woocommerce/product-collection/new-arrivals";
  CoreCollectionNames["ON_SALE"] = "woocommerce/product-collection/on-sale";
  CoreCollectionNames["TOP_RATED"] = "woocommerce/product-collection/top-rated";
  CoreCollectionNames["HAND_PICKED"] = "woocommerce/product-collection/hand-picked";
  CoreCollectionNames["RELATED"] = "woocommerce/product-collection/related";
  CoreCollectionNames["UPSELLS"] = "woocommerce/product-collection/upsells";
  CoreCollectionNames["CROSS_SELLS"] = "woocommerce/product-collection/cross-sells";
  CoreCollectionNames["BY_CATEGORY"] = "woocommerce/product-collection/by-category";
  CoreCollectionNames["BY_TAG"] = "woocommerce/product-collection/by-tag";
  return CoreCollectionNames;
}({});
let CoreFilterNames = /*#__PURE__*/function (CoreFilterNames) {
  CoreFilterNames["ATTRIBUTES"] = "attributes";
  CoreFilterNames["CREATED"] = "created";
  CoreFilterNames["FEATURED"] = "featured";
  CoreFilterNames["HAND_PICKED"] = "hand-picked";
  CoreFilterNames["INHERIT"] = "inherit";
  CoreFilterNames["KEYWORD"] = "keyword";
  CoreFilterNames["ON_SALE"] = "on-sale";
  CoreFilterNames["ORDER"] = "order";
  CoreFilterNames["DEFAULT_ORDER"] = "default-order";
  CoreFilterNames["STOCK_STATUS"] = "stock-status";
  CoreFilterNames["TAXONOMY"] = "taxonomy";
  CoreFilterNames["PRICE_RANGE"] = "price-range";
  CoreFilterNames["FILTERABLE"] = "filterable";
  CoreFilterNames["PRODUCTS_PER_PAGE"] = "products-per-page";
  CoreFilterNames["MAX_PAGES_TO_SHOW"] = "max-pages-to-show";
  CoreFilterNames["OFFSET"] = "offset";
  CoreFilterNames["RELATED_BY"] = "related-by";
  return CoreFilterNames;
}({});

/***/ }),

/***/ "./blocks/product-collection/utils.tsx":
/*!*********************************************!*\
  !*** ./blocks/product-collection/utils.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addProductCollectionToQueryPaginationParentOrAncestor: () => (/* binding */ addProductCollectionToQueryPaginationParentOrAncestor),
/* harmony export */   getDefaultDisplayLayout: () => (/* binding */ getDefaultDisplayLayout),
/* harmony export */   getDefaultProductCollection: () => (/* binding */ getDefaultProductCollection),
/* harmony export */   getDefaultQueryForSettingsSection: () => (/* binding */ getDefaultQueryForSettingsSection),
/* harmony export */   getDefaultSettings: () => (/* binding */ getDefaultSettings),
/* harmony export */   getDefaultValueOfFilterable: () => (/* binding */ getDefaultValueOfFilterable),
/* harmony export */   getDefaultValueOfInherit: () => (/* binding */ getDefaultValueOfInherit),
/* harmony export */   getUsesReferencePreviewMessage: () => (/* binding */ getUsesReferencePreviewMessage),
/* harmony export */   setQueryAttribute: () => (/* binding */ setQueryAttribute),
/* harmony export */   useGetProduct: () => (/* binding */ useGetProduct),
/* harmony export */   useProductCollectionUIState: () => (/* binding */ useProductCollectionUIState),
/* harmony export */   useSetPreviewState: () => (/* binding */ useSetPreviewState)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./block.json */ "./blocks/product-collection/block.json");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */











/**
 * Internal dependencies
 */





/**
 * Sets the new query arguments of a Product Query block
 *
 * Shorthand for setting new nested query parameters.
 */
function setQueryAttribute(block, queryParams) {
  const {
    query
  } = block.attributes;
  block.setAttributes({
    query: {
      ...query,
      ...queryParams
    }
  });
}
const isInProductArchive = () => {
  const ARCHIVE_PRODUCT_TEMPLATES = ['archive-product', 'taxonomy-product_attribute', 'product-search-results',
  // Custom taxonomy templates have structure:
  // taxonomy-product_cat-<<CATEGORY>>
  // hence we're checking if template ID includes the middle part.
  //
  // That includes:
  // - taxonomy-product_cat
  // - taxonomy-product_tag
  'taxonomy-product_cat', 'taxonomy-product_tag', 'taxonomy-product_brand'];

  // @ts-expect-error getEditedPostSlug is not typed
  const currentTemplateId = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.store).getEditedPostSlug();

  /**
   * Set inherit value when Product Collection block is first added to the page.
   * We want inherit value to be true when block is added to ARCHIVE_PRODUCT_TEMPLATES
   * and false when added to somewhere else.
   */
  if (currentTemplateId) {
    return ARCHIVE_PRODUCT_TEMPLATES.some(template => Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(currentTemplateId) ? currentTemplateId.includes(template) : false);
  }
  return false;
};
const isFirstBlockThatUsesPageContext = property => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore No types for this exist yet, natively.
  const {
    getBlocksByName,
    getBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store);
  const productCollectionBlockIDs = getBlocksByName('woocommerce/product-collection');
  const blockAlreadySyncedWithQuery = productCollectionBlockIDs.find(clientId => {
    const block = getBlock(clientId);
    return block.attributes?.query?.[property];
  });
  return !blockAlreadySyncedWithQuery;
};
function getDefaultValueOfInherit() {
  return isInProductArchive() ? isFirstBlockThatUsesPageContext('inherit') : false;
}
function getDefaultValueOfFilterable() {
  return !isInProductArchive() ? isFirstBlockThatUsesPageContext('filterable') : false;
}

/**
 * Add Product Collection block to the parent or ancestor array of the Core Pagination block.
 * This enhancement allows the Core Pagination block to be available for the Product Collection block.
 */
const addProductCollectionToQueryPaginationParentOrAncestor = () => {
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.registerBlockType', 'woocommerce/add-product-collection-block-to-parent-array-of-pagination-block', (blockSettings, blockName) => {
    if (blockName !== _constants__WEBPACK_IMPORTED_MODULE_10__.coreQueryPaginationBlockName) {
      return blockSettings;
    }
    if (blockSettings?.ancestor) {
      return {
        ...blockSettings,
        ancestor: [...blockSettings.ancestor, _block_json__WEBPACK_IMPORTED_MODULE_11__.name]
      };
    }

    // Below condition is to support WP >=6.4 where Pagination specifies the parent.
    // Can be removed when minimum WP version is set to 6.5 and higher.
    if (blockSettings?.parent) {
      return {
        ...blockSettings,
        parent: [...blockSettings.parent, _block_json__WEBPACK_IMPORTED_MODULE_11__.name]
      };
    }
    return blockSettings;
  });
};

/**
 * Get the message to show in the preview label when the block is in preview mode based
 * on the `usesReference` value.
 */
const getUsesReferencePreviewMessage = (location, isUsingReferencePreviewMode) => {
  if (isUsingReferencePreviewMode) {
    if (location.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).Product) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Actual products will vary depending on the product being viewed.', 'woocommerce');
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Actual products will vary depending on the page being viewed.', 'woocommerce');
  }
  return '';
};
const useProductCollectionUIState = ({
  location,
  usesReference,
  attributes,
  hasInnerBlocks
}) => {
  // Fetch product to check if it's deleted.
  // `product` will be undefined if it doesn't exist.
  const productReference = attributes.query?.productReference;
  const {
    product,
    hasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(selectFunc => {
    if (!productReference) {
      return {
        product: null,
        hasResolved: true
      };
    }
    const {
      getEntityRecord,
      hasFinishedResolution
    } = selectFunc(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);
    const selectorArgs = ['postType', 'product', productReference];
    return {
      product: getEntityRecord(...selectorArgs),
      hasResolved: hasFinishedResolution('getEntityRecord', selectorArgs)
    };
  }, [productReference]);
  const productCollectionUIStateInEditor = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    var _attributes$query$pro;
    const isInRequiredLocation = usesReference?.includes(location.type);
    const isCollectionSelected = !!attributes.collection;

    /**
     * Case 1: Product context picker
     */
    const isProductContextRequired = usesReference?.includes('product');
    const isProductContextSelected = ((_attributes$query$pro = attributes.query?.productReference) !== null && _attributes$query$pro !== void 0 ? _attributes$query$pro : null) !== null;
    if (isCollectionSelected && isProductContextRequired && !isInRequiredLocation && !isProductContextSelected) {
      return _types__WEBPACK_IMPORTED_MODULE_9__.ProductCollectionUIStatesInEditor.PRODUCT_REFERENCE_PICKER;
    }

    // Case 2: Deleted product reference
    if (isCollectionSelected && isProductContextRequired && !isInRequiredLocation && isProductContextSelected) {
      const isProductDeleted = productReference && (product === undefined || product?.status === 'trash');
      if (isProductDeleted) {
        return _types__WEBPACK_IMPORTED_MODULE_9__.ProductCollectionUIStatesInEditor.DELETED_PRODUCT_REFERENCE;
      }
    }

    /**
     * Case 3: Preview mode - based on `usesReference` value
     */
    if (isInRequiredLocation) {
      var _location$sourceData$, _location$sourceData$2;
      /**
       * Block shouldn't be in preview mode when:
       * 1. Current location is archive and termId is available.
       * 2. Current location is product and productId is available.
       *
       * Because in these cases, we have required context on the editor side.
       */
      const isArchiveLocationWithTermId = location.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).Archive && ((_location$sourceData$ = location.sourceData?.termId) !== null && _location$sourceData$ !== void 0 ? _location$sourceData$ : null) !== null;
      const isProductLocationWithProductId = location.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).Product && ((_location$sourceData$2 = location.sourceData?.productId) !== null && _location$sourceData$2 !== void 0 ? _location$sourceData$2 : null) !== null;
      if (!isArchiveLocationWithTermId && !isProductLocationWithProductId &&
      // If there's a user-selected product reference, don't show the preview label
      !productReference) {
        return _types__WEBPACK_IMPORTED_MODULE_9__.ProductCollectionUIStatesInEditor.VALID_WITH_PREVIEW;
      }
    }

    /**
     * Case 4: Collection chooser
     */
    if (!hasInnerBlocks && !isCollectionSelected) {
      return _types__WEBPACK_IMPORTED_MODULE_9__.ProductCollectionUIStatesInEditor.COLLECTION_PICKER;
    }
    return _types__WEBPACK_IMPORTED_MODULE_9__.ProductCollectionUIStatesInEditor.VALID;
  }, [location.type, location.sourceData?.termId, location.sourceData?.productId, usesReference, attributes.collection, productReference, product, hasInnerBlocks, attributes.query?.productReference]);
  return {
    productCollectionUIStateInEditor,
    isLoading: !hasResolved
  };
};
const useSetPreviewState = ({
  setPreviewState,
  location,
  attributes,
  setAttributes,
  isUsingReferencePreviewMode
}) => {
  const setState = newPreviewState => {
    setAttributes({
      __privatePreviewState: {
        ...attributes.__privatePreviewState,
        ...newPreviewState
      }
    });
  };

  /**
   * When usesReference is available on Frontend but not on Editor side,
   * we want to show a preview label to indicate that the block is in preview mode.
   */
  const usesReferencePreviewMessage = getUsesReferencePreviewMessage(location, isUsingReferencePreviewMode);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(() => {
    if (isUsingReferencePreviewMode) {
      setAttributes({
        __privatePreviewState: {
          isPreview: usesReferencePreviewMessage.length > 0,
          previewMessage: usesReferencePreviewMessage
        }
      });
    }
  }, [setAttributes, usesReferencePreviewMessage, isUsingReferencePreviewMode]);

  // Running setPreviewState function provided by Collection, if it exists.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(() => {
    if (!setPreviewState && !isUsingReferencePreviewMode) {
      return;
    }
    const cleanup = setPreviewState?.({
      setState,
      location,
      attributes
    });
    if (cleanup) {
      return cleanup;
    }

    // It should re-run only when setPreviewState changes to avoid performance issues.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPreviewState]);

  /**
   * For all Product Collection blocks that inherit query from the template,
   * we want to show a preview message in the editor if the block is in
   * generic archive template i.e.
   * - Products by category
   * - Products by tag
   * - Products by attribute
   */
  const termId = location.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).Archive ? location.sourceData?.termId : null;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(() => {
    if (!setPreviewState && !isUsingReferencePreviewMode) {
      const isGenericArchiveTemplate = location.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module '../product-template/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).Archive && termId === null;
      setAttributes({
        __privatePreviewState: {
          isPreview: isGenericArchiveTemplate ? !!attributes?.query?.inherit : false,
          previewMessage: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Actual products will vary depending on the page being viewed.', 'woocommerce')
        }
      });
    }
  }, [attributes?.query?.inherit, usesReferencePreviewMessage, termId, location.type, setAttributes, setPreviewState, isUsingReferencePreviewMode]);
};
const getDefaultQueryForSettingsSection = currentQuery => ({
  ...currentQuery,
  orderBy: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_QUERY.orderBy,
  order: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_QUERY.order,
  inherit: getDefaultValueOfInherit(),
  filterable: getDefaultValueOfFilterable(),
  perPage: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_QUERY.perPage,
  offset: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_QUERY.offset,
  pages: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_QUERY.pages
});
const getDefaultDisplayLayout = () => _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_ATTRIBUTES.displayLayout;
const getDefaultSettings = currentAttributes => ({
  displayLayout: getDefaultDisplayLayout(),
  query: getDefaultQueryForSettingsSection(currentAttributes.query),
  dimensions: _constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_ATTRIBUTES.dimensions
});
const getDefaultProductCollection = () => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__.createBlock)(_block_json__WEBPACK_IMPORTED_MODULE_11__.name, {
  ..._constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_ATTRIBUTES,
  query: {
    ..._constants__WEBPACK_IMPORTED_MODULE_10__.DEFAULT_ATTRIBUTES.query,
    inherit: getDefaultValueOfInherit(),
    filterable: getDefaultValueOfFilterable()
  }
}, (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_8__.createBlocksFromInnerBlocksTemplate)(_constants__WEBPACK_IMPORTED_MODULE_10__.INNER_BLOCKS_TEMPLATE));
const useGetProduct = productId => {
  const [product, setProduct] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(null);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const fetchProduct = async () => {
      if (productId) {
        setIsLoading(true);
        try {
          const fetchedProduct = await Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/editor-components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(productId);
          setProduct(fetchedProduct);
        } catch (error) {
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProduct(null);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  return {
    product,
    isLoading
  };
};

/***/ }),

/***/ "./blocks/product-collection/variations/elements/product-summary.tsx":
/*!***************************************************************************!*\
  !*** ./blocks/product-collection/variations/elements/product-summary.tsx ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CORE_NAME: () => (/* binding */ CORE_NAME),
/* harmony export */   VARIATION_NAME: () => (/* binding */ VARIATION_NAME),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/page.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./blocks/product-collection/variations/elements/utils.tsx");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../../../atomic/blocks/product-elements/summary/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




const CORE_NAME = 'core/post-excerpt';
const VARIATION_NAME = `${_block_json__WEBPACK_IMPORTED_MODULE_4__.name}/product-summary`;
const registerProductSummary = () => {
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__.registerElementVariation)(CORE_NAME, {
    blockDescription: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../../../atomic/blocks/product-elements/summary/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    blockIcon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Icon, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"]
    }),
    blockTitle: Object(function webpackMissingModule() { var e = new Error("Cannot find module '../../../../atomic/blocks/product-elements/summary/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    variationName: VARIATION_NAME,
    scope: []
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerProductSummary);

/***/ }),

/***/ "./blocks/product-collection/variations/elements/product-title.tsx":
/*!*************************************************************************!*\
  !*** ./blocks/product-collection/variations/elements/product-title.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CORE_NAME: () => (/* binding */ CORE_NAME),
/* harmony export */   VARIATION_NAME: () => (/* binding */ VARIATION_NAME),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/heading.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/atomic-blocks/product-elements/title/block.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./blocks/product-collection/variations/elements/utils.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */



const CORE_NAME = 'core/post-title';
const VARIATION_NAME = `${_block_json__WEBPACK_IMPORTED_MODULE_4__.name}/product-title`;
const registerProductTitle = () => {
  (0,_utils__WEBPACK_IMPORTED_MODULE_3__.registerElementVariation)(CORE_NAME, {
    blockDescription: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/atomic-blocks/product-elements/title/block.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    blockIcon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Icon, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"]
    }),
    blockTitle: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/atomic-blocks/product-elements/title/block.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
    variationName: VARIATION_NAME,
    scope: ['block', 'inserter']
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (registerProductTitle);

/***/ }),

/***/ "./blocks/product-collection/variations/elements/utils.tsx":
/*!*****************************************************************!*\
  !*** ./blocks/product-collection/variations/elements/utils.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerElementVariation: () => (/* binding */ registerElementVariation)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

function registerElementVariation(coreName, {
  blockDescription,
  blockIcon,
  blockTitle,
  variationName,
  scope
}) {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)(coreName, {
    description: blockDescription,
    name: variationName,
    title: blockTitle,
    isActive: blockAttributes => blockAttributes.__woocommerceNamespace === variationName,
    icon: {
      src: blockIcon
    },
    attributes: {
      __woocommerceNamespace: variationName
    },
    scope
  });
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(e, r, t) {
  return (r = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ }),

/***/ "./node_modules/@woocommerce/settings/build-module/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@woocommerce/settings/build-module/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADMIN_URL: () => (/* binding */ ADMIN_URL),
/* harmony export */   COUNTRIES: () => (/* binding */ COUNTRIES),
/* harmony export */   CURRENCY: () => (/* binding */ CURRENCY),
/* harmony export */   DEFAULT_DATE_RANGE: () => (/* binding */ DEFAULT_DATE_RANGE),
/* harmony export */   LOCALE: () => (/* binding */ LOCALE),
/* harmony export */   ORDER_STATUSES: () => (/* binding */ ORDER_STATUSES),
/* harmony export */   SITE_TITLE: () => (/* binding */ SITE_TITLE),
/* harmony export */   WC_ASSET_URL: () => (/* binding */ WC_ASSET_URL),
/* harmony export */   getSetting: () => (/* binding */ getSetting)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaults = {
  adminUrl: '',
  countries: [],
  currency: {
    code: 'USD',
    precision: 2,
    symbol: '$',
    symbolPosition: 'left',
    decimalSeparator: '.',
    priceFormat: '%1$s%2$s',
    thousandSeparator: ','
  },
  defaultDateRange: 'period=month&compare=previous_year',
  locale: {
    siteLocale: 'en_US',
    userLocale: 'en_US',
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  orderStatuses: [],
  siteTitle: '',
  wcAssetUrl: ''
};
var globalSharedSettings = (typeof wcSharedSettings === "undefined" ? "undefined" : (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(wcSharedSettings)) === 'object' ? wcSharedSettings : {}; // Use defaults or global settings, depending on what is set.

var allSettings = _objectSpread({}, defaults, {}, globalSharedSettings);

allSettings.currency = _objectSpread({}, defaults.currency, {}, allSettings.currency);
allSettings.locale = _objectSpread({}, defaults.locale, {}, allSettings.locale);
var ADMIN_URL = allSettings.adminUrl;
var COUNTRIES = allSettings.countries;
var CURRENCY = allSettings.currency;
var LOCALE = allSettings.locale;
var ORDER_STATUSES = allSettings.orderStatuses;
var SITE_TITLE = allSettings.siteTitle;
var WC_ASSET_URL = allSettings.wcAssetUrl;
var DEFAULT_DATE_RANGE = allSettings.defaultDateRange;
function getSetting(name) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (allSettings.hasOwnProperty(name)) {
    return allSettings[name];
  }

  return fallback;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * External dependencies
 */

/**
 * Return an SVG icon.
 *
 * @param props The component props.
 *
 * @return Icon component
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
  icon,
  size = 24,
  ...props
}, ref) => {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
    width: size,
    height: size,
    ...props,
    ref
  });
}));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/calendar.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/calendar.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const calendar = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm.5 16c0 .3-.2.5-.5.5H5c-.3 0-.5-.2-.5-.5V7h15v12zM9 10H7v2h2v-2zm0 4H7v2h2v-2zm4-4h-2v2h2v-2zm4 0h-2v2h2v-2zm-4 4h-2v2h2v-2zm4 0h-2v2h2v-2z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calendar);
//# sourceMappingURL=calendar.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/category.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/category.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const category = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M6 5.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM4 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm11-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM13 6a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V6zm5 8.5h-3a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5zM15 13a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3zm-9 1.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5zM4 15a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3z",
    fillRule: "evenodd",
    clipRule: "evenodd"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (category);
//# sourceMappingURL=category.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/chart-bar.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chart-bar.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const chartBar = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    d: "M11.25 5h1.5v15h-1.5V5zM6 10h1.5v10H6V10zm12 4h-1.5v6H18v-6z",
    clipRule: "evenodd"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chartBar);
//# sourceMappingURL=chart-bar.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/heading.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/heading.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const heading = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M6 5V18.5911L12 13.8473L18 18.5911V5H6Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (heading);
//# sourceMappingURL=heading.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/info.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/info.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const info = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (info);
//# sourceMappingURL=info.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/loop.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/loop.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const loop = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M18.1823 11.6392C18.1823 13.0804 17.0139 14.2487 15.5727 14.2487C14.3579 14.2487 13.335 13.4179 13.0453 12.2922L13.0377 12.2625L13.0278 12.2335L12.3985 10.377L12.3942 10.3785C11.8571 8.64997 10.246 7.39405 8.33961 7.39405C5.99509 7.39405 4.09448 9.29465 4.09448 11.6392C4.09448 13.9837 5.99509 15.8843 8.33961 15.8843C8.88499 15.8843 9.40822 15.781 9.88943 15.5923L9.29212 14.0697C8.99812 14.185 8.67729 14.2487 8.33961 14.2487C6.89838 14.2487 5.73003 13.0804 5.73003 11.6392C5.73003 10.1979 6.89838 9.02959 8.33961 9.02959C9.55444 9.02959 10.5773 9.86046 10.867 10.9862L10.8772 10.9836L11.4695 12.7311C11.9515 14.546 13.6048 15.8843 15.5727 15.8843C17.9172 15.8843 19.8178 13.9837 19.8178 11.6392C19.8178 9.29465 17.9172 7.39404 15.5727 7.39404C15.0287 7.39404 14.5066 7.4968 14.0264 7.6847L14.6223 9.20781C14.9158 9.093 15.2358 9.02959 15.5727 9.02959C17.0139 9.02959 18.1823 10.1979 18.1823 11.6392Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loop);
//# sourceMappingURL=loop.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/page.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/page.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const page = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M15.5 7.5h-7V9h7V7.5Zm-7 3.5h7v1.5h-7V11Zm7 3.5h-7V16h7v-1.5Z"
  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M17 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM7 5.5h10a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5Z"
  })]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (page);
//# sourceMappingURL=page.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/percent.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/percent.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const percent = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    d: "M6.5 8a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM8 5a3 3 0 100 6 3 3 0 000-6zm6.5 11a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm1.5-3a3 3 0 100 6 3 3 0 000-6zM5.47 17.41a.75.75 0 001.06 1.06L18.47 6.53a.75.75 0 10-1.06-1.06L5.47 17.41z",
    clipRule: "evenodd"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (percent);
//# sourceMappingURL=percent.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/reusable-block.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/reusable-block.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const reusableBlock = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M7 7.2h8.2L13.5 9l1.1 1.1 3.6-3.6-3.5-4-1.1 1 1.9 2.3H7c-.9 0-1.7.3-2.3.9-1.4 1.5-1.4 4.2-1.4 5.6v.2h1.5v-.3c0-1.1 0-3.5 1-4.5.3-.3.7-.5 1.2-.5zm13.8 4V11h-1.5v.3c0 1.1 0 3.5-1 4.5-.3.3-.7.5-1.3.5H8.8l1.7-1.7-1.1-1.1L5.9 17l3.5 4 1.1-1-1.9-2.3H17c.9 0 1.7-.3 2.3-.9 1.5-1.4 1.5-4.2 1.5-5.6z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reusableBlock);
//# sourceMappingURL=reusable-block.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-empty.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-empty.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const starEmpty = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    d: "M9.706 8.646a.25.25 0 01-.188.137l-4.626.672a.25.25 0 00-.139.427l3.348 3.262a.25.25 0 01.072.222l-.79 4.607a.25.25 0 00.362.264l4.138-2.176a.25.25 0 01.233 0l4.137 2.175a.25.25 0 00.363-.263l-.79-4.607a.25.25 0 01.072-.222l3.347-3.262a.25.25 0 00-.139-.427l-4.626-.672a.25.25 0 01-.188-.137l-2.069-4.192a.25.25 0 00-.448 0L9.706 8.646zM12 7.39l-.948 1.921a1.75 1.75 0 01-1.317.957l-2.12.308 1.534 1.495c.412.402.6.982.503 1.55l-.362 2.11 1.896-.997a1.75 1.75 0 011.629 0l1.895.997-.362-2.11a1.75 1.75 0 01.504-1.55l1.533-1.495-2.12-.308a1.75 1.75 0 01-1.317-.957L12 7.39z",
    clipRule: "evenodd"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (starEmpty);
//# sourceMappingURL=star-empty.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-filled.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-filled.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const starFilled = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11.776 4.454a.25.25 0 01.448 0l2.069 4.192a.25.25 0 00.188.137l4.626.672a.25.25 0 01.139.426l-3.348 3.263a.25.25 0 00-.072.222l.79 4.607a.25.25 0 01-.362.263l-4.138-2.175a.25.25 0 00-.232 0l-4.138 2.175a.25.25 0 01-.363-.263l.79-4.607a.25.25 0 00-.071-.222L4.754 9.881a.25.25 0 01.139-.426l4.626-.672a.25.25 0 00.188-.137l2.069-4.192z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (starFilled);
//# sourceMappingURL=star-filled.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const tag = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M4.75 4a.75.75 0 0 0-.75.75v7.826c0 .2.08.39.22.53l6.72 6.716a2.313 2.313 0 0 0 3.276-.001l5.61-5.611-.531-.53.532.528a2.315 2.315 0 0 0 0-3.264L13.104 4.22a.75.75 0 0 0-.53-.22H4.75ZM19 12.576a.815.815 0 0 1-.236.574l-5.61 5.611a.814.814 0 0 1-1.153 0L5.5 12.264V5.5h6.763l6.5 6.502a.816.816 0 0 1 .237.574ZM8.75 9.75a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tag);
//# sourceMappingURL=tag.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/trending-up.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trending-up.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const trendingUp = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M3.445 16.505a.75.75 0 001.06.05l5.005-4.55 4.024 3.521 4.716-4.715V14h1.5V8.25H14v1.5h3.19l-3.724 3.723L9.49 9.995l-5.995 5.45a.75.75 0 00-.05 1.06z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trendingUp);
//# sourceMappingURL=trending-up.js.map

/***/ }),

/***/ "./node_modules/fast-deep-equal/es6/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-deep-equal/es6/index.js ***!
  \***************************************************/
/***/ ((module) => {



// do not edit .js files directly - edit src/index.jst


  var envHasBigInt64Array = typeof BigInt64Array !== 'undefined';


module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }


    if ((a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }


    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


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

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/html-entities":
/*!**************************************!*\
  !*** external ["wp","htmlEntities"] ***!
  \**************************************/
/***/ ((module) => {

module.exports = window["wp"]["htmlEntities"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

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
/*!*********************************************!*\
  !*** ./blocks/product-collection/index.tsx ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/product-collection/edit/index.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/product-collection/save.tsx");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icon */ "./blocks/product-collection/icon.tsx");
/* harmony import */ var _variations_elements_product_summary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./variations/elements/product-summary */ "./blocks/product-collection/variations/elements/product-summary.tsx");
/* harmony import */ var _variations_elements_product_title__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./variations/elements/product-title */ "./blocks/product-collection/variations/elements/product-title.tsx");
/* harmony import */ var _collections__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./collections */ "./blocks/product-collection/collections/index.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./blocks/product-collection/utils.tsx");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */








(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__, {
  icon: _icon__WEBPACK_IMPORTED_MODULE_4__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
(0,_variations_elements_product_summary__WEBPACK_IMPORTED_MODULE_5__["default"])();
(0,_variations_elements_product_title__WEBPACK_IMPORTED_MODULE_6__["default"])();
(0,_collections__WEBPACK_IMPORTED_MODULE_7__["default"])();
(0,_utils__WEBPACK_IMPORTED_MODULE_8__.addProductCollectionToQueryPaginationParentOrAncestor)();
})();

/******/ })()
;
//# sourceMappingURL=index.js.map