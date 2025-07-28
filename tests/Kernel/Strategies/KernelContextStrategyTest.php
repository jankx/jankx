<?php

namespace Tests\Kernel\Strategies;

use Jankx\Kernel\Strategies\KernelContextStrategy;
use Tests\TestCase;

/**
 * KernelContextStrategy Test
 *
 * @package Tests\Kernel\Strategies
 * @since 2.0.0
 */
class KernelContextStrategyTest extends TestCase
{
    public function testKernelContextStrategyIsAbstract()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);
        $this->assertTrue($reflection->isAbstract());
    }

    public function testKernelContextStrategyHasAbstractMethods()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);
        $methods = $reflection->getMethods(\ReflectionMethod::IS_ABSTRACT);

        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('canHandle', $methodNames);
        $this->assertContains('getContext', $methodNames);
    }

    public function testKernelContextStrategyHasConcreteMethods()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);
        $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

        $methodNames = array_map(function($method) {
            return $method->getName();
        }, $methods);

        $this->assertContains('getPriority', $methodNames);
    }

    public function testMockStrategyCanHandle()
    {
        $strategy = new MockKernelContextStrategy(true);
        $this->assertTrue($strategy->canHandle());
    }

    public function testMockStrategyCannotHandle()
    {
        $strategy = new MockKernelContextStrategy(false);
        $this->assertFalse($strategy->canHandle());
    }

    public function testMockStrategyGetContext()
    {
        $context = 'test-context';
        $strategy = new MockKernelContextStrategy(true, $context);
        $this->assertEquals($context, $strategy->getContext());
    }

    public function testMockStrategyGetPriority()
    {
        $priority = 50;
        $strategy = new MockKernelContextStrategy(true, 'test', $priority);
        $this->assertEquals($priority, $strategy->getPriority());
    }

    public function testMockStrategyDefaultPriority()
    {
        $strategy = new MockKernelContextStrategy();
        $this->assertEquals(100, $strategy->getPriority());
    }

    public function testKernelContextStrategyInheritance()
    {
        $strategy = new MockKernelContextStrategy();

        $this->assertInstanceOf(KernelContextStrategy::class, $strategy);
        $this->assertTrue($strategy instanceof KernelContextStrategy);
    }

    public function testKernelContextStrategyMethodSignatures()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);

        // Test canHandle method signature
        $canHandleMethod = $reflection->getMethod('canHandle');
        $this->assertTrue($canHandleMethod->isAbstract());
        $this->assertTrue($canHandleMethod->isPublic());
        $this->assertEquals('bool', $canHandleMethod->getReturnType()->getName());
        $this->assertEquals(0, $canHandleMethod->getNumberOfParameters());

        // Test getContext method signature
        $getContextMethod = $reflection->getMethod('getContext');
        $this->assertTrue($getContextMethod->isAbstract());
        $this->assertTrue($getContextMethod->isPublic());
        $this->assertEquals('string', $getContextMethod->getReturnType()->getName());
        $this->assertEquals(0, $getContextMethod->getNumberOfParameters());

        // Test getPriority method signature
        $getPriorityMethod = $reflection->getMethod('getPriority');
        $this->assertFalse($getPriorityMethod->isAbstract());
        $this->assertTrue($getPriorityMethod->isPublic());
        $this->assertEquals('int', $getPriorityMethod->getReturnType()->getName());
        $this->assertEquals(0, $getPriorityMethod->getNumberOfParameters());
    }

    public function testKernelContextStrategyNamespace()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);
        $this->assertEquals('Jankx\Kernel\Strategies', $reflection->getNamespaceName());
    }

    public function testKernelContextStrategyPackageAnnotation()
    {
        $reflection = new \ReflectionClass(KernelContextStrategy::class);
        $docComment = $reflection->getDocComment();

        $this->assertStringContainsString('@package Jankx\Kernel\Strategies', $docComment);
    }
}