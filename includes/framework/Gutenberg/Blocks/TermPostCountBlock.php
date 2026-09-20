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

        $showLabel = !isset($attributes['showLabel']) || (bool) $attributes['showLabel'];
        $labelPosition = isset($attributes['labelPosition']) && $attributes['labelPosition'] === 'before' ? 'before' : 'after';
        $label = $showLabel ? $this->resolveLabel($attributes, $count) : '';

        $numberHtml = sprintf('<span class="term-post-count__number">%s</span>', esc_html($number));
        $labelHtml = sprintf(
            '<span class="term-post-count__label term-post-count__label--%s">%s</span>',
            esc_attr($labelPosition),
            esc_html($label)
        );

        if ($showLabel && $labelPosition === 'before') {
            $inner = $labelHtml . ' ' . $numberHtml;
        } elseif ($showLabel) {
            $inner = $numberHtml . ' ' . $labelHtml;
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

        $total = 0;
        foreach (array_unique($postTypes) as $postType) {
            $query = new \WP_Query([
                'post_type' => $postType,
                'post_status' => 'publish',
                'posts_per_page' => 1,
                'fields' => 'ids',
                'ignore_sticky_posts' => true,
                'tax_query' => [
                    [
                        'taxonomy' => $term->taxonomy,
                        'field' => 'term_id',
                        'terms' => $term->term_id,
                    ],
                ],
            ]);

            $total += (int) $query->found_posts;
        }

        return $total;
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
