<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\Testimonials\TestimonialLayoutManager;
use WP_Query;

class TestimonialsBlock extends Block
{
    protected $blockId = 'jankx/testimonials';

    public function render($attributes, $content = '', $block = null)
    {
        $layoutName = $attributes['layout'] ?? 'default';
        $postsPerPage = isset($attributes['postsPerPage']) ? intval($attributes['postsPerPage']) : 5;
        $order = $attributes['order'] ?? 'DESC';
        $orderBy = $attributes['orderBy'] ?? 'date';
        $className = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        $manager = TestimonialLayoutManager::getInstance();
        $manager->bootstrap();

        $postType = post_type_exists('testimonial') ? 'testimonial' : 'post';

        $queryArgs = [
            'post_type' => $postType,
            'posts_per_page' => $postsPerPage,
            'orderby' => $orderBy,
            'order' => $order,
            'post_status' => ['publish'],
        ];

        $query = new WP_Query($queryArgs);

        $layout = $manager->createLayout($layoutName, $attributes);
        if (!$layout) {
            $layout = $manager->createLayout('default', $attributes);
        }
        if (!$layout) {
            return '';
        }
        $layout->setQuery($query);

        $wrapperAttributes = [];
        if (!empty($anchor)) {
            $wrapperAttributes['id'] = esc_attr($anchor);
        }

        $wrapper = get_block_wrapper_attributes($wrapperAttributes);

        $html = $layout->render();

        if (!empty($className)) {
            if (preg_match('/class=["\']([^"\']*)["\']/', $wrapper, $matches)) {
                $existing = trim($matches[1]);
                $all = trim($existing . ' ' . esc_attr($className));
                $wrapper = preg_replace('/class=["\'][^"\']*["\']/', 'class="' . $all . '"', $wrapper);
            } else {
                $wrapper .= ' class="' . esc_attr($className) . '"';
            }
        }

        return sprintf('<div %s>%s</div>', $wrapper, $html);
    }
}

