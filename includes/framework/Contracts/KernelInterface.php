<?php

namespace Jankx\Contracts;

use Jankx\Foundation\Application;
use Jankx\Http\Request;

/**
 * Kernel Interface
 *
 * Defines the contract for HTTP and Console kernels in Jankx Framework.
 * All kernel implementations must implement this interface.
 *
 * @package Jankx\Contracts
 * @since 2.0.0
 */
interface KernelInterface
{
    /**
     * Bootstrap the application for requests.
     *
     * @return void
     */
    public function bootstrap();

    /**
     * Handle an incoming request.
     * This method should register WordPress hooks instead of returning a response.
     *
     * @param \Jankx\Http\Request $request
     * @return void
     */
    public function handle($request);

    /**
     * Register WordPress hooks for this kernel.
     * This method should be called after bootstrap.
     * Console kernels may not need this method.
     *
     * @return void
     */
    public function registerHooks();

    /**
     * Initialize the kernel with WordPress hooks.
     * Console kernels may not need this method.
     *
     * @param \Jankx\Http\Request $request
     * @return void
     */
    public function init($request);

    /**
     * Get the application instance.
     *
     * @return \Jankx\Foundation\Application
     */
    public function getApplication();

    /**
     * Get the kernel context.
     *
     * @return string
     */
    public function getContext();
}
