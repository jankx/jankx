<?php
/**
 * Render callback for jankx/review-form block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */

$attributes = wp_parse_args($attributes, [
    'postId'        => get_the_ID(),
    'maxRating'     => 5,
    'showReview'    => true,
    'showProsCons'  => false,
    'showLoginForm' => true,
    'formTitle'     => '',
    'submitText'    => '',
    'starSize'      => 32,
    'starColor'     => '#f1c40f',
    'starEmptyColor'=> '#dddddd',
    'customCSS'     => '',
]);

$postId = (int) $attributes['postId'];
if (!$postId) {
    $postId = get_the_ID();
}

$maxRating = (int) $attributes['maxRating'];
if ($maxRating < 3 || $maxRating > 10) {
    $maxRating = 5;
}

$formTitle     = $attributes['formTitle'] ?: __('Đánh giá của bạn', 'jankx');
$submitText    = $attributes['submitText'] ?: __('Gửi đánh giá', 'jankx');
$showReview    = (bool) $attributes['showReview'];
$showProsCons  = (bool) $attributes['showProsCons'];
$showLoginForm = (bool) $attributes['showLoginForm'];
$starSize      = (int) $attributes['starSize'];
$starColor     = esc_attr($attributes['starColor']);
$starEmptyColor= esc_attr($attributes['starEmptyColor']);

$restUrl = esc_url_raw(rest_url('jankx/v1/reviews'));
$nonce   = wp_create_nonce('wp_rest');
$isLoggedIn = is_user_logged_in();
$currentUser = wp_get_current_user();

// Enqueue the block script
$blockAssetFile = __DIR__ . '/../../dist/blocks/review-form/index.asset.php';
$version = '1.0.0';
$deps = ['wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n', 'wp-api-fetch'];
if (file_exists($blockAssetFile)) {
    $asset = require $blockAssetFile;
    $version = $asset['version'] ?? $version;
    $deps = $asset['dependencies'] ?? $deps;
}

wp_enqueue_script(
    'jankx-review-form-frontend',
    get_stylesheet_directory_uri() . '/dist/blocks/review-form/frontend.js',
    $deps,
    $version,
    true
);

wp_localize_script('jankx-review-form-frontend', 'jankxReviewForm', [
    'postId'        => $postId,
    'maxRating'     => $maxRating,
    'showReview'    => $showReview,
    'showProsCons'  => $showProsCons,
    'showLoginForm' => $showLoginForm,
    'restUrl'       => $restUrl,
    'nonce'         => $nonce,
    'isLoggedIn'    => $isLoggedIn,
    'userName'      => $isLoggedIn ? $currentUser->display_name : '',
    'userEmail'     => $isLoggedIn ? $currentUser->user_email : '',
    'i18n'          => [
        'title'          => $formTitle,
        'yourRating'     => __('Đánh giá của bạn', 'jankx'),
        'yourReview'     => __('Nhận xét của bạn', 'jankx'),
        'pros'           => __('Điểm mạnh', 'jankx'),
        'cons'           => __('Điểm yếu', 'jankx'),
        'prosPlaceholder'=> __('Mỗi dòng một ý...', 'jankx'),
        'consPlaceholder'=> __('Mỗi dòng một ý...', 'jankx'),
        'reviewPlaceholder' => __('Viết nhận xét của bạn...', 'jankx'),
        'submit'         => $submitText,
        'submitting'     => __('Đang gửi...', 'jankx'),
        'success'        => __('Cảm ơn bạn đã đánh giá!', 'jankx'),
        'error'          => __('Có lỗi xảy ra, vui lòng thử lại.', 'jankx'),
        'alreadyRated'   => __('Bạn đã đánh giá bài viết này rồi.', 'jankx'),
        'loginRequired'  => __('Vui lòng đăng nhập để đánh giá.', 'jankx'),
        'nameLabel'      => __('Họ tên', 'jankx'),
        'emailLabel'     => __('Email', 'jankx'),
        'namePlaceholder'=> __('Nhập họ tên...', 'jankx'),
        'emailPlaceholder'=> __('Nhập email...', 'jankx'),
        'orLogin'        => __('hoặc', 'jankx'),
        'loginLink'      => __('Đăng nhập', 'jankx'),
    ],
]);

// Build wrapper classes
$wrapper_classes = ['wp-block-jankx-review-form', 'jankx-review-form'];
if (!empty($attributes['className'])) {
    $wrapper_classes[] = esc_attr($attributes['className']);
}
if (!empty($attributes['align'])) {
    $wrapper_classes[] = 'align' . esc_attr($attributes['align']);
}

// Inline style for custom colors
$style = sprintf(
    '--review-star-size: %dpx; --review-star-color: %s; --review-star-empty-color: %s;',
    $starSize,
    $starColor,
    $starEmptyColor
);

$unique_id = 'review-form-' . $postId . '-' . substr(md5(uniqid()), 0, 8);
?>
<div class="<?php echo esc_attr(implode(' ', $wrapper_classes)); ?>" style="<?php echo esc_attr($style); ?>" id="<?php echo esc_attr($unique_id); ?>">
    <?php if (!empty($formTitle)): ?>
        <h3 class="jankx-review-form__title"><?php echo esc_html($formTitle); ?></h3>
    <?php endif; ?>

    <div class="jankx-review-form__body" data-form-id="<?php echo esc_attr($unique_id); ?>">
        <?php if (!$isLoggedIn && $showLoginForm): ?>
            <div class="jankx-review-form__guest-notice">
                <p>
                    <?php esc_html_e('Bạn chưa đăng nhập?', 'jankx'); ?>
                    <a href="<?php echo esc_url(wp_login_url(get_permalink($postId))); ?>">
                        <?php esc_html_e('Đăng nhập', 'jankx'); ?>
                    </a>
                    <?php esc_html_e('hoặc bình luận với tư cách khách.', 'jankx'); ?>
                </p>
            </div>
        <?php endif; ?>

        <?php if ($isLoggedIn): ?>
            <div class="jankx-review-form__user-info">
                <span class="jankx-review-form__avatar">
                    <?php echo get_avatar($currentUser->ID, 32); ?>
                </span>
                <span class="jankx-review-form__username"><?php echo esc_html($currentUser->display_name); ?></span>
            </div>
        <?php endif; ?>

        <div class="jankx-review-form__stars" data-max-rating="<?php echo esc_attr($maxRating); ?>">
            <?php for ($i = 1; $i <= $maxRating; $i++): ?>
                <span class="jankx-review-form__star" data-value="<?php echo esc_attr($i); ?>" style="font-size: <?php echo esc_attr($starSize); ?>px; color: <?php echo esc_attr($starEmptyColor); ?>;">☆</span>
            <?php endfor; ?>
            <span class="jankx-review-form__rating-text"></span>
        </div>

        <?php if ($showReview): ?>
            <div class="jankx-review-form__field">
                <textarea
                    class="jankx-review-form__textarea jankx-review-form__textarea--review"
                    placeholder="<?php esc_attr_e('Viết nhận xét của bạn...', 'jankx'); ?>"
                    rows="4"
                ></textarea>
            </div>
        <?php endif; ?>

        <?php if ($showProsCons): ?>
            <div class="jankx-review-form__pros-cons">
                <div class="jankx-review-form__field">
                    <label class="jankx-review-form__label jankx-review-form__label--pros">
                        <?php esc_html_e('Điểm mạnh', 'jankx'); ?>
                    </label>
                    <textarea
                        class="jankx-review-form__textarea jankx-review-form__textarea--pros"
                        placeholder="<?php esc_attr_e('Mỗi dòng một ý...', 'jankx'); ?>"
                        rows="3"
                    ></textarea>
                </div>
                <div class="jankx-review-form__field">
                    <label class="jankx-review-form__label jankx-review-form__label--cons">
                        <?php esc_html_e('Điểm yếu', 'jankx'); ?>
                    </label>
                    <textarea
                        class="jankx-review-form__textarea jankx-review-form__textarea--cons"
                        placeholder="<?php esc_attr_e('Mỗi dòng một ý...', 'jankx'); ?>"
                        rows="3"
                    ></textarea>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!$isLoggedIn && $showLoginForm): ?>
            <div class="jankx-review-form__guest-fields">
                <div class="jankx-review-form__field">
                    <input
                        type="text"
                        class="jankx-review-form__input jankx-review-form__input--name"
                        placeholder="<?php esc_attr_e('Họ tên (tùy chọn)', 'jankx'); ?>"
                    />
                </div>
                <div class="jankx-review-form__field">
                    <input
                        type="email"
                        class="jankx-review-form__input jankx-review-form__input--email"
                        placeholder="<?php esc_attr_e('Email (tùy chọn)', 'jankx'); ?>"
                    />
                </div>
            </div>
        <?php endif; ?>

        <div class="jankx-review-form__submit">
            <button class="jankx-review-form__button" type="button">
                <?php echo esc_html($submitText); ?>
            </button>
            <span class="jankx-review-form__spinner" style="display: none;">
                <span class="spinner is-active"></span>
            </span>
        </div>

        <div class="jankx-review-form__message" style="display: none;"></div>
    </div>
</div>

<?php if (!empty($attributes['customCSS'])): ?>
<style>
<?php echo wp_strip_all_tags($attributes['customCSS']); ?>
</style>
<?php endif; ?>
