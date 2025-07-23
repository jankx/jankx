# Designer Workflow

> **From HTML/Figma to WordPress Theme in Minutes**

Jankx 2.0 được thiết kế đặc biệt cho designers, cho phép chuyển đổi nhanh từ HTML có sẵn và Figma designs sang WordPress theme hoàn chỉnh.

## 🎨 Designer-Centric Features

### Design-to-Code Workflow
```
┌─────────────────────────────────────┐
│         Design Input               │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Figma     │  │   HTML      │  │
│  │  Design     │  │  Template   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Jankx 2.0 Tools            │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Design    │  │   Code      │  │
│  │  Parser     │  │ Generator   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         WordPress Output            │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Gutenberg │  │   Theme     │  │
│  │   Blocks    │  │  Files      │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Design Parser

### Figma Design Parser
```php
<?php
namespace Jankx\Designer\Parser;

class FigmaDesignParser
{
    private $figmaApi;
    private $designData;

    public function __construct(string $figmaToken)
    {
        $this->figmaApi = new FigmaAPI($figmaToken);
    }

    public function parseFigmaFile(string $fileId): DesignData
    {
        $this->designData = $this->figmaApi->getFile($fileId);

        return new DesignData([
            'colors' => $this->extractColors(),
            'typography' => $this->extractTypography(),
            'components' => $this->extractComponents(),
            'layouts' => $this->extractLayouts(),
            'spacing' => $this->extractSpacing(),
        ]);
    }

    private function extractColors(): array
    {
        $colors = [];

        foreach ($this->designData['styles'] as $style) {
            if ($style['styleType'] === 'FILL') {
                $colors[$style['name']] = [
                    'value' => $style['description'],
                    'type' => 'color',
                    'figma_id' => $style['key'],
                ];
            }
        }

        return $colors;
    }

    private function extractTypography(): array
    {
        $typography = [];

        foreach ($this->designData['styles'] as $style) {
            if ($style['styleType'] === 'TEXT') {
                $typography[$style['name']] = [
                    'font_family' => $style['style']['fontFamily'],
                    'font_size' => $style['style']['fontSize'],
                    'font_weight' => $style['style']['fontWeight'],
                    'line_height' => $style['style']['lineHeightPx'],
                    'figma_id' => $style['key'],
                ];
            }
        }

        return $typography;
    }

    private function extractComponents(): array
    {
        $components = [];

        foreach ($this->designData['components'] as $component) {
            $components[$component['name']] = [
                'id' => $component['key'],
                'name' => $component['name'],
                'description' => $component['description'] ?? '',
                'properties' => $this->extractComponentProperties($component),
                'variants' => $this->extractComponentVariants($component),
            ];
        }

        return $components;
    }

    private function extractLayouts(): array
    {
        $layouts = [];

        foreach ($this->designData['pages'] as $page) {
            $layouts[$page['name']] = [
                'id' => $page['id'],
                'name' => $page['name'],
                'frames' => $this->extractFrames($page),
                'components' => $this->extractPageComponents($page),
            ];
        }

        return $layouts;
    }

    private function extractSpacing(): array
    {
        $spacing = [];

        // Extract spacing from design tokens
        foreach ($this->designData['styles'] as $style) {
            if (strpos($style['name'], 'spacing') !== false) {
                $spacing[$style['name']] = [
                    'value' => $style['description'],
                    'type' => 'spacing',
                    'figma_id' => $style['key'],
                ];
            }
        }

        return $spacing;
    }
}
```

### HTML Template Parser
```php
<?php
namespace Jankx\Designer\Parser;

class HTMLTemplateParser
{
    private $htmlContent;
    private $parsedData;

    public function parseHTMLFile(string $filePath): DesignData
    {
        $this->htmlContent = file_get_contents($filePath);

        return new DesignData([
            'colors' => $this->extractColorsFromCSS(),
            'typography' => $this->extractTypographyFromCSS(),
            'components' => $this->extractComponentsFromHTML(),
            'layouts' => $this->extractLayoutsFromHTML(),
            'assets' => $this->extractAssetsFromHTML(),
        ]);
    }

    private function extractColorsFromCSS(): array
    {
        $colors = [];

        // Extract CSS custom properties
        preg_match_all('/--([^:]+):\s*([^;]+);/', $this->htmlContent, $matches);

        for ($i = 0; $i < count($matches[1]); $i++) {
            $name = trim($matches[1][$i]);
            $value = trim($matches[2][$i]);

            if (preg_match('/^#[0-9a-fA-F]{3,6}$/', $value) ||
                preg_match('/^rgb\(/', $value) ||
                preg_match('/^hsl\(/', $value)) {
                $colors[$name] = [
                    'value' => $value,
                    'type' => 'color',
                    'source' => 'css',
                ];
            }
        }

        return $colors;
    }

    private function extractTypographyFromCSS(): array
    {
        $typography = [];

        // Extract font families
        preg_match_all('/font-family:\s*([^;]+);/', $this->htmlContent, $matches);

        foreach ($matches[1] as $fontFamily) {
            $fontFamily = trim($fontFamily);
            if (!in_array($fontFamily, $typography)) {
                $typography[] = $fontFamily;
            }
        }

        return $typography;
    }

    private function extractComponentsFromHTML(): array
    {
        $components = [];

        // Extract reusable components
        preg_match_all('/<([a-z]+)[^>]*class="([^"]*component[^"]*)"[^>]*>/i', $this->htmlContent, $matches);

        for ($i = 0; $i < count($matches[1]); $i++) {
            $tag = $matches[1][$i];
            $classes = $matches[2][$i];

            $componentName = $this->extractComponentName($classes);

            if ($componentName) {
                $components[$componentName] = [
                    'tag' => $tag,
                    'classes' => $classes,
                    'html' => $this->extractComponentHTML($componentName),
                ];
            }
        }

        return $components;
    }

    private function extractLayoutsFromHTML(): array
    {
        $layouts = [];

        // Extract layout sections
        preg_match_all('/<([a-z]+)[^>]*class="([^"]*layout[^"]*)"[^>]*>/i', $this->htmlContent, $matches);

        for ($i = 0; $i < count($matches[1]); $i++) {
            $tag = $matches[1][$i];
            $classes = $matches[2][$i];

            $layoutName = $this->extractLayoutName($classes);

            if ($layoutName) {
                $layouts[$layoutName] = [
                    'tag' => $tag,
                    'classes' => $classes,
                    'html' => $this->extractLayoutHTML($layoutName),
                ];
            }
        }

        return $layouts;
    }

    private function extractAssetsFromHTML(): array
    {
        $assets = [];

        // Extract images
        preg_match_all('/<img[^>]*src="([^"]*)"[^>]*>/i', $this->htmlContent, $matches);
        $assets['images'] = array_unique($matches[1]);

        // Extract CSS files
        preg_match_all('/<link[^>]*href="([^"]*\.css)"[^>]*>/i', $this->htmlContent, $matches);
        $assets['css'] = array_unique($matches[1]);

        // Extract JS files
        preg_match_all('/<script[^>]*src="([^"]*\.js)"[^>]*>/i', $this->htmlContent, $matches);
        $assets['js'] = array_unique($matches[1]);

        return $assets;
    }
}
```

## 🎯 Code Generator

### WordPress Theme Generator
```php
<?php
namespace Jankx\Designer\Generator;

class WordPressThemeGenerator
{
    private $designData;
    private $outputPath;

    public function __construct(DesignData $designData, string $outputPath)
    {
        $this->designData = $designData;
        $this->outputPath = $outputPath;
    }

    public function generateTheme(): void
    {
        // Generate theme structure
        $this->createThemeStructure();

        // Generate style.css
        $this->generateStyleCSS();

        // Generate functions.php
        $this->generateFunctionsPHP();

        // Generate Gutenberg blocks
        $this->generateGutenbergBlocks();

        // Generate templates
        $this->generateTemplates();

        // Generate assets
        $this->generateAssets();

        // Generate configuration
        $this->generateConfiguration();
    }

    private function createThemeStructure(): void
    {
        $directories = [
            'assets/css',
            'assets/js',
            'assets/images',
            'templates',
            'includes',
            'gutenberg/blocks',
            'config',
        ];

        foreach ($directories as $dir) {
            $path = $this->outputPath . '/' . $dir;
            if (!is_dir($path)) {
                mkdir($path, 0755, true);
            }
        }
    }

    private function generateStyleCSS(): void
    {
        $css = $this->generateThemeCSS();

        file_put_contents($this->outputPath . '/style.css', $css);
    }

    private function generateThemeCSS(): string
    {
        $css = "/*\n";
        $css .= "Theme Name: Generated Theme\n";
        $css .= "Description: Theme generated from design data\n";
        $css .= "Version: 1.0.0\n";
        $css .= "*/\n\n";

        // Add design tokens
        $css .= $this->generateDesignTokens();

        // Add component styles
        $css .= $this->generateComponentStyles();

        // Add layout styles
        $css .= $this->generateLayoutStyles();

        return $css;
    }

    private function generateDesignTokens(): string
    {
        $css = ":root {\n";

        // Add colors
        foreach ($this->designData->getColors() as $name => $color) {
            $css .= "  --color-{$name}: {$color['value']};\n";
        }

        // Add typography
        foreach ($this->designData->getTypography() as $name => $typography) {
            $css .= "  --font-{$name}-family: {$typography['font_family']};\n";
            $css .= "  --font-{$name}-size: {$typography['font_size']}px;\n";
            $css .= "  --font-{$name}-weight: {$typography['font_weight']};\n";
        }

        // Add spacing
        foreach ($this->designData->getSpacing() as $name => $spacing) {
            $css .= "  --spacing-{$name}: {$spacing['value']};\n";
        }

        $css .= "}\n\n";

        return $css;
    }

    private function generateComponentStyles(): string
    {
        $css = '';

        foreach ($this->designData->getComponents() as $name => $component) {
            $css .= ".jankx-component-{$name} {\n";

            // Add component-specific styles
            if (isset($component['styles'])) {
                foreach ($component['styles'] as $property => $value) {
                    $css .= "  {$property}: {$value};\n";
                }
            }

            $css .= "}\n\n";
        }

        return $css;
    }

    private function generateLayoutStyles(): string
    {
        $css = '';

        foreach ($this->designData->getLayouts() as $name => $layout) {
            $css .= ".jankx-layout-{$name} {\n";

            // Add layout-specific styles
            if (isset($layout['styles'])) {
                foreach ($layout['styles'] as $property => $value) {
                    $css .= "  {$property}: {$value};\n";
                }
            }

            $css .= "}\n\n";
        }

        return $css;
    }

    private function generateFunctionsPHP(): void
    {
        $php = $this->generateThemeFunctions();

        file_put_contents($this->outputPath . '/functions.php', $php);
    }

    private function generateThemeFunctions(): string
    {
        $php = "<?php\n\n";
        $php .= "// Theme functions generated from design data\n\n";

        // Add theme setup
        $php .= "function jankx_theme_setup() {\n";
        $php .= "    add_theme_support('post-thumbnails');\n";
        $php .= "    add_theme_support('title-tag');\n";
        $php .= "    add_theme_support('html5', [\n";
        $php .= "        'search-form',\n";
        $php .= "        'comment-form',\n";
        $php .= "        'comment-list',\n";
        $php .= "        'gallery',\n";
        $php .= "        'caption',\n";
        $php .= "    ]);\n";
        $php .= "}\n";
        $php .= "add_action('after_setup_theme', 'jankx_theme_setup');\n\n";

        // Add enqueue scripts
        $php .= "function jankx_enqueue_scripts() {\n";
        $php .= "    wp_enqueue_style('jankx-style', get_stylesheet_uri());\n";
        $php .= "    wp_enqueue_script('jankx-script', get_template_directory_uri() . '/assets/js/main.js', [], '1.0.0', true);\n";
        $php .= "}\n";
        $php .= "add_action('wp_enqueue_scripts', 'jankx_enqueue_scripts');\n\n";

        return $php;
    }

    private function generateGutenbergBlocks(): void
    {
        foreach ($this->designData->getComponents() as $name => $component) {
            $this->generateBlock($name, $component);
        }
    }

    private function generateBlock(string $name, array $component): void
    {
        $blockDir = $this->outputPath . "/gutenberg/blocks/{$name}";

        if (!is_dir($blockDir)) {
            mkdir($blockDir, 0755, true);
        }

        // Generate block.json
        $blockJson = $this->generateBlockJSON($name, $component);
        file_put_contents($blockDir . '/block.json', $blockJson);

        // Generate block class
        $blockClass = $this->generateBlockClass($name, $component);
        file_put_contents($blockDir . "/{$name}.php", $blockClass);

        // Generate block template
        $blockTemplate = $this->generateBlockTemplate($name, $component);
        file_put_contents($blockDir . "/{$name}.html", $blockTemplate);
    }

    private function generateBlockJSON(string $name, array $component): string
    {
        $json = [
            'apiVersion' => 2,
            'name' => "jankx/{$name}",
            'title' => ucfirst($name),
            'category' => 'jankx',
            'icon' => 'admin-generic',
            'description' => $component['description'] ?? "Generated {$name} component",
            'supports' => [
                'html' => false,
                'anchor' => true,
            ],
            'attributes' => $this->generateBlockAttributes($component),
            'textdomain' => 'jankx',
            'editorScript' => "file:./index.js",
            'editorStyle' => "file:./index.css",
            'style' => "file:./style-index.css",
        ];

        return json_encode($json, JSON_PRETTY_PRINT);
    }

    private function generateBlockAttributes(array $component): array
    {
        $attributes = [];

        if (isset($component['properties'])) {
            foreach ($component['properties'] as $prop => $config) {
                $attributes[$prop] = [
                    'type' => $config['type'] ?? 'string',
                    'default' => $config['default'] ?? '',
                ];
            }
        }

        return $attributes;
    }

    private function generateBlockClass(string $name, array $component): string
    {
        $className = ucfirst($name) . 'Block';

        $php = "<?php\n\n";
        $php .= "namespace Jankx\\Gutenberg\\Blocks;\n\n";
        $php .= "class {$className} extends \\Jankx\\Gutenberg\\Block\n";
        $php .= "{\n";
        $php .= "    protected \$name = '{$name}';\n\n";
        $php .= "    public function render(\$attributes, \$content) {\n";
        $php .= "        return \$this->renderTemplate('{$name}', \$attributes);\n";
        $php .= "    }\n";
        $php .= "}\n";

        return $php;
    }

    private function generateBlockTemplate(string $name, array $component): string
    {
        $html = "<div class=\"jankx-block jankx-block-{$name}\">\n";

        if (isset($component['html'])) {
            $html .= $component['html'];
        } else {
            $html .= "    <div class=\"jankx-block-content\">\n";
            $html .= "        {{ content }}\n";
            $html .= "    </div>\n";
        }

        $html .= "</div>";

        return $html;
    }

    private function generateTemplates(): void
    {
        $templatesDir = $this->outputPath . '/templates';

        // Generate index template
        $indexTemplate = $this->generateIndexTemplate();
        file_put_contents($templatesDir . '/index.html', $indexTemplate);

        // Generate single template
        $singleTemplate = $this->generateSingleTemplate();
        file_put_contents($templatesDir . '/single.html', $singleTemplate);

        // Generate page template
        $pageTemplate = $this->generatePageTemplate();
        file_put_contents($templatesDir . '/page.html', $pageTemplate);
    }

    private function generateIndexTemplate(): string
    {
        $html = "<!DOCTYPE html>\n";
        $html .= "<html lang=\"{{ language }}\">\n";
        $html .= "<head>\n";
        $html .= "    <meta charset=\"{{ charset }}\">\n";
        $html .= "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
        $html .= "    <title>{{ title }}</title>\n";
        $html .= "    {{ head }}\n";
        $html .= "</head>\n";
        $html .= "<body class=\"jankx-layout\">\n";
        $html .= "    <div class=\"jankx-layout-wrapper\">\n";
        $html .= "        <header class=\"jankx-layout-header\">\n";
        $html .= "            {{ renderArea('header') }}\n";
        $html .= "        </header>\n";
        $html .= "        <main class=\"jankx-layout-main\">\n";
        $html .= "            <div class=\"jankx-layout-container\">\n";
        $html .= "                {{ renderArea('main') }}\n";
        $html .= "            </div>\n";
        $html .= "        </main>\n";
        $html .= "        <footer class=\"jankx-layout-footer\">\n";
        $html .= "            {{ renderArea('footer') }}\n";
        $html .= "        </footer>\n";
        $html .= "    </div>\n";
        $html .= "    {{ footer }}\n";
        $html .= "</body>\n";
        $html .= "</html>";

        return $html;
    }

    private function generateAssets(): void
    {
        // Copy assets from design data
        $assets = $this->designData->getAssets();

        if (isset($assets['images'])) {
            foreach ($assets['images'] as $image) {
                $this->copyAsset($image, 'images');
            }
        }

        if (isset($assets['css'])) {
            foreach ($assets['css'] as $css) {
                $this->copyAsset($css, 'css');
            }
        }

        if (isset($assets['js'])) {
            foreach ($assets['js'] as $js) {
                $this->copyAsset($js, 'js');
            }
        }
    }

    private function copyAsset(string $source, string $type): void
    {
        $destDir = $this->outputPath . "/assets/{$type}";

        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }

        $filename = basename($source);
        $destPath = $destDir . '/' . $filename;

        if (file_exists($source)) {
            copy($source, $destPath);
        }
    }

    private function generateConfiguration(): void
    {
        $config = [
            'theme' => [
                'name' => 'Generated Theme',
                'version' => '1.0.0',
                'description' => 'Theme generated from design data',
            ],
            'design' => [
                'colors' => $this->designData->getColors(),
                'typography' => $this->designData->getTypography(),
                'spacing' => $this->designData->getSpacing(),
            ],
            'components' => array_keys($this->designData->getComponents()),
            'layouts' => array_keys($this->designData->getLayouts()),
        ];

        $configJson = json_encode($config, JSON_PRETTY_PRINT);
        file_put_contents($this->outputPath . '/config/theme.json', $configJson);
    }
}
```

## 🎨 Designer Tools

### Figma Plugin
```javascript
// figma-plugin.js
figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'export-design') {
        const designData = await extractDesignData();
        figma.ui.postMessage({
            type: 'design-data',
            data: designData
        });
    }
};

async function extractDesignData() {
    const colors = await extractColors();
    const typography = await extractTypography();
    const components = await extractComponents();
    const layouts = await extractLayouts();

    return {
        colors,
        typography,
        components,
        layouts,
        spacing: extractSpacing()
    };
}

async function extractColors() {
    const styles = figma.getLocalPaintStyles();
    return styles
        .filter(style => style.paints.length > 0)
        .map(style => ({
            name: style.name,
            value: style.paints[0].color,
            type: 'color'
        }));
}

async function extractTypography() {
    const styles = figma.getLocalTextStyles();
    return styles.map(style => ({
        name: style.name,
        font_family: style.fontName.family,
        font_size: style.fontSize,
        font_weight: style.fontName.style
    }));
}

async function extractComponents() {
    const components = figma.currentPage.findAll(node => node.type === 'COMPONENT');
    return components.map(component => ({
        name: component.name,
        id: component.id,
        description: component.description || '',
        properties: extractComponentProperties(component)
    }));
}

async function extractLayouts() {
    const frames = figma.currentPage.findAll(node => node.type === 'FRAME');
    return frames.map(frame => ({
        name: frame.name,
        id: frame.id,
        components: extractFrameComponents(frame)
    }));
}
```

### HTML Template Converter
```php
<?php
namespace Jankx\Designer\Converter;

class HTMLTemplateConverter
{
    private $htmlContent;
    private $convertedContent;

    public function convertHTMLToJankx(string $htmlContent): string
    {
        $this->htmlContent = $htmlContent;
        $this->convertedContent = $htmlContent;

        // Convert HTML to Jankx template syntax
        $this->convertHTMLTags();
        $this->convertCSSClasses();
        $this->convertJavaScript();
        $this->convertAssets();

        return $this->convertedContent;
    }

    private function convertHTMLTags(): void
    {
        // Convert common HTML patterns to Jankx components
        $patterns = [
            '/<header[^>]*>/i' => '<header class="jankx-layout-header">',
            '/<nav[^>]*>/i' => '<nav class="jankx-navigation">',
            '/<main[^>]*>/i' => '<main class="jankx-layout-main">',
            '/<footer[^>]*>/i' => '<footer class="jankx-layout-footer">',
            '/<section[^>]*>/i' => '<section class="jankx-section">',
            '/<article[^>]*>/i' => '<article class="jankx-article">',
        ];

        foreach ($patterns as $pattern => $replacement) {
            $this->convertedContent = preg_replace($pattern, $replacement, $this->convertedContent);
        }
    }

    private function convertCSSClasses(): void
    {
        // Convert CSS classes to Jankx naming convention
        $patterns = [
            '/\bcontainer\b/' => 'jankx-container',
            '/\brow\b/' => 'jankx-row',
            '/\bcol\b/' => 'jankx-col',
            '/\bcard\b/' => 'jankx-card',
            '/\bbutton\b/' => 'jankx-button',
            '/\bform\b/' => 'jankx-form',
        ];

        foreach ($patterns as $pattern => $replacement) {
            $this->convertedContent = preg_replace($pattern, $replacement, $this->convertedContent);
        }
    }

    private function convertJavaScript(): void
    {
        // Convert JavaScript to Jankx patterns
        $patterns = [
            '/document\.querySelector\(/g' => 'jankx.querySelector(',
            '/addEventListener\(/g' => 'jankx.addEventListener(',
            '/classList\.add\(/g' => 'jankx.classList.add(',
        ];

        foreach ($patterns as $pattern => $replacement) {
            $this->convertedContent = str_replace($pattern, $replacement, $this->convertedContent);
        }
    }

    private function convertAssets(): void
    {
        // Convert asset paths to Jankx structure
        $patterns = [
            '/src="([^"]*\.(jpg|jpeg|png|gif|svg))"/i' => 'src="{{ asset("$1") }}"',
            '/href="([^"]*\.css)"/i' => 'href="{{ asset("$1") }}"',
            '/src="([^"]*\.js)"/i' => 'src="{{ asset("$1") }}"',
        ];

        foreach ($patterns as $pattern => $replacement) {
            $this->convertedContent = preg_replace($pattern, $replacement, $this->convertedContent);
        }
    }
}
```

## 🚀 Quick Start for Designers

### Command Line Tool
```php
<?php
// jankx-designer.php
#!/usr/bin/env php

require_once __DIR__ . '/vendor/autoload.php';

use Jankx\Designer\CLI\DesignerCLI;

$cli = new DesignerCLI();
$cli->run();
```

```php
<?php
namespace Jankx\Designer\CLI;

class DesignerCLI
{
    public function run(): void
    {
        $command = $argv[1] ?? 'help';

        switch ($command) {
            case 'convert-figma':
                $this->convertFigma($argv[2] ?? '', $argv[3] ?? '');
                break;
            case 'convert-html':
                $this->convertHTML($argv[2] ?? '', $argv[3] ?? '');
                break;
            case 'generate-theme':
                $this->generateTheme($argv[2] ?? '');
                break;
            default:
                $this->showHelp();
        }
    }

    private function convertFigma(string $fileId, string $outputPath): void
    {
        echo "Converting Figma design...\n";

        $parser = new FigmaDesignParser($_ENV['FIGMA_TOKEN']);
        $designData = $parser->parseFigmaFile($fileId);

        $generator = new WordPressThemeGenerator($designData, $outputPath);
        $generator->generateTheme();

        echo "Theme generated successfully!\n";
    }

    private function convertHTML(string $htmlFile, string $outputPath): void
    {
        echo "Converting HTML template...\n";

        $parser = new HTMLTemplateParser();
        $designData = $parser->parseHTMLFile($htmlFile);

        $converter = new HTMLTemplateConverter();
        $convertedHTML = $converter->convertHTMLToJankx(file_get_contents($htmlFile));

        file_put_contents($outputPath . '/templates/index.html', $convertedHTML);

        echo "HTML converted successfully!\n";
    }

    private function generateTheme(string $designPath): void
    {
        echo "Generating WordPress theme...\n";

        $designData = DesignData::loadFromPath($designPath);
        $generator = new WordPressThemeGenerator($designData, 'generated-theme');
        $generator->generateTheme();

        echo "Theme generated successfully!\n";
    }

    private function showHelp(): void
    {
        echo "Jankx Designer CLI\n\n";
        echo "Usage:\n";
        echo "  php jankx-designer.php convert-figma <file-id> <output-path>\n";
        echo "  php jankx-designer.php convert-html <html-file> <output-path>\n";
        echo "  php jankx-designer.php generate-theme <design-path>\n\n";
    }
}
```

### Usage Examples

#### Convert Figma Design
```bash
# Convert Figma design to WordPress theme
php jankx-designer.php convert-figma abc123def456 /path/to/output

# Convert HTML template to Jankx theme
php jankx-designer.php convert-html template.html /path/to/output

# Generate theme from design data
php jankx-designer.php generate-theme /path/to/design-data
```

#### Figma Plugin Usage
1. Install Jankx Figma plugin
2. Select design elements
3. Click "Export to Jankx"
4. Download generated theme files

#### HTML Template Conversion
1. Prepare HTML template with CSS
2. Run conversion command
3. Get WordPress-ready theme files
4. Customize as needed

---

**Next**: [Design System](./design-system.md) | [Component Library](./component-library.md)