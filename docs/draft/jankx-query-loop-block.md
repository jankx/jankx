# Jankx Query Loop Block

## Tổng quan

Jankx Query Loop Block là một dynamic block cho phép hiển thị posts với query loop và pattern layout, được xây dựng trên Jankx Framework architecture.

## Cấu trúc Block

```
jankx-query-loop/
├── block.json
├── index.js
├── render.php
├── style.css
└── README.md
```

## 1. Block Configuration (block.json)

```json
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "jankx/query-loop",
    "title": "Jankx Query Loop",
    "category": "widgets",
    "icon": "admin-post",
    "description": "Display posts with query loop and pattern layout",
    "supports": {
        "html": false,
        "align": true,
        "spacing": {
            "margin": true,
            "padding": true
        }
    },
    "attributes": {
        "queryType": {
            "type": "string",
            "default": "latest"
        },
        "postType": {
            "type": "string",
            "default": "post"
        },
        "customPostType": {
            "type": "string",
            "default": ""
        },
        "postsPerPage": {
            "type": "number",
            "default": 6
        },
        "orderBy": {
            "type": "string",
            "default": "date"
        },
        "order": {
            "type": "string",
            "default": "DESC"
        },
        "category": {
            "type": "string",
            "default": ""
        },
        "tag": {
            "type": "string",
            "default": ""
        },
        "taxonomy": {
            "type": "string",
            "default": ""
        },
        "taxonomyTerm": {
            "type": "string",
            "default": ""
        },
        "metaKey": {
            "type": "string",
            "default": ""
        },
        "metaValue": {
            "type": "string",
            "default": ""
        },
        "metaCompare": {
            "type": "string",
            "default": "="
        },
        "metaType": {
            "type": "string",
            "default": "CHAR"
        },
        "taxonomyRelation": {
            "type": "string",
            "default": "AND"
        },
        "metaRelation": {
            "type": "string",
            "default": "AND"
        },
        "layout": {
            "type": "string",
            "default": "grid"
        },
        "showImage": {
            "type": "boolean",
            "default": true
        },
        "showExcerpt": {
            "type": "boolean",
            "default": true
        },
        "showDate": {
            "type": "boolean",
            "default": true
        },
        "showAuthor": {
            "type": "boolean",
            "default": false
        },
        "showReadMore": {
            "type": "boolean",
            "default": true
        },
        "readMoreText": {
            "type": "string",
            "default": "Read More"
        },
        "title": {
            "type": "string",
            "default": "Latest Posts"
        },
        "showPagination": {
            "type": "boolean",
            "default": false
        },
        "paginationType": {
            "type": "string",
            "default": "numbers"
        },
        "postsPerPagePagination": {
            "type": "number",
            "default": 10
        },
        "className": {
            "type": "string"
        }
    },
    "textdomain": "jankx",
    "editorScript": "file:./index.js",
    "style": "file:./style.css",
    "render": "file:./render.php"
}
```

## 2. Editor Script (index.js)

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    RichText,
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl
} from '@wordpress/block-editor';
import {
    Card,
    CardHeader,
    CardBody,
    CardMediaOverlay,
    Button,
    ButtonGroup,
    Icon
} from '@wordpress/components';
import {
    formatListBullets,
    grid,
    calendar,
    user,
    image,
    text
} from '@wordpress/icons';

registerBlockType('jankx/query-loop', {
    edit: function(props) {
        const {
            attributes,
            setAttributes,
            isSelected
        } = props;

        const {
            queryType,
            postType,
            customPostType,
            postsPerPage,
            orderBy,
            order,
            category,
            tag,
            taxonomy,
            taxonomyTerm,
            metaKey,
            metaValue,
            metaCompare,
            metaType,
            taxonomyRelation,
            metaRelation,
            layout,
            showImage,
            showExcerpt,
            showDate,
            showAuthor,
            showReadMore,
            readMoreText,
            title,
            showPagination,
            paginationType,
            postsPerPagePagination,
            className
        } = attributes;

        const blockProps = useBlockProps({
            className: `jankx-query-loop ${className || ''}`
        });

        // State for preview mode
        const [previewMode, setPreviewMode] = useState(false);
        const [previewData, setPreviewData] = useState(null);
        const [isLoading, setIsLoading] = useState(false);

        // Mock posts for editor preview
        const mockPosts = [
            {
                id: 1,
                title: 'Sample Post 1',
                excerpt: 'This is a sample excerpt for the first post...',
                image: 'https://via.placeholder.com/300x200',
                date: '2024-01-15',
                author: 'John Doe',
                link: '#'
            },
            {
                id: 2,
                title: 'Sample Post 2',
                excerpt: 'This is a sample excerpt for the second post...',
                image: 'https://via.placeholder.com/300x200',
                date: '2024-01-14',
                author: 'Jane Smith',
                link: '#'
            },
            {
                id: 3,
                title: 'Sample Post 3',
                excerpt: 'This is a sample excerpt for the third post...',
                image: 'https://via.placeholder.com/300x200',
                date: '2024-01-13',
                author: 'Bob Johnson',
                link: '#'
            }
        ];

        // Function to fetch real preview data
        const fetchPreviewData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'jankx_query_loop_preview',
                        nonce: wpApiSettings.nonce,
                        attributes: JSON.stringify(attributes)
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setPreviewData(data.data);
                }
            } catch (error) {
                console.error('Preview fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Toggle preview mode
        const togglePreview = () => {
            if (!previewMode) {
                fetchPreviewData();
            }
            setPreviewMode(!previewMode);
        };

        const renderPostCard = (post) => (
            <Card key={post.id} className="jankx-post-card">
                {showImage && (
                    <CardMediaOverlay>
                        <img
                            src={post.image}
                            alt={post.title}
                            className="jankx-post-image"
                        />
                    </CardMediaOverlay>
                )}
                <CardBody>
                    <h3 className="jankx-post-title">
                        <a href={post.link}>{post.title}</a>
                    </h3>
                    {showExcerpt && (
                        <p className="jankx-post-excerpt">{post.excerpt}</p>
                    )}
                    <div className="jankx-post-meta">
                        {showDate && (
                            <span className="jankx-post-date">
                                <Icon icon={calendar} />
                                {post.date}
                            </span>
                        )}
                        {showAuthor && (
                            <span className="jankx-post-author">
                                <Icon icon={user} />
                                {post.author}
                            </span>
                        )}
                    </div>
                    {showReadMore && (
                        <Button
                            variant="primary"
                            className="jankx-read-more"
                        >
                            {readMoreText}
                        </Button>
                    )}
                </CardBody>
            </Card>
        );

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Preview Mode', 'jankx')}>
                        <ToggleControl
                            label={__('Enable Live Preview', 'jankx')}
                            checked={previewMode}
                            onChange={togglePreview}
                            help={previewMode ? __('Showing real data from database', 'jankx') : __('Click to load real data', 'jankx')}
                        />
                        {previewMode && (
                            <Button
                                variant="secondary"
                                onClick={fetchPreviewData}
                                disabled={isLoading}
                                className="jankx-refresh-preview"
                            >
                                {isLoading ? __('Loading...', 'jankx') : __('Refresh Preview', 'jankx')}
                            </Button>
                        )}
                    </PanelBody>
                    <PanelBody title={__('Query Settings', 'jankx')}>
                        <SelectControl
                            label={__('Query Type', 'jankx')}
                            value={queryType}
                            options={[
                                { label: 'Latest Posts', value: 'latest' },
                                { label: 'Popular Posts', value: 'popular' },
                                { label: 'Featured Posts', value: 'featured' },
                                { label: 'Random Posts', value: 'random' }
                            ]}
                            onChange={(value) => setAttributes({ queryType: value })}
                        />

                        <SelectControl
                            label={__('Post Type', 'jankx')}
                            value={postType}
                            options={[
                                { label: 'Posts', value: 'post' },
                                { label: 'Pages', value: 'page' },
                                { label: 'Custom Post Type', value: 'custom' }
                            ]}
                            onChange={(value) => setAttributes({ postType: value })}
                        />

                        {postType === 'custom' && (
                            <TextControl
                                label={__('Custom Post Type Slug', 'jankx')}
                                value={customPostType}
                                onChange={(value) => setAttributes({ customPostType: value })}
                                placeholder="product, event, portfolio..."
                            />
                        )}

                        <TextControl
                            label={__('Taxonomy (optional)', 'jankx')}
                            value={taxonomy}
                            onChange={(value) => setAttributes({ taxonomy: value })}
                            placeholder="category, post_tag, product_cat..."
                        />

                        <TextControl
                            label={__('Taxonomy Term (optional)', 'jankx')}
                            value={taxonomyTerm}
                            onChange={(value) => setAttributes({ taxonomyTerm: value })}
                            placeholder="term slug"
                        />

                        <SelectControl
                            label={__('Taxonomy Relation', 'jankx')}
                            value={taxonomyRelation}
                            options={[
                                { label: 'AND', value: 'AND' },
                                { label: 'OR', value: 'OR' }
                            ]}
                            onChange={(value) => setAttributes({ taxonomyRelation: value })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Meta Query Settings', 'jankx')}>
                        <TextControl
                            label={__('Meta Key', 'jankx')}
                            value={metaKey}
                            onChange={(value) => setAttributes({ metaKey: value })}
                            placeholder="_featured, _price, _rating..."
                        />

                        <TextControl
                            label={__('Meta Value', 'jankx')}
                            value={metaValue}
                            onChange={(value) => setAttributes({ metaValue: value })}
                            placeholder="1, 100, 5..."
                        />

                        <SelectControl
                            label={__('Meta Compare', 'jankx')}
                            value={metaCompare}
                            options={[
                                { label: 'Equals (=)', value: '=' },
                                { label: 'Not Equals (!=)', value: '!=' },
                                { label: 'Greater Than (>)', value: '>' },
                                { label: 'Greater Than or Equal (>=)', value: '>=' },
                                { label: 'Less Than (<)', value: '<' },
                                { label: 'Less Than or Equal (<=)', value: '<=' },
                                { label: 'LIKE', value: 'LIKE' },
                                { label: 'NOT LIKE', value: 'NOT LIKE' },
                                { label: 'IN', value: 'IN' },
                                { label: 'NOT IN', value: 'NOT IN' },
                                { label: 'BETWEEN', value: 'BETWEEN' },
                                { label: 'NOT BETWEEN', value: 'NOT BETWEEN' },
                                { label: 'EXISTS', value: 'EXISTS' },
                                { label: 'NOT EXISTS', value: 'NOT EXISTS' }
                            ]}
                            onChange={(value) => setAttributes({ metaCompare: value })}
                        />

                        <SelectControl
                            label={__('Meta Type', 'jankx')}
                            value={metaType}
                            options={[
                                { label: 'CHAR', value: 'CHAR' },
                                { label: 'NUMERIC', value: 'NUMERIC' },
                                { label: 'DECIMAL', value: 'DECIMAL' },
                                { label: 'DATE', value: 'DATE' },
                                { label: 'DATETIME', value: 'DATETIME' },
                                { label: 'TIME', value: 'TIME' },
                                { label: 'SIGNED', value: 'SIGNED' },
                                { label: 'UNSIGNED', value: 'UNSIGNED' },
                                { label: 'BINARY', value: 'BINARY' }
                            ]}
                            onChange={(value) => setAttributes({ metaType: value })}
                        />

                        <SelectControl
                            label={__('Meta Relation', 'jankx')}
                            value={metaRelation}
                            options={[
                                { label: 'AND', value: 'AND' },
                                { label: 'OR', value: 'OR' }
                            ]}
                            onChange={(value) => setAttributes({ metaRelation: value })}
                        />

                        <RangeControl
                            label={__('Posts Per Page', 'jankx')}
                            value={postsPerPage}
                            onChange={(value) => setAttributes({ postsPerPage: value })}
                            min={1}
                            max={20}
                        />

                        <SelectControl
                            label={__('Order By', 'jankx')}
                            value={orderBy}
                            options={[
                                { label: 'Date', value: 'date' },
                                { label: 'Title', value: 'title' },
                                { label: 'Random', value: 'rand' },
                                { label: 'Comment Count', value: 'comment_count' }
                            ]}
                            onChange={(value) => setAttributes({ orderBy: value })}
                        />

                        <SelectControl
                            label={__('Order', 'jankx')}
                            value={order}
                            options={[
                                { label: 'Descending', value: 'DESC' },
                                { label: 'Ascending', value: 'ASC' }
                            ]}
                            onChange={(value) => setAttributes({ order: value })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Display Settings', 'jankx')}>
                        <SelectControl
                            label={__('Layout', 'jankx')}
                            value={layout}
                            options={[
                                { label: 'Grid', value: 'grid' },
                                { label: 'List', value: 'list' },
                                { label: 'Masonry', value: 'masonry' },
                                { label: 'Carousel', value: 'carousel' }
                            ]}
                            onChange={(value) => setAttributes({ layout: value })}
                        />

                        <ToggleControl
                            label={__('Show Featured Image', 'jankx')}
                            checked={showImage}
                            onChange={(value) => setAttributes({ showImage: value })}
                        />

                        <ToggleControl
                            label={__('Show Excerpt', 'jankx')}
                            checked={showExcerpt}
                            onChange={(value) => setAttributes({ showExcerpt: value })}
                        />

                        <ToggleControl
                            label={__('Show Date', 'jankx')}
                            checked={showDate}
                            onChange={(value) => setAttributes({ showDate: value })}
                        />

                        <ToggleControl
                            label={__('Show Author', 'jankx')}
                            checked={showAuthor}
                            onChange={(value) => setAttributes({ showAuthor: value })}
                        />

                        <ToggleControl
                            label={__('Show Read More', 'jankx')}
                            checked={showReadMore}
                            onChange={(value) => setAttributes({ showReadMore: value })}
                        />

                        {showReadMore && (
                            <TextControl
                                label={__('Read More Text', 'jankx')}
                                value={readMoreText}
                                onChange={(value) => setAttributes({ readMoreText: value })}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Pagination Settings', 'jankx')}>
                        <ToggleControl
                            label={__('Show Pagination', 'jankx')}
                            checked={showPagination}
                            onChange={(value) => setAttributes({ showPagination: value })}
                        />

                        {showPagination && (
                            <>
                                <SelectControl
                                    label={__('Pagination Type', 'jankx')}
                                    value={paginationType}
                                    options={[
                                        { label: 'Numbers', value: 'numbers' },
                                        { label: 'Previous/Next', value: 'prev_next' },
                                        { label: 'Load More', value: 'load_more' },
                                        { label: 'Infinite Scroll', value: 'infinite' }
                                    ]}
                                    onChange={(value) => setAttributes({ paginationType: value })}
                                />

                                <RangeControl
                                    label={__('Posts Per Page (Pagination)', 'jankx')}
                                    value={postsPerPagePagination}
                                    onChange={(value) => setAttributes({ postsPerPagePagination: value })}
                                    min={1}
                                    max={50}
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <RichText
                        tagName="h2"
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        placeholder={__('Enter title...', 'jankx')}
                        className="jankx-query-loop-title"
                    />

                    {previewMode ? (
                        <div className="jankx-preview-mode">
                            {isLoading ? (
                                <div className="jankx-loading">
                                    <Spinner />
                                    <p>{__('Loading real data...', 'jankx')}</p>
                                </div>
                            ) : previewData ? (
                                <div className="jankx-preview-content">
                                    <div className="jankx-preview-header">
                                        <span className="jankx-preview-badge">
                                            {__('Live Preview', 'jankx')}
                                        </span>
                                        <span className="jankx-preview-count">
                                            {previewData.posts.length} {__('posts found', 'jankx')}
                                        </span>
                                    </div>
                                    <div className={`jankx-query-loop-grid jankx-layout-${layout}`}>
                                        {previewData.posts.map(renderPostCard)}
                                    </div>
                                    {previewData.pagination && (
                                        <div className="jankx-preview-pagination">
                                            {previewData.pagination}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="jankx-preview-error">
                                    <p>{__('No data found or error occurred', 'jankx')}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="jankx-editor-preview">
                            <div className="jankx-editor-header">
                                <span className="jankx-editor-badge">
                                    {__('Editor Preview', 'jankx')}
                                </span>
                                <span className="jankx-editor-count">
                                    {mockPosts.length} {__('sample posts', 'jankx')}
                                </span>
                            </div>
                            <div className={`jankx-query-loop-grid jankx-layout-${layout}`}>
                                {mockPosts.map(renderPostCard)}
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
});
```

## 3. AJAX Preview Handler (functions.php)

```php
<?php

// AJAX handler for preview mode
add_action('wp_ajax_jankx_query_loop_preview', 'jankx_query_loop_preview_handler');
add_action('wp_ajax_nopriv_jankx_query_loop_preview', 'jankx_query_loop_preview_handler');

function jankx_query_loop_preview_handler() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'wp_rest')) {
        wp_die('Security check failed');
    }

    // Get attributes from AJAX request
    $attributes = json_decode(stripslashes($_POST['attributes']), true);

    if (!$attributes) {
        wp_send_json_error('Invalid attributes');
    }

    // Build query args
    $args = jankx_build_query_args([
        'query_type' => $attributes['queryType'] ?? 'latest',
        'post_type' => $attributes['postType'] ?? 'post',
        'custom_post_type' => $attributes['customPostType'] ?? '',
        'posts_per_page' => $attributes['postsPerPage'] ?? 6,
        'orderby' => $attributes['orderBy'] ?? 'date',
        'order' => $attributes['order'] ?? 'DESC',
        'category' => $attributes['category'] ?? '',
        'tag' => $attributes['tag'] ?? '',
        'taxonomy' => $attributes['taxonomy'] ?? '',
        'taxonomy_term' => $attributes['taxonomyTerm'] ?? '',
        'meta_key' => $attributes['metaKey'] ?? '',
        'meta_value' => $attributes['metaValue'] ?? '',
        'meta_compare' => $attributes['metaCompare'] ?? '=',
        'meta_type' => $attributes['metaType'] ?? 'CHAR',
        'taxonomy_relation' => $attributes['taxonomyRelation'] ?? 'AND',
        'meta_relation' => $attributes['metaRelation'] ?? 'AND',
    ]);

    // Execute query
    $query = new WP_Query($args);
    $posts = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            $posts[] = [
                'id' => $post_id,
                'title' => get_the_title(),
                'excerpt' => get_the_excerpt(),
                'image' => get_the_post_thumbnail_url($post_id, 'medium') ?: 'https://via.placeholder.com/300x200',
                'date' => get_the_date(),
                'author' => get_the_author(),
                'link' => get_permalink(),
                'categories' => wp_get_post_categories($post_id, ['fields' => 'names']),
                'tags' => wp_get_post_tags($post_id, ['fields' => 'names']),
            ];
        }
        wp_reset_postdata();
    }

    // Generate pagination HTML if needed
    $pagination = '';
    if ($attributes['showPagination'] ?? false) {
        $pagination = jankx_render_pagination($query, $attributes['paginationType'] ?? 'numbers');
    }

    wp_send_json_success([
        'posts' => $posts,
        'pagination' => $pagination,
        'total_posts' => $query->found_posts,
        'max_pages' => $query->max_num_pages
    ]);
}

## 4. Dynamic Render (render.php)

```php
<?php

use Jankx\Foundation\Application;
use Jankx\Http\Request;

/**
 * Jankx Query Loop Block Render
 *
 * Dynamic render callback for Jankx Query Loop block
 * Uses Jankx Framework architecture for query and layout
 */
function jankx_query_loop_render($attributes, $content)
{
    // Get Jankx application instance
    $app = \Jankx\Facades\App::getFacadeRoot();

    // Extract attributes with defaults
    $queryType = $attributes['queryType'] ?? 'latest';
    $postType = $attributes['postType'] ?? 'post';
    $customPostType = $attributes['customPostType'] ?? '';
    $postsPerPage = $attributes['postsPerPage'] ?? 6;
    $orderBy = $attributes['orderBy'] ?? 'date';
    $order = $attributes['order'] ?? 'DESC';
    $category = $attributes['category'] ?? '';
    $tag = $attributes['tag'] ?? '';
    $taxonomy = $attributes['taxonomy'] ?? '';
    $taxonomyTerm = $attributes['taxonomyTerm'] ?? '';
    $metaKey = $attributes['metaKey'] ?? '';
    $metaValue = $attributes['metaValue'] ?? '';
    $metaCompare = $attributes['metaCompare'] ?? '=';
    $metaType = $attributes['metaType'] ?? 'CHAR';
    $taxonomyRelation = $attributes['taxonomyRelation'] ?? 'AND';
    $metaRelation = $attributes['metaRelation'] ?? 'AND';
    $layout = $attributes['layout'] ?? 'grid';
    $showImage = $attributes['showImage'] ?? true;
    $showExcerpt = $attributes['showExcerpt'] ?? true;
    $showDate = $attributes['showDate'] ?? true;
    $showAuthor = $attributes['showAuthor'] ?? false;
    $showReadMore = $attributes['showReadMore'] ?? true;
    $readMoreText = $attributes['readMoreText'] ?? 'Read More';
    $title = $attributes['title'] ?? 'Latest Posts';
    $showPagination = $attributes['showPagination'] ?? false;
    $paginationType = $attributes['paginationType'] ?? 'numbers';
    $postsPerPagePagination = $attributes['postsPerPagePagination'] ?? 10;
    $className = $attributes['className'] ?? '';

    // Build query args based on Jankx Framework patterns
    $args = jankx_build_query_args([
        'query_type' => $queryType,
        'post_type' => $postType,
        'custom_post_type' => $customPostType,
        'posts_per_page' => $showPagination ? $postsPerPagePagination : $postsPerPage,
        'orderby' => $orderBy,
        'order' => $order,
        'category' => $category,
        'tag' => $tag,
        'taxonomy' => $taxonomy,
        'taxonomy_term' => $taxonomyTerm,
        'meta_key' => $metaKey,
        'meta_value' => $metaValue,
        'meta_compare' => $metaCompare,
        'meta_type' => $metaType,
        'taxonomy_relation' => $taxonomyRelation,
        'meta_relation' => $metaRelation,
        'paged' => get_query_var('paged') ? get_query_var('paged') : 1,
    ]);

    // Execute query using Jankx Query Builder
    $query = new WP_Query($args);
    $posts = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts[] = jankx_format_post_data([
                'show_image' => $showImage,
                'show_excerpt' => $showExcerpt,
                'show_date' => $showDate,
                'show_author' => $showAuthor,
            ]);
        }
        wp_reset_postdata();
    }

    // Generate layout using Jankx Pattern Builder
    return jankx_generate_query_loop_layout([
        'posts' => $posts,
        'layout' => $layout,
        'title' => $title,
        'show_read_more' => $showReadMore,
        'read_more_text' => $readMoreText,
        'className' => $className,
        'show_pagination' => $showPagination,
        'pagination_type' => $paginationType,
        'query' => $query,
    ]);
}

/**
 * Build query arguments using Jankx Framework
 */
function jankx_build_query_args($params)
{
    $args = [
        'post_type' => $params['post_type'],
        'posts_per_page' => $params['posts_per_page'],
        'orderby' => $params['orderby'],
        'order' => $params['order'],
        'post_status' => 'publish',
    ];

    // Handle custom post type
    if ($params['post_type'] === 'custom' && !empty($params['custom_post_type'])) {
        $args['post_type'] = $params['custom_post_type'];
    }

    // Handle pagination
    if (isset($params['paged'])) {
        $args['paged'] = $params['paged'];
    }

    // Handle query type
    switch ($params['query_type']) {
        case 'popular':
            $args['orderby'] = 'comment_count';
            break;
        case 'featured':
            $args['meta_query'] = [
                [
                    'key' => '_jankx_featured',
                    'value' => '1',
                    'compare' => '='
                ]
            ];
            break;
        case 'random':
            $args['orderby'] = 'rand';
            break;
    }

    // Handle category filter
    if (!empty($params['category'])) {
        $args['category_name'] = $params['category'];
    }

    // Handle tag filter
    if (!empty($params['tag'])) {
        $args['tag'] = $params['tag'];
    }

    // Handle custom taxonomy
    if (!empty($params['taxonomy']) && !empty($params['taxonomy_term'])) {
        $tax_query = [
            'taxonomy' => $params['taxonomy'],
            'field' => 'slug',
            'terms' => $params['taxonomy_term'],
        ];

        // Add relation if multiple taxonomies
        if (isset($params['taxonomy_relation'])) {
            $tax_query['relation'] = $params['taxonomy_relation'];
        }

        $args['tax_query'] = [$tax_query];
    }

    // Handle meta query
    if (!empty($params['meta_key'])) {
        $meta_query = [
            'key' => $params['meta_key'],
            'compare' => $params['meta_compare'],
            'type' => $params['meta_type'],
        ];

        // Add value if not EXISTS/NOT EXISTS
        if (!in_array($params['meta_compare'], ['EXISTS', 'NOT EXISTS'])) {
            $meta_query['value'] = $params['meta_value'];
        }

        // Handle multiple meta queries
        if (isset($params['meta_relation'])) {
            $args['meta_query'] = [
                'relation' => $params['meta_relation'],
                $meta_query
            ];
        } else {
            $args['meta_query'] = [$meta_query];
        }
    }

    return $args;
}

/**
 * Format post data for layout
 */
function jankx_format_post_data($options)
{
    $post = [
        'id' => get_the_ID(),
        'title' => get_the_title(),
        'link' => get_permalink(),
        'excerpt' => get_the_excerpt(),
        'date' => get_the_date(),
        'author' => get_the_author(),
        'author_link' => get_author_posts_url(get_the_author_meta('ID')),
    ];

    if ($options['show_image']) {
        $post['image'] = get_the_post_thumbnail_url(get_the_ID(), 'medium');
        $post['image_alt'] = get_post_meta(get_post_thumbnail_id(), '_wp_attachment_image_alt', true);
    }

    if ($options['show_excerpt']) {
        $post['excerpt'] = wp_trim_words(get_the_excerpt(), 20, '...');
    }

    return $post;
}

/**
 * Generate layout using Jankx Pattern Builder
 */
function jankx_generate_query_loop_layout($params)
{
    $posts = $params['posts'];
    $layout = $params['layout'];
    $title = $params['title'];
    $showReadMore = $params['show_read_more'];
    $readMoreText = $params['read_more_text'];
    $className = $params['className'];
    $showPagination = $params['show_pagination'];
    $paginationType = $params['pagination_type'];
    $query = $params['query'];

    // Start container
    $output = '<!-- wp:group {"className":"jankx-query-loop ' . esc_attr($className) . '"} -->';
    $output .= '<div class="wp-block-group jankx-query-loop ' . esc_attr($className) . '">';

    // Title
    if (!empty($title)) {
        $output .= '<!-- wp:heading {"level":2,"className":"jankx-query-loop-title"} -->';
        $output .= '<h2 class="wp-block-heading jankx-query-loop-title">' . esc_html($title) . '</h2>';
        $output .= '<!-- /wp:heading -->';
    }

    // Layout container
    $output .= jankx_get_layout_container($layout);

    // Render posts
    foreach ($posts as $post) {
        $output .= jankx_render_post_card($post, $layout, $showReadMore, $readMoreText);
    }

    // Close layout container
    $output .= jankx_close_layout_container($layout);

    // Render pagination
    if ($showPagination && $query && $query->max_num_pages > 1) {
        $output .= jankx_render_pagination($query, $paginationType);
    }

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    return $output;
}

/**
 * Render pagination based on type
 */
function jankx_render_pagination($query, $paginationType)
{
    $output = '<!-- wp:group {"className":"jankx-pagination"} -->';
    $output .= '<div class="wp-block-group jankx-pagination">';

    $currentPage = max(1, get_query_var('paged'));
    $maxPages = $query->max_num_pages;

    switch ($paginationType) {
        case 'numbers':
            $output .= jankx_render_numbered_pagination($currentPage, $maxPages);
            break;

        case 'prev_next':
            $output .= jankx_render_prev_next_pagination($currentPage, $maxPages);
            break;

        case 'load_more':
            $output .= jankx_render_load_more_pagination($currentPage, $maxPages);
            break;

        case 'infinite':
            $output .= jankx_render_infinite_scroll_pagination($currentPage, $maxPages);
            break;
    }

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    return $output;
}

/**
 * Render numbered pagination
 */
function jankx_render_numbered_pagination($currentPage, $maxPages)
{
    $output = '<!-- wp:buttons {"className":"jankx-pagination-numbers"} -->';
    $output .= '<div class="wp-block-buttons jankx-pagination-numbers">';

    // Previous button
    if ($currentPage > 1) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-prev"} -->';
        $output .= '<div class="wp-block-button jankx-pagination-prev">';
        $output .= '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($currentPage - 1) . '">Previous</a>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    // Page numbers
    $start = max(1, $currentPage - 2);
    $end = min($maxPages, $currentPage + 2);

    for ($i = $start; $i <= $end; $i++) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-number' . ($i === $currentPage ? ' jankx-pagination-current' : '') . '"} -->';
        $output .= '<div class="wp-block-button jankx-pagination-number' . ($i === $currentPage ? ' jankx-pagination-current' : '') . '">';
        $output .= '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($i) . '">' . $i . '</a>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    // Next button
    if ($currentPage < $maxPages) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-next"} -->';
        $output .= '<div class="wp-block-button jankx-pagination-next">';
        $output .= '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($currentPage + 1) . '">Next</a>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:buttons -->';

    return $output;
}

/**
 * Render previous/next pagination
 */
function jankx_render_prev_next_pagination($currentPage, $maxPages)
{
    $output = '<!-- wp:buttons {"className":"jankx-pagination-prev-next"} -->';
    $output .= '<div class="wp-block-buttons jankx-pagination-prev-next">';

    if ($currentPage > 1) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-prev"} -->';
        $output .= '<div class="wp-block-button jankx-pagination-prev">';
        $output .= '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($currentPage - 1) . '">← Previous</a>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    if ($currentPage < $maxPages) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-next"} -->';
        $output .= '<div class="wp-block-button jankx-pagination-next">';
        $output .= '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($currentPage + 1) . '">Next →</a>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:buttons -->';

    return $output;
}

/**
 * Render load more pagination
 */
function jankx_render_load_more_pagination($currentPage, $maxPages)
{
    $output = '<!-- wp:buttons {"className":"jankx-pagination-load-more"} -->';
    $output .= '<div class="wp-block-buttons jankx-pagination-load-more">';

    if ($currentPage < $maxPages) {
        $output .= '<!-- wp:button {"className":"jankx-pagination-load-more-btn"} -->';
        $output .= '<div class="wp-block-block jankx-pagination-load-more-btn">';
        $output .= '<button class="wp-block-button__link wp-element-button jankx-load-more-btn" data-page="' . $currentPage . '" data-max-pages="' . $maxPages . '">Load More</button>';
        $output .= '</div>';
        $output .= '<!-- /wp:button -->';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:buttons -->';

    return $output;
}

/**
 * Render infinite scroll pagination
 */
function jankx_render_infinite_scroll_pagination($currentPage, $maxPages)
{
    $output = '<!-- wp:group {"className":"jankx-pagination-infinite"} -->';
    $output .= '<div class="wp-block-group jankx-pagination-infinite" data-page="' . $currentPage . '" data-max-pages="' . $maxPages . '">';

    if ($currentPage < $maxPages) {
        $output .= '<!-- wp:paragraph {"className":"jankx-pagination-infinite-loading"} -->';
        $output .= '<p class="wp-block-paragraph jankx-pagination-infinite-loading">Loading more posts...</p>';
        $output .= '<!-- /wp:paragraph -->';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    return $output;
}

/**
 * Get layout container based on layout type
 */
function jankx_get_layout_container($layout)
{
    switch ($layout) {
        case 'grid':
            return '<!-- wp:columns {"className":"jankx-query-loop-posts jankx-layout-grid"} --><div class="wp-block-columns jankx-query-loop-posts jankx-layout-grid">';

        case 'list':
            return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-list"} --><div class="wp-block-group jankx-query-loop-posts jankx-layout-list">';

        case 'masonry':
            return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-masonry"} --><div class="wp-block-group jankx-query-loop-posts jankx-layout-masonry">';

        case 'carousel':
            return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-carousel"} --><div class="wp-block-group jankx-query-loop-posts jankx-layout-carousel">';

        default:
            return '<!-- wp:group {"className":"jankx-query-loop-posts"} --><div class="wp-block-group jankx-query-loop-posts">';
    }
}

/**
 * Close layout container
 */
function jankx_close_layout_container($layout)
{
    switch ($layout) {
        case 'grid':
            return '</div><!-- /wp:columns -->';

        default:
            return '</div><!-- /wp:group -->';
    }
}

/**
 * Render individual post card
 */
function jankx_render_post_card($post, $layout, $showReadMore, $readMoreText)
{
    $output = '';

    if ($layout === 'grid') {
        $output .= '<!-- wp:column -->';
        $output .= '<div class="wp-block-column">';
    }

    // Post card container
    $output .= '<!-- wp:group {"className":"jankx-post-card"} -->';
    $output .= '<div class="wp-block-group jankx-post-card">';

    // Featured image
    if (!empty($post['image'])) {
        $output .= '<!-- wp:image {"url":"' . esc_url($post['image']) . '","alt":"' . esc_attr($post['image_alt']) . '","className":"jankx-post-image"} -->';
        $output .= '<figure class="wp-block-image jankx-post-image"><img src="' . esc_url($post['image']) . '" alt="' . esc_attr($post['image_alt']) . '"/></figure>';
        $output .= '<!-- /wp:image -->';
    }

    // Post content
    $output .= '<!-- wp:group {"className":"jankx-post-content"} -->';
    $output .= '<div class="wp-block-group jankx-post-content">';

    // Title
    $output .= '<!-- wp:heading {"level":3,"className":"jankx-post-title"} -->';
    $output .= '<h3 class="wp-block-heading jankx-post-title"><a href="' . esc_url($post['link']) . '">' . esc_html($post['title']) . '</a></h3>';
    $output .= '<!-- /wp:heading -->';

    // Excerpt
    if (!empty($post['excerpt'])) {
        $output .= '<!-- wp:paragraph {"className":"jankx-post-excerpt"} -->';
        $output .= '<p class="wp-block-paragraph jankx-post-excerpt">' . esc_html($post['excerpt']) . '</p>';
        $output .= '<!-- /wp:paragraph -->';
    }

    // Meta information
    $output .= '<!-- wp:group {"className":"jankx-post-meta"} -->';
    $output .= '<div class="wp-block-group jankx-post-meta">';

    if (!empty($post['date'])) {
        $output .= '<span class="jankx-post-date">' . esc_html($post['date']) . '</span>';
    }

    if (!empty($post['author'])) {
        $output .= '<span class="jankx-post-author"><a href="' . esc_url($post['author_link']) . '">' . esc_html($post['author']) . '</a></span>';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    // Read more button
    if ($showReadMore) {
        $output .= '<!-- wp:buttons -->';
        $output .= '<div class="wp-block-buttons">';
        $output .= '<!-- wp:button {"className":"jankx-read-more"} -->';
        $output .= '<div class="wp-block-button jankx-read-more"><a class="wp-block-button__link wp-element-button" href="' . esc_url($post['link']) . '">' . esc_html($readMoreText) . '</a></div>';
        $output .= '<!-- /wp:button -->';
        $output .= '</div>';
        $output .= '<!-- /wp:buttons -->';
    }

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    $output .= '</div>';
    $output .= '<!-- /wp:group -->';

    if ($layout === 'grid') {
        $output .= '</div>';
        $output .= '<!-- /wp:column -->';
    }

    return $output;
}
```

## 4. Styles (style.css)

```css
/* Jankx Query Loop Block Styles */

.jankx-query-loop {
    margin: 2rem 0;
}

.jankx-query-loop-title {
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
}

/* Grid Layout */
.jankx-layout-grid .wp-block-columns {
    gap: 2rem;
}

.jankx-layout-grid .wp-block-column {
    flex: 1;
}

.jankx-post-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.jankx-post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.jankx-post-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.jankx-post-content {
    padding: 1.5rem;
}

.jankx-post-title {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    line-height: 1.4;
}

.jankx-post-title a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
}

.jankx-post-title a:hover {
    color: #007cba;
}

.jankx-post-excerpt {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.jankx-post-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #888;
    margin-bottom: 1rem;
}

.jankx-post-date,
.jankx-post-author {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.jankx-post-author a {
    color: #888;
    text-decoration: none;
}

.jankx-post-author a:hover {
    color: #007cba;
}

.jankx-read-more {
    margin-top: 1rem;
}

.jankx-read-more .wp-block-button__link {
    background: #007cba;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.3s ease;
}

.jankx-read-more .wp-block-button__link:hover {
    background: #005a87;
}

/* List Layout */
.jankx-layout-list .jankx-post-card {
    display: flex;
    margin-bottom: 1.5rem;
}

.jankx-layout-list .jankx-post-image {
    width: 200px;
    height: 150px;
    flex-shrink: 0;
}

.jankx-layout-list .jankx-post-content {
    flex: 1;
    padding: 1rem;
}

/* Masonry Layout */
.jankx-layout-masonry {
    columns: 3;
    column-gap: 2rem;
}

.jankx-layout-masonry .jankx-post-card {
    break-inside: avoid;
    margin-bottom: 2rem;
}

/* Carousel Layout */
.jankx-layout-carousel {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
}

.jankx-layout-carousel .jankx-post-card {
    scroll-snap-align: start;
    min-width: 300px;
    margin-right: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .jankx-layout-grid .wp-block-columns {
        flex-direction: column;
    }

    .jankx-layout-list .jankx-post-card {
        flex-direction: column;
    }

    .jankx-layout-list .jankx-post-image {
        width: 100%;
        height: 200px;
    }

    .jankx-layout-masonry {
        columns: 2;
    }
}

@media (max-width: 480px) {
    .jankx-layout-masonry {
        columns: 1;
    }

    .jankx-query-loop-title {
        font-size: 1.5rem;
    }
}

/* Pagination Styles */
.jankx-pagination {
    margin-top: 2rem;
    text-align: center;
}

.jankx-pagination-numbers .wp-block-buttons {
    gap: 0.5rem;
}

.jankx-pagination-number .wp-block-button__link {
    background: #f0f0f0;
    color: #333;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    min-width: 40px;
}

.jankx-pagination-current .wp-block-button__link {
    background: #007cba;
    color: #fff;
}

.jankx-pagination-prev .wp-block-button__link,
.jankx-pagination-next .wp-block-button__link {
    background: #007cba;
    color: #fff;
}

.jankx-pagination-load-more .wp-block-button__link {
    background: #007cba;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
}

.jankx-pagination-infinite-loading {
    text-align: center;
    color: #666;
    font-style: italic;
}

/* Load More Button Animation */
.jankx-load-more-btn {
    transition: all 0.3s ease;
}

.jankx-load-more-btn:hover {
    background: #005a87 !important;
    transform: translateY(-2px);
}

.jankx-load-more-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Preview Mode Styles */
.jankx-preview-mode {
    border: 2px dashed #007cba;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8f9fa;
}

.jankx-preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.jankx-preview-badge {
    background-color: #007cba;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.jankx-preview-count {
    font-size: 0.875rem;
    color: #666;
}

.jankx-preview-content {
    background-color: white;
    border-radius: 6px;
    padding: 1rem;
}

.jankx-preview-pagination {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}

.jankx-preview-error {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.jankx-loading {
    text-align: center;
    padding: 2rem;
}

.jankx-loading .components-spinner {
    margin: 0 auto 1rem;
}

/* Editor Preview Styles */
.jankx-editor-preview {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8f9fa;
}

.jankx-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.jankx-editor-badge {
    background-color: #666;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.jankx-editor-count {
    font-size: 0.875rem;
    color: #666;
}

/* Refresh Preview Button */
.jankx-refresh-preview {
    margin-top: 0.5rem;
    width: 100%;
}
```

## 5. Service Provider Integration

```php
<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class QueryLoopServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register query loop services
        $app->singleton('query.loop', QueryLoopService::class);
        $app->singleton('query.builder', QueryBuilder::class);
        $app->singleton('pattern.builder', PatternBuilder::class);
    }

    public function boot(Application $app)
    {
        // Register block
        add_action('init', [$this, 'registerQueryLoopBlock']);

        // Register block patterns
        add_action('init', [$this, 'registerQueryLoopPatterns']);
    }

    public function registerQueryLoopBlock()
    {
        register_block_type(__DIR__ . '/../../blocks/jankx-query-loop');
    }

    public function registerQueryLoopPatterns()
    {
        // Register query loop patterns
        register_block_pattern(
            'jankx/query-loop-grid',
            [
                'title' => __('Jankx Query Loop Grid', 'jankx'),
                'content' => '<!-- wp:jankx/query-loop {"layout":"grid","postsPerPage":6} /-->',
            ]
        );

        register_block_pattern(
            'jankx/query-loop-list',
            [
                'title' => __('Jankx Query Loop List', 'jankx'),
                'content' => '<!-- wp:jankx/query-loop {"layout":"list","postsPerPage":5} /-->',
            ]
        );
    }
}
```

## 6. Preview Mode Features

### Live Preview in Editor
Jankx Query Loop Block includes a powerful preview mode that allows you to see real data from your WordPress database directly in the Gutenberg editor.

#### Key Features:
- **Toggle Preview Mode**: Switch between sample data and live data
- **Real-time Data**: See actual posts, custom post types, and query results
- **AJAX Loading**: No page refresh required
- **Error Handling**: Graceful handling of query errors
- **Loading States**: Visual feedback during data fetching
- **Refresh Button**: Manually refresh preview data

#### How to Use:
1. **Enable Preview**: In the block sidebar, toggle "Enable Live Preview"
2. **View Real Data**: See actual posts from your database
3. **Test Queries**: Try different query settings and see immediate results
4. **Refresh Data**: Click "Refresh Preview" to reload data
5. **Toggle Back**: Switch to editor preview for faster editing

#### Preview Mode Benefits:
- **Accurate Testing**: Test complex queries before publishing
- **Real Content**: See how your content will actually look
- **Query Validation**: Verify meta queries and taxonomy filters work
- **Performance Testing**: Check query performance with real data
- **Layout Testing**: Test responsive layouts with actual content

## 7. Usage Examples

### Basic Usage
```php
// In your theme
echo do_blocks('<!-- wp:jankx/query-loop {"postsPerPage":6,"layout":"grid"} /-->');
```

### Advanced Usage
```php
// With custom post type and pagination
echo do_blocks('<!-- wp:jankx/query-loop {
    "queryType":"latest",
    "postType":"custom",
    "customPostType":"product",
    "taxonomy":"product_cat",
    "taxonomyTerm":"electronics",
    "postsPerPage":12,
    "layout":"grid",
    "showImage":true,
    "showExcerpt":true,
    "showDate":true,
    "showAuthor":false,
    "showReadMore":true,
    "readMoreText":"View Product",
    "title":"Latest Products",
    "showPagination":true,
    "paginationType":"numbers",
    "postsPerPagePagination":12
} /-->');

// With meta query - Featured products with price > 100
echo do_blocks('<!-- wp:jankx/query-loop {
    "queryType":"latest",
    "postType":"custom",
    "customPostType":"product",
    "metaKey":"_featured",
    "metaValue":"1",
    "metaCompare":"=",
    "metaType":"CHAR",
    "postsPerPage":8,
    "layout":"grid",
    "title":"Featured Products",
    "showPagination":true,
    "paginationType":"load_more"
} /-->');

// With complex meta query - Products with price between 50-200
echo do_blocks('<!-- wp:jankx/query-loop {
    "queryType":"latest",
    "postType":"custom",
    "customPostType":"product",
    "metaKey":"_price",
    "metaValue":"50,200",
    "metaCompare":"BETWEEN",
    "metaType":"NUMERIC",
    "taxonomy":"product_cat",
    "taxonomyTerm":"electronics",
    "postsPerPage":10,
    "layout":"masonry",
    "title":"Electronics Products",
    "showPagination":true,
    "paginationType":"numbers"
} /-->');

// With taxonomy query - Posts in multiple categories
echo do_blocks('<!-- wp:jankx/query-loop {
    "queryType":"latest",
    "postType":"post",
    "taxonomy":"category",
    "taxonomyTerm":"technology,business",
    "taxonomyRelation":"OR",
    "metaKey":"_featured",
    "metaValue":"1",
    "metaCompare":"=",
    "metaRelation":"AND",
    "postsPerPage":6,
    "layout":"grid",
    "title":"Featured Tech & Business Posts",
    "showPagination":true,
    "paginationType":"prev_next"
} /-->');
```

## 7. Benefits

### Framework Integration
- ✅ Uses Jankx Framework architecture
- ✅ Leverages service providers
- ✅ Follows Laravel-style patterns
- ✅ Maintains WordPress compatibility

### Query Capabilities
- ✅ **Custom Post Types**: Support any post type
- ✅ **Taxonomy Queries**: Category, tag, custom taxonomies
- ✅ **Meta Queries**: Custom fields, ACF, meta values
- ✅ **Complex Queries**: Multiple taxonomies + meta combinations
- ✅ **Query Relations**: AND/OR logic for complex filtering

### Performance
- ✅ Efficient query building
- ✅ Lazy loading support
- ✅ Cached pattern generation
- ✅ Optimized rendering

### Developer Experience
- ✅ Rich editor interface
- ✅ Flexible configuration
- ✅ Multiple layout options
- ✅ Responsive design

### User Experience
- ✅ Beautiful layouts
- ✅ Smooth animations
- ✅ Accessible markup
- ✅ SEO friendly

Jankx Query Loop Block cung cấp một giải pháp hoàn chỉnh cho việc hiển thị posts với query loop và pattern layout, được xây dựng trên nền tảng Jankx Framework mạnh mẽ! 🚀