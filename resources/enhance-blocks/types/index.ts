/**
 * Type definitions for Jankx Block Enhancements
 */

// Product interface
export interface Product {
    id: number;
    name: string;
    permalink: string;
    image: string;
    price: string;
    rating: string;
    description?: string;
    shortDescription?: string;
    categories?: string[];
    tags?: string[];
    attributes?: Record<string, any>;
}

// Collection options interface
export interface CollectionOptions {
    category: string;
    type: string;
    title?: string;
    limit: number;
    orderby?: string;
    order?: 'ASC' | 'DESC';
}

// Product Grid options interface
export interface ProductGridOptions {
    showQuickView: boolean;
    showWishlist: boolean;
    showCompare: boolean;
    animationEffect: string;
    hoverEffect: string;
}

// Product Carousel options interface
export interface ProductCarouselOptions {
    autoplay: boolean;
    autoplaySpeed: number;
    showArrows: boolean;
    showDots: boolean;
    infinite: boolean;
    slidesToShow: number;
    slidesToScroll: number;
    responsive: boolean;
    carouselEffect: string;
}

// API Response interface
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Block attributes interface
export interface BlockAttributes {
    [key: string]: any;
}

// Filter settings interface
export interface FilterSettings {
    name: string;
    namespace: string;
    priority?: number;
    acceptedArgs?: number;
}

// Frontend enhancement interface
export interface FrontendEnhancement {
    selector: string;
    callback: (element: Element, options?: any) => void;
    options?: any;
}

// Animation effect types
export type AnimationEffect = 'none' | 'fade-in' | 'slide-up' | 'scale' | 'rotate';

// Hover effect types
export type HoverEffect = 'none' | 'zoom' | 'slide' | 'flip' | 'shine';

// Carousel effect types
export type CarouselEffect = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';

// Collection type types
export type CollectionType = 'featured' | 'on-sale' | 'best-sellers' | 'new-arrivals' | 'top-rated' | 'recently-viewed';

// Product category interface
export interface ProductCategory {
    label: string;
    value: string;
    slug?: string;
    count?: number;
}

// Collection type option interface
export interface CollectionTypeOption {
    label: string;
    value: CollectionType;
}

// Animation option interface
export interface AnimationOption {
    label: string;
    value: AnimationEffect;
}

// Hover option interface
export interface HoverOption {
    label: string;
    value: HoverEffect;
}

// Carousel option interface
export interface CarouselOption {
    label: string;
    value: CarouselEffect;
}

// Event handler interface
export interface EventHandler {
    (event: Event): void;
}

// DOM element interface
export interface DOMElement extends Element {
    dataset: DOMStringMap;
}

// AJAX request interface
export interface AjaxRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

// AJAX response interface
export interface AjaxResponse<T = any> {
    ok: boolean;
    status: number;
    statusText: string;
    data?: T;
    error?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
