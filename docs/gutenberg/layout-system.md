# Layout System

> **Modern Layout Management with Gutenberg**

Jankx 2.0 sử dụng layout system hiện đại dựa trên Gutenberg, hỗ trợ atomic design và responsive layouts.

## 🏗 Layout Architecture

### Layout Structure
```
┌─────────────────────────────────────┐
│           Layout System             │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Layout    │  │   Template  │  │
│  │  Manager    │  │   Engine    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Layout Components           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Header    │  │   Footer    │  │
│  │   Layout    │  │   Layout    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Content Areas               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Main      │  │   Sidebar   │  │
│  │  Content    │  │   Content   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Layout Manager

### Layout Manager Implementation
```php
<?php
namespace Jankx\Gutenberg\Layout;

class LayoutManager
{
    private $layouts = [];
    private $templates = [];
    private $currentLayout = null;

    public function __construct()
    {
        $this->registerDefaultLayouts();
    }

    public function registerLayout(string $name, array $config): void
    {
        $this->layouts[$name] = new Layout($name, $config);
    }

    public function getLayout(string $name): ?Layout
    {
        return $this->layouts[$name] ?? null;
    }

    public function setCurrentLayout(string $name): void
    {
        $this->currentLayout = $this->getLayout($name);
    }

    public function getCurrentLayout(): ?Layout
    {
        return $this->currentLayout;
    }

    public function renderLayout(string $name, array $data = []): string
    {
        $layout = $this->getLayout($name);

        if (!$layout) {
            throw new \Exception("Layout not found: {$name}");
        }

        return $layout->render($data);
    }

    private function registerDefaultLayouts(): void
    {
        // Default layouts
        $this->registerLayout('default', [
            'template' => 'layouts/default',
            'areas' => ['header', 'main', 'footer'],
            'responsive' => true,
        ]);

        $this->registerLayout('full-width', [
            'template' => 'layouts/full-width',
            'areas' => ['header', 'main', 'footer'],
            'responsive' => true,
        ]);

        $this->registerLayout('sidebar', [
            'template' => 'layouts/sidebar',
            'areas' => ['header', 'main', 'sidebar', 'footer'],
            'responsive' => true,
        ]);

        $this->registerLayout('landing', [
            'template' => 'layouts/landing',
            'areas' => ['hero', 'main', 'footer'],
            'responsive' => true,
        ]);
    }
}
```

### Layout Class
```php
<?php
namespace Jankx\Gutenberg\Layout;

class Layout
{
    private $name;
    private $config;
    private $templateRenderer;

    public function __construct(string $name, array $config)
    {
        $this->name = $name;
        $this->config = $config;
        $this->templateRenderer = new TemplateRenderer();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function getAreas(): array
    {
        return $this->config['areas'] ?? [];
    }

    public function isResponsive(): bool
    {
        return $this->config['responsive'] ?? false;
    }

    public function render(array $data = []): string
    {
        $template = $this->config['template'] ?? "layouts/{$this->name}";

        $renderData = array_merge($data, [
            'layout' => $this,
            'areas' => $this->getAreas(),
            'responsive' => $this->isResponsive(),
        ]);

        return $this->templateRenderer->render($template, $renderData);
    }

    public function renderArea(string $areaName, array $data = []): string
    {
        $areaRenderer = new AreaRenderer();
        return $areaRenderer->render($areaName, $data);
    }
}
```

## 🎨 Layout Templates

### Default Layout Template
```html
<!-- templates/layouts/default.html -->
<!DOCTYPE html>
<html lang="{{ language }}">
<head>
    <meta charset="{{ charset }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    {{ head }}
</head>
<body class="jankx-layout jankx-layout-{{ layout.name }}">
    <div class="jankx-layout-wrapper">
        <!-- Header Area -->
        <header class="jankx-layout-header">
            {{ renderArea('header') }}
        </header>

        <!-- Main Content Area -->
        <main class="jankx-layout-main">
            <div class="jankx-layout-container">
                {{ renderArea('main') }}
            </div>
        </main>

        <!-- Footer Area -->
        <footer class="jankx-layout-footer">
            {{ renderArea('footer') }}
        </footer>
    </div>

    {{ footer }}
</body>
</html>
```

### Sidebar Layout Template
```html
<!-- templates/layouts/sidebar.html -->
<!DOCTYPE html>
<html lang="{{ language }}">
<head>
    <meta charset="{{ charset }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    {{ head }}
</head>
<body class="jankx-layout jankx-layout-{{ layout.name }}">
    <div class="jankx-layout-wrapper">
        <!-- Header Area -->
        <header class="jankx-layout-header">
            {{ renderArea('header') }}
        </header>

        <!-- Main Content Area -->
        <main class="jankx-layout-main">
            <div class="jankx-layout-container">
                <div class="jankx-layout-content">
                    <!-- Main Content -->
                    <div class="jankx-layout-primary">
                        {{ renderArea('main') }}
                    </div>

                    <!-- Sidebar -->
                    <aside class="jankx-layout-sidebar">
                        {{ renderArea('sidebar') }}
                    </aside>
                </div>
            </div>
        </main>

        <!-- Footer Area -->
        <footer class="jankx-layout-footer">
            {{ renderArea('footer') }}
        </footer>
    </div>

    {{ footer }}
</body>
</html>
```

### Landing Layout Template
```html
<!-- templates/layouts/landing.html -->
<!DOCTYPE html>
<html lang="{{ language }}">
<head>
    <meta charset="{{ charset }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    {{ head }}
</head>
<body class="jankx-layout jankx-layout-{{ layout.name }}">
    <div class="jankx-layout-wrapper">
        <!-- Hero Area -->
        <section class="jankx-layout-hero">
            {{ renderArea('hero') }}
        </section>

        <!-- Main Content Area -->
        <main class="jankx-layout-main">
            <div class="jankx-layout-container">
                {{ renderArea('main') }}
            </div>
        </main>

        <!-- Footer Area -->
        <footer class="jankx-layout-footer">
            {{ renderArea('footer') }}
        </footer>
    </div>

    {{ footer }}
</body>
</html>
```

## 🎯 Area Renderer

### Area Renderer Implementation
```php
<?php
namespace Jankx\Gutenberg\Layout;

class AreaRenderer
{
    private $areas = [];
    private $blockRenderer;

    public function __construct()
    {
        $this->blockRenderer = new BlockRenderer();
        $this->registerDefaultAreas();
    }

    public function registerArea(string $name, callable $renderer): void
    {
        $this->areas[$name] = $renderer;
    }

    public function render(string $areaName, array $data = []): string
    {
        if (!isset($this->areas[$areaName])) {
            return $this->renderDefaultArea($areaName, $data);
        }

        return $this->areas[$areaName]($data);
    }

    private function renderDefaultArea(string $areaName, array $data = []): string
    {
        switch ($areaName) {
            case 'header':
                return $this->renderHeader($data);
            case 'main':
                return $this->renderMain($data);
            case 'sidebar':
                return $this->renderSidebar($data);
            case 'footer':
                return $this->renderFooter($data);
            case 'hero':
                return $this->renderHero($data);
            default:
                return $this->renderGenericArea($areaName, $data);
        }
    }

    private function renderHeader(array $data = []): string
    {
        $templateRenderer = new TemplateRenderer();

        return $templateRenderer->render('areas/header', array_merge($data, [
            'site_title' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'navigation' => $this->getNavigation(),
        ]));
    }

    private function renderMain(array $data = []): string
    {
        if (have_posts()) {
            ob_start();
            while (have_posts()) {
                the_post();
                get_template_part('template-parts/content', get_post_type());
            }
            return ob_get_clean();
        }

        return $this->renderNoContent();
    }

    private function renderSidebar(array $data = []): string
    {
        ob_start();
        get_sidebar();
        return ob_get_clean();
    }

    private function renderFooter(array $data = []): string
    {
        $templateRenderer = new TemplateRenderer();

        return $templateRenderer->render('areas/footer', array_merge($data, [
            'site_title' => get_bloginfo('name'),
            'current_year' => date('Y'),
        ]));
    }

    private function renderHero(array $data = []): string
    {
        $templateRenderer = new TemplateRenderer();

        return $templateRenderer->render('areas/hero', array_merge($data, [
            'title' => get_the_title(),
            'description' => get_the_excerpt(),
            'featured_image' => get_the_post_thumbnail_url(),
        ]));
    }

    private function renderGenericArea(string $areaName, array $data = []): string
    {
        $templateRenderer = new TemplateRenderer();

        return $templateRenderer->render("areas/{$areaName}", $data);
    }

    private function getNavigation(): array
    {
        $menu = wp_get_nav_menu_items('primary');

        if (!$menu) {
            return [];
        }

        return array_map(function($item) {
            return [
                'title' => $item->title,
                'url' => $item->url,
                'active' => $item->object_id == get_queried_object_id(),
            ];
        }, $menu);
    }

    private function renderNoContent(): string
    {
        $templateRenderer = new TemplateRenderer();

        return $templateRenderer->render('areas/no-content', [
            'title' => __('Nothing Found', 'jankx'),
            'description' => __('It looks like nothing was found at this location.', 'jankx'),
        ]);
    }
}
```

## 🎨 Layout CSS

### Layout Styles
```scss
// assets/css/layouts.scss
.jankx-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &-wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    &-header {
        background: var(--color-header-bg);
        border-bottom: 1px solid var(--color-border);

        .jankx-layout-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 0;
        }
    }

    &-main {
        flex: 1;
        padding: 2rem 0;

        .jankx-layout-container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 var(--container-padding);
        }
    }

    &-footer {
        background: var(--color-footer-bg);
        border-top: 1px solid var(--color-border);
        padding: 2rem 0;

        .jankx-layout-container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 var(--container-padding);
        }
    }
}

// Sidebar Layout
.jankx-layout-sidebar {
    .jankx-layout-content {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .jankx-layout-primary {
        min-width: 0; // Prevent grid overflow
    }

    .jankx-layout-sidebar {
        min-width: 0; // Prevent grid overflow
    }
}

// Landing Layout
.jankx-layout-landing {
    .jankx-layout-hero {
        background: var(--color-hero-bg);
        padding: 4rem 0;
        text-align: center;

        .jankx-layout-container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 var(--container-padding);
        }
    }
}

// Responsive Layout
@media (max-width: 768px) {
    .jankx-layout {
        &-header {
            .jankx-layout-container {
                flex-direction: column;
                gap: 1rem;
            }
        }

        &-main {
            padding: 1rem 0;
        }

        &-footer {
            padding: 1rem 0;
        }
    }
}
```

## 🔧 Layout Configuration

### Layout Configuration System
```php
class LayoutConfiguration
{
    private $config = [];

    public function loadConfig(string $layoutName): array
    {
        $configFile = get_template_directory() . "/config/layouts/{$layoutName}.php";

        if (file_exists($configFile)) {
            $this->config = require $configFile;
        }

        return $this->config;
    }

    public function getLayoutConfig(string $layoutName): array
    {
        return $this->loadConfig($layoutName);
    }

    public function getDefaultLayout(): string
    {
        return get_theme_mod('jankx_default_layout', 'default');
    }

    public function getPostLayout(int $postId): string
    {
        $layout = get_post_meta($postId, '_jankx_layout', true);

        if (!$layout) {
            return $this->getDefaultLayout();
        }

        return $layout;
    }

    public function setPostLayout(int $postId, string $layout): bool
    {
        return update_post_meta($postId, '_jankx_layout', $layout);
    }
}
```

### Layout Configuration Files
```php
// config/layouts/default.php
return [
    'name' => 'default',
    'label' => __('Default Layout', 'jankx'),
    'description' => __('Standard layout with header, main content, and footer.', 'jankx'),
    'template' => 'layouts/default',
    'areas' => ['header', 'main', 'footer'],
    'responsive' => true,
    'supports' => [
        'header' => true,
        'footer' => true,
        'sidebar' => false,
        'hero' => false,
    ],
];

// config/layouts/sidebar.php
return [
    'name' => 'sidebar',
    'label' => __('Sidebar Layout', 'jankx'),
    'description' => __('Layout with main content and sidebar.', 'jankx'),
    'template' => 'layouts/sidebar',
    'areas' => ['header', 'main', 'sidebar', 'footer'],
    'responsive' => true,
    'supports' => [
        'header' => true,
        'footer' => true,
        'sidebar' => true,
        'hero' => false,
    ],
];

// config/layouts/landing.php
return [
    'name' => 'landing',
    'label' => __('Landing Page Layout', 'jankx'),
    'description' => __('Full-width layout with hero section.', 'jankx'),
    'template' => 'layouts/landing',
    'areas' => ['hero', 'main', 'footer'],
    'responsive' => true,
    'supports' => [
        'header' => false,
        'footer' => true,
        'sidebar' => false,
        'hero' => true,
    ],
];
```

## 🎯 Layout Selection

### Layout Selection System
```php
class LayoutSelector
{
    private $configManager;

    public function __construct(LayoutConfiguration $configManager)
    {
        $this->configManager = $configManager;
    }

    public function getCurrentLayout(): string
    {
        // Check for post-specific layout
        if (is_singular()) {
            $postId = get_queried_object_id();
            return $this->configManager->getPostLayout($postId);
        }

        // Check for archive layout
        if (is_archive()) {
            return $this->getArchiveLayout();
        }

        // Check for search layout
        if (is_search()) {
            return $this->getSearchLayout();
        }

        // Check for 404 layout
        if (is_404()) {
            return $this->get404Layout();
        }

        // Return default layout
        return $this->configManager->getDefaultLayout();
    }

    private function getArchiveLayout(): string
    {
        $postType = get_post_type();

        switch ($postType) {
            case 'post':
                return get_theme_mod('jankx_archive_layout', 'sidebar');
            case 'page':
                return get_theme_mod('jankx_page_archive_layout', 'default');
            default:
                return get_theme_mod('jankx_custom_archive_layout', 'default');
        }
    }

    private function getSearchLayout(): string
    {
        return get_theme_mod('jankx_search_layout', 'sidebar');
    }

    private function get404Layout(): string
    {
        return get_theme_mod('jankx_404_layout', 'default');
    }
}
```

---

**Next**: [Frontend Rendering](./frontend-rendering.md)