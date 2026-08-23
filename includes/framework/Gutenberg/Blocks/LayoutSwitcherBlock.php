<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Managers\UrlManager;

/**
 * Layout Switcher Block
 *
 * This block allows users to switch layouts of a Dynamic Data Layout block.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class LayoutSwitcherBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/layout-switcher';

    /**
     * @var BlockTemplateLayoutManager
     */
    protected $layoutManager;

    /**
     * @var UrlManager
     */
    protected $urlManager;

    /**
     * Constructor
     *
     * @param BlockTemplateLayoutManager $layoutManager
     * @param UrlManager $urlManager
     * @param string|null $blockPath
     */
    public function __construct(BlockTemplateLayoutManager $layoutManager, UrlManager $urlManager, $blockPath = null)
    {
        parent::__construct($blockPath);
        $this->layoutManager = $layoutManager;
        $this->urlManager = $urlManager;
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @param \WP_Block|null $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        $this->enqueueFrontendAssets();

        // Get context from parent block
        $queryId = $block->context['queryId'] ?? '';
        $postType = $block->context['postType'] ?? 'post';
        $currentLayout = $block->context['displayLayout'] ?? 'grid';

        if (empty($queryId) && !is_admin()) {
            return '';
        }

        $availableLayouts = $this->layoutManager->getLayoutsForPostType($postType);

        if (empty($availableLayouts)) {
            if (is_admin()) {
                return '<div class="jankx-layout-switcher-placeholder">No layouts available for this post type.</div>';
            }
            return '';
        }

        $supportedLayoutNames = $attributes['supportedLayouts'] ?? [];
        if (empty($supportedLayoutNames)) {
            $supportedLayoutNames = array_keys($availableLayouts);
        }
        
        // Filter layouts
        $layoutsToShow = array_intersect_key($availableLayouts, array_flip($supportedLayoutNames));

        if (empty($layoutsToShow)) {
            return '';
        }

        $displayType = $attributes['displayType'] ?? 'icons'; // icons, labels, both
        $alignment = $attributes['alignment'] ?? 'left';

        ob_start();
        ?>
        <div class="jankx-layout-switcher layout-switcher--align-<?php echo esc_attr($alignment); ?> layout-switcher--type-<?php echo esc_attr($displayType); ?>" 
             data-target-query-id="<?php echo esc_attr($queryId); ?>">
            <ul class="layout-options">
                <?php foreach ($layoutsToShow as $name => $info): ?>
                    <?php 
                        $layoutInstance = $this->layoutManager->createLayout($name);
                        $icon = $layoutInstance->getIcon();
                        $title = $layoutInstance->getTitle();
                        $activeClass = ($currentLayout === $name) ? 'is-active' : '';
                    ?>
                    <li class="layout-option <?php echo esc_attr($activeClass); ?>" data-layout="<?php echo esc_attr($name); ?>">
                        <button type="button" aria-pressed="<?php echo ($currentLayout === $name) ? 'true' : 'false'; ?>">
                            <?php if ($displayType !== 'labels'): ?>
                                <span class="layout-icon">
                                    <?php if (strpos($icon, 'dashicons-') === 0): ?>
                                        <span class="dashicons <?php echo esc_attr($icon); ?>"></span>
                                    <?php else: ?>
                                        <?php echo $icon; // SVG/HTML ?>
                                    <?php endif; ?>
                                </span>
                            <?php endif; ?>
                            
                            <?php if ($displayType !== 'icons'): ?>
                                <span class="layout-label"><?php echo esc_html($title); ?></span>
                            <?php endif; ?>
                            
                            <span class="screen-reader-text"><?php echo esc_html($title); ?></span>
                        </button>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets()
    {
        if (is_admin()) {
            return;
        }

        $handle = 'jankx-layout-switcher-view';
        $script_url = $this->urlManager->blockAsset('dist/blocks/layout-switcher/view.js');
        $asset_file = dirname($this->blockPath) . '/dist/blocks/layout-switcher/view.asset.php';
        
        $dependencies = ['jquery'];
        $version = '1.0.0';

        if (file_exists(dirname($this->blockPath) . '/dist/blocks/layout-switcher/view.js')) {
            if (file_exists($asset_file)) {
                $asset = require $asset_file;
                $dependencies = $asset['dependencies'] ?? $dependencies;
                $version = $asset['version'] ?? $version;
            }

            wp_enqueue_script(
                $handle,
                $script_url,
                $dependencies,
                $version,
                true
            );

            wp_localize_script($handle, 'jankxLayoutSwitcher', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx_load_more')
            ]);
        }
    }
}
