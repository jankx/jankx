<?php

use Jankx\Http\Request as JankxRequest;
use Jankx\Foundation\Http\Kernels\AdminAjaxKernel;
use Jankx\Foundation\Http\Kernels\RestApiKernel;
use Jankx\Foundation\Http\Kernels\DashboardKernel;
use Jankx\Foundation\Http\Kernels\FrontendKernel;
use Jankx\Foundation\Cli\ConsoleDetector;
use Jankx\Foundation\Cli\Kernels\WpCronKernel;
use Jankx\Foundation\Cli\Kernels\WpCliKernel;
use Jankx\Helper\Environment;

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
        if (Environment::isWpCli()) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Framework handling WP CLI request');
            }
            $this->handleConsoleRequest();
            return;
        }

        if (Environment::isWpCron()) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Framework handling WP Cron request');
            }
            $this->handleConsoleRequest();
            return;
        }

        // Handle HTTP requests
        $request = JankxRequest::capture();
        $requestType = $request->getRequestType();

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Framework handling %s request', $requestType));
        }

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

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Request Type: %s', $requestType));
            error_log(sprintf('[JANKX DEBUG] Request Path: %s', $request->getPathInfo()));
            error_log(sprintf('[JANKX DEBUG] Request Method: %s', $request->getMethod()));
        }

        // Create appropriate kernel based on request type
        switch ($requestType) {
            case 'admin_ajax':
                $kernel = new AdminAjaxKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created AdminAjaxKernel');
                }
                break;

            case 'rest_api':
                $kernel = new RestApiKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created RestApiKernel');
                }
                break;

            case 'dashboard':
                $kernel = new DashboardKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created DashboardKernel');
                }
                break;

            case 'frontend':
            default:
                $kernel = new FrontendKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created FrontendKernel');
                }
                break;
        }

        // Initialize the kernel with WordPress hooks
        try {
            $kernel->init($request);
        } catch (Exception $e) {
            // Handle exceptions
            if (Environment::isDebugLog()) {
                throw $e;
            }
            error_log('Jankx HTTP Error: ' . $e->getMessage());
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
        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Console Type: %s', $consoleType));
            error_log(sprintf('[JANKX DEBUG] Console Args: %s', json_encode($args)));
        }

        // Create appropriate kernel based on console type
        switch ($consoleType) {
            case 'wp_cli':
                $kernel = new WpCliKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created WpCliKernel');
                }
                break;

            case 'wp_cron':
                $kernel = new WpCronKernel($this->app);
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Created WpCronKernel');
                }
                break;

            default:
                if (Environment::isDebugLog()) {
                    error_log('[JANKX DEBUG] Unknown console type');
                }
                return 1; // Unknown console type
        }

        // Handle the console request
        try {
            return $kernel->handle($args);
        } catch (Exception $e) {
            // Handle exceptions
            if (Environment::isDebugLog()) {
                throw $e;
            }
            error_log('Jankx Console Error: ' . $e->getMessage());
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
    error_log('[JANKX ERROR] Composer autoloader not loaded');
    return;
}

$app = require dirname(__FILE__) . '/boot/app.php';
$framework->setApp($app);
$framework->init();
