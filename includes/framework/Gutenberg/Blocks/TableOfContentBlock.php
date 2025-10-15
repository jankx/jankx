<?php
namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Table of Contents Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TableOfContentBlock extends Block
{
    protected $blockId = 'jankx/table-of-content';

    public function __construct()
    {
        parent::__construct();

        // Add anchor IDs to headings
        add_filter('the_content', [$this, 'addHeadingAnchors'], 20);
    }

    public function render($attributes, $content = '', $block = null)
    {
        // Get block attributes with defaults
        $title = $attributes['title'] ?? __('Table of Contents', 'jankx');
        $show_title = $attributes['showTitle'] ?? true;
        $title_level = $attributes['titleLevel'] ?? 2;
        $min_level = $attributes['minLevel'] ?? 1;
        $max_level = $attributes['maxLevel'] ?? 6;
        $marker_style = $attributes['markerStyle'] ?? 'list';
        $use_numbers = $attributes['useNumbers'] ?? false;
        $remove_indent = $attributes['removeIndent'] ?? false;
        $smooth_scroll = $attributes['smoothScroll'] ?? false;
        $absolute_urls = $attributes['absoluteUrls'] ?? false;

        // Check if we're in template editor context
        $is_template_editor = (
            is_admin() &&
            (isset($_GET['post_type']) && in_array($_GET['post_type'], ['wp_template', 'wp_template_part'])) ||
            (isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], 'site-editor.php') !== false)
        );

        // Get current post content
        $post_id = get_the_ID();
        $post_content = '';

        if ($post_id) {
            $post_content = get_post_field('post_content', $post_id);
        }

        // If in template editor or no content, use sample headings
        if ($is_template_editor || empty($post_content)) {
            $headings = $this->generateSampleHeadings($min_level, $max_level);
        } else {
            $headings = $this->extractHeadingsFromContent($post_content, $min_level, $max_level);
        }

        // If no headings found, return empty
        if (empty($headings)) {
            return '<p>' . __('No headings found in this post', 'jankx') . '</p>';
        }

        // Build CSS classes
        $classes = ['wp-block-jankx-table-of-content'];
        if ($marker_style !== 'list') {
            $classes[] = 'marker-' . sanitize_html_class($marker_style);
        }
        if ($use_numbers) {
            $classes[] = 'use-numbers';
        }
        if ($remove_indent) {
            $classes[] = 'no-indent';
        }

        // Get WordPress block wrapper attributes
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $classes)
        ]);

        // Start output
        ob_start();
        ?>
        <div <?php echo $wrapper_attributes; ?>>
            <?php if ($smooth_scroll): ?>
                <style>html { scroll-behavior: smooth; }</style>
            <?php endif; ?>

            <?php if ($show_title): ?>
                <h<?php echo $title_level; ?> class="toc-title"><?php echo esc_html($title); ?></h<?php echo $title_level; ?>>
            <?php endif; ?>

            <?php
            // Determine list type
            $list_tag = ($use_numbers || $marker_style === 'numbers') ? 'ol' : 'ul';
            $list_class = 'toc-list';
            if ($remove_indent) {
                $list_class .= ' no-indent';
            }
            ?>

            <<?php echo $list_tag; ?> class="<?php echo esc_attr($list_class); ?>">
                <?php
                $current_level = $min_level;
                foreach ($headings as $heading) {
                    $level = $heading['level'];
                    $text = $heading['text'];
                    $id = $heading['id'];

                    // Generate URL
                    if ($absolute_urls) {
                        $url = get_permalink() . '#' . $id;
                    } else {
                        $url = '#' . $id;
                    }

                    // Add list items for missing levels
                    while ($current_level < $level) {
                        echo '<li><' . $list_tag . '>';
                        $current_level++;
                    }

                    // Close list items for higher levels
                    while ($current_level > $level) {
                        echo '</' . $list_tag . '></li>';
                        $current_level--;
                    }

                    // Add current heading
                    echo '<li><a href="' . esc_url($url) . '">' . esc_html($text) . '</a></li>';
                }

                // Close remaining list items
                while ($current_level > $min_level) {
                    echo '</' . $list_tag . '></li>';
                    $current_level--;
                }
                ?>
            </<?php echo $list_tag; ?>>
        </div>
        <?php
        return ob_get_clean();
    }

    private function extractHeadingsFromContent($post_content, $min_level, $max_level)
    {
        $headings = [];
        $pattern = '/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/i';
        preg_match_all($pattern, $post_content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $level = intval($match[1]);
            $text = strip_tags($match[2]);

            // Check if heading level is within range
            if ($level >= $min_level && $level <= $max_level) {
                $id = sanitize_title($text);
                $headings[] = [
                    'level' => $level,
                    'text' => $text,
                    'id' => $id
                ];
            }
        }

        return $headings;
    }

    private function generateSampleHeadings($min_level, $max_level)
    {
        $sample_headings = [
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
        return array_filter($sample_headings, function($heading) use ($min_level, $max_level) {
            return $heading['level'] >= $min_level && $heading['level'] <= $max_level;
        });
    }

    public function addHeadingAnchors($content)
    {
        // Only add anchors if TOC block is present
        if (!has_block('jankx/table-of-content', $content)) {
            return $content;
        }

        // Add anchor IDs to headings
        $content = preg_replace_callback(
            '/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/i',
            [$this, 'addAnchorToHeading'],
            $content
        );

        return $content;
    }

    private function addAnchorToHeading($matches)
    {
        $level = $matches[1];
        $attributes = $matches[2];
        $text = $matches[3];

        // Extract text content (remove HTML tags)
        $text_content = strip_tags($text);

        // Generate anchor ID
        $anchor_id = sanitize_title($text_content);

        // Check if ID already exists in attributes
        if (strpos($attributes, 'id=') === false) {
            $attributes .= ' id="' . esc_attr($anchor_id) . '"';
        }

        return '<h' . $level . $attributes . '>' . $text . '</h' . $level . '>';
    }
}
