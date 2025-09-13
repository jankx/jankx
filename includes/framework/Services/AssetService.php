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
    }

    /**
     * Enqueue parent theme stylesheet
     *
     * @return void
     */
    protected function enqueueParentThemeStylesheet()
    {
        // Load compiled CSS if exists (development)
        $compiled_css = $this->templateUrl('style.css');
        if (file_exists(get_template_directory() . 'style.css')) {
            wp_enqueue_style(
                Config::get('template.textdomain', get_template()) . '-compiled',
                $compiled_css,
                [],
                Config::get('template.version', '2.0.0')
            );
        }

        // Load minified CSS if exists (production)
        $minified_css = $this->templateUrl('style.min.css');
        if (file_exists(get_template_directory() . '/style.min.css')) {
            wp_enqueue_style(
                Config::get('template.textdomain', get_template()) . '-minified',
                $minified_css,
                [],
                Config::get('template.version', '2.0.0')
            );
        }

        // Fallback to original style.css
        wp_enqueue_style(
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
            wp_enqueue_style(
                Config::get('theme.textdomain', get_stylesheet()),
                $this->themeUrl('style.css'),
                [Config::get('template.textdomain', get_template())],
                Config::get('theme.version', '1.0.0')
            );
        }
    }


    /**
     * Get template URL (parent theme)
     *
     * @param string $path Asset path
     * @return string
     */
    protected function templateUrl($path = '')
    {
        return get_template_directory_uri() . '/' . ltrim($path, '/');
    }

    /**
     * Get theme URL (child theme)
     *
     * @param string $path Asset path
     * @return string
     */
    protected function themeUrl($path = '')
    {
        return get_stylesheet_directory_uri() . '/' . ltrim($path, '/');
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
