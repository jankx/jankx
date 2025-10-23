<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SlideshowContainerBlock extends Block
{
    protected $blockId = 'jankx/slideshow-container';

    /**
     * Allow SVG tags in content and replace fill with currentColor
     */
    private function allow_svg_tags($content) {
        $allowed_tags = wp_kses_allowed_html('post');
        $allowed_tags['svg'] = [
            'width' => true,
            'height' => true,
            'viewBox' => true,
            'fill' => true,
            'xmlns' => true,
            'class' => true,
            'style' => true,
        ];
        $allowed_tags['path'] = [
            'd' => true,
            'fill' => true,
            'stroke' => true,
            'stroke-width' => true,
            'stroke-linecap' => true,
            'stroke-linejoin' => true,
        ];
        $allowed_tags['circle'] = [
            'cx' => true,
            'cy' => true,
            'r' => true,
            'fill' => true,
            'stroke' => true,
        ];
        $allowed_tags['rect'] = [
            'x' => true,
            'y' => true,
            'width' => true,
            'height' => true,
            'fill' => true,
            'stroke' => true,
        ];
        $allowed_tags['line'] = [
            'x1' => true,
            'y1' => true,
            'x2' => true,
            'y2' => true,
            'stroke' => true,
            'stroke-width' => true,
        ];
        
        $sanitized = wp_kses($content, $allowed_tags);
        
        // Replace fill attributes with currentColor for better color inheritance
        $sanitized = preg_replace('/fill="[^"]*"/', 'fill="currentColor"', $sanitized);
        
        return $sanitized;
    }

    public function render($attributes, $content = '', $block = null)
    {
        // Extract attributes
        $containerId = $attributes['containerId'] ?? '';
        $images = $attributes['images'] ?? [];

        // Get settings from parent slideshow via context
        $showThumbnails = $block->context['jankx/showThumbnails'] ?? true;
        $showNavigation = $block->context['jankx/showNavigation'] ?? true;
        $prevText = $block->context['jankx/prevText'] ?? '←';
        $nextText = $block->context['jankx/nextText'] ?? '→';

        ob_start();
        ?>
        <?php if ($showThumbnails && !empty($images) && count($images) > 1) : ?>
            <div class="slideshow-thumbnails">
                <?php foreach ($images as $index => $image) : ?>
                    <?php
                    $thumbnail_url = $image['thumbnailUrl'] ?? $image['url'];
                    $alt_text = $image['alt'] ?? '';
                    $active_class = $index === 0 ? 'active' : '';
                    ?>
                    <button class="slideshow-thumbnail <?php echo $active_class; ?>"
                            data-slide="<?php echo $index; ?>">
                        <img src="<?php echo esc_url($thumbnail_url); ?>"
                             alt="<?php echo esc_attr($alt_text); ?>" />
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="slideshow-main">
            <div class="slideshow-container">
                <div class="slideshow-track">
                    <?php echo $content; ?>
                </div>
            </div>

            <?php if ($showNavigation && !empty($images) && count($images) > 1) : ?>
                <button class="slideshow-nav slideshow-nav-prev"
                        aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
                    <?php echo $this->allow_svg_tags($prevText); ?>
                </button>
                <button class="slideshow-nav slideshow-nav-next"
                        aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
                    <?php echo $this->allow_svg_tags($nextText); ?>
                </button>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}

