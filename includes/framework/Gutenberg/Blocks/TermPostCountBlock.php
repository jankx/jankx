<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TermPostCountBlock extends Block
{
    protected $blockId = 'jankx/term-post-count';

    public function render($attributes, $content = '', $block = null)
    {
        $term = $this->resolveTerm($block);
        if (!$term instanceof \WP_Term) {
            return '';
        }

        $postTypes = isset($attributes['postTypes']) && is_array($attributes['postTypes'])
            ? array_values(array_filter(array_map('sanitize_key', $attributes['postTypes'])))
            : [];
        $count = $this->countPosts($term, $postTypes);

        $showZero = !isset($attributes['showZero']) || (bool) $attributes['showZero'];
        if ($count === 0 && !$showZero) {
            return '';
        }

        $zeroText = isset($attributes['zeroText']) ? (string) $attributes['zeroText'] : '';
        $number = ($count === 0 && $zeroText !== '') ? $zeroText : number_format_i18n($count);

        $prefix = isset($attributes['prefix']) ? (string) $attributes['prefix'] : '';
        $suffix = isset($attributes['suffix']) ? (string) $attributes['suffix'] : '';

        $showLabel = !isset($attributes['showLabel']) || (bool) $attributes['showLabel'];
        $labelPosition = isset($attributes['labelPosition']) && $attributes['labelPosition'] === 'before' ? 'before' : 'after';
        $label = ($prefix === '' && $suffix === '' && $showLabel) ? $this->resolveLabel($attributes, $count) : '';

        $numberHtml = sprintf(
            '<span class="term-post-count__number">%s%s%s</span>',
            esc_html($prefix),
            esc_html($number),
            esc_html($suffix)
        );

        if ($label !== '') {
            $labelHtml = sprintf(
                '<span class="term-post-count__label term-post-count__label--%s">%s</span>',
                esc_attr($labelPosition),
                esc_html($label)
            );

            if ($labelPosition === 'before') {
                $inner = $labelHtml . ' ' . $numberHtml;
            } else {
                $inner = $numberHtml . ' ' . $labelHtml;
            }
        } else {
            $inner = $numberHtml;
        }

        $wrapperAttributes = get_block_wrapper_attributes([
            'class' => 'jankx-term-post-count',
        ]);

        return sprintf('<span %s>%s</span>', $wrapperAttributes, $inner);
    }

    protected function resolveTerm($block): ?\WP_Term
    {
        if ($block instanceof \WP_Block) {
            $termId = isset($block->context['termId']) ? (int) $block->context['termId'] : 0;
            $taxonomy = isset($block->context['taxonomy']) ? (string) $block->context['taxonomy'] : '';

            if ($termId > 0 && $taxonomy !== '') {
                $term = get_term($termId, $taxonomy);
                if ($term instanceof \WP_Term) {
                    return $term;
                }
            }
        }

        $queried = get_queried_object();
        if ($queried instanceof \WP_Term) {
            return $queried;
        }

        return null;
    }

    protected function countPosts(\WP_Term $term, array $postTypes): int
    {
        if (empty($postTypes)) {
            return (int) $term->count;
        }

        // Build a deterministic cache key from term_id + sorted post types
        $sortedPostTypes = array_unique($postTypes);
        sort($sortedPostTypes);
        $cacheKey = 'jankx_tpc_' . $term->term_id . '_' . md5(implode(',', $sortedPostTypes));

        $cached = get_transient($cacheKey);
        if ($cached !== false) {
            return (int) $cached;
        }

        $total = 0;
        foreach ($sortedPostTypes as $postType) {
            $query = new \WP_Query([
                'post_type'           => $postType,
                'post_status'         => 'publish',
                'posts_per_page'      => 1,
                'fields'              => 'ids',
                'ignore_sticky_posts' => true,
                'tax_query'           => [
                    [
                        'taxonomy' => $term->taxonomy,
                        'field'    => 'term_id',
                        'terms'    => $term->term_id,
                    ],
                ],
            ]);

            $total += (int) $query->found_posts;
        }

        // Cache for 1 hour (3600 seconds)
        set_transient($cacheKey, $total, HOUR_IN_SECONDS);

        return $total;
    }

    /**
     * Clear all cached post counts for a given term.
     * Called automatically when a term is updated or a post is saved/deleted.
     *
     * @param int $termId
     */
    public static function clearCountCache(int $termId): void
    {
        global $wpdb;
        // Remove all transients whose key starts with jankx_tpc_{termId}_
        $prefix = '_transient_jankx_tpc_' . $termId . '_';
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                $wpdb->esc_like($prefix) . '%'
            )
        );
    }

    protected function resolveLabel(array $attributes, int $count): string
    {
        $singular = isset($attributes['labelSingular']) ? trim((string) $attributes['labelSingular']) : '';
        $plural = isset($attributes['labelPlural']) ? trim((string) $attributes['labelPlural']) : '';

        if ($singular !== '' || $plural !== '') {
            $singular = $singular !== '' ? $singular : $plural;
            $plural = $plural !== '' ? $plural : $singular;

            return $count === 1 ? $singular : $plural;
        }

        $postTypes = isset($attributes['postTypes']) && is_array($attributes['postTypes'])
            ? array_values(array_filter(array_map('sanitize_key', $attributes['postTypes'])))
            : [];

        if (count($postTypes) === 1) {
            $object = get_post_type_object($postTypes[0]);
            if ($object && !empty($object->labels)) {
                return $count === 1
                    ? (string) ($object->labels->singular_name ?? $object->label)
                    : (string) ($object->labels->name ?? $object->label);
            }
        }

        return __('bài viết', 'jankx');
    }
}
