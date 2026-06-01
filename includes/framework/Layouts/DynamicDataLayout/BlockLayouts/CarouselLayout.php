<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class CarouselLayout extends BlockTemplateLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    public function getIcon(): string
    {
        return 'dashicons-images-alt2';
    }

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        return $this->renderView('post-layout/carousel', $this->getTemplateData());
    }

    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'carousel',
            'supportedOptions' => $this->getSupportedOptions(),
        ];
    }

    public function getSupportedOptions(): array
    {
        return [
            'slidesPerView',
            'spaceBetween',
            'loop',
            'autoplay',
            'autoplayDelay',
            'showArrows',
            'showDots',
            'carouselAlign',
            'carouselContainScroll',
            'carouselAxis',
            'carouselDirection',
            'carouselDuration',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
            'itemStyle',
            'carouselPeek',
        ];
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }

    public function getSettingsDefinition(): array
    {
        return [

            [
                'name' => 'carouselPeek',
                'label' => __('Peeking Amount (%)', 'jankx'),
                'type' => 'range',
                'default' => 0,
                'min' => 0,
                'max' => 50,
                'step' => 5,
                'help' => __('Reveal portion of the next slide (e.g., 20% shows a bit of the 4th item if 3 columns)', 'jankx'),
            ],

            [
                'name' => 'slidesToScroll',
                'label' => __('Slides to Scroll', 'jankx'),
                'type' => 'range',
                'default' => 1,
                'min' => 1,
                'max' => 6,
                'step' => 1,
                'help' => __('Number of slides to scroll at a time', 'jankx'),
            ],
            [
                'name' => 'loop',
                'label' => __('Loop', 'jankx'),
                'type' => 'toggle',
                'default' => false,
                'help' => __('Enable infinite loop', 'jankx'),
            ],
            [
                'name' => 'autoplay',
                'label' => __('Autoplay', 'jankx'),
                'type' => 'toggle',
                'default' => false,
                'help' => __('Automatically advance slides', 'jankx'),
            ],
            [
                'name' => 'autoplayDelay',
                'label' => __('Autoplay Delay (ms)', 'jankx'),
                'type' => 'range',
                'default' => 3000,
                'min' => 1000,
                'max' => 10000,
                'step' => 500,
                'condition' => ['autoplay' => true],
                'help' => __('Time between autoplay transitions', 'jankx'),
            ],
            [
                'name' => 'showArrows',
                'label' => __('Show Arrows', 'jankx'),
                'type' => 'toggle',
                'default' => true,
                'help' => __('Display navigation arrows', 'jankx'),
            ],
            [
                'name' => 'showDots',
                'label' => __('Show Dots', 'jankx'),
                'type' => 'toggle',
                'default' => true,
                'help' => __('Display pagination dots', 'jankx'),
            ],
            [
                'name' => 'carouselAlign',
                'label' => __('Alignment', 'jankx'),
                'type' => 'select',
                'default' => 'start',
                'options' => [
                    ['label' => __('Start', 'jankx'), 'value' => 'start'],
                    ['label' => __('Center', 'jankx'), 'value' => 'center'],
                    ['label' => __('End', 'jankx'), 'value' => 'end'],
                ],
                'help' => __('Align slides within the viewport', 'jankx'),
            ],
            [
                'name' => 'carouselContainScroll',
                'label' => __('Scroll Containment', 'jankx'),
                'type' => 'select',
                'default' => 'trimSnaps',
                'options' => [
                    ['label' => __('False (No constrain)', 'jankx'), 'value' => 'false'],
                    ['label' => __('Trim Snaps', 'jankx'), 'value' => 'trimSnaps'],
                    ['label' => __('Keep Snaps', 'jankx'), 'value' => 'keepSnaps'],
                ],
                'help' => __('Constrain scrolling to bounds', 'jankx'),
            ],
            [
                'type' => 'panel',
                'title' => __('Advanced Carousel Settings', 'jankx'),
                'initialOpen' => false,
                'controls' => [
                    [
                        'name' => 'carouselAxis',
                        'label' => __('Axis', 'jankx'),
                        'type' => 'select',
                        'default' => 'x',
                        'options' => [
                            ['label' => __('Horizontal (X)', 'jankx'), 'value' => 'x'],
                            ['label' => __('Vertical (Y)', 'jankx'), 'value' => 'y'],
                        ],
                    ],
                    [
                        'name' => 'carouselDirection',
                        'label' => __('Direction', 'jankx'),
                        'type' => 'select',
                        'default' => 'ltr',
                        'options' => [
                            ['label' => __('LTR (Left to Right)', 'jankx'), 'value' => 'ltr'],
                            ['label' => __('RTL (Right to Left)', 'jankx'), 'value' => 'rtl'],
                        ],
                    ],
                    [
                        'name' => 'carouselDuration',
                        'label' => __('Duration (ms)', 'jankx'),
                        'type' => 'range',
                        'default' => 25,
                        'min' => 0,
                        'max' => 100,
                        'help' => __('Transition duration', 'jankx'),
                    ],
                ],
            ],
        ];
    }

    protected function getContainerStructure(array $options): array
    {
        $structure = parent::getContainerStructure($options);
        $structure['classes'][] = 'carousel';
        $structure['classes'][] = 'dynamic-data-layout--carousel';
        $structure['classes'][] = 'post-type-layout-carousel';
        
        $slidesPerView = (int) ($options['slidesPerView'] ?? ($options['columns'] ?? 1));
        
        // Embla specific attributes
        $structure['attributes']['data-embla-carousel'] = ''; 
        $structure['attributes']['data-slides-per-view'] = (string)$slidesPerView;
        $structure['attributes']['data-space-between'] = (string)($options['spaceBetween'] ?? 16);
        
        if (!empty($options['loop']) || !empty($options['carouselLoop'])) {
            $structure['attributes']['data-loop'] = 'true';
        }
        if (!empty($options['autoplay']) || !empty($options['carouselAutoplay'])) {
            $structure['attributes']['data-autoplay'] = 'true';
        }
        if (!empty($options['autoplayDelay']) || !empty($options['carouselAutoplayDelay'])) {
            $structure['attributes']['data-autoplay-delay'] = (string)($options['autoplayDelay'] ?? $options['carouselAutoplayDelay']);
        }
        
        $structure['attributes']['data-align'] = $options['carouselAlign'] ?? 'start';
        $structure['attributes']['data-contain-scroll'] = $options['carouselContainScroll'] ?? 'trimSnaps';
        $structure['attributes']['data-axis'] = $options['carouselAxis'] ?? 'x';
        $structure['attributes']['data-direction'] = $options['carouselDirection'] ?? 'ltr';
        $structure['attributes']['data-duration'] = (string)($options['carouselDuration'] ?? 25);
        $structure['attributes']['data-slides-to-scroll'] = (string)($options['slidesToScroll'] ?? 1);
        $structure['attributes']['data-start-index'] = (string)($options['carouselStartIndex'] ?? 0);
        $structure['attributes']['data-drag-threshold'] = (string)($options['carouselDragThreshold'] ?? 10);
        $structure['attributes']['data-peek-amount'] = (string)($options['carouselPeek'] ?? 0);
        
        if (isset($options['carouselInViewThreshold'])) {
            $structure['attributes']['data-in-view-threshold'] = (string)$options['carouselInViewThreshold'];
        }
        if (!empty($options['carouselDragFree'])) {
            $structure['attributes']['data-drag-free'] = 'true';
        }
        if (!empty($options['carouselSkipSnaps'])) {
            $structure['attributes']['data-skip-snaps'] = 'true';
        }
        
        // Add embla viewport and container
        $structure['children'] = [
            [
                'tag' => 'div',
                'classes' => ['carousel-viewport', 'embla__viewport'],
                'children' => [
                    [
                        'tag' => 'div',
                        'classes' => ['carousel-container', 'embla__container'],
                    ],
                ],
            ],
        ];
        
        return $structure;
    }

    protected function getItemWrapperStructure(array $options): array
    {
        // For carousel, items are wrapped in carousel-slide div (which corresponds to embla__slide)
        // and then they contain the standard post article
        return [
            'tag' => 'div',
            'classes' => ['carousel-slide', 'embla__slide'],
            'children' => [
                parent::getItemWrapperStructure($options),
            ],
        ];
    }
}
