<?php

namespace Jankx\Layouts\AdvancedButton;

class DetailLinkRenderer extends AbstractButtonRenderer
{
    public function render(array $attributes, string $content, string $classes, array $styles): string
    {
        $title = $attributes['title'] ?? '';
        $classes .= ' jankx-button-detail-link';
        $htmlAttributes = [
            'href' => '#',
            'class' => $classes,
            'data-trigger-type' => 'detail-link',
        ];

        $htmlAttributes = array_merge($htmlAttributes, $this->getAnimationAttributes($attributes));
        if ($title) {
            $htmlAttributes['title'] = esc_attr($title);
        }
        $styleAttr = $this->buildStyleAttribute($styles);
        if ($styleAttr) {
            $htmlAttributes['style'] = $styleAttr;
        }
        $attributesString = $this->buildAttributes($htmlAttributes);
        $html = sprintf('<a%s>%s</a>', $attributesString, $content);
        $permalink = get_permalink();
        if ($permalink) {
            $html = preg_replace('/href\s*=\s*["\']#["\']/', 'href="' . esc_url($permalink) . '"', $html);
        }
        return $html;
    }
}

