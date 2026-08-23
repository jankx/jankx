<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class OffcanvasTriggerBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/offcanvas-trigger';

    /**
     * Register assets for the frontend
     *
     * @return void
     */
    protected function registerFrontendAssets(): void
    {
        // Enqueue the offcanvas sidebar script for the trigger block
        // to ensure it's available even if the sidebar block is not on the page
        add_action('wp_enqueue_scripts', function () {
            $handle = 'jankx-offcanvas-sidebar-frontend';
            $asset_file = dirname($this->blockPath) . '/dist/blocks/offcanvas-sidebar/frontend.asset.php';
            
            if (file_exists($asset_file)) {
                $asset = include $asset_file;
                wp_enqueue_script(
                    $handle,
                    get_template_directory_uri() . '/resources/dist/blocks/offcanvas-sidebar/frontend.js',
                    $asset['dependencies'] ?? [],
                    $asset['version'] ?? false,
                    true
                );
            }
        });
    }

    public function render($attributes, $content = '')
    {
        $targetSidebarId = $attributes['targetSidebarId'] ?? '';
        $animationSkin = $attributes['animationSkin'] ?? 'hamburger-to-x';
        $barColor = $attributes['barColor'] ?? '#333333';
        $barThickness = $attributes['barThickness'] ?? 3;
        $barWidth = $attributes['barWidth'] ?? 30;
        $barSpacing = $attributes['barSpacing'] ?? 5;
        $barLengths = $attributes['barLengths'] ?? 'equal';
        $displayOn = $attributes['displayOn'] ?? 'all';
        $className = $attributes['className'] ?? '';

        // Calculate bar widths based on barLengths setting
        $getBarWidth = function($barType) use ($barWidth, $barLengths) {
            switch ($barLengths) {
                case 'long-short-long':
                    return $barType === 'middle' ? $barWidth * 0.6 : $barWidth;
                case 'progressive':
                    return $barType === 'top' ? $barWidth :
                           ($barType === 'middle' ? $barWidth * 0.8 : $barWidth * 0.6);
                default: // equal
                    return $barWidth;
            }
        };

        $topBarStyle = sprintf(
            'background-color: %s; height: %dpx; width: %dpx;',
            esc_attr($barColor),
            (int)$barThickness,
            (int)$getBarWidth('top')
        );

        $middleBarStyle = sprintf(
            'background-color: %s; height: %dpx; width: %dpx;',
            esc_attr($barColor),
            (int)$barThickness,
            (int)$getBarWidth('middle')
        );

        $bottomBarStyle = sprintf(
            'background-color: %s; height: %dpx; width: %dpx;',
            esc_attr($barColor),
            (int)$barThickness,
            (int)$getBarWidth('bottom')
        );

        // Build container style
        $containerStyle = sprintf(
            '--bar-spacing: %dpx; --bar-thickness: %dpx; --bar-width: %dpx; --bar-color: %s;',
            (int)$barSpacing,
            (int)$barThickness,
            (int)$barWidth,
            esc_attr($barColor)
        );

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => "offcanvas-trigger-block display-{$displayOn} {$className}"
        ]);

        ob_start();
        ?>
        <div <?php echo $wrapper_attributes; ?>>
            <button
                class="offcanvas-trigger hamburger-trigger"
                data-target-sidebar="<?php echo esc_attr($targetSidebarId); ?>"
                aria-label="<?php esc_attr_e('Toggle menu', 'jankx'); ?>"
            >
                <div class="hamburger-container skin-<?php echo esc_attr($animationSkin); ?> lengths-<?php echo esc_attr($barLengths); ?>" style="<?php echo $containerStyle; ?>">
                    <span class="bar bar-top" style="<?php echo $topBarStyle; ?>"></span>
                    <span class="bar bar-middle" style="<?php echo $middleBarStyle; ?>"></span>
                    <span class="bar bar-bottom" style="<?php echo $bottomBarStyle; ?>"></span>
                </div>
            </button>
        </div>
        <?php
        return ob_get_clean();
    }

}
