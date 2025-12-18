<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use WP_Query;
use Jankx\Layouts\DynamicDataLayout\ContentLoopLayoutManager;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\AttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\PostLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Generators\SsrViewGenerator;
use Jankx\Foundation\Application;
use Jankx\Services\DefaultThumbnailService;

class DynamicSsrTemplateBlock extends Block
{
    protected $blockId = 'jankx/dynamic-ssr-template';

    public function init()
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        add_action('wp_ajax_jankx_dynamic_ssr_template_preview', [$this, 'ajaxPreview']);
        add_action('wp_ajax_nopriv_jankx_dynamic_ssr_template_preview', [$this, 'ajaxPreview']);
    }

    protected function getContentLoopLayoutManager(): ContentLoopLayoutManager
    {
        return ContentLoopLayoutManager::getInstance();
    }

    public function enqueueEditorAssets()
    {
        $block_name = str_replace('jankx/', '', $this->blockId);
        $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor-script';
        if (!wp_script_is($script_handle, 'registered')) {
            $script_handle = 'jankx-' . str_replace('/', '-', $block_name) . '-editor';
        }
        $registered_block = \WP_Block_Type_Registry::get_instance()->get_registered($this->blockId);
        if ($registered_block && !empty($registered_block->editor_script)) {
            $script_handle = $registered_block->editor_script;
        }

        $layoutManager = $this->getContentLoopLayoutManager();

        $post_types = get_post_types(['public' => true], 'objects');
        $layouts_by_post_type = [];
        foreach ($post_types as $post_type => $post_type_obj) {
            $layouts_by_post_type[$post_type] = $layoutManager->getLayoutsForPostType($post_type);
        }

        $content_loop_data = [
            'layoutsByPostType' => $layouts_by_post_type,
            'commonLayouts' => $layoutManager->getCommonLayouts(),
        ];

        $ssr_config = [
            'nonce' => wp_create_nonce('jankx_dynamic_ssr_template_preview'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
        ];

        if (wp_script_is($script_handle, 'registered') || wp_script_is($script_handle, 'enqueued')) {
            wp_localize_script(
                $script_handle,
                'jankxDynamicDataContentLoopLayouts',
                $content_loop_data
            );
            wp_localize_script(
                $script_handle,
                'jankxDynamicSsrTemplate',
                $ssr_config
            );
        } else {
            wp_add_inline_script('wp-block-editor', 'window.jankxDynamicDataContentLoopLayouts = ' . wp_json_encode($content_loop_data) . ';', 'before');
            wp_add_inline_script('wp-block-editor', 'window.jankxDynamicSsrTemplate = ' . wp_json_encode($ssr_config) . ';', 'before');
        }
    }

    public function render($attributes, $content = '', $block = null)
    {
        if ($block instanceof \WP_Block) {
            $context = $block->context['jankxPostTypeLayout'] ?? null;
            if (is_array($context)) {
                $query = $context['query'] ?? null;
                if ($query instanceof WP_Query) {
                    return '';
                }
            }
        }
        return $content;
    }

    public function ajaxPreview()
    {
        check_ajax_referer('jankx_dynamic_ssr_template_preview', 'nonce');
        $this->bootDefaultThumbnailService();

        $rawAttributes = $_POST['attributes'] ?? '';
        $rawParentAttributes = $_POST['parent_attributes'] ?? '';

        $attributes = [];
        $parentAttributes = [];

        if (is_string($rawAttributes) && $rawAttributes !== '') {
            $decoded = json_decode(stripslashes($rawAttributes), true);
            if (is_array($decoded)) {
                $attributes = $decoded;
            }
        }
        if (is_string($rawParentAttributes) && $rawParentAttributes !== '') {
            $decodedParent = json_decode(stripslashes($rawParentAttributes), true);
            if (is_array($decodedParent)) {
                $parentAttributes = $decodedParent;
            }
        }

        $layoutName = $parentAttributes['layout'] ?? 'grid';
        $postType = $parentAttributes['postType'] ?? 'post';
        $postsPerPage = isset($parentAttributes['postsPerPage']) ? (int) $parentAttributes['postsPerPage'] : 6;

        $baseAttributes = array_merge(
            [
                'layout' => $layoutName,
                'postType' => $postType,
                'postsPerPage' => $postsPerPage,
            ],
            $parentAttributes
        );

        $templateBlock = [
            'blockName' => 'jankx/dynamic-ssr-template',
            'attrs' => $attributes,
        ];

        try {
            $layoutManager = DynamicDataLayoutManager::getInstance();
            $sanitizer = new AttributeSanitizer($layoutManager);
            $sanitized = $sanitizer->sanitize($layoutName, $baseAttributes, true);

            $decorator = $layoutManager->createLayout($layoutName, $postType, $sanitized);
            if (!$decorator instanceof PostLayoutDecorator) {
                wp_send_json_success(['html' => '']);
            }

            $generator = new SsrViewGenerator($templateBlock, $sanitized);
            $decorator->getLayout()->setContentGenerator($generator);

            $query = $decorator->buildQuery($sanitized);
            $decorator->withQuery($query)->withAttributes($sanitized);

            $html = $decorator->render();
            wp_send_json_success(['html' => is_string($html) ? $html : '']);
        } catch (\Throwable $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    protected function bootDefaultThumbnailService(): void
    {
        if (has_filter('has_post_thumbnail', '__return_true')) {
            return;
        }
        try {
            $app = Application::getInstance();
            $service = $app->make(DefaultThumbnailService::class);
            if ($service && $service->isEnabled()) {
                $service->boot();
            }
        } catch (\Exception $e) {
            $service = new DefaultThumbnailService();
            if ($service->isEnabled()) {
                $service->boot();
            }
        }
    }
}
