<?php

namespace Jankx\Layouts\PostLayout\Supports;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutJsCallbackInterface;
use Jankx\Layouts\PostLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Layouts\PostLayout\PostLayout;

/**
 * Carousel Layout
 *
 * Hiển thị posts dạng carousel với navigation và autoplay support
 *
 * @package Jankx\Layouts\PostLayout\Supports
 */
class CarouselLayout extends PostLayout implements PostLayoutJsCallbackInterface
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    /**
     * Render layout with support for custom generators and template blocks.
     */
    public function render(): string
    {
        if (!$this->query) {
            return '';
        }

        $generator = $this->getContentGenerator();
        if (!$generator) {
            return '';
        }

        if ($generator instanceof PostTemplateBlockGenerator) {
            $html = $generator->generate($this->query, $this->options);
            return is_string($html) ? $html : '';
        }

        if ($this->hasCustomGenerator()) {
            return $this->renderCustomGenerator($generator);
        }

        return $this->renderDefault();
    }

    /**
     * {@inheritDoc}
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }
        $options = $this->buildCarouselOptions($this->options);

        return CarouselHtmlBuilder::renderFromQuery(
            $this->query,
            function (): string {
                return $this->renderPostItem();
            },
            $options
        );
    }

    /**
     * {@inheritDoc}
     */
    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'carousel',
            'columns' => $this->getOption('columns', 3),
            'slidesToScroll' => $this->getOption('slidesToScroll', 1),
            'loop' => $this->getOption('loop', false),
            'autoplay' => $this->getOption('autoplay', false),
            'supportedOptions' => $this->getSupportedOptions(),
            'previewItems' => $this->generatePreviewItems(),
        ];
    }

    /**
     * Generate preview items for editor
     *
     * @return array
     */
    protected function generatePreviewItems(): array
    {
        $count = min($this->getOption('postsPerPage', 6), 6);
        $items = [];

        for ($i = 0; $i < $count; $i++) {
            $items[] = [
                'id' => $i + 1,
                'title' => sprintf(__('Post Title %d', 'jankx'), $i + 1),
                'excerpt' => __('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...', 'jankx'),
                'date' => date('Y-m-d'),
                'author' => 'Admin',
                'thumbnail' => true,
            ];
        }

        return $items;
    }

    /**
     * {@inheritDoc}
     */
    public function getSupportedOptions(): array
    {
        return [
            'columns',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
            'slidesToScroll',
            'loop',
            'autoplay',
            'autoplayDelay',
            'showArrows',
            'showDots',
            'itemStyle',
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getReadOnlyOptions(): array
    {
        return [
            'showTitle', // Carousel layout cần title để có ý nghĩa
        ];
    }

    public function wrapTemplateHtml(string $html, array $options = []): string
    {
        if (strpos($html, 'post-type-layout-carousel') !== false) {
            return $html;
        }

        $options = $this->buildCarouselOptions($options + $this->options);

        if ($html === '') {
            return '';
        }

        $itemsWrapperClass = (string)($options['itemsWrapperClass'] ?? '');
        $itemClass = (string)($options['itemClass'] ?? '');

        $slidesHtml = '';

        if ($itemClass !== '') {
            $slidesHtml = CarouselSlideExtractor::extract($html, $itemsWrapperClass, $itemClass);
        }

        if ($slidesHtml === '') {
            $slidesHtml = '<div class="embla__slide">' . $html . '</div>';
        }

        return CarouselHtmlBuilder::render($slidesHtml, $options);
    }

    protected function renderCustomGenerator($generator): string
    {
        $generated = $generator->generate($this->query, $this->options);
        if (empty($generated)) {
            return '';
        }

        $options = $this->buildCarouselOptions($this->options);
        $itemsWrapperClass = (string)($options['itemsWrapperClass'] ?? '');
        $itemClass = (string)($options['itemClass'] ?? '');

        $slidesHtml = CarouselSlideExtractor::extract($generated, $itemsWrapperClass, $itemClass);
        if ($slidesHtml === '') {
            $slidesHtml = '<div class="embla__slide">' . $generated . '</div>';
        }

        $carouselHtml = CarouselHtmlBuilder::render($slidesHtml, $options);

        if (method_exists($generator, 'wrapCarouselHtml')) {
            return $generator->wrapCarouselHtml($this->query, $this->options, $carouselHtml);
        }

        return $carouselHtml;
    }

    /**
     * Normalize carousel-related options for helpers.
     *
     * @param array $options
     * @return array
     */
    protected function buildCarouselOptions(array $options): array
    {
        $queryOptions = [
            'columns' => $options['columns'] ?? $this->getOption('columns', 3),
            'columnsTablet' => $options['columnsTablet'] ?? $this->getOption('columnsTablet', 2),
            'columnsMobile' => $options['columnsMobile'] ?? $this->getOption('columnsMobile', 1),
            'slidesToScroll' => $options['slidesToScroll'] ?? $this->getOption('slidesToScroll', 1),
            'loop' => $options['loop'] ?? $this->getOption('loop', false),
            'autoplay' => $options['autoplay'] ?? $this->getOption('autoplay', false),
            'autoplayDelay' => $options['autoplayDelay'] ?? $this->getOption('autoplayDelay', 3000),
            'showArrows' => $options['showArrows'] ?? $this->getOption('showArrows', true),
            'showDots' => $options['showDots'] ?? $this->getOption('showDots', true),
            'itemsWrapperClass' => $options['itemsWrapperClass'] ?? $this->getOption('itemsWrapperClass', ''),
            'itemClass' => $options['itemClass'] ?? $this->getOption('itemClass', ''),
        ];

        if (isset($options['imageRatio']) && $options['imageRatio'] !== '') {
            $queryOptions['imageRatio'] = $options['imageRatio'];
        } else {
            $imageRatio = $this->getOption('imageRatio', '');
            if ($imageRatio !== '') {
                $queryOptions['imageRatio'] = $imageRatio;
            }
        }

        return $queryOptions;
    }

    public function getJsInitKey(): string
    {
        return 'carousel';
    }

    public function getJsInitPayload(): array
    {
        $options = $this->buildCarouselOptions($this->options);

        return [
            'postType' => $this->getOption('postType', 'post'),
            'queryId' => $this->getOption('queryId'),
            'columns' => (int) ($options['columns'] ?? 3),
            'columnsTablet' => (int) ($options['columnsTablet'] ?? 2),
            'columnsMobile' => (int) ($options['columnsMobile'] ?? 1),
            'slidesToScroll' => (int) ($options['slidesToScroll'] ?? 1),
            'loop' => !empty($options['loop']),
            'autoplay' => !empty($options['autoplay']),
            'autoplayDelay' => (int) ($options['autoplayDelay'] ?? 3000),
            'showArrows' => !empty($options['showArrows']),
            'showDots' => !empty($options['showDots']),
        ];
    }

    public function needsJsInit(): bool
    {
        return true;
    }
}

