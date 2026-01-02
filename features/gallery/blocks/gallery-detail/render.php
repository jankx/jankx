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
    if (is_object($block) && isset($block->context) && is_array($block->context) && !empty($block->context['postId'])) {
        $post_id = (int)$block->context['postId'];
    }
    if ($useCurrentPost) {
        if (is_singular() && have_posts()) {
            the_post();
            $post_id = get_the_ID();
            wp_reset_postdata();
        } else {
            global $post;
            if (!$post_id) {
                $post_id = $post ? $post->ID : 0;
            }
        }
    }
    $isEditorRequest = (defined('REST_REQUEST') && REST_REQUEST) || (function_exists('wp_is_block_editor') && wp_is_block_editor());
    if (!$post_id && !$isEditorRequest) {
        return '';
    }
    $images = [];
    if ($post_id) {
        $showFeaturedImage = isset($attributes['showFeaturedImage']) ? (bool)$attributes['showFeaturedImage'] : true;
        $images = \Jankx\Features\Gallery\GalleryServiceProvider::getGallery($post_id, $imageSize, $thumbSize, $showFeaturedImage);
    }
    if (empty($images) && $isEditorRequest) {
        $attachments = get_posts([
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'posts_per_page' => 6,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
        foreach ($attachments as $att) {
            $url = wp_get_attachment_image_url($att->ID, $imageSize);
            $thumb = wp_get_attachment_image_url($att->ID, $thumbSize);
            if ($url) {
                $images[] = [
                    'id' => (int)$att->ID,
                    'url' => $url,
                    'srcset' => wp_get_attachment_image_srcset($att->ID, $imageSize) ?: '',
                    'sizes' => wp_get_attachment_image_sizes($att->ID, $imageSize) ?: '',
                    'thumb' => $thumb ?: $url,
                    'alt' => get_post_meta($att->ID, '_wp_attachment_image_alt', true),
                ];
            }
        }
        if (empty($images)) {
            $placeholders = [];
            for ($i = 0; $i < 5; $i++) {
                $svgMain = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="24">Gallery Preview</text></svg>';
                $svgThumb = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">Thumb</text></svg>';
                $images[] = [
                    'id' => 0,
                    'url' => 'data:image/svg+xml;utf8,' . rawurlencode($svgMain),
                    'srcset' => '',
                    'sizes' => '',
                    'thumb' => 'data:image/svg+xml;utf8,' . rawurlencode($svgThumb),
                    'alt' => 'Placeholder',
                ];
            }
        }
    }
    if (empty($images)) {
        return '';
    }
    if ($preset === 'zigzag') {
        ?>
        <div class="jankx-gallery-detail is-style-<?php echo esc_attr($preset); ?>" data-post-id="<?php echo esc_attr($post_id); ?>">
            <?php foreach ($images as $img): ?>
                <?php 
                $imgSize = (!empty($img['id']) && is_numeric($img['id'])) ? wp_get_attachment_image_src((int)$img['id'], $imageSize) : null;
                $imgW = is_array($imgSize) && isset($imgSize[1]) ? (int)$imgSize[1] : null;
                $imgH = is_array($imgSize) && isset($imgSize[2]) ? (int)$imgSize[2] : null;
                ?>
                <div class="jankx-gallery-item">
                    <img
                        class="ls-no-lazy"
                        src="<?php echo esc_url($img['url']); ?>"
                        data-no-lazy="1"
                        <?php if (!empty($img['srcset'])): ?>srcset="<?php echo esc_attr($img['srcset']); ?>"<?php endif; ?>
                        <?php if (!empty($img['sizes'])): ?>sizes="<?php echo esc_attr($img['sizes']); ?>"<?php endif; ?>
                        <?php if ($imgW): ?>width="<?php echo esc_attr($imgW); ?>"<?php endif; ?>
                        <?php if ($imgH): ?>height="<?php echo esc_attr($imgH); ?>"<?php endif; ?>
                        alt="<?php echo esc_attr($img['alt']); ?>"
                        loading="lazy"
                        decoding="async"
                    />
                    <?php if (isset($img['caption']) && $img['caption']): ?>
                        <div class="jankx-gallery-caption"><?php echo esc_html($img['caption']); ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    $main = $images[0];
    $is_single = count($images) <= 1;
    if ($is_single) {
        $showNavigation = false;
        $autoplay = false;
    }
    $mainSize = (!empty($main['id']) && is_numeric($main['id'])) ? wp_get_attachment_image_src((int)$main['id'], $imageSize) : null;
    $mainW = is_array($mainSize) && isset($mainSize[1]) ? (int)$mainSize[1] : null;
    $mainH = is_array($mainSize) && isset($mainSize[2]) ? (int)$mainSize[2] : null;
    ob_start();
    ?>
    <div
        class="jankx-gallery-detail is-style-<?php echo esc_attr($preset); ?><?php echo $showNavigation ? ' has-nav' : ''; ?><?php echo $is_single ? ' is-single' : ''; ?>"
        data-post-id="<?php echo esc_attr($post_id ?: 'preview'); ?>"
        data-autoplay="<?php echo $autoplay ? '1' : '0'; ?>"
        data-speed="<?php echo esc_attr($autoplaySpeed); ?>"
        style="--jg-ratio-w:<?php echo esc_attr($aspectW); ?>;--jg-ratio-h:<?php echo esc_attr($aspectH); ?>;--jg-thumb-ratio-w:<?php echo esc_attr($tAspectW); ?>;--jg-thumb-ratio-h:<?php echo esc_attr($tAspectH); ?>;--jg-thumb-width:<?php echo esc_attr($thumbWidth); ?>px;"
    >
        <div class="jankx-gallery-detail__main">
            <div class="jankx-gallery-detail__stage">
                <img
                    id="jankx-gallery-main-<?php echo esc_attr($post_id ?: 'preview'); ?>"
                    class="jankx-gallery-detail__image ls-no-lazy"
                    src="<?php echo esc_url($main['url']); ?>"
                    data-no-lazy="1"
                    <?php if (!empty($main['srcset'])): ?>srcset="<?php echo esc_attr($main['srcset']); ?>"<?php endif; ?>
                    <?php if (!empty($main['sizes'])): ?>sizes="<?php echo esc_attr($main['sizes']); ?>"<?php endif; ?>
                    <?php if ($mainW): ?>width="<?php echo esc_attr($mainW); ?>"<?php endif; ?>
                    <?php if ($mainH): ?>height="<?php echo esc_attr($mainH); ?>"<?php endif; ?>
                    alt="<?php echo esc_attr($main['alt']); ?>"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
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
        <?php if (!$is_single): ?>
            <div class="jankx-gallery-detail__thumbs">
                <?php foreach ($images as $img): ?>
                    <?php $tSize = (!empty($img['id']) && is_numeric($img['id'])) ? wp_get_attachment_image_src((int)$img['id'], $thumbSize) : null; ?>
                    <?php $tW = is_array($tSize) && isset($tSize[1]) ? (int)$tSize[1] : null; ?>
                    <?php $tH = is_array($tSize) && isset($tSize[2]) ? (int)$tSize[2] : null; ?>
                    <button
                        type="button"
                        class="jankx-gallery-detail__thumb"
                        data-src="<?php echo esc_attr($img['url']); ?>"
                        data-srcset="<?php echo esc_attr($img['srcset']); ?>"
                        data-sizes="<?php echo esc_attr($img['sizes']); ?>"
                        aria-label="thumb"
                    >
                        <span class="jankx-gallery-detail__thumb-inner">
                            <img src="<?php echo esc_url($img['thumb']); ?>" <?php if ($tW): ?>width="<?php echo esc_attr($tW); ?>"<?php endif; ?> <?php if ($tH): ?>height="<?php echo esc_attr($tH); ?>"<?php endif; ?> alt="<?php echo esc_attr($img['alt']); ?>" data-no-lazy="1" class="ls-no-lazy" />
                        </span>
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    <script>
    (function(){
        var root = document.querySelector('.jankx-gallery-detail[data-post-id="<?php echo esc_js($post_id); ?>"]');
        if (!root) return;
        var main = root.querySelector('#jankx-gallery-main-<?php echo esc_js($post_id); ?>');
        var buttons = root.querySelectorAll('.jankx-gallery-detail__thumb');
        var total = buttons.length;
        var currentIndex = 0;
        if (total > 1) {
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
        }
        var prev = root.querySelector('.jankx-gallery-detail__prev');
        var next = root.querySelector('.jankx-gallery-detail__next');
        if (total > 1) {
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
        } else {
            if (prev) prev.remove();
            if (next) next.remove();
        }
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
        var autoplay = total > 1 && root.getAttribute('data-autoplay') === '1';
        var speed = parseInt(root.getAttribute('data-speed') || '3000', 10);
        var timer = null;
        function startAutoplay(){
            if (timer || !autoplay) return;
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
