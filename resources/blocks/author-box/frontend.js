(function() {
    'use strict';

    // Exception classes for better error handling
    class AuthorBoxError extends Error {
        constructor(message, code = 'AUTHOR_BOX_ERROR') {
            super(message);
            this.name = 'AuthorBoxError';
            this.code = code;
        }
    }

    class ConfigurationError extends AuthorBoxError {
        constructor(message) {
            super(message, 'CONFIGURATION_ERROR');
            this.name = 'ConfigurationError';
        }
    }

    class DataFetchError extends AuthorBoxError {
        constructor(message, status = null) {
            super(message, 'DATA_FETCH_ERROR');
            this.name = 'DataFetchError';
            this.status = status;
        }
    }

    class RenderError extends AuthorBoxError {
        constructor(message) {
            super(message, 'RENDER_ERROR');
            this.name = 'RenderError';
        }
    }

    // Main AuthorBoxFrontend class
    class AuthorBoxFrontend {
        constructor(container) {
            this.container = container;
            this.config = null;
            this.isLoading = false;

            this.init();
        }

        init() {
            try {
                this.validateContainer();
                this.loadConfiguration();
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
            const configElement = this.container.querySelector('.jankx-author-box-config');

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
            const requiredFields = ['authorId'];

            for (const field of requiredFields) {
                if (this.config[field] === undefined || this.config[field] === null) {
                    throw new ConfigurationError(`Required configuration field '${field}' is missing`);
                }
            }

            if (typeof this.config.authorId !== 'number' || this.config.authorId < 0) {
                throw new ConfigurationError('authorId must be a non-negative number');
            }
        }

        async render() {
            if (this.isLoading) {
                return;
            }

            try {
                this.isLoading = true;
                this.showLoadingState();

                const authorData = await this.fetchAuthorData();
                this.renderAuthor(authorData);

            } catch (error) {
                this.handleError(error);
            } finally {
                this.isLoading = false;
                this.hideLoadingState();
            }
        }

        async fetchAuthorData() {
            const params = new URLSearchParams({
                action: 'jankx-author-box-fetch-data',
                author_id: this.config.authorId
            });

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

            if (!data.data || !data.data.author) {
                throw new DataFetchError('Invalid response format: author data missing');
            }

            return data.data.author;
        }

        renderAuthor(author) {
            const contentContainer = this.container.querySelector('.jankx-author-box-content');

            if (!contentContainer) {
                throw new RenderError('Content container not found');
            }

            if (!author || typeof author !== 'object') {
                throw new RenderError('Invalid author data');
            }

            // Clear existing content
            contentContainer.innerHTML = '';

            // Build CSS classes
            const cssClasses = [
                'jankx-author-box',
                'jankx-author-box--' + (this.config.layout || 'horizontal'),
                'jankx-author-box--align-' + (this.config.textAlign || 'left')
            ];

            // Start building HTML
            let html = '<div class="' + this.escapeHtml(cssClasses.join(' ')) + '">';

            html += '<div class="jankx-author-box__content">';

            // Avatar
            if (this.config.showAvatar && author.avatar) {
                html += '<div class="jankx-author-box__avatar">';
                html += '<img src="' + this.escapeHtml(author.avatar) + '" alt="' + this.escapeHtml(author.name || '') + '" class="jankx-author-box__avatar-img">';
                html += '</div>';
            }

            // Author info
            html += '<div class="jankx-author-box__info">';

            // Author name
            html += '<h3 class="jankx-author-box__name">';
            if (author.url) {
                html += '<a href="' + this.escapeHtml(author.url) + '" class="jankx-author-box__name-link">';
            }
            // Add author title/prefix if provided
            if (this.config.authorTitle) {
                html += this.escapeHtml(this.config.authorTitle + ': ');
            }
            html += this.escapeHtml(author.name || '');
            if (author.url) {
                html += '</a>';
            }
            html += '</h3>';

            // Author bio
            if (this.config.showBio && author.bio) {
                html += '<div class="jankx-author-box__bio">';
                html += author.bio; // Bio is already sanitized from server
                html += '</div>';
            }

            // Social links
            if (this.config.showSocial && author.socialLinks && Object.keys(author.socialLinks).length > 0) {
                html += '<div class="jankx-author-box__social">';
                for (const [platform, url] of Object.entries(author.socialLinks)) {
                    if (url) {
                        html += '<a href="' + this.escapeHtml(url) + '" class="jankx-author-box__social-link jankx-author-box__social-link--' + this.escapeHtml(platform) + '" target="_blank" rel="noopener">';
                        html += '<span class="jankx-author-box__social-icon">' + this.getSocialIcon(platform) + '</span>';
                        html += '</a>';
                    }
                }
                html += '</div>';
            }

            html += '</div>'; // .jankx-author-box__info
            html += '</div>'; // .jankx-author-box__content
            html += '</div>'; // .jankx-author-box

            contentContainer.innerHTML = html;
        }

        getSocialIcon(platform) {
            const icons = {
                'facebook': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                'twitter': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
                'instagram': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
                'linkedin': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                'youtube': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                'website': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            };

            return icons[platform] || '';
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        showLoadingState() {
            const contentContainer = this.container.querySelector('.jankx-author-box-content');
            if (contentContainer) {
                contentContainer.innerHTML = `
                    <div class="jankx-author-box-loading">
                        <div class="jankx-author-box-loading__spinner"></div>
                        <p>Đang tải thông tin tác giả...</p>
                    </div>
                `;
            }
        }

        hideLoadingState() {
            // Loading state will be replaced by actual content
        }

        handleError(error) {
            console.error('AuthorBox Error:', error);

            const contentContainer = this.container.querySelector('.jankx-author-box-content');
            if (contentContainer) {
                let errorMessage = 'Đã xảy ra lỗi khi tải thông tin tác giả.';

                if (error instanceof ConfigurationError) {
                    errorMessage = 'Lỗi cấu hình: ' + error.message;
                } else if (error instanceof DataFetchError) {
                    errorMessage = 'Lỗi tải dữ liệu: ' + error.message;
                } else if (error instanceof RenderError) {
                    errorMessage = 'Lỗi hiển thị: ' + error.message;
                }

                contentContainer.innerHTML = `
                    <div class="jankx-author-box-error">
                        <p>${errorMessage}</p>
                        <button onclick="location.reload()" class="jankx-author-box-error__retry">
                            Thử lại
                        </button>
                    </div>
                `;
            }

            // Dispatch custom event for external error handling
            this.container.dispatchEvent(new CustomEvent('jankx-author-box-error', {
                detail: { error }
            }));
        }
    }

    // Initialize all author box blocks when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const containers = document.querySelectorAll('.jankx-author-box');

        containers.forEach(container => {
            try {
                new AuthorBoxFrontend(container);
            } catch (error) {
                console.error('Failed to initialize AuthorBox:', error);
            }
        });
    });

    // Export for global access if needed
    window.AuthorBoxFrontend = AuthorBoxFrontend;

})();
