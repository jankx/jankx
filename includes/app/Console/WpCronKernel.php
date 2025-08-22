<?php

namespace App\Console;

use Jankx\Foundation\Cli\Kernel;
use Jankx\Helper\Environment;

class WpCronKernel extends Kernel
{
    /**
     * The kernel context.
     *
     * @var string
     */
    protected $context = 'wp_cron';

    /**
     * Handle WordPress cron jobs.
     *
     * @param  array  $args
     * @return int
     */
    public function handle($args)
    {
        $this->bootstrap();

        // Handle WordPress cron specific logic
        if (!defined('DOING_CRON') || !DOING_CRON) {
            if (Environment::isDebugLog()) {
            }
            return 1;
        }



        // Process scheduled events without triggering wp_loaded
        // WordPress will handle cron jobs automatically
        // We don't need to call do_action('wp_loaded') here



        return 0;
    }
}
