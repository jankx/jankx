# Jankx Framework Coding Rules

## Tổng quan

Jankx Framework tuân thủ WordPress Coding Standards kết hợp với PSR-12 để đảm bảo code dễ maintain và mở rộng.

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

## 9. Helper Functions

### 9.1 Static Classes
```php
// ✅ Correct
class ThemeHelper
{
    public static function getThemeOption($key, $default = null)
{
    return get_option("theme_{$key}", $default);
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

### 9.2 PSR-4 Autoloading
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

## 10. Debugging

### 10.1 Jankx Log Facade
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

### 10.2 Debug Conditions
```php
// ✅ Correct
if (Environment::isDebugLog()) {
    Log::debug('Debug information', $data);
}

// ❌ Incorrect
Log::debug('Debug information', $data); // Always logs
```

## 11. Global Variables

### 11.1 No Additional Globals
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

### 11.2 WordPress Globals Only
```php
// ✅ Correct - WordPress globals
global $wpdb;
global $post;
global $wp_query;

// ❌ Incorrect - Custom globals
global $jankx_theme_options;
global $custom_global_variable;
```

## 12. WordPress Functions

### 12.1 Direct Usage When Needed
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

### 12.2 WordPress Hooks
```php
// ✅ Correct
add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
add_filter('the_content', [$this, 'modifyContent']);
add_action('after_setup_theme', [$this, 'setupTheme']);

// ❌ Incorrect - Custom event system
$this->event_dispatcher->dispatch('assets.enqueue', $assets);
```

## 13. Programming Principles

### 13.1 SOLID Principles

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

### 13.2 DRY (Don't Repeat Yourself)
```php
// ✅ Correct
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

// ❌ Incorrect
$cssUrl = get_template_directory_uri() . '/assets/style.css';
$jsUrl = get_template_directory_uri() . '/assets/script.js';
```

### 13.3 KISS (Keep It Simple, Stupid)
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

### 13.4 YAGNI (You Aren't Gonna Need It)
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

### 13.5 Separation of Concerns (SoC)
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

// ❌ Incorrect
class ThemeManager
{
    public function doEverything()
{
    // Assets, menus, options, everything mixed together
}
}
```

### 13.6 Law of Demeter
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

### 13.7 Encapsulation
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

## 14. Unit Testing

### 14.1 Test Structure
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

### 14.2 Test Coverage
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

## 15. Code Documentation

### 15.1 PHPDoc Standards
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

### 15.2 Inline Comments
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

## 16. Performance Considerations

### 16.1 Avoid Premature Optimization
```php
// ✅ Correct - Simple and readable
public function get_posts()
{
    return get_posts([
        'post_type' => 'post',
        'posts_per_page' => 10,
    ]);
}

// ❌ Incorrect - Over-optimized without need
public function get_posts()
{
    global $wpdb;
    $cache_key = 'posts_' . md5(serialize($args));
    $cached = wp_cache_get($cache_key);
    if ($cached) {
        return $cached;
    }
    // Complex caching logic...
}
```

### 16.2 Clean Code Practices
```php
// ✅ Correct - Descriptive names
public function registerThemeAssets()
{
    wp_enqueue_style('theme-style', get_stylesheet_uri());
    wp_enqueue_script('theme-script', get_template_directory_uri() . '/assets/theme.js');
}

// ❌ Incorrect - Unclear names
public function regAssets()
{
    wp_enqueue_style('s', get_stylesheet_uri());
    wp_enqueue_script('js', get_template_directory_uri() . '/assets/theme.js');
}
```

## 17. Security Best Practices

### 17.1 Nonce Verification
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

### 17.2 Capability Checks
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

## 18. File Organization

### 18.1 Directory Structure
```
includes/
├── Jankx/
│   ├── Config/
│   ├── Contracts/
│   ├── Facades/
│   ├── Foundation/
│   ├── Helper/
│   ├── Http/
│   └── Support/
├── boot/
│   └── app.php
└── framework.php
```

### 18.2 File Naming
```php
// ✅ Correct
ThemeManager.php
AssetManager.php
MenuManager.php

// ❌ Incorrect
theme_manager.php
asset_manager.php
menu_manager.php
```

## 19. Version Control

### 19.1 Commit Messages
```bash
# ✅ Correct
feat: add theme assets manager
fix: resolve nonce verification issue
docs: update coding standards documentation
test: add unit tests for theme helper

# ❌ Incorrect
updated code
fixed bug
added feature
```

### 19.2 Git Ignore
```gitignore
# ✅ Correct
/vendor/
/node_modules/
.DS_Store
*.log
.env
```

## 20. Code Review Checklist

- [ ] Follows WordPress Coding Standards
- [ ] Follows PSR-12
- [ ] Uses proper hook naming (package style with forward slashes)
- [ ] Implements proper escaping and sanitization
- [ ] Uses prepared statements for database queries
- [ ] Includes proper PHPDoc comments
- [ ] Has unit tests for new functionality
- [ ] Uses Jankx Log Facade for debugging
- [ ] No additional global variables
- [ ] Follows SOLID principles
- [ ] Implements proper error handling
- [ ] Uses WordPress functions when appropriate
- [ ] Follows security best practices