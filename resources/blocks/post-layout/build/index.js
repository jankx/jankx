/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/post-layout/components/DisplayOptions.js":
/*!*********************************************************!*\
  !*** ./blocks/post-layout/components/DisplayOptions.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayOptions)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function DisplayOptions({
  attributes,
  onUpdate
}) {
  const {
    useDefaultQuery,
    displayOptions,
    pagination
  } = attributes;

  // Guard against undefined nested fields
  const safeMetaFields = Array.isArray(displayOptions?.metaFields) ? displayOptions.metaFields : [];
  const updateDisplayOptions = updates => {
    onUpdate('displayOptions', {
      ...displayOptions,
      ...updates
    });
  };
  const updatePagination = updates => {
    onUpdate('pagination', {
      ...pagination,
      ...updates
    });
  };
  const metaFieldOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
    value: 'date'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Author', 'jankx'),
    value: 'author'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Categories', 'jankx'),
    value: 'categories'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tags', 'jankx'),
    value: 'tags'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Comments Count', 'jankx'),
    value: 'comments'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reading Time', 'jankx'),
    value: 'reading_time'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Fields', 'jankx'),
    value: 'custom_fields'
  }];
  const updateMetaFields = (field, checked) => {
    const currentFields = Array.isArray(displayOptions?.metaFields) ? [...displayOptions.metaFields] : [];
    if (checked && !currentFields.includes(field)) {
      currentFields.push(field);
    } else if (!checked && currentFields.includes(field)) {
      currentFields.splice(currentFields.indexOf(field), 1);
    }
    updateDisplayOptions({
      metaFields: currentFields
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "jankx-display-options",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Display', 'jankx'),
      initialOpen: true,
      children: [useDefaultQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "jankx-default-query-info",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display options are limited when using default page query. Some options may not be available.', 'jankx')
        })
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Title', 'jankx'),
        checked: !!displayOptions.showTitle,
        onChange: value => updateDisplayOptions({
          showTitle: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the post title', 'jankx'),
        disabled: useDefaultQuery
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Excerpt', 'jankx'),
        checked: !!displayOptions.showExcerpt,
        onChange: value => updateDisplayOptions({
          showExcerpt: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the post excerpt or content preview', 'jankx'),
        disabled: useDefaultQuery
      }), displayOptions.showExcerpt && !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Excerpt Length', 'jankx'),
        value: displayOptions.excerptLength || 10,
        onChange: value => updateDisplayOptions({
          excerptLength: value
        }),
        min: 10,
        max: 100,
        step: 5,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of words to show in excerpt', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Meta Information', 'jankx'),
        checked: !!displayOptions.showMeta,
        onChange: value => updateDisplayOptions({
          showMeta: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display post metadata (date, author, categories, etc.)', 'jankx'),
        disabled: useDefaultQuery
      }), displayOptions.showMeta && !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "jankx-meta-fields",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Fields to Display', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select which meta information to show for each post', 'jankx')
        }), metaFieldOptions.map(field => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CheckboxControl, {
          label: field.label,
          checked: safeMetaFields.includes(field.value),
          onChange: checked => updateMetaFields(field.value, checked)
        }, field.value))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Featured Image', 'jankx'),
        checked: !!displayOptions.showThumbnail,
        onChange: value => updateDisplayOptions({
          showThumbnail: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the post featured image', 'jankx'),
        disabled: useDefaultQuery
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Read More Link', 'jankx'),
        checked: !!displayOptions.showReadMore,
        onChange: value => updateDisplayOptions({
          showReadMore: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display a "Read More" link to the full post', 'jankx'),
        disabled: useDefaultQuery
      })]
    }), !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Behavior', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "jankx-content-behavior",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Truncation', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Control how content is displayed when it exceeds the available space', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "jankx-truncation-options",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Smart Truncation', 'jankx'),
            checked: !!displayOptions.smartTruncation,
            onChange: value => updateDisplayOptions({
              smartTruncation: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Intelligently truncate content at word boundaries', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preserve HTML', 'jankx'),
            checked: !!displayOptions.preserveHTML,
            onChange: value => updateDisplayOptions({
              preserveHTML: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Keep HTML formatting when truncating content', 'jankx')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "jankx-content-linking",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Linking', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Control how users navigate to full content', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Entire Card', 'jankx'),
          checked: !!displayOptions.linkEntireCard,
          onChange: value => updateDisplayOptions({
            linkEntireCard: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Make the entire post card clickable', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open in New Tab', 'jankx'),
          checked: !!displayOptions.openInNewTab,
          onChange: value => updateDisplayOptions({
            openInNewTab: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open posts in a new browser tab', 'jankx')
        })]
      })]
    }), !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Accessibility', 'jankx'),
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "jankx-accessibility",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Screen Reader Support', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Improve accessibility for users with screen readers', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ARIA Labels', 'jankx'),
          checked: !!displayOptions.ariaLabels,
          onChange: value => updateDisplayOptions({
            ariaLabels: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add ARIA labels for better screen reader support', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Skip Links', 'jankx'),
          checked: !!displayOptions.skipLinks,
          onChange: value => updateDisplayOptions({
            skipLinks: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add skip links for keyboard navigation', 'jankx')
        })]
      })
    }), !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination Settings', 'jankx'),
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "jankx-pagination-settings",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Pagination', 'jankx'),
          checked: !!pagination?.enabled,
          onChange: value => updatePagination({
            enabled: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show pagination controls for navigation between pages', 'jankx')
        }), pagination?.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination Type', 'jankx'),
            value: pagination?.type || 'numbers',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Numbers', 'jankx'),
              value: 'numbers'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous/Next', 'jankx'),
              value: 'prev_next'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load More', 'jankx'),
              value: 'load_more'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Infinite Scroll', 'jankx'),
              value: 'infinite'
            }],
            onChange: value => updatePagination({
              type: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose the type of pagination to display', 'jankx')
          }), pagination?.type === 'numbers' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max Page Numbers', 'jankx'),
              value: pagination?.maxNumbers || 10,
              onChange: value => updatePagination({
                maxNumbers: value
              }),
              min: 3,
              max: 20,
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum number of page numbers to show', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show First/Last', 'jankx'),
              checked: !!pagination?.showFirstLast,
              onChange: value => updatePagination({
                showFirstLast: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show first and last page buttons', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Ellipsis', 'jankx'),
              checked: !!pagination?.showEllipsis,
              onChange: value => updatePagination({
                showEllipsis: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show ellipsis (...) for hidden pages', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Current Page', 'jankx'),
              checked: !!pagination?.showCurrentPage,
              onChange: value => updatePagination({
                showCurrentPage: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Highlight the current page number', 'jankx')
            })]
          }), (pagination?.type === 'prev_next' || pagination?.type === 'numbers') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous Text', 'jankx'),
              value: pagination?.prevText || 'Previous',
              onChange: value => updatePagination({
                prevText: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text for previous page button', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next Text', 'jankx'),
              value: pagination?.nextText || 'Next',
              onChange: value => updatePagination({
                nextText: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text for next page button', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Icons', 'jankx'),
              checked: !!pagination?.showIcons,
              onChange: value => updatePagination({
                showIcons: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show arrow icons on navigation buttons', 'jankx')
            })]
          }), (pagination?.type === 'load_more' || pagination?.type === 'infinite') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load More Text', 'jankx'),
              value: pagination?.loadMoreText || 'Load More',
              onChange: value => updatePagination({
                loadMoreText: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text for load more button', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading Text', 'jankx'),
              value: pagination?.loadingText || 'Loading...',
              onChange: value => updatePagination({
                loadingText: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text shown while loading', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No More Text', 'jankx'),
              value: pagination?.noMoreText || 'No More Posts',
              onChange: value => updatePagination({
                noMoreText: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text shown when all posts are loaded', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts Per Load', 'jankx'),
              value: pagination?.postsPerLoad || 6,
              onChange: value => updatePagination({
                postsPerLoad: value
              }),
              min: 1,
              max: 50,
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of posts to load each time', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Spinner', 'jankx'),
              checked: !!pagination?.showSpinner,
              onChange: value => updatePagination({
                showSpinner: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show loading spinner', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide When Complete', 'jankx'),
              checked: !!pagination?.hideWhenComplete,
              onChange: value => updatePagination({
                hideWhenComplete: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide button when all posts are loaded', 'jankx')
            })]
          }), pagination?.type === 'infinite' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trigger Distance', 'jankx'),
              value: pagination?.triggerDistance || 100,
              onChange: value => updatePagination({
                triggerDistance: value
              }),
              min: 50,
              max: 500,
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Distance from bottom to trigger loading (px)', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Loading Indicator', 'jankx'),
              checked: !!pagination?.showLoadingIndicator,
              onChange: value => updatePagination({
                showLoadingIndicator: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show loading indicator during infinite scroll', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Back to Top', 'jankx'),
              checked: !!pagination?.showBackToTop,
              onChange: value => updatePagination({
                showBackToTop: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show back to top button after loading', 'jankx')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "jankx-pagination-advanced",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h5", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Options', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('AJAX Pagination', 'jankx'),
              checked: !!pagination?.ajax,
              onChange: value => updatePagination({
                ajax: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load pages without refreshing the browser', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Update URL', 'jankx'),
              checked: !!pagination?.updateURL,
              onChange: value => updatePagination({
                updateURL: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Update browser URL when navigating pages', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scroll to Top', 'jankx'),
              checked: !!pagination?.scrollToTop,
              onChange: value => updatePagination({
                scrollToTop: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scroll to top when changing pages', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Keyboard Navigation', 'jankx'),
              checked: !!pagination?.keyboardNav,
              onChange: value => updatePagination({
                keyboardNav: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Allow keyboard navigation (arrow keys)', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Touch Support', 'jankx'),
              checked: !!pagination?.touchSupport,
              onChange: value => updatePagination({
                touchSupport: value
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable touch/swipe navigation', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Duration', 'jankx'),
              value: pagination?.animationDuration || 300,
              onChange: value => updatePagination({
                animationDuration: value
              }),
              min: 100,
              max: 1000,
              step: 50,
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation duration in milliseconds', 'jankx')
            })]
          })]
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/post-layout/components/FilterBuilder.js":
/*!********************************************************!*\
  !*** ./blocks/post-layout/components/FilterBuilder.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FilterBuilder)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);





function FilterBuilder({
  attributes,
  postType,
  taxonomies,
  onUpdate
}) {
  const {
    useDefaultQuery,
    taxonomyFilters,
    metaFilters,
    presetFilters,
    customFilters
  } = attributes;
  const [activeFilterType, setActiveFilterType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('taxonomy');
  const [editingFilter, setEditingFilter] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const taxonomyOptions = taxonomies ? Object.values(taxonomies).filter(tax => tax.types.includes(postType)).map(tax => ({
    label: tax.labels.singular_name || tax.name,
    value: tax.slug
  })) : [];
  const presetFilterOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured Posts', 'jankx'),
    value: 'featured'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Popular Posts', 'jankx'),
    value: 'popular'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recent Posts', 'jankx'),
    value: 'recent'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trending Posts', 'jankx'),
    value: 'trending'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Editor Picks', 'jankx'),
    value: 'editor_picks'
  }];
  const addTaxonomyFilter = () => {
    const newFilter = {
      id: `tax_${Date.now()}`,
      taxonomy: '',
      terms: [],
      operator: 'IN',
      includeChildren: true
    };
    const updated = {
      ...taxonomyFilters,
      [newFilter.id]: newFilter
    };
    onUpdate('taxonomyFilters', updated);
  };
  const updateTaxonomyFilter = (filterId, updates) => {
    const updated = {
      ...taxonomyFilters,
      [filterId]: {
        ...taxonomyFilters[filterId],
        ...updates
      }
    };
    onUpdate('taxonomyFilters', updated);
  };
  const removeTaxonomyFilter = filterId => {
    const {
      [filterId]: removed,
      ...remaining
    } = taxonomyFilters;
    onUpdate('taxonomyFilters', remaining);
  };
  const addMetaFilter = () => {
    const newFilter = {
      id: `meta_${Date.now()}`,
      key: '',
      value: '',
      compare: '=',
      type: 'CHAR'
    };
    const updated = {
      ...metaFilters,
      [newFilter.id]: newFilter
    };
    onUpdate('metaFilters', updated);
  };
  const updateMetaFilter = (filterId, updates) => {
    const updated = {
      ...metaFilters,
      [filterId]: {
        ...metaFilters[filterId],
        ...updates
      }
    };
    onUpdate('metaFilters', updated);
  };
  const removeMetaFilter = filterId => {
    const {
      [filterId]: removed,
      ...remaining
    } = metaFilters;
    onUpdate('metaFilters', remaining);
  };
  const addPresetFilter = preset => {
    if (!presetFilters.includes(preset)) {
      onUpdate('presetFilters', [...presetFilters, preset]);
    }
  };
  const removePresetFilter = preset => {
    onUpdate('presetFilters', presetFilters.filter(p => p !== preset));
  };
  const addCustomFilter = () => {
    const newFilter = {
      id: `custom_${Date.now()}`,
      name: '',
      callback: '',
      parameters: {}
    };
    const updated = {
      ...customFilters,
      [newFilter.id]: newFilter
    };
    onUpdate('customFilters', updated);
  };
  const updateCustomFilter = (filterId, updates) => {
    const updated = {
      ...customFilters,
      [filterId]: {
        ...customFilters[filterId],
        ...updates
      }
    };
    onUpdate('customFilters', updated);
  };
  const removeCustomFilter = filterId => {
    const {
      [filterId]: removed,
      ...remaining
    } = customFilters;
    onUpdate('customFilters', remaining);
  };
  const renderTaxonomyFilter = (filterId, filter) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "jankx-filter-item",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "jankx-filter-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy', 'jankx'),
        value: filter.taxonomy,
        options: taxonomyOptions,
        onChange: value => updateTaxonomyFilter(filterId, {
          taxonomy: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Filter', 'jankx'),
        onClick: () => removeTaxonomyFilter(filterId),
        isDestructive: true,
        small: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Terms (comma-separated)', 'jankx'),
      value: filter.terms.join(', '),
      onChange: value => updateTaxonomyFilter(filterId, {
        terms: value.split(',').map(term => term.trim()).filter(Boolean)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Operator', 'jankx'),
      value: filter.operator,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('In', 'jankx'),
        value: 'IN'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not In', 'jankx'),
        value: 'NOT IN'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('And', 'jankx'),
        value: 'AND'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exists', 'jankx'),
        value: 'EXISTS'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not Exists', 'jankx'),
        value: 'NOT EXISTS'
      }],
      onChange: value => updateTaxonomyFilter(filterId, {
        operator: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include Children', 'jankx'),
      checked: filter.includeChildren,
      onChange: value => updateTaxonomyFilter(filterId, {
        includeChildren: value
      })
    })]
  }, filterId);
  const renderMetaFilter = (filterId, filter) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "jankx-filter-item",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "jankx-filter-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
        value: filter.key,
        onChange: value => updateMetaFilter(filterId, {
          key: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Filter', 'jankx'),
        onClick: () => removeMetaFilter(filterId),
        isDestructive: true,
        small: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Value', 'jankx'),
      value: filter.value,
      onChange: value => updateMetaFilter(filterId, {
        value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Compare', 'jankx'),
      value: filter.compare,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Equals', 'jankx'),
        value: '='
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not Equals', 'jankx'),
        value: '!='
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Greater Than', 'jankx'),
        value: '>'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Greater Than or Equal', 'jankx'),
        value: '>='
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Less Than', 'jankx'),
        value: '<'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Less Than or Equal', 'jankx'),
        value: '<='
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Like', 'jankx'),
        value: 'LIKE'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not Like', 'jankx'),
        value: 'NOT LIKE'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exists', 'jankx'),
        value: 'EXISTS'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not Exists', 'jankx'),
        value: 'NOT EXISTS'
      }],
      onChange: value => updateMetaFilter(filterId, {
        compare: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Value Type', 'jankx'),
      value: filter.type,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('String', 'jankx'),
        value: 'CHAR'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number', 'jankx'),
        value: 'NUMERIC'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
        value: 'DATE'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time', 'jankx'),
        value: 'TIME'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('DateTime', 'jankx'),
        value: 'DATETIME'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Binary', 'jankx'),
        value: 'BINARY'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Decimal', 'jankx'),
        value: 'DECIMAL'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Signed', 'jankx'),
        value: 'SIGNED'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unsigned', 'jankx'),
        value: 'UNSIGNED'
      }],
      onChange: value => updateMetaFilter(filterId, {
        type: value
      })
    })]
  }, filterId);
  const renderCustomFilter = (filterId, filter) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "jankx-filter-item",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "jankx-filter-header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter Name', 'jankx'),
        value: filter.name,
        onChange: value => updateCustomFilter(filterId, {
          name: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Filter', 'jankx'),
        onClick: () => removeCustomFilter(filterId),
        isDestructive: true,
        small: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Callback Function', 'jankx'),
      value: filter.callback,
      onChange: value => updateCustomFilter(filterId, {
        callback: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Name of the registered filter function', 'jankx')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Parameters (JSON)', 'jankx'),
      value: JSON.stringify(filter.parameters, null, 2),
      onChange: value => {
        try {
          const parsed = JSON.parse(value);
          updateCustomFilter(filterId, {
            parameters: parsed
          });
        } catch (e) {
          // Invalid JSON, ignore
        }
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('JSON object with filter parameters', 'jankx')
    })]
  }, filterId);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    className: "jankx-filter-builder",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter Builder', 'jankx'),
      initialOpen: true,
      children: useDefaultQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "jankx-default-query-info",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filters are disabled when using default page query. Switch to custom query to enable filtering options.', 'jankx')
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, {
          className: "jankx-filter-type-selector",
          children: [{
            key: 'taxonomy',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy', 'jankx')
          }, {
            key: 'meta',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta', 'jankx')
          }, {
            key: 'preset',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preset', 'jankx')
          }, {
            key: 'custom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'jankx')
          }].map(({
            key,
            label
          }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isPrimary: activeFilterType === key,
            onClick: () => setActiveFilterType(key),
            children: label
          }, key))
        }), activeFilterType === 'taxonomy' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jankx-filter-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jankx-filter-section-header",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy Filters', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Taxonomy Filter', 'jankx'),
              onClick: addTaxonomyFilter,
              isPrimary: true,
              small: true
            })]
          }), Object.entries(taxonomyFilters).map(([filterId, filter]) => renderTaxonomyFilter(filterId, filter)), Object.keys(taxonomyFilters).length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            className: "jankx-no-filters",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No taxonomy filters added yet.', 'jankx')
          })]
        }), activeFilterType === 'meta' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jankx-filter-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jankx-filter-section-header",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Filters', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Meta Filter', 'jankx'),
              onClick: addMetaFilter,
              isPrimary: true,
              small: true
            })]
          }), Object.entries(metaFilters).map(([filterId, filter]) => renderMetaFilter(filterId, filter)), Object.keys(metaFilters).length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            className: "jankx-no-filters",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No meta filters added yet.', 'jankx')
          })]
        }), activeFilterType === 'preset' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jankx-filter-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Preset Filters', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            className: "jankx-filter-help",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select from predefined filter presets', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "jankx-preset-filters",
            children: presetFilterOptions.map(preset => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
              label: preset.label,
              checked: presetFilters.includes(preset.value),
              onChange: checked => {
                if (checked) {
                  addPresetFilter(preset.value);
                } else {
                  removePresetFilter(preset.value);
                }
              }
            }, preset.value))
          })]
        }), activeFilterType === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "jankx-filter-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "jankx-filter-section-header",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h4", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Filters', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Custom Filter', 'jankx'),
              onClick: addCustomFilter,
              isPrimary: true,
              small: true
            })]
          }), Object.entries(customFilters).map(([filterId, filter]) => renderCustomFilter(filterId, filter)), Object.keys(customFilters).length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            className: "jankx-no-filters",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No custom filters added yet.', 'jankx')
          })]
        })]
      })
    })
  });
}

/***/ }),

/***/ "./blocks/post-layout/components/QueryControls.js":
/*!********************************************************!*\
  !*** ./blocks/post-layout/components/QueryControls.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryControls)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function QueryControls({
  attributes,
  postTypes,
  onUpdate
}) {
  const {
    useDefaultQuery,
    postType,
    postsPerPage,
    orderBy,
    order,
    offset,
    exclude,
    include
  } = attributes;
  const postTypeOptions = postTypes ? Object.values(postTypes).map(type => ({
    label: type.labels.singular_name || type.name,
    value: type.slug
  })) : [];
  const orderByOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
    value: 'date'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'jankx'),
    value: 'title'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('ID', 'jankx'),
    value: 'ID'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Author', 'jankx'),
    value: 'author'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modified', 'jankx'),
    value: 'modified'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Comment Count', 'jankx'),
    value: 'comment_count'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Menu Order', 'jankx'),
    value: 'menu_order'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Random', 'jankx'),
    value: 'rand'
  }];
  const orderOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Descending', 'jankx'),
    value: 'DESC'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ascending', 'jankx'),
    value: 'ASC'
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Settings', 'jankx'),
    initialOpen: true,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use Default Page Query', 'jankx'),
      checked: !!useDefaultQuery,
      onChange: value => onUpdate('useDefaultQuery', value),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use the default query from the current page instead of custom query', 'jankx')
    }), !useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
        value: postType,
        options: postTypeOptions,
        onChange: value => onUpdate('postType', value),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select the post type to display', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts Per Page', 'jankx'),
        value: postsPerPage,
        onChange: value => onUpdate('postsPerPage', value),
        min: 1,
        max: 100,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of posts to display per page', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order By', 'jankx'),
        value: orderBy,
        options: orderByOptions,
        onChange: value => onUpdate('orderBy', value),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort posts by this field', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order', 'jankx'),
        value: order,
        options: orderOptions,
        onChange: value => onUpdate('order', value),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort order (ascending or descending)', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'jankx'),
        value: offset,
        onChange: value => onUpdate('offset', value),
        min: 0,
        max: 1000,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of posts to skip', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include Posts', 'jankx'),
        value: include.join(', '),
        onChange: value => onUpdate('include', value.split(',').map(id => id.trim()).filter(Boolean)),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Comma-separated list of post IDs to include', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude Posts', 'jankx'),
        value: exclude.join(', '),
        onChange: value => onUpdate('exclude', value.split(',').map(id => id.trim()).filter(Boolean)),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Comma-separated list of post IDs to exclude', 'jankx')
      })]
    }), useDefaultQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "jankx-default-query-info",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        className: "jankx-help-text",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This block will use the default query from the current page. Custom query settings are disabled.', 'jankx')
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/post-layout/components/StylingControls.js":
/*!**********************************************************!*\
  !*** ./blocks/post-layout/components/StylingControls.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StylingControls)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/mobile.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/tablet.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);




function StylingControls({
  styling,
  responsive,
  onUpdate
}) {
  const updateStyling = updates => {
    onUpdate('styling', {
      ...styling,
      ...updates
    });
  };
  const updateResponsive = updates => {
    onUpdate('responsive', {
      ...responsive,
      ...updates
    });
  };

  // Sử dụng biến từ PHP thay vì array cố định
  const getViewTypeOptions = () => {
    // Kiểm tra xem biến từ PHP có tồn tại trên window object không
    if (typeof window.jankxSupportedPostLayouts !== 'undefined' && window.jankxSupportedPostLayouts) {
      // Chuyển đổi object thành array format cho SelectControl
      return Object.entries(window.jankxSupportedPostLayouts).map(([value, label]) => ({
        label: label,
        value: value
      }));
    }

    // Fallback nếu biến không tồn tại
    return [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grid', 'jankx'),
      value: 'grid'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List', 'jankx'),
      value: 'list'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Card', 'jankx'),
      value: 'card'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Carousel', 'jankx'),
      value: 'carousel'
    }];
  };
  const viewTypeOptions = getViewTypeOptions();
  const hoverEffectOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
    value: 'none'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lift', 'jankx'),
    value: 'lift'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scale', 'jankx'),
    value: 'scale'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Glow', 'jankx'),
    value: 'glow'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide', 'jankx'),
    value: 'slide'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rotate', 'jankx'),
    value: 'rotate'
  }];
  const shadowOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
    value: 'none'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Small', 'jankx'),
    value: 'small'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Medium', 'jankx'),
    value: 'medium'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Large', 'jankx'),
    value: 'large'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Extra Large', 'jankx'),
    value: 'xl'
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "jankx-styling-controls",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Styling', 'jankx'),
      initialOpen: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('View Type', 'jankx'),
        value: styling.viewType,
        options: viewTypeOptions,
        onChange: value => updateStyling({
          viewType: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose the layout type for displaying posts', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hover Effect', 'jankx'),
        value: styling.hoverEffect,
        options: hoverEffectOptions,
        onChange: value => updateStyling({
          hoverEffect: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation effect when hovering over cards', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx'),
        value: styling.borderRadius,
        onChange: value => updateStyling({
          borderRadius: value
        }),
        min: 0,
        max: 50,
        step: 1,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Corner roundness for cards (in pixels)', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow', 'jankx'),
        value: styling.shadow,
        options: shadowOptions,
        onChange: value => updateStyling({
          shadow: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow depth for cards', 'jankx')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Responsive Controls', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Responsive Controls', 'jankx'),
        checked: responsive.enabled,
        onChange: value => updateResponsive({
          enabled: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Allow different styling for different screen sizes', 'jankx')
      }), responsive.enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "jankx-responsive-settings",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "jankx-responsive-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h5", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop (≥1024px)', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "jankx-help-text",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default styling for large screens', 'jankx')
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "jankx-responsive-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h5", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tablet (≤768px)', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "jankx-help-text",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styling adjustments for medium screens', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "jankx-responsive-controls",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "jankx-responsive-control",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "jankx-responsive-label",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"].icon, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx')
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
                value: styling.borderRadiusTablet || styling.borderRadius,
                onChange: value => updateStyling({
                  borderRadiusTablet: value
                }),
                min: 0,
                max: 40,
                step: 1
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "jankx-responsive-control",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "jankx-responsive-label",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"].icon, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow', 'jankx')
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
                value: styling.shadowTablet || styling.shadow,
                options: shadowOptions,
                onChange: value => updateStyling({
                  shadowTablet: value
                })
              })]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "jankx-responsive-section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h5", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mobile (≤480px)', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
            className: "jankx-help-text",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styling adjustments for small screens', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "jankx-responsive-controls",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "jankx-responsive-control",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "jankx-responsive-label",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"].icon, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx')
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
                value: styling.borderRadiusMobile || styling.borderRadius,
                onChange: value => updateStyling({
                  borderRadiusMobile: value
                }),
                min: 0,
                max: 30,
                step: 1
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "jankx-responsive-control",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
                className: "jankx-responsive-label",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"].icon, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Shadow', 'jankx')
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
                value: styling.shadowMobile || styling.shadow,
                options: shadowOptions,
                onChange: value => updateStyling({
                  shadowMobile: value
                })
              })]
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Styling', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "jankx-advanced-styling",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Settings', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Control how elements animate and transition', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Animations', 'jankx'),
          checked: styling.enableAnimations || false,
          onChange: value => updateStyling({
            enableAnimations: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add smooth animations to card interactions', 'jankx')
        }), styling.enableAnimations && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Duration', 'jankx'),
          value: styling.animationDuration || 300,
          onChange: value => updateStyling({
            animationDuration: value
          }),
          min: 100,
          max: 1000,
          step: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation speed in milliseconds', 'jankx')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "jankx-performance",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h5", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Performance Options', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "jankx-help-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Optimize rendering performance', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lazy Loading', 'jankx'),
          checked: styling.lazyLoading || false,
          onChange: value => updateStyling({
            lazyLoading: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load images only when they come into view', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CSS Containment', 'jankx'),
          checked: styling.cssContainment || false,
          onChange: value => updateStyling({
            cssContainment: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Improve rendering performance with CSS containment', 'jankx')
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/mobile.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/mobile.js ***!
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


const mobile = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mobile);

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

/***/ "./node_modules/@wordpress/icons/build-module/library/tablet.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/tablet.js ***!
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


const tablet = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tablet);

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
/*!**************************************!*\
  !*** ./blocks/post-layout/index.tsx ***!
  \**************************************/
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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_QueryControls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/QueryControls */ "./blocks/post-layout/components/QueryControls.js");
/* harmony import */ var _components_FilterBuilder__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/FilterBuilder */ "./blocks/post-layout/components/FilterBuilder.js");
/* harmony import */ var _components_DisplayOptions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/DisplayOptions */ "./blocks/post-layout/components/DisplayOptions.js");
/* harmony import */ var _components_StylingControls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/StylingControls */ "./blocks/post-layout/components/StylingControls.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);












// Removed ALLOWED_BLOCKS and TEMPLATE - using display options instead

function PreviewContent({
  attributes,
  isPreview = false
}) {
  const [content, setContent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const {
    postType,
    postsPerPage,
    orderBy,
    order,
    offset,
    exclude,
    include,
    taxonomyFilters,
    metaFilters,
    layout,
    displayOptions
  } = attributes;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const fetchPreview = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          action: 'jankx-post-layout-fetch-data',
          post_type: postType || 'post',
          engine_id: 'jankx',
          layout: layout?.type || 'grid',
          posts_per_page: String(postsPerPage || 6),
          order_by: orderBy || 'date',
          order: order || 'DESC',
          offset: String(offset || 0)
        });

        // Add filters if present
        if (taxonomyFilters && Object.keys(taxonomyFilters).length > 0) {
          params.append('taxonomy_filters', JSON.stringify(taxonomyFilters));
        }
        if (metaFilters && Object.keys(metaFilters).length > 0) {
          params.append('meta_filters', JSON.stringify(metaFilters));
        }
        if (include && include.length > 0) {
          params.append('include', JSON.stringify(include));
        }
        if (exclude && exclude.length > 0) {
          params.append('exclude', JSON.stringify(exclude));
        }
        const response = await fetch(`${window.ajaxurl}?${params.toString()}`);
        const data = await response.json();
        if (data.success && data.data && data.data.content) {
          setContent(data.data.content);
        } else {
          setError(data.data || 'Failed to load preview');
        }
      } catch (err) {
        setError('Error fetching preview: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [postType, postsPerPage, orderBy, order, offset, exclude, include, taxonomyFilters, metaFilters, layout]);
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "jankx-post-layout-preview-loading",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: "jankx-post-layout-preview-loading__spinner"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
        children: "\u0110ang t\u1EA3i preview..."
      })]
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "jankx-post-layout-preview-error",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("p", {
        children: ["L\u1ED7i preview: ", error]
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
    className: "jankx-post-layout-preview",
    dangerouslySetInnerHTML: {
      __html: content
    }
  });
}
function Edit({
  attributes,
  setAttributes
}) {
  const {
    useDefaultQuery,
    postType,
    postsPerPage,
    orderBy,
    order,
    offset,
    exclude,
    include,
    taxonomyFilters,
    metaFilters,
    presetFilters,
    customFilters,
    displayOptions,
    pagination,
    styling,
    responsive
  } = attributes;
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('query');
  const [previewHtml, setPreviewHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [isLoadingPreview, setIsLoadingPreview] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [fetchInfo, setFetchInfo] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)({});
  const {
    postTypes,
    taxonomies
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
    const {
      getPostTypes,
      getTaxonomies
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_6__.store);
    return {
      postTypes: getPostTypes({
        per_page: -1
      }) || [],
      taxonomies: getTaxonomies({
        per_page: -1
      }) || []
    };
  }, []);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: 'jankx-post-layout'
  });
  const updateAttribute = (key, value) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAttributes({
      [key]: value
    });
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'query':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_QueryControls__WEBPACK_IMPORTED_MODULE_7__["default"], {
          attributes: {
            useDefaultQuery,
            postType,
            postsPerPage,
            orderBy,
            order,
            offset,
            exclude,
            include
          },
          postTypes: postTypes,
          onUpdate: updateAttribute
        });
      case 'filters':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_FilterBuilder__WEBPACK_IMPORTED_MODULE_8__["default"], {
          attributes: {
            useDefaultQuery,
            taxonomyFilters,
            metaFilters,
            presetFilters,
            customFilters
          },
          postType: postType,
          taxonomies: taxonomies,
          onUpdate: updateAttribute
        });
      case 'display':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_DisplayOptions__WEBPACK_IMPORTED_MODULE_9__["default"], {
          attributes: {
            useDefaultQuery,
            displayOptions,
            pagination
          },
          onUpdate: updateAttribute
        });
      case 'styling':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_StylingControls__WEBPACK_IMPORTED_MODULE_10__["default"], {
          styling: styling,
          responsive: responsive,
          onUpdate: updateAttribute
        });
      default:
        return null;
    }
  };

  // Editor-only: fetch HTML preview using PostsFetcher via admin-ajax
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const controller = new AbortController();
    const doFetch = async () => {
      try {
        setIsLoadingPreview(true);
        const params = new URLSearchParams({
          action: 'jankx-post-layout-fetch-data',
          use_default_query: useDefaultQuery ? '1' : '0',
          post_type: postType || 'post',
          // Jankx engine id is 'jankx'
          engine_id: 'jankx',
          layout: styling && typeof styling === 'object' && 'viewType' in styling ? styling.viewType : 'grid',
          posts_per_page: String(postsPerPage || 6),
          order_by: orderBy || 'date',
          order: order || 'DESC',
          offset: String(offset || 0)
        });

        // Only add custom query parameters if not using default query
        if (!useDefaultQuery) {
          // Add include/exclude posts if provided
          if (include && include.length > 0) {
            params.append('include', JSON.stringify(include));
          }
          if (exclude && exclude.length > 0) {
            params.append('exclude', JSON.stringify(exclude));
          }

          // Add taxonomy filters if provided
          if (taxonomyFilters && Object.keys(taxonomyFilters).length > 0) {
            params.append('taxonomy_filters', JSON.stringify(taxonomyFilters));
          }

          // Add meta filters if provided
          if (metaFilters && Object.keys(metaFilters).length > 0) {
            params.append('meta_filters', JSON.stringify(metaFilters));
          }
        }
        const ajaxUrl = window.ajaxurl || '/wp-admin/admin-ajax.php';
        const res = await fetch(`${ajaxUrl}?${params.toString()}`, {
          signal: controller.signal,
          credentials: 'same-origin'
        });
        const json = await res.json();
        if (json && json.success && json.data && typeof json.data.content === 'string') {
          setPreviewHtml(json.data.content);
          // Update fetch info from response
          if (json.data.query_info) {
            setFetchInfo({
              totalPosts: json.data.query_info.total_posts || 0,
              foundPosts: json.data.query_info.found_posts || 0,
              maxPages: json.data.query_info.max_pages || 0
            });
          }
        } else {
          setPreviewHtml('<div class="jankx-post-layout__empty">No content</div>');
          setFetchInfo({});
        }
      } catch (e) {
        if (!e?.name || e.name !== 'AbortError') {
          setPreviewHtml('<div class="jankx-post-layout__error">Failed to load preview</div>');
        }
      } finally {
        setIsLoadingPreview(false);
      }
    };
    doFetch();
    return () => controller.abort();
    // Re-fetch when key attributes affecting query/layout change
  }, [useDefaultQuery, postType, postsPerPage, orderBy, order, offset, include, exclude, taxonomyFilters, metaFilters, styling]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(PreviewContent, {
        attributes: attributes,
        isPreview: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "jankx-post-layout__inspector",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          className: "jankx-post-layout__tabs",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ButtonGroup, {
            className: "jankx-post-layout__tab-buttons",
            children: [{
              key: 'query',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query', 'jankx'),
              icon: 'search'
            }, {
              key: 'filters',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filters', 'jankx'),
              icon: 'filter'
            }, {
              key: 'display',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display', 'jankx'),
              icon: 'visibility'
            }, {
              key: 'styling',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styling', 'jankx'),
              icon: 'admin-appearance'
            }].map(({
              key,
              label,
              icon
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
              isPrimary: activeTab === key,
              onClick: () => setActiveTab(key)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ,
              icon: icon,
              label: label,
              children: label
            }, key))
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          className: "jankx-post-layout__tab-content",
          children: renderTabContent()
        })]
      })
    })]
  });
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('jankx/post-layout', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Layout', 'jankx'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A Post Layout block for displaying posts with advanced filtering and layout options', 'jankx'),
  category: 'jankx',
  icon: 'grid-view',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('collection', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('posts', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('query', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('filter', 'jankx'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('layout', 'jankx')],
  supports: {
    html: false,
    align: ['wide', 'full'],
    customClassName: true,
    reusable: true
  },
  attributes: {
    useDefaultQuery: {
      type: 'boolean',
      default: false
    },
    postType: {
      type: 'string',
      default: 'post'
    },
    postsPerPage: {
      type: 'number',
      default: 6
    },
    orderBy: {
      type: 'string',
      default: 'date'
    },
    order: {
      type: 'string',
      default: 'DESC'
    },
    offset: {
      type: 'number',
      default: 0
    },
    exclude: {
      type: 'array',
      default: []
    },
    include: {
      type: 'array',
      default: []
    },
    taxonomyFilters: {
      type: 'object',
      default: {}
    },
    metaFilters: {
      type: 'object',
      default: {}
    },
    presetFilters: {
      type: 'array',
      default: []
    },
    customFilters: {
      type: 'array',
      default: []
    },
    displayOptions: {
      type: 'object',
      default: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showMeta: true
      }
    },
    pagination: {
      type: 'object',
      default: {
        enabled: true,
        type: 'numbers',
        maxNumbers: 10,
        showFirstLast: false,
        showEllipsis: true,
        showCurrentPage: true,
        ellipsisPosition: 'both',
        prevText: 'Previous',
        nextText: 'Next',
        showIcons: true,
        showPageInfo: false,
        loadMoreText: 'Load More',
        loadingText: 'Loading...',
        noMoreText: 'No More Posts',
        postsPerLoad: 6,
        showSpinner: true,
        hideWhenComplete: true,
        triggerDistance: 100,
        showLoadingIndicator: true,
        showBackToTop: false,
        loadingMessage: 'Loading more posts...',
        completeMessage: 'All posts loaded',
        ajax: false,
        updateURL: true,
        scrollToTop: false,
        showLoadingState: true,
        keyboardNav: false,
        touchSupport: false,
        animationDuration: 300
      }
    },
    styling: {
      type: 'object',
      default: {
        viewType: 'grid',
        hoverEffect: 'lift',
        borderRadius: 8,
        shadow: 'medium'
      }
    },
    responsive: {
      type: 'object',
      default: {
        mobile: true,
        tablet: true,
        desktop: true
      }
    }
  },
  edit: Edit,
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map