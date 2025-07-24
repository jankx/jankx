# CLI Commands Examples

Các ví dụ thực tế về cách sử dụng và phát triển CLI commands cho Jankx framework.

## 🚀 **Basic Examples**

### **Theme Information Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx theme:info', 'ThemeInfoCommand');
});

class ThemeInfoCommand
{
    /**
     * Display theme information
     *
     * ## EXAMPLES
     *
     *     wp jankx theme:info
     */
    public function __invoke($args, $assoc_args)
    {
        $theme = wp_get_theme();

        \WP_CLI::line('Theme Information:');
        \WP_CLI::line("Name: {$theme->get('Name')}");
        \WP_CLI::line("Version: {$theme->get('Version')}");
        \WP_CLI::line("Description: {$theme->get('Description')}");
        \WP_CLI::line("Author: {$theme->get('Author')}");
        \WP_CLI::line("Text Domain: {$theme->get('TextDomain')}");
    }
}
```

**Usage:**
```bash
wp jankx theme:info
```

**Output:**
```
Theme Information:
Name: Bookix
Version: 2.0.0
Description: A modern WordPress theme framework
Author: Puleeno Nguyen
Text Domain: bookix
```

### **Cache Management Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx cache:clear', 'CacheClearCommand');
    \WP_CLI::add_command('jankx cache:status', 'CacheStatusCommand');
});

class CacheClearCommand
{
    /**
     * Clear all caches
     *
     * ## OPTIONS
     *
     * [--type=<type>]
     * : Cache type to clear (all, object, transient, page)
     *
     * ## EXAMPLES
     *
     *     wp jankx cache:clear
     *     wp jankx cache:clear --type=object
     */
    public function __invoke($args, $assoc_args)
    {
        $type = $assoc_args['type'] ?? 'all';

        switch ($type) {
            case 'object':
                wp_cache_flush();
                \WP_CLI::success('Object cache cleared!');
                break;
            case 'transient':
                $this->clearTransients();
                \WP_CLI::success('Transients cleared!');
                break;
            case 'page':
                $this->clearPageCache();
                \WP_CLI::success('Page cache cleared!');
                break;
            default:
                wp_cache_flush();
                $this->clearTransients();
                $this->clearPageCache();
                \WP_CLI::success('All caches cleared!');
        }
    }

    private function clearTransients()
    {
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_%'");
    }

    private function clearPageCache()
    {
        // Clear page cache logic
        if (function_exists('w3tc_flush_all')) {
            w3tc_flush_all();
        }
    }
}

class CacheStatusCommand
{
    /**
     * Show cache status
     */
    public function __invoke($args, $assoc_args)
    {
        \WP_CLI::line('Cache Status:');
        \WP_CLI::line('Object Cache: ' . (wp_using_ext_object_cache() ? 'Enabled' : 'Disabled'));
        \WP_CLI::line('Page Cache: ' . ($this->hasPageCache() ? 'Enabled' : 'Disabled'));
        \WP_CLI::line('Transients: ' . $this->getTransientCount() . ' items');
    }

    private function hasPageCache()
    {
        return function_exists('w3tc_flush_all') || function_exists('wp_cache_flush');
    }

    private function getTransientCount()
    {
        global $wpdb;
        return $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->options} WHERE option_name LIKE '_transient_%'");
    }
}
```

## 🔧 **Advanced Examples**

### **Database Optimization Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx db:optimize', 'DatabaseOptimizeCommand');
});

class DatabaseOptimizeCommand
{
    /**
     * Optimize database tables
     *
     * ## OPTIONS
     *
     * [--tables=<tables>]
     * : Specific tables to optimize (comma-separated)
     *
     * [--dry-run]
     * : Show what would be done without making changes
     *
     * ## EXAMPLES
     *
     *     wp jankx db:optimize
     *     wp jankx db:optimize --tables=wp_posts,wp_options
     *     wp jankx db:optimize --dry-run
     */
    public function __invoke($args, $assoc_args)
    {
        global $wpdb;

        $dry_run = \WP_CLI\Utils\get_flag_value($assoc_args, 'dry-run', false);
        $tables = $assoc_args['tables'] ?? '';

        if ($dry_run) {
            \WP_CLI::line('DRY RUN: Would optimize database tables...');
            return;
        }

        if (!empty($tables)) {
            $table_list = explode(',', $tables);
            $this->optimizeSpecificTables($table_list);
        } else {
            $this->optimizeAllTables();
        }
    }

    private function optimizeAllTables()
    {
        global $wpdb;

        $tables = $wpdb->get_results("SHOW TABLES", ARRAY_N);
        $progress = \WP_CLI\Utils\make_progress_bar('Optimizing tables', count($tables));

        foreach ($tables as $table) {
            $table_name = $table[0];
            $wpdb->query("OPTIMIZE TABLE {$table_name}");
            $progress->tick();
        }

        $progress->finish();
        \WP_CLI::success('All tables optimized!');
    }

    private function optimizeSpecificTables($tables)
    {
        global $wpdb;

        foreach ($tables as $table) {
            $table_name = trim($table);
            if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'")) {
                $wpdb->query("OPTIMIZE TABLE {$table_name}");
                \WP_CLI::line("Optimized table: {$table_name}");
            } else {
                \WP_CLI::warning("Table not found: {$table_name}");
            }
        }

        \WP_CLI::success('Specified tables optimized!');
    }
}
```

### **Performance Analysis Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx performance:analyze', 'PerformanceAnalyzeCommand');
});

class PerformanceAnalyzeCommand
{
    /**
     * Analyze website performance
     *
     * ## OPTIONS
     *
     * [--url=<url>]
     * : URL to analyze (default: home page)
     *
     * [--format=<format>]
     * : Output format (table, json)
     *
     * ## EXAMPLES
     *
     *     wp jankx performance:analyze
     *     wp jankx performance:analyze --url=https://example.com
     *     wp jankx performance:analyze --format=json
     */
    public function __invoke($args, $assoc_args)
    {
        $url = $assoc_args['url'] ?? get_home_url();
        $format = $assoc_args['format'] ?? 'table';

        \WP_CLI::line("Analyzing performance for: {$url}");

        $metrics = $this->analyzePerformance($url);

        if ($format === 'json') {
            \WP_CLI::line(json_encode($metrics, JSON_PRETTY_PRINT));
        } else {
            $this->displayMetricsTable($metrics);
        }
    }

    private function analyzePerformance($url)
    {
        $start_time = microtime(true);

        // Simulate performance analysis
        $metrics = [
            'url' => $url,
            'load_time' => $this->measureLoadTime($url),
            'memory_usage' => memory_get_usage(true),
            'peak_memory' => memory_get_peak_usage(true),
            'database_queries' => $this->getQueryCount(),
            'cache_hit_rate' => $this->getCacheHitRate(),
            'optimization_score' => $this->calculateOptimizationScore(),
        ];

        $metrics['analysis_time'] = microtime(true) - $start_time;

        return $metrics;
    }

    private function measureLoadTime($url)
    {
        // Simulate load time measurement
        return rand(100, 500) / 1000; // 0.1 to 0.5 seconds
    }

    private function getQueryCount()
    {
        global $wpdb;
        return $wpdb->num_queries ?? 0;
    }

    private function getCacheHitRate()
    {
        // Simulate cache hit rate
        return rand(70, 95); // 70% to 95%
    }

    private function calculateOptimizationScore()
    {
        // Simulate optimization score calculation
        return rand(60, 95); // 60 to 95
    }

    private function displayMetricsTable($metrics)
    {
        $table = new \WP_CLI\Formatter([], ['Metric', 'Value']);

        foreach ($metrics as $metric => $value) {
            if ($metric === 'url') continue;

            $formatted_value = is_numeric($value) ? number_format($value, 3) : $value;
            $table->add_row([ucfirst(str_replace('_', ' ', $metric)), $formatted_value]);
        }

        $table->display();
    }
}
```

## 🛠️ **Utility Examples**

### **Plugin Management Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx plugin:list', 'PluginListCommand');
    \WP_CLI::add_command('jankx plugin:status', 'PluginStatusCommand');
});

class PluginListCommand
{
    /**
     * List all plugins with status
     *
     * ## OPTIONS
     *
     * [--status=<status>]
     * : Filter by status (active, inactive, network-active)
     *
     * [--format=<format>]
     * : Output format (table, csv, json)
     *
     * ## EXAMPLES
     *
     *     wp jankx plugin:list
     *     wp jankx plugin:list --status=active
     *     wp jankx plugin:list --format=json
     */
    public function __invoke($args, $assoc_args)
    {
        $status = $assoc_args['status'] ?? '';
        $format = $assoc_args['format'] ?? 'table';

        $plugins = get_plugins();
        $active_plugins = get_option('active_plugins', []);

        $plugin_data = [];
        foreach ($plugins as $plugin_file => $plugin_info) {
            $is_active = in_array($plugin_file, $active_plugins);

            if (!empty($status) && $status === 'active' && !$is_active) {
                continue;
            }

            $plugin_data[] = [
                'name' => $plugin_info['Name'],
                'version' => $plugin_info['Version'],
                'status' => $is_active ? 'Active' : 'Inactive',
                'description' => $plugin_info['Description'],
            ];
        }

        if ($format === 'json') {
            \WP_CLI::line(json_encode($plugin_data, JSON_PRETTY_PRINT));
        } else {
            $this->displayPluginTable($plugin_data);
        }
    }

    private function displayPluginTable($plugins)
    {
        $table = new \WP_CLI\Formatter([], ['Name', 'Version', 'Status', 'Description']);

        foreach ($plugins as $plugin) {
            $table->add_row([
                $plugin['name'],
                $plugin['version'],
                $plugin['status'],
                substr($plugin['description'], 0, 50) . '...'
            ]);
        }

        $table->display();
    }
}

class PluginStatusCommand
{
    /**
     * Show plugin statistics
     */
    public function __invoke($args, $assoc_args)
    {
        $plugins = get_plugins();
        $active_plugins = get_option('active_plugins', []);

        $total_plugins = count($plugins);
        $active_count = count($active_plugins);
        $inactive_count = $total_plugins - $active_count;

        \WP_CLI::line('Plugin Statistics:');
        \WP_CLI::line("Total Plugins: {$total_plugins}");
        \WP_CLI::line("Active Plugins: {$active_count}");
        \WP_CLI::line("Inactive Plugins: {$inactive_count}");
        \WP_CLI::line("Activation Rate: " . round(($active_count / $total_plugins) * 100, 1) . '%');
    }
}
```

### **User Management Command**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx user:list', 'UserListCommand');
    \WP_CLI::add_command('jankx user:stats', 'UserStatsCommand');
});

class UserListCommand
{
    /**
     * List users with details
     *
     * ## OPTIONS
     *
     * [--role=<role>]
     * : Filter by user role
     *
     * [--limit=<number>]
     * : Limit number of users to display
     *
     * ## EXAMPLES
     *
     *     wp jankx user:list
     *     wp jankx user:list --role=administrator
     *     wp jankx user:list --limit=10
     */
    public function __invoke($args, $assoc_args)
    {
        $role = $assoc_args['role'] ?? '';
        $limit = $assoc_args['limit'] ?? 20;

        $args = [
            'number' => $limit,
            'orderby' => 'registered',
            'order' => 'DESC'
        ];

        if (!empty($role)) {
            $args['role'] = $role;
        }

        $users = get_users($args);

        $table = new \WP_CLI\Formatter([], ['ID', 'Username', 'Email', 'Role', 'Registered']);

        foreach ($users as $user) {
            $user_roles = $user->roles;
            $role_name = !empty($user_roles) ? ucfirst($user_roles[0]) : 'No Role';

            $table->add_row([
                $user->ID,
                $user->user_login,
                $user->user_email,
                $role_name,
                date('Y-m-d', strtotime($user->user_registered))
            ]);
        }

        $table->display();
    }
}

class UserStatsCommand
{
    /**
     * Show user statistics
     */
    public function __invoke($args, $assoc_args)
    {
        $total_users = count_users();
        $user_counts = $total_users['avail_roles'];

        \WP_CLI::line('User Statistics:');
        \WP_CLI::line("Total Users: {$total_users['total_users']}");

        foreach ($user_counts as $role => $count) {
            $role_name = ucfirst($role);
            \WP_CLI::line("{$role_name}s: {$count}");
        }

        // Recent registrations
        $recent_users = get_users([
            'number' => 5,
            'orderby' => 'registered',
            'order' => 'DESC'
        ]);

        \WP_CLI::line("\nRecent Registrations:");
        foreach ($recent_users as $user) {
            \WP_CLI::line("- {$user->user_login} ({$user->user_email}) - " . date('Y-m-d', strtotime($user->user_registered)));
        }
    }
}
```

## 🎯 **Integration Examples**

### **Jankx Service Integration**

```php
<?php
// Trong functions.php hoặc plugin

add_action('jankx_wpcli_register_commands', function() {
    \WP_CLI::add_command('jankx service:list', 'ServiceListCommand');
    \WP_CLI::add_command('jankx service:status', 'ServiceStatusCommand');
});

class ServiceListCommand
{
    /**
     * List registered Jankx services
     */
    public function __invoke($args, $assoc_args)
    {
        $container = \Jankx\Jankx::getInstance();

        \WP_CLI::line('Registered Jankx Services:');

        // Get service bindings (simplified)
        $services = [
            'Config Manager' => \Jankx\Config\ConfigManager::class,
            'Logger' => \Jankx\Logger\Logger::class,
            'Security Manager' => \Jankx\Security\SecurityManager::class,
            'Performance Monitor' => \Jankx\Performance\PerformanceMonitor::class,
        ];

        $table = new \WP_CLI\Formatter([], ['Service', 'Class', 'Status']);

        foreach ($services as $name => $class) {
            $status = class_exists($class) ? 'Available' : 'Not Found';
            $table->add_row([$name, $class, $status]);
        }

        $table->display();
    }
}

class ServiceStatusCommand
{
    /**
     * Show Jankx service status
     */
    public function __invoke($args, $assoc_args)
    {
        \WP_CLI::line('Jankx Service Status:');

        // Check framework status
        $framework_version = \Jankx\Jankx::getFrameworkVersion();
        \WP_CLI::line("Framework Version: {$framework_version}");

        // Check container status
        $container = \Jankx\Jankx::getInstance();
        \WP_CLI::line("Container Status: " . ($container ? 'Active' : 'Inactive'));

        // Check kernel status
        $kernel_status = defined('JANKX_KERNEL_LOADED') ? 'Loaded' : 'Not Loaded';
        \WP_CLI::line("Kernel Status: {$kernel_status}");

        // Check bootstrapper status
        $bootstrapper_status = has_action('jankx_cli_initialized') ? 'Registered' : 'Not Registered';
        \WP_CLI::line("Bootstrapper Status: {$bootstrapper_status}");
    }
}
```

---

**CLI Commands Examples** - Các ví dụ thực tế cho Jankx framework! 🚀