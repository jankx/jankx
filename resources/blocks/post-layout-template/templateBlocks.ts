const BASE_TEMPLATE_BLOCKS: string[] = [
    'core/template-part',
    'core/post-title',
    'core/post-author',
    'core/post-author-name',
    'core/post-date',
    'core/post-featured-image',
    'core/post-excerpt',
    'core/post-terms',
    'core/post-content',
    'core/read-more',
    'core/buttons',
    'core/button',
    'core/paragraph',
    'core/heading',
    'core/image',
    'core/list',
    'core/separator',
    'core/spacer',
    'core/group',
    'core/columns',
    'core/column',
    'core/media-text',
    'core/image',
    'core/cover',
    'core/gallery',
];

const PRODUCT_TEMPLATE_BLOCKS: string[] = [
    'woocommerce/product-title',
    'woocommerce/product-price',
    'woocommerce/product-rating',
    'woocommerce/product-summary',
    'woocommerce/product-details',
    'woocommerce/product-content',
    'woocommerce/product-gallery',
    'woocommerce/product-image',
    'woocommerce/product-images',
    'woocommerce/product-stock-indicator',
    'woocommerce/product-meta',
    'woocommerce/product-add-to-cart',
    'woocommerce/product-sku',
    'woocommerce/product-sale-badge',
];

export const getAllowedTemplateBlocks = (postType?: string): string[] => {
    if (postType === 'product') {
        return [...new Set([...BASE_TEMPLATE_BLOCKS, ...PRODUCT_TEMPLATE_BLOCKS])];
    }

    return BASE_TEMPLATE_BLOCKS;
};

