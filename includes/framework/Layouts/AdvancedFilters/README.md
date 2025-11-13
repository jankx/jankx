# Advanced Filters Layout System

Hệ thống render Advanced Filters với architecture patterns có tổ chức, áp dụng SOLID principles và Design Patterns.

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   Gutenberg Block Editor                        │
│                  (advanced-filters block)                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              AdvancedFiltersBlock                               │
│              (Gutenberg Block Class)                           │
│                                                               │
│  Responsibilities:                                             │
│  - Block registration                                          │
│  - Asset enqueuing                                            │
│  - Delegates rendering to AdvancedFiltersRenderer             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              AdvancedFiltersRenderer                            │
│              (Coordinator/Manager)                              │
│                                                               │
│  - Renders complete filter UI                                 │
│  - Uses FilterRendererFactory to get appropriate renderer     │
│  - Manages filter groupings and layout                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              FilterRendererFactory                              │
│              (Factory Pattern)                                  │
│                                                               │
│  - create(filterType): FilterRendererInterface                │
│  - register(type, class)                                      │
│  - hasRenderer(type): bool                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              FilterRendererInterface                            │
│              (Contract)                                        │
│                                                               │
│  Methods:                                                      │
│  - getFilterType(): string                                    │
│  - canHandle(filter): bool                                    │
│  - render(filter, globalSettings): void                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
┌──────────────────┐  ┌─────────────────────────────┐
│  BaseFilterRenderer     │  │  Concrete Renderers:    │
│  (Abstract)      │  │  - TaxonomyFilterRenderer  │
│                  │  │  - MetaFilterRenderer      │
│  Shared methods: │  │  - PriceFilterRenderer     │
│  - getSetting()  │  │  - DateFilterRenderer      │
│  - buildClasses()│  │  - AuthorFilterRenderer    │
│  - renderLabel() │  │  - KeywordFilterRenderer   │
└──────────────────┘  └─────────────────────────────┘
```

## 🏗️ Components

### 1. **FilterRendererInterface**
Contract định nghĩa interface cho tất cả filter renderers:
- `getFilterType()`: Returns the filter type this renderer handles
- `canHandle(filter)`: Checks if renderer can handle this filter
- `render(filter, globalSettings)`: Renders the filter HTML

### 2. **BaseFilterRenderer**
Abstract base class providing common functionality:
- `getSetting()`: Get setting with fallback to global
- `buildGroupClasses()`: Build filter group CSS classes
- `renderCollapsibleHeader()`: Render collapsible header
- `renderLabel()`: Render label

### 3. **Concrete Filter Renderers**
Strategy Pattern implementations:

#### **TaxonomyFilterRenderer**
Renders taxonomy-based filters (categories, tags, custom taxonomies):
- Dropdown and checkbox/radio modes
- Hierarchical term rendering
- Custom listing types (ul, ol, none)
- Collapsible support

#### **MetaFilterRenderer** (to be implemented)
Renders meta field filters:
- Text, number, date inputs
- Range inputs (min/max)
- Date range inputs

#### **PriceFilterRenderer** (to be implemented)
Renders price filters:
- Min/max price inputs
- Currency display

#### **DateFilterRenderer** (to be implemented)
Renders date filters:
- Single date input
- Date range input
- Custom date fields

#### **AuthorFilterRenderer** (to be implemented)
Renders author filters:
- Author dropdown
- Author checkboxes

#### **KeywordFilterRenderer** (to be implemented)
Renders keyword search filter:
- Search input
- Optional search button

### 4. **AdvancedFiltersRenderer**
Coordinator class that orchestrates rendering:
- Renders complete filter UI
- Uses factory to get appropriate renderer for each filter
- Manages filter groupings and layout
- Handles reset button

### 5. **FilterRendererFactory**
Factory pattern to create filter renderers:
- `register()`: Register a renderer class
- `create()`: Create renderer instance
- `hasRenderer()`: Check if renderer exists
- `getRegisteredRenderers()`: Get all renderers

## 🔌 Integration

### Block Usage
```php
// AdvancedFiltersBlock.php
$renderer = new AdvancedFiltersRenderer();
$output = $renderer->render($attributes, $config);
```

### Register Custom Renderer
```php
// Register custom filter renderer
add_action('init', function() {
    $factory = FilterRendererFactory::getInstance();
    $factory->register('custom', CustomFilterRenderer::class);
});

// Custom renderer class
class CustomFilterRenderer extends BaseFilterRenderer {
    public function getFilterType(): string {
        return 'custom';
    }

    public function canHandle(array $filter): bool {
        return ($filter['filterType'] ?? '') === 'custom';
    }

    public function render(array $filter, array $global_settings): void {
        // Custom rendering logic
    }
}
```

## 📝 Design Patterns Used

1. **Strategy Pattern**: Different filter renderer implementations
2. **Factory Pattern**: FilterRendererFactory
3. **Single Responsibility Principle**: Each renderer handles one filter type
4. **Open/Closed Principle**: Easy to add new renderers without modifying existing
5. **Dependency Inversion**: Depend on FilterRendererInterface, not concrete classes
6. **Template Method**: BaseFilterRenderer provides template for common operations

## ✅ Benefits

- **Organized**: Clear separation of concerns
- **Extensible**: Easy to add new filter types
- **Testable**: Each renderer can be tested independently
- **Maintainable**: Clean architecture
- **Reusable**: Renderers can be used anywhere
- **Type-safe**: Interface contracts

## 🚀 Current Status

### ✅ Completed
- BaseFilterRenderer architecture
- TaxonomyFilterRenderer
- FilterRendererInterface contract

### 🔄 In Progress
- AdvancedFiltersRenderer integration
- FilterRendererFactory

### 📋 Todo
- MetaFilterRenderer
- PriceFilterRenderer
- DateFilterRenderer
- AuthorFilterRenderer
- KeywordFilterRenderer
- Unit tests
- Documentation examples

## 📚 Related Documentation

- [Post Layout System](../PostLayout/README.md)
- [Query Builders](../../Query/README.md)

