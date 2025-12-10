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
        console.warn('AdvancedFilter trigger: Missing filterBlockId or filterId', triggerSettings);
        return;
    }

    // Find the advanced-filters block container
    // Try multiple selectors to find the block
    let filterBlock = document.querySelector(`.wp-block-jankx-advanced-filters[data-filter-block-id="${filterBlockId}"]`);
    
    if (!filterBlock) {
        filterBlock = document.querySelector(`.wp-block-jankx-advanced-filters[id*="${filterBlockId}"]`);
    }
    
    if (!filterBlock) {
        filterBlock = document.querySelector(`.wp-block-jankx-advanced-filters[data-query-id="${filterBlockId}"]`);
    }
    
    if (!filterBlock) {
        filterBlock = document.querySelector(`.wp-block-jankx-advanced-filters[data-block-id="${filterBlockId}"]`);
    }
    
    if (!filterBlock) {
        // Try to find by ID directly
        filterBlock = document.getElementById(filterBlockId);
    }
    
    if (!filterBlock) {
        // Try to find by matching blockId in config
        const allFilterBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters');
        console.log(`AdvancedFilter: Searching ${allFilterBlocks.length} advanced-filters blocks for ID ${filterBlockId}`);
        
        for (const block of allFilterBlocks) {
            const configEl = block.querySelector('.advanced-filters-config');
            if (configEl) {
                try {
                    const configData = configEl.getAttribute('data-config');
                    if (configData) {
                        const config = JSON.parse(configData);
                        console.log(`AdvancedFilter: Found block with config.blockId=${config.blockId}, targetBlockIds=`, config.targetBlockIds);
                        
                        // Match by blockId in config
                        if (config.blockId === filterBlockId) {
                            console.log('AdvancedFilter: Matched block by blockId in config');
                            filterBlock = block;
                            break;
                        }
                        // Also try matching by targetBlockIds (for backward compatibility)
                        if (config.targetBlockIds && config.targetBlockIds.includes(filterBlockId)) {
                            console.log('AdvancedFilter: Matched block by targetBlockIds in config');
                            filterBlock = block;
                            break;
                        }
                    }
                } catch (e) {
                    console.error('AdvancedFilter: Error parsing config', e);
                }
            } else {
                console.warn('AdvancedFilter: Block found but no .advanced-filters-config element');
            }
        }
    }
    
    if (!filterBlock) {
        // Last resort: find all advanced-filters blocks and use the first one
        const allFilterBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters');
        if (allFilterBlocks.length > 0) {
            console.warn(`AdvancedFilter trigger: Could not find block with ID ${filterBlockId}, using first available block`);
            filterBlock = allFilterBlocks[0];
        } else {
            console.error('AdvancedFilter trigger: No advanced-filters blocks found on page');
            return;
        }
    }
    
    if (filterBlock) {
        console.log('AdvancedFilter: Found filter block:', filterBlock.id, filterBlock.className);
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
        console.warn('AdvancedFilter: Invalid filterId format', filterId);
        return;
    }

    const filterType = filterParts[0]; // taxonomy, meta, price, date, author, keyword
    const filterIndex = parseInt(filterParts[1]) || 0;

    // Find the filter group element
    let filterGroup = null;
    let elementFound = false;

    if (filterType === 'taxonomy') {
        const taxonomy = filterParts[2] || '';
        
        if (!taxonomy) {
            console.warn(`AdvancedFilter: Taxonomy name is missing in filterId ${filterId}`);
            return;
        }
        
        console.log(`AdvancedFilter: Looking for taxonomy filter group with taxonomy="${taxonomy}"`);
        
        // Try multiple selectors to find taxonomy filter group in the specific block
        filterGroup = filterBlock.querySelector(`[data-taxonomy="${taxonomy}"]`);
        
        if (!filterGroup) {
            // Try with filter-taxonomy class
            filterGroup = filterBlock.querySelector(`.filter-taxonomy[data-taxonomy="${taxonomy}"]`);
        }
        
        if (!filterGroup) {
            // Try with data-filter-type
            filterGroup = filterBlock.querySelector(`[data-filter-type="taxonomy"][data-taxonomy="${taxonomy}"]`);
        }
        
        if (!filterGroup) {
            // Try with filter-group class
            filterGroup = filterBlock.querySelector(`.filter-group[data-taxonomy="${taxonomy}"]`);
        }
        
        if (!filterGroup) {
            // Last resort: find any element with data-taxonomy and match
            const allTaxonomyGroups = filterBlock.querySelectorAll('[data-taxonomy]');
            console.log(`AdvancedFilter: Found ${allTaxonomyGroups.length} elements with data-taxonomy attribute in block`);
            if (allTaxonomyGroups.length > 0) {
                // Try to find by matching taxonomy name
                for (const group of allTaxonomyGroups) {
                    const groupTaxonomy = group.getAttribute('data-taxonomy');
                    console.log(`AdvancedFilter: Checking group with taxonomy="${groupTaxonomy}"`);
                    if (groupTaxonomy === taxonomy) {
                        filterGroup = group;
                        console.log('AdvancedFilter: Matched taxonomy filter group');
                        break;
                    }
                }
            }
        }
        
        // If still not found, search in all advanced-filters blocks on the page
        if (!filterGroup) {
            console.log('AdvancedFilter: Not found in specific block, searching all advanced-filters blocks');
            const allFilterBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters');
            for (const block of allFilterBlocks) {
                filterGroup = block.querySelector(`[data-taxonomy="${taxonomy}"]`);
                if (filterGroup) {
                    console.log('AdvancedFilter: Found filter group in another block');
                    filterBlock = block; // Update filterBlock reference
                    break;
                }
            }
        }
        
        if (!filterGroup) {
            // Debug: log all filter groups found
            const allFilterGroups = filterBlock.querySelectorAll('[data-taxonomy], [data-filter-type]');
            const availableTaxonomies = Array.from(allFilterGroups).map(el => ({
                taxonomy: el.getAttribute('data-taxonomy'),
                filterType: el.getAttribute('data-filter-type'),
                classes: el.className,
                id: el.id,
            }));
            console.warn(`AdvancedFilter: Could not find filter group for taxonomy ${taxonomy}. Available filter groups in block:`, availableTaxonomies);
            
            // Also check all blocks on page
            const allBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters');
            const allTaxonomiesOnPage = [];
            allBlocks.forEach(block => {
                const groups = block.querySelectorAll('[data-taxonomy]');
                groups.forEach(group => {
                    allTaxonomiesOnPage.push({
                        taxonomy: group.getAttribute('data-taxonomy'),
                        blockId: block.id,
                        classes: group.className,
                    });
                });
            });
            console.warn(`AdvancedFilter: All taxonomy filters on page:`, allTaxonomiesOnPage);
            
            // Also check if filter block has any content
            const filterContainer = filterBlock.querySelector('.advanced-filters-container');
            if (filterContainer) {
                console.warn(`AdvancedFilter: Filter container HTML:`, filterContainer.innerHTML.substring(0, 1000));
            } else {
                console.warn(`AdvancedFilter: No .advanced-filters-container found in block`);
            }
            return;
        }
        
        console.log(`AdvancedFilter: Found filter group for taxonomy ${taxonomy}:`, filterGroup.className, filterGroup.getAttribute('data-taxonomy'));
        
        if (values.filterValue) {
            // Try to find term option by data-value first (for filter-option buttons)
            let termOption = filterGroup.querySelector(`[data-value="${values.filterValue}"]`);
            
            if (termOption && termOption.classList.contains('filter-option')) {
                // It's a button, click it
                elementFound = true;
                termOption.click();
            } else {
                // Try to find input/checkbox
                termOption = filterGroup.querySelector(`input[value="${values.filterValue}"]`);
                if (termOption) {
                    elementFound = true;
                    if (termOption instanceof HTMLInputElement) {
                        termOption.checked = true;
                        // Trigger change event immediately
                        termOption.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }
            
            if (!elementFound) {
                console.warn(`AdvancedFilter: Could not find term option with value ${values.filterValue} for taxonomy ${taxonomy}. Available values:`, 
                    Array.from(filterGroup.querySelectorAll('[data-value], input[value]')).map(el => 
                        el.getAttribute('data-value') || el.getAttribute('value')
                    ));
            }
        } else {
            // Empty value means "all" - might need to clear selection
            console.log(`AdvancedFilter: filterValue is empty for taxonomy ${taxonomy}, clearing selection`);
            // Clear all selections
            const activeOptions = filterGroup.querySelectorAll('.filter-option.active, input:checked');
            activeOptions.forEach(opt => {
                if (opt.classList.contains('filter-option')) {
                    opt.classList.remove('active');
                } else if (opt instanceof HTMLInputElement) {
                    opt.checked = false;
                }
            });
            elementFound = true;
        }
    } else if (filterType === 'meta') {
        const metaKey = filterParts[2] || '';
        filterGroup = filterBlock.querySelector(`.filter-meta[data-meta-key="${metaKey}"]`);
        
        if (!filterGroup) {
            filterGroup = filterBlock.querySelector(`[data-meta-key="${metaKey}"]`);
        }
        
        if (filterGroup && values.filterValue) {
            const input = filterGroup.querySelector('input, select');
            if (input) {
                elementFound = true;
                input.value = values.filterValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    } else if (filterType === 'price') {
        filterGroup = filterBlock.querySelector('.filter-price');
        
        if (filterGroup) {
            if (values.filterValueMin) {
                const minInput = filterGroup.querySelector('[name="price_min"], input[type="number"]');
                if (minInput) {
                    elementFound = true;
                    minInput.value = values.filterValueMin;
                    minInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            if (values.filterValueMax) {
                const maxInput = filterGroup.querySelector('[name="price_max"], input[type="number"]:last-of-type');
                if (maxInput) {
                    elementFound = true;
                    maxInput.value = values.filterValueMax;
                    maxInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'date') {
        filterGroup = filterBlock.querySelector('.filter-date');
        
        if (filterGroup) {
            if (values.filterValueStart) {
                const startInput = filterGroup.querySelector('[name="date_start"], input[type="date"]:first-of-type');
                if (startInput) {
                    elementFound = true;
                    startInput.value = values.filterValueStart;
                    startInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            if (values.filterValueEnd) {
                const endInput = filterGroup.querySelector('[name="date_end"], input[type="date"]:last-of-type');
                if (endInput) {
                    elementFound = true;
                    endInput.value = values.filterValueEnd;
                    endInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    } else if (filterType === 'author') {
        filterGroup = filterBlock.querySelector('[data-filter-type="author"], .filter-author');
        
        if (filterGroup && values.filterValue) {
            const input = filterGroup.querySelector(`input[value="${values.filterValue}"], select`);
            if (input) {
                elementFound = true;
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
                elementFound = true;
                input.value = values.filterValue;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    if (!filterGroup) {
        console.warn(`AdvancedFilter: Could not find filter group for filterId ${filterId}`);
        return;
    }

    if (!elementFound) {
        console.warn(`AdvancedFilter: Could not find filter element for filterId ${filterId} with values`, values);
        return;
    }

    // For taxonomy filters with filter-option buttons, the click event should trigger handleFilterChange
    // For other filters, we've already dispatched change/input events
    // But let's also trigger a change event on the filter group to ensure AdvancedFilters picks it up
    if (filterType !== 'taxonomy' || !values.filterValue) {
        // For non-taxonomy or empty taxonomy, ensure change event is fired
        setTimeout(() => {
            filterGroup.dispatchEvent(new Event('change', { bubbles: true }));
        }, 50);
    }
}

