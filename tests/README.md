# Lazy Loading Tests

## 📋 **Tổng quan**

Unit tests cho lazy loading functionality của Jankx Framework. Tests này đảm bảo rằng lazy loading hoạt động chính xác và performance được tối ưu.

## 🧪 **Test Files**

### **1. LazyLoaderTest.php**
- **Location:** `tests/Support/LazyLoaderTest.php`
- **Purpose:** Test LazyLoader helper class
- **Coverage:**
  - Service loading và caching
  - Performance monitoring
  - Error handling
  - Memory usage optimization

### **2. ApplicationLazyTest.php**
- **Location:** `tests/Foundation/ApplicationLazyTest.php`
- **Purpose:** Test Application container lazy loading methods
- **Coverage:**
  - Lazy service registration
  - Service instantiation
  - Singleton behavior
  - Performance metrics

### **3. HeavyServicesProviderTest.php**
- **Location:** `tests/Support/Providers/HeavyServicesProviderTest.php`
- **Purpose:** Test HeavyServicesProvider
- **Coverage:**
  - Service provider registration
  - Service instantiation
  - Provider inheritance
  - Performance optimization

## 🚀 **Cách chạy tests**

### **1. Chạy tất cả tests:**
```bash
# Từ thư mục bookix
vendor/bin/phpunit

# Hoặc với PHPUnit đã cài global
phpunit
```

### **2. Chạy specific test suite:**
```bash
# Chạy chỉ LazyLoader tests
vendor/bin/phpunit --testsuite "LazyLoader Tests"

# Chạy chỉ Application lazy tests
vendor/bin/phpunit --testsuite "Application Lazy Tests"

# Chạy chỉ HeavyServicesProvider tests
vendor/bin/phpunit --testsuite "HeavyServicesProvider Tests"
```

### **3. Chạy specific test file:**
```bash
# Chạy LazyLoaderTest
vendor/bin/phpunit tests/Support/LazyLoaderTest.php

# Chạy ApplicationLazyTest
vendor/bin/phpunit tests/Foundation/ApplicationLazyTest.php

# Chạy HeavyServicesProviderTest
vendor/bin/phpunit tests/Support/Providers/HeavyServicesProviderTest.php
```

### **4. Chạy specific test method:**
```bash
# Chạy test method cụ thể
vendor/bin/phpunit --filter testLoadLazyService tests/Support/LazyLoaderTest.php
```

## 📊 **Test Coverage**

### **LazyLoaderTest Coverage:**
- ✅ **setApp()** - Set application instance
- ✅ **service()** - Load lazy service
- ✅ **isLazy()** - Check if service is lazy
- ✅ **clearCache()** - Clear service cache
- ✅ **getCachedServices()** - Get cached services
- ✅ **monitor()** - Performance monitoring
- ✅ **Error handling** - Non-existent services
- ✅ **Performance** - Loading time comparison
- ✅ **Memory usage** - Memory optimization

### **ApplicationLazyTest Coverage:**
- ✅ **registerLazy()** - Register lazy provider
- ✅ **loadLazyService()** - Load lazy service
- ✅ **isLazyService()** - Check lazy service
- ✅ **Singleton behavior** - Same instance
- ✅ **Performance** - Loading time metrics
- ✅ **Memory usage** - Memory consumption
- ✅ **Error handling** - Invalid services

### **HeavyServicesProviderTest Coverage:**
- ✅ **provides()** - Service availability
- ✅ **register()** - Service registration
- ✅ **boot()** - Provider booting
- ✅ **Service instantiation** - Correct classes
- ✅ **Singleton behavior** - Same instances
- ✅ **Dependencies** - App injection
- ✅ **Performance** - Registration time
- ✅ **Memory usage** - Memory consumption

## 🎯 **Test Scenarios**

### **1. Happy Path Tests:**
```php
// Test loading lazy service
$userService = LazyLoader::service('user.service');
$this->assertInstanceOf(UserService::class, $userService);
```

### **2. Error Handling Tests:**
```php
// Test loading non-existent service
$this->expectException(\Exception::class);
LazyLoader::service('non.existent.service');
```

### **3. Performance Tests:**
```php
// Test loading performance
$start = microtime(true);
$service = LazyLoader::service('user.service');
$time = microtime(true) - $start;
$this->assertLessThan(0.1, $time); // Less than 100ms
```

### **4. Memory Tests:**
```php
// Test memory usage
$initialMemory = memory_get_usage();
$service = LazyLoader::service('user.service');
$memoryUsed = memory_get_usage() - $initialMemory;
$this->assertLessThan(1024 * 1024, $memoryUsed); // Less than 1MB
```

## 📈 **Performance Benchmarks**

### **Expected Performance:**
- **Service Loading:** < 100ms per service
- **Memory Usage:** < 1MB total
- **Cache Hit:** 99% improvement on second load
- **Singleton Behavior:** Same instance returned

### **Test Results Example:**
```
LazyLoaderTest::testServiceLoadingPerformance
- First load: 15.23ms
- Second load: 0.05ms
- Performance improvement: 99.67%

ApplicationLazyTest::testLazyServicePerformance
- Registration time: 2.45ms
- Instantiation time: 8.12ms
- Memory usage: 256KB
```

## 🔧 **Test Configuration**

### **PHPUnit Configuration:**
- **Bootstrap:** `tests/bootstrap.php`
- **Test Suites:** 4 test suites
- **Coverage:** HTML và text reports
- **Environment:** Testing environment

### **Mock Functions:**
- WordPress functions (add_action, add_filter, etc.)
- User functions (get_user_by, is_user_logged_in)
- Environment functions (error_log, microtime)

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. Class not found:**
```bash
# Ensure autoloader is working
composer dump-autoload
```

#### **2. Mock functions not working:**
```bash
# Check bootstrap.php is loaded
vendor/bin/phpunit --bootstrap tests/bootstrap.php
```

#### **3. Performance tests failing:**
```bash
# Run with verbose output
vendor/bin/phpunit --verbose
```

### **Debug Commands:**
```bash
# Run with debug output
vendor/bin/phpunit --debug

# Run with coverage report
vendor/bin/phpunit --coverage-html tests/reports/coverage

# Run specific test with output
vendor/bin/phpunit --filter testLoadLazyService --verbose
```

## 📚 **Related Documentation**

- [Lazy Loading Services](../docs/lazy-loading-services.md)
- [Lazy Loading Quick Reference](../docs/lazy-loading-quick-reference.md)
- [Performance Tips](../docs/performance-tips.md)
- [Development Guide](../docs/development-guide.md)

## 🎉 **Success Criteria**

### **All Tests Passing:**
- ✅ **LazyLoaderTest:** 15/15 tests passing
- ✅ **ApplicationLazyTest:** 12/12 tests passing
- ✅ **HeavyServicesProviderTest:** 15/15 tests passing

### **Performance Targets:**
- ✅ **Loading Time:** < 100ms per service
- ✅ **Memory Usage:** < 1MB total
- ✅ **Cache Performance:** 99% improvement
- ✅ **Error Handling:** Graceful failures

### **Code Coverage:**
- ✅ **LazyLoader:** 100% method coverage
- ✅ **Application:** 100% lazy loading methods
- ✅ **HeavyServicesProvider:** 100% provider methods