# User Service Documentation

## Tổng quan

User Service trong Jankx Framework cung cấp một cách hiệu quả để quản lý thông tin user với caching và filtering capabilities. Service này được thiết kế để giảm thiểu số lần query database và cho phép tùy chỉnh dữ liệu user thông qua WordPress hooks.

## Tính năng chính

- **Caching thông minh**: Cache user data để giảm database queries
- **Filter hooks**: Cho phép child themes và plugins tùy chỉnh user data
- **Context-aware**: Hoạt động tốt trong các context khác nhau (admin, frontend, API)
- **Flexible querying**: Hỗ trợ tìm kiếm user theo nhiều tiêu chí
- **Meta management**: Quản lý user meta data một cách dễ dàng

## Cách sử dụng

### 1. Sử dụng User Facade (Khuyến nghị)

```php
use Jankx\Facades\User;

// Lấy thông tin user theo ID
$user = User::get(1, ['ID', 'display_name', 'user_email']);

// Lấy current user
$currentUser = User::current(['ID', 'display_name']);

// Tìm kiếm user
$searchResults = User::search('john', ['ID', 'display_name'], 5);

// Lấy users theo role
$admins = User::getByRole('administrator', ['ID', 'display_name']);

// Lấy multiple users
$users = User::getMultiple([1, 2, 3], ['ID', 'display_name']);
```

### 2. Sử dụng User Service trực tiếp

```php
use Jankx\Services\UserService;

$userService = new UserService();
$user = $userService->getUser(1, ['ID', 'display_name']);
```

### 3. Quản lý User Meta

```php
// Lấy user meta
$meta = User::getMeta(1, 'custom_field', true);

// Cập nhật user meta
User::updateMeta(1, 'last_activity', time());

// Lấy user roles
$roles = User::getRoles(1);

// Kiểm tra role
if (User::hasRole(1, 'administrator')) {
    // User là admin
}
```

### 4. Avatar và Profile Information

```php
// Lấy avatar URL
$avatar = User::getAvatar(1, 150);

// Lấy display name
$displayName = User::getDisplayName(1);

// Lấy email
$email = User::getEmail(1);
```

## Cache Management

### Cấu hình cache

```php
// Set cache expiry time (30 phút)
User::setCacheExpiry(1800);

// Lấy cache expiry time hiện tại
$expiry = User::getCacheExpiry();
```

### Clear cache

```php
// Clear cache cho specific user
User::clearCache(1);

// Clear tất cả user cache
User::clearCache();
```

## Filter Hooks

### 1. General User Data Filter

```php
add_filter('jankx_user_data', function($userData, $userId, $fields) {
    // Thêm custom field vào user data
    if (is_array($userData)) {
        $userData['custom_info'] = "Custom info for user {$userId}";
    } elseif (is_object($userData)) {
        $userData->custom_info = "Custom info for user {$userId}";
    }

    return $userData;
}, 10, 3);
```

### 2. Context-specific Filters

```php
// Admin context filter
add_filter('jankx_user_data_admin', function($userData, $userId, $fields) {
    if (is_array($userData)) {
        $userData['admin_access'] = true;
    } elseif (is_object($userData)) {
        $userData->admin_access = true;
    }

    return $userData;
}, 10, 3);

// Frontend context filter
add_filter('jankx_user_data_frontend', function($userData, $userId, $fields) {
    if (is_array($userData)) {
        $userData['public_profile'] = true;
    } elseif (is_object($userData)) {
        $userData->public_profile = true;
    }

    return $userData;
}, 10, 3);
```

### 3. Field-specific Filters

```php
add_filter('jankx_user_data_fields', function($userData, $userId, $fields) {
    // Modify specific fields
    if (in_array('display_name', $fields) && is_array($userData)) {
        $userData['display_name'] = "Modified: " . $userData['display_name'];
    }

    return $userData;
}, 10, 3);
```

## Error Handling

```php
try {
    $user = User::get($userId);
    if (!$user) {
        // Handle user not found
        Logger::warning("User not found: {$userId}");
    }
} catch (\Exception $e) {
    Logger::error("Failed to load user: {$userId}", [
        'error' => $e->getMessage(),
    ]);
}
```

## Performance Monitoring

```php
class UserPerformanceMonitor
{
    public function monitorUserLoading($userId)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        $user = User::get($userId);

        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);

        $loadTime = $endTime - $startTime;
        $memoryUsage = $endMemory - $startMemory;

        Logger::info("User loading performance", [
            'user_id' => $userId,
            'load_time' => $loadTime,
            'memory_usage' => $memoryUsage,
        ]);

        return $user;
    }
}
```

## Integration với WordPress Hooks

```php
class UserHookIntegration
{
    public function __construct()
    {
        // Clear user cache khi user được update
        add_action('profile_update', [$this, 'clearUserCache']);
        add_action('user_register', [$this, 'clearUserCache']);
        add_action('delete_user', [$this, 'clearUserCache']);
    }

    public function clearUserCache($userId)
    {
        User::clearCache($userId);
        Logger::info("Cleared cache for user: {$userId}");
    }
}

// Initialize hook integration
new UserHookIntegration();
```

## Template Usage

```php
class UserTemplateHelper
{
    public function renderUserProfile($userId)
    {
        $user = User::get($userId, [
            'ID', 'display_name', 'user_email', 'user_registered'
        ]);

        if (!$user) {
            return '<p>User not found</p>';
        }

        $avatar = User::getAvatar($userId, 100);
        $roles = User::getRoles($userId);

        $html = '<div class="user-profile">';
        $html .= '<img src="' . esc_url($avatar) . '" alt="User Avatar" />';
        $html .= '<h3>' . esc_html($user['display_name']) . '</h3>';
        $html .= '<p>Email: ' . esc_html($user['user_email']) . '</p>';
        $html .= '<p>Roles: ' . esc_html(implode(', ', $roles)) . '</p>';
        $html .= '<p>Registered: ' . esc_html($user['user_registered']) . '</p>';
        $html .= '</div>';

        return $html;
    }
}
```

## Configuration

### Cache Settings

Mặc định, User Service sử dụng cache expiry time là 1 giờ (3600 giây). Bạn có thể thay đổi điều này:

```php
// Set cache expiry to 30 minutes
User::setCacheExpiry(1800);
```

### Service Registration

User Service được đăng ký tự động trong các context sau:

- **Frontend**: `FrontendServiceProvider`
- **Admin**: `AdminServiceProvider`

Service được đăng ký với alias `user.service` và có thể được resolve thông qua container:

```php
$userService = $container->make('user.service');
```

## Best Practices

1. **Sử dụng Facade**: Luôn sử dụng `User::get()` thay vì tạo instance trực tiếp
2. **Cache management**: Clear cache khi user data thay đổi
3. **Error handling**: Luôn kiểm tra null values
4. **Performance**: Sử dụng specific fields để giảm data transfer
5. **Security**: Sanitize user data trước khi hiển thị

## Troubleshooting

### Cache không hoạt động

```php
// Clear all cache
User::clearCache();

// Check cache expiry
$expiry = User::getCacheExpiry();
```

### Filter không được apply

```php
// Đảm bảo filter được add trước khi gọi User::get()
add_filter('jankx_user_data', function($userData, $userId, $fields) {
    // Your filter logic
    return $userData;
}, 10, 3);

$user = User::get($userId); // Filter sẽ được apply
```

### Performance issues

```php
// Monitor performance
$startTime = microtime(true);
$user = User::get($userId);
$loadTime = microtime(true) - $startTime;

if ($loadTime > 0.1) {
    Logger::warning("Slow user loading: {$loadTime}s for user {$userId}");
}
```