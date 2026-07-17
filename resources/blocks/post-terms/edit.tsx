import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl, CheckboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

interface PostTermsAttributes {
    postTypes: string[];
    taxonomy: string;
    displayStyle: 'default' | 'hashtag';
    separator: string;
    layout: 'inline' | 'newline';
    linkToTerm: boolean;
    termTextColor: string | undefined;
    termBackgroundColor: string | undefined;
}

interface EditProps {
    attributes: PostTermsAttributes;
    setAttributes: (attrs: Partial<PostTermsAttributes>) => void;
    context: {
        postId?: number;
        postType?: string;
    };
}

export default function Edit({ attributes, setAttributes, context }: EditProps) {
    const {
        postTypes,
        taxonomy,
        displayStyle,
        separator,
        layout,
        linkToTerm,
        termTextColor,
        termBackgroundColor,
        style
    } = attributes as any;
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
    const allPostTypes = useSelect((select: any) => {
        return select('core').getPostTypes({ per_page: -1 });
    }, []);

    const postTypeOptions = useMemo(() => {
        if (!allPostTypes) return [];
        return allPostTypes
            .filter((pt: any) => pt.viewable || pt.slug === 'post' || pt.slug === 'page')
            .map((pt: any) => ({
                label: pt.name,
                value: pt.slug,
            }));
    }, [allPostTypes]);

    // Get all taxonomies
    const allTaxonomies = useSelect((select: any) => {
        return select('core').getTaxonomies({ per_page: -1 });
    }, []);

    const taxonomyOptions = useMemo(() => {
        if (!allTaxonomies) return [];

        const filterTypes = postTypes.length > 0 ? postTypes : (contextPostType ? [contextPostType] : []);

        return allTaxonomies
            .filter((tax: any) => {
                if (filterTypes.length === 0) return true;
                return tax.types.some((type: string) => filterTypes.includes(type));
            })
            .map((tax: any) => ({
                label: tax.name,
                value: tax.slug,
            }));
    }, [allTaxonomies, postTypes, contextPostType]);

    // Mock terms for preview
    const terms = useSelect((select: any) => {
        if (!postId) return null;
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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Post Types Filter', 'jankx')}>
                    <p style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                        {__('Chỉnh bộ lọc này để giới hạn danh sách Taxonomy bên dưới.', 'jankx')}
                    </p>
                    {postTypeOptions.map((option: any) => (
                        <CheckboxControl
                            key={option.value}
                            label={option.label}
                            checked={postTypes.includes(option.value)}
                            onChange={(checked) => {
                                const nextPostTypes = checked
                                    ? [...postTypes, option.value]
                                    : postTypes.filter((t) => t !== option.value);
                                setAttributes({ postTypes: nextPostTypes });
                            }}
                        />
                    ))}
                </PanelBody>
                <PanelBody title={__('Display Settings', 'jankx')}>
                    <SelectControl
                        label={__('Taxonomy', 'jankx')}
                        value={taxonomy}
                        options={taxonomyOptions}
                        onChange={(value) => setAttributes({ taxonomy: value })}
                    />
                    <SelectControl
                        label={__('Display Style', 'jankx')}
                        value={displayStyle}
                        options={[
                            { label: __('Default (WordPress)', 'jankx'), value: 'default' },
                            { label: __('Hash Tag (Twitter)', 'jankx'), value: 'hashtag' },
                        ]}
                        onChange={(value) => setAttributes({ displayStyle: value as any })}
                    />
                    {layout === 'inline' && (
                        <TextControl
                            label={__('Separator', 'jankx')}
                            value={separator}
                            onChange={(value) => setAttributes({ separator: value })}
                        />
                    )}
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={layout}
                        options={[
                            { label: __('Inline', 'jankx'), value: 'inline' },
                            { label: __('One per line', 'jankx'), value: 'newline' },
                        ]}
                        onChange={(value) => setAttributes({ layout: value as any })}
                    />
                    <ToggleControl
                        label={__('Link to Term', 'jankx')}
                        checked={linkToTerm}
                        onChange={(value) => setAttributes({ linkToTerm: value })}
                    />
                </PanelBody>
                <PanelColorSettings
                    title={__('Term Colors', 'jankx')}
                    initialOpen={false}
                    colorSettings={[
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
                    ]}
                />
            </InspectorControls>

            <div {...blockProps}>
                {displayTerms.map((term: any, index: number) => (
                    <span key={term.id} className="jankx-post-term" style={termStyle}>
                        {displayStyle === 'hashtag' ? '#' : ''}
                        {term.name}
                        {index < displayTerms.length - 1 && layout === 'inline' ? (
                            <span className="jankx-post-term-separator" style={{ color: 'initial', backgroundColor: 'transparent', padding: 0 }}>
                                {separator}
                            </span>
                        ) : null}
                    </span>
                ))}
            </div>
        </>
    );
}
