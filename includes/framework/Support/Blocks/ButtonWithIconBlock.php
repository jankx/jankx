<?php

namespace Jankx\Support\Blocks;

/**
 * Button with Icon Block
 *
 * This block creates a customizable button with icon support from Jankx Font Icons System.
 * It supports various button types, sizes, styles, and icon positions.
 *
 * @package Jankx\Support\Blocks
 * @since 1.0.0
 */
class ButtonWithIconBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/button-with-icon', [
            'title' => __('Button with Icon', 'jankx'),
            'category' => 'design',
            'icon' => 'button',
            'description' => __('Button với khả năng thêm icon từ Jankx Font Icons System', 'jankx'),
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
        $blockPath = get_template_directory() . '/resources/blocks/button-with-icon';
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
        $customClassName = $attributes['customClassName'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        if (empty($text)) {
            return $this->renderPlaceholder();
        }

        // Build button classes
        $buttonClasses = [
            'jankx-button-with-icon__button',
            "jankx-button-with-icon__button--{$buttonType}",
            "jankx-button-with-icon__button--{$buttonSize}",
            "jankx-button-with-icon__button--{$buttonStyle}",
            $buttonWidth === 'full' ? 'jankx-button-with-icon__button--full-width' : ''
        ];

        // Build button style
        $buttonStyle = [];
        if ($buttonWidth === 'custom') {
            $buttonStyle[] = 'width: 200px';
        }

        // Build content HTML
        $contentHtml = $this->renderButtonContent($text, $showIcon, $iconPosition, $iconSpacing);

        // Build final HTML
        $className = sprintf(
            'jankx-button-with-icon jankx-button-with-icon--%s jankx-button-with-icon--%s jankx-button-with-icon--%s %s',
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
     * @return string HTML content
     */
    protected function renderButtonContent($text, $showIcon, $iconPosition, $iconSpacing)
    {
        $content = [];

        // Add left icon
        if ($showIcon && $iconPosition === 'left') {
            $content[] = sprintf(
                '<span class="jankx-button-with-icon__icon jankx-button-with-icon__icon--left" style="margin-right: %s;"><i class="material-icons">arrow_forward</i></span>',
                esc_attr($iconSpacing)
            );
        }

        // Add text
        $content[] = sprintf(
            '<span class="jankx-button-with-icon__text">%s</span>',
            esc_html($text)
        );

        // Add right icon
        if ($showIcon && $iconPosition === 'right') {
            $content[] = sprintf(
                '<span class="jankx-button-with-icon__icon jankx-button-with-icon__icon--right" style="margin-left: %s;"><i class="material-icons">arrow_forward</i></span>',
                esc_attr($iconSpacing)
            );
        }

        return implode('', $content);
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="jankx-button-with-icon-placeholder"><p>' .
               __('Nhập text cho button để hiển thị ở đây.', 'jankx') .
               '</p></div>';
    }
}
