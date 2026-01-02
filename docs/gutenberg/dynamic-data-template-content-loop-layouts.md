# Dynamic Data Template - Content Loop Layouts

## Tổng quan

Content Loop Layouts là hệ thống cho phép tùy chỉnh cách hiển thị từng item trong loop của `jankx/dynamic-data-layout` block. Layouts được đăng ký qua PHP và chỉ thêm CSS classes vào loop items, không can thiệp vào nội dung bên trong.

## Kiến trúc

### 1. Content Loop Layout Manager

**Location**: `includes/framework/Layouts/DynamicDataLayout/ContentLoopLayoutManager.php`

Manager này quản lý việc đăng ký và lấy thông tin về các content loop layouts:

```php
$manager = ContentLoopLayoutManager::getInstance();

// Đăng ký layout
$manager->registerLayout(
    'layout-name',
    LayoutClass::class,
    'common' // hoặc ['post', 'product']
);

// Lấy layouts cho post type
$layouts = $manager->getLayoutsForPostType('post');
```

### 2. Layout Class Structure

Mỗi layout phải implement các methods sau:

```php
class PromotionalBannerLayout
{
    /**
     * Get layout title (hiển thị trong editor dropdown)
     */
    public function getTitle(): string
    {
        return __('Promotional Banner', 'vietkara');
    }

    /**
     * Get supported display options (metadata only)
     * Không ảnh hưởng đến rendering, chỉ là metadata
     */
    public function getSupportedOptions(): array
    {
        return [
            'showFeaturedImage',
            'showTitle',
            'thumbnailPosition',
            'imageRatio',
        ];
    }
}
```

### 3. CSS Class Application

Khi chọn layout trong `jankx/dynamic-data-template` block, class `content-loop-layout--{layoutName}` được tự động thêm vào mỗi loop item.

**Location**: `includes/framework/Layouts/PostLayout/Generators/Concerns/PostTemplateRendererTrait.php`

```php
protected function buildItemClasses(WP_Post $post): string
{
    $classes = get_post_class([], $post);
    array_unshift($classes, 'wp-block-post');

    // Add content loop layout class from template block attributes
    $templateAttrs = $this->templateBlock['attrs'] ?? [];
    if (!empty($templateAttrs['contentLoopLayout'])) {
        $classes[] = 'content-loop-layout--' . sanitize_html_class($templateAttrs['contentLoopLayout']);
    }

    return implode(' ', $classes);
}
```

**Output HTML**:

```html
<li class="wp-block-post post post-123 content-loop-layout--promotional-banner">
    <!-- Inner blocks content -->
</li>
```

## Đăng ký Layout

### Bước 1: Tạo Layout Class

Tạo file layout class trong theme hoặc plugin:

```php
// src/Layouts/PromotionalBannerLayout.php
<?php

namespace App\Layouts;

class PromotionalBannerLayout
{
    public function getTitle(): string
    {
        return __('Promotional Banner', 'vietkara');
    }

    public function getSupportedOptions(): array
    {
        return [
            'showFeaturedImage',
            'showTitle',
            'thumbnailPosition',
            'imageRatio',
        ];
    }
}
```

### Bước 2: Đăng ký Layout

Đăng ký layout trong Service Provider hoặc `functions.php`:

```php
// Trong Service Provider boot() method
add_action('jankx/dynamic-data-template/register-content-loop-layouts', function ($manager) {
    $manager->registerLayout(
        'promotional-banner', // Layout name (slug)
        \App\Layouts\PromotionalBannerLayout::class, // Layout class
        'common' // Post types: 'common' (all), hoặc array ['post', 'product']
    );
});
```

### Bước 3: Style với CSS

Style layout bằng CSS targeting class `content-loop-layout--{layoutName}`:

```css
/* Style cho promotional banner layout */
.content-loop-layout--promotional-banner {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.content-loop-layout--promotional-banner .wp-block-post-featured-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.content-loop-layout--promotional-banner .wp-block-post-featured-image img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.content-loop-layout--promotional-banner .wp-block-post-title {
    position: relative;
    z-index: 2;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.content-loop-layout--promotional-banner .wp-block-post-excerpt {
    position: relative;
    z-index: 2;
    color: #ffffff;
}
```

## Nguyên tắc Quan trọng

### ✅ DO (Làm)

1. **Layout chỉ thêm CSS classes**
   - Layout không can thiệp vào nội dung bên trong
   - Nội dung được handle hoàn toàn qua editor (inner blocks)

2. **Sử dụng CSS để style**
   - Style layout bằng CSS targeting class `content-loop-layout--{layoutName}`
   - Có thể kết hợp với các classes khác như `thumbnail-position-{value}`, `image-ratio-{value}`

3. **Đăng ký cho specific post types**
   - Có thể đăng ký layout cho specific post types: `['post', 'product']`
   - Hoặc 'common' để available cho tất cả post types

### ❌ DON'T (Không Làm)

1. **Không can thiệp vào nội dung**
   - Layout class không nên modify inner blocks content
   - Nội dung được handle hoàn toàn qua editor

2. **Không hard-code trong JavaScript**
   - Layouts được đăng ký qua PHP, không hard-code trong JavaScript
   - JavaScript chỉ đọc layouts từ PHP qua `wp_localize_script()`

3. **Không tạo default blocks trong layout**
   - Layout chỉ là metadata và CSS classes
   - Default blocks được handle bởi `DynamicDataTemplateBlock::getDefaultInnerBlocksForPostType()`

## Ví dụ Hoàn Chỉnh

### 1. Tạo Layout Class

```php
// wp-content/themes/vietkara/src/Layouts/PromotionalBannerLayout.php
<?php

namespace App\Layouts;

class PromotionalBannerLayout
{
    public function getTitle(): string
    {
        return __('Promotional Banner', 'vietkara');
    }

    public function getSupportedOptions(): array
    {
        return [
            'showFeaturedImage',
            'showTitle',
            'thumbnailPosition',
            'imageRatio',
        ];
    }
}
```

### 2. Đăng ký trong Service Provider

```php
// wp-content/themes/vietkara/src/Providers/VietkaraServiceProvider.php
public function boot(Application $app)
{
    // Register dynamic data template content loop layouts
    add_action('jankx/dynamic-data-template/register-content-loop-layouts', function ($manager) {
        $manager->registerLayout(
            'promotional-banner',
            \App\Layouts\PromotionalBannerLayout::class,
            'common' // Available for all post types
        );
    });
}
```

### 3. Style với CSS

```css
/* wp-content/themes/vietkara/assets/css/promotional-banner.css */
.content-loop-layout--promotional-banner {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-loop-layout--promotional-banner .wp-block-post-featured-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.content-loop-layout--promotional-banner .wp-block-post-featured-image::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
    z-index: 1;
}

.content-loop-layout--promotional-banner .wp-block-post-title {
    position: relative;
    z-index: 2;
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.content-loop-layout--promotional-banner .wp-block-post-excerpt {
    position: relative;
    z-index: 2;
    color: #ffffff;
    text-align: center;
    margin-top: 1rem;
}
```

### 4. Sử dụng trong Editor

1. Thêm `jankx/dynamic-data-layout` block
2. Thêm `jankx/dynamic-data-template` block bên trong
3. Chọn "Content Loop Layout" = "Promotional Banner"
4. Thêm inner blocks (featured image, title, excerpt, etc.)
5. Layout class sẽ tự động được thêm vào mỗi loop item

## API Reference

### ContentLoopLayoutManager

**Location**: `includes/framework/Layouts/DynamicDataLayout/ContentLoopLayoutManager.php`

**Methods**:

- `registerLayout(string $layoutName, ?string $layoutClass = null, $postTypes = 'common'): void`
  - Đăng ký một layout
  - `$layoutName`: Layout slug (ví dụ: 'promotional-banner')
  - `$layoutClass`: Layout class name (null cho built-in layouts)
  - `$postTypes`: 'common' hoặc array ['post', 'product']

- `getLayoutsForPostType(string $postType): array`
  - Lấy tất cả layouts available cho post type
  - Trả về array với structure:
    ```php
    [
        'name' => 'promotional-banner',
        'title' => 'Promotional Banner',
        'class' => 'App\Layouts\PromotionalBannerLayout',
        'postType' => 'common',
        'supportedOptions' => [...]
    ]
    ```

- `hasLayout(string $layoutName, string $postType): bool`
  - Kiểm tra layout có tồn tại cho post type không

### Hooks & Filters

**Action**: `jankx/dynamic-data-template/register-content-loop-layouts`
- Được gọi khi ContentLoopLayoutManager khởi tạo
- Parameters: `$manager` (ContentLoopLayoutManager instance)

**Filter**: `jankx/dynamic-data-template/content-loop-layouts-for-post-type`
- Filter layouts cho specific post type
- Parameters: `$layouts` (array), `$postType` (string)

## Best Practices

1. **Naming Convention**: Sử dụng kebab-case cho layout names (ví dụ: 'promotional-banner')
2. **CSS Classes**: Luôn prefix với `content-loop-layout--` trong CSS selectors
3. **Post Type Specific**: Đăng ký layouts cho specific post types khi cần
4. **Documentation**: Document supported options trong layout class
5. **Testing**: Test layout trên cả editor và frontend

## Troubleshooting

### Layout không xuất hiện trong dropdown

- Kiểm tra layout đã được đăng ký chưa
- Kiểm tra post type có match không
- Kiểm tra layout class có implement `getTitle()` method không

### CSS không apply

- Kiểm tra class `content-loop-layout--{layoutName}` có được thêm vào HTML không
- Kiểm tra CSS selector có đúng không
- Kiểm tra CSS specificity

### Layout class không được thêm

- Kiểm tra `contentLoopLayout` attribute có được set trong block không
- Kiểm tra `PostTemplateRendererTrait::buildItemClasses()` có được gọi không
- Kiểm tra `templateBlock['attrs']['contentLoopLayout']` có giá trị không

