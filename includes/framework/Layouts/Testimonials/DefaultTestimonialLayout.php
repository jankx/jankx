<?php

namespace Jankx\Layouts\Testimonials;

use WP_Query;

class DefaultTestimonialLayout implements TestimonialLayoutInterface
{
    protected $options = [
        'columns' => 3,
        'showAvatar' => true,
        'showRating' => true,
        'showDate' => false,
        'excerptLength' => 30,
        'className' => '',
    ];

    protected $query;

    public function getName(): string
    {
        return 'default';
    }

    public function getTitle(): string
    {
        return 'Default Testimonials';
    }

    public function setOptions($options): self
    {
        if (is_array($options)) {
            $this->options = array_merge($this->options, $options);
        }
        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setQuery(WP_Query $query): self
    {
        $this->query = $query;
        return $this;
    }

    protected function renderRating($postId): string
    {
        if (!$this->options['showRating']) {
            return '';
        }
        $rating = get_post_meta($postId, 'rating', true);
        $rating = is_numeric($rating) ? intval($rating) : 0;
        if ($rating <= 0) {
            return '';
        }
        $stars = str_repeat('★', min($rating, 5));
        $empty = str_repeat('☆', max(0, 5 - min($rating, 5)));
        return sprintf('<div class="testimonial-rating" aria-label="%s">%s%s</div>', esc_attr($rating . '/5'), $stars, $empty);
    }

    protected function renderAvatar($postId): string
    {
        if (!$this->options['showAvatar']) {
            return '';
        }
        if (has_post_thumbnail($postId)) {
            return sprintf('<div class="testimonial-avatar">%s</div>', get_the_post_thumbnail($postId, 'thumbnail'));
        }
        return '';
    }

    protected function getExcerpt($post): string
    {
        $excerpt = has_excerpt($post) ? get_the_excerpt($post) : wp_trim_words($post->post_content, $this->options['excerptLength']);
        return sprintf('<div class="testimonial-content">%s</div>', esc_html($excerpt));
    }

    public function render(): string
    {
        if (!$this->query instanceof WP_Query) {
            return '';
        }

        $columns = max(1, intval($this->options['columns']));
        $className = trim('jankx-testimonials is-layout-default cols-' . $columns . ' ' . ($this->options['className'] ?? ''));

        ob_start();
        echo '<div class="' . esc_attr($className) . '">';
        while ($this->query->have_posts()) {
            $this->query->the_post();
            $postId = get_the_ID();
            echo '<div class="testimonial-item">';
            echo $this->renderAvatar($postId);
            echo '<div class="testimonial-body">';
            echo '<div class="testimonial-author">' . esc_html(get_the_title()) . '</div>';
            if ($this->options['showDate']) {
                echo '<div class="testimonial-date">' . esc_html(get_the_date()) . '</div>';
            }
            echo $this->renderRating($postId);
            echo $this->getExcerpt(get_post($postId));
            echo '</div>';
            echo '</div>';
        }
        echo '</div>';
        wp_reset_postdata();
        return ob_get_clean();
    }

    public function renderPreview(): array
    {
        return [
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'options' => $this->getOptions(),
        ];
    }
}

