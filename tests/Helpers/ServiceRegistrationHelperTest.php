<?php

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\ServiceRegistrationHelper;
use Illuminate\Container\Container;
use Jankx\Services\UserService;
use Jankx\Services\BlockParserService;
use Jankx\Services\DeferredServiceMonitor;
use Jankx\Services\DeferredServiceResolver;
use Jankx\Services\GutenbergBlocksService;

class ServiceRegistrationHelperTest extends TestCase
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

    public function testRegisterServices()
    {
        $container = new Container();
        $services = [
            'test.service' => UserService::class,
            'another.service' => BlockParserService::class,
        ];

        ServiceRegistrationHelper::registerServices($container, $services);

        $this->assertTrue($container->bound('test.service'));
        $this->assertTrue($container->bound('another.service'));
    }

    public function testRegisterDeferredServices()
    {
        $container = new Container();
        $services = [
            'deferred.service' => UserService::class,
        ];

        ServiceRegistrationHelper::registerDeferredServices($container, $services);

        $this->assertTrue($container->bound('deferred.service'));
    }

    public function testRegisterCoreServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerCoreServices($container);

        $this->assertTrue($container->bound('user.service'));
        $this->assertTrue($container->bound('block.parser.service'));
        $this->assertTrue($container->bound('deferred.service.monitor'));
        $this->assertTrue($container->bound('deferred.service.resolver'));
    }

    public function testRegisterAdminServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerAdminServices($container);

        $this->assertTrue($container->bound('admin.dashboard.service'));
        $this->assertTrue($container->bound('admin.menu.service'));
        $this->assertTrue($container->bound('admin.assets.service'));
    }

    public function testRegisterFrontendServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerFrontendServices($container);

        $this->assertTrue($container->bound('frontend.assets.service'));
        $this->assertTrue($container->bound('frontend.template.service'));
        $this->assertTrue($container->bound('frontend.layout.service'));
    }

    public function testRegisterGutenbergServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerGutenbergServices($container);

        $this->assertTrue($container->bound('gutenberg.blocks.service'));
        $this->assertTrue($container->bound('gutenberg.editor.service'));
        $this->assertTrue($container->bound('gutenberg.assets.service'));
    }

    public function testRegisterAPIServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerAPIServices($container);

        $this->assertTrue($container->bound('api.rest.service'));
        $this->assertTrue($container->bound('api.ajax.service'));
        $this->assertTrue($container->bound('api.endpoints.service'));
    }

    public function testRegisterWooCommerceServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerWooCommerceServices($container);

        $this->assertTrue($container->bound('woocommerce.integration.service'));
        $this->assertTrue($container->bound('woocommerce.template.service'));
        $this->assertTrue($container->bound('woocommerce.assets.service'));
    }

    public function testRegisterDebugServices()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerDebugServices($container);

        $this->assertTrue($container->bound('debug.logger.service'));
        $this->assertTrue($container->bound('debug.performance.service'));
        $this->assertTrue($container->bound('debug.monitor.service'));
    }

    public function testServiceResolution()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerCoreServices($container);

        $userService = $container->make('user.service');
        $this->assertInstanceOf(UserService::class, $userService);

        $blockParserService = $container->make('block.parser.service');
        $this->assertInstanceOf(BlockParserService::class, $blockParserService);
    }

    public function testDeferredServiceResolution()
    {
        $container = new Container();

        ServiceRegistrationHelper::registerDeferredServices($container, [
            'deferred.user.service' => UserService::class,
        ]);

        $deferredService = $container->make('deferred.user.service');
        $this->assertInstanceOf(UserService::class, $deferredService);
    }
} 