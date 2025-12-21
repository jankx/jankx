<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts\Generators;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\AbstractViewContentGenerator;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewContentGeneratorInterface;
use WP_Query;

class ViewSsrGenerator extends AbstractViewContentGenerator
{
    protected $templateBlock;
    protected $options;

    public function __construct(array $templateBlock, array $options = [])
    {
        $this->templateBlock = $templateBlock;
        $this->options = $options;
    }

    public function getName(): string
    {
        return 'view-ssr-generator';
    }

    public function getTitle(): string
    {
        return 'View SSR Generator';
    }

    protected function renderContent(WP_Query $query, array $options = []): string
    {
        if (!$query->have_posts()) {
            return '';
        }

        $mergedOptions = array_merge($this->options, $options);
        $layout = $this->getLayout();

        if (!$layout) {
            return '';
        }

        ob_start();
        ?>
        <div class="wp-block-jankx-dynamic-ssr-template">
            <?php
            while ($query->have_posts()) {
                $query->the_post();
                echo $this->renderTemplateBlock($this->templateBlock, $mergedOptions);
            }
            wp_reset_postdata();
            ?>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    protected function renderPreview(array $options = []): array
    {
        $mergedOptions = array_merge($this->options, $options);
        
        return [
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'templateBlock' => $this->templateBlock,
            'options' => $mergedOptions,
            'preview' => $this->generatePreviewContent($mergedOptions),
        ];
    }

    protected function renderTemplateBlock(array $templateBlock, array $options): string
    {
        $blockName = $templateBlock['blockName'] ?? '';
        $blockAttributes = $templateBlock['attrs'] ?? [];
        $innerBlocks = $templateBlock['innerBlocks'] ?? [];

        // Apply options to block attributes
        $blockAttributes = array_merge($blockAttributes, $options);

        // Render the block using WordPress block rendering
        if (function_exists('render_block')) {
            return render_block($templateBlock);
        }

        // Fallback rendering
        return $this->fallbackRender($templateBlock, $options);
    }

    protected function fallbackRender(array $templateBlock, array $options): string
    {
        $blockName = $templateBlock['blockName'] ?? '';
        $content = '';

        // Simple fallback for common blocks
        switch ($blockName) {
            case 'core/heading':
                $content = sprintf(
                    '<h2 class="wp-block-heading">%s</h2>',
                    esc_html(get_the_title())
                );
                break;
            case 'core/paragraph':
                $content = sprintf(
                    '<p class="has-text-align-left">%s</p>',
                    esc_html(get_the_excerpt() ?: get_the_content())
                );
                break;
            case 'core/image':
                if (has_post_thumbnail()) {
                    $content = get_the_post_thumbnail(get_the_ID(), 'large', [
                        'class' => 'wp-block-image',
                    ]);
                }
                break;
            default:
                // Generic fallback
                $content = sprintf(
                    '<div class="wp-block-%s">%s</div>',
                    sanitize_title(str_replace('/', '-', $blockName)),
                    esc_html(get_the_title())
                );
                break;
        }

        return $content;
    }

    protected function generatePreviewContent(array $options): string
    {
        // Generate a simple preview based on the template block
        $blockName = $this->templateBlock['blockName'] ?? 'core/paragraph';
        
        switch ($blockName) {
            case 'core/heading':
                return '<h2 class="wp-block-heading">Sample Title</h2>';
            case 'core/paragraph':
                return '<p class="has-text-align-left">Sample content preview...</p>';
            case 'core/image':
                return '<img class="wp-block-image" src="https://via.placeholder.com/300x200" alt="Sample image" />';
            default:
                return '<div class="wp-block-preview">Sample preview content</div>';
        }
    }
}
