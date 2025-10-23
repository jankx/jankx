<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SlideshowContainerBlock extends Block
{
    protected $blockId = 'jankx/slideshow-container';

    public function render($attributes, $content = '', $block = null)
    {
        // Extract attributes
        $containerId = $attributes['containerId'] ?? '';

        ob_start();
        ?>
        <div class="slideshow-container">
            <div class="slideshow-track">
                <?php echo $content; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

