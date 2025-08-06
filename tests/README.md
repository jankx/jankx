# Unit Tests for Jankx Framework

Hệ thống unit tests cho Jankx Framework, bao gồm tests cho Theme Options System.

## Cấu trúc Tests

```
tests/
├── App/
│   ├── Services/
│   │   └── ThemeOptionsServiceTest.php
│   └── Providers/
│       └── ThemeOptionsServiceProviderTest.php
├── helpers/
│   └── TestCase.php
├── bootstrap.php
└── README.md
```

## Chạy Tests

### 1. Chạy tất cả tests

```bash
# Chạy tất cả tests
./vendor/bin/phpunit

# Chạy với coverage
./vendor/bin/phpunit --coverage-html coverage/html

# Chạy với verbose output
./vendor/bin/phpunit --verbose
```

### 2. Chạy specific test suite

```bash
# Chạy App tests
./vendor/bin/phpunit --testsuite App

# Chạy Services tests
./vendor/bin/phpunit --testsuite Services

# Chạy Providers tests
./vendor/bin/phpunit --testsuite Providers
```

### 3. Chạy specific test file

```bash
# Chạy ThemeOptionsServiceTest
./vendor/bin/phpunit tests/App/Services/ThemeOptionsServiceTest.php

# Chạy ThemeOptionsServiceProviderTest
./vendor/bin/phpunit tests/App/Providers/ThemeOptionsServiceProviderTest.php
```

### 4. Chạy specific test method

```bash
# Chạy specific test method
./vendor/bin/phpunit --filter test_constructor_sets_app_property
```

## Test Coverage

### ThemeOptionsService Tests

| Test Method | Description |
|-------------|-------------|
| `test_constructor_sets_app_property` | Kiểm tra constructor set app property |
| `test_constructor_sets_options_path` | Kiểm tra constructor set options path |
| `test_constructor_sets_option_name` | Kiểm tra constructor set option name |
| `test_init_calls_init_option_adapter` | Kiểm tra init() gọi initOptionAdapter() |
| `test_init_calls_create_sections_for_adapter` | Kiểm tra init() gọi createSectionsForAdapter() |
| `test_init_option_adapter_sets_adapter` | Kiểm tra initOptionAdapter() set adapter |
| `test_init_option_adapter_sets_options_for_adapter` | Kiểm tra initOptionAdapter() set options |
| `test_create_sections_for_adapter_calls_adapter_create_sections` | Kiểm tra createSectionsForAdapter() gọi adapter |
| `test_get_option_returns_adapter_value` | Kiểm tra getOption() trả về adapter value |
| `test_get_option_returns_default_when_no_adapter` | Kiểm tra getOption() trả về default khi không có adapter |
| `test_register_admin_menu_calls_adapter_register_admin_menu` | Kiểm tra registerAdminMenu() gọi adapter |
| `test_register_admin_menu_creates_direct_menu_when_no_adapter` | Kiểm tra registerAdminMenu() tạo direct menu |
| `test_get_current_framework_mode_returns_framework_mode` | Kiểm tra getCurrentFrameworkMode() |
| `test_get_name_returns_service_name` | Kiểm tra getName() |
| `test_get_options_data_returns_options_data` | Kiểm tra getOptionsData() |
| `test_get_adapter_returns_adapter` | Kiểm tra getAdapter() |
| `test_get_adapter_returns_null_when_not_initialized` | Kiểm tra getAdapter() trả về null |
| `test_render_options_page_outputs_html` | Kiểm tra renderOptionsPage() output HTML |
| `test_load_options_data_loads_pages_file` | Kiểm tra loadOptionsData() load pages file |
| `test_setup_options_for_adapter_sets_correct_args` | Kiểm tra setupOptionsForAdapter() set args |
| `test_setup_options_for_adapter_does_nothing_when_no_adapter` | Kiểm tra setupOptionsForAdapter() không làm gì |
| `test_create_sections_for_adapter_handles_exception` | Kiểm tra exception handling |
| `test_register_admin_menu_handles_exception` | Kiểm tra exception handling |
| `test_constructor_handles_framework_error` | Kiểm tra constructor handle framework error |

### ThemeOptionsServiceProvider Tests

| Test Method | Description |
|-------------|-------------|
| `test_register_registers_theme_options_service` | Kiểm tra register() đăng ký service |
| `test_register_registers_service_alias` | Kiểm tra register() đăng ký alias |
| `test_boot_registers_init_hook` | Kiểm tra boot() đăng ký init hook |
| `test_boot_registers_admin_menu_hook` | Kiểm tra boot() đăng ký admin_menu hook |
| `test_init_hook_calls_service_init` | Kiểm tra init hook gọi service init() |
| `test_admin_menu_hook_calls_service_register_admin_menu` | Kiểm tra admin_menu hook gọi service |
| `test_init_hook_handles_exception` | Kiểm tra init hook handle exception |
| `test_admin_menu_hook_handles_exception` | Kiểm tra admin_menu hook handle exception |
| `test_service_singleton_creates_theme_options_service` | Kiểm tra singleton tạo service |
| `test_boot_logs_debug_messages` | Kiểm tra boot() log debug messages |
| `test_init_hook_logs_debug_messages` | Kiểm tra init hook log debug messages |
| `test_admin_menu_hook_logs_debug_messages` | Kiểm tra admin_menu hook log debug messages |
| `test_exception_in_init_hook_logs_error` | Kiểm tra exception trong init hook log error |
| `test_exception_in_admin_menu_hook_logs_error` | Kiểm tra exception trong admin_menu hook log error |
| `test_provider_extends_service_provider` | Kiểm tra provider extend ServiceProvider |
| `test_provider_has_register_method` | Kiểm tra provider có register method |
| `test_provider_has_boot_method` | Kiểm tra provider có boot method |
| `test_register_method_accepts_application_parameter` | Kiểm tra register method accept Application parameter |
| `test_boot_method_accepts_application_parameter` | Kiểm tra boot method accept Application parameter |

## Mocking Strategy

### 1. WordPress Functions

Tất cả WordPress functions được mock trong `bootstrap.php`:

```php
if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {
        return true;
    }
}
```

### 2. Framework Classes

Sử dụng Mockery để mock framework classes:

```php
// Mock OptionFramework
$mockFramework = Mockery::mock('alias:' . OptionFramework::class);
$mockFramework->shouldReceive('getInstance')->andReturnSelf();
$mockFramework->shouldReceive('loadFramework')->andReturnSelf();
$mockFramework->shouldReceive('getActiveFramework')->andReturn($this->mockAdapter);
```

### 3. Adapter Interface

Mock adapter interface để test service behavior:

```php
// Mock adapter
$this->mockAdapter = Mockery::mock('Jankx\Adapter\Options\Interfaces\Adapter');
$this->mockAdapter->shouldReceive('setArgs')->andReturnSelf();
$this->mockAdapter->shouldReceive('createSections')->andReturnSelf();
$this->mockAdapter->shouldReceive('register_admin_menu')->andReturnSelf();
$this->mockAdapter->shouldReceive('getOption')->andReturn('test_value');
```

## Test Helpers

### 1. Base TestCase

`tests/helpers/TestCase.php` cung cấp common functionality:

- **Reflection helpers**: `getProtectedProperty()`, `setProtectedProperty()`, `callProtectedMethod()`
- **Assertion helpers**: `assertHasMethod()`, `assertHasProperty()`, `assertExtends()`, `assertImplements()`
- **WordPress mocks**: `createMockPost()`, `createMockUser()`, `createMockTerm()`
- **File helpers**: `createTempFile()`, `cleanupTempFiles()`

### 2. Usage Examples

```php
// Test protected method
$result = $this->callProtectedMethod($service, 'loadOptionsData');

// Test protected property
$value = $this->getProtectedProperty($service, 'optionsPath');

// Test class structure
$this->assertHasMethod(ThemeOptionsService::class, 'init');
$this->assertHasProperty(ThemeOptionsService::class, 'app');
$this->assertExtends(ThemeOptionsServiceProvider::class, ServiceProvider::class);
```

## Configuration

### 1. PHPUnit Configuration

`phpunit.xml` cấu hình:

- **Test suites**: App, Services, Providers
- **Coverage**: HTML và text reports
- **Environment**: Testing environment variables
- **Bootstrap**: `tests/bootstrap.php`

### 2. Bootstrap File

`tests/bootstrap.php` thiết lập:

- **WordPress constants**: ABSPATH, WP_CONTENT_DIR, etc.
- **WordPress functions**: Mock tất cả WordPress functions
- **Autoloader**: Load Composer autoloader
- **Error reporting**: Set up cho testing
- **Timezone**: UTC cho consistency

## Best Practices

### 1. Test Organization

- **One test per method**: Mỗi test method test một functionality
- **Descriptive names**: Test method names mô tả rõ ràng
- **Arrange-Act-Assert**: Follow AAA pattern
- **Isolation**: Tests không phụ thuộc lẫn nhau

### 2. Mocking Guidelines

- **Mock external dependencies**: WordPress functions, external APIs
- **Don't mock internal logic**: Test actual business logic
- **Use meaningful return values**: Mock return values phải realistic
- **Verify interactions**: Kiểm tra method calls và parameters

### 3. Assertion Strategy

- **Test behavior, not implementation**: Focus on what, not how
- **Use specific assertions**: `assertEquals()` thay vì `assertTrue()`
- **Test edge cases**: Exception handling, null values, empty arrays
- **Test error conditions**: Invalid input, missing dependencies

### 4. Coverage Goals

- **100% method coverage**: Tất cả public methods được test
- **90% line coverage**: Tất cả important code paths
- **100% branch coverage**: Tất cả conditional logic
- **Exception paths**: Test error handling và edge cases

## Continuous Integration

### 1. GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
      - name: Install dependencies
        run: composer install
      - name: Run tests
        run: ./vendor/bin/phpunit
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

### 2. Local Development

```bash
# Run tests before commit
./vendor/bin/phpunit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/html

# Run specific test
./vendor/bin/phpunit --filter test_constructor_sets_app_property
```

## Troubleshooting

### 1. Common Issues

- **Mockery not found**: Install Mockery via Composer
- **WordPress functions not mocked**: Check bootstrap.php
- **Protected method access**: Use reflection helpers
- **File system issues**: Use temp files và cleanup

### 2. Debug Tips

- **Verbose output**: `./vendor/bin/phpunit --verbose`
- **Stop on failure**: `./vendor/bin/phpunit --stop-on-failure`
- **Filter tests**: `./vendor/bin/phpunit --filter test_name`
- **Coverage report**: Check `coverage/html/index.html`

## Related Documentation

- [Theme Options Overview](../docs/options/readme.md)
- [Redux Framework Options](../docs/options/redux-framework-options.md)
- [Option Adapter Documentation](../vendor/jankx/option-adapter/README.md)
- [Dashboard Framework Documentation](../vendor/jankx/dashboard-framework/README.md)