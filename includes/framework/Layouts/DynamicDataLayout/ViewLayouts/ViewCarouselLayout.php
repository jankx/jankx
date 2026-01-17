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

        $navBaseStyle = 'position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;background:rgba(0,0,0,0.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;border:none;';
        $prevStyle = $navBaseStyle . 'left:10px;';
        $nextStyle = $navBaseStyle . 'right:10px;';
        $dotsStyle = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2;';

        $carouselClasses = [
            'jankx-carousel',
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
        <div class="<?php echo esc_attr(implode(' ', $carouselClasses)); ?>" style="position: relative;"
            data-slides-per-view="<?php echo esc_attr($slidesPerView); ?>"
            data-space-between="<?php echo esc_attr($spaceBetween); ?>" data-loop="<?php echo $loop ? 'true' : 'false'; ?>"
            data-autoplay="<?php echo $autoplay ? 'true' : 'false'; ?>"
            data-autoplay-delay="<?php echo esc_attr($autoplayDelay); ?>" data-align="<?php echo esc_attr($carouselAlign); ?>"
            data-contain-scroll="<?php echo esc_attr($carouselContainScroll); ?>"
            data-axis="<?php echo esc_attr($carouselAxis); ?>" data-direction="<?php echo esc_attr($carouselDirection); ?>"
            data-duration="<?php echo esc_attr($carouselDuration); ?>">

            <div class="jankx-carousel-container carousel-container">
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
            <button class="carousel-nav carousel-prev" type="button" style="<?php echo esc_attr($prevStyle); ?>">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="carousel-nav carousel-next" type="button" style="<?php echo esc_attr($nextStyle); ?>">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <!-- Pagination dots -->
            <div class="carousel-dots" style="<?php echo esc_attr($dotsStyle); ?>"></div>
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
