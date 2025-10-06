(function() {
    'use strict';

    // Exception classes for better error handling
    class PostLayoutError extends Error {
        constructor(message, code = 'POST_LAYOUT_ERROR') {
            super(message);
            this.name = 'PostLayoutError';
            this.code = code;
        }
    }

    class ConfigurationError extends PostLayoutError {
        constructor(message) {
            super(message, 'CONFIGURATION_ERROR');
            this.name = 'ConfigurationError';
        }
    }

    class DataFetchError extends PostLayoutError {
        constructor(message, status = null) {
            super(message, 'DATA_FETCH_ERROR');
            this.name = 'DataFetchError';
            this.status = status;
        }
    }

    class RenderError extends PostLayoutError {
        constructor(message) {
            super(message, 'RENDER_ERROR');
            this.name = 'RenderError';
        }
    }

    // Main PostLayoutFrontend class
    class PostLayoutFrontend {
        constructor(container) {
            this.container = container;
            this.config = null;
            this.isLoading = false;
            this.currentPage = 1;
            this.maxPages = 1;

            this.init();
        }

        init() {
            try {
                this.validateContainer();
                this.loadConfiguration();
                this.bindEvents();
                this.render();
            } catch (error) {
                this.handleError(error);
            }
        }

        validateContainer() {
            if (!this.container) {
                throw new ConfigurationError('Container element is required');
            }

            if (!document.body.contains(this.container)) {
                throw new ConfigurationError('Container element must be in the DOM');
            }
        }

        loadConfiguration() {
            const configElement = this.container.querySelector('.jankx-post-layout-config');

            if (!configElement) {
                throw new ConfigurationError('Configuration element not found');
            }

            const configData = configElement.getAttribute('data-config');

            if (!configData) {
                throw new ConfigurationError('Configuration data is empty');
            }

            try {
                this.config = JSON.parse(configData);
            } catch (error) {
                throw new ConfigurationError('Invalid configuration JSON: ' + error.message);
            }

            this.validateConfiguration();
        }

        validateConfiguration() {
            const requiredFields = ['postType', 'postsPerPage'];

            for (const field of requiredFields) {
                if (!this.config[field]) {
                    throw new ConfigurationError(`Required configuration field '${field}' is missing`);
                }
            }

            if (typeof this.config.postsPerPage !== 'number' || this.config.postsPerPage < 1) {
                throw new ConfigurationError('postsPerPage must be a positive number');
            }

            if (!this.config.postType || typeof this.config.postType !== 'string') {
                throw new ConfigurationError('postType must be a non-empty string');
            }
        }

        bindEvents() {
            // Bind pagination events
            const paginationLinks = this.container.querySelectorAll('.jankx-post-layout-pagination a');
            paginationLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = parseInt(link.getAttribute('data-page') || '1');
                    this.goToPage(page);
                });
            });

            // Bind filter events
            const filterElements = this.container.querySelectorAll('.jankx-post-layout-filter');
            filterElements.forEach(element => {
                element.addEventListener('change', () => {
                    this.handleFilterChange();
                });
            });

            // Bind search events
            const searchInput = this.container.querySelector('.jankx-post-layout-search');
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.handleSearch();
                    }, 500);
                });
            }
        }

        async render() {
            if (this.isLoading) {
                return;
            }

            try {
                this.isLoading = true;
                this.showLoadingState();

                const posts = await this.fetchPosts();
                this.renderPosts(posts);
                this.updatePagination();

            } catch (error) {
                this.handleError(error);
            } finally {
                this.isLoading = false;
                this.hideLoadingState();
            }
        }

        async fetchPosts() {
            const params = new URLSearchParams({
                action: 'jankx-post-layout-fetch-data',
                post_type: this.config.postType,
                posts_per_page: this.config.postsPerPage,
                page: this.currentPage,
                engine_id: 'jankx'
            });

            // Add query parameters
            if (this.config.orderBy) {
                params.append('order_by', this.config.orderBy);
            }
            if (this.config.order) {
                params.append('order', this.config.order);
            }
            if (this.config.offset) {
                params.append('offset', this.config.offset);
            }

            // Add filters
            if (this.config.taxonomyFilters && Object.keys(this.config.taxonomyFilters).length > 0) {
                params.append('taxonomy_filters', JSON.stringify(this.config.taxonomyFilters));
            }
            if (this.config.metaFilters && Object.keys(this.config.metaFilters).length > 0) {
                params.append('meta_filters', JSON.stringify(this.config.metaFilters));
            }

            const ajaxUrl = window.jankx_ajax?.url || window.ajaxurl || '/wp-admin/admin-ajax.php';
            const nonce = window.jankx_ajax?.nonce || '';

            // Add nonce to parameters
            if (nonce) {
                params.append('_wpnonce', nonce);
            }

            const response = await fetch(`${ajaxUrl}?${params.toString()}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if (!response.ok) {
                throw new DataFetchError(`HTTP ${response.status}: ${response.statusText}`, response.status);
            }

            const data = await response.json();

            if (!data.success) {
                throw new DataFetchError(data.data?.message || 'Unknown error occurred');
            }

            if (!data.data || !data.data.posts) {
                throw new DataFetchError('Invalid response format: posts data missing');
            }

            // Update pagination info
            if (data.data.query_info) {
                this.maxPages = data.data.query_info.max_pages || 1;
            }

            return data.data.posts;
        }

        renderPosts(posts) {
            const contentContainer = this.container.querySelector('.jankx-post-layout-content');

            if (!contentContainer) {
                throw new RenderError('Content container not found');
            }

            if (!Array.isArray(posts)) {
                throw new RenderError('Posts data is not an array');
            }

            if (posts.length === 0) {
                this.renderNoResults();
                return;
            }

            // Clear existing content
            contentContainer.innerHTML = '';

            // Render posts
            posts.forEach((post, index) => {
                try {
                    const postElement = this.createPostElement(post, index);
                    contentContainer.appendChild(postElement);
                } catch (error) {
                    console.error(`Error rendering post ${post.ID || index}:`, error);
                    // Continue with other posts even if one fails
                }
            });
        }

        createPostElement(post, index) {
            if (!post || typeof post !== 'object') {
                throw new RenderError(`Invalid post data at index ${index}`);
            }

            const postElement = document.createElement('article');
            postElement.className = 'jankx-post-layout-item';
            postElement.setAttribute('data-post-id', post.ID || index);

            // Basic post structure
            postElement.innerHTML = `
                <div class="jankx-post-layout-item__content">
                    ${post.thumbnail ? `
                        <div class="jankx-post-layout-item__thumbnail">
                            <img src="${post.thumbnail}" alt="${post.title || ''}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="jankx-post-layout-item__body">
                        ${post.title ? `
                            <h3 class="jankx-post-layout-item__title">
                                <a href="${post.permalink || '#'}">${post.title}</a>
                            </h3>
                        ` : ''}
                        ${post.excerpt ? `
                            <div class="jankx-post-layout-item__excerpt">
                                ${post.excerpt}
                            </div>
                        ` : ''}
                        ${post.meta ? `
                            <div class="jankx-post-layout-item__meta">
                                ${post.meta}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            return postElement;
        }

        renderNoResults() {
            const contentContainer = this.container.querySelector('.jankx-post-layout-content');
            if (contentContainer) {
                contentContainer.innerHTML = `
                    <div class="jankx-post-layout-no-results">
                        <p>Không tìm thấy bài viết nào.</p>
                    </div>
                `;
            }
        }

        updatePagination() {
            const paginationContainer = this.container.querySelector('.jankx-post-layout-pagination');
            if (!paginationContainer) {
                return;
            }

            if (this.maxPages <= 1) {
                paginationContainer.style.display = 'none';
                return;
            }

            paginationContainer.style.display = 'block';
            paginationContainer.innerHTML = this.generatePaginationHTML();
        }

        generatePaginationHTML() {
            let html = '<div class="jankx-post-layout-pagination__links">';

            // Previous button
            if (this.currentPage > 1) {
                html += `<a href="#" data-page="${this.currentPage - 1}" class="jankx-post-layout-pagination__prev">« Trước</a>`;
            }

            // Page numbers
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(this.maxPages, this.currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                const isActive = i === this.currentPage ? ' active' : '';
                html += `<a href="#" data-page="${i}" class="jankx-post-layout-pagination__page${isActive}">${i}</a>`;
            }

            // Next button
            if (this.currentPage < this.maxPages) {
                html += `<a href="#" data-page="${this.currentPage + 1}" class="jankx-post-layout-pagination__next">Sau »</a>`;
            }

            html += '</div>';
            return html;
        }

        async goToPage(page) {
            if (page < 1 || page > this.maxPages || page === this.currentPage) {
                return;
            }

            this.currentPage = page;
            await this.render();

            // Scroll to top of container
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        handleFilterChange() {
            // Reset to first page when filters change
            this.currentPage = 1;
            this.render();
        }

        handleSearch() {
            // Reset to first page when searching
            this.currentPage = 1;
            this.render();
        }

        showLoadingState() {
            const contentContainer = this.container.querySelector('.jankx-post-layout-content');
            if (contentContainer) {
                contentContainer.innerHTML = `
                    <div class="jankx-post-layout-loading">
                        <div class="jankx-post-layout-loading__spinner"></div>
                        <p>Đang tải...</p>
                    </div>
                `;
            }
        }

        hideLoadingState() {
            // Loading state will be replaced by actual content
        }

        handleError(error) {
            console.error('PostLayout Error:', error);

            const contentContainer = this.container.querySelector('.jankx-post-layout-content');
            if (contentContainer) {
                let errorMessage = 'Đã xảy ra lỗi khi tải dữ liệu.';

                if (error instanceof ConfigurationError) {
                    errorMessage = 'Lỗi cấu hình: ' + error.message;
                } else if (error instanceof DataFetchError) {
                    errorMessage = 'Lỗi tải dữ liệu: ' + error.message;
                } else if (error instanceof RenderError) {
                    errorMessage = 'Lỗi hiển thị: ' + error.message;
                }

                contentContainer.innerHTML = `
                    <div class="jankx-post-layout-error">
                        <p>${errorMessage}</p>
                        <button onclick="location.reload()" class="jankx-post-layout-error__retry">
                            Thử lại
                        </button>
                    </div>
                `;
            }

            // Dispatch custom event for external error handling
            this.container.dispatchEvent(new CustomEvent('jankx-post-layout-error', {
                detail: { error }
            }));
        }
    }

    // Initialize all post layout blocks when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const containers = document.querySelectorAll('.jankx-post-layout');

        containers.forEach(container => {
            try {
                new PostLayoutFrontend(container);
            } catch (error) {
                console.error('Failed to initialize PostLayout:', error);
            }
        });
    });

    // Export for global access if needed
    window.PostLayoutFrontend = PostLayoutFrontend;

})();
