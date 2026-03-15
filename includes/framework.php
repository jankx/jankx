<?php

use App\Console\WpCliKernel;
use App\Console\WpCronKernel;
use App\Http\AdminAjaxKernel;
use App\Http\DashboardKernel;
use App\Http\FrontendKernel;
use App\Http\RestApiKernel;

use Jankx\Helper\Environment;
use Jankx\Foundation\Application;
use Jankx\Foundation\Cli\ConsoleDetector;
use Jankx\Http\Request as JankxRequest;

/**
 * Jankx Framework Class
 *
 * This class handles the framework initialization and request routing
 * based on the type of request (HTTP or Console).
 */
class Jankx_Framework
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    protected $loaded = false;

    public function __construct()
    {
        $this->loadComposer();
    }


    /**
     * Create a new Jankx Framework instance.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function setApp(&$app): self
    {
        $this->app = $app;

        // Set application instance to container
        Application::setInstance($app);

        return $this;
    }

    /**
     * Initialize the framework
     *
     * @return void
     */
    public function init()
    {
        // Handle console requests first
        if (Environment::isWpCli() || Environment::isWpCron()) {
            $this->handleConsoleRequest();
            return;
        }

        // Handle HTTP requests
        $request = JankxRequest::capture();
        $requestType = $request->getRequestType();

        $this->handleHttpRequest();
    }

    /**
     * Handle HTTP requests
     *
     * @return void
     */
    public function handleHttpRequest()
    {
        $request = JankxRequest::capture();
        $requestType = $request->getRequestType();

        // Only log in debug mode if needed


        // Create appropriate kernel based on request type
        switch ($requestType) {
            case 'admin_ajax':
                $kernel = new AdminAjaxKernel($this->app);
                break;

            case 'rest_api':
                $kernel = new RestApiKernel($this->app);
                break;

            case 'admin':
                $kernel = new DashboardKernel($this->app);
                break;

            case 'frontend':
            default:
                $kernel = new FrontendKernel($this->app);
                break;
        }

        // Register kernel in container
        $this->app->instance('kernel', $kernel);

        // Initialize the kernel with WordPress hooks
        try {
            $kernel->init($request);
        } catch (Exception $e) {
            // Handle exceptions
            if (Environment::isDebugLog()) {
                throw $e;
            }
        }
    }

    /**
     * Handle Console requests
     *
     * @param array $args
     * @return int
     */
    public function handleConsoleRequest($args = [])
    {
        // Detect console type
        $consoleType = ConsoleDetector::detect($args);

        // Log debug information


        // Create appropriate kernel based on console type
        switch ($consoleType) {
            case 'wp_cli':
                $kernel = new WpCliKernel($this->app);
                break;

            case 'wp_cron':
                $kernel = new WpCronKernel($this->app);
                break;

            default:
                return 1; // Unknown console type
        }

        // Register kernel in container
        $this->app->instance('kernel', $kernel);

        // Handle the console request
        try {
            return $kernel->handle($args);
        } catch (Exception $e) {
            // Handle exceptions
            if (Environment::isDebugLog()) {
                throw $e;
            }
                        return 1;
        }
    }

    /**
     * Load Composer autoloader.
     *
     * @return void
     */
    protected function loadComposer()
    {
        // Load Composer autoloader first
        $composerAutoload = dirname(__FILE__) . '/../vendor/autoload.php';
        if (file_exists($composerAutoload)) {
            require_once $composerAutoload;

            $this->loaded = true;
        }
    }

    /**
     * Get the application instance.
     *
     * @return \Jankx\Foundation\Application
     */
    public function getApp()
    {
        return $this->app;
    }

    public function isLoaded()
    {
        return $this->loaded;
    }
}



// Boot framework
$framework = new Jankx_Framework();
if (!$framework->isLoaded()) {
        return;
}

// Load helpers
require dirname(__FILE__) . '/boot/helpers.php';

$app = require dirname(__FILE__) . '/boot/app.php';
$framework->setApp($app);
$framework->init();
