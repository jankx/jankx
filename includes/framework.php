<?php

use Jankx\Facades\Logger;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

// Define basic constants for Jankx Framework
define('JANKX_ABSPATH', dirname(__FILE__, 2));
define('JANKX_VERSION', '2.0.0');

// Load Composer autoloader if available
$autoload_path = JANKX_ABSPATH . '/vendor/autoload.php';
if (file_exists($autoload_path)) {
    require_once $autoload_path;
} else {
    error_log('Jankx Framework: Composer autoloader not found. Please run composer install.');
    return;
}

// Import required namespaces
use Jankx\Jankx;
use Jankx\Kernel\KernelManager;

// Initialize container
$container = Jankx::getInstance();

// Initialize KernelManager and boot kernel by context
$kernelManager = new KernelManager($container);
$kernelManager->boot();

$currentKernel = $kernelManager->getCurrentKernel();
if ($currentKernel) {
    Logger::debug('Current kernel info', [
        'type' => $currentKernel->getKernelType(),
        'class' => get_class($currentKernel),
        'booted' => $currentKernel->isBooted(),
    ]);
}
