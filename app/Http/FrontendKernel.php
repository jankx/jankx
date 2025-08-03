<?php

namespace App\Http;

use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;

class FrontendKernel extends Kernel
{
    /**
     * The kernel context.
     *
     * @var string
     */
    protected $context = 'frontend';

    /**
     * Handle an incoming frontend request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    public function handle($request)
    {
        // Frontend specific logic will be implemented via service providers
    }

    /**
     * Register WordPress hooks for frontend.
     *
     * @return void
     */
    public function registerHooks()
    {
        // Frontend hooks will be registered via service providers
    }
}
