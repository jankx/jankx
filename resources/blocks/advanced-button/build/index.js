/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/advanced-button/block.json":
/*!*******************************************!*\
  !*** ./blocks/advanced-button/block.json ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/advanced-button","title":"Advanced Button","category":"jankx","description":"Advanced button block with enhanced features and styling options.","keywords":["button","link","advanced","cta","action"],"textdomain":"jankx","allowedBlocks":["jankx/icon-picker","jankx/svg-icon","core/image","core/html"],"attributes":{"showForPostType":{"type":"string","default":""},"triggerType":{"type":"string","enum":["link","button","detail-link","modal"],"default":"link","source":"attribute","selector":".jankx-advanced-button__link","attribute":"data-trigger-type"},"buttonType":{"type":"string","enum":["button","submit","reset"],"default":"button","source":"attribute","selector":"button","attribute":"type"},"modalId":{"type":"string","default":"","source":"attribute","selector":".jankx-advanced-button__link","attribute":"data-modal-id"},"modalShareObjectId":{"type":"boolean","default":false},"modalSharePostTitle":{"type":"boolean","default":false},"modalShareCurrentUrl":{"type":"boolean","default":false},"text":{"type":"string","source":"html","selector":".button-text","default":"Button"},"url":{"type":"string","source":"attribute","selector":"a","attribute":"href","role":"content","default":""},"title":{"type":"string","source":"attribute","selector":"a,button","attribute":"title","role":"content"},"linkTarget":{"type":"string","source":"attribute","selector":"a","attribute":"target","role":"content"},"rel":{"type":"string","source":"attribute","selector":"a","attribute":"rel","role":"content"},"placeholder":{"type":"string","default":""},"backgroundColor":{"type":"string"},"textColor":{"type":"string"},"gradient":{"type":"string"},"width":{"type":"number"},"style":{"type":"object","default":{"spacing":{"padding":{"top":"0.5rem","right":"1rem","bottom":"0.5rem","left":"1rem"}}}},"useIconBlocks":{"type":"boolean","default":false},"iconPosition":{"type":"string","enum":["left","right","top","bottom"],"default":"left"},"showLabel":{"type":"boolean","default":true}},"supports":{"anchor":true,"align":false,"alignWide":false,"color":{"__experimentalSkipSerialization":true,"gradients":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"textAlign":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"reusable":false,"shadow":true,"spacing":{"padding":["horizontal","vertical"],"margin":true,"__experimentalDefaultControls":{"padding":true,"margin":false}},"layout":{"default":{"type":"flex","justifyContent":"center"},"allowSwitching":false,"allowInheriting":false,"allowEditing":false},"dimensions":{"minHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}}},"styles":[{"name":"fill","label":"Fill","isDefault":true},{"name":"outline","label":"Outline"}],"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","viewScript":"file:./build/frontend.js"}');

/***/ }),

/***/ "./blocks/advanced-button/edit.tsx":
/*!*****************************************!*\
  !*** ./blocks/advanced-button/edit.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Edit: () => (/* binding */ Edit),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/keycodes */ "@wordpress/keycodes");
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/link.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */








const NEW_TAB_REL = 'noreferrer noopener';
const ALLOWED_BLOCKS = ['jankx/icon-picker', 'jankx/svg-icon', 'core/image', 'core/html'];
const ICON_TEMPLATE = [];

/**
 * The edit function for the Advanced Button Block.
 */
function Edit(props) {
  const {
    attributes,
    setAttributes,
    backgroundColor,
    textColor,
    setBackgroundColor,
    setTextColor,
    clientId
  } = props;
  const {
    triggerType = 'link',
    buttonType = 'button',
    modalId = '',
    modalShareObjectId = false,
    modalSharePostTitle = false,
    modalShareCurrentUrl = false,
    text,
    url,
    title,
    linkTarget,
    rel,
    placeholder,
    style,
    useIconBlocks = false,
    iconPosition = 'left',
    showLabel = true,
    showForPostType = ''
  } = attributes;

  // Check if block has inner blocks (icon blocks)
  const hasInnerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    const {
      getBlockCount
    } = select('core/block-editor');
    return getBlockCount(clientId) > 0;
  }, [clientId]);
  // Detect ancestor dynamic-data-template/layout and multi post types
  const {
    isInsideDynamicTemplate,
    multiPostTypes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    const {
      getBlockParents,
      getBlock
    } = select('core/block-editor');
    const parents = getBlockParents(clientId) || [];
    const templateId = parents.find(id => getBlock(id)?.name === 'jankx/dynamic-data-template');
    let multi = {
      enabled: false,
      postTypes: []
    };
    if (templateId) {
      const layoutId = getBlockParents(templateId).find(id => getBlock(id)?.name === 'jankx/dynamic-data-layout');
      if (layoutId) {
        const layoutBlock = getBlock(layoutId);
        const attrs = layoutBlock?.attributes || {};
        if (attrs?.useMultiPostType && Array.isArray(attrs?.postTypes) && attrs.postTypes.length > 1) {
          multi = {
            enabled: true,
            postTypes: attrs.postTypes
          };
        }
      }
    }
    return {
      isInsideDynamicTemplate: !!templateId,
      multiPostTypes: multi
    };
  }, [clientId]);
  // Build post type options
  const wpPostTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    const core = select('core');
    return core.getPostTypes({
      per_page: -1
    }) || [];
  }, []);
  const postTypeOptions = (multiPostTypes.postTypes || []).map(slug => {
    const found = (wpPostTypes || []).find(pt => pt.slug === slug);
    return {
      label: found?.name || slug,
      value: slug
    };
  });

  // Get all modal blocks from the page
  const modalBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => {
    const {
      getBlocks
    } = select('core/block-editor');
    const allBlocks = getBlocks();

    // Recursively find all jankx/modal blocks
    const findModalBlocks = blocks => {
      let modals = [];
      blocks.forEach(block => {
        if (block.name === 'jankx/modal' && block.attributes?.modalId) {
          modals.push({
            id: block.attributes.modalId,
            title: block.attributes.modalTitle || block.attributes.modalId
          });
        }
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          modals = [...modals, ...findModalBlocks(block.innerBlocks)];
        }
      });
      return modals;
    };
    return findModalBlocks(allBlocks);
  }, []);
  const [isEditingURL, setIsEditingURL] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [isCustomModalId, setIsCustomModalId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const linkRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
  const isURLSet = !!url;
  const opensInNewTab = linkTarget === '_blank';
  const unlink = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
    setAttributes({
      url: undefined,
      linkTarget: undefined,
      rel: undefined
    });
    setIsEditingURL(false);
  }, [setAttributes]);
  const onToggleOpenInNewTab = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(value => {
    const newLinkTarget = value ? '_blank' : undefined;
    let updatedRel = rel;
    if (newLinkTarget && !rel) {
      updatedRel = NEW_TAB_REL;
    } else if (!newLinkTarget && rel === NEW_TAB_REL) {
      updatedRel = undefined;
    }
    setAttributes({
      linkTarget: newLinkTarget,
      rel: updatedRel
    });
  }, [rel, setAttributes]);
  const onKeyDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(event => {
    if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5__.isKeyboardEvent.primary(event, 'k')) {
      event.preventDefault();
      setIsEditingURL(true);
    } else if (_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5__.isKeyboardEvent.primaryShift(event, 'k')) {
      unlink();
      linkRef.current?.focus();
    }
  }, [unlink]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('jankx-advanced-button', {
      [`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition
    }),
    onKeyDown
  });
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalGetBorderClassesAndStyles)(attributes);

  // Check if button has no color settings
  const hasNoColorSettings = !backgroundColor?.slug && !backgroundColor?.color && !textColor?.slug && !textColor?.color && !attributes.gradient && !attributes.style?.color?.background && !attributes.style?.color?.text && !attributes.style?.color?.gradient;
  const buttonClasses = classnames__WEBPACK_IMPORTED_MODULE_0___default()('jankx-advanced-button__link', borderProps?.className, {
    [`has-${backgroundColor?.slug}-background-color`]: backgroundColor?.slug,
    [`has-${textColor?.slug}-color`]: textColor?.slug,
    'has-background': backgroundColor?.color,
    'has-text-color': textColor?.color,
    [`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
    'has-base-color': hasNoColorSettings
  });

  // Build button styles - gradient takes priority over background color
  const buttonStyles = {
    ...blockProps.style,
    ...borderProps?.style
  };

  // Apply preset colors if set
  if (backgroundColor?.color) {
    buttonStyles.backgroundColor = backgroundColor.color;
  }
  if (textColor?.color) {
    buttonStyles.color = textColor.color;
  }

  // Apply custom colors from style.color if set (overrides preset colors)
  if (attributes.style?.color?.text) {
    buttonStyles.color = attributes.style.color.text;
  }

  // Apply gradient if set (gradient takes priority over background color)
  if (attributes.style?.color?.gradient) {
    buttonStyles.background = attributes.style.color.gradient;
    // Remove backgroundColor when gradient is set
    delete buttonStyles.backgroundColor;
  } else if (attributes.style?.color?.background) {
    // Only apply background color if no gradient is set
    buttonStyles.backgroundColor = attributes.style.color.background;
  }

  // Render button content - Always render InnerBlocks at the same position
  // Use CSS flex-order to control visual position
  const renderButtonContent = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
      className: "button-icon-wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks, {
        allowedBlocks: ALLOWED_BLOCKS,
        template: ICON_TEMPLATE,
        templateLock: false,
        renderAppender: hasInnerBlocks ? false : _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InnerBlocks.ButtonBlockAppender,
        orientation: "horizontal",
        __experimentalCaptureToolbars: false
      })
    }), showLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.RichText, {
      tagName: "span",
      className: "button-text",
      value: text,
      onChange: value => setAttributes({
        text: value
      }),
      placeholder: placeholder || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button text...', 'jankx'),
      allowedFormats: []
    })]
  });

  // Render button element based on trigger type
  let buttonElement = null;
  switch (triggerType) {
    case 'link':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("a", {
        className: buttonClasses,
        target: linkTarget,
        rel: rel,
        style: buttonStyles,
        title: title,
        onClick: e => {
          // In editor, prevent default navigation completely
          e.preventDefault();
        },
        onClickCapture: e => {
          // Allow appender clicks to work normally
          const target = e.target;
          if (target.closest('.block-list-appender')) {
            // Don't prevent appender clicks
            return;
          }
          // Allow clicks within inner blocks to propagate normally
          // This ensures icon blocks can handle their own events
          if (target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
            // Let inner blocks handle their own interactions
            return;
          }
        },
        children: renderButtonContent()
      });
      break;
    case 'button':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
        className: buttonClasses,
        type: buttonType,
        style: buttonStyles,
        title: title,
        children: renderButtonContent()
      });
      break;
    case 'detail-link':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("a", {
        className: buttonClasses,
        href: "javascript:void(0)",
        style: buttonStyles,
        title: title,
        onClick: e => {
          // Prevent navigation in editor
          e.preventDefault();
        },
        onClickCapture: e => {
          // Allow clicks within inner blocks to propagate normally
          const target = e.target;
          if (target.closest('.block-list-appender') || target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
            return; // Let inner blocks handle their own interactions
          }
        },
        children: renderButtonContent()
      });
      break;
    case 'modal':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
        className: buttonClasses,
        type: "button",
        "data-modal-id": modalId,
        style: buttonStyles,
        title: title,
        children: renderButtonContent()
      });
      break;
    default:
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("button", {
        className: buttonClasses,
        style: buttonStyles,
        title: title,
        children: renderButtonContent()
      });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
      group: "block",
      children: triggerType === 'link' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
          ref: linkRef,
          name: "link",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link', 'jankx'),
          shortcut: _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_5__.displayShortcut.primary('k'),
          onClick: () => setIsEditingURL(true),
          isActive: isURLSet
        }), isEditingURL && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Popover, {
          className: "wp-block-jankx-advanced-button__link-popover",
          anchor: linkRef?.current,
          offset: 12,
          placement: "bottom",
          onClose: () => {
            setIsEditingURL(false);
            linkRef.current?.focus();
          },
          focusOnMount: isEditingURL ? 'firstElement' : false,
          variant: "alternate",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalLinkControl, {
            value: {
              url,
              opensInNewTab
            },
            onChange: ({
              url: newURL = '',
              opensInNewTab: newOpensInNewTab
            }) => {
              setAttributes({
                url: newURL
              });
              if (opensInNewTab !== newOpensInNewTab) {
                onToggleOpenInNewTab(newOpensInNewTab);
              }
            },
            onRemove: () => {
              unlink();
              linkRef.current?.focus();
            },
            settings: [{
              id: 'opensInNewTab',
              title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Open in new tab', 'jankx')
            }],
            showSuggestions: true,
            showInitialSuggestions: true
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      group: "settings",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanel, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trigger Settings', 'jankx'),
        resetAll: () => {
          setAttributes({
            triggerType: 'link',
            buttonType: 'button',
            url: undefined,
            linkTarget: undefined,
            rel: undefined,
            showForPostType: ''
          });
        },
        children: [isInsideDynamicTemplate && multiPostTypes.enabled && postTypeOptions.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show For Post Type', 'jankx'),
          isShownByDefault: true,
          hasValue: () => !!showForPostType,
          onDeselect: () => setAttributes({
            showForPostType: ''
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show For Post Type', 'jankx'),
            value: showForPostType || '',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All', 'jankx'),
              value: ''
            }, ...postTypeOptions],
            onChange: value => setAttributes({
              showForPostType: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only render this button for items of the selected post type', 'jankx')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trigger Type', 'jankx'),
          isShownByDefault: true,
          hasValue: () => triggerType !== 'link',
          onDeselect: () => setAttributes({
            triggerType: 'link'
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trigger Type', 'jankx'),
            value: triggerType,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔗 Link - Custom URL', 'jankx'),
              value: 'link'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🔘 Button - Form Action', 'jankx'),
              value: 'button'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('📄 Detail Link - Current Object', 'jankx'),
              value: 'detail-link'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('🪟 Modal - Open Modal', 'jankx'),
              value: 'modal'
            }],
            onChange: value => setAttributes({
              triggerType: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose what happens when users click this button', 'jankx')
          })
        }), triggerType === 'link' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('URL', 'jankx'),
            isShownByDefault: true,
            hasValue: () => !!url,
            onDeselect: () => setAttributes({
              url: undefined
            }),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('URL', 'jankx'),
              value: url || '',
              onChange: value => setAttributes({
                url: value
              }),
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter URL...', 'jankx'),
              __nextHasNoMarginBottom: true
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Open in new tab', 'jankx'),
            isShownByDefault: true,
            hasValue: () => opensInNewTab,
            onDeselect: () => onToggleOpenInNewTab(false),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Open in new tab', 'jankx'),
              checked: opensInNewTab,
              onChange: onToggleOpenInNewTab,
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Adds target="_blank" and rel="noreferrer noopener"', 'jankx')
            })
          })]
        }), triggerType === 'button' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Type', 'jankx'),
          isShownByDefault: true,
          hasValue: () => buttonType !== 'button',
          onDeselect: () => setAttributes({
            buttonType: 'button'
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button Type', 'jankx'),
            value: buttonType,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Button', 'jankx'),
              value: 'button'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Submit', 'jankx'),
              value: 'submit'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset', 'jankx'),
              value: 'reset'
            }],
            onChange: value => setAttributes({
              buttonType: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Defines the button behavior in forms', 'jankx')
          })
        }), triggerType === 'detail-link' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
          style: {
            padding: '12px',
            background: '#fff3cd',
            borderRadius: '4px',
            marginTop: '12px',
            border: '1px solid #ffeaa7'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("p", {
            style: {
              margin: '0',
              fontSize: '12px',
              color: '#856404'
            },
            children: ["\uD83D\uDCC4 ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This button will link to the current post/page permalink on the frontend.', 'jankx')]
          })
        }), triggerType === 'modal' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modal ID', 'jankx'),
            isShownByDefault: true,
            hasValue: () => !!modalId,
            onDeselect: () => {
              setAttributes({
                modalId: undefined
              });
              setIsCustomModalId(false);
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modal ID', 'jankx'),
              value: isCustomModalId ? '__custom__' : modalId || '',
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a modal...', 'jankx'),
                value: ''
              }, ...modalBlocks.map(modal => ({
                label: modal.title,
                value: modal.id
              })), {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('✏️ Custom ID (Manual Input)', 'jankx'),
                value: '__custom__'
              }],
              onChange: value => {
                if (value === '__custom__') {
                  setIsCustomModalId(true);
                  setAttributes({
                    modalId: ''
                  });
                } else {
                  setIsCustomModalId(false);
                  setAttributes({
                    modalId: value
                  });
                }
              },
              help: isCustomModalId ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter custom modal ID in the field below', 'jankx') : modalBlocks.length === 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No modal blocks found on this page. Add a modal block first or use custom ID.', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a modal block to trigger, or choose custom ID', 'jankx'),
              __nextHasNoMarginBottom: true
            }), isCustomModalId && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
              style: {
                marginTop: '12px'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Modal ID', 'jankx'),
                value: modalId || '',
                onChange: value => setAttributes({
                  modalId: value
                }),
                placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('e.g. modal-contact-form', 'jankx'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the ID of your modal. Must match exactly with the modal block ID.', 'jankx'),
                __nextHasNoMarginBottom: true
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share Data with Modal', 'jankx'),
            isShownByDefault: true,
            hasValue: () => !!(modalShareObjectId || modalSharePostTitle || modalShareCurrentUrl),
            onDeselect: () => setAttributes({
              modalShareObjectId: false,
              modalSharePostTitle: false,
              modalShareCurrentUrl: false
            }),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
              style: {
                marginBottom: '12px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
                style: {
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '8px'
                },
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share current post data with modal:', 'jankx')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share Object ID', 'jankx'),
                checked: modalShareObjectId || false,
                onChange: value => setAttributes({
                  modalShareObjectId: value
                }),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share current post/page ID', 'jankx'),
                __nextHasNoMarginBottom: true
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share Post Title', 'jankx'),
                checked: modalSharePostTitle || false,
                onChange: value => setAttributes({
                  modalSharePostTitle: value
                }),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share current post/page title', 'jankx'),
                __nextHasNoMarginBottom: true
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share Current URL', 'jankx'),
                checked: modalShareCurrentUrl || false,
                onChange: value => setAttributes({
                  modalShareCurrentUrl: value
                }),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share current page URL', 'jankx'),
                __nextHasNoMarginBottom: true
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Label', 'jankx'),
          isShownByDefault: true,
          hasValue: () => !showLabel,
          onDeselect: () => setAttributes({
            showLabel: true
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Label', 'jankx'),
            checked: showLabel,
            onChange: value => setAttributes({
              showLabel: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show or hide button label text', 'jankx'),
            __nextHasNoMarginBottom: true
          })
        }), hasInnerBlocks && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalToolsPanelItem, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon Position', 'jankx'),
          isShownByDefault: true,
          hasValue: () => iconPosition !== 'left',
          onDeselect: () => setAttributes({
            iconPosition: 'left'
          }),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon Position', 'jankx'),
            value: iconPosition,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('⬅️ Left', 'jankx'),
              value: 'left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('➡️ Right', 'jankx'),
              value: 'right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('⬆️ Top', 'jankx'),
              value: 'top'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('⬇️ Bottom', 'jankx'),
              value: 'bottom'
            }],
            onChange: value => setAttributes({
              iconPosition: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose where to display the icon relative to text', 'jankx')
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      group: "advanced",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link rel', 'jankx'),
        value: rel || '',
        onChange: value => setAttributes({
          rel: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Additional rel attributes for the link', 'jankx'),
        __nextHasNoMarginBottom: true
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title attribute', 'jankx'),
        value: title || '',
        onChange: value => setAttributes({
          title: value
        }),
        help: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Describe the role of this button on the page.', 'jankx'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ExternalLink, {
            href: "https://www.w3.org/TR/html52/dom.html#the-title-attribute",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Note: many devices and browsers do not display this text', 'jankx')
          })]
        }),
        __nextHasNoMarginBottom: true
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: buttonElement
    })]
  });
}
const colorAttributes = {
  backgroundColor: 'background-color',
  textColor: 'text-color'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.withColors)(colorAttributes)(Edit));

/***/ }),

/***/ "./blocks/advanced-button/save.tsx":
/*!*****************************************!*\
  !*** ./blocks/advanced-button/save.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * External dependencies
 */


/**
 * WordPress dependencies
 */


/**
 * The save function for the Advanced Button Block.
 */
function Save(props) {
  const {
    triggerType = 'link',
    buttonType = 'button',
    modalId = '',
    modalShareObjectId = false,
    modalSharePostTitle = false,
    modalShareCurrentUrl = false,
    text,
    url,
    title,
    linkTarget,
    rel,
    backgroundColor,
    textColor,
    gradient,
    useIconBlocks = false,
    iconPosition = 'left',
    showLabel = true
  } = props.attributes;

  // Always render the button - InnerBlocks.Content will handle inner blocks if they exist
  // Don't return null here because:
  // 1. If showLabel=true and text exists → render text
  // 2. If showLabel=true and no text but has inner blocks → InnerBlocks.Content will render them
  // 3. If showLabel=false → button can still have inner blocks (icon-only buttons)
  // We can't reliably check for inner blocks in save function, so we always render

  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();

  // Get border props (includes border radius)
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetBorderClassesAndStyles)(props.attributes);

  // Check if button has no color settings
  const hasNoColorSettings = !backgroundColor && !textColor && !gradient && !props.attributes.style?.color?.background && !props.attributes.style?.color?.text && !props.attributes.style?.color?.gradient;
  const buttonClasses = classnames__WEBPACK_IMPORTED_MODULE_0___default()('jankx-advanced-button__link', borderProps?.className, {
    [`has-${backgroundColor}-background-color`]: backgroundColor,
    [`has-${textColor}-color`]: textColor,
    [`has-${gradient}-gradient-background`]: gradient,
    [`icon-position-${iconPosition}`]: iconPosition,
    'has-base-color': hasNoColorSettings,
    // Add classes for custom colors (WordPress may add these automatically)
    'has-background': props.attributes.style?.color?.background || props.attributes.style?.color?.gradient,
    'has-text-color': props.attributes.style?.color?.text
  });

  // Build button styles - include custom background/text colors from style.color
  const buttonStyles = {
    ...blockProps.style,
    ...borderProps?.style
  };

  // Copy spacing (padding, margin) from blockProps if needed
  // Border radius is already included from borderProps.style above

  // Apply custom background color from style.color.background if set
  if (props.attributes.style?.color?.background) {
    buttonStyles.backgroundColor = props.attributes.style.color.background;
  }

  // Apply custom text color from style.color.text if set
  if (props.attributes.style?.color?.text) {
    buttonStyles.color = props.attributes.style.color.text;
  }

  // Apply gradient if set (gradient takes priority over background color)
  if (props.attributes.style?.color?.gradient) {
    buttonStyles.background = props.attributes.style.color.gradient;
    // Remove backgroundColor when gradient is set
    delete buttonStyles.backgroundColor;
  }

  // Sanitize text content to remove any nested anchor tags
  // This prevents invalid HTML like <a><a>text</a></a>
  const sanitizeText = html => {
    if (!html) return '';
    // Remove any anchor tags but keep their content
    return html.replace(/<\/?a[^>]*>/gi, '');
  };
  const sanitizedText = text ? sanitizeText(text) : '';

  // Always render in same order - use CSS to control visual position
  const textMarkup = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
      className: "button-icon-wrapper",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    }), showLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "button-text",
      value: sanitizedText
    })]
  });

  // Render button element based on trigger type
  let buttonElement = null;
  switch (triggerType) {
    case 'link':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
        className: buttonClasses,
        href: url || '#',
        target: linkTarget || undefined,
        rel: rel || undefined,
        style: buttonStyles,
        title: title,
        "data-trigger-type": "link",
        children: textMarkup
      });
      break;
    case 'button':
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: buttonClasses,
        type: buttonType,
        style: buttonStyles,
        title: title,
        "data-trigger-type": "button",
        children: textMarkup
      });
      break;
    case 'detail-link':
      // href="#" will be replaced by PHP with actual permalink
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
        className: buttonClasses + ' jankx-button-detail-link',
        href: "#",
        "data-trigger-type": "detail-link",
        style: buttonStyles,
        title: title,
        children: textMarkup
      });
      break;
    case 'modal':
      // Build data attributes object for Micromodal
      const modalDataAttrs = {
        'data-micromodal-trigger': modalId || '',
        // Micromodal standard attribute
        'data-modal-id': modalId || '',
        // Keep for backward compatibility
        'data-trigger-type': 'modal'
      };

      // Add share data attributes if enabled
      // These will be read by the modal's view.js when triggered
      if (modalShareObjectId) {
        modalDataAttrs['data-share-object-id'] = 'true';
        modalDataAttrs['data-current-object-id'] = '{{CURRENT_POST_ID}}';
      }
      if (modalSharePostTitle) {
        modalDataAttrs['data-share-post-title'] = 'true';
        modalDataAttrs['data-current-post-title'] = '{{CURRENT_POST_TITLE}}';
      }
      if (modalShareCurrentUrl) {
        modalDataAttrs['data-share-current-url'] = 'true';
        modalDataAttrs['data-current-url'] = '{{CURRENT_POST_URL}}';
      }
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        className: buttonClasses + ' jankx-button-modal-trigger',
        type: "button",
        ...modalDataAttrs,
        style: buttonStyles,
        title: title,
        children: textMarkup
      });
      break;
    default:
      buttonElement = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
        className: buttonClasses,
        href: "#",
        style: buttonStyles,
        title: title,
        "data-trigger-type": "link",
        children: textMarkup
      });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    ...blockProps,
    children: buttonElement
  });
}

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/button.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/button.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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


const button = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (button);

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/link.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/link.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
  'use strict';

  var hasOwn = {}.hasOwnProperty;
  function classNames() {
    var classes = '';
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg) {
        classes = appendClass(classes, parseValue(arg));
      }
    }
    return classes;
  }
  function parseValue(arg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return arg;
    }
    if (typeof arg !== 'object') {
      return '';
    }
    if (Array.isArray(arg)) {
      return classNames.apply(null, arg);
    }
    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
      return arg.toString();
    }
    var classes = '';
    for (var key in arg) {
      if (hasOwn.call(arg, key) && arg[key]) {
        classes = appendClass(classes, key);
      }
    }
    return classes;
  }
  function appendClass(value, newClass) {
    if (!newClass) {
      return value;
    }
    if (value) {
      return value + ' ' + newClass;
    }
    return value + newClass;
  }
  if ( true && module.exports) {
    classNames.default = classNames;
    module.exports = classNames;
  } else if (true) {
    // register as 'classnames', consistent with npm package name
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return classNames;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{}
})();

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/keycodes":
/*!**********************************!*\
  !*** external ["wp","keycodes"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["keycodes"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************************!*\
  !*** ./blocks/advanced-button/index.tsx ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/button.js");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/advanced-button/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/advanced-button/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/advanced-button/block.json");
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
      text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Advanced Button', 'jankx'),
      backgroundColor: '#007cba',
      textColor: '#ffffff',
      style: {
        border: {
          radius: '4px'
        },
        spacing: {
          padding: {
            top: '12px',
            right: '24px',
            bottom: '12px',
            left: '24px'
          }
        }
      }
    }
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
};

/**
 * Register the Advanced Button Block.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, settings);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map