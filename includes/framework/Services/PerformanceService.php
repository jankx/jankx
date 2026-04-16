<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

use function remove_action;
use function remove_filter;
use function add_action;
use function add_filter;

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
        $this->optimizeHtmlHeader();
        $this->removeEmojis();
        
        // Defer scripts
        add_filter('script_loader_tag', [$this, 'deferScripts'], 10, 3);
        
        // Try optimizing dashicons
        add_action('wp_enqueue_scripts', [$this, 'optimizeDashicons'], 99);
    }

    /**
     * Clean up unnecessary header tags.
     */
    protected function optimizeHtmlHeader()
    {
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
     * Defer script tags securely.
     */
    public function deferScripts($tag, $handle, $src)
    {
        // Avoid deferring jquery core because many inline scripts or plugins might break
        if (in_array($handle, ['jquery', 'jquery-core', 'jquery-migrate'])) {
            return $tag;
        }
        
        // Only target frontend handles
        if (!is_admin()) {
            if (strpos($tag, 'defer') === false && strpos($tag, 'async') === false) {
                return str_replace(' src', ' defer="defer" src', $tag);
            }
        }

        return $tag;
    }
}
