<?php
namespace Jankx\Gutenberg\Blocks;
use Jankx\Gutenberg\Block;
class TestimonialBlock extends Block
{
    protected $blockId = 'jankx/testimonial';
    public function render($attributes, $content = '', $block = null)
    {
        $author = $attributes['author'] ?? '';
        $role = $attributes['role'] ?? '';
        $company = $attributes['company'] ?? '';
        $date = $attributes['date'] ?? '';
        $rating = isset($attributes['rating']) ? intval($attributes['rating']) : 0;
        $excerpt = $attributes['excerpt'] ?? '';
        $avatarId = isset($attributes['avatarId']) ? intval($attributes['avatarId']) : 0;
        $link = $attributes['link'] ?? '';
        $className = $attributes['className'] ?? '';
        $asSlide = false;
        if ($block && isset($block->context['asSlide'])) {
            $asSlide = (bool)$block->context['asSlide'];
        }
        $classes = 'testimonial-item';
        if ($asSlide) {
            $classes .= ' swiper-slide';
        }
        if (!empty($className)) {
            $classes .= ' ' . esc_attr($className);
        }
        
        // Header: Avatar + Info (Author, Rating)
        $avatarHtml = '';
        if ($avatarId) {
            $avatarImg = wp_get_attachment_image($avatarId, 'thumbnail', false, ['class' => 'avatar']);
            if ($avatarImg) {
                $avatarHtml = '<div class="testimonial-avatar">' . $avatarImg . '</div>';
            }
        }

        $authorHtml = '';
        if ($author) {
            $authorHtml = '<div class="testimonial-author">' . esc_html($author) . '</div>';
            if ($link) {
                $authorHtml = '<a class="testimonial-link" href="' . esc_url($link) . '">' . $authorHtml . '</a>';
            }
        }

        $ratingHtml = '';
        if ($rating > 0) {
            $stars = str_repeat('★', min($rating, 5));
            $empty = str_repeat('☆', max(0, 5 - min($rating, 5)));
            $ratingHtml = '<div class="testimonial-rating" aria-label="' . esc_attr($rating . '/5') . '">' . $stars . $empty . '</div>';
        }

        $headerHtml = '<div class="testimonial-header">' . $avatarHtml . '<div class="testimonial-info">' . $authorHtml . $ratingHtml . '</div></div>';

        // Body: Quote Icon + Content
        $contentHtml = '';
        if ($excerpt) {
            $contentHtml = '<div class="testimonial-content">' . wp_kses_post($excerpt) . '</div>';
        } else {
            $contentHtml = $content;
        }
        
        $bodyHtml = '<div class="testimonial-body"><div class="testimonial-quote-icon">“</div>' . $contentHtml . '</div>';

        // Footer: Meta + Date
        $metaParts = [];
        if ($role) {
            $metaParts[] = esc_html($role);
        }
        if ($company) {
            $metaParts[] = esc_html($company);
        }
        
        $metaHtml = '';
        if (!empty($metaParts)) {
            $metaHtml = '<div class="testimonial-meta">' . implode(' • ', $metaParts) . '</div>';
        }

        $dateHtml = '';
        if ($date) {
            $dateHtml = '<div class="testimonial-date">' . esc_html($date) . '</div>';
        }

        $footerHtml = '';
        if ($metaHtml || $dateHtml) {
            $footerHtml = '<div class="testimonial-footer">' . $metaHtml . $dateHtml . '</div>';
        }

        $wrapper = get_block_wrapper_attributes();
        
        return sprintf(
            '<div %s><div class="%s">%s%s%s</div></div>',
            $wrapper,
            esc_attr($classes),
            $headerHtml,
            $bodyHtml,
            $footerHtml
        );
    }
}
