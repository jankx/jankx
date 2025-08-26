<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class AdvancedPostsBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/advanced-posts', [
            'title' => __('Advanced Posts', 'jankx'),
            'category' => 'widgets',
            'icon' => 'admin-page',
            'supports' => [
                'align' => ['center', 'wide', 'full'],
                'html' => false,
            ],
        ]);
    }

    public function register()
    {
        $block_json = $this->getBlockJson();
        if (!$block_json) {
            return;
        }
        $this->prioritizeBuildAssets($block_json);
        $this->registerBlockWithMetadata($block_json);
    }

    public function render($attributes, $content = '')
    {
        $defaults = [
            'postType' => 'post',
            'postsToShow' => 5,
            'offset' => 0,
            'order' => 'desc',
            'orderBy' => 'date',
            'ignoreStickyPosts' => true,
            'showAllPosts' => false,
        ];
        $attributes = wp_parse_args($attributes, $defaults);

        $query_args = [
            'post_type' => $attributes['postType'],
            'posts_per_page' => $attributes['showAllPosts'] ? -1 : $attributes['postsToShow'],
            'offset' => $attributes['offset'],
            'order' => $attributes['order'],
            'orderby' => $attributes['orderBy'],
            'ignore_sticky_posts' => $attributes['ignoreStickyPosts'],
            'post_status' => 'publish',
        ];

        $query = new \WP_Query($query_args);

        ob_start();
        ?>
        <div class="jankx-advanced-posts">
            <div class="jankx-advanced-posts__list">
                <?php if ($query->have_posts()) : ?>
                    <?php while ($query->have_posts()) : $query->the_post(); ?>
                        <article class="jankx-advanced-posts__item">
                            <h3 class="jankx-advanced-posts__title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <div class="jankx-advanced-posts__excerpt"><?php echo wp_kses_post(wpautop(get_the_excerpt())); ?></div>
                        </article>
                    <?php endwhile; wp_reset_postdata(); ?>
                <?php else : ?>
                    <p><?php _e('No posts found.', 'jankx'); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
