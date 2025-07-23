# Block Registration System

> **JSON-Based Block Registration with PHP Scanner**

Jankx 2.0 sử dụng hệ thống block registration hiện đại dựa trên JSON, với PHP scanner tự động và global JS config generation.

## 🏗 Registration Architecture

### Registration Flow
```
┌─────────────────────────────────────┐
│         PHP Block Scanner          │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Scan      │  │  Parse      │  │
│  │ block.json  │  │   JSON      │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Global Config Gen           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   PHP       │  │   JS        │  │
│  │  Config     │  │  Config     │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         WordPress Registration      │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  register   │  │  Enqueue    │  │
│  │ block_type  │  │  Assets     │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 📋 JSON-Based Registration

### Block JSON Structure
```json
{
    "apiVersion": 2,
    "name": "jankx/testimonial",
    "title": "Testimonial",
    "category": "jankx",
    "icon": "format-quote",
    "description": "Display customer testimonials with author information",
    "keywords": ["testimonial", "quote", "customer", "review"],
    "supports": {
        "html": false,
        "align": ["wide", "full"],
        "spacing": {
            "margin": true,
            "padding": true
        },
        "color": {
            "background": true,
            "text": true
        },
        "typography": {
            "fontSize": true,
            "lineHeight": true
        }
    },
    "attributes": {
        "author": {
            "type": "string",
            "default": ""
        },
        "content": {
            "type": "string",
            "default": ""
        },
        "avatar": {
            "type": "string",
            "default": ""
        },
        "authorTitle": {
            "type": "string",
            "default": ""
        },
        "alignment": {
            "type": "string",
            "default": "left"
        },
        "backgroundColor": {
            "type": "string",
            "default": ""
        }
    },
    "textdomain": "jankx",
    "editorScript": "file:./assets/js/editor.js",
    "editorStyle": "file:./assets/css/editor.css",
    "script": "file:./assets/js/frontend.js",
    "style": "file:./assets/css/frontend.css",
    "render_callback": "Jankx\\Gutenberg\\Blocks\\TestimonialBlock::render"
}
```

### Block Directory Structure
```
blocks/
├── testimonial/
│   ├── block.json
│   ├── TestimonialBlock.php
│   ├── assets/
│   │   ├── js/
│   │   │   ├── editor.js
│   │   │   └── frontend.js
│   │   ├── css/
│   │   │   ├── editor.css
│   │   │   └── frontend.css
│   │   └── images/
│   │       └── icon.svg
│   └── templates/
│       ├── editor.html
│       └── frontend.html
├── hero/
│   ├── block.json
│   ├── HeroBlock.php
│   └── assets/
│       ├── js/
│       ├── css/
│       └── images/
└── features/
    ├── block.json
    ├── FeaturesBlock.php
    └── assets/
        ├── js/
        ├── css/
        └── images/
```

## 🔧 PHP Block Scanner

### Block Registry Implementation
```php
<?php
namespace Jankx\Gutenberg;

class BlockRegistry
{
    private $blocks = [];
    private $globalConfig = [];
    private $scanned = false;

    public function scanBlocks(): void
    {
        if ($this->scanned) {
            return;
        }

        $blocksDir = get_template_directory() . '/blocks/';
        $blockDirs = glob($blocksDir . '*/block.json');

        foreach ($blockDirs as $blockJson) {
            $this->processBlockJson($blockJson);
        }

        $this->generateGlobalConfig();
        $this->scanned = true;
    }

    private function processBlockJson(string $blockJson): void
    {
        $blockData = json_decode(file_get_contents($blockJson), true);

        if (!$blockData) {
            error_log("Invalid JSON in block.json: {$blockJson}");
            return;
        }

        $blockName = $blockData['name'] ?? '';
        if (empty($blockName)) {
            error_log("Missing block name in: {$blockJson}");
            return;
        }

        $this->blocks[$blockName] = $blockData;
        $this->registerBlock($blockData);
    }

    private function registerBlock(array $blockData): void
    {
        $blockName = $blockData['name'];
        $blockPath = dirname($this->findBlockJson($blockName));

        $args = [
            'editor_script' => $this->getScriptHandle($blockName, 'editor'),
            'editor_style' => $this->getStyleHandle($blockName, 'editor'),
            'script' => $this->getScriptHandle($blockName, 'frontend'),
            'style' => $this->getStyleHandle($blockName, 'frontend'),
        ];

        // Add render callback if specified
        if (isset($blockData['render_callback'])) {
            $args['render_callback'] = $blockData['render_callback'];
        }

        // Register block with WordPress
        register_block_type($blockPath, $args);

        // Register assets
        $this->registerBlockAssets($blockData);
    }

    private function registerBlockAssets(array $blockData): void
    {
        $blockName = $blockData['name'];

        // Register editor script
        if (isset($blockData['editorScript'])) {
            $this->registerScript($blockName, 'editor', $blockData['editorScript']);
        }

        // Register editor style
        if (isset($blockData['editorStyle'])) {
            $this->registerStyle($blockName, 'editor', $blockData['editorStyle']);
        }

        // Register frontend script
        if (isset($blockData['script'])) {
            $this->registerScript($blockName, 'frontend', $blockData['script']);
        }

        // Register frontend style
        if (isset($blockData['style'])) {
            $this->registerStyle($blockName, 'frontend', $blockData['style']);
        }
    }

    private function registerScript(string $blockName, string $context, string $scriptPath): void
    {
        $handle = $this->getScriptHandle($blockName, $context);
        $dependencies = $this->getScriptDependencies($context);

        wp_register_script(
            $handle,
            get_theme_file_uri($scriptPath),
            $dependencies,
            JANKX_VERSION,
            true
        );
    }

    private function registerStyle(string $blockName, string $context, string $stylePath): void
    {
        $handle = $this->getStyleHandle($blockName, $context);

        wp_register_style(
            $handle,
            get_theme_file_uri($stylePath),
            [],
            JANKX_VERSION
        );
    }

    private function getScriptHandle(string $blockName, string $context): string
    {
        $sanitizedName = sanitize_title($blockName);
        return "jankx-block-{$sanitizedName}-{$context}";
    }

    private function getStyleHandle(string $blockName, string $context): string
    {
        $sanitizedName = sanitize_title($blockName);
        return "jankx-block-{$sanitizedName}-{$context}";
    }

    private function getScriptDependencies(string $context): array
    {
        $dependencies = ['wp-blocks', 'wp-element'];

        if ($context === 'editor') {
            $dependencies[] = 'wp-editor';
            $dependencies[] = 'wp-components';
        }

        return $dependencies;
    }

    private function findBlockJson(string $blockName): string
    {
        $blocksDir = get_template_directory() . '/blocks/';
        $blockDir = str_replace('jankx/', '', $blockName);
        return $blocksDir . $blockDir . '/block.json';
    }
}
```

## 🌐 Global Config Generation

### PHP Config Generator
```php
class GlobalConfigGenerator
{
    private $registry;

    public function __construct(BlockRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function generateConfig(): array
    {
        $config = [];

        foreach ($this->registry->getBlocks() as $blockName => $blockData) {
            $config[$blockName] = $this->normalizeBlockData($blockData);
        }

        return $config;
    }

    private function normalizeBlockData(array $blockData): array
    {
        return [
            'name' => $blockData['name'],
            'title' => $blockData['title'],
            'category' => $blockData['category'],
            'icon' => $blockData['icon'],
            'description' => $blockData['description'],
            'keywords' => $blockData['keywords'] ?? [],
            'supports' => $blockData['supports'] ?? [],
            'attributes' => $blockData['attributes'] ?? [],
            'textdomain' => $blockData['textdomain'] ?? 'jankx',
        ];
    }

    public function outputJSConfig(): void
    {
        $config = $this->generateConfig();
        $jsonConfig = json_encode($config, JSON_PRETTY_PRINT);

        add_action('wp_head', function() use ($jsonConfig) {
            echo "<script>window.JankxBlocks = {$jsonConfig};</script>";
        });

        add_action('admin_head', function() use ($jsonConfig) {
            echo "<script>window.JankxBlocks = {$jsonConfig};</script>";
        });
    }
}
```

### JavaScript Global Config
```javascript
// Generated global config
window.JankxBlocks = {
    'jankx/testimonial': {
        name: 'jankx/testimonial',
        title: 'Testimonial',
        category: 'jankx',
        icon: 'format-quote',
        description: 'Display customer testimonials with author information',
        keywords: ['testimonial', 'quote', 'customer', 'review'],
        supports: {
            html: false,
            align: ['wide', 'full'],
            spacing: {
                margin: true,
                padding: true
            },
            color: {
                background: true,
                text: true
            },
            typography: {
                fontSize: true,
                lineHeight: true
            }
        },
        attributes: {
            author: {
                type: 'string',
                default: ''
            },
            content: {
                type: 'string',
                default: ''
            },
            avatar: {
                type: 'string',
                default: ''
            },
            authorTitle: {
                type: 'string',
                default: ''
            },
            alignment: {
                type: 'string',
                default: 'left'
            },
            backgroundColor: {
                type: 'string',
                default: ''
            }
        },
        textdomain: 'jankx'
    },
    'jankx/hero': {
        name: 'jankx/hero',
        title: 'Hero Section',
        category: 'jankx',
        icon: 'align-wide',
        description: 'Display hero section with title, description and CTA',
        keywords: ['hero', 'banner', 'cta', 'section'],
        supports: {
            html: false,
            align: ['wide', 'full'],
            spacing: {
                margin: true,
                padding: true
            },
            color: {
                background: true,
                text: true
            }
        },
        attributes: {
            title: {
                type: 'string',
                default: ''
            },
            description: {
                type: 'string',
                default: ''
            },
            backgroundImage: {
                type: 'string',
                default: ''
            },
            ctaText: {
                type: 'string',
                default: ''
            },
            ctaUrl: {
                type: 'string',
                default: ''
            }
        },
        textdomain: 'jankx'
    }
};
```

## 🎯 Block Registration Flow

### Registration Process
```php
class BlockRegistrationManager
{
    private $registry;
    private $configGenerator;

    public function __construct(BlockRegistry $registry, GlobalConfigGenerator $configGenerator)
    {
        $this->registry = $registry;
        $this->configGenerator = $configGenerator;
    }

    public function registerAllBlocks(): void
    {
        // 1. Scan all block.json files
        $this->registry->scanBlocks();

        // 2. Generate global config
        $this->configGenerator->outputJSConfig();

        // 3. Register with WordPress
        $this->registerWithWordPress();

        // 4. Enqueue assets
        $this->enqueueBlockAssets();
    }

    private function registerWithWordPress(): void
    {
        foreach ($this->registry->getBlocks() as $blockName => $blockData) {
            $this->registerBlock($blockData);
        }
    }

    private function registerBlock(array $blockData): void
    {
        $blockName = $blockData['name'];
        $blockPath = $this->getBlockPath($blockName);

        $args = [
            'editor_script' => $this->getScriptHandle($blockName, 'editor'),
            'editor_style' => $this->getStyleHandle($blockName, 'editor'),
            'script' => $this->getScriptHandle($blockName, 'frontend'),
            'style' => $this->getStyleHandle($blockName, 'frontend'),
        ];

        if (isset($blockData['render_callback'])) {
            $args['render_callback'] = $blockData['render_callback'];
        }

        register_block_type($blockPath, $args);
    }

    private function enqueueBlockAssets(): void
    {
        add_action('wp_enqueue_scripts', function() {
            foreach ($this->registry->getBlocks() as $blockName => $blockData) {
                if ($this->isBlockUsed($blockName)) {
                    $this->enqueueBlockAssets($blockName);
                }
            }
        });
    }

    private function isBlockUsed(string $blockName): bool
    {
        global $post;

        if (!$post) {
            return false;
        }

        $content = $post->post_content;
        return strpos($content, '<!-- wp:' . $blockName) !== false;
    }

    private function enqueueBlockAssets(string $blockName): void
    {
        $sanitizedName = sanitize_title($blockName);

        // Enqueue frontend styles
        wp_enqueue_style("jankx-block-{$sanitizedName}-frontend");

        // Enqueue frontend scripts
        wp_enqueue_script("jankx-block-{$sanitizedName}-frontend");
    }
}
```

## 🔧 Block Class Integration

### Abstract Block Class
```php
<?php
namespace Jankx\Gutenberg\Blocks;

abstract class AbstractBlock
{
    protected $blockName;
    protected $blockPath;
    protected $blockData;

    public function __construct()
    {
        $this->blockName = $this->getBlockName();
        $this->blockPath = $this->getBlockPath();
        $this->blockData = $this->loadBlockData();
    }

    abstract protected function getBlockName(): string;

    abstract public function register(): void;

    abstract public function render(array $attributes, string $content): string;

    protected function getBlockPath(): string
    {
        $blockDir = str_replace('jankx/', '', $this->blockName);
        return get_template_directory() . '/blocks/' . $blockDir;
    }

    protected function loadBlockData(): array
    {
        $blockJsonPath = $this->blockPath . '/block.json';

        if (!file_exists($blockJsonPath)) {
            throw new \Exception("Block JSON not found: {$blockJsonPath}");
        }

        $blockData = json_decode(file_get_contents($blockJsonPath), true);

        if (!$blockData) {
            throw new \Exception("Invalid JSON in block.json: {$blockJsonPath}");
        }

        return $blockData;
    }

    protected function getScriptHandle(string $context): string
    {
        $sanitizedName = sanitize_title($this->blockName);
        return "jankx-block-{$sanitizedName}-{$context}";
    }

    protected function getStyleHandle(string $context): string
    {
        $sanitizedName = sanitize_title($this->blockName);
        return "jankx-block-{$sanitizedName}-{$context}";
    }

    protected function renderTemplate(string $template, array $data = []): string
    {
        $templatePath = $this->blockPath . '/templates/' . $template . '.html';

        if (!file_exists($templatePath)) {
            throw new \Exception("Template not found: {$templatePath}");
        }

        $templateContent = file_get_contents($templatePath);

        // Basic template engine
        foreach ($data as $key => $value) {
            $templateContent = str_replace('{{' . $key . '}}', $value, $templateContent);
        }

        return $templateContent;
    }
}
```

### Example Block Implementation
```php
<?php
namespace Jankx\Gutenberg\Blocks;

class TestimonialBlock extends AbstractBlock
{
    protected function getBlockName(): string
    {
        return 'jankx/testimonial';
    }

    public function register(): void
    {
        $args = [
            'editor_script' => $this->getScriptHandle('editor'),
            'editor_style' => $this->getStyleHandle('editor'),
            'script' => $this->getScriptHandle('frontend'),
            'style' => $this->getStyleHandle('frontend'),
            'render_callback' => [$this, 'render'],
        ];

        register_block_type($this->blockPath, $args);
    }

    public function render(array $attributes, string $content): string
    {
        $data = [
            'author' => $attributes['author'] ?? '',
            'content' => $attributes['content'] ?? '',
            'avatar' => $attributes['avatar'] ?? '',
            'authorTitle' => $attributes['authorTitle'] ?? '',
            'alignment' => $attributes['alignment'] ?? 'left',
            'backgroundColor' => $attributes['backgroundColor'] ?? '',
        ];

        return $this->renderTemplate('frontend', $data);
    }
}
```

## 📊 Registration Monitoring

### Block Usage Tracking
```php
class BlockUsageTracker
{
    private $usage = [];

    public function trackBlockUsage(string $blockName): void
    {
        $this->usage[$blockName] = ($this->usage[$blockName] ?? 0) + 1;
    }

    public function getBlockUsage(): array
    {
        return $this->usage;
    }

    public function getMostUsedBlocks(int $limit = 10): array
    {
        arsort($this->usage);
        return array_slice($this->usage, 0, $limit, true);
    }

    public function getUnusedBlocks(): array
    {
        $allBlocks = $this->getAllRegisteredBlocks();
        $usedBlocks = array_keys($this->usage);

        return array_diff($allBlocks, $usedBlocks);
    }

    private function getAllRegisteredBlocks(): array
    {
        $blocks = [];
        $blocksDir = get_template_directory() . '/blocks/';
        $blockDirs = glob($blocksDir . '*/block.json');

        foreach ($blockDirs as $blockJson) {
            $blockData = json_decode(file_get_contents($blockJson), true);
            if ($blockData && isset($blockData['name'])) {
                $blocks[] = $blockData['name'];
            }
        }

        return $blocks;
    }
}
```

---

**Next**: [Layout System](./layout-system.md) | [AJAX System](./ajax-system.md) | [Frontend Rendering](./frontend-rendering.md)