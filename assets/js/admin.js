/**
 * Jankx Admin JavaScript
 *
 * Handles admin interface functionality
 *
 * @package Jankx\Assets
 * @since 2.0.0
 */

(function($) {
    'use strict';

    // Initialize admin functionality
    function initAdmin() {
        // Admin initialization code here
    }

    // Initialize dashboard widgets
    function initDashboardWidgets() {
        $('.jankx-dashboard-widget').each(function() {
            const widgetId = $(this).data('widget-id');

            // Widget initialization code here
        });
    }

    // Show admin notification
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="jankx-notice jankx-notice-${type}">
                <p>${message}</p>
                <button class="jankx-notice-dismiss">×</button>
            </div>
        `);

        $('.jankx-admin-header').append(notification);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            notification.fadeOut();
        }, 5000);

        // Manual dismiss
        notification.find('.jankx-notice-dismiss').on('click', function() {
            notification.fadeOut();
        });
    }

    // Show error notification
    function showError(message) {
        showNotification(message, 'error');
    }

    // Show success notification
    function showSuccess(message) {
        showNotification(message, 'success');
    }

    // Initialize when DOM is ready
    $(document).ready(function() {
        initAdmin();
        initDashboardWidgets();
    });

})(jQuery);