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
