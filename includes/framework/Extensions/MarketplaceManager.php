<?php
/**
 * Marketplace Manager for Jankx Theme Framework
 *
 * Handles integration with the Jankx Extensions Hub.
 * API Base: https://jankx.pages.dev
 *
 * @package Jankx\Extensions
 * @since 2.0.0
 */

namespace Jankx\Extensions;

use Jankx\Facades\App;
use Jankx\Facades\Log;

class MarketplaceManager
{
    /**
     * Hub Base URL
     * @var string
     */
    const HUB_URL = 'https://jankx.pages.dev';

    /**
     * Cached Jankx version to avoid multiple lookups
     * @var string|null
     */
    protected $jankxVersion = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Register update hook on admin_init only (not on every request)
        add_action('admin_init', [$this, 'registerHooks']);
    }

    /**
     * Register hooks for the marketplace (admin only)
     */
    public function registerHooks()
    {
        // Hook into WordPress update mechanism for theme updates
        // Only if we have cached update data (non-blocking)
        add_filter('pre_set_site_transient_update_themes', [$this, 'injectCachedThemeUpdate']);

        // Background update check
        add_action('jankx_refresh_theme_update_cache', [$this, 'fetchThemeCoreUpdate']);
    }

    /**
     * Inject cached theme update into WordPress transient (non-blocking)
     * This only uses already-cached data, never fetches live.
     */
    public function injectCachedThemeUpdate($transient)
    {
        if (!is_object($transient)) {
            $transient = new \stdClass();
        }

        $cached = get_transient('jankx_theme_update_check');
        if (!$cached || !isset($cached['version'], $cached['download_url'])) {
            return $transient;
        }

        $themeSlug = get_template();
        $transient->response[$themeSlug] = [
            'theme'       => $themeSlug,
            'new_version' => $cached['version'],
            'url'         => $cached['homepage'] ?? self::HUB_URL,
            'package'     => $cached['download_url'],
        ];

        return $transient;
    }

    // =========================================================================
    // Section 1: Extensions Listing
    // =========================================================================

    /**
     * Get all available extensions from the Hub
     * Endpoint: GET /api/extensions?locale=xx&page=x&per_page=x
     *
     * @param int $page
     * @param int $per_page
     * @return array
     */
    public function getAvailableExtensions(int $page = 1, int $per_page = 12): array
    {
        $locale = $this->getLocale();
        $cache_key = sprintf('jankx_marketplace_extensions_%s_p%d_s%d', $locale, $page, $per_page);
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        $api_url = add_query_arg([
            'locale'   => $locale,
            'page'     => $page,
            'per_page' => $per_page,
        ], $this->buildUrl('api/extensions'));

        $response = wp_remote_get($api_url, [
            'timeout' => 15,
            'headers' => ['Accept' => 'application/json'],
        ]);

        if (is_wp_error($response)) {
            Log::error('Marketplace: Failed to fetch extensions - ' . $response->get_error_message());
            return ['data' => [], 'pagination' => []];
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        if (!is_array($data)) {
            return ['data' => [], 'pagination' => []];
        }

        // The Hub returns { data: [...], pagination: {...} }
        // Ensure we always return this structure for consistency
        if (!isset($data['data'])) {
            $data = [
                'data' => isset($data['extensions']) ? $data['extensions'] : $data,
                'pagination' => [
                    'page' => $page,
                    'per_page' => $per_page,
                    'total' => count(isset($data['extensions']) ? $data['extensions'] : $data),
                    'total_pages' => 1,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ];
        }

        set_transient($cache_key, $data, HOUR_IN_SECONDS);
        return $data;
    }

    // =========================================================================
    // Section 2: Resolve Compatible Version
    // =========================================================================

    /**
     * Resolve the best compatible version for a specific extension
     * Endpoint: GET /api/extensions/{slug}/resolve?jankx_version=&php_version=&locale=
     *
     * @param string $slug Extension slug (e.g. jankx-seo)
     * @return array|\WP_Error
     */
    public function resolveExtension(string $slug)
    {
        $locale = $this->getLocale();
        $cache_key = 'jankx_resolve_' . sanitize_key($slug) . '_' . $locale;
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        $api_url = sprintf(
            '%s/api/extensions/%s/resolve?jankx_version=%s&php_version=%s&locale=%s',
            self::HUB_URL,
            urlencode($slug),
            urlencode($this->getJankxVersion()),
            urlencode(phpversion()),
            urlencode($locale)
        );

        $response = wp_remote_get($api_url, [
            'timeout' => 15,
            'headers' => ['Accept' => 'application/json'],
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($data['error'])) {
            return new \WP_Error('jankx_hub_error', $data['error']);
        }

        // Cache the resolved data for 1 hour
        set_transient($cache_key, $data, HOUR_IN_SECONDS);
        return $data;
    }

    // =========================================================================
    // Section 3: Install Extension
    // =========================================================================

    /**
     * Install an extension from the Hub using resolved download_url
     *
     * @param string $slug
     * @return bool|\WP_Error
     */
    public function installExtension(string $slug)
    {
        $info = $this->resolveExtension($slug);

        if (is_wp_error($info)) {
            return $info;
        }

        if (empty($info['download_url'])) {
            return new \WP_Error('jankx_no_download', "No download URL found for extension: {$slug}");
        }

        return $this->downloadAndInstall($slug, $info['download_url']);
    }

    /**
     * Download ZIP from GitHub Releases and extract to theme's extensions/ dir
     */
    protected function downloadAndInstall(string $slug, string $downloadUrl)
    {
        if (!function_exists('download_url')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        $tmpFile = download_url($downloadUrl);
        if (is_wp_error($tmpFile)) {
            Log::error("Marketplace: Download failed for {$slug} - " . $tmpFile->get_error_message());
            return $tmpFile;
        }

        /** @var ThemeExtensionManager $extensionManager */
        $extensionManager = App::make('theme_extension.manager');
        $targetDir = $extensionManager->getExtensionsDir() . '/' . $slug;

        // Ensure WP_Filesystem is available
        require_once ABSPATH . 'wp-admin/includes/file.php';
        WP_Filesystem();

        if (!is_dir($targetDir)) {
            wp_mkdir_p($targetDir);
        }

        $unzipped = unzip_file($tmpFile, $targetDir);
        @unlink($tmpFile);

        if (is_wp_error($unzipped)) {
            Log::error("Marketplace: Unzip failed for {$slug} - " . $unzipped->get_error_message());
            return $unzipped;
        }

        // Invalidate resolve cache so next check picks up installed version
        delete_transient('jankx_resolve_' . sanitize_key($slug));

        // Try to load the newly installed extension immediately
        $extensionManager->loadExtension($targetDir);

        do_action('jankx/marketplace/extension_installed', $slug, $targetDir);
        return true;
    }

    // =========================================================================
    // Section 4: Theme Core Update Check
    // =========================================================================

    /**
     * Check for a new Jankx theme version from the Hub
     * Endpoint: GET /api/theme/latest
     *
     * NOTE: This method can make a live HTTP call. It should ONLY be called
     * from background contexts (AJAX, WP-Cron), NOT during page rendering.
     * The admin page render uses getCachedThemeUpdate() instead.
     *
     * @return array|false Returns update data if a newer version exists, false otherwise
     */
    public function checkThemeCoreUpdate()
    {
        $cache_key = 'jankx_theme_update_check';

        // NEVER block on live API during a page request.
        // Return only what is already cached.
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            // Return the cached result (array = update available, ['_checked'] = no update)
            return (isset($cached['version'])) ? $cached : false;
        }

        // No cache yet — fetch in background via pseudo-async if possible,
        // or just schedule a refresh for next AJAX call
        wp_schedule_single_event(time(), 'jankx_refresh_theme_update_cache');
        return false;
    }

    /**
     * Actually fetch theme info from Hub (called from WP-Cron or AJAX, NOT main render)
     *
     * @return array|false
     */
    public function fetchThemeCoreUpdate()
    {
        $locale = $this->getLocale();
        $api_url = add_query_arg('locale', $locale, $this->buildUrl('api/theme/latest'));

        $response = wp_remote_get($api_url, [
            'timeout' => 10,
            'headers' => ['Accept' => 'application/json'],
        ]);

        if (is_wp_error($response)) {
            return false;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        if (empty($data['version'])) {
            return false;
        }

        $result = version_compare($data['version'], $this->getJankxVersion(), '>') ? $data : false;

        // Cache regardless — if no update, store a sentinel to avoid repeated checks
        set_transient('jankx_theme_update_check', $result ?: ['_checked' => true], 6 * HOUR_IN_SECONDS);
        return $result;
    }

    /**
     * @deprecated Use checkThemeCoreUpdate() instead - kept for WP update filter compatibility
     */
    public function checkThemeUpdate($transient)
    {
        return $this->injectCachedThemeUpdate($transient);
    }

    //Section 4 Helpers
    // =========================================================================

    /**
     * Get the current user's locale (first part, e.g. 'en', 'vi')
     */
    public function getLocale(): string
    {
        $locale = get_user_locale();
        $parts  = explode('_', $locale);
        return strtolower($parts[0]);
    }

    /**
     * Get current Jankx version
     */
    protected function getJankxVersion(): string
    {
        if ($this->jankxVersion === null) {
            try {
                $this->jankxVersion = App::make('jankx.version') ?? '2.0.0';
            } catch (\Exception $e) {
                $this->jankxVersion = defined('JANKX_VERSION') ? JANKX_VERSION : '2.0.0';
            }
        }
        return $this->jankxVersion;
    }

    /**
     * Build full URL from endpoint path
     */
    protected function buildUrl(string $endpoint): string
    {
        $base = apply_filters('jankx/marketplace/hub_url', self::HUB_URL);
        return rtrim($base, '/') . '/' . ltrim($endpoint, '/');
    }
}
