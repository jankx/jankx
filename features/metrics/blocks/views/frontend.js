/**
 * Frontend JavaScript for Post Views Block
 * Handles AJAX tracking of post views (Vanilla JS)
 */

(function() {
    'use strict';

    // Post Views Tracker
    var PostViewsTracker = {
        init: function() {
            // Prevent multiple initializations
            if (this.initialized) {
                return;
            }
            this.initialized = true;

            this.bindEvents();
        },

        bindEvents: function() {
            // Track view when page is fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.trackView.bind(this));
            } else {
                this.trackView();
            }

            // Track view when page becomes visible (for SPA-like behavior)
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        },

        trackView: function() {
            var postId = this.getPostId();
            if (!postId) return;

            // Check if already tracked in this session
            if (this.isAlreadyTracked(postId)) {
                return;
            }

            // Check if request is already in progress
            if (this.requestInProgress) {
                return;
            }

            // Track view via AJAX
            this.sendAjaxRequest(postId);
        },

        handleVisibilityChange: function() {
            if (!document.hidden) {
                this.trackView();
            }
        },

        getPostId: function() {
            // Try to get post ID from various sources
            var postId = window.jankxViewsData?.postId ||
                        document.body.dataset.postId ||
                        this.getFirstViewsBlockPostId() ||
                        null;

            return postId;
        },

        getFirstViewsBlockPostId: function() {
            var firstBlock = document.querySelector('.jankx-views-block');
            return firstBlock ? firstBlock.dataset.postId : null;
        },

        isAlreadyTracked: function(postId) {
            // Check session storage
            if (sessionStorage.getItem('jankx_viewed_' + postId)) {
                return true;
            }

            // Check local storage (24 hours)
            var tracked = localStorage.getItem('jankx_viewed_' + postId);
            if (tracked) {
                var timestamp = parseInt(tracked);
                var now = Date.now();
                var hours24 = 24 * 60 * 60 * 1000;

                if (now - timestamp < hours24) {
                    return true;
                }
            }

            return false;
        },

        sendAjaxRequest: function(postId) {
            var self = this;
            var ajaxUrl = window.jankxViewsData?.ajaxUrl || '/wp-admin/admin-ajax.php';
            var nonce = window.jankxViewsData?.nonce || '';

            // Set request in progress flag
            this.requestInProgress = true;

            // Create FormData for POST request
            var formData = new FormData();
            formData.append('action', 'track_post_view');
            formData.append('post_id', postId);
            formData.append('nonce', nonce);

            // Send AJAX request
            fetch(ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    self.markAsTracked(postId);
                    self.updateViewCounts(data.data.formatted_views);

                    // Trigger custom event
                    self.triggerCustomEvent('jankx:view-tracked', {
                        postId: postId,
                        views: data.data.views,
                        formattedViews: data.data.formatted_views
                    });
                }
            })
            .catch(function(error) {
                console.warn('Failed to track post view:', error);
            })
            .finally(function() {
                // Clear request in progress flag
                self.requestInProgress = false;
            });
        },

        markAsTracked: function(postId) {
            // Mark in session storage
            sessionStorage.setItem('jankx_viewed_' + postId, '1');

            // Mark in local storage with timestamp
            localStorage.setItem('jankx_viewed_' + postId, Date.now().toString());
        },

        updateViewCounts: function(newFormattedViews) {
            if (!newFormattedViews) return;

            // Update all view count elements on the page
            var viewCountElements = document.querySelectorAll('.jankx-views-block .views-count');

            viewCountElements.forEach(function(element) {
                var currentCount = element.textContent.trim();

                if (currentCount !== newFormattedViews) {
                    // Add animation effect
                    self.fadeOut(element, 200, function() {
                        element.textContent = newFormattedViews;
                        self.fadeIn(element, 200);
                    });
                }
            });
        },

        // Simple fade out animation
        fadeOut: function(element, duration, callback) {
            var start = performance.now();
            var initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;

            function animate(currentTime) {
                var elapsed = currentTime - start;
                var progress = Math.min(elapsed / duration, 1);
                var opacity = initialOpacity * (1 - progress);

                element.style.opacity = opacity;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (callback) callback();
                }
            }

            requestAnimationFrame(animate);
        },

        // Simple fade in animation
        fadeIn: function(element, duration) {
            var start = performance.now();
            element.style.opacity = 0;

            function animate(currentTime) {
                var elapsed = currentTime - start;
                var progress = Math.min(elapsed / duration, 1);

                element.style.opacity = progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        },

        // Trigger custom event
        triggerCustomEvent: function(eventName, detail) {
            var event = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        },

        // Public method to manually refresh view count
        refreshViewCount: function(postId) {
            var self = this;
            var ajaxUrl = window.jankxViewsData?.ajaxUrl || '/wp-admin/admin-ajax.php';
            var targetPostId = postId || this.getPostId();

            var formData = new FormData();
            formData.append('action', 'get_post_views');
            formData.append('post_id', targetPostId);

            fetch(ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    self.updateViewCounts(data.data.formatted_views);
                }
            })
            .catch(function(error) {
                console.warn('Failed to refresh view count:', error);
            });
        }
    };

    // Prevent multiple script executions
    if (window.JankxPostViewsTracker) {
        return;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            PostViewsTracker.init();
        });
    } else {
        PostViewsTracker.init();
    }

    // Make tracker available globally
    window.JankxPostViewsTracker = PostViewsTracker;

})();
