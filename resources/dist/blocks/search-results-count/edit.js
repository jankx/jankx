import { jsx as _jsx } from "react/jsx-runtime";
/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
/**
 * Search Results Count block editor component.
 * Displays only the numeric count of found results — no label.
 */
export default function Edit() {
    const { count, isTemplateEditor, isResolving, } = useSelect((select) => {
        const editorStore = select('core/editor');
        const coreStore = select('core');
        const currentPost = editorStore?.getCurrentPost?.();
        const templateEditor = currentPost &&
            (currentPost.type === 'wp_template' ||
                currentPost.type === 'wp_template_part');
        // Inside templates we cannot know the count — show placeholder.
        if (templateEditor) {
            return { count: 42, isTemplateEditor: true, isResolving: false };
        }
        // Try to read found_posts from the REST response of the current post
        // (works when the editor loads query-context data).
        const postId = editorStore?.getCurrentPostId?.() ?? 0;
        const postType = currentPost?.type ?? editorStore?.getCurrentPostType?.() ?? 'post';
        let resolving = false;
        if (coreStore?.isResolving) {
            resolving = coreStore.isResolving('getEntityRecord', [
                'postType',
                postType,
                postId,
            ]);
        }
        // Fallback: show 0 in editor (actual count is resolved server-side).
        return { count: 0, isTemplateEditor: false, isResolving: resolving };
    }, []);
    const blockProps = useBlockProps({
        className: 'jankx-search-results-count',
    });
    const isLoading = isResolving && !isTemplateEditor;
    return (_jsx("span", { ...blockProps, children: isLoading ? (_jsx(Spinner, {})) : (count) }));
}
