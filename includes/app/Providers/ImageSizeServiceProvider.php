<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class ImageSizeServiceProvider extends ServiceProvider
{
    protected $essential_sizes = [
        'thumbnail',
        'medium',
        'medium_large',
        'large',
        '1536x1536',
        '2048x2048'
    ];

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
     * Get all protected and enabled image sizes
     *
     * @return array
     */
    protected function getEnabledSizes()
    {
        $enabled_sizes = get_option('jankx_enabled_image_sizes');

        // If not set (first time or disabled), return null to indicate no filtering
        if ($enabled_sizes === false) {
            return null;
        }

        if (!is_array($enabled_sizes)) {
            $enabled_sizes = [];
        }

        // Add essential WordPress sizes
        $protected_sizes = $this->essential_sizes;

        // Add WooCommerce sizes if WooCommerce is active
        if (class_exists('WooCommerce')) {
            $protected_sizes = array_merge($protected_sizes, [
                'woocommerce_thumbnail',
                'woocommerce_single',
                'woocommerce_gallery_thumbnail',
                'shop_thumbnail',
                'shop_catalog',
                'shop_single'
            ]);
        }

        /**
         * Filter the protected image sizes that should never be disabled
         *
         * @param array $protected_sizes
         */
        $protected_sizes = apply_filters('jankx/image_sizes/protected', $protected_sizes);

        // Merge enabled sizes with protected sizes
        $final_sizes = array_unique(array_merge($enabled_sizes, $protected_sizes));

        /**
         * Filter final enabled image sizes
         *
         * @param array $final_sizes
         */
        return apply_filters('jankx/image_sizes/enabled', $final_sizes);
    }

    /**
     * Filter intermediate image sizes
     */
    public function filterImageSizes($sizes)
    {
        // Don't filter in Jankx Utilities page to allow management
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'jankx-utilities') {
            return $sizes;
        }

        $enabled_sizes = $this->getEnabledSizes();

        if (is_null($enabled_sizes)) {
            return $sizes;
        }

        return array_intersect($sizes, $enabled_sizes);
    }

    /**
     * Filter advanced image sizes (for the array format)
     */
    public function filterAdvancedImageSizes($sizes)
    {
        // Don't filter in Jankx Utilities page to allow management
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'jankx-utilities') {
            return $sizes;
        }

        $enabled_sizes = $this->getEnabledSizes();

        if (is_null($enabled_sizes)) {
            return $sizes;
        }

        foreach ($sizes as $name => $size) {
            if (!in_array($name, $enabled_sizes)) {
                unset($sizes[$name]);
            }
        }

        return $sizes;
    }
}
