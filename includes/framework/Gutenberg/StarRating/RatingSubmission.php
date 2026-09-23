<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Class RatingSubmission
 *
 * REST API endpoint for users to submit star ratings.
 * Creates a comment with the rating and updates aggregates.
 *
 * Endpoint: POST /wp-json/jankx/v1/star-rating/submit
 *
 * @package Jankx\Gutenberg\StarRating
 */
class RatingSubmission
{
    const REST_NAMESPACE = 'jankx/v1';
    const ROUTE = '/star-rating/submit';

    /**
     * Register the REST endpoint.
     */
    public static function register(): void
    {
        add_action('rest_api_init', [self::class, 'registerRoute']);
    }

    public static function registerRoute(): void
    {
        register_rest_route(self::REST_NAMESPACE, self::ROUTE, [
            'methods'             => \WP_REST_Server::CREATABLE,
            'callback'            => [self::class, 'handleSubmit'],
            'permission_callback' => '__return_true',
            'args'                => [
                'post_id' => [
                    'required'          => true,
                    'type'              => 'integer',
                    'sanitize_callback' => 'absint',
                ],
                'rating' => [
                    'required'          => true,
                    'type'              => 'number',
                    'sanitize_callback' => 'floatval',
                ],
                'review' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'wp_kses_post',
                ],
                'pros' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_textarea_field',
                ],
                'cons' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_textarea_field',
                ],
                'author_name' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'author_email' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_email',
                ],
            ],
        ]);
    }

    /**
     * Handle rating submission.
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public static function handleSubmit(\WP_REST_Request $request): \WP_REST_Response
    {
        $postId   = $request->get_param('post_id');
        $rating   = $request->get_param('rating');
        $review   = $request->get_param('review') ?? '';
        $pros     = $request->get_param('pros') ?? '';
        $cons     = $request->get_param('cons') ?? '';
        $authorName  = $request->get_param('author_name') ?? '';
        $authorEmail = $request->get_param('author_email') ?? '';

        // Validate post exists
        $post = get_post($postId);
        if (!$post) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => __('Bài viết không tồn tại.', 'jankx'),
            ], 404);
        }

        // Validate rating range
        $maxRating = 5;
        if (function_exists('\Jankx\Extensions\CommentRating\Admin\Settings::getMaxRating')) {
            $maxRating = \Jankx\Extensions\CommentRating\Admin\Settings::getMaxRating();
        }
        $rating = max(1, min($maxRating, (int) $rating));

        // Check if user already rated this post (by IP or user ID)
        $userId = get_current_user_id();
        $existing = self::findExistingRating($postId, $userId);
        if ($existing) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => __('Bạn đã đánh giá bài viết này rồi.', 'jankx'),
                'existing' => [
                    'rating' => (int) get_comment_meta($existing, 'jankx_comment_rating', true),
                    'comment_id' => $existing,
                ],
            ], 409);
        }

        // Build comment data
        $commentData = [
            'comment_post_ID'      => $postId,
            'comment_content'      => $review ?: sprintf(__('Đánh giá %d/%d', 'jankx'), $rating, $maxRating),
            'comment_type'         => 'review',
            'comment_approved'     => '1',
            'user_id'              => $userId,
            'comment_author'       => $userId ? wp_get_current_user()->display_name : ($authorName ?: 'Khách'),
            'comment_author_email' => $userId ? wp_get_current_user()->user_email : ($authorEmail ?: ''),
        ];

        $commentId = wp_insert_comment($commentData);

        if (!$commentId || is_wp_error($commentId)) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => __('Không thể lưu đánh giá. Vui lòng thử lại.', 'jankx'),
            ], 500);
        }

        // Save rating using RatingRepository (from comment-rating extension)
        if (class_exists('\Jankx\Extensions\CommentRating\Rating\RatingRepository')) {
            $repo = new \Jankx\Extensions\CommentRating\Rating\RatingRepository();
            $repo->save($commentId, $postId, $rating);
        } else {
            // Fallback: save directly if comment-rating is not active
            update_comment_meta($commentId, 'jankx_comment_rating', $rating);
            self::recomputeFallbackAggregate($postId);
        }

        // Save pros/cons if provided (for review-system integration)
        if (!empty($pros)) {
            $prosArray = array_filter(array_map('trim', explode("\n", $pros)));
            update_comment_meta($commentId, '_jankx_review_pros', $prosArray);
        }
        if (!empty($cons)) {
            $consArray = array_filter(array_map('trim', explode("\n", $cons)));
            update_comment_meta($commentId, '_jankx_review_cons', $consArray);
        }

        // Fire action for extensions to hook into
        do_action('jankx/star_rating/submitted', $commentId, $postId, $rating, $request);

        // Return updated aggregate
        $average = 0.0;
        $count = 0;
        if (class_exists('\Jankx\Extensions\CommentRating\Rating\RatingRepository')) {
            $repo = new \Jankx\Extensions\CommentRating\Rating\RatingRepository();
            $average = $repo->getAverage($postId);
            $count = $repo->getCount($postId);
        }

        return rest_ensure_response([
            'success' => true,
            'message' => __('Đánh giá đã được gửi thành công!', 'jankx'),
            'rating' => [
                'average' => $average,
                'count'   => $count,
                'user_rating' => $rating,
                'comment_id'  => $commentId,
            ],
        ]);
    }

    /**
     * Find existing rating by user or IP for this post.
     */
    private static function findExistingRating(int $postId, int $userId): ?int
    {
        $args = [
            'post_id' => $postId,
            'status'  => 'approve',
            'type'    => 'review',
            'fields'  => 'ids',
        ];

        if ($userId) {
            $args['user_id'] = $userId;
        }

        $comments = get_comments($args);

        foreach ($comments as $commentId) {
            $commentRating = (int) get_comment_meta($commentId, 'jankx_comment_rating', true);
            if ($commentRating > 0) {
                return $commentId;
            }
        }

        return null;
    }

    /**
     * Fallback aggregate computation when comment-rating extension is not active.
     */
    private static function recomputeFallbackAggregate(int $postId): void
    {
        $comments = get_comments([
            'post_id' => $postId,
            'status'  => 'approve',
            'fields'  => 'ids',
        ]);

        $values = [];
        foreach ($comments as $commentId) {
            $rating = (int) get_comment_meta($commentId, 'jankx_comment_rating', true);
            if ($rating >= 1 && $rating <= 5) {
                $values[$commentId] = $rating;
            }
        }

        $count = count($values);
        $average = $count > 0 ? round(array_sum($values) / $count, 1) : 0.0;

        update_post_meta($postId, 'jankx_rating_average', $average);
        update_post_meta($postId, 'jankx_rating_count', $count);
    }
}
