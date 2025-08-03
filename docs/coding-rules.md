# Jankx Framework Coding Rules

## Tổng quan

Jankx Framework tuân thủ WordPress Coding Standards kết hợp với PSR-12 và **Zen of Python** để đảm bảo code dễ maintain, mở rộng và có tính thực tiễn cao.

## Triết lý phát triển

### Nguyên tắc cốt lõi

**"Tất cả tính năng đều load qua Service Provider"**

Đây là triết lý phát triển cốt lõi của Jankx Framework, ảnh hưởng đến tất cả quy tắc coding:

#### 1. **Service Provider Pattern**
- Mọi tính năng phải được đóng gói trong Service Provider
- Providers được đăng ký trong `config/providers.php`
- Mỗi provider có trách nhiệm rõ ràng và độc lập

#### 2. **Dependency Injection**
- Sử dụng Application Container cho dependency injection
- Tránh global variables và static methods
- Services được inject qua constructor hoặc method injection

#### 3. **Lazy Loading**
- Services chỉ được load khi cần thiết
- Sử dụng lazy loading cho expensive operations
- Bootstrap theo thứ tự logic và dependency

#### 4. **Testability**
- Mỗi service có thể được test độc lập
- Dễ dàng mock dependencies
- Clear separation of concerns

## 0. Zen of Python Principles

Jankx Framework áp dụng Zen of Python vào PHP development:

### 0.1 Beautiful is better than ugly
```php
// ✅ Beautiful - Clean, readable code
$user = User::getById($id);
$posts = Post::getRecent(10);

// ❌ Ugly - Hard to read, confusing
$u = get_user_by('ID', $id);
$p = get_posts(['numberposts' => 10]);
```

### 0.2 Explicit is better than implicit
```php
// ✅ Explicit - Clear what's happening
$config = $app->make('config');
$userService = $app->make(UserService::class);

// ❌ Implicit - Magic, unclear
$config = app('config');
$user = User::instance();
```

### 0.3 Simple is better than complex
```php
// ✅ Simple - Straightforward approach
public function getUser($id) {
    return get_user_by('ID', $id);
}

// ❌ Complex - Over-engineered
public function getUser($id) {
    $cache = $this->cache->get("user_{$id}");
    if ($cache) return $cache;

    $user = get_user_by('ID', $id);
    $this->cache->set("user_{$id}", $user, 3600);
    return $user;
}
```

### 0.4 Complex is better than complicated
```php
// ✅ Complex but clear - When complexity is necessary
public function deepMergeConfig($parent, $child) {
    foreach ($child as $key => $value) {
        if (is_array($value) && isset($parent[$key]) && is_array($parent[$key])) {
            $parent[$key] = $this->deepMergeConfig($parent[$key], $value);
        } else {
            $parent[$key] = $value;
        }
    }
    return $parent;
}

// ❌ Complicated - Hard to understand
public function merge($p, $c) {
    return array_merge_recursive($p, $c);
}
```

### 0.5 Flat is better than nested
```php
// ✅ Flat - Easy to follow
public function processUser($user) {
    if (!$user) return null;
    if (!$user->isActive()) return null;
    if ($user->isBlocked()) return null;

    return $this->formatUser($user);
}

// ❌ Nested - Hard to read
public function processUser($user) {
    if ($user) {
        if ($user->isActive()) {
            if (!$user->isBlocked()) {
                return $this->formatUser($user);
            }
        }
    }
    return null;
}
```

### 0.6 Sparse is better than dense
```php
// ✅ Sparse - Clear separation
$config = [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'debug' => true,
    'features' => [
        'gutenberg' => true,
        'cache' => true,
    ]
];

// ❌ Dense - Hard to read
$config = ['name'=>'Jankx Framework','version'=>'2.0.0','debug'=>true,'features'=>['gutenberg'=>true,'cache'=>true]];
```

### 0.7 Readability counts
```php
// ✅ Readable - Self-documenting
$isDebugMode = Environment::isDebugLog();
$cacheKey = "user_{$userId}_data";
$expirationTime = 3600; // 1 hour

// ❌ Unreadable - Magic numbers/strings
$debug = defined('WP_DEBUG') && WP_DEBUG;
$key = "u_{$id}_d";
$ttl = 3600;
```

### 0.8 Special cases aren't special enough to break the rules
```php
// ✅ Consistent - Follow the same pattern
public function getConfig($key, $default = null) {
    return $this->config->get($key, $default);
}

public function getUser($id, $default = null) {
    return $this->userService->get($id, $default);
}

// ❌ Inconsistent - Different patterns for similar operations
public function getConfig($key) {
    return isset($this->config[$key]) ? $this->config[$key] : null;
}

public function getUser($id) {
    return get_user_by('ID', $id);
}
```

### 0.9 Although practicality beats purity
```php
// ✅ Practical - Works in real-world scenarios
public function getAssetUrl($path) {
    return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
}

// ❌ Pure but impractical - Over-abstraction
public function getAssetUrl($path) {
    return $this->urlManager->asset($path);
}
```

### 0.10 Errors should never pass silently
```php
// ✅ Explicit error handling
public function loadConfig($file) {
    if (!file_exists($file)) {
        throw new ConfigNotFoundException("Config file not found: {$file}");
    }

    $config = include $file;
    if (!is_array($config)) {
        throw new InvalidConfigException("Config must be an array");
    }

    return $config;
}

// ❌ Silent failures
public function loadConfig($file) {
    return @include $file ?: [];
}
```

### 0.11 Unless explicitly silenced
```php
// ✅ Explicitly silenced when necessary
try {
    $result = $this->riskyOperation();
} catch (NonCriticalException $e) {
    Log::warning("Non-critical error: " . $e->getMessage());
    $result = $this->fallbackOperation();
}
```

### 0.12 In the face of ambiguity, refuse the temptation to guess
```php
// ✅ Clear and explicit
public function processUser($user) {
    if (!$user instanceof WP_User) {
        throw new InvalidArgumentException('User must be WP_User instance');
    }

    return $this->formatUser($user);
}

// ❌ Ambiguous - What if $user is null, string, or array?
public function processUser($user) {
    return $this->formatUser($user);
}
```

### 0.13 There should be one-- and preferably only one --obvious way to do it
```php
// ✅ One obvious way - Use Facades
$imageUrl = Url::image('logo.png');
$cssUrl = Url::css('style.css');

// ❌ Multiple ways - Confusing
$imageUrl = get_template_directory_uri() . '/assets/images/logo.png';
$imageUrl = get_stylesheet_directory_uri() . '/assets/images/logo.png';
$imageUrl = home_url('/wp-content/themes/theme/assets/images/logo.png');
```

### 0.14 Although that way may not be obvious at first unless you're Dutch
```php
// ✅ Clear naming makes it obvious
class UserService {
    public function getById($id) { /* ... */ }
    public function getCurrentUser() { /* ... */ }
}

// ❌ Unclear naming
class User {
    public function get($id) { /* ... */ }
    public function current() { /* ... */ }
}
```

### 0.15 Now is better than never
```php
// ✅ Do it now - Simple implementation
public function getConfig($key) {
    return $this->config[$key] ?? null;
}

// ❌ Never - Over-planning
public function getConfig($key) {
    // TODO: Add caching, validation, type checking, etc.
    return $this->config[$key] ?? null;
}
```

### 0.16 Although never is often better than *right* now
```php
// ✅ Think before implementing
// Don't add features you don't need yet
// Don't optimize prematurely
// Don't add complexity without clear benefit
```

### 0.17 If the implementation is hard to explain, it's a bad idea
```php
// ✅ Easy to explain
public function mergeConfigs($parent, $child) {
    return array_merge($parent, $child);
}

// ❌ Hard to explain - Avoid complex patterns
public function mergeConfigs($parent, $child) {
    // Complex recursive merging with special cases
    // that nobody can understand
}
```

### 0.18 If the implementation is easy to explain, it may be a good idea
```php
// ✅ Easy to explain - Good idea
public function getAssetUrl($path) {
    return get_template_directory_uri() . '/assets/' . $path;
}
```

### 0.19 Namespaces are one honking great idea -- let's do more of those!
```php
// ✅ Use namespaces properly
namespace Jankx\Services;
namespace Jankx\Support\Providers;
namespace Jankx\Foundation\Bootstrap;

// ✅ Use imports
use Jankx\Facades\Url;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;
```

## 1. WordPress Coding Standards

### 1.1 File Naming
- **PHP Files**: `PascalCase.php` (classes), `snake_case.php` (functions)
- **Directories**: `snake_case/` hoặc `PascalCase/`
- **Theme Files**: `kebab-case.php` (WordPress convention)

### 1.2 Class Naming
```php
// ✅ Correct - PSR-12 PascalCase
class ThemeManager {}
class AssetManager {}
class WpCliCommand {}
class MenuManager {}
class SidebarManager {}
class FooterManager {}

// ❌ Incorrect
class jankx_theme_manager {}
class themeAssetsManager {}
class Jankx_Theme_Manager {}
```

### 1.3 Function Naming
```php
// ✅ Correct - PSR-12 camelCase
function getThemeOption() {}
function getThemeConfig() {}
function handleAjaxRequest() {}
function loadCachedConfig() {}
function clearConfigCache() {}

// ❌ Incorrect
function jankx_get_theme_option() {}
function JankxGetThemeOption() {}
function get_theme_config() {}
```

### 1.4 Variable Naming
```php
// ✅ Correct - PSR-12 camelCase
$themeOptions = [];
$userId = get_current_user_id();
$postData = $_POST;
$cacheKey = 'file_configs_app_' . $checksum;
$configContent = file_get_contents($filePath);

// ❌ Incorrect
$theme_options = [];
$user_id = get_current_user_id();
$post_data = $_POST;
```

### 1.5 Constant Naming
```php
// ✅ Correct
define('JANKX_VERSION', '2.0.0');
define('JANKX_DEBUG', true);
define('THEME_TEXT_DOMAIN', 'jankx-theme');
define('JANKX_CONFIG_PATH', '/path/to/config');
// Child theme config path is automatically detected
// No need to define JANKX_CHILD_CONFIG_PATH

// ❌ Incorrect
define('jankx_version', '2.0.0');
define('JankxDebug', true);
```

## 2. PSR-12 Compliance

### 2.1 Indentation
```php
// ✅ Correct - 4 spaces
class ThemeManager
{
    public function registerAssets()
    {
        if (is_admin()) {
            wp_enqueue_script('admin-script');
        }
    }
}

// ❌ Incorrect - tabs or 2 spaces
class ThemeManager
{
	public function registerAssets()
	{
		if (is_admin()) {
			wp_enqueue_script('admin-script');
		}
	}
}
```

### 2.2 Line Length
```php
// ✅ Correct - Max 120 characters
$longVariableName = $this->getVeryLongMethodNameWithManyParameters(
    $param1,
    $param2,
    $param3
);

// ❌ Incorrect - Too long
$longVariableName = $this->getVeryLongMethodNameWithManyParameters($param1, $param2, $param3, $param4, $param5, $param6, $param7, $param8, $param9, $param10);
```

### 2.3 Short Array Syntax
```php
// ✅ Correct
$config = [
    'name' => 'Jankx',
    'version' => '2.0.0',
    'features' => [
        'blocks',
        'admin',
    ],
];

// ❌ Incorrect
$config = array(
    'name' => 'Jankx',
    'version' => '2.0.0',
    'features' => array(
        'blocks',
        'admin',
    ),
);
```

## 3. Hook Naming Convention

### 3.1 Package Style with Forward Slashes
```php
// ✅ Correct
add_action('jankx/theme/init', [$this, 'initTheme']);
add_filter('jankx/theme/config', [$this, 'modifyConfig']);
do_action('jankx/blocks/registered', $blocks);
add_filter('jankx/user/data', [$this, 'modifyUserData']);

// ❌ Incorrect
add_action('jankx-theme-init', [$this, 'initTheme']);
add_filter('jankx-theme-config', [$this, 'modifyConfig']);
do_action('jankx-blocks-registered', $blocks);
add_action('jankx_theme_init', [$this, 'initTheme']);
add_filter('jankx_theme_config', [$this, 'modifyConfig']);
do_action('jankx_blocks_registered', $blocks);
```

### 3.2 Hook Priority
```php
// ✅ Correct
add_action('wp_enqueue_scripts', [$this, 'enqueueAssets'], 10);
add_filter('the_content', [$this, 'modifyContent'], 20);

// ❌ Incorrect - Missing priority
add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
add_filter('the_content', [$this, 'modifyContent']);
```

## 4. Internationalization (i18n)

### 4.1 Hard-coded Text Domain
```php
// ✅ Correct
__('Theme Settings', 'jankx-theme');
_e('Save Changes', 'jankx-theme');
esc_html__('Loading...', 'jankx-theme');

// ❌ Incorrect
__('Theme Settings');
_e('Save Changes');
esc_html__('Loading...');
```

### 4.2 Translation Functions
```php
// ✅ Correct
$message = sprintf(
    /* translators: %s: user name */
    __('Welcome back, %s!', 'jankx-theme'),
    $userName
);

$count = _n(
    /* translators: %d: number of items */
    '%d item found',
    '%d items found',
    $count,
    'jankx-theme'
);
```

## 5. Output Escaping

### 5.1 HTML Output
```php
// ✅ Correct
echo esc_html($userInput);
echo esc_attr($attributeValue);
echo wp_kses_post($htmlContent);
echo esc_url($url);

// ❌ Incorrect
echo $userInput;
echo $attributeValue;
echo $htmlContent;
echo $url;
```

### 5.2 Form Output
```php
// ✅ Correct
<input type="text" value="<?php echo esc_attr($value); ?>" />
<textarea><?php echo esc_textarea($content); ?></textarea>
<a href="<?php echo esc_url($link); ?>"><?php echo esc_html($text); ?></a>

// ❌ Incorrect
<input type="text" value="<?php echo $value; ?>" />
<textarea><?php echo $content; ?></textarea>
<a href="<?php echo $link; ?>"><?php echo $text; ?></a>
```

## 6. Input Sanitization

### 6.1 Form Input
```php
// ✅ Correct
$userInput = sanitize_text_field($_POST['user_input']);
$email = sanitize_email($_POST['email']);
$url = sanitize_url($_POST['url']);
$html = wp_kses_post($_POST['html_content']);

// ❌ Incorrect
$userInput = $_POST['user_input'];
$email = $_POST['email'];
$url = $_POST['url'];
$html = $_POST['html_content'];
```

### 6.2 Database Input
```php
// ✅ Correct
$title = sanitize_text_field($postData['title']);
$content = wp_kses_post($postData['content']);
$metaValue = sanitize_meta('custom_field', $postData['meta'], 'post');

// ❌ Incorrect
$title = $postData['title'];
$content = $postData['content'];
$metaValue = $postData['meta'];
```

## 7. Database Prepared Statements

### 7.1 WordPress Database API
```php
// ✅ Correct
global $wpdb;

$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_type = %s AND post_status = %s",
        'post',
        'publish'
    )
);

$wpdb->insert(
    $wpdb->prefix . 'custom_table',
    [
        'title' => $title,
        'content' => $content,
        'created_at' => current_time('mysql'),
    ],
    ['%s', '%s', '%s']
);

// ❌ Incorrect
$results = $wpdb->get_results(
    "SELECT * FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status = 'publish'"
);

$wpdb->insert(
    $wpdb->prefix . 'custom_table',
    [
        'title' => $title,
        'content' => $content,
        'created_at' => current_time('mysql'),
    ]
);
```

### 7.2 Custom Queries
```php
// ✅ Correct
$userId = get_current_user_id();
$posts = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT p.*, pm.meta_value as custom_field
         FROM {$wpdb->posts} p
         LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
         WHERE p.post_author = %d AND p.post_status = %s",
        $userId,
        'publish'
    )
);

// ❌ Incorrect
$userId = get_current_user_id();
$posts = $wpdb->get_results(
    "SELECT p.*, pm.meta_value as custom_field
     FROM {$wpdb->posts} p
     LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
     WHERE p.post_author = {$userId} AND p.post_status = 'publish'"
);
```

## 8. String Concatenation

### 8.1 Concatenation Style
```php
// ✅ Correct
$message = 'Hello ' . $name . ', welcome to ' . $siteName;
$url = home_url('/custom-page/');
$class = 'button ' . $size . ' ' . $style;
$cacheKey = 'file_configs_' . $type . '_' . $checksum;

// ❌ Incorrect
$message = "Hello $name, welcome to $siteName";
$url = home_url("/custom-page/");
$class = "button $size $style";
```

### 8.2 Complex Concatenation
```php
// ✅ Correct
$html = '<div class="' . esc_attr($class) . '">' .
        '<h2>' . esc_html($title) . '</h2>' .
        '<p>' . wp_kses_post($content) . '</p>' .
        '</div>';

// ❌ Incorrect
$html = "<div class='$class'>
            <h2>$title</h2>
            <p>$content</p>
         </div>";
```

### URL Generation
**❌ Sai:**
```php
// Dùng nhiều format URL khác nhau
$imageUrl = get_template_directory_uri() . '/assets/images/logo.png';
$cssUrl = get_stylesheet_directory_uri() . '/assets/css/style.css';
$jsUrl = get_template_directory_uri() . '/assets/js/script.js';
```

**✅ Đúng:**
```php
// Dùng Url Facade để centralize URL generation
$imageUrl = \Jankx\Facades\Url::image('logo.png');
$cssUrl = \Jankx\Facades\Url::css('style.css');
$jsUrl = \Jankx\Facades\Url::js('script.js');
$blockUrl = \Jankx\Facades\Url::blockAsset('widget-renderer/build/index.js');
```

**Rule:**
> All asset URLs (CSS, JS, images, fonts, etc.) must be generated via the AssetService (through the Asset Facade).
> Do not use get_template_directory_uri(), get_stylesheet_directory_uri(), home_url(), site_url(), or any other direct URL concatenation for assets.

## 9. Configuration Management

### 9.1 Config Cache System
```php
// ✅ Correct
protected function loadCachedConfig($filePath, $type)
{
    $content = file_get_contents($filePath);
    $checksum = crc32($content);
    $cacheKey = 'file_configs_' . $type . '_' . $checksum;

    $cached = wp_cache_get($cacheKey, 'jankx_config');
    if ($cached !== false) {
        return $cached;
    }

    $config = include $filePath;
    wp_cache_set($cacheKey, $config, 'jankx_config', 3600);

    return $config;
}

// ❌ Incorrect
protected function loadConfig($filePath)
{
    return include $filePath; // No caching
}
```

### 9.2 Environment Variables
```php
// ✅ Correct
$configPath = getenv('JANKX_CONFIG_PATH') ?: get_template_directory() . '/config';
$childConfigPath = get_stylesheet_directory() . '/config';

// ❌ Incorrect
$configPath = get_template_directory() . '/config'; // No environment override
```

### 9.3 Deep Merge Configuration
```php
// ✅ Correct
protected function deepMergeConfig($parent, $child)
{
    foreach ($child as $key => $value) {
        if (is_array($value) && isset($parent[$key]) && is_array($parent[$key])) {
            $parent[$key] = $this->deepMergeConfig($parent[$key], $value);
        } else {
            $parent[$key] = $value;
        }
    }
    return $parent;
}

// ❌ Incorrect
$config = array_merge($parent, $child); // No deep merge
```

## 10. Error Suppression System

### 10.1 Error Suppression Configuration
```php
// ✅ Correct
// config/error.php
return [
    'suppression' => [
        'doing_it_wrong' => [
            'enabled' => true,
            'functions' => ['wp_enqueue_script'],
            'patterns' => ['wp-editor.*should not be enqueued']
        ],
        'php_errors' => [
            'enabled' => true,
            'messages' => ['Deprecated:', 'Notice:']
        ],
        'admin_notices' => [
            'enabled' => true,
            'notices' => ['Plugin compatibility']
        ]
    ]
];

// ❌ Incorrect
// Suppress all errors without configuration
error_reporting(0);
```

### 10.2 Conditional Error Suppression
```php
// ✅ Correct
public function suppressDoingItWrong()
{
    $config = Config::get('error.suppression.doing_it_wrong');

    if (!isset($config['enabled']) || $config['enabled'] === false) {
        return;
    }

    add_filter('doing_it_wrong_trigger_error', [$this, 'filterDoingItWrong'], 10, 3);
}

// ❌ Incorrect
public function suppressDoingItWrong()
{
    // Always suppress without checking config
    add_filter('doing_it_wrong_trigger_error', '__return_false');
}
```

## 11. Layout Management

### 11.1 Manager Classes
```php
// ✅ Correct
class MenuManager
{
    public function render($location)
    {
        if (!has_nav_menu($location)) {
            return '';
        }

        return wp_nav_menu([
            'theme_location' => $location,
            'echo' => false,
            'container' => false
        ]);
    }
}

class SidebarManager
{
    public function render($id)
    {
        if (!is_active_sidebar($id)) {
            return '';
        }

        ob_start();
        dynamic_sidebar($id);
        return ob_get_clean();
    }
}

// ❌ Incorrect
function render_menu($location)
{
    return wp_nav_menu(['theme_location' => $location]);
}
```

### 11.2 Layout Configuration
```php
// ✅ Correct
// config/layout.php
return [
    'menu' => [
        'primary' => ['location' => 'primary', 'description' => 'Primary Menu'],
        'secondary' => ['location' => 'secondary', 'description' => 'Secondary Menu'],
        'footer' => ['location' => 'footer', 'description' => 'Footer Menu'],
        'mobile' => ['location' => 'mobile', 'description' => 'Mobile Menu']
    ],
    'sidebar' => [
        'primary' => ['id' => 'primary', 'name' => 'Primary Sidebar'],
        'secondary' => ['id' => 'secondary', 'name' => 'Secondary Sidebar']
    ],
    'footer' => [
        'menu' => ['location' => 'footer-menu'],
        'widgets' => ['columns' => 3],
        'content' => ['copyright' => '© 2024'],
        'layout' => ['type' => 'columns']
    ]
];

// ❌ Incorrect
// Hard-coded layout configuration
$menus = ['primary', 'secondary', 'footer'];
$sidebars = ['primary', 'secondary'];
```

## 12. System Services

### 12.1 User Service with Cache
```php
// ✅ Correct
class UserService
{
    public function getById($id)
    {
        $cacheKey = 'user_' . $id;
        $cached = wp_cache_get($cacheKey, 'jankx_users');

        if ($cached !== false) {
            return $cached;
        }

        $user = get_user_by('id', $id);
        if ($user) {
            $userData = apply_filters('jankx/user/data', $user);
            wp_cache_set($cacheKey, $userData, 'jankx_users', 3600);
            return $userData;
        }

        return null;
    }
}

// ❌ Incorrect
function get_user_by_id($id)
{
    return get_user_by('id', $id); // No caching
}
```

### 12.2 Cache Service
```php
// ✅ Correct
class CacheService
{
    public function get($key, $default = null)
    {
        return wp_cache_get($key, 'jankx_cache') ?: $default;
    }

    public function set($key, $value, $ttl = 3600)
    {
        return wp_cache_set($key, $value, 'jankx_cache', $ttl);
    }
}

// ❌ Incorrect
function cache_get($key)
{
    return wp_cache_get($key); // No group isolation
}
```

## 13. Helper Functions

### 13.1 Static Classes
```php
// ✅ Correct
class ThemeHelper
{
    public static function getThemeOption($key, $default = null)
    {
        return get_option('theme_' . $key, $default);
    }

    public static function isDevelopment()
    {
        return defined('WP_DEBUG') && WP_DEBUG;
    }

    public static function getAssetUrl($file)
    {
        return get_template_directory_uri() . '/assets/' . $file;
    }
}

// Usage
$option = ThemeHelper::getThemeOption('colorScheme', 'default');

// ❌ Incorrect
function getThemeOption($key, $default = null)
{
    return get_option("theme_{$key}", $default);
}

function isDevelopment()
{
    return defined('WP_DEBUG') && WP_DEBUG;
}
```

### 13.2 PSR-4 Autoloading
```php
// ✅ Correct - follows PSR-4
namespace Jankx\Helper;

class Environment
{
    public static function isDebugLog()
    {
        return defined('WP_DEBUG') && WP_DEBUG;
    }
}

// ❌ Incorrect - global functions
function jankx_is_debug_log()
{
    return defined('WP_DEBUG') && WP_DEBUG;
}
```

## 14. Debugging

### 14.1 Jankx Log Facade
```php
// ✅ Correct
use Jankx\Facades\Log;

Log::info('Theme initialized successfully');
Log::error('Failed to load configuration', ['file' => $configFile]);
Log::debug('User data', ['userId' => $userId, 'action' => 'login']);

// ❌ Incorrect
error_log('Theme initialized successfully');
var_dump($data);
print_r($array);
```

### 14.2 Debug Conditions
```php
// ✅ Correct
if (Environment::isDebugLog()) {
    Log::debug('Debug information', $data);
}

// ❌ Incorrect
Log::debug('Debug information', $data); // Always logs
```

## 15. Global Variables

### 15.1 No Additional Globals
```php
// ✅ Correct
class ThemeManager
{
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }
}

// ❌ Incorrect
global $jankx_config;
$jankx_config = [];

global $theme_manager;
$theme_manager = new ThemeManager();
```

### 15.2 WordPress Globals Only
```php
// ✅ Correct - WordPress globals
global $wpdb;
global $post;
global $wp_query;

// ❌ Incorrect - Custom globals
global $jankx_theme_options;
global $custom_global_variable;
```

## 16. WordPress Functions

### 16.1 Direct Usage When Needed
```php
// ✅ Correct
$postId = get_the_ID();
$postTitle = get_the_title();
$postContent = get_the_content();

if (is_admin()) {
    wp_enqueue_script('admin-script');
}

// ❌ Incorrect - Unnecessary abstraction
class WordPressWrapper
{
    public static function getPostId()
    {
        return get_the_ID();
    }
}
```

### 16.2 WordPress Hooks
```php
// ✅ Correct
add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
add_filter('the_content', [$this, 'modifyContent']);
add_action('after_setup_theme', [$this, 'setupTheme']);

// ❌ Incorrect - Custom event system
$this->event_dispatcher->dispatch('assets.enqueue', $assets);
```

## 17. Programming Principles

### 17.1 SOLID Principles

#### Single Responsibility Principle (SRP)
```php
// ✅ Correct
class ThemeAssetsManager
{
    public function enqueueScripts() {}
    public function enqueueStyles() {}
}

class ThemeMenuManager
{
    public function registerMenus() {}
    public function displayMenu() {}
}

class CacheManager
{
    public function get($key) {}
    public function set($key, $value) {}
    public function clear($key) {}
}

// ❌ Incorrect
class ThemeManager
{
    public function enqueueScripts() {}
    public function registerMenus() {}
    public function handleAjax() {}
    public function saveOptions() {}
}
```

#### Open/Closed Principle (OCP)
```php
// ✅ Correct
interface ThemeProvider
{
    public function register(Application $app);
    public function boot(Application $app);
}

class CustomThemeProvider implements ThemeProvider
{
    public function register(Application $app) {}
    public function boot(Application $app) {}
}

// ❌ Incorrect
class ThemeManager
{
    public function registerProvider($type)
    {
        if ($type === 'custom') {
            // Custom logic
        } elseif ($type === 'default') {
            // Default logic
        }
    }
}
```

### 17.2 DRY (Don't Repeat Yourself)
```php
// ✅ Correct - Using helper methods
class ThemeHelper
{
    public static function getAssetUrl($file)
    {
        return get_template_directory_uri() . '/assets/' . $file;
    }
}

// Usage
$cssUrl = ThemeHelper::getAssetUrl('style.css');
$jsUrl = ThemeHelper::getAssetUrl('script.js');

// ✅ Correct - Using Log Facade for debug logging
use Jankx\Facades\Log;

Log::debug('Loading configuration...');
Log::debug('Config data: ' . print_r($config, true));
```

// ❌ Incorrect - Manual prefix with error_log
error_log('[JANKX DEBUG] Loading configuration...');
error_log('[JANKX DEBUG] Config data: ' . print_r($config, true));
```

// ❌ Incorrect - Repeating asset paths
$cssUrl = get_template_directory_uri() . '/assets/style.css';
$jsUrl = get_template_directory_uri() . '/assets/script.js';
```

### 17.3 KISS (Keep It Simple, Stupid)
```php
// ✅ Correct
public function isUserLoggedIn()
{
    return is_user_logged_in();
}

// ❌ Incorrect
public function isUserLoggedIn()
{
    global $current_user;
    return isset($current_user) && $current_user->ID > 0 &&
           wp_validate_auth_cookie() !== false;
}
```

### 17.4 YAGNI (You Aren't Gonna Need It)
```php
// ✅ Correct - Only implement what you need
class ThemeManager
{
    public function init()
    {
        add_action('after_setup_theme', [$this, 'setup_theme']);
    }
}

// ❌ Incorrect - Over-engineering
class ThemeManager
{
    public function init()
    {
        $this->setup_event_system();
        $this->setup_dependency_injection();
        $this->setup_caching_system();
        $this->setup_theme();
    }
}
```

### 17.5 Separation of Concerns (SoC)
```php
// ✅ Correct
class ThemeAssetsManager
{
    public function enqueueAssets() {}
}

class ThemeMenuManager
{
    public function registerMenus() {}
}

class ThemeOptionsManager
{
    public function saveOptions() {}
}

class CacheManager
{
    public function manageCache() {}
}

// ❌ Incorrect
class ThemeManager
{
    public function doEverything()
    {
        // Assets, menus, options, everything mixed together
    }
}
```

### 17.6 Law of Demeter
```php
// ✅ Correct
class ThemeManager
{
    private $config;

    public function getThemeName()
    {
        return $this->config->get('app.name');
    }
}

// ❌ Incorrect
class ThemeManager
{
    public function getThemeName()
    {
        return $this->app->make('config')->get('app.name');
    }
}
```

### 17.7 Encapsulation
```php
// ✅ Correct
class ThemeOptions
{
    private $options = [];

    public function get($key, $default = null)
    {
        return $this->options[$key] ?? $default;
    }

    public function set($key, $value)
    {
        $this->options[$key] = $value;
    }
}

// ❌ Incorrect
class ThemeOptions
{
    public $options = [];
}
```

## 18. Unit Testing

### 18.1 Test Structure
```php
// ✅ Correct
class ThemeManagerTest extends TestCase
{
    private $theme_manager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->theme_manager = new ThemeManager();
    }

    public function testShouldRegisterThemeSupport()
    {
        // Arrange
        $expectedSupports = ['post-thumbnails', 'title-tag'];

        // Act
        $this->theme_manager->setupTheme();

        // Assert
        foreach ($expectedSupports as $support) {
            $this->assertTrue(current_theme_supports($support));
        }
    }
}
```

### 18.2 Test Coverage
```php
// ✅ Correct - Test all public methods
class ThemeHelperTest extends TestCase
{
    public function testGetAssetUrl()
    {
        $url = ThemeHelper::getAssetUrl('style.css');
        $this->assertStringContainsString('/assets/style.css', $url);
    }

    public function testGetThemeOption()
    {
        $option = ThemeHelper::getThemeOption('testKey', 'default');
        $this->assertEquals('default', $option);
    }
}
```

### 18.3 Cache Testing
```php
// ✅ Correct
class LoadConfigurationTest extends TestCase
{
    public function testLoadCachedConfigMethod()
    {
        // Create temporary test file
        $testConfigDir = sys_get_temp_dir() . '/jankx_test_config_' . uniqid();
        if (!is_dir($testConfigDir)) {
            mkdir($testConfigDir, 0777, true);
        }

        $testConfig = [
            'name' => 'Test Config',
            'version' => '1.0.0'
        ];
        file_put_contents($testConfigDir . '/app.php', '<?php return ' . var_export($testConfig, true) . ';');

        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->loadConfiguration);
        $method = $reflection->getMethod('loadCachedConfig');
        $method->setAccessible(true);

        $result = $method->invoke($this->loadConfiguration, $testConfigDir . '/app.php', 'app');

        // Should return config from file
        $this->assertEquals($testConfig, $result);

        // Cleanup
        unlink($testConfigDir . '/app.php');
        rmdir($testConfigDir);
    }
}
```

## 19. Code Documentation

### 19.1 PHPDoc Standards
```php
/**
 * Theme manager class for handling theme initialization and configuration.
 *
 * @package Jankx\Theme
 * @since 2.0.0
 */
class ThemeManager
{
    /**
     * Initialize the theme.
     *
     * @param \Jankx\Foundation\Application $app The application instance.
     * @return void
     */
    public function init(Application $app)
    {
        // Implementation
    }
}
```

### 19.2 Inline Comments
```php
// ✅ Correct
// Check if user has permission to edit posts
if (current_user_can('edit_posts')) {
    // Add edit link to post
    $editLink = get_edit_post_link($postId);
}

// ❌ Incorrect
if (current_user_can('edit_posts')) { // Check permissions
    $editLink = get_edit_post_link($postId); // Get edit link
}
```

## 20. Performance Considerations

### 20.1 Configuration Caching
```php
// ✅ Correct
protected function loadCachedConfig($filePath, $type)
{
    $content = file_get_contents($filePath);
    $checksum = crc32($content);
    $cacheKey = 'file_configs_' . $type . '_' . $checksum;

    $cached = wp_cache_get($cacheKey, 'jankx_config');
    if ($cached !== false) {
        return $cached;
    }

    $config = include $filePath;
    wp_cache_set($cacheKey, $config, 'jankx_config', 3600);

    return $config;
}

// ❌ Incorrect
protected function loadConfig($filePath)
{
    return include $filePath; // No caching
}
```

### 20.2 User Data Caching
```php
// ✅ Correct
public function getById($id)
{
    $cacheKey = 'user_' . $id;
    $cached = wp_cache_get($cacheKey, 'jankx_users');

    if ($cached !== false) {
        return $cached;
    }

    $user = get_user_by('id', $id);
    if ($user) {
        $userData = apply_filters('jankx/user/data', $user);
        wp_cache_set($cacheKey, $userData, 'jankx_users', 3600);
        return $userData;
    }

    return null;
}

// ❌ Incorrect
public function getById($id)
{
    return get_user_by('id', $id); // No caching
}
```

### 20.3 Avoid Premature Optimization
```php
// ✅ Correct - Simple and readable
public function getPosts()
{
    return get_posts([
        'post_type' => 'post',
        'posts_per_page' => 10,
    ]);
}

// ❌ Incorrect - Over-optimized without need
public function getPosts()
{
    global $wpdb;
    $cacheKey = 'posts_' . md5(serialize($args));
    $cached = wp_cache_get($cacheKey);
    if ($cached) {
        return $cached;
    }
    // Complex caching logic...
}
```

### 20.4 Clean Code Practices
```php
// ✅ Correct - Descriptive names
public function registerThemeAssets()
{
    wp_enqueue_style('theme-style', get_stylesheet_uri());
    wp_enqueue_script('theme-script', get_template_directory_uri() . '/assets/theme.js');
}

// ❌ Incorrect - Unclear names
public function registerAssets()
{
    wp_enqueue_style('s', get_stylesheet_uri());
    wp_enqueue_script('js', get_template_directory_uri() . '/assets/theme.js');
}
```

## 21. Security Best Practices

### 21.1 Nonce Verification
```php
// ✅ Correct
public function handleAjaxRequest()
{
    if (!wp_verify_nonce($_POST['nonce'], 'jankx_ajax_action')) {
        wp_die('Security check failed');
    }

    // Process request
}

// ❌ Incorrect
public function handleAjaxRequest()
{
    // Process request without nonce verification
}
```

### 21.2 Capability Checks
```php
// ✅ Correct
public function saveThemeOptions()
{
    if (!current_user_can('manage_options')) {
        wp_die('Insufficient permissions');
    }

    // Save options
}

// ❌ Incorrect
public function saveThemeOptions()
{
    // Save options without permission check
}
```

### 21.3 Cache Security
```php
// ✅ Correct
$cacheKey = 'jankx_config_' . $type . '_' . $checksum;
wp_cache_set($cacheKey, $data, 'jankx_config', 3600);

// ❌ Incorrect
$cacheKey = 'config_' . $type; // No prefix, no checksum
wp_cache_set($cacheKey, $data, '', 3600); // No group
```

## 22. Environment Helper

### 22.0 Refactoring Existing Code
```php
// Before - Manual prefix with error_log
error_log('[JANKX DEBUG] Loading configuration...');
error_log('[JANKX DEBUG] Config data: ' . print_r($config, true));

// After - Using Log Facade
use Jankx\Facades\Log;

Log::debug('Loading configuration...');
Log::debug('Config data: ' . print_r($config, true));

// Before - Repeating debug checks
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[JANKX DEBUG] Loading configuration...');
}

// After - Using Environment Helper with Log Facade
use Jankx\Helper\Environment;
use Jankx\Facades\Log;

if (Environment::isDebugLog()) {
    Log::debug('Loading configuration...');
}
```

**Benefits of using Log Facade and Environment Helper:**
- ✅ **DRY Principle**: No repeated `defined('WP_DEBUG') && WP_DEBUG`
- ✅ **No Manual Prefix**: Log Facade automatically adds `[JANKX DEBUG]` prefix
- ✅ **Consistent Format**: All debug messages use standardized format
- ✅ **Centralized Logic**: Environment detection and logging logic in one place
- ✅ **Easier Maintenance**: Change debug logic in one place
- ✅ **Better Testing**: Can mock Log Facade and Environment helper in tests
- ✅ **Type Safety**: Log Facade provides better type checking

### 22.1 Debug Logging
```php
// ✅ Correct - Using Log Facade
use Jankx\Facades\Log;

Log::debug('Loading configuration...');
Log::debug('Config data: ' . print_r($config, true));
Log::debug('Error occurred: ' . $error->getMessage());

// ✅ Correct - Using Environment helper with Log Facade
use Jankx\Helper\Environment;
use Jankx\Facades\Log;

if (Environment::isDebugLog()) {
    Log::debug('Loading configuration...');
    Log::debug('Config data: ' . print_r($config, true));
}

// ❌ Incorrect - Manual prefix with error_log
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[JANKX DEBUG] Loading configuration...');
    error_log('[JANKX DEBUG] Config data: ' . print_r($config, true));
    error_log('[JANKX DEBUG] Error occurred: ' . $error->getMessage());
}

// ❌ Incorrect - Repeating debug checks
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[JANKX DEBUG] Loading configuration...');
}

if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[JANKX DEBUG] Config data: ' . print_r($config, true));
}
```

### 22.2 Environment Detection
```php
// ✅ Correct - Using Environment helper
use Jankx\Helper\Environment;

if (Environment::isWpCli()) {
    // WP CLI specific logic
}

if (Environment::isWpCron()) {
    // WP Cron specific logic
}

if (Environment::isAdmin()) {
    // Admin specific logic
}

// ❌ Incorrect - Repeating environment checks
if (defined('WP_CLI') && WP_CLI) {
    // WP CLI specific logic
}

if (defined('DOING_CRON') && DOING_CRON) {
    // WP Cron specific logic
}

if (is_admin()) {
    // Admin specific logic
}
```

### 22.3 Consistent Debug Format
```php
// ✅ Correct - Using Log Facade for consistent format
use Jankx\Facades\Log;

Log::debug($message);
Log::debug('Data: ' . print_r($data, true));
Log::debug('Error: ' . $error->getMessage());

// ✅ Correct - Using Environment helper with Log Facade
use Jankx\Helper\Environment;
use Jankx\Facades\Log;

if (Environment::isDebugLog()) {
    Log::debug($message);
    Log::debug('Data: ' . print_r($data, true));
    Log::debug('Error: ' . $error->getMessage());
}

// ❌ Incorrect - Manual prefix with error_log
error_log('[JANKX DEBUG] ' . $message);
error_log('[JANKX DEBUG] Data: ' . print_r($data, true));
error_log('[JANKX DEBUG] Error: ' . $error->getMessage());

// ❌ Incorrect - Inconsistent debug format
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('Debug: ' . $message);
    var_dump($data);
    echo $error->getMessage();
}
```

## 23. File Organization

### 23.1 Directory Structure
```
includes/
├── Jankx/
│   ├── Config/
│   ├── Contracts/
│   ├── Facades/
│   ├── Foundation/
│   ├── Helper/
│   ├── Http/
│   ├── Managers/
│   ├── Models/
│   ├── Services/
│   └── Support/
├── boot/
│   └── app.php
└── framework.php
```

### 23.2 File Naming
```php
// ✅ Correct
ThemeManager.php
AssetManager.php
MenuManager.php
SidebarManager.php
FooterManager.php
UserService.php
CacheService.php

// ❌ Incorrect
theme_manager.php
asset_manager.php
menu_manager.php
```

## 24. Version Control

### 24.1 Commit Messages
```bash
# ✅ Correct
feat: add config cache system with CRC32
feat: implement error suppression system
feat: add layout management with managers
feat: add user and cache services
fix: resolve nonce verification issue
docs: update coding standards documentation
test: add unit tests for cache system

# ❌ Incorrect
updated code
fixed bug
added feature
```

### 24.2 Git Ignore
```gitignore
# ✅ Correct
/vendor/
/node_modules/
.DS_Store
*.log
.env
```

## 25. Code Review Checklist

- [ ] Follows WordPress Coding Standards
- [ ] Follows PSR-12
- [ ] Uses proper hook naming (package style with forward slashes)
- [ ] Implements proper escaping and sanitization
- [ ] Uses prepared statements for database queries
- [ ] Includes proper PHPDoc comments
- [ ] Has unit tests for new functionality
- [ ] Uses Jankx Log Facade for debugging
- [ ] Uses Log Facade for debug logging (not `error_log('[JANKX DEBUG]')`)
- [ ] Uses Environment Helper for debug checks (not `defined('WP_DEBUG')`)
- [ ] No additional global variables
- [ ] Follows SOLID principles
- [ ] Implements proper error handling
- [ ] Uses WordPress functions when appropriate
- [ ] Follows security best practices
- [ ] Implements configuration caching with CRC32
- [ ] Uses error suppression system properly
- [ ] Implements layout management with managers
- [ ] Uses system services (User, Cache) with proper caching
- [ ] Follows cache security practices (prefixes, groups)