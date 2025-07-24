# Gutenberg Blocks System

> **Modern Block Development with Atomic Design**

Jankx 2.0 sử dụng kiến trúc Gutenberg-first với hệ thống block development hiện đại, tuân thủ atomic design principles và tối ưu performance.

## 🧩 Block Architecture

### Block Structure
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
│   └── templates/
│       ├── editor.html
│       └── frontend.html
├── hero/
├── features/
└── contact/
```

### Block Class Structure
```php
<?php
namespace Jankx\Gutenberg\Blocks;

class TestimonialBlock extends AbstractBlock
{
    protected static $attributes = [
        'content' => [
            'type' => 'string',
            'default' => '',
        ],
        'author' => [
            'type' => 'string',
            'default' => '',
        ],
        'position' => [
            'type' => 'string',
            'default' => '',
        ],
        'company' => [
            'type' => 'string',
            'default' => '',
        ],
        'avatar' => [
            'type' => 'object',
            'default' => null,
        ],
        'rating' => [
            'type' => 'number',
            'default' => 5,
        ],
        'style' => [
            'type' => 'string',
            'default' => 'default',
        ],
        'alignment' => [
            'type' => 'string',
            'default' => 'center',
        ],
        'showAvatar' => [
            'type' => 'boolean',
            'default' => true,
        ],
        'showRating' => [
            'type' => 'boolean',
            'default' => true,
        ],
        'backgroundColor' => [
            'type' => 'string',
            'default' => '',
        ],
        'textColor' => [
            'type' => 'string',
            'default' => '',
        ],
    ];

    protected static $supports = [
        'align' => ['wide', 'full'],
        'html' => false,
        'anchor' => true,
        'customClassName' => true,
        'spacing' => [
            'margin' => true,
            'padding' => true,
        ],
        'color' => [
            'background' => true,
            'text' => true,
        ],
    ];

    public static function getBlockName()
    {
        return 'testimonial';
    }

    public static function getTitle()
    {
        return __('Testimonial', 'jankx');
    }

    public static function getDescription()
    {
        return __('Display customer testimonials with author information and ratings.', 'jankx');
    }

    public static function getCategory()
    {
        return 'jankx-blocks';
    }

    public static function getIcon()
    {
        return 'format-quote';
    }

    public static function getKeywords()
    {
        return ['testimonial', 'quote', 'review', 'customer', 'feedback'];
    }

    public static function render($attributes, $content)
    {
        $block_id = self::getBlockId($attributes);
        $class_name = self::getClassName($attributes);

        // Get attributes with defaults
        $content = self::getAttribute($attributes, 'content', '');
        $author = self::getAttribute($attributes, 'author', '');
        $position = self::getAttribute($attributes, 'position', '');
        $company = self::getAttribute($attributes, 'company', '');
        $avatar = self::getAttribute($attributes, 'avatar', null);
        $rating = self::getAttribute($attributes, 'rating', 5);
        $style = self::getAttribute($attributes, 'style', 'default');
        $alignment = self::getAttribute($attributes, 'alignment', 'center');
        $show_avatar = self::getAttribute($attributes, 'showAvatar', true);
        $show_rating = self::getAttribute($attributes, 'showRating', true);
        $background_color = self::getAttribute($attributes, 'backgroundColor', '');
        $text_color = self::getAttribute($attributes, 'textColor', '');

        // Build inline styles
        $inline_styles = [];
        if ($background_color) {
            $inline_styles[] = "background-color: {$background_color}";
        }
        if ($text_color) {
            $inline_styles[] = "color: {$text_color}";
        }
        $style_attr = !empty($inline_styles) ? ' style="' . implode('; ', $inline_styles) . '"' : '';

        // Add style and alignment classes
        $class_name .= " jankx-testimonial-style-{$style} jankx-testimonial-align-{$alignment}";

        // Get avatar URL
        $avatar_url = '';
        if ($avatar && isset($avatar['url'])) {
            $avatar_url = $avatar['url'];
        }

        // Render testimonial
        ob_start();
        ?>
        <div id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>"<?php echo $style_attr; ?>>
            <div class="jankx-testimonial-content">
                <?php if ($show_rating && $rating > 0): ?>
                    <div class="jankx-testimonial-rating">
                        <?php for ($i = 1; $i <= 5; $i++): ?>
                            <span class="jankx-star <?php echo $i <= $rating ? 'filled' : 'empty'; ?>">★</span>
                        <?php endfor; ?>
                    </div>
                <?php endif; ?>

                <blockquote class="jankx-testimonial-quote">
                    <?php echo wp_kses_post($content); ?>
                </blockquote>

                <?php if ($author || $position || $company): ?>
                    <div class="jankx-testimonial-author">
                        <?php if ($show_avatar && $avatar_url): ?>
                            <div class="jankx-testimonial-avatar">
                                <img src="<?php echo esc_url($avatar_url); ?>" alt="<?php echo esc_attr($author); ?>" />
                            </div>
                        <?php endif; ?>

                        <div class="jankx-testimonial-author-info">
                            <?php if ($author): ?>
                                <div class="jankx-testimonial-author-name"><?php echo esc_html($author); ?></div>
                            <?php endif; ?>

                            <?php if ($position || $company): ?>
                                <div class="jankx-testimonial-author-meta">
                                    <?php if ($position): ?>
                                        <span class="jankx-testimonial-position"><?php echo esc_html($position); ?></span>
                                    <?php endif; ?>

                                    <?php if ($position && $company): ?>
                                        <span class="jankx-testimonial-separator">, </span>
                                    <?php endif; ?>

                                    <?php if ($company): ?>
                                        <span class="jankx-testimonial-company"><?php echo esc_html($company); ?></span>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
```

## 📋 Block Registration System

### JSON-Based Registration
```json
// block.json
{
    "apiVersion": 2,
    "name": "jankx/testimonial",
    "title": "Testimonial",
    "category": "jankx",
    "icon": "format-quote",
    "description": "Display customer testimonials",
    "supports": {
        "html": false,
        "align": ["wide", "full"]
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
        }
    },
    "textdomain": "jankx",
    "editorScript": "file:./assets/js/editor.js",
    "editorStyle": "file:./assets/css/editor.css",
    "style": "file:./assets/css/frontend.css"
}
```

### PHP Block Scanner
```php
class BlockRegistry
{
    private $blocks = [];

    public function scanBlocks()
    {
        $blocksDir = get_template_directory() . '/blocks/';
        $blockDirs = glob($blocksDir . '*/block.json');

        foreach ($blockDirs as $blockJson) {
            $blockData = json_decode(file_get_contents($blockJson), true);
            $this->registerBlock($blockData);
        }
    }

    public function generateGlobalConfig()
    {
        $config = [];
        foreach ($this->blocks as $block) {
            $config[$block['name']] = $block;
        }

        return $config;
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
        attributes: {
            author: { type: 'string', default: '' },
            content: { type: 'string', default: '' },
            avatar: { type: 'string', default: '' }
        }
    },
    'jankx/hero': {
        // Hero block config
    }
};
```

## 🎨 Block Development

### Abstract Block Class
```php
abstract class AbstractBlock
{
    protected $blockName;
    protected $blockPath;

    abstract public function register();
    abstract public function render($attributes, $content);

    protected function getBlockPath()
    {
        return get_template_directory() . '/blocks/' . $this->getBlockDir();
    }

    protected function getEditorScript()
    {
        return 'jankx-block-' . $this->getBlockDir() . '-editor';
    }

    protected function getFrontendScript()
    {
        return 'jankx-block-' . $this->getBlockDir() . '-frontend';
    }

    protected function renderTemplate($template, $data = [])
    {
        $templatePath = $this->getBlockPath() . '/templates/' . $template . '.html';
        return $this->renderTemplateFile($templatePath, $data);
    }
}
```

### Block Editor JavaScript
```javascript
// assets/js/editor.js
(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement } = wp.element;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, TextareaControl } = wp.components;

    registerBlockType('jankx/testimonial', {
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();

            return createElement('div', blockProps, [
                createElement(InspectorControls, {}, [
                    createElement(PanelBody, { title: 'Testimonial Settings' }, [
                        createElement(TextControl, {
                            label: 'Author',
                            value: attributes.author,
                            onChange: (author) => setAttributes({ author })
                        }),
                        createElement(TextareaControl, {
                            label: 'Content',
                            value: attributes.content,
                            onChange: (content) => setAttributes({ content })
                        })
                    ])
                ]),
                createElement('div', { className: 'testimonial-preview' }, [
                    createElement('blockquote', {}, attributes.content),
                    createElement('cite', {}, attributes.author)
                ])
            ]);
        },

        save: function(props) {
            return null; // Server-side rendering
        }
    });
})();
```

### Block Frontend JavaScript
```javascript
// assets/js/frontend.js
(function() {
    // Frontend interactions
    document.addEventListener('DOMContentLoaded', function() {
        const testimonials = document.querySelectorAll('.jankx-testimonial');

        testimonials.forEach(testimonial => {
            // Add frontend functionality
            testimonial.addEventListener('click', function() {
                // Handle testimonial interactions
            });
        });
    });
})();
```

## 🎯 Block Categories

### Core Blocks
- **Content Blocks**: Text, image, video, gallery
- **Layout Blocks**: Container, grid, columns
- **Interactive Blocks**: Forms, buttons, navigation
- **Dynamic Blocks**: Posts, comments, search

### Custom Blocks
- **Business Blocks**: Testimonials, pricing, team
- **Marketing Blocks**: CTA, newsletter, social
- **E-commerce Blocks**: Products, cart, checkout
- **Utility Blocks**: Breadcrumbs, pagination, search

## 🔧 Block Configuration

### Block Attributes
```php
protected function getBlockAttributes()
{
    return [
        'title' => [
            'type' => 'string',
            'default' => '',
        ],
        'description' => [
            'type' => 'string',
            'default' => '',
        ],
        'image' => [
            'type' => 'object',
            'default' => null,
        ],
        'alignment' => [
            'type' => 'string',
            'default' => 'left',
        ],
        'backgroundColor' => [
            'type' => 'string',
            'default' => '',
        ],
    ];
}
```

### Block Supports
```php
protected function getBlockSupports()
{
    return [
        'html' => false,
        'align' => ['wide', 'full'],
        'spacing' => [
            'margin' => true,
            'padding' => true,
        ],
        'color' => [
            'background' => true,
            'text' => true,
        ],
        'typography' => [
            'fontSize' => true,
            'lineHeight' => true,
        ],
    ];
}
```

## 🎨 Block Styling

### Editor Styles
```scss
// assets/css/editor.scss
.wp-block-jankx-testimonial {
    .testimonial-preview {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;

        blockquote {
            font-style: italic;
            margin-bottom: 15px;
        }

        cite {
            font-weight: bold;
            color: #666;
        }
    }
}
```

### Frontend Styles
```scss
// assets/css/frontend.scss
.jankx-testimonial {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 12px;
    margin: 20px 0;

    .testimonial-content {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .testimonial-author {
        display: flex;
        align-items: center;

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
        }

        .author-info {
            .author-name {
                font-weight: bold;
                margin-bottom: 5px;
            }

            .author-title {
                color: #666;
                font-size: 14px;
            }
        }
    }
}
```

## 🔄 Block Rendering

### Server-Side Rendering
```php
public function render($attributes, $content)
{
    $data = [
        'author' => $attributes['author'] ?? '',
        'content' => $attributes['content'] ?? '',
        'avatar' => $attributes['avatar'] ?? '',
        'alignment' => $attributes['alignment'] ?? 'left',
        'backgroundColor' => $attributes['backgroundColor'] ?? '',
    ];

    return $this->renderTemplate('frontend', $data);
}
```

### Template Rendering
```html
<!-- templates/frontend.html -->
<div class="jankx-testimonial" style="text-align: {{ alignment }}; background-color: {{ backgroundColor }};">
    <div class="testimonial-content">
        <blockquote>{{ content }}</blockquote>
    </div>

    <div class="testimonial-author">
        {{#if avatar}}
        <img src="{{ avatar }}" alt="{{ author }}" class="author-avatar">
        {{/if}}

        <div class="author-info">
            <div class="author-name">{{ author }}</div>
            {{#if authorTitle}}
            <div class="author-title">{{ authorTitle }}</div>
            {{/if}}
        </div>
    </div>
</div>
```

## 🚀 Performance Optimization

### Lazy Loading Blocks
```php
class LazyBlockLoader
{
    public function shouldLoadBlock($blockName)
    {
        return $this->isBlockUsed($blockName) || $this->isBlockRequested($blockName);
    }

    public function loadBlockAssets($blockName)
    {
        if ($this->shouldLoadBlock($blockName)) {
            $this->enqueueBlockAssets($blockName);
        }
    }
}
```

### Asset Optimization
```php
class BlockAssetManager
{
    public function optimizeAssets()
    {
        // Combine CSS files
        $this->combineCSS();

        // Minify JavaScript
        $this->minifyJS();

        // Optimize images
        $this->optimizeImages();

        // Generate critical CSS
        $this->generateCriticalCSS();
    }
}
```

## 🔒 Security Considerations

### Input Sanitization
```php
protected function sanitizeAttributes($attributes)
{
    return [
        'author' => sanitize_text_field($attributes['author'] ?? ''),
        'content' => wp_kses_post($attributes['content'] ?? ''),
        'avatar' => esc_url_raw($attributes['avatar'] ?? ''),
    ];
}
```

### Output Escaping
```php
protected function escapeOutput($data)
{
    return [
        'author' => esc_html($data['author']),
        'content' => wp_kses_post($data['content']),
        'avatar' => esc_url($data['avatar']),
    ];
}
```

## 🧪 Testing Blocks

### Unit Testing
```php
class TestimonialBlockTest extends TestCase
{
    public function testBlockRegistration()
    {
        $block = new TestimonialBlock();
        $block->register();

        $this->assertTrue(block_type_exists('jankx/testimonial'));
    }

    public function testBlockRendering()
    {
        $block = new TestimonialBlock();
        $attributes = ['author' => 'John Doe', 'content' => 'Great product!'];

        $output = $block->render($attributes, '');

        $this->assertStringContainsString('John Doe', $output);
        $this->assertStringContainsString('Great product!', $output);
    }
}
```

### Integration Testing
```php
class BlockIntegrationTest extends TestCase
{
    public function testBlockInEditor()
    {
        // Test block in Gutenberg editor
        $this->loginAsAdmin();
        $this->visit('/wp-admin/post-new.php');

        $this->assertSee('Testimonial');
        $this->click('Testimonial');

        $this->assertSee('Author');
        $this->assertSee('Content');
    }
}
```

## 📊 Block Analytics

### Usage Tracking
```php
class BlockAnalytics
{
    public function trackBlockUsage($blockName)
    {
        $usage = get_option('jankx_block_usage', []);
        $usage[$blockName] = ($usage[$blockName] ?? 0) + 1;
        update_option('jankx_block_usage', $usage);
    }

    public function getBlockUsage()
    {
        return get_option('jankx_block_usage', []);
    }
}
```

### Performance Monitoring
```php
class BlockPerformanceMonitor
{
    public function measureBlockRenderTime($blockName, $callback)
    {
        $start = microtime(true);
        $result = $callback();
        $end = microtime(true);

        $this->logRenderTime($blockName, $end - $start);

        return $result;
    }
}
```

---

**Next**: [Block Registration](./block-registration.md) | [Layout System](./layout-system.md) | [AJAX System](./ajax-system.md)