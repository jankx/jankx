/**
 * Layout Renderer Utility
 * 
 * Render HTML từ layout structure được định nghĩa từ PHP
 */

import type { LayoutElement, LayoutStructure, PostItemStructure } from '../../types/layout-structure';

/**
 * Render một element từ structure
 */
function renderElement(element: LayoutElement, context?: Record<string, any>): string {
    const tag = element.tag || 'div';
    const classes = element.classes || [];
    const attributes = element.attributes || {};
    const styles = element.styles || {};
    const text = element.text;
    const placeholder = element.placeholder;
    const children = element.children;

    // Build attributes string
    const attrs: string[] = [];
    
    if (classes.length > 0) {
        attrs.push(`class="${classes.join(' ')}"`);
    }

    // Add data attributes and other attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (value === true) {
            attrs.push(key);
        } else if (value !== false && value !== null && value !== undefined) {
            attrs.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`);
        }
    });

    // Add inline styles
    if (Object.keys(styles).length > 0) {
        const styleString = Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
        attrs.push(`style="${styleString}"`);
    }

    const attrsString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

    // Handle placeholder first - if element has placeholder and context provides value
    // This takes priority over children/text
    if (placeholder && context) {
        const placeholderValue = context[placeholder];
        if (placeholderValue !== undefined) {
            // If we have children, render them first then replace placeholder in result
            if (children && children.length > 0) {
                let childrenHtml = children.map(child => renderElement(child, context)).join('');
                // Replace placeholder pattern in rendered children HTML
                childrenHtml = childrenHtml.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), placeholderValue);
                return `<${tag}${attrsString}>${childrenHtml}</${tag}>`;
            }
            // No children, use placeholder value directly
            return `<${tag}${attrsString}>${placeholderValue}</${tag}>`;
        }
    }

    // Render children if no placeholder or placeholder not in context
    let childrenHtml = '';
    if (children && children.length > 0) {
        childrenHtml = children.map(child => renderElement(child, context)).join('');
    }

    // If we have children HTML, use it
    if (childrenHtml) {
        return `<${tag}${attrsString}>${childrenHtml}</${tag}>`;
    }

    if (text !== undefined) {
        return `<${tag}${attrsString}>${text}</${tag}>`;
    }

    // Self-closing tags
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    if (selfClosingTags.includes(tag.toLowerCase())) {
        return `<${tag}${attrsString} />`;
    }

    return `<${tag}${attrsString}></${tag}>`;
}

/**
 * Render post item từ structure và post data
 */
export function renderPostItem(
    postItemStructure: PostItemStructure,
    postData: Record<string, any>,
    options: Record<string, any> = {}
): string {
    const elements: string[] = [];
    const { 
        showFeaturedImage = true,
        showTitle = true,
        showDate = true,
        showAuthor = false,
        showExcerpt = true,
        showPrice = true,
        showAddToCart = true,
        showRating = false,
        thumbnailPosition = 'top',
        imageRatio = '',
    } = options;

    // Build content wrapper children
    const contentChildren: string[] = [];

    // Featured image
    if (showFeaturedImage && postItemStructure.featuredImage) {
        const imageContext: Record<string, any> = {
            'featured-image': postData.featuredImage || '',
        };
        const imageHtml = renderElement(postItemStructure.featuredImage, imageContext);
        elements.push(imageHtml);
    }

    // Title
    if (showTitle && postItemStructure.title) {
        // Find the innermost element with placeholder and set context
        const titleElement = postItemStructure.title;
        const titleContext: Record<string, any> = {
            'post-title': postData.title || 'Post Title',
        };
        
        // Render title with context for placeholder replacement
        const titleHtml = renderElement(titleElement, titleContext);
        
        if (thumbnailPosition === 'top' || thumbnailPosition === 'bottom') {
            contentChildren.push(titleHtml);
        } else {
            elements.push(titleHtml);
        }
    }

    // Date and Author - wrap in post-meta if either is shown
    if ((showDate || showAuthor) && (postItemStructure.date || postItemStructure.author)) {
        const metaChildren: string[] = [];
        
        if (showDate && postItemStructure.date) {
            const dateContext: Record<string, any> = {
                'post-date': postData.date || '',
            };
            metaChildren.push(renderElement(postItemStructure.date, dateContext));
        }

        if (showAuthor && postItemStructure.author) {
            const authorContext: Record<string, any> = {
                'post-author': postData.author || '',
            };
            metaChildren.push(renderElement(postItemStructure.author, authorContext));
        }

        // Wrap in post-meta div if we have metaWrapper structure
        if (postItemStructure.metaWrapper && metaChildren.length > 0) {
            const metaWrapper: LayoutElement = {
                ...postItemStructure.metaWrapper,
                text: metaChildren.join(''),
            };
            contentChildren.push(renderElement(metaWrapper));
        } else if (metaChildren.length > 0) {
            contentChildren.push(...metaChildren);
        }
    }

    // Excerpt
    if (showExcerpt && postItemStructure.excerpt) {
        const excerptContext: Record<string, any> = {
            'post-excerpt': postData.excerpt || '',
        };
        contentChildren.push(renderElement(postItemStructure.excerpt, excerptContext));
    }

    // Price (for products)
    if (showPrice && postItemStructure.price) {
        const priceContext: Record<string, any> = {
            'product-price': postData.price || '',
        };
        contentChildren.push(renderElement(postItemStructure.price, priceContext));
    }

    // Add to cart (for products)
    if (showAddToCart && postItemStructure.addToCart) {
        const buttonContext: Record<string, any> = {
            'product-button': postData.addToCart || '',
        };
        contentChildren.push(renderElement(postItemStructure.addToCart, buttonContext));
    }

    // Rating (for products)
    if (showRating && postItemStructure.rating) {
        const ratingContext: Record<string, any> = {
            'product-rating': postData.rating || '',
        };
        contentChildren.push(renderElement(postItemStructure.rating, ratingContext));
    }

    // Content wrapper
    if (postItemStructure.contentWrapper && contentChildren.length > 0) {
        const contentWrapperHtml = contentChildren.join('');
        const contentWrapper: LayoutElement = {
            ...postItemStructure.contentWrapper,
            text: contentWrapperHtml,
        };
        elements.push(renderElement(contentWrapper));
    } else if (contentChildren.length > 0) {
        elements.push(...contentChildren);
    }

    return elements.join('');
}

/**
 * Render layout từ structure và posts data
 */
export function renderLayout(
    structure: LayoutStructure,
    posts: Array<Record<string, any>>,
    postItemStructure: PostItemStructure,
    options: Record<string, any> = {}
): string {
    const { itemWrapper, container, emptyState } = structure;
    const isCarousel = structure.layout === 'carousel';

    if (posts.length === 0 && emptyState) {
        return renderElement(emptyState);
    }

    const itemsHtml = posts.map(post => {
        const itemHtml = renderPostItem(postItemStructure, post, options);
        
        if (itemWrapper) {
            // For carousel layout, itemWrapper has nested structure: embla__slide -> article
            if (isCarousel && itemWrapper.children && itemWrapper.children.length > 0) {
                // Find the article element inside embla__slide
                const articleElement = itemWrapper.children[0];
                const articleWithContent = {
                    ...articleElement,
                    attributes: {
                        ...articleElement.attributes,
                        id: articleElement.attributes?.id?.toString().replace('{{post-id}}', String(post.id || '')) || `post-${post.id || ''}`,
                    },
                    text: itemHtml,
                    placeholder: undefined, // Remove placeholder since we have content
                };
                
                // Wrap in embla__slide
                const slideWithArticle = {
                    ...itemWrapper,
                    children: [articleWithContent],
                };
                return renderElement(slideWithArticle);
            }
            
            // For non-carousel layouts, use simple wrapper
            const wrapperWithId = {
                ...itemWrapper,
                attributes: {
                    ...itemWrapper.attributes,
                    id: itemWrapper.attributes?.id?.toString().replace('{{post-id}}', String(post.id || '')) || `post-${post.id || ''}`,
                },
                text: itemHtml,
            };
            return renderElement(wrapperWithId);
        }
        
        return itemHtml;
    }).join('');

    // For carousel layout, container has nested structure: div -> embla__viewport -> embla__container
    if (isCarousel && container.children && container.children.length > 0) {
        const viewportElement = container.children[0];
        if (viewportElement.children && viewportElement.children.length > 0) {
            const containerElement = viewportElement.children[0];
            // Replace placeholder with actual slides HTML
            const containerWithSlides = {
                ...containerElement,
                text: itemsHtml,
                placeholder: undefined, // Remove placeholder since we have content
            };
            
            const viewportWithContainer = {
                ...viewportElement,
                children: [containerWithSlides],
            };
            
            const carouselWithViewport = {
                ...container,
                children: [viewportWithContainer],
            };
            
            return renderElement(carouselWithViewport);
        }
    }

    // For non-carousel layouts, use simple container
    const containerWithChildren: LayoutElement = {
        ...container,
        text: itemsHtml,
    };

    return renderElement(containerWithChildren);
}

/**
 * Get layout structure from localized data
 */
export function getLayoutStructure(layoutName: string): LayoutStructure | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const structures = (window as any).jankxLayoutStructures;
    if (!structures || !structures.layouts || !structures.layouts[layoutName]) {
        return null;
    }
    return structures.layouts[layoutName];
}

/**
 * Get post item structure from localized data
 */
export function getPostItemStructure(): PostItemStructure | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const structures = (window as any).jankxLayoutStructures;
    if (!structures || !structures.postItem) {
        return null;
    }
    return structures.postItem;
}
