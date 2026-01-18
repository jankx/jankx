import JankxCarousel from '../../assets/js/jankx-carousel-common';
import { initWooCommerceSorting } from '../../assets/js/jankx-woocommerce-sorting';

(function () {
    const SELECTOR = '.wp-block-jankx-dynamic-ssr-layout.view-type-layout-carousel';

    function initialize(root = document) {
        const carousels = root.querySelectorAll(SELECTOR);
        carousels.forEach(el => new JankxCarousel(el, { dotsPerPage: true }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initialize();
            initWooCommerceSorting(initialize);
        });
    } else {
        initialize();
        initWooCommerceSorting(initialize);
    }

    // Handle block preview/editor updates
    if (typeof wp !== 'undefined' && wp.data && wp.data.subscribe) {
        wp.data.subscribe(() => {
            setTimeout(initialize, 100);
        });
    }

    document.addEventListener('jankx:reinitialize-carousel', e => {
        const element = e?.detail?.element || document;
        initialize(element);
    });
})();
