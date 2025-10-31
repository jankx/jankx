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
      const response = await fetch(window.jankxAdvancedFilters?.ajaxUrl || '/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          action: 'jankx_advanced_filters_update',
          nonce: window.jankxAdvancedFilters?.nonce || '',
          target_blocks: JSON.stringify(this.config.targetBlockIds),
          filters: JSON.stringify(this.currentFilters)
        })
      });
      const data = await response.json();
      if (data.success) {
        this.updateTargetBlocks(data.data);
        if (this.config.updateUrl) {
          this.updateUrl();
        }
        if (this.config.scrollToResults) {
          this.scrollToResults();
        }
      } else {
        console.error('Filter update failed:', data.data);
      }
    } catch (error) {
      console.error('Error updating filters:', error);
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
      const targetElement = document.querySelector(`[data-block-id="${blockId}"]`);
      if (targetElement) {
        targetElement.innerHTML = html;
      }
    });
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
    if (!this.container) return;
    const loading = this.container.querySelector('.filter-loading');
    if (loading) {
      loading.classList.add('active');
    }
  }
  hideLoading() {
    if (!this.container) return;
    const loading = this.container.querySelector('.filter-loading');
    if (loading) {
      loading.classList.remove('active');
    }
  }
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
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