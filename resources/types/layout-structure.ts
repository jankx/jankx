/**
 * Layout Structure Interface
 * 
 * Định nghĩa cấu trúc HTML cho các layout để render trong editor và frontend
 */

export interface LayoutElement {
    /** Tag name (div, ul, li, article, etc.) */
    tag: string;
    /** CSS classes */
    classes?: string[];
    /** HTML attributes */
    attributes?: Record<string, string | number | boolean>;
    /** Inline styles */
    styles?: Record<string, string | number>;
    /** Child elements */
    children?: LayoutElement[];
    /** Text content (nếu không có children) */
    text?: string;
    /** Placeholder cho dynamic content */
    placeholder?: string;
}

export interface LayoutStructure {
    /** Layout name */
    layout: string;
    /** Container element structure */
    container: LayoutElement;
    /** Item wrapper structure (cho mỗi post item) */
    itemWrapper?: LayoutElement;
    /** Placeholder structure khi không có posts */
    emptyState?: LayoutElement;
    /** Pagination wrapper structure */
    paginationWrapper?: LayoutElement;
}

export interface PostItemStructure {
    /** Featured image structure */
    featuredImage?: LayoutElement;
    /** Title structure */
    title?: LayoutElement;
    /** Date structure */
    date?: LayoutElement;
    /** Author structure */
    author?: LayoutElement;
    /** Meta wrapper (contains date and author) */
    metaWrapper?: LayoutElement;
    /** Excerpt structure */
    excerpt?: LayoutElement;
    /** Price structure (for products) */
    price?: LayoutElement;
    /** Add to cart structure (for products) */
    addToCart?: LayoutElement;
    /** Rating structure (for products) */
    rating?: LayoutElement;
    /** Content wrapper */
    contentWrapper?: LayoutElement;
}

export interface LayoutStructureConfig {
    /** Layout structures cho các layouts */
    layouts: Record<string, LayoutStructure>;
    /** Post item structure template */
    postItem: PostItemStructure;
}
