/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-image-box/block.json":
/*!**********************************************!*\
  !*** ./blocks/advanced-image-box/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-image-box","title":"Advanced Image Box","category":"jankx","description":"An advanced image block with overlay info box and inner content support.","keywords":["image","overlay","hover","animation","inner blocks"],"textdomain":"jankx","attributes":{"url":{"type":"string","source":"attribute","selector":"img","attribute":"src","role":"content"},"alt":{"type":"string","default":"","role":"content"},"title":{"type":"string","source":"attribute","selector":"img","attribute":"title","role":"content"},"id":{"type":"number","role":"content"},"width":{"type":"string"},"height":{"type":"string"},"aspectRatio":{"type":"string"},"scale":{"type":"string"},"sizeSlug":{"type":"string"},"href":{"type":"string","source":"attribute","selector":"a","attribute":"href","role":"content"},"linkTarget":{"type":"string","source":"attribute","selector":"a","attribute":"target"},"rel":{"type":"string","source":"attribute","selector":"a","attribute":"rel"},"caption":{"type":"rich-text","source":"rich-text","selector":".wp-block-jankx-advanced-image-box__caption","role":"content"},"showOverlayOnHover":{"type":"boolean","default":true},"overlayAnimation":{"type":"string","default":"fadeIn"},"overlayAnimationDuration":{"type":"number","default":1000},"overlayAnimationDelay":{"type":"number","default":0},"overlayPosition":{"type":"string","default":"center"},"overlayBackground":{"type":"string","default":"rgba(0, 0, 0, 0.7)"},"overlayOpacity":{"type":"number","default":1},"imageHoverEffect":{"type":"string","default":"zoom"},"borderRadius":{"type":"string","default":"0px"},"preset":{"type":"string","default":""},"presetOptions":{"type":"object","default":{}}},"supports":{"anchor":true,"align":["left","center","right","wide","full"],"html":false,"innerBlocks":true,"reusable":false,"interactivity":{"clientNavigation":true},"color":{"text":false,"background":true,"gradients":true,"__experimentalSkipSerialization":false},"spacing":{"margin":true,"padding":true,"__experimentalDefaultControls":{"margin":true,"padding":true}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalSkipSerialization":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"shadow":{"__experimentalSkipSerialization":true},"filter":{"duotone":true}},"selectors":{"border":".wp-block-jankx-advanced-image-box img, .wp-block-jankx-advanced-image-box__overlay","shadow":".wp-block-jankx-advanced-image-box img, .wp-block-jankx-advanced-image-box__overlay","filter":{"duotone":".wp-block-jankx-advanced-image-box img"}},"styles":[{"name":"default","label":"Default","isDefault":true},{"name":"card","label":"Card"},{"name":"overlay","label":"Overlay"},{"name":"modern","label":"Modern"}],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');

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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./save */ "./blocks/advanced-image-box/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-image-box/block.json");
/**
 * Deprecated versions of the block
 */



const {
  attributes
} = _block_json__WEBPACK_IMPORTED_MODULE_1__;

// Original attributes configuration with source: attribute for alt
const v1Attributes = {
  ...attributes,
  alt: {
    type: 'string',
    source: 'attribute',
    selector: 'img',
    attribute: 'alt',
    default: '',
    role: 'content'
  }
};
const v1 = {
  attributes: v1Attributes,
  save: _save__WEBPACK_IMPORTED_MODULE_0__["default"]
};

// V2 deprecation for the no-image case where alt text is inside div
const v2Attributes = {
  ...attributes,
  alt: {
    type: 'string',
    source: 'html',
    selector: '.wp-block-jankx-advanced-image-box__no-image__alt',
    default: '',
    role: 'content'
  }
};
const v2 = {
  attributes: v2Attributes,
  save: _save__WEBPACK_IMPORTED_MODULE_0__["default"]
};
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
/* harmony import */ var _presetCSSHelpers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./presetCSSHelpers */ "./blocks/advanced-image-box/presetCSSHelpers.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */








/**
 * Internal dependencies
 */




// Get presets from PHP

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
  var _po$titlePosition, _po$titleFullWidth, _styleMargin$top, _styleMargin$right, _styleMargin$bottom, _styleMargin$left, _po$titleWidthUnit, _ref5, _titleBackground, _titleColor;
  // Helper: parse color string to { colorHex, alpha }
  const parseColorAndAlpha = value => {
    const str = String(value !== null && value !== void 0 ? value : '').trim();

    // rgba(...) format
    const rgbaMatch = str.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|0?\.\d+|1(?:\.0+)?)\s*)?\)/i);
    if (rgbaMatch) {
      const r = Number(rgbaMatch[1]);
      const g = Number(rgbaMatch[2]);
      const b = Number(rgbaMatch[3]);
      const a = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1;
      const hex = rgbToHex(r, g, b);
      return {
        colorHex: hex,
        alpha: a
      };
    }

    // Hex format #rrggbb or #rgb
    const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = normalizeHex(str);
      return {
        colorHex: hex,
        alpha: 1
      };
    }

    // Unknown format - fallback to empty
    return {
      colorHex: String(value !== null && value !== void 0 ? value : '') || '#000000',
      alpha: 1
    };
  };
  const rgbToHex = (r, g, b) => `#${[r, g, b].map(x => {
    const s = x.toString(16);
    return s.length === 1 ? `0${s}` : s;
  }).join('')}`;
  const normalizeHex = hex => {
    const h = hex.replace('#', '').toLowerCase();
    if (h.length === 3) {
      return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
    }
    return `#${h}`;
  };
  const combineHexAndAlpha = (hex, alpha) => {
    const normalized = normalizeHex(hex);
    if (alpha >= 1) return normalized;
    // Convert hex to rgb
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
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
    borderRadius = '0px',
    preset = '',
    presetOptions = {}
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

  // Get inner blocks for validation and template check
  const innerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const blocks = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store).getBlocks(clientId);
    return Array.isArray(blocks) ? blocks : [];
  }, [clientId]);

  // Only apply template if inner blocks are empty (to preserve existing content)
  const hasInnerBlocks = innerBlocks && innerBlocks.length > 0;

  // Get presets from PHP
  const presets = window.jankxAdvancedImageBoxPresets || {};
  // Provide editor theme color palette for preset color options
  const settingsObj = typeof getSettings === 'function' ? getSettings() : undefined;
  const editorColors = settingsObj && settingsObj.colors ? settingsObj.colors : undefined;
  const currentPreset = preset ? presets[preset] : null;

  // Merge new preset options when preset data changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (preset && currentPreset && currentPreset.options) {
      const currentOptions = presetOptions || {};
      const mergedOptions = {
        ...currentOptions
      };
      let hasNewOptions = false;
      currentPreset.options.forEach(option => {
        // Add new options that don't exist in current presetOptions
        if (!(option.name in mergedOptions) && option.default !== undefined) {
          mergedOptions[option.name] = option.default;
          hasNewOptions = true;
        }
      });

      // Only update if there are new options
      if (hasNewOptions) {
        setAttributes({
          presetOptions: mergedOptions
        });
      }
    }
  }, [preset, currentPreset, presetOptions, setAttributes]);

  // Handle preset change
  const handlePresetChange = newPresetId => {
    const newPreset = presets[newPresetId];
    if (!newPreset) {
      setAttributes({
        preset: undefined,
        presetOptions: undefined
      });
      return;
    }

    // Merge default options with existing presetOptions
    // This ensures new options are added while preserving existing values
    const mergedOptions = {
      ...(presetOptions || {})
    };
    if (newPreset.options) {
      newPreset.options.forEach(option => {
        // Only set default if option doesn't exist in current presetOptions
        if (!(option.name in mergedOptions) && option.default !== undefined) {
          mergedOptions[option.name] = option.default;
        }
      });
    }
    setAttributes({
      preset: newPresetId,
      presetOptions: mergedOptions
    });

    // If preset requires inner blocks, add template
    if (newPreset.requiresInnerBlocks && newPreset.innerBlocksTemplate) {
      // This will be handled by InnerBlocks component
    }
  };

  // Handle preset option change
  const handlePresetOptionChange = (optionName, value) => {
    setAttributes({
      presetOptions: {
        ...presetOptions,
        [optionName]: value
      }
    });
  };

  // Render preset option control
  const renderPresetOption = option => {
    var _option$name, _ref, _option$min, _option$max, _option$step, _ref3, _ref4;
    const value = (_option$name = presetOptions[option.name]) !== null && _option$name !== void 0 ? _option$name : option.default;
    switch (option.type) {
      case 'text':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          style: {
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
            style: {
              display: 'block',
              marginBottom: '4px'
            },
            children: option.label
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
            type: "text",
            value: String(value || ''),
            onChange: e => handlePresetOptionChange(option.name, e.target.value),
            style: {
              width: '100%'
            }
          }), option.help && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
            style: {
              fontSize: '12px',
              color: '#757575',
              marginTop: '4px'
            },
            children: option.help
          })]
        }, option.name);
      case 'number':
      case 'range':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
          label: option.label,
          value: Number((_ref = value !== null && value !== void 0 ? value : option.default) !== null && _ref !== void 0 ? _ref : 0),
          onChange: newValue => handlePresetOptionChange(option.name, newValue),
          min: (_option$min = option.min) !== null && _option$min !== void 0 ? _option$min : 0,
          max: (_option$max = option.max) !== null && _option$max !== void 0 ? _option$max : 100,
          step: (_option$step = option.step) !== null && _option$step !== void 0 ? _option$step : 1,
          help: option.help
        }, option.name);
      case 'color':
        // Use Gutenberg ColorPalette so preset color options follow editor/theme palettes.
        // Also provide an opacity slider (alpha). ColorPalette returns a hex value, so alpha
        // is stored separately and combined into rgba(...) when alpha < 1.
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          style: {
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
            style: {
              display: 'block',
              marginBottom: '6px'
            },
            children: option.label
          }),
          // Parse stored value to split into hex and alpha
          ((_option$default, _ref2) => {
            const {
              colorHex: storedHex,
              alpha: storedAlpha
            } = parseColorAndAlpha(value);
            const colorValue = storedHex || String((_option$default = option.default) !== null && _option$default !== void 0 ? _option$default : '#000000');
            const alphaValue = Number(storedAlpha !== null && storedAlpha !== void 0 ? storedAlpha : 1);
            if (editorColors && editorColors.length > 0) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPalette, {
                  value: String(colorValue),
                  onChange: newHex => handlePresetOptionChange(option.name, combineHexAndAlpha(String(newHex || colorValue), alphaValue)),
                  colors: editorColors
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
                  style: {
                    marginTop: '6px'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label", {
                    style: {
                      display: 'block',
                      marginBottom: '4px'
                    },
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Opacity')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
                    value: alphaValue,
                    onChange: newAlpha => handlePresetOptionChange(option.name, combineHexAndAlpha(String(colorValue), Number(newAlpha))),
                    min: 0,
                    max: 1,
                    step: 0.01
                  })]
                })]
              });
            }

            // Fallback: use ColorPicker which supports alpha as rgba string
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPicker, {
              color: String((_ref2 = value !== null && value !== void 0 ? value : option.default) !== null && _ref2 !== void 0 ? _ref2 : '#000000'),
              onChange: newValue => handlePresetOptionChange(option.name, newValue)
            });
          })(), option.help && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
            style: {
              fontSize: '12px',
              color: '#757575',
              marginTop: '4px'
            },
            children: option.help
          })]
        }, option.name);
      case 'select':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: option.label,
          value: String((_ref3 = value !== null && value !== void 0 ? value : option.default) !== null && _ref3 !== void 0 ? _ref3 : ''),
          options: option.options?.map(opt => ({
            label: opt.label,
            value: String(opt.value)
          })) || [],
          onChange: newValue => handlePresetOptionChange(option.name, newValue),
          help: option.help
        }, option.name);
      case 'toggle':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
          label: option.label,
          checked: Boolean((_ref4 = value !== null && value !== void 0 ? value : option.default) !== null && _ref4 !== void 0 ? _ref4 : false),
          onChange: newValue => handlePresetOptionChange(option.name, newValue),
          help: option.help
        }, option.name);
      default:
        return null;
    }
  };

  // Render preset CSS for editor preview
  const presetCSS = currentPreset && preset ? (0,_presetCSSHelpers__WEBPACK_IMPORTED_MODULE_10__.renderPresetCSS)(currentPreset, presetOptions) : '';
  // Apply WordPress margin (style.spacing.margin) to title-box in editor preview
  const styleMargin = attributes?.style?.spacing?.margin || {};
  const po = presetOptions || {};
  const pos = String((_po$titlePosition = po?.titlePosition) !== null && _po$titlePosition !== void 0 ? _po$titlePosition : 'bottom-center');
  const full = Boolean((_po$titleFullWidth = po?.titleFullWidth) !== null && _po$titleFullWidth !== void 0 ? _po$titleFullWidth : false);
  const mTop = String((_styleMargin$top = styleMargin.top) !== null && _styleMargin$top !== void 0 ? _styleMargin$top : po?.titleMarginTop !== undefined ? `${po.titleMarginTop}px` : '');
  const mRight = String((_styleMargin$right = styleMargin.right) !== null && _styleMargin$right !== void 0 ? _styleMargin$right : po?.titleMarginRight !== undefined ? `${po.titleMarginRight}px` : '');
  const mBottom = String((_styleMargin$bottom = styleMargin.bottom) !== null && _styleMargin$bottom !== void 0 ? _styleMargin$bottom : po?.titleMarginBottom !== undefined ? `${po.titleMarginBottom}px` : '');
  const mLeft = String((_styleMargin$left = styleMargin.left) !== null && _styleMargin$left !== void 0 ? _styleMargin$left : po?.titleMarginLeft !== undefined ? `${po.titleMarginLeft}px` : '');
  const offsetsCSS = (() => {
    if (!preset || !currentPreset) return '';
    if (full) {
      if (pos.startsWith('top')) return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: 0; right: 0; }`;
      if (pos.startsWith('bottom')) return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: 0; right: 0; }`;
      if (pos.startsWith('left')) return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { left: ${mLeft || '0'}; top: 0; bottom: 0; }`;
      if (pos.startsWith('right')) return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { right: ${mRight || '0'}; top: 0; bottom: 0; }`;
      return '';
    }
    switch (pos) {
      case 'top-left':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: ${mLeft || '0'}; }`;
      case 'top-center':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: 50%; transform: translateX(-50%); }`;
      case 'top-right':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; right: ${mRight || '0'}; }`;
      case 'bottom-left':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: ${mLeft || '0'}; }`;
      case 'bottom-center':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: 50%; transform: translateX(-50%); }`;
      case 'bottom-right':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; right: ${mRight || '0'}; }`;
      case 'left-top':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; left: ${mLeft || '0'}; }`;
      case 'left-center':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; left: ${mLeft || '0'}; transform: translateY(-50%); }`;
      case 'left-bottom':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; left: ${mLeft || '0'}; }`;
      case 'right-top':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: ${mTop || '0'}; right: ${mRight || '0'}; }`;
      case 'right-center':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; right: ${mRight || '0'}; transform: translateY(-50%); }`;
      case 'right-bottom':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom: ${mBottom || '0'}; right: ${mRight || '0'}; }`;
      case 'center':
        return `.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top: 50%; left: 50%; transform: translate(-50%, -50%); }`;
      default:
        return '';
    }
  })();
  const padTop = po?.titlePaddingTop !== undefined ? `${po.titlePaddingTop}px` : '';
  const padRight = po?.titlePaddingRight !== undefined ? `${po.titlePaddingRight}px` : '';
  const padBottom = po?.titlePaddingBottom !== undefined ? `${po.titlePaddingBottom}px` : '';
  const padLeft = po?.titlePaddingLeft !== undefined ? `${po.titlePaddingLeft}px` : '';
  const widthUnit = String((_po$titleWidthUnit = po?.titleWidthUnit) !== null && _po$titleWidthUnit !== void 0 ? _po$titleWidthUnit : 'px');
  const widthVal = po?.titleWidth && Number(po.titleWidth) > 0 ? `${po.titleWidth}${widthUnit}` : '';
  const minWidthVal = po?.titleMinWidth && Number(po.titleMinWidth) > 0 ? `${po.titleMinWidth}px` : '';
  const paddingCSS = padTop || padRight || padBottom || padLeft || widthVal || minWidthVal ? `
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box {
    ${padTop ? `padding-top: ${padTop};` : ''}
    ${padRight ? `padding-right: ${padRight};` : ''}
    ${padBottom ? `padding-bottom: ${padBottom};` : ''}
    ${padLeft ? `padding-left: ${padLeft};` : ''}
    ${widthVal ? `width: ${widthVal};` : ''}
    ${minWidthVal ? `min-width: ${minWidthVal};` : ''}
}
` : '';
  const combinedPresetCSS = `${presetCSS}${offsetsCSS}${paddingCSS}`;

  // Validation removed for better UX

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    ref: setPopoverAnchor,
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(className, 'wp-block-jankx-advanced-image-box', {
      'has-overlay': showOverlayOnHover,
      'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none',
      'is-selected': isSelected,
      ...(currentPreset?.className ? {
        [currentPreset.className]: true
      } : {})
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

  const hasImage = Boolean(url && String(url).trim() !== '');
  const presetBg = String((_ref5 = (_titleBackground = presetOptions?.titleBackground) !== null && _titleBackground !== void 0 ? _titleBackground : overlayBackground) !== null && _ref5 !== void 0 ? _ref5 : 'transparent');
  const placeholderMinHeight = height || '240px';
  const imageElement = hasImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
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
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: "wp-block-jankx-advanced-image-box__placeholder",
    children: [!hasImage && alt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__no-image__alt",
      style: {
        color: String((_titleColor = presetOptions?.titleColor) !== null && _titleColor !== void 0 ? _titleColor : '#ffffff')
      },
      children: alt
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
      mediaId: id,
      mediaURL: url,
      allowedTypes: ['image'],
      accept: "image/*",
      onSelect: onSelectImage,
      onSelectURL: onSelectURL,
      onError: onUploadError,
      name: !url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace')
    })]
  });

  // Wrap image with link in editor to match frontend rendering
  const wrappedImage = href ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("a", {
    href: href,
    target: linkTarget,
    rel: rel,
    className: "wp-block-jankx-advanced-image-box__link",
    children: imageElement
  }) : imageElement;

  // InnerBlocks MUST be rendered in ONE fixed location in the DOM
  // This is critical for WordPress to properly track and save inner blocks
  const innerBlocksProps = {
    allowedBlocks: _constants__WEBPACK_IMPORTED_MODULE_9__.ALLOWED_INNER_BLOCKS,
    templateLock: false,
    renderAppender: false,
    // Only apply template if inner blocks are empty and preset requires it
    template: !hasInnerBlocks && preset && currentPreset?.requiresInnerBlocks && currentPreset.innerBlocksTemplate ? currentPreset.innerBlocksTemplate : undefined
  };

  // Determine where to render InnerBlocks based on preset and overlay
  // But always render it in ONE place only
  let innerBlocksWrapper = null;
  if (preset && currentPreset?.requiresInnerBlocks) {
    // When preset is active, render in title-box
    innerBlocksWrapper = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "wp-block-jankx-advanced-image-box__frame-wrapper",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "wp-block-jankx-advanced-image-box__frame"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "wp-block-jankx-advanced-image-box__title-box",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          className: "wp-block-jankx-advanced-image-box__overlay__content",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
            ...innerBlocksProps
          })
        })
      })]
    });
  } else if (showOverlayOnHover) {
    // When overlay is enabled, render in overlay
    innerBlocksWrapper = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__overlay', `wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`, 'animated', overlayAnimation),
      style: {
        backgroundColor: overlayBackground,
        opacity: overlayOpacity,
        animationDuration: `${overlayAnimationDuration}ms`,
        animationDelay: `${overlayAnimationDelay}ms`
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "wp-block-jankx-advanced-image-box__overlay__content",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
          ...innerBlocksProps
        })
      })
    });
  } else {
    // When no preset and no overlay, render in hidden container (still visible for editing)
    innerBlocksWrapper = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__overlay__content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
        ...innerBlocksProps
      })
    });
  }

  // Separate visual elements (overlay wrapper for non-preset, preset frame for preset)
  const overlayContent = showOverlayOnHover && !preset ? innerBlocksWrapper : null;
  const presetContent = preset && currentPreset ? innerBlocksWrapper : null;
  const hiddenInnerBlocks = !preset && !showOverlayOnHover ? innerBlocksWrapper : null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [combinedPresetCSS && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("style", {
      dangerouslySetInnerHTML: {
        __html: combinedPresetCSS
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("figure", {
      ...blockProps,
      children: [wrappedImage, overlayContent, presetContent, hiddenInnerBlocks, !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText.isEmpty(caption) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
        className: "wp-block-jankx-advanced-image-box__caption",
        tagName: "figcaption",
        value: caption,
        onChange: value => setAttributes({
          caption: value
        }),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add caption…')
      })]
    }), isSelected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
          mediaId: id,
          mediaURL: url,
          allowedTypes: ['image'],
          accept: "image/*",
          onSelect: onSelectImage,
          onSelectURL: onSelectURL,
          onError: onUploadError,
          name: !url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace')
        }), href && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unlink'),
          onClick: unlink
        }), !href && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link'),
          onClick: startEditing
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preset'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout Preset'),
          value: preset || '',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('None', 'jankx'),
            value: ''
          }, ...Object.values(presets).map(p => ({
            label: p.label,
            value: p.id
          }))],
          onChange: handlePresetChange,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose a preset layout for the image box', 'jankx')
        }), currentPreset && currentPreset.description && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
          style: {
            fontSize: '12px',
            color: '#757575',
            marginTop: '8px'
          },
          children: currentPreset.description
        }), currentPreset && currentPreset.options && currentPreset.options.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          style: {
            marginTop: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("strong", {
            style: {
              display: 'block',
              marginBottom: '12px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preset Options', 'jankx')
          }), currentPreset.options.map(renderPresetOption)]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Image Settings'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          style: {
            marginBottom: '12px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaReplaceFlow, {
            mediaId: id,
            mediaURL: url,
            allowedTypes: ['image'],
            accept: "image/*",
            onSelect: onSelectImage,
            onSelectURL: onSelectURL,
            onError: onUploadError,
            name: !url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add image') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace')
          }), url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            isSecondary: true,
            onClick: () => setAttributes({
              url: undefined,
              id: undefined,
              alt: undefined,
              title: undefined
            }),
            style: {
              marginLeft: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove image')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
          className: "wp-block-jankx-advanced-image-box__alt-text",
          tagName: "p",
          value: alt || '',
          onChange: value => setAttributes({
            alt: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add alt text…'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the purpose of the image. Leave empty if decorative.')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
          className: "wp-block-jankx-advanced-image-box__title",
          tagName: "p",
          value: title || '',
          onChange: value => setAttributes({
            title: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add title…'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the role of this image on the page.')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Settings'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show overlay on hover'),
          checked: showOverlayOnHover,
          onChange: value => setAttributes({
            showOverlayOnHover: value
          })
        }), showOverlayOnHover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
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
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation Duration (ms)'),
            value: overlayAnimationDuration,
            onChange: value => setAttributes({
              overlayAnimationDuration: value
            }),
            min: 100,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animation Delay (ms)'),
            value: overlayAnimationDelay,
            onChange: value => setAttributes({
              overlayAnimationDelay: value
            }),
            min: 0,
            max: 2000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Position'),
            value: overlayPosition,
            options: _constants__WEBPACK_IMPORTED_MODULE_9__.OVERLAY_POSITIONS.map(position => ({
              label: position.label,
              value: position.value
            })),
            onChange: value => setAttributes({
              overlayPosition: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPicker, {
            color: overlayBackground,
            onChange: value => setAttributes({
              overlayBackground: value
            }),
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Overlay Background')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
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
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover Effects'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
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
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Styling'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
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

/***/ "./blocks/advanced-image-box/presetCSSHelpers.ts":
/*!*******************************************************!*\
  !*** ./blocks/advanced-image-box/presetCSSHelpers.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderBorderedFrameCSS: () => (/* binding */ renderBorderedFrameCSS),
/* harmony export */   renderPresetCSS: () => (/* binding */ renderPresetCSS)
/* harmony export */ });
/**
 * Helper functions to render preset CSS in editor
 * These should match the PHP renderCSS methods
 */

/**
 * Render CSS for bordered-frame preset
 */
function renderBorderedFrameCSS(preset, options) {
  var _options$borderWidth, _options$borderColor, _options$borderOffset, _options$titleFullWid, _options$titlePositio, _options$titleBackgro, _options$titleColor, _options$titleMarginT, _options$titleMarginR, _options$titleMarginB, _options$titleMarginL, _options$titleWidth, _options$titleMinWidt;
  const borderWidth = Number((_options$borderWidth = options.borderWidth) !== null && _options$borderWidth !== void 0 ? _options$borderWidth : 4);
  const borderColor = String((_options$borderColor = options.borderColor) !== null && _options$borderColor !== void 0 ? _options$borderColor : '#ffffff');
  const borderOffset = Number((_options$borderOffset = options.borderOffset) !== null && _options$borderOffset !== void 0 ? _options$borderOffset : 20);
  const titleFullWidth = Boolean((_options$titleFullWid = options.titleFullWidth) !== null && _options$titleFullWid !== void 0 ? _options$titleFullWid : false);
  const titlePosition = String((_options$titlePositio = options.titlePosition) !== null && _options$titlePositio !== void 0 ? _options$titlePositio : 'bottom-center');
  const titleBackground = String((_options$titleBackgro = options.titleBackground) !== null && _options$titleBackgro !== void 0 ? _options$titleBackgro : 'rgba(0, 0, 0, 0.8)');
  const titleColor = String((_options$titleColor = options.titleColor) !== null && _options$titleColor !== void 0 ? _options$titleColor : '#ffffff');
  const titleMarginTop = Number((_options$titleMarginT = options.titleMarginTop) !== null && _options$titleMarginT !== void 0 ? _options$titleMarginT : 0);
  const titleMarginRight = Number((_options$titleMarginR = options.titleMarginRight) !== null && _options$titleMarginR !== void 0 ? _options$titleMarginR : 0);
  const titleMarginBottom = Number((_options$titleMarginB = options.titleMarginBottom) !== null && _options$titleMarginB !== void 0 ? _options$titleMarginB : 0);
  const titleMarginLeft = Number((_options$titleMarginL = options.titleMarginLeft) !== null && _options$titleMarginL !== void 0 ? _options$titleMarginL : 0);
  const titleWidth = Number((_options$titleWidth = options.titleWidth) !== null && _options$titleWidth !== void 0 ? _options$titleWidth : 0);
  const titleMinWidth = Number((_options$titleMinWidt = options.titleMinWidth) !== null && _options$titleMinWidt !== void 0 ? _options$titleMinWidt : 0);
  let titlePositionCSS = '';
  if (titleFullWidth) {
    // Full width/height based on position
    if (titlePosition.startsWith('top')) {
      titlePositionCSS = `top: 0; left: 0; right: 0; width: 100%;`;
    } else if (titlePosition.startsWith('bottom')) {
      titlePositionCSS = `bottom: 0; left: 0; right: 0; width: 100%;`;
    } else if (titlePosition.startsWith('left')) {
      titlePositionCSS = `top: 0; left: 0; bottom: 0; height: 100%;`;
    } else if (titlePosition.startsWith('right')) {
      titlePositionCSS = `top: 0; right: 0; bottom: 0; height: 100%;`;
    }
  } else {
    // 2D positioning
    switch (titlePosition) {
      case 'top-left':
        titlePositionCSS = `top: 0; left: 0;`;
        break;
      case 'top-center':
        titlePositionCSS = `top: 0; left: 50%; transform: translateX(-50%);`;
        break;
      case 'top-right':
        titlePositionCSS = `top: 0; right: 0;`;
        break;
      case 'bottom-left':
        titlePositionCSS = `bottom: 0; left: 0;`;
        break;
      case 'bottom-center':
        titlePositionCSS = `bottom: 0; left: 50%; transform: translateX(-50%);`;
        break;
      case 'bottom-right':
        titlePositionCSS = `bottom: 0; right: 0;`;
        break;
      case 'left-top':
        titlePositionCSS = `top: 0; left: 0;`;
        break;
      case 'left-center':
        titlePositionCSS = `top: 50%; left: 0; transform: translateY(-50%);`;
        break;
      case 'left-bottom':
        titlePositionCSS = `bottom: 0; left: 0;`;
        break;
      case 'right-top':
        titlePositionCSS = `top: 0; right: 0;`;
        break;
      case 'right-center':
        titlePositionCSS = `top: 50%; right: 0; transform: translateY(-50%);`;
        break;
      case 'right-bottom':
        titlePositionCSS = `bottom: 0; right: 0;`;
        break;
      case 'center':
        titlePositionCSS = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
        break;
      default:
        titlePositionCSS = `bottom: 0; left: 50%; transform: translateX(-50%);`;
    }
  }
  return `
.wp-block-jankx-advanced-image-box.preset-bordered-frame {
	position: relative;
	display: inline-block;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame img {
	display: block;
	width: 100%;
	height: auto;
	transition: all 0.3s ease;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame-wrapper {
	position: absolute;
	top: ${borderOffset}px;
	left: ${borderOffset}px;
	right: ${borderOffset}px;
	bottom: ${borderOffset}px;
	pointer-events: none;
	z-index: 1;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border: ${borderWidth}px solid ${borderColor};
	pointer-events: none;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box {
	position: absolute;
	background: ${titleBackground};
	color: ${titleColor};
	padding: 12px 20px;
	z-index: 2;
	pointer-events: none;
	margin-top: ${titleMarginTop}px;
	margin-right: ${titleMarginRight}px;
	margin-bottom: ${titleMarginBottom}px;
	margin-left: ${titleMarginLeft}px;
	box-sizing: border-box;
	max-width: 100%;
	${titleWidth > 0 ? `width: ${titleWidth}px;` : ''}
	${titleMinWidth > 0 ? `min-width: ${titleMinWidth}px;` : ''}
	${titlePositionCSS}
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box h3,
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box .wp-block-heading {
	margin: 0;
	color: ${titleColor};
	font-size: 1.2em;
	font-weight: 600;
}

/* Ensure placeholder (no-image) shows sensible fallback when preset is active */
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__no-image {
	background-color: ${titleBackground};
	background-size: cover;
	background-position: center;
	min-height: 240px;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__no-image__alt {
	color: ${titleColor};
}

/* Ensure hover effects work with preset */
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-zoom {
	transform: scale(1.05);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-fade {
	opacity: 0.8;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-blur {
	filter: blur(2px);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-grayscale {
	filter: grayscale(100%);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-sepia {
	filter: sepia(100%);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-brightness {
	filter: brightness(1.2);
}
`;
}

/**
 * Render CSS for a preset
 */
function renderPresetCSS(preset, options) {
  switch (preset.id) {
    case 'bordered-frame':
      return renderBorderedFrameCSS(preset, options);
    default:
      return '';
  }
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
  var _ref, _presetOptions$titleB, _presetOptions$titleC;
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
    borderRadius,
    preset
  } = attributes;

  // Support presetOptions and provide a visible fallback when there is no image
  const presetOptions = attributes.presetOptions || {};
  const hasImage = Boolean(url && String(url).trim() !== '');
  // Prefer preset titleBackground (used by bordered-frame), then overlayBackground
  const fallbackBg = String((_ref = (_presetOptions$titleB = presetOptions.titleBackground) !== null && _presetOptions$titleB !== void 0 ? _presetOptions$titleB : overlayBackground) !== null && _ref !== void 0 ? _ref : 'transparent');
  const fallbackMinHeight = height || '240px';

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
  const imageElement = hasImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
    src: url,
    alt: alt || '',
    title: title,
    className: imageClasses,
    style: imageStyle
  }) :
  /*#__PURE__*/
  // Fallback element when no image is provided: show minimal structure and rely on preset CSS
  // Do not apply inline border-radius, background-color, or min-height to avoid forcing styles
  (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__no-image', imageClasses),
    style: {
      // Keep border and shadow styles, but omit borderRadius if present
      ...(() => {
        const tempStyle = {
          ...borderProps.style,
          ...shadowProps.style
        };
        // Remove borderRadius property if exists on borderProps.style
        if ('borderRadius' in tempStyle) {
          delete tempStyle.borderRadius;
        }
        return tempStyle;
      })(),
      // Keep aspect ratio/size information if necessary
      aspectRatio,
      objectFit: scale,
      width,
      height
    },
    children: !hasImage && alt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__no-image__alt",
      style: {
        color: String((_presetOptions$titleC = presetOptions.titleColor) !== null && _presetOptions$titleC !== void 0 ? _presetOptions$titleC : '#ffffff')
      },
      children: alt
    })
  });

  // Always render inner blocks content - needed for all scenarios
  // This ensures inner blocks are saved regardless of preset/overlay settings
  const innerBlocksContent = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "wp-block-jankx-advanced-image-box__overlay__content",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
  });

  // Create overlay content if enabled (but not when preset is active)
  const overlayContent = showOverlayOnHover && !preset && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-jankx-advanced-image-box__overlay', `wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`, 'animated', overlayAnimation),
    style: {
      backgroundColor: overlayBackground,
      opacity: overlayOpacity,
      animationDuration: `${overlayAnimationDuration}ms`,
      animationDelay: `${overlayAnimationDelay}ms`
    },
    children: innerBlocksContent
  });

  // When preset is active, do not render the preset frame/title wrapper in saved output
  // The server-side render (render_callback) will insert the markup to avoid duplicate elements
  const presetContent = null;

  // When no preset and no overlay, render inner blocks in hidden container (for editing)
  const hiddenContent = !preset && !showOverlayOnHover && innerBlocksContent;

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
    children: [wrappedImage, overlayContent, hiddenContent, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "wp-block-jankx-advanced-image-box__serialized-content",
      style: {
        display: 'none'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    }), caption && !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.isEmpty(caption) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
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
      {
        const {
          content,
          level
        } = attributes;
        if (!content && !level) {
          issues.push({
            type: 'warning',
            message: 'Heading should have content and level'
          });
        }
        break;
      }
    case 'core/button':
      {
        const {
          text,
          url
        } = attributes;
        if (!text && !url) {
          issues.push({
            type: 'warning',
            message: 'Button should have text and URL'
          });
        }
        break;
      }
    case 'core/paragraph':
      {
        const {
          content
        } = attributes;
        if (!content) {
          issues.push({
            type: 'warning',
            message: 'Paragraph should have content'
          });
        }
        break;
      }
    case 'core/list':
      {
        const {
          values,
          ordered
        } = attributes;
        if (!values && !ordered) {
          issues.push({
            type: 'warning',
            message: 'List should have content'
          });
        }
        break;
      }
    case 'core/group':
      {
        const {
          layout
        } = attributes;
        if (!layout) {
          issues.push({
            type: 'info',
            message: 'Group layout is recommended'
          });
        }
        break;
      }
    case 'core/columns':
      {
        const {
          columns
        } = attributes;
        if (!columns) {
          issues.push({
            type: 'warning',
            message: 'Columns should specify number of columns'
          });
        }
        break;
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
/* harmony export */   metadata: () => (/* reexport default export from named module */ _block_json__WEBPACK_IMPORTED_MODULE_6__),
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
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./deprecated */ "./blocks/advanced-image-box/deprecated.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-image-box/block.json");
/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */




const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_6__;

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
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_5__["default"],
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