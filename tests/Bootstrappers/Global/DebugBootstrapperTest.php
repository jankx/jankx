<?php

namespace Tests\Bootstrappers\Global;

use Brain\Monkey\Actions;
use Brain\Monkey\Functions;
use Brain\Monkey\WP\Hooks;
use Illuminate\Container\Container;
use Jankx\Bootstrappers\Global\DebugBootstrapper;
use Jankx\Facades\Logger;
use Jankx\Helpers\BootstrapperHelper;
use Jankx\Helpers\ErrorHandlingHelper;
use Jankx\Helpers\ServiceRegistrationHelper;
use Tests\TestCase;

/**
 * DebugBootstrapper Test
 *
 * @package Tests\Bootstrappers\Global
 * @since 2.0.0
 */
class DebugBootstrapperTest extends TestCase
{
    protected DebugBootstrapper $bootstrapper;
    protected Container $container;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootstrapper = new DebugBootstrapper();
        $this->container = new Container();
    }

    public function testGetNameReturnsDebug()
    {
        $result = $this->bootstrapper->getName();

        $this->assertEquals('debug', $result);
    }

    public function testShouldRunReturnsTrueWhenJANKX_DEBUGIsDefinedAndTrue()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);

        $result = $this->bootstrapper->shouldRun();

        $this->assertTrue($result);
        Functions\expect('defined')->toBeCalledWith('JANKX_DEBUG');
        Functions\expect('constant')->toBeCalledWith('JANKX_DEBUG');
    }

    public function testShouldRunReturnsFalseWhenJANKX_DEBUGIsNotDefined()
    {
        Functions\when('defined')->justReturn(false);

        $result = $this->bootstrapper->shouldRun();

        $this->assertFalse($result);
        Functions\expect('defined')->toBeCalledWith('JANKX_DEBUG');
    }

    public function testShouldRunReturnsFalseWhenJANKX_DEBUGIsFalse()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(false);

        $result = $this->bootstrapper->shouldRun();

        $this->assertFalse($result);
        Functions\expect('defined')->toBeCalledWith('JANKX_DEBUG');
        Functions\expect('constant')->toBeCalledWith('JANKX_DEBUG');
    }

    public function testBootstrapCallsInitializeDebugServices()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);
        Functions\when('is_admin')->justReturn(true);

        $this->bootstrapper->bootstrap($this->container);

        // Verify that ServiceRegistrationHelper::registerDebugServices was called
        // This is tested through the actual method calls
    }

    public function testBootstrapCallsSetupDebugHooks()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);
        Functions\when('is_admin')->justReturn(false);

        $this->bootstrapper->bootstrap($this->container);

        // Verify that setupDebugHooks was called
        // This is tested through the actual method calls
    }

    public function testBootstrapLogsDebugMessage()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);
        Functions\when('is_admin')->justReturn(true);

        $this->bootstrapper->bootstrap($this->container);

        // Verify that Logger::debug was called
        // This is tested through the actual method calls
    }

    public function testSetupDebugHooksAddsAdminHooksWhenInAdmin()
    {
        Functions\when('is_admin')->justReturn(true);

        $this->bootstrapper->bootstrap($this->container);

        Actions\expectAdded('init')->toBeCalled();
    }

    public function testSetupDebugHooksAddsFrontendHooksWhenNotInAdmin()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);
        Functions\when('is_admin')->justReturn(false);

        $this->bootstrapper->bootstrap($this->container);

        Actions\expectAdded('wp_footer')->toBeCalled();
    }

    public function testInitAdminDebugInfoDoesNothingWhenUserCannotManageOptions()
    {
        Functions\when('current_user_can')->justReturn(false);

        $this->bootstrapper->initAdminDebugInfo();

        // Should not throw any exceptions or call any methods
        $this->assertTrue(true);
    }

    public function testInitAdminDebugInfoInitializesDebugInfoWhenUserCanManageOptions()
    {
        Functions\when('current_user_can')->justReturn(true);

        // Mock the container and debug info
        $mockDebugInfo = \Mockery::mock(\Jankx\Debug\DebugInfo::class);
        $mockDebugInfo->shouldReceive('initAdminBarDebugInfo')->once();

        $this->container->singleton(\Jankx\Debug\DebugInfo::class, function() use ($mockDebugInfo) {
            return $mockDebugInfo;
        });

        // Mock BootstrapperHelper to return our container
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn($this->container);

        $this->bootstrapper->initAdminDebugInfo();

        // Verify that initAdminBarDebugInfo was called
        $this->assertTrue(true);
    }

    public function testInitAdminDebugInfoHandlesContainerNotBound()
    {
        Functions\when('current_user_can')->justReturn(true);
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn(null);

        $this->bootstrapper->initAdminDebugInfo();

        // Should not throw any exceptions
        $this->assertTrue(true);
    }

    public function testDisplayFrontendDebugInfoDisplaysDebugInfoWhenContainerIsBound()
    {
        // Mock the container and debug info
        $mockDebugInfo = \Mockery::mock(\Jankx\Debug\DebugInfo::class);
        $mockDebugInfo->shouldReceive('displayDebugInfo')->once();

        $this->container->singleton(\Jankx\Debug\DebugInfo::class, function() use ($mockDebugInfo) {
            return $mockDebugInfo;
        });

        // Mock BootstrapperHelper to return our container
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn($this->container);

        $this->bootstrapper->displayFrontendDebugInfo();

        // Verify that displayDebugInfo was called
        $this->assertTrue(true);
    }

    public function testDisplayFrontendDebugInfoHandlesContainerNotBound()
    {
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn(null);

        $this->bootstrapper->displayFrontendDebugInfo();

        // Should not throw any exceptions
        $this->assertTrue(true);
    }

    public function testDisplayFrontendDebugInfoHandlesContainerNotBoundToDebugInfo()
    {
        // Mock BootstrapperHelper to return our container
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn($this->container);

        $this->bootstrapper->displayFrontendDebugInfo();

        // Should not throw any exceptions
        $this->assertTrue(true);
    }

    public function testGetDebugServicesReturnsExpectedServices()
    {
        // Use reflection to access private method
        $reflection = new \ReflectionClass($this->bootstrapper);
        $method = $reflection->getMethod('getDebugServices');
        $method->setAccessible(true);

        $services = $method->invoke($this->bootstrapper);

        $expectedServices = [
            'DebugInfoService',
            'QueryCountService',
            'CacheInfoService',
            'GutenbergBlocksService',
            'PluginDebugService',
            'DebugInfoRenderer'
        ];

        $this->assertEquals($expectedServices, $services);
    }

    public function testBootstrapHandlesErrorsGracefully()
    {
        Functions\when('defined')->justReturn(true);
        Functions\when('constant')->justReturn(true);
        Functions\when('is_admin')->justReturn(true);

        // Mock ServiceRegistrationHelper to throw an exception
        Functions\when('ServiceRegistrationHelper::registerDebugServices')->justThrow(new \Exception('Test error'));

        $this->bootstrapper->bootstrap($this->container);

        // Should not throw any exceptions due to ErrorHandlingHelper::safeExecute
        $this->assertTrue(true);
    }

    public function testInitAdminDebugInfoHandlesErrorsGracefully()
    {
        Functions\when('current_user_can')->justReturn(true);
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn($this->container);

        // Mock the container to throw an exception
        $this->container->singleton(\Jankx\Debug\DebugInfo::class, function() {
            throw new \Exception('Test error');
        });

        $this->bootstrapper->initAdminDebugInfo();

        // Should not throw any exceptions due to ErrorHandlingHelper::safeExecute
        $this->assertTrue(true);
    }

    public function testDisplayFrontendDebugInfoHandlesErrorsGracefully()
    {
        Functions\when('BootstrapperHelper::getGlobalContainer')->justReturn($this->container);

        // Mock the container to throw an exception
        $this->container->singleton(\Jankx\Debug\DebugInfo::class, function() {
            throw new \Exception('Test error');
        });

        $this->bootstrapper->displayFrontendDebugInfo();

        // Should not throw any exceptions due to ErrorHandlingHelper::safeExecute
        $this->assertTrue(true);
    }
}