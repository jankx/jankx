<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\SmartTabs\SmartTabTriggerInterface;
use Jankx\Gutenberg\SmartTabs\SmartTabTriggerRegistry;
use WP_Block;

/**
 * Smart Tab Block
 *
 * Represents a single tab panel within a Smart Tabs container.
 * Supports icons and accepts any inner blocks for content.
 *
 * Note: This is NOT a dynamic block. Content is saved via InnerBlocks.Content
 * and rendered by the parent SmartTabsBlock.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SmartTabBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/smart-tab';

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Initialise block specific logic.
     *
     * @return void
     */
    public function init()
    {
        add_action('init', function () {
            SmartTabTriggerRegistry::instance()->boot();
        }, 50);

        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
    }

    /**
     * Localise trigger configuration for the block editor.
     *
     * @return void
     */
    public function enqueueEditorAssets(): void
    {
        SmartTabTriggerRegistry::instance()->boot();

        $handle = 'jankx-smart-tab-editor-script';

        if (!wp_script_is($handle, 'registered')) {
            return;
        }

        wp_enqueue_script($handle);

        $config = SmartTabTriggerRegistry::instance()->toEditorConfig([
            'is_admin' => is_admin(),
        ]);

        wp_add_inline_script(
            $handle,
            'window.JankxSmartTabTriggers = ' . wp_json_encode(['items' => $config]) . ';',
            'before'
        );
    }

    /**
     * Render tab content after applying trigger logic.
     *
     * @param array $attributes
     * @param string $content
     * @param WP_Block|null $block
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        SmartTabTriggerRegistry::instance()->boot();

        $trigger_key = $attributes['trigger'] ?? 'manual';
        $registry = SmartTabTriggerRegistry::instance();
        $trigger = $registry->getTrigger($trigger_key);

        if ($trigger instanceof SmartTabTriggerInterface) {
            $attributes = $trigger->prepareAttributes($attributes);
        }

        $context = $this->resolveRenderContext($block);
        if ($trigger instanceof SmartTabTriggerInterface) {
            $display_context = $context;
            $display_context['tab_attributes'] = $attributes;

            if ($trigger->shouldDisplay($attributes, $display_context) === false) {
                return '';
            }
        }

        if ($trigger instanceof SmartTabTriggerInterface) {
            $content = $trigger->filterContent($content, $attributes, $context);
        }

        $wrapper_attributes = [
            'class' => 'smart-tab',
            'data-trigger' => $trigger_key,
        ];

        if (!empty($attributes['tabId'])) {
            $wrapper_attributes['id'] = sanitize_html_class($attributes['tabId']);
        }

        if (!empty($attributes['triggerSettings']) && is_array($attributes['triggerSettings'])) {
            $wrapper_attributes['data-trigger-settings'] = wp_json_encode($attributes['triggerSettings']);
        }

        $attrs_string = '';
        foreach ($wrapper_attributes as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $attrs_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr(is_string($value) ? $value : (string) $value));
        }

        $content_styles = [];
        if (!empty($attributes['contentTextColor'])) {
            $content_styles[] = sprintf('color: %s', esc_attr($attributes['contentTextColor']));
        }
        if (!empty($attributes['contentGradient'])) {
            $content_styles[] = sprintf('background: %s', esc_attr($attributes['contentGradient']));
        } elseif (!empty($attributes['contentBackgroundColor'])) {
            $content_styles[] = sprintf('background-color: %s', esc_attr($attributes['contentBackgroundColor']));
        }

        $content_style_attr = !empty($content_styles) ? sprintf(' style="%s"', implode('; ', $content_styles)) : '';
        $content_wrapper = sprintf('<div class="smart-tab__content"%s>%s</div>', $content_style_attr, $content);

        return sprintf('<div%s>%s</div>', $attrs_string, $content_wrapper);
    }

    /**
     * Build render context for triggers.
     *
     * @param WP_Block|null $block
     * @return array<string, mixed>
     */
    protected function resolveRenderContext($block): array
    {
        $post_id = 0;

        if ($block instanceof WP_Block && isset($block->context['postId'])) {
            $post_id = (int) $block->context['postId'];
        }

        if (!$post_id) {
            $post_id = get_the_ID() ?: 0;
        }

        $post_type = $post_id ? get_post_type($post_id) : '';

        return [
            'post_id' => $post_id,
            'post_type' => $post_type ?: '',
            'is_admin' => is_admin(),
        ];
    }
}

