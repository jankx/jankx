<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage;

use Jankx\Extensions\AbstractExtension;
use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;
use Jankx\Extensions\TaxonomyFeaturedImage\Admin\ThemeOptionsIntegration;
use Jankx\Extensions\TaxonomyFeaturedImage\Admin\TaxonomyImageAdmin;
use Jankx\Extensions\TaxonomyFeaturedImage\Helpers\TaxonomyImageHelper;

/**
 * Taxonomy Featured Image Extension
 *
 * Adds featured image (thumbnail) support to taxonomy terms via term meta.
 * Which taxonomies are supported is configurable from Theme Options and
 * through the `jankx/taxonomy-featured-image/taxonomies` filter.
 */
class TaxonomyFeaturedImageExtension extends AbstractExtension
{
    protected static $instance;

    protected $service;
    protected $admin;
    protected $optionsIntegration;

    public function __construct()
    {
        $this->registerAutoloader();
        parent::__construct();
    }

    protected function registerAutoloader()
    {
        spl_autoload_register(function ($class) {
            $prefix = 'Jankx\\Extensions\\TaxonomyFeaturedImage\\';
            $baseDir = __DIR__ . '/includes/';

            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }

            $relativeClass = substr($class, $len);
            $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        });
    }

    public function init(): void
    {
        self::$instance = $this;

        $this->service = new TaxonomyImageService();
        $this->optionsIntegration = new ThemeOptionsIntegration($this->service);
        $this->admin = new TaxonomyImageAdmin($this->service);

        TaxonomyImageHelper::boot($this->service);

        $this->register_hooks();
    }

    public static function get_instance(): ?self
    {
        return self::$instance;
    }

    public function getService(): TaxonomyImageService
    {
        return $this->service;
    }

    public function register_hooks(): void
    {
        // hooks register early so filters are applied BEFORE OptionFramework reads config
        $this->optionsIntegration->register();
        $this->admin->register();
    }
}
