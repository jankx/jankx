<?php

namespace Tests\Extensions;

use Jankx\Extensions\ExtensionManager;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;
use Mockery;

class ExtensionManagerTest extends TestCase
{
    protected $app;
    protected $manager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();
        $this->app->singleton('extension.manager', function($app) {
            return new ExtensionManager($app);
        });
        $this->manager = $this->app->make('extension.manager');
    }

    public function testConstructorSetsApplication()
    {
        $reflection = new \ReflectionClass($this->manager);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);

        $this->assertSame($this->app, $appProperty->getValue($this->manager));
    }

    public function testCanRequireExtension()
    {
        $reflection = new \ReflectionClass($this->manager);
        $method = $reflection->getMethod('require_extension');
        $method->setAccessible(true);

        $method->invoke($this->manager, 'test-extension', true);

        $requiredProperty = $reflection->getProperty('required_extensions');
        $requiredProperty->setAccessible(true);
        $required = $requiredProperty->getValue($this->manager);

        $this->assertArrayHasKey('test-extension', $required);
    }

    public function testCanRecommendExtension()
    {
        $reflection = new \ReflectionClass($this->manager);
        $method = $reflection->getMethod('require_extension');
        $method->setAccessible(true);

        $method->invoke($this->manager, 'test-extension', false);

        $recommendedProperty = $reflection->getProperty('recommended_extensions');
        $recommendedProperty->setAccessible(true);
        $recommended = $recommendedProperty->getValue($this->manager);

        $this->assertArrayHasKey('test-extension', $recommended);
    }

    public function testGetInstanceReturnsManagerFromContainer()
    {
        // Set up the App facade
        \Jankx\Facades\App::setFacadeApplication($this->app);
        $this->app->singleton('extension.manager', function($app) {
            return new ExtensionManager($app);
        });

        $instance = ExtensionManager::getInstance();

        $this->assertInstanceOf(ExtensionManager::class, $instance);
    }

    public function testCanActivateExtension()
    {
        // Create a mock extension
        $mockExtension = Mockery::mock('Jankx\Extensions\AbstractExtension');
        $mockExtension->shouldReceive('activate')->once();

        // Register the extension
        $reflection = new \ReflectionClass($this->manager);
        $extensionsProperty = $reflection->getProperty('extensions');
        $extensionsProperty->setAccessible(true);
        $extensionsProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        // Activate
        $this->manager->activate_extension('test-extension');

        // Verify the extension is active
        $this->assertTrue($this->manager->is_extension_active('test-extension'));
    }

    public function testCanDeactivateExtension()
    {
        // Create a mock extension
        $mockExtension = Mockery::mock('Jankx\Extensions\AbstractExtension');
        $mockExtension->shouldReceive('deactivate')->once();

        // Register and activate
        $reflection = new \ReflectionClass($this->manager);
        $extensionsProperty = $reflection->getProperty('extensions');
        $extensionsProperty->setAccessible(true);
        $extensionsProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        $activeProperty = $reflection->getProperty('active_extensions');
        $activeProperty->setAccessible(true);
        $activeProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        // Deactivate
        $this->manager->deactivate_extension('test-extension');

        // Verify it's deactivated
        $this->assertFalse($this->manager->is_extension_active('test-extension'));
    }

    public function testIsActiveReturnsTrueForActiveExtension()
    {
        // Create a mock extension
        $mockExtension = Mockery::mock('Jankx\Extensions\AbstractExtension');

        // Register and directly add to active_extensions
        $reflection = new \ReflectionClass($this->manager);
        $extensionsProperty = $reflection->getProperty('extensions');
        $extensionsProperty->setAccessible(true);
        $extensionsProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        $activeProperty = $reflection->getProperty('active_extensions');
        $activeProperty->setAccessible(true);
        $activeProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        $this->assertTrue($this->manager->is_extension_active('test-extension'));
    }

    public function testIsActiveReturnsFalseForInactiveExtension()
    {
        $this->assertFalse($this->manager->is_extension_active('test-extension'));
    }

    public function testIsExtensionActiveReturnsFalseForInactiveExtension()
    {
        $this->assertFalse($this->manager->is_extension_active('test-extension'));
    }

    public function testGetExtensionsReturnsAllExtensions()
    {
        $mockExtension = Mockery::mock('Jankx\Extensions\AbstractExtension');

        $reflection = new \ReflectionClass($this->manager);
        $extensionsProperty = $reflection->getProperty('extensions');
        $extensionsProperty->setAccessible(true);
        $extensionsProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        $extensions = $this->manager->get_extensions();

        $this->assertCount(1, $extensions);
        $this->assertArrayHasKey('test-extension', $extensions);
    }

    public function testGetExtensionReturnsExtensionById()
    {
        $mockExtension = Mockery::mock('Jankx\Extensions\AbstractExtension');

        $reflection = new \ReflectionClass($this->manager);
        $extensionsProperty = $reflection->getProperty('extensions');
        $extensionsProperty->setAccessible(true);
        $extensionsProperty->setValue($this->manager, ['test-extension' => $mockExtension]);

        $result = $this->manager->get_extension('test-extension');

        $this->assertSame($mockExtension, $result);
    }

    public function testGetExtensionReturnsNullForNonExistent()
    {
        $this->assertNull($this->manager->get_extension('nonexistent'));
    }
}
