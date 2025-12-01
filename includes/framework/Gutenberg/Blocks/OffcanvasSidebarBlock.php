<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Offcanvas Sidebar Block
 *
 * This block displays an animated offcanvas sidebar with multiple transition effects
 * inspired by SidebarTransitions. Supports 14 different animation effects.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class OffcanvasSidebarBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/offcanvas-sidebar';





    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (InnerBlocks rendered HTML)
     * @param WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        try {
            $sidebarPosition = $attributes['sidebarPosition'] ?? 'left';
            $animationEffect = $attributes['animationEffect'] ?? 'slide-in';
            $sidebarWidth = $attributes['sidebarWidth'] ?? '300px';
            $overlayColor = $attributes['overlayColor'] ?? 'rgba(0,0,0,0.2)';
            $showOverlay = $attributes['showOverlay'] ?? true;
            $closeOnOverlayClick = $attributes['closeOnOverlayClick'] ?? true;
            $closeOnEscape = $attributes['closeOnEscape'] ?? true;
            $autoClose = $attributes['autoClose'] ?? false;
            $autoCloseDelay = $attributes['autoCloseDelay'] ?? 5000;
            $showCloseButton = $attributes['showCloseButton'] ?? true;
            $closeButtonPosition = $attributes['closeButtonPosition'] ?? 'top-right';
            $closeButtonSize = $attributes['closeButtonSize'] ?? 'medium';
            $closeButtonStyle = $attributes['closeButtonStyle'] ?? 'circle';
            $closeButtonColor = $attributes['closeButtonColor'] ?? 'inherit';
            $className = $attributes['className'] ?? '';

            // Generate unique ID for this block instance
            $blockId = 'offcanvas-sidebar-' . uniqid();

            // Build wrapper classes
            $wrapperClasses = ['offcanvas-sidebar-block'];
            if (!empty($className)) {
                $wrapperClasses[] = $className;
            }

            // Get wrapper attributes including classes and styles from block supports (spacing, etc.)
            // This includes margin and padding from block supports
            $wrapper_attributes = get_block_wrapper_attributes([
                'class' => implode(' ', $wrapperClasses),
                'id' => $blockId
            ]);

            // Extract background color from wrapper attributes if exists
            $backgroundColor = $attributes['backgroundColor'] ?? '';
            $textColor = $attributes['textColor'] ?? '';
            $gradient = $attributes['gradient'] ?? '';

            // Get style from block supports (background, color, etc.)
            $style = $attributes['style'] ?? [];

            // Render InnerBlocks content manually if block instance is available
            // This ensures dynamic blocks like core/search are rendered properly
            if ($block && !empty($block->inner_blocks)) {
                $content = '';
                foreach ($block->inner_blocks as $inner_block) {
                    $content .= $inner_block->render();
                }
            }

        // Build container classes (no color classes here)
        $containerClasses = [
            'offcanvas-sidebar-container',
            'effect-' . $animationEffect,
            'position-' . $sidebarPosition
        ];

            // Build sidebar classes with color classes
            $sidebarClasses = ['offcanvas-sidebar'];

            // Add preset color classes from WordPress palette
            if (!empty($backgroundColor)) {
                $sidebarClasses[] = 'has-' . $backgroundColor . '-background-color';
                $sidebarClasses[] = 'has-background';
            }
            if (!empty($textColor)) {
                $sidebarClasses[] = 'has-' . $textColor . '-color';
                $sidebarClasses[] = 'has-text-color';
            }
            if (!empty($gradient)) {
                $sidebarClasses[] = 'has-' . $gradient . '-gradient-background';
                $sidebarClasses[] = 'has-background';
            }

            // Build inline styles from block supports
            $sidebarStyle = sprintf(
                'width: %s;',
                esc_attr($sidebarWidth)
            );

            // Custom color styles (when user picks custom color not from palette)
            if (isset($style['color']['background'])) {
                $sidebarStyle .= sprintf(' background-color: %s;', esc_attr($style['color']['background']));
            }
            if (isset($style['color']['gradient'])) {
                $sidebarStyle .= sprintf(' background: %s;', esc_attr($style['color']['gradient']));
            }
            if (isset($style['color']['text'])) {
                $sidebarStyle .= sprintf(' color: %s;', esc_attr($style['color']['text']));
            }

            // Background image support
            if (isset($style['background']['backgroundImage'])) {
                $backgroundImage = $style['background']['backgroundImage'];
                
                // Handle different structures: object or string
                if (is_array($backgroundImage)) {
                    // URL can be in 'url' key or 'source' key
                    $imageUrl = $backgroundImage['url'] ?? $backgroundImage['source'] ?? '';
                    if ($imageUrl) {
                        $sidebarStyle .= sprintf(' background-image: url(%s);', esc_url($imageUrl));
                    }
                    
                    // Background size can be in the image object or at style.background level
                    if (isset($backgroundImage['backgroundSize'])) {
                        $sidebarStyle .= sprintf(' background-size: %s;', esc_attr($backgroundImage['backgroundSize']));
                    }
                    if (isset($backgroundImage['backgroundPosition'])) {
                        $sidebarStyle .= sprintf(' background-position: %s;', esc_attr($backgroundImage['backgroundPosition']));
                    }
                    if (isset($backgroundImage['backgroundRepeat'])) {
                        $sidebarStyle .= sprintf(' background-repeat: %s;', esc_attr($backgroundImage['backgroundRepeat']));
                    }
                } elseif (is_string($backgroundImage)) {
                    // Direct URL string
                    $sidebarStyle .= sprintf(' background-image: url(%s);', esc_url($backgroundImage));
                }
            }
            
            // Background size can also be at style.background level
            if (isset($style['background']['backgroundSize']) && !isset($style['background']['backgroundImage']['backgroundSize'])) {
                $sidebarStyle .= sprintf(' background-size: %s;', esc_attr($style['background']['backgroundSize']));
            }

            $overlayStyle = sprintf(
                'background-color: %s;',
                esc_attr($overlayColor)
            );

            // Build overlay
            $overlay = $showOverlay ? $this->renderOverlay($overlayStyle, $closeOnOverlayClick, $blockId) : '';

            // Build sidebar content with InnerBlocks (no menu items)
            $textColor = $style['color']['text'] ?? '#f3efe0'; // Fallback for close button
            $sidebarContent = $this->renderSidebarContent($content, $textColor, $blockId, [
                'showCloseButton' => $showCloseButton,
                'closeButtonPosition' => $closeButtonPosition,
                'closeButtonSize' => $closeButtonSize,
                'closeButtonStyle' => $closeButtonStyle,
                'closeButtonColor' => $closeButtonColor
            ]);

            // Build data attributes for JavaScript
            $dataAttributes = $this->buildDataAttributes([
                'showOverlay' => $showOverlay,
                'closeOnOverlayClick' => $closeOnOverlayClick,
                'closeOnEscape' => $closeOnEscape,
                'autoClose' => $autoClose,
                'autoCloseDelay' => $autoCloseDelay
            ]);

            return sprintf(
                '<div %s %s>
                    <div class="%s" data-effect="%s">
                        %s
                        <div class="%s" style="%s" role="dialog" aria-modal="true" aria-label="%s">
                            %s
                        </div>
                    </div>
                </div>',
                $wrapper_attributes,
                $dataAttributes,
                esc_attr(implode(' ', $containerClasses)),
                esc_attr($animationEffect),
                $overlay,
                esc_attr(implode(' ', $sidebarClasses)),
                $sidebarStyle,
                esc_attr__('Sidebar navigation', 'jankx'),
                $sidebarContent
            );
        } catch (\Exception $e) {
            return '<!-- Offcanvas Sidebar Block: Rendering error -->';
        }
    }

    /**
     * Render overlay
     *
     * @param string $style Inline styles
     * @param bool $closeOnClick Close on click
     * @param string $blockId Block ID
     * @return string HTML
     */
    protected function renderOverlay($style, $closeOnClick, $blockId)
    {
        $clickHandler = $closeOnClick ? sprintf('data-target="%s"', esc_attr($blockId)) : '';

        return sprintf(
            '<div class="offcanvas-overlay" style="%s" %s></div>',
            $style,
            $clickHandler
        );
    }

    /**
     * Render sidebar content
     *
     * @param string $content Block content (InnerBlocks)
     * @param string $textColor Text color
     * @param string $blockId Block ID
     * @param array $closeButtonSettings Close button settings
     * @return string HTML
     */
    protected function renderSidebarContent($content, $textColor, $blockId, $closeButtonSettings = [])
    {
        $closeButton = '';
        if ($closeButtonSettings['showCloseButton'] ?? true) {
            $closeButton = $this->renderCloseButton($textColor, $blockId, $closeButtonSettings);
        }
        $sidebarContent = $this->renderSidebarInnerContent($content);

        return $closeButton . $sidebarContent;
    }

    /**
     * Render close button
     *
     * @param string $textColor Text color
     * @param string $blockId Block ID
     * @param array $settings Close button settings
     * @return string HTML
     */
    protected function renderCloseButton($textColor, $blockId, $settings = [])
    {
        $position = $settings['closeButtonPosition'] ?? 'top-right';
        $size = $settings['closeButtonSize'] ?? 'medium';
        $style = $settings['closeButtonStyle'] ?? 'circle';
        $color = $settings['closeButtonColor'] ?? 'inherit';

        $buttonColor = $color === 'inherit' ? $textColor : $color;

        $classes = [
            'close-button',
            'position-' . $position,
            'size-' . $size,
            'style-' . $style
        ];

        return sprintf(
            '<button class="%s" data-target="%s" type="button" style="color: %s;" aria-label="%s">×</button>',
            esc_attr(implode(' ', $classes)),
            esc_attr($blockId),
            esc_attr($buttonColor),
            esc_attr__('Close sidebar', 'jankx')
        );
    }

    /**
      * Render sidebar inner content
      *
      * @param string $content Block content
      * @return string HTML
      */
    protected function renderSidebarInnerContent($content)
    {
        // Process nested blocks content
        $processedContent = $this->processNestedBlocks($content);

        return sprintf(
            '<div class="sidebar-content">
                 %s
             </div>',
            $processedContent
        );
    }

     /**
      * Process nested blocks content
      *
      * @param string $content Raw content (InnerBlocks HTML)
      * @return string Processed content
      */
    protected function processNestedBlocks($content)
    {
        // Content is already rendered HTML from InnerBlocks
        // Just clean whitespace and check if empty
        $content = trim($content);

        if (empty($content)) {
            return '<p class="sidebar-placeholder">' . esc_html__('Add your content here using any available blocks.', 'jankx') . '</p>';
        }

        // Re-render content to ensure dynamic blocks (like core/search) work properly
        // The $content already contains the rendered HTML from WordPress, including dynamic blocks
        // We don't need to parse and re-render, WordPress handles that in the render callback

        // Add wrapper class for better styling
        $processedContent = '<div class="sidebar-inner-content">' . $content . '</div>';

        return $processedContent;
    }

     /**
      * Add custom styling for nested blocks
      *
      * @param string $content Processed content
      * @return string Styled content
      */
    protected function addNestedBlocksStyling($content)
    {
        // Add custom classes for better styling
        $content = str_replace(
            'class="wp-block-',
            'class="wp-block- sidebar-nested-block-',
            $content
        );

        // Add specific styling for different block types
        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-heading[^"]*"[^>]*)>/',
            '<div$1 style="color: inherit; margin-top: 0; margin-bottom: 16px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-paragraph[^"]*"[^>]*)>/',
            '<div$1 style="line-height: 1.6; margin-bottom: 16px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-image[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-gallery[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-quote[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; padding: 16px; border-left: 4px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.05); border-radius: 4px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-buttons[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-separator[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-spacer[^"]*"[^>]*)>/',
            '<div$1 style="margin: 16px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-social-links[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-navigation[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-search[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-latest-posts[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-latest-comments[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-rss[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-audio[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-video[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-file[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-code[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 16px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-html[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-preformatted[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 16px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-pullquote[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; padding: 20px; border-left: 4px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.05); border-radius: 4px;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-table[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-verse[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; font-style: italic; line-height: 1.6;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-media-text[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-columns[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-group[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1);">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-cover[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0; border-radius: 4px; overflow: hidden;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-embed[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        // Jankx blocks styling
        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-jankx-language-switcher[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-jankx-icon-button[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        $content = preg_replace(
            '/<div([^>]*class="[^"]*wp-block-jankx-offcanvas-sidebar[^"]*"[^>]*)>/',
            '<div$1 style="margin: 20px 0;">',
            $content
        );

        return $content;
    }

    /**
     * Build data attributes for JavaScript
     *
     * @param array $attributes Attributes
     * @return string HTML attributes
     */
    protected function buildDataAttributes($attributes)
    {
        $dataAttrs = [];
        foreach ($attributes as $key => $value) {
            // Handle different data types
            if (is_bool($value)) {
                $dataAttrs[] = sprintf('data-%s="%s"', esc_attr($key), esc_attr($value ? 'true' : 'false'));
            } elseif (is_numeric($value)) {
                $dataAttrs[] = sprintf('data-%s="%s"', esc_attr($key), esc_attr($value));
            } else {
                $dataAttrs[] = sprintf('data-%s="%s"', esc_attr($key), esc_attr($value));
            }
        }
        return implode(' ', $dataAttrs);
    }

    /**
     * Register AJAX handlers
     *
     * @return void
     */
    public function registerAjaxHandlers()
    {
        add_action('wp_ajax_offcanvas_sidebar_toggle', [$this, 'handleToggle']);
        add_action('wp_ajax_nopriv_offcanvas_sidebar_toggle', [$this, 'handleToggle']);
    }

    /**
     * Handle AJAX toggle request
     *
     * @return void
     */
    public function handleToggle()
    {
        check_ajax_referer('offcanvas_sidebar_nonce', 'nonce');

        $blockId = sanitize_text_field($_POST['blockId'] ?? '');
        $action = sanitize_text_field($_POST['action'] ?? '');

        if (empty($blockId)) {
            wp_die('Invalid block ID');
        }

        // You can add custom logic here if needed
        wp_send_json_success([
            'blockId' => $blockId,
            'action' => $action,
            'timestamp' => current_time('timestamp')
        ]);
    }
}
