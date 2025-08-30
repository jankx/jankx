<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class MegaMenuBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/mega-menu';





    public function render($attributes, $content = '')
    {
        $toggle_label = isset($attributes['toggleLabel']) ? (string) $attributes['toggleLabel'] : 'Menu';
        $breakpoint   = isset($attributes['collapseBreakpoint']) ? (int) $attributes['collapseBreakpoint'] : 959;
        $className    = isset($attributes['className']) ? (string) $attributes['className'] : '';

        $wrapperClasses = ['jankx-mega-menu'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        $html  = '<nav class="' . esc_attr(implode(' ', $wrapperClasses)) . '" data-breakpoint="' . esc_attr((string) $breakpoint) . '">';
        $html .= '<button class="mega-menu__toggle" type="button" aria-expanded="false">' . esc_html($toggle_label) . '</button>';
        $html .= '<div class="mega-menu__nav">' . $content . '</div>';
        $html .= '</nav>';

        return $html;
    }
}
