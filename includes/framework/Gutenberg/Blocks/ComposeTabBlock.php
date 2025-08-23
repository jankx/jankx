<?php

namespace Jankx\Gutenberg\Blocks;

/**
 * Jankx Tabs Block
 *
 * This block allows users to create and manage tabs with different actions.
 * It provides a dynamic interface for tab management and content display.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ComposeTabBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/tabs', [
            'title' => __('Jankx Tabs', 'jankx'),
            'category' => 'widgets',
            'icon' => 'admin-tabs',
            'description' => __('Tạo tabs với nhiều loại action: show content, link, hoặc modal dialog', 'jankx'),
            'keywords' => ['tab', 'tabs', 'navigation', 'content', 'modal'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'tabs' => [
                    'type' => 'array',
                    'default' => [
                        [
                            'id' => 'tab-1',
                            'title' => 'Tab 1',
                            'icon' => 'admin-generic',
                            'action' => 'content',
                            'content' => 'Nội dung tab 1',
                            'link' => '',
                            'modalTitle' => '',
                            'modalContent' => ''
                        ]
                    ]
                ],
                'activeTab' => [
                    'type' => 'string',
                    'default' => 'tab-1'
                ],
                'tabStyle' => [
                    'type' => 'string',
                    'default' => 'horizontal'
                ],
                'tabPosition' => [
                    'type' => 'string',
                    'default' => 'top'
                ],
                'showIcons' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'tabWidth' => [
                    'type' => 'string',
                    'default' => 'auto'
                ],
                'animation' => [
                    'type' => 'string',
                    'default' => 'fade'
                ],
                'className' => [
                    'type' => 'string'
                ]
            ]
        ]);

        // Block will be registered by GutenbergServiceProvider
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
            $metadata['editorStyle'] = 'build/index.css.css';
            $metadata['style'] = 'style.css';
        }

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendScripts']);
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
        $tabs = $attributes['tabs'] ?? [];
        $activeTab = $attributes['activeTab'] ?? '';
        $tabStyle = $attributes['tabStyle'] ?? 'horizontal';
        $tabPosition = $attributes['tabPosition'] ?? 'top';
        $showIcons = $attributes['showIcons'] ?? true;
        $tabWidth = $attributes['tabWidth'] ?? 'auto';
        $animation = $attributes['animation'] ?? 'fade';
        $className = $attributes['className'] ?? '';

        if (empty($tabs)) {
            return $this->renderPlaceholder();
        }

        // Tìm active tab index
        $activeIndex = 0;
        foreach ($tabs as $index => $tab) {
            if ($tab['id'] === $activeTab) {
                $activeIndex = $index;
                break;
            }
        }

        // Tạo unique ID cho block
        $blockId = 'jankx-tab-' . uniqid();

        // CSS classes
        $navClasses = [
            'jankx-tab-nav',
            "jankx-tab-{$tabStyle}",
            "jankx-tab-{$tabPosition}"
        ];

        $contentClasses = [
            'jankx-tab-content',
            "jankx-tab-{$animation}"
        ];

        $blockClasses = [
            'jankx-tab-block',
            $className
        ];

        // Inline CSS cho tab width
        $tabWidthStyle = '';
        if ($tabWidth === 'equal') {
            $tabWidthStyle = 'style="width: ' . (100 / count($tabs)) . '%"';
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $blockClasses)); ?>" id="<?php echo esc_attr($blockId); ?>">
            <!-- Tab Navigation -->
            <div class="<?php echo esc_attr(implode(' ', $navClasses)); ?>">
                <?php foreach ($tabs as $index => $tab) : ?>
                    <button
                        class="jankx-tab-button <?php echo $index === $activeIndex ? 'active' : ''; ?>"
                        data-tab="<?php echo esc_attr($tab['id']); ?>"
                        data-index="<?php echo esc_attr($index); ?>"
                        <?php echo $tabWidthStyle; ?>
                        onclick="jankxSwitchTab('<?php echo esc_js($blockId); ?>', <?php echo esc_js($index); ?>)"
                    >
                        <?php if ($showIcons && !empty($tab['icon'])) : ?>
                            <span class="dashicons dashicons-<?php echo esc_attr($tab['icon']); ?>"></span>
                        <?php endif; ?>
                        <span class="tab-title"><?php echo esc_html($tab['title']); ?></span>
                    </button>
                <?php endforeach; ?>
            </div>

            <!-- Tab Content -->
            <div class="<?php echo esc_attr(implode(' ', $contentClasses)); ?>">
                <?php foreach ($tabs as $index => $tab) : ?>
                    <div
                        class="jankx-tab-panel <?php echo $index === $activeIndex ? 'active' : ''; ?>"
                        data-tab="<?php echo esc_attr($tab['id']); ?>"
                        data-index="<?php echo esc_attr($index); ?>"
                        style="display: <?php echo $index === $activeIndex ? 'block' : 'none'; ?>;"
                    >
                        <?php if ($tab['action'] === 'content') : ?>
                            <div class="jankx-tab-text-content">
                                <?php echo wp_kses_post($tab['content']); ?>
                            </div>
                        <?php elseif ($tab['action'] === 'link' && !empty($tab['link'])) : ?>
                            <div class="jankx-tab-link-content">
                                <p><?php _e('Tab này sẽ link đến:', 'jankx'); ?></p>
                                <a href="<?php echo esc_url($tab['link']); ?>" target="_blank" rel="noopener noreferrer" class="tab-link-button">
                                    <?php echo esc_html($tab['link']); ?>
                                </a>
                            </div>
                        <?php elseif ($tab['action'] === 'modal') : ?>
                            <div class="jankx-tab-modal-content">
                                <p><?php _e('Tab này sẽ mở modal với:', 'jankx'); ?></p>
                                <?php if (!empty($tab['modalTitle'])) : ?>
                                    <strong><?php echo esc_html($tab['modalTitle']); ?></strong>
                                <?php endif; ?>
                                <?php if (!empty($tab['modalContent'])) : ?>
                                    <div class="modal-preview">
                                        <?php echo wp_kses_post($tab['modalContent']); ?>
                                    </div>
                                <?php endif; ?>
                                <button
                                    class="open-modal-btn"
                                    onclick="jankxOpenModal('<?php echo esc_js($tab['modalTitle']); ?>', '<?php echo esc_js(wp_kses_post($tab['modalContent'])); ?>')"
                                >
                                    <?php _e('Mở Modal', 'jankx'); ?>
                                </button>
                            </div>
                        <?php else : ?>
                            <div class="jankx-tab-empty">
                                <p><?php _e('Không có nội dung cho tab này.', 'jankx'); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Modal Dialog -->
        <div id="jankx-modal-overlay" class="jankx-modal-overlay" style="display: none;">
            <div class="jankx-modal">
                <div class="jankx-modal-header">
                    <h3 id="jankx-modal-title"></h3>
                    <button class="jankx-modal-close" onclick="jankxCloseModal()">&times;</button>
                </div>
                <div class="jankx-modal-body" id="jankx-modal-body"></div>
            </div>
        </div>
        <?php

        return ob_get_clean();
    }

    /**
     * Render placeholder
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="jankx-tab-placeholder"><p>' .
               __('Chưa có tabs nào. Hãy thêm tab từ cài đặt block.', 'jankx') .
               '</p></div>';
    }

    /**
     * Enqueue frontend scripts
     *
     * @return void
     */
    public function enqueueFrontendScripts()
    {
        wp_enqueue_script(
            'jankx-jankx-tab',
            get_template_directory_uri() . '/resources/blocks/tabs/frontend.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_localize_script('jankx-jankx-tab', 'jankxComposeTab', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_compose_tab_nonce')
        ]);
    }
}
