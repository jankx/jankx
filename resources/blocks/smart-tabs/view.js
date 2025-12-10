/**
 * Smart Tabs Block - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    const smartTabsBlocks = document.querySelectorAll('.smart-tabs');

    const generateUid = (prefix = 'smart-tabs') =>
        `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

    smartTabsBlocks.forEach((tabsBlock) => {
        const navItems = Array.from(tabsBlock.querySelectorAll('.smart-tabs__nav-item'));
        const tabsContent = tabsBlock.querySelector('.smart-tabs__content');
        const tabPanels = tabsContent ? Array.from(tabsContent.querySelectorAll('.smart-tab')) : [];

        if (navItems.length === 0 || tabPanels.length === 0) {
            return;
        }

        const uid =
            tabsBlock.dataset.smartTabsUid && tabsBlock.dataset.smartTabsUid.length > 0
                ? tabsBlock.dataset.smartTabsUid
                : generateUid();
        tabsBlock.dataset.smartTabsUid = uid;

        const panelHashMap = {};

        navItems.forEach((navItem, index) => {
            if (!navItem.id) {
                navItem.id = `${uid}-tab-${index}`;
            }
            navItem.setAttribute('role', 'tab');
            navItem.setAttribute('aria-selected', 'false');
            navItem.setAttribute('tabindex', '-1');
        });

        tabPanels.forEach((panel, index) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-hidden', 'true');

            let panelId = panel.getAttribute('id');
            if (!panelId) {
                panelId = `${uid}-panel-${index}`;
                panel.setAttribute('id', panelId);
            }

            panelHashMap[`#${panelId}`] = index;

            const controller = navItems[index];
            if (controller) {
                controller.setAttribute('aria-controls', panelId);
                panel.setAttribute('aria-labelledby', controller.id);
            }
        });

        let activeIndex = -1;

        const clampIndex = (index) => Math.max(0, Math.min(index, navItems.length - 1));

        const scrollToPanel = (index) => {
            const panel = tabPanels[index];
            if (!panel) {
                return;
            }

            window.requestAnimationFrame(() => {
                panel.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        };

        const activateTab = (index, options = {}) => {
            if (!navItems.length) {
                return;
            }

            const targetIndex = clampIndex(index);

            if (activeIndex === targetIndex && !options.force) {
                if (options.scroll) {
                    scrollToPanel(targetIndex);
                }
                return;
            }

            activeIndex = targetIndex;

            navItems.forEach((navItem, navIndex) => {
                const isActive = navIndex === targetIndex;
                navItem.classList.toggle('is-active', isActive);
                navItem.setAttribute('aria-selected', isActive ? 'true' : 'false');
                navItem.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            tabPanels.forEach((panel, panelIndex) => {
                const isActive = panelIndex === targetIndex;
                panel.classList.toggle('is-active', isActive);
                panel.style.display = isActive ? 'block' : 'none';
                panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            if (options.focusNav) {
                navItems[targetIndex]?.focus({
                    preventScroll: true,
                });
            }

            if (options.scroll) {
                scrollToPanel(targetIndex);
            }
        };

        navItems.forEach((navItem, index) => {
            navItem.addEventListener('click', (event) => {
                event.preventDefault();
                activateTab(index, { focusNav: true, force: true });

                const panel = tabPanels[index];
                if (panel && panel.id) {
                    const newHash = `#${panel.id}`;
                    if (window.location.hash !== newHash) {
                        history.replaceState(
                            null,
                            '',
                            `${window.location.pathname}${window.location.search}${newHash}`
                        );
                    }
                    scrollToPanel(index);
                }

                // Handle advanced-filter trigger
                const tabTrigger = panel?.getAttribute('data-trigger');
                if (tabTrigger === 'advanced-filter') {
                    const triggerSettingsData = panel?.getAttribute('data-trigger-settings');
                    if (triggerSettingsData) {
                        try {
                            const triggerSettings = JSON.parse(triggerSettingsData);
                            triggerAdvancedFilter(triggerSettings);
                        } catch (error) {
                            console.error('Error parsing trigger settings:', error);
                        }
                    }
                }
            });
        });

        tabsBlock.addEventListener('keydown', (event) => {
            const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
            if (!keys.includes(event.key)) {
                return;
            }

            event.preventDefault();

            const lastIndex = navItems.length - 1;
            let nextIndex = activeIndex;

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = activeIndex > 0 ? activeIndex - 1 : lastIndex;
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = activeIndex < lastIndex ? activeIndex + 1 : 0;
                    break;
                case 'Home':
                    nextIndex = 0;
                    break;
                case 'End':
                    nextIndex = lastIndex;
                    break;
                default:
                    break;
            }

            activateTab(nextIndex, { focusNav: true, force: true });
        });

        const handleHashNavigation = (hash, options = {}) => {
            if (!hash) {
                return false;
            }

            const targetIndex = panelHashMap[hash];
            if (typeof targetIndex === 'number') {
                activateTab(targetIndex, {
                    scroll: options.scroll !== false,
                    force: true,
                    focusNav: false,
                });
                return true;
            }

            return false;
        };

        const datasetActive = parseInt(
            tabsBlock.getAttribute('data-active-tab') ?? '0',
            10
        );
        const defaultIndex = Number.isNaN(datasetActive) ? 0 : datasetActive;

        if (!handleHashNavigation(window.location.hash)) {
            activateTab(defaultIndex, { force: true });
        }

        window.addEventListener('hashchange', () => {
            handleHashNavigation(window.location.hash);
        });
    });
});

/**
 * Trigger advanced filter when tab is clicked
 * 
 * @param {Object} triggerSettings Trigger settings from tab attributes
 */
function triggerAdvancedFilter(triggerSettings) {
    const filterBlockId = triggerSettings.filterBlockId;
    const filterId = triggerSettings.filterId;
    const filterValue = triggerSettings.filterValue;
    const filterValueMin = triggerSettings.filterValueMin;
    const filterValueMax = triggerSettings.filterValueMax;
    const filterValueStart = triggerSettings.filterValueStart;
    const filterValueEnd = triggerSettings.filterValueEnd;

    if (!filterBlockId || !filterId) {
        return;
    }

    // Find the advanced-filters block
    const filterBlock = document.querySelector(`[data-block-id="${filterBlockId}"], [id*="${filterBlockId}"]`);
    if (!filterBlock) {
        // Try to find by class
        const allFilterBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters');
        if (allFilterBlocks.length > 0) {
            // Use first block if we can't find by ID
            const firstBlock = allFilterBlocks[0];
            applyFilterToBlock(firstBlock, filterId, {
                filterValue,
                filterValueMin,
                filterValueMax,
                filterValueStart,
                filterValueEnd,
            });
        }
        return;
    }

    applyFilterToBlock(filterBlock, filterId, {
        filterValue,
        filterValueMin,
        filterValueMax,
        filterValueStart,
        filterValueEnd,
    });
}

/**
 * Apply filter to advanced-filters block
 * 
 * @param {HTMLElement} filterBlock The advanced-filters block element
 * @param {string} filterId The filter ID to apply
 * @param {Object} values Filter values
 */
function applyFilterToBlock(filterBlock, filterId, values) {
    // Parse filter ID to get filter type and index
    const filterParts = filterId.split('_');
    if (filterParts.length < 2) {
        return;
    }

    const filterType = filterParts[0]; // taxonomy, meta, price, date, author, keyword
    const filterIndex = parseInt(filterParts[1]) || 0;

    // Find the filter group element
    let filterGroup = null;

    if (filterType === 'taxonomy') {
        const taxonomy = filterParts[2] || '';
        filterGroup = filterBlock.querySelector(`[data-taxonomy="${taxonomy}"]`);
        
        if (filterGroup && values.filterValue) {
            // Find the term option and click it
            const termOption = filterGroup.querySelector(`[data-value="${values.filterValue}"], input[value="${values.filterValue}"]`);
            if (termOption) {
                if (termOption instanceof HTMLElement && termOption.classList.contains('filter-option')) {
                    termOption.click();
                } else if (termOption instanceof HTMLInputElement) {
                    termOption.checked = true;
                    termOption.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'meta') {
        const metaKey = filterParts[2] || '';
        filterGroup = filterBlock.querySelector(`[data-meta-key="${metaKey}"]`);
        
        if (filterGroup && values.filterValue) {
            const input = filterGroup.querySelector('input, select');
            if (input) {
                input.value = values.filterValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    } else if (filterType === 'price') {
        filterGroup = filterBlock.querySelector('.filter-price');
        
        if (filterGroup) {
            if (values.filterValueMin) {
                const minInput = filterGroup.querySelector('[data-price="min"], [name="price_min"]');
                if (minInput) {
                    minInput.value = values.filterValueMin;
                    minInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            if (values.filterValueMax) {
                const maxInput = filterGroup.querySelector('[data-price="max"], [name="price_max"]');
                if (maxInput) {
                    maxInput.value = values.filterValueMax;
                    maxInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'date') {
        filterGroup = filterBlock.querySelector('.filter-date');
        
        if (filterGroup) {
            if (values.filterValueStart) {
                const startInput = filterGroup.querySelector('[data-date="start"], [name="date_start"]');
                if (startInput) {
                    startInput.value = values.filterValueStart;
                    startInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            if (values.filterValueEnd) {
                const endInput = filterGroup.querySelector('[data-date="end"], [name="date_end"]');
                if (endInput) {
                    endInput.value = values.filterValueEnd;
                    endInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'author') {
        filterGroup = filterBlock.querySelector('[data-filter-type="author"]');
        
        if (filterGroup && values.filterValue) {
            const input = filterGroup.querySelector(`input[value="${values.filterValue}"], select`);
            if (input) {
                if (input instanceof HTMLInputElement) {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                } else if (input instanceof HTMLSelectElement) {
                    input.value = values.filterValue;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'keyword') {
        filterGroup = filterBlock.querySelector('.filter-keyword');
        
        if (filterGroup && values.filterValue) {
            const input = filterGroup.querySelector('input');
            if (input) {
                input.value = values.filterValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    // Trigger filter change by dispatching change/input events
    // AdvancedFilters class listens to these events and will handle the update
    // We need to wait a bit for the DOM to update, then trigger the change
    
    setTimeout(() => {
        // Trigger change event on inputs that were modified
        const changedInputs = filterGroup?.querySelectorAll('input:not([type="hidden"]), select');
        if (changedInputs && changedInputs.length > 0) {
            changedInputs.forEach((input) => {
                // Trigger both input and change events to ensure AdvancedFilters picks it up
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
        
        // Also trigger click event on filter-option buttons if any were clicked
        const clickedOptions = filterGroup?.querySelectorAll('.filter-option.active');
        if (clickedOptions && clickedOptions.length > 0) {
            // The click event should have already been triggered, but ensure change is fired
            filterGroup.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, 100);
}

