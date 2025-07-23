# Advanced Designer Workflow

> **Optimized Design-to-Website Conversion**

Jankx 2.0 được tối ưu hóa để chuyển đổi design thành website với độ chính xác cao và interface thân thiện.

## ⚡ Optimized Workflow

### 1. **Efficient Design Conversion**
```bash
# One-command conversion
npx jankx-convert figma://file/YOUR_FILE_ID --output ./theme

# Real-time sync
npx jankx-sync figma://file/YOUR_FILE_ID --watch
```

### 2. **Streamlined Theme Generation**
```php
<?php
// Efficient theme generation with high fidelity
class ThemeGenerator
{
    public function generateFromFigma(string $fileId): Theme
    {
        // 1. Extract design data
        $designData = $this->extractFigmaData($fileId);

        // 2. Generate accurate CSS
        $css = $this->generateAccurateCSS($designData);

        // 3. Create Gutenberg blocks
        $blocks = $this->createGutenbergBlocks($designData);

        // 4. Generate WordPress theme
        $theme = $this->generateWordPressTheme($css, $blocks);

        return $theme;
    }

    private function extractFigmaData(string $fileId): DesignData
    {
        $figmaApi = new FigmaAPI();
        $fileData = $figmaApi->getFile($fileId);

        return new DesignData([
            'frames' => $this->extractFrames($fileData),
            'components' => $this->extractComponents($fileData),
            'styles' => $this->extractStyles($fileData),
            'assets' => $this->extractAssets($fileData),
        ]);
    }

    private function generateAccurateCSS(DesignData $data): string
    {
        $css = ":root {\n";

        // Generate color values
        foreach ($data->getColors() as $name => $color) {
            $css .= "  --color-{$name}: {$color['value']};\n";
        }

        // Generate typography
        foreach ($data->getTypography() as $name => $font) {
            $css .= "  --font-{$name}-family: '{$font['family']}';\n";
            $css .= "  --font-{$name}-size: {$font['size']}px;\n";
            $css .= "  --font-{$name}-weight: {$font['weight']};\n";
            $css .= "  --font-{$name}-line-height: {$font['lineHeight']};\n";
        }

        // Generate spacing
        foreach ($data->getSpacing() as $name => $space) {
            $css .= "  --spacing-{$name}: {$space['value']}px;\n";
        }

        $css .= "}\n\n";

        // Generate component styles
        foreach ($data->getComponents() as $name => $component) {
            $css .= $this->generateComponentCSS($name, $component);
        }

        return $css;
    }

    private function generateComponentCSS(string $name, array $component): string
    {
        $css = ".jankx-{$name} {\n";

        // Apply styling
        if (isset($component['backgroundColor'])) {
            $css .= "  background-color: {$component['backgroundColor']};\n";
        }

        if (isset($component['borderRadius'])) {
            $css .= "  border-radius: {$component['borderRadius']}px;\n";
        }

        if (isset($component['boxShadow'])) {
            $css .= "  box-shadow: {$component['boxShadow']};\n";
        }

        if (isset($component['fontFamily'])) {
            $css .= "  font-family: {$component['fontFamily']};\n";
        }

        if (isset($component['fontSize'])) {
            $css .= "  font-size: {$component['fontSize']}px;\n";
        }

        if (isset($component['fontWeight'])) {
            $css .= "  font-weight: {$component['fontWeight']};\n";
        }

        if (isset($component['color'])) {
            $css .= "  color: {$component['color']};\n";
        }

        $css .= "}\n\n";

        return $css;
    }
}
```

## 🎯 High Fidelity Design Transfer

### 1. **Accurate Color Matching**
```php
<?php
class ColorMatcher
{
    public function matchColor(array $figmaColor): string
    {
        // Convert Figma color to CSS color
        $r = round($figmaColor['r'] * 255);
        $g = round($figmaColor['g'] * 255);
        $b = round($figmaColor['b'] * 255);
        $a = $figmaColor['a'] ?? 1;

        // Handle different color formats
        if ($a === 1) {
            return "#" . sprintf("%02x%02x%02x", $r, $g, $b);
        } else {
            return "rgba({$r}, {$g}, {$b}, {$a})";
        }
    }

    public function generateColorPalette(array $figmaColors): array
    {
        $palette = [];

        foreach ($figmaColors as $name => $color) {
            $palette[$name] = [
                'hex' => $this->matchColor($color),
                'rgb' => $this->toRGB($color),
                'hsl' => $this->toHSL($color),
                'figma_id' => $color['id'] ?? null
            ];
        }

        return $palette;
    }
}
```

### 2. **Typography Precision**
```php
<?php
class TypographyPrecision
{
    public function matchTypography(array $figmaText): array
    {
        return [
            'font-family' => $this->mapFontFamily($figmaText['fontName']['family']),
            'font-size' => $figmaText['fontSize'] . 'px',
            'font-weight' => $this->mapFontWeight($figmaText['fontName']['style']),
            'line-height' => $figmaText['lineHeightPx'] . 'px',
            'letter-spacing' => $figmaText['letterSpacing'] . 'px',
            'text-align' => $this->mapTextAlign($figmaText['textAlignHorizontal']),
            'text-decoration' => $this->mapTextDecoration($figmaText['textDecoration']),
        ];
    }

    private function mapFontFamily(string $figmaFamily): string
    {
        $fontMap = [
            'Inter' => "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            'Roboto' => "'Roboto', sans-serif",
            'Open Sans' => "'Open Sans', sans-serif",
            'Lato' => "'Lato', sans-serif",
        ];

        return $fontMap[$figmaFamily] ?? "'{$figmaFamily}', sans-serif";
    }

    private function mapFontWeight(string $figmaStyle): int
    {
        $weightMap = [
            'Thin' => 100,
            'Light' => 300,
            'Regular' => 400,
            'Medium' => 500,
            'SemiBold' => 600,
            'Bold' => 700,
            'ExtraBold' => 800,
            'Black' => 900,
        ];

        return $weightMap[$figmaStyle] ?? 400;
    }
}
```

## 🎨 Client-Friendly Interface

### 1. **Visual Page Builder**
```javascript
// assets/js/visual-builder.js
class VisualPageBuilder {
    constructor() {
        this.canvas = document.getElementById('builder-canvas');
        this.toolbar = document.getElementById('builder-toolbar');
        this.sidebar = document.getElementById('builder-sidebar');

        this.initBuilder();
        this.initDragAndDrop();
    }

    initBuilder() {
        // Initialize builder interface
        this.canvas.style.position = 'relative';
        this.canvas.style.minHeight = '100vh';
        this.canvas.style.background = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
        this.canvas.style.backgroundSize = '20px 20px';
        this.canvas.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
    }

    initDragAndDrop() {
        // Make canvas droppable
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const componentData = JSON.parse(e.dataTransfer.getData('text'));
            this.addComponent(componentData, e.clientX, e.clientY);
        });

        // Make components draggable
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('jankx-component')) {
                this.startDragging(e.target, e);
            }
        });
    }

    addComponent(componentData, x, y) {
        const component = this.createComponent(componentData);

        // Position component at drop location
        const rect = this.canvas.getBoundingClientRect();
        component.style.position = 'absolute';
        component.style.left = (x - rect.left) + 'px';
        component.style.top = (y - rect.top) + 'px';

        this.canvas.appendChild(component);
        this.selectComponent(component);
        this.saveState();
    }

    createComponent(componentData) {
        const component = document.createElement('div');
        component.className = 'jankx-component';
        component.dataset.componentId = componentData.id;
        component.dataset.componentType = componentData.type;

        // Apply styling from design
        Object.assign(component.style, componentData.styles);

        // Add content
        component.innerHTML = componentData.html;

        // Make editable
        this.makeEditable(component);

        return component;
    }

    makeEditable(component) {
        // Double-click to edit text
        component.addEventListener('dblclick', (e) => {
            if (e.target.tagName === 'P' || e.target.tagName === 'H1' || e.target.tagName === 'H2') {
                this.makeTextEditable(e.target);
            }
        });

        // Add resize handles
        this.addResizeHandles(component);

        // Add move handle
        this.addMoveHandle(component);
    }

    selectComponent(component) {
        // Remove previous selection
        document.querySelectorAll('.jankx-component--selected').forEach(el => {
            el.classList.remove('jankx-component--selected');
        });

        // Select new component
        component.classList.add('jankx-component--selected');

        // Show properties panel
        this.showProperties(component);
    }

    showProperties(component) {
        const properties = this.getComponentProperties(component);
        this.renderPropertiesPanel(properties);
    }

    getComponentProperties(component) {
        const rect = component.getBoundingClientRect();
        const styles = window.getComputedStyle(component);

        return {
            position: {
                x: parseInt(component.style.left),
                y: parseInt(component.style.top)
            },
            size: {
                width: rect.width,
                height: rect.height
            },
            style: {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                fontSize: styles.fontSize,
                fontFamily: styles.fontFamily,
                borderRadius: styles.borderRadius,
                padding: styles.padding,
                margin: styles.margin
            }
        };
    }

    renderPropertiesPanel(properties) {
        const panel = document.getElementById('properties-panel');

        panel.innerHTML = `
            <div class="jankx-properties">
                <h3>Properties</h3>

                <div class="jankx-property-group">
                    <label>Position</label>
                    <div class="jankx-property-inputs">
                        <input type="number" value="${properties.position.x}" placeholder="X" data-property="left" />
                        <input type="number" value="${properties.position.y}" placeholder="Y" data-property="top" />
                    </div>
                </div>

                <div class="jankx-property-group">
                    <label>Size</label>
                    <div class="jankx-property-inputs">
                        <input type="number" value="${properties.size.width}" placeholder="Width" data-property="width" />
                        <input type="number" value="${properties.size.height}" placeholder="Height" data-property="height" />
                    </div>
                </div>

                <div class="jankx-property-group">
                    <label>Background Color</label>
                    <input type="color" value="${this.rgbToHex(properties.style.backgroundColor)}" data-property="backgroundColor" />
                </div>

                <div class="jankx-property-group">
                    <label>Text Color</label>
                    <input type="color" value="${this.rgbToHex(properties.style.color)}" data-property="color" />
                </div>

                <div class="jankx-property-group">
                    <label>Font Size</label>
                    <input type="number" value="${parseInt(properties.style.fontSize)}" data-property="fontSize" />
                </div>

                <div class="jankx-property-group">
                    <label>Border Radius</label>
                    <input type="number" value="${parseInt(properties.style.borderRadius)}" data-property="borderRadius" />
                </div>
            </div>
        `;

        // Add event listeners
        panel.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateComponentProperty(e.target.dataset.property, e.target.value);
            });
        });
    }

    updateComponentProperty(property, value) {
        const selectedComponent = document.querySelector('.jankx-component--selected');
        if (!selectedComponent) return;

        if (property === 'left' || property === 'top') {
            selectedComponent.style[property] = value + 'px';
        } else if (property === 'width' || property === 'height') {
            selectedComponent.style[property] = value + 'px';
        } else if (property === 'backgroundColor' || property === 'color') {
            selectedComponent.style[property] = value;
        } else if (property === 'fontSize') {
            selectedComponent.style[property] = value + 'px';
        } else if (property === 'borderRadius') {
            selectedComponent.style[property] = value + 'px';
        }

        this.saveState();
    }

    saveState() {
        const state = this.getBuilderState();
        localStorage.setItem('jankx-builder-state', JSON.stringify(state));

        // Auto-save to server
        this.autoSave(state);
    }

    getBuilderState() {
        const components = [];

        document.querySelectorAll('.jankx-component').forEach(component => {
            components.push({
                id: component.dataset.componentId,
                type: component.dataset.componentType,
                position: {
                    x: parseInt(component.style.left),
                    y: parseInt(component.style.top)
                },
                size: {
                    width: component.offsetWidth,
                    height: component.offsetHeight
                },
                styles: {
                    backgroundColor: component.style.backgroundColor,
                    color: component.style.color,
                    fontSize: component.style.fontSize,
                    borderRadius: component.style.borderRadius
                },
                content: component.innerHTML
            });
        });

        return {
            components,
            timestamp: Date.now()
        };
    }

    autoSave(state) {
        fetch('/api/builder/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        }).catch(error => {
            console.error('Auto-save failed:', error);
        });
    }

    rgbToHex(rgb) {
        // Convert rgb(r, g, b) to hex
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#000000';

        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}

// Initialize visual builder
document.addEventListener('DOMContentLoaded', () => {
    new VisualPageBuilder();
});
```

### 2. **Component Library**
```javascript
// assets/js/component-library.js
class ComponentLibrary {
    constructor() {
        this.components = this.loadComponents();
        this.renderLibrary();
    }

    loadComponents() {
        return [
            {
                id: 'hero-section',
                name: 'Hero Section',
                type: 'section',
                icon: '🎯',
                html: `
                <div class='jankx-hero'>
                    <div class='jankx-hero__content'>
                        <h1 class='jankx-hero__title'>Your Title Here</h1>
                        <p class='jankx-hero__description'>Your description here</p>
                        <button class='jankx-button jankx-button--primary'>Get Started</button>
                    </div>
                </div>`,
                styles: {
                    width: '100%',
                    height: '500px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            },
            {
                id: 'text-block',
                name: 'Text Block',
                type: 'text',
                icon: '📝',
                html: '<p>Your text content here</p>',
                styles: {
                    width: '300px',
                    height: 'auto',
                    padding: '20px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '16px'
                }
            },
            {
                id: 'image-block',
                name: 'Image Block',
                type: 'image',
                icon: '🖼️',
                html: '<img src="placeholder.jpg" alt="Your image" />',
                styles: {
                    width: '300px',
                    height: '200px',
                    objectFit: 'cover'
                }
            },
            {
                id: 'button-block',
                name: 'Button',
                type: 'button',
                icon: '🔘',
                html: '<button class="jankx-button jankx-button--primary">Click Me</button>',
                styles: {
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }
            }
        ];
    }

    renderLibrary() {
        const library = document.querySelector('.jankx-component-library');

        this.components.forEach(component => {
            const item = document.createElement('div');
            item.className = 'jankx-library-item';
            item.draggable = true;
            item.dataset.componentId = component.id;

            item.innerHTML = `
                <div class='jankx-library-item__icon'>${component.icon}</div>
                <div class='jankx-library-item__name'>${component.name}</div>
            `;

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', JSON.stringify(component));
            });

            library.appendChild(item);
        });
    }
}

// Initialize component library
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLibrary();
});
```

## 📊 Conversion Tracking

### Process Monitoring
```php
<?php
class ConversionTracker
{
    public function trackConversion(): array
    {
        $startTime = microtime(true);

        // Track conversion process
        $metrics = [
            'design_extraction' => $this->trackStep('extractDesign'),
            'css_generation' => $this->trackStep('generateCSS'),
            'block_creation' => $this->trackStep('createBlocks'),
            'theme_generation' => $this->trackStep('generateTheme'),
            'deployment' => $this->trackStep('deployTheme'),
        ];

        $endTime = microtime(true);
        $metrics['total_time'] = $endTime - $startTime;

        return $metrics;
    }

    private function trackStep(string $stepName): float
    {
        $startTime = microtime(true);

        // Execute step
        $this->executeStep($stepName);

        $endTime = microtime(true);
        return $endTime - $startTime;
    }

    public function generateReport(array $metrics): string
    {
        $report = "# Conversion Report\n\n";
        $report .= "## Process Times\n";
        $report .= "- **Design Extraction**: " . number_format($metrics['design_extraction'], 2) . "s\n";
        $report .= "- **CSS Generation**: " . number_format($metrics['css_generation'], 2) . "s\n";
        $report .= "- **Block Creation**: " . number_format($metrics['block_creation'], 2) . "s\n";
        $report .= "- **Theme Generation**: " . number_format($metrics['theme_generation'], 2) . "s\n";
        $report .= "- **Deployment**: " . number_format($metrics['deployment'], 2) . "s\n";
        $report .= "- **Total Time**: " . number_format($metrics['total_time'], 2) . "s\n\n";

        return $report;
    }
}
```

---

**Jankx 2.0 cung cấp workflow tối ưu để chuyển đổi design thành website với độ chính xác cao và interface thân thiện cho clients!** 🚀