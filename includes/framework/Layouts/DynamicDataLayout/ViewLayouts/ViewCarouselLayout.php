<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewCarouselLayout extends AbstractViewLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        // Get slidesPerView from columns data (desktop columns by default)
        $columns = (int) ($this->getOption('columns') ?: 1);
        $slidesPerView = (int) ($this->getOption('slidesPerView') ?: $columns);
        $spaceBetween = (int) ($this->getOption('spaceBetween') ?: 16);
        // Loop mode disabled by default for better PageSpeed performance (prevents CLS)
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
            'wp-block-jankx-dynamic-ssr-layout',
            'view-type-layout-carousel',
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
            
            <div class="carousel-container">
                <?php
                while ($this->query->have_posts()) {
                    $this->query->the_post();
                    $itemHtml = (string) $this->renderViewItem();
                    if (trim($itemHtml) !== '') {
                        echo '<div class="carousel-slide">';
                        echo $itemHtml;
                        echo '</div>';
                    }
                }
                wp_reset_postdata();
                ?>
            </div>
            
            <!-- Navigation buttons -->
            <button class="carousel-nav carousel-prev" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="carousel-nav carousel-next" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            
            <!-- Pagination dots -->
            <div class="carousel-dots"></div>
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
}
