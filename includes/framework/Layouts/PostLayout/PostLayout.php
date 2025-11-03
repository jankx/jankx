<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\PostLayout\Generators\DefaultContentGenerator;
use WP_Query;

/**
 * Base Post Layout Abstract Class
 *
 * Class cơ sở cho tất cả post layout implementations
 *
 * @package Jankx\Layouts\PostLayout
 */
abstract class PostLayout implements PostLayoutInterface
{
    /**
     * Layout name/slug
     *
     * @var string
     */
    protected $name = '';

    /**
     * Layout display title
     *
     * @var string
     */
    protected $title = '';

    /**
     * Layout options
     *
     * @var array
     */
    protected $options = [];

    /**
     * WP_Query instance
     *
     * @var WP_Query|null
     */
    protected $query = null;

    /**
     * Content generator instance
     *
     * @var ContentGeneratorInterface|null
     */
    protected $contentGenerator = null;

    /**
     * Default options
     *
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
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->options = $this->defaultOptions;
        $this->contentGenerator = new DefaultContentGenerator($this);
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * {@inheritDoc}
     */
    public function setOptions($options): self
    {
        $this->options = array_merge($this->options, $options);
        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * Get option value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    protected function getOption(string $key, $default = null)
    {
        return $this->options[$key] ?? $default;
    }

    /**
     * {@inheritDoc}
     */
    public function setQuery(WP_Query $query): PostLayoutInterface
    {
        $this->query = $query;
        return $this;
    }

    /**
     * Set content generator
     *
     * @param ContentGeneratorInterface $generator
     * @return PostLayoutInterface
     */
    public function setContentGenerator($generator): PostLayoutInterface
    {
        $this->contentGenerator = $generator;
        return $this;
    }

    /**
     * Get content generator
     *
     * @return ContentGeneratorInterface
     */
    public function getContentGenerator()
    {
        return $this->contentGenerator;
    }

    /**
     * Check if using custom content generator
     *
     * @return bool
     */
    public function hasCustomGenerator(): bool
    {
        return !($this->contentGenerator instanceof DefaultContentGenerator);
    }

    /**
     * {@inheritDoc}
     */
    public function getSupportedOptions(): array
    {
        return array_keys($this->defaultOptions);
    }

    /**
     * Render single post item
     *
     * @param \WP_Post|null $post
     * @return string
     */
    protected function renderPostItem($post = null): string
    {
        if (!$post) {
            global $post;
        }

        ob_start();
        ?>
        <article id="post-<?php echo esc_attr($post->ID); ?>" class="<?php echo esc_attr(implode(' ', get_post_class('post-item', $post->ID))); ?>">
            <?php if ($this->getOption('showFeaturedImage') && has_post_thumbnail($post->ID)) : ?>
                <?php
                $image_ratio = $this->getOption('imageRatio', '');
                $thumbnail_classes = ['post-thumbnail'];
                $thumbnail_styles = [];
                
                // Apply aspect ratio if set (similar to core/image block)
                if (!empty($image_ratio)) {
                    // Parse aspect ratio (e.g., "16/9", "4/3", "1/1")
                    if (preg_match('/^(\d+)\/(\d+)$/', $image_ratio, $matches)) {
                        $width_ratio = floatval($matches[1]);
                        $height_ratio = floatval($matches[2]);
                        $aspect_ratio_value = ($height_ratio / $width_ratio) * 100;
                        $thumbnail_classes[] = 'has-aspect-ratio';
                        // Store aspect ratio value in data attribute for CSS use
                        $thumbnail_styles[] = 'padding-bottom: ' . $aspect_ratio_value . '%';
                    } else {
                        // Handle preset ratios like "16-9", "4-3"
                        $thumbnail_classes[] = 'aspect-ratio-' . esc_attr(str_replace('/', '-', $image_ratio));
                    }
                }
                ?>
                <div class="<?php echo esc_attr(implode(' ', $thumbnail_classes)); ?>"<?php echo !empty($thumbnail_styles) ? ' style="' . esc_attr(implode('; ', $thumbnail_styles)) . '"' : ''; ?>>
                    <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" aria-hidden="true" tabindex="-1">
                        <?php 
                        $thumbnail_html = get_the_post_thumbnail($post->ID, $this->getOption('imageSize', 'large'));
                        
                        // Apply aspect ratio container if set
                        if (!empty($image_ratio) && preg_match('/^(\d+)\/(\d+)$/', $image_ratio)) {
                            // Wrap image with aspect ratio container for proper positioning
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
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>">
                            <?php echo esc_html(get_the_title($post->ID)); ?>
                        </a>
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

    /**
     * {@inheritDoc}
     */
    public function render(): string
    {
        if (!$this->query) {
            return '';
        }

        // Only use generator if it's custom generator
        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generate($this->query, $this->options);
        }

        // Otherwise use default render
        return $this->renderDefault();
    }

    /**
     * Render using default layout logic (for backward compatibility)
     *
     * @return string
     */
    public function renderDefault(): string
    {
        // This will be overridden in child classes
        return '';
    }

    /**
     * {@inheritDoc}
     */
    public function renderPreview(): array
    {
        // Only use generator if it's custom generator
        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generatePreview($this->options);
        }

        // Otherwise use default preview
        return $this->renderDefaultPreview();
    }

    /**
     * Render preview using default logic (for backward compatibility)
     *
     * @return array
     */
    public function renderDefaultPreview(): array
    {
        // This will be overridden in child classes
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getReadOnlyOptions(): array
    {
        return [
            'showTitle', // Title luôn phải hiển thị, không thể ẩn
        ];
    }

    /**
     * Locate and load template file
     * 
     * Search order:
     * 1. Child theme: views/post-layout/{layout-name}.php
     * 2. Child theme: views/post-layout/default.php
     * 3. Parent theme: includes/framework/Layouts/PostLayout/templates/{layout-name}.php
     * 4. Parent theme: includes/framework/Layouts/PostLayout/templates/default.php
     *
     * @param string $template_name Template filename (without .php extension)
     * @param array $args Variables to pass to template
     * @return string Rendered template or empty string if not found
     */
    protected function loadTemplate(string $template_name, array $args = []): string
    {
        // Search in child theme first, then parent theme
        $search_paths = [
            // Child theme views
            get_stylesheet_directory() . '/views/post-layout/',
            // Parent theme templates
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

        // Template not found
        return '';
    }

    /**
     * Render template file with provided variables
     *
     * @param string $template_path Full path to template file
     * @param array $args Variables to pass to template
     * @return string Rendered template
     */
    protected function renderTemplate(string $template_path, array $args = []): string
    {
        if (!file_exists($template_path)) {
            return '';
        }

        // Extract args to variables
        extract($args, EXTR_SKIP);

        // Start output buffering
        ob_start();

        // Include template
        include $template_path;

        // Get output and clean buffer
        return ob_get_clean();
    }

    /**
     * Get template path for a layout
     * 
     * @return string Template path if found, empty string otherwise
     */
    protected function getTemplatePath(): string
    {
        $layout_name = $this->getName();
        $search_paths = [
            get_stylesheet_directory() . '/views/post-layout/',
            get_template_directory() . '/includes/framework/Layouts/PostLayout/templates/',
        ];

        foreach ($search_paths as $base_path) {
            $template_path = $base_path . $layout_name . '.php';
            if (file_exists($template_path)) {
                return $template_path;
            }
        }

        return '';
    }
}