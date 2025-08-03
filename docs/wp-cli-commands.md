# Jankx Framework WP CLI Commands

## Tổng quan

Jankx Framework cung cấp các WP CLI commands để quản lý framework, cache và build blocks.

## Cài đặt

Commands được tự động đăng ký khi framework khởi động trong WP CLI context.

## Available Commands

### 1. Framework Information

```bash
wp jankx info
```

Hiển thị thông tin về Jankx Framework:
- Theme name, version, text domain
- Template và stylesheet directory
- Framework components status
- Cache status

### 2. Cache Management

#### Clear all caches
```bash
wp jankx clear_cache
# hoặc
wp jankx cache clear
```

#### Clear specific caches
```bash
wp jankx cache clear_config    # Clear config cache
wp jankx cache clear_blocks    # Clear block cache
wp jankx cache clear_widgets   # Clear widget cache
wp jankx cache clear_users     # Clear user cache
```

#### Check cache status
```bash
wp jankx cache_status
# hoặc
wp jankx cache status
```

### 3. Block Building

```bash
wp jankx build_blocks
```

Build tất cả Gutenberg blocks trong thư mục `resources/blocks/`.

## Cache Groups

Jankx Framework sử dụng các cache groups sau:

- `jankx_config`: Configuration cache
- `jankx_blocks`: Block discovery và asset cache
- `jankx_widgets`: Widget factory cache
- `jankx_users`: User data cache

## Performance Optimization

### Cache Benefits

1. **Config Cache**: Giảm file system operations từ 10-20 xuống 2-3 operations
2. **Block Cache**: Cache block discovery và asset data
3. **Widget Cache**: Cache widget factory data
4. **User Cache**: Cache user data queries

### Cache Invalidation

Cache được tự động invalidate khi:
- Config files thay đổi (dựa trên `filemtime()`)
- Blocks được build lại
- Widgets được thêm/xóa

### Manual Cache Clear

```bash
# Clear tất cả cache
wp jankx clear_cache

# Clear từng loại cache
wp jankx cache clear_config
wp jankx cache clear_blocks
wp jankx cache clear_widgets
wp jankx cache clear_users
```

## Examples

### Development Workflow

```bash
# 1. Build blocks
wp jankx build_blocks

# 2. Clear cache sau khi build
wp jankx clear_cache

# 3. Check status
wp jankx info
```

### Production Deployment

```bash
# 1. Build blocks
wp jankx build_blocks

# 2. Clear cache để đảm bảo fresh data
wp jankx clear_cache

# 3. Verify deployment
wp jankx info
```

### Debug Cache Issues

```bash
# Check cache status
wp jankx cache status

# Clear specific cache nếu có vấn đề
wp jankx cache clear_config
wp jankx cache clear_blocks
```

## Troubleshooting

### Commands không hoạt động

1. Kiểm tra WP CLI đã được cài đặt:
```bash
wp --version
```

2. Kiểm tra framework đã được load:
```bash
wp jankx info
```

3. Kiểm tra cache status:
```bash
wp jankx cache status
```

### Cache không clear

1. Kiểm tra WordPress object cache:
```bash
wp cache flush
```

2. Clear manual:
```bash
wp jankx cache clear
```

### Blocks không build

1. Kiểm tra Node.js/NPM:
```bash
node --version
npm --version
```

2. Kiểm tra thư mục blocks:
```bash
ls resources/blocks/
```

3. Build manual:
```bash
cd resources/blocks/widget-renderer
npm run build
```

## Advanced Usage

### Custom Cache Groups

Framework sử dụng các cache groups riêng biệt để dễ quản lý:

```php
// Config cache
wp_cache_get($key, 'jankx_config');

// Block cache
wp_cache_get($key, 'jankx_blocks');

// Widget cache
wp_cache_get($key, 'jankx_widgets');

// User cache
wp_cache_get($key, 'jankx_users');
```

### Cache Keys

Cache keys được tạo tự động:

- Config: `file_configs_{type}_{mtime}`
- Blocks: `jankx_blocks_discovery`
- Widgets: `jankx_available_widgets`
- Users: `jankx_user_{user_id}`

### Cache TTL

- Config cache: 1 giờ (3600 seconds)
- Block cache: 1 giờ (3600 seconds)
- Widget cache: 1 giờ (3600 seconds)
- User cache: 30 phút (1800 seconds)