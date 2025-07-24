# Developing Custom CLI Commands

Hướng dẫn chi tiết về cách phát triển custom CLI commands cho Jankx framework.

## 🎯 **Overview**

Jankx framework cung cấp một hệ thống CLI mạnh mẽ cho phép developers tạo và quản lý custom commands một cách dễ dàng.

## 🏗️ **Architecture**

### **CLI System Components**

```
CLIKernel
├── CLIBootstrapper
├── ContextualServiceProvider
└── Custom Commands
    ├── Information Commands
    ├── Management Commands
    └── Utility Commands
```

### **Command Registration Flow**

1. **CLI Kernel Initialization**
2. **Bootstrapper Loading**
3. **Service Registration**
4. **Command Registration**
5. **Hook Execution**

## 🚀 **Creating Custom Commands**

### **Method 1: Direct Registration**

```php
<?php
// Trong functions.php hoặc plugin file

add_action('jankx_wpcli_register_commands', function() {
    // Register custom command
    \WP_CLI::add_command('jankx custom', 'CustomJankxCommand');
});

class CustomJankxCommand
{
    public function __invoke($args, $assoc_args)
    {
        // Command logic here
        \WP_CLI::line('Custom command executed!');
    }
}
```

### **Method 2: Using Jankx Hooks**

```php
<?php
// Trong child theme hoặc plugin

add_action('jankx_cli_initialized', function() {
    // Register commands after CLI initialization
    \WP_CLI::add_command('jankx theme:info', 'ThemeInfoCommand');
});

class ThemeInfoCommand
{
    public function __invoke($args, $assoc_args)
    {
        $theme = wp_get_theme();
        \WP_CLI::line("Theme: {$theme->get('Name')}");
        \WP_CLI::line("Version: {$theme->get('Version')}");
    }
}
```

### **Method 3: Service-Based Commands**

```php
<?php
// Trong service provider

class CustomCLIServiceProvider
{
    public function register()
    {
        add_action('jankx_wpcli_register_commands', [$this, 'registerCommands']);
    }

    public function registerCommands()
    {
        \WP_CLI::add_command('jankx cache:clear', [$this, 'clearCache']);
        \WP_CLI::add_command('jankx optimize', [$this, 'optimize']);
    }

    public function clearCache($args, $assoc_args)
    {
        // Clear cache logic
        \WP_CLI::success('Cache cleared successfully!');
    }

    public function optimize($args, $assoc_args)
    {
        // Optimization logic
        \WP_CLI::line('Optimization completed!');
    }
}
```

## 📋 **Command Structure**

### **Basic Command Template**

```php
class ExampleCommand
{
    /**
     * Command description
     *
     * ## OPTIONS
     *
     * [--format=<format>]
     * : Output format (table, csv, json, count)
     *
     * [--fields=<fields>]
     * : Limit the output to specific object fields
     *
     * ## EXAMPLES
     *
     *     wp jankx example
     *     wp jankx example --format=json
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function __invoke($args, $assoc_args)
    {
        // Validate arguments
        $this->validateArgs($args, $assoc_args);

        // Execute command logic
        $result = $this->execute($args, $assoc_args);

        // Display results
        $this->displayResults($result, $assoc_args);
    }

    private function validateArgs($args, $assoc_args)
    {
        // Validation logic
    }

    private function execute($args, $assoc_args)
    {
        // Main execution logic
        return [];
    }

    private function displayResults($result, $assoc_args)
    {
        $format = $assoc_args['format'] ?? 'table';

        switch ($format) {
            case 'json':
                \WP_CLI::line(json_encode($result));
                break;
            case 'csv':
                $this->displayCSV($result);
                break;
            default:
                $this->displayTable($result);
        }
    }
}
```

### **Advanced Command with Options**

```php
class AdvancedCommand
{
    /**
     * Advanced command with multiple options
     *
     * ## OPTIONS
     *
     * [--dry-run]
     * : Show what would be done without making changes
     *
     * [--force]
     * : Force execution without confirmation
     *
     * [--verbose]
     * : Show detailed output
     *
     * ## EXAMPLES
     *
     *     wp jankx advanced --dry-run
     *     wp jankx advanced --force --verbose
     */
    public function __invoke($args, $assoc_args)
    {
        $dry_run = \WP_CLI\Utils\get_flag_value($assoc_args, 'dry-run', false);
        $force = \WP_CLI\Utils\get_flag_value($assoc_args, 'force', false);
        $verbose = \WP_CLI\Utils\get_flag_value($assoc_args, 'verbose', false);

        if ($verbose) {
            \WP_CLI::line('Starting advanced command...');
        }

        if (!$force && !$dry_run) {
            \WP_CLI::confirm('Are you sure you want to proceed?');
        }

        if ($dry_run) {
            \WP_CLI::line('DRY RUN: Would execute command...');
            return;
        }

        // Execute command
        $this->executeCommand($args, $assoc_args);
    }
}
```

## 🎨 **Output Formatting**

### **Basic Output Methods**

```php
// Simple line output
\WP_CLI::line('This is a simple line');

// Success message (green)
\WP_CLI::success('Operation completed successfully!');

// Warning message (yellow)
\WP_CLI::warning('This is a warning message');

// Error message (red)
\WP_CLI::error('An error occurred');

// Info message (blue)
\WP_CLI::info('This is an info message');
```

### **Table Output**

```php
private function displayTable($data)
{
    $table = new \WP_CLI\Formatter($assoc_args, ['ID', 'Name', 'Status']);

    foreach ($data as $item) {
        $table->add_row([
            $item['id'],
            $item['name'],
            $item['status']
        ]);
    }

    $table->display();
}
```

### **Progress Indicators**

```php
private function showProgress($total, $current)
{
    $progress = \WP_CLI\Utils\make_progress_bar('Processing items', $total);

    foreach ($items as $item) {
        // Process item
        $this->processItem($item);

        // Update progress
        $progress->tick();
    }

    $progress->finish();
}
```

## 🔧 **Integration with Jankx Services**

### **Using Jankx Container**

```php
class ServiceBasedCommand
{
    public function __invoke($args, $assoc_args)
    {
        // Get Jankx container
        $container = \Jankx\Jankx::getInstance();

        // Use services
        $config = $container->make(\Jankx\Config\ConfigManager::class);
        $logger = $container->make(\Jankx\Logger\Logger::class);

        // Execute with services
        $result = $this->executeWithServices($config, $logger);

        \WP_CLI::success('Command executed with services!');
    }
}
```

### **Using Jankx Facades**

```php
class FacadeBasedCommand
{
    public function __invoke($args, $assoc_args)
    {
        // Use Jankx facades
        $version = \Jankx\Facades\Kernel::getFrameworkVersion();
        $config = \Jankx\Facades\Options::get('some_option');

        \WP_CLI::line("Framework version: {$version}");
        \WP_CLI::line("Config value: {$config}");
    }
}
```

## 🧪 **Testing Commands**

### **Unit Testing**

```php
class CommandTest extends \WP_UnitTestCase
{
    public function test_custom_command()
    {
        // Mock WP_CLI
        $this->mock_wp_cli();

        // Execute command
        $command = new CustomCommand();
        $command->__invoke([], []);

        // Assertions
        $this->assertTrue($this->output_contains('success'));
    }

    private function mock_wp_cli()
    {
        // Mock WP_CLI methods
    }
}
```

### **Integration Testing**

```php
class CommandIntegrationTest extends \WP_UnitTestCase
{
    public function test_command_with_services()
    {
        // Setup Jankx container
        $container = \Jankx\Jankx::getInstance();

        // Register test services
        $container->singleton('test.service', TestService::class);

        // Execute command
        $command = new ServiceBasedCommand();
        $result = $command->__invoke([], []);

        // Assertions
        $this->assertNotNull($result);
    }
}
```

## 📚 **Best Practices**

### **Command Design**

1. **Single Responsibility** - Mỗi command chỉ làm một việc
2. **Clear Naming** - Tên command rõ ràng và mô tả
3. **Proper Help** - Cung cấp help text đầy đủ
4. **Error Handling** - Xử lý lỗi gracefully
5. **Validation** - Validate input arguments

### **Performance**

1. **Lazy Loading** - Load services khi cần
2. **Batch Processing** - Xử lý hàng loạt cho large datasets
3. **Progress Indicators** - Hiển thị tiến trình cho long-running commands
4. **Memory Management** - Quản lý memory cho large operations

### **Security**

1. **Permission Checks** - Kiểm tra quyền trước khi thực thi
2. **Input Validation** - Validate tất cả input
3. **Sanitization** - Sanitize output
4. **Logging** - Log important actions

## 🚀 **Advanced Features**

### **Interactive Commands**

```php
class InteractiveCommand
{
    public function __invoke($args, $assoc_args)
    {
        // Get user input
        $name = \WP_CLI\Utils\prompt('Enter your name');
        $email = \WP_CLI\Utils\prompt('Enter your email');

        // Confirm action
        $confirm = \WP_CLI\Utils\confirm('Proceed with these details?');

        if ($confirm) {
            // Process with user input
            $this->processUserInput($name, $email);
        }
    }
}
```

### **Batch Processing**

```php
class BatchCommand
{
    public function __invoke($args, $assoc_args)
    {
        $items = $this->getItems();
        $batch_size = 100;

        $progress = \WP_CLI\Utils\make_progress_bar('Processing items', count($items));

        foreach (array_chunk($items, $batch_size) as $batch) {
            $this->processBatch($batch);
            $progress->tick(count($batch));
        }

        $progress->finish();
    }
}
```

## 📖 **Documentation**

### **Command Documentation Template**

```php
/**
 * Command description
 *
 * ## OPTIONS
 *
 * [--option=<value>]
 * : Option description
 *
 * ## EXAMPLES
 *
 *     wp jankx example
 *     wp jankx example --option=value
 *
 * ## GLOBAL PARAMETERS
 *
 * [--format=<format>]
 * : Output format (table, csv, json, count)
 *
 * [--fields=<fields>]
 * : Limit the output to specific object fields
 */
```

---

**Custom CLI Commands Development** - Tạo powerful commands cho Jankx framework! 🚀