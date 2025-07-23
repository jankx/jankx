# Design System

> **Consistent Design Language & Component Library**

Jankx 2.0 cung cấp design system hoàn chỉnh với component library, design tokens và design-to-code workflow.

## 🎨 Design System Architecture

### Design System Structure
```
┌─────────────────────────────────────┐
│         Design System              │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Design    │  │   Component │  │
│  │   Tokens    │  │   Library   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Design Tools               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Figma     │  │   Storybook │  │
│  │   Plugin    │  │   Integration│  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Code Generation            │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   CSS       │  │   Gutenberg │  │
│  │   Variables │  │   Blocks    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🎯 Design Tokens

### Color System
```scss
// assets/css/design-tokens/colors.scss
:root {
  // Primary Colors
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  // Secondary Colors
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-200: #e2e8f0;
  --color-secondary-300: #cbd5e1;
  --color-secondary-400: #94a3b8;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;

  // Semantic Colors
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  // Neutral Colors
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}
```

### Typography System
```scss
// assets/css/design-tokens/typography.scss
:root {
  // Font Families
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-serif: 'Georgia', 'Times New Roman', serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  // Font Sizes
  --font-size-xs: 0.75rem;    // 12px
  --font-size-sm: 0.875rem;   // 14px
  --font-size-base: 1rem;     // 16px
  --font-size-lg: 1.125rem;   // 18px
  --font-size-xl: 1.25rem;    // 20px
  --font-size-2xl: 1.5rem;    // 24px
  --font-size-3xl: 1.875rem;  // 30px
  --font-size-4xl: 2.25rem;   // 36px
  --font-size-5xl: 3rem;      // 48px
  --font-size-6xl: 3.75rem;   // 60px

  // Font Weights
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  // Line Heights
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  // Letter Spacing
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

### Spacing System
```scss
// assets/css/design-tokens/spacing.scss
:root {
  // Spacing Scale
  --spacing-0: 0;
  --spacing-1: 0.25rem;   // 4px
  --spacing-2: 0.5rem;    // 8px
  --spacing-3: 0.75rem;   // 12px
  --spacing-4: 1rem;      // 16px
  --spacing-5: 1.25rem;   // 20px
  --spacing-6: 1.5rem;    // 24px
  --spacing-8: 2rem;      // 32px
  --spacing-10: 2.5rem;   // 40px
  --spacing-12: 3rem;     // 48px
  --spacing-16: 4rem;     // 64px
  --spacing-20: 5rem;     // 80px
  --spacing-24: 6rem;     // 96px
  --spacing-32: 8rem;     // 128px
  --spacing-40: 10rem;    // 160px
  --spacing-48: 12rem;    // 192px
  --spacing-56: 14rem;    // 224px
  --spacing-64: 16rem;    // 256px

  // Container Max Widths
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  // Border Radius
  --radius-none: 0;
  --radius-sm: 0.125rem;   // 2px
  --radius-base: 0.25rem;  // 4px
  --radius-md: 0.375rem;   // 6px
  --radius-lg: 0.5rem;     // 8px
  --radius-xl: 0.75rem;    // 12px
  --radius-2xl: 1rem;      // 16px
  --radius-3xl: 1.5rem;    // 24px
  --radius-full: 9999px;

  // Shadows
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

## 🧩 Component Library

### Button Component
```scss
// assets/css/components/button.scss
.jankx-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Variants
  &--primary {
    background-color: var(--color-primary-600);
    color: var(--color-white);

    &:hover {
      background-color: var(--color-primary-700);
    }

    &:active {
      background-color: var(--color-primary-800);
    }
  }

  &--secondary {
    background-color: var(--color-white);
    color: var(--color-gray-700);
    border-color: var(--color-gray-300);

    &:hover {
      background-color: var(--color-gray-50);
      border-color: var(--color-gray-400);
    }
  }

  &--outline {
    background-color: transparent;
    color: var(--color-primary-600);
    border-color: var(--color-primary-600);

    &:hover {
      background-color: var(--color-primary-50);
    }
  }

  // Sizes
  &--sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-sm);
  }

  &--lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  // States
  &--loading {
    position: relative;
    color: transparent;

    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Card Component
```scss
// assets/css/components/card.scss
.jankx-card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: var(--shadow-lg);
  }

  // Card Header
  &__header {
    padding: var(--spacing-6);
    border-bottom: 1px solid var(--color-gray-200);
  }

  &__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray-900);
    margin: 0 0 var(--spacing-2) 0;
  }

  &__subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-gray-600);
    margin: 0;
  }

  // Card Body
  &__body {
    padding: var(--spacing-6);
  }

  &__content {
    color: var(--color-gray-700);
    line-height: var(--line-height-relaxed);
  }

  // Card Footer
  &__footer {
    padding: var(--spacing-6);
    border-top: 1px solid var(--color-gray-200);
    background-color: var(--color-gray-50);
  }

  // Card Actions
  &__actions {
    display: flex;
    gap: var(--spacing-3);
    justify-content: flex-end;
  }

  // Variants
  &--elevated {
    box-shadow: var(--shadow-lg);
  }

  &--outlined {
    box-shadow: none;
    border: 1px solid var(--color-gray-200);
  }

  &--interactive {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
```

### Form Components
```scss
// assets/css/components/form.scss
.jankx-form {
  &__group {
    margin-bottom: var(--spacing-4);
  }

  &__label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-700);
    margin-bottom: var(--spacing-2);
  }

  &__input {
    width: 100%;
    padding: var(--spacing-3);
    font-size: var(--font-size-base);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    background-color: var(--color-white);
    transition: border-color 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }

    &:invalid {
      border-color: var(--color-error);
    }

    &::placeholder {
      color: var(--color-gray-400);
    }
  }

  &__textarea {
    @extend .jankx-form__input;
    resize: vertical;
    min-height: 100px;
  }

  &__select {
    @extend .jankx-form__input;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--spacing-2) center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: var(--spacing-10);
    appearance: none;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);

    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      border: 1px solid var(--color-gray-300);
      border-radius: var(--radius-sm);
      background-color: var(--color-white);

      &:checked {
        background-color: var(--color-primary-600);
        border-color: var(--color-primary-600);
      }
    }
  }

  &__radio {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);

    input[type="radio"] {
      width: 1rem;
      height: 1rem;
      border: 1px solid var(--color-gray-300);
      border-radius: 50%;
      background-color: var(--color-white);

      &:checked {
        background-color: var(--color-primary-600);
        border-color: var(--color-primary-600);
      }
    }
  }

  &__error {
    font-size: var(--font-size-sm);
    color: var(--color-error);
    margin-top: var(--spacing-1);
  }

  &__help {
    font-size: var(--font-size-sm);
    color: var(--color-gray-600);
    margin-top: var(--spacing-1);
  }
}
```

## 🎨 Design Token Generator

### Design Token Generator Implementation
```php
<?php
namespace Jankx\Designer\Generator;

class DesignTokenGenerator
{
    private $designData;
    private $outputPath;

    public function __construct(DesignData $designData, string $outputPath)
    {
        $this->designData = $designData;
        $this->outputPath = $outputPath;
    }

    public function generateTokens(): void
    {
        $this->generateColorTokens();
        $this->generateTypographyTokens();
        $this->generateSpacingTokens();
        $this->generateComponentTokens();
    }

    private function generateColorTokens(): void
    {
        $colors = $this->designData->getColors();
        $scss = ":root {\n";

        foreach ($colors as $name => $color) {
            $scss .= "  --color-{$name}: {$color['value']};\n";
        }

        $scss .= "}\n";

        file_put_contents($this->outputPath . '/assets/css/tokens/colors.scss', $scss);
    }

    private function generateTypographyTokens(): void
    {
        $typography = $this->designData->getTypography();
        $scss = ":root {\n";

        foreach ($typography as $name => $font) {
            $scss .= "  --font-{$name}-family: {$font['font_family']};\n";
            $scss .= "  --font-{$name}-size: {$font['font_size']}px;\n";
            $scss .= "  --font-{$name}-weight: {$font['font_weight']};\n";
            $scss .= "  --font-{$name}-line-height: {$font['line_height']}px;\n";
        }

        $scss .= "}\n";

        file_put_contents($this->outputPath . '/assets/css/tokens/typography.scss', $scss);
    }

    private function generateSpacingTokens(): void
    {
        $spacing = $this->designData->getSpacing();
        $scss = ":root {\n";

        foreach ($spacing as $name => $space) {
            $scss .= "  --spacing-{$name}: {$space['value']};\n";
        }

        $scss .= "}\n";

        file_put_contents($this->outputPath . '/assets/css/tokens/spacing.scss', $scss);
    }

    private function generateComponentTokens(): void
    {
        $components = $this->designData->getComponents();
        $scss = "";

        foreach ($components as $name => $component) {
            $scss .= $this->generateComponentCSS($name, $component);
        }

        file_put_contents($this->outputPath . '/assets/css/components.scss', $scss);
    }

    private function generateComponentCSS(string $name, array $component): string
    {
        $css = ".jankx-{$name} {\n";

        if (isset($component['styles'])) {
            foreach ($component['styles'] as $property => $value) {
                $css .= "  {$property}: {$value};\n";
            }
        }

        $css .= "}\n\n";

        return $css;
    }
}
```

## 🎯 Storybook Integration

### Storybook Configuration
```javascript
// .storybook/main.js
module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-designs'
  ],
  framework: {
    name: '@storybook/html-webpack5',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};
```

### Component Story Example
```javascript
// stories/Button.stories.js
export default {
  title: 'Components/Button',
  component: 'jankx-button',
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: 'Button variant'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state'
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state'
    }
  }
};

export const Primary = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    children: 'Primary Button'
  }
};

export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'md',
    disabled: false,
    loading: false,
    children: 'Secondary Button'
  }
};

export const Outline = {
  args: {
    variant: 'outline',
    size: 'md',
    disabled: false,
    loading: false,
    children: 'Outline Button'
  }
};

export const Small = {
  args: {
    variant: 'primary',
    size: 'sm',
    disabled: false,
    loading: false,
    children: 'Small Button'
  }
};

export const Large = {
  args: {
    variant: 'primary',
    size: 'lg',
    disabled: false,
    loading: false,
    children: 'Large Button'
  }
};

export const Disabled = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    loading: false,
    children: 'Disabled Button'
  }
};

export const Loading = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: true,
    children: 'Loading Button'
  }
};
```

## 🎨 Figma Plugin Integration

### Figma Plugin for Design Tokens
```javascript
// figma-plugin.js
figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-tokens') {
    const tokens = await extractDesignTokens();
    figma.ui.postMessage({
      type: 'design-tokens',
      tokens: tokens
    });
  }
};

async function extractDesignTokens() {
  const colors = await extractColorTokens();
  const typography = await extractTypographyTokens();
  const spacing = await extractSpacingTokens();

  return {
    colors,
    typography,
    spacing
  };
}

async function extractColorTokens() {
  const styles = figma.getLocalPaintStyles();
  return styles
    .filter(style => style.paints.length > 0)
    .map(style => ({
      name: style.name,
      value: style.paints[0].color,
      type: 'color'
    }));
}

async function extractTypographyTokens() {
  const styles = figma.getLocalTextStyles();
  return styles.map(style => ({
    name: style.name,
    font_family: style.fontName.family,
    font_size: style.fontSize,
    font_weight: style.fontName.style,
    line_height: style.lineHeight
  }));
}

async function extractSpacingTokens() {
  // Extract spacing from design tokens
  const styles = figma.getLocalPaintStyles();
  return styles
    .filter(style => style.name.includes('spacing'))
    .map(style => ({
      name: style.name,
      value: style.description,
      type: 'spacing'
    }));
}
```

---

**Next**: [Component Library](./component-library.md) | [Design Tools](./design-tools.md)