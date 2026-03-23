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

use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Facades\App;

class MarketplaceManager
{
    /**
     * Hub Base URL (Free)
     * @var string
     */
    const FREE_HUB_URL = 'https://jankx.pages.dev';

    /**
     * Hub Base URL (Purchase)
     * @var string
     */
    const PURCHASE_HUB_URL = 'https://optilarity.top';

    /**
     * Default Hub Base URL
     */
    const HUB_URL = self::FREE_HUB_URL;

    /**
     * @var Application
     */
    protected $app;

    /**
     * Cached Jankx version to avoid multiple lookups
     * @var string|null
     */
    protected $jankxVersion = null;

    /**
     * Constructor
     * 
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;

        // Register hooks immediately to catch activation events
        $this->registerHooks();
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

        // Ping Hub on activation
        add_action('after_switch_theme', [$this, 'pingHub']);

        // Periodic ping (weekly check)
        if (!get_transient('jankx_theme_pinged')) {
            add_action('admin_init', [$this, 'pingHub']);
        }
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
     * Download ZIP and extract intelligently to the extensions directory
     */
    protected function downloadAndInstall(string $slug, string $downloadUrl)
    {
        global $wp_filesystem;

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
        $extensionsParentDir = $extensionManager->getExtensionsDir(true);
        $finalTargetDir = $extensionsParentDir . '/' . $slug;

        // Ensure WP_Filesystem is available
        require_once ABSPATH . 'wp-admin/includes/file.php';
        if (empty($wp_filesystem)) {
            WP_Filesystem();
        }

        // Create a unique temporary directory for extraction
        $tempExtractDir = $extensionsParentDir . '/tmp_' . $slug . '_' . time();
        if (!$wp_filesystem->mkdir($tempExtractDir)) {
            @unlink($tmpFile);
            return new \WP_Error('jankx_temp_dir_failed', 'Failed to create temporary extraction directory.');
        }

        $unzipped = unzip_file($tmpFile, $tempExtractDir);
        @unlink($tmpFile);

        if (is_wp_error($unzipped)) {
            $wp_filesystem->delete($tempExtractDir, true);
            Log::error("Marketplace: Unzip failed for {$slug} - " . $unzipped->get_error_message());
            return $unzipped;
        }

        // Search for manifest.json recursively within the temp directory
        $manifestDir = $this->findManifestDirectory($tempExtractDir);
        if (!$manifestDir) {
            $wp_filesystem->delete($tempExtractDir, true);
            return new \WP_Error('jankx_no_manifest', 'Could not find manifest.json in the extension package.');
        }

        // Ensure final target directory is empty
        if ($wp_filesystem->exists($finalTargetDir)) {
            $wp_filesystem->delete($finalTargetDir, true);
        }

        // Move the correct content directory to final destination
        $moved = $wp_filesystem->move($manifestDir, $finalTargetDir, true);

        // Cleanup temp extraction directory
        $wp_filesystem->delete($tempExtractDir, true);

        if (!$moved) {
            return new \WP_Error('jankx_move_failed', 'Failed to move extension files to destination.');
        }

        // Invalidate resolve cache
        delete_transient('jankx_resolve_' . sanitize_key($slug));

        // Load the extension immediately
        $extensionManager->loadExtension($finalTargetDir);

        do_action('jankx/marketplace/extension_installed', $slug, $finalTargetDir);
        return true;
    }

    /**
     * Find the directory containing manifest.json within a path
     *
     * @param string $path
     * @return string|false
     */
    protected function findManifestDirectory(string $path)
    {
        global $wp_filesystem;

        $dirList = $wp_filesystem->dirlist($path);
        if (empty($dirList)) {
            return false;
        }

        // 1. Check current level
        if (isset($dirList['manifest.json'])) {
            return $path;
        }

        // 2. Check depth-first subdirectories (excluding __MACOSX)
        foreach ($dirList as $item) {
            if ($item['type'] === 'd' && $item['name'] !== '__MACOSX') {
                $found = $this->findManifestDirectory($path . '/' . $item['name']);
                if ($found) {
                    return $found;
                }
            }
        }

        return false;
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
        $api_url = add_query_arg('locale', $locale, $this->buildUrl('api/theme/latest', 'purchase'));

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

    /**
     * Send heartbeat to Hub (activation + periodic)
     * Endpoint: POST /api/theme/ping
     */
    public function pingHub()
    {
        $domain = home_url();
        $host   = parse_url($domain, PHP_URL_HOST);

        // Define local/development domain patterns
        $local_patterns = [
            'localhost',
            '127.0.0.1',
            '::1',
        ];

        // Check for common local TLDs
        $is_local = false;
        foreach ($local_patterns as $pattern) {
            if ($host === $pattern) {
                $is_local = true;
                break;
            }
        }

        if (!$is_local && (strpos($host, '.local') !== false || strpos($host, '.test') !== false)) {
            $is_local = true;
        }

        // Apply filter to allow customization or manual override
        if (apply_filters('jankx/marketplace/skip_ping', $is_local, $host)) {
            Log::debug(sprintf('Marketplace: Skipping ping for local domain: %s', $host));
            return;
        }

        $api_url = $this->buildUrl('api/theme/ping', 'purchase');
        
        $response = wp_remote_post($api_url, [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json'
            ],
            'body'    => wp_json_encode([
                'domain'      => $domain,
                'version'     => $this->getJankxVersion(),
                'wp_version'  => get_bloginfo('version'),
                'php_version' => PHP_VERSION,
                'locale'      => get_locale(),
            ]),
        ]);

        if (is_wp_error($response)) {
            Log::debug('Marketplace: Ping failed - ' . $response->get_error_message());
        } else {
            // Set transient to avoid over-pinging (weekly)
            set_transient('jankx_theme_pinged', time(), WEEK_IN_SECONDS);
        }
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
                $this->jankxVersion = $this->app->make('jankx.version') ?? '2.0.0';
            } catch (\Exception $e) {
                $this->jankxVersion = defined('JANKX_VERSION') ? JANKX_VERSION : '2.0.0';
            }
        }
        return $this->jankxVersion;
    }

    /**
     * Build full URL from endpoint path
     */
    protected function buildUrl(string $endpoint, $hubType = 'free'): string
    {
        $base = ($hubType === 'purchase') ? self::PURCHASE_HUB_URL : self::FREE_HUB_URL;
        $base = apply_filters("jankx/marketplace/{$hubType}_hub_url", $base);
        return rtrim($base, '/') . '/' . ltrim($endpoint, '/');
    }
}
