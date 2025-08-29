/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/wplyr-media/block.json":
/*!***************************************!*\
  !*** ./blocks/wplyr-media/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/wplyr-media","version":"1.0.0","title":"WPlyr Media Player","category":"media","icon":"video-alt3","description":"A simple, lightweight and accessible HTML5, YouTube and Vimeo media player that supports modern browsers.","supports":{"html":false,"align":["wide","full"],"color":{"background":true,"text":true},"spacing":{"margin":true,"padding":true}},"attributes":{"mediaType":{"type":"string","default":"video"},"mediaUrl":{"type":"string","default":""},"mediaOptions":{"type":"array","default":[]},"videoPoster":{"type":"object","default":null},"videoCaptions":{"type":"array","default":[]},"audioPoster":{"type":"object","default":null},"youtubeUrl":{"type":"string","default":""},"vimeoUrl":{"type":"string","default":""},"playerColor":{"type":"string","default":"#fca311"},"controls":{"type":"array","default":["play-large","play","progress","current-time","mute","volume","captions","settings","pip","airplay","fullscreen"]},"settings":{"type":"array","default":["captions","quality","speed"]},"seekTime":{"type":"number","default":10}},"example":{"attributes":{"mediaType":"video","mediaUrl":"https://example.com/video.mp4","playerColor":"#fca311"}},"textdomain":"jankx","editorScript":"file:./build/index.js","viewScript":"file:./build/view.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');

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
  !*** ./blocks/wplyr-media/index.tsx ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/wplyr-media/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const Edit = ({ attributes, setAttributes }) => {
    const { mediaType = 'video', mediaUrl = '', mediaOptions = [], videoPoster = null, videoCaptions = [], audioPoster = null, youtubeUrl = '', vimeoUrl = '', playerColor = '#fca311', controls = ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'], settings = ['captions', 'quality', 'speed'], seekTime = 10 } = attributes;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
        className: 'jankx-wplyr-player',
        style: {
            '--plyr-color': playerColor
        }
    });
    const mediaTypeOptions = [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Video', 'jankx'),
            value: 'video'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Audio', 'jankx'),
            value: 'audio'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('YouTube', 'jankx'),
            value: 'youtube'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vimeo', 'jankx'),
            value: 'vimeo'
        }];
    const mediaOptionsChoices = [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Muted', 'jankx'),
            value: 'muted'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loop', 'jankx'),
            value: 'loop'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay', 'jankx'),
            value: 'autoplay'
        }];
    const controlOptions = [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Play Large', 'jankx'),
            value: 'play-large'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Restart', 'jankx'),
            value: 'restart'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Rewind', 'jankx'),
            value: 'rewind'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Play', 'jankx'),
            value: 'play'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fast Forward', 'jankx'),
            value: 'fast-forward'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Progress', 'jankx'),
            value: 'progress'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Current Time', 'jankx'),
            value: 'current-time'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Duration', 'jankx'),
            value: 'duration'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mute', 'jankx'),
            value: 'mute'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Volume', 'jankx'),
            value: 'volume'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Captions', 'jankx'),
            value: 'captions'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'jankx'),
            value: 'settings'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Picture-in-Picture', 'jankx'),
            value: 'pip'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Airplay', 'jankx'),
            value: 'airplay'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Download', 'jankx'),
            value: 'download'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fullscreen', 'jankx'),
            value: 'fullscreen'
        }];
    const settingsOptions = [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Speed', 'jankx'),
            value: 'speed'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Quality', 'jankx'),
            value: 'quality'
        }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Captions', 'jankx'),
            value: 'captions'
        }];
    const handleMediaOptionChange = (option, checked) => {
        const newOptions = checked ? [...mediaOptions, option] : mediaOptions.filter(opt => opt !== option);
        setAttributes({
            mediaOptions: newOptions
        });
    };
    const handleControlChange = selectedControls => {
        setAttributes({
            controls: selectedControls
        });
    };
    const handleSettingsChange = selectedSettings => {
        setAttributes({
            settings: selectedSettings
        });
    };
    const renderMediaPlayer = () => {
        const hasMedia = (mediaType === 'video' || mediaType === 'audio') && mediaUrl;
        const hasYouTube = mediaType === 'youtube' && youtubeUrl;
        const hasVimeo = mediaType === 'vimeo' && vimeoUrl;
        if (!hasMedia && !hasYouTube && !hasVimeo) {
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "jankx-wplyr-placeholder",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please configure media settings in the sidebar.', 'jankx')
                })
            });
        }
        if (mediaType === 'video') {
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("video", {
                controls: true,
                poster: videoPoster?.url,
                ...(mediaOptions.includes('muted') && {
                    muted: true
                }),
                ...(mediaOptions.includes('loop') && {
                    loop: true
                }),
                ...(mediaOptions.includes('autoplay') && {
                    autoPlay: true
                }),
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("source", {
                        src: mediaUrl,
                        type: "video/mp4"
                    }), videoCaptions.map((caption, index) => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("track", {
                        kind: "captions",
                        src: caption.url,
                        srcLang: "en",
                        label: "English"
                    }, index)), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your browser does not support the video tag.', 'jankx')]
            });
        }
        if (mediaType === 'audio') {
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("audio", {
                controls: true,
                poster: audioPoster?.url,
                ...(mediaOptions.includes('muted') && {
                    muted: true
                }),
                ...(mediaOptions.includes('loop') && {
                    loop: true
                }),
                ...(mediaOptions.includes('autoplay') && {
                    autoPlay: true
                }),
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("source", {
                        src: mediaUrl,
                        type: "audio/mpeg"
                    }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your browser does not support the audio tag.', 'jankx')]
            });
        }
        if (mediaType === 'youtube') {
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "jankx-youtube-placeholder",
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('YouTube video will be loaded on the frontend.', 'jankx')
                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                children: "URL:"
                            }), " ", youtubeUrl]
                    })]
            });
        }
        if (mediaType === 'vimeo') {
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "jankx-vimeo-placeholder",
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vimeo video will be loaded on the frontend.', 'jankx')
                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                children: "URL:"
                            }), " ", vimeoUrl]
                    })]
            });
        }
        return null;
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        ...blockProps,
        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Media Settings', 'jankx'),
                        initialOpen: true,
                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Media Type', 'jankx'),
                                value: mediaType,
                                options: mediaTypeOptions,
                                onChange: value => setAttributes({
                                    mediaType: value
                                })
                            }), (mediaType === 'video' || mediaType === 'audio') && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Media URL', 'jankx'),
                                value: mediaUrl,
                                onChange: value => setAttributes({
                                    mediaUrl: value
                                }),
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the URL of your media file', 'jankx')
                            }), mediaType === 'youtube' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('YouTube URL', 'jankx'),
                                value: youtubeUrl,
                                onChange: value => setAttributes({
                                    youtubeUrl: value
                                }),
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the YouTube video URL', 'jankx')
                            }), mediaType === 'vimeo' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Vimeo URL', 'jankx'),
                                value: vimeoUrl,
                                onChange: value => setAttributes({
                                    vimeoUrl: value
                                }),
                                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the Vimeo video URL', 'jankx')
                            }), (mediaType === 'video' || mediaType === 'audio') && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Media Options', 'jankx')
                                        })
                                    }), mediaOptionsChoices.map(option => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
                                        label: option.label,
                                        checked: mediaOptions.includes(option.value),
                                        onChange: checked => handleMediaOptionChange(option.value, checked)
                                    }, option.value))]
                            })]
                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Player Settings', 'jankx'),
                        initialOpen: false,
                        children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Player Color', 'jankx')
                                        })
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPicker, {
                                        color: playerColor,
                                        onChange: color => setAttributes({
                                            playerColor: color
                                        })
                                    })]
                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Controls', 'jankx'),
                                value: controls,
                                options: controlOptions,
                                multiple: true,
                                onChange: handleControlChange
                            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'jankx'),
                                value: settings,
                                options: settingsOptions,
                                multiple: true,
                                onChange: handleSettingsChange
                            }), (controls.includes('rewind') || controls.includes('fast-forward')) && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
                                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Seek Time (seconds)', 'jankx'),
                                type: "number",
                                min: 5,
                                max: 60,
                                value: seekTime,
                                onChange: value => setAttributes({
                                    seekTime: parseInt(value) || 10
                                })
                            })]
                    }), (mediaType === 'video' || mediaType === 'audio') && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
                        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Media Files', 'jankx'),
                        initialOpen: false,
                        children: [mediaType === 'video' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Video Poster', 'jankx')
                                        })
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
                                            onSelect: media => setAttributes({
                                                videoPoster: media
                                            }),
                                            allowedTypes: ['image'],
                                            value: videoPoster?.id,
                                            render: ({ open }) => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                                                children: videoPoster ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                                    children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
                                                            src: videoPoster.url,
                                                            alt: videoPoster.alt,
                                                            style: {
                                                                maxWidth: '100px'
                                                            }
                                                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                                                            onClick: () => setAttributes({
                                                                videoPoster: null
                                                            }),
                                                            variant: "secondary",
                                                            isSmall: true,
                                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove', 'jankx')
                                                        })]
                                                }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                                                    onClick: open,
                                                    variant: "secondary",
                                                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose Poster Image', 'jankx')
                                                })
                                            })
                                        })
                                    })]
                            }), mediaType === 'audio' && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Audio Poster', 'jankx')
                                        })
                                    }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, {
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
                                            onSelect: media => setAttributes({
                                                audioPoster: media
                                            }),
                                            allowedTypes: ['image'],
                                            value: audioPoster?.id,
                                            render: ({ open }) => /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                                                children: audioPoster ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                                                    children: [/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
                                                            src: audioPoster.url,
                                                            alt: audioPoster.alt,
                                                            style: {
                                                                maxWidth: '100px'
                                                            }
                                                        }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                                                            onClick: () => setAttributes({
                                                                audioPoster: null
                                                            }),
                                                            variant: "secondary",
                                                            isSmall: true,
                                                            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove', 'jankx')
                                                        })]
                                                }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                                                    onClick: open,
                                                    variant: "secondary",
                                                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose Poster Image', 'jankx')
                                                })
                                            })
                                        })
                                    })]
                            })]
                    })]
            }), /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "jankx-wplyr-container",
                children: renderMediaPlayer()
            })]
    });
};
const Save = () => null;
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__, {
    edit: Edit,
    save: Save
});

})();

/******/ })()
;
//# sourceMappingURL=index.js.map