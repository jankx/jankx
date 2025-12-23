/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/plyr-player/block.json":
/*!***************************************!*\
  !*** ./blocks/plyr-player/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/plyr-player","title":"Plyr Player","category":"jankx","icon":"media-video","description":"Media player powered by Plyr","keywords":["plyr","video","audio","player","media"],"textdomain":"jankx","supports":{"html":false,"align":["wide","full"],"spacing":{"margin":true,"padding":true}},"attributes":{"mediaType":{"type":"string","default":"video"},"mediaUrl":{"type":"string","default":""},"posterUrl":{"type":"string","default":""},"autoplay":{"type":"boolean","default":false},"loop":{"type":"boolean","default":false},"muted":{"type":"boolean","default":false},"preload":{"type":"string","default":"metadata"},"className":{"type":"string"}},"editorScript":"file:./build/index.js","viewScript":"file:./build/frontend.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css"}');

/***/ }),

/***/ "./blocks/plyr-player/edit.tsx":
/*!*************************************!*\
  !*** ./blocks/plyr-player/edit.tsx ***!
  \*************************************/
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
/* harmony import */ var plyr_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! plyr-react */ "./node_modules/plyr-react/dist/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);






function Edit({
  attributes,
  setAttributes
}) {
  const {
    mediaType,
    mediaUrl,
    posterUrl,
    autoplay,
    loop,
    muted,
    preload,
    className
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `plyr-player-block ${className || ''}`
  });
  const renderPreview = () => {
    if (!mediaUrl || mediaUrl.trim() === '') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "plyr-player__placeholder",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Paste a media URL to preview the player.', 'jankx')
        })
      });
    }
    const plyrProps = {
      source: {
        type: mediaType,
        sources: [{
          src: mediaUrl,
          type: mediaType === 'audio' ? 'audio/mp3' : 'video/mp4'
        }],
        ...(mediaType === 'video' && posterUrl ? {
          poster: posterUrl
        } : {})
      },
      options: {
        autoplay,
        muted,
        loop: {
          active: loop
        }
      }
    };
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(plyr_react__WEBPACK_IMPORTED_MODULE_3__.Plyr, {
      ...plyrProps
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Plyr Player Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Media type', 'jankx'),
          value: mediaType,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Video', 'jankx'),
            value: 'video'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Audio', 'jankx'),
            value: 'audio'
          }],
          onChange: value => setAttributes({
            mediaType: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Media URL', 'jankx'),
          value: mediaUrl,
          onChange: value => setAttributes({
            mediaUrl: value
          })
        }), mediaType === 'video' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Poster URL', 'jankx'),
          value: posterUrl,
          onChange: value => setAttributes({
            posterUrl: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preload', 'jankx'),
          value: preload,
          options: [{
            label: 'none',
            value: 'none'
          }, {
            label: 'metadata',
            value: 'metadata'
          }, {
            label: 'auto',
            value: 'auto'
          }],
          onChange: value => setAttributes({
            preload: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'jankx'),
          checked: autoplay,
          onChange: value => setAttributes({
            autoplay: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loop', 'jankx'),
          checked: loop,
          onChange: value => setAttributes({
            loop: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Muted', 'jankx'),
          checked: muted,
          onChange: value => setAttributes({
            muted: value
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      ...blockProps,
      children: renderPreview()
    })]
  });
}

/***/ }),

/***/ "./blocks/plyr-player/editor.scss":
/*!****************************************!*\
  !*** ./blocks/plyr-player/editor.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/plyr-player/style.scss":
/*!***************************************!*\
  !*** ./blocks/plyr-player/style.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/plyr-react/dist/index.js":
/*!***********************************************!*\
  !*** ./node_modules/plyr-react/dist/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Plyr: () => (/* binding */ u),
/* harmony export */   usePlyr: () => (/* binding */ l)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var plyr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! plyr */ "./node_modules/plyr/src/js/plyr.js");
/* harmony import */ var react_aptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-aptor */ "./node_modules/react-aptor/esm/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");




const i = plyr__WEBPACK_IMPORTED_MODULE_1__["default"],
  a = (e, t) => {
    var _t$options;
    let n = new i(`.plyr-react`, (_t$options = t?.options) !== null && _t$options !== void 0 ? _t$options : {});
    return t?.source && (n.source = t?.source), n;
  },
  o = e => {
    e && e.destroy();
  },
  s = () => {},
  c = e => e ? () => ({
    plyr: e
  }) : () => new Proxy({
    plyr: {
      source: null
    }
  }, {
    get: (e, t) => t === `plyr` ? e[t] : s
  });
function l(e, t, r = null) {
  return (0,react_aptor__WEBPACK_IMPORTED_MODULE_2__["default"])(e, {
    instantiate: a,
    getAPI: c,
    destroy: o,
    params: t
  }, r !== null && r !== void 0 ? r : [t.options, t.source]);
}
const u = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((e, t) => {
  let {
      source: n,
      options: i = null,
      ...a
    } = e,
    o = l(t, {
      source: n,
      options: i
    });
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(`video`, {
    ref: o,
    className: `plyr-react plyr`,
    ...a
  });
});
u.displayName = `Plyr`;


/***/ }),

/***/ "./node_modules/plyr/src/js/plyr.js":
/*!******************************************!*\
  !*** ./node_modules/plyr/src/js/plyr.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/defaults'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/states'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './console'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './controls'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './fullscreen'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './html5'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './listeners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './media'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './plugins/ads'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './plugins/preview-thumbnails'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './source'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './storage'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/arrays'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/load-sprite'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/numbers'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/objects'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/promise'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/urls'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
// ==========================================================================
// Plyr
// plyr.js v3.8.3
// https://github.com/sampotts/plyr
// License: The MIT License (MIT)
// ==========================================================================




























// Private properties
// TODO: Use a WeakMap for private globals
// const globals = new WeakMap();

// Plyr instance
class Plyr {
  constructor(target, options) {
    this.timers = {};

    // State
    this.ready = false;
    this.loading = false;
    this.failed = false;

    // Touch device
    this.touch = Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

    // Set the media element
    this.media = target;

    // String selector passed
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media)) {
      this.media = document.querySelectorAll(this.media);
    }

    // jQuery, NodeList or Array passed, use first element
    if (window.jQuery && this.media instanceof jQuery || Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media) || Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media)) {
      this.media = this.media[0];
    }

    // Set config
    this.config = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/objects'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({}, Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/defaults'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), Plyr.defaults, options || {}, (() => {
      try {
        return JSON.parse(this.media.getAttribute('data-plyr-config'));
      } catch {
        return {};
      }
    })());

    // Elements cache
    this.elements = {
      container: null,
      fullscreen: null,
      captions: null,
      buttons: {},
      display: {},
      progress: {},
      inputs: {},
      settings: {
        popup: null,
        menu: null,
        panels: {},
        buttons: {}
      }
    };

    // Captions
    this.captions = {
      active: null,
      currentTrack: -1,
      meta: new WeakMap()
    };

    // Fullscreen
    this.fullscreen = {
      active: false
    };

    // Options
    this.options = {
      speed: [],
      quality: []
    };

    // Debugging
    // TODO: move to globals
    this.debug = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './console'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.config.debug);

    // Log config options and support
    this.debug.log('Config', this.config);
    this.debug.log('Support', Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

    // We need an element to setup
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media) || !Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media)) {
      this.debug.error('Setup failed: no suitable element passed');
      return;
    }

    // Bail if the element is initialized
    if (this.media.plyr) {
      this.debug.warn('Target already setup');
      return;
    }

    // Bail if not enabled
    if (!this.config.enabled) {
      this.debug.error('Setup failed: disabled by config');
      return;
    }

    // Bail if disabled or no basic support
    // You may want to disable certain UAs etc
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())().api) {
      this.debug.error('Setup failed: no support');
      return;
    }

    // Cache original element state for .destroy()
    const clone = this.media.cloneNode(true);
    clone.autoplay = false;
    this.elements.original = clone;

    // Set media type based on tag or data attribute
    // Supported: video, audio, vimeo, youtube
    const type = this.media.tagName.toLowerCase();
    // Embed properties
    let iframe = null;
    let url = null;

    // Different setup based on type
    switch (type) {
      case 'div':
        // Find the frame
        iframe = this.media.querySelector('iframe');

        // <iframe> type
        if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(iframe)) {
          // Detect provider
          url = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/urls'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(iframe.getAttribute('src'));
          this.provider = Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(url.toString());

          // Rework elements
          this.elements.container = this.media;
          this.media = iframe;

          // Reset classname
          this.elements.container.className = '';

          // Get attributes from URL and set config
          if (url.search.length) {
            const truthy = ['1', 'true'];
            if (truthy.includes(url.searchParams.get('autoplay'))) {
              this.config.autoplay = true;
            }
            if (truthy.includes(url.searchParams.get('loop'))) {
              this.config.loop.active = true;
            }

            // TODO: replace fullscreen.iosNative with this playsinline config option
            // YouTube requires the playsinline in the URL
            if (this.isYouTube) {
              this.config.playsinline = truthy.includes(url.searchParams.get('playsinline'));
              this.config.youtube.hl = url.searchParams.get('hl'); // TODO: Should this be setting language?
            } else {
              this.config.playsinline = true;
            }
          }
        } else {
          // <div> with attributes
          this.provider = this.media.getAttribute(this.config.attributes.embed.provider);

          // Remove attribute
          this.media.removeAttribute(this.config.attributes.embed.provider);
        }

        // Unsupported or missing provider
        if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.provider) || !Object.values(Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).includes(this.provider)) {
          this.debug.error('Setup failed: Invalid provider');
          return;
        }

        // Audio will come later for external providers
        this.type = Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).video;
        break;
      case 'video':
      case 'audio':
        this.type = type;
        this.provider = Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).html5;

        // Get config from attributes
        if (this.media.hasAttribute('crossorigin')) {
          this.config.crossorigin = true;
        }
        if (this.media.hasAttribute('autoplay')) {
          this.config.autoplay = true;
        }
        if (this.media.hasAttribute('playsinline') || this.media.hasAttribute('webkit-playsinline')) {
          this.config.playsinline = true;
        }
        if (this.media.hasAttribute('muted')) {
          this.config.muted = true;
        }
        if (this.media.hasAttribute('loop')) {
          this.config.loop.active = true;
        }
        break;
      default:
        this.debug.error('Setup failed: unsupported type');
        return;
    }

    // Check for support again but with type
    this.supported = Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.type, this.provider);

    // If no support for even API, bail
    if (!this.supported.api) {
      this.debug.error('Setup failed: no support');
      return;
    }
    this.eventListeners = [];

    // Create listeners
    this.listeners = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './listeners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);

    // Setup local storage for user settings
    this.storage = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './storage'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);

    // Store reference
    this.media.plyr = this;

    // Wrap media
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.container)) {
      this.elements.container = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('div');
      Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media, this.elements.container);
    }

    // Migrate custom properties from media to container (so they work 😉)
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);

    // Add style hook
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);

    // Setup media
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './media'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);

    // Listen for events if debugging
    if (this.config.debug) {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, this.elements.container, this.config.events.join(' '), event => {
        this.debug.log(`event: ${event.type}`);
      });
    }

    // Setup fullscreen
    this.fullscreen = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './fullscreen'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);

    // Setup interface
    // If embed but not fully supported, build interface now to avoid flash of controls
    if (this.isHTML5 || this.isEmbed && !this.supported.ui) {
      Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);
    }

    // Container listeners
    this.listeners.container();

    // Global listeners
    this.listeners.global();

    // Setup ads if provided
    if (this.config.ads.enabled) {
      this.ads = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './plugins/ads'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);
    }

    // Autoplay if required
    if (this.isHTML5 && this.config.autoplay) {
      this.once('canplay', () => Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/promise'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.play()));
    }

    // Seek time will be recorded (in listeners.js) so we can prevent hiding controls for a few seconds after seek
    this.lastSeekTime = 0;

    // Setup preview thumbnails if enabled
    if (this.config.previewThumbnails.enabled) {
      this.previewThumbnails = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './plugins/preview-thumbnails'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);
    }
  }

  // ---------------------------------------
  // API
  // ---------------------------------------

  /**
   * Types and provider helpers
   */
  get isHTML5() {
    return this.provider === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).html5;
  }
  get isEmbed() {
    return this.isYouTube || this.isVimeo;
  }
  get isYouTube() {
    return this.provider === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).youtube;
  }
  get isVimeo() {
    return this.provider === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).vimeo;
  }
  get isVideo() {
    return this.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).video;
  }
  get isAudio() {
    return this.type === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/types'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).audio;
  }

  /**
   * Play the media, or play the advertisement (if they are not blocked)
   */
  play = () => {
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.play)) {
      return null;
    }

    // Intecept play with ads
    if (this.ads && this.ads.enabled) {
      this.ads.managerPromise.then(() => this.ads.play()).catch(() => Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/promise'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.play()));
    }

    // Return the promise (for HTML5)
    return this.media.play();
  };

  /**
   * Pause the media
   */
  pause = () => {
    if (!this.playing || !Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.pause)) {
      return null;
    }
    return this.media.pause();
  };

  /**
   * Get playing state
   */
  get playing() {
    return Boolean(this.ready && !this.paused && !this.ended);
  }

  /**
   * Get paused state
   */
  get paused() {
    return Boolean(this.media.paused);
  }

  /**
   * Get stopped state
   */
  get stopped() {
    return Boolean(this.paused && this.currentTime === 0);
  }

  /**
   * Get ended state
   */
  get ended() {
    return Boolean(this.media.ended);
  }

  /**
   * Toggle playback based on current status
   * @param {boolean} input
   */
  togglePlay = input => {
    // Toggle based on current state if nothing passed
    const toggle = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) ? input : !this.playing;
    if (toggle) {
      return this.play();
    }
    return this.pause();
  };

  /**
   * Stop playback
   */
  stop = () => {
    if (this.isHTML5) {
      this.pause();
      this.restart();
    } else if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.stop)) {
      this.media.stop();
    }
  };

  /**
   * Restart playback
   */
  restart = () => {
    this.currentTime = 0;
  };

  /**
   * Rewind
   * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
   */
  rewind = seekTime => {
    this.currentTime -= Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(seekTime) ? seekTime : this.config.seekTime;
  };

  /**
   * Fast forward
   * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
   */
  forward = seekTime => {
    this.currentTime += Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(seekTime) ? seekTime : this.config.seekTime;
  };

  /**
   * Seek to a time
   * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
   */
  set currentTime(input) {
    // Bail if media duration isn't available yet
    if (!this.duration) {
      return;
    }

    // Validate input
    const inputIsValid = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) && input > 0;

    // Set
    this.media.currentTime = inputIsValid ? Math.min(input, this.duration) : 0;

    // Logging
    this.debug.log(`Seeking to ${this.currentTime} seconds`);
  }

  /**
   * Get current time
   */
  get currentTime() {
    return Number(this.media.currentTime);
  }

  /**
   * Get buffered
   */
  get buffered() {
    const {
      buffered
    } = this.media;

    // YouTube / Vimeo return a float between 0-1
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(buffered)) {
      return buffered;
    }

    // HTML5
    // TODO: Handle buffered chunks of the media
    // (i.e. seek to another section buffers only that section)
    if (buffered && buffered.length && this.duration > 0) {
      return buffered.end(0) / this.duration;
    }
    return 0;
  }

  /**
   * Get seeking status
   */
  get seeking() {
    return Boolean(this.media.seeking);
  }

  /**
   * Get the duration of the current media
   */
  get duration() {
    // Faux duration set via config
    const fauxDuration = Number.parseFloat(this.config.duration);
    // Media duration can be NaN or Infinity before the media has loaded
    const realDuration = (this.media || {}).duration;
    const duration = !Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(realDuration) || realDuration === Infinity ? 0 : realDuration;

    // If config duration is funky, use regular duration
    return fauxDuration || duration;
  }

  /**
   * Set the player volume
   * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
   */
  set volume(value) {
    let volume = value;
    const max = 1;
    const min = 0;
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(volume)) {
      volume = Number(volume);
    }

    // Load volume from storage if no value specified
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(volume)) {
      volume = this.storage.get('volume');
    }

    // Use config if all else fails
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(volume)) {
      ({
        volume
      } = this.config);
    }

    // Maximum is volumeMax
    if (volume > max) {
      volume = max;
    }
    // Minimum is volumeMin
    if (volume < min) {
      volume = min;
    }

    // Update config
    this.config.volume = volume;

    // Set the player volume
    this.media.volume = volume;

    // If muted, and we're increasing volume manually, reset muted state
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(value) && this.muted && volume > 0) {
      this.muted = false;
    }
  }

  /**
   * Get the current player volume
   */
  get volume() {
    return Number(this.media.volume);
  }

  /**
   * Increase volume
   * @param {boolean} step - How much to decrease by (between 0 and 1)
   */
  increaseVolume = step => {
    const volume = this.media.muted ? 0 : this.volume;
    this.volume = volume + (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(step) ? step : 0);
  };

  /**
   * Decrease volume
   * @param {boolean} step - How much to decrease by (between 0 and 1)
   */
  decreaseVolume = step => {
    this.increaseVolume(-step);
  };

  /**
   * Set muted state
   * @param {boolean} mute
   */
  set muted(mute) {
    let toggle = mute;

    // Load muted state from storage
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(toggle)) {
      toggle = this.storage.get('muted');
    }

    // Use config if all else fails
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(toggle)) {
      toggle = this.config.muted;
    }

    // Update config
    this.config.muted = toggle;

    // Set mute on the player
    this.media.muted = toggle;
  }

  /**
   * Get current muted state
   */
  get muted() {
    return Boolean(this.media.muted);
  }

  /**
   * Check if the media has audio
   */
  get hasAudio() {
    // Assume yes for all non HTML5 (as we can't tell...)
    if (!this.isHTML5) {
      return true;
    }
    if (this.isAudio) {
      return true;
    }

    // Get audio tracks
    return Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length);
  }

  /**
   * Set playback speed
   * @param {number} input - the speed of playback (0.5-2.0)
   */
  set speed(input) {
    let speed = null;
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input)) {
      speed = input;
    }
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(speed)) {
      speed = this.storage.get('speed');
    }
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(speed)) {
      speed = this.config.speed.selected;
    }

    // Clamp to min/max
    const {
      minimumSpeed: min,
      maximumSpeed: max
    } = this;
    speed = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/numbers'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(speed, min, max);

    // Update config
    this.config.speed.selected = speed;

    // Set media speed
    setTimeout(() => {
      if (this.media) {
        this.media.playbackRate = speed;
      }
    }, 0);
  }

  /**
   * Get current playback speed
   */
  get speed() {
    return Number(this.media.playbackRate);
  }

  /**
   * Get the minimum allowed speed
   */
  get minimumSpeed() {
    if (this.isYouTube) {
      // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
      return Math.min(...this.options.speed);
    }
    if (this.isVimeo) {
      // https://github.com/vimeo/player.js/#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror
      return 0.5;
    }

    // https://stackoverflow.com/a/32320020/1191319
    return 0.0625;
  }

  /**
   * Get the maximum allowed speed
   */
  get maximumSpeed() {
    if (this.isYouTube) {
      // https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate
      return Math.max(...this.options.speed);
    }
    if (this.isVimeo) {
      // https://github.com/vimeo/player.js/#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror
      return 2;
    }

    // https://stackoverflow.com/a/32320020/1191319
    return 16;
  }

  /**
   * Set playback quality
   * Currently HTML5 & YouTube only
   * @param {number} input - Quality level
   */
  set quality(input) {
    const config = this.config.quality;
    const options = this.options.quality;
    if (!options.length) {
      return;
    }
    let quality = [!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) && Number(input), this.storage.get('quality'), config.selected, config.default].find(Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    let updateStorage = true;
    if (!options.includes(quality)) {
      const value = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/arrays'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(options, quality);
      this.debug.warn(`Unsupported quality option: ${quality}, using ${value} instead`);
      quality = value;

      // Don't update storage if quality is not supported
      updateStorage = false;
    }

    // Update config
    config.selected = quality;

    // Set quality
    this.media.quality = quality;

    // Save to storage
    if (updateStorage) {
      this.storage.set({
        quality
      });
    }
  }

  /**
   * Get current quality level
   */
  get quality() {
    return this.media.quality;
  }

  /**
   * Toggle loop
   * TODO: Finish fancy new logic. Set the indicator on load as user may pass loop as config
   * @param {boolean} input - Whether to loop or not
   */
  set loop(input) {
    const toggle = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) ? input : this.config.loop.active;
    this.config.loop.active = toggle;
    this.media.loop = toggle;

    // Set default to be a true toggle
    /* const type = ['start', 'end', 'all', 'none', 'toggle'].includes(input) ? input : 'toggle';
         switch (type) {
            case 'start':
                if (this.config.loop.end && this.config.loop.end <= this.currentTime) {
                    this.config.loop.end = null;
                }
                this.config.loop.start = this.currentTime;
                // this.config.loop.indicator.start = this.elements.display.played.value;
                break;
             case 'end':
                if (this.config.loop.start >= this.currentTime) {
                    return this;
                }
                this.config.loop.end = this.currentTime;
                // this.config.loop.indicator.end = this.elements.display.played.value;
                break;
             case 'all':
                this.config.loop.start = 0;
                this.config.loop.end = this.duration - 2;
                this.config.loop.indicator.start = 0;
                this.config.loop.indicator.end = 100;
                break;
             case 'toggle':
                if (this.config.loop.active) {
                    this.config.loop.start = 0;
                    this.config.loop.end = null;
                } else {
                    this.config.loop.start = 0;
                    this.config.loop.end = this.duration - 2;
                }
                break;
             default:
                this.config.loop.start = 0;
                this.config.loop.end = null;
                break;
        } */
  }

  /**
   * Get current loop state
   */
  get loop() {
    return Boolean(this.media.loop);
  }

  /**
   * Set new media source
   * @param {object} input - The new source object (see docs)
   */
  set source(input) {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './source'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, input);
  }

  /**
   * Get current source
   */
  get source() {
    return this.media.currentSrc;
  }

  /**
   * Get a download URL (either source or custom)
   */
  get download() {
    const {
      download
    } = this.config.urls;
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(download) ? download : this.source;
  }

  /**
   * Set the download URL
   */
  set download(input) {
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input)) {
      return;
    }
    this.config.urls.download = input;
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './controls'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);
  }

  /**
   * Set the poster image for a video
   * @param {string} input - the URL for the new poster image
   */
  set poster(input) {
    if (!this.isVideo) {
      this.debug.warn('Poster can only be set for video');
      return;
    }
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, input, false).catch(() => {});
  }

  /**
   * Get the current poster image
   */
  get poster() {
    if (!this.isVideo) {
      return null;
    }
    return this.media.getAttribute('poster') || this.media.getAttribute('data-poster');
  }

  /**
   * Get the current aspect ratio in use
   */
  get ratio() {
    if (!this.isVideo) {
      return null;
    }
    const ratio = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this));
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(ratio) ? ratio.join(':') : ratio;
  }

  /**
   * Set video aspect ratio
   */
  set ratio(input) {
    if (!this.isVideo) {
      this.debug.warn('Aspect ratio can only be set for video');
      return;
    }
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) || !Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input)) {
      this.debug.error(`Invalid aspect ratio specified (${input})`);
      return;
    }
    this.config.ratio = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input);
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/style'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);
  }

  /**
   * Set the autoplay state
   * @param {boolean} input - Whether to autoplay or not
   */
  set autoplay(input) {
    this.config.autoplay = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) ? input : this.config.autoplay;
  }

  /**
   * Get the current autoplay state
   */
  get autoplay() {
    return Boolean(this.config.autoplay);
  }

  /**
   * Toggle captions
   * @param {boolean} input - Whether to enable captions
   */
  toggleCaptions(input) {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, input, false);
  }

  /**
   * Set the caption track by index
   * @param {number} input - Caption index
   */
  set currentTrack(input) {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, input, false);
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);
  }

  /**
   * Get the current caption track index (-1 if disabled)
   */
  get currentTrack() {
    const {
      toggled,
      currentTrack
    } = this.captions;
    return toggled ? currentTrack : -1;
  }

  /**
   * Set the wanted language for captions
   * Since tracks can be added later it won't update the actual caption track until there is a matching track
   * @param {string} input - Two character ISO language code (e.g. EN, FR, PT, etc)
   */
  set language(input) {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, input, false);
  }

  /**
   * Get the current track's language
   */
  get language() {
    return (Object(function webpackMissingModule() { var e = new Error("Cannot find module './captions'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this) || {}).language;
  }

  /**
   * Toggle picture-in-picture playback on WebKit/MacOS
   * TODO: update player with state, support, enabled
   * TODO: detect outside changes
   */
  set pip(input) {
    // Bail if no support
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())) {
      return;
    }

    // Toggle based on current state if not passed
    const toggle = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(input) ? input : !this.pip;

    // Toggle based on current state
    // Safari
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.webkitSetPresentationMode)) {
      this.media.webkitSetPresentationMode(toggle ? Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/states'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).active : Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/states'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).inactive);
    }

    // Chrome
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.requestPictureInPicture)) {
      if (!this.pip && toggle) {
        this.media.requestPictureInPicture();
      } else if (this.pip && !toggle) {
        document.exitPictureInPicture();
      }
    }
  }

  /**
   * Get the current picture-in-picture state
   */
  get pip() {
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())) {
      return null;
    }

    // Safari
    if (!Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.media.webkitPresentationMode)) {
      return this.media.webkitPresentationMode === Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/states'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).active;
    }

    // Chrome
    return this.media === document.pictureInPictureElement;
  }

  /**
   * Sets the preview thumbnails for the current source
   */
  setPreviewThumbnails(thumbnailSource) {
    if (this.previewThumbnails && this.previewThumbnails.loaded) {
      this.previewThumbnails.destroy();
      this.previewThumbnails = null;
    }
    Object.assign(this.config.previewThumbnails, thumbnailSource);

    // Create new instance if it is still enabled
    if (this.config.previewThumbnails.enabled) {
      this.previewThumbnails = new Object(function webpackMissingModule() { var e = new Error("Cannot find module './plugins/preview-thumbnails'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this);
    }
  }

  /**
   * Trigger the airplay dialog
   * TODO: update player with state, support, enabled
   */
  airplay = () => {
    // Show dialog if supported
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())) {
      this.media.webkitShowPlaybackTargetPicker();
    }
  };

  /**
   * Toggle the player controls
   * @param {boolean} [toggle] - Whether to show the controls
   */
  toggleControls = toggle => {
    // Don't toggle if missing UI support or if it's audio
    if (this.supported.ui && !this.isAudio) {
      // Get state before change
      const isHidden = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.container, this.config.classNames.hideControls);
      // Negate the argument if not undefined since adding the class to hides the controls
      const force = typeof toggle === 'undefined' ? undefined : !toggle;
      // Apply and get updated state
      const hiding = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.container, this.config.classNames.hideControls, force);

      // Close menu
      if (hiding && Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.config.controls) && this.config.controls.includes('settings') && !Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.config.settings)) {
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './controls'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, false);
      }

      // Trigger event on change
      if (hiding !== isHidden) {
        const eventName = hiding ? 'controlshidden' : 'controlsshown';
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, this.media, eventName);
      }
      return !hiding;
    }
    return false;
  };

  /**
   * Add event listeners
   * @param {string} event - Event type
   * @param {Function} callback - Callback for when event occurs
   */
  on = (event, callback) => {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, this.elements.container, event, callback);
  };

  /**
   * Add event listeners once
   * @param {string} event - Event type
   * @param {Function} callback - Callback for when event occurs
   */
  once = (event, callback) => {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, this.elements.container, event, callback);
  };

  /**
   * Remove event listeners
   * @param {string} event - Event type
   * @param {Function} callback - Callback for when event occurs
   */
  off = (event, callback) => {
    Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.container, event, callback);
  };

  /**
   * Destroy an instance
   * Event listeners are removed when elements are removed
   * http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
   * @param {Function} callback - Callback for when destroy is complete
   * @param {boolean} soft - Whether it's a soft destroy (for source changes etc)
   */
  destroy = (callback, soft = false) => {
    if (!this.ready) {
      return;
    }
    const done = () => {
      // Reset overflow (incase destroyed while in fullscreen)
      document.body.style.overflow = '';

      // GC for embed
      this.embed = null;

      // If it's a soft destroy, make minimal changes
      if (soft) {
        if (Object.keys(this.elements).length) {
          // Remove elements
          Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.buttons.play);
          Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.captions);
          Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.controls);
          Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.wrapper);

          // Clear for GC
          this.elements.buttons.play = null;
          this.elements.captions = null;
          this.elements.controls = null;
          this.elements.wrapper = null;
        }

        // Callback
        if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(callback)) {
          callback();
        }
      } else {
        // Unbind listeners
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);

        // Cancel current network requests
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './html5'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this);

        // Replace the container with the original element provided
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/elements'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.elements.original, this.elements.container);

        // Event
        Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/events'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, this.elements.original, 'destroyed', true);

        // Callback
        if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(callback)) {
          callback.call(this.elements.original);
        }

        // Reset state
        this.ready = false;

        // Clear for garbage collection
        setTimeout(() => {
          this.elements = null;
          this.media = null;
        }, 200);
      }
    };

    // Stop playback
    this.stop();

    // Clear timeouts
    clearTimeout(this.timers.loading);
    clearTimeout(this.timers.controls);
    clearTimeout(this.timers.resized);

    // Provider specific stuff
    if (this.isHTML5) {
      // Restore native video controls
      Object(function webpackMissingModule() { var e = new Error("Cannot find module './ui'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, true);

      // Clean up
      done();
    } else if (this.isYouTube) {
      // Clear timers
      clearInterval(this.timers.buffering);
      clearInterval(this.timers.playing);

      // Destroy YouTube API
      if (this.embed !== null && Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.embed.destroy)) {
        this.embed.destroy();
      }

      // Clean up
      done();
    } else if (this.isVimeo) {
      // Destroy Vimeo API
      // then clean up (wait, to prevent postmessage errors)
      if (this.embed !== null) {
        this.embed.unload().then(done);
      }

      // Vimeo does not always return
      setTimeout(done, 200);
    }
  };

  /**
   * Check for support for a mime type (HTML5 only)
   * @param {string} type - Mime type
   */
  supports = type => Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).call(this, type);

  /**
   * Check for support
   * @param {string} type - Player type (audio/video)
   * @param {string} provider - Provider (html5/youtube/vimeo)
   */
  static supported(type, provider) {
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module './support'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(type, provider);
  }

  /**
   * Load an SVG sprite into the page
   * @param {string} url - URL for the SVG sprite
   * @param {string} [id] - Unique ID
   */
  static loadSprite(url, id) {
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/load-sprite'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(url, id);
  }

  /**
   * Setup multiple instances
   * @param {*} selector
   * @param {object} options
   */
  static setup(selector, options = {}) {
    let targets = null;
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(selector)) {
      targets = Array.from(document.querySelectorAll(selector));
    } else if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(selector)) {
      targets = Array.from(selector);
    } else if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(selector)) {
      targets = selector.filter(Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }
    if (Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/is'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(targets)) {
      return null;
    }
    return targets.map(t => new Plyr(t, options));
  }
}
Plyr.defaults = Object(function webpackMissingModule() { var e = new Error("Cannot find module './utils/objects'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module './config/defaults'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Plyr);

/***/ }),

/***/ "./node_modules/react-aptor/esm/index.js":
/*!***********************************************!*\
  !*** ./node_modules/react-aptor/esm/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useAptor),
/* harmony export */   useAptor: () => (/* binding */ useAptor)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function useAptor(ref, configuration, deps = []) {
  const [instance, setInstance] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const domRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const {
    instantiate,
    destroy,
    getAPI,
    params
  } = configuration;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const instanceReference = instantiate(domRef.current, params);
    setInstance(instanceReference);
    return () => {
      if (destroy) destroy(instanceReference, params);
    };
  }, deps);
  const api = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => getAPI(instance, params), [instance]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, api, [api]);
  return domRef;
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

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

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
/*!**************************************!*\
  !*** ./blocks/plyr-player/index.tsx ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/plyr-player/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/plyr-player/edit.tsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./blocks/plyr-player/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./blocks/plyr-player/editor.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_1__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map