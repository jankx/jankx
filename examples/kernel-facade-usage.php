<?php
/**
 * Kernel Facade Usage Example
 *
 * This example demonstrates how to use the Kernel facade to access
 * kernel information and current context.
 */

// Ensure we're in WordPress environment
if (!defined('ABSPATH')) {
    exit('Direct access not allowed');
}

// Import the Kernel facade
use Jankx\Facades\Kernel;

// Example 1: Get current context
$currentContext = Kernel::getCurrentContext();
echo "Current context: {$currentContext}\n";

// Example 2: Get current kernel instance
$currentKernel = Kernel::getCurrentKernel();
if ($currentKernel) {
    echo "Current kernel class: " . get_class($currentKernel) . "\n";
    echo "Kernel type: " . $currentKernel->getKernelType() . "\n";
    echo "Is booted: " . ($currentKernel->isBooted() ? 'Yes' : 'No') . "\n";
}

// Example 3: Check if kernel is booted
$isBooted = Kernel::isBooted();
echo "Kernel booted: " . ($isBooted ? 'Yes' : 'No') . "\n";

// Example 4: Get kernel type
$kernelType = Kernel::getType();
echo "Kernel type: {$kernelType}\n";

// Example 5: Get container instance
$container = Kernel::getContainer();
echo "Container class: " . get_class($container) . "\n";

// Example 6: Context-specific operations
switch (Kernel::getCurrentContext()) {
    case 'frontend':
        echo "Running in frontend context\n";
        // Load frontend-specific services
        break;

    case 'admin':
        echo "Running in admin context\n";
        // Load admin-specific services
        break;

    case 'cli':
        echo "Running in CLI context\n";
        // Load CLI-specific services
        break;

    case 'api':
        echo "Running in API context\n";
        // Load API-specific services
        break;

    case 'ajax':
        echo "Running in AJAX context\n";
        // Load AJAX-specific services
        break;

    default:
        echo "Running in unknown context\n";
        break;
}

// Example 7: Conditional service loading based on context
if (Kernel::getCurrentContext() === 'frontend' && Kernel::isBooted()) {
    // Load frontend-specific features
    echo "Loading frontend features...\n";
}

// Example 8: Debug information
if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
    echo "=== Kernel Debug Info ===\n";
    echo "Context: " . Kernel::getCurrentContext() . "\n";
    echo "Type: " . Kernel::getType() . "\n";
    echo "Booted: " . (Kernel::isBooted() ? 'Yes' : 'No') . "\n";
    echo "Container: " . get_class(Kernel::getContainer()) . "\n";
    echo "=======================\n";
}