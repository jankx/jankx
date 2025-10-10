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



    public function render($attributes, $content = '')
    {
        $targetSidebarId = $attributes['targetSidebarId'] ?? '';
        $animationSkin = $attributes['animationSkin'] ?? 'hamburger-to-x';
        $barColor = $attributes['barColor'] ?? '#333333';
        $barThickness = $attributes['barThickness'] ?? 3;
        $barWidth = $attributes['barWidth'] ?? 30;
        $barSpacing = $attributes['barSpacing'] ?? 5;
        $displayOn = $attributes['displayOn'] ?? 'all';
        $className = $attributes['className'] ?? '';

        // Build inline styles for bars
        $barStyle = sprintf(
            'background-color: %s; height: %dpx; width: %dpx;',
            esc_attr($barColor),
            (int)$barThickness,
            (int)$barWidth
        );

        // Build CSS custom properties
        $containerStyle = sprintf(
            '--bar-spacing: %dpx; --bar-thickness: %dpx; --bar-width: %dpx; --bar-color: %s;',
            (int)$barSpacing,
            (int)$barThickness,
            (int)$barWidth,
            esc_attr($barColor)
        );

        ob_start();
        ?>
        <div class="offcanvas-trigger-block display-<?php echo esc_attr($displayOn); ?> <?php echo esc_attr($className); ?>">
            <button
                class="offcanvas-trigger hamburger-trigger"
                data-target-sidebar="<?php echo esc_attr($targetSidebarId); ?>"
                aria-label="<?php esc_attr_e('Toggle menu', 'jankx'); ?>"
            >
                <div class="hamburger-container skin-<?php echo esc_attr($animationSkin); ?>" style="<?php echo $containerStyle; ?>">
                    <span class="bar bar-top" style="<?php echo $barStyle; ?>"></span>
                    <span class="bar bar-middle" style="<?php echo $barStyle; ?>"></span>
                    <span class="bar bar-bottom" style="<?php echo $barStyle; ?>"></span>
                </div>
            </button>
        </div>
        <?php
        return ob_get_clean();
    }

}
