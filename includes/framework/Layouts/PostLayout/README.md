# Post Layout System Architecture

Hệ thống quản lý post layouts với architecture patterns có tổ chức.

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Gutenberg Block Editor                     │
│                  (post-type-layout block)                    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostTypeLayoutBlock.php                         │
│              (Gutenberg Block Class)                         │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostLayoutManager                               │
│              (Singleton, Registered in Container)            │
│                                                              │
│  Methods:                                                    │
│  - registerLayout()                                          │
│  - getLayouts()                                              │
│  - render()                                                  │
│  - renderPreview()                                           │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostLayoutFactory                               │
│              (Factory Pattern)                               │
│                                                              │
│  - create(layoutName): PostLayoutInterface                   │
│  - register(name, class)                                     │
│  - hasLayout(name): bool                                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostLayoutDecorator                             │
│              (Decorator Pattern)                             │
│                                                              │
│  - withAttributes(attributes)                                │
│  - withQuery(query)                                          │
│  - buildQuery(attributes)                                    │
│  - render()                                                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostLayoutInterface                             │
│              (Contract)                                      │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  PostLayout      │  │  Concrete        │
│  (Abstract)      │  │  Layouts:        │
│                  │  │  - GridLayout    │
│  Base methods:   │  │  - ListLayout    │
│  - setOptions()  │  │  - MasonryLayout │
│  - setQuery()    │  │  - CardLayout    │
│  - render()      │  │                  │
│  - renderPreview()│  └──────────────────┘
└──────────────────┘
```

## 🏗️ Components

### 1. **PostLayoutInterface**
Contract định nghĩa các methods cần thiết cho mọi layout:
- `getName()`: Layout slug
- `getTitle()`: Display title
- `setOptions()`: Set block attributes
- `setQuery()`: Set WP_Query
- `render()`: Render HTML
- `renderPreview()`: Render JSON preview data cho editor
- `getSupportedOptions()`: Get available options

### 2. **PostLayout (Abstract Base Class)**
Class cơ sở implement PostLayoutInterface:
- Default options
- Common methods
- `renderPostItem()`: Render single post
- Abstract methods force implementation trong concrete classes

### 3. **Concrete Layout Classes**
Implementations cụ thể:
- **GridLayout**: Grid display với columns tùy chỉnh
- **ListLayout**: Horizontal list layout
- **MasonryLayout**: Pinterest-style masonry
- **CardLayout**: Card với shadow effects

### 4. **PostLayoutFactory**
Factory pattern để tạo layout instances:
- `register()`: Đăng ký layout class
- `create()`: Tạo layout instance
- `hasLayout()`: Check layout tồn tại
- `getRegisteredLayouts()`: Get all layouts

### 5. **PostLayoutDecorator**
Decorator pattern để set options:
- `withAttributes()`: Map block attributes → layout options
- `withQuery()`: Set WP_Query
- `buildQuery()`: Build WP_Query từ attributes
- `render()`: Delegate to layout
- `renderPreview()`: Delegate preview rendering

### 6. **PostLayoutManager**
Manager quản lý toàn bộ hệ thống:
- **Singleton pattern**
- Registered trong Application container
- Bridge giữa Gutenberg block và layouts
- Methods:
  - `registerLayout()`: Đăng ký custom layout
  - `getLayouts()`: Get layouts cho dropdown
  - `createLayout()`: Factory wrapper
  - `render()`: Render layout với query
  - `renderPreview()`: Preview data cho editor
  - `getSupportedLayoutsJson()`: JSON cho JavaScript

## 🔌 Integration

### Application Container Registration
```php
// PostLayoutServiceProvider.php
$app->singleton('post.layout.manager', function (Application $app) {
    return PostLayoutManager::getInstance();
});
```

### Block Usage
```php
// PostTypeLayoutBlock.php
$this->layoutManager = App::make('post.layout.manager');
$html = $this->layoutManager->render($layoutName, $attributes);
```

### JavaScript Integration
```typescript
// index.tsx
const layouts = window.jankxSupportedPostTypeLayouts;
```

## 🎯 Workflow

1. **User chọn layout trong editor** → Block attributes updated
2. **Block render** → PostTypeLayoutBlock::render() called
3. **Manager creates layout** → PostLayoutFactory::create()
4. **Decorator applies options** → withAttributes(), buildQuery()
5. **Layout renders** → Concrete layout class renders HTML
6. **Output returned** → Displayed on frontend

## 🚀 Extending

### Add custom layout:
```php
// Register custom layout
add_action('init', function() {
    $manager = app('post.layout.manager');
    $manager->registerLayout('custom', CustomLayout::class);
});

// Custom layout class
class CustomLayout extends PostLayout {
    protected $name = 'custom';
    protected $title = 'Custom Layout';

    public function render(): string { /* ... */ }
    public function renderPreview(): array { /* ... */ }
}
```

## 📝 Design Patterns Used

1. **Singleton**: PostLayoutManager
2. **Factory**: PostLayoutFactory
3. **Decorator**: PostLayoutDecorator
4. **Strategy**: Different layout implementations
5. **Dependency Injection**: Via Application container
6. **Interface Segregation**: PostLayoutInterface

## ✅ Benefits

- **Organized**: Clear separation of concerns
- **Extensible**: Easy to add new layouts
- **Testable**: Each component can be tested independently
- **Maintainable**: Clean architecture
- **Reusable**: Layouts can be used anywhere
- **Type-safe**: Interface contracts
