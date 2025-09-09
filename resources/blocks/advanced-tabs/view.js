/**
 * Advanced Tabs Block - Frontend JavaScript
 * Handles tab switching functionality
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const tabBlocks = document.querySelectorAll('.advanced-tabs-block');

        if (tabBlocks.length === 0) {
            return;
        }

        tabBlocks.forEach(function(tabBlock) {
            initTabsBlock(tabBlock);
        });
    });

    /**
     * Initialize tabs block functionality
     * @param {HTMLElement} tabBlock - The tabs block element
     */
    function initTabsBlock(tabBlock) {
        const tabTitles = tabBlock.querySelectorAll('.tabs-titles .tab-title');
        const tabContents = tabBlock.querySelectorAll('.single-tab');

        if (tabTitles.length === 0 || tabContents.length === 0) {
            return;
        }

        // Set up accessibility attributes
        setupAccessibility(tabTitles, tabContents);

        // Add event listeners
        tabTitles.forEach(function(tabTitle, index) {
            // Click event
            tabTitle.addEventListener('click', function(e) {
                e.preventDefault();
                switchTab(tabBlock, tabTitle, index);
            });

            // Keyboard navigation
            tabTitle.addEventListener('keydown', function(e) {
                handleKeyNavigation(e, tabTitles, index, tabBlock);
            });
        });

        // Initialize first tab as active
        const firstTab = tabTitles[0];
        if (firstTab && !firstTab.classList.contains('active')) {
            switchTab(tabBlock, firstTab, 0);
        }
    }

    /**
     * Set up accessibility attributes
     * @param {NodeList} tabTitles - Tab title elements
     * @param {NodeList} tabContents - Tab content elements
     */
    function setupAccessibility(tabTitles, tabContents) {
        tabTitles.forEach(function(tabTitle, index) {
            const isActive = tabTitle.classList.contains('active');

            // Set ARIA attributes for tab titles
            tabTitle.setAttribute('role', 'tab');
            tabTitle.setAttribute('tabindex', isActive ? '0' : '-1');
            tabTitle.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tabTitle.setAttribute('aria-controls', 'tab-panel-' + index);
        });

        tabContents.forEach(function(tabContent, index) {
            const isActive = tabContent.classList.contains('active');

            // Set ARIA attributes for tab panels
            tabContent.setAttribute('role', 'tabpanel');
            tabContent.setAttribute('id', 'tab-panel-' + index);
            tabContent.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            tabContent.setAttribute('aria-labelledby', 'tab-' + index);
        });
    }

    /**
     * Switch to a specific tab
     * @param {HTMLElement} tabBlock - The tabs block element
     * @param {HTMLElement} activeTabTitle - The tab title to activate
     * @param {number} index - Index of the tab
     */
    function switchTab(tabBlock, activeTabTitle, index) {
        const tabTitles = tabBlock.querySelectorAll('.tabs-titles .tab-title');
        const tabContents = tabBlock.querySelectorAll('.single-tab');
        const tabId = activeTabTitle.getAttribute('data-title-tab-id');

        // Update tab titles
        tabTitles.forEach(function(tabTitle, i) {
            const isActive = i === index;

            // Update classes
            tabTitle.classList.toggle('active', isActive);

            // Update ARIA attributes
            tabTitle.setAttribute('tabindex', isActive ? '0' : '-1');
            tabTitle.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update tab contents
        tabContents.forEach(function(tabContent) {
            const contentTabId = tabContent.getAttribute('data-tab-id');
            const isActive = contentTabId === tabId;

            // Update display and classes
            tabContent.style.display = isActive ? 'block' : 'none';
            tabContent.classList.toggle('active', isActive);

            // Update ARIA attributes
            tabContent.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        // Add animation class for smooth transition
        const activeContent = tabBlock.querySelector('.single-tab.active');
        if (activeContent) {
            activeContent.style.animation = 'fadeIn 0.3s ease-in-out';
        }

        // Dispatch custom event
        const event = new CustomEvent('jankx-tab-switched', {
            detail: {
                tabId: tabId,
                index: index,
                tabBlock: tabBlock
            }
        });
        tabBlock.dispatchEvent(event);
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     * @param {NodeList} tabTitles - All tab title elements
     * @param {number} currentIndex - Current tab index
     * @param {HTMLElement} tabBlock - The tabs block element
     */
    function handleKeyNavigation(e, tabTitles, currentIndex, tabBlock) {
        let newIndex = currentIndex;
        const totalTabs = tabTitles.length;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = (currentIndex + 1) % totalTabs;
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = (currentIndex - 1 + totalTabs) % totalTabs;
                break;

            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;

            case 'End':
                e.preventDefault();
                newIndex = totalTabs - 1;
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                switchTab(tabBlock, tabTitles[currentIndex], currentIndex);
                return;

            default:
                return;
        }

        // Focus and switch to new tab
        if (newIndex !== currentIndex) {
            const newTab = tabTitles[newIndex];
            newTab.focus();
            switchTab(tabBlock, newTab, newIndex);
        }
    }

    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        // Re-initialize tabs on resize to handle responsive changes
        const tabBlocks = document.querySelectorAll('.advanced-tabs-block');
        tabBlocks.forEach(function(tabBlock) {
            // Only re-initialize if needed
            if (tabBlock.dataset.initialized !== 'true') {
                initTabsBlock(tabBlock);
                tabBlock.dataset.initialized = 'true';
            }
        });
    });

})();
