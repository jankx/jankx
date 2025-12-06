/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/master-data-template/block.json":
/*!************************************************!*\
  !*** ./blocks/master-data-template/block.json ***!
  \************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/master-data-template","title":"Master Data Template","category":"jankx","parent":["jankx/master-data-layout"],"description":"Markup template để render từng item trong Master Data Layout block.","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css","usesContext":["queryId","query","displayLayout","templateSlug","previewPostType","enhancedPagination","postType"],"supports":{"reusable":false,"html":false,"align":["wide","full"],"layout":true,"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"spacing":{"margin":true,"padding":true,"blockGap":{"__experimentalDefault":"1.25em"},"__experimentalDefaultControls":{"blockGap":true,"padding":false,"margin":false}},"interactivity":{"clientNavigation":true},"__experimentalBorder":{"radius":true,"color":true,"width":true,"style":true}},"attributes":{"layout":{"type":"object","default":{"type":"default","columnCount":3}},"contentLayout":{"type":"string","default":"default"},"className":{"type":"string","default":""},"itemSpacing":{"type":"string","default":"normal","enum":["none","compact","normal","loose"]},"showItemBorder":{"type":"boolean","default":false},"itemBorderRadius":{"type":"number","default":0},"itemPadding":{"type":"object","default":{"top":"0","right":"0","bottom":"0","left":"0"}}}}');

/***/ }),

/***/ "./blocks/master-data-template/edit.tsx":
/*!**********************************************!*\
  !*** ./blocks/master-data-template/edit.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MasterDataTemplateEdit)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.mjs");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _templateBlocks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./templateBlocks */ "./blocks/master-data-template/templateBlocks.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










function MasterDataTemplateInnerBlocks({
  classList,
  allowedBlocks,
  postType
}) {
  // Get default template based on post type
  const getDefaultTemplate = postType => {
    const isProduct = postType === 'product';
    if (isProduct) {
      // Products: featured image, product title, product price, product button
      return [['core/post-featured-image'], ['woocommerce/product-title'], ['woocommerce/product-price'], ['woocommerce/product-button']];
    }

    // Posts: featured image, post title, post date, post excerpt
    return [['core/post-featured-image'], ['core/post-title'], ['core/post-date'], ['core/post-excerpt']];
  };
  const defaultTemplate = getDefaultTemplate(postType);
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useInnerBlocksProps)({
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-post', 'post-item', classList, 'is-editing'),
    style: {
      minHeight: '50px',
      position: 'relative',
      // Ensure inner blocks are clickable and selectable
      pointerEvents: 'auto'
    }
  }, {
    template: defaultTemplate,
    __unstableDisableLayoutClassNames: true,
    allowedBlocks,
    templateLock: false // Allow editing inner blocks
  });
  // Render as li for Grid layout
  // Inner blocks rendered here can be selected and will show their InspectorControls
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
    ...innerBlocksProps
  });
}
function MasterDataTemplateBlockPreview({
  blocks,
  blockContextId,
  classList,
  isHidden,
  setActiveBlockContextId
}) {
  const blockPreviewProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.__experimentalUseBlockPreview)({
    blocks,
    props: {
      className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])('wp-block-post', 'post-item', classList)
    }
  });
  const handleOnClick = () => {
    setActiveBlockContextId(blockContextId);
  };
  const style = {
    display: isHidden ? 'none' : undefined
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("li", {
    ...blockPreviewProps,
    tabIndex: 0,
    role: "button",
    onClick: handleOnClick,
    onKeyPress: handleOnClick,
    style: style
  });
}
const MemoizedMasterDataTemplateBlockPreview = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.memo)(MasterDataTemplateBlockPreview);
function MasterDataTemplateEdit({
  setAttributes,
  clientId,
  context,
  attributes: {
    contentLayout = 'default',
    className = '',
    itemSpacing = 'normal',
    showItemBorder = false,
    itemBorderRadius = 0,
    itemPadding = {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  },
  __unstableLayoutClassNames
}) {
  const {
    query: {
      perPage,
      offset = 0,
      postType,
      order,
      orderBy,
      author,
      search,
      exclude,
      sticky,
      inherit,
      taxQuery,
      parents,
      pages,
      format,
      ...restQueryArgs
    } = {},
    templateSlug,
    previewPostType,
    displayLayout
  } = context;
  const [activeBlockContextId, setActiveBlockContextId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
  const isInitializedRef = useRef(false);
  const previousInnerBlocksLengthRef = useRef(0);

  // Get inner blocks separately
  const innerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
    const block = getBlocks(clientId);
    return block?.innerBlocks || [];
  }, [clientId]);
  const {
    posts,
    blocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getEntityRecords,
      getTaxonomies
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_7__.store);
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
    const templateCategory = inherit && templateSlug?.startsWith('category-') && getEntityRecords('taxonomy', 'category', {
      context: 'view',
      per_page: 1,
      _fields: ['id'],
      slug: templateSlug.replace('category-', '')
    });
    const templateTag = inherit && templateSlug?.startsWith('tag-') && getEntityRecords('taxonomy', 'post_tag', {
      context: 'view',
      per_page: 1,
      _fields: ['id'],
      slug: templateSlug.replace('tag-', '')
    });
    const queryArgs = {
      offset: offset || 0,
      order,
      orderby: orderBy
    };
    if (taxQuery && !inherit) {
      const taxonomies = getTaxonomies({
        type: postType,
        per_page: -1,
        context: 'view'
      });
      const builtTaxQuery = Object.entries(taxQuery || {}).reduce((accumulator, [taxonomySlug, terms]) => {
        const taxonomy = taxonomies?.find(({
          slug
        }) => slug === taxonomySlug);
        if (taxonomy?.rest_base) {
          accumulator[taxonomy.rest_base] = terms;
        }
        return accumulator;
      }, {});
      if (Object.keys(builtTaxQuery).length > 0) {
        Object.assign(queryArgs, builtTaxQuery);
      }
    }
    if (perPage) {
      queryArgs.per_page = perPage;
    }
    if (author) {
      queryArgs.author = author;
    }
    if (search) {
      queryArgs.search = search;
    }
    if (exclude?.length) {
      queryArgs.exclude = exclude;
    }
    if (parents?.length) {
      queryArgs.parent = parents;
    }
    if (format?.length) {
      queryArgs.format = format;
    }
    if (['exclude', 'only'].includes(sticky)) {
      queryArgs.sticky = sticky === 'only';
    }
    if (['', 'ignore'].includes(sticky)) {
      delete queryArgs.sticky;
      queryArgs.ignore_sticky = sticky === 'ignore';
    }
    let currentPostType = postType;
    if (inherit) {
      if (templateSlug?.startsWith('archive-')) {
        queryArgs.postType = templateSlug.replace('archive-', '');
        currentPostType = queryArgs.postType;
      } else if (templateCategory) {
        queryArgs.categories = templateCategory[0]?.id;
      } else if (templateTag) {
        queryArgs.tags = templateTag[0]?.id;
      } else if (templateSlug?.startsWith('taxonomy-post_format')) {
        queryArgs.format = templateSlug.replace('taxonomy-post_format-post-format-', '');
      }
    }
    const usedPostType = previewPostType || currentPostType;
    return {
      posts: getEntityRecords('postType', usedPostType, {
        ...queryArgs,
        ...restQueryArgs
      }),
      blocks: getBlocks(clientId)
    };
  }, [perPage, offset, order, orderBy, clientId, author, search, postType, exclude, sticky, inherit, templateSlug, taxQuery, parents, format, restQueryArgs, previewPostType]);
  const blockContexts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    var _posts$map;
    return (_posts$map = posts?.map(post => {
      var _post$class_list;
      return {
        postType: post.type,
        postId: post.id,
        classList: (_post$class_list = post.class_list) !== null && _post$class_list !== void 0 ? _post$class_list : ''
      };
    })) !== null && _posts$map !== void 0 ? _posts$map : [];
  }, [posts]);
  const innerBlockCount = innerBlocks.length;
  const allowedBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => (0,_templateBlocks__WEBPACK_IMPORTED_MODULE_8__.getAllowedTemplateBlocks)(previewPostType || postType), [previewPostType, postType]);

  // Get default template blocks based on post type
  const desiredInnerBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    const usedPostType = previewPostType || postType;
    const isProduct = usedPostType === 'product';
    const templateInnerBlocks = [];

    // Always include featured image
    templateInnerBlocks.push('core/post-featured-image');
    if (isProduct) {
      // Products: product title, product price, product button
      templateInnerBlocks.push('woocommerce/product-title');
      templateInnerBlocks.push('woocommerce/product-price');
      templateInnerBlocks.push('woocommerce/product-button');
    } else {
      // Posts: post title, post date, post excerpt
      templateInnerBlocks.push('core/post-title');
      templateInnerBlocks.push('core/post-date');
      templateInnerBlocks.push('core/post-excerpt');
    }
    return templateInnerBlocks;
  }, [previewPostType, postType]);

  // Create stable key for desired blocks
  const desiredBlocksKey = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => desiredInnerBlocks.join(','), [desiredInnerBlocks]);

  // Auto-create template with default inner blocks if empty
  // Only run when postType changes or on initial mount
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!replaceInnerBlocks || !desiredInnerBlocks.length) {
      return;
    }

    // Create a stable key based on postType to track initialization per post type
    const currentPostType = previewPostType || postType;
    const initKey = `${clientId}-${currentPostType}-${desiredBlocksKey}`;

    // Skip if already initialized for this post type and template
    if (isInitializedRef.current === initKey) {
      return;
    }

    // Only auto-create if no inner blocks exist
    // Don't auto-update if user has already customized the template
    if (innerBlocks.length === 0) {
      try {
        const newInnerBlocks = desiredInnerBlocks.map(name => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.createBlock)(name));
        replaceInnerBlocks(clientId, newInnerBlocks, false);
        isInitializedRef.current = initKey;
      } catch (error) {
        console.error('Error creating inner blocks:', error);
      }
    } else {
      // Mark as initialized if inner blocks already exist
      isInitializedRef.current = initKey;
    }
  }, [previewPostType, postType, desiredBlocksKey, clientId, replaceInnerBlocks]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.useBlockProps)({
    className: (0,clsx__WEBPACK_IMPORTED_MODULE_0__["default"])(__unstableLayoutClassNames, className, {
      [`content-layout-${contentLayout}`]: contentLayout && contentLayout !== 'default',
      [`item-spacing-${itemSpacing}`]: itemSpacing && itemSpacing !== 'normal',
      'has-item-border': showItemBorder,
      [`layout-${displayLayout}`]: displayLayout
    }),
    style: showItemBorder && itemBorderRadius > 0 ? {
      '--item-border-radius': `${itemBorderRadius}px`
    } : undefined
  });

  // Always render InspectorControls to ensure they appear when block is selected
  // This ensures block options are always available regardless of loading state
  const inspectorControls = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Template Settings', 'jankx'),
      initialOpen: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Content Layout', 'jankx'),
        value: contentLayout,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Default', 'jankx'),
          value: 'default'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Compact', 'jankx'),
          value: 'compact'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Full', 'jankx'),
          value: 'full'
        }],
        onChange: value => setAttributes({
          contentLayout: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Control the layout style of the post template', 'jankx')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Item Styling', 'jankx'),
      initialOpen: false,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Item Spacing', 'jankx'),
        value: itemSpacing,
        options: [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('None', 'jankx'),
          value: 'none'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Compact', 'jankx'),
          value: 'compact'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Normal', 'jankx'),
          value: 'normal'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Loose', 'jankx'),
          value: 'loose'
        }],
        onChange: value => setAttributes({
          itemSpacing: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Control spacing between post items', 'jankx')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Show Item Border', 'jankx'),
        checked: showItemBorder,
        onChange: value => setAttributes({
          showItemBorder: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add border around each post item', 'jankx')
      }), showItemBorder && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.RangeControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Border Radius', 'jankx'),
        value: itemBorderRadius,
        onChange: value => setAttributes({
          itemBorderRadius: value || 0
        }),
        min: 0,
        max: 50,
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Border radius in pixels', 'jankx')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Advanced', 'jankx'),
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
        style: {
          fontSize: '12px',
          color: '#757575',
          marginTop: '8px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Note: Individual inner blocks (Title, Date, Excerpt, etc.) have their own settings that appear when you select them directly.', 'jankx')
      })
    })]
  });
  if (!posts) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [inspectorControls, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
        ...blockProps,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_6__.Spinner, {})
      })]
    });
  }
  if (!posts.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [inspectorControls, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
        ...blockProps,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No results found.', 'jankx')
      })]
    });
  }

  // Determine wrapper tag based on layout
  const TagName = displayLayout === 'grid' ? 'ul' : 'div';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
    children: [inspectorControls, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [innerBlockCount === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "jankx-master-data-template__notice",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('This template has no blocks yet. Add blocks to define the post item structure.', 'jankx')
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(TagName, {
        ...blockProps,
        children: blockContexts.map(blockContext => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.BlockContextProvider, {
          value: blockContext,
          children: [blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(MasterDataTemplateInnerBlocks, {
            classList: blockContext.classList,
            allowedBlocks: allowedBlocks,
            postType: previewPostType || postType
          }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(MemoizedMasterDataTemplateBlockPreview, {
            blocks: blocks,
            blockContextId: blockContext.postId,
            classList: blockContext.classList,
            setActiveBlockContextId: setActiveBlockContextId,
            isHidden: blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId)
          })]
        }, blockContext.postId))
      })]
    })]
  });
}

/***/ }),

/***/ "./blocks/master-data-template/save.tsx":
/*!**********************************************!*\
  !*** ./blocks/master-data-template/save.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Save({
  attributes
}) {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./blocks/master-data-template/style.scss":
/*!************************************************!*\
  !*** ./blocks/master-data-template/style.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/master-data-template/templateBlocks.ts":
/*!*******************************************************!*\
  !*** ./blocks/master-data-template/templateBlocks.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAllowedTemplateBlocks: () => (/* binding */ getAllowedTemplateBlocks)
/* harmony export */ });
const BASE_TEMPLATE_BLOCKS = ['core/template-part', 'core/post-title', 'core/post-author', 'core/post-author-name', 'core/post-date', 'core/post-featured-image', 'core/post-excerpt', 'core/post-terms', 'core/post-content', 'core/read-more', 'core/buttons', 'core/button', 'core/paragraph', 'core/heading', 'core/image', 'core/list', 'core/separator', 'core/spacer', 'core/group', 'core/columns', 'core/column', 'core/media-text', 'core/image', 'core/cover', 'core/gallery'];
const PRODUCT_TEMPLATE_BLOCKS = ['woocommerce/product-title', 'woocommerce/product-price', 'woocommerce/product-rating', 'woocommerce/product-summary', 'woocommerce/product-details', 'woocommerce/product-content', 'woocommerce/product-gallery', 'woocommerce/product-image', 'woocommerce/product-images', 'woocommerce/product-stock-indicator', 'woocommerce/product-meta', 'woocommerce/product-add-to-cart', 'woocommerce/product-sku', 'woocommerce/product-sale-badge'];
const getAllowedTemplateBlocks = postType => {
  if (postType === 'product') {
    return [...new Set([...BASE_TEMPLATE_BLOCKS, ...PRODUCT_TEMPLATE_BLOCKS])];
  }
  return BASE_TEMPLATE_BLOCKS;
};

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
/*!***********************************************!*\
  !*** ./blocks/master-data-template/index.tsx ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/master-data-template/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/master-data-template/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/master-data-template/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/master-data-template/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map