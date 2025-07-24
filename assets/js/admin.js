/**
 * Jankx Admin JavaScript
 *
 * Handles admin-specific functionality
 */

(function($) {
    'use strict';

    // Admin namespace
    window.JankxAdmin = window.JankxAdmin || {};

    // Initialize admin functionality
    $(document).ready(function() {
        JankxAdmin.init();
    });

    // Admin initialization
    JankxAdmin.init = function() {
        console.log('Jankx Admin initialized');

        // Initialize admin components
        JankxAdmin.initDashboard();
        JankxAdmin.initMenu();
        JankxAdmin.initNotices();
    };

    // Dashboard functionality
    JankxAdmin.initDashboard = function() {
        // Dashboard widget functionality
        $('.jankx-dashboard-widget').each(function() {
            var $widget = $(this);
            var widgetId = $widget.data('widget-id');

            if (widgetId) {
                console.log('Initializing dashboard widget:', widgetId);
            }
        });
    };

    // Menu functionality
    JankxAdmin.initMenu = function() {
        // Admin menu functionality
        $('.jankx-admin-menu').each(function() {
            var $menu = $(this);

            // Menu toggle functionality
            $menu.find('.menu-toggle').on('click', function(e) {
                e.preventDefault();
                $menu.toggleClass('menu-open');
            });
        });
    };

    // Notice functionality
    JankxAdmin.initNotices = function() {
        // Admin notice functionality
        $('.jankx-admin-notice').each(function() {
            var $notice = $(this);
            var noticeId = $notice.data('notice-id');

            // Dismiss notice functionality
            $notice.find('.notice-dismiss').on('click', function(e) {
                e.preventDefault();
                JankxAdmin.dismissNotice(noticeId);
            });
        });
    };

    // Dismiss notice
    JankxAdmin.dismissNotice = function(noticeId) {
        if (!noticeId) return;

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'jankx_dismiss_notice',
                notice_id: noticeId,
                nonce: jankxAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    $('[data-notice-id="' + noticeId + '"]').fadeOut();
                }
            }
        });
    };

    // Utility functions
    JankxAdmin.utils = {
        // Show loading spinner
        showLoading: function($element) {
            $element.addClass('loading');
        },

        // Hide loading spinner
        hideLoading: function($element) {
            $element.removeClass('loading');
        },

        // Show success message
        showSuccess: function(message) {
            if (typeof wp !== 'undefined' && wp.notices) {
                wp.notices.createSuccessNotice(message);
            } else {
                alert(message);
            }
        },

        // Show error message
        showError: function(message) {
            if (typeof wp !== 'undefined' && wp.notices) {
                wp.notices.createErrorNotice(message);
            } else {
                alert(message);
            }
        }
    };

})(jQuery);