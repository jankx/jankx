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

            // Add custom filter to allow img tags and other safe HTML
            if (!current_user_can('unfiltered_html')) {
                add_filter('pre_term_description', [$this, 'allowSafeHtml']);
                add_filter('term_description', [$this, 'allowSafeHtml']);
            }
            // For users with unfiltered_html capability, allow all HTML
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
     * Allow safe HTML including img tags in term descriptions
     *
     * @param string $content
     * @return string
     */
    public function allowSafeHtml($content)
    {
        // Define allowed HTML tags including img
        $allowed_html = array(
            'a' => array(
                'href' => array(),
                'title' => array(),
                'target' => array(),
                'rel' => array(),
            ),
            'abbr' => array(
                'title' => array(),
            ),
            'acronym' => array(
                'title' => array(),
            ),
            'b' => array(),
            'blockquote' => array(
                'cite' => array(),
            ),
            'cite' => array(),
            'code' => array(),
            'del' => array(
                'datetime' => array(),
            ),
            'em' => array(),
            'i' => array(),
            'img' => array(
                'src' => array(),
                'alt' => array(),
                'title' => array(),
                'width' => array(),
                'height' => array(),
                'class' => array(),
                'style' => array(),
            ),
            'ins' => array(
                'datetime' => array(),
                'cite' => array(),
            ),
            'kbd' => array(),
            'mark' => array(),
            'pre' => array(),
            'q' => array(
                'cite' => array(),
            ),
            's' => array(),
            'samp' => array(),
            'small' => array(),
            'strike' => array(),
            'strong' => array(),
            'sub' => array(),
            'sup' => array(),
            'tt' => array(),
            'u' => array(),
            'var' => array(),
            'p' => array(
                'class' => array(),
                'style' => array(),
            ),
            'br' => array(),
            'div' => array(
                'class' => array(),
                'style' => array(),
            ),
            'span' => array(
                'class' => array(),
                'style' => array(),
            ),
            'ul' => array(
                'class' => array(),
            ),
            'ol' => array(
                'class' => array(),
            ),
            'li' => array(
                'class' => array(),
            ),
            'h1' => array(
                'class' => array(),
            ),
            'h2' => array(
                'class' => array(),
            ),
            'h3' => array(
                'class' => array(),
            ),
            'h4' => array(
                'class' => array(),
            ),
            'h5' => array(
                'class' => array(),
            ),
            'h6' => array(
                'class' => array(),
            ),
        );

        return wp_kses($content, $allowed_html);
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
