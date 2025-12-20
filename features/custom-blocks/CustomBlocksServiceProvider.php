<?php

namespace Jankx\Features\CustomBlocks;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Facades\Config;

class CustomBlocksServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services if needed
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerBlocks']);
        add_action('add_meta_boxes', [$this, 'registerTimelineMetabox']);
        add_action('save_post', [$this, 'saveTimelineMetabox']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueTimelineAssets']);
    }

    public function registerBlocks()
    {
        register_block_type(__DIR__ . '/blocks/custom-price');
        register_block_type(__DIR__ . '/metabox-timeline');
    }

    protected function isTimelineEnabled(): bool
    {
        return (bool) Config::get('custom_blocks.timeline.enabled', false);
    }

    protected function getTimelinePostTypes(): array
    {
        $postTypes = Config::get('custom_blocks.timeline.post_types', []);
        return is_array($postTypes) ? $postTypes : [];
    }

    protected function isTimelineImageEnabled(): bool
    {
        return (bool) Config::get('custom_blocks.timeline.image_enabled', false);
    }

    public function registerTimelineMetabox()
    {
        if (!$this->isTimelineEnabled()) {
            return;
        }
        $postTypes = $this->getTimelinePostTypes();
        if (empty($postTypes)) {
            return;
        }
        foreach ($postTypes as $postType) {
            add_meta_box(
                'jankx_timeline',
                __('Timeline', 'jankx'),
                [$this, 'renderTimelineMetabox'],
                $postType,
                'normal',
                'high'
            );
        }
    }

    public function renderTimelineMetabox($post)
    {
        wp_nonce_field('jankx_timeline_save', 'jankx_timeline_nonce');
        $raw = get_post_meta($post->ID, 'jankx_timeline_items', true);
        $items = [];
        if (is_string($raw) && strlen($raw)) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $items = $decoded;
            }
        } elseif (is_array($raw)) {
            $items = $raw;
        }
        $imageEnabled = $this->isTimelineImageEnabled();
        echo '<div id="jankx-timeline-metabox" data-image-enabled="' . esc_attr($imageEnabled ? '1' : '0') . '">';
        echo '<div class="jankx-timeline-items">';
        if (!empty($items)) {
            foreach ($items as $index => $item) {
                $time = isset($item['time']) ? $item['time'] : '';
                $title = isset($item['title']) ? $item['title'] : '';
                $description = isset($item['description']) ? $item['description'] : '';
                $imageId = isset($item['image']) ? (int) $item['image'] : 0;
                echo '<div class="jankx-timeline-item" data-index="' . esc_attr($index) . '">';
                echo '<div class="field"><label>' . esc_html__('Time', 'jankx') . '</label><input type="text" name="jankx_timeline[' . esc_attr($index) . '][time]" value="' . esc_attr($time) . '"></div>';
                echo '<div class="field"><label>' . esc_html__('Title', 'jankx') . '</label><input type="text" name="jankx_timeline[' . esc_attr($index) . '][title]" value="' . esc_attr($title) . '"></div>';
                echo '<div class="field"><label>' . esc_html__('Description', 'jankx') . '</label><textarea name="jankx_timeline[' . esc_attr($index) . '][description]">' . esc_textarea($description) . '</textarea></div>';
                if ($imageEnabled) {
                    $imgUrl = $imageId ? wp_get_attachment_image_url($imageId, 'thumbnail') : '';
                    echo '<div class="field image-field"><label>' . esc_html__('Image', 'jankx') . '</label>';
                    echo '<div class="image-preview">' . ($imgUrl ? '<img src="' . esc_url($imgUrl) . '">' : '') . '</div>';
                    echo '<input type="hidden" class="image-id" name="jankx_timeline[' . esc_attr($index) . '][image]" value="' . esc_attr($imageId) . '">';
                    echo '<button type="button" class="button select-image">' . esc_html__('Select Image', 'jankx') . '</button>';
                    echo '<button type="button" class="button remove-image">' . esc_html__('Remove', 'jankx') . '</button>';
                    echo '</div>';
                }
                echo '<button type="button" class="button link-delete delete-item">' . esc_html__('Remove item', 'jankx') . '</button>';
                echo '</div>';
            }
        }
        echo '</div>';
        echo '<div class="jankx-timeline-actions">';
        echo '<button type="button" class="button button-primary add-item">' . esc_html__('Add item', 'jankx') . '</button>';
        echo '</div>';
        echo '</div>';
    }

    public function saveTimelineMetabox($post_id)
    {
        if (!isset($_POST['jankx_timeline_nonce']) || !wp_verify_nonce($_POST['jankx_timeline_nonce'], 'jankx_timeline_save')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        if (!isset($_POST['jankx_timeline'])) {
            delete_post_meta($post_id, 'jankx_timeline_items');
            return;
        }
        $items = $_POST['jankx_timeline'];
        $clean = [];
        if (is_array($items)) {
            foreach ($items as $item) {
                $time = isset($item['time']) ? sanitize_text_field($item['time']) : '';
                $title = isset($item['title']) ? sanitize_text_field($item['title']) : '';
                $description = isset($item['description']) ? sanitize_textarea_field($item['description']) : '';
                $image = isset($item['image']) ? intval($item['image']) : 0;
                if ($time && $title && $description) {
                    $data = [
                        'time' => $time,
                        'title' => $title,
                        'description' => $description,
                    ];
                    if ($this->isTimelineImageEnabled() && $image > 0) {
                        $data['image'] = $image;
                    }
                    $clean[] = $data;
                }
            }
        }
        update_post_meta($post_id, 'jankx_timeline_items', wp_json_encode($clean));
    }

    public function enqueueTimelineAssets()
    {
        if (!$this->isTimelineEnabled()) {
            return;
        }
        $screen = get_current_screen();
        $postTypes = $this->getTimelinePostTypes();
        if (!$screen || !in_array($screen->post_type, $postTypes, true)) {
            return;
        }
        if ($this->isTimelineImageEnabled()) {
            wp_enqueue_media();
        }
        wp_enqueue_style(
            'jankx-timeline-admin',
            get_template_directory_uri() . '/features/custom-blocks/metabox-timeline/assets/css/admin.css',
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'jankx-timeline-admin',
            get_template_directory_uri() . '/features/custom-blocks/metabox-timeline/assets/js/admin.js',
            ['jquery'],
            '1.0.0',
            true
        );
    }
}
