<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Config\Repository;
use Jankx\Foundation\Application;

/**
 * Theme Data Loader
 *
 * Loads theme data from template and child theme, then stores it in Config Repository
 * with appropriate prefixes (template.* for parent theme, theme.* for child theme).
 *
 * @package Jankx\Foundation\Bootstrap
 * @since 2.0.0
 */
class ThemeDataLoader
{
    /**
     * Config repository instance
     *
     * @var \Jankx\Config\Repository
     */
    protected $config;

    /**
     * Constructor
     *
     * @param \Jankx\Config\Repository $config
     */
    public function __construct(Repository $config)
    {
        $this->config = $config;
    }

    /**
     * Bootstrap the given application.
     *
     * @return void
     */
    public function bootstrap()
    {
        $this->loadParentThemeData();
        $this->loadChildThemeData();
    }

    /**
     * Load parent theme data
     *
     * @return void
     */
    protected function loadParentThemeData()
    {
        $parentTheme = wp_get_theme(get_template());

        $this->config->set('template.name', $parentTheme->get('Name') ?: get_template());
        $this->config->set('template.version', $parentTheme->get('Version') ?: '1.0.0');
        $this->config->set('template.textdomain', $parentTheme->get('TextDomain') ?: get_template());
    }

    /**
     * Load child theme data
     *
     * @return void
     */
    protected function loadChildThemeData()
    {
        $childTheme = wp_get_theme();

        // Only load child theme data if it's different from parent theme
        if ($childTheme->get_stylesheet() !== $childTheme->get_template()) {
            $this->config->set('theme.name', $childTheme->get('Name') ?: get_stylesheet());
            $this->config->set('theme.version', $childTheme->get('Version') ?: '1.0.0');
            $this->config->set('theme.textdomain', $childTheme->get('TextDomain') ?: get_stylesheet());
        }
    }
}
