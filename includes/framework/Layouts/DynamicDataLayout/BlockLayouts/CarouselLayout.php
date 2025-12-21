<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class CarouselLayout extends BlockTemplateLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $slidesPerView = (int) $this->getOption('slidesPerView', 1);
        $spaceBetween = (int) $this->getOption('spaceBetween', 16);
        $loop = (bool) $this->getOption('loop', false);
        $autoplay = (bool) $this->getOption('autoplay', false);
        $autoplayDelay = (int) $this->getOption('autoplayDelay', 3000);
        $showArrows = (bool) $this->getOption('showArrows', true);
        $showDots = (bool) $this->getOption('showDots', true);
        $carouselAlign = $this->getOption('carouselAlign', 'start');
        $carouselContainScroll = $this->getOption('carouselContainScroll', 'trimSnaps');
        $carouselAxis = $this->getOption('carouselAxis', 'x');
        $carouselDirection = $this->getOption('carouselDirection', 'ltr');
        $carouselDuration = (int) $this->getOption('carouselDuration', 25);

        $carouselClasses = [
            'wp-block-jankx-dynamic-data-layout',
            'post-type-layout-carousel',
            'carousel',
        ];

        if ($showArrows) {
            $carouselClasses[] = 'has-arrows';
        }
        if ($showDots) {
            $carouselClasses[] = 'has-dots';
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $carouselClasses)); ?>"
            data-slides-per-view="<?php echo esc_attr($slidesPerView); ?>"
            data-space-between="<?php echo esc_attr($spaceBetween); ?>"
            data-loop="<?php echo $loop ? 'true' : 'false'; ?>"
            data-autoplay="<?php echo $autoplay ? 'true' : 'false'; ?>"
            data-autoplay-delay="<?php echo esc_attr($autoplayDelay); ?>"
            data-align="<?php echo esc_attr($carouselAlign); ?>"
            data-contain-scroll="<?php echo esc_attr($carouselContainScroll); ?>"
            data-axis="<?php echo esc_attr($carouselAxis); ?>"
            data-direction="<?php echo esc_attr($carouselDirection); ?>"
            data-duration="<?php echo esc_attr($carouselDuration); ?>">
            
            <?php if ($showArrows): ?>
                <button class="carousel-arrow carousel-arrow-prev">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="carousel-arrow carousel-arrow-next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            <?php endif; ?>

            <div class="carousel-viewport">
                <div class="carousel-container">
                    <?php
                    while ($this->query->have_posts()) {
                        $this->query->the_post();
                        echo '<div class="carousel-slide">';
                        echo $this->renderPostItem();
                        echo '</div>';
                    }
                    wp_reset_postdata();
                    ?>
                </div>
            </div>

            <?php if ($showDots): ?>
                <div class="carousel-dots"></div>
            <?php endif; ?>
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
                'name' => 'slidesPerView',
                'label' => __('Slides Per View', 'jankx'),
                'type' => 'range',
                'default' => 1,
                'min' => 1,
                'max' => 6,
                'step' => 1,
                'help' => __('Number of slides visible at once', 'jankx'),
            ],
            [
                'name' => 'spaceBetween',
                'label' => __('Space Between', 'jankx'),
                'type' => 'range',
                'default' => 16,
                'min' => 0,
                'max' => 50,
                'step' => 4,
                'help' => __('Space between slides in pixels', 'jankx'),
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
}
