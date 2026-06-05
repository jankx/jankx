<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class FlexGrow
 *
 * Injects flex-grow styles for blocks that have jankxFlexGrow attribute.
 *
 * @package Jankx\Gutenberg\Extra
 */
class FlexGrow extends AbstractBlockExtra
{
    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'global';
    }

    /**
     * Override register
     */
    public function register(): void
    {
        add_filter('render_block', [$this, 'handle'], 10, 2);
        add_filter('register_block_type_args', [$this, 'registerAttributes'], 10, 2);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
    }

    public function enqueueEditorAssets(): void
    {
        $relativePath = 'resources/assets/js/flex-grow.js';
        $assetUrl = $this->getAssetUrl($relativePath);

        if ($assetUrl) {
            wp_enqueue_script(
                'jankx-flex-grow-filter',
                $assetUrl,
                ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-hooks', 'wp-compose'],
                $this->getAssetVersion($relativePath),
                true
            );
        }
    }

    public function registerAttributes($args, $name)
    {
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }
        $args['attributes']['jankxFlexGrow'] = [
            'type' => 'boolean',
            'default' => false,
        ];
        return $args;
    }

    /**
     * Handle the block rendering
     */
    public function handle(string $block_content, array $block): string
    {
        // Only apply if jankxFlexGrow is true
        if (empty($block['attrs']['jankxFlexGrow'])) {
            return $block_content;
        }

        $style_rule = 'flex: 1;';
        $trimmed_content = ltrim($block_content);

        if (preg_match('/^<([a-z0-9]+)([^>]*)>/is', $trimmed_content, $matches)) {
            $tag_name = $matches[1];
            $attributes = $matches[2];

            // Inject style attribute
            if (preg_match('/style="([^"]*)"/i', $attributes, $style_matches)) {
                $existing_style = $style_matches[1];
                if (strpos($existing_style, 'flex:') === false) {
                    $new_style = rtrim(trim($existing_style), ';') . '; ' . $style_rule;
                    $attributes = str_replace($style_matches[0], 'style="' . trim($new_style) . '"', $attributes);
                }
            } else {
                $attributes .= ' style="' . $style_rule . '"';
            }

            $new_opening_tag = "<{$tag_name}{$attributes}>";
            $pos = strpos($block_content, $matches[0]);
            if ($pos !== false) {
                return substr_replace($block_content, $new_opening_tag, $pos, strlen($matches[0]));
            }
        }

        return $block_content;
    }
}
