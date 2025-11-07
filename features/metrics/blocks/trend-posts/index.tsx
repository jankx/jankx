import { registerBlockType } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import './style.css';

interface TrendPostsBlockAttributes {
    postsPerPage: number;
    showThumbnail: boolean;
    showTitle: boolean;
    showExcerpt: boolean;
    showDate: boolean;
    showViews: boolean;
}

interface TrendPostsBlockEditProps {
    attributes: TrendPostsBlockAttributes;
    setAttributes: (attributes: Partial<TrendPostsBlockAttributes>) => void;
}

const generateMockTitle = (index: number): string => {
    return sprintf(__('Sample trending post %d', 'jankx'), index + 1);
};

const mockExcerpt = __('This is a preview excerpt that gives a quick summary of the post content for demonstration.', 'jankx');

const mockDate = __('January 1, 2025', 'jankx');

const mockViews = __('12.3K views', 'jankx');

registerBlockType<TrendPostsBlockAttributes>('jankx/trend-posts', {
    title: __('Trend Posts', 'jankx'),
    category: 'widgets',
    icon: 'chart-line',
    description: __('Display trending posts based on view count', 'jankx'),
    attributes: {
        postsPerPage: {
            type: 'number',
            default: 1
        },
        showThumbnail: {
            type: 'boolean',
            default: true
        },
        showTitle: {
            type: 'boolean',
            default: true
        },
        showExcerpt: {
            type: 'boolean',
            default: false
        },
        showDate: {
            type: 'boolean',
            default: true
        },
        showViews: {
            type: 'boolean',
            default: true
        }
    },
    edit: function Edit({ attributes, setAttributes }: TrendPostsBlockEditProps) {
        const { postsPerPage, showThumbnail, showTitle, showExcerpt, showDate, showViews } = attributes;

        const blockProps = useBlockProps({
            className: 'jankx-trend-posts-block'
        });

        const className = blockProps.className ?? '';
        const isHotBadgeStyle = className.includes('is-style-hot-badge');
        const displayCount = isHotBadgeStyle ? 1 : Math.max(1, Math.min(postsPerPage, 5));

        const mockPosts = Array.from({ length: displayCount }).map((_, index) => ({
            title: generateMockTitle(index),
            excerpt: mockExcerpt,
            date: mockDate,
            views: mockViews,
            id: index
        }));

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Settings', 'jankx')}>
                        <RangeControl
                            label={__('Number of Posts', 'jankx')}
                            value={postsPerPage}
                            onChange={(value: number) => setAttributes({ postsPerPage: value })}
                            min={1}
                            max={10}
                        />
                        <ToggleControl
                            label={__('Show Thumbnail', 'jankx')}
                            checked={showThumbnail}
                            onChange={(value: boolean) => setAttributes({ showThumbnail: value })}
                            disabled={isHotBadgeStyle}
                            help={isHotBadgeStyle ? __('Thumbnails are hidden in Hot Badge style.', 'jankx') : undefined}
                        />
                        <ToggleControl
                            label={__('Show Title', 'jankx')}
                            checked={showTitle}
                            onChange={(value: boolean) => setAttributes({ showTitle: value })}
                        />
                        <ToggleControl
                            label={__('Show Excerpt', 'jankx')}
                            checked={showExcerpt}
                            onChange={(value: boolean) => setAttributes({ showExcerpt: value })}
                            disabled={isHotBadgeStyle}
                            help={isHotBadgeStyle ? __('Excerpt is hidden in Hot Badge style.', 'jankx') : undefined}
                        />
                        <ToggleControl
                            label={__('Show Date', 'jankx')}
                            checked={showDate}
                            onChange={(value: boolean) => setAttributes({ showDate: value })}
                            disabled={isHotBadgeStyle}
                            help={isHotBadgeStyle ? __('Date is hidden in Hot Badge style.', 'jankx') : undefined}
                        />
                        <ToggleControl
                            label={__('Show Views', 'jankx')}
                            checked={showViews}
                            onChange={(value: boolean) => setAttributes({ showViews: value })}
                            disabled={isHotBadgeStyle}
                            help={isHotBadgeStyle ? __('View counter is hidden in Hot Badge style.', 'jankx') : undefined}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="trend-posts-container">
                        {mockPosts.map((post) => (
                            <article
                                key={post.id}
                                className={`trend-post-item${isHotBadgeStyle ? ' trend-post-item-hot' : ''}`}
                            >
                                {showThumbnail && !isHotBadgeStyle && (
                                    <div className="trend-post-thumbnail">
                                        <span className="trend-post-thumbnail-placeholder" aria-hidden="true" />
                                    </div>
                                )}

                                <div className="trend-post-content">
                                    {isHotBadgeStyle && (
                                        <span className="trend-post-badge" aria-hidden="true">
                                            {__('Xu hướng HOT', 'jankx')}
                                        </span>
                                    )}

                                    {showTitle && (
                                        <h3 className="trend-post-title">
                                            <span>{post.title}</span>
                                        </h3>
                                    )}

                                    {showExcerpt && !isHotBadgeStyle && (
                                        <div className="trend-post-excerpt">
                                            <p>{post.excerpt}</p>
                                        </div>
                                    )}

                                    {(!isHotBadgeStyle && (showDate || showViews)) && (
                                        <div className="trend-post-meta">
                                            {showDate && (
                                                <span className="trend-post-date">
                                                    <time dateTime="2025-01-01">{post.date}</time>
                                                </span>
                                            )}
                                            {showViews && (
                                                <span className="trend-post-views">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                    </svg>
                                                    <span>{post.views}</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </>
        );
    },
    save: function save(): null {
        return null; // Dynamic block
    }
});


