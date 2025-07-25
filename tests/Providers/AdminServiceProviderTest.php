<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;

/**
 * Test AdminServiceProvider
 *
 * @package Tests\Providers
 * @since 2.0.0
 */
class AdminServiceProviderTest extends TestCase
{
    /**
     * Test admin service provider exists
     */
    public function testAdminServiceProviderExists()
    {
        $this->assertTrue(class_exists('Jankx\Providers\AdminServiceProvider'));
    }

    /**
     * Test admin service provider extends base ServiceProvider
     */
    public function testAdminServiceProviderExtendsBaseServiceProvider()
    {
        $reflection = new \ReflectionClass('Jankx\Providers\AdminServiceProvider');
        $this->assertTrue($reflection->isSubclassOf('Jankx\Providers\ServiceProvider'));
    }

    /**
     * Test admin service provider has required methods
     */
    public function testAdminServiceProviderHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Providers\AdminServiceProvider', 'register'));
        $this->assertTrue(method_exists('Jankx\Providers\AdminServiceProvider', 'boot'));
    }
}