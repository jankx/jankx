<?php
/**
 * Theme Extension Manager for Jankx Theme Framework
 *
 * This system allows installing and loading extensions specifically
 * for the currently active theme (parent or child).
 *
 * @package Jankx\Extensions
 * @since 2.0.0
 */

namespace Jankx\Extensions;

use Jankx\Facades\Log;

class ThemeExtensionManager
{
    /**
     * @var ThemeExtensionManager
     */
    private static $instance = null;

    /**
     * @var array
     */
    protected $extensions = [];

    /**
     * Registry of extensions that are disabled (enabled=false) — stores manifest path + data.
     * @var array
     */
    protected $disabledManifests = [];

    /**
     * Constructor
     */
    private function __construct()
    {
        $this->init();
    }

    /**
     * Get singleton instance
     *
     * @return ThemeExtensionManager
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initialize the extension system
     */
    protected function init()
    {
        // Phase 1: Immediate/Context-based loading (early)
        add_action('after_setup_theme', [$this, 'loadActiveThemeExtensions'], 15);

        // Phase 2: Late loading for conditional extensions (after WP query is parsed)
        add_action('wp', [$this, 'loadConditionalExtensions']);
    }

    /**
     * List of extensions to be loaded late
     * @var array
     */
    protected $lateLoadQueue = [];

    /**
     * Get the active theme's extensions directory
     *
     * @param bool $create Whether to create the directory if it doesn't exist
     * @return string
     */
    public function getExtensionsDir(bool $create = false): string
    {
        $dir = get_stylesheet_directory() . '/extensions';
        if ($create && !is_dir($dir)) {
            wp_mkdir_p($dir);
        }
        return $dir;
    }

    /**
     * Get the active theme's extensions URL
     *
     * @return string
     */
    public function getExtensionsUrl(): string
    {
        return get_stylesheet_directory_uri() . '/extensions';
    }

    /**
     * Load all extensions from the active theme's directory
     */
    public function loadActiveThemeExtensions()
    {
        // 1. Scan Parent Theme extensions
        $parentExtensionsDir = get_template_directory() . '/extensions';
        if (is_dir($parentExtensionsDir)) {
            $parentDirs = glob($parentExtensionsDir . '/*', GLOB_ONLYDIR);
            foreach ($parentDirs as $dir) {
                $this->loadExtension($dir);
            }
        }

        // 2. Scan Child Theme extensions (if active)
        if (is_child_theme()) {
            $childExtensionsDir = get_stylesheet_directory() . '/extensions';
            if (is_dir($childExtensionsDir) && $childExtensionsDir !== $parentExtensionsDir) {
                $childDirs = glob($childExtensionsDir . '/*', GLOB_ONLYDIR);
                foreach ($childDirs as $dir) {
                    $this->loadExtension($dir);
                }
            }
        }
    }

    /**
     * Load a specific extension from a directory
     *
     * @param string $extensionDir
     * @return bool
     */
    public function loadExtension(string $extensionDir): bool
    {
        $extensionName = basename($extensionDir);
        $manifestFile = $extensionDir . '/manifest.json';

        if (!file_exists($manifestFile)) {
            return false;
        }

        $manifestData = json_decode(file_get_contents($manifestFile), true);
        if (!$manifestData || !isset($manifestData['caller'])) {
            return false;
        }

        // If 'enabled' is explicitly false, skip completely — don't instantiate
        if (isset($manifestData['enabled']) && $manifestData['enabled'] === false) {
            // Track it so toggle AJAX can re-enable it later
            $this->disabledManifests[$extensionName] = [
                'dir'      => $extensionDir,
                'manifest' => $manifestData,
                'path'     => $manifestFile,
            ];
            return false;
        }

        // SMART LOADING: Check if we should load this extension in current context
        $loadDecision = $this->shouldLoadInCurrentContext($extensionName, $manifestData);
        
        if ($loadDecision === 'late') {
            $this->lateLoadQueue[$extensionName] = [
                'dir'      => $extensionDir,
                'manifest' => $manifestData
            ];
            return false;
        }

        if ($loadDecision === false) {
            return false;
        }

        // Check if extension with this name already loaded to support overriding
        if (isset($this->extensions[$extensionName])) {
            return true;
        }

        return $this->executeExtensionLoad($extensionName, $extensionDir, $manifestData);
    }

    /**
     * Execute the actual loading of an extension
     */
    protected function executeExtensionLoad(string $name, string $dir, array $manifest): bool
    {
        // Check dependencies first
        if (isset($manifest['dependencies'])) {
            if (!$this->checkDependencies($manifest['dependencies'])) {
                Log::warning("Extension {$name} skipped: Missing dependencies.");
                return false;
            }
        }

        $caller = $manifest['caller'];
        $callerFile = $dir . '/' . $caller['file'];

        if (!file_exists($callerFile)) {
            Log::warning("Extension caller file not found: {$callerFile}");
            return false;
        }

        // Load vendor/autoload.php
        $vendorAutoload = $dir . '/vendor/autoload.php';
        if (file_exists($vendorAutoload)) {
            require_once $vendorAutoload;
        }

        require_once $callerFile;

        $className = $caller['class'];
        if (class_exists($className)) {
            try {
                $extension = new $className();
                if ($extension instanceof AbstractExtension) {
                    $extension->set_extension_path($dir);
                    $extension->set_extension_url($this->getExtensionsUrl() . '/' . $name);
                    $extension->set_manifest_data($manifest);

                    $this->extensions[$name] = $extension;

                    // SYNC with global ExtensionManager so it shows up in UI
                    try {
                        $globalManager = \Jankx\Facades\App::make('extension.manager');
                        if ($globalManager) {
                            $globalManager->add_extension($name, $extension);
                            $extensionId = $manifest['extension_id'] ?? $name;
                            $globalManager->set_extension_id($extensionId, $dir);
                        }
                    } catch (\Exception $e) {
                        // Global manager might not be ready yet
                    }

                    // Check if we should actually activate (run hooks)
                    // 'enabled' = user's toggle state; 'auto_activate' = default boot intent
                    $isEnabled = isset($manifest['enabled'])
                        ? (bool)$manifest['enabled']
                        : (isset($manifest['auto_activate']) ? (bool)$manifest['auto_activate'] : false);
                    if ($isEnabled) {
                        if (isset($caller['method']) && method_exists($extension, $caller['method'])) {
                            $extension->{$caller['method']}($caller['args'] ?? []);
                        }
                        $extension->activate();
                    } else {
                        $extension->deactivate();
                    }

                    do_action('jankx/theme_extension/loaded', $name, $extension);
                    return true;
                }
            } catch (\Exception $e) {
                Log::error("Failed to initialize extension {$name}: " . $e->getMessage());
            }
        }
        return false;
    }

    /**
     * Load extensions that were queued for late loading
     */
    public function loadConditionalExtensions()
    {
        foreach ($this->lateLoadQueue as $name => $data) {
            if ($this->evaluateConditions($data['manifest']['conditions'] ?? [])) {
                $this->executeExtensionLoad($name, $data['dir'], $data['manifest']);
            }
        }
        $this->lateLoadQueue = []; // Clear queue
    }

    /**
     * Check if dependencies are met
     */
    protected function checkDependencies(array $dependencies): bool
    {
        foreach ($dependencies as $type => $value) {
            if ($type === 'extensions') {
                foreach ((array)$value as $reqExt) {
                    if (!isset($this->extensions[$reqExt])) return false;
                }
            }
            if ($type === 'php') {
                if (version_compare(PHP_VERSION, $value, '<')) return false;
            }
        }
        return true;
    }

    /**
     * Check if extension should be loaded in current request context
     * 
     * @return bool|string Returns true to load, false to skip, and 'late' to queue for conditional load
     */
    protected function shouldLoadInCurrentContext(string $name, array $manifest)
    {
        // 1. Queue for late load if there are conditional logic
        if (isset($manifest['conditions']) && !is_admin()) {
            return 'late';
        }

        // 3. Check context (admin, frontend, ajax, rest)
        if (isset($manifest['context'])) {
            $context = (array) $manifest['context'];
            $is_match = false;

            if (in_array('admin', $context) && is_admin() && !wp_doing_ajax()) $is_match = true;
            if (in_array('frontend', $context) && !is_admin()) $is_match = true;
            if (in_array('ajax', $context) && wp_doing_ajax()) $is_match = true;
            if (in_array('rest', $context) && defined('REST_REQUEST')) $is_match = true;
            if (in_array('always', $context)) $is_match = true;

            if (!$is_match) return false;
        }

        return apply_filters('jankx/theme_extension/should_load', true, $name, $manifest);
    }

    /**
     * Evaluate complex conditions from manifest
     */
    protected function evaluateConditions(array $conditions): bool
    {
        foreach ($conditions as $type => $value) {
            switch ($type) {
                case 'post_type':
                    if (is_admin()) break; // Skip on admin
                    return is_singular($value);
                case 'is_page':
                    if (is_admin()) break;
                    return is_page($value);
                case 'capability':
                    return current_user_can($value);
            }
        }
        return true;
    }

    /**
     * Install an extension to the active theme
     *
     * @param string $extensionId Unique identifier for the extension
     * @param string $sourcePath Path to the extension source
     * @return bool
     */
    public function installExtension(string $extensionId, string $sourcePath): bool
    {
        if (!is_dir($sourcePath)) {
            return false;
        }

        // Ensure extensions dir exists when actually installing
        $targetDir = $this->getExtensionsDir(true) . '/' . $extensionId;
        
        if (is_dir($targetDir)) {
            return true;
        }

        if ($this->copyDirectory($sourcePath, $targetDir)) {
            do_action('jankx/theme_extension/installed', $extensionId, $targetDir);
            $this->loadExtension($targetDir);
            return true;
        }

        return false;
    }

    /**
     * Helper to copy directory recursively
     */
    private function copyDirectory(string $source, string $destination): bool
    {
        if (!is_dir($source)) {
            return false;
        }

        if (!is_dir($destination)) {
            wp_mkdir_p($destination);
        }

        $files = scandir($source);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $sourcePath = $source . '/' . $file;
            $destPath = $destination . '/' . $file;

            if (is_dir($sourcePath)) {
                if (!$this->copyDirectory($sourcePath, $destPath)) {
                    return false;
                }
            } else {
                if (!copy($sourcePath, $destPath)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get all loaded theme extensions
     *
     * @return array
     */
    public function getExtensions(): array
    {
        return $this->extensions;
    }

    /**
     * Get disabled extension manifests (enabled=false)
     *
     * @return array  [ extensionName => ['dir'=>..., 'manifest'=>..., 'path'=>...] ]
     */
    public function getDisabledManifests(): array
    {
        return $this->disabledManifests;
    }
}
