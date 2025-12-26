<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use WP_Query;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Generators\ViewSsrGenerator;
use Jankx\Layouts\DynamicDataLayout\ContentLoopLayoutManager;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\AttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\PostLayoutDecorator;
use Jankx\Layouts\DynamicDataLayout\Generators\SsrViewGenerator;

class DynamicSsrTemplateBlock extends Block
{
    protected $blockId = 'jankx/dynamic-ssr-template';
    protected $contentLoopLayoutManager;

    public function init()
    {
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets'], 20);
        add_action('wp_ajax_jankx_dynamic_ssr_template_preview', [$this, 'ajaxPreview']);
        add_action('wp_ajax_nopriv_jankx_dynamic_ssr_template_preview', [$this, 'ajaxPreview']);
        
        // Register block with attributes
        register_block_type($this->blockId, [
            'render_callback' => [$this, 'render'],
            'attributes' => [
                'overlayIcon' => [
                    'type' => 'string',
                    'default' => '',
                ],
                'overlayIconPosition' => [
                    'type' => 'string',
                    'default' => 'center',
                ],
                'overlayIconSize' => [
                    'type' => 'number',
                    'default' => 24,
                ],
                'overlayIconColor' => [
                    'type' => 'string',
                    'default' => '#ffffff',
                ],
                'overlayIconBackground' => [
                    'type' => 'string',
                    'default' => 'rgba(0, 0, 0, 0.5)',
                ],
                'overlayIconShowMode' => [
                    'type' => 'string',
                    'default' => 'always-show',
                ],
                'overlayIconTarget' => [
                    'type' => 'string',
                    'default' => 'featured-image',
                ],
            ],
        ]);
    }

    protected function getViewLayoutManager(): ViewLayoutManager
    {
        return ViewLayoutManager::getInstance();
    }

    protected function getContentLoopLayoutManager(): ContentLoopLayoutManager
    {
        if ($this->contentLoopLayoutManager === null) {
            $this->contentLoopLayoutManager = ContentLoopLayoutManager::getInstance();
        }
        return $this->contentLoopLayoutManager;
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
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => $this->buildWrapperClasses($attributes),
            'data-overlay-icon' => $attributes['overlayIcon'] ?? '',
            'data-overlay-icon-position' => $attributes['overlayIconPosition'] ?? 'center',
            'data-overlay-icon-size' => $attributes['overlayIconSize'] ?? 24,
            'data-overlay-icon-color' => $attributes['overlayIconColor'] ?? '#ffffff',
            'data-overlay-icon-bg' => $attributes['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)',
            'data-overlay-icon-mode' => $attributes['overlayIconShowMode'] ?? 'always-show',
            'data-overlay-icon-target' => $attributes['overlayIconTarget'] ?? 'featured-image',
        ]);

        if ($block instanceof \WP_Block) {
            $context = $block->context['jankxPostTypeLayout'] ?? null;
            if (is_array($context)) {
                $query = $context['query'] ?? null;
                if ($query instanceof WP_Query) {
                    return sprintf(
                        '<div %s>%s</div>',
                        $wrapper_attributes,
                        $this->renderTemplate($query, $attributes, $block)
                    );
                }
            }
        }
        
        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $content
        );
    }

    /**
     * Render the template
     *
     * @param WP_Query $query
     * @param array $attributes
     * @param \WP_Block $block
     * @return string
     */
    protected function renderTemplate($query, $attributes, $block)
    {
        $context = $block->context['jankxPostTypeLayout'] ?? null;
        if (is_array($context)) {
            $options = $context['options'] ?? [];
            $template = $context['template'] ?? ($block->parsed_block ?? null);
            if (is_array($template)) {
                $layout = $context['layout'] ?? null;
                $generator = new SsrViewGenerator($template, $options);
                if ($layout instanceof \Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface) {
                    $generator->setLayout($layout);
                }
                return $generator->generate($query, $options);
            }
        }
        return '';
    }

    /**
     * Build wrapper classes for the block
     *
     * @param array $attributes Block attributes
     * @return string
     */
    protected function buildWrapperClasses($attributes)
    {
        $classes = ['dynamic-ssr-template'];
        
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }
        
        if (!empty($attributes['overlayIcon'])) {
            $classes[] = 'has-overlay-icon';
            $classes[] = sprintf('overlay-icon-position-%s', $attributes['overlayIconPosition'] ?? 'center');
            $classes[] = sprintf('overlay-icon-mode-%s', $attributes['overlayIconShowMode'] ?? 'always-show');
            $classes[] = sprintf('overlay-icon-target-%s', $attributes['overlayIconTarget'] ?? 'featured-image');
        }
        
        return implode(' ', $classes);
    }

    public function ajaxPreview()
    {
        check_ajax_referer('jankx_dynamic_ssr_template_preview', 'nonce');

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
}
