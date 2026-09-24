<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Class RatingSubmissionShortcode
 *
 * Provides a [jankx_rating_form] shortcode to embed the star rating
 * submission form on any page or post.
 *
 * Usage:
 *   [jankx_rating_form]
 *   [jankx_rating_form post_id="123"]
 *   [jankx_rating_form max_rating="10" show_review="yes" show_pros_cons="yes"]
 *
 * @package Jankx\Gutenberg\StarRating
 */
class RatingSubmissionShortcode
{
    public static function register(): void
    {
        add_shortcode('jankx_rating_form', [self::class, 'render']);
    }

    public static function render(array $atts, ?string $content = null): string
    {
        $atts = shortcode_atts([
            'post_id'        => get_the_ID(),
            'max_rating'     => 5,
            'show_review'    => 'yes',
            'show_pros_cons' => 'no',
        ], $atts, 'jankx_rating_form');

        $postId = (int) $atts['post_id'];
        if (!$postId) {
            return '';
        }

        $maxRating = (int) $atts['max_rating'];
        if ($maxRating < 1 || $maxRating > 10) {
            $maxRating = 5;
        }

        $showReview = $atts['show_review'] === 'yes';
        $showProsCons = $atts['show_pros_cons'] === 'yes';

        $restUrl = rest_url('jankx/v1/reviews');
        $nonce = wp_create_nonce('wp_rest');

        // Enqueue the React component
        wp_enqueue_script(
            'jankx-rating-submission',
            get_stylesheet_directory_uri() . '/dist/components/rating-submission.js',
            ['wp-element'],
            '1.0.0',
            true
        );

        wp_localize_script('jankx-rating-submission', 'jankxRatingSubmission', [
            'postId'        => $postId,
            'maxRating'     => $maxRating,
            'showReview'    => $showReview,
            'showProsCons'  => $showProsCons,
            'restUrl'       => $restUrl,
            'nonce'         => $nonce,
            'translations'  => [
                'submit'        => __('Gửi đánh giá', 'jankx'),
                'submitting'    => __('Đang gửi...', 'jankx'),
                'success'       => __('Đánh giá đã được gửi thành công!', 'jankx'),
                'error'         => __('Có lỗi xảy ra, vui lòng thử lại.', 'jankx'),
                'loginRequired' => __('Vui lòng đăng nhập để đánh giá.', 'jankx'),
                'alreadyRated'  => __('Bạn đã đánh giá bài viết này rồi.', 'jankx'),
            ],
        ]);

        // Render a placeholder div that React will mount into
        $output = sprintf(
            '<div id="jankx-rating-submission-%d" class="jankx-rating-submission-wrapper" data-post-id="%d"></div>',
            esc_attr($postId),
            esc_attr($postId)
        );

        // Inline script to mount the React component
        $output .= sprintf(
            '<script>
                document.addEventListener("DOMContentLoaded", function() {
                    var container = document.getElementById("jankx-rating-submission-%d");
                    if (container && typeof wp !== "undefined" && wp.element) {
                        var config = window.jankxRatingSubmission || {};
                        var element = wp.element.createElement(
                            wp.components.Fragment,
                            null,
                            wp.element.createElement("div", { id: "jankx-rating-form-mount" })
                        );
                        wp.element.render(element, container);
                        
                        // Import and render the RatingSubmissionForm
                        // This will be handled by the bundled JS file
                    }
                });
            </script>',
            esc_js($postId)
        );

        return $output;
    }
}
