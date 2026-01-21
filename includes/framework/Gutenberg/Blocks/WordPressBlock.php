<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class WordPressBlock extends Block
{
    protected $blockId = 'jankx/wordpress';

    protected static $calledComponents = [];

    public function init()
    {
        // Trigger for the whole page asset management
        add_action('wp_enqueue_scripts', [$this, 'handleGlobalAssetsTrigger'], 20);
    }

    public function handleGlobalAssetsTrigger()
    {
        if (is_admin()) {
            return;
        }

        global $post;
        if (!$post || empty($post->post_content)) {
            return;
        }

        // Parse blocks to find if any WordPress block has disableGlobalStyle enabled
        $blocks = parse_blocks($post->post_content);
        if ($this->hasDisableGlobalStyleTrigger($blocks)) {
            // Disable main theme stylesheet as requested
            wp_dequeue_style(get_template());
            wp_dequeue_style(get_stylesheet());
        }
    }

    protected function hasDisableGlobalStyleTrigger($blocks)
    {
        foreach ($blocks as $block) {
            if ($block['blockName'] === $this->blockId) {
                if (!empty($block['attrs']['disableGlobalStyle'])) {
                    return true;
                }
            }
            if (!empty($block['innerBlocks'])) {
                if ($this->hasDisableGlobalStyleTrigger($block['innerBlocks'])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Handle WordPress legacy features intelligently
     */
    public function render($attributes, $content = '', $block = null)
    {
        $type = $attributes['legacyType'] ?? 'none';

        if ($type !== 'none' && !in_array($type, self::$calledComponents)) {
            self::$calledComponents[] = $type;
            // Trigger asset loading for this specific component
            self::enqueueLegacyAssets($type);
        }

        $output = '';

        switch ($type) {
            case 'recent_comments':
                $output = $this->renderRecentComments($attributes);
                break;
            case 'categories':
                $output = $this->renderCategories($attributes);
                break;
            case 'archives':
                $output = $this->renderArchives($attributes);
                break;
            case 'pagination':
                $output = $this->renderPagination($attributes);
                break;
            case 'meta':
                $output = $this->renderMeta();
                break;
            default:
                $output = !empty($content) ? $content : '<!-- Empty Legacy Block -->';
                break;
        }

        return sprintf(
            '<div class="jankx-wordpress-legacy jankx-legacy-%s">%s</div>',
            esc_attr($type),
            $output
        );
    }

    public static function enqueueLegacyAssets($type)
    {
        // On-demand asset loading logic
        // We can use wp_enqueue_style here; since it's called during render, 
        // WordPress will automatically put it in the footer if wp_head has already passed.
        // This is perfect for PageSpeed.

        $handle = "jankx-legacy-{$type}";
        $css_content = self::getLegacyComponentCSS($type);

        if (!empty($css_content)) {
            // If we want to strictly avoid style.css, we inject minimal inline CSS
            add_action('wp_footer', function () use ($handle, $css_content) {
                echo "<style id='{$handle}-inline-css'>{$css_content}</style>";
            }, 5);
        }

        // Potential trigger to disable main style.css if this block is intended to replace it
        // add_action('wp_enqueue_scripts', function() {
        //    wp_dequeue_style('jankx-framework');
        // }, 20);
    }

    public static function getLegacyComponentCSS($type)
    {
        // Return minimal CSS for each component to avoid global style.css
        $css = [
            'categories' => '.wp-legacy-categories { list-style: none; padding: 0; } .wp-legacy-categories li { margin-bottom: 5px; }',
            'archives' => '.wp-legacy-archives { list-style: none; padding: 0; }',
            'recent_comments' => '.widget_recent_comments ul { list-style: none; padding: 0; }',
            'pagination' => '.wp-block-query-pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 2rem 0; } .wp-block-query-pagination ul.page-numbers { display: flex; list-style: none; padding: 0; margin: 0; gap: 0.5rem; flex-wrap: wrap; justify-content: center; } .page-numbers:not(ul) { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px; padding: 5px 10px; border: 1px solid #e0e0e0; border-radius: 4px; background: white; color: #333; text-decoration: none; font-size: 14px; transition: all 0.2s; } .page-numbers.current { background: #ff5c00; border-color: #ff5c00; color: white; } .page-numbers:hover:not(.current) { border-color: #ff5c00; color: #ff5c00; }',
        ];

        return $css[$type] ?? '';
    }

    protected function renderRecentComments($attrs)
    {
        ob_start();
        the_widget('WP_Widget_Recent_Comments', $attrs['extraParams'] ?? []);
        return ob_get_clean();
    }

    protected function renderCategories($attrs)
    {
        ob_start();
        echo '<ul class="wp-legacy-categories">';
        wp_list_categories(array_merge([
            'title_li' => '',
            'show_count' => true
        ], $attrs['extraParams'] ?? []));
        echo '</ul>';
        return ob_get_clean();
    }

    protected function renderArchives($attrs)
    {
        ob_start();
        echo '<ul class="wp-legacy-archives">';
        wp_get_archives(array_merge([
            'type' => 'monthly',
            'show_post_count' => true
        ], $attrs['extraParams'] ?? []));
        echo '</ul>';
        return ob_get_clean();
    }

    protected function renderMeta()
    {
        ob_start();
        the_widget('WP_Widget_Meta');
        return ob_get_clean();
    }

    protected function renderPagination($attrs)
    {
        global $wp_query;
        $big = 999999999; // need an unlikely integer

        $args = array_merge([
            'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
            'format' => '?paged=%#%',
            'current' => max(1, get_query_var('paged')),
            'total' => $wp_query->max_num_pages,
            'type' => 'plain',
            'prev_text' => __('&larr; Previous', 'jankx'),
            'next_text' => __('Next &rarr;', 'jankx'),
        ], $attrs['extraParams'] ?? []);

        $links = paginate_links($args);

        if (!$links) {
            return '';
        }

        return sprintf('<nav class="wp-block-query-pagination">%s</nav>', $links);
    }
}
