<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use WC_Product;

class StarRatingBlock extends Block
{
    protected $blockId = 'jankx/star-rating';

    const DEFAULT_SVG_FULL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    const DEFAULT_SVG_HALF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';
    const DEFAULT_SVG_EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';

    public function render($attributes, $content = '')
    {
        $attributes = wp_parse_args($attributes, [
            'ratingSource' => 'manual',
            'manualRating' => 5,
            'metaKey' => 'rating_score',
            'crawlerTable' => '',
            'starSize' => 16,
            'starColor' => '#f1c40f',
            'starEmptyColor' => '#dddddd',
            'showCount' => false,
            'countMetaKey' => 'rating_count',
            'align' => 'left',
            'iconType' => 'text',
            'svgFull' => '',
            'svgHalf' => '',
            'svgEmpty' => '',
        ]);

        $rating = 0;
        $count = 0;

        switch ($attributes['ratingSource']) {
            case 'woocommerce':
                if (function_exists('wc_get_product')) {
                    global $product;
                    if (!$product instanceof WC_Product) {
                        $product = wc_get_product(get_the_ID());
                    }
                    if ($product) {
                        $rating = $product->get_average_rating();
                        $count = $product->get_rating_count();
                    }
                }
                break;

            case 'meta':
                $post_id = get_the_ID();
                $rating = (float) get_post_meta($post_id, $attributes['metaKey'], true);
                if ($attributes['showCount']) {
                    $count = (int) get_post_meta($post_id, $attributes['countMetaKey'], true);
                }
                break;

            case 'crawler':
                // Placeholder for custom crawler logic
                // Assuming data is stored in a custom table linked by post_id or similar
                $rating = $this->getCrawlerRating($attributes['crawlerTable']);
                $count = $this->getCrawlerCount($attributes['crawlerTable']);
                break;

            case 'manual':
            default:
                $rating = (float) $attributes['manualRating'];
                break;
        }

        // Apply filters to allow external modification of rating data
        $rating = apply_filters('jankx/star_rating/value', $rating, $attributes, get_the_ID());
        $count = apply_filters('jankx/star_rating/count', $count, $attributes, get_the_ID());

        // Clamp rating between 0 and 5
        $rating = max(0, min(5, $rating));

        // Render HTML
        $style = sprintf(
            '--star-size: %dpx; --star-color: %s; --star-empty-color: %s; text-align: %s;',
            $attributes['starSize'],
            $attributes['starColor'],
            $attributes['starEmptyColor'],
            $attributes['align']
        );

        $wrapper_classes = ['wp-block-jankx-star-rating'];
        if (isset($attributes['className'])) {
            $wrapper_classes[] = $attributes['className'];
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($style); ?>">
            <div class="jankx-star-rating">
                <div class="jankx-stars" title="<?php echo esc_attr(sprintf(__('Rated %s out of 5', 'jankx'), $rating)); ?>">
                    <?php echo $this->renderStars($rating, $attributes); ?>
                </div>
                <?php if ($attributes['showCount'] && $count > 0): ?>
                    <span class="jankx-rating-count">
                        (<?php echo number_format_i18n($count); ?>)
                    </span>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    protected function renderStars($rating, $attributes)
    {
        $output = '';
        $full_stars = floor($rating);
        $has_half_star = ($rating - $full_stars) >= 0.5;

        $iconType = $attributes['iconType'] ?? 'text';

        for ($i = 1; $i <= 5; $i++) {
            if ($i <= $full_stars) {
                $output .= $this->getStarIcon('full', $iconType, $attributes);
            } elseif ($i == $full_stars + 1 && $has_half_star) {
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
            if ($type === 'full') $svgContent = !empty($attributes['svgFull']) ? $attributes['svgFull'] : self::DEFAULT_SVG_FULL;
            if ($type === 'half') $svgContent = !empty($attributes['svgHalf']) ? $attributes['svgHalf'] : self::DEFAULT_SVG_HALF;
            if ($type === 'empty') $svgContent = !empty($attributes['svgEmpty']) ? $attributes['svgEmpty'] : self::DEFAULT_SVG_EMPTY;

            // Ensure SVG has current color fill if not specified (or force it via CSS)
            return sprintf('<span class="%s is-svg">%s</span>', $classes, $svgContent);
        }

        $symbol = ($type === 'full' || $type === 'half') ? '★' : '☆';
        return sprintf('<span class="%s">%s</span>', $classes, $symbol);
    }

    protected function getCrawlerRating($table)
    {
        // Example implementation: query custom table
        // This is a placeholder. You would typically use $wpdb here.
        // global $wpdb;
        // ...
        return 0;
    }

    protected function getCrawlerCount($table)
    {
        return 0;
    }
}
