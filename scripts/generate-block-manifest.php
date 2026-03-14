<?php
/**
 * Runner for Block Manifest Generator
 */

define('ABSPATH', dirname(__DIR__) . '/');
require_once ABSPATH . 'vendor/autoload.php';

use Jankx\Foundation\Application;
use Tests\Gutenberg\Blocks\BlockManifestGenerator;
use Tests\Gutenberg\Blocks\BlockOutputReferenceGenerator;
use Tests\Gutenberg\Support\DesignTokenGenerator;

// Initialize Application
$app = new Application(dirname(__DIR__));

require_once ABSPATH . 'tests/bootstrap-mocks.php';

// Setup paths needed by generator
$app->instance('blocks.path', $app->basePath('resources/blocks'));

// Use real repository
$app->singleton('gutenberg.repository', function () {
    return new \Jankx\Gutenberg\GutenbergRepository();
});


$generator = new BlockManifestGenerator($app);
$generator->generate();

// Generate HTML Scenarios (Pre-rendered samples)
echo "Generating HTML scenarios...\n";
$scenarioGenerator = new BlockOutputReferenceGenerator($app);
$scenarioGenerator->generate();

// Generate Design Tokens
$tokenGenerator = new DesignTokenGenerator(
    ABSPATH . 'theme.json',
    $app->basePath('tests/Gutenberg/fixtures/blocks/design-tokens.json')
);
$tokenGenerator->generate();
