<?php

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

// Define Jankx ABSPATH
define('JANKX_ABSPATH', dirname(__FILE__, 2));

// Check if composer autoloader exists
$autoload_path = JANKX_ABSPATH . '/vendor/autoload.php';

if (!file_exists($autoload_path)) {
    // Use WordPress error logging instead of error_log
    if (function_exists('wp_die')) {
        wp_die('Jankx Framework: Composer autoloader not found. Please run composer install.');
    } else {
        die('Jankx Framework: Composer autoloader not found. Please run composer install.');
    }
}

require_once $autoload_path;

// Import required namespaces (only after autoloader is loaded)
use Jankx\Facades\Logger;
use Jankx\Jankx;
use Jankx\Kernel\KernelManager;

// Initialize Jankx container
$jankx = Jankx::getInstance();

// Initialize KernelManager and boot kernel by context
$kernelManager = new KernelManager($jankx);
$kernelManager->boot();

$jankx->singleton(KernelManager::class, function () use ($kernelManager) {
    return $kernelManager;
});

$currentKernel = $kernelManager->getCurrentKernel();
if ($currentKernel) {
    Logger::debug('Current kernel info', [
        'type' => $currentKernel->getKernelType(),
        'class' => get_class($currentKernel),
        'booted' => $currentKernel->isBooted(),
    ]);
}
