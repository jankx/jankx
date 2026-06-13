(function ($) {
    'use strict';

    $(document).ready(function () {
        $('.jankx-wizard-skip').on('click', function () {
            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_skip',
                nonce: jankxWizard.nonce
            }).done(function () {
                window.location.href = jankxWizard.themeOptionsUrl;
            });
        });

        $('.jankx-wizard-demo-card').on('click', function () {
            var $card = $(this);
            var demoId = $card.data('demo');

            $('.jankx-wizard-demo-card').removeClass('active');
            $card.addClass('active');

            var $status = $('.jankx-wizard-import-status');
            $status
                .removeClass('success')
                .addClass('loading')
                .html(jankxWizard.strings.importing)
                .show();

            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_import_demo',
                demo: demoId,
                nonce: jankxWizard.nonce
            }, function (response) {
                if (response.success) {
                    $status
                        .removeClass('loading')
                        .addClass('success')
                        .html(response.data.message);
                } else {
                    $status
                        .removeClass('loading')
                        .addClass('error')
                        .html(response.data.message || 'Import failed.');
                }
            }).fail(function () {
                $status
                    .removeClass('loading')
                    .addClass('error')
                    .html('Import failed.');
            });
        });

        $('.jankx-wizard-save-branding').on('click', function (e) {
            var title = $('#jankx-wizard-site-title').val();
            var tagline = $('#jankx-wizard-tagline').val();
            var color = $('#jankx-wizard-primary-color').val();

            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_save_branding',
                site_title: title,
                site_tagline: tagline,
                primary_color: color,
                nonce: jankxWizard.nonce
            });
        });
    });

})(jQuery);
