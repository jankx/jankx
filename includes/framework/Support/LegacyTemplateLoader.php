<?php

namespace Jankx\Framework\Support;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

class LegacyTemplateLoader
{
    protected static $instance;

    protected $templateHierarchy = [];

    protected $templateCache = [];

    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_filter('template_include', [$this, 'overrideTemplateInclude'], 99);
        add_filter('template_redirect', [$this, 'handleTemplateRedirect'], 1);
    }

    /**
     * Override template include to use Jankx PageRenderer.
     *
     * @param string $template
     * @return string
     */
    public function overrideTemplateInclude($template)
    {
        // Skip if already using block template
        if (jankx_is_support_block_template()) {
            return $template;
        }

        // Skip if it's an admin request
        if (is_admin()) {
            return $template;
        }

        // Skip if it's a REST API request
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return $template;
        }

        // Skip if it's an AJAX request
        if (wp_doing_ajax()) {
            return $template;
        }

        // Skip if it's a cron request
        if (wp_doing_cron()) {
            return $template;
        }

        // Use Jankx PageRenderer for legacy templates
        $this->renderWithJankx();

        // Return a dummy template to prevent WordPress from loading the original
        return $this->getDummyTemplate();
    }

    /**
     * Handle template redirect for legacy templates.
     */
    public function handleTemplateRedirect()
    {
        // Skip if already using block template
        if (jankx_is_support_block_template()) {
            return;
        }

        // Skip if it's an admin request
        if (is_admin()) {
            return;
        }

        // Skip if it's a REST API request
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return;
        }

        // Skip if it's an AJAX request
        if (wp_doing_ajax()) {
            return;
        }

        // Skip if it's a cron request
        if (wp_doing_cron()) {
            return;
        }

        // Set up template hierarchy
        $this->setupTemplateHierarchy();
    }

    /**
     * Setup template hierarchy for current page.
     */
    protected function setupTemplateHierarchy()
    {
        $context = $this->determineContext();
        $templates = $this->buildTemplateHierarchy($context);

        $this->templateHierarchy = apply_filters(
            'jankx/legacy/template/hierarchy',
            $templates,
            $context
        );
    }

    /**
     * Determine the current page context.
     *
     * @return string
     */
    protected function determineContext()
    {
        if (is_front_page()) {
            return 'front-page';
        }

        if (is_home()) {
            return 'home';
        }

        if (is_singular()) {
            return 'single';
        }

        if (is_archive()) {
            if (is_category()) {
                return 'category';
            }

            if (is_tag()) {
                return 'tag';
            }

            if (is_author()) {
                return 'author';
            }

            if (is_date()) {
                return 'date';
            }

            if (is_tax()) {
                return 'taxonomy';
            }

            return 'archive';
        }

        if (is_search()) {
            return 'search';
        }

        if (is_404()) {
            return '404';
        }

        return 'index';
    }

    /**
     * Build template hierarchy for the given context.
     *
     * @param string $context
     * @return array
     */
    protected function buildTemplateHierarchy($context)
    {
        $templates = [];

        switch ($context) {
            case 'single':
                $post_type = get_post_type();
                $templates[] = "single-{$post_type}";
                $templates[] = 'single';
                break;

            case 'category':
                $category = get_queried_object();
                $templates[] = "category-{$category->slug}";
                $templates[] = "category-{$category->term_id}";
                $templates[] = 'category';
                break;

            case 'tag':
                $tag = get_queried_object();
                $templates[] = "tag-{$tag->slug}";
                $templates[] = "tag-{$tag->term_id}";
                $templates[] = 'tag';
                break;

            case 'author':
                $author = get_queried_object();
                $templates[] = "author-{$author->user_nicename}";
                $templates[] = "author-{$author->ID}";
                $templates[] = 'author';
                break;

            case 'date':
                $templates[] = 'date';
                break;

            case 'taxonomy':
                $taxonomy = get_queried_object();
                $templates[] = "taxonomy-{$taxonomy->taxonomy}-{$taxonomy->slug}";
                $templates[] = "taxonomy-{$taxonomy->taxonomy}";
                $templates[] = 'taxonomy';
                break;

            case 'archive':
                $post_type = get_post_type();
                if ($post_type) {
                    $templates[] = "archive-{$post_type}";
                }
                $templates[] = 'archive';
                break;

            case 'search':
                $templates[] = 'search';
                break;

            case '404':
                $templates[] = '404';
                break;

            case 'front-page':
                $templates[] = 'front-page';
                break;

            case 'home':
                $templates[] = 'home';
                break;
        }

        $templates[] = 'index';

        return $templates;
    }

    /**
     * Render page using Jankx PageRenderer.
     */
    protected function renderWithJankx()
    {
        $context = $this->determineContext();
        $templates = $this->templateHierarchy;

        jankx_render_page($context, $templates);
    }

    /**
     * Get dummy template path to prevent WordPress from loading original template.
     *
     * @return string
     */
    protected function getDummyTemplate()
    {
        // Return a dummy template that does nothing
        return ABSPATH . 'wp-includes/template.php';
    }

    /**
     * Get template hierarchy for current page.
     *
     * @return array
     */
    public function getTemplateHierarchy()
    {
        return $this->templateHierarchy;
    }

    /**
     * Check if legacy template loading is enabled.
     *
     * @return bool
     */
    public function isLegacyTemplateEnabled()
    {
        return apply_filters('jankx/legacy/template/enabled', true);
    }
}
