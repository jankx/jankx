# Jankx Query Loop Block - PHP Classes Architecture

## Tổng quan

Thay vì sử dụng các function riêng lẻ trong `render.php`, chúng ta sẽ refactor thành các PHP class để dễ bảo trì và mở rộng hơn.

## Cấu trúc Classes

### 1. Query Builder Class

```php
<?php
/**
 * Jankx Query Builder Class
 * Xử lý việc tạo WP_Query arguments
 */
class Jankx_Query_Builder
{
    private $params;
    private $args;

    public function __construct($params = [])
    {
        $this->params = $params;
        $this->args = [];
        $this->build();
    }

    /**
     * Build query arguments
     */
    private function build()
    {
        $this->setBasicArgs();
        $this->handleCustomPostType();
        $this->handlePagination();
        $this->handleQueryType();
        $this->handleCategoryFilter();
        $this->handleTagFilter();
        $this->handleTaxonomyQuery();
        $this->handleMetaQuery();
    }

    /**
     * Set basic query arguments
     */
    private function setBasicArgs()
    {
        $this->args = [
            'post_type' => $this->params['post_type'] ?? 'post',
            'posts_per_page' => $this->params['posts_per_page'] ?? 6,
            'orderby' => $this->params['orderby'] ?? 'date',
            'order' => $this->params['order'] ?? 'DESC',
            'post_status' => 'publish',
        ];
    }

    /**
     * Handle custom post type
     */
    private function handleCustomPostType()
    {
        if ($this->params['post_type'] === 'custom' && !empty($this->params['custom_post_type'])) {
            $this->args['post_type'] = $this->params['custom_post_type'];
        }
    }

    /**
     * Handle pagination
     */
    private function handlePagination()
    {
        if (isset($this->params['paged'])) {
            $this->args['paged'] = $this->params['paged'];
        }
    }

    /**
     * Handle query type (popular, featured, random)
     */
    private function handleQueryType()
    {
        switch ($this->params['query_type'] ?? 'latest') {
            case 'popular':
                $this->args['orderby'] = 'comment_count';
                break;
            case 'featured':
                $this->args['meta_query'] = [
                    [
                        'key' => '_jankx_featured',
                        'value' => '1',
                        'compare' => '='
                    ]
                ];
                break;
            case 'random':
                $this->args['orderby'] = 'rand';
                break;
        }
    }

    /**
     * Handle category filter
     */
    private function handleCategoryFilter()
    {
        if (!empty($this->params['category'])) {
            $this->args['category_name'] = $this->params['category'];
        }
    }

    /**
     * Handle tag filter
     */
    private function handleTagFilter()
    {
        if (!empty($this->params['tag'])) {
            $this->args['tag'] = $this->params['tag'];
        }
    }

    /**
     * Handle taxonomy query
     */
    private function handleTaxonomyQuery()
    {
        if (!empty($this->params['taxonomy']) && !empty($this->params['taxonomy_term'])) {
            $tax_terms = explode(',', $this->params['taxonomy_term']);
            $tax_query = [
                'taxonomy' => $this->params['taxonomy'],
                'field' => 'slug',
                'terms' => array_map('trim', $tax_terms),
            ];

            if (isset($this->params['taxonomy_relation'])) {
                $tax_query['relation'] = $this->params['taxonomy_relation'];
            }

            $this->args['tax_query'] = [$tax_query];
        }
    }

    /**
     * Handle meta query
     */
    private function handleMetaQuery()
    {
        if (!empty($this->params['meta_key'])) {
            $meta_value = $this->params['meta_value'];
            if (in_array($this->params['meta_compare'], ['IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN'])) {
                $meta_value = array_map('trim', explode(',', $meta_value));
            }

            $meta_query = [
                'key' => $this->params['meta_key'],
                'compare' => $this->params['meta_compare'],
                'type' => $this->params['meta_type'],
            ];

            if (!in_array($this->params['meta_compare'], ['EXISTS', 'NOT EXISTS'])) {
                $meta_query['value'] = $meta_value;
            }

            if (isset($this->params['meta_relation'])) {
                $this->args['meta_query'] = [
                    'relation' => $this->params['meta_relation'],
                    $meta_query
                ];
            } else {
                $this->args['meta_query'] = [$meta_query];
            }
        }
    }

    /**
     * Get query arguments
     */
    public function getArgs()
    {
        return $this->args;
    }

    /**
     * Execute query
     */
    public function execute()
    {
        return new WP_Query($this->args);
    }
}
```

### 2. Post Formatter Class

```php
<?php
/**
 * Jankx Post Formatter Class
 * Xử lý việc format dữ liệu post
 */
class Jankx_Post_Formatter
{
    private $options;

    public function __construct($options = [])
    {
        $this->options = $options;
    }

    /**
     * Format post data
     */
    public function format($post_id = null)
    {
        if (!$post_id) {
            $post_id = get_the_ID();
        }

        $post = [
            'id' => $post_id,
            'title' => get_the_title($post_id),
            'link' => get_permalink($post_id),
            'excerpt' => get_the_excerpt($post_id),
            'date' => get_the_date('', $post_id),
            'author' => get_the_author_meta('display_name', get_post_field('post_author', $post_id)),
            'author_link' => get_author_posts_url(get_post_field('post_author', $post_id)),
        ];

        if ($this->options['show_image'] ?? false) {
            $post['image'] = get_the_post_thumbnail_url($post_id, 'medium');
            $post['image_alt'] = get_post_meta(get_post_thumbnail_id($post_id), '_wp_attachment_image_alt', true);
        }

        if ($this->options['show_excerpt'] ?? false) {
            $post['excerpt'] = wp_trim_words(get_the_excerpt($post_id), 20, '...');
        }

        return $post;
    }

    /**
     * Format multiple posts
     */
    public function formatMultiple($query)
    {
        $posts = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = $this->format();
            }
            wp_reset_postdata();
        }

        return $posts;
    }
}
```

### 3. Layout Generator Class

```php
<?php
/**
 * Jankx Layout Generator Class
 * Xử lý việc tạo layout HTML
 */
class Jankx_Layout_Generator
{
    private $posts;
    private $layout;
    private $title;
    private $showReadMore;
    private $readMoreText;
    private $className;
    private $showPagination;
    private $paginationType;
    private $query;

    public function __construct($params = [])
    {
        $this->posts = $params['posts'] ?? [];
        $this->layout = $params['layout'] ?? 'grid';
        $this->title = $params['title'] ?? '';
        $this->showReadMore = $params['show_read_more'] ?? false;
        $this->readMoreText = $params['read_more_text'] ?? 'Read More';
        $this->className = $params['className'] ?? '';
        $this->showPagination = $params['show_pagination'] ?? false;
        $this->paginationType = $params['pagination_type'] ?? 'numbers';
        $this->query = $params['query'] ?? null;
    }

    /**
     * Generate complete layout
     */
    public function generate()
    {
        $output = $this->getContainerStart();
        $output .= $this->getTitle();
        $output .= $this->getLayoutContainerStart();
        $output .= $this->getPosts();
        $output .= $this->getLayoutContainerEnd();
        $output .= $this->getPagination();
        $output .= $this->getContainerEnd();

        return $output;
    }

    /**
     * Get container start
     */
    private function getContainerStart()
    {
        return '<!-- wp:group {"className":"jankx-query-loop ' . esc_attr($this->className) . '"} -->' .
               '<div class="wp-block-group jankx-query-loop ' . esc_attr($this->className) . '">';
    }

    /**
     * Get title
     */
    private function getTitle()
    {
        if (empty($this->title)) {
            return '';
        }

        return '<!-- wp:heading {"level":2,"className":"jankx-query-loop-title"} -->' .
               '<h2 class="wp-block-heading jankx-query-loop-title">' . esc_html($this->title) . '</h2>' .
               '<!-- /wp:heading -->';
    }

    /**
     * Get layout container start
     */
    private function getLayoutContainerStart()
    {
        switch ($this->layout) {
            case 'grid':
                return '<!-- wp:columns {"className":"jankx-query-loop-posts jankx-layout-grid"} -->' .
                       '<div class="wp-block-columns jankx-query-loop-posts jankx-layout-grid">';
            case 'list':
                return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-list"} -->' .
                       '<div class="wp-block-group jankx-query-loop-posts jankx-layout-list">';
            case 'masonry':
                return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-masonry"} -->' .
                       '<div class="wp-block-group jankx-query-loop-posts jankx-layout-masonry">';
            case 'carousel':
                return '<!-- wp:group {"className":"jankx-query-loop-posts jankx-layout-carousel"} -->' .
                       '<div class="wp-block-group jankx-query-loop-posts jankx-layout-carousel">';
            default:
                return '<!-- wp:group {"className":"jankx-query-loop-posts"} -->' .
                       '<div class="wp-block-group jankx-query-loop-posts">';
        }
    }

    /**
     * Get posts HTML
     */
    private function getPosts()
    {
        $output = '';
        foreach ($this->posts as $post) {
            $output .= $this->renderPostCard($post);
        }
        return $output;
    }

    /**
     * Get layout container end
     */
    private function getLayoutContainerEnd()
    {
        switch ($this->layout) {
            case 'grid':
                return '</div><!-- /wp:columns -->';
            default:
                return '</div><!-- /wp:group -->';
        }
    }

    /**
     * Get pagination
     */
    private function getPagination()
    {
        if (!$this->showPagination || !$this->query || $this->query->max_num_pages <= 1) {
            return '';
        }

        $paginationRenderer = new Jankx_Pagination_Renderer($this->query, $this->paginationType);
        return $paginationRenderer->render();
    }

    /**
     * Get container end
     */
    private function getContainerEnd()
    {
        return '</div><!-- /wp:group -->';
    }

    /**
     * Render individual post card
     */
    private function renderPostCard($post)
    {
        $output = '';

        if ($this->layout === 'grid') {
            $output .= '<!-- wp:column --><div class="wp-block-column">';
        }

        $output .= '<!-- wp:group {"className":"jankx-post-card"} -->' .
                   '<div class="wp-block-group jankx-post-card">';

        // Featured image
        if (!empty($post['image'])) {
            $output .= '<!-- wp:image {"url":"' . esc_url($post['image']) . '","alt":"' . esc_attr($post['image_alt']) . '","className":"jankx-post-image"} -->' .
                       '<figure class="wp-block-image jankx-post-image"><img src="' . esc_url($post['image']) . '" alt="' . esc_attr($post['image_alt']) . '"/></figure>' .
                       '<!-- /wp:image -->';
        }

        // Post content
        $output .= '<!-- wp:group {"className":"jankx-post-content"} -->' .
                   '<div class="wp-block-group jankx-post-content">';

        // Title
        $output .= '<!-- wp:heading {"level":3,"className":"jankx-post-title"} -->' .
                   '<h3 class="wp-block-heading jankx-post-title"><a href="' . esc_url($post['link']) . '">' . esc_html($post['title']) . '</a></h3>' .
                   '<!-- /wp:heading -->';

        // Excerpt
        if (!empty($post['excerpt'])) {
            $output .= '<!-- wp:paragraph {"className":"jankx-post-excerpt"} -->' .
                       '<p class="wp-block-paragraph jankx-post-excerpt">' . esc_html($post['excerpt']) . '</p>' .
                       '<!-- /wp:paragraph -->';
        }

        // Meta information
        $output .= '<!-- wp:group {"className":"jankx-post-meta"} -->' .
                   '<div class="wp-block-group jankx-post-meta">';

        if (!empty($post['date'])) {
            $output .= '<span class="jankx-post-date">' . esc_html($post['date']) . '</span>';
        }

        if (!empty($post['author'])) {
            $output .= '<span class="jankx-post-author"><a href="' . esc_url($post['author_link']) . '">' . esc_html($post['author']) . '</a></span>';
        }

        $output .= '</div><!-- /wp:group -->';

        // Read more button
        if ($this->showReadMore) {
            $output .= '<!-- wp:buttons --><div class="wp-block-buttons">' .
                       '<!-- wp:button {"className":"jankx-read-more"} -->' .
                       '<div class="wp-block-button jankx-read-more"><a class="wp-block-button__link wp-element-button" href="' . esc_url($post['link']) . '">' . esc_html($this->readMoreText) . '</a></div>' .
                       '<!-- /wp:button -->' .
                       '</div><!-- /wp:buttons -->';
        }

        $output .= '</div><!-- /wp:group -->';
        $output .= '</div><!-- /wp:group -->';

        if ($this->layout === 'grid') {
            $output .= '</div><!-- /wp:column -->';
        }

        return $output;
    }
}
```

### 4. Pagination Renderer Class

```php
<?php
/**
 * Jankx Pagination Renderer Class
 * Xử lý việc render pagination
 */
class Jankx_Pagination_Renderer
{
    private $query;
    private $paginationType;
    private $currentPage;
    private $maxPages;

    public function __construct($query, $paginationType = 'numbers')
    {
        $this->query = $query;
        $this->paginationType = $paginationType;
        $this->currentPage = max(1, get_query_var('paged'));
        $this->maxPages = $query->max_num_pages;
    }

    /**
     * Render pagination
     */
    public function render()
    {
        $output = '<!-- wp:group {"className":"jankx-pagination"} -->' .
                   '<div class="wp-block-group jankx-pagination">';

        switch ($this->paginationType) {
            case 'numbers':
                $output .= $this->renderNumberedPagination();
                break;
            case 'prev_next':
                $output .= $this->renderPrevNextPagination();
                break;
            case 'load_more':
                $output .= $this->renderLoadMorePagination();
                break;
            case 'infinite':
                $output .= $this->renderInfiniteScrollPagination();
                break;
        }

        $output .= '</div><!-- /wp:group -->';

        return $output;
    }

    /**
     * Render numbered pagination
     */
    private function renderNumberedPagination()
    {
        $output = '<!-- wp:buttons {"className":"jankx-pagination-numbers"} -->' .
                   '<div class="wp-block-buttons jankx-pagination-numbers">';

        // Previous button
        if ($this->currentPage > 1) {
            $output .= '<!-- wp:button {"className":"jankx-pagination-prev"} -->' .
                       '<div class="wp-block-button jankx-pagination-prev">' .
                       '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($this->currentPage - 1) . '">Previous</a>' .
                       '</div><!-- /wp:button -->';
        }

        // Page numbers
        $start = max(1, $this->currentPage - 2);
        $end = min($this->maxPages, $this->currentPage + 2);

        for ($i = $start; $i <= $end; $i++) {
            $currentClass = ($i === $this->currentPage) ? ' jankx-pagination-current' : '';
            $output .= '<!-- wp:button {"className":"jankx-pagination-number' . $currentClass . '"} -->' .
                       '<div class="wp-block-button jankx-pagination-number' . $currentClass . '">' .
                       '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($i) . '">' . $i . '</a>' .
                       '</div><!-- /wp:button -->';
        }

        // Next button
        if ($this->currentPage < $this->maxPages) {
            $output .= '<!-- wp:button {"className":"jankx-pagination-next"} -->' .
                       '<div class="wp-block-button jankx-pagination-next">' .
                       '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($this->currentPage + 1) . '">Next</a>' .
                       '</div><!-- /wp:button -->';
        }

        $output .= '</div><!-- /wp:buttons -->';

        return $output;
    }

    /**
     * Render previous/next pagination
     */
    private function renderPrevNextPagination()
    {
        $output = '<!-- wp:buttons {"className":"jankx-pagination-prev-next"} -->' .
                   '<div class="wp-block-buttons jankx-pagination-prev-next">';

        if ($this->currentPage > 1) {
            $output .= '<!-- wp:button {"className":"jankx-pagination-prev"} -->' .
                       '<div class="wp-block-button jankx-pagination-prev">' .
                       '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($this->currentPage - 1) . '">← Previous</a>' .
                       '</div><!-- /wp:button -->';
        }

        if ($this->currentPage < $this->maxPages) {
            $output .= '<!-- wp:button {"className":"jankx-pagination-next"} -->' .
                       '<div class="wp-block-button jankx-pagination-next">' .
                       '<a class="wp-block-button__link wp-element-button" href="' . get_pagenum_link($this->currentPage + 1) . '">Next →</a>' .
                       '</div><!-- /wp:button -->';
        }

        $output .= '</div><!-- /wp:buttons -->';

        return $output;
    }

    /**
     * Render load more pagination
     */
    private function renderLoadMorePagination()
    {
        $output = '<!-- wp:buttons {"className":"jankx-pagination-load-more"} -->' .
                   '<div class="wp-block-buttons jankx-pagination-load-more">';

        if ($this->currentPage < $this->maxPages) {
            $output .= '<!-- wp:button {"className":"jankx-pagination-load-more-btn"} -->' .
                       '<div class="wp-block-button jankx-pagination-load-more-btn">' .
                       '<button class="wp-block-button__link wp-element-button jankx-load-more-btn" data-page="' . $this->currentPage . '" data-max-pages="' . $this->maxPages . '">Load More</button>' .
                       '</div><!-- /wp:button -->';
        }

        $output .= '</div><!-- /wp:buttons -->';

        return $output;
    }

    /**
     * Render infinite scroll pagination
     */
    private function renderInfiniteScrollPagination()
    {
        $output = '<!-- wp:group {"className":"jankx-pagination-infinite"} -->' .
                   '<div class="wp-block-group jankx-pagination-infinite" data-page="' . $this->currentPage . '" data-max-pages="' . $this->maxPages . '">';

        if ($this->currentPage < $this->maxPages) {
            $output .= '<!-- wp:paragraph {"className":"jankx-pagination-infinite-loading"} -->' .
                       '<p class="wp-block-paragraph jankx-pagination-infinite-loading">Loading more posts...</p>' .
                       '<!-- /wp:paragraph -->';
        }

        $output .= '</div><!-- /wp:group -->';

        return $output;
    }
}
```

### 5. Main Block Renderer Class

```php
<?php
/**
 * Jankx Query Loop Block Renderer Class
 * Class chính để render block
 */
class Jankx_Query_Loop_Block_Renderer
{
    private $attributes;

    public function __construct($attributes = [])
    {
        $this->attributes = $attributes;
    }

    /**
     * Render block
     */
    public function render()
    {
        // Extract attributes
        $queryType = $this->attributes['queryType'] ?? 'latest';
        $postType = $this->attributes['postType'] ?? 'post';
        $customPostType = $this->attributes['customPostType'] ?? '';
        $postsPerPage = $this->attributes['postsPerPage'] ?? 6;
        $orderBy = $this->attributes['orderBy'] ?? 'date';
        $order = $this->attributes['order'] ?? 'DESC';
        $category = $this->attributes['category'] ?? '';
        $tag = $this->attributes['tag'] ?? '';
        $taxonomy = $this->attributes['taxonomy'] ?? '';
        $taxonomyTerm = $this->attributes['taxonomyTerm'] ?? '';
        $metaKey = $this->attributes['metaKey'] ?? '';
        $metaValue = $this->attributes['metaValue'] ?? '';
        $metaCompare = $this->attributes['metaCompare'] ?? '=';
        $metaType = $this->attributes['metaType'] ?? 'CHAR';
        $taxonomyRelation = $this->attributes['taxonomyRelation'] ?? 'AND';
        $metaRelation = $this->attributes['metaRelation'] ?? 'AND';
        $layout = $this->attributes['layout'] ?? 'grid';
        $showImage = $this->attributes['showImage'] ?? true;
        $showExcerpt = $this->attributes['showExcerpt'] ?? true;
        $showDate = $this->attributes['showDate'] ?? true;
        $showAuthor = $this->attributes['showAuthor'] ?? false;
        $showReadMore = $this->attributes['showReadMore'] ?? true;
        $readMoreText = $this->attributes['readMoreText'] ?? 'Read More';
        $title = $this->attributes['title'] ?? '';
        $showPagination = $this->attributes['showPagination'] ?? false;
        $paginationType = $this->attributes['paginationType'] ?? 'numbers';
        $postsPerPagePagination = $this->attributes['postsPerPagePagination'] ?? 10;
        $className = $this->attributes['className'] ?? '';

        // Build query
        $queryBuilder = new Jankx_Query_Builder([
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

        $query = $queryBuilder->execute();

        // Format posts
        $postFormatter = new Jankx_Post_Formatter([
            'show_image' => $showImage,
            'show_excerpt' => $showExcerpt,
            'show_date' => $showDate,
            'show_author' => $showAuthor,
        ]);

        $posts = $postFormatter->formatMultiple($query);

        // Generate layout
        $layoutGenerator = new Jankx_Layout_Generator([
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

        return $layoutGenerator->generate();
    }
}
```

### 6. AJAX Handler Class

```php
<?php
/**
 * Jankx Query Loop AJAX Handler Class
 * Xử lý AJAX requests cho preview mode
 */
class Jankx_Query_Loop_Ajax_Handler
{
    /**
     * Initialize AJAX handlers
     */
    public static function init()
    {
        add_action('wp_ajax_jankx_query_loop_preview', [__CLASS__, 'handlePreview']);
        add_action('wp_ajax_nopriv_jankx_query_loop_preview', [__CLASS__, 'handlePreview']);
    }

    /**
     * Handle preview AJAX request
     */
    public static function handlePreview()
    {
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
        $queryBuilder = new Jankx_Query_Builder([
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

        $query = $queryBuilder->execute();
        $posts = [];

        if ($query->have_posts()) {
            $postFormatter = new Jankx_Post_Formatter([
                'show_image' => $attributes['showImage'] ?? true,
                'show_excerpt' => $attributes['showExcerpt'] ?? true,
                'show_date' => $attributes['showDate'] ?? true,
                'show_author' => $attributes['showAuthor'] ?? false,
            ]);

            $posts = $postFormatter->formatMultiple($query);
        }

        // Generate pagination HTML if needed
        $pagination = '';
        if ($attributes['showPagination'] ?? false) {
            $paginationRenderer = new Jankx_Pagination_Renderer($query, $attributes['paginationType'] ?? 'numbers');
            $pagination = $paginationRenderer->render();
        }

        wp_send_json_success([
            'posts' => $posts,
            'pagination' => $pagination,
            'total_posts' => $query->found_posts,
            'max_pages' => $query->max_num_pages
        ]);
    }
}
```

## 7. Updated block.json

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
        "queryType": { "type": "string", "default": "latest" },
        "postType": { "type": "string", "default": "post" },
        "customPostType": { "type": "string", "default": "" },
        "postsPerPage": { "type": "number", "default": 6 },
        "orderBy": { "type": "string", "default": "date" },
        "order": { "type": "string", "default": "DESC" },
        "category": { "type": "string", "default": "" },
        "tag": { "type": "string", "default": "" },
        "taxonomy": { "type": "string", "default": "" },
        "taxonomyTerm": { "type": "string", "default": "" },
        "metaKey": { "type": "string", "default": "" },
        "metaValue": { "type": "string", "default": "" },
        "metaCompare": { "type": "string", "default": "=" },
        "metaType": { "type": "string", "default": "CHAR" },
        "taxonomyRelation": { "type": "string", "default": "AND" },
        "metaRelation": { "type": "string", "default": "AND" },
        "layout": { "type": "string", "default": "grid" },
        "showImage": { "type": "boolean", "default": true },
        "showExcerpt": { "type": "boolean", "default": true },
        "showDate": { "type": "boolean", "default": true },
        "showAuthor": { "type": "boolean", "default": false },
        "showReadMore": { "type": "boolean", "default": true },
        "readMoreText": { "type": "string", "default": "Read More" },
        "title": { "type": "string", "default": "Latest Posts" },
        "showPagination": { "type": "boolean", "default": false },
        "paginationType": { "type": "string", "default": "numbers" },
        "postsPerPagePagination": { "type": "number", "default": 10 },
        "className": { "type": "string" }
    },
    "textdomain": "jankx",
    "editorScript": "file:./index.js",
    "style": "file:./style.css",
    "render_callback": "jankx_query_loop_block_render"
}
```

## 8. Block Registration (functions.php)

```php
<?php
/**
 * Register Jankx Query Loop Block
 */

// Load required classes
require_once __DIR__ . '/classes/class-jankx-query-builder.php';
require_once __DIR__ . '/classes/class-jankx-post-formatter.php';
require_once __DIR__ . '/classes/class-jankx-layout-generator.php';
require_once __DIR__ . '/classes/class-jankx-pagination-renderer.php';
require_once __DIR__ . '/classes/class-jankx-query-loop-block-renderer.php';

/**
 * Main render function for the block
 */
function jankx_query_loop_block_render($attributes, $content)
{
    $renderer = new Jankx_Query_Loop_Block_Renderer($attributes);
    return $renderer->render();
}

/**
 * Register the block
 */
function jankx_register_query_loop_block()
{
    register_block_type(__DIR__);
}

add_action('init', 'jankx_register_query_loop_block');

// Initialize AJAX handlers
Jankx_Query_Loop_Ajax_Handler::init();
```

## Lợi ích của việc refactor

### 1. **Tách biệt trách nhiệm (Separation of Concerns)**
- Mỗi class có một trách nhiệm cụ thể
- Dễ dàng test từng component riêng biệt
- Code dễ đọc và hiểu hơn

### 2. **Dễ bảo trì (Maintainability)**
- Thay đổi logic query không ảnh hưởng đến layout
- Thay đổi layout không ảnh hưởng đến pagination
- Mỗi class có thể được cập nhật độc lập

### 3. **Mở rộng dễ dàng (Extensibility)**
- Thêm layout mới chỉ cần extend `Jankx_Layout_Generator`
- Thêm pagination type mới chỉ cần extend `Jankx_Pagination_Renderer`
- Thêm query type mới chỉ cần modify `Jankx_Query_Builder`

### 4. **Tái sử dụng (Reusability)**
- Các class có thể được sử dụng ở nhiều nơi khác
- `Jankx_Query_Builder` có thể dùng cho các block khác
- `Jankx_Post_Formatter` có thể dùng cho widgets, shortcodes

### 5. **Testability**
- Mỗi class có thể được unit test riêng biệt
- Mock objects dễ dàng tạo ra
- Integration tests có thể test từng component

### 6. **Performance**
- Lazy loading có thể được implement dễ dàng
- Caching có thể được thêm vào từng class
- Memory usage được tối ưu hóa

## Cấu trúc file cuối cùng

```
jankx-query-loop-block/
├── block.json (với render_callback)
├── index.js (editor script)
├── style.css
├── classes/
│   ├── class-jankx-query-builder.php
│   ├── class-jankx-post-formatter.php
│   ├── class-jankx-layout-generator.php
│   ├── class-jankx-pagination-renderer.php
│   ├── class-jankx-query-loop-block-renderer.php
│   └── class-jankx-query-loop-ajax-handler.php
└── functions.php (block registration)
```

**Không còn file `render.php`** - tất cả logic render được xử lý thông qua `render_callback` trong `block.json` và các PHP classes!

Cấu trúc này giúp code dễ bảo trì hơn nhiều so với việc sử dụng các function riêng lẻ và file `render.php`!