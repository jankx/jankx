# Quick Start for Designers

> **From Design to WordPress Theme in 5 Minutes**

Hướng dẫn nhanh để designers chuyển đổi HTML/Figma designs sang WordPress theme sử dụng Jankx 2.0.

## 🚀 Quick Start Guide

### Step 1: Prepare Your Design

#### Option A: From Figma
1. **Export Design Tokens**
   ```bash
   # Install Figma plugin
   npm install @jankx/figma-plugin

   # Export design tokens
   npx jankx-figma export --file-id YOUR_FIGMA_FILE_ID --token YOUR_FIGMA_TOKEN
   ```

2. **Export Components**
   ```bash
   # Export components as JSON
   npx jankx-figma components --file-id YOUR_FIGMA_FILE_ID --output components.json
   ```

#### Option B: From HTML Template
1. **Prepare HTML Structure**
   ```html
   <!-- index.html -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Your Design</title>
       <link rel="stylesheet" href="styles.css">
   </head>
   <body>
       <header class="header">
           <nav class="navigation">
               <div class="container">
                   <div class="logo">Your Logo</div>
                   <ul class="nav-menu">
                       <li><a href="#home">Home</a></li>
                       <li><a href="#about">About</a></li>
                       <li><a href="#contact">Contact</a></li>
                   </ul>
               </div>
           </nav>
       </header>

       <main class="main">
           <section class="hero">
               <div class="container">
                   <h1>Welcome to Your Site</h1>
                   <p>Your amazing content here</p>
                   <button class="button button-primary">Get Started</button>
               </div>
           </section>
       </main>

       <footer class="footer">
           <div class="container">
               <p>&copy; 2024 Your Company</p>
           </div>
       </footer>
   </body>
   </html>
   ```

### Step 2: Generate WordPress Theme

#### Using Command Line Tool
```bash
# Install Jankx Designer CLI
composer require jankx/designer-cli

# Generate theme from Figma
php jankx-designer.php convert-figma YOUR_FIGMA_FILE_ID /path/to/output

# Generate theme from HTML
php jankx-designer.php convert-html template.html /path/to/output

# Generate theme from design data
php jankx-designer.php generate-theme /path/to/design-data
```

#### Using Web Interface
1. **Upload Design Files**
   ```
   https://designer.jankx.com
   ```

2. **Configure Theme Settings**
   - Theme name
   - Color scheme
   - Typography
   - Layout options

3. **Generate Theme**
   - Click "Generate Theme"
   - Download ZIP file

### Step 3: Customize Generated Theme

#### Theme Structure
```
generated-theme/
├── style.css                 # Main stylesheet
├── functions.php             # Theme functions
├── index.php                 # Main template
├── header.php               # Header template
├── footer.php               # Footer template
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   ├── components.css  # Component styles
│   │   └── tokens.css      # Design tokens
│   ├── js/
│   │   └── main.js         # Main JavaScript
│   └── images/             # Optimized images
├── gutenberg/
│   └── blocks/             # Gutenberg blocks
├── templates/
│   ├── index.html          # Main template
│   ├── single.html         # Single post template
│   └── page.html           # Page template
└── config/
    └── theme.json          # Theme configuration
```

#### Customize Design Tokens
```scss
// assets/css/tokens/colors.scss
:root {
  // Update your brand colors
  --color-primary-500: #your-brand-color;
  --color-secondary-500: #your-secondary-color;

  // Add custom colors
  --color-accent: #your-accent-color;
  --color-highlight: #your-highlight-color;
}
```

#### Customize Components
```scss
// assets/css/components/button.scss
.jankx-button {
  // Update button styles
  &--primary {
    background-color: var(--color-primary-500);
    border-radius: var(--radius-lg);

    &:hover {
      background-color: var(--color-primary-600);
      transform: translateY(-2px);
    }
  }
}
```

### Step 4: Install and Activate

#### Local Development
```bash
# Copy theme to WordPress themes directory
cp -r generated-theme /path/to/wordpress/wp-content/themes/

# Activate theme in WordPress admin
# Or use WP-CLI
wp theme activate generated-theme
```

#### Production Deployment
```bash
# Build optimized assets
npm run build

# Deploy to production
rsync -avz generated-theme/ user@server:/path/to/wordpress/wp-content/themes/
```

## 🎨 Design Best Practices

### Figma Design Guidelines

#### 1. **Organize Design Tokens**
```
Design System/
├── Colors/
│   ├── Primary
│   ├── Secondary
│   └── Semantic
├── Typography/
│   ├── Headings
│   ├── Body
│   └── Captions
├── Spacing/
│   ├── 4px
│   ├── 8px
│   └── 16px
└── Components/
    ├── Buttons
    ├── Cards
    └── Forms
```

#### 2. **Use Consistent Naming**
```
✅ Good naming:
- Button/Primary
- Button/Secondary
- Card/Default
- Card/Elevated

❌ Bad naming:
- Button 1
- Button 2
- Card 1
- Card 2
```

#### 3. **Create Component Variants**
```
Button/
├── Primary
├── Secondary
├── Outline
└── Ghost

Card/
├── Default
├── Elevated
├── Outlined
└── Interactive
```

### HTML Template Guidelines

#### 1. **Use Semantic HTML**
```html
<!-- ✅ Good -->
<header class="header">
  <nav class="navigation">
    <ul class="nav-menu">
      <li><a href="#home">Home</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ Bad -->
<div class="header">
  <div class="navigation">
    <div class="nav-menu">
      <div><a href="#home">Home</a></div>
    </div>
  </div>
</div>
```

#### 2. **Use BEM Methodology**
```html
<!-- ✅ Good -->
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Card Title</h2>
  </div>
  <div class="card__body">
    <p class="card__content">Card content</p>
  </div>
  <div class="card__footer">
    <button class="card__button card__button--primary">Action</button>
  </div>
</div>

<!-- ❌ Bad -->
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Card Title</h2>
  </div>
  <div class="card-body">
    <p class="card-content">Card content</p>
  </div>
  <div class="card-footer">
    <button class="card-button-primary">Action</button>
  </div>
</div>
```

#### 3. **Use CSS Custom Properties**
```css
/* ✅ Good */
:root {
  --color-primary: #3b82f6;
  --spacing-base: 1rem;
  --font-family: 'Inter', sans-serif;
}

.button {
  background-color: var(--color-primary);
  padding: var(--spacing-base);
  font-family: var(--font-family);
}

/* ❌ Bad */
.button {
  background-color: #3b82f6;
  padding: 1rem;
  font-family: 'Inter', sans-serif;
}
```

## 🔧 Advanced Customization

### Custom Gutenberg Blocks

#### 1. **Create Custom Block**
```php
// gutenberg/blocks/custom-hero/block.json
{
  "apiVersion": 2,
  "name": "jankx/custom-hero",
  "title": "Custom Hero",
  "category": "jankx",
  "icon": "align-wide",
  "attributes": {
    "title": {
      "type": "string",
      "default": "Welcome to Our Site"
    },
    "description": {
      "type": "string",
      "default": "Your amazing description here"
    },
    "buttonText": {
      "type": "string",
      "default": "Get Started"
    },
    "buttonUrl": {
      "type": "string",
      "default": "#"
    },
    "backgroundImage": {
      "type": "string"
    }
  },
  "supports": {
    "html": false,
    "anchor": true
  },
  "textdomain": "jankx",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

#### 2. **Block Template**
```html
<!-- gutenberg/blocks/custom-hero/custom-hero.html -->
<div class="jankx-block jankx-block-custom-hero">
  <div class="jankx-hero">
    <div class="jankx-hero__background" style="background-image: url('{{ backgroundImage }}')"></div>
    <div class="jankx-hero__content">
      <div class="jankx-container">
        <h1 class="jankx-hero__title">{{ title }}</h1>
        <p class="jankx-hero__description">{{ description }}</p>
        <a href="{{ buttonUrl }}" class="jankx-button jankx-button--primary">
          {{ buttonText }}
        </a>
      </div>
    </div>
  </div>
</div>
```

#### 3. **Block Styles**
```scss
// gutenberg/blocks/custom-hero/style.scss
.jankx-block-custom-hero {
  .jankx-hero {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    background-color: var(--color-primary-600);
    color: var(--color-white);

    &__background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.1;
    }

    &__content {
      position: relative;
      z-index: 1;
      width: 100%;
    }

    &__title {
      font-size: var(--font-size-5xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--spacing-6);
      line-height: var(--line-height-tight);
    }

    &__description {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-8);
      opacity: 0.9;
    }
  }
}
```

### Custom Layout Templates

#### 1. **Create Custom Layout**
```php
// functions.php
function jankx_register_custom_layout() {
    register_block_pattern(
        'jankx/custom-layout',
        array(
            'title' => __('Custom Layout', 'jankx'),
            'description' => __('A custom layout pattern', 'jankx'),
            'categories' => array('jankx-layouts'),
            'content' => '<!-- wp:group {"className":"jankx-custom-layout"} -->
<div class="wp-block-group jankx-custom-layout">
    <!-- wp:columns -->
    <div class="wp-block-columns">
        <!-- wp:column {"width":"66.66%"} -->
        <div class="wp-block-column" style="flex-basis:66.66%">
            <!-- wp:post-content /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"33.33%"} -->
        <div class="wp-block-column" style="flex-basis:33.33%">
            <!-- wp:sidebar /-->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->',
        )
    );
}
add_action('init', 'jankx_register_custom_layout');
```

#### 2. **Layout Styles**
```scss
// assets/css/layouts/custom-layout.scss
.jankx-custom-layout {
  .wp-block-columns {
    gap: var(--spacing-8);

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .wp-block-column {
    &:first-child {
      // Main content area
    }

    &:last-child {
      // Sidebar area
      background-color: var(--color-gray-50);
      padding: var(--spacing-6);
      border-radius: var(--radius-lg);
    }
  }
}
```

## 🚀 Performance Optimization

### 1. **Optimize Images**
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin assets/images/* --out-dir=assets/images/optimized
```

### 2. **Minify Assets**
```bash
# Install minification tools
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o assets/css/main.min.css assets/css/main.css

# Minify JS
uglifyjs assets/js/main.js -o assets/js/main.min.js
```

### 3. **Enable Caching**
```php
// functions.php
function jankx_enable_caching() {
    // Add cache headers
    header('Cache-Control: public, max-age=31536000');
    header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));
}
add_action('send_headers', 'jankx_enable_caching');
```

## 🎯 Testing Your Theme

### 1. **Visual Testing**
```bash
# Install visual testing tools
npm install -g backstopjs

# Run visual regression tests
backstop test
```

### 2. **Performance Testing**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test performance
lighthouse https://your-site.com --output=html --output-path=./lighthouse.html
```

### 3. **Accessibility Testing**
```bash
# Install axe-core
npm install -g axe-core

# Test accessibility
axe https://your-site.com
```

## 📚 Resources

### Documentation
- [Jankx 2.0 Documentation](../README.md)
- [Design System](./design-system.md)
- [Component Library](./component-library.md)

### Tools
- [Figma Plugin](https://figma.com/community/plugin/jankx-designer)
- [Designer CLI](https://github.com/jankx/designer-cli)
- [Storybook](https://storybook.js.org/)

### Community
- [Jankx Discord](https://discord.gg/jankx)
- [Designer Forum](https://forum.jankx.com/designers)
- [Showcase Gallery](https://showcase.jankx.com)

---

**Next**: [Design System](./design-system.md) | [Component Library](./component-library.md)