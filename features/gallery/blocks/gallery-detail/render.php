<?php

function jankx_gallery_detail_render($attributes = [], $content = '', $block = null)
{
    $useCurrentPost = isset($attributes['useCurrentPost']) ? (bool)$attributes['useCurrentPost'] : true;
    $imageSize = isset($attributes['imageSize']) && is_string($attributes['imageSize']) ? $attributes['imageSize'] : 'large';
    $thumbSize = isset($attributes['thumbSize']) && is_string($attributes['thumbSize']) ? $attributes['thumbSize'] : 'thumbnail';
    $post_id = 0;
    if ($useCurrentPost) {
        if (is_singular() && have_posts()) {
            the_post();
            $post_id = get_the_ID();
            wp_reset_postdata();
        } else {
            global $post;
            $post_id = $post ? $post->ID : 0;
        }
    }
    if (!$post_id) {
        return '';
    }
    $images = \Jankx\Features\Gallery\GalleryServiceProvider::getGallery($post_id, $imageSize, $thumbSize);
    if (empty($images)) {
        return '';
    }
    $main = $images[0];
    ob_start();
    ?>
    <div class="jankx-gallery-detail" data-post-id="<?php echo esc_attr($post_id); ?>">
        <div class="jankx-gallery-detail__main">
            <img
                id="jankx-gallery-main-<?php echo esc_attr($post_id); ?>"
                class="jankx-gallery-detail__image"
                src="<?php echo esc_url($main['url']); ?>"
                <?php if (!empty($main['srcset'])): ?>srcset="<?php echo esc_attr($main['srcset']); ?>"<?php endif; ?>
                <?php if (!empty($main['sizes'])): ?>sizes="<?php echo esc_attr($main['sizes']); ?>"<?php endif; ?>
                alt="<?php echo esc_attr($main['alt']); ?>"
            />
        </div>
        <div class="jankx-gallery-detail__thumbs">
            <?php foreach ($images as $img): ?>
                <button
                    type="button"
                    class="jankx-gallery-detail__thumb"
                    data-src="<?php echo esc_attr($img['url']); ?>"
                    data-srcset="<?php echo esc_attr($img['srcset']); ?>"
                    data-sizes="<?php echo esc_attr($img['sizes']); ?>"
                    aria-label="thumb"
                >
                    <img src="<?php echo esc_url($img['thumb']); ?>" alt="<?php echo esc_attr($img['alt']); ?>" />
                </button>
            <?php endforeach; ?>
        </div>
    </div>
    <script>
    (function(){
        var root = document.querySelector('.jankx-gallery-detail[data-post-id="<?php echo esc_js($post_id); ?>"]');
        if (!root) return;
        var main = root.querySelector('#jankx-gallery-main-<?php echo esc_js($post_id); ?>');
        var buttons = root.querySelectorAll('.jankx-gallery-detail__thumb');
        buttons.forEach(function(btn){
            btn.addEventListener('click', function(){
                var s = btn.getAttribute('data-src') || '';
                var ss = btn.getAttribute('data-srcset') || '';
                var sz = btn.getAttribute('data-sizes') || '';
                if (s) {
                    main.setAttribute('src', s);
                }
                if (ss) {
                    main.setAttribute('srcset', ss);
                } else {
                    main.removeAttribute('srcset');
                }
                if (sz) {
                    main.setAttribute('sizes', sz);
                } else {
                    main.removeAttribute('sizes');
                }
                if (main.getAttribute('loading') === 'lazy') {
                    main.removeAttribute('loading');
                }
            });
        });
    })();
    </script>
    <?php
    return ob_get_clean();
}

echo jankx_gallery_detail_render($attributes, $content, $block);
