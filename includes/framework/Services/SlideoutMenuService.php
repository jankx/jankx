<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

class SlideoutMenuService
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }
}
