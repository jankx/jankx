import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl, CheckboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
export default function Edit({ attributes, setAttributes, context }) {
    const { postTypes, taxonomy, displayStyle, separator, layout, linkToTerm, termTextColor, termBackgroundColor, style } = attributes;
    const { postId, postType: contextPostType } = context;
    // Manually extract blockGap for real-time preview in editor
    const blockGap = style?.spacing?.blockGap;
    const blockProps = useBlockProps({
        className: `display-style-${displayStyle} layout-${layout}`,
        style: {
            gap: blockGap,
        }
    });
    // Get all public post types
    const allPostTypes = useSelect((select) => {
        return select('core').getPostTypes({ per_page: -1 });
    }, []);
    const postTypeOptions = useMemo(() => {
        if (!allPostTypes)
            return [];
        return allPostTypes
            .filter((pt) => pt.viewable || pt.slug === 'post' || pt.slug === 'page')
            .map((pt) => ({
            label: pt.name,
            value: pt.slug,
        }));
    }, [allPostTypes]);
    // Get all taxonomies
    const allTaxonomies = useSelect((select) => {
        return select('core').getTaxonomies({ per_page: -1 });
    }, []);
    const taxonomyOptions = useMemo(() => {
        if (!allTaxonomies)
            return [];
        const filterTypes = postTypes.length > 0 ? postTypes : (contextPostType ? [contextPostType] : []);
        return allTaxonomies
            .filter((tax) => {
            if (filterTypes.length === 0)
                return true;
            return tax.types.some((type) => filterTypes.includes(type));
        })
            .map((tax) => ({
            label: tax.name,
            value: tax.slug,
        }));
    }, [allTaxonomies, postTypes, contextPostType]);
    // Mock terms for preview
    const terms = useSelect((select) => {
        if (!postId)
            return null;
        return select('core').getEntityRecords('taxonomy', taxonomy, { post: postId });
    }, [postId, taxonomy]);
    const displayTerms = useMemo(() => {
        if (terms && Array.isArray(terms) && terms.length > 0) {
            return terms;
        }
        return [
            { id: 1, name: __('Sample Term 1', 'jankx'), slug: 'sample-1' },
            { id: 2, name: __('Sample Term 2', 'jankx'), slug: 'sample-2' },
        ];
    }, [terms]);
    const termStyle = {
        color: termTextColor,
        backgroundColor: termBackgroundColor,
        padding: termBackgroundColor ? '2px 8px' : undefined,
        borderRadius: termBackgroundColor ? '4px' : undefined,
    };
    return (_jsxs(_Fragment, { children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Post Types Filter', 'jankx'), children: [_jsx("p", { style: { marginBottom: '10px', fontSize: '12px', color: '#666' }, children: __('Chỉnh bộ lọc này để giới hạn danh sách Taxonomy bên dưới.', 'jankx') }), postTypeOptions.map((option) => (_jsx(CheckboxControl, { label: option.label, checked: postTypes.includes(option.value), onChange: (checked) => {
                                    const nextPostTypes = checked
                                        ? [...postTypes, option.value]
                                        : postTypes.filter((t) => t !== option.value);
                                    setAttributes({ postTypes: nextPostTypes });
                                } }, option.value)))] }), _jsxs(PanelBody, { title: __('Display Settings', 'jankx'), children: [_jsx(SelectControl, { label: __('Taxonomy', 'jankx'), value: taxonomy, options: taxonomyOptions, onChange: (value) => setAttributes({ taxonomy: value }) }), _jsx(SelectControl, { label: __('Display Style', 'jankx'), value: displayStyle, options: [
                                    { label: __('Default (WordPress)', 'jankx'), value: 'default' },
                                    { label: __('Hash Tag (Twitter)', 'jankx'), value: 'hashtag' },
                                ], onChange: (value) => setAttributes({ displayStyle: value }) }), layout === 'inline' && (_jsx(TextControl, { label: __('Separator', 'jankx'), value: separator, onChange: (value) => setAttributes({ separator: value }) })), _jsx(SelectControl, { label: __('Layout', 'jankx'), value: layout, options: [
                                    { label: __('Inline', 'jankx'), value: 'inline' },
                                    { label: __('One per line', 'jankx'), value: 'newline' },
                                ], onChange: (value) => setAttributes({ layout: value }) }), _jsx(ToggleControl, { label: __('Link to Term', 'jankx'), checked: linkToTerm, onChange: (value) => setAttributes({ linkToTerm: value }) })] }), _jsx(PanelColorSettings, { title: __('Term Colors', 'jankx'), initialOpen: false, colorSettings: [
                            {
                                value: termTextColor || '',
                                onChange: (value) => setAttributes({ termTextColor: value || undefined }),
                                label: __('Term Text Color', 'jankx'),
                            },
                            {
                                value: termBackgroundColor || '',
                                onChange: (value) => setAttributes({ termBackgroundColor: value || undefined }),
                                label: __('Term Background Color', 'jankx'),
                            },
                        ] })] }), _jsx("div", { ...blockProps, children: displayTerms.map((term, index) => (_jsxs("span", { className: "jankx-post-term", style: termStyle, children: [displayStyle === 'hashtag' ? '#' : '', term.name, index < displayTerms.length - 1 && layout === 'inline' ? (_jsx("span", { className: "jankx-post-term-separator", style: { color: 'initial', backgroundColor: 'transparent', padding: 0 }, children: separator })) : null] }, term.id))) })] }));
}
