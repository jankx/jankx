<?php

namespace Jankx\Layouts\PostLayout\Generators;

use Jankx\Layouts\PostLayout\Generators\Concerns\PostTemplateRendererTrait;
use WP_Post;
use WP_Query;

/**
 * Generator sử dụng inner blocks của `jankx/post-layout-template` để render bài viết.
 */
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

    /**
     * {@inheritDoc}
     */
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

    /**
     * {@inheritDoc}
     */
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
        return $this->traitRenderTemplateForPost($post, $query, $options);
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
