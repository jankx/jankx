# Jankx Debug System

## Tổng quan

Jankx Debug System là một công cụ debug mạnh mẽ được tích hợp sẵn trong Jankx Framework, giúp developers theo dõi và phân tích hiệu suất website WordPress một cách trực quan và chi tiết.

## Mục đích

### 1. **Theo dõi hiệu suất**
- Đo thời gian phản hồi của trang web
- Theo dõi sử dụng bộ nhớ
- Đếm số lượng truy vấn database (từ khi load `functions.php`)
- Phân tích hiệu suất từng thành phần

### 2. **Debug và Troubleshooting**
- Phát hiện bottlenecks trong code
- Xác định nguyên nhân chậm trang
- Theo dõi cache hit/miss rates
- Debug các vấn đề về database

### 3. **Tối ưu hóa**
- Phân tích hiệu suất cache (OPcache, Redis, Memcached, APCu)
- Đo lường tác động của plugins
- Tối ưu hóa database queries
- Cải thiện response time

### 4. **Development Support**
- Cung cấp thông tin debug real-time
- Hỗ trợ development workflow
- Tích hợp với plugin ecosystem
- Cung cấp insights cho optimization

## Cách kích hoạt

### 1. **Kích hoạt Debug Mode**

Thêm vào file `wp-config.php`:

```php
// Kích hoạt Jankx Debug System
define('JANKX_DEBUG', true);

// Kích hoạt WordPress Debug (tùy chọn)
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### 2. **Kích hoạt trong Theme**

Thêm vào file `functions.php`:

```php
// Kích hoạt debug system
if (!defined('JANKX_DEBUG')) {
    define('JANKX_DEBUG', true);
}
```

### 3. **Kích hoạt có điều kiện**

```php
// Chỉ kích hoạt cho admin hoặc development environment
if (is_admin() || WP_DEBUG) {
    define('JANKX_DEBUG', true);
}
```

## Cách sử dụng

### 1. **Xem Debug Panel**

Khi `JANKX_DEBUG` được kích hoạt, một debug panel sẽ xuất hiện ở cuối trang web với các thông tin:

- **Response Time**: Thời gian phản hồi của trang
- **Memory Usage**: Sử dụng bộ nhớ hiện tại
- **Database Queries**: Số lượng truy vấn database (tổng và từ `functions.php`)
- **Cache Information**: Thông tin về cache systems (OPcache, Redis, Memcached, APCu)
- **Plugin Debug Info**: Thông tin debug từ plugins
- **Server Info**: Thông tin server và PHP

### 2. **Tương tác với Debug Panel**

#### **Toggle Button (Minimize/Maximize)**
- Click nút toggle để chuyển đổi giữa minimize và maximize
- **Icon "−"**: Panel đang maximized
- **Icon "□"**: Panel đang minimized
- Panel sẽ thu nhỏ thành mini-bar ở cuối màn hình khi minimized
- Click vào mini-bar để maximize lại

#### **Fullscreen Mode**
- Click nút "⛶" để xem fullscreen
- Hiển thị toàn bộ thông tin debug trên toàn màn hình
- Hữu ích cho việc phân tích chi tiết
- Khi đang fullscreen, click toggle sẽ tự động thoát fullscreen trước

#### **Panel States**
- **Maximized**: Hiển thị đầy đủ thông tin debug
- **Minimized**: Thu nhỏ thành mini-bar, click để maximize
- **Fullscreen**: Hiển thị toàn màn hình với scrollable content

### 3. **Đọc thông tin Debug**

#### **Metrics Grid**
```
⏱️ Response Time: 245.67ms
💾 Memory Usage: 45.2 MB / 256M
🗄️ Database: 25 total queries (+13 since functions.php)
```

#### **Database Queries**
- **Total Queries**: Tổng số truy vấn database
- **Since functions.php**: Số truy vấn từ khi load theme
- **Initial Count**: Số truy vấn ban đầu khi theme được load

#### **Cache Information**
- **WordPress Cache**: Transients, Object Cache
- **Plugin Cache**: WooCommerce, WP Rocket, etc.
- **Object Cache Systems**:
  - **OPcache**: PHP OPcache status và statistics
  - **Redis**: Redis server information và memory usage
  - **Memcached**: Memcached connection và statistics
  - **APCu**: APCu cache information
  - **WP Object Cache**: WordPress native object cache

#### **Plugin Debug Info**
- Thông tin debug từ các plugins tích hợp
- Hiển thị version, features, performance metrics
- Custom debug data từ plugins

#### **Server Information**
- PHP version và configuration
- Server software
- Memory limits và usage
- Cache systems status

## Tích hợp với Plugins

### 1. **Thêm Debug Info cho Plugin**

```php
// Sử dụng action hook
add_action('jankx/debug/add_info', function(&$debugInfo) {
    $debugInfo['My Plugin'] = 'Version 1.0.0, Active Features: 5';
});

// Sử dụng filter hook
add_filter('jankx/debug/modify_info', function($debugInfo) {
    $debugInfo['My Plugin'] = 'Version 1.0.0, Active Features: 5';
    return $debugInfo;
});

// Sử dụng helper method
use Jankx\Debug\DebugInfo;

add_action('jankx/debug/add_info', function(&$debugInfo) {
    DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Version 1.0.0');
});
```

### 2. **Best Practices cho Plugin Integration**

```php
class MyPlugin {
    public function __construct() {
        // Chỉ thêm debug info khi JANKX_DEBUG được kích hoạt
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            add_action('jankx_debug_info', [$this, 'addDebugInfo']);
        }
    }

    public function addDebugInfo(&$debugInfo) {
        try {
            $info = $this->getDebugData();
            DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', $info);
        } catch (Exception $e) {
            DebugInfo::addPluginDebugInfo($debugInfo, 'My Plugin', 'Error: ' . $e->getMessage());
        }
    }
}
```

### 3. **Available Hooks**

#### **Action Hook: `jankx/debug/add_info`**
```php
add_action('jankx/debug/add_info', function(&$debugInfo) {
    // $debugInfo là array reference
    $debugInfo['Plugin Name'] = 'Debug information';
});
```

#### **Filter Hook: `jankx/debug/modify_info`**
```php
add_filter('jankx/debug/modify_info', function($debugInfo) {
    // $debugInfo là array, return modified array
    $debugInfo['Plugin Name'] = 'Debug information';
    return $debugInfo;
});
```

#### **Helper Method: `DebugInfo::addPluginDebugInfo()`**
```php
DebugInfo::addPluginDebugInfo(&$debugInfo, $pluginName, $info);
```

## Các trường hợp sử dụng

### 1. **Development**
- Debug performance issues
- Optimize database queries
- Monitor memory usage
- Test cache effectiveness

### 2. **Production Monitoring**
- Monitor site performance
- Identify bottlenecks
- Track cache performance
- Debug user-reported issues

### 3. **Plugin Development**
- Test plugin performance
- Debug plugin integration
- Monitor plugin impact
- Optimize plugin code

### 4. **Theme Development**
- Optimize theme performance
- Debug theme issues
- Monitor theme impact
- Test theme compatibility

## Troubleshooting

### 1. **Debug Panel không hiển thị**
- Kiểm tra `JANKX_DEBUG` đã được define và có giá trị `true`
- Kiểm tra không có JavaScript errors
- Kiểm tra theme đã load đúng cách
- Debug panel sẽ ẩn trong Gutenberg editor để tránh conflict

### 2. **Database Queries = 0**
- Kiểm tra `SAVEQUERIES` constant đã được enable
- Kiểm tra `$wpdb` object tồn tại
- Kiểm tra WordPress hooks đã được register
- System sử dụng multiple fallback mechanisms để đếm queries

### 3. **Memory Usage không chính xác**
- Kiểm tra PHP memory functions (`memory_get_peak_usage()`)
- Kiểm tra server configuration
- Kiểm tra memory limits

### 4. **Cache Information không đầy đủ**
- Kiểm tra cache systems đã được cài đặt
- Kiểm tra cache connections
- Kiểm tra cache permissions
- System tự động detect các cache systems có sẵn

### 5. **CSS Conflicts với Gutenberg**
- Debug panel được thiết kế để tránh conflict với Gutenberg
- Sử dụng CSS specificity cao với `!important`
- Tự động ẩn trong Gutenberg editor pages

## Performance Impact

### 1. **Minimal Impact**
- Debug system được tối ưu để ít ảnh hưởng performance
- Chỉ hoạt động khi `JANKX_DEBUG` được kích hoạt và có giá trị `true`
- Sử dụng efficient data collection methods
- Lazy loading của debug information

### 2. **Production Considerations**
- Không nên kích hoạt trên production site
- Chỉ sử dụng cho development/staging
- Có thể ảnh hưởng nhẹ đến performance (1-2% overhead)

### 3. **Memory Usage**
- Debug system sử dụng khoảng 1-2MB memory
- Có thể tăng lên tùy thuộc vào số lượng plugins
- Nên monitor memory usage khi sử dụng

## Advanced Features

### 1. **Responsive UI**
- Debug panel responsive trên mobile
- Optimized cho different screen sizes
- Touch-friendly controls
- Smooth animations và transitions

### 2. **State Persistence**
- Remember panel state qua localStorage
- Persist user preferences
- Cross-session settings
- Auto-restore previous state

### 3. **Fullscreen Mode**
- Hiển thị debug info toàn màn hình
- Scrollable content area
- Sticky header với controls
- Optimized cho detailed analysis

### 4. **Plugin Integration**
- Flexible plugin debug info system
- Multiple integration methods
- Error handling cho plugin data
- Sanitized output

## Security Considerations

### 1. **Information Exposure**
- Debug panel có thể expose sensitive information
- Chỉ sử dụng trên development environment
- Không kích hoạt trên public production sites
- Tất cả data được escape và sanitize

### 2. **Data Sanitization**
- Tất cả user-generated content được escape
- Plugin debug info được sanitize
- Secure data handling
- XSS protection

### 3. **Access Control**
- Debug panel chỉ hiển thị khi `JANKX_DEBUG` được kích hoạt
- Có thể integrate với WordPress user roles
- Secure access mechanisms

## Technical Details

### 1. **Database Query Counting**
- Sử dụng multiple mechanisms để đếm queries
- Fallback từ `$wpdb->num_queries` đến `count($wpdb->queries)`
- Custom hooks để track queries từ `functions.php`
- Real-time query counting

### 2. **Cache Detection**
- Automatic detection của cache systems
- OPcache status và statistics
- Redis connection và memory info
- Memcached statistics
- APCu cache information
- WordPress Object Cache status

### 3. **Memory Tracking**
- Peak memory usage tracking
- Memory limit detection
- Real-time memory monitoring
- Memory usage formatting

### 4. **Response Time**
- Microsecond precision timing
- Accurate response time calculation
- Performance benchmarking

## Future Enhancements

### 1. **Planned Features**
- Export debug data (JSON/CSV)
- Historical performance tracking
- Advanced analytics dashboard
- Integration với external monitoring tools

### 2. **API Support**
- REST API endpoints cho debug data
- Webhook notifications
- External integrations
- Custom dashboards

### 3. **Advanced Monitoring**
- Real-time alerts
- Performance thresholds
- Automated optimization suggestions
- Advanced reporting

## Support và Documentation

### 1. **Getting Help**
- Check Jankx documentation
- Review plugin integration guide (`docs/plugin-debug-integration.md`)
- Test với example plugins (`examples/plugin-debug-example.php`)
- Report issues trên GitHub

### 2. **Community**
- Join Jankx community
- Share best practices
- Contribute improvements
- Help other developers

### 3. **Resources**
- Complete API documentation
- Video tutorials
- Code examples
- Troubleshooting guides

## Related Documentation

- [Plugin Debug Integration Guide](plugin-debug-integration.md)
- [Debug Quick Start Guide](debug-quick-start.md)
- [Performance Optimization Guide](../performance/README.md)
- [Development Best Practices](../development/best-practices.md)