# Code Review Guidelines

> **Hướng dẫn review code theo Jankx 2.0 standards**

## 🎯 **Review Checklist**

### **✅ OOP Principles**
- [ ] Classes follow Single Responsibility Principle
- [ ] Proper dependency injection used
- [ ] No static methods for business logic
- [ ] Interfaces used for abstraction

### **✅ WordPress Integration**
- [ ] WordPress functions used directly (allowed)
- [ ] No direct database queries (forbidden)
- [ ] Proper error handling for WordPress functions
- [ ] WordPress hooks used correctly

### **✅ Code Quality**
- [ ] Type declarations on all methods
- [ ] Proper PHPDoc documentation
- [ ] Consistent naming conventions
- [ ] Error handling implemented

### **✅ Testing**
- [ ] Unit tests written
- [ ] Integration tests for WordPress functions
- [ ] Test coverage > 80%
- [ ] Mock WordPress functions in tests

## 📋 **WordPress Functions Usage**

### **✅ Allowed Direct Usage**
```php
// ✅ GOOD - Direct WordPress function calls
class PostService
{
    public function getPost(int $id): ?WP_Post
    {
        return get_post($id);
    }

    public function hasBlocks(string $content): bool
    {
        return has_blocks($content);
    }

    public function parseBlocks(string $content): array
    {
        return parse_blocks($content);
    }
}
```

### **❌ Still Forbidden**
```php
// ❌ FORBIDDEN - Direct database queries
class PostRepository
{
    public function getPosts(): array
    {
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM {$wpdb->posts}");
    }
}
```

## 🔍 **Common Issues**

### **1. Static Methods Abuse**
```php
// ❌ BAD - Static methods for business logic
class DebugInfo
{
    public static function getGutenbergBlocksInfo(): array
    {
        // Business logic in static method
    }
}

// ✅ GOOD - Instance methods with DI
class GutenbergBlocksService
{
    private $wordPressAdapter;

    public function __construct(WordPressAdapter $adapter)
    {
        $this->wordPressAdapter = $adapter;
    }

    public function getBlocksInfo(): array
    {
        // Business logic in instance method
    }
}
```

### **2. Mixed Responsibilities**
```php
// ❌ BAD - Multiple responsibilities
class UserManager
{
    public function validate() { /* validation */ }
    public function save() { /* database */ }
    public function sendEmail() { /* email */ }
    public function renderTemplate() { /* template */ }
}

// ✅ GOOD - Single responsibility
class UserValidator { /* only validation */ }
class UserRepository { /* only data access */ }
class EmailService { /* only email */ }
class TemplateRenderer { /* only rendering */ }
```

### **3. Poor Error Handling**
```php
// ❌ BAD - No error handling
class PostService
{
    public function getPost(int $id): WP_Post
    {
        return get_post($id); // Could return false
    }
}

// ✅ GOOD - Proper error handling
class PostService
{
    public function getPost(int $id): ?WP_Post
    {
        $post = get_post($id);
        return $post ?: null;
    }
}
```

## 🧪 **Testing Guidelines**

### **1. WordPress Function Testing**
```php
// ✅ GOOD - Mock WordPress functions
class GutenbergServiceTest extends TestCase
{
    public function testHasBlocks()
    {
        // Mock WordPress function
        $this->mockFunction('has_blocks', function($content) {
            return strpos($content, '<!-- wp:') !== false;
        });

        $service = new GutenbergService();
        $this->assertTrue($service->hasBlocks('<!-- wp:paragraph -->'));
    }
}
```

### **2. Integration Testing**
```php
// ✅ GOOD - Integration tests
class WordPressIntegrationTest extends TestCase
{
    public function testWordPressFunctionsWork()
    {
        // Test actual WordPress functions
        $post = get_post(1);
        $this->assertInstanceOf('WP_Post', $post);

        $hasBlocks = has_blocks('<!-- wp:paragraph -->');
        $this->assertTrue($hasBlocks);
    }
}
```

## 📝 **Documentation Standards**

### **1. WordPress Function Documentation**
```php
/**
 * Gutenberg Blocks Service
 *
 * Uses WordPress functions directly:
 * - has_blocks() - Check if content has blocks
 * - parse_blocks() - Parse content into blocks
 * - get_current_screen() - Get current admin screen
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class GutenbergBlocksService
{
    /**
     * Check if content has Gutenberg blocks
     *
     * @param string $content Post content
     * @return bool True if content has blocks
     * @since 2.0.0
     */
    public function hasBlocks(string $content): bool
    {
        return has_blocks($content);
    }
}
```

## 🚀 **Performance Considerations**

### **1. WordPress Function Performance**
```php
// ✅ GOOD - Cache expensive WordPress calls
class CachedPostService
{
    private $cache = [];

    public function getPost(int $id): ?WP_Post
    {
        if (!isset($this->cache[$id])) {
            $this->cache[$id] = get_post($id) ?: null;
        }

        return $this->cache[$id];
    }
}
```

### **2. Batch Operations**
```php
// ✅ GOOD - Batch WordPress operations
class BatchPostService
{
    public function getMultiplePosts(array $ids): array
    {
        // Use get_posts with multiple IDs instead of multiple get_post calls
        return get_posts([
            'post__in' => $ids,
            'post_type' => 'post',
            'posts_per_page' => -1
        ]);
    }
}
```

---

**WordPress Functions Are Allowed** - Jankx 2.0 encourages direct usage of WordPress functions while maintaining OOP principles! 🎯