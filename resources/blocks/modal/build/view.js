/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/micromodal/dist/micromodal.es.js":
/*!********************************************************!*\
  !*** ../node_modules/micromodal/dist/micromodal.es.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function e(e, t) {
  for (var o = 0; o < t.length; o++) {
    var n = t[o];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
  }
}
function t(e) {
  return function (e) {
    if (Array.isArray(e)) return o(e);
  }(e) || function (e) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
  }(e) || function (e, t) {
    if (!e) return;
    if ("string" == typeof e) return o(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    "Object" === n && e.constructor && (n = e.constructor.name);
    if ("Map" === n || "Set" === n) return Array.from(e);
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return o(e, t);
  }(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function o(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var o = 0, n = new Array(t); o < t; o++) n[o] = e[o];
  return n;
}
var n,
  i,
  a,
  r,
  s,
  l = (n = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], i = function () {
    function o(e) {
      var n = e.targetModal,
        i = e.triggers,
        a = void 0 === i ? [] : i,
        r = e.onShow,
        s = void 0 === r ? function () {} : r,
        l = e.onClose,
        c = void 0 === l ? function () {} : l,
        d = e.openTrigger,
        u = void 0 === d ? "data-micromodal-trigger" : d,
        f = e.closeTrigger,
        h = void 0 === f ? "data-micromodal-close" : f,
        v = e.openClass,
        g = void 0 === v ? "is-open" : v,
        m = e.disableScroll,
        b = void 0 !== m && m,
        y = e.disableFocus,
        p = void 0 !== y && y,
        w = e.awaitCloseAnimation,
        E = void 0 !== w && w,
        k = e.awaitOpenAnimation,
        M = void 0 !== k && k,
        A = e.debugMode,
        C = void 0 !== A && A;
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, o), this.modal = "string" == typeof n ? document.getElementById(n) : n, this.config = {
        debugMode: C,
        disableScroll: b,
        openTrigger: u,
        closeTrigger: h,
        openClass: g,
        onShow: s,
        onClose: c,
        awaitCloseAnimation: E,
        awaitOpenAnimation: M,
        disableFocus: p
      }, a.length > 0 && this.registerTriggers.apply(this, t(a)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this);
    }
    var i, a, r;
    return i = o, (a = [{
      key: "registerTriggers",
      value: function () {
        for (var e = this, t = arguments.length, o = new Array(t), n = 0; n < t; n++) o[n] = arguments[n];
        o.filter(Boolean).forEach(function (t) {
          t.addEventListener("click", function (t) {
            return e.showModal(t);
          });
        });
      }
    }, {
      key: "showModal",
      value: function () {
        var e = this,
          t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) {
          var o = function t() {
            e.modal.removeEventListener("animationend", t, !1), e.setFocusToFirstNode();
          };
          this.modal.addEventListener("animationend", o, !1);
        } else this.setFocusToFirstNode();
        this.config.onShow(this.modal, this.activeElement, t);
      }
    }, {
      key: "closeModal",
      value: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
          t = this.modal;
        if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e), this.config.awaitCloseAnimation) {
          var o = this.config.openClass;
          this.modal.addEventListener("animationend", function e() {
            t.classList.remove(o), t.removeEventListener("animationend", e, !1);
          }, !1);
        } else t.classList.remove(this.config.openClass);
      }
    }, {
      key: "closeModalByIdOrElement",
      value: function (e) {
        this.modal = "string" == typeof e ? document.getElementById(e) : e, this.modal && this.closeModal();
      }
    }, {
      key: "scrollBehaviour",
      value: function (e) {
        if (this.config.disableScroll) {
          var t = document.querySelector("body");
          switch (e) {
            case "enable":
              Object.assign(t.style, {
                overflow: ""
              });
              break;
            case "disable":
              Object.assign(t.style, {
                overflow: "hidden"
              });
          }
        }
      }
    }, {
      key: "addEventListeners",
      value: function () {
        this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown);
      }
    }, {
      key: "removeEventListeners",
      value: function () {
        this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown);
      }
    }, {
      key: "onClick",
      value: function (e) {
        (e.target.hasAttribute(this.config.closeTrigger) || e.target.parentNode.hasAttribute(this.config.closeTrigger)) && (e.preventDefault(), e.stopPropagation(), this.closeModal(e));
      }
    }, {
      key: "onKeydown",
      value: function (e) {
        27 === e.keyCode && this.closeModal(e), 9 === e.keyCode && this.retainFocus(e);
      }
    }, {
      key: "getFocusableNodes",
      value: function () {
        var e = this.modal.querySelectorAll(n);
        return Array.apply(void 0, t(e));
      }
    }, {
      key: "setFocusToFirstNode",
      value: function () {
        var e = this;
        if (!this.config.disableFocus) {
          var t = this.getFocusableNodes();
          if (0 !== t.length) {
            var o = t.filter(function (t) {
              return !t.hasAttribute(e.config.closeTrigger);
            });
            o.length > 0 && o[0].focus(), 0 === o.length && t[0].focus();
          }
        }
      }
    }, {
      key: "retainFocus",
      value: function (e) {
        var t = this.getFocusableNodes();
        if (0 !== t.length) if (t = t.filter(function (e) {
          return null !== e.offsetParent;
        }), this.modal.contains(document.activeElement)) {
          var o = t.indexOf(document.activeElement);
          e.shiftKey && 0 === o && (t[t.length - 1].focus(), e.preventDefault()), !e.shiftKey && t.length > 0 && o === t.length - 1 && (t[0].focus(), e.preventDefault());
        } else t[0].focus();
      }
    }]) && e(i.prototype, a), r && e(i, r), o;
  }(), a = null, r = function (e) {
    if ("string" == typeof id ? !document.getElementById(e) : !e) return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(e, '"></div>')), !1;
  }, s = function (e, t) {
    if (function (e) {
      e.length <= 0 && (console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'));
    }(e), !t) return !0;
    for (var o in t) r(o);
    return !0;
  }, {
    init: function (e) {
      var o = Object.assign({}, {
          openTrigger: "data-micromodal-trigger"
        }, e),
        n = t(document.querySelectorAll("[".concat(o.openTrigger, "]"))),
        r = function (e, t) {
          var o = [];
          return e.forEach(function (e) {
            var n = e.attributes[t].value;
            void 0 === o[n] && (o[n] = []), o[n].push(e);
          }), o;
        }(n, o.openTrigger);
      if (!0 !== o.debugMode || !1 !== s(n, r)) for (var l in r) {
        var c = r[l];
        o.targetModal = l, o.triggers = t(c), a = new i(o);
      }
    },
    show: function (e, t) {
      var o = t || {};
      o.targetModal = e, !0 === o.debugMode && !1 === r(e) || (a && a.removeEventListeners(), (a = new i(o)).showModal());
    },
    close: function (e) {
      e ? a.closeModalByIdOrElement(e) : a.closeModal();
    }
  });
"undefined" != typeof window && (window.MicroModal = l);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (l);

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
/*!******************************!*\
  !*** ./blocks/modal/view.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromodal */ "../node_modules/micromodal/dist/micromodal.es.js");
/**
 * Modal Block Frontend JavaScript
 *
 * Handles modal functionality using Micromodal library
 */


(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initModals();
  });

  // Initialize global share data object
  window.jankxShareData = window.jankxShareData || {};

  // Simple modal show/hide functions (no external library needed)
  function showModal(modalId, triggerElement) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn('Modal not found:', modalId);
      return;
    }
    const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`);
    const animationType = wrapper ? wrapper.dataset.animationType || 'fade' : 'fade';

    // Collect and share data from trigger element
    if (triggerElement) {
      const shareData = {};

      // Check which data to share based on data attributes
      if (triggerElement.dataset.shareObjectId === 'true' && triggerElement.dataset.currentObjectId) {
        shareData.objectId = triggerElement.dataset.currentObjectId;
      }
      if (triggerElement.dataset.sharePostTitle === 'true' && triggerElement.dataset.currentPostTitle) {
        shareData.postTitle = triggerElement.dataset.currentPostTitle;
      }
      if (triggerElement.dataset.shareCurrentUrl === 'true' && triggerElement.dataset.currentUrl) {
        shareData.currentUrl = triggerElement.dataset.currentUrl;
      }

      // Store in global object with modal ID as key
      if (Object.keys(shareData).length > 0) {
        window.jankxShareData[modalId] = shareData;
      }
    }

    // Set display first, then add classes after a tiny delay to ensure transition works
    modal.style.display = 'block';

    // Use requestAnimationFrame to ensure display is applied before adding classes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('is-open', 'modal-showing', 'modal-animation-' + animationType);
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    // Calculate scrollbar width before hiding
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Store current scroll position
    const scrollY = window.scrollY;

    // Disable scroll - add class to html element
    document.documentElement.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Add padding to prevent layout shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }

    // Store scroll position for restoration
    modal.setAttribute('data-scroll-y', scrollY);

    // Add backdrop blur if enabled
    if (wrapper && (wrapper.dataset.backdropBlur === 'true' || wrapper.dataset.backdropBlur === true)) {
      document.body.classList.add('modal-backdrop-blur');
    }

    // Dispatch event with shared data
    document.dispatchEvent(new CustomEvent('jankx:modal:show', {
      detail: {
        modalId,
        modalElement: modal,
        sharedData: window.jankxShareData[modalId] || {}
      }
    }));
  }
  function stopMediaInModal(modal) {
    // Stop all iframes (YouTube, Vimeo, etc.)
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const src = iframe.src;
      iframe.src = ''; // Clear src to stop playback
      iframe.src = src; // Restore src
    });

    // Pause all HTML5 videos
    const videos = modal.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    // Pause all HTML5 audios
    const audios = modal.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
  function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const wrapper = modal.closest('.wp-block-jankx-modal-wrapper') || document.querySelector(`[data-modal-id="${modalId}"]`);
    const animationType = wrapper ? wrapper.dataset.animationType || 'fade' : 'fade';
    const animationDuration = wrapper ? parseInt(wrapper.dataset.animationDuration) || 300 : 300;

    // Stop all media playback
    stopMediaInModal(modal);

    // Remove classes first to trigger transition
    modal.classList.remove('is-open', 'modal-showing', 'modal-animation-' + animationType);
    modal.setAttribute('aria-hidden', 'true');

    // Wait for animation to complete before hiding
    setTimeout(() => {
      modal.style.display = 'none';
    }, animationDuration);

    // Get stored scroll position
    const scrollY = modal.getAttribute('data-scroll-y') || 0;

    // Re-enable scroll - remove class from html element
    document.documentElement.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-backdrop-blur');

    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY));

    // Dispatch event
    document.dispatchEvent(new CustomEvent('jankx:modal:close', {
      detail: {
        modalId,
        modalElement: modal
      }
    }));
  }
  function initModals() {
    // Get all modals directly (no wrapper)
    const allModals = document.querySelectorAll('.wp-block-jankx-modal');
    const modalConfigs = {};
    allModals.forEach(function (modal) {
      const modalId = modal.dataset.modalId || modal.id;
      if (!modalId) return;
      const closeOnOverlayClick = modal.dataset.closeOnOverlayClick !== 'false';
      const closeOnEscape = modal.dataset.closeOnEscape !== 'false';
      const animationDuration = parseInt(modal.dataset.animationDuration) || 300;
      const backdropBlur = modal.dataset.backdropBlur === 'true';
      const disableScroll = modal.dataset.disableScroll !== 'false';
      const disableFocus = modal.dataset.disableFocus === 'true';
      const awaitOpenAnimation = modal.dataset.awaitOpenAnimation === 'true';
      const awaitCloseAnimation = modal.dataset.awaitCloseAnimation === 'true';
      modalConfigs[modalId] = {
        closeOnOverlayClick,
        closeOnEscape,
        animationDuration,
        backdropBlur,
        disableScroll,
        disableFocus,
        awaitOpenAnimation,
        awaitCloseAnimation
      };
    });

    // Get default config from first modal wrapper (if exists)
    const firstModal = allModals[0];
    const defaultConfig = firstModal ? {
      disableScroll: firstModal.dataset.disableScroll !== 'false',
      disableFocus: firstModal.dataset.disableFocus === 'true',
      awaitOpenAnimation: firstModal.dataset.awaitOpenAnimation === 'true',
      awaitCloseAnimation: firstModal.dataset.awaitCloseAnimation === 'true'
    } : {
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false
    };

    // Initialize Micromodal with global config
    micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].init({
      onShow: function (modal, trigger) {
        // Collect and share data from trigger element
        if (trigger) {
          const shareData = {};

          // Check which data to share based on data attributes
          if (trigger.dataset.shareObjectId === 'true' && trigger.dataset.currentObjectId) {
            shareData.objectId = trigger.dataset.currentObjectId;
          }
          if (trigger.dataset.sharePostTitle === 'true' && trigger.dataset.currentPostTitle) {
            shareData.postTitle = trigger.dataset.currentPostTitle;
          }
          if (trigger.dataset.shareCurrentUrl === 'true' && trigger.dataset.currentUrl) {
            shareData.currentUrl = trigger.dataset.currentUrl;
          }

          // Store in global object with modal ID as key
          if (Object.keys(shareData).length > 0) {
            window.jankxShareData[modal.id] = shareData;
          }
        }

        // Calculate scrollbar width before hiding
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Store current scroll position
        const scrollY = window.scrollY;

        // Lock scroll on html element
        document.documentElement.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        // Add padding to prevent layout shift
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = scrollbarWidth + 'px';
        }

        // Store scroll position for restoration
        modal.setAttribute('data-scroll-y', scrollY);

        // Apply backdrop blur if enabled
        const config = modalConfigs[modal.id];
        if (config && config.backdropBlur) {
          document.body.classList.add('modal-backdrop-blur');
        }

        // Dispatch custom event with shared data
        document.dispatchEvent(new CustomEvent('jankx:modal:show', {
          detail: {
            modalId: modal.id,
            modalElement: modal,
            sharedData: window.jankxShareData[modal.id] || {}
          }
        }));
      },
      onClose: function (modal) {
        // Stop all media playback in modal
        stopMediaInModal(modal);

        // Get stored scroll position
        const scrollY = modal.getAttribute('data-scroll-y') || 0;

        // Remove scroll lock from html element
        document.documentElement.classList.remove('modal-open');

        // Remove styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';

        // Remove backdrop blur
        document.body.classList.remove('modal-backdrop-blur');

        // Restore scroll position
        window.scrollTo(0, parseInt(scrollY));

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('jankx:modal:close', {
          detail: {
            modalId: modal.id,
            modalElement: modal
          }
        }));
      },
      openClass: 'is-open',
      disableScroll: defaultConfig.disableScroll,
      disableFocus: defaultConfig.disableFocus,
      awaitOpenAnimation: defaultConfig.awaitOpenAnimation,
      awaitCloseAnimation: defaultConfig.awaitCloseAnimation,
      debugMode: true // Always enable for easier troubleshooting
    });

    // Handle custom selector triggers
    allModals.forEach(function (modal) {
      const customTrigger = modal.querySelector('.wp-block-jankx-modal__custom-trigger');
      if (customTrigger) {
        const customSelector = customTrigger.dataset.customSelector;
        const modalId = modal.dataset.modalId || modal.id;
        if (customSelector && modalId) {
          const customElements = document.querySelectorAll(customSelector);
          customElements.forEach(function (element) {
            element.addEventListener('click', function (e) {
              e.preventDefault();
              micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].show(modalId);
            });
          });
        }
      }
    });
  }

  // Expose global functions for external use (both custom and Micromodal methods)
  window.JankxModal = {
    show: function (modalId, triggerElement) {
      // Check if modal exists first
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        console.error('JankxModal.show: Modal not found with ID:', modalId);
        return;
      }

      // Use Micromodal if available, otherwise fallback to custom implementation
      if (typeof micromodal__WEBPACK_IMPORTED_MODULE_0__["default"] !== 'undefined' && micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].show) {
        try {
          micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].show(modalId);
        } catch (error) {
          console.error('JankxModal.show error:', error);
          // Fallback to custom implementation
          showModal(modalId, triggerElement);
        }
      } else {
        showModal(modalId, triggerElement);
      }
    },
    hide: function (modalId) {
      // Check if modal exists first
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        console.error('JankxModal.hide: Modal not found with ID:', modalId);
        return;
      }

      // Use Micromodal if available, otherwise fallback to custom implementation
      if (typeof micromodal__WEBPACK_IMPORTED_MODULE_0__["default"] !== 'undefined' && micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].close) {
        try {
          micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].close(modalId);
        } catch (error) {
          console.error('JankxModal.hide error:', error);
          // Fallback to custom implementation
          hideModal(modalId);
        }
      } else {
        hideModal(modalId);
      }
    },
    init: initModals,
    // Direct access to Micromodal instance
    MicroModal: micromodal__WEBPACK_IMPORTED_MODULE_0__["default"]
  };
})();
})();

/******/ })()
;
//# sourceMappingURL=view.js.map