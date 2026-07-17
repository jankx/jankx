<?php
/**
 * Script to generate block HTML output references
 */

define('ABSPATH', dirname(__DIR__) . '/');
require_once ABSPATH . 'vendor/autoload.php';

// Mock WordPress functions
require_once ABSPATH . 'tests/bootstrap-mocks.php';

// Include the application bootstrap or tests bootstrap
require_once ABSPATH . 'tests/bootstrap.php';

use Jankx\Foundation\Application;
use Tests\Gutenberg\Blocks\BlockOutputReferenceGenerator;

// Initialize the application
$app = Application::getInstance();

// Register necessary providers
$app->register(\Jankx\Support\Providers\GutenbergServiceProvider::class);

// Bind non-instantiable managers
$app->singleton(\Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager::class, function() {
    return \Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager::getInstance();
});
$app->singleton(\Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager::class, function() {
    return \Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager::getInstance();
});

// Boot the application
$app->bootProviders();

// Initialize global wp_query
$GLOBALS['wp_query'] = new \WP_Query();

// Create the generator
$generator = new BlockOutputReferenceGenerator($app);

// Run the generation process
$generator->generate();

echo "Done! Block references generated.\n";
