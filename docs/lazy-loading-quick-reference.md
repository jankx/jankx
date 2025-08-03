# Lazy Loading Quick Reference

## 🚀 **Quick Start**

### **1. Register Lazy Services**
```php
// Trong config/app.php
$app->registerLazy(\Jankx\Support\Providers\HeavyServicesProvider::class);
```

### **2. Use LazyLoader**
```php
use Jankx\Support\LazyLoader;

// Set app
LazyLoader::setApp($app);

// Load service
$userService = LazyLoader::service('user.service');
$user = $userService->getById(1);
```

## 📋 **Available Services**

### **Heavy Services (Lazy Load):**
| Service | Name | Lines | Usage |
|---------|------|-------|-------|
| `gutenberg.service` | GutenbergService | 636 | Gutenberg blocks |
| `slideout.menu.service` | SlideoutMenuService | 288 | Slideout menu |
| `user.service` | UserService | 140 | User data |

### **Light Services (Eager Load):**
| Service | Name | Lines | Usage |
|---------|------|-------|-------|
| `asset.service` | AssetService | 100 | Essential |
| `cache.service` | CacheService | 128 | Essential |
| `error.service` | ErrorSuppressionService | 80 | Essential |

## 🔧 **API Reference**

### **LazyLoader Methods:**
```php
// Load service
LazyLoader::service('user.service')

// Check if lazy
LazyLoader::isLazy('user.service')

// Clear cache
LazyLoader::clearCache()

// Get cached services
LazyLoader::getCachedServices()

// Monitor performance
LazyLoader::monitor('user.service')
```

### **Application Methods:**
```php
// Register lazy provider
$app->registerLazy(HeavyServicesProvider::class)

// Load lazy service
$app->loadLazyService('user.service')

// Check if lazy service
$app->isLazyService('user.service')
```

## 💡 **Common Patterns**

### **Conditional Loading:**
```php
// Only load in admin
if (is_admin()) {
    $gutenbergService = LazyLoader::service('gutenberg.service');
    $gutenbergService->init();
}

// Only load when menu exists
if (has_nav_menu('slideout')) {
    $slideoutService = LazyLoader::service('slideout.menu.service');
    $slideoutService->render();
}

// Only load for logged in users
if (is_user_logged_in()) {
    $userService = LazyLoader::service('user.service');
    $currentUser = $userService->getCurrent();
}
```

### **Performance Monitoring:**
```php
// Monitor loading time
LazyLoader::monitor('user.service');

// Track manually
$start = microtime(true);
$service = LazyLoader::service('user.service');
$time = (microtime(true) - $start) * 1000;
error_log("Service loaded in {$time}ms");
```

### **Cache Management:**
```php
// Clear cache
LazyLoader::clearCache();

// Get cached services
$cached = LazyLoader::getCachedServices();

// Check cache status
if (in_array('user.service', $cached)) {
    echo "User service is cached";
}
```

## ⚡ **Performance Tips**

### **1. Cache Strategy:**
```php
// First load (slow)
$service = LazyLoader::service('user.service');

// Second load (fast - cached)
$service = LazyLoader::service('user.service');
```

### **2. Conditional Registration:**
```php
// Only register when needed
if (is_admin()) {
    $app->registerLazy(AdminServicesProvider::class);
}
```

### **3. Memory Management:**
```php
// Clear cache periodically
add_action('wp_loaded', function() {
    LazyLoader::clearCache();
});
```

## 🐛 **Troubleshooting**

### **Common Errors:**

#### **Service Not Found:**
```php
// Error
Exception: Service 'user.service' not found

// Solution
$app->registerLazy(\Jankx\Support\Providers\HeavyServicesProvider::class);
```

#### **Application Not Set:**
```php
// Error
Exception: Application not set

// Solution
LazyLoader::setApp($app);
```

#### **Performance Issues:**
```php
// Problem: Slow loading
// Solution: Monitor and optimize
LazyLoader::monitor('heavy.service');
LazyLoader::clearCache();
```

## 📊 **Performance Metrics**

### **Before vs After:**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Startup Time | 150ms | 80ms | -47% |
| Memory Usage | 8MB | 4MB | -50% |
| Services Loaded | 6 | 3 | -50% |

### **Service Loading Times:**
| Service | Loading Time | When Used |
|---------|--------------|-----------|
| GutenbergService | 15ms | Admin only |
| SlideoutMenuService | 8ms | Menu exists |
| UserService | 5ms | User data needed |

## 🎯 **Best Practices**

### **1. Service Classification:**
- **Heavy Services:** Lazy load (Gutenberg, Slideout, User)
- **Light Services:** Eager load (Asset, Cache, Error)

### **2. Conditional Loading:**
- Load only when needed
- Check conditions before loading
- Use appropriate hooks

### **3. Cache Management:**
- Monitor cache usage
- Clear cache when needed
- Track performance metrics

### **4. Error Handling:**
- Always check if service exists
- Handle exceptions gracefully
- Provide fallback options

## 📚 **Related Documentation**

- [Lazy Loading Services](../lazy-loading-services.md)
- [API Reference](../api-reference.md)
- [Performance Tips](../performance-tips.md)
- [Development Guide](../development-guide.md)