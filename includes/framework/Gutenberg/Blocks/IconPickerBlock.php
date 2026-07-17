<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Icon Picker Block
 *
 * This block allows users to select and customize icons from various icon libraries
 * including FontAwesome and Material Icons. It supports linking, labeling, and
 * extensive customization options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class IconPickerBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/icon-picker';



    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {


        // Register REST API endpoints for icon data
        add_action('rest_api_init', [$this, 'registerRestEndpoints']);
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $iconName = $attributes['iconName'] ?? '';
        $iconType = $attributes['iconType'] ?? 'material';
        $iconCategory = $attributes['iconCategory'] ?? '';
        $iconSize = $attributes['iconSize'] ?? '24px';
        $iconColor = $attributes['iconColor'] ?? '#333333';
        $iconAlignment = $attributes['iconAlignment'] ?? 'left';
        $iconStyle = $attributes['iconStyle'] ?? 'filled';
        $linkUrl = $attributes['linkUrl'] ?? '';
        $linkTarget = $attributes['linkTarget'] ?? '_self';
        $linkRel = $attributes['linkRel'] ?? '';
        $showLabel = $attributes['showLabel'] ?? false;
        $iconLabel = $attributes['iconLabel'] ?? '';
        $labelPosition = $attributes['labelPosition'] ?? 'after';
        $customClassName = $attributes['customClassName'] ?? '';

        if (empty($iconName)) {
            return $this->renderPlaceholder();
        }

        // Render icon
        $iconHtml = $this->renderIcon($iconName, $iconType, $iconCategory, $iconSize, $iconColor, $iconStyle);

        // Render label if enabled
        $labelHtml = '';
        if ($showLabel && !empty($iconLabel)) {
            $labelHtml = sprintf(
                '<span class="jankx-icon-picker-block__label jankx-icon-picker-block__label--%s">%s</span>',
                esc_attr($labelPosition),
                esc_html($iconLabel)
            );
        }

        // Build content
        $contentHtml = $iconHtml . $labelHtml;

        // Wrap in link if URL provided
        if (!empty($linkUrl)) {
            $rel = !empty($linkRel) ? ' rel="' . esc_attr($linkRel) . '"' : '';
            $contentHtml = sprintf(
                '<a href="%s" target="%s"%s class="jankx-icon-picker-block__link">%s</a>',
                esc_url($linkUrl),
                esc_attr($linkTarget),
                $rel,
                $contentHtml
            );
        }

        // Build final HTML
        $className = sprintf(
            'jankx-icon-picker-block jankx-icon-picker-block--%s %s',
            esc_attr($iconAlignment),
            esc_attr($customClassName)
        );

        return sprintf(
            '<div class="%s"><div class="jankx-icon-picker-block__content" style="text-align: %s;">%s</div></div>',
            esc_attr(trim($className)),
            esc_attr($iconAlignment),
            $contentHtml
        );
    }

    /**
     * Render icon HTML based on library and category
     *
     * @param string $iconName Icon name
     * @param string $library Icon library
     * @param string $category Icon category
     * @param int $size Icon size
     * @param string $color Icon color
     * @return string Icon HTML
     */
    protected function renderIcon($iconName, $iconType, $iconCategory, $iconSize, $iconColor, $iconStyle)
    {
        $style = sprintf('font-size: %s; color: %s;', esc_attr($iconSize), esc_attr($iconColor));

        if ($iconType === 'material') {
            $styleClass = $iconStyle !== 'filled' ? "material-icons-{$iconStyle}" : 'material-icons';
            return sprintf(
                '<span
                    class="%s"
                    style="%s"
                    aria-hidden="true"
                >%s</span>',
                esc_attr($styleClass),
                $style,
                esc_html($iconName)
            );
        } elseif ($iconType === 'fontawesome') {
            $prefix = $iconCategory === 'brands' ? 'fab' :
                     ($iconCategory === 'regular' ? 'far' : 'fas');
            return sprintf(
                '<i
                    class="%s fa-%s"
                    style="%s"
                    aria-hidden="true"
                ></i>',
                esc_attr($prefix),
                esc_attr($iconName),
                $style
            );
        } elseif ($iconType === 'custom') {
            return sprintf(
                '<span
                    class="icon icon-%s"
                    style="%s"
                    aria-hidden="true"
                ></span>',
                esc_attr($iconName),
                $style
            );
        }

        return '';
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="jankx-icon-picker-placeholder"><p>' .
               __('Chọn icon từ Jankx Font Icons System để hiển thị ở đây.', 'jankx') .
               '</p></div>';
    }

    /**
     * Register REST API endpoints
     *
     * @return void
     */
    public function registerRestEndpoints()
    {
        // Register available icons endpoint
        register_rest_route('jankx/v1', '/icons/available', [
            'methods' => 'GET',
            'callback' => [$this, 'getAvailableIcons'],
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            }
        ]);
    }

    /**
     * Get available icons from Jankx Font Icons System
     *
     * @return \WP_REST_Response
     */
    public function getAvailableIcons()
    {
        // Sử dụng Jankx Font Icons Repository
        if (function_exists('jankx') && jankx()->bound('font-icons.repository')) {
            $repository = jankx()->make('font-icons.repository');
            $iconTypes = $repository->getIconTypes();

            return rest_ensure_response($iconTypes);
        }

        // Fallback to default icons if Jankx not available
        return rest_ensure_response([
            'material' => [
                'name' => 'Material Icons',
                'categories' => ['navigation', 'action', 'toggle', 'social', 'communication', 'maps'],
                'icons' => [
                    ['name' => 'home', 'category' => 'navigation'],
                    ['name' => 'search', 'category' => 'action'],
                    ['name' => 'favorite', 'category' => 'toggle'],
                    ['name' => 'settings', 'category' => 'action'],
                    ['name' => 'person', 'category' => 'social']
                ]
            ]
        ]);
    }
}
