<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Foundation\Application;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use Jankx\Layouts\DynamicDataLayout\Contracts\LayoutDataParserInterface;
use Jankx\Layouts\DynamicDataLayout\Parsers\DefaultLayoutDataParser;
use Jankx\Layouts\DynamicDataLayout\Parsers\GridLayoutDataParser;
use Jankx\Layouts\DynamicDataLayout\Parsers\CarouselLayoutDataParser;
use Jankx\Services\ViewService;
use WP_Query;

/**
 * Abstract Block Template Layout
 * 
 * Foundation for all data-driven layouts in the framework.
 * Uses ViewService for rendering and supports standardized data parsing via Parsers.
 */
abstract class BlockTemplateLayout implements BlockTemplateLayoutInterface
{
    /**
     * @var string
     */
    protected $name = '';

    /**
     * @var string
     */
    protected $title = '';

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var \WP_Query|array|null
     */
    protected $query = null;

    /**
     * @var ContentGeneratorInterface|null
     */
    protected $contentGenerator = null;

    /**
     * @var ViewService
     */
    protected $viewService;

    /**
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

    /**
     * Constructor with Dependency Injection
     *
     * @param ViewService|null $viewService
     */
    public function __construct(?ViewService $viewService = null)
    {
        $this->viewService = $viewService ?? $this->resolveViewService();
        $this->options = $this->defaultOptions;
    }

    /**
     * Resolve ViewService from Application container
     *
     * @return ViewService
     */
    protected function resolveViewService(): ViewService
    {
        $app = Application::getInstance();
        if ($app) {
            try {
                return $app->make(ViewService::class);
            } catch (\Exception $e) {
                // Fall back to manual instantiation
            }
        }
        return new ViewService();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getIcon(): string
    {
        return 'dashicons-layout';
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

    public function setQuery($query): BlockTemplateLayoutInterface
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

    /**
     * Get a standardized data package for templates or JSON responses.
     * Implements the Strategy Pattern via DataParsers.
     * 
     * @return array
     */
    public function getTemplateData(): array
    {
        $parser = $this->getParser();
        $data = $parser->parse();

        // Inject the query into data
        $data['query'] = $this->query;

        return apply_filters("jankx/layout/{$this->name}/data", $data, $this);
    }

    /**
     * Resolve the appropriate parser for this layout.
     * 
     * @return LayoutDataParserInterface
     */
    protected function getParser(): LayoutDataParserInterface
    {
        $parsers = apply_filters('jankx/layout/parsers', [
            'grid' => GridLayoutDataParser::class,
            'carousel' => CarouselLayoutDataParser::class,
            'masonry' => \Jankx\Layouts\DynamicDataLayout\Parsers\MasonryLayoutDataParser::class,
        ], $this);

        $parserClass = $parsers[$this->name] ?? DefaultLayoutDataParser::class;

        return new $parserClass($this);
    }

    public function hasCustomGenerator(): bool
    {
        return $this->contentGenerator instanceof ContentGeneratorInterface
            && !($this->contentGenerator instanceof PostTemplateBlockGenerator);
    }

    /**
     * Render the layout HTML
     * 
     * @return string
     */
    public function render(): string
    {
        if (!$this->query) {
            return '';
        }

        // Apply filters to allow runtime generator switching
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
        // Wrap logic if needed
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

    /**
     * Whether this layout supports responsive column settings.
     * Override and return true in grid/card/masonry-based layouts.
     *
     * @return bool
     */
    public function supportsColumns(): bool
    {
        return false;
    }

    protected function getContainerStructure(array $options): array
    {
        $classes = ['post-type-layout-' . $this->name, 'layout-' . $this->name];
        $styles  = [];

        if ($this->supportsColumns()) {
            if (!empty($options['columns'])) {
                $classes[] = 'columns-' . intval($options['columns']);
                $styles['--columns-desktop'] = (string) intval($options['columns']);
            }
            if (!empty($options['columnsTablet'])) {
                $styles['--columns-tablet'] = (string) intval($options['columnsTablet']);
            }
            if (!empty($options['columnsMobile'])) {
                $styles['--columns-mobile'] = (string) intval($options['columnsMobile']);
            }
        }

        return [
            'tag'        => 'div',
            'classes'    => $classes,
            'styles'     => $styles,
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

    /**
     * Render a view template using the ViewService
     * 
     * @param string $view
     * @param array $args
     * @return string
     */
    protected function renderView(string $view, array $args = []): string
    {
        return $this->viewService->render($view, $args);
    }

    public function buildItemClasses(): string
    {
        $classes = get_post_class(['jankx-loop-item']);
        $templateBlock = $this->getOption('postTemplate');
        $loopLayout = 'default';

        if (is_array($templateBlock) && !empty($templateBlock['attrs']['templateLayout'])) {
            $loopLayout = $templateBlock['attrs']['templateLayout'];
        }

        $classes[] = 'content-loop-layout--' . $loopLayout;
        $classes[] = 'template-layout--' . $loopLayout;

        if ($loopLayout === 'boxed') {
            $classes[] = 'card';
        }

        return implode(' ', array_unique(array_filter(array_map('sanitize_html_class', $classes))));
    }

    /**
     * Render a default post item structure
     * 
     * @return string
     */
    public function renderPostItem(): string
    {
        $post_id = get_the_ID();
        $templateBlock = $this->getOption('postTemplate');
        $loopLayout = is_array($templateBlock) && !empty($templateBlock['attrs']['templateLayout'])
            ? $templateBlock['attrs']['templateLayout']
            : 'default';

        $data = [
            'post_id' => $post_id,
            'options' => $this->options,
            'loop_layout' => $loopLayout,
            'post_type' => get_post_type($post_id)
        ];

        // Try to render using standardized view
        if ($this->viewService->exists('post-layout/item')) {
            return $this->renderView('post-layout/item', $data);
        }

        // Fallback to internal logic 
        return $this->renderDefaultPostItem($data);
    }


    /**
     * Internal fallback for post item rendering
     */
    protected function renderDefaultPostItem(array $data): string
    {
        $parts = [];
        $post_id = $data['post_id'];
        $options = $data['options'];

        if (!empty($options['showFeaturedImage']) && has_post_thumbnail($post_id)) {
            $thumb = get_the_post_thumbnail($post_id, 'post-thumbnail');
            $parts[] = sprintf('<figure class="wp-block-post-featured-image">%s</figure>', $thumb);
        }

        $parts[] = '<div class="post-content-wrapper">';
        
        if (!empty($options['showTitle'])) {
            $parts[] = sprintf(
                '<h2 class="wp-block-post-title"><a href="%s">%s</a></h2>',
                esc_url(get_permalink($post_id)),
                esc_html(get_the_title($post_id))
            );
        }

        if (!empty($options['showDate'])) {
            $parts[] = sprintf(
                '<div class="wp-block-post-date">%s</div>',
                esc_html(get_the_date('', $post_id))
            );
        }

        if (!empty($options['showExcerpt'])) {
            $excerpt = wp_trim_words(get_the_excerpt($post_id), (int)($options['excerptLength'] ?? 55));
            $parts[] = sprintf('<div class="wp-block-post-excerpt"><p>%s</p></div>', esc_html($excerpt));
        }

        $parts[] = '</div>';

        $content = implode('', $parts);
        if ($data['loop_layout'] === 'boxed') {
            return sprintf('<div class="card-body">%s</div>', $content);
        }

        return $content;
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return $classes;
    }

    public function withQuery($query): self
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

