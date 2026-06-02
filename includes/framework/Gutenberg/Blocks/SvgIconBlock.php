<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Foundation\Application;

/**
 * Icon Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SvgIconBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/svg-icon';



    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $icon = $attributes['icon'] ?? '';
        $iconName = $attributes['iconName'] ?? '';
        $itemsJustification = $attributes['itemsJustification'] ?? '';
        $iconBackgroundColor = $attributes['iconBackgroundColor'] ?? '';
        $iconBackgroundColorValue = $attributes['iconBackgroundColorValue'] ?? '';
        $iconColor = $attributes['iconColor'] ?? '';
        $iconColorValue = $attributes['iconColorValue'] ?? '';
        $gradient = $attributes['gradient'] ?? '';
        $customGradient = $attributes['customGradient'] ?? '';
        $hasNoIconFill = $attributes['hasNoIconFill'] ?? false;
        $label = $attributes['label'] ?? '';
        $title = $attributes['title'] ?? '';
        $linkUrl = $attributes['linkUrl'] ?? '';
        $linkRel = $attributes['linkRel'] ?? '';
        $linkTarget = $attributes['linkTarget'] ?? '';
        $rotate = $attributes['rotate'] ?? 0;
        $flipHorizontal = $attributes['flipHorizontal'] ?? false;
        $flipVertical = $attributes['flipVertical'] ?? false;
        $width = $attributes['width'] ?? '';
        $height = $attributes['height'] ?? '';

        // Decide which icon markup to print on frontend
        $printedIcon = '';
        if (!empty($icon)) {
            $printedIcon = $icon;
        } elseif (!empty($iconName)) {
            try {
                $app = Application::getInstance();
                if ($app && $app->bound('font-icons.svg')) {
                    $provider = $app->make('font-icons.svg');
                    if (method_exists($provider, 'getIconHtml')) {
                        $printedIcon = $provider->getIconHtml($iconName);
                    }
                }
            } catch (\Throwable $e) {
                $printedIcon = '';
            }
        }

        if (empty($printedIcon)) {
            return $content; // Return empty/original content if no icon compiled
        }

        // --- Inner Element Classes (icon-container) ---
        $iconClasses = ['icon-container'];
        if ($iconColorValue) {
            $iconClasses[] = 'has-icon-color';
        }
        if ($hasNoIconFill) {
            $iconClasses[] = 'has-no-icon-fill-color';
        }
        if ($iconBackgroundColorValue || $iconBackgroundColor || $gradient || $customGradient) {
            $iconClasses[] = 'has-icon-background-color';
        }
        if ($iconBackgroundColor) {
            $iconClasses[] = "has-{$iconBackgroundColor}-background-color";
        }
        if ($iconColor) {
            $iconClasses[] = "has-{$iconColor}-color";
        }
        if ($gradient) {
            $iconClasses[] = "has-{$gradient}-gradient-background";
        }

        $iconClassString = implode(' ', $iconClasses);

        // --- Inner Element Styles ---
        $iconStyles = [];
        if (!$gradient && $customGradient) {
            $iconStyles['background'] = $customGradient;
        }
        if ($iconBackgroundColorValue) {
            $iconStyles['background-color'] = $iconBackgroundColorValue;
        }
        if ($iconColorValue) {
            $iconStyles['color'] = $iconColorValue;
        }

        // Calculate explicit width
        $iconWidth = empty($height) ? '48px' : '';
        if (!empty($width)) {
            if (is_numeric($width)) {
                $iconWidth = "{$width}px";
            } elseif (preg_match('/^(\d+(?:\.\d+)?)([a-zA-Z%]*)$/', $width, $matches)) {
                $iconWidth = $matches[2] ? $width : "{$width}px";
            } else {
                $iconWidth = $width;
            }
        }
        if ($iconWidth) {
            $iconStyles['width'] = $iconWidth;
        }
        if (!empty($height)) {
            if (is_numeric($height)) {
                $iconStyles['height'] = "{$height}px";
            } else {
                $iconStyles['height'] = $height;
            }
        }

        // Transforms
        $rotateValue = $rotate ? "{$rotate}deg" : '0deg';
        $scaleXValue = $flipHorizontal ? '-1' : '1';
        $scaleYValue = $flipVertical ? '-1' : '1';
        $iconStyles['transform'] = "rotate({$rotateValue}) scaleX({$scaleXValue}) scaleY({$scaleYValue})";

        $iconStyleString = '';
        foreach ($iconStyles as $key => $val) {
            $iconStyleString .= "{$key}: {$val}; ";
        }

        // Build wrapper element attributes via get_block_wrapper_attributes
        $wrapperClasses = [];
        if ($itemsJustification) {
            $wrapperClasses[] = "items-justified-{$itemsJustification}";
        }
        $wrapperAttrs = get_block_wrapper_attributes(['class' => implode(' ', $wrapperClasses)]);

        // If title is set, we append it to wrapper. Actually save.js sets title to wrapper
        $titleAttr = $title ? ' title="' . esc_attr($title) . '"' : '';

        // Build inner link attributes
        $innerAttrs = '';
        if ($linkUrl) {
            $innerAttrs .= ' href="' . esc_url($linkUrl) . '"';
            if ($linkTarget) {
                $innerAttrs .= ' target="' . esc_attr($linkTarget) . '"';
            }
            if ($linkRel) {
                $innerAttrs .= ' rel="' . esc_attr($linkRel) . '"';
            }
        }
        if ($label) {
            $innerAttrs .= ' aria-label="' . esc_attr($label) . '"';
        }

        ob_start();
        ?>
        <div <?php echo $wrapperAttrs; ?><?php echo $titleAttr; ?>>
            <?php if ($linkUrl) : ?>
                <a class="<?php echo esc_attr($iconClassString); ?>" style="<?php echo esc_attr($iconStyleString); ?>"<?php echo $innerAttrs; ?>>
                    <?php echo $printedIcon; ?>
                </a>
            <?php else : ?>
                <div class="<?php echo esc_attr($iconClassString); ?>" style="<?php echo esc_attr($iconStyleString); ?>"<?php echo $innerAttrs; ?>>
                    <?php echo $printedIcon; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
