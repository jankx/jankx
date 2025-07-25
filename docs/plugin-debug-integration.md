# Plugin Debug Integration Guide

## Overview

Jankx Debug System provides action hooks and filters that allow plugins to add their own debug information to the debug panel. This enables plugin developers to display relevant debugging information alongside the core Jankx debug data.

## Available Hooks

### 1. Action Hook: `jankx/debug/add_info`

This action hook allows plugins to add their debug information directly to the debug array.

```php
/**
 * Add plugin debug info using action hook
 */
add_action('jankx/debug/add_info', function(&$debugInfo) {
    // Add your debug info
    $debugInfo['My Plugin'] = 'Version 1.0.0, Active Features: 5';
});
```

### 2. Filter Hook: `jankx/debug/modify_info`

This filter hook allows plugins to modify the debug information array.

```php
/**
 * Add plugin debug info using filter hook
 */
add_filter('jankx/debug/modify_info', function($debugInfo) {
    $debugInfo['My Plugin'] = 'Version 1.0.0, Active Features: 5';
    return $debugInfo;
});
```

### 3. Helper Method: `Jankx\Debug\DebugInfo::addPluginDebugInfo()`

Jankx provides a helper method for easier integration.

```php
use Jankx\Debug\DebugInfo;

/**
 * Add plugin debug info using helper method
 */
add_action('jankx/debug/add_info', function(&$debugInfo) {
    DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Version 1.0.0, Active Features: 5');
});
```

## Complete Example

Here's a complete example of how a plugin can integrate with Jankx Debug System:

```php
<?php
/**
 * Plugin Name: My Debug Plugin
 * Description: Example plugin showing Jankx debug integration
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

class MyDebugPlugin {

    public function __construct() {
        // Only add debug info if Jankx debug is enabled
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            add_action('jankx/debug/add_info', [$this, 'addDebugInfo']);
        }
    }

    /**
     * Add debug information to Jankx debug panel
     *
     * @param array $debugInfo Reference to debug info array
     */
    public function addDebugInfo(&$debugInfo) {
        // Get plugin-specific debug data
        $activeFeatures = $this->getActiveFeatures();
        $pluginVersion = $this->getPluginVersion();
        $databaseRecords = $this->getDatabaseRecords();

        // Format debug information
        $debugInfo = sprintf(
            'Version %s, Active Features: %d, Database Records: %d',
            $pluginVersion,
            $activeFeatures,
            $databaseRecords
        );

        // Add to debug info array
        \Jankx\Debug\DebugInfo::addPluginDebugInfo($debugInfo, 'My Debug Plugin', $debugInfo);
    }

    /**
     * Get active features count
     *
     * @return int
     */
    private function getActiveFeatures() {
        // Your plugin logic here
        return 5;
    }

    /**
     * Get plugin version
     *
     * @return string
     */
    private function getPluginVersion() {
        return '1.0.0';
    }

    /**
     * Get database records count
     *
     * @return int
     */
    private function getDatabaseRecords() {
        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}my_plugin_table");
        return $count ?: 0;
    }
}

// Initialize the plugin
new MyDebugPlugin();
```

## Best Practices

### 1. Check Debug Mode

Always check if Jankx debug is enabled before adding debug information:

```php
if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
    add_action('jankx_debug_info', [$this, 'addDebugInfo']);
}
```

### 2. Keep Information Concise

Debug information should be concise and relevant:

```php
// Good
$debugInfo['My Plugin'] = 'Version 1.0.0, Active Users: 150';

// Avoid
$debugInfo['My Plugin'] = 'This plugin does many things and has lots of features and is very complex...';
```

### 3. Use Proper Escaping

Always escape user-generated content:

```php
$debugInfo['My Plugin'] = esc_html($userGeneratedContent);
```

### 4. Handle Errors Gracefully

Wrap debug information generation in try-catch blocks:

```php
public function addDebugInfo(&$debugInfo) {
    try {
        $info = $this->getDebugData();
        \Jankx\Debug\DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', $info);
    } catch (Exception $e) {
        \Jankx\Debug\DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Error: ' . $e->getMessage());
    }
}
```

## Debug Information Types

Consider adding these types of debug information:

### 1. Plugin Status
- Version information
- Active features
- Configuration status

### 2. Database Information
- Record counts
- Table sizes
- Query performance

### 3. Cache Information
- Cache hit rates
- Cache sizes
- Cache status

### 4. Performance Metrics
- Processing times
- Memory usage
- API call counts

### 5. Error Information
- Error counts
- Last error messages
- Error rates

## Integration Checklist

- [ ] Check if `JANKX_DEBUG` is defined and enabled
- [ ] Use proper action or filter hooks
- [ ] Escape user-generated content
- [ ] Handle errors gracefully
- [ ] Keep information concise and relevant
- [ ] Test integration thoroughly
- [ ] Document debug information format

## Troubleshooting

### Debug Information Not Showing

1. Check if `JANKX_DEBUG` is enabled
2. Verify hook priority and timing
3. Check for JavaScript errors in browser console
4. Ensure plugin is active and hooks are registered

### Performance Issues

1. Cache debug information generation
2. Limit database queries
3. Use efficient data collection methods
4. Consider lazy loading for heavy operations

## Support

For questions about Jankx Debug System integration, please refer to the main Jankx documentation or create an issue in the Jankx repository.