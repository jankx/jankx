<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;
use Jankx\Support\TemplateEngine\Engine;

/**
 * Template Engine Override Bootstrapper
 *
 * This bootstrapper runs with the highest priority to override WordPress template system
 * with advanced template engine support (Jankx, Twig, Blade, Plates).
 *
 * @package Jankx\Foundation\Bootstrap
 * @since 2.0.0
 */
class ThemeEngineOverrideBootstrapper
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        // Only run on frontend requests
        if (Environment::isAdmin() || Environment::isWpCli() || Environment::isWpCron()) {
            return;
        }

        // Override WordPress theme loading mechanism
        $this->overrideWordPressThemeEngine($app);
    }

    /**
     * Override WordPress template system with Template Engine
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function overrideWordPressThemeEngine(Application $app)
    {
        // Initialize Template Engine
        $this->initializeTemplateEngine($app);

        // Override WordPress template system
        $this->overrideTemplateSystem($app);
    }

    /**
     * Initialize Template Engine
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializeTemplateEngine(Application $app)
    {
        // Create template engine instance
        $templateEngine = new Engine($app);

        // Register template engine in container
        $app->instance('template.engine', $templateEngine);

        // Set default engine based on configuration
        $defaultEngine = $app->make('config')->get('template.default_engine', 'jankx');
        $templateEngine->setEngine($defaultEngine);

        // Set global template variables
        $templateEngine->setVariables([
            'app' => $app,
            'theme' => [
                'name' => get_template(),
                'version' => wp_get_theme()->get('Version'),
                'directory' => get_template_directory(),
                'url' => get_template_directory_uri(),
            ],
            'site' => [
                'name' => get_bloginfo('name'),
                'description' => get_bloginfo('description'),
                'url' => home_url(),
                'admin_url' => admin_url(),
            ]
        ]);
    }
    /**
     * Override WordPress template system
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function overrideTemplateSystem(Application $app)
    {
        $templateEngine = $app->make('template.engine');

        // Override WordPress template system
        $templateEngine->overrideWordPressTemplates();

        // Override template functions
        $this->overrideTemplateFunctions($app, $templateEngine);
    }

    /**
     * Override template functions
     *
     * @param  \Jankx\Foundation\Application  $app
     * @param  \Jankx\Support\TemplateEngine\Engine  $templateEngine
     * @return void
     */
    protected function overrideTemplateFunctions(Application $app, Engine $templateEngine)
    {
        // Override get_header
        if (!function_exists('jankx_get_header')) {
            function jankx_get_header($name = null)
            {
                global $jankx_app;
                if ($jankx_app && $jankx_app->bound('template.engine')) {
                    $templateEngine = $jankx_app->make('template.engine');
                    $templateEngine->display('header' . ($name ? '-' . $name : ''));
                } else {
                    get_header($name);
                }
            }
        }

        // Override get_footer
        if (!function_exists('jankx_get_footer')) {
            function jankx_get_footer($name = null)
            {
                global $jankx_app;
                if ($jankx_app && $jankx_app->bound('template.engine')) {
                    $templateEngine = $jankx_app->make('template.engine');
                    $templateEngine->display('footer' . ($name ? '-' . $name : ''));
                } else {
                    get_footer($name);
                }
            }
        }

        // Override get_sidebar
        if (!function_exists('jankx_get_sidebar')) {
            function jankx_get_sidebar($name = null)
            {
                global $jankx_app;
                if ($jankx_app && $jankx_app->bound('template.engine')) {
                    $templateEngine = $jankx_app->make('template.engine');
                    $templateEngine->display('sidebar' . ($name ? '-' . $name : ''));
                } else {
                    get_sidebar($name);
                }
            }
        }

        // Set global app reference for template functions
        global $jankx_app;
        $jankx_app = $app;
    }
}
