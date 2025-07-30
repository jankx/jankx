<?php
/**
 * Plugin Name: Jankx Debug Integration Example
 * Description: Example plugin showing how to integrate debug information with Jankx Debug System
 * Version: 1.0.0
 * Author: Jankx Team
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Example plugin class demonstrating Jankx Debug System integration
 * @since 2.0.0
 */
class JankxDebugIntegrationExample {

    /**
     * Plugin version
     *
     * @var string
     */
    private $version = '1.0.0';

    /**
     * Constructor
     * @since 2.0.0
     */
    public function __construct() {
        // Only add debug info if Jankx debug is enabled
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            add_action('jankx/debug/add_info', [$this, 'addDebugInfo']);
        }

        // Add some example data for demonstration
        add_action('init', [$this, 'initExampleData']);
    }

    /**
     * Initialize example data
     * @since 2.0.0
     */
    public function initExampleData() {
        // Create example data for demonstration
        if (!get_option('jankx_debug_example_data')) {
            $exampleData = [
                'active_features' => 5,
                'database_records' => 150,
                'cache_hits' => 1234,
                'cache_misses' => 56,
                'last_error' => null,
                'processing_time' => 0.045
            ];
            update_option('jankx_debug_example_data', $exampleData);
        }
    }

    /**
     * Add debug information to Jankx debug panel
     *
     * @param array $debugInfo Reference to debug info array
     * @since 2.0.0
     */
    public function addDebugInfo(&$debugInfo) {
        try {
            // Get plugin-specific debug data
            $data = $this->getDebugData();

            // Format debug information
            $info = sprintf(
                'Version %s, Features: %d, Records: %d, Cache: %d hits/%d misses, Processing: %.3fs',
                $this->version,
                $data['active_features'],
                $data['database_records'],
                $data['cache_hits'],
                $data['cache_misses'],
                $data['processing_time']
            );

            // Add error information if exists
            if ($data['last_error']) {
                $info .= ', Last Error: ' . $data['last_error'];
            }

            // Add to debug info array using helper method
            \Jankx\Debug\DebugInfo::addPluginDebugInfo($debugInfo, 'Debug Integration Example', $info);

        } catch (Exception $e) {
            // Handle errors gracefully
            \Jankx\Debug\DebugInfo::addPluginDebugInfo($debugInfo, 'Debug Integration Example', 'Error: ' . $e->getMessage());
        }
    }

    /**
     * Get debug data
     *
     * @return array
     * @since 2.0.0
     */
    private function getDebugData() {
        $data = get_option('jankx_debug_example_data', []);

        // Simulate some dynamic data
        $data['processing_time'] = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
        $data['cache_hits'] += rand(1, 10);
        $data['cache_misses'] += rand(0, 2);

        // Simulate occasional errors
        if (rand(1, 100) === 1) {
            $data['last_error'] = 'Simulated error at ' . date('H:i:s');
        }

        return $data;
    }

    /**
     * Get active features count
     *
     * @return int
     * @since 2.0.0
     */
    private function getActiveFeatures() {
        return 5; // Example value
    }

    /**
     * Get database records count
     *
     * @return int
     * @since 2.0.0
     */
    private function getDatabaseRecords() {
        global $wpdb;

        // Example query - replace with your actual table
        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = 'publish'");
        return $count ?: 0;
    }

    /**
     * Get cache statistics
     *
     * @return array
     * @since 2.0.0
     */
    private function getCacheStats() {
        // Example cache stats - replace with your actual cache implementation
        return [
            'hits' => rand(1000, 2000),
            'misses' => rand(50, 100)
        ];
    }
}

// Initialize the example plugin
new JankxDebugIntegrationExample();

/**
 * Alternative example using filter hook
 */
add_filter('jankx/debug/modify_info', function($debugInfo) {
    // Only add if Jankx debug is enabled
    if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
        $debugInfo['Filter Hook Example'] = 'Using filter hook instead of action hook';
    }
    return $debugInfo;
});

/**
 * Example of adding multiple debug entries
 */
add_action('jankx_debug_info', function(&$debugInfo) {
    // Only add if Jankx debug is enabled
    if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
        // Add multiple debug entries
        $debugInfo['Multi Entry Example 1'] = 'First debug entry';
        $debugInfo['Multi Entry Example 2'] = 'Second debug entry';
        $debugInfo['Multi Entry Example 3'] = 'Third debug entry with special chars: <>&"\'';
    }
});

/**
 * Example of adding debug info with HTML (not recommended for security)
 */
add_action('jankx_debug_info', function(&$debugInfo) {
    // Only add if Jankx debug is enabled
    if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
        // Note: This is just for demonstration - always escape user content in production
        $debugInfo['HTML Example'] = 'Status: <span style="color: green;">Active</span>';
    }
});

/**
 * Example of error handling in debug info
 */
add_action('jankx_debug_info', function(&$debugInfo) {
    // Only add if Jankx debug is enabled
    if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
        try {
            // Simulate some operation that might fail
            $result = $this->riskyOperation();
            $debugInfo['Error Handling Example'] = 'Operation successful: ' . $result;
        } catch (Exception $e) {
            $debugInfo['Error Handling Example'] = 'Operation failed: ' . $e->getMessage();
        }
    }
});

/**
 * Simulate a risky operation for error handling example
 */
function riskyOperation() {
    if (rand(1, 10) === 1) {
        throw new Exception('Random error occurred');
    }
    return 'Success';
}