/**
 * WordPress dependencies
 */
import { _n } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';

/**
 * Comment Count block editor component
 */
export default function Edit(): JSX.Element {
    const {
        commentCount,
        isTemplateEditor,
        isResolving,
    } = useSelect((select) => {
        const editorStore = select('core/editor') as any;
        const coreStore = select('core') as any;

        const currentPost = editorStore?.getCurrentPost?.();
        const postId = editorStore?.getCurrentPostId?.() ?? currentPost?.id ?? 0;
        const postType =
            currentPost?.type ??
            editorStore?.getCurrentPostType?.() ??
            'post';

        const templateEditor =
            currentPost &&
            (currentPost.type === 'wp_template' ||
                currentPost.type === 'wp_template_part');

        let count: number | null = null;
        let resolving = false;

        if (!templateEditor && postId) {
            if (coreStore?.isResolving) {
                resolving = coreStore.isResolving('getEntityRecord', [
                    'postType',
                    postType,
                    postId,
                ]);
            }

            const record = coreStore?.getEntityRecord?.(
                'postType',
                postType,
                postId
            );

            if (typeof record?.comment_count !== 'undefined') {
                const parsed = parseInt(record.comment_count, 10);
                count = Number.isNaN(parsed) ? null : parsed;
            } else {
                const editedCount =
                    editorStore?.getEditedPostAttribute?.('comment_count');
                if (typeof editedCount !== 'undefined') {
                    const parsedEdited = parseInt(editedCount, 10);
                    count = Number.isNaN(parsedEdited) ? null : parsedEdited;
                }
            }
        }

        return {
            commentCount: count,
            isTemplateEditor: !!templateEditor,
            isResolving: resolving,
        };
    }, []);

    const blockProps = useBlockProps({
        className: 'jankx-comment-count',
    });

    const isLoading = isResolving && commentCount === null && !isTemplateEditor;

    const displayCount = isTemplateEditor
        ? 12
        : Math.max(0, Number(commentCount ?? 0));

    const label = _n('Comment', 'Comments', displayCount, 'jankx');

    return (
        <div {...blockProps}>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <span className="comment-count-number">
                        {displayCount}
                    </span>
                    <span className="comment-count-text">{label}</span>
                </>
            )}
        </div>
    );
}

