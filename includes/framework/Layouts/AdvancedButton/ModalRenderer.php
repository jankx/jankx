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
        
        // Only add modal trigger class if there's a valid modalId
        if (!empty($modalId)) {
            $classes .= ' jankx-button-modal-trigger';
        }
        
        $htmlAttributes = [
            'type' => 'button',
            'class' => $classes,
            'data-trigger-type' => 'modal',
        ];
        
        // Only add modal attributes if modalId exists
        if (!empty($modalId)) {
            $htmlAttributes['data-micromodal-trigger'] = $modalId;
            $htmlAttributes['data-modal-id'] = $modalId;
        }
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
        
        // Handle custom form data
        $formData = $attributes['formData'] ?? [];
        if (!empty($formData) && is_array($formData)) {
            foreach ($formData as $item) {
                if (!empty($item['key']) && !empty($item['value'])) {
                    $key = 'data-form-' . esc_attr($item['key']);
                    $htmlAttributes[$key] = $item['value'];
                }
            }
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
            
            // Replace placeholders in custom form data
            $html = str_replace('{post_id}', esc_attr($post_id), $html);
            $html = str_replace('{post_title}', esc_attr($post_title), $html);
            $html = str_replace('{current_url}', esc_attr($post_url), $html);
            // Support WooCommerce price if available
            if (function_exists('wc_get_product')) {
                $product = wc_get_product($post_id);
                if ($product) {
                    $html = str_replace('{price}', esc_attr($product->get_price_html()), $html);
                    $html = str_replace('{raw_price}', esc_attr($product->get_price()), $html);
                    $image_id = $product->get_image_id();
                    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
                    $html = str_replace('{product_image}', esc_attr($image_url), $html);
                }
            }
        }
        return $html;
    }
}

