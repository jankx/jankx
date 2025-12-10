/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-data-layout/block.json":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-layout/block.json ***!
  \***********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-data-layout","version":"1.0.0","title":"Dynamic Data Layout","category":"jankx","icon":"layout","description":"Hiển thị danh sách posts theo layout tùy chỉnh với WordPress query builder","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","postType":"postType","displayLayout":"layout","postsPerPage":"postsPerPage","columns":"columns","columnsTablet":"columnsTablet","columnsMobile":"columnsMobile"},"usesContext":["queryId","postType"],"allowedBlocks":["jankx/dynamic-data-template"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"innerBlocks":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom","enum":["default","related","custom","on-sale","featured","related-products","best-sellers","top-rated","upsells","new-arrivals","recently-viewed"]},"postType":{"type":"string","default":"post"},"postsPerPage":{"type":"number","default":10},"includeStickyPosts":{"type":"boolean","default":false},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"responsiveColumns":{"type":"object","default":{"desktop":3,"tablet":2,"mobile":1}},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"string","default":""},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""},"enablePagination":{"type":"boolean","default":false},"paginationStyle":{"type":"string","default":"numbers","enum":["numbers","simple","arrows","load-more"]},"paginationAlignment":{"type":"string","default":"center","enum":["left","center","right"]},"showPaginationNumbers":{"type":"boolean","default":true},"paginationPrevText":{"type":"string","default":""},"paginationNextText":{"type":"string","default":""},"slidesToScroll":{"type":"number","default":1},"loop":{"type":"boolean","default":false},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"showArrows":{"type":"boolean","default":true},"showDots":{"type":"boolean","default":true},"carouselAlign":{"type":"string","default":"start","enum":["start","center","end"]},"carouselAxis":{"type":"string","default":"x","enum":["x","y"]},"carouselDirection":{"type":"string","default":"ltr","enum":["ltr","rtl"]},"carouselStartIndex":{"type":"number","default":0},"carouselDuration":{"type":"number","default":25},"carouselDragFree":{"type":"boolean","default":false},"carouselDragThreshold":{"type":"number","default":10},"carouselSkipSnaps":{"type":"boolean","default":false},"carouselContainScroll":{"type":"string","default":"trimSnaps","enum":["false","trimSnaps","keepSnaps"]},"carouselInViewThreshold":{"type":"number","default":0}}}');

/***/ }),

/***/ "./blocks/dynamic-data-layout/edit.tsx":
/*!*********************************************!*\
  !*** ./blocks/dynamic-data-layout/edit.tsx ***!
  \*********************************************/
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
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/components */ "./shared/components/index.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-data-layout/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./blocks/dynamic-data-layout/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









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
  console.log('[DEBUG Edit] ========== EDIT FUNCTION START ==========');
  console.log('[DEBUG Edit] Function called with:', {
    attributes,
    clientId
  });
  console.log('[DEBUG Edit] Component render timestamp:', new Date().toISOString());
  const {
    queryPreset = 'custom',
    postType = 'post',
    postsPerPage = 10,
    layout = 'grid',
    columns = 3,
    columnsTablet = 2,
    columnsMobile = 1,
    responsiveColumns,
    includeStickyPosts = false,
    orderBy = 'date',
    order = 'DESC',
    queryId,
    enablePagination = false,
    paginationStyle = 'numbers',
    paginationAlignment = 'center',
    showPaginationNumbers = true,
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
  console.log('[DEBUG Edit] Destructured attributes:', {
    queryPreset,
    postType,
    postsPerPage,
    layout,
    columns,
    columnsTablet,
    columnsMobile,
    queryId,
    orderBy,
    order
  });

  // States for taxonomies and authors
  console.log('[DEBUG Edit] [HOOK-1] About to call useState for taxonomies');
  const [taxonomies, setTaxonomies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  console.log('[DEBUG Edit] [HOOK-1] useState taxonomies completed, value:', taxonomies);
  console.log('[DEBUG Edit] [HOOK-2] About to call useState for authors');
  const [authors, setAuthors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  console.log('[DEBUG Edit] [HOOK-2] useState authors completed, value:', authors);
  console.log('[DEBUG Edit] [HOOK-3] About to call useState for taxonomyTerms');
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)({});
  console.log('[DEBUG Edit] [HOOK-3] useState taxonomyTerms completed, value:', taxonomyTerms);
  console.log('[DEBUG Edit] [HOOK-4] About to call useRef for isMountedRef');
  const isMountedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)(true);
  console.log('[DEBUG Edit] [HOOK-4] useRef isMountedRef completed, value:', isMountedRef.current);
  console.log('[DEBUG Edit] [HOOK-5] About to call useEffect (mount effect)');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log('[DEBUG Edit] [HOOK-5] Mount effect running');
    isMountedRef.current = true;
    console.log('[DEBUG Edit] [HOOK-5] isMountedRef set to true');
    return () => {
      console.log('[DEBUG Edit] [HOOK-5] Unmount effect running');
      isMountedRef.current = false;
      console.log('[DEBUG Edit] [HOOK-5] isMountedRef set to false');
    };
  }, []);
  console.log('[DEBUG Edit] [HOOK-5] useEffect (mount effect) registered');

  // Generate unique queryId if not set
  console.log('[DEBUG Edit] [HOOK-6] About to call useEffect (queryId effect)');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log('[DEBUG Edit] [HOOK-6] queryId effect - queryId:', queryId, 'clientId:', clientId);
    if (!queryId) {
      console.log('[DEBUG Edit] [HOOK-6] Generating new queryId from clientId');
      // Generate unique ID from clientId hash
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const newQueryId = String(Math.abs(hash));
      console.log('[DEBUG Edit] [HOOK-6] Generated queryId:', newQueryId);
      setAttributes({
        queryId: newQueryId
      });
    } else {
      console.log('[DEBUG Edit] [HOOK-6] queryId already exists, skipping generation');
    }
  }, [queryId, clientId, setAttributes]);
  console.log('[DEBUG Edit] [HOOK-6] useEffect (queryId effect) registered');

  // Reset queryPreset if current preset is not valid for the current postType
  console.log('[DEBUG Edit] [HOOK-7] About to call useEffect (queryPreset validation)');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log('[DEBUG Edit] [HOOK-7] queryPreset validation effect - postType:', postType, 'queryPreset:', queryPreset);
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    console.log('[DEBUG Edit] [HOOK-7] All presets:', allPresets);
    const validPresets = allPresets.filter(preset => !preset.postType || preset.postType === postType);
    console.log('[DEBUG Edit] [HOOK-7] Valid presets for postType:', validPresets);
    const currentPresetValid = validPresets.some(preset => preset.value === queryPreset);
    console.log('[DEBUG Edit] [HOOK-7] Current preset valid?', currentPresetValid);
    if (!currentPresetValid && validPresets.length > 0 && validPresets[0]?.value) {
      // Reset to first valid preset
      const newPreset = validPresets[0].value;
      console.log('[DEBUG Edit] [HOOK-7] Resetting queryPreset to:', newPreset);
      setAttributes({
        queryPreset: newPreset
      });
    }
  }, [postType, queryPreset, setAttributes]);
  console.log('[DEBUG Edit] [HOOK-7] useEffect (queryPreset validation) registered');

  // Fetch taxonomies and authors when postType changes
  console.log('[DEBUG Edit] [HOOK-8] About to call useEffect (fetch taxonomies/authors)');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log('[DEBUG Edit] [HOOK-8] Fetch taxonomies/authors effect - postType:', postType);
    const fetchTaxonomiesAndAuthors = async () => {
      console.log('[DEBUG Edit] fetchTaxonomiesAndAuthors called');
      if (!window.wp?.apiFetch) {
        console.log('[DEBUG Edit] window.wp.apiFetch not available');
        return;
      }
      try {
        console.log('[DEBUG Edit] Fetching taxonomies for postType:', postType);
        const taxonomiesData = await window.wp.apiFetch({
          path: `/wp/v2/taxonomies?type=${postType}`
        });
        console.log('[DEBUG Edit] Raw taxonomiesData:', taxonomiesData);
        if (!isMountedRef.current) {
          console.log('[DEBUG Edit] Component unmounted, skipping state update');
          return;
        }
        const taxArray = Object.values(taxonomiesData || {}).filter(item => typeof item?.slug === 'string' && typeof item?.name === 'string');
        console.log('[DEBUG Edit] Filtered taxonomies array:', taxArray);
        setTaxonomies(taxArray);
        console.log('[DEBUG Edit] setTaxonomies called with:', taxArray);
        console.log('[DEBUG Edit] Fetching authors');
        const authorsData = await window.wp.apiFetch({
          path: '/wp/v2/users?who=authors&per_page=100'
        });
        console.log('[DEBUG Edit] Raw authorsData:', authorsData);
        if (!isMountedRef.current) {
          console.log('[DEBUG Edit] Component unmounted, skipping state update');
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
        console.log('[DEBUG Edit] Normalized authors:', normalizedAuthors);
        setAuthors(normalizedAuthors);
        console.log('[DEBUG Edit] setAuthors called with:', normalizedAuthors);
      } catch (error) {
        console.error('[DEBUG Edit] Error fetching taxonomies/authors:', error);
        if (!isMountedRef.current) {
          console.log('[DEBUG Edit] Component unmounted, skipping error state update');
          return;
        }
        setTaxonomies([]);
        setAuthors([]);
        console.log('[DEBUG Edit] Reset taxonomies and authors to empty arrays');
      }
    };
    fetchTaxonomiesAndAuthors();
  }, [postType]);
  console.log('[DEBUG Edit] [HOOK-8] useEffect (fetch taxonomies/authors) registered');

  // Function to fetch terms for a specific taxonomy
  console.log('[DEBUG Edit] [HOOK-9] About to call useCallback (fetchTermsForTaxonomy)');
  const fetchTermsForTaxonomy = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async taxonomy => {
    console.log('[DEBUG Edit] fetchTermsForTaxonomy called with taxonomy:', taxonomy);
    if (taxonomyTerms[taxonomy]) {
      console.log('[DEBUG Edit] Terms already loaded for taxonomy:', taxonomy);
      return; // Already loaded
    }
    if (!window.wp?.apiFetch) {
      console.log('[DEBUG Edit] window.wp.apiFetch not available');
      return;
    }
    try {
      console.log('[DEBUG Edit] Fetching terms for taxonomy:', taxonomy);
      const termsResponse = await window.wp.apiFetch({
        path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`
      });
      console.log('[DEBUG Edit] Raw termsResponse:', termsResponse);
      if (!isMountedRef.current) {
        console.log('[DEBUG Edit] Component unmounted, skipping state update');
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
      console.log('[DEBUG Edit] Normalized terms:', normalizedTerms);
      setTaxonomyTerms(prev => {
        const newState = {
          ...prev,
          [taxonomy]: normalizedTerms
        };
        console.log('[DEBUG Edit] Setting taxonomyTerms to:', newState);
        return newState;
      });
    } catch (error) {
      console.error(`[DEBUG Edit] Error fetching terms for ${taxonomy}:`, error);
      if (!isMountedRef.current) {
        console.log('[DEBUG Edit] Component unmounted, skipping error state update');
        return;
      }
      setTaxonomyTerms(prev => {
        const newState = {
          ...prev,
          [taxonomy]: []
        };
        console.log('[DEBUG Edit] Setting taxonomyTerms to empty array for taxonomy:', taxonomy);
        return newState;
      });
    }
  }, [taxonomyTerms]);
  console.log('[DEBUG Edit] [HOOK-9] useCallback (fetchTermsForTaxonomy) registered');
  console.log('[DEBUG Edit] [HOOK-10] About to call useBlockProps');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: `dynamic-data-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
    style: {
      '--columns-desktop': columns,
      '--columns-tablet': columnsTablet,
      '--columns-mobile': columnsMobile
    }
  });
  console.log('[DEBUG Edit] [HOOK-10] useBlockProps completed, blockProps:', blockProps);
  const resolvedResponsiveColumns = responsiveColumns && typeof responsiveColumns === 'object' ? responsiveColumns : {
    desktop: columns,
    tablet: columnsTablet,
    mobile: columnsMobile
  };
  console.log('[DEBUG Edit] resolvedResponsiveColumns:', resolvedResponsiveColumns);
  console.log('[DEBUG Edit] [HOOK-11] About to call useEffect (responsiveColumns sync)');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log('[DEBUG Edit] [HOOK-11] responsiveColumns sync effect');
    const expected = {
      desktop: columns,
      tablet: columnsTablet,
      mobile: columnsMobile
    };
    console.log('[DEBUG Edit] [HOOK-11] Expected responsiveColumns:', expected);
    console.log('[DEBUG Edit] [HOOK-11] Current responsiveColumns:', responsiveColumns);
    const needsUpdate = !responsiveColumns || responsiveColumns.desktop !== expected.desktop || responsiveColumns.tablet !== expected.tablet || responsiveColumns.mobile !== expected.mobile;
    console.log('[DEBUG Edit] [HOOK-11] Needs update?', needsUpdate);
    if (needsUpdate) {
      console.log('[DEBUG Edit] [HOOK-11] Updating responsiveColumns to:', expected);
      setAttributes({
        responsiveColumns: expected
      });
    }
  }, [columns, columnsTablet, columnsMobile, responsiveColumns, setAttributes]);
  console.log('[DEBUG Edit] [HOOK-11] useEffect (responsiveColumns sync) registered');

  // Get available post types
  console.log('[DEBUG Edit] [HOOK-12] About to call useSelect (postTypes)');
  const postTypes = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const {
      getPostTypes
    } = select('core');
    const types = getPostTypes({
      per_page: -1
    }) || [];
    console.log('[DEBUG Edit] [HOOK-12] useSelect postTypes:', types);
    return types;
  }, []);
  console.log('[DEBUG Edit] [HOOK-12] useSelect (postTypes) completed, value:', postTypes);
  const postTypeOptions = postTypes.filter(type => type.viewable && type.slug !== 'attachment').map(type => ({
    label: type.name,
    value: type.slug
  }));
  console.log('[DEBUG Edit] postTypeOptions:', postTypeOptions);

  // Get layouts data from PHP
  const layoutsData = window.jankxDynamicDataLayouts || {
    layoutsByPostType: {},
    commonLayouts: []
  };
  console.log('[DEBUG Edit] layoutsData:', layoutsData);

  // Get available layouts for current post type
  console.log('[DEBUG Edit] [HOOK-13] About to call useMemo (availableLayouts)');
  const availableLayouts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    console.log('[DEBUG Edit] [HOOK-13] useMemo availableLayouts - postType:', postType);
    const layouts = [];

    // Add common layouts
    if (layoutsData.commonLayouts) {
      console.log('[DEBUG Edit] Processing commonLayouts:', layoutsData.commonLayouts);
      layoutsData.commonLayouts.forEach(layoutInfo => {
        const layoutItem = {
          name: layoutInfo.name || '',
          title: layoutInfo.title || layoutInfo.name || ''
        };
        if (layoutInfo.supportedOptions) {
          layoutItem.supportedOptions = layoutInfo.supportedOptions;
        }
        layouts.push(layoutItem);
      });
    }

    // Add post type specific layouts
    if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
      console.log('[DEBUG Edit] Processing layoutsByPostType for', postType, ':', layoutsData.layoutsByPostType[postType]);
      layoutsData.layoutsByPostType[postType].forEach(layoutInfo => {
        const layoutItem = {
          name: layoutInfo.name || '',
          title: layoutInfo.title || layoutInfo.name || ''
        };
        if (layoutInfo.supportedOptions) {
          layoutItem.supportedOptions = layoutInfo.supportedOptions;
        }
        layouts.push(layoutItem);
      });
    }
    console.log('[DEBUG Edit] [HOOK-13] Final availableLayouts:', layouts);
    return layouts;
  }, [postType, layoutsData]);
  console.log('[DEBUG Edit] [HOOK-13] useMemo (availableLayouts) completed, value:', availableLayouts);

  // Layout options for SelectControl
  console.log('[DEBUG Edit] [HOOK-14] About to call useMemo (layoutOptions)');
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const options = availableLayouts.map(layoutInfo => ({
      label: layoutInfo.title,
      value: layoutInfo.name
    }));
    console.log('[DEBUG Edit] [HOOK-14] layoutOptions:', options);
    return options;
  }, [availableLayouts]);
  console.log('[DEBUG Edit] [HOOK-14] useMemo (layoutOptions) completed, value:', layoutOptions);

  // Get current layout's supported options
  const currentLayout = availableLayouts.find(l => l.name === layout);
  console.log('[DEBUG Edit] currentLayout:', currentLayout, 'for layout:', layout);
  const supportedOptions = currentLayout?.supportedOptions || [];
  console.log('[DEBUG Edit] supportedOptions:', supportedOptions);

  // Pre-compute orderBy options outside conditional render to avoid React hooks error
  console.log('[DEBUG Edit] [HOOK-15] About to call useMemo (orderByOptions)');
  const orderByOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
    console.log('[DEBUG Edit] [HOOK-15] Computing orderByOptions - allOrderByOptions:', allOrderByOptions);
    // Filter order by options based on postType:
    // - Common options: postType is null (available for all post types)
    // - Specific options: postType matches current postType
    const filtered = allOrderByOptions.filter(option => !option.postType || option.postType === postType).map(option => ({
      label: option.label,
      value: option.value
    }));
    console.log('[DEBUG Edit] [HOOK-15] Filtered orderByOptions:', filtered);
    return filtered;
  }, [postType]);
  console.log('[DEBUG Edit] [HOOK-15] useMemo (orderByOptions) completed, value:', orderByOptions);

  // Pre-compute order options outside conditional render
  console.log('[DEBUG Edit] [HOOK-16] About to call useMemo (orderOptions)');
  const orderOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const options = window.jankxQueryOptions?.order || [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Descending', 'jankx'),
      value: 'DESC'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ascending', 'jankx'),
      value: 'ASC'
    }];
    console.log('[DEBUG Edit] [HOOK-16] orderOptions:', options);
    return options;
  }, []);
  console.log('[DEBUG Edit] [HOOK-16] useMemo (orderOptions) completed, value:', orderOptions);

  // Pre-compute query preset options outside JSX
  console.log('[DEBUG Edit] [HOOK-17] About to call useMemo (queryPresetOptions)');
  const queryPresetOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    console.log('[DEBUG Edit] [HOOK-17] All query presets:', allPresets);
    // Filter presets based on postType:
    // - Common presets: postType is null (available for all post types)
    // - Specific presets: postType matches current postType
    const filtered = allPresets.filter(preset => !preset.postType || preset.postType === postType).map(preset => ({
      label: preset.label,
      value: preset.value
    }));
    console.log('[DEBUG Edit] [HOOK-17] Filtered query preset options:', filtered);
    return filtered;
  }, [postType]);
  console.log('[DEBUG Edit] [HOOK-17] useMemo (queryPresetOptions) completed, value:', queryPresetOptions);

  // Pre-compute query preset help text outside JSX
  console.log('[DEBUG Edit] [HOOK-18] About to call useMemo (queryPresetHelp)');
  const queryPresetHelp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    const currentPreset = allPresets.find(p => p.value === queryPreset);
    const helpText = currentPreset?.help || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a query preset', 'jankx');
    console.log('[DEBUG Edit] [HOOK-18] queryPresetHelp:', helpText);
    return helpText;
  }, [queryPreset]);
  console.log('[DEBUG Edit] [HOOK-18] useMemo (queryPresetHelp) completed, value:', queryPresetHelp);

  // Debug: Log when queryPreset is 'default'
  console.log('[DEBUG Edit] ===== START RENDER =====');
  console.log('[DEBUG Edit] queryPreset:', queryPreset);
  console.log('[DEBUG Edit] postType:', postType);
  console.log('[DEBUG Edit] layout:', layout);
  console.log('[DEBUG Edit] columns:', {
    desktop: columns,
    tablet: columnsTablet,
    mobile: columnsMobile
  });
  console.log('[DEBUG Edit] supportedOptions:', supportedOptions);
  console.log('[DEBUG Edit] currentLayout:', currentLayout);
  console.log('[DEBUG Edit] All attributes:', attributes);
  console.log('[DEBUG Edit] ========== ALL HOOKS COMPLETED ==========');
  console.log('[DEBUG Edit] Total hooks called: 18');
  console.log('[DEBUG Edit] ========== ABOUT TO RENDER JSX ==========');
  console.log('[DEBUG Edit] queryPreset at render time:', queryPreset);
  console.log('[DEBUG Edit] Will render Order By controls?', queryPreset !== 'default');
  console.log('[DEBUG Edit] Will render custom panels?', queryPreset === 'custom');
  console.log('[DEBUG Edit] Conditional render check - queryPreset !== "default":', queryPreset !== 'default');
  console.log('[DEBUG Edit] Conditional render check - queryPreset === "custom":', queryPreset === 'custom');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      group: "settings",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Settings', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Preset', 'jankx'),
          value: queryPreset,
          options: queryPresetOptions,
          onChange: value => {
            console.log('[DEBUG Edit] queryPreset onChange:', value);
            setAttributes({
              queryPreset: value
            });
          },
          help: queryPresetHelp
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => {
            console.log('[DEBUG Edit] postType onChange:', value);
            setAttributes({
              postType: value
            });
          },
          help: queryPreset === 'default' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select post type for the main query', 'jankx') : undefined
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Posts Per Page', 'jankx'),
          value: postsPerPage,
          onChange: value => setAttributes({
            postsPerPage: value || 10
          }),
          min: 1,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of posts to display', 'jankx')
        }), postType === 'post' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include Sticky Posts', 'jankx'),
          checked: includeStickyPosts,
          onChange: value => setAttributes({
            includeStickyPosts: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Include sticky posts in the query (disabled by default).', 'jankx')
        }) : null, (() => {
          const shouldRender = queryPreset !== 'default';
          console.log('[DEBUG Edit] [CONDITIONAL-1] Checking queryPreset !== "default":', shouldRender, 'queryPreset:', queryPreset);
          if (!shouldRender) {
            console.log('[DEBUG Edit] [CONDITIONAL-1] Not rendering Order By controls (queryPreset is "default")');
            return null;
          }
          console.log('[DEBUG Edit] [CONDITIONAL-1] Rendering Order By controls');
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order By', 'jankx'),
              value: orderBy,
              options: orderByOptions,
              onChange: value => {
                console.log('[DEBUG Edit] orderBy onChange:', value);
                const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
                const selectedOption = allOrderByOptions.find(opt => opt.value === value);

                // Auto-set metaKey if option has metaKey property
                const updates = {
                  orderBy: value
                };
                if (selectedOption?.metaKey) {
                  updates.metaKey = selectedOption.metaKey;
                  // Set orderBy to meta_value_num if value is numeric (like total_sales, _price)
                  if (['total_sales', '_price'].includes(value)) {
                    updates.orderBy = 'meta_value_num';
                  }
                }
                console.log('[DEBUG Edit] Setting attributes:', updates);
                setAttributes(updates);
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort posts by which criteria', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order', 'jankx'),
              value: order,
              options: orderOptions,
              onChange: value => {
                console.log('[DEBUG Edit] order onChange:', value);
                setAttributes({
                  order: value
                });
              }
            })]
          });
        })()]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'jankx'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Type', 'jankx'),
          value: layout,
          options: layoutOptions.length > 0 ? layoutOptions : [{
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
          onChange: value => {
            console.log('[DEBUG Edit] layout onChange:', value);
            setAttributes({
              layout: value
            });
          }
        }), supportedOptions.includes('columns') ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_shared_components__WEBPACK_IMPORTED_MODULE_5__.ResponsiveControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns', 'jankx'),
          values: resolvedResponsiveColumns,
          onChange: values => setAttributes({
            columns: values.desktop,
            columnsTablet: values.tablet,
            columnsMobile: values.mobile,
            responsiveColumns: values
          }),
          min: 1,
          max: 6,
          help: {
            desktop: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on large screens (>1024px)', 'jankx'),
            tablet: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on tablet (768px - 1024px)', 'jankx'),
            mobile: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of columns on mobile (<768px)', 'jankx')
          }
        }) : null]
      }), layout === 'carousel' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Slides To Scroll', 'jankx'),
          value: slidesToScroll,
          onChange: value => setAttributes({
            slidesToScroll: value || 1
          }),
          min: 1,
          max: columns || 3,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of slides to scroll at a time', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loop', 'jankx'),
          checked: loop,
          onChange: value => setAttributes({
            loop: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable infinite loop', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'jankx'),
          checked: autoplay,
          onChange: value => setAttributes({
            autoplay: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Automatically advance slides', 'jankx')
        }), autoplay ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay Delay (ms)', 'jankx'),
          value: autoplayDelay,
          onChange: value => setAttributes({
            autoplayDelay: value || 3000
          }),
          min: 1000,
          max: 10000,
          step: 500,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Time between autoplay transitions', 'jankx')
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Arrows', 'jankx'),
          checked: showArrows,
          onChange: value => setAttributes({
            showArrows: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display navigation arrows', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Dots', 'jankx'),
          checked: showDots,
          onChange: value => setAttributes({
            showDots: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display pagination dots', 'jankx')
        })]
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable Pagination', 'jankx'),
          checked: enablePagination,
          onChange: value => setAttributes({
            enablePagination: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display pagination to paginate posts', 'jankx')
        }), enablePagination ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pagination Style', 'jankx'),
            value: paginationStyle,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Numbers', 'jankx'),
              value: 'numbers'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Simple (Prev/Next)', 'jankx'),
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
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose pagination display style', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Align pagination position', 'jankx')
          }), paginationStyle === 'numbers' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show All Page Numbers', 'jankx'),
            checked: showPaginationNumbers,
            onChange: value => setAttributes({
              showPaginationNumbers: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show all page numbers instead of abbreviated', 'jankx')
          }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous Button Text', 'jankx'),
            value: paginationPrevText,
            onChange: value => setAttributes({
              paginationPrevText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Leave empty to use default text. Can use HTML/SVG.', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: « Previous or <svg>...</svg>', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next Button Text', 'jankx'),
            value: paginationNextText,
            onChange: value => setAttributes({
              paginationNextText: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Leave empty to use default text. Can use HTML/SVG.', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: Next » or <svg>...</svg>', 'jankx')
          })]
        }) : null]
      }), queryPreset === 'custom' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Offset', 'jankx'),
          value: offset,
          onChange: value => setAttributes({
            offset: value || 0
          }),
          min: 0,
          max: 50,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Skip the first N posts', 'jankx')
        }), orderBy === 'meta_value' || orderBy === 'meta_value_num' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
            value: metaKey,
            onChange: value => setAttributes({
              metaKey: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta key for sorting (required when using meta_value)', 'jankx'),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: price, views, rating', 'jankx')
          }), orderBy === 'meta_value' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specify data type for accurate sorting', 'jankx')
          }) : null]
        }) : null]
      }) : null, queryPreset === 'custom' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔧 Advanced Query Parameters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Query ID', 'jankx'),
          value: customQueryId,
          onChange: value => setAttributes({
            customQueryId: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set a name for this query to apply final filters: jankx/post-layout/query-args/{query_id}', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: featured-posts, sidebar-posts', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Status', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post status to fetch (default: publish)', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
            value: postStatus,
            suggestions: ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any'],
            onChange: tokens => setAttributes({
              postStatus: normalizeTokens(tokens)
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent ID', 'jankx'),
          type: "number",
          value: postParent,
          onChange: value => setAttributes({
            postParent: parseInt(value) || 0
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filter posts by parent ID (0 = all)', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent IDs (Include)', 'jankx'),
          value: postParentIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only fetch posts with parents in this list', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Parent IDs (Exclude)', 'jankx'),
          value: postParentNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postParentNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude posts with parents in this list', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: 4, 5, 6', 'jankx')
        })]
      }) : null, queryPreset === 'custom' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔍 Keyword Search', 'jankx'),
        initialOpen: false,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search Keyword', 'jankx'),
          value: keyword,
          onChange: value => setAttributes({
            keyword: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Search by title, content, excerpt', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter keyword...', 'jankx')
        })
      }) : null, queryPreset === 'custom' && authors.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('👤 Author Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Authors (Include)', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only display posts from these authors', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
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
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Authors (Exclude)', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude posts from these authors', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
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
      }) : null, queryPreset === 'custom' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('🔢 Post ID Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post IDs (Include)', 'jankx'),
          value: postIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only display posts with these IDs (comma separated)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: 1, 2, 3', 'jankx')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post IDs (Exclude)', 'jankx'),
          value: postNotIn.join(', '),
          onChange: value => {
            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
            setAttributes({
              postNotIn: ids
            });
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Exclude posts with these IDs (comma separated)', 'jankx'),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: 4, 5, 6', 'jankx')
        })]
      }) : null, queryPreset === 'custom' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('⚙️ Meta Query Filters', 'jankx'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
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
        }), metaQuery.map((mq, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          style: {
            marginTop: '15px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("strong", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Query', 'jankx'), " #", index + 1]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
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
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Meta Key', 'jankx'),
            value: mq.key,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) {
                return;
              }
              newMetaQuery[index] = {
                ...targetQuery,
                key: value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Example: price, rating, views', 'jankx')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
              label: 'NOT LIKE (Not Contains)',
              value: 'NOT LIKE'
            }, {
              label: 'IN (In List)',
              value: 'IN'
            }, {
              label: 'NOT IN (Not In List)',
              value: 'NOT IN'
            }, {
              label: 'EXISTS (Exists)',
              value: 'EXISTS'
            }, {
              label: 'NOT EXISTS (Not Exists)',
              value: 'NOT EXISTS'
            }],
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) {
                return;
              }
              newMetaQuery[index] = {
                ...targetQuery,
                compare: value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            }
          }), !['EXISTS', 'NOT EXISTS'].includes(mq.compare) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Value', 'jankx'),
            value: mq.value,
            onChange: value => {
              const newMetaQuery = [...metaQuery];
              const targetQuery = newMetaQuery[index];
              if (!targetQuery) {
                return;
              }
              newMetaQuery[index] = {
                ...targetQuery,
                value
              };
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter value...', 'jankx')
          }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
              if (!targetQuery) {
                return;
              }
              const updatedQuery = {
                ...targetQuery
              };
              const nextType = value ? value : undefined;
              if (nextType) {
                updatedQuery.type = nextType;
              } else if ('type' in updatedQuery) {
                delete updatedQuery.type;
              }
              newMetaQuery[index] = updatedQuery;
              setAttributes({
                metaQuery: newMetaQuery
              });
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specify data type for accurate comparison', 'jankx')
          })]
        }, index))]
      }) : null, queryPreset === 'custom' && taxonomies.length > 0 ? taxonomies.map(taxonomy => {
        // Find existing query for this taxonomy
        const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
        const hasQuery = existingQueryIndex >= 0;
        const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
        const terms = taxonomyTerms[taxonomy.slug];
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: `🏷️ ${taxonomy.name}`,
          initialOpen: hasQuery,
          onToggle: isOpen => {
            if (isOpen) {
              // Fetch terms when panel opens
              fetchTermsForTaxonomy(taxonomy.slug);
            }
          },
          children: !hasQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
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
          }) : currentQuery ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
                if (!targetQuery) {
                  return;
                }
                newTaxQuery[existingQueryIndex] = {
                  ...targetQuery,
                  operator: value
                };
                setAttributes({
                  taxQuery: newTaxQuery
                });
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx')
            }), !['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
              children: terms ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Terms', 'jankx'),
                help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select terms from dropdown', 'jankx'),
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
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
                    if (!targetQuery) {
                      return;
                    }
                    newTaxQuery[existingQueryIndex] = {
                      ...targetQuery,
                      terms: selectedIds
                    };
                    setAttributes({
                      taxQuery: newTaxQuery
                    });
                  }
                })
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {})
            }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
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
          }) : null
        }, taxonomy.slug);
      }) : null]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: (() => {
        const blocks = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getBlocks(clientId), [clientId]);
        const hasTemplateBlock = blocks && blocks.length > 0;
        if (!hasTemplateBlock) {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            style: {
              padding: '1rem',
              border: '2px dashed #0073aa',
              borderRadius: '4px',
              backgroundColor: '#f0f6fc'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
              style: {
                fontSize: '0.85rem',
                color: '#0073aa',
                marginBottom: '0.75rem',
                fontWeight: '600'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Dynamic Data Template to define item layout', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
              allowedBlocks: ['jankx/dynamic-data-template'],
              templateLock: false,
              renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
            })]
          });
        }
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
          allowedBlocks: ['jankx/dynamic-data-template'],
          templateLock: false,
          renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.DefaultBlockAppender
        });
      })()
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/dynamic-data-layout/editor.scss":
/*!************************************************!*\
  !*** ./blocks/dynamic-data-layout/editor.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/dynamic-data-layout/save.tsx":
/*!*********************************************!*\
  !*** ./blocks/dynamic-data-layout/save.tsx ***!
  \*********************************************/
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

/***/ "./blocks/dynamic-data-layout/style.scss":
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-layout/style.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./shared/components/ResponsiveControl.tsx":
/*!*************************************************!*\
  !*** ./shared/components/ResponsiveControl.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResponsiveControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function ResponsiveControl({
  label,
  values,
  onChange,
  min = 1,
  max = 6,
  step = 1,
  help = {},
  className = ''
}) {
  const [selectedDevice, setSelectedDevice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('desktop');
  const handleValueChange = value => {
    if (value === undefined) return;
    onChange({
      ...values,
      [selectedDevice]: value
    });
  };
  const getCurrentValue = () => values[selectedDevice];
  const getCurrentHelp = () => help[selectedDevice];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `responsive-control ${className}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      style: {
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label", {
        style: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#1e1e1e',
          margin: 0
        },
        children: label
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ButtonGroup, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'desktop',
          onClick: () => setSelectedDevice('desktop'),
          variant: selectedDevice === 'desktop' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Desktop', 'jankx'),
          children: "\uD83D\uDDA5\uFE0F"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'tablet',
          onClick: () => setSelectedDevice('tablet'),
          variant: selectedDevice === 'tablet' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tablet', 'jankx'),
          children: "\uD83D\uDCF1"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          isPressed: selectedDevice === 'mobile',
          onClick: () => setSelectedDevice('mobile'),
          variant: selectedDevice === 'mobile' ? 'primary' : 'secondary',
          size: "small",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mobile', 'jankx'),
          children: "\uD83D\uDCF1"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} ${label}`, 'jankx'),
      value: getCurrentValue(),
      onChange: handleValueChange,
      min: min,
      max: max,
      step: step,
      help: getCurrentHelp()
    })]
  });
}

/***/ }),

/***/ "./shared/components/index.ts":
/*!************************************!*\
  !*** ./shared/components/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveControl: () => (/* reexport safe */ _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useResponsiveValue: () => (/* reexport safe */ _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__.useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ResponsiveControl */ "./shared/components/ResponsiveControl.tsx");
/* harmony import */ var _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useResponsiveValue */ "./shared/components/useResponsiveValue.ts");



/***/ }),

/***/ "./shared/components/useResponsiveValue.ts":
/*!*************************************************!*\
  !*** ./shared/components/useResponsiveValue.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useResponsiveValue: () => (/* binding */ useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

function useResponsiveValue(initialValues = {}) {
  const [values, setValues] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    desktop: initialValues.desktop || 3,
    tablet: initialValues.tablet || 2,
    mobile: initialValues.mobile || 1
  });
  const updateValue = (device, value) => {
    setValues(prev => ({
      ...prev,
      [device]: value
    }));
  };
  const updateValues = newValues => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };
  const resetToDefaults = defaults => {
    setValues(defaults);
  };
  return {
    values,
    updateValue,
    updateValues,
    resetToDefaults
  };
}

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
/*!**********************************************!*\
  !*** ./blocks/dynamic-data-layout/index.tsx ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-data-layout/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/dynamic-data-layout/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/dynamic-data-layout/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-data-layout/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map