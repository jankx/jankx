import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';
export default function Edit({ attributes, setAttributes }) {
    const { authorId, showAvatar, avatarSize, showBio, showSocial, showPosts, postsCount, layout } = attributes;
    const blockProps = useBlockProps({
        className: `wp-block-jankx-author-box layout-${layout}`
    });
    // Get current post author or current user
    const { author, posts } = useSelect((select) => {
        let currentAuthorId = authorId;
        if (currentAuthorId === 0) {
            // Try to get post author first
            const post = select('core/editor')?.getCurrentPost();
            if (post?.author) {
                currentAuthorId = post.author;
            }
            else {
                // Fallback to current user
                currentAuthorId = select('core')?.getCurrentUser()?.id || 0;
            }
        }
        const authorData = currentAuthorId ? select('core')?.getUser(currentAuthorId) : null;
        // Get author posts if needed
        const authorPosts = showPosts && currentAuthorId ?
            select('core')?.getEntityRecords('postType', 'post', {
                author: currentAuthorId,
                per_page: postsCount,
                status: 'publish'
            }) : [];
        return {
            author: authorData,
            posts: authorPosts || []
        };
    }, [authorId, showPosts, postsCount]);
    const layoutOptions = [
        { label: __('Horizontal', 'jankx'), value: 'horizontal' },
        { label: __('Vertical', 'jankx'), value: 'vertical' }
    ];
    if (!author) {
        return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Author Box Settings', 'jankx'), initialOpen: true, children: _jsx(SelectControl, { label: __('Layout', 'jankx'), value: layout, options: layoutOptions, onChange: (value) => setAttributes({ layout: value }) }) }) }), _jsx("p", { children: __('Loading author data...', 'jankx') })] }));
    }
    return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Author Box Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Layout', 'jankx'), value: layout, options: layoutOptions, onChange: (value) => setAttributes({ layout: value }) }), _jsx(ToggleControl, { label: __('Show Avatar', 'jankx'), checked: showAvatar, onChange: (value) => setAttributes({ showAvatar: value }) }), showAvatar && (_jsx(RangeControl, { label: __('Avatar Size (px)', 'jankx'), value: avatarSize, onChange: (value) => setAttributes({ avatarSize: value }), min: 40, max: 200, step: 10 })), _jsx(ToggleControl, { label: __('Show Bio', 'jankx'), checked: showBio, onChange: (value) => setAttributes({ showBio: value }) }), _jsx(ToggleControl, { label: __('Show Social Links', 'jankx'), checked: showSocial, onChange: (value) => setAttributes({ showSocial: value }) }), _jsx(ToggleControl, { label: __('Show Recent Posts', 'jankx'), checked: showPosts, onChange: (value) => setAttributes({ showPosts: value }) }), showPosts && (_jsx(RangeControl, { label: __('Number of Posts', 'jankx'), value: postsCount, onChange: (value) => setAttributes({ postsCount: value }), min: 1, max: 10, step: 1 }))] }) }), showAvatar && (_jsx("div", { className: "author-avatar", children: _jsx("img", { src: author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || '', alt: author.name, style: { width: avatarSize, height: avatarSize } }) })), _jsxs("div", { className: "author-info", children: [_jsx("h3", { className: "author-name", children: _jsx("a", { href: author.link || '#', children: author.name }) }), showBio && author.description && (_jsx("div", { className: "author-bio", dangerouslySetInnerHTML: { __html: author.description } })), showSocial && (_jsx("div", { className: "author-social", children: _jsx("span", { style: { fontSize: '0.875rem', color: '#666' }, children: __('Social links will appear here', 'jankx') }) })), showPosts && posts.length > 0 && (_jsxs("div", { className: "author-posts", children: [_jsx("h4", { className: "posts-title", children: __('Recent Posts', 'jankx') }), _jsx("ul", { className: "posts-list", children: posts.map((post) => (_jsx("li", { children: _jsx("a", { href: post.link, children: post.title.rendered }) }, post.id))) })] }))] })] }));
}
