<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use WP_Query;

/**
 * Post Layout Decorator
 *
 * Decorator pattern để set options từ block attributes vào layout
 *
 * @package Jankx\Layouts\PostLayout
 */
class PostLayoutDecorator
{
    /**
     * Layout instance
     *
     * @var PostLayoutInterface
     */
    protected $layout;

    /**
     * Constructor
     *
     * @param PostLayoutInterface $layout
     */
    public function __construct(PostLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    /**
     * Set options từ block attributes
     *
     * @param array $attributes Block attributes từ Gutenberg
     * @return self
     */
    public function withAttributes(array $attributes): self
    {
        // Map block attributes to layout options
        $options = [
            'columns' => $attributes['columns'] ?? 3,
            'showFeaturedImage' => $attributes['showFeaturedImage'] ?? true,
            'showTitle' => $attributes['showTitle'] ?? true,
            'showExcerpt' => $attributes['showExcerpt'] ?? true,
            'showDate' => $attributes['showDate'] ?? true,
            'showAuthor' => $attributes['showAuthor'] ?? false,
            'postsPerPage' => $attributes['postsPerPage'] ?? 10,
            'excerptLength' => $attributes['excerptLength'] ?? 55,
        ];

        $this->layout->setOptions($options);

        // Set excerpt length filter if specified
        if (isset($attributes['excerptLength']) && !empty($attributes['showExcerpt'])) {
            add_filter('excerpt_length', function() use ($attributes) {
                return intval($attributes['excerptLength']);
            }, 999);
        }

        return $this;
    }

    /**
     * Set query
     *
     * @param WP_Query $query
     * @return self
     */
    public function withQuery(WP_Query $query): self
    {
        $this->layout->setQuery($query);
        return $this;
    }

    /**
     * Build query từ block attributes
     *
     * @param array $attributes
     * @return WP_Query
     */
    public function buildQuery(array $attributes): WP_Query
    {
        $args = [
            'post_type' => $attributes['postType'] ?? 'post',
            'posts_per_page' => $attributes['postsPerPage'] ?? 10,
            'orderby' => $attributes['orderBy'] ?? 'date',
            'order' => $attributes['order'] ?? 'DESC',
            'post_status' => 'publish',
        ];

        // Handle pagination if enabled
        if (!empty($attributes['enablePagination'])) {
            $paged = get_query_var('paged') ? get_query_var('paged') : 1;
            $args['paged'] = $paged;
        }

        // Apply filters to allow customization
        $args = apply_filters('jankx/post-layout/query-args', $args, $attributes);
        $args = apply_filters('jankx/post-layout/query-args/' . $this->layout->getName(), $args, $attributes);

        return new WP_Query($args);
    }

    /**
     * Render layout
     *
     * @return string
     */
    public function render(): string
    {
        return $this->layout->render();
    }

    /**
     * Render preview
     *
     * @return array
     */
    public function renderPreview(): array
    {
        return $this->layout->renderPreview();
    }

    /**
     * Get layout instance
     *
     * @return PostLayoutInterface
     */
    public function getLayout(): PostLayoutInterface
    {
        return $this->layout;
    }
}
