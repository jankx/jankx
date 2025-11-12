import clsx from 'clsx';
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, _x } from '@wordpress/i18n';
import {
    BlockControls,
    BlockContextProvider,
    __experimentalUseBlockPreview as useBlockPreview,
    useBlockProps,
    useInnerBlocksProps,
    InnerBlocks,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, ToolbarGroup } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { list, grid } from '@wordpress/icons';

const TEMPLATE: [string][] = [['core/post-title'], ['core/post-date'], ['core/post-excerpt']];

interface PostLayoutTemplateEditProps {
    attributes: {
        layout?: {
            type?: string;
            columnCount?: number;
        };
    };
    setAttributes: (attributes: Record<string, unknown>) => void;
    clientId: string;
    context: {
        query?: Record<string, any>;
        templateSlug?: string;
        previewPostType?: string;
    };
    __unstableLayoutClassNames?: string;
}

function PostLayoutTemplateInnerBlocks({ classList }: { classList?: string }) {
    const innerBlocksProps = useInnerBlocksProps(
        { className: clsx('wp-block-post', classList) },
        {
            template: TEMPLATE,
            __unstableDisableLayoutClassNames: true,
            renderAppender: InnerBlocks.ButtonBlockAppender,
        }
    );
    return <li {...innerBlocksProps} />;
}

interface PostLayoutTemplateBlockPreviewProps {
    blocks: any[];
    blockContextId: number;
    classList?: string;
    isHidden: boolean;
    setActiveBlockContextId: (id: number) => void;
}

function PostLayoutTemplateBlockPreview({
    blocks,
    blockContextId,
    classList,
    isHidden,
    setActiveBlockContextId,
}: PostLayoutTemplateBlockPreviewProps) {
    const blockPreviewProps = useBlockPreview({
        blocks,
        props: {
            className: clsx('wp-block-post', classList),
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

const MemoizedPostLayoutTemplateBlockPreview = memo(PostLayoutTemplateBlockPreview);

export default function PostLayoutTemplateEdit({
    setAttributes,
    clientId,
    context,
    attributes: { layout },
    __unstableLayoutClassNames,
}: PostLayoutTemplateEditProps) {
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
    } = context;

    const { type: layoutType, columnCount = 3 } = layout || {};
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

    const blockProps = useBlockProps({
        className: clsx(__unstableLayoutClassNames, {
            [`columns-${columnCount}`]: layoutType === 'grid' && columnCount,
        }),
    });

    if (!posts) {
        return (
            <p {...blockProps}>
                <Spinner />
            </p>
        );
    }

    if (!posts.length) {
        return (
            <p {...blockProps}>
                {__('No results found.', 'jankx')}
            </p>
        );
    }

    const setDisplayLayout = (newDisplayLayout: Record<string, unknown>) =>
        setAttributes({
            layout: { ...layout, ...newDisplayLayout },
        });

    const displayLayoutControls = [
        {
            icon: list,
            title: _x('List view', 'Post layout template display setting', 'jankx'),
            onClick: () => setDisplayLayout({ type: 'default' }),
            isActive: layoutType === 'default' || layoutType === 'constrained',
        },
        {
            icon: grid,
            title: _x('Grid view', 'Post layout template display setting', 'jankx'),
            onClick: () =>
                setDisplayLayout({
                    type: 'grid',
                    columnCount,
                }),
            isActive: layoutType === 'grid',
        },
    ];

    return (
        <>
            <BlockControls>
                <ToolbarGroup controls={displayLayoutControls} />
            </BlockControls>

            <ul {...blockProps}>
                {blockContexts.map((blockContext) => (
                    <BlockContextProvider key={blockContext.postId} value={blockContext}>
                        {blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId) ? (
                            <PostLayoutTemplateInnerBlocks classList={blockContext.classList} />
                        ) : null}
                        <MemoizedPostLayoutTemplateBlockPreview
                            blocks={blocks}
                            blockContextId={blockContext.postId}
                            classList={blockContext.classList}
                            setActiveBlockContextId={setActiveBlockContextId}
                            isHidden={blockContext.postId === (activeBlockContextId || blockContexts[0]?.postId)}
                        />
                    </BlockContextProvider>
                ))}
            </ul>
        </>
    );
}

