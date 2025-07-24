<?php

namespace Jankx\Bootstrappers\CLI;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class CLIBootstrapper extends AbstractBootstrapper
{
    protected $priority = 30;

    public function getName(): string
    {
        return 'cli';
    }

    public function shouldRun(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    public function bootstrap(Container $container): void
    {
        do_action('jankx/bootstrapper/cli/loaded', $container);
    }
}
