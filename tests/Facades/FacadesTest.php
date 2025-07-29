<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Config;
use Jankx\Facades\Logger;
use Jankx\Facades\Layout;
use Jankx\Facades\Application;
use Jankx\Facades\User;
use Jankx\Facades\DeferredService;

/**
 * Facades Test
 *
 * Tests for Jankx Framework Facades
 *
 * @package Tests\Facades
 * @since 2.0.0
 */
class FacadesTest extends TestCase
{
    /**
     * Test that all active facades exist
     */
    public function testAllActiveFacadesExist(): void
    {
        $facades = [
            Config::class,
            Logger::class,
            Layout::class,
            Application::class,
            User::class,
            DeferredService::class,
        ];

        foreach ($facades as $facade) {
            $this->assertTrue(class_exists($facade), "Facade {$facade} does not exist");
        }
    }

    /**
     * Test that removed facades no longer exist
     */
    public function testRemovedFacadesNoLongerExist(): void
    {
        $removedFacades = [
            'Jankx\Facades\Kernel',
            'Jankx\Facades\Options',
            'Jankx\Facades\Debug',
            'Jankx\Facades\Template',
            'Jankx\Facades\Theme',
            'Jankx\Facades\Asset',
            'Jankx\Facades\Block',
        ];

        foreach ($removedFacades as $facade) {
            $this->assertFalse(class_exists($facade), "Removed facade {$facade} still exists");
        }
    }

    /**
     * Test that facades extend base facade
     */
    public function testFacadesExtendBaseFacade(): void
    {
        $facades = [
            Config::class,
            Logger::class,
            Layout::class,
            Application::class,
            User::class,
            DeferredService::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $this->assertTrue($reflection->isSubclassOf(\Jankx\Facades\Facade::class), "Facade {$facade} does not extend base Facade");
        }
    }

    /**
     * Test that facades have getFacadeAccessor method
     */
    public function testFacadesHaveAccessorMethod(): void
    {
        $facades = [
            Config::class,
            Logger::class,
            Layout::class,
            Application::class,
            User::class,
            DeferredService::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $this->assertTrue($reflection->hasMethod('getFacadeAccessor'), "Facade {$facade} does not have getFacadeAccessor method");
        }
    }

    /**
     * Test that getFacadeAccessor method is protected
     */
    public function testFacadeAccessorMethodIsProtected(): void
    {
        $facades = [
            Config::class,
            Logger::class,
            Layout::class,
            Application::class,
            User::class,
            DeferredService::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $method = $reflection->getMethod('getFacadeAccessor');
            $this->assertTrue($method->isProtected(), "getFacadeAccessor method in {$facade} is not protected");
        }
    }

    /**
     * Test Config facade
     */
    public function testConfigFacade(): void
    {
        $this->assertTrue(class_exists(Config::class));
        $this->assertTrue(method_exists(Config::class, 'get'));
        $this->assertTrue(method_exists(Config::class, 'set'));
        $this->assertTrue(method_exists(Config::class, 'has'));
        $this->assertTrue(method_exists(Config::class, 'all'));
    }

    /**
     * Test Logger facade
     */
    public function testLoggerFacade(): void
    {
        $this->assertTrue(class_exists(Logger::class));
        $this->assertTrue(method_exists(Logger::class, 'info'));
        $this->assertTrue(method_exists(Logger::class, 'warning'));
        $this->assertTrue(method_exists(Logger::class, 'error'));
        $this->assertTrue(method_exists(Logger::class, 'debug'));
    }

    /**
     * Test Layout facade
     */
    public function testLayoutFacade(): void
    {
        $this->assertTrue(class_exists(Layout::class));
        $this->assertTrue(method_exists(Layout::class, 'register'));
        $this->assertTrue(method_exists(Layout::class, 'get'));
        $this->assertTrue(method_exists(Layout::class, 'all'));
        $this->assertTrue(method_exists(Layout::class, 'has'));
    }

    /**
     * Test Application facade
     */
    public function testApplicationFacade(): void
    {
        $this->assertTrue(class_exists(Application::class));
        $this->assertTrue(method_exists(Application::class, 'make'));
        $this->assertTrue(method_exists(Application::class, 'bound'));
        $this->assertTrue(method_exists(Application::class, 'bind'));
        $this->assertTrue(method_exists(Application::class, 'singleton'));
        $this->assertTrue(method_exists(Application::class, 'getContainer'));
    }

    /**
     * Test User facade
     */
    public function testUserFacade(): void
    {
        $this->assertTrue(class_exists(User::class));
        $this->assertTrue(method_exists(User::class, 'get'));
        $this->assertTrue(method_exists(User::class, 'current'));
        $this->assertTrue(method_exists(User::class, 'exists'));
        $this->assertTrue(method_exists(User::class, 'getDisplayName'));
    }

    /**
     * Test DeferredService facade
     */
    public function testDeferredServiceFacade(): void
    {
        $this->assertTrue(class_exists(DeferredService::class));
        $this->assertTrue(method_exists(DeferredService::class, 'resolve'));
        $this->assertTrue(method_exists(DeferredService::class, 'has'));
        $this->assertTrue(method_exists(DeferredService::class, 'register'));
        $this->assertTrue(method_exists(DeferredService::class, 'getCurrentContext'));
    }

    /**
     * Test that direct access to KernelManager works
     */
    public function testDirectKernelAccess(): void
    {
        $this->assertTrue(class_exists(\Jankx\Kernel\KernelManager::class));
        $this->assertTrue(method_exists(\Jankx\Kernel\KernelManager::class, 'boot'));
        $this->assertTrue(method_exists(\Jankx\Kernel\KernelManager::class, 'getCurrentKernel'));
        $this->assertTrue(method_exists(\Jankx\Kernel\KernelManager::class, 'getAllKernels'));

        // Check that Jankx class has getFrameworkVersion
        $this->assertTrue(class_exists(\Jankx\Jankx::class));
        $this->assertTrue(method_exists(\Jankx\Jankx::class, 'getFrameworkVersion'));
    }

    /**
     * Test facade architecture compliance
     */
    public function testFacadeArchitectureCompliance(): void
    {
        $facades = [
            Config::class,
            Logger::class,
            Layout::class,
            Application::class,
            User::class,
            DeferredService::class,
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);

            // Test that facade has proper namespace
            $this->assertStringStartsWith(
                'Jankx\Facades',
                $reflection->getNamespaceName(),
                "Facade {$facade} should be in Jankx\Facades namespace"
            );

            // Test that facade extends base Facade
            $this->assertTrue(
                $reflection->isSubclassOf(\Jankx\Facades\Facade::class),
                "Facade {$facade} should extend base Facade"
            );
        }
    }
}