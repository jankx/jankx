<?php

namespace Jankx\Foundation\Cli\Kernels;

use Jankx\Foundation\Cli\Kernel;
use Jankx\Support\Providers\WordPressCliServiceProvider;

class WpCliKernel extends Kernel
{
    /**
     * Handle WP CLI commands.
     *
     * @param  array  $args
     * @return int
     */
    public function handle($args)
    {
        $this->bootstrap();

        // Handle WP CLI specific logic
        if (!defined('WP_CLI') || !WP_CLI) {
            return 1;
        }

        // WordPress CLI Service Provider is automatically registered via config/providers.php
        // and booted through RegisterProviders bootstrap class

        return 0;
    }
}
