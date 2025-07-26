<?php

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

// Import required namespaces (only after autoloader is loaded)
use Jankx\Facades\Logger;
use Jankx\Jankx;
use Jankx\Kernel\KernelManager;

// Initialize Jankx container
$jankx = Jankx::getInstance();

// Initialize KernelManager and boot kernel by context
$kernelManager = new KernelManager($jankx);
$kernelManager->boot();

$currentKernel = $kernelManager->getCurrentKernel();
if ($currentKernel) {
    Logger::debug('Current kernel info', [
        'type' => $currentKernel->getKernelType(),
        'class' => get_class($currentKernel),
        'booted' => $currentKernel->isBooted(),
    ]);
}

/**
 * Add debug info display for admin
 *
 * @since 2.0.1
 */
function bookix_display_block_debug_info() {
    if (is_admin() && current_user_can('manage_options')) {
        // Add debug button to admin bar
        add_action('admin_bar_menu', function($wp_admin_bar) {
            $wp_admin_bar->add_menu([
                'id' => 'block-debug-info',
                'title' => '📝 Gutenberg Blocks',
                'href' => '#',
                'meta' => [
                    'onclick' => 'bookix_show_block_debug(); return false;'
                ]
            ]);
        }, 999);

        // Add JavaScript
        add_action('admin_footer', function() {
            echo '<script>
            function bookix_show_block_debug() {
                // Create AJAX request to get debug info
                fetch("' . admin_url('admin-ajax.php') . '", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "action=bookix_get_block_debug_info"
                })
                .then(response => response.text())
                .then(html => {
                    // Remove existing debug box
                    const existing = document.getElementById("bookix-debug-box");
                    if (existing) existing.remove();

                    // Only add debug box if there is content (has blocks)
                    if (html.trim() !== "") {
                        document.body.insertAdjacentHTML("beforeend", html);
                    } else {
                        // Show message if no blocks found
                        alert("No Gutenberg blocks found on this page.");
                    }
                })
                .catch(error => {
                    console.error("Error loading block debug info:", error);
                    alert("Error loading block debug info. Check console for details.");
                });
            }
            </script>';
        });

        // Add AJAX handler
        add_action('wp_ajax_bookix_get_block_debug_info', function() {
            if (class_exists('Jankx\Services\BlockParserService')) {
                \Jankx\Services\BlockParserService::displayDebugInfo();
            }
            wp_die();
        });
    }
}
add_action('init', 'bookix_display_block_debug_info');
