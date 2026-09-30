<?php

namespace App\Services;

/**
 * Scroll Engine Service
 *
 * Single entry point for the theme's page-scrolling behaviour. Boots the
 * Lenis-based scroll engine, publishes its configuration to JavaScript, and
 * exposes the `window.jankxScroll` facade to blocks, extensions and plugins.
 *
 * Consumers never touch Lenis directly. They either:
 *  - call `jankx_scroll()` in PHP to read configuration or declare a
 *    dependency, or
 *  - use the `window.jankxScroll` facade in JS, which degrades gracefully to
 *    native scrolling when the engine is disabled.
 *
 * @package App\Services
 */
class ScrollService
{
    /**
     * Script handle used for the engine bundle.
     */
    public const HANDLE = 'jankx-scroll';

    /**
     * Global JS object name holding the runtime configuration.
     */
    public const CONFIG_OBJECT = 'jankxScrollConfig';

    /**
     * Theme options service.
     *
     * @var mixed
     */
    protected $themeOptions;

    /**
     * @param mixed $themeOptions
     */
    public function __construct($themeOptions)
    {
        $this->themeOptions = $themeOptions;
    }

    /**
     * Register frontend hooks.
     *
     * @return void
     */
    public function init(): void
    {
        // Frontend only: the block editor manages its own canvas.
        if (is_admin() || wp_doing_ajax()) {
            return;
        }

        add_action('wp_enqueue_scripts', [$this, 'enqueue'], 5);
    }

    /**
     * Read a theme option with a safe fallback when the options service is
     * unavailable (for example during a very early hook).
     *
     * @param string $key
     * @param mixed  $default
     * @return mixed
     */
    protected function option(string $key, $default = null)
    {
        if ($this->themeOptions && method_exists($this->themeOptions, 'getOption')) {
            $value = $this->themeOptions->getOption($key);
            if (!is_null($value) && $value !== '') {
                return $value;
            }
        }

        $all = get_option('jankx_options', []);

        return isset($all[$key]) ? $all[$key] : $default;
    }

    /**
     * Whether the smooth scroll engine is active.
     *
     * Extensions can force the state with the `jankx/scroll/enabled` filter,
     * e.g. to disable it on a landing page that relies on native scrolling.
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        $enabled = (bool) $this->option('enable_smooth_scroll', 1);

        /**
         * Filters whether the smooth scroll engine is enabled.
         *
         * @param bool $enabled Current state.
         */
        return (bool) apply_filters('jankx/scroll/enabled', $enabled);
    }

    /**
     * Build the runtime configuration handed to JavaScript.
     *
     * @return array
     */
    public function getConfig(): array
    {
        $config = [
            'enabled'               => $this->isEnabled(),
            'lerp'                  => (float) $this->option('smooth_scroll_lerp', 0.1),
            'wheelMultiplier'       => (float) $this->option('smooth_scroll_wheel_multiplier', 1),
            'touchMultiplier'       => (float) $this->option('smooth_scroll_touch_multiplier', 1.5),
            'syncTouch'             => (bool) $this->option('smooth_scroll_sync_touch', 0),
            'anchors'               => (bool) $this->option('smooth_scroll_anchors', 0),
            'autoToggle'            => false,
            'allowNestedScroll'     => true,
            'respectReducedMotion'  => true,
            'stickyOffset'          => 0,
            'offsetPadding'         => (int) $this->option('smooth_scroll_offset_padding', 0),
            'lockedClass'           => 'jankx-scroll-locked',
        ];

        /**
         * Filters the scroll engine configuration passed to JavaScript.
         *
         * @param array $config Configuration array.
         */
        $config = apply_filters('jankx/scroll/config', $config);

        return is_array($config) ? $config : [];
    }

    /**
     * Enqueue the engine bundle and its stylesheet.
     *
     * @return void
     */
    public function enqueue(): void
    {
        $base = get_template_directory() . '/resources/assets/js/scroll';

        $scriptPath = $base . '.js';
        $stylePath  = $base . '.css';
        $assetPath  = $base . '.asset.php';

        if (!file_exists($scriptPath)) {
            return;
        }

        $asset = file_exists($assetPath)
            ? require $assetPath
            : ['dependencies' => [], 'version' => filemtime($scriptPath)];

        wp_enqueue_script(
            self::HANDLE,
            get_template_directory_uri() . '/resources/assets/js/scroll.js',
            $asset['dependencies'] ?? [],
            $asset['version'] ?? filemtime($scriptPath),
            true
        );

        // webpack extracts `lenis.css` plus our overrides into this file.
        if (file_exists($stylePath)) {
            wp_enqueue_style(
                self::HANDLE,
                get_template_directory_uri() . '/resources/assets/js/scroll.css',
                [],
                filemtime($stylePath)
            );
        }

        wp_localize_script(self::HANDLE, self::CONFIG_OBJECT, $this->getConfig());

        /**
         * Fires after the scroll engine has been enqueued.
         *
         * Extensions that need to run code after the engine boots can hook
         * this and use `window.jankxScroll.ready(...)` in JS.
         *
         * @param array $config Resolved configuration.
         */
        do_action('jankx/scroll/enqueued', $this->getConfig());
    }
}
