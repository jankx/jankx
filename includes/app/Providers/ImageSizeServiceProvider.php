<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class ImageSizeServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // No services to register
    }

    public function boot(Application $app)
    {
        add_filter('intermediate_image_sizes', [$this, 'filterImageSizes']);
        add_filter('intermediate_image_sizes_advanced', [$this, 'filterAdvancedImageSizes']);
    }

    /**
     * Filter intermediate image sizes
     */
    public function filterImageSizes($sizes)
    {
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'jankx-utilities') {
            return $sizes;
        }

        $enabled_sizes = get_option('jankx_enabled_image_sizes');

        // If not set, return all sizes
        if ($enabled_sizes === false) {
            return $sizes;
        }

        if (!is_array($enabled_sizes)) {
            $enabled_sizes = [];
        }

        return array_intersect($sizes, $enabled_sizes);
    }

    /**
     * Filter advanced image sizes (for the array format)
     */
    public function filterAdvancedImageSizes($sizes)
    {
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'jankx-utilities') {
            return $sizes;
        }

        $enabled_sizes = get_option('jankx_enabled_image_sizes');

        // If not set, return all sizes
        if ($enabled_sizes === false) {
            return $sizes;
        }

        if (!is_array($enabled_sizes)) {
            $enabled_sizes = [];
        }

        foreach ($sizes as $name => $size) {
            if (!in_array($name, $enabled_sizes)) {
                unset($sizes[$name]);
            }
        }

        return $sizes;
    }
}
