<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * SVG Icon Button Block
 *
 * This block displays a button with customizable SVG icon and text
 * with various styling options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SvgIconButtonBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/svg-icon-button', [
            'title' => __('SVG Icon Button', 'jankx'),
            'category' => 'jankx-blocks',
            'icon' => 'button',
            'description' => __('Display a button with customizable SVG icon and text', 'jankx'),
            'keywords' => ['button', 'icon', 'svg', 'link', 'action'],
            'supports' => [
                'html' => false,
                'align' => ['left', 'center', 'right'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'buttonText' => [
                    'type' => 'string',
                    'default' => 'Click me'
                ],
                'url' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'opensInNewTab' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'iconName' => [
                    'type' => 'string',
                    'default' => 'arrow-right'
                ],
                'iconPosition' => [
                    'type' => 'string',
                    'default' => 'right'
                ],
                'buttonSize' => [
                    'type' => 'string',
                    'default' => 'medium'
                ],
                'buttonStyle' => [
                    'type' => 'string',
                    'default' => 'filled'
                ],
                'backgroundColor' => [
                    'type' => 'string',
                    'default' => '#007cba'
                ],
                'textColor' => [
                    'type' => 'string',
                    'default' => '#ffffff'
                ],
                'borderColor' => [
                    'type' => 'string',
                    'default' => '#007cba'
                ],
                'borderRadius' => [
                    'type' => 'number',
                    'default' => 4
                ],
                'paddingTop' => [
                    'type' => 'number',
                    'default' => 12
                ],
                'paddingRight' => [
                    'type' => 'number',
                    'default' => 24
                ],
                'paddingBottom' => [
                    'type' => 'number',
                    'default' => 12
                ],
                'paddingLeft' => [
                    'type' => 'number',
                    'default' => 24
                ],
                'marginTop' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'marginRight' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'marginBottom' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'marginLeft' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'className' => [
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
        $blockPath = get_template_directory() . '/resources/blocks/svg-icon-button';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'build/style.css';
        } else {
            // Fallback to source files if build doesn't exist
            $metadata['editorScript'] = 'index.js';
            $metadata['style'] = 'style.css';
        }

        // Add custom CSS for Jankx framework block
        $metadata['style'] = 'jankx-svg-icon-button.css';

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Enqueue custom CSS
        $this->enqueueCustomCSS();
    }

    /**
     * Enqueue custom CSS for the block
     *
     * @return void
     */
    protected function enqueueCustomCSS()
    {
        // Enqueue frontend CSS
        $cssUrl = get_template_directory_uri() . '/resources/blocks/svg-icon-button/jankx-svg-icon-button.css';
        $cssPath = get_template_directory() . '/resources/blocks/svg-icon-button/jankx-svg-icon-button.css';

        if (file_exists($cssPath)) {
            wp_enqueue_style(
                'jankx-svg-icon-button-style',
                $cssUrl,
                [],
                filemtime($cssPath)
            );
        }

        // Note: Editor CSS is handled by block.json editorStyle property
        // WordPress will automatically load it in editor context
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
        $buttonText = $attributes['buttonText'] ?? 'Click me';
        $url = $attributes['url'] ?? '';
        $opensInNewTab = $attributes['opensInNewTab'] ?? false;
        $iconName = $attributes['iconName'] ?? 'arrow-right';
        $iconPosition = $attributes['iconPosition'] ?? 'right';
        $buttonSize = $attributes['buttonSize'] ?? 'medium';
        $buttonStyle = $attributes['buttonStyle'] ?? 'filled';
        $backgroundColor = $attributes['backgroundColor'] ?? '#007cba';
        $textColor = $attributes['textColor'] ?? '#ffffff';
        $borderColor = $attributes['borderColor'] ?? '#007cba';
        $borderRadius = $attributes['borderRadius'] ?? 4;
        $paddingTop = $attributes['paddingTop'] ?? 12;
        $paddingRight = $attributes['paddingRight'] ?? 24;
        $paddingBottom = $attributes['paddingBottom'] ?? 12;
        $paddingLeft = $attributes['paddingLeft'] ?? 24;
        $marginTop = $attributes['marginTop'] ?? 0;
        $marginRight = $attributes['marginRight'] ?? 0;
        $marginBottom = $attributes['marginBottom'] ?? 0;
        $marginLeft = $attributes['marginLeft'] ?? 0;
        $className = $attributes['className'] ?? '';

        // Build wrapper classes
        $wrapperClasses = ['svg-icon-button-block'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build inline styles
        $inlineStyles = $this->buildInlineStyles($attributes);

        // Build button HTML
        $buttonHtml = $this->renderButton($attributes);

        return sprintf(
            '<div class="%s" style="%s">%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($inlineStyles),
            $buttonHtml
        );
    }

    /**
     * Build inline styles from attributes
     *
     * @param array $attributes Block attributes
     * @return string CSS styles
     */
    protected function buildInlineStyles($attributes)
    {
        $styles = [];

        // Margin
        if (isset($attributes['marginTop'])) {
            $styles[] = 'margin-top: ' . intval($attributes['marginTop']) . 'px';
        }
        if (isset($attributes['marginRight'])) {
            $styles[] = 'margin-right: ' . intval($attributes['marginRight']) . 'px';
        }
        if (isset($attributes['marginBottom'])) {
            $styles[] = 'margin-bottom: ' . intval($attributes['marginBottom']) . 'px';
        }
        if (isset($attributes['marginLeft'])) {
            $styles[] = 'margin-left: ' . intval($attributes['marginLeft']) . 'px';
        }

        return implode('; ', $styles);
    }

    /**
     * Render button HTML
     *
     * @param array $attributes Block attributes
     * @return string Button HTML
     */
    protected function renderButton($attributes)
    {
        $buttonText = $attributes['buttonText'] ?? 'Click me';
        $url = $attributes['url'] ?? '';
        $opensInNewTab = $attributes['opensInNewTab'] ?? false;
        $iconName = $attributes['iconName'] ?? 'arrow-right';
        $iconPosition = $attributes['iconPosition'] ?? 'right';
        $buttonSize = $attributes['buttonSize'] ?? 'medium';
        $buttonStyle = $attributes['buttonStyle'] ?? 'filled';
        $backgroundColor = $attributes['backgroundColor'] ?? '#007cba';
        $textColor = $attributes['textColor'] ?? '#ffffff';
        $borderColor = $attributes['borderColor'] ?? '#007cba';
        $borderRadius = $attributes['borderRadius'] ?? 4;
        $paddingTop = $attributes['paddingTop'] ?? 12;
        $paddingRight = $attributes['paddingRight'] ?? 24;
        $paddingBottom = $attributes['paddingBottom'] ?? 12;
        $paddingLeft = $attributes['paddingLeft'] ?? 24;

        // Build button classes
        $buttonClasses = [
            'svg-icon-button',
            'button-size-' . esc_attr($buttonSize),
            'button-style-' . esc_attr($buttonStyle),
            'icon-position-' . esc_attr($iconPosition)
        ];

        // Build button styles
        $buttonStyles = [
            'background-color: ' . esc_attr($backgroundColor),
            'color: ' . esc_attr($textColor),
            'border-color: ' . esc_attr($borderColor),
            'border-radius: ' . intval($borderRadius) . 'px',
            'padding: ' . intval($paddingTop) . 'px ' . intval($paddingRight) . 'px ' . intval($paddingBottom) . 'px ' . intval($paddingLeft) . 'px'
        ];

        // Build target attribute
        $targetAttr = $opensInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

        // Build icon HTML
        $iconHtml = $this->renderIcon($iconName);

        // Build button content
        $buttonContent = '';
        if ($iconPosition === 'left') {
            $buttonContent = $iconHtml . '<span class="button-text">' . esc_html($buttonText) . '</span>';
        } else {
            $buttonContent = '<span class="button-text">' . esc_html($buttonText) . '</span>' . $iconHtml;
        }

        // Return button HTML
        if (!empty($url)) {
            return sprintf(
                '<a href="%s" class="%s" style="%s"%s>%s</a>',
                esc_url($url),
                esc_attr(implode(' ', $buttonClasses)),
                esc_attr(implode('; ', $buttonStyles)),
                $targetAttr,
                $buttonContent
            );
        } else {
            return sprintf(
                '<button type="button" class="%s" style="%s">%s</button>',
                esc_attr(implode(' ', $buttonClasses)),
                esc_attr(implode('; ', $buttonStyles)),
                $buttonContent
            );
        }
    }

    /**
     * Render SVG icon
     *
     * @param string $iconName Icon name
     * @return string Icon HTML
     */
    protected function renderIcon($iconName)
    {
        $iconPath = get_template_directory() . '/resources/blocks/svg-icon/icons/' . $iconName . '.svg';

        if (file_exists($iconPath)) {
            $svgContent = file_get_contents($iconPath);
            return '<span class="button-icon">' . $svgContent . '</span>';
        }

        // Fallback to a simple arrow icon
        return '<span class="button-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1L15 8L8 15M15 8H1"/>
            </svg>
        </span>';
    }
}
