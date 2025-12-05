import clsx from 'clsx';
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import {
    BlockControls,
    InspectorControls,
    BlockContextProvider,
    __experimentalUseBlockPreview as useBlockPreview,
    useBlockProps,
    useInnerBlocksProps,
    InnerBlocks,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, ToolbarGroup, PanelBody, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { list, grid } from '@wordpress/icons';

import { getAllowedTemplateBlocks } from './templateBlocks';

const TEMPLATE: [string][] = [
    ['core/post-title'],
    ['core/post-date'],
    ['core/post-excerpt'],
];

interface MasterDataTemplateEditProps {
    attributes: {
        contentLayout?: string;
        className?: string;
        itemSpacing?: string;
        showItemBorder?: boolean;
        itemBorderRadius?: number;
        itemPadding?: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
    };
    setAttributes: (attributes: Record<string, unknown>) => void;
    clientId: string;
    context: {
        query?: Record<string, any>;
        templateSlug?: string;
        previewPostType?: string;
        displayLayout?: string; // Context from parent
    };
    __unstableLayoutClassNames?: string;
}

function MasterDataTemplateInnerBlocks({ classList, allowedBlocks }: { classList?: string; allowedBlocks?: string[] }) {
    const innerBlocksProps = useInnerBlocksProps(
        { 
            className: clsx('wp-block-post', 'post-item', classList, 'is-editing'),
            style: { 
                minHeight: '50px', 
                position: 'relative',
                // Ensure inner blocks are clickable and selectable
                pointerEvents: 'auto',
            }
        },
        {
            template: TEMPLATE,
            __unstableDisableLayoutClassNames: true,
            allowedBlocks,
            templateLock: false, // Allow editing inner blocks
        }
    );
    // Render as li for Grid layout
    // Inner blocks rendered here can be selected and will show their InspectorControls
    return <li {...innerBlocksProps} />;
}

interface MasterDataTemplateBlockPreviewProps {
    blocks: any[];
    blockContextId: number;
    classList?: string;
    isHidden: boolean;
    setActiveBlockContextId: (id: number) => void;
}

function MasterDataTemplateBlockPreview({
    blocks,
    blockContextId,
    classList,
    isHidden,
    setActiveBlockContextId,
}: MasterDataTemplateBlockPreviewProps) {
    const blockPreviewProps = useBlockPreview({
        blocks,
        props: {
            className: clsx('wp-block-post', 'post-item', classList),
        },
    });

    const handleOnClick = () => {
        setActiveBlockContextId(blockContextId);
    };

    const style = {
        display: isHidden ? 'none' : undefined,
    };

    return (
        <li
            {...blockPreviewProps}
            tabIndex={0}
            role="button"
            onClick={handleOnClick}
            onKeyPress={handleOnClick}
            style={style}
        />
    );
}

const MemoizedMasterDataTemplateBlockPreview = memo(MasterDataTemplateBlockPreview);

export default function MasterDataTemplateEdit({
    setAttributes,
    clientId,
    context,
    attributes: { 
        contentLayout = 'default', 
        className = '',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        itemPadding = { top: '0', right: '0', bottom: '0', left: '0' },
    },
    __unstableLayoutClassNames,
}: MasterDataTemplateEditProps) {
    const {
        query: {
            perPage,
            offset = 0,
            postType,
            order,
            orderBy,
            author,
            search,
            exclude,
            sticky,
            inherit,
            taxQuery,
            parents,
            pages,
            format,
            ...restQueryArgs
        } = {},
        templateSlug,
        previewPostType,
        displayLayout,
    } = context;

    const [activeBlockContextId, setActiveBlockContextId] = useState<number | undefined>();
    const { posts, blocks } = useSelect(
        (select) => {
            const { getEntityRecords, getTaxonomies } = select(coreStore);
            const { getBlocks } = select(blockEditorStore);

            const templateCategory =
                inherit &&
                templateSlug?.startsWith('category-') &&
                getEntityRecords('taxonomy', 'category', {
                    context: 'view',
                    per_page: 1,
                    _fields: ['id'],
                    slug: templateSlug.replace('category-', ''),
                });
            const templateTag =
                inherit &&
                templateSlug?.startsWith('tag-') &&
                getEntityRecords('taxonomy', 'post_tag', {
                    context: 'view',
                    per_page: 1,
                    _fields: ['id'],
                    slug: templateSlug.replace('tag-', ''),
                });

            const queryArgs: Record<string, any> = {
                offset: offset || 0,
                order,
                orderby: orderBy,
            };

            if (taxQuery && !inherit) {
                const taxonomies = getTaxonomies({
                    type: postType,
                    per_page: -1,
                    context: 'view',
                });

                const builtTaxQuery = Object.entries(taxQuery || {}).reduce<Record<string, any>>(
                    (accumulator, [taxonomySlug, terms]) => {
                        const taxonomy = taxonomies?.find(({ slug }: { slug: string }) => slug === taxonomySlug);
                        if (taxonomy?.rest_base) {
                            accumulator[taxonomy.rest_base] = terms;
                        }
                        return accumulator;
                    },
                    {}
                );

                if (Object.keys(builtTaxQuery).length > 0) {
                    Object.assign(queryArgs, builtTaxQuery);
                }
            }

            if (perPage) {
                queryArgs.per_page = perPage;
            }
            if (author) {
                queryArgs.author = author;
            }
            if (search) {
                queryArgs.search = search;
            }
            if (exclude?.length) {
                queryArgs.exclude = exclude;
            }
            if (parents?.length) {
                queryArgs.parent = parents;
            }
            if (format?.length) {
                queryArgs.format = format;
            }

            if (['exclude', 'only'].includes(sticky)) {
                queryArgs.sticky = sticky === 'only';
            }

            if (['', 'ignore'].includes(sticky)) {
                delete queryArgs.sticky;
                queryArgs.ignore_sticky = sticky === 'ignore';
            }

            let currentPostType = postType;
            if (inherit) {
                if (templateSlug?.startsWith('archive-')) {
                    queryArgs.postType = templateSlug.replace('archive-', '');
                    currentPostType = queryArgs.postType;
                } else if (templateCategory) {
                    queryArgs.categories = templateCategory[0]?.id;
                } else if (templateTag) {
                    queryArgs.tags = templateTag[0]?.id;
                } else if (templateSlug?.startsWith('taxonomy-post_format')) {
                    queryArgs.format = templateSlug.replace('taxonomy-post_format-post-format-', '');
                }
            }

            const usedPostType = previewPostType || currentPostType;

            return {
                posts: getEntityRecords('postType', usedPostType, {
                    ...queryArgs,
                    ...restQueryArgs,
                }),
                blocks: getBlocks(clientId),
            };
        },
        [
            perPage,
            offset,
            order,
            orderBy,
            clientId,
            author,
            search,
            postType,
            exclude,
            sticky,
            inherit,
            templateSlug,
            taxQuery,
            parents,
            format,
            restQueryArgs,
            previewPostType,
        ]
    );

    const blockContexts = useMemo(
        () =>
            posts?.map((post: any) => ({
                postType: post.type,
                postId: post.id,
                classList: post.class_list ?? '',
            })) ?? [],
        [posts]
    );

    const primaryTemplateBlock = blocks?.find((block: any) => block.name === 'jankx/master-data-template');
    const innerBlockCount = primaryTemplateBlock?.innerBlocks?.length ?? 0;
    
    const allowedBlocks = useMemo(
        () => getAllowedTemplateBlocks(previewPostType || postType),
        [previewPostType, postType]
    );

    const blockProps = useBlockProps({
        className: clsx(__unstableLayoutClassNames, className, {
            [`content-layout-${contentLayout}`]: contentLayout && contentLayout !== 'default',
            [`item-spacing-${itemSpacing}`]: itemSpacing && itemSpacing !== 'normal',
            'has-item-border': showItemBorder,
            [`layout-${displayLayout}`]: displayLayout,
        }),
        style: showItemBorder && itemBorderRadius > 0 ? {
            '--item-border-radius': `${itemBorderRadius}px`,
        } : undefined,
    } as any);

    // Always render InspectorControls to ensure they appear when block is selected
    // This ensures block options are always available regardless of loading state
    const inspectorControls = (
        <InspectorControls>
            <PanelBody title={__('Template Settings', 'jankx')} initialOpen={true}>
                <SelectControl
                    label={__('Content Layout', 'jankx')}
                    value={contentLayout}
                    options={[
                        { label: __('Default', 'jankx'), value: 'default' },
                        { label: __('Compact', 'jankx'), value: 'compact' },
                        { label: __('Full', 'jankx'), value: 'full' },
                    ]}
                    onChange={(value) => setAttributes({ contentLayout: value })}
                    help={__('Control the layout style of the post template', 'jankx')}
                />
            </PanelBody>

            <PanelBody title={__('Item Styling', 'jankx')} initialOpen={false}>
                <SelectControl
                    label={__('Item Spacing', 'jankx')}
                    value={itemSpacing}
                    options={[
                        { label: __('None', 'jankx'), value: 'none' },
                        { label: __('Compact', 'jankx'), value: 'compact' },
                        { label: __('Normal', 'jankx'), value: 'normal' },
                        { label: __('Loose', 'jankx'), value: 'loose' },
                    ]}
                    onChange={(value) => setAttributes({ itemSpacing: value })}
                    help={__('Control spacing between post items', 'jankx')}
                />
                <ToggleControl
                    label={__('Show Item Border', 'jankx')}
                    checked={showItemBorder}
                    onChange={(value) => setAttributes({ showItemBorder: value })}
                    help={__('Add border around each post item', 'jankx')}
                />
                {showItemBorder && (
                    <RangeControl
                        label={__('Border Radius', 'jankx')}
                        value={itemBorderRadius}
                        onChange={(value) => setAttributes({ itemBorderRadius: value || 0 })}
                        min={0}
                        max={50}
                        help={__('Border radius in pixels', 'jankx')}
                    />
                )}
            </PanelBody>

            <PanelBody title={__('Advanced', 'jankx')} initialOpen={false}>
                <p style={{ fontSize: '12px', color: '#757575', marginTop: '8px' }}>
                    {__('Note: Individual inner blocks (Title, Date, Excerpt, etc.) have their own settings that appear when you select them directly.', 'jankx')}
                </p>
            </PanelBody>
        </InspectorControls>
    );

    if (!posts) {
        return (
            <>
                {inspectorControls}
                <p {...blockProps}><Spinner /></p>
            </>
        );
    }

    if (!posts.length) {
        return (
            <>
                {inspectorControls}
                <p {...blockProps}>{__('No results found.', 'jankx')}</p>
            </>
        );
    }

    // Determine wrapper tag based on layout
    const TagName = displayLayout === 'grid' ? 'ul' : 'div';

    return (
        <>
            {inspectorControls}
            <>
                {innerBlockCount === 0 && (
                    <div className="jankx-master-data-template__notice">
                        <p>{__('This template has no blocks yet. Add blocks to define the post item structure.', 'jankx')}</p>
                    </div>
                )}
                <TagName {...blockProps}>
                    {blockContexts.map((blockContext) => (
                        <BlockContextProvider key={blockContext.postId} value={blockContext}>
                            {blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId) ? (
                                <MasterDataTemplateInnerBlocks
                                    classList={blockContext.classList}
                                    allowedBlocks={allowedBlocks}
                                />
                            ) : null}
                            <MemoizedMasterDataTemplateBlockPreview
                                blocks={blocks}
                                blockContextId={blockContext.postId}
                                classList={blockContext.classList}
                                setActiveBlockContextId={setActiveBlockContextId}
                                isHidden={blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId)}
                            />
                        </BlockContextProvider>
                    ))}
                </TagName>
            </>
        </>
    );
}
