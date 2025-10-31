/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./blocks/advanced-filter/frontend.js ***!
  \********************************************/
/**
 * Advanced Filter Frontend JavaScript
 *
 * Xử lý tương tác filter trên frontend với AJAX
 */

(function ($) {
  'use strict';

  class AdvancedFilter {
    constructor(element) {
      this.element = $(element);
      this.config = this.parseConfig();
      this.targets = this.config.targetBlocks || [];
      this.filters = this.config.filters || {};
      this.ajaxSettings = this.config.ajaxSettings || {};
      this.displaySettings = this.config.displaySettings || {};
      this.styling = this.config.styling || {};
      this.isLoading = false;
      this.debounceTimer = null;
      this.init();
    }
    parseConfig() {
      const configElement = this.element.find('.jankx-advanced-filter-config');
      if (configElement.length === 0) {
        return {};
      }
      try {
        return JSON.parse(configElement.data('config'));
      } catch (e) {
        console.error('Error parsing filter config:', e);
        return {};
      }
    }
    init() {
      this.renderFilters();
      this.bindEvents();
      this.applyStyling();
    }
    renderFilters() {
      const content = this.element.find('.jankx-advanced-filter-content');
      content.empty();

      // Render taxonomy filters
      if (this.filters.taxonomy) {
        this.renderTaxonomyFilters();
      }

      // Render meta filters
      if (this.filters.meta) {
        this.renderMetaFilters();
      }

      // Render custom filters
      if (this.filters.custom) {
        this.renderCustomFilters();
      }

      // Render date filters
      if (this.filters.date) {
        this.renderDateFilters();
      }

      // Render price filters
      if (this.filters.price) {
        this.renderPriceFilters();
      }

      // Render reset button
      if (this.displaySettings.showReset) {
        this.renderResetButton();
      }
    }
    renderTaxonomyFilters() {
      const taxonomyFilters = this.filters.taxonomy;
      Object.keys(taxonomyFilters).forEach(taxonomy => {
        const filter = taxonomyFilters[taxonomy];
        this.renderTaxonomyFilter(taxonomy, filter);
      });
    }
    renderTaxonomyFilter(taxonomy, filter) {
      const container = $('<div class="jankx-filter-taxonomy"></div>');

      // Label
      if (this.displaySettings.showLabel) {
        const label = $('<label class="jankx-filter-label"></label>');
        label.text(this.displaySettings.labelText || 'Lọc theo:');
        container.append(label);
      }

      // Load terms via AJAX
      this.loadTaxonomyTerms(taxonomy, filter, container);
      this.element.find('.jankx-advanced-filter-content').append(container);
    }
    loadTaxonomyTerms(taxonomy, filter, container) {
      $.ajax({
        url: window.ajaxurl || '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: {
          action: 'jankx_advanced_filter_get_terms',
          taxonomy: taxonomy,
          post_type: this.config.postType || 'post'
        },
        success: response => {
          if (response.success) {
            this.renderTaxonomyOptions(response.data, filter, container);
          }
        },
        error: (xhr, status, error) => {
          console.error('Error loading taxonomy terms:', error);
        }
      });
    }
    renderTaxonomyOptions(terms, filter, container) {
      const optionsContainer = $('<div class="jankx-filter-options"></div>');

      // Show all option
      if (filter.showAll) {
        const allOption = $('<label class="jankx-filter-option jankx-filter-all"></label>');
        allOption.html(`
                    <input type="radio" name="${filter.taxonomy}" value="" checked>
                    <span>${filter.allText || 'Tất cả'}</span>
                `);
        optionsContainer.append(allOption);
      }

      // Terms options
      terms.forEach(term => {
        const option = $('<label class="jankx-filter-option"></label>');
        const count = filter.showCount ? ` (${term.count})` : '';
        const inputType = filter.multiple ? 'checkbox' : 'radio';
        const name = filter.multiple ? `${filter.taxonomy}[]` : filter.taxonomy;
        option.html(`
                    <input type="${inputType}" name="${name}" value="${term.id}">
                    <span>${term.name}${count}</span>
                `);
        optionsContainer.append(option);
      });
      container.append(optionsContainer);
    }
    renderMetaFilters() {
      const metaFilters = this.filters.meta;
      metaFilters.forEach(filter => {
        if (!filter.enabled) return;
        const container = $('<div class="jankx-filter-meta"></div>');

        // Label
        if (this.displaySettings.showLabel) {
          const label = $('<label class="jankx-filter-label"></label>');
          label.text(filter.label || 'Meta Filter');
          container.append(label);
        }

        // Input based on type
        const input = this.createMetaInput(filter);
        container.append(input);
        this.element.find('.jankx-advanced-filter-content').append(container);
      });
    }
    createMetaInput(filter) {
      const type = filter.type || 'text';
      const name = filter.metaKey;
      const placeholder = filter.placeholder || 'Nhập giá trị...';
      switch (type) {
        case 'text':
          return $(`<input type="text" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
        case 'number':
          return $(`<input type="number" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
        case 'date':
          return $(`<input type="date" name="${name}" class="jankx-filter-input">`);
        case 'select':
          return this.createSelectInput(filter);
        case 'checkbox':
          return $(`<label class="jankx-filter-checkbox"><input type="checkbox" name="${name}"> ${filter.label || 'Yes'}</label>`);
        default:
          return $(`<input type="text" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
      }
    }
    createSelectInput(filter) {
      const select = $(`<select name="${filter.metaKey}" class="jankx-filter-select"></select>`);
      select.append(`<option value="">${filter.placeholder || 'Chọn...'}</option>`);

      // Load options via AJAX if needed
      this.loadSelectOptions(filter, select);
      return select;
    }
    loadSelectOptions(filter, select) {
      // This would load options for select inputs
      // Implementation depends on specific needs
    }
    renderCustomFilters() {
      const customFilters = this.filters.custom;
      customFilters.forEach(filter => {
        if (!filter.enabled) return;
        const container = $('<div class="jankx-filter-custom"></div>');

        // Label
        if (this.displaySettings.showLabel) {
          const label = $('<label class="jankx-filter-label"></label>');
          label.text(filter.label || 'Custom Filter');
          container.append(label);
        }

        // Input
        const input = this.createCustomInput(filter);
        container.append(input);
        this.element.find('.jankx-advanced-filter-content').append(container);
      });
    }
    createCustomInput(filter) {
      const type = filter.type || 'text';
      const name = filter.field;
      const placeholder = filter.placeholder || 'Nhập giá trị...';
      switch (type) {
        case 'text':
          return $(`<input type="text" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
        case 'number':
          return $(`<input type="number" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
        case 'date':
          return $(`<input type="date" name="${name}" class="jankx-filter-input">`);
        case 'checkbox':
          return $(`<label class="jankx-filter-checkbox"><input type="checkbox" name="${name}"> ${filter.label || 'Yes'}</label>`);
        default:
          return $(`<input type="text" name="${name}" placeholder="${placeholder}" class="jankx-filter-input">`);
      }
    }
    renderDateFilters() {
      const dateFilters = this.filters.date;
      dateFilters.forEach(filter => {
        if (!filter.enabled) return;
        const container = $('<div class="jankx-filter-date"></div>');

        // Label
        if (this.displaySettings.showLabel) {
          const label = $('<label class="jankx-filter-label"></label>');
          label.text(filter.label || 'Date Range');
          container.append(label);
        }

        // Date inputs
        const dateContainer = $('<div class="jankx-filter-date-range"></div>');
        dateContainer.html(`
                    <input type="date" name="start_date" placeholder="Từ ngày" class="jankx-filter-input">
                    <span class="jankx-filter-separator">-</span>
                    <input type="date" name="end_date" placeholder="Đến ngày" class="jankx-filter-input">
                `);
        container.append(dateContainer);
        this.element.find('.jankx-advanced-filter-content').append(container);
      });
    }
    renderPriceFilters() {
      const priceFilters = this.filters.price;
      priceFilters.forEach(filter => {
        if (!filter.enabled) return;
        const container = $('<div class="jankx-filter-price"></div>');

        // Label
        if (this.displaySettings.showLabel) {
          const label = $('<label class="jankx-filter-label"></label>');
          label.text(filter.label || 'Price Range');
          container.append(label);
        }

        // Price inputs
        const priceContainer = $('<div class="jankx-filter-price-range"></div>');
        priceContainer.html(`
                    <input type="number" name="min_price" placeholder="Giá tối thiểu" class="jankx-filter-input">
                    <span class="jankx-filter-separator">-</span>
                    <input type="number" name="max_price" placeholder="Giá tối đa" class="jankx-filter-input">
                    <span class="jankx-filter-currency">${filter.currency || 'VND'}</span>
                `);
        container.append(priceContainer);
        this.element.find('.jankx-advanced-filter-content').append(container);
      });
    }
    renderResetButton() {
      const resetContainer = $('<div class="jankx-filter-reset"></div>');
      const resetButton = $('<button type="button" class="jankx-filter-reset-btn"></button>');
      resetButton.text(this.displaySettings.resetText || 'Xóa bộ lọc');
      resetContainer.append(resetButton);
      this.element.find('.jankx-advanced-filter-content').append(resetContainer);
    }
    bindEvents() {
      // Filter change events
      this.element.on('change', 'input, select', e => {
        this.handleFilterChange(e);
      });

      // Reset button
      this.element.on('click', '.jankx-filter-reset-btn', e => {
        e.preventDefault();
        this.resetFilters();
      });

      // Debounced input events
      this.element.on('input', 'input[type="text"], input[type="number"]', e => {
        this.handleFilterInput(e);
      });
    }
    handleFilterChange(e) {
      if (this.ajaxSettings.enabled) {
        this.debounceFilter();
      }
    }
    handleFilterInput(e) {
      if (this.ajaxSettings.enabled) {
        this.debounceFilter();
      }
    }
    debounceFilter() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.applyFilters();
      }, this.ajaxSettings.debounceDelay || 300);
    }
    applyFilters() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.showLoading();
      const filterData = this.collectFilterData();
      $.ajax({
        url: window.ajaxurl || '/wp-admin/admin-ajax.php',
        type: 'POST',
        data: {
          action: 'jankx_advanced_filter_get_data',
          filter_config: JSON.stringify(this.config),
          target_blocks: JSON.stringify(this.targets),
          filters: JSON.stringify(filterData),
          nonce: this.getNonce()
        },
        success: response => {
          if (response.success) {
            this.updateTargets(response.data.results);
            this.hideLoading();
          } else {
            this.showError(response.data || 'Có lỗi xảy ra');
          }
        },
        error: (xhr, status, error) => {
          this.showError(this.ajaxSettings.errorText || 'Có lỗi xảy ra');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
    collectFilterData() {
      const data = {
        taxonomy: {},
        meta: [],
        custom: [],
        date: [],
        price: []
      };

      // Collect taxonomy data
      this.element.find('input[name$="[]"]:checked, input[name]:not([name$="[]"]):checked').each(function () {
        const $input = $(this);
        const name = $input.attr('name');
        if (name.includes('[]')) {
          const taxonomy = name.replace('[]', '');
          if (!data.taxonomy[taxonomy]) {
            data.taxonomy[taxonomy] = [];
          }
          data.taxonomy[taxonomy].push($input.val());
        }
      });

      // Collect meta data
      this.element.find('input[name], select[name]').each(function () {
        const $input = $(this);
        const name = $input.attr('name');
        const value = $input.val();
        if (value && !name.includes('[]') && !name.includes('_date') && !name.includes('_price')) {
          data.meta.push({
            metaKey: name,
            value: value,
            operator: 'equals'
          });
        }
      });

      // Collect date data
      const startDate = this.element.find('input[name="start_date"]').val();
      const endDate = this.element.find('input[name="end_date"]').val();
      if (startDate || endDate) {
        data.date.push({
          field: 'post_date',
          startDate: startDate,
          endDate: endDate
        });
      }

      // Collect price data
      const minPrice = this.element.find('input[name="min_price"]').val();
      const maxPrice = this.element.find('input[name="max_price"]').val();
      if (minPrice || maxPrice) {
        data.price.push({
          field: 'price',
          minPrice: minPrice,
          maxPrice: maxPrice
        });
      }
      return data;
    }
    updateTargets(results) {
      Object.keys(results).forEach(blockId => {
        const result = results[blockId];
        const target = this.targets.find(t => t.blockId === blockId);
        if (target) {
          const $targetElement = $(target.selector);
          if ($targetElement.length) {
            $targetElement.html(result.content);

            // Scroll to results if enabled
            if (this.ajaxSettings.scrollToResults) {
              $('html, body').animate({
                scrollTop: $targetElement.offset().top - 100
              }, this.ajaxSettings.animationDuration || 300);
            }
          }
        }
      });
    }
    resetFilters() {
      this.element.find('input, select').val('').prop('checked', false);
      this.applyFilters();
    }
    showLoading() {
      if (this.displaySettings.showLoading) {
        const loadingHtml = `
                    <div class="jankx-filter-loading">
                        <span class="jankx-filter-spinner"></span>
                        <span class="jankx-filter-loading-text">${this.ajaxSettings.loadingText || 'Đang tải...'}</span>
                    </div>
                `;
        this.element.find('.jankx-advanced-filter-content').append(loadingHtml);
      }
    }
    hideLoading() {
      this.element.find('.jankx-filter-loading').remove();
    }
    showError(message) {
      const errorHtml = `
                <div class="jankx-filter-error">
                    <span class="jankx-filter-error-text">${message}</span>
                </div>
            `;
      this.element.find('.jankx-advanced-filter-content').append(errorHtml);

      // Auto hide error after 5 seconds
      setTimeout(() => {
        this.element.find('.jankx-filter-error').fadeOut();
      }, 5000);
    }
    getNonce() {
      // Get nonce from WordPress
      return window.jankx_advanced_filter_nonce || '';
    }
    applyStyling() {
      const container = this.element.find('.jankx-advanced-filter-content');

      // Apply layout
      if (this.styling.layout) {
        container.addClass(`jankx-filter-layout-${this.styling.layout}`);
      }

      // Apply gap
      if (this.styling.gap) {
        container.css('gap', `${this.styling.gap}px`);
      }

      // Apply border radius
      if (this.styling.borderRadius) {
        container.css('border-radius', `${this.styling.borderRadius}px`);
      }

      // Apply background color
      if (this.styling.backgroundColor) {
        container.css('background-color', this.styling.backgroundColor);
      }

      // Apply text color
      if (this.styling.textColor) {
        container.css('color', this.styling.textColor);
      }

      // Apply shadow
      if (this.styling.shadow && this.styling.shadow !== 'none') {
        const shadows = {
          light: '0 1px 3px rgba(0,0,0,0.1)',
          medium: '0 2px 6px rgba(0,0,0,0.15)',
          heavy: '0 4px 12px rgba(0,0,0,0.2)'
        };
        container.css('box-shadow', shadows[this.styling.shadow] || '');
      }
    }
  }

  // Initialize filters when DOM is ready
  $(document).ready(function () {
    $('.jankx-advanced-filter').each(function () {
      new AdvancedFilter(this);
    });
  });

  // Re-initialize when new content is loaded (for AJAX)
  $(document).on('jankx:content-loaded', function () {
    $('.jankx-advanced-filter').each(function () {
      if (!$(this).data('advanced-filter-initialized')) {
        new AdvancedFilter(this);
        $(this).data('advanced-filter-initialized', true);
      }
    });
  });
})(jQuery);
/******/ })()
;
//# sourceMappingURL=frontend.js.map