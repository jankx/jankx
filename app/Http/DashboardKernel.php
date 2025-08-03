<?php

namespace App\Http;

use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;

class DashboardKernel extends Kernel
{
    /**
     * Handle an incoming admin dashboard request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return void
     */
    public function handle($request)
    {
        // Admin dashboard specific logic will be implemented via service providers
    }

    /**
     * Register WordPress hooks for admin dashboard.
     *
     * @return void
     */
    public function registerHooks()
    {
        // Admin hooks will be registered via service providers
    }
}
