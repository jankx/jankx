/**
 * Jankx Partial Hydration System
 *
 * Handles lazy loading and AJAX loading of layouts for better performance.
 * Supports intersection observer for viewport detection and smooth loading.
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Selectors
        selectors: {
            lazyLayout: '.jankx-layout-lazy',
            loadingPlaceholder: '.jankx-layout-placeholder',
            partialHydration: '.jankx-partial-hydration',
            loadingSpinner: '.jankx-loading-spinner',
            errorContainer: '.jankx-error-container'
        },

        // Classes
        classes: {
            loaded: 'jankx-layout-loaded',
            loading: 'jankx-layout-loading',
            error: 'jankx-layout-error',
            hidden: 'jankx-layout-hidden'
        },

        // Animation
        animation: {
            duration: 300,
            easing: 'ease-in-out'
        },

        // Intersection Observer
        observer: {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        },

        // AJAX
        ajax: {
            timeout: 10000,
            retryAttempts: 3,
            retryDelay: 1000
        }
    };

    /**
     * Partial Hydration Manager
     */
    class PartialHydrationManager {
        constructor() {
            this.observer = null;
            this.loadingElements = new Set();
            this.retryCounts = new Map();
            this.init();
        }

        /**
         * Initialize the manager
         */
        init() {
            this.setupIntersectionObserver();
            this.setupEventListeners();
            this.loadInitialLayouts();
            this.log('Partial Hydration Manager initialized');
        }

        /**
         * Setup intersection observer for lazy loading
         */
        setupIntersectionObserver() {
            if (!window.IntersectionObserver) {
                this.log('IntersectionObserver not supported, falling back to scroll events');
                this.setupScrollFallback();
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLayout(entry.target);
                    }
                });
            }, CONFIG.observer);

            // Observe all lazy layouts
            document.querySelectorAll(CONFIG.selectors.lazyLayout).forEach(element => {
                this.observer.observe(element);
            });
        }

        /**
         * Setup scroll fallback for older browsers
         */
        setupScrollFallback() {
            let ticking = false;

            const updateVisibility = () => {
                const lazyElements = document.querySelectorAll(CONFIG.selectors.lazyLayout);

                lazyElements.forEach(element => {
                    if (this.isElementInViewport(element)) {
                        this.loadLayout(element);
                    }
                });

                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateVisibility);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick, { passive: true });
            window.addEventListener('resize', requestTick, { passive: true });
        }

        /**
         * Check if element is in viewport
         */
        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            return (
                rect.top <= windowHeight + CONFIG.observer.rootMargin &&
                rect.bottom >= -CONFIG.observer.rootMargin
            );
        }

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Handle manual load triggers
            document.addEventListener('click', (event) => {
                const loadTrigger = event.target.closest('[data-jankx-load-trigger]');
                if (loadTrigger) {
                    event.preventDefault();
                    const targetId = loadTrigger.dataset.jankxLoadTarget;
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        this.loadLayout(targetElement);
                    }
                }
            });

            // Handle retry buttons
            document.addEventListener('click', (event) => {
                const retryButton = event.target.closest('[data-jankx-retry]');
                if (retryButton) {
                    event.preventDefault();
                    const layoutElement = retryButton.closest(CONFIG.selectors.lazyLayout);
                    if (layoutElement) {
                        this.retryLoad(layoutElement);
                    }
                }
            });

            // Handle visibility change
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.checkVisibleLayouts();
                }
            });
        }

        /**
         * Load initial layouts (first layout is always server-rendered)
         */
        loadInitialLayouts() {
            const firstLayout = document.querySelector('.jankx-layout');
            if (firstLayout) {
                firstLayout.classList.add(CONFIG.classes.loaded);
                this.log('First layout loaded (server-rendered)');
            }
        }

        /**
         * Load a specific layout
         */
        async loadLayout(element) {
            if (element.classList.contains(CONFIG.classes.loaded) ||
                element.classList.contains(CONFIG.classes.loading)) {
                return;
            }

            const layoutName = element.dataset.layout;
            const settings = this.parseSettings(element.dataset.settings);

            if (!layoutName) {
                this.handleError(element, 'No layout name specified');
                return;
            }

            element.classList.add(CONFIG.classes.loading);
            this.loadingElements.add(element);

            try {
                const response = await this.fetchLayout(layoutName, settings);
                this.renderLayout(element, response);
                this.markAsLoaded(element);
            } catch (error) {
                this.handleError(element, error.message);
            } finally {
                element.classList.remove(CONFIG.classes.loading);
                this.loadingElements.delete(element);
            }
        }

        /**
         * Fetch layout content via AJAX
         */
        async fetchLayout(layoutName, settings) {
            const url = new URL(window.jankxPartialHydration?.ajaxUrl || '/wp-admin/admin-ajax.php');
            url.searchParams.set('action', 'jankx_load_layout');
            url.searchParams.set('layout', layoutName);
            url.searchParams.set('settings', JSON.stringify(settings));
            url.searchParams.set('nonce', window.jankxPartialHydration?.nonce || '');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.ajax.timeout);

            try {
                const response = await fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.data?.message || 'Failed to load layout');
                }

                return data.data;
            } catch (error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
        }

        /**
         * Render layout content
         */
        renderLayout(element, response) {
            const { html, styles, scripts } = response;

            // Replace placeholder with actual content
            const placeholder = element.querySelector(CONFIG.selectors.loadingPlaceholder);
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                element.innerHTML = html;
            }

            // Inject styles
            if (styles && styles.length > 0) {
                this.injectStyles(styles);
            }

            // Execute scripts
            if (scripts && scripts.length > 0) {
                this.executeScripts(scripts);
            }

            // Trigger custom event
            this.triggerEvent('jankx:layout:loaded', {
                element: element,
                layout: element.dataset.layout,
                response: response
            });
        }

        /**
         * Inject styles into document
         */
        injectStyles(styles) {
            styles.forEach(style => {
                if (style.type === 'inline') {
                    const styleElement = document.createElement('style');
                    styleElement.textContent = style.content;
                    document.head.appendChild(styleElement);
                } else if (style.type === 'external') {
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'stylesheet';
                    linkElement.href = style.href;
                    document.head.appendChild(linkElement);
                }
            });
        }

        /**
         * Execute scripts
         */
        executeScripts(scripts) {
            scripts.forEach(script => {
                if (script.type === 'inline') {
                    try {
                        // Create a new script element to execute
                        const scriptElement = document.createElement('script');
                        scriptElement.textContent = script.content;
                        document.head.appendChild(scriptElement);
                        document.head.removeChild(scriptElement);
                    } catch (error) {
                        this.log('Error executing inline script:', error);
                    }
                } else if (script.type === 'external') {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = script.src;
                    if (script.async) {
                        scriptElement.async = true;
                    }
                    document.head.appendChild(scriptElement);
                }
            });
        }

        /**
         * Mark layout as loaded
         */
        markAsLoaded(element) {
            element.classList.add(CONFIG.classes.loaded);
            element.classList.remove(CONFIG.classes.hidden);

            // Remove from observer if using intersection observer
            if (this.observer) {
                this.observer.unobserve(element);
            }

            this.log(`Layout loaded: ${element.dataset.layout}`);
        }

        /**
         * Handle loading errors
         */
        handleError(element, message) {
            element.classList.add(CONFIG.classes.error);

            const errorHtml = `
                <div class="jankx-layout-error">
                    <div class="jankx-error-message">
                        <p>Failed to load layout: ${message}</p>
                        <button class="jankx-retry-button" data-jankx-retry>
                            Try Again
                        </button>
                    </div>
                </div>
            `;

            const placeholder = element.querySelector(CONFIG.selectors.loadingPlaceholder);
            if (placeholder) {
                placeholder.innerHTML = errorHtml;
            } else {
                element.innerHTML = errorHtml;
            }

            this.log(`Layout error: ${element.dataset.layout} - ${message}`);
        }

        /**
         * Retry loading a layout
         */
        retryLoad(element) {
            const retryCount = this.retryCounts.get(element) || 0;

            if (retryCount >= CONFIG.ajax.retryAttempts) {
                this.handleError(element, 'Maximum retry attempts reached');
                return;
            }

            this.retryCounts.set(element, retryCount + 1);
            element.classList.remove(CONFIG.classes.error);

            // Add delay before retry
            setTimeout(() => {
                this.loadLayout(element);
            }, CONFIG.ajax.retryDelay * (retryCount + 1));
        }

        /**
         * Check visible layouts
         */
        checkVisibleLayouts() {
            const lazyElements = document.querySelectorAll(CONFIG.selectors.lazyLayout);
            lazyElements.forEach(element => {
                if (this.isElementInViewport(element)) {
                    this.loadLayout(element);
                }
            });
        }

        /**
         * Parse settings from data attribute
         */
        parseSettings(settingsString) {
            try {
                return JSON.parse(settingsString || '{}');
            } catch (error) {
                this.log('Error parsing settings:', error);
                return {};
            }
        }

        /**
         * Trigger custom event
         */
        triggerEvent(eventName, detail = {}) {
            const event = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true
            });
            document.dispatchEvent(event);
        }

        /**
         * Log messages
         */
        log(message, ...args) {
            if (window.jankxPartialHydration?.debug) {
                console.log(`[Jankx Partial Hydration] ${message}`, ...args);
            }
        }

        /**
         * Get loading statistics
         */
        getStats() {
            return {
                total: document.querySelectorAll(CONFIG.selectors.lazyLayout).length,
                loaded: document.querySelectorAll(`${CONFIG.selectors.lazyLayout}.${CONFIG.classes.loaded}`).length,
                loading: this.loadingElements.size,
                errors: document.querySelectorAll(`${CONFIG.selectors.lazyLayout}.${CONFIG.classes.error}`).length
            };
        }

        /**
         * Force load all layouts
         */
        forceLoadAll() {
            const lazyElements = document.querySelectorAll(CONFIG.selectors.lazyLayout);
            lazyElements.forEach(element => {
                this.loadLayout(element);
            });
        }

        /**
         * Destroy the manager
         */
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
            this.loadingElements.clear();
            this.retryCounts.clear();
        }
    }

    /**
     * Performance Monitor
     */
    class PerformanceMonitor {
        constructor(manager) {
            this.manager = manager;
            this.metrics = {
                loadTimes: [],
                errors: [],
                retries: []
            };
            this.init();
        }

        /**
         * Initialize performance monitoring
         */
        init() {
            // Monitor layout load times
            document.addEventListener('jankx:layout:loaded', (event) => {
                this.recordLoadTime(event.detail.element);
            });

            // Monitor errors
            document.addEventListener('jankx:layout:error', (event) => {
                this.recordError(event.detail);
            });

            // Monitor retries
            document.addEventListener('jankx:layout:retry', (event) => {
                this.recordRetry(event.detail);
            });
        }

        /**
         * Record load time
         */
        recordLoadTime(element) {
            const loadTime = performance.now() - element.dataset.loadStart;
            this.metrics.loadTimes.push(loadTime);

            if (this.metrics.loadTimes.length > 100) {
                this.metrics.loadTimes.shift();
            }
        }

        /**
         * Record error
         */
        recordError(error) {
            this.metrics.errors.push({
                layout: error.layout,
                message: error.message,
                timestamp: Date.now()
            });
        }

        /**
         * Record retry
         */
        recordRetry(retry) {
            this.metrics.retries.push({
                layout: retry.layout,
                attempt: retry.attempt,
                timestamp: Date.now()
            });
        }

        /**
         * Get performance metrics
         */
        getMetrics() {
            const loadTimes = this.metrics.loadTimes;
            const avgLoadTime = loadTimes.length > 0
                ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
                : 0;

            return {
                averageLoadTime: avgLoadTime,
                totalLoads: loadTimes.length,
                totalErrors: this.metrics.errors.length,
                totalRetries: this.metrics.retries.length,
                errorRate: loadTimes.length > 0
                    ? (this.metrics.errors.length / loadTimes.length) * 100
                    : 0
            };
        }
    }

    /**
     * Initialize when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize partial hydration manager
        window.jankxPartialHydrationManager = new PartialHydrationManager();

        // Initialize performance monitor
        window.jankxPerformanceMonitor = new PerformanceMonitor(window.jankxPartialHydrationManager);

        // Expose public API
        window.JankxPartialHydration = {
            manager: window.jankxPartialHydrationManager,
            monitor: window.jankxPerformanceMonitor,

            // Public methods
            loadLayout: (element) => window.jankxPartialHydrationManager.loadLayout(element),
            forceLoadAll: () => window.jankxPartialHydrationManager.forceLoadAll(),
            getStats: () => window.jankxPartialHydrationManager.getStats(),
            getMetrics: () => window.jankxPerformanceMonitor.getMetrics()
        };

        console.log('[Jankx] Partial Hydration System initialized');
    }

    // Initialize
    init();

})();