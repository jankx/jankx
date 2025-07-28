# Jankx Debug System

## Tổng quan

Hệ thống Debug của Jankx Framework cung cấp các công cụ mạnh mẽ để theo dõi hiệu suất, phân tích Gutenberg blocks, và tối ưu hóa WordPress site.

## Tính năng chính

### 🔍 **Performance Monitoring**
- Theo dõi response time thực tế
- Đo lường memory usage
- Đếm database queries
- Phân tích memory limit và usage percentage

### 📝 **Gutenberg Blocks Analysis**
- Phát hiện và phân tích tất cả Gutenberg blocks
- Hiển thị số lượng blocks và block types
- Phân tích block theme compatibility
- AJAX-powered block inspection

### ⚡ **Cache Comparison**
- So sánh hiệu suất có/không có cache
- Ngăn chặn cache thông tin debug
- Tương thích với các plugin tối ưu tốc độ phổ biến
- Real-time performance metrics

### 🔌 **Plugin Debug Integration**
- Tích hợp debug info từ các plugin
- Custom debug data injection
- Plugin performance monitoring

## Cách sử dụng

### 1. Kích hoạt Debug Mode

```php
// Trong wp-config.php hoặc functions.php
define('JANKX_DEBUG', true);
```

### 2. Truy cập Debug Panel

**Frontend:**
- Debug panel xuất hiện ở góc dưới bên phải
- Click để expand/collapse
- Auto-hide sau 10 giây

**Admin:**
- Click "📝 Gutenberg Blocks" trong admin bar
- AJAX-powered block inspection
- Real-time debug data

### 3. Cache Management

- **Clear Cache**: Click "🗑️ Clear Debug Cache" trong admin bar
- **Cache Comparison**: Xem section "⚡ Cache vs No-Cache Comparison"
- **Auto Prevention**: Tự động ngăn chặn cache debug info

## Documentation

### 📚 **Hướng dẫn sử dụng**
- [Quick Start Guide](quick-start.md) - Bắt đầu nhanh với debug system
- [Cache Comparison](cache-comparison.md) - So sánh hiệu suất cache
- [Performance Monitoring](performance-monitoring.md) - Theo dõi hiệu suất

### 🔧 **Technical Reference**
- [API Reference](api-reference.md) - AJAX endpoints và methods
- [Configuration](configuration.md) - Cấu hình debug system
- [Troubleshooting](troubleshooting.md) - Xử lý sự cố thường gặp

### 🎯 **Advanced Topics**
- [Custom Debug Data](custom-debug-data.md) - Thêm debug data tùy chỉnh
- [Plugin Integration](plugin-integration.md) - Tích hợp với plugins
- [Performance Optimization](performance-optimization.md) - Tối ưu hiệu suất

## Architecture

### Core Components

```
Jankx\Debug\
├── DebugInfo.php              # Main debug manager
├── Renderers\
│   └── DebugInfoRenderer.php  # HTML renderer
├── Services\
│   ├── DebugInfoService.php   # Performance tracking
│   ├── QueryCountService.php  # Database monitoring
│   ├── CacheInfoService.php   # Cache analysis
│   ├── GutenbergBlocksService.php # Block detection
│   └── PluginDebugService.php # Plugin integration
└── Contracts\
    └── DebugInfoInterface.php # Interface definition
```

### Data Flow

1. **Initialization**: Debug system starts tracking performance
2. **Data Collection**: Services gather metrics throughout request
3. **Cache Prevention**: Headers and filters prevent caching
4. **Rendering**: HTML output with real-time data
5. **Comparison**: Cache vs non-cache performance analysis

## Performance Impact

### Minimal Overhead
- Debug system chỉ hoạt động khi `JANKX_DEBUG = true`
- Optimized data collection
- Efficient rendering with minimal DOM manipulation

### Cache Prevention
- Headers prevent browser caching
- Plugin filters disable optimization caching
- Client-side cache clearing

## Best Practices

### ✅ **Development Only**
- Chỉ enable debug mode trong development
- Disable trên production environments
- Monitor performance impact

### 🔄 **Regular Testing**
- Test cache comparison regularly
- Clear debug cache khi cần
- Monitor log files

### 📊 **Data Analysis**
- So sánh performance metrics
- Identify bottlenecks
- Optimize based on debug data

## Troubleshooting

### Common Issues

1. **Debug panel không hiển thị**
   - Kiểm tra `JANKX_DEBUG` constant
   - Verify user permissions
   - Check browser console

2. **Cache comparison không hoạt động**
   - Clear debug cache
   - Refresh page multiple times
   - Check cache prevention headers

3. **AJAX errors**
   - Verify admin permissions
   - Check nonce validation
   - Review error logs

### Debug Logs

```php
// Enable detailed logging
Logger::debug('Debug system initialized');
Logger::debug('Cache prevention applied');
Logger::debug('Performance data collected');
```

## API Reference

### AJAX Endpoints

```php
// Get debug information
POST /wp-admin/admin-ajax.php
Action: bookix_get_block_debug_info

// Clear debug cache
POST /wp-admin/admin-ajax.php
Action: bookix_clear_debug_cache
```

### Methods

```php
// Main debug class
$debugInfo = new Jankx\Debug\DebugInfo();
$debugInfo->init();
$debugInfo->displayDebugInfo();

// Get debug data
$data = $debugInfo->getDebugInfo();

// Add plugin debug info
$debugInfo->addPluginDebugInfo('my-plugin', 'custom-data');
```

## Configuration

### Environment Variables

```php
// Enable debug mode
define('JANKX_DEBUG', true);

// Enable all logs
define('JANKX_LOG_ALL', true);

// Custom debug settings
define('JANKX_DEBUG_CACHE_EXPIRY', HOUR_IN_SECONDS);
define('JANKX_DEBUG_AUTO_HIDE', 10000); // milliseconds
```

### Plugin Compatibility

Hệ thống tự động tương thích với:
- WP Rocket
- W3 Total Cache
- WP Super Cache
- Autoptimize
- LiteSpeed Cache
- Hummingbird
- SG Optimizer
- Breeze
- Swift Performance

## Contributing

### Adding New Features

1. Extend existing services
2. Add new renderer methods
3. Update documentation
4. Add tests

### Custom Debug Data

```php
// Add custom debug information
$debugInfo->addPluginDebugInfo('my-plugin', [
    'custom_metric' => $value,
    'performance_data' => $data
]);
```

## Support

- **Documentation**: Xem các file trong thư mục `docs/debug/`
- **Issues**: Report bugs và feature requests
- **Community**: Join developer community

---

**Version**: 2.0.0
**Last Updated**: 2024
**Compatibility**: WordPress 5.0+, PHP 7.4+
