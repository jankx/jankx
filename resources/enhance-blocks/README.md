# Jankx Block Enhancements

Bộ filter và enhancement cho các WooCommerce blocks, giúp mở rộng tính năng và tùy chỉnh giao diện.

## Cấu trúc thư mục

```
resources/enhance-blocks/
├── main.ts                          # Entry point chính
├── filters/                         # Các filter cho editor
│   ├── product-collection.ts        # Filter cho Product Collection
│   ├── product-grid.ts              # Filter cho Product Grid
│   └── product-carousel.ts          # Filter cho Product Carousel
├── frontend/                        # Frontend enhancements
│   ├── product-collection.ts        # Frontend cho Product Collection
│   └── product-grid.ts              # Frontend cho Product Grid
└── README.md                        # Hướng dẫn sử dụng
```

## Các Filter có sẵn

### 1. Product Collection Filter

**File:** `filters/product-collection.ts`

**Tính năng:**
- Thêm custom collection dựa trên product category
- Tùy chỉnh collection type (Featured, On Sale, Best Sellers, etc.)
- Tùy chỉnh title và số lượng sản phẩm
- Toggle để bật/tắt custom collection

**Cách sử dụng:**
1. Thêm block "Product Collection" vào trang
2. Trong Inspector Controls, mở "Custom Collection Settings"
3. Bật "Show Custom Collection"
4. Chọn category và type mong muốn

### 2. Product Grid Filter

**File:** `filters/product-grid.ts`

**Tính năng:**
- Quick View functionality
- Wishlist functionality
- Compare functionality
- Animation effects (Fade In, Slide Up, Scale, Rotate)
- Hover effects (Zoom, Slide, Flip, Shine)

**Cách sử dụng:**
1. Thêm block "Product Grid" vào trang
2. Trong Inspector Controls, mở "Product Grid Enhancements"
3. Bật các tính năng mong muốn
4. Chọn animation và hover effects

### 3. Product Carousel Filter

**File:** `filters/product-carousel.ts`

**Tính năng:**
- Autoplay với tùy chỉnh speed
- Navigation arrows và dots
- Infinite loop
- Responsive behavior
- Carousel effects (Slide, Fade, Cube, Coverflow, Flip)

**Cách sử dụng:**
1. Thêm block "Product Carousel" vào trang
2. Trong Inspector Controls, mở "Carousel Settings"
3. Tùy chỉnh các options theo ý muốn

## Frontend Enhancements

### Product Collection Frontend

**File:** `frontend/product-collection.ts`

**Tính năng:**
- Load custom collection từ API
- Render products với layout tùy chỉnh
- Handle AJAX requests

### Product Grid Frontend

**File:** `frontend/product-grid.ts`

**Tính năng:**
- Apply animation effects
- Apply hover effects
- Add interactive buttons (Quick View, Wishlist, Compare)
- Handle user interactions

## Cách thêm Filter mới

### 1. Tạo file filter mới

```typescript
// filters/new-block.ts
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

// Add custom attributes
addFilter(
    'blocks.registerBlockType',
    'jankx/enhance-new-block',
    (settings, name) => {
        if (name !== 'block-name') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                // Add your custom attributes here
            }
        };
    }
);

// Add custom controls
const withCustomControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'block-name') {
            return <BlockEdit {...props} />;
        }

        // Your custom controls here
        return <BlockEdit {...props} />;
    };
}, 'withCustomControls');

addFilter(
    'editor.BlockEdit',
    'jankx/enhance-new-block',
    withCustomControls
);
```

### 2. Import trong main.ts

```typescript
// main.ts
import './filters/new-block';
export * from './filters/new-block';
```

## API Endpoints

### Custom Collection API

**Endpoint:** `/wp-json/jankx/v1/custom-collection`

**Method:** POST

**Parameters:**
- `category`: Product category slug
- `type`: Collection type (featured, on-sale, etc.)
- `title`: Custom title
- `limit`: Number of products

**Response:**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id": 123,
                "name": "Product Name",
                "permalink": "https://example.com/product",
                "image": "https://example.com/image.jpg",
                "price": "$99.99",
                "rating": "★★★★☆"
            }
        ]
    }
}
```

## Build và Deploy

### 1. Build

```bash
npm run development
# hoặc
npm run production
```

### 2. Deploy

Các file sẽ được build vào thư mục `build/` và có thể được enqueue trong WordPress.

## Troubleshooting

### 1. Filter không hoạt động

- Kiểm tra console có lỗi JavaScript không
- Đảm bảo file đã được import trong main.ts
- Kiểm tra block name có đúng không

### 2. Frontend không hoạt động

- Kiểm tra DOM elements có tồn tại không
- Kiểm tra AJAX requests có thành công không
- Kiểm tra CSS classes có đúng không

### 3. Performance issues

- Sử dụng lazy loading cho images
- Debounce các event handlers
- Optimize AJAX requests

## Contributing

1. Tạo branch mới cho feature
2. Thêm filter vào thư mục `filters/`
3. Thêm frontend enhancement vào thư mục `frontend/`
4. Import trong `main.ts`
5. Test kỹ trước khi commit
6. Tạo pull request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
