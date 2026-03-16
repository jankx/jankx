<?php
namespace Jankx\Extensions;

use Jankx\Extensions\AbstractExtension;
use Jankx\Facades\Config;

class PerUnitExtension extends AbstractExtension
{
    public function init(): void
    {
    }

    public function register_hooks(): void
    {
        add_action('init', [$this, 'registerBlock']);
        add_action('add_meta_boxes', [$this, 'registerPerUnitMetabox']);
        add_action('save_post', [$this, 'savePerUnitMetabox']);
    }

    public function registerBlock()
    {
        register_block_type($this->get_extension_path() . '/block');
    }

    protected function isPerUnitEnabled(): bool
    {
        $enabled = Config::get('per_unit.enabled', null);
        if ($enabled === null) {
            $enabled = Config::get('app.per_unit.enabled', true);
        }
        return (bool) $enabled;
    }

    protected function getPerUnitPostTypes(): array
    {
        $postTypes = Config::get('per_unit.post_types', null);
        if ($postTypes === null) {
            $postTypes = Config::get('app.per_unit.post_types', ['product']);
        }
        return is_array($postTypes) ? $postTypes : [];
    }

    protected function getPerUnitMetaKey(): string
    {
        $metaKey = Config::get('per_unit.meta_key', null);
        if ($metaKey === null) {
            $metaKey = Config::get('app.per_unit.meta_key', '_unit');
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
}
