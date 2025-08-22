# 🎠 Product Carousel Block - Jankx Framework

Gutenberg block tạo product carousel với khả năng kéo **product collections của WooCommerce** vào làm nested block. Block này biến product list thành carousel tương tác với nhiều tính năng hiện đại.

## 🚀 **Tính năng chính**

- **🔄 Nested Blocks**: Kéo product collections của WooCommerce vào làm nested blocks
- **🎠 Multiple Carousel Types**: Swiper, Slick, Owl Carousel
- **📱 Responsive**: Tự động responsive với breakpoints khác nhau
- **⚡ Autoplay**: Tự động chuyển slide với tùy chỉnh delay
- **🎯 Navigation**: Nhiều kiểu navigation (arrows, dots, both)
- **📊 Pagination**: Dots, numbers, progress bar
- **🎨 Customizable**: Tùy chỉnh hiển thị product elements
- **♿ Accessibility**: Hỗ trợ screen reader và keyboard navigation

## 🏗️ **Cấu trúc file**

```
product-carousel/
├── block.json              # Block metadata & attributes
├── index.js                # Main editor component
├── save.js                 # Frontend render component
├── index.css               # Editor styles
├── style-index.css         # Frontend styles
├── README.md               # Documentation
└── build/                  # Built assets (generated)
```

## ⚙️ **Attributes**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | 'Featured Products' | Carousel title |
| `showTitle` | boolean | true | Hiển thị title |
| `titleTag` | string | 'h2' | HTML tag cho title |
| `titleAlignment` | string | 'center' | Căn lề title (left/center/right) |
| `carouselType` | string | 'swiper' | Loại carousel (swiper/slick/owl) |
| `slidesPerView` | number | 4 | Số slides hiển thị (desktop) |
| `slidesPerViewMobile` | number | 1 | Số slides hiển thị (mobile) |
| `slidesPerViewTablet` | number | 2 | Số slides hiển thị (tablet) |
| `spaceBetween` | number | 20 | Khoảng cách giữa slides |
| `autoplay` | boolean | true | Tự động chuyển slide |
| `autoplayDelay` | number | 3000 | Delay autoplay (ms) |
| `loop` | boolean | true | Lặp vô tận |
| `showNavigation` | boolean | true | Hiển thị navigation |
| `showPagination` | boolean | true | Hiển thị pagination |
| `navigationStyle` | string | 'arrows' | Kiểu navigation (arrows/dots/both) |
| `paginationStyle` | string | 'dots' | Kiểu pagination (dots/numbers/progress) |
| `showProductImage` | boolean | true | Hiển thị product image |
| `showProductTitle` | boolean | true | Hiển thị product title |
| `showProductPrice` | boolean | true | Hiển thị product price |
| `showProductRating` | boolean | true | Hiển thị product rating |
| `showAddToCart` | boolean | true | Hiển thị add to cart button |
| `imageSize` | string | 'medium' | Kích thước image |
| `customClassName` | string | '' | CSS class tùy chỉnh |
| `anchor` | string | '' | HTML anchor |

## 🎠 **Carousel Types**

### **Swiper**
- Modern touch slider
- Touch/swipe support
- Smooth animations
- Responsive breakpoints

### **Slick**
- Lightweight carousel
- Fast performance
- Multiple slide modes
- Touch friendly

### **Owl Carousel**
- Feature-rich carousel
- Multiple animations
- Advanced options
- Extensive customization

## 🔗 **WooCommerce Integration**

### **Supported Nested Blocks**
- `woocommerce/product-query`
- `woocommerce/product-template`
- `woocommerce/product-collection`
- `woocommerce/featured-product`
- `woocommerce/handpicked-products`
- `woocommerce/product-categories`
- `woocommerce/product-tag`
- `woocommerce/product-on-sale`
- `woocommerce/products-by-attribute`
- `woocommerce/product-best-sellers`
- `woocommerce/product-top-rated`
- `woocommerce/product-new`
- Và nhiều blocks khác...

### **Product Display Options**
- **Image**: Hiển thị/ẩn product image
- **Title**: Hiển thị/ẩn product title
- **Price**: Hiển thị/ẩn product price
- **Rating**: Hiển thị/ẩn product rating
- **Add to Cart**: Hiển thị/ẩn add to cart button

## 🎨 **Customization**

### **CSS Classes**
```css
.jankx-product-carousel {
    /* Block container */
}

.jankx-product-carousel__title {
    /* Title element */
}

.jankx-product-carousel__container {
    /* Carousel container */
}

.jankx-product-carousel__content {
    /* Carousel content */
}

.jankx-product-carousel__navigation {
    /* Navigation controls */
}

.jankx-product-carousel__pagination {
    /* Pagination controls */
}
```

### **CSS Variables**
```css
.jankx-product-carousel {
    --carousel-padding: 20px;
    --carousel-border-radius: 8px;
    --carousel-transition: all 0.3s ease;
    --carousel-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## 📱 **Responsive Design**

Block tự động responsive với breakpoints:

- **Desktop**: Full carousel functionality
- **Tablet**: Medium slides per view
- **Mobile**: Single slide per view, touch optimized

## ♿ **Accessibility**

- **Screen Reader**: Carousel được mô tả đầy đủ
- **Keyboard**: Hỗ trợ tab navigation
- **Focus**: Focus indicator rõ ràng
- **ARIA**: Proper ARIA labels và roles
- **High Contrast**: Hỗ trợ high contrast mode

## 🌍 **Internationalization**

- **RTL Support**: Hỗ trợ right-to-left languages
- **Translation Ready**: Sử dụng WordPress i18n
- **Language Detection**: Tự động detect ngôn ngữ

## 🔧 **Development**

### **Build Commands**
```bash
# Build production
npm run build:product-carousel

# Development mode
npm run dev:product-carousel

# Build all blocks
npm run build:all-blocks
```

### **Adding New Carousel Types**

1. Thêm carousel type vào `carouselTypeOptions`
2. Thêm CSS styles cho carousel type mới
3. Implement JavaScript functionality
4. Test trong editor và frontend

### **Extending Block**

```php
// Extend ProductCarouselBlock class
class CustomProductCarouselBlock extends ProductCarouselBlock
{
    public function __construct()
    {
        parent::__construct();
        // Add custom functionality
    }
}
```

## 📚 **Examples**

### **Basic Product Carousel**
```php
<!-- wp:jankx/product-carousel {
    "title": "Featured Products",
    "carouselType": "swiper",
    "slidesPerView": 4,
    "autoplay": true
} -->
<!-- wp:woocommerce/product-query {} -->
<!-- /wp:jankx/product-carousel -->
```

### **Product Carousel with Custom Settings**
```php
<!-- wp:jankx/product-carousel {
    "title": "Best Sellers",
    "titleTag": "h3",
    "titleAlignment": "left",
    "carouselType": "slick",
    "slidesPerView": 3,
    "slidesPerViewMobile": 1,
    "slidesPerViewTablet": 2,
    "spaceBetween": 30,
    "autoplay": true,
    "autoplayDelay": 5000,
    "loop": true,
    "showNavigation": true,
    "showPagination": true,
    "navigationStyle": "arrows",
    "paginationStyle": "dots"
} -->
<!-- wp:woocommerce/product-query {
    "queryId": 1,
    "query": {
        "perPage": 12,
        "pages": 0,
        "offset": 0,
        "postType": "product",
        "order": "desc",
        "orderBy": "total_sales",
        "author": "",
        "search": "",
        "exclude": [],
        "sticky": "",
        "inherit": false
    }
} -->
<!-- /wp:jankx/product-carousel -->
```

### **Product Categories Carousel**
```php
<!-- wp:jankx/product-carousel {
    "title": "Product Categories",
    "carouselType": "swiper",
    "slidesPerView": 6,
    "showProductImage": true,
    "showProductTitle": true,
    "showProductPrice": false,
    "showProductRating": false,
    "showAddToCart": false
} -->
<!-- wp:woocommerce/product-categories {
    "hasCount": true,
    "hasImage": true
} -->
<!-- /wp:jankx/product-carousel -->
```

## 🐛 **Troubleshooting**

### **Carousel không hoạt động**
1. Kiểm tra block đã được đăng ký
2. Verify JavaScript đã load
3. Check console errors
4. Kiểm tra WooCommerce blocks

### **Products không hiển thị**
1. Kiểm tra nested WooCommerce blocks
2. Verify WooCommerce đã kích hoạt
3. Check product query settings
4. Test trong frontend

### **Navigation không hoạt động**
1. Kiểm tra showNavigation = true
2. Verify navigation style
3. Check CSS conflicts
4. Test JavaScript functionality

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🆘 **Support**

- **Documentation**: Xem tài liệu Jankx Framework
- **Issues**: Tạo issue trên GitHub
- **Community**: Tham gia Jankx community

---

**Product Carousel Block** - Modern Gutenberg carousel block với WooCommerce integration và nested blocks support.
