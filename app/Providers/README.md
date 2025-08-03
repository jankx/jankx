# Application Service Providers

## Tổng quan

Thư mục `app/Providers/` là nơi để bạn implement các service providers riêng của mình để xử lý các tác vụ và chức năng tự phát triển cho theme.

## Cấu trúc

```
app/Providers/
├── README.md                    # Documentation này
├── CustomServiceProvider.php    # Ví dụ custom provider
└── ThemeCustomProvider.php      # Provider cho theme-specific features
```

## Tạo Custom Service Provider

### 1. Tạo Provider Class

```php
<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class CustomServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register your services here
        $this->app->singleton('custom.service', function ($app) {
            return new CustomService();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize your services here
        add_action('init', [$this, 'initializeCustomFeatures']);
    }

    /**
     * Initialize custom features
     *
     * @return void
     */
    public function initializeCustomFeatures()
    {
        // Your custom initialization logic
    }
}
```

### 2. Đăng ký Provider

Thêm provider vào `config/providers.php`:

```php
<?php

return [
    'http' => [
        'frontend' => [
            // ... existing providers
            App\Providers\CustomServiceProvider::class,
        ],
        'admin' => [
            // ... existing providers
            App\Providers\CustomServiceProvider::class,
        ],
    ],
];
```

## Ví dụ Use Cases

### 1. Custom Post Types Provider

```php
<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class CustomPostTypesProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register custom post type services
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerCustomPostTypes']);
    }

    public function registerCustomPostTypes()
    {
        register_post_type('custom_type', [
            'labels' => [
                'name' => 'Custom Types',
                'singular_name' => 'Custom Type',
            ],
            'public' => true,
            'has_archive' => true,
        ]);
    }
}
```

### 2. Custom Widgets Provider

```php
<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class CustomWidgetsProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register widget services
    }

    public function boot(Application $app)
    {
        add_action('widgets_init', [$this, 'registerCustomWidgets']);
    }

    public function registerCustomWidgets()
    {
        register_widget('CustomWidget');
    }
}
```

### 3. Custom Shortcodes Provider

```php
<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class CustomShortcodesProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register shortcode services
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerCustomShortcodes']);
    }

    public function registerCustomShortcodes()
    {
        add_shortcode('custom_shortcode', [$this, 'renderCustomShortcode']);
    }

    public function renderCustomShortcode($atts, $content = '')
    {
        // Your shortcode rendering logic
        return '<div class="custom-shortcode">' . $content . '</div>';
    }
}
```

### 4. Custom REST API Provider

```php
<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class CustomApiProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register API services
    }

    public function boot(Application $app)
    {
        add_action('rest_api_init', [$this, 'registerCustomEndpoints']);
    }

    public function registerCustomEndpoints()
    {
        register_rest_route('custom/v1', '/data', [
            'methods' => 'GET',
            'callback' => [$this, 'getCustomData'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function getCustomData($request)
    {
        return rest_ensure_response([
            'data' => 'Your custom data here',
        ]);
    }
}
```

## Best Practices

### 1. Namespace Convention
- Sử dụng `App\Providers` namespace
- Đặt tên class với suffix `Provider`
- Ví dụ: `CustomServiceProvider`, `ThemeCustomProvider`

### 2. Service Registration
- Sử dụng `register()` method để đăng ký services
- Sử dụng `singleton()` cho services cần instance duy nhất
- Sử dụng `bind()` cho services cần tạo instance mới mỗi lần

### 3. Service Bootstrapping
- Sử dụng `boot()` method để initialize services
- Hook vào WordPress actions tại đây
- Không đăng ký services trong `boot()` method

### 4. Configuration
- Tạo config files riêng cho custom features
- Sử dụng `config/app.php` để cấu hình
- Tách biệt logic và configuration

## Testing Custom Providers

### 1. Unit Tests

```php
<?php

namespace Tests\App\Providers;

use PHPUnit\Framework\TestCase;
use App\Providers\CustomServiceProvider;
use Jankx\Foundation\Application;

class CustomServiceProviderTest extends TestCase
{
    private Application $app;
    private CustomServiceProvider $provider;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->provider = new CustomServiceProvider();
    }

    public function testProviderCanBeRegistered()
    {
        $this->provider->register($this->app);

        $this->assertTrue($this->app->bound('custom.service'));
    }

    public function testProviderCanBeBooted()
    {
        $this->provider->register($this->app);
        $this->provider->boot($this->app);

        // Test your boot logic here
        $this->expectNotToPerformAssertions();
    }
}
```

### 2. Integration Tests

```php
<?php

namespace Tests\App\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;

class CustomProviderIntegrationTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testCustomProviderWorksWithFramework()
    {
        // Register your custom provider
        $provider = new \App\Providers\CustomServiceProvider();
        $provider->register($this->app);
        $provider->boot($this->app);

        // Test integration with framework
        $service = $this->app->make('custom.service');
        $this->assertInstanceOf('CustomService', $service);
    }
}
```

## Debugging

### 1. Enable Debug Logging

```php
// Trong provider của bạn
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[CUSTOM PROVIDER] Registering custom service');
}
```

### 2. Check Provider Registration

```bash
wp jankx info
```

### 3. Test Provider Methods

```php
// Trong provider
public function register(Application $app)
{
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[CUSTOM PROVIDER] Register method called');
    }

    // Your registration logic
}
```

## Conclusion

Thư mục `app/Providers/` cho phép bạn:

✅ **Tự do phát triển**: Implement các tính năng riêng của mình
✅ **Tích hợp framework**: Sử dụng Jankx Framework services
✅ **Tổ chức code**: Code được tổ chức theo service providers
✅ **Dễ test**: Có thể viết unit tests cho providers
✅ **Dễ maintain**: Logic được tách biệt rõ ràng

Hãy tận dụng cấu trúc này để phát triển các tính năng độc đáo cho theme của bạn!
