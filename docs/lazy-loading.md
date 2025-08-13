# Lazy Loading System - Jankx Framework

## 📖 **Tổng quan**

Jankx Framework sử dụng **một cách duy nhất** để quản lý lazy loading services thông qua `Application` class. Hệ thống này cho phép:

- ✅ **Đăng ký services** mà không cần khởi tạo ngay
- ✅ **Load khi cần** để tối ưu performance
- ✅ **Cache instances** để tránh tạo lại
- ✅ **Fallback handling** khi service không tồn tại

## 🏗️ **Kiến trúc**

```
Application
├── lazyServiceProviders[]     # Danh sách providers
├── lazyServices[]            # Cache instances đã load
└── Methods:
    ├── registerLazy()        # Đăng ký lazy provider
    ├── loadLazyService()     # Load service khi cần
    ├── isLazyService()       # Kiểm tra service có lazy không
    ├── lazy()                # Helper với fallback
    └── hasLazy()             # Kiểm tra service tồn tại
```

## 🚀 **Cách sử dụng**

### 1. **Tạo Lazy Service Provider**

```php
<?php
namespace App\Providers;

use Jankx\Support\Providers\ServiceProvider;

class MyLazyServiceProvider extends ServiceProvider
{
    /**
     * Định nghĩa services mà provider này cung cấp
     */
    public static function provides($service)
    {
        return in_array($service, [
            'my.service',
            'my.helper',
            'my.cache'
        ]);
    }

    /**
     * Đăng ký services
     */
    public function register()
    {
        $this->app->singleton('my.service', function ($app) {
            return new MyService($app);
        });

        $this->app->singleton('my.helper', function ($app) {
            return new MyHelper($app);
        });

        $this->app->singleton('my.cache', function ($app) {
            return new MyCache($app);
        });
    }
}
```

### 2. **Đăng ký với Application**

```php
// Trong functions.php hoặc service provider
jankx()->registerLazy(MyLazyServiceProvider::class);
```

### 3. **Sử dụng trong code**

```php
// Cách 1: Load trực tiếp
$service = jankx()->loadLazyService('my.service');

// Cách 2: Với fallback
$service = jankx()->lazy('my.service', new DefaultService());

// Cách 3: Kiểm tra trước
if (jankx()->hasLazy('my.service')) {
    $service = jankx()->loadLazyService('my.service');
}

// Cách 4: Sử dụng trong blocks
class MyBlock extends Block
{
    public function render()
    {
        $service = jankx()->lazy('my.service');
        return $service->getData();
    }
}
```

## 🎯 **Use Cases**

### **1. Gutenberg Blocks**
```php
// Chỉ load khi block được sử dụng
jankx()->registerLazy(IconPickerServiceProvider::class);

class IconPickerBlock extends Block
{
    public function render()
    {
        $iconService = jankx()->lazy('icon.service');
        return $iconService->renderIcon($this->attributes);
    }
}
```

### **2. Admin Pages**
```php
// Chỉ load khi vào admin
if (is_admin()) {
    jankx()->registerLazy(AdminServiceProvider::class);
}
```

### **3. Frontend Features**
```php
// Chỉ load khi cần thiết
if (is_single() && has_post_thumbnail()) {
    $imageService = jankx()->lazy('image.optimizer');
    $imageService->optimize();
}
```

## 📊 **Performance Monitoring**

```php
// Lấy thống kê lazy services
$stats = jankx()->getLazyStats();
/*
Array (
    'providers' => 5,    // Tổng providers đã đăng ký
    'loaded' => 2,       // Services đã được load
    'total' => 5         // Tổng services có thể load
)
*/

// Clear cache nếu cần
jankx()->clearLazyServices();
```

## 🔧 **Best Practices**

### **1. Provider Naming**
```php
// Sử dụng namespace rõ ràng
'jankx.icon.service'      // ✅ Tốt
'icon.service'            // ❌ Có thể conflict
```

### **2. Service Dependencies**
```php
// Tránh circular dependencies
public function register()
{
    $this->app->singleton('service.a', function ($app) {
        return new ServiceA($app);
    });

    $this->app->singleton('service.b', function ($app) {
        // Load service.a khi cần
        $serviceA = $app->lazy('service.a');
        return new ServiceB($serviceA);
    });
}
```

### **3. Error Handling**
```php
// Luôn có fallback
$service = jankx()->lazy('critical.service', new FallbackService());

// Hoặc kiểm tra trước
if (!jankx()->hasLazy('critical.service')) {
    throw new Exception('Critical service not available');
}
```

## 🚫 **Không sử dụng**

- ❌ `LazyLoader` class (đã xóa)
- ❌ `DeferredServiceManager` (đã xóa)
- ❌ `DeferredServiceProvider` (đã xóa)
- ❌ Custom lazy loading logic

## 📝 **Migration Guide**

### **Từ LazyLoader cũ:**
```php
// ❌ Cũ
$service = LazyLoader::service('my.service');

// ✅ Mới
$service = jankx()->lazy('my.service');
```

### **Từ DeferredServiceManager:**
```php
// ❌ Cũ
$manager = new DeferredServiceManager($app);
$manager->register('my.service', function() { ... });

// ✅ Mới
jankx()->registerLazy(MyServiceProvider::class);
```

## 🔍 **Debug & Troubleshooting**

```php
// Kiểm tra lazy services
if (jankx()->hasLazy('my.service')) {
    echo "Service exists";
} else {
    echo "Service not found";
}

// Xem thống kê
$stats = jankx()->getLazyStats();
var_dump($stats);

// Clear cache nếu có vấn đề
jankx()->clearLazyServices();
```

## 📚 **Ví dụ hoàn chỉnh**

```php
<?php
// 1. Tạo Provider
class DatabaseServiceProvider extends ServiceProvider
{
    public static function provides($service)
    {
        return $service === 'database.connection';
    }

    public function register()
    {
        $this->app->singleton('database.connection', function ($app) {
            return new DatabaseConnection([
                'host' => DB_HOST,
                'name' => DB_NAME,
                'user' => DB_USER,
                'pass' => DB_PASSWORD
            ]);
        });
    }
}

// 2. Đăng ký
jankx()->registerLazy(DatabaseServiceProvider::class);

// 3. Sử dụng
class UserRepository
{
    public function getUsers()
    {
        $db = jankx()->lazy('database.connection');
        return $db->query('SELECT * FROM users');
    }
}
```

---

**Lưu ý**: Hệ thống lazy loading này là **cách duy nhất** được hỗ trợ trong Jankx Framework. Tất cả các cách khác đã bị loại bỏ để tránh nhầm lẫn và đảm bảo tính nhất quán.
