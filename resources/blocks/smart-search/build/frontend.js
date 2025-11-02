/******/ (() => { // webpackBootstrap
/*!*****************************************!*\
  !*** ./blocks/smart-search/frontend.ts ***!
  \*****************************************/
/**
 * Smart Search Block - Frontend JavaScript
 *
 * Handles search form interactions, auto suggestion, and autocomplete
 */

class SmartSearch {
  container = null;
  config = null;
  form = null;
  input = null;
  suggestionDropdown = null;
  debounceTimer = null;
  currentSuggestions = null;
  abortController = null;
  constructor(container) {
    this.container = container;
    this.init();
  }
  init() {
    if (!this.container) return;

    // Parse config from data attributes
    this.config = {
      placeholder: this.container.getAttribute('data-placeholder') || 'Search...',
      showPostTypeFilter: this.container.getAttribute('data-show-post-type-filter') === 'true',
      postTypes: this.parseJsonAttribute(this.container.getAttribute('data-post-types') || '["post"]'),
      showTaxonomyFilter: this.container.getAttribute('data-show-taxonomy-filter') === 'true',
      taxonomies: this.parseJsonAttribute(this.container.getAttribute('data-taxonomies') || '[]'),
      enableAutoSuggestion: this.container.getAttribute('data-enable-auto-suggestion') === 'true',
      showPosts: this.container.getAttribute('data-show-posts') === 'true',
      showPostTypes: this.container.getAttribute('data-show-post-types') === 'true',
      showUsers: this.container.getAttribute('data-show-users') === 'true',
      showTaxonomy: this.container.getAttribute('data-show-taxonomy') === 'true',
      showTags: this.container.getAttribute('data-show-tags') === 'true',
      suggestionLimit: parseInt(this.container.getAttribute('data-suggestion-limit') || '10', 10),
      iconPosition: this.container.getAttribute('data-icon-position') || 'inside',
      showIcon: this.container.getAttribute('data-show-icon') === 'true',
      labelText: this.container.getAttribute('data-label-text') || 'Search',
      showLabel: this.container.getAttribute('data-show-label') === 'true',
      buttonPosition: this.container.getAttribute('data-button-position') || 'inside',
      searchUrl: this.container.getAttribute('data-search-url') || ''
    };
    this.renderForm();
    this.setupEventListeners();
  }
  parseJsonAttribute(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  }
  renderForm() {
    if (!this.container || !this.config) return;

    // Check if form already exists
    const existingForm = this.container.querySelector('.smart-search-form');
    if (existingForm) {
      existingForm.remove();
    }

    // Create wrapper for form and suggestions (to position suggestions correctly)
    const formWrapper = document.createElement('div');
    formWrapper.className = 'smart-search-form-wrapper';

    // Create form structure
    const form = document.createElement('form');
    form.className = 'smart-search-form';
    form.method = 'get';
    // Use custom search URL or default WordPress search URL
    const searchUrl = this.config.searchUrl || '';
    form.action = searchUrl || this.getWordPressSearchUrl() || '/';

    // Add label if enabled
    if (this.config.showLabel) {
      const label = document.createElement('label');
      label.className = 'search-label';
      label.textContent = this.config.labelText;
      label.setAttribute('for', `search-input-${Date.now()}`);
      form.appendChild(label);
    }

    // Create input wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.className = `search-input-wrapper 
			${this.config.iconPosition === 'inside' ? 'icon-inside' : 'icon-outside'} 
			${this.config.buttonPosition === 'inside' ? 'button-inside' : 'button-outside'}`;

    // Add icon outside if needed
    if (this.config.showIcon && this.config.iconPosition === 'outside') {
      const iconOutside = document.createElement('span');
      iconOutside.className = 'search-icon-outside';
      iconOutside.innerHTML = '🔍';
      inputWrapper.appendChild(iconOutside);
    }

    // Create filters wrapper (if needed)
    const filtersWrapper = document.createElement('div');
    filtersWrapper.className = 'search-filters-wrapper';

    // Post type filter - only show if more than 1 post type is selected
    if (this.config.showPostTypeFilter && this.config.postTypes.length > 1) {
      const postTypeSelect = document.createElement('select');
      postTypeSelect.name = 'post_type';
      postTypeSelect.className = 'post-type-filter';
      postTypeSelect.innerHTML = '<option value="">' + 'All Post Types' + '</option>';
      this.config.postTypes.forEach(postType => {
        const option = document.createElement('option');
        option.value = postType;
        option.textContent = this.formatPostTypeName(postType);
        postTypeSelect.appendChild(option);
      });
      filtersWrapper.appendChild(postTypeSelect);
    } else if (this.config.postTypes.length === 1) {
      // If only 1 post type, add it as a hidden field
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'post_type';
      hiddenInput.value = this.config.postTypes[0];
      form.appendChild(hiddenInput);
    }

    // Taxonomy filter
    if (this.config.showTaxonomyFilter && this.config.taxonomies.length > 0) {
      const taxonomySelect = document.createElement('select');
      taxonomySelect.name = 'taxonomy';
      taxonomySelect.className = 'taxonomy-filter';
      taxonomySelect.innerHTML = '<option value="">' + 'All Taxonomies' + '</option>';
      this.config.taxonomies.forEach(taxonomy => {
        const option = document.createElement('option');
        option.value = taxonomy;
        option.textContent = this.formatTaxonomyName(taxonomy);
        taxonomySelect.appendChild(option);
      });
      filtersWrapper.appendChild(taxonomySelect);
    }
    if (filtersWrapper.children.length > 0) {
      inputWrapper.appendChild(filtersWrapper);
    }

    // Create input inner wrapper
    const inputInner = document.createElement('div');
    inputInner.className = 'search-input-inner';

    // Add icon inside if needed
    if (this.config.showIcon && this.config.iconPosition === 'inside') {
      const iconInside = document.createElement('span');
      iconInside.className = 'search-icon-inside';
      iconInside.innerHTML = '🔍';
      inputInner.appendChild(iconInside);
    }

    // Create search input
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 's';
    input.className = 'search-input';
    input.placeholder = this.config.placeholder;
    input.id = `search-input-${Date.now()}`;
    input.setAttribute('autocomplete', 'off');
    inputInner.appendChild(input);
    this.input = input;

    // Add button inside if needed (always at the end of input inner)
    if (this.config.buttonPosition === 'inside') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'search-button';
      button.textContent = 'Search';
      inputInner.appendChild(button);
    }
    inputWrapper.appendChild(inputInner);

    // Button outside - always at the end of input wrapper
    if (this.config.buttonPosition === 'outside') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'search-button';
      button.textContent = 'Search';
      // Ensure button is always last in layout
      inputWrapper.appendChild(button);
    }
    form.appendChild(inputWrapper);
    formWrapper.appendChild(form);

    // Create suggestion dropdown
    if (this.config.enableAutoSuggestion) {
      const dropdown = document.createElement('div');
      dropdown.className = 'search-suggestions';
      dropdown.style.display = 'none';
      formWrapper.appendChild(dropdown);
      this.suggestionDropdown = dropdown;
    }
    this.container.appendChild(formWrapper);
    this.form = form;
  }
  formatPostTypeName(postType) {
    const postTypeObj = window.wp?.data?.select('core')?.getPostType?.(postType);
    return postTypeObj?.labels?.singular_name || postType;
  }
  formatTaxonomyName(taxonomy) {
    const taxonomyObj = window.wp?.data?.select('core')?.getTaxonomy?.(taxonomy);
    return taxonomyObj?.labels?.singular_name || taxonomy;
  }
  setupEventListeners() {
    if (!this.input || !this.config) return;

    // Input focus
    this.input.addEventListener('focus', () => {
      if (this.suggestionDropdown && this.input?.value.trim()) {
        this.showSuggestions();
      }
    });

    // Input keyup event for auto suggestion
    if (this.config.enableAutoSuggestion) {
      this.input.addEventListener('keyup', () => {
        const query = this.input?.value.trim() || '';
        if (query.length >= 2) {
          this.debounce(() => this.fetchSuggestions(query), 500)();
        } else {
          this.hideSuggestions();
        }
      });
    }

    // Click outside to close suggestions
    document.addEventListener('click', e => {
      if (this.suggestionDropdown && !this.container?.contains(e.target) && !this.suggestionDropdown.contains(e.target)) {
        this.hideSuggestions();
      }
    });

    // Form submit - allow default form submission to search results page
    if (this.form) {
      this.form.addEventListener('submit', e => {
        // Cancel any pending suggestion requests
        if (this.abortController) {
          this.abortController.abort();
        }
        // Hide suggestions when submitting
        this.hideSuggestions();
        // Allow default form submission to proceed to search results
      });
    }

    // Keyboard navigation
    this.input.addEventListener('keydown', e => {
      if (!this.suggestionDropdown) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateSuggestions(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateSuggestions(-1);
      } else if (e.key === 'Enter') {
        const active = this.suggestionDropdown.querySelector('.suggestion-item.active');
        if (active) {
          e.preventDefault();
          const link = active.querySelector('a');
          if (link) {
            window.location.href = link.href;
          }
        }
        // If no active suggestion, Enter key will submit form naturally via button
      } else if (e.key === 'Escape') {
        this.hideSuggestions();
      }
    });
  }
  navigateSuggestions(direction) {
    if (!this.suggestionDropdown) return;
    const items = Array.from(this.suggestionDropdown.querySelectorAll('.suggestion-item'));
    const currentIndex = items.findIndex(item => item.classList.contains('active'));
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    items.forEach(item => item.classList.remove('active'));
    if (items[newIndex]) {
      items[newIndex].classList.add('active');
      items[newIndex].scrollIntoView({
        block: 'nearest'
      });
    }
  }
  async fetchSuggestions(query) {
    if (!this.config || !this.input) return;

    // Cancel previous request if exists
    if (this.abortController) {
      this.abortController.abort();
    }

    // Create new abort controller for this request
    this.abortController = new AbortController();
    const nonce = window.jankxSmartSearch?.nonce || '';
    const ajaxUrl = window.jankxSmartSearch?.ajaxUrl || '/wp-admin/admin-ajax.php';
    if (!nonce) {
      console.error('SmartSearch: Nonce is missing!');
      return;
    }
    try {
      // Check if all show_* flags are false
      const allShowFlagsFalse = !this.config.showPosts && !this.config.showPostTypes && !this.config.showUsers && !this.config.showTaxonomy && !this.config.showTags;

      // Determine what to search based on filters if nothing is explicitly selected
      let showPosts = this.config.showPosts;
      let showTaxonomy = this.config.showTaxonomy;
      let postTypes = this.config.postTypes;
      let taxonomies = this.config.taxonomies;

      // If all show flags are false, check filters
      if (allShowFlagsFalse) {
        // If post type filter is enabled and has post types, auto-enable posts search
        if (this.config.showPostTypeFilter && this.config.postTypes.length > 0) {
          showPosts = true;
          postTypes = this.config.postTypes; // Use filter post types
        }

        // If taxonomy filter is enabled and has taxonomies, auto-enable taxonomy search
        if (this.config.showTaxonomyFilter && this.config.taxonomies.length > 0) {
          showTaxonomy = true;
          taxonomies = this.config.taxonomies; // Use filter taxonomies
        }

        // If still no search type is enabled, fail (don't search)
        if (!showPosts && !showTaxonomy && !this.config.showPostTypes && !this.config.showUsers && !this.config.showTags) {
          this.hideSuggestions();
          return;
        }
      }
      const params = new URLSearchParams({
        action: 'jankx_smart_search_suggestions',
        nonce: nonce,
        query: query,
        post_types: JSON.stringify(postTypes),
        taxonomies: JSON.stringify(taxonomies),
        show_posts: String(showPosts),
        show_post_types: String(this.config.showPostTypes),
        show_users: String(this.config.showUsers),
        show_taxonomy: String(showTaxonomy),
        show_tags: String(this.config.showTags),
        limit: String(this.config.suggestionLimit)
      });
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params,
        signal: this.abortController.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        this.currentSuggestions = data.data;
        this.renderSuggestions(data.data);
        this.showSuggestions();
      } else {
        this.hideSuggestions();
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('SmartSearch: Error fetching suggestions:', error);
      this.hideSuggestions();
    }
  }
  renderSuggestions(results) {
    if (!this.suggestionDropdown || !results) return;
    this.suggestionDropdown.innerHTML = '';

    // Posts
    if (results.posts && results.posts.length > 0) {
      const section = this.createSuggestionSection('Posts', results.posts);
      this.suggestionDropdown.appendChild(section);
    }

    // Post Types
    if (results.post_types && results.post_types.length > 0) {
      const section = this.createSuggestionSection('Post Types', results.post_types);
      this.suggestionDropdown.appendChild(section);
    }

    // Users
    if (results.users && results.users.length > 0) {
      const section = this.createSuggestionSection('Users', results.users);
      this.suggestionDropdown.appendChild(section);
    }

    // Taxonomy Terms
    if (results.taxonomies && results.taxonomies.length > 0) {
      const section = this.createSuggestionSection('Taxonomies', results.taxonomies);
      this.suggestionDropdown.appendChild(section);
    }

    // Tags
    if (results.tags && results.tags.length > 0) {
      const section = this.createSuggestionSection('Tags', results.tags);
      this.suggestionDropdown.appendChild(section);
    }
    if (this.suggestionDropdown.children.length === 0) {
      this.suggestionDropdown.innerHTML = '<div class="suggestion-empty">No results found</div>';
    }
  }
  createSuggestionSection(title, items) {
    const section = document.createElement('div');
    section.className = 'suggestion-section';
    const header = document.createElement('div');
    header.className = 'suggestion-section-header';
    header.textContent = title;
    section.appendChild(header);
    const list = document.createElement('div');
    list.className = 'suggestion-list';
    items.forEach(item => {
      const listItem = document.createElement('div');
      listItem.className = 'suggestion-item';
      const link = document.createElement('a');
      link.href = item.url;
      if (item.avatar) {
        const img = document.createElement('img');
        img.src = item.avatar;
        img.className = 'suggestion-avatar';
        link.appendChild(img);
      }
      const content = document.createElement('div');
      content.className = 'suggestion-content';
      const name = document.createElement('div');
      name.className = 'suggestion-name';
      name.textContent = item.title || item.name || '';
      content.appendChild(name);
      if (item.excerpt) {
        const excerpt = document.createElement('div');
        excerpt.className = 'suggestion-excerpt';
        excerpt.textContent = item.excerpt;
        content.appendChild(excerpt);
      }
      if (item.type || item.taxonomy) {
        const meta = document.createElement('div');
        meta.className = 'suggestion-meta';
        meta.textContent = item.type || item.taxonomy || '';
        content.appendChild(meta);
      }
      link.appendChild(content);
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    section.appendChild(list);
    return section;
  }
  showSuggestions() {
    if (this.suggestionDropdown) {
      this.suggestionDropdown.style.display = 'block';
    }
  }
  hideSuggestions() {
    if (this.suggestionDropdown) {
      this.suggestionDropdown.style.display = 'none';
    }
  }
  getWordPressSearchUrl() {
    // Try to get WordPress search URL from various sources
    const homeUrl = window.wp?.url?.home?.() || '/';
    return `${homeUrl}/?s=`;
  }
  debounce(func, wait) {
    return (...args) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => func(...args), wait);
    };
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmartSearch);
} else {
  initSmartSearch();
}
function initSmartSearch() {
  document.querySelectorAll('.wp-block-jankx-smart-search').forEach(container => {
    if (container instanceof HTMLElement && !container.__smartSearchInitialized) {
      new SmartSearch(container);
      container.__smartSearchInitialized = true;
    }
  });
}

// Export for potential external use
if (typeof window !== 'undefined') {
  window.SmartSearch = SmartSearch;
}
/******/ })()
;
//# sourceMappingURL=frontend.js.map