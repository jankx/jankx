<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Button Element Renderer
 *
 * Renders button as a button element (<button>)
 * Matches JavaScript save function: triggerType === 'button'
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class ButtonRenderer extends AbstractButtonRenderer
{
    /**
     * Render button element
     *
     * @param array $attributes Block attributes
     * @param string $content Button content
     * @param string $classes Button CSS classes
     * @param array $styles Button inline styles
     * @return string Rendered HTML
     */
    public function render(array $attributes, string $content, string $classes, array $styles): string
    {
        $buttonType = $attributes['buttonType'] ?? 'button';
        $title = $attributes['title'] ?? '';

        $htmlAttributes = [
            'type' => esc_attr($buttonType),
            'class' => $classes,
            'data-trigger-type' => 'button',
        ];

        if ($title) {
            $htmlAttributes['title'] = esc_attr($title);
        }

        $styleAttr = $this->buildStyleAttribute($styles);
        if ($styleAttr) {
            $htmlAttributes['style'] = $styleAttr;
        }

        $attributesString = $this->buildAttributes($htmlAttributes);

        return sprintf('<button%s>%s</button>', $attributesString, $content);
    }
}

