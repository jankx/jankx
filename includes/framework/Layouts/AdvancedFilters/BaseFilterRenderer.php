<?php

/**
 * Base Filter Renderer
 *
 * Abstract base class for all filter renderers
 * Provides common functionality
 *
 * @package Jankx\Layouts\AdvancedFilters
 * @since 1.0.0
 */

namespace Jankx\Layouts\AdvancedFilters;

use Jankx\Layouts\AdvancedFilters\Contracts\FilterRendererInterface;

abstract class BaseFilterRenderer implements FilterRendererInterface
{
    /**
     * Get global setting with fallback
     *
     * @param array $filter Filter configuration
     * @param string $setting Setting key
     * @param mixed $global_value Global value
     * @param mixed $default Default value
     * @return mixed
     */
    protected function getSetting(array $filter, string $setting, $global_value, $default = null)
    {
        return isset($filter[$setting]) ? $filter[$setting] : ($global_value ?? $default);
    }

    /**
     * Build filter group classes
     *
     * @param string $filter_type Filter type
     * @param array $filter Filter configuration
     * @param string $layout Layout
     * @return array
     */
    protected function buildGroupClasses(string $filter_type, array $filter, string $layout): array
    {
        $classes = ['filter-group', "filter-{$filter_type}"];

        $collapsible = $filter['collapsible'] ?? false;
        if ($collapsible) {
            $classes[] = 'filter-collapsible';
            $default_expanded = $filter['defaultExpanded'] ?? true;
            if ($default_expanded) {
                $classes[] = 'filter-expanded';
            }
        }

        return $classes;
    }

    /**
     * Render collapsible header
     *
     * @param string $label Label text
     * @param bool $show_label Whether to show label
     * @param bool $default_expanded Whether expanded by default
     * @return void
     */
    protected function renderCollapsibleHeader(string $label, bool $show_label, bool $default_expanded): void
    {
        if (!$show_label) {
            return;
        }

        echo '<div class="filter-group-header">';
        echo '<label class="filter-group-label">' . esc_html($label) . '</label>';
        echo '<button type="button" class="filter-group-toggle" aria-expanded="' . ($default_expanded ? 'true' : 'false') . '">';
        echo '<span class="filter-toggle-icon">' . ($default_expanded ? '▼' : '▶') . '</span>';
        echo '</button>';
        echo '</div>';
        echo '<div class="filter-group-content" style="display: ' . ($default_expanded ? 'block' : 'none') . ';">';
    }

    /**
     * Render label
     *
     * @param string $label Label text
     * @param bool $show_label Whether to show label
     * @return void
     */
    protected function renderLabel(string $label, bool $show_label): void
    {
        if (!$show_label) {
            return;
        }

        echo '<label class="filter-group-label">' . esc_html($label) . '</label>';
    }

    /**
     * Sanitize and render SVG/HTML icon
     * 
     * Allows SVG tags and common SVG attributes while preventing XSS
     *
     * @param string $icon SVG/HTML string
     * @return string Sanitized HTML
     */
    protected function renderSvgIcon(string $icon): string
    {
        $allowed_html = [
            'svg' => [
                'xmlns' => true,
                'viewBox' => true,
                'width' => true,
                'height' => true,
                'class' => true,
                'style' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'stroke-linecap' => true,
                'stroke-linejoin' => true,
                'data-*' => true,
            ],
            'path' => [
                'd' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'circle' => [
                'cx' => true,
                'cy' => true,
                'r' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'line' => [
                'x1' => true,
                'y1' => true,
                'x2' => true,
                'y2' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'rect' => [
                'x' => true,
                'y' => true,
                'width' => true,
                'height' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'rx' => true,
                'ry' => true,
                'data-*' => true,
            ],
            'g' => [
                'class' => true,
                'style' => true,
                'fill' => true,
                'stroke' => true,
                'transform' => true,
                'data-*' => true,
            ],
            'text' => [
                'x' => true,
                'y' => true,
                'class' => true,
                'style' => true,
                'text-anchor' => true,
                'data-*' => true,
            ],
            'tspan' => [
                'x' => true,
                'y' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'polygon' => [
                'points' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'polyline' => [
                'points' => true,
                'fill' => true,
                'stroke' => true,
                'stroke-width' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'use' => [
                'href' => true,
                'xlink:href' => true,
                'x' => true,
                'y' => true,
                'width' => true,
                'height' => true,
                'class' => true,
                'style' => true,
                'data-*' => true,
            ],
            'defs' => [],
            'style' => [],
            'title' => [],
            'desc' => [],
        ];

        return wp_kses($icon, $allowed_html);
    }
}

