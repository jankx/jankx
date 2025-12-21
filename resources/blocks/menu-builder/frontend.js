/**
 * Menu Builder Frontend Controller
 * Responsive menu with mmenu integration and multiple submenu types
 * 
 * @package JankX\MenuBuilder
 * @since 1.0.0
 */

(function($) {
    'use strict';

    class MenuBuilderController {
        constructor(element, options = {}) {
            this.element = element;
            this.options = $.extend({}, MenuBuilderController.defaults, options);
            this.menuElement = $(element).find('.menu').first();
            this.mmenuInstance = null;
            this.isMobile = false;
            this.isDesktop = false;
            this.currentMode = 'destroyed';
            this.stateManager = null;
            
            this.init();
        }

        // Default options
        static defaults = {
            mobileBreakpoint: 768,
            desktopBreakpoint: 1024,
            enableMobileMenu: true,
            enableDesktopMenu: true,
            mobileMenuOptions: {
                slidingSubmenus: true,
                theme: 'dark',
                position: 'left',
                zposition: 'back'
            },
            desktopMenuOptions: {
                dropdownAnimation: 'fade',
                hoverDelay: 200,
                submenuTrigger: 'hover'
            },
            submenuTypes: {
                mega: {
                    enabled: true,
                    columns: 4,
                    fullWidth: true
                },
                flyout: {
                    enabled: true,
                    position: 'right',
                    animation: 'slide'
                },
                multilevel: {
                    enabled: true,
                    maxDepth: 3
                }
            }
        };

        init() {
            this.setupEventListeners();
            this.checkViewport();
            this.setupDesktopMenu();
        }

        setupEventListeners() {
            // Window resize handler
            $(window).on('resize orientationchange', $.proxy(this.checkViewport, this));

            // Setup mobile menu toggle
            this.setupMobileMenuToggle();

            // Setup desktop menu interactions
            this.setupDesktopMenuInteractions();
        }

        setupMobileMenuToggle() {
            // Create mobile menu toggle button if it doesn't exist
            if (!$('.jankx-menu-toggle').length) {
                const toggleButton = $('<button class="jankx-menu-toggle" aria-label="' + jankxMenuBuilder.i18n.openMenu + '">' +
                    '<span class="menu-toggle-icon"></span>' +
                '</button>');
                
                $(this.element).before(toggleButton);
                
                // Toggle button click handler
                toggleButton.on('click', $.proxy(this.toggleMobileMenu, this));
            }
        }

        toggleMobileMenu() {
            if (this.mmenuInstance) {
                if (this.stateManager && this.stateManager.getState) {
                    // Use state management approach
                    const state = this.stateManager.getState();
                    if (state.isOpen) {
                        this.stateManager.setState({ isOpen: false });
                    } else {
                        this.stateManager.setState({ isOpen: true });
                    }
                } else {
                    // Fallback to original mmenu API
                    if (this.mmenuInstance.isOpen && this.mmenuInstance.isOpen()) {
                        this.mmenuInstance.close();
                        $('.jankx-menu-toggle')
                            .removeClass('is-active')
                            .attr('aria-label', jankxMenuBuilder.i18n.openMenu);
                    } else {
                        this.mmenuInstance.open();
                        $('.jankx-menu-toggle')
                            .addClass('is-active')
                            .attr('aria-label', jankxMenuBuilder.i18n.closeMenu);
                    }
                }
            }
        }

        checkViewport() {
            const windowWidth = $(window).width();
            const wasMobile = this.isMobile;
            const wasDesktop = this.isDesktop;

            this.isMobile = windowWidth < this.options.mobileBreakpoint;
            this.isDesktop = windowWidth >= this.options.desktopBreakpoint;

            // Handle mode transitions
            if (wasMobile !== this.isMobile || wasDesktop !== this.isDesktop) {
                this.handleModeChange();
            }
        }

        handleModeChange() {
            // Destroy current menu instance
            this.destroyCurrentMenu();

            // Initialize appropriate menu mode
            if (this.isMobile && this.options.enableMobileMenu) {
                this.initMobileMenu();
            } else if (this.isDesktop && this.options.enableDesktopMenu) {
                this.initDesktopMenu();
            }
        }

        destroyCurrentMenu() {
            if (this.mmenuInstance) {
                try {
                    // Use state management approach if available
                    if (this.mmenuInstance.destroy && typeof this.mmenuInstance.destroy === 'function') {
                        this.mmenuInstance.destroy();
                    } else {
                        // Fallback to original mmenu destroy
                        this.mmenuInstance.close();
                        this.mmenuInstance.API.closeAllPanels();
                        this.mmenuInstance.API.destroy();
                    }
                    
                    // Clear state manager
                    this.stateManager = null;
                    
                } catch (e) {
                    console.warn('Error destroying mmenu instance:', e);
                }
                this.mmenuInstance = null;
            }

            // Reset menu state
            this.currentMode = 'destroyed';
            $(this.element).removeClass('mobile-menu desktop-menu');
            $('.jankx-menu-toggle').removeClass('is-active');
        }

        initMobileMenu() {
            if (!this.options.enableMobileMenu) return;

            this.currentMode = 'mobile';
            $(this.element).addClass('mobile-menu').removeClass('desktop-menu');

            // Initialize mmenu with state management if available
            if (typeof MmenuState !== 'undefined') {
                this.initMobileMenuWithStateManagement();
            } else if (typeof Mmenu !== 'undefined') {
                this.initMobileMenuOriginal();
            }
        }

        initMobileMenuWithStateManagement() {
            const mmenuOptions = this.getMmenuOptions();
            
            try {
                // Use state management version
                this.mmenuInstance = new MmenuState(this.menuElement, mmenuOptions);
                this.stateManager = this.mmenuInstance;

                // Setup state change listeners
                this.stateManager.subscribe('stateChange', (event) => {
                    this.handleStateChange(event);
                });

                // Setup mmenu event handlers
                this.mmenuInstance.bind('open:after', () => {
                    $('.jankx-menu-toggle')
                        .addClass('is-active')
                        .attr('aria-label', jankxMenuBuilder.i18n.closeMenu);
                });

                this.mmenuInstance.bind('close:after', () => {
                    $('.jankx-menu-toggle')
                        .removeClass('is-active')
                        .attr('aria-label', jankxMenuBuilder.i18n.openMenu);
                });

                console.log('Mobile menu initialized with state management');
            } catch (error) {
                console.error('Failed to initialize state management mmenu:', error);
                // Fallback to original version
                this.initMobileMenuOriginal();
            }
        }

        initMobileMenuOriginal() {
            const mmenuOptions = this.getMmenuOptions();
            this.mmenuInstance = new Mmenu(this.menuElement, mmenuOptions);

            // Setup mmenu event handlers
            this.mmenuInstance.bind('open:after', () => {
                $('.jankx-menu-toggle')
                    .addClass('is-active')
                    .attr('aria-label', jankxMenuBuilder.i18n.closeMenu);
            });

            this.mmenuInstance.bind('close:after', () => {
                $('.jankx-menu-toggle')
                    .removeClass('is-active')
                    .attr('aria-label', jankxMenuBuilder.i18n.openMenu);
            });

            console.log('Mobile menu initialized with original mmenu');
        }

        handleStateChange(event) {
            if (!event || !event.currentState) return;
            
            const state = event.currentState;
            
            // Update UI based on state changes
            if (state.isOpen !== undefined) {
                if (state.isOpen) {
                    $('.jankx-menu-toggle')
                        .addClass('is-active')
                        .attr('aria-label', jankxMenuBuilder.i18n.closeMenu);
                } else {
                    $('.jankx-menu-toggle')
                        .removeClass('is-active')
                        .attr('aria-label', jankxMenuBuilder.i18n.openMenu);
                }
            }

            // Log state changes for debugging
            if (window.jankxMenuBuilder && window.jankxMenuBuilder.debug) {
                console.log('Menu state changed:', state);
            }
        }

        getMmenuOptions() {
            const options = $.extend({}, this.options.mobileMenuOptions);
            
            // Configure off-canvas
            options.offCanvas = {
                position: options.position || 'left',
                zposition: options.zposition || 'back'
            };

            // Configure theme
            if (options.theme) {
                options.extensions = options.extensions || [];
                options.extensions.push(`theme-${options.theme}`);
            }

            // Configure sliding submenus
            if (options.slidingSubmenus) {
                options.slidingSubmenus = true;
            }

            return options;
        }

        initDesktopMenu() {
            if (!this.options.enableDesktopMenu) return;

            this.currentMode = 'desktop';
            $(this.element).addClass('desktop-menu').removeClass('mobile-menu');
            this.setupDesktopMenu();
        }

        setupDesktopMenu() {
            // Setup different submenu types
            this.setupMegaMenus();
            this.setupFlyoutMenus();
            this.setupMultilevelMenus();
        }

        setupDesktopMenuInteractions() {
            const self = this;

            // Handle menu item clicks
            $(this.element).on('click', '.menu-item', function(e) {
                const $item = $(this);
                const $submenu = $item.children('.submenu');

                if ($submenu.length) {
                    if (self.options.desktopMenuOptions.submenuTrigger === 'click') {
                        e.preventDefault();
                        self.toggleDesktopSubmenu($item);
                    }
                }
            });

            // Handle menu item hover
            if (this.options.desktopMenuOptions.submenuTrigger === 'hover') {
                $(this.element).on('mouseenter', '.menu-item.has-children', function() {
                    const $item = $(this);
                    self.showDesktopSubmenu($item);
                });

                $(this.element).on('mouseleave', '.menu-item.has-children', function() {
                    const $item = $(this);
                    self.hideDesktopSubmenu($item);
                });
            }
        }

        setupMegaMenus() {
            if (!this.options.submenuTypes.mega.enabled) return;

            $(this.element).find('.submenu-type-mega').each(function() {
                const $submenu = $(this);
                const columns = $submenu.data('mega-columns') || 4;
                const fullWidth = $submenu.data('mega-full-width') !== false;

                $submenu.addClass('mega-menu');
                if (fullWidth) {
                    $submenu.addClass('mega-menu-full-width');
                }
                $submenu.addClass(`mega-menu-columns-${columns}`);
            });
        }

        setupFlyoutMenus() {
            if (!this.options.submenuTypes.flyout.enabled) return;

            $(this.element).find('.submenu-type-flyout').each(function() {
                const $submenu = $(this);
                const position = $submenu.data('flyout-position') || 'right';
                const width = $submenu.data('flyout-width') || '300px';

                $submenu.addClass('flyout-menu');
                $submenu.addClass(`flyout-position-${position}`);
                $submenu.css('width', width);
            });
        }

        setupMultilevelMenus() {
            if (!this.options.submenuTypes.multilevel.enabled) return;

            $(this.element).find('.submenu-type-multilevel').each(function() {
                const $submenu = $(this);
                $submenu.addClass('multilevel-menu');

                // Add back button for mobile
                if ($(window).width() < 1024) {
                    $submenu.find('.submenu-list').each(function() {
                        const $list = $(this);
                        const $parentItem = $list.closest('.menu-item');
                        const parentLabel = $parentItem.children('.menu-item-link').text();

                        if (!$list.find('.submenu-back').length) {
                            const backButton = $('<li class="submenu-back">' +
                                '<a href="#" class="submenu-back-link">' +
                                    '<span class="back-arrow">←</span>' +
                                    '<span class="back-text">' + jankxMenuBuilder.i18n.backToParent + '</span>' +
                                '</a>' +
                            '</li>');
                            
                            $list.prepend(backButton);
                            
                            backButton.on('click', function(e) {
                                e.preventDefault();
                                // Handle back navigation
                                if (self.mmenuInstance) {
                                    self.mmenuInstance.back();
                                }
                            });
                        }
                    });
                }
            });
        }

        showDesktopSubmenu($item) {
            const $submenu = $item.children('.submenu');
            
            if ($submenu.length) {
                // Clear any existing timeout
                clearTimeout($item.data('submenu-timeout'));
                
                // Show submenu with animation
                $submenu.addClass('is-visible').removeClass('is-hidden');
                
                // Add animation class
                const animation = this.options.desktopMenuOptions.dropdownAnimation;
                if (animation && animation !== 'none') {
                    $submenu.addClass(`animate-${animation}`);
                }
                
                $item.addClass('is-hover');
            }
        }

        hideDesktopSubmenu($item) {
            const $submenu = $item.children('.submenu');
            
            if ($submenu.length) {
                // Set timeout for hiding
                const timeout = setTimeout(() => {
                    $submenu.removeClass('is-visible').addClass('is-hidden');
                    $submenu.removeClass(`animate-${this.options.desktopMenuOptions.dropdownAnimation}`);
                    $item.removeClass('is-hover');
                }, this.options.desktopMenuOptions.hoverDelay);
                
                $item.data('submenu-timeout', timeout);
            }
        }

        toggleDesktopSubmenu($item) {
            const $submenu = $item.children('.submenu');
            
            if ($submenu.length) {
                if ($submenu.hasClass('is-visible')) {
                    this.hideDesktopSubmenu($item);
                } else {
                    this.showDesktopSubmenu($item);
                }
            }
        }

        // Public methods
        destroy() {
            this.destroyCurrentMenu();
            $(window).off('resize orientationchange', this.checkViewport);
            $(this.element).off('click mouseenter mouseleave');
            $('.jankx-menu-toggle').off('click');
        }

        refresh() {
            this.checkViewport();
        }
    }

    // jQuery plugin
    $.fn.jankxMenuBuilder = function(options) {
        return this.each(function() {
            if (!$.data(this, 'jankxMenuBuilder')) {
                $.data(this, 'jankxMenuBuilder', new MenuBuilderController(this, options));
            }
        });
    };

    // Auto-initialize
    $(document).ready(function() {
        $('.jankx-responsive-menu').each(function() {
            const $element = $(this);
            const options = {
                mobileBreakpoint: parseInt($element.data('mobile-breakpoint')) || 768,
                desktopBreakpoint: parseInt($element.data('desktop-breakpoint')) || 1024,
                enableMobileMenu: $element.data('enable-mobile') !== 'false',
                enableDesktopMenu: $element.data('enable-desktop') !== 'false',
                mobileMenuOptions: $element.data('mobile-options') || {},
                desktopMenuOptions: $element.data('desktop-options') || {},
                submenuTypes: $element.data('submenu-types') || {}
            };

            $element.jankxMenuBuilder(options);
        });
    });

    // Expose controller globally
    window.JankxMenuBuilder = MenuBuilderController;

})(jQuery);
