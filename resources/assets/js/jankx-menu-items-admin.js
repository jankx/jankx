/**
 * Jankx Menu Items Admin JavaScript
 *
 * Handles Jankx Framework menu items in WordPress Menu Admin
 *
 * @package Jankx\Assets\JS
 * @since 2.0.0
 */

(function($) {
    'use strict';

    // Jankx Menu Items Admin
    var JankxMenuItemsAdmin = {

        /**
         * Initialize the admin interface
         */
        init: function() {
            this.bindEvents();
            this.setupAccordion();
            this.setupTooltips();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            // Add menu item buttons
            $(document).on('click', '.jankx-add-menu-item', this.addMenuItem);

            // Menu item type change
            $(document).on('change', 'select[name*="menu-item-jankx-type"]', this.handleTypeChange);

            // Menu item save
            $(document).on('submit', '#update-nav-menu', this.handleMenuSave);

            // Menu item delete
            $(document).on('click', '.item-delete', this.handleItemDelete);
        },

        /**
         * Setup accordion functionality
         */
        setupAccordion: function() {
            var $section = $('#jankx-framework-menu-items');
            var $title = $section.find('.accordion-section-title');
            var $content = $section.find('.accordion-section-content');

            // Expand by default
            $section.addClass('expanded');

            $title.on('click', function(e) {
                e.preventDefault();
                $section.toggleClass('expanded');

                // Store state in localStorage
                localStorage.setItem('jankx-menu-items-expanded', $section.hasClass('expanded'));
            });

            // Restore state from localStorage
            var expanded = localStorage.getItem('jankx-menu-items-expanded');
            if (expanded === 'false') {
                $section.removeClass('expanded');
            }
        },

        /**
         * Setup tooltips
         */
        setupTooltips: function() {
            $('.jankx-menu-item').each(function() {
                var $item = $(this);
                var $button = $item.find('.jankx-add-menu-item');
                var type = $item.data('type');

                // Add tooltip
                $button.attr('title', 'Add ' + type + ' to menu');
            });
        },

        /**
         * Add menu item to menu
         */
        addMenuItem: function(e) {
            e.preventDefault();

            var $button = $(this);
            var $item = $button.closest('.jankx-menu-item');
            var type = $item.data('type');
            var menuId = $('#menu').val();

            if (!menuId) {
                alert('Please select a menu first.');
                return;
            }

            // Show loading state
            $item.addClass('loading');
            $button.text('Adding...');

            // Create menu item data
            var itemData = {
                action: 'jankx_add_menu_item',
                nonce: jankxMenuItems.nonce,
                menu_id: menuId,
                item_type: type,
                item_title: $item.find('h5').text(),
                item_url: '#',
                item_classes: 'jankx-menu-item-' + type
            };

            // Send AJAX request
            $.ajax({
                url: jankxMenuItems.ajaxUrl,
                type: 'POST',
                data: itemData,
                success: function(response) {
                    if (response.success) {
                        // Show success state
                        $item.removeClass('loading').addClass('success');
                        $button.text('Added!');

                        // Refresh menu items
                        JankxMenuItemsAdmin.refreshMenuItems();

                        // Reset after 2 seconds
                        setTimeout(function() {
                            $item.removeClass('success');
                            $button.text('Add to Menu');
                        }, 2000);
                    } else {
                        // Show error state
                        $item.removeClass('loading').addClass('error');
                        $button.text('Error!');

                        alert('Error adding menu item: ' + (response.data || 'Unknown error'));

                        // Reset after 3 seconds
                        setTimeout(function() {
                            $item.removeClass('error');
                            $button.text('Add to Menu');
                        }, 3000);
                    }
                },
                error: function() {
                    // Show error state
                    $item.removeClass('loading').addClass('error');
                    $button.text('Error!');

                    alert('Network error. Please try again.');

                    // Reset after 3 seconds
                    setTimeout(function() {
                        $item.removeClass('error');
                        $button.text('Add to Menu');
                    }, 3000);
                }
            });
        },

        /**
         * Handle menu item type change
         */
        handleTypeChange: function() {
            var $select = $(this);
            var $item = $select.closest('.menu-item');
            var type = $select.val();

            if (type) {
                // Add type badge to menu item
                var $badge = $item.find('.menu-item-type-badge');
                if ($badge.length === 0) {
                    $badge = $('<span class="menu-item-type-badge">' + type + '</span>');
                    $item.find('.menu-item-title').append($badge);
                } else {
                    $badge.text(type);
                }

                // Show/hide custom fields
                $item.find('.jankx-menu-item-fields').show();
            } else {
                // Remove type badge
                $item.find('.menu-item-type-badge').remove();

                // Hide custom fields
                $item.find('.jankx-menu-item-fields').hide();
            }
        },

        /**
         * Handle menu save
         */
        handleMenuSave: function() {
            // Add loading state to save button
            var $saveButton = $('#save_menu_footer input[type="submit"]');
            var originalText = $saveButton.val();

            $saveButton.val('Saving...').prop('disabled', true);

            // Re-enable after save
            setTimeout(function() {
                $saveButton.val(originalText).prop('disabled', false);
            }, 2000);
        },

        /**
         * Handle menu item delete
         */
        handleItemDelete: function() {
            var $item = $(this).closest('.menu-item');
            var itemId = $item.attr('id').replace('menu-item-', '');

            // Remove type badge if exists
            $item.find('.menu-item-type-badge').remove();
        },

        /**
         * Refresh menu items
         */
        refreshMenuItems: function() {
            // Trigger WordPress menu refresh
            if (typeof wpNavMenu !== 'undefined') {
                wpNavMenu.refreshAdvancedAccessibility();
            }
        },

        /**
         * Show notification
         */
        showNotification: function(message, type) {
            type = type || 'info';

            var $notification = $('<div class="jankx-notification jankx-notification-' + type + '">' + message + '</div>');

            $('body').append($notification);

            // Show notification
            setTimeout(function() {
                $notification.addClass('show');
            }, 100);

            // Hide notification after 3 seconds
            setTimeout(function() {
                $notification.removeClass('show');
                setTimeout(function() {
                    $notification.remove();
                }, 300);
            }, 3000);
        },

        /**
         * Validate menu item
         */
        validateMenuItem: function($item) {
            var type = $item.find('select[name*="menu-item-jankx-type"]').val();

            if (type) {
                // Check if required fields are filled
                var $title = $item.find('input[name*="menu-item-title"]');
                var $url = $item.find('input[name*="menu-item-url"]');

                if (!$title.val()) {
                    this.showNotification('Please enter a title for the menu item.', 'error');
                    return false;
                }

                if (!$url.val() || $url.val() === 'http://') {
                    this.showNotification('Please enter a valid URL for the menu item.', 'error');
                    return false;
                }
            }

            return true;
        },

        /**
         * Get menu item preview
         */
        getMenuItemPreview: function(type) {
            var previews = {
                'hamburger': '<span class="jankx-menu-item-hamburger" data-toggle="slideout-menu">☰</span>',
                'search': '<span class="jankx-menu-item-search" data-toggle="search">🔍</span>',
                'cart': '<span class="jankx-menu-item-cart" data-toggle="cart">🛒</span>',
                'user': '<span class="jankx-menu-item-user" data-toggle="user-menu">👤</span>'
            };

            return previews[type] || '';
        },

        /**
         * Update menu item preview
         */
        updateMenuItemPreview: function($item) {
            var type = $item.find('select[name*="menu-item-jankx-type"]').val();
            var $preview = $item.find('.menu-item-preview');

            if (type && $preview.length === 0) {
                $preview = $('<div class="menu-item-preview"></div>');
                $item.find('.menu-item-title').after($preview);
            }

            if (type) {
                $preview.html(this.getMenuItemPreview(type));
            } else {
                $preview.remove();
            }
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        JankxMenuItemsAdmin.init();
    });

    // Expose to global scope for debugging
    window.JankxMenuItemsAdmin = JankxMenuItemsAdmin;

})(jQuery);
