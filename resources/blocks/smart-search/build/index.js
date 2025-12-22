/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/smart-search/block.json":
/*!****************************************!*\
  !*** ./blocks/smart-search/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/smart-search","version":"1.0.0","title":"Smart Search","category":"jankx","icon":"search","keywords":["search","form","autocomplete","suggestion","filter"],"supports":{"align":["wide","full"],"html":false,"color":{"background":true,"text":true,"gradients":true,"link":true},"spacing":{"margin":true,"padding":true,"blockGap":true},"border":{"color":true,"radius":true,"style":true,"width":true},"background":{"backgroundImage":true,"backgroundPosition":true,"backgroundRepeat":true,"backgroundSize":true},"dimensions":{"minHeight":true},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"description":"Search form builder với auto suggestion và autocomplete capabilities","attributes":{"placeholder":{"type":"string","default":"Search..."},"showPostTypeFilter":{"type":"boolean","default":false},"postTypes":{"type":"array","default":["post"],"items":{"type":"string"}},"showTaxonomyFilter":{"type":"boolean","default":false},"taxonomies":{"type":"array","default":[],"items":{"type":"string"}},"enableAutoSuggestion":{"type":"boolean","default":true},"showPosts":{"type":"boolean","default":true},"showPostTypes":{"type":"boolean","default":false},"showUsers":{"type":"boolean","default":false},"showTaxonomy":{"type":"boolean","default":false},"showTags":{"type":"boolean","default":false},"suggestionLimit":{"type":"integer","default":10},"iconPosition":{"type":"string","default":"inside","enum":["inside","outside"]},"showIcon":{"type":"boolean","default":true},"showLabel":{"type":"boolean","default":false},"labelText":{"type":"string","default":"Search"},"buttonPosition":{"type":"string","default":"inside","enum":["inside","outside"]},"searchUrl":{"type":"string","default":""}},"textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","viewScript":"file:./build/frontend.js"}');

/***/ }),

/***/ "./blocks/smart-search/edit.tsx":
/*!**************************************!*\
  !*** ./blocks/smart-search/edit.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * WordPress dependencies
 */





function Edit({
  attributes,
  setAttributes
}) {
  const {
    placeholder,
    showPostTypeFilter,
    postTypes,
    showTaxonomyFilter,
    taxonomies,
    enableAutoSuggestion,
    showPosts,
    showPostTypes,
    showUsers,
    showTaxonomy,
    showTags,
    suggestionLimit,
    iconPosition,
    showIcon,
    showLabel,
    labelText,
    buttonPosition,
    searchUrl
  } = attributes;
  const [availablePostTypes, setAvailablePostTypes] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)([]);
  const [availableTaxonomies, setAvailableTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(true);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    const fetchData = async () => {
      try {
        // Get REST API base URL
        const restUrl = window.wp?.apiSettings?.root || '/wp-json/';
        const namespace = 'jankx/v1';

        // Fetch post types with their taxonomies
        const postTypesResponse = await fetch(`${restUrl}${namespace}/smart-search/post-types`);
        if (postTypesResponse.ok) {
          const postTypesData = await postTypesResponse.json();
          const postTypesList = postTypesData.map(pt => ({
            label: pt.label || pt.name,
            value: pt.name,
            taxonomies: pt.taxonomies || []
          }));
          setAvailablePostTypes(postTypesList);
        }

        // Fetch taxonomies with their post types
        const taxonomiesResponse = await fetch(`${restUrl}${namespace}/smart-search/taxonomies`);
        if (taxonomiesResponse.ok) {
          const taxonomiesData = await taxonomiesResponse.json();
          const taxonomiesList = taxonomiesData.map(tax => ({
            label: tax.label || tax.name,
            value: tax.name,
            postTypes: tax.post_types || []
          }));
          setAvailableTaxonomies(taxonomiesList);
        }
      } catch (error) {
        console.error('Error fetching post types and taxonomies:', error);
        // Fallback to defaults
        setAvailablePostTypes([{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts', 'jankx'),
          value: 'post',
          taxonomies: []
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pages', 'jankx'),
          value: 'page',
          taxonomies: []
        }]);
        setAvailableTaxonomies([{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Categories', 'jankx'),
          value: 'category',
          postTypes: []
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tags', 'jankx'),
          value: 'post_tag',
          postTypes: []
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'wp-block-jankx-smart-search-editor'
  });

  // Filter taxonomies based on selected post types for filter
  const filteredTaxonomies = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    if (postTypes.length === 0) {
      // If no post types selected, show all available taxonomies
      return availableTaxonomies;
    }
    // Only show taxonomies that are associated with at least one selected post type
    return availableTaxonomies.filter(tax => {
      // Check if taxonomy is associated with any selected post type
      return tax.postTypes.some(pt => postTypes.includes(pt.name));
    });
  }, [availableTaxonomies, postTypes]);

  // Filter taxonomies for suggestion based on selected post types
  const filteredTaxonomiesForSuggestion = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    if (postTypes.length === 0) {
      return availableTaxonomies;
    }
    return availableTaxonomies.filter(tax => {
      // Check if taxonomy is associated with any selected post type
      return tax.postTypes.some(pt => postTypes.includes(pt.name));
    });
  }, [availableTaxonomies, postTypes]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Placeholder', 'jankx'),
          value: placeholder,
          onChange: value => setAttributes({
            placeholder: value || 'Search...'
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search URL', 'jankx'),
          value: searchUrl,
          onChange: value => setAttributes({
            searchUrl: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Leave empty to use default WordPress search URL', 'jankx')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter Options', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Post Type Filter', 'jankx'),
          checked: showPostTypeFilter,
          onChange: value => setAttributes({
            showPostTypeFilter: value
          })
        }), showPostTypeFilter && availablePostTypes.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          style: {
            marginTop: '16px',
            marginBottom: '16px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Post Types for Filter:', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            style: {
              marginLeft: '8px',
              marginTop: '8px'
            },
            children: availablePostTypes.map(pt => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
              label: pt.label,
              checked: postTypes.includes(pt.value),
              onChange: checked => {
                if (checked) {
                  setAttributes({
                    postTypes: [...postTypes, pt.value]
                  });
                } else {
                  const newPostTypes = postTypes.filter(p => p !== pt.value);
                  setAttributes({
                    postTypes: newPostTypes
                  });
                }
              }
            }, pt.value))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Taxonomy Filter', 'jankx'),
          checked: showTaxonomyFilter,
          onChange: value => setAttributes({
            showTaxonomyFilter: value
          })
        }), showTaxonomyFilter && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          style: {
            marginTop: '16px',
            marginBottom: '16px'
          },
          children: postTypes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            style: {
              padding: '8px',
              background: '#fff3cd',
              borderRadius: '4px',
              color: '#856404'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please select post types first to see available taxonomies', 'jankx')
          }) : filteredTaxonomies.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Taxonomies for Filter:', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              style: {
                marginLeft: '8px',
                marginTop: '8px'
              },
              children: filteredTaxonomies.map(tax => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
                label: tax.label,
                checked: taxonomies.includes(tax.value),
                onChange: checked => {
                  if (checked) {
                    setAttributes({
                      taxonomies: [...taxonomies, tax.value]
                    });
                  } else {
                    const newTaxonomies = taxonomies.filter(t => t !== tax.value);
                    setAttributes({
                      taxonomies: newTaxonomies
                    });
                  }
                }
              }, tax.value))
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            style: {
              padding: '8px',
              background: '#f8d7da',
              borderRadius: '4px',
              color: '#721c24'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No taxonomies available for selected post types', 'jankx')
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Auto Suggestion', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Auto Suggestion', 'jankx'),
          checked: enableAutoSuggestion,
          onChange: value => setAttributes({
            enableAutoSuggestion: value
          })
        }), enableAutoSuggestion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Suggestion Limit', 'jankx'),
            value: suggestionLimit,
            onChange: value => setAttributes({
              suggestionLimit: value || 10
            }),
            min: 1,
            max: 50
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            style: {
              marginTop: '16px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show in Suggestions:', 'jankx')
            }), availablePostTypes.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              style: {
                marginLeft: '8px',
                marginTop: '8px'
              },
              children: availablePostTypes.map(pt => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
                label: pt.label,
                checked: showPosts && postTypes.includes(pt.value),
                onChange: checked => {
                  if (checked) {
                    // If enabling this post type, ensure showPosts is true
                    setAttributes({
                      postTypes: [...postTypes, pt.value],
                      showPosts: true
                    });
                  } else {
                    // If disabling, remove from postTypes but keep showPosts if others remain
                    const newPostTypes = postTypes.filter(p => p !== pt.value);
                    setAttributes({
                      postTypes: newPostTypes,
                      showPosts: newPostTypes.length > 0
                    });
                  }
                }
              }, pt.value))
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Users', 'jankx'),
              checked: showUsers,
              onChange: value => setAttributes({
                showUsers: value
              })
            }), filteredTaxonomiesForSuggestion.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              style: {
                marginLeft: '8px',
                marginTop: '8px'
              },
              children: filteredTaxonomiesForSuggestion.map(tax => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
                label: tax.label,
                checked: showTaxonomy && taxonomies.includes(tax.value),
                onChange: checked => {
                  if (checked) {
                    setAttributes({
                      taxonomies: [...taxonomies, tax.value],
                      showTaxonomy: true
                    });
                  } else {
                    const newTaxonomies = taxonomies.filter(t => t !== tax.value);
                    setAttributes({
                      taxonomies: newTaxonomies,
                      showTaxonomy: newTaxonomies.length > 0
                    });
                  }
                }
              }, tax.value))
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Label', 'jankx'),
          checked: showLabel,
          onChange: value => setAttributes({
            showLabel: value
          })
        }), showLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Label Text', 'jankx'),
          value: labelText,
          onChange: value => setAttributes({
            labelText: value || 'Search'
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Icon', 'jankx'),
          checked: showIcon,
          onChange: value => setAttributes({
            showIcon: value
          })
        }), showIcon && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Position', 'jankx'),
          value: iconPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Inside Input', 'jankx'),
            value: 'inside'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Outside Input', 'jankx'),
            value: 'outside'
          }],
          onChange: value => setAttributes({
            iconPosition: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button Position', 'jankx'),
          value: buttonPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Inside Input', 'jankx'),
            value: 'inside'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Outside Input', 'jankx'),
            value: 'outside'
          }],
          onChange: value => setAttributes({
            buttonPosition: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search button will always appear at the end of the layout', 'jankx')
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "smart-search-form-wrapper",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
          className: "smart-search-form",
          method: "get",
          children: [showLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
            className: "search-label",
            children: labelText
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: `search-input-wrapper ${iconPosition === 'inside' ? 'icon-inside' : 'icon-outside'} ${buttonPosition === 'inside' ? 'button-inside' : 'button-outside'}`,
            children: [showIcon && iconPosition === 'outside' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "search-icon-outside",
              children: "\uD83D\uDD0D"
            }), (showPostTypeFilter || showTaxonomyFilter) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "search-filters-wrapper",
              children: [showPostTypeFilter && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("select", {
                className: "post-type-filter",
                disabled: true,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All Post Types', 'jankx')
                }), postTypes.length > 0 && postTypes.map(postType => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                  value: postType,
                  children: postType
                }, postType))]
              }), showTaxonomyFilter && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("select", {
                className: "taxonomy-filter",
                disabled: true,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All Taxonomies', 'jankx')
                }), taxonomies.length > 0 && taxonomies.map(taxonomy => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                  value: taxonomy,
                  children: taxonomy
                }, taxonomy))]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "search-input-inner",
              children: [showIcon && iconPosition === 'inside' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "search-icon-inside",
                children: "\uD83D\uDD0D"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                type: "text",
                className: "search-input",
                placeholder: placeholder,
                disabled: true
              }), buttonPosition === 'inside' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                type: "submit",
                className: "search-button",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search', 'jankx')
              })]
            }), buttonPosition === 'outside' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
              type: "submit",
              className: "search-button",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search', 'jankx')
            })]
          })]
        })
      })
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/smart-search/save.tsx":
/*!**************************************!*\
  !*** ./blocks/smart-search/save.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


/**
 * The save function for the Smart Search Block.
 * Since this block is rendered entirely by JavaScript on the frontend,
 * we only save a wrapper div with data attributes.
 */
function Save(props) {
  const {
    placeholder,
    showPostTypeFilter,
    postTypes,
    showTaxonomyFilter,
    taxonomies,
    enableAutoSuggestion,
    showPosts,
    showPostTypes,
    showUsers,
    showTaxonomy,
    showTags,
    suggestionLimit,
    iconPosition,
    showIcon,
    showLabel,
    labelText,
    buttonPosition,
    searchUrl
  } = props.attributes;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: 'wp-block-jankx-smart-search'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    "data-placeholder": placeholder,
    "data-show-post-type-filter": showPostTypeFilter ? 'true' : 'false',
    "data-post-types": JSON.stringify(postTypes),
    "data-show-taxonomy-filter": showTaxonomyFilter ? 'true' : 'false',
    "data-taxonomies": JSON.stringify(taxonomies),
    "data-enable-auto-suggestion": enableAutoSuggestion ? 'true' : 'false',
    "data-show-posts": showPosts ? 'true' : 'false',
    "data-show-post-types": showPostTypes ? 'true' : 'false',
    "data-show-users": showUsers ? 'true' : 'false',
    "data-show-taxonomy": showTaxonomy ? 'true' : 'false',
    "data-show-tags": showTags ? 'true' : 'false',
    "data-suggestion-limit": suggestionLimit,
    "data-icon-position": iconPosition,
    "data-show-icon": showIcon ? 'true' : 'false',
    "data-show-label": showLabel ? 'true' : 'false',
    "data-label-text": labelText,
    "data-button-position": buttonPosition,
    "data-search-url": searchUrl || ''
  });
}

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/search.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/search.js ***!
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


const search = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (search);

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
/*!***************************************!*\
  !*** ./blocks/smart-search/index.tsx ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/search.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/smart-search/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/smart-search/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/smart-search/block.json");
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */



const settings = {
  ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
  example: {
    attributes: {
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search...', 'jankx'),
      enableAutoSuggestion: true
    }
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
};

/**
 * Register the Smart Search Block.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, settings);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map