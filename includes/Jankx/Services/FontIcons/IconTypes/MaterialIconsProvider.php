<?php

namespace Jankx\Services\FontIcons\IconTypes;


class MaterialIconsProvider extends IconTypeProvider
{
    protected $type = 'material';
    protected $prefixes = ['material-icons'];
    protected $cdnUrl = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    protected $cssUrl = 'https://fonts.googleapis.com/css2?family=Material+Icons';

    public function enqueue()
    {
        // Enqueue Material Icons font
        wp_enqueue_style(
            'jankx-material-icons',
            $this->cssUrl,
            [],
            $this->version ?? '1.0.0'
        );
    }

    public function getIconData()
    {
        // Load icon data from JSON file
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
            'class' => "material-icons {$iconName}",
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);
        $attrString = $this->buildAttributes($attributes);

        return "<i {$attrString}>{$iconName}</i>";
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
