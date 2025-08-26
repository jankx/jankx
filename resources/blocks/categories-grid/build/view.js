/******/ (() => { // webpackBootstrap
/*!****************************************!*\
  !*** ./blocks/categories-grid/view.js ***!
  \****************************************/
document.addEventListener('DOMContentLoaded', function () {
  const categoryGrids = document.querySelectorAll('.jankx-categories-grid');
  categoryGrids.forEach(grid => {
    const categoryItems = grid.querySelectorAll('.jankx-category-item');
    const productsGrid = grid.querySelector('.jankx-products-grid');
    if (!productsGrid) return;
    categoryItems.forEach(item => {
      const categoryId = item.dataset.categoryId;
      const categoryName = item.dataset.categoryName;
      if (!categoryId) return;
      item.addEventListener('click', async function (e) {
        e.preventDefault();

        // Show loading state
        productsGrid.innerHTML = '<div class="jankx-loading">Loading products...</div>';
        productsGrid.style.display = 'block';
        try {
          const response = await fetch(jankx_ajax.ajax_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              action: 'jankx_get_category_products',
              nonce: jankx_ajax.nonce,
              category_id: categoryId
            })
          });
          const data = await response.json();
          if (data.success) {
            productsGrid.innerHTML = data.data.products.map(product => `
                <div class="jankx-product-card">
                  <img src="${product.image}" alt="${product.title}" />
                  <h3>${product.title}</h3>
                  <div class="jankx-price">${product.price}</div>
                  <a href="${product.link}" class="jankx-view-product">View Product</a>
                </div>
              `).join('');

            // Update category links
            grid.querySelectorAll('.jankx-category-link a').forEach(el => {
              el.setAttribute('href', data.data.category_link);
            });
          } else {
            productsGrid.innerHTML = '<div class="jankx-error">No products found</div>';
          }
        } catch (error) {
          console.error('Fetch error:', error);
          productsGrid.innerHTML = '<div class="jankx-error">Error loading products</div>';
        }
      });
    });

    // Close modal functionality
    const closeButtons = grid.querySelectorAll('.jankx-close-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', function () {
        productsGrid.style.display = 'none';
      });
    });

    // ESC key to close
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && productsGrid.style.display === 'block') {
        productsGrid.style.display = 'none';
      }
    });
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map