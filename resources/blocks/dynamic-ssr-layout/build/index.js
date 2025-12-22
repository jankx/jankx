/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-ssr-layout/block.json":
/*!**********************************************!*\
  !*** ./blocks/dynamic-ssr-layout/block.json ***!
  \**********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-ssr-layout","version":"1.0.0","title":"Dynamic SSR Layout","category":"jankx","icon":"layout","description":"Wrapper layout hiển thị danh sách posts với SSR template","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","postType":"postType","displayLayout":"layout","postsPerPage":"postsPerPage","columns":"columns","columnsTablet":"columnsTablet","columnsMobile":"columnsMobile","slidesToScroll":"slidesToScroll","loop":"loop","autoplay":"autoplay","autoplayDelay":"autoplayDelay","showArrows":"showArrows","showDots":"showDots","carouselAlign":"carouselAlign","carouselAxis":"carouselAxis","carouselDirection":"carouselDirection","carouselStartIndex":"carouselStartIndex","carouselDuration":"carouselDuration","carouselDragFree":"carouselDragFree","carouselDragThreshold":"carouselDragThreshold","carouselSkipSnaps":"carouselSkipSnaps","carouselContainScroll":"carouselContainScroll","carouselInViewThreshold":"carouselInViewThreshold","queryPreset":"queryPreset","includeStickyPosts":"includeStickyPosts","orderBy":"orderBy","order":"order","offset":"offset","taxQuery":"taxQuery","metaQuery":"metaQuery","keyword":"keyword","authorIn":"authorIn","authorNotIn":"authorNotIn","postIn":"postIn","postNotIn":"postNotIn","metaKey":"metaKey","metaType":"metaType","postStatus":"postStatus","postParent":"postParent","postParentIn":"postParentIn","postParentNotIn":"postParentNotIn","customQueryId":"customQueryId"},"usesContext":["queryId","postType"],"allowedBlocks":["jankx/dynamic-ssr-template"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"innerBlocks":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom"},"postType":{"type":"string","default":"post"},"useMultiPostType":{"type":"boolean","default":false},"postTypes":{"type":"array","default":[]},"postsPerPage":{"type":"number","default":10},"includeStickyPosts":{"type":"boolean","default":false},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"responsiveColumns":{"type":"object","default":{"desktop":3,"tablet":2,"mobile":1}},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"string","default":""},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""},"enablePagination":{"type":"boolean","default":false},"paginationStyle":{"type":"string","default":"numbers"},"paginationAlignment":{"type":"string","default":"center"},"showPaginationNumbers":{"type":"boolean","default":true},"paginationPrevText":{"type":"string","default":""},"paginationNextText":{"type":"string","default":""},"slidesToScroll":{"type":"number","default":1},"loop":{"type":"boolean","default":false},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"showArrows":{"type":"boolean","default":true},"showDots":{"type":"boolean","default":true},"carouselAlign":{"type":"string","default":"start"},"carouselAxis":{"type":"string","default":"x"},"carouselDirection":{"type":"string","default":"ltr"},"carouselStartIndex":{"type":"number","default":0},"carouselDuration":{"type":"number","default":25},"carouselDragFree":{"type":"boolean","default":false},"carouselDragThreshold":{"type":"number","default":10},"carouselSkipSnaps":{"type":"boolean","default":false},"carouselContainScroll":{"type":"string","default":"trimSnaps"},"carouselInViewThreshold":{"type":"number","default":0},"showTitle":{"type":"boolean","default":true},"showExcerpt":{"type":"boolean","default":true},"showFeaturedImage":{"type":"boolean","default":true},"thumbnailPosition":{"type":"string","default":"top"},"imageRatio":{"type":"string","default":""},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"showPrice":{"type":"boolean","default":true},"showAddToCart":{"type":"boolean","default":true},"showRating":{"type":"boolean","default":false},"excerptLength":{"type":"number","default":55}}}');

/***/ }),

/***/ "./blocks/dynamic-ssr-layout/edit.tsx":
/*!********************************************!*\
  !*** ./blocks/dynamic-ssr-layout/edit.tsx ***!
  \********************************************/
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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-ssr-layout/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.scss */ "./blocks/dynamic-ssr-layout/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const normalizeQueryPresets = rawPresets => {
  if (!Array.isArray(rawPresets)) {
    return [];
  }
  return rawPresets.map(preset => {
    const value = typeof preset?.value === 'string' ? preset.value : '';
    const label = typeof preset?.label === 'string' ? preset.label : '';
    const postType = typeof preset?.postType === 'string' ? preset.postType : null;
    let help;
    if (typeof preset?.help === 'string') {
      help = preset.help;
    } else if (typeof preset?.errorMsg === 'string') {
      help = preset.errorMsg;
    } else if (typeof preset?.message === 'string') {
      help = preset.message;
    }
    return {
      value,
      label,
      postType,
      help
    };
  }).filter(preset => preset.value.length > 0 && preset.label.length > 0);
};
const normalizeLayouts = rawLayouts => {
  if (!Array.isArray(rawLayouts)) {
    return [];
  }
  return rawLayouts.map(layout => {
    const name = typeof layout?.name === 'string' ? layout.name : '';
    const title = typeof layout?.title === 'string' ? layout.title : name;
    return {
      name,
      title
    };
  }).filter(layout => layout.name.length > 0 && layout.title.length > 0);
};
const normalizeLayoutsData = raw => {
  if (!raw || typeof raw !== 'object') {
    return {
      layoutsByPostType: {},
      commonLayouts: []
    };
  }
  const obj = raw;
  const commonLayouts = normalizeLayouts(obj.commonLayouts);
  const layoutsByPostType = {};
  if (obj.layoutsByPostType && typeof obj.layoutsByPostType === 'object') {
    Object.entries(obj.layoutsByPostType).forEach(([postType, layouts]) => {
      const normalized = normalizeLayouts(layouts);
      if (normalized.length > 0) {
        layoutsByPostType[postType] = normalized;
      }
    });
  }
  return {
    layoutsByPostType,
    commonLayouts
  };
};
const normalizeOrderByOptions = (raw, fallback) => {
  if (!Array.isArray(raw)) {
    return fallback;
  }
  const normalized = raw.map(item => {
    const value = typeof item?.value === 'string' ? item.value : '';
    const label = typeof item?.label === 'string' ? item.label : '';
    const postType = typeof item?.postType === 'string' ? item.postType : null;
    const metaKey = typeof item?.metaKey === 'string' ? item.metaKey : undefined;
    return {
      value,
      label,
      postType,
      metaKey
    };
  }).filter(item => item.value.length > 0 && item.label.length > 0);
  return normalized.length > 0 ? normalized : fallback;
};
const normalizeOrderOptions = (raw, fallback) => {
  if (!Array.isArray(raw)) {
    return fallback;
  }
  const normalized = raw.map(item => {
    const value = item?.value === 'ASC' || item?.value === 'DESC' ? item.value : null;
    const label = typeof item?.label === 'string' ? item.label : '';
    return value ? {
      value,
      label
    } : null;
  }).filter(item => !!item && item.label.length > 0);
  return normalized.length > 0 ? normalized : fallback;
};
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    queryPreset = 'custom',
    postType = 'post',
    postsPerPage = 10,
    layout = 'grid',
    columns = 3,
    columnsTablet = 2,
    columnsMobile = 1,
    includeStickyPosts = false,
    orderBy = 'date',
    order = 'DESC',
    queryId,
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
    customQueryId = '',
    slidesToScroll = 1,
    loop = false,
    autoplay = false,
    autoplayDelay = 3000,
    showArrows = true,
    showDots = true,
    carouselAlign = 'start',
    carouselAxis = 'x',
    carouselDirection = 'ltr',
    carouselStartIndex = 0,
    carouselDuration = 25,
    carouselDragFree = false,
    carouselDragThreshold = 10,
    carouselSkipSnaps = false,
    carouselContainScroll = 'trimSnaps',
    carouselInViewThreshold = 0
  } = attributes;

  // States for taxonomies and authors
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)({});

  // Generate unique queryId if not set
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!queryId) {
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const newQueryId = String(Math.abs(hash));
      setAttributes({
        queryId: newQueryId
      });
    }
  }, [queryId, clientId, setAttributes]);

  // Fetch taxonomies and authors when postType changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const fetchTaxonomiesAndAuthors = async () => {
      if (!window.wp?.apiFetch) {
        return;
      }
      try {
        const taxonomiesData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${postType}`
        });
        const taxArray = Object.values(taxonomiesData || {}).filter(item => typeof item?.slug === 'string' && typeof item?.name === 'string');
        setTaxonomies(taxArray);
        const authorsData = await window.wp.apiFetch({
          path: '/wp/v2/users?who=authors&per_page=100'
        });
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
    if (!window.wp?.apiFetch) {
      return;
    }
    try {
      const termsResponse = await window.wp.apiFetch({
        path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
      });
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
      setTaxonomyTerms(prev => ({
        ...prev,
        [taxonomy]: []
      }));
    }
  }, [taxonomyTerms]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `dynamic-ssr-layout dynamic-ssr-layout--${layout}`
  });

  // Get available post types
  const wpPostTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getPostTypes
    } = select('core');
    const types = getPostTypes({
      per_page: -1
    }) || [];
    return types;
  }, []);
  const publicPostTypes = Array.isArray(window.jankxPublicPostTypes) ? window.jankxPublicPostTypes : [];

  // Get layouts data from PHP
  const layoutsData = normalizeLayoutsData(window.jankxDynamicDataLayouts);
  const postTypeOptions = (() => {
    const map = new Map();
    wpPostTypes.filter(type => type.slug !== 'attachment').forEach(type => {
      if (!map.has(type.slug)) {
        map.set(type.slug, type.name);
      }
    });
    publicPostTypes.filter(pt => pt.slug !== 'attachment').forEach(pt => {
      if (!map.has(pt.slug)) {
        map.set(pt.slug, pt.name || pt.slug);
      }
    });
    const layoutPostTypes = Object.keys(layoutsData && layoutsData.layoutsByPostType || {});
    layoutPostTypes.filter(slug => slug !== 'attachment').forEach(slug => {
      if (!map.has(slug)) {
        map.set(slug, slug);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({
      label,
      value
    }));
  })();

  // Get available layouts for current post type
  const availableLayouts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const layouts = [];
    if (layoutsData.commonLayouts) {
      layoutsData.commonLayouts.forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    }
    if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
      layoutsData.layoutsByPostType[postType].forEach(layoutInfo => {
        layouts.push(layoutInfo);
      });
    }
    return layouts;
  }, [postType, layoutsData]);
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const options = availableLayouts.map(layoutInfo => ({
      label: layoutInfo.title,
      value: layoutInfo.name
    }));
    return options;
  }, [availableLayouts]);

  // Pre-compute orderBy options
  const orderByOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const fallback = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date', 'jankx'),
      value: 'date'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'jankx'),
      value: 'title'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Modified', 'jankx'),
      value: 'modified'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Menu Order', 'jankx'),
      value: 'menu_order'
    }];
    const allOrderByOptions = normalizeOrderByOptions(window.jankxQueryOptions?.orderBy, fallback);
    const filtered = allOrderByOptions.filter(option => !option.postType || option.postType === postType).map(option => ({
      label: option.label,
      value: option.value
    }));
    return filtered;
  }, [postType]);

  // Pre-compute order options
  const orderOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const defaultOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Descending', 'jankx'),
      value: 'DESC'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ascending', 'jankx'),
      value: 'ASC'
    }];
    const options = normalizeOrderOptions(window.jankxQueryOptions?.order, defaultOptions);
    return options;
  }, []);

  // Pre-compute query preset options
  const normalizedPresets = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => normalizeQueryPresets(window.jankxQueryOptions?.queryPresets), []);
  const queryPresetOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const allPresets = normalizedPresets;
    const filtered = allPresets.filter(preset => !preset.postType || preset.postType === postType);
    return filtered.map(preset => ({
      label: preset.label,
      value: preset.value,
      help: preset.help
    }));
  }, [postType, normalizedPresets]);
  const TEMPLATE = [['jankx/dynamic-ssr-template']];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => setAttributes({
            postType: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
          value: layout,
          options: layoutOptions,
          onChange: value => setAttributes({
            layout: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value !== null && value !== void 0 ? value : 10
          }),
          min: 1,
          max: 50
        }), layout !== 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns', 'jankx'),
            value: columns,
            onChange: value => setAttributes({
              columns: value !== null && value !== void 0 ? value : 3
            }),
            min: 1,
            max: 6
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tablet Columns', 'jankx'),
            value: columnsTablet,
            onChange: value => setAttributes({
              columnsTablet: value !== null && value !== void 0 ? value : 2
            }),
            min: 1,
            max: 4
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mobile Columns', 'jankx'),
            value: columnsMobile,
            onChange: value => setAttributes({
              columnsMobile: value !== null && value !== void 0 ? value : 1
            }),
            min: 1,
            max: 3
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Preset', 'jankx'),
          value: queryPreset,
          options: queryPresetOptions,
          onChange: value => setAttributes({
            queryPreset: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order By', 'jankx'),
          value: orderBy,
          options: orderByOptions,
          onChange: value => setAttributes({
            orderBy: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order', 'jankx'),
          value: order,
          options: orderOptions,
          onChange: value => setAttributes({
            order: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include Sticky Posts', 'jankx'),
          checked: includeStickyPosts,
          onChange: value => setAttributes({
            includeStickyPosts: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'jankx'),
          value: offset,
          onChange: value => setAttributes({
            offset: value !== null && value !== void 0 ? value : 0
          }),
          min: 0,
          max: 100
        })]
      }), layout === 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Carousel Settings', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slides to Scroll', 'jankx'),
          value: slidesToScroll,
          onChange: value => setAttributes({
            slidesToScroll: value !== null && value !== void 0 ? value : 1
          }),
          min: 1,
          max: 6
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loop', 'jankx'),
          checked: loop,
          onChange: value => setAttributes({
            loop: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'jankx'),
          checked: autoplay,
          onChange: value => setAttributes({
            autoplay: value
          })
        }), autoplay && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay Delay (ms)', 'jankx'),
          value: autoplayDelay,
          onChange: value => setAttributes({
            autoplayDelay: value !== null && value !== void 0 ? value : 3000
          }),
          min: 1000,
          max: 10000,
          step: 500
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Arrows', 'jankx'),
          checked: showArrows,
          onChange: value => setAttributes({
            showArrows: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Dots', 'jankx'),
          checked: showDots,
          onChange: value => setAttributes({
            showDots: value
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
        template: TEMPLATE,
        templateLock: "all"
      })
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/dynamic-ssr-layout/editor.scss":
/*!***********************************************!*\
  !*** ./blocks/dynamic-ssr-layout/editor.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/dynamic-ssr-layout/save.tsx":
/*!********************************************!*\
  !*** ./blocks/dynamic-ssr-layout/save.tsx ***!
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
  const attrs = attributes;
  const layout = attrs.layout || 'grid';
  const columns = attrs.columns || 3;
  const columnsTablet = attrs.columnsTablet || 2;
  const columnsMobile = attrs.columnsMobile || 1;

  // Build classes consistent with editor and styles
  const styleColor = attrs.style && attrs.style.color ? attrs.style.color : undefined;
  const backgroundColorSlug = attrs.backgroundColor || attrs.style?.color?.backgroundSlug || attrs.style?.color?.background?.slug;
  const textColorSlug = attrs.textColor || attrs.style?.color?.textSlug || attrs.style?.color?.text?.slug;
  const gradient = attrs.gradient || attrs.style?.color?.gradient;
  const hasBackground = !!(styleColor?.background || gradient || backgroundColorSlug);
  const hasTextColor = !!(styleColor?.text || textColorSlug);
  const className = ['dynamic-ssr-layout', `dynamic-ssr-layout--${layout}`, `columns-${columns}`, `columns-tablet-${columnsTablet}`, `columns-mobile-${columnsMobile}`, backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined, textColorSlug ? `has-${textColorSlug}-color` : undefined, hasBackground ? 'has-background' : undefined, hasTextColor ? 'has-text-color' : undefined].filter(Boolean).join(' ');

  // Collect styles (CSS variables for columns + color styles from style.color)
  const inlineStyle = {
    '--columns-desktop': columns,
    '--columns-tablet': columnsTablet,
    '--columns-mobile': columnsMobile
  };
  if (styleColor) {
    // background may be either a string or an object { color: string, slug? }
    const bg = typeof styleColor.background === 'object' ? styleColor.background?.color : styleColor.background;
    const text = typeof styleColor.text === 'object' ? styleColor.text?.color : styleColor.text;
    const grad = typeof styleColor.gradient === 'object' ? styleColor.gradient?.gradient : styleColor.gradient;
    if (bg) {
      inlineStyle.backgroundColor = bg;
    }
    if (text) {
      inlineStyle.color = text;
    }
    if (grad) {
      inlineStyle.background = grad;
      delete inlineStyle.backgroundColor;
    }
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className,
    style: inlineStyle
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
  });
}

/***/ }),

/***/ "./blocks/dynamic-ssr-layout/style.scss":
/*!**********************************************!*\
  !*** ./blocks/dynamic-ssr-layout/style.scss ***!
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
  !*** ./blocks/dynamic-ssr-layout/index.tsx ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./blocks/dynamic-ssr-layout/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./save */ "./blocks/dynamic-ssr-layout/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-ssr-layout/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-ssr-layout/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./blocks/dynamic-ssr-layout/editor.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_1__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map