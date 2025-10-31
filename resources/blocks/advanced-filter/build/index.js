/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-filter/components/DisplaySettings.js":
/*!**************************************************************!*\
  !*** ./blocks/advanced-filter/components/DisplaySettings.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const DisplaySettings = ({
  attributes,
  setAttributes
}) => {
  const {
    displaySettings,
    styling
  } = attributes;
  const updateDisplaySettings = (key, value) => {
    setAttributes({
      displaySettings: {
        ...displaySettings,
        [key]: value
      }
    });
  };
  const updateStyling = (key, value) => {
    setAttributes({
      styling: {
        ...styling,
        [key]: value
      }
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "jankx-advanced-filter-display-settings",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cài đặt hiển thị', 'jankx'),
      initialOpen: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị nhãn', 'jankx'),
        checked: displaySettings.showLabel || false,
        onChange: value => updateDisplaySettings('showLabel', value)
      }), displaySettings.showLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text nhãn', 'jankx'),
        value: displaySettings.labelText || '',
        onChange: value => updateDisplaySettings('labelText', value),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lọc theo:', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị nút reset', 'jankx'),
        checked: displaySettings.showReset || false,
        onChange: value => updateDisplaySettings('showReset', value)
      }), displaySettings.showReset && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text nút reset', 'jankx'),
        value: displaySettings.resetText || '',
        onChange: value => updateDisplaySettings('resetText', value),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Xóa bộ lọc', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị số lượng', 'jankx'),
        checked: displaySettings.showCount || false,
        onChange: value => updateDisplaySettings('showCount', value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị loading', 'jankx'),
        checked: displaySettings.showLoading || false,
        onChange: value => updateDisplaySettings('showLoading', value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Responsive', 'jankx'),
        checked: displaySettings.responsive || false,
        onChange: value => updateDisplaySettings('responsive', value)
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cài đặt AJAX', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bật AJAX', 'jankx'),
        checked: attributes.ajaxSettings?.enabled || false,
        onChange: value => setAttributes({
          ajaxSettings: {
            ...attributes.ajaxSettings,
            enabled: value
          }
        })
      }), attributes.ajaxSettings?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text loading', 'jankx'),
          value: attributes.ajaxSettings.loadingText || '',
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              loadingText: value
            }
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Đang tải...', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text lỗi', 'jankx'),
          value: attributes.ajaxSettings.errorText || '',
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              errorText: value
            }
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Có lỗi xảy ra', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cập nhật URL', 'jankx'),
          checked: attributes.ajaxSettings.updateURL || false,
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              updateURL: value
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cuộn đến kết quả', 'jankx'),
          checked: attributes.ajaxSettings.scrollToResults || false,
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              scrollToResults: value
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thời gian animation (ms)', 'jankx'),
          value: attributes.ajaxSettings.animationDuration || 300,
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              animationDuration: value
            }
          }),
          min: 100,
          max: 1000,
          step: 50
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delay debounce (ms)', 'jankx'),
          value: attributes.ajaxSettings.debounceDelay || 300,
          onChange: value => setAttributes({
            ajaxSettings: {
              ...attributes.ajaxSettings,
              debounceDelay: value
            }
          }),
          min: 100,
          max: 1000,
          step: 50
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styling', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
        value: styling.layout || 'horizontal',
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ngang', 'jankx'),
          value: 'horizontal'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Dọc', 'jankx'),
          value: 'vertical'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grid', 'jankx'),
          value: 'grid'
        }],
        onChange: value => updateStyling('layout', value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Khoảng cách (px)', 'jankx'),
        value: styling.gap || 15,
        onChange: value => updateStyling('gap', value),
        min: 0,
        max: 50,
        step: 5
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border radius (px)', 'jankx'),
        value: styling.borderRadius || 8,
        onChange: value => updateStyling('borderRadius', value),
        min: 0,
        max: 20,
        step: 1
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow', 'jankx'),
        value: styling.shadow || 'none',
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Không', 'jankx'),
          value: 'none'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nhẹ', 'jankx'),
          value: 'light'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trung bình', 'jankx'),
          value: 'medium'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Đậm', 'jankx'),
          value: 'heavy'
        }],
        onChange: value => updateStyling('shadow', value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Màu nền', 'jankx'),
        value: styling.backgroundColor || '',
        onChange: value => updateStyling('backgroundColor', value),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('transparent', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Màu chữ', 'jankx'),
        value: styling.textColor || '',
        onChange: value => updateStyling('textColor', value),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('inherit', 'jankx')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DisplaySettings);

/***/ }),

/***/ "./blocks/advanced-filter/components/FilterBuilder.js":
/*!************************************************************!*\
  !*** ./blocks/advanced-filter/components/FilterBuilder.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const FilterBuilder = ({
  attributes,
  setAttributes,
  postType: propPostType = null
}) => {
  const {
    filterType,
    filterConfig,
    targetBlocks,
    ajaxSettings,
    displaySettings,
    customFilters,
    metaFilters,
    dateFilters,
    priceFilters,
    customFields
  } = attributes;
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [availableTaxonomies, setAvailableTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [availableMetaKeys, setAvailableMetaKeys] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [detectedPostType, setDetectedPostType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(propPostType || 'post');

  // Auto-detect post type từ target blocks
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (targetBlocks && targetBlocks.length > 0) {
      // Fetch post type từ target blocks
      const fetchTargetBlockPostTypes = async () => {
        const postTypes = new Set();
        for (const target of targetBlocks) {
          if (!target.enabled || !target.blockId) continue;
          try {
            // Get block data để lấy postType - sử dụng POST method
            const formData = new FormData();
            formData.append('action', 'jankx_get_block_post_type');
            formData.append('block_id', target.blockId);
            const response = await fetch(window.ajaxurl || '/wp-admin/admin-ajax.php', {
              method: 'POST',
              body: formData,
              credentials: 'same-origin'
            });
            const data = await response.json();
            if (data.success && data.data) {
              postTypes.add(data.data);
            }
          } catch (error) {
            console.error('Error fetching block post type:', error);
          }
        }

        // Use first detected post type, or default to 'post'
        if (postTypes.size > 0) {
          const newPostType = Array.from(postTypes)[0];
          if (newPostType !== detectedPostType) {
            setDetectedPostType(newPostType);
          }
        } else if (!propPostType && detectedPostType !== 'post') {
          setDetectedPostType('post');
        }
      };
      fetchTargetBlockPostTypes();
    } else if (propPostType) {
      if (detectedPostType !== propPostType) {
        setDetectedPostType(propPostType);
      }
    } else {
      // Nếu không có target blocks và không có propPostType, reset về 'post'
      if (detectedPostType !== 'post') {
        setDetectedPostType('post');
      }
    }
  }, [targetBlocks, propPostType]); // Removed detectedPostType from dependencies to avoid infinite loop

  // Lấy danh sách taxonomies dựa trên detected post type
  const {
    taxonomies
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getTaxonomies
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    return {
      taxonomies: getTaxonomies({
        per_page: -1,
        post_type: detectedPostType
      })
    };
  }, [detectedPostType]);

  // Lấy danh sách meta keys
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!detectedPostType) return;
    const fetchMetaKeys = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${window.ajaxurl}?action=jankx_get_meta_keys&post_type=${detectedPostType}`, {
          credentials: 'same-origin'
        });
        const data = await response.json();
        if (data.success) {
          setAvailableMetaKeys(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching meta keys:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetaKeys();
  }, [detectedPostType]);

  // Cập nhật available taxonomies
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (taxonomies && detectedPostType) {
      const filtered = taxonomies.filter(tax => tax.types.includes(detectedPostType) && tax.visibility.public);
      setAvailableTaxonomies(filtered);
    }
  }, [taxonomies, detectedPostType]);

  // Use detected post type
  const postType = detectedPostType;
  const updateFilterConfig = (key, value) => {
    setAttributes({
      filterConfig: {
        ...filterConfig,
        [key]: value
      }
    });
  };
  const addCustomFilter = () => {
    const newFilter = {
      id: `custom_${Date.now()}`,
      type: 'text',
      label: 'Custom Filter',
      field: '',
      operator: 'contains',
      value: '',
      enabled: true
    };
    setAttributes({
      customFilters: [...customFilters, newFilter]
    });
  };
  const updateCustomFilter = (index, key, value) => {
    const updated = [...customFilters];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setAttributes({
      customFilters: updated
    });
  };
  const removeCustomFilter = index => {
    const updated = customFilters.filter((_, i) => i !== index);
    setAttributes({
      customFilters: updated
    });
  };
  const addMetaFilter = () => {
    const newFilter = {
      id: `meta_${Date.now()}`,
      metaKey: '',
      label: 'Meta Filter',
      type: 'text',
      operator: 'equals',
      compare: '=',
      // WP_Query compare format
      value: '',
      enabled: true
    };
    setAttributes({
      metaFilters: [...metaFilters, newFilter]
    });
  };
  const updateMetaFilter = (index, key, value) => {
    const updated = [...metaFilters];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setAttributes({
      metaFilters: updated
    });
  };
  const removeMetaFilter = index => {
    const updated = metaFilters.filter((_, i) => i !== index);
    setAttributes({
      metaFilters: updated
    });
  };
  const renderTaxonomyConfig = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cấu hình Taxonomy', 'jankx'),
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy', 'jankx'),
      value: filterConfig.taxonomy || 'category',
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chọn taxonomy...', 'jankx'),
        value: ''
      }, ...availableTaxonomies.map(tax => ({
        label: tax.name,
        value: tax.slug
      }))],
      onChange: value => updateFilterConfig('taxonomy', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
      value: filterConfig.layout || 'dropdown',
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Dropdown', 'jankx'),
        value: 'dropdown'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Checkbox', 'jankx'),
        value: 'checkbox'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Radio', 'jankx'),
        value: 'radio'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button Group', 'jankx'),
        value: 'button-group'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tag Cloud', 'jankx'),
        value: 'tag-cloud'
      }],
      onChange: value => updateFilterConfig('layout', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Placeholder', 'jankx'),
      value: filterConfig.placeholder || '',
      onChange: value => updateFilterConfig('placeholder', value),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nhập placeholder...', 'jankx')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text "Tất cả"', 'jankx'),
      value: filterConfig.allText || '',
      onChange: value => updateFilterConfig('allText', value),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tất cả', 'jankx')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị số lượng', 'jankx'),
      checked: filterConfig.showCount || false,
      onChange: value => updateFilterConfig('showCount', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cho phép chọn nhiều', 'jankx'),
      checked: filterConfig.multiple || false,
      onChange: value => updateFilterConfig('multiple', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị tất cả', 'jankx'),
      checked: filterConfig.showAll || false,
      onChange: value => updateFilterConfig('showAll', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Có thể tìm kiếm', 'jankx'),
      checked: filterConfig.searchable || false,
      onChange: value => updateFilterConfig('searchable', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị phân cấp', 'jankx'),
      checked: filterConfig.hierarchical || false,
      onChange: value => updateFilterConfig('hierarchical', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị trống', 'jankx'),
      checked: filterConfig.showEmpty || false,
      onChange: value => updateFilterConfig('showEmpty', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sắp xếp theo', 'jankx'),
      value: filterConfig.orderBy || 'name',
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tên', 'jankx'),
        value: 'name'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slug', 'jankx'),
        value: 'slug'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Số lượng', 'jankx'),
        value: 'count'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ID', 'jankx'),
        value: 'id'
      }],
      onChange: value => updateFilterConfig('orderBy', value)
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thứ tự', 'jankx'),
      value: filterConfig.order || 'ASC',
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tăng dần', 'jankx'),
        value: 'ASC'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Giảm dần', 'jankx'),
        value: 'DESC'
      }],
      onChange: value => updateFilterConfig('order', value)
    })]
  });
  const renderCustomFilters = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bộ lọc tùy chỉnh', 'jankx'),
    initialOpen: false,
    children: [customFilters.map((filter, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
      size: "small",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
          justify: "space-between",
          align: "center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              value: filter.label,
              onChange: value => updateCustomFilter(index, 'label', value),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tên bộ lọc', 'jankx')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => removeCustomFilter(index),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Xóa', 'jankx')
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loại', 'jankx'),
          value: filter.type,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text', 'jankx'),
            value: 'text'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number', 'jankx'),
            value: 'number'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
            value: 'date'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'jankx'),
            value: 'select'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Checkbox', 'jankx'),
            value: 'checkbox'
          }],
          onChange: value => updateCustomFilter(index, 'type', value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Field', 'jankx'),
          value: filter.field,
          onChange: value => updateCustomFilter(index, 'field', value),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tên field', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Toán tử', 'jankx'),
          value: filter.operator,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bằng', 'jankx'),
            value: 'equals'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chứa', 'jankx'),
            value: 'contains'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bắt đầu với', 'jankx'),
            value: 'starts_with'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Kết thúc với', 'jankx'),
            value: 'ends_with'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lớn hơn', 'jankx'),
            value: 'greater_than'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nhỏ hơn', 'jankx'),
            value: 'less_than'
          }],
          onChange: value => updateCustomFilter(index, 'operator', value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Giá trị', 'jankx'),
          value: filter.value,
          onChange: value => updateCustomFilter(index, 'value', value),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Giá trị mặc định', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Kích hoạt', 'jankx'),
          checked: filter.enabled,
          onChange: value => updateCustomFilter(index, 'enabled', value)
        })]
      })]
    }, filter.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addCustomFilter,
      style: {
        marginTop: '10px'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thêm bộ lọc tùy chỉnh', 'jankx')
    })]
  });
  const renderMetaFilters = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bộ lọc Meta', 'jankx'),
    initialOpen: false,
    children: [isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}), metaFilters.map((filter, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
      size: "small",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
          justify: "space-between",
          align: "center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              value: filter.label,
              onChange: value => updateMetaFilter(index, 'label', value),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tên bộ lọc', 'jankx')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => removeMetaFilter(index),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Xóa', 'jankx')
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
          value: filter.metaKey,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chọn meta key...', 'jankx'),
            value: ''
          }, ...availableMetaKeys.map(key => ({
            label: key,
            value: key
          }))],
          onChange: value => updateMetaFilter(index, 'metaKey', value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loại', 'jankx'),
          value: filter.type,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text', 'jankx'),
            value: 'text'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number', 'jankx'),
            value: 'number'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
            value: 'date'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'jankx'),
            value: 'select'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Checkbox', 'jankx'),
            value: 'checkbox'
          }],
          onChange: value => updateMetaFilter(index, 'type', value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Toán tử', 'jankx'),
          value: filter.operator || filter.compare || 'equals',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bằng (=)', 'jankx'),
            value: 'equals'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Không bằng (!=)', 'jankx'),
            value: 'not_equals'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chứa (LIKE)', 'jankx'),
            value: 'contains'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Không chứa (NOT LIKE)', 'jankx'),
            value: 'not_contains'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lớn hơn (>)', 'jankx'),
            value: 'greater_than'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lớn hơn hoặc bằng (>=)', 'jankx'),
            value: 'greater_equal'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nhỏ hơn (<)', 'jankx'),
            value: 'less_than'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nhỏ hơn hoặc bằng (<=)', 'jankx'),
            value: 'less_equal'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trong danh sách (IN)', 'jankx'),
            value: 'in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Không trong danh sách (NOT IN)', 'jankx'),
            value: 'not_in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tồn tại (EXISTS)', 'jankx'),
            value: 'exists'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Không tồn tại (NOT EXISTS)', 'jankx'),
            value: 'not_exists'
          }],
          onChange: value => {
            // Map operator to WP_Query compare format
            const compareMap = {
              'equals': '=',
              'not_equals': '!=',
              'contains': 'LIKE',
              'not_contains': 'NOT LIKE',
              'greater_than': '>',
              'greater_equal': '>=',
              'less_than': '<',
              'less_equal': '<=',
              'in': 'IN',
              'not_in': 'NOT IN',
              'exists': 'EXISTS',
              'not_exists': 'NOT EXISTS'
            };
            updateMetaFilter(index, 'operator', value);
            updateMetaFilter(index, 'compare', compareMap[value] || '=');
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Giá trị', 'jankx'),
          value: filter.value,
          onChange: value => updateMetaFilter(index, 'value', value),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Giá trị mặc định', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Kích hoạt', 'jankx'),
          checked: filter.enabled,
          onChange: value => updateMetaFilter(index, 'enabled', value)
        })]
      })]
    }, filter.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addMetaFilter,
      style: {
        marginTop: '10px'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thêm bộ lọc Meta', 'jankx')
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "jankx-advanced-filter-builder",
    children: [postType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
        status: "info",
        isDismissible: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type:', 'jankx')
          }), " ", postType]
        }), targetBlocks && targetBlocks.length > 0 && targetBlocks.some(t => t.enabled) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            fontSize: '12px',
            marginTop: '8px',
            marginBottom: 0
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post type được tự động detect từ target blocks. Filters sẽ chỉ áp dụng cho post type này.', 'jankx')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          style: {
            fontSize: '12px',
            marginTop: '8px',
            marginBottom: 0,
            color: '#856404'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('⚠️ Chưa có target blocks. Hãy chọn target blocks trong tab "Targets" để auto-detect post type.', 'jankx')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loại bộ lọc', 'jankx'),
      initialOpen: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loại bộ lọc chính', 'jankx'),
        value: filterType,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy', 'jankx'),
          value: 'taxonomy'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Field', 'jankx'),
          value: 'meta'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date Range', 'jankx'),
          value: 'date'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Price Range', 'jankx'),
          value: 'price'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'jankx'),
          value: 'custom'
        }],
        onChange: value => setAttributes({
          filterType: value
        })
      })
    }), filterType === 'taxonomy' && renderTaxonomyConfig(), renderCustomFilters(), renderMetaFilters(),  true && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Debug Info', 'jankx'),
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          fontSize: '12px',
          color: '#666',
          fontFamily: 'monospace'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: "Detected Post Type:"
          }), " ", detectedPostType]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: "Target Blocks:"
          }), " ", targetBlocks?.length || 0]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: "Available Taxonomies:"
          }), " ", availableTaxonomies.length]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: "Available Meta Keys:"
          }), " ", availableMetaKeys.length]
        })]
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterBuilder);

/***/ }),

/***/ "./blocks/advanced-filter/components/TargetBlocks.js":
/*!***********************************************************!*\
  !*** ./blocks/advanced-filter/components/TargetBlocks.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const TargetBlocks = ({
  attributes,
  setAttributes
}) => {
  const {
    targetBlocks
  } = attributes;
  const [availableBlocks, setAvailableBlocks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);

  // Lấy danh sách các block có thể làm target
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const fetchAvailableBlocks = async () => {
      setIsLoading(true);
      try {
        // Use REST API to avoid ajaxurl issues in Site Editor iframe
        const data = await window.wp.apiFetch({
          path: '/jankx/v1/advanced-filter/filterable-blocks',
          method: 'GET'
        });
        if (Array.isArray(data)) {
          setAvailableBlocks(data);
        } else if (data && data.success) {
          setAvailableBlocks(data.data || []);
        } else {
          setAvailableBlocks([]);
        }
      } catch (error) {
        console.error('Error fetching available blocks:', error);
        setAvailableBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableBlocks();
  }, []);
  const addTargetBlock = () => {
    const newTarget = {
      id: `target_${Date.now()}`,
      blockId: '',
      blockName: '',
      selector: '.jankx-post-layout-content',
      enabled: true
    };
    setAttributes({
      targetBlocks: [...targetBlocks, newTarget]
    });
  };
  const updateTargetBlock = (index, key, value) => {
    const updated = [...targetBlocks];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setAttributes({
      targetBlocks: updated
    });
  };
  const removeTargetBlock = index => {
    const updated = targetBlocks.filter((_, i) => i !== index);
    setAttributes({
      targetBlocks: updated
    });
  };
  const getBlockName = blockId => {
    const block = availableBlocks.find(b => b.id === blockId);
    return block ? block.name : blockId;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Block đích', 'jankx'),
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
      status: "info",
      isDismissible: false,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chọn các block sẽ được cập nhật khi filter thay đổi. Thường là Post Layout blocks.', 'jankx')
    }), isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}), targetBlocks.map((target, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Card, {
      size: "small",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Flex, {
          justify: "space-between",
          align: "center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
              children: getBlockName(target.blockId) || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Block mới', 'jankx')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => removeTargetBlock(index),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Xóa', 'jankx')
            })
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chọn block', 'jankx'),
          value: target.blockId,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chọn block...', 'jankx'),
            value: ''
          }, ...availableBlocks.map(block => ({
            label: block.name,
            value: block.id
          }))],
          onChange: value => {
            updateTargetBlock(index, 'blockId', value);
            updateTargetBlock(index, 'blockName', getBlockName(value));
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CSS Selector', 'jankx'),
          value: target.selector,
          onChange: value => updateTargetBlock(index, 'selector', value),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('.jankx-post-layout-content', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CSS selector để tìm phần tử cần cập nhật', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          style: {
            marginTop: '10px'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
              type: "checkbox",
              checked: target.enabled,
              onChange: e => updateTargetBlock(index, 'enabled', e.target.checked)
            }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Kích hoạt', 'jankx')]
          })
        })]
      })]
    }, target.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addTargetBlock,
      style: {
        marginTop: '10px'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thêm block đích', 'jankx')
    }), targetBlocks.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
      status: "warning",
      isDismissible: false,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chưa có block đích nào. Hãy thêm ít nhất một block để filter hoạt động.', 'jankx')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TargetBlocks);

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

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

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
  !*** ./blocks/advanced-filter/index.tsx ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_FilterBuilder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/FilterBuilder */ "./blocks/advanced-filter/components/FilterBuilder.js");
/* harmony import */ var _components_DisplaySettings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/DisplaySettings */ "./blocks/advanced-filter/components/DisplaySettings.js");
/* harmony import */ var _components_TargetBlocks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/TargetBlocks */ "./blocks/advanced-filter/components/TargetBlocks.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    filterId,
    filterType,
    filterConfig,
    targetBlocks,
    ajaxSettings,
    displaySettings,
    styling,
    customFilters,
    metaFilters,
    dateFilters,
    priceFilters
  } = attributes;
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('filters');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: 'jankx-advanced-filter'
  });

  // Tạo filterId nếu chưa có
  if (!filterId) {
    setAttributes({
      filterId: `filter_${clientId}`
    });
  }
  const updateAttribute = (key, value) => {
    setAttributes({
      [key]: value
    });
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'filters':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_components_FilterBuilder__WEBPACK_IMPORTED_MODULE_5__["default"], {
          attributes: attributes,
          setAttributes: setAttributes
        });
      case 'display':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_components_DisplaySettings__WEBPACK_IMPORTED_MODULE_6__["default"], {
          attributes: attributes,
          setAttributes: setAttributes
        });
      case 'targets':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_components_TargetBlocks__WEBPACK_IMPORTED_MODULE_7__["default"], {
          attributes: attributes,
          setAttributes: setAttributes
        });
      default:
        return null;
    }
  };
  const renderPreview = () => {
    const hasFilters = customFilters.length > 0 || metaFilters.length > 0 || filterType === 'taxonomy' && filterConfig?.taxonomy;
    const hasTargets = targetBlocks.length > 0 && targetBlocks.some(t => t.enabled);

    // Count filters
    const dateFilters = attributes.dateFilters || [];
    const priceFilters = attributes.priceFilters || [];
    const filterCount = (filterType === 'taxonomy' && filterConfig?.taxonomy ? 1 : 0) + (customFilters?.length || 0) + (metaFilters?.length || 0) + (dateFilters?.length || 0) + (priceFilters?.length || 0);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "jankx-advanced-filter__preview",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "jankx-advanced-filter__preview-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          className: "jankx-advanced-filter__preview-icon",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
            className: "dashicons dashicons-filter"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "jankx-advanced-filter__preview-info",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "jankx-advanced-filter__preview-title",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Filter', 'jankx'), filterId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "jankx-advanced-filter__preview-id",
              children: ["(", filterId, ")"]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "jankx-advanced-filter__preview-stats",
            children: [filterCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "jankx-advanced-filter__stat",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
                className: "dashicons dashicons-filter"
              }), filterCount, " ", filterCount === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('filter', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('filters', 'jankx')]
            }), hasTargets && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "jankx-advanced-filter__stat",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
                className: "dashicons dashicons-admin-links"
              }), targetBlocks.filter(t => t.enabled).length, " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('targets', 'jankx')]
            }), ajaxSettings?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "jankx-advanced-filter__stat",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
                className: "dashicons dashicons-update"
              }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('AJAX', 'jankx')]
            })]
          })]
        })]
      }), !hasFilters ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "jankx-advanced-filter__preview-empty",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "dashicons dashicons-info"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chưa có bộ lọc nào được cấu hình.', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          className: "jankx-advanced-filter__preview-hint",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hãy cấu hình bộ lọc trong panel bên phải → tab "Bộ lọc".', 'jankx')
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "jankx-advanced-filter__preview-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          className: "jankx-advanced-filter__preview-label",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preview:', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "jankx-advanced-filter__preview-filters",
          children: [filterType === 'taxonomy' && filterConfig?.taxonomy && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "jankx-advanced-filter__preview-filter-item",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-icon",
              children: "\uD83C\uDFF7\uFE0F"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-label",
              children: filterConfig.taxonomy === 'category' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Categories', 'jankx') : filterConfig.taxonomy === 'post_tag' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tags', 'jankx') : filterConfig.taxonomy
            })]
          }), customFilters.map((filter, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "jankx-advanced-filter__preview-filter-item",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-icon",
              children: "\u2699\uFE0F"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-label",
              children: filter.label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Filter', 'jankx')
            })]
          }, filter.id || index)), metaFilters.map((filter, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "jankx-advanced-filter__preview-filter-item",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-icon",
              children: "\uD83D\uDCCA"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "jankx-advanced-filter__preview-filter-label",
              children: filter.label || filter.metaKey || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Filter', 'jankx')
            })]
          }, filter.id || index))]
        })]
      }), !hasTargets && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "jankx-advanced-filter__preview-warning",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          className: "dashicons dashicons-warning"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chưa có block đích nào được chọn.', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          className: "jankx-advanced-filter__preview-hint",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hãy chọn block đích trong panel bên phải → tab "Targets".', 'jankx')
        })]
      })]
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: renderPreview()
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cài đặt Filter', 'jankx'),
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            className: "jankx-advanced-filter__tabs",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ButtonGroup, {
              className: "jankx-advanced-filter__tab-buttons",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                isPrimary: activeTab === 'filters',
                onClick: () => setActiveTab('filters'),
                icon: "filter",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bộ lọc', 'jankx'),
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bộ lọc', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                isPrimary: activeTab === 'display',
                onClick: () => setActiveTab('display'),
                icon: "visibility",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị', 'jankx'),
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hiển thị', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                isPrimary: activeTab === 'targets',
                onClick: () => setActiveTab('targets'),
                icon: "admin-links",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Targets', 'jankx'),
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Targets', 'jankx')
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            className: "jankx-advanced-filter__tab-content",
            children: renderTabContent()
          })]
        })
      })
    })]
  });
}
console.log('Advanced Filter');
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('jankx/advanced-filter', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Filter', 'jankx'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bộ lọc nâng cao với khả năng tương tác AJAX và tích hợp với Post Layout', 'jankx'),
  category: 'jankx',
  icon: 'filter',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('filter', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('search', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ajax', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('interactive', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('posts', 'jankx')],
  supports: {
    html: false,
    align: ['wide', 'full'],
    customClassName: true,
    reusable: true
  },
  attributes: {
    filterId: {
      type: 'string',
      default: ''
    },
    filterType: {
      type: 'string',
      default: 'taxonomy'
    },
    filterConfig: {
      type: 'object',
      default: {}
    },
    targetBlocks: {
      type: 'array',
      default: []
    },
    ajaxSettings: {
      type: 'object',
      default: {}
    },
    displaySettings: {
      type: 'object',
      default: {}
    },
    styling: {
      type: 'object',
      default: {}
    },
    customFilters: {
      type: 'array',
      default: []
    },
    metaFilters: {
      type: 'array',
      default: []
    },
    dateFilters: {
      type: 'array',
      default: []
    },
    priceFilters: {
      type: 'array',
      default: []
    },
    customFields: {
      type: 'array',
      default: []
    }
  },
  edit: Edit,
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map