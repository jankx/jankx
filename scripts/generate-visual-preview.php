<?php
/**
 * Jankx Visual Preview Generator
 * This script generates a standalone HTML file with full styling for visual comparison.
 */

define('ABSPATH', dirname(__DIR__) . '/');
require_once ABSPATH . 'vendor/autoload.php';
require_once ABSPATH . 'tests/bootstrap-mocks.php';

use Jankx\Foundation\Application;

$app = new Application(dirname(__DIR__));
$app->instance('blocks.path', $app->basePath('resources/blocks'));

if ($argc < 2) {
    echo "Usage: php scripts/generate-visual-preview.php <block-name> [json-attributes]\n";
    exit(1);
}

// Load blocks
$service = new \Jankx\Services\GutenbergService($app);
$service->registerBlocks();
$service->initBlocks();

$blockName = $argv[1];
$attributes = isset($argv[2]) ? json_decode($argv[2], true) : [];
$blockInstance = $service->getBlock($blockName);

if (!$blockInstance) {
    echo "Error: Block '{$blockName}' not found.\n";
    exit(1);
}

// Get tokens for CSS variables
$tokensFile = ABSPATH . 'tests/Gutenberg/fixtures/blocks/design-tokens.json';
$tokensData = json_decode(file_get_contents($tokensFile), true);

$cssVars = ":root {\n";
foreach ($tokensData['colors'] as $slug => $color) {
    $cssVars .= "    --wp--preset--color--{$slug}: {$color['value']};\n";
}
foreach ($tokensData['spacing']['sizes'] as $slug => $size) {
    $cssVars .= "    --wp--preset--spacing--{$slug}: {$size['value']};\n";
}
$cssVars .= "    --wp--custom--content-size: {$tokensData['layout']['contentSize']};\n";
$cssVars .= "}";

// Render block
$wpBlock = new \WP_Block($attributes);
$renderedHtml = $blockInstance->render($attributes, '', $wpBlock);

$fullHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Visual Preview: {$blockName}</title>
    <style>
        {$cssVars}
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 50px;
            background-color: #f0f0f0;
        }
        .preview-container {
            max-width: {$tokensData['layout']['contentSize']};
            margin: 0 auto;
            background: #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            min-height: 200px;
        }
        /* Common block styling basics */
        .wp-block-jankx-advanced-button button {
            background-color: var(--wp--preset--color--primary);
            color: var(--wp--preset--color--base);
            padding: var(--wp--preset--spacing--40);
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        {$renderedHtml}
    </div>
</body>
</html>
HTML;

$outputFile = ABSPATH . 'tests/Gutenberg/fixtures/preview.html';
file_put_contents($outputFile, $fullHtml);

echo "Visual preview generated: {$outputFile}\n";
echo "Open this file in your browser to verify against the design image.\n";
