/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/magic-text/block.json":
/*!**************************************!*\
  !*** ./blocks/magic-text/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/magic-text-block","version":"1.0.0","title":"Magic Text Block","category":"text","icon":"smiley","description":"Add custom style to text","example":{},"supports":{"html":false},"textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css"}');

/***/ }),

/***/ "./blocks/magic-text/components/gradient-stroke/icon-gradient-stroke.js":
/*!******************************************************************************!*\
  !*** ./blocks/magic-text/components/gradient-stroke/icon-gradient-stroke.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconGradientStroke = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("linearGradient", {
        id: "strokeGradient",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "0%",
          style: {
            stopColor: '#800080'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "100%",
          style: {
            stopColor: '#ff69b4'
          }
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
      x: "4",
      y: "17",
      fontSize: "16",
      fontFamily: "Arial",
      stroke: "url(#strokeGradient)",
      fill: "none",
      strokeWidth: "1",
      children: "A"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconGradientStroke);

/***/ }),

/***/ "./blocks/magic-text/components/gradient-stroke/index.js":
/*!***************************************************************!*\
  !*** ./blocks/magic-text/components/gradient-stroke/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/components/gradient-stroke/style.scss");
/* harmony import */ var _icon_gradient_stroke__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./icon-gradient-stroke */ "./blocks/magic-text/components/gradient-stroke/icon-gradient-stroke.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const GradientStrokeUI = ({
  onClose,
  onChange,
  gradient,
  setGradient,
  strokeWidth,
  setStrokeWidth,
  popoverAnchor,
  LABEL_POPOVER_TITLE,
  LABEL_GRADIENT_STROKE,
  LABEL_GRADIENT_WIDTH,
  LABEL_APPLY_BUTTON
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Popover, {
    anchor: popoverAnchor,
    className: "jankx-popover",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h4", {
      children: LABEL_POPOVER_TITLE
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.GradientPicker, {
      value: gradient,
      onChange: setGradient,
      label: LABEL_GRADIENT_STROKE
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: LABEL_GRADIENT_WIDTH,
      value: strokeWidth,
      onChange: setStrokeWidth,
      min: 0.1,
      max: 5,
      step: 0.1,
      initialPosition: 1
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      variant: "primary",
      onClick: onChange,
      children: LABEL_APPLY_BUTTON
    })]
  });
};
const GradientStroke = ({
  isActive,
  value,
  onChange,
  textDomain = "jankx"
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)();
  const [gradient, setGradient] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)("linear-gradient(to right, #09f1b8, #00a2ff, #ff00d2, #fed90f)");
  const [strokeWidth, setStrokeWidth] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(1);
  const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Gradient Stroke Settings", textDomain) || "Gradient Stroke Settings";
  const LABEL_GRADIENT_STROKE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Stroke Gradient", textDomain) || "Stroke Gradient";
  const LABEL_GRADIENT_WIDTH = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Stroke Width", textDomain) || "Stroke Width";
  const LABEL_APPLY_BUTTON = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Apply", textDomain) || "Apply";
  const applyGradientStroke = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.toggleFormat)(value, {
      type: "jankx/gradient-stroke",
      attributes: {
        style: `
            --gradient-stroke: ${gradient};
            --stroke-width: ${strokeWidth}px;
          `,
        class: "magic-gradient-stroke"
      }
    }));
  }, [gradient, strokeWidth, onChange, value]);
  const handleToolbarClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    if (isActive) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.toggleFormat)(value, {
        type: "jankx/gradient-stroke"
      }));
    } else {
      setIsPopoverVisible(true);
    }
  }, [isActive, value, onChange]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichTextToolbarButton, {
        icon: _icon_gradient_stroke__WEBPACK_IMPORTED_MODULE_6__["default"],
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Gradient Stroke", textDomain) || "Gradient Stroke",
        onClick: handleToolbarClick,
        isActive: isActive
      })
    }), isPopoverVisible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(GradientStrokeUI, {
      onClose: () => setIsPopoverVisible(false),
      onChange: () => {
        applyGradientStroke();
        setIsPopoverVisible(false);
      },
      gradient: gradient,
      setGradient: setGradient,
      strokeWidth: strokeWidth,
      setStrokeWidth: setStrokeWidth,
      popoverAnchor: popoverAnchor,
      LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE,
      LABEL_GRADIENT_STROKE: LABEL_GRADIENT_STROKE,
      LABEL_GRADIENT_WIDTH: LABEL_GRADIENT_WIDTH,
      LABEL_APPLY_BUTTON: LABEL_APPLY_BUTTON
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.registerFormatType)("jankx/gradient-stroke", {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Gradient Stroke", "jankx"),
  tagName: "span",
  className: 'jankx-gradient-stroke',
  attributes: {
    style: "style",
    class: "class"
  },
  edit: GradientStroke
});

/***/ }),

/***/ "./blocks/magic-text/components/gradient-stroke/style.scss":
/*!*****************************************************************!*\
  !*** ./blocks/magic-text/components/gradient-stroke/style.scss ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/gradient-text-color/icon-gradient.js":
/*!***************************************************************************!*\
  !*** ./blocks/magic-text/components/gradient-text-color/icon-gradient.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconGradient = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("linearGradient", {
        id: "grad1",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "0%",
          style: {
            stopColor: '#800080',
            stopOpacity: 1
          }
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "100%",
          style: {
            stopColor: '#ff69b4',
            stopOpacity: 1
          }
        }), " "]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
      x: "4",
      y: "17",
      fontSize: "16",
      fontFamily: "Arial",
      fill: "url(#grad1)",
      children: "A"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconGradient);

/***/ }),

/***/ "./blocks/magic-text/components/gradient-text-color/index.js":
/*!*******************************************************************!*\
  !*** ./blocks/magic-text/components/gradient-text-color/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _icon_gradient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./icon-gradient */ "./blocks/magic-text/components/gradient-text-color/icon-gradient.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







const GradientColorUI = ({
  onClose,
  onChange,
  gradientDeg,
  setGradientDeg,
  gradientStartColor,
  setGradientStartColor,
  gradientEndColor,
  setGradientEndColor,
  popoverAnchor,
  LABEL_GRADIENT_DEG,
  LABEL_APPLY_BUTTON,
  LABEL_POPOVER_TITLE
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Popover, {
    className: "jankx-popover",
    animate: true,
    position: "bottom right",
    offset: {
      x: 10,
      y: 10
    },
    onClose: onClose,
    anchor: popoverAnchor,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h4", {
      children: LABEL_POPOVER_TITLE
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      style: {
        marginBottom: "10px"
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Start Color', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPicker, {
        color: gradientStartColor,
        onChange: startColor => setGradientStartColor(startColor)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      style: {
        marginBottom: "10px"
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('End Color', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ColorPicker, {
        color: gradientEndColor,
        onChange: endColor => setGradientEndColor(endColor)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      style: {
        marginBottom: "10px"
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
        label: LABEL_GRADIENT_DEG,
        value: gradientDeg,
        onChange: value => setGradientDeg(value)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
      variant: "primary",
      onClick: () => {
        onChange();
        onClose();
      },
      children: LABEL_APPLY_BUTTON
    })]
  });
};
const GradientTextColor = ({
  isActive,
  onChange,
  value,
  textDomain = "jankx"
}) => {
  const [isAddingGradient, setIsAddingGradient] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [gradientStartColor, setGradientStartColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)("#fff");
  const [gradientEndColor, setGradientEndColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)("#000");
  const [gradientDeg, setGradientDeg] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)("90deg");
  const LABEL_GRADIENT_DEG = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Gradient direction", "jankx") || "Gradient direction";
  const LABEL_APPLY_BUTTON = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Apply", "jankx") || "Apply";
  const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Select Gradient colors and deg", "jankx") || "Select Gradient colors and deg";
  const gradientCSS = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => `linear-gradient(${gradientDeg}, ${gradientStartColor}, ${gradientEndColor})`, [gradientDeg, gradientStartColor, gradientEndColor]);
  const applyGradient = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toggleFormat)(value, {
      type: "jankx/gradient",
      attributes: {
        style: `background: ${gradientCSS}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`,
        class: "magic-text-gradient"
      }
    }));
  }, [gradientCSS, onChange, value]);
  const handleToolbarClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    if (isActive) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toggleFormat)(value, {
        type: "jankx/gradient"
      }));
    } else {
      setIsAddingGradient(true);
    }
  }, [isActive, onChange, value]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichTextToolbarButton, {
        icon: _icon_gradient__WEBPACK_IMPORTED_MODULE_5__["default"],
        title: "Gradient Text Color",
        onClick: handleToolbarClick,
        isActive: isActive
      })
    }), !isActive && isAddingGradient && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(GradientColorUI, {
      onClose: () => setIsAddingGradient(false),
      onChange: applyGradient,
      gradientDeg: gradientDeg,
      setGradientDeg: setGradientDeg,
      gradientStartColor: gradientStartColor,
      setGradientStartColor: setGradientStartColor,
      gradientEndColor: gradientEndColor,
      setGradientEndColor: setGradientEndColor,
      popoverAnchor: popoverAnchor,
      LABEL_GRADIENT_DEG: LABEL_GRADIENT_DEG,
      LABEL_APPLY_BUTTON: LABEL_APPLY_BUTTON,
      LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.registerFormatType)("jankx/gradient", {
  title: "Gradient",
  tagName: "span",
  className: 'jankx-gradient',
  attributes: {
    style: "style"
  },
  edit: GradientTextColor
});

/***/ }),

/***/ "./blocks/magic-text/components/index.js":
/*!***********************************************!*\
  !*** ./blocks/magic-text/components/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gradient_text_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gradient-text-color */ "./blocks/magic-text/components/gradient-text-color/index.js");
/* harmony import */ var _underline_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./underline-effect */ "./blocks/magic-text/components/underline-effect/index.js");
/* harmony import */ var _text_bg_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./text-bg-image */ "./blocks/magic-text/components/text-bg-image/index.js");
/* harmony import */ var _gradient_stroke__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gradient-stroke */ "./blocks/magic-text/components/gradient-stroke/index.js");
/* harmony import */ var _post_theme_selector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./post-theme-selector */ "./blocks/magic-text/components/post-theme-selector/index.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tooltip */ "./blocks/magic-text/components/tooltip/index.js");
/* harmony import */ var _unstyle_text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./unstyle-text */ "./blocks/magic-text/components/unstyle-text/index.js");
/* harmony import */ var _marker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./marker */ "./blocks/magic-text/components/marker/index.js");









/***/ }),

/***/ "./blocks/magic-text/components/marker/icon-marker.js":
/*!************************************************************!*\
  !*** ./blocks/magic-text/components/marker/icon-marker.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconMarker = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("linearGradient", {
        id: "markerGrad",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "0%",
          stopColor: "#fbbf24",
          stopOpacity: "1"
        }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "100%",
          stopColor: "#f59e0b",
          stopOpacity: "1"
        }), " "]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "16",
      y: "4",
      width: "3",
      height: "16",
      rx: "1.5",
      fill: "url(#markerGrad)",
      transform: "rotate(20 17.5 12)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "16.5",
      y: "3",
      width: "2",
      height: "2",
      rx: "1",
      fill: "#d97706",
      transform: "rotate(20 17.5 4)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "4",
      y: "11",
      width: "14",
      height: "3",
      rx: "1.5",
      fill: "#fbbf24",
      opacity: "0.5"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
      x: "6",
      y: "17",
      fontSize: "14",
      fontFamily: "Arial",
      fill: "currentColor",
      children: "A"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconMarker);

/***/ }),

/***/ "./blocks/magic-text/components/marker/index.js":
/*!******************************************************!*\
  !*** ./blocks/magic-text/components/marker/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icon_marker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icon-marker */ "./blocks/magic-text/components/marker/icon-marker.js");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/components/marker/style.scss");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _marker_options__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./marker-options */ "./blocks/magic-text/components/marker/marker-options.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









const textDomain = 'jankx';
const MarkerUI = ({
  onClose,
  LABEL_POPOVER_TITLE,
  popoverAnchor,
  value,
  onChange
}) => {
  const [selectedMarker, setSelectedMarker] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)('text-marker');
  const [selectedClassName, setSelectedClassName] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)('jankx-text-marker');
  const handleMarkerChange = (markerName, className) => {
    setSelectedMarker(markerName);
    setSelectedClassName(className);
  };
  const handleApplyMarker = () => {
    const newValue = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.applyFormat)(value, {
      type: 'jankx/marker',
      attributes: {
        class: selectedClassName
      }
    });
    onChange(newValue);
    onClose();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Popover, {
    className: "jankx-popover",
    animate: true,
    position: "bottom right",
    offset: {
      x: 10,
      y: 10
    },
    onClose: onClose,
    anchor: popoverAnchor,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      style: {
        padding: '16px',
        width: '320px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h4", {
        children: LABEL_POPOVER_TITLE
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        style: {
          marginBottom: "15px"
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select marker:', textDomain)
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_marker_options__WEBPACK_IMPORTED_MODULE_7__["default"], {
        selectedMarker: selectedMarker,
        onMarkerChange: handleMarkerChange,
        textDomain: textDomain
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "jankx-popover-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "primary",
          onClick: handleApplyMarker,
          style: {
            marginRight: '10px'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Apply Marker', textDomain)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "secondary",
          onClick: onClose,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', textDomain)
        })]
      })]
    })
  });
};
const Marker = ({
  isActive,
  value,
  onChange,
  textDomain
}) => {
  const [isAddingMarker, setIsAddingMarker] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(null);
  const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Realistic Text Marker Effects", textDomain) || "Realistic Text Marker Effects";
  const handleToolbarClick = (0,react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(() => {
    if (isActive) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.toggleFormat)(value, {
        type: 'jankx/marker',
        attributes: ''
      }));
    } else {
      setIsAddingMarker(true);
    }
  }, [isActive, value, onChange]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichTextToolbarButton, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Marker', textDomain),
        icon: _icon_marker__WEBPACK_IMPORTED_MODULE_1__["default"],
        onClick: handleToolbarClick
      })
    }), !isActive && isAddingMarker && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(MarkerUI, {
      onClose: () => setIsAddingMarker(false),
      LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE,
      popoverAnchor: popoverAnchor,
      value: value,
      onChange: onChange
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_2__.registerFormatType)("jankx/marker", {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Marker", "jankx"),
  tagName: "span",
  className: "jankx-text-marker",
  attributes: {
    style: "style",
    class: "class"
  },
  edit: Marker
});

/***/ }),

/***/ "./blocks/magic-text/components/marker/marker-options.js":
/*!***************************************************************!*\
  !*** ./blocks/magic-text/components/marker/marker-options.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const MarkerOptions = ({
  selectedMarker,
  onMarkerChange,
  textDomain
}) => {
  const markerOptions = [{
    name: 'text-marker',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default Marker', textDomain),
    className: 'jankx-text-marker'
  }, {
    name: 'marker-uneven',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Uneven Style', textDomain),
    className: 'jankx-marker-uneven'
  }, {
    name: 'marker-thick',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thick Style', textDomain),
    className: 'jankx-marker-thick'
  }, {
    name: 'marker-messy',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Messy Style', textDomain),
    className: 'jankx-marker-messy'
  }, {
    name: 'marker-double',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Double Style', textDomain),
    className: 'jankx-marker-double'
  }, {
    name: 'marker-faded',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Faded Style', textDomain),
    className: 'jankx-marker-faded'
  }, {
    name: 'marker-wavy',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Wavy Style', textDomain),
    className: 'jankx-marker-wavy'
  }, {
    name: 'marker-textured',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Textured Style', textDomain),
    className: 'jankx-marker-textured'
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "jankx-radio-gutenberg",
    children: markerOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
      className: "jankx-radio-option",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
        type: "radio",
        name: "textMarker",
        value: option.name,
        checked: selectedMarker === option.name,
        onChange: e => onMarkerChange(e.target.value, option.className)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "jankx-radio-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "jankx-radio-label",
          children: option.label
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: `jankx-radio-preview ${option.className}`,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sample Text', textDomain)
        })]
      })]
    }, option.name))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MarkerOptions);

/***/ }),

/***/ "./blocks/magic-text/components/marker/style.scss":
/*!********************************************************!*\
  !*** ./blocks/magic-text/components/marker/style.scss ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/index.js":
/*!*******************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./options */ "./blocks/magic-text/components/post-theme-selector/options.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _themes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./themes */ "./blocks/magic-text/components/post-theme-selector/themes/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









const textDomain = "jankx";
const LABEL_SETTING_PANEL_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Display Mode", textDomain);
const ThemeDocumentSettingsPanel = () => {
  const {
    savedTheme
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => ({
    savedTheme: select("core/editor").getEditedPostAttribute("meta")?.dro_magic_text_theme_meta
  }));
  const [enableThemeSelector, setEnableThemeSelector] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(() => savedTheme !== undefined && savedTheme !== "default");
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)("core/editor");
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const applyThemeClasses = () => {
      const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
      const iframe = iframeWrapper?.querySelector('iframe');
      const iframeBody = iframe?.contentDocument?.body;
      const editorContainer = document.querySelector('.editor-styles-wrapper');
      const elementsToStyle = [iframeBody, editorContainer].filter(Boolean);
      elementsToStyle.forEach(element => {
        // console.debug('1', element);
        element.classList.remove(..._options__WEBPACK_IMPORTED_MODULE_1__.ListAvailableThemes.map(theme => `magic-theme-${theme.value}`));
        element.classList.remove(..._options__WEBPACK_IMPORTED_MODULE_1__.ListAvailableThemes.map(theme => `theme-${theme.value}`));
      });
      if (enableThemeSelector && savedTheme && savedTheme !== "default") {
        // alert(`theme-${savedTheme}`);
        elementsToStyle.forEach(element => {
          // console.debug('2', element);
          element.classList.add(`magic-theme-${savedTheme}`);
          element.classList.add(`theme-${savedTheme}`);
        });
      } else {
        // alert('none')
      }
    };
    setTimeout(() => applyThemeClasses(), 100);
    // applyThemeClasses();

    const observer = new MutationObserver(mutations => {
      mutations.forEach(() => {
        const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
        if (iframeWrapper) {
          const iframe = iframeWrapper.querySelector('iframe');
          if (iframe && iframe.contentDocument) {
            applyThemeClasses();
          }
        }
      });
    });
    const editorArea = document.querySelector('.block-editor-iframe__scale-container')?.parentNode;
    if (editorArea) {
      observer.observe(editorArea, {
        childList: true,
        subtree: true
      });
    }
    return () => {
      observer.disconnect();
    };
  }, [savedTheme, enableThemeSelector]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.PluginDocumentSettingPanel, {
    name: "magic-text-display-mode",
    title: LABEL_SETTING_PANEL_TITLE,
    className: "jankx-post-theme-selector-panel",
    initialOpen: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "jankx-post-theme-selector-panel__content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Enable Theme Selector", textDomain),
        checked: enableThemeSelector,
        onChange: checked => {
          setEnableThemeSelector(checked);
          editPost({
            meta: {
              dro_magic_text_theme_meta: checked ? savedTheme || _options__WEBPACK_IMPORTED_MODULE_1__.ListAvailableThemes[0].value : "default"
            }
          });
        }
      }), (enableThemeSelector || savedTheme) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "theme-selector-wrapper",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("label", {
          htmlFor: "magic-text-display-mode",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Display Mode", textDomain)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("select", {
          id: "magic-text-display-mode",
          value: savedTheme || "default",
          onChange: e => {
            editPost({
              meta: {
                dro_magic_text_theme_meta: e.target.value
              }
            });
          },
          children: _options__WEBPACK_IMPORTED_MODULE_1__.ListAvailableThemes.map(theme => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("option", {
            value: theme.value,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(theme.name, textDomain)
          }, theme.value))
        })]
      })]
    })
  });
};
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_6__.registerPlugin)("jankx-post-theme-selector", {
  render: ThemeDocumentSettingsPanel,
  icon: "star-half"
});

/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/options.js":
/*!*********************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/options.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListAvailableThemes: () => (/* binding */ ListAvailableThemes)
/* harmony export */ });
const ListAvailableThemes = [{
  name: "Default",
  value: "default"
}, {
  name: "Dark",
  value: "dark"
}, {
  name: "Light",
  value: "light"
}, {
  name: "Milkshake",
  value: "milkshake"
}, {
  name: "Popsicle",
  value: "popsicle"
}];

/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/themes/dark.scss":
/*!***************************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/themes/dark.scss ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/themes/index.js":
/*!**************************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/themes/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dark_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dark.scss */ "./blocks/magic-text/components/post-theme-selector/themes/dark.scss");
/* harmony import */ var _light_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./light.scss */ "./blocks/magic-text/components/post-theme-selector/themes/light.scss");
/* harmony import */ var _milkshake_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./milkshake.scss */ "./blocks/magic-text/components/post-theme-selector/themes/milkshake.scss");
/* harmony import */ var _popsicle_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./popsicle.scss */ "./blocks/magic-text/components/post-theme-selector/themes/popsicle.scss");





/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/themes/light.scss":
/*!****************************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/themes/light.scss ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/themes/milkshake.scss":
/*!********************************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/themes/milkshake.scss ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/post-theme-selector/themes/popsicle.scss":
/*!*******************************************************************************!*\
  !*** ./blocks/magic-text/components/post-theme-selector/themes/popsicle.scss ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/text-bg-image/icon-text-bg-image.js":
/*!**************************************************************************!*\
  !*** ./blocks/magic-text/components/text-bg-image/icon-text-bg-image.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconBgImage = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("defs", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("pattern", {
        id: "imageTexture",
        patternUnits: "userSpaceOnUse",
        width: "6",
        height: "6",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
          width: "6",
          height: "6",
          fill: "url(#skyGradient)"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
          d: "M0 4 L2 2 L4 3 L6 1 L6 6 L0 6 Z",
          fill: "#2d3748"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
          cx: "1.5",
          cy: "1.5",
          r: "0.8",
          fill: "#fbbf24"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("ellipse", {
          cx: "4.5",
          cy: "2",
          rx: "0.8",
          ry: "0.4",
          fill: "white",
          opacity: "0.8"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("linearGradient", {
        id: "skyGradient",
        x1: "0%",
        y1: "0%",
        x2: "0%",
        y2: "100%",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "0%",
          stopColor: "#87ceeb"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "100%",
          stopColor: "#e0f6ff"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("mask", {
        id: "textMask",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
          width: "24",
          height: "24",
          fill: "black"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
          x: "12",
          y: "16",
          textAnchor: "middle",
          fontFamily: "Arial, sans-serif",
          fontSize: "10",
          fontWeight: "bold",
          fill: "white",
          children: "Aa"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "2",
      y: "2",
      width: "20",
      height: "20",
      rx: "2",
      fill: "#f8fafc",
      stroke: "#e2e8f0",
      strokeWidth: "1"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      fill: "url(#imageTexture)",
      mask: "url(#textMask)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
      x: "12",
      y: "16",
      textAnchor: "middle",
      fontFamily: "Arial, sans-serif",
      fontSize: "10",
      fontWeight: "bold",
      fill: "none",
      stroke: "rgba(0,0,0,0.3)",
      strokeWidth: "0.3",
      children: "Aa"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("g", {
      transform: "translate(16, 4)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
        width: "5",
        height: "4",
        rx: "0.5",
        fill: "#374151"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
        x: "0.5",
        y: "0.5",
        width: "4",
        height: "3",
        rx: "0.3",
        fill: "white"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
        d: "M1 3 L2 2 L3 2.5 L4 1.5 L4.5 3.5 L1 3.5 Z",
        fill: "#6b7280"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
        cx: "2",
        cy: "1.8",
        r: "0.3",
        fill: "#fbbf24"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("g", {
      transform: "translate(3, 17)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
        width: "4",
        height: "2",
        rx: "0.3",
        fill: "#4f46e5",
        opacity: "0.8"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
        x: "2",
        y: "1.3",
        textAnchor: "middle",
        fontFamily: "Arial, sans-serif",
        fontSize: "1.5",
        fill: "white",
        fontWeight: "bold",
        children: "T"
      })]
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconBgImage);

/***/ }),

/***/ "./blocks/magic-text/components/text-bg-image/index.js":
/*!*************************************************************!*\
  !*** ./blocks/magic-text/components/text-bg-image/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/components/text-bg-image/style.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _icon_text_bg_image__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./icon-text-bg-image */ "./blocks/magic-text/components/text-bg-image/icon-text-bg-image.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const textDomain = "jankx";
const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Custmze the Text background image", textDomain) || "Text Bg ImagCustmze the Text background image";
const LABEL_TOOLBAR_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Text bg image", textDomain) || "Text Bg Image";
const LABEL_BUTTON_APPLY = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Apply", textDomain) || "Apply";
const TextBgImageUI = ({
  onClose,
  onChange,
  setImageUrl,
  popoverAnchor,
  fontSize,
  setFontSize
}) => {
  const ALLOWED_MEDIA_TYPES = ["image"];
  const LABEL_OPEN_MEDIA = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Open Media Library", textDomain) || "Open Media Library";
  const fontSizes = [{
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Small"),
    slug: "small",
    size: 12
  }, {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Big"),
    slug: "big",
    size: 26
  }];
  const fallbackFontSize = 16;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Popover, {
    anchor: popoverAnchor,
    className: "jankx-popover",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      style: {
        minWidth: "320px",
        padding: "16px"
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h4", {
        style: {
          marginBottom: "12px"
        },
        children: LABEL_POPOVER_TITLE
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.MediaUploadCheck, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.MediaUpload, {
          allowedTypes: ALLOWED_MEDIA_TYPES,
          onSelect: media => setImageUrl(media.url),
          render: ({
            open
          }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
            variant: "primary",
            onClick: open,
            style: {
              marginBottom: "12px",
              width: "100%"
            },
            children: LABEL_OPEN_MEDIA
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.FontSizePicker, {
        __next40pxDefaultSize: true,
        fallbackFontSize: fallbackFontSize,
        fontSizes: fontSizes,
        value: fontSize,
        onChange: newFontSize => setFontSize(newFontSize)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
        variant: "primary",
        onClick: () => {
          onChange();
          onClose();
        },
        style: {
          width: "100%"
        },
        children: LABEL_BUTTON_APPLY
      })]
    })
  });
};
const TextBgImage = ({
  value,
  onChange,
  isActive
}) => {
  const [isAddingTxtBg, setIsAddingTxtBg] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const [imageUrl, setImageUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)("");
  const [fontSize, setFontSize] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)("20");
  const applyTxtBg = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.toggleFormat)(value, {
      type: "jankx/text-bg-image",
      attributes: {
        style: `--text-bg-image: url('${imageUrl}'); --text-size: ${fontSize}`,
        class: "jankx-bg-image"
      }
    }));
  }, [onChange, value, imageUrl, fontSize]);
  const handleToolbarClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    if (isActive) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.toggleFormat)(value, {
        type: "jankx/text-bg-image"
      }));
    } else {
      setIsAddingTxtBg(true);
    }
  }, [isActive, onChange, value]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichTextToolbarButton, {
        icon: _icon_text_bg_image__WEBPACK_IMPORTED_MODULE_6__["default"],
        title: LABEL_TOOLBAR_TITLE,
        onClick: handleToolbarClick,
        isActive: isActive
      })
    }), !isActive && isAddingTxtBg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextBgImageUI, {
      onClose: () => setIsAddingTxtBg(false),
      onChange: applyTxtBg,
      setImageUrl: setImageUrl,
      popoverAnchor: popoverAnchor,
      fontSize: fontSize,
      setFontSize: setFontSize
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.registerFormatType)("jankx/text-bg-image", {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Text bg", "jankx"),
  tagName: "span",
  className: 'jankx-bg-image',
  attributes: {
    style: "style"
  },
  edit: TextBgImage
});

/***/ }),

/***/ "./blocks/magic-text/components/text-bg-image/style.scss":
/*!***************************************************************!*\
  !*** ./blocks/magic-text/components/text-bg-image/style.scss ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/tooltip/icon-tooltip.js":
/*!**************************************************************!*\
  !*** ./blocks/magic-text/components/tooltip/icon-tooltip.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconTooltip = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "3",
      y: "3",
      width: "14",
      height: "10",
      rx: "3",
      ry: "3",
      fill: "currentColor",
      opacity: "0.9"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M8 13 L10 16 L12 13 Z",
      fill: "currentColor",
      opacity: "0.9"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "5",
      y: "5.5",
      width: "8",
      height: "1.5",
      rx: "0.75",
      fill: "white",
      opacity: "0.8"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("rect", {
      x: "5",
      y: "8",
      width: "6",
      height: "1.5",
      rx: "0.75",
      fill: "white",
      opacity: "0.6"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
      cx: "19",
      cy: "19",
      r: "3",
      fill: "currentColor",
      opacity: "0.7"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("text", {
      x: "19",
      y: "22",
      textAnchor: "middle",
      fontFamily: "Arial, sans-serif",
      fontSize: "3",
      fontWeight: "bold",
      fill: "white",
      children: "i"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconTooltip);

/***/ }),

/***/ "./blocks/magic-text/components/tooltip/index.js":
/*!*******************************************************!*\
  !*** ./blocks/magic-text/components/tooltip/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/components/tooltip/style.scss");
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./options */ "./blocks/magic-text/components/tooltip/options.js");
/* harmony import */ var _icon_tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./icon-tooltip */ "./blocks/magic-text/components/tooltip/icon-tooltip.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);










const TooltipEffectUI = ({
  LABEL_POPOVER_TITLE,
  LABEL_TOOLTIP_TEXT,
  LABEL_APPLY_BUTTON,
  LABEL_TOOLTIP_POSITION,
  onChange,
  setTooltipText,
  tooltipText,
  popoverAnchor,
  tooltipBgColor,
  setTolltipBgColor,
  tooltipTextColor,
  setTooltipTextColor,
  tooltipPosition,
  setTooltipPosition,
  useGradient,
  setUseGradient,
  gradientStartColor,
  setGradientStartColor,
  gradientEndColor,
  setGradientEndColor,
  gradientDirection,
  setGradientDirection,
  onClose
}) => {
  const gradientDirections = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('To Right', 'jankx'),
    value: 'to right'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('To Left', 'jankx'),
    value: 'to left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('To Bottom', 'jankx'),
    value: 'to bottom'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('To Top', 'jankx'),
    value: 'to top'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Diagonal ↘', 'jankx'),
    value: 'to bottom right'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Diagonal ↙', 'jankx'),
    value: 'to bottom left'
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Popover, {
    anchor: popoverAnchor,
    className: "jankx-popover",
    onClose: onClose,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      style: {
        padding: '16px',
        width: '320px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h4", {
        style: {
          marginTop: 0,
          marginBottom: '16px'
        },
        children: LABEL_POPOVER_TITLE
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: LABEL_TOOLTIP_TEXT,
        value: tooltipText,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Enter tooltip text', 'jankx'),
        onChange: value => setTooltipText(value),
        style: {
          marginBottom: '16px'
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: LABEL_TOOLTIP_POSITION,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select the position of the tooltip', 'jankx'),
        value: tooltipPosition,
        options: _options__WEBPACK_IMPORTED_MODULE_6__.tooltipPositions,
        onChange: value => setTooltipPosition(value),
        style: {
          marginBottom: '16px'
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Use Gradient Background', 'jankx'),
        help: useGradient ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Gradient background enabled', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Solid color background', 'jankx'),
        checked: useGradient,
        onChange: value => setUseGradient(value),
        style: {
          marginBottom: '16px'
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
        className: "tooltip-color-tabs",
        activeClass: "active-tab",
        tabs: [{
          name: 'background',
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Background', 'jankx'),
          className: 'background-tab'
        }, {
          name: 'text',
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Text Color', 'jankx'),
          className: 'text-tab'
        }],
        children: tab => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          style: {
            marginTop: '12px'
          },
          children: [tab.name === 'background' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            },
            children: !useGradient ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Background Color', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                color: tooltipBgColor,
                onChange: color => setTolltipBgColor(color)
              })]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Gradient Background', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Gradient Direction', 'jankx'),
                value: gradientDirection,
                options: gradientDirections,
                onChange: value => setGradientDirection(value),
                style: {
                  marginBottom: '12px'
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
                style: {
                  marginBottom: '16px'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Start Color', 'jankx')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                  color: gradientStartColor,
                  onChange: color => setGradientStartColor(color)
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('End Color', 'jankx')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
                  color: gradientEndColor,
                  onChange: color => setGradientEndColor(color)
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
                style: {
                  marginTop: '12px'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Preview', 'jankx')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                  style: {
                    height: '30px',
                    background: `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`,
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginTop: '4px'
                  }
                })]
              })]
            })
          }), tab.name === 'text' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Text Color', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
              color: tooltipTextColor,
              onChange: color => setTooltipTextColor(color)
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
        justify: "space-between",
        style: {
          marginTop: '20px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexBlock, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: onClose,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Cancel', 'jankx')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexBlock, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "primary",
            onClick: onChange,
            children: LABEL_APPLY_BUTTON
          })
        })]
      })]
    })
  });
};
const TooltipEffect = ({
  isActive,
  value,
  onChange,
  textDomain = "jankx"
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [tooltipText, setTooltipText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('Default Tooltip Text');
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)();
  const [tooltipBgColor, setTolltipBgColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('#000000');
  const [tooltipTextColor, setTooltipTextColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('#ffffff');
  const [tooltipPosition, setTooltipPosition] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('top');
  const [useGradient, setUseGradient] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [gradientStartColor, setGradientStartColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('#4f46e5');
  const [gradientEndColor, setGradientEndColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('#7c3aed');
  const [gradientDirection, setGradientDirection] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('to right');
  const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Tooltip Settings", textDomain) || "Tooltip Settings";
  const LABEL_TOOLTIP_TEXT = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Tooltip Text", textDomain) || "Tooltip Text";
  const LABEL_TOOLTIP_POSITION = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Tooltip Position", textDomain) || "Tooltip Position";
  const LABEL_APPLY_BUTTON = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)("Apply", textDomain) || "Apply";
  const applyTooltip = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useCallback)(() => {
    let backgroundStyle;
    if (useGradient) {
      backgroundStyle = `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`;
    } else {
      backgroundStyle = tooltipBgColor;
    }
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.toggleFormat)(value, {
      type: 'jankx/tooltip',
      attributes: {
        'data-tooltip': tooltipText,
        class: `tooltip-${tooltipPosition}`,
        style: `--tooltip-bg: ${backgroundStyle}; --tooltip-text-color: ${tooltipTextColor}; --tooltip-use-gradient: ${useGradient};`
      }
    }));
  }, [value, onChange, tooltipText, tooltipBgColor, tooltipTextColor, tooltipPosition, useGradient, gradientStartColor, gradientEndColor, gradientDirection]);
  const handleTooltipClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useCallback)(() => {
    if (isActive) {
      setIsPopoverVisible(true);
    } else {
      setIsPopoverVisible(true);
    }
  }, [isActive, value, onChange]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
        icon: _icon_tooltip__WEBPACK_IMPORTED_MODULE_7__["default"],
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Tooltip', 'jankx'),
        onClick: handleTooltipClick,
        isActive: isActive
      })
    }), isPopoverVisible && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(TooltipEffectUI, {
      onClose: () => setIsPopoverVisible(false),
      onChange: () => {
        applyTooltip();
        setIsPopoverVisible(false);
      },
      setTooltipText: setTooltipText,
      tooltipText: tooltipText,
      popoverAnchor: popoverAnchor,
      tooltipBgColor: tooltipBgColor,
      setTolltipBgColor: setTolltipBgColor,
      tooltipTextColor: tooltipTextColor,
      setTooltipTextColor: setTooltipTextColor,
      tooltipPosition: tooltipPosition,
      setTooltipPosition: setTooltipPosition,
      useGradient: useGradient,
      setUseGradient: setUseGradient,
      gradientStartColor: gradientStartColor,
      setGradientStartColor: setGradientStartColor,
      gradientEndColor: gradientEndColor,
      setGradientEndColor: setGradientEndColor,
      gradientDirection: gradientDirection,
      setGradientDirection: setGradientDirection,
      LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE,
      LABEL_TOOLTIP_TEXT: LABEL_TOOLTIP_TEXT,
      LABEL_APPLY_BUTTON: LABEL_APPLY_BUTTON,
      LABEL_TOOLTIP_POSITION: LABEL_TOOLTIP_POSITION
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.registerFormatType)('jankx/tooltip', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Tooltip', 'jankx'),
  tagName: 'span',
  className: 'jankx-tooltip',
  attributes: {
    'data-tooltip': 'data-tooltip',
    class: 'class',
    style: 'style'
  },
  edit: TooltipEffect
});

/***/ }),

/***/ "./blocks/magic-text/components/tooltip/options.js":
/*!*********************************************************!*\
  !*** ./blocks/magic-text/components/tooltip/options.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tooltipPositions: () => (/* binding */ tooltipPositions)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const tooltipPositions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top', 'jankx'),
  value: 'top'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom', 'jankx'),
  value: 'bottom'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'jankx'),
  value: 'left'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'jankx'),
  value: 'right'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Left ↖', 'jankx'),
  value: 'top-left'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Right ↗', 'jankx'),
  value: 'top-right'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Left ↙', 'jankx'),
  value: 'bottom-left'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Right ↘', 'jankx'),
  value: 'bottom-right'
}];

/***/ }),

/***/ "./blocks/magic-text/components/tooltip/style.scss":
/*!*********************************************************!*\
  !*** ./blocks/magic-text/components/tooltip/style.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/underline-effect/icon-underline-curve.js":
/*!*******************************************************************************!*\
  !*** ./blocks/magic-text/components/underline-effect/icon-underline-curve.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconUnderlineCurve = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("clipPath", {
        id: "underlineClip",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("polygon", {
          points: "2,12 12,18 22,12 22,6 2,6"
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M6 4 L6 12 Q6 16 10 16 L14 16 Q18 16 18 12 L18 4",
      stroke: "currentColor",
      strokeWidth: "2.5",
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M3 21 Q12 15 21 21",
      fill: "none",
      stroke: "hsl(130, 80%, 50%)",
      strokeWidth: "2"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M3 21 Q12 15 21 21",
      fill: "none",
      stroke: "hsl(130, 80%, 50%)",
      strokeWidth: "4",
      opacity: "0.6",
      clipPath: "url(#underlineClip)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M5 20.5 Q12 16 19 20.5",
      stroke: "hsl(130, 80%, 50%)",
      strokeWidth: "1.5",
      fill: "none",
      opacity: "0.8"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
      cx: "8",
      cy: "18",
      r: "0.8",
      fill: "hsl(130, 80%, 50%)",
      opacity: "0.4"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("circle", {
      cx: "16",
      cy: "18",
      r: "0.8",
      fill: "hsl(130, 80%, 50%)",
      opacity: "0.4"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconUnderlineCurve);

/***/ }),

/***/ "./blocks/magic-text/components/underline-effect/index.js":
/*!****************************************************************!*\
  !*** ./blocks/magic-text/components/underline-effect/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/components/underline-effect/style.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _icon_underline_curve__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./icon-underline-curve */ "./blocks/magic-text/components/underline-effect/icon-underline-curve.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const UnderlineEffectUI = ({
  onClose,
  onChange,
  popoverAnchor,
  borderColor,
  setBorderColor,
  LABEL_APPLY_UNDERLINE,
  LABEL_POPOVER_TITLE
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Popover, {
    className: "jankx-popover",
    anchor: popoverAnchor,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h4", {
      children: LABEL_POPOVER_TITLE
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.ColorPicker, {
      color: borderColor,
      onChange: color => setBorderColor(color)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
      variant: "primary",
      onClick: () => {
        onChange();
        onClose();
      },
      children: LABEL_APPLY_UNDERLINE
    })]
  });
};
const UnderlineEffect = ({
  isActive,
  onChange,
  value,
  textDomain = "jankx"
}) => {
  const [isAddingUnderline, setIsAddingUnderline] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [popoverAnchor, setPopoverAnchor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const [borderColor, setBorderColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)("hsl(130 80% 50%)");
  const LABEL_APPLY_UNDERLINE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Apply", textDomain) || "Apply";
  const LABEL_POPOVER_TITLE = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Customize Underline", textDomain) || "Customize Underline";
  const applyUnderlineEffect = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.toggleFormat)(value, {
      type: "jankx/underline-effect",
      attributes: {
        style: `--underline-border-color: ${borderColor};`,
        class: "jankx-underline-clip-effect"
      }
    }));
  }, [borderColor, onChange, value]);
  const handleToolbarClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
    if (isActive) {
      onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.toggleFormat)(value, {
        type: "jankx/underline-effect"
      }));
    } else {
      setIsAddingUnderline(true);
    }
  }, [isActive, onChange, value]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ref: setPopoverAnchor,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.RichTextToolbarButton, {
        icon: _icon_underline_curve__WEBPACK_IMPORTED_MODULE_6__["default"],
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Underline Effect", "jankx"),
        onClick: handleToolbarClick,
        isActive: isActive
      })
    }), !isActive && isAddingUnderline && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(UnderlineEffectUI, {
      onClose: () => setIsAddingUnderline(false),
      onChange: applyUnderlineEffect,
      popoverAnchor: popoverAnchor,
      borderColor: borderColor,
      setBorderColor: setBorderColor,
      LABEL_APPLY_UNDERLINE: LABEL_APPLY_UNDERLINE,
      LABEL_POPOVER_TITLE: LABEL_POPOVER_TITLE
    })]
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_3__.registerFormatType)("jankx/underline-effect", {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Underline Curve", "jankx"),
  tagName: "span",
  className: "jankx-underline-clip-effect",
  attributes: {
    style: "style",
    class: "class"
  },
  edit: UnderlineEffect
});

/***/ }),

/***/ "./blocks/magic-text/components/underline-effect/style.scss":
/*!******************************************************************!*\
  !*** ./blocks/magic-text/components/underline-effect/style.scss ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/components/unstyle-text/icon-unstyle.js":
/*!*******************************************************************!*\
  !*** ./blocks/magic-text/components/unstyle-text/icon-unstyle.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const IconUnstyle = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"], {
  icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("linearGradient", {
        id: "eraserGradient",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "100%",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "0%",
          style: {
            stopColor: "#3b82f6",
            stopOpacity: 1
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "50%",
          style: {
            stopColor: "#8b5cf6",
            stopOpacity: 1
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("stop", {
          offset: "100%",
          style: {
            stopColor: "#ec4899",
            stopOpacity: 1
          }
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M18.3,4.3l1.5,1.5c0.5,0.5,0.8,1.2,0.8,1.9v2.8c0,0.7-0.3,1.4-0.8,1.9L11,21.2C10.5,21.7,9.8,22,9.1,22 c-0.7,0-1.4-0.3-1.9-0.8l-1.5-1.5l-1.5-1.5c-0.5-0.5-0.8-1.2-0.8-1.9v-2.8c0-0.7,0.3-1.4,0.8-2L13,2.8C13.5,2.3,14.2,2,14.9,2 c0.7,0,1.4,0.3,1.9,0.8L18.3,4.3z M10.1,17.1l8.5-8.5c0.5-0.5,0.5-1.4,0-1.9l-2.8-2.8c-0.2-0.2-0.6-0.4-1-0.4s-0.7,0.1-0.9,0.4 l-8.5,8.5c-0.5,0.5-0.5,1.4,0,1.9l2.8,2.8C8.7,17.6,9.6,17.6,10.1,17.1z",
      fill: "none",
      stroke: "url(#eraserGradient)",
      strokeWidth: "1.5",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M18.3,4.3l1.5,1.5c0.5,0.5,0.8,1.2,0.8,1.9v2.8c0,0.7-0.3,1.4-0.8,1.9L11,21.2C10.5,21.7,9.8,22,9.1,22 c-0.7,0-1.4-0.3-1.9-0.8l-1.5-1.5l-1.5-1.5c-0.5-0.5-0.8-1.2-0.8-1.9v-2.8c0-0.7,0.3-1.4,0.8-2L13,2.8C13.5,2.3,14.2,2,14.9,2 c0.7,0,1.4,0.3,1.9,0.8L18.3,4.3z M10.1,17.1l8.5-8.5c0.5-0.5,0.5-1.4,0-1.9l-2.8-2.8c-0.2-0.2-0.6-0.4-1-0.4s-0.7,0.1-0.9,0.4 l-8.5,8.5c-0.5-0.5-0.5,1.4,0,1.9l2.8,2.8C8.7,17.6,9.6,17.6,10.1,17.1z",
      fill: "#f8fafc",
      opacity: "0.1"
    })]
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IconUnstyle);

/***/ }),

/***/ "./blocks/magic-text/components/unstyle-text/index.js":
/*!************************************************************!*\
  !*** ./blocks/magic-text/components/unstyle-text/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _icon_unstyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icon-unstyle */ "./blocks/magic-text/components/unstyle-text/icon-unstyle.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const UnstyleText = ({
  isActive,
  onChange,
  value
}) => {
  const applyUnstyleText = () => {
    const formatTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core/rich-text').getFormatTypes();
    if (formatTypes && formatTypes.length > 0) {
      let newValue = value;
      formatTypes.forEach(formatType => {
        // console.debug('Checking format type: ', formatType.name);
        newValue = (0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.removeFormat)(newValue, formatType.name);
      });
      onChange({
        ...newValue
      });
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichTextToolbarButton, {
    icon: _icon_unstyle__WEBPACK_IMPORTED_MODULE_4__["default"],
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unstyle Text', 'jankx'),
    onClick: applyUnstyleText,
    isActive: isActive
  });
};
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_0__.registerFormatType)('jankx/unstyle-test', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Unstyle Text', 'jankx'),
  tagName: 'span',
  className: 'jankx-unstyle-text',
  edit: UnstyleText
});

/***/ }),

/***/ "./blocks/magic-text/edit.js":
/*!***********************************!*\
  !*** ./blocks/magic-text/edit.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./blocks/magic-text/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

function Edit() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(),
    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Magic Text Block – hello from the editor!', 'jankx')
  });
}

/***/ }),

/***/ "./blocks/magic-text/editor.scss":
/*!***************************************!*\
  !*** ./blocks/magic-text/editor.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/magic-text/save.js":
/*!***********************************!*\
  !*** ./blocks/magic-text/save.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */

function save() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
    ..._wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save(),
    children: 'Magic Text Block – hello from the saved content!'
  });
}

/***/ }),

/***/ "./blocks/magic-text/style.scss":
/*!**************************************!*\
  !*** ./blocks/magic-text/style.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/** @typedef {{icon: JSX.Element, size?: number} & import('@wordpress/primitives').SVGProps} IconProps */

/**
 * Return an SVG icon.
 *
 * @param {IconProps}                                 props icon is the SVG component to render
 *                                                          size is a number specifiying the icon size in pixels
 *                                                          Other props will be passed to wrapped SVG component
 * @param {import('react').ForwardedRef<HTMLElement>} ref   The forwarded ref to the SVG element.
 *
 * @return {JSX.Element}  Icon component
 */
function Icon({
  icon,
  size = 24,
  ...props
}, ref) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
    width: size,
    height: size,
    ...props,
    ref
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(Icon));

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

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

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

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

/***/ }),

/***/ "@wordpress/rich-text":
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["richText"];

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
/*!************************************!*\
  !*** ./blocks/magic-text/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/magic-text/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/magic-text/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/magic-text/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/magic-text/block.json");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components */ "./blocks/magic-text/components/index.js");



/**
 * Internal dependencies
 */




/**
 * Import and register custom format type
 */


})();

/******/ })()
;
//# sourceMappingURL=index.js.map