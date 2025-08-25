<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Calendar Block
 *
 * Display events calendar using FullCalendar.
 */
class CalendarBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/calendar', [
            'title' => __('Calendar', 'jankx'),
            'category' => 'widgets',
            'icon' => 'calendar',
            'description' => __('Display events calendar using FullCalendar.', 'jankx'),
            'keywords' => ['calendar', 'events', 'fullcalendar'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'initialView' => ['type' => 'string', 'default' => 'dayGridMonth'],
                'editable' => ['type' => 'boolean', 'default' => false],
                'selectable' => ['type' => 'boolean', 'default' => false],
                'weekends' => ['type' => 'boolean', 'default' => true],
                'locale' => ['type' => 'string', 'default' => 'en'],
                'events' => ['type' => 'array', 'default' => []],
                'className' => ['type' => 'string', 'default' => '']
            ]
        ]);
    }

    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/calendar';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'build/style-style.css.css';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            $metadata['editorScript'] = 'index.js';
            $metadata['style'] = 'style.css';
            $metadata['editorStyle'] = 'editor.css';
        }

        $this->registerBlock($blockPath, $metadata);
    }

    public function render($attributes, $content = '')
    {
        $className = isset($attributes['className']) ? (string) $attributes['className'] : '';
        $wrapperClasses = ['jankx-calendar-block'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }
        // Frontend static container; editor initializes calendar interactively.
        return sprintf('<div class="%s"><div class="jankx-calendar-wrap"></div></div>', esc_attr(implode(' ', $wrapperClasses)));
    }
}


