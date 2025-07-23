# Post Layout System - Jankx 2.0

## Overview

Jankx 2.0 Post Layout system được thiết kế dựa trên **Gutenberg Patterns** kết hợp với **Dynamic Query Loop** để đảm bảo:

- **100% tương thích với Gutenberg**: Sử dụng WordPress patterns có sẵn
- **Dynamic rendering**: Không lưu static HTML, luôn query và render dữ liệu mới nhất
- **Extensible**: Dễ dàng thêm patterns mới
- **Performance optimized**: Tận dụng WordPress core optimization

## Core Concepts

### 1. Dynamic Query Loop
- **Không render static HTML**: Không lưu kết quả query vào post_content
- **Chỉ lưu cấu hình**: Query args, layout pattern, options được lưu trong block attributes
- **Server-side rendering**: Mỗi lần load trang, thực hiện WP_Query và render kết quả mới nhất
- **Real-time data**: Dữ liệu luôn cập nhật, không bị "đóng băng" như Gutenberg Query Loop mặc định

### 2. Gutenberg Patterns Integration
- **Sử dụng patterns có sẵn**: Tận dụng WordPress patterns library
- **Extend patterns**: Jankx thêm patterns riêng cho post layouts
- **Pattern categories**: `jankx-post-layouts`, `jankx-card-layouts`, `jankx-grid-layouts`
- **Customizable**: Patterns có thể được edit trực tiếp trong Gutenberg editor

## Architecture

```
Jankx 2.0 Post Layout
├── Dynamic Query Loop Block
│   ├── Block Attributes (query config, layout pattern)
│   ├── render_callback (WP_Query + pattern rendering)
│   └── Editor Interface (InspectorControls)
├── Pattern Library
│   ├── WordPress Core Patterns
│   ├── Jankx Extended Patterns
│   └── Custom User Patterns
└── Migration System
    ├── Jankx 1.0 → 2.0 Migration
    └── Layout Class → Pattern Mapping
```

## Key Components

### 1. Query Loop Block
- **Block name**: `jankx/dynamic-query-loop`
- **Attributes**: postType, perPage, layoutPattern, gridColumns, orderBy, order
- **render_callback**: Thực hiện WP_Query và render patterns
- **Editor support**: Preview với real data hoặc mock data

### 2. Pattern Library
- **Core patterns**: Post card, grid layouts, hero sections
- **Extended patterns**: Carousel, tabs, testimonials
- **Custom patterns**: User-defined layouts
- **Pattern categories**: Organized by layout type

### 3. Migration System
- **Layout class mapping**: Convert Jankx 1.0 layout classes to patterns
- **Data migration**: Convert old layout data to new pattern structure
- **Backward compatibility**: Support for old layout data during transition

## Benefits

### Technical Benefits
- **Gutenberg native**: 100% compatible với WordPress core
- **Performance optimized**: Tận dụng WordPress patterns optimization
- **Maintainable**: Không cần maintain layout system riêng
- **Extensible**: Dễ dàng thêm patterns mới

### User Benefits
- **Familiar interface**: User đã quen với Gutenberg patterns
- **Rich library**: Có sẵn patterns từ WordPress + Jankx extensions
- **Easy customization**: Edit patterns trực tiếp trong editor
- **Responsive**: Patterns đã được optimize cho responsive

### Developer Benefits
- **Standard approach**: Sử dụng WordPress patterns standard
- **Less code**: Không cần viết layout system từ đầu
- **Better testing**: Patterns được test kỹ bởi WordPress community
- **Future-proof**: Patterns sẽ được maintain và update

## Migration from Jankx 1.0

### Layout Class Mapping
```php
$migration_map = [
    'Card' => 'jankx/post-card',
    'CardMeta' => 'jankx/post-card-meta',
    'Hero' => 'jankx/hero-post',
    'Grid' => 'jankx/grid-2-columns',
    'Carousel' => 'jankx/carousel-basic',
    'Tabs' => 'jankx/tabs-basic',
];
```

### Migration Process
1. **Detect old layout classes** trong existing content
2. **Map to new patterns** sử dụng migration mapping
3. **Convert layout data** sang pattern structure
4. **Update block attributes** với new pattern configuration
5. **Preserve user customizations** trong migration process

## Next Steps

- [Pattern Library Documentation](./pattern-library.md)
- [Dynamic Query Loop Implementation](./dynamic-query-loop.md)
- [Migration Guide](./migration-guide.md)
- [Best Practices](./best-practices.md)
- [Troubleshooting](./troubleshooting.md)