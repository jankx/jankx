<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class OverlapGroupBlock extends Block
{
    protected $blockId = 'jankx/overlap-group';

    /**
     * Allowed HTML tags for the container element.
     *
     * @var array
     */
    protected $allowedTags = ['div', 'section', 'article', 'aside', 'main'];

    public function render($attributes, $content = '', $block = null)
    {
        $tag = isset($attributes['tagName']) && in_array($attributes['tagName'], $this->allowedTags, true)
            ? $attributes['tagName']
            : 'div';

        $classes = ['jankx-overlap-group'];

        $styles = [];

        $positionType = isset($attributes['positionType']) ? $attributes['positionType'] : 'relative';
        if (!in_array($positionType, ['static', 'relative', 'absolute'], true)) {
            $positionType = 'relative';
        }

        if ($positionType !== 'static') {
            $styles[] = 'position: ' . $positionType;
            $classes[] = 'jankx-overlap-group--' . $positionType;
        }

        $offsetUnit = isset($attributes['offsetUnit']) && in_array($attributes['offsetUnit'], ['px', '%', 'rem', 'vw', 'vh'], true)
            ? $attributes['offsetUnit']
            : 'px';

        foreach (['top', 'right', 'bottom', 'left'] as $side) {
            if (isset($attributes[$side]) && $attributes[$side] !== '' && $attributes[$side] !== null) {
                $styles[] = $side . ': ' . (float) $attributes[$side] . $offsetUnit;
            }
        }

        if (isset($attributes['zIndex']) && $attributes['zIndex'] !== '' && $attributes['zIndex'] !== null) {
            $styles[] = 'z-index: ' . (int) $attributes['zIndex'];
        }

        if (!empty($attributes['width'])) {
            $styles[] = 'width: ' . esc_attr($attributes['width']);
        }

        if (!empty($attributes['maxWidth'])) {
            $styles[] = 'max-width: ' . esc_attr($attributes['maxWidth']);
        }

        $pullUp = isset($attributes['pullUp']) ? (int) $attributes['pullUp'] : 0;
        if ($pullUp > 0) {
            $styles[] = 'margin-top: -' . $pullUp . 'px';
        }

        $wrapperAttributes = get_block_wrapper_attributes([
            'class' => implode(' ', $classes),
            'style' => implode(';', $styles),
        ]);

        return sprintf('<%1$s %2$s>%3$s</%1$s>', $tag, $wrapperAttributes, $content);
    }
}
