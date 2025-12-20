<?php

function jankx_gallery_detail_render($attributes = [], $content = '', $block = null)
{
    $useCurrentPost = isset($attributes['useCurrentPost']) ? (bool)$attributes['useCurrentPost'] : true;
    $imageSize = isset($attributes['imageSize']) && is_string($attributes['imageSize']) ? $attributes['imageSize'] : 'large';
    $thumbSize = isset($attributes['thumbSize']) && is_string($attributes['thumbSize']) ? $attributes['thumbSize'] : 'thumbnail';
    $aspectW = isset($attributes['aspectWidth']) && is_numeric($attributes['aspectWidth']) ? (int)$attributes['aspectWidth'] : 16;
    $aspectH = isset($attributes['aspectHeight']) && is_numeric($attributes['aspectHeight']) ? (int)$attributes['aspectHeight'] : 9;
    $tAspectW = isset($attributes['thumbAspectWidth']) && is_numeric($attributes['thumbAspectWidth']) ? (int)$attributes['thumbAspectWidth'] : 4;
    $tAspectH = isset($attributes['thumbAspectHeight']) && is_numeric($attributes['thumbAspectHeight']) ? (int)$attributes['thumbAspectHeight'] : 3;
    $showWishlist = isset($attributes['showWishlist']) ? (bool)$attributes['showWishlist'] : true;
    $showFullscreen = isset($attributes['showFullscreen']) ? (bool)$attributes['showFullscreen'] : true;
    $showNavigation = isset($attributes['showNavigation']) ? (bool)$attributes['showNavigation'] : true;
    $autoplay = isset($attributes['autoplay']) ? (bool)$attributes['autoplay'] : false;
    $autoplaySpeed = isset($attributes['autoplaySpeed']) && is_numeric($attributes['autoplaySpeed']) ? (int)$attributes['autoplaySpeed'] : 3000;
    $preset = isset($attributes['preset']) && is_string($attributes['preset']) ? $attributes['preset'] : 'classic';
    $thumbWidth = isset($attributes['thumbWidth']) && is_numeric($attributes['thumbWidth']) ? (int)$attributes['thumbWidth'] : 140;
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
    <div
        class="jankx-gallery-detail is-style-<?php echo esc_attr($preset); ?><?php echo $showNavigation ? ' has-nav' : ''; ?>"
        data-post-id="<?php echo esc_attr($post_id); ?>"
        data-autoplay="<?php echo $autoplay ? '1' : '0'; ?>"
        data-speed="<?php echo esc_attr($autoplaySpeed); ?>"
        style="--jg-ratio-w:<?php echo esc_attr($aspectW); ?>;--jg-ratio-h:<?php echo esc_attr($aspectH); ?>;--jg-thumb-ratio-w:<?php echo esc_attr($tAspectW); ?>;--jg-thumb-ratio-h:<?php echo esc_attr($tAspectH); ?>;--jg-thumb-width:<?php echo esc_attr($thumbWidth); ?>px;"
    >
        <div class="jankx-gallery-detail__main">
            <div class="jankx-gallery-detail__stage">
                <img
                    id="jankx-gallery-main-<?php echo esc_attr($post_id); ?>"
                    class="jankx-gallery-detail__image"
                    src="<?php echo esc_url($main['url']); ?>"
                    <?php if (!empty($main['srcset'])): ?>srcset="<?php echo esc_attr($main['srcset']); ?>"<?php endif; ?>
                    <?php if (!empty($main['sizes'])): ?>sizes="<?php echo esc_attr($main['sizes']); ?>"<?php endif; ?>
                    alt="<?php echo esc_attr($main['alt']); ?>"
                    loading="eager"
                />
                <?php if ($showWishlist): ?>
                <button type="button" class="jankx-gallery-detail__wishlist" aria-pressed="false" aria-label="wishlist">❤</button>
                <?php endif; ?>
                <?php if ($showFullscreen): ?>
                <button type="button" class="jankx-gallery-detail__fullscreen" aria-label="fullscreen">⤢</button>
                <?php endif; ?>
                <?php if ($showNavigation): ?>
                <button type="button" class="jankx-gallery-detail__prev" aria-label="previous">‹</button>
                <button type="button" class="jankx-gallery-detail__next" aria-label="next">›</button>
                <?php endif; ?>
            </div>
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
                    <span class="jankx-gallery-detail__thumb-inner">
                        <img src="<?php echo esc_url($img['thumb']); ?>" alt="<?php echo esc_attr($img['alt']); ?>" />
                    </span>
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
        var currentIndex = 0;
        buttons.forEach(function(btn, idx){
            if (idx === 0) btn.classList.add('is-active');
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
                buttons.forEach(function(b){ b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                currentIndex = idx;
            });
        });
        var prev = root.querySelector('.jankx-gallery-detail__prev');
        var next = root.querySelector('.jankx-gallery-detail__next');
        function goTo(index){
            var btn = buttons[index];
            if (btn) btn.click();
            var thumbs = root.querySelector('.jankx-gallery-detail__thumbs');
            if (thumbs && btn) {
                var rect = btn.getBoundingClientRect();
                var trect = thumbs.getBoundingClientRect();
                var offset = rect.left - trect.left - (trect.width/2 - rect.width/2);
                thumbs.scrollBy({ left: offset, behavior: 'smooth' });
            }
        }
        if (prev) prev.addEventListener('click', function(){
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            goTo(currentIndex);
        });
        if (next) next.addEventListener('click', function(){
            currentIndex = (currentIndex + 1) % buttons.length;
            goTo(currentIndex);
        });
        var wishlist = root.querySelector('.jankx-gallery-detail__wishlist');
        if (wishlist) wishlist.addEventListener('click', function(){
            var pressed = wishlist.getAttribute('aria-pressed') === 'true';
            wishlist.setAttribute('aria-pressed', pressed ? 'false' : 'true');
            wishlist.classList.toggle('is-active');
        });
        var fullscreen = root.querySelector('.jankx-gallery-detail__fullscreen');
        if (fullscreen) fullscreen.addEventListener('click', function(){
            var el = root.querySelector('.jankx-gallery-detail__stage');
            if (el && el.requestFullscreen) {
                el.requestFullscreen();
            }
        });
        var autoplay = root.getAttribute('data-autoplay') === '1';
        var speed = parseInt(root.getAttribute('data-speed') || '3000', 10);
        var timer = null;
        function startAutoplay(){
            if (timer) return;
            timer = setInterval(function(){
                currentIndex = (currentIndex + 1) % buttons.length;
                goTo(currentIndex);
            }, speed);
        }
        function stopAutoplay(){
            if (timer) { clearInterval(timer); timer = null; }
        }
        if (autoplay) startAutoplay();
        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', function(){ if (autoplay) startAutoplay(); });
    })();
    </script>
    <?php
    return ob_get_clean();
}

echo jankx_gallery_detail_render($attributes, $content, $block);
