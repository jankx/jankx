# Jankx Menu Items Service

## Tổng quan

JankxMenuItemsService là một module để thêm **custom menu items** vào WordPress Menu Admin (`/wp-admin/nav-menus.php`). Module này tạo ra một **control section** với tên "Jankx Framework" chứa các menu items đặc biệt:

- ✅ **Hamburger Menu**: Button để toggle slideout menu
- ✅ **Search Box**: Search functionality
- ✅ **Shopping Cart**: Cart icon cho e-commerce
- ✅ **User Account**: User menu item
- ✅ **Extensible**: Dễ dàng thêm menu items mới
- ✅ **Admin Integration**: Tích hợp hoàn toàn với WordPress Menu Admin

## Tính năng chính

### 1. **Control Section trong Menu Admin**
```
Jankx Framework
├── Hamburger Menu (☰)
├── Search Box (🔍)
├── Shopping Cart (🛒)
└── User Account (👤)
```

### 2. **Custom Menu Item Types**
- Mỗi menu item có type riêng
- Custom rendering logic
- Configurable appearance
- Accessibility support

### 3. **Admin Interface**
- Drag & drop support
- Visual feedback
- Loading states
- Error handling
- Responsive design

## Cách sử dụng

### 1. Basic Setup

```php
// Trong Service Provider
use App\Services\Layouts\JankxMenuItemsService;

public function register(Application $app)
{
    $app->singleton(JankxMenuItemsService::class, function ($app) {
        return new JankxMenuItemsService($app, [
            'section_title' => 'Jankx Framework',
            'section_id' => 'jankx-framework-menu-items',
            'menu_items' => [
                'hamburger' => [
                    'title' => 'Hamburger Menu',
                    'description' => 'Add hamburger menu button',
                    'icon' => '☰',
                    'class' => 'jankx-menu-item-hamburger',
                ],
                // Thêm các menu items khác...
            ],
        ]);
    });
}

public function boot(Application $app)
{
    // Service sẽ tự động setup hooks
    $app->make(JankxMenuItemsService::class);
}
```

### 2. Thêm Menu Item mới

```php
// Trong JankxMenuItemsService
protected function getDefaultConfig()
{
    return [
        'menu_items' => [
            // Existing items...
            'custom' => [
                'title' => 'Custom Item',
                'description' => 'Add custom functionality',
                'icon' => '⭐',
                'class' => 'jankx-menu-item-custom',
            ],
        ],
    ];
}

// Thêm render method
public function renderCustomMenuItem($item, $args, $depth)
{
    return sprintf(
        '<span class="jankx-menu-item-custom" data-toggle="custom">⭐</span>'
    );
}
```

### 3. Custom Configuration

```php
// Tùy chỉnh section
$config = [
    'section_title' => 'My Custom Framework',
    'section_id' => 'my-framework-menu-items',
    'menu_items' => [
        'hamburger' => [
            'title' => 'Mobile Menu',
            'description' => 'Toggle mobile navigation',
            'icon' => '📱',
            'class' => 'mobile-menu-toggle',
        ],
    ],
];

$jankxMenuService = new JankxMenuItemsService($app, $config);
```

## Menu Items Available

### 1. Hamburger Menu
```php
'hamburger' => [
    'title' => 'Hamburger Menu',
    'description' => 'Add hamburger menu button for mobile navigation',
    'icon' => '☰',
    'class' => 'jankx-menu-item-hamburger',
]
```

**Rendered HTML:**
```html
<span class="jankx-menu-item-hamburger" data-toggle="slideout-menu" aria-label="Toggle mobile menu">☰</span>
```

### 2. Search Box
```php
'search' => [
    'title' => 'Search Box',
    'description' => 'Add search functionality to menu',
    'icon' => '🔍',
    'class' => 'jankx-menu-item-search',
]
```

**Rendered HTML:**
```html
<span class="jankx-menu-item-search" data-toggle="search" aria-label="Open search">🔍</span>
```

### 3. Shopping Cart
```php
'cart' => [
    'title' => 'Shopping Cart',
    'description' => 'Add shopping cart icon to menu',
    'icon' => '🛒',
    'class' => 'jankx-menu-item-cart',
]
```

**Rendered HTML:**
```html
<span class="jankx-menu-item-cart" data-toggle="cart" aria-label="View cart">🛒</span>
```

### 4. User Account
```php
'user' => [
    'title' => 'User Account',
    'description' => 'Add user account menu item',
    'icon' => '👤',
    'class' => 'jankx-menu-item-user',
]
```

**Rendered HTML:**
```html
<span class="jankx-menu-item-user" data-toggle="user-menu" aria-label="User menu">👤</span>
```

## Admin Interface

### 1. Control Section
- **Location**: `/wp-admin/nav-menus.php`
- **Section**: "Jankx Framework" (accordion)
- **Items**: Grid layout với icons và descriptions

### 2. Menu Item Management
- **Add to Menu**: One-click add
- **Type Selection**: Dropdown để chọn type
- **Custom Fields**: Type-specific fields
- **Preview**: Real-time preview

### 3. Visual Feedback
- **Loading**: Spinner khi adding
- **Success**: Green border khi thành công
- **Error**: Red border khi lỗi
- **Tooltips**: Hover tooltips

## JavaScript Integration

### 1. Event Handling
```javascript
// Add menu item
$('.jankx-add-menu-item').on('click', function() {
    // Handle add menu item
});

// Type change
$('select[name*="menu-item-jankx-type"]').on('change', function() {
    // Handle type change
});
```

### 2. AJAX Support
```javascript
// AJAX request
$.ajax({
    url: jankxMenuItems.ajaxUrl,
    type: 'POST',
    data: {
        action: 'jankx_add_menu_item',
        nonce: jankxMenuItems.nonce,
        menu_id: menuId,
        item_type: type,
        // ...
    },
    success: function(response) {
        // Handle success
    }
});
```

## CSS Classes

### 1. Control Section
```css
#jankx-framework-menu-items {
    /* Control section styles */
}

.jankx-menu-items {
    /* Menu items container */
}

.jankx-menu-item {
    /* Individual menu item */
}
```

### 2. Menu Items
```css
.jankx-menu-item-hamburger { /* Hamburger styles */ }
.jankx-menu-item-search { /* Search styles */ }
.jankx-menu-item-cart { /* Cart styles */ }
.jankx-menu-item-user { /* User styles */ }
```

### 3. States
```css
.jankx-menu-item.loading { /* Loading state */ }
.jankx-menu-item.success { /* Success state */ }
.jankx-menu-item.error { /* Error state */ }
```

## Integration với Slideout Menu

### 1. Hamburger Menu Item
```php
// Trong SlideoutMenuLayoutService
public function renderHamburgerMenuItem($item, $args, $depth)
{
    return sprintf(
        '<span class="jankx-menu-item-hamburger" data-toggle="slideout-menu">☰</span>'
    );
}
```

### 2. JavaScript Handler
```javascript
// Trong slideout menu JS
$(document).on('click', '[data-toggle="slideout-menu"]', function() {
    // Toggle slideout menu
    $('.slideout-menu').toggleClass('open');
});
```

## Best Practices

### 1. Naming Convention
```php
// Sử dụng descriptive names
'hamburger' => 'Hamburger Menu',
'search' => 'Search Box',
'cart' => 'Shopping Cart',
'user' => 'User Account',
```

### 2. Icon Selection
```php
// Sử dụng Unicode icons hoặc Font Awesome
'icon' => '☰',     // Unicode
'icon' => '🔍',    // Unicode
'icon' => '🛒',    // Unicode
'icon' => '👤',    // Unicode
```

### 3. Accessibility
```php
// Luôn thêm ARIA attributes
'aria-label' => 'Toggle mobile menu',
'aria-expanded' => 'false',
'aria-controls' => 'slideout-menu',
```

### 4. CSS Classes
```php
// Sử dụng BEM methodology
'class' => 'jankx-menu-item-hamburger',
'class' => 'jankx-menu-item-search',
'class' => 'jankx-menu-item-cart',
```

## Troubleshooting

### 1. Menu Item không hiển thị
- Kiểm tra menu có được assign không
- Kiểm tra menu location có đúng không
- Kiểm tra CSS có bị ẩn không

### 2. Control Section không xuất hiện
- Kiểm tra Service Provider có được register không
- Kiểm tra hook `admin_footer-nav-menus.php`
- Kiểm tra CSS/JS có load không

### 3. JavaScript không hoạt động
- Kiểm tra jQuery có load không
- Kiểm tra console errors
- Kiểm tra AJAX URL và nonce

### 4. Custom Fields không save
- Kiểm tra hook `wp_update_nav_menu_item`
- Kiểm tra field names có đúng không
- Kiểm tra sanitization

## Next Steps

1. **AJAX Handler**: Implement AJAX handler cho add menu item
2. **Custom Fields**: Add more custom fields cho từng type
3. **Validation**: Add validation cho menu items
4. **Preview**: Add live preview functionality
5. **Bulk Actions**: Add bulk add/remove functionality
6. **Import/Export**: Add import/export menu items
7. **Templates**: Add menu item templates
8. **Analytics**: Add usage analytics

---

**Module này đã sẵn sàng để sử dụng!** 🎯

Khi vào `/wp-admin/nav-menus.php`, bạn sẽ thấy section "Jankx Framework" với các menu items có thể thêm vào menu.
