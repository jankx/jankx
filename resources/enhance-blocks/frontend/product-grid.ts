/**
 * Frontend Enhancement for WooCommerce Product Grid
 * Handle product grid interactions and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceProductGrids();
});

function enhanceProductGrids() {
    const productGridBlocks = document.querySelectorAll('.wp-block-woocommerce-product-grid');

    productGridBlocks.forEach(block => {
        const showQuickView = block.dataset.showQuickView === 'true';
        const showWishlist = block.dataset.showWishlist === 'true';
        const showCompare = block.dataset.showCompare === 'true';
        const animationEffect = block.dataset.animationEffect;
        const hoverEffect = block.dataset.hoverEffect;

        // Apply animation effects
        if (animationEffect && animationEffect !== 'none') {
            applyAnimationEffect(block, animationEffect);
        }

        // Apply hover effects
        if (hoverEffect && hoverEffect !== 'none') {
            applyHoverEffect(block, hoverEffect);
        }

        // Add quick view functionality
        if (showQuickView) {
            addQuickViewFunctionality(block);
        }

        // Add wishlist functionality
        if (showWishlist) {
            addWishlistFunctionality(block);
        }

        // Add compare functionality
        if (showCompare) {
            addCompareFunctionality(block);
        }
    });
}

function applyAnimationEffect(block, effect) {
    const products = block.querySelectorAll('.product');

    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = getInitialTransform(effect);
        product.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'none';
        }, index * 100);
    });
}

function getInitialTransform(effect) {
    switch (effect) {
        case 'fade-in':
            return 'translateY(20px)';
        case 'slide-up':
            return 'translateY(50px)';
        case 'scale':
            return 'scale(0.8)';
        case 'rotate':
            return 'rotateY(90deg)';
        default:
            return 'none';
    }
}

function applyHoverEffect(block, effect) {
    const products = block.querySelectorAll('.product');

    products.forEach(product => {
        product.classList.add(`hover-effect-${effect}`);

        switch (effect) {
            case 'zoom':
                addZoomEffect(product);
                break;
            case 'slide':
                addSlideEffect(product);
                break;
            case 'flip':
                addFlipEffect(product);
                break;
            case 'shine':
                addShineEffect(product);
                break;
        }
    });
}

function addZoomEffect(product) {
    const image = product.querySelector('.product-image img');
    if (image) {
        image.style.transition = 'transform 0.3s ease';
        product.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)';
        });
        product.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    }
}

function addSlideEffect(product) {
    const image = product.querySelector('.product-image img');
    if (image) {
        image.style.transition = 'transform 0.3s ease';
        product.addEventListener('mouseenter', () => {
            image.style.transform = 'translateX(-10px)';
        });
        product.addEventListener('mouseleave', () => {
            image.style.transform = 'translateX(0)';
        });
    }
}

function addFlipEffect(product) {
    const image = product.querySelector('.product-image img');
    if (image) {
        image.style.transition = 'transform 0.6s ease';
        product.addEventListener('mouseenter', () => {
            image.style.transform = 'rotateY(180deg)';
        });
        product.addEventListener('mouseleave', () => {
            image.style.transform = 'rotateY(0deg)';
        });
    }
}

function addShineEffect(product) {
    const image = product.querySelector('.product-image');
    if (image) {
        const shine = document.createElement('div');
        shine.className = 'shine-effect';
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s ease;
            pointer-events: none;
        `;

        image.style.position = 'relative';
        image.style.overflow = 'hidden';
        image.appendChild(shine);

        product.addEventListener('mouseenter', () => {
            shine.style.left = '100%';
        });
        product.addEventListener('mouseleave', () => {
            shine.style.left = '-100%';
        });
    }
}

function addQuickViewFunctionality(block) {
    const products = block.querySelectorAll('.product');

    products.forEach(product => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = 'Quick View';
        quickViewBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #007cba;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
        `;

        const productImage = product.querySelector('.product-image');
        if (productImage) {
            productImage.style.position = 'relative';
            productImage.appendChild(quickViewBtn);

            product.addEventListener('mouseenter', () => {
                quickViewBtn.style.opacity = '1';
            });
            product.addEventListener('mouseleave', () => {
                quickViewBtn.style.opacity = '0';
            });

            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = product.dataset.productId;
                openQuickView(productId);
            });
        }
    });
}

function addWishlistFunctionality(block) {
    const products = block.querySelectorAll('.product');

    products.forEach(product => {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '♥';
        wishlistBtn.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255,255,255,0.9);
            color: #666;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10;
        `;

        const productImage = product.querySelector('.product-image');
        if (productImage) {
            productImage.style.position = 'relative';
            productImage.appendChild(wishlistBtn);

            product.addEventListener('mouseenter', () => {
                wishlistBtn.style.opacity = '1';
            });
            product.addEventListener('mouseleave', () => {
                wishlistBtn.style.opacity = '0';
            });

            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = product.dataset.productId;
                toggleWishlist(productId, wishlistBtn);
            });
        }
    });
}

function addCompareFunctionality(block) {
    const products = block.querySelectorAll('.product');

    products.forEach(product => {
        const compareBtn = document.createElement('button');
        compareBtn.className = 'compare-btn';
        compareBtn.innerHTML = 'Compare';
        compareBtn.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
            font-size: 12px;
        `;

        const productImage = product.querySelector('.product-image');
        if (productImage) {
            productImage.style.position = 'relative';
            productImage.appendChild(compareBtn);

            product.addEventListener('mouseenter', () => {
                compareBtn.style.opacity = '1';
            });
            product.addEventListener('mouseleave', () => {
                compareBtn.style.opacity = '0';
            });

            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = product.dataset.productId;
                addToCompare(productId, compareBtn);
            });
        }
    });
}

function openQuickView(productId) {
    // Implement quick view modal
    console.log('Opening quick view for product:', productId);
    // You can implement a modal or popup here
}

function toggleWishlist(productId, button) {
    // Implement wishlist functionality
    console.log('Toggling wishlist for product:', productId);
    button.style.color = button.style.color === 'red' ? '#666' : 'red';
    // You can implement AJAX call to save to wishlist
}

function addToCompare(productId, button) {
    // Implement compare functionality
    console.log('Adding to compare:', productId);
    button.innerHTML = 'Added';
    button.style.background = '#6c757d';
    // You can implement AJAX call to add to compare list
}

// Export for use in other files
export {
    enhanceProductGrids,
    applyAnimationEffect,
    applyHoverEffect,
    addQuickViewFunctionality,
    addWishlistFunctionality,
    addCompareFunctionality
};
