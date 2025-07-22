<?php

namespace Jankx\Providers;

/**
 * Frontend Helper Provider
 *
 * Registers helper functions and utilities for the frontend context.
 */
class FrontendHelperProvider
{
    protected $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function register()
    {
        // Register frontend helper functions or services here
    }
}