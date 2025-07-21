<?php

namespace Jankx\Bootstrappers\Dashboard;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

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
