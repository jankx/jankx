<?php

/**
 * Setup Jankx page (Theme system)
 */

namespace Jankx\Foundation;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Jankx;

class PageRenderer
{
    protected static $instance;

    protected $context;
    protected $appliedContext;

    protected $partialName;

    protected $templates;

    protected $loadedLayout;

    protected $isGutenbergSupport;

    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        // Please create the Jankx Page via method getInstance()
        add_action(
            'jankx/template/page/content',
            [$this, 'renderContent'],
            10,
            1
        );
    }

    public function setContext($context)
    {
        $this->context = $context;
    }

    /**
     * Get the current context
     *
     * @return string
     */
    public function getContext()
    {
        return $this->context;
    }

    public function getLoadedLayout()
    {
        return $this->loadedLayout;
    }

    public function setLoadedLayout($layout)
    {
        $this->loadedLayout = $layout;
    }

    public function setTemplates($templates)
    {
        $this->templates = $templates;
    }

    public function generateTemplateNames()
    {
        $templates = empty($this->templates) ? $this->context : $this->templates;

        if (!is_array($templates)) {
            $templates = array($templates);
        }

        if (in_array($this->context, ['tax', 'author', 'date'])) {
            array_push($templates, 'archive');
        }

        array_push($templates, 'index');

        return apply_filters(
            'jankx/template/page/template_names',
            $templates,
            $this->context,
            $this->templates
        );
    }

    public function getTemplates()
    {
        if (is_null($this->templates)) {
            return [];
        }
        return $this->templates;
    }

    public function isGutenbergSupport()
    {
        if (is_null($this->isGutenbergSupport)) {
            // Fallback if function is not loaded yet
            if (function_exists('jankx_is_support_block_template')) {
                $this->isGutenbergSupport = jankx_is_support_block_template();
            } else {
                // Default to false if function not available
                $this->isGutenbergSupport = false;
            }
        }
        return $this->isGutenbergSupport;
    }

    public function renderContent($engine)
    {
        $pre = apply_filters('jankx/template/site/content/pre', null, $this->context, $this->templates);
        if (!is_null($pre)) {
            return $pre;
        }

        // If engine is null, use legacy WordPress template system
        if (is_null($engine)) {
            return $this->renderLegacyContent();
        }

        return $engine->render(
            $this->generateTemplateNames(),
            apply_filters("jankx/template/page/{$this->context}/data", [])
        );
    }

    /**
     * Render content using legacy WordPress template system.
     *
     * @return void
     */
    protected function renderLegacyContent()
    {
        // Get template hierarchy
        $templates = $this->generateTemplateNames();

        // Try to locate template
        $template = locate_template($templates);

        if ($template) {
            load_template($template);
        } else {
            // Fallback to basic content
            $this->renderBasicContent();
        }
    }

    /**
     * Render basic content as fallback.
     *
     * @return void
     */
    protected function renderBasicContent()
    {
        if (is_singular()) {
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                </header>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
            </article>
            <?php
        } elseif (is_archive() || is_home()) {
            if (have_posts()) {
                while (have_posts()) {
                    the_post();
                    ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        <header class="entry-header">
                            <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '">', '</a></h2>'); ?>
                        </header>
                        <div class="entry-summary">
                            <?php the_excerpt(); ?>
                        </div>
                    </article>
                    <?php
                }
            }
        }
    }

    // Compatible with old WordPress versions.
    public function legacyRender($engine)
    {
        /**
         * Get site header
         */
        get_header(
            apply_filters(
                'jankx/template/page/header/name',
                null,
                $this->templates,
                $this->context
            )
        );

        // Setup post data
        if (is_singular()) {
            the_post();
        }

        do_action('jankx/template/page/content/before', $this->appliedContext, $this->templates);

        do_action(
            'jankx/template/page/content',
            $engine,
            $this->appliedContext,
            $this->templates
        );

        do_action('jankx/template/page/content/after', $this->appliedContext, $this->templates);

        get_footer(
            apply_filters(
                'jankx/template/page/footer/name',
                null,
                $this->templates,
                $this->context
            )
        );

        do_action('jankx/template/page/render/end', $this);
    }

    /**
     * The main template render
     *
     * @param string $context Create the action hook via render context
     * @return void
     */
    public function render()
    {
        do_action('jankx/template/page/render/start', $this);

        // For now, we'll use legacy render for all cases
        // TODO: Implement proper template engine integration
        $engine = null;

        $template_html = $this->isGutenbergSupport() ? (
            function_exists('jankx_get_the_block_template_html') ? jankx_get_the_block_template_html() : (
                function_exists('get_the_block_template_html') ? get_the_block_template_html() : null
            )
        ) : null;
        $this->appliedContext = $this->context;
        if (empty($this->partialName)) {
            if ($this->appliedContext === 'single') {
                $this->partialName = get_post_type();
            } elseif ($this->appliedContext === 'taxonomy') {
                $this->appliedContext = 'archive';
                $queried_object = get_queried_object();
                $this->partialName = $queried_object->taxonomy;
            }
        }

        if (is_null($template_html)) {
            return $this->legacyRender(null);
        }

        ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?> class="<?php echo isset($html_class) ? implode(' ', (array) $html_class) : 'no-js'; ?>">
        <head>
            <meta charset="<?php bloginfo('charset'); ?>" />
            <?php wp_head(); ?>
        </head>

        <body <?php body_class(); ?>>
        <?php wp_body_open(); ?>

        <?php echo $template_html; ?>

        <?php wp_footer(); ?>
        </body>
        </html>

        <?php
        do_action('jankx/template/page/render/end', $this);
    }
}
