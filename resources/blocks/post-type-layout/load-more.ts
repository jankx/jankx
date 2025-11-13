/**
 * Load More functionality for Post Type Layout Block
 * 
 * @package Jankx
 * @since 1.0.0
 */

declare const jankxLoadMore: {
    ajaxUrl: string;
    nonce: string;
};

interface LoadMoreData {
    attributes: any;
    page: number;
}

interface LoadMoreResponse {
    success: boolean;
    data: {
        html: string;
        page: number;
        max_pages: number;
        has_more: boolean;
    };
}

/**
 * Initialize Load More functionality
 */
function initLoadMore(): void {
    document.addEventListener('click', async (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const button = target.closest('.jankx-load-more-button') as HTMLButtonElement;

        if (!button) {
            return;
        }

        event.preventDefault();

        // Prevent double-click
        if (button.disabled) {
            return;
        }

        // Get data from button
        const ajaxParams = button.getAttribute('data-ajax-params');
        if (!ajaxParams) {
            console.error('No AJAX params found on load more button');
            return;
        }

        let loadMoreData: LoadMoreData;
        try {
            loadMoreData = JSON.parse(ajaxParams);
        } catch (error) {
            console.error('Failed to parse AJAX params:', error);
            return;
        }

        // Get block wrapper (parent container for posts)
        const blockWrapper = button.closest('.wp-block-jankx-post-type-layout');
        if (!blockWrapper) {
            console.error('Block wrapper not found');
            return;
        }

        const layoutType = (blockWrapper.getAttribute('data-layout') || '').toLowerCase();
        const containerSelectors: string[] = [];

        if (layoutType === 'carousel') {
            containerSelectors.push('.post-type-layout-carousel .embla__container');
        }

        containerSelectors.push(
            '.wp-block-jankx-post-layout-template',
            '.post-type-layout-grid',
            '.post-type-layout-list',
            '.post-type-layout-masonry',
            '.post-type-layout-card',
            '.jankx-posts-layout',
            '.post-layout'
        );

        const uniqueSelectors = Array.from(new Set(containerSelectors));

        const loadMoreText = button.querySelector('.load-more-text') as HTMLElement;
        const loadMoreSpinner = button.querySelector('.load-more-spinner') as HTMLElement;

        const postsContainer = uniqueSelectors.reduce<HTMLElement | null>((found, selector) => {
            if (found) {
                return found;
            }
            return blockWrapper.querySelector<HTMLElement>(selector);
        }, null);

        const handleResetButtonState = () => {
            button.disabled = false;
            if (loadMoreText) {
                loadMoreText.style.display = 'inline';
            }
            if (loadMoreSpinner) {
                loadMoreSpinner.style.display = 'none';
            }
        };

        if (!postsContainer) {
            console.error('Posts container not found');
            handleResetButtonState();
            return;
        }

        // Show loading state
        button.disabled = true;
        if (loadMoreText) {
            loadMoreText.style.display = 'none';
        }
        if (loadMoreSpinner) {
            loadMoreSpinner.style.display = 'inline';
        }

        try {
            // Make AJAX request
            const formData = new FormData();
            formData.append('action', 'jankx_load_more_posts');
            formData.append('nonce', jankxLoadMore.nonce);
            formData.append('attributes', JSON.stringify(loadMoreData.attributes));
            formData.append('page', loadMoreData.page.toString());

            const response = await fetch(jankxLoadMore.ajaxUrl, {
                method: 'POST',
                body: formData,
            });

            const jsonResponse: LoadMoreResponse = await response.json();

            if (!jsonResponse.success) {
                throw new Error(jsonResponse.data?.html || 'Failed to load more posts');
            }

            const { html, page, max_pages, has_more } = jsonResponse.data;

            // Create temporary container to parse HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;

            // Tìm container tương ứng trong HTML trả về
            let sourceContainer: Element | null = null;
            for (const selector of uniqueSelectors) {
                sourceContainer = tempContainer.querySelector(selector);
                if (sourceContainer) {
                    break;
                }
            }

            const newNodes: HTMLElement[] = [];

            if (sourceContainer) {
                newNodes.push(
                    ...Array.from(sourceContainer.children).filter(
                        (child): child is HTMLElement => child instanceof HTMLElement
                    )
                );
            }

            if (newNodes.length === 0) {
                tempContainer
                    .querySelectorAll<HTMLElement>('.embla__slide, .post-item, .jankx-post-item, article')
                    .forEach((item) => {
                        newNodes.push(item);
                    });
            }

            if (newNodes.length === 0) {
                throw new Error('Không tìm thấy bài viết mới để chèn');
            }

            newNodes.forEach((node) => {
                postsContainer.appendChild(node);
            });

            // Update button state
            if (has_more) {
                // Update page number for next load
                loadMoreData.page = page + 1;
                button.setAttribute('data-ajax-params', JSON.stringify(loadMoreData));
                button.setAttribute('data-page', (page + 1).toString());
            } else {
                // No more posts, hide button
                const paginationWrapper = button.closest('.post-layout-pagination');
                if (paginationWrapper) {
                    paginationWrapper.remove();
                } else {
                    button.remove();
                }
            }

            // Trigger custom event for third-party integrations
            const loadMoreEvent = new CustomEvent('jankx:loadMoreComplete', {
                detail: {
                    page,
                    max_pages,
                    has_more,
                    newItems: newNodes,
                    layoutType,
                },
            });
            document.dispatchEvent(loadMoreEvent);
        } catch (error) {
            console.error('Load More error:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'load-more-error';
            errorMessage.style.cssText = 'color: red; margin-top: 10px; text-align: center;';
            errorMessage.textContent = error instanceof Error ? error.message : 'An error occurred while loading more posts';
            
            button.parentElement?.appendChild(errorMessage);
            
            // Remove error after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        } finally {
            // Restore button state
            button.disabled = false;
            if (loadMoreText) {
                loadMoreText.style.display = 'inline';
            }
            if (loadMoreSpinner) {
                loadMoreSpinner.style.display = 'none';
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadMore);
} else {
    initLoadMore();
}

