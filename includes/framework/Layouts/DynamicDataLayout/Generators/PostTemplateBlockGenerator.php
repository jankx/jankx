<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Generators\Concerns\PostTemplateRendererTrait;
use WP_Post;
use WP_Query;
use WP_Block;
use Jankx\Facades\Log;

class PostTemplateBlockGenerator extends AbstractContentGenerator
{
    use PostTemplateRendererTrait {
        renderCarousel as traitRenderCarousel;
        renderTemplateForPost as traitRenderTemplateForPost;
        buildBlockContext as traitBuildBlockContext;
        buildItemClasses as traitBuildItemClasses;
        buildWrapperAttributes as traitBuildWrapperAttributes;
        resolveImageRatioValue as traitResolveImageRatioValue;
        stringifyAttributes as traitStringifyAttributes;
    }
    protected array $templateBlock;
    protected array $parentAttributes;
    protected array $runtimeOptions = [];
    protected string $currentLayout = '';

    public function __construct(array $templateBlock, array $parentAttributes = [])
    {
        $this->templateBlock = $templateBlock;
        $this->parentAttributes = $parentAttributes;
    }

    protected function renderContent($query, array $options = []): string
    {
        $this->runtimeOptions = $options;

        if (!$query->have_posts()) {
            return '';
        }

        $layoutType = $this->getOption('layout', $options['layout'] ?? '');
        $this->currentLayout = $layoutType;

        if ($layoutType === 'carousel') {
            $before = '';
            $after = '';
            ob_start();
            do_action('jankx/dynamic-data-template/before_loop', $options, $query, $this->getLayout());
            $before = (string) ob_get_clean();
            $html = $this->renderCarousel($query, $options);
            ob_start();
            do_action('jankx/dynamic-data-template/after_loop', $options, $query, $this->getLayout());
            $after = (string) ob_get_clean();
            $html = $before . $html . $after;
            $this->runtimeOptions = [];
            $this->currentLayout = '';
            return $html;
        }

        $wrapperAttributes = $this->buildWrapperAttributes($options);
        $before = '';
        $after = '';
        ob_start();
        do_action('jankx/dynamic-data-template/before_loop', $options, $query, $this->getLayout());
        $before = (string) ob_get_clean();
        $items = $this->renderPosts($query, $options);
        ob_start();
        do_action('jankx/dynamic-data-template/after_loop', $options, $query, $this->getLayout());
        $after = (string) ob_get_clean();

        $this->runtimeOptions = [];
        $this->currentLayout = '';

        if ($items === '') {
            return '';
        }

        return sprintf('%s<div %s>%s</div>%s', $before, $this->stringifyAttributes($wrapperAttributes), $items, $after);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [
            'generator' => $this->getName(),
            'layout' => $this->getOption('layout', $options['layout'] ?? null),
            'columns' => $this->getOption('columns', $options['columns'] ?? null),
        ];
    }

    public function getName(): string
    {
        return 'post-template-block';
    }

    public function getTitle(): string
    {
        return __('Post Template Block Generator', 'jankx');
    }

    protected function renderCarousel(WP_Query $query, array $options): string
    {
        return $this->traitRenderCarousel($query, $options);
    }

    protected function renderTemplateForPost(WP_Post $post, WP_Query $query, array $options): string
    {
        $context = $this->buildBlockContext($post, $query, $options);

        // Get template block attributes
        $attrs = $this->templateBlock['attrs'] ?? [];

        // Get overlay settings
        $overlayIcon = $attrs['overlayIcon'] ?? '';
        $overlayMode = $attrs['overlayIconShowMode'] ?? ($attrs['overlayIconMode'] ?? 'always-show');
        $overlayType = $attrs['overlayIconType'] ?? 'class';
        $overlayImage = $attrs['overlayIconImageUrl'] ?? '';
        $overlayText = $attrs['overlayIconText'] ?? '';
        $overlayRotate = isset($attrs['overlayIconRotate']) ? (int) $attrs['overlayIconRotate'] : 0;
        $overlayColor = $attrs['overlayIconColor'] ?? '#ffffff';
        $overlayBg = $attrs['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)';
        $overlaySize = isset($attrs['overlayIconSize']) ? (int) $attrs['overlayIconSize'] : 24;
        $overlayPosition = $attrs['overlayIconPosition'] ?? 'center';
        $overlayTarget = $attrs['overlayIconTarget'] ?? 'featured-image';

        try {
            $innerBlocks = $this->templateBlock['innerBlocks'] ?? [];

            if (empty($innerBlocks)) {
                return '';
            }

            $output = '';
            $contentOutput = '';
            foreach ($innerBlocks as $innerBlock) {
                $normalizedBlock = [
                    'blockName' => $innerBlock['blockName'] ?? '',
                    'attrs' => is_array($innerBlock['attrs'] ?? null) ? $innerBlock['attrs'] : [],
                    'innerBlocks' => is_array($innerBlock['innerBlocks'] ?? null) ? $innerBlock['innerBlocks'] : [],
                    'innerContent' => is_array($innerBlock['innerContent'] ?? null) ? $innerBlock['innerContent'] : [],
                ];

                if ($normalizedBlock['blockName'] === 'woocommerce/product-title') {
                    $normalizedBlock['blockName'] = 'core/post-title';
                    $normalizedBlock['attrs']['isLink'] = true;
                }

                if (!empty($innerBlock['originalContent'])) {
                    $normalizedBlock['originalContent'] = $innerBlock['originalContent'];
                }

                $blockInstance = new WP_Block($normalizedBlock, $context);
                $blockHtml = $blockInstance->render();

                // Fix missing styles: Apply render_block filters to ensure block supports are applied
                $blockHtml = apply_filters('render_block', $blockHtml, $normalizedBlock, $blockInstance);

                // Handle Premium Overlay Layout if requested via attribute
                if (($attrs['templateLayout'] ?? '') === 'hero-overlay') {
                    if (in_array($normalizedBlock['blockName'], ['core/post-featured-image', 'jankx/advanced-image-box'], true)) {
                        $blockHtml = str_replace('<img ', '<img style="width:100%;height:100%;object-fit:cover;display:block;" ', $blockHtml);
                        $output .= sprintf('<div class="hero-image-wrapper" style="position:absolute;top:0;left:0;width:100%%;height:100%%;z-index:1;">%s</div>', $blockHtml);
                        continue;
                    } else {
                        // Build context for content
                        $contentOutput .= $blockHtml;
                        continue;
                    }
                }

                // Inject overlay only when targeting featured image (Standard Overlay)
                if (
                    $overlayTarget === 'featured-image'
                    && ($overlayIcon || $overlayImage || $overlayText)
                    && in_array($normalizedBlock['blockName'], ['core/post-featured-image', 'woocommerce/product-image', 'jankx/advanced-image-box'], true)
                ) {
                    $blockHtml = $this->wrapWithOverlay(
                        $blockHtml,
                        $overlayIcon,
                        $overlayMode,
                        $overlayType,
                        $overlayImage,
                        $overlayText,
                        $overlayRotate,
                        $overlayColor,
                        $overlayBg,
                        $overlaySize,
                        $overlayPosition
                    );
                }

                $output .= $blockHtml;
            }

            // If Hero Overlay mode, construct the final premium box
            if (($attrs['templateLayout'] ?? '') === 'hero-overlay') {
                // Ensure the box has a background even if image is missing
                $output = sprintf(
                    '<div class="premium-hero-box" style="position:relative;overflow:hidden;min-height:350px;height:100%%;display:flex;align-items:flex-end;border-radius:12px;background:#111;">
                        %s
                        <div class="premium-hero-content" style="position:relative;z-index:10;width:100%%;padding:40px 30px;background:linear-gradient(to top, rgba(0,0,0,1) 0%%, rgba(0,0,0,0.5) 50%%, transparent 100%%);pointer-events:none;">
                            <div style="pointer-events:auto;">%s</div>
                        </div>
                    </div>',
                    $output, // This contains the image wrapper with z-index 1
                    $contentOutput
                );
            }

            // Build wrapper styles and classes for the template item
            $wrapperStyle = $this->buildTemplateItemStyle($attrs);

            // For Hero Overlay, we need the item itself to be the container
            if (($attrs['templateLayout'] ?? '') === 'hero-overlay') {
                $wrapperStyle = rtrim($wrapperStyle, ';') . '; position:relative; overflow:hidden;';
            }
            $wrapperClasses = $this->buildTemplateItemClasses($attrs);

            // If we have styles or classes to apply, wrap the output
            if (!empty($wrapperStyle) || !empty($wrapperClasses)) {
                $styleAttr = !empty($wrapperStyle) ? sprintf(' style="%s"', esc_attr($wrapperStyle)) : '';
                $classAttr = !empty($wrapperClasses) ? sprintf(' class="%s"', esc_attr($wrapperClasses)) : '';
                $output = sprintf('<div%s%s>%s</div>', $classAttr, $styleAttr, $output);
            }

            return $output;
        } catch (\Throwable $exception) {
            Log::error(sprintf(
                'PostTemplateBlockGenerator: render error for post %d - %s',
                $post->ID,
                $exception->getMessage()
            ));
            return '';
        }
    }

    /**
     * Build inline styles for template item from block attributes
     *
     * @param array $attrs Block attributes
     * @return string Inline CSS styles
     */
    protected function buildTemplateItemStyle(array $attrs): string
    {
        $styles = [];

        // Handle spacing, colors, typography, and border using wp_style_engine_get_styles
        if (!empty($attrs['style']) && is_array($attrs['style']) && function_exists('wp_style_engine_get_styles')) {
            $styleConfig = [];

            // Spacing (padding, margin)
            if (!empty($attrs['style']['spacing']) && is_array($attrs['style']['spacing'])) {
                $styleConfig['spacing'] = $attrs['style']['spacing'];
            }

            // Colors (background, text, gradient)
            if (!empty($attrs['style']['color']) && is_array($attrs['style']['color'])) {
                $styleConfig['color'] = $attrs['style']['color'];
            }

            // Typography (font size, line height, etc.)
            if (!empty($attrs['style']['typography']) && is_array($attrs['style']['typography'])) {
                $styleConfig['typography'] = $attrs['style']['typography'];
            }

            // Border
            if (!empty($attrs['style']['border']) && is_array($attrs['style']['border'])) {
                $styleConfig['border'] = $attrs['style']['border'];
            }

            if (!empty($styleConfig)) {
                $generatedStyles = wp_style_engine_get_styles($styleConfig);
                if (!empty($generatedStyles['css'])) {
                    $styles[] = trim($generatedStyles['css']);
                }
            }
        }

        return implode('; ', array_filter($styles));
    }

    /**
     * Build CSS classes for template item from block attributes
     *
     * @param array $attrs Block attributes
     * @return string CSS classes
     */
    protected function buildTemplateItemClasses(array $attrs): string
    {
        $classes = [];

        // Add custom className if present
        if (!empty($attrs['className'])) {
            $customClasses = preg_split('/\s+/', $attrs['className']);
            $customClasses = array_filter(array_map('sanitize_html_class', (array) $customClasses));
            $classes = array_merge($classes, $customClasses);
        }

        // Add color classes if using theme colors
        if (!empty($attrs['backgroundColor'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['backgroundColor']) . '-background-color';
            $classes[] = 'has-background';
        }

        if (!empty($attrs['textColor'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['textColor']) . '-color';
            $classes[] = 'has-text-color';
        }

        if (!empty($attrs['gradient'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['gradient']) . '-gradient-background';
            $classes[] = 'has-background';
        }

        // Add font size class if using preset
        if (!empty($attrs['fontSize'])) {
            $classes[] = 'has-' . sanitize_html_class($attrs['fontSize']) . '-font-size';
        }

        return implode(' ', array_unique(array_filter($classes)));
    }

    protected function wrapWithOverlay(
        string $html,
        string $icon,
        string $mode,
        string $type = 'class',
        string $imageUrl = '',
        string $text = '',
        int $rotate = 0,
        string $color = '#ffffff',
        string $bg = 'rgba(0, 0, 0, 0.5)',
        int $size = 24,
        string $position = 'center'
    ): string {
        $wrapperClasses = 'jankx-thumbnail-overlay-wrapper overlay-mode-' . $mode . ' overlay-pos-' . sanitize_html_class($position);

        $commonStyle = sprintf('style="color:%s;background:%s;font-size:%dpx;"', esc_attr($color), esc_attr($bg), (int) $size);
        $rotateStyle = $rotate !== 0 ? ' style="transform: rotate(' . (int) $rotate . 'deg);"' : '';
        if ($type === 'image' && $imageUrl) {
            $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><img src="%s" alt="" style="width:%dpx;height:%dpx;object-fit:contain;" /></div>', $commonStyle, esc_url($imageUrl), (int) $size, (int) $size);
        } elseif ($type === 'text' && $text !== '') {
            $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><span class="jankx-overlay-icon-text"%s>%s</span></div>', $commonStyle, $rotateStyle, esc_html($text));
        } else {
            $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><i class="%s"%s></i></div>', $commonStyle, esc_attr($icon), $rotateStyle);
        }

        return sprintf(
            '<div class="%s">%s%s</div>',
            esc_attr($wrapperClasses),
            $html,
            $iconHtml
        );
    }

    protected function buildBlockContext(WP_Post $post, WP_Query $query, array $options): array
    {
        return $this->traitBuildBlockContext($post, $query, $options);
    }

    protected function buildItemClasses(WP_Post $post): string
    {
        return $this->traitBuildItemClasses($post);
    }

    protected function buildWrapperAttributes(array $options): array
    {
        return $this->traitBuildWrapperAttributes($options);
    }

    protected function resolveImageRatioValue($ratio, array $options): ?string
    {
        return $this->traitResolveImageRatioValue($ratio, $options);
    }

    protected function stringifyAttributes(array $attributes): string
    {
        return $this->traitStringifyAttributes($attributes);
    }

    protected function getOption(string $key, $default = null)
    {
        if (array_key_exists($key, $this->runtimeOptions)) {
            return $this->runtimeOptions[$key];
        }

        if (array_key_exists($key, $this->parentAttributes)) {
            return $this->parentAttributes[$key];
        }

        $layout = $this->getLayout();
        if ($layout) {
            $options = $layout->getOptions();
            if (array_key_exists($key, $options)) {
                return $options[$key];
            }
        }

        return $default;
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return [];
    }
}
