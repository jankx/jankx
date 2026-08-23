<?php
/**
 * Blocks Integration Loader
 *
 * Main entry point for integrating jankx/gutenberg-controls with
 * existing Jankx blocks in resources/blocks.
 *
 * Usage: Include this file in your theme's functions.php or initialization
 *
 * @package Jankx\Blocks\Integration
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Load the integration
 */
add_action('after_setup_theme', 'jankx_load_blocks_integration', 15);

function jankx_load_blocks_integration(): void
{
    // Check if gutenberg-controls package exists
    $controlsPackage = get_template_directory() . '/vendor/jankx/gutenberg-controls';

    if (!is_dir($controlsPackage)) {
        // Log warning in admin
        add_action('admin_notices', 'jankx_blocks_integration_missing_notice');
        return;
    }

    // Load composer autoloader for gutenberg-controls
    $autoload = $controlsPackage . '/vendor/autoload.php';
    if (file_exists($autoload)) {
        require_once $autoload;
    }

    // Load the integration class
    $integrationFile = __DIR__ . '/gutenberg-controls-integration.php';
    if (file_exists($integrationFile)) {
        require_once $integrationFile;
    }

    // Enqueue bridge script for existing blocks
    add_action('enqueue_block_editor_assets', 'jankx_enqueue_blocks_bridge', 20);
}

/**
 * Admin notice if package missing
 */
function jankx_blocks_integration_missing_notice(): void
{
    $message = sprintf(
        __('Jankx Gutenberg Controls package not found. Please run %s in your theme directory.', 'jankx'),
        '<code>composer install</code>'
    );

    echo '<div class="notice notice-warning is-dismissible">';
    echo '<p>' . $message . '</p>';
    echo '</div>';
}

/**
 * Enqueue blocks bridge script
 */
function jankx_enqueue_blocks_bridge(): void
{
    $bridgeScript = get_template_directory() . '/resources/dist/blocks/integration/jankx-blocks-bridge.js';
    $bridgeAsset = get_template_directory() . '/resources/dist/blocks/integration/jankx-blocks-bridge.asset.php';

    if (!file_exists($bridgeScript)) {
        return;
    }

    // Load dependencies from .asset.php
    $asset = file_exists($bridgeAsset)
        ? require $bridgeAsset
        : ['dependencies' => ['wp-element', 'wp-hooks', 'wp-compose', 'wp-block-editor', 'wp-components', 'wp-i18n'], 'version' => filemtime($bridgeScript)];

    $deps = $asset['dependencies'];
    
    // Load gutenberg-controls first so bridge can use its exports
    if (wp_script_is('jankx-gutenberg-controls', 'registered')) {
        $deps[] = 'jankx-gutenberg-controls';
    }

    wp_enqueue_script(
        'jankx-blocks-bridge',
        get_template_directory_uri() . '/resources/dist/blocks/integration/jankx-blocks-bridge.js',
        $deps,
        $asset['version'],
        true
    );

    // Localize with block configurations
    $controlsConfig = apply_filters('jankx_blocks_controls_config', []);

    wp_localize_script('jankx-blocks-bridge', 'jankxBlocksConfig', [
        'controls' => $controlsConfig,
        'version' => '1.0.0',
    ]);
}

/**
 * Check if integration is active
 */
function jankx_blocks_integration_active(): bool
{
    return class_exists('Jankx\Blocks\Integration\GutenbergControlsIntegration');
}

/**
 * Helper: Enable controls for a block
 */
function jankx_enable_block_controls(string $blockName, array $controls): void
{
    add_filter('jankx_blocks_controls_config', function ($configs) use ($blockName, $controls) {
        if (!isset($configs[$blockName])) {
            $configs[$blockName] = [];
        }
        $configs[$blockName] = array_merge($configs[$blockName], $controls);
        return $configs;
    });
}

/**
 * Helper: Register custom preset for block
 */
function jankx_register_block_preset(string $blockName, array $preset): void
{
    if (!class_exists('Jankx\Gutenberg\Presets\PresetManager')) {
        return;
    }

    $manager = Jankx\Gutenberg\Presets\PresetManager::getInstance();
    $manager->registerPresetForBlock($blockName, $preset);
}

/**
 * Helper: Get block controls
 */
function jankx_get_block_controls(string $blockName): array
{
    $configs = apply_filters('jankx_blocks_controls_config', []);
    return $configs[$blockName] ?? [];
}

// Load integration immediately
jankx_load_blocks_integration();
