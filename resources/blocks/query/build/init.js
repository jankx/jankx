/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/query/block.json":
/*!*********************************!*\
  !*** ./blocks/query/block.json ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/query","title":"Dynamic Query","category":"theme","description":"An advanced block that allows displaying post types based on different query parameters and visual configurations.","keywords":["posts","list","blog","blogs","custom post types"],"textdomain":"default","attributes":{"queryId":{"type":"number"},"query":{"type":"object","default":{"perPage":null,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true,"taxQuery":null,"parents":[],"format":[]}},"tagName":{"type":"string","default":"div"},"namespace":{"type":"string"},"enhancedPagination":{"type":"boolean","default":false}},"usesContext":["templateSlug"],"providesContext":{"queryId":"queryId","query":"query","displayLayout":"displayLayout","enhancedPagination":"enhancedPagination"},"supports":{"align":["wide","full"],"html":false,"layout":true,"interactivity":true},"editorStyle":"file:./build/editor.css","style":"file:./build/style.css","editorScript":"file:./build/init.js","viewScript":"file:./build/view.js"}');

/***/ }),

/***/ "./blocks/query/deprecated.js":
/*!************************************!*\
  !*** ./blocks/query/deprecated.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_lock_unlock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/lock-unlock */ "./blocks/query/utils/lock-unlock.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


// Helper function to clean empty objects (similar to cleanEmptyObject)

const cleanEmptyObject = obj => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  const cleaned = {};
  let hasValues = false;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanEmptyObject(value);
        if (cleanedValue && Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
          hasValues = true;
        }
      } else {
        cleaned[key] = value;
        hasValues = true;
      }
    }
  }
  return hasValues ? cleaned : undefined;
};
const migrateToTaxQuery = attributes => {
  const {
    query
  } = attributes;
  const {
    categoryIds,
    tagIds,
    ...newQuery
  } = query;
  if (query.categoryIds?.length || query.tagIds?.length) {
    newQuery.taxQuery = {
      category: !!query.categoryIds?.length ? query.categoryIds : undefined,
      post_tag: !!query.tagIds?.length ? query.tagIds : undefined
    };
  }
  return {
    ...attributes,
    query: newQuery
  };
};
const migrateColors = (attributes, innerBlocks) => {
  // Remove color style attributes from the Query block.
  const {
    style,
    backgroundColor,
    gradient,
    textColor,
    ...newAttributes
  } = attributes;
  const hasColorStyles = backgroundColor || gradient || textColor || style?.color || style?.elements?.link;

  // If the query block doesn't currently have any color styles,
  // nothing needs migrating.
  if (!hasColorStyles) {
    return [attributes, innerBlocks];
  }

  // Clean color values from style attribute object.
  if (style) {
    newAttributes.style = cleanEmptyObject({
      ...style,
      color: undefined,
      elements: {
        ...style.elements,
        link: undefined
      }
    });
  }

  // If the inner blocks are already wrapped in a single group
  // block, add the color support styles to that group block.
  if (hasSingleInnerGroupBlock(innerBlocks)) {
    const groupBlock = innerBlocks[0];

    // Create new styles for the group block.
    const hasStyles = style?.color || style?.elements?.link || groupBlock.attributes.style;
    const newStyles = hasStyles ? cleanEmptyObject({
      ...groupBlock.attributes.style,
      color: style?.color,
      elements: style?.elements?.link ? {
        link: style?.elements?.link
      } : undefined
    }) : undefined;

    // Create a new Group block from the original.
    const updatedGroupBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/group', {
      ...groupBlock.attributes,
      backgroundColor,
      gradient,
      textColor,
      style: newStyles
    }, groupBlock.innerBlocks);
    return [newAttributes, [updatedGroupBlock]];
  }

  // When we don't have a single wrapping group block for the inner
  // blocks, wrap the current inner blocks in a group applying the
  // color styles to that.
  const newGroupBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/group', {
    backgroundColor,
    gradient,
    textColor,
    style: cleanEmptyObject({
      color: style?.color,
      elements: style?.elements?.link ? {
        link: style?.elements?.link
      } : undefined
    })
  }, innerBlocks);
  return [newAttributes, [newGroupBlock]];
};
const hasSingleInnerGroupBlock = (innerBlocks = []) => innerBlocks.length === 1 && innerBlocks[0].name === 'core/group';
const migrateToConstrainedLayout = attributes => {
  const {
    layout = null
  } = attributes;
  if (!layout) {
    return attributes;
  }
  const {
    inherit = null,
    contentSize = null,
    ...newLayout
  } = layout;
  if (inherit || contentSize) {
    return {
      ...attributes,
      layout: {
        ...newLayout,
        contentSize,
        type: 'constrained'
      }
    };
  }
  return attributes;
};
const findPostTemplateBlock = (innerBlocks = []) => {
  let foundBlock = null;
  for (const block of innerBlocks) {
    if (block.name === 'core/post-template') {
      foundBlock = block;
      break;
    } else if (block.innerBlocks.length) {
      foundBlock = findPostTemplateBlock(block.innerBlocks);
    }
  }
  return foundBlock;
};
const replacePostTemplateBlock = (innerBlocks = [], replacementBlock) => {
  innerBlocks.forEach((block, index) => {
    if (block.name === 'core/post-template') {
      innerBlocks.splice(index, 1, replacementBlock);
    } else if (block.innerBlocks.length) {
      block.innerBlocks = replacePostTemplateBlock(block.innerBlocks, replacementBlock);
    }
  });
  return innerBlocks;
};
const migrateDisplayLayout = (attributes, innerBlocks) => {
  const {
    displayLayout = null,
    ...newAttributes
  } = attributes;
  if (!displayLayout) {
    return [attributes, innerBlocks];
  }
  const postTemplateBlock = findPostTemplateBlock(innerBlocks);
  if (!postTemplateBlock) {
    return [attributes, innerBlocks];
  }
  const {
    type,
    columns
  } = displayLayout;

  // Convert custom displayLayout values to canonical layout types.
  const updatedLayoutType = type === 'flex' ? 'grid' : 'default';
  const newPostTemplateBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-template', {
    ...postTemplateBlock.attributes,
    layout: {
      type: updatedLayoutType,
      ...(columns && {
        columnCount: columns
      })
    }
  }, postTemplateBlock.innerBlocks);
  return [newAttributes, replacePostTemplateBlock(innerBlocks, newPostTemplateBlock)];
};

// Version with NO wrapper `div` element.
const v1 = {
  attributes: {
    queryId: {
      type: 'number'
    },
    query: {
      type: 'object',
      default: {
        perPage: null,
        pages: 0,
        offset: 0,
        postType: 'post',
        categoryIds: [],
        tagIds: [],
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        exclude: [],
        sticky: '',
        inherit: true
      }
    },
    layout: {
      type: 'object',
      default: {
        type: 'list'
      }
    }
  },
  supports: {
    html: false
  },
  migrate(attributes, innerBlocks) {
    const withTaxQuery = migrateToTaxQuery(attributes);
    const {
      layout,
      ...restWithTaxQuery
    } = withTaxQuery;
    const newAttributes = {
      ...restWithTaxQuery,
      displayLayout: withTaxQuery.layout
    };
    return migrateDisplayLayout(newAttributes, innerBlocks);
  },
  save() {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {});
  }
};

// Version with `categoryIds and tagIds`.
const v2 = {
  attributes: {
    queryId: {
      type: 'number'
    },
    query: {
      type: 'object',
      default: {
        perPage: null,
        pages: 0,
        offset: 0,
        postType: 'post',
        categoryIds: [],
        tagIds: [],
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        exclude: [],
        sticky: '',
        inherit: true
      }
    },
    tagName: {
      type: 'string',
      default: 'div'
    },
    displayLayout: {
      type: 'object',
      default: {
        type: 'list'
      }
    }
  },
  supports: {
    align: ['wide', 'full'],
    html: false,
    color: {
      gradients: true,
      link: true
    },
    layout: true
  },
  isEligible: ({
    query: {
      categoryIds,
      tagIds
    } = {}
  }) => categoryIds || tagIds,
  migrate(attributes, innerBlocks) {
    const withTaxQuery = migrateToTaxQuery(attributes);
    const [withColorAttributes, withColorInnerBlocks] = migrateColors(withTaxQuery, innerBlocks);
    const withConstrainedLayoutAttributes = migrateToConstrainedLayout(withColorAttributes);
    return migrateDisplayLayout(withConstrainedLayoutAttributes, withColorInnerBlocks);
  },
  save({
    attributes: {
      tagName: Tag = 'div'
    }
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
    const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps.save(blockProps);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Tag, {
      ...innerBlocksProps
    });
  }
};

// Version with color support prior to moving it to the PostTemplate block.
const v3 = {
  attributes: {
    queryId: {
      type: 'number'
    },
    query: {
      type: 'object',
      default: {
        perPage: null,
        pages: 0,
        offset: 0,
        postType: 'post',
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        exclude: [],
        sticky: '',
        inherit: true,
        taxQuery: null,
        parents: []
      }
    },
    tagName: {
      type: 'string',
      default: 'div'
    },
    displayLayout: {
      type: 'object',
      default: {
        type: 'list'
      }
    },
    namespace: {
      type: 'string'
    }
  },
  supports: {
    align: ['wide', 'full'],
    html: false,
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    layout: true
  },
  isEligible(attributes) {
    const {
      style,
      backgroundColor,
      gradient,
      textColor
    } = attributes;
    return backgroundColor || gradient || textColor || style?.color || style?.elements?.link;
  },
  migrate(attributes, innerBlocks) {
    const [withColorAttributes, withColorInnerBlocks] = migrateColors(attributes, innerBlocks);
    const withConstrainedLayoutAttributes = migrateToConstrainedLayout(withColorAttributes);
    return migrateDisplayLayout(withConstrainedLayoutAttributes, withColorInnerBlocks);
  },
  save({
    attributes: {
      tagName: Tag = 'div'
    }
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
    const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps.save(blockProps);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Tag, {
      ...innerBlocksProps
    });
  }
};
const v4 = {
  attributes: {
    queryId: {
      type: 'number'
    },
    query: {
      type: 'object',
      default: {
        perPage: null,
        pages: 0,
        offset: 0,
        postType: 'post',
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        exclude: [],
        sticky: '',
        inherit: true,
        taxQuery: null,
        parents: []
      }
    },
    tagName: {
      type: 'string',
      default: 'div'
    },
    displayLayout: {
      type: 'object',
      default: {
        type: 'list'
      }
    },
    namespace: {
      type: 'string'
    }
  },
  supports: {
    align: ['wide', 'full'],
    html: false,
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true
      }
    },
    layout: true
  },
  save({
    attributes: {
      tagName: Tag = 'div'
    }
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
    const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps.save(blockProps);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Tag, {
      ...innerBlocksProps
    });
  },
  isEligible: ({
    layout
  }) => layout?.inherit || layout?.contentSize && layout?.type !== 'constrained',
  migrate(attributes, innerBlocks) {
    const withConstrainedLayoutAttributes = migrateToConstrainedLayout(attributes);
    return migrateDisplayLayout(withConstrainedLayoutAttributes, innerBlocks);
  }
};
const v5 = {
  attributes: {
    queryId: {
      type: 'number'
    },
    query: {
      type: 'object',
      default: {
        perPage: null,
        pages: 0,
        offset: 0,
        postType: 'post',
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        exclude: [],
        sticky: '',
        inherit: true,
        taxQuery: null,
        parents: []
      }
    },
    tagName: {
      type: 'string',
      default: 'div'
    },
    displayLayout: {
      type: 'object',
      default: {
        type: 'list'
      }
    },
    namespace: {
      type: 'string'
    }
  },
  supports: {
    align: ['wide', 'full'],
    anchor: true,
    html: false,
    layout: true
  },
  save({
    attributes: {
      tagName: Tag = 'div'
    }
  }) {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
    const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps.save(blockProps);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Tag, {
      ...innerBlocksProps
    });
  },
  isEligible: ({
    displayLayout
  }) => {
    return !!displayLayout;
  },
  migrate: migrateDisplayLayout
};
const deprecated = [v5, v4, v3, v2, v1];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deprecated);

/***/ }),

/***/ "./blocks/query/edit/enhanced-pagination-modal.js":
/*!********************************************************!*\
  !*** ./blocks/query/edit/enhanced-pagination-modal.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EnhancedPaginationModal)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./blocks/query/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */


const modalDescriptionId = 'wp-block-query-enhanced-pagination-modal__description';
function EnhancedPaginationModal({
  clientId,
  attributes: {
    enhancedPagination
  },
  setAttributes
}) {
  const [isOpen, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const {
    hasBlocksFromPlugins,
    hasPostContentBlock,
    hasUnsupportedBlocks
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.useUnsupportedBlocks)(clientId);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (enhancedPagination && hasUnsupportedBlocks) {
      setAttributes({
        enhancedPagination: false
      });
      setOpen(true);
    }
  }, [enhancedPagination, hasUnsupportedBlocks, setAttributes]);
  const closeModal = () => {
    setOpen(false);
  };
  let notice = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('If you still want to prevent full page reloads, remove that block, then disable "Reload full page" again in the Query Block settings.');
  if (hasBlocksFromPlugins) {
    notice = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Currently, avoiding full page reloads is not possible when non-interactive or non-client Navigation compatible blocks from plugins are present inside the Query block.') + ' ' + notice;
  } else if (hasPostContentBlock) {
    notice = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Currently, avoiding full page reloads is not possible when a Content block is present inside the Query block.') + ' ' + notice;
  }
  return isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Modal, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Query block: Reload full page enabled'),
    className: "wp-block-query__enhanced-pagination-modal",
    aria: {
      describedby: modalDescriptionId
    },
    role: "alertdialog",
    focusOnMount: "firstElement",
    isDismissible: false,
    onRequestClose: closeModal,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalVStack, {
      alignment: "right",
      spacing: 5,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        id: modalDescriptionId,
        children: notice
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        __next40pxDefaultSize: true,
        variant: "primary",
        onClick: closeModal,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('OK')
      })]
    })
  });
}

/***/ }),

/***/ "./blocks/query/edit/index.js":
/*!************************************!*\
  !*** ./blocks/query/edit/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _query_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-content */ "./blocks/query/edit/query-content.js");
/* harmony import */ var _query_placeholder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query-placeholder */ "./blocks/query/edit/query-placeholder.js");
/* harmony import */ var _pattern_selection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pattern-selection */ "./blocks/query/edit/pattern-selection.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */




const QueryEdit = props => {
  const {
    clientId,
    attributes
  } = props;
  const [isPatternSelectionModalOpen, setIsPatternSelectionModalOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const hasInnerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => !!select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.store).getBlocks(clientId).length, [clientId]);
  const Component = hasInnerBlocks ? _query_content__WEBPACK_IMPORTED_MODULE_3__["default"] : _query_placeholder__WEBPACK_IMPORTED_MODULE_4__["default"];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Component, {
      ...props,
      openPatternSelectionModal: () => setIsPatternSelectionModalOpen(true)
    }), isPatternSelectionModalOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_pattern_selection__WEBPACK_IMPORTED_MODULE_5__.PatternSelectionModal, {
      clientId: clientId,
      attributes: attributes,
      setIsPatternSelectionModalOpen: setIsPatternSelectionModalOpen
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QueryEdit);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/author-control.js":
/*!****************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/author-control.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils */ "./blocks/query/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */


const AUTHORS_QUERY = {
  who: 'authors',
  per_page: -1,
  _fields: 'id,name',
  context: 'view'
};
function AuthorControl({
  value,
  onChange
}) {
  const authorsList = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getUsers
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);
    return getUsers(AUTHORS_QUERY);
  }, []);
  if (!authorsList) {
    return null;
  }
  const authorsInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.getEntitiesInfo)(authorsList);
  /**
   * We need to normalize the value because the block operates on a
   * comma(`,`) separated string value and `FormTokenField` needs an
   * array.
   */
  const normalizedValue = !value ? [] : value.toString().split(',');
  // Returns only the existing authors ids. This prevents the component
  // from crashing in the editor, when non existing ids are provided.
  const sanitizedValue = normalizedValue.reduce((accumulator, authorId) => {
    const author = authorsInfo.mapById[authorId];
    if (author) {
      accumulator.push({
        id: authorId,
        value: author.name
      });
    }
    return accumulator;
  }, []);
  const getIdByValue = (entitiesMappedByName, authorValue) => {
    const id = authorValue?.id || entitiesMappedByName[authorValue]?.id;
    if (id) {
      return id;
    }
  };
  const onAuthorChange = newValue => {
    const ids = Array.from(newValue.reduce((accumulator, author) => {
      // Verify that new values point to existing entities.
      const id = getIdByValue(authorsInfo.mapByName, author);
      if (id) {
        accumulator.add(id);
      }
      return accumulator;
    }, new Set()));
    onChange({
      author: ids.join(',')
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormTokenField, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Authors'),
    value: sanitizedValue,
    suggestions: authorsInfo.names,
    onChange: onAuthorChange,
    __experimentalShowHowTo: false,
    __nextHasNoMarginBottom: true,
    __next40pxDefaultSize: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthorControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/enhanced-pagination-control.js":
/*!*****************************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/enhanced-pagination-control.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EnhancedPaginationControl)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./blocks/query/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


function EnhancedPaginationControl({
  enhancedPagination,
  setAttributes,
  clientId
}) {
  const {
    hasUnsupportedBlocks
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.useUnsupportedBlocks)(clientId);
  let help = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reload the full page—instead of just the posts list—when visitors navigate between pages.');
  if (hasUnsupportedBlocks) {
    help = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enhancement disabled because there are non-compatible blocks inside the Query block.');
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
      __nextHasNoMarginBottom: true,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reload full page'),
      help: help,
      checked: !enhancedPagination,
      disabled: hasUnsupportedBlocks,
      onChange: value => {
        setAttributes({
          enhancedPagination: !value
        });
      }
    })
  });
}

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/format-controls.js":
/*!*****************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/format-controls.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormatControls)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * WordPress dependencies
 */





// All WP post formats, sorted alphabetically by translated name.
// Value is the post format slug. Label is the name.

const POST_FORMATS = [{
  value: 'aside',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Aside')
}, {
  value: 'audio',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Audio')
}, {
  value: 'chat',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Chat')
}, {
  value: 'gallery',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Gallery')
}, {
  value: 'image',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Image')
}, {
  value: 'link',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Link')
}, {
  value: 'quote',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Quote')
}, {
  value: 'standard',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Standard')
}, {
  value: 'status',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Status')
}, {
  value: 'video',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Video')
}].sort((a, b) => {
  const normalizedA = a.label.toUpperCase();
  const normalizedB = b.label.toUpperCase();
  if (normalizedA < normalizedB) {
    return -1;
  }
  if (normalizedA > normalizedB) {
    return 1;
  }
  return 0;
});

// A helper function to convert translatable post format names into their static values.
function formatNamesToValues(names, formats) {
  return names.map(name => {
    return formats.find(item => item.label.toLocaleLowerCase() === name.toLocaleLowerCase())?.value;
  }).filter(Boolean);
}
function FormatControls({
  onChange,
  query: {
    format
  }
}) {
  // 'format' is expected to be an array. If it is not an array, for example
  // if a user has manually entered an invalid value in the block markup,
  // convert it to an array to prevent JavaScript errors.
  const normalizedFormats = Array.isArray(format) ? format : [format];
  const {
    supportedFormats
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const themeSupports = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getThemeSupports();
    return {
      supportedFormats: themeSupports.formats
    };
  }, []);
  const formats = POST_FORMATS.filter(item => supportedFormats.includes(item.value));
  const values = normalizedFormats.map(name => formats.find(item => item.value === name)?.label).filter(Boolean);
  const suggestions = formats.filter(item => !normalizedFormats.includes(item.value)).map(item => item.label);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FormTokenField, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Formats'),
    value: values,
    suggestions: suggestions,
    onChange: newValues => {
      onChange({
        format: formatNamesToValues(newValues, formats)
      });
    },
    __experimentalShowHowTo: false,
    __experimentalExpandOnFocus: true,
    __nextHasNoMarginBottom: true,
    __next40pxDefaultSize: true
  });
}

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/index.js":
/*!*******************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryInspectorControls)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _order_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./order-control */ "./blocks/query/edit/inspector-controls/order-control.js");
/* harmony import */ var _author_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./author-control */ "./blocks/query/edit/inspector-controls/author-control.js");
/* harmony import */ var _parent_control__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parent-control */ "./blocks/query/edit/inspector-controls/parent-control.js");
/* harmony import */ var _taxonomy_controls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./taxonomy-controls */ "./blocks/query/edit/inspector-controls/taxonomy-controls.js");
/* harmony import */ var _format_controls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./format-controls */ "./blocks/query/edit/inspector-controls/format-controls.js");
/* harmony import */ var _sticky_control__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sticky-control */ "./blocks/query/edit/inspector-controls/sticky-control.js");
/* harmony import */ var _per_page_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./per-page-control */ "./blocks/query/edit/inspector-controls/per-page-control.js");
/* harmony import */ var _offset_controls__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./offset-controls */ "./blocks/query/edit/inspector-controls/offset-controls.js");
/* harmony import */ var _pages_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pages-control */ "./blocks/query/edit/inspector-controls/pages-control.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../utils */ "./blocks/query/utils.js");
/* harmony import */ var _utils_hooks__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../utils/hooks */ "./blocks/utils/hooks.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__);
/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */












function QueryInspectorControls(props) {
  const {
    attributes,
    setQuery,
    isSingular
  } = props;
  const {
    query
  } = attributes;
  const {
    order,
    orderBy,
    author: authorIds,
    pages,
    postType,
    perPage,
    offset,
    sticky,
    inherit,
    taxQuery,
    parents,
    format
  } = query;
  const allowedControls = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.useAllowedControls)(attributes);
  const showSticky = postType === 'post';
  const {
    postTypesTaxonomiesMap,
    postTypesSelectOptions,
    postTypeFormatSupportMap
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.usePostTypes)();
  const taxonomies = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.useTaxonomies)(postType);
  const isPostTypeHierarchical = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.useIsPostTypeHierarchical)(postType);
  const onPostTypeChange = newValue => {
    const updateQuery = {
      postType: newValue
    };
    // We need to dynamically update the `taxQuery` property,
    // by removing any not supported taxonomy from the query.
    const supportedTaxonomies = postTypesTaxonomiesMap[newValue];
    const updatedTaxQuery = Object.entries(taxQuery || {}).reduce((accumulator, [taxonomySlug, terms]) => {
      if (supportedTaxonomies.includes(taxonomySlug)) {
        accumulator[taxonomySlug] = terms;
      }
      return accumulator;
    }, {});
    updateQuery.taxQuery = !!Object.keys(updatedTaxQuery).length ? updatedTaxQuery : undefined;
    if (newValue !== 'post') {
      updateQuery.sticky = '';
    }
    // We need to reset `parents` because they are tied to each post type.
    updateQuery.parents = [];
    // Post types can register post format support with `add_post_type_support`.
    // But we need to reset the `format` property when switching to post types
    // that do not support post formats.
    const hasFormatSupport = postTypeFormatSupportMap[newValue];
    if (!hasFormatSupport) {
      updateQuery.format = [];
    }
    setQuery(updateQuery);
  };
  const [querySearch, setQuerySearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(query.search);
  const debouncedQuerySearch = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    return (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.debounce)(newQuerySearch => {
      setQuery({
        search: newQuerySearch
      });
    }, 250);
  }, [setQuery]);
  const orderByOptions = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.useOrderByOptions)(postType);
  const showInheritControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'inherit');
  const showPostTypeControl = !inherit && (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'postType');
  const postTypeControlLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Post type');
  const postTypeControlHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Select the type of content to display: posts, pages, or custom post types.');
  const showOrderControl = !inherit && (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'order');
  const showStickyControl = !inherit && showSticky && (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'sticky');
  const showSettingsPanel = showInheritControl || showPostTypeControl || showOrderControl || showStickyControl;
  const showTaxControl = !!taxonomies?.length && (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'taxQuery');
  const showAuthorControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'author');
  const showSearchControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'search');
  const showParentControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'parents') && isPostTypeHierarchical;
  const postTypeHasFormatSupport = postTypeFormatSupportMap[postType];
  const showFormatControl = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    // Check if the post type supports post formats and if the control is allowed.
    if (!postTypeHasFormatSupport || !(0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'format')) {
      return false;
    }
    const themeSupports = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getThemeSupports();

    // If there are no supported formats, getThemeSupports still includes the default 'standard' format,
    // and in this case the control should not be shown since the user has no other formats to choose from.
    return themeSupports.formats && themeSupports.formats.length > 0 && themeSupports.formats.some(type => type !== 'standard');
  }, [allowedControls, postTypeHasFormatSupport]);
  const showFiltersPanel = showTaxControl || showAuthorControl || showSearchControl || showParentControl || showFormatControl;
  const dropdownMenuProps = (0,_utils_hooks__WEBPACK_IMPORTED_MODULE_16__.useToolsPanelDropdownMenuProps)();
  const showPostCountControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'postCount');
  const showOffSetControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'offset');
  const showPagesControl = (0,_utils__WEBPACK_IMPORTED_MODULE_15__.isControlAllowed)(allowedControls, 'pages');
  const showDisplayPanel = showPostCountControl || showOffSetControl || showPagesControl;

  // The block cannot inherit a default WordPress query in singular content (e.g., post, page, 404, blank).
  // Warn users but still permit this type of query for exceptional cases in Classic and Hybrid themes.
  const hasInheritanceWarning = isSingular && inherit;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
    children: [showSettingsPanel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanel, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Settings'),
      resetAll: () => {
        setQuery({
          postType: 'post',
          order: 'desc',
          orderBy: 'date',
          sticky: '',
          inherit: true
        });
      },
      dropdownMenuProps: dropdownMenuProps,
      children: [showInheritControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !inherit,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Query type'),
        onDeselect: () => setQuery({
          inherit: true
        }),
        isShownByDefault: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalVStack, {
          spacing: 4,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToggleGroupControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Query type'),
            isBlock: true,
            onChange: value => {
              setQuery({
                inherit: value === 'default'
              });
            },
            help: inherit ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Display a list of posts or custom post types based on the current template.') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Display a list of posts or custom post types based on specific criteria.'),
            value: !!inherit ? 'default' : 'custom',
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToggleGroupControlOption, {
              value: "default",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Default')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToggleGroupControlOption, {
              value: "custom",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Custom')
            })]
          }), hasInheritanceWarning && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Notice, {
            status: "warning",
            isDismissible: false,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Cannot inherit the current template query when placed inside the singular content (e.g., post, page, 404, blank).')
          })]
        })
      }), showPostTypeControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => postType !== 'post',
        label: postTypeControlLabel,
        onDeselect: () => onPostTypeChange('post'),
        isShownByDefault: true,
        children: postTypesSelectOptions.length > 2 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true,
          options: postTypesSelectOptions,
          value: postType,
          label: postTypeControlLabel,
          onChange: onPostTypeChange,
          help: postTypeControlHelp
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToggleGroupControl, {
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true,
          isBlock: true,
          value: postType,
          label: postTypeControlLabel,
          onChange: onPostTypeChange,
          help: postTypeControlHelp,
          children: postTypesSelectOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToggleGroupControlOption, {
            value: option.value,
            label: option.label
          }, option.value))
        })
      }), showOrderControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => order !== 'desc' || orderBy !== 'date',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Order by'),
        onDeselect: () => setQuery({
          order: 'desc',
          orderBy: 'date'
        }),
        isShownByDefault: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_order_control__WEBPACK_IMPORTED_MODULE_6__["default"], {
          order,
          orderBy,
          orderByOptions,
          onChange: setQuery
        })
      }), showStickyControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !!sticky,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Sticky posts'),
        onDeselect: () => setQuery({
          sticky: ''
        }),
        isShownByDefault: true,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_sticky_control__WEBPACK_IMPORTED_MODULE_11__["default"], {
          value: sticky,
          onChange: value => setQuery({
            sticky: value
          })
        })
      })]
    }), !inherit && showDisplayPanel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanel, {
      className: "block-library-query-toolspanel__display",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Display'),
      resetAll: () => {
        setQuery({
          offset: 0,
          pages: 0
        });
      },
      dropdownMenuProps: dropdownMenuProps,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Items per page'),
        hasValue: () => perPage > 0,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_per_page_control__WEBPACK_IMPORTED_MODULE_12__["default"], {
          perPage: perPage,
          offset: offset,
          onChange: setQuery
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Offset'),
        hasValue: () => offset > 0,
        onDeselect: () => setQuery({
          offset: 0
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_offset_controls__WEBPACK_IMPORTED_MODULE_13__["default"], {
          offset: offset,
          onChange: setQuery
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Max pages to show'),
        hasValue: () => pages > 0,
        onDeselect: () => setQuery({
          pages: 0
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_pages_control__WEBPACK_IMPORTED_MODULE_14__["default"], {
          pages: pages,
          onChange: setQuery
        })
      })]
    }), !inherit && showFiltersPanel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanel, {
      className: "block-library-query-toolspanel__filters" // unused but kept for backward compatibility
      ,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Filters'),
      resetAll: () => {
        setQuery({
          author: '',
          parents: [],
          search: '',
          taxQuery: null,
          format: []
        });
        setQuerySearch('');
      },
      dropdownMenuProps: dropdownMenuProps,
      children: [showTaxControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Taxonomies'),
        hasValue: () => Object.values(taxQuery || {}).some(terms => !!terms.length),
        onDeselect: () => setQuery({
          taxQuery: null
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_taxonomy_controls__WEBPACK_IMPORTED_MODULE_9__.TaxonomyControls, {
          onChange: setQuery,
          query: query
        })
      }), showAuthorControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !!authorIds,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Authors'),
        onDeselect: () => setQuery({
          author: ''
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_author_control__WEBPACK_IMPORTED_MODULE_7__["default"], {
          value: authorIds,
          onChange: setQuery
        })
      }), showSearchControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !!querySearch,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Keyword'),
        onDeselect: () => {
          setQuery({
            search: ''
          });
          setQuerySearch('');
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
          __nextHasNoMarginBottom: true,
          __next40pxDefaultSize: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Keyword'),
          value: querySearch,
          onChange: newQuerySearch => {
            debouncedQuerySearch(newQuerySearch);
            setQuerySearch(newQuerySearch);
          }
        })
      }), showParentControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !!parents?.length,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Parents'),
        onDeselect: () => setQuery({
          parents: []
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_parent_control__WEBPACK_IMPORTED_MODULE_8__["default"], {
          parents: parents,
          postType: postType,
          onChange: setQuery
        })
      }), showFormatControl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalToolsPanelItem, {
        hasValue: () => !!format?.length,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Formats'),
        onDeselect: () => setQuery({
          format: []
        }),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_format_controls__WEBPACK_IMPORTED_MODULE_10__["default"], {
          onChange: setQuery,
          query: query
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/offset-controls.js":
/*!*****************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/offset-controls.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OffsetControl: () => (/* binding */ OffsetControl),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



const MIN_OFFSET = 0;
const MAX_OFFSET = 100;
const OffsetControl = ({
  offset = 0,
  onChange
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Offset'),
    value: offset,
    min: MIN_OFFSET,
    onChange: newOffset => {
      if (isNaN(newOffset) || newOffset < MIN_OFFSET || newOffset > MAX_OFFSET) {
        return;
      }
      onChange({
        offset: newOffset
      });
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OffsetControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/order-control.js":
/*!***************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/order-control.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



const defaultOrderByOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Newest to oldest'),
  value: 'date/desc'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Oldest to newest'),
  value: 'date/asc'
}, {
  /* translators: Label for ordering posts by title in ascending order. */
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('A → Z'),
  value: 'title/asc'
}, {
  /* translators: Label for ordering posts by title in descending order. */
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Z → A'),
  value: 'title/desc'
}];
function OrderControl({
  order,
  orderBy,
  orderByOptions = defaultOrderByOptions,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    __nextHasNoMarginBottom: true,
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Order by'),
    value: `${orderBy}/${order}`,
    options: orderByOptions,
    onChange: value => {
      const [newOrderBy, newOrder] = value.split('/');
      onChange({
        order: newOrder,
        orderBy: newOrderBy
      });
    }
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OrderControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/pages-control.js":
/*!***************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/pages-control.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PagesControl: () => (/* binding */ PagesControl),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



const PagesControl = ({
  pages,
  onChange
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max pages to show'),
    value: pages,
    min: 0,
    onChange: newPages => {
      if (isNaN(newPages) || newPages < 0) {
        return;
      }
      onChange({
        pages: newPages
      });
    },
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Limit the pages you want to show, even if the query has more results. To show all pages use 0 (zero).')
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PagesControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/parent-control.js":
/*!****************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/parent-control.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils */ "./blocks/query/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */


const EMPTY_ARRAY = [];
const BASE_QUERY = {
  order: 'asc',
  _fields: 'id,title',
  context: 'view'
};
function ParentControl({
  parents,
  postType,
  onChange
}) {
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const [value, setValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(EMPTY_ARRAY);
  const [suggestions, setSuggestions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(EMPTY_ARRAY);
  const debouncedSearch = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.useDebounce)(setSearch, 250);
  const {
    searchResults,
    searchHasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    if (!search) {
      return {
        searchResults: EMPTY_ARRAY,
        searchHasResolved: true
      };
    }
    const {
      getEntityRecords,
      hasFinishedResolution
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);
    const selectorArgs = ['postType', postType, {
      ...BASE_QUERY,
      search,
      orderby: 'relevance',
      exclude: parents,
      per_page: 20
    }];
    return {
      searchResults: getEntityRecords(...selectorArgs),
      searchHasResolved: hasFinishedResolution('getEntityRecords', selectorArgs)
    };
  }, [search, postType, parents]);
  const currentParents = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    if (!parents?.length) {
      return EMPTY_ARRAY;
    }
    const {
      getEntityRecords
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);
    return getEntityRecords('postType', postType, {
      ...BASE_QUERY,
      include: parents,
      per_page: parents.length
    });
  }, [parents, postType]);
  // Update the `value` state only after the selectors are resolved
  // to avoid emptying the input when we're changing parents.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!parents?.length) {
      setValue(EMPTY_ARRAY);
    }
    if (!currentParents?.length) {
      return;
    }
    const currentParentsInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getEntitiesInfo)((0,_utils__WEBPACK_IMPORTED_MODULE_6__.mapToIHasNameAndId)(currentParents, 'title.rendered'));
    // Returns only the existing entity ids. This prevents the component
    // from crashing in the editor, when non existing ids are provided.
    const sanitizedValue = parents.reduce((accumulator, id) => {
      const entity = currentParentsInfo.mapById[id];
      if (entity) {
        accumulator.push({
          id,
          value: entity.name
        });
      }
      return accumulator;
    }, []);
    setValue(sanitizedValue);
  }, [parents, currentParents]);
  const entitiesInfo = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (!searchResults?.length) {
      return EMPTY_ARRAY;
    }
    return (0,_utils__WEBPACK_IMPORTED_MODULE_6__.getEntitiesInfo)((0,_utils__WEBPACK_IMPORTED_MODULE_6__.mapToIHasNameAndId)(searchResults, 'title.rendered'));
  }, [searchResults]);
  // Update suggestions only when the query has resolved.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!searchHasResolved) {
      return;
    }
    setSuggestions(entitiesInfo.names);
  }, [entitiesInfo.names, searchHasResolved]);
  const getIdByValue = (entitiesMappedByName, entity) => {
    const id = entity?.id || entitiesMappedByName?.[entity]?.id;
    if (id) {
      return id;
    }
  };
  const onParentChange = newValue => {
    const ids = Array.from(newValue.reduce((accumulator, entity) => {
      // Verify that new values point to existing entities.
      const id = getIdByValue(entitiesInfo.mapByName, entity);
      if (id) {
        accumulator.add(id);
      }
      return accumulator;
    }, new Set()));
    setSuggestions(EMPTY_ARRAY);
    onChange({
      parents: ids
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FormTokenField, {
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Parents'),
    value: value,
    onInputChange: debouncedSearch,
    suggestions: suggestions,
    onChange: onParentChange,
    __experimentalShowHowTo: false,
    __nextHasNoMarginBottom: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ParentControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/per-page-control.js":
/*!******************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/per-page-control.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



const MIN_POSTS_PER_PAGE = 1;
const MAX_POSTS_PER_PAGE = 100;
const PerPageControl = ({
  perPage,
  offset = 0,
  onChange
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RangeControl, {
    __next40pxDefaultSize: true,
    __nextHasNoMarginBottom: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Items per page'),
    min: MIN_POSTS_PER_PAGE,
    max: MAX_POSTS_PER_PAGE,
    onChange: newPerPage => {
      if (isNaN(newPerPage) || newPerPage < MIN_POSTS_PER_PAGE || newPerPage > MAX_POSTS_PER_PAGE) {
        return;
      }
      onChange({
        perPage: newPerPage,
        offset
      });
    },
    value: parseInt(perPage, 10)
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PerPageControl);

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/sticky-control.js":
/*!****************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/sticky-control.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StickyControl)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WordPress dependencies
 */



const stickyOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Include'),
  value: ''
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ignore'),
  value: 'ignore'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exclude'),
  value: 'exclude'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Only'),
  value: 'only'
}];
function StickyControl({
  value,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    __nextHasNoMarginBottom: true,
    __next40pxDefaultSize: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sticky posts'),
    options: stickyOptions,
    value: value,
    onChange: onChange,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sticky posts always appear first, regardless of their publish date.')
  });
}

/***/ }),

/***/ "./blocks/query/edit/inspector-controls/taxonomy-controls.js":
/*!*******************************************************************!*\
  !*** ./blocks/query/edit/inspector-controls/taxonomy-controls.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaxonomyControls: () => (/* binding */ TaxonomyControls)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils */ "./blocks/query/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */


const EMPTY_ARRAY = [];
const BASE_QUERY = {
  order: 'asc',
  _fields: 'id,name',
  context: 'view'
};

// Helper function to get the term id based on user input in terms `FormTokenField`.
const getTermIdByTermValue = (terms, termValue) => {
  // First we check for exact match by `term.id` or case sensitive `term.name` match.
  const termId = termValue?.id || terms?.find(term => term.name === termValue)?.id;
  if (termId) {
    return termId;
  }

  /**
   * Here we make an extra check for entered terms in a non case sensitive way,
   * to match user expectations, due to `FormTokenField` behaviour that shows
   * suggestions which are case insensitive.
   *
   * Although WP tries to discourage users to add terms with the same name (case insensitive),
   * it's still possible if you manually change the name, as long as the terms have different slugs.
   * In this edge case we always apply the first match from the terms list.
   */
  const termValueLower = termValue.toLocaleLowerCase();
  return terms?.find(term => term.name.toLocaleLowerCase() === termValueLower)?.id;
};
function TaxonomyControls({
  onChange,
  query
}) {
  const {
    postType,
    taxQuery
  } = query;
  const taxonomies = (0,_utils__WEBPACK_IMPORTED_MODULE_6__.useTaxonomies)(postType);
  if (!taxonomies || taxonomies.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalVStack, {
    spacing: 4,
    children: taxonomies.map(taxonomy => {
      const termIds = taxQuery?.[taxonomy.slug] || [];
      const handleChange = newTermIds => onChange({
        taxQuery: {
          ...taxQuery,
          [taxonomy.slug]: newTermIds
        }
      });
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TaxonomyItem, {
        taxonomy: taxonomy,
        termIds: termIds,
        onChange: handleChange
      }, taxonomy.slug);
    })
  });
}

/**
 * Renders a `FormTokenField` for a given taxonomy.
 *
 * @param {Object}   props          The props for the component.
 * @param {Object}   props.taxonomy The taxonomy object.
 * @param {number[]} props.termIds  An array with the block's term ids for the given taxonomy.
 * @param {Function} props.onChange Callback `onChange` function.
 * @return {JSX.Element} The rendered component.
 */
function TaxonomyItem({
  taxonomy,
  termIds,
  onChange
}) {
  const [search, setSearch] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const [value, setValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(EMPTY_ARRAY);
  const [suggestions, setSuggestions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(EMPTY_ARRAY);
  const debouncedSearch = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__.useDebounce)(setSearch, 250);
  const {
    searchResults,
    searchHasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    if (!search) {
      return {
        searchResults: EMPTY_ARRAY,
        searchHasResolved: true
      };
    }
    const {
      getEntityRecords,
      hasFinishedResolution
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    const selectorArgs = ['taxonomy', taxonomy.slug, {
      ...BASE_QUERY,
      search,
      orderby: 'name',
      exclude: termIds,
      per_page: 20
    }];
    return {
      searchResults: getEntityRecords(...selectorArgs),
      searchHasResolved: hasFinishedResolution('getEntityRecords', selectorArgs)
    };
  }, [search, taxonomy.slug, termIds]);
  // `existingTerms` are the ones fetched from the API and their type is `{ id: number; name: string }`.
  // They are used to extract the terms' names to populate the `FormTokenField` properly
  // and to sanitize the provided `termIds`, by setting only the ones that exist.
  const existingTerms = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    if (!termIds?.length) {
      return EMPTY_ARRAY;
    }
    const {
      getEntityRecords
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    return getEntityRecords('taxonomy', taxonomy.slug, {
      ...BASE_QUERY,
      include: termIds,
      per_page: termIds.length
    });
  }, [taxonomy.slug, termIds]);
  // Update the `value` state only after the selectors are resolved
  // to avoid emptying the input when we're changing terms.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!termIds?.length) {
      setValue(EMPTY_ARRAY);
    }
    if (!existingTerms?.length) {
      return;
    }
    // Returns only the existing entity ids. This prevents the component
    // from crashing in the editor, when non existing ids are provided.
    const sanitizedValue = termIds.reduce((accumulator, id) => {
      const entity = existingTerms.find(term => term.id === id);
      if (entity) {
        accumulator.push({
          id,
          value: entity.name
        });
      }
      return accumulator;
    }, []);
    setValue(sanitizedValue);
  }, [termIds, existingTerms]);
  // Update suggestions only when the query has resolved.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (!searchHasResolved) {
      return;
    }
    setSuggestions(searchResults.map(result => result.name));
  }, [searchResults, searchHasResolved]);
  const onTermsChange = newTermValues => {
    const newTermIds = new Set();
    for (const termValue of newTermValues) {
      const termId = getTermIdByTermValue(searchResults, termValue);
      if (termId) {
        newTermIds.add(termId);
      }
    }
    setSuggestions(EMPTY_ARRAY);
    onChange(Array.from(newTermIds));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
    className: "block-library-query-inspector__taxonomy-control",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FormTokenField, {
      label: taxonomy.name,
      value: value,
      onInputChange: debouncedSearch,
      suggestions: suggestions,
      displayTransform: _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_5__.decodeEntities,
      onChange: onTermsChange,
      __experimentalShowHowTo: false,
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    })
  });
}

/***/ }),

/***/ "./blocks/query/edit/pattern-selection.js":
/*!************************************************!*\
  !*** ./blocks/query/edit/pattern-selection.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PatternSelectionModal: () => (/* binding */ PatternSelectionModal),
/* harmony export */   "default": () => (/* binding */ PatternSelection),
/* harmony export */   useBlockPatterns: () => (/* binding */ useBlockPatterns)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./blocks/query/utils.js");
/* harmony import */ var _utils_search_patterns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/search-patterns */ "./blocks/utils/search-patterns.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * WordPress dependencies
 */






/**
 * Internal dependencies
 */



function PatternSelectionModal({
  clientId,
  attributes,
  setIsPatternSelectionModalOpen
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
    overlayClassName: "block-library-query-pattern__selection-modal",
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Choose a pattern'),
    onRequestClose: () => setIsPatternSelectionModalOpen(false),
    isFullScreen: true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PatternSelection, {
      clientId: clientId,
      attributes: attributes
    })
  });
}
function useBlockPatterns(clientId, attributes) {
  const blockNameForPatterns = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.useBlockNameForPatterns)(clientId, attributes);
  return (0,_utils__WEBPACK_IMPORTED_MODULE_5__.usePatterns)(clientId, blockNameForPatterns);
}
function PatternSelection({
  clientId,
  attributes,
  showTitlesAsTooltip = false,
  showSearch = true
}) {
  const [searchValue, setSearchValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const {
    replaceBlock,
    selectBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  const blockPatterns = useBlockPatterns(clientId, attributes);
  /*
   * When we preview Query Loop blocks we should prefer the current
   * block's postType, which is passed through block context.
   */
  const blockPreviewContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    previewPostType: attributes.query.postType
  }), [attributes.query.postType]);
  const filteredBlockPatterns = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return (0,_utils_search_patterns__WEBPACK_IMPORTED_MODULE_6__.searchPatterns)(blockPatterns, searchValue);
  }, [blockPatterns, searchValue]);
  const onBlockPatternSelect = (pattern, blocks) => {
    const {
      newBlocks,
      queryClientIds
    } = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getTransformedBlocksFromPattern)(blocks, attributes);
    replaceBlock(clientId, newBlocks);
    if (queryClientIds[0]) {
      selectBlock(queryClientIds[0]);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "block-library-query-pattern__selection-content",
    children: [showSearch && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "block-library-query-pattern__selection-search",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SearchControl, {
        __nextHasNoMarginBottom: true,
        onChange: setSearchValue,
        value: searchValue,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search'),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Search')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockContextProvider, {
      value: blockPreviewContext,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalBlockPatternsList, {
        blockPatterns: filteredBlockPatterns,
        onClickPattern: onBlockPatternSelect,
        showTitlesAsTooltip: showTitlesAsTooltip
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/query/edit/query-content.js":
/*!********************************************!*\
  !*** ./blocks/query/edit/query-content.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryContent)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _inspector_controls_enhanced_pagination_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./inspector-controls/enhanced-pagination-control */ "./blocks/query/edit/inspector-controls/enhanced-pagination-control.js");
/* harmony import */ var _utils_lock_unlock__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/lock-unlock */ "./blocks/query/utils/lock-unlock.js");
/* harmony import */ var _inspector_controls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inspector-controls */ "./blocks/query/edit/inspector-controls/index.js");
/* harmony import */ var _enhanced_pagination_modal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./enhanced-pagination-modal */ "./blocks/query/edit/enhanced-pagination-modal.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils */ "./blocks/query/utils.js");
/* harmony import */ var _query_toolbar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./query-toolbar */ "./blocks/query/edit/query-toolbar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__);
/**
 * WordPress dependencies
 */








/**
 * Internal dependencies
 */







// Simple HTML Element Control component

const HTMLElementControl = ({
  tagName,
  onChange,
  options
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('HTML element'),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('HTML element'),
      value: tagName,
      onChange: onChange,
      options: options
    })
  });
};
const DEFAULTS_POSTS_PER_PAGE = 3;
const TEMPLATE = [['core/post-template']];
function QueryContent({
  attributes,
  setAttributes,
  clientId,
  context,
  name
}) {
  const {
    queryId,
    query,
    enhancedPagination,
    tagName: TagName = 'div',
    query: {
      inherit
    } = {}
  } = attributes;
  const {
    templateSlug
  } = context;
  const {
    isSingular
  } = (0,_utils__WEBPACK_IMPORTED_MODULE_11__.getQueryContextFromTemplate)(templateSlug);
  const {
    __unstableMarkNextChangeAsNotPersistent
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.useInstanceId)(QueryContent);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)();
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useInnerBlocksProps)(blockProps, {
    template: TEMPLATE
  });
  const {
    postsPerPage
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getSettings
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    const {
      getEntityRecord,
      getEntityRecordEdits,
      canUser
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__.store);
    const settingPerPage = canUser('read', {
      kind: 'root',
      name: 'site'
    }) ? +getEntityRecord('root', 'site')?.posts_per_page : +getSettings().postsPerPage;

    // Gets changes made via the template area posts per page setting. These won't be saved
    // until the page is saved, but we should reflect this setting within the query loops
    // that inherit it.
    const editedSettingPerPage = +getEntityRecordEdits('root', 'site')?.posts_per_page;
    return {
      postsPerPage: editedSettingPerPage || settingPerPage || DEFAULTS_POSTS_PER_PAGE
    };
  }, []);
  // There are some effects running where some initialization logic is
  // happening and setting some values to some attributes (ex. queryId).
  // These updates can cause an `undo trap` where undoing will result in
  // resetting again, so we need to mark these changes as not persistent
  // with `__unstableMarkNextChangeAsNotPersistent`.

  // Changes in query property (which is an object) need to be in the same callback,
  // because updates are batched after the render and changes in different query properties
  // would cause to override previous wanted changes.
  const updateQuery = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(newQuery => setAttributes(prevAttributes => ({
    query: {
      ...prevAttributes.query,
      ...newQuery
    }
  })), [setAttributes]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    const newQuery = {};
    // When we inherit from global query always need to set the `perPage`
    // based on the reading settings.
    if (inherit && query.perPage !== postsPerPage) {
      newQuery.perPage = postsPerPage;
    } else if (!query.perPage && postsPerPage) {
      newQuery.perPage = postsPerPage;
    }
    if (!!Object.keys(newQuery).length) {
      __unstableMarkNextChangeAsNotPersistent();
      updateQuery(newQuery);
    }
  }, [query.perPage, inherit, postsPerPage, __unstableMarkNextChangeAsNotPersistent, updateQuery]);
  // We need this for multi-query block pagination.
  // Query parameters for each block are scoped to their ID.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!Number.isFinite(queryId)) {
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        queryId: instanceId
      });
    }
  }, [queryId, instanceId, __unstableMarkNextChangeAsNotPersistent, setAttributes]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_query_toolbar__WEBPACK_IMPORTED_MODULE_12__["default"], {
        clientId: clientId,
        attributes: attributes,
        hasInnerBlocks: true
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_enhanced_pagination_modal__WEBPACK_IMPORTED_MODULE_10__["default"], {
      attributes: attributes,
      setAttributes: setAttributes,
      clientId: clientId
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_inspector_controls__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: name,
        attributes: attributes,
        setQuery: updateQuery,
        setAttributes: setAttributes,
        clientId: clientId,
        isSingular: isSingular
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
      group: "advanced",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(HTMLElementControl, {
        tagName: TagName,
        onChange: value => setAttributes({
          tagName: value
        }),
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Default (<div>)'),
          value: 'div'
        }, {
          label: '<main>',
          value: 'main'
        }, {
          label: '<section>',
          value: 'section'
        }, {
          label: '<aside>',
          value: 'aside'
        }]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_inspector_controls_enhanced_pagination_control__WEBPACK_IMPORTED_MODULE_7__["default"], {
        enhancedPagination: enhancedPagination,
        setAttributes: setAttributes,
        clientId: clientId
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(TagName, {
      ...innerBlocksProps
    })]
  });
}

/***/ }),

/***/ "./blocks/query/edit/query-placeholder.js":
/*!************************************************!*\
  !*** ./blocks/query/edit/query-placeholder.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryPlaceholder)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils */ "./blocks/query/utils.js");
/* harmony import */ var _pattern_selection__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pattern-selection */ "./blocks/query/edit/pattern-selection.js");
/* harmony import */ var _query_toolbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./query-toolbar */ "./blocks/query/edit/query-toolbar.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);
/**
 * WordPress dependencies
 */








/**
 * Internal dependencies
 */




function QueryPlaceholder({
  attributes,
  clientId,
  name,
  openPatternSelectionModal
}) {
  const [isStartingBlank, setIsStartingBlank] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [containerWidth, setContainerWidth] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(0);

  // Use ResizeObserver to monitor container width.
  const resizeObserverRef = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__.useResizeObserver)(([entry]) => {
    setContainerWidth(entry.contentRect.width);
  });
  const SMALL_CONTAINER_BREAKPOINT = 160;
  const isSmallContainer = containerWidth > 0 && containerWidth < SMALL_CONTAINER_BREAKPOINT;
  const {
    blockType,
    activeBlockVariation
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getActiveBlockVariation,
      getBlockType
    } = select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.store);
    return {
      blockType: getBlockType(name),
      activeBlockVariation: getActiveBlockVariation(name, attributes)
    };
  }, [name, attributes]);
  const hasPatterns = !!(0,_pattern_selection__WEBPACK_IMPORTED_MODULE_8__.useBlockPatterns)(clientId, attributes).length;
  const icon = activeBlockVariation?.icon?.src || activeBlockVariation?.icon || blockType?.icon?.src;
  const label = activeBlockVariation?.title || blockType?.title;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    ref: resizeObserverRef
  });
  if (isStartingBlank) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(QueryVariationPicker, {
      clientId: clientId,
      attributes: attributes,
      icon: icon,
      label: label
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_query_toolbar__WEBPACK_IMPORTED_MODULE_9__["default"], {
        clientId: clientId,
        attributes: attributes,
        hasInnerBlocks: false
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Placeholder, {
      className: "block-editor-media-placeholder",
      icon: !isSmallContainer && icon,
      label: !isSmallContainer && label,
      instructions: !isSmallContainer && (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Choose a pattern for the query loop or start blank.'),
      withIllustration: isSmallContainer,
      children: [!!hasPatterns && !isSmallContainer && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        __next40pxDefaultSize: true,
        variant: "primary",
        onClick: openPatternSelectionModal,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Choose')
      }), !isSmallContainer && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: () => {
          setIsStartingBlank(true);
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Start blank')
      })]
    })]
  });
}
function QueryVariationPicker({
  clientId,
  attributes,
  icon,
  label
}) {
  const scopeVariations = (0,_utils__WEBPACK_IMPORTED_MODULE_7__.useScopedBlockVariations)(attributes);
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.__experimentalBlockVariationPicker, {
      icon: icon,
      label: label,
      variations: scopeVariations,
      onSelect: variation => {
        if (variation.innerBlocks) {
          replaceInnerBlocks(clientId, (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.createBlocksFromInnerBlocksTemplate)(variation.innerBlocks), false);
        }
      }
    })
  });
}

/***/ }),

/***/ "./blocks/query/edit/query-toolbar.js":
/*!********************************************!*\
  !*** ./blocks/query/edit/query-toolbar.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryToolbar)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _pattern_selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pattern-selection */ "./blocks/query/edit/pattern-selection.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


function QueryToolbar({
  clientId,
  attributes,
  hasInnerBlocks
}) {
  const hasPatterns = (0,_pattern_selection__WEBPACK_IMPORTED_MODULE_2__.useBlockPatterns)(clientId, attributes).length;
  if (!hasPatterns) {
    return null;
  }
  const buttonLabel = hasInnerBlocks ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Change design') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose pattern');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToolbarGroup, {
    className: "wp-block-template-part__block-control-group",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalDropdownContentWrapper, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Dropdown, {
        contentClassName: "block-editor-block-settings-menu__popover",
        focusOnMount: "firstElement",
        expandOnMobile: true,
        renderToggle: ({
          isOpen,
          onToggle
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToolbarButton, {
          "aria-haspopup": "true",
          "aria-expanded": isOpen,
          onClick: onToggle,
          children: buttonLabel
        }),
        renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_pattern_selection__WEBPACK_IMPORTED_MODULE_2__["default"], {
          clientId: clientId,
          attributes: attributes,
          showSearch: false,
          showTitlesAsTooltip: true
        })
      })
    })
  });
}

/***/ }),

/***/ "./blocks/query/icons.js":
/*!*******************************!*\
  !*** ./blocks/query/icons.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   imageDateTitle: () => (/* binding */ imageDateTitle),
/* harmony export */   titleDate: () => (/* binding */ titleDate),
/* harmony export */   titleDateExcerpt: () => (/* binding */ titleDateExcerpt),
/* harmony export */   titleExcerpt: () => (/* binding */ titleExcerpt)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const titleDate = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M41 9H7v3h34V9zm-22 5H7v1h12v-1zM7 26h12v1H7v-1zm34-5H7v3h34v-3zM7 38h12v1H7v-1zm34-5H7v3h34v-3z"
  })
});
const titleExcerpt = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M41 9H7v3h34V9zm-4 5H7v1h30v-1zm4 3H7v1h34v-1zM7 20h30v1H7v-1zm0 12h30v1H7v-1zm34 3H7v1h34v-1zM7 38h30v1H7v-1zm34-11H7v3h34v-3z"
  })
});
const titleDateExcerpt = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M41 9H7v3h34V9zm-22 5H7v1h12v-1zm22 3H7v1h34v-1zM7 20h34v1H7v-1zm0 12h12v1H7v-1zm34 3H7v1h34v-1zM7 38h34v1H7v-1zm34-11H7v3h34v-3z"
  })
});
const imageDateTitle = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 48 48",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M7 9h34v6H7V9zm12 8H7v1h12v-1zm18 3H7v1h30v-1zm0 18H7v1h30v-1zM7 35h12v1H7v-1zm34-8H7v6h34v-6z"
  })
});

/***/ }),

/***/ "./blocks/query/index.js":
/*!*******************************!*\
  !*** ./blocks/query/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _block_json__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   settings: () => (/* binding */ settings)
/* harmony export */ });
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/loop.js");
/* harmony import */ var _utils_init_block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/init-block */ "./blocks/utils/init-block.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/query/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/query/edit/index.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/query/save.js");
/* harmony import */ var _variations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./variations */ "./blocks/query/variations.js");
/* harmony import */ var _deprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deprecated */ "./blocks/query/deprecated.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */






const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_2__;

const settings = {
  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_0__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  example: {
    viewportWidth: 650,
    attributes: {
      namespace: 'core/posts-list',
      query: {
        perPage: 4,
        pages: 1,
        offset: 0,
        postType: 'post',
        order: 'desc',
        orderBy: 'date',
        author: '',
        search: '',
        sticky: 'exclude',
        inherit: false
      }
    },
    innerBlocks: [{
      name: 'core/post-template',
      attributes: {
        layout: {
          type: 'grid',
          columnCount: 2
        }
      },
      innerBlocks: [{
        name: 'core/post-title'
      }, {
        name: 'core/post-date'
      }, {
        name: 'core/post-excerpt'
      }]
    }]
  },
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"],
  variations: _variations__WEBPACK_IMPORTED_MODULE_5__["default"],
  deprecated: _deprecated__WEBPACK_IMPORTED_MODULE_6__["default"]
};
const init = () => (0,_utils_init_block__WEBPACK_IMPORTED_MODULE_1__["default"])({
  name,
  metadata: _block_json__WEBPACK_IMPORTED_MODULE_2__,
  settings
});

/***/ }),

/***/ "./blocks/query/save.js":
/*!******************************!*\
  !*** ./blocks/query/save.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


function save({
  attributes: {
    tagName: Tag = 'div'
  }
}) {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save(blockProps);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Tag, {
    ...innerBlocksProps
  });
}

/***/ }),

/***/ "./blocks/query/utils.js":
/*!*******************************!*\
  !*** ./blocks/query/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getEntitiesInfo: () => (/* binding */ getEntitiesInfo),
/* harmony export */   getQueryContextFromTemplate: () => (/* binding */ getQueryContextFromTemplate),
/* harmony export */   getTransformedBlocksFromPattern: () => (/* binding */ getTransformedBlocksFromPattern),
/* harmony export */   getValueFromObjectPath: () => (/* binding */ getValueFromObjectPath),
/* harmony export */   isControlAllowed: () => (/* binding */ isControlAllowed),
/* harmony export */   mapToIHasNameAndId: () => (/* binding */ mapToIHasNameAndId),
/* harmony export */   useAllowedControls: () => (/* binding */ useAllowedControls),
/* harmony export */   useBlockNameForPatterns: () => (/* binding */ useBlockNameForPatterns),
/* harmony export */   useIsPostTypeHierarchical: () => (/* binding */ useIsPostTypeHierarchical),
/* harmony export */   useOrderByOptions: () => (/* binding */ useOrderByOptions),
/* harmony export */   usePatterns: () => (/* binding */ usePatterns),
/* harmony export */   usePostTypes: () => (/* binding */ usePostTypes),
/* harmony export */   useScopedBlockVariations: () => (/* binding */ useScopedBlockVariations),
/* harmony export */   useTaxonomies: () => (/* binding */ useTaxonomies),
/* harmony export */   useUnsupportedBlocks: () => (/* binding */ useUnsupportedBlocks)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/html-entities */ "@wordpress/html-entities");
/* harmony import */ var _wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/**
 * WordPress dependencies
 */








/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */
/** @typedef {import('@wordpress/components/build-types/query-controls/types').OrderByOption} OrderByOption */

/**
 * @typedef IHasNameAndId
 * @property {string|number} id   The entity's id.
 * @property {string}        name The entity's name.
 */

/**
 * The object used in Query block that contains info and helper mappings
 * from an array of IHasNameAndId objects.
 *
 * @typedef {Object} QueryEntitiesInfo
 * @property {IHasNameAndId[]}               entities  The array of entities.
 * @property {Object<string, IHasNameAndId>} mapById   Object mapping with the id as key and the entity as value.
 * @property {Object<string, IHasNameAndId>} mapByName Object mapping with the name as key and the entity as value.
 * @property {string[]}                      names     Array with the entities' names.
 */

/**
 * Returns a helper object with mapping from Objects that implement
 * the `IHasNameAndId` interface. The returned object is used for
 * integration with `FormTokenField` component.
 *
 * @param {IHasNameAndId[]} entities The entities to extract of helper object.
 * @return {QueryEntitiesInfo} The object with the entities information.
 */
const getEntitiesInfo = entities => {
  const mapping = entities?.reduce((accumulator, entity) => {
    const {
      mapById,
      mapByName,
      names
    } = accumulator;
    mapById[entity.id] = entity;
    mapByName[entity.name] = entity;
    names.push(entity.name);
    return accumulator;
  }, {
    mapById: {},
    mapByName: {},
    names: []
  });
  return {
    entities,
    ...mapping
  };
};

/**
 * Helper util to return a value from a certain path of the object.
 * Path is specified as a string of properties, separated by dots,
 * for example: "parent.child".
 *
 * @param {Object} object Input object.
 * @param {string} path   Path to the object property.
 * @return {*} Value of the object property at the specified path.
 */
const getValueFromObjectPath = (object, path) => {
  const normalizedPath = path.split('.');
  let value = object;
  normalizedPath.forEach(fieldName => {
    value = value?.[fieldName];
  });
  return value;
};

/**
 * Helper util to map records to add a `name` prop from a
 * provided path, in order to handle all entities in the same
 * fashion(implementing`IHasNameAndId` interface).
 *
 * @param {Object[]} entities The array of entities.
 * @param {string}   path     The path to map a `name` property from the entity.
 * @return {IHasNameAndId[]} An array of entities that now implement the `IHasNameAndId` interface.
 */
const mapToIHasNameAndId = (entities, path) => {
  return (entities || []).map(entity => ({
    ...entity,
    name: (0,_wordpress_html_entities__WEBPACK_IMPORTED_MODULE_4__.decodeEntities)(getValueFromObjectPath(entity, path))
  }));
};

/**
 * Returns a helper object that contains:
 * 1. An `options` object from the available post types, to be passed to a `SelectControl`.
 * 2. A helper map with available taxonomies per post type.
 * 3. A helper map with post format support per post type.
 *
 * @return {Object} The helper object related to post types.
 */
const usePostTypes = () => {
  const postTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getPostTypes
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    const excludedPostTypes = ['attachment'];
    const filteredPostTypes = getPostTypes({
      per_page: -1
    })?.filter(({
      viewable,
      slug
    }) => viewable && !excludedPostTypes.includes(slug));
    return filteredPostTypes;
  }, []);
  const postTypesTaxonomiesMap = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!postTypes?.length) {
      return;
    }
    return postTypes.reduce((accumulator, type) => {
      accumulator[type.slug] = type.taxonomies;
      return accumulator;
    }, {});
  }, [postTypes]);
  const postTypesSelectOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => (postTypes || []).map(({
    labels,
    slug
  }) => ({
    label: labels.singular_name,
    value: slug
  })), [postTypes]);
  const postTypeFormatSupportMap = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (!postTypes?.length) {
      return {};
    }
    return postTypes.reduce((accumulator, type) => {
      accumulator[type.slug] = type.supports?.['post-formats'] || false;
      return accumulator;
    }, {});
  }, [postTypes]);
  return {
    postTypesTaxonomiesMap,
    postTypesSelectOptions,
    postTypeFormatSupportMap
  };
};

/**
 * Hook that returns the taxonomies associated with a specific post type.
 *
 * @param {string} postType The post type from which to retrieve the associated taxonomies.
 * @return {Object[]} An array of the associated taxonomies.
 */
const useTaxonomies = postType => {
  const taxonomies = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getTaxonomies,
      getPostType
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    // Does the post type have taxonomies?
    if (getPostType(postType)?.taxonomies?.length > 0) {
      return getTaxonomies({
        type: postType,
        per_page: -1
      });
    }
    return [];
  }, [postType]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    return taxonomies?.filter(({
      visibility
    }) => !!visibility?.publicly_queryable);
  }, [taxonomies]);
};

/**
 * Hook that returns whether a specific post type is hierarchical.
 *
 * @param {string} postType The post type to check.
 * @return {boolean} Whether a specific post type is hierarchical.
 */
function useIsPostTypeHierarchical(postType) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const type = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getPostType(postType);
    return type?.viewable && type?.hierarchical;
  }, [postType]);
}

/**
 * List of avaiable options to order by.
 *
 * @param {string} postType The post type to check.
 * @return {OrderByOption[]} List of order options.
 */
function useOrderByOptions(postType) {
  const supportsCustomOrder = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const type = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getPostType(postType);
    return !!type?.supports?.['page-attributes'];
  }, [postType]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    const orderByOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Newest to oldest'),
      value: 'date/desc'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Oldest to newest'),
      value: 'date/asc'
    }, {
      /* translators: Label for ordering posts by title in ascending order. */
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('A → Z'),
      value: 'title/asc'
    }, {
      /* translators: Label for ordering posts by title in descending order. */
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Z → A'),
      value: 'title/desc'
    }];
    if (supportsCustomOrder) {
      orderByOptions.push({
        /* translators: Label for ordering posts by ascending menu order. */
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Ascending by order'),
        value: 'menu_order/asc'
      }, {
        /* translators: Label for ordering posts by descending menu order. */
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Descending by order'),
        value: 'menu_order/desc'
      });
    }
    return orderByOptions;
  }, [supportsCustomOrder]);
}

/**
 * Hook that returns the query properties' names defined by the active
 * block variation, to determine which block's filters to show.
 *
 * @param {Object} attributes Block attributes.
 * @return {string[]} An array of the query attributes.
 */
function useAllowedControls(attributes) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.store).getActiveBlockVariation('core/query', attributes)?.allowedControls, [attributes]);
}
function isControlAllowed(allowedControls, key) {
  // Every controls is allowed if the list is not defined.
  if (!allowedControls) {
    return true;
  }
  return allowedControls.includes(key);
}

/**
 * Clones a pattern's blocks and then recurses over that list of blocks,
 * transforming them to retain some `query` attribute properties.
 * For now we retain the `postType` and `inherit` properties as they are
 * fundamental for the expected functionality of the block and don't affect
 * its design and presentation.
 *
 * Returns the cloned/transformed blocks and array of existing Query Loop
 * client ids for further manipulation, in order to avoid multiple recursions.
 *
 * @param {WPBlock[]}        blocks               The list of blocks to look through and transform(mutate).
 * @param {Record<string,*>} queryBlockAttributes The existing Query Loop's attributes.
 * @return {{ newBlocks: WPBlock[], queryClientIds: string[] }} An object with the cloned/transformed blocks and all the Query Loop clients from these blocks.
 */
const getTransformedBlocksFromPattern = (blocks, queryBlockAttributes) => {
  const {
    query: {
      postType,
      inherit
    },
    namespace
  } = queryBlockAttributes;
  const clonedBlocks = blocks.map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.cloneBlock)(block));
  const queryClientIds = [];
  const blocksQueue = [...clonedBlocks];
  while (blocksQueue.length > 0) {
    const block = blocksQueue.shift();
    if (block.name === 'core/query') {
      block.attributes.query = {
        ...block.attributes.query,
        postType,
        inherit
      };
      if (namespace) {
        block.attributes.namespace = namespace;
      }
      queryClientIds.push(block.clientId);
    }
    block.innerBlocks?.forEach(innerBlock => {
      blocksQueue.push(innerBlock);
    });
  }
  return {
    newBlocks: clonedBlocks,
    queryClientIds
  };
};

/**
 * Helper hook that determines if there is an active variation of the block
 * and if there are available specific patterns for this variation.
 * If there are, these patterns are going to be the only ones suggested to
 * the user in setup and replace flow, without including the default ones
 * for Query Loop.
 *
 * If there are no such patterns, the default ones for Query Loop are going
 * to be suggested.
 *
 * @param {string} clientId   The block's client ID.
 * @param {Object} attributes The block's attributes.
 * @return {string} The block name to be used in the patterns suggestions.
 */
function useBlockNameForPatterns(clientId, attributes) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const activeVariationName = select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.store).getActiveBlockVariation('core/query', attributes)?.name;
    if (!activeVariationName) {
      return 'core/query';
    }
    const {
      getBlockRootClientId,
      getPatternsByBlockTypes
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    const rootClientId = getBlockRootClientId(clientId);
    const activePatterns = getPatternsByBlockTypes(`core/query/${activeVariationName}`, rootClientId);
    return activePatterns.length > 0 ? `core/query/${activeVariationName}` : 'core/query';
  }, [clientId, attributes]);
}

/**
 * Helper hook that determines if there is an active variation of the block
 * and if there are available specific scoped `block` variations connected with
 * this variation.
 *
 * If there are, these variations are going to be the only ones suggested
 * to the user in setup flow when clicking to `start blank`, without including
 * the default ones for Query Loop.
 *
 * If there are no such scoped `block` variations, the default ones for Query
 * Loop are going to be suggested.
 *
 * The way we determine such variations is with the convention that they have the `namespace`
 * attribute defined as an array. This array should contain the names(`name` property) of any
 * variations they want to be connected to.
 * For example, if we have a `Query Loop` scoped `inserter` variation with the name `products`,
 * we can connect a scoped `block` variation by setting its `namespace` attribute to `['products']`.
 * If the user selects this variation, the `namespace` attribute will be overridden by the
 * main `inserter` variation.
 *
 * @param {Object} attributes The block's attributes.
 * @return {WPBlockVariation[]} The block variations to be suggested in setup flow, when clicking to `start blank`.
 */
function useScopedBlockVariations(attributes) {
  const {
    activeVariationName,
    blockVariations
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getActiveBlockVariation,
      getBlockVariations
    } = select(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.store);
    return {
      activeVariationName: getActiveBlockVariation('core/query', attributes)?.name,
      blockVariations: getBlockVariations('core/query', 'block')
    };
  }, [attributes]);
  const variations = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    // Filter out the variations that have defined a `namespace` attribute,
    // which means they are 'connected' to specific variations of the block.
    const isNotConnected = variation => !variation.attributes?.namespace;
    if (!activeVariationName) {
      return blockVariations.filter(isNotConnected);
    }
    const connectedVariations = blockVariations.filter(variation => variation.attributes?.namespace?.includes(activeVariationName));
    if (!!connectedVariations.length) {
      return connectedVariations;
    }
    return blockVariations.filter(isNotConnected);
  }, [activeVariationName, blockVariations]);
  return variations;
}

/**
 * Hook that returns the block patterns for a specific block type.
 *
 * @param {string} clientId The block's client ID.
 * @param {string} name     The block type name.
 * @return {Object[]} An array of valid block patterns.
 */
const usePatterns = (clientId, name) => {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getBlockRootClientId,
      getPatternsByBlockTypes
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    const rootClientId = getBlockRootClientId(clientId);
    return getPatternsByBlockTypes(name, rootClientId);
  }, [name, clientId]);
};

/**
 * The object returned by useUnsupportedBlocks with info about the type of
 * unsupported blocks present inside the Query block.
 *
 * @typedef  {Object}  UnsupportedBlocksInfo
 * @property {boolean} hasBlocksFromPlugins True if blocks from plugins are present.
 * @property {boolean} hasPostContentBlock  True if a 'core/post-content' block is present.
 * @property {boolean} hasUnsupportedBlocks True if there are any unsupported blocks.
 */

/**
 * Hook that returns an object with information about the unsupported blocks
 * present inside a Query Loop with the given `clientId`. The returned object
 * contains props that are true when a certain type of unsupported block is
 * present.
 *
 * @param {string} clientId The block's client ID.
 * @return {UnsupportedBlocksInfo} The object containing the information.
 */
const useUnsupportedBlocks = clientId => {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getClientIdsOfDescendants,
      getBlockName
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
    const blocks = {};
    getClientIdsOfDescendants(clientId).forEach(descendantClientId => {
      const blockName = getBlockName(descendantClientId);
      /*
       * Client side navigation can be true in two states:
       *  - supports.interactivity = true;
       *  - supports.interactivity.clientNavigation = true;
       */
      const blockSupportsInteractivity = Object.is((0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.getBlockSupport)(blockName, 'interactivity'), true);
      const blockSupportsInteractivityClientNavigation = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.getBlockSupport)(blockName, 'interactivity.clientNavigation');
      const blockInteractivity = blockSupportsInteractivity || blockSupportsInteractivityClientNavigation;
      if (!blockInteractivity) {
        blocks.hasBlocksFromPlugins = true;
      } else if (blockName === 'core/post-content') {
        blocks.hasPostContentBlock = true;
      }
    });
    blocks.hasUnsupportedBlocks = blocks.hasBlocksFromPlugins || blocks.hasPostContentBlock;
    return blocks;
  }, [clientId]);
};

/**
 * Helper function that returns the query context from the editor based on the
 * available template slug.
 *
 * @param {string} templateSlug Current template slug based on context.
 * @return {Object} An object with isSingular and templateType properties.
 */
function getQueryContextFromTemplate(templateSlug) {
  // In the Post Editor, the template slug is not available.
  if (!templateSlug) {
    return {
      isSingular: true
    };
  }
  let isSingular = false;
  let templateType = templateSlug === 'wp' ? 'custom' : templateSlug;
  const singularTemplates = ['404', 'blank', 'single', 'page', 'custom'];
  const templateTypeFromSlug = templateSlug.includes('-') ? templateSlug.split('-', 1)[0] : templateSlug;
  const queryFromTemplateSlug = templateSlug.includes('-') ? templateSlug.split('-').slice(1).join('-') : '';
  if (queryFromTemplateSlug) {
    templateType = templateTypeFromSlug;
  }
  isSingular = singularTemplates.includes(templateType);
  return {
    isSingular,
    templateType
  };
}

/***/ }),

/***/ "./blocks/query/utils/lock-unlock.js":
/*!*******************************************!*\
  !*** ./blocks/query/utils/lock-unlock.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearBlockSelection: () => (/* binding */ clearBlockSelection),
/* harmony export */   getBlock: () => (/* binding */ getBlock),
/* harmony export */   getBlockEditorSettings: () => (/* binding */ getBlockEditorSettings),
/* harmony export */   getBlockTypes: () => (/* binding */ getBlockTypes),
/* harmony export */   getBlocks: () => (/* binding */ getBlocks),
/* harmony export */   insertBlock: () => (/* binding */ insertBlock),
/* harmony export */   lock: () => (/* binding */ lock),
/* harmony export */   multiSelect: () => (/* binding */ multiSelect),
/* harmony export */   removeBlock: () => (/* binding */ removeBlock),
/* harmony export */   replaceBlock: () => (/* binding */ replaceBlock),
/* harmony export */   replaceInnerBlocks: () => (/* binding */ replaceInnerBlocks),
/* harmony export */   selectBlock: () => (/* binding */ selectBlock),
/* harmony export */   toggleBlockSelection: () => (/* binding */ toggleBlockSelection),
/* harmony export */   unlock: () => (/* binding */ unlock),
/* harmony export */   updateBlockAttributes: () => (/* binding */ updateBlockAttributes),
/* harmony export */   updateBlockEditorSettings: () => (/* binding */ updateBlockEditorSettings)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */



/**
 * Wrapper functions to access block editor functionality
 * Instead of using private APIs, we use public APIs
 */

// Get block editor settings
function getBlockEditorSettings() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getSettings();
}

// Update block editor settings
function updateBlockEditorSettings(settings) {
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).updateSettings(settings);
}

// Get block types
function getBlockTypes() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlockTypes();
}

// Get block by client ID
function getBlock(clientId) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlock(clientId);
}

// Get blocks
function getBlocks() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlocks();
}

// Insert block
function insertBlock(block, index) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).insertBlock(block, index);
}

// Replace block
function replaceBlock(clientId, block) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).replaceBlock(clientId, block);
}

// Remove block
function removeBlock(clientId) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).removeBlock(clientId);
}

// Select block
function selectBlock(clientId) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).selectBlock(clientId);
}

// Multi select blocks
function multiSelect(start, end) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).multiSelect(start, end);
}

// Clear block selection
function clearBlockSelection() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).clearBlockSelection();
}

// Toggle block selection
function toggleBlockSelection(clientId, isSelected) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).toggleBlockSelection(clientId, isSelected);
}

// Replace inner blocks
function replaceInnerBlocks(clientId, blocks, updateSelection) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).replaceInnerBlocks(clientId, blocks, updateSelection);
}

// Update block attributes
function updateBlockAttributes(clientId, attributes) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).updateBlockAttributes(clientId, attributes);
}

// For backward compatibility, export empty lock/unlock functions
const lock = () => {};
const unlock = () => {};

/***/ }),

/***/ "./blocks/query/variations.js":
/*!************************************!*\
  !*** ./blocks/query/variations.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons */ "./blocks/query/icons.js");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */

const variations = [{
  name: 'title-date',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title & Date'),
  icon: _icons__WEBPACK_IMPORTED_MODULE_1__.titleDate,
  attributes: {},
  innerBlocks: [['core/post-template', {}, [['core/post-title'], ['core/post-date']]], ['core/query-pagination'], ['core/query-no-results']],
  scope: ['block']
}, {
  name: 'title-excerpt',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title & Excerpt'),
  icon: _icons__WEBPACK_IMPORTED_MODULE_1__.titleExcerpt,
  attributes: {},
  innerBlocks: [['core/post-template', {}, [['core/post-title'], ['core/post-excerpt']]], ['core/query-pagination'], ['core/query-no-results']],
  scope: ['block']
}, {
  name: 'title-date-excerpt',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title, Date, & Excerpt'),
  icon: _icons__WEBPACK_IMPORTED_MODULE_1__.titleDateExcerpt,
  attributes: {},
  innerBlocks: [['core/post-template', {}, [['core/post-title'], ['core/post-date'], ['core/post-excerpt']]], ['core/query-pagination'], ['core/query-no-results']],
  scope: ['block']
}, {
  name: 'image-date-title',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image, Date, & Title'),
  icon: _icons__WEBPACK_IMPORTED_MODULE_1__.imageDateTitle,
  attributes: {},
  innerBlocks: [['core/post-template', {}, [['core/post-featured-image'], ['core/post-date'], ['core/post-title']]], ['core/query-pagination'], ['core/query-no-results']],
  scope: ['block']
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (variations);

/***/ }),

/***/ "./blocks/utils/hooks.js":
/*!*******************************!*\
  !*** ./blocks/utils/hooks.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCanEditEntity: () => (/* binding */ useCanEditEntity),
/* harmony export */   useToolsPanelDropdownMenuProps: () => (/* binding */ useToolsPanelDropdownMenuProps),
/* harmony export */   useUploadMediaFromBlobURL: () => (/* binding */ useUploadMediaFromBlobURL)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blob */ "@wordpress/blob");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WordPress dependencies
 */







/**
 * Returns whether the current user can edit the given entity.
 *
 * @param {string} kind     Entity kind.
 * @param {string} name     Entity name.
 * @param {string} recordId Record's id.
 */
function useCanEditEntity(kind, name, recordId) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).canUser('update', {
    kind,
    name,
    id: recordId
  }), [kind, name, recordId]);
}

/**
 * Handles uploading a media file from a blob URL on mount.
 *
 * @param {Object}   args              Upload media arguments.
 * @param {string}   args.url          Blob URL.
 * @param {?Array}   args.allowedTypes Array of allowed media types.
 * @param {Function} args.onChange     Function called when the media is uploaded.
 * @param {Function} args.onError      Function called when an error happens.
 */
function useUploadMediaFromBlobURL(args = {}) {
  const latestArgsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(args);
  const hasUploadStartedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
  const {
    getSettings
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    latestArgsRef.current = args;
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    // Uploading is a special effect that can't be canceled via the cleanup method.
    // The extra check avoids duplicate uploads in development mode (React.StrictMode).
    if (hasUploadStartedRef.current) {
      return;
    }
    if (!latestArgsRef.current.url || !(0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__.isBlobURL)(latestArgsRef.current.url)) {
      return;
    }
    const file = (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__.getBlobByURL)(latestArgsRef.current.url);
    if (!file) {
      return;
    }
    const {
      url,
      allowedTypes,
      onChange,
      onError
    } = latestArgsRef.current;
    const {
      mediaUpload
    } = getSettings();
    hasUploadStartedRef.current = true;
    mediaUpload({
      filesList: [file],
      allowedTypes,
      onFileChange: ([media]) => {
        if ((0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__.isBlobURL)(media?.url)) {
          return;
        }
        (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__.revokeBlobURL)(url);
        onChange(media);
        hasUploadStartedRef.current = false;
      },
      onError: message => {
        (0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_2__.revokeBlobURL)(url);
        onError(message);
        hasUploadStartedRef.current = false;
      }
    });
  }, [getSettings]);
}
function useToolsPanelDropdownMenuProps() {
  const isMobile = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.useViewportMatch)('medium', '<');
  return !isMobile ? {
    popoverProps: {
      placement: 'left-start',
      // For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
      offset: 259
    }
  } : {};
}

/***/ }),

/***/ "./blocks/utils/init-block.js":
/*!************************************!*\
  !*** ./blocks/utils/init-block.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initBlock)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 * @return {WPBlockType | undefined} The block, if it has been successfully registered;
 *                        otherwise `undefined`.
 */
function initBlock(block) {
  if (!block) {
    return;
  }
  const {
    metadata,
    settings,
    name
  } = block;
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)({
    name,
    ...metadata
  }, settings);
}

/***/ }),

/***/ "./blocks/utils/search-patterns.js":
/*!*****************************************!*\
  !*** ./blocks/utils/search-patterns.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPatternSearchRank: () => (/* binding */ getPatternSearchRank),
/* harmony export */   normalizeSearchInput: () => (/* binding */ normalizeSearchInput),
/* harmony export */   searchPatterns: () => (/* binding */ searchPatterns)
/* harmony export */ });
/* harmony import */ var remove_accents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! remove-accents */ "./node_modules/remove-accents/index.js");
/* harmony import */ var remove_accents__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(remove_accents__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */


/**
 * Sanitizes the search input string.
 *
 * @param {string} input The search input to normalize.
 *
 * @return {string} The normalized search input.
 */
function normalizeSearchInput(input = '') {
  // Disregard diacritics.
  input = remove_accents__WEBPACK_IMPORTED_MODULE_0___default()(input);

  // Trim & Lowercase.
  input = input.trim().toLowerCase();
  return input;
}

/**
 * Get the search rank for a given pattern and a specific search term.
 *
 * @param {Object} pattern     Pattern to rank
 * @param {string} searchValue Search term
 * @return {number} A pattern search rank
 */
function getPatternSearchRank(pattern, searchValue) {
  const normalizedSearchValue = normalizeSearchInput(searchValue);
  const normalizedTitle = normalizeSearchInput(pattern.title);
  let rank = 0;
  if (normalizedSearchValue === normalizedTitle) {
    rank += 30;
  } else if (normalizedTitle.startsWith(normalizedSearchValue)) {
    rank += 20;
  } else {
    const searchTerms = normalizedSearchValue.split(' ');
    const hasMatchedTerms = searchTerms.every(searchTerm => normalizedTitle.includes(searchTerm));

    // Prefer pattern with every search word in the title.
    if (hasMatchedTerms) {
      rank += 10;
    }
  }
  return rank;
}

/**
 * Filters an pattern list given a search term.
 *
 * @param {Array}  patterns    Item list
 * @param {string} searchValue Search input.
 *
 * @return {Array} Filtered pattern list.
 */
function searchPatterns(patterns = [], searchValue = '') {
  if (!searchValue) {
    return patterns;
  }
  const rankedPatterns = patterns.map(pattern => {
    return [pattern, getPatternSearchRank(pattern, searchValue)];
  }).filter(([, rank]) => rank > 0);
  rankedPatterns.sort(([, rank1], [, rank2]) => rank2 - rank1);
  return rankedPatterns.map(([pattern]) => pattern);
}

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/loop.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/loop.js ***!
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


const loop = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M18.1823 11.6392C18.1823 13.0804 17.0139 14.2487 15.5727 14.2487C14.3579 14.2487 13.335 13.4179 13.0453 12.2922L13.0377 12.2625L13.0278 12.2335L12.3985 10.377L12.3942 10.3785C11.8571 8.64997 10.246 7.39405 8.33961 7.39405C5.99509 7.39405 4.09448 9.29465 4.09448 11.6392C4.09448 13.9837 5.99509 15.8843 8.33961 15.8843C8.88499 15.8843 9.40822 15.781 9.88943 15.5923L9.29212 14.0697C8.99812 14.185 8.67729 14.2487 8.33961 14.2487C6.89838 14.2487 5.73003 13.0804 5.73003 11.6392C5.73003 10.1979 6.89838 9.02959 8.33961 9.02959C9.55444 9.02959 10.5773 9.86046 10.867 10.9862L10.8772 10.9836L11.4695 12.7311C11.9515 14.546 13.6048 15.8843 15.5727 15.8843C17.9172 15.8843 19.8178 13.9837 19.8178 11.6392C19.8178 9.29465 17.9172 7.39404 15.5727 7.39404C15.0287 7.39404 14.5066 7.4968 14.0264 7.6847L14.6223 9.20781C14.9158 9.093 15.2358 9.02959 15.5727 9.02959C17.0139 9.02959 18.1823 10.1979 18.1823 11.6392Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loop);
//# sourceMappingURL=loop.js.map

/***/ }),

/***/ "./node_modules/remove-accents/index.js":
/*!**********************************************!*\
  !*** ./node_modules/remove-accents/index.js ***!
  \**********************************************/
/***/ ((module) => {

var characterMap = {
	"À": "A",
	"Á": "A",
	"Â": "A",
	"Ã": "A",
	"Ä": "A",
	"Å": "A",
	"Ấ": "A",
	"Ắ": "A",
	"Ẳ": "A",
	"Ẵ": "A",
	"Ặ": "A",
	"Æ": "AE",
	"Ầ": "A",
	"Ằ": "A",
	"Ȃ": "A",
	"Ả": "A",
	"Ạ": "A",
	"Ẩ": "A",
	"Ẫ": "A",
	"Ậ": "A",
	"Ç": "C",
	"Ḉ": "C",
	"È": "E",
	"É": "E",
	"Ê": "E",
	"Ë": "E",
	"Ế": "E",
	"Ḗ": "E",
	"Ề": "E",
	"Ḕ": "E",
	"Ḝ": "E",
	"Ȇ": "E",
	"Ẻ": "E",
	"Ẽ": "E",
	"Ẹ": "E",
	"Ể": "E",
	"Ễ": "E",
	"Ệ": "E",
	"Ì": "I",
	"Í": "I",
	"Î": "I",
	"Ï": "I",
	"Ḯ": "I",
	"Ȋ": "I",
	"Ỉ": "I",
	"Ị": "I",
	"Ð": "D",
	"Ñ": "N",
	"Ò": "O",
	"Ó": "O",
	"Ô": "O",
	"Õ": "O",
	"Ö": "O",
	"Ø": "O",
	"Ố": "O",
	"Ṍ": "O",
	"Ṓ": "O",
	"Ȏ": "O",
	"Ỏ": "O",
	"Ọ": "O",
	"Ổ": "O",
	"Ỗ": "O",
	"Ộ": "O",
	"Ờ": "O",
	"Ở": "O",
	"Ỡ": "O",
	"Ớ": "O",
	"Ợ": "O",
	"Ù": "U",
	"Ú": "U",
	"Û": "U",
	"Ü": "U",
	"Ủ": "U",
	"Ụ": "U",
	"Ử": "U",
	"Ữ": "U",
	"Ự": "U",
	"Ý": "Y",
	"à": "a",
	"á": "a",
	"â": "a",
	"ã": "a",
	"ä": "a",
	"å": "a",
	"ấ": "a",
	"ắ": "a",
	"ẳ": "a",
	"ẵ": "a",
	"ặ": "a",
	"æ": "ae",
	"ầ": "a",
	"ằ": "a",
	"ȃ": "a",
	"ả": "a",
	"ạ": "a",
	"ẩ": "a",
	"ẫ": "a",
	"ậ": "a",
	"ç": "c",
	"ḉ": "c",
	"è": "e",
	"é": "e",
	"ê": "e",
	"ë": "e",
	"ế": "e",
	"ḗ": "e",
	"ề": "e",
	"ḕ": "e",
	"ḝ": "e",
	"ȇ": "e",
	"ẻ": "e",
	"ẽ": "e",
	"ẹ": "e",
	"ể": "e",
	"ễ": "e",
	"ệ": "e",
	"ì": "i",
	"í": "i",
	"î": "i",
	"ï": "i",
	"ḯ": "i",
	"ȋ": "i",
	"ỉ": "i",
	"ị": "i",
	"ð": "d",
	"ñ": "n",
	"ò": "o",
	"ó": "o",
	"ô": "o",
	"õ": "o",
	"ö": "o",
	"ø": "o",
	"ố": "o",
	"ṍ": "o",
	"ṓ": "o",
	"ȏ": "o",
	"ỏ": "o",
	"ọ": "o",
	"ổ": "o",
	"ỗ": "o",
	"ộ": "o",
	"ờ": "o",
	"ở": "o",
	"ỡ": "o",
	"ớ": "o",
	"ợ": "o",
	"ù": "u",
	"ú": "u",
	"û": "u",
	"ü": "u",
	"ủ": "u",
	"ụ": "u",
	"ử": "u",
	"ữ": "u",
	"ự": "u",
	"ý": "y",
	"ÿ": "y",
	"Ā": "A",
	"ā": "a",
	"Ă": "A",
	"ă": "a",
	"Ą": "A",
	"ą": "a",
	"Ć": "C",
	"ć": "c",
	"Ĉ": "C",
	"ĉ": "c",
	"Ċ": "C",
	"ċ": "c",
	"Č": "C",
	"č": "c",
	"C̆": "C",
	"c̆": "c",
	"Ď": "D",
	"ď": "d",
	"Đ": "D",
	"đ": "d",
	"Ē": "E",
	"ē": "e",
	"Ĕ": "E",
	"ĕ": "e",
	"Ė": "E",
	"ė": "e",
	"Ę": "E",
	"ę": "e",
	"Ě": "E",
	"ě": "e",
	"Ĝ": "G",
	"Ǵ": "G",
	"ĝ": "g",
	"ǵ": "g",
	"Ğ": "G",
	"ğ": "g",
	"Ġ": "G",
	"ġ": "g",
	"Ģ": "G",
	"ģ": "g",
	"Ĥ": "H",
	"ĥ": "h",
	"Ħ": "H",
	"ħ": "h",
	"Ḫ": "H",
	"ḫ": "h",
	"Ĩ": "I",
	"ĩ": "i",
	"Ī": "I",
	"ī": "i",
	"Ĭ": "I",
	"ĭ": "i",
	"Į": "I",
	"į": "i",
	"İ": "I",
	"ı": "i",
	"Ĳ": "IJ",
	"ĳ": "ij",
	"Ĵ": "J",
	"ĵ": "j",
	"Ķ": "K",
	"ķ": "k",
	"Ḱ": "K",
	"ḱ": "k",
	"K̆": "K",
	"k̆": "k",
	"Ĺ": "L",
	"ĺ": "l",
	"Ļ": "L",
	"ļ": "l",
	"Ľ": "L",
	"ľ": "l",
	"Ŀ": "L",
	"ŀ": "l",
	"Ł": "l",
	"ł": "l",
	"Ḿ": "M",
	"ḿ": "m",
	"M̆": "M",
	"m̆": "m",
	"Ń": "N",
	"ń": "n",
	"Ņ": "N",
	"ņ": "n",
	"Ň": "N",
	"ň": "n",
	"ŉ": "n",
	"N̆": "N",
	"n̆": "n",
	"Ō": "O",
	"ō": "o",
	"Ŏ": "O",
	"ŏ": "o",
	"Ő": "O",
	"ő": "o",
	"Œ": "OE",
	"œ": "oe",
	"P̆": "P",
	"p̆": "p",
	"Ŕ": "R",
	"ŕ": "r",
	"Ŗ": "R",
	"ŗ": "r",
	"Ř": "R",
	"ř": "r",
	"R̆": "R",
	"r̆": "r",
	"Ȓ": "R",
	"ȓ": "r",
	"Ś": "S",
	"ś": "s",
	"Ŝ": "S",
	"ŝ": "s",
	"Ş": "S",
	"Ș": "S",
	"ș": "s",
	"ş": "s",
	"Š": "S",
	"š": "s",
	"Ţ": "T",
	"ţ": "t",
	"ț": "t",
	"Ț": "T",
	"Ť": "T",
	"ť": "t",
	"Ŧ": "T",
	"ŧ": "t",
	"T̆": "T",
	"t̆": "t",
	"Ũ": "U",
	"ũ": "u",
	"Ū": "U",
	"ū": "u",
	"Ŭ": "U",
	"ŭ": "u",
	"Ů": "U",
	"ů": "u",
	"Ű": "U",
	"ű": "u",
	"Ų": "U",
	"ų": "u",
	"Ȗ": "U",
	"ȗ": "u",
	"V̆": "V",
	"v̆": "v",
	"Ŵ": "W",
	"ŵ": "w",
	"Ẃ": "W",
	"ẃ": "w",
	"X̆": "X",
	"x̆": "x",
	"Ŷ": "Y",
	"ŷ": "y",
	"Ÿ": "Y",
	"Y̆": "Y",
	"y̆": "y",
	"Ź": "Z",
	"ź": "z",
	"Ż": "Z",
	"ż": "z",
	"Ž": "Z",
	"ž": "z",
	"ſ": "s",
	"ƒ": "f",
	"Ơ": "O",
	"ơ": "o",
	"Ư": "U",
	"ư": "u",
	"Ǎ": "A",
	"ǎ": "a",
	"Ǐ": "I",
	"ǐ": "i",
	"Ǒ": "O",
	"ǒ": "o",
	"Ǔ": "U",
	"ǔ": "u",
	"Ǖ": "U",
	"ǖ": "u",
	"Ǘ": "U",
	"ǘ": "u",
	"Ǚ": "U",
	"ǚ": "u",
	"Ǜ": "U",
	"ǜ": "u",
	"Ứ": "U",
	"ứ": "u",
	"Ṹ": "U",
	"ṹ": "u",
	"Ǻ": "A",
	"ǻ": "a",
	"Ǽ": "AE",
	"ǽ": "ae",
	"Ǿ": "O",
	"ǿ": "o",
	"Þ": "TH",
	"þ": "th",
	"Ṕ": "P",
	"ṕ": "p",
	"Ṥ": "S",
	"ṥ": "s",
	"X́": "X",
	"x́": "x",
	"Ѓ": "Г",
	"ѓ": "г",
	"Ќ": "К",
	"ќ": "к",
	"A̋": "A",
	"a̋": "a",
	"E̋": "E",
	"e̋": "e",
	"I̋": "I",
	"i̋": "i",
	"Ǹ": "N",
	"ǹ": "n",
	"Ồ": "O",
	"ồ": "o",
	"Ṑ": "O",
	"ṑ": "o",
	"Ừ": "U",
	"ừ": "u",
	"Ẁ": "W",
	"ẁ": "w",
	"Ỳ": "Y",
	"ỳ": "y",
	"Ȁ": "A",
	"ȁ": "a",
	"Ȅ": "E",
	"ȅ": "e",
	"Ȉ": "I",
	"ȉ": "i",
	"Ȍ": "O",
	"ȍ": "o",
	"Ȑ": "R",
	"ȑ": "r",
	"Ȕ": "U",
	"ȕ": "u",
	"B̌": "B",
	"b̌": "b",
	"Č̣": "C",
	"č̣": "c",
	"Ê̌": "E",
	"ê̌": "e",
	"F̌": "F",
	"f̌": "f",
	"Ǧ": "G",
	"ǧ": "g",
	"Ȟ": "H",
	"ȟ": "h",
	"J̌": "J",
	"ǰ": "j",
	"Ǩ": "K",
	"ǩ": "k",
	"M̌": "M",
	"m̌": "m",
	"P̌": "P",
	"p̌": "p",
	"Q̌": "Q",
	"q̌": "q",
	"Ř̩": "R",
	"ř̩": "r",
	"Ṧ": "S",
	"ṧ": "s",
	"V̌": "V",
	"v̌": "v",
	"W̌": "W",
	"w̌": "w",
	"X̌": "X",
	"x̌": "x",
	"Y̌": "Y",
	"y̌": "y",
	"A̧": "A",
	"a̧": "a",
	"B̧": "B",
	"b̧": "b",
	"Ḑ": "D",
	"ḑ": "d",
	"Ȩ": "E",
	"ȩ": "e",
	"Ɛ̧": "E",
	"ɛ̧": "e",
	"Ḩ": "H",
	"ḩ": "h",
	"I̧": "I",
	"i̧": "i",
	"Ɨ̧": "I",
	"ɨ̧": "i",
	"M̧": "M",
	"m̧": "m",
	"O̧": "O",
	"o̧": "o",
	"Q̧": "Q",
	"q̧": "q",
	"U̧": "U",
	"u̧": "u",
	"X̧": "X",
	"x̧": "x",
	"Z̧": "Z",
	"z̧": "z",
	"й":"и",
	"Й":"И",
	"ё":"е",
	"Ё":"Е",
};

var chars = Object.keys(characterMap).join('|');
var allAccents = new RegExp(chars, 'g');
var firstAccent = new RegExp(chars, '');

function matcher(match) {
	return characterMap[match];
}

var removeAccents = function(string) {
	return string.replace(allAccents, matcher);
};

var hasAccents = function(string) {
	return !!string.match(firstAccent);
};

module.exports = removeAccents;
module.exports.has = hasAccents;
module.exports.remove = removeAccents;


/***/ }),

/***/ "@wordpress/blob":
/*!******************************!*\
  !*** external ["wp","blob"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blob"];

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

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["coreData"];

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

/***/ "@wordpress/html-entities":
/*!**************************************!*\
  !*** external ["wp","htmlEntities"] ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["htmlEntities"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

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
/*!******************************!*\
  !*** ./blocks/query/init.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ */ "./blocks/query/index.js");
/**
 * Internal dependencies
 */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,___WEBPACK_IMPORTED_MODULE_0__.init)());
})();

/******/ })()
;
//# sourceMappingURL=init.js.map