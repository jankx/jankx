<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Performance Service
 *
 * Implements HTML optimization, asset deferral logic, and other
 * frontend performance enhancements for Jankx Framework.
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class PerformanceService
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
     * Boot performance optimizations
     */
    public function boot()
    {
        // Only apply optimizations when WordPress is available (not in unit tests)
        if (!function_exists('add_action') || !function_exists('get_option')) {
            return;
        }

        if (get_option('jankx_perf_optimize_html', 'yes') === 'yes') {
            $this->optimizeHtmlHeader();
        }

        if (get_option('jankx_perf_remove_emojis', 'yes') === 'yes') {
            $this->removeEmojis();
        }

        if (get_option('jankx_perf_defer_scripts', 'yes') === 'yes') {
            add_filter('script_loader_tag', [$this, 'deferScripts'], 10, 3);
        }

        if (get_option('jankx_perf_optimize_dashicons', 'yes') === 'yes') {
            add_action('wp_enqueue_scripts', [$this, 'optimizeDashicons'], 99);
        }
    }

    /**
     * Clean up unnecessary header tags.
     */
    protected function optimizeHtmlHeader()
    {
        if (!function_exists('remove_action')) {
            return;
        }

        // Remove generator tag for security and performance
        remove_action('wp_head', 'wp_generator');

        // Remove XML-RPC and WLW manifest links
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');

        // Remove shortlinks
        remove_action('wp_head', 'wp_shortlink_wp_head', 10);

        // Remove REST API links if not explicitly needed in head
        remove_action('wp_head', 'rest_output_link_wp_head', 10);
        remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
        remove_action('template_redirect', 'rest_output_link_header', 11);
    }

    /**
     * Remove inline emoji scripts and styles
     */
    protected function removeEmojis()
    {
        if (!function_exists('remove_action') || !function_exists('remove_filter')) {
            return;
        }

        // Remove actions related to emojis
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('admin_print_scripts', 'print_emoji_detection_script');
        remove_action('wp_print_styles', 'print_emoji_styles');
        remove_action('admin_print_styles', 'print_emoji_styles');
        remove_filter('the_content_feed', 'wp_staticize_emoji');
        remove_filter('comment_text_rss', 'wp_staticize_emoji');
        remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
        
        // For WP 6.4+
        remove_action('wp_enqueue_scripts', 'wp_enqueue_emoji_styles');
        remove_action('admin_enqueue_scripts', 'wp_enqueue_emoji_styles');

        add_filter('tiny_mce_plugins', [$this, 'disableEmojisTinymce']);
        add_filter('wp_resource_hints', [$this, 'disableEmojisRemoveDnsPrefetch'], 10, 2);
    }

    /**
     * Disable emojis in TinyMCE
     */
    public function disableEmojisTinymce($plugins)
    {
        if (is_array($plugins)) {
            return array_diff($plugins, ['wpemoji']);
        }
        return [];
    }

    /**
     * Remove emoji CDN DNS prefetch
     */
    public function disableEmojisRemoveDnsPrefetch($urls, $relation_type)
    {
        if ('dns-prefetch' === $relation_type) {
            $emoji_svg_url = apply_filters('emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/');
            $urls = array_diff($urls, [$emoji_svg_url]);
        }
        return $urls;
    }

    /**
     * De-register Dashicons for non-logged-in users if not needed
     */
    public function optimizeDashicons()
    {
        if (!is_user_logged_in()) {
            wp_deregister_style('dashicons');
        }
    }

    /**
     * Vendor script handles (non-wp- prefix) that must never be deferred
     * because WP core packages depend on them being available synchronously.
     *
     * @var string[]
     */
    protected $noDeferVendorHandles = [
        'jquery',
        'jquery-core',
        'jquery-migrate',
        'react',
        'react-dom',
        'react-jsx-runtime',
        'moment',
    ];

    /**
     * Whether a script handle belongs to WordPress core.
     * All wp-* handles form an interdependent graph; deferring any one of
     * them can silently break another that loads synchronously.
     *
     * @param string $handle
     * @return bool
     */
    protected function isWpCoreScript($handle)
    {
        return strncmp($handle, 'wp-', 3) === 0;
    }

    /**
     * Whether a script has inline companion code registered via
     * wp_add_inline_script() / wp_script_add_data().
     * Those inline blocks run synchronously, so their parent must not defer.
     *
     * @param string $handle
     * @return bool
     */
    protected function hasInlineCompanionScript($handle)
    {
        global $wp_scripts;
        if (!isset($wp_scripts) || !($wp_scripts instanceof \WP_Scripts)) {
            return false;
        }
        $before = $wp_scripts->get_data($handle, 'before');
        $after  = $wp_scripts->get_data($handle, 'after');
        return !empty($before) || !empty($after);
    }

    /**
     * Defer script tags securely.
     *
     * A script is skipped (returned unchanged) when ANY of these is true:
     *   1. Its handle starts with "wp-"  (all WP core packages).
     *   2. It is a known vendor dependency of WP core.
     *   3. It has inline before/after companion scripts registered in
     *      WP_Scripts — those run synchronously and need the global to exist.
     *   4. It already carries defer or async.
     *   5. We are in the admin context.
     */
    public function deferScripts($tag, $handle, $src)
    {
        // Rule 1 – WordPress core namespace
        if ($this->isWpCoreScript($handle)) {
            return $tag;
        }

        // Rule 2 – known vendor scripts
        if (in_array($handle, $this->noDeferVendorHandles, true)) {
            return $tag;
        }

        // Rule 3 – any script with registered inline companion code
        if ($this->hasInlineCompanionScript($handle)) {
            return $tag;
        }

        // Rule 4 & 5 – already async/deferred or in admin
        if (!is_admin()) {
            if (strpos($tag, 'defer') === false && strpos($tag, 'async') === false) {
                return str_replace(' src', ' defer="defer" src', $tag);
            }
        }

        return $tag;
    }
}
