/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/product-collection/legacy-events.ts":
/*!****************************************************!*\
  !*** ./blocks/product-collection/legacy-events.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dispatchEvent: () => (/* binding */ dispatchEvent),
/* harmony export */   triggerProductListRenderedEvent: () => (/* binding */ triggerProductListRenderedEvent),
/* harmony export */   triggerViewedProductEvent: () => (/* binding */ triggerViewedProductEvent)
/* harmony export */ });
//  TODO - move this to shared code once the product collection block is converted to use script modules.
/**
 * Internal dependencies
 */

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

/***/ }),

/***/ "./blocks/product-collection/style.scss":
/*!**********************************************!*\
  !*** ./blocks/product-collection/style.scss ***!
  \**********************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined mixin.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m7  │\u001b[0m \u001b[31m┌\u001b[0m         \u001b[31m@include breakpoint(\"<600px\") {\u001b[0m\n\u001b[34m8  │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            // This rule is overriding a `display: flex` from WordPress core, that's\u001b[0m\n\u001b[34m9  │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            // why it needs a higher specificity.\u001b[0m\n\u001b[34m10 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            :where(.wc-block-next-previous-buttons.wc-block-next-previous-buttons) {\u001b[0m\n\u001b[34m11 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m                display: none;\u001b[0m\n\u001b[34m12 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            }\u001b[0m\n\u001b[34m13 │\u001b[0m \u001b[31m└\u001b[0m \u001b[31m        }\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  blocks\\product-collection\\style.scss 7:3  root stylesheet\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:87:9)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\Hook.js:21:14)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n-- inner error --\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\nUndefined mixin.\n\u001b[34m   ╷\u001b[0m\n\u001b[34m7  │\u001b[0m \u001b[31m┌\u001b[0m         \u001b[31m@include breakpoint(\"<600px\") {\u001b[0m\n\u001b[34m8  │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            // This rule is overriding a `display: flex` from WordPress core, that's\u001b[0m\n\u001b[34m9  │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            // why it needs a higher specificity.\u001b[0m\n\u001b[34m10 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            :where(.wc-block-next-previous-buttons.wc-block-next-previous-buttons) {\u001b[0m\n\u001b[34m11 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m                display: none;\u001b[0m\n\u001b[34m12 │\u001b[0m \u001b[31m│\u001b[0m \u001b[31m            }\u001b[0m\n\u001b[34m13 │\u001b[0m \u001b[31m└\u001b[0m \u001b[31m        }\u001b[0m\n\u001b[34m   ╵\u001b[0m\n  blocks\\product-collection\\style.scss 7:3  root stylesheet\n    at Object.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\blocks\\product-collection\\style.scss:1:7)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\javascript\\JavascriptModulesPlugin.js:544:10\n    at Hook.eval [as call] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at Hook.CALL_DELEGATE [as _call] (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\Hook.js:16:14)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5517:39\n    at tryRunOrWebpackError (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:82:7)\n    at __webpack_require_module__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5515:12)\n    at __webpack_require__ (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5462:18)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5550:20\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\Hook.js:21:14)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5437:43\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5399:16\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5367:15\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3485:9)\n    at done (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3527:9)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5313:8\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3713:6\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\HookWebpackError.js:68:2\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:15:1)\n    at Cache.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:113:20)\n    at ItemCacheFacade.store (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:142:15)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3712:11\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:34\n    at Array.<anonymous> (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\cache\\MemoryCachePlugin.js:46:13)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:97:19\n    at Hook.eval [as callAsync] (eval at create (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\tapable\\lib\\HookCodeFactory.js:31:10), <anonymous>:19:1)\n    at Cache.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Cache.js:81:18)\n    at ItemCacheFacade.get (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:3680:9)\n    at codeGen (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5301:11)\n    at symbolIterator (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3482:9)\n    at timesSync (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:2297:7)\n    at Object.eachLimit (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\neo-async\\async.js:3463:5)\n    at C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\Compilation.js:5331:14\n    at processQueue (C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\webpack\\lib\\util\\processAsyncTree.js:61:4)\n    at processTicksAndRejections (node:internal/process/task_queues:77:11)\n    at runNextTicks (node:internal/process/task_queues:64:3)\n    at process.processImmediate (node:internal/timers:454:9)\n\nGenerated code for C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\css-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\postcss-loader\\dist\\cjs.js!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\node_modules\\sass-loader\\dist\\cjs.js??ruleSet[1].rules[2].use[3]!C:\\Users\\puleeno\\Projects\\CheepHub\\public_html\\wp-content\\themes\\cheephub\\resources\\blocks\\product-collection\\style.scss\n1 | throw new Error(\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nUndefined mixin.\\n\\u001b[34m   ╷\\u001b[0m\\n\\u001b[34m7  │\\u001b[0m \\u001b[31m┌\\u001b[0m         \\u001b[31m@include breakpoint(\\\"<600px\\\") {\\u001b[0m\\n\\u001b[34m8  │\\u001b[0m \\u001b[31m│\\u001b[0m \\u001b[31m            // This rule is overriding a `display: flex` from WordPress core, that's\\u001b[0m\\n\\u001b[34m9  │\\u001b[0m \\u001b[31m│\\u001b[0m \\u001b[31m            // why it needs a higher specificity.\\u001b[0m\\n\\u001b[34m10 │\\u001b[0m \\u001b[31m│\\u001b[0m \\u001b[31m            :where(.wc-block-next-previous-buttons.wc-block-next-previous-buttons) {\\u001b[0m\\n\\u001b[34m11 │\\u001b[0m \\u001b[31m│\\u001b[0m \\u001b[31m                display: none;\\u001b[0m\\n\\u001b[34m12 │\\u001b[0m \\u001b[31m│\\u001b[0m \\u001b[31m            }\\u001b[0m\\n\\u001b[34m13 │\\u001b[0m \\u001b[31m└\\u001b[0m \\u001b[31m        }\\u001b[0m\\n\\u001b[34m   ╵\\u001b[0m\\n  blocks\\\\product-collection\\\\style.scss 7:3  root stylesheet\");");

/***/ }),

/***/ "@wordpress/interactivity":
/*!***************************************!*\
  !*** external ["wp","interactivity"] ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["interactivity"];

/***/ }),

/***/ "@wordpress/interactivity-router":
/*!*********************************************!*\
  !*** external ["wp","interactivityRouter"] ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["interactivityRouter"];

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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/*!***********************************************!*\
  !*** ./blocks/product-collection/frontend.ts ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _legacy_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legacy-events */ "./blocks/product-collection/legacy-events.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./blocks/product-collection/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * Internal dependencies
 */


// @wordpress/i18n is not available on the frontend.
function isRTL() {
  return document.documentElement?.dir === 'rtl';
}
function isValidLink(ref) {
  return ref !== null && ref instanceof window.HTMLAnchorElement && !!ref.href && (!ref.target || ref.target === '_self') && ref.origin === window.location.origin;
}
const checkIfButtonsDisabled = (productTemplate, currentScroll) => {
  if (!productTemplate) {
    return {
      isDisabledPrevious: true,
      isDisabledNext: true
    };
  }
  const SCROLL_OFFSET = 5;
  const {
    scrollWidth,
    clientWidth
  } = productTemplate;
  if (isRTL()) {
    return {
      isDisabledPrevious: currentScroll > -SCROLL_OFFSET,
      isDisabledNext: currentScroll <= clientWidth - scrollWidth + SCROLL_OFFSET
    };
  }
  return {
    isDisabledPrevious: currentScroll < SCROLL_OFFSET,
    isDisabledNext: currentScroll >= scrollWidth - clientWidth - SCROLL_OFFSET
  };
};

/**
 * Scrolls the carousel by 90% of the container width and updates
 * the isDisabledPrevious and isDisabledNext context values.
 *
 * @param direction - The direction to scroll.
 */
const scrollCarousel = direction => {
  const {
    ref
  } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
  const productCollection = ref?.closest('.wp-block-woocommerce-product-collection');
  const productTemplate = productCollection?.querySelector('.wc-block-product-template');
  if (!productTemplate) {
    return;
  }
  const productCollectionWidth = productCollection?.clientWidth;
  // Arbitrary value to scroll the carousel by 90% of the container width.
  const scrollBy = productCollectionWidth ? 0.9 * productCollectionWidth : 400;
  const multiplier = isRTL() ? -1 : 1;
  productTemplate?.scrollBy({
    left: multiplier * (direction === 'left' ? -scrollBy : scrollBy),
    behavior: 'smooth'
  });
  const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
  const {
    scrollLeft
  } = productTemplate;
  // scrollBy doesn't return the final position, so we need to calculate it.
  const finalPosition = direction === 'left' ? scrollLeft - multiplier * scrollBy : scrollLeft + multiplier * scrollBy;
  const {
    isDisabledPrevious,
    isDisabledNext
  } = checkIfButtonsDisabled(productTemplate, finalPosition);
  context.isDisabledPrevious = isDisabledPrevious;
  context.isDisabledNext = isDisabledNext;
};
const onKeyDown = event => {
  if (event.code === 'ArrowRight') {
    event.preventDefault();
    scrollCarousel('right');
  }
  if (event.code === 'ArrowLeft') {
    event.preventDefault();
    scrollCarousel('left');
  }
};
function isValidEvent(event) {
  return event.button === 0 &&
  // Left clicks only.
  !event.metaKey &&
  // Open in new tab (Mac).
  !event.ctrlKey &&
  // Open in new tab (Windows).
  !event.altKey &&
  // Download.
  !event.shiftKey && !event.defaultPrevented;
}
const productCollectionStore = {
  actions: {
    *navigate(event) {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (isValidLink(ref) && isValidEvent(event)) {
        event.preventDefault();
        const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
        const routerRegionId = ref.closest('[data-wp-router-region]')?.getAttribute('data-wp-router-region');
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.navigate(ref.href);
        ctx.isPrefetchNextOrPreviousLink = ref.href;

        // Moves focus to the product link.
        const product = document.querySelector(`[data-wp-router-region=${routerRegionId}] .wc-block-product-template .wc-block-product a`);
        product?.focus();
        (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerProductListRenderedEvent)({
          collection: ctx.collection
        });
      }
    },
    /**
     * We prefetch the next or previous button page on hover.
     * Optimizes user experience by preloading content for faster access.
     */
    *prefetchOnHover() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (isValidLink(ref)) {
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.prefetch(ref.href);
      }
    },
    *viewProduct() {
      const {
        collection,
        productId
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (productId) {
        (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerViewedProductEvent)({
          collection,
          productId
        });
      }
    },
    // Next/Previous Buttons block actions
    onClickPrevious: () => {
      scrollCarousel('left');
    },
    onClickNext: () => {
      scrollCarousel('right');
    },
    onKeyDownPrevious: event => {
      onKeyDown(event);
    },
    onKeyDownNext: event => {
      onKeyDown(event);
    },
    watchScroll: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      if (ref) {
        const {
          isDisabledPrevious,
          isDisabledNext
        } = checkIfButtonsDisabled(ref, ref.scrollLeft);
        context.isDisabledPrevious = isDisabledPrevious;
        context.isDisabledNext = isDisabledNext;
      }
    }
  },
  callbacks: {
    /**
     * Prefetches content for next or previous links after initial user interaction.
     * Reduces perceived load times for subsequent page navigations.
     */
    *prefetch() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (isValidLink(ref) && context.isPrefetchNextOrPreviousLink) {
        const {
          actions
        } = yield Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! @wordpress/interactivity-router */ "@wordpress/interactivity-router", 23));
        yield actions.prefetch(ref.href);
      }
    },
    *onRender() {
      const {
        collection
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      (0,_legacy_events__WEBPACK_IMPORTED_MODULE_1__.triggerProductListRenderedEvent)({
        collection
      });
    },
    initResizeObserver: () => {
      const scrollableElement = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)()?.ref;
      if (!scrollableElement) {
        return;
      }
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const observer = new ResizeObserver(() => {
        const hasOverflowX = scrollableElement.scrollWidth > scrollableElement.clientWidth;
        context.hideNextPreviousButtons = !hasOverflowX;
      });
      observer.observe(scrollableElement);
    }
  }
};
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('woocommerce/product-collection', productCollectionStore, {
  lock: true
});
})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map