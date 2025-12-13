<?php

namespace App\Providers\WordPress;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class AdminThumbnailColumnStyleServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
    }

    public function boot(Application $app)
    {
        add_action('admin_head', function () {
            echo '<style id="jankx-admin-thumbnail-column">
            .wp-list-table th.column-thumbnail,
            .wp-list-table td.column-thumbnail,
            .wp-list-table th.column-featured_image,
            .wp-list-table td.column-featured_image,
            .wp-list-table th.column-featured-image,
            .wp-list-table td.column-featured-image { width: 110px !important; }

            .wp-list-table .column-thumbnail img,
            .wp-list-table .column-featured_image img,
            .wp-list-table .column-featured-image img,
            .wp-list-table td.column-thumbnail img,
            .wp-list-table td.column-featured_image img,
            .wp-list-table td.column-featured-image img {
                width: 100px !important;
                height: 100px !important;
                object-fit: cover;
                aspect-ratio: 1 / 1;
                display: block;
            }
            </style>';
        });
    }
}

