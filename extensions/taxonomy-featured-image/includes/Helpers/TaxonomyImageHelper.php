<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Helpers;

use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;

/**
 * Taxonomy Image Helper
 *
 * Provides global template functions for frontend use.
 * Boot once via TaxonomyFeaturedImageExtension::init().
 */
class TaxonomyImageHelper
{
    protected static ?TaxonomyImageService $service = null;

    public static function boot(TaxonomyImageService $service): void
    {
        self::$service = $service;
    }

    public static function service(): ?TaxonomyImageService
    {
        return self::$service;
    }
}

if (!function_exists('jankx_term_image_id')) {
    function jankx_term_image_id($term): int
    {
        $service = TaxonomyImageHelper::service();
        if ($service === null) {
            return 0;
        }
        return $service->getTermImageId($term);
    }
}

if (!function_exists('jankx_term_image_url')) {
    function jankx_term_image_url($term, string $size = 'thumbnail'): string
    {
        $service = TaxonomyImageHelper::service();
        if ($service === null) {
            return '';
        }
        return $service->getTermImageUrl($term, $size);
    }
}

if (!function_exists('jankx_term_image')) {
    function jankx_term_image($term, string $size = 'thumbnail', array $attr = []): string
    {
        $service = TaxonomyImageHelper::service();
        if ($service === null) {
            return '';
        }
        return $service->getTermImage($term, $size, $attr);
    }
}
