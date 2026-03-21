<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

/**
 * Carousel Layout Data Parser
 * 
 * Handles the calculation of carousel-specific attributes, styles, and classes.
 */
class CarouselLayoutDataParser extends DefaultLayoutDataParser
{
    /**
     * Parse carousel-specific data
     * 
     * @return array
     */
    public function parse(): array
    {
        $data = parent::parse();
        $options = $this->layout->getOptions();

        $slidesPerView = (int) ($options['slidesPerView'] ?? ($options['columns'] ?? 1));
        $spaceBetween = (int) ($options['spaceBetween'] ?? 16);
        $loop = (bool) ($options['loop'] ?? false);
        $autoplay = (bool) ($options['autoplay'] ?? false);
        $autoplayDelay = (int) ($options['autoplayDelay'] ?? 3000);
        $showArrows = (bool) ($options['showArrows'] ?? true);
        $showDots = (bool) ($options['showDots'] ?? true);
        $carouselAlign = $options['carouselAlign'] ?? 'start';
        $carouselContainScroll = $options['carouselContainScroll'] ?? 'trimSnaps';
        $carouselAxis = $options['carouselAxis'] ?? 'x';
        $carouselDirection = $options['carouselDirection'] ?? 'ltr';
        $carouselDuration = (int) ($options['carouselDuration'] ?? 25);

        $carouselClasses = [
            'post-type-layout-carousel',
            'carousel',
        ];

        $navBaseStyle = 'position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;background:rgba(0,0,0,0.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;border:none;';
        $prevStyle = $navBaseStyle . 'left:10px;';
        $nextStyle = $navBaseStyle . 'right:10px;';
        $dotsStyle = 'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2;';

        if ($showArrows) {
            $carouselClasses[] = 'has-arrows';
        }
        if ($showDots) {
            $carouselClasses[] = 'has-dots';
        }

        $data_attributes = [
            'slides-per-view' => (string)$slidesPerView,
            'space-between' => (string)$spaceBetween,
            'loop' => $loop ? 'true' : 'false',
            'autoplay' => $autoplay ? 'true' : 'false',
            'autoplay-delay' => (string)$autoplayDelay,
            'align' => $carouselAlign,
            'contain-scroll' => $carouselContainScroll,
            'axis' => $carouselAxis,
            'direction' => $carouselDirection,
            'duration' => (string)$carouselDuration,
        ];

        $data['carousel_classes'] = $carouselClasses;
        $data['data_attributes'] = $data_attributes;
        $data['show_arrows'] = $showArrows;
        $data['prev_style'] = $prevStyle;
        $data['next_style'] = $nextStyle;
        $data['show_dots'] = $showDots;
        $data['dots_style'] = $dotsStyle;

        return $data;
    }
}
