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
            element.classList.toggle('active');
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
    this.currentFilters = filters;
  }
  async updateViaAjax() {
    if (!this.config || this.config.targetBlockIds.length === 0) return;
    this.showLoading();
    try {
      // Get nonce from config (set in init) or fallback to localized script
      const nonce = this.config?.nonce || window.jankxAdvancedFilters?.nonce || '';
      const ajaxUrl = this.config?.ajaxUrl || window.jankxAdvancedFilters?.ajaxUrl || '/wp-admin/admin-ajax.php';
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

      // Use PostTypeLayoutBlock's AJAX handler
      // Process each target block individually
      const updatePromises = this.config.targetBlockIds.map(async blockId => {
        // Get block attributes from DOM if available
        const targetBlock = document.querySelector(`[data-query-id="${blockId}"], [data-block-id="${blockId}"]`);
        let attributesJson = '';
        if (targetBlock) {
          const blockSettings = targetBlock.getAttribute('data-block-settings');
          if (blockSettings) {
            attributesJson = blockSettings;
          }
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
          console.log('AdvancedFilters: Sending post_id:', postId);
        } else {
          console.warn('AdvancedFilters: Could not determine post_id, server will try to detect it');
        }
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Filter update failed for block ${blockId}:`, response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
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

      // Wait for all blocks to update
      const results = await Promise.all(updatePromises);

      // Update target blocks
      const resultsMap = {};
      results.forEach(result => {
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
        const blocks = document.querySelectorAll('.wp-block-jankx-post-type-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        // Remove loading spinner before updating content
        const existingLoading = targetElement.querySelector('.post-type-layout-loading');
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
    if (element.querySelector('.post-type-layout-carousel')) {
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

    // Show loading spinner on target blocks (post-type-layout blocks)
    this.config.targetBlockIds.forEach(blockId => {
      let targetElement = document.querySelector(`[data-block-id="${blockId}"], [data-query-id="${blockId}"]`);
      if (!targetElement) {
        // Try finding by class and queryId data attribute
        const blocks = document.querySelectorAll('.wp-block-jankx-post-type-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        // Create or get loading element
        let loading = targetElement.querySelector('.post-type-layout-loading');
        if (!loading) {
          // Create loading element if it doesn't exist
          loading = document.createElement('div');
          loading.className = 'post-type-layout-loading';
          loading.innerHTML = '<div class="post-type-layout-spinner"></div>';
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
        const blocks = document.querySelectorAll('.wp-block-jankx-post-type-layout');
        blocks.forEach(block => {
          const queryId = block.getAttribute('data-query-id');
          if (queryId === blockId) {
            targetElement = block;
          }
        });
      }
      if (targetElement) {
        const loading = targetElement.querySelector('.post-type-layout-loading');
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
            } else {
              // Try button/option style
              const option = filterGroup.querySelector(`[data-value="${termId}"]`);
              if (option) {
                option.classList.add('active');
              }
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