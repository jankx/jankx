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
/*!****************************************!*\
  !*** ./blocks/plyr-player/frontend.ts ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'plyr/dist/plyr'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

function safeParseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}
function initPlyrPlayers() {
  const wrappers = document.querySelectorAll('.plyr-player-block[data-plyr-block="1"]');
  wrappers.forEach(wrapper => {
    const media = wrapper.querySelector('video.plyr-player__media, audio.plyr-player__media');
    if (!media) return;
    if (media.__plyrInstance) return;
    const config = safeParseJson(wrapper.getAttribute('data-plyr-config'));
    const player = new Object(function webpackMissingModule() { var e = new Error("Cannot find module 'plyr/dist/plyr'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(media, {
      autoplay: !!config?.autoplay,
      muted: !!config?.muted,
      loop: {
        active: !!config?.loop
      }
    });
    media.__plyrInstance = player;
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPlyrPlayers());
} else {
  initPlyrPlayers();
}
document.addEventListener('content-loaded', () => initPlyrPlayers());
if (typeof window.wp !== 'undefined' && window.wp.domReady) {
  window.wp.domReady(() => initPlyrPlayers());
}
/******/ })()
;
//# sourceMappingURL=frontend.js.map