<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Providers\ContextualServiceProvider;
use Illuminate\Container\Container;
use Brain\Monkey\Functions;

class ContextualServiceProviderTest extends TestCase
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

    public function testRegister()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerCoreServices')
            ->once()
            ->with($container);

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with('admin');

        $provider->register($container);

        $this->assertTrue(true);
    }

    public function testRegisterCoreServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerCoreServices')
            ->once()
            ->with($container);

        $provider->registerCoreServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterAdminServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerAdminServices')
            ->once()
            ->with($container);

        $provider->registerAdminServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterFrontendServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerFrontendServices')
            ->once()
            ->with($container);

        $provider->registerFrontendServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterAPIServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerAPIServices')
            ->once()
            ->with($container);

        $provider->registerAPIServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterGutenbergServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerGutenbergServices')
            ->once()
            ->with($container);

        $provider->registerGutenbergServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterWooCommerceServices()
    {
        $provider = new ContextualServiceProvider();
        $container = new Container();

        Functions\expect('Jankx\Helpers\ServiceRegistrationHelper::registerWooCommerceServices')
            ->once()
            ->with($container);

        $provider->registerWooCommerceServices($container);

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServices()
    {
        $provider = new ContextualServiceProvider();
        $context = 'admin';

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with($context);

        $provider->registerDeferredServices($context);

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesWithAdminContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with('admin');

        $provider->registerDeferredServices('admin');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesWithFrontendContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with('frontend');

        $provider->registerDeferredServices('frontend');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesWithGutenbergContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with('gutenberg');

        $provider->registerDeferredServices('gutenberg');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesWithWooCommerceContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->once()
            ->with('woocommerce');

        $provider->registerDeferredServices('woocommerce');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesWithUnknownContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('Jankx\Helpers\DeferredServiceHelper::registerDeferredServicesForContext')
            ->never();

        $provider->registerDeferredServices('unknown');

        $this->assertTrue(true);
    }

    public function testGetContext()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('is_admin')
            ->once()
            ->andReturn(true);

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(false);

        Functions\expect('defined')
            ->with('WP_CLI')
            ->andReturn(false);

        Functions\expect('defined')
            ->with('REST_REQUEST')
            ->andReturn(false);

        $result = $provider->getContext();

        $this->assertEquals('admin', $result);
    }

    public function testGetContextWithFrontend()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('is_admin')
            ->once()
            ->andReturn(false);

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(false);

        Functions\expect('defined')
            ->with('WP_CLI')
            ->andReturn(false);

        Functions\expect('defined')
            ->with('REST_REQUEST')
            ->andReturn(false);

        $result = $provider->getContext();

        $this->assertEquals('frontend', $result);
    }

    public function testGetContextWithCLI()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('is_admin')
            ->once()
            ->andReturn(false);

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(false);

        Functions\expect('defined')
            ->with('WP_CLI')
            ->andReturn(true);

        $result = $provider->getContext();

        $this->assertEquals('cli', $result);
    }

    public function testGetContextWithAPI()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('is_admin')
            ->once()
            ->andReturn(false);

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(false);

        Functions\expect('defined')
            ->with('WP_CLI')
            ->andReturn(false);

        Functions\expect('defined')
            ->with('REST_REQUEST')
            ->andReturn(true);

        $result = $provider->getContext();

        $this->assertEquals('api', $result);
    }

    public function testGetContextWithAJAX()
    {
        $provider = new ContextualServiceProvider();

        Functions\expect('is_admin')
            ->once()
            ->andReturn(false);

        Functions\expect('wp_doing_ajax')
            ->once()
            ->andReturn(true);

        $result = $provider->getContext();

        $this->assertEquals('ajax', $result);
    }

    public function testIsValidContext()
    {
        $provider = new ContextualServiceProvider();

        $this->assertTrue($provider->isValidContext('admin'));
        $this->assertTrue($provider->isValidContext('frontend'));
        $this->assertTrue($provider->isValidContext('cli'));
        $this->assertTrue($provider->isValidContext('api'));
        $this->assertTrue($provider->isValidContext('ajax'));
        $this->assertTrue($provider->isValidContext('gutenberg'));
        $this->assertTrue($provider->isValidContext('woocommerce'));
        $this->assertFalse($provider->isValidContext('invalid'));
    }
}