# Post Type Layout Block

Block để hiển thị danh sách posts theo layout tùy chỉnh.

## Features

- Query posts từ bất kỳ post type nào
- 3 layout types: Grid, List, Masonry
- Tùy chỉnh số lượng posts
- Tùy chỉnh số cột (cho Grid layout)
- Hiển thị/ẩn các elements: Featured Image, Title, Excerpt, Date, Author
- Sắp xếp theo Date, Title, Random, Menu Order
- Full support cho theme.json settings (colors, spacing, typography, borders)
- Responsive design

## Usage

```php
// Server-side rendering
// Xem file render callback trong GutenbergService
```

## Settings

### Query Settings
- Post Type
- Posts Per Page
- Order By (Date, Title, Random, Menu Order)
- Order (ASC/DESC)

### Layout Settings
- Layout Type (Grid, List, Masonry)
- Columns (1-6, for Grid layout)

### Display Settings
- Show Featured Image
- Show Title
- Show Excerpt
- Show Date
- Show Author

## Supports

- Align (wide, full)
- Spacing (margin, padding, blockGap)
- Color (background, text, link, gradients)
- Typography (fontSize, lineHeight)
- Border (color, radius, style, width)
- Layout (__experimentalLayout)

