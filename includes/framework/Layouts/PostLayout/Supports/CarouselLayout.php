<?php

namespace Jankx\Layouts\PostLayout\Supports;

use Jankx\Layouts\PostLayout\PostLayout;

/**
 * Carousel Layout
 *
 * Hiển thị posts dạng carousel với navigation và autoplay support
 *
 * @package Jankx\Layouts\PostLayout\Supports
 */
class CarouselLayout extends PostLayout
{
    protected $name = 'carousel';
    protected $title = 'Carousel Layout';

    /**
     * {@inheritDoc}
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = $this->getOption('columns', 3);
        $slidesToScroll = $this->getOption('slidesToScroll', 1);
        $loop = $this->getOption('loop', false);
        $autoplay = $this->getOption('autoplay', false);
        $autoplayDelay = $this->getOption('autoplayDelay', 3000);
        $showArrows = $this->getOption('showArrows', true);
        $showDots = $this->getOption('showDots', true);
        
        $wrapper_class = sprintf('post-type-layout-carousel columns-%d', $columns);
        
        // Build data attributes for Embla Carousel
        $data_attrs = [
            'data-embla-carousel' => '',
            'data-slides-per-view' => $columns,
            'data-slides-to-scroll' => $slidesToScroll,
        ];
        
        if ($loop) {
            $data_attrs['data-loop'] = 'true';
        }
        
        if ($autoplay) {
            $data_attrs['data-autoplay'] = 'true';
            $data_attrs['data-autoplay-delay'] = $autoplayDelay;
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr($wrapper_class); ?>" <?php
            foreach ($data_attrs as $key => $value) {
                echo esc_attr($key) . '="' . esc_attr($value) . '" ';
            }
        ?>>
            <div class="embla__viewport">
                <div class="embla__container">
                    <?php
                    while ($this->query->have_posts()) {
                        $this->query->the_post();
                        echo '<div class="embla__slide">';
                        echo $this->renderPostItem();
                        echo '</div>';
                    }
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
            
            <?php if ($showArrows) : ?>
                <button class="embla__button embla__button--prev" type="button" aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button class="embla__button embla__button--next" type="button" aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            <?php endif; ?>
            
            <?php if ($showDots) : ?>
                <div class="embla__dots"></div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
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
}

