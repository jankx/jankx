<?php

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\BootstrapperHelper;
use Illuminate\Container\Container;
use Brain\Monkey\Functions;
use Brain\Monkey\Actions;

class BootstrapperHelperTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testFireLoadedAction()
    {
        $container = new Container();
        $bootstrapperName = 'test-bootstrapper';

        Actions\expectDone('jankx/bootstrapper/' . $bootstrapperName . '/loaded')
            ->once()
            ->with($container);

        BootstrapperHelper::fireLoadedAction($bootstrapperName, $container);

        $this->assertTrue(true);
    }

    public function testSetupDeferredResolver()
    {
        $container = new Container();

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(false);

        Functions\expect('is_admin')
            ->once()
            ->andReturn(true);

        $container->singleton('deferred.resolver', function () {
            return new \stdClass();
        });

        BootstrapperHelper::setupDeferredResolver($container);

        $this->assertTrue($container->bound('deferred.resolver'));
    }

    public function testRegisterContextProvider()
    {
        $container = new Container();

        $container->singleton('context.provider', function () {
            return new \stdClass();
        });

        BootstrapperHelper::registerContextProvider($container);

        $this->assertTrue($container->bound('context.provider'));
    }

    public function testGetGlobalContainer()
    {
        $mockContainer = new Container();

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => $mockContainer]);

        $result = BootstrapperHelper::getGlobalContainer();

        $this->assertSame($mockContainer, $result);
    }

    public function testIsContainerReady()
    {
        $container = new Container();
        $this->assertTrue(BootstrapperHelper::isContainerReady($container));

        $this->assertFalse(BootstrapperHelper::isContainerReady(null));
        $this->assertFalse(BootstrapperHelper::isContainerReady('not-a-container'));
    }

    public function testGetDeferredResolver()
    {
        $container = new Container();
        $mockResolver = new \stdClass();

        $container->singleton('deferred.resolver', function () use ($mockResolver) {
            return $mockResolver;
        });

        $result = BootstrapperHelper::getDeferredResolver($container);

        $this->assertSame($mockResolver, $result);
    }

    public function testGetDeferredResolverReturnsNullWhenNotBound()
    {
        $container = new Container();

        $result = BootstrapperHelper::getDeferredResolver($container);

        $this->assertNull($result);
    }
} 