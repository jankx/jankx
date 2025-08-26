/**
 * Scattered Product List Frontend Script
 * Initializes masonry layout and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    const scatteredLists = document.querySelectorAll('.jankx-scattered-product-list');

    scatteredLists.forEach(function(list) {
        if (!list) return;

        const productsGrid = list.querySelector('.jankx-products-grid');
        if (!productsGrid) return;

        // Get options from data attributes
        const columns = parseInt(list.dataset.columns) || 4;
        const gap = parseInt(list.dataset.gap) || 20;
        const masonry = list.dataset.masonry === 'true';
        const animation = list.dataset.animation || 'fade-in';

        // Apply CSS custom properties for grid
        productsGrid.style.setProperty('--columns', columns);
        productsGrid.style.setProperty('--gap', gap + 'px');

        // Initialize masonry layout if enabled
        if (masonry) {
            initializeMasonry(productsGrid, columns, gap);
        }

        // Initialize animations
        initializeAnimations(list, animation);
    });
});

/**
 * Initialize masonry layout
 */
function initializeMasonry(grid, columns, gap) {
    const items = grid.querySelectorAll('.jankx-product-item');
    if (items.length === 0) return;

    // Set grid columns
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gap = gap + 'px';

    // Add masonry class for CSS columns fallback
    grid.classList.add('masonry-layout');

    // Handle responsive columns
    const breakpoints = {
        320: Math.min(1, columns),
        768: Math.min(2, columns),
        1024: columns
    };

    function updateColumns() {
        const width = window.innerWidth;
        let currentColumns = 1;

        if (width >= 1024) {
            currentColumns = breakpoints[1024];
        } else if (width >= 768) {
            currentColumns = breakpoints[768];
        } else {
            currentColumns = breakpoints[320];
        }

        grid.style.gridTemplateColumns = `repeat(${currentColumns}, 1fr)`;
    }

    // Initial update
    updateColumns();

    // Update on resize
    window.addEventListener('resize', updateColumns);
}

/**
 * Initialize animations
 */
function initializeAnimations(container, animationType) {
    const items = container.querySelectorAll('.jankx-product-item');
    if (items.length === 0) return;

    // Add animation classes
    items.forEach(function(item, index) {
        item.classList.add(`animate-${animationType}`);

        // Stagger animation delays
        if (animationType !== 'none') {
            item.style.animationDelay = (index * 0.1) + 's';
        }
    });

    // Intersection Observer for scroll-triggered animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        items.forEach(function(item) {
            observer.observe(item);
        });
    }
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const scatteredLists = document.querySelectorAll('.jankx-scattered-product-list');
    scatteredLists.forEach(function(list) {
        const productsGrid = list.querySelector('.jankx-products-grid');
        if (productsGrid && productsGrid.classList.contains('masonry-layout')) {
            const columns = parseInt(list.dataset.columns) || 4;
            const gap = parseInt(list.dataset.gap) || 20;
            initializeMasonry(productsGrid, columns, gap);
        }
    });
});
