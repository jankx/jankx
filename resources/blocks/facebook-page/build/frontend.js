/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!******************************************!*\
  !*** ./blocks/facebook-page/frontend.ts ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
function ensureFacebookRoot() {
  let root = document.getElementById('fb-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'fb-root';
    document.body.prepend(root);
  }
}
function loadFacebookSDK(locale) {
  if (window.FB) {
    return;
  }
  ensureFacebookRoot();
  const id = 'facebook-jssdk';
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=v19.0`;
  document.body.appendChild(script);
}
function initXFBML(container) {
  const fbDiv = container.querySelector('.fb-page');
  if (!fbDiv) return;
  const locale = fbDiv.dataset.locale || 'vi_VN';
  loadFacebookSDK(locale);
  const FB = window.FB;
  if (FB && typeof FB.XFBML?.parse === 'function') {
    FB.XFBML.parse(container);
  }
}
function setup() {
  const blocks = document.querySelectorAll('.jankx-facebook-page');
  blocks.forEach(el => initXFBML(el));
}
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setup();
} else {
  document.addEventListener('DOMContentLoaded', setup);
}

/******/ })()
;
//# sourceMappingURL=frontend.js.map