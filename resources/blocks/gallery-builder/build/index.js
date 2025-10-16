/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/gallery-builder/block.json":
/*!*******************************************!*\
  !*** ./blocks/gallery-builder/block.json ***!
  \*******************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","name":"jankx/gallery-builder","title":"Gallery Builder","category":"media","icon":"format-gallery","description":"Professional gallery viewer with slideshow, navigation controls, and rich content editing capabilities.","keywords":["gallery","slideshow","carousel","images","viewer","builder"],"textdomain":"jankx","supports":{"html":false,"anchor":true,"align":["wide","full"],"color":{"background":true,"text":true,"gradients":true,"link":true},"spacing":{"margin":true,"padding":true,"blockGap":true},"border":{"color":true,"width":true,"style":true,"radius":true},"background":{"backgroundImage":true,"backgroundPosition":true,"backgroundRepeat":true,"backgroundSize":true},"dimensions":{"minHeight":true,"__experimentalDefaultControls":{"minHeight":true}},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true}},"attributes":{"galleryId":{"type":"string"},"items":{"type":"array","default":[]},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":5000},"showThumbnails":{"type":"boolean","default":true},"showNavigation":{"type":"boolean","default":true},"showPagination":{"type":"boolean","default":true},"showCaptions":{"type":"boolean","default":true},"thumbnailPosition":{"type":"string","default":"top"},"imageSize":{"type":"string","default":"large"},"aspectRatio":{"type":"string","default":"16:9"},"transitionEffect":{"type":"string","default":"slide"},"transitionDuration":{"type":"number","default":500},"enableFullscreen":{"type":"boolean","default":true},"fullscreenAutoplay":{"type":"boolean","default":true},"fullscreenAutoplayDelay":{"type":"number","default":4000},"fullscreenText":{"type":"string","default":""},"captionPosition":{"type":"string","default":"overlay"}},"editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css"}');

/***/ }),

/***/ "./blocks/gallery-builder/edit.tsx":
/*!*****************************************!*\
  !*** ./blocks/gallery-builder/edit.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/edit.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./blocks/gallery-builder/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);






// editor style


function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    galleryId,
    items,
    autoplay,
    autoplayDelay,
    showThumbnails,
    showNavigation,
    showPagination,
    showCaptions,
    thumbnailPosition,
    imageSize,
    aspectRatio,
    transitionEffect,
    transitionDuration,
    enableFullscreen,
    fullscreenAutoplay,
    fullscreenAutoplayDelay,
    fullscreenText,
    captionPosition
  } = attributes;
  const [editingItem, setEditingItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const [currentSlide, setCurrentSlide] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(0);

  // Set gallery ID
  if (!galleryId) {
    setAttributes({
      galleryId: clientId.slice(0, 8)
    });
  }

  // Use WordPress block props with built-in supports
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: 'gallery-builder-editor'
  });

  // Handle media selection
  const onSelectMedia = media => {
    const galleryItems = media.map(item => ({
      id: item.id,
      url: item.url,
      alt: item.alt || '',
      caption: item.caption || '',
      title: item.title || ''
    }));
    setAttributes({
      items: galleryItems
    });
  };

  // Handle caption update
  const updateCaption = (itemId, caption) => {
    const updatedItems = items.map(item => item.id === itemId ? {
      ...item,
      caption
    } : item);
    setAttributes({
      items: updatedItems
    });
  };

  // Handle item removal
  const removeItem = itemId => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setAttributes({
      items: updatedItems
    });
    if (currentSlide >= updatedItems.length) {
      setCurrentSlide(Math.max(0, updatedItems.length - 1));
    }
  };

  // Handle add more images
  const addMoreImages = media => {
    const newItems = media.map(item => ({
      id: item.id,
      url: item.url,
      alt: item.alt || '',
      caption: item.caption || '',
      title: item.title || ''
    }));
    setAttributes({
      items: [...items, ...newItems]
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Gallery Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Autoplay', 'jankx'),
          checked: autoplay,
          onChange: value => setAttributes({
            autoplay: value
          })
        }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Autoplay Delay (ms)', 'jankx'),
          value: autoplayDelay,
          onChange: value => setAttributes({
            autoplayDelay: value
          }),
          min: 1000,
          max: 10000,
          step: 500
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Transition Effect', 'jankx'),
          value: transitionEffect,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Slide', 'jankx'),
            value: 'slide'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fade', 'jankx'),
            value: 'fade'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Zoom', 'jankx'),
            value: 'zoom'
          }],
          onChange: value => setAttributes({
            transitionEffect: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Transition Duration (ms)', 'jankx'),
          value: transitionDuration,
          onChange: value => setAttributes({
            transitionDuration: value
          }),
          min: 200,
          max: 2000,
          step: 100
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Show Thumbnails', 'jankx'),
          checked: showThumbnails,
          onChange: value => setAttributes({
            showThumbnails: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Show Navigation Arrows', 'jankx'),
          checked: showNavigation,
          onChange: value => setAttributes({
            showNavigation: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Show Pagination', 'jankx'),
          checked: showPagination,
          onChange: value => setAttributes({
            showPagination: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Show Captions', 'jankx'),
          checked: showCaptions,
          onChange: value => setAttributes({
            showCaptions: value
          })
        }), showThumbnails && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Thumbnail Position', 'jankx'),
          value: thumbnailPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Top', 'jankx'),
            value: 'top'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Bottom', 'jankx'),
            value: 'bottom'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Left', 'jankx'),
            value: 'left'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Right', 'jankx'),
            value: 'right'
          }],
          onChange: value => setAttributes({
            thumbnailPosition: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image Size', 'jankx'),
          value: imageSize,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Thumbnail', 'jankx'),
            value: 'thumbnail'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Medium', 'jankx'),
            value: 'medium'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Large', 'jankx'),
            value: 'large'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Full Size', 'jankx'),
            value: 'full'
          }],
          onChange: value => setAttributes({
            imageSize: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Aspect Ratio', 'jankx'),
          value: aspectRatio,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('16:9', 'jankx'),
            value: '16:9'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('4:3', 'jankx'),
            value: '4:3'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('1:1', 'jankx'),
            value: '1:1'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('3:2', 'jankx'),
            value: '3:2'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Free', 'jankx'),
            value: 'free'
          }],
          onChange: value => setAttributes({
            aspectRatio: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Caption Position', 'jankx'),
          value: captionPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Overlay on Image', 'jankx'),
            value: 'overlay'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Below Image', 'jankx'),
            value: 'below'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stack Below (50/50)', 'jankx'),
            value: 'stack'
          }],
          onChange: value => setAttributes({
            captionPosition: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fullscreen Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Enable Fullscreen Button', 'jankx'),
          checked: enableFullscreen,
          onChange: value => setAttributes({
            enableFullscreen: value
          })
        }), enableFullscreen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fullscreen Autoplay', 'jankx'),
            checked: fullscreenAutoplay,
            onChange: value => setAttributes({
              fullscreenAutoplay: value
            })
          }), fullscreenAutoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fullscreen Autoplay Delay (ms)', 'jankx'),
            value: fullscreenAutoplayDelay,
            onChange: value => setAttributes({
              fullscreenAutoplayDelay: value
            }),
            min: 1000,
            max: 10000,
            step: 500
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextareaControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Fullscreen Text', 'jankx'),
            value: fullscreenText,
            onChange: value => setAttributes({
              fullscreenText: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Enter text to display in fullscreen mode...', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('This text will be displayed in fullscreen slideshow mode', 'jankx')
          })]
        })]
      })]
    }), items.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarGroup, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUploadCheck, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUpload, {
            multiple: true,
            onSelect: addMoreImages,
            allowedTypes: ['image'],
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToolbarButton, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add More Images', 'jankx'),
              onClick: open,
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"]
            })
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: items.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaPlaceholder, {
        multiple: true,
        onSelect: onSelectMedia,
        allowedTypes: ['image'],
        labels: {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add Gallery Images', 'jankx'),
          instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Select multiple images to create a professional gallery viewer', 'jankx')
        }
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: `gallery-builder-preview caption-${captionPosition}`,
        children: [showThumbnails && thumbnailPosition === 'top' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          className: "gallery-thumbnails top",
          children: items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            className: `thumbnail ${index === currentSlide ? 'active' : ''}`,
            onClick: () => setCurrentSlide(index),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
              src: item.url,
              alt: item.alt
            })
          }, item.id))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "gallery-main",
          children: [showNavigation && items.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
              className: "gallery-nav prev",
              onClick: () => setCurrentSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1),
              children: "\u2039"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
              className: "gallery-nav next",
              onClick: () => setCurrentSlide(currentSlide === items.length - 1 ? 0 : currentSlide + 1),
              children: "\u203A"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "gallery-slide",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
              className: "slide-image-container",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
                src: items[currentSlide]?.url,
                alt: items[currentSlide]?.alt,
                className: "main-image"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
                className: "slide-actions",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
                  onClick: () => setEditingItem(items[currentSlide]?.id),
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Edit Caption', 'jankx')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
                  onClick: () => removeItem(items[currentSlide]?.id),
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Remove Image', 'jankx')
                })]
              })]
            }), showCaptions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
              className: "slide-caption",
              children: editingItem === items[currentSlide]?.id ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
                tagName: "div",
                value: items[currentSlide]?.caption || '',
                onChange: value => updateCaption(items[currentSlide]?.id, value),
                onBlur: () => setEditingItem(null),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Enter caption...', 'jankx'),
                allowedFormats: ['bold', 'italic', 'link']
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                className: "caption-display",
                onClick: () => setEditingItem(items[currentSlide]?.id),
                children: items[currentSlide]?.caption || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
                  className: "caption-placeholder",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Click to add caption', 'jankx')
                })
              })
            })]
          })]
        }), showThumbnails && thumbnailPosition === 'bottom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          className: "gallery-thumbnails bottom",
          children: items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            className: `thumbnail ${index === currentSlide ? 'active' : ''}`,
            onClick: () => setCurrentSlide(index),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
              src: item.url,
              alt: item.alt
            })
          }, item.id))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "gallery-controls",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "gallery-controls-left",
            children: [enableFullscreen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              onClick: () => {/* Fullscreen functionality will be handled by frontend JS */},
              variant: "secondary",
              className: "fullscreen-button",
              "data-fslightbox": galleryId,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("svg", {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "currentColor",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("path", {
                  d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                })
              }), fullscreenText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Xem tự động', 'jankx')]
            }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              onClick: () => setAttributes({
                autoplay: !autoplay
              }),
              variant: "secondary",
              children: autoplay ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Stop Autoplay', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Start Autoplay', 'jankx')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            className: "gallery-controls-right",
            children: showPagination && items.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
              className: "gallery-pagination-numbers",
              children: items.map((_, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
                className: `pagination-number ${index === currentSlide ? 'active' : ''}`,
                onClick: () => setCurrentSlide(index),
                children: index + 1
              }, index))
            })
          })]
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/gallery-builder/editor.scss":
/*!********************************************!*\
  !*** ./blocks/gallery-builder/editor.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/gallery-builder/save.tsx":
/*!*****************************************!*\
  !*** ./blocks/gallery-builder/save.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function Save({
  attributes
}) {
  const {
    galleryId,
    items,
    autoplay,
    autoplayDelay,
    showThumbnails,
    showNavigation,
    showPagination,
    showCaptions,
    thumbnailPosition,
    imageSize,
    aspectRatio,
    transitionEffect,
    transitionDuration,
    enableFullscreen,
    fullscreenAutoplay,
    fullscreenAutoplayDelay,
    fullscreenText,
    captionPosition
  } = attributes;
  if (!items || items.length === 0) {
    return null;
  }

  // Use WordPress block props with built-in supports
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();

  // Generate data attributes for JavaScript
  const dataAttributes = {
    'data-gallery-id': galleryId,
    'data-autoplay': autoplay,
    'data-autoplay-delay': autoplayDelay,
    'data-show-thumbnails': showThumbnails,
    'data-show-navigation': showNavigation,
    'data-show-pagination': showPagination,
    'data-show-captions': showCaptions,
    'data-thumbnail-position': thumbnailPosition,
    'data-image-size': imageSize,
    'data-aspect-ratio': aspectRatio,
    'data-transition-effect': transitionEffect,
    'data-transition-duration': transitionDuration,
    'data-enable-fullscreen': enableFullscreen,
    'data-fullscreen-autoplay': fullscreenAutoplay,
    'data-fullscreen-autoplay-delay': fullscreenAutoplayDelay,
    'data-fullscreen-text': fullscreenText,
    'data-caption-position': captionPosition
  };

  // Merge classes
  const className = `${blockProps.className || ''} gallery-${galleryId} caption-${captionPosition}`.trim();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    ...blockProps,
    className: className,
    ...dataAttributes,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "gallery-builder-container",
      children: [showThumbnails && thumbnailPosition === 'top' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "gallery-thumbnails top",
        children: items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "thumbnail",
          "data-slide": index,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
            src: item.url,
            alt: item.alt,
            loading: "lazy"
          })
        }, item.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "gallery-main",
        children: [showNavigation && items.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: "gallery-nav prev",
            "aria-label": "Previous image",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
            className: "gallery-nav next",
            "aria-label": "Next image",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
              })
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "gallery-slides",
          children: items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: `gallery-slide ${index === 0 ? 'active' : ''}`,
            "data-slide": index,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
              className: "slide-image-container",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
                src: item.url,
                alt: item.alt,
                className: "main-image",
                loading: index === 0 ? 'eager' : 'lazy'
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
                href: item.url,
                "data-fslightbox": galleryId,
                "data-caption": item.caption || '',
                "data-autoplay": "true",
                style: {
                  display: 'none'
                },
                "aria-hidden": "true",
                children: item.alt
              })]
            }), showCaptions && item.caption && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              className: "slide-caption",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
                className: "caption-content",
                dangerouslySetInnerHTML: {
                  __html: item.caption
                }
              })
            })]
          }, item.id))
        })]
      }), showThumbnails && thumbnailPosition === 'bottom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "gallery-thumbnails bottom",
        children: items.map((item, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "thumbnail",
          "data-slide": index,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
            src: item.url,
            alt: item.alt,
            loading: "lazy"
          })
        }, item.id))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "gallery-controls",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "gallery-controls-left",
          children: [enableFullscreen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
            className: "fullscreen-button",
            "aria-label": "Open fullscreen slideshow",
            "data-fslightbox": galleryId,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              })
            }), fullscreenText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Xem tự động', 'jankx')]
          }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
            className: "autoplay-toggle",
            "aria-label": "Toggle autoplay",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              className: "play-icon",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M8 5v14l11-7z"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("svg", {
              className: "pause-icon",
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("path", {
                d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
              })
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "gallery-controls-right",
          children: showPagination && items.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "gallery-pagination-numbers",
            children: items.map((_, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
              className: `pagination-number ${index === 0 ? 'active' : ''}`,
              "data-slide": index,
              "aria-label": `Go to slide ${index + 1}`,
              children: index + 1
            }, index))
          })
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./blocks/gallery-builder/style.scss":
/*!*******************************************!*\
  !*** ./blocks/gallery-builder/style.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/edit.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/edit.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pencil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pencil */ "./node_modules/@wordpress/icons/build-module/library/pencil.js");
/**
 * Internal dependencies
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_pencil__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/pencil.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/pencil.js ***!
  \**********************************************************************/
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


const pencil = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pencil);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/plus.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plus.js ***!
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


const plus = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plus);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.js ***!
  \*********************************************************************/
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


const trash = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 5.5A2.25 2.25 0 0 0 9.878 7h4.244A2.251 2.251 0 0 0 12 5.5ZM12 4a3.751 3.751 0 0 0-3.675 3H5v1.5h1.27l.818 8.997a2.75 2.75 0 0 0 2.739 2.501h4.347a2.75 2.75 0 0 0 2.738-2.5L17.73 8.5H19V7h-3.325A3.751 3.751 0 0 0 12 4Zm4.224 4.5H7.776l.806 8.861a1.25 1.25 0 0 0 1.245 1.137h4.347a1.25 1.25 0 0 0 1.245-1.137l.805-8.861Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trash);

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
/*!******************************************!*\
  !*** ./blocks/gallery-builder/index.tsx ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/gallery-builder/style.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/gallery-builder/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/gallery-builder/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/gallery-builder/save.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);




/**
 * Internal dependencies
 */



/**
 * Block Registration
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__, {
  icon: {
    src: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("svg", {
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
        d: "M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"
      })
    }),
    foreground: '#ffffff',
    background: '#006BA1'
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map