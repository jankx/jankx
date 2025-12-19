<?php

namespace App\Services;

use Jankx\Services\GutenbergService as FrameworkGutenbergService;

class GutenbergService extends FrameworkGutenbergService
{
    public function enqueueBlocksExtraEditorAssets()
    {
        wp_enqueue_script(
            'jankx-blocks-extra-editor',
            get_template_directory_uri() . '/resources/blocks-extra/js/editor.js',
            ['wp-blocks', 'wp-element', 'wp-components', 'wp-data', 'wp-block-editor'],
            '1.0.0',
            true
        );
    }

    public function enqueueBlocksExtraFrontendAssets()
    {
        wp_enqueue_script(
            'jankx-blocks-extra-frontend',
            get_template_directory_uri() . '/resources/blocks-extra/js/frontend.js',
            ['wp-element'],
            '1.0.0',
            true
        );
    }
}
