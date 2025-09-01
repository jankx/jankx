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
        $iconBackgroundColorValue = $attributes['iconBackgroundColorValue'] ?? '';
        $iconColorValue = $attributes['iconColorValue'] ?? '';
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
        $className = $attributes['className'] ?? '';

        // Generate unique ID for this block instance
        $blockId = 'svg-icon-' . uniqid();

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

        // Build styles
        $styles = [];
        if ($iconBackgroundColorValue) {
            $styles[] = "background-color: {$iconBackgroundColorValue}";
        }
        if ($iconColorValue) {
            $styles[] = "color: {$iconColorValue}";
        }
        if ($width) {
            $styles[] = "width: {$width}";
        }
        if ($height) {
            $styles[] = "height: {$height}";
        }
        if ($rotate) {
            $styles[] = "transform: rotate({$rotate}deg)";
        }
        if ($flipHorizontal) {
            $styles[] = "transform: scaleX(-1)";
        }
        if ($flipVertical) {
            $styles[] = "transform: scaleY(-1)";
        }

        $styleString = implode('; ', $styles);

        // Build classes
        $classes = ['icon-container'];
        if ($itemsJustification) {
            $classes[] = "justify-{$itemsJustification}";
        }
        if ($className) {
            $classes[] = $className;
        }

        $classString = implode(' ', $classes);
        $classString .= ' ' . $blockId; // Add unique ID as class

        // Add inline CSS for SVG styling
        if ($iconColorValue) {
            $inlineCSS = "
                .{$blockId} svg {
                    fill: {$iconColorValue} !important;
                }
                .{$blockId} svg path {
                    fill: {$iconColorValue} !important;
                }
                .{$blockId} svg rect {
                    fill: {$iconColorValue} !important;
                }
                .{$blockId} svg circle {
                    fill: {$iconColorValue} !important;
                }
                .{$blockId} svg polygon {
                    fill: {$iconColorValue} !important;
                }
                .{$blockId} svg polyline {
                    fill: {$iconColorValue} !important;
                }
            ";
            wp_add_inline_style('jankx-theme-style', $inlineCSS);
        }

        // Build link attributes
        $linkAttrs = '';
        if ($linkUrl) {
            $linkAttrs = "href=\"" . esc_url($linkUrl) . "\"";
            if ($linkRel) {
                $linkAttrs .= " rel=\"" . esc_attr($linkRel) . "\"";
            }
            if ($linkTarget) {
                $linkAttrs .= " target=\"" . esc_attr($linkTarget) . "\"";
            }
        }

        // Build title attribute
        $titleAttr = '';
        if ($title) {
            $titleAttr = "title=\"" . esc_attr($title) . "\"";
        }

        // Build aria-label
        $ariaLabel = '';
        if ($label) {
            $ariaLabel = "aria-label=\"" . esc_attr($label) . "\"";
        }

        ob_start();
        if (!empty($printedIcon)):
        ?>
        <div class="<?php echo esc_attr($classString); ?>" style="<?php echo esc_attr($styleString); ?>">
            <?php if ($linkUrl) : ?>
                <a <?php echo $linkAttrs; ?> <?php echo $titleAttr; ?> <?php echo $ariaLabel; ?>>
                    <?php echo $printedIcon; ?>
                </a>
            <?php else : ?>
                <span <?php echo $titleAttr; ?> <?php echo $ariaLabel; ?>>
                    <?php echo $printedIcon; ?>
                </span>
            <?php endif; ?>
        </div>
        <?php
        else:
            echo $content;
        endif;
        return ob_get_clean();
    }
}
