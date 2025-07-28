<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;

/**
 * Test all Facades
 *
 * @package Tests\Facades
 * @since 2.0.0
 */
class FacadesTest extends TestCase
{
    /**
     * Test all facades exist
     */
    public function testAllFacadesExist()
    {
        $facades = [
            'Jankx\Facades\Options',
            'Jankx\Facades\Logger',
            'Jankx\Facades\Layout',
            'Jankx\Facades\Kernel',
            'Jankx\Facades\Facade',
            'Jankx\Facades\DeferredService'
        ];

        foreach ($facades as $facade) {
            $this->assertTrue(class_exists($facade), "Facade {$facade} does not exist");
        }
    }

    /**
     * Test facades extend base Facade
     */
    public function testFacadesExtendBaseFacade()
    {
        $facades = [
            'Jankx\Facades\Options',
            'Jankx\Facades\Logger',
            'Jankx\Facades\Layout',
            'Jankx\Facades\Kernel',
            'Jankx\Facades\DeferredService'
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $this->assertTrue($reflection->isSubclassOf('Jankx\Facades\Facade'),
                "Facade {$facade} does not extend base Facade class");
        }
    }

    /**
     * Test facades have required methods
     */
    public function testFacadesHaveRequiredMethods()
    {
        $facades = [
            'Jankx\Facades\Logger',
            'Jankx\Facades\Layout',
            'Jankx\Facades\Kernel',
            'Jankx\Facades\DeferredService'
        ];

        foreach ($facades as $facade) {
            $reflection = new \ReflectionClass($facade);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC | \ReflectionMethod::IS_PROTECTED);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('getFacadeAccessor', $methodNames,
                "Facade {$facade} missing getFacadeAccessor method");
        }
    }

    /**
     * Test base facade functionality
     */
    public function testBaseFacadeFunctionality()
    {
        $this->assertTrue(class_exists('Jankx\Facades\Facade'));
        $this->assertTrue(method_exists('Jankx\Facades\Facade', 'setContainer'));
        $this->assertTrue(method_exists('Jankx\Facades\Facade', 'getContainer'));
        $this->assertTrue(method_exists('Jankx\Facades\Facade', '__callStatic'));
    }
}