<?php

namespace App\Http;

use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;

class RestApiKernel extends Kernel
{
    /**
     * Handle an incoming REST API request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    public function handle($request)
    {
        // REST API specific logic will be implemented via service providers
    }

    /**
     * Register WordPress hooks for REST API.
     *
     * @return void
     */
    public function registerHooks()
    {
        // REST API hooks will be registered via service providers
    }
}
