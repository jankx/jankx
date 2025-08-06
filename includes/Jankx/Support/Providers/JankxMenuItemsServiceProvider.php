<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Services\JankxMenuItemsService;

/**
 * Jankx Menu Items Service Provider
 *
 * Registers JankxMenuItemsService to add custom menu items to WordPress Menu Admin:
 *
 * - Control section in nav-menus.php
 * - Hamburger menu item
 * - Search menu item
 * - Cart menu item
 * - User menu item
 * - Custom menu item types
 *
 * @package App\Providers
 * @since 2.0.0
 */
class JankxMenuItemsServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register the Jankx menu items service
        $app->singleton(JankxMenuItemsService::class, function ($app) {
            return new JankxMenuItemsService($app, $this->getConfig());
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize the Jankx menu items service - service sẽ tự động setup hooks
        $app->make(JankxMenuItemsService::class);
    }

    /**
     * Get configuration for Jankx menu items
     *
     * @return array
     */
    protected function getConfig()
    {
        return [
            'section_title' => 'Jankx Framework',
            'section_id' => 'jankx-framework-menu-items',
            'menu_items' => [
                'hamburger' => [
                    'title' => 'Hamburger Menu',
                    'description' => 'Add hamburger menu button for mobile navigation',
                    'icon' => '☰',
                    'class' => 'jankx-menu-item-hamburger',
                ],
                'search' => [
                    'title' => 'Search Box',
                    'description' => 'Add search functionality to menu',
                    'icon' => '🔍',
                    'class' => 'jankx-menu-item-search',
                ],
                'cart' => [
                    'title' => 'Shopping Cart',
                    'description' => 'Add shopping cart icon to menu',
                    'icon' => '🛒',
                    'class' => 'jankx-menu-item-cart',
                ],
                'user' => [
                    'title' => 'User Account',
                    'description' => 'Add user account menu item',
                    'icon' => '👤',
                    'class' => 'jankx-menu-item-user',
                ],
            ],
        ];
    }
}
