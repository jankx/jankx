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
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $extensions = [];

    /**
     * Resolved priorities: [dir => ['name'=>..,'level'=>..,'pos'=>..,'priority'=>..]]
     *
     * @var array
     */
    protected $resolvedPriorities = [];

    /**
     * Registry of extensions that are disabled (enabled=false) — stores manifest path + data.
     * @var array
     */
    protected $disabledManifests = [];

    /**
     * Constructor
     * 
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(\Jankx\Foundation\Application $app)
    {
        $this->app = $app;
        $this->init();
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
        $cacheKey = 'jankx_extensions_dirs_' . get_stylesheet();
        $extensionDirs = get_transient($cacheKey);

        if ($extensionDirs === false || (defined('WP_DEBUG') && WP_DEBUG)) {
            $extensionDirs = [];

            // 1. Scan Parent Theme extensions
            $parentExtensionsDir = get_template_directory() . '/extensions';
            if (is_dir($parentExtensionsDir)) {
                $parentDirs = glob($parentExtensionsDir . '/*', GLOB_ONLYDIR);
                if ($parentDirs) {
                    $extensionDirs = array_merge($extensionDirs, $parentDirs);
                }
            }

            // 2. Scan Child Theme extensions (if active)
            if (is_child_theme()) {
                $childExtensionsDir = get_stylesheet_directory() . '/extensions';
                if (is_dir($childExtensionsDir) && $childExtensionsDir !== $parentExtensionsDir) {
                    $childDirs = glob($childExtensionsDir . '/*', GLOB_ONLYDIR);
                    if ($childDirs) {
                        $extensionDirs = array_merge($extensionDirs, $childDirs);
                    }
                }
            }

            // Cache for 24 hours if not in debug
            if (!defined('WP_DEBUG') || !WP_DEBUG) {
                set_transient($cacheKey, $extensionDirs, DAY_IN_SECONDS);
            }
        }

        // Resolve load priority from the dependency tree, then load in order.
        foreach ($this->sortExtensionsByPriority($extensionDirs) as $dir) {
            $this->loadExtension($dir);
        }
    }

    /**
     * Build a dependency tree from the extension manifests and compute a
     * numeric priority for every extension so that extensions can be loaded
     * before (or after) the extensions they depend on.
     *
     * Priority model (per requirement):
     *   - Build a tree such that an extension's `dependencies.extensions`
     *     are its parents (things that must load first).
     *   - level 1 (roots, no dependencies): priority = position + 1000
     *   - level n: priority = position(parent) + position(self) + n*1000
     *     where "position" is the 1-based index among siblings.
     *
     * After resolving, each manifest's priority is set so callers can sort.
     *
     * @param array $extensionDirs List of extension absolute paths.
     * @return array Flat map: extension name => integer priority.
     */
    protected function resolveExtensionPriorities(array $extensionDirs): array
    {
        $manifests = [];
        $depsOf = [];  // extension => list of dependency extension names (parents)
        foreach ($extensionDirs as $dir) {
            $name = basename($dir);
            $manifestFile = $dir . '/manifest.json';
            if (!file_exists($manifestFile)) {
                continue;
            }
            $manifest = json_decode(file_get_contents($manifestFile), true);
            if (!$manifest) {
                continue;
            }
            $manifests[$name] = $manifest;
            $deps = [];
            if (isset($manifest['dependencies']['extensions'])) {
                $deps = (array) $manifest['dependencies']['extensions'];
            }
            $depsOf[$name] = $deps;
        }

        // Compute level = longest path from a root (an extension with no deps).
        $level = [];
        $computeLevel = null;
        $computeLevel = function (string $name) use (&$computeLevel, &$level, $depsOf): int {
            if (isset($level[$name])) {
                return $level[$name];
            }
            $deps = $depsOf[$name] ?? [];
            if (empty($deps)) {
                return $level[$name] = 1;
            }
            $max = 0;
            foreach ($deps as $dep) {
                if ($dep === $name) {
                    continue; // ignore self-reference
                }
                $max = max($max, $computeLevel($dep));
            }
            return $level[$name] = $max + 1;
        };
        foreach (array_keys($manifests) as $name) {
            $computeLevel($name);
        }

        // Resolve a single "parent" for each extension = its deepest dependency.
        $parentOf = [];
        foreach ($manifests as $name => $manifest) {
            $deps = $depsOf[$name] ?? [];
            if (empty($deps)) {
                $parentOf[$name] = '';
                continue;
            }
            $best = null;
            $bestLvl = -1;
            foreach ($deps as $dep) {
                $depLvl = $level[$dep] ?? 1;
                if ($depLvl > $bestLvl) {
                    $bestLvl = $depLvl;
                    $best = $dep;
                }
            }
            $parentOf[$name] = (string) $best;
        }

        // Group children under each parent to compute sibling positions.
        $childrenByParent = [];
        foreach ($manifests as $name => $manifest) {
            $p = $parentOf[$name];
            $childrenByParent[$p][] = $name;
        }

        $pos = [];
        foreach ($childrenByParent as $parent => $kids) {
            $i = 1;
            foreach ($kids as $kid) {
                $pos[$kid] = $i++;
            }
        }

        // Flat, one-dimensional priority map: extension name => integer priority.
        // No nested objects — cheap to build, traverse, and sort.
        $priorities = [];
        foreach ($manifests as $name => $manifest) {
            $parent = $parentOf[$name];
            $parentPos = $parent === '' ? 0 : ($pos[$parent] ?? 0);
            $selfPos = $pos[$name] ?? 1;
            $lv = $level[$name] ?? 1;
            $priorities[$name] = $parentPos + $selfPos + ($lv * 1000);
        }

        return $priorities;
    }

    /**
     * Sort extension directories by their resolved priority (ascending),
     * so dependencies load before their dependents. Equal priorities are
     * disambiguated by directory name for a stable, deterministic order.
     *
     * @param array $extensionDirs List of extension absolute paths.
     * @return array Sorted list of extension absolute paths.
     */
    protected function sortExtensionsByPriority(array $extensionDirs): array
    {
        $priorities = $this->resolveExtensionPriorities($extensionDirs);

        usort($extensionDirs, function ($a, $b) use ($priorities) {
            $pa = $priorities[basename($a)] ?? PHP_INT_MAX;
            $pb = $priorities[basename($b)] ?? PHP_INT_MAX;
            if ($pa === $pb) {
                return strcmp($a, $b);
            }
            return $pa <=> $pb;
        });

        // Keep the flat priority map (name => priority) accessible.
        $this->resolvedPriorities = $priorities;

        return $extensionDirs;
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
                'dir' => $extensionDir,
                'manifest' => $manifestData,
                'path' => $manifestFile,
            ];
            return false;
        }

        // Check PHP version requirement
        $phpRequirement = $manifestData['requirements']['php'] ?? null;
        if ($phpRequirement && !$this->checkPhpVersion($phpRequirement)) {
            $this->disabledManifests[$extensionName] = [
                'dir' => $extensionDir,
                'manifest' => $manifestData,
                'path' => $manifestFile,
                'reason' => 'php_version',
                'message' => sprintf(
                    'Yêu cầu PHP %s (hiện tại: %s)',
                    $phpRequirement,
                    PHP_VERSION
                ),
            ];
            return false;
        }

        // SMART LOADING: Check if we should load this extension in current context
        $loadDecision = $this->shouldLoadInCurrentContext($extensionName, $manifestData);

        if ($loadDecision === 'late') {
            $this->lateLoadQueue[$extensionName] = [
                'dir' => $extensionDir,
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

                    // Determine correct URL based on directory
                    $baseUrl = get_stylesheet_directory_uri();
                    if (strpos($dir, get_template_directory()) === 0) {
                        $baseUrl = get_template_directory_uri();
                    }
                    $extension->set_extension_url(trailingslashit($baseUrl) . 'extensions/' . $name);
                    $extension->set_manifest_data($manifest);

                    // Mark as child theme extension if loaded from child theme
                    if (is_child_theme() && strpos($dir, get_stylesheet_directory()) === 0) {
                        $extension->set_child_theme_extension(true);
                    }

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
                        ? (bool) $manifest['enabled']
                        : (isset($manifest['auto_activate']) ? (bool) $manifest['auto_activate'] : false);
                    if ($isEnabled) {
                        // NOTE: Do NOT call $caller['method'] directly here.
                        // activate() already calls register_hooks() internally and
                        // guards against double execution via $hooks_registered flag.
                        // Calling the method here AND activate() would register all
                        // hooks twice (e.g. duplicate admin menus).
                        $extension->activate();

                        // SYNC active state with global ExtensionManager
                        try {
                            $globalManager = \Jankx\Facades\App::make('extension.manager');
                            if ($globalManager && method_exists($globalManager, 'add_active_extension')) {
                                $globalManager->add_active_extension($name, $extension);
                            }
                        } catch (\Exception $e) {
                            Log::debug($e->getMessage());
                        }
                    } else {
                        $extension->deactivate();
                    }

                    // ----------------------------------------------------------
                    // Lifecycle: on_install()
                    // Run exactly once when the extension is first encountered.
                    // Uses a WP option as a persistent flag so it never runs again
                    // even across page loads / site migrates.
                    // ----------------------------------------------------------
                    $installFlag = 'jankx_ext_installed_' . $name;
                    $installedVersion = get_option($installFlag, false);
                    $currentVersion = $manifest['version'] ?? '1.0.0';
                    if ($installedVersion === false || $installedVersion !== $currentVersion) {
                        // First install OR version upgrade → run install()
                        $extension->install();
                        update_option($installFlag, $currentVersion, false /* not autoload */);
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
                foreach ((array) $value as $reqExt) {
                    if (!isset($this->extensions[$reqExt]))
                        return false;
                }
            }
            if ($type === 'php') {
                if (version_compare(PHP_VERSION, $value, '<'))
                    return false;
            }
        }
        return true;
    }

    /**
     * Check if PHP version meets requirement
     * 
     * @param string $requirement Version constraint (e.g., ">=7.4", ">=8.0")
     * @return bool
     */
    protected function checkPhpVersion(string $requirement): bool
    {
        // Handle simple version strings like "8.0" or ">=8.0"
        $requirement = trim($requirement);

        if (strpos($requirement, '>=') === 0) {
            $version = substr($requirement, 2);
            return version_compare(PHP_VERSION, $version, '>=');
        }

        if (strpos($requirement, '>') === 0) {
            $version = substr($requirement, 1);
            return version_compare(PHP_VERSION, $version, '>');
        }

        if (strpos($requirement, '>=') === false && strpos($requirement, '>') === false) {
            // Simple version like "8.0" - treat as >=
            return version_compare(PHP_VERSION, $requirement, '>=');
        }

        return version_compare(PHP_VERSION, $requirement, '>=');
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

            if (in_array('admin', $context) && is_admin() && !wp_doing_ajax())
                $is_match = true;
            if (in_array('frontend', $context) && !is_admin())
                $is_match = true;
            if (in_array('ajax', $context) && wp_doing_ajax())
                $is_match = true;
            if (in_array('rest', $context) && defined('REST_REQUEST'))
                $is_match = true;
            if (in_array('always', $context))
                $is_match = true;

            if (!$is_match)
                return false;
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
                    if (is_admin())
                        break; // Skip on admin
                    return is_singular($value);
                case 'is_page':
                    if (is_admin())
                        break;
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
