/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-image-box/block.json":
/*!**********************************************!*\
  !*** ./blocks/advanced-image-box/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-image-box","title":"Advanced Image Box","category":"jankx-blocks","description":"An advanced image block with overlay info box and inner content support.","keywords":["image","overlay","hover","animation","inner blocks"],"textdomain":"jankx","attributes":{"url":{"type":"string","source":"attribute","selector":"img","attribute":"src","role":"content"},"alt":{"type":"string","source":"attribute","selector":"img","attribute":"alt","default":"","role":"content"},"title":{"type":"string","source":"attribute","selector":"img","attribute":"title","role":"content"},"id":{"type":"number","role":"content"},"width":{"type":"string"},"height":{"type":"string"},"aspectRatio":{"type":"string"},"scale":{"type":"string"},"sizeSlug":{"type":"string"},"href":{"type":"string","source":"attribute","selector":"a","attribute":"href","role":"content"},"linkTarget":{"type":"string","source":"attribute","selector":"a","attribute":"target"},"rel":{"type":"string","source":"attribute","selector":"a","attribute":"rel"},"caption":{"type":"rich-text","source":"rich-text","selector":".wp-block-jankx-advanced-image-box__caption","role":"content"},"showOverlayOnHover":{"type":"boolean","default":true},"overlayAnimation":{"type":"string","default":"fadeIn"},"overlayAnimationDuration":{"type":"number","default":1000},"overlayAnimationDelay":{"type":"number","default":0},"overlayPosition":{"type":"string","default":"center"},"overlayBackground":{"type":"string","default":"rgba(0, 0, 0, 0.7)"},"overlayOpacity":{"type":"number","default":1},"imageHoverEffect":{"type":"string","default":"zoom"},"borderRadius":{"type":"string","default":"0px"}},"supports":{"anchor":true,"align":["left","center","right","wide","full"],"html":false,"innerBlocks":true,"reusable":false,"interactivity":{"clientNavigation":true},"color":{"text":false,"background":false,"gradients":true,"__experimentalSkipSerialization":true},"spacing":{"margin":true,"padding":true,"__experimentalDefaultControls":{"margin":true,"padding":true}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"shadow":{"__experimentalSkipSerialization":true},"filter":{"duotone":true}},"selectors":{"border":".wp-block-jankx-advanced-image-box img, .wp-block-jankx-advanced-image-box__overlay","shadow":".wp-block-jankx-advanced-image-box img, .wp-block-jankx-advanced-image-box__overlay","filter":{"duotone":".wp-block-jankx-advanced-image-box img"}},"styles":[{"name":"default","label":"Default","isDefault":true},{"name":"card","label":"Card"},{"name":"overlay","label":"Overlay"},{"name":"modern","label":"Modern"}],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');

/***/ }),

/***/ "./blocks/advanced-image-box/constants.ts":
/*!************************************************!*\
  !*** ./blocks/advanced-image-box/constants.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALLOWED_INNER_BLOCKS: () => (/* binding */ ALLOWED_INNER_BLOCKS),
/* harmony export */   ALLOWED_MEDIA_TYPES: () => (/* binding */ ALLOWED_MEDIA_TYPES),
/* harmony export */   ANIMATION_OPTIONS: () => (/* binding */ ANIMATION_OPTIONS),
/* harmony export */   DEFAULT_ATTRIBUTES: () => (/* binding */ DEFAULT_ATTRIBUTES),
/* harmony export */   DEFAULT_INNER_BLOCKS_TEMPLATE: () => (/* binding */ DEFAULT_INNER_BLOCKS_TEMPLATE),
/* harmony export */   DEFAULT_MEDIA_SIZE_SLUG: () => (/* binding */ DEFAULT_MEDIA_SIZE_SLUG),
/* harmony export */   HOVER_EFFECTS: () => (/* binding */ HOVER_EFFECTS),
/* harmony export */   LINK_DESTINATION_ATTACHMENT: () => (/* binding */ LINK_DESTINATION_ATTACHMENT),
/* harmony export */   LINK_DESTINATION_CUSTOM: () => (/* binding */ LINK_DESTINATION_CUSTOM),
/* harmony export */   LINK_DESTINATION_MEDIA: () => (/* binding */ LINK_DESTINATION_MEDIA),
/* harmony export */   LINK_DESTINATION_NONE: () => (/* binding */ LINK_DESTINATION_NONE),
/* harmony export */   MIN_SIZE: () => (/* binding */ MIN_SIZE),
/* harmony export */   NEW_TAB_REL: () => (/* binding */ NEW_TAB_REL),
/* harmony export */   OVERLAY_POSITIONS: () => (/* binding */ OVERLAY_POSITIONS),
/* harmony export */   SCALE_OPTIONS: () => (/* binding */ SCALE_OPTIONS),
/* harmony export */   VALIDATION_RULES: () => (/* binding */ VALIDATION_RULES)
/* harmony export */ });
/**
 * Constants for Advanced Image Box block
 */

const ALLOWED_MEDIA_TYPES = ['image'];
const DEFAULT_MEDIA_SIZE_SLUG = 'full';
const MIN_SIZE = 20;
const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';
const LINK_DESTINATION_CUSTOM = 'custom';
const NEW_TAB_REL = ['noreferrer', 'noopener'];

// Allowed inner blocks for overlay content
const ALLOWED_INNER_BLOCKS = ['core/heading', 'core/paragraph', 'core/button', 'core/list', 'core/group', 'core/columns', 'core/column', 'core/spacer', 'core/separator', 'jankx/svg-icon', 'jankx/icon-button'];

// Default inner blocks template
const DEFAULT_INNER_BLOCKS_TEMPLATE = [{
  name: 'core/heading',
  attributes: {
    level: 3,
    placeholder: 'Add overlay title',
    textAlign: 'center'
  }
}, {
  name: 'core/paragraph',
  attributes: {
    placeholder: 'Add overlay description',
    textAlign: 'center'
  }
}, {
  name: 'core/button',
  attributes: {
    text: 'Learn More',
    className: 'is-style-outline',
    textAlign: 'center'
  }
}];

// Animation options from Animate.css
const ANIMATION_OPTIONS = [
// Fade animations
{
  value: 'fadeIn',
  label: 'Fade In',
  description: 'Fade in from transparent to opaque',
  category: 'Fade'
}, {
  value: 'fadeInUp',
  label: 'Fade In Up',
  description: 'Fade in while sliding up',
  category: 'Fade'
}, {
  value: 'fadeInDown',
  label: 'Fade In Down',
  description: 'Fade in while sliding down',
  category: 'Fade'
}, {
  value: 'fadeInLeft',
  label: 'Fade In Left',
  description: 'Fade in while sliding from left',
  category: 'Fade'
}, {
  value: 'fadeInRight',
  label: 'Fade In Right',
  description: 'Fade in while sliding from right',
  category: 'Fade'
},
// Slide animations
{
  value: 'slideInUp',
  label: 'Slide In Up',
  description: 'Slide in from bottom',
  category: 'Slide'
}, {
  value: 'slideInDown',
  label: 'Slide In Down',
  description: 'Slide in from top',
  category: 'Slide'
}, {
  value: 'slideInLeft',
  label: 'Slide In Left',
  description: 'Slide in from left',
  category: 'Slide'
}, {
  value: 'slideInRight',
  label: 'Slide In Right',
  description: 'Slide in from right',
  category: 'Slide'
},
// Zoom animations
{
  value: 'zoomIn',
  label: 'Zoom In',
  description: 'Scale up from small to normal size',
  category: 'Zoom'
}, {
  value: 'zoomInUp',
  label: 'Zoom In Up',
  description: 'Zoom in while sliding up',
  category: 'Zoom'
}, {
  value: 'zoomInDown',
  label: 'Zoom In Down',
  description: 'Zoom in while sliding down',
  category: 'Zoom'
}, {
  value: 'zoomInLeft',
  label: 'Zoom In Left',
  description: 'Zoom in while sliding from left',
  category: 'Zoom'
}, {
  value: 'zoomInRight',
  label: 'Zoom In Right',
  description: 'Zoom in while sliding from right',
  category: 'Zoom'
},
// Bounce animations
{
  value: 'bounceIn',
  label: 'Bounce In',
  description: 'Bounce in with elastic effect',
  category: 'Bounce'
}, {
  value: 'bounceInUp',
  label: 'Bounce In Up',
  description: 'Bounce in from bottom',
  category: 'Bounce'
}, {
  value: 'bounceInDown',
  label: 'Bounce In Down',
  description: 'Bounce in from top',
  category: 'Bounce'
}, {
  value: 'bounceInLeft',
  label: 'Bounce In Left',
  description: 'Bounce in from left',
  category: 'Bounce'
}, {
  value: 'bounceInRight',
  label: 'Bounce In Right',
  description: 'Bounce in from right',
  category: 'Bounce'
},
// Flip animations
{
  value: 'flipInX',
  label: 'Flip In X',
  description: 'Flip in around X axis',
  category: 'Flip'
}, {
  value: 'flipInY',
  label: 'Flip In Y',
  description: 'Flip in around Y axis',
  category: 'Flip'
},
// Rotate animations
{
  value: 'rotateIn',
  label: 'Rotate In',
  description: 'Rotate in with fade',
  category: 'Rotate'
}, {
  value: 'rotateInDownLeft',
  label: 'Rotate In Down Left',
  description: 'Rotate in from down left',
  category: 'Rotate'
}, {
  value: 'rotateInDownRight',
  label: 'Rotate In Down Right',
  description: 'Rotate in from down right',
  category: 'Rotate'
},
// Special effects
{
  value: 'pulse',
  label: 'Pulse',
  description: 'Pulsing scale effect',
  category: 'Special'
}, {
  value: 'shake',
  label: 'Shake',
  description: 'Shaking effect',
  category: 'Special'
}, {
  value: 'swing',
  label: 'Swing',
  description: 'Swinging effect',
  category: 'Special'
}, {
  value: 'tada',
  label: 'Tada',
  description: 'Celebration effect',
  category: 'Special'
}, {
  value: 'wobble',
  label: 'Wobble',
  description: 'Wobbling effect',
  category: 'Special'
}];
const OVERLAY_POSITIONS = [{
  value: 'top',
  label: 'Top',
  description: 'Overlay positioned at top'
}, {
  value: 'center',
  label: 'Center',
  description: 'Overlay positioned at center'
}, {
  value: 'bottom',
  label: 'Bottom',
  description: 'Overlay positioned at bottom'
}, {
  value: 'left',
  label: 'Left',
  description: 'Overlay positioned at left'
}, {
  value: 'right',
  label: 'Right',
  description: 'Overlay positioned at right'
}];
const HOVER_EFFECTS = [{
  value: 'none',
  label: 'None',
  description: 'No hover effect'
}, {
  value: 'zoom',
  label: 'Zoom',
  description: 'Scale image on hover'
}, {
  value: 'fade',
  label: 'Fade',
  description: 'Fade image on hover'
}, {
  value: 'blur',
  label: 'Blur',
  description: 'Blur image on hover'
}, {
  value: 'grayscale',
  label: 'Grayscale',
  description: 'Convert to grayscale on hover'
}, {
  value: 'sepia',
  label: 'Sepia',
  description: 'Apply sepia filter on hover'
}, {
  value: 'brightness',
  label: 'Brightness',
  description: 'Change brightness on hover'
}];
const SCALE_OPTIONS = [{
  value: 'cover',
  label: 'Cover',
  help: 'Image covers the space evenly.'
}, {
  value: 'contain',
  label: 'Contain',
  help: 'Image is contained without distortion.'
}, {
  value: 'fill',
  label: 'Fill',
  help: 'Image fills the space, may be distorted.'
}, {
  value: 'scale-down',
  label: 'Scale Down',
  help: 'Image scales down to fit.'
}];
const DEFAULT_ATTRIBUTES = {
  showOverlayOnHover: true,
  overlayAnimation: 'fadeIn',
  overlayAnimationDuration: 1000,
  overlayAnimationDelay: 0,
  overlayPosition: 'center',
  overlayBackground: 'rgba(0, 0, 0, 0.7)',
  overlayOpacity: 1,
  imageHoverEffect: 'zoom',
  borderRadius: '0px',
  scale: 'cover'
};

// Validation rules
const VALIDATION_RULES = {
  requiredAttributes: ['url'],
  maxInnerBlocks: 10,
  allowedBlockTypes: ALLOWED_INNER_BLOCKS,
  maxAnimationDuration: 5000,
  minAnimationDuration: 100,
  maxAnimationDelay: 2000,
  minAnimationDelay: 0,
  maxOverlayOpacity: 1,
  minOverlayOpacity: 0
};

/***/ }),

/***/ "./blocks/advanced-image-box/deprecated.tsx":
/*!**************************************************!*\
  !*** ./blocks/advanced-image-box/deprecated.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   migrateAttributes: () => (/* binding */ migrateAttributes),
/* harmony export */   v1: () => (/* binding */ v1),
/* harmony export */   v2: () => (/* binding */ v2)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Deprecated versions of Advanced Image Box block
 */

/**
 * Migrate old attributes to new structure
 */
const migrateAttributes = oldAttributes => {
  return {
    ...oldAttributes,
    // Map old attributes to new structure
    showOverlayOnHover: oldAttributes.showOverlay !== undefined ? oldAttributes.showOverlay : true,
    overlayAnimation: oldAttributes.animation || 'fadeIn',
    overlayPosition: oldAttributes.position || 'center',
    overlayBackground: oldAttributes.overlayColor || 'rgba(0, 0, 0, 0.7)',
    overlayOpacity: oldAttributes.opacity !== undefined ? oldAttributes.opacity : 1,
    imageHoverEffect: oldAttributes.hoverEffect || 'zoom',
    borderRadius: oldAttributes.radius || '0px'
  };
};

/**
 * Version 1 - Initial version with basic overlay support
 */
const v1 = {
  attributes: {
    url: {
      type: 'string',
      source: 'attribute',
      selector: 'img',
      attribute: 'src'
    },
    alt: {
      type: 'string',
      source: 'attribute',
      selector: 'img',
      attribute: 'alt'
    },
    title: {
      type: 'string',
      source: 'attribute',
      selector: 'img',
      attribute: 'title'
    },
    id: {
      type: 'number'
    },
    showOverlay: {
      type: 'boolean',
      default: true
    },
    animation: {
      type: 'string',
      default: 'fadeIn'
    },
    position: {
      type: 'string',
      default: 'center'
    },
    overlayColor: {
      type: 'string',
      default: 'rgba(0, 0, 0, 0.7)'
    },
    opacity: {
      type: 'number',
      default: 1
    },
    hoverEffect: {
      type: 'string',
      default: 'zoom'
    },
    radius: {
      type: 'string',
      default: '0px'
    }
  },
  save({
    attributes
  }) {
    const {
      url,
      alt,
      title,
      id,
      showOverlay,
      animation,
      position,
      overlayColor,
      opacity,
      hoverEffect,
      radius
    } = attributes;
    const imageElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
      src: url,
      alt: alt || '',
      title: title,
      className: `wp-block-jankx-advanced-image-box__image ${hoverEffect !== 'none' ? `has-hover-${hoverEffect}` : ''}`,
      style: {
        borderRadius: radius
      }
    });
    const overlayContent = showOverlay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: `wp-block-jankx-advanced-image-box__overlay wp-block-jankx-advanced-image-box__overlay--${position} animated ${animation}`,
      style: {
        backgroundColor: overlayColor,
        opacity: opacity
      }
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("figure", {
      className: "wp-block-jankx-advanced-image-box",
      children: [imageElement, overlayContent]
    });
  }
};

/**
 * Version 2 - Added inner blocks support
 */
const v2 = {
  attributes: {
    ...v1.attributes,
    innerBlocks: {
      type: 'array',
      default: []
    }
  },
  save({
    attributes
  }) {
    const {
      url,
      alt,
      title,
      id,
      showOverlay,
      animation,
      position,
      overlayColor,
      opacity,
      hoverEffect,
      radius,
      innerBlocks
    } = attributes;
    const imageElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
      src: url,
      alt: alt || '',
      title: title,
      className: `wp-block-jankx-advanced-image-box__image ${hoverEffect !== 'none' ? `has-hover-${hoverEffect}` : ''}`,
      style: {
        borderRadius: radius
      }
    });
    const overlayContent = showOverlay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: `wp-block-jankx-advanced-image-box__overlay wp-block-jankx-advanced-image-box__overlay--${position} animated ${animation}`,
      style: {
        backgroundColor: overlayColor,
        opacity: opacity
      },
      children: innerBlocks && innerBlocks.map((block, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: `wp-block-${block.name.replace('/', '-')}`,
        children: block.attributes?.content && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
          dangerouslySetInnerHTML: {
            __html: block.attributes.content
          }
        })
      }, index))
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("figure", {
      className: "wp-block-jankx-advanced-image-box",
      children: [imageElement, overlayContent]
    });
  }
};

/**
 * Export deprecated versions
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([v2, v1]);

/***/ }),

/***/ "./blocks/advanced-image-box/edit.tsx":
/*!********************************************!*\
  !*** ./blocks/advanced-image-box/edit.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ edit)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/link.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/link-off.js");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/blob */ "@wordpress/blob");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blob__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./constants */ "./blocks/advanced-image-box/constants.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */








/**
 * Internal dependencies
 */



function edit({
  attributes,
  setAttributes,
  isSelected,
  className,
  clientId,
  context,
  onReplace,
  insertBlocksAfter
}) {
  const {
    url = '',
    alt = '',
    title = '',
    id = 0,
    width = '',
    height = '',
    aspectRatio = '',
    scale = '',
    href = '',
    linkTarget = '',
    rel = '',
    caption = '',
    showOverlayOnHover = false,
    overlayAnimation = 'fadeIn',
    overlayAnimationDuration = 1000,
    overlayAnimationDelay = 0,
    overlayPosition = 'bottom',
    overlayBackground = 'rgba(0,0,0,0.5)',
    overlayOpacity = 1,
    imageHoverEffect = 'none',
    borderRadius = '0px'
  } = attributes || {};

  // Validation state removed for better UX
  const [isEditingURL, setIsEditingURL] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalUseBorderProps)(attributes);
  const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalGetShadowClassesAndStyles)(attributes);
  const blockEditingMode = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockEditingMode)();
  const {
    getSettings,
    getBlockRootClientId
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  const {
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useDispatch)('core/notices');

  // Get inner blocks for validation
  const innerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const blocks = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store).getBlocks(clientId);
    return Array.isArray(blocks) ? blocks : [];
  }, [clientId]);

  // Validation removed for better UX

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    ref: setPopoverAnchor,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(className, 'wp-block-jankx-advanced-image-box', {
      'has-overlay': showOverlayOnHover,
      'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none',
      'is-selected': isSelected
    })
  });
  const onSelectImage = media => {
    if (!media || !media.url) {
      setAttributes({
        url: undefined,
        alt: undefined,
        id: undefined,
        title: undefined
      });
      return;
    }
    if ((0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_8__.isBlobURL)(media.url)) {
      return;
    }
    const {
      imageDefaultSize
    } = getSettings();
    const newSize = imageDefaultSize || 'full';
    setAttributes({
      url: media.url,
      alt: media.alt || '',
      title: media.title || '',
      id: media.id,
      sizeSlug: newSize
    });
  };
  const onSelectURL = newURL => {
    if (newURL !== url) {
      setAttributes({
        url: newURL,
        id: undefined,
        sizeSlug: getSettings().imageDefaultSize
      });
    }
  };
  const onUploadError = message => {
    createErrorNotice(message, {
      type: 'snackbar'
    });
    setAttributes({
      url: undefined,
      id: undefined
    });
  };
  const startEditing = () => {
    setIsEditingURL(true);
  };
  const unlink = () => {
    setAttributes({
      href: undefined,
      linkTarget: undefined,
      rel: undefined
    });
    setIsEditingURL(false);
  };

  // Validation notice removed for better UX

  const imageElement = url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("img", {
    src: url,
    alt: alt || '',
    title: title,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__image', borderProps.className, {
      [`has-hover-${imageHoverEffect}`]: imageHoverEffect && imageHoverEffect !== 'none'
    }),
    style: {
      ...borderProps.style,
      ...shadowProps.style,
      aspectRatio,
      objectFit: scale,
      width,
      height,
      borderRadius
    }
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: "wp-block-jankx-advanced-image-box__placeholder",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
      mediaId: id,
      mediaURL: url,
      allowedTypes: ['image'],
      accept: "image/*",
      onSelect: onSelectImage,
      onSelectURL: onSelectURL,
      onError: onUploadError,
      name: !url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace')
    })
  });
  const overlayContent = showOverlayOnHover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__overlay', `wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`, 'animated', overlayAnimation),
    style: {
      opacity: overlayOpacity,
      animationDuration: `${overlayAnimationDuration}ms`,
      animationDelay: `${overlayAnimationDelay}ms`
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__overlay__content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
        allowedBlocks: _constants__WEBPACK_IMPORTED_MODULE_9__.ALLOWED_INNER_BLOCKS,
        templateLock: false,
        renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.ButtonBlockAppender
      })
    })
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      ...blockProps,
      children: [imageElement, overlayContent, !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.isEmpty(caption) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
        className: "wp-block-jankx-advanced-image-box__caption",
        tagName: "figcaption",
        value: caption,
        onChange: value => setAttributes({
          caption: value
        }),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add caption…')
      })]
    }), isSelected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
          mediaId: id,
          mediaURL: url,
          allowedTypes: ['image'],
          accept: "image/*",
          onSelect: onSelectImage,
          onSelectURL: onSelectURL,
          onError: onUploadError,
          name: !url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace')
        }), href && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unlink'),
          onClick: unlink
        }), !href && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link'),
          onClick: startEditing
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image Settings'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
          className: "wp-block-jankx-advanced-image-box__alt-text",
          tagName: "p",
          value: alt || '',
          onChange: value => setAttributes({
            alt: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add alt text…'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the purpose of the image. Leave empty if decorative.')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
          className: "wp-block-jankx-advanced-image-box__title",
          tagName: "p",
          value: title || '',
          onChange: value => setAttributes({
            title: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add title…'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the role of this image on the page.')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Settings'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show overlay on hover'),
          checked: showOverlayOnHover,
          onChange: value => setAttributes({
            showOverlayOnHover: value
          })
        }), showOverlayOnHover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation'),
            value: overlayAnimation,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('None'),
              value: 'none'
            }, ..._constants__WEBPACK_IMPORTED_MODULE_9__.ANIMATION_OPTIONS.map(option => ({
              label: option.label,
              value: option.value
            }))],
            onChange: value => setAttributes({
              overlayAnimation: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation Duration (ms)'),
            value: overlayAnimationDuration,
            onChange: value => setAttributes({
              overlayAnimationDuration: value
            }),
            min: 100,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation Delay (ms)'),
            value: overlayAnimationDelay,
            onChange: value => setAttributes({
              overlayAnimationDelay: value
            }),
            min: 0,
            max: 2000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Position'),
            value: overlayPosition,
            options: _constants__WEBPACK_IMPORTED_MODULE_9__.OVERLAY_POSITIONS.map(position => ({
              label: position.label,
              value: position.value
            })),
            onChange: value => setAttributes({
              overlayPosition: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPicker, {
            color: overlayBackground,
            onChange: value => setAttributes({
              overlayBackground: value
            }),
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Background')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Opacity'),
            value: overlayOpacity,
            onChange: value => setAttributes({
              overlayOpacity: value
            }),
            min: 0,
            max: 1,
            step: 0.1
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover Effects'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image Hover Effect'),
          value: imageHoverEffect,
          options: _constants__WEBPACK_IMPORTED_MODULE_9__.HOVER_EFFECTS.map(effect => ({
            label: effect.label,
            value: effect.value
          })),
          onChange: value => setAttributes({
            imageHoverEffect: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Styling'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Radius (px)'),
          value: parseInt(borderRadius) || 0,
          onChange: value => setAttributes({
            borderRadius: `${value}px`
          }),
          min: 0,
          max: 50,
          step: 1
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./blocks/advanced-image-box/save.tsx":
/*!********************************************!*\
  !*** ./blocks/advanced-image-box/save.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _validationUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validationUtils */ "./blocks/advanced-image-box/validationUtils.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */



function save({
  attributes,
  className
}) {
  const {
    url,
    alt,
    title,
    id,
    width,
    height,
    aspectRatio,
    scale,
    href,
    linkTarget,
    rel,
    caption,
    showOverlayOnHover,
    overlayAnimation,
    overlayAnimationDuration,
    overlayAnimationDelay,
    overlayPosition,
    overlayBackground,
    overlayOpacity,
    imageHoverEffect,
    borderRadius
  } = attributes;

  // Validate content before saving
  const validation = (0,_validationUtils__WEBPACK_IMPORTED_MODULE_2__.validateBlockContent)(attributes, []);
  if (!validation.isValid && validation.issues) {
    console.warn('Advanced Image Box validation issues:', validation.issues);
  }
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetBorderClassesAndStyles)(attributes);
  const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetShadowClassesAndStyles)(attributes);
  const imageClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__image', borderProps.className, {
    [`wp-image-${id}`]: !!id,
    [`has-hover-${imageHoverEffect}`]: imageHoverEffect && imageHoverEffect !== 'none'
  });
  const imageStyle = {
    ...borderProps.style,
    ...shadowProps.style,
    aspectRatio,
    objectFit: scale,
    width,
    height,
    borderRadius
  };
  const imageElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
    src: url,
    alt: alt || '',
    title: title,
    className: imageClasses,
    style: imageStyle
  });

  // Create overlay content if enabled
  const overlayContent = showOverlayOnHover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__overlay', `wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`, 'animated', overlayAnimation),
    style: {
      opacity: overlayOpacity,
      animationDuration: `${overlayAnimationDuration}ms`,
      animationDelay: `${overlayAnimationDelay}ms`
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__overlay__content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    })
  });

  // Wrap image with link if href is provided
  const wrappedImage = href ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
    href: href,
    target: linkTarget,
    rel: rel,
    className: "wp-block-jankx-advanced-image-box__link",
    children: imageElement
  }) : imageElement;
  const blockClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(className, 'wp-block-jankx-advanced-image-box', {
    'has-overlay': showOverlayOnHover,
    'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("figure", {
    ..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: blockClasses
    }),
    children: [wrappedImage, overlayContent, !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.isEmpty(caption) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      className: "wp-block-jankx-advanced-image-box__caption",
      tagName: "figcaption",
      value: caption
    })]
  });
}

/***/ }),

/***/ "./blocks/advanced-image-box/validationUtils.ts":
/*!******************************************************!*\
  !*** ./blocks/advanced-image-box/validationUtils.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getValidationSummary: () => (/* binding */ getValidationSummary),
/* harmony export */   isAllowedInnerBlock: () => (/* binding */ isAllowedInnerBlock),
/* harmony export */   validateAnimationSettings: () => (/* binding */ validateAnimationSettings),
/* harmony export */   validateBlockAttributes: () => (/* binding */ validateBlockAttributes),
/* harmony export */   validateBlockContent: () => (/* binding */ validateBlockContent),
/* harmony export */   validateInnerBlocks: () => (/* binding */ validateInnerBlocks),
/* harmony export */   validateOverlaySettings: () => (/* binding */ validateOverlaySettings)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./blocks/advanced-image-box/constants.ts");
/**
 * Validation utilities for Advanced Image Box block
 */



/**
 * Validate block content including attributes and inner blocks
 */
const validateBlockContent = (attributes, innerBlocks = []) => {
  const issues = [];

  // Validate required attributes
  if (!attributes.url && !attributes.id) {
    issues.push({
      type: 'error',
      message: 'Image URL or ID is required'
    });
  }

  // Validate inner blocks structure
  if (innerBlocks.length > 0) {
    const validInnerBlocks = validateInnerBlocks(innerBlocks);
    if (!validInnerBlocks.isValid) {
      issues.push(...(validInnerBlocks.issues || []));
    }
  }

  // Validate overlay settings
  if (attributes.showOverlayOnHover) {
    if (!attributes.overlayAnimation) {
      issues.push({
        type: 'warning',
        message: 'Overlay animation is recommended when hover is enabled'
      });
    }

    // Validate animation duration
    if (attributes.overlayAnimationDuration) {
      if (attributes.overlayAnimationDuration < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDuration || attributes.overlayAnimationDuration > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDuration) {
        issues.push({
          type: 'warning',
          message: `Animation duration should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDuration}ms and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDuration}ms`
        });
      }
    }

    // Validate animation delay
    if (attributes.overlayAnimationDelay) {
      if (attributes.overlayAnimationDelay < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDelay || attributes.overlayAnimationDelay > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDelay) {
        issues.push({
          type: 'warning',
          message: `Animation delay should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDelay}ms and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDelay}ms`
        });
      }
    }

    // Validate overlay opacity
    if (attributes.overlayOpacity !== undefined) {
      if (attributes.overlayOpacity < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minOverlayOpacity || attributes.overlayOpacity > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxOverlayOpacity) {
        issues.push({
          type: 'warning',
          message: `Overlay opacity should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minOverlayOpacity} and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxOverlayOpacity}`
        });
      }
    }
  }

  // Validate image dimensions
  if (attributes.width && attributes.height) {
    const width = parseInt(attributes.width);
    const height = parseInt(attributes.height);
    if (isNaN(width) || isNaN(height)) {
      issues.push({
        type: 'warning',
        message: 'Width and height should be valid numbers'
      });
    }
    if (width < 1 || height < 1) {
      issues.push({
        type: 'warning',
        message: 'Width and height should be greater than 0'
      });
    }
  }
  return {
    isValid: issues.length === 0,
    ...(issues.length > 0 && {
      issues
    })
  };
};

/**
 * Validate inner blocks structure and content
 */
const validateInnerBlocks = (innerBlocks = []) => {
  const issues = [];

  // Ensure innerBlocks is an array
  if (!Array.isArray(innerBlocks)) {
    issues.push({
      type: 'error',
      message: 'Inner blocks must be an array'
    });
    return {
      isValid: false,
      issues
    };
  }

  // Check maximum number of inner blocks
  if (innerBlocks.length > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxInnerBlocks) {
    issues.push({
      type: 'warning',
      message: `Maximum ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxInnerBlocks} inner blocks allowed`
    });
  }
  innerBlocks.forEach((block, index) => {
    // Ensure block exists and has required properties
    if (!block || typeof block !== 'object') {
      issues.push({
        type: 'error',
        message: `Invalid block at index ${index}`
      });
      return;
    }

    // Validate block type
    if (!block.name || !isAllowedInnerBlock(block.name)) {
      issues.push({
        type: 'error',
        message: `Block type "${block.name || 'unknown'}" is not allowed in overlay`,
        block: block.name || 'unknown'
      });
    }

    // Validate block attributes
    if (block.attributes && typeof block.attributes === 'object' && Object.keys(block.attributes).length > 0) {
      const blockValidation = validateBlockAttributes(block.name, block.attributes);
      if (!blockValidation.isValid) {
        issues.push(...(blockValidation.issues || []));
      }
    }

    // Recursively validate nested inner blocks
    if (block.innerBlocks && Array.isArray(block.innerBlocks) && block.innerBlocks.length > 0) {
      const nestedValidation = validateInnerBlocks(block.innerBlocks);
      if (!nestedValidation.isValid) {
        issues.push(...(nestedValidation.issues || []));
      }
    }
  });
  return {
    isValid: issues.length === 0,
    ...(issues.length > 0 && {
      issues
    })
  };
};

/**
 * Check if block type is allowed in inner blocks
 */
const isAllowedInnerBlock = blockName => {
  return _constants__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_INNER_BLOCKS.includes(blockName);
};

/**
 * Validate specific block attributes
 */
const validateBlockAttributes = (blockName, attributes) => {
  const issues = [];

  // Block-specific validation
  switch (blockName) {
    case 'core/heading':
      if (!attributes.content && !attributes.level) {
        issues.push({
          type: 'warning',
          message: 'Heading should have content and level'
        });
      }
      break;
    case 'core/button':
      if (!attributes.text && !attributes.url) {
        issues.push({
          type: 'warning',
          message: 'Button should have text and URL'
        });
      }
      break;
    case 'core/paragraph':
      if (!attributes.content) {
        issues.push({
          type: 'warning',
          message: 'Paragraph should have content'
        });
      }
      break;
    case 'core/list':
      if (!attributes.values && !attributes.ordered) {
        issues.push({
          type: 'warning',
          message: 'List should have content'
        });
      }
      break;
    case 'core/group':
      if (!attributes.layout) {
        issues.push({
          type: 'info',
          message: 'Group layout is recommended'
        });
      }
      break;
    case 'core/columns':
      if (!attributes.columns) {
        issues.push({
          type: 'warning',
          message: 'Columns should specify number of columns'
        });
      }
      break;
  }
  return {
    isValid: issues.length === 0,
    ...(issues.length > 0 && {
      issues
    })
  };
};

/**
 * Validate animation settings
 */
const validateAnimationSettings = (animation, duration, delay) => {
  const issues = [];

  // Validate animation name
  const validAnimations = ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'flipInX', 'flipInY', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'pulse', 'shake', 'swing', 'tada', 'wobble'];
  if (animation && !validAnimations.includes(animation)) {
    issues.push({
      type: 'error',
      message: `Invalid animation: ${animation}`
    });
  }

  // Validate duration
  if (duration < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDuration || duration > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDuration) {
    issues.push({
      type: 'warning',
      message: `Animation duration should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDuration}ms and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDuration}ms`
    });
  }

  // Validate delay
  if (delay < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDelay || delay > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDelay) {
    issues.push({
      type: 'warning',
      message: `Animation delay should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minAnimationDelay}ms and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxAnimationDelay}ms`
    });
  }
  return {
    isValid: issues.length === 0,
    ...(issues.length > 0 && {
      issues
    })
  };
};

/**
 * Validate overlay settings
 */
const validateOverlaySettings = overlaySettings => {
  const issues = [];

  // Validate position
  const validPositions = ['top', 'center', 'bottom', 'left', 'right'];
  if (!validPositions.includes(overlaySettings.position)) {
    issues.push({
      type: 'error',
      message: `Invalid overlay position: ${overlaySettings.position}`
    });
  }

  // Validate background color
  if (overlaySettings.background) {
    // Basic color validation (hex, rgb, rgba, named colors)
    const colorRegex = /^(#([0-9A-Fa-f]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
    if (!colorRegex.test(overlaySettings.background)) {
      issues.push({
        type: 'warning',
        message: 'Invalid background color format'
      });
    }
  }

  // Validate opacity
  if (overlaySettings.opacity < _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minOverlayOpacity || overlaySettings.opacity > _constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxOverlayOpacity) {
    issues.push({
      type: 'warning',
      message: `Overlay opacity should be between ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.minOverlayOpacity} and ${_constants__WEBPACK_IMPORTED_MODULE_0__.VALIDATION_RULES.maxOverlayOpacity}`
    });
  }
  return {
    isValid: issues.length === 0,
    ...(issues.length > 0 && {
      issues
    })
  };
};

/**
 * Get validation summary for display
 */
const getValidationSummary = validation => {
  if (validation.isValid) {
    return 'Block validation passed';
  }
  const errorCount = validation.issues?.filter(issue => issue.type === 'error').length || 0;
  const warningCount = validation.issues?.filter(issue => issue.type === 'warning').length || 0;
  if (errorCount > 0) {
    return `${errorCount} error(s), ${warningCount} warning(s)`;
  }
  return `${warningCount} warning(s)`;
};

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/image.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/image.js ***!
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


const image = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (image);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/link-off.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/link-off.js ***!
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


const linkOff = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M17.031 4.703 15.576 4l-1.56 3H14v.03l-2.324 4.47H9.5V13h1.396l-1.502 2.889h-.95a3.694 3.694 0 0 1 0-7.389H10V7H8.444a5.194 5.194 0 1 0 0 10.389h.17L7.5 19.53l1.416.719L15.049 8.5h.507a3.694 3.694 0 0 1 0 7.39H14v1.5h1.556a5.194 5.194 0 0 0 .273-10.383l1.202-2.304Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (linkOff);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/link.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/link.js ***!
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


const link = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M10 17.389H8.444A5.194 5.194 0 1 1 8.444 7H10v1.5H8.444a3.694 3.694 0 0 0 0 7.389H10v1.5ZM14 7h1.556a5.194 5.194 0 0 1 0 10.39H14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39H14V7Zm-4.5 6h5v-1.5h-5V13Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (link);

/***/ }),

/***/ "./node_modules/clsx/dist/clsx.mjs":
/*!*****************************************!*\
  !*** ./node_modules/clsx/dist/clsx.mjs ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clsx: () => (/* binding */ clsx),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ "@wordpress/blob":
/*!******************************!*\
  !*** external ["wp","blob"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["blob"];

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

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

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
/*!*********************************************!*\
  !*** ./blocks/advanced-image-box/index.tsx ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   metadata: () => (/* reexport default export from named module */ _block_json__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   settings: () => (/* binding */ settings)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/image.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/advanced-image-box/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/advanced-image-box/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-image-box/block.json");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ "./blocks/advanced-image-box/deprecated.tsx");
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */




const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_5__;

const settings = {
  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
  example: {
    attributes: {
      url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
      alt: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mont Blanc appears—still, snowy, and serene.'),
      showOverlayOnHover: true,
      overlayAnimation: 'fadeIn',
      overlayPosition: 'center'
    },
    innerBlocks: [{
      name: 'core/heading',
      attributes: {
        level: 3,
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Beautiful Mountain'),
        textAlign: 'center'
      }
    }, {
      name: 'core/paragraph',
      attributes: {
        content: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Discover the beauty of nature with this stunning mountain view.'),
        textAlign: 'center'
      }
    }, {
      name: 'core/button',
      attributes: {
        text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Learn More'),
        className: 'is-style-outline',
        textAlign: 'center'
      }
    }]
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"],
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_6__["default"],
  merge: (a, {
    url = '',
    alt = ''
  }) => ({
    ...a,
    url: a.url || url,
    alt: a.alt || alt
  })
};

// Register the block
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(name, settings);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map