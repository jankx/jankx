# Jankx Layout Options CSS

## Overview

Jankx Layout Options CSS provides comprehensive styling for layout options controls, preview functionality, and theme variations in the Gutenberg editor. It ensures consistent design and user experience across all layout components.

## CSS Files Structure

### Core CSS Files

1. **`layout-options.css`** - Main styles for layout options controls
2. **`layout-preview.css`** - Preview and live preview functionality
3. **`layout-themes.css`** - Theme variations and design system
4. **`partial-hydration.css`** - Loading states and skeleton screens

## Layout Options Controls

### Container Structure

```css
.jankx-layout-options {
    background: #fff;
    border: 1px solid #e2e4e7;
    border-radius: 4px;
    margin: 16px 0;
    overflow: hidden;
}
```

### Option Groups

```css
.jankx-option-group {
    margin-bottom: 24px;
    border: 1px solid #e2e4e7;
    border-radius: 4px;
    overflow: hidden;
}

.jankx-option-group-header {
    background: #f6f7f7;
    border-bottom: 1px solid #e2e4e7;
    padding: 10px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s ease;
}
```

### Control Types

#### Select Control
```css
.jankx-select-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #8c8f94;
    border-radius: 3px;
    font-size: 13px;
    background: #fff;
    color: #1e1e1e;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.jankx-select-control:focus {
    border-color: #007cba;
    box-shadow: 0 0 0 1px #007cba;
    outline: none;
}
```

#### Range Control
```css
.jankx-range-control {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #e2e4e7;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.jankx-range-control::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #007cba;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

#### Toggle Control
```css
.jankx-toggle-control {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.jankx-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;
}

.jankx-toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

#### Color Picker
```css
.jankx-color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
}

.jankx-color-picker-input {
    width: 40px;
    height: 32px;
    border: 2px solid #e2e4e7;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    padding: 0;
}
```

#### Media Upload
```css
.jankx-media-upload {
    display: flex;
    align-items: center;
    gap: 8px;
}

.jankx-media-upload-button {
    background: #007cba;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.jankx-media-upload-preview {
    width: 60px;
    height: 40px;
    border: 1px solid #e2e4e7;
    border-radius: 3px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}
```

## Layout Preview

### Preview Container
```css
.jankx-layout-preview {
    position: relative;
    border: 2px dashed #e2e4e7;
    border-radius: 8px;
    margin: 16px 0;
    background: #f9f9f9;
    min-height: 200px;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.jankx-layout-preview:hover {
    border-color: #007cba;
    background: #f0f6fc;
}
```

### Live Preview
```css
.jankx-live-preview {
    position: relative;
    border: 2px solid #007cba;
    border-radius: 8px;
    margin: 16px 0;
    background: #fff;
    overflow: hidden;
}

.jankx-live-preview-header {
    background: #007cba;
    color: white;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
```

### Device Preview
```css
.jankx-device-preview.desktop {
    max-width: 100%;
    border: none;
}

.jankx-device-preview.tablet {
    max-width: 768px;
    border: 8px solid #333;
    border-radius: 12px;
    margin: 20px auto;
}

.jankx-device-preview.mobile {
    max-width: 375px;
    border: 8px solid #333;
    border-radius: 20px;
    margin: 20px auto;
}
```

## Theme System

### CSS Variables
```css
:root {
    /* Color Palette */
    --jankx-primary: #007cba;
    --jankx-primary-dark: #005a87;
    --jankx-primary-light: #00a0d2;
    --jankx-secondary: #6c757d;
    --jankx-success: #00a32a;
    --jankx-warning: #dba617;
    --jankx-error: #dc3232;

    /* Typography */
    --jankx-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    --jankx-font-size-base: 16px;
    --jankx-font-size-sm: 14px;
    --jankx-font-size-lg: 18px;
    --jankx-font-size-xl: 24px;
    --jankx-font-size-2xl: 32px;
    --jankx-font-size-3xl: 48px;

    /* Spacing */
    --jankx-spacing-xs: 4px;
    --jankx-spacing-sm: 8px;
    --jankx-spacing-md: 16px;
    --jankx-spacing-lg: 24px;
    --jankx-spacing-xl: 32px;
    --jankx-spacing-2xl: 48px;
    --jankx-spacing-3xl: 64px;

    /* Border Radius */
    --jankx-border-radius-sm: 4px;
    --jankx-border-radius-md: 8px;
    --jankx-border-radius-lg: 12px;
    --jankx-border-radius-xl: 16px;

    /* Shadows */
    --jankx-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --jankx-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --jankx-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --jankx-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

    /* Transitions */
    --jankx-transition-fast: 0.15s ease;
    --jankx-transition-normal: 0.3s ease;
    --jankx-transition-slow: 0.5s ease;
}
```

### Theme Variations
```css
/* Modern Theme */
.jankx-theme-modern {
    --jankx-primary: #6366f1;
    --jankx-primary-dark: #4f46e5;
    --jankx-primary-light: #818cf8;
    --jankx-border-radius-md: 12px;
    --jankx-shadow-md: 0 10px 15px rgba(99, 102, 241, 0.1);
}

/* Classic Theme */
.jankx-theme-classic {
    --jankx-primary: #1e40af;
    --jankx-primary-dark: #1e3a8a;
    --jankx-primary-light: #3b82f6;
    --jankx-border-radius-md: 4px;
    --jankx-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Minimal Theme */
.jankx-theme-minimal {
    --jankx-primary: #000000;
    --jankx-primary-dark: #000000;
    --jankx-primary-light: #666666;
    --jankx-border-radius-md: 0px;
    --jankx-shadow-md: none;
}

/* Playful Theme */
.jankx-theme-playful {
    --jankx-primary: #f59e0b;
    --jankx-primary-dark: #d97706;
    --jankx-primary-light: #fbbf24;
    --jankx-border-radius-md: 20px;
    --jankx-shadow-md: 0 10px 25px rgba(245, 158, 11, 0.2);
}
```

## Component Styles

### Buttons
```css
.jankx-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--jankx-spacing-sm) var(--jankx-spacing-lg);
    border: none;
    border-radius: var(--jankx-border-radius-md);
    font-size: var(--jankx-font-size-sm);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all var(--jankx-transition-normal);
    line-height: 1.5;
}

.jankx-btn-primary {
    background: var(--jankx-primary);
    color: white;
}

.jankx-btn-primary:hover {
    background: var(--jankx-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--jankx-shadow-lg);
}
```

### Cards
```css
.jankx-card {
    background: #fff;
    border-radius: var(--jankx-border-radius-md);
    padding: var(--jankx-spacing-lg);
    box-shadow: var(--jankx-shadow-md);
    transition: all var(--jankx-transition-normal);
}

.jankx-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--jankx-shadow-lg);
}
```

### Alerts
```css
.jankx-alert {
    padding: var(--jankx-spacing-md);
    border-radius: var(--jankx-border-radius-md);
    margin-bottom: var(--jankx-spacing-md);
    border-left: 4px solid;
}

.jankx-alert-info {
    background: rgba(0, 124, 186, 0.1);
    border-left-color: var(--jankx-info);
    color: var(--jankx-info);
}

.jankx-alert-success {
    background: rgba(0, 163, 42, 0.1);
    border-left-color: var(--jankx-success);
    color: var(--jankx-success);
}
```

## Layout Components

### Hero Section
```css
.jankx-hero {
    padding: var(--jankx-spacing-3xl) 0;
    background: linear-gradient(135deg, var(--jankx-primary) 0%, var(--jankx-primary-light) 100%);
    color: white;
    position: relative;
    overflow: hidden;
}

.jankx-hero-title {
    font-size: var(--jankx-font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--jankx-spacing-lg);
    line-height: 1.2;
}

.jankx-hero-description {
    font-size: var(--jankx-font-size-lg);
    margin-bottom: var(--jankx-spacing-xl);
    opacity: 0.9;
    line-height: 1.6;
}
```

### Testimonial
```css
.jankx-testimonial {
    padding: var(--jankx-spacing-xl) 0;
    background: #f9f9f9;
}

.jankx-testimonial-quote {
    font-size: var(--jankx-font-size-xl);
    font-style: italic;
    color: #1e1e1e;
    margin-bottom: var(--jankx-spacing-lg);
    line-height: 1.6;
}
```

### Feature Grid
```css
.jankx-feature-grid {
    padding: var(--jankx-spacing-3xl) 0;
}

.jankx-feature-item {
    text-align: center;
    padding: var(--jankx-spacing-lg);
}

.jankx-feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto var(--jankx-spacing-lg);
    background: var(--jankx-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
}
```

## Responsive Design

### Mobile Breakpoints
```css
@media (max-width: 768px) {
    .jankx-hero-variation-split {
        grid-template-columns: 1fr;
        gap: var(--jankx-spacing-lg);
    }

    .jankx-hero-title {
        font-size: var(--jankx-font-size-2xl);
    }

    .jankx-hero-description {
        font-size: var(--jankx-font-size-base);
    }

    .jankx-hero-actions {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 480px) {
    .jankx-hero {
        padding: var(--jankx-spacing-2xl) 0;
    }

    .jankx-hero-title {
        font-size: var(--jankx-font-size-xl);
    }
}
```

## Accessibility Features

### Screen Reader Support
```css
.jankx-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
    .jankx-layout-options {
        border-width: 2px;
    }

    .jankx-option-group {
        border-width: 2px;
    }

    .jankx-select-control,
    .jankx-text-control {
        border-width: 2px;
    }

    .jankx-toggle-slider {
        border: 2px solid #000;
    }

    .jankx-toggle-slider:before {
        border: 2px solid #000;
    }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    .jankx-layout-options-toggle svg,
    .jankx-option-group-toggle svg,
    .jankx-toggle-slider,
    .jankx-toggle-slider:before {
        transition: none;
    }

    .jankx-layout-placeholder {
        animation: none;
    }

    .jankx-loading-spinner {
        animation: none;
    }
}
```

## Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
    .jankx-layout-options {
        background: #1e1e1e;
        border-color: #3c434a;
    }

    .jankx-layout-options-header {
        background: #2c3338;
        border-color: #3c434a;
    }

    .jankx-option-group {
        border-color: #3c434a;
    }

    .jankx-option-group-header {
        background: #2c3338;
        border-color: #3c434a;
    }

    .jankx-option-label {
        color: #f0f0f1;
    }

    .jankx-option-description {
        color: #a7aaad;
    }

    .jankx-select-control,
    .jankx-text-control {
        background: #2c3338;
        border-color: #3c434a;
        color: #f0f0f1;
    }

    .jankx-select-control:focus,
    .jankx-text-control:focus {
        border-color: #007cba;
    }

    .jankx-range-control {
        background: #3c434a;
    }

    .jankx-toggle-slider {
        background-color: #3c434a;
    }
}
```

## Print Styles

```css
@media print {
    .jankx-layout-options {
        border: 1px solid #000;
        background: #fff;
        page-break-inside: avoid;
    }

    .jankx-layout-options-header,
    .jankx-option-group-header {
        background: #f0f0f0;
        border-color: #000;
    }

    .jankx-option-group {
        border-color: #000;
    }

    .jankx-preview-button,
    .jankx-preview-toolbar-button {
        display: none;
    }
}
```

## Usage Examples

### Basic Layout Options
```html
<div class="jankx-layout-options">
    <div class="jankx-layout-options-header">
        <h3 class="jankx-layout-options-title">Layout Options</h3>
        <button class="jankx-layout-options-toggle">
            <svg>...</svg>
        </button>
    </div>
    <div class="jankx-option-groups">
        <div class="jankx-option-group">
            <div class="jankx-option-group-header">
                <h4 class="jankx-option-group-title">Layout</h4>
                <button class="jankx-option-group-toggle">
                    <svg>...</svg>
                </button>
            </div>
            <div class="jankx-option-group-content">
                <div class="jankx-option-control">
                    <label class="jankx-option-label">Alignment</label>
                    <select class="jankx-select-control">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Theme Application
```html
<div class="jankx-hero jankx-theme-modern">
    <div class="jankx-hero-content">
        <h1 class="jankx-hero-title">Welcome to Our Site</h1>
        <p class="jankx-hero-description">Discover amazing features and services</p>
        <div class="jankx-hero-actions">
            <a href="#" class="jankx-btn jankx-btn-primary">Get Started</a>
            <a href="#" class="jankx-btn jankx-btn-secondary">Learn More</a>
        </div>
    </div>
</div>
```

## Best Practices

### 1. CSS Organization
- Use CSS custom properties for consistent theming
- Group related styles together
- Use semantic class names
- Maintain consistent spacing and typography

### 2. Performance
- Minimize CSS file size
- Use efficient selectors
- Avoid deep nesting
- Optimize for critical rendering path

### 3. Accessibility
- Ensure sufficient color contrast
- Support keyboard navigation
- Provide screen reader support
- Respect user preferences

### 4. Responsive Design
- Use mobile-first approach
- Test on various devices
- Optimize for touch interactions
- Consider network conditions

## Future Enhancements

1. **CSS-in-JS Integration** - Dynamic styling based on props
2. **Theme Builder** - Visual theme customization
3. **Animation Library** - Pre-built animations
4. **Icon System** - Scalable vector icons
5. **Design Tokens** - Automated design system