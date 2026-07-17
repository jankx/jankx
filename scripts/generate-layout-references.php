<?php
/**
 * Script to generate layout and template references for AI context.
 */

define('ABSPATH', dirname(__DIR__) . '/');
require_once ABSPATH . 'vendor/autoload.php';

// Mock WordPress functions
require_once ABSPATH . 'tests/bootstrap-mocks.php';

// Initialize Jankx Application
use Jankx\Foundation\Application;
$app = new Application(dirname(__DIR__));

// Register necessary providers
$app->register(\Jankx\Support\Providers\GutenbergServiceProvider::class);

// Boot the application
$app->bootProviders();

// Initialize global wp_query
$GLOBALS['wp_query'] = new \WP_Query();

// Include the layout generator
require_once ABSPATH . 'tests/Gutenberg/Layouts/LayoutReferenceGenerator.php';

use Jankx\Gutenberg\Layouts\LayoutReferenceGenerator;

try {
    $outputDir = ABSPATH . 'tests/Gutenberg/fixtures/layouts/output-references';
    if (!is_dir($outputDir)) {
        mkdir($outputDir, 0755, true);
    }
    
    $generator = new LayoutReferenceGenerator($app, $outputDir);

    echo "Scanning layouts and templates...\n";

    $sources = [
        'template' => get_template_directory() . '/templates',
        'part' => get_template_directory() . '/parts',
        'content-template' => get_template_directory() . '/resources/content-templates',
    ];

    $generator->generate($sources);

    echo "Done! Layout references generated in: " . $outputDir . "\n";
} catch (\Exception $e) {
    echo "Fatal error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
