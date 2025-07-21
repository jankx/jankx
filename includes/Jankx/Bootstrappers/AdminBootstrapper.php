<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

class AdminBootstrapper extends AbstractBootstrapper
{
    protected $priority = 20;

    public function getName(): string
    {
        return 'admin';
    }

    public function shouldRun(): bool
    {
        return is_admin();
    }

    public function bootstrap(Container $container): void
    {
        do_action('jankx/bootstrapper/admin/loaded', $container);
    }
}
