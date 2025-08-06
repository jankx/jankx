# Hamburger Menu Service

## Tổng quan

HamburgerMenuService là một module tái sử dụng để thêm **custom hamburger menu item** vào WordPress menu system. Module này cho phép:

- ✅ **Tái sử dụng**: Các service khác nhau có thể dùng chung
- ✅ **Responsive**: Hỗ trợ mobile, tablet, desktop
- ✅ **Configurable**: Dễ dàng tùy chỉnh appearance và behavior
- ✅ **Accessibility**: Hỗ trợ ARIA attributes
- ✅ **Multiple instances**: Có thể tạo nhiều hamburger menu khác nhau

## Cách sử dụng

### 1. Basic Usage

```php
// Trong Service Provider
use App\Services\Layouts\HamburgerMenuService;

public function register(Application $app)
{
    $app->singleton(HamburgerMenuService::class, function ($app) {
        return new HamburgerMenuService($app, [
            'menu_locations' => ['primary', 'mobile'],
            'item_title' => '☰',
            'responsive' => [
                'mobile' => true,
                'tablet' => true,
                'desktop' => false,
            ],
        ]);
    });
}

public function boot(Application $app)
{
    // Service sẽ tự động setup hooks khi được khởi tạo
    $app->make(HamburgerMenuService::class);
}
```

### 2. Multiple Instances

```php
// Tạo nhiều hamburger menu với config khác nhau
$primaryHamburger = new HamburgerMenuService($app, [
    'menu_locations' => ['primary'],
    'item_title' => '☰',
    'position' => 'last',
]);

$secondaryHamburger = new HamburgerMenuService($app, [
    'menu_locations' => ['secondary'],
    'item_title' => '⋮',
    'position' => 'first',
    'responsive' => [
        'mobile' => true,
        'desktop' => true, // Enable trên desktop
    ],
]);
```

### 3. Sử dụng trực tiếp

```php
// Lấy service từ container
$hamburgerService = $app->make(\App\Services\Layouts\HamburgerMenuService::class);

// Update config
$hamburgerService->updateConfig([
    'item_title' => '⚙',
    'responsive' => ['desktop' => true],
]);

// Lấy config hiện tại
$config = $hamburgerService->getConfig();
```

## Configuration Options

### Menu Locations
```php
'menu_locations' => ['primary', 'mobile', 'secondary']
```

### Item Title
```php
'item_title' => '☰', // Hamburger icon
'item_title' => '⋮', // Dots icon
'item_title' => '⚙', // Settings icon
'item_title' => 'Menu', // Text
```

### Responsive Settings
```php
'responsive' => [
    'mobile' => true,   // Hiển thị trên mobile
    'tablet' => true,   // Hiển thị trên tablet
    'desktop' => false, // Hiển thị trên desktop
]
```

### Position
```php
'position' => 'last',   // Thêm vào cuối menu
'position' => 'first',  // Thêm vào đầu menu
'position' => 'after',  // Thêm sau item cụ thể
'position' => 'before', // Thêm trước item cụ thể
```

### Custom Attributes
```php
'item_attributes' => [
    'data-toggle' => 'slideout-menu',
    'aria-label' => 'Toggle mobile menu',
    'aria-expanded' => 'false',
    'aria-controls' => 'jankx-slideout-menu',
]
```

## Integration với Slideout Menu

### 1. Tự động tích hợp

Khi sử dụng `SlideoutMenuServiceProvider`, hamburger menu sẽ tự động được thêm vào các menu locations đã cấu hình.

### 2. Manual Integration

```php
// Trong template
<?php
$hamburgerService = $app->make(\App\Services\Layouts\HamburgerMenuService::class);
$hamburgerService->renderHamburgerMenuItem('primary');
?>
```

## Examples

### Example 1: Mobile-only Hamburger
```php
$mobileHamburger = new HamburgerMenuService($app, [
    'menu_locations' => ['primary'],
    'item_title' => '☰',
    'responsive' => [
        'mobile' => true,
        'tablet' => true,
        'desktop' => false,
    ],
    'position' => 'last',
]);
```

### Example 2: Desktop Hamburger
```php
$desktopHamburger = new HamburgerMenuService($app, [
    'menu_locations' => ['secondary'],
    'item_title' => '⋮',
    'responsive' => [
        'mobile' => true,
        'tablet' => true,
        'desktop' => true, // Enable trên desktop
    ],
    'position' => 'first',
]);
```

### Example 3: Floating Hamburger
```php
$floatingHamburger = new HamburgerMenuService($app, [
    'menu_locations' => ['floating'],
    'item_title' => '⚙',
    'responsive' => [
        'mobile' => true,
        'tablet' => false,
        'desktop' => false,
    ],
    'position' => 'last',
]);
```

## CSS Classes

Hamburger menu item sẽ có các CSS classes:

```html
<li class="menu-item menu-item-hamburger jankx-hamburger-item show-mobile show-tablet">
    <a href="#" data-toggle="slideout-menu" aria-label="Toggle mobile menu">
        ☰
    </a>
</li>
```

### Responsive Classes
- `.show-mobile`: Hiển thị trên mobile
- `.show-tablet`: Hiển thị trên tablet
- `.show-desktop`: Hiển thị trên desktop

## JavaScript Integration

Hamburger menu item có các data attributes để JavaScript có thể handle:

```html
<a href="#"
   data-toggle="slideout-menu"
   aria-label="Toggle mobile menu"
   aria-expanded="false"
   aria-controls="jankx-slideout-menu">
    ☰
</a>
```

## Best Practices

### 1. Naming Convention
```php
// Sử dụng meaningful names
$primaryHamburger = new HamburgerMenuService($app, [...]);
$secondaryHamburger = new HamburgerMenuService($app, [...]);
$floatingHamburger = new HamburgerMenuService($app, [...]);
```

### 2. Configuration Management
```php
// Tách config ra file riêng
$config = [
    'primary' => [
        'menu_locations' => ['primary'],
        'item_title' => '☰',
        'responsive' => ['mobile' => true, 'desktop' => false],
    ],
    'secondary' => [
        'menu_locations' => ['secondary'],
        'item_title' => '⋮',
        'responsive' => ['mobile' => true, 'desktop' => true],
    ],
];
```

### 3. Service Provider Pattern
```php
// Luôn đăng ký trong Service Provider
public function register(Application $app)
{
    $app->singleton(HamburgerMenuService::class, function ($app) {
        return new HamburgerMenuService($app, $this->getConfig());
    });
}

public function boot(Application $app)
{
    // Service sẽ tự động setup hooks
    $app->make(HamburgerMenuService::class);
}
```

## Troubleshooting

### 1. Hamburger menu không hiển thị
- Kiểm tra `menu_locations` có đúng không
- Kiểm tra `responsive` settings
- Kiểm tra menu có được assign không

### 2. Hamburger menu hiển thị sai vị trí
- Kiểm tra `position` setting
- Kiểm tra `after_item` hoặc `before_item`

### 3. Responsive không hoạt động
- Kiểm tra `responsive` configuration
- Kiểm tra CSS media queries
- Kiểm tra JavaScript detection

## Next Steps

1. **JavaScript Implementation**: Handle click events và toggle menu
2. **CSS Styling**: Style hamburger menu items
3. **Animation**: Add smooth animations
4. **Accessibility**: Enhance ARIA support
5. **Testing**: Add unit tests

---

**Module này đã sẵn sàng để sử dụng!** 🎯
