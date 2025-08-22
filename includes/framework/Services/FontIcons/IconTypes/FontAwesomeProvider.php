<?php

namespace Jankx\Services\FontIcons\IconTypes;

class FontAwesomeProvider extends IconTypeProvider
{
    protected $type = 'fontawesome';
    protected $prefixes = ['fa-', 'fas-', 'far-', 'fab-', 'fal-', 'fad-'];
    protected $cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    protected $cssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

    public function enqueue()
    {
        // Enqueue FontAwesome CSS
        wp_enqueue_style(
            'jankx-fontawesome',
            $this->cssUrl,
            [],
            $this->version ?? '6.4.0'
        );
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
        // Determine FontAwesome class based on icon name
        $faClass = $this->getFontAwesomeClass($iconName);

        $defaultAttributes = [
            'class' => $faClass,
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);
        $attrString = $this->buildAttributes($attributes);

        return "<i {$attrString}></i>";
    }

    protected function getFontAwesomeClass($iconName)
    {
        // Remove prefix if present
        foreach ($this->prefixes as $prefix) {
            if (strpos($iconName, $prefix) === 0) {
                $iconName = substr($iconName, strlen($prefix));
                break;
            }
        }

        // Default to solid style
        return "fas fa-{$iconName}";
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
