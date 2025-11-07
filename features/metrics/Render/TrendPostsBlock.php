<?php

namespace Jankx\Features\Metrics\Render;

use Jankx\Gutenberg\Block;
use WP_Query;

class TrendPostsBlock extends Block
{
    protected $blockId = 'jankx/trend-posts';

    /**
     * Render callback for Trend Posts block
     *
     * @param array $attributes Block attributes
     * @param string $content Inner block content
     * @return string
     */
    public function render(array $attributes = [], $content = ''): string
    {
        $postsPerPage = isset($attributes['postsPerPage']) ? max(1, intval($attributes['postsPerPage'])) : 1;
        $showThumbnail = $attributes['showThumbnail'] ?? true;
        $showTitle = $attributes['showTitle'] ?? true;
        $showExcerpt = $attributes['showExcerpt'] ?? false;
        $showDate = $attributes['showDate'] ?? true;
        $showViews = $attributes['showViews'] ?? true;

        $blockClasses = $attributes['className'] ?? '';
        $hasHotBadgeStyle = strpos($blockClasses, 'is-style-hot-badge') !== false;

        $postViewService = $GLOBALS['jankx_post_view_service'] ?? null;

        $stickyPosts = get_option('sticky_posts', []);
        $queryArgs = [
            'post_type' => 'post',
            'posts_per_page' => 10,
            'meta_key' => 'post_views_count',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
            'post_status' => 'publish',
            'ignore_sticky_posts' => true,
            'post__not_in' => is_array($stickyPosts) ? $stickyPosts : [],
        ];

        $topPostsQuery = new WP_Query($queryArgs);
        $topPosts = [];

        if ($topPostsQuery->have_posts()) {
            while ($topPostsQuery->have_posts()) {
                $topPostsQuery->the_post();
                $topPosts[] = get_post();
            }
            wp_reset_postdata();
        }

        $selectedPosts = [];
        if (!empty($topPosts)) {
            $count = min($postsPerPage, count($topPosts));
            if ($count > 0) {
                $randomKeys = array_rand($topPosts, $count);
                if (!is_array($randomKeys)) {
                    $randomKeys = [$randomKeys];
                }
                foreach ($randomKeys as $key) {
                    $selectedPosts[] = $topPosts[$key];
                }
            }
        }

        if ($hasHotBadgeStyle) {
            $selectedPosts = array_slice($selectedPosts, 0, 1);
        }

        if (empty($selectedPosts)) {
            return '';
        }

        $classes = ['jankx-trend-posts-block'];
        if (isset($attributes['align'])) {
            $classes[] = 'align' . $attributes['align'];
        }
        if (!empty($blockClasses)) {
            $classes[] = $blockClasses;
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $classes)); ?>">
            <div class="trend-posts-container">
                <?php
                foreach ($selectedPosts as $post) {
                    setup_postdata($post);
                    $postId = $post->ID;
                    $viewCount = $postViewService ? $postViewService->getPostViews($postId) : 0;
                    $formattedViews = $postViewService ? $postViewService->formatViews($viewCount) : number_format($viewCount);
                    ?>
                    <article class="trend-post-item<?php echo $hasHotBadgeStyle ? ' trend-post-item-hot' : ''; ?>" id="trend-post-<?php echo esc_attr($postId); ?>">
                        <?php if ($showThumbnail && !$hasHotBadgeStyle && has_post_thumbnail($postId)) : ?>
                            <div class="trend-post-thumbnail">
                                <a href="<?php echo esc_url(get_permalink($postId)); ?>">
                                    <?php echo get_the_post_thumbnail($postId, 'medium'); ?>
                                </a>
                            </div>
                        <?php endif; ?>

                        <div class="trend-post-content">
                            <?php if ($hasHotBadgeStyle) : ?>
                                <span class="trend-post-badge"><?php echo esc_html__('Xu hướng HOT', 'jankx'); ?></span>
                            <?php endif; ?>

                            <?php if ($showTitle) : ?>
                                <h3 class="trend-post-title">
                                    <a href="<?php echo esc_url(get_permalink($postId)); ?>">
                                        <?php echo esc_html(get_the_title($postId)); ?>
                                    </a>
                                </h3>
                            <?php endif; ?>

                            <?php if ($showExcerpt && !$hasHotBadgeStyle) : ?>
                                <div class="trend-post-excerpt">
                                    <?php echo wp_kses_post(wp_trim_words(get_the_excerpt($postId), 20, '...')); ?>
                                </div>
                            <?php endif; ?>

                            <?php if (!$hasHotBadgeStyle && ($showDate || $showViews)) : ?>
                                <div class="trend-post-meta">
                                    <?php if ($showDate) : ?>
                                        <span class="trend-post-date">
                                            <time datetime="<?php echo esc_attr(get_the_date('c', $postId)); ?>">
                                                <?php echo esc_html(get_the_date('', $postId)); ?>
                                            </time>
                                        </span>
                                    <?php endif; ?>

                                    <?php if ($showViews && $viewCount > 0) : ?>
                                        <span class="trend-post-views">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                            </svg>
                                            <?php echo esc_html($formattedViews); ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </article>
                    <?php
                }
                wp_reset_postdata();
                ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
