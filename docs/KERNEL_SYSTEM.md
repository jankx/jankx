# 🔧 Jankx Kernel System - 4 Ways Implementation

## 📋 Tổng quan

Jankx Framework đã implement hệ thống Kernel với 4 loại kernel chính để xử lý các context khác nhau của WordPress:

1. **FrontendKernel** - Xử lý frontend/public pages
2. **AdminKernel** - Xử lý admin/dashboard pages
3. **APIKernel** - Xử lý REST API requests
4. **CLIKernel** - Xử lý CLI/WP-CLI commands

## 🎯 Mục tiêu

- ✅ **Tách biệt logic** theo từng context
- ✅ **Tối ưu performance** cho từng loại request
- ✅ **Dễ dàng mở rộng** và maintain
- ✅ **Code organization** rõ ràng
- ✅ **Context-specific features** được load đúng lúc

## 🏗️ Cấu trúc Kernel System

### **1. AbstractKernel (Base Class)**
```php
abstract class AbstractKernel implements KernelInterface
{
    protected $container;
    protected $services = [];
    protected $hooks = [];
    protected $filters = [];
    protected $bootstrappers = [];
    protected $booted = false;
    protected $kernelType;

    abstract public function getKernelType(): string;
    abstract protected function registerBootstrappers(): void;
    abstract protected function registerServices(): void;
    abstract protected function registerHooks(): void;
    abstract protected function registerFilters(): void;
}
```

### **2. KernelManager (Quản lý)**
```php
class KernelManager
{
    protected $kernels = [];
    protected $bootedKernels = [];

    public function registerKernel(string $type, string $kernelClass): void
    public function bootKernel(string $type): void
    public function bootKernelsByContext(): void
    protected function getCurrentContext(): string
}
```

## 🔧 4 Kernel Types

### **1. FrontendKernel** 🎨

**Context:** Frontend/public pages
**File:** `vendor/jankx/core/src/Kernel/FrontendKernel.php`

#### **Features:**
- ✅ Asset loading (CSS, JS, fonts)
- ✅ Theme customization
- ✅ WooCommerce integration
- ✅ User experience optimization
- ✅ Social sharing
- ✅ Comments system
- ✅ Widget management
- ✅ Performance optimization

#### **Bootstrappers:**
- `ThemeBootstrapper` - Theme setup
- `AssetBootstrapper` - Asset management
- `WooCommerceBootstrapper` - WooCommerce features

#### **Services:**
- `UserExperience` - UX optimization
- `IconFonts` - Icon font management
- `GlobalCSSVariables` - CSS variables
- `Comments` - Comments system
- `WidgetManager` - Widget management
- `Sharing` - Social sharing

#### **Usage:**
```php
// Frontend kernel tự động được boot khi:
// - User truy cập frontend pages
// - wp_is_request('frontend') returns true
// - Không phải admin, API, hoặc CLI
```

### **2. AdminKernel** ⚙️

**Context:** Admin/dashboard pages
**File:** `vendor/jankx/core/src/Kernel/AdminKernel.php`

#### **Features:**
- ✅ Admin interface management
- ✅ Command manager
- ✅ Meta boxes
- ✅ Customizer integration
- ✅ Admin scripts loading
- ✅ Admin menu registration
- ✅ Admin notices
- ✅ Settings pages

#### **Bootstrappers:**
- `ThemeBootstrapper` - Theme setup
- `AdminBootstrapper` - Admin features

#### **Services:**
- `Admin` - Admin interface
- `CommandManager` - CLI commands
- `GlobalCSSVariables` - CSS variables

#### **Usage:**
```php
// Admin kernel tự động được boot khi:
// - is_admin() returns true
// - User đang ở admin area
```

### **3. APIKernel** 🌐

**Context:** REST API requests
**File:** `vendor/jankx/core/src/Kernel/APIKernel.php`

#### **Features:**
- ✅ REST API endpoints
- ✅ CORS headers
- ✅ API authentication
- ✅ Rate limiting
- ✅ API logging
- ✅ Response formatting
- ✅ Error handling

#### **Bootstrappers:**
- `ThemeBootstrapper` - Theme setup
- `APIBootstrapper` - API features

#### **Services:**
- `APIManager` - API management
- `PostsEndpoint` - Posts API
- `PagesEndpoint` - Pages API
- `CategoriesEndpoint` - Categories API
- `TagsEndpoint` - Tags API
- `UsersEndpoint` - Users API
- `SettingsEndpoint` - Settings API

#### **Usage:**
```php
// API kernel tự động được boot khi:
// - REST_REQUEST constant is defined and true
// - WordPress REST API requests
```

### **4. CLIKernel** 💻

**Context:** CLI/WP-CLI commands
**File:** `vendor/jankx/core/src/Kernel/CLIKernel.php`

#### **Features:**
- ✅ CLI commands registration
- ✅ WP-CLI integration
- ✅ Cron job management
- ✅ CLI logging
- ✅ Progress indicators
- ✅ Environment checks
- ✅ Command help formatting

#### **Bootstrappers:**
- `ThemeBootstrapper` - Theme setup
- `CLIBootstrapper` - CLI features

#### **Services:**
- `CommandManager` - Command management
- `CacheCommand` - Cache operations
- `OptimizeCommand` - Performance optimization
- `SecurityCommand` - Security scanning

#### **Usage:**
```php
// CLI kernel tự động được boot khi:
// - WP_CLI constant is defined and true
// - Command line interface
```

## 🔄 Context Detection

### **KernelManager::getCurrentContext()**

```php
protected function getCurrentContext(): string
{
    if (defined('WP_CLI') && WP_CLI) {
        return 'cli';
    }

    if (wp_doing_cron()) {
        return 'frontend'; // Cron jobs use frontend kernel
    }

    if (is_admin()) {
        return 'admin';
    }

    // Check if it's a REST API request
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return 'api';
    }

    return 'frontend';
}
```

## 🚀 Bootstrapping Process

### **1. Kernel Registration**
```php
$kernelManager = new KernelManager($container);

$kernelManager->registerKernel('frontend', FrontendKernel::class);
$kernelManager->registerKernel('admin', AdminKernel::class);
$kernelManager->registerKernel('api', APIKernel::class);
$kernelManager->registerKernel('cli', CLIKernel::class);
```

### **2. Context Detection & Boot**
```php
$kernelManager->bootKernelsByContext();
```

### **3. Kernel Boot Process**
```php
public function boot(): void
{
    if ($this->booted) {
        return;
    }

    // Run bootstrappers
    $this->runBootstrappers();

    // Load components
    $this->loadServices();
    $this->loadHooks();
    $this->loadFilters();

    $this->booted = true;

    do_action("jankx/kernel/{$this->kernelType}/booted", $this);
}
```

## 📦 Bootstrappers

### **AbstractBootstrapper**
```php
abstract class AbstractBootstrapper implements BootstrapperInterface
{
    abstract public function getName(): string;
    abstract public function getPriority(): int;
    abstract public function bootstrap(): void;
}
```

### **Available Bootstrappers**

#### **ThemeBootstrapper** (Priority: 10)
- Theme setup và configuration
- Text domain loading
- Theme support features

#### **AssetBootstrapper** (Priority: 20)
- CSS/JS asset management
- Asset optimization
- Asset loading strategies

#### **AdminBootstrapper** (Priority: 20)
- Admin interface setup
- Admin scripts loading
- Admin menu registration

#### **APIBootstrapper** (Priority: 25)
- API endpoints registration
- CORS headers setup
- API authentication

#### **CLIBootstrapper** (Priority: 30)
- CLI commands registration
- WP-CLI integration
- Cron job management

#### **WooCommerceBootstrapper** (Priority: 40)
- WooCommerce integration
- WooCommerce hooks
- WooCommerce templates

## 🔧 Usage Examples

### **1. Get Kernel Info**
```php
$kernelManager = Jankx::make(KernelManager::class);
$kernelInfo = $kernelManager->getKernelInfo('frontend');

// Returns:
// [
//     'type' => 'frontend',
//     'booted' => true,
//     'services' => 6,
//     'hooks' => 8,
//     'filters' => 4,
//     'bootstrappers' => 3,
// ]
```

### **2. Check Kernel Status**
```php
$kernelManager = Jankx::make(KernelManager::class);

if ($kernelManager->isKernelBooted('frontend')) {
    echo 'Frontend kernel is running';
}

if ($kernelManager->hasKernel('admin')) {
    echo 'Admin kernel is registered';
}
```

### **3. Custom Bootstrapper**
```php
class CustomBootstrapper extends AbstractBootstrapper
{
    public function getName(): string
    {
        return 'custom';
    }

    public function getPriority(): int
    {
        return 50;
    }

    public function bootstrap(): void
    {
        // Custom bootstrapping logic
        add_action('init', [$this, 'initCustomFeatures']);
    }

    public function initCustomFeatures(): void
    {
        // Initialize custom features
    }
}
```

### **4. Add Custom Bootstrapper**
```php
// In your theme's functions.php
add_filter('jankx/frontend/bootstrappers', function($bootstrappers) {
    $bootstrappers[] = CustomBootstrapper::class;
    return $bootstrappers;
});
```

## 🎯 Performance Benefits

### **1. Selective Loading**
- Chỉ load những features cần thiết cho từng context
- Giảm memory usage
- Tăng performance

### **2. Context-Specific Optimization**
- Frontend: Asset optimization, caching
- Admin: Admin scripts, meta boxes
- API: Rate limiting, authentication
- CLI: Command management, logging

### **3. Modular Architecture**
- Dễ dàng thêm/sửa/xóa features
- Code organization rõ ràng
- Maintainability cao

## 🔍 Debugging

### **1. Kernel Status**
```php
$kernelManager = Jankx::make(KernelManager::class);
$allKernelInfo = $kernelManager->getAllKernelInfo();

// Debug output
var_dump($allKernelInfo);
```

### **2. Bootstrapper Debug**
```php
// Add debug logging to bootstrappers
add_action('jankx/kernel/frontend/booted', function($kernel) {
    error_log('Frontend kernel booted with ' . count($kernel->getBootstrappers()) . ' bootstrappers');
});
```

### **3. Context Detection Debug**
```php
// Check current context
$context = apply_filters('jankx_kernel_context', 'unknown');
error_log('Current kernel context: ' . $context);
```

## 📊 Monitoring

### **1. Kernel Metrics**
```php
$metrics = [
    'kernels_registered' => count($kernelManager->getAllKernels()),
    'kernels_booted' => count($kernelManager->getBootedKernels()),
    'current_context' => $kernelManager->getCurrentContext(),
    'memory_usage' => memory_get_usage(true),
];
```

### **2. Performance Monitoring**
```php
// Monitor kernel boot time
$start_time = microtime(true);
$kernelManager->bootKernelsByContext();
$boot_time = microtime(true) - $start_time;

error_log("Kernel boot time: {$boot_time} seconds");
```

## 🚨 Best Practices

### **1. Kernel Design**
- ✅ Mỗi kernel chỉ xử lý context-specific features
- ✅ Sử dụng bootstrappers để organize code
- ✅ Implement proper error handling
- ✅ Add logging cho debugging

### **2. Bootstrapper Design**
- ✅ Set priority phù hợp
- ✅ Handle dependencies properly
- ✅ Add proper error handling
- ✅ Use container for dependency injection

### **3. Context Detection**
- ✅ Detect context chính xác
- ✅ Handle edge cases
- ✅ Add fallback mechanisms
- ✅ Log context changes

## 🔄 Migration Guide

### **From Old System to Kernel System**

#### **1. Identify Context-Specific Code**
```php
// Old way
if (is_admin()) {
    // Admin code
} else {
    // Frontend code
}

// New way - Automatic context detection
// Code is automatically organized by kernels
```

#### **2. Move Features to Appropriate Kernels**
```php
// Frontend features -> FrontendKernel
// Admin features -> AdminKernel
// API features -> APIKernel
// CLI features -> CLIKernel
```

#### **3. Use Bootstrappers for Organization**
```php
// Instead of scattered hooks
add_action('init', 'my_feature');

// Use bootstrappers
class MyFeatureBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(): void
    {
        add_action('init', [$this, 'initMyFeature']);
    }
}
```

## 🎉 Kết luận

Jankx Kernel System với 4 ways implementation đã cung cấp:

- ✅ **Modular architecture** cho từng context
- ✅ **Performance optimization** selective loading
- ✅ **Easy maintenance** và extension
- ✅ **Clear code organization** theo context
- ✅ **Robust error handling** và logging
- ✅ **Flexible bootstrapping** system

**Kernel system đã sẵn sàng cho production!** 🚀