/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/table-of-content/block.json":
/*!********************************************!*\
  !*** ./blocks/table-of-content/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/table-of-content","title":"Table of Content","category":"jankx","description":"Display interactive table of content for the current post","keywords":["toc","table","content","index","mục lục"],"textdomain":"jankx","attributes":{"listingType":{"type":"string","enum":["ul","ol","none"],"default":"ul"},"expandIconType":{"type":"string","enum":["plus-minus","chevron","arrow","caret","none"],"default":"plus-minus"},"defaultExpanded":{"type":"boolean","default":false},"expandFirstItem":{"type":"boolean","default":true},"showHeading":{"type":"boolean","default":true},"hideEmptyMessage":{"type":"boolean","default":true},"customHeadingText":{"type":"string","default":""},"headingStyle":{"type":"string","enum":["underline","tabbed","bordered"],"default":"underline"},"minHeadingLevel":{"type":"number","default":1,"minimum":1,"maximum":6},"maxHeadingLevel":{"type":"number","default":6,"minimum":2,"maximum":6},"className":{"type":"string","default":""},"anchor":{"type":"string","default":""}},"style":"file:./build/style.css","supports":{"html":false,"anchor":true,"align":["wide","full"],"spacing":{"margin":true,"padding":true,"blockGap":true,"__experimentalDefaultControls":{"padding":true,"margin":true}},"color":{"background":true,"gradients":true,"text":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"fontFamily":true,"fontWeight":true,"fontStyle":true,"textTransform":true,"textDecoration":true,"letterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"radius":true}},"shadow":true},"editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","viewScript":"file:./build/view.js","styles":[{"name":"default","label":"Default","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"boxed","label":"Boxed"},{"name":"sidebar","label":"Sidebar"}]}');

/***/ }),

/***/ "./blocks/table-of-content/edit.tsx":
/*!******************************************!*\
  !*** ./blocks/table-of-content/edit.tsx ***!
  \******************************************/
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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/format-list-numbered.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/list.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */

/**
 * Mock data for template editing - Example structure to preview TOC layout
 */
const MOCK_TOC_DATA = [{
  id: 'example-heading-1',
  text: 'Example Heading 1',
  level: 2,
  isExpanded: true,
  children: [{
    id: 'example-heading-1-1',
    text: 'Example Subheading 1.1',
    level: 3,
    isExpanded: false,
    children: [{
      id: 'example-heading-1-1-1',
      text: 'Example Subheading 1.1.1',
      level: 4,
      isExpanded: false,
      children: []
    }, {
      id: 'example-heading-1-1-2',
      text: 'Example Subheading 1.1.2',
      level: 4,
      isExpanded: false,
      children: []
    }]
  }, {
    id: 'example-heading-1-2',
    text: 'Example Subheading 1.2',
    level: 3,
    isExpanded: false,
    children: []
  }]
}, {
  id: 'example-heading-2',
  text: 'Example Heading 2',
  level: 2,
  isExpanded: false,
  children: [{
    id: 'example-heading-2-1',
    text: 'Example Subheading 2.1',
    level: 3,
    isExpanded: false,
    children: []
  }, {
    id: 'example-heading-2-2',
    text: 'Example Subheading 2.2',
    level: 3,
    isExpanded: false,
    children: []
  }]
}, {
  id: 'example-heading-3',
  text: 'Example Heading 3',
  level: 2,
  isExpanded: false,
  children: []
}];

/**
 * Get expand/collapse icon based on type
 */
function getExpandIcon(type, isExpanded) {
  switch (type) {
    case 'chevron':
      return isExpanded ? '▼' : '▶';
    case 'arrow':
      return isExpanded ? '↓' : '→';
    case 'caret':
      return isExpanded ? '▾' : '▸';
    case 'plus-minus':
    default:
      return isExpanded ? '−' : '+';
  }
}

/**
 * Build hierarchical structure from flat headings array
 */
function buildHierarchy(headings) {
  const hierarchy = [];
  const stack = [];
  headings.forEach(heading => {
    const level = heading.level;

    // Pop stack until we find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    if (stack.length === 0) {
      // Top level item
      hierarchy.push(heading);
      stack.push(heading);
    } else {
      // Child item
      const parent = stack[stack.length - 1];
      parent.children.push(heading);
      stack.push(heading);
    }
  });
  return hierarchy;
}

/**
 * Render TOC item recursively
 */
function renderTOCItem(item, listingType, expandIconType, expandState, onToggle) {
  const hasChildren = item.children.length > 0;
  // When expand icon type is 'none', always show all items expanded
  const isExpanded = expandIconType === 'none' ? true : expandState[item.id] !== undefined ? expandState[item.id] : item.isExpanded;
  const ListTag = listingType === 'none' ? 'div' : listingType === 'ol' ? 'ol' : 'ul';
  const ItemTag = listingType === 'none' ? 'div' : 'li';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(ItemTag, {
    className: `toc-item toc-item--level-${item.level}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "toc-item__wrapper",
      children: [hasChildren && expandIconType !== 'none' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
        className: `toc-item__toggle ${isExpanded ? 'is-expanded' : 'is-collapsed'}`,
        onClick: () => onToggle(item.id),
        type: "button",
        "aria-expanded": isExpanded,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "toc-item__icon",
          children: getExpandIcon(expandIconType, isExpanded)
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
        className: "toc-item__link",
        children: item.text
      })]
    }), hasChildren && isExpanded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ListTag, {
      className: `toc-list toc-list--level-${item.level + 1}${listingType === 'none' ? ' toc-list--none' : ''}`,
      children: item.children.map(child => renderTOCItem(child, listingType, expandIconType, expandState, onToggle))
    })]
  }, item.id);
}

/**
 * Edit component for Table of Content block
 */
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    listingType,
    expandIconType,
    defaultExpanded,
    expandFirstItem,
    showHeading,
    hideEmptyMessage,
    customHeadingText,
    headingStyle,
    minHeadingLevel,
    maxHeadingLevel
  } = attributes;

  // Check if we're in template editor
  const isTemplateEditor = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const editor = select('core/block-editor');
    if (!editor) return false;

    // Check if we're in template editor context
    const currentPost = select('core/editor')?.getCurrentPost?.();
    if (currentPost && (currentPost.type === 'wp_template' || currentPost.type === 'wp_template_part')) {
      return true;
    }

    // Alternative check via editor settings
    const settings = editor.getSettings?.();
    if (settings && (settings.__experimentalTemplateMode || settings.__experimentalBlockSettings)) {
      // Additional checks can be added here
    }
    return false;
  }, []);

  // Get headings from editor content (only if not in template editor)
  const editorHeadings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    // If in template editor, return empty to use mock data
    if (isTemplateEditor) {
      return [];
    }
    const editor = select('core/block-editor');
    if (!editor) return [];
    const blocks = editor.getBlocks?.();
    if (!blocks) return [];
    const headings = [];
    const extractHeadings = blocks => {
      blocks.forEach(block => {
        // Check if this is a heading block
        if (block.name === 'core/heading') {
          const level = block.attributes?.level || 2;
          const content = block.attributes?.content || '';

          // Filter by min/max level
          if (level >= minHeadingLevel && level <= maxHeadingLevel) {
            const text = content.replace(/<[^>]+>/g, '').trim();
            if (text) {
              const id = block.attributes?.anchor || `heading-${headings.length}`;
              headings.push({
                id,
                text,
                level,
                children: [],
                isExpanded: false
              });
            }
          }
        }

        // Process inner blocks
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          extractHeadings(block.innerBlocks);
        }
      });
    };
    extractHeadings(blocks);
    return headings;
  }, [minHeadingLevel, maxHeadingLevel, isTemplateEditor]);

  // Manage expand/collapse state
  const [expandState, setExpandState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(() => {
    const initialState = {};
    if (expandFirstItem && MOCK_TOC_DATA.length > 0) {
      initialState[MOCK_TOC_DATA[0].id] = true;
    }
    return initialState;
  });
  const handleToggle = id => {
    setExpandState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `jankx-table-of-content heading-style-${headingStyle}`,
    'data-expand-icon-type': expandIconType
  });

  // Sync style variant with listingType attribute
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const className = blockProps.className || attributes.className || '';
    let newListingType = null;
    if (className.includes('is-style-ul-list')) {
      newListingType = 'ul';
    } else if (className.includes('is-style-ol-list')) {
      newListingType = 'ol';
    } else if (className.includes('is-style-none-list')) {
      newListingType = 'none';
    }

    // Update attribute if style variant changed
    if (newListingType && newListingType !== listingType) {
      setAttributes({
        listingType: newListingType
      });
    }
  }, [blockProps.className, attributes.className, listingType, setAttributes]);
  const ListTag = listingType === 'none' ? 'div' : listingType === 'ol' ? 'ol' : 'ul';

  // Helper function to filter by level recursively
  const filterByLevel = item => {
    if (item.level < minHeadingLevel || item.level > maxHeadingLevel) {
      return null;
    }
    const filtered = {
      ...item,
      children: item.children.map(child => filterByLevel(child)).filter(child => child !== null)
    };
    return filtered;
  };

  // Build hierarchy from editor headings or use mock data
  // In template editor, always use mock data filtered by min/max level
  const tocData = isTemplateEditor ? MOCK_TOC_DATA.map(item => filterByLevel(item)).filter(item => item !== null) : editorHeadings.length > 0 ? buildHierarchy(editorHeadings) : MOCK_TOC_DATA;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unordered List', 'jankx'),
          onClick: () => setAttributes({
            listingType: 'ul'
          }),
          isActive: listingType === 'ul'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ordered List', 'jankx'),
          onClick: () => setAttributes({
            listingType: 'ol'
          }),
          isActive: listingType === 'ol'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No List', 'jankx'),
          onClick: () => setAttributes({
            listingType: 'none'
          }),
          isActive: listingType === 'none'
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Heading', 'jankx'),
          checked: showHeading,
          onChange: value => setAttributes({
            showHeading: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show or hide the table of content heading', 'jankx'),
          __nextHasNoMarginBottom: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide empty message', 'jankx'),
          checked: hideEmptyMessage,
          onChange: value => setAttributes({
            hideEmptyMessage: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('When enabled, the block renders nothing on the frontend if no headings are found.', 'jankx'),
          __nextHasNoMarginBottom: true
        }), showHeading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Heading Text', 'jankx'),
            value: customHeadingText,
            onChange: value => setAttributes({
              customHeadingText: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of Contents', 'jankx'),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Leave empty to use default heading text', 'jankx'),
            __nextHasNoMarginBottom: true,
            __next40pxDefaultSize: true
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading Style', 'jankx'),
            value: headingStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Underline', 'jankx'),
              value: 'underline'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tabbed', 'jankx'),
              value: 'tabbed'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bordered', 'jankx'),
              value: 'bordered'
            }],
            onChange: value => setAttributes({
              headingStyle: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose heading style for table of contents', 'jankx'),
            __nextHasNoMarginBottom: true,
            __next40pxDefaultSize: true
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Minimum Heading Level', 'jankx'),
          value: minHeadingLevel,
          onChange: value => {
            const newMin = value || 1;
            setAttributes({
              minHeadingLevel: newMin,
              maxHeadingLevel: Math.max(newMin, maxHeadingLevel)
            });
          },
          min: 1,
          max: 6,
          step: 1,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Start building TOC from this heading level (H1-H6)', 'jankx'),
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Maximum Heading Level', 'jankx'),
          value: maxHeadingLevel,
          onChange: value => {
            const newMax = value || 6;
            setAttributes({
              maxHeadingLevel: newMax,
              minHeadingLevel: Math.min(minHeadingLevel, newMax)
            });
          },
          min: 1,
          max: 6,
          step: 1,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stop building TOC at this heading level (H1-H6)', 'jankx'),
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Listing Type', 'jankx'),
          value: listingType,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Unordered List (•)', 'jankx'),
            value: 'ul'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ordered List (1, 2, 3)', 'jankx'),
            value: 'ol'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No List', 'jankx'),
            value: 'none'
          }],
          onChange: value => setAttributes({
            listingType: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose how to display the table of content list', 'jankx'),
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Expand/Collapse Icon', 'jankx'),
          value: expandIconType,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Plus/Minus (+/−)', 'jankx'),
            value: 'plus-minus'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Chevron (▶/▼)', 'jankx'),
            value: 'chevron'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Arrow (→/↓)', 'jankx'),
            value: 'arrow'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Caret (▸/▾)', 'jankx'),
            value: 'caret'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None (Don\'t apply)', 'jankx'),
            value: 'none'
          }],
          onChange: value => setAttributes({
            expandIconType: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose icon style for expand/collapse buttons', 'jankx'),
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Expand All by Default', 'jankx'),
          checked: defaultExpanded,
          onChange: value => setAttributes({
            defaultExpanded: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show all nested items by default', 'jankx'),
          __nextHasNoMarginBottom: true
        }), !defaultExpanded && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Expand First Item', 'jankx'),
          checked: expandFirstItem,
          onChange: value => setAttributes({
            expandFirstItem: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Expand the first item by default', 'jankx'),
          __nextHasNoMarginBottom: true
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("nav", {
        className: "toc-wrapper",
        "aria-label": customHeadingText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of Contents', 'jankx'),
        children: [showHeading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "toc-header",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h2", {
            className: "toc-title",
            children: customHeadingText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of Contents', 'jankx')
          })
        }), tocData.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ListTag, {
          className: `toc-list toc-list--root${listingType === 'none' ? ' toc-list--none' : ''}`,
          children: tocData.map(item => renderTOCItem(item, listingType, expandIconType, expandState, handleToggle))
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "toc-placeholder",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Table of content will be generated from headings in the post content.', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("em", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add headings (H2, H3, H4, etc.) to your post to see the table of content.', 'jankx')
            })
          })]
        })]
      })
    })]
  });
}

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

/***/ "./node_modules/@wordpress/icons/build-module/library/list.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/list.js ***!
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


const list = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (list);

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
/*!*******************************************!*\
  !*** ./blocks/table-of-content/index.tsx ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/list.js");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/table-of-content/edit.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./blocks/table-of-content/block.json");
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */


/**
 * Block configuration
 */
const blockConfig = {
  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => {
    // Rendered by PHP
    return null;
  }
};

/**
 * Register Table of Content block
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_3__,
  ...blockConfig
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map