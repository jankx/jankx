(function ($) {
    'use strict';

    $(document).on('click', '.jankx-layout-switcher li.layout-option button', function (e) {
        e.preventDefault();

        var $btn = $(this);
        var $option = $btn.closest('.layout-option');
        var $switcher = $btn.closest('.jankx-layout-switcher');
        var queryId = $switcher.data('target-query-id');
        var layout = $option.data('layout');

        if ($option.hasClass('is-active')) {
            return;
        }

        // Find target block
        var $targetBlock = $('[data-query-id="' + queryId + '"]');
        if (!$targetBlock.length) {
            console.error('Jankx Layout Switcher: Target block not found', queryId);
            return;
        }

        var blockSettings = $targetBlock.data('block-settings') || {};
        var ajaxAction = $targetBlock.hasClass('wp-block-jankx-dynamic-ssr-layout')
            ? 'jankx_dynamic_ssr_layout_filter'
            : 'jankx_dynamic_data_layout_filter';

        // Add loading state
        $targetBlock.addClass('is-loading');
        $switcher.addClass('is-loading');

        $.ajax({
            url: jankxLayoutSwitcher.ajaxUrl,
            type: 'POST',
            data: {
                action: ajaxAction,
                nonce: jankxLayoutSwitcher.nonce,
                block_id: queryId,
                attributes: JSON.stringify(blockSettings),
                filters: JSON.stringify({
                    layout: layout
                }),
                post_id: $targetBlock.data('post-id') || 0
            },
            success: function (response) {
                if (response.success && response.data.html) {
                    var $newContent = $(response.data.html);

                    // Replace block content
                    // Note: response.data.html usually contains the wrapper div
                    if ($newContent.is('[data-query-id]')) {
                        $targetBlock.replaceWith($newContent);
                    } else {
                        $targetBlock.html($newContent.html());
                        // Update data attributes if necessary
                        if (response.data.attributes) {
                            $targetBlock.data('block-settings', response.data.attributes);
                            $targetBlock.attr('data-layout', response.data.attributes.layout);
                        }
                    }

                    // Update switcher state
                    $switcher.find('li.layout-option').removeClass('is-active');
                    $option.addClass('is-active');

                    // Trigger event for other components (like Swiper)
                    $(document).trigger('jankx-layout-switched', [$newContent, layout, queryId]);
                } else {
                    console.error('Jankx Layout Switcher error:', response.data.message || 'Unknown error');
                }
            },
            error: function (xhr, status, error) {
                console.error('Jankx Layout Switcher AJAX error:', error);
            },
            complete: function () {
                $targetBlock.removeClass('is-loading');
                $switcher.removeClass('is-loading');
            }
        });
    });

})(jQuery);
