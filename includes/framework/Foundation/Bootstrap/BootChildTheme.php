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
        $childThemePath = get_stylesheet_directory();
        $composerJsonPath = $childThemePath . '/composer.json';
        $vendorPath = $childThemePath . '/vendor';

        // Check if child theme has composer.json and vendor directory
        if (!$this->shouldLoadChildThemeComposer($composerJsonPath, $vendorPath)) {
            return;
        }

        $this->loadChildThemeComposer($childThemePath, $composerJsonPath, $vendorPath);

        // Defer loading child theme translations until after theme setup
        // to ensure text domains and locale are initialized properly
        add_action('after_setup_theme', function () use ($childThemePath) {
            $this->loadChildThemeTranslations($childThemePath);
        }, 5);
    }

    /**
     * Load child theme translations
     *
     * @param string $childThemePath
     * @return void
     */
    protected function loadChildThemeTranslations($childThemePath)
    {
        try {
            // Get text domain from style.css
            $textDomain = $this->getChildThemeTextDomain($childThemePath);

            if (!$textDomain) {
                if (Environment::isDebugLog()) {
                    Log::warning('No text domain found in child theme style.css', [
                        'child_theme_path' => $childThemePath
                    ]);
                }
                return;
            }

            // Load text domain
            $languagesPath = $childThemePath . '/languages';

            if (is_dir($languagesPath)) {
                load_child_theme_textdomain($textDomain, $languagesPath);

                // Manual load MO file if automatic loading fails
                $this->ensureTranslationLoaded($textDomain, $languagesPath);
            } else {
                if (Environment::isDebugLog()) {
                    Log::warning('Child theme languages directory not found', [
                        'text_domain' => $textDomain,
                        'languages_path' => $languagesPath,
                        'child_theme_path' => $childThemePath
                    ]);
                }
            }

            // Register child theme translation info with application
            $this->registerChildThemeTranslationInfo($textDomain, $languagesPath);
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error('Failed to load child theme translations', [
                    'error' => $e->getMessage(),
                    'child_theme_path' => $childThemePath
                ]);
            }
        }
    }

    /**
     * Ensure translation is loaded by manually loading MO file if needed
     *
     * @param string $textDomain
     * @param string $languagesPath
     * @return void
     */
    protected function ensureTranslationLoaded($textDomain, $languagesPath)
    {
        global $l10n;

        // Check if text domain is loaded and has entries
        if (!isset($l10n[$textDomain]) || count($l10n[$textDomain]->entries) === 0) {
            $locale = get_locale();
            $moFile = $languagesPath . '/' . $textDomain . '-' . $locale . '.mo';

            if (file_exists($moFile)) {
                $mo = new \MO();
                $mo->import_from_file($moFile);
                $l10n[$textDomain] = $mo;
            }
        }
    }

    /**
     * Get text domain from child theme style.css
     *
     * @param string $childThemePath
     * @return string|null
     */
    protected function getChildThemeTextDomain($childThemePath)
    {
        $styleCssPath = $childThemePath . '/style.css';

        if (!file_exists($styleCssPath)) {
            return null;
        }

        $styleCssContent = file_get_contents($styleCssPath);

        // Look for Text Domain: in the header
        if (preg_match('/Text Domain:\s*([^\r\n]+)/i', $styleCssContent, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    /**
     * Register child theme translation information with application
     *
     * @param string $textDomain
     * @param string $languagesPath
     * @return void
     */
    protected function registerChildThemeTranslationInfo($textDomain, $languagesPath)
    {
        try {
            $translationInfo = [
                'text_domain' => $textDomain,
                'languages_path' => $languagesPath,
                'child_theme_path' => get_stylesheet_directory(),
                'locale' => get_locale(),
                'is_rtl' => is_rtl(),
                'available_files' => $this->getAvailableTranslationFiles($languagesPath, $textDomain)
            ];

            // Store in application for later use
            $app = Application::getInstance();
            if ($app) {
                $app->singleton('child_theme.translations', function () use ($translationInfo) {
                    return $translationInfo;
                });
            }
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error('Failed to register child theme translation info', [
                    'error' => $e->getMessage(),
                    'text_domain' => $textDomain
                ]);
            }
        }
    }

    /**
     * Get available translation files
     *
     * @param string $languagesPath
     * @param string $textDomain
     * @return array
     */
    protected function getAvailableTranslationFiles($languagesPath, $textDomain)
    {
        $files = [];

        if (!is_dir($languagesPath)) {
            return $files;
        }

        $locale = get_locale();
        $filePatterns = [
            "{$textDomain}-{$locale}.mo",
            "{$textDomain}-{$locale}.po",
            "{$textDomain}-{$locale}.json",
            "{$textDomain}.pot"
        ];

        foreach ($filePatterns as $pattern) {
            $filePath = $languagesPath . '/' . $pattern;
            if (file_exists($filePath)) {
                $files[] = [
                    'name' => $pattern,
                    'path' => $filePath,
                    'size' => filesize($filePath),
                    'modified' => filemtime($filePath)
                ];
            }
        }

        return $files;
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
            // Register child theme composer info with application
            $this->registerChildThemeComposerInfo($childThemePath, $composerJsonPath);
        } catch (\Exception $e) {
            Log::error('Failed to load child theme composer autoloader', [
                'error' => $e->getMessage(),
                'child_theme_path' => $childThemePath,
                'composer_json' => $composerJsonPath,
                'vendor_path' => $vendorPath
            ]);
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
                $app = Application::getInstance();
                if ($app) {
                    $app->singleton('child_theme.composer', function () use ($packageInfo) {
                        return $packageInfo;
                    });
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

        $app = Jankx\Facades\App::getInstance();
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
     * Get child theme translation information
     *
     * @return array|null
     */
    public static function getChildThemeTranslationInfo()
    {
        $app = Jankx\Facades\App::getInstance();
        if (!$app) {
            return null;
        }

        try {
            return $app->make('child_theme.translations');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get child theme text domain from application
     *
     * @return string|null
     */
    public static function getChildThemeTextDomainFromApp()
    {
        $translationInfo = self::getChildThemeTranslationInfo();
        return $translationInfo['text_domain'] ?? null;
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
     * Check if child theme has translations
     *
     * @return bool
     */
    public static function hasChildThemeTranslations()
    {
        $translationInfo = self::getChildThemeTranslationInfo();
        return !empty($translationInfo);
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

    /**
     * Get child theme languages path
     *
     * @return string|null
     */
    public static function getChildThemeLanguagesPath()
    {
        $translationInfo = self::getChildThemeTranslationInfo();
        return $translationInfo['languages_path'] ?? null;
    }
}
