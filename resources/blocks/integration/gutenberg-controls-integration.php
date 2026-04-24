<?php
/**
 * Gutenberg Controls Integration
 *
 * Bridges jankx/gutenberg-controls package with existing Jankx blocks
 * in resources/blocks directory.
 *
 * @package Jankx\Blocks\Integration
 */

namespace Jankx\Blocks\Integration;

use Jankx\Gutenberg\Controls\Registry\BlockRegistry;
use Jankx\Gutenberg\Controls\Presets\PresetManager;

/**
 * Class GutenbergControlsIntegration
 *
 * Integrates jankx/gutenberg-controls with existing blocks
 */
class GutenbergControlsIntegration
{
    /**
     * Singleton instance
     */
    private static ?self $instance = null;

    /**
     * Blocks that support enhanced controls
     */
    private array $supportedBlocks = [
        'jankx/advanced-button',
        'jankx/advanced-image-box',
        'jankx/section',
        'jankx/divider',
        'jankx/modal',
        'jankx/slideshow',
        'jankx/sticky-box',
        'jankx/wrapper',
        'jankx/carousel',
    ];

    /**
     * Control configurations per block
     */
    private array $blockControlConfigs = [];

    /**
     * Get singleton instance
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initialize integration
     */
    public function init(): void
    {
        // Ensure gutenberg-controls is loaded
        $this->ensureControlsPackageLoaded();

        // Register integration hooks
        add_action('init', [$this, 'registerBlockIntegration'], 20);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);

        // Filter block attributes to add jankxControls
        add_filter('register_block_type_args', [$this, 'filterBlockArgs'], 10, 2);

        // Add custom controls config to block
        add_filter('block_type_metadata', [$this, 'addControlsMetadata']);

        // Render hook for frontend CSS
        add_filter('render_block', [$this, 'renderBlockWithControls'], 10, 2);
    }

    /**
     * Ensure gutenberg-controls package is loaded
     */
    private function ensureControlsPackageLoaded(): void
    {
        $vendorDir = get_template_directory() . '/vendor/jankx/gutenberg-controls';

        if (!is_dir($vendorDir)) {
            add_action('admin_notices', function () {
                echo '<div class="notice notice-error"><p>';
                echo __('Jankx Gutenberg Controls package not found. Please run composer install.', 'jankx');
                echo '</p></div>';
            });
            return;
        }

        // Autoload if not already loaded
        if (!class_exists(BlockRegistry::class)) {
            $autoload = $vendorDir . '/vendor/autoload.php';
            if (file_exists($autoload)) {
                require_once $autoload;
            }
        }
    }

    /**
     * Register block integration
     */
    public function registerBlockIntegration(): void
    {
        // Register block registry singleton
        if (class_exists(BlockRegistry::class)) {
            $registry = BlockRegistry::getInstance();

            // Configure supported blocks with appropriate controls
            $this->configureBlockControls();

            // Register each supported block with its controls
            foreach ($this->supportedBlocks as $blockName) {
                $this->registerBlockWithControls($blockName, $registry);
            }

            // Register presets
            $this->registerPresets();
        }
    }

    /**
     * Configure control mappings for each block type
     */
    private function configureBlockControls(): void
    {
        $this->blockControlConfigs = [
            'jankx/advanced-button' => [
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Button Colors', 'jankx'),
                    'allowGradient' => true,
                    'allowSolid' => true,
                ],
                'typography' => [
                    'type' => 'jankx/typography',
                    'label' => __('Button Text', 'jankx'),
                    'allowFluid' => true,
                ],
                'spacing' => [
                    'type' => 'jankx/visual-spacing',
                    'label' => __('Button Spacing', 'jankx'),
                ],
                'shadow' => [
                    'type' => 'jankx/shadow',
                    'label' => __('Button Shadow', 'jankx'),
                ],
            ],
            'jankx/advanced-image-box' => [
                'image' => [
                    'type' => 'jankx/image',
                    'label' => __('Image Settings', 'jankx'),
                ],
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Overlay Color', 'jankx'),
                    'allowGradient' => true,
                ],
                'responsive' => [
                    'type' => 'jankx/responsive',
                    'label' => __('Responsive', 'jankx'),
                ],
            ],
            'jankx/divider' => [
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Divider Color', 'jankx'),
                    'allowGradient' => true,
                ],
                'spacing' => [
                    'type' => 'jankx/visual-spacing',
                    'label' => __('Spacing', 'jankx'),
                ],
            ],
            'jankx/modal' => [
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Modal Background', 'jankx'),
                    'allowGradient' => true,
                ],
                'animation' => [
                    'type' => 'jankx/animation',
                    'label' => __('Open Animation', 'jankx'),
                ],
            ],
            'jankx/slideshow' => [
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Slide Background', 'jankx'),
                    'allowGradient' => true,
                ],
                'animation' => [
                    'type' => 'jankx/animation',
                    'label' => __('Slide Animation', 'jankx'),
                ],
            ],
            'jankx/wrapper' => [
                'color' => [
                    'type' => 'jankx/color',
                    'label' => __('Background', 'jankx'),
                    'allowGradient' => true,
                    'allowDuotone' => true,
                ],
                'typography' => [
                    'type' => 'jankx/typography',
                    'label' => __('Typography', 'jankx'),
                    'allowFluid' => true,
                ],
                'spacing' => [
                    'type' => 'jankx/visual-spacing',
                    'label' => __('Spacing', 'jankx'),
                ],
                'shadow' => [
                    'type' => 'jankx/shadow',
                    'label' => __('Shadow', 'jankx'),
                ],
                'border' => [
                    'type' => 'jankx/border',
                    'label' => __('Border', 'jankx'),
                ],
                'responsive' => [
                    'type' => 'jankx/responsive',
                    'label' => __('Responsive', 'jankx'),
                ],
            ],
        ];
    }

    /**
     * Register a block with its controls
     */
    private function registerBlockWithControls(string $blockName, BlockRegistry $registry): void
    {
        $controls = $this->blockControlConfigs[$blockName] ?? [];

        if (empty($controls)) {
            return;
        }

        // Create block configuration
        $blockConfig = [
            'name' => $blockName,
            'controls' => $controls,
            'supports' => [
                'jankxControls' => true,
            ],
        ];

        // Store config for JavaScript
        add_filter('jankx_blocks_controls_config', function ($configs) use ($blockName, $controls) {
            $configs[$blockName] = $controls;
            return $configs;
        });
    }

    /**
     * Register presets
     */
    private function registerPresets(): void
    {
        if (!class_exists(PresetManager::class)) {
            return;
        }

        $manager = PresetManager::getInstance();

        // Register presets for specific block types
        $manager->registerPresetForBlock('jankx/advanced-button', [
            'id' => 'button-primary',
            'title' => __('Primary Button', 'jankx'),
            'category' => 'buttons',
            'thumbnail' => '',
            'controls' => [
                'color' => [
                    'colorType' => 'solid',
                    'solidColor' => '#ff5722',
                    'useThemeColor' => true,
                    'themeColorKey' => 'primary',
                ],
                'typography' => [
                    'fontWeight' => '600',
                    'textTransform' => 'uppercase',
                ],
                'spacing' => [
                    'padding' => '12px 24px',
                ],
                'shadow' => [
                    'shadowType' => 'sm',
                ],
            ],
        ]);

        $manager->registerPresetForBlock('jankx/advanced-button', [
            'id' => 'button-outline',
            'title' => __('Outline Button', 'jankx'),
            'category' => 'buttons',
            'thumbnail' => '',
            'controls' => [
                'color' => [
                    'colorType' => 'solid',
                    'solidColor' => 'transparent',
                ],
                'border' => [
                    'borderWidth' => '2px',
                    'borderColor' => '#ff5722',
                ],
                'typography' => [
                    'fontWeight' => '500',
                ],
            ],
        ]);
    }

    /**
     * Filter block args to add jankxControls attribute
     */
    public function filterBlockArgs(array $args, string $blockName): array
    {
        if (!in_array($blockName, $this->supportedBlocks, true)) {
            return $args;
        }

        // Add jankxControls attribute
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }

        $args['attributes']['jankxControls'] = [
            'type' => 'object',
            'default' => [],
        ];

        return $args;
    }

    /**
     * Add controls metadata to block
     */
    public function addControlsMetadata(array $metadata): array
    {
        $blockName = $metadata['name'] ?? '';

        if (!in_array($blockName, $this->supportedBlocks, true)) {
            return $metadata;
        }

        // Add jankxControls to supports
        if (!isset($metadata['supports'])) {
            $metadata['supports'] = [];
        }

        $metadata['supports']['jankxControls'] = true;

        return $metadata;
    }

    /**
     * Enqueue block editor assets
     */
    public function enqueueEditorAssets(): void
    {
        $vendorDir = get_template_directory() . '/vendor/jankx/gutenberg-controls';

        // Enqueue gutenberg-controls editor script
        $editorScript = $vendorDir . '/assets/build/editor.js';
        if (file_exists($editorScript)) {
            wp_enqueue_script(
                'jankx-gutenberg-controls',
                $this->getAssetUrl('assets/build/editor.js'),
                [
                    'wp-blocks',
                    'wp-element',
                    'wp-components',
                    'wp-block-editor',
                    'wp-data',
                    'wp-hooks',
                    'wp-i18n',
                ],
                filemtime($editorScript),
                true
            );
        }

        // Enqueue editor styles
        $editorStyle = $vendorDir . '/assets/build/editor.css';
        if (file_exists($editorStyle)) {
            wp_enqueue_style(
                'jankx-gutenberg-controls-editor',
                $this->getAssetUrl('assets/build/editor.css'),
                [],
                filemtime($editorStyle)
            );
        }

        // Localize script with block controls config
        $controlsConfig = apply_filters('jankx_blocks_controls_config', []);
        $presets = $this->getPresetsForJS();

        wp_localize_script('jankx-gutenberg-controls', 'jankxBlocks', [
            'controls' => $controlsConfig,
            'presets' => $presets,
            'categories' => $this->getPresetCategories(),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_controls_nonce'),
        ]);
    }

    /**
     * Get presets for JavaScript
     */
    private function getPresetsForJS(): array
    {
        if (!class_exists(PresetManager::class)) {
            return [];
        }

        $manager = PresetManager::getInstance();
        return $manager->getAllPresetsForJS();
    }

    /**
     * Get preset categories
     */
    private function getPresetCategories(): array
    {
        return [
            ['slug' => 'all', 'title' => __('All', 'jankx')],
            ['slug' => 'buttons', 'title' => __('Buttons', 'jankx')],
            ['slug' => 'cards', 'title' => __('Cards', 'jankx')],
            ['slug' => 'hero', 'title' => __('Hero Sections', 'jankx')],
            ['slug' => 'layout', 'title' => __('Layouts', 'jankx')],
        ];
    }

    /**
     * Enqueue frontend assets
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if blocks with jankxControls are present
        if (!has_block('jankx/advanced-button') &&
            !has_block('jankx/advanced-image-box') &&
            !has_block('jankx/wrapper')) {
            return;
        }

        // Enqueue animation CSS
        $vendorDir = get_template_directory() . '/vendor/jankx/gutenberg-controls';
        $cssFile = $vendorDir . '/assets/build/frontend.css';

        if (file_exists($cssFile)) {
            wp_enqueue_style(
                'jankx-gutenberg-controls-frontend',
                $this->getAssetUrl('assets/build/frontend.css'),
                [],
                filemtime($cssFile)
            );
        }
    }

    /**
     * Render block with controls CSS
     */
    public function renderBlockWithControls(string $blockContent, array $block): string
    {
        $blockName = $block['blockName'] ?? '';

        if (!in_array($blockName, $this->supportedBlocks, true)) {
            return $blockContent;
        }

        $jankxControls = $block['attrs']['jankxControls'] ?? [];

        if (empty($jankxControls)) {
            return $blockContent;
        }

        // Generate CSS from controls
        $css = $this->generateControlsCSS($jankxControls, $blockName);

        if (!empty($css)) {
            // Add CSS to block wrapper
            $blockContent = $this->injectCSSIntoBlock($blockContent, $css, $block);
        }

        return $blockContent;
    }

    /**
     * Generate CSS from controls configuration
     */
    private function generateControlsCSS(array $controls, string $blockName): string
    {
        $css = '';

        foreach ($controls as $controlName => $controlValue) {
            $controlConfig = $this->blockControlConfigs[$blockName][$controlName] ?? null;

            if (!$controlConfig || empty($controlValue)) {
                continue;
            }

            $controlType = $controlConfig['type'] ?? '';

            // Generate CSS based on control type
            switch ($controlType) {
                case 'jankx/color':
                    $css .= $this->generateColorCSS($controlValue);
                    break;
                case 'jankx/typography':
                    $css .= $this->generateTypographyCSS($controlValue);
                    break;
                case 'jankx/shadow':
                    $css .= $this->generateShadowCSS($controlValue);
                    break;
                case 'jankx/visual-spacing':
                    $css .= $this->generateSpacingCSS($controlValue);
                    break;
            }
        }

        return $css;
    }

    /**
     * Generate color CSS
     */
    private function generateColorCSS(array $value): string
    {
        $css = '';
        $colorType = $value['colorType'] ?? 'solid';

        switch ($colorType) {
            case 'solid':
                if (!empty($value['useThemeColor']) && !empty($value['themeColorKey'])) {
                    $css .= sprintf('background-color: var(--jankx-%s-color);', $value['themeColorKey']);
                } elseif (!empty($value['solidColor'])) {
                    $opacity = ($value['solidOpacity'] ?? 100) / 100;
                    if ($opacity < 1) {
                        $css .= sprintf('background-color: %s;', $this->hexToRgba($value['solidColor'], $opacity));
                    } else {
                        $css .= sprintf('background-color: %s;', $value['solidColor']);
                    }
                }
                break;

            case 'gradient':
                $stops = array_map(function ($stop) {
                    return sprintf('%s %s%%', $stop['color'], $stop['position']);
                }, $value['gradientColors'] ?? []);

                if (!empty($stops)) {
                    $gradient = ($value['gradientType'] ?? 'linear') === 'linear'
                        ? sprintf('linear-gradient(%sdeg, %s)', $value['gradientAngle'] ?? 90, implode(', ', $stops))
                        : sprintf('radial-gradient(circle, %s)', implode(', ', $stops));

                    $css .= sprintf('background: %s;', $gradient);
                }
                break;
        }

        return $css ? " style=\"{$css}\"" : '';
    }

    /**
     * Generate typography CSS
     */
    private function generateTypographyCSS(array $value): string
    {
        $css = '';

        if (!empty($value['fontFamily'])) {
            $css .= sprintf('font-family: "%s", sans-serif;', $value['fontFamily']);
        } elseif (!empty($value['useThemeFont'])) {
            $css .= 'font-family: var(--jankx-font-family);';
        }

        if (!empty($value['fontSize'])) {
            if (!empty($value['fluidTypography'])) {
                $css .= sprintf('font-size: clamp(%s, 2vw + 1rem, %s);', $value['fluidMin'], $value['fluidMax']);
            } else {
                $css .= sprintf('font-size: %s;', $value['fontSize']);
            }
        }

        if (!empty($value['fontWeight']) && $value['fontWeight'] !== '400') {
            $css .= sprintf('font-weight: %s;', $value['fontWeight']);
        }

        if (!empty($value['fontStyle']) && $value['fontStyle'] !== 'normal') {
            $css .= sprintf('font-style: %s;', $value['fontStyle']);
        }

        return $css ? " style=\"{$css}\"" : '';
    }

    /**
     * Generate shadow CSS
     */
    private function generateShadowCSS(array $value): string
    {
        $shadowType = $value['shadowType'] ?? 'none';

        if ($shadowType === 'none') {
            return '';
        }

        $shadows = [
            'xs' => '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'sm' => '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            'md' => '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            'lg' => '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            'xl' => '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        ];

        if (isset($shadows[$shadowType])) {
            return sprintf(' style="box-shadow: %s;"', $shadows[$shadowType]);
        }

        return '';
    }

    /**
     * Generate spacing CSS
     */
    private function generateSpacingCSS(array $value): string
    {
        $css = '';

        if (!empty($value['padding'])) {
            $css .= sprintf('padding: %s;', $value['padding']);
        }
        if (!empty($value['margin'])) {
            $css .= sprintf('margin: %s;', $value['margin']);
        }

        return $css ? " style=\"{$css}\"" : '';
    }

    /**
     * Inject CSS into block wrapper
     */
    private function injectCSSIntoBlock(string $content, string $css, array $block): string
    {
        // Find the first HTML tag and inject style attribute
        if (preg_match('/<([a-z0-9]+)([^>]*)>/i', $content, $matches)) {
            $tag = $matches[1];
            $existingAttrs = $matches[2];

            // Check if style already exists
            if (strpos($existingAttrs, 'style=') !== false) {
                // Merge with existing style
                $content = preg_replace(
                    '/style="([^"]*)"/i',
                    'style="$1 ' . trim($css, '" ') . '"',
                    $content,
                    1
                );
            } else {
                // Add new style attribute
                $newAttrs = $existingAttrs . $css;
                $content = preg_replace(
                    '/<' . $tag . '([^>]*)>/i',
                    '<' . $tag . $newAttrs . '>',
                    $content,
                    1
                );
            }
        }

        return $content;
    }

    /**
     * Helper: Convert hex to rgba
     */
    private function hexToRgba(string $hex, float $alpha): string
    {
        $hex = ltrim($hex, '#');

        if (strlen($hex) === 3) {
            $r = hexdec($hex[0] . $hex[0]);
            $g = hexdec($hex[1] . $hex[1]);
            $b = hexdec($hex[2] . $hex[2]);
        } else {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
        }

        return sprintf('rgba(%d, %d, %d, %s)', $r, $g, $b, $alpha);
    }
    /**
     * Get asset URL for the gutenberg-controls package
     */
    protected function getAssetUrl(string $path): string
    {
        $vendorUrl = get_template_directory_uri() . '/vendor/jankx/gutenberg-controls';
        return $vendorUrl . '/' . ltrim($path, '/');
    }
}

// Initialize integration
add_action('after_setup_theme', function () {
    GutenbergControlsIntegration::getInstance()->init();
});
