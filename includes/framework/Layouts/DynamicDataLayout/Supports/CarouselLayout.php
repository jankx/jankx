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
                'post-type-layout-carousel columns-%d columns-tablet-%d columns-mobile-%d',
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
}

