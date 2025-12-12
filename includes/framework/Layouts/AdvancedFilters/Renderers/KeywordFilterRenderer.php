<?php

namespace Jankx\Layouts\AdvancedFilters\Renderers;

use Jankx\Layouts\AdvancedFilters\BaseFilterRenderer;

/**
 * Keyword Filter Renderer
 *
 * Renders keyword search input
 */
class KeywordFilterRenderer extends BaseFilterRenderer
{
    /**
     * {@inheritDoc}
     */
    public function getFilterType(): string
    {
        return 'keyword';
    }

    /**
     * {@inheritDoc}
     */
    public function canHandle(array $filter): bool
    {
        return ($filter['filterType'] ?? 'keyword') === 'keyword';
    }

    /**
     * {@inheritDoc}
     */
    public function render(array $filter, array $global_settings): void
    {
        $show_labels = $this->getSetting($filter, 'showLabels', $global_settings['showLabels'] ?? true, true);
        $layout = $filter['layout'] ?? $global_settings['layout'] ?? 'horizontal';
        $placeholder = $filter['placeholder'] ?? __('Search...', 'jankx');
        $show_search_button = isset($filter['showSearchButton']) ? (bool) $filter['showSearchButton'] : false;
        $keyword_action = $filter['keywordAction'] ?? 'typing';
        $search_button_text = $filter['searchButtonText'] ?? __('Search', 'jankx');
        $search_button_display = $filter['searchButtonDisplay'] ?? 'text';
        $search_button_icon = $filter['searchButtonIcon'] ?? '';
        $collapsible = $filter['collapsible'] ?? false;
        $default_expanded = $filter['defaultExpanded'] ?? true;
        $label = !empty($filter['label']) ? $filter['label'] : __('Keyword', 'jankx');

        $group_classes = $this->buildGroupClasses('keyword', $filter, $layout);

        echo '<div class="' . esc_attr(implode(' ', $group_classes)) . '" data-filter-type="keyword" data-layout="' . esc_attr($layout) . '" data-keyword-action="' . esc_attr($keyword_action) . '">';

        if ($collapsible) {
            $this->renderCollapsibleHeader($label, $show_labels, $default_expanded);
        } else {
            $this->renderLabel($label, $show_labels);
        }

        echo '<div class="filter-keyword-wrapper">';
        echo '<input type="text" class="filter-input filter-input-keyword" placeholder="' . esc_attr($placeholder) . '" />';

        // Render post type radios when multi post type is enabled
        $multi = $global_settings['multiPostTypes'] ?? ['enabled' => false, 'postTypes' => []];
        $post_types = is_array($multi['postTypes'] ?? null) ? $multi['postTypes'] : [];
        if (!empty($multi['enabled']) && count($post_types) > 1) {
            echo '<div class="post-type-radios" role="radiogroup" aria-label="' . esc_attr(__('Post Type', 'jankx')) . '">';
            // "All" option
            echo '<label class="filter-option"><input type="radio" name="post_type" value="" checked /> ' . esc_html(__('Tất cả', 'jankx')) . '</label>';
            foreach ($post_types as $pt) {
                $obj = get_post_type_object($pt);
                $label_text = $obj && isset($obj->labels->singular_name) ? $obj->labels->singular_name : ucwords(str_replace(['-', '_'], ' ', $pt));
                echo '<label class="filter-option"><input type="radio" name="post_type" value="' . esc_attr($pt) . '" /> ' . esc_html($label_text) . '</label>';
            }
            echo '</div>';
        }

        if ($show_search_button) {
            echo '<button type="button" class="filter-search-button">';
            if ($search_button_display === 'icon' || $search_button_display === 'icon-text') {
                // Render SVG/HTML icon with proper sanitization
                echo $this->renderSvgIcon($search_button_icon);
                if ($search_button_display === 'icon-text') {
                    echo ' ';
                }
            }
            if ($search_button_display === 'text' || $search_button_display === 'icon-text') {
                echo esc_html($search_button_text);
            }
            echo '</button>';
        }
        echo '</div>';

        if ($collapsible) {
            echo '</div>'; // end filter-group-content
        }

        echo '</div>'; // end filter-group
    }
}

