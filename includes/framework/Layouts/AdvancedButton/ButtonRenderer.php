<?php

namespace Jankx\Layouts\AdvancedButton;

class ButtonRenderer extends AbstractButtonRenderer
{
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

