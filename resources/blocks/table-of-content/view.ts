/**
 * Frontend JavaScript for Table of Content block
 * Handles expand/collapse functionality
 */

interface TOCElement extends HTMLElement {
    dataset: {
        defaultExpanded?: string;
        expandFirstItem?: string;
        expandIconType?: string;
    };
}

/**
 * Get expand/collapse icon based on type
 */
function getExpandIcon(type: string, isExpanded: boolean): string {
    switch (type) {
        case 'chevron':
            return isExpanded ? '▼' : '▶';
        case 'arrow':
            return isExpanded ? '↓' : '→';
        case 'caret':
            return isExpanded ? '▾' : '▸';
        case 'plus-minus':
        default:
            return isExpanded ? '−' : '+';
    }
}

/**
 * Initialize Table of Content functionality
 */
function initTableOfContent(): void {
    const tocBlocks = document.querySelectorAll<TOCElement>('.jankx-table-of-content');

    tocBlocks.forEach((tocBlock) => {
        const expandIconType = tocBlock.dataset.expandIconType || 'plus-minus';
        
        // If icon type is 'none', hide all toggle buttons
        if (expandIconType === 'none') {
            const toggleButtons = tocBlock.querySelectorAll<HTMLButtonElement>('.toc-item__toggle');
            toggleButtons.forEach((button) => {
                button.style.display = 'none';
            });
        } else {
            // Set up toggle buttons only if icon type is not 'none'
            const toggleButtons = tocBlock.querySelectorAll<HTMLButtonElement>('.toc-item__toggle');
            toggleButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    const listItem = button.closest('li');

                    if (!listItem) return;

                    const nestedList = listItem.querySelector<HTMLElement>(':scope > ul, :scope > ol');
                    const iconSpan = button.querySelector<HTMLElement>('.toc-item__icon');

                    if (nestedList) {
                        // Toggle state
                        const newExpandedState = !isExpanded;
                        button.setAttribute('aria-expanded', String(newExpandedState));
                        button.classList.toggle('is-expanded');
                        button.classList.toggle('is-collapsed');
                        nestedList.style.display = isExpanded ? 'none' : 'block';

                        // Update icon text (only if icon type is not 'none')
                        if (iconSpan && expandIconType !== 'none') {
                            iconSpan.textContent = getExpandIcon(expandIconType, newExpandedState);
                        }
                    }
                });
            });
        }

        // Handle smooth scroll to heading
        const links = tocBlock.querySelectorAll<HTMLAnchorElement>('.toc-item__link');
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);

                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                        // Update URL without triggering scroll
                        if (window.history && window.history.pushState) {
                            window.history.pushState(null, '', href);
                        }
                    }
                }
            });
        });
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableOfContent);
} else {
    initTableOfContent();
}

// Re-initialize on block editor updates (for block preview)
if (window.wp && window.wp.domReady) {
    window.wp.domReady(initTableOfContent);
}

