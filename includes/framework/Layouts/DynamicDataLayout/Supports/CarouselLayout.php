<?php

namespace Jankx\Layouts\DynamicDataLayout\Supports;

use Jankx\Layouts\DynamicDataLayout\PostLayout;

class CarouselLayout extends PostLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        // Use template generator if available; otherwise render simple carousel wrapper
        $columns = (int) $this->getOption('columns', 3);
        $columnsTablet = (int) $this->getOption('columnsTablet', 2);
        $columnsMobile = (int) $this->getOption('columnsMobile', 1);
        $slidesToScroll = max(1, (int) $this->getOption('slidesToScroll', 1));

        $attrs = [
            'class' => sprintf(
                'wp-block-jankx-dynamic-data-layout post-type-layout-carousel columns-%d columns-tablet-%d columns-mobile-%d',
                max(1, $columns), max(1, $columnsTablet), max(1, $columnsMobile)
            ),
            'data-embla-carousel' => '',
            'data-slides-per-view' => (string) max(1, $columns),
            'data-slides-to-scroll' => (string) $slidesToScroll,
        ];

        $attrString = '';
        foreach ($attrs as $k => $v) {
            $attrString .= sprintf('%s="%s" ', esc_attr($k), esc_attr($v));
        }

        ob_start();
        ?>
        <div <?php echo trim($attrString); ?>>
            <div class="embla__viewport">
                <div class="embla__container">
                    <?php
                    while ($this->query->have_posts()) {
                        $this->query->the_post();
                        echo sprintf('<div class="embla__slide"><div class="wp-block-post">%s</div></div>', $this->renderPostItem());
                    }
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
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
            'columns',
            'columnsTablet',
            'columnsMobile',
            'slidesToScroll',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
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
                'name' => 'slidesToScroll',
                'label' => __('Slides To Scroll', 'jankx'),
                'type' => 'range',
                'default' => 1,
                'min' => 1,
                'max' => 6, // Should be dynamic based on columns, but static for now
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
                    [
                        'name' => 'carouselDragFree',
                        'label' => __('Drag Free', 'jankx'),
                        'type' => 'toggle',
                        'default' => false,
                        'help' => __('Allow free dragging without snapping', 'jankx'),
                    ],
                    [
                        'name' => 'carouselSkipSnaps',
                        'label' => __('Skip Snaps', 'jankx'),
                        'type' => 'toggle',
                        'default' => false,
                        'help' => __('Allow skipping snaps during fast scroll', 'jankx'),
                    ],
                    [
                        'name' => 'carouselDragThreshold',
                        'label' => __('Drag Threshold', 'jankx'),
                        'type' => 'range',
                        'default' => 10,
                        'min' => 0,
                        'max' => 50,
                        'help' => __('Minimum distance to trigger drag', 'jankx'),
                    ],
                    [
                        'name' => 'carouselInViewThreshold',
                        'label' => __('In View Threshold', 'jankx'),
                        'type' => 'range',
                        'default' => 0,
                        'min' => 0,
                        'max' => 1,
                        'step' => 0.1,
                        'help' => __('Percentage of slide visible to be considered in view (0-1)', 'jankx'),
                    ],
                    [
                        'name' => 'carouselStartIndex',
                        'label' => __('Start Index', 'jankx'),
                        'type' => 'range',
                        'default' => 0,
                        'min' => 0,
                        'max' => 10,
                        'help' => __('Initial slide index', 'jankx'),
                    ],
                ]
            ]
        ];
    }
}
