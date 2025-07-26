# Jankx Debug System

> **Hệ thống debug được refactor theo design patterns và coding rules của Jankx 2.0**

## 🏗️ **Architecture Overview**

### **Design Patterns Used:**
- **Dependency Injection** - Tất cả dependencies được inject qua constructor
- **Service Pattern** - Mỗi service có trách nhiệm riêng biệt
- **Facade Pattern** - Cung cấp interface đơn giản để sử dụng
- **Repository Pattern** - Quản lý data access
- **Interface Segregation** - Mỗi interface có trách nhiệm cụ thể

### **Cấu trúc thư mục:**
```
includes/Jankx/Debug/
├── Contracts/           # Interfaces
│   ├── DebugInfoInterface.php
│   ├── QueryCountInterface.php
│   ├── CacheInfoInterface.php
│   ├── GutenbergBlocksInterface.php
│   ├── PluginDebugInterface.php
│   └── DebugInfoRendererInterface.php
├── Services/           # Service classes
│   ├── DebugInfoService.php
│   ├── QueryCountService.php
│   ├── CacheInfoService.php
│   ├── GutenbergBlocksService.php
│   └── PluginDebugService.php
├── Renderers/          # Renderer classes
│   └── DebugInfoRenderer.php
├── Facades/           # Facade classes
│   └── Debug.php
├── Helpers/           # Helper classes
│   └── DebugHelper.php
├── DebugInfo.php      # Main debug class
├── DebugBootstrap.php # Bootstrap class
├── DebugServiceProvider.php # Service provider
└── README.md
```

## 🚀 **Quick Start**

### **1. Khởi tạo Debug System**

```php
// Trong functions.php hoặc theme bootstrap
use Jankx\Debug\DebugBootstrap;

// Khởi tạo debug system
DebugBootstrap::init();
```

### **2. Sử dụng Debug Helper**

```php
use Jankx\Debug\Helpers\DebugHelper;

// Kiểm tra debug có được enable không
if (DebugHelper::isEnabled()) {
    // Debug is enabled
}

// Lấy thông tin debug
$debugInfo = DebugHelper::getDebugInfo();

// Lấy số lượng queries
$queryCount = DebugHelper::getQueryCount();

// Thêm thông tin plugin
DebugHelper::addPluginInfo('My Plugin', 'Plugin is active');

// Log debug message
DebugHelper::log('Debug message', ['context' => 'test']);
```

### **3. Sử dụng Debug Facade**

```php
use Jankx\Debug\Facades\Debug;

// Khởi tạo debug system
Debug::init();

// Thêm plugin info
Debug::addPluginInfo('Plugin Name', 'Plugin Info');

// Lấy debug info
$info = Debug::getInfo();

// Lấy query count
$queryCount = Debug::getQueryCount();
```

## 📋 **Service Classes**

### **DebugInfoService**
- Quản lý response time và memory usage
- Format bytes thành human readable format
- Tính toán memory usage percentage

### **QueryCountService**
- Đếm database queries
- Hook vào WordPress query system
- Cung cấp query statistics

### **CacheInfoService**
- Thu thập thông tin cache
- Phân tích object cache, transients
- Detect popular caching plugins

### **GutenbergBlocksService**
- Phân tích Gutenberg blocks
- Detect editor mode
- Count block types

### **PluginDebugService**
- Quản lý plugin debug information
- Allow plugins to add their debug info
- Collect plugin statistics

## 🎨 **Renderer System**

### **DebugInfoRenderer**
- Render HTML với CSS và JS được nhúng
- Responsive design
- Interactive debug panel
- Auto-hide functionality

### **Features:**
- **Modern UI** - Dark theme với animations
- **Responsive** - Hoạt động trên mobile
- **Interactive** - Click để collapse/expand
- **Auto-hide** - Tự động ẩn sau 10 giây
- **Hover effects** - Hiển thị khi hover

## 🔧 **Configuration**

### **Enable Debug Mode**

```php
// Trong wp-config.php hoặc functions.php
define('JANKX_DEBUG', true);
```

### **Custom Plugin Integration**

```php
// Trong plugin của bạn
add_action('jankx/debug/add_plugin_info', function($pluginDebugService) {
    $pluginDebugService->addDebugInfo('My Plugin', 'Version 1.0.0');
});
```

## 🧪 **Testing**

### **Run Tests**

```bash
# Run debug system tests
composer test -- --filter=DebugSystemTest
```

### **Test Coverage**

```bash
# Generate coverage report
composer test -- --coverage-html coverage/debug
```

## 📊 **Debug Information**

### **Performance Metrics:**
- Response time
- Memory usage và limit
- Memory usage percentage
- Database query count

### **Cache Information:**
- Object cache status
- Cache hit rate
- Transients count và size
- Plugin cache detection

### **Gutenberg Blocks:**
- Total blocks count
- Block types distribution
- Editor mode detection
- Template parts count

### **Plugin Debug:**
- Plugin status
- Custom plugin information
- Plugin-specific metrics

## 🎯 **Best Practices**

### **1. Performance**
```php
// Chỉ enable debug khi cần thiết
if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
    DebugHelper::log('Performance critical operation');
}
```

### **2. Error Handling**
```php
// Luôn kiểm tra debug có enabled không
if (DebugHelper::isEnabled()) {
    $debugInfo = DebugHelper::getDebugInfo();
}
```

### **3. Plugin Integration**
```php
// Sử dụng action hooks để thêm plugin info
add_action('jankx/debug/add_plugin_info', function($service) {
    $service->addDebugInfo('My Plugin', 'Active');
});
```

## 🔄 **Migration from Old System**

### **Old Way:**
```php
// Static method calls
DebugInfo::init();
DebugInfo::displayDebugInfo();
```

### **New Way:**
```php
// Service-based approach
DebugBootstrap::init();
DebugHelper::getDebugInfo();
```

## 📝 **Changelog**

### **v2.0.1**
- ✅ Refactor theo OOP principles
- ✅ Implement dependency injection
- ✅ Add service pattern
- ✅ Create interfaces và contracts
- ✅ Add facade pattern
- ✅ Improve renderer với CSS/JS embedded
- ✅ Add comprehensive testing
- ✅ Add helper functions
- ✅ Add plugin integration hooks

---

**Jankx Debug System** - Modern, maintainable và testable debug system! 🎯