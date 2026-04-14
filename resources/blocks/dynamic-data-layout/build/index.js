/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/dynamic-data-layout/edit.tsx"
/*!*********************************************!*\
  !*** ./blocks/dynamic-data-layout/edit.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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









// ---- Helpers to guard runtime data coming from PHP/localize ----
const normalizeQueryPresets = rawPresets => {
  if (!Array.isArray(rawPresets)) {
    return [];
  }
  return rawPresets.map(preset => {
    const value = typeof preset?.value === 'string' ? preset.value : '';
    const label = typeof preset?.label === 'string' ? preset.label : '';
    const postType = typeof preset?.postType === 'string' ? preset.postType : null;

    // help text must be string; fall back to errorMsg/message if provided
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
    const supportedOptions = Array.isArray(layout?.supportedOptions) ? layout.supportedOptions : undefined;
    const readOnlyOptions = Array.isArray(layout?.readOnlyOptions) ? layout.readOnlyOptions : undefined;
    const settingsDefinition = Array.isArray(layout?.settingsDefinition) ? layout.settingsDefinition : undefined;
    return {
      name,
      title,
      supportedOptions,
      readOnlyOptions,
      settingsDefinition
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
const toSafeHelpText = (input, fallback) => {
  if (typeof input === 'string') {
    return input;
  }
  if (input && typeof input === 'object') {
    const message = input.errorMsg;
    const message2 = input.message;
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message2 === 'string') {
      return message2;
    }
  }
  return fallback;
};
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

// Image ratio presets
const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    queryPreset = 'custom',
    postType = 'post',
    useMultiPostType = false,
    postTypes = [],
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
    carouselInViewThreshold = 0,
    showTitle = true,
    showExcerpt = true,
    showFeaturedImage = true,
    thumbnailPosition = 'top',
    imageRatio = '',
    showDate = true,
    showAuthor = false,
    showPrice = true,
    showAddToCart = true,
    showRating = false,
    excerptLength = 55
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
      // Generate unique ID from clientId hash
      const hash = clientId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const newQueryId = String(Math.abs(hash));
      setAttributes({
        queryId: newQueryId
      });
    }
  }, [queryId, clientId, setAttributes]);

  // Reset queryPreset if current preset is not valid for the current postType
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const allPresets = window.jankxQueryOptions?.queryPresets || [];
    const validPresets = allPresets.filter(preset => !preset.postType || preset.postType === postType);
    const currentPresetValid = validPresets.some(preset => preset.value === queryPreset);
    if (!currentPresetValid && validPresets.length > 0 && validPresets[0]?.value) {
      // Reset to first valid preset
      const newPreset = validPresets[0].value;
      setAttributes({
        queryPreset: newPreset
      });
    }
  }, [postType, queryPreset, setAttributes]);

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
      return; // Already loaded
    }
    if (!window.wp?.apiFetch) {
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
      setTaxonomyTerms(prev => {
        const newState = {
          ...prev,
          [taxonomy]: normalizedTerms
        };
        return newState;
      });
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      setTaxonomyTerms(prev => {
        const newState = {
          ...prev,
          [taxonomy]: []
        };
        return newState;
      });
    }
  }, [taxonomyTerms]);
  const styleColor = attributes.style && attributes.style.color ? attributes.style.color : undefined;
  const backgroundColorSlug = attributes.backgroundColor || styleColor?.background?.slug;
  const textColorSlug = attributes.textColor || styleColor?.text?.slug;
  const gradient = attributes.gradient || styleColor?.gradient;
  const hasBackground = !!(styleColor?.background || gradient || backgroundColorSlug);
  const hasTextColor = !!(styleColor?.text || textColorSlug);
  const editorClassName = ['dynamic-data-layout', `dynamic-data-layout--${layout}`, `columns-${columns}`, `columns-tablet-${columnsTablet}`, `columns-mobile-${columnsMobile}`, backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined, textColorSlug ? `has-${textColorSlug}-color` : undefined, hasBackground ? 'has-background' : undefined, hasTextColor ? 'has-text-color' : undefined].filter(Boolean).join(' ');
  const editorStyle = {
    '--columns-desktop': columns,
    '--columns-tablet': columnsTablet,
    '--columns-mobile': columnsMobile
  };
  if (styleColor) {
    const bg = typeof styleColor.background === 'object' ? styleColor.background?.color : styleColor.background;
    const text = typeof styleColor.text === 'object' ? styleColor.text?.color : styleColor.text;
    const grad = typeof styleColor.gradient === 'object' ? styleColor.gradient?.gradient : styleColor.gradient;
    if (bg) editorStyle.backgroundColor = bg;
    if (text) editorStyle.color = text;
    if (grad) editorStyle.background = grad;
  }
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: editorClassName,
    style: editorStyle
  });
  const resolvedResponsiveColumns = responsiveColumns && typeof responsiveColumns === 'object' ? responsiveColumns : {
    desktop: columns,
    tablet: columnsTablet,
    mobile: columnsMobile
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const expected = {
      desktop: columns,
      tablet: columnsTablet,
      mobile: columnsMobile
    };
    const needsUpdate = !responsiveColumns || responsiveColumns.desktop !== expected.desktop || responsiveColumns.tablet !== expected.tablet || responsiveColumns.mobile !== expected.mobile;
    if (needsUpdate) {
      setAttributes({
        responsiveColumns: expected
      });
    }
  }, [columns, columnsTablet, columnsMobile, responsiveColumns, setAttributes]);

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

  // Get layouts data from PHP (normalize to avoid objects being rendered)
  const layoutsData = normalizeLayoutsData(window.jankxDynamicDataLayouts);
  const postTypeOptions = (() => {
    const map = new Map();
    // From core store (REST-visible types)
    wpPostTypes.filter(type => type.slug !== 'attachment').forEach(type => {
      if (!map.has(type.slug)) {
        map.set(type.slug, type.name);
      }
    });
    // From PHP localized public post types (includes non-REST CPTs like product/tour)
    publicPostTypes.filter(pt => pt.slug !== 'attachment').forEach(pt => {
      if (!map.has(pt.slug)) {
        map.set(pt.slug, pt.name || pt.slug);
      }
    });
    // Fallback: ensure keys present in layouts data are also available
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

    // Add common layouts
    if (layoutsData.commonLayouts) {
      layoutsData.commonLayouts.forEach(layoutInfo => {
        const layoutItem = {
          name: layoutInfo.name || '',
          title: layoutInfo.title || layoutInfo.name || ''
        };
        if (layoutInfo.supportedOptions) {
          layoutItem.supportedOptions = layoutInfo.supportedOptions;
        }
        if (layoutInfo.readOnlyOptions) {
          layoutItem.readOnlyOptions = layoutInfo.readOnlyOptions;
        }
        if (layoutInfo.settingsDefinition) {
          layoutItem.settingsDefinition = layoutInfo.settingsDefinition;
        }
        layouts.push(layoutItem);
      });
    }

    // Add post type specific layouts
    if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
      layoutsData.layoutsByPostType[postType].forEach(layoutInfo => {
        const layoutItem = {
          name: layoutInfo.name || '',
          title: layoutInfo.title || layoutInfo.name || ''
        };
        if (layoutInfo.supportedOptions) {
          layoutItem.supportedOptions = layoutInfo.supportedOptions;
        }
        if (layoutInfo.readOnlyOptions) {
          layoutItem.readOnlyOptions = layoutInfo.readOnlyOptions;
        }
        if (layoutInfo.settingsDefinition) {
          layoutItem.settingsDefinition = layoutInfo.settingsDefinition;
        }
        layouts.push(layoutItem);
      });
    }
    return layouts;
  }, [postType, layoutsData]);

  // Layout options for SelectControl
  const layoutOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const options = availableLayouts.map(layoutInfo => ({
      label: layoutInfo.title,
      value: layoutInfo.name
    }));
    return options;
  }, [availableLayouts]);

  // Get current layout's supported options
  const currentLayout = availableLayouts.find(l => l.name === layout);

  // Define default supported options for standard layouts
  const standardLayoutDefaults = {
    'grid': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
    'card': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
    'carousel': ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating'],
    'list': ['showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'showPrice', 'showAddToCart', 'showRating']
  };
  const supportedOptions = currentLayout?.supportedOptions || standardLayoutDefaults[layout] || [];
  const readOnlyOptions = currentLayout?.readOnlyOptions || [];
  const settingsDefinition = currentLayout?.settingsDefinition || [];

  // Check if post type is product
  const isProduct = postType === 'product';
  const hasCommerceFeatures = ['product', 'tour'].includes(postType);

  // Image ratio handling
  const imageRatioSelectValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (!imageRatio) {
      return '';
    }
    if (PRESET_IMAGE_RATIOS.includes(imageRatio)) {
      return imageRatio;
    }
    return 'custom';
  }, [imageRatio]);
  const isCustomImageRatio = imageRatioSelectValue === 'custom';
  const customImageRatioValue = isCustomImageRatio && imageRatio ? imageRatio : '';

  // Helper to render dynamic settings
  const renderSettingsControl = (setting, index) => {
    // Check conditions
    if (setting.condition) {
      const shouldRender = Object.entries(setting.condition).every(([key, value]) => {
        return attributes[key] === value;
      });
      if (!shouldRender) {
        return null;
      }
    }
    const commonProps = {
      key: index,
      label: setting.label,
      help: setting.help
    };
    switch (setting.type) {
      case 'text':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          ...commonProps,
          value: attributes[setting.name] || setting.default || '',
          onChange: value => setAttributes({
            [setting.name]: value
          })
        });
      case 'number':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          ...commonProps,
          type: "number",
          value: attributes[setting.name] || setting.default || '',
          onChange: value => setAttributes({
            [setting.name]: Number(value)
          })
        });
      case 'range':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          ...commonProps,
          value: attributes[setting.name] || setting.default,
          onChange: value => setAttributes({
            [setting.name]: value
          }),
          min: setting.min,
          max: setting.max,
          step: setting.step
        });
      case 'toggle':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          ...commonProps,
          checked: attributes[setting.name] ?? setting.default,
          onChange: value => setAttributes({
            [setting.name]: value
          })
        });
      case 'select':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          ...commonProps,
          value: attributes[setting.name] || setting.default,
          options: setting.options || [],
          onChange: value => setAttributes({
            [setting.name]: value
          })
        });
      case 'panel':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: setting.title,
          initialOpen: setting.initialOpen,
          children: setting.controls?.map((childSetting, childIndex) => renderSettingsControl(childSetting, childIndex))
        }, index);
      default:
        return null;
    }
  };

  // Pre-compute orderBy options outside conditional render to avoid React hooks error
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
    // Filter order by options based on postType:
    // - Common options: postType is null (available for all post types)
    // - Specific options: postType matches current postType
    const filtered = allOrderByOptions.filter(option => !option.postType || option.postType === postType).map(option => ({
      label: option.label,
      value: option.value
    }));
    return filtered;
  }, [postType]);

  // Pre-compute order options outside conditional render
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

  // Pre-compute query preset options outside JSX
  const normalizedPresets = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => normalizeQueryPresets(window.jankxQueryOptions?.queryPresets), []);
  const queryPresetOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const allPresets = normalizedPresets;
    // Filter presets based on postType:
    // - Common presets: postType is null (available for all post types)
    // - Specific presets: postType matches current postType
    const filtered = allPresets.filter(preset => !preset.postType || preset.postType === postType).map(preset => ({
      label: preset.label,
      value: preset.value
    }));
    return filtered;
  }, [postType, normalizedPresets]);

  // Pre-compute query preset help text outside JSX
  const queryPresetHelp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const currentPreset = normalizedPresets.find(p => p.value === queryPreset);
    const helpText = toSafeHelpText(currentPreset?.help, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a query preset', 'jankx'));
    return helpText;
  }, [queryPreset, normalizedPresets]);
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
            setAttributes({
              queryPreset: value
            });
          },
          help: queryPresetHelp
        }), !useMultiPostType ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'jankx'),
          value: postType,
          options: postTypeOptions,
          onChange: value => {
            setAttributes({
              postType: value,
              useMultiPostType: false
            });
          },
          help: queryPreset === 'default' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select post type for the main query', 'jankx') : undefined
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Multi Post Type', 'jankx'),
          checked: useMultiPostType,
          onChange: value => {
            setAttributes({
              useMultiPostType: value
            });
            if (!value) {
              // When turning off multi, keep first selected as single postType
              const first = Array.isArray(postTypes) && postTypes.length > 0 ? postTypes[0] : postType;
              setAttributes({
                postType: first
              });
            }
          },
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enable selecting multiple post types', 'jankx')
        }), useMultiPostType ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Types (Multiple)', 'jankx'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select multiple post types to include', 'jankx'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FormTokenField, {
            value: postTypes.map(slug => {
              const found = postTypeOptions.find(opt => opt.value === slug);
              return found?.label || slug;
            }),
            suggestions: postTypeOptions.map(opt => opt.label),
            onChange: tokens => {
              const names = normalizeTokens(tokens);
              const selectedSlugs = names.map(name => {
                const opt = postTypeOptions.find(o => o.label === name);
                return opt?.value || '';
              }).filter(slug => slug.length > 0);
              setAttributes({
                postTypes: selectedSlugs
              });
              if (selectedSlugs.length > 0) {
                setAttributes({
                  postType: selectedSlugs[0]
                });
              }
            }
          })
        }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
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
          if (!shouldRender) {
            return null;
          }
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order By', 'jankx'),
              value: orderBy,
              options: orderByOptions,
              onChange: value => {
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
                setAttributes(updates);
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort posts by which criteria', 'jankx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Order', 'jankx'),
              value: order,
              options: orderOptions,
              onChange: value => {
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
      }), settingsDefinition.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Settings', 'jankx'),
        initialOpen: true,
        children: settingsDefinition.map((setting, index) => renderSettingsControl(setting, index))
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
                const author = authors.find(item => item.name === tokenName);
                return author?.id ?? 0;
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
                const author = authors.find(item => item.name === tokenName);
                return author?.id ?? 0;
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
                      const term = terms.find(item => item.name === tokenName);
                      return term?.id ?? 0;
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
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display Options', 'jankx'),
        initialOpen: false,
        children: [supportedOptions.includes('showFeaturedImage') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Featured Image', 'jankx'),
            checked: showFeaturedImage,
            onChange: value => setAttributes({
              showFeaturedImage: value
            }),
            disabled: readOnlyOptions.includes('showFeaturedImage')
          }), showFeaturedImage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
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
              }),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Position of the featured image relative to content', 'jankx')
            }), isCustomImageRatio ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
              style: {
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end',
                marginBottom: '1em'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                style: {
                  flex: 1
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Ratio', 'jankx'),
                  value: imageRatioSelectValue,
                  options: [{
                    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Original', 'jankx'),
                    value: ''
                  }, {
                    label: '16:9',
                    value: '16/9'
                  }, {
                    label: '4:3',
                    value: '4/3'
                  }, {
                    label: '1:1',
                    value: '1/1'
                  }, {
                    label: '3:2',
                    value: '3/2'
                  }, {
                    label: '3:4',
                    value: '3/4'
                  }, {
                    label: '9:16',
                    value: '9/16'
                  }, {
                    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'jankx'),
                    value: 'custom'
                  }],
                  onChange: value => {
                    if (value === 'custom') {
                      setAttributes({
                        imageRatio: '16/9'
                      });
                    } else {
                      setAttributes({
                        imageRatio: value
                      });
                    }
                  }
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                style: {
                  flex: 1
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom Ratio', 'jankx'),
                  value: customImageRatioValue,
                  onChange: value => {
                    const ratioPattern = /^\d+\/\d+$/;
                    if (!value || ratioPattern.test(value)) {
                      setAttributes({
                        imageRatio: value || ''
                      });
                    }
                  },
                  placeholder: "16/9"
                })
              })]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Ratio', 'jankx'),
              value: imageRatioSelectValue,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Original', 'jankx'),
                value: ''
              }, {
                label: '16:9',
                value: '16/9'
              }, {
                label: '4:3',
                value: '4/3'
              }, {
                label: '1:1',
                value: '1/1'
              }, {
                label: '3:2',
                value: '3/2'
              }, {
                label: '3:4',
                value: '3/4'
              }, {
                label: '9:16',
                value: '9/16'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Custom', 'jankx'),
                value: 'custom'
              }],
              onChange: value => {
                if (value === 'custom') {
                  setAttributes({
                    imageRatio: '16/9'
                  });
                } else {
                  setAttributes({
                    imageRatio: value
                  });
                }
              },
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Aspect ratio for the featured image', 'jankx')
            })]
          })]
        }), supportedOptions.includes('showTitle') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Title', 'jankx'),
          checked: showTitle,
          onChange: value => setAttributes({
            showTitle: value
          }),
          disabled: readOnlyOptions.includes('showTitle')
        }), !isProduct && supportedOptions.includes('showExcerpt') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Excerpt', 'jankx'),
            checked: showExcerpt,
            onChange: value => setAttributes({
              showExcerpt: value
            }),
            disabled: readOnlyOptions.includes('showExcerpt')
          }), showExcerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Excerpt Length', 'jankx'),
            value: excerptLength,
            onChange: value => setAttributes({
              excerptLength: value || 55
            }),
            min: 10,
            max: 200,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of characters to display in excerpt', 'jankx')
          })]
        }), !isProduct && supportedOptions.includes('showDate') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Date', 'jankx'),
          checked: showDate,
          onChange: value => setAttributes({
            showDate: value
          }),
          disabled: readOnlyOptions.includes('showDate')
        }), supportedOptions.includes('showAuthor') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Author', 'jankx'),
          checked: showAuthor,
          onChange: value => setAttributes({
            showAuthor: value
          }),
          disabled: readOnlyOptions.includes('showAuthor')
        }), hasCommerceFeatures && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Price', 'jankx'),
            checked: showPrice,
            onChange: value => setAttributes({
              showPrice: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Add To Cart Button', 'jankx'),
            checked: showAddToCart,
            onChange: value => setAttributes({
              showAddToCart: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Rating', 'jankx'),
            checked: showRating,
            onChange: value => setAttributes({
              showRating: value
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
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
      })]
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
              allowedBlocks: ['jankx/dynamic-data-template', 'core/heading'],
              templateLock: false,
              renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.ButtonBlockAppender
            })]
          });
        }
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
          allowedBlocks: ['jankx/dynamic-data-template', 'core/heading'],
          templateLock: false,
          renderAppender: _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.DefaultBlockAppender
        });
      })()
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ },

/***/ "./blocks/dynamic-data-layout/save.tsx"
/*!*********************************************!*\
  !*** ./blocks/dynamic-data-layout/save.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
  const className = ['dynamic-data-layout', `dynamic-data-layout--${layout}`, `columns-${columns}`, `columns-tablet-${columnsTablet}`, `columns-mobile-${columnsMobile}`, backgroundColorSlug ? `has-${backgroundColorSlug}-background-color` : undefined, textColorSlug ? `has-${textColorSlug}-color` : undefined, hasBackground ? 'has-background' : undefined, hasTextColor ? 'has-text-color' : undefined].filter(Boolean).join(' ');

  // Collect styles (CSS variables for columns + color styles from style.color)
  const inlineStyle = {
    '--columns-desktop': columns,
    '--columns-tablet': columnsTablet,
    '--columns-mobile': columnsMobile,
    '--slides-per-view': columns,
    '--space-between': '16px'
  };

  // Add carousel specific styles if layout is carousel
  if (layout === 'carousel') {
    inlineStyle['--slides-per-view'] = columns;
    inlineStyle['--space-between'] = '16px';
  }
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

  // Add data attributes for carousel
  const dataAttributes = {
    'data-layout': layout,
    'data-slides-per-view': columns,
    'data-space-between': '16'
  };
  if (layout === 'carousel') {
    dataAttributes['data-autoplay'] = attributes.autoplay || false;
    dataAttributes['data-autoplay-delay'] = attributes.autoplayDelay || 3000;
    dataAttributes['data-slides-per-view'] = columns;
    dataAttributes['data-space-between'] = '16';
    dataAttributes['data-loop'] = attributes.loop || false;
  }
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className,
    style: inlineStyle,
    ...dataAttributes
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: `carousel-container ${layout === 'carousel' ? 'is-carousel' : ''}`,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {})
    })
  });
}

/***/ },

/***/ "./shared/components/ResponsiveControl.tsx"
/*!*************************************************!*\
  !*** ./shared/components/ResponsiveControl.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "./shared/components/index.ts"
/*!************************************!*\
  !*** ./shared/components/index.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResponsiveControl: () => (/* reexport safe */ _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useResponsiveValue: () => (/* reexport safe */ _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__.useResponsiveValue)
/* harmony export */ });
/* harmony import */ var _ResponsiveControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ResponsiveControl */ "./shared/components/ResponsiveControl.tsx");
/* harmony import */ var _useResponsiveValue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useResponsiveValue */ "./shared/components/useResponsiveValue.ts");



/***/ },

/***/ "./shared/components/useResponsiveValue.ts"
/*!*************************************************!*\
  !*** ./shared/components/useResponsiveValue.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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

/***/ },

/***/ "./blocks/dynamic-data-layout/editor.scss"
/*!************************************************!*\
  !*** ./blocks/dynamic-data-layout/editor.scss ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./blocks/dynamic-data-layout/style.scss"
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-layout/style.scss ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./blocks/dynamic-data-layout/block.json"
/*!***********************************************!*\
  !*** ./blocks/dynamic-data-layout/block.json ***!
  \***********************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"jankx/dynamic-data-layout","version":"1.0.0","title":"Dynamic Data Layout","category":"jankx","icon":"layout","description":"Hiển thị danh sách posts theo layout tùy chỉnh với WordPress query builder","textdomain":"jankx","editorScript":"file:./build/index.js","editorStyle":"file:./build/editor.css","style":"file:./build/style.css","providesContext":{"queryId":"queryId","postType":"postType","displayLayout":"layout","postsPerPage":"postsPerPage","columns":"columns","columnsTablet":"columnsTablet","columnsMobile":"columnsMobile","slidesToScroll":"slidesToScroll","loop":"loop","autoplay":"autoplay","autoplayDelay":"autoplayDelay","showArrows":"showArrows","showDots":"showDots","carouselAlign":"carouselAlign","carouselAxis":"carouselAxis","carouselDirection":"carouselDirection","carouselStartIndex":"carouselStartIndex","carouselDuration":"carouselDuration","carouselDragFree":"carouselDragFree","carouselDragThreshold":"carouselDragThreshold","carouselSkipSnaps":"carouselSkipSnaps","carouselContainScroll":"carouselContainScroll","carouselInViewThreshold":"carouselInViewThreshold","queryPreset":"queryPreset","includeStickyPosts":"includeStickyPosts","orderBy":"orderBy","order":"order","offset":"offset","taxQuery":"taxQuery","metaQuery":"metaQuery","keyword":"keyword","authorIn":"authorIn","authorNotIn":"authorNotIn","postIn":"postIn","postNotIn":"postNotIn","metaKey":"metaKey","metaType":"metaType","postStatus":"postStatus","postParent":"postParent","postParentIn":"postParentIn","postParentNotIn":"postParentNotIn","customQueryId":"customQueryId"},"usesContext":["queryId","postType"],"allowedBlocks":["core/heading","jankx/dynamic-data-template","jankx/layout-switcher"],"supports":{"html":false,"align":["wide","full"],"anchor":true,"innerBlocks":true,"spacing":{"margin":true,"padding":true,"blockGap":true},"color":{"background":true,"text":true,"link":true,"gradients":true},"background":{"backgroundImage":true,"backgroundSize":true},"typography":{"fontSize":true,"lineHeight":true},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true},"__experimentalLayout":{"allowSwitching":true,"allowInheriting":true,"default":{"type":"constrained"}}},"attributes":{"queryPreset":{"type":"string","default":"custom","enum":["default","related","custom","on-sale","featured","related-products","best-sellers","top-rated","upsells","new-arrivals","recently-viewed"]},"postType":{"type":"string","default":"post"},"useMultiPostType":{"type":"boolean","default":false},"postTypes":{"type":"array","default":[]},"postsPerPage":{"type":"number","default":10},"includeStickyPosts":{"type":"boolean","default":false},"layout":{"type":"string","default":"grid"},"columns":{"type":"number","default":3},"columnsTablet":{"type":"number","default":2},"columnsMobile":{"type":"number","default":1},"responsiveColumns":{"type":"object","default":{"desktop":3,"tablet":2,"mobile":1}},"orderBy":{"type":"string","default":"date"},"order":{"type":"string","default":"DESC"},"queryId":{"type":"string","default":""},"offset":{"type":"number","default":0},"taxQuery":{"type":"array","default":[]},"metaQuery":{"type":"array","default":[]},"keyword":{"type":"string","default":""},"authorIn":{"type":"array","default":[]},"authorNotIn":{"type":"array","default":[]},"postIn":{"type":"array","default":[]},"postNotIn":{"type":"array","default":[]},"metaKey":{"type":"string","default":""},"metaType":{"type":"string","default":""},"postStatus":{"type":"array","default":["publish"]},"postParent":{"type":"number","default":0},"postParentIn":{"type":"array","default":[]},"postParentNotIn":{"type":"array","default":[]},"customQueryId":{"type":"string","default":""},"enablePagination":{"type":"boolean","default":false},"paginationStyle":{"type":"string","default":"numbers","enum":["numbers","simple","arrows","load-more"]},"paginationAlignment":{"type":"string","default":"center","enum":["left","center","right"]},"showPaginationNumbers":{"type":"boolean","default":true},"paginationPrevText":{"type":"string","default":""},"paginationNextText":{"type":"string","default":""},"slidesToScroll":{"type":"number","default":1},"loop":{"type":"boolean","default":false},"autoplay":{"type":"boolean","default":false},"autoplayDelay":{"type":"number","default":3000},"showArrows":{"type":"boolean","default":true},"showDots":{"type":"boolean","default":true},"carouselAlign":{"type":"string","default":"start","enum":["start","center","end"]},"carouselAxis":{"type":"string","default":"x","enum":["x","y"]},"carouselDirection":{"type":"string","default":"ltr","enum":["ltr","rtl"]},"carouselStartIndex":{"type":"number","default":0},"carouselDuration":{"type":"number","default":25},"carouselDragFree":{"type":"boolean","default":false},"carouselDragThreshold":{"type":"number","default":10},"carouselSkipSnaps":{"type":"boolean","default":false},"carouselContainScroll":{"type":"string","default":"trimSnaps","enum":["false","trimSnaps","keepSnaps"]},"carouselInViewThreshold":{"type":"number","default":0},"showTitle":{"type":"boolean","default":true},"showExcerpt":{"type":"boolean","default":true},"showFeaturedImage":{"type":"boolean","default":true},"thumbnailPosition":{"type":"string","default":"top","enum":["top","bottom","left","right"]},"imageRatio":{"type":"string","default":""},"showDate":{"type":"boolean","default":true},"showAuthor":{"type":"boolean","default":false},"showPrice":{"type":"boolean","default":true},"showAddToCart":{"type":"boolean","default":true},"showRating":{"type":"boolean","default":false},"excerptLength":{"type":"number","default":55}}}');

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
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
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./blocks/dynamic-data-layout/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./blocks/dynamic-data-layout/edit.tsx");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./blocks/dynamic-data-layout/save.tsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/dynamic-data-layout/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







// Deprecated v1: old save used only data-layout + data-columns, no extra classes or CSS vars

const deprecated = [{
  attributes: _block_json__WEBPACK_IMPORTED_MODULE_5__.attributes,
  migrate(attributes) {
    return attributes;
  },
  save({
    attributes
  }) {
    const layout = attributes.layout || 'grid';
    const columns = attributes.columns || 3;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      'data-layout': layout,
      'data-columns': columns
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    });
  }
}];
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"],
  deprecated
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map