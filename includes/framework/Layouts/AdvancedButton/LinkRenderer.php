<?php

namespace Jankx\Layouts\AdvancedButton;

class LinkRenderer extends AbstractButtonRenderer
{
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

        $htmlAttributes = array_merge($htmlAttributes, $this->getAnimationAttributes($attributes));
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

