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

    protected function renderContent(WP_Query $query, array $options = []): string
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

        return sprintf('%s<ul %s>%s</ul>%s', $before, $this->stringifyAttributes($wrapperAttributes), $items, $after);
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
        
        // Get overlay settings
        $attrs = $this->templateBlock['attrs'] ?? [];
        $overlayIcon = $attrs['overlayIcon'] ?? '';
        $overlayMode = $attrs['overlayIconMode'] ?? 'always-show';

        try {
            $innerBlocks = $this->templateBlock['innerBlocks'] ?? [];

            if (empty($innerBlocks)) {
                return '';
            }

            $output = '';
            foreach ($innerBlocks as $innerBlock) {
                $normalizedBlock = [
                    'blockName' => $innerBlock['blockName'] ?? '',
                    'attrs' => is_array($innerBlock['attrs'] ?? null) ? $innerBlock['attrs'] : [],
                    'innerBlocks' => is_array($innerBlock['innerBlocks'] ?? null) ? $innerBlock['innerBlocks'] : [],
                    'innerContent' => is_array($innerBlock['innerContent'] ?? null) ? $innerBlock['innerContent'] : [],
                ];

                if (!empty($innerBlock['originalContent'])) {
                    $normalizedBlock['originalContent'] = $innerBlock['originalContent'];
                }

                $blockInstance = new WP_Block($normalizedBlock, $context);
                $blockHtml = $blockInstance->render();

                // Inject overlay if it's a featured image block
                if ($overlayIcon && in_array($normalizedBlock['blockName'], ['core/post-featured-image', 'woocommerce/product-image', 'jankx/advanced-image-box'])) {
                    $blockHtml = $this->wrapWithOverlay($blockHtml, $overlayIcon, $overlayMode);
                }

                $output .= $blockHtml;
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

    protected function wrapWithOverlay(string $html, string $icon, string $mode): string
    {
        $wrapperClasses = 'jankx-thumbnail-overlay-wrapper';
        $wrapperClasses .= ' overlay-mode-' . $mode;
        
        $iconHtml = sprintf('<div class="jankx-overlay-icon"><i class="%s"></i></div>', esc_attr($icon));
        
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

