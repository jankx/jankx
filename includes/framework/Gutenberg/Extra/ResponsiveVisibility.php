<?php
/**
 * Responsive Visibility Extra
 * 
 * Logic to add responsive visibility classes (hide-on-desktop, hide-on-tablet, hide-on-mobile)
 * to blocks inside jankx/wrapper based on their attributes.
 */

namespace Jankx\Gutenberg\Extra;

class ResponsiveVisibility extends AbstractBlockExtra
{
    protected static $cssInjected = false;

    public function getTargetBlockName(): string
    {
        return 'global';
    }

    public function register(): void
    {
        add_filter('render_block', [$this, 'handle'], 10, 2);
        add_filter('register_block_type_args', [$this, 'registerAttributes'], 10, 2);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
        add_action('wp_head', [$this, 'injectVisibilityCSS'], 1);
    }

    public function registerAttributes($args, $name)
    {
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }
        $args['attributes']['jankxHideOnUltrawide'] = [
            'type' => 'boolean',
            'default' => false,
        ];
        $args['attributes']['jankxHideOnPc'] = [
            'type' => 'boolean',
            'default' => false,
        ];
        $args['attributes']['jankxHideOnTablet'] = [
            'type' => 'boolean',
            'default' => false,
        ];
        $args['attributes']['jankxHideOnMobile'] = [
            'type' => 'boolean',
            'default' => false,
        ];
        return $args;
    }

    public function injectVisibilityCSS()
    {
        if (self::$cssInjected) {
            return;
        }

        $manager = \App\Services\BreakpointManager::getInstance();
        $ultrawide = $manager->getBreakpoint('ultrawide');
        $desktop = $manager->getBreakpoint('desktop');
        $tablet = $manager->getBreakpoint('tablet');
        $mobile = $manager->getBreakpoint('mobile');

        $ultrawideMQ = $manager->getMediaQuery('ultrawide');
        $desktopMQ = $manager->getMediaQuery('desktop');
        $tabletMQ = $manager->getMediaQuery('tablet');
        $mobileMQ = $manager->getMediaQuery('mobile');
        ?>
        <style id="jankx-responsive-visibility-css">
            <?php echo $ultrawideMQ; ?> {
                .hide-on-ultrawide {
                    display: none !important;
                }
            }

            <?php echo $desktopMQ; ?> {
                .hide-on-desktop {
                    display: none !important;
                }
            }

            <?php echo $tabletMQ; ?> {
                .hide-on-tablet {
                    display: none !important;
                }
            }

            <?php echo $mobileMQ; ?> {
                .hide-on-mobile {
                    display: none !important;
                }
            }
        </style>
        <?php
        self::$cssInjected = true;
    }

    public function enqueueEditorAssets(): void
    {
        $relativePath = 'resources/assets/js/responsive-visibility.js';
        $assetUrl = $this->getAssetUrl($relativePath);

        if ($assetUrl) {
            $asset_info_path = $this->resolvePath('resources/assets/js/responsive-visibility.asset.php');
            $dependencies = ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-hooks', 'wp-compose'];
            $version = $this->getAssetVersion($relativePath);

            if ($asset_info_path && file_exists($asset_info_path)) {
                $asset_info = require $asset_info_path;
                $dependencies = $asset_info['dependencies'] ?? $dependencies;
                $version = $asset_info['version'] ?? $version;
            }

            wp_enqueue_script(
                'jankx-responsive-visibility-filter',
                $assetUrl,
                $dependencies,
                $version,
                true
            );
        }
    }

    public function handle(string $block_content, array $block): string
    {
        $attrs = $block['attrs'] ?? [];
        $classes = [];

        if (!empty($attrs['jankxHideOnUltrawide'])) {
            $classes[] = 'hide-on-ultrawide';
        }
        if (!empty($attrs['jankxHideOnPc'])) {
            $classes[] = 'hide-on-desktop';
        }
        if (!empty($attrs['jankxHideOnTablet'])) {
            $classes[] = 'hide-on-tablet';
        }
        if (!empty($attrs['jankxHideOnMobile'])) {
            $classes[] = 'hide-on-mobile';
        }

        if (empty($classes)) {
            return $block_content;
        }

        $trimmed_content = ltrim($block_content);
        if (preg_match('/^<([a-z0-9]+)([^>]*)>/is', $trimmed_content, $matches)) {
            $tag_name = $matches[1];
            $attributes = $matches[2];

            if (preg_match('/class="([^"]*)"/i', $attributes, $class_matches)) {
                $existing_classes = $class_matches[1];
                $new_classes = $existing_classes . ' ' . implode(' ', $classes);
                $attributes = str_replace($class_matches[0], 'class="' . trim($new_classes) . '"', $attributes);
            } else {
                $attributes .= ' class="' . implode(' ', $classes) . '"';
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
