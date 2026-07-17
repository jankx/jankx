<?php

/**
 * Extension Manager for Jankx Theme Framework
 *
 * @package Jankx\Extensions
 */

namespace Jankx\Extensions;

use Jankx\Contracts\Extension\ExtensionInterface;
use Jankx\Contracts\Extension\ExtensionManagerInterface;
use Jankx\Facades\App;
use Jankx\Facades\Log;


class ExtensionManager implements ExtensionManagerInterface
{
    /**
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    protected $extensions = [];
    protected $active_extensions = [];
    protected $extension_ids = [];
    protected $required_extensions = [];
    protected $recommended_extensions = [];

    /**
     * Get singleton instance via the Application container.
     *
     * @return static
     */
    public static function getInstance(): self
    {
        return App::make('extension.manager');
    }

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
     * Initialize extension manager
     */
    protected function init()
    {
        add_action('jankx/gutenberg/register-blocks', [$this, 'register_extension_blocks']);
        add_action('admin_notices', [$this, 'render_extension_notices']);

        // Load requirements from config
        $this->load_requirements_from_config();
    }

    /**
     * Load extension requirements from application config
     */
    protected function load_requirements_from_config(): void
    {
        $config = $this->app->make('config');
        $requirements = $config->get('app.extensions', []);

        foreach (['required', 'recommended'] as $type) {
            if (isset($requirements[$type]) && is_array($requirements[$type])) {
                foreach ($requirements[$type] as $key => $value) {
                    $is_required = $type === 'required';
                    if (is_int($key)) {
                        $this->require_extension($value, $is_required, '*');
                    } else {
                        $this->require_extension($key, $is_required, $value);
                    }
                }
            }
        }
    }

    /**
     * Load all extensions
     */
    public function load_extensions()
    {
        // Load extensions from parent theme
        $this->load_extensions_from_directory(get_template_directory() . '/includes/extensions');

        // Load extensions from child theme (if exists)
        if (is_child_theme()) {
            $this->load_extensions_from_directory(get_stylesheet_directory() . '/includes/extensions');
        }
    }

    /**
     * Load extensions from specific directory
     */
    public function load_extensions_from_directory(string $extensionsDir): void
    {
        if (!is_dir($extensionsDir)) {
            return;
        }

        $extension_dirs = glob($extensionsDir . '/*', GLOB_ONLYDIR);
        foreach ($extension_dirs as $extension_dir) {
            $extension_name = basename($extension_dir);
            $manifest_file = $extension_dir . '/manifest.json';

            // Only load extensions that have manifest.json
            if (file_exists($manifest_file)) {
                $this->load_extension_from_manifest($extension_name, $manifest_file, $extensionsDir);
            }
        }
    }

    /**
     * Load a specific extension from manifest
     */
    public function load_extension_from_manifest(string $extensionName, string $manifestFile, string $extensionsDir): bool
    {
        // Load and parse manifest
        $manifest_data = json_decode(file_get_contents($manifestFile), true);
        if (!$manifest_data || !isset($manifest_data['caller'])) {
            return false;
        }

        // Check for extension_id to prevent duplicates
        $extension_id = $manifest_data['extension_id'] ?? $extensionName;

        // Check Jankx version requirement if specified in manifest
        if (isset($manifest_data['requirements']['jankx'])) {
            $required_jankx = $manifest_data['requirements']['jankx'];
            if (!$this->version_matches($required_jankx, $this->get_jankx_version())) {
                Log::notice("Extension {$extensionName} requires Jankx version {$required_jankx}, but current version is " . $this->get_jankx_version());
                return false;
            }
        }

        // Register required extensions if specified in manifest
        if (isset($manifest_data['requirements']['extensions'])) {
            foreach ($manifest_data['requirements']['extensions'] as $req_id => $req_version) {
                $this->require_extension($req_id, true, $req_version);
            }
        }

        // If extension with this ID already exists, skip loading
        if (isset($this->extension_ids[$extension_id])) {
            return false;
        }

        $caller = $manifest_data['caller'];
        $extension_dir = dirname($manifestFile);

        // Determine if this is a child theme extension
        $is_child_theme_extension = is_child_theme() && strpos($extensionsDir, get_stylesheet_directory()) === 0;

        // Load the caller file
        $caller_file = $extension_dir . '/' . $caller['file'];
        if (!file_exists($caller_file)) {
            Log::notice("Extension caller file not found: {$caller_file}");
            return false;
        }

        require_once $caller_file;

        // Get the class name from manifest
        $class_name = $caller['class'];

        // Adjust namespace for child theme extensions
        if ($is_child_theme_extension) {
            $class_name = str_replace('Jankx\\Extensions', 'Jankx\\Child\\Extensions', $class_name);
        }

        if (class_exists($class_name)) {
            $extension = new $class_name();
            if ($extension instanceof AbstractExtension) {
                // Set extension path and URL
                $extension->set_extension_path($extension_dir);
                $extension->set_extension_url($this->get_extension_url($extension_dir));

                // Store extension
                $this->extensions[$extensionName] = $extension;
                $this->extension_ids[$extension_id] = $extension_dir;

                // Auto-activate if specified in manifest
                if (isset($manifest_data['auto_activate']) && $manifest_data['auto_activate']) {
                    $this->activate_extension($extensionName);
                }

                do_action('jankx/extension/loaded', $extensionName, $extension);
                return true;
            }
        }

        return false;
    }

    /**
     * Get extension URL
     */
    public function get_extension_url(string $extensionPath): string
    {
        $extensionName = basename($extensionPath);
        $parentPath = get_template_directory() . '/includes/extensions/' . $extensionName;
        $childPath = get_stylesheet_directory() . '/includes/extensions/' . $extensionName;

        if (is_child_theme() && is_dir($childPath)) {
            return get_stylesheet_directory_uri() . '/includes/extensions/' . $extensionName;
        }

        return get_template_directory_uri() . '/includes/extensions/' . $extensionName;
    }

    /**
     * Register blocks from all extensions
     */
    public function register_extension_blocks($blocks)
    {
        foreach ($this->active_extensions as $extension) {
            if (method_exists($extension, 'register_gutenberg_blocks')) {
                $blocks = $extension->register_gutenberg_blocks($blocks);
            }
        }

        return $blocks;
    }

    /**
     * Get all extensions
     */
    public function get_extensions(): array
    {
        return $this->extensions;
    }

    public function add_extension(string $name, ExtensionInterface $extension): void
    {
        $this->extensions[$name] = $extension;
    }

    /**
     * Get active extensions
     */
    public function get_active_extensions(): array
    {
        return $this->active_extensions;
    }

    public function add_active_extension(string $name, ExtensionInterface $extension): void
    {
        $this->active_extensions[$name] = $extension;
    }

    /**
     * Get inactive extensions
     */
    public function get_inactive_extensions(): array
    {
        return array_diff_key($this->extensions, $this->active_extensions);
    }

    /**
     * Get a specific extension
     */
    public function get_extension(string $name): ?ExtensionInterface
    {
        return $this->extensions[$name] ?? null;
    }

    /**
     * Get extension by ID
     */
    public function get_extension_by_id(string $extensionId): ?ExtensionInterface
    {
        if (!isset($this->extension_ids[$extensionId])) {
            return null;
        }

        $extensionPath = $this->extension_ids[$extensionId];
        $extensionName = basename($extensionPath);

        return $this->get_extension($extensionName);
    }

    /**
     * Check if extension exists
     */
    public function has_extension(string $name): bool
    {
        return isset($this->extensions[$name]);
    }

    /**
     * Check if extension ID exists
     */
    public function has_extension_id(string $extensionId): bool
    {
        return isset($this->extension_ids[$extensionId]);
    }

    public function get_extension_ids(): array
    {
        return $this->extension_ids;
    }

    public function set_extension_id(string $id, string $path): void
    {
        $this->extension_ids[$id] = $path;
    }

    /**
     * Check if extension is active
     */
    public function is_extension_active(string $extension_name): bool
    {
        return isset($this->active_extensions[$extension_name]);
    }

    /**
     * Activate a extension
     */
    public function activate_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            $extension->activate();
            $this->active_extensions[$name] = $extension;
            do_action('jankx/extension/activated', $name);
            return true;
        }

        return false;
    }

    /**
     * Deactivate a extension
     */
    public function deactivate_extension(string $name): bool
    {
        if (isset($this->active_extensions[$name])) {
            $extension = $this->active_extensions[$name];
            $extension->deactivate();
            unset($this->active_extensions[$name]);
            do_action('jankx/extension/deactivated', $name);
            return true;
        }

        return false;
    }

    /**
     * Install extension
     */
    public function install_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            if (method_exists($extension, 'install')) {
                return $extension->install();
            }
        }
        return false;
    }

    /**
     * Uninstall extension
     */
    public function uninstall_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            if (method_exists($extension, 'uninstall')) {
                return $extension->uninstall();
            }
        }
        return false;
    }

    /**
     * Get extension path by ID
     */
    public function get_extension_path_by_id(string $extensionId): ?string
    {
        return $this->extension_ids[$extensionId] ?? null;
    }

    /**
     * Get extension statistics
     */
    public function get_statistics(): array
    {
        return [
            'total' => count($this->extensions),
            'active' => count($this->active_extensions),
            'inactive' => count($this->extensions) - count($this->active_extensions),
            'unique_ids' => count($this->extension_ids),
        ];
    }

    /**
     * Validate all extensions
     */
    public function validate_extensions(): array
    {
        $errors = [];
        foreach ($this->extensions as $name => $extension) {
            if (method_exists($extension, 'validate')) {
                $validation = $extension->validate();
                if (!empty($validation)) {
                    $errors[$name] = $validation;
                }
            }
        }
        return $errors;
    }

    /**
     * Check for extension updates
     */
    public function check_updates(): array
    {
        $updates = [];
        foreach ($this->extensions as $name => $extension) {
            if (method_exists($extension, 'check_update')) {
                $update = $extension->check_update();
                if ($update) {
                    $updates[$name] = $update;
                }
            }
        }
        return $updates;
    }

    /**
     * Get available extension locations
     */
    public function get_extension_locations()
    {
        $locations = [
            'parent' => get_template_directory() . '/extensions',
        ];
        if (is_child_theme()) {
            $locations['child'] = get_stylesheet_directory() . '/extensions';
        }

        return $locations;
    }

    /**
     * Check if extension can be installed to child theme
     */
    public function can_install_to_child_theme()
    {
        return is_child_theme() && is_writable(get_stylesheet_directory());
    }

    /**
     * Install extension to child theme
     */
    public function install_extension_to_child_theme($extension_name, $source_path = null)
    {
        if (!$this->can_install_to_child_theme()) {
            return false;
        }

        $child_extensions_dir = get_stylesheet_directory() . '/extensions';

        // Create extensions directory if not exists
        if (!is_dir($child_extensions_dir)) {
            wp_mkdir_p($child_extensions_dir);
        }

        // If source path is provided, copy from there
        if ($source_path && is_dir($source_path)) {
            $destination = $child_extensions_dir . '/' . $extension_name;
            return $this->copy_directory($source_path, $destination);
        }

        // If extension exists in parent theme, copy from there
        $parent_extension_path = get_template_directory() . '/extensions/' . $extension_name;
        if (is_dir($parent_extension_path)) {
            $destination = $child_extensions_dir . '/' . $extension_name;
            return $this->copy_directory($parent_extension_path, $destination);
        }

        return false;
    }

    /**
     * Copy directory recursively
     */
    private function copy_directory($source, $destination)
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

            $source_path = $source . '/' . $file;
            $dest_path = $destination . '/' . $file;

            if (is_dir($source_path)) {
                if (!$this->copy_directory($source_path, $dest_path)) {
                    return false;
                }
            } else {
                if (!copy($source_path, $dest_path)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Register a required or recommended extension
     */
    public function require_extension(string $extensionId, bool $required = true, string $version = '*'): void
    {
        if ($required) {
            $this->required_extensions[$extensionId] = $version;
        } else {
            $this->recommended_extensions[$extensionId] = $version;
        }
    }

    /**
     * Get all required extensions
     */
    public function get_required_extensions(): array
    {
        return $this->required_extensions;
    }

    /**
     * Get all recommended extensions
     */
    public function get_recommended_extensions(): array
    {
        return $this->recommended_extensions;
    }

    /**
     * Helper to check if version matches constraint
     */
    protected function version_matches(string $constraint, string $version): bool
    {
        if ($constraint === '*') {
            return true;
        }

        // Basic operator parsing
        $operator = '==';
        $v = $constraint;
        if (preg_match('/^([<>=!~^]+)(.*)$/', $constraint, $matches)) {
            $operator = $matches[1];
            $v = trim($matches[2]);

            // Handle common semver shortcuts
            if ($operator === '^' || $operator === '~') {
                $operator = '>='; // Simplified fallback
            }
        }

        return version_compare($version, $v, $operator);
    }

    /**
     * Get target Jankx version for extension compatibility
     */
    public function get_jankx_version(): string
    {
        $config = $this->app->make('config');
        return $config->get('app.extensions.jankx_version', \Jankx\Foundation\Application::VERSION);
    }

    /**
     * Get missing required extensions
     */
    public function get_missing_required_extensions(): array
    {
        $missing = [];
        foreach ($this->required_extensions as $extensionId => $version) {
            if (!$this->has_extension_id($extensionId) || !$this->is_extension_active_by_id($extensionId, $version)) {
                $missing[] = $extensionId;
            }
        }
        return $missing;
    }

    /**
     * Check if extension is active by its ID and matches version
     */
    public function is_extension_active_by_id(string $extensionId, string $version = '*'): bool
    {
        $extension = $this->get_extension_by_id($extensionId);
        if (!$extension) {
            return false;
        }
        if (!$extension->is_active()) {
            return false;
        }

        if ($version !== '*' && !$this->version_matches($version, $extension->get_version())) {
            return false;
        }

        return true;
    }

    /**
     * Render admin notices for missing extensions
     */
    public function render_extension_notices(): void
    {
        $missing_required = $this->get_missing_required_extensions();
        if (!empty($missing_required)) {
            $names = [];
            foreach ($missing_required as $id) {
                $info = $this->get_hub_extension_info($id);
                $names[] = $info['name'] ?? $id;
            }
            ?>
            <div class="notice notice-error is-dismissible">
                <p>
                    <?php 
                    $message = __('The following extensions are <strong>required</strong> for %1$s theme: %2$s. <a href="%3$s">Please install and activate them.</a>', 'jankx');
                    $extension_list = [];
                    foreach ($missing_required as $id) {
                        $info = $this->get_hub_extension_info($id);
                        $name = $info['name'] ?? $id;
                        $version = $this->required_extensions[$id] ?? '*';
                        if ($version !== '*') {
                            $name .= ' (' . $version . ')';
                        }
                        $extension_list[] = $name;
                    }

                    echo sprintf(
                        $message,
                        esc_html($this->app->make('config')->get('app.name', 'Jankx')),
                        '<strong>' . implode('</strong>, <strong>', array_map('esc_html', $extension_list)) . '</strong>',
                        esc_url(admin_url('admin.php?page=jankx-extensions&extension_status=required'))
                    ); ?>
                </p>
            </div>
            <?php
        }

        // Show recommended notices only if not already dismissed (simplification for now)
        $recommended = $this->recommended_extensions;
        $missing_recommended = [];
        foreach ($recommended as $extensionId => $version) {
            if (!$this->has_extension_id($extensionId) || !$this->is_extension_active_by_id($extensionId, $version)) {
                $missing_recommended[] = $extensionId;
            }
        }

        if (!empty($missing_recommended)) {
            $names = [];
            foreach ($missing_recommended as $id) {
                $info = $this->get_hub_extension_info($id);
                $names[] = $info['name'] ?? $id;
            }
            ?>
            <div class="notice notice-warning is-dismissible">
                <p>
                    <?php 
                    $message = __('The following extensions are <strong>recommended</strong> for %1$s theme: %2$s. <a href="%3$s">Installing them will provide more features.</a>', 'jankx');
                    $extension_list = [];
                    foreach ($missing_recommended as $id) {
                        $info = $this->get_hub_extension_info($id);
                        $name = $info['name'] ?? $id;
                        $version = $this->recommended_extensions[$id] ?? '*';
                        if ($version !== '*') {
                            $name .= ' (' . $version . ')';
                        }
                        $extension_list[] = $name;
                    }

                    echo sprintf(
                        $message,
                        esc_html($this->app->make('config')->get('app.name', 'Jankx')),
                        '<strong>' . implode('</strong>, <strong>', array_map('esc_html', $extension_list)) . '</strong>',
                        esc_url(admin_url('admin.php?page=jankx-extensions'))
                    ); ?>
                </p>
            </div>
            <?php
        }
    }

    /**
     * Get extension information from Jankx Hub API with caching
     */
    public function get_hub_extension_info(string $slug): array
    {
        $cache_key = 'jankx_hub_ext_' . md5($slug);
        $cached_info = get_transient($cache_key);

        if ($cached_info !== false) {
            return $cached_info;
        }

        $api_url = "https://jankx.pages.dev/api/extensions/{$slug}/resolve";
        
        // Pass Jankx version and PHP version for better resolution
        $api_url = add_query_arg([
            'jankx_version' => $this->get_jankx_version(),
            'php_version'   => PHP_VERSION,
        ], $api_url);

        // Pass version requirement if available
        $version = $this->required_extensions[$slug] ?? ($this->recommended_extensions[$slug] ?? '*');
        if ($version !== '*') {
            $api_url = add_query_arg('version', $version, $api_url);
        }

        $response = wp_remote_get($api_url, [
            'timeout' => 10,
            'sslverify' => false, // Sometimes needed for local dev
        ]);

        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
            return [];
        }

        $info = json_decode(wp_remote_retrieve_body($response), true);
        if (!$info) {
            return [];
        }

        set_transient($cache_key, $info, DAY_IN_SECONDS);

        return $info;
    }

    /**
     * Install an extension from Jankx Hub
     */
    public function install_extension_from_hub(string $slug): bool|\WP_Error
    {
        $info = $this->get_hub_extension_info($slug);
        if (empty($info['download_url'])) {
            return new \WP_Error('hub_error', __('Could not resolve download URL from Jankx Hub.', 'jankx'));
        }

        if (!function_exists('download_url')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        $tmp_file = download_url($info['download_url']);
        if (is_wp_error($tmp_file)) {
            return $tmp_file;
        }

        $extensions_dir = get_template_directory() . '/extensions';
        $target_dir = $extensions_dir . '/' . $slug;

        $wp_filesystem = $this->getFilesystem();
        if (!$wp_filesystem->exists($extensions_dir)) {
            $wp_filesystem->mkdir($extensions_dir);
        }

        // Unzip to a temporary directory first to handle folder structure
        $unzip_dir = $extensions_dir . '/_tmp_' . $slug;
        if ($wp_filesystem->exists($unzip_dir)) {
            $wp_filesystem->delete($unzip_dir, true);
        }
        $wp_filesystem->mkdir($unzip_dir);

        $unzipped = unzip_file($tmp_file, $unzip_dir);
        @unlink($tmp_file);

        if (is_wp_error($unzipped)) {
            $wp_filesystem->delete($unzip_dir, true);
            return $unzipped;
        }

        // Usually GitHub Zips have a root folder like "repo-branch"
        $files = $wp_filesystem->dirlist($unzip_dir);
        $source_dir = $unzip_dir;
        
        if (count($files) === 1) {
            $first_file = reset($files);
            if ($first_file['type'] === 'd') {
                $source_dir .= '/' . $first_file['name'];
            }
        }

        // Move to final location
        if ($wp_filesystem->exists($target_dir)) {
            $wp_filesystem->delete($target_dir, true);
        }

        $moved = $wp_filesystem->move($source_dir, $target_dir);
        $wp_filesystem->delete($unzip_dir, true);

        if (!$moved) {
            return new \WP_Error('install_error', __('Failed to move extension to final directory.', 'jankx'));
        }

        // Enable the extension immediately after install
        $manifestPath = $target_dir . '/manifest.json';
        if ($wp_filesystem->exists($manifestPath)) {
            $manifestJson = $wp_filesystem->get_contents($manifestPath);
            $manifest = json_decode($manifestJson, true);
            if ($manifest) {
                $manifest['enabled'] = true;
                $wp_filesystem->put_contents(
                    $manifestPath,
                    json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                );
            }
        }

        // Invalidate directory cache
        delete_transient('jankx_extensions_dirs_' . get_stylesheet());

        return true;
    }

    protected function getFilesystem()
    {
        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }
        return $wp_filesystem;
    }
}
