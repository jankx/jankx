import { createBlock, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
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
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
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

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        blockId,
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
    const { insertBlocks } = useDispatch('core/block-editor');

    // Lấy danh sách block con advanced-filter
    const innerFilterBlocks = useSelect(
        (select: any) => {
            const block = select('core/block-editor').getBlock(clientId);
            return block?.innerBlocks || [];
        },
        [clientId]
    );

    // Dùng useMemo để tránh setAttributes lặp lại nếu dữ liệu không đổi
    const normalizedFilters = useMemo(() => {
        const nextTax = [];
        const nextMeta = [];
        const nextPrice = [];
        const nextDate = [];
        const nextAuthor = [];
        const nextKeyword = [];

        innerFilterBlocks.forEach((block: any) => {
            const filter = block.attributes || {};
            const type = filter.filterType || 'taxonomy';

            switch (type) {
                case 'taxonomy':
                    nextTax.push(filter);
                    break;
                case 'meta':
                    nextMeta.push(filter);
                    break;
                case 'price':
                    nextPrice.push(filter);
                    break;
                case 'date':
                    nextDate.push(filter);
                    break;
                case 'author':
                    nextAuthor.push(filter);
                    break;
                case 'keyword':
                    nextKeyword.push(filter);
                    break;
                default:
                    break;
            }
        });

        return {
            taxonomyFilters: nextTax,
            metaFilters: nextMeta,
            priceFilters: nextPrice,
            dateFilters: nextDate,
            authorFilters: nextAuthor,
            keywordFilter: nextKeyword[0] || keywordFilter || {},
        };
    }, [innerFilterBlocks, keywordFilter]);
    
    // Get post type from target block
    const targetPostType = targetBlockIds.length > 0 && availableBlocks.length > 0
        ? availableBlocks.find(b => b.id === targetBlockIds[0])?.postType || 'post'
        : 'post';

    // Ensure blockId is set to clientId for frontend matching
    useEffect(() => {
        if (!blockId && clientId) {
            setAttributes({ blockId: clientId });
        }
    }, [blockId, clientId, setAttributes]);

    // Use blockProps without additional classes since PHP render already includes full wrapper
    const blockProps = useBlockProps();

    // Đồng bộ filters từ block con lên attributes để render PHP/SSR
    useEffect(() => {
        const nextAttributes = {
            taxonomyFilters: normalizedFilters.taxonomyFilters,
            metaFilters: normalizedFilters.metaFilters,
            priceFilters: normalizedFilters.priceFilters,
            dateFilters: normalizedFilters.dateFilters,
            authorFilters: normalizedFilters.authorFilters,
            keywordFilter: normalizedFilters.keywordFilter,
            targetPostType,
        };

        const currentSnapshot = JSON.stringify({
            taxonomyFilters,
            metaFilters,
            priceFilters,
            dateFilters,
            authorFilters,
            keywordFilter,
            targetPostType,
        });
        const nextSnapshot = JSON.stringify(nextAttributes);

        if (currentSnapshot !== nextSnapshot) {
            setAttributes(nextAttributes as Partial<AdvancedFiltersAttributes>);
        }
    }, [
        normalizedFilters,
        taxonomyFilters,
        metaFilters,
        priceFilters,
        dateFilters,
        authorFilters,
        keywordFilter,
        targetPostType,
        setAttributes,
    ]);

    // Helper function to find dynamic-data-layout blocks recursively
    const findDynamicDataLayoutBlocks = (blocks: any[]): any[] => {
        const found: any[] = [];
        
        const traverse = (blockList: any[]) => {
            blockList.forEach((block) => {
                if (block.name === 'jankx/dynamic-data-layout') {
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

    // Get available dynamic-data-layout blocks from current page only
    useEffect(() => {
        const getAvailableBlocks = () => {
            setLoadingBlocks(true);
            try {
                // Get blocks from current page/post context only
                const currentBlocks = (window as any).wp.data.select('core/block-editor').getBlocks();
                if (currentBlocks && currentBlocks.length > 0) {
                    const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
                    setAvailableBlocks(dynamicDataLayoutBlocks);
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
                    const dynamicDataLayoutBlocks = findDynamicDataLayoutBlocks(currentBlocks);
                    setAvailableBlocks(dynamicDataLayoutBlocks);
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

    const handleAddFilterBlock = () => {
        const defaultAttributes = {
            filterType,
            layout,
            showLabels,
            displayStyle,
            listingType: 'ul',
            showCount,
            showEmptyTerms,
            showOnlyTopLevel,
            showHierarchy,
            multipleSelection,
            collapsible,
            defaultExpanded,
        };

        insertBlocks(createBlock('jankx/advanced-filter', defaultAttributes as any), undefined, clientId);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Target Blocks', 'jankx')} initialOpen={true}>
                    {loadingBlocks ? (
                        <Spinner />
                    ) : (
                        <>
                            <p>{__('Select Dynamic Data Layout blocks to filter:', 'jankx')}</p>
                            {availableBlocks.length === 0 ? (
                                <Placeholder>
                                    <p>{__('No Dynamic Data Layout blocks found in this page. Add a Dynamic Data Layout block to this page first.', 'jankx')}</p>
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
                                        help={__('Select the Dynamic Data Layout block you want to filter.', 'jankx')}
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
                        onClick={handleAddFilterBlock} 
                            style={{ marginTop: '10px' }}
                            disabled={targetBlockIds.length === 0}
                        >
                            {__('+ Add Filter', 'jankx')}
                        </Button>
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
                <div style={{ marginBottom: '15px' }}>
                    <InnerBlocks
                        allowedBlocks={['jankx/advanced-filter']}
                        renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                    />
                </div>
                {targetBlockIds.length === 0 ? (
                    <Placeholder icon="filter" label={__('Advanced Filters', 'jankx')}>
                        <p>{__('Please select at least one target block to filter in the sidebar.', 'jankx')}</p>
                    </Placeholder>
                ) : (
                    <ServerSideRender
                        block="jankx/advanced-filters"
                        attributes={attributes}
                    />
                )}
            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => <InnerBlocks.Content />, // Lưu block con để giữ cấu hình filter
} as any);

