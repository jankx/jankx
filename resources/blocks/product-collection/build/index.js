/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/fast-deep-equal/es6/index.js":
/*!****************************************************!*\
  !*** ../node_modules/fast-deep-equal/es6/index.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";


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
      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      for (i of a.entries()) if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;) if (a[i] !== b[i]) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;
    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }
    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/atomic/blocks/product-elements/image/types.ts":
/*!*******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/atomic/blocks/product-elements/image/types.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageSizing: () => (/* binding */ ImageSizing)
/* harmony export */ });
/**
 * External dependencies
 */

let ImageSizing = /*#__PURE__*/function (ImageSizing) {
  ImageSizing["SINGLE"] = "single";
  ImageSizing["THUMBNAIL"] = "thumbnail";
  return ImageSizing;
}({});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/block-error.tsx":
/*!**************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/block-error.tsx ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */

const BlockError = ({
  imageUrl = `${_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.WC_BLOCKS_IMAGE_URL}/block-error.svg`,
  header = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Oops!', 'woocommerce'),
  text = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('There was an error loading the content.', 'woocommerce'),
  errorMessage,
  errorMessagePrefix = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Error:', 'woocommerce'),
  button,
  showErrorBlock = true
}) => {
  return showErrorBlock ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "wc-block-error wc-block-components-error",
    children: [imageUrl &&
    /*#__PURE__*/
    // The alt text is left empty on purpose, as it's considered a decorative image.
    // More can be found here: https://www.w3.org/WAI/tutorials/images/decorative/.
    // Github discussion for a context: https://github.com/woocommerce/woocommerce-blocks/pull/7651#discussion_r1019560494.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
      className: "wc-block-error__image wc-block-components-error__image",
      src: imageUrl,
      alt: ""
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "wc-block-error__content wc-block-components-error__content",
      children: [header && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "wc-block-error__header wc-block-components-error__header",
        children: header
      }), text && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "wc-block-error__text wc-block-components-error__text",
        children: text
      }), errorMessage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
        className: "wc-block-error__message wc-block-components-error__message",
        children: [errorMessagePrefix ? errorMessagePrefix + ' ' : '', errorMessage]
      }), button && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "wc-block-error__button wc-block-components-error__button",
        children: button
      })]
    })]
  }) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlockError);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/index.tsx":
/*!********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/index.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block-error */ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/block-error.tsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */



class BlockErrorBoundary extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  state = {
    errorMessage: '',
    hasError: false
  };
  static getDerivedStateFromError(error) {
    if (typeof error.statusText !== 'undefined' && typeof error.status !== 'undefined') {
      return {
        errorMessage: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
            children: error.status
          }), ":\xA0", error.statusText]
        }),
        hasError: true
      };
    }
    return {
      errorMessage: error.message,
      hasError: true
    };
  }
  render() {
    const {
      header,
      imageUrl,
      showErrorMessage = true,
      showErrorBlock = true,
      text,
      errorMessagePrefix,
      renderError,
      button
    } = this.props;
    const {
      errorMessage,
      hasError
    } = this.state;
    if (hasError) {
      if (typeof renderError === 'function') {
        return renderError({
          errorMessage
        });
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_block_error__WEBPACK_IMPORTED_MODULE_1__["default"], {
        showErrorBlock: showErrorBlock,
        errorMessage: showErrorMessage ? errorMessage : null,
        header: header,
        imageUrl: imageUrl,
        text: text,
        errorMessagePrefix: errorMessagePrefix,
        button: button
      });
    }
    return this.props.children;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlockErrorBoundary);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/style.scss":
/*!*********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/style.scss ***!
  \*********************************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m     padding: \u001b[31m$gap-largest\u001b[0m 0;\n\u001b[34m  │\u001b[0m \u001b[31m             ^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\base\\components\\block-error-boundary\\style.scss 3:11  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m     padding: \u001b[31m$gap-largest\u001b[0m 0;\n\u001b[34m  │\u001b[0m \u001b[31m             ^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\base\\components\\block-error-boundary\\style.scss 3:11  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\base\\components\\block-error-boundary\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\base\\components\\block-error-boundary\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined variable.\\n\\u001b[34m  ╷\\u001b[0m\\n\\u001b[34m3 │\\u001b[0m     padding: \\u001b[31m$gap-largest\\u001b[0m 0;\\n\\u001b[34m  │\\u001b[0m \\u001b[31m             ^^^^^^^^^^^^\\u001b[0m\\n\\u001b[34m  ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\base\\\\components\\\\block-error-boundary\\\\style.scss 3:11  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/components/cart-checkout/form/prepare-form-fields.ts":
/*!*******************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/components/cart-checkout/form/prepare-form-fields.ts ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */




/**
 * Gets props from the core locale, then maps them to the shape we require in the client.
 *
 * Ignores "class", "type", "placeholder", and "autocomplete" props from core.
 *
 * @param {Object} localeField Locale fields from WooCommerce.
 * @return {Object} Supported locale fields.
 */
const getSupportedCoreLocaleProps = localeField => {
  const fields = {};
  if (localeField.label !== undefined) {
    fields.label = localeField.label;
  }
  if (localeField.required !== undefined) {
    fields.required = localeField.required;
  }
  if (localeField.hidden !== undefined) {
    fields.hidden = localeField.hidden;
  }
  if (localeField.label !== undefined && !localeField.optionalLabel) {
    fields.optionalLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)(/* translators: %s Field label. */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('%s (optional)', 'woocommerce'), localeField.label);
  }
  if (localeField.index) {
    if ((0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isNumber)(localeField.index)) {
      fields.index = localeField.index;
    }
    if ((0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isString)(localeField.index)) {
      fields.index = parseInt(localeField.index, 10);
    }
  }
  if (localeField.hidden) {
    fields.required = false;
  }
  return fields;
};

/**
 * COUNTRY_LOCALE is locale data from WooCommerce countries class. This doesn't match the shape of the new field data blocks uses,
 * but we can import part of it to set which fields are required.
 *
 * This supports new properties such as optionalLabel which are not used by core (yet).
 */
const countryAddressFields = Object.entries(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_0__.COUNTRY_LOCALE).reduce((acc, [country, countryLocale]) => {
  acc[country] = Object.entries(countryLocale).reduce((fields, [localeFieldKey, localeField]) => {
    fields[localeFieldKey] = getSupportedCoreLocaleProps(localeField);
    return fields;
  }, {});
  return acc;
}, {});

/**
 * Combines address fields, including fields from the locale, and sorts them by index.
 */
const prepareFormFields = (fieldKeys, defaultFields,
// Address country code. If unknown, locale fields will not be merged.
addressCountry = '') => {
  const localeConfigs = addressCountry && countryAddressFields[addressCountry] !== undefined ? countryAddressFields[addressCountry] : {};
  return fieldKeys.map(field => {
    const defaultConfig = defaultFields && field in defaultFields ? defaultFields[field] : {};
    const localeConfig = localeConfigs && field in localeConfigs ? localeConfigs[field] : {};
    return {
      key: field,
      ...defaultConfig,
      ...localeConfig
    };
  }).sort((a, b) => a.index - b.index);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prepareFormFields);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/context/event-emit/utils.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/context/event-emit/utils.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getObserversByPriority: () => (/* binding */ getObserversByPriority),
/* harmony export */   noticeContexts: () => (/* binding */ noticeContexts),
/* harmony export */   shouldRetry: () => (/* binding */ shouldRetry)
/* harmony export */ });
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */

const getObserversByPriority = (observers, eventType) => {
  return observers[eventType] ? Array.from(observers[eventType].values()).sort((a, b) => {
    return a.priority - b.priority;
  }) : [];
};
let noticeContexts = /*#__PURE__*/function (noticeContexts) {
  noticeContexts["CART"] = "wc/cart";
  noticeContexts["CHECKOUT"] = "wc/checkout";
  noticeContexts["PAYMENTS"] = "wc/checkout/payments";
  noticeContexts["EXPRESS_PAYMENTS"] = "wc/checkout/express-payments";
  noticeContexts["CONTACT_INFORMATION"] = "wc/checkout/contact-information";
  noticeContexts["SHIPPING_ADDRESS"] = "wc/checkout/shipping-address";
  noticeContexts["BILLING_ADDRESS"] = "wc/checkout/billing-address";
  noticeContexts["SHIPPING_METHODS"] = "wc/checkout/shipping-methods";
  noticeContexts["CHECKOUT_ACTIONS"] = "wc/checkout/checkout-actions";
  noticeContexts["ORDER_INFORMATION"] = "wc/checkout/order-information";
  return noticeContexts;
}({});
const shouldRetry = response => {
  return !(0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_0__.isObject)(response) || typeof response.retry === 'undefined' || response.retry === true;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/index.js":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useContainerQueries: () => (/* reexport safe */ _use_container_queries__WEBPACK_IMPORTED_MODULE_0__.useContainerQueries),
/* harmony export */   useIsMounted: () => (/* reexport safe */ _use_is_mounted__WEBPACK_IMPORTED_MODULE_7__.useIsMounted),
/* harmony export */   useLocalStorageState: () => (/* reexport safe */ _use_local_storage_state__WEBPACK_IMPORTED_MODULE_1__.useLocalStorageState),
/* harmony export */   useObservedViewport: () => (/* reexport safe */ _use_observed_viewport__WEBPACK_IMPORTED_MODULE_10__.useObservedViewport),
/* harmony export */   usePositionRelativeToViewport: () => (/* reexport safe */ _use_position_relative_to_viewport__WEBPACK_IMPORTED_MODULE_2__.usePositionRelativeToViewport),
/* harmony export */   usePrevious: () => (/* reexport safe */ _use_previous__WEBPACK_IMPORTED_MODULE_3__.usePrevious),
/* harmony export */   useQueryLoopProductContextValidation: () => (/* reexport safe */ _use_query_loop_product_context_validation__WEBPACK_IMPORTED_MODULE_12__.useQueryLoopProductContextValidation),
/* harmony export */   useSchemaParser: () => (/* reexport safe */ _use_schema_parser__WEBPACK_IMPORTED_MODULE_11__.useSchemaParser),
/* harmony export */   useShallowEqual: () => (/* reexport safe */ _use_shallow_equal__WEBPACK_IMPORTED_MODULE_4__.useShallowEqual),
/* harmony export */   useSpokenMessage: () => (/* reexport safe */ _use_spoken_message__WEBPACK_IMPORTED_MODULE_8__.useSpokenMessage),
/* harmony export */   useStyleProps: () => (/* reexport safe */ _use_style_props__WEBPACK_IMPORTED_MODULE_9__.useStyleProps),
/* harmony export */   useThrowError: () => (/* reexport safe */ _use_throw_error__WEBPACK_IMPORTED_MODULE_5__.useThrowError),
/* harmony export */   useTypographyProps: () => (/* reexport safe */ _use_typography_props__WEBPACK_IMPORTED_MODULE_6__.useTypographyProps)
/* harmony export */ });
/* harmony import */ var _use_container_queries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-container-queries */ "../node_modules/woocommerce-blocks/js/base/hooks/use-container-queries.ts");
/* harmony import */ var _use_local_storage_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-local-storage-state */ "../node_modules/woocommerce-blocks/js/base/hooks/use-local-storage-state.ts");
/* harmony import */ var _use_position_relative_to_viewport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-position-relative-to-viewport */ "../node_modules/woocommerce-blocks/js/base/hooks/use-position-relative-to-viewport.js");
/* harmony import */ var _use_previous__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-previous */ "../node_modules/woocommerce-blocks/js/base/hooks/use-previous.ts");
/* harmony import */ var _use_shallow_equal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./use-shallow-equal */ "../node_modules/woocommerce-blocks/js/base/hooks/use-shallow-equal.ts");
/* harmony import */ var _use_throw_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./use-throw-error */ "../node_modules/woocommerce-blocks/js/base/hooks/use-throw-error.ts");
/* harmony import */ var _use_typography_props__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./use-typography-props */ "../node_modules/woocommerce-blocks/js/base/hooks/use-typography-props.ts");
/* harmony import */ var _use_is_mounted__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./use-is-mounted */ "../node_modules/woocommerce-blocks/js/base/hooks/use-is-mounted.ts");
/* harmony import */ var _use_spoken_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./use-spoken-message */ "../node_modules/woocommerce-blocks/js/base/hooks/use-spoken-message.ts");
/* harmony import */ var _use_style_props__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./use-style-props */ "../node_modules/woocommerce-blocks/js/base/hooks/use-style-props.ts");
/* harmony import */ var _use_observed_viewport__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./use-observed-viewport */ "../node_modules/woocommerce-blocks/js/base/hooks/use-observed-viewport.ts");
/* harmony import */ var _use_schema_parser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./use-schema-parser */ "../node_modules/woocommerce-blocks/js/base/hooks/use-schema-parser.ts");
/* harmony import */ var _use_query_loop_product_context_validation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./use-query-loop-product-context-validation */ "../node_modules/woocommerce-blocks/js/base/hooks/use-query-loop-product-context-validation.tsx");














/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-container-queries.ts":
/*!*********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-container-queries.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useContainerQueries: () => (/* binding */ useContainerQueries)
/* harmony export */ });
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Returns a resizeListener element and a class name based on its width.
 * Class names are based on the smaller of the breakpoints:
 * https://github.com/WordPress/gutenberg/tree/master/packages/viewport#usage
 * Values are also based on those breakpoints minus ~80px which is approximately
 * the left + right margin in Storefront with a font-size of 16px.
 * _Note: `useContainerQueries` will return an empty class name `` until after
 * first render_
 *
 * @return {Array} An array of {Element} `resizeListener` and {string} `className`.
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const [ resizeListener, containerClassName ] = useContainerQueries();
 *
 * 	return (
 * 		<div className={ containerClassName }>
 * 			{ resizeListener }
 * 			Your content here
 * 		</div>
 * 	);
 * };
 * ```
 */
const useContainerQueries = () => {
  const [resizeListener, {
    width
  }] = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.useResizeObserver)();
  let className = '';
  if (width > 700) {
    className = 'is-large';
  } else if (width > 520) {
    className = 'is-medium';
  } else if (width > 400) {
    className = 'is-small';
  } else if (width) {
    className = 'is-mobile';
  }
  return [resizeListener, className];
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-is-mounted.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-is-mounted.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsMounted: () => (/* binding */ useIsMounted)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Returns a boolean value based on whether the current component has been mounted.
 *
 * @return {boolean} If the component has been mounted.
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const isMounted = useIsMounted();
 *
 * 	if ( ! isMounted() ) {
 * 	    return null;
 * 	}
 *
 * 	return </div>;
 * };
 * ```
 */

function useIsMounted() {
  const isMounted = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => isMounted.current, []);
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-local-storage-state.ts":
/*!***********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-local-storage-state.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLocalStorageState: () => (/* binding */ useLocalStorageState)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

const useLocalStorageState = (key, initialValue) => {
  const [state, setState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      try {
        return JSON.parse(valueInLocalStorage);
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Value for key '${key}' could not be retrieved from localStorage because it can't be parsed.`);
      }
    }
    return initialValue;
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // eslint-disable-next-line no-console
      console.error(`Value for key '${key}' could not be saved in localStorage because it can't be converted into a string.`);
    }
  }, [key, state]);
  return [state, setState];
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-observed-viewport.ts":
/*!*********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-observed-viewport.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useObservedViewport: () => (/* binding */ useObservedViewport)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Returns a ref, its dimensions, and its visible viewport dimensions. Useful to know if an element should be sticky or not. This hook only runs when an element changes its intersection or dimensions.
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const [ observedRef, observedElement, viewWindow ] = useObservedViewport();
 *
 * 	return (
 * 		<MyElement ref={ observedRef } className={ observedElement.height < viewWindow.height ? 'is-sticky': '' } />
 * 	);
 * };
 * ```
 */
function useObservedViewport() {
  const [observedElement, setObservedElement] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    height: 0,
    width: 0
  });
  const [viewWindow, setViewWindow] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    height: 0,
    width: 0
  });
  const observedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!observedRef.current) {
      return;
    }
    const element = observedRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === element) {
          let elementTop = '0';
          if (element.computedStyleMap) {
            elementTop = element.computedStyleMap().get('top')?.toString() || elementTop;
          } else {
            // Firefox support
            elementTop = getComputedStyle(element).top || elementTop;
          }
          const {
            height,
            width
          } = entry.contentRect;
          setObservedElement({
            height: height + parseInt(elementTop, 10),
            width
          });
        }
      });
    });
    const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const {
          height,
          width
        } = entry.boundingClientRect;
        setObservedElement({
          height,
          width
        });
        if (entry.target.ownerDocument.defaultView) {
          setViewWindow({
            height: entry.target.ownerDocument.defaultView?.innerHeight,
            width: entry.target.ownerDocument.defaultView?.innerWidth
          });
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 1
    });
    resizeObserver.observe(element);
    intersectionObserver.observe(element);
    return () => {
      if (!element) {
        return;
      }
      resizeObserver.unobserve(element);
      intersectionObserver.unobserve(element);
    };
  }, []);
  return [observedRef, observedElement, viewWindow];
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-position-relative-to-viewport.js":
/*!*********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-position-relative-to-viewport.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePositionRelativeToViewport: () => (/* binding */ usePositionRelativeToViewport)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */


/** @typedef {import('react')} React */

/** @type {React.CSSProperties} */

const style = {
  bottom: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: -1
};

/**
 * Returns an element and a string (`above`, `visible` or `below`) based on the
 * element position relative to the viewport.
 * _Note: `usePositionRelativeToViewport` will return an empty position (``)
 * until after first render_
 *
 * @return {Array} An array of {Element} `referenceElement` and {string} `positionRelativeToViewport`.
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const [ referenceElement, positionRelativeToViewport ] = useContainerQueries();
 *
 * 	return (
 * 		<>
 * 			{ referenceElement }
 * 			{ positionRelativeToViewport === 'below' && <p>Reference element is below the viewport.</p> }
 * 			{ positionRelativeToViewport === 'visible' && <p>Reference element is visible in the viewport.</p> }
 * 			{ positionRelativeToViewport === 'above' && <p>Reference element is above the viewport.</p> }
 * 		</>
 * 	);
 * };
 * ```
 */
const usePositionRelativeToViewport = () => {
  const [positionRelativeToViewport, setPositionRelativeToViewport] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const referenceElementRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const intersectionObserver = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setPositionRelativeToViewport('visible');
    } else {
      setPositionRelativeToViewport(entries[0].boundingClientRect.top > 0 ? 'below' : 'above');
    }
  }, {
    threshold: [0, 0.5, 1]
  }));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const referenceElementNode = referenceElementRef.current;
    const observer = intersectionObserver.current;
    if (referenceElementNode) {
      observer.observe(referenceElementNode);
    }
    return () => {
      observer.unobserve(referenceElementNode);
    };
  }, []);
  const referenceElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    "aria-hidden": true,
    ref: referenceElementRef,
    style: style
  });
  return [referenceElement, positionRelativeToViewport];
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-previous.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-previous.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePrevious: () => (/* binding */ usePrevious)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

/**
 * Use Previous based on https://usehooks.com/useprevious/.
 *
 * @param {*}        value
 * @param {Function} [validation] Function that needs to validate for the value
 *                                to be updated.
 */
function usePrevious(value, validation) {
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (ref.current !== value && (!validation || validation(value, ref.current))) {
      ref.current = value;
    }
  }, [value, validation]);
  return ref.current;
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-query-loop-product-context-validation.tsx":
/*!******************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-query-loop-product-context-validation.tsx ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useQueryLoopProductContextValidation: () => (/* binding */ useQueryLoopProductContextValidation)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */




/**
 * Hook that validates if a block is inside a Query Loop context with proper product post type.
 * Returns validation state and warning element if context is invalid.
 *
 * @param {Object} params           - The parameters object.
 * @param {string} params.clientId  - The client ID of the block.
 * @param {string} params.postType  - The current post type.
 * @param {string} params.blockName - The name of the block to display in warning.
 * @return {QueryLoopProductContextValidation} Object containing validation state and warning element.
 */
const useQueryLoopProductContextValidation = ({
  clientId,
  postType,
  blockName
}) => {
  const hasInvalidContext = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const queryLoopAncestors = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlockParentsByBlockName(clientId, 'core/post-template');
    return queryLoopAncestors.length > 0 && postType !== 'product';
  }, [clientId, postType]);
  const warningElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.Warning, {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: block name */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The %s block requires a product context. When used in a Query Loop, the Query Loop must be configured to display products.', 'woocommerce'), blockName)
    })
  });
  return {
    hasInvalidContext,
    warningElement
  };
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-schema-parser.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-schema-parser.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSchemaParser: () => (/* binding */ useSchemaParser)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/base-utils */ "../node_modules/woocommerce-blocks/js/base/utils/index.js");
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fast-deep-equal/es6 */ "../node_modules/fast-deep-equal/es6/index.js");
/* harmony import */ var fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-data'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */






const useDocumentObject = formType => {
  const currentResults = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    cart: {},
    checkout: {},
    customer: {}
  });
  const {
    cartData,
    prefersCollection,
    shouldCreateAccount,
    orderNotes,
    additionalFields,
    activePaymentMethod,
    customerId
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const cartDataStore = select(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-data'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    const checkoutDataStore = select(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-data'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    const paymentDataStore = select(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-data'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    return {
      cartData: cartDataStore.getCartData(),
      prefersCollection: checkoutDataStore.prefersCollection(),
      shouldCreateAccount: checkoutDataStore.getShouldCreateAccount(),
      orderNotes: checkoutDataStore.getOrderNotes(),
      additionalFields: checkoutDataStore.getAdditionalFields(),
      activePaymentMethod: paymentDataStore.getActivePaymentMethod(),
      customerId: checkoutDataStore.getCustomerId()
    };
  }, []);
  const data = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const {
      coupons,
      shippingRates,
      shippingAddress,
      billingAddress,
      items,
      itemsCount,
      itemsWeight,
      needsShipping,
      totals,
      extensions
    } = cartData;
    const documentObject = {
      cart: {
        coupons: coupons.map(coupon => coupon.code),
        shippingRates: [...new Set(shippingRates.map(shippingPackage => shippingPackage.shipping_rates.find(rate => rate.selected)?.rate_id).filter(Boolean))],
        items: items.map(item => Array(Math.ceil(item.quantity)).fill(item.id) // Rounds up to nearest integer.
        ).flat(),
        itemsType: [...new Set(items.map(item => item.type))],
        itemsCount,
        itemsWeight,
        needsShipping,
        prefersCollection: typeof prefersCollection === 'boolean' ? prefersCollection : false,
        totals: {
          total_price: Number(totals.total_price),
          total_tax: Number(totals.total_tax)
        },
        extensions
      },
      checkout: {
        createAccount: shouldCreateAccount,
        customerNote: orderNotes,
        additionalFields: Object.entries(additionalFields).reduce((acc, [key, value]) => {
          if (_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_3__.ORDER_FORM_KEYS.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {}),
        paymentMethod: activePaymentMethod
      },
      customer: {
        id: customerId,
        billingAddress,
        shippingAddress,
        additionalFields: Object.entries(additionalFields).reduce((acc, [key, value]) => {
          if (_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_3__.CONTACT_FORM_KEYS.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {}),
        ...(formType === 'billing' || formType === 'shipping' ? {
          address: formType === 'billing' ? billingAddress : shippingAddress
        } : {})
      }
    };
    return {
      cart: (0,_woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__.snakeCaseKeys)(documentObject.cart),
      checkout: (0,_woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__.snakeCaseKeys)(documentObject.checkout),
      customer: (0,_woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__.snakeCaseKeys)(documentObject.customer)
    };
  }, [cartData, prefersCollection, shouldCreateAccount, orderNotes, additionalFields, activePaymentMethod, customerId, formType]);
  if (!currentResults.current || !fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_4___default()(currentResults.current, data)) {
    currentResults.current = data;
  }
  return currentResults.current;
};
const useSchemaParser = formType => {
  const data = useDocumentObject(formType);
  if (window.schemaParser) {
    return {
      parser: window.schemaParser,
      data
    };
  }
  return {
    parser: null,
    data
  };
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-shallow-equal.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-shallow-equal.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useShallowEqual: () => (/* binding */ useShallowEqual)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/is-shallow-equal */ "@wordpress/is-shallow-equal");
/* harmony import */ var _wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */



/**
 * A custom hook that compares the provided value across renders and returns the
 * previous instance if shallow equality with previous instance exists.
 *
 * This is particularly useful when non-primitive types are used as
 * dependencies for react hooks.
 *
 * @param {*} value Value to keep the same if satisfies shallow equality.
 *
 * @return {*} The previous cached instance of the value if the current has  shallow equality with it.
 */
function useShallowEqual(value) {
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(value);
  if (!_wordpress_is_shallow_equal__WEBPACK_IMPORTED_MODULE_1___default()(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-spoken-message.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-spoken-message.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useSpokenMessage: () => (/* binding */ useSpokenMessage)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_a11y__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/a11y */ "@wordpress/a11y");
/* harmony import */ var _wordpress_a11y__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_a11y__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */



/**
 * Custom hook which announces the message with the given politeness, if a
 * valid message is provided.
 */
const useSpokenMessage = (message, politeness) => {
  const spokenMessage = typeof message === 'string' ? message : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.renderToString)(message);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (spokenMessage) {
      (0,_wordpress_a11y__WEBPACK_IMPORTED_MODULE_1__.speak)(spokenMessage, politeness);
    }
  }, [spokenMessage, politeness]);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useSpokenMessage);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-style-props.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-style-props.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useStyleProps: () => (/* binding */ useStyleProps)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _use_typography_props__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./use-typography-props */ "../node_modules/woocommerce-blocks/js/base/hooks/use-typography-props.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../node_modules/woocommerce-blocks/js/base/utils/index.js");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Parses incoming props.
 *
 * This may include style properties at the top level, or may include a nested `style` object. This ensures the expected
 * values are present and converts any string based values to objects as required.
 */
const parseStyleAttributes = rawProps => {
  const props = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isObject)(rawProps) ? rawProps : {
    style: {}
  };
  let style = props.style;
  if ((0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isString)(style)) {
    style = JSON.parse(style) || {};
  }
  if (!(0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isObject)(style)) {
    style = {};
  }
  return {
    ...props,
    style
  };
};

/**
 * Returns the CSS class names and inline styles for a block when provided with its props/attributes.
 *
 * This hook (and its utilities) borrow functionality from the Gutenberg Block Editor package--something we don't want
 * to import on the frontend.
 */
const useStyleProps = props => {
  const styleAttributes = parseStyleAttributes(props);
  const colorProps = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getColorClassesAndStyles)(styleAttributes);
  const borderProps = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getBorderClassesAndStyles)(styleAttributes);
  const spacingProps = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getSpacingClassesAndStyles)(styleAttributes);
  const typographyProps = (0,_use_typography_props__WEBPACK_IMPORTED_MODULE_2__.useTypographyProps)(styleAttributes);
  return {
    className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(typographyProps.className, colorProps.className, borderProps.className, spacingProps.className),
    style: {
      ...typographyProps.style,
      ...colorProps.style,
      ...borderProps.style,
      ...spacingProps.style
    }
  };
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-throw-error.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-throw-error.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useThrowError: () => (/* binding */ useThrowError)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Helper method for throwing an error in a React Hook.
 *
 * @see https://github.com/facebook/react/issues/14981
 */
const useThrowError = () => {
  const [, setState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(error => {
    setState(() => {
      throw error;
    });
  }, []);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/hooks/use-typography-props.ts":
/*!********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/hooks/use-typography-props.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTypographyProps: () => (/* binding */ useTypographyProps)
/* harmony export */ });
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */

const useTypographyProps = props => {
  const typography = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_0__.isObject)(props.style.typography) ? props.style.typography : {};
  const classNameFallback = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_0__.isString)(typography.fontFamily) ? typography.fontFamily : '';
  const className = props.fontFamily ? `has-${props.fontFamily}-font-family` : classNameFallback;
  return {
    className,
    style: {
      fontSize: props.fontSize ? `var(--wp--preset--font-size--${props.fontSize})` : typography.fontSize,
      fontStyle: typography.fontStyle,
      fontWeight: typography.fontWeight,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      textDecoration: typography.textDecoration,
      textTransform: typography.textTransform
    }
  };
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/address.ts":
/*!*******************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/address.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addressFieldsForShippingRates: () => (/* binding */ addressFieldsForShippingRates),
/* harmony export */   emptyAddressFields: () => (/* binding */ emptyAddressFields),
/* harmony export */   emptyHiddenAddressFields: () => (/* binding */ emptyHiddenAddressFields),
/* harmony export */   formatShippingAddress: () => (/* binding */ formatShippingAddress),
/* harmony export */   hasAllFieldsForShippingRates: () => (/* binding */ hasAllFieldsForShippingRates),
/* harmony export */   isSameAddress: () => (/* binding */ isSameAddress)
/* harmony export */ });
/* harmony import */ var _woocommerce_base_components_cart_checkout_form_prepare_form_fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/base-components/cart-checkout/form/prepare-form-fields */ "../node_modules/woocommerce-blocks/js/base/components/cart-checkout/form/prepare-form-fields.ts");
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */





const addressFieldsForShippingRates = ['state', 'country', 'postcode', 'city'];

/**
 * Compare two addresses and see if they are the same.
 */
const isSameAddress = (address1, address2) => {
  return _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.ADDRESS_FORM_KEYS.every(field => {
    return address1[field] === address2[field];
  });
};

/**
 * Type-guard.
 */
const isValidAddressKey = (key, address) => {
  return key in address;
};

/**
 * Sets fields to an empty string in an address if they are hidden by the settings in countryLocale.
 *
 * @param {Object} address The address to empty fields from.
 * @return {Object} The address with hidden fields values removed.
 */
const emptyHiddenAddressFields = address => {
  const addressForm = (0,_woocommerce_base_components_cart_checkout_form_prepare_form_fields__WEBPACK_IMPORTED_MODULE_0__["default"])(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.ADDRESS_FORM_KEYS, Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), address.country);
  const newAddress = Object.assign({}, address);
  addressForm.forEach(({
    key,
    hidden
  }) => {
    if (hidden === true && isValidAddressKey(key, address)) {
      newAddress[key] = '';
    }
  });
  return newAddress;
};

/**
 * Sets fields to an empty string in an address.
 *
 * @param {Object} address The address to empty fields from.
 * @return {Object} The address with all fields values removed.
 */
const emptyAddressFields = address => {
  const addressForm = (0,_woocommerce_base_components_cart_checkout_form_prepare_form_fields__WEBPACK_IMPORTED_MODULE_0__["default"])(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.ADDRESS_FORM_KEYS, Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), address.country);
  const newAddress = Object.assign({}, address);
  addressForm.forEach(({
    key
  }) => {
    // Clear address fields except country and state to keep consistency with shortcode Checkout.
    if (key !== 'country' && key !== 'state' && isValidAddressKey(key, address)) {
      newAddress[key] = '';
    }
  });
  return newAddress;
};
/*
 * Formats a shipping address for display.
 *
 * @param {Object} address The address to format.
 * @return {string | null} The formatted address or null if no address is provided.
 */
const formatShippingAddress = address => {
  // We bail early if we don't have an address.
  if (Object.values(address).length === 0) {
    return null;
  }
  const formattedCountry = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_3__.isString)(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES[address.country]) ? (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES[address.country]) : '';
  const formattedState = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_3__.isObject)(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.STATES[address.country]) && (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_3__.isString)(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.STATES[address.country][address.state]) ? (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.STATES[address.country][address.state]) : address.state;
  const addressParts = [];
  addressParts.push(address.postcode.toUpperCase());
  addressParts.push(address.city);
  addressParts.push(formattedState);
  addressParts.push(formattedCountry);
  const formattedLocation = addressParts.filter(Boolean).join(', ');
  if (!formattedLocation) {
    return null;
  }
  return formattedLocation;
};

/**
 * Checks if all required shipping address fields are completed.
 * Only validates fields that are defined in addressFieldsForShippingRates.
 *
 * @param {CartResponseShippingAddress} address The shipping address to validate.
 * @return {boolean} True if all required shipping fields are filled, false otherwise.
 */
const hasAllFieldsForShippingRates = address => {
  if (!address.country) {
    return false;
  }
  const addressFormWithLocale = (0,_woocommerce_base_components_cart_checkout_form_prepare_form_fields__WEBPACK_IMPORTED_MODULE_0__["default"])(_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.ADDRESS_FORM_KEYS, Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), address.country);
  const filteredAddressForm = addressFormWithLocale.filter(({
    key
  }) => addressFieldsForShippingRates.includes(key));
  return filteredAddressForm.every(({
    key,
    hidden,
    required
  }) => {
    if (hidden === true || required === false) {
      return true;
    }
    return isValidAddressKey(key, address) && address[key] !== '';
  });
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/camel-case-keys.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/camel-case-keys.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   camelCaseKeys: () => (/* binding */ camelCaseKeys)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _map_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map-keys */ "../node_modules/woocommerce-blocks/js/base/utils/map-keys.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */

const camelCaseKeys = obj => (0,_map_keys__WEBPACK_IMPORTED_MODULE_1__.mapKeys)(obj, (_, key) => Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(key));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/create-notice.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/create-notice.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_ERROR_MESSAGE: () => (/* binding */ DEFAULT_ERROR_MESSAGE),
/* harmony export */   createNotice: () => (/* binding */ createNotice),
/* harmony export */   getNoticeContexts: () => (/* binding */ getNoticeContexts),
/* harmony export */   removeAllNotices: () => (/* binding */ removeAllNotices),
/* harmony export */   removeNoticesForField: () => (/* binding */ removeNoticesForField),
/* harmony export */   removeNoticesWithContext: () => (/* binding */ removeNoticesWithContext)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _context_event_emit_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context/event-emit/utils */ "../node_modules/woocommerce-blocks/js/base/context/event-emit/utils.ts");
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */

const DEFAULT_ERROR_MESSAGE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Something went wrong. Please contact us to get assistance.', 'woocommerce');

/**
 * Returns a list of all notice contexts defined by Blocks.
 *
 * Contexts are defined in enum format, but this returns an array of strings instead.
 */
const getNoticeContexts = () => {
  return Object.values(_context_event_emit_utils__WEBPACK_IMPORTED_MODULE_3__.noticeContexts);
};

/**
 * Wrapper for @wordpress/notices createNotice.
 */
const createNotice = (status, message, options) => {
  const noticeContext = options?.context;
  const selectors = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('wc/store/payment');
  const suppressNotices = selectors.isExpressPaymentMethodActive();
  if (suppressNotices || noticeContext === undefined) {
    return;
  }
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store).createNotice(status, message, {
    isDismissible: true,
    ...options,
    context: noticeContext
  });
};

/**
 * Remove notices from all contexts.
 *
 * @todo Remove this when supported in Gutenberg.
 * @see https://github.com/WordPress/gutenberg/pull/44059
 */
const removeAllNotices = () => {
  const selectors = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('wc/store/store-notices');
  const containers = selectors.getRegisteredContainers();
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);
  const {
    getNotices
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);
  containers.forEach(container => {
    getNotices(container).forEach(notice => {
      removeNotice(notice.id, container);
    });
  });
};
const removeNoticesWithContext = context => {
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);
  const {
    getNotices
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);
  getNotices(context).forEach(notice => {
    removeNotice(notice.id, context);
  });
};

/**
 * Remove notices that have an ID starting with the provided string
 *
 * @param {string} id        - The string to match notice IDs against.
 * @param {string} [context] - The context of the notice to remove. If not provided, will check all contexts.
 */
const removeNoticesForField = (id, context) => {
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);
  if (context) {
    removeNotice(id, context);
    return;
  }
  const selectors = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('wc/store/store-notices');
  const containers = selectors.getRegisteredContainers();
  const {
    getNotices
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_1__.store);

  // At this point we are removing the notice from all WC contexts since we don't know which one it is.
  containers.forEach(container => {
    getNotices(container).forEach(notice => {
      if (notice.id.startsWith(id)) {
        removeNotice(notice.id, container);
      }
    });
  });
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/debounce.ts":
/*!********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/debounce.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce)
/* harmony export */ });
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = (func, wait, immediate) => {
  let timeout;
  let latestArgs = null;
  const debounced = (...args) => {
    latestArgs = args;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate && latestArgs) func(...latestArgs);
    }, wait);
    if (immediate && !timeout) func(...args);
  };

  // Clear the debounce queue and execute any pending function immediately.
  debounced.flush = () => {
    if (timeout && latestArgs) {
      func(...latestArgs);
      clearTimeout(timeout);
      timeout = null;
    }
  };

  // Clear the debounce queue without executing any functions.
  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = null;
  };
  return debounced;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/derive-selected-shipping-rates.ts":
/*!******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/derive-selected-shipping-rates.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deriveSelectedShippingRates: () => (/* binding */ deriveSelectedShippingRates)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Get an array of selected shipping rates keyed by Package ID.
 *
 * @param {Array} shippingRates Array of shipping rates.
 * @return {Object} Object containing the package IDs and selected rates in the format: { [packageId:string]: rateId:string }
 */
const deriveSelectedShippingRates = shippingRates => Object.fromEntries(shippingRates.map(({
  package_id: packageId,
  shipping_rates: packageRates
}) => [packageId, packageRates.find(rate => rate.selected)?.rate_id || '']));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/errors.ts":
/*!******************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/errors.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatError: () => (/* binding */ formatError)
/* harmony export */ });
const formatError = async error => {
  if ('json' in error) {
    try {
      const parsedError = await error.json();
      return {
        code: parsedError.code || '',
        message: parsedError.message,
        type: parsedError.type || 'api'
      };
    } catch (e) {
      return {
        // We could only return this if e is instanceof Error but, to avoid changing runtime
        // behaviour, we'll just cast it instead.
        message: e.message,
        type: 'general'
      };
    }
  } else {
    return {
      code: error.code || '',
      message: error.message,
      type: error.type || 'general'
    };
  }
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/get-icons-from-payment-methods.ts":
/*!******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/get-icons-from-payment-methods.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getIconsFromPaymentMethods: () => (/* binding */ getIconsFromPaymentMethods)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Get the provider icons from payment methods data.
 *
 * @param {PaymentMethods} paymentMethods Payment Method data
 * @return {PaymentMethodIconsType} Payment Method icons data.
 */
const getIconsFromPaymentMethods = paymentMethods => {
  return Object.values(paymentMethods).reduce((acc, paymentMethod) => {
    if (paymentMethod.icons !== null) {
      acc = acc.concat(paymentMethod.icons);
    }
    return acc;
  }, []);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/get-inline-styles.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/get-inline-styles.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBorderClassesAndStyles: () => (/* binding */ getBorderClassesAndStyles),
/* harmony export */   getColorClassesAndStyles: () => (/* binding */ getColorClassesAndStyles),
/* harmony export */   getSpacingClassesAndStyles: () => (/* binding */ getSpacingClassesAndStyles)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_style_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/style-engine */ "@wordpress/style-engine");
/* harmony import */ var _wordpress_style_engine__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_style_engine__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * External dependencies
 */




/**
 * Returns the inline styles to add depending on the style object
 *
 * @param {Object} styles Styles configuration.
 * @return {Object} Flattened CSS variables declaration.
 */
function getInlineStyles(styles = {}) {
  const output = {};
  (0,_wordpress_style_engine__WEBPACK_IMPORTED_MODULE_1__.getCSSRules)(styles, {
    selector: ''
  }).forEach(rule => {
    output[rule.key] = rule.value;
  });
  return output;
}

/**
 * Get the classname for a given color.
 */
function getColorClassName(colorContextName, colorSlug) {
  if (!colorContextName || !colorSlug) {
    return '';
  }
  return `has-${Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(colorSlug)}-${colorContextName}`;
}

/**
 * Generates a CSS class name consisting of all the applicable border color
 * classes given the current block attributes.
 */
function getBorderClassName(attributes) {
  const {
    borderColor,
    style
  } = attributes;
  const borderColorClass = borderColor ? getColorClassName('border-color', borderColor) : '';
  return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
    'has-border-color': !!borderColor || !!style?.border?.color,
    [borderColorClass]: !!borderColorClass
  });
}
function getGradientClassName(gradientSlug) {
  if (!gradientSlug) {
    return undefined;
  }
  return `has-${gradientSlug}-gradient-background`;
}

/**
 * Provides the CSS class names and inline styles for a block's color support
 * attributes.
 */
function getColorClassesAndStyles(props) {
  const {
    backgroundColor,
    textColor,
    gradient,
    style
  } = props;

  // Collect color CSS classes.
  const backgroundClass = getColorClassName('background-color', backgroundColor);
  const textClass = getColorClassName('color', textColor);
  const gradientClass = getGradientClassName(gradient);
  const hasGradient = gradientClass || style?.color?.gradient;

  // Determine color CSS class name list.
  const className = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(textClass, gradientClass, {
    // Don't apply the background class if there's a gradient.
    [backgroundClass]: !hasGradient && !!backgroundClass,
    'has-text-color': textColor || style?.color?.text,
    'has-background': backgroundColor || style?.color?.background || gradient || style?.color?.gradient,
    'has-link-color': (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_2__.isObject)(style?.elements?.link) ? style?.elements?.link?.color : undefined
  });

  // Collect inline styles for colors.
  const colorStyles = style?.color || {};
  return {
    className,
    style: getInlineStyles({
      color: colorStyles
    })
  };
}

/**
 * Provides the CSS class names and inline styles for a block's border support
 * attributes.
 */
function getBorderClassesAndStyles(props) {
  const border = props.style?.border || {};
  const className = getBorderClassName(props);
  return {
    className,
    style: getInlineStyles({
      border
    })
  };
}

/**
 * Provides the CSS class names and inline styles for a block's spacing support
 * attributes.
 */
function getSpacingClassesAndStyles(props) {
  const spacingStyles = props.style?.spacing || {};
  const styleProp = getInlineStyles({
    spacing: spacingStyles
  });
  return {
    className: undefined,
    style: styleProp
  };
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/get-navigation-type.ts":
/*!*******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/get-navigation-type.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getNavigationType: () => (/* binding */ getNavigationType)
/* harmony export */ });
/**
 * Returns the navigation type for the page load.
 */
const getNavigationType = () => {
  if (window.performance && window.performance.getEntriesByType('navigation').length) {
    return window.performance.getEntriesByType('navigation')[0].type;
  }
  return '';
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getNavigationType);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/get-valid-block-attributes.js":
/*!**************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/get-valid-block-attributes.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getValidBlockAttributes: () => (/* binding */ getValidBlockAttributes)
/* harmony export */ });
/**
 * Given some block attributes, gets attributes from the dataset or uses defaults.
 *
 * @param {Object} blockAttributes Object containing block attributes.
 * @param {Array}  rawAttributes   Dataset from DOM.
 * @return {Array} Array of parsed attributes.
 */
const getValidBlockAttributes = (blockAttributes, rawAttributes) => {
  const attributes = [];
  Object.keys(blockAttributes).forEach(key => {
    if (typeof rawAttributes[key] !== 'undefined') {
      switch (blockAttributes[key].type) {
        case 'boolean':
          attributes[key] = rawAttributes[key] !== 'false' && rawAttributes[key] !== false;
          break;
        case 'number':
          attributes[key] = parseInt(rawAttributes[key], 10);
          break;
        case 'array':
        case 'object':
          attributes[key] = JSON.parse(rawAttributes[key]);
          break;
        default:
          attributes[key] = rawAttributes[key];
          break;
      }
    } else {
      attributes[key] = blockAttributes[key].default;
    }
  });
  return attributes;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getValidBlockAttributes);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/index.js":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_ERROR_MESSAGE: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.DEFAULT_ERROR_MESSAGE),
/* harmony export */   addressFieldsForShippingRates: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.addressFieldsForShippingRates),
/* harmony export */   allRatesAreCollectable: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.allRatesAreCollectable),
/* harmony export */   camelCaseKeys: () => (/* reexport safe */ _camel_case_keys__WEBPACK_IMPORTED_MODULE_12__.camelCaseKeys),
/* harmony export */   createNotice: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.createNotice),
/* harmony export */   debounce: () => (/* reexport safe */ _debounce__WEBPACK_IMPORTED_MODULE_14__.debounce),
/* harmony export */   deriveSelectedShippingRates: () => (/* reexport safe */ _derive_selected_shipping_rates__WEBPACK_IMPORTED_MODULE_7__.deriveSelectedShippingRates),
/* harmony export */   dispatchEvent: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.dispatchEvent),
/* harmony export */   emptyAddressFields: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.emptyAddressFields),
/* harmony export */   emptyHiddenAddressFields: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.emptyHiddenAddressFields),
/* harmony export */   filterShippingRatesByPrefersCollection: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.filterShippingRatesByPrefersCollection),
/* harmony export */   formatError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_0__.formatError),
/* harmony export */   formatShippingAddress: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.formatShippingAddress),
/* harmony export */   getBorderClassesAndStyles: () => (/* reexport safe */ _get_inline_styles__WEBPACK_IMPORTED_MODULE_17__.getBorderClassesAndStyles),
/* harmony export */   getColorClassesAndStyles: () => (/* reexport safe */ _get_inline_styles__WEBPACK_IMPORTED_MODULE_17__.getColorClassesAndStyles),
/* harmony export */   getIconsFromPaymentMethods: () => (/* reexport safe */ _get_icons_from_payment_methods__WEBPACK_IMPORTED_MODULE_8__.getIconsFromPaymentMethods),
/* harmony export */   getNavigationType: () => (/* reexport safe */ _get_navigation_type__WEBPACK_IMPORTED_MODULE_10__.getNavigationType),
/* harmony export */   getNoticeContexts: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.getNoticeContexts),
/* harmony export */   getSelectedShippingRateNames: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.getSelectedShippingRateNames),
/* harmony export */   getShippingRatesPackageCount: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.getShippingRatesPackageCount),
/* harmony export */   getShippingRatesRateCount: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.getShippingRatesRateCount),
/* harmony export */   getSpacingClassesAndStyles: () => (/* reexport safe */ _get_inline_styles__WEBPACK_IMPORTED_MODULE_17__.getSpacingClassesAndStyles),
/* harmony export */   getTotalShippingValue: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.getTotalShippingValue),
/* harmony export */   getValidBlockAttributes: () => (/* reexport safe */ _get_valid_block_attributes__WEBPACK_IMPORTED_MODULE_5__.getValidBlockAttributes),
/* harmony export */   hasAllFieldsForShippingRates: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.hasAllFieldsForShippingRates),
/* harmony export */   hasCollectableRate: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.hasCollectableRate),
/* harmony export */   hasSelectedShippingRate: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.hasSelectedShippingRate),
/* harmony export */   hasShippingRate: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.hasShippingRate),
/* harmony export */   isPackageRateCollectable: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.isPackageRateCollectable),
/* harmony export */   isSameAddress: () => (/* reexport safe */ _address__WEBPACK_IMPORTED_MODULE_1__.isSameAddress),
/* harmony export */   keyBy: () => (/* reexport safe */ _keyby__WEBPACK_IMPORTED_MODULE_15__.keyBy),
/* harmony export */   mapKeys: () => (/* reexport safe */ _map_keys__WEBPACK_IMPORTED_MODULE_11__.mapKeys),
/* harmony export */   pick: () => (/* reexport safe */ _pick__WEBPACK_IMPORTED_MODULE_16__.pick),
/* harmony export */   productIsPurchasable: () => (/* reexport safe */ _product_data__WEBPACK_IMPORTED_MODULE_6__.productIsPurchasable),
/* harmony export */   productSupportsAddToCartForm: () => (/* reexport safe */ _product_data__WEBPACK_IMPORTED_MODULE_6__.productSupportsAddToCartForm),
/* harmony export */   removeAllNotices: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.removeAllNotices),
/* harmony export */   removeNoticesForField: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.removeNoticesForField),
/* harmony export */   removeNoticesWithContext: () => (/* reexport safe */ _create_notice__WEBPACK_IMPORTED_MODULE_9__.removeNoticesWithContext),
/* harmony export */   renderBlock: () => (/* reexport safe */ _render_frontend__WEBPACK_IMPORTED_MODULE_4__.renderBlock),
/* harmony export */   renderFrontend: () => (/* reexport safe */ _render_frontend__WEBPACK_IMPORTED_MODULE_4__.renderFrontend),
/* harmony export */   selectedRatesAreCollectable: () => (/* reexport safe */ _shipping_rates__WEBPACK_IMPORTED_MODULE_2__.selectedRatesAreCollectable),
/* harmony export */   snakeCaseKeys: () => (/* reexport safe */ _snake_case_keys__WEBPACK_IMPORTED_MODULE_13__.snakeCaseKeys),
/* harmony export */   translateJQueryEventToNative: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.translateJQueryEventToNative),
/* harmony export */   triggerAddedToCartEvent: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.triggerAddedToCartEvent),
/* harmony export */   triggerAddingToCartEvent: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.triggerAddingToCartEvent),
/* harmony export */   triggerProductListRenderedEvent: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.triggerProductListRenderedEvent),
/* harmony export */   triggerViewedProductEvent: () => (/* reexport safe */ _legacy_events__WEBPACK_IMPORTED_MODULE_3__.triggerViewedProductEvent),
/* harmony export */   useFocusReturn: () => (/* reexport safe */ _use_return_focus__WEBPACK_IMPORTED_MODULE_18__.useFocusReturn)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "../node_modules/woocommerce-blocks/js/base/utils/errors.ts");
/* harmony import */ var _address__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./address */ "../node_modules/woocommerce-blocks/js/base/utils/address.ts");
/* harmony import */ var _shipping_rates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shipping-rates */ "../node_modules/woocommerce-blocks/js/base/utils/shipping-rates.ts");
/* harmony import */ var _legacy_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./legacy-events */ "../node_modules/woocommerce-blocks/js/base/utils/legacy-events.ts");
/* harmony import */ var _render_frontend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./render-frontend */ "../node_modules/woocommerce-blocks/js/base/utils/render-frontend.tsx");
/* harmony import */ var _get_valid_block_attributes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./get-valid-block-attributes */ "../node_modules/woocommerce-blocks/js/base/utils/get-valid-block-attributes.js");
/* harmony import */ var _product_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./product-data */ "../node_modules/woocommerce-blocks/js/base/utils/product-data.js");
/* harmony import */ var _derive_selected_shipping_rates__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./derive-selected-shipping-rates */ "../node_modules/woocommerce-blocks/js/base/utils/derive-selected-shipping-rates.ts");
/* harmony import */ var _get_icons_from_payment_methods__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./get-icons-from-payment-methods */ "../node_modules/woocommerce-blocks/js/base/utils/get-icons-from-payment-methods.ts");
/* harmony import */ var _create_notice__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./create-notice */ "../node_modules/woocommerce-blocks/js/base/utils/create-notice.ts");
/* harmony import */ var _get_navigation_type__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./get-navigation-type */ "../node_modules/woocommerce-blocks/js/base/utils/get-navigation-type.ts");
/* harmony import */ var _map_keys__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./map-keys */ "../node_modules/woocommerce-blocks/js/base/utils/map-keys.ts");
/* harmony import */ var _camel_case_keys__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./camel-case-keys */ "../node_modules/woocommerce-blocks/js/base/utils/camel-case-keys.ts");
/* harmony import */ var _snake_case_keys__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./snake-case-keys */ "../node_modules/woocommerce-blocks/js/base/utils/snake-case-keys.ts");
/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./debounce */ "../node_modules/woocommerce-blocks/js/base/utils/debounce.ts");
/* harmony import */ var _keyby__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./keyby */ "../node_modules/woocommerce-blocks/js/base/utils/keyby.ts");
/* harmony import */ var _pick__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pick */ "../node_modules/woocommerce-blocks/js/base/utils/pick.ts");
/* harmony import */ var _get_inline_styles__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./get-inline-styles */ "../node_modules/woocommerce-blocks/js/base/utils/get-inline-styles.ts");
/* harmony import */ var _use_return_focus__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./use-return-focus */ "../node_modules/woocommerce-blocks/js/base/utils/use-return-focus.ts");




















/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/keyby.ts":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/keyby.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   keyBy: () => (/* binding */ keyBy)
/* harmony export */ });
const keyBy = (array, key) => {
  return array.reduce((acc, value) => {
    const computedKey = key ? String(value[key]) : String(value);
    acc[computedKey] = value;
    return acc;
  }, {});
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/legacy-events.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/legacy-events.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dispatchEvent: () => (/* binding */ dispatchEvent),
/* harmony export */   translateJQueryEventToNative: () => (/* binding */ translateJQueryEventToNative),
/* harmony export */   triggerAddedToCartEvent: () => (/* binding */ triggerAddedToCartEvent),
/* harmony export */   triggerAddingToCartEvent: () => (/* binding */ triggerAddingToCartEvent),
/* harmony export */   triggerProductListRenderedEvent: () => (/* binding */ triggerProductListRenderedEvent),
/* harmony export */   triggerViewedProductEvent: () => (/* binding */ triggerViewedProductEvent)
/* harmony export */ });
/**
 * External dependencies
 */

const CustomEvent = window.CustomEvent || null;
/**
 * Wrapper function to dispatch an event.
 */
const dispatchEvent = (name, {
  bubbles = false,
  cancelable = false,
  element,
  detail = {}
}) => {
  if (!CustomEvent) {
    return;
  }
  if (!element) {
    element = document.body;
  }
  const event = new CustomEvent(name, {
    bubbles,
    cancelable,
    detail
  });
  element.dispatchEvent(event);
};
const triggerAddingToCartEvent = () => {
  dispatchEvent('wc-blocks_adding_to_cart', {
    bubbles: true,
    cancelable: true
  });
};
const triggerAddedToCartEvent = ({
  preserveCartData = false
}) => {
  dispatchEvent('wc-blocks_added_to_cart', {
    bubbles: true,
    cancelable: true,
    detail: {
      preserveCartData
    }
  });
};
const triggerProductListRenderedEvent = payload => {
  dispatchEvent('wc-blocks_product_list_rendered', {
    bubbles: true,
    cancelable: true,
    detail: payload
  });
};
const triggerViewedProductEvent = payload => {
  dispatchEvent('wc-blocks_viewed_product', {
    bubbles: true,
    cancelable: true,
    detail: payload
  });
};

/**
 * Function that listens to a jQuery event and dispatches a native JS event.
 * Useful to convert WC Core events into events that can be read by blocks.
 *
 * Returns a function to remove the jQuery event handler. Ideally it should be
 * used when the component is unmounted.
 */
const translateJQueryEventToNative = (jQueryEventName, nativeEventName,
// Whether the event bubbles.
bubbles = false,
// Whether the event is cancelable.
cancelable = false) => {
  if (typeof jQuery !== 'function') {
    return () => void null;
  }
  const eventDispatcher = () => {
    dispatchEvent(nativeEventName, {
      bubbles,
      cancelable
    });
  };
  jQuery(document).on(jQueryEventName, eventDispatcher);
  return () => jQuery(document).off(jQueryEventName, eventDispatcher);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/map-keys.ts":
/*!********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/map-keys.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapKeys: () => (/* binding */ mapKeys)
/* harmony export */ });
const mapKeys = (obj, mapper) => Object.entries(obj).reduce((acc, [key, value]) => ({
  ...acc,
  [mapper(value, key)]: value
}), {});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/pick.ts":
/*!****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/pick.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pick: () => (/* binding */ pick)
/* harmony export */ });
/**
 * Creates an object composed of the picked object properties.
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/product-data.js":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/product-data.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   productIsPurchasable: () => (/* binding */ productIsPurchasable),
/* harmony export */   productSupportsAddToCartForm: () => (/* binding */ productSupportsAddToCartForm)
/* harmony export */ });
/**
 * Check a product object to see if it can be purchased.
 *
 * @param {Object} product Product object.
 * @return {boolean} True if purchasable.
 */
const productIsPurchasable = product => {
  return product.is_purchasable || false;
};

/**
 * Check if the product is supported by the blocks add to cart form.
 *
 * @param {Object} product Product object.
 * @return {boolean} True if supported.
 */
const productSupportsAddToCartForm = product => {
  /**
   * @todo Define supported product types for add to cart form.
   *
   * When introducing the form-element registration system, include a method of defining if a
   * product type has support.
   *
   * If, as an example, we went with an inner block system for the add to cart form, we could allow
   * a type to be registered along with it's default Block template. Registered types would then be
   * picked up here, as well as the core types which would be defined elsewhere.
   */
  const supportedTypes = ['simple', 'variable'];
  return supportedTypes.includes(product.type || 'simple');
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/render-frontend.tsx":
/*!****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/render-frontend.tsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   renderBlock: () => (/* binding */ renderBlock),
/* harmony export */   renderFrontend: () => (/* binding */ renderFrontend)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_base_components_block_error_boundary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/base-components/block-error-boundary */ "../node_modules/woocommerce-blocks/js/base/components/block-error-boundary/index.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



// Some blocks take care of rendering their inner blocks automatically. For
// example, the empty cart. In those cases, we don't want to trigger the render
// function of inner components on load. Instead, the wrapper block can trigger
// the event `wc-blocks_render_blocks_frontend` to render its inner blocks.
const selectorsToSkipOnLoad = ['.wp-block-woocommerce-cart'];
/**
 * Renders a block component in a single `container` node.
 */
const renderBlock = ({
  Block,
  container,
  attributes = {},
  props = {},
  errorBoundaryProps = {}
}) => {
  const BlockWrapper = () => {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
      if (container.classList) {
        container.classList.remove('is-loading');
      }
    }, []);
    const isCheckoutBlock = container.classList.contains('wp-block-woocommerce-checkout');

    // Temporary return until the Cart block is also updated
    if (isCheckoutBlock) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_woocommerce_base_components_block_error_boundary__WEBPACK_IMPORTED_MODULE_1__["default"], {
        ...errorBoundaryProps,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Block, {
          ...props,
          attributes: attributes
        })
      });
    }

    // For all other blocks, use Suspense
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_woocommerce_base_components_block_error_boundary__WEBPACK_IMPORTED_MODULE_1__["default"], {
      ...errorBoundaryProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
        fallback: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "wc-block-placeholder",
          children: "Loading..."
        }),
        children: Block && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Block, {
          ...props,
          attributes: attributes
        })
      })
    });
  };
  const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(container);
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(BlockWrapper, {}));
  return root;
};
/**
 * Renders a block component in each `containers` node.
 */
const renderBlockInContainers = ({
  Block,
  containers,
  getProps = () => ({}),
  getErrorBoundaryProps = () => ({})
}) => {
  if (containers.length === 0) {
    return [];
  }
  const roots = [];
  containers.forEach((el, i) => {
    const props = getProps(el, i);
    const errorBoundaryProps = getErrorBoundaryProps(el, i);
    const attributes = {
      ...el.dataset,
      ...(props.attributes || {})
    };
    roots.push({
      container: el,
      root: renderBlock({
        Block,
        container: el,
        props,
        attributes,
        errorBoundaryProps
      })
    });
  });
  return roots;
};

// Given an element and a list of wrappers, check if the element is inside at
// least one of the wrappers.
const isElementInsideWrappers = (el, wrappers) => {
  return wrappers.some(wrapper => wrapper.contains(el) && !wrapper.isSameNode(el));
};
/**
 * Renders the block frontend in the elements matched by the selector which are
 * outside the wrapper elements.
 */
const renderBlockOutsideWrappers = ({
  Block,
  getProps,
  getErrorBoundaryProps,
  selector,
  wrappers,
  options
}) => {
  let containers = Array.from(document.body.querySelectorAll(selector));

  // Filter out blocks inside the wrappers.
  if (wrappers && wrappers.length > 0) {
    containers = containers.filter(el => {
      return !isElementInsideWrappers(el, wrappers);
    });
  }

  // Limit to first element if multiple option is false
  if (options?.multiple === false) {
    containers = containers.slice(0, 1);
  }
  return renderBlockInContainers({
    Block,
    containers,
    getProps,
    getErrorBoundaryProps
  });
};
/**
 * Renders the block frontend in the elements matched by the selector inside the
 * wrapper element.
 */
const renderBlockInsideWrapper = ({
  Block,
  getProps,
  getErrorBoundaryProps,
  selector,
  wrapper,
  options
}) => {
  let containers = Array.from(wrapper.querySelectorAll(selector));

  // Limit to first element if multiple option is false
  if (options?.multiple === false) {
    containers = containers.slice(0, 1);
  }
  renderBlockInContainers({
    Block,
    containers,
    getProps,
    getErrorBoundaryProps
  });
};
/**
 * Renders the block frontend on page load. If the block is contained inside a
 * wrapper element that should be excluded from initial load, it adds the
 * appropriate event listeners to render the block when the
 * `wc-blocks_render_blocks_frontend` event is triggered.
 */
const renderFrontend = props => {
  const wrappersToSkipOnLoad = Array.from(document.body.querySelectorAll(selectorsToSkipOnLoad.join(',')));
  const {
    Block,
    getProps,
    getErrorBoundaryProps,
    selector,
    options = {
      multiple: true
    }
  } = props;
  const roots = renderBlockOutsideWrappers({
    Block,
    getProps,
    getErrorBoundaryProps,
    selector,
    options,
    wrappers: wrappersToSkipOnLoad
  });

  // For each wrapper, add an event listener to render the inner blocks when
  // `wc-blocks_render_blocks_frontend` event is triggered.
  wrappersToSkipOnLoad.forEach(wrapper => {
    wrapper.addEventListener('wc-blocks_render_blocks_frontend', () => {
      renderBlockInsideWrapper({
        ...props,
        wrapper
      });
    });
  });
  return roots;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderFrontend);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/shipping-rates.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/shipping-rates.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allRatesAreCollectable: () => (/* binding */ allRatesAreCollectable),
/* harmony export */   filterShippingRatesByPrefersCollection: () => (/* binding */ filterShippingRatesByPrefersCollection),
/* harmony export */   getSelectedShippingRateNames: () => (/* binding */ getSelectedShippingRateNames),
/* harmony export */   getShippingRatesPackageCount: () => (/* binding */ getShippingRatesPackageCount),
/* harmony export */   getShippingRatesRateCount: () => (/* binding */ getShippingRatesRateCount),
/* harmony export */   getTotalShippingValue: () => (/* binding */ getTotalShippingValue),
/* harmony export */   hasCollectableRate: () => (/* binding */ hasCollectableRate),
/* harmony export */   hasSelectedShippingRate: () => (/* binding */ hasSelectedShippingRate),
/* harmony export */   hasShippingRate: () => (/* binding */ hasShippingRate),
/* harmony export */   isPackageRateCollectable: () => (/* binding */ isPackageRateCollectable),
/* harmony export */   selectedRatesAreCollectable: () => (/* binding */ selectedRatesAreCollectable)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/**
 * External dependencies
 */


/**
 * Get the number of packages in a shippingRates array.
 *
 * @param {Array} shippingRates Shipping rates and packages array.
 */
const getShippingRatesPackageCount = shippingRates => {
  return shippingRates.length;
};
const collectableMethodIds = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('collectableMethodIds', []);

/**
 * If the package rate's method_id is in the collectableMethodIds array, return true.
 */
const isPackageRateCollectable = rate => collectableMethodIds.includes(rate.method_id);

/**
 * Check if the specified rates are collectable. Accepts either an array of rate names, or a single string.
 */
const hasCollectableRate = chosenRates => {
  if (!_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_1__.LOCAL_PICKUP_ENABLED) {
    return false;
  }
  if (Array.isArray(chosenRates)) {
    return !!chosenRates.find(rate => collectableMethodIds.includes(rate));
  }
  return collectableMethodIds.includes(chosenRates);
};
/**
 * Get the number of rates in a shippingRates array.
 *
 * @param {Array} shippingRates Shipping rates and packages array.
 */
const getShippingRatesRateCount = shippingRates => {
  return shippingRates.reduce(function (count, shippingPackage) {
    return count + shippingPackage.shipping_rates.length;
  }, 0);
};

/**
 * Searches an array of packages/rates to see if there are actually any rates
 * available.
 *
 * @param {Array} shippingRates An array of packages and rates.
 * @return {boolean} True if a rate exists.
 */
const hasShippingRate = shippingRates => {
  return shippingRates.some(shippingRatesPackage => !!shippingRatesPackage.shipping_rates.length);
};
const hasSelectedShippingRate = shippingRates => {
  if (!hasShippingRate(shippingRates)) {
    return false;
  }
  return shippingRates.some(shippingRatesPackage => shippingRatesPackage.shipping_rates.some(rate => rate.selected));
};

/**
 * Filters an array of packages/rates based on the shopper's preference for collection.
 */
const filterShippingRatesByPrefersCollection = (shippingRates, prefersCollection) => {
  return shippingRates.map(shippingRatesPackage => {
    return {
      ...shippingRatesPackage,
      shipping_rates: shippingRatesPackage.shipping_rates.filter(rate => {
        const collectableRate = hasCollectableRate(rate.method_id);
        if (prefersCollection) {
          return collectableRate;
        }
        return !collectableRate;
      })
    };
  });
};

/**
 * Calculates the total shipping value based on store settings.
 */
const getTotalShippingValue = values => {
  return Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('displayCartPricesIncludingTax', false) ? parseInt(values.total_shipping, 10) + parseInt(values.total_shipping_tax, 10) : parseInt(values.total_shipping, 10);
};

/**
 * Get the names of the selected rates in an array of shipping rates.
 */
const getSelectedShippingRateNames = shippingRates => {
  // This is to ensure we don't have duplicate rate names in the array.
  return Array.from(new Set(shippingRates.flatMap(shippingPackage => {
    return shippingPackage.shipping_rates.filter(rate => rate.selected).map(rate => rate.name);
  })));
};
const selectedRatesAreCollectable = shippingRates => {
  return hasShippingRate(shippingRates) ? shippingRates.every(shippingPackage => {
    return shippingPackage.shipping_rates.every(rate => !rate.selected || isPackageRateCollectable(rate));
  }) : false;
};
const allRatesAreCollectable = shippingRates => {
  return hasShippingRate(shippingRates) ? shippingRates.every(shippingPackage => {
    return shippingPackage.shipping_rates.every(rate => isPackageRateCollectable(rate));
  }) : false;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/snake-case-keys.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/snake-case-keys.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   snakeCaseKeys: () => (/* binding */ snakeCaseKeys)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _map_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map-keys */ "../node_modules/woocommerce-blocks/js/base/utils/map-keys.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */

const snakeCaseKeys = obj => (0,_map_keys__WEBPACK_IMPORTED_MODULE_1__.mapKeys)(obj, (_, key) => Object(function webpackMissingModule() { var e = new Error("Cannot find module 'change-case'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(key));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/base/utils/use-return-focus.ts":
/*!****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/base/utils/use-return-focus.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFocusReturn: () => (/* binding */ useFocusReturn)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

let origin = null;

/**
 * Adds the unmount behavior of returning focus to the element which had it
 * previously as is expected for roles like menus or dialogs.
 *
 * This function is copied from Gutenberg's hook under the same name.
 */
function useFocusReturn(onFocusReturn) {
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const focusedBeforeMount = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const onFocusReturnRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onFocusReturn);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onFocusReturnRef.current = onFocusReturn;
  }, [onFocusReturn]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(node => {
    if (node) {
      // Set ref to be used when unmounting.
      ref.current = node;
      focusedBeforeMount.current = node.ownerDocument.activeElement;
    } else if (focusedBeforeMount.current) {
      const isFocused = ref.current?.contains(ref.current?.ownerDocument.activeElement);
      if (ref.current?.isConnected && !isFocused) {
        origin !== null && origin !== void 0 ? origin : origin = focusedBeforeMount.current;
        // This return would cause the code to never actually return focus.
        // return;
      }

      // Defer to the component's own explicit focus return behavior, if
      // specified. This allows for support that the `onFocusReturn`
      // decides to allow the default behavior to occur under some
      // conditions.
      if (onFocusReturnRef.current) {
        onFocusReturnRef.current();
      } else {
        const focusedElement = focusedBeforeMount.current;
        (focusedElement?.isConnected ? focusedElement : origin)?.focus();
      }
      origin = null;
    }
  }, []);
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/get-registered-block-components.ts":
/*!*****************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/block-components/get-registered-block-components.ts ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredBlockComponents: () => (/* binding */ getRegisteredBlockComponents),
/* harmony export */   getRegisteredInnerBlocks: () => (/* binding */ getRegisteredInnerBlocks)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/deprecated */ "@wordpress/deprecated");
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./registered-block-components-init */ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/registered-block-components-init.ts");
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


/**
 * Get all Registered Block Components.
 *
 * WooCommerce Blocks allows React Components to be used on the frontend of the store in place of
 * Blocks instead of just serving static content.
 *
 * This gets all registered Block Components so we know which Blocks map to which React Components.
 *
 * @param {string} context Current context (a named parent Block). If Block Components were only
 *                         registered under a certain context, those Components will be returned,
 *                         as well as any Components registered under all contexts.
 * @return {Object} List of React Components registered under the provided context.
 */
function getRegisteredBlockComponents(context) {
  const parentInnerBlocks = typeof _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context] === 'object' && Object.keys(_registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context]).length > 0 ? _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context] : {};
  return {
    ...parentInnerBlocks,
    ..._registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents.any
  };
}

/**
 * Alias of getRegisteredBlockComponents kept for backwards compatibility.
 *
 * @param {string} main Name of the parent block to retrieve children of.
 * @return {Object} List of registered inner blocks.
 */
function getRegisteredInnerBlocks(main) {
  _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default()('getRegisteredInnerBlocks', {
    version: '2.8.0',
    alternative: 'getRegisteredBlockComponents',
    plugin: 'WooCommerce Blocks'
  });
  return getRegisteredBlockComponents(main);
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/index.js":
/*!***************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/block-components/index.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredBlockComponents: () => (/* reexport safe */ _get_registered_block_components__WEBPACK_IMPORTED_MODULE_0__.getRegisteredBlockComponents),
/* harmony export */   getRegisteredInnerBlocks: () => (/* reexport safe */ _get_registered_block_components__WEBPACK_IMPORTED_MODULE_0__.getRegisteredInnerBlocks),
/* harmony export */   registerBlockComponent: () => (/* reexport safe */ _register_block_component__WEBPACK_IMPORTED_MODULE_1__.registerBlockComponent),
/* harmony export */   registerInnerBlock: () => (/* reexport safe */ _register_block_component__WEBPACK_IMPORTED_MODULE_1__.registerInnerBlock)
/* harmony export */ });
/* harmony import */ var _get_registered_block_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-registered-block-components */ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/get-registered-block-components.ts");
/* harmony import */ var _register_block_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register-block-component */ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/register-block-component.js");



/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/register-block-component.js":
/*!**********************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/block-components/register-block-component.js ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerBlockComponent: () => (/* binding */ registerBlockComponent),
/* harmony export */   registerInnerBlock: () => (/* binding */ registerInnerBlock)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/deprecated */ "@wordpress/deprecated");
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./registered-block-components-init */ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/registered-block-components-init.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


/**
 * Asserts that an option is of the given type. Otherwise, throws an error.
 *
 * @throws Will throw an error if the type of the option doesn't match the expected type.
 * @param {Object} options      Object containing the option to validate.
 * @param {string} optionName   Name of the option to validate.
 * @param {string} expectedType Type expected for the option.
 */
const assertOption = (options, optionName, expectedType) => {
  const actualType = typeof options[optionName];
  if (actualType !== expectedType) {
    throw new Error(`Incorrect value for the ${optionName} argument when registering a block component. It was a ${actualType}, but must be a ${expectedType}.`);
  }
};

/**
 * Asserts that an option is a valid react element or lazy callback. Otherwise, throws an error.
 *
 * @throws Will throw an error if the type of the option doesn't match the expected type.
 * @param {Object} options    Object containing the option to validate.
 * @param {string} optionName Name of the option to validate.
 */
const assertBlockComponent = (options, optionName) => {
  if (options[optionName]) {
    if (typeof options[optionName] === 'function') {
      return;
    }
    if (options[optionName].$$typeof && options[optionName].$$typeof === Symbol.for('react.lazy')) {
      return;
    }
  }
  throw new Error(`Incorrect value for the ${optionName} argument when registering a block component. Component must be a valid React Element or Lazy callback.`);
};

/**
 * Register a Block Component.
 *
 * WooCommerce Blocks allows React Components to be used on the frontend of the store in place of
 * Blocks instead of just serving static content.
 *
 * Registering a Block Component allows you to define which React Component should be used in place
 * of a registered Block. The Component, when rendered, will be passed all Block Attributes.
 *
 * @param {Object}   options           Options to use when registering the block.
 * @param {Function} options.component React component that will be rendered, or the return value from  React.lazy if
 *                                     dynamically imported.
 * @param {string}   options.blockName Name of the block that this component belongs to.
 * @param {string}   [options.context] To make this component available only under a certain context
 *                                     (named parent Block) define it here. If left blank, the
 *                                     Component will be available for all contexts.
 */
function registerBlockComponent(options) {
  if (!options.context) {
    options.context = 'any';
  }
  assertOption(options, 'context', 'string');
  assertOption(options, 'blockName', 'string');
  assertBlockComponent(options, 'component');
  const {
    context,
    blockName,
    component
  } = options;
  if (!_registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context]) {
    _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context] = {};
  }
  _registered_block_components_init__WEBPACK_IMPORTED_MODULE_1__.registeredBlockComponents[context][blockName] = component;
}

/**
 * Alias of registerBlockComponent kept for backwards compatibility.
 *
 * @param {Object}   options           Options to use when registering the block.
 * @param {string}   options.main      Name of the parent block.
 * @param {string}   options.blockName Name of the child block being registered.
 * @param {Function} options.component React component used to render the child block.
 */
function registerInnerBlock(options) {
  _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default()('registerInnerBlock', {
    version: '2.8.0',
    alternative: 'registerBlockComponent',
    plugin: 'WooCommerce Blocks',
    hint: '"main" has been replaced with "context" and is now optional.'
  });
  assertOption(options, 'main', 'string');
  registerBlockComponent({
    ...options,
    context: options.main
  });
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/registered-block-components-init.ts":
/*!******************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/block-components/registered-block-components-init.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registeredBlockComponents: () => (/* binding */ registeredBlockComponents)
/* harmony export */ });
/**
 * External dependencies
 */

const registeredBlockComponents = {};


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/index.js":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __experimentalDeRegisterExpressPaymentMethod: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.__experimentalDeRegisterExpressPaymentMethod),
/* harmony export */   __experimentalDeRegisterPaymentMethod: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.__experimentalDeRegisterPaymentMethod),
/* harmony export */   __experimentalRegisterProductCollection: () => (/* reexport safe */ _product_collection_register_product_collection__WEBPACK_IMPORTED_MODULE_2__.__experimentalRegisterProductCollection),
/* harmony export */   getExpressPaymentMethods: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.getExpressPaymentMethods),
/* harmony export */   getPaymentMethods: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.getPaymentMethods),
/* harmony export */   getRegisteredBlockComponents: () => (/* reexport safe */ _block_components__WEBPACK_IMPORTED_MODULE_1__.getRegisteredBlockComponents),
/* harmony export */   getRegisteredInnerBlocks: () => (/* reexport safe */ _block_components__WEBPACK_IMPORTED_MODULE_1__.getRegisteredInnerBlocks),
/* harmony export */   registerBlockComponent: () => (/* reexport safe */ _block_components__WEBPACK_IMPORTED_MODULE_1__.registerBlockComponent),
/* harmony export */   registerExpressPaymentMethod: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.registerExpressPaymentMethod),
/* harmony export */   registerInnerBlock: () => (/* reexport safe */ _block_components__WEBPACK_IMPORTED_MODULE_1__.registerInnerBlock),
/* harmony export */   registerPaymentMethod: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.registerPaymentMethod),
/* harmony export */   registerPaymentMethodExtensionCallbacks: () => (/* reexport safe */ _payment_methods__WEBPACK_IMPORTED_MODULE_0__.registerPaymentMethodExtensionCallbacks)
/* harmony export */ });
/* harmony import */ var _payment_methods__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./payment-methods */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/index.ts");
/* harmony import */ var _block_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block-components */ "../node_modules/woocommerce-blocks/js/blocks-registry/block-components/index.js");
/* harmony import */ var _product_collection_register_product_collection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./product-collection/register-product-collection */ "../node_modules/woocommerce-blocks/js/blocks-registry/product-collection/register-product-collection.tsx");




/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/assertions.ts":
/*!*******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/assertions.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assertConfigHasProperties: () => (/* binding */ assertConfigHasProperties),
/* harmony export */   assertValidElement: () => (/* binding */ assertValidElement),
/* harmony export */   assertValidElementOrString: () => (/* binding */ assertValidElementOrString),
/* harmony export */   assertValidPaymentMethodComponent: () => (/* binding */ assertValidPaymentMethodComponent)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

const assertValidPaymentMethodComponent = (component, componentName) => {
  if (typeof component !== 'function') {
    throw new TypeError(`The ${componentName} property for the payment method must be a functional component`);
  }
};
const assertValidElement = (element, elementName) => {
  if (element !== null && !(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(element)) {
    throw new TypeError(`The ${elementName} property for the payment method must be a React element or null.`);
  }
};
const assertValidElementOrString = (element, elementName) => {
  if (element !== null && !(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(element) && typeof element !== 'string') {
    throw new TypeError(`The ${elementName} property for the payment method must be a React element, a string, or null.`);
  }
};
const assertConfigHasProperties = (config, expectedProperties = []) => {
  const missingProperties = expectedProperties.reduce((acc, property) => {
    if (!config.hasOwnProperty(property)) {
      acc.push(property);
    }
    return acc;
  }, []);
  if (missingProperties.length > 0) {
    const message = 'The payment method configuration object is missing the following properties:';
    throw new TypeError(message + missingProperties.join(', '));
  }
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/express-payment-method-config.ts":
/*!**************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/express-payment-method-config.ts ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExpressPaymentMethodConfig)
/* harmony export */ });
/* harmony import */ var _payment_method_config_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./payment-method-config-helper */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config-helper.ts");
/* harmony import */ var _assertions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertions */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/assertions.ts");
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


class ExpressPaymentMethodConfig {
  constructor(config) {
    // validate config

    const readableName = typeof config.name === 'string' ? config.name.replace(/[_-]/g, ' ') : config.name;
    const trimedDescription = typeof config?.description === 'string' && config.description.length > 130 ? config.description.slice(0, 130) + '...' : config.description;
    ExpressPaymentMethodConfig.assertValidConfig(config);
    this.name = config.name;
    this.title = config.title || readableName;
    this.description = trimedDescription || '';
    this.gatewayId = config.gatewayId || '';
    this.content = config.content;
    this.edit = config.edit;
    this.paymentMethodId = config.paymentMethodId || this.name;
    this.supports = {
      features: config?.supports?.features || ['products'],
      style: config?.supports?.style || []
    };
    this.canMakePaymentFromConfig = config.canMakePayment;
  }

  // canMakePayment is calculated each time based on data that modifies outside of the class (eg: cart data).
  get canMakePayment() {
    return (0,_payment_method_config_helper__WEBPACK_IMPORTED_MODULE_0__.getCanMakePayment)(this.canMakePaymentFromConfig, this.supports.features, this.name);
  }
  static assertValidConfig = config => {
    (0,_assertions__WEBPACK_IMPORTED_MODULE_1__.assertConfigHasProperties)(config, ['name', 'content', 'edit']);
    if (typeof config.name !== 'string') {
      throw new TypeError('The name property for the express payment method must be a string');
    }
    if (typeof config.paymentMethodId !== 'string' && typeof config.paymentMethodId !== 'undefined') {
      throw new Error('The paymentMethodId property for the payment method must be a string or undefined (in which case it will be the value of the name property).');
    }
    if (typeof config.supports?.features !== 'undefined' && !Array.isArray(config.supports?.features)) {
      throw new Error('The features property for the payment method must be an array or undefined.');
    }
    (0,_assertions__WEBPACK_IMPORTED_MODULE_1__.assertValidElement)(config.content, 'content');
    (0,_assertions__WEBPACK_IMPORTED_MODULE_1__.assertValidElement)(config.edit, 'edit');
    if (typeof config.canMakePayment !== 'function') {
      throw new TypeError('The canMakePayment property for the express payment method must be a function.');
    }
  };
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/extensions-config.ts":
/*!**************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/extensions-config.ts ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canMakePaymentExtensionsCallbacks: () => (/* binding */ canMakePaymentExtensionsCallbacks),
/* harmony export */   extensionsConfig: () => (/* binding */ extensionsConfig)
/* harmony export */ });
/**
 * External dependencies
 */

// Keeps callbacks registered by extensions for different payment methods
//  eslint-disable-next-line prefer-const
const canMakePaymentExtensionsCallbacks = {};
const extensionsConfig = {
  canMakePayment: canMakePaymentExtensionsCallbacks
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/index.ts":
/*!**************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/index.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __experimentalDeRegisterExpressPaymentMethod: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.__experimentalDeRegisterExpressPaymentMethod),
/* harmony export */   __experimentalDeRegisterPaymentMethod: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.__experimentalDeRegisterPaymentMethod),
/* harmony export */   getExpressPaymentMethods: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.getExpressPaymentMethods),
/* harmony export */   getPaymentMethods: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.getPaymentMethods),
/* harmony export */   registerExpressPaymentMethod: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.registerExpressPaymentMethod),
/* harmony export */   registerPaymentMethod: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.registerPaymentMethod),
/* harmony export */   registerPaymentMethodExtensionCallbacks: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_0__.registerPaymentMethodExtensionCallbacks)
/* harmony export */ });
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./registry */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/registry.ts");


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config-helper.ts":
/*!*************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config-helper.ts ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canMakePaymentWithExtensions: () => (/* binding */ canMakePaymentWithExtensions),
/* harmony export */   canMakePaymentWithFeaturesCheck: () => (/* binding */ canMakePaymentWithFeaturesCheck),
/* harmony export */   getCanMakePayment: () => (/* binding */ getCanMakePayment)
/* harmony export */ });
/* harmony import */ var _extensions_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extensions-config */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/extensions-config.ts");
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */


// Filter out payment methods by supported features and cart requirement.
const canMakePaymentWithFeaturesCheck = (canMakePayment, features) => canPayArgument => {
  const requirements = canPayArgument?.paymentRequirements || [];
  const featuresSupportRequirements = requirements.every(requirement => features.includes(requirement));
  return featuresSupportRequirements && canMakePayment(canPayArgument);
};

// Filter out payment methods by callbacks registered by extensions.
const canMakePaymentWithExtensions = (canMakePayment, extensionsCallbacks, paymentMethodName) => canPayArgument => {
  // Validate whether the payment method is available based on its own criteria first.
  let canPay = canMakePayment(canPayArgument);
  if (canPay) {
    // Gather all callbacks for paymentMethodName.
    const namespacedCallbacks = {};
    Object.entries(extensionsCallbacks).forEach(([namespace, callbacks]) => {
      if (!(paymentMethodName in callbacks) || typeof callbacks[paymentMethodName] !== 'function') {
        return;
      }
      namespacedCallbacks[namespace] = callbacks[paymentMethodName];
    });
    canPay = Object.keys(namespacedCallbacks).every(namespace => {
      try {
        return namespacedCallbacks[namespace](canPayArgument);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Error when executing callback for ${paymentMethodName} in ${namespace}`, err);
        // .every() expects a return value at the end of every arrow function and
        // this ensures that the error is ignored when computing the whole result.
        return true;
      }
    });
  }
  return canPay;
};
const getCanMakePayment = (canMakePayment, features, paymentMethodName) => {
  const canPay = canMakePaymentWithFeaturesCheck(canMakePayment, features);
  // Loop through all callbacks to check if there are any registered for this payment method.
  return Object.values(_extensions_config__WEBPACK_IMPORTED_MODULE_0__.extensionsConfig.canMakePayment).some(callbacks => paymentMethodName in callbacks) ? canMakePaymentWithExtensions(canPay, _extensions_config__WEBPACK_IMPORTED_MODULE_0__.extensionsConfig.canMakePayment, paymentMethodName) : canPay;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config.tsx":
/*!*******************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config.tsx ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PaymentMethodConfig)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/deprecated */ "@wordpress/deprecated");
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _payment_method_config_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment-method-config-helper */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config-helper.ts");
/* harmony import */ var _assertions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assertions */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/assertions.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */



const NullComponent = () => {
  return null;
};
class PaymentMethodConfig {
  constructor(config) {
    // validate config
    PaymentMethodConfig.assertValidConfig(config);
    this.name = config.name;
    this.label = config.label;
    this.placeOrderButtonLabel = config.placeOrderButtonLabel;
    this.ariaLabel = config.ariaLabel;
    this.content = config.content;
    this.savedTokenComponent = config.savedTokenComponent;
    this.icons = config.icons || null;
    this.edit = config.edit;
    this.paymentMethodId = config.paymentMethodId || this.name;
    this.supports = {
      showSavedCards: config?.supports?.showSavedCards || config?.supports?.savePaymentInfo ||
      // Kept for backward compatibility if methods still pass this when registering.
      false,
      showSaveOption: config?.supports?.showSaveOption || false,
      features: config?.supports?.features || ['products']
    };
    this.canMakePaymentFromConfig = config.canMakePayment;
  }

  // canMakePayment is calculated each time based on data that modifies outside of the class (eg: cart data).
  get canMakePayment() {
    return (0,_payment_method_config_helper__WEBPACK_IMPORTED_MODULE_1__.getCanMakePayment)(this.canMakePaymentFromConfig, this.supports.features, this.name);
  }
  static assertValidConfig = config => {
    // set default for optional
    config.savedTokenComponent = config.savedTokenComponent || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(NullComponent, {});
    (0,_assertions__WEBPACK_IMPORTED_MODULE_2__.assertConfigHasProperties)(config, ['name', 'label', 'ariaLabel', 'content', 'edit', 'canMakePayment']);
    if (typeof config.name !== 'string') {
      throw new Error('The name property for the payment method must be a string');
    }
    if (typeof config.icons !== 'undefined' && !Array.isArray(config.icons) && config.icons !== null) {
      throw new Error('The icons property for the payment method must be an array or null.');
    }
    if (typeof config.paymentMethodId !== 'string' && typeof config.paymentMethodId !== 'undefined') {
      throw new Error('The paymentMethodId property for the payment method must be a string or undefined (in which case it will be the value of the name property).');
    }
    if (typeof config.placeOrderButtonLabel !== 'string' && typeof config.placeOrderButtonLabel !== 'undefined') {
      throw new TypeError('The placeOrderButtonLabel property for the payment method must be a string');
    }
    (0,_assertions__WEBPACK_IMPORTED_MODULE_2__.assertValidElementOrString)(config.label, 'label');
    (0,_assertions__WEBPACK_IMPORTED_MODULE_2__.assertValidElement)(config.content, 'content');
    (0,_assertions__WEBPACK_IMPORTED_MODULE_2__.assertValidElement)(config.edit, 'edit');
    (0,_assertions__WEBPACK_IMPORTED_MODULE_2__.assertValidElement)(config.savedTokenComponent, 'savedTokenComponent');
    if (typeof config.ariaLabel !== 'string') {
      throw new TypeError('The ariaLabel property for the payment method must be a string');
    }
    if (typeof config.canMakePayment !== 'function') {
      throw new TypeError('The canMakePayment property for the payment method must be a function.');
    }
    if (typeof config.supports?.showSavedCards !== 'undefined' && typeof config.supports?.showSavedCards !== 'boolean') {
      throw new TypeError('If the payment method includes the `supports.showSavedCards` property, it must be a boolean');
    }
    if (typeof config.supports?.savePaymentInfo !== 'undefined') {
      _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default()('Passing savePaymentInfo when registering a payment method.', {
        alternative: 'Pass showSavedCards and showSaveOption',
        plugin: 'woocommerce-gutenberg-products-block',
        link: 'https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3686'
      });
    }
    if (typeof config.supports?.features !== 'undefined' && !Array.isArray(config.supports?.features)) {
      throw new Error('The features property for the payment method must be an array or undefined.');
    }
    if (typeof config.supports?.showSaveOption !== 'undefined' && typeof config.supports?.showSaveOption !== 'boolean') {
      throw new TypeError('If the payment method includes the `supports.showSaveOption` property, it must be a boolean');
    }
  };
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/registry.ts":
/*!*****************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/registry.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __experimentalDeRegisterExpressPaymentMethod: () => (/* binding */ __experimentalDeRegisterExpressPaymentMethod),
/* harmony export */   __experimentalDeRegisterPaymentMethod: () => (/* binding */ __experimentalDeRegisterPaymentMethod),
/* harmony export */   getExpressPaymentMethods: () => (/* binding */ getExpressPaymentMethods),
/* harmony export */   getPaymentMethods: () => (/* binding */ getPaymentMethods),
/* harmony export */   registerExpressPaymentMethod: () => (/* binding */ registerExpressPaymentMethod),
/* harmony export */   registerPaymentMethod: () => (/* binding */ registerPaymentMethod),
/* harmony export */   registerPaymentMethodExtensionCallbacks: () => (/* binding */ registerPaymentMethodExtensionCallbacks)
/* harmony export */ });
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/deprecated */ "@wordpress/deprecated");
/* harmony import */ var _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _payment_method_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./payment-method-config */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/payment-method-config.tsx");
/* harmony import */ var _express_payment_method_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./express-payment-method-config */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/express-payment-method-config.ts");
/* harmony import */ var _extensions_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./extensions-config */ "../node_modules/woocommerce-blocks/js/blocks-registry/payment-methods/extensions-config.ts");
/* harmony import */ var _data_payment_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../data/payment/constants */ "../node_modules/woocommerce-blocks/js/data/payment/constants.ts");
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */




const paymentMethods = {};
const expressPaymentMethods = {};

/**
 * Register a regular payment method.
 */
const registerPaymentMethod = options => {
  let paymentMethodConfig;
  if (typeof options === 'function') {
    // Legacy fallback for previous API, where client passes a function:
    // registerPaymentMethod( ( Config ) => new Config( options ) );
    paymentMethodConfig = options(_payment_method_config__WEBPACK_IMPORTED_MODULE_2__["default"]);
    _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default()('Passing a callback to registerPaymentMethod()', {
      alternative: 'a config options object',
      plugin: 'woocommerce-gutenberg-products-block',
      link: 'https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3404'
    });
  } else {
    paymentMethodConfig = new _payment_method_config__WEBPACK_IMPORTED_MODULE_2__["default"](options);
  }
  if (paymentMethodConfig instanceof _payment_method_config__WEBPACK_IMPORTED_MODULE_2__["default"]) {
    paymentMethods[paymentMethodConfig.name] = paymentMethodConfig;
  }
};

/**
 * Register an express payment method.
 */
const registerExpressPaymentMethod = options => {
  let paymentMethodConfig;
  if (typeof options === 'function') {
    // Legacy fallback for previous API, where client passes a function:
    // registerExpressPaymentMethod( ( Config ) => new Config( options ) );
    paymentMethodConfig = options(_express_payment_method_config__WEBPACK_IMPORTED_MODULE_3__["default"]);
    _wordpress_deprecated__WEBPACK_IMPORTED_MODULE_0___default()('Passing a callback to registerExpressPaymentMethod()', {
      alternative: 'a config options object',
      plugin: 'woocommerce-gutenberg-products-block',
      link: 'https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3404'
    });
  } else {
    paymentMethodConfig = new _express_payment_method_config__WEBPACK_IMPORTED_MODULE_3__["default"](options);
  }
  if (paymentMethodConfig instanceof _express_payment_method_config__WEBPACK_IMPORTED_MODULE_3__["default"]) {
    expressPaymentMethods[paymentMethodConfig.name] = paymentMethodConfig;
  }
};

/**
 * Allows extension to register callbacks for specific payment methods to determine if they can make payments
 */
const registerPaymentMethodExtensionCallbacks = (namespace, callbacks) => {
  if (_extensions_config__WEBPACK_IMPORTED_MODULE_4__.canMakePaymentExtensionsCallbacks[namespace]) {
    // eslint-disable-next-line no-console
    console.error(`The namespace provided to registerPaymentMethodExtensionCallbacks must be unique. Callbacks have already been registered for the ${namespace} namespace.`);
  } else {
    // Set namespace up as an empty object.
    _extensions_config__WEBPACK_IMPORTED_MODULE_4__.canMakePaymentExtensionsCallbacks[namespace] = {};
    Object.entries(callbacks).forEach(([paymentMethodName, callback]) => {
      if (typeof callback === 'function') {
        _extensions_config__WEBPACK_IMPORTED_MODULE_4__.canMakePaymentExtensionsCallbacks[namespace][paymentMethodName] = callback;
      } else {
        // eslint-disable-next-line no-console
        console.error(`All callbacks provided to registerPaymentMethodExtensionCallbacks must be functions. The callback for the ${paymentMethodName} payment method in the ${namespace} namespace was not a function.`);
      }
    });
  }
};
const __experimentalDeRegisterPaymentMethod = paymentMethodName => {
  delete paymentMethods[paymentMethodName];
  const {
    __internalRemoveAvailablePaymentMethod
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(_data_payment_constants__WEBPACK_IMPORTED_MODULE_5__.STORE_KEY);
  __internalRemoveAvailablePaymentMethod(paymentMethodName);
};
const __experimentalDeRegisterExpressPaymentMethod = paymentMethodName => {
  delete expressPaymentMethods[paymentMethodName];
  const {
    __internalRemoveAvailableExpressPaymentMethod
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)(_data_payment_constants__WEBPACK_IMPORTED_MODULE_5__.STORE_KEY);
  __internalRemoveAvailableExpressPaymentMethod(paymentMethodName);
};
const getPaymentMethods = () => {
  return paymentMethods;
};
const getExpressPaymentMethods = () => {
  return expressPaymentMethods;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks-registry/product-collection/register-product-collection.tsx":
/*!****************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks-registry/product-collection/register-product-collection.tsx ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __experimentalRegisterProductCollection: () => (/* binding */ __experimentalRegisterProductCollection)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_blocks_product_collection_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/blocks/product-collection/types */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts");
/* harmony import */ var _woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/blocks/product-collection/constants */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* eslint-disable no-console */
/**
 * External dependencies
 */





/**
 * Validates the configuration object of new collection. This function checks
 * whether the provided config object adheres to the required schema and conditions necessary
 * for a valid collection.
 *
 * Each validation step may log errors or warnings to the console if the corresponding property
 * does not meet the expected criteria. It will bail early and return false, if any of the
 * required properties are missing or invalid.
 */
const isValidCollectionConfig = config => {
  // Basic checks for the top-level argument
  if (typeof config !== 'object' || config === null) {
    console.error('Invalid arguments: You must pass an object to __experimentalRegisterProductCollection.');
    return false;
  }

  /**
   * BlockVariation properties validation
   */
  // name
  if (typeof config.name !== 'string' || config.name.length === 0) {
    console.error('Invalid name: name must be a non-empty string.');
    return false;
  } else if (!config.name.match(/^[a-zA-Z0-9-]+\/product-collection\/[a-zA-Z0-9-]+$/)) {
    console.warn(`To prevent conflicts with other collections, please use a unique name following the pattern: "<plugin-name>/product-collection/<collection-name>". Ensure "<plugin-name>" is your plugin name and "<collection-name>" is your collection name. Both should consist only of alphanumeric characters and hyphens (e.g., "my-plugin/product-collection/my-collection").`);
  }
  // title
  if (typeof config.title !== 'string' || config.title.length === 0) {
    console.error('Invalid title: title must be a non-empty string.');
    return false;
  }
  // description
  if (config.description !== undefined && typeof config.description !== 'string') {
    console.warn('Invalid description: description must be a string.');
  }
  // category
  if (config.category !== undefined && typeof config.category !== 'string') {
    console.warn('Invalid category: category must be a string.');
  }
  // keywords
  if (config.keywords !== undefined && !Array.isArray(config.keywords)) {
    console.warn('Invalid keywords: keywords must be an array of strings.');
  }
  // icon
  if (config.icon !== undefined && typeof config.icon !== 'string' && typeof config.icon !== 'object') {
    console.warn('Invalid icon: icon must be a string or an object.');
  }
  // example
  if (config.example !== undefined && typeof config.example !== 'object') {
    console.warn('Invalid example: example must be an object.');
  }
  // scope
  if (config.scope !== undefined && !Array.isArray(config.scope)) {
    console.warn('Invalid scope: scope must be an array of type WPBlockVariationScope.');
  }

  /**
   * Attributes validation
   */
  // attributes
  if (config.attributes !== undefined && typeof config.attributes !== 'object') {
    console.warn('Invalid attributes: attributes must be an object.');
  }
  // attributes.query
  if (config.attributes?.query !== undefined && typeof config.attributes.query !== 'object') {
    console.warn('Invalid query: query must be an object.');
  }
  // attributes.query.offset
  if (config.attributes?.query?.offset !== undefined && typeof config.attributes.query.offset !== 'number') {
    console.warn('Invalid offset: offset must be a number.');
  }
  // attributes.query.order
  if (config.attributes?.query?.order !== undefined && typeof config.attributes.query.order !== 'string') {
    console.warn('Invalid order: order must be a string.');
  }
  // attributes.query.orderBy
  if (config.attributes?.query?.orderBy !== undefined && typeof config.attributes.query.orderBy !== 'string') {
    console.warn('Invalid orderBy: orderBy must be a string.');
  }
  // attributes.query.pages
  if (config.attributes?.query?.pages !== undefined && typeof config.attributes.query.pages !== 'number') {
    console.warn('Invalid pages: pages must be a number.');
  }
  // attributes.query.perPage
  if (config.attributes?.query?.perPage !== undefined && typeof config.attributes.query.perPage !== 'number') {
    console.warn('Invalid perPage: perPage must be a number.');
  }
  // attributes.query.search
  if (config.attributes?.query?.search !== undefined && typeof config.attributes.query.search !== 'string') {
    console.warn('Invalid search: search must be a string.');
  }
  // attributes.query.taxQuery
  if (config.attributes?.query?.taxQuery !== undefined && typeof config.attributes.query.taxQuery !== 'object') {
    console.warn('Invalid taxQuery: taxQuery must be an object.');
  }
  // attributes.query.featured
  if (config.attributes?.query?.featured !== undefined && typeof config.attributes.query.featured !== 'boolean') {
    console.warn('Invalid featured: featured must be a boolean.');
  }
  // attributes.query.timeFrame
  if (config.attributes?.query?.timeFrame !== undefined && typeof config.attributes.query.timeFrame !== 'object') {
    console.warn('Invalid timeFrame: timeFrame must be an object.');
  }
  // attributes.query.woocommerceOnSale
  if (config.attributes?.query?.woocommerceOnSale !== undefined && typeof config.attributes.query.woocommerceOnSale !== 'boolean') {
    console.warn('Invalid woocommerceOnSale: woocommerceOnSale must be a boolean.');
  }
  // attributes.query.woocommerceStockStatus
  if (config.attributes?.query?.woocommerceStockStatus !== undefined && !Array.isArray(config.attributes.query.woocommerceStockStatus)) {
    console.warn('Invalid woocommerceStockStatus: woocommerceStockStatus must be an array.');
  }
  // attributes.query.woocommerceAttributes
  if (config.attributes?.query?.woocommerceAttributes !== undefined && !Array.isArray(config.attributes.query.woocommerceAttributes)) {
    console.warn('Invalid woocommerceAttributes: woocommerceAttributes must be an array.');
  }
  // attributes.query.woocommerceHandPickedProducts
  if (config.attributes?.query?.woocommerceHandPickedProducts !== undefined && !Array.isArray(config.attributes.query.woocommerceHandPickedProducts)) {
    console.warn('Invalid woocommerceHandPickedProducts: woocommerceHandPickedProducts must be an array.');
  }
  // attributes.query.priceRange
  if (config.attributes?.query?.priceRange !== undefined && typeof config.attributes.query.priceRange !== 'object') {
    console.warn('Invalid priceRange: priceRange must be an object.');
  }
  // attributes.displayLayout
  if (config.attributes?.displayLayout !== undefined && typeof config.attributes.displayLayout !== 'object') {
    console.warn('Invalid displayLayout: displayLayout must be an object.');
  }
  // attributes.dimensions
  if (config.attributes?.dimensions !== undefined && typeof config.attributes.dimensions !== 'object') {
    console.warn('Invalid dimensions: dimensions must be an object.');
  }
  // attributes.hideControls
  if (config.attributes?.hideControls !== undefined && !Array.isArray(config.attributes.hideControls)) {
    console.warn('Invalid hideControls: hideControls must be an array of strings.');
  }
  // attributes.queryContextIncludes
  if (config.attributes?.queryContextIncludes !== undefined && !Array.isArray(config.attributes.queryContextIncludes)) {
    console.warn('Invalid queryContextIncludes: queryContextIncludes must be an array of strings.');
  }

  /**
   * Preview validation
   */
  if (config.preview !== undefined) {
    // preview
    if (typeof config.preview !== 'object' || config.preview === null) {
      console.warn('Invalid preview: preview must be an object.');
    }
    // preview.setPreviewState
    if (config.preview.setPreviewState !== undefined && typeof config.preview.setPreviewState !== 'function') {
      console.warn('Invalid preview: setPreviewState must be a function.');
    }
    if (config.preview.initialPreviewState !== undefined) {
      // preview.initialPreviewState
      if (typeof config.preview.initialPreviewState !== 'object') {
        console.warn('Invalid preview: initialPreviewState must be an object.');
      }
      // preview.initialPreviewState.isPreview
      if (typeof config.preview.initialPreviewState.isPreview !== 'boolean') {
        console.warn('Invalid preview: preview.isPreview must be a boolean.');
      }
      // preview.initialPreviewState.previewMessage
      if (typeof config.preview.initialPreviewState.previewMessage !== 'string') {
        console.warn('Invalid preview: preview.previewMessage must be a string.');
      }
    }
  }

  // usesReference
  if (config.usesReference !== undefined && !Array.isArray(config.usesReference)) {
    console.error('Invalid usesReference: usesReference must be an array of strings.');
    return false;
  }
  return true;
};

/**
 * Register a new collection for the Product Collection block.
 *
 * 🚨🚨🚨 WARNING: This is an experimental API and is subject to change without notice.
 *
 * @param {ProductCollectionConfig} config The configuration of new collection.
 */
const __experimentalRegisterProductCollection = config => {
  // If the config is invalid, return early.
  if (!isValidCollectionConfig(config)) {
    console.error('Collection could not be registered due to invalid configuration.');
    return;
  }
  const {
    preview: {
      setPreviewState,
      initialPreviewState
    } = {},
    usesReference
  } = config;
  const isActive = (blockAttrs, variationAttributes) => {
    return blockAttrs.collection === variationAttributes.collection;
  };
  const query = config.attributes?.query || {};
  /**
   * As we don't allow collections to change "inherit" attribute,
   * We always need to hide the inherit control.
   */
  const hideControls = [...new Set([_woocommerce_blocks_product_collection_types__WEBPACK_IMPORTED_MODULE_1__.CoreFilterNames.INHERIT, ...(config.attributes?.hideControls || [])])];
  const collectionConfigWithoutExtraArgs = {
    name: config.name,
    title: config.title,
    description: config.description,
    category: config.category,
    keywords: config.keywords,
    icon: config.icon,
    example: config.example,
    scope: config.scope,
    attributes: {
      ...config.attributes,
      // Allow users to pass extra attributes.
      query: {
        ..._woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_QUERY,
        ...(query.offset !== undefined && {
          offset: query.offset
        }),
        ...(query.order !== undefined && {
          order: query.order
        }),
        ...(query.orderBy !== undefined && {
          orderBy: query.orderBy
        }),
        ...(query.pages !== undefined && {
          pages: query.pages
        }),
        ...(query.perPage !== undefined && {
          perPage: query.perPage
        }),
        ...(query.search !== undefined && {
          search: query.search
        }),
        ...(query.taxQuery !== undefined && {
          taxQuery: query.taxQuery
        }),
        ...(query.featured !== undefined && {
          featured: query.featured
        }),
        ...(query.timeFrame !== undefined && {
          timeFrame: query.timeFrame
        }),
        ...(query.woocommerceOnSale !== undefined && {
          woocommerceOnSale: query.woocommerceOnSale
        }),
        ...(query.woocommerceStockStatus !== undefined && {
          woocommerceStockStatus: query.woocommerceStockStatus
        }),
        ...(query.woocommerceAttributes !== undefined && {
          woocommerceAttributes: query.woocommerceAttributes
        }),
        ...(query.woocommerceHandPickedProducts !== undefined && {
          woocommerceHandPickedProducts: query.woocommerceHandPickedProducts
        }),
        ...(query.priceRange !== undefined && {
          priceRange: query.priceRange
        })
      },
      hideControls,
      // collection should be set to the name of the collection i.e. config.name
      collection: config.name,
      // Collections should always have inherit set to false.
      inherit: false
    },
    /**
     * We always want following properties to be set to the default values.
     */
    innerBlocks: config.innerBlocks || _woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.INNER_BLOCKS_TEMPLATE,
    isActive,
    isDefault: false
  };

  /**
   * If setPreviewState or initialPreviewState is provided, inject the setPreviewState & initialPreviewState props.
   * This is useful for handling preview mode in the editor.
   */
  if (setPreviewState || initialPreviewState || Array.isArray(usesReference) && usesReference.length > 0) {
    /**
     * This function is used to inject following props to the BlockEdit component:
     * 1. preview: { setPreviewState, initialPreviewState }
     * 2. usesReference
     */
    const withAdditionalProps = BlockEdit => props => {
      // If collection name does not match, return the original BlockEdit component.
      if (props.attributes.collection !== collectionConfigWithoutExtraArgs.name) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(BlockEdit, {
          ...props
        });
      }

      // Otherwise, inject the setPreviewState & initialPreviewState props.
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(BlockEdit, {
        ...props,
        ...(initialPreviewState || setPreviewState ? {
          preview: {
            setPreviewState,
            initialPreviewState
          }
        } : {}),
        usesReference: usesReference
      });
    };
    (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('editor.BlockEdit', collectionConfigWithoutExtraArgs.name, withAdditionalProps);
  }

  /**
   * Temporarily utilizing `wp.blocks.registerBlockVariation` directly instead of importing
   * from `@wordpress/blocks` to mitigate the increase in the number of JavaScript files
   * loaded on the frontend, specifically on the /shop page.
   *
   * TODO - Future Improvement:
   * It is recommended to encapsulate the `registerProductCollection` function within a new
   * package that is exclusively loaded in the editor. This strategy will eliminate
   * the need to directly use `wp.blocks.registerBlockVariation`.
   */
  if (wp?.blocks?.registerBlockVariation) {
    wp.blocks.registerBlockVariation(_woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.PRODUCT_COLLECTION_BLOCK_NAME, {
      ...collectionConfigWithoutExtraArgs,
      attributes: {
        ..._woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_ATTRIBUTES,
        ...collectionConfigWithoutExtraArgs.attributes,
        query: {
          ..._woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_QUERY,
          ...collectionConfigWithoutExtraArgs.attributes?.query
        },
        displayLayout: {
          ..._woocommerce_blocks_product_collection_constants__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_ATTRIBUTES.displayLayout,
          ...collectionConfigWithoutExtraArgs.attributes?.displayLayout
        }
      }
    });
  }
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/constants.ts":
/*!**********************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/constants.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOURS_TO_DISPLAY_UPGRADE_NOTICE: () => (/* binding */ HOURS_TO_DISPLAY_UPGRADE_NOTICE),
/* harmony export */   INITIAL_STATUS_LS_VALUE: () => (/* binding */ INITIAL_STATUS_LS_VALUE),
/* harmony export */   MANUAL_REPLACE_PRODUCTS_WITH_PRODUCT_COLLECTION: () => (/* binding */ MANUAL_REPLACE_PRODUCTS_WITH_PRODUCT_COLLECTION),
/* harmony export */   MIGRATION_STATUS_LS_KEY: () => (/* binding */ MIGRATION_STATUS_LS_KEY),
/* harmony export */   UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD: () => (/* binding */ UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD),
/* harmony export */   getInitialStatusLSValue: () => (/* binding */ getInitialStatusLSValue)
/* harmony export */ });
/**
 * Internal dependencies
 */

const MANUAL_REPLACE_PRODUCTS_WITH_PRODUCT_COLLECTION = true;
const HOURS_TO_DISPLAY_UPGRADE_NOTICE = 72;
const UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD = 4;
const MIGRATION_STATUS_LS_KEY = 'wc-blocks_upgraded-products-to-product-collection';
// Initial status used in the localStorage
const INITIAL_STATUS_LS_VALUE = 'notseen';
const getInitialStatusLSValue = () => ({
  status: INITIAL_STATUS_LS_VALUE,
  time: Date.now(),
  displayCount: 0
});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/index.ts":
/*!******************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/index.ts ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOURS_TO_DISPLAY_UPGRADE_NOTICE: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.HOURS_TO_DISPLAY_UPGRADE_NOTICE),
/* harmony export */   INITIAL_STATUS_LS_VALUE: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.INITIAL_STATUS_LS_VALUE),
/* harmony export */   MANUAL_REPLACE_PRODUCTS_WITH_PRODUCT_COLLECTION: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.MANUAL_REPLACE_PRODUCTS_WITH_PRODUCT_COLLECTION),
/* harmony export */   MIGRATION_STATUS_LS_KEY: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.MIGRATION_STATUS_LS_KEY),
/* harmony export */   UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD),
/* harmony export */   checkIfBlockCanBeInserted: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.checkIfBlockCanBeInserted),
/* harmony export */   getInitialStatusLSValue: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.getInitialStatusLSValue),
/* harmony export */   getProductCollectionBlockClientIds: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.getProductCollectionBlockClientIds),
/* harmony export */   getProductsBlockClientIds: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.getProductsBlockClientIds),
/* harmony export */   getUpgradeStatus: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.getUpgradeStatus),
/* harmony export */   incrementUpgradeStatusDisplayCount: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.incrementUpgradeStatusDisplayCount),
/* harmony export */   manualUpdate: () => (/* reexport safe */ _migration_from_products_to_product_collection__WEBPACK_IMPORTED_MODULE_0__.manualUpdate),
/* harmony export */   postTemplateHasSupportForGridView: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.postTemplateHasSupportForGridView),
/* harmony export */   replaceProductCollectionWithProducts: () => (/* reexport safe */ _migration_from_product_collection_to_products__WEBPACK_IMPORTED_MODULE_1__.replaceProductCollectionWithProducts),
/* harmony export */   replaceProductsWithProductCollection: () => (/* reexport safe */ _migration_from_products_to_product_collection__WEBPACK_IMPORTED_MODULE_0__.replaceProductsWithProductCollection),
/* harmony export */   revertMigration: () => (/* reexport safe */ _migration_from_product_collection_to_products__WEBPACK_IMPORTED_MODULE_1__.revertMigration),
/* harmony export */   setUpgradeStatus: () => (/* reexport safe */ _migration_utils__WEBPACK_IMPORTED_MODULE_2__.setUpgradeStatus)
/* harmony export */ });
/* harmony import */ var _migration_from_products_to_product_collection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./migration-from-products-to-product-collection */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-products-to-product-collection.ts");
/* harmony import */ var _migration_from_product_collection_to_products__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./migration-from-product-collection-to-products */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-product-collection-to-products.ts");
/* harmony import */ var _migration_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./migration-utils */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/types.ts");






/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-product-collection-to-products.ts":
/*!**********************************************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-product-collection-to-products.ts ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replaceProductCollectionWithProducts: () => (/* binding */ replaceProductCollectionWithProducts),
/* harmony export */   revertMigration: () => (/* binding */ revertMigration)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _migration_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./migration-utils */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-utils.ts");
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */

const VARIATION_NAME = 'woocommerce/product-query';
const mapAttributes = attributes => {
  const {
    query,
    ...restAttributes
  } = attributes;
  const {
    woocommerceAttributes,
    woocommerceStockStatus,
    woocommerceOnSale,
    woocommerceHandPickedProducts,
    taxQuery,
    isProductCollectionBlock,
    ...restQuery
  } = query;

  // These fields have to be explicitly removed if they are empty
  // otherwise incorrect data is fetched even if they are set as undefined.
  const mappedQuery = {
    ...restQuery
  };
  if (woocommerceHandPickedProducts) {
    mappedQuery.include = woocommerceHandPickedProducts;
  }
  if (woocommerceOnSale) {
    mappedQuery.__woocommerceOnSale = woocommerceOnSale;
  }
  if (taxQuery) {
    mappedQuery.taxQuery = taxQuery;
  }
  return {
    ...restAttributes,
    namespace: VARIATION_NAME,
    query: {
      __woocommerceAttributes: woocommerceAttributes || [],
      __woocommerceStockStatus: woocommerceStockStatus || [],
      ...mappedQuery
    }
  };
};
const isProductTemplate = ({
  name
}) => name === 'woocommerce/product-template';
const isPostTitle = ({
  name,
  attributes
}) => name === 'core/post-title' && attributes.__woocommerceNamespace === 'woocommerce/product-collection/product-title';
const isPostSummary = ({
  name,
  attributes
}) => name === 'core/post-excerpt' && attributes.__woocommerceNamespace === 'woocommerce/product-collection/product-summary';
const mapLayoutType = type => {
  if (type === 'flex') {
    return 'grid';
  }
  if (type === 'list') {
    return 'default';
  }
  return 'grid';
};
const mapLayoutPropertiesFromProductCollectionToPostTemplate = layout => {
  const {
    type,
    columns
  } = layout;
  return {
    type: mapLayoutType(type),
    columnCount: columns
  };
};
const transformProductTemplate = (block, innerBlocks, displayLayout) => {
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-template', {
    className: 'products-block-post-template',
    layout: _migration_utils__WEBPACK_IMPORTED_MODULE_2__.postTemplateHasSupportForGridView ? mapLayoutPropertiesFromProductCollectionToPostTemplate(displayLayout) : undefined,
    __woocommerceNamespace: 'woocommerce/product-query/product-template',
    ...block.attributes
  }, innerBlocks);
};
const transformPostTitle = (block, innerBlocks) => {
  const {
    __woocommerceNamespace,
    ...restAttrributes
  } = block.attributes;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-title', {
    __woocommerceNamespace: 'woocommerce/product-collection/product-title',
    ...restAttrributes
  }, innerBlocks);
};
const transformPostSummary = (block, innerBlocks) => {
  const {
    __woocommerceNamespace,
    ...restAttrributes
  } = block.attributes;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-excerpt', {
    __woocommerceNamespace: 'woocommerce/product-collection/product-summary',
    ...restAttrributes
  }, innerBlocks);
};
const mapInnerBlocks = (innerBlocks, displayLayout) => {
  const mappedInnerBlocks = innerBlocks.map(innerBlock => {
    const {
      name,
      attributes
    } = innerBlock;
    const mappedInnerInnerBlocks = mapInnerBlocks(innerBlock.innerBlocks);
    if (isProductTemplate(innerBlock)) {
      return transformProductTemplate(innerBlock, mappedInnerInnerBlocks, displayLayout);
    }
    if (isPostTitle(innerBlock)) {
      return transformPostTitle(innerBlock, mappedInnerInnerBlocks);
    }
    if (isPostSummary(innerBlock)) {
      return transformPostSummary(innerBlock, mappedInnerInnerBlocks);
    }
    return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)(name, attributes, mappedInnerInnerBlocks);
  });
  return mappedInnerBlocks;
};
const replaceProductCollectionBlock = clientId => {
  const productCollectionBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getBlock(clientId);
  const canBeInserted = (0,_migration_utils__WEBPACK_IMPORTED_MODULE_2__.checkIfBlockCanBeInserted)(clientId, 'core/query');
  if (productCollectionBlock && canBeInserted) {
    const {
      attributes = {},
      innerBlocks = []
    } = productCollectionBlock;
    // Starting from GB 16, it's not Query Loop that keeps the layout, but the Post Template block.
    // We need to account for that and in that case, move the layout properties
    // from Product Collection either to Query Loop OR to Post Template.
    const {
      displayLayout,
      ...restAttributes
    } = attributes;
    const adjustedAttributes = !_migration_utils__WEBPACK_IMPORTED_MODULE_2__.postTemplateHasSupportForGridView ? mapAttributes(attributes) : mapAttributes(restAttributes);
    const adjustedInnerBlocks = mapInnerBlocks(innerBlocks, displayLayout);
    const productsBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/query', adjustedAttributes, adjustedInnerBlocks);
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/block-editor').replaceBlock(clientId, productsBlock);
    return true;
  }
  return false;
};
const replaceProductCollectionWithProducts = () => {
  const blocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getBlocks();
  const productCollectionBlockClientIds = (0,_migration_utils__WEBPACK_IMPORTED_MODULE_2__.getProductCollectionBlockClientIds)(blocks);
  productCollectionBlockClientIds.map(replaceProductCollectionBlock);
};
const revertMigration = () => {
  (0,_migration_utils__WEBPACK_IMPORTED_MODULE_2__.setUpgradeStatus)({
    status: 'reverted',
    time: Date.now()
  });
  replaceProductCollectionWithProducts();
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-products-to-product-collection.ts":
/*!**********************************************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-from-products-to-product-collection.ts ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   manualUpdate: () => (/* binding */ manualUpdate),
/* harmony export */   replaceProductsWithProductCollection: () => (/* binding */ replaceProductsWithProductCollection)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/constants.ts");
/* harmony import */ var _migration_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./migration-utils */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-utils.ts");
/* harmony import */ var _product_collection_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../product-collection/constants */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/constants.ts");
/* harmony import */ var _product_collection_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../product-collection/types */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts");
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */




const mapAttributes = attributes => {
  const {
    query,
    namespace,
    ...restAttributes
  } = attributes;
  const {
    __woocommerceAttributes,
    __woocommerceStockStatus,
    __woocommerceOnSale,
    include,
    ...restQuery
  } = query;
  return {
    ...restAttributes,
    query: {
      woocommerceAttributes: __woocommerceAttributes,
      woocommerceStockStatus: __woocommerceStockStatus,
      woocommerceOnSale: __woocommerceOnSale,
      woocommerceHandPickedProducts: include,
      taxQuery: {},
      isProductCollectionBlock: true,
      ...restQuery
    },
    convertedFromProducts: true
  };
};
const isPostTemplate = ({
  name,
  attributes
}) => name === 'core/post-template' && attributes.__woocommerceNamespace === 'woocommerce/product-query/product-template';
const isPostTitle = ({
  name,
  attributes
}) => name === 'core/post-title' && attributes.__woocommerceNamespace === 'woocommerce/product-query/product-title';
const isPostSummary = ({
  name,
  attributes
}) => name === 'core/post-excerpt' && attributes.__woocommerceNamespace === 'woocommerce/product-query/product-summary';
const transformPostTemplate = (block, innerBlocks) => {
  const {
    __woocommerceNamespace,
    className,
    layout,
    ...restAttrributes
  } = block.attributes;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('woocommerce/product-template', restAttrributes, innerBlocks);
};
const transformPostTitle = (block, innerBlocks) => {
  const {
    __woocommerceNamespace,
    ...restAttrributes
  } = block.attributes;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-title', {
    __woocommerceNamespace: 'woocommerce/product-collection/product-title',
    ...restAttrributes
  }, innerBlocks);
};
const transformPostSummary = (block, innerBlocks) => {
  const {
    __woocommerceNamespace,
    ...restAttrributes
  } = block.attributes;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-excerpt', {
    __woocommerceNamespace: 'woocommerce/product-collection/product-summary',
    ...restAttrributes
  }, innerBlocks);
};
const mapLayoutType = type => {
  if (type === 'grid') {
    return _product_collection_types__WEBPACK_IMPORTED_MODULE_5__.LayoutOptions.GRID;
  }
  if (type === 'default') {
    return _product_collection_types__WEBPACK_IMPORTED_MODULE_5__.LayoutOptions.STACK;
  }
  return _product_collection_types__WEBPACK_IMPORTED_MODULE_5__.LayoutOptions.GRID;
};
const mapLayoutPropertiesFromPostTemplateToProductCollection = layout => {
  if (layout === undefined) {
    return _product_collection_constants__WEBPACK_IMPORTED_MODULE_4__.DEFAULT_ATTRIBUTES.displayLayout;
  }
  const {
    type,
    columnCount
  } = layout;
  return {
    type: mapLayoutType(type),
    columns: columnCount
  };
};
const getLayoutAttribute = (attributes, innerBlocks) => {
  // Starting from GB 16, it's not Query Loop that keeps the layout, but the Post Template block.
  // We need to account for that and in that case, move the layout properties
  // from Post Template to Product Collection.
  const postTemplate = innerBlocks.find(isPostTemplate);
  const {
    layout: postTemplateLayout
  } = postTemplate?.attributes || {};
  return _migration_utils__WEBPACK_IMPORTED_MODULE_3__.postTemplateHasSupportForGridView ? mapLayoutPropertiesFromPostTemplateToProductCollection(postTemplateLayout) : attributes.displayLayout;
};
const mapInnerBlocks = innerBlocks => {
  const mappedInnerBlocks = innerBlocks.map(innerBlock => {
    const {
      name,
      attributes
    } = innerBlock;
    const mappedInnerInnerBlocks = mapInnerBlocks(innerBlock.innerBlocks);
    if (isPostTemplate(innerBlock)) {
      return transformPostTemplate(innerBlock, mappedInnerInnerBlocks);
    }
    if (isPostTitle(innerBlock)) {
      return transformPostTitle(innerBlock, mappedInnerInnerBlocks);
    }
    if (isPostSummary(innerBlock)) {
      return transformPostSummary(innerBlock, mappedInnerInnerBlocks);
    }
    return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)(name, attributes, mappedInnerInnerBlocks);
  });
  return mappedInnerBlocks;
};
const replaceProductsBlock = clientId => {
  const productsBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getBlock(clientId);
  const canBeInserted = (0,_migration_utils__WEBPACK_IMPORTED_MODULE_3__.checkIfBlockCanBeInserted)(clientId, 'woocommerce/product-collection');
  if (productsBlock && canBeInserted) {
    const {
      attributes = {},
      innerBlocks = []
    } = productsBlock;
    const displayLayout = getLayoutAttribute(attributes, innerBlocks);
    const adjustedAttributes = mapAttributes({
      ...attributes,
      displayLayout
    });
    const adjustedInnerBlocks = mapInnerBlocks(innerBlocks);
    const productCollectionBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('woocommerce/product-collection', adjustedAttributes, adjustedInnerBlocks);
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/block-editor').replaceBlock(clientId, productCollectionBlock);
    return true;
  }
  return false;
};
const replaceProductsBlocks = productsBlockClientIds => {
  const results = productsBlockClientIds.map(replaceProductsBlock);
  return !!results.length && results.every(result => !!result);
};
const replaceProductsWithProductCollection = () => {
  const queryBlocksCount = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getGlobalBlockCount('core/query');
  if (queryBlocksCount === 0) {
    return;
  }
  const blocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getBlocks();
  const productsBlockClientIds = (0,_migration_utils__WEBPACK_IMPORTED_MODULE_3__.getProductsBlockClientIds)(blocks);
  const productsBlocksCount = productsBlockClientIds.length;
  if (productsBlocksCount === 0) {
    return;
  }
  replaceProductsBlocks(productsBlockClientIds);
};
const manualUpdate = () => {
  (0,_migration_utils__WEBPACK_IMPORTED_MODULE_3__.setUpgradeStatus)((0,_constants__WEBPACK_IMPORTED_MODULE_2__.getInitialStatusLSValue)());
  replaceProductsWithProductCollection();
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-utils.ts":
/*!****************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/migration-utils.ts ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkIfBlockCanBeInserted: () => (/* binding */ checkIfBlockCanBeInserted),
/* harmony export */   getProductCollectionBlockClientIds: () => (/* binding */ getProductCollectionBlockClientIds),
/* harmony export */   getProductsBlockClientIds: () => (/* binding */ getProductsBlockClientIds),
/* harmony export */   getUpgradeStatus: () => (/* binding */ getUpgradeStatus),
/* harmony export */   incrementUpgradeStatusDisplayCount: () => (/* binding */ incrementUpgradeStatusDisplayCount),
/* harmony export */   postTemplateHasSupportForGridView: () => (/* binding */ postTemplateHasSupportForGridView),
/* harmony export */   setUpgradeStatus: () => (/* binding */ setUpgradeStatus)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/constants.ts");
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */

const isProductsBlock = block => block.name === 'core/query' && block.attributes.namespace === 'woocommerce/product-query';
const isConvertedProductCollectionBlock = block => block.name === 'woocommerce/product-collection' && block.attributes.convertedFromProducts;
const getBlockClientIdsByPredicate = (blocks, predicate) => {
  let clientIds = [];
  blocks.forEach(block => {
    if (predicate(block)) {
      clientIds = [...clientIds, block.clientId];
    }
    clientIds = [...clientIds, ...getBlockClientIdsByPredicate(block.innerBlocks, predicate)];
  });
  return clientIds;
};
const getProductsBlockClientIds = blocks => getBlockClientIdsByPredicate(blocks, isProductsBlock);
const getProductCollectionBlockClientIds = blocks => getBlockClientIdsByPredicate(blocks, isConvertedProductCollectionBlock);
const checkIfBlockCanBeInserted = (clientId, blockToBeInserted) => {
  // We need to duplicate checks that are happening within replaceBlocks method
  // as replacement is initially blocked and there's no information returned
  // that would determine if replacement happened or not.
  // https://github.com/WordPress/gutenberg/issues/46740
  const rootClientId = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').getBlockRootClientId(clientId) || undefined;
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/block-editor').canInsertBlockType(blockToBeInserted, rootClientId);
};
const postTemplateHasSupportForGridView = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('postTemplateHasSupportForGridView', false, _woocommerce_types__WEBPACK_IMPORTED_MODULE_2__.isBoolean);
const getUpgradeStatus = () => {
  const status = window.localStorage.getItem(_constants__WEBPACK_IMPORTED_MODULE_3__.MIGRATION_STATUS_LS_KEY);
  return status ? JSON.parse(status) : (0,_constants__WEBPACK_IMPORTED_MODULE_3__.getInitialStatusLSValue)();
};
const setUpgradeStatus = newStatus => {
  window.localStorage.setItem(_constants__WEBPACK_IMPORTED_MODULE_3__.MIGRATION_STATUS_LS_KEY, JSON.stringify(newStatus));
};
const incrementUpgradeStatusDisplayCount = () => {
  const status = getUpgradeStatus();
  const displayCount = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_2__.isNumber)(status.displayCount) ? status.displayCount + 1 : 0;
  setUpgradeStatus({
    ...status,
    displayCount
  });
};


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/types.ts":
/*!******************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/types.ts ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/product-collection/block.json":
/*!**********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/product-collection/block.json ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"woocommerce/product-collection","title":"Product Collection","description":"Display a collection of products from your store.","category":"woocommerce","keywords":["WooCommerce","Products (Beta)","all products","by attribute","by category","by tag"],"textdomain":"woocommerce","attributes":{"queryId":{"type":"number"},"query":{"type":"object"},"tagName":{"type":"string"},"displayLayout":{"type":"object"},"dimensions":{"type":"object"},"convertedFromProducts":{"type":"boolean","default":false},"collection":{"type":"string"},"hideControls":{"default":[],"type":"array"},"queryContextIncludes":{"type":"array"},"forcePageReload":{"type":"boolean","default":false},"__privatePreviewState":{"type":"object"}},"providesContext":{"queryId":"queryId","query":"query","displayLayout":"displayLayout","dimensions":"dimensions","queryContextIncludes":"queryContextIncludes","collection":"collection","__privateProductCollectionPreviewState":"__privatePreviewState"},"usesContext":["templateSlug","postId"],"supports":{"align":["wide","full"],"anchor":true,"html":false,"__experimentalLayout":true,"interactivity":true},"editorStyle":"file:../woocommerce/product-collection-editor.css","style":"file:../woocommerce/product-collection-style.css"}');

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/blocks/product-collection/constants.ts":
/*!************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/product-collection/constants.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony export */   nextPreviousArrowsBlockName: () => (/* binding */ nextPreviousArrowsBlockName),
/* harmony export */   paginationDefaultAttributes: () => (/* binding */ paginationDefaultAttributes),
/* harmony export */   productTemplateBlockName: () => (/* binding */ productTemplateBlockName)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/block.json");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts");
/* harmony import */ var _atomic_blocks_product_elements_image_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../atomic/blocks/product-elements/image/types */ "../node_modules/woocommerce-blocks/js/atomic/blocks/product-elements/image/types.ts");
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
const STOCK_STATUS_OPTIONS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('stockStatusOptions', []);
const GLOBAL_HIDE_OUT_OF_STOCK = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('hideOutOfStockItems', false);
const getDefaultStockStatuses = () => {
  return GLOBAL_HIDE_OUT_OF_STOCK ? Object.keys((0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_1__.objectOmit)(STOCK_STATUS_OPTIONS, 'outofstock')) : Object.keys(STOCK_STATUS_OPTIONS);
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
const coreQueryPaginationBlockName = 'core/query-pagination';
const nextPreviousArrowsBlockName = 'woocommerce/product-gallery-large-image-next-previous';
const productTemplateBlockName = 'woocommerce/product-template';

/**
 * Default inner block templates for the product collection block.
 * Exported for use in different collections, e.g., 'New Arrivals' collection.
 */
const INNER_BLOCKS_PRODUCT_TEMPLATE = [productTemplateBlockName, {}, [['woocommerce/product-image', {
  imageSizing: _atomic_blocks_product_elements_image_types__WEBPACK_IMPORTED_MODULE_4__.ImageSizing.THUMBNAIL,
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

/***/ "../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts":
/*!********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "../node_modules/woocommerce-blocks/js/blocks/product-template/utils.tsx":
/*!*******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/blocks/product-template/utils.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocationType: () => (/* binding */ LocationType),
/* harmony export */   parseTemplateSlug: () => (/* binding */ parseTemplateSlug),
/* harmony export */   useGetLocation: () => (/* binding */ useGetLocation),
/* harmony export */   useProductCollectionQueryContext: () => (/* binding */ useProductCollectionQueryContext)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */




let LocationType = /*#__PURE__*/function (LocationType) {
  LocationType["Product"] = "product";
  LocationType["Archive"] = "archive";
  LocationType["Cart"] = "cart";
  LocationType["Order"] = "order";
  LocationType["Site"] = "site";
  return LocationType;
}({});
const templateSlugs = {
  singleProduct: 'single-product',
  productCategory: 'taxonomy-product_cat',
  productTag: 'taxonomy-product_tag',
  productAttribute: 'taxonomy-product_attribute',
  orderConfirmation: 'order-confirmation',
  cart: 'page-cart',
  checkout: 'page-checkout'
};
const getIdFromResponse = resp => resp && resp.length && resp[0]?.id ? resp[0].id : null;
const setEntityId = async (kind, name, slug, stateSetter) => {
  const response = await (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.resolveSelect)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getEntityRecords(kind, name, {
    _fields: ['id'],
    slug
  });
  const entityId = getIdFromResponse(response);
  stateSetter(entityId);
};
const prepareGetEntitySlug = templateSlug => entitySlug => templateSlug.replace(`${entitySlug}-`, '');
const prepareIsInSpecificTemplate = templateSlug => entitySlug => templateSlug.includes(entitySlug) && templateSlug !== entitySlug;
const prepareIsInGenericTemplate = templateSlug => entitySlug => templateSlug === entitySlug;
const createLocationObject = (type, sourceData = {}) => ({
  type,
  sourceData
});
const useGetLocation = (context, clientId) => {
  const templateSlug = context.templateSlug || '';
  const postId = context.postId || null;
  const getEntitySlug = prepareGetEntitySlug(templateSlug);
  const isInSpecificTemplate = prepareIsInSpecificTemplate(templateSlug);

  // Detect Specific Templates
  const isInSpecificProductTemplate = isInSpecificTemplate(templateSlugs.singleProduct);
  const isInSpecificCategoryTemplate = isInSpecificTemplate(templateSlugs.productCategory);
  const isInSpecificTagTemplate = isInSpecificTemplate(templateSlugs.productTag);
  const [productId, setProductId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [categoryId, setCategoryId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [tagId, setTagId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (isInSpecificProductTemplate) {
      const slug = getEntitySlug(templateSlugs.singleProduct);
      setEntityId('postType', 'product', slug, setProductId);
    }
    if (isInSpecificCategoryTemplate) {
      const slug = getEntitySlug(templateSlugs.productCategory);
      setEntityId('taxonomy', 'product_cat', slug, setCategoryId);
    }
    if (isInSpecificTagTemplate) {
      const slug = getEntitySlug(templateSlugs.productTag);
      setEntityId('taxonomy', 'product_tag', slug, setTagId);
    }
  }, [isInSpecificProductTemplate, isInSpecificCategoryTemplate, isInSpecificTagTemplate, getEntitySlug]);
  const {
    isInSingleProductBlock,
    isInSomeCartCheckoutBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore No types for this selector exist yet
    const {
      getBlockParentsByBlockName
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    const isInBlocks = parentBlockNames => getBlockParentsByBlockName(clientId, parentBlockNames).length > 0;
    return {
      isInSingleProductBlock: isInBlocks(['woocommerce/single-product']),
      isInSomeCartCheckoutBlock: isInBlocks(['woocommerce/cart', 'woocommerce/checkout', 'woocommerce/mini-cart-contents'])
    };
  }, [clientId]);

  /**
   * Case 1.1: BLOCK LEVEL: SPECIFIC PRODUCT
   * Single Product block - take product ID from context
   */

  if (isInSingleProductBlock) {
    return createLocationObject(LocationType.Product, {
      productId: postId
    });
  }

  /**
   * Case 1.2: BLOCK LEVEL: GENERIC CART
   * Cart, Checkout or Mini Cart blocks - block scope is more important than template
   */

  if (isInSomeCartCheckoutBlock) {
    return createLocationObject(LocationType.Cart);
  }

  /**
   * Case 2.1: TEMPLATES: SPECIFIC PRODUCT
   * Specific Single Product template - take product ID from taxononmy
   */

  if (isInSpecificProductTemplate) {
    return createLocationObject(LocationType.Product, {
      productId
    });
  }
  const isInGenericTemplate = prepareIsInGenericTemplate(templateSlug);

  /**
   * Case 2.2: TEMPLATES: GENERIC PRODUCT
   * Generic Single Product template
   */

  const isInSingleProductTemplate = isInGenericTemplate(templateSlugs.singleProduct);
  if (isInSingleProductTemplate) {
    return createLocationObject(LocationType.Product, {
      productId: null
    });
  }

  /**
   * Case 2.3: TEMPLATES: SPECIFIC TAXONOMY
   * Specific Category template - take category ID from
   */

  if (isInSpecificCategoryTemplate) {
    return createLocationObject(LocationType.Archive, {
      taxonomy: 'product_cat',
      termId: categoryId
    });
  }

  /**
   * Case 2.4: TEMPLATES: SPECIFIC TAXONOMY
   * Specific Tag template
   */

  if (isInSpecificTagTemplate) {
    return createLocationObject(LocationType.Archive, {
      taxonomy: 'product_tag',
      termId: tagId
    });
  }

  /**
   * Case 2.5: TEMPLATES: GENERIC TAXONOMY
   * Generic Taxonomy template
   */

  const isInProductsByCategoryTemplate = isInGenericTemplate(templateSlugs.productCategory);
  if (isInProductsByCategoryTemplate) {
    return createLocationObject(LocationType.Archive, {
      taxonomy: 'product_cat',
      termId: null
    });
  }
  const isInProductsByTagTemplate = isInGenericTemplate(templateSlugs.productTag);
  if (isInProductsByTagTemplate) {
    return createLocationObject(LocationType.Archive, {
      taxonomy: 'product_tag',
      termId: null
    });
  }
  const isInProductsByAttributeTemplate = isInGenericTemplate(templateSlugs.productAttribute);
  if (isInProductsByAttributeTemplate) {
    return createLocationObject(LocationType.Archive, {
      taxonomy: null,
      termId: null
    });
  }

  /**
   * Case 2.6: TEMPLATES: GENERIC CART
   * Cart/Checkout templates
   */

  const isInCartCheckoutTemplate = templateSlug === templateSlugs.cart || templateSlug === templateSlugs.checkout;
  if (isInCartCheckoutTemplate) {
    return createLocationObject(LocationType.Cart);
  }

  /**
   * Case 2.7: TEMPLATES: GENERIC ORDER
   * Order Confirmation template
   */

  const isInOrderTemplate = isInGenericTemplate(templateSlugs.orderConfirmation);
  if (isInOrderTemplate) {
    return createLocationObject(LocationType.Order);
  }

  /**
   * Case 3: GENERIC
   * All other cases
   */

  return createLocationObject(LocationType.Site);
};

/**
 * In Product Collection block, queryContextIncludes attribute contains
 * list of attribute names that should be included in the query context.
 *
 * This hook returns the query context object based on the attribute names
 * provided in the queryContextIncludes array.
 *
 * Example:
 * {
 * 	clientID = 'd2c7e34f-70d6-417c-b582-f554a3a575f3',
 * 	queryContextIncludes = [ 'collection' ]
 * }
 *
 * The hook will return the following query context object:
 * {
 *  collection: 'woocommerce/product-collection/featured'
 * }
 *
 * @param args                      Arguments for the hook.
 * @param args.clientId             Client ID of the inner block.
 * @param args.queryContextIncludes Array of attribute names to be included in the query context.
 *
 * @return Query context object.
 */
const useProductCollectionQueryContext = ({
  clientId,
  queryContextIncludes
}) => {
  const productCollectionBlockAttributes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getBlockParentsByBlockName,
      getBlockAttributes
    } = select('core/block-editor');
    const parentBlocksClientIds = getBlockParentsByBlockName(clientId, 'woocommerce/product-collection', true);
    if (parentBlocksClientIds?.length) {
      const closestParentClientId = parentBlocksClientIds[0];
      return getBlockAttributes(closestParentClientId);
    }
    return null;
  }, [clientId]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    // If the product collection block is not found, return null.
    if (!productCollectionBlockAttributes) {
      return null;
    }
    const queryContext = {};
    if (queryContextIncludes?.length) {
      queryContextIncludes.forEach(attribute => {
        if (productCollectionBlockAttributes?.[attribute]) {
          queryContext[attribute] = productCollectionBlockAttributes[attribute];
        }
      });
    }
    return queryContext;
  }, [queryContextIncludes, productCollectionBlockAttributes]);
};
const parseTemplateSlug = (rawTemplateSlug = '') => {
  const categoryPrefix = 'category-';
  const productCategoryPrefix = 'taxonomy-product_cat-';
  const productTagPrefix = 'taxonomy-product_tag-';
  if (rawTemplateSlug.startsWith(categoryPrefix)) {
    return {
      taxonomy: 'category',
      slug: rawTemplateSlug.replace(categoryPrefix, '')
    };
  }
  if (rawTemplateSlug.startsWith(productCategoryPrefix)) {
    return {
      taxonomy: 'product_cat',
      slug: rawTemplateSlug.replace(productCategoryPrefix, '')
    };
  }
  if (rawTemplateSlug.startsWith(productTagPrefix)) {
    return {
      taxonomy: 'product_tag',
      slug: rawTemplateSlug.replace(productTagPrefix, '')
    };
  }
  return {
    taxonomy: '',
    slug: ''
  };
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/data/payment/constants.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/data/payment/constants.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STATUS: () => (/* binding */ STATUS),
/* harmony export */   STORE_KEY: () => (/* binding */ STORE_KEY)
/* harmony export */ });
const STORE_KEY = 'wc/store/payment';
let STATUS = /*#__PURE__*/function (STATUS) {
  STATUS["IDLE"] = "idle";
  STATUS["EXPRESS_STARTED"] = "express_started";
  STATUS["PROCESSING"] = "processing";
  STATUS["READY"] = "ready";
  STATUS["ERROR"] = "has_error";
  return STATUS;
}({});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/feedback-icon.tsx":
/*!*****************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/feedback-icon.tsx ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * External dependencies
 */


const FeedbackIcon = ({
  size = 12
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  width: size,
  height: size,
  viewBox: "0 0 12 12",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.45865 9.08341L1.6665 9.87639L1.6665 1.66675L10.3332 1.66675L10.3332 9.08341L2.45865 9.08341ZM2.87317 10.0834L10.6665 10.0834C11.0347 10.0834 11.3332 9.78494 11.3332 9.41675L11.3332 1.33342C11.3332 0.965226 11.0347 0.666748 10.6665 0.666748H1.33317C0.964982 0.666748 0.666504 0.965225 0.666504 1.33341V11.0166C0.666504 11.2116 0.773993 11.3907 0.946074 11.4825C1.15124 11.5919 1.40385 11.5543 1.56818 11.3898L2.87317 10.0834ZM8.6665 4.66673H3.33317V3.66673H8.6665V4.66673ZM3.33317 7.33339H6.6665V6.33339H3.33317V7.33339Z",
    fill: "currentColor"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FeedbackIcon);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/index.tsx":
/*!*********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/index.tsx ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CesFeedbackButton: () => (/* binding */ CesFeedbackButton)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/customer-effort-score'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _feedback_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./feedback-icon */ "../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/feedback-icon.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * External dependencies
 */





/**
 * Internal dependencies
 */


const CesFeedbackButton = ({
  blockName,
  title = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Share your experience', 'woocommerce'),
  firstQuestion = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s is the block name. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('It was easy for me to accomplish what I wanted with the %s.', 'woocommerce'), blockName),
  feedbackLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s is the block name. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('How can we improve the %s block for you? (Optional)', 'woocommerce'), blockName),
  feedbackPlaceholder = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("What did you try to build using this block? What did and didn't work?", 'woocommerce'),
  emailLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Email address (Optional)', 'woocommerce'),
  emailHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Share if you would like to discuss your experience or participate in future research.', 'woocommerce'),
  buttonText = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Help us improve', 'woocommerce'),
  submitLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("🙏🏻 Thanks for sharing — we're on it!", 'woocommerce'),
  wrapper: Wrapper,
  wrapperProps = {}
}) => {
  const {
    showCesModal
  } = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/customer-effort-score'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
  if (!window.wcTracks?.isEnabled) {
    return null;
  }
  const handleFeedbackClick = () => {
    showCesModal({
      action: `${blockName.toLowerCase().replace(/\s+/g, '_')}_block_feedback`,
      title,
      firstQuestion,
      showDescription: false,
      onsubmitLabel: submitLabel,
      getExtraFieldsToBeShown: (extraFieldsValues, setExtraFieldsValues, errors) => {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
            label: feedbackLabel,
            value: extraFieldsValues.feedback_comment || '',
            onChange: value => setExtraFieldsValues({
              ...extraFieldsValues,
              feedback_comment: value
            }),
            placeholder: feedbackPlaceholder
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: emailLabel,
            type: "email",
            value: extraFieldsValues.email || '',
            onChange: value => setExtraFieldsValues({
              ...extraFieldsValues,
              email: value
            }),
            help: errors?.email ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "woocommerce-customer-effort-score__errors",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                children: errors.email
              })
            }) : emailHelp
          })]
        });
      },
      validateExtraFields: ({
        email = ''
      }) => {
        const errors = {};
        if (email.length > 0 && !(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.isEmail)(email)) {
          errors.email = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please enter a valid email address.', 'woocommerce');
        }
        return errors;
      }
    }, {
      blockName,
      shouldShowComments: () => false
    }, {}, {});
  };
  const feedbackButtonWithModal = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/customer-effort-score'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "tertiary",
      icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_feedback_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {}),
      iconSize: 12,
      onClick: handleFeedbackClick,
      className: "wc-block-editor__feedback-button",
      children: buttonText
    })]
  });
  if (Wrapper) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Wrapper, {
      ...wrapperProps,
      children: feedbackButtonWithModal
    });
  }
  return feedbackButtonWithModal;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/error-placeholder/error-message.tsx":
/*!***************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/error-placeholder/error-message.tsx ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_escape_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/escape-html */ "@wordpress/escape-html");
/* harmony import */ var _wordpress_escape_html__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */

const getErrorMessage = ({
  message,
  type
}) => {
  if (!message) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An error has prevented the block from being updated.', 'woocommerce');
  }
  if (type === 'general') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The following error was returned', 'woocommerce'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("code", {
        children: (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_1__.escapeHTML)(message)
      })]
    });
  }
  if (type === 'api') {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The following error was returned from the API', 'woocommerce'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("br", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("code", {
        children: (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_1__.escapeHTML)(message)
      })]
    });
  }
  return message;
};
const ErrorMessage = ({
  error
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
  className: "wc-block-error-message",
  children: getErrorMessage(error)
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorMessage);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/expandable-search-list-item/expandable-search-list-item.tsx":
/*!***************************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/expandable-search-list-item/expandable-search-list-item.tsx ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/editor-components/search-list-control */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/index.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * External dependencies
 */





const ExpandableSearchListItem = ({
  className,
  item,
  isSelected,
  isLoading,
  onSelect,
  disabled,
  ...rest
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_3__.createElement)(_woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_1__.SearchListItem, {
      ...rest,
      key: item.id,
      className: className,
      isSelected: isSelected,
      item: item,
      onSelect: onSelect,
      disabled: disabled
    }), isSelected && isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('woocommerce-search-list__item', 'woocommerce-product-attributes__item', 'depth-1', 'is-loading', 'is-not-active'),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Spinner, {})
    }, "loading")]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExpandableSearchListItem);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/index.tsx":
/*!********************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/index.tsx ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/editor-components/search-list-control */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/index.ts");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-context/hooks/use-product-attributes'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_editor_components_error_placeholder_error_message__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @woocommerce/editor-components/error-placeholder/error-message */ "../node_modules/woocommerce-blocks/js/editor-components/error-placeholder/error-message.tsx");
/* harmony import */ var _woocommerce_editor_components_expandable_search_list_item_expandable_search_list_item__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @woocommerce/editor-components/expandable-search-list-item/expandable-search-list-item */ "../node_modules/woocommerce-blocks/js/editor-components/expandable-search-list-item/expandable-search-list-item.tsx");
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./style.scss */ "../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * External dependencies
 */










/**
 * Internal dependencies
 */


const ProductAttributeTermControl = ({
  onChange,
  onOperatorChange,
  instanceId,
  isCompact = false,
  messages = {},
  operator = 'any',
  selected,
  type = 'text'
}) => {
  const {
    errorLoadingAttributes,
    isLoadingAttributes,
    productsAttributes
  } = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/base-context/hooks/use-product-attributes'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(true);
  const renderItem = args => {
    const {
      item,
      search,
      depth = 0
    } = args;
    const count = item.count || 0;
    const classes = ['woocommerce-product-attributes__item', 'woocommerce-search-list__item', {
      'is-searching': search.length > 0,
      'is-skip-level': depth === 0 && item.parent !== 0
    }];
    if (!item.breadcrumbs.length) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_expandable_search_list_item_expandable_search_list_item__WEBPACK_IMPORTED_MODULE_6__["default"], {
        ...args,
        className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(classes),
        item: item,
        isLoading: isLoadingAttributes,
        disabled: item.count === 0,
        name: `attributes-${instanceId}`,
        countLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d is the count of terms. */
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%d term', '%d terms', count, 'woocommerce'), count),
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$s is the item name, %2$d is the count of terms for the item. */
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%1$s, has %2$d term', '%1$s, has %2$d terms', count, 'woocommerce'), item.name, count)
      });
    }
    const itemName = `${item.breadcrumbs[0]}: ${item.name}`;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__.SearchListItem, {
      ...args,
      name: `terms-${instanceId}`,
      className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(...classes, 'has-count'),
      countLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d is the count of products. */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%d product', '%d products', count, 'woocommerce'), count),
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$s is the attribute name, %2$d is the count of products for that attribute. */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%1$s, has %2$d product', '%1$s, has %2$d products', count, 'woocommerce'), itemName, count)
    });
  };
  const list = productsAttributes.reduce((acc, curr) => {
    const {
      terms,
      ...props
    } = curr;
    return [...acc, (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_7__.convertAttributeObjectToSearchItem)(props), ...terms.map(_woocommerce_utils__WEBPACK_IMPORTED_MODULE_7__.convertAttributeObjectToSearchItem)];
  }, []);
  messages = {
    clear: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Clear all product attributes', 'woocommerce'),
    noItems: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Your store doesn't have any product attributes.", 'woocommerce'),
    search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search for product attributes', 'woocommerce'),
    selected: n => (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d is the count of attributes selected. */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%d attribute selected', '%d attributes selected', n, 'woocommerce'), n),
    updated: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Product attribute search results updated.', 'woocommerce'),
    ...messages
  };
  if (errorLoadingAttributes) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_error_placeholder_error_message__WEBPACK_IMPORTED_MODULE_5__["default"], {
      error: errorLoadingAttributes
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__.SearchListControl, {
      className: "woocommerce-product-attributes",
      isCompact: isCompact,
      isHierarchical: true,
      isLoading: isLoadingAttributes,
      isSingle: false,
      list: list,
      messages: messages,
      onChange: onChange,
      renderItem: renderItem,
      selected: selected.map(({
        id
      }) => list.find(term => term.id === id)).filter(Boolean),
      type: type
    }), !!onOperatorChange && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      hidden: selected.length < 2,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
        className: "woocommerce-product-attributes__operator",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display products matching', 'woocommerce'),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pick at least two attributes to use this setting.', 'woocommerce'),
        value: operator,
        onChange: onOperatorChange,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Any selected attributes', 'woocommerce'),
          value: 'any'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All selected attributes', 'woocommerce'),
          value: 'all'
        }]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.withInstanceId)(ProductAttributeTermControl));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/style.scss":
/*!*********************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/style.scss ***!
  \*********************************************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined mixin.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m         \u001b[31m@include visually-hidden\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m        ^^^^^^^^^^^^^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-attribute-term-control\\style.scss 3:3  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined mixin.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m         \u001b[31m@include visually-hidden\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m        ^^^^^^^^^^^^^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-attribute-term-control\\style.scss 3:3  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-attribute-term-control\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-attribute-term-control\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined mixin.\\n\\u001b[34m  ╷\\u001b[0m\\n\\u001b[34m3 │\\u001b[0m         \\u001b[31m@include visually-hidden\\u001b[0m;\\n\\u001b[34m  │\\u001b[0m \\u001b[31m        ^^^^^^^^^^^^^^^^^^^^^^^^\\u001b[0m\\n\\u001b[34m  ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\editor-components\\\\product-attribute-term-control\\\\style.scss 3:3  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/product-control/index.tsx":
/*!*****************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/product-control/index.tsx ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/editor-components/search-list-control */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/index.ts");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-hocs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
/* harmony import */ var _woocommerce_editor_components_error_placeholder_error_message__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @woocommerce/editor-components/error-placeholder/error-message */ "../node_modules/woocommerce-blocks/js/editor-components/error-placeholder/error-message.tsx");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_editor_components_expandable_search_list_item_expandable_search_list_item__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @woocommerce/editor-components/expandable-search-list-item/expandable-search-list-item */ "../node_modules/woocommerce-blocks/js/editor-components/expandable-search-list-item/expandable-search-list-item.tsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./style.scss */ "../node_modules/woocommerce-blocks/js/editor-components/product-control/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * External dependencies
 */










/**
 * Internal dependencies
 */


const messages = {
  list: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products', 'woocommerce'),
  noItems: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Your store doesn't have any products.", 'woocommerce'),
  search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search for a product to display', 'woocommerce'),
  updated: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Product search results updated.', 'woocommerce')
};
const ProductControl = props => {
  const {
    expandedProduct = null,
    error,
    instanceId,
    isCompact = false,
    isLoading,
    onChange,
    onSearch,
    products,
    renderItem,
    selected = [],
    showVariations = false,
    variations,
    variationsLoading
  } = props;
  const renderItemWithVariations = args => {
    const {
      item,
      search,
      depth = 0,
      isSelected,
      onSelect
    } = args;
    const variationsCount = item.details?.variations && Array.isArray(item.details.variations) ? item.details.variations.length : 0;
    const classes = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('woocommerce-search-product__item', 'woocommerce-search-list__item', `depth-${depth}`, 'has-count', {
      'is-searching': search.length > 0,
      'is-skip-level': depth === 0 && item.parent !== 0,
      'is-variable': variationsCount > 0
    });

    // Top level items custom rendering based on SearchListItem.
    if (!item.breadcrumbs.length) {
      const hasVariations = item.details?.variations && item.details.variations.length > 0;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_expandable_search_list_item_expandable_search_list_item__WEBPACK_IMPORTED_MODULE_7__["default"], {
        ...args,
        className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(classes, {
          'is-selected': isSelected
        }),
        isSelected: isSelected,
        item: item,
        onSelect: () => {
          return () => {
            onSelect(item)();
          };
        },
        isLoading: isLoading || variationsLoading,
        countLabel: hasVariations ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$d is the number of variations of a product product. */
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('%1$d variations', 'woocommerce'), item.details?.variations.length) : null,
        name: `products-${instanceId}`,
        "aria-label": hasVariations ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s is the product name, %2$d is the number of variations of that product. */
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('%1$s, has %2$d variation', '%1$s, has %2$d variations', item.details?.variations?.length, 'woocommerce'), item.name, item.details?.variations.length) : undefined
      });
    }
    const itemArgs = (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isEmpty)(item.details?.variation) ? args : {
      ...args,
      item: {
        ...args.item,
        name: item.details?.variation
      },
      'aria-label': `${item.breadcrumbs[0]}: ${item.details?.variation}`
    };
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__.SearchListItem, {
      ...itemArgs,
      className: classes,
      name: `variations-${instanceId}`
    });
  };
  const getRenderItemFunc = () => {
    if (renderItem) {
      return renderItem;
    } else if (showVariations) {
      return renderItemWithVariations;
    }
    return undefined;
  };
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_error_placeholder_error_message__WEBPACK_IMPORTED_MODULE_6__["default"], {
      error: error
    });
  }
  const currentVariations = variations && expandedProduct && variations[expandedProduct] ? variations[expandedProduct] : [];
  const currentList = [...products, ...currentVariations].map(_woocommerce_utils__WEBPACK_IMPORTED_MODULE_5__.convertProductResponseItemToSearchItem);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_woocommerce_editor_components_search_list_control__WEBPACK_IMPORTED_MODULE_2__.SearchListControl, {
    className: "woocommerce-products",
    list: currentList,
    isCompact: isCompact,
    isLoading: isLoading,
    isSingle: true,
    selected: currentList.filter(({
      id
    }) => selected.includes(Number(id))),
    onChange: onChange,
    renderItem: getRenderItemFunc(),
    onSearch: onSearch,
    messages: {
      ...messages,
      ...props.messages
    },
    isHierarchical: true
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-hocs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-hocs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/block-hocs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())((0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.withInstanceId)(ProductControl)))));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/product-control/style.scss":
/*!******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/product-control/style.scss ***!
  \******************************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m19 │\u001b[0m             background: \u001b[31m$white\u001b[0m;\n\u001b[34m   │\u001b[0m \u001b[31m                        ^^^^^^\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-control\\style.scss 19:16  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m19 │\u001b[0m             background: \u001b[31m$white\u001b[0m;\n\u001b[34m   │\u001b[0m \u001b[31m                        ^^^^^^\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-control\\style.scss 19:16  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-control\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\product-control\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined variable.\\n\\u001b[34m   ╷\\u001b[0m\\n\\u001b[34m19 │\\u001b[0m             background: \\u001b[31m$white\\u001b[0m;\\n\\u001b[34m   │\\u001b[0m \\u001b[31m                        ^^^^^^\\u001b[0m\\n\\u001b[34m   ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\editor-components\\\\product-control\\\\style.scss 19:16  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/index.ts":
/*!********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/search-list-control/index.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchListControl: () => (/* reexport safe */ _search_list_control__WEBPACK_IMPORTED_MODULE_0__.SearchListControl),
/* harmony export */   SearchListItem: () => (/* reexport safe */ _item__WEBPACK_IMPORTED_MODULE_1__.SearchListItem)
/* harmony export */ });
/* harmony import */ var _search_list_control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search-list-control */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/search-list-control.tsx");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./item */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/item.tsx");



/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/item.tsx":
/*!********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/search-list-control/item.tsx ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchListItem: () => (/* binding */ SearchListItem),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */






/**
 * Internal dependencies
 */



const Count = ({
  label
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "woocommerce-search-list__item-count",
    children: label
  });
};
const ItemLabel = props => {
  const {
    item,
    search
  } = props;
  const hasBreadcrumbs = item.breadcrumbs && item.breadcrumbs.length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
    className: "woocommerce-search-list__item-label",
    children: [hasBreadcrumbs ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
      className: "woocommerce-search-list__item-prefix",
      children: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getBreadcrumbsForDisplay)(item.breadcrumbs)
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
      className: "woocommerce-search-list__item-name",
      children: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getHighlightedName)((0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(item.name), search)
    })]
  });
};
const SearchListItem = ({
  countLabel,
  className,
  depth = 0,
  controlId = '',
  item,
  isSelected,
  isSingle,
  onSelect,
  search = '',
  selected,
  useExpandedPanelId,
  ...props
}) => {
  const [expandedPanelId, setExpandedPanelId] = useExpandedPanelId;
  const showCount = countLabel !== undefined && countLabel !== null && item.count !== undefined && item.count !== null;
  const hasBreadcrumbs = !!item.breadcrumbs?.length;
  const hasChildren = !!item.children?.length;
  const isExpanded = expandedPanelId === item.id;
  const classes = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(['woocommerce-search-list__item', `depth-${depth}`, className], {
    'has-breadcrumbs': hasBreadcrumbs,
    'has-children': hasChildren,
    'has-count': showCount,
    'is-expanded': isExpanded,
    'is-radio-button': isSingle
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (hasChildren && isSelected) {
      setExpandedPanelId(item.id);
    }
  }, [item, hasChildren, isSelected, setExpandedPanelId]);
  const name = props.name || `search-list-item-${controlId}`;
  const id = `${name}-${item.id}`;
  const togglePanel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    setExpandedPanelId(isExpanded ? -1 : Number(item.id));
  }, [isExpanded, item.id, setExpandedPanelId]);
  return hasChildren ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: classes,
    onClick: togglePanel,
    onKeyDown: e => e.key === 'Enter' || e.key === ' ' ? togglePanel() : null,
    role: "treeitem",
    tabIndex: 0,
    children: isSingle ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
        type: "radio",
        id: id,
        name: name,
        value: item.value,
        onChange: onSelect(item),
        onClick: e => e.stopPropagation(),
        checked: isSelected,
        className: "woocommerce-search-list__item-input",
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(ItemLabel, {
        item: item,
        search: search
      }), showCount ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Count, {
        label: countLabel || item.count
      }) : null]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
        className: "woocommerce-search-list__item-input",
        checked: isSelected,
        ...(!isSelected &&
        // We know that `item.children` is not `undefined` because
        // we are here only if `hasChildren` is `true`.
        item.children.some(child => selected.find(selectedItem => selectedItem.id === child.id)) ? {
          indeterminate: true
        } : {}),
        label: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getHighlightedName)((0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(item.name), search),
        onChange: () => {
          if (isSelected) {
            onSelect((0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_3__.arrayDifferenceBy)(selected, item.children, 'id'))();
          } else {
            onSelect((0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_3__.arrayUnionBy)(selected, item.children, 'id'))();
          }
        },
        onClick: e => e.stopPropagation()
      }), showCount ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Count, {
        label: countLabel || item.count
      }) : null]
    })
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("label", {
    htmlFor: id,
    className: classes,
    children: [isSingle ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
        ...props,
        type: "radio",
        id: id,
        name: name,
        value: item.value,
        onChange: onSelect(item),
        checked: isSelected,
        className: "woocommerce-search-list__item-input"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(ItemLabel, {
        item: item,
        search: search
      })]
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
      ...props,
      id: id,
      name: name,
      className: "woocommerce-search-list__item-input",
      value: (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(item.value),
      label: (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getHighlightedName)((0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(item.name), search),
      onChange: onSelect(item),
      checked: isSelected
    }), showCount ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Count, {
      label: countLabel || item.count
    }) : null]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SearchListItem);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/search-list-control.tsx":
/*!***********************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/search-list-control/search-list-control.tsx ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SearchListControl: () => (/* binding */ SearchListControl),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/utils.tsx");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./item */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/item.tsx");
/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../tag */ "../node_modules/woocommerce-blocks/js/editor-components/tag/index.tsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./style.scss */ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * External dependencies
 */







/**
 * Internal dependencies
 */





const defaultRenderListItem = args => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_item__WEBPACK_IMPORTED_MODULE_6__["default"], {
    ...args
  });
};
const ListItems = props => {
  const {
    list,
    selected,
    renderItem,
    depth = 0,
    onSelect,
    instanceId,
    isSingle,
    search,
    useExpandedPanelId
  } = props;
  const [expandedPanelId] = useExpandedPanelId;
  if (!list) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: list.map(item => {
      const isSelected = item.children?.length && !isSingle ? item.children.every(({
        id
      }) => selected.find(selectedItem => selectedItem.id === id)) : !!selected.find(({
        id
      }) => id === item.id);
      const isExpanded = item.children?.length && expandedPanelId === item.id;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
          children: renderItem({
            item,
            isSelected,
            onSelect,
            isSingle,
            selected,
            search,
            depth,
            useExpandedPanelId,
            controlId: instanceId
          })
        }), isExpanded ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(ListItems, {
          ...props,
          list: item.children,
          depth: depth + 1
        }) : null]
      }, item.id);
    })
  });
};
const SelectedListItems = ({
  isLoading,
  isSingle,
  selected,
  messages,
  onChange,
  onRemove
}) => {
  if (isLoading || isSingle || !selected) {
    return null;
  }
  const selectedCount = selected.length;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "woocommerce-search-list__selected",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "woocommerce-search-list__selected-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
        children: messages.selected(selectedCount)
      }), selectedCount > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "link",
        isDestructive: true,
        onClick: () => onChange([]),
        "aria-label": messages.clear,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear all', 'woocommerce')
      }) : null]
    }), selectedCount > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
      children: selected.map((item, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_tag__WEBPACK_IMPORTED_MODULE_7__["default"], {
          label: item.name,
          id: item.id,
          remove: onRemove
        })
      }, i))
    }) : null]
  });
};
const ListItemsContainer = ({
  filteredList,
  search,
  onSelect,
  instanceId,
  useExpandedPanelId,
  ...props
}) => {
  const {
    messages,
    renderItem,
    selected,
    isSingle
  } = props;
  const renderItemCallback = renderItem || defaultRenderListItem;
  if (filteredList.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "woocommerce-search-list__list is-not-found",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "woocommerce-search-list__not-found-icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
          icon: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
          role: "img"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: "woocommerce-search-list__not-found-text",
        children: search ?
        // eslint-disable-next-line @wordpress/valid-sprintf
        (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(messages.noResults, search) : messages.noItems
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("ul", {
    className: "woocommerce-search-list__list",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(ListItems, {
      useExpandedPanelId: useExpandedPanelId,
      list: filteredList,
      selected: selected,
      renderItem: renderItemCallback,
      onSelect: onSelect,
      instanceId: instanceId,
      isSingle: isSingle,
      search: search
    })
  });
};

/**
 * Component to display a searchable, selectable list of items.
 */
const SearchListControl = props => {
  const {
    className = '',
    isCompact,
    isHierarchical,
    isLoading,
    isSingle,
    list,
    messages: customMessages = _utils__WEBPACK_IMPORTED_MODULE_5__.defaultMessages,
    onChange,
    onSearch,
    selected,
    type = 'text',
    debouncedSpeak
  } = props;
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const useExpandedPanelId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(-1);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useInstanceId)(SearchListControl);
  const messages = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    ..._utils__WEBPACK_IMPORTED_MODULE_5__.defaultMessages,
    ...customMessages
  }), [customMessages]);
  const filteredList = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getFilteredList)(list, search, isHierarchical);
  }, [list, search, isHierarchical]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (debouncedSpeak) {
      debouncedSpeak(messages.updated);
    }
  }, [debouncedSpeak, messages]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (typeof onSearch === 'function') {
      onSearch(search);
    }
  }, [search, onSearch]);
  const onRemove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(itemId => () => {
    if (isSingle) {
      onChange([]);
    }
    const i = selected.findIndex(({
      id: selectedId
    }) => selectedId === itemId);
    onChange([...selected.slice(0, i), ...selected.slice(i + 1)]);
  }, [isSingle, selected, onChange]);
  const onSelect = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(item => () => {
    if (Array.isArray(item)) {
      onChange(item);
      return;
    }
    if (selected.findIndex(({
      id
    }) => id === item.id) !== -1) {
      onRemove(item.id)();
      return;
    }
    if (isSingle) {
      onChange([item]);
    } else {
      onChange([...selected, item]);
    }
  }, [isSingle, onRemove, onChange, selected]);
  const onRemoveToken = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(tokens => {
    const [removedItem] = selected.filter(item => !tokens.find(token => item.id === token.id));
    onRemove(removedItem.id)();
  }, [onRemove, selected]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('woocommerce-search-list', className, {
      'is-compact': isCompact,
      'is-loading': isLoading,
      'is-token': type === 'token'
    }),
    children: [type === 'text' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(SelectedListItems, {
      ...props,
      onRemove: onRemove,
      messages: messages
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "woocommerce-search-list__search",
      children: type === 'text' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: messages.search,
        type: "search",
        value: search,
        onChange: value => setSearch(value)
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormTokenField, {
        disabled: isLoading,
        label: messages.search,
        onChange: onRemoveToken,
        onInputChange: value => setSearch(value),
        suggestions: []
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Ignoring because `__experimentalValidateInput` is not yet in the type definitions.
        ,
        __experimentalValidateInput: () => false,
        value: isLoading ? [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading…', 'woocommerce')] : selected.map(token => ({
          ...token,
          value: token.name
        })),
        __experimentalShowHowTo: false
      })
    }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "woocommerce-search-list__list",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {})
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(ListItemsContainer, {
      ...props,
      search: search,
      filteredList: filteredList,
      messages: messages,
      onSelect: onSelect,
      instanceId: instanceId,
      useExpandedPanelId: useExpandedPanelId
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.withSpokenMessages)(SearchListControl));

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/style.scss":
/*!**********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/search-list-control/style.scss ***!
  \**********************************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m     padding: 0 0 \u001b[31m$gap\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m                 ^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\search-list-control\\style.scss 3:15  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m3 │\u001b[0m     padding: 0 0 \u001b[31m$gap\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m                 ^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\search-list-control\\style.scss 3:15  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\search-list-control\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\search-list-control\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined variable.\\n\\u001b[34m  ╷\\u001b[0m\\n\\u001b[34m3 │\\u001b[0m     padding: 0 0 \\u001b[31m$gap\\u001b[0m;\\n\\u001b[34m  │\\u001b[0m \\u001b[31m                 ^^^^\\u001b[0m\\n\\u001b[34m  ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\editor-components\\\\search-list-control\\\\style.scss 3:15  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/search-list-control/utils.tsx":
/*!*********************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/search-list-control/utils.tsx ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildTermsTree: () => (/* binding */ buildTermsTree),
/* harmony export */   defaultMessages: () => (/* binding */ defaultMessages),
/* harmony export */   getBreadcrumbsForDisplay: () => (/* binding */ getBreadcrumbsForDisplay),
/* harmony export */   getFilteredList: () => (/* binding */ getFilteredList),
/* harmony export */   getHighlightedName: () => (/* binding */ getHighlightedName)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/base-utils */ "../node_modules/woocommerce-blocks/js/base/utils/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */




/**
 * Internal dependencies
 */

const defaultMessages = {
  clear: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Clear all selected items', 'woocommerce'),
  noItems: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No items found.', 'woocommerce'),
  /* Translators: %s search term */
  noResults: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No results for %s', 'woocommerce'),
  search: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search for items', 'woocommerce'),
  selected: n => (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: Number of items selected from list. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%d item selected', '%d items selected', n, 'woocommerce'), n),
  updated: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search results updated.', 'woocommerce')
};

/**
 * Returns terms in a tree form.
 *
 * @param {Array} filteredList Array of terms, possibly a subset of all terms, in flat format.
 * @param {Array} list         Array of the full list of terms, defaults to the filteredList.
 *
 * @return {Array} Array of terms in tree format.
 */
const buildTermsTree = (filteredList, list = filteredList) => {
  const termsByParent = filteredList.reduce((acc, currentValue) => {
    const key = currentValue.parent || 0;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(currentValue);
    return acc;
  }, {});
  const listById = (0,_woocommerce_base_utils__WEBPACK_IMPORTED_MODULE_2__.keyBy)(list, 'id');
  const builtParents = ['0'];
  const getParentsName = (term = {}) => {
    if (!term.parent) {
      return term.name ? [term.name] : [];
    }
    const parentName = getParentsName(listById[term.parent]);
    return [...parentName, term.name];
  };
  const fillWithChildren = terms => {
    return terms.map(term => {
      const children = termsByParent[term.id];
      builtParents.push('' + term.id);
      return {
        ...term,
        breadcrumbs: getParentsName(listById[term.parent]),
        children: children && children.length ? fillWithChildren(children) : []
      };
    });
  };
  const tree = fillWithChildren(termsByParent['0'] || []);

  // Handle remaining items in termsByParent that have not been built (orphaned).
  Object.entries(termsByParent).forEach(([termId, terms]) => {
    if (!builtParents.includes(termId)) {
      tree.push(...fillWithChildren(terms || []));
    }
  });
  return tree;
};
const getFilteredList = (list, search, isHierarchical) => {
  if (!search) {
    return isHierarchical ? buildTermsTree(list) : list;
  }
  const re = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
  const filteredList = list.map(item => re.test(item.name) ? item : false).filter(Boolean);
  return isHierarchical ? buildTermsTree(filteredList, list) : filteredList;
};
const getHighlightedName = (name, search) => {
  if (!search) {
    return name;
  }
  const re = new RegExp(
  // Escaping.
  `(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'ig');
  const nameParts = name.split(re);
  return nameParts.map((part, i) => {
    return re.test(part) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
      children: part
    }, i) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      children: part
    }, i);
  });
};
const getBreadcrumbsForDisplay = breadcrumbs => {
  if (breadcrumbs.length === 1) {
    return breadcrumbs.slice(0, 1).toString();
  }
  if (breadcrumbs.length === 2) {
    return breadcrumbs.slice(0, 1).toString() + ' › ' + breadcrumbs.slice(-1).toString();
  }
  return breadcrumbs.slice(0, 1).toString() + ' … ' + breadcrumbs.slice(-1).toString();
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/tag/editor.scss":
/*!*******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/tag/editor.scss ***!
  \*******************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m11 │\u001b[0m         background: \u001b[31m$gray-100\u001b[0m;\n\u001b[34m   │\u001b[0m \u001b[31m                    ^^^^^^^^^\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\tag\\editor.scss 11:15  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m11 │\u001b[0m         background: \u001b[31m$gray-100\u001b[0m;\n\u001b[34m   │\u001b[0m \u001b[31m                    ^^^^^^^^^\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\tag\\editor.scss 11:15  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\tag\\editor.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:77:11)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\tag\\editor.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined variable.\\n\\u001b[34m   ╷\\u001b[0m\\n\\u001b[34m11 │\\u001b[0m         background: \\u001b[31m$gray-100\\u001b[0m;\\n\\u001b[34m   │\\u001b[0m \\u001b[31m                    ^^^^^^^^^\\u001b[0m\\n\\u001b[34m   ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\editor-components\\\\tag\\\\editor.scss 11:15  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/tag/index.tsx":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/tag/index.tsx ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "../node_modules/woocommerce-blocks/js/editor-components/tag/editor.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_editor_scss__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * External dependencies
 */








/**
 * Internal dependencies
 */


/**
 * This component can be used to show an item styled as a "tag", optionally with an `X` + "remove"
 * or with a popover that is shown on click.
 */

const Tag = ({
  id,
  label,
  popoverContents,
  remove,
  screenReaderLabel,
  className = ''
}) => {
  const [isVisible, setIsVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useInstanceId)(Tag);
  screenReaderLabel = screenReaderLabel || label;
  if (!label) {
    // A null label probably means something went wrong
    return null;
  }
  label = (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_3__.decodeEntities)(label);
  const classes = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('woocommerce-tag', className, {
    'has-remove': !!remove
  });
  const labelId = `woocommerce-tag__label-${instanceId}`;
  const labelTextNode = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "screen-reader-text",
      children: screenReaderLabel
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      "aria-hidden": "true",
      children: label
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
    className: classes,
    children: [popoverContents ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      className: "woocommerce-tag__text",
      id: labelId,
      onClick: () => setIsVisible(true),
      children: labelTextNode
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "woocommerce-tag__text",
      id: labelId,
      children: labelTextNode
    }), popoverContents && isVisible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Popover, {
      onClose: () => setIsVisible(false),
      children: popoverContents
    }), remove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      className: "woocommerce-tag__remove",
      onClick: remove(id),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(
      // Translators: %s label.
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove %s', 'woocommerce'), label),
      "aria-describedby": labelId,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        icon: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@wordpress/icons'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
        size: 20,
        className: "clear-icon",
        role: "img"
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tag);

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/UpgradeDowngradeNotice.tsx":
/*!*******************************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/UpgradeDowngradeNotice.tsx ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UpgradeDowngradeNotice: () => (/* binding */ UpgradeDowngradeNotice)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */



/**
 * Internal dependencies
 */



function UpgradeDowngradeNotice({
  children,
  className,
  actionLabel,
  onActionClick,
  ...props
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Notice, {
    ...props,
    className: Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('wc-block-editor-components-upgrade-downgrade-notice', className),
    actions: [{
      label: actionLabel,
      onClick: onActionClick,
      noDefaultClasses: true,
      // @ts-expect-error the 'variant' prop does exists.
      variant: 'link'
    }],
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "wc-block-editor-components-upgrade-downgrade-notice__text",
      children: children
    })
  });
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/index.ts":
/*!*************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/index.ts ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UpgradeDowngradeNotice: () => (/* reexport safe */ _UpgradeDowngradeNotice__WEBPACK_IMPORTED_MODULE_0__.UpgradeDowngradeNotice)
/* harmony export */ });
/* harmony import */ var _UpgradeDowngradeNotice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UpgradeDowngradeNotice */ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/UpgradeDowngradeNotice.tsx");


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/style.scss":
/*!***************************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/style.scss ***!
  \***************************************************************************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m5 │\u001b[0m         gap: \u001b[31m$grid-unit-20\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m             ^^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\upgrade-downgrade-notice\\style.scss 5:8  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined variable.\n\u001b[34m  ╷\u001b[0m\n\u001b[34m5 │\u001b[0m         gap: \u001b[31m$grid-unit-20\u001b[0m;\n\u001b[34m  │\u001b[0m \u001b[31m             ^^^^^^^^^^^^^\u001b[0m\n\u001b[34m  ╵\u001b[0m\n  ..\\node_modules\\woocommerce-blocks\\js\\editor-components\\upgrade-downgrade-notice\\style.scss 5:8  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\upgrade-downgrade-notice\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\node_modules\\woocommerce-blocks\\js\\editor-components\\upgrade-downgrade-notice\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined variable.\\n\\u001b[34m  ╷\\u001b[0m\\n\\u001b[34m5 │\\u001b[0m         gap: \\u001b[31m$grid-unit-20\\u001b[0m;\\n\\u001b[34m  │\\u001b[0m \\u001b[31m             ^^^^^^^^^^^^^\\u001b[0m\\n\\u001b[34m  ╵\\u001b[0m\\n  ..\\\\node_modules\\\\woocommerce-blocks\\\\js\\\\editor-components\\\\upgrade-downgrade-notice\\\\style.scss 5:8  root stylesheet\");");

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/editor-components/utils/index.js":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/editor-components/utils/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatTitle: () => (/* binding */ formatTitle),
/* harmony export */   getAttributes: () => (/* binding */ getAttributes),
/* harmony export */   getCategories: () => (/* binding */ getCategories),
/* harmony export */   getCategory: () => (/* binding */ getCategory),
/* harmony export */   getProduct: () => (/* binding */ getProduct),
/* harmony export */   getProductTags: () => (/* binding */ getProductTags),
/* harmony export */   getProductVariations: () => (/* binding */ getProductVariations),
/* harmony export */   getProducts: () => (/* binding */ getProducts),
/* harmony export */   getTerms: () => (/* binding */ getTerms)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/**
 * External dependencies
 */





/**
 * Get product query requests for the Store API.
 *
 * @param {Object}                     request           A query object with the list of selected products and search term.
 * @param {number[]}                   request.selected  Currently selected products.
 * @param {string=}                    request.search    Search string.
 * @param {(Record<string, unknown>)=} request.queryArgs Query args to pass in.
 */
const getProductsRequests = ({
  selected = [],
  search = '',
  queryArgs = {}
}) => {
  const isLargeCatalog = _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_3__.blocksConfig.productCount > 100;
  const defaultArgs = {
    per_page: isLargeCatalog ? 100 : 0,
    catalog_visibility: 'any',
    search,
    orderby: 'title',
    order: 'asc'
  };
  const requests = [(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)('/wc/store/v1/products', {
    ...defaultArgs,
    ...queryArgs
  })];

  // If we have a large catalog, we might not get all selected products in the first page.
  if (isLargeCatalog && selected.length) {
    requests.push((0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)('/wc/store/v1/products', {
      catalog_visibility: 'any',
      include: selected,
      per_page: 0
    }));
  }
  return requests;
};
const uniqBy = (array, iteratee) => {
  const seen = new Map();
  return array.filter(item => {
    const key = iteratee(item);
    if (!seen.has(key)) {
      seen.set(key, item);
      return true;
    }
    return false;
  });
};

/**
 * Get a promise that resolves to a list of products from the Store API.
 *
 * @param {Object}                     request           A query object with the list of selected products and search term.
 * @param {number[]}                   request.selected  Currently selected products.
 * @param {string=}                    request.search    Search string.
 * @param {(Record<string, unknown>)=} request.queryArgs Query args to pass in.
 * @return {Promise<unknown>} Promise resolving to a Product list.
 * @throws Exception if there is an error.
 */
const getProducts = ({
  selected = [],
  search = '',
  queryArgs = {}
}) => {
  const requests = getProductsRequests({
    selected,
    search,
    queryArgs
  });
  return Promise.all(requests.map(path => _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path
  }))).then(data => {
    const flatData = data.flat();
    const products = uniqBy(flatData, item => item.id);
    const list = products.map(product => ({
      ...product,
      parent: 0
    }));
    return list;
  }).catch(e => {
    throw e;
  });
};

/**
 * Get a promise that resolves to a product object from the Store API.
 *
 * @param {number} productId Id of the product to retrieve.
 */
const getProduct = productId => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: `/wc/store/v1/products/${productId}`
  });
};

/**
 * Get a promise that resolves to a list of attribute objects from the Store API.
 */
const getAttributes = () => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: `wc/store/v1/products/attributes`
  });
};

/**
 * Get a promise that resolves to a list of attribute term objects from the Store API.
 *
 * @param {number} attribute Id of the attribute to retrieve terms for.
 */
const getTerms = attribute => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: `wc/store/v1/products/attributes/${attribute}/terms`
  });
};

/**
 * Get product tag query requests for the Store API.
 *
 * @param {Object} request          A query object with the list of selected products and search term.
 * @param {Array}  request.selected Currently selected tags.
 * @param {string} request.search   Search string.
 */
const getProductTagsRequests = ({
  selected = [],
  search
}) => {
  const limitTags = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('limitTags', false);
  const requests = [(0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(`wc/store/v1/products/tags`, {
    per_page: limitTags ? 100 : 0,
    orderby: limitTags ? 'count' : 'name',
    order: limitTags ? 'desc' : 'asc',
    search
  })];

  // If we have a large catalog, we might not get all selected products in the first page.
  if (limitTags && selected.length) {
    requests.push((0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(`wc/store/v1/products/tags`, {
      include: selected
    }));
  }
  return requests;
};

/**
 * Get a promise that resolves to a list of tags from the Store API.
 *
 * @param {Object} props          A query object with the list of selected products and search term.
 * @param {Array}  props.selected
 * @param {string} props.search
 */
const getProductTags = ({
  selected = [],
  search
}) => {
  const requests = getProductTagsRequests({
    selected,
    search
  });
  return Promise.all(requests.map(path => _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path
  }))).then(data => {
    const flatData = data.flat();
    return uniqBy(flatData, item => item.id);
  });
};

/**
 * Get a promise that resolves to a list of category objects from the Store API.
 *
 * @param {Object} queryArgs Query args to pass in.
 */
const getCategories = queryArgs => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(`wc/store/v1/products/categories`, {
      per_page: 0,
      ...queryArgs
    })
  });
};

/**
 * Get a promise that resolves to a category object from the API.
 *
 * @param {number} categoryId Id of the product to retrieve.
 */
const getCategory = categoryId => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: `wc/store/v1/products/categories/${categoryId}`
  });
};

/**
 * Get a promise that resolves to a list of variation objects from the Store API.
 *
 * @param {number} product Product ID.
 */
const getProductVariations = product => {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
    path: (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(`wc/store/v1/products`, {
      per_page: 0,
      type: 'variation',
      parent: product
    })
  });
};

/**
 * Given a page object and an array of page, format the title.
 *
 * @param {Object} page           Page object.
 * @param {Object} page.title     Page title object.
 * @param {string} page.title.raw Page title.
 * @param {string} page.slug      Page slug.
 * @param {Array}  pages          Array of all pages.
 * @return {string}                Formatted page title to display.
 */
const formatTitle = (page, pages) => {
  if (!page.title.raw) {
    return page.slug;
  }
  const isUnique = pages.filter(p => p.title.raw === page.title.raw).length === 1;
  return page.title.raw + (!isUnique ? ` - ${page.slug}` : '');
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/settings/blocks/constants.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/settings/blocks/constants.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADDRESS_FORM_FIELDS: () => (/* binding */ ADDRESS_FORM_FIELDS),
/* harmony export */   ADDRESS_FORM_KEYS: () => (/* binding */ ADDRESS_FORM_KEYS),
/* harmony export */   ALLOWED_COUNTRIES: () => (/* binding */ ALLOWED_COUNTRIES),
/* harmony export */   CART_PAGE_ID: () => (/* binding */ CART_PAGE_ID),
/* harmony export */   CART_URL: () => (/* binding */ CART_URL),
/* harmony export */   CHECKOUT_PAGE_ID: () => (/* binding */ CHECKOUT_PAGE_ID),
/* harmony export */   CHECKOUT_URL: () => (/* binding */ CHECKOUT_URL),
/* harmony export */   CONTACT_FORM_FIELDS: () => (/* binding */ CONTACT_FORM_FIELDS),
/* harmony export */   CONTACT_FORM_KEYS: () => (/* binding */ CONTACT_FORM_KEYS),
/* harmony export */   COUNTRIES: () => (/* binding */ COUNTRIES),
/* harmony export */   COUNTRY_LOCALE: () => (/* binding */ COUNTRY_LOCALE),
/* harmony export */   LOCAL_PICKUP_ENABLED: () => (/* binding */ LOCAL_PICKUP_ENABLED),
/* harmony export */   LOGIN_URL: () => (/* binding */ LOGIN_URL),
/* harmony export */   ORDER_FORM_FIELDS: () => (/* binding */ ORDER_FORM_FIELDS),
/* harmony export */   ORDER_FORM_KEYS: () => (/* binding */ ORDER_FORM_KEYS),
/* harmony export */   PRIVACY_PAGE_NAME: () => (/* binding */ PRIVACY_PAGE_NAME),
/* harmony export */   PRIVACY_URL: () => (/* binding */ PRIVACY_URL),
/* harmony export */   SHIPPING_COUNTRIES: () => (/* binding */ SHIPPING_COUNTRIES),
/* harmony export */   SHIPPING_ENABLED: () => (/* binding */ SHIPPING_ENABLED),
/* harmony export */   SHIPPING_METHODS_EXIST: () => (/* binding */ SHIPPING_METHODS_EXIST),
/* harmony export */   SHOP_URL: () => (/* binding */ SHOP_URL),
/* harmony export */   STATES: () => (/* binding */ STATES),
/* harmony export */   TERMS_PAGE_NAME: () => (/* binding */ TERMS_PAGE_NAME),
/* harmony export */   TERMS_URL: () => (/* binding */ TERMS_URL),
/* harmony export */   WC_BLOCKS_BUILD_URL: () => (/* binding */ WC_BLOCKS_BUILD_URL),
/* harmony export */   WC_BLOCKS_IMAGE_URL: () => (/* binding */ WC_BLOCKS_IMAGE_URL),
/* harmony export */   blocksConfig: () => (/* binding */ blocksConfig)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */

const blocksConfig = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('wcBlocksConfig', {
  pluginUrl: '',
  productCount: 0,
  defaultAvatar: '',
  restApiRoutes: {},
  wordCountType: 'words'
});
const WC_BLOCKS_IMAGE_URL = blocksConfig.pluginUrl + 'assets/images/';
const WC_BLOCKS_BUILD_URL = blocksConfig.pluginUrl + 'assets/client/blocks/';
const SHOP_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).shop?.permalink;
const CHECKOUT_PAGE_ID = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).checkout?.id;
const CHECKOUT_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).checkout?.permalink;
const PRIVACY_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).privacy?.permalink;
const PRIVACY_PAGE_NAME = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).privacy?.title;
const TERMS_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).terms?.permalink;
const TERMS_PAGE_NAME = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).terms?.title;
const CART_PAGE_ID = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).cart?.id;
const CART_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).cart?.permalink;
const LOGIN_URL = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).myaccount?.permalink ? Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).myaccount.permalink : Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('wpLoginUrl', '/wp-login.php');
const LOCAL_PICKUP_ENABLED = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('localPickupEnabled', false);
const SHIPPING_METHODS_EXIST = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('shippingMethodsExist', false);
const SHIPPING_ENABLED = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('shippingEnabled', true);
// Contains country names.
const countries = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('countries', {});

// Contains country settings.
const countryData = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('countryData', {});
const ALLOWED_COUNTRIES = Object.fromEntries(Object.keys(countryData).filter(countryCode => {
  return countryData[countryCode].allowBilling === true;
}).map(countryCode => {
  return [countryCode, countries[countryCode] || ''];
}));
const SHIPPING_COUNTRIES = Object.fromEntries(Object.keys(countryData).filter(countryCode => {
  return countryData[countryCode].allowShipping === true;
}).map(countryCode => {
  return [countryCode, countries[countryCode] || ''];
}));

// Previously we used ALLOWED_COUNTRIES and SHIPPING_COUNTRIES, however, this lead to problems when syncing values
// between billing and shipping if some countries were not available for shipping or vice versa. To get around this,
// we combine countries available for billing and/or shipping so all are available for selection.
const COUNTRIES = {
  ...ALLOWED_COUNTRIES,
  ...SHIPPING_COUNTRIES
};
const STATES = Object.fromEntries(Object.keys(COUNTRIES).map(countryCode => {
  return [countryCode, countryData[countryCode].states || {}];
}));
const COUNTRY_LOCALE = Object.fromEntries(Object.keys(COUNTRIES).map(countryCode => {
  return [countryCode, countryData[countryCode].locale || {}];
}));
const defaultFieldsLocations = {
  address: ['first_name', 'last_name', 'company', 'address_1', 'address_2', 'city', 'postcode', 'country', 'state', 'phone'],
  contact: ['email'],
  order: []
};
const ADDRESS_FORM_KEYS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('addressFieldsLocations', defaultFieldsLocations).address;
const CONTACT_FORM_KEYS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('addressFieldsLocations', defaultFieldsLocations).contact;
const ORDER_FORM_KEYS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('addressFieldsLocations', defaultFieldsLocations).order;
const ORDER_FORM_FIELDS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('additionalOrderFields', {});
const CONTACT_FORM_FIELDS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('additionalContactFields', {});
const ADDRESS_FORM_FIELDS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('additionalAddressFields', {});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/settings/blocks/feature-flags.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/settings/blocks/feature-flags.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isExperimentalBlocksEnabled: () => (/* binding */ isExperimentalBlocksEnabled)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */

/**
 * Checks if experimental blocks are enabled. Do not use to conditionally register blocks,
 * use BlockTypesController to conditionally register blocks.
 *
 * @return {boolean} True if this experimental blocks are enabled.
 */
const isExperimentalBlocksEnabled = () => {
  const {
    experimentalBlocksEnabled
  } = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('wcBlocksConfig', {
    experimentalBlocksEnabled: false
  });
  return experimentalBlocksEnabled;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/settings/blocks/index.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADDRESS_FORM_FIELDS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.ADDRESS_FORM_FIELDS),
/* harmony export */   ADDRESS_FORM_KEYS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.ADDRESS_FORM_KEYS),
/* harmony export */   ALLOWED_COUNTRIES: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_COUNTRIES),
/* harmony export */   CART_PAGE_ID: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CART_PAGE_ID),
/* harmony export */   CART_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CART_URL),
/* harmony export */   CHECKOUT_PAGE_ID: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CHECKOUT_PAGE_ID),
/* harmony export */   CHECKOUT_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CHECKOUT_URL),
/* harmony export */   CONTACT_FORM_FIELDS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CONTACT_FORM_FIELDS),
/* harmony export */   CONTACT_FORM_KEYS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.CONTACT_FORM_KEYS),
/* harmony export */   COUNTRIES: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.COUNTRIES),
/* harmony export */   COUNTRY_LOCALE: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.COUNTRY_LOCALE),
/* harmony export */   LOCAL_PICKUP_ENABLED: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.LOCAL_PICKUP_ENABLED),
/* harmony export */   LOGIN_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.LOGIN_URL),
/* harmony export */   ORDER_FORM_FIELDS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.ORDER_FORM_FIELDS),
/* harmony export */   ORDER_FORM_KEYS: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.ORDER_FORM_KEYS),
/* harmony export */   PRIVACY_PAGE_NAME: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_PAGE_NAME),
/* harmony export */   PRIVACY_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.PRIVACY_URL),
/* harmony export */   SHIPPING_COUNTRIES: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.SHIPPING_COUNTRIES),
/* harmony export */   SHIPPING_ENABLED: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.SHIPPING_ENABLED),
/* harmony export */   SHIPPING_METHODS_EXIST: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.SHIPPING_METHODS_EXIST),
/* harmony export */   SHOP_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.SHOP_URL),
/* harmony export */   STATES: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.STATES),
/* harmony export */   TERMS_PAGE_NAME: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.TERMS_PAGE_NAME),
/* harmony export */   TERMS_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.TERMS_URL),
/* harmony export */   WC_BLOCKS_BUILD_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.WC_BLOCKS_BUILD_URL),
/* harmony export */   WC_BLOCKS_IMAGE_URL: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.WC_BLOCKS_IMAGE_URL),
/* harmony export */   blocksConfig: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.blocksConfig),
/* harmony export */   isExperimentalBlocksEnabled: () => (/* reexport safe */ _feature_flags__WEBPACK_IMPORTED_MODULE_1__.isExperimentalBlocksEnabled)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../node_modules/woocommerce-blocks/js/settings/blocks/constants.ts");
/* harmony import */ var _feature_flags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./feature-flags */ "../node_modules/woocommerce-blocks/js/settings/blocks/feature-flags.ts");
/**
 * Internal dependencies
 */



/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/index.ts":
/*!************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/index.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHIPPING_ERROR_TYPES: () => (/* reexport safe */ _type_defs__WEBPACK_IMPORTED_MODULE_0__.SHIPPING_ERROR_TYPES),
/* harmony export */   assertBatchResponseIsValid: () => (/* reexport safe */ _type_defs__WEBPACK_IMPORTED_MODULE_0__.assertBatchResponseIsValid),
/* harmony export */   assertResponseIsValid: () => (/* reexport safe */ _type_defs__WEBPACK_IMPORTED_MODULE_0__.assertResponseIsValid),
/* harmony export */   isApiErrorResponse: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isApiErrorResponse),
/* harmony export */   isAttributeQuery: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isAttributeQuery),
/* harmony export */   isAttributeQueryCollection: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isAttributeQueryCollection),
/* harmony export */   isAttributeTerm: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isAttributeTerm),
/* harmony export */   isAttributeTermCollection: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isAttributeTermCollection),
/* harmony export */   isBoolean: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isBoolean),
/* harmony export */   isCartResponseTotals: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isCartResponseTotals),
/* harmony export */   isEmpty: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isEmpty),
/* harmony export */   isEmptyObject: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isEmptyObject),
/* harmony export */   isError: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isError),
/* harmony export */   isErrorResponse: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isErrorResponse),
/* harmony export */   isFailResponse: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isFailResponse),
/* harmony export */   isFormFields: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isFormFields),
/* harmony export */   isFunction: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isFunction),
/* harmony export */   isNull: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isNull),
/* harmony export */   isNumber: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isNumber),
/* harmony export */   isObject: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isObject),
/* harmony export */   isObserverResponse: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isObserverResponse),
/* harmony export */   isRatingQueryCollection: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isRatingQueryCollection),
/* harmony export */   isStockStatusOptions: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isStockStatusOptions),
/* harmony export */   isStockStatusQueryCollection: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isStockStatusQueryCollection),
/* harmony export */   isString: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isString),
/* harmony export */   isSuccessResponse: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isSuccessResponse),
/* harmony export */   isValidFieldValidationStatus: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isValidFieldValidationStatus),
/* harmony export */   isValidValidationErrorsObject: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.isValidValidationErrorsObject),
/* harmony export */   nonNullable: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.nonNullable),
/* harmony export */   objectHasProp: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.objectHasProp),
/* harmony export */   responseTypes: () => (/* reexport safe */ _type_guards__WEBPACK_IMPORTED_MODULE_1__.responseTypes)
/* harmony export */ });
/* harmony import */ var _type_defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./type-defs */ "../node_modules/woocommerce-blocks/js/types/type-defs/index.ts");
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./type-guards */ "../node_modules/woocommerce-blocks/js/types/type-guards/index.ts");



/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/api-error-response.ts":
/*!***********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/api-error-response.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/api-response.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/api-response.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assertBatchResponseIsValid: () => (/* binding */ assertBatchResponseIsValid),
/* harmony export */   assertResponseIsValid: () => (/* binding */ assertResponseIsValid)
/* harmony export */ });
function assertBatchResponseIsValid(response) {
  if (typeof response === 'object' && response !== null && response.hasOwnProperty('responses')) {
    return;
  }
  throw new Error('Response not valid');
}
function assertResponseIsValid(response) {
  if (typeof response === 'object' && response !== null && 'body' in response && 'headers' in response) {
    return;
  }
  throw new Error('Response not valid');
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/attributes.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/attributes.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/blocks.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/blocks.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/cart-response.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/cart-response.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/cart.ts":
/*!*********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/cart.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/checkout.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/checkout.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/contexts.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/contexts.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHIPPING_ERROR_TYPES: () => (/* binding */ SHIPPING_ERROR_TYPES)
/* harmony export */ });
let SHIPPING_ERROR_TYPES = /*#__PURE__*/function (SHIPPING_ERROR_TYPES) {
  SHIPPING_ERROR_TYPES["NONE"] = "none";
  SHIPPING_ERROR_TYPES["INVALID_ADDRESS"] = "invalid_address";
  SHIPPING_ERROR_TYPES["UNKNOWN"] = "unknown_error";
  return SHIPPING_ERROR_TYPES;
}({});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/countries.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/countries.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/currency.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/currency.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/events.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/events.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/hocs.ts":
/*!*********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/hocs.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/hooks.ts":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/hooks.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/index.ts":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/index.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SHIPPING_ERROR_TYPES: () => (/* reexport safe */ _contexts__WEBPACK_IMPORTED_MODULE_7__.SHIPPING_ERROR_TYPES),
/* harmony export */   assertBatchResponseIsValid: () => (/* reexport safe */ _api_response__WEBPACK_IMPORTED_MODULE_1__.assertBatchResponseIsValid),
/* harmony export */   assertResponseIsValid: () => (/* reexport safe */ _api_response__WEBPACK_IMPORTED_MODULE_1__.assertResponseIsValid)
/* harmony export */ });
/* harmony import */ var _api_error_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-error-response */ "../node_modules/woocommerce-blocks/js/types/type-defs/api-error-response.ts");
/* harmony import */ var _api_response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api-response */ "../node_modules/woocommerce-blocks/js/types/type-defs/api-response.ts");
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./attributes */ "../node_modules/woocommerce-blocks/js/types/type-defs/attributes.ts");
/* harmony import */ var _blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./blocks */ "../node_modules/woocommerce-blocks/js/types/type-defs/blocks.ts");
/* harmony import */ var _cart_response__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cart-response */ "../node_modules/woocommerce-blocks/js/types/type-defs/cart-response.ts");
/* harmony import */ var _cart__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cart */ "../node_modules/woocommerce-blocks/js/types/type-defs/cart.ts");
/* harmony import */ var _checkout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./checkout */ "../node_modules/woocommerce-blocks/js/types/type-defs/checkout.ts");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./contexts */ "../node_modules/woocommerce-blocks/js/types/type-defs/contexts.ts");
/* harmony import */ var _countries__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./countries */ "../node_modules/woocommerce-blocks/js/types/type-defs/countries.ts");
/* harmony import */ var _currency__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./currency */ "../node_modules/woocommerce-blocks/js/types/type-defs/currency.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./events */ "../node_modules/woocommerce-blocks/js/types/type-defs/events.ts");
/* harmony import */ var _hocs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hocs */ "../node_modules/woocommerce-blocks/js/types/type-defs/hocs.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./hooks */ "../node_modules/woocommerce-blocks/js/types/type-defs/hooks.ts");
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./notices */ "../node_modules/woocommerce-blocks/js/types/type-defs/notices.ts");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./objects */ "../node_modules/woocommerce-blocks/js/types/type-defs/objects.ts");
/* harmony import */ var _payment_method_interface__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./payment-method-interface */ "../node_modules/woocommerce-blocks/js/types/type-defs/payment-method-interface.ts");
/* harmony import */ var _payments__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./payments */ "../node_modules/woocommerce-blocks/js/types/type-defs/payments.ts");
/* harmony import */ var _product_response__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./product-response */ "../node_modules/woocommerce-blocks/js/types/type-defs/product-response.ts");
/* harmony import */ var _product_category_response__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./product-category-response */ "../node_modules/woocommerce-blocks/js/types/type-defs/product-category-response.ts");
/* harmony import */ var _shipping__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./shipping */ "../node_modules/woocommerce-blocks/js/types/type-defs/shipping.ts");
/* harmony import */ var _stock_status__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./stock-status */ "../node_modules/woocommerce-blocks/js/types/type-defs/stock-status.ts");
/* harmony import */ var _taxes__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./taxes */ "../node_modules/woocommerce-blocks/js/types/type-defs/taxes.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./utils */ "../node_modules/woocommerce-blocks/js/types/type-defs/utils.ts");
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./validation */ "../node_modules/woocommerce-blocks/js/types/type-defs/validation.ts");

























/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/notices.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/notices.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/objects.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/objects.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/payment-method-interface.ts":
/*!*****************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/payment-method-interface.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/payments.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/payments.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/product-category-response.ts":
/*!******************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/product-category-response.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/product-response.ts":
/*!*********************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/product-response.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/shipping.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/shipping.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/stock-status.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/stock-status.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/taxes.ts":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/taxes.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/utils.ts":
/*!**********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/utils.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-defs/validation.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-defs/validation.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/api-error-response.ts":
/*!*************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/api-error-response.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isApiErrorResponse: () => (/* binding */ isApiErrorResponse)
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts");
/**
 * Internal dependencies
 */

// Type guard for ApiErrorResponse.
const isApiErrorResponse = response => {
  return (0,_object__WEBPACK_IMPORTED_MODULE_0__.isObject)(response) && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(response, 'code') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(response, 'message');
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/attributes.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/attributes.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAttributeQuery: () => (/* binding */ isAttributeQuery),
/* harmony export */   isAttributeQueryCollection: () => (/* binding */ isAttributeQueryCollection),
/* harmony export */   isAttributeTerm: () => (/* binding */ isAttributeTerm),
/* harmony export */   isAttributeTermCollection: () => (/* binding */ isAttributeTermCollection)
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts");
/**
 * Internal dependencies
 */


const isAttributeTerm = term => {
  return (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'count') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'description') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'id') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'name') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'parent') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(term, 'slug') && typeof term.count === 'number' && typeof term.description === 'string' && typeof term.id === 'number' && typeof term.name === 'string' && typeof term.parent === 'number' && typeof term.slug === 'string';
};
const isAttributeTermCollection = terms => {
  return Array.isArray(terms) && terms.every(isAttributeTerm);
};
const isAttributeQuery = query => {
  return (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(query, 'attribute') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(query, 'operator') && (0,_object__WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(query, 'slug') && typeof query.attribute === 'string' && typeof query.operator === 'string' && Array.isArray(query.slug) && query.slug.every(slug => typeof slug === 'string');
};
const isAttributeQueryCollection = queries => {
  return Array.isArray(queries) && queries.every(isAttributeQuery);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/boolean.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/boolean.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBoolean: () => (/* binding */ isBoolean)
/* harmony export */ });
const isBoolean = term => {
  return typeof term === 'boolean';
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/cart-response-totals.ts":
/*!***************************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/cart-response-totals.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isCartResponseTotals: () => (/* binding */ isCartResponseTotals)
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts");
/**
 * Internal dependencies
 */



// It is the only way to create a type that contains all the object's keys and gets type-checking.
// This is useful because we want to check that the keys object ALWAYS contains all the object's keys.
// https://stackoverflow.com/questions/52028791/make-a-generic-type-arraykeyof-t-require-all-keys-of-t

const isCartResponseTotals = value => {
  if (!(0,_object__WEBPACK_IMPORTED_MODULE_0__.isObject)(value)) {
    return false;
  }
  const keys = {
    total_items: 0,
    total_items_tax: 0,
    total_fees: 0,
    total_fees_tax: 0,
    total_discount: 0,
    total_discount_tax: 0,
    total_shipping: 0,
    total_shipping_tax: 0,
    total_price: 0,
    total_tax: 0,
    tax_lines: 0,
    currency_code: 0,
    currency_symbol: 0,
    currency_minor_unit: 0,
    currency_decimal_separator: 0,
    currency_thousand_separator: 0,
    currency_prefix: 0,
    currency_suffix: 0
  };
  return Object.keys(keys).every(key => key in value);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/empty.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/empty.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isEmpty: () => (/* binding */ isEmpty)
/* harmony export */ });
const isEmpty = value => {
  return value === null || value === undefined || typeof value === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/error.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/error.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isError: () => (/* binding */ isError)
/* harmony export */ });
const isError = term => {
  return term instanceof Error;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/form-fields.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/form-fields.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFormFields: () => (/* binding */ isFormFields)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Type guard to check if a value is a valid Field object.
 * Based on the Field interface and CheckoutFields::get_core_fields() in PHP.
 *
 * @param value - The value to check.
 * @return Whether the value is a valid Field object.
 */
const isField = value => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const field = value;

  // Required properties that must always be present
  if (typeof field.label !== 'string' || typeof field.optionalLabel !== 'string' || typeof field.required !== 'boolean' || typeof field.hidden !== 'boolean' || typeof field.index !== 'number') {
    return false;
  }
  return true;
};

/**
 * Type guard to check if a value is a valid FormFields object.
 * Validates that the object has the expected structure with proper field definitions.
 * Based on CheckoutFields::get_core_fields() which defines the core checkout fields.
 *
 * @param value - The value to check.
 * @return Whether the value is a valid FormFields object.
 */
const isFormFields = value => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const fields = value;

  // Check if it has all core fields from CheckoutFields::get_core_fields()
  // These are the fields that should always be present
  const coreFields = ['email', 'country', 'first_name', 'last_name', 'company', 'address_1', 'address_2', 'city', 'state', 'postcode', 'phone'];
  if (!coreFields.every(field => field in fields)) {
    return false;
  }

  // Validate each field has the proper Field structure
  for (const [fieldId, fieldValue] of Object.entries(fields)) {
    // If not included in core fields, it's an additional field we don't need to consider.
    if (!coreFields.includes(fieldId)) {
      continue;
    }
    if (!isField(fieldValue)) {
      return false;
    }
  }
  return true;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/function.ts":
/*!***************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/function.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFunction: () => (/* binding */ isFunction)
/* harmony export */ });
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = term => {
  return typeof term === 'function';
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/index.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/index.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isApiErrorResponse: () => (/* reexport safe */ _api_error_response__WEBPACK_IMPORTED_MODULE_14__.isApiErrorResponse),
/* harmony export */   isAttributeQuery: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_11__.isAttributeQuery),
/* harmony export */   isAttributeQueryCollection: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_11__.isAttributeQueryCollection),
/* harmony export */   isAttributeTerm: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_11__.isAttributeTerm),
/* harmony export */   isAttributeTermCollection: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_11__.isAttributeTermCollection),
/* harmony export */   isBoolean: () => (/* reexport safe */ _boolean__WEBPACK_IMPORTED_MODULE_0__.isBoolean),
/* harmony export */   isCartResponseTotals: () => (/* reexport safe */ _cart_response_totals__WEBPACK_IMPORTED_MODULE_1__.isCartResponseTotals),
/* harmony export */   isEmpty: () => (/* reexport safe */ _empty__WEBPACK_IMPORTED_MODULE_7__.isEmpty),
/* harmony export */   isEmptyObject: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_8__.isEmptyObject),
/* harmony export */   isError: () => (/* reexport safe */ _error__WEBPACK_IMPORTED_MODULE_2__.isError),
/* harmony export */   isErrorResponse: () => (/* reexport safe */ _observers__WEBPACK_IMPORTED_MODULE_9__.isErrorResponse),
/* harmony export */   isFailResponse: () => (/* reexport safe */ _observers__WEBPACK_IMPORTED_MODULE_9__.isFailResponse),
/* harmony export */   isFormFields: () => (/* reexport safe */ _form_fields__WEBPACK_IMPORTED_MODULE_3__.isFormFields),
/* harmony export */   isFunction: () => (/* reexport safe */ _function__WEBPACK_IMPORTED_MODULE_4__.isFunction),
/* harmony export */   isNull: () => (/* reexport safe */ _null__WEBPACK_IMPORTED_MODULE_5__.isNull),
/* harmony export */   isNumber: () => (/* reexport safe */ _number__WEBPACK_IMPORTED_MODULE_6__.isNumber),
/* harmony export */   isObject: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_8__.isObject),
/* harmony export */   isObserverResponse: () => (/* reexport safe */ _observers__WEBPACK_IMPORTED_MODULE_9__.isObserverResponse),
/* harmony export */   isRatingQueryCollection: () => (/* reexport safe */ _ratings__WEBPACK_IMPORTED_MODULE_12__.isRatingQueryCollection),
/* harmony export */   isStockStatusOptions: () => (/* reexport safe */ _stock_status__WEBPACK_IMPORTED_MODULE_13__.isStockStatusOptions),
/* harmony export */   isStockStatusQueryCollection: () => (/* reexport safe */ _stock_status__WEBPACK_IMPORTED_MODULE_13__.isStockStatusQueryCollection),
/* harmony export */   isString: () => (/* reexport safe */ _string__WEBPACK_IMPORTED_MODULE_10__.isString),
/* harmony export */   isSuccessResponse: () => (/* reexport safe */ _observers__WEBPACK_IMPORTED_MODULE_9__.isSuccessResponse),
/* harmony export */   isValidFieldValidationStatus: () => (/* reexport safe */ _validation__WEBPACK_IMPORTED_MODULE_15__.isValidFieldValidationStatus),
/* harmony export */   isValidValidationErrorsObject: () => (/* reexport safe */ _validation__WEBPACK_IMPORTED_MODULE_15__.isValidValidationErrorsObject),
/* harmony export */   nonNullable: () => (/* reexport safe */ _null__WEBPACK_IMPORTED_MODULE_5__.nonNullable),
/* harmony export */   objectHasProp: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_8__.objectHasProp),
/* harmony export */   responseTypes: () => (/* reexport safe */ _observers__WEBPACK_IMPORTED_MODULE_9__.responseTypes)
/* harmony export */ });
/* harmony import */ var _boolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boolean */ "../node_modules/woocommerce-blocks/js/types/type-guards/boolean.ts");
/* harmony import */ var _cart_response_totals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cart-response-totals */ "../node_modules/woocommerce-blocks/js/types/type-guards/cart-response-totals.ts");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error */ "../node_modules/woocommerce-blocks/js/types/type-guards/error.ts");
/* harmony import */ var _form_fields__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form-fields */ "../node_modules/woocommerce-blocks/js/types/type-guards/form-fields.ts");
/* harmony import */ var _function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./function */ "../node_modules/woocommerce-blocks/js/types/type-guards/function.ts");
/* harmony import */ var _null__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./null */ "../node_modules/woocommerce-blocks/js/types/type-guards/null.ts");
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./number */ "../node_modules/woocommerce-blocks/js/types/type-guards/number.ts");
/* harmony import */ var _empty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./empty */ "../node_modules/woocommerce-blocks/js/types/type-guards/empty.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./object */ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts");
/* harmony import */ var _observers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./observers */ "../node_modules/woocommerce-blocks/js/types/type-guards/observers.ts");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./string */ "../node_modules/woocommerce-blocks/js/types/type-guards/string.ts");
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./attributes */ "../node_modules/woocommerce-blocks/js/types/type-guards/attributes.ts");
/* harmony import */ var _ratings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ratings */ "../node_modules/woocommerce-blocks/js/types/type-guards/ratings.ts");
/* harmony import */ var _stock_status__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./stock-status */ "../node_modules/woocommerce-blocks/js/types/type-guards/stock-status.ts");
/* harmony import */ var _api_error_response__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./api-error-response */ "../node_modules/woocommerce-blocks/js/types/type-guards/api-error-response.ts");
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./validation */ "../node_modules/woocommerce-blocks/js/types/type-guards/validation.ts");

















/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/null.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/null.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNull: () => (/* binding */ isNull),
/* harmony export */   nonNullable: () => (/* binding */ nonNullable)
/* harmony export */ });
const isNull = term => {
  return term === null;
};
function nonNullable(value) {
  return value !== null && value !== undefined;
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/number.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/number.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNumber: () => (/* binding */ isNumber)
/* harmony export */ });
const isNumber = term => {
  return typeof term === 'number';
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/object.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isEmptyObject: () => (/* binding */ isEmptyObject),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   objectHasProp: () => (/* binding */ objectHasProp)
/* harmony export */ });
/* harmony import */ var _null__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./null */ "../node_modules/woocommerce-blocks/js/types/type-guards/null.ts");
/**
 * Internal dependencies
 */


const isObject = term => {
  return !(0,_null__WEBPACK_IMPORTED_MODULE_0__.isNull)(term) && term instanceof Object && term.constructor === Object;
};
function objectHasProp(target, property) {
  // The `in` operator throws a `TypeError` for non-object values.
  return isObject(target) && property in target;
}
const isEmptyObject = object => {
  return Object.keys(object).length === 0;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/observers.ts":
/*!****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/observers.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isErrorResponse: () => (/* binding */ isErrorResponse),
/* harmony export */   isFailResponse: () => (/* binding */ isFailResponse),
/* harmony export */   isObserverResponse: () => (/* binding */ isObserverResponse),
/* harmony export */   isSuccessResponse: () => (/* binding */ isSuccessResponse),
/* harmony export */   responseTypes: () => (/* binding */ responseTypes)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * Internal dependencies
 */

let responseTypes = /*#__PURE__*/function (responseTypes) {
  responseTypes["SUCCESS"] = "success";
  responseTypes["FAIL"] = "failure";
  responseTypes["ERROR"] = "error";
  return responseTypes;
}({});
/**
 * Whether the passed object is an ObserverResponse.
 */
const isObserverResponse = response => {
  return (0,___WEBPACK_IMPORTED_MODULE_0__.isObject)(response) && (0,___WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(response, 'type');
};
const isResponseOf = (response, type) => {
  return (0,___WEBPACK_IMPORTED_MODULE_0__.isObject)(response) && 'type' in response && response.type === type;
};
const isSuccessResponse = response => {
  return isResponseOf(response, responseTypes.SUCCESS);
};
const isErrorResponse = response => {
  return isResponseOf(response, responseTypes.ERROR);
};
const isFailResponse = response => {
  return isResponseOf(response, responseTypes.FAIL);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/ratings.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/ratings.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRatingQueryCollection: () => (/* binding */ isRatingQueryCollection)
/* harmony export */ });
const isRatingQueryCollection = value => {
  return Array.isArray(value) && value.every(v => ['1', '2', '3', '4', '5'].includes(v));
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/stock-status.ts":
/*!*******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/stock-status.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isStockStatusOptions: () => (/* binding */ isStockStatusOptions),
/* harmony export */   isStockStatusQueryCollection: () => (/* binding */ isStockStatusQueryCollection)
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "../node_modules/woocommerce-blocks/js/types/type-guards/object.ts");
/**
 * Internal dependencies
 */


const isStockStatusQueryCollection = value => {
  return Array.isArray(value) && value.every(v => ['instock', 'outofstock', 'onbackorder'].includes(v));
};
const isStockStatusOptions = value => {
  return (0,_object__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) && Object.keys(value).every(v => ['instock', 'outofstock', 'onbackorder'].includes(v));
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/string.ts":
/*!*************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/string.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isString: () => (/* binding */ isString)
/* harmony export */ });
const isString = term => {
  return typeof term === 'string';
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/types/type-guards/validation.ts":
/*!*****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/types/type-guards/validation.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isValidFieldValidationStatus: () => (/* binding */ isValidFieldValidationStatus),
/* harmony export */   isValidValidationErrorsObject: () => (/* binding */ isValidValidationErrorsObject)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * Internal dependencies
 */


/**
 * Whether the given status is a valid FieldValidationStatus.
 */
const isValidFieldValidationStatus = status => {
  return (0,___WEBPACK_IMPORTED_MODULE_0__.isObject)(status) && (0,___WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(status, 'message') && (0,___WEBPACK_IMPORTED_MODULE_0__.objectHasProp)(status, 'hidden') && (0,___WEBPACK_IMPORTED_MODULE_0__.isString)(status.message) && (0,___WEBPACK_IMPORTED_MODULE_0__.isBoolean)(status.hidden);
};

/**
 * Whether the passed object is a valid validation errors object. If this is true, it can be set on the
 * wc/store/validation store without any issue.
 */
const isValidValidationErrorsObject = errors => {
  return (0,___WEBPACK_IMPORTED_MODULE_0__.isObject)(errors) && Object.entries(errors).every(([key, value]) => (0,___WEBPACK_IMPORTED_MODULE_0__.isString)(key) && isValidFieldValidationStatus(value));
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/array-operations.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/array-operations.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayDifferenceBy: () => (/* binding */ arrayDifferenceBy),
/* harmony export */   arrayUnionBy: () => (/* binding */ arrayUnionBy)
/* harmony export */ });
/**
 * Returns the difference between two arrays (A - B)
 */
function arrayDifferenceBy(a, b, key) {
  const keys = new Set(b.map(item => item[key]));
  return a.filter(item => !keys.has(item[key]));
}

/**
 * Returns the union of two arrays (A ∪ B)
 */
function arrayUnionBy(a, b, key) {
  const difference = arrayDifferenceBy(b, a, key);
  return [...a, ...difference];
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/attributes-query.ts":
/*!***********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/attributes-query.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   removeAttributeFilterBySlug: () => (/* binding */ removeAttributeFilterBySlug),
/* harmony export */   updateAttributeFilter: () => (/* binding */ updateAttributeFilter)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fast-sort'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */



/**
 * Given a query object, removes an attribute filter by a single slug.
 *
 * @param {Array}    query     Current query object.
 * @param {Function} setQuery  Callback to update the current query object.
 * @param {Object}   attribute An attribute object.
 * @param {string}   slug      Term slug to remove.
 */
const removeAttributeFilterBySlug = (query = [], setQuery, attribute, slug = '') => {
  // Get current filter for provided attribute.
  const foundQuery = query.filter(item => item.attribute === attribute.taxonomy);
  const currentQuery = foundQuery.length ? foundQuery[0] : null;
  if (!currentQuery || !currentQuery.slug || !Array.isArray(currentQuery.slug) || !currentQuery.slug.includes(slug)) {
    return;
  }
  const newSlugs = currentQuery.slug.filter(item => item !== slug);

  // Remove current attribute filter from query.
  const returnQuery = query.filter(item => item.attribute !== attribute.taxonomy);

  // Add a new query for selected terms, if provided.
  if (newSlugs.length > 0) {
    currentQuery.slug = newSlugs.sort();
    returnQuery.push(currentQuery);
  }
  setQuery(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fast-sort'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(returnQuery).asc('attribute'));
};

/**
 * Given a query object, sets the query up to filter by a given attribute and attribute terms.
 *
 * @param {Array}    query          Current query object.
 * @param {Function} setQuery       Callback to update the current query object.
 * @param {Object}   attribute      An attribute object.
 * @param {Array}    attributeTerms Array of term objects.
 * @param {string}   operator       Operator for the filter. Valid values: in, and.
 *
 * @return {Object} An attribute object.
 */
const updateAttributeFilter = (query = [], setQuery, attribute, attributeTerms = [], operator = 'in') => {
  if (!attribute || !attribute.taxonomy) {
    return [];
  }
  const returnQuery = query.filter(item => item.attribute !== attribute.taxonomy);
  if (attributeTerms.length === 0) {
    setQuery(returnQuery);
  } else {
    returnQuery.push({
      attribute: attribute.taxonomy,
      operator,
      slug: attributeTerms.map(({
        slug
      }) => slug).sort()
    });
    setQuery(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fast-sort'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(returnQuery).asc('attribute'));
  }
  return returnQuery;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/attributes.ts":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/attributes.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertAttributeObjectToSearchItem: () => (/* binding */ convertAttributeObjectToSearchItem),
/* harmony export */   getAttributeFromID: () => (/* binding */ getAttributeFromID),
/* harmony export */   getAttributeFromTaxonomy: () => (/* binding */ getAttributeFromTaxonomy),
/* harmony export */   getTaxonomyFromAttributeId: () => (/* binding */ getTaxonomyFromAttributeId),
/* harmony export */   updateAttributeInSiblingBlock: () => (/* binding */ updateAttributeInSiblingBlock)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */




const ATTRIBUTES = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('attributes', []);

/**
 * Format an attribute from the settings into an object with standardized keys.
 *
 * @param {Object|null} attribute The attribute object.
 */
const attributeSettingToObject = attribute => {
  if (!attribute || !attribute.attribute_name) {
    return null;
  }
  return {
    id: parseInt(attribute.attribute_id, 10),
    name: attribute.attribute_name,
    taxonomy: 'pa_' + attribute.attribute_name,
    label: attribute.attribute_label,
    orderby: attribute.attribute_orderby
  };
};

/**
 * Format all attribute settings into objects.
 */
const attributeObjects = ATTRIBUTES.reduce((acc, current) => {
  const attributeObject = attributeSettingToObject(current);
  if (attributeObject && attributeObject.id) {
    acc.push(attributeObject);
  }
  return acc;
}, []);

/**
 * Converts an Attribute object into a shape compatible with the `SearchListControl`
 */
const convertAttributeObjectToSearchItem = attribute => {
  const {
    count,
    id,
    name,
    parent
  } = attribute;
  return {
    count,
    id,
    name,
    parent,
    breadcrumbs: [],
    children: [],
    value: (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_1__.isAttributeTerm)(attribute) ? attribute.attr_slug : ''
  };
};

/**
 * Get attribute data by taxonomy.
 *
 * @param {number} attributeId The attribute ID.
 * @return {Object|undefined} The attribute object if it exists.
 */
const getAttributeFromID = attributeId => {
  if (!attributeId) {
    return;
  }
  return attributeObjects.find(attribute => {
    return attribute.id === attributeId;
  });
};

/**
 * Get attribute data by taxonomy.
 *
 * @param {string} taxonomy The attribute taxonomy name e.g. pa_color.
 * @return {Object|undefined} The attribute object if it exists.
 */
const getAttributeFromTaxonomy = taxonomy => {
  if (!taxonomy) {
    return;
  }
  return attributeObjects.find(attribute => {
    return attribute.taxonomy === taxonomy;
  });
};

/**
 * Get the taxonomy of an attribute by Attribute ID.
 *
 * @param {number} attributeId The attribute ID.
 * @return {string} The taxonomy name.
 */
const getTaxonomyFromAttributeId = attributeId => {
  if (!attributeId) {
    return null;
  }
  const attribute = getAttributeFromID(attributeId);
  return attribute ? attribute.taxonomy : null;
};

/**
 * Updates an attribute in a sibling block. Useful if two settings control the same attribute, but you don't want to
 * have this attribute exist on a parent block.
 */
const updateAttributeInSiblingBlock = (clientId, attribute, newValue, siblingBlockName) => {
  const store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core/block-editor');
  const actions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)('core/block-editor');
  const parentBlocks = store.getBlockParents(clientId);
  let shippingMethodsBlockClientId = '';

  // Loop through parent block's children until we find woocommerce/checkout-shipping-methods-block.
  // Also set this attribute in the woocommerce/checkout-shipping-methods-block.
  parentBlocks.forEach(parent => {
    const childBlock = store.getBlock(parent).innerBlocks.find(child => child.name === siblingBlockName);
    if (!childBlock) {
      return;
    }
    shippingMethodsBlockClientId = childBlock.clientId;
  });
  actions.updateBlockAttributes(shippingMethodsBlockClientId, {
    [attribute]: newValue
  });
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/colors.ts":
/*!*************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/colors.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getElementBackgroundColor: () => (/* binding */ getElementBackgroundColor)
/* harmony export */ });
function getElementBackgroundColor(element) {
  while (element) {
    const bgColor = window.getComputedStyle(element).backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      return bgColor;
    }
    element = element.parentElement;
  }

  // Return white as the default background color.
  return 'rgb(255, 255, 255)';
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/filters.ts":
/*!**************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/filters.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PREFIX_QUERY_ARG_FILTER_TYPE: () => (/* binding */ PREFIX_QUERY_ARG_FILTER_TYPE),
/* harmony export */   PREFIX_QUERY_ARG_QUERY_TYPE: () => (/* binding */ PREFIX_QUERY_ARG_QUERY_TYPE),
/* harmony export */   changeUrl: () => (/* binding */ changeUrl),
/* harmony export */   getUrlParameter: () => (/* binding */ getUrlParameter),
/* harmony export */   normalizeQueryParams: () => (/* binding */ normalizeQueryParams)
/* harmony export */ });
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_0__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/**
 * External dependencies
 */



const filteringForPhpTemplate = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('isRenderingPhpTemplate', false, _woocommerce_types__WEBPACK_IMPORTED_MODULE_2__.isBoolean);

/**
 * Returns specified parameter from URL
 *
 * @param {string} name Parameter you want the value of.
 */

const PREFIX_QUERY_ARG_QUERY_TYPE = 'query_type_';
const PREFIX_QUERY_ARG_FILTER_TYPE = 'filter_';
function getUrlParameter(name) {
  if (!window) {
    return null;
  }
  return (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArg)(window.location.href, name);
}

/**
 * Change the URL and reload the page if filtering for PHP templates.
 *
 * @param {string} newUrl New URL to be set.
 */
function changeUrl(newUrl) {
  if (filteringForPhpTemplate) {
    /**
     * We may need to reset the current page when changing filters.
     * This is because the current page may not exist for this set
     * of filters and will 404 when the user navigates to it.
     *
     * There are different pagination formats to consider, as documented here:
     * https://github.com/WordPress/gutenberg/blob/317eb8f14c8e1b81bf56972cca2694be250580e3/packages/block-library/src/query-pagination-numbers/index.php#L22-L85
     */
    const url = new URL(newUrl);
    // When pretty permalinks are enabled, the page number may be in the path name.
    url.pathname = url.pathname.replace(/\/page\/[0-9]+/i, '');
    // When plain permalinks are enabled, the page number may be in the "paged" query parameter.
    url.searchParams.delete('paged');
    // On posts and pages the page number will be in a query parameter that
    // identifies which block we are paginating.
    url.searchParams.forEach((_, key) => {
      if (key.match(/^query(?:-[0-9]+)?-page$/)) {
        url.searchParams.delete(key);
      }
    });
    window.location.href = url.href;
  } else {
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Run the query params through buildQueryString to normalise the params.
 *
 * @param {string} url URL to encode the search param from.
 */
const normalizeQueryParams = url => {
  const queryArgs = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.getQueryArgs)(url);
  return (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_0__.addQueryArgs)(url, queryArgs);
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/find-block.ts":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/find-block.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findBlock: () => (/* binding */ findBlock)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Recursively searches through an array of `BlockInstance` objects and their nested `innerBlocks` arrays to find a block that matches a given condition.
 *
 * @param { { blocks: BlockInstance[], findCondition: Function } } parameters Parameters containing an array of `BlockInstance` objects to search through and a function that takes a `BlockInstance` object as its argument and returns a boolean indicating whether the block matches the desired condition.
 * @return If a matching block is found, the function returns the `BlockInstance` object. If no matching block is found, the function returns `undefined`.
 */
const findBlock = ({
  blocks,
  findCondition
}) => {
  for (const block of blocks) {
    if (findCondition(block)) {
      return block;
    }
    if (block.innerBlocks) {
      const foundChildBlock = findBlock({
        blocks: block.innerBlocks,
        findCondition
      });
      if (foundChildBlock) {
        return foundChildBlock;
      }
    }
  }
  return undefined;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/get-inner-block-by-name.ts":
/*!******************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/get-inner-block-by-name.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInnerBlockBy: () => (/* binding */ getInnerBlockBy),
/* harmony export */   getInnerBlockByName: () => (/* binding */ getInnerBlockByName)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Recursively searches for an inner block that matches the given callback condition.
 *
 * @param block    The block instance to search within.
 * @param callback A function that returns true for the desired inner block.
 *
 * @return The first inner block that matches the condition, or null if none found.
 */
const getInnerBlockBy = (block, callback) => {
  if (!block) return null;
  if (block.innerBlocks.length === 0) return null;
  for (const innerBlock of block.innerBlocks) {
    if (callback(innerBlock)) return innerBlock;
    const innerInnerBlock = getInnerBlockBy(innerBlock, callback);
    if (innerInnerBlock) return innerInnerBlock;
  }
  return null;
};

/**
 * Recursively searches for an inner block by its name.
 *
 * @param block The block instance to search within.
 * @param name  The name of the inner block to find.
 *
 * @return The first inner block with the specified name, or null if none found.
 */
const getInnerBlockByName = (block, name) => {
  return getInnerBlockBy(block, function (innerBlock) {
    return innerBlock.name === name;
  });
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/get-unique-id.ts":
/*!********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/get-unique-id.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateUniqueId: () => (/* binding */ generateUniqueId)
/* harmony export */ });
/**
 * Generates a random unique ID as a number.
 *
 * @return {number} The generated unique ID as a number.
 */
function generateUniqueId() {
  return Math.floor(Math.random() * Date.now());
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/html-entities.ts":
/*!********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/html-entities.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decodeHtmlEntities: () => (/* binding */ decodeHtmlEntities)
/* harmony export */ });
/**
 * Utility function to decode HTML entities in a string. Inspired by Gutenberg's stripHtml function (currently unstable).
 *
 * @param text
 */
const decodeHtmlEntities = text => {
  if (typeof text !== 'string') {
    return '';
  }
  const doc = document.implementation.createHTMLDocument('');
  doc.body.innerHTML = text;
  return doc.body.textContent || '';
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/index.ts":
/*!************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/index.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PREFIX_QUERY_ARG_FILTER_TYPE: () => (/* reexport safe */ _filters__WEBPACK_IMPORTED_MODULE_4__.PREFIX_QUERY_ARG_FILTER_TYPE),
/* harmony export */   PREFIX_QUERY_ARG_QUERY_TYPE: () => (/* reexport safe */ _filters__WEBPACK_IMPORTED_MODULE_4__.PREFIX_QUERY_ARG_QUERY_TYPE),
/* harmony export */   appendMoreText: () => (/* reexport safe */ _trim_words__WEBPACK_IMPORTED_MODULE_12__.appendMoreText),
/* harmony export */   arrayDifferenceBy: () => (/* reexport safe */ _array_operations__WEBPACK_IMPORTED_MODULE_0__.arrayDifferenceBy),
/* harmony export */   arrayUnionBy: () => (/* reexport safe */ _array_operations__WEBPACK_IMPORTED_MODULE_0__.arrayUnionBy),
/* harmony export */   changeUrl: () => (/* reexport safe */ _filters__WEBPACK_IMPORTED_MODULE_4__.changeUrl),
/* harmony export */   convertAttributeObjectToSearchItem: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_2__.convertAttributeObjectToSearchItem),
/* harmony export */   convertProductCategoryResponseItemToSearchItem: () => (/* reexport safe */ _products__WEBPACK_IMPORTED_MODULE_7__.convertProductCategoryResponseItemToSearchItem),
/* harmony export */   convertProductResponseItemToSearchItem: () => (/* reexport safe */ _products__WEBPACK_IMPORTED_MODULE_7__.convertProductResponseItemToSearchItem),
/* harmony export */   decodeHtmlEntities: () => (/* reexport safe */ _html_entities__WEBPACK_IMPORTED_MODULE_15__.decodeHtmlEntities),
/* harmony export */   findBlock: () => (/* reexport safe */ _find_block__WEBPACK_IMPORTED_MODULE_13__.findBlock),
/* harmony export */   generateUniqueId: () => (/* reexport safe */ _get_unique_id__WEBPACK_IMPORTED_MODULE_14__.generateUniqueId),
/* harmony export */   getAttributeFromID: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_2__.getAttributeFromID),
/* harmony export */   getAttributeFromTaxonomy: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_2__.getAttributeFromTaxonomy),
/* harmony export */   getElementBackgroundColor: () => (/* reexport safe */ _colors__WEBPACK_IMPORTED_MODULE_3__.getElementBackgroundColor),
/* harmony export */   getImageIdFromProduct: () => (/* reexport safe */ _products__WEBPACK_IMPORTED_MODULE_7__.getImageIdFromProduct),
/* harmony export */   getImageSrcFromProduct: () => (/* reexport safe */ _products__WEBPACK_IMPORTED_MODULE_7__.getImageSrcFromProduct),
/* harmony export */   getInnerBlockBy: () => (/* reexport safe */ _get_inner_block_by_name__WEBPACK_IMPORTED_MODULE_16__.getInnerBlockBy),
/* harmony export */   getInnerBlockByName: () => (/* reexport safe */ _get_inner_block_by_name__WEBPACK_IMPORTED_MODULE_16__.getInnerBlockByName),
/* harmony export */   getTaxonomyFromAttributeId: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_2__.getTaxonomyFromAttributeId),
/* harmony export */   getUrlParameter: () => (/* reexport safe */ _filters__WEBPACK_IMPORTED_MODULE_4__.getUrlParameter),
/* harmony export */   hasNoticesOfType: () => (/* reexport safe */ _notices__WEBPACK_IMPORTED_MODULE_5__.hasNoticesOfType),
/* harmony export */   isSiteEditorPage: () => (/* reexport safe */ _is_site_editor_page__WEBPACK_IMPORTED_MODULE_10__.isSiteEditorPage),
/* harmony export */   isWidgetEditorPage: () => (/* reexport safe */ _is_widget_editor_page__WEBPACK_IMPORTED_MODULE_11__.isWidgetEditorPage),
/* harmony export */   normalizeQueryParams: () => (/* reexport safe */ _filters__WEBPACK_IMPORTED_MODULE_4__.normalizeQueryParams),
/* harmony export */   objectOmit: () => (/* reexport safe */ _object_operations__WEBPACK_IMPORTED_MODULE_6__.objectOmit),
/* harmony export */   removeAttributeFilterBySlug: () => (/* reexport safe */ _attributes_query__WEBPACK_IMPORTED_MODULE_1__.removeAttributeFilterBySlug),
/* harmony export */   removeNoticesByStatus: () => (/* reexport safe */ _notices__WEBPACK_IMPORTED_MODULE_5__.removeNoticesByStatus),
/* harmony export */   removeTags: () => (/* reexport safe */ _trim_words__WEBPACK_IMPORTED_MODULE_12__.removeTags),
/* harmony export */   sanitizeHTML: () => (/* reexport safe */ _sanitize_html__WEBPACK_IMPORTED_MODULE_9__.sanitizeHTML),
/* harmony export */   sharedAttributeBlockTypes: () => (/* reexport safe */ _shared_attributes__WEBPACK_IMPORTED_MODULE_8__.sharedAttributeBlockTypes),
/* harmony export */   trimCharacters: () => (/* reexport safe */ _trim_words__WEBPACK_IMPORTED_MODULE_12__.trimCharacters),
/* harmony export */   trimWords: () => (/* reexport safe */ _trim_words__WEBPACK_IMPORTED_MODULE_12__.trimWords),
/* harmony export */   updateAttributeFilter: () => (/* reexport safe */ _attributes_query__WEBPACK_IMPORTED_MODULE_1__.updateAttributeFilter),
/* harmony export */   updateAttributeInSiblingBlock: () => (/* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_2__.updateAttributeInSiblingBlock)
/* harmony export */ });
/* harmony import */ var _array_operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array-operations */ "../node_modules/woocommerce-blocks/js/utils/array-operations.ts");
/* harmony import */ var _attributes_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attributes-query */ "../node_modules/woocommerce-blocks/js/utils/attributes-query.ts");
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./attributes */ "../node_modules/woocommerce-blocks/js/utils/attributes.ts");
/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./colors */ "../node_modules/woocommerce-blocks/js/utils/colors.ts");
/* harmony import */ var _filters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filters */ "../node_modules/woocommerce-blocks/js/utils/filters.ts");
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./notices */ "../node_modules/woocommerce-blocks/js/utils/notices.ts");
/* harmony import */ var _object_operations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./object-operations */ "../node_modules/woocommerce-blocks/js/utils/object-operations.ts");
/* harmony import */ var _products__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./products */ "../node_modules/woocommerce-blocks/js/utils/products.ts");
/* harmony import */ var _shared_attributes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shared-attributes */ "../node_modules/woocommerce-blocks/js/utils/shared-attributes.js");
/* harmony import */ var _sanitize_html__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sanitize-html */ "../node_modules/woocommerce-blocks/js/utils/sanitize-html.ts");
/* harmony import */ var _is_site_editor_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./is-site-editor-page */ "../node_modules/woocommerce-blocks/js/utils/is-site-editor-page.ts");
/* harmony import */ var _is_widget_editor_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./is-widget-editor-page */ "../node_modules/woocommerce-blocks/js/utils/is-widget-editor-page.ts");
/* harmony import */ var _trim_words__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./trim-words */ "../node_modules/woocommerce-blocks/js/utils/trim-words.ts");
/* harmony import */ var _find_block__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./find-block */ "../node_modules/woocommerce-blocks/js/utils/find-block.ts");
/* harmony import */ var _get_unique_id__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./get-unique-id */ "../node_modules/woocommerce-blocks/js/utils/get-unique-id.ts");
/* harmony import */ var _html_entities__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./html-entities */ "../node_modules/woocommerce-blocks/js/utils/html-entities.ts");
/* harmony import */ var _get_inner_block_by_name__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./get-inner-block-by-name */ "../node_modules/woocommerce-blocks/js/utils/get-inner-block-by-name.ts");


















/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/is-site-editor-page.ts":
/*!**************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/is-site-editor-page.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isSiteEditorPage: () => (/* binding */ isSiteEditorPage)
/* harmony export */ });
/* harmony import */ var _types_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/type-guards */ "../node_modules/woocommerce-blocks/js/types/type-guards/index.ts");
/**
 * Internal dependencies
 */

const isSiteEditorPage = store => {
  if ((0,_types_type_guards__WEBPACK_IMPORTED_MODULE_0__.isObject)(store)) {
    const editedPostType = store.getEditedPostType();
    return editedPostType === 'wp_template' || editedPostType === 'wp_template_part';
  }
  return false;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/is-widget-editor-page.ts":
/*!****************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/is-widget-editor-page.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isWidgetEditorPage: () => (/* binding */ isWidgetEditorPage)
/* harmony export */ });
/* harmony import */ var _types_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/type-guards */ "../node_modules/woocommerce-blocks/js/types/type-guards/index.ts");
/**
 * Internal dependencies
 */

const isWidgetEditorPage = store => {
  if ((0,_types_type_guards__WEBPACK_IMPORTED_MODULE_0__.isObject)(store)) {
    const widgetAreas = store.getWidgetAreas();
    return Array.isArray(widgetAreas) && widgetAreas.length > 0;
  }
  return false;
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/notices.ts":
/*!**************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/notices.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasNoticesOfType: () => (/* binding */ hasNoticesOfType),
/* harmony export */   removeNoticesByStatus: () => (/* binding */ removeNoticesByStatus)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */

const hasNoticesOfType = (type, context) => {
  const notices = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/notices').getNotices(context);
  return notices.some(notice => notice.type === type);
};

// Note, if context is blank, the default context is used.
const removeNoticesByStatus = (status, context) => {
  const notices = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/notices').getNotices(context);
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('core/notices');
  const noticesOfType = notices.filter(notice => notice.status === status);
  noticesOfType.forEach(notice => removeNotice(notice.id, context));
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/object-operations.ts":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/object-operations.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   objectOmit: () => (/* binding */ objectOmit)
/* harmony export */ });
/**
 * Returns an object without a key.
 */
function objectOmit(obj, key) {
  const {
    [key]: omit,
    ...rest
  } = obj;
  return rest;
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/products.ts":
/*!***************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/products.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertProductCategoryResponseItemToSearchItem: () => (/* binding */ convertProductCategoryResponseItemToSearchItem),
/* harmony export */   convertProductResponseItemToSearchItem: () => (/* binding */ convertProductResponseItemToSearchItem),
/* harmony export */   getImageIdFromProduct: () => (/* binding */ getImageIdFromProduct),
/* harmony export */   getImageSrcFromProduct: () => (/* binding */ getImageSrcFromProduct)
/* harmony export */ });
/**
 * External dependencies
 */

/**
 * Converts a Product object into a shape compatible with the `SearchListControl`
 */
const convertProductResponseItemToSearchItem = product => {
  const {
    id,
    name,
    parent
  } = product;
  return {
    id,
    name,
    parent,
    breadcrumbs: [],
    children: [],
    details: product,
    value: product.slug
  };
};

/**
 * Converts a Product Category object into a shape compatible with the `SearchListControl`
 */
const convertProductCategoryResponseItemToSearchItem = category => {
  const {
    id,
    name,
    parent,
    count
  } = category;
  return {
    id,
    name,
    parent,
    count,
    breadcrumbs: [],
    children: [],
    details: category,
    value: category.slug
  };
};

/**
 * Get the src of the first image attached to a product (the featured image).
 */
function getImageSrcFromProduct(product) {
  if (!product || !product.images || !product.images.length) {
    return '';
  }
  return product.images[0].src || '';
}

/**
 * Get the ID of the first image attached to a product (the featured image).
 */
function getImageIdFromProduct(product) {
  if (!product || !product.images || !product.images.length) {
    return 0;
  }
  return product.images[0].id || 0;
}

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/sanitize-html.ts":
/*!********************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/sanitize-html.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sanitizeHTML: () => (/* binding */ sanitizeHTML)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dompurify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */

const ALLOWED_TAGS = ['a', 'b', 'em', 'i', 'strong', 'p', 'br'];
const ALLOWED_ATTR = ['target', 'href', 'rel', 'name', 'download'];
const sanitizeHTML = (html, config) => {
  const tagsValue = config?.tags || ALLOWED_TAGS;
  const attrValue = config?.attr || ALLOWED_ATTR;
  return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'dompurify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(html, {
    ALLOWED_TAGS: tagsValue,
    ALLOWED_ATTR: attrValue
  });
};

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/shared-attributes.js":
/*!************************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/shared-attributes.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   sharedAttributeBlockTypes: () => (/* binding */ sharedAttributeBlockTypes)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/**
 * External dependencies
 */

const sharedAttributeBlockTypes = ['woocommerce/product-best-sellers', 'woocommerce/product-category', 'woocommerce/product-new', 'woocommerce/product-on-sale', 'woocommerce/product-top-rated'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  /**
   * Number of columns.
   */
  columns: {
    type: 'number',
    default: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('defaultColumns', 3)
  },
  /**
   * Number of rows.
   */
  rows: {
    type: 'number',
    default: Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('defaultRows', 3)
  },
  /**
   * How to align cart buttons.
   */
  alignButtons: {
    type: 'boolean',
    default: false
  },
  /**
   * Product category, used to display only products in the given categories.
   */
  categories: {
    type: 'array',
    default: []
  },
  /**
   * Product category operator, used to restrict to products in all or any selected categories.
   */
  catOperator: {
    type: 'string',
    default: 'any'
  },
  /**
   * Content visibility setting
   */
  contentVisibility: {
    type: 'object',
    default: {
      image: true,
      title: true,
      price: true,
      rating: true,
      button: true
    }
  },
  /**
   * Are we previewing?
   */
  isPreview: {
    type: 'boolean',
    default: false
  },
  /**
   * Whether to display in stock, out of stock or backorder products.
   */
  stockStatus: {
    type: 'array',
    default: Object.keys(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('stockStatusOptions', []))
  }
});

/***/ }),

/***/ "../node_modules/woocommerce-blocks/js/utils/trim-words.ts":
/*!*****************************************************************!*\
  !*** ../node_modules/woocommerce-blocks/js/utils/trim-words.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appendMoreText: () => (/* binding */ appendMoreText),
/* harmony export */   removeTags: () => (/* binding */ removeTags),
/* harmony export */   trimCharacters: () => (/* binding */ trimCharacters),
/* harmony export */   trimWords: () => (/* binding */ trimWords)
/* harmony export */ });
/* harmony import */ var _wordpress_autop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/autop */ "@wordpress/autop");
/* harmony import */ var _wordpress_autop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Remove HTML tags from a string.
 *
 * @param {string} htmlString String to remove tags from.
 * @return {string} Plain text string.
 */
const removeTags = htmlString => {
  const tagsRegExp = /<\/?[a-z][^>]*?>/gi;
  return htmlString.replace(tagsRegExp, '');
};

/**
 * Remove trailing punctuation and append some characters to a string.
 *
 * @param {string} text     Text to append to.
 * @param {string} moreText Text to append.
 * @return {string} String with appended characters.
 */
const appendMoreText = (text, moreText) => {
  return text.replace(/[\s|\.\,]+$/i, '') + moreText;
};

/**
 * Limit words in string and returned trimmed version.
 *
 * @param {string} text      Text to trim.
 * @param {number} maxLength Number of countType to limit to.
 * @param {string} moreText  Appended to the trimmed string.
 * @param {string} useAutop  Whether to format with autop before returning.
 * @return {string} Trimmed string.
 */
const trimWords = (text, maxLength, moreText = '&hellip;', useAutop = true) => {
  const textToTrim = removeTags(text);
  const trimmedText = textToTrim.split(' ').splice(0, maxLength).join(' ');
  if (trimmedText === textToTrim) {
    return useAutop ? (0,_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__.autop)(textToTrim) : textToTrim;
  }
  if (!useAutop) {
    return appendMoreText(trimmedText, moreText);
  }
  return (0,_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__.autop)(appendMoreText(trimmedText, moreText));
};

/**
 * Limit characters in string and returned trimmed version.
 *
 * @param {string}  text          Text to trim.
 * @param {number}  maxLength     Number of countType to limit to.
 * @param {boolean} includeSpaces Should spaces be included in the count.
 * @param {string}  moreText      Appended to the trimmed string.
 * @param {string}  useAutop      Whether to format with autop before returning.
 * @return {string} Trimmed string.
 */
const trimCharacters = (text, maxLength, includeSpaces = true, moreText = '&hellip;', useAutop = true) => {
  const textToTrim = removeTags(text);
  const trimmedText = textToTrim.slice(0, maxLength);
  if (trimmedText === textToTrim) {
    return useAutop ? (0,_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__.autop)(textToTrim) : textToTrim;
  }
  if (includeSpaces) {
    return (0,_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__.autop)(appendMoreText(trimmedText, moreText));
  }
  const matchSpaces = trimmedText.match(/([\s]+)/g);
  const spaceCount = matchSpaces ? matchSpaces.length : 0;
  const trimmedTextExcludingSpaces = textToTrim.slice(0, maxLength + spaceCount);
  if (!useAutop) {
    return appendMoreText(trimmedTextExcludingSpaces, moreText);
  }
  return (0,_wordpress_autop__WEBPACK_IMPORTED_MODULE_0__.autop)(appendMoreText(trimmedTextExcludingSpaces, moreText));
};

/***/ }),

/***/ "./blocks/product-collection/block.json":
/*!**********************************************!*\
  !*** ./blocks/product-collection/block.json ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"woocommerce/product-collection","title":"Product Collection","description":"Display a collection of products from your store.","category":"woocommerce","keywords":["WooCommerce","Products (Beta)","all products","by attribute","by category","by tag"],"textdomain":"woocommerce","attributes":{"queryId":{"type":"number"},"query":{"type":"object"},"tagName":{"type":"string"},"displayLayout":{"type":"object","properties":{"type":{"type":"string","enum":["flex","list","carousel"]},"columns":{"type":"number"},"shrinkColumns":{"type":"boolean"}}},"dimensions":{"type":"object"},"convertedFromProducts":{"type":"boolean","default":false},"collection":{"type":"string"},"hideControls":{"default":[],"type":"array"},"queryContextIncludes":{"type":"array"},"forcePageReload":{"type":"boolean","default":false},"__privatePreviewState":{"type":"object"}},"providesContext":{"queryId":"queryId","query":"query","displayLayout":"displayLayout","dimensions":"dimensions","queryContextIncludes":"queryContextIncludes","collection":"collection","__privateProductCollectionPreviewState":"__privatePreviewState"},"usesContext":["templateSlug","postId"],"supports":{"align":["wide","full"],"anchor":true,"html":false,"__experimentalLayout":true,"interactivity":true},"editorStyle":"file:../woocommerce/product-collection-editor.css","style":"file:../woocommerce/product-collection-style.css"}');

/***/ }),

/***/ "./blocks/product-collection/collections/best-sellers.tsx":
/*!****************************************************************!*\
  !*** ./blocks/product-collection/collections/best-sellers.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getCollectionByName: () => (/* binding */ getCollectionByName),
/* harmony export */   registerCollections: () => (/* binding */ registerCollections)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_blocks_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/blocks-registry */ "../node_modules/woocommerce-blocks/js/blocks-registry/index.js");
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
  collections.forEach(collection => (0,_woocommerce_blocks_registry__WEBPACK_IMPORTED_MODULE_1__.__experimentalRegisterProductCollection)(collection));
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
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
const STOCK_STATUS_OPTIONS = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('stockStatusOptions', []);
const GLOBAL_HIDE_OUT_OF_STOCK = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('hideOutOfStockItems', false);
const getDefaultStockStatuses = () => {
  return GLOBAL_HIDE_OUT_OF_STOCK ? Object.keys((0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_1__.objectOmit)(STOCK_STATUS_OPTIONS, 'outofstock')) : Object.keys(STOCK_STATUS_OPTIONS);
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/info.js");
/* harmony import */ var _woocommerce_editor_components_product_control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/editor-components/product-control */ "../node_modules/woocommerce-blocks/js/editor-components/product-control/index.tsx");
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
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_woocommerce_editor_components_product_control__WEBPACK_IMPORTED_MODULE_3__["default"], {
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

"use strict";
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

"use strict";
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

"use strict";
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
/* harmony import */ var _woocommerce_blocks_product_template_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/blocks/product-template/utils */ "../node_modules/woocommerce-blocks/js/blocks/product-template/utils.tsx");
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
  const location = (0,_woocommerce_blocks_product_template_utils__WEBPACK_IMPORTED_MODULE_3__.useGetLocation)(context, clientId);
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_editor_components_product_attribute_term_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/editor-components/product-attribute-term-control */ "../node_modules/woocommerce-blocks/js/editor-components/product-attribute-term-control/index.tsx");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
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



const EDIT_ATTRIBUTES_URL = `${Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/settings'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())}edit.php?post_type=product&page=product_attributes`;
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
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_woocommerce_editor_components_product_attribute_term_control__WEBPACK_IMPORTED_MODULE_1__["default"], {
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandPickedProductsControlField: () => (/* binding */ HandPickedProductsControlField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _woocommerce_editor_components_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @woocommerce/editor-components/utils */ "../node_modules/woocommerce-blocks/js/editor-components/utils/index.js");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
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
    (0,_woocommerce_editor_components_utils__WEBPACK_IMPORTED_MODULE_0__.getProducts)(query).then(results => {
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
  const isLargeCatalog = (_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_5__.blocksConfig.productCount || 0) > 100;
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
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_7__.CoreFilterNames.HAND_PICKED);
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.FormTokenField, {
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
      woocommerceHandPickedProducts: _constants__WEBPACK_IMPORTED_MODULE_8__.DEFAULT_FILTERS.woocommerceHandPickedProducts
    });
    trackInteraction(_types__WEBPACK_IMPORTED_MODULE_7__.CoreFilterNames.HAND_PICKED);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.__experimentalToolsPanelItem, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Hand-Picked', 'woocommerce'),
    hasValue: () => !!selectedProductIds?.length,
    onDeselect: deselectCallback,
    resetAllFilter: deselectCallback,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(HandPickedProductsControlField, {
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

"use strict";
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
/* harmony import */ var _woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @woocommerce/blocks/migration-products-to-product-collection */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/index.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_editor_components_ces_feedback_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @woocommerce/editor-components/ces-feedback-button */ "../node_modules/woocommerce-blocks/js/editor-components/ces-feedback-button/index.tsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../block.json */ "./blocks/product-collection/block.json");
/* harmony import */ var _tracks_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../tracks-utils */ "./blocks/product-collection/tracks-utils.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var _upgrade_notice__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./upgrade-notice */ "./blocks/product-collection/edit/inspector-controls/upgrade-notice.tsx");
/* harmony import */ var _columns_control__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./columns-control */ "./blocks/product-collection/edit/inspector-controls/columns-control.tsx");
/* harmony import */ var _use_page_context_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./use-page-context-control */ "./blocks/product-collection/edit/inspector-controls/use-page-context-control.tsx");
/* harmony import */ var _use_carousel_layout_adjustments__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./use-carousel-layout-adjustments */ "./blocks/product-collection/edit/inspector-controls/use-carousel-layout-adjustments.ts");
/* harmony import */ var _order_by_control_default_query_order_by_control__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./order-by-control/default-query-order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/default-query-order-by-control.tsx");
/* harmony import */ var _order_by_control_custom_query_order_by_control__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./order-by-control/custom-query-order-by-control */ "./blocks/product-collection/edit/inspector-controls/order-by-control/custom-query-order-by-control.tsx");
/* harmony import */ var _on_sale_control__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./on-sale-control */ "./blocks/product-collection/edit/inspector-controls/on-sale-control.tsx");
/* harmony import */ var _stock_status_control__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./stock-status-control */ "./blocks/product-collection/edit/inspector-controls/stock-status-control.tsx");
/* harmony import */ var _keyword_control__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./keyword-control */ "./blocks/product-collection/edit/inspector-controls/keyword-control.tsx");
/* harmony import */ var _attributes_control__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./attributes-control */ "./blocks/product-collection/edit/inspector-controls/attributes-control.tsx");
/* harmony import */ var _taxonomy_controls__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./taxonomy-controls */ "./blocks/product-collection/edit/inspector-controls/taxonomy-controls/index.tsx");
/* harmony import */ var _hand_picked_products_control__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./hand-picked-products-control */ "./blocks/product-collection/edit/inspector-controls/hand-picked-products-control.tsx");
/* harmony import */ var _layout_options_control__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./layout-options-control */ "./blocks/product-collection/edit/inspector-controls/layout-options-control.tsx");
/* harmony import */ var _featured_products_control__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./featured-products-control */ "./blocks/product-collection/edit/inspector-controls/featured-products-control.tsx");
/* harmony import */ var _created_control__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./created-control */ "./blocks/product-collection/edit/inspector-controls/created-control.tsx");
/* harmony import */ var _price_range_control__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./price-range-control */ "./blocks/product-collection/edit/inspector-controls/price-range-control/index.tsx");
/* harmony import */ var _linked_product_control__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./linked-product-control */ "./blocks/product-collection/edit/inspector-controls/linked-product-control.tsx");
/* harmony import */ var _width_options_control__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./width-options-control */ "./blocks/product-collection/edit/inspector-controls/width-options-control.tsx");
/* harmony import */ var _related_by_control__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./related-by-control */ "./blocks/product-collection/edit/inspector-controls/related-by-control.tsx");
/* harmony import */ var _products_per_page_control__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./products-per-page-control */ "./blocks/product-collection/edit/inspector-controls/products-per-page-control.tsx");
/* harmony import */ var _offset_control__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./offset-control */ "./blocks/product-collection/edit/inspector-controls/offset-control.tsx");
/* harmony import */ var _max_pages_to_show_control__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./max-pages-to-show-control */ "./blocks/product-collection/edit/inspector-controls/max-pages-to-show-control.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__);
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
  const tracksLocation = (0,_tracks_utils__WEBPACK_IMPORTED_MODULE_9__.useTracksLocation)(context.templateSlug);
  const trackInteraction = filter => Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('blocks_product_collection_inspector_control_clicked', {
    collection: attributes.collection,
    location: tracksLocation,
    filter
  });
  const inherit = query?.inherit || false;
  const shouldShowFilter = prepareShouldShowFilter(hideControls);
  const isArchiveTemplate = tracksLocation === 'product-catalog' || tracksLocation === 'product-archive';

  // Carousel layout influences the visibility and behavior of some controls.
  const isCarouselLayout = displayLayout?.type === _types__WEBPACK_IMPORTED_MODULE_10__.LayoutOptions.CAROUSEL;
  (0,_use_carousel_layout_adjustments__WEBPACK_IMPORTED_MODULE_15__["default"])(clientId, attributes);
  const showCustomQueryControls = inherit === false;
  const showInheritQueryControl = isArchiveTemplate && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.INHERIT);
  const showFilterableControl = !isArchiveTemplate && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.FILTERABLE);
  const showCustomOrderControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.ORDER);
  const showDefaultOrderControl = !showCustomQueryControls;
  const showOffsetControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.OFFSET);
  const showColumnsControl = !isCarouselLayout;
  const showMaxPagesToShowControl = showCustomQueryControls && !isCarouselLayout && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.MAX_PAGES_TO_SHOW);
  const showProductsPerPageControl = showCustomQueryControls && shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.PRODUCTS_PER_PAGE);
  const showOnSaleControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.ON_SALE);
  const showStockStatusControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.STOCK_STATUS);
  const showHandPickedProductsControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.HAND_PICKED);
  const showKeywordControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.KEYWORD);
  const showAttributesControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.ATTRIBUTES);
  const showTaxonomyControls = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.TAXONOMY);
  const showFeaturedControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.FEATURED);
  const showCreatedControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.CREATED);
  const showPriceRangeControl = shouldShowFilter(_types__WEBPACK_IMPORTED_MODULE_10__.CoreFilterNames.PRICE_RANGE);
  const setQueryAttributeBind = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => _utils__WEBPACK_IMPORTED_MODULE_11__.setQueryAttribute.bind(null, props), [props]);
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_linked_product_control__WEBPACK_IMPORTED_MODULE_28__["default"], {
      query: props.attributes.query,
      setAttributes: props.setAttributes,
      usesReference: props.usesReference,
      location: props.location
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.__experimentalToolsPanel, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'woocommerce'),
      resetAll: () => {
        const defaultSettings = (0,_utils__WEBPACK_IMPORTED_MODULE_11__.getDefaultSettings)(props.attributes);
        props.setAttributes(defaultSettings);
      },
      className: "wc-block-editor-product-collection__settings_panel",
      children: [showInheritQueryControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_use_page_context_control__WEBPACK_IMPORTED_MODULE_14__.InheritQueryControl, {
        ...queryControlProps
      }), showFilterableControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_use_page_context_control__WEBPACK_IMPORTED_MODULE_14__.FilterableControl, {
        ...queryControlProps
      }), showCustomOrderControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_order_by_control_custom_query_order_by_control__WEBPACK_IMPORTED_MODULE_17__["default"], {
        ...queryControlProps
      }), showDefaultOrderControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_order_by_control_default_query_order_by_control__WEBPACK_IMPORTED_MODULE_16__["default"], {
        trackInteraction: trackInteraction
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_layout_options_control__WEBPACK_IMPORTED_MODULE_24__["default"], {
        ...displayControlProps
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_width_options_control__WEBPACK_IMPORTED_MODULE_29__["default"], {
        ...dimensionsControlProps
      }), showProductsPerPageControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_products_per_page_control__WEBPACK_IMPORTED_MODULE_31__["default"], {
        ...queryControlProps,
        carouselVariant: isCarouselLayout
      }), showColumnsControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_columns_control__WEBPACK_IMPORTED_MODULE_13__["default"], {
        ...displayControlProps
      }), showOffsetControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_offset_control__WEBPACK_IMPORTED_MODULE_32__["default"], {
        ...queryControlProps
      }), showMaxPagesToShowControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_max_pages_to_show_control__WEBPACK_IMPORTED_MODULE_33__["default"], {
        ...queryControlProps
      })]
    }), showCustomQueryControls ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.__experimentalToolsPanel, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filters', 'woocommerce'),
      resetAll: resetAllFilters => {
        resetAllFilters.forEach(resetFilter => {
          resetFilter();
        });
      },
      className: "wc-block-editor-product-collection-inspector-toolspanel__filters",
      children: [showOnSaleControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_on_sale_control__WEBPACK_IMPORTED_MODULE_18__["default"], {
        ...queryControlProps
      }), showStockStatusControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_stock_status_control__WEBPACK_IMPORTED_MODULE_19__["default"], {
        ...queryControlProps
      }), showHandPickedProductsControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_hand_picked_products_control__WEBPACK_IMPORTED_MODULE_23__["default"], {
        ...queryControlProps
      }), showKeywordControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_keyword_control__WEBPACK_IMPORTED_MODULE_20__["default"], {
        ...queryControlProps
      }), showAttributesControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_attributes_control__WEBPACK_IMPORTED_MODULE_21__["default"], {
        ...queryControlProps
      }), showTaxonomyControls && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_taxonomy_controls__WEBPACK_IMPORTED_MODULE_22__["default"], {
        ...queryControlProps,
        collection: collection,
        renderMode: "panel"
      }), showFeaturedControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_featured_products_control__WEBPACK_IMPORTED_MODULE_25__["default"], {
        ...queryControlProps
      }), showCreatedControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_created_control__WEBPACK_IMPORTED_MODULE_26__["default"], {
        ...queryControlProps
      }), showPriceRangeControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_price_range_control__WEBPACK_IMPORTED_MODULE_27__["default"], {
        ...queryControlProps
      })]
    }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_woocommerce_editor_components_ces_feedback_button__WEBPACK_IMPORTED_MODULE_6__.CesFeedbackButton, {
      blockName: `${_block_json__WEBPACK_IMPORTED_MODULE_8__.title} block`,
      wrapper: _wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductCollectionInspectorControls);
const isProductCollection = blockName => blockName === _block_json__WEBPACK_IMPORTED_MODULE_8__.name;
const lessThanThresholdSinceUpdate = t => {
  // Xh * 60m * 60s * 1000ms
  const xHoursFromT = t + _woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__.HOURS_TO_DISPLAY_UPGRADE_NOTICE * 60 * 60 * 1000;
  return Date.now() < xHoursFromT;
};
const displayedLessThanThreshold = (displayCount = 0) => {
  return displayCount <= _woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__.UPGRADE_NOTICE_DISPLAY_COUNT_THRESHOLD;
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
  } = (0,_woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__.getUpgradeStatus)();
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
  } = (0,_woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__.getUpgradeStatus)();
  return convertedFromProducts && (status === 'seen' || !lessThanThresholdSinceUpdate(time) || !displayedLessThanThreshold(displayCount));
};
const CollectionSpecificControls = props => {
  const {
    collection
  } = props.attributes;
  const setQueryAttributeBind = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => _utils__WEBPACK_IMPORTED_MODULE_11__.setQueryAttribute.bind(null, props), [props]);
  const tracksLocation = (0,_tracks_utils__WEBPACK_IMPORTED_MODULE_9__.useTracksLocation)(props.context.templateSlug);
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
  const isByCategoryOrTag = collection === _types__WEBPACK_IMPORTED_MODULE_10__.CoreCollectionNames.BY_CATEGORY || collection === _types__WEBPACK_IMPORTED_MODULE_10__.CoreCollectionNames.BY_TAG;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
    children: [
    /**
     * "Hand-Picked" collection-specific controls.
     */
    collection === _types__WEBPACK_IMPORTED_MODULE_10__.CoreCollectionNames.HAND_PICKED && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_hand_picked_products_control__WEBPACK_IMPORTED_MODULE_23__.HandPickedProductsControlField, {
        ...queryControlProps
      })
    }),
    /**
     * "Related Products" collection-specific controls.
     */
    collection === _types__WEBPACK_IMPORTED_MODULE_10__.CoreCollectionNames.RELATED && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_related_by_control__WEBPACK_IMPORTED_MODULE_30__["default"], {
      ...queryControlProps
    }),
    /**
     * "Category and Tag" collection-specific controls.
     */
    isByCategoryOrTag && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_taxonomy_controls__WEBPACK_IMPORTED_MODULE_22__["default"], {
        ...queryControlProps,
        collection: collection,
        renderMode: "standalone"
      })
    })]
  });
};
const withCollectionSpecificControls = BlockEdit => props => {
  if (!isProductCollection(props.name)) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(BlockEdit, {
      ...props
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(CollectionSpecificControls, {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(BlockEdit, {
      ...props
    })]
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)('editor.BlockEdit', _block_json__WEBPACK_IMPORTED_MODULE_8__.name, withCollectionSpecificControls);
const withUpgradeNoticeControls = BlockEdit => props => {
  if (!isProductCollection(props.name)) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(BlockEdit, {
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.Fragment, {
    children: [displayUpgradeNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(_upgrade_notice__WEBPACK_IMPORTED_MODULE_12__["default"], {
        revertMigration: _woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_4__.revertMigration
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_34__.jsx)(BlockEdit, {
      ...props
    })]
  });
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_3__.addFilter)('editor.BlockEdit', _block_json__WEBPACK_IMPORTED_MODULE_8__.name, withUpgradeNoticeControls);

/***/ }),

/***/ "./blocks/product-collection/edit/inspector-controls/keyword-control.tsx":
/*!*******************************************************************************!*\
  !*** ./blocks/product-collection/edit/inspector-controls/keyword-control.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_editor_components_product_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/editor-components/product-control */ "../node_modules/woocommerce-blocks/js/editor-components/product-control/index.tsx");
/* harmony import */ var _woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/block-settings */ "../node_modules/woocommerce-blocks/js/settings/blocks/index.ts");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils */ "./blocks/product-collection/utils.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
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
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Spinner, {});
  }
  const showPlaceholder = !product;
  const showPlaceholderImg = showPlaceholder || !product?.images?.[0]?.src;
  const imgSrc = showPlaceholderImg ? `${_woocommerce_block_settings__WEBPACK_IMPORTED_MODULE_2__.WC_BLOCKS_IMAGE_URL}/blocks/product-collection/placeholder.svg` : product.images[0].src;
  const imgAlt = showPlaceholderImg ? '' : product?.name;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Button, {
    className: "wc-block-product-collection-linked-product-control__button",
    onClick: onToggle,
    "aria-expanded": isOpen,
    disabled: isLoading,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Flex, {
      direction: "row",
      expanded: true,
      justify: "flex-start",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.FlexItem, {
        className: "wc-block-product-collection-linked-product-control__image-container",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
          src: imgSrc,
          alt: imgAlt
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Flex, {
        direction: "column",
        align: "flex-start",
        gap: 1,
        className: "wc-block-product-collection-linked-product-control__content",
        children: showPlaceholder ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.FlexItem, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.__experimentalText, {
            color: "inherit",
            lineHeight: 1,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select product', 'woocommerce')
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.__experimentalText, {
              color: "inherit",
              lineHeight: 1,
              children: product?.name ? (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__.decodeEntities)(product.name) : ''
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.__experimentalText, {
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
}) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_woocommerce_editor_components_product_control__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_7__.useGetProduct)(productReference);
  const [isDropdownOpen, setIsDropdownOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [radioControlState, setRadioControlState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)((isProductLocation || isCartLocation || isOrderLocation) && (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(productReference) ? PRODUCT_REFERENCE_TYPE.CURRENT_PRODUCT : PRODUCT_REFERENCE_TYPE.SPECIFIC_PRODUCT);
  const prevReference = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(undefined);
  const showRadioControl = isProductLocation && hasProductReference || isCartLocation && hasCartReference || isOrderLocation && hasOrderReference;
  const showSpecificProductSelector = showRadioControl ? radioControlState === PRODUCT_REFERENCE_TYPE.SPECIFIC_PRODUCT : !(0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_4__.isEmpty)(productReference);
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
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Linked Product', 'woocommerce'),
    children: [showRadioControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelRow, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.RadioControl, {
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
    }), showSpecificProductSelector && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelRow, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Dropdown, {
        className: "wc-block-product-collection-linked-product-control",
        contentClassName: "wc-block-product-collection-linked-product__popover-content",
        popoverProps: {
          placement: 'left-start'
        },
        renderToggle: ({
          isOpen,
          onToggle
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(ProductButton, {
          isOpen: isOpen,
          onToggle: onToggle,
          product: product,
          isLoading: isLoading
        }),
        renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(LinkedProductPopoverContent, {
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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
/* harmony import */ var _woocommerce_blocks_product_collection_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @woocommerce/blocks/product-collection/types */ "../node_modules/woocommerce-blocks/js/blocks/product-collection/types.ts");
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
    trackInteraction(_woocommerce_blocks_product_collection_types__WEBPACK_IMPORTED_MODULE_4__.CoreFilterNames.DEFAULT_ORDER);
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_base_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/base-hooks */ "../node_modules/woocommerce-blocks/js/base/hooks/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @woocommerce/blocks/migration-products-to-product-collection */ "../node_modules/woocommerce-blocks/js/blocks/migration-products-to-product-collection/index.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@woocommerce/tracks'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _woocommerce_editor_components_upgrade_downgrade_notice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @woocommerce/editor-components/upgrade-downgrade-notice */ "../node_modules/woocommerce-blocks/js/editor-components/upgrade-downgrade-notice/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * External dependencies
 */







const notice = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createInterpolateElement)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Products (Beta) block was upgraded to <strongText />, an updated version with new features and simplified settings.', 'woocommerce'), {
  strongText: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Product Collection`, 'woocommerce')
  })
});
const buttonLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Revert to Products (Beta)', 'woocommerce');
const UpgradeNotice = ({
  revertMigration
}) => {
  const [upgradeNoticeStatus, setUpgradeNoticeStatus] = (0,_woocommerce_base_hooks__WEBPACK_IMPORTED_MODULE_1__.useLocalStorageState)(_woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_3__.MIGRATION_STATUS_LS_KEY, (0,_woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_3__.getInitialStatusLSValue)());
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
        (0,_woocommerce_blocks_migration_products_to_product_collection__WEBPACK_IMPORTED_MODULE_3__.incrementUpgradeStatusDisplayCount)();
        canCountDisplays.current = false;
      }
    };
    return countDisplay;
  }, [canCountDisplays]);
  return status === 'notseen' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_woocommerce_editor_components_upgrade_downgrade_notice__WEBPACK_IMPORTED_MODULE_5__.UpgradeDowngradeNotice, {
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

"use strict";
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
/* harmony import */ var _woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @woocommerce/utils */ "../node_modules/woocommerce-blocks/js/utils/index.ts");
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
  const productTemplateBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.productTemplateBlockName);
  const paginationBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.coreQueryPaginationBlockName);
  const headingBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.headingBlockName);
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
  const productTemplateBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.productTemplateBlockName);

  // 1. Grid and List layouts are handled manually for now so we need to reset it to an empty object.
  updateBlockAttributes(productTemplateBlock?.clientId, productTemplateOtherLayouts);

  // 2. Remove the next/previous buttons block or group block
  // Find the group block containing the next/previous buttons block
  const groupBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockBy)(productCollectionBlock, block => {
    return block.name === 'core/group' && block.innerBlocks.some(innerBlock => innerBlock.name === _constants__WEBPACK_IMPORTED_MODULE_5__.nextPreviousButtonsBlockName);
  });
  if (groupBlock) {
    // If next/previous buttons block is the only block in the group block, remove it
    if (groupBlock.innerBlocks.length === 1) {
      removeBlock(groupBlock.clientId, false);
    } else {
      const headingBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(groupBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.headingBlockName);

      // If next/previous buttons and heading are the only blocks in the group block, bring back heading block
      if (headingBlock && groupBlock.innerBlocks.length === 2) {
        const headingBlockIndex = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store
        // @ts-expect-error getBlockIndex is not typed.
        ).getBlockIndex(headingBlock.clientId);
        removeBlock(groupBlock.clientId, false);
        insertBlock(headingBlock, headingBlockIndex, productCollectionBlock.clientId, false);
        // Otherwise remove next previous buttons block and keep the content
      } else {
        const nextPrevButtonsBlock = (0,_woocommerce_utils__WEBPACK_IMPORTED_MODULE_4__.getInnerBlockByName)(productCollectionBlock, _constants__WEBPACK_IMPORTED_MODULE_5__.nextPreviousButtonsBlockName);
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilterableControl: () => (/* binding */ FilterableControl),
/* harmony export */   InheritQueryControl: () => (/* binding */ InheritQueryControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _woocommerce_base_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @woocommerce/base-hooks */ "../node_modules/woocommerce-blocks/js/base/hooks/index.js");
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
  const queryObjectBeforeInheritEnabled = (0,_woocommerce_base_hooks__WEBPACK_IMPORTED_MODULE_1__.usePrevious)(query, value => {
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";
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
/* harmony import */ var _woocommerce_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @woocommerce/types */ "../node_modules/woocommerce-blocks/js/types/index.ts");
/* harmony import */ var _woocommerce_editor_components_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @woocommerce/editor-components/utils */ "../node_modules/woocommerce-blocks/js/editor-components/utils/index.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types */ "./blocks/product-collection/types.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./constants */ "./blocks/product-collection/constants.ts");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./block.json */ "./blocks/product-collection/block.json");
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
    return ARCHIVE_PRODUCT_TEMPLATES.some(template => (0,_woocommerce_types__WEBPACK_IMPORTED_MODULE_7__.isString)(currentTemplateId) ? currentTemplateId.includes(template) : false);
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
    if (blockName !== _constants__WEBPACK_IMPORTED_MODULE_11__.coreQueryPaginationBlockName) {
      return blockSettings;
    }
    if (blockSettings?.ancestor) {
      return {
        ...blockSettings,
        ancestor: [...blockSettings.ancestor, _block_json__WEBPACK_IMPORTED_MODULE_12__.name]
      };
    }

    // Below condition is to support WP >=6.4 where Pagination specifies the parent.
    // Can be removed when minimum WP version is set to 6.5 and higher.
    if (blockSettings?.parent) {
      return {
        ...blockSettings,
        parent: [...blockSettings.parent, _block_json__WEBPACK_IMPORTED_MODULE_12__.name]
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
      return _types__WEBPACK_IMPORTED_MODULE_10__.ProductCollectionUIStatesInEditor.PRODUCT_REFERENCE_PICKER;
    }

    // Case 2: Deleted product reference
    if (isCollectionSelected && isProductContextRequired && !isInRequiredLocation && isProductContextSelected) {
      const isProductDeleted = productReference && (product === undefined || product?.status === 'trash');
      if (isProductDeleted) {
        return _types__WEBPACK_IMPORTED_MODULE_10__.ProductCollectionUIStatesInEditor.DELETED_PRODUCT_REFERENCE;
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
        return _types__WEBPACK_IMPORTED_MODULE_10__.ProductCollectionUIStatesInEditor.VALID_WITH_PREVIEW;
      }
    }

    /**
     * Case 4: Collection chooser
     */
    if (!hasInnerBlocks && !isCollectionSelected) {
      return _types__WEBPACK_IMPORTED_MODULE_10__.ProductCollectionUIStatesInEditor.COLLECTION_PICKER;
    }
    return _types__WEBPACK_IMPORTED_MODULE_10__.ProductCollectionUIStatesInEditor.VALID;
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
  orderBy: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_QUERY.orderBy,
  order: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_QUERY.order,
  inherit: getDefaultValueOfInherit(),
  filterable: getDefaultValueOfFilterable(),
  perPage: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_QUERY.perPage,
  offset: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_QUERY.offset,
  pages: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_QUERY.pages
});
const getDefaultDisplayLayout = () => _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_ATTRIBUTES.displayLayout;
const getDefaultSettings = currentAttributes => ({
  displayLayout: getDefaultDisplayLayout(),
  query: getDefaultQueryForSettingsSection(currentAttributes.query),
  dimensions: _constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_ATTRIBUTES.dimensions
});
const getDefaultProductCollection = () => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_9__.createBlock)(_block_json__WEBPACK_IMPORTED_MODULE_12__.name, {
  ..._constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_ATTRIBUTES,
  query: {
    ..._constants__WEBPACK_IMPORTED_MODULE_11__.DEFAULT_ATTRIBUTES.query,
    inherit: getDefaultValueOfInherit(),
    filterable: getDefaultValueOfFilterable()
  }
}, (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_9__.createBlocksFromInnerBlocksTemplate)(_constants__WEBPACK_IMPORTED_MODULE_11__.INNER_BLOCKS_TEMPLATE));
const useGetProduct = productId => {
  const [product, setProduct] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(null);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const fetchProduct = async () => {
      if (productId) {
        setIsLoading(true);
        try {
          const fetchedProduct = await (0,_woocommerce_editor_components_utils__WEBPACK_IMPORTED_MODULE_8__.getProduct)(productId);
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

"use strict";
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

"use strict";
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

"use strict";
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

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/calendar.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/calendar.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/category.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/category.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/chart-bar.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chart-bar.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/heading.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/heading.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/info.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/info.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/loop.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/loop.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/page.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/page.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/percent.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/percent.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/reusable-block.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/reusable-block.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-empty.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-empty.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/star-filled.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/star-filled.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/trending-up.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trending-up.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ }),

/***/ "./node_modules/fast-deep-equal/es6/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-deep-equal/es6/index.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


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
      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      for (i of a.entries()) if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (i of a.entries()) if (!b.has(i[0])) return false;
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;) if (a[i] !== b[i]) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;
    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }
    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
};

/***/ }),

/***/ "@wordpress/a11y":
/*!******************************!*\
  !*** external ["wp","a11y"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["a11y"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/autop":
/*!*******************************!*\
  !*** external ["wp","autop"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["autop"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/deprecated":
/*!************************************!*\
  !*** external ["wp","deprecated"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["deprecated"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["editor"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/escape-html":
/*!************************************!*\
  !*** external ["wp","escapeHtml"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["escapeHtml"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/html-entities":
/*!**************************************!*\
  !*** external ["wp","htmlEntities"] ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["htmlEntities"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/is-shallow-equal":
/*!****************************************!*\
  !*** external ["wp","isShallowEqual"] ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["isShallowEqual"];

/***/ }),

/***/ "@wordpress/notices":
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["notices"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "@wordpress/style-engine":
/*!*************************************!*\
  !*** external ["wp","styleEngine"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["styleEngine"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["url"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
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