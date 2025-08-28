<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Icon Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SvgIconBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/svg-icon', [
            'title' => __('SVG Icon', 'jankx'),
            'category' => 'media',
            'icon' => 'star-filled',
            'description' => __('Insert an SVG icon or graphic.', 'jankx'),
            'keywords' => ['icon', 'svg'],
            'supports' => [
                'anchor' => true,
                'align' => true,
                'html' => false,
                'interactivity' => [
                    'clientNavigation' => true
                ],
                '__experimentalBorder' => [
                    'color' => true,
                    'radius' => true,
                    'style' => true,
                    'width' => true,
                    '__experimentalSelector' => '.icon-container',
                    '__experimentalSkipSerialization' => true,
                    '__experimentalDefaultControls' => [
                        'color' => false,
                        'radius' => false,
                        'style' => false,
                        'width' => false
                    ]
                ],
                'spacing' => [
                    'padding' => true,
                    'margin' => true,
                    '__experimentalDefaultControls' => [
                        'margin' => false,
                        'padding' => false
                    ]
                ]
            ],
            'attributes' => [
                'icon' => [
                    'type' => 'string',
                    'source' => 'html',
                    'selector' => '.icon-container',
                    'default' => '',
                    '__experimentalRole' => 'content'
                ],
                'iconName' => [
                    'type' => 'string',
                    '__experimentalRole' => 'content'
                ],
                'itemsJustification' => [
                    'type' => 'string'
                ],
                'iconBackgroundColor' => [
                    'type' => 'string'
                ],
                'customIconBackgroundColor' => [
                    'type' => 'string'
                ],
                'iconBackgroundColorValue' => [
                    'type' => 'string'
                ],
                'iconColor' => [
                    'type' => 'string'
                ],
                'customIconColor' => [
                    'type' => 'string'
                ],
                'iconColorValue' => [
                    'type' => 'string'
                ],
                'gradient' => [
                    'type' => 'string'
                ],
                'customGradient' => [
                    'type' => 'string'
                ],
                'hasNoIconFill' => [
                    'type' => 'boolean'
                ],
                'label' => [
                    'type' => 'string'
                ],
                'title' => [
                    'type' => 'string'
                ],
                'linkUrl' => [
                    'type' => 'string'
                ],
                'linkRel' => [
                    'type' => 'string'
                ],
                'linkTarget' => [
                    'type' => 'string'
                ],
                'rotate' => [
                    'type' => 'number'
                ],
                'flipHorizontal' => [
                    'type' => 'boolean'
                ],
                'flipVertical' => [
                    'type' => 'boolean'
                ],
                'width' => [
                    'type' => ['string', 'number']
                ],
                'height' => [
                    'type' => 'string'
                ],
                'percentWidth' => [
                    'type' => 'number'
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
        $blockPath = $this->getBlockPath();
        $metadata = $this->getBlockMetadata($blockPath);

        $this->registerBlock($blockPath, $metadata);
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
        ?>
        <div class="<?php echo esc_attr($classString); ?>" style="<?php echo esc_attr($styleString); ?>">
            <?php if ($linkUrl) : ?>
                <a <?php echo $linkAttrs; ?> <?php echo $titleAttr; ?> <?php echo $ariaLabel; ?>>
                    <?php echo $icon; ?>
                </a>
            <?php else : ?>
                <span <?php echo $titleAttr; ?> <?php echo $ariaLabel; ?>>
                    <?php echo $icon; ?>
                </span>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
