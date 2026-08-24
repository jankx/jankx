<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Admin;

use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;

/**
 * Theme Options Integration
 *
 * Injects the extension settings page into the Jankx theme options
 * (option-adapter / dashboard-framework) via core config filters.
 */
class ThemeOptionsIntegration
{
    const PAGE_ID = 'taxonomy_featured_image';

    /**
     * @var TaxonomyImageService
     */
    protected $service;

    public function __construct(TaxonomyImageService $service)
    {
        $this->service = $service;
    }

    public function register(): void
    {
        add_filter('jankx/option/core_pages_config', [$this, 'registerPage']);
        add_filter('jankx/option/core_sections_for_page', [$this, 'registerSections'], 10, 2);
    }

    /**
     * Register the settings page
     *
     * @param array $pages Existing pages
     * @return array
     */
    public function registerPage(array $pages): array
    {
        $pages[self::PAGE_ID] = [
            'id' => self::PAGE_ID,
            'name' => __('Taxonomy Featured Image', 'jankx'),
            'args' => [
                'description' => __('Enable featured image support per taxonomy', 'jankx'),
                'priority' => 45,
                'icon' => 'dashicons-format-image',
            ],
        ];

        return $pages;
    }

    /**
     * Register sections/fields for the settings page
     *
     * @param array $sections Existing sections
     * @param string $pageId Current page ID
     * @return array
     */
    public function registerSections(array $sections, string $pageId): array
    {
        if ($pageId !== self::PAGE_ID) {
            return $sections;
        }

        $sections[self::PAGE_ID . '_general'] = [
            'id' => self::PAGE_ID . '_general',
            'name' => __('General', 'jankx'),
            'fields' => [
                [
                    'id' => TaxonomyImageService::OPTION_ENABLED,
                    'name' => __('Enable Featured Images', 'jankx'),
                    'type' => 'switch',
                    'value' => 1,
                    'on' => __('On', 'jankx'),
                    'off' => __('Off', 'jankx'),
                    'description' => __('Master switch for taxonomy featured images', 'jankx'),
                ],
                [
                    'id' => TaxonomyImageService::OPTION_TAXONOMIES,
                    'name' => __('Supported Taxonomies', 'jankx'),
                    'type' => 'checkbox',
                    'options' => $this->service->getPublicTaxonomies(),
                    'value' => $this->getDefaultTaxonomies(),
                    'layout' => 'vertical',
                    'description' => __('Select taxonomies that support featured images. Can also be overridden via the `jankx/taxonomy-featured-image/taxonomies` filter.', 'jankx'),
                ],
            ],
        ];

        return $sections;
    }

    /**
     * Default selected taxonomies (hierarchical public taxonomies)
     *
     * @return array
     */
    protected function getDefaultTaxonomies(): array
    {
        $taxonomies = get_taxonomies([
            'public' => true,
            'hierarchical' => true,
        ], 'names');

        return array_values($taxonomies);
    }
}
