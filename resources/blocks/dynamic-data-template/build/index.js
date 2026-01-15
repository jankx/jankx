/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-data-template/block.json":
/*!*************************************************!*\
  !*** ./blocks/dynamic-data-template/block.json ***!
  \*************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-data-template","title":"Dynamic Data Template","category":"jankx","parent":["jankx/dynamic-data-layout"],"description":"Markup template để render từng item trong Dynamic Data Layout block","textdomain":"jankx","editorScript":"file:./build/index.js","style":"file:./build/style.css","editorStyle":"file:./build/editor.css","usesContext":["queryId","postType","displayLayout","postsPerPage","columns","columnsTablet","columnsMobile","slidesToScroll","loop","autoplay","autoplayDelay","showArrows","showDots","carouselAlign","carouselAxis","carouselDirection","carouselStartIndex","carouselDuration","carouselDragFree","carouselDragThreshold","carouselSkipSnaps","carouselContainScroll","carouselInViewThreshold","queryPreset","includeStickyPosts","orderBy","order","offset","taxQuery","metaQuery","keyword","authorIn","authorNotIn","postIn","postNotIn","metaKey","metaType","postStatus","postParent","postParentIn","postParentNotIn","customQueryId"],"supports":{"reusable":false,"html":false,"align":["wide","full"],"layout":true,"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"spacing":{"margin":true,"padding":true,"blockGap":{"__experimentalDefault":"1.25em"},"__experimentalDefaultControls":{"blockGap":true,"padding":true,"margin":true}},"interactivity":{"clientNavigation":true},"__experimentalBorder":{"radius":true,"color":true,"width":true,"style":true}},"attributes":{"contentLoopLayout":{"type":"string","default":"default"},"className":{"type":"string","default":""},"itemSpacing":{"type":"string","default":"normal","enum":["none","compact","normal","loose"]},"overlayIcon":{"type":"string","default":""},"overlayIconPosition":{"type":"string","default":"center"},"overlayIconSize":{"type":"number","default":24},"overlayIconColor":{"type":"string","default":"#ffffff"},"overlayIconBackground":{"type":"string","default":"rgba(0, 0, 0, 0.5)"},"overlayIconShowMode":{"type":"string","default":"always-show","enum":["always-show","hover-hide","hover-show"]},"overlayIconTarget":{"type":"string","default":"featured-image","enum":["featured-image","entry-image","entire-item"]},"overlayIconType":{"type":"string","default":"class","enum":["class","image","text"]},"overlayIconText":{"type":"string","default":""},"overlayIconRotate":{"type":"number","default":0},"overlayIconImageId":{"type":"number","default":0},"overlayIconImageUrl":{"type":"string","default":""},"showItemBorder":{"type":"boolean","default":false},"itemBorderRadius":{"type":"number","default":0},"itemPadding":{"type":"object","default":{"top":"0","right":"0","bottom":"0","left":"0"}},"thumbnailPosition":{"type":"string","default":"top","enum":["top","bottom","left","right"]},"animationType":{"type":"string","default":"none","enum":["none","fade-in","fade-in-up","fade-in-down","fade-in-left","fade-in-right","zoom-in","slide-in-up"]},"animationDuration":{"type":"number","default":1000},"animationDelay":{"type":"number","default":0},"animationTarget":{"type":"string","default":"entry","enum":["entry","thumbnail"]},"animationReverse":{"type":"boolean","default":false}}}');

/***/ }),

/***/ "./blocks/dynamic-data-template/edit.tsx":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-template/edit.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const DEFAULT_LAYOUTS_DATA = {
  layoutsByPostType: {},
  commonLayouts: []
};
const DEFAULT_BLOCKS_DATA = {};
/**
 * Build inline styles for template item from block attributes
 */
const buildTemplateItemStyle = attributes => {
  const styles = {};
  const attrStyle = attributes?.style;
  if (!attrStyle) {
    return styles;
  }

  // Spacing - padding
  if (attrStyle?.spacing?.padding) {
    const p = attrStyle.spacing.padding;
    if (p.top) styles.paddingTop = p.top;
    if (p.right) styles.paddingRight = p.right;
    if (p.bottom) styles.paddingBottom = p.bottom;
    if (p.left) styles.paddingLeft = p.left;
  }

  // Spacing - margin
  if (attrStyle?.spacing?.margin) {
    const m = attrStyle.spacing.margin;
    if (m.top) styles.marginTop = m.top;
    if (m.right) styles.marginRight = m.right;
    if (m.bottom) styles.marginBottom = m.bottom;
    if (m.left) styles.marginLeft = m.left;
  }

  // Colors - background
  if (attrStyle?.color?.background) {
    styles.backgroundColor = attrStyle.color.background;
  }

  // Colors - text
  if (attrStyle?.color?.text) {
    styles.color = attrStyle.color.text;
  }

  // Colors - gradient
  if (attrStyle?.color?.gradient) {
    styles.background = attrStyle.color.gradient;
  }

  // Typography - font size
  if (attrStyle?.typography?.fontSize) {
    styles.fontSize = attrStyle.typography.fontSize;
  }

  // Typography - line height
  if (attrStyle?.typography?.lineHeight) {
    styles.lineHeight = attrStyle.typography.lineHeight;
  }

  // Typography - font family
  if (attrStyle?.typography?.fontFamily) {
    styles.fontFamily = attrStyle.typography.fontFamily;
  }

  // Typography - font weight
  if (attrStyle?.typography?.fontWeight) {
    styles.fontWeight = attrStyle.typography.fontWeight;
  }

  // Typography - font style
  if (attrStyle?.typography?.fontStyle) {
    styles.fontStyle = attrStyle.typography.fontStyle;
  }

  // Typography - text transform
  if (attrStyle?.typography?.textTransform) {
    styles.textTransform = attrStyle.typography.textTransform;
  }

  // Typography - text decoration
  if (attrStyle?.typography?.textDecoration) {
    styles.textDecoration = attrStyle.typography.textDecoration;
  }

  // Typography - letter spacing
  if (attrStyle?.typography?.letterSpacing) {
    styles.letterSpacing = attrStyle.typography.letterSpacing;
  }

  // Border
  if (attrStyle?.border) {
    const border = attrStyle.border;
    if (border.radius) {
      styles.borderRadius = border.radius;
    }
    if (border.width) {
      styles.borderWidth = border.width;
    }
    if (border.style) {
      styles.borderStyle = border.style;
    }
    if (border.color) {
      styles.borderColor = border.color;
    }
  }
  return styles;
};

/**
 * Build CSS classes for template item from block attributes
 */
const buildTemplateItemClasses = attributes => {
  const classes = [];

  // Add custom className if present
  if (attributes?.className) {
    classes.push(attributes.className);
  }

  // Add color classes if using theme colors
  if (attributes?.backgroundColor) {
    classes.push(`has-${attributes.backgroundColor}-background-color`);
    classes.push('has-background');
  }
  if (attributes?.textColor) {
    classes.push(`has-${attributes.textColor}-color`);
    classes.push('has-text-color');
  }
  if (attributes?.gradient) {
    classes.push(`has-${attributes.gradient}-gradient-background`);
    classes.push('has-background');
  }

  // Add font size class if using preset
  if (attributes?.fontSize) {
    classes.push(`has-${attributes.fontSize}-font-size`);
  }
  return classes.filter(Boolean).join(' ');
};
const PreviewItem = ({
  blocks,
  className,
  style,
  index,
  templateItemStyle,
  templateItemClassName
}) => {
  const [resizeListener, sizes] = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.useResizeObserver)();
  const width = sizes && sizes.width;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: className,
    "data-item-index": index,
    style: style,
    children: [resizeListener, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: `dynamic-data-template__inner-blocks${templateItemClassName ? ' ' + templateItemClassName : ''}`,
      style: templateItemStyle,
      children: !!width && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockPreview, {
        blocks: blocks,
        viewportWidth: width
      })
    })]
  });
};
function Edit({
  attributes,
  setAttributes,
  clientId,
  context
}) {
  const {
    contentLoopLayout,
    className = '',
    itemSpacing = 'normal',
    showItemBorder = false,
    itemBorderRadius = 0,
    itemPadding = {},
    thumbnailPosition = 'top',
    overlayIcon,
    overlayIconMode = 'always-show',
    overlayIconPosition = 'center',
    overlayIconSize = 24,
    overlayIconColor = '#ffffff',
    overlayIconBackground = 'rgba(0, 0, 0, 0.5)',
    overlayIconTarget = 'featured-image',
    overlayIconType = 'class',
    overlayIconImageId = 0,
    overlayIconImageUrl = '',
    overlayIconText = '',
    overlayIconRotate = 0,
    animationType = 'none',
    animationDuration = 1000,
    animationDelay = 0,
    animationTarget = 'entry',
    animationReverse = false
  } = attributes;

  // Get post type and settings from context
  const postType = context?.query?.postType || context?.postType || 'post';
  const postsPerPage = context?.postsPerPage || 10;
  const displayLayout = context?.displayLayout || 'grid';
  const columns = context?.columns || 3;
  const columnsTablet = context?.columnsTablet || 2;
  const columnsMobile = context?.columnsMobile || 1;
  const slidesToScroll = context?.slidesToScroll || 1;
  const showArrows = !!context?.showArrows;
  const showDots = !!context?.showDots;
  const carouselAlign = context?.carouselAlign || 'start';

  // Prepare query args
  const queryArgs = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    const args = {
      per_page: postsPerPage,
      offset: context.offset || 0,
      order: context.order || 'DESC',
      orderby: context.orderBy || 'date',
      status: context.postStatus || 'publish',
      _embed: true // Fetch embedded data like featured media
    };
    if (context.keyword) args.search = context.keyword;
    if (context.authorIn?.length) args.author = context.authorIn;
    if (context.authorNotIn?.length) args.author_exclude = context.authorNotIn;
    if (context.postIn?.length) args.include = context.postIn;
    if (context.postNotIn?.length) args.exclude = context.postNotIn;
    if (context.postParent) args.parent = context.postParent;
    if (context.postParentIn?.length) args.parent = context.postParentIn;
    if (context.postParentNotIn?.length) args.parent_exclude = context.postParentNotIn;
    // ignore_sticky_posts logic depends on API version but generally REST doesn't sticky by default unless asked?
    // Actually REST API doesn't move sticky posts to top by default like WP_Query.
    // But let's leave it as is.

    return args;
  }, [context, postsPerPage]);

  // Fetch posts
  const {
    posts,
    hasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
    const {
      getEntityRecords,
      hasFinishedResolution
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);
    const selectorArgs = ['postType', postType, queryArgs];
    return {
      posts: getEntityRecords(...selectorArgs),
      hasResolved: hasFinishedResolution('getEntityRecords', selectorArgs)
    };
  }, [postType, queryArgs]);

  // Get layouts data from PHP
  const layoutsData = window.jankxDynamicDataContentLoopLayouts || DEFAULT_LAYOUTS_DATA;

  // Get available layouts for current post type
  const availableLayouts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    const layouts = [];

    // Use layoutsByPostType which already includes common layouts
    // This avoids duplicates since getLayoutsForPostType() already merges common + post type specific
    if (layoutsData.layoutsByPostType && typeof layoutsData.layoutsByPostType === 'object' && postType in layoutsData.layoutsByPostType && Array.isArray(layoutsData.layoutsByPostType[postType])) {
      layoutsData.layoutsByPostType[postType].forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    } else if (layoutsData.commonLayouts) {
      // Fallback to common layouts if post type specific layouts not found
      layoutsData.commonLayouts.forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    }
    return layouts;
  }, [postType, layoutsData]);

  // Layout options for SelectControl
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    return availableLayouts.map(layoutInfo => ({
      label: layoutInfo.title || layoutInfo.name,
      value: layoutInfo.name
    }));
  }, [availableLayouts]);

  // Get default blocks for post type
  const defaultBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    const defaultBlocksData = window.jankxDynamicDataTemplateDefaultBlocks || DEFAULT_BLOCKS_DATA;
    return defaultBlocksData[postType] || [];
  }, [postType]);

  // Recursive function to convert blocks to template format
  const convertToTemplate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(blocks => {
    return blocks.map(block => [block.blockName, block.attrs || {}, block.innerBlocks ? convertToTemplate(block.innerBlocks) : []]);
  }, []);

  // Convert default blocks to template format
  const defaultTemplate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    return convertToTemplate(defaultBlocks);
  }, [defaultBlocks, convertToTemplate]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `dynamic-data-template dynamic-data-template--${contentLoopLayout}`,
    ...(thumbnailPosition && {
      'data-thumbnail-position': thumbnailPosition
    })
  });

  // InnerBlocks props cho tất cả items (tất cả đều editable)
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'dynamic-data-template__inner-blocks'
  }, {
    template: defaultTemplate.length > 0 ? defaultTemplate : undefined,
    templateLock: false,
    // Allow editing inner blocks
    allowedBlocks: undefined // Allow all blocks
  });

  // Get current template block innerBlocks từ store
  const templateBlock = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlock(clientId), [clientId]);
  const currentInnerBlocks = templateBlock?.innerBlocks || [];

  // Shared state cho tất cả items - dùng React state để đồng nhất
  const [sharedInnerBlocks, setSharedInnerBlocks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(currentInnerBlocks);
  const lastSyncedBlocksRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useRef)('');

  // Sync: khi innerBlocks của template block thay đổi, update shared state
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    const currentBlocksStr = JSON.stringify(currentInnerBlocks);

    // Chỉ sync nếu thực sự có thay đổi
    if (currentBlocksStr !== lastSyncedBlocksRef.current) {
      lastSyncedBlocksRef.current = currentBlocksStr;
      setSharedInnerBlocks(currentInnerBlocks);
    }
  }, [currentInnerBlocks]);

  // Calculate total items to display (including editable one)
  const totalItems = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => {
    if (hasResolved && posts) {
      return Math.max(1, posts.length);
    }
    // Giới hạn tối đa 12 items cho performance khi loading
    return Math.min(Math.max(1, postsPerPage), 12);
  }, [postsPerPage, hasResolved, posts]);
  const viewportRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
  const scrollBySlides = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useCallback)(n => {
    const vp = viewportRef.current;
    if (!vp) return;
    const width = vp.clientWidth;
    const perSlide = width / Math.max(1, columns);
    vp.scrollBy({
      left: n * perSlide * Math.max(1, slidesToScroll),
      behavior: 'smooth'
    });
  }, [columns, slidesToScroll]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Loop Layout', 'jankx'),
          value: contentLoopLayout,
          options: layoutOptions,
          onChange: value => setAttributes({
            contentLoopLayout: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Item Spacing', 'jankx'),
          value: itemSpacing,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
            value: 'none'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Compact', 'jankx'),
            value: 'compact'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Normal', 'jankx'),
            value: 'normal'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loose', 'jankx'),
            value: 'loose'
          }],
          onChange: value => setAttributes({
            itemSpacing: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Item Border', 'jankx'),
          checked: showItemBorder,
          onChange: value => setAttributes({
            showItemBorder: value
          })
        }), showItemBorder && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border Radius', 'jankx'),
          value: itemBorderRadius,
          onChange: value => setAttributes({
            itemBorderRadius: value || 0
          }),
          min: 0,
          max: 50
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Settings', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Position', 'jankx'),
          value: thumbnailPosition || 'top',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top (Default)', 'jankx'),
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
          }],
          onChange: value => setAttributes({
            thumbnailPosition: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose where the featured image appears relative to the content.', 'jankx')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Icon Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Overlay Source', 'jankx'),
          value: overlayIconType || 'class',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Class', 'jankx'),
            value: 'class'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'jankx'),
            value: 'image'
          }],
          onChange: value => setAttributes({
            overlayIconType: value
          })
        }), overlayIconType === 'image' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
            onSelect: media => {
              const url = media?.url || '';
              const id = media?.id || 0;
              setAttributes({
                overlayIconImageUrl: url,
                overlayIconImageId: id
              });
            },
            allowedTypes: ['image'],
            value: overlayIconImageId || 0,
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
              variant: "primary",
              onClick: open,
              children: overlayIconImageUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Overlay Image', 'jankx') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Overlay Image', 'jankx')
            })
          }), overlayIconImageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            style: {
              marginTop: 8
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
              src: overlayIconImageUrl,
              alt: "",
              style: {
                maxWidth: '100%',
                height: 'auto'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
              variant: "secondary",
              onClick: () => setAttributes({
                overlayIconImageUrl: '',
                overlayIconImageId: 0
              }),
              style: {
                marginTop: 8
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Image', 'jankx')
            })]
          })]
        }) : overlayIconType === 'text' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Symbol Text', 'jankx'),
            value: overlayIconText,
            onChange: value => setAttributes({
              overlayIconText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ví dụ: ▶, ★, ▷', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rotate (deg)', 'jankx'),
            value: overlayIconRotate || 0,
            onChange: value => setAttributes({
              overlayIconRotate: value || 0
            }),
            min: -180,
            max: 180,
            step: 1
          })]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Class', 'jankx'),
          value: overlayIcon,
          onChange: value => setAttributes({
            overlayIcon: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter icon class (e.g., fas fa-play, dashicons-video-alt3)', 'jankx')
        }), (overlayIconType === 'image' ? !!overlayIconImageUrl : overlayIconType === 'text' ? !!overlayIconText : !!overlayIcon) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Mode', 'jankx'),
            value: overlayIconShowMode || 'always-show',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Always Show', 'jankx'),
              value: 'always-show'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show on Hover', 'jankx'),
              value: 'hover-show'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide on Hover', 'jankx'),
              value: 'hover-hide'
            }],
            onChange: value => setAttributes({
              overlayIconShowMode: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Position', 'jankx'),
            value: overlayIconPosition || 'center',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Center', 'jankx'),
              value: 'center'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Left', 'jankx'),
              value: 'top-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Right', 'jankx'),
              value: 'top-right'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Left', 'jankx'),
              value: 'bottom-left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bottom Right', 'jankx'),
              value: 'bottom-right'
            }],
            onChange: value => setAttributes({
              overlayIconPosition: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Target Area', 'jankx'),
            value: overlayIconTarget || 'featured-image',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Featured Image', 'jankx'),
              value: 'featured-image'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entry Image', 'jankx'),
              value: 'entry-image'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Entire Item', 'jankx'),
              value: 'entire-item'
            }],
            onChange: value => setAttributes({
              overlayIconTarget: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose where the overlay icon should appear', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Size', 'jankx'),
            value: overlayIconSize || 24,
            onChange: value => setAttributes({
              overlayIconSize: value || 24
            }),
            min: 10,
            max: 100,
            step: 1
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "components-base-control",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
              className: "components-base-control__label",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Color', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: "components-color-palette-control__color-indicator-wrapper",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
                type: "color",
                value: overlayIconColor || '#ffffff',
                onChange: e => setAttributes({
                  overlayIconColor: e.target.value
                }),
                style: {
                  width: '100%',
                  height: '40px'
                }
              })
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "components-base-control",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
              className: "components-base-control__label",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Icon Background', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: "components-color-palette-control__color-indicator-wrapper",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("input", {
                type: "color",
                value: overlayIconBackground || 'rgba(0, 0, 0, 0.5)',
                onChange: e => setAttributes({
                  overlayIconBackground: e.target.value
                }),
                style: {
                  width: '100%',
                  height: '40px'
                }
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
              className: "components-base-control__help",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use RGBA format for transparency (e.g., rgba(0,0,0,0.5))', 'jankx')
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scroll Animation', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Type', 'jankx'),
          value: animationType || 'none',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'jankx'),
            value: 'none'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In', 'jankx'),
            value: 'fade-in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Up', 'jankx'),
            value: 'fade-in-up'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Down', 'jankx'),
            value: 'fade-in-down'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Left', 'jankx'),
            value: 'fade-in-left'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fade In Right', 'jankx'),
            value: 'fade-in-right'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Zoom In', 'jankx'),
            value: 'zoom-in'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slide In Up', 'jankx'),
            value: 'slide-in-up'
          }],
          onChange: value => setAttributes({
            animationType: value
          })
        }), animationType !== 'none' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Duration (ms)', 'jankx'),
            value: animationDuration || 1000,
            onChange: value => setAttributes({
              animationDuration: value || 1000
            }),
            min: 100,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Delay (ms)', 'jankx'),
            value: animationDelay || 0,
            onChange: value => setAttributes({
              animationDelay: value || 0
            }),
            min: 0,
            max: 5000,
            step: 100
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Animation Target', 'jankx'),
            value: animationTarget || 'entry',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Whole Item (Entry)', 'jankx'),
              value: 'entry'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Only', 'jankx'),
              value: 'thumbnail'
            }],
            onChange: value => setAttributes({
              animationTarget: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reverse Animation on Scroll Out', 'jankx'),
            checked: animationReverse,
            onChange: value => setAttributes({
              animationReverse: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide item when scroll back up', 'jankx')
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ...blockProps,
      children: displayLayout === 'carousel' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: `dynamic-data-template__carousel columns-${columns}`,
        children: [showArrows ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "dynamic-data-template__carousel-nav",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            type: "button",
            className: "carousel-button prev",
            onClick: () => scrollBySlides(-1),
            children: "Prev"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button", {
            type: "button",
            className: "carousel-button next",
            onClick: () => scrollBySlides(1),
            children: "Next"
          })]
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          ref: viewportRef,
          className: "dynamic-data-template__carousel-viewport",
          style: {
            overflow: 'hidden'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
            style: {
              '--columns-desktop': columns,
              '--columns-tablet': columnsTablet,
              '--columns-mobile': columnsMobile,
              display: 'flex',
              gap: '1rem',
              scrollSnapType: 'x mandatory'
            },
            children: Array.from({
              length: totalItems
            }).map((_, index) => {
              const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
              const itemStyle = {
                flex: `0 0 calc(100% / ${columns})`,
                scrollSnapAlign: carouselAlign
              };
              if (animationType !== 'none') {
                itemStyle['--jankx-animation-duration'] = `${animationDuration}ms`;
                itemStyle['--jankx-animation-delay'] = `${index * animationDelay}ms`;
              }
              const spacing = attributes?.style?.spacing;
              if (spacing?.padding) {
                const p = spacing.padding;
                if (p.top) itemStyle.paddingTop = p.top;
                if (p.right) itemStyle.paddingRight = p.right;
                if (p.bottom) itemStyle.paddingBottom = p.bottom;
                if (p.left) itemStyle.paddingLeft = p.left;
              }
              if (spacing?.margin) {
                const m = spacing.margin;
                if (m.top) itemStyle.marginTop = m.top;
                if (m.right) itemStyle.marginRight = m.right;
                if (m.bottom) itemStyle.marginBottom = m.bottom;
                if (m.left) itemStyle.marginLeft = m.left;
              }
              const postData = posts && posts[index] ? posts[index] : null;
              const contextValue = postData ? {
                postId: postData.id,
                postType: postData.type
              } : {};
              if (index === 0) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  className: `dynamic-data-template__item ${animationClass}`,
                  "data-item-index": index,
                  style: itemStyle,
                  children: postData ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
                    value: contextValue,
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                      ...innerBlocksProps
                    })
                  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                    ...innerBlocksProps
                  })
                }, `item-${index}`);
              }
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: `dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`,
                "data-item-index": index,
                style: itemStyle,
                children: postData ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
                  value: contextValue,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PreviewItem, {
                    index: index,
                    blocks: sharedInnerBlocks,
                    templateItemStyle: buildTemplateItemStyle(attributes),
                    templateItemClassName: buildTemplateItemClasses(attributes)
                  })
                }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PreviewItem, {
                  index: index,
                  blocks: sharedInnerBlocks,
                  templateItemStyle: buildTemplateItemStyle(attributes),
                  templateItemClassName: buildTemplateItemClasses(attributes)
                })
              }, `item-${index}`);
            })
          })
        }), showDots ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "dynamic-data-template__carousel-dots"
        }) : null]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: `dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
        style: {
          '--columns-desktop': columns,
          '--columns-tablet': columnsTablet,
          '--columns-mobile': columnsMobile,
          display: displayLayout === 'grid' || displayLayout === 'card' ? 'grid' : 'block',
          gridTemplateColumns: displayLayout === 'grid' || displayLayout === 'card' ? `repeat(${columns}, minmax(0, 1fr))` : 'none',
          gap: '1rem'
        },
        children: Array.from({
          length: totalItems
        }).map((_, index) => {
          const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
          const postData = posts && posts[index] ? posts[index] : null;
          const contextValue = postData ? {
            postId: postData.id,
            postType: postData.type
          } : {};
          if (index === 0) {
            const itemStyle2 = {};
            if (animationType !== 'none') {
              itemStyle2['--jankx-animation-duration'] = `${animationDuration}ms`;
              itemStyle2['--jankx-animation-delay'] = `${index * animationDelay}ms`;
            }
            const spacing2 = attributes?.style?.spacing;
            if (spacing2?.padding) {
              const p2 = spacing2.padding;
              if (p2.top) itemStyle2.paddingTop = p2.top;
              if (p2.right) itemStyle2.paddingRight = p2.right;
              if (p2.bottom) itemStyle2.paddingBottom = p2.bottom;
              if (p2.left) itemStyle2.paddingLeft = p2.left;
            }
            if (spacing2?.margin) {
              const m2 = spacing2.margin;
              if (m2.top) itemStyle2.marginTop = m2.top;
              if (m2.right) itemStyle2.marginRight = m2.right;
              if (m2.bottom) itemStyle2.marginBottom = m2.bottom;
              if (m2.left) itemStyle2.marginLeft = m2.left;
            }
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
              className: `dynamic-data-template__item ${animationClass}`,
              "data-item-index": index,
              style: itemStyle2,
              children: postData ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
                value: contextValue,
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  ...innerBlocksProps
                })
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                ...innerBlocksProps
              })
            }, `item-${index}`);
          }
          const itemStyle3 = {};
          const spacing3 = attributes?.style?.spacing;
          if (spacing3?.padding) {
            const p3 = spacing3.padding;
            if (p3.top) itemStyle3.paddingTop = p3.top;
            if (p3.right) itemStyle3.paddingRight = p3.right;
            if (p3.bottom) itemStyle3.paddingBottom = p3.bottom;
            if (p3.left) itemStyle3.paddingLeft = p3.left;
          }
          if (spacing3?.margin) {
            const m3 = spacing3.margin;
            if (m3.top) itemStyle3.marginTop = m3.top;
            if (m3.right) itemStyle3.marginRight = m3.right;
            if (m3.bottom) itemStyle3.marginBottom = m3.bottom;
            if (m3.left) itemStyle3.marginLeft = m3.left;
          }
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: `dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`,
            "data-item-index": index,
            style: itemStyle3,
            children: postData ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
              value: contextValue,
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PreviewItem, {
                index: index,
                blocks: sharedInnerBlocks,
                templateItemStyle: buildTemplateItemStyle(attributes),
                templateItemClassName: buildTemplateItemClasses(attributes)
              })
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(PreviewItem, {
              index: index,
              blocks: sharedInnerBlocks,
              templateItemStyle: buildTemplateItemStyle(attributes),
              templateItemClassName: buildTemplateItemClasses(attributes)
            })
          }, `item-${index}`);
        })
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/dynamic-data-template/save.tsx":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-template/save.tsx ***!
  \***********************************************/
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
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    ...(attributes.imageRatio && {
      'data-image-ratio': attributes.imageRatio
    }),
    ...(attributes.thumbnailPosition && {
      'data-thumbnail-position': attributes.thumbnailPosition
    })
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./blocks/dynamic-data-template/style.scss":
/*!*************************************************!*\
  !*** ./blocks/dynamic-data-template/style.scss ***!
  \*************************************************/
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

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

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
/*!************************************************!*\
  !*** ./blocks/dynamic-data-template/index.tsx ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-data-template/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/dynamic-data-template/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/dynamic-data-template/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-data-template/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map