import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { ButtonGroup, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

import QueryControls from './components/QueryControls';
import FilterBuilder from './components/FilterBuilder';
import DisplayOptions from './components/DisplayOptions';
import StylingControls from './components/StylingControls';

type OrderDirection = 'ASC' | 'DESC';

interface DynamicCollectionAttributes {
    postType: string;
    postsPerPage: number;
    orderBy: string;
    order: OrderDirection;
    offset: number;
    exclude: number[];
    include: number[];
    taxonomyFilters: Record<string, unknown>;
    metaFilters: Record<string, unknown>;
    presetFilters: unknown[];
    customFilters: unknown[];
    displayOptions: Record<string, unknown>;
    styling: Record<string, unknown>;
    responsive: Record<string, unknown>;
}

interface EditProps {
    attributes: DynamicCollectionAttributes;
    setAttributes: (attrs: Partial<DynamicCollectionAttributes>) => void;
    clientId: string;
}

const ALLOWED_BLOCKS: string[] = [
    'core/post-template',
    'core/query-pagination',
    'core/query-no-results',
    'core/post-title',
    'core/post-excerpt',
    'core/post-featured-image',
    'core/post-date',
    'core/post-author',
    'core/post-terms',
    'core/read-more',
    'jankx/icon-picker',
    'jankx/icon-button'
];

const TEMPLATE: any[] = [
    ['core/post-template', {}, [
        ['core/post-featured-image', {}],
        ['core/post-title', { level: 2 }],
        ['core/post-excerpt', {}],
        ['core/read-more', {}]
    ]],
    ['core/query-pagination', {}],
    ['core/query-no-results', {}]
];

function Edit({ attributes, setAttributes }: EditProps): JSX.Element {
    const {
        postType,
        postsPerPage,
        orderBy,
        order,
        offset,
        exclude,
        include,
        taxonomyFilters,
        metaFilters,
        presetFilters,
        customFilters,
        displayOptions,
        styling,
        responsive
    } = attributes;

    const [activeTab, setActiveTab] = useState<'query' | 'filters' | 'display' | 'styling'>('query');
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
    const [fetchInfo, setFetchInfo] = useState<{totalPosts?: number, foundPosts?: number, maxPages?: number}>({});

    const { postTypes, taxonomies } = useSelect((select: any) => {
        const { getPostTypes, getTaxonomies } = select(coreDataStore);
        return {
            postTypes: getPostTypes({ per_page: -1 }),
            taxonomies: getTaxonomies({ per_page: -1 })
        };
    }, []);

    const blockProps = useBlockProps({
        className: 'jankx-post-layout'
    });

    const updateAttribute = (key: keyof DynamicCollectionAttributes, value: unknown): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAttributes({ [key]: value } as any);
    };

    const renderTabContent = (): JSX.Element | null => {
        switch (activeTab) {
            case 'query':
                return (
                    <QueryControls
                        attributes={{
                            postType,
                            postsPerPage,
                            orderBy,
                            order,
                            offset,
                            exclude,
                            include
                        }}
                        postTypes={postTypes}
                        onUpdate={updateAttribute}
                    />
                );
            case 'filters':
                return (
                    <FilterBuilder
                        attributes={{
                            taxonomyFilters,
                            metaFilters,
                            presetFilters,
                            customFilters
                        }}
                        postType={postType}
                        taxonomies={taxonomies}
                        onUpdate={updateAttribute}
                    />
                );
            case 'display':
                return (
                    <DisplayOptions
                        displayOptions={displayOptions}
                        onUpdate={updateAttribute}
                    />
                );
            case 'styling':
                return (
                    <StylingControls
                        styling={styling}
                        responsive={responsive}
                        onUpdate={updateAttribute}
                    />
                );
            default:
                return null;
        }
    };

    // Editor-only: fetch HTML preview using PostsFetcher via admin-ajax
    useEffect(() => {
        const controller = new AbortController();
        const doFetch = async () => {
            try {
                setIsLoadingPreview(true);
                const params = new URLSearchParams({
                    action: 'jankx-post-layout-fetch-data',
                    post_type: postType || 'post',
                    // Jankx engine id is 'jankx'
                    engine_id: 'jankx',
                    layout: (styling as any)?.viewType || 'grid',
                    posts_per_page: String(postsPerPage || 6),
                    order_by: orderBy || 'date',
                    order: order || 'DESC',
                    offset: String(offset || 0),
                });

                // Add include/exclude posts if provided
                if (include && include.length > 0) {
                    params.append('include', JSON.stringify(include));
                }
                if (exclude && exclude.length > 0) {
                    params.append('exclude', JSON.stringify(exclude));
                }

                // Add taxonomy filters if provided
                if (taxonomyFilters && Object.keys(taxonomyFilters).length > 0) {
                    params.append('taxonomy_filters', JSON.stringify(taxonomyFilters));
                }

                // Add meta filters if provided
                if (metaFilters && Object.keys(metaFilters).length > 0) {
                    params.append('meta_filters', JSON.stringify(metaFilters));
                }
                const ajaxUrl = (window as any).ajaxurl || '/wp-admin/admin-ajax.php';
                const res = await fetch(`${ajaxUrl}?${params.toString()}`, { signal: controller.signal, credentials: 'same-origin' });
                const json = await res.json();
                if (json && json.success && json.data && typeof json.data.content === 'string') {
                    setPreviewHtml(json.data.content);
                    // Update fetch info from response
                    if (json.data.query_info) {
                        setFetchInfo({
                            totalPosts: json.data.query_info.total_posts || 0,
                            foundPosts: json.data.query_info.found_posts || 0,
                            maxPages: json.data.query_info.max_pages || 0
                        });
                    }
                } else {
                    setPreviewHtml('<div class="jankx-post-layout__empty">No content</div>');
                    setFetchInfo({});
                }
            } catch (e) {
                if (!(e as any)?.name || (e as any).name !== 'AbortError') {
                    setPreviewHtml('<div class="jankx-post-layout__error">Failed to load preview</div>');
                }
            } finally {
                setIsLoadingPreview(false);
            }
        };

        doFetch();
        return () => controller.abort();
        // Re-fetch when key attributes affecting query/layout change
    }, [postType, postsPerPage, orderBy, order, offset, JSON.stringify(include), JSON.stringify(exclude), JSON.stringify(taxonomyFilters), JSON.stringify(metaFilters), (styling as any)?.viewType]);

    return (
        <>
            <div {...blockProps}>
                <div className="jankx-post-layout__header">
                    <h3 className="jankx-post-layout__title">
                        {__('Post Layout', 'jankx')}
                    </h3>
                    <div className="jankx-post-layout__info">
                        <span className="jankx-post-layout__post-type">
                            {postType || 'post'}
                        </span>
                        <span className="jankx-post-layout__count">
                            {fetchInfo.foundPosts !== undefined ?
                                `${fetchInfo.foundPosts} / ${fetchInfo.totalPosts} ${__('posts', 'jankx')}` :
                                `${postsPerPage} ${__('posts', 'jankx')}`
                            }
                        </span>
                        {fetchInfo.maxPages > 1 && (
                            <span className="jankx-post-layout__pages">
                                {__('Pages:', 'jankx')} {fetchInfo.maxPages}
                            </span>
                        )}
                        {isLoadingPreview && (
                            <span className="jankx-post-layout__loading">
                                {__('Loading...', 'jankx')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="jankx-post-layout__content">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        template={TEMPLATE}
                        templateLock={false}
                    />
                </div>
            </div>

            <InspectorControls>
                <div className="jankx-post-layout__inspector">
                    <div className="jankx-post-layout__tabs">
                        <ButtonGroup className="jankx-post-layout__tab-buttons">
                            {[
                                { key: 'query', label: __('Query', 'jankx'), icon: 'search' },
                                { key: 'filters', label: __('Filters', 'jankx'), icon: 'filter' },
                                { key: 'display', label: __('Display', 'jankx'), icon: 'visibility' },
                                { key: 'styling', label: __('Styling', 'jankx'), icon: 'admin-appearance' }
                            ].map(({ key, label, icon }) => (
                                <Button
                                    key={key}
                                    isPrimary={activeTab === (key as typeof activeTab)}
                                    onClick={() => setActiveTab(key as typeof activeTab)}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    icon={icon as any}
                                    label={label}
                                >
                                    {label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <div className="jankx-post-layout__tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </InspectorControls>
        </>
    );
}

registerBlockType('jankx/post-layout', {
    title: __('Post Layout', 'jankx'),
    description: __('A Post Layout block for displaying posts with advanced filtering and layout options', 'jankx'),
    category: 'jankx',
    icon: 'grid-view',
    keywords: [
        __('collection', 'jankx'),
        __('posts', 'jankx'),
        __('query', 'jankx'),
        __('filter', 'jankx'),
        __('layout', 'jankx')
    ],
    supports: {
        html: false,
        align: ['wide', 'full'],
        customClassName: true,
        reusable: true
    },
    attributes: {
        postType: { type: 'string', default: 'post' },
        postsPerPage: { type: 'number', default: 6 },
        orderBy: { type: 'string', default: 'date' },
        order: { type: 'string', default: 'DESC' },
        offset: { type: 'number', default: 0 },
        exclude: { type: 'array', default: [] },
        include: { type: 'array', default: [] },
        taxonomyFilters: { type: 'object', default: {} },
        metaFilters: { type: 'object', default: {} },
        presetFilters: { type: 'array', default: [] },
        customFilters: { type: 'array', default: [] },
        displayOptions: { type: 'object', default: { showImage: true, showTitle: true, showExcerpt: true, showMeta: true } },
        styling: { type: 'object', default: { viewType: 'grid', hoverEffect: 'lift', borderRadius: 8, shadow: 'medium' } },
        responsive: { type: 'object', default: { mobile: true, tablet: true, desktop: true } }
    },
    edit: Edit,
    save: () => null
});


