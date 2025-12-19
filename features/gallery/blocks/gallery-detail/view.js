(function(){
    function init(root){
        if (!root) return;
        var main = root.querySelector('.jankx-gallery-detail__image');
        var buttons = root.querySelectorAll('.jankx-gallery-detail__thumb');
        buttons.forEach(function(btn){
            btn.addEventListener('click', function(){
                var s = btn.getAttribute('data-src') || '';
                var ss = btn.getAttribute('data-srcset') || '';
                var sz = btn.getAttribute('data-sizes') || '';
                if (s) main.setAttribute('src', s);
                if (ss) { main.setAttribute('srcset', ss); } else { main.removeAttribute('srcset'); }
                if (sz) { main.setAttribute('sizes', sz); } else { main.removeAttribute('sizes'); }
                if (main.getAttribute('loading') === 'lazy') { main.removeAttribute('loading'); }
            });
        });
    }
    var roots = document.querySelectorAll('.jankx-gallery-detail');
    roots.forEach(init);
    document.addEventListener('jankx:modal:show', function(e){
        var m = e.detail && e.detail.modalElement;
        if (!m) return;
        var r = m.querySelectorAll('.jankx-gallery-detail');
        r.forEach(init);
    });
})();

