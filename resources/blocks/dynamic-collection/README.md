# Jankx Dynamic Collection Block

Một block collection linh động có thể hiển thị bất kỳ post type nào với khả năng tùy chỉnh query, template và filters.

## Tính Năng Chính

### 🎯 **Query Builder**
- **Post Type Selection**: Chọn bất kỳ post type nào (post, page, custom post types)
- **Flexible Querying**: Posts per page, ordering, offset, include/exclude
- **Advanced Filtering**: Taxonomy filters, meta filters, preset filters

### 🔧 **Filter System**
- **Taxonomy Filters**: Lọc theo categories, tags, custom taxonomies
- **Meta Filters**: Lọc theo custom fields với operators (equals, greater than, like, etc.)
- **Preset Filters**: Featured, popular, recent, trending, editor picks
- **Custom Filters**: Gọi filter functions từ backend

### 🎨 **Template System**
- **Grid Layout**: Standard grid với responsive columns
- **List Layout**: Vertical list cho content-heavy posts
- **Masonry Layout**: Pinterest-style layout
- **Carousel Layout**: Horizontal scrolling
- **Timeline Layout**: Chronological display

### 📱 **Responsive Design**
- **Device-specific Controls**: Desktop, tablet, mobile
- **Responsive Layout**: Columns, spacing, styling
- **Mobile Optimization**: Touch-friendly interactions

### ⚡ **Performance Features**
- **Lazy Loading**: Images load khi cần thiết
- **CSS Containment**: Optimize rendering performance
- **Efficient Queries**: Optimized WP_Query building

## Cách Sử Dụng

### 1. **Thêm Block**
1. Trong Gutenberg editor, thêm block "Dynamic Collection"
2. Chọn post type muốn hiển thị
3. Cấu hình query parameters

### 2. **Cấu Hình Filters**
1. Mở tab **Filters** trong Inspector Controls
2. Thêm taxonomy filters (categories, tags, etc.)
3. Thêm meta filters (custom fields)
4. Chọn preset filters
5. Đăng ký custom filters từ backend

### 3. **Chọn Template**
1. Mở tab **Template**
2. Chọn layout phù hợp với content
3. Tùy chỉnh columns và spacing

### 4. **Styling & Responsive**
1. Mở tab **Styling**
2. Chọn card style và hover effects
3. Bật responsive controls
4. Tùy chỉnh cho từng device

## API Endpoints

### Get Collection Data
```
GET /wp-json/jankx/v1/dynamic-collection/{block-id}
```

### Get Available Filters
```
GET /wp-json/jankx/v1/dynamic-collection/filters?post_type={post_type}
```

## Custom Filters

### Đăng Ký Custom Filter
```php
add_filter('jankx_dynamic_collection_custom_filters', function($filters) {
    $filters['my_custom_filter'] = [
        'name' => 'My Custom Filter',
        'callback' => 'my_filter_function',
        'description' => 'Filter posts by custom logic'
    ];
    return $filters;
});

function my_filter_function(&$args, $parameters) {
    // Modify $args based on $parameters
    $args['meta_query'][] = [
        'key' => '_custom_field',
        'value' => $parameters['value'],
        'compare' => '='
    ];
}
```

### Sử Dụng Custom Filter
1. Trong FilterBuilder, chọn tab **Custom**
2. Thêm filter với tên đã đăng ký
3. Nhập parameters dưới dạng JSON

## Templates

### Grid Template
```css
.jankx-template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--gap, 20px);
}
```

### List Template
```css
.jankx-template-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap, 20px);
}
```

### Masonry Template
```css
.jankx-template-masonry {
    columns: var(--columns, 3);
    column-gap: var(--gap, 20px);
}
```

## Responsive Breakpoints

- **Desktop**: ≥1024px
- **Tablet**: ≤768px
- **Mobile**: ≤480px

## Build Commands

```bash
# Install dependencies
npm install

# Build production
npm run build

# Development mode
npm run dev

# Lint code
npm run lint:js
npm run lint:css
```

## Cấu Trúc Files

```
dynamic-collection/
├── components/
│   ├── QueryControls.js      # Query settings
│   ├── FilterBuilder.js      # Filter management
│   ├── TemplateSelector.js   # Template selection
│   ├── LayoutControls.js     # Layout & pagination
│   ├── DisplayOptions.js     # Display settings
│   └── StylingControls.js    # Styling & responsive
├── build/                    # Generated files
├── block.json               # Block metadata
├── index.js                 # Main editor component
├── save.js                  # Save component
├── package.json             # Dependencies
└── README.md               # This file
```

## Dependencies

- **WordPress Core**: 5.8+
- **Gutenberg**: 11.0+
- **PHP**: 7.4+
- **Node.js**: 14.0+

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

GPL v2 hoặc cao hơn

## Support

- **Documentation**: Xem file này
- **Issues**: Tạo issue trên GitHub
- **Questions**: Liên hệ development team

---

**Lưu ý**: Block này được thiết kế để thay thế `woocommerce/product-collection` với khả năng linh động hơn và có thể sử dụng cho mọi post type, không chỉ sản phẩm.
