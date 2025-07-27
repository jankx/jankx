<?php

namespace Tests\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Helpers\DeferredServiceHelper;
use Jankx\Context\ContextualServiceRegistry;
use Brain\Monkey\Functions;

class DeferredServiceHelperTest extends TestCase
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

    public function testRegisterAdminDeferredServices()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('admin.dashboard.service', 'admin');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('admin.menu.service', 'admin');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('admin.assets.service', 'admin');

        DeferredServiceHelper::registerAdminDeferredServices();

        $this->assertTrue(true);
    }

    public function testRegisterFrontendDeferredServices()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('frontend.assets.service', 'frontend');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('frontend.template.service', 'frontend');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('frontend.layout.service', 'frontend');

        DeferredServiceHelper::registerFrontendDeferredServices();

        $this->assertTrue(true);
    }

    public function testRegisterGutenbergDeferredServices()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('gutenberg.blocks.service', 'gutenberg');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('gutenberg.editor.service', 'gutenberg');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('gutenberg.assets.service', 'gutenberg');

        DeferredServiceHelper::registerGutenbergDeferredServices();

        $this->assertTrue(true);
    }

    public function testRegisterWooCommerceDeferredServices()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('woocommerce.integration.service', 'woocommerce');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('woocommerce.template.service', 'woocommerce');

        Functions\expect('ContextualServiceRegistry::defer')
            ->once()
            ->with('woocommerce.assets.service', 'woocommerce');

        DeferredServiceHelper::registerWooCommerceDeferredServices();

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesForContextWithAdmin()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        DeferredServiceHelper::registerDeferredServicesForContext('admin');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesForContextWithFrontend()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        DeferredServiceHelper::registerDeferredServicesForContext('frontend');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesForContextWithGutenberg()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        DeferredServiceHelper::registerDeferredServicesForContext('gutenberg');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesForContextWithWooCommerce()
    {
        Functions\expect('ContextualServiceRegistry::defer')
            ->times(3)
            ->withAnyArgs();

        DeferredServiceHelper::registerDeferredServicesForContext('woocommerce');

        $this->assertTrue(true);
    }

    public function testRegisterDeferredServicesForContextWithUnknownContext()
    {
        // Should not call ContextualServiceRegistry::defer for unknown context
        Functions\expect('ContextualServiceRegistry::defer')
            ->never();

        DeferredServiceHelper::registerDeferredServicesForContext('unknown');

        $this->assertTrue(true);
    }
} 