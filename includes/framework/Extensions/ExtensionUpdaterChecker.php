<?php

namespace Jankx\Extensions;

use Jankx\Facades\App;
use Jankx\Facades\Log;

/**
 * Checks installed extensions against the Jankx Hub for newer versions
 * and injects update data into WordPress's plugin update transient.
 */
class ExtensionUpdaterChecker
{
    const TRANSIENT_PREFIX = 'jankx_ext_update_';
    const CHECK_INTERVAL = 6 * HOUR_IN_SECONDS;

    protected $extensionManager;
    protected $hubUrl = 'https://jankx.pages.dev';

    public function __construct()
    {
        $this->extensionManager = App::make('extension.manager');
    }

    public function register(): void
    {
        // WordPress plugin update filter
        add_filter('pre_set_site_transient_update_plugins', [$this, 'injectUpdates']);

        // Show update notice on extensions page
        add_action('admin_notices', [$this, 'renderUpdateNotices']);

        // Schedule background check on admin_init
        add_action('admin_init', [$this, 'scheduleBackgroundCheck']);

        // Handle manual refresh AJAX
        add_action('wp_ajax_jankx_check_extension_updates', [$this, 'ajaxCheckUpdates']);
    }

    /**
     * Inject cached update data into WordPress plugin update system.
     */
    public function injectUpdates($transient): object
    {
        if (!is_object($transient)) {
            $transient = new \stdClass();
        }

        $updates = $this->getCachedUpdates();

        foreach ($updates as $slug => $updateData) {
            $pluginFile = $this->getExtensionPluginFile($slug);
            if (!$pluginFile) {
                continue;
            }

            $transient->response[$pluginFile] = (object) [
                'new_version' => $updateData['version'],
                'url'         => $updateData['homepage'] ?? '',
                'package'     => $updateData['download_url'] ?? '',
                'slug'        => $slug,
                'name'        => $updateData['name'] ?? $slug,
            ];
        }

        return $transient;
    }

    /**
     * Get the plugin file path used as key in the update transient.
     * Since extensions are not WP plugins, we use a virtual key.
     */
    protected function getExtensionPluginFile(string $slug): ?string
    {
        // Use a virtual plugin file path so WordPress tracks it
        return "jankx-extension-{$slug}/{$slug}.php";
    }

    /**
     * Get cached update results.
     */
    protected function getCachedUpdates(): array
    {
        $cached = get_transient(self::TRANSIENT_PREFIX . 'all');
        return is_array($cached) ? $cached : [];
    }

    /**
     * Schedule a background check if no cache exists.
     */
    public function scheduleBackgroundCheck(): void
    {
        // Only run once per page load
        static $scheduled = false;
        if ($scheduled) {
            return;
        }
        $scheduled = true;

        $cached = get_transient(self::TRANSIENT_PREFIX . 'all');
        if ($cached !== false) {
            return; // Already checked recently
        }

        // Schedule single event to run the check in background
        if (!wp_next_scheduled('jankx_background_extension_update_check')) {
            wp_schedule_single_event(time() + 30, 'jankx_background_extension_update_check');
        }

        add_action('jankx_background_extension_update_check', [$this, 'performCheck']);
    }

    /**
     * Perform the actual update check against Hub API.
     */
    public function performCheck(): void
    {
        $extensions = $this->extensionManager->get_extensions();
        $updates = [];

        foreach ($extensions as $name => $extension) {
            $manifestData = $extension->get_manifest_data();
            $currentVersion = $manifestData['version'] ?? $extension->get_info()['version'] ?? null;

            if (!$currentVersion) {
                continue;
            }

            $extensionId = $manifestData['extension_id'] ?? $name;
            $latestInfo = $this->fetchLatestVersion($extensionId);

            if (!$latestInfo) {
                continue;
            }

            $latestVersion = $latestInfo['version'] ?? null;
            if (!$latestVersion) {
                continue;
            }

            if (version_compare($latestVersion, $currentVersion, '>')) {
                $updates[$extensionId] = array_merge($latestInfo, [
                    'current_version' => $currentVersion,
                    'name'            => $manifestData['name'] ?? $name,
                ]);

                Log::info("Extension update available: {$extensionId} ({$currentVersion} -> {$latestVersion})");
            }
        }

        set_transient(self::TRANSIENT_PREFIX . 'all', $updates, self::CHECK_INTERVAL);
        set_transient(self::TRANSIENT_PREFIX . 'last_check', time(), self::CHECK_INTERVAL);
    }

    /**
     * Fetch latest version info from Hub API.
     */
    protected function fetchLatestVersion(string $extensionId): ?array
    {
        $api_url = "{$this->hubUrl}/api/extensions/{$extensionId}/resolve";
        $api_url = add_query_arg([
            'jankx_version' => $this->extensionManager->get_jankx_version(),
            'php_version'   => PHP_VERSION,
        ], $api_url);

        $response = wp_remote_get($api_url, [
            'timeout'   => 8,
            'sslverify' => false,
        ]);

        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
            return null;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        return is_array($data) ? $data : null;
    }

    /**
     * Render admin notices for available updates on the extensions page.
     */
    public function renderUpdateNotices(): void
    {
        global $pagenow, $submenu_file;

        $isExtensionsPage = ($pagenow === 'admin.php' && isset($_GET['page']) && $_GET['page'] === 'jankx-extensions');
        if (!$isExtensionsPage) {
            return;
        }

        $updates = $this->getCachedUpdates();
        if (empty($updates)) {
            return;
        }

        $count = count($updates);
        $names = array_column($updates, 'name');
        $nameList = implode(', ', array_slice($names, 0, 3));
        if ($count > 3) {
            $nameList .= sprintf(__(' và %d extension khác', 'jankx'), $count - 3);
        }

        echo '<div class="notice notice-info is-dismissible" style="border-left-color: #3b82f6;">';
        echo '<p><strong>' . esc_html__('Có extension mới!', 'jankx') . '</strong> ';
        echo esc_html($nameList);
        echo ' — <a href="' . esc_url(wp_nonce_url(admin_url('admin.php?page=jankx-extensions&action=check_updates'), 'jankx_check_updates')) . '">';
        echo esc_html__('Cập nhật ngay', 'jankx');
        echo '</a></p>';
        echo '</div>';
    }

    /**
     * AJAX handler to manually trigger update check.
     */
    public function ajaxCheckUpdates(): void
    {
        check_ajax_referer('jankx_check_updates');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        // Clear cache and re-check
        delete_transient(self::TRANSIENT_PREFIX . 'all');
        $this->performCheck();

        $updates = $this->getCachedUpdates();
        wp_send_json_success([
            'count'   => count($updates),
            'updates' => $updates,
        ]);
    }

    /**
     * Get number of available updates.
     */
    public function getUpdateCount(): int
    {
        $updates = $this->getCachedUpdates();
        return count($updates);
    }

    /**
     * Check if a specific extension has an update.
     */
    public function hasUpdate(string $extensionId): bool
    {
        $updates = $this->getCachedUpdates();
        return isset($updates[$extensionId]);
    }

    /**
     * Get update info for a specific extension.
     */
    public function getUpdateInfo(string $extensionId): ?array
    {
        $updates = $this->getCachedUpdates();
        return $updates[$extensionId] ?? null;
    }
}
