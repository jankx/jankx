<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Link Button Renderer
 *
 * Renders button as an anchor tag (<a>)
 * Matches JavaScript save function: triggerType === 'link'
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class LinkRenderer extends AbstractButtonRenderer
{
    /**
     * Render link button
     *
     * @param array $attributes Block attributes
     * @param string $content Button content
     * @param string $classes Button CSS classes
     * @param array $styles Button inline styles
     * @return string Rendered HTML
     */
    public function render(array $attributes, string $content, string $classes, array $styles): string
    {
        $url = $attributes['url'] ?? '#';
        $linkTarget = $attributes['linkTarget'] ?? null;
        $rel = $attributes['rel'] ?? null;
        $title = $attributes['title'] ?? '';

        $htmlAttributes = [
            'href' => esc_url($url),
            'class' => $classes,
            'data-trigger-type' => 'link',
        ];

        if ($linkTarget) {
            $htmlAttributes['target'] = $linkTarget;
        }

        if ($rel) {
            $htmlAttributes['rel'] = $rel;
        }

        if ($title) {
            $htmlAttributes['title'] = esc_attr($title);
        }

        $styleAttr = $this->buildStyleAttribute($styles);
        if ($styleAttr) {
            $htmlAttributes['style'] = $styleAttr;
        }

        $attributesString = $this->buildAttributes($htmlAttributes);

        return sprintf('<a%s>%s</a>', $attributesString, $content);
    }
}

