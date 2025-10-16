/**
 * Frontend JavaScript for Table of Content block
 * Handles expand/collapse functionality
 */

interface TOCElement extends HTMLElement {
    dataset: {
        defaultExpanded?: string;
        expandFirstItem?: string;
    };
}

/**
 * Initialize Table of Content functionality
 */
function initTableOfContent(): void {
    const tocBlocks = document.querySelectorAll<TOCElement>('.jankx-table-of-content');

    tocBlocks.forEach((tocBlock) => {
        const toggleButtons = tocBlock.querySelectorAll<HTMLButtonElement>('.toc-item__toggle');

        toggleButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const listItem = button.closest('li');

                if (!listItem) return;

                const nestedList = listItem.querySelector<HTMLElement>(':scope > ul, :scope > ol');

                if (nestedList) {
                    // Toggle state
                    button.setAttribute('aria-expanded', String(!isExpanded));
                    button.classList.toggle('is-expanded');
                    button.classList.toggle('is-collapsed');
                    nestedList.style.display = isExpanded ? 'none' : 'block';
                }
            });
        });

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

