<?php
namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SmartBreadcrumbBlock extends Block {
    protected $blockId = 'jankx/smart-breadcrumb';

    public function render($attributes, $content, $block) {

        // Set default values
        $showHome = $attributes['showHome'] ?? true;
        $homeText = $attributes['homeText'] ?? __('Home', 'jankx');
        $separator = $attributes['separator'] ?? '›';
        $showCurrent = $attributes['showCurrent'] ?? true;
        $maxDepth = $attributes['maxDepth'] ?? 3;
        $stylePreset = $attributes['stylePreset'] ?? 'default';
        $useSeoPlugin = $attributes['useSeoPlugin'] ?? true;
        $fallbackToCustom = $attributes['fallbackToCustom'] ?? true;

        // Try to get breadcrumb from SEO plugins first
        $breadcrumb_html = '';

        if ($useSeoPlugin) {
            $breadcrumb_html = $this->getSeoPluginBreadcrumb();
        }

        // If no SEO plugin breadcrumb and fallback is enabled, generate custom breadcrumb
        if (empty($breadcrumb_html) && $fallbackToCustom) {
            $breadcrumb_html = $this->generateCustomBreadcrumb($attributes);
        }

        // If still no breadcrumb, return empty
        if (empty($breadcrumb_html)) {
            return '<p>' . __('No breadcrumb available', 'jankx') . '</p>';
        }

        // Generate CSS classes and inline styles using WordPress core styling
        $classes = ['wp-block-jankx-smart-breadcrumb'];
        $inline_styles = [];

        // Add style preset class
        if ($stylePreset && $stylePreset !== 'default') {
            $classes[] = 'breadcrumb-style-' . sanitize_html_class($stylePreset);
        }

        // WordPress core styling attributes (if function exists)
        if (function_exists('wp_style_engine_get_styles')) {
            $style_attributes = wp_style_engine_get_styles($attributes, [
                'selector' => '.wp-block-jankx-smart-breadcrumb',
                'context' => 'block-supports',
            ]);

            // Add core styling classes
            if (!empty($style_attributes['classnames'])) {
                $classes = array_merge($classes, explode(' ', $style_attributes['classnames']));
            }

            // Add core styling inline styles
            if (!empty($style_attributes['css'])) {
                $inline_styles[] = $style_attributes['css'];
            }
        }

        $class_attr = implode(' ', array_unique($classes));
        $style_attr = !empty($inline_styles) ? ' style="' . implode('; ', $inline_styles) . '"' : '';

        // Wrap breadcrumb with styling
        $final_html = '<nav class="' . esc_attr($class_attr) . '"' . $style_attr . ' role="navigation" aria-label="' . esc_attr__('Breadcrumb', 'jankx') . '">';
        $final_html .= $breadcrumb_html;
        $final_html .= '</nav>';

        return $final_html;
    }

    /**
     * Get breadcrumb from SEO plugins
     */
    private function getSeoPluginBreadcrumb() {
        // Try RankMath first
        if (class_exists('RankMath')) {
            return $this->getRankMathBreadcrumb();
        }

        // Try Yoast SEO
        if (class_exists('WPSEO_Breadcrumbs')) {
            return $this->getYoastBreadcrumb();
        }

        // Try SEOPress
        if (function_exists('seopress_display_breadcrumbs')) {
            return $this->getSeopressBreadcrumb();
        }

        // Try Breadcrumb NavXT
        if (function_exists('bcn_display')) {
            return $this->getBreadcrumbNavXTBreadcrumb();
        }

        // Try WooCommerce breadcrumbs
        if (class_exists('WooCommerce')) {
            return $this->getWooCommerceBreadcrumb();
        }

        return '';
    }

    /**
     * Get RankMath breadcrumb
     */
    private function getRankMathBreadcrumb() {
        if (!function_exists('rank_math_the_breadcrumbs')) {
            return '';
        }

        ob_start();
        rank_math_the_breadcrumbs();
        $breadcrumb = ob_get_clean();

        return $breadcrumb;
    }

    /**
     * Get Yoast SEO breadcrumb
     */
    private function getYoastBreadcrumb() {
        if (!function_exists('yoast_breadcrumb')) {
            return '';
        }

        return yoast_breadcrumb('', '', false);
    }

    /**
     * Get SEOPress breadcrumb
     */
    private function getSeopressBreadcrumb() {
        if (!function_exists('seopress_display_breadcrumbs')) {
            return '';
        }

        ob_start();
        seopress_display_breadcrumbs();
        $breadcrumb = ob_get_clean();

        return $breadcrumb;
    }

    /**
     * Get Breadcrumb NavXT breadcrumb
     */
    private function getBreadcrumbNavXTBreadcrumb() {
        if (!function_exists('bcn_display')) {
            return '';
        }

        ob_start();
        bcn_display();
        $breadcrumb = ob_get_clean();

        return $breadcrumb;
    }

    /**
     * Get WooCommerce breadcrumb
     */
    private function getWooCommerceBreadcrumb() {
        if (!function_exists('woocommerce_breadcrumb')) {
            return '';
        }

        ob_start();
        woocommerce_breadcrumb([
            'delimiter'   => ' › ',
            'wrap_before' => '<nav class="woocommerce-breadcrumb" aria-label="' . esc_attr__('Breadcrumb', 'jankx') . '">',
            'wrap_after'  => '</nav>',
            'before'      => '',
            'after'       => '',
            'home'        => _x('Home', 'breadcrumb', 'jankx'),
        ]);
        $breadcrumb = ob_get_clean();

        return $breadcrumb;
    }

    /**
     * Generate custom breadcrumb
     */
    private function generateCustomBreadcrumb($attributes) {
        $showHome = $attributes['showHome'] ?? true;
        $homeText = $attributes['homeText'] ?? __('Home', 'jankx');
        $separator = $attributes['separator'] ?? '›';
        $showCurrent = $attributes['showCurrent'] ?? true;
        $maxDepth = $attributes['maxDepth'] ?? 3;

        $breadcrumb_items = [];

        // Add home link
        if ($showHome) {
            $breadcrumb_items[] = '<a href="' . esc_url(home_url('/')) . '" class="home-item">' . $this->renderHomeItem($attributes) . '</a>';
        }

        // Get current page info
        $queried_object = get_queried_object();
        $current_page = get_post();

        // Check if we're in editor/REST context without real post data
        $is_editor_preview = (defined('REST_REQUEST') && REST_REQUEST) ||
                             (!$current_page && !$queried_object) ||
                             (is_admin() && !wp_doing_ajax());

        // If in editor preview, show sample breadcrumb items
        if ($is_editor_preview) {
            // Add sample category
            $breadcrumb_items[] = '<a href="#">' . __('Sample Category', 'jankx') . '</a>';

            // Add sample post title if showCurrent is enabled
            if ($showCurrent) {
                $breadcrumb_items[] = '<span class="current">' . __('Sample Post Title', 'jankx') . '</span>';
            }
        }
        // Handle different page types
        elseif (is_home() || is_front_page()) {
            // Home page - no additional items needed
        } elseif (is_category() || is_tag() || is_tax()) {
            // Category, tag, or custom taxonomy
            $breadcrumb_items = array_merge($breadcrumb_items, $this->getTaxonomyBreadcrumb($queried_object, $maxDepth));
        } elseif (is_single()) {
            // Single post
            $breadcrumb_items = array_merge($breadcrumb_items, $this->getPostBreadcrumb($current_page, $maxDepth));
        } elseif (is_page()) {
            // Single page
            $breadcrumb_items = array_merge($breadcrumb_items, $this->getPageBreadcrumb($current_page, $maxDepth));
        } elseif (is_archive()) {
            // Archive page
            $breadcrumb_items = array_merge($breadcrumb_items, $this->getArchiveBreadcrumb($queried_object, $maxDepth));
        } elseif (is_search()) {
            // Search results
            $breadcrumb_items[] = '<span>' . sprintf(__('Search Results for: "%s"', 'jankx'), get_search_query()) . '</span>';
        } elseif (is_404()) {
            // 404 page
            $breadcrumb_items[] = '<span>' . __('Page not found', 'jankx') . '</span>';
        }

        // Add current page if not already added and showCurrent is true (but not in editor preview)
        if (!$is_editor_preview && $showCurrent && !empty($breadcrumb_items)) {
            $current_title = $this->getCurrentPageTitle();
            if ($current_title) {
                $breadcrumb_items[] = '<span class="current">' . esc_html($current_title) . '</span>';
            }
        }

        // Join items with separator
        $separator_html = '<span class="separator" aria-hidden="true">' . esc_html($separator) . '</span>';
        return implode($separator_html, $breadcrumb_items);
    }

    /**
     * Get taxonomy breadcrumb
     */
    private function getTaxonomyBreadcrumb($term, $maxDepth) {
        $items = [];

        if ($term->parent && $maxDepth > 1) {
            $parent_terms = get_ancestors($term->term_id, $term->taxonomy);
            $parent_terms = array_reverse($parent_terms);

            foreach ($parent_terms as $parent_id) {
                $parent_term = get_term($parent_id, $term->taxonomy);
                if ($parent_term && !is_wp_error($parent_term)) {
                    $items[] = '<a href="' . esc_url(get_term_link($parent_term)) . '">' . esc_html($parent_term->name) . '</a>';
                }
            }
        }

        return $items;
    }

    /**
     * Get post breadcrumb
     */
    private function getPostBreadcrumb($post, $maxDepth) {
        $items = [];

        // Add Post Type Archive link for Custom Post Types
        $post_type = get_post_type($post);
        if ($post_type !== 'post' && $post_type !== 'page') {
            $post_type_obj = get_post_type_object($post_type);
            if ($post_type_obj && $post_type_obj->has_archive) {
                $archive_link = get_post_type_archive_link($post_type);
                if ($archive_link) {
                    $items[] = '<a href="' . esc_url($archive_link) . '">' . esc_html($post_type_obj->labels->name) . '</a>';
                }
            }
        }

        // Add category breadcrumb (primarily for standard posts)
        $categories = get_the_category($post->ID);
        if (!empty($categories)) {
            $category = $categories[0];
            if ($category->parent && $maxDepth > 1) {
                $parent_categories = get_ancestors($category->term_id, 'category');
                $parent_categories = array_reverse($parent_categories);

                foreach ($parent_categories as $parent_id) {
                    $parent_category = get_category($parent_id);
                    if ($parent_category && !is_wp_error($parent_category)) {
                        $items[] = '<a href="' . esc_url(get_category_link($parent_category)) . '">' . esc_html($parent_category->name) . '</a>';
                    }
                }
            }
            $items[] = '<a href="' . esc_url(get_category_link($category)) . '">' . esc_html($category->name) . '</a>';
        }

        return $items;
    }

    /**
     * Get page breadcrumb
     */
    private function getPageBreadcrumb($post, $maxDepth) {
        $items = [];

        if ($post->post_parent && $maxDepth > 1) {
            $ancestors = get_post_ancestors($post->ID);
            $ancestors = array_reverse($ancestors);

            foreach ($ancestors as $ancestor_id) {
                $ancestor = get_post($ancestor_id);
                if ($ancestor) {
                    $items[] = '<a href="' . esc_url(get_permalink($ancestor)) . '">' . esc_html($ancestor->post_title) . '</a>';
                }
            }
        }

        return $items;
    }

    /**
     * Get archive breadcrumb
     */
    private function getArchiveBreadcrumb($queried_object, $maxDepth) {
        $items = [];

        if (is_author()) {
            $items[] = '<span>' . sprintf(__('Author: %s', 'jankx'), $queried_object->display_name) . '</span>';
        } elseif (is_date()) {
            if (is_year()) {
                $items[] = '<span>' . get_the_date('Y') . '</span>';
            } elseif (is_month()) {
                $items[] = '<a href="' . esc_url(get_year_link(get_the_date('Y'))) . '">' . get_the_date('Y') . '</a>';
                $items[] = '<span>' . get_the_date('F') . '</span>';
            } elseif (is_day()) {
                $items[] = '<a href="' . esc_url(get_year_link(get_the_date('Y'))) . '">' . get_the_date('Y') . '</a>';
                $items[] = '<a href="' . esc_url(get_month_link(get_the_date('Y'), get_the_date('m'))) . '">' . get_the_date('F') . '</a>';
                $items[] = '<span>' . get_the_date('j') . '</span>';
            }
        }

        return $items;
    }

    /**
     * Get current page title
     */
    private function getCurrentPageTitle() {
        if (is_home() || is_front_page()) {
            return get_bloginfo('name');
        } elseif (is_category() || is_tag() || is_tax()) {
            return single_term_title('', false);
        } elseif (is_single() || is_page()) {
            return get_the_title();
        } elseif (is_author()) {
            return get_the_author();
        } elseif (is_date()) {
            if (is_year()) {
                return get_the_date('Y');
            } elseif (is_month()) {
                return get_the_date('F Y');
            } elseif (is_day()) {
                return get_the_date();
            }
        } elseif (is_search()) {
            return sprintf(__('Search Results for: "%s"', 'jankx'), get_search_query());
        } elseif (is_404()) {
            return __('Page not found', 'jankx');
        }

        return '';
    }

    /**
     * Render Home item content based on type
     */
    private function renderHomeItem($attributes) {
        $type = $attributes['homeItemType'] ?? 'text';
        $text = $attributes['homeItemText'] ?? __('Home', 'jankx');
        $showText = $attributes['showHomeText'] ?? true;
        
        // Handle legacy homeText attribute if it exists and homeItemText is default
        if (isset($attributes['homeText']) && $text === __('Trang chủ', 'jankx')) {
            $text = $attributes['homeText'];
        }

        $content = '';
        switch ($type) {
            case 'css':
                $icon_class = $attributes['homeItemIcon'] ?? 'fa fa-home';
                $content = sprintf('<i class="%s" aria-hidden="true"></i>', esc_attr($icon_class));
                break;
            case 'svg':
                $content = $attributes['homeItemSvg'] ?? '';
                // Basic SVG validation/cleaning could be added here if needed
                break;
            case 'image':
                $image = $attributes['homeItemImage'] ?? null;
                if ($image && !empty($image['url'])) {
                    $content = sprintf(
                        '<img src="%s" alt="%s" class="home-icon" />',
                        esc_url($image['url']),
                        esc_attr($text)
                    );
                }
                break;
            case 'text':
            default:
                return esc_html($text);
        }

        if ($showText) {
            $content .= sprintf('<span class="home-text">%s</span>', esc_html($text));
        }

        return $content;
    }
}
