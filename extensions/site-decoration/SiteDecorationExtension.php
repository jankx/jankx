<?php

namespace Jankx\Extensions\SiteDecoration;

use Jankx\Extensions\AbstractExtension;

class SiteDecorationExtension extends AbstractExtension
{
    protected static $instance;

    public function init(): void
    {
        self::$instance = $this;
    }

    public function register_hooks(): void
    {
        add_action('init', [$this, 'registerBlock']);
    }

    public static function getInstance(): ?self
    {
        return self::$instance;
    }

    public function registerBlock(): void
    {
        $blockPath = __DIR__ . '/blocks/site-decoration';
        if (!is_dir($blockPath) || !file_exists($blockPath . '/block.json')) {
            return;
        }

        register_block_type_from_metadata($blockPath);
    }
}
