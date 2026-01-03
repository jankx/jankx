<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Generators\Concerns\PostTemplateRendererTrait;
use Jankx\Foundation\Application;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use WP_Query;
use WP_Post;

class SsrViewGenerator extends AbstractContentGenerator
{
    use PostTemplateRendererTrait {
        renderCarousel as traitRenderCarousel;
        renderTemplateForPost as traitRenderTemplateForPost;
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
            $html = $this->traitRenderCarousel($query, $options);
            ob_start();
            do_action('jankx/dynamic-data-template/after_loop', $options, $query, $this->getLayout());
            $after = (string) ob_get_clean();
            $html = $before . $html . $after;
            $this->runtimeOptions = [];
            $this->currentLayout = '';
            return $html;
        }

        $wrapperAttributes = $this->traitBuildWrapperAttributes($options);
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

        return sprintf('<ul %s>%s</ul>', $this->traitStringifyAttributes($wrapperAttributes), $items);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [
            'generator' => $this->getName(),
            'templateSlug' => $this->getOption('templateSlug', $options['templateSlug'] ?? null),
        ];
    }

    public function getName(): string
    {
        return 'ssr-view-generator';
    }

    public function getTitle(): string
    {
        return __('SSR View Generator', 'jankx');
    }

    protected function renderTemplateForPost(WP_Post $post, WP_Query $query, array $options): string
    {
        $layoutObj = $this->getLayout();
        $layoutName = method_exists($layoutObj, 'getName') ? (string) $layoutObj->getName() : '';
        $defaultSlug = $layoutName !== '' ? ('layouts/loop/item-' . sanitize_file_name($layoutName)) : 'layouts/loop/item-default';
        $templateSlug = $this->getOption('templateSlug', $options['templateSlug'] ?? $defaultSlug);
        $app = Application::getInstance();

        $variables = [
            'post' => $post,
            'options' => $options,
            'layout' => $this->getLayout(),
            'query' => $query,
            'imageRatio' => $this->getOption('imageRatio', $options['imageRatio'] ?? ''),
            'thumbnailPosition' => $this->getOption('thumbnailPosition', $options['thumbnailPosition'] ?? 'top'),
        ];

        try {
            return DynamicDataTemplateBlock::renderTemplateWithQuery(
                array_merge($this->templateBlock, [
                    'attrs' => array_merge($this->templateBlock['attrs'] ?? [], ['templateSlug' => $templateSlug])
                ]),
                $query,
                $variables
            );
        } catch (\Throwable $e) {
            return '';
        }
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

        $attrs = $this->templateBlock['attrs'] ?? [];
        if (array_key_exists($key, $attrs)) {
            return $attrs[$key];
        }

        return $default;
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return [];
    }
}
