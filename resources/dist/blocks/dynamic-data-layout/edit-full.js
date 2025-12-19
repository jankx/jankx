import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, Spinner, TextControl, FormTokenField, Button, BaseControl, } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState, useMemo, useRef } from '@wordpress/element';
import { ResponsiveControl } from '../../shared/components';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
import useEmblaCarousel from 'embla-carousel-react';
import { renderLayout, getLayoutStructure, getPostItemStructure } from './layout-renderer';
import Save from './save';
const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'];
const normalizeTokens = (tokens) => {
    return tokens
        .map((token) => {
        if (typeof token === 'string') {
            return token.trim();
        }
        if (token && typeof token.value === 'string') {
            return token.value.trim();
        }
        return '';
    })
        .filter((value) => value.length > 0);
};
function Edit({ attributes, setAttributes, clientId }) {
    const { queryPreset, postType, postsPerPage, layout, columns, columnsTablet, columnsMobile, responsiveColumns, showTitle, showExcerpt, showFeaturedImage, includeStickyPosts = false, thumbnailPosition = 'top', imageRatio, showDate, showAuthor, showPrice = true, showAddToCart = true, showRating = false, excerptLength, orderBy, order, queryId, enablePagination, paginationStyle, paginationAlignment, showPaginationNumbers, paginationPrevText = '', paginationNextText = '', offset = 0, taxQuery = [], metaQuery = [], keyword = '', authorIn = [], authorNotIn = [], postIn = [], postNotIn = [], metaKey = '', metaType = '', postStatus = ['publish'], postParent = 0, postParentIn = [], postParentNotIn = [], customQueryId = '', slidesToScroll = 1, loop = false, autoplay = false, autoplayDelay = 3000, showArrows = true, showDots = true, carouselAlign = 'start', carouselAxis = 'x', carouselDirection = 'ltr', carouselStartIndex = 0, carouselDuration = 25, carouselDragFree = false, carouselDragThreshold = 10, carouselSkipSnaps = false, carouselContainScroll = 'trimSnaps', carouselInViewThreshold = 0, } = attributes;
    // Preview HTML for editor (generated from structure)
    // Preview should match frontend output exactly
    const [previewHtml, setPreviewHtml] = useState('');
    // Embla Carousel refs for carousel layout preview in editor
    // Use a ref to store the viewport element for carousel
    const carouselViewportRef = useRef(null);
    // Initialize Embla carousel only when layout is carousel
    const [emblaRef, emblaApi] = useEmblaCarousel(layout === 'carousel' ? {
        slidesToScroll,
        loop,
        skipSnaps: carouselSkipSnaps,
        dragFree: carouselDragFree,
        align: carouselAlign,
        axis: carouselAxis,
        direction: carouselDirection,
        startIndex: carouselStartIndex,
        duration: carouselDuration,
        dragThreshold: carouselDragThreshold,
        containScroll: carouselContainScroll === 'false' ? false : carouselContainScroll,
        inViewThreshold: carouselInViewThreshold,
    } : undefined, [] // Plugins array - autoplay will be handled by frontend JS
    );
    // Attach emblaRef to viewport element when carousel HTML is rendered
    useEffect(() => {
        if (layout === 'carousel' && previewHtml && carouselViewportRef.current && emblaRef) {
            const viewport = carouselViewportRef.current.querySelector('.embla__viewport');
            if (viewport) {
                if (typeof emblaRef === 'function') {
                    emblaRef(viewport);
                }
                else if (emblaRef && typeof emblaRef === 'object' && 'current' in emblaRef) {
                    emblaRef.current = viewport;
                }
            }
        }
    }, [layout, previewHtml, emblaRef]);
    // Re-initialize carousel when settings change (for carousel layout only)
    useEffect(() => {
        if (layout === 'carousel' && emblaApi && previewHtml) {
            // Embla will auto-update when options change via props
            emblaApi.reInit();
        }
    }, [
        layout,
        slidesToScroll,
        loop,
        autoplay,
        autoplayDelay,
        carouselAlign,
        carouselAxis,
        carouselDirection,
        carouselStartIndex,
        carouselDuration,
        carouselDragFree,
        carouselDragThreshold,
        carouselSkipSnaps,
        carouselContainScroll,
        carouselInViewThreshold,
        previewHtml,
        emblaApi
    ]);
    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState({});
    const innerBlocks = useSelect((select) => select(blockEditorStore).getBlock(clientId)?.innerBlocks ?? [], [clientId]);
    const { replaceInnerBlocks } = useDispatch(blockEditorStore);
    const isMountedRef = useRef(true);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            // Generate numeric ID from clientId hash
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            setAttributes({ queryId: Math.abs(hash) });
        }
    }, [queryId, clientId, setAttributes]);
    // Reset queryPreset if current preset is not valid for the current postType
    useEffect(() => {
        const allPresets = window.jankxQueryOptions?.queryPresets || [];
        const validPresets = allPresets.filter((preset) => !preset.postType || preset.postType === postType);
        const currentPresetValid = validPresets.some((preset) => preset.value === queryPreset);
        if (!currentPresetValid && validPresets.length > 0) {
            // Reset to first valid preset
            setAttributes({ queryPreset: validPresets[0].value });
        }
    }, [postType, queryPreset, setAttributes]);
    // Fetch taxonomies and authors when postType changes
    useEffect(() => {
        const fetchTaxonomiesAndAuthors = async () => {
            try {
                const taxonomiesData = await window.wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                });
                if (!isMountedRef.current) {
                    return;
                }
                const taxArray = Object.values(taxonomiesData || {}).filter((item) => typeof item?.slug === 'string' && typeof item?.name === 'string');
                setTaxonomies(taxArray);
                const authorsData = await window.wp.apiFetch({
                    path: '/wp/v2/users?who=authors&per_page=100',
                });
                if (!isMountedRef.current) {
                    return;
                }
                const normalizedAuthors = (authorsData || [])
                    .map((author) => {
                    const id = typeof author?.id === 'number' ? author.id : Number(author?.id);
                    const name = typeof author?.name === 'string' && author.name.length > 0
                        ? author.name
                        : typeof author?.slug === 'string'
                            ? author.slug
                            : '';
                    return {
                        id: Number.isFinite(id) ? id : 0,
                        name,
                    };
                })
                    .filter((author) => author.id > 0 && author.name.length > 0);
                setAuthors(normalizedAuthors);
            }
            catch (error) {
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
    const fetchTermsForTaxonomy = useCallback(async (taxonomy) => {
        if (taxonomyTerms[taxonomy]) {
            return; // Already loaded
        }
        try {
            const termsResponse = await window.wp.apiFetch({
                path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
            });
            if (!isMountedRef.current) {
                return;
            }
            const normalizedTerms = (termsResponse || [])
                .map((term) => {
                const id = typeof term?.id === 'number' ? term.id : Number(term?.id);
                const name = typeof term?.name === 'string' ? term.name : '';
                return {
                    id: Number.isFinite(id) ? id : 0,
                    name,
                };
            })
                .filter((term) => term.id > 0 && term.name.length > 0);
            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: normalizedTerms,
            }));
        }
        catch (error) {
            console.error(`Error fetching terms for ${taxonomy}:`, error);
            if (!isMountedRef.current) {
                return;
            }
            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: [],
            }));
        }
    }, [taxonomyTerms]);
    const blockProps = useBlockProps({
        className: `post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
        style: {
            '--columns-desktop': columns,
            '--columns-tablet': columnsTablet,
            '--columns-mobile': columnsMobile,
        },
    });
    const isProduct = postType === 'product';
    const resolvedResponsiveColumns = responsiveColumns && typeof responsiveColumns === 'object'
        ? responsiveColumns
        : { desktop: columns, tablet: columnsTablet, mobile: columnsMobile };
    useEffect(() => {
        const expected = {
            desktop: columns,
            tablet: columnsTablet,
            mobile: columnsMobile,
        };
        const needsUpdate = !responsiveColumns ||
            responsiveColumns.desktop !== expected.desktop ||
            responsiveColumns.tablet !== expected.tablet ||
            responsiveColumns.mobile !== expected.mobile;
        if (needsUpdate) {
            setAttributes({ responsiveColumns: expected });
        }
    }, [columns, columnsTablet, columnsMobile, responsiveColumns, setAttributes]);
    const desiredInnerBlocks = useMemo(() => {
        const templateInnerBlocks = [];
        if (showFeaturedImage) {
            templateInnerBlocks.push('core/post-featured-image');
        }
        if (showTitle) {
            templateInnerBlocks.push(isProduct ? 'woocommerce/product-title' : 'core/post-title');
        }
        if (!isProduct && showDate) {
            templateInnerBlocks.push('core/post-date');
        }
        if (showAuthor) {
            templateInnerBlocks.push('core/post-author');
        }
        if (!isProduct && showExcerpt) {
            templateInnerBlocks.push('core/post-excerpt');
        }
        if (isProduct && showPrice) {
            templateInnerBlocks.push('woocommerce/product-price');
        }
        if (isProduct && showAddToCart) {
            templateInnerBlocks.push('woocommerce/product-button');
        }
        if (isProduct && showRating) {
            templateInnerBlocks.push('woocommerce/product-rating');
        }
        return templateInnerBlocks;
    }, [
        showFeaturedImage,
        showTitle,
        showDate,
        showAuthor,
        showExcerpt,
        showPrice,
        showAddToCart,
        showRating,
        isProduct,
    ]);
    // Auto-create template block with inner blocks based on display options
    useEffect(() => {
        if (!replaceInnerBlocks) {
            return;
        }
        const templateBlock = innerBlocks[0];
        const existingInnerBlocks = templateBlock?.innerBlocks ?? [];
        const existingNames = templateBlock ? existingInnerBlocks.map((block) => block.name) : [];
        const desiredNames = desiredInnerBlocks;
        const hasDifferences = existingNames.length !== desiredNames.length ||
            !existingNames.every((name) => desiredNames.includes(name));
        if (!templateBlock || templateBlock.name !== 'jankx/post-layout-template' || hasDifferences) {
            const newInnerBlocks = desiredNames.map((name) => createBlock(name));
            replaceInnerBlocks(clientId, [createBlock('jankx/post-layout-template', {}, newInnerBlocks)], false);
        }
    }, [desiredInnerBlocks, innerBlocks, replaceInnerBlocks, clientId]);
    const imageRatioSelectValue = useMemo(() => {
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
    // Get available post types
    const postTypes = useSelect((select) => {
        const { getPostTypes } = select('core');
        return getPostTypes({ per_page: -1 }) || [];
    }, []);
    const publicPostTypes = Array.isArray(window.jankxPublicPostTypes)
        ? window.jankxPublicPostTypes
        : [];
    const postTypeOptions = (() => {
        const map = new Map();
        postTypes
            .filter((type) => type.slug !== 'attachment')
            .forEach((type) => {
            if (!map.has(type.slug)) {
                map.set(type.slug, type.name);
            }
        });
        publicPostTypes
            .filter((pt) => pt.slug !== 'attachment')
            .forEach((pt) => {
            if (!map.has(pt.slug)) {
                map.set(pt.slug, pt.name || pt.slug);
            }
        });
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    })();
    // Get current layout's supported options
    const supportedLayouts = window.jankxSupportedPostTypeLayouts || [];
    const currentLayout = supportedLayouts.find((l) => l.name === layout);
    const supportedOptions = currentLayout?.supportedOptions || [];
    const readOnlyOptions = currentLayout?.readOnlyOptions || [];
    // Generate preview HTML from structure when attributes change
    useEffect(() => {
        const generatePreview = () => {
            const layoutStructure = getLayoutStructure(layout);
            const postItemStructure = getPostItemStructure();
            if (!layoutStructure || !postItemStructure) {
                setPreviewHtml('');
                return;
            }
            // Update container structure with current columns
            const updatedStructure = {
                ...layoutStructure,
                container: {
                    ...layoutStructure.container,
                    classes: [
                        ...(layoutStructure.container.classes || []).filter((cls) => !cls.startsWith('columns-')),
                        `columns-${columns}`,
                        `columns-tablet-${columnsTablet}`,
                        `columns-mobile-${columnsMobile}`,
                    ],
                    styles: {
                        ...(layoutStructure.container.styles || {}),
                        '--columns-desktop': String(columns),
                        '--columns-tablet': String(columnsTablet),
                        '--columns-mobile': String(columnsMobile),
                    },
                },
            };
            // Generate preview with sample posts data
            const samplePosts = Array.from({ length: Math.min(postsPerPage, 6) }, (_, i) => ({
                id: i + 1,
                title: `Sample Post ${i + 1}`,
                date: new Date().toLocaleDateString(),
                excerpt: 'This is a sample excerpt for preview purposes...',
                author: 'Sample Author',
                featuredImage: '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect fill=\'%23ddd\' width=\'800\' height=\'600\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3E800x600%3C/text%3E%3C/svg%3E" alt="Sample" />',
                link: '#',
            }));
            const renderedHtml = renderLayout(updatedStructure, samplePosts, postItemStructure, {
                showFeaturedImage,
                showTitle,
                showDate,
                showAuthor,
                showExcerpt,
                showPrice,
                showAddToCart,
                showRating,
                thumbnailPosition,
                imageRatio,
            });
            setPreviewHtml(renderedHtml);
        };
        // Debounce preview generation
        const timeoutId = setTimeout(() => {
            generatePreview();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        showFeaturedImage,
        showTitle,
        showDate,
        showAuthor,
        showExcerpt,
        showPrice,
        showAddToCart,
        showRating,
        thumbnailPosition,
        imageRatio,
        postsPerPage,
    ]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { group: "settings", children: [_jsxs(PanelBody, { title: __('Query Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Query Preset', 'jankx'), value: queryPreset, options: useMemo(() => {
                                    const allPresets = window.jankxQueryOptions?.queryPresets || [];
                                    // Filter presets based on postType:
                                    // - Common presets: postType is null (available for all post types)
                                    // - Specific presets: postType matches current postType
                                    return allPresets
                                        .filter((preset) => !preset.postType || preset.postType === postType)
                                        .map((preset) => ({
                                        label: preset.label,
                                        value: preset.value,
                                    }));
                                }, [postType]), onChange: (value) => setAttributes({ queryPreset: value }), help: useMemo(() => {
                                    const allPresets = window.jankxQueryOptions?.queryPresets || [];
                                    const currentPreset = allPresets.find((p) => p.value === queryPreset);
                                    return currentPreset?.help || __('Select a query preset', 'jankx');
                                }, [queryPreset]) }), _jsx(SelectControl, { label: __('Post Type', 'jankx'), value: postType, options: postTypeOptions, onChange: (value) => setAttributes({ postType: value }), help: queryPreset === 'default' ? __('Select post type for the main query', 'jankx') : undefined }), _jsx(RangeControl, { label: __('Posts Per Page', 'jankx'), value: postsPerPage, onChange: (value) => setAttributes({ postsPerPage: value || 10 }), min: 1, max: 50, help: __('Number of posts to display', 'jankx') }), postType === 'post' && (_jsx(ToggleControl, { label: __('Include Sticky Posts', 'jankx'), checked: includeStickyPosts, onChange: (value) => setAttributes({ includeStickyPosts: value }), help: __('Include sticky posts in the query (disabled by default).', 'jankx') })), queryPreset !== 'default' && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Order By', 'jankx'), value: orderBy, options: useMemo(() => {
                                            const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
                                            // Filter order by options based on postType:
                                            // - Common options: postType is null (available for all post types)
                                            // - Specific options: postType matches current postType
                                            return allOrderByOptions
                                                .filter((option) => !option.postType || option.postType === postType)
                                                .map((option) => ({
                                                label: option.label,
                                                value: option.value,
                                            }));
                                        }, [postType]), onChange: (value) => {
                                            const allOrderByOptions = window.jankxQueryOptions?.orderBy || [];
                                            const selectedOption = allOrderByOptions.find((opt) => opt.value === value);
                                            // Auto-set metaKey if option has metaKey property
                                            const updates = { orderBy: value };
                                            if (selectedOption?.metaKey) {
                                                updates.metaKey = selectedOption.metaKey;
                                                // Set orderBy to meta_value_num if value is numeric (like total_sales, _price)
                                                if (['total_sales', '_price'].includes(value)) {
                                                    updates.orderBy = 'meta_value_num';
                                                }
                                            }
                                            setAttributes(updates);
                                        }, help: __('Sort posts by which criteria', 'jankx') }), _jsx(SelectControl, { label: __('Order', 'jankx'), value: order, options: window.jankxQueryOptions?.order || [
                                            { label: __('Descending', 'jankx'), value: 'DESC' },
                                            { label: __('Ascending', 'jankx'), value: 'ASC' },
                                        ], onChange: (value) => setAttributes({ order: value }) })] }))] }), _jsxs(PanelBody, { title: __('Layout', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Layout Type', 'jankx'), value: layout, options: window.jankxSupportedPostTypeLayouts?.map((layout) => ({
                                    label: layout.title,
                                    value: layout.name,
                                })) || [
                                    { label: __('Grid', 'jankx'), value: 'grid' },
                                    { label: __('List', 'jankx'), value: 'list' },
                                    { label: __('Masonry', 'jankx'), value: 'masonry' },
                                    { label: __('Card', 'jankx'), value: 'card' },
                                    { label: __('Carousel', 'jankx'), value: 'carousel' },
                                ], onChange: (value) => setAttributes({ layout: value }) }), supportedOptions.includes('columns') && (_jsx(ResponsiveControl, { label: __('Columns', 'jankx'), values: resolvedResponsiveColumns, onChange: (values) => setAttributes({
                                    columns: values.desktop,
                                    columnsTablet: values.tablet,
                                    columnsMobile: values.mobile,
                                    responsiveColumns: values
                                }), min: 1, max: 6, help: {
                                    desktop: __('Number of columns on large screens (>1024px)', 'jankx'),
                                    tablet: __('Number of columns on tablet (768px - 1024px)', 'jankx'),
                                    mobile: __('Number of columns on mobile (<768px)', 'jankx')
                                } })), layout === 'carousel' && (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Slides To Scroll', 'jankx'), value: slidesToScroll, onChange: (value) => setAttributes({ slidesToScroll: value || 1 }), min: 1, max: columns || 3, help: __('Number of slides to scroll at a time', 'jankx') }), _jsx(ToggleControl, { label: __('Loop', 'jankx'), checked: loop, onChange: (value) => setAttributes({ loop: value }), help: __('Enable infinite loop', 'jankx') }), _jsx(ToggleControl, { label: __('Autoplay', 'jankx'), checked: autoplay, onChange: (value) => setAttributes({ autoplay: value }), help: __('Automatically advance slides', 'jankx') }), autoplay && (_jsx(RangeControl, { label: __('Autoplay Delay (ms)', 'jankx'), value: autoplayDelay, onChange: (value) => setAttributes({ autoplayDelay: value || 3000 }), min: 1000, max: 10000, step: 500, help: __('Time between autoplay transitions', 'jankx') })), _jsx(ToggleControl, { label: __('Show Arrows', 'jankx'), checked: showArrows, onChange: (value) => setAttributes({ showArrows: value }), help: __('Display navigation arrows', 'jankx') }), _jsx(ToggleControl, { label: __('Show Dots', 'jankx'), checked: showDots, onChange: (value) => setAttributes({ showDots: value }), help: __('Display pagination dots', 'jankx') })] }))] }), _jsxs(PanelBody, { title: __('Display Options', 'jankx'), initialOpen: false, children: [supportedOptions.includes('showFeaturedImage') && (_jsxs(_Fragment, { children: [_jsx(ToggleControl, { label: __('Show Featured Image', 'jankx'), checked: showFeaturedImage, onChange: (value) => setAttributes({ showFeaturedImage: value }), disabled: readOnlyOptions.includes('showFeaturedImage') }), showFeaturedImage && (_jsxs(_Fragment, { children: [supportedOptions.includes('thumbnailPosition') && (_jsx(SelectControl, { label: __('Thumbnail Position', 'jankx'), value: thumbnailPosition || 'top', options: [
                                                    { label: __('Top (Default)', 'jankx'), value: 'top' },
                                                    { label: __('Bottom', 'jankx'), value: 'bottom' },
                                                    { label: __('Left', 'jankx'), value: 'left' },
                                                    { label: __('Right', 'jankx'), value: 'right' },
                                                ], onChange: (value) => setAttributes({ thumbnailPosition: value }), help: __('Choose where the featured image appears relative to the content.', 'jankx') })), _jsx(SelectControl, { label: __('Image Aspect Ratio', 'jankx'), value: imageRatioSelectValue, onChange: (value) => {
                                                    if (value === 'custom') {
                                                        // Set to empty string to show TextControl, user will enter custom value
                                                        setAttributes({ imageRatio: '' });
                                                    }
                                                    else {
                                                        setAttributes({ imageRatio: value || '' });
                                                    }
                                                }, help: __('Set the aspect ratio for featured images', 'jankx'), options: [
                                                    { label: __('Default (3:2)', 'jankx'), value: '' },
                                                    { label: __('16:9 (Landscape)', 'jankx'), value: '16/9' },
                                                    { label: __('4:3 (Landscape)', 'jankx'), value: '4/3' },
                                                    { label: __('21:9 (Ultra Wide)', 'jankx'), value: '21/9' },
                                                    { label: __('1:1 (Square)', 'jankx'), value: '1/1' },
                                                    { label: __('3:4 (Portrait)', 'jankx'), value: '3/4' },
                                                    { label: __('2:3 (Portrait)', 'jankx'), value: '2/3' },
                                                    { label: __('9:16 (Vertical)', 'jankx'), value: '9/16' },
                                                    { label: __('Custom', 'jankx'), value: 'custom' },
                                                ] }), isCustomImageRatio && (_jsx(TextControl, { label: __('Custom Ratio', 'jankx'), value: customImageRatioValue, onChange: (value) => {
                                                    // Validate format: should be "number/number" or empty
                                                    const ratioPattern = /^\d+\/\d+$/;
                                                    if (!value || ratioPattern.test(value)) {
                                                        setAttributes({ imageRatio: value || '' });
                                                    }
                                                }, help: __('Enter aspect ratio in format: width/height (e.g., 16/9, 3/4)', 'jankx'), placeholder: "16/9" }))] }))] })), supportedOptions.includes('showTitle') && (_jsx(ToggleControl, { label: __('Show Title', 'jankx'), checked: showTitle, onChange: (value) => setAttributes({ showTitle: value }), disabled: readOnlyOptions.includes('showTitle') })), !isProduct && supportedOptions.includes('showExcerpt') && (_jsxs(_Fragment, { children: [_jsx(ToggleControl, { label: __('Show Excerpt', 'jankx'), checked: showExcerpt, onChange: (value) => setAttributes({ showExcerpt: value }), disabled: readOnlyOptions.includes('showExcerpt') }), showExcerpt && (_jsx(RangeControl, { label: __('Excerpt Length', 'jankx'), value: excerptLength, onChange: (value) => setAttributes({ excerptLength: value || 55 }), min: 10, max: 200, help: __('Number of characters to display in excerpt', 'jankx') }))] })), !isProduct && supportedOptions.includes('showDate') && (_jsx(ToggleControl, { label: __('Show Date', 'jankx'), checked: showDate, onChange: (value) => setAttributes({ showDate: value }), disabled: readOnlyOptions.includes('showDate') })), supportedOptions.includes('showAuthor') && (_jsx(ToggleControl, { label: __('Show Author', 'jankx'), checked: showAuthor, onChange: (value) => setAttributes({ showAuthor: value }), disabled: readOnlyOptions.includes('showAuthor') })), isProduct && (_jsxs(_Fragment, { children: [_jsx(ToggleControl, { label: __('Show Price', 'jankx'), checked: showPrice, onChange: (value) => setAttributes({ showPrice: value }) }), _jsx(ToggleControl, { label: __('Show Add To Cart Button', 'jankx'), checked: showAddToCart, onChange: (value) => setAttributes({ showAddToCart: value }) }), _jsx(ToggleControl, { label: __('Show Rating', 'jankx'), checked: showRating, onChange: (value) => setAttributes({ showRating: value }) })] })), _jsx(ToggleControl, { label: __('Enable Pagination', 'jankx'), checked: enablePagination, onChange: (value) => setAttributes({ enablePagination: value }), help: __('Display pagination to paginate posts', 'jankx') }), enablePagination && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Pagination Style', 'jankx'), value: paginationStyle, options: [
                                            { label: __('Numbers', 'jankx'), value: 'numbers' },
                                            { label: __('Simple (Prev/Next)', 'jankx'), value: 'simple' },
                                            { label: __('Arrows', 'jankx'), value: 'arrows' },
                                            { label: __('Load More', 'jankx'), value: 'load-more' },
                                        ], onChange: (value) => setAttributes({ paginationStyle: value }), help: __('Choose pagination display style', 'jankx') }), _jsx(SelectControl, { label: __('Pagination Alignment', 'jankx'), value: paginationAlignment, options: [
                                            { label: __('Left', 'jankx'), value: 'left' },
                                            { label: __('Center', 'jankx'), value: 'center' },
                                            { label: __('Right', 'jankx'), value: 'right' },
                                        ], onChange: (value) => setAttributes({ paginationAlignment: value }), help: __('Align pagination position', 'jankx') }), paginationStyle === 'numbers' && (_jsx(ToggleControl, { label: __('Show All Page Numbers', 'jankx'), checked: showPaginationNumbers, onChange: (value) => setAttributes({ showPaginationNumbers: value }), help: __('Show all page numbers instead of abbreviated', 'jankx') })), _jsx(TextControl, { label: __('Previous Button Text', 'jankx'), value: paginationPrevText, onChange: (value) => setAttributes({ paginationPrevText: value }), help: __('Leave empty to use default text. Can use HTML/SVG.', 'jankx'), placeholder: __('Example: « Previous or <svg>...</svg>', 'jankx') }), _jsx(TextControl, { label: __('Next Button Text', 'jankx'), value: paginationNextText, onChange: (value) => setAttributes({ paginationNextText: value }), help: __('Leave empty to use default text. Can use HTML/SVG.', 'jankx'), placeholder: __('Example: Next » or <svg>...</svg>', 'jankx') })] }))] }), queryPreset === 'custom' && (_jsxs(PanelBody, { title: __('Query Parameters', 'jankx'), initialOpen: false, children: [_jsx(RangeControl, { label: __('Offset', 'jankx'), value: offset, onChange: (value) => setAttributes({ offset: value || 0 }), min: 0, max: 50, help: __('Skip the first N posts', 'jankx') }), (orderBy === 'meta_value' || orderBy === 'meta_value_num') && (_jsxs(_Fragment, { children: [_jsx(TextControl, { label: __('Meta Key', 'jankx'), value: metaKey, onChange: (value) => setAttributes({ metaKey: value }), help: __('Meta key for sorting (required when using meta_value)', 'jankx'), placeholder: __('Example: price, views, rating', 'jankx') }), orderBy === 'meta_value' && (_jsx(SelectControl, { label: __('Meta Type', 'jankx'), value: metaType, options: window.jankxQueryOptions?.metaTypes || [
                                            { label: __('-- Auto --', 'jankx'), value: '' },
                                            { label: 'NUMERIC', value: 'NUMERIC' },
                                        ], onChange: (value) => setAttributes({ metaType: value }), help: __('Specify data type for accurate sorting', 'jankx') }))] }))] })), queryPreset === 'custom' && (_jsxs(PanelBody, { title: __('🔧 Advanced Query Parameters', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Query ID', 'jankx'), value: customQueryId, onChange: (value) => setAttributes({ customQueryId: value }), help: __('Set a name for this query to apply final filters: jankx/post-layout/query-args/{query_id}', 'jankx'), placeholder: __('Example: featured-posts, sidebar-posts', 'jankx') }), _jsx(BaseControl, { label: __('Post Status', 'jankx'), help: __('Post status to fetch (default: publish)', 'jankx'), children: _jsx(FormTokenField, { value: postStatus, suggestions: ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any'], onChange: (tokens) => setAttributes({ postStatus: normalizeTokens(tokens) }) }) }), _jsx(TextControl, { label: __('Post Parent ID', 'jankx'), type: "number", value: postParent, onChange: (value) => setAttributes({ postParent: parseInt(value) || 0 }), help: __('Filter posts by parent ID (0 = all)', 'jankx') }), _jsx(TextControl, { label: __('Post Parent IDs (Include)', 'jankx'), value: postParentIn.join(', '), onChange: (value) => {
                                    const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                    setAttributes({ postParentIn: ids });
                                }, help: __('Only fetch posts with parents in this list', 'jankx'), placeholder: __('Example: 1, 2, 3', 'jankx') }), _jsx(TextControl, { label: __('Post Parent IDs (Exclude)', 'jankx'), value: postParentNotIn.join(', '), onChange: (value) => {
                                    const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                    setAttributes({ postParentNotIn: ids });
                                }, help: __('Exclude posts with parents in this list', 'jankx'), placeholder: __('Example: 4, 5, 6', 'jankx') })] })), queryPreset === 'custom' && (_jsx(PanelBody, { title: __('🔍 Keyword Search', 'jankx'), initialOpen: false, children: _jsx(TextControl, { label: __('Search Keyword', 'jankx'), value: keyword, onChange: (value) => setAttributes({ keyword: value }), help: __('Search by title, content, excerpt', 'jankx'), placeholder: __('Enter keyword...', 'jankx') }) })), queryPreset === 'custom' && authors.length > 0 && (_jsxs(PanelBody, { title: __('👤 Author Filters', 'jankx'), initialOpen: false, children: [_jsx(BaseControl, { label: __('Authors (Include)', 'jankx'), help: __('Only display posts from these authors', 'jankx'), children: _jsx(FormTokenField, { value: authors.filter((author) => authorIn.includes(author.id)).map((author) => author.name), suggestions: authors.map((author) => author.name), onChange: (tokens) => {
                                        const normalizedTokens = normalizeTokens(tokens);
                                        const selectedIds = normalizedTokens
                                            .map((tokenName) => {
                                            const author = authors.find((item) => item.name === tokenName);
                                            return author?.id ?? 0;
                                        })
                                            .filter((id) => id > 0);
                                        setAttributes({ authorIn: selectedIds });
                                    } }) }), _jsx(BaseControl, { label: __('Authors (Exclude)', 'jankx'), help: __('Exclude posts from these authors', 'jankx'), children: _jsx(FormTokenField, { value: authors.filter((author) => authorNotIn.includes(author.id)).map((author) => author.name), suggestions: authors.map((author) => author.name), onChange: (tokens) => {
                                        const normalizedTokens = normalizeTokens(tokens);
                                        const selectedIds = normalizedTokens
                                            .map((tokenName) => {
                                            const author = authors.find((item) => item.name === tokenName);
                                            return author?.id ?? 0;
                                        })
                                            .filter((id) => id > 0);
                                        setAttributes({ authorNotIn: selectedIds });
                                    } }) })] })), queryPreset === 'custom' && (_jsxs(PanelBody, { title: __('🔢 Post ID Filters', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Post IDs (Include)', 'jankx'), value: postIn.join(', '), onChange: (value) => {
                                    const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                    setAttributes({ postIn: ids });
                                }, help: __('Only display posts with these IDs (comma separated)', 'jankx'), placeholder: __('Example: 1, 2, 3', 'jankx') }), _jsx(TextControl, { label: __('Post IDs (Exclude)', 'jankx'), value: postNotIn.join(', '), onChange: (value) => {
                                    const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                    setAttributes({ postNotIn: ids });
                                }, help: __('Exclude posts with these IDs (comma separated)', 'jankx'), placeholder: __('Example: 4, 5, 6', 'jankx') })] })), queryPreset === 'custom' && (_jsxs(PanelBody, { title: __('⚙️ Meta Query Filters', 'jankx'), initialOpen: false, children: [_jsx(Button, { variant: "primary", onClick: () => {
                                    const newMetaQuery = [...metaQuery];
                                    newMetaQuery.push({
                                        key: '',
                                        value: '',
                                        compare: '=',
                                    });
                                    setAttributes({ metaQuery: newMetaQuery });
                                }, children: __('+ Add Meta Query', 'jankx') }), metaQuery.map((mq, index) => (_jsxs("div", { style: { marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }, children: [_jsxs("strong", { children: [__('Meta Query', 'jankx'), " #", index + 1] }), _jsx(Button, { isDestructive: true, isSmall: true, onClick: () => {
                                                    const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                                                    setAttributes({ metaQuery: newMetaQuery });
                                                }, children: __('Remove', 'jankx') })] }), _jsx(TextControl, { label: __('Meta Key', 'jankx'), value: mq.key, onChange: (value) => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            newMetaQuery[index] = {
                                                ...targetQuery,
                                                key: value,
                                            };
                                            setAttributes({ metaQuery: newMetaQuery });
                                        }, placeholder: __('Example: price, rating, views', 'jankx') }), _jsx(SelectControl, { label: __('Compare', 'jankx'), value: mq.compare, options: [
                                            { label: '= (Equal)', value: '=' },
                                            { label: '!= (Not Equal)', value: '!=' },
                                            { label: '> (Greater Than)', value: '>' },
                                            { label: '>= (Greater or Equal)', value: '>=' },
                                            { label: '< (Less Than)', value: '<' },
                                            { label: '<= (Less or Equal)', value: '<=' },
                                            { label: 'LIKE (Contains)', value: 'LIKE' },
                                            { label: 'NOT LIKE (Not Contains)', value: 'NOT LIKE' },
                                            { label: 'IN (In List)', value: 'IN' },
                                            { label: 'NOT IN (Not In List)', value: 'NOT IN' },
                                            { label: 'EXISTS (Exists)', value: 'EXISTS' },
                                            { label: 'NOT EXISTS (Not Exists)', value: 'NOT EXISTS' },
                                        ], onChange: (value) => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            newMetaQuery[index] = {
                                                ...targetQuery,
                                                compare: value,
                                            };
                                            setAttributes({ metaQuery: newMetaQuery });
                                        } }), !['EXISTS', 'NOT EXISTS'].includes(mq.compare) && (_jsx(TextControl, { label: __('Value', 'jankx'), value: mq.value, onChange: (value) => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            newMetaQuery[index] = {
                                                ...targetQuery,
                                                value,
                                            };
                                            setAttributes({ metaQuery: newMetaQuery });
                                        }, placeholder: __('Enter value...', 'jankx') })), _jsx(SelectControl, { label: __('Type (Optional)', 'jankx'), value: mq.type || '', options: [
                                            { label: __('-- Auto --', 'jankx'), value: '' },
                                            { label: 'NUMERIC', value: 'NUMERIC' },
                                            { label: 'BINARY', value: 'BINARY' },
                                            { label: 'CHAR', value: 'CHAR' },
                                            { label: 'DATE', value: 'DATE' },
                                            { label: 'DATETIME', value: 'DATETIME' },
                                            { label: 'DECIMAL', value: 'DECIMAL' },
                                            { label: 'TIME', value: 'TIME' },
                                            { label: 'SIGNED', value: 'SIGNED' },
                                            { label: 'UNSIGNED', value: 'UNSIGNED' },
                                        ], onChange: (value) => {
                                            const newMetaQuery = [...metaQuery];
                                            const targetQuery = newMetaQuery[index];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            const updatedQuery = { ...targetQuery };
                                            const nextType = value ? value : undefined;
                                            if (nextType) {
                                                updatedQuery.type = nextType;
                                            }
                                            else if ('type' in updatedQuery) {
                                                delete updatedQuery.type;
                                            }
                                            newMetaQuery[index] = updatedQuery;
                                            setAttributes({ metaQuery: newMetaQuery });
                                        }, help: __('Specify data type for accurate comparison', 'jankx') })] }, index)))] })), queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map((taxonomy) => {
                        // Find existing query for this taxonomy
                        const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
                        const hasQuery = existingQueryIndex >= 0;
                        const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : undefined;
                        const terms = taxonomyTerms[taxonomy.slug];
                        return (_jsx(PanelBody, { title: `🏷️ ${taxonomy.name}`, initialOpen: hasQuery, onToggle: (isOpen) => {
                                if (isOpen) {
                                    // Fetch terms when panel opens
                                    fetchTermsForTaxonomy(taxonomy.slug);
                                }
                            }, children: !hasQuery ? (_jsxs(Button, { variant: "secondary", onClick: () => {
                                    const newTaxQuery = [...taxQuery];
                                    newTaxQuery.push({
                                        taxonomy: taxonomy.slug,
                                        terms: [],
                                        operator: 'IN'
                                    });
                                    setAttributes({ taxQuery: newTaxQuery });
                                    fetchTermsForTaxonomy(taxonomy.slug);
                                }, children: [__('Add Filter', 'jankx'), " ", taxonomy.name] })) : (currentQuery && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Operator', 'jankx'), value: currentQuery.operator, options: [
                                            { label: __('IN (Include)', 'jankx'), value: 'IN' },
                                            { label: __('NOT IN (Exclude)', 'jankx'), value: 'NOT IN' },
                                            { label: __('AND (Must Have All)', 'jankx'), value: 'AND' },
                                            { label: __('EXISTS (Has Terms)', 'jankx'), value: 'EXISTS' },
                                            { label: __('NOT EXISTS (No Terms)', 'jankx'), value: 'NOT EXISTS' },
                                        ], onChange: (value) => {
                                            const newTaxQuery = [...taxQuery];
                                            const targetQuery = newTaxQuery[existingQueryIndex];
                                            if (!targetQuery) {
                                                return;
                                            }
                                            newTaxQuery[existingQueryIndex] = {
                                                ...targetQuery,
                                                operator: value,
                                            };
                                            setAttributes({ taxQuery: newTaxQuery });
                                        }, help: __('EXISTS/NOT EXISTS checks if taxonomy has any terms', 'jankx') }), !['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && (_jsx(_Fragment, { children: terms ? (_jsx(BaseControl, { label: __('Select Terms', 'jankx'), help: __('Select terms from dropdown', 'jankx'), children: _jsx(FormTokenField, { value: terms
                                                    .filter((term) => currentQuery.terms.includes(term.id))
                                                    .map((term) => term.name), suggestions: terms.map((term) => term.name), onChange: (tokens) => {
                                                    const selectedNames = normalizeTokens(tokens);
                                                    const selectedIds = selectedNames
                                                        .map((tokenName) => {
                                                        const term = terms.find((item) => item.name === tokenName);
                                                        return term?.id ?? 0;
                                                    })
                                                        .filter((id) => id > 0);
                                                    const newTaxQuery = [...taxQuery];
                                                    const targetQuery = newTaxQuery[existingQueryIndex];
                                                    if (!targetQuery) {
                                                        return;
                                                    }
                                                    newTaxQuery[existingQueryIndex] = {
                                                        ...targetQuery,
                                                        terms: selectedIds,
                                                    };
                                                    setAttributes({ taxQuery: newTaxQuery });
                                                } }) })) : (_jsx(Spinner, {})) })), _jsx(Button, { isDestructive: true, variant: "secondary", onClick: () => {
                                            const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                                            setAttributes({ taxQuery: newTaxQuery });
                                        }, style: { marginTop: '10px' }, children: __('Remove Filter', 'jankx') })] }))) }, taxonomy.slug));
                    })] }), _jsx("div", { ...blockProps, children: previewHtml ? (layout === 'carousel' ? (
                // For carousel, previewHtml already contains full structure from PHP
                // Structure: div.post-type-layout-carousel -> div.embla__viewport -> div.embla__container -> div.embla__slide items
                _jsx("div", { ref: carouselViewportRef, dangerouslySetInnerHTML: { __html: previewHtml } })) : (_jsx("div", { dangerouslySetInnerHTML: { __html: previewHtml } }))) : (
                // Show InnerBlocks for editing when preview is not ready
                _jsx(InnerBlocks, { templateLock: false, renderAppender: InnerBlocks.ButtonBlockAppender, allowedBlocks: ['jankx/post-layout-template'] })) })] }));
}
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
