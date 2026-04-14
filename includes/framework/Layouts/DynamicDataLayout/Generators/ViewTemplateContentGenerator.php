<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Generators\Concerns\PostTemplateRendererTrait;
use WP_Post;
use WP_Query;
use Jankx\Facades\Log;
use Jankx\Foundation\Application;

class ViewTemplateContentGenerator extends AbstractContentGenerator
{
    use PostTemplateRendererTrait {
        renderCarousel as traitRenderCarousel;
        renderTemplateForPost as traitRenderTemplateForPost;
        buildBlockContext as traitBuildBlockContext;
        buildItemClasses as traitBuildItemClasses;
        buildWrapperAttributes as traitBuildWrapperAttributes;
        resolveImageRatioValue as traitResolveImageRatioValue;
        stringifyAttributes as traitStringifyAttributes;
    }

    protected array $templateBlock;
    protected array $parentAttributes;
    protected array $runtimeOptions = [];
    protected string $currentLayout = '';

    public function __construct(array $templateBlock, array $parentAttributes = [])
    {
        $this->templateBlock = $templateBlock;
        $this->parentAttributes = $parentAttributes;
    }

    protected function renderContent(WP_Query $query, array $options = []): string
    {
        $this->runtimeOptions = $options;

        if (!$query->have_posts()) {
            return '';
        }

        $layoutType = $this->getOption('layout', $options['layout'] ?? '');
        $this->currentLayout = $layoutType;

        if ($layoutType === 'carousel') {
            $before = '';
            $after = '';
            ob_start();
            do_action('jankx/dynamic-data-template/before_loop', $options, $query, $this->getLayout());
            $before = (string) ob_get_clean();
            $html = $this->renderCarousel($query, $options);
            ob_start();
            do_action('jankx/dynamic-data-template/after_loop', $options, $query, $this->getLayout());
            $after = (string) ob_get_clean();
            $html = $before . $html . $after;
            $this->runtimeOptions = [];
            $this->currentLayout = '';
            return $html;
        }

        $wrapperAttributes = $this->buildWrapperAttributes($options);
        $before = '';
        $after = '';
        ob_start();
        do_action('jankx/dynamic-data-template/before_loop', $options, $query, $this->getLayout());
        $before = (string) ob_get_clean();
        $items = $this->renderPosts($query, $options);
        ob_start();
        do_action('jankx/dynamic-data-template/after_loop', $options, $query, $this->getLayout());
        $after = (string) ob_get_clean();

        $this->runtimeOptions = [];
        $this->currentLayout = '';

        if ($items === '') {
            return '';
        }

        return sprintf('%s<ul %s>%s</ul>%s', $before, $this->stringifyAttributes($wrapperAttributes), $items, $after);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [
            'generator' => $this->getName(),
            'layout' => $this->getOption('layout', $options['layout'] ?? null),
            'columns' => $this->getOption('columns', $options['columns'] ?? null),
        ];
    }

    public function getName(): string
    {
        return 'view-template-content';
    }

    public function getTitle(): string
    {
        return __('View Template Content Generator', 'jankx');
    }

    protected function renderCarousel(WP_Query $query, array $options): string
    {
        return $this->traitRenderCarousel($query, $options);
    }

    protected function renderTemplateForPost(WP_Post $post, WP_Query $query, array $options): string
    {
        // Get template slug from template block attributes
        $templateSlug = $this->templateBlock['attrs']['templateSlug'] ?? 'layouts/loop/item-default';
        // Normalize invalid slugs (e.g., just 'grid', 'list') to default item template
        if (!is_string($templateSlug) || strpos($templateSlug, '/') === false) {
            $templateSlug = 'layouts/loop/item-default';
        }
        
        // Build template variables
        $templateVars = $this->buildTemplateVariables($post, $query, $options);
        
        // Render the template
        return $this->renderViewTemplate($templateSlug, $templateVars);
    }

    protected function renderViewTemplate(string $templateSlug, array $variables): string
    {
        try {
            // Get the application instance for template rendering
            $app = Application::getInstance();
            
            // Resolve post type to prioritize post-type-specific template paths
            $postType = $variables['post_type']
                ?? ((isset($variables['post']) && $variables['post'] instanceof WP_Post) ? $variables['post']->post_type : null);
            
            // Build template file path
            $templateFile = $this->locateTemplateFile($templateSlug, $postType);
            
            if (!$templateFile || !file_exists($templateFile)) {
                // Fallback to default item template
                $fallbackSlug = 'layouts/loop/item-default';
                $fallbackFile = $this->locateTemplateFile($fallbackSlug, $postType);
                if ($fallbackFile && file_exists($fallbackFile)) {
                    $templateFile = $fallbackFile;
                    $templateSlug = $fallbackSlug;
                } else {
                    Log::warning(sprintf(
                        'ViewTemplateContentGenerator: Template file not found: %s',
                        $templateSlug
                    ));
                    return '';
                }
            }

            // Check if it's a Latte template
            if (str_ends_with($templateFile, '.latte')) {
                // Use Latte engine if available
                if ($app->bound('latte.engine')) {
                    $latte = $app->make('latte.engine');
                    return $latte->render($templateFile, $variables);
                } else {
                    // Fallback to simple PHP rendering for Latte files
                    extract($variables);
                    ob_start();
                    include $templateFile;
                    return ob_get_clean();
                }
            } else {
                // PHP template rendering
                extract($variables);
                ob_start();
                include $templateFile;
                return ob_get_clean();
            }
            
        } catch (\Throwable $exception) {
            Log::error(sprintf(
                'ViewTemplateContentGenerator: Template rendering error for %s - %s',
                $templateSlug,
                $exception->getMessage()
            ));
            return '<div style="padding: 12px; text-align: center;">' . __('Template rendering error: ', 'jankx') . esc_html($exception->getMessage()) . '</div>';
        }
    }

    protected function locateTemplateFile(string $templateSlug, ?string $postType = null): ?string
    {
        // Convert slug to file path
        $templatePath = str_replace('/', DIRECTORY_SEPARATOR, $templateSlug);
        $viewsDirChild = get_stylesheet_directory() . '/views/';
        $viewsDirParent = get_template_directory() . '/views/';
        
        // If post type is provided, first try post-type-specific paths under views/layouts/loop/{postType}/...
        if (!empty($postType)) {
            $sanitizedPostType = sanitize_file_name($postType);
            $loopPrefix = 'layouts' . DIRECTORY_SEPARATOR . 'loop' . DIRECTORY_SEPARATOR;
            if (str_starts_with($templatePath, $loopPrefix)) {
                // Preserve any nested path after layouts/loop/
                $suffix = substr($templatePath, strlen($loopPrefix));
                $postTypePath = $loopPrefix . $sanitizedPostType . DIRECTORY_SEPARATOR . $suffix;
                
                // Try Latte first
                $childPostTypeLatte = $viewsDirChild . $postTypePath . '.latte';
                if (file_exists($childPostTypeLatte)) {
                    return $childPostTypeLatte;
                }
                $parentPostTypeLatte = $viewsDirParent . $postTypePath . '.latte';
                if (file_exists($parentPostTypeLatte)) {
                    return $parentPostTypeLatte;
                }
                
                // Fallback to PHP under post-type path
                $childPostTypePhp = $viewsDirChild . $postTypePath . '.php';
                if (file_exists($childPostTypePhp)) {
                    return $childPostTypePhp;
                }
                $parentPostTypePhp = $viewsDirParent . $postTypePath . '.php';
                if (file_exists($parentPostTypePhp)) {
                    return $parentPostTypePhp;
                }
            }
        }
        
        // Check for .latte files first (Latte templates)
        $latteExtensions = ['.latte'];
        foreach ($latteExtensions as $ext) {
            // Check child theme first
            $childThemePath = $viewsDirChild . $templatePath . $ext;
            if (file_exists($childThemePath)) {
                return $childThemePath;
            }
            
            // Check parent theme
            $parentThemePath = $viewsDirParent . $templatePath . $ext;
            if (file_exists($parentThemePath)) {
                return $parentThemePath;
            }
        }
        
        // Fallback to .php files for backward compatibility
        $phpPath = $viewsDirChild . $templatePath . '.php';
        if (file_exists($phpPath)) {
            return $phpPath;
        }
        
        $phpPath = $viewsDirParent . $templatePath . '.php';
        if (file_exists($phpPath)) {
            return $phpPath;
        }
        
        return null;
    }

    protected function buildTemplateVariables(WP_Post $post, WP_Query $query, array $options): array
    {
        // Get template attributes
        $templateAttrs = $this->templateBlock['attrs'] ?? [];
        
        // Build common variables
        $variables = [
            'post' => $post,
            'query' => $query,
            'options' => $options,
            'layout' => $this->getLayout(),
            'template_block' => $this->templateBlock,
            'parent_attributes' => $this->parentAttributes,
        ];

        // Add display options
        $variables['show_title'] = $templateAttrs['showTitle'] ?? true;
        $variables['show_excerpt'] = $templateAttrs['showExcerpt'] ?? true;
        $variables['excerpt_length'] = $templateAttrs['excerptLength'] ?? 55;
        $variables['show_date'] = $templateAttrs['showDate'] ?? true;
        $variables['show_author'] = $templateAttrs['showAuthor'] ?? false;
        $variables['show_price'] = $templateAttrs['showPrice'] ?? true;
        $variables['show_add_to_cart'] = $templateAttrs['showAddToCart'] ?? true;
        $variables['show_rating'] = $templateAttrs['showRating'] ?? false;
        
        // Add styling options
        $variables['thumbnail_position'] = $templateAttrs['thumbnailPosition'] ?? 'top';
        $variables['image_ratio'] = $templateAttrs['imageRatio'] ?? '';
        $variables['item_spacing'] = $templateAttrs['itemSpacing'] ?? 'normal';
        $variables['show_item_border'] = $templateAttrs['showItemBorder'] ?? false;
        $variables['item_border_radius'] = $templateAttrs['itemBorderRadius'] ?? 0;
        
        // Add layout context
        $variables['current_layout'] = $this->currentLayout;
        $variables['columns'] = $options['columns'] ?? 3;
        $variables['columns_tablet'] = $options['columnsTablet'] ?? 2;
        $variables['columns_mobile'] = $options['columnsMobile'] ?? 1;
        
        // Add post type for template resolution priority
        $variables['post_type'] = $post->post_type ?? null;

        return $variables;
    }

    protected function buildBlockContext(WP_Post $post, WP_Query $query, array $options): array
    {
        return $this->traitBuildBlockContext($post, $query, $options);
    }

    protected function buildItemClasses(WP_Post $post): string
    {
        return $this->traitBuildItemClasses($post);
    }

    protected function buildWrapperAttributes(array $options): array
    {
        return $this->traitBuildWrapperAttributes($options);
    }

    protected function resolveImageRatioValue($ratio, array $options): ?string
    {
        return $this->traitResolveImageRatioValue($ratio, $options);
    }

    protected function stringifyAttributes(array $attributes): string
    {
        return $this->traitStringifyAttributes($attributes);
    }

    protected function getOption(string $key, $default = null)
    {
        if (array_key_exists($key, $this->runtimeOptions)) {
            return $this->runtimeOptions[$key];
        }

        if (array_key_exists($key, $this->parentAttributes)) {
            return $this->parentAttributes[$key];
        }

        $layout = $this->getLayout();
        if ($layout) {
            $layoutOptions = $layout->getOptions();
            if (array_key_exists($key, $layoutOptions)) {
                return $layoutOptions[$key];
            }
        }

        return $default;
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return [];
    }
}
