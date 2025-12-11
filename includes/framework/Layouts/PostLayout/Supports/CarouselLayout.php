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
            'carouselAlign',
            'carouselAxis',
            'carouselDirection',
            'carouselStartIndex',
            'carouselDuration',
            'carouselDragFree',
            'carouselDragThreshold',
            'carouselSkipSnaps',
            'carouselContainScroll',
            'carouselInViewThreshold',
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
            // Embla carousel options
            'carouselAlign' => $options['carouselAlign'] ?? $this->getOption('carouselAlign', 'start'),
            'carouselAxis' => $options['carouselAxis'] ?? $this->getOption('carouselAxis', 'x'),
            'carouselDirection' => $options['carouselDirection'] ?? $this->getOption('carouselDirection', 'ltr'),
            'carouselStartIndex' => $options['carouselStartIndex'] ?? $this->getOption('carouselStartIndex', 0),
            'carouselDuration' => $options['carouselDuration'] ?? $this->getOption('carouselDuration', 25),
            'carouselDragFree' => $options['carouselDragFree'] ?? $this->getOption('carouselDragFree', false),
            'carouselDragThreshold' => $options['carouselDragThreshold'] ?? $this->getOption('carouselDragThreshold', 10),
            'carouselSkipSnaps' => $options['carouselSkipSnaps'] ?? $this->getOption('carouselSkipSnaps', false),
            'carouselContainScroll' => $options['carouselContainScroll'] ?? $this->getOption('carouselContainScroll', 'trimSnaps'),
            'carouselInViewThreshold' => $options['carouselInViewThreshold'] ?? $this->getOption('carouselInViewThreshold', 0),
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

    /**
     * {@inheritDoc}
     */
    public function getHtmlStructure(array $options = []): array
    {
        $mergedOptions = array_merge($this->options, $options);
        $carouselOptions = $this->buildCarouselOptions($mergedOptions);
        // Merge back showFeaturedImage and thumbnailPosition for itemWrapper
        $itemWrapperOptions = array_merge($carouselOptions, [
            'showFeaturedImage' => $mergedOptions['showFeaturedImage'] ?? $this->getOption('showFeaturedImage', true),
            'thumbnailPosition' => $mergedOptions['thumbnailPosition'] ?? $this->getOption('thumbnailPosition', 'top'),
        ]);
        
        return [
            'layout' => $this->name,
            'container' => $this->getContainerStructure($carouselOptions),
            'itemWrapper' => $this->getItemWrapperStructure($itemWrapperOptions),
            'emptyState' => $this->getEmptyStateStructure($mergedOptions),
            'paginationWrapper' => $this->getPaginationWrapperStructure($mergedOptions),
        ];
    }

    /**
     * {@inheritDoc}
     * Carousel layout has special structure with embla__viewport and embla__container
     */
    protected function getContainerStructure(array $options): array
    {
        $classes = [
            'post-type-layout-carousel',
            'jankx-carousel',
            'embla',
            'columns-' . intval($options['columns'] ?? 3),
            'columns-tablet-' . intval($options['columnsTablet'] ?? 2),
            'columns-mobile-' . intval($options['columnsMobile'] ?? 1),
        ];

        $styles = [
            '--carousel-columns' => (string) intval($options['columns'] ?? 3),
            '--carousel-columns-tablet' => (string) intval($options['columnsTablet'] ?? 2),
            '--carousel-columns-mobile' => (string) intval($options['columnsMobile'] ?? 1),
        ];

        if (!empty($options['imageRatio'])) {
            $styles['--jankx-image-ratio'] = (string) $options['imageRatio'];
            $classes[] = 'has-image-ratio';
        }

        $attributes = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => (string) intval($options['columns'] ?? 3),
            'data-slides-to-scroll' => (string) intval($options['slidesToScroll'] ?? 1),
            'data-layout' => $this->name,
            'data-align' => $options['carouselAlign'] ?? 'start',
            'data-axis' => $options['carouselAxis'] ?? 'x',
            'data-direction' => $options['carouselDirection'] ?? 'ltr',
            'data-start-index' => (string) intval($options['carouselStartIndex'] ?? 0),
            'data-duration' => (string) intval($options['carouselDuration'] ?? 25),
            'data-drag-threshold' => (string) intval($options['carouselDragThreshold'] ?? 10),
            'data-contain-scroll' => $options['carouselContainScroll'] ?? 'trimSnaps',
            'data-in-view-threshold' => (string) floatval($options['carouselInViewThreshold'] ?? 0),
        ];

        if (!empty($options['loop'])) {
            $attributes['data-loop'] = 'true';
        }

        if (!empty($options['autoplay'])) {
            $attributes['data-autoplay'] = 'true';
            $attributes['data-autoplay-delay'] = (string) intval($options['autoplayDelay'] ?? 3000);
        }

        if (!empty($options['carouselDragFree'])) {
            $attributes['data-drag-free'] = 'true';
        }

        if (!empty($options['carouselSkipSnaps'])) {
            $attributes['data-skip-snaps'] = 'true';
        }

        // Carousel structure: container -> embla__viewport -> embla__container -> embla__slide items
        return [
            'tag' => 'div',
            'classes' => $classes,
            'styles' => $styles,
            'attributes' => $attributes,
            'children' => [
                [
                    'tag' => 'div',
                    'classes' => ['embla__viewport'],
                    'children' => [
                        [
                            'tag' => 'div',
                            'classes' => ['embla__container'],
                            'placeholder' => 'carousel-slides', // Placeholder for slides
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * {@inheritDoc}
     * Carousel layout wraps each item in embla__slide
     */
    protected function getItemWrapperStructure(array $options): array
    {
        // First get the base post item structure
        $postItemClasses = ['post-item'];
        
        $thumbnailPosition = $options['thumbnailPosition'] ?? 'top';
        if (in_array($thumbnailPosition, ['top', 'bottom', 'left', 'right'], true)) {
            $postItemClasses[] = 'thumbnail-position-' . $thumbnailPosition;
        }

        $hasThumbnail = !empty($options['showFeaturedImage']);
        $postItemClasses[] = $hasThumbnail ? 'has-thumbnail' : 'no-thumbnail';

        // Carousel wraps each post item in embla__slide
        return [
            'tag' => 'div',
            'classes' => ['embla__slide'],
            'children' => [
                [
                    'tag' => 'article',
                    'classes' => $postItemClasses,
                    'attributes' => [
                        'id' => 'post-{{post-id}}',
                    ],
                    'placeholder' => 'post-content', // Placeholder for post item content
                ],
            ],
        ];
    }
}

