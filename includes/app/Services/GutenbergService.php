<?php

namespace App\Services;

use Jankx\Services\GutenbergService as FrameworkGutenbergService;

class GutenbergService extends FrameworkGutenbergService
{
    public function enqueueBlocksExtraEditorAssets()
    {
        $asset_file = get_template_directory() . '/resources/blocks-extra/build/editor.asset.php';
        $script_file = get_template_directory() . '/resources/blocks-extra/build/editor.js';
        $handle = 'jankx-blocks-extra-editor';

        if (!file_exists($asset_file) || !file_exists($script_file)) {
            return;
        }
        $asset = require $asset_file;
        wp_enqueue_script(
            $handle,
            get_template_directory_uri() . '/resources/blocks-extra/build/editor.js',
            isset($asset['dependencies']) ? $asset['dependencies'] : ['wp-blocks', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'],
            isset($asset['version']) ? $asset['version'] : filemtime($script_file),
            true
        );
    }

    public function enqueueBlocksExtraFrontendAssets()
    {
        $asset_file = get_template_directory() . '/resources/blocks-extra/build/frontend.asset.php';
        $script_file = get_template_directory() . '/resources/blocks-extra/build/frontend.js';
        $handle = 'jankx-blocks-extra-frontend';

        if (!file_exists($asset_file) || !file_exists($script_file)) {
            return;
        }
        $asset = require $asset_file;
        wp_enqueue_script(
            $handle,
            get_template_directory_uri() . '/resources/blocks-extra/build/frontend.js',
            isset($asset['dependencies']) ? $asset['dependencies'] : ['wp-element'],
            isset($asset['version']) ? $asset['version'] : filemtime($script_file),
            true
        );
    }
}
