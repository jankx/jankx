<?php

/**
 * Taxonomy Filter Renderer
 *
 * Renders taxonomy-based filters (categories, tags, custom taxonomies)
 *
 * @package Jankx\Layouts\AdvancedFilters\Renderers
 * @since 1.0.0
 */

namespace Jankx\Layouts\AdvancedFilters\Renderers;

use Jankx\Layouts\AdvancedFilters\BaseFilterRenderer;

class TaxonomyFilterRenderer extends BaseFilterRenderer
{
    /**
     * {@inheritDoc}
     */
    public function getFilterType(): string
    {
        return 'taxonomy';
    }

    /**
     * {@inheritDoc}
     */
    public function canHandle(array $filter): bool
    {
        return ($filter['filterType'] ?? 'taxonomy') === 'taxonomy' && !empty($filter['taxonomy']);
    }

    /**
     * {@inheritDoc}
     */
    public function render(array $filter, array $global_settings): void
    {
        $taxonomy = get_taxonomy($filter['taxonomy']);
        if (!$taxonomy) {
            return;
        }

        // Get settings with fallback to global
        $show_labels = $this->getSetting($filter, 'showLabels', $global_settings['showLabels'] ?? true, true);
        $display_style = $this->getSetting($filter, 'displayStyle', $global_settings['displayStyle'] ?? 'buttons', 'buttons');
        $listing_type = $this->getSetting($filter, 'listingType', $global_settings['listingType'] ?? 'ul', 'ul');
        $show_count = $this->getSetting($filter, 'showCount', $global_settings['showCount'] ?? false, false);
        $show_empty_terms = $this->getSetting($filter, 'showEmptyTerms', $global_settings['showEmptyTerms'] ?? true, true);
        $show_only_top_level = $this->getSetting($filter, 'showOnlyTopLevel', $global_settings['showOnlyTopLevel'] ?? false, false);
        $show_hierarchy = $this->getSetting($filter, 'showHierarchy', $global_settings['showHierarchy'] ?? false, false);
        $display_as_dropdown = $this->getSetting($filter, 'displayAsDropdown', $global_settings['displayAsDropdown'] ?? false, false);
        $multiple_selection = $this->getSetting($filter, 'multipleSelection', $global_settings['multipleSelection'] ?? true, true);
        $collapsible = $filter['collapsible'] ?? false;
        $default_expanded = $filter['defaultExpanded'] ?? true;
        $layout = $filter['layout'] ?? $global_settings['layout'] ?? 'horizontal';

        // Get terms
        $term_args = [
            'taxonomy' => $filter['taxonomy'],
            'hide_empty' => !$show_empty_terms,
            'orderby' => 'name',
            'order' => 'ASC',
        ];

        if ($show_only_top_level) {
            $term_args['parent'] = 0;
        }

        if ($show_hierarchy) {
            $term_args['hierarchical'] = true;
        }

        $terms = get_terms($term_args);

        if (is_wp_error($terms) || empty($terms)) {
            return;
        }

        $label = !empty($filter['label']) ? $filter['label'] : $taxonomy->label;
        $input_type = $multiple_selection ? 'checkbox' : 'radio';
        $name_attr = $multiple_selection ? $filter['taxonomy'] . '[]' : $filter['taxonomy'];

        // Build classes
        $group_classes = $this->buildGroupClasses('taxonomy', $filter, $layout);

        echo '<div class="' . esc_attr(implode(' ', $group_classes)) . '" data-filter-type="taxonomy" data-taxonomy="' . esc_attr($filter['taxonomy']) . '" data-layout="' . esc_attr($layout) . '" data-display-style="' . esc_attr($display_style) . '" data-multiple-selection="' . ($multiple_selection ? 'true' : 'false') . '">';

        // Render header/label
        if ($collapsible) {
            $this->renderCollapsibleHeader($label, $show_labels, $default_expanded);
        } else {
            $this->renderLabel($label, $show_labels);
        }

        // Render options
        if ($display_as_dropdown) {
            $this->renderDropdown($terms, $show_count, $show_hierarchy, $show_only_top_level);
        } else {
            $this->renderOptions($terms, $display_style, $listing_type, $show_count, $input_type, $name_attr, $show_hierarchy, $show_only_top_level);
        }

        if ($collapsible) {
            echo '</div>'; // End filter-group-content
        }

        echo '</div>'; // End filter-group
    }

    /**
     * Render dropdown
     *
     * @param array $terms
     * @param bool $show_count
     * @param bool $show_hierarchy
     * @param bool $show_only_top_level
     * @return void
     */
    protected function renderDropdown(array $terms, bool $show_count, bool $show_hierarchy, bool $show_only_top_level): void
    {
        echo '<select class="filter-select">';
        echo '<option value="">' . esc_html__('All', 'jankx') . '</option>';

        if ($show_hierarchy && !$show_only_top_level) {
            $this->renderHierarchyDropdown($terms, $show_count, 0);
        } else {
            foreach ($terms as $term) {
                $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
                echo '<option value="' . esc_attr($term->term_id) . '">';
                echo esc_html($term->name) . esc_html($count_text);
                echo '</option>';
            }
        }

        echo '</select>';
    }

    /**
     * Render hierarchy dropdown
     *
     * @param array $terms
     * @param bool $show_count
     * @param int $depth
     * @return void
     */
    protected function renderHierarchyDropdown(array $terms, bool $show_count, int $depth): void
    {
        foreach ($terms as $term) {
            $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
            $indent = str_repeat('&nbsp;&nbsp;', $depth);

            echo '<option value="' . esc_attr($term->term_id) . '">';
            echo $indent . esc_html($term->name) . esc_html($count_text);
            echo '</option>';

            if (!empty($term->children)) {
                $this->renderHierarchyDropdown($term->children, $show_count, $depth + 1);
            }
        }
    }

    /**
     * Render options
     *
     * @param array $terms
     * @param string $display_style
     * @param string $listing_type
     * @param bool $show_count
     * @param string $input_type
     * @param string $name_attr
     * @param bool $show_hierarchy
     * @param bool $show_only_top_level
     * @return void
     */
    protected function renderOptions(array $terms, string $display_style, string $listing_type, bool $show_count, string $input_type, string $name_attr, bool $show_hierarchy, bool $show_only_top_level): void
    {
        // Determine list tag
        $list_tag = 'div';
        $item_tag = 'div';
        $list_class = 'filter-options display-' . esc_attr($display_style);

        if ($display_style === 'checkboxes' && $listing_type !== 'none') {
            $list_tag = $listing_type === 'ol' ? 'ol' : 'ul';
            $item_tag = 'li';
            $list_class .= ' filter-list-' . esc_attr($listing_type);
        } elseif ($display_style === 'checkboxes' && $listing_type === 'none') {
            $list_tag = 'div';
            $item_tag = 'div';
            $list_class .= ' filter-list-none';
        }

        echo '<' . $list_tag . ' class="' . esc_attr($list_class) . '">';

        if ($show_hierarchy && !$show_only_top_level) {
            $this->renderHierarchyOptions($terms, $display_style, $listing_type, $show_count, $input_type, $name_attr, $item_tag, 0);
        } else {
            foreach ($terms as $term) {
                $this->renderTermOption($term, $display_style, $listing_type, $show_count, $input_type, $name_attr, $item_tag, 0);
            }
        }

        echo '</' . $list_tag . '>';
    }

    /**
     * Render hierarchy options
     *
     * @param array $terms
     * @param string $display_style
     * @param string $listing_type
     * @param bool $show_count
     * @param string $input_type
     * @param string $name_attr
     * @param string $item_tag
     * @param int $depth
     * @return void
     */
    protected function renderHierarchyOptions(array $terms, string $display_style, string $listing_type, bool $show_count, string $input_type, string $name_attr, string $item_tag, int $depth): void
    {
        foreach ($terms as $term) {
            $this->renderTermOption($term, $display_style, $listing_type, $show_count, $input_type, $name_attr, $item_tag, $depth);

            if (!empty($term->children)) {
                if ($display_style === 'checkboxes' && $listing_type !== 'none') {
                    echo '<' . $item_tag . '><' . ($listing_type === 'ol' ? 'ol' : 'ul') . ' class="filter-terms-nested">';
                }
                $this->renderHierarchyOptions($term->children, $display_style, $listing_type, $show_count, $input_type, $name_attr, $item_tag, $depth + 1);
                if ($display_style === 'checkboxes' && $listing_type !== 'none') {
                    echo '</' . ($listing_type === 'ol' ? 'ol' : 'ul') . '></' . $item_tag . '>';
                }
            }
        }
    }

    /**
     * Render single term option
     *
     * @param object $term
     * @param string $display_style
     * @param string $listing_type
     * @param bool $show_count
     * @param string $input_type
     * @param string $name_attr
     * @param string $item_tag
     * @param int $depth
     * @return void
     */
    protected function renderTermOption(object $term, string $display_style, string $listing_type, bool $show_count, string $input_type, string $name_attr, string $item_tag, int $depth): void
    {
        $count_text = $show_count ? ' (' . intval($term->count) . ')' : '';
        $indent_class = $depth > 0 ? ' filter-term-child' : '';

        if ($display_style === 'buttons') {
            echo '<span class="filter-option filter-term-item' . esc_attr($indent_class) . '" style="padding-left: ' . ($depth * 20) . 'px;" data-value="' . esc_attr($term->term_id) . '">';
            echo esc_html($term->name) . esc_html($count_text);
            echo '</span>';
        } else {
            if ($display_style === 'checkboxes' && $listing_type !== 'none') {
                echo '<' . $item_tag . ' class="filter-option-wrapper' . esc_attr($indent_class) . '">';
            }
            echo '<label class="filter-option filter-term-item' . esc_attr($indent_class) . '" style="padding-left: ' . ($depth * 20) . 'px;">';
            echo '<input type="' . esc_attr($input_type) . '" name="' . esc_attr($name_attr) . '" value="' . esc_attr($term->term_id) . '">';
            echo '<span>' . esc_html($term->name) . esc_html($count_text) . '</span>';
            echo '</label>';
            if ($display_style === 'checkboxes' && $listing_type !== 'none') {
                echo '</' . $item_tag . '>';
            }
        }
    }
}

