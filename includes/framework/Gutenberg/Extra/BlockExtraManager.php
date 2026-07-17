<?php

namespace Jankx\Gutenberg\Extra;

use Jankx\Foundation\Application;

/**
 * Class BlockExtraManager
 *
 * Manages the registration and initialization of extra enhancements for Gutenberg blocks.
 *
 * @package Jankx\Gutenberg\Extra
 */
class BlockExtraManager
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * List of registered block extra classes
     *
     * @var array
     */
    protected $extras = [];

    /**
     * BlockExtraManager constructor.
     *
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Register a block extra enhancement
     *
     * @param string $extraClass
     * @return void
     */
    public function register(string $extraClass): void
    {
        if (!in_array($extraClass, $this->extras)) {
            $this->extras[] = $extraClass;
        }
    }

    /**
     * Initialize all registered block extras
     *
     * @return void
     */
    public function init(): void
    {
        foreach ($this->extras as $extraClass) {
            if (class_exists($extraClass)) {
                $extra = new $extraClass();
                if ($extra instanceof \Jankx\Contracts\Gutenberg\BlockExtraInterface) {
                    $extra->register();
                }
            }
        }
    }
}
