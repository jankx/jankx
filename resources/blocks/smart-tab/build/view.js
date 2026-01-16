/******/ (() => { // webpackBootstrap
/*!**********************************!*\
  !*** ./blocks/smart-tab/view.js ***!
  \**********************************/
/**
 * Smart Tab Block - Frontend JavaScript
 * 
 * Handles trigger-specific logic when tab is activated
 */

/**
 * Handle advanced-filter trigger when tab navigation button is clicked
 */
function handleTabNavigationClick(event) {
  // Prevent duplicate execution for the same event
  if (event.jankxAdvancedFilterProcessed) {
    return;
  }
  console.log('[SmartTab AdvancedFilter] Click event detected', {
    target: event.target,
    currentTarget: event.currentTarget
  });

  // Check if clicked element is a smart-tabs navigation button with advanced-filter trigger
  const navButton = event.target.closest('.smart-tabs__nav-item[data-trigger="advanced-filter"]');
  if (!navButton) {
    console.log('[SmartTab AdvancedFilter] Not a navigation button with advanced-filter trigger');
    return;
  }

  // Mark event as processed to prevent duplicate execution
  event.jankxAdvancedFilterProcessed = true;
  console.log('[SmartTab AdvancedFilter] Navigation button found', {
    navButton,
    attributes: Array.from(navButton.attributes).map(attr => ({
      name: attr.name,
      value: attr.value
    }))
  });

  // Get tab index from button
  const tabIndex = parseInt(navButton.getAttribute('data-tab-index') || '-1', 10);
  if (tabIndex < 0) {
    console.warn('[SmartTab AdvancedFilter] Invalid tab index', tabIndex);
    return;
  }
  console.log('[SmartTab AdvancedFilter] Tab index:', tabIndex);

  // Find tabs container
  const tabsContainer = navButton.closest('.smart-tabs');
  if (!tabsContainer) {
    console.warn('[SmartTab AdvancedFilter] Tabs container not found');
    return;
  }
  console.log('[SmartTab AdvancedFilter] Tabs container found', {
    tabsContainer,
    hasContent: !!tabsContainer.querySelector('.smart-tabs__content'),
    hideContent: tabsContainer.classList.contains('smart-tabs--hide-content')
  });

  // Find tab panels - try multiple methods
  // When hideTabContent is enabled, .smart-tabs__content is not rendered
  // So we need to find tab panels directly in the container or elsewhere
  let tabPanels = [];

  // Method 1: Try to find in .smart-tabs__content (if exists and not hidden)
  const tabsContent = tabsContainer.querySelector('.smart-tabs__content');
  if (tabsContent) {
    tabPanels = Array.from(tabsContent.querySelectorAll('.smart-tab'));
    console.log('[SmartTab AdvancedFilter] Found tab panels in .smart-tabs__content', {
      count: tabPanels.length
    });
  }

  // Method 2: Search directly in tabs container (for when content is hidden)
  if (tabPanels.length === 0) {
    // When hideContent is enabled, tabs might be rendered elsewhere or hidden
    // Try to find all .smart-tab elements in the container first (even if hidden)
    tabPanels = Array.from(tabsContainer.querySelectorAll('.smart-tab'));

    // Also try to find dynamic-data-layout blocks (which might be the actual tab panels)
    if (tabPanels.length === 0) {
      const dynamicDataLayouts = Array.from(tabsContainer.querySelectorAll('[data-block-id], [data-query-id]'));
      if (dynamicDataLayouts.length > 0) {
        tabPanels = dynamicDataLayouts;
        console.log('[SmartTab AdvancedFilter] Found dynamic-data-layout blocks in container', {
          count: tabPanels.length
        });
      }
    }

    // If still not found in container, search in the entire document
    // Match by order with navigation buttons (tabs should be in same order as nav buttons)
    if (tabPanels.length === 0) {
      // Get all navigation buttons to understand the structure
      const allNavButtons = Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item'));
      const navButtonsWithTrigger = allNavButtons.filter(btn => btn.getAttribute('data-trigger') === 'advanced-filter');

      // Find all .smart-tab elements in document that might contain advanced-filter blocks
      // We'll match them by order with navigation buttons
      const allSmartTabs = Array.from(document.querySelectorAll('.smart-tab'));

      // Also find dynamic-data-layout blocks
      const allDynamicDataLayouts = Array.from(document.querySelectorAll('[data-block-id], [data-query-id]'));
      console.log('[SmartTab AdvancedFilter] Found all elements in document', {
        smartTabsCount: allSmartTabs.length,
        dynamicDataLayoutsCount: allDynamicDataLayouts.length,
        navButtonsCount: allNavButtons.length,
        navButtonsWithTriggerCount: navButtonsWithTrigger.length,
        smartTabs: allSmartTabs.map((tab, idx) => ({
          index: idx,
          trigger: tab.getAttribute('data-trigger'),
          triggerSettings: tab.getAttribute('data-trigger-settings'),
          hasAdvancedFilter: !!tab.querySelector('[data-filter-type]')
        })),
        dynamicDataLayouts: allDynamicDataLayouts.map((layout, idx) => ({
          index: idx,
          blockId: layout.getAttribute('data-block-id'),
          queryId: layout.getAttribute('data-query-id')
        }))
      });

      // Filter tabs that have advanced-filter blocks inside or have data-trigger="advanced-filter"
      // Then match by order with navigation buttons
      const tabsWithAdvancedFilter = allSmartTabs.filter(tab => {
        const hasTrigger = tab.getAttribute('data-trigger') === 'advanced-filter';
        const hasFilterBlock = !!tab.querySelector('[data-filter-type]');
        return hasTrigger || hasFilterBlock;
      });

      // Use tabs that match the order of navigation buttons
      // If we have same number of tabs with advanced-filter as nav buttons, use them
      if (tabsWithAdvancedFilter.length >= navButtonsWithTrigger.length) {
        tabPanels = tabsWithAdvancedFilter.slice(0, navButtonsWithTrigger.length);
      } else if (allSmartTabs.length >= allNavButtons.length) {
        // Fallback: use all tabs and match by index
        tabPanels = allSmartTabs.slice(0, allNavButtons.length);
      } else if (allDynamicDataLayouts.length > 0) {
        // If no smart-tabs found, try using dynamic-data-layout blocks
        // Match by order with navigation buttons
        if (allDynamicDataLayouts.length >= allNavButtons.length) {
          tabPanels = allDynamicDataLayouts.slice(0, allNavButtons.length);
        } else {
          tabPanels = allDynamicDataLayouts;
        }
      } else {
        tabPanels = allSmartTabs;
      }
    }
  }

  // Method 3: If still not found, try to find by matching navigation buttons with tab panels
  // by using aria-controls or data attributes
  if (tabPanels.length === 0) {
    // Get all navigation buttons to understand the structure
    const allNavButtons = Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item'));
    console.log('[SmartTab AdvancedFilter] All navigation buttons', {
      count: allNavButtons.length,
      buttons: allNavButtons.map((btn, idx) => ({
        index: idx,
        tabIndex: btn.getAttribute('data-tab-index'),
        trigger: btn.getAttribute('data-trigger'),
        ariaControls: btn.getAttribute('aria-controls'),
        id: btn.id
      }))
    });

    // Try to find tab panels by matching aria-controls from navigation buttons
    const foundPanels = [];
    allNavButtons.forEach((navButton, index) => {
      const ariaControls = navButton.getAttribute('aria-controls');
      if (ariaControls) {
        // Remove # if present
        const panelId = ariaControls.replace(/^#/, '');
        const panel = document.getElementById(panelId) || document.querySelector(`#${panelId}`);
        // Accept both .smart-tab and dynamic-data-layout blocks
        if (panel && (panel.classList.contains('smart-tab') || panel.hasAttribute('data-block-id') || panel.hasAttribute('data-query-id'))) {
          foundPanels[index] = panel;
        }
      }
    });

    // Filter out undefined values and use found panels
    if (foundPanels.length > 0) {
      tabPanels = foundPanels.filter(panel => panel !== undefined);
      console.log('[SmartTab AdvancedFilter] Found tab panels via aria-controls', {
        count: tabPanels.length
      });
    }

    // If still not found, try to find by searching for tabs with matching data attributes
    if (tabPanels.length === 0) {
      console.warn('[SmartTab AdvancedFilter] Could not find tab panels, trying alternative method');
    }
  }
  console.log('[SmartTab AdvancedFilter] All found tab panels', {
    count: tabPanels.length,
    requestedIndex: tabIndex,
    panels: tabPanels.map((panel, idx) => ({
      index: idx,
      trigger: panel.getAttribute('data-trigger'),
      id: panel.id,
      className: panel.className,
      triggerSettings: panel.getAttribute('data-trigger-settings')
    }))
  });

  // Find tab panel by matching with navigation button
  // Try multiple methods to find the correct tab panel
  let tabBlock = null;

  // Method 1: Use tabIndex directly if it matches array index
  if (tabIndex >= 0 && tabIndex < tabPanels.length) {
    tabBlock = tabPanels[tabIndex];
  }

  // Method 2: If not found, try to find by aria-controls from navigation button
  if (!tabBlock && navButton) {
    const ariaControls = navButton.getAttribute('aria-controls');
    if (ariaControls) {
      const panelId = ariaControls.replace(/^#/, '');
      tabBlock = document.getElementById(panelId) || document.querySelector(`#${panelId}`);
      // Accept both .smart-tab and dynamic-data-layout blocks
      if (tabBlock && !tabBlock.classList.contains('smart-tab') && !tabBlock.hasAttribute('data-block-id') && !tabBlock.hasAttribute('data-query-id')) {
        tabBlock = null;
      }
    }
  }

  // Method 3: Find by matching index in all navigation buttons
  if (!tabBlock) {
    const allNavButtons = Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item'));
    const navButtonIndex = allNavButtons.indexOf(navButton);
    if (navButtonIndex >= 0 && navButtonIndex < tabPanels.length) {
      tabBlock = tabPanels[navButtonIndex];
    }
  }

  // Method 4: If still not found, try to find by data-tab-index attribute on panels
  if (!tabBlock) {
    tabBlock = tabPanels.find(panel => {
      const panelTabIndex = panel.getAttribute('data-tab-index');
      return panelTabIndex && parseInt(panelTabIndex, 10) === tabIndex;
    });
  }
  if (!tabBlock) {
    console.warn('[SmartTab AdvancedFilter] Tab panel not found for index, will try to find advanced-filter block directly', {
      tabIndex,
      availablePanels: tabPanels.length,
      navButtonIndex: navButton ? Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item')).indexOf(navButton) : -1,
      navButtonAriaControls: navButton?.getAttribute('aria-controls')
    });
    // Still proceed - handleAdvancedFilterTrigger can find advanced-filter blocks directly
    // Pass null as tabBlock to indicate it wasn't found
    tabBlock = null;
  }

  // Check if this tab block has advanced-filter trigger or contains advanced-filter block
  let tabTrigger = null;
  let hasAdvancedFilterBlock = false;
  if (tabBlock) {
    tabTrigger = tabBlock.getAttribute('data-trigger');
    hasAdvancedFilterBlock = !!tabBlock.querySelector('[data-filter-type]');
    const tabBlockAttributes = tabBlock && tabBlock.attributes ? Array.from(tabBlock.attributes).map(attr => ({
      name: attr.name,
      value: attr.value
    })) : tabBlock && typeof tabBlock === 'object' ? Object.keys(tabBlock) : [];
    console.log('[SmartTab AdvancedFilter] Tab block found', {
      tabIndex,
      tabTrigger,
      hasAdvancedFilterBlock,
      tabBlock,
      attributes: tabBlockAttributes,
      isVirtualObject: !!(tabBlock && tabBlock._filterBlock)
    });
  } else {
    console.log('[SmartTab AdvancedFilter] Tab block is null, will search for advanced-filter blocks directly', {
      tabIndex
    });
  }

  // Tab panel doesn't need to have data-trigger="advanced-filter"
  // It's enough if it contains an advanced-filter block or if the nav button has the trigger
  // The navigation button already has data-trigger="advanced-filter", so we proceed
  // Even if tabBlock is null, handleAdvancedFilterTrigger can find advanced-filter blocks directly

  // Activate tab manually to ensure it's active
  // This ensures tab is activated even if smart-tabs/view.js doesn't receive the event
  activateTabManually(navButton, tabIndex, tabsContainer);
  console.log('[SmartTab AdvancedFilter] Triggering advanced-filter logic after delay');
  // Let smart-tabs handle tab activation first (if it receives the event)
  // Then trigger advanced-filter logic after a short delay
  setTimeout(() => {
    console.log('[SmartTab AdvancedFilter] Executing handleAdvancedFilterTrigger');
    handleAdvancedFilterTrigger(tabBlock, navButton);
  }, 150);
}

/**
 * Manually activate tab to ensure it's active
 * This is a fallback in case smart-tabs/view.js doesn't receive the event
 * 
 * @param {HTMLElement} navButton The navigation button that was clicked
 * @param {number} tabIndex The tab index
 * @param {HTMLElement} tabsContainer The tabs container
 */
function activateTabManually(navButton, tabIndex, tabsContainer) {
  // Get all navigation items
  const allNavItems = Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item'));
  const navItemIndex = allNavItems.indexOf(navButton);

  // Use the actual index in the array, not tabIndex from data attribute
  const actualIndex = navItemIndex >= 0 ? navItemIndex : tabIndex;
  console.log('[SmartTab AdvancedFilter] Activating tab manually', {
    tabIndex,
    navItemIndex,
    actualIndex,
    totalNavItems: allNavItems.length
  });

  // Update navigation buttons
  allNavItems.forEach((navItem, index) => {
    const isActive = index === actualIndex;
    navItem.classList.toggle('is-active', isActive);
    navItem.setAttribute('aria-selected', isActive ? 'true' : 'false');
    navItem.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update tab panels if they exist
  const tabsContent = tabsContainer.querySelector('.smart-tabs__content');
  if (tabsContent) {
    const tabPanels = Array.from(tabsContent.querySelectorAll('.smart-tab'));
    tabPanels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === actualIndex;
      panel.classList.toggle('is-active', isActive);
      panel.style.display = isActive ? 'block' : 'none';
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  }

  // Also try to find panels by aria-controls
  const clickedAriaControls = navButton.getAttribute('aria-controls');
  if (clickedAriaControls) {
    const panelId = clickedAriaControls.replace(/^#/, '');
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.add('is-active');
      panel.style.display = 'block';
      panel.setAttribute('aria-hidden', 'false');

      // Hide other panels
      const allPanels = Array.from(tabsContainer.querySelectorAll('.smart-tab'));
      allPanels.forEach(p => {
        if (p !== panel) {
          p.classList.remove('is-active');
          p.style.display = 'none';
          p.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }
}

// Use event delegation to handle clicks on navigation buttons
// This ensures events are captured even if elements are added dynamically
// Use capture phase to ensure we catch the event early, before smart-tabs/view.js
// Only register once to avoid duplicate event handlers
if (!document.jankxSmartTabAdvancedFilterInitialized) {
  document.addEventListener('click', handleTabNavigationClick, true);
  document.jankxSmartTabAdvancedFilterInitialized = true;
}

/**
 * Handle advanced-filter trigger when tab is clicked
 * 
 * @param {HTMLElement} tabBlock The smart-tab block element (may be null if hideTabContent is enabled)
 * @param {HTMLElement} navButton The navigation button that was clicked
 */
function handleAdvancedFilterTrigger(tabBlock, navButton) {
  console.log('[SmartTab AdvancedFilter] handleAdvancedFilterTrigger called', {
    tabBlock,
    hasTabBlock: !!tabBlock,
    navButton,
    hasNavButton: !!navButton
  });

  // If tabBlock is not available (e.g., when hideTabContent is enabled),
  // we need to get filter data from navigation button or find advanced-filter block elsewhere
  if (!tabBlock && navButton) {
    console.log('[SmartTab AdvancedFilter] Tab block not found (hideTabContent may be enabled), trying to find advanced-filter block directly');

    // Get tab index to match with advanced-filter blocks
    const tabIndex = parseInt(navButton.getAttribute('data-tab-index') || '-1', 10);
    console.log('[SmartTab AdvancedFilter] Tab index from nav button:', tabIndex);

    // Find all advanced-filter blocks in the document
    // These blocks should still be rendered even when hideTabContent is enabled
    // because they are inner blocks of smart-tab, and smart-tab might be rendered elsewhere
    const allAdvancedFilters = Array.from(document.querySelectorAll('[data-filter-type]'));
    console.log('[SmartTab AdvancedFilter] Found all advanced-filter blocks in document', {
      count: allAdvancedFilters.length,
      blocks: allAdvancedFilters.map((block, idx) => ({
        index: idx,
        filterType: block.getAttribute('data-filter-type'),
        taxonomy: block.getAttribute('data-taxonomy'),
        filterValue: block.getAttribute('data-filter-value'),
        parent: block.parentElement?.className
      }))
    });

    // Find the tabs container to scope search
    const tabsContainer = navButton.closest('.smart-tabs');
    let filterBlock = null;

    // Method 1: Try to find advanced-filter block by tab index (if blocks match navigation order)
    if (tabIndex >= 0 && allAdvancedFilters[tabIndex]) {
      filterBlock = allAdvancedFilters[tabIndex];
      console.log('[SmartTab AdvancedFilter] Found advanced-filter block by index', {
        tabIndex,
        filterBlock
      });
    }

    // Method 2: If not found, try to find in the same container as navigation button
    if (!filterBlock && tabsContainer) {
      const filtersInContainer = Array.from(tabsContainer.querySelectorAll('[data-filter-type]'));
      if (filtersInContainer.length > 0) {
        // If only one filter in container, use it
        if (filtersInContainer.length === 1) {
          filterBlock = filtersInContainer[0];
          console.log('[SmartTab AdvancedFilter] Found single advanced-filter block in container', {
            filterBlock
          });
        } else if (tabIndex >= 0 && filtersInContainer[tabIndex]) {
          // If multiple filters, try to match by index
          filterBlock = filtersInContainer[tabIndex];
          console.log('[SmartTab AdvancedFilter] Found advanced-filter block in container by index', {
            tabIndex,
            filterBlock
          });
        }
      }
    }

    // Method 3: If still not found and only one filter exists, use it
    // This handles case where only one tab has advanced-filter
    if (!filterBlock && allAdvancedFilters.length === 1) {
      filterBlock = allAdvancedFilters[0];
      console.log('[SmartTab AdvancedFilter] Using single advanced-filter block in document', {
        filterBlock
      });
    }

    // Method 4: Try to find by matching navigation button order with all filters
    // Get all navigation buttons with advanced-filter trigger to understand structure
    if (!filterBlock && tabsContainer) {
      const allNavButtons = Array.from(tabsContainer.querySelectorAll('.smart-tabs__nav-item[data-trigger="advanced-filter"]'));
      const navButtonIndex = allNavButtons.indexOf(navButton);
      if (navButtonIndex >= 0 && allAdvancedFilters[navButtonIndex]) {
        filterBlock = allAdvancedFilters[navButtonIndex];
        console.log('[SmartTab AdvancedFilter] Found advanced-filter block by navigation button order', {
          navButtonIndex,
          filterBlock
        });
      }
    }
    if (filterBlock) {
      // Create a virtual tabBlock object with the filter block's data
      // We'll use this to extract filter data and triggerSettings
      tabBlock = {
        getAttribute: attr => {
          // Try to get from filter block first
          if (attr === 'data-trigger-settings') {
            // Try to find parent smart-tab with triggerSettings
            const parentTab = filterBlock.closest('.smart-tab[data-trigger-settings]');
            if (parentTab) {
              return parentTab.getAttribute('data-trigger-settings');
            }
            // Try to get from navigation button's data attributes
            const navTriggerSettings = navButton.getAttribute('data-trigger-settings');
            if (navTriggerSettings) {
              return navTriggerSettings;
            }
            // If not found, try to construct from filter block data
            // We need targetBlockId - try to get from filter block's parent or data attributes
            const targetBlockId = filterBlock.getAttribute('data-target-block-id') || filterBlock.closest('[data-block-id]')?.getAttribute('data-block-id');
            if (targetBlockId) {
              return JSON.stringify({
                targetBlockId
              });
            }
          }
          return filterBlock.getAttribute(attr) || filterBlock.closest('.smart-tab')?.getAttribute(attr);
        },
        querySelector: selector => filterBlock.querySelector(selector),
        // Store reference to actual filter block
        _filterBlock: filterBlock
      };
      console.log('[SmartTab AdvancedFilter] Created virtual tabBlock', {
        tabBlock,
        filterBlock
      });
    } else {
      console.warn('[SmartTab AdvancedFilter] Could not find advanced-filter block', {
        tabIndex,
        availableFilters: allAdvancedFilters.length,
        hasTabsContainer: !!tabsContainer
      });
    }
  }
  if (!tabBlock) {
    console.error('[SmartTab AdvancedFilter] Tab block is null or undefined and could not be found');
    return;
  }

  // Get targetBlockId - prioritize data-target-block-id on nav button
  let targetBlockId = null;

  // First, try to get from nav button's data-target-block-id attribute
  if (navButton) {
    targetBlockId = navButton.getAttribute('data-target-block-id');
    if (targetBlockId) {
      console.log('[SmartTab AdvancedFilter] Target block ID from nav button:', targetBlockId);
    }
  }

  // Fallback to triggerSettings if not found on nav button
  if (!targetBlockId) {
    const triggerSettingsData = tabBlock?.getAttribute('data-trigger-settings');
    console.log('[SmartTab AdvancedFilter] Trigger settings data', {
      hasTriggerSettings: !!triggerSettingsData,
      triggerSettingsData
    });
    if (triggerSettingsData) {
      try {
        const triggerSettings = JSON.parse(triggerSettingsData);
        targetBlockId = triggerSettings.targetBlockId;
        console.log('[SmartTab AdvancedFilter] Parsed trigger settings', {
          triggerSettings,
          targetBlockId
        });
      } catch (error) {
        console.error('[SmartTab AdvancedFilter] Error parsing trigger settings:', error, {
          triggerSettingsData
        });
      }
    }
  }
  if (!targetBlockId) {
    // Try to get targetBlockId from navigation button's data-trigger-settings
    if (navButton) {
      const navTriggerSettings = navButton.getAttribute('data-trigger-settings');
      if (navTriggerSettings) {
        try {
          const triggerSettings = JSON.parse(navTriggerSettings);
          targetBlockId = triggerSettings.targetBlockId;
          console.log('[SmartTab AdvancedFilter] Got targetBlockId from navigation button', {
            targetBlockId
          });
        } catch (error) {
          console.error('[SmartTab AdvancedFilter] Error parsing nav button trigger settings:', error);
        }
      }
    }

    // If still no targetBlockId, try to get from filter block's parent (if filter block exists)
    if (!targetBlockId && tabBlock && tabBlock._filterBlock) {
      const filterBlock = tabBlock._filterBlock;
      // Try to find targetBlockId from filter block's parent or nearby elements
      const targetBlock = filterBlock.closest('[data-block-id], [data-query-id]');
      if (targetBlock) {
        targetBlockId = targetBlock.getAttribute('data-block-id') || targetBlock.getAttribute('data-query-id');
        console.log('[SmartTab AdvancedFilter] Got targetBlockId from filter block parent', {
          targetBlockId
        });
      }
    }

    // If still no targetBlockId, search for dynamic-data-layout blocks directly
    if (!targetBlockId && navButton) {
      const tabsContainer = navButton.closest('.smart-tabs');
      let targetBlock = null;

      // First, try to find in tabs container
      if (tabsContainer) {
        const layoutsInContainer = Array.from(tabsContainer.querySelectorAll('[data-block-id], [data-query-id]'));
        if (layoutsInContainer.length > 0) {
          // If only one, use it
          if (layoutsInContainer.length === 1) {
            targetBlock = layoutsInContainer[0];
          } else {
            // If multiple, try to match by tab index
            const tabIndex = parseInt(navButton.getAttribute('data-tab-index') || '-1', 10);
            if (tabIndex >= 0 && layoutsInContainer[tabIndex]) {
              targetBlock = layoutsInContainer[tabIndex];
            } else {
              // Fallback: use first one
              targetBlock = layoutsInContainer[0];
            }
          }
          if (targetBlock) {
            targetBlockId = targetBlock.getAttribute('data-block-id') || targetBlock.getAttribute('data-query-id');
            console.log('[SmartTab AdvancedFilter] Got targetBlockId from dynamic-data-layout in container', {
              targetBlockId,
              tabIndex: parseInt(navButton.getAttribute('data-tab-index') || '-1', 10),
              totalInContainer: layoutsInContainer.length
            });
          }
        }
      }

      // If still not found, search entire document
      if (!targetBlockId) {
        const allLayouts = Array.from(document.querySelectorAll('[data-block-id], [data-query-id]'));
        if (allLayouts.length > 0) {
          // If only one, use it
          if (allLayouts.length === 1) {
            targetBlock = allLayouts[0];
          } else {
            // If multiple, try to match by tab index
            const tabIndex = parseInt(navButton.getAttribute('data-tab-index') || '-1', 10);
            if (tabIndex >= 0 && allLayouts[tabIndex]) {
              targetBlock = allLayouts[tabIndex];
            } else {
              // Fallback: use first one
              targetBlock = allLayouts[0];
            }
          }
          if (targetBlock) {
            targetBlockId = targetBlock.getAttribute('data-block-id') || targetBlock.getAttribute('data-query-id');
            console.log('[SmartTab AdvancedFilter] Got targetBlockId from dynamic-data-layout in document', {
              targetBlockId,
              tabIndex: parseInt(navButton.getAttribute('data-tab-index') || '-1', 10),
              totalLayouts: allLayouts.length
            });
          }
        }
      }
    }
    if (!targetBlockId) {
      const tabBlockAttributes = tabBlock && tabBlock.attributes ? Array.from(tabBlock.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })) : tabBlock && typeof tabBlock === 'object' ? Object.keys(tabBlock) : [];
      console.warn('[SmartTab AdvancedFilter] Missing targetBlockId in triggerSettings', {
        hasTriggerSettings: !!triggerSettingsData,
        triggerSettingsData,
        tabBlockAttributes,
        hasNavButton: !!navButton,
        navButtonTriggerSettings: navButton?.getAttribute('data-trigger-settings')
      });
      return;
    }
  }
  console.log('[SmartTab AdvancedFilter] Target block ID:', targetBlockId);

  // Find advanced-filter inner block in the tab panel
  // Try multiple selectors to find the block
  let advancedFilterBlock = null;

  // Check if tabBlock is a virtual object (created when hideTabContent is enabled)
  if (tabBlock && tabBlock._filterBlock) {
    // Use the stored filter block directly
    advancedFilterBlock = tabBlock._filterBlock;
    console.log('[SmartTab AdvancedFilter] Using stored filter block from virtual tabBlock', {
      advancedFilterBlock
    });
  } else {
    // Normal case: search in tab block
    console.log('[SmartTab AdvancedFilter] Searching for advanced-filter block in tab', {
      tabBlockHTML: tabBlock?.innerHTML?.substring(0, 200)
    });

    // First, try to find in the tab content wrapper
    const tabContent = tabBlock?.querySelector?.('.smart-tab__content');
    console.log('[SmartTab AdvancedFilter] Tab content wrapper', {
      hasTabContent: !!tabContent,
      tabContentHTML: tabContent?.innerHTML?.substring(0, 200)
    });
    if (tabContent) {
      // First, try to find advanced-filter block directly
      advancedFilterBlock = tabContent.querySelector('.wp-block-jankx-advanced-filter');
      console.log('[SmartTab AdvancedFilter] Search result (.wp-block-jankx-advanced-filter):', !!advancedFilterBlock);
      if (!advancedFilterBlock) {
        advancedFilterBlock = tabContent.querySelector('.jankx-advanced-filter');
        console.log('[SmartTab AdvancedFilter] Search result (.jankx-advanced-filter):', !!advancedFilterBlock);
      }
      if (!advancedFilterBlock) {
        advancedFilterBlock = tabContent.querySelector('[data-filter-type]');
        console.log('[SmartTab AdvancedFilter] Search result ([data-filter-type]):', !!advancedFilterBlock);
      }

      // If not found, try to find in advanced-filters block (parent block)
      // After splitting, advanced-filter is a child of advanced-filters
      if (!advancedFilterBlock) {
        const advancedFiltersBlock = tabContent.querySelector('.wp-block-jankx-advanced-filters, .jankx-advanced-filters');
        if (advancedFiltersBlock) {
          console.log('[SmartTab AdvancedFilter] Found advanced-filters block, searching for advanced-filter inside');
          advancedFilterBlock = advancedFiltersBlock.querySelector('.wp-block-jankx-advanced-filter, .jankx-advanced-filter, [data-filter-type]');
          console.log('[SmartTab AdvancedFilter] Search result in advanced-filters block:', !!advancedFilterBlock);
        }
      }
    }

    // If not found, search in the entire tab block
    if (!advancedFilterBlock && tabBlock?.querySelector) {
      advancedFilterBlock = tabBlock.querySelector('.wp-block-jankx-advanced-filter');
      console.log('[SmartTab AdvancedFilter] Search in entire tab (.wp-block-jankx-advanced-filter):', !!advancedFilterBlock);
    }
    if (!advancedFilterBlock && tabBlock?.querySelector) {
      advancedFilterBlock = tabBlock.querySelector('.jankx-advanced-filter');
      console.log('[SmartTab AdvancedFilter] Search in entire tab (.jankx-advanced-filter):', !!advancedFilterBlock);
    }
    if (!advancedFilterBlock && tabBlock?.querySelector) {
      advancedFilterBlock = tabBlock.querySelector('[data-filter-type]');
      console.log('[SmartTab AdvancedFilter] Search in entire tab ([data-filter-type]):', !!advancedFilterBlock);
    }

    // If still not found, try to find in advanced-filters block (parent block) in entire tab
    if (!advancedFilterBlock && tabBlock?.querySelector) {
      const advancedFiltersBlock = tabBlock.querySelector('.wp-block-jankx-advanced-filters, .jankx-advanced-filters');
      if (advancedFiltersBlock) {
        console.log('[SmartTab AdvancedFilter] Found advanced-filters block in entire tab, searching for advanced-filter inside');
        advancedFilterBlock = advancedFiltersBlock.querySelector('.wp-block-jankx-advanced-filter, .jankx-advanced-filter, [data-filter-type]');
        console.log('[SmartTab AdvancedFilter] Search result in advanced-filters block (entire tab):', !!advancedFilterBlock);
      }
    }
  }

  // Try to get filter data from navigation button first (since content might be hidden)
  // This is the primary method when hideContent is enabled
  let filterData = null;
  let filterType = 'taxonomy';
  if (navButton) {
    const navFilterValue = navButton.getAttribute('data-filter-value');
    const navFilterType = navButton.getAttribute('data-filter-type');
    const navTaxonomy = navButton.getAttribute('data-taxonomy');
    const navLabel = navButton.querySelector('.smart-tabs__nav-label')?.textContent?.trim() || '';
    console.log('[SmartTab AdvancedFilter] Navigation button data', {
      navFilterValue,
      navFilterType,
      navTaxonomy,
      navLabel,
      allAttributes: Array.from(navButton.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      }))
    });

    // Try to get taxonomy from navigation button first (set in PHP render)
    // Then from filter block if available
    let taxonomy = navTaxonomy;
    if (!taxonomy && advancedFilterBlock) {
      taxonomy = advancedFilterBlock.getAttribute('data-taxonomy') || '';
    }

    // If filter block not found in tab, try to find it in the document
    if (!taxonomy && !advancedFilterBlock) {
      // Search for filter blocks in the document that might be related to this tab
      const allFilterBlocks = document.querySelectorAll('[data-filter-type="taxonomy"], .wp-block-jankx-advanced-filter[data-taxonomy]');
      if (allFilterBlocks.length > 0) {
        // Use the first filter block found (or match by tab index if possible)
        const filterBlock = allFilterBlocks[0];
        taxonomy = filterBlock.getAttribute('data-taxonomy') || '';
        if (!filterType || filterType === 'taxonomy') {
          filterType = filterBlock.getAttribute('data-filter-type') || 'taxonomy';
        }
        console.log('[SmartTab AdvancedFilter] Found filter block in document', {
          taxonomy,
          filterType,
          filterBlock
        });
      }
    }
    const tabIndex = parseInt(navButton.getAttribute('data-tab-index') || '-1', 10);

    // If we have taxonomy or filter type, create filter data
    if (taxonomy || navFilterType || navFilterValue !== null) {
      filterData = {};
      filterType = navFilterType || filterType || 'taxonomy';
      if (taxonomy) {
        filterData.taxonomy = taxonomy;
      }

      // Get filter value from navigation button
      if (navFilterValue !== null && navFilterValue !== '') {
        filterData.filterValue = navFilterValue;
      } else if (tabIndex >= 0) {
        // Try to get filter value by matching tab index with filter options
        // First try to find filter block to get options
        let filterBlockForOptions = advancedFilterBlock;
        if (!filterBlockForOptions) {
          // Search for filter blocks in the document
          const allFilterBlocks = document.querySelectorAll(`[data-taxonomy="${taxonomy}"], .wp-block-jankx-advanced-filter[data-taxonomy="${taxonomy}"]`);
          if (allFilterBlocks.length > 0) {
            filterBlockForOptions = allFilterBlocks[0];
          }
        }

        // If still not found, try to find in advanced-filters block (parent block)
        // After splitting, advanced-filter is a child of advanced-filters
        if (!filterBlockForOptions && taxonomy) {
          const advancedFiltersBlocks = document.querySelectorAll('.wp-block-jankx-advanced-filters, .jankx-advanced-filters');
          for (const advancedFiltersBlock of advancedFiltersBlocks) {
            const filterBlock = advancedFiltersBlock.querySelector(`[data-taxonomy="${taxonomy}"], .wp-block-jankx-advanced-filter[data-taxonomy="${taxonomy}"]`);
            if (filterBlock) {
              filterBlockForOptions = filterBlock;
              console.log('[SmartTab AdvancedFilter] Found filter block in advanced-filters parent', {
                filterBlockForOptions
              });
              break;
            }
          }
        }
        if (filterBlockForOptions && tabIndex > 0) {
          // For taxonomy filters, try to find option by index (skip index 0 which is usually "All")
          // Filter options might be in advanced-filters block (parent), not in advanced-filter block
          let filterOptions = Array.from(filterBlockForOptions.querySelectorAll('.filter-option, [data-value], input[type="radio"], input[type="checkbox"]'));

          // If no options found in filter block, try to find in parent advanced-filters block
          if (filterOptions.length === 0) {
            const parentAdvancedFilters = filterBlockForOptions.closest('.wp-block-jankx-advanced-filters, .jankx-advanced-filters');
            if (parentAdvancedFilters) {
              filterOptions = Array.from(parentAdvancedFilters.querySelectorAll('.filter-option, [data-value], input[type="radio"], input[type="checkbox"]'));
              console.log('[SmartTab AdvancedFilter] Found filter options in parent advanced-filters block', {
                count: filterOptions.length
              });
            }
          }

          // First, try to match by index
          const optionIndex = tabIndex - 1;
          if (filterOptions.length > optionIndex && optionIndex >= 0) {
            const option = filterOptions[optionIndex];
            // Get data-value (term ID/slug) - DO NOT use text content
            const optionValue = option.getAttribute('data-value') || option.getAttribute('value') || option.value || '';
            if (optionValue) {
              filterData.filterValue = optionValue;
              console.log('[SmartTab AdvancedFilter] Got filter value from option by index', {
                tabIndex,
                optionIndex,
                optionValue,
                option
              });
            }
          }

          // If not found by index, try to match by label text
          if (!filterData.filterValue && navLabel && navLabel !== 'すべて' && navLabel !== 'Tất cả' && navLabel !== 'All') {
            for (const option of filterOptions) {
              const optionText = option.textContent?.trim() || '';
              const optionLabel = option.querySelector('label')?.textContent?.trim() || optionText;

              // Match label with option text
              if (optionLabel === navLabel || optionText === navLabel) {
                // Get data-value (term ID/slug) - DO NOT use text content
                const optionValue = option.getAttribute('data-value') || option.getAttribute('value') || option.value || '';
                if (optionValue) {
                  filterData.filterValue = optionValue;
                  console.log('[SmartTab AdvancedFilter] Got filter value from option by label match', {
                    navLabel,
                    optionLabel,
                    optionValue,
                    option
                  });
                  break;
                }
              }
            }
          }
        }
      }

      // DO NOT use label as filter value - it should be term ID or slug from data-value
      // If no filter value found, it means "All" (empty filter)
      if (!filterData.filterValue) {
        console.log('[SmartTab AdvancedFilter] No filter value found, treating as "All" (empty filter)', {
          navLabel,
          tabIndex
        });
        // For "All" option, filterValue should be empty or 'all'
        // This will be handled in triggerAdvancedFilterFromBlock
      }
      console.log('[SmartTab AdvancedFilter] Got filter data from navigation button', {
        filterData,
        filterType
      });
    }
  }

  // If no filter data from navigation button, try to get from filter block
  if (!filterData && advancedFilterBlock) {
    console.log('[SmartTab AdvancedFilter] Advanced-filter block found, extracting from block', {
      block: advancedFilterBlock,
      attributes: Array.from(advancedFilterBlock.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      }))
    });

    // Get filter type from data attribute
    filterType = advancedFilterBlock.getAttribute('data-filter-type') || 'taxonomy';
    console.log('[SmartTab AdvancedFilter] Filter type:', filterType);

    // Get filter values based on filter type
    filterData = extractFilterDataFromBlock(advancedFilterBlock, filterType);
  }
  console.log('[SmartTab AdvancedFilter] Final extracted filter data', {
    filterType,
    filterData,
    hasAdvancedFilterBlock: !!advancedFilterBlock
  });
  if (filterData) {
    console.log('[SmartTab AdvancedFilter] Triggering filter', {
      targetBlockId,
      filterType,
      filterData
    });
    triggerAdvancedFilterFromBlock(targetBlockId, filterType, filterData);
  } else {
    console.warn('[SmartTab AdvancedFilter] Could not extract filter data', {
      filterType,
      hasAdvancedFilterBlock: !!advancedFilterBlock,
      hasNavButton: !!navButton,
      navButtonAttributes: navButton ? Array.from(navButton.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      })) : []
    });
  }
}

/**
 * Extract filter data from advanced-filter block element
 * 
 * @param {HTMLElement} filterBlock The advanced-filter block element
 * @param {string} filterType The filter type (taxonomy, meta, price, date, author, keyword)
 * @return {Object|null} Filter data object or null
 */
function extractFilterDataFromBlock(filterBlock, filterType) {
  console.log('[SmartTab AdvancedFilter] extractFilterDataFromBlock called', {
    filterBlock,
    filterType,
    hasFilterBlock: !!filterBlock
  });
  if (!filterBlock) {
    console.warn('[SmartTab AdvancedFilter] Filter block is null');
    return null;
  }
  const data = {};
  console.log('[SmartTab AdvancedFilter] Extracting data for filter type:', filterType);
  switch (filterType) {
    case 'taxonomy':
      const taxonomy = filterBlock.getAttribute('data-taxonomy') || '';
      // Try to get filter value from data attribute first
      let filterValue = filterBlock.getAttribute('data-filter-value') || '';
      console.log('[SmartTab AdvancedFilter] Extracting taxonomy filter', {
        taxonomy,
        filterValueFromAttribute: filterValue,
        filterBlockHTML: filterBlock.innerHTML.substring(0, 500)
      });

      // If no value in data attribute, try to find active option in the filter block
      if (!filterValue) {
        // Try to find active filter option button
        const activeOption = filterBlock.querySelector('.filter-option.active, .filter-option.is-active, [class*="filter-option"][class*="active"]');
        if (activeOption) {
          filterValue = activeOption.getAttribute('data-value') || activeOption.getAttribute('value') || activeOption.textContent?.trim() || '';
          console.log('[SmartTab AdvancedFilter] Found active option', {
            activeOption,
            filterValue,
            dataValue: activeOption.getAttribute('data-value'),
            value: activeOption.getAttribute('value')
          });
        }

        // If still no value, try to find checked input/checkbox
        if (!filterValue) {
          const checkedInput = filterBlock.querySelector('input:checked, input[checked]');
          if (checkedInput) {
            filterValue = checkedInput.getAttribute('data-value') || checkedInput.value || '';
            console.log('[SmartTab AdvancedFilter] Found checked input', {
              checkedInput,
              filterValue
            });
          }
        }

        // If still no value, try to find selected option in select
        if (!filterValue) {
          const selectedOption = filterBlock.querySelector('select option:checked, select option[selected]');
          if (selectedOption) {
            filterValue = selectedOption.value || '';
            console.log('[SmartTab AdvancedFilter] Found selected option', {
              selectedOption,
              filterValue
            });
          }
        }

        // If still no value, try to get from first filter option (default)
        if (!filterValue) {
          const firstOption = filterBlock.querySelector('.filter-option, [data-value]');
          if (firstOption) {
            filterValue = firstOption.getAttribute('data-value') || firstOption.getAttribute('value') || '';
            console.log('[SmartTab AdvancedFilter] Using first option as default', {
              firstOption,
              filterValue
            });
          }
        }
      }
      if (taxonomy) {
        data.taxonomy = taxonomy;
        // Always include filterValue, even if empty (for "Tất cả" option)
        data.filterValue = filterValue;
        console.log('[SmartTab AdvancedFilter] Final taxonomy filter data', {
          taxonomy: data.taxonomy,
          filterValue: data.filterValue
        });
      }
      break;
    case 'meta':
      const metaKey = filterBlock.getAttribute('data-meta-key') || '';
      const metaValue = filterBlock.getAttribute('data-filter-value') || '';
      if (metaKey) {
        data.metaKey = metaKey;
        data.filterValue = metaValue;
      }
      break;
    case 'price':
      const minPrice = filterBlock.getAttribute('data-filter-value-min') || '';
      const maxPrice = filterBlock.getAttribute('data-filter-value-max') || '';
      if (minPrice || maxPrice) {
        data.filterValueMin = minPrice;
        data.filterValueMax = maxPrice;
      }
      break;
    case 'date':
      const startDate = filterBlock.getAttribute('data-filter-value-start') || '';
      const endDate = filterBlock.getAttribute('data-filter-value-end') || '';
      if (startDate || endDate) {
        data.filterValueStart = startDate;
        data.filterValueEnd = endDate;
      }
      break;
    case 'author':
      const authorId = filterBlock.getAttribute('data-filter-value') || '';
      if (authorId) {
        data.filterValue = authorId;
      }
      break;
    case 'keyword':
      const keyword = filterBlock.getAttribute('data-filter-value') || '';
      if (keyword) {
        data.filterValue = keyword;
      }
      break;
  }

  // Return data if we have at least the required fields for each type
  // For taxonomy, return data even if filterValue is empty (for "Tất cả" option)
  const hasRequiredData = filterType === 'taxonomy' && data.taxonomy || filterType === 'meta' && data.metaKey || filterType === 'price' && (data.filterValueMin || data.filterValueMax) || filterType === 'date' && (data.filterValueStart || data.filterValueEnd) || filterType === 'author' && data.filterValue || filterType === 'keyword' && data.filterValue;
  console.log('[SmartTab AdvancedFilter] Extracted data result', {
    filterType,
    data,
    hasRequiredData
  });
  return hasRequiredData ? data : null;
}

/**
 * Trigger advanced filter from block data
 * 
 * @param {string} targetBlockId The target dynamic-data-layout block ID
 * @param {string} filterType The filter type
 * @param {Object} filterData Filter data object
 */
function triggerAdvancedFilterFromBlock(targetBlockId, filterType, filterData) {
  console.log('[SmartTab AdvancedFilter] triggerAdvancedFilterFromBlock called', {
    targetBlockId,
    filterType,
    filterData
  });
  if (!targetBlockId) {
    console.warn('[SmartTab AdvancedFilter] Missing targetBlockId');
    return;
  }

  // Build filters payload based on filter type
  let filtersPayload = {};
  console.log('[SmartTab AdvancedFilter] Building filters payload for type:', filterType);
  switch (filterType) {
    case 'taxonomy':
      if (filterData.taxonomy) {
        // If filterValue is empty or 'all', send empty array to show all data
        if (filterData.filterValue && filterData.filterValue !== 'all') {
          filtersPayload[filterData.taxonomy] = [filterData.filterValue];
        } else {
          // Empty array means no filter (show all)
          filtersPayload[filterData.taxonomy] = [];
        }
      }
      break;
    case 'meta':
      if (filterData.metaKey) {
        filtersPayload.meta = {
          [filterData.metaKey]: filterData.filterValue || ''
        };
      }
      break;
    case 'price':
      filtersPayload.price = {
        min: filterData.filterValueMin || '',
        max: filterData.filterValueMax || ''
      };
      break;
    case 'date':
      filtersPayload.date = {
        start: filterData.filterValueStart || '',
        end: filterData.filterValueEnd || ''
      };
      break;
    case 'author':
      if (filterData.filterValue) {
        filtersPayload.author = [filterData.filterValue];
      }
      break;
    case 'keyword':
      if (filterData.filterValue) {
        filtersPayload.keyword = filterData.filterValue;
      }
      break;
  }

  // For taxonomy filter, even if filterValue is empty (show all), we still need to send the request
  // with empty array to clear any existing filters
  console.log('[SmartTab AdvancedFilter] Filters payload built', {
    filtersPayload,
    payloadKeys: Object.keys(filtersPayload)
  });
  if (Object.keys(filtersPayload).length === 0 && filterType !== 'taxonomy') {
    console.warn('[SmartTab AdvancedFilter] Empty filters payload', {
      filterType,
      filterData
    });
    return;
  }
  console.log('[SmartTab AdvancedFilter] Calling fetchDynamicDataLayout', {
    targetBlockId,
    filtersPayload
  });

  // Call direct AJAX to update dynamic-data-layout
  fetchDynamicDataLayout(targetBlockId, filtersPayload);
}

/**
 * Directly fetch and update dynamic-data-layout block via AJAX
 * Uses the same logic as advanced-filters block
 */
function fetchDynamicDataLayout(targetBlockId, filtersPayload) {
  console.log('[SmartTab AdvancedFilter] fetchDynamicDataLayout called', {
    targetBlockId,
    filtersPayload
  });

  // Try multiple selectors to find the target block
  // 1. By class and data attributes (preferred)
  let targetBlock = document.querySelector(`.wp-block-jankx-dynamic-data-layout[data-block-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-data-layout[data-query-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-ssr-layout[data-block-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-ssr-layout[data-query-id="${targetBlockId}"]`);

  // 2. By data attributes only (fallback if class is missing)
  if (!targetBlock) {
    targetBlock = document.querySelector(`[data-block-id="${targetBlockId}"], [data-query-id="${targetBlockId}"]`);
  }

  // 3. By ID (last resort)
  if (!targetBlock) {
    targetBlock = document.getElementById(targetBlockId);
  }
  console.log('[SmartTab AdvancedFilter] Target block search result', {
    targetBlockId,
    found: !!targetBlock,
    targetBlock,
    searchMethods: {
      byClassAndData: !!document.querySelector(`.wp-block-jankx-dynamic-data-layout[data-block-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-data-layout[data-query-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-ssr-layout[data-block-id="${targetBlockId}"], ` + `.wp-block-jankx-dynamic-ssr-layout[data-query-id="${targetBlockId}"]`),
      byDataOnly: !!document.querySelector(`[data-block-id="${targetBlockId}"], [data-query-id="${targetBlockId}"]`),
      byId: !!document.getElementById(targetBlockId)
    },
    allDynamicDataLayouts: Array.from(document.querySelectorAll('.wp-block-jankx-dynamic-data-layout, .wp-block-jankx-dynamic-ssr-layout')).map(block => ({
      blockId: block.getAttribute('data-block-id'),
      queryId: block.getAttribute('data-query-id'),
      id: block.id
    })),
    allBlocksWithDataAttributes: Array.from(document.querySelectorAll('[data-block-id], [data-query-id]')).map(block => ({
      blockId: block.getAttribute('data-block-id'),
      queryId: block.getAttribute('data-query-id'),
      id: block.id,
      className: block.className
    }))
  });
  if (!targetBlock) {
    console.warn(`[SmartTab AdvancedFilter] Dynamic Data Layout block ${targetBlockId} not found for direct AJAX`);
    return;
  }

  // Add loading state to block
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'dynamic-data-layout-loading';
  loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 100px;
        z-index: 9999;
        pointer-events: none;
    `;
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'dynamic-data-layout-spinner';
  loadingSpinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

  // Add spinner animation if not exists
  if (!document.getElementById('dynamic-data-layout-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'dynamic-data-layout-spinner-style';
    style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    document.head.appendChild(style);
  }
  loadingOverlay.appendChild(loadingSpinner);

  // Make targetBlock position relative if not already
  const originalPosition = window.getComputedStyle(targetBlock).position;
  if (originalPosition === 'static') {
    targetBlock.style.position = 'relative';
  }

  // Disable pointer events on targetBlock and add loading overlay
  targetBlock.style.pointerEvents = 'none';
  targetBlock.style.opacity = '0.6';
  targetBlock.appendChild(loadingOverlay);

  // Store original styles to restore later
  const originalPointerEvents = targetBlock.style.pointerEvents;
  const originalOpacity = targetBlock.style.opacity;
  const originalPositionStyle = targetBlock.style.position;

  // Get attributes from data-block-settings or build from data attributes
  let attributesJson = targetBlock.getAttribute('data-block-settings') || '';
  if (!attributesJson) {
    // Build attributes from data attributes (fallback)
    const attributes = {
      queryId: targetBlockId
    };
    const postType = targetBlock.getAttribute('data-post-type');
    if (postType) attributes.postType = postType;
    const layout = targetBlock.getAttribute('data-layout');
    if (layout) attributes.layout = layout;

    // Add more attributes as needed...
    if (Object.keys(attributes).length > 1) {
      attributesJson = JSON.stringify(attributes);
    }
  }

  // Get nonce and AJAX URL from advanced-filters config or global
  let nonce = '';
  let ajaxUrl = '/wp-admin/admin-ajax.php';
  const afConfigEl = document.querySelector('.advanced-filters-config');
  if (afConfigEl) {
    nonce = afConfigEl.getAttribute('data-nonce') || '';
    ajaxUrl = afConfigEl.getAttribute('data-ajax-url') || ajaxUrl;
  } else if (window.jankxAdvancedFilters) {
    nonce = window.jankxAdvancedFilters.nonce || '';
    ajaxUrl = window.jankxAdvancedFilters.ajaxUrl || ajaxUrl;
  }

  // Ensure AJAX URL is absolute
  if (ajaxUrl.startsWith('/')) {
    ajaxUrl = window.location.origin + ajaxUrl;
  } else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
    ajaxUrl = window.location.origin + '/' + ajaxUrl.replace(/^\//, '');
  }
  console.log('[SmartTab AdvancedFilter] AJAX configuration', {
    nonce: nonce ? '***' : '',
    ajaxUrl,
    hasNonce: !!nonce
  });
  if (!nonce) {
    console.error('[SmartTab AdvancedFilter] Nonce is missing! Cannot proceed with AJAX request.');
    return;
  }

  // Get post ID
  let postId = 0;
  try {
    postId = window.wp?.data?.select('core/editor')?.getCurrentPostId?.() || 0;
  } catch (e) {
    // Not in editor
  }
  if (!postId) {
    const bodyPostId = document.body.getAttribute('data-post-id');
    if (bodyPostId) {
      postId = parseInt(bodyPostId) || 0;
    }
  }
  if (!postId) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPostId = urlParams.get('p') || urlParams.get('post') || urlParams.get('post_id');
    if (urlPostId) {
      postId = parseInt(urlPostId) || 0;
    }
  }
  if (!postId) {
    const bodyClasses = document.body.className;
    const postIdMatch = bodyClasses.match(/postid-(\d+)/);
    if (postIdMatch) {
      postId = parseInt(postIdMatch[1]) || 0;
    }
  }
  const params = new URLSearchParams();
  params.append('action', 'jankx_dynamic_data_layout_filter');
  params.append('nonce', nonce);
  params.append('block_id', targetBlockId);
  params.append('attributes', attributesJson || '');
  params.append('filters', JSON.stringify(filtersPayload));
  if (postId > 0) {
    params.append('post_id', String(postId));
  }
  console.log('[SmartTab AdvancedFilter] Sending AJAX request', {
    url: ajaxUrl,
    params: Object.fromEntries(params),
    postId
  });
  fetch(ajaxUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params,
    credentials: 'same-origin'
  }).then(res => {
    console.log('[SmartTab AdvancedFilter] AJAX response received', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok
    });
    return res.json();
  }).then(data => {
    console.log('[SmartTab AdvancedFilter] AJAX response data', {
      success: data?.success,
      hasData: !!data?.data,
      hasHtml: !!data?.data?.html,
      data
    });
    if (!data || !data.success || !data.data || !data.data.html) {
      console.error('[SmartTab AdvancedFilter] Invalid AJAX response', data);
      return;
    }
    const temp = document.createElement('div');
    temp.innerHTML = data.data.html.trim();
    const newEl = temp.firstElementChild;
    if (!newEl) {
      console.error('SmartTab AdvancedFilter: Cannot parse HTML from response');
      return;
    }
    // Remove loading state before replacing block
    if (loadingOverlay && loadingOverlay.parentNode) {
      loadingOverlay.remove();
    }

    // Restore styles before replacing
    if (targetBlock) {
      targetBlock.style.pointerEvents = originalPointerEvents;
      targetBlock.style.opacity = originalOpacity;
      if (originalPosition === 'static') {
        targetBlock.style.position = originalPositionStyle;
      }
    }

    // Update URL params if allowed
    const updateUrlAttr = afConfigEl ? afConfigEl.getAttribute('data-update-url') : null;
    const allowUpdateUrl = updateUrlAttr === null ? window.jankxAdvancedFilters ? window.jankxAdvancedFilters.updateUrl !== false : true : updateUrlAttr !== '0' && updateUrlAttr !== 'false';
    updateUrlWithFilters(filtersPayload, allowUpdateUrl);
    console.log('[SmartTab AdvancedFilter] Replacing target block with new HTML', {
      targetBlock,
      newEl
    });
    targetBlock.replaceWith(newEl);
    console.log('[SmartTab AdvancedFilter] Block replacement completed');
  }).catch(err => {
    console.error('[SmartTab AdvancedFilter] AJAX update failed', err, {
      targetBlockId,
      filtersPayload,
      ajaxUrl
    });

    // Remove loading state on error
    if (loadingOverlay && loadingOverlay.parentNode) {
      loadingOverlay.remove();
    }
    if (targetBlock) {
      targetBlock.style.pointerEvents = originalPointerEvents;
      targetBlock.style.opacity = originalOpacity;
      if (originalPosition === 'static') {
        targetBlock.style.position = originalPositionStyle;
      }
    }
  }).finally(() => {
    // Remove loading state after request completes (if not already replaced)
    if (loadingOverlay && loadingOverlay.parentNode && loadingOverlay.parentNode === targetBlock) {
      loadingOverlay.remove();
    }
    // Restore styles if block still exists (not replaced)
    if (targetBlock && targetBlock.parentNode) {
      targetBlock.style.pointerEvents = originalPointerEvents;
      targetBlock.style.opacity = originalOpacity;
      if (originalPosition === 'static') {
        targetBlock.style.position = originalPositionStyle;
      }
    }
  });
}

/**
 * Update browser URL with current filters (query params) without reloading
 */
function updateUrlWithFilters(filtersPayload, enableUpdateUrl = true) {
  if (!enableUpdateUrl || !filtersPayload || typeof window === 'undefined' || !window.location) {
    return;
  }
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const setParam = (key, value) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  };
  Object.keys(filtersPayload).forEach(key => {
    const value = filtersPayload[key];
    if (key === 'price' && value) {
      setParam('price_min', value.min || '');
      setParam('price_max', value.max || '');
      return;
    }
    if (key === 'date' && value) {
      setParam('date_start', value.start || '');
      setParam('date_end', value.end || '');
      return;
    }
    if (key === 'author') {
      const authorVal = Array.isArray(value) ? value[0] || '' : value;
      setParam('author', authorVal);
      return;
    }
    if (key === 'keyword') {
      setParam('s', value || '');
      return;
    }
    if (key === 'meta' && value && typeof value === 'object') {
      Object.keys(value).forEach(metaKey => {
        setParam(`meta_${metaKey}`, value[metaKey] || '');
      });
      return;
    }
    // default: taxonomy
    if (Array.isArray(value)) {
      setParam(key, value.join(','));
    } else if (value) {
      setParam(key, value);
    } else {
      params.delete(key);
    }
  });
  const newUrl = `${url.origin}${url.pathname}${params.toString() ? `?${params.toString()}` : ''}${url.hash}`;
  window.history.replaceState({}, '', newUrl);
}
/******/ })()
;
//# sourceMappingURL=view.js.map