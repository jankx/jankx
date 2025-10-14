/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/table-of-content/block.json":
/*!********************************************!*\
  !*** ./blocks/table-of-content/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/table-of-content","version":"1.0.0","title":"Table of Contents","category":"widgets","icon":"list-view","keywords":["TOC","Table of Contents","Mục lục","Index"],"supports":{"align":["wide","full"],"html":false,"color":{"background":true,"text":true,"gradients":true,"link":true},"spacing":{"margin":true,"padding":true,"blockGap":true},"border":{"color":true,"radius":true,"style":true,"width":true},"background":{"backgroundImage":true,"backgroundPosition":true,"backgroundRepeat":true,"backgroundSize":true},"dimensions":{"minHeight":true},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true}},"description":"Hiển thị mục lục tự động từ các heading trong bài viết.","attributes":{"no_title":{"type":"boolean","default":false},"title_level":{"type":"integer","default":2},"title_text":{"type":"string"},"use_ol":{"type":"boolean","default":false},"remove_indent":{"type":"boolean","default":false},"add_smooth":{"type":"boolean","default":false},"use_absolute_urls":{"type":"boolean","default":false},"max_level":{"type":"integer","default":6},"min_level":{"type":"integer","default":1},"updated":{"type":"integer"},"accordion":{"type":"boolean","default":false},"hidden":{"type":"boolean","default":false},"wrapper":{"type":"boolean","default":false},"autoupdate":{"type":"boolean","default":true},"stylePreset":{"type":"string","default":"default"}},"textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","render":"file:./render.php"}');

/***/ }),

/***/ "./blocks/table-of-content/src/edit.js":
/*!*********************************************!*\
  !*** ./blocks/table-of-content/src/edit.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/format-indent.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/format-list-bullets.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/format-list-numbered.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/format-outdent.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/update.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _heading_level_dropdown__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./heading-level-dropdown */ "./blocks/table-of-content/src/heading-level-dropdown.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _style_presets__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./style-presets */ "./blocks/table-of-content/src/style-presets.js");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./editor.scss */ "./blocks/table-of-content/src/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);












// import './../assets/accordion.css'; // Commented out - file doesn't exist

function Edit({
  attributes,
  setAttributes
}) {
  const {
    hideTOC,
    hidden,
    accordion,
    stylePreset
  } = attributes;

  // Get block props with core styling support
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: ['wp-block-jankx-table-of-content', stylePreset && stylePreset !== 'default' ? `toc-style-${stylePreset}` : ''].filter(Boolean).join(' ')
  });

  // Effect to adjust hideTOC based on hidden or accordion attributes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    // If hideTOC is already set, no need to adjust
    if (hideTOC !== undefined) {
      return;
    }

    // Determine if we need to activate hideTOC based on hidden or accordion
    if (hidden || accordion) {
      setAttributes({
        hideTOC: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on mount

  // Remove the old blockProps line since we already defined it above

  // Get the autoupdate option from WordPress php.
  const autoupdateOption = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_12__.useSelect)(select => {
    const optionValue = select('core').getSite()?.jankx_autoupdate_enabled;
    if (Number(optionValue) !== 1) {
      return true;
    }
    return false;
  }, []);
  const {
    autoupdate
  } = attributes;
  const {
    returnisSaving,
    returnisSavingNonPostEntityChanges
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_12__.useSelect)(select => {
    const {
      isSavingPost,
      isSavingNonPostEntityChanges
    } = select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    return {
      returnisSaving: isSavingPost(),
      returnisSavingNonPostEntityChanges: isSavingNonPostEntityChanges()
    };
  });
  const advpanelicon = 'settings';
  const controls = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, {
    group: "block",
    children: [!(attributes.no_title || attributes.accordion || attributes.hidden) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_heading_level_dropdown__WEBPACK_IMPORTED_MODULE_11__["default"], {
      selectedLevel: attributes.title_level,
      onChange: level => setAttributes({
        title_level: Number(level)
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToolbarButton, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Convert to unordered list', 'jankx'),
      describedBy: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Convert to unordered list', 'jankx'),
      isActive: attributes.use_ol === false,
      onClick: () => {
        setAttributes({
          use_ol: false
        });
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToolbarButton, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"],
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Convert to ordered list', 'jankx'),
      describedBy: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Convert to ordered list', 'jankx'),
      isActive: attributes.use_ol === true,
      onClick: () => {
        setAttributes({
          use_ol: true
        });
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToolbarButton, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"],
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Indent list', 'jankx'),
      describedBy: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Indent list', 'jankx'),
      isActive: attributes.remove_indent === true,
      onClick: () => {
        setAttributes({
          remove_indent: true
        });
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToolbarButton, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Outdent list', 'jankx'),
      describedBy: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Outdent list', 'jankx'),
      isActive: attributes.remove_indent === false,
      onClick: () => {
        setAttributes({
          remove_indent: false
        });
      }
    }), (!attributes.autoupdate || !autoupdateOption) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToolbarButton, {
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__["default"],
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Update table of contents', 'jankx'),
      onClick: () => setAttributes({
        updated: Date.now()
      })
    })]
  });
  const controlssidebar = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Panel, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelBody, {
        children: [!attributes.no_title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading Text', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the heading text of the block.', 'jankx') + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default value', 'jankx') + ': ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of Contents', 'jankx'),
            value: attributes.title_text,
            onChange: value => setAttributes({
              title_text: value || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of Contents', 'jankx')
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove heading', 'jankx'),
            checked: attributes.no_title,
            onChange: () => setAttributes({
              no_title: !attributes.no_title
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimum level', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimum depth of the headings.', 'jankx'),
            value: attributes.min_level,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H6',
              value: '6'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H5',
              value: '5'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H4',
              value: '4'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H3',
              value: '3'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H2',
              value: '2'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H1 (' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('default', 'jankx') + ')',
              value: '1'
            }],
            onChange: level => setAttributes({
              min_level: Number(level)
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum level', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum depth of the headings.', 'jankx'),
            value: attributes.max_level,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H6 (' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('default', 'jankx') + ')',
              value: '6'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H5',
              value: '5'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H4',
              value: '4'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H3',
              value: '3'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H2',
              value: '2'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Including', 'jankx') + ' H1',
              value: '1'
            }],
            onChange: level => setAttributes({
              max_level: Number(level)
            })
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Panel, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Styles', 'jankx'),
        icon: "admin-appearance",
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Style Preset', 'jankx'),
            value: stylePreset,
            options: (0,_style_presets__WEBPACK_IMPORTED_MODULE_13__.getStylePresetOptions)().map(option => ({
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(option.label, 'jankx'),
              value: option.value
            })),
            onChange: value => setAttributes({
              stylePreset: value
            })
          })
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Panel, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Features', 'jankx'),
        icon: advpanelicon,
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
            style: {
              marginBottom: '1em',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              padding: '0.5em',
              backgroundColor: '#f7f7f7'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("p", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("strong", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Think about making a donation if you use any of these features.', 'jankx')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ExternalLink, {
              href: "https://marc.tv/out/donate",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Donate here!', 'jankx')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide SimpleTOC', 'jankx'),
            checked: attributes.hideTOC,
            onChange: value => {
              if (!value) {
                // When turning off the "Hide SimpleTOC", reset both 'hidden' and 'accordion'
                setAttributes({
                  hideTOC: false,
                  hidden: false,
                  accordion: false
                });
              } else {
                // When turning on, set 'hidden' true by default (and 'accordion' remains false unless chosen otherwise)
                setAttributes({
                  hideTOC: true,
                  hidden: true
                });
              }
            }
          })
        }), attributes.hideTOC && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.RadioControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Type', 'jankx'),
            selected: attributes.hidden ? 'hidden' : 'accordion',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide with a clickable dropdown (using <details> tag).', 'jankx'),
              value: 'hidden'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide in accordion menu. Adds minimal JS and CSS.', 'jankx'),
              value: 'accordion'
            }],
            onChange: value => {
              setAttributes({
                hidden: value === 'hidden',
                accordion: value === 'accordion'
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Smooth scrolling support', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Adds the following CSS to the HTML element: "scroll-behavior: smooth;"', 'jankx'),
            checked: attributes.add_smooth,
            onChange: () => setAttributes({
              add_smooth: !attributes.add_smooth
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use absolute urls', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Adds the permalink url to the fragment.', 'jankx'),
            checked: attributes.use_absolute_urls,
            onChange: () => setAttributes({
              use_absolute_urls: !attributes.use_absolute_urls
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Wrapper div', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Additionally adds the role "navigation" and ARIA attributes.', 'jankx'),
            checked: attributes.wrapper,
            onChange: () => setAttributes({
              wrapper: !attributes.wrapper
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatic refresh', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatic updating of the table of contents.', 'jankx'),
            checked: attributes.autoupdate,
            onChange: () => setAttributes({
              autoupdate: !attributes.autoupdate
            })
          })
        })]
      })
    })]
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
    ...blockProps,
    children: [controls, controlssidebar, autoupdateOption && autoupdate && (returnisSaving || returnisSavingNonPostEntityChanges) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_10__.Spinner, {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)((_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_4___default()), {
      block: "jankx/table-of-content",
      attributes: attributes
    })]
  });
}

/***/ }),

/***/ "./blocks/table-of-content/src/editor.scss":
/*!*************************************************!*\
  !*** ./blocks/table-of-content/src/editor.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/table-of-content/src/heading-level-dropdown.js":
/*!***************************************************************!*\
  !*** ./blocks/table-of-content/src/heading-level-dropdown.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HeadingLevelDropdown)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _heading_level_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./heading-level-icon */ "./blocks/table-of-content/src/heading-level-icon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* eslint-disable */
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


const HEADING_LEVELS = [0, 1, 2, 3, 4, 5, 6];
const POPOVER_PROPS = {
  className: 'block-library-heading-level-dropdown'
};

/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * HeadingLevelDropdown props.
 *
 * @typedef WPHeadingLevelDropdownProps
 *
 * @property {number}                 selectedLevel The chosen heading level.
 * @property {(newValue:number)=>any} onChange      Callback to run when
 *                                                  toolbar value is changed.
 */

/**
 * Dropdown for selecting a heading level (1 through 6).
 *
 * @param {WPHeadingLevelDropdownProps} props Component props.
 *
 * @return {WPComponent} The toolbar.
 */
function HeadingLevelDropdown({
  selectedLevel,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToolbarDropdownMenu, {
    popoverProps: POPOVER_PROPS,
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heading_level_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
      level: selectedLevel
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change heading level tag'),
    controls: HEADING_LEVELS.map(targetLevel => {
      {
        const isActive = targetLevel === selectedLevel;
        return {
          icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heading_level_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
            level: targetLevel,
            isPressed: isActive
          }),
          isActive,
          onClick() {
            onChange(targetLevel);
          }
        };
      }
    })
  });
}

/***/ }),

/***/ "./blocks/table-of-content/src/heading-level-icon.js":
/*!***********************************************************!*\
  !*** ./blocks/table-of-content/src/heading-level-icon.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HeadingLevelIcon)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable */
/**
 * WordPress dependencies
 */


/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * HeadingLevelIcon props.
 *
 * @typedef WPHeadingLevelIconProps
 *
 * @property {number}   level     The heading level to show an icon for.
 * @property {?boolean} isPressed Whether or not the icon should appear pressed; default: false.
 */

/**
 * Heading level icon.
 *
 * @param {WPHeadingLevelIconProps} props Component props.
 *
 * @return {?WPComponent} The icon.
 */

function HeadingLevelIcon({
  level,
  isPressed = false
}) {
  const levelToPath = {
    0: 'M18.3 4H9.9v-.1l-.9.2c-2.3.4-4 2.4-4 4.8s1.7 4.4 4 4.8l.7.1V20h1.5V5.5h2.9V20h1.5V5.5h2.7V4z',
    1: 'M9 5h2v10H9v-4H5v4H3V5h2v4h4V5zm6.6 0c-.6.9-1.5 1.7-2.6 2v1h2v7h2V5h-1.4z',
    2: 'M7 5h2v10H7v-4H3v4H1V5h2v4h4V5zm8 8c.5-.4.6-.6 1.1-1.1.4-.4.8-.8 1.2-1.3.3-.4.6-.8.9-1.3.2-.4.3-.8.3-1.3 0-.4-.1-.9-.3-1.3-.2-.4-.4-.7-.8-1-.3-.3-.7-.5-1.2-.6-.5-.2-1-.2-1.5-.2-.4 0-.7 0-1.1.1-.3.1-.7.2-1 .3-.3.1-.6.3-.9.5-.3.2-.6.4-.8.7l1.2 1.2c.3-.3.6-.5 1-.7.4-.2.7-.3 1.2-.3s.9.1 1.3.4c.3.3.5.7.5 1.1 0 .4-.1.8-.4 1.1-.3.5-.6.9-1 1.2-.4.4-1 .9-1.6 1.4-.6.5-1.4 1.1-2.2 1.6V15h8v-2H15z',
    3: 'M12.1 12.2c.4.3.8.5 1.2.7.4.2.9.3 1.4.3.5 0 1-.1 1.4-.3.3-.1.5-.5.5-.8 0-.2 0-.4-.1-.6-.1-.2-.3-.3-.5-.4-.3-.1-.7-.2-1-.3-.5-.1-1-.1-1.5-.1V9.1c.7.1 1.5-.1 2.2-.4.4-.2.6-.5.6-.9 0-.3-.1-.6-.4-.8-.3-.2-.7-.3-1.1-.3-.4 0-.8.1-1.1.3-.4.2-.7.4-1.1.6l-1.2-1.4c.5-.4 1.1-.7 1.6-.9.5-.2 1.2-.3 1.8-.3.5 0 1 .1 1.6.2.4.1.8.3 1.2.5.3.2.6.5.8.8.2.3.3.7.3 1.1 0 .5-.2.9-.5 1.3-.4.4-.9.7-1.5.9v.1c.6.1 1.2.4 1.6.8.4.4.7.9.7 1.5 0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.4.3-.9.4-1.3.5-.5.1-1 .2-1.6.2-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1l1.1-1.4zM7 9H3V5H1v10h2v-4h4v4h2V5H7v4z',
    4: 'M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm10-2h-1v2h-2v-2h-5v-2l4-6h3v6h1v2zm-3-2V7l-2.8 4H16z',
    5: 'M12.1 12.2c.4.3.7.5 1.1.7.4.2.9.3 1.3.3.5 0 1-.1 1.4-.4.4-.3.6-.7.6-1.1 0-.4-.2-.9-.6-1.1-.4-.3-.9-.4-1.4-.4H14c-.1 0-.3 0-.4.1l-.4.1-.5.2-1-.6.3-5h6.4v1.9h-4.3L14 8.8c.2-.1.5-.1.7-.2.2 0 .5-.1.7-.1.5 0 .9.1 1.4.2.4.1.8.3 1.1.6.3.2.6.6.8.9.2.4.3.9.3 1.4 0 .5-.1 1-.3 1.4-.2.4-.5.8-.9 1.1-.4.3-.8.5-1.3.7-.5.2-1 .3-1.5.3-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1-.1-.1 1-1.5 1-1.5zM9 15H7v-4H3v4H1V5h2v4h4V5h2v10z',
    6: 'M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm8.6-7.5c-.2-.2-.5-.4-.8-.5-.6-.2-1.3-.2-1.9 0-.3.1-.6.3-.8.5l-.6.9c-.2.5-.2.9-.2 1.4.4-.3.8-.6 1.2-.8.4-.2.8-.3 1.3-.3.4 0 .8 0 1.2.2.4.1.7.3 1 .6.3.3.5.6.7.9.2.4.3.8.3 1.3s-.1.9-.3 1.4c-.2.4-.5.7-.8 1-.4.3-.8.5-1.2.6-1 .3-2 .3-3 0-.5-.2-1-.5-1.4-.9-.4-.4-.8-.9-1-1.5-.2-.6-.3-1.3-.3-2.1s.1-1.6.4-2.3c.2-.6.6-1.2 1-1.6.4-.4.9-.7 1.4-.9.6-.3 1.1-.4 1.7-.4.7 0 1.4.1 2 .3.5.2 1 .5 1.4.8 0 .1-1.3 1.4-1.3 1.4zm-2.4 5.8c.2 0 .4 0 .6-.1.2 0 .4-.1.5-.2.1-.1.3-.3.4-.5.1-.2.1-.5.1-.7 0-.4-.1-.8-.4-1.1-.3-.2-.7-.3-1.1-.3-.3 0-.7.1-1 .2-.4.2-.7.4-1 .7 0 .3.1.7.3 1 .1.2.3.4.4.6.2.1.3.3.5.3.2.1.5.2.7.1z'
  };
  if (!levelToPath.hasOwnProperty(level)) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SVG, {
    width: "24",
    height: "24",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg",
    isPressed: isPressed,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Path, {
      d: levelToPath[level]
    })
  });
}

/***/ }),

/***/ "./blocks/table-of-content/src/save.js":
/*!*********************************************!*\
  !*** ./blocks/table-of-content/src/save.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 */
function save() {
  return null;
}

/***/ }),

/***/ "./blocks/table-of-content/src/style-presets.js":
/*!******************************************************!*\
  !*** ./blocks/table-of-content/src/style-presets.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STYLE_PRESETS: () => (/* binding */ STYLE_PRESETS),
/* harmony export */   getAllStylePresets: () => (/* binding */ getAllStylePresets),
/* harmony export */   getStylePreset: () => (/* binding */ getStylePreset),
/* harmony export */   getStylePresetOptions: () => (/* binding */ getStylePresetOptions)
/* harmony export */ });
/**
 * Style Presets Configuration for Table of Contents Block
 *
 * This file contains all available style presets and their configurations.
 * To add a new style preset:
 * 1. Add the preset object to the STYLE_PRESETS array
 * 2. Add the corresponding CSS in style.css
 * 3. The preset will automatically appear in the editor dropdown
 */

const STYLE_PRESETS = [{
  value: 'default',
  label: 'Disc Markers',
  description: 'Standard disc, circle, and square markers',
  preview: {
    backgroundColor: 'transparent',
    textColor: 'inherit',
    borderColor: 'transparent'
  }
}, {
  value: 'boxed',
  label: 'Numbered Markers',
  description: 'Numbered list with decimal, alpha, and roman markers',
  preview: {
    backgroundColor: '#f8f9fa',
    textColor: '#333',
    borderColor: '#e9ecef'
  }
}, {
  value: 'minimal',
  label: 'No Markers',
  description: 'Clean list without any markers',
  preview: {
    backgroundColor: 'transparent',
    textColor: '#6c757d',
    borderColor: 'transparent'
  }
}, {
  value: 'bordered',
  label: 'Arrow Markers',
  description: 'Arrow markers with left border accent',
  preview: {
    backgroundColor: 'rgba(0, 115, 170, 0.03)',
    textColor: '#0073aa',
    borderColor: '#0073aa'
  }
}, {
  value: 'card',
  label: 'Check Markers',
  description: 'Check marks and symbols with card styling',
  preview: {
    backgroundColor: '#ffffff',
    textColor: '#2c3e50',
    borderColor: '#e0e0e0'
  }
}, {
  value: 'highlight',
  label: 'Star Markers',
  description: 'Star markers with gradient background',
  preview: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    borderColor: 'transparent'
  }
}, {
  value: 'dark-red',
  label: 'Plus Markers',
  description: 'Plus, minus, and bullet markers on dark red background',
  preview: {
    backgroundColor: '#8B0000',
    textColor: '#ffffff',
    borderColor: 'transparent'
  }
}];

/**
 * Get style preset by value
 * @param {string} value - The preset value
 * @returns {Object|null} - The preset object or null if not found
 */
function getStylePreset(value) {
  return STYLE_PRESETS.find(preset => preset.value === value) || null;
}

/**
 * Get all available style presets
 * @returns {Array} - Array of all style presets
 */
function getAllStylePresets() {
  return STYLE_PRESETS;
}

/**
 * Get style presets formatted for WordPress SelectControl
 * @returns {Array} - Array of options for SelectControl
 */
function getStylePresetOptions() {
  return STYLE_PRESETS.map(preset => ({
    label: preset.label,
    value: preset.value
  }));
}

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/format-indent.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/format-indent.js ***!
  \*****************************************************************************/
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


const formatIndent = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M4 7.2v1.5h16V7.2H4zm8 8.6h8v-1.5h-8v1.5zm-8-3.5l3 3-3 3 1 1 4-4-4-4-1 1z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatIndent);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/format-list-bullets.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/format-list-bullets.js ***!
  \***********************************************************************************/
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


const formatListBullets = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11.1 15.8H20v-1.5h-8.9v1.5zm0-8.6v1.5H20V7.2h-8.9zM6 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatListBullets);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/format-list-numbered.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/format-list-numbered.js ***!
  \************************************************************************************/
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


const formatListNumbered = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M11.1 15.8H20v-1.5h-8.9v1.5zm0-8.6v1.5H20V7.2h-8.9zM5 6.7V10h1V5.3L3.8 6l.4 1 .8-.3zm-.4 5.7c-.3.1-.5.2-.7.3l.1 1.1c.2-.2.5-.4.8-.5.3-.1.6 0 .7.1.2.3 0 .8-.2 1.1-.5.8-.9 1.6-1.4 2.5h2.7v-1h-1c.3-.6.8-1.4.9-2.1.1-.3 0-.8-.2-1.1-.5-.6-1.3-.5-1.7-.4z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatListNumbered);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/format-outdent.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/format-outdent.js ***!
  \******************************************************************************/
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


const formatOutdent = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M4 7.2v1.5h16V7.2H4zm8 8.6h8v-1.5h-8v1.5zm-4-4.6l-4 4 4 4 1-1-3-3 3-3-1-1z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatOutdent);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/update.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/update.js ***!
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


const update = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "m11.3 17.2-5-5c-.1-.1-.1-.3 0-.4l2.3-2.3-1.1-1-2.3 2.3c-.7.7-.7 1.8 0 2.5l5 5H7.5v1.5h5.3v-5.2h-1.5v2.6zm7.5-6.4-5-5h2.7V4.2h-5.2v5.2h1.5V6.8l5 5c.1.1.1.3 0 .4l-2.3 2.3 1.1 1.1 2.3-2.3c.6-.7.6-1.9-.1-2.5z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (update);

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

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["wp"]["serverSideRender"];

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
/*!**********************************************!*\
  !*** ./blocks/table-of-content/src/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/table-of-content/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/table-of-content/src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/table-of-content/src/save.js");




/**
 * Internal dependencies
 */


(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__, {
  icon: 'list-view',
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map