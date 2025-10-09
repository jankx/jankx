/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/date-picker-calendar/src/edit.js":
/*!*************************************************!*\
  !*** ./blocks/date-picker-calendar/src/edit.js ***!
  \*************************************************/
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
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./blocks/date-picker-calendar/src/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function Edit({
  attributes,
  setAttributes
}) {
  const {
    selectedDates = [],
    currentMonth = 3,
    currentYear = 2026,
    showNavigation = true,
    showWeekdays = true
  } = attributes;
  const [localSelectedDates, setLocalSelectedDates] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(selectedDates);
  const [localMonth, setLocalMonth] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(currentMonth);
  const [localYear, setLocalYear] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(currentYear);
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const weekdayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  // Generate calendar data
  const generateCalendarData = (month, year) => {
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekday = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const calendarDays = [];

    // Previous month's days
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate();
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      calendarDays.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isSelected: false
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const selectedDate = localSelectedDates.find(d => d.day === day);
      const isSelected = !!selectedDate;
      const mode = selectedDate ? selectedDate.mode : null;
      calendarDays.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        isSelected,
        mode
      });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - calendarDays.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isSelected: false
      });
    }
    return calendarDays;
  };
  const calendarData = generateCalendarData(localMonth, localYear);
  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const existingDateIndex = localSelectedDates.findIndex(d => d.day === day);
    let newSelectedDates;
    if (existingDateIndex === -1) {
      // Not selected -> outline mode
      newSelectedDates = [...localSelectedDates, {
        day,
        mode: 'outline'
      }];
    } else {
      const currentMode = localSelectedDates[existingDateIndex].mode;
      if (currentMode === 'outline') {
        // Outline -> fill mode
        newSelectedDates = [...localSelectedDates];
        newSelectedDates[existingDateIndex] = {
          day,
          mode: 'fill'
        };
      } else {
        // Fill -> remove
        newSelectedDates = localSelectedDates.filter(d => d.day !== day);
      }
    }
    setLocalSelectedDates(newSelectedDates);
    setAttributes({
      selectedDates: newSelectedDates
    });
  };
  const handleMonthChange = direction => {
    let newMonth = localMonth;
    let newYear = localYear;
    if (direction === 'next') {
      newMonth = localMonth === 12 ? 1 : localMonth + 1;
      newYear = localMonth === 12 ? localYear + 1 : localYear;
    } else {
      newMonth = localMonth === 1 ? 12 : localMonth - 1;
      newYear = localMonth === 1 ? localYear - 1 : localYear;
    }
    setLocalMonth(newMonth);
    setLocalYear(newYear);
    setAttributes({
      currentMonth: newMonth,
      currentYear: newYear
    });
  };
  const monthOptions = monthNames.map((name, index) => ({
    label: name,
    value: index + 1
  }));
  const yearOptions = [];
  for (let year = 2020; year <= 2030; year++) {
    yearOptions.push({
      label: year.toString(),
      value: year
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...(0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Calendar Settings', 'jankx'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Month', 'jankx'),
          value: localMonth,
          options: monthOptions,
          onChange: value => {
            const newMonth = parseInt(value);
            setLocalMonth(newMonth);
            setAttributes({
              currentMonth: newMonth
            });
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Year', 'jankx'),
          value: localYear,
          options: yearOptions,
          onChange: value => {
            const newYear = parseInt(value);
            setLocalYear(newYear);
            setAttributes({
              currentYear: newYear
            });
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Navigation', 'jankx'),
          checked: showNavigation,
          onChange: value => setAttributes({
            showNavigation: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Weekdays', 'jankx'),
          checked: showWeekdays,
          onChange: value => setAttributes({
            showWeekdays: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSecondary: true,
          onClick: () => {
            setLocalSelectedDates([]);
            setAttributes({
              selectedDates: []
            });
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear Selected Dates', 'jankx')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "date-picker-calendar-editor",
      children: [showNavigation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "calendar-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "calendar-nav-btn prev-month",
          onClick: () => handleMonthChange('prev'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "dashicons dashicons-arrow-left-alt2"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h3", {
          className: "calendar-title",
          children: [monthNames[localMonth - 1], " - ", localYear]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          className: "calendar-nav-btn next-month",
          onClick: () => handleMonthChange('next'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "dashicons dashicons-arrow-right-alt2"
          })
        })]
      }), showWeekdays && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "calendar-weekdays",
        children: weekdayNames.map((weekday, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "weekday",
          children: weekday
        }, index))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "calendar-grid",
        children: calendarData.map((dayData, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: `calendar-day ${dayData.isCurrentMonth ? 'current-month' : 'other-month'} ${dayData.isSelected ? 'selected' : ''} ${dayData.isSelected && dayData.mode ? `mode-${dayData.mode}` : ''}`,
          onClick: () => handleDateClick(dayData.day, dayData.isCurrentMonth),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "day-number",
            children: dayData.day
          })
        }, index))
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "calendar-info",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Selected Dates:', 'jankx')
          }), ' ', localSelectedDates.length > 0 ? localSelectedDates.sort((a, b) => a.day - b.day).map(d => `${d.day} (${d.mode})`).join(', ') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx')]
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./blocks/date-picker-calendar/src/editor.scss":
/*!*****************************************************!*\
  !*** ./blocks/date-picker-calendar/src/editor.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/date-picker-calendar/src/style.scss":
/*!****************************************************!*\
  !*** ./blocks/date-picker-calendar/src/style.scss ***!
  \****************************************************/
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
/*!**************************************************!*\
  !*** ./blocks/date-picker-calendar/src/index.js ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/date-picker-calendar/src/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./blocks/date-picker-calendar/src/style.scss");




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('jankx/date-picker-calendar', {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => null // Dynamic block, rendered server-side
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map