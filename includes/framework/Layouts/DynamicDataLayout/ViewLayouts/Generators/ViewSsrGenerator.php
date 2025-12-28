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
        
        $app = \Jankx\Foundation\Application::getInstance();
        $this->latte = $app->make('template.engine.latte');
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

        $mergedOptions = array_merge($this->templateBlock['attrs'] ?? [], $this->options, $options);
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
        
        // Prepare all data using the same method as AbstractViewLayout
        $params = $this->prepareTemplateData(get_the_ID(), $options);
        
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

    protected function prepareTemplateData(int $view_id, array $options): array
    {
        // Process all data in the layout class
        $show_thumbnail = (bool) ($options['showFeaturedImage'] ?? true);
        $show_title = (bool) ($options['showTitle'] ?? true);
        $show_excerpt = (bool) ($options['showExcerpt'] ?? true);
        $show_date = (bool) ($options['showDate'] ?? true);
        $excerpt_length = (int) ($options['excerptLength'] ?? 55);
        $image_size = $options['imageSize'] ?? 'post-thumbnail';
        $thumbnail_position = $options['thumbnailPosition'] ?? 'top';
        $show_read_more = (bool) ($options['showReadMore'] ?? false);
        $read_more_text = $options['readMoreText'] ?? __('Read More', 'jankx');
        $show_author = (bool) ($options['showAuthor'] ?? false);
        $show_categories = (bool) ($options['showCategories'] ?? false);
        $show_tags = (bool) ($options['showTags'] ?? false);

        // Prepare content classes
        $content_classes = ['wp-block-view-content'];
        if ($thumbnail_position) {
            $content_classes[] = 'thumbnail-' . $thumbnail_position;
        }

        // Process excerpt
        $excerpt_text = '';
        if ($show_excerpt) {
            $raw_excerpt = has_excerpt($view_id) ? get_the_excerpt($view_id) : get_post_field('post_content', $view_id);
            $excerpt_text = wp_trim_words($raw_excerpt, max(1, $excerpt_length));
        }

        // Process categories
        $categories = [];
        if ($show_categories && has_category('', $view_id)) {
            $category_terms = get_the_category($view_id);
            foreach ($category_terms as $category) {
                $categories[] = [
                    'name' => $category->name,
                    'link' => get_category_link($category->term_id),
                ];
            }
        }

        // Process tags
        $tags = [];
        if ($show_tags && has_tag('', $view_id)) {
            $tag_terms = get_the_tags($view_id);
            if ($tag_terms) {
                foreach ($tag_terms as $tag) {
                    $tags[] = [
                        'name' => $tag->name,
                        'link' => get_tag_link($tag->term_id),
                    ];
                }
            }
        }

        // Process author
        $author = [];
        if ($show_author) {
            $author = [
                'display_name' => get_the_author_meta('display_name', get_post_field('post_author', $view_id)),
                'posts_url' => get_author_posts_url(get_post_field('post_author', $view_id)),
            ];
        }

        // Process date
        $date = [];
        if ($show_date) {
            $date = [
                'formatted' => get_the_date('', $view_id),
                'datetime' => get_post_time('c', true, $view_id),
            ];
        }

        // Process thumbnail
        $thumbnail = [];
        if ($show_thumbnail && has_post_thumbnail($view_id)) {
            $originalThumbHtml = get_the_post_thumbnail($view_id, $image_size, ['style' => 'object-fit:cover; max-width:100%; height:auto;']);
            $thumbnail = [
                'html' => $originalThumbHtml,
                'url' => get_the_post_thumbnail_url($view_id, $image_size),
                'exists' => true,
            ];
        } else {
            $thumbnail = [
                'html' => '',
                'url' => '',
                'exists' => false,
            ];
        }

        // Overlay icon injection for featured image when configured
        $overlayIcon = $options['overlayIcon'] ?? '';
        $overlayType = $options['overlayIconType'] ?? 'class';
        $overlayImage = $options['overlayIconImageUrl'] ?? '';
        $overlayText = $options['overlayIconText'] ?? '';
        $overlayRotate = isset($options['overlayIconRotate']) ? (int) $options['overlayIconRotate'] : 0;
        $overlayColor = $options['overlayIconColor'] ?? '#ffffff';
        $overlayBg = $options['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)';
        $overlaySize = isset($options['overlayIconSize']) ? (int) $options['overlayIconSize'] : 24;
        $overlayPosition = $options['overlayIconPosition'] ?? 'center';
        $overlayMode = $options['overlayIconShowMode'] ?? 'always-show';
        $overlayTarget = $options['overlayIconTarget'] ?? 'featured-image';

        if ($thumbnail['exists'] && ($overlayIcon || $overlayImage || $overlayText) && $overlayTarget === 'featured-image') {
            $wrapperClasses = 'jankx-thumbnail-overlay-wrapper overlay-mode-' . sanitize_html_class($overlayMode) . ' overlay-pos-' . sanitize_html_class($overlayPosition);
            $commonStyle = sprintf('style="color:%s;background:%s;font-size:%dpx;"', esc_attr($overlayColor), esc_attr($overlayBg), (int) $overlaySize);
            $rotateStyle = $overlayRotate !== 0 ? ' style="transform: rotate(' . (int) $overlayRotate . 'deg);"' : '';
            if ($overlayType === 'image' && $overlayImage) {
                $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><img src="%s" alt="" style="width:%dpx;height:%dpx;object-fit:contain;" /></div>', $commonStyle, esc_url($overlayImage), (int) $overlaySize, (int) $overlaySize);
            } elseif ($overlayType === 'text' && $overlayText !== '') {
                $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><span class="jankx-overlay-icon-text"%s>%s</span></div>', $commonStyle, $rotateStyle, esc_html($overlayText));
            } else {
                $iconHtml = sprintf('<div class="jankx-overlay-icon" %s><i class="%s"%s></i></div>', $commonStyle, esc_attr($overlayIcon), $rotateStyle);
            }
            $overlayInline = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;';
            $overlayHtml = sprintf('<div class="%s" style="%s">%s</div>', esc_attr($wrapperClasses), esc_attr($overlayInline), $iconHtml);
            $thumbnail['html'] = sprintf(
                '<div class="jankx-overlay-container" style="position:relative;">%s%s</div>',
                $thumbnail['html'],
                $overlayHtml
            );
        }

        // Return all prepared data
        return [
            'view_id' => $view_id,
            'options' => $options,
            'content_classes' => $content_classes,
            'show_thumbnail' => $show_thumbnail,
            'show_title' => $show_title,
            'show_excerpt' => $show_excerpt,
            'show_date' => $show_date,
            'show_read_more' => $show_read_more,
            'show_author' => $show_author,
            'show_categories' => $show_categories,
            'show_tags' => $show_tags,
            'excerpt_length' => $excerpt_length,
            'image_size' => $image_size,
            'thumbnail_position' => $thumbnail_position,
            'read_more_text' => $read_more_text,
            
            // Processed data
            'title' => get_the_title($view_id),
            'permalink' => get_permalink($view_id),
            'excerpt' => $excerpt_text,
            'date' => $date,
            'thumbnail' => $thumbnail,
            'author' => $author,
            'categories' => $categories,
            'tags' => $tags,
        ];
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
