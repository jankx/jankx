/**
 * Frontend Enhancement for WooCommerce Product Collection
 * Handle custom collection display and interactions
 */

// Frontend enhancement
document.addEventListener('DOMContentLoaded', function() {
    enhanceProductCollections();
});

function enhanceProductCollections() {
    const productCollectionBlocks = document.querySelectorAll('.wp-block-woocommerce-product-collection');

    productCollectionBlocks.forEach(block => {
        const customCategory = block.dataset.customCategory;
        const showCustomCollection = block.dataset.showCustomCollection === 'true';
        const customCollectionType = block.dataset.customCollectionType;
        const customCollectionTitle = block.dataset.customCollectionTitle;
        const customCollectionLimit = parseInt(block.dataset.customCollectionLimit) || 4;

        if (showCustomCollection && customCategory) {
            loadCustomCollection(block, {
                category: customCategory,
                type: customCollectionType,
                title: customCollectionTitle,
                limit: customCollectionLimit
            });
        }
    });
}

async function loadCustomCollection(block, options) {
    try {
        const response = await fetch('/wp-json/jankx/v1/custom-collection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': jankxAjax.nonce
            },
            body: JSON.stringify(options)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.products) {
                renderCustomCollection(block, data.data.products, options.title);
            }
        }
    } catch (error) {
        console.error('Error loading custom collection:', error);
    }
}

function renderCustomCollection(block, products, title) {
    const collectionContainer = document.createElement('div');
    collectionContainer.className = 'custom-product-collection';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title || 'Custom Collection';
    collectionContainer.appendChild(titleElement);

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products columns-4';

    products.forEach(product => {
        const productElement = createProductElement(product);
        productsGrid.appendChild(productElement);
    });

    collectionContainer.appendChild(productsGrid);
    block.appendChild(collectionContainer);
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';

    productElement.innerHTML = `
        <div class="product-inner">
            <div class="product-image">
                <a href="${product.permalink}">
                    <img src="${product.image}" alt="${product.name}" />
                </a>
            </div>
            <div class="product-details">
                <h4 class="product-title">
                    <a href="${product.permalink}">${product.name}</a>
                </h4>
                <div class="product-price">${product.price}</div>
                <div class="product-rating">${product.rating}</div>
            </div>
        </div>
    `;

    return productElement;
}

// Export for use in other files
export {
    enhanceProductCollections,
    loadCustomCollection,
    renderCustomCollection,
    createProductElement
};
