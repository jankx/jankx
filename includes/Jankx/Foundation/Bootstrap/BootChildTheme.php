<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;
use Jankx\Facades\Log;

/**
 * Bootstrap Child Theme Composer Autoloader
 *
 * Loads composer autoloader from child theme if composer.json and vendor directory exist.
 * This allows child themes to have their own dependencies and autoloading.
 */
class BootChildTheme
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        if (Environment::isDebugLog()) {
        }

        $childThemePath = get_stylesheet_directory();
        $composerJsonPath = $childThemePath . '/composer.json';
        $vendorPath = $childThemePath . '/vendor';

        // Check if child theme has composer.json and vendor directory
        if (!$this->shouldLoadChildThemeComposer($composerJsonPath, $vendorPath)) {
            if (Environment::isDebugLog()) {
            }
            return;
        }

        $this->loadChildThemeComposer($childThemePath, $composerJsonPath, $vendorPath);
    }

    /**
     * Check if child theme composer should be loaded
     *
     * @param string $composerJsonPath
     * @param string $vendorPath
     * @return bool
     */
    protected function shouldLoadChildThemeComposer($composerJsonPath, $vendorPath)
    {
        // Check if we're using a child theme
        if (get_template_directory() === get_stylesheet_directory()) {
            return false;
        }

        // Check if composer.json exists
        if (!file_exists($composerJsonPath)) {
            return false;
        }

        // Check if vendor directory exists
        if (!is_dir($vendorPath)) {
            return false;
        }

        // Check if autoload.php exists in vendor
        $autoloadPath = $vendorPath . '/autoload.php';
        if (!file_exists($autoloadPath)) {
            return false;
        }

        return true;
    }

    /**
     * Load child theme composer autoloader
     *
     * @param string $childThemePath
     * @param string $composerJsonPath
     * @param string $vendorPath
     * @return void
     */
    protected function loadChildThemeComposer($childThemePath, $composerJsonPath, $vendorPath)
    {
        try {
            // Load composer autoloader
            $autoloadPath = $vendorPath . '/autoload.php';
            require_once $autoloadPath;

            if (Environment::isDebugLog()) {
                                    'child_theme_path' => $childThemePath,
                    'composer_json' => $composerJsonPath,
                    'vendor_path' => $vendorPath
                ]);
            }

            // Register child theme composer info with application
            $this->registerChildThemeComposerInfo($childThemePath, $composerJsonPath);
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error('Failed to load child theme composer autoloader', [
                    'error' => $e->getMessage(),
                    'child_theme_path' => $childThemePath,
                    'composer_json' => $composerJsonPath,
                    'vendor_path' => $vendorPath
                ]);
            }
        }
    }

    /**
     * Register child theme composer information with application
     *
     * @param string $childThemePath
     * @param string $composerJsonPath
     * @return void
     */
    protected function registerChildThemeComposerInfo($childThemePath, $composerJsonPath)
    {
        try {
            // Read composer.json to get package information
            $composerData = json_decode(file_get_contents($composerJsonPath), true);

            if ($composerData) {
                $packageInfo = [
                    'name' => $composerData['name'] ?? 'unknown/child-theme',
                    'version' => $composerData['version'] ?? '1.0.0',
                    'description' => $composerData['description'] ?? '',
                    'authors' => $composerData['authors'] ?? [],
                    'require' => $composerData['require'] ?? [],
                    'require-dev' => $composerData['require-dev'] ?? [],
                    'autoload' => $composerData['autoload'] ?? [],
                    'autoload-dev' => $composerData['autoload-dev'] ?? [],
                    'child_theme_path' => $childThemePath,
                    'composer_json_path' => $composerJsonPath,
                    'vendor_path' => $childThemePath . '/vendor'
                ];

                // Store in application for later use
                if (function_exists('jankx_app')) {
                    $app = jankx_app();
                    if ($app) {
                        $app->singleton('child_theme.composer', function () use ($packageInfo) {
                            return $packageInfo;
                        });

                        if (Environment::isDebugLog()) {
                                                            'package_name' => $packageInfo['name'],
                                'version' => $packageInfo['version'],
                                'autoload_psr4' => $packageInfo['autoload']['psr-4'] ?? [],
                                'autoload_files' => $packageInfo['autoload']['files'] ?? []
                            ]);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error('Failed to parse child theme composer.json', [
                    'error' => $e->getMessage(),
                    'composer_json_path' => $composerJsonPath
                ]);
            }
        }
    }

    /**
     * Get child theme composer information
     *
     * @return array|null
     */
    public static function getChildThemeComposerInfo()
    {
        if (!function_exists('jankx_app')) {
            return null;
        }

        $app = jankx_app();
        if (!$app) {
            return null;
        }

        try {
            return $app->make('child_theme.composer');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if child theme has composer dependencies
     *
     * @return bool
     */
    public static function hasChildThemeComposer()
    {
        $childThemePath = get_stylesheet_directory();
        $composerJsonPath = $childThemePath . '/composer.json';
        $vendorPath = $childThemePath . '/vendor';

        return file_exists($composerJsonPath) &&
               is_dir($vendorPath) &&
               file_exists($vendorPath . '/autoload.php');
    }

    /**
     * Get child theme vendor path
     *
     * @return string|null
     */
    public static function getChildThemeVendorPath()
    {
        if (!self::hasChildThemeComposer()) {
            return null;
        }

        return get_stylesheet_directory() . '/vendor';
    }

    /**
     * Get child theme composer.json path
     *
     * @return string|null
     */
    public static function getChildThemeComposerJsonPath()
    {
        if (!self::hasChildThemeComposer()) {
            return null;
        }

        return get_stylesheet_directory() . '/composer.json';
    }
}
