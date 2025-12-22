<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts\Generators;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\AbstractViewContentGenerator;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewContentGeneratorInterface;
use WP_Query;
use Latte\Engine as LatteEngine;
use Latte\Runtime\FilterInfo;

class ViewSsrGenerator extends AbstractViewContentGenerator
{
    protected $templateBlock;
    protected $options;
    protected $latte;

    public function __construct(array $templateBlock, array $options = [])
    {
        $this->templateBlock = $templateBlock;
        $this->options = $options;
        
        // Require Latte to be available
        if (!class_exists('Latte\Engine')) {
            throw new \RuntimeException('Latte template engine is required. Please run "composer install" to install dependencies.');
        }
        
        $this->latte = new LatteEngine();
        
        // Configure Latte
        $this->latte->setTempDirectory(sys_get_temp_dir() . '/jankx_latte_cache');
        $this->latte->setAutoRefresh(true);
        
        // Add custom filters for WordPress functions
        $this->latte->addFilter('esc_html', 'esc_html');
        $this->latte->addFilter('esc_url', 'esc_url');
        $this->latte->addFilter('esc_attr', 'esc_attr');
        $this->latte->addFilter('wp_kses_post', 'wp_kses_post');
        $this->latte->addFilter('wp_trim_words', 'wp_trim_words');
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

        // Debug: Log what we're working with
        error_log('ViewSsrGenerator renderTemplateBlock - blockName: ' . $blockName);
        error_log('ViewSsrGenerator renderTemplateBlock - options: ' . json_encode($options));

        // For dynamic-ssr-template blocks, load the loop item template
        if ($blockName === 'jankx/dynamic-ssr-template') {
            try {
                return $this->renderLoopItemTemplate($options);
            } catch (\Exception $e) {
                error_log('ViewSsrGenerator renderLoopItemTemplate error: ' . $e->getMessage());
                throw $e;
            }
        }

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

    protected function renderLoopItemTemplate(array $options): string
    {
        $layout = $options['layout'] ?? 'default';
        $templateFile = $this->getLoopItemTemplateFile($layout);
        
        // Debug: Log template file path
        error_log('ViewSsrGenerator renderLoopItemTemplate - layout: ' . $layout);
        error_log('ViewSsrGenerator renderLoopItemTemplate - templateFile: ' . $templateFile);
        
        // Check if template file exists
        if (!file_exists($templateFile)) {
            error_log('ViewSsrGenerator - Template file not found: ' . $templateFile);
            throw new \RuntimeException("Template file not found: {$templateFile}");
        }
        
        error_log('ViewSsrGenerator - Template file exists, proceeding with render');
        
        // Prepare template variables
        $params = [
            'view_id' => get_the_ID(),
            'options' => $options,
            'show_thumbnail' => (bool) ($options['showFeaturedImage'] ?? true),
            'show_title' => (bool) ($options['showTitle'] ?? true),
            'show_excerpt' => (bool) ($options['showExcerpt'] ?? true),
            'show_date' => (bool) ($options['showDate'] ?? true),
            'excerpt_length' => (int) ($options['excerptLength'] ?? 55),
            'image_size' => $options['imageSize'] ?? 'post-thumbnail',
            'thumbnail_position' => $options['thumbnailPosition'] ?? 'top',
            'show_read_more' => (bool) ($options['showReadMore'] ?? false),
            'read_more_text' => $options['readMoreText'] ?? __('Read More', 'jankx'),
            'show_author' => (bool) ($options['showAuthor'] ?? false),
            'show_categories' => (bool) ($options['showCategories'] ?? false),
            'show_tags' => (bool) ($options['showTags'] ?? false),
        ];
        
        // Add WordPress functions to template
        $params['wp'] = [
            'get_permalink' => 'get_permalink',
            'get_the_title' => 'get_the_title',
            'get_the_date' => 'get_the_date',
            'get_post_time' => 'get_post_time',
            'get_the_excerpt' => 'get_the_excerpt',
            'get_post_field' => 'get_post_field',
            'has_post_thumbnail' => 'has_post_thumbnail',
            'the_post_thumbnail' => 'the_post_thumbnail',
            'get_the_category' => 'get_the_category',
            'get_category_link' => 'get_category_link',
            'get_the_tags' => 'get_the_tags',
            'get_tag_link' => 'get_tag_link',
            'get_the_author_meta' => 'get_the_author_meta',
            'has_category' => 'has_category',
            'has_tag' => 'has_tag',
            '__' => '__',
            'esc_html' => 'esc_html',
            'esc_url' => 'esc_url',
            'esc_attr' => 'esc_attr',
            'wp_kses_post' => 'wp_kses_post',
            'wp_trim_words' => 'wp_trim_words',
            'wpautop' => 'wpautop',
        ];
        
        // Render with Latte, throw exception on error
        try {
            error_log('ViewSsrGenerator - Attempting Latte render');
            $result = $this->latte->renderToString($templateFile, $params);
            error_log('ViewSsrGenerator - Latte render successful, length: ' . strlen($result));
            return $result;
        } catch (\Exception $e) {
            error_log('ViewSsrGenerator - Latte render failed: ' . $e->getMessage());
            throw new \RuntimeException("Failed to render template {$templateFile}: " . $e->getMessage(), 0, $e);
        }
    }

    protected function getLoopItemTemplateFile(string $layout): string
    {
        // WordPress template hierarchy: child theme first, then parent theme
        $template_filename = 'item-' . $layout . '.latte';
        
        // Check child theme first
        if (is_child_theme()) {
            $child_template = get_stylesheet_directory() . '/views/layouts/loop/' . $template_filename;
            if (file_exists($child_template)) {
                return $child_template;
            }
        }
        
        // Then check parent theme
        $parent_template = get_template_directory() . '/views/layouts/loop/' . $template_filename;
        if (file_exists($parent_template)) {
            return $parent_template;
        }
        
        // If no .latte found, check for PHP fallbacks
        $php_filename = 'item-' . $layout . '.php';
        
        // Check child theme for PHP
        if (is_child_theme()) {
            $child_php_template = get_stylesheet_directory() . '/views/layouts/loop/' . $php_filename;
            if (file_exists($child_php_template)) {
                return $child_php_template;
            }
        }
        
        // Check parent theme for PHP
        $parent_php_template = get_template_directory() . '/views/layouts/loop/' . $php_filename;
        if (file_exists($parent_php_template)) {
            return $parent_php_template;
        }
        
        // Return the parent theme latte path even if it doesn't exist
        // This will trigger the exception in renderLoopItemTemplate with clear error message
        return $parent_template;
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
