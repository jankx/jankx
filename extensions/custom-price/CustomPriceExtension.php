<?php
namespace Jankx\Extensions;

use Jankx\Extensions\AbstractExtension;

class CustomPriceExtension extends AbstractExtension
{
    public function init(): void
    {
    }

    public function register_hooks(): void
    {
        add_action('init', [$this, 'registerBlock']);
    }

    public function registerBlock()
    {
        register_block_type($this->get_extension_path() . '/block');
    }
}
