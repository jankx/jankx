/**
 * Jankx Slideout Menu JavaScript
 *
 * Handles slideout menu interactions, touch gestures, and accessibility
 */

(function($) {
    'use strict';

    // Configuration from PHP
    const config = window.jankxSlideoutConfig || {
        enabled: true,
        breakpoint: 'tablet',
        position: 'left',
        animation: 'slide',
        duration: 300,
        overlay: true,
        close_on_click: true,
        close_on_escape: true,
        swipe_gesture: true,
        accessibility: true,
        trigger_selector: '.slideout-trigger',
        menu_selector: '#slideout-menu',
        overlay_selector: '#slideout-overlay',
        body_class: 'slideout-open',
        z_index: 9999
    };

    class SlideoutMenu {
        constructor() {
            this.isOpen = false;
            this.isAnimating = false;
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.touchEndX = 0;
            this.touchEndY = 0;

            this.menu = $(config.menu_selector);
            this.overlay = $(config.overlay_selector);
            this.body = $('body');

            this.init();
        }

        init() {
            if (!config.enabled) {
                return;
            }

            this.bindEvents();
            this.setupAccessibility();

            if (config.swipe_gesture) {
                this.setupSwipeGestures();
            }

            console.log('Jankx Slideout Menu initialized');
        }

        bindEvents() {
            // Trigger clicks
            $(document).on('click', config.trigger_selector, (e) => {
                e.preventDefault();
                this.toggle();
            });

            // Close button
            $(document).on('click', '.slideout-close', (e) => {
                e.preventDefault();
                this.close();
            });

            // Overlay clicks
            if (config.close_on_click && config.overlay) {
                $(document).on('click', config.overlay_selector, (e) => {
                    if (e.target === this.overlay[0]) {
                        this.close();
                    }
                });
            }

            // Escape key
            if (config.close_on_escape) {
                $(document).on('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.close();
                    }
                });
            }

            // Menu link clicks
            $(document).on('click', '.slideout-menu a', (e) => {
                // Close menu when clicking internal links
                if (e.target.hostname === window.location.hostname) {
                    setTimeout(() => {
                        this.close();
                    }, 100);
                }
            });

            // Window resize
            $(window).on('resize', () => {
                this.handleResize();
            });

            // Custom events
            $(document).on('jankx_slideout_open', () => {
                this.open();
            });

            $(document).on('jankx_slideout_close', () => {
                this.close();
            });

            $(document).on('jankx_slideout_toggle', () => {
                this.toggle();
            });
        }

        setupAccessibility() {
            if (!config.accessibility) {
                return;
            }

            // Add ARIA attributes
            this.menu.attr({
                'role': 'dialog',
                'aria-modal': 'true',
                'aria-label': 'Navigation menu',
                'aria-hidden': 'true'
            });

            // Focus management
            this.menu.on('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e);
                }
            });

            // Announce menu state
            this.announceMenuState();
        }

        setupSwipeGestures() {
            const minSwipeDistance = 50;
            const maxSwipeTime = 500;

            $(document).on('touchstart', (e) => {
                this.touchStartX = e.originalEvent.touches[0].clientX;
                this.touchStartY = e.originalEvent.touches[0].clientY;
                this.touchStartTime = Date.now();
            });

            $(document).on('touchend', (e) => {
                this.touchEndX = e.originalEvent.changedTouches[0].clientX;
                this.touchEndY = e.originalEvent.changedTouches[0].clientY;
                this.touchEndTime = Date.now();

                const deltaX = this.touchEndX - this.touchStartX;
                const deltaY = this.touchEndY - this.touchStartY;
                const deltaTime = this.touchEndTime - this.touchStartTime;

                // Check if it's a valid swipe
                if (Math.abs(deltaX) > Math.abs(deltaY) &&
                    Math.abs(deltaX) > minSwipeDistance &&
                    deltaTime < maxSwipeTime) {

                    this.handleSwipe(deltaX);
                }
            });
        }

        handleSwipe(deltaX) {
            const position = config.position;

            // Left swipe (from right to left)
            if (deltaX < 0 && (position === 'left' || position === 'top')) {
                this.open();
            }
            // Right swipe (from left to right)
            else if (deltaX > 0 && (position === 'right' || position === 'bottom')) {
                this.open();
            }
            // Close swipe
            else if (this.isOpen) {
                this.close();
            }
        }

        open() {
            if (this.isOpen || this.isAnimating) {
                return;
            }

            this.isAnimating = true;
            this.isOpen = true;

            // Add body class
            this.body.addClass(config.body_class);

            // Show overlay
            if (config.overlay) {
                this.overlay.css({
                    'visibility': 'visible',
                    'opacity': '1'
                });
            }

            // Animate menu
            this.animateMenu('open');

            // Focus management
            this.focusMenu();

            // Announce to screen readers
            this.announceMenuState();

            // Trigger custom event
            $(document).trigger('jankx_slideout_opened');

            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, config.duration);
        }

        close() {
            if (!this.isOpen || this.isAnimating) {
                return;
            }

            this.isAnimating = true;
            this.isOpen = false;

            // Remove body class
            this.body.removeClass(config.body_class);

            // Hide overlay
            if (config.overlay) {
                this.overlay.css({
                    'visibility': 'hidden',
                    'opacity': '0'
                });
            }

            // Animate menu
            this.animateMenu('close');

            // Return focus
            this.returnFocus();

            // Announce to screen readers
            this.announceMenuState();

            // Trigger custom event
            $(document).trigger('jankx_slideout_closed');

            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, config.duration);
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        animateMenu(action) {
            const position = config.position;
            const duration = config.duration;
            const animation = config.animation;

            let transform = '';

            switch (animation) {
                case 'fade':
                    this.menu.css({
                        'opacity': action === 'open' ? '1' : '0'
                    });
                    break;

                case 'scale':
                    transform = action === 'open' ? 'scale(1)' : 'scale(0.8)';
                    this.menu.css({
                        'transform': transform
                    });
                    break;

                case 'slide':
                default:
                    switch (position) {
                        case 'left':
                            transform = action === 'open' ? 'translateX(0)' : 'translateX(-100%)';
                            break;
                        case 'right':
                            transform = action === 'open' ? 'translateX(0)' : 'translateX(100%)';
                            break;
                        case 'top':
                            transform = action === 'open' ? 'translateY(0)' : 'translateY(-100%)';
                            break;
                        case 'bottom':
                            transform = action === 'open' ? 'translateY(0)' : 'translateY(100%)';
                            break;
                    }
                    this.menu.css({
                        'transform': transform
                    });
                    break;
            }
        }

        focusMenu() {
            // Store current focus
            this.previousFocus = document.activeElement;

            // Focus first focusable element in menu
            const firstFocusable = this.menu.find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
            if (firstFocusable.length) {
                firstFocusable.focus();
            } else {
                this.menu.focus();
            }
        }

        returnFocus() {
            if (this.previousFocus) {
                this.previousFocus.focus();
            }
        }

        handleTabNavigation(e) {
            const focusableElements = this.menu.find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements.first();
            const lastElement = focusableElements.last();

            if (e.shiftKey && document.activeElement === firstElement[0]) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement[0]) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        handleResize() {
            // Close menu on resize if needed
            if (this.isOpen && window.innerWidth > 768) {
                // Optional: close menu on desktop
                // this.close();
            }
        }

        announceMenuState() {
            if (!config.accessibility) {
                return;
            }

            const message = this.isOpen ? 'Menu opened' : 'Menu closed';

            // Create or update live region
            let liveRegion = $('#slideout-live-region');
            if (!liveRegion.length) {
                liveRegion = $('<div id="slideout-live-region" aria-live="polite" class="sr-only"></div>');
                $('body').append(liveRegion);
            }

            liveRegion.text(message);
        }

        // Public API
        getState() {
            return {
                isOpen: this.isOpen,
                isAnimating: this.isAnimating,
                config: config
            };
        }

        updateConfig(newConfig) {
            Object.assign(config, newConfig);
        }
    }

    // Initialize when DOM is ready
    $(document).ready(function() {
        window.jankxSlideoutMenu = new SlideoutMenu();
    });

    // Expose to global scope for external access
    window.JankxSlideoutMenu = SlideoutMenu;

})(jQuery);