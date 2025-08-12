<?php

namespace Jankx\Services\FontIcons;

class IconRenderer
{
    protected $providers = [];

    public function __construct($providers = [])
    {
        $this->providers = $providers;
    }

    public function render($iconName, $type = 'fontawesome', $attributes = [])
    {
        if (!isset($this->providers[$type])) {
            return $this->renderFallback($iconName, $attributes);
        }

        $provider = $this->providers[$type];
        return $provider->renderIcon($iconName, $attributes);
    }

    public function renderFallback($iconName, $attributes = [])
    {
        $defaultAttributes = [
            'class' => "icon icon-{$iconName}",
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);

        return sprintf('<span %s></span>', $this->buildAttributes($attributes));
    }

    public function renderWithSize($iconName, $type = 'fontawesome', $size = '1x', $attributes = [])
    {
        $attributes['class'] = ($attributes['class'] ?? '') . " fa-{$size}";
        return $this->render($iconName, $type, $attributes);
    }

    public function renderWithAnimation($iconName, $type = 'fontawesome', $animation = 'spin', $attributes = [])
    {
        $attributes['class'] = ($attributes['class'] ?? '') . " fa-{$animation}";
        return $this->render($iconName, $type, $attributes);
    }

    public function renderList($icons, $type = 'fontawesome', $attributes = [])
    {
        $html = '<ul class="icon-list">';

        foreach ($icons as $icon) {
            $iconName = is_string($icon) ? $icon : $icon['name'];
            $iconAttributes = is_array($icon) ? ($icon['attributes'] ?? []) : [];

            $mergedAttributes = array_merge($attributes, $iconAttributes);

            $html .= '<li>' . $this->render($iconName, $type, $mergedAttributes) . '</li>';
        }

        $html .= '</ul>';

        return $html;
    }

    public function renderGrid($icons, $type = 'fontawesome', $columns = 4, $attributes = [])
    {
        $html = sprintf('<div class="icon-grid" style="grid-template-columns: repeat(%d, 1fr);">', $columns);

        foreach ($icons as $icon) {
            $iconName = is_string($icon) ? $icon : $icon['name'];
            $iconAttributes = is_array($icon) ? ($icon['attributes'] ?? []) : [];

            $mergedAttributes = array_merge($attributes, $iconAttributes);

            $html .= '<div class="icon-grid-item">' . $this->render($iconName, $type, $mergedAttributes) . '</div>';
        }

        $html .= '</div>';

        return $html;
    }

    public function renderPreview($iconName, $type = 'fontawesome', $attributes = [])
    {
        $defaultAttributes = [
            'class' => 'icon-preview',
            'title' => $iconName
        ];

        $attributes = array_merge($defaultAttributes, $attributes);

        $iconHtml = $this->render($iconName, $type, ['class' => 'icon-preview-icon']);

        return sprintf(
            '<div %s>%s<span class="icon-preview-name">%s</span></div>',
            $this->buildAttributes($attributes),
            $iconHtml,
            esc_html($iconName)
        );
    }

    protected function buildAttributes($attributes)
    {
        $html = '';
        foreach ($attributes as $key => $value) {
            if ($value !== null && $value !== '') {
                $html .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
            }
        }
        return trim($html);
    }

    public function setProvider($type, $provider)
    {
        $this->providers[$type] = $provider;
    }

    public function getProvider($type)
    {
        return $this->providers[$type] ?? null;
    }

    public function hasProvider($type)
    {
        return isset($this->providers[$type]);
    }
}
