<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;

/**
 * Test all Service Providers
 *
 * @package Tests\Providers
 * @since 2.0.0
 */
class ServiceProvidersTest extends TestCase
{
    /**
     * Test all service providers exist
     */
    public function testAllServiceProvidersExist()
    {
        $providers = [
            'Jankx\Providers\ServiceProvider',
            'Jankx\Providers\CLIServiceProvider',
        ];

        foreach ($providers as $provider) {
            $this->assertTrue(class_exists($provider), "Service Provider {$provider} does not exist");
        }
    }

    /**
     * Test service providers extend base ServiceProvider
     */
    public function testServiceProvidersExtendBaseServiceProvider()
    {
        $providers = [
            'Jankx\Providers\CLIServiceProvider',
        ];

        foreach ($providers as $provider) {
            $reflection = new \ReflectionClass($provider);
            $this->assertTrue($reflection->isSubclassOf('Jankx\Providers\ServiceProvider'),
                "Service Provider {$provider} does not extend base ServiceProvider class");
        }
    }

    /**
     * Test service providers have required methods
     */
    public function testServiceProvidersHaveRequiredMethods()
    {
        $providers = [
            'Jankx\Providers\ServiceProvider',
            'Jankx\Providers\CLIServiceProvider',
        ];

        foreach ($providers as $provider) {
            $reflection = new \ReflectionClass($provider);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('register', $methodNames,
                "Service Provider {$provider} missing register method");
            $this->assertContains('boot', $methodNames,
                "Service Provider {$provider} missing boot method");
        }
    }

    /**
     * Test base service provider functionality
     */
    public function testBaseServiceProviderFunctionality()
    {
        $this->assertTrue(class_exists('Jankx\Providers\ServiceProvider'));
        $this->assertTrue(method_exists('Jankx\Providers\ServiceProvider', 'bind'));
        $this->assertTrue(method_exists('Jankx\Providers\ServiceProvider', 'singleton'));
    }

    /**
     * Test CLI service provider specific methods
     */
    public function testCLIServiceProviderSpecificMethods()
    {
        $this->assertTrue(class_exists('Jankx\Providers\CLIServiceProvider'));
        $this->assertTrue(method_exists('Jankx\Providers\CLIServiceProvider', 'shouldLoad'));
    }
}