<?php

namespace Jankx\Layouts\DynamicDataLayout;

class PaginationRenderer
{
    public static function render(string $content, $query, array $attributes): string
    {
        if (strpos($content, 'wp-block-query-pagination') !== false) {
            return $content;
        }

        $paginationStyle = $attributes['paginationStyle'] ?? 'numbers';
        $paginationAlignment = $attributes['paginationAlignment'] ?? 'center';
        $showPaginationNumbers = $attributes['showPaginationNumbers'] ?? true;
        $paginationPrevText = $attributes['paginationPrevText'] ?? '';
        $paginationNextText = $attributes['paginationNextText'] ?? '';

        $paged = max(1, get_query_var('paged'));
        if ($paged === 1) {
            $paged = max(1, get_query_var('page'));
        }

        $prevText = !empty($paginationPrevText) ? $paginationPrevText : __('&laquo; Previous', 'jankx');
        $nextText = !empty($paginationNextText) ? $paginationNextText : __('Next &raquo;', 'jankx');

        $pagination_args = [
            'total' => $query->max_num_pages,
            'current' => $paged,
            'mid_size' => 2,
            'end_size' => 1,
            'prev_text' => $prevText,
            'next_text' => $nextText,
        ];

        if ($paginationStyle === 'simple') {
            $pagination_args['show_all'] = false;
            $pagination_args['type'] = 'list';
            $pagination_args['prev_next'] = true;
        } elseif ($paginationStyle === 'arrows') {
            if (empty($paginationPrevText)) {
                $pagination_args['prev_text'] = '<span aria-hidden="true">&larr;</span> ' . __('Previous', 'jankx');
            }
            if (empty($paginationNextText)) {
                $pagination_args['next_text'] = __('Next', 'jankx') . ' <span aria-hidden="true">&rarr;</span>';
            }
            $pagination_args['type'] = 'list';
            $pagination_args['show_all'] = false;
        } elseif ($paginationStyle === 'load-more') {
            return self::renderLoadMoreButton($query, $paged, $attributes);
        } else {
            $pagination_args['type'] = 'list';
            $pagination_args['show_all'] = $showPaginationNumbers;
        }

        $pagination = paginate_links($pagination_args);
        if (!$pagination) {
            return '';
        }

        // Trigger on-demand CSS loading for pagination if WordPressBlock is available
        if (class_exists(\Jankx\Gutenberg\Blocks\WordPressBlock::class)) {
            \Jankx\Gutenberg\Blocks\WordPressBlock::enqueueLegacyAssets('pagination');
        }

        $wrapper_classes = [
            'post-layout-pagination',
            'wp-block-query-pagination',
            'pagination-style-' . esc_attr($paginationStyle),
            'pagination-align-' . esc_attr($paginationAlignment),
        ];

        return sprintf(
            '<nav class="%s" aria-label="%s" role="navigation">%s</nav>',
            esc_attr(implode(' ', $wrapper_classes)),
            esc_attr__('Posts navigation', 'jankx'),
            $pagination
        );
    }

    public static function renderLoadMoreButton($query, int $current_page, array $attributes = []): string
    {
        if ($current_page >= $query->max_num_pages) {
            return '';
        }
        $next_page = $current_page + 1;
        $ajax_data = wp_json_encode([
            'attributes' => $attributes,
            'page' => $next_page,
        ]);
        return sprintf(
            '<div class="post-layout-pagination pagination-style-load-more">
                <button class="jankx-load-more-button" data-page="%d" data-max-pages="%d" data-ajax-params="%s">
                    <span class="load-more-text">%s</span>
                    <span class="load-more-spinner" style="display:none;">%s</span>
                </button>
            </div>',
            esc_attr($next_page),
            esc_attr($query->max_num_pages),
            esc_attr($ajax_data),
            esc_html__('Load More', 'jankx'),
            esc_html__('Loading...', 'jankx')
        );
    }
}

