<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use WP_Query;

abstract class PostLayout implements PostLayoutInterface
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

    public function setQuery(WP_Query $query): PostLayoutInterface
    {
        $this->query = $query;
        return $this;
    }

    public function setContentGenerator($generator): PostLayoutInterface
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
        return $this->contentGenerator instanceof ContentGeneratorInterface
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
                $this
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
            $generator->setLayout($this);
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
        $classes = ['post-type-layout', 'post-type-layout-' . $this->name, 'layout-' . $this->name];
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
        $classes = ['post-item'];
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
                'id' => 'post-{{post-id}}',
            ],
        ];
    }

    protected function getEmptyStateStructure(array $options): array
    {
        return [
            'tag' => 'div',
            'classes' => ['post-layout-no-results'],
            'text' => __('No posts found.', 'jankx'),
        ];
    }

    protected function getPaginationWrapperStructure(array $options): array
    {
        $alignment = $options['paginationAlignment'] ?? 'center';
        $classes = ['post-layout-pagination', 'pagination-align-' . $alignment];
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
            get_stylesheet_directory() . '/views/post-layout/',
            get_template_directory() . '/includes/framework/Layouts/PostLayout/templates/',
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

    protected function renderPostItem(): string
    {
        $post_id = get_the_ID();
        $thumbnail_position = $this->getOption('thumbnailPosition', 'top');
        $show_thumbnail = (bool) $this->getOption('showFeaturedImage', true);
        $show_title = (bool) $this->getOption('showTitle', true);
        $show_excerpt = (bool) $this->getOption('showExcerpt', true);
        $show_date = (bool) $this->getOption('showDate', true);
        $show_author = (bool) $this->getOption('showAuthor', false);
        $excerpt_length = (int) $this->getOption('excerptLength', 55);
        $image_size = (string) $this->getOption('imageSize', 'large');

        $classes = ['post-item', 'thumbnail-position-' . $thumbnail_position];
        $classes[] = $show_thumbnail ? 'has-thumbnail' : 'no-thumbnail';

        $thumb_html = '';
        if ($show_thumbnail && has_post_thumbnail($post_id)) {
            $thumb_html = sprintf(
                '<div class="post-thumbnail">%s</div>',
                get_the_post_thumbnail($post_id, $image_size)
            );
        }

        $title_html = '';
        if ($show_title) {
            $title_html = sprintf(
                '<h3 class="post-title"><a href="%s">%s</a></h3>',
                esc_url(get_permalink($post_id)),
                esc_html(get_the_title($post_id))
            );
        }

        $date_html = '';
        if ($show_date) {
            $date_html = sprintf(
                '<div class="post-date">%s</div>',
                esc_html(get_the_date('', $post_id))
            );
        }

        $author_html = '';
        if ($show_author) {
            $author_html = sprintf(
                '<div class="post-author">%s</div>',
                esc_html(get_the_author())
            );
        }

        $excerpt_html = '';
        if ($show_excerpt) {
            $raw_excerpt = has_excerpt($post_id) ? get_the_excerpt($post_id) : get_post_field('post_content', $post_id);
            $trimmed = wp_trim_words($raw_excerpt, max(1, $excerpt_length));
            if (!empty($trimmed)) {
                $excerpt_html = sprintf('<div class="post-excerpt">%s</div>', esc_html($trimmed));
            }
        }

        $content_html = $title_html . $author_html . $date_html . $excerpt_html;

        if (in_array($thumbnail_position, ['left', 'right'], true)) {
            $html = sprintf(
                '<article class="%s"><div class="post-inner horizontal %s">%s<div class="post-content">%s</div></div></article>',
                esc_attr(implode(' ', $classes)),
                $thumbnail_position === 'left' ? 'image-left' : 'image-right',
                $thumb_html,
                $content_html
            );
        } elseif ($thumbnail_position === 'bottom') {
            $html = sprintf(
                '<article class="%s"><div class="post-content">%s</div>%s</article>',
                esc_attr(implode(' ', $classes)),
                $content_html,
                $thumb_html
            );
        } else {
            $html = sprintf(
                '<article class="%s">%s<div class="post-content">%s</div></article>',
                esc_attr(implode(' ', $classes)),
                $thumb_html,
                $content_html
            );
        }

        return $html;
    }
}
