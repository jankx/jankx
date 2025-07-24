// Jankx Framework Documentation - Main JavaScript

(function() {
  'use strict';

  // Theme management
  class ThemeManager {
    constructor() {
      this.themeToggle = document.querySelector('.theme-toggle');
      this.currentTheme = localStorage.getItem('theme') || 'light';
      this.init();
    }

    init() {
      this.setTheme(this.currentTheme);
      this.bindEvents();
    }

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.currentTheme = theme;
      this.updateToggleIcon();
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    }

    updateToggleIcon() {
      const icon = this.themeToggle.querySelector('i');
      if (this.currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }

    bindEvents() {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  // Search functionality
  class SearchManager {
    constructor() {
      this.searchToggle = document.querySelector('.search-toggle');
      this.searchOverlay = document.querySelector('#search-overlay');
      this.searchInput = document.querySelector('#search-input');
      this.searchClose = document.querySelector('.search-close');
      this.searchResults = document.querySelector('#search-results');
      this.searchData = [];
      this.init();
    }

    init() {
      this.loadSearchData();
      this.bindEvents();
    }

    async loadSearchData() {
      try {
        const response = await fetch('/search.json');
        this.searchData = await response.json();
      } catch (error) {
        console.warn('Search data not available:', error);
      }
    }

    bindEvents() {
      // Search toggle
      this.searchToggle.addEventListener('click', () => {
        this.openSearch();
      });

      // Search close
      this.searchClose.addEventListener('click', () => {
        this.closeSearch();
      });

      // Search overlay click
      this.searchOverlay.addEventListener('click', (e) => {
        if (e.target === this.searchOverlay) {
          this.closeSearch();
        }
      });

      // Search input
      this.searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          this.openSearch();
        }
        if (e.key === 'Escape') {
          this.closeSearch();
        }
      });
    }

    openSearch() {
      this.searchOverlay.classList.add('active');
      this.searchInput.focus();
      document.body.style.overflow = 'hidden';
    }

    closeSearch() {
      this.searchOverlay.classList.remove('active');
      this.searchInput.value = '';
      this.clearResults();
      document.body.style.overflow = '';
    }

    performSearch(query) {
      if (!query.trim()) {
        this.clearResults();
        return;
      }

      const results = this.searchData.filter(item => {
        const searchText = `${item.title} ${item.content}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      }).slice(0, 10);

      this.displayResults(results, query);
    }

    displayResults(results, query) {
      this.searchResults.innerHTML = '';

      if (results.length === 0) {
        this.searchResults.innerHTML = `
          <div class="search-no-results">
            <p>No results found for "${query}"</p>
          </div>
        `;
        return;
      }

      const resultsList = document.createElement('ul');
      resultsList.className = 'search-results-list';

      results.forEach(result => {
        const li = document.createElement('li');
        li.className = 'search-result-item';

        const link = document.createElement('a');
        link.href = result.url;
        link.innerHTML = `
          <h4>${this.highlightText(result.title, query)}</h4>
          <p>${this.highlightText(result.excerpt, query)}</p>
        `;

        li.appendChild(link);
        resultsList.appendChild(li);
      });

      this.searchResults.appendChild(resultsList);
    }

    highlightText(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    clearResults() {
      this.searchResults.innerHTML = '';
    }
  }

  // Table of Contents
  class TableOfContents {
    constructor() {
      this.toc = document.querySelector('#toc');
      this.tocToggle = document.querySelector('.toc-toggle');
      this.tocWrapper = document.querySelector('#toc-wrapper');
      this.headings = [];
      this.init();
    }

    init() {
      if (!this.toc) return;

      this.extractHeadings();
      this.generateTOC();
      this.bindEvents();
      this.highlightActiveHeading();
    }

    extractHeadings() {
      const content = document.querySelector('.content-body');
      if (!content) return;

      this.headings = Array.from(content.querySelectorAll('h2, h3, h4'))
        .map((heading, index) => ({
          element: heading,
          id: heading.id || `heading-${index}`,
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent.trim()
        }));

      // Add IDs to headings that don't have them
      this.headings.forEach(({ element, id }) => {
        if (!element.id) {
          element.id = id;
        }
      });
    }

    generateTOC() {
      if (this.headings.length === 0) {
        this.tocWrapper.style.display = 'none';
        return;
      }

      const ul = document.createElement('ul');
      ul.className = 'toc-list';

      this.headings.forEach(({ id, level, text }) => {
        const li = document.createElement('li');
        li.className = `toc-item toc-level-${level}`;

        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = text;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          this.scrollToHeading(id);
        });

        li.appendChild(a);
        ul.appendChild(li);
      });

      this.toc.appendChild(ul);
    }

    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (element) {
        const offset = 100; // Account for fixed header
        const elementPosition = element.offsetTop - offset;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }

    highlightActiveHeading() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const tocLink = this.toc.querySelector(`a[href="#${id}"]`);

          if (entry.isIntersecting) {
            // Remove active class from all links
            this.toc.querySelectorAll('a').forEach(link => {
              link.classList.remove('active');
            });

            // Add active class to current link
            if (tocLink) {
              tocLink.classList.add('active');
            }
          }
        });
      }, {
        rootMargin: '-20% 0px -80% 0px'
      });

      this.headings.forEach(({ element }) => {
        observer.observe(element);
      });
    }

    bindEvents() {
      if (this.tocToggle) {
        this.tocToggle.addEventListener('click', () => {
          this.tocWrapper.classList.toggle('collapsed');
        });
      }
    }
  }

  // Back to top
  class BackToTop {
    constructor() {
      this.button = document.querySelector('#back-to-top');
      if (!this.button) return;

      this.init();
    }

    init() {
      this.bindEvents();
      this.checkScroll();
    }

    bindEvents() {
      window.addEventListener('scroll', () => {
        this.checkScroll();
      });

      this.button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    checkScroll() {
      if (window.pageYOffset > 300) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    }
  }

  // Reading time calculator
  class ReadingTime {
    constructor() {
      this.element = document.querySelector('#reading-time');
      if (!this.element) return;

      this.calculate();
    }

    calculate() {
      const content = document.querySelector('.content-body');
      if (!content) return;

      const text = content.textContent || content.innerText;
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // Average reading speed: 200 words per minute

      this.element.textContent = minutes;
    }
  }

  // Mobile menu
  class MobileMenu {
    constructor() {
      this.toggle = document.querySelector('.mobile-menu-toggle');
      this.nav = document.querySelector('.main-nav');
      this.init();
    }

    init() {
      if (!this.toggle || !this.nav) return;

      this.bindEvents();
    }

    bindEvents() {
      this.toggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
          this.closeMenu();
        }
      });
    }

    toggleMenu() {
      this.nav.classList.toggle('mobile-open');
      this.toggle.classList.toggle('active');
    }

    closeMenu() {
      this.nav.classList.remove('mobile-open');
      this.toggle.classList.remove('active');
    }
  }

  // Copy code functionality
  class CodeCopy {
    constructor() {
      this.init();
    }

    init() {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        this.addCopyButton(block);
      });
    }

    addCopyButton(codeBlock) {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.innerHTML = '<i class="fas fa-copy"></i>';
      button.setAttribute('aria-label', 'Copy code');

      button.addEventListener('click', () => {
        this.copyCode(codeBlock, button);
      });

      pre.appendChild(button);
    }

    async copyCode(codeBlock, button) {
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);

        // Visual feedback
        const icon = button.querySelector('i');
        icon.className = 'fas fa-check';
        button.classList.add('copied');

        setTimeout(() => {
          icon.className = 'fas fa-copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }

  // Initialize all components when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SearchManager();
    new TableOfContents();
    new BackToTop();
    new ReadingTime();
    new MobileMenu();
    new CodeCopy();
  });

})();