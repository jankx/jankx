<?php

namespace App\Providers\WordPress;

use Jankx\Support\Providers\ServiceProvider;

/**
 * Apply Term HTML Description Service Provider
 *
 * Applies content processing filters to term descriptions
 * for both admin and frontend display.
 *
 * @package App\Providers\WordPress
 * @since 2.0.0
 */
class ApplyTermHtmlDescriptionServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        // No services to register
    }

    /**
     * Bootstrap services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        $this->setupHooks();
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        // Only users with the "publish_posts" capability can use this feature
        if (current_user_can('publish_posts')) {
            // Remove the filters which disallow HTML in term descriptions
            remove_filter('pre_term_description', 'wp_filter_kses');
            remove_filter('term_description', 'wp_kses_data');

            // Add filters to disallow unsafe HTML tags
            if (!current_user_can('unfiltered_html')) {
                add_filter('pre_term_description', 'wp_kses_post');
                add_filter('term_description', 'wp_kses_post');
            }
        }

        // Apply `the_content` filters to term description
        if (isset($GLOBALS['wp_embed'])) {
            add_filter('term_description', array($GLOBALS['wp_embed'], 'run_shortcode'), 8);
            add_filter('term_description', array($GLOBALS['wp_embed'], 'autoembed'), 8);
        }

        // Filters that work on both admin and frontend
        add_filter('term_description', 'wptexturize');
        add_filter('term_description', 'convert_smilies');
        add_filter('term_description', 'convert_chars');
        add_filter('term_description', 'wpautop');

        // Filters that only work on frontend
        if (!is_admin()) {
            add_filter('term_description', 'shortcode_unautop');
            add_filter('term_description', 'do_shortcode', 11);
        }
    }

    /**
     * Get the services provided by the provider
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}
