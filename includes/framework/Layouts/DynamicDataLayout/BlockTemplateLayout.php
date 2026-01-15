<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use WP_Query;

abstract class BlockTemplateLayout implements BlockTemplateLayoutInterface
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

    public function setQuery(WP_Query $query): BlockTemplateLayoutInterface
    {
        $this->query = $query;
        return $this;
    }

    public function setContentGenerator($generator): BlockTemplateLayoutInterface
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

        // Allow dynamically setting content generator
        $this->contentGenerator = apply_filters(
            'jankx/view-layout/generator',
            $this->contentGenerator,
            $this->getOption('postType'),
            $this->options,
            $this
        );

        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generate($this->query, $this->options);
        }
        $templateBlock = $this->getOption('postTemplate');
        if (is_array($templateBlock) && !empty($templateBlock)) {
            $html = DynamicDataTemplateBlock::renderTemplateWithQuery(
                $templateBlock,
                $this->query,
                $this->options,
                $this instanceof BlockTemplateLayoutInterface ? $this : null
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
        // Allow dynamically setting content generator
        $this->contentGenerator = apply_filters(
            'jankx/view-layout/generator',
            $this->contentGenerator,
            $this->getOption('postType'),
            $this->options,
            $this
        );

        if ($this->hasCustomGenerator()) {
            return $this->contentGenerator->generatePreview($this->options);
        }
        $templateBlock = $this->getOption('postTemplate');
        if (is_array($templateBlock) && !empty($templateBlock)) {
            $generator = new PostTemplateBlockGenerator($templateBlock, $this->options);
            $generator->setLayout($this instanceof BlockTemplateLayoutInterface ? $this : null);
            $preview = $generator->generatePreview($this->options);
            if (!empty($preview)) {
                return $preview;
            }
        }
        return $this->renderDefaultPreview();
    }

    public function wrapTemplateHtml(string $html, array $options = []): string
    {
        $structure = $this->getHtmlStructure($options);
        $container = $structure['container'] ?? [];
        $tag = isset($container['tag']) ? (string) $container['tag'] : 'div';

        // Use custom generator if available for inner items
        // This method should only provide the inner structure of the layout
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
        $classes = ['post-type-layout-' . $this->name, 'layout-' . $this->name];
        if (!empty($options['columns'])) {
            $classes[] = 'columns-' . intval($options['columns']);
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

    protected function buildItemClasses(): string
    {
        $classes = get_post_class(['jankx-loop-item']);
        $templateBlock = $this->getOption('postTemplate');
        $loopLayout = 'normal';

        if (is_array($templateBlock) && !empty($templateBlock['attrs']['contentLoopLayout'])) {
            $loopLayout = $templateBlock['attrs']['contentLoopLayout'];
        }

        $classes[] = 'content-loop-layout--' . $loopLayout;

        if ($loopLayout === 'boxed') {
            $classes[] = 'card';
        }

        return implode(' ', array_unique(array_filter(array_map('sanitize_html_class', $classes))));
    }

    public function renderPostItem(): string
    {
        $post_id = get_the_ID();
        $show_thumbnail = (bool) $this->getOption('showFeaturedImage', true);
        $show_title = (bool) $this->getOption('showTitle', true);
        $show_excerpt = (bool) $this->getOption('showExcerpt', true);
        $show_date = (bool) $this->getOption('showDate', true);
        $show_price = (bool) $this->getOption('showPrice', true);
        $show_add_to_cart = (bool) $this->getOption('showAddToCart', true);
        $excerpt_length = (int) $this->getOption('excerptLength', 55);

        $templateBlock = $this->getOption('postTemplate');
        $loopLayout = is_array($templateBlock) && !empty($templateBlock['attrs']['contentLoopLayout'])
            ? $templateBlock['attrs']['contentLoopLayout']
            : 'normal';

        $parts = [];

        if ($show_thumbnail && has_post_thumbnail($post_id)) {
            $thumb = get_the_post_thumbnail($post_id, 'post-thumbnail', ['style' => 'object-fit:cover;']);
            $parts[] = sprintf('<figure class="wp-block-post-featured-image">%s</figure>', $thumb);
        }

        // Start content wrapper
        $parts[] = '<div class="post-content-wrapper">';

        if ($show_title) {
            $parts[] = sprintf(
                '<h2 class="wp-block-post-title"><a href="%s">%s</a></h2>',
                esc_url(get_permalink($post_id)),
                esc_html(get_the_title($post_id))
            );
        }

        if ($show_date) {
            $parts[] = sprintf(
                '<div class="wp-block-post-date"><time datetime="%s">%s</time></div>',
                esc_attr(get_post_time('c', true, $post_id)),
                esc_html(get_the_date('', $post_id))
            );
        }

        if ($show_excerpt) {
            $raw_excerpt = has_excerpt($post_id) ? get_the_excerpt($post_id) : get_post_field('post_content', $post_id);
            $trimmed = wp_trim_words($raw_excerpt, max(1, $excerpt_length));
            $parts[] = sprintf(
                '<div class="wp-block-post-excerpt"><p class="wp-block-post-excerpt__excerpt">%s</p></div>',
                esc_html($trimmed)
            );
        }

        // Add WooCommerce blocks if it's a product
        if (get_post_type($post_id) === 'product') {
            if ($show_price && function_exists('woocommerce_template_loop_price')) {
                ob_start();
                woocommerce_template_loop_price();
                $parts[] = sprintf('<div class="wp-block-woocommerce-product-price">%s</div>', ob_get_clean());
            }

            if ($show_add_to_cart && function_exists('woocommerce_template_loop_add_to_cart')) {
                ob_start();
                woocommerce_template_loop_add_to_cart();
                $parts[] = sprintf('<div class="wp-block-woocommerce-product-button">%s</div>', ob_get_clean());
            }
        }

        $parts[] = '</div>'; // End content wrapper

        $content = implode('', $parts);
        if ($loopLayout === 'boxed') {
            return sprintf('<div class="card-body">%s</div>', $content);
        }

        return $content;
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

    // Additional methods for compatibility
    public function withQuery(WP_Query $query): self
    {
        return $this->setQuery($query);
    }

    public function withAttributes(array $attributes): self
    {
        return $this->setOptions($attributes);
    }

    public function getLayout(): self
    {
        return $this;
    }
}
