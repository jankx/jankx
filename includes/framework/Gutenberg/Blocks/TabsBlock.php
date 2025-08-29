<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Tabs Block
 *
 * This block displays content in tabs style with customizable options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TabsBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/tabs', [
            'title' => __('Tabs Block', 'jankx'),
            'category' => 'jankx-blocks',
            'icon' => 'list-view',
            'description' => __('Display content in tabs style', 'jankx'),
            'keywords' => ['tabs', 'tab', 'content', 'navigation'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'anchor' => true,
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'uniqueId' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'tabLayout' => [
                    'type' => 'string',
                    'default' => 'horizontal'
                ],
                'labelsPosition' => [
                    'type' => 'string',
                    'default' => 'top'
                ],
                'showSeparator' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'separatorStyle' => [
                    'type' => 'string',
                    'default' => 'solid'
                ],
                'separatorColor' => [
                    'type' => 'string',
                    'default' => '#E1E1E1'
                ],
                'separatorHeight' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'addLabelsSeparator' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'labelsSeparatorStyle' => [
                    'type' => 'string',
                    'default' => 'solid'
                ],
                'labelsSeparatorColor' => [
                    'type' => 'string',
                    'default' => '#E1E1E1'
                ],
                'labelsSeparatorWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'useCustomColors' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'activeTabColor' => [
                    'type' => 'string',
                    'default' => '#44677A'
                ],
                'activeTabBg' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'makeActiveTabSeparateLess' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'anchorId' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'customClass' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'containerBorderStyle' => [
                    'type' => 'string',
                    'default' => 'solid'
                ],
                'enableContainerLinkedBorder' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'containerLinkedBorderWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerTopBorderWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerRightBorderWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerBottomBorderWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerLeftBorderWidth' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerBorderColor' => [
                    'type' => 'string',
                    'default' => '#E1E1E1'
                ],
                'enableContainerLinkedBorderRadius' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'containerLinkedBorderRadius' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerTopBorderRadius' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerRightBorderRadius' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerBottomBorderRadius' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerLeftBorderRadius' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'containerDeskTopMargin' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'containerDeskBottomMargin' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'zIndex' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'labelsBg' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'labelsColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'enableLinkedDeskPadding' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'labelsLinkedDeskPadding' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'labelsDeskPaddingTop' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'labelsDeskPaddingRight' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'labelsDeskPaddingBottom' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'labelsDeskPaddingLeft' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'tabsContentBg' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'tabsContentColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'enableLinkedContentDeskPadding' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'tabsContentLinkedDeskPadding' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'tabsContentDeskPaddingTop' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'tabsContentDeskPaddingRight' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'tabsContentDeskPaddingBottom' => [
                    'type' => 'number',
                    'default' => 10
                ],
                'tabsContentDeskPaddingLeft' => [
                    'type' => 'number',
                    'default' => 10
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
        $blockPath = get_template_directory() . '/resources/blocks/tabs';
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
        $metadata['style'] = 'jankx-tabs.css';

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Register tab child block
        register_block_type('jankx/tab', [
            'title' => __('Tab', 'jankx'),
            'description' => __('Acts as child block for Tabs', 'jankx'),
            'supports' => [
                'html' => false,
                'customClassName' => false,
                'anchor' => false,
            ],
            'icon' => [
                'foreground' => '#38687c',
                'src' => 'minus',
            ],
            'parent' => ['jankx/tabs'],
            'category' => 'jankx-blocks',
            'keywords' => [
                __('tab', 'jankx'),
                __('tabs', 'jankx'),
            ],
            'attributes' => [
                'tabLabel' => [
                    'type' => 'string',
                    'default' => '',
                ],
                'blockIndex' => [
                    'type' => 'number',
                    'default' => 0,
                ],
            ],
            'render_callback' => [$this, 'renderTab'],
        ]);

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
        $cssUrl = get_template_directory_uri() . '/resources/blocks/tabs/jankx-tabs.css';
        $cssPath = get_template_directory() . '/resources/blocks/tabs/jankx-tabs.css';

        if (file_exists($cssPath)) {
            wp_enqueue_style(
                'jankx-tabs-style',
                $cssUrl,
                [],
                filemtime($cssPath)
            );
        }

        // Enqueue frontend JavaScript
        $jsUrl = get_template_directory_uri() . '/resources/blocks/tabs/frontend.js';
        $jsPath = get_template_directory() . '/resources/blocks/tabs/frontend.js';

        if (file_exists($jsPath)) {
            wp_enqueue_script(
                'jankx-tabs-frontend',
                $jsUrl,
                ['jquery'],
                filemtime($jsPath),
                true
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
        $unique_id = $attributes['uniqueId'] ?? 'tabs-' . uniqid();
        $tab_layout = $attributes['tabLayout'] ?? 'horizontal';
        $labels_position = $attributes['labelsPosition'] ?? 'top';
        $show_separator = $attributes['showSeparator'] ?? true;
        $separator_style = $attributes['separatorStyle'] ?? 'solid';
        $separator_color = $attributes['separatorColor'] ?? '#E1E1E1';
        $separator_height = $attributes['separatorHeight'] ?? 1;
        $add_labels_separator = $attributes['addLabelsSeparator'] ?? true;
        $labels_separator_style = $attributes['labelsSeparatorStyle'] ?? 'solid';
        $labels_separator_color = $attributes['labelsSeparatorColor'] ?? '#E1E1E1';
        $labels_separator_width = $attributes['labelsSeparatorWidth'] ?? 1;
        $use_custom_colors = $attributes['useCustomColors'] ?? true;
        $active_tab_color = $attributes['activeTabColor'] ?? '#44677A';
        $active_tab_bg = $attributes['activeTabBg'] ?? '';
        $make_active_tab_separate_less = $attributes['makeActiveTabSeparateLess'] ?? true;
        $anchor_id = $attributes['anchorId'] ?? '';
        $custom_class = $attributes['customClass'] ?? '';

        // Build container styles
        $container_styles = $this->buildContainerStyles($attributes);
        $labels_styles = $this->buildLabelsStyles($attributes);
        $content_styles = $this->buildContentStyles($attributes);

        // Build CSS custom properties
        $css_vars = [
            '--jankx-tabs-layout' => $tab_layout,
            '--jankx-tabs-labels-position' => $labels_position,
            '--jankx-tabs-separator-style' => $show_separator ? $separator_style : 'none',
            '--jankx-tabs-separator-color' => $separator_color,
            '--jankx-tabs-separator-height' => $separator_height . 'px',
            '--jankx-tabs-labels-separator-style' => $add_labels_separator ? $labels_separator_style : 'none',
            '--jankx-tabs-labels-separator-color' => $labels_separator_color,
            '--jankx-tabs-labels-separator-width' => $labels_separator_width . 'px',
            '--jankx-tabs-active-color' => $use_custom_colors ? $active_tab_color : '',
            '--jankx-tabs-active-bg' => $use_custom_colors ? $active_tab_bg : '',
            '--jankx-tabs-active-separate-less' => $make_active_tab_separate_less ? '1' : '0',
        ];

        $css_vars_string = '';
        foreach ($css_vars as $var => $value) {
            if (!empty($value)) {
                $css_vars_string .= "$var: $value; ";
            }
        }

        $block_id = $anchor_id ?: $unique_id;
        $block_classes = ['jankx-tabs-block'];
        if (!empty($custom_class)) {
            $block_classes[] = $custom_class;
        }

        ob_start();
        ?>
        <div
            id="<?php echo esc_attr($block_id); ?>"
            class="<?php echo esc_attr(implode(' ', $block_classes)); ?>"
            style="<?php echo esc_attr($container_styles . ' ' . $css_vars_string); ?>"
        >
            <div class="jankx-tabs-container layout-<?php echo esc_attr($tab_layout); ?> position-<?php echo esc_attr($labels_position); ?>">
                <!-- Tab Labels -->
                <div class="jankx-tabs-labels" style="<?php echo esc_attr($labels_styles); ?>">
                    <!-- Tab labels will be generated by frontend JavaScript -->
                </div>

                <!-- Separator -->
                <?php if ($show_separator) : ?>
                    <div
                        class="jankx-tabs-separator"
                        style="border-top: <?php echo esc_attr($separator_height); ?>px <?php echo esc_attr($separator_style); ?> <?php echo esc_attr($separator_color); ?>;"
                    ></div>
                <?php endif; ?>

                <!-- Tab Content -->
                <div class="jankx-tabs-content" style="<?php echo esc_attr($content_styles); ?>">
                    <?php echo $content; ?>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render tab child block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function renderTab($attributes, $content = '')
    {
        $tab_label = $attributes['tabLabel'] ?? '';

        ob_start();
        ?>
        <div
            class="jankx-tab-panel"
            role="tabpanel"
            tabindex="0"
            aria-labelledby="<?php echo esc_attr($tab_label); ?>"
            data-tab-label="<?php echo esc_attr($tab_label); ?>"
        >
            <?php echo $content; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Build container styles
     *
     * @param array $attributes Block attributes
     * @return string CSS styles
     */
    protected function buildContainerStyles($attributes)
    {
        $styles = [];

        // Border styles
        $border_style = $attributes['containerBorderStyle'] ?? 'solid';
        if ($border_style !== 'none') {
            $styles[] = "border-style: $border_style;";

            $enable_linked_border = $attributes['enableContainerLinkedBorder'] ?? true;
            if ($enable_linked_border) {
                $border_width = $attributes['containerLinkedBorderWidth'] ?? '1';
                $styles[] = "border-width: {$border_width}px;";
            } else {
                $top_width = $attributes['containerTopBorderWidth'] ?? '1';
                $right_width = $attributes['containerRightBorderWidth'] ?? '1';
                $bottom_width = $attributes['containerBottomBorderWidth'] ?? '1';
                $left_width = $attributes['containerLeftBorderWidth'] ?? '1';
                $styles[] = "border-width: {$top_width}px {$right_width}px {$bottom_width}px {$left_width}px;";
            }

            $border_color = $attributes['containerBorderColor'] ?? '#E1E1E1';
            $styles[] = "border-color: $border_color;";
        }

        // Border radius
        $enable_linked_radius = $attributes['enableContainerLinkedBorderRadius'] ?? true;
        if ($enable_linked_radius) {
            $radius = $attributes['containerLinkedBorderRadius'] ?? '1';
            $styles[] = "border-radius: {$radius}px;";
        } else {
            $top_radius = $attributes['containerTopBorderRadius'] ?? '1';
            $right_radius = $attributes['containerRightBorderRadius'] ?? '1';
            $bottom_radius = $attributes['containerBottomBorderRadius'] ?? '1';
            $left_radius = $attributes['containerLeftBorderRadius'] ?? '1';
            $styles[] = "border-radius: {$top_radius}px {$right_radius}px {$bottom_radius}px {$left_radius}px;";
        }

        // Margins
        $top_margin = $attributes['containerDeskTopMargin'] ?? '';
        $bottom_margin = $attributes['containerDeskBottomMargin'] ?? '';
        if ($top_margin) {
            $styles[] = "margin-top: $top_margin;";
        }
        if ($bottom_margin) {
            $styles[] = "margin-bottom: $bottom_margin;";
        }

        // Z-index
        $z_index = $attributes['zIndex'] ?? '';
        if ($z_index) {
            $styles[] = "z-index: $z_index;";
        }

        return implode(' ', $styles);
    }

    /**
     * Build labels styles
     *
     * @param array $attributes Block attributes
     * @return string CSS styles
     */
    protected function buildLabelsStyles($attributes)
    {
        $styles = [];

        // Background and color
        $labels_bg = $attributes['labelsBg'] ?? '';
        $labels_color = $attributes['labelsColor'] ?? '';
        if ($labels_bg) {
            $styles[] = "background-color: $labels_bg;";
        }
        if ($labels_color) {
            $styles[] = "color: $labels_color;";
        }

        // Padding
        $enable_linked_padding = $attributes['enableLinkedDeskPadding'] ?? true;
        if ($enable_linked_padding) {
            $padding = $attributes['labelsLinkedDeskPadding'] ?? '10';
            $styles[] = "padding: {$padding}px;";
        } else {
            $top_padding = $attributes['labelsDeskPaddingTop'] ?? '10';
            $right_padding = $attributes['labelsDeskPaddingRight'] ?? '10';
            $bottom_padding = $attributes['labelsDeskPaddingBottom'] ?? '10';
            $left_padding = $attributes['labelsDeskPaddingLeft'] ?? '10';
            $styles[] = "padding: {$top_padding}px {$right_padding}px {$bottom_padding}px {$left_padding}px;";
        }

        return implode(' ', $styles);
    }

    /**
     * Build content styles
     *
     * @param array $attributes Block attributes
     * @return string CSS styles
     */
    protected function buildContentStyles($attributes)
    {
        $styles = [];

        // Background and color
        $content_bg = $attributes['tabsContentBg'] ?? '';
        $content_color = $attributes['tabsContentColor'] ?? '';
        if ($content_bg) {
            $styles[] = "background-color: $content_bg;";
        }
        if ($content_color) {
            $styles[] = "color: $content_color;";
        }

        // Padding
        $enable_linked_padding = $attributes['enableLinkedContentDeskPadding'] ?? true;
        if ($enable_linked_padding) {
            $padding = $attributes['tabsContentLinkedDeskPadding'] ?? '10';
            $styles[] = "padding: {$padding}px;";
        } else {
            $top_padding = $attributes['tabsContentDeskPaddingTop'] ?? '10';
            $right_padding = $attributes['tabsContentDeskPaddingRight'] ?? '10';
            $bottom_padding = $attributes['tabsContentDeskPaddingBottom'] ?? '10';
            $left_padding = $attributes['tabsContentDeskPaddingLeft'] ?? '10';
            $styles[] = "padding: {$top_padding}px {$right_padding}px {$bottom_padding}px {$left_padding}px;";
        }

        return implode(' ', $styles);
    }
}
