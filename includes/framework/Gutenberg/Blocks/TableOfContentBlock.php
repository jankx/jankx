<?php
namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TableOfContentBlock extends Block {
    protected $blockId = 'jankx/table-of-content';

    public function init() {
        // Register REST endpoint for server-side rendering
        add_action('rest_api_init', [$this, 'registerRestEndpoint']);

        // Enqueue block assets if needed
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function registerRestEndpoint() {
        register_rest_route('wp/v2', '/block-renderer/' . $this->blockId, [
            'methods' => 'GET',
            'callback' => [$this, 'renderBlock'],
            'permission_callback' => '__return_true',
            'args' => [
                'context' => [
                    'default' => 'view',
                    'type' => 'string',
                ],
                'attributes' => [
                    'default' => [],
                    'type' => 'object',
                ],
            ],
        ]);
    }

    public function renderBlock($request) {
        $attributes = $request->get_param('attributes');
        $context = $request->get_param('context');

        // Set default values
        $no_title = $attributes['no_title'] ?? false;
        $title_level = $attributes['title_level'] ?? 2;
        $title_text = $attributes['title_text'] ?? __('Table of Contents', 'jankx');
        $use_ol = $attributes['use_ol'] ?? false;
        $remove_indent = $attributes['remove_indent'] ?? false;
        $add_smooth = $attributes['add_smooth'] ?? false;
        $use_absolute_urls = $attributes['use_absolute_urls'] ?? false;
        $max_level = $attributes['max_level'] ?? 6;
        $min_level = $attributes['min_level'] ?? 1;
        $hidden = $attributes['hidden'] ?? false;
        $accordion = $attributes['accordion'] ?? false;
        $wrapper = $attributes['wrapper'] ?? false;

        // Check if we're in template editor context via AJAX
        $is_template_editor = $context === 'edit' && (
            (isset($_SERVER['HTTP_REFERER']) && (
                strpos($_SERVER['HTTP_REFERER'], 'post_type=wp_template') !== false ||
                strpos($_SERVER['HTTP_REFERER'], 'post_type=wp_template_part') !== false ||
                strpos($_SERVER['HTTP_REFERER'], 'page=gutenberg-edit-site') !== false ||
                strpos($_SERVER['HTTP_REFERER'], '/wp-admin/site-editor.php') !== false ||
                strpos($_SERVER['HTTP_REFERER'], '/wp-admin/themes.php') !== false
            ))
        );

        // If in template editor, return fake data for preview
        if ($is_template_editor) {
            return new \WP_REST_Response([
                'rendered' => $this->generateFakeTOC($attributes)
            ], 200);
        }

        // Get post content
        $post_id = get_the_ID();
        if (!$post_id) {
            return new \WP_REST_Response([
                'rendered' => '<p>' . __('No post content available', 'jankx') . '</p>'
            ], 200);
        }

        $post_content = get_post_field('post_content', $post_id);
        if (empty($post_content)) {
            return new \WP_REST_Response([
                'rendered' => '<p>' . __('No headings found in this post', 'jankx') . '</p>'
            ], 200);
        }

        // Extract headings from content
        $headings = array();
        $pattern = '/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/i';
        preg_match_all($pattern, $post_content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $level = intval($match[1]);
            $text = strip_tags($match[2]);

            // Check if heading level is within range
            if ($level >= $min_level && $level <= $max_level) {
                $id = sanitize_title($text);
                $headings[] = array(
                    'level' => $level,
                    'text' => $text,
                    'id' => $id
                );
            }
        }

        // If no headings found, return empty
        if (empty($headings)) {
            return new \WP_REST_Response([
                'rendered' => '<p>' . __('No headings found in this post', 'jankx') . '</p>'
            ], 200);
        }

        // Generate TOC HTML
        $toc_html = '';

        // Add smooth scrolling CSS if enabled
        if ($add_smooth) {
            $toc_html .= '<style>html { scroll-behavior: smooth; }</style>';
        }

        // Start wrapper if enabled
        if ($wrapper) {
            $toc_html .= '<nav role="navigation" aria-label="' . esc_attr__('Table of Contents', 'jankx') . '">';
        }

        // Add title if not disabled
        if (!$no_title) {
            $toc_html .= sprintf('<h%d class="toc-title">%s</h%d>', $title_level, esc_html($title_text), $title_level);
        }

        // Determine list type
        $list_tag = $use_ol ? 'ol' : 'ul';
        $toc_html .= '<' . $list_tag . ' class="toc-list' . ($remove_indent ? ' no-indent' : '') . '">';

        $current_level = $min_level;
        foreach ($headings as $heading) {
            $level = $heading['level'];
            $text = $heading['text'];
            $id = $heading['id'];

            // Generate URL
            if ($use_absolute_urls) {
                $url = get_permalink() . '#' . $id;
            } else {
                $url = '#' . $id;
            }

            // Add list items for missing levels
            while ($current_level < $level) {
                $toc_html .= '<li><' . $list_tag . '>';
                $current_level++;
            }

            // Close list items for higher levels
            while ($current_level > $level) {
                $toc_html .= '</' . $list_tag . '></li>';
                $current_level--;
            }

            // Add current heading
            $toc_html .= '<li><a href="' . esc_url($url) . '">' . esc_html($text) . '</a></li>';
        }

        // Close remaining list items
        while ($current_level > $min_level) {
            $toc_html .= '</' . $list_tag . '></li>';
            $current_level--;
        }

        $toc_html .= '</' . $list_tag . '>';

        // Close wrapper if enabled
        if ($wrapper) {
            $toc_html .= '</nav>';
        }

        // Handle hidden/accordion functionality
        if ($hidden || $accordion) {
            $toc_class = 'toc-hidden';
            if ($accordion) {
                $toc_class .= ' toc-accordion';
            }

            $toc_html = '<div class="' . $toc_class . '">' . $toc_html . '</div>';
        }

        return new \WP_REST_Response([
            'rendered' => $toc_html
        ], 200);
    }

    private function generateFakeTOC($attributes) {
        // Set default values
        $no_title = $attributes['no_title'] ?? false;
        $title_level = $attributes['title_level'] ?? 2;
        $title_text = $attributes['title_text'] ?? __('Table of Contents', 'jankx');
        $use_ol = $attributes['use_ol'] ?? false;
        $remove_indent = $attributes['remove_indent'] ?? false;
        $add_smooth = $attributes['add_smooth'] ?? false;
        $use_absolute_urls = $attributes['use_absolute_urls'] ?? false;
        $max_level = $attributes['max_level'] ?? 6;
        $min_level = $attributes['min_level'] ?? 1;
        $hidden = $attributes['hidden'] ?? false;
        $accordion = $attributes['accordion'] ?? false;
        $wrapper = $attributes['wrapper'] ?? false;

        // Generate fake headings for preview
        $fake_headings = [
            ['level' => 1, 'text' => 'Giới thiệu', 'id' => 'gioi-thieu'],
            ['level' => 2, 'text' => 'Tính năng chính', 'id' => 'tinh-nang-chinh'],
            ['level' => 3, 'text' => 'Giao diện thân thiện', 'id' => 'giao-dien-than-thien'],
            ['level' => 3, 'text' => 'Hiệu suất cao', 'id' => 'hieu-suat-cao'],
            ['level' => 2, 'text' => 'Cài đặt', 'id' => 'cai-dat'],
            ['level' => 3, 'text' => 'Yêu cầu hệ thống', 'id' => 'yeu-cau-he-thong'],
            ['level' => 3, 'text' => 'Hướng dẫn cài đặt', 'id' => 'huong-dan-cai-dat'],
            ['level' => 2, 'text' => 'Sử dụng', 'id' => 'su-dung'],
            ['level' => 3, 'text' => 'Cấu hình cơ bản', 'id' => 'cau-hinh-co-ban'],
            ['level' => 3, 'text' => 'Tùy chỉnh nâng cao', 'id' => 'tuy-chinh-nang-cao'],
            ['level' => 1, 'text' => 'Kết luận', 'id' => 'ket-luan']
        ];

        // Filter headings based on min/max level
        $filtered_headings = array_filter($fake_headings, function($heading) use ($min_level, $max_level) {
            return $heading['level'] >= $min_level && $heading['level'] <= $max_level;
        });

        // Generate TOC HTML
        $toc_html = '';

        // Add smooth scrolling CSS if enabled
        if ($add_smooth) {
            $toc_html .= '<style>html { scroll-behavior: smooth; }</style>';
        }

        // Start wrapper if enabled
        if ($wrapper) {
            $toc_html .= '<nav role="navigation" aria-label="' . esc_attr__('Table of Contents', 'jankx') . '">';
        }

        // Add title if not disabled
        if (!$no_title) {
            $toc_html .= sprintf('<h%d class="toc-title">%s</h%d>', $title_level, esc_html($title_text), $title_level);
        }

        // Determine list type
        $list_tag = $use_ol ? 'ol' : 'ul';
        $toc_html .= '<' . $list_tag . ' class="toc-list' . ($remove_indent ? ' no-indent' : '') . '">';

        $current_level = $min_level;
        foreach ($filtered_headings as $heading) {
            $level = $heading['level'];
            $text = $heading['text'];
            $id = $heading['id'];

            // Generate URL
            if ($use_absolute_urls) {
                $url = '#' . $id;
            } else {
                $url = '#' . $id;
            }

            // Add list items for missing levels
            while ($current_level < $level) {
                $toc_html .= '<li><' . $list_tag . '>';
                $current_level++;
            }

            // Close list items for higher levels
            while ($current_level > $level) {
                $toc_html .= '</' . $list_tag . '></li>';
                $current_level--;
            }

            // Add current heading
            $toc_html .= '<li><a href="' . esc_url($url) . '">' . esc_html($text) . '</a></li>';
        }

        // Close remaining list items
        while ($current_level > $min_level) {
            $toc_html .= '</' . $list_tag . '></li>';
            $current_level--;
        }

        $toc_html .= '</' . $list_tag . '>';

        // Close wrapper if enabled
        if ($wrapper) {
            $toc_html .= '</nav>';
        }

        // Handle hidden/accordion functionality
        if ($hidden || $accordion) {
            $toc_class = 'toc-hidden';
            if ($accordion) {
                $toc_class .= ' toc-accordion';
            }

            $toc_html = '<div class="' . $toc_class . '">' . $toc_html . '</div>';
        }

        // Add preview notice
        $toc_html .= '<div style="margin-top: 10px; padding: 8px; background: #f0f0f0; border-left: 3px solid #0073aa; font-size: 12px; color: #666;">';
        $toc_html .= '<strong>' . __('Preview:', 'jankx') . '</strong> ' . __('This is a preview of the Table of Contents. The actual content will be generated from the post headings.', 'jankx');
        $toc_html .= '</div>';

        return $toc_html;
    }

    public function enqueueAssets() {
        // Enqueue frontend styles if needed
        if (is_singular() && has_block('jankx/table-of-content')) {
            wp_enqueue_style(
                'jankx-toc-style',
                get_template_directory_uri() . '/resources/blocks/table-of-content/build/style.css',
                array(),
                '1.0.0'
            );
        }
    }
}
