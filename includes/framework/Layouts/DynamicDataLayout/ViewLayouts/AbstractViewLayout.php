<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use WP_Query;

abstract class AbstractViewLayout implements ViewLayoutInterface
{
    protected $name = '';
    protected $title = '';
    protected $options = [];
    protected $query = null;
    protected $contentGenerator = null;
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

    public function setQuery(WP_Query $query): ViewLayoutInterface
    {
        $this->query = $query;
        return $this;
    }

    public function setContentGenerator($generator): ViewLayoutInterface
    {
        if ($generator && is_object($generator) && method_exists($generator, 'setLayout')) {
            call_user_func([$generator, 'setLayout'], $this);
        }
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
                $this instanceof ViewLayoutInterface ? $this : null
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
            $generator->setLayout($this instanceof ViewLayoutInterface ? $this : null);
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
        $search_paths = [
            get_stylesheet_directory() . '/views/view-layout/',
            get_template_directory() . '/includes/framework/Layouts/ViewLayout/templates/',
        ];
        $template_names = [$template_name . '.php', 'default.php'];
        foreach ($search_paths as $base_path) {
            foreach ($template_names as $filename) {
                $template_path = $base_path . $filename;
                if (file_exists($template_path)) {
                    return $this->renderTemplate($template_path, $args);
                }
            }
        }
        return '';
    }

    protected function renderTemplate(string $template_path, array $args = []): string
    {
        if (!file_exists($template_path)) {
            return '';
        }
        ob_start();
        extract($args, EXTR_SKIP);
        include $template_path;
        return ob_get_clean();
    }

    protected function renderViewItem(): string
    {
        $view_id = get_the_ID();
        $show_thumbnail = (bool) $this->getOption('showFeaturedImage', true);
        $show_title = (bool) $this->getOption('showTitle', true);
        $show_excerpt = (bool) $this->getOption('showExcerpt', true);
        $show_date = (bool) $this->getOption('showDate', true);
        $excerpt_length = (int) $this->getOption('excerptLength', 55);

        $parts = [];

        if ($show_thumbnail && has_post_thumbnail($view_id)) {
            $thumb = get_the_post_thumbnail($view_id, 'post-thumbnail', ['style' => 'object-fit:cover;']);
            $parts[] = sprintf('<figure class="wp-block-view-featured-image">%s</figure>', $thumb);
        }

        if ($show_title) {
            $parts[] = sprintf(
                '<h2 class="wp-block-view-title"><a href="%s">%s</a></h2>',
                esc_url(get_permalink($view_id)),
                esc_html(get_the_title($view_id))
            );
        }

        if ($show_date) {
            $parts[] = sprintf(
                '<div class="wp-block-view-date"><time datetime="%s">%s</time></div>',
                esc_attr(get_post_time('c', true, $view_id)),
                esc_html(get_the_date('', $view_id))
            );
        }

        if ($show_excerpt) {
            $raw_excerpt = has_excerpt($view_id) ? get_the_excerpt($view_id) : get_post_field('post_content', $view_id);
            $trimmed = wp_trim_words($raw_excerpt, max(1, $excerpt_length));
            $parts[] = sprintf(
                '<div class="wp-block-view-excerpt"><p class="wp-block-view-excerpt__excerpt">%s</p></div>',
                esc_html($trimmed)
            );
        }

        return implode('', $parts);
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
        // Default implementation - can be overridden by child classes
        return $classes;
    }
}
