(function ($) {
    'use strict';

    var $progress = $('.jankx-demo-progress');
    var $progressFill = $('.jankx-demo-progress-fill');
    var $progressText = $('.jankx-demo-progress-text');
    var $result = $('.jankx-demo-result');

    function showProgress(message) {
        $result.hide().removeClass('success error');
        $progress.show();
        $progressFill.css('width', '0%');
        $progressText.text(message || jankxDemoImport.strings.importing);
    }

    function updateProgress(percent, message) {
        $progressFill.css('width', percent + '%');
        if (message) {
            $progressText.text(message);
        }
    }

    function showResult(message, type) {
        $progress.hide();
        $result
            .removeClass('success error')
            .addClass(type || 'success')
            .html('<p>' + message + '</p>')
            .show();
    }

    function importDemo(demoId) {
        if (!confirm(jankxDemoImport.strings.importConfirm)) {
            return;
        }

        showProgress();
        updateProgress(10, 'Preparing...');

        $.post(jankxDemoImport.ajaxUrl, {
            action: 'jankx_import_demo',
            demo: demoId,
            nonce: jankxDemoImport.nonce
        }, function (response) {
            if (response.success) {
                updateProgress(100, jankxDemoImport.strings.importDone);
                showResult(response.data.message, 'success');
                setTimeout(function () {
                    location.reload();
                }, 1500);
            } else {
                showResult(response.data.message || jankxDemoImport.strings.importError, 'error');
            }
        }).fail(function () {
            showResult(jankxDemoImport.strings.importError, 'error');
        });
    }

    function resetDemo(demoId) {
        if (!confirm(jankxDemoImport.strings.resetConfirm)) {
            return;
        }

        showProgress();
        updateProgress(10, 'Removing demo data...');

        $.post(jankxDemoImport.ajaxUrl, {
            action: 'jankx_reset_demo',
            demo: demoId,
            nonce: jankxDemoImport.nonce
        }, function (response) {
            if (response.success) {
                updateProgress(100, jankxDemoImport.strings.resetDone);
                showResult(response.data.message, 'success');
                setTimeout(function () {
                    location.reload();
                }, 1500);
            } else {
                showResult(response.data.message || jankxDemoImport.strings.importError, 'error');
            }
        }).fail(function () {
            showResult(jankxDemoImport.strings.importError, 'error');
        });
    }

    $(document).ready(function () {
        $('.jankx-import-demo').on('click', function () {
            importDemo($(this).data('demo'));
        });

        $('.jankx-reset-demo').on('click', function () {
            resetDemo($(this).data('demo'));
        });
    });

})(jQuery);
