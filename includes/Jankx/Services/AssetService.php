<?php

namespace Jankx\Services;

use Jankx\Facades\Config;
use Jankx\Foundation\Application;

/**
 * Asset Service
 *
 * Manages theme assets including CSS and JS files.
 * Handles loading of parent and child theme stylesheets.
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class AssetService
{
    /**
     * Application instance
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Constructor
     *
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Enqueue theme stylesheets (parent and child themes)
     *
     * @return void
     */
    public function enqueueThemeStylesheets()
    {
        // Enqueue parent theme stylesheet
        $this->enqueueParentThemeStylesheet();

        // Enqueue child theme stylesheet if exists
        $this->enqueueChildThemeStylesheet();

        wp_enqueue_style(get_stylesheet());
    }

    /**
     * Enqueue parent theme stylesheet
     *
     * @return void
     */
    protected function enqueueParentThemeStylesheet()
    {
        wp_register_style(
            Config::get('template.textdomain', get_template()),
            $this->templateUrl('style.css'),
            [],
            Config::get('template.version', '2.0.0')
        );
    }

    /**
     * Enqueue child theme stylesheet
     *
     * @return void
     */
    protected function enqueueChildThemeStylesheet()
    {
        $stylesheet = get_stylesheet();
        $template = get_template();

        // Only enqueue child theme stylesheet if it's different from parent theme
        if ($stylesheet !== $template) {
            wp_register_style(
                Config::get('theme.textdomain', get_stylesheet()),
                $this->themeUrl('style.css'),
                [Config::get('template.textdomain', get_template())],
                Config::get('theme.version', '1.0.0')
            );
        }
    }


    /**
     * Get asset URL (alias for templateUrl)
     *
     * @param string $path Asset path
     * @return string
     */
    public function url($path = '')
    {
        return $this->app->make(\Jankx\Managers\UrlManager::class)->asset($path);
    }
}
