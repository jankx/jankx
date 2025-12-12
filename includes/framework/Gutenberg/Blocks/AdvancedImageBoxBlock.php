<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\Blocks\AdvancedImageBox\PresetRegistry;
use Jankx\Gutenberg\Blocks\AdvancedImageBox\Presets\BorderedFramePreset;

class AdvancedImageBoxBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-image-box';

    /**
     * Register block
     */
    public function register(): void
    {
        parent::register();

        // Register default presets
        $this->registerDefaultPresets();

        // Pass presets data to JavaScript
        add_action('wp_enqueue_scripts', [$this, 'enqueuePresetsData'], 20);
        add_action('enqueue_block_editor_assets', [$this, 'enqueuePresetsData'], 20);
    }

    /**
     * Register default presets
     */
    protected function registerDefaultPresets(): void
    {
        PresetRegistry::register(BorderedFramePreset::class);
    }

    /**
     * Enqueue presets data to JavaScript
     */
    public function enqueuePresetsData(): void
    {
        // Get block metadata to find script handle
        $blockMetadata = $this->getBlockMetadata();
        if (!$blockMetadata || !isset($blockMetadata['editorScript'])) {
            return;
        }

        // WordPress converts block.json editorScript to handle
        // Format: jankx-advanced-image-box-editor-script
        $handle = 'jankx-advanced-image-box-editor-script';
        
        // Check if script is registered
        if (!wp_script_is($handle, 'registered')) {
            return;
        }

        wp_enqueue_script($handle);

        $presetsData = PresetRegistry::getPresetsData();
        
        // Add helper function to get CSS for preset
        $cssHelper = "
window.jankxAdvancedImageBoxGetPresetCSS = function(presetId, attributes, options) {
    // This will be handled by PHP renderCSS method
    // For now, return empty - CSS will be generated in editor
    return '';
};
";
        
        wp_add_inline_script(
            $handle,
            sprintf(
                'window.jankxAdvancedImageBoxPresets = %s;%s',
                wp_json_encode($presetsData),
                $cssHelper
            ),
            'before'
        );
    }

    /**
     * Get block metadata
     *
     * @return array|null
     */
    protected function getBlockMetadata(): ?array
    {
        if (empty($this->blockPath)) {
            return null;
        }

        $blockJsonPath = $this->blockPath . '/block.json';
        if (!file_exists($blockJsonPath)) {
            return null;
        }

        $metadata = json_decode(file_get_contents($blockJsonPath), true);
        return is_array($metadata) ? $metadata : null;
    }

    /**
     * Render block
     */
    public function render(array $attributes, string $content, $block): string
    {
        $presetId = $attributes['preset'] ?? null;
        $presetOptions = $attributes['presetOptions'] ?? [];

        // If no preset, use default rendering
        if (empty($presetId)) {
            return $content;
        }

        if (!function_exists('render_block')) {
            require_once ABSPATH . 'wp-includes/blocks.php';
        }

        $preset = PresetRegistry::get($presetId);
        if (!$preset) {
            return $content;
        }

        // Extract inner blocks content
        $innerBlocksContent = '';
        
        if (preg_match('/<div[^>]*class="[^"]*wp-block-jankx-advanced-image-box__serialized-content[^"]*"[^>]*>(.*?)<\/div>/s', $content, $matches)) {
            $innerBlocksContent = trim($matches[1] ?? '');
        }
        if (empty($innerBlocksContent) && preg_match('/<div[^>]*class="[^"]*wp-block-jankx-advanced-image-box__overlay__content[^"]*"[^>]*>(.*?)<\/div>/s', $content, $matches)) {
            $innerBlocksContent = trim($matches[1] ?? '');
        }
        
        // Method 2: Render from block's inner_blocks if not found in content
        if (empty($innerBlocksContent)) {
            // Try from WP_Block_List
            if (isset($block->inner_blocks) && !empty($block->inner_blocks)) {
                foreach ($block->inner_blocks as $innerBlock) {
                    if ($innerBlock instanceof \WP_Block) {
                        $innerBlocksContent .= $innerBlock->render();
                    }
                }
            }
            
            // Try from parsed_block if still empty
            if (empty($innerBlocksContent) && isset($block->parsed_block['innerBlocks']) && !empty($block->parsed_block['innerBlocks'])) {
                foreach ($block->parsed_block['innerBlocks'] as $innerBlockData) {
                    if (is_array($innerBlockData)) {
                        $innerBlocksContent .= render_block($innerBlockData);
                    }
                }
            }
        }
        
        // Clean up extracted content (remove any wrapper divs that might be included)
        $innerBlocksContent = trim($innerBlocksContent);

        // Render preset markup with inner blocks content
        // Note: renderMarkup always returns frame-wrapper and title-box,
        //       even if inner blocks content is empty (for visible title area)
        $presetMarkup = PresetRegistry::renderPresetMarkup(
            $presetId,
            $attributes,
            $presetOptions,
            $innerBlocksContent
        );
        
        // Debug: Log if inner blocks content is empty but preset requires it
        if ($preset->requiresInnerBlocks() && empty($innerBlocksContent)) {
            // Still render frame-wrapper, title-box will be empty
        }

        // Get CSS
        $css = PresetRegistry::renderPresetCSS($presetId, $attributes, $presetOptions);
        
        // Get SVG mask
        $svgMask = PresetRegistry::renderPresetSVGMask($presetId, $attributes, $presetOptions);

        // Enqueue CSS
        if (!empty($css)) {
            // Try to find the style handle from block metadata
            $styleHandle = 'jankx-advanced-image-box-style';
            if (!wp_style_is($styleHandle, 'registered')) {
                // Fallback: create inline style tag
                $cssId = sprintf('jankx-advanced-image-box-preset-%s', $presetId);
                add_action('wp_head', function() use ($css, $cssId) {
                    echo sprintf('<style id="%s">%s</style>', esc_attr($cssId), $css);
                }, 20);
            } else {
                wp_add_inline_style($styleHandle, $css);
            }
        }

        // Add SVG mask to page if needed
        if (!empty($svgMask)) {
            $svgId = sprintf('jankx-advanced-image-box-mask-%s', $presetId);
            add_action('wp_footer', function() use ($svgMask, $svgId) {
                echo sprintf('<svg style="display: none;"><defs id="%s">%s</defs></svg>', esc_attr($svgId), $svgMask);
            });
        }

        // Add preset classes to block
        $classes = $preset->getClasses();
        if (!empty($classes)) {
            $content = str_replace(
                'wp-block-jankx-advanced-image-box',
                'wp-block-jankx-advanced-image-box ' . implode(' ', $classes),
                $content
            );
        }

        // Insert preset markup FIRST (before removing overlay)
        // renderMarkup always returns frame-wrapper, so presetMarkup should never be empty
        // Defensive: only insert if the content does not already include the frame wrapper
        if (!empty($presetMarkup) && strpos($content, 'wp-block-jankx-advanced-image-box__frame-wrapper') === false) {
            // Insert before closing figure tag
            $content = str_replace('</figure>', $presetMarkup . '</figure>', $content);
        }

        // Remove default overlay content when preset is active
        // Be very specific to only remove overlay, not frame-wrapper or title-box
        // Strategy: Match any div that contains overlay__content and remove the entire overlay structure
        
        // First, remove overlay div wrapper that contains overlay__content
        // Match div with class containing "__overlay" (but not "__overlay__title-box", "__overlay__frame-wrapper", or "__overlay__frame")
        // and contains a child div with class "overlay__content"
        $content = preg_replace(
            '/<div\s+class="[^"]*__overlay(?!__title-box|__frame-wrapper|__frame)[^"]*"[^>]*>[\s\S]*?<div\s+class="[^"]*overlay__content[^"]*"[^>]*>[\s\S]*?<\/div>[\s\S]*?<\/div>/s',
            '',
            $content
        );
        
        // Also match overlay divs with class "wp-block-jankx-advanced-image-box__overlay" (standard format)
        $content = preg_replace(
            '/<div\s+class="[^"]*wp-block-jankx-advanced-image-box__overlay(?!__title-box|__frame-wrapper|__frame)[^"]*"[^>]*>[\s\S]*?<div\s+class="[^"]*overlay__content[^"]*"[^>]*>[\s\S]*?<\/div>[\s\S]*?<\/div>/s',
            '',
            $content
        );
        
        // Then remove standalone overlay__content div (but not title-box)
        // This handles the case when preset is active and overlay__content is rendered without overlay wrapper
        $content = preg_replace(
            '/<div\s+class="[^"]*overlay__content(?!__title-box)[^"]*"[^>]*>[\s\S]*?<\/div>/s',
            '',
            $content
        );
        
        // Finally, remove any remaining empty overlay wrapper divs (but not frame-wrapper or title-box)
        // Match divs with class containing "__overlay" but not the protected classes
        $content = preg_replace(
            '/<div\s+class="[^"]*__overlay(?!__title-box|__frame-wrapper|__frame)[^"]*"[^>]*>\s*<\/div>/s',
            '',
            $content
        );

        $content = preg_replace(
            '/<div\s+class="[^"]*wp-block-jankx-advanced-image-box__serialized-content[^"]*"[^>]*>[\s\S]*?<\/div>/s',
            '',
            $content
        );

        return $content;
    }
}
