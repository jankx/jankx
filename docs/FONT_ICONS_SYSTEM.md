# Jankx Font Icons System

## Tổng Quan

Jankx Font Icons System là một hệ thống quản lý icons toàn cục cho Jankx Framework, sử dụng **CSS Transformer** để tự động parse CSS files và tạo JSON metadata. Hệ thống này có thể sử dụng cho:

- Legacy menu systems
- Widgets
- Gutenberg blocks
- Jankx Dashboard Framework
- Theme options
- Custom post types
- Anywhere trong Jankx ecosystem

## 🎯 **Đặc điểm chính**

### **1. CSS Transformer**
- **Tự động parse CSS files** từ CDN hoặc local
- **Không cần database** - chỉ cần đọc file và cache
- **Hỗ trợ nhiều loại icon libraries** với prefix khác nhau
- **Auto-generate metadata** từ CSS content

### **2. Prefix-aware System**
- **Mỗi font icons có prefix riêng**: `fa-`, `material-icons`, `icon-`, `svg-icon-`
- **Tự động detect prefix** từ CSS content
- **Hỗ trợ multiple prefixes** cho cùng một icon library

### **3. No FontAwesome by Default**
- **FontAwesome không được load mặc định**
- **Người dùng phải tự khai báo** khi muốn sử dụng
- **Tránh conflicts** với themes/plugins khác

## 🏗️ **Kiến trúc hệ thống**

### **1. Repository Structure**
```
jankx/
├── includes/
│   ├── Support/Providers/
│   │   └── FontIconsServiceProvider.php      # Service Provider
│   ├── Services/
│   │   ├── FontIcons/
│   │   │   ├── IconRepository.php            # File-based repository
│   │   │   ├── IconTypeManager.php           # Quản lý icon types
│   │   │   ├── IconRenderer.php              # Render icons
│   │   │   ├── IconTransformerService.php    # CSS Transformer service
│   │   │   └── Transformers/
│   │   │       ├── CssToJsonTransformer.php  # Base transformer
│   │   │       ├── FontAwesomeTransformer.php # FontAwesome specific
│   │   │       ├── MaterialIconsTransformer.php # Material Icons
│   │   │       ├── CustomIconsTransformer.php # Custom Icons
│   │   │       └── SvgIconsTransformer.php   # SVG Icons
│   │   └── FontIcons/
│   │       ├── IconTypes/
│   │       │   ├── FontAwesomeProvider.php   # FontAwesome provider
│   │       │   ├── MaterialIconsProvider.php # Material Icons provider
│   │       │   ├── CustomIconsProvider.php   # Custom Icons provider
│   │       │   └── SvgIconsProvider.php      # SVG Icons provider
│   └── Facades/
│       └── FontIcons.php                     # Font Icons Facade
├── config/
│   └── font-icons.php                        # Icon configuration
└── resources/
    └── icons/                                # Icon metadata files
        ├── material/
        │   ├── icons.json
        │   └── categories.json
        ├── custom/
        │   ├── icons.json
        │   └── icons/
        └── svg/
            ├── icons.json
            └── icons/
```

## 🔧 **Core Components**

### **1. FontIconsServiceProvider**
```php
<?php

namespace Jankx\Support\Providers;

class FontIconsServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register core services
        $app->singleton('font-icons.repository', IconRepository::class);
        $app->singleton('font-icons.manager', IconTypeManager::class);
        $app->singleton('font-icons.renderer', IconRenderer::class);

        // Register icon type providers (FontAwesome không được register mặc định)
        $app->singleton('font-icons.material', MaterialIconsProvider::class);
        $app->singleton('font-icons.custom', CustomIconsProvider::class);
        $app->singleton('font-icons.svg', SvgIconsProvider::class);

        // FontAwesome chỉ được register khi cần thiết
        $app->singleton('font-icons.fontawesome', FontAwesomeProvider::class);
    }

    public function boot(Application $app)
    {
        // Auto-load active icon types (không bao gồm FontAwesome mặc định)
        add_action('wp_enqueue_scripts', [$this, 'autoLoadActiveIcons']);
        add_action('admin_enqueue_scripts', [$this, 'autoLoadActiveIcons']);
    }
}
```

### **2. IconRepository (File-based)**
```php
<?php

namespace Jankx\Services\FontIcons;

class IconRepository
{
    protected function loadIconTypes()
    {
        $this->iconTypes = [];

        foreach ($this->config['icon_types'] as $type => $typeConfig) {
            if ($typeConfig['enabled']) {
                $this->iconTypes[$type] = $this->loadIconTypeData($type, $typeConfig);
            }
        }
    }

    protected function loadIconTypeData($type, $config)
    {
        $dataFile = JANKX_PATH . "/resources/icons/{$type}/icons.json";

        if (file_exists($dataFile)) {
            $data = json_decode(file_get_contents($dataFile), true);
            if ($data) {
                $data['config'] = $config;
                return $data;
            }
        }

        return null;
    }
}
```

### **3. CSS Transformer Service**
```php
<?php

namespace Jankx\Services\FontIcons;

class IconTransformerService
{
    protected $transformers = [];

    public function transformFromCss($cssUrl, $type)
    {
        $cacheKey = 'jankx_icons_transformed_' . md5($cssUrl);
        $cached = wp_cache_get($cacheKey, 'jankx_font_icons');

        if ($cached !== false) {
            return $cached;
        }

        if (!isset($this->transformers[$type])) {
            throw new \Exception("No transformer found for type: {$type}");
        }

        $transformer = $this->transformers[$type];
        $result = $transformer->transform($cssUrl, $type);

        // Cache the result
        wp_cache_set($cacheKey, $result, 'jankx_font_icons', 86400); // 24 hours

        return $result;
    }
}
```

## 🎨 **Icon Type Providers**

### **1. FontAwesomeProvider (Optional)**
```php
<?php

namespace Jankx\Services\FontIcons\IconTypes;

class FontAwesomeProvider implements IconTypeProviderInterface
{
    protected $config;
    protected $version;
    protected $prefixes = ['fa', 'fas', 'far', 'fab', 'fal', 'fat'];

    public function enqueue()
    {
        // FontAwesome chỉ được load khi người dùng khai báo
        if (!$this->isEnabled()) {
            return;
        }

        $cdnUrl = $this->config['cdn_url'] ?? "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{$this->version}/css/all.min.css";

        wp_enqueue_style(
            'jankx-fontawesome',
            $cdnUrl,
            [],
            $this->version
        );
    }

    public function renderIcon($iconName, $attributes = [])
    {
        $defaultAttributes = [
            'class' => "fa-solid fa-{$iconName}",
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);

        return sprintf('<i %s></i>', $this->buildAttributes($attributes));
    }
}
```

### **2. MaterialIconsProvider (Default)**
```php
<?php

namespace Jankx\Services\FontIcons\IconTypes;

class MaterialIconsProvider implements IconTypeProviderInterface
{
    protected $config;

    public function enqueue()
    {
        // Material Icons được load mặc định
        wp_enqueue_style(
            'jankx-material-icons',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            [],
            $this->config['version'] ?? '1.3.0'
        );
    }

    public function renderIcon($iconName, $attributes = [])
    {
        $defaultAttributes = [
            'class' => 'material-icons',
            'aria-hidden' => 'true'
        ];

        $attributes = array_merge($defaultAttributes, $attributes);

        return sprintf('<span %s>%s</span>', $this->buildAttributes($attributes), $iconName);
    }
}
```

## 🚀 **FontIcons Facade**

```php
<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

class FontIcons extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'font-icons.repository';
    }

    // Get icons by type
    public static function get($type, $filters = [])
    {
        return static::getFacadeRoot()->getIconsByType($type, $filters);
    }

    // Search icons across all types
    public static function search($query, $type = null)
    {
        return static::getFacadeRoot()->searchIcons($query, $type);
    }

    // Render icon HTML
    public static function render($iconName, $type = 'custom', $attributes = [])
    {
        $provider = app("font-icons.{$type}");
        return $provider->renderIcon($iconName, $attributes);
    }

    // Enqueue icon type CSS
    public static function enqueue($type)
    {
        $provider = app("font-icons.{$type}");
        $provider->enqueue();
    }

    // Check if icon type is active
    public static function isActive($type)
    {
        $manager = app('font-icons.manager');
        return $manager->isTypeActive($type);
    }

    // Activate icon type
    public static function activate($type)
    {
        $manager = app('font-icons.manager');
        $manager->activateType($type);
    }
}
```

## 📁 **Configuration Files**

### **1. Main Config**
```php
// config/font-icons.php
return [
    'icon_types' => [
        // FontAwesome không được enable mặc định
        'fontawesome' => [
            'enabled' => false,
            'auto_load' => false,
            'version' => '7.0.0',
            'cdn_url' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{version}/css/all.min.css',
            'prefixes' => ['fa', 'fas', 'far', 'fab', 'fal', 'fat'],
            'categories' => ['solid', 'regular', 'brands', 'light', 'thin']
        ],

        // Material Icons - enabled mặc định
        'material' => [
            'enabled' => true,
            'auto_load' => true,
            'version' => '1.3.0',
            'cdn_url' => 'https://fonts.googleapis.com/icon?family=Material+Icons',
            'prefixes' => ['material-icons'],
            'categories' => ['outlined', 'filled', 'rounded', 'sharp', 'two-tone']
        ],

        // Custom Icons - enabled mặc định
        'custom' => [
            'enabled' => true,
            'auto_load' => true,
            'upload_dir' => 'wp-content/uploads/jankx-icons/',
            'allowed_types' => ['svg', 'png', 'jpg', 'jpeg'],
            'prefixes' => ['icon'],
            'categories' => ['general', 'navigation', 'action', 'status']
        ]
    ],

    'auto_update' => [
        'enabled' => true,
        'frequency' => 'weekly',
        'types' => ['material', 'custom'] // Không bao gồm fontawesome
    ]
];
```

### **2. Icon Metadata Files**
```json
// resources/icons/material/icons.json
{
    "icons": [
        {
            "name": "home",
            "class": "material-icons",
            "type": "material",
            "styles": ["outlined", "filled", "rounded", "sharp", "two-tone"],
            "tags": ["home", "house", "building", "main"],
            "category": "general"
        }
    ],
    "categories": [
        {
            "id": "outlined",
            "name": "Outlined",
            "description": "Outlined style icons"
        }
    ]
}
```

## 🚀 **Usage Examples**

### **1. Sử dụng Material Icons (Default)**
```php
use Jankx\Facades\FontIcons;

// Material Icons được load mặc định
echo FontIcons::render('home', 'material');

// Hoặc sử dụng class
$iconClass = FontIcons::getClass('home', 'material');
echo "<span class='{$iconClass}'>home</span>";
```

### **2. Sử dụng Custom Icons (Default)**
```php
use Jankx\Facades\FontIcons;

// Custom Icons được load mặc định
echo FontIcons::render('logo', 'custom', ['class' => 'custom-logo']);

// Hoặc sử dụng class
$iconClass = FontIcons::getClass('logo', 'custom');
echo "<span class='{$iconClass}'></span>";
```

### **3. Sử dụng FontAwesome (Optional)**
```php
use Jankx\Facades\FontIcons;

// Kích hoạt FontAwesome
FontIcons::activate('fontawesome');

// Enqueue FontAwesome CSS
FontIcons::enqueue('fontawesome');

// Sử dụng FontAwesome icons
echo FontIcons::render('home', 'fontawesome', ['class' => 'fa-2x']);
```

### **4. Transform CSS thành JSON**
```bash
# Transform Material Icons CSS to JSON
wp jankx icons transform --type=material --css-url="https://fonts.googleapis.com/icon?family=Material+Icons" --output="resources/icons/material/icons.json"

# Transform FontAwesome CSS to JSON (khi cần)
wp jankx icons transform --type=fontawesome --css-url="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" --output="resources/icons/fontawesome/icons.json"
```

## 🎯 **Benefits của thiết kế này**

1. **No FontAwesome by Default**: Tránh conflicts với themes/plugins khác
2. **CSS Transformer**: Tự động parse CSS files, không cần tạo metadata thủ công
3. **Prefix-aware**: Hỗ trợ nhiều loại prefix khác nhau
4. **File-based**: Dễ dàng manage và version control
5. **Caching**: Cache icon metadata để tăng performance
6. **Flexible**: Dễ dàng thêm/bớt icon types
7. **Performance**: Lazy loading và caching
8. **Maintainable**: Cấu trúc đơn giản, dễ maintain

## 🔄 **Auto-Update System**

```php
// Auto-update icons (không bao gồm FontAwesome)
add_action('jankx_icons_auto_update', function() {
    $transformer = new \Jankx\Services\FontIcons\IconTransformerService();

    $iconTypes = [
        'material' => 'https://fonts.googleapis.com/icon?family=Material+Icons'
        // FontAwesome sẽ được update thủ công khi người dùng khai báo
    ];

    foreach ($iconTypes as $type => $cssUrl) {
        $transformer->transformAndSave(
            $cssUrl,
            $type,
            JANKX_PATH . "/resources/icons/{$type}/icons.json"
        );
    }
});

// Schedule auto-update (weekly)
if (!wp_next_scheduled('jankx_icons_auto_update')) {
    wp_schedule_event(time(), 'weekly', 'jankx_icons_auto_update');
}
```

## 📚 **Tài liệu tham khảo**

- [Font Awesome 7.0.0 CSS](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css)
- [Material Icons CSS](https://fonts.googleapis.com/icon?family=Material+Icons)
- [Jankx Framework Documentation](./README.md)

## 🆘 **Hỗ trợ**

Để được hỗ trợ hoặc báo cáo vấn đề, vui lòng liên hệ team phát triển hoặc tạo issue trong repository.

---

**Jankx Font Icons System** - Modern icon management system with CSS Transformer support.
