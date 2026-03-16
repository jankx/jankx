<?php
namespace Jankx\Extensions;

use Jankx\Extensions\AbstractExtension;
use Jankx\Foundation\Application;
use Jankx\Facades\App;
use Jankx\Features\Metrics\MetricServiceProvider;

class MetricsExtension extends AbstractExtension
{
    /**
     * @var \Jankx\Features\Metrics\MetricServiceProvider
     */
    protected $provider;

    public function init(): void
    {
        // Register local autoloader for the Metrics feature classes
        // This allows the extension to find its classes even though they've been moved from the core features directory
        spl_autoload_register(function ($class) {
            $prefix = 'Jankx\\Features\\Metrics\\';
            $base_dir = __DIR__ . '/';

            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }

            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        });
    }

    public function register_hooks(): void
    {
        $app = App::getFacadeRoot();
        if (!$app) {
            return;
        }

        // Provide the extension URL via filter for internal services
        $url = $this->get_extension_url();
        add_filter('jankx/metrics/asset_url', function () use ($url) {
            return $url;
        });

        // Initialize the internal service provider logic
        $this->provider = new MetricServiceProvider($app);

        // Register and boot the internal provider logic
        // This integrates the existing metrics logic into the extension lifecycle
        $this->provider->register($app);
        $this->provider->boot($app);
    }
}
