# Jankx Multilingual System

Hệ thống hỗ trợ đa ngôn ngữ cho Jankx Framework sử dụng **Strategy Pattern** để dễ dàng tích hợp với nhiều plugin đa ngôn ngữ khác nhau.

## Architecture

```
MultilingualInterface (Interface)
    ├── PolylangAdapter (Polylang)
    ├── WPMLAdapter (WPML)
    └── CustomAdapter (Extensible)
           ↑
    MultilingualFactory (Factory)
```

## Supported Plugins

- ✅ **Polylang** - Full support
- ✅ **WPML** - Full support
- 🔧 **Extensible** - Có thể thêm adapter tùy chỉnh

## Usage

### 1. Basic Usage - Auto Detection

Factory tự động detect plugin đang active và trả về adapter phù hợp:

```php
use Jankx\Multilingual\MultilingualFactory;

// Get current language
$current_lang = MultilingualFactory::getCurrentLanguage(); // 'en', 'vi', etc.

// Get all languages
$languages = MultilingualFactory::getLanguages();

// Get default language
$default_lang = MultilingualFactory::getDefaultLanguage();

// Check if multilingual plugin is active
if (MultilingualFactory::hasActivePlugin()) {
    // Do something
}
```

### 2. Set Language Context

```php
// Switch to specific language
MultilingualFactory::setCurrentLanguage('vi');

// All queries after this will filter by Vietnamese posts
$posts = new WP_Query(['post_type' => 'post']);
```

### 3. Filter WP_Query by Language

```php
// Method 1: Add to query args
$args = [
    'post_type' => 'post',
    'posts_per_page' => 10,
];
$args = MultilingualFactory::addLanguageToQueryArgs($args, 'vi');
$query = new WP_Query($args);

// Method 2: Filter existing query
$query = new WP_Query(['post_type' => 'post']);
MultilingualFactory::filterQuery($query, 'vi');
```

### 4. Get Translations

```php
// Get translated post ID
$vi_post_id = MultilingualFactory::getTranslatedPostId($en_post_id, 'vi');

// Get post's language
$post_lang = MultilingualFactory::getPostLanguage($post_id);
```

### 5. Direct Adapter Access

```php
// Get the active adapter instance
$adapter = MultilingualFactory::getAdapter();

if ($adapter) {
    $plugin_name = $adapter->getPluginName(); // 'Polylang' or 'WPML'
    
    // Use adapter methods directly
    $adapter->setCurrentLanguage('en');
}
```

## Creating Custom Adapter

Bạn có thể tạo adapter cho plugin đa ngôn ngữ khác:

### Step 1: Implement Interface

```php
<?php

namespace MyPlugin\Multilingual;

use Jankx\Multilingual\MultilingualInterface;
use WP_Query;

class TranslatePressAdapter implements MultilingualInterface
{
    public function isActive(): bool
    {
        return class_exists('TRP_Translate_Press');
    }

    public function getCurrentLanguage(): ?string
    {
        global $TRP_LANGUAGE;
        return $TRP_LANGUAGE ?? null;
    }

    // Implement other interface methods...
    
    public function getPluginName(): string
    {
        return 'TranslatePress';
    }
}
```

### Step 2: Register Adapter

```php
use Jankx\Multilingual\MultilingualFactory;
use MyPlugin\Multilingual\TranslatePressAdapter;

// Register custom adapter (higher priority than built-in)
MultilingualFactory::registerAdapter(TranslatePressAdapter::class);

// Now factory will auto-detect and use your adapter
$current_lang = MultilingualFactory::getCurrentLanguage();
```

## Implementation Details

### Factory Pattern

`MultilingualFactory` sử dụng:
- **Lazy Loading**: Adapter chỉ được khởi tạo khi cần
- **Caching**: Instance được cache để tránh tạo lại
- **Auto-detection**: Tự động detect plugin active
- **Priority System**: Adapter đăng ký sau có priority cao hơn

### Adapter Priority

Thứ tự ưu tiên (cao → thấp):
1. Custom adapters (registered via `registerAdapter()`)
2. PolylangAdapter
3. WPMLAdapter

### How It Works in Post Type Layout Block

```php
// 1. Render block - Inject current language
$current_language = MultilingualFactory::getCurrentLanguage();
$attributes['_current_language'] = $current_language;

// 2. AJAX Load More - Set language context
MultilingualFactory::setCurrentLanguage($attributes['_current_language']);

// 3. Filter queries automatically
MultilingualFactory::filterQuery($query, $language_code);
```

## Testing

### Unit Test Example

```php
use Jankx\Multilingual\MultilingualFactory;

class MultilingualTest extends WP_UnitTestCase
{
    public function test_factory_detects_polylang()
    {
        // Assuming Polylang is active
        $adapter = MultilingualFactory::getAdapter();
        
        $this->assertInstanceOf(PolylangAdapter::class, $adapter);
        $this->assertEquals('Polylang', $adapter->getPluginName());
    }
    
    public function test_language_filter_in_query()
    {
        $args = ['post_type' => 'post'];
        $args = MultilingualFactory::addLanguageToQueryArgs($args, 'vi');
        
        $this->assertArrayHasKey('tax_query', $args);
        // Assert tax_query contains language filter
    }
}
```

## Best Practices

### ✅ DO

```php
// Use factory for all multilingual operations
$lang = MultilingualFactory::getCurrentLanguage();

// Check if plugin is active before using
if (MultilingualFactory::hasActivePlugin()) {
    // Multilingual logic
}

// Use static methods for convenience
$args = MultilingualFactory::addLanguageToQueryArgs($args);
```

### ❌ DON'T

```php
// Don't hard-code specific plugin functions
if (function_exists('pll_current_language')) {
    $lang = pll_current_language(); // Bad!
}

// Don't access adapter properties directly
$adapter = MultilingualFactory::getAdapter();
$adapter->someInternalProperty; // Bad!

// Don't forget to check if plugin is active
$lang = MultilingualFactory::getCurrentLanguage(); // Returns null if no plugin
// Use $lang without checking // Bad!
```

## API Reference

### MultilingualInterface

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `isActive()` | - | `bool` | Check if plugin is active |
| `getCurrentLanguage()` | - | `string\|null` | Get current language code |
| `getLanguages()` | - | `array` | Get all available languages |
| `getDefaultLanguage()` | - | `string\|null` | Get default language |
| `setCurrentLanguage()` | `string $code` | `bool` | Set current language |
| `filterQuery()` | `WP_Query $query, string $lang` | `WP_Query` | Filter query by language |
| `getTranslatedPostId()` | `int $id, string $lang` | `int\|null` | Get translation ID |
| `getPostLanguage()` | `int $id` | `string\|null` | Get post's language |
| `getPluginName()` | - | `string` | Get plugin name |
| `addLanguageToQueryArgs()` | `array $args, string $lang` | `array` | Add language to query args |

### MultilingualFactory (Static Methods)

All interface methods are available as static methods through the factory.

## Hooks & Filters

### Available Filters

```php
// Allow filtering query args before adding language
add_filter('jankx/multilingual/query-args', function($args, $language_code) {
    // Modify args
    return $args;
}, 10, 2);

// Filter adapter instance before caching
add_filter('jankx/multilingual/adapter', function($adapter) {
    // Replace or modify adapter
    return $adapter;
});
```

## Examples

### Example 1: Switch Language Temporarily

```php
// Save current language
$original_lang = MultilingualFactory::getCurrentLanguage();

// Switch to English
MultilingualFactory::setCurrentLanguage('en');

// Get English posts
$en_posts = new WP_Query(['post_type' => 'post']);

// Restore original language
MultilingualFactory::setCurrentLanguage($original_lang);
```

### Example 2: Get Translations for All Languages

```php
$post_id = 123;
$languages = MultilingualFactory::getLanguages();

$translations = [];
foreach ($languages as $lang) {
    $lang_code = is_object($lang) ? $lang->slug : $lang['code'];
    $trans_id = MultilingualFactory::getTranslatedPostId($post_id, $lang_code);
    
    if ($trans_id) {
        $translations[$lang_code] = $trans_id;
    }
}
```

### Example 3: Custom Adapter for Plugin X

```php
class PluginXAdapter implements MultilingualInterface
{
    public function isActive(): bool
    {
        return defined('PLUGINX_VERSION');
    }
    
    // ... implement all interface methods
}

// Register in functions.php or plugin init
add_action('init', function() {
    MultilingualFactory::registerAdapter(PluginXAdapter::class);
});
```

## Troubleshooting

### Issue: Language not detected

**Solution**: Check if your plugin is active and adapter implements `isActive()` correctly.

```php
// Debug which adapter is being used
$adapter = MultilingualFactory::getAdapter();
if ($adapter) {
    echo 'Using: ' . $adapter->getPluginName();
} else {
    echo 'No multilingual plugin detected';
}
```

### Issue: Queries not filtered

**Solution**: Ensure `suppress_filters` is not set to `true` in your query args.

```php
$args = [
    'post_type' => 'post',
    'suppress_filters' => false, // Important!
];
```

## License

Part of Jankx Framework - Follow framework license.

