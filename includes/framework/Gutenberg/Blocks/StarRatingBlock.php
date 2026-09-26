<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\StarRating\StarRatingRegistry;
use Jankx\Gutenberg\StarRating\RatingSubmission;
use Jankx\Gutenberg\StarRating\RatingSubmissionShortcode;
use Jankx\Gutenberg\StarRating\Providers\ManualRatingProvider;
use Jankx\Gutenberg\StarRating\Providers\WooCommerceRatingProvider;
use Jankx\Gutenberg\StarRating\Providers\PostMetaRatingProvider;
use Jankx\Gutenberg\StarRating\Providers\CrawlerRatingProvider;

class StarRatingBlock extends Block
{
    protected $blockId = 'jankx/star-rating';

    const DEFAULT_SVG_FULL  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    const DEFAULT_SVG_HALF  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';
    const DEFAULT_SVG_EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';

    /**
     * Register built-in providers and hook up the REST endpoint.
     * Call this once during block bootstrap (e.g. from GutenbergRepository).
     *
     * Named explicitly (instead of overriding Block::boot(), which is an
     * instance method) to avoid a fatal "cannot make non static method static".
     */
    public static function bootProviders(): void
    {
        self::registerBuiltinProviders();
        add_action('rest_api_init', [self::class, 'registerRestEndpoint']);
        RatingSubmission::register();
        RatingSubmissionShortcode::register();
    }

    /**
     * Register the four built-in rating providers.
     * Extensions may call StarRatingRegistry::register() to add more,
     * or StarRatingRegistry::deregister() to remove any of these.
     */
    private static function registerBuiltinProviders(): void
    {
        StarRatingRegistry::register(new ManualRatingProvider());
        StarRatingRegistry::register(new WooCommerceRatingProvider());
        StarRatingRegistry::register(new PostMetaRatingProvider());
        StarRatingRegistry::register(new CrawlerRatingProvider());
    }

    /**
     * Register a REST endpoint so Gutenberg can fetch the dynamic provider list.
     *
     * GET /wp-json/jankx/v1/star-rating/providers[?post_type=tour]
     * Response: [{ "value": "manual", "label": "Manual" }, ...]
     */
    public static function registerRestEndpoint(): void
    {
        register_rest_route('jankx/v1', '/star-rating/providers', [
            'methods'             => \WP_REST_Server::READABLE,
            'callback'            => [self::class, 'restGetProviders'],
            'permission_callback' => static function () {
                return current_user_can('edit_posts');
            },
            'args' => [
                'post_type' => [
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_key',
                    'default'           => '',
                ],
            ],
        ]);
    }

    /**
     * REST callback — returns editor-ready options array.
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public static function restGetProviders(\WP_REST_Request $request): \WP_REST_Response
    {
        $postType = $request->get_param('post_type');
        $options  = StarRatingRegistry::getEditorOptions($postType ?: null);
        return new \WP_REST_Response($options, 200);
    }

    // -----------------------------------------------------------------------
    // Block render
    // -----------------------------------------------------------------------

    public function render($attributes, $content = '')
    {
        $attributes = wp_parse_args($attributes, [
            'displayStyle'   => 'stars',
            'ratingSource'   => 'manual',
            'manualRating'   => 5,
            'metaKey'        => 'rating_score',
            'crawlerTable'   => '',
            'starSize'       => 16,
            'starColor'      => '#f1c40f',
            'starEmptyColor' => '#dddddd',
            'showCount'      => false,
            'countMetaKey'   => 'rating_count',
            'align'          => 'left',
            'position'       => '',
            'iconType'       => 'text',
            'svgFull'        => '',
            'svgHalf'        => '',
            'svgEmpty'       => '',
        ]);

        $postId   = get_the_ID() ?: 0;
        $source   = $attributes['ratingSource'];
        $provider = StarRatingRegistry::getProvider($source);

        if ($provider === null) {
            /**
             * Filter: allow extensions to handle an unknown/missing provider ID.
             *
             * @param float  $rating     Default fallback (0.0).
             * @param string $source     The requested provider ID.
             * @param int    $postId     Current post ID.
             * @param array  $attributes Block attributes.
             */
            $rating = (float) apply_filters(
                'jankx/star_rating/unknown_provider_rating',
                0.0,
                $source,
                $postId,
                $attributes
            );
            $count  = 0;
        } else {
            $rating = $provider->getRating($postId, $attributes);
            $count  = $provider->getCount($postId, $attributes);
        }

        // Allow final override via filters (backwards-compatible).
        $rating = (float) apply_filters('jankx/star_rating/value', $rating, $attributes, $postId);
        $count  = (int)   apply_filters('jankx/star_rating/count', $count,  $attributes, $postId);

        // Clamp rating 0-5.
        $rating = max(0.0, min(5.0, $rating));

        // Build inline style.
        $style = sprintf(
            '--star-size: %dpx; --star-color: %s; --star-empty-color: %s; text-align: %s;',
            (int) $attributes['starSize'],
            esc_attr($attributes['starColor']),
            esc_attr($attributes['starEmptyColor']),
            esc_attr($attributes['align'])
        );

        if (!empty($attributes['position'])) {
            $style .= sprintf(' position: %s;', esc_attr($attributes['position']));
        }

        $wrapper_classes = ['wp-block-jankx-star-rating'];
        if (!empty($attributes['className'])) {
            $wrapper_classes[] = $attributes['className'];
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($style); ?>">
            <div class="jankx-star-rating">
                <?php if ($attributes['displayStyle'] === 'summary'): ?>
                    <span class="jankx-rating-summary">
                        <span class="jankx-rating-summary__icon">★</span>
                        <span class="jankx-rating-summary__score"><?php echo esc_html(number_format_i18n($rating, 1)); ?></span>
                        <?php if ($attributes['showCount'] && $count > 0): ?>
                            <span class="jankx-rating-summary__count">(<?php echo number_format_i18n($count); ?>)</span>
                        <?php endif; ?>
                    </span>
                <?php else: ?>
                    <div class="jankx-stars" title="<?php echo esc_attr(sprintf(__('Rated %s out of 5', 'jankx'), $rating)); ?>">
                        <?php echo $this->renderStars($rating, $attributes); ?>
                    </div>
                    <?php if ($attributes['showCount'] && $count > 0): ?>
                        <span class="jankx-rating-count">
                            (<?php echo number_format_i18n($count); ?>)
                        </span>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    // -----------------------------------------------------------------------
    // Star rendering helpers
    // -----------------------------------------------------------------------

    protected function renderStars($rating, $attributes)
    {
        $output        = '';
        $full_stars    = floor($rating);
        $has_half_star = ($rating - $full_stars) >= 0.5;
        $iconType      = $attributes['iconType'] ?? 'text';

        for ($i = 1; $i <= 5; $i++) {
            if ($i <= $full_stars) {
                $output .= $this->getStarIcon('full', $iconType, $attributes);
            } elseif ($i === $full_stars + 1 && $has_half_star) {
                $output .= $this->getStarIcon('half', $iconType, $attributes);
            } else {
                $output .= $this->getStarIcon('empty', $iconType, $attributes);
            }
        }

        return $output;
    }

    protected function getStarIcon($type, $iconType, $attributes)
    {
        $classes = "jankx-star {$type}";

        if ($iconType === 'svg') {
            $svgContent = '';
            if ($type === 'full')  $svgContent = !empty($attributes['svgFull'])  ? $attributes['svgFull']  : self::DEFAULT_SVG_FULL;
            if ($type === 'half')  $svgContent = !empty($attributes['svgHalf'])  ? $attributes['svgHalf']  : self::DEFAULT_SVG_HALF;
            if ($type === 'empty') $svgContent = !empty($attributes['svgEmpty']) ? $attributes['svgEmpty'] : self::DEFAULT_SVG_EMPTY;

            return sprintf('<span class="%s is-svg">%s</span>', $classes, $svgContent);
        }

        $symbol = ($type === 'full' || $type === 'half') ? '★' : '☆';
        return sprintf('<span class="%s">%s</span>', $classes, $symbol);
    }
}
