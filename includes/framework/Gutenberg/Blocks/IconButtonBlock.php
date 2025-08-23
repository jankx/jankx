<?php

namespace Jankx\Gutenberg\Blocks;

/**
 * Icon Button Block
 *
 * This block creates a customizable button with icon support from Jankx Font Icons System.
 * It supports various button types, sizes, styles, icon positions, and custom icon selection.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class IconButtonBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/icon-button', [
            'title' => __('Icon Button', 'jankx'),
            'category' => 'design',
            'icon' => 'button',
            'description' => __('Button với khả năng thêm icon từ Jankx Font Icons System hoặc upload custom icon', 'jankx'),
            'keywords' => ['button', 'icon', 'link', 'cta', 'action', 'jankx'],
            'supports' => [
                'html' => false,
                'align' => true,
                'alignWide' => true,
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ],
                'color' => [
                    'text' => true,
                    'background' => true,
                    'gradients' => true
                ],
                'typography' => [
                    'fontSize' => true,
                    'lineHeight' => true,
                    'fontFamily' => true,
                    'fontWeight' => true,
                    'fontStyle' => true,
                    'letterSpacing' => true
                ],
                'border' => [
                    'color' => true,
                    'radius' => true,
                    'style' => true,
                    'width' => true
                ]
            ],
            'attributes' => [
                'text' => [
                    'type' => 'string',
                    'default' => 'Click me'
                ],
                'url' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'linkTarget' => [
                    'type' => 'string',
                    'default' => '_self'
                ],
                'rel' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'buttonType' => [
                    'type' => 'string',
                    'default' => 'primary'
                ],
                'buttonSize' => [
                    'type' => 'string',
                    'default' => 'medium'
                ],
                'buttonStyle' => [
                    'type' => 'string',
                    'default' => 'filled'
                ],
                'buttonWidth' => [
                    'type' => 'string',
                    'default' => 'auto'
                ],
                'iconPosition' => [
                    'type' => 'string',
                    'default' => 'left'
                ],
                'iconSpacing' => [
                    'type' => 'string',
                    'default' => '8px'
                ],
                'showIcon' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'iconType' => [
                    'type' => 'string',
                    'default' => 'font' // 'font' or 'custom'
                ],
                'fontIcon' => [
                    'type' => 'string',
                    'default' => 'arrow_forward'
                ],
                'customIcon' => [
                    'type' => 'object',
                    'default' => null
                ],
                'iconSize' => [
                    'type' => 'string',
                    'default' => '20px'
                ],
                'customClassName' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'anchor' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/icon-button';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'style-index.css';
        }

        // Register block
        $this->registerBlock($blockPath, $metadata);
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
        $text = $attributes['text'] ?? 'Click me';
        $url = $attributes['url'] ?? '';
        $linkTarget = $attributes['linkTarget'] ?? '_self';
        $rel = $attributes['rel'] ?? '';
        $buttonType = $attributes['buttonType'] ?? 'primary';
        $buttonSize = $attributes['buttonSize'] ?? 'medium';
        $buttonStyle = $attributes['buttonStyle'] ?? 'filled';
        $buttonWidth = $attributes['buttonWidth'] ?? 'auto';
        $iconPosition = $attributes['iconPosition'] ?? 'left';
        $iconSpacing = $attributes['iconSpacing'] ?? '8px';
        $showIcon = $attributes['showIcon'] ?? false;
        $iconType = $attributes['iconType'] ?? 'font';
        $fontIcon = $attributes['fontIcon'] ?? 'arrow_forward';
        $customIcon = $attributes['customIcon'] ?? null;
        $iconSize = $attributes['iconSize'] ?? '20px';
        $customClassName = $attributes['customClassName'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        if (empty($text)) {
            return $this->renderPlaceholder();
        }

        // Build button classes
        $buttonClasses = [
            'jankx-icon-button__button',
            "jankx-icon-button__button--{$buttonType}",
            "jankx-icon-button__button--{$buttonSize}",
            "jankx-icon-button__button--{$buttonStyle}",
            $buttonWidth === 'full' ? 'jankx-icon-button__button--full-width' : ''
        ];

        // Build button style
        $buttonStyle = [];
        if ($buttonWidth === 'custom') {
            $buttonStyle[] = 'width: 200px';
        }

        // Build content HTML
        $contentHtml = $this->renderButtonContent($text, $showIcon, $iconPosition, $iconSpacing, $iconType, $fontIcon, $customIcon, $iconSize);

        // Build final HTML
        $className = sprintf(
            'jankx-icon-button jankx-icon-button--%s jankx-icon-button--%s jankx-icon-button--%s %s',
            esc_attr($buttonType),
            esc_attr($buttonSize),
            esc_attr($buttonStyle),
            esc_attr($customClassName)
        );

        $id = !empty($anchor) ? sprintf(' id="%s"', esc_attr($anchor)) : '';

        if (!empty($url)) {
            $relAttr = !empty($rel) ? sprintf(' rel="%s"', esc_attr($rel)) : '';
            return sprintf(
                '<div class="%s"%s><a href="%s" target="%s"%s class="%s" style="%s">%s</a></div>',
                esc_attr(trim($className)),
                $id,
                esc_url($url),
                esc_attr($linkTarget),
                $relAttr,
                esc_attr(implode(' ', array_filter($buttonClasses))),
                esc_attr(implode('; ', $buttonStyle)),
                $contentHtml
            );
        }

        return sprintf(
            '<div class="%s"%s><button type="button" class="%s" style="%s">%s</button></div>',
            esc_attr(trim($className)),
            $id,
            esc_attr(implode(' ', array_filter($buttonClasses))),
            esc_attr(implode('; ', $buttonStyle)),
            $contentHtml
        );
    }

    /**
     * Render button content with icon
     *
     * @param string $text Button text
     * @param bool $showIcon Whether to show icon
     * @param string $iconPosition Icon position
     * @param string $iconSpacing Icon spacing
     * @param string $iconType Icon type (font or custom)
     * @param string $fontIcon Font icon class
     * @param object|null $customIcon Custom icon object
     * @param string $iconSize Icon size
     * @return string HTML content
     */
    protected function renderButtonContent($text, $showIcon, $iconPosition, $iconSpacing, $iconType, $fontIcon, $customIcon, $iconSize)
    {
        $content = [];

        // Add left icon
        if ($showIcon && $iconPosition === 'left') {
            $content[] = $this->renderIcon('left', $iconSpacing, $iconType, $fontIcon, $customIcon, $iconSize);
        }

        // Add text
        $content[] = sprintf(
            '<span class="jankx-icon-button__text">%s</span>',
            esc_html($text)
        );

        // Add right icon
        if ($showIcon && $iconPosition === 'right') {
            $content[] = $this->renderIcon('right', $iconSpacing, $iconType, $fontIcon, $customIcon, $iconSize);
        }

        return implode('', $content);
    }

    /**
     * Render icon based on type
     *
     * @param string $position Icon position
     * @param string $spacing Icon spacing
     * @param string $iconType Icon type
     * @param string $fontIcon Font icon class
     * @param object|null $customIcon Custom icon object
     * @param string $iconSize Icon size
     * @return string Icon HTML
     */
    protected function renderIcon($position, $spacing, $iconType, $fontIcon, $customIcon, $iconSize)
    {
        $marginProperty = $position === 'left' ? 'margin-right' : 'margin-left';
        $iconHtml = '';

        if ($iconType === 'font') {
            $iconHtml = sprintf('<i class="material-icons" style="font-size: %s;">%s</i>', esc_attr($iconSize), esc_attr($fontIcon));
        } elseif ($iconType === 'custom' && $customIcon && isset($customIcon['url'])) {
            $iconHtml = sprintf(
                '<img src="%s" alt="%s" style="width: %s; height: %s; object-fit: contain;" />',
                esc_url($customIcon['url']),
                esc_attr($customIcon['alt'] ?? 'Icon'),
                esc_attr($iconSize),
                esc_attr($iconSize)
            );
        } else {
            // Fallback to default icon
            $iconHtml = sprintf('<i class="material-icons" style="font-size: %s;">arrow_forward</i>', esc_attr($iconSize));
        }

        return sprintf(
            '<span class="jankx-icon-button__icon jankx-icon-button__icon--%s" style="%s: %s;">%s</span>',
            esc_attr($position),
            esc_attr($marginProperty),
            esc_attr($spacing),
            $iconHtml
        );
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="jankx-icon-button-placeholder"><p>' .
               __('Nhập text cho button để hiển thị ở đây.', 'jankx') .
               '</p></div>';
    }
}
