/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/swiper/block.json":
/*!**********************************!*\
  !*** ./blocks/swiper/block.json ***!
  \**********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/swiper","title":"Swiper","category":"jankx","description":"Modern touch slider with hardware accelerated transitions","keywords":["slider","swiper","carousel","gallery","slideshow"],"textdomain":"jankx","attributes":{"slidesPerView":{"type":"number","default":1},"spaceBetween":{"type":"number","default":30},"loop":{"type":"boolean","default":true},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"speed":{"type":"number","default":300},"navigation":{"type":"boolean","default":true},"pagination":{"type":"boolean","default":true},"effect":{"type":"string","enum":["slide","fade","cube","coverflow","flip","cards"],"default":"slide"},"height":{"type":"number","default":500},"minHeight":{"type":"number","default":300},"contentMode":{"type":"string","enum":["slides","gallery"],"default":"slides"},"galleryImages":{"type":"array","default":[]},"className":{"type":"string"},"anchor":{"type":"string"}},"supports":{"html":false,"anchor":true,"align":["wide","full"],"spacing":{"margin":true,"padding":true},"color":{"background":true,"text":true},"border":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"radius":true}}},"providesContext":{"jankx/swiperId":"anchor"},"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","viewScript":"file:./build/view.js","style":"file:./build/style.css"}');

/***/ }),

/***/ "./blocks/swiper/edit.tsx":
/*!********************************!*\
  !*** ./blocks/swiper/edit.tsx ***!
  \********************************/
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
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    slidesPerView,
    spaceBetween,
    loop,
    autoplay,
    autoplayDelay,
    speed,
    navigation,
    pagination,
    effect,
    height,
    minHeight,
    contentMode,
    galleryImages
  } = attributes;
  const swiperRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
  const containerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    ref: containerRef,
    className: `swiper-block swiper-effect-${effect}`,
    style: {
      '--swiper-height': `${height}px`,
      '--swiper-min-height': `${minHeight}px`
    }
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'swiper-wrapper'
  }, {
    allowedBlocks: contentMode === 'slides' ? ['jankx/swiper-slide'] : ['jankx/swiper-banner'],
    template: contentMode === 'slides' ? [['jankx/swiper-slide'], ['jankx/swiper-slide'], ['jankx/swiper-slide']] : [],
    templateLock: false,
    orientation: 'horizontal'
  });

  // Handle gallery image selection
  const onSelectGalleryImages = images => {
    const galleryData = images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      caption: img.caption || ''
    }));
    setAttributes({
      galleryImages: galleryData
    });

    // Create swiper-banner blocks for each image
    const bannerBlocks = images.map(img => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_4__.createBlock)('jankx/swiper-banner', {
      imageId: img.id,
      imageUrl: img.url,
      imageAlt: img.alt || '',
      imageCaption: img.caption || ''
    }));

    // Replace inner blocks with banner blocks
    wp.data.dispatch('core/block-editor').replaceInnerBlocks(clientId, bannerBlocks);
  };

  // Initialize Swiper in editor
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!containerRef.current) return;
    const loadSwiper = async () => {
      if (typeof window.Swiper === 'undefined') {
        // Load CSS
        if (!document.querySelector('link[href*="swiper-bundle"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
          document.head.appendChild(link);
        }

        // Load JS
        if (!document.querySelector('script[src*="swiper-bundle"]')) {
          await new Promise(resolve => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200));
      if (window.Swiper && containerRef.current) {
        const swiperEl = containerRef.current.querySelector('.swiper');
        if (!swiperEl) return;

        // If Swiper already exists, just update params instead of destroying
        if (swiperRef.current) {
          // Update params
          Object.assign(swiperRef.current.params, {
            slidesPerView,
            spaceBetween,
            loop,
            speed,
            effect,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false
            } : false,
            navigation: navigation ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            } : false,
            pagination: pagination ? {
              el: '.swiper-pagination',
              clickable: true
            } : false
          });

          // Update navigation
          if (navigation && swiperRef.current.navigation) {
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
          }

          // Update pagination
          if (pagination && swiperRef.current.pagination) {
            swiperRef.current.pagination.init();
            swiperRef.current.pagination.render();
            swiperRef.current.pagination.update();
          } else if (!pagination && swiperRef.current.pagination) {
            swiperRef.current.pagination.destroy();
          }

          // Update Swiper
          swiperRef.current.update();

          // Update autoplay
          if (autoplay && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
          } else if (swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
          }
        } else {
          // Create new instance only if doesn't exist
          swiperRef.current = new window.Swiper(swiperEl, {
            modules: [window.Swiper.Navigation, window.Swiper.Pagination, window.Swiper.Autoplay, window.Swiper.EffectFade, window.Swiper.EffectCube, window.Swiper.EffectCoverflow, window.Swiper.EffectFlip, window.Swiper.EffectCards].filter(Boolean),
            slidesPerView,
            spaceBetween,
            loop,
            speed,
            effect,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false
            } : false,
            navigation: navigation ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            } : false,
            pagination: pagination ? {
              el: '.swiper-pagination',
              clickable: true
            } : false,
            fadeEffect: {
              crossFade: true
            },
            cubeEffect: {
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94
            },
            coverflowEffect: {
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            },
            flipEffect: {
              slideShadows: true,
              limitRotation: true
            },
            cardsEffect: {
              perSlideOffset: 8,
              perSlideRotate: 2
            }
          });
        }
      }
    };
    const timeoutId = setTimeout(loadSwiper, 100);
    return () => {
      clearTimeout(timeoutId);
      // Don't destroy on settings change, only update
    };
  }, [slidesPerView, spaceBetween, loop, autoplay, autoplayDelay, speed, navigation, pagination, effect, height, minHeight]);

  // Cleanup only on unmount
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(false, false);
        swiperRef.current = null;
      }
    };
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
        className: "swiper-tabs",
        activeClass: "is-active",
        onSelect: tabName => {
          if (tabName === 'gallery') {
            setAttributes({
              contentMode: 'gallery'
            });
          } else {
            setAttributes({
              contentMode: 'slides'
            });
          }
        },
        tabs: [{
          name: 'slides',
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slides', 'jankx'),
          className: 'tab-slides'
        }, {
          name: 'gallery',
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Gallery', 'jankx'),
          className: 'tab-gallery'
        }],
        children: tab => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
          children: [tab.name === 'slides' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Slides', 'jankx'),
            initialOpen: true,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use the + button to add individual slides', 'jankx')
            })
          }), tab.name === 'gallery' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Images', 'jankx'),
            initialOpen: true,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                onSelect: onSelectGalleryImages,
                allowedTypes: ['image'],
                multiple: true,
                value: galleryImages.map(img => img.id),
                render: ({
                  open
                }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                  variant: "primary",
                  onClick: open,
                  style: {
                    width: '100%',
                    marginBottom: '10px'
                  },
                  children: galleryImages.length > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Images', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Images', 'jankx')
                })
              })
            }), galleryImages.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Selected', 'jankx'), ": ", galleryImages.length, " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('images', 'jankx')]
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slider Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slides Per View', 'jankx'),
          value: slidesPerView,
          onChange: val => setAttributes({
            slidesPerView: val
          }),
          min: 1,
          max: 4,
          step: 1
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Space Between (px)', 'jankx'),
          value: spaceBetween,
          onChange: val => setAttributes({
            spaceBetween: val
          }),
          min: 0,
          max: 100,
          step: 10
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Speed (ms)', 'jankx'),
          value: speed,
          onChange: val => setAttributes({
            speed: val
          }),
          min: 100,
          max: 2000,
          step: 100
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Height (px)', 'jankx'),
          value: height,
          onChange: val => setAttributes({
            height: val
          }),
          min: 200,
          max: 1000,
          step: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Height for desktop (max-height on mobile)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Min Height (px)', 'jankx'),
          value: minHeight,
          onChange: val => setAttributes({
            minHeight: val
          }),
          min: 150,
          max: 600,
          step: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimum height on mobile devices', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Effect', 'jankx'),
          value: effect,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide', 'jankx'),
            value: 'slide'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade', 'jankx'),
            value: 'fade'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cube', 'jankx'),
            value: 'cube'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Coverflow', 'jankx'),
            value: 'coverflow'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Flip', 'jankx'),
            value: 'flip'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cards', 'jankx'),
            value: 'cards'
          }],
          onChange: val => setAttributes({
            effect: val
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loop', 'jankx'),
          checked: loop,
          onChange: val => setAttributes({
            loop: val
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Navigation', 'jankx'),
          checked: navigation,
          onChange: val => setAttributes({
            navigation: val
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination', 'jankx'),
          checked: pagination,
          onChange: val => setAttributes({
            pagination: val
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'jankx'),
          checked: autoplay,
          onChange: val => setAttributes({
            autoplay: val
          })
        }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay Delay (ms)', 'jankx'),
          value: autoplayDelay,
          onChange: val => setAttributes({
            autoplayDelay: val
          }),
          min: 1000,
          max: 10000,
          step: 500
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "swiper",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        ...innerBlocksProps
      }), navigation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "swiper-button-prev"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "swiper-button-next"
        })]
      }), pagination && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "swiper-pagination"
      })]
    })]
  });
}

/***/ }),

/***/ "./blocks/swiper/editor.scss":
/*!***********************************!*\
  !*** ./blocks/swiper/editor.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/swiper/style.scss":
/*!**********************************!*\
  !*** ./blocks/swiper/style.scss ***!
  \**********************************/
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
/*!*********************************!*\
  !*** ./blocks/swiper/index.tsx ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/swiper/edit.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./blocks/swiper/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./blocks/swiper/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./blocks/swiper/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map