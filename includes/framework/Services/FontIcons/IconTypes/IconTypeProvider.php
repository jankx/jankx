<?php

namespace Jankx\Services\FontIcons\IconTypes;

abstract class IconTypeProvider
{
    protected $type;
    protected $prefixes = [];
    protected $cdnUrl;
    protected $cssUrl;
    protected $version;
    protected $config;

    public function __construct(array $config = [])
    {
        $this->config = $config;
        $this->type = $config['type'] ?? $this->type;
        $this->prefixes = $config['prefixes'] ?? $this->prefixes;
        $this->cdnUrl = $config['cdn_url'] ?? $this->cdnUrl;
        $this->cssUrl = $config['css_url'] ?? $this->cssUrl;
        $this->version = $config['version'] ?? $this->version;
    }

    /**
     * Enqueue required assets (CSS, fonts, etc.)
     */
    abstract public function enqueue();

    /**
     * Get icon data from source
     */
    abstract public function getIconData();

    /**
     * Get path to icon data file
     */
    abstract public function getIconDataPath();

    /**
     * Generate HTML for an icon
     */
    abstract public function getIconHtml($iconName, $attributes = []);

    /**
     * Get icon type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Get CSS prefixes
     */
    public function getPrefixes()
    {
        return $this->prefixes;
    }

    /**
     * Check if icon name matches this provider's prefixes
     */
    public function canHandle($iconName)
    {
        foreach ($this->prefixes as $prefix) {
            if (strpos($iconName, $prefix) === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get configuration
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Check if provider is enabled
     */
    public function isEnabled()
    {
        return $this->config['enabled'] ?? true;
    }

    /**
     * Check if provider should auto-load
     */
    public function shouldAutoLoad()
    {
        return $this->config['auto_load'] ?? false;
    }
}
