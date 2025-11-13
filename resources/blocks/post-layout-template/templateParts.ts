const WOOCOMMERCE_TEMPLATE_PART_SLUGS: Record<string, string[]> = {
    product: [
        'simple-product-add-to-cart-with-options',
        'simple-product-add-to-cart',
        'product-add-to-cart',
        'product-add-to-cart-with-options',
        'product-meta',
        'product-price',
        'product-related',
        'product-attributes',
    ],
};

export const getAllowedWooTemplatePartSlugs = (postType?: string): string[] => {
    if (!postType) {
        return [];
    }

    return WOOCOMMERCE_TEMPLATE_PART_SLUGS[postType] ?? [];
};

