/******/ (() => { // webpackBootstrap
/*!*********************************************!*\
  !*** ./blocks/advanced-filters/frontend.ts ***!
  \*********************************************/
/**
 * Advanced Filters Block - Frontend JavaScript
 *
 * Handles filter interactions and AJAX updates
 */

class AdvancedFilters {
  config = null;
  container = null;
  currentFilters = {};
  constructor(container) {
    this.container = container;
    this.init();
  }
  init() {
    if (!this.container) return;
    const configElement = this.container.querySelector('.advanced-filters-config');
    if (!configElement) return;
    try {
      const configData = configElement.getAttribute('data-config');
      if (configData) {
        this.config = JSON.parse(configData);
        // Get nonce and AJAX URL from data attributes (fallback to localized script)
        const nonce = configElement.getAttribute('data-nonce') || window.jankxAdvancedFilters?.nonce || '';
        const ajaxUrl = configElement.getAttribute('data-ajax-url') || window.jankxAdvancedFilters?.ajaxUrl || '/wp-admin/admin-ajax.php';

        // Store nonce and AJAX URL in config for later use
        this.config.nonce = nonce;
        this.config.ajaxUrl = ajaxUrl;

        // Load filter values from URL on page load
        this.loadFiltersFromUrl();
        this.setupEventListeners();
      }
    } catch (error) {
      console.error('Error parsing filter config:', error);
    }
  }
  setupEventListeners() {
    if (!this.container || !this.config) return;

    // Taxonomy filters
    this.container.querySelectorAll('.filter-taxonomy input, .filter-taxonomy .filter-option').forEach(element => {
      if (element instanceof HTMLInputElement || element instanceof HTMLElement) {
        element.addEventListener('change', () => this.handleFilterChange());
        if (element instanceof HTMLElement && element.classList.contains('filter-option')) {
          element.addEventListener('click', e => {
            e.preventDefault();

            // Find the parent filter group to check multiple selection setting
            const filterGroup = element.closest('[data-taxonomy]');
            const multipleSelection = filterGroup?.getAttribute('data-multiple-selection') === 'true';
            if (multipleSelection) {
              // Toggle: allow multiple selections
              element.classList.toggle('active');
            } else {
              // Single selection: deactivate siblings, then toggle this one
              const siblings = filterGroup?.querySelectorAll('.filter-option');
              siblings?.forEach(sibling => sibling.classList.remove('active'));
              element.classList.toggle('active');
            }
            this.handleFilterChange();
          });
        }
      }
    });

    // Meta filters
    this.container.querySelectorAll('.filter-meta input, .filter-meta select').forEach(element => {
      element.addEventListener('change', () => this.handleFilterChange());
      element.addEventListener('input', () => {
        if (this.config?.ajaxEnabled) {
          this.debounce(() => this.handleFilterChange(), 500)();
        }
      });
    });

    // Price filters
    this.container.querySelectorAll('.filter-price input').forEach(element => {
      element.addEventListener('input', () => {
        if (this.config?.ajaxEnabled) {
          this.debounce(() => this.handleFilterChange(), 500)();
        }
      });
    });

    // Date filters
    this.container.querySelectorAll('.filter-date input').forEach(element => {
      element.addEventListener('change', () => this.handleFilterChange());
    });

    // Keyword filter
    const keywordInput = this.container.querySelector('.filter-keyword input');
    if (keywordInput) {
      keywordInput.addEventListener('input', () => {
        if (this.config?.ajaxEnabled) {
          this.debounce(() => this.handleFilterChange(), 500)();
        }
      });
    }

    // Reset button
    const resetButton = this.container.querySelector('.filter-reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => this.handleReset());
    }

    // WooCommerce ordering form
    this.setupWooCommerceOrderingListener();
  }

  /**
   * Setup event listener for WooCommerce ordering form
   * 
   * @return void
   */
  setupWooCommerceOrderingListener() {
    // Try to find WooCommerce ordering form
    let woocommerceOrdering = document.querySelector('.woocommerce-ordering .orderby');
    if (!woocommerceOrdering) {
      // Form not found, might not be loaded yet, try again after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.setupWooCommerceOrderingListener();
        });
      } else {
        // If DOM is ready but form not found, try again after a short delay
        // This handles cases where form is rendered dynamically
        setTimeout(() => {
          this.setupWooCommerceOrderingListener();
        }, 500);
      }
      return;
    }

    // Check if listener already attached to avoid duplicate listeners
    if (woocommerceOrdering.__jankxAdvancedFiltersListenerAttached) {
      return;
    }

    // Mark as attached
    woocommerceOrdering.__jankxAdvancedFiltersListenerAttached = true;

    // Prevent default form submission behavior
    const orderingForm = woocommerceOrdering.closest('form.woocommerce-ordering');
    if (orderingForm && !orderingForm.__jankxAdvancedFiltersPreventDefaultAttached) {
      orderingForm.__jankxAdvancedFiltersPreventDefaultAttached = true;
      orderingForm.addEventListener('submit', e => {
        // Only prevent default if AJAX is enabled
        if (this.config && this.config.ajaxEnabled) {
          e.preventDefault();
          e.stopPropagation();
        }
        // If AJAX is not enabled, allow normal form submission
      });
    }

    // Listen for change event on orderby select
    woocommerceOrdering.addEventListener('change', e => {
      e.preventDefault();
      e.stopPropagation();

      // Trigger filter update when orderby changes
      if (this.config && this.config.ajaxEnabled) {
        // Small delay to ensure form doesn't submit
        setTimeout(() => {
          this.handleFilterChange();
        }, 50);
      } else {
        // If AJAX is not enabled, submit the form normally
        if (orderingForm) {
          orderingForm.submit();
        }
      }
    });

    // Also listen for dynamically added forms
    // Use MutationObserver to handle cases where form is added after page load
    if (!document.__jankxAdvancedFiltersOrderingObserver) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              // Check if the added node or its children contain the ordering form
              const newOrdering = element.querySelector?.('.woocommerce-ordering .orderby') || (element.classList?.contains('woocommerce-ordering') ? element.querySelector('.orderby') : null);
              if (newOrdering && !newOrdering.__jankxAdvancedFiltersListenerAttached) {
                // New form found, setup listener
                this.setupWooCommerceOrderingListener();
              }
            }
          });
        });
      });

      // Observe the document body for new elements
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      document.__jankxAdvancedFiltersOrderingObserver = observer;
    }
  }
  handleFilterChange() {
    if (!this.config) return;
    this.collectFilters();
    if (this.config.ajaxEnabled) {
      this.updateViaAjax();
    } else {
      this.updateViaForm();
    }
  }
  collectFilters() {
    if (!this.container) return;
    const filters = {};

    // Collect taxonomy filters
    this.container.querySelectorAll('.filter-taxonomy').forEach(group => {
      const taxonomy = group.getAttribute('data-taxonomy');
      if (!taxonomy) return;
      const selected = [];
      group.querySelectorAll('input:checked, .filter-option.active').forEach(element => {
        if (element instanceof HTMLInputElement) {
          selected.push(element.value);
        } else if (element instanceof HTMLElement) {
          const value = element.getAttribute('data-value');
          if (value) selected.push(value);
        }
      });
      if (selected.length > 0) {
        filters[taxonomy] = selected;
      }
    });

    // Collect meta filters
    this.container.querySelectorAll('.filter-meta').forEach(group => {
      const metaKey = group.getAttribute('data-meta-key');
      if (!metaKey) return;
      const input = group.querySelector('input, select');
      if (input && input.value) {
        filters[`meta_${metaKey}`] = input.value;
      }
    });

    // Collect price filters
    const priceGroup = this.container.querySelector('.filter-price');
    if (priceGroup) {
      const minInput = priceGroup.querySelector('[data-price="min"]');
      const maxInput = priceGroup.querySelector('[data-price="max"]');
      if (minInput?.value || maxInput?.value) {
        filters.price = {
          min: minInput?.value || '',
          max: maxInput?.value || ''
        };
      }
    }

    // Collect date filters
    const dateGroup = this.container.querySelector('.filter-date');
    if (dateGroup) {
      const startInput = dateGroup.querySelector('[data-date="start"]');
      const endInput = dateGroup.querySelector('[data-date="end"]');
      if (startInput?.value || endInput?.value) {
        filters.date = {
          start: startInput?.value || '',
          end: endInput?.value || ''
        };
      }
    }

    // Collect keyword filter
    const keywordInput = this.container.querySelector('.filter-keyword input');
    if (keywordInput?.value) {
      filters.keyword = keywordInput.value;
    }

    // Collect WooCommerce ordering
    const woocommerceOrdering = document.querySelector('.woocommerce-ordering .orderby');
    if (woocommerceOrdering?.value) {
      filters.orderby = woocommerceOrdering.value;
    }
    this.currentFilters = filters;
  }
  async updateViaAjax() {
    if (!this.config || this.config.targetBlockIds.length === 0) return;
    this.showLoading();
    try {
      // Get nonce from config (set in init) or fallback to localized script
      const nonce = this.config?.nonce || window.jankxAdvancedFilters?.nonce || '';
      let ajaxUrl = this.config?.ajaxUrl || window.jankxAdvancedFilters?.ajaxUrl || '/wp-admin/admin-ajax.php';

      // Ensure AJAX URL is absolute
      if (ajaxUrl.startsWith('/')) {
        // Relative URL, make it absolute
        ajaxUrl = window.location.origin + ajaxUrl;
      } else if (!ajaxUrl.startsWith('http://') && !ajaxUrl.startsWith('https://')) {
        // Relative URL without leading slash, add origin
        ajaxUrl = window.location.origin + '/' + ajaxUrl.replace(/^\//, '');
      }
      if (!nonce) {
        console.error('Nonce is missing! Cannot proceed with AJAX request.');
        alert('Security error: Please refresh the page and try again.');
        this.hideLoading();
        return;
      }

      // Get current post ID if available - try multiple methods
      let postId = 0;

      // Method 1: From WordPress editor (admin)
      try {
        postId = window.wp?.data?.select('core/editor')?.getCurrentPostId?.() || 0;
      } catch (e) {
        // Not in editor
      }

      // Method 2: From body data attribute
      if (!postId) {
        const bodyPostId = document.body.getAttribute('data-post-id');
        if (bodyPostId) {
          postId = parseInt(bodyPostId) || 0;
        }
      }

      // Method 3: From URL query string
      if (!postId) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPostId = urlParams.get('p') || urlParams.get('post') || urlParams.get('post_id');
        if (urlPostId) {
          postId = parseInt(urlPostId) || 0;
        }
      }

      // Method 4: From body classes (WordPress adds postid-{ID} class)
      if (!postId) {
        const bodyClasses = document.body.className;
        const postIdMatch = bodyClasses.match(/postid-(\d+)/);
        if (postIdMatch) {
          postId = parseInt(postIdMatch[1]) || 0;
        }
      }

      // Use DynamicDataLayoutBlock's AJAX handler
      // Process each target block individually
      const updatePromises = this.config.targetBlockIds.map(async blockId => {
        // Get block attributes from DOM if available
        const targetBlock = document.querySelector(`[data-query-id="${blockId}"], [data-block-id="${blockId}"]`);
        let attributesJson = '';
        if (targetBlock) {
          // Try to get data-block-settings first (for PostTypeLayoutBlock)
          const blockSettings = targetBlock.getAttribute('data-block-settings');
          if (blockSettings) {
            attributesJson = blockSettings;
          } else {
            // For DynamicDataLayoutBlock, build attributes from data attributes
            const attributes = {
              queryId: blockId
            };

            // Collect all data attributes
            const postType = targetBlock.getAttribute('data-post-type');
            if (postType) attributes.postType = postType;
            const layout = targetBlock.getAttribute('data-layout');
            if (layout) attributes.layout = layout;
            const postsPerPage = targetBlock.getAttribute('data-posts-per-page');
            if (postsPerPage) attributes.postsPerPage = parseInt(postsPerPage, 10);
            const columns = targetBlock.getAttribute('data-columns');
            if (columns) attributes.columns = parseInt(columns, 10);
            const columnsTablet = targetBlock.getAttribute('data-columns-tablet');
            if (columnsTablet) attributes.columnsTablet = parseInt(columnsTablet, 10);
            const columnsMobile = targetBlock.getAttribute('data-columns-mobile');
            if (columnsMobile) attributes.columnsMobile = parseInt(columnsMobile, 10);
            const orderBy = targetBlock.getAttribute('data-order-by');
            if (orderBy) attributes.orderBy = orderBy;
            const order = targetBlock.getAttribute('data-order');
            if (order) attributes.order = order;
            const queryPreset = targetBlock.getAttribute('data-query-preset');
            if (queryPreset) attributes.queryPreset = queryPreset;
            const imageRatio = targetBlock.getAttribute('data-image-ratio');
            if (imageRatio) attributes.imageRatio = imageRatio;
            const thumbnailPosition = targetBlock.getAttribute('data-thumbnail-position');
            if (thumbnailPosition) attributes.thumbnailPosition = thumbnailPosition;

            // Convert to JSON if we have any attributes
            if (Object.keys(attributes).length > 1) {
              // More than just queryId
              attributesJson = JSON.stringify(attributes);
            }
          }
        }

        // If still no attributes, log warning but continue (server will try to find block)
        if (!attributesJson) {
          console.warn(`AdvancedFilters: Could not find block attributes for block ${blockId}, server will try to detect from block_id`);
        }
        const params = new URLSearchParams({
          action: 'jankx_post_type_layout_filter',
          nonce: nonce,
          block_id: blockId,
          attributes: attributesJson,
          filters: JSON.stringify(this.currentFilters)
        });

        // Always send post_id if we have it
        if (postId > 0) {
          params.append('post_id', String(postId));
        } else {
          console.warn('AdvancedFilters: Could not determine post_id, server will try to detect it');
        }
        let response;
        try {
          response = await fetch(ajaxUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params,
            credentials: 'same-origin' // Include cookies for WordPress
          });
        } catch (fetchError) {
          // Network error - could be CORS, connection issue, or page redirect
          console.error(`Network error when fetching filter update for block ${blockId}:`, fetchError);

          // If it's a NetworkError, the page might be redirecting
          if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
            console.warn('Possible page redirect detected, falling back to form submission');
            // Don't throw error, just return null to skip this block update
            return null;
          }
          throw fetchError;
        }
        if (!response.ok) {
          let errorText = '';
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = `HTTP ${response.status} ${response.statusText}`;
          }
          console.error(`Filter update failed for block ${blockId}:`, response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error(`Failed to parse JSON response for block ${blockId}:`, jsonError);
          throw new Error('Invalid JSON response from server');
        }
        if (data.success && data.data) {
          return {
            blockId: blockId,
            html: data.data.html
          };
        } else {
          const errorMessage = data?.data?.message || data?.data || 'Unknown error';
          console.error(`Filter update failed for block ${blockId}:`, errorMessage);
          throw new Error(errorMessage);
        }
      });

      // Wait for all blocks to update (filter out null results)
      const results = await Promise.all(updatePromises);
      const validResults = results.filter(result => result !== null);
      if (validResults.length === 0) {
        console.warn('No valid results from filter update');
        this.hideLoading();
        return;
      }

      // Update target blocks
      const resultsMap = {};
      validResults.forEach(result => {
        resultsMap[result.blockId] = result.html;
      });
      this.updateTargetBlocks(resultsMap);
      if (this.config.updateUrl) {
        this.updateUrl();
      }
      if (this.config.scrollToResults) {
        this.scrollToResults();
      }
    } catch (error) {
      console.error('Error updating filters:', error);
      alert(`Error updating filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.hideLoading();
    }
  }
  updateViaForm() {
    if (!this.container) return;
    const form = this.container.closest('form');
    if (form) {
      form.submit();
    }
  }
  updateTargetBlocks(data) {
    Object.entries(data).forEach(([blockId, html]) => {
      // Try multiple selectors to find the target block
      let targetElement = document.querySelector(`[data-block-id="${blockId}"]`);
      if (!targetElement) {
        // Try by queryId attribute if present in the rendered HTML
        targetElement = document.querySelector(`[data-query-id="${blockId}"]`);
      }
      if (!targetElement) {
        // Try by ID
        targetElement = document.getElementById(`block-${blockId}`);
      }
      if (!targetElement) {
        // Try finding by class and queryId data attribute
        const blocks = document.querySelectorAll('.wp-block-jankx-dynamic-data-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        // Remove loading spinner before updating content
        const existingLoading = targetElement.querySelector('.dynamic-data-layout-loading');
        if (existingLoading) {
          existingLoading.remove();
        }

        // Parse the returned HTML and replace only the inner content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html.trim();
        const newContent = tempDiv.firstElementChild;
        if (newContent) {
          targetElement.replaceWith(newContent);
          // Update reference to the new element
          targetElement = newContent;

          // Re-initialize any scripts that might be needed (e.g., carousel, load-more)
          this.reinitializeBlockScripts(targetElement);
        } else {
          // Fallback: just replace innerHTML
          targetElement.innerHTML = html;
        }
      } else {
        console.warn(`AdvancedFiltersBlock: Target block with ID "${blockId}" not found in DOM`);
      }
    });
  }
  reinitializeBlockScripts(element) {
    // Re-initialize carousel if present
    if (element.querySelector('.dynamic-data-layout-carousel')) {
      // Trigger any carousel initialization scripts
      const event = new CustomEvent('jankx:reinitialize-carousel', {
        detail: {
          element
        }
      });
      document.dispatchEvent(event);
    }

    // Re-initialize load-more buttons if present
    if (element.querySelector('.jankx-load-more-button')) {
      // Trigger load-more initialization
      const event = new CustomEvent('jankx:reinitialize-load-more', {
        detail: {
          element
        }
      });
      document.dispatchEvent(event);
    }
  }
  updateUrl() {
    const url = new URL(window.location.href);
    Object.entries(this.currentFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        url.searchParams.set(key, value.join(','));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          if (v) url.searchParams.set(`${key}_${k}`, String(v));
        });
      } else {
        url.searchParams.set(key, String(value));
      }
    });
    window.history.pushState({}, '', url.toString());
  }
  scrollToResults() {
    if (this.config && this.config.targetBlockIds.length > 0) {
      const firstTarget = document.querySelector(`[data-block-id="${this.config.targetBlockIds[0]}"]`);
      if (firstTarget) {
        firstTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }
  handleReset() {
    if (!this.container) return;
    this.container.querySelectorAll('input, select').forEach(element => {
      if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = false;
        } else {
          element.value = '';
        }
      } else if (element instanceof HTMLSelectElement) {
        element.selectedIndex = 0;
      }
    });
    this.container.querySelectorAll('.filter-option').forEach(element => {
      element.classList.remove('active');
    });
    this.currentFilters = {};
    this.handleFilterChange();
  }
  showLoading() {
    if (!this.config || !this.config.targetBlockIds) return;

    // Show loading spinner on target blocks (dynamic-data-layout blocks)
    this.config.targetBlockIds.forEach(blockId => {
      let targetElement = document.querySelector(`[data-block-id="${blockId}"], [data-query-id="${blockId}"]`);
      if (!targetElement) {
        // Try finding by class and queryId data attribute
        const blocks = document.querySelectorAll('.wp-block-jankx-dynamic-data-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        // Create or get loading element
        let loading = targetElement.querySelector('.dynamic-data-layout-loading');
        if (!loading) {
          // Create loading element if it doesn't exist
          loading = document.createElement('div');
          loading.className = 'dynamic-data-layout-loading';
          loading.innerHTML = '<div class="dynamic-data-layout-spinner"></div>';
          targetElement.appendChild(loading);
        }
        loading.classList.add('active');
      }
    });
  }
  hideLoading() {
    if (!this.config || !this.config.targetBlockIds) return;

    // Hide loading spinner on target blocks
    this.config.targetBlockIds.forEach(blockId => {
      let targetElement = document.querySelector(`[data-block-id="${blockId}"], [data-query-id="${blockId}"]`);
      if (!targetElement) {
        // Try finding by class and queryId data attribute
        const blocks = document.querySelectorAll('.wp-block-jankx-dynamic-data-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        const loading = targetElement.querySelector('.dynamic-data-layout-loading');
        if (loading) {
          loading.classList.remove('active');
        }
      }
    });
  }
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Load filter values from URL query string on page load
   * This ensures filters persist after page reload
   */
  loadFiltersFromUrl() {
    if (!this.container) return;
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {};

    // Get all public taxonomies from config
    const taxonomyFilters = this.config?.taxonomyFilters || [];
    const taxonomySlugs = taxonomyFilters.map(f => f.taxonomy).filter(Boolean);

    // Load taxonomy filters
    taxonomySlugs.forEach(taxonomy => {
      const value = urlParams.get(taxonomy);
      if (value) {
        const termIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (termIds.length > 0) {
          filters[taxonomy] = termIds;
        }
      }
    });

    // Load keyword filter
    const keyword = urlParams.get('keyword');
    if (keyword) {
      filters.keyword = keyword;
    }

    // Load meta filters
    urlParams.forEach((value, key) => {
      if (key.startsWith('meta_')) {
        filters[key] = value;
      }
    });

    // Load price filters
    const priceMin = urlParams.get('price_min');
    const priceMax = urlParams.get('price_max');
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.min = priceMin;
      if (priceMax) filters.price.max = priceMax;
    }

    // Load date filters
    const dateStart = urlParams.get('date_start');
    const dateEnd = urlParams.get('date_end');
    if (dateStart || dateEnd) {
      filters.date = {};
      if (dateStart) filters.date.start = dateStart;
      if (dateEnd) filters.date.end = dateEnd;
    }

    // Load author filter
    const author = urlParams.get('author');
    if (author) {
      const authorIds = author.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (authorIds.length > 0) {
        filters.author = authorIds;
      }
    }

    // Apply filters to UI
    if (Object.keys(filters).length > 0) {
      this.currentFilters = filters;
      this.applyFiltersToUI(filters);
    }
  }

  /**
   * Apply filter values to UI elements
   */
  applyFiltersToUI(filters) {
    if (!this.container) return;

    // Apply taxonomy filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Taxonomy or author filters
        const filterGroup = this.container.querySelector(`[data-taxonomy="${key}"], [data-filter-type="author"]`);
        if (filterGroup) {
          value.forEach(termId => {
            const input = filterGroup.querySelector(`input[value="${termId}"]`);
            if (input) {
              input.checked = true;
            }
            // Also add active class for styling consistency
            const option = filterGroup.querySelector(`[data-value="${termId}"]`);
            if (option) {
              option.classList.add('active');
            }
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        // Price or date filters
        if (key === 'price') {
          const priceGroup = this.container.querySelector('.filter-price');
          if (priceGroup) {
            const minInput = priceGroup.querySelector('[name="price_min"]');
            const maxInput = priceGroup.querySelector('[name="price_max"]');
            if (minInput && value.min) minInput.value = value.min;
            if (maxInput && value.max) maxInput.value = value.max;
          }
        } else if (key === 'date') {
          const dateGroup = this.container.querySelector('.filter-date');
          if (dateGroup) {
            const startInput = dateGroup.querySelector('[name="date_start"]');
            const endInput = dateGroup.querySelector('[name="date_end"]');
            if (startInput && value.start) startInput.value = value.start;
            if (endInput && value.end) endInput.value = value.end;
          }
        }
      } else if (key === 'keyword') {
        // Keyword filter
        const keywordInput = this.container.querySelector('.filter-keyword input');
        if (keywordInput) {
          keywordInput.value = value;
        }
      } else if (key.startsWith('meta_')) {
        // Meta filter
        const metaKey = key.replace('meta_', '');
        const metaGroup = this.container.querySelector(`[data-meta-key="${metaKey}"]`);
        if (metaGroup) {
          const input = metaGroup.querySelector('input, select');
          if (input) {
            input.value = value;
          }
        }
      }
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvancedFilters);
} else {
  initAdvancedFilters();
}
function initAdvancedFilters() {
  document.querySelectorAll('.wp-block-jankx-advanced-filters').forEach(container => {
    if (container instanceof HTMLElement) {
      new AdvancedFilters(container);
    }
  });
}

// Export for potential external use
if (typeof window !== 'undefined') {
  window.AdvancedFilters = AdvancedFilters;
}
/******/ })()
;
//# sourceMappingURL=frontend.js.map