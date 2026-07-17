<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class CarouselItemLayout
{
    public function getTitle(): string
    {
        return 'Carousel';
    }

    public function getSupportedOptions(): array
    {
        return [
            'thumbnailPosition',
            'slidesToScroll',
            'loop',
            'autoplay',
            'autoplayDelay',
            'showArrows',
            'showDots',
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
}

