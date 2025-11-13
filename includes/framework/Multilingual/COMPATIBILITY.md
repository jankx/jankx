# Multilingual System - Compatibility & Behavior

## Overview

Hệ thống Multilingual của Jankx được thiết kế **hoàn toàn optional** và **backward compatible**.

## Behavior Matrix

### Scenario 1: NO Multilingual Plugin Installed

| Component | Behavior |
|-----------|----------|
| `MultilingualFactory::getAdapter()` | Returns `null` |
| `MultilingualFactory::hasActivePlugin()` | Returns `false` |
| `MultilingualFactory::getCurrentLanguage()` | Returns `null` |
| `MultilingualFactory::setCurrentLanguage('vi')` | Returns `false`, does nothing |
| `MultilingualFactory::filterQuery($query, 'vi')` | Returns `$query` unchanged |
| `MultilingualFactory::addLanguageToQueryArgs($args, 'vi')` | Returns `$args` unchanged |
| **Post Type Layout Block** | ✅ Works normally, shows ALL posts |
| **Load More AJAX** | ✅ Works normally, loads more posts |

### Scenario 2: Polylang Plugin Active

| Component | Behavior |
|-----------|----------|
| `MultilingualFactory::getAdapter()` | Returns `PolylangAdapter` instance |
| `MultilingualFactory::hasActivePlugin()` | Returns `true` |
| `MultilingualFactory::getCurrentLanguage()` | Returns current language code (e.g., 'vi', 'en') |
| `MultilingualFactory::setCurrentLanguage('vi')` | Returns `true`, switches to Vietnamese |
| `MultilingualFactory::filterQuery($query, 'vi')` | Adds language filter to query |
| `MultilingualFactory::addLanguageToQueryArgs($args, 'vi')` | Adds tax_query for language |
| **Post Type Layout Block** | ✅ Shows posts in current language only |
| **Load More AJAX** | ✅ Loads posts in current language only |

### Scenario 3: WPML Plugin Active

| Component | Behavior |
|-----------|----------|
| `MultilingualFactory::getAdapter()` | Returns `WPMLAdapter` instance |
| `MultilingualFactory::hasActivePlugin()` | Returns `true` |
| `MultilingualFactory::getCurrentLanguage()` | Returns `ICL_LANGUAGE_CODE` |
| `MultilingualFactory::setCurrentLanguage('vi')` | Returns `true`, calls `$sitepress->switch_lang()` |
| `MultilingualFactory::filterQuery($query, 'vi')` | Switches language context |
| `MultilingualFactory::addLanguageToQueryArgs($args, 'vi')` | Sets `suppress_filters = false` |
| **Post Type Layout Block** | ✅ Shows posts in current language only |
| **Load More AJAX** | ✅ Loads posts in current language only |

## Code Flow

### Without Multilingual Plugin

```php
// 1. Render block
$current_language = MultilingualFactory::getCurrentLanguage(); // null
if ($current_language) {  // FALSE - skip
    $attributes['_current_language'] = $current_language;
}

// 2. Query posts
$query = new WP_Query(['post_type' => 'post']); // All posts

// 3. AJAX Load More
// No _current_language in attributes
// setLanguageContext() returns early
```

### With Polylang Active

```php
// 1. Render block
$current_language = MultilingualFactory::getCurrentLanguage(); // 'vi'
if ($current_language) {  // TRUE
    $attributes['_current_language'] = 'vi'; // Set language
}

// 2. Query posts
// Polylang automatically filters by language
$query = new WP_Query(['post_type' => 'post']); // Vietnamese posts only

// 3. AJAX Load More
// _current_language = 'vi' in attributes
MultilingualFactory::setCurrentLanguage('vi'); // Switch context
// Query filtered by language
```

## Validation Checklist

### ✅ Required Tests

- [ ] Block renders without any multilingual plugin
- [ ] Block renders with Polylang active
- [ ] Block renders with WPML active
- [ ] Load More works without multilingual plugin
- [ ] Load More respects language with Polylang
- [ ] Load More respects language with WPML
- [ ] No PHP errors when plugin is deactivated
- [ ] No JavaScript errors in console
- [ ] Query returns correct posts count
- [ ] Pagination works in all scenarios

### ✅ Edge Cases Handled

- [x] No multilingual plugin installed
- [x] Plugin deactivated after content created
- [x] Invalid language code passed
- [x] Language not available
- [x] Switching between plugins
- [x] Custom adapter registration
- [x] Multiple queries on same page
- [x] AJAX requests from different languages

## Fail-Safe Mechanisms

### 1. Null Checks

All Factory methods check for null adapter:

```php
public static function getCurrentLanguage(): ?string
{
    $adapter = self::getAdapter();
    return $adapter ? $adapter->getCurrentLanguage() : null; // Safe
}
```

### 2. Early Returns

Block methods exit early if no language:

```php
protected function setLanguageContext(array $attributes): void
{
    if (empty($attributes['_current_language'])) {
        return; // Exit early, no processing
    }
    // ... language logic
}
```

### 3. Default Values

All methods return safe defaults:

- `getCurrentLanguage()` → `null`
- `getLanguages()` → `[]`
- `setCurrentLanguage()` → `false`
- `filterQuery()` → original `$query`
- `addLanguageToQueryArgs()` → original `$args`

## Performance Impact

### Without Plugin
- ✅ Zero overhead
- ✅ No extra queries
- ✅ No filters added
- ✅ Same performance as before

### With Plugin
- ℹ️ Minimal overhead (1-2 adapter checks per request)
- ℹ️ Uses plugin's native filtering (no extra queries)
- ℹ️ Cached adapter instance

## Migration Path

### From Old Code
```php
// Old (Polylang-specific)
if (function_exists('pll_current_language')) {
    $lang = pll_current_language();
}
```

### To New Code
```php
// New (Plugin-agnostic)
$lang = MultilingualFactory::getCurrentLanguage();
// Works with Polylang, WPML, or without any plugin
```

## Troubleshooting

### Issue: Posts not filtered by language

**Check:**
1. Is multilingual plugin active?
   ```php
   var_dump(MultilingualFactory::hasActivePlugin()); // Should be true
   ```

2. Is current language detected?
   ```php
   var_dump(MultilingualFactory::getCurrentLanguage()); // Should return language code
   ```

3. Is adapter loaded?
   ```php
   $adapter = MultilingualFactory::getAdapter();
   var_dump($adapter ? $adapter->getPluginName() : 'No plugin');
   ```

### Issue: Block not working after plugin deactivation

**Expected:** Block should work normally, showing all posts.

**If not working:**
1. Clear cache: `wp cache flush`
2. Rebuild blocks: `npm run build`
3. Check for PHP errors in debug log

### Issue: AJAX Load More returns empty

**Check:**
1. Verify `_current_language` in AJAX request
2. Check if language exists in plugin
3. Verify posts exist in that language

## Conclusion

Hệ thống được thiết kế với philosophy:

> **"Works everywhere, enhances when possible"**

- ✅ Không bắt buộc multilingual plugin
- ✅ Không break existing functionality
- ✅ Graceful degradation
- ✅ Progressive enhancement
- ✅ Zero configuration required

