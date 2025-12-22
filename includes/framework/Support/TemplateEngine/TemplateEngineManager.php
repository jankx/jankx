<?php

namespace Jankx\Support\TemplateEngine;

use Exception;
use Jankx\Facades\Log;
use Jankx\Foundation\Application;

/**
 * Concrete Template Engine Manager
 *
 * Manages multiple template engines and provides a unified interface
 * for template rendering with caching and WordPress integration.
 *
 * @package Jankx\Support\TemplateEngine
 * @since 2.0.0
 */
class TemplateEngineManager extends Engine
{
    /**
     * Create a new template engine manager.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->registerEngines();
    }

    /**
     * Register available template engines.
     *
     * @return void
     */
    protected function registerEngines()
    {
        $engines = ['plates', 'latte'];
        
        foreach ($engines as $engine) {
            try {
                $engineKey = "template.engine.{$engine}";
                if ($this->app->bound($engineKey)) {
                    $this->engines[$engine] = $this->app->make($engineKey);
                }
            } catch (Exception $e) {
                Log::debug("Failed to load {$engine} template engine: " . $e->getMessage());
            }
        }

        // Ensure we have at least one engine available
        if (empty($this->engines)) {
            Log::warning('No template engines are available. Please check your service provider configuration.');
        }
    }

    /**
     * Get the engine name.
     *
     * @return string
     */
    public function getEngineName(): string
    {
        return 'TemplateEngineManager';
    }

    /**
     * Get available engines.
     *
     * @return array
     */
    public function getAvailableEngines()
    {
        return array_keys($this->engines);
    }

    /**
     * Check if engine is available.
     *
     * @param  string  $engine
     * @return bool
     */
    public function isEngineAvailable($engine)
    {
        return isset($this->engines[$engine]);
    }

    /**
     * Get engine ID.
     *
     * @return string
     */
    public function getId(): string
    {
        return 'template-engine-manager';
    }
}
