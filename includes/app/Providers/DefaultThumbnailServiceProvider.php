<?php

namespace App\Providers;

use Jankx\Support\Providers\ServiceProvider;
use App\Services\DefaultThumbnailService;

/**
 * Default Thumbnail Service Provider
 *
 * This service provider handles default thumbnail functionality
 * for posts that don't have featured images.
 *
 * @package App\Providers
 * @since 1.0.0
 */
class DefaultThumbnailServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register($app)
    {
        // Register the default thumbnail service
        $app->singleton('defaultThumbnail', function ($app) {
            return new DefaultThumbnailService();
        });
    }

    /**
     * Boot the service provider.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot($app)
    {
        // Get the service instance
        $defaultThumbnailService = $app->make('defaultThumbnail');

        // Hook into WordPress to override have_post_thumbnail for supported post types
        add_filter('has_post_thumbnail', [$defaultThumbnailService, 'hasPostThumbnail'], 10, 3);

        // Hook to provide default thumbnail URL
        add_filter('post_thumbnail_html', [$defaultThumbnailService, 'getPostThumbnailHtml'], 10, 5);

        // Hook to get default thumbnail URL
        add_filter('wp_get_attachment_image_src', [$defaultThumbnailService, 'getAttachmentImageSrc'], 10, 4);

        // Hook to get default thumbnail ID
        add_filter('get_post_thumbnail_id', [$defaultThumbnailService, 'getPostThumbnailId'], 10, 2);

        // Hook into Gutenberg block rendering to inject default thumbnail
        add_filter('render_block', [$defaultThumbnailService, 'renderBlockFeaturedImage'], 10, 2);
    }
}
