# Speed Optimization

> **Optimized Design-to-Website Conversion**

Jankx 2.0 được tối ưu hóa để chuyển đổi design thành website một cách hiệu quả với độ chính xác cao.

## ⚡ Performance Optimization

### Design-to-Website Conversion Goals
```
┌─────────────────────────────────────┐
│         Optimization Goals          │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Fast      │  │   Accurate  │  │
│  │ Conversion  │  │   Design    │  │
│  │  Process    │  │  Transfer   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Quality Focus               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   High      │  │   Client    │  │
│  │  Fidelity   │  │   Friendly  │  │
│  │  Design     │  │   Interface │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🚀 Optimized Conversion Pipeline

### 1. **Parallel Processing**
```php
<?php
class ParallelConverter
{
    public function convertDesign(string $fileId): Theme
    {
        $startTime = microtime(true);

        // Parallel processing for efficiency
        $promises = [
            'designData' => $this->extractDesignDataAsync($fileId),
            'assets' => $this->extractAssetsAsync($fileId),
            'components' => $this->extractComponentsAsync($fileId),
            'styles' => $this->extractStylesAsync($fileId),
        ];

        // Wait for all parallel operations
        $results = $this->waitForAll($promises);

        // Generate theme from results
        $theme = $this->generateThemeFromResults($results);

        $endTime = microtime(true);
        $duration = $endTime - $startTime;

        $this->logPerformance($duration);

        return $theme;
    }

    private function extractDesignDataAsync(string $fileId): Promise
    {
        return new Promise(function($resolve) use ($fileId) {
            // Async Figma API call
            $figmaApi = new FigmaAPI();
            $figmaApi->getFileAsync($fileId)->then(function($data) use ($resolve) {
                $resolve($this->parseDesignData($data));
            });
        });
    }

    private function extractAssetsAsync(string $fileId): Promise
    {
        return new Promise(function($resolve) use ($fileId) {
            // Async asset extraction
            $assetExtractor = new AssetExtractor();
            $assetExtractor->extractAsync($fileId)->then(function($assets) use ($resolve) {
                $resolve($this->optimizeAssets($assets));
            });
        });
    }

    private function extractComponentsAsync(string $fileId): Promise
    {
        return new Promise(function($resolve) use ($fileId) {
            // Async component extraction
            $componentExtractor = new ComponentExtractor();
            $componentExtractor->extractAsync($fileId)->then(function($components) use ($resolve) {
                $resolve($this->generateComponents($components));
            });
        });
    }

    private function extractStylesAsync(string $fileId): Promise
    {
        return new Promise(function($resolve) use ($fileId) {
            // Async style extraction
            $styleExtractor = new StyleExtractor();
            $styleExtractor->extractAsync($fileId)->then(function($styles) use ($resolve) {
                $resolve($this->generateStyles($styles));
            });
        });
    }
}
```

### 2. **Cached Design Data**
```php
<?php
class DesignCache
{
    private $cache;
    private $cacheTime = 300; // 5 minutes

    public function getCachedDesign(string $fileId): ?DesignData
    {
        $cacheKey = "design_{$fileId}";
        $cached = $this->cache->get($cacheKey);

        if ($cached && $this->isCacheValid($cached)) {
            return $cached['data'];
        }

        return null;
    }

    public function cacheDesign(string $fileId, DesignData $data): void
    {
        $cacheKey = "design_{$fileId}";
        $this->cache->set($cacheKey, [
            'data' => $data,
            'timestamp' => time(),
            'version' => $data->getVersion()
        ], $this->cacheTime);
    }

    public function invalidateCache(string $fileId): void
    {
        $cacheKey = "design_{$fileId}";
        $this->cache->delete($cacheKey);
    }

    private function isCacheValid(array $cached): bool
    {
        return (time() - $cached['timestamp']) < $this->cacheTime;
    }
}
```

### 3. **Incremental Updates**
```php
<?php
class IncrementalUpdater
{
    public function updateDesign(string $fileId, array $changes): Theme
    {
        // Only update changed components
        $updatedComponents = [];

        foreach ($changes as $change) {
            if ($change['type'] === 'component') {
                $updatedComponents[] = $this->updateComponent($change);
            } elseif ($change['type'] === 'style') {
                $this->updateStyle($change);
            } elseif ($change['type'] === 'layout') {
                $this->updateLayout($change);
            }
        }

        // Apply incremental updates
        return $this->applyUpdates($updatedComponents);
    }

    private function updateComponent(array $change): Component
    {
        $componentId = $change['id'];
        $newData = $change['data'];

        // Update only changed properties
        $component = $this->getComponent($componentId);
        $component->update($newData);

        return $component;
    }

    private function updateStyle(array $change): void
    {
        $styleId = $change['id'];
        $newStyle = $change['data'];

        // Update CSS variable
        $this->updateCSSVariable($styleId, $newStyle);
    }

    private function updateLayout(array $change): void
    {
        $layoutId = $change['id'];
        $newLayout = $change['data'];

        // Update layout structure
        $this->updateLayoutStructure($layoutId, $newLayout);
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
        this.initRealTimePreview();
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
            this.showDropZone(e);
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.hideDropZone();
            const componentData = JSON.parse(e.dataTransfer.getData('text'));
            this.addComponent(componentData, e.clientX, e.clientY);
        });

        // Make components draggable and resizable
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

## 📊 Performance Monitoring

### Conversion Tracking
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

        public function getMetrics(array $metrics): array
    {
        return [
            'design_extraction' => $metrics['design_extraction'],
            'css_generation' => $metrics['css_generation'],
            'block_creation' => $metrics['block_creation'],
            'theme_generation' => $metrics['theme_generation'],
            'deployment' => $metrics['deployment'],
            'total_time' => $metrics['total_time']
        ];
    }
}
```

---

**Jankx 2.0 cung cấp workflow tối ưu để chuyển đổi design thành website với độ chính xác cao và interface thân thiện cho clients!** 🚀