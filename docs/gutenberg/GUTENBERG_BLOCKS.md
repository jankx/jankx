# Jankx Gutenberg Blocks

## Overview

Jankx Gutenberg Blocks system provides a comprehensive framework for creating custom blocks in WordPress Gutenberg editor. The system includes block registration, React components, PHP rendering, and styling.

## Architecture

### Core Components

1. **BlockRegistry** - Central registry for all blocks
2. **AbstractBlock** - Base class for all blocks
3. **Block Classes** - Individual block implementations
4. **React Components** - Editor interface components
5. **PHP Templates** - Server-side rendering

### File Structure

```
assets/gutenberg/
├── js/
│   ├── editor.js                 # Main editor script
│   ├── editor.asset.php          # Asset dependencies
│   └── blocks/
│       └── testimonial/
│           ├── index.js          # React component
│           └── editor.scss       # Editor styles
├── css/
│   ├── editor.css               # Editor styles
│   └── frontend.css             # Frontend styles
├── fonts/                       # Custom fonts
└── images/                      # Block images

includes/Jankx/Gutenberg/
├── BlockRegistry.php            # Block registration
└── Blocks/
    ├── AbstractBlock.php        # Base block class
    └── TestimonialBlock.php     # Testimonial block

templates/blocks/
└── testimonial.html             # PHP template
```

## Block Registration

### BlockRegistry

The `BlockRegistry` class handles registration of blocks with WordPress:

```php
use Jankx\Gutenberg\BlockRegistry;

// Initialize in bootstrapper
BlockRegistry::boot();

// Register a block
BlockRegistry::registerBlock('jankx/testimonial', TestimonialBlock::class);
```

### Block Class Structure

Each block extends `AbstractBlock`:

```php
class TestimonialBlock extends AbstractBlock
{
    protected static $attributes = [
        'content' => [
            'type' => 'string',
            'default' => '',
        ],
        // ... more attributes
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

    public static function render($attributes, $content)
    {
        // Server-side rendering logic
    }
}
```

## React Components

### Block Editor Component

Each block has a React component for the editor:

```javascript
const TestimonialEdit = (props) => {
    const { attributes, setAttributes } = props;

    return (
        <>
            <InspectorControls>
                {/* Block settings */}
            </InspectorControls>

            <div {...blockProps}>
                {/* Block content */}
            </div>
        </>
    );
};
```

### Block Registration

Register the block with Gutenberg:

```javascript
registerBlockType('jankx/testimonial', {
    apiVersion: 2,
    title: __('Testimonial', 'jankx'),
    description: __('Display customer testimonials', 'jankx'),
    category: 'jankx-blocks',
    icon: 'format-quote',
    keywords: ['testimonial', 'quote', 'review'],
    supports: {
        align: ['wide', 'full'],
        html: false,
        anchor: true,
        customClassName: true,
        spacing: {
            margin: true,
            padding: true,
        },
        color: {
            background: true,
            text: true,
        },
    },
    attributes: {
        // Block attributes
    },
    edit: TestimonialEdit,
    save: TestimonialSave,
});
```

## Styling

### Editor Styles

Editor-specific styles are in `assets/gutenberg/css/editor.css`:

```css
.wp-block-jankx-testimonial {
    padding: 2rem;
    border-radius: 8px;
    margin: 1rem 0;
    position: relative;
    border: 2px dashed #ddd;
    background: #fafafa;
}

.wp-block-jankx-testimonial.is-selected {
    border-color: #007cba;
    background: #f0f8ff;
}
```

### Frontend Styles

Frontend styles are in `assets/gutenberg/css/frontend.css`:

```css
.jankx-testimonial {
    padding: 2rem;
    border-radius: 8px;
    margin: 1rem 0;
    position: relative;
    transition: all 0.3s ease;
}

.jankx-testimonial-style-default {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
}
```

## Testimonial Block

### Features

- **Content Management** - Rich text editor for testimonial content
- **Author Information** - Name, position, company
- **Avatar Support** - Media upload for author image
- **Rating System** - 5-star rating display
- **Style Variations** - Default, Card, Minimal, Modern
- **Alignment Options** - Left, Center, Right
- **Color Controls** - Background and text colors
- **Responsive Design** - Mobile-optimized layout

### Attributes

```php
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
```

### Style Variations

1. **Default** - Light background with border
2. **Card** - White background with shadow
3. **Minimal** - Transparent background
4. **Modern** - Gradient background

### Usage

#### In Gutenberg Editor

1. Add the Testimonial block
2. Enter testimonial content
3. Add author information
4. Upload avatar image
5. Set rating
6. Choose style and alignment
7. Customize colors

#### PHP Template

```php
// Render testimonial block
$testimonial = TestimonialBlock::render($attributes, $content);
echo $testimonial;
```

#### HTML Template

```html
<div class="jankx-testimonial jankx-testimonial-style-default">
    <div class="jankx-testimonial-content">
        <div class="jankx-testimonial-rating">
            <span class="jankx-star filled">★</span>
            <!-- ... more stars -->
        </div>

        <blockquote class="jankx-testimonial-quote">
            Testimonial content here
        </blockquote>

        <div class="jankx-testimonial-author">
            <div class="jankx-testimonial-avatar">
                <img src="avatar.jpg" alt="Author Name" />
            </div>

            <div class="jankx-testimonial-author-info">
                <div class="jankx-testimonial-author-name">Author Name</div>
                <div class="jankx-testimonial-author-meta">
                    <span class="jankx-testimonial-position">Position</span>
                    <span class="jankx-testimonial-separator">, </span>
                    <span class="jankx-testimonial-company">Company</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Adding New Blocks

### 1. Create Block Class

```php
// includes/Jankx/Gutenberg/Blocks/MyBlock.php
class MyBlock extends AbstractBlock
{
    protected static $attributes = [
        // Define attributes
    ];

    public static function getBlockName()
    {
        return 'my-block';
    }

    public static function render($attributes, $content)
    {
        // Render logic
    }
}
```

### 2. Register Block

```php
// In BlockRegistry::registerBlocks()
self::registerBlock('jankx/my-block', MyBlock::class);
```

### 3. Create React Component

```javascript
// assets/gutenberg/js/blocks/my-block/index.js
const MyBlockEdit = (props) => {
    // Editor component
};

const MyBlockSave = (props) => {
    // Save component
};

registerBlockType('jankx/my-block', {
    // Block configuration
    edit: MyBlockEdit,
    save: MyBlockSave,
});
```

### 4. Add Styles

```scss
// assets/gutenberg/js/blocks/my-block/editor.scss
.wp-block-jankx-my-block {
    // Editor styles
}
```

```css
/* assets/gutenberg/css/frontend.css */
.jankx-my-block {
    /* Frontend styles */
}
```

### 5. Create Template

```html
<!-- templates/blocks/my-block.html -->
<div class="jankx-my-block">
    <!-- Block content -->
</div>
```

## Best Practices

### 1. Block Design

- **Semantic HTML** - Use proper HTML structure
- **Accessibility** - Include ARIA labels and keyboard navigation
- **Responsive Design** - Ensure mobile compatibility
- **Performance** - Optimize for fast loading

### 2. Code Organization

- **Separation of Concerns** - Keep PHP, JS, and CSS separate
- **Reusable Components** - Create shared components
- **Consistent Naming** - Use consistent naming conventions
- **Documentation** - Document all public methods

### 3. User Experience

- **Intuitive Interface** - Make blocks easy to use
- **Visual Feedback** - Provide clear visual feedback
- **Error Handling** - Handle errors gracefully
- **Loading States** - Show loading states for async operations

### 4. Performance

- **Lazy Loading** - Load assets only when needed
- **Caching** - Cache rendered blocks
- **Minification** - Minify CSS and JS files
- **Optimization** - Optimize images and assets

## Troubleshooting

### Common Issues

1. **Block Not Appearing**
   - Check block registration in `BlockRegistry`
   - Verify React component is properly exported
   - Check browser console for JavaScript errors

2. **Styles Not Loading**
   - Verify CSS files are enqueued
   - Check file paths and permissions
   - Clear browser cache

3. **PHP Errors**
   - Check PHP error logs
   - Verify class names and namespaces
   - Test block rendering in isolation

4. **JavaScript Errors**
   - Check browser console
   - Verify dependencies are loaded
   - Test React components separately

### Debug Mode

Enable debug mode to see detailed information:

```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### Development Tools

- **WordPress Debug Bar** - Monitor queries and performance
- **React Developer Tools** - Debug React components
- **Browser DevTools** - Inspect elements and debug JavaScript

## Future Enhancements

1. **Block Patterns** - Pre-built block combinations
2. **Block Variations** - Different block styles
3. **Block Templates** - Template system for blocks
4. **Block API** - REST API for block data
5. **Block Analytics** - Usage tracking and analytics
6. **Block Marketplace** - Third-party block marketplace
7. **Block Builder** - Visual block builder
8. **Block Testing** - Automated testing framework

## Support

For support and questions:

1. **Documentation** - Check this documentation first
2. **GitHub Issues** - Report bugs and feature requests
3. **Community Forum** - Ask questions and share solutions
4. **Developer Chat** - Real-time developer support

## Related Documentation

- [Gutenberg Layout System](./GUTENBERG_LAYOUT_SYSTEM.md)
- [Layout Options](./LAYOUT_OPTIONS.md)
- [Layout Template System](./LAYOUT_TEMPLATE_SYSTEM.md)
- [Partial Hydration System](./PARTIAL_HYDRATION_SYSTEM.md)
- [Layout Options CSS](./LAYOUT_OPTIONS_CSS.md)