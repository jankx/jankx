<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Admin;

use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;
use Jankx\Dashboard\Factories\FieldFactory;
use Jankx\Dashboard\Elements\Page;
use Jankx\Dashboard\Elements\Section;
use Jankx\Adapter\Options\Framework as OptionFramework;

/**
 * Theme Options Integration
 *
 * Injects the extension settings page into the Jankx theme options
 * (OptionFramework / dashboard-framework) by adding the page directly
 * to the framework's pages array after createSections() has run.
 */
class ThemeOptionsIntegration
{
    const PAGE_ID = 'taxonomy_featured_image';

    /**
     * @var TaxonomyImageService
     */
    protected $service;

    protected $injected = false;

    public function __construct(TaxonomyImageService $service)
    {
        $this->service = $service;
    }

    public function register(): void
    {
        add_action('admin_menu', [$this, 'injectPage'], 1);
    }

    /**
     * Inject the page into the OptionFramework's pages array.
     */
    public function injectPage(): void
    {
        if ($this->injected) {
            return;
        }
        $this->injected = true;

        $framework = $this->getFramework();
        if (!$framework) {
            return;
        }

        foreach ($framework->pages as $existing) {
            if (($existing->getId() ?? '') === self::PAGE_ID) {
                return;
            }
        }

        $saved = get_option('jankx_options', []);

        $page = new Page(__('Taxonomy Featured Image', 'jankx'), [], 'dashicons-format-image');
        $page->setId(self::PAGE_ID);
        $page->setDescription(__('Enable featured image support per taxonomy', 'jankx'));
        $page->setPriority(45);

        $section = new Section(__('General', 'jankx'), []);
        $section->setId(self::PAGE_ID . '_general');

        $section->addField(FieldFactory::create(
            TaxonomyImageService::OPTION_ENABLED,
            __('Enable Featured Images', 'jankx'),
            'switch',
            [
                'on' => __('On', 'jankx'),
                'off' => __('Off', 'jankx'),
                'value' => $saved[TaxonomyImageService::OPTION_ENABLED] ?? 1,
                'default' => 1,
                'description' => __('Master switch for taxonomy featured images', 'jankx'),
            ]
        ));

        $section->addField(FieldFactory::create(
            TaxonomyImageService::OPTION_TAXONOMIES,
            __('Supported Taxonomies', 'jankx'),
            'checkbox',
            [
                'options' => $this->service->getPublicTaxonomies(),
                'value' => $saved[TaxonomyImageService::OPTION_TAXONOMIES] ?? $this->getDefaultTaxonomies(),
                'default' => $this->getDefaultTaxonomies(),
                'layout' => 'vertical',
                'description' => __('Select taxonomies that support featured images. Can also be overridden via the jankx/taxonomy-featured-image/taxonomies filter.', 'jankx'),
            ]
        ));

        $page->addSection($section);
        $framework->addPage($page);
    }

    protected function getFramework()
    {
        try {
            $adapter = OptionFramework::getActiveFramework();
            if ($adapter && method_exists($adapter, 'getFramework')) {
                return $adapter->getFramework();
            }
        } catch (\Exception $e) {
        }
        return null;
    }

    protected function getDefaultTaxonomies(): array
    {
        $taxonomies = get_taxonomies([
            'public' => true,
            'hierarchical' => true,
        ], 'names');

        if (!in_array('destination', $taxonomies, true)) {
            $taxonomies[] = 'destination';
        }

        return array_values($taxonomies);
    }
}
