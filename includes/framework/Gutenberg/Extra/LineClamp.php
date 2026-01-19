<?php
/**
 * Line Clamp Block Extra
 *
 * PHP version 7.4
 *
 * @category Gutenberg
 * @package  Jankx\Gutenberg\Extra
 * @author   Jankx Team <team@jankx.com>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://jankx.com
 */

namespace Jankx\Gutenberg\Extra;

/**
 * Class LineClamp
 *
 * Handles the server-side registration and rendering of the line-clamp attribute for specific blocks.
 */
class LineClamp extends AbstractBlockExtra
{
    /**
     * @var string[]
     */
    protected $supportedBlocks = [
        'core/post-title',
        'woocommerce/product-title',
        'core/heading',
    ];

    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'global';
    }

    /**
     * @inheritDoc
     */
    public function register(): void
    {
        // Register attributes with high priority to ensure they are available
        add_filter('register_block_type_args', [$this, 'registerLineClampAttribute'], 5, 2);

        // Hook into dynamic rendering for each supported block
        foreach ($this->supportedBlocks as $blockName) {
            add_filter("render_block_{$blockName}", [$this, 'handleLineClampRender'], 10, 2);
        }
    }

    /**
     * Handle the dynamic rendering of line-clamp
     *
     * This method injects the necessary CSS variables and class into the block HTML.
     *
     * @param string $block_content The block's HTML content.
     * @param array  $block         The block's data including attributes.
     * @return string
     */
    public function handleLineClampRender(string $block_content, array $block): string
    {
        $attrs = $block['attrs'] ?? [];
        $clamp = $attrs['jankxLineClamp'] ?? null;
        $clampTablet = $attrs['jankxLineClampTablet'] ?? null;
        $clampMobile = $attrs['jankxLineClampMobile'] ?? null;

        // Skip if no line-clamp is set
        if (is_null($clamp) && is_null($clampTablet) && is_null($clampMobile)) {
            return $block_content;
        }

        $extraClass = 'has-jankx-line-clamp';
        $extraStyles = [];

        if (!is_null($clamp)) {
            $extraStyles[] = "--jankx-line-clamp: {$clamp}";
        }
        if (!is_null($clampTablet)) {
            $extraStyles[] = "--jankx-line-clamp-tablet: {$clampTablet}";
        }
        if (!is_null($clampMobile)) {
            $extraStyles[] = "--jankx-line-clamp-mobile: {$clampMobile}";
        }

        $styleString = implode(';', $extraStyles);

        // 1. Inject Class
        if (preg_match('/^<[a-z0-9]+[^>]*class=["\']([^"\']*)["\']/i', $block_content, $matches)) {
            // Tag has existing class, append ours
            if (strpos($matches[1], $extraClass) === false) {
                $newClassAttr = $matches[1] . ' ' . $extraClass;
                $block_content = substr_replace($block_content, $newClassAttr, strpos($block_content, $matches[1]), strlen($matches[1]));
            }
        } else {
            // Tag has no class, insert it
            $block_content = preg_replace('/^<([a-z0-9]+)/i', '<$1 class="' . $extraClass . '"', $block_content);
        }

        // 2. Inject Style
        if (preg_match('/^<[^>]*style=["\']([^"\']*)["\']/i', $block_content, $matches)) {
            // Tag has existing style, append ours
            $newStyleAttr = rtrim($matches[1], ';') . ';' . $styleString;
            $block_content = substr_replace($block_content, $newStyleAttr, strpos($block_content, $matches[1]), strlen($matches[1]));
        } else {
            // Tag has no style, insert it after the tag name or after attributes
            $block_content = preg_replace('/^<([a-z0-9]+[^>]*)/i', '$0 style="' . $styleString . '"', $block_content);
        }

        return $block_content;
    }

    /**
     * Register the line-clamp attributes on the server side
     *
     * @param array  $args       The block registration arguments.
     * @param string $block_name The block name.
     * @return array
     */
    public function registerLineClampAttribute(array $args, string $block_name): array
    {
        if (in_array($block_name, $this->supportedBlocks)) {
            if (!isset($args['attributes'])) {
                $args['attributes'] = [];
            }
            $args['attributes']['jankxLineClamp'] = ['type' => 'number'];
            $args['attributes']['jankxLineClampTablet'] = ['type' => 'number'];
            $args['attributes']['jankxLineClampMobile'] = ['type' => 'number'];
        }
        return $args;
    }

    /**
     * This method is part of AbstractBlockExtra but we handle rendering dynamically.
     *
     * @param string $block_content The block's HTML content.
     * @param array  $block         The block's data.
     * @return string
     */
    public function handle(string $block_content, array $block): string
    {
        return $block_content;
    }
}
