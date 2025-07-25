<?php

namespace Tests\Contracts;

use PHPUnit\Framework\TestCase;

/**
 * Test all Interfaces
 *
 * @package Tests\Contracts
 * @since 2.0.0
 */
class InterfacesTest extends TestCase
{
    /**
     * Test all interfaces exist
     */
    public function testAllInterfacesExist()
    {
        $interfaces = [
            'Jankx\Contracts\KernelInterface',
            'Jankx\Contracts\BootstrapperInterface',
            'Jankx\Contracts\ContextInterface',
            'Jankx\Contracts\ServiceRegistryInterface'
        ];

        foreach ($interfaces as $interface) {
            $this->assertTrue(interface_exists($interface), "Interface {$interface} does not exist");
        }
    }

    /**
     * Test interfaces have required methods
     */
    public function testInterfacesHaveRequiredMethods()
    {
        // Test KernelInterface
        $reflection = new \ReflectionClass('Jankx\Contracts\KernelInterface');
        $methods = $reflection->getMethods();
        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('getKernelType', $methodNames);
        $this->assertContains('boot', $methodNames);

        // Test BootstrapperInterface
        $reflection = new \ReflectionClass('Jankx\Contracts\BootstrapperInterface');
        $methods = $reflection->getMethods();
        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('getName', $methodNames);
        $this->assertContains('shouldRun', $methodNames);
        $this->assertContains('bootstrap', $methodNames);

        // Test ContextInterface
        $reflection = new \ReflectionClass('Jankx\Contracts\ContextInterface');
        $methods = $reflection->getMethods();
        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('getContext', $methodNames);

        // Test ServiceRegistryInterface
        $reflection = new \ReflectionClass('Jankx\Contracts\ServiceRegistryInterface');
        $methods = $reflection->getMethods();
        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('register', $methodNames);
        $this->assertContains('resolve', $methodNames);
    }

    /**
     * Test interface inheritance
     */
    public function testInterfaceInheritance()
    {
        // Test that classes implement their interfaces
        $this->assertTrue(class_exists('Jankx\Kernel\Kernel'));
        $this->assertTrue(class_exists('Jankx\Bootstrappers\AbstractBootstrapper'));
        $this->assertTrue(class_exists('Jankx\Context\ContextualServiceRegistry'));

        $kernelReflection = new \ReflectionClass('Jankx\Kernel\Kernel');
        $this->assertTrue($kernelReflection->implementsInterface('Jankx\Contracts\KernelInterface'));

        $bootstrapperReflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');
        $this->assertTrue($bootstrapperReflection->implementsInterface('Jankx\Contracts\BootstrapperInterface'));

        $contextReflection = new \ReflectionClass('Jankx\Context\ContextualServiceRegistry');
        $this->assertTrue($contextReflection->implementsInterface('Jankx\Contracts\ServiceRegistryInterface'));
    }
}