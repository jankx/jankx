<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\Generators\PostTemplateBlockGenerator;
use WP_Query;

/**
 * Post Layout Template Block
 *
 * Acts as the inner template for the Post Type Layout block.
 *
 * @package Jankx\Gutenberg\Blocks
 */
class PostLayoutTemplateBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/post-layout-template';

    /**
     * Render callback cho block post layout template.
     *
     * @param array $attributes
     * @param string $content
     * @param \WP_Block $block
     * @return string
     */
    public function render($attributes, $content, $block)
    {
        $context = $block->context['jankxPostTypeLayout'] ?? null;

        if (!is_array($context)) {
            return '';
        }

        $query = $context['query'] ?? null;
        if (!$query instanceof WP_Query) {
            return '';
        }

        $options = $context['options'] ?? [];
        $template = $context['template'] ?? ($block->parsed_block ?? null);
        if (!is_array($template)) {
            return '';
        }

        $layout = $context['layout'] ?? null;
        if ($layout instanceof PostLayoutInterface) {
            $generator = new PostTemplateBlockGenerator($template, $options);
            $generator->setLayout($layout);
        } else {
            $generator = new PostTemplateBlockGenerator($template, $options);
        }

        return $generator->generate($query, $options);
    }

    /**
     * Helper to render template block với query được truyền vào.
     *
     * @param array $templateBlock
     * @param WP_Query $query
     * @param array $options
     * @param PostLayoutInterface|null $layout
     * @return string
     */
    public static function renderTemplateWithQuery(array $templateBlock, WP_Query $query, array $options, ?PostLayoutInterface $layout = null): string
    {
        if (!function_exists('render_block')) {
            require_once ABSPATH . 'wp-includes/blocks.php';
        }

        $context = [
            'jankxPostTypeLayout' => [
                'query' => $query,
                'options' => $options,
                'template' => $templateBlock,
            ],
        ];

        if ($layout instanceof PostLayoutInterface) {
            $context['jankxPostTypeLayout']['layout'] = $layout;
        }

        $generator = new PostTemplateBlockGenerator($templateBlock, $options);

        if ($layout instanceof PostLayoutInterface) {
            $generator->setLayout($layout);
        }

        return $generator->generate($query, $options);
    }
}

