<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class IconButtonBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/icon-button', [
            'title' => __('Icon Button', 'jankx'),
            'category' => 'widgets',
            'icon' => 'button',
            'description' => __('Create an icon button', 'jankx'),
            'keywords' => ['button', 'icon', 'click'],
            'supports' => [
                'html' => false,
                'align' => ['left', 'center', 'right'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'className' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    public function register()
    {
        $blockPath = $this->getBlockPath();
        $metadata = $this->getBlockMetadata($blockPath);

        $this->registerBlock($blockPath, $metadata);
    }

    public function render($attributes, $content = '')
    {
        // Basic render implementation - can be enhanced later
        return '<div class="icon-button-block">Icon Button Block</div>';
    }
}
