<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\PostLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\PostLayoutTemplateBlock;
use WP_Query;

abstract class PostLayout implements PostLayoutInterface
{
    /**
     * Layout name/slug
     * @var string
     */
    protected $name = '';

    /**
     * Layout display title
     * @var string
     */
    protected $title = '';

    /**
     * Layout options
     * @var array
     */
    protected $options = [];

    /**
     * WP_Query instance
     * @var WP_Query|null
     */
    protected $query = null;

    /**
     * Content generator instance
     * @var ContentGeneratorInterface|null
     */
    protected $contentGenerator = null;

    /**
     * Default options
     * @var array
     */
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

    protected function renderPostItem($post = null): string
    {
        if (!$post) {
            global $post;
        }

        $thumbnail_position = $this->getOption('thumbnailPosition', 'top');
        if (!in_array($thumbnail_position, ['top', 'bottom', 'left', 'right'], true)) {
            $thumbnail_position = 'top';
        }

        $has_featured_image = $this->getOption('showFeaturedImage') && has_post_thumbnail($post->ID);

        $article_classes = get_post_class('post-item', $post->ID);
        $article_classes[] = 'thumbnail-position-' . $thumbnail_position;
        $article_classes[] = $has_featured_image ? 'has-thumbnail' : 'no-thumbnail';

        ob_start();
        ?>
        <article id="post-<?php echo esc_attr($post->ID); ?>" class="<?php echo esc_attr(implode(' ', array_unique($article_classes))); ?>">
            <?php if ($has_featured_image) : ?>
                <?php
                $image_ratio = $this->getOption('imageRatio', '');
                $thumbnail_classes = ['post-thumbnail'];
                $thumbnail_styles = [];

                if (!empty($image_ratio) && preg_match('/^(\d+)\/(\d+)$/', $image_ratio, $matches)) {
                    $width_ratio = (float) $matches[1];
                    $height_ratio = (float) $matches[2];
                    $aspect_ratio_value = ($height_ratio / $width_ratio) * 100;
                    $thumbnail_classes[] = 'has-aspect-ratio';
                    $thumbnail_styles[] = 'padding-bottom: ' . $aspect_ratio_value . '%';
                }
                ?>
                <div class="<?php echo esc_attr(implode(' ', $thumbnail_classes)); ?>"<?php echo !empty($thumbnail_styles) ? ' style="' . esc_attr(implode('; ', $thumbnail_styles)) . '"' : ''; ?>>
                    <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" aria-hidden="true" tabindex="-1">
                        <?php
                        $thumbnail_html = get_the_post_thumbnail($post->ID, $this->getOption('imageSize', 'large'));
                        if (!empty($image_ratio) && preg_match('/^(\d+)\/(\d+)$/', $image_ratio)) {
                            $thumbnail_html = '<span class="aspect-ratio-container">' . $thumbnail_html . '</span>';
                        }
                        echo $thumbnail_html;
                        ?>
                    </a>
                </div>
            <?php endif; ?>

            <div class="post-content">
                <?php if ($this->getOption('showTitle')) : ?>
                    <h3 class="post-title">
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>"><?php echo esc_html(get_the_title($post->ID)); ?></a>
                    </h3>
                <?php endif; ?>

                <?php if ($this->getOption('showDate') || $this->getOption('showAuthor')) : ?>
                    <div class="post-meta">
                        <?php if ($this->getOption('showDate')) : ?>
                            <span class="post-date">
                                <time datetime="<?php echo esc_attr(get_the_date('c', $post->ID)); ?>">
                                    <?php echo esc_html(get_the_date('', $post->ID)); ?>
                                </time>
                            </span>
                        <?php endif; ?>

                        <?php if ($this->getOption('showAuthor')) : ?>
                            <span class="post-author">
                                <?php
                                $author_id = get_post_field('post_author', $post->ID);
                                printf(
                                    esc_html__('By %s', 'jankx'),
                                    '<a href="' . esc_url(get_author_posts_url($author_id)) . '">' . esc_html(get_the_author_meta('display_name', $author_id)) . '</a>'
                                );
                                ?>
                            </span>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <?php if ($this->getOption('showExcerpt')) : ?>
                    <div class="post-excerpt">
                        <?php
                        $excerpt = get_the_excerpt($post->ID);
                        $length = $this->getOption('excerptLength', 55);
                        echo wp_trim_words($excerpt, $length, '...');
                        ?>
                    </div>
                <?php endif; ?>
            </div>
        </article>
        <?php
        return ob_get_clean();
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
            $html = PostLayoutTemplateBlock::renderTemplateWithQuery(
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

    public function getSupportedOptions(): array
    {
        return array_keys($this->defaultOptions);
    }

    public function getReadOnlyOptions(): array
    {
        return [
            'showTitle',
        ];
    }

    protected function loadTemplate(string $template_name, array $args = []): string
    {
        $search_paths = [
            get_stylesheet_directory() . '/views/post-layout/',
            get_template_directory() . '/includes/framework/Layouts/PostLayout/templates/',
        ];

        $template_names = [
            $template_name . '.php',
            'default.php',
        ];

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
}