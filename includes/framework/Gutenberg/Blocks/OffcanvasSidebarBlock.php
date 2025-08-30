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
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $sidebarPosition = $attributes['sidebarPosition'] ?? 'left';
        $animationEffect = $attributes['animationEffect'] ?? 'slide-in';
        $sidebarWidth = $attributes['sidebarWidth'] ?? '300px';
        $overlayColor = $attributes['overlayColor'] ?? 'rgba(0,0,0,0.2)';
        $sidebarBackground = $attributes['sidebarBackground'] ?? '#48a770';
        $textColor = $attributes['textColor'] ?? '#f3efe0';
        $triggerText = $attributes['triggerText'] ?? 'Menu';
        $triggerIcon = $attributes['triggerIcon'] ?? 'menu';
        $showOverlay = $attributes['showOverlay'] ?? true;
        $closeOnOverlayClick = $attributes['closeOnOverlayClick'] ?? true;
        $closeOnEscape = $attributes['closeOnEscape'] ?? true;
        $autoClose = $attributes['autoClose'] ?? false;
        $autoCloseDelay = $attributes['autoCloseDelay'] ?? 5000;
        $menuItems = $attributes['menuItems'] ?? [];
        $className = $attributes['className'] ?? '';

        // Generate unique ID for this block instance
        $blockId = 'offcanvas-sidebar-' . uniqid();

        // Build wrapper classes
        $wrapperClasses = ['offcanvas-sidebar-block'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build sidebar classes
        $sidebarClasses = [
            'offcanvas-sidebar-preview',
            'effect-' . $animationEffect,
            'position-' . $sidebarPosition
        ];

        // Build inline styles
        $sidebarStyle = sprintf(
            'width: %s; background-color: %s; color: %s;',
            esc_attr($sidebarWidth),
            esc_attr($sidebarBackground),
            esc_attr($textColor)
        );

        $overlayStyle = sprintf(
            'background-color: %s;',
            esc_attr($overlayColor)
        );

        // Build overlay
        $overlay = $showOverlay ? $this->renderOverlay($overlayStyle, $closeOnOverlayClick, $blockId) : '';

        // Build sidebar content
        $sidebarContent = $this->renderSidebarContent($menuItems, $content, $textColor, $blockId);

        // Build data attributes for JavaScript
        $dataAttributes = $this->buildDataAttributes([
            'showOverlay' => $showOverlay,
            'closeOnEscape' => $closeOnEscape,
            'closeOnOverlayClick' => $closeOnOverlayClick,
            'autoClose' => $autoClose,
            'autoCloseDelay' => $autoCloseDelay
        ]);

        return sprintf(
            '<div class="%s" id="%s" %s>
                <div class="%s" data-effect="%s">
                    %s
                    <div class="offcanvas-sidebar" style="%s">
                        %s
                    </div>
                </div>
            </div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($blockId),
            $dataAttributes,
            esc_attr(implode(' ', $sidebarClasses)),
            esc_attr($animationEffect),
            $overlay,
            $sidebarStyle,
            $sidebarContent
        );
    }

    /**
     * Render trigger button
     *
     * @param string $text Button text
     * @param string $icon Button icon
     * @param string $blockId Block ID
     * @return string HTML
     */
    protected function renderTriggerButton($text, $icon, $blockId)
    {
        $iconHtml = $this->getIconHtml($icon);

        return sprintf(
            '<button class="offcanvas-trigger" data-target="%s" type="button">
                %s
                <span class="trigger-text">%s</span>
            </button>',
            esc_attr($blockId),
            $iconHtml,
            esc_html($text)
        );
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
     * @param array $menuItems Menu items
     * @param string $content Block content
     * @param string $textColor Text color
     * @param string $blockId Block ID
     * @return string HTML
     */
    protected function renderSidebarContent($menuItems, $content, $textColor, $blockId)
    {
        $header = $this->renderSidebarHeader($textColor, $blockId);
        $menu = $this->renderSidebarMenu($menuItems, $textColor);
        $sidebarContent = $this->renderSidebarInnerContent($content);

        return $header . $menu . $sidebarContent;
    }

    /**
     * Render sidebar header
     *
     * @param string $textColor Text color
     * @param string $blockId Block ID
     * @return string HTML
     */
    protected function renderSidebarHeader($textColor, $blockId)
    {
        return sprintf(
            '<div class="sidebar-header">
                <h3>%s</h3>
                <button class="close-button" data-target="%s" type="button" style="color: %s;">×</button>
            </div>',
            esc_html__('Navigation', 'jankx'),
            esc_attr($blockId),
            esc_attr($textColor)
        );
    }

    /**
     * Render sidebar menu
     *
     * @param array $menuItems Menu items
     * @param string $textColor Text color
     * @return string HTML
     */
    protected function renderSidebarMenu($menuItems, $textColor)
    {
        if (empty($menuItems)) {
            return '';
        }

        $menuItemsHtml = '';
        foreach ($menuItems as $item) {
            $iconHtml = $this->getIconHtml($item['icon'] ?? '');
            $menuItemsHtml .= sprintf(
                '<li>
                    <a href="%s" style="color: %s;">
                        %s
                        <span class="menu-text">%s</span>
                    </a>
                </li>',
                esc_url($item['url'] ?? '#'),
                esc_attr($textColor),
                $iconHtml,
                esc_html($item['text'] ?? '')
            );
        }

        return sprintf(
            '<nav class="sidebar-menu">
                <ul>%s</ul>
            </nav>',
            $menuItemsHtml
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
      * @param string $content Raw content
      * @return string Processed content
      */
    protected function processNestedBlocks($content)
    {
        // Handle case where content is an array (block data) instead of string
        if (is_array($content)) {
            // If content is an array, try to extract innerHTML or convert to string
            if (isset($content['innerHTML'])) {
                $content = $content['innerHTML'];
            } elseif (isset($content['innerContent']) && is_array($content['innerContent'])) {
                $content = implode('', array_filter($content['innerContent'], 'is_string'));
            } else {
                // If we can't extract content from array, return default message
                return '<p>' . esc_html__('Add your content here using any available blocks.', 'jankx') . '</p>';
            }
        }

        if (empty($content)) {
            return '<p>' . esc_html__('Add your content here using any available blocks.', 'jankx') . '</p>';
        }

        // Apply WordPress content filters
        $processedContent = apply_filters('the_content', $content);

        // Add custom styling for nested blocks
        $processedContent = $this->addNestedBlocksStyling($processedContent);

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
     * Get icon HTML
     *
     * @param string $iconName Icon name
     * @return string HTML
     */
    protected function getIconHtml($iconName)
    {
        if (empty($iconName)) {
            return '';
        }

        // Map icon names to WordPress dashicons
        $iconMap = [
            'menu' => 'dashicons-menu',
            'home' => 'dashicons-admin-home',
            'info' => 'dashicons-info',
            'cog' => 'dashicons-admin-generic',
            'email' => 'dashicons-email',
            'user' => 'dashicons-admin-users',
            'search' => 'dashicons-search',
            'settings' => 'dashicons-admin-settings',
            'heart' => 'dashicons-heart',
            'star' => 'dashicons-star-filled'
        ];

        $iconClass = $iconMap[$iconName] ?? 'dashicons-menu';

        return sprintf(
            '<span class="menu-icon dashicons %s"></span>',
            esc_attr($iconClass)
        );
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
            $dataAttrs[] = sprintf('data-%s="%s"', esc_attr($key), esc_attr($value ? 'true' : 'false'));
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
