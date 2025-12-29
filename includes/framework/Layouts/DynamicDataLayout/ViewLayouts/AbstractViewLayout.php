<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use WP_Query;
use Latte\Engine as LatteEngine;

abstract class AbstractViewLayout implements ViewLayoutInterface
{
    protected $name = '';
    protected $title = '';
    protected $options = [];
    protected $query = null;
    protected $contentGenerator = null;
    protected $latte;
    protected $defaultOptions = [
        'columns' => 3,
        'showFeaturedImage' => true,
        'showTitle' => true,
        'showExcerpt' => true,
        'showDate' => true,
        'showAuthor' => false,
        'imageSize' => 'large',
        'excerptLength' => 55,
        'thumbnailPosition' => 'top',
        'includeStickyPosts' => false,
    ];

    public function __construct()
    {
        $this->options = $this->defaultOptions;
        $app = \Jankx\Foundation\Application::getInstance();
        $this->latte = $app->make('template.engine.latte');
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setOptions($options): self
    {
        $this->options = array_merge($this->options, (array) $options);
        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    protected function getOption(string $key, $default = null)
    {
        return array_key_exists($key, $this->options) ? $this->options[$key] : $default;
    }

    public function setQuery(WP_Query $query): self
    {
        $this->query = $query;
        return $this;
    }

    public function setContentGenerator($generator): self
    {
        $this->contentGenerator = $generator;
        return $this;
    }

    public function getContentGenerator()
    {
        return $this->contentGenerator;
    }

    public function hasCustomGenerator(): bool
    {
        return $this->contentGenerator instanceof ViewContentGeneratorInterface
            && !($this->contentGenerator instanceof PostTemplateBlockGenerator);
    }

    public function render(): string
    {
        if (!$this->query) {
            return '';
        }
        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generate($this->query, $this->options);
        }
        $templateBlock = $this->getOption('postTemplate');
        if (is_array($templateBlock) && !empty($templateBlock)) {
            $html = DynamicDataTemplateBlock::renderTemplateWithQuery(
                $templateBlock,
                $this->query,
                $this->options,
                null
            );
            return $this->wrapTemplateHtml($html, $this->options);
        }
        return $this->renderDefault();
    }

    public function renderDefault(): string
    {
        return '';
    }

    public function renderPreview(): array
    {
        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generatePreview($this->options);
        }
        $templateBlock = $this->getOption('postTemplate');
        if (is_array($templateBlock) && !empty($templateBlock)) {
            $generator = new PostTemplateBlockGenerator($templateBlock, $this->options);
            $preview = $generator->generatePreview($this->options);
            if (!empty($preview)) {
                return $preview;
            }
        }
        return $this->renderDefaultPreview();
    }

    public function wrapTemplateHtml(string $html, array $options = []): string
    {
        return $html;
    }

    public function renderDefaultPreview(): array
    {
        return [];
    }

    public function getHtmlStructure(array $options = []): array
    {
        $mergedOptions = array_merge($this->options, $options);
        return [
            'layout' => $this->name,
            'container' => $this->getContainerStructure($mergedOptions),
            'itemWrapper' => $this->getItemWrapperStructure($mergedOptions),
            'emptyState' => $this->getEmptyStateStructure($mergedOptions),
            'paginationWrapper' => $this->getPaginationWrapperStructure($mergedOptions),
        ];
    }

    protected function getContainerStructure(array $options): array
    {
        $classes = ['view-type-layout', 'view-type-layout-' . $this->name, 'layout-' . $this->name];
        if (!empty($options['columns'])) {
            $classes[] = 'columns-' . intval($options['columns']);
        }
        if (!empty($options['columnsTablet'])) {
            $classes[] = 'columns-tablet-' . intval($options['columnsTablet']);
        }
        if (!empty($options['columnsMobile'])) {
            $classes[] = 'columns-mobile-' . intval($options['columnsMobile']);
        }
        $styles = [];
        if (!empty($options['columns'])) {
            $styles['--columns-desktop'] = (string) intval($options['columns']);
        }
        if (!empty($options['columnsTablet'])) {
            $styles['--columns-tablet'] = (string) intval($options['columnsTablet']);
        }
        if (!empty($options['columnsMobile'])) {
            $styles['--columns-mobile'] = (string) intval($options['columnsMobile']);
        }
        return [
            'tag' => 'div',
            'classes' => $classes,
            'styles' => $styles,
            'attributes' => [
                'data-layout' => $this->name,
            ],
        ];
    }

    protected function getItemWrapperStructure(array $options): array
    {
        $classes = ['view-item'];
        $thumbnailPosition = $options['thumbnailPosition'] ?? 'top';
        if (in_array($thumbnailPosition, ['top', 'bottom', 'left', 'right'], true)) {
            $classes[] = 'thumbnail-position-' . $thumbnailPosition;
        }
        $hasThumbnail = !empty($options['showFeaturedImage']);
        $classes[] = $hasThumbnail ? 'has-thumbnail' : 'no-thumbnail';
        return [
            'tag' => 'article',
            'classes' => $classes,
            'attributes' => [
                'id' => 'view-{{view-id}}',
            ],
        ];
    }

    protected function getEmptyStateStructure(array $options): array
    {
        return [
            'tag' => 'div',
            'classes' => ['view-layout-no-results'],
            'text' => __('No views found.', 'jankx'),
        ];
    }

    protected function getPaginationWrapperStructure(array $options): array
    {
        $alignment = $options['paginationAlignment'] ?? 'center';
        $classes = ['view-layout-pagination', 'pagination-align-' . $alignment];
        return [
            'tag' => 'div',
            'classes' => $classes,
        ];
    }

    public function getSupportedOptions(): array
    {
        return array_keys($this->defaultOptions);
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }

    public function getSettingsDefinition(): array
    {
        return [];
    }

    protected function loadTemplate(string $template_name, array $args = []): string
    {
        $template_names = [$template_name . '.latte', $template_name . '.php', 'default.latte', 'default.php'];
        $options = $args['options'] ?? [];
        $layout = $this->name ?: '';
        $post_type = isset($options['postType']) ? (string) $options['postType'] : 'post';

        if (is_child_theme()) {
            $priority_child_dir = get_stylesheet_directory() . '/views/layouts/loop/' . sanitize_file_name($layout) . '/' . sanitize_file_name($post_type) . '/';
            foreach ($template_names as $filename) {
                $template_path = $priority_child_dir . $filename;
                if (file_exists($template_path)) {
                    return $this->renderTemplate($template_path, $args);
                }
            }
        }

        $priority_parent_dir = get_template_directory() . '/views/layouts/loop/' . sanitize_file_name($layout) . '/' . sanitize_file_name($post_type) . '/';
        foreach ($template_names as $filename) {
            $template_path = $priority_parent_dir . $filename;
            if (file_exists($template_path)) {
                return $this->renderTemplate($template_path, $args);
            }
        }

        if (is_child_theme()) {
            $child_theme_dir = get_stylesheet_directory() . '/views/layouts/';
            foreach ($template_names as $filename) {
                $template_path = $child_theme_dir . $filename;
                if (file_exists($template_path)) {
                    return $this->renderTemplate($template_path, $args);
                }
            }
        }

        $parent_theme_dir = get_template_directory() . '/views/layouts/';
        foreach ($template_names as $filename) {
            $template_path = $parent_theme_dir . $filename;
            if (file_exists($template_path)) {
                return $this->renderTemplate($template_path, $args);
            }
        }

        $legacy_paths = [
            get_stylesheet_directory() . '/views/view-layout/',
            get_template_directory() . '/includes/framework/Layouts/ViewLayout/templates/',
        ];

        foreach ($legacy_paths as $base_path) {
            foreach ($template_names as $filename) {
                $template_path = $base_path . $filename;
                if (file_exists($template_path)) {
                    return $this->renderTemplate($template_path, $args);
                }
            }
        }
        throw new \RuntimeException("Template not found: {$template_name}. Searched in prioritized loop directories and views/layouts/ directories.");
    }

    protected function renderTemplate(string $template_path, array $args = []): string
    {
        // If it's a PHP template, use the old method
        if (str_ends_with($template_path, '.php')) {
            extract($args);
            ob_start();
            include $template_path;
            return ob_get_clean();
        }
        
        // For Latte templates, prepare all data in the layout class
        $options = $args['options'] ?? [];
        $view_id = get_the_ID();
        
        // Prepare all data in the layout class
        $params = $this->prepareTemplateData($view_id, $options);
        
        try {
            return $this->latte->renderToString($template_path, $params);
        } catch (\Exception $e) {
            throw new \RuntimeException("Failed to render Latte template {$template_path}: " . $e->getMessage(), 0, $e);
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
        if ($this->name) {
            $content_classes[] = $this->name . '-item-content';
        }
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
        if ($show_categories && has_category('', $view_id)) {
            $category_terms = get_the_category($view_id);
            $categories = [];
            foreach ($category_terms as $category) {
                $categories[] = [
                    'name' => $category->name,
                    'link' => get_category_link($category->term_id),
                ];
            }
        } else {
            $categories = null;
        }

        // Process tags
        if ($show_tags && has_tag('', $view_id)) {
            $tag_terms = get_the_tags($view_id);
            $tags = [];
            if ($tag_terms) {
                foreach ($tag_terms as $tag) {
                    $tags[] = [
                        'name' => $tag->name,
                        'link' => get_tag_link($tag->term_id),
                    ];
                }
            }
        } else {
            $tags = null;
        }

        // Process author
        if ($show_author) {
            $author = [
                'display_name' => get_the_author_meta('display_name', get_post_field('post_author', $view_id)),
                'posts_url' => get_author_posts_url(get_post_field('post_author', $view_id)),
            ];
        } else {
            $author = null;
        }

        // Process date
        if ($show_date) {
            $date = [
                'formatted' => get_the_date('', $view_id),
                'datetime' => get_the_time('c', true, $view_id),
            ];
        } else {
            $date = null;
        }

        // Process thumbnail
        if ($show_thumbnail && has_post_thumbnail($view_id)) {
            $thumbnail = [
                'html' => get_the_post_thumbnail($view_id, $image_size, ['style' => 'object-fit:cover;']),
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

    protected function renderViewItem(): string
    {
        $args = [
            'options' => $this->options,
        ];
        
        return $this->loadTemplate($this->name, $args);
    }

    /**
     * Append CSS classes to the wrapper element
     *
     * @param array $classes Existing CSS classes
     * @param array $options Additional options for class generation
     * @return array Updated CSS classes
     */
    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return $classes;
    }
}
