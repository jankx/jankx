<?php
/**
 * Modal Block
 *
 * A modal block with trigger and content areas. Supports inner blocks and custom selectors.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Template\Template;

class ModalBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/modal';

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueStyles']);
    }

    /**
     * Enqueue scripts
     *
     * @return void
     */
    public function enqueueScripts()
    {
        // Enqueue Micromodal library
        wp_enqueue_script(
            'micromodal',
            'https://unpkg.com/micromodal/dist/micromodal.min.js',
            [],
            '0.4.10',
            true
        );

        // Enqueue modal view script
        $asset_file = include get_template_directory() . '/resources/blocks/modal/build/view.asset.php';
        wp_enqueue_script(
            'jankx-modal-view',
            get_template_directory_uri() . '/resources/blocks/modal/build/view.js',
            array_merge($asset_file['dependencies'], ['micromodal']),
            $asset_file['version'],
            true
        );
    }

    /**
     * Enqueue styles
     *
     * @return void
     */
    public function enqueueStyles()
    {
        wp_enqueue_style(
            'jankx-modal-style',
            get_template_directory_uri() . '/resources/blocks/modal/build/style.css',
            [],
            '1.0.0'
        );
    }

    /**
     * Render the block
     *
     * @param array $attributes
     * @param string $content
     * @return string
     */
    public function render($attributes, $content)
    {
        $modal_id = $attributes['modalId'] ?: 'modal-' . uniqid();
        $trigger_type = $attributes['triggerType'] ?? 'button';
        $trigger_text = $attributes['triggerText'] ?? 'Open Modal';
        $trigger_url = $attributes['triggerUrl'] ?? '';
        $trigger_target = $attributes['triggerTarget'] ?? '_self';
        $custom_selector = $attributes['customSelector'] ?? '';
        $modal_size = $attributes['modalSize'] ?? 'medium';
        $close_on_overlay_click = $attributes['closeOnOverlayClick'] ?? true;
        $close_on_escape = $attributes['closeOnEscape'] ?? true;
        $show_close_button = $attributes['showCloseButton'] ?? true;
        $animation_type = $attributes['animationType'] ?? 'fade';
        $animation_duration = $attributes['animationDuration'] ?? 300;
        $backdrop_color = $attributes['backdropColor'] ?? 'rgba(0, 0, 0, 0.5)';
        $backdrop_blur = $attributes['backdropBlur'] ?? false;
        $z_index = $attributes['zIndex'] ?? 9999;

        // Generate unique IDs
        $trigger_id = $modal_id . '-trigger';
        $modal_content_id = $modal_id . '-content';

        // Build trigger HTML
        $trigger_html = '';
        switch ($trigger_type) {
            case 'button':
                $trigger_html = sprintf(
                    '<button type="button" id="%s" class="wp-block-jankx-modal__trigger" data-micromodal-trigger="%s">%s</button>',
                    esc_attr($trigger_id),
                    esc_attr($modal_id),
                    esc_html($trigger_text)
                );
                break;
            case 'anchor':
                $trigger_html = sprintf(
                    '<a href="%s" id="%s" class="wp-block-jankx-modal__trigger" data-micromodal-trigger="%s" target="%s">%s</a>',
                    esc_url($trigger_url),
                    esc_attr($trigger_id),
                    esc_attr($modal_id),
                    esc_attr($trigger_target),
                    esc_html($trigger_text)
                );
                break;
            case 'custom':
                if ($custom_selector) {
                    $trigger_html = sprintf(
                        '<div class="wp-block-jankx-modal__custom-trigger" data-custom-selector="%s" data-micromodal-trigger="%s"></div>',
                        esc_attr($custom_selector),
                        esc_attr($modal_id)
                    );
                }
                break;
        }

        // Build modal HTML
        $modal_html = sprintf(
            '<div id="%s" class="wp-block-jankx-modal" aria-hidden="true" data-micromodal-close>
                <div class="wp-block-jankx-modal__overlay" tabindex="-1" data-micromodal-close>
                    <div class="wp-block-jankx-modal__container wp-block-jankx-modal__container--%s" role="dialog" aria-modal="true" aria-labelledby="%s-title">
                        <div class="wp-block-jankx-modal__content" id="%s">
                            %s
                            %s
                        </div>
                    </div>
                </div>
            </div>',
            esc_attr($modal_id),
            esc_attr($modal_size),
            esc_attr($modal_id),
            esc_attr($modal_content_id),
            $show_close_button ? '<button class="wp-block-jankx-modal__close" aria-label="Close modal" data-micromodal-close></button>' : '',
            $content
        );

        // Build inline styles
        $inline_styles = sprintf(
            '<style>
                #%s {
                    --modal-backdrop-color: %s;
                    --modal-animation-duration: %dms;
                    --modal-z-index: %d;
                    --modal-backdrop-blur: %s;
                }
            </style>',
            esc_attr($modal_id),
            esc_attr($backdrop_color),
            intval($animation_duration),
            intval($z_index),
            $backdrop_blur ? 'blur(5px)' : 'none'
        );

        // Build data attributes for JavaScript
        $data_attributes = sprintf(
            'data-close-on-overlay-click="%s" data-close-on-escape="%s" data-animation-type="%s"',
            $close_on_overlay_click ? 'true' : 'false',
            $close_on_escape ? 'true' : 'false',
            esc_attr($animation_type)
        );

        return sprintf(
            '<div class="wp-block-jankx-modal-wrapper" %s>
                %s
                %s
                %s
            </div>',
            $data_attributes,
            $trigger_html,
            $modal_html,
            $inline_styles
        );
    }
}
