(function(){
    function init(root){
        if (!root) return;
        var main = root.querySelector('.jankx-gallery-detail__image');
        var buttons = Array.prototype.slice.call(root.querySelectorAll('.jankx-gallery-detail__thumb'));
        var thumbs = root.querySelector('.jankx-gallery-detail__thumbs');
        var prev = root.querySelector('.jankx-gallery-detail__prev');
        var next = root.querySelector('.jankx-gallery-detail__next');
        var wishlist = root.querySelector('.jankx-gallery-detail__wishlist');
        var fullscreen = root.querySelector('.jankx-gallery-detail__fullscreen');
        var currentIndex = 0;
        function selectIndex(idx){
            var btn = buttons[idx];
            if (!btn) return;
            var s = btn.getAttribute('data-src') || '';
            var ss = btn.getAttribute('data-srcset') || '';
            var sz = btn.getAttribute('data-sizes') || '';
            if (s) main.setAttribute('src', s);
            if (ss) { main.setAttribute('srcset', ss); } else { main.removeAttribute('srcset'); }
            if (sz) { main.setAttribute('sizes', sz); } else { main.removeAttribute('sizes'); }
            if (main.getAttribute('loading') === 'lazy') { main.removeAttribute('loading'); }
            buttons.forEach(function(b){ b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            currentIndex = idx;
            if (thumbs) {
                var rect = btn.getBoundingClientRect();
                var trect = thumbs.getBoundingClientRect();
                var offset = rect.left - trect.left - (trect.width/2 - rect.width/2);
                thumbs.scrollBy({ left: offset, behavior: 'smooth' });
            }
        }
        buttons.forEach(function(btn, idx){
            if (idx === 0) btn.classList.add('is-active');
            btn.addEventListener('click', function(){ selectIndex(idx); });
        });
        if (prev) prev.addEventListener('click', function(){
            selectIndex((currentIndex - 1 + buttons.length) % buttons.length);
        });
        if (next) next.addEventListener('click', function(){
            selectIndex((currentIndex + 1) % buttons.length);
        });
        if (wishlist) wishlist.addEventListener('click', function(){
            var pressed = wishlist.getAttribute('aria-pressed') === 'true';
            wishlist.setAttribute('aria-pressed', pressed ? 'false' : 'true');
            wishlist.classList.toggle('is-active');
        });
        if (fullscreen) fullscreen.addEventListener('click', function(){
            var el = root.querySelector('.jankx-gallery-detail__stage');
            if (el && el.requestFullscreen) el.requestFullscreen();
        });
        var autoplay = root.getAttribute('data-autoplay') === '1';
        var speed = parseInt(root.getAttribute('data-speed') || '3000', 10);
        var timer = null;
        function startAutoplay(){
            if (timer) return;
            timer = setInterval(function(){
                selectIndex((currentIndex + 1) % buttons.length);
            }, speed);
        }
        function stopAutoplay(){
            if (timer) { clearInterval(timer); timer = null; }
        }
        if (autoplay) startAutoplay();
        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', function(){ if (autoplay) startAutoplay(); });
    }
    var roots = document.querySelectorAll('.jankx-gallery-detail');
    Array.prototype.forEach.call(roots, init);
    document.addEventListener('jankx:modal:show', function(e){
        var m = e.detail && e.detail.modalElement;
        if (!m) return;
        var r = m.querySelectorAll('.jankx-gallery-detail');
        Array.prototype.forEach.call(r, init);
    });
})();
