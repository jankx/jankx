/**
 * Shared logic for WooCommerce catalog sorting integration with dynamic layout blocks.
 * 
 * @param {Function} initializeCallback Callback to re-initialize block-specific features (like carousels)
 */
export function initWooCommerceSorting(initializeCallback) {
    // If already initialized, just update the callback if needed (or skip)
    if (window._jankxSortingInitialized) return;

    const sortingSelect = document.querySelector('.woocommerce-ordering .orderby');
    if (!sortingSelect) return;

    // Only intercept if there are Jankx dynamic blocks on the page
    const blocks = document.querySelectorAll('.wp-block-jankx-dynamic-data-layout, .wp-block-jankx-dynamic-ssr-layout');
    if (blocks.length === 0) return;

    window._jankxSortingInitialized = true;

    // WooCommerce usually submits the form on 'change'.
    // We intercept the change event to perform AJAX update instead of full page reload.
    sortingSelect.addEventListener('change', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const orderBy = this.value;
        updateDynamicBlocks(orderBy, initializeCallback);

        // Update URL without reload to keep state consistent for browser back/forward
        const url = new URL(window.location.href);
        url.searchParams.set('orderby', orderBy);
        window.history.pushState({}, '', url);

        return false;
    });

    // Also listen to the form submit just in case
    const form = sortingSelect.closest('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const orderBy = formData.get('orderby');
            updateDynamicBlocks(orderBy, initializeCallback);
        });
    }
}

/**
 * Update all dynamic layout blocks on the page
 * 
 * @param {string} orderBy The selection sort order
 * @param {Function} initializeCallback
 */
export function updateDynamicBlocks(orderBy, initializeCallback) {
    const blocks = document.querySelectorAll('.wp-block-jankx-dynamic-data-layout, .wp-block-jankx-dynamic-ssr-layout');

    blocks.forEach(block => {
        const isSsr = block.classList.contains('wp-block-jankx-dynamic-ssr-layout');
        const action = isSsr ? 'jankx_dynamic_ssr_layout_filter' : 'jankx_dynamic_data_layout_filter';

        // Getting block attributes from data attributes
        const blockId = block.dataset.blockId || block.dataset.queryId;
        const postId = block.dataset.postId || (window.jankx && window.jankx.post_id) || 0;

        if (!blockId) return;

        block.classList.add('is-loading');

        const data = new FormData();
        data.append('action', action);
        data.append('block_id', blockId);
        data.append('post_id', postId);

        // Construct filters with new orderby
        const filters = {
            orderby: orderBy
        };
        data.append('filters', JSON.stringify(filters));

        // Resolve AJAX URL and Nonce from localized data
        let ajaxUrl = '/wp-admin/admin-ajax.php';
        let nonce = '';

        if (isSsr) {
            if (window.jankxDynamicSsrLayoutView) {
                ajaxUrl = window.jankxDynamicSsrLayoutView.ajaxUrl || ajaxUrl;
                nonce = window.jankxDynamicSsrLayoutView.nonce;
            }
        } else {
            if (window.jankxDynamicDataLayoutView) {
                ajaxUrl = window.jankxDynamicDataLayoutView.ajaxUrl || ajaxUrl;
                nonce = window.jankxDynamicDataLayoutView.nonce;
            }
        }

        // Global fallbacks if block-specific localization is missing
        if (!nonce) {
            nonce = (window.jankx && window.jankx.nonce) || '';
        }

        data.append('nonce', nonce);

        fetch(ajaxUrl, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data.html) {
                    const temp = document.createElement('div');
                    temp.innerHTML = res.data.html;
                    const newBlock = temp.firstElementChild;

                    if (newBlock) {
                        block.replaceWith(newBlock);

                        // Re-initialize features
                        if (typeof initializeCallback === 'function') {
                            initializeCallback(newBlock);
                        }

                        // Standard re-init events
                        document.dispatchEvent(new CustomEvent('jankx:reinitialize-carousel', {
                            detail: { element: newBlock }
                        }));

                        if (window.initCarousel) {
                            window.initCarousel(newBlock);
                        }
                    }
                }
            })
            .catch(err => console.error('Jankx Dynamic Layout AJAX error:', err))
            .finally(() => {
                const currentBlock = document.querySelector(`[data-block-id="${blockId}"]`);
                if (currentBlock) currentBlock.classList.remove('is-loading');
            });
    });
}
