<?php

namespace Jankx\Layouts\AdvancedButton;

class ModalRenderer extends AbstractButtonRenderer
{
    public function render(array $attributes, string $content, string $classes, array $styles): string
    {
        $modalId = $attributes['modalId'] ?? '';
        $modalShareObjectId = $attributes['modalShareObjectId'] ?? false;
        $modalSharePostTitle = $attributes['modalSharePostTitle'] ?? false;
        $modalShareCurrentUrl = $attributes['modalShareCurrentUrl'] ?? false;
        $title = $attributes['title'] ?? '';
        if (!empty($modalId)) {
            $classes .= ' jankx-button-modal-trigger';
        }
        $htmlAttributes = [
            'type' => 'button',
            'class' => $classes,
            'data-micromodal-trigger' => $modalId,
            'data-modal-id' => $modalId,
            'data-trigger-type' => 'modal',
        ];
        if ($modalShareObjectId) {
            $htmlAttributes['data-share-object-id'] = 'true';
            $htmlAttributes['data-current-object-id'] = '{{CURRENT_POST_ID}}';
        }
        if ($modalSharePostTitle) {
            $htmlAttributes['data-share-post-title'] = 'true';
            $htmlAttributes['data-current-post-title'] = '{{CURRENT_POST_TITLE}}';
        }
        if ($modalShareCurrentUrl) {
            $htmlAttributes['data-share-current-url'] = 'true';
            $htmlAttributes['data-current-url'] = '{{CURRENT_POST_URL}}';
        }
        if ($title) {
            $htmlAttributes['title'] = esc_attr($title);
        }
        $styleAttr = $this->buildStyleAttribute($styles);
        if ($styleAttr) {
            $htmlAttributes['style'] = $styleAttr;
        }
        $attributesString = $this->buildAttributes($htmlAttributes);
        $html = sprintf('<button%s>%s</button>', $attributesString, $content);
        if (is_singular() && have_posts()) {
            the_post();
            $post_id = get_the_ID();
            $post_title = get_the_title();
            $post_url = get_permalink();
            wp_reset_postdata();
        } else {
            global $post;
            $post_id = $post ? $post->ID : '';
            $post_title = $post ? $post->post_title : '';
            $post_url = $post ? get_permalink($post) : '';
        }
        if ($post_id && $post_title && $post_url) {
            $html = str_replace('{{CURRENT_POST_ID}}', esc_attr($post_id), $html);
            $html = str_replace('{{CURRENT_POST_TITLE}}', esc_attr($post_title), $html);
            $html = str_replace('{{CURRENT_POST_URL}}', esc_attr($post_url), $html);
        }
        return $html;
    }
}

