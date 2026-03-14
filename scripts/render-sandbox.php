<?php
/**
 * Jankx Block Rendering Sandbox
 * 
 * Usage: php scripts/render-sandbox.php 'jankx/advanced-button' '{"text":"Hello", "triggerType":"button"}'
 */

if ($argc < 2) {
    echo "Usage: php render-sandbox.php <block-name> [json-attributes]\n";
    exit(1);
}

define('ABSPATH', dirname(__DIR__) . '/');
require_once ABSPATH . 'vendor/autoload.php';

use Jankx\Foundation\Application;

// Initialize Application
$app = new Application(dirname(__DIR__));
$app->instance('blocks.path', $app->basePath('resources/blocks'));

require_once ABSPATH . 'tests/bootstrap-mocks.php';

// Register the repository
$app->singleton('gutenberg.repository', function () {
    return new \Jankx\Gutenberg\GutenbergRepository();
});

// Load services
$service = new \Jankx\Services\GutenbergService($app);
$service->registerBlocks();
$service->initBlocks();

$blockName = $argv[1];
$attributes = isset($argv[2]) ? json_decode($argv[2], true) : [];

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Error: Invalid JSON attributes provided.\n";
    exit(1);
}

$blockInstance = $service->getBlock($blockName);

if (!$blockInstance) {
    // Try to find by class if name fails
    $blocks = $service->getInstances();
    foreach ($blocks as $class => $instance) {
        if ($instance->getBlockId() === $blockName) {
            $blockInstance = $instance;
            break;
        }
    }
}

if (!$blockInstance) {
    echo "Error: Block '{$blockName}' not found.\n";
    exit(1);
}

// Create WP_Block for render method
$wpBlock = new \WP_Block($attributes);

if (method_exists($blockInstance, 'render')) {
    echo "--- RENDERED HTML ---\n";
    echo $blockInstance->render($attributes, '', $wpBlock);
    echo "\n---------------------\n";
} else {
    echo "Info: Block '{$blockName}' exists but has no PHP render method (it might be a static block).\n";
}
