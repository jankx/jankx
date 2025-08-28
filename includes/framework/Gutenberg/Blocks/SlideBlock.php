<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Slide Block
 *
 * This block represents a single slide within a carousel block.
 * It can contain any content and will be wrapped in a swiper-slide container.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SlideBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/slide', [
            'title' => __('Slide', 'jankx'),
            'category' => 'design',
            'icon' => 'slides',
            'description' => __('Slide of carousel with image.', 'jankx'),
            'keywords' => ['slide', 'carousel', 'slider'],
            'supports' => [
                'html' => false,
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'parent' => ['jankx/carousel'],
            'attributes' => [
                'className' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/slide';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            // Fallback to source files if build doesn't exist
            $metadata['editorScript'] = 'index.js';
            $metadata['editorStyle'] = 'editor.css';
        }

        // Add custom CSS for Jankx framework block
        $metadata['editorStyle'] = 'jankx-slide.css';

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Enqueue custom CSS
        $this->enqueueCustomCSS();
    }

    /**
     * Enqueue custom CSS for the block
     *
     * @return void
     */
    protected function enqueueCustomCSS()
    {
        // Enqueue editor CSS
        $cssUrl = get_template_directory_uri() . '/resources/blocks/slide/jankx-slide.css';
        $cssPath = get_template_directory() . '/resources/blocks/slide/jankx-slide.css';

        if (file_exists($cssPath)) {
            wp_enqueue_style(
                'jankx-slide-style',
                $cssUrl,
                [],
                filemtime($cssPath)
            );
        }

        // Note: Editor CSS is handled by block.json editorStyle property
        // WordPress will automatically load it in editor context
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $className = $attributes['className'] ?? '';

        // Build wrapper classes
        $wrapperClasses = ['swiper-slide'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $wrapperClasses)); ?>">
            <?php echo $content; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
