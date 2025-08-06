<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;
use App\Services\Layouts\HamburgerMenuService;

/**
 * Hamburger Example Service
 *
 * Demonstrates how to use HamburgerMenuService:
 *
 * - Multiple hamburger menu instances
 * - Custom configurations
 * - Different menu locations
 * - Responsive behavior
 *
 * @package App\Services
 * @since 2.0.0
 */
class HamburgerExampleService extends AbstractService
{
    /**
     * @var string
     */
    protected $name = 'hamburger_example';

    /**
     * @var array
     */
    protected $hamburgerInstances = [];

    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->name = 'hamburger_example';
    }

    /**
     * Boot service
     *
     * @return void
     */
    protected function boot(): void
    {
        // Create multiple hamburger menu instances with different configs
        $this->createHamburgerInstances();

        // Add custom hooks
        add_action('wp_footer', [$this, 'displayHamburgerInfo']);
    }

    /**
     * Create multiple hamburger menu instances
     *
     * @return void
     */
    protected function createHamburgerInstances()
    {
        // Primary hamburger menu (mobile only)
        $this->hamburgerInstances['primary'] = new HamburgerMenuService($this->app, [
            'menu_locations' => ['primary'],
            'item_title' => '☰',
            'responsive' => [
                'mobile' => true,
                'tablet' => true,
                'desktop' => false,
            ],
            'position' => 'last',
            'item_attributes' => [
                'data-toggle' => 'slideout-menu',
                'aria-label' => 'Toggle primary menu',
                'aria-expanded' => 'false',
                'aria-controls' => 'jankx-slideout-menu',
            ],
        ]);

        // Secondary hamburger menu (desktop also)
        $this->hamburgerInstances['secondary'] = new HamburgerMenuService($this->app, [
            'menu_locations' => ['secondary'],
            'item_title' => '⋮',
            'responsive' => [
                'mobile' => true,
                'tablet' => true,
                'desktop' => true, // Enable on desktop
            ],
            'position' => 'first',
            'item_attributes' => [
                'data-toggle' => 'secondary-menu',
                'aria-label' => 'Toggle secondary menu',
                'aria-expanded' => 'false',
                'aria-controls' => 'jankx-secondary-menu',
            ],
        ]);

        // Floating hamburger menu
        $this->hamburgerInstances['floating'] = new HamburgerMenuService($this->app, [
            'menu_locations' => ['floating'],
            'item_title' => '⚙',
            'responsive' => [
                'mobile' => true,
                'tablet' => false,
                'desktop' => false,
            ],
            'position' => 'last',
            'item_attributes' => [
                'data-toggle' => 'floating-menu',
                'aria-label' => 'Toggle floating menu',
                'aria-expanded' => 'false',
                'aria-controls' => 'jankx-floating-menu',
            ],
        ]);
    }

    /**
     * Get hamburger menu instance
     *
     * @param  string  $instanceId
     * @return HamburgerMenuService|null
     */
    public function getHamburgerInstance(string $instanceId)
    {
        return $this->hamburgerInstances[$instanceId] ?? null;
    }

    /**
     * Get all hamburger instances
     *
     * @return array
     */
    public function getAllHamburgerInstances()
    {
        return $this->hamburgerInstances;
    }

    /**
     * Manually render hamburger menu item
     *
     * @param  string  $instanceId
     * @param  array  $attributes
     * @return void
     */
    public function renderHamburgerItem(string $instanceId, array $attributes = [])
    {
        $instance = $this->getHamburgerInstance($instanceId);

        if ($instance) {
            $instance->render($attributes);
        }
    }

    /**
     * Display hamburger menu information in footer (for debugging)
     *
     * @return void
     */
    public function displayHamburgerInfo()
    {
        if (current_user_can('manage_options') && defined('WP_DEBUG') && WP_DEBUG) {
            echo '<div style="position: fixed; bottom: 10px; left: 10px; background: #007cba; color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-size: 12px;">';
            echo '<strong>Hamburger Menu Instances:</strong><br>';

            foreach ($this->hamburgerInstances as $id => $instance) {
                $config = $instance->getConfig();
                echo "- {$id}: " . ($config['enabled'] ? 'Enabled' : 'Disabled') .
                     " (Mobile: " . ($config['responsive']['mobile'] ? 'Yes' : 'No') .
                     ", Desktop: " . ($config['responsive']['desktop'] ? 'Yes' : 'No') . ")<br>";
            }

            echo '</div>';
        }
    }

    /**
     * Get service configuration
     *
     * @return array
     */
    public function getServiceConfig()
    {
        return [
            'name' => $this->name,
            'instances' => array_keys($this->hamburgerInstances),
            'total_instances' => count($this->hamburgerInstances),
        ];
    }
}
