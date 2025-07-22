# Jankx Gutenberg Documentation

## Overview

Thư mục này chứa tất cả tài liệu liên quan đến Jankx Gutenberg Layout System, bao gồm layout options, template system, partial hydration, và CSS framework.

## Documentation Structure

### Core System Documentation

1. **[GUTENBERG_BLOCKS.md](./GUTENBERG_BLOCKS.md)** - Tài liệu về Gutenberg Blocks System
   - Block registration và architecture
   - React components và PHP rendering
   - Testimonial block implementation
   - Adding new blocks guide

2. **[GUTENBERG_AJAX_SYSTEM.md](./GUTENBERG_AJAX_SYSTEM.md)** - Tài liệu về Gutenberg AJAX System
   - Dedicated kernel cho AJAX requests
   - Performance optimization
   - Security features
   - Integration với frontend

3. **[GUTENBERG_FRONTEND_SYSTEM.md](./GUTENBERG_FRONTEND_SYSTEM.md)** - Tài liệu về Gutenberg Frontend System
   - Post content parsing
   - Selective block registration
   - Performance optimization
   - Partial hydration integration

4. **[GUTENBERG_LAYOUT_SYSTEM.md](./GUTENBERG_LAYOUT_SYSTEM.md)** - Tài liệu tổng quan về hệ thống Gutenberg Layout
   - Architecture và core components
   - Layout Registry và Layout Manager
   - System flow và workflow
   - Usage examples và best practices

5. **[LAYOUT_OPTIONS.md](./LAYOUT_OPTIONS.md)** - Tài liệu về Layout Options System
   - Option groups và types
   - Registration và validation
   - React integration
   - Performance features

6. **[LAYOUT_TEMPLATE_SYSTEM.md](./LAYOUT_TEMPLATE_SYSTEM.md)** - Tài liệu về Layout Template System
   - Template registration và rendering
   - Block configuration
   - Template variables
   - Custom templates

7. **[PARTIAL_HYDRATION_SYSTEM.md](./PARTIAL_HYDRATION_SYSTEM.md)** - Tài liệu về Partial Hydration
   - JavaScript implementation
   - AJAX handling
   - Performance monitoring
   - Error handling

8. **[LAYOUT_OPTIONS_CSS.md](./LAYOUT_OPTIONS_CSS.md)** - Tài liệu về CSS Framework
   - Layout options styling
   - Theme system
   - Responsive design
   - Accessibility features

## Quick Start

### 1. Layout Registration
```php
// Register a layout
LayoutRegistry::registerLayout('hero-section', [
    'name' => 'Hero Section',
    'description' => 'A prominent hero section',
    'category' => 'jankx-sections',
    'attributes' => [
        'title' => ['type' => 'string', 'default' => ''],
        'description' => ['type' => 'string', 'default' => '']
    ]
]);
```

### 2. Template Registration
```php
// Register a template
Template::register('hero-section', [
    'name' => 'Hero Section',
    'template' => 'hero-section.html',
    'variables' => [
        'title' => '',
        'description' => ''
    ],
    'blocks' => [
        'hero-title' => [
            'required' => true,
            'order' => 1,
            'template' => 'blocks/hero-title.html'
        ]
    ]
]);
```

### 3. Options Registration
```php
// Register layout options
Options::register('alignment', [
    'type' => 'select',
    'label' => 'Alignment',
    'group' => 'layout',
    'default' => 'center',
    'options' => [
        'left' => 'Left',
        'center' => 'Center',
        'right' => 'Right'
    ]
]);
```

### 4. JavaScript Integration
```javascript
// Initialize partial hydration
document.addEventListener('DOMContentLoaded', function() {
    const manager = window.JankxPartialHydration.manager;
    const stats = manager.getStats();
    console.log('Loaded layouts:', stats.loaded);
});
```

## System Components

### Layout Registry
- Central registry cho tất cả layouts
- Manages layout definitions và configurations
- Supports different categories (sections, components, layouts)

### Layout Manager
- Handles registration và initialization
- Manages different loading contexts
- Provides rendering methods

### Layout Options
- Customizable options system
- Option groups và types
- Validation và React integration

### Layout Template
- Template rendering system
- Block configuration
- Custom template support

### Partial Hydration
- Lazy loading capabilities
- AJAX loading system
- Performance monitoring

### CSS Framework
- Complete styling system
- Theme variations
- Responsive design
- Accessibility features

### Gutenberg AJAX System
- Dedicated kernel cho AJAX requests
- Performance optimization
- Security features
- Real-time monitoring

### Gutenberg Frontend System
- Post content parsing
- Selective block registration
- Performance optimization
- Partial hydration integration

## Key Features

### Performance
- **Lazy Loading** - Load layouts only when visible
- **Caching** - Cache layout rendering
- **Optimization** - Minimal initial load
- **Monitoring** - Performance metrics

### Accessibility
- **Screen Reader Support** - Proper ARIA labels
- **Keyboard Navigation** - Full keyboard support
- **High Contrast Mode** - Enhanced visibility
- **Reduced Motion** - Respect user preferences

### Responsive Design
- **Mobile First** - Mobile-optimized layouts
- **Flexible Grids** - Auto-fit columns
- **Touch-friendly** - Larger touch targets
- **Breakpoints** - Responsive breakpoints

### Theme System
- **CSS Variables** - Design tokens
- **Theme Variations** - Modern, classic, minimal, playful
- **Component Styles** - Buttons, cards, alerts
- **Layout Components** - Hero, testimonial, feature grid

## Best Practices

### 1. Performance
- Use skeleton screens for better perceived performance
- Implement proper caching strategies
- Monitor and optimize load times
- Use CDN for static assets

### 2. Accessibility
- Support screen readers
- Respect reduced motion preferences
- Provide keyboard navigation
- Use semantic HTML

### 3. Mobile Optimization
- Optimize for mobile networks
- Use appropriate image sizes
- Implement touch-friendly interactions
- Test on various devices

### 4. Code Organization
- Use CSS custom properties for consistent theming
- Group related styles together
- Use semantic class names
- Maintain consistent spacing and typography

## Browser Support

### Modern Browsers
- **Intersection Observer** - Native support
- **Fetch API** - Modern AJAX requests
- **CSS Grid/Flexbox** - Layout support
- **ES6+ Features** - Modern JavaScript

### Fallback Support
- Scroll-based detection for older browsers
- XMLHttpRequest for fetch fallback
- Graceful degradation for unsupported features

## Future Enhancements

1. **Service Worker Integration** - Offline support and caching
2. **Progressive Loading** - Load critical content first
3. **Predictive Loading** - Preload based on user behavior
4. **Analytics Integration** - Track loading performance
5. **A/B Testing** - Test different loading strategies
6. **CSS-in-JS Integration** - Dynamic styling based on props
7. **Theme Builder** - Visual theme customization
8. **Animation Library** - Pre-built animations
9. **Icon System** - Scalable vector icons
10. **Design Tokens** - Automated design system

## Related Files

### PHP Files
- `includes/Jankx/Gutenberg/LayoutRegistry.php`
- `includes/Jankx/Gutenberg/LayoutManager.php`
- `includes/Jankx/Gutenberg/LayoutOptions.php`
- `includes/Jankx/Gutenberg/LayoutTemplate.php`
- `includes/Jankx/Gutenberg/AjaxHandler.php`
- `includes/Jankx/Gutenberg/BlockRegistry.php`
- `includes/Jankx/Gutenberg/Blocks/AbstractBlock.php`
- `includes/Jankx/Gutenberg/Blocks/TestimonialBlock.php`

### JavaScript Files
- `assets/js/partial-hydration.js`
- `assets/js/layout-options.js`
- `assets/gutenberg/js/editor.js`
- `assets/gutenberg/js/blocks/testimonial/index.js`

### CSS Files
- `assets/css/layout-options.css`
- `assets/css/layout-preview.css`
- `assets/css/layout-themes.css`
- `assets/css/partial-hydration.css`
- `assets/gutenberg/css/editor.css`
- `assets/gutenberg/css/frontend.css`

### Template Files
- `templates/layouts/hero-section.html`
- `templates/layouts/testimonial.html`
- `templates/layouts/feature-grid.html`
- `templates/layouts/contact-form.html`
- `templates/blocks/testimonial.html`

## Support

Để được hỗ trợ hoặc báo cáo vấn đề, vui lòng tham khảo:
- [GUTENBERG_BLOCKS.md](./GUTENBERG_BLOCKS.md) - Blocks system guide
- [GUTENBERG_AJAX_SYSTEM.md](./GUTENBERG_AJAX_SYSTEM.md) - AJAX system guide
- [GUTENBERG_FRONTEND_SYSTEM.md](./GUTENBERG_FRONTEND_SYSTEM.md) - Frontend system guide
- [GUTENBERG_LAYOUT_SYSTEM.md](./GUTENBERG_LAYOUT_SYSTEM.md) - Tài liệu tổng quan
- [LAYOUT_OPTIONS.md](./LAYOUT_OPTIONS.md) - Hướng dẫn options
- [LAYOUT_TEMPLATE_SYSTEM.md](./LAYOUT_TEMPLATE_SYSTEM.md) - Template system
- [PARTIAL_HYDRATION_SYSTEM.md](./PARTIAL_HYDRATION_SYSTEM.md) - Performance optimization
- [LAYOUT_OPTIONS_CSS.md](./LAYOUT_OPTIONS_CSS.md) - Styling guide