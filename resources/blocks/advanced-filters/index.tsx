import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    TextControl,
    Button,
    Placeholder,
    Spinner,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
// Import styles - editor.scss already imports style.scss
import './editor.scss';

interface AdvancedFiltersAttributes {
    targetBlockIds: string[];
    filterType: 'taxonomy' | 'meta' | 'price' | 'date' | 'author' | 'keyword' | 'mixed';
    layout: 'horizontal' | 'vertical' | 'dropdown' | 'accordion';
    showLabels: boolean;
    showResetButton: boolean;
    resetButtonText: string;
    ajaxEnabled: boolean;
    updateUrl: boolean;
    scrollToResults: boolean;
    taxonomyFilters: any[];
    metaFilters: any[];
    priceFilters: any[];
    dateFilters: any[];
    authorFilters: any[];
    keywordFilter: {
        enabled: boolean;
        placeholder: string;
    };
    displayStyle: 'buttons' | 'checkboxes' | 'dropdown' | 'select';
    showCount: boolean;
    showEmptyTerms: boolean;
    showOnlyTopLevel: boolean;
    showHierarchy: boolean;
    displayAsDropdown: boolean;
    multipleSelection: boolean;
    collapsible: boolean;
    defaultExpanded: boolean;
}

interface EditProps {
    attributes: AdvancedFiltersAttributes;
    setAttributes: (attrs: Partial<AdvancedFiltersAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes }: EditProps) {
    const {
        targetBlockIds,
        filterType,
        layout,
        showLabels,
        showResetButton,
        resetButtonText,
        ajaxEnabled,
        updateUrl,
        scrollToResults,
        taxonomyFilters,
        metaFilters,
        priceFilters,
        dateFilters,
        authorFilters,
        keywordFilter,
        displayStyle,
        showCount,
        showEmptyTerms,
        showOnlyTopLevel,
        showHierarchy,
        displayAsDropdown,
        multipleSelection,
        collapsible,
        defaultExpanded,
    } = attributes;

    const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [postTypes, setPostTypes] = useState<any[]>([]);
    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    const [selectedPostType, setSelectedPostType] = useState<string>('post');

    const blockProps = useBlockProps({
        className: `advanced-filters-block layout-${layout} display-${displayStyle}`,
    });

    // Helper function to find post-type-layout blocks recursively
    const findPostTypeLayoutBlocks = (blocks: any[]): any[] => {
        const found: any[] = [];
        
        const traverse = (blockList: any[]) => {
            blockList.forEach((block) => {
                if (block.name === 'jankx/post-type-layout') {
                    const queryId = block.attributes?.queryId || block.clientId;
                    found.push({
                        id: String(queryId || block.clientId),
                        name: `${block.attributes?.postType || 'post'} Layout`,
                        source: 'current_page',
                    });
                }
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    traverse(block.innerBlocks);
                }
            });
        };
        
        traverse(blocks);
        return found;
    };

    // Get available post-type-layout blocks from current page only
    useEffect(() => {
        const getAvailableBlocks = () => {
            setLoadingBlocks(true);
            try {
                // Get blocks from current page/post context only
                const currentBlocks = (window as any).wp.data.select('core/block-editor').getBlocks();
                if (currentBlocks && currentBlocks.length > 0) {
                    const postTypeLayoutBlocks = findPostTypeLayoutBlocks(currentBlocks);
                    setAvailableBlocks(postTypeLayoutBlocks);
                } else {
                    setAvailableBlocks([]);
                }
            } catch (error) {
                console.error('Error getting blocks from current page:', error);
                setAvailableBlocks([]);
            } finally {
                setLoadingBlocks(false);
            }
        };

        // Get blocks immediately
        getAvailableBlocks();

        // Subscribe to block changes to update list when blocks are added/removed
        let timeoutId: NodeJS.Timeout | null = null;
        const unsubscribe = (window as any).wp.data.subscribe(() => {
            // Debounce to avoid too many updates
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const currentBlocks = (window as any).wp.data.select('core/block-editor').getBlocks();
                if (currentBlocks) {
                    const postTypeLayoutBlocks = findPostTypeLayoutBlocks(currentBlocks);
                    setAvailableBlocks(postTypeLayoutBlocks);
                }
            }, 300);
        });

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // Fetch post types
    useEffect(() => {
        const fetchPostTypes = async () => {
            try {
                const types = await (window as any).wp.data.select('core').getPostTypes({ per_page: -1 });
                setPostTypes(
                    types.filter((type: any) => type.viewable && type.slug !== 'attachment')
                );
            } catch (error) {
                console.error('Error fetching post types:', error);
            }
        };

        fetchPostTypes();
    }, []);

    // Fetch taxonomies for selected post type
    useEffect(() => {
        const fetchTaxonomies = async () => {
            if (!selectedPostType) return;

            try {
                const taxData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${selectedPostType}`,
                });
                setTaxonomies(Object.values(taxData || {}));
            } catch (error) {
                console.error('Error fetching taxonomies:', error);
                setTaxonomies([]);
            }
        };

        fetchTaxonomies();
    }, [selectedPostType]);

    const handleAddTaxonomyFilter = () => {
        setAttributes({
            taxonomyFilters: [
                ...taxonomyFilters,
                {
                    taxonomy: '',
                    label: '',
                    enabled: true,
                    multiple: multipleSelection,
                },
            ],
        });
    };

    const handleUpdateTaxonomyFilter = (index: number, updates: any) => {
        const newFilters = [...taxonomyFilters];
        newFilters[index] = { ...newFilters[index], ...updates };
        setAttributes({ taxonomyFilters: newFilters });
    };

    const handleRemoveTaxonomyFilter = (index: number) => {
        setAttributes({
            taxonomyFilters: taxonomyFilters.filter((_, i) => i !== index),
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Target Blocks', 'jankx')} initialOpen={true}>
                    {loadingBlocks ? (
                        <Spinner />
                    ) : (
                        <>
                            <p>{__('Select Post Type Layout blocks to filter:', 'jankx')}</p>
                            {availableBlocks.length === 0 ? (
                                <Placeholder>
                                    <p>{__('No Post Type Layout blocks found in this page. Add a Post Type Layout block to this page first.', 'jankx')}</p>
                                </Placeholder>
                            ) : (
                                <div style={{ marginTop: '10px' }}>
                                    <SelectControl
                                        label={__('Target Block(s)', 'jankx')}
                                        value={targetBlockIds.length > 0 ? targetBlockIds[0] : ''}
                                        options={[
                                            { label: __('-- Select Block --', 'jankx'), value: '' },
                                            ...availableBlocks.map((block: any) => ({
                                                label: `${block.name || `Block ${block.id}`}${block.source ? ` (${block.source})` : ''}`,
                                                value: block.id,
                                            })),
                                        ]}
                                        onChange={(value) => {
                                            if (value) {
                                                // Single selection for now, can be extended to multiple
                                                setAttributes({
                                                    targetBlockIds: [value],
                                                });
                                            } else {
                                                setAttributes({
                                                    targetBlockIds: [],
                                                });
                                            }
                                        }}
                                        help={__('Select the Post Type Layout block you want to filter.', 'jankx')}
                                    />
                                    {targetBlockIds.length > 0 && (
                                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f1', borderRadius: '4px' }}>
                                            <strong>{__('Selected:', 'jankx')}</strong>
                                            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                                {targetBlockIds.map((id) => {
                                                    const block = availableBlocks.find((b: any) => b.id === id);
                                                    return (
                                                        <li key={id}>
                                                            {block?.name || id}
                                                            {block?.source && ` (${block.source})`}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Filter Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Filter Type', 'jankx')}
                        value={filterType}
                        options={[
                            { label: __('Taxonomy', 'jankx'), value: 'taxonomy' },
                            { label: __('Meta Field', 'jankx'), value: 'meta' },
                            { label: __('Price', 'jankx'), value: 'price' },
                            { label: __('Date', 'jankx'), value: 'date' },
                            { label: __('Author', 'jankx'), value: 'author' },
                            { label: __('Keyword', 'jankx'), value: 'keyword' },
                            { label: __('Mixed (All Types)', 'jankx'), value: 'mixed' },
                        ]}
                        onChange={(value) => setAttributes({ filterType: value as any })}
                    />

                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={layout}
                        options={[
                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                            { label: __('Vertical', 'jankx'), value: 'vertical' },
                            { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                            { label: __('Accordion', 'jankx'), value: 'accordion' },
                        ]}
                        onChange={(value) => setAttributes({ layout: value as any })}
                    />

                    <SelectControl
                        label={__('Display Style', 'jankx')}
                        value={displayStyle}
                        options={[
                            { label: __('Buttons', 'jankx'), value: 'buttons' },
                            { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                            { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                            { label: __('Select', 'jankx'), value: 'select' },
                        ]}
                        onChange={(value) => setAttributes({ displayStyle: value as any })}
                    />

                    <ToggleControl
                        label={__('Show Labels', 'jankx')}
                        checked={showLabels}
                        onChange={(value) => setAttributes({ showLabels: value })}
                    />

                    <ToggleControl
                        label={__('Show Post Counts', 'jankx')}
                        checked={showCount}
                        onChange={(value) => setAttributes({ showCount: value })}
                        help={__('Show post count next to each filter option', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Empty Terms', 'jankx')}
                        checked={showEmptyTerms}
                        onChange={(value) => setAttributes({ showEmptyTerms: value })}
                        help={__('Show terms that have no posts', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Only Top Level Terms', 'jankx')}
                        checked={showOnlyTopLevel}
                        onChange={(value) => setAttributes({ showOnlyTopLevel: value })}
                        help={__('Show only parent terms', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Hierarchy', 'jankx')}
                        checked={showHierarchy}
                        onChange={(value) => setAttributes({ showHierarchy: value })}
                        help={__('Display terms with hierarchical structure', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Display as Dropdown', 'jankx')}
                        checked={displayAsDropdown}
                        onChange={(value) => setAttributes({ displayAsDropdown: value })}
                        help={__('Show terms in dropdown format', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Multiple Selection', 'jankx')}
                        checked={multipleSelection}
                        onChange={(value) => setAttributes({ multipleSelection: value })}
                        help={__('Allow users to select multiple filter options', 'jankx')}
                    />
                </PanelBody>

                {(filterType === 'taxonomy' || filterType === 'mixed') && (
                    <PanelBody title={__('Taxonomy Filters', 'jankx')} initialOpen={false}>
                        <SelectControl
                            label={__('Post Type', 'jankx')}
                            value={selectedPostType}
                            options={postTypes.map((type: any) => ({
                                label: type.name,
                                value: type.slug,
                            }))}
                            onChange={(value) => setSelectedPostType(value)}
                        />

                        <Button variant="primary" onClick={handleAddTaxonomyFilter} style={{ marginTop: '10px' }}>
                            {__('+ Add Taxonomy Filter', 'jankx')}
                        </Button>

                        {taxonomyFilters.map((filter, index) => (
                            <div key={index} style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <strong>{__('Taxonomy Filter', 'jankx')} #{index + 1}</strong>
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => handleRemoveTaxonomyFilter(index)}
                                    >
                                        {__('Remove', 'jankx')}
                                    </Button>
                                </div>

                                <SelectControl
                                    label={__('Taxonomy', 'jankx')}
                                    value={filter.taxonomy || ''}
                                    options={[
                                        { label: __('-- Select --', 'jankx'), value: '' },
                                        ...taxonomies.map((tax: any) => ({
                                            label: tax.name,
                                            value: tax.slug,
                                        })),
                                    ]}
                                    onChange={(value) => handleUpdateTaxonomyFilter(index, { taxonomy: value })}
                                />

                                <TextControl
                                    label={__('Label (Optional)', 'jankx')}
                                    value={filter.label || ''}
                                    onChange={(value) => handleUpdateTaxonomyFilter(index, { label: value })}
                                    placeholder={__('Leave empty to use taxonomy name', 'jankx')}
                                />

                                <ToggleControl
                                    label={__('Enabled', 'jankx')}
                                    checked={filter.enabled !== false}
                                    onChange={(value) => handleUpdateTaxonomyFilter(index, { enabled: value })}
                                />
                            </div>
                        ))}
                    </PanelBody>
                )}

                <PanelBody title={__('AJAX Settings', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Enable AJAX', 'jankx')}
                        checked={ajaxEnabled}
                        onChange={(value) => setAttributes({ ajaxEnabled: value })}
                        help={__('Update results without page reload', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Update URL', 'jankx')}
                        checked={updateUrl}
                        onChange={(value) => setAttributes({ updateUrl: value })}
                        help={__('Update browser URL with filter parameters', 'jankx')}
                        disabled={!ajaxEnabled}
                    />

                    <ToggleControl
                        label={__('Scroll to Results', 'jankx')}
                        checked={scrollToResults}
                        onChange={(value) => setAttributes({ scrollToResults: value })}
                        help={__('Scroll to target block after filtering', 'jankx')}
                        disabled={!ajaxEnabled}
                    />
                </PanelBody>

                <PanelBody title={__('Reset Button', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Reset Button', 'jankx')}
                        checked={showResetButton}
                        onChange={(value) => setAttributes({ showResetButton: value })}
                    />

                    {showResetButton && (
                        <TextControl
                            label={__('Reset Button Text', 'jankx')}
                            value={resetButtonText}
                            onChange={(value) => setAttributes({ resetButtonText: value })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {targetBlockIds.length === 0 ? (
                    <Placeholder icon="filter" label={__('Advanced Filters', 'jankx')}>
                        <p>{__('Please select at least one target block to filter in the sidebar.', 'jankx')}</p>
                    </Placeholder>
                ) : (
                    <div className="wp-block-jankx-advanced-filters-wrapper">
                        <ServerSideRender
                            block="jankx/advanced-filters"
                            attributes={attributes}
                            className="wp-block-jankx-advanced-filters"
                        />
                    </div>
                )}
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null, // Server-side rendering
} as any);

