<?php
namespace Jankx\Extensions;

use Jankx\Extensions\AbstractExtension;

class DisableGutenbergExtension extends AbstractExtension
{
    public function register_hooks()
    {
        add_filter('jankx/gutenberg/enabled', '__return_false', 5);
    }
}
