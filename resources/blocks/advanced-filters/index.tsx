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
    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    
    // Get post type from target block
    const targetPostType = targetBlockIds.length > 0 && availableBlocks.length > 0
        ? availableBlocks.find(b => b.id === targetBlockIds[0])?.postType || 'post'
        : 'post';

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
                        postType: block.attributes?.postType || 'post',
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

    // Fetch taxonomies for target post type (from target block)
    useEffect(() => {
        const fetchTaxonomies = async () => {
            if (!targetPostType) return;

            try {
                const taxData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${targetPostType}`,
                });
                setTaxonomies(Object.values(taxData || {}));
            } catch (error) {
                console.error('Error fetching taxonomies:', error);
                setTaxonomies([]);
            }
        };

        fetchTaxonomies();
    }, [targetPostType]);

    const handleAddTaxonomyFilter = () => {
        setAttributes({
            taxonomyFilters: [
                ...taxonomyFilters,
                {
                    taxonomy: '',
                    label: '',
                    enabled: true,
                    filterType: filterType,
                    layout: layout,
                    showLabels: showLabels,
                    displayStyle: displayStyle,
                    listingType: 'ul', // Default listing type
                    showCount: showCount,
                    showEmptyTerms: showEmptyTerms,
                    showOnlyTopLevel: showOnlyTopLevel,
                    showHierarchy: showHierarchy,
                    displayAsDropdown: displayAsDropdown,
                    multipleSelection: multipleSelection,
                    collapsible: collapsible,
                    defaultExpanded: defaultExpanded,
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

                <PanelBody title={__('Filters', 'jankx')} initialOpen={false}>
                        {targetBlockIds.length === 0 ? (
                            <p style={{ color: '#d63638', marginBottom: '10px' }}>
                                {__('Please select a target block first to configure filters.', 'jankx')}
                            </p>
                        ) : (
                            <p style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
                                {__('Post Type:', 'jankx')} <strong>{targetPostType}</strong>
                            </p>
                        )}

                        <Button 
                            variant="primary" 
                            onClick={handleAddTaxonomyFilter} 
                            style={{ marginTop: '10px' }}
                            disabled={targetBlockIds.length === 0}
                        >
                            {__('+ Add Filter', 'jankx')}
                        </Button>

                        {taxonomyFilters.map((filter, index) => (
                            <PanelBody 
                                key={index} 
                                title={`${__('Filter', 'jankx')} #${index + 1}${filter.filterType ? ` - ${filter.filterType}` : ''}${filter.taxonomy ? ` (${filter.taxonomy})` : ''}`}
                                initialOpen={false}
                            >
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <strong>{__('Filter Configuration', 'jankx')}</strong>
                                        <Button
                                            isDestructive
                                            isSmall
                                            onClick={() => handleRemoveTaxonomyFilter(index)}
                                        >
                                            {__('Remove', 'jankx')}
                                        </Button>
                                    </div>

                    <SelectControl
                        label={__('Filter Type', 'jankx')}
                                        value={filter.filterType || filterType}
                        options={[
                            { label: __('Taxonomy', 'jankx'), value: 'taxonomy' },
                            { label: __('Meta Field', 'jankx'), value: 'meta' },
                            { label: __('Price', 'jankx'), value: 'price' },
                            { label: __('Date', 'jankx'), value: 'date' },
                            { label: __('Author', 'jankx'), value: 'author' },
                            { label: __('Keyword', 'jankx'), value: 'keyword' },
                                        ]}
                                        onChange={(value) => handleUpdateTaxonomyFilter(index, { filterType: value })}
                                    />

                                    <TextControl
                                        label={__('Label (Optional)', 'jankx')}
                                        value={filter.label || ''}
                                        onChange={(value) => handleUpdateTaxonomyFilter(index, { label: value })}
                                        placeholder={__('Custom label for this filter', 'jankx')}
                                    />

                                    <ToggleControl
                                        label={__('Enabled', 'jankx')}
                                        checked={filter.enabled !== false}
                                        onChange={(value) => handleUpdateTaxonomyFilter(index, { enabled: value })}
                                    />
                                </div>

                                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                                    <strong style={{ display: 'block', marginBottom: '15px' }}>{__('Filter Settings', 'jankx')}</strong>
                                    
                                    {/* Taxonomy Filter Options */}
                                    {(filter.filterType || filterType) === 'taxonomy' && (
                                        <>
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

                                            <SelectControl
                                                label={__('Display Style', 'jankx')}
                                                value={filter.displayStyle || displayStyle}
                                                options={[
                                                    { label: __('Buttons', 'jankx'), value: 'buttons' },
                                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                                    { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                                    { label: __('Select', 'jankx'), value: 'select' },
                                                ]}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { displayStyle: value })}
                                            />

                                            {(filter.displayStyle || displayStyle) === 'checkboxes' && (
                                                <SelectControl
                                                    label={__('Listing Type', 'jankx')}
                                                    value={filter.listingType || 'ul'}
                                                    options={[
                                                        { label: __('Unordered List (•)', 'jankx'), value: 'ul' },
                                                        { label: __('Ordered List (1, 2, 3)', 'jankx'), value: 'ol' },
                                                        { label: __('No List', 'jankx'), value: 'none' },
                                                    ]}
                                                    onChange={(value) => handleUpdateTaxonomyFilter(index, { listingType: value as 'ul' | 'ol' | 'none' })}
                                                    help={__('Choose how to display the terms list (only applies to checkboxes)', 'jankx')}
                                                    __nextHasNoMarginBottom
                                                    __next40pxDefaultSize
                                                />
                                            )}

                    <ToggleControl
                        label={__('Show Post Counts', 'jankx')}
                                                checked={filter.showCount !== undefined ? filter.showCount : showCount}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { showCount: value })}
                                                help={__('Show post count next to each term', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Empty Terms', 'jankx')}
                                                checked={filter.showEmptyTerms !== undefined ? filter.showEmptyTerms : showEmptyTerms}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { showEmptyTerms: value })}
                        help={__('Show terms that have no posts', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Only Top Level Terms', 'jankx')}
                                                checked={filter.showOnlyTopLevel !== undefined ? filter.showOnlyTopLevel : showOnlyTopLevel}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { showOnlyTopLevel: value })}
                        help={__('Show only parent terms', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Hierarchy', 'jankx')}
                                                checked={filter.showHierarchy !== undefined ? filter.showHierarchy : showHierarchy}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { showHierarchy: value })}
                        help={__('Display terms with hierarchical structure', 'jankx')}
                    />

                    <ToggleControl
                                                label={__('Multiple Selection', 'jankx')}
                                                checked={filter.multipleSelection !== undefined ? filter.multipleSelection : multipleSelection}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { multipleSelection: value })}
                                                help={__('Allow users to select multiple terms', 'jankx')}
                                            />
                                        </>
                                    )}

                                    {/* Meta Field Filter Options */}
                                    {(filter.filterType || filterType) === 'meta' && (
                                        <>
                                            <TextControl
                                                label={__('Meta Key', 'jankx')}
                                                value={filter.metaKey || ''}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { metaKey: value })}
                                                placeholder={__('e.g., _price, custom_field', 'jankx')}
                                            />

                                            <SelectControl
                                                label={__('Input Type', 'jankx')}
                                                value={filter.inputType || 'text'}
                                                options={[
                                                    { label: __('Text', 'jankx'), value: 'text' },
                                                    { label: __('Number', 'jankx'), value: 'number' },
                                                    { label: __('Number Range', 'jankx'), value: 'range' },
                                                    { label: __('Date', 'jankx'), value: 'date' },
                                                    { label: __('Date Range', 'jankx'), value: 'date-range' },
                                                ]}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { inputType: value })}
                                            />

                                            {filter.inputType === 'range' && (
                                                <>
                                                    <TextControl
                                                        label={__('Min Value', 'jankx')}
                                                        value={filter.minValue || ''}
                                                        onChange={(value) => handleUpdateTaxonomyFilter(index, { minValue: value })}
                                                        type="number"
                                                    />
                                                    <TextControl
                                                        label={__('Max Value', 'jankx')}
                                                        value={filter.maxValue || ''}
                                                        onChange={(value) => handleUpdateTaxonomyFilter(index, { maxValue: value })}
                                                        type="number"
                                                    />
                                                </>
                                            )}

                                            <TextControl
                                                label={__('Placeholder', 'jankx')}
                                                value={filter.placeholder || ''}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { placeholder: value })}
                                            />
                                        </>
                                    )}

                                    {/* Price Filter Options */}
                                    {(filter.filterType || filterType) === 'price' && (
                                        <>
                                            <TextControl
                                                label={__('Min Price', 'jankx')}
                                                value={filter.minPrice || ''}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { minPrice: value })}
                                                type="number"
                                            />
                                            <TextControl
                                                label={__('Max Price', 'jankx')}
                                                value={filter.maxPrice || ''}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { maxPrice: value })}
                                                type="number"
                                            />
                                            <TextControl
                                                label={__('Currency Symbol', 'jankx')}
                                                value={filter.currency || 'VND'}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { currency: value })}
                                            />
                                        </>
                                    )}

                                    {/* Date Filter Options */}
                                    {(filter.filterType || filterType) === 'date' && (
                                        <>
                                            <SelectControl
                                                label={__('Date Field', 'jankx')}
                                                value={filter.dateField || 'post_date'}
                                                options={[
                                                    { label: __('Post Date', 'jankx'), value: 'post_date' },
                                                    { label: __('Modified Date', 'jankx'), value: 'post_modified' },
                                                ]}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { dateField: value })}
                                            />
                    <ToggleControl
                                                label={__('Date Range', 'jankx')}
                                                checked={filter.dateRange !== undefined ? filter.dateRange : true}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { dateRange: value })}
                                                help={__('Allow users to select a date range', 'jankx')}
                                            />
                                        </>
                                    )}

                                    {/* Author Filter Options */}
                                    {(filter.filterType || filterType) === 'author' && (
                                        <>
                        <SelectControl
                                                label={__('Display Style', 'jankx')}
                                                value={filter.displayStyle || displayStyle}
                                                options={[
                                                    { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                                    { label: __('Checkboxes', 'jankx'), value: 'checkboxes' },
                                                ]}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { displayStyle: value })}
                                            />
                                            <ToggleControl
                                                label={__('Multiple Selection', 'jankx')}
                                                checked={filter.multipleSelection !== undefined ? filter.multipleSelection : multipleSelection}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { multipleSelection: value })}
                                                help={__('Allow users to select multiple authors', 'jankx')}
                                            />
                                        </>
                                    )}

                                    {/* Keyword Filter Options */}
                                    {(filter.filterType || filterType) === 'keyword' && (
                                        <>
                                            <TextControl
                                                label={__('Placeholder', 'jankx')}
                                                value={filter.placeholder || __('Search...', 'jankx')}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { placeholder: value })}
                                            />
                                            <ToggleControl
                                                label={__('Show Search Button', 'jankx')}
                                                checked={filter.showSearchButton !== undefined ? filter.showSearchButton : false}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { showSearchButton: value })}
                                            />
                                        </>
                                    )}

                                    {/* Common Display Options */}
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                                        <strong style={{ display: 'block', marginBottom: '10px' }}>{__('Display Options', 'jankx')}</strong>

                                <SelectControl
                                            label={__('Layout', 'jankx')}
                                            value={filter.layout || layout}
                                    options={[
                                                { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                                                { label: __('Vertical', 'jankx'), value: 'vertical' },
                                                { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                                { label: __('Accordion', 'jankx'), value: 'accordion' },
                                            ]}
                                            onChange={(value) => handleUpdateTaxonomyFilter(index, { layout: value })}
                                        />

                                        <ToggleControl
                                            label={__('Show Labels', 'jankx')}
                                            checked={filter.showLabels !== undefined ? filter.showLabels : showLabels}
                                            onChange={(value) => handleUpdateTaxonomyFilter(index, { showLabels: value })}
                                />

                                <ToggleControl
                                            label={__('Collapsible', 'jankx')}
                                            checked={filter.collapsible !== undefined ? filter.collapsible : collapsible}
                                            onChange={(value) => handleUpdateTaxonomyFilter(index, { collapsible: value })}
                                            help={__('Make filter collapsible', 'jankx')}
                                        />

                                        {filter.collapsible && (
                                            <ToggleControl
                                                label={__('Default Expanded', 'jankx')}
                                                checked={filter.defaultExpanded !== undefined ? filter.defaultExpanded : defaultExpanded}
                                                onChange={(value) => handleUpdateTaxonomyFilter(index, { defaultExpanded: value })}
                                                help={__('Show filter expanded by default', 'jankx')}
                                            />
                                        )}
                                    </div>
                            </div>
                            </PanelBody>
                        ))}
                    </PanelBody>

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

