<?php

namespace Jankx\App\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Jankx\Layouts\PostLayout\PostLayoutManager;

class PostLayoutServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register PostLayoutManager as singleton in container
        $app->singleton('post.layout.manager', function (Application $app) {
            return PostLayoutManager::getInstance();
        });

        // Alias for easier access
        $app->alias('post.layout.manager', PostLayoutManager::class);

        // Register AJAX handler
        add_action('init', [$this, 'registerAjaxHandler']);
    }

    public function boot(Application $app)
    {
        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendScripts']);

        // Add nonce for AJAX security
        add_action('wp_head', [$this, 'addAjaxNonce']);
    }

    public function registerAjaxHandler()
    {
        // Include the AJAX handler
        require_once get_template_directory() . '/resources/blocks/post-layout/ajax-handler.php';
    }

    public function enqueueFrontendScripts()
    {
        // Only enqueue on frontend
        if (is_admin()) {
            return;
        }

        // Enqueue frontend script for post layout blocks
        wp_enqueue_script(
            'jankx-post-layout-frontend',
            get_template_directory_uri() . '/resources/blocks/post-layout/frontend.js',
            ['jquery'],
            '1.0.0',
            true
        );

        // Enqueue styles
        wp_enqueue_style(
            'jankx-post-layout-style',
            get_template_directory_uri() . '/resources/blocks/post-layout/build/style.css',
            [],
            '1.0.0'
        );
    }

    public function addAjaxNonce()
    {
        echo '<script type="text/javascript">';
        echo 'window.jankx_ajax = {';
        echo '  url: "' . admin_url('admin-ajax.php') . '",';
        echo '  nonce: "' . wp_create_nonce('jankx_post_layout_nonce') . '"';
        echo '};';
        echo '</script>';
    }
}
