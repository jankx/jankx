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
        add_action('add_meta_boxes', [$this, 'registerPerUnitMetabox']);
        add_action('save_post', [$this, 'savePerUnitMetabox']);
    }

    public function registerBlocks()
    {
        register_block_type(__DIR__ . '/blocks/custom-price');
        register_block_type(__DIR__ . '/blocks/per-unit');
        register_block_type(__DIR__ . '/blocks/metabox-timeline');
    }

    protected function isTimelineEnabled(): bool
    {
        $enabled = Config::get('custom_blocks.timeline.enabled', null);
        if ($enabled === null) {
            $enabled = Config::get('app.custom_blocks.timeline.enabled', false);
        }
        return (bool) $enabled;
    }

    protected function getTimelinePostTypes(): array
    {
        $postTypes = Config::get('custom_blocks.timeline.post_types', null);
        if ($postTypes === null) {
            $postTypes = Config::get('app.custom_blocks.timeline.post_types', []);
        }
        return is_array($postTypes) ? $postTypes : [];
    }

    protected function isTimelineImageEnabled(): bool
    {
        $imageEnabled = Config::get('custom_blocks.timeline.image_enabled', null);
        if ($imageEnabled === null) {
            $imageEnabled = Config::get('app.custom_blocks.timeline.image_enabled', false);
        }
        return (bool) $imageEnabled;
    }

    protected function isPerUnitEnabled(): bool
    {
        $enabled = Config::get('custom_blocks.per_unit.enabled', null);
        if ($enabled === null) {
            $enabled = Config::get('app.custom_blocks.per_unit.enabled', false);
        }
        return (bool) $enabled;
    }

    protected function getPerUnitPostTypes(): array
    {
        $postTypes = Config::get('custom_blocks.per_unit.post_types', null);
        if ($postTypes === null) {
            $postTypes = Config::get('app.custom_blocks.per_unit.post_types', []);
        }
        return is_array($postTypes) ? $postTypes : [];
    }

    protected function getPerUnitMetaKey(): string
    {
        $metaKey = Config::get('custom_blocks.per_unit.meta_key', null);
        if ($metaKey === null) {
            $metaKey = Config::get('app.custom_blocks.per_unit.meta_key', '_unit');
        }
        return is_string($metaKey) ? $metaKey : '_unit';
    }

    public function registerPerUnitMetabox()
    {
        if (!$this->isPerUnitEnabled()) {
            return;
        }
        $postTypes = $this->getPerUnitPostTypes();
        if (empty($postTypes)) {
            return;
        }
        foreach ($postTypes as $postType) {
            add_meta_box(
                'jankx_per_unit',
                __('Per Unit', 'jankx'),
                [$this, 'renderPerUnitMetabox'],
                $postType,
                'side',
                'default'
            );
        }
    }

    public function renderPerUnitMetabox($post)
    {
        wp_nonce_field('jankx_per_unit_save', 'jankx_per_unit_nonce');
        $metaKey = $this->getPerUnitMetaKey();
        $value = get_post_meta($post->ID, $metaKey, true);
        echo '<div class="jankx-per-unit-metabox">';
        echo '<label for="jankx_per_unit_value">' . esc_html__('Unit (ví dụ: kg, gói, lít)', 'jankx') . '</label>';
        echo '<input type="text" id="jankx_per_unit_value" name="jankx_per_unit_value" value="' . esc_attr(is_string($value) ? $value : '') . '" class="widefat">';
        echo '</div>';
    }

    public function savePerUnitMetabox($post_id)
    {
        if (!isset($_POST['jankx_per_unit_nonce']) || !wp_verify_nonce($_POST['jankx_per_unit_nonce'], 'jankx_per_unit_save')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        $metaKey = $this->getPerUnitMetaKey();
        if (isset($_POST['jankx_per_unit_value'])) {
            $value = sanitize_text_field($_POST['jankx_per_unit_value']);
            if ($value === '') {
                delete_post_meta($post_id, $metaKey);
            } else {
                update_post_meta($post_id, $metaKey, $value);
            }
        }
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
        $items = get_post_meta($post->ID, 'jankx_timeline_items', true);
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
                echo '<div class="field"><label>' . esc_html__('Time*', 'jankx') . '</label><input type="text" name="jankx_timeline[' . esc_attr($index) . '][time]" value="' . esc_attr($time) . '" placeholder="' . esc_attr__('Ví dụ: 08:00', 'jankx') . '" required></div>';
                echo '<div class="field"><label>' . esc_html__('Title*', 'jankx') . '</label><input type="text" name="jankx_timeline[' . esc_attr($index) . '][title]" value="' . esc_attr($title) . '" placeholder="' . esc_attr__('Ví dụ: Đến thác nước', 'jankx') . '" required></div>';
                echo '<div class="field"><label>' . esc_html__('Description', 'jankx') . '</label><textarea name="jankx_timeline[' . esc_attr($index) . '][description]" placeholder="' . esc_attr__('Mô tả (không bắt buộc)', 'jankx') . '">' . esc_textarea($description) . '</textarea></div>';
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
                // Save item if at least one meaningful field is provided
                if ($time || $title || $description || ($this->isTimelineImageEnabled() && $image > 0)) {
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
        update_post_meta($post_id, 'jankx_timeline_items', $clean);
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
            get_template_directory_uri() . '/features/custom-blocks/blocks/metabox-timeline/assets/admin/css/admin.css',
            [],
            '1.0.0'
        );
        wp_enqueue_script(
            'jankx-timeline-admin',
            get_template_directory_uri() . '/features/custom-blocks/blocks/metabox-timeline/assets/admin/js/admin.js',
            ['jquery'],
            '1.0.0',
            true
        );
    }

    public function getPostTypeBadgeLabels($labels)
    {
        $custom = [
            'product' => 'Sản phẩm',
        ];
        if (is_array($labels)) {
            return array_merge($labels, $custom);
        }
        return $custom;
    }
}
