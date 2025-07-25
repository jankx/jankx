<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;

/**
 * Test FrontendServiceProvider
 *
 * @package Tests\Providers
 * @since 2.0.0
 */
class FrontendServiceProviderTest extends TestCase
{
    /**
     * Test frontend service provider exists
     */
    public function testFrontendServiceProviderExists()
    {
        $this->assertTrue(class_exists('Jankx\Providers\FrontendServiceProvider'));
    }

    /**
     * Test frontend service provider extends base ServiceProvider
     */
    public function testFrontendServiceProviderExtendsBaseServiceProvider()
    {
        $reflection = new \ReflectionClass('Jankx\Providers\FrontendServiceProvider');
        $this->assertTrue($reflection->isSubclassOf('Jankx\Providers\ServiceProvider'));
    }

    /**
     * Test frontend service provider has required methods
     */
    public function testFrontendServiceProviderHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Providers\FrontendServiceProvider', 'register'));
        $this->assertTrue(method_exists('Jankx\Providers\FrontendServiceProvider', 'boot'));
    }
}