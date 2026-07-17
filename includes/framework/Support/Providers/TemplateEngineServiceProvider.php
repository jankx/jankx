<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Template Engine Service Provider
 *
 * Registers the template engine bindings and aliases for Jankx Framework.
 * Provides proper container bindings for template engine resolution.
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class TemplateEngineServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register template engine.latte alias pointing to latte.engine
        $app->singleton('template.engine.latte', function (Application $app) {
            return $app->make('latte.engine');
        });

        // Register plates alias for backward compatibility
        $app->singleton('template.engine.plates', function (Application $app) {
            return $app->make('latte.engine');
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Add WordPress function filters to the Latte engine
        $this->registerWordPressFilters($app);

        $app->singleton(ViewLayoutManager::class, function (Application $app) {
            return new ViewLayoutManager($app);
        });
    }

    /**
     * Register WordPress function filters for the Latte engine.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function registerWordPressFilters(Application $app)
    {
        try {
            $latte = $app->make('latte.engine');
            
            // Add WordPress function filters
            $latte->addFilter('esc_html', 'esc_html');
            $latte->addFilter('esc_url', 'esc_url');
            $latte->addFilter('esc_attr', 'esc_attr');
            $latte->addFilter('wp_kses_post', 'wp_kses_post');
            $latte->addFilter('wp_trim_words', 'wp_trim_words');
            
            // WordPress Translation functions
            $latte->addFilter('__', '__');
            $latte->addFilter('_e', '_e');
            $latte->addFilter('_x', '_x');
            
            // URL & Utility functions
            $latte->addFilter('get_permalink', 'get_permalink');
            $latte->addFilter('get_term_link', 'get_term_link');
            $latte->addFilter('get_post_meta', 'get_post_meta');
            $latte->addFilter('get_option', 'get_option');
            
            // Image functions
            $latte->addFilter('get_the_post_thumbnail_url', 'get_the_post_thumbnail_url');
            $latte->addFilter('wp_get_attachment_image_src', 'wp_get_attachment_image_src');

            // Add Icon system integration
            if (function_exists('jankx_icon')) {
                $latte->addFilter('icon', 'jankx_icon');
                
                // Also add as function for {icon '...'} syntax
                if (method_exists($latte, 'addFunction')) {
                    $latte->addFunction('icon', 'jankx_icon');
                }
            }
            
        } catch (\Exception $e) {
        }
    }
}
