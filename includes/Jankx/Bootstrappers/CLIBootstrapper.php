<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

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
