<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use WP_Query;

class ViewLayoutQueryBuilder
{
    protected $layout;
    protected $defaultArgs = [
        'post_status' => 'publish',
        'posts_per_page' => 10,
        'paged' => 1,
    ];

    public function __construct(ViewLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    public function build(): WP_Query
    {
        $options = $this->layout->getOptions();
        $queryArgs = $this->defaultArgs;

        // Set post type
        if (!empty($options['postType'])) {
            $queryArgs['post_type'] = $options['postType'];
        }

        // Set posts per page
        if (isset($options['postsPerPage'])) {
            $queryArgs['posts_per_page'] = (int) $options['postsPerPage'];
        }

        // Set pagination
        if (isset($options['paged'])) {
            $queryArgs['paged'] = (int) $options['paged'];
        }

        // Handle sticky posts
        $includeSticky = $options['includeStickyPosts'] ?? false;
        if (!$includeSticky) {
            $queryArgs['ignore_sticky_posts'] = true;
        }

        // Apply filters for custom query modifications
        $queryArgs = apply_filters('jankx_view_layout_query_args', $queryArgs, $options);
        $queryArgs = apply_filters('jankx_view_layout_query_args_' . $this->layout->getName(), $queryArgs, $options);

        return new WP_Query($queryArgs);
    }

    public function buildForPreset(array $attributes, string $preset, string $postType): WP_Query
    {
        $queryArgs = $this->defaultArgs;
        $queryArgs['post_type'] = $postType;

        // Apply preset-specific logic
        switch ($preset) {
            case 'latest':
                $queryArgs['orderby'] = 'date';
                $queryArgs['order'] = 'DESC';
                break;
            case 'popular':
                $queryArgs['orderby'] = 'comment_count';
                $queryArgs['order'] = 'DESC';
                break;
            case 'featured':
                $queryArgs['meta_key'] = '_is_featured';
                $queryArgs['meta_value'] = '1';
                $queryArgs['orderby'] = 'date';
                $queryArgs['order'] = 'DESC';
                break;
            default:
                // Use default query args
                break;
        }

        // Apply attributes
        if (isset($attributes['postsPerPage'])) {
            $queryArgs['posts_per_page'] = (int) $attributes['postsPerPage'];
        }
        if (isset($attributes['paged'])) {
            $queryArgs['paged'] = (int) $attributes['paged'];
        }

        $queryArgs = apply_filters('jankx_view_layout_query_preset_args', $queryArgs, $preset, $postType, $attributes);

        return new WP_Query($queryArgs);
    }
}
