<?php

namespace App\Services;

class MembershipBundleService
{
    const API_URL = 'https://jankx.com/api/membership/bundles';

    public function __construct()
    {
    }

    public function getBundles(): array
    {
        $bundles = \apply_filters('jankx/membership/bundles', []);

        $localPath = \get_template_directory() . '/config/bundles.php';
        if (\file_exists($localPath)) {
            $local = include $localPath;
            if (\is_array($local)) {
                $bundles = \array_merge($bundles, $local);
            }
        }

        $bundles = $this->enrichWithApiData($bundles);

        return $bundles;
    }

    protected function enrichWithApiData(array $bundles): array
    {
        $cached = \get_transient('jankx_membership_bundles');
        if ($cached !== false && \is_array($cached)) {
            return \array_merge($bundles, $cached);
        }

        $response = \wp_remote_get(self::API_URL, [
            'timeout' => 10,
        ]);

        if (!\is_wp_error($response) && \wp_remote_retrieve_response_code($response) === 200) {
            $body = \json_decode(\wp_remote_retrieve_body($response), true);
            if (!empty($body['data']) && \is_array($body['data'])) {
                \set_transient('jankx_membership_bundles', $body['data'], 6 * HOUR_IN_SECONDS);
                return \array_merge($bundles, $body['data']);
            }
        }

        return $bundles;
    }

    public function installBundle(string $bundleId, string &$error = ''): bool
    {
        $bundles = $this->getBundles();
        if (!isset($bundles[$bundleId])) {
            $error = \__('Bundle not found.', 'jankx');
            return false;
        }

        $bundle = $bundles[$bundleId];

        try {
            $this->installRequiredPlugins($bundle['required_plugins'] ?? []);
            $this->installRequiredExtensions($bundle['required_extensions'] ?? []);
            $this->importDemoData($bundle['demo_package'] ?? $bundleId);
            $this->applyThemeOptions($bundle['theme_options_preset'] ?? '');
            $this->setupPages($bundle['page_setup'] ?? []);
            $this->setActiveBundle($bundleId);

            \do_action('jankx/membership/bundle_installed', $bundleId, $bundle);

            return true;
        } catch (\Throwable $e) {
            $error = $e->getMessage();
            return false;
        }
    }

    protected function installRequiredPlugins(array $plugins): void
    {
        if (empty($plugins)) {
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        foreach ($plugins as $pluginSlug) {
            if (\is_plugin_active($pluginSlug . '/' . $pluginSlug . '.php')) {
                continue;
            }

            $api = \plugins_api('plugin_information', [
                'slug' => $pluginSlug,
                'fields' => ['short_description' => false],
            ]);

            if (\is_wp_error($api)) {
                continue;
            }

            $upgrader = new \Plugin_Upgrader(new \WP_Ajax_Upgrader_Skin());
            $result = $upgrader->install($api->download_link);

            if ($result && !\is_wp_error($result)) {
                \activate_plugin($pluginSlug . '/' . $pluginSlug . '.php');
            }
        }
    }

    protected function installRequiredExtensions(array $extensions): void
    {
        if (empty($extensions)) {
            return;
        }

        $marketplace = null;
        try {
            $app = \Jankx\Foundation\Application::getInstance();
            $marketplace = $app->make('extension.marketplace');
        } catch (\Throwable $e) {
            return;
        }

        foreach ($extensions as $slug) {
            try {
                $marketplace->installExtension($slug);
            } catch (\Throwable $e) {
                continue;
            }
        }
    }

    protected function importDemoData(string $demoId): void
    {
        $app = \Jankx\Foundation\Application::getInstance();

        try {
            $provider = new \App\Providers\DemoImportServiceProvider($app);
            $ref = new \ReflectionMethod($provider, 'runSeedersForDemo');
            $ref->setAccessible(true);
            $ref->invoke($provider, $demoId);

            \update_option('jankx_active_demo', $demoId);
            \update_option('jankx_demo_imported_at', \current_time('mysql'));
        } catch (\Throwable $e) {
            throw new \RuntimeException(
                \sprintf(\__('Demo import failed: %s', 'jankx'), $e->getMessage())
            );
        }
    }

    protected function applyThemeOptions(string $preset): void
    {
        if (empty($preset)) {
            return;
        }

        $path = \get_template_directory() . '/config/presets/' . $preset . '.php';
        if (\file_exists($path)) {
            $options = include $path;
            if (\is_array($options)) {
                foreach ($options as $key => $value) {
                    \update_option($key, $value);
                }
            }
        }
    }

    protected function setupPages(array $pageSetup): void
    {
        if (empty($pageSetup)) {
            return;
        }

        if (!empty($pageSetup['homepage'])) {
            $page = \get_page_by_path($pageSetup['homepage']);
            if ($page) {
                \update_option('page_on_front', $page->ID);
                \update_option('show_on_front', 'page');
            }
        }

        if (!empty($pageSetup['blog'])) {
            $page = \get_page_by_path($pageSetup['blog']);
            if ($page) {
                \update_option('page_for_posts', $page->ID);
            }
        }

        if (!empty($pageSetup['menu_location'])) {
            $locations = \get_theme_mod('nav_menu_locations', []);
            foreach ($pageSetup['menu_location'] as $location => $menuName) {
                $menu = \wp_get_nav_menu_object($menuName);
                if ($menu) {
                    $locations[$location] = $menu->term_id;
                }
            }
            \set_theme_mod('nav_menu_locations', $locations);
        }
    }

    public function setActiveBundle(string $bundleId): void
    {
        \update_option('jankx_active_bundle', $bundleId);
        \update_option('jankx_bundle_installed_at', \current_time('mysql'));
    }

    public function getActiveBundle(): string
    {
        return \get_option('jankx_active_bundle', '');
    }

    public function resetBundle(string $bundleId): void
    {
        $this->rollbackDemoData($bundleId);
        \delete_option('jankx_active_bundle');
        \delete_option('jankx_bundle_installed_at');
    }

    protected function rollbackDemoData(string $demoId): void
    {
        $app = \Jankx\Foundation\Application::getInstance();

        try {
            $provider = new \App\Providers\DemoImportServiceProvider($app);
            $ref = new \ReflectionMethod($provider, 'rollbackSeedersForDemo');
            $ref->setAccessible(true);
            $ref->invoke($provider, $demoId);

            \delete_option('jankx_active_demo');
            \delete_option('jankx_demo_imported_at');
        } catch (\Throwable $e) {
        }
    }
}
