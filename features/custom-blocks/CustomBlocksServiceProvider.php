<?php

namespace Jankx\Features\CustomBlocks;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class CustomBlocksServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services if needed
    }

    public function boot(Application $app)
    {
        add_action('init', [$this, 'registerBlocks']);
    }

    public function registerBlocks()
    {
        register_block_type(__DIR__ . '/blocks/custom-price');
    }
}
