/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/master-data-layout/block.json":
/*!**********************************************!*\
  !*** ./blocks/master-data-layout/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/master-data-layout","version":"1.0.0","title":"Master Data Layout","category":"jankx","icon":"layout","description":"Hiển thị danh sách posts theo layout tùy chỉnh (Master Data)","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","query":{"postType":"postType","perPage":"postsPerPage","pages":0,"offset":"offset","order":"order","orderBy":"orderBy","inherit":false},"displayLayout":"layout"},"usesContext":["queryId","query"],"allowedBlocks":["jankx/master-data-template"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"innerBlocks":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom"},"postType":{"type":"string","default":"post"},"postsPerPage":{"type":"number","default":10},"includeStickyPosts":{"type":"boolean","default":false},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"responsiveColumns":{"type":"object","default":{"desktop":3,"tablet":2,"mobile":1}},"showTitle":{"type":"boolean","default":true},"showExcerpt":{"type":"boolean","default":true},"showFeaturedImage":{"type":"boolean","default":true},"thumbnailPosition":{"type":"string","default":"top","enum":["top","bottom","left","right"]},"imageRatio":{"type":"string","default":""},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"showPrice":{"type":"boolean","default":true},"showAddToCart":{"type":"boolean","default":true},"showRating":{"type":"boolean","default":false},"excerptLength":{"type":"number","default":55},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"number"},"enablePagination":{"type":"boolean","default":false},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""},"paginationStyle":{"type":"string","default":"numbers","enum":["numbers","simple","arrows","load-more"]},"paginationAlignment":{"type":"string","default":"center","enum":["left","center","right"]},"showPaginationNumbers":{"type":"boolean","default":true},"paginationPrevText":{"type":"string","default":""},"paginationNextText":{"type":"string","default":""},"slidesToScroll":{"type":"number","default":1},"loop":{"type":"boolean","default":false},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"showArrows":{"type":"boolean","default":true},"showDots":{"type":"boolean","default":true},"carouselAlign":{"type":"string","default":"start","enum":["start","center","end"]},"carouselAxis":{"type":"string","default":"x","enum":["x","y"]},"carouselDirection":{"type":"string","default":"ltr","enum":["ltr","rtl"]},"carouselStartIndex":{"type":"number","default":0},"carouselDuration":{"type":"number","default":25},"carouselDragFree":{"type":"boolean","default":false},"carouselDragThreshold":{"type":"number","default":10},"carouselSkipSnaps":{"type":"boolean","default":false},"carouselContainScroll":{"type":"string","default":"trimSnaps","enum":["false","trimSnaps","keepSnaps"]},"carouselInViewThreshold":{"type":"number","default":0}}}');

/***/ }),

/***/ "./blocks/master-data-layout/edit.tsx":
/*!********************************************!*\
  !*** ./blocks/master-data-layout/edit.tsx ***!
  \********************************************/
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
/* harmony import */ var _layout_renderer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layout-renderer */ "./blocks/master-data-layout/layout-renderer.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







const normalizeTokens = tokens => {
  return tokens.map(token => {
    if (typeof token === 'string') {
      return token.trim();
    }
    if (token && typeof token.value === 'string') {
      return token.value.trim();
    }
    return '';
  }).filter(value => value.length > 0);
};
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    queryPreset,
    postType,
    postsPerPage,
    layout,
    columns,
    columnsTablet,
    columnsMobile,
    showTitle,
    showExcerpt,
    showFeaturedImage,
    includeStickyPosts = false,
    thumbnailPosition = 'top',
    imageRatio,
    showDate,
    showAuthor,
    showPrice = true,
    showAddToCart = true,
    showRating = false,
    excerptLength,
    orderBy,
    order,
    queryId,
    enablePagination,
    paginationStyle,
    paginationAlignment,
    showPaginationNumbers,
    paginationPrevText = '',
    paginationNextText = '',
    offset = 0,
    taxQuery = [],
    metaQuery = [],
    keyword = '',
    authorIn = [],
    authorNotIn = [],
    postIn = [],
    postNotIn = [],
    metaKey = '',
    metaType = '',
    postStatus = ['publish'],
    postParent = 0,
    postParentIn = [],
    postParentNotIn = [],
    customQueryId = '',
    slidesToScroll = 1,
    loop = false,
    autoplay = false,
    autoplayDelay = 3000,
    showArrows = true,
    showDots = true
  } = attributes;

  // States for taxonomies and authors
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)({});
  const isMountedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(true);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Generate unique queryId if not set
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!queryId) {
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      setAttributes({
        queryId: Math.abs(hash)
      });
    }
  }, [queryId, clientId, setAttributes]);

  // Reset queryPreset if current preset is not valid for the current postType
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    const validPresets = allPresets.filter(preset => !preset.postType || preset.postType === postType);
    const currentPresetValid = validPresets.some(preset => preset.value === queryPreset);
    if (!currentPresetValid && validPresets.length > 0) {
      setAttributes({
        queryPreset: validPresets[0].value
      });
    }
  }, [postType, queryPreset, setAttributes]);

  // Fetch taxonomies and authors when postType changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const fetchTaxonomiesAndAuthors = async () => {
      try {
        const taxonomiesData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${postType}`
        });
        if (!isMountedRef.current) {
          return;
        }
        const taxArray = Object.values(taxonomiesData || {}).filter(item => typeof item?.slug === 'string' && typeof item?.name === 'string');
        setTaxonomies(taxArray);
        const authorsData = await window.wp.apiFetch({
          path: '/wp/v2/users?who=authors&per_page=100'
        });
        if (!isMountedRef.current) {
          return;
        }
        const normalizedAuthors = (authorsData || []).map(author => {
          const id = typeof author?.id === 'number' ? author.id : Number(author?.id);
          const name = typeof author?.name === 'string' && author.name.length > 0 ? author.name : typeof author?.slug === 'string' ? author.slug : '';
          return {
            id: Number.isFinite(id) ? id : 0,
            name
          };
        }).filter(author => author.id > 0 && author.name.length > 0);
        setAuthors(normalizedAuthors);
      } catch (error) {
        console.error('Error fetching taxonomies/authors:', error);
        if (!isMountedRef.current) {
          return;
        }
        setTaxonomies([]);
        setAuthors([]);
      }
    };
    fetchTaxonomiesAndAuthors();
  }, [postType]);

  // Function to fetch terms for a specific taxonomy
  const fetchTermsForTaxonomy = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async taxonomy => {
    if (taxonomyTerms[taxonomy]) {
      return;
    }
    try {
      const termsResponse = await window.wp.apiFetch({
        path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
      });
      if (!isMountedRef.current) {
        return;
      }
      const normalizedTerms = (termsResponse || []).map(term => {
        const id = typeof term?.id === 'number' ? term.id : Number(term?.id);
        const name = typeof term?.name === 'string' ? term.name : '';
        return {
          id: Number.isFinite(id) ? id : 0,
          name
        };
      }).filter(term => term.id > 0 && term.name.length > 0);
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: normalizedTerms
      }));
    } catch (error) {
      console.error(`Error fetching terms for ${taxonomy}:`, error);
      if (!isMountedRef.current) {
        return;
      }
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: []
      }));
    }
  }, [taxonomyTerms]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `master-data-layout layout-${layout}`
  });
  const isProduct = postType === 'product';

  // Get inner blocks from template block
  const innerBlocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const blocks = getBlocks(clientId) || [];
    const templateBlock = blocks.find(block => block.name === 'jankx/master-data-template');
    return templateBlock?.innerBlocks || [];
  }, [clientId]);

  // Preview HTML for editor (generated from structure)
  const [previewHtml, setPreviewHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');

  // Generate preview HTML from structure when attributes change
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const generatePreview = () => {
      const layoutStructure = (0,_layout_renderer__WEBPACK_IMPORTED_MODULE_5__.getLayoutStructure)(layout);
      const postItemStructure = (0,_layout_renderer__WEBPACK_IMPORTED_MODULE_5__.getPostItemStructure)();
      if (!layoutStructure || !postItemStructure) {
        setPreviewHtml('');
        return;
      }

      // Update container structure with current columns
      const updatedStructure = {
        ...layoutStructure,
        container: {
          ...layoutStructure.container,
          classes: [...(layoutStructure.container.classes || []).filter(cls => !cls.startsWith('columns-')), `columns-${columns}`, `columns-tablet-${columnsTablet}`, `columns-mobile-${columnsMobile}`],
          styles: {
            ...(layoutStructure.container.styles || {}),
            '--columns-desktop': String(columns),
            '--columns-tablet': String(columnsTablet),
            '--columns-mobile': String(columnsMobile)
          }
        }
      };

      // Generate preview with sample posts data
      // Use inner blocks from template to determine what to show
      const innerBlockNames = innerBlocks.map(block => block.name);
      const hasFeaturedImage = innerBlockNames.includes('core/post-featured-image');
      const hasTitle = innerBlockNames.includes('core/post-title') || innerBlockNames.includes('woocommerce/product-title');
      const hasDate = innerBlockNames.includes('core/post-date');
      const hasExcerpt = innerBlockNames.includes('core/post-excerpt');
      const hasPrice = innerBlockNames.includes('woocommerce/product-price');
      const hasButton = innerBlockNames.includes('woocommerce/product-button');
      const samplePosts = Array.from({
        length: Math.min(postsPerPage, 6)
      }, (_, i) => ({
        id: i + 1,
        title: `Sample Post ${i + 1}`,
        date: new Date().toLocaleDateString(),
        excerpt: 'This is a sample excerpt for preview purposes...',
        author: 'Sample Author',
        featuredImage: hasFeaturedImage ? '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect fill=\'%23ddd\' width=\'800\' height=\'600\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3E800x600%3C/text%3E%3C/svg%3E" alt="Sample" />' : '',
        price: hasPrice ? '$99.99' : '',
        button: hasButton ? '<button>Add to Cart</button>' : '',
        link: '#'
      }));
      const renderedHtml = (0,_layout_renderer__WEBPACK_IMPORTED_MODULE_5__.renderLayout)(updatedStructure, samplePosts, postItemStructure, {
        showFeaturedImage: hasFeaturedImage,
        showTitle: hasTitle,
        showDate: hasDate,
        showAuthor: false,
        showExcerpt: hasExcerpt,
        showPrice: hasPrice,
        showAddToCart: hasButton,
        showRating: false,
        thumbnailPosition,
        imageRatio
      });
      setPreviewHtml(renderedHtml);
    };

    // Debounce preview generation
    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [layout, columns, columnsTablet, columnsMobile, thumbnailPosition, imageRatio, postsPerPage, innerBlocks // Add innerBlocks dependency
  ]);

  // Get available post types
  const postTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getPostTypes
    } = select('core');
    return getPostTypes({
      per_page: -1
    }) || [];
  }, []);
  const postTypeOptions = postTypes.filter(type => type.viewable && type.slug !== 'attachment').map(type => ({
    label: type.name,
    value: type.slug
  }));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      group: "settings",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Preset', 'jankx'),
          value: queryPreset,
          options: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
            const allPresets = window.jankxQueryOptions?.queryPresets || [];
            return allPresets.filter(preset => !preset.postType || preset.postType === postType).map(preset => ({
              label: preset.label,
              value: preset.value
            }));
          }, [postType]),
          onChange: value => setAttributes({
            queryPreset: value
          }),
          help: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
            const allPresets = window.jankxQueryOptions?.queryPresets || [];
            const currentPreset = allPresets.find(p => p.value === queryPreset);
            return currentPreset?.help || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a query preset', 'jankx');
          }, [queryPreset])
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => setAttributes({
            postType: value
          }),
          help: queryPreset === 'default' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select post type for the main query', 'jankx') : undefined
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value || 10
          }),
          min: 1,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of posts to display', 'jankx')
        }), postType === 'post' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include Sticky Posts', 'jankx'),
          checked: includeStickyPosts,
          onChange: value => setAttributes({
            includeStickyPosts: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include sticky posts in the query (disabled by default).', 'jankx')
        }), queryPreset !== 'default' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order By', 'jankx'),
            value: orderBy,
            options: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
              const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
              return allOrderByOptions.filter(option => !option.postType || option.postType === postType).map(option => ({
                label: option.label,
                value: option.value
              }));
            }, [postType]),
            onChange: value => {
              const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
              const selectedOption = allOrderByOptions.find(opt => opt.value === value);
              const updates = {
                orderBy: value
              };
              if (selectedOption?.metaKey) {
                updates.metaKey = selectedOption.metaKey;
                if (['total_sales', '_price'].includes(value)) {
                  updates.orderBy = 'meta_value_num';
                }
              }
              setAttributes(updates);
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort posts by which criteria', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order', 'jankx'),
            value: order,
            options: window.jankxQueryOptions?.order || [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Descending', 'jankx'),
              value: 'DESC'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ascending', 'jankx'),
              value: 'ASC'
            }],
            onChange: value => setAttributes({
              order: value
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Type', 'jankx'),
          value: layout,
          options: window.jankxSupportedPostTypeLayouts?.map(layout => ({
            label: layout.title,
            value: layout.name
          })) || [{
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
          }],
          onChange: value => setAttributes({
            layout: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns (Desktop)', 'jankx'),
          value: columns,
          onChange: value => setAttributes({
            columns: value || 3
          }),
          min: 1,
          max: 6,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on desktop', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns (Tablet)', 'jankx'),
          value: columnsTablet,
          onChange: value => setAttributes({
            columnsTablet: value || 2
          }),
          min: 1,
          max: 6,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on tablet', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns (Mobile)', 'jankx'),
          value: columnsMobile,
          onChange: value => setAttributes({
            columnsMobile: value || 1
          }),
          min: 1,
          max: 3,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on mobile', 'jankx')
        }), layout === 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slides To Scroll', 'jankx'),
            value: slidesToScroll,
            onChange: value => setAttributes({
              slidesToScroll: value || 1
            }),
            min: 1,
            max: columns || 3,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of slides to scroll at a time', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loop', 'jankx'),
            checked: loop,
            onChange: value => setAttributes({
              loop: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable infinite loop', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'jankx'),
            checked: autoplay,
            onChange: value => setAttributes({
              autoplay: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatically advance slides', 'jankx')
          }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay Delay (ms)', 'jankx'),
            value: autoplayDelay,
            onChange: value => setAttributes({
              autoplayDelay: value || 3000
            }),
            min: 1000,
            max: 10000,
            step: 500,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time between autoplay transitions', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Arrows', 'jankx'),
            checked: showArrows,
            onChange: value => setAttributes({
              showArrows: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display navigation arrows', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Dots', 'jankx'),
            checked: showDots,
            onChange: value => setAttributes({
              showDots: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display pagination dots', 'jankx')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Featured Image', 'jankx'),
          checked: showFeaturedImage,
          onChange: value => setAttributes({
            showFeaturedImage: value
          })
        }), showFeaturedImage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail Position', 'jankx'),
          value: thumbnailPosition,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top', 'jankx'),
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
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Title', 'jankx'),
          checked: showTitle,
          onChange: value => setAttributes({
            showTitle: value
          })
        }), !isProduct && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Excerpt', 'jankx'),
            checked: showExcerpt,
            onChange: value => setAttributes({
              showExcerpt: value
            })
          }), showExcerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Excerpt Length', 'jankx'),
            value: excerptLength,
            onChange: value => setAttributes({
              excerptLength: value || 55
            }),
            min: 10,
            max: 200
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Date', 'jankx'),
            checked: showDate,
            onChange: value => setAttributes({
              showDate: value
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Author', 'jankx'),
          checked: showAuthor,
          onChange: value => setAttributes({
            showAuthor: value
          })
        }), isProduct && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Price', 'jankx'),
            checked: showPrice,
            onChange: value => setAttributes({
              showPrice: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Add To Cart', 'jankx'),
            checked: showAddToCart,
            onChange: value => setAttributes({
              showAddToCart: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Rating', 'jankx'),
            checked: showRating,
            onChange: value => setAttributes({
              showRating: value
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Pagination', 'jankx'),
          checked: enablePagination,
          onChange: value => setAttributes({
            enablePagination: value
          })
        }), enablePagination && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination Style', 'jankx'),
            value: paginationStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Numbers', 'jankx'),
              value: 'numbers'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Simple', 'jankx'),
              value: 'simple'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Arrows', 'jankx'),
              value: 'arrows'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load More', 'jankx'),
              value: 'load-more'
            }],
            onChange: value => setAttributes({
              paginationStyle: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination Alignment', 'jankx'),
            value: paginationAlignment,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left', 'jankx'),
              value: 'left'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Center', 'jankx'),
              value: 'center'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right', 'jankx'),
              value: 'right'
            }],
            onChange: value => setAttributes({
              paginationAlignment: value
            })
          }), paginationStyle === 'numbers' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show All Page Numbers', 'jankx'),
            checked: showPaginationNumbers,
            onChange: value => setAttributes({
              showPaginationNumbers: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous Button Text', 'jankx'),
            value: paginationPrevText,
            onChange: value => setAttributes({
              paginationPrevText: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('← Previous', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next Button Text', 'jankx'),
            value: paginationNextText,
            onChange: value => setAttributes({
              paginationNextText: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next →', 'jankx')
          })]
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'jankx'),
          value: offset,
          onChange: value => setAttributes({
            offset: value || 0
          }),
          min: 0,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Skip the first N posts', 'jankx')
        }), (orderBy === 'meta_value' || orderBy === 'meta_value_num') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
            value: metaKey,
            onChange: value => setAttributes({
              metaKey: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta key for sorting', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('price, views, rating', 'jankx')
          }), orderBy === 'meta_value' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Type', 'jankx'),
            value: metaType,
            options: window.jankxQueryOptions?.metaTypes || [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }],
            onChange: value => setAttributes({
              metaType: value
            })
          })]
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔧 Advanced Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query ID', 'jankx'),
          value: customQueryId,
          onChange: value => setAttributes({
            customQueryId: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set a name for this query to apply filters', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('featured-posts, sidebar-posts', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Status', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post status to fetch (default: publish)', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
            value: postStatus,
            suggestions: ['publish', 'pending', 'draft', 'future', 'private'],
            onChange: tokens => setAttributes({
              postStatus: normalizeTokens(tokens)
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent ID', 'jankx'),
          type: "number",
          value: String(postParent),
          onChange: value => setAttributes({
            postParent: parseInt(value) || 0
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter posts by parent ID', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent IDs (Include)', 'jankx'),
          value: postParentIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentIn: ids
            });
          },
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent IDs (Exclude)', 'jankx'),
          value: postParentNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentNotIn: ids
            });
          },
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔍 Keyword Search', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search Keyword', 'jankx'),
          value: keyword,
          onChange: value => setAttributes({
            keyword: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search by title, content, excerpt', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter keyword...', 'jankx')
        })
      }), queryPreset === 'custom' && authors.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('👤 Author Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Authors (Include)', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only display posts from these authors', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
            value: authors.filter(author => authorIn.includes(author.id)).map(author => author.name),
            suggestions: authors.map(author => author.name),
            onChange: tokens => {
              const normalizedTokens = normalizeTokens(tokens);
              const selectedIds = normalizedTokens.map(tokenName => {
                var _author$id;
                const author = authors.find(item => item.name === tokenName);
                return (_author$id = author?.id) !== null && _author$id !== void 0 ? _author$id : 0;
              }).filter(id => id > 0);
              setAttributes({
                authorIn: selectedIds
              });
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Authors (Exclude)', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude posts from these authors', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
            value: authors.filter(author => authorNotIn.includes(author.id)).map(author => author.name),
            suggestions: authors.map(author => author.name),
            onChange: tokens => {
              const normalizedTokens = normalizeTokens(tokens);
              const selectedIds = normalizedTokens.map(tokenName => {
                var _author$id2;
                const author = authors.find(item => item.name === tokenName);
                return (_author$id2 = author?.id) !== null && _author$id2 !== void 0 ? _author$id2 : 0;
              }).filter(id => id > 0);
              setAttributes({
                authorNotIn: selectedIds
              });
            }
          })
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔢 Post ID Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post IDs (Include)', 'jankx'),
          value: postIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only display posts with these IDs', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post IDs (Exclude)', 'jankx'),
          value: postNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude posts with these IDs', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('4, 5, 6', 'jankx')
        })]
      }), queryPreset === 'custom' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('⚙️ Meta Query Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          onClick: () => {
            const newMetaQuery = [...metaQuery];
            newMetaQuery.push({
              key: '',
              value: '',
              compare: '='
            });
            setAttributes({
              metaQuery: newMetaQuery
            });
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('+ Add Meta Query', 'jankx')
        }), metaQuery.map((mq, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          style: {
            marginTop: '15px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("strong", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Query', 'jankx'), " #", index + 1]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isDestructive: true,
              isSmall: true,
              onClick: () => {
                const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                setAttributes({
                  metaQuery: newMetaQuery
                });
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'jankx')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
            value: mq.key,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) return;
              newMetaQuery[index] = {
                ...targetQuery,
                key: value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('price, rating, views', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Compare', 'jankx'),
            value: mq.compare,
            options: [{
              label: '= (Equal)',
              value: '='
            }, {
              label: '!= (Not Equal)',
              value: '!='
            }, {
              label: '> (Greater Than)',
              value: '>'
            }, {
              label: '>= (Greater or Equal)',
              value: '>='
            }, {
              label: '< (Less Than)',
              value: '<'
            }, {
              label: '<= (Less or Equal)',
              value: '<='
            }, {
              label: 'LIKE (Contains)',
              value: 'LIKE'
            }, {
              label: 'NOT LIKE',
              value: 'NOT LIKE'
            }, {
              label: 'IN (In List)',
              value: 'IN'
            }, {
              label: 'NOT IN',
              value: 'NOT IN'
            }, {
              label: 'EXISTS',
              value: 'EXISTS'
            }, {
              label: 'NOT EXISTS',
              value: 'NOT EXISTS'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) return;
              newMetaQuery[index] = {
                ...targetQuery,
                compare: value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            }
          }), !['EXISTS', 'NOT EXISTS'].includes(mq.compare) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Value', 'jankx'),
            value: mq.value,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) return;
              newMetaQuery[index] = {
                ...targetQuery,
                value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter value...', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Type (Optional)', 'jankx'),
            value: mq.type || '',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('-- Auto --', 'jankx'),
              value: ''
            }, {
              label: 'NUMERIC',
              value: 'NUMERIC'
            }, {
              label: 'BINARY',
              value: 'BINARY'
            }, {
              label: 'CHAR',
              value: 'CHAR'
            }, {
              label: 'DATE',
              value: 'DATE'
            }, {
              label: 'DATETIME',
              value: 'DATETIME'
            }, {
              label: 'DECIMAL',
              value: 'DECIMAL'
            }, {
              label: 'TIME',
              value: 'TIME'
            }, {
              label: 'SIGNED',
              value: 'SIGNED'
            }, {
              label: 'UNSIGNED',
              value: 'UNSIGNED'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) return;
              const updatedQuery = {
                ...targetQuery
              };
              if (value) {
                updatedQuery.type = value;
              } else {
                delete updatedQuery.type;
              }
              newMetaQuery[index] = updatedQuery;
              setAttributes({
                metaQuery: newMetaQuery
              });
            }
          })]
        }, index))]
      }), queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map(taxonomy => {
        const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
        const hasQuery = existingQueryIndex >= 0;
        const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
        const terms = taxonomyTerms[taxonomy.slug];
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: `🏷️ ${taxonomy.name}`,
          initialOpen: hasQuery,
          onToggle: isOpen => {
            if (isOpen) {
              fetchTermsForTaxonomy(taxonomy.slug);
            }
          },
          children: !hasQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: () => {
              const newTaxQuery = [...taxQuery];
              newTaxQuery.push({
                taxonomy: taxonomy.slug,
                terms: [],
                operator: 'IN'
              });
              setAttributes({
                taxQuery: newTaxQuery
              });
              fetchTermsForTaxonomy(taxonomy.slug);
            },
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Filter', 'jankx'), " ", taxonomy.name]
          }) : currentQuery && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Operator', 'jankx'),
              value: currentQuery.operator,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('IN (Include)', 'jankx'),
                value: 'IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('NOT IN (Exclude)', 'jankx'),
                value: 'NOT IN'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('AND (Must Have All)', 'jankx'),
                value: 'AND'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('EXISTS (Has Terms)', 'jankx'),
                value: 'EXISTS'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('NOT EXISTS (No Terms)', 'jankx'),
                value: 'NOT EXISTS'
              }],
              onChange: value => {
                const newTaxQuery = [...taxQuery];
                const targetQuery = newTaxQuery[existingQueryIndex];
                if (!targetQuery) return;
                newTaxQuery[existingQueryIndex] = {
                  ...targetQuery,
                  operator: value
                };
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx')
            }), !['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
              children: terms ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Terms', 'jankx'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select terms from dropdown', 'jankx'),
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
                  value: terms.filter(term => currentQuery.terms.includes(term.id)).map(term => term.name),
                  suggestions: terms.map(term => term.name),
                  onChange: tokens => {
                    const selectedNames = normalizeTokens(tokens);
                    const selectedIds = selectedNames.map(tokenName => {
                      var _term$id;
                      const term = terms.find(item => item.name === tokenName);
                      return (_term$id = term?.id) !== null && _term$id !== void 0 ? _term$id : 0;
                    }).filter(id => id > 0);
                    const newTaxQuery = [...taxQuery];
                    const targetQuery = newTaxQuery[existingQueryIndex];
                    if (!targetQuery) return;
                    newTaxQuery[existingQueryIndex] = {
                      ...targetQuery,
                      terms: selectedIds
                    };
                    setAttributes({
                      taxQuery: newTaxQuery
                    });
                  }
                })
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {})
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isDestructive: true,
              variant: "secondary",
              onClick: () => {
                const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              style: {
                marginTop: '10px'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove Filter', 'jankx')
            })]
          })
        }, taxonomy.slug);
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      ...blockProps,
      children: previewHtml ? layout === 'carousel' ?
      /*#__PURE__*/
      // For carousel, previewHtml already contains full structure from PHP
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: previewHtml
        }
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: previewHtml
        }
      }) :
      /*#__PURE__*/
      // Show InnerBlocks for editing when preview is not ready
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
        template: [['jankx/master-data-template', {}]],
        templateLock: "all",
        allowedBlocks: ['jankx/master-data-template'],
        renderAppender: false
      })
    })]
  });
}

/***/ }),

/***/ "./blocks/master-data-layout/layout-renderer.ts":
/*!******************************************************!*\
  !*** ./blocks/master-data-layout/layout-renderer.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLayoutStructure: () => (/* binding */ getLayoutStructure),
/* harmony export */   getPostItemStructure: () => (/* binding */ getPostItemStructure),
/* harmony export */   renderLayout: () => (/* binding */ renderLayout),
/* harmony export */   renderPostItem: () => (/* binding */ renderPostItem)
/* harmony export */ });
/**
 * Layout Renderer Utility
 * 
 * Render HTML từ layout structure được định nghĩa từ PHP
 */

/**
 * Render một element từ structure
 */
function renderElement(element, context) {
  const tag = element.tag || 'div';
  const classes = element.classes || [];
  const attributes = element.attributes || {};
  const styles = element.styles || {};
  const text = element.text;
  const placeholder = element.placeholder;
  const children = element.children;

  // Build attributes string
  const attrs = [];
  if (classes.length > 0) {
    attrs.push(`class="${classes.join(' ')}"`);
  }

  // Add data attributes and other attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === true) {
      attrs.push(key);
    } else if (value !== false && value !== null && value !== undefined) {
      attrs.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`);
    }
  });

  // Add inline styles
  if (Object.keys(styles).length > 0) {
    const styleString = Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ');
    attrs.push(`style="${styleString}"`);
  }
  const attrsString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

  // Handle placeholder first - if element has placeholder and context provides value
  // This takes priority over children/text
  if (placeholder && context) {
    const placeholderValue = context[placeholder];
    if (placeholderValue !== undefined) {
      // If we have children, render them first then replace placeholder in result
      if (children && children.length > 0) {
        let childrenHtml = children.map(child => renderElement(child, context)).join('');
        // Replace placeholder pattern in rendered children HTML
        childrenHtml = childrenHtml.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), placeholderValue);
        return `<${tag}${attrsString}>${childrenHtml}</${tag}>`;
      }
      // No children, use placeholder value directly
      return `<${tag}${attrsString}>${placeholderValue}</${tag}>`;
    }
  }

  // Render children if no placeholder or placeholder not in context
  let childrenHtml = '';
  if (children && children.length > 0) {
    childrenHtml = children.map(child => renderElement(child, context)).join('');
  }

  // If we have children HTML, use it
  if (childrenHtml) {
    return `<${tag}${attrsString}>${childrenHtml}</${tag}>`;
  }
  if (text !== undefined) {
    return `<${tag}${attrsString}>${text}</${tag}>`;
  }

  // Self-closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  if (selfClosingTags.includes(tag.toLowerCase())) {
    return `<${tag}${attrsString} />`;
  }
  return `<${tag}${attrsString}></${tag}>`;
}

/**
 * Render post item từ structure và post data
 */
function renderPostItem(postItemStructure, postData, options = {}) {
  const elements = [];
  const {
    showFeaturedImage = true,
    showTitle = true,
    showDate = true,
    showAuthor = false,
    showExcerpt = true,
    showPrice = true,
    showAddToCart = true,
    showRating = false,
    thumbnailPosition = 'top',
    imageRatio = ''
  } = options;

  // Build content wrapper children
  const contentChildren = [];

  // Featured image
  if (showFeaturedImage && postItemStructure.featuredImage) {
    const imageContext = {
      'featured-image': postData.featuredImage || ''
    };
    const imageHtml = renderElement(postItemStructure.featuredImage, imageContext);
    elements.push(imageHtml);
  }

  // Title
  if (showTitle && postItemStructure.title) {
    // Find the innermost element with placeholder and set context
    const titleElement = postItemStructure.title;
    const titleContext = {
      'post-title': postData.title || 'Post Title'
    };

    // Render title with context for placeholder replacement
    const titleHtml = renderElement(titleElement, titleContext);
    if (thumbnailPosition === 'top' || thumbnailPosition === 'bottom') {
      contentChildren.push(titleHtml);
    } else {
      elements.push(titleHtml);
    }
  }

  // Date and Author - wrap in post-meta if either is shown
  if ((showDate || showAuthor) && (postItemStructure.date || postItemStructure.author)) {
    const metaChildren = [];
    if (showDate && postItemStructure.date) {
      const dateContext = {
        'post-date': postData.date || ''
      };
      metaChildren.push(renderElement(postItemStructure.date, dateContext));
    }
    if (showAuthor && postItemStructure.author) {
      const authorContext = {
        'post-author': postData.author || ''
      };
      metaChildren.push(renderElement(postItemStructure.author, authorContext));
    }

    // Wrap in post-meta div if we have metaWrapper structure
    if (postItemStructure.metaWrapper && metaChildren.length > 0) {
      const metaWrapper = {
        ...postItemStructure.metaWrapper,
        text: metaChildren.join('')
      };
      contentChildren.push(renderElement(metaWrapper));
    } else if (metaChildren.length > 0) {
      contentChildren.push(...metaChildren);
    }
  }

  // Excerpt
  if (showExcerpt && postItemStructure.excerpt) {
    const excerptContext = {
      'post-excerpt': postData.excerpt || ''
    };
    contentChildren.push(renderElement(postItemStructure.excerpt, excerptContext));
  }

  // Price (for products)
  if (showPrice && postItemStructure.price) {
    const priceContext = {
      'product-price': postData.price || ''
    };
    contentChildren.push(renderElement(postItemStructure.price, priceContext));
  }

  // Add to cart (for products)
  if (showAddToCart && postItemStructure.addToCart) {
    const buttonContext = {
      'product-button': postData.addToCart || ''
    };
    contentChildren.push(renderElement(postItemStructure.addToCart, buttonContext));
  }

  // Rating (for products)
  if (showRating && postItemStructure.rating) {
    const ratingContext = {
      'product-rating': postData.rating || ''
    };
    contentChildren.push(renderElement(postItemStructure.rating, ratingContext));
  }

  // Content wrapper
  if (postItemStructure.contentWrapper && contentChildren.length > 0) {
    const contentWrapperHtml = contentChildren.join('');
    const contentWrapper = {
      ...postItemStructure.contentWrapper,
      text: contentWrapperHtml
    };
    elements.push(renderElement(contentWrapper));
  } else if (contentChildren.length > 0) {
    elements.push(...contentChildren);
  }
  return elements.join('');
}

/**
 * Render layout từ structure và posts data
 */
function renderLayout(structure, posts, postItemStructure, options = {}) {
  const {
    itemWrapper,
    container,
    emptyState
  } = structure;
  const isCarousel = structure.layout === 'carousel';
  if (posts.length === 0 && emptyState) {
    return renderElement(emptyState);
  }
  const itemsHtml = posts.map(post => {
    const itemHtml = renderPostItem(postItemStructure, post, options);
    if (itemWrapper) {
      // For carousel layout, itemWrapper has nested structure: embla__slide -> article
      if (isCarousel && itemWrapper.children && itemWrapper.children.length > 0) {
        // Find the article element inside embla__slide
        const articleElement = itemWrapper.children[0];
        const articleWithContent = {
          ...articleElement,
          attributes: {
            ...articleElement.attributes,
            id: articleElement.attributes?.id?.toString().replace('{{post-id}}', String(post.id || '')) || `post-${post.id || ''}`
          },
          text: itemHtml,
          placeholder: undefined // Remove placeholder since we have content
        };

        // Wrap in embla__slide
        const slideWithArticle = {
          ...itemWrapper,
          children: [articleWithContent]
        };
        return renderElement(slideWithArticle);
      }

      // For non-carousel layouts, use simple wrapper
      const wrapperWithId = {
        ...itemWrapper,
        attributes: {
          ...itemWrapper.attributes,
          id: itemWrapper.attributes?.id?.toString().replace('{{post-id}}', String(post.id || '')) || `post-${post.id || ''}`
        },
        text: itemHtml
      };
      return renderElement(wrapperWithId);
    }
    return itemHtml;
  }).join('');

  // For carousel layout, container has nested structure: div -> embla__viewport -> embla__container
  if (isCarousel && container.children && container.children.length > 0) {
    const viewportElement = container.children[0];
    if (viewportElement.children && viewportElement.children.length > 0) {
      const containerElement = viewportElement.children[0];
      // Replace placeholder with actual slides HTML
      const containerWithSlides = {
        ...containerElement,
        text: itemsHtml,
        placeholder: undefined // Remove placeholder since we have content
      };
      const viewportWithContainer = {
        ...viewportElement,
        children: [containerWithSlides]
      };
      const carouselWithViewport = {
        ...container,
        children: [viewportWithContainer]
      };
      return renderElement(carouselWithViewport);
    }
  }

  // For non-carousel layouts, use simple container
  const containerWithChildren = {
    ...container,
    text: itemsHtml
  };
  return renderElement(containerWithChildren);
}

/**
 * Get layout structure from localized data
 */
function getLayoutStructure(layoutName) {
  if (typeof window === 'undefined') {
    return null;
  }
  const structures = window.jankxLayoutStructures;
  if (!structures || !structures.layouts || !structures.layouts[layoutName]) {
    return null;
  }
  return structures.layouts[layoutName];
}

/**
 * Get post item structure from localized data
 */
function getPostItemStructure() {
  if (typeof window === 'undefined') {
    return null;
  }
  const structures = window.jankxLayoutStructures;
  if (!structures || !structures.postItem) {
    return null;
  }
  return structures.postItem;
}

/***/ }),

/***/ "./blocks/master-data-layout/save.tsx":
/*!********************************************!*\
  !*** ./blocks/master-data-layout/save.tsx ***!
  \********************************************/
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

/***/ "./blocks/master-data-layout/style.scss":
/*!**********************************************!*\
  !*** ./blocks/master-data-layout/style.scss ***!
  \**********************************************/
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
/*!*********************************************!*\
  !*** ./blocks/master-data-layout/index.tsx ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/master-data-layout/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/master-data-layout/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/master-data-layout/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/master-data-layout/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map