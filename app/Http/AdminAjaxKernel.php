<?php

namespace App\Http;

use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;

class AdminAjaxKernel extends Kernel
{
    /**
     * Handle an incoming admin ajax request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    public function handle($request)
    {
        // Admin ajax specific logic will be implemented via service providers
    }

    /**
     * Register WordPress hooks for admin ajax.
     *
     * @return void
     */
    public function registerHooks()
    {
        // Admin ajax hooks will be registered via service providers
    }
}
