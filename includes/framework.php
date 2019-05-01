<?php

$template_directory = realpath(dirname(__FILE__) . '/..');

/**
 * Check composer package is installed
 */
$composer = sprintf('%s/vendor/autoload.php', $template_directory);
if (file_exists($composer)) {
    require_once $composer;
} else {
    exit(__('Please ensure composer packages are installed', 'jankx'));
}