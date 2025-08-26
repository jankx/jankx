<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
class MegaMenuBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/mega-menu', [
            'title' => __('Mega Menu', 'jankx'),
            'category' => 'widgets',
            'icon' => 'menu',
            'description' => __('Responsive mega menu with hover/click submenus and keyboard support.', 'jankx'),
            'keywords' => ['menu', 'mega', 'navigation'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
            ],
            'attributes' => [
                'toggleLabel' => [ 'type' => 'string', 'default' => 'Menu' ],
                'collapseBreakpoint' => [ 'type' => 'number', 'default' => 959 ],
                'className' => [ 'type' => 'string', 'default' => '' ],
            ],
        ]);
    }

    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/mega-menu';
        $buildPath = $blockPath . '/build';
        $metadata  = $this->getBlockMetadata($blockPath);

        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'build/style.css';
            $metadata['viewScript'] = 'build/view.js';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            $metadata['editorScript'] = 'index.js';
            $metadata['style'] = 'style.css';
            $metadata['viewScript'] = 'view.js';
            $metadata['editorStyle'] = 'editor.css';
        }

        $this->registerBlock($blockPath, $metadata);
    }

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

