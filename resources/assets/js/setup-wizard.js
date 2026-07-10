(function ($) {
    'use strict';

    var selectedBundle = null;

    $(document).ready(function () {
        $('.jankx-wizard-skip').on('click', function () {
            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_skip',
                nonce: jankxWizard.nonce
            }).done(function () {
                window.location.href = jankxWizard.themeOptionsUrl;
            });
        });

        $('.jankx-wizard-bundle-card').on('click', function () {
            var $card = $(this);
            var bundleId = $card.data('bundle');

            $('.jankx-wizard-bundle-card').removeClass('active');
            $card.addClass('active');

            selectedBundle = bundleId;

            var bundle = jankxWizard.bundles[bundleId];
            if (bundle) {
                $('#jankx-wizard-primary-color').val(bundle.primaryColor);
                $('#jankx-wizard-secondary-color').val(bundle.secondaryColor);
            }
        });

        if (jankxWizard.activeBundle && jankxWizard.bundles[jankxWizard.activeBundle]) {
            var bundle = jankxWizard.bundles[jankxWizard.activeBundle];
            selectedBundle = jankxWizard.activeBundle;

            $('#jankx-wizard-primary-color').val(bundle.primaryColor);
            $('#jankx-wizard-secondary-color').val(bundle.secondaryColor);
        }

        $('.jankx-wizard-next').on('click', function (e) {
            if (!selectedBundle && !jankxWizard.activeBundle) {
                e.preventDefault();
                alert(jankxWizard.strings.selectBundle);
                return;
            }

            var bundleId = selectedBundle || jankxWizard.activeBundle;
            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_apply_bundle',
                bundle: bundleId,
                nonce: jankxWizard.bundleNonce
            });
        });

        $('.jankx-wizard-apply-bundle').on('click', function () {
            var $btn = $(this);
            var $status = $('.jankx-wizard-import-status');
            var $msg = $status.find('.jankx-wizard-import-message');

            bundleId = selectedBundle || jankxWizard.activeBundle;
            if (!bundleId) {
                alert(jankxWizard.strings.selectBundle);
                return;
            }

            $btn.prop('disabled', true);
            $status.show();
            $msg.text(jankxWizard.strings.applying);

            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_apply_bundle',
                bundle: bundleId,
                site_title: $('#jankx-wizard-site-title').val(),
                site_tagline: $('#jankx-wizard-tagline').val(),
                primary_color: $('#jankx-wizard-primary-color').val(),
                secondary_color: $('#jankx-wizard-secondary-color').val(),
                nonce: jankxWizard.bundleNonce
            }, function (response) {
                if (response.success) {
                    $msg.text(jankxWizard.strings.done);
                    $status.addClass('success');
                    setTimeout(function () {
                        window.location.href = 'admin.php?page=jankx-setup-wizard&step=4';
                    }, 1000);
                } else {
                    $msg.text(response.data.message || 'Failed to apply template.');
                    $status.addClass('error');
                    $btn.prop('disabled', false);
                }
            }).fail(function () {
                $msg.text('Application failed. Please try again.');
                $status.addClass('error');
                $btn.prop('disabled', false);
            });
        });

        $('.jankx-wizard-save-branding').on('click', function (e) {
            var title = $('#jankx-wizard-site-title').val();
            var tagline = $('#jankx-wizard-tagline').val();
            var primaryColor = $('#jankx-wizard-primary-color').val();
            var secondaryColor = $('#jankx-wizard-secondary-color').val();

            $.post(jankxWizard.ajaxUrl, {
                action: 'jankx_wizard_save_branding',
                site_title: title,
                site_tagline: tagline,
                primary_color: primaryColor,
                secondary_color: secondaryColor,
                nonce: jankxWizard.nonce
            });
        });
    });

})(jQuery);
