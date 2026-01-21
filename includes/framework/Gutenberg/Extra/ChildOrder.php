<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class ChildOrder
 *
 * Injects order styles for blocks that have jankxOrder attribute.
 * Includes mechanisms to avoid duplicates in both CSS and HTML attributes.
 *
 * @package Jankx\Gutenberg\Extra
 */
class ChildOrder extends AbstractBlockExtra
{
    protected static $cssInjected = false;

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
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
        add_filter('register_block_type_args', [$this, 'registerAttributes'], 10, 2);
        
        // Set priority to 1 to ensure it's at the top of the head
        add_action('wp_head', [$this, 'injectGlobalOrderCSS'], 1);
    }

    public function registerAttributes($args, $name)
    {
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }
        $args['attributes']['jankxOrder'] = [
            'type' => 'object',
            'default' => [],
        ];
        return $args;
    }

    /**
     * Inject global CSS only once per page cycle
     */
    public function injectGlobalOrderCSS()
    {
        if (self::$cssInjected) {
            return;
        }

        ?>
        <style id="jankx-child-order-css">
            .jankx-order-applied {
                order: var(--jankx-order-desktop) !important;
            }
            @media (max-width: 1024px) {
                .jankx-order-applied {
                    order: var(--jankx-order-tablet, var(--jankx-order-desktop)) !important;
                }
            }
            @media (max-width: 768px) {
                .jankx-order-applied {
                    order: var(--jankx-order-mobile, var(--jankx-order-tablet, var(--jankx-order-desktop))) !important;
                }
            }
        </style>
        <?php
        self::$cssInjected = true;
    }

    public function enqueueEditorAssets(): void
    {
        $relativePath = 'resources/assets/js/child-order.js';
        $assetUrl = $this->getAssetUrl($relativePath);

        if ($assetUrl) {
            $asset_info_path = $this->resolvePath('resources/assets/js/child-order.asset.php');
            $dependencies = ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-hooks', 'wp-compose'];
            $version = $this->getAssetVersion($relativePath);

            if ($asset_info_path && file_exists($asset_info_path)) {
                $asset_info = require $asset_info_path;
                $dependencies = $asset_info['dependencies'] ?? $dependencies;
                $version = $asset_info['version'] ?? $version;
            }

            wp_enqueue_script(
                'jankx-child-order-filter',
                $assetUrl,
                $dependencies,
                $version,
                true
            );
        }
    }

    /**
     * Handle the block rendering with duplication prevention.
     */
    public function handle(string $block_content, array $block): string
    {
        if (empty($block['attrs']['jankxOrder'])) {
            return $block_content;
        }

        $order = $block['attrs']['jankxOrder'];
        $style_vars = [];
        $has_value = false;

        if (isset($order['desktop']) && $order['desktop'] !== null && $order['desktop'] !== '') {
            $style_vars[] = "--jankx-order-desktop: {$order['desktop']}";
            $has_value = true;
        }
        if (isset($order['tablet']) && $order['tablet'] !== null && $order['tablet'] !== '') {
            $style_vars[] = "--jankx-order-tablet: {$order['tablet']}";
            $has_value = true;
        }
        if (isset($order['mobile']) && $order['mobile'] !== null && $order['mobile'] !== '') {
            $style_vars[] = "--jankx-order-mobile: {$order['mobile']}";
            $has_value = true;
        }

        if (!$has_value) {
            return $block_content;
        }

        $style_attr = implode('; ', $style_vars) . ';';
        $trimmed_content = ltrim($block_content);

        if (preg_match('/^<([a-z0-9]+)([^>]*)>/is', $trimmed_content, $matches)) {
            $tag_name = $matches[1];
            $attributes = $matches[2];

            // Avoid duplicate class injection
            if (preg_match('/class="([^"]*)"/i', $attributes, $class_matches)) {
                $existing_classes = $class_matches[1];
                if (strpos($existing_classes, 'jankx-order-applied') === false) {
                    $new_classes = $existing_classes . ' jankx-order-applied';
                    $attributes = str_replace($class_matches[0], 'class="' . trim($new_classes) . '"', $attributes);
                }
            } else {
                $attributes .= ' class="jankx-order-applied"';
            }

            // Avoid duplicate variable injection
            if (preg_match('/style="([^"]*)"/i', $attributes, $style_matches)) {
                $existing_style = $style_matches[1];
                if (strpos($existing_style, '--jankx-order-desktop') === false) {
                    $new_style = rtrim(trim($existing_style), ';') . '; ' . $style_attr;
                    $attributes = str_replace($style_matches[0], 'style="' . trim($new_style) . '"', $attributes);
                }
            } else {
                $attributes .= ' style="' . trim($style_attr) . '"';
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
