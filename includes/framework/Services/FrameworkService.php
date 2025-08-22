<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Framework Service
 *
 * Manages framework global values and configuration
 */
class FrameworkService
{
    protected $app;
    protected $jankx = 'jankx-settings';

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->initializeDefaults();
    }

    /**
     * Initialize default values
     */
    protected function initializeDefaults()
    {
        // Set default jankx slug from config if available
        $configSlug = $this->app->make('config')->get('app.menu_slug');
        if ($configSlug) {
            $this->jankx = $configSlug;
        }
    }

    /**
     * Get jankx slug
     *
     * @return string
     */
    public function getJankx()
    {
        return $this->jankx;
    }

    /**
     * Set jankx slug
     *
     * @param string $value
     * @return void
     */
    public function setJankx($value)
    {
        $this->jankx = $value;
    }

    /**
     * Get service name
     *
     * @return string
     */
    public function getName()
    {
        return 'framework';
    }
}
