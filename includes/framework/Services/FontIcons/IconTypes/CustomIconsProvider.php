<?php

namespace Jankx\Services\FontIcons\IconTypes;

class CustomIconsProvider extends IconTypeProvider
{
    protected $type = 'custom';
    protected $prefixes = ['icon-'];
    protected $cdnUrl = '';
    protected $cssUrl = '';

    public function enqueue()
    {
        // Custom icons typically use local CSS files
        $cssFile = get_template_directory() . "/assets/css/custom-icons.css";

        if (file_exists($cssFile)) {
            wp_enqueue_style(
                'jankx-custom-icons',
                get_template_directory_uri() . "/assets/css/custom-icons.css",
                [],
                $this->version ?? '1.0.0'
            );
        }
    }

    public function getIconData()
    {
        $jsonFile = $this->getIconDataPath();

        if (file_exists($jsonFile)) {
            $data = json_decode(file_get_contents($jsonFile), true);
            return $data['icons'] ?? [];
        }

        return [];
    }

    public function getIconDataPath()
    {
        return get_template_directory() . "/resources/icons/{$this->type}/icons.json";
    }

    public function getIconHtml($iconName, $attributes = [])
    {
        $defaultAttributes = [
            'class' => "icon-{$iconName}",
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);
        $attrString = $this->buildAttributes($attributes);

        return "<i {$attrString}></i>";
    }

    protected function buildAttributes($attributes)
    {
        $attrArray = [];
        foreach ($attributes as $key => $value) {
            $attrArray[] = "{$key}=\"" . esc_attr($value) . "\"";
        }
        return implode(' ', $attrArray);
    }
}
