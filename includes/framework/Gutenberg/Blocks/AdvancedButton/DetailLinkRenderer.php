<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Detail Link Button Renderer
 *
 * Renders button as an anchor tag that links to current post/page permalink
 * Matches JavaScript save function: triggerType === 'detail-link'
 * PHP will replace href="#" with actual permalink
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class DetailLinkRenderer extends AbstractButtonRenderer
{
    /**
     * Render detail link button
     *
     * @param array $attributes Block attributes
     * @param string $content Button content
     * @param string $classes Button CSS classes
     * @param array $styles Button inline styles
     * @return string Rendered HTML
     */
    public function render(array $attributes, string $content, string $classes, array $styles): string
    {
        $title = $attributes['title'] ?? '';
        
        // Add jankx-button-detail-link class (matches JS)
        $classes .= ' jankx-button-detail-link';

        $htmlAttributes = [
            'href' => '#', // Will be replaced by PHP with actual permalink
            'class' => $classes,
            'data-trigger-type' => 'detail-link',
        ];

        if ($title) {
            $htmlAttributes['title'] = esc_attr($title);
        }

        $styleAttr = $this->buildStyleAttribute($styles);
        if ($styleAttr) {
            $htmlAttributes['style'] = $styleAttr;
        }

        $attributesString = $this->buildAttributes($htmlAttributes);

        $html = sprintf('<a%s>%s</a>', $attributesString, $content);

        // Replace href="#" with actual permalink (matches PHP logic)
        $permalink = get_permalink();
        if ($permalink) {
            $html = preg_replace(
                '/href\s*=\s*["\']#["\']/',
                'href="' . esc_url($permalink) . '"',
                $html
            );
        }

        return $html;
    }
}

