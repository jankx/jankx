<?php

namespace Jankx\Layouts\AdvancedFilters\Renderers;

use Jankx\Layouts\AdvancedFilters\BaseFilterRenderer;

/**
 * Post Types Filter Renderer
 *
 * Renders a single-select picker of post types. Selecting an option switches
 * the target dynamic-data-layout query to that post type via the existing
 * `filters.post_type` AJAX pipeline (see DynamicDataLayoutQueryHelper).
 *
 * Options come from the target layout's multi-post-type allowlist when it is
 * enabled, otherwise from every public post type.
 */
class PostTypeFilterRenderer extends BaseFilterRenderer
{
    /**
     * {@inheritDoc}
     */
    public function getFilterType(): string
    {
        return 'post_types';
    }

    /**
     * {@inheritDoc}
     */
    public function canHandle(array $filter): bool
    {
        return ($filter['filterType'] ?? '') === 'post_types';
    }

    /**
     * {@inheritDoc}
     */
    public function render(array $filter, array $global_settings): void
    {
        $show_labels = $this->getSetting($filter, 'showLabels', $global_settings['showLabels'] ?? true, true);
        $display_style = $this->getSetting($filter, 'displayStyle', $global_settings['displayStyle'] ?? 'buttons', 'buttons');
        $listing_type = $this->getSetting($filter, 'listingType', $global_settings['listingType'] ?? 'ul', 'ul');
        $collapsible = $filter['collapsible'] ?? false;
        $default_expanded = $filter['defaultExpanded'] ?? true;
        $layout = $filter['layout'] ?? $global_settings['layout'] ?? 'horizontal';
        $label = !empty($filter['label']) ? $filter['label'] : __('Post Type', 'jankx');

        $post_types = $this->resolvePostTypes($global_settings);
        if (empty($post_types)) {
            return;
        }

        $group_classes = $this->buildGroupClasses('post_types', $filter, $layout);

        echo '<div class="' . esc_attr(implode(' ', $group_classes)) . '" data-filter-type="post_types" data-layout="' . esc_attr($layout) . '" data-display-style="' . esc_attr($display_style) . '">';

        if ($collapsible) {
            $this->renderCollapsibleHeader($label, $show_labels, $default_expanded);
        } else {
            $this->renderLabel($label, $show_labels);
        }

        if ($display_style === 'dropdown') {
            $this->renderSmoothDropdown($post_types, $label);
        } elseif ($display_style === 'tabs') {
            $this->renderTabs($post_types);
        } elseif ($display_style === 'buttons') {
            $this->renderButtons($post_types);
        } else {
            $this->renderRadioList($post_types, $listing_type);
        }

        if ($collapsible) {
            echo '</div>'; // end filter-group-content
        }

        echo '</div>'; // end filter-group
    }

    /**
     * Resolve the list of selectable post types.
     *
     * Prefers the target layout's allowlist (multiPostTypes, injected by the
     * advanced-filters parent); falls back to all public post types.
     *
     * @param array $global_settings
     * @return array<string,string> Map of slug => label
     */
    protected function resolvePostTypes(array $global_settings): array
    {
        $multi = $global_settings['multiPostTypes'] ?? [];
        $allowed = is_array($multi['postTypes'] ?? null) ? array_values(array_filter($multi['postTypes'])) : [];

        $slugs = [];
        if (!empty($multi['enabled']) && count($allowed) > 0) {
            $slugs = $allowed;
        } else {
            $slugs = array_keys(get_post_types(['public' => true], 'names'));
            $slugs = array_values(array_diff($slugs, ['attachment']));
        }

        $options = [];
        foreach ($slugs as $slug) {
            $obj = get_post_type_object($slug);
            if (!$obj) {
                continue;
            }
            $options[$slug] = $obj->labels->singular_name ?: ucwords(str_replace(['-', '_'], ' ', $slug));
        }

        return $options;
    }

    /**
     * Render smooth animated dropdown (display style "dropdown").
     *
     * @param array<string,string> $post_types
     * @param string $label
     * @return void
     */
    protected function renderSmoothDropdown(array $post_types, string $label): void
    {
        $all_label = __('All', 'jankx');
        $this->renderSmoothDropdownStart($all_label, $all_label);

        echo '<div class="filter-options display-dropdown">';
        echo '<label class="filter-option filter-pt-item active" data-value="">';
        echo '<input type="radio" name="post_type" value="" checked="checked" />';
        echo '<span>' . esc_html($all_label) . '</span>';
        echo '</label>';
        foreach ($post_types as $slug => $name) {
            echo '<label class="filter-option filter-pt-item" data-value="' . esc_attr($slug) . '">';
            echo '<input type="radio" name="post_type" value="' . esc_attr($slug) . '" />';
            echo '<span>' . esc_html($name) . '</span>';
            echo '</label>';
        }
        echo '</div>';

        $this->renderSmoothDropdownEnd();
    }

    /**
     * Render tabs display style.
     *
     * @param array<string,string> $post_types
     * @return void
     */
    protected function renderTabs(array $post_types): void
    {
        echo '<div class="filter-options display-tabs">';
        echo '<span class="filter-tab filter-option filter-pt-item active" data-value="">';
        echo esc_html__('All', 'jankx');
        echo '</span>';
        foreach ($post_types as $slug => $name) {
            echo '<span class="filter-tab filter-option filter-pt-item" data-value="' . esc_attr($slug) . '">';
            echo esc_html($name);
            echo '</span>';
        }
        echo '</div>';
    }

    /**
     * Render buttons display style.
     *
     * @param array<string,string> $post_types
     * @return void
     */
    protected function renderButtons(array $post_types): void
    {
        echo '<div class="filter-options display-buttons">';
        echo '<span class="filter-option filter-pt-item active" data-value="">';
        echo esc_html__('All', 'jankx');
        echo '</span>';
        foreach ($post_types as $slug => $name) {
            echo '<span class="filter-option filter-pt-item" data-value="' . esc_attr($slug) . '">';
            echo esc_html($name);
            echo '</span>';
        }
        echo '</div>';
    }

    /**
     * Render checkboxes-style radio list (default display style).
     *
     * Single-select radios only: the server pipeline (`filters.post_type`)
     * accepts a string, not an array.
     *
     * @param array<string,string> $post_types
     * @param string $listing_type
     * @return void
     */
    protected function renderRadioList(array $post_types, string $listing_type): void
    {
        $list_tag = 'div';
        $item_tag = 'div';
        $list_class = 'filter-options display-checkboxes';

        if ($listing_type !== 'none') {
            $list_tag = $listing_type === 'ol' ? 'ol' : 'ul';
            $item_tag = 'li';
            $list_class .= ' filter-list-' . esc_attr($listing_type);
        } else {
            $list_class .= ' filter-list-none';
        }

        echo '<' . $list_tag . ' class="' . esc_attr($list_class) . '">';
        if ($item_tag === 'li') {
            echo '<' . $item_tag . '>';
        }
        echo '<label class="filter-option filter-pt-item active" data-value="">';
        echo '<input type="radio" name="post_type" value="" checked="checked" />';
        echo '<span>' . esc_html__('All', 'jankx') . '</span>';
        echo '</label>';
        if ($item_tag === 'li') {
            echo '</' . $item_tag . '>';
        }

        foreach ($post_types as $slug => $name) {
            if ($item_tag === 'li') {
                echo '<' . $item_tag . '>';
            }
            echo '<label class="filter-option filter-pt-item" data-value="' . esc_attr($slug) . '">';
            echo '<input type="radio" name="post_type" value="' . esc_attr($slug) . '" />';
            echo '<span>' . esc_html($name) . '</span>';
            echo '</label>';
            if ($item_tag === 'li') {
                echo '</' . $item_tag . '>';
            }
        }

        echo '</' . $list_tag . '>';
    }
}
