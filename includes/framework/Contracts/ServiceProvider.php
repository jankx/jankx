<?php

namespace Jankx\Contracts;

use Jankx\Foundation\Application;

interface ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app);

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app);

    /**
     * Check if provider should be loaded
     *
     * @return bool
     */
    public function shouldLoad(): bool;

    /**
     * Check if provider should be loaded in frontend
     *
     * @return bool
     */
    public function shouldLoadFrontend(): bool;

    /**
     * Check if provider should be loaded in admin
     *
     * @return bool
     */
    public function shouldLoadAdmin(): bool;

    /**
     * Check if provider should be loaded in CLI
     *
     * @return bool
     */
    public function shouldLoadCli(): bool;

    /**
     * Check if provider should be loaded in Cron
     *
     * @return bool
     */
    public function shouldLoadCron(): bool;

    /**
     * Check if provider should be loaded in REST API
     *
     * @return bool
     */
    public function shouldLoadRest(): bool;

    /**
     * Check if provider should be loaded in AJAX
     *
     * @return bool
     */
    public function shouldLoadAjax(): bool;
}
