import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl, CheckboxControl, RangeControl, } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
function Edit({ attributes, setAttributes }) {
    const { placeholder, showPostTypeFilter, postTypes, showTaxonomyFilter, taxonomies, enableAutoSuggestion, showPosts, showPostTypes, showUsers, showTaxonomy, showTags, suggestionLimit, iconPosition, showIcon, showLabel, labelText, buttonPosition, searchUrl, } = attributes;
    const [availablePostTypes, setAvailablePostTypes] = useState([]);
    const [availableTaxonomies, setAvailableTaxonomies] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get REST API base URL
                const restUrl = window.wp?.apiSettings?.root || '/wp-json/';
                const namespace = 'jankx/v1';
                // Fetch post types with their taxonomies
                const postTypesResponse = await fetch(`${restUrl}${namespace}/smart-search/post-types`);
                if (postTypesResponse.ok) {
                    const postTypesData = await postTypesResponse.json();
                    const postTypesList = postTypesData.map((pt) => ({
                        label: pt.label || pt.name,
                        value: pt.name,
                        taxonomies: pt.taxonomies || [],
                    }));
                    setAvailablePostTypes(postTypesList);
                }
                // Fetch taxonomies with their post types
                const taxonomiesResponse = await fetch(`${restUrl}${namespace}/smart-search/taxonomies`);
                if (taxonomiesResponse.ok) {
                    const taxonomiesData = await taxonomiesResponse.json();
                    const taxonomiesList = taxonomiesData.map((tax) => ({
                        label: tax.label || tax.name,
                        value: tax.name,
                        postTypes: tax.post_types || [],
                    }));
                    setAvailableTaxonomies(taxonomiesList);
                }
            }
            catch (error) {
                console.error('Error fetching post types and taxonomies:', error);
                // Fallback to defaults
                setAvailablePostTypes([
                    { label: __('Posts', 'jankx'), value: 'post', taxonomies: [] },
                    { label: __('Pages', 'jankx'), value: 'page', taxonomies: [] },
                ]);
                setAvailableTaxonomies([
                    { label: __('Categories', 'jankx'), value: 'category', postTypes: [] },
                    { label: __('Tags', 'jankx'), value: 'post_tag', postTypes: [] },
                ]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const blockProps = useBlockProps({
        className: 'wp-block-jankx-smart-search-editor',
    });
    // Filter taxonomies based on selected post types for filter
    const filteredTaxonomies = useMemo(() => {
        if (postTypes.length === 0) {
            // If no post types selected, show all available taxonomies
            return availableTaxonomies;
        }
        // Only show taxonomies that are associated with at least one selected post type
        return availableTaxonomies.filter((tax) => {
            // Check if taxonomy is associated with any selected post type
            return tax.postTypes.some((pt) => postTypes.includes(pt.name));
        });
    }, [availableTaxonomies, postTypes]);
    // Filter taxonomies for suggestion based on selected post types
    const filteredTaxonomiesForSuggestion = useMemo(() => {
        if (postTypes.length === 0) {
            return availableTaxonomies;
        }
        return availableTaxonomies.filter((tax) => {
            // Check if taxonomy is associated with any selected post type
            return tax.postTypes.some((pt) => postTypes.includes(pt.name));
        });
    }, [availableTaxonomies, postTypes]);
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Search Settings', 'jankx'), initialOpen: true, children: [_jsx(TextControl, { label: __('Placeholder', 'jankx'), value: placeholder, onChange: (value) => setAttributes({ placeholder: value || 'Search...' }) }), _jsx(TextControl, { label: __('Search URL', 'jankx'), value: searchUrl, onChange: (value) => setAttributes({ searchUrl: value }), help: __('Leave empty to use default WordPress search URL', 'jankx') })] }), _jsxs(PanelBody, { title: __('Filter Options', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Post Type Filter', 'jankx'), checked: showPostTypeFilter, onChange: (value) => setAttributes({ showPostTypeFilter: value }) }), showPostTypeFilter && availablePostTypes.length > 0 && (_jsxs("div", { style: { marginTop: '16px', marginBottom: '16px' }, children: [_jsx("strong", { children: __('Select Post Types for Filter:', 'jankx') }), _jsx("div", { style: { marginLeft: '8px', marginTop: '8px' }, children: availablePostTypes.map((pt) => (_jsx(CheckboxControl, { label: pt.label, checked: postTypes.includes(pt.value), onChange: (checked) => {
                                                if (checked) {
                                                    setAttributes({
                                                        postTypes: [...postTypes, pt.value]
                                                    });
                                                }
                                                else {
                                                    const newPostTypes = postTypes.filter((p) => p !== pt.value);
                                                    setAttributes({
                                                        postTypes: newPostTypes
                                                    });
                                                }
                                            } }, pt.value))) })] })), _jsx(ToggleControl, { label: __('Show Taxonomy Filter', 'jankx'), checked: showTaxonomyFilter, onChange: (value) => setAttributes({ showTaxonomyFilter: value }) }), showTaxonomyFilter && (_jsx("div", { style: { marginTop: '16px', marginBottom: '16px' }, children: postTypes.length === 0 ? (_jsx("div", { style: { padding: '8px', background: '#fff3cd', borderRadius: '4px', color: '#856404' }, children: __('Please select post types first to see available taxonomies', 'jankx') })) : filteredTaxonomies.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("strong", { children: __('Select Taxonomies for Filter:', 'jankx') }), _jsx("div", { style: { marginLeft: '8px', marginTop: '8px' }, children: filteredTaxonomies.map((tax) => (_jsx(CheckboxControl, { label: tax.label, checked: taxonomies.includes(tax.value), onChange: (checked) => {
                                                    if (checked) {
                                                        setAttributes({
                                                            taxonomies: [...taxonomies, tax.value]
                                                        });
                                                    }
                                                    else {
                                                        const newTaxonomies = taxonomies.filter((t) => t !== tax.value);
                                                        setAttributes({
                                                            taxonomies: newTaxonomies
                                                        });
                                                    }
                                                } }, tax.value))) })] })) : (_jsx("div", { style: { padding: '8px', background: '#f8d7da', borderRadius: '4px', color: '#721c24' }, children: __('No taxonomies available for selected post types', 'jankx') })) }))] }), _jsxs(PanelBody, { title: __('Auto Suggestion', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Enable Auto Suggestion', 'jankx'), checked: enableAutoSuggestion, onChange: (value) => setAttributes({ enableAutoSuggestion: value }) }), enableAutoSuggestion && (_jsxs(_Fragment, { children: [_jsx(RangeControl, { label: __('Suggestion Limit', 'jankx'), value: suggestionLimit, onChange: (value) => setAttributes({ suggestionLimit: value || 10 }), min: 1, max: 50 }), _jsxs("div", { style: { marginTop: '16px' }, children: [_jsx("strong", { children: __('Show in Suggestions:', 'jankx') }), availablePostTypes.length > 0 && (_jsx("div", { style: { marginLeft: '8px', marginTop: '8px' }, children: availablePostTypes.map((pt) => (_jsx(CheckboxControl, { label: pt.label, checked: showPosts && postTypes.includes(pt.value), onChange: (checked) => {
                                                        if (checked) {
                                                            // If enabling this post type, ensure showPosts is true
                                                            setAttributes({
                                                                postTypes: [...postTypes, pt.value],
                                                                showPosts: true
                                                            });
                                                        }
                                                        else {
                                                            // If disabling, remove from postTypes but keep showPosts if others remain
                                                            const newPostTypes = postTypes.filter((p) => p !== pt.value);
                                                            setAttributes({
                                                                postTypes: newPostTypes,
                                                                showPosts: newPostTypes.length > 0
                                                            });
                                                        }
                                                    } }, pt.value))) })), _jsx(CheckboxControl, { label: __('Users', 'jankx'), checked: showUsers, onChange: (value) => setAttributes({ showUsers: value }) }), filteredTaxonomiesForSuggestion.length > 0 && (_jsx("div", { style: { marginLeft: '8px', marginTop: '8px' }, children: filteredTaxonomiesForSuggestion.map((tax) => (_jsx(CheckboxControl, { label: tax.label, checked: showTaxonomy && taxonomies.includes(tax.value), onChange: (checked) => {
                                                        if (checked) {
                                                            setAttributes({
                                                                taxonomies: [...taxonomies, tax.value],
                                                                showTaxonomy: true
                                                            });
                                                        }
                                                        else {
                                                            const newTaxonomies = taxonomies.filter((t) => t !== tax.value);
                                                            setAttributes({
                                                                taxonomies: newTaxonomies,
                                                                showTaxonomy: newTaxonomies.length > 0
                                                            });
                                                        }
                                                    } }, tax.value))) }))] })] }))] }), _jsxs(PanelBody, { title: __('Display Options', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Show Label', 'jankx'), checked: showLabel, onChange: (value) => setAttributes({ showLabel: value }) }), showLabel && (_jsx(TextControl, { label: __('Label Text', 'jankx'), value: labelText, onChange: (value) => setAttributes({ labelText: value || 'Search' }) })), _jsx(ToggleControl, { label: __('Show Icon', 'jankx'), checked: showIcon, onChange: (value) => setAttributes({ showIcon: value }) }), showIcon && (_jsx(SelectControl, { label: __('Icon Position', 'jankx'), value: iconPosition, options: [
                                    { label: __('Inside Input', 'jankx'), value: 'inside' },
                                    { label: __('Outside Input', 'jankx'), value: 'outside' },
                                ], onChange: (value) => setAttributes({ iconPosition: value }) })), _jsx(SelectControl, { label: __('Button Position', 'jankx'), value: buttonPosition, options: [
                                    { label: __('Inside Input', 'jankx'), value: 'inside' },
                                    { label: __('Outside Input', 'jankx'), value: 'outside' },
                                ], onChange: (value) => setAttributes({ buttonPosition: value }), help: __('Search button will always appear at the end of the layout', 'jankx') })] })] }), _jsx("div", { ...blockProps, children: _jsx("div", { className: "smart-search-form-wrapper", children: _jsxs("form", { className: "smart-search-form", method: "get", children: [showLabel && (_jsx("label", { className: "search-label", children: labelText })), _jsxs("div", { className: `search-input-wrapper ${iconPosition === 'inside' ? 'icon-inside' : 'icon-outside'} ${buttonPosition === 'inside' ? 'button-inside' : 'button-outside'}`, children: [showIcon && iconPosition === 'outside' && (_jsx("span", { className: "search-icon-outside", children: "\uD83D\uDD0D" })), (showPostTypeFilter || showTaxonomyFilter) && (_jsxs("div", { className: "search-filters-wrapper", children: [showPostTypeFilter && (_jsxs("select", { className: "post-type-filter", disabled: true, children: [_jsx("option", { children: __('All Post Types', 'jankx') }), postTypes.length > 0 && postTypes.map((postType) => (_jsx("option", { value: postType, children: postType }, postType)))] })), showTaxonomyFilter && (_jsxs("select", { className: "taxonomy-filter", disabled: true, children: [_jsx("option", { children: __('All Taxonomies', 'jankx') }), taxonomies.length > 0 && taxonomies.map((taxonomy) => (_jsx("option", { value: taxonomy, children: taxonomy }, taxonomy)))] }))] })), _jsxs("div", { className: "search-input-inner", children: [showIcon && iconPosition === 'inside' && (_jsx("span", { className: "search-icon-inside", children: "\uD83D\uDD0D" })), _jsx("input", { type: "text", className: "search-input", placeholder: placeholder, disabled: true }), buttonPosition === 'inside' && (_jsx("button", { type: "submit", className: "search-button", children: __('Search', 'jankx') }))] }), buttonPosition === 'outside' && (_jsx("button", { type: "submit", className: "search-button", children: __('Search', 'jankx') }))] })] }) }) })] }));
}
export default Edit;
