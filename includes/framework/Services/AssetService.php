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
 * Asset Versioning Strategy:
 * - Combines theme Version + Build Times from CSS header
 * - Format: {version}.{build_times} (e.g., 2.0.0.5)
 * - Build Times auto-increments on each CSS rebuild
 * - Provides automatic cache busting without manual version bumping
 *
 * CSS Header Example:
 * /*!
 * Theme Name: Jankx Framework
 * Version: 2.0.0
 * Build Times: 5
 * ...
 *
 * Benefits:
 * - Automatic cache invalidation when CSS is rebuilt
 * - Version combines semantic version + build counter
 * - No manual version management required
 * - Works for both parent and child themes
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
     * Cached build times
     *
     * @var array<string, int|null>
     */
    protected static $buildTimesCache = [];

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
     * Uses combined version (Version + Build Times) for cache busting
     *
     * @return void
     */
    protected function enqueueParentThemeStylesheet()
    {
        $template_dir = get_template_directory();
        $textdomain = Config::get('template.textdomain', get_template());
        $base_version = Config::get('template.version', '2.0.0');

        // Check for minified CSS first (production)
        $minified_path = $template_dir . '/style.min.css';
        if (file_exists($minified_path)) {
            wp_enqueue_style(
                $textdomain,
                $this->templateUrl('style.min.css'),
                [],
                $this->getAssetVersion($minified_path, $base_version)
            );
            return; // Use minified, skip others
        }

        // Fall back to regular style.css
        $style_path = $template_dir . '/style.css';
        if (file_exists($style_path)) {
            wp_enqueue_style(
                $textdomain,
                $this->templateUrl('style.css'),
                [],
                $this->getAssetVersion($style_path, $base_version)
            );
        }
    }

    /**
     * Enqueue child theme stylesheet
     *
     * Uses combined version (Version + Build Times) for cache busting
     *
     * @return void
     */
    protected function enqueueChildThemeStylesheet()
    {
        $stylesheet = get_stylesheet();
        $template = get_template();

        // Only enqueue child theme stylesheet if it's different from parent theme
        if ($stylesheet !== $template) {
            $child_style_path = get_stylesheet_directory() . '/style.css';
            $child_version = Config::get('theme.version', '1.0.0');

            wp_enqueue_style(
                Config::get('theme.textdomain', $stylesheet),
                $this->themeUrl('style.css'),
                [Config::get('template.textdomain', $template)],
                $this->getAssetVersion($child_style_path, $child_version)
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

    /**
     * Parse Build Times from CSS file header
     *
     * Reads the CSS file header and extracts the Build Times value.
     * Uses in-memory cache to avoid repeated file reads.
     *
     * @param string $css_file_path Full path to CSS file
     * @return int|null Build times number or null if not found
     */
    protected function parseBuildTimes(string $css_file_path): ?int
    {
        // Check cache first
        if (isset(self::$buildTimesCache[$css_file_path])) {
            return self::$buildTimesCache[$css_file_path];
        }

        if (!file_exists($css_file_path)) {
            self::$buildTimesCache[$css_file_path] = null;
            return null;
        }

        // Read first 1KB of file (header only)
        $handle = fopen($css_file_path, 'r');
        if (!$handle) {
            self::$buildTimesCache[$css_file_path] = null;
            return null;
        }

        $header = fread($handle, 1024);
        fclose($handle);

        // Parse Build Times from header
        if (preg_match('/Build Times:\s*(\d+)/i', $header, $matches)) {
            $build_times = (int) $matches[1];
            self::$buildTimesCache[$css_file_path] = $build_times;
            return $build_times;
        }

        // Cache null result to avoid repeated parsing
        self::$buildTimesCache[$css_file_path] = null;
        return null;
    }

    /**
     * Get combined asset version (Version + Build Times)
     *
     * Combines theme version with build times from CSS header
     * Format: {version}.{build_times}
     * Example: 2.0.0 + 5 → 2.0.0.5
     *
     * @param string $css_file_path Full path to CSS file
     * @param string $fallback_version Fallback version if parsing fails
     * @return string Combined version string
     */
    protected function getAssetVersion(string $css_file_path, string $fallback_version = '2.0.0'): string
    {
        $build_times = $this->parseBuildTimes($css_file_path);

        if ($build_times !== null) {
            return $fallback_version . '.' . $build_times;
        }

        return $fallback_version;
    }
}
