<?php

namespace App\Services;

use Jankx\Services\GutenbergService as FrameworkGutenbergService;
use Jankx\Gutenberg\Filters\CoreBlockSpacingFilter;

class GutenbergService extends FrameworkGutenbergService
{
    /**
     * Register all blocks and block filters with WordPress.
     *
     * Runs at `init` priority 5, before WordPress core registers built-in blocks.
     *
     * @return void
     */
    public function registerBlocks()
    {
        // Register core block spacing filters early (before WP core registers blocks at priority 10)
        CoreBlockSpacingFilter::register();

        parent::registerBlocks();
    }
}

