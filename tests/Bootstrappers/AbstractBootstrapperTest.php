<?php

namespace Tests\Bootstrappers;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Illuminate\Container\Container;

/**
 * Test AbstractBootstrapper
 *
 * @package Tests\Bootstrappers
 * @since 2.0.0
 */
class AbstractBootstrapperTest extends TestCase
{
    /**
     * Test abstract bootstrapper exists
     */
    public function testAbstractBootstrapperExists()
    {
        $this->assertTrue(class_exists('Jankx\Bootstrappers\AbstractBootstrapper'));
    }

    /**
     * Test abstract bootstrapper is abstract
     */
    public function testAbstractBootstrapperIsAbstract()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');
        $this->assertTrue($reflection->isAbstract());
    }

    /**
     * Test abstract bootstrapper implements BootstrapperInterface
     */
    public function testAbstractBootstrapperImplementsInterface()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');
        $this->assertTrue($reflection->implementsInterface('Jankx\Contracts\BootstrapperInterface'));
    }

    /**
     * Test abstract bootstrapper has required methods
     */
    public function testAbstractBootstrapperHasRequiredMethods()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        $this->assertTrue($reflection->hasMethod('getPriority'));
        $this->assertTrue($reflection->hasMethod('getDependencies'));
        $this->assertTrue($reflection->hasMethod('getName'));
        $this->assertTrue($reflection->hasMethod('shouldRun'));
        $this->assertTrue($reflection->hasMethod('bootstrap'));
    }

    /**
     * Test abstract bootstrapper has abstract methods
     */
    public function testAbstractBootstrapperHasAbstractMethods()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        $getNameMethod = $reflection->getMethod('getName');
        $this->assertTrue($getNameMethod->isAbstract());

        $shouldRunMethod = $reflection->getMethod('shouldRun');
        $this->assertTrue($shouldRunMethod->isAbstract());

        $bootstrapMethod = $reflection->getMethod('bootstrap');
        $this->assertTrue($bootstrapMethod->isAbstract());
    }

    /**
     * Test abstract bootstrapper has concrete methods
     */
    public function testAbstractBootstrapperHasConcreteMethods()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        $getPriorityMethod = $reflection->getMethod('getPriority');
        $this->assertFalse($getPriorityMethod->isAbstract());

        $getDependenciesMethod = $reflection->getMethod('getDependencies');
        $this->assertFalse($getDependenciesMethod->isAbstract());
    }

    /**
     * Test abstract bootstrapper has protected properties
     */
    public function testAbstractBootstrapperHasProtectedProperties()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        $this->assertTrue($reflection->hasProperty('priority'));
        $this->assertTrue($reflection->hasProperty('dependencies'));

        $priorityProperty = $reflection->getProperty('priority');
        $this->assertTrue($priorityProperty->isProtected());

        $dependenciesProperty = $reflection->getProperty('dependencies');
        $this->assertTrue($dependenciesProperty->isProtected());
    }

    /**
     * Test abstract bootstrapper default values
     */
    public function testAbstractBootstrapperDefaultValues()
    {
        // Create a concrete test class to test default values
        $testClass = new class extends AbstractBootstrapper {
            public function getName(): string
            {
                return 'test';
            }

            public function shouldRun(): bool
            {
                return true;
            }

            public function bootstrap(Container $container): void
            {
                // Test implementation
            }
        };

        $this->assertEquals(10, $testClass->getPriority());
        $this->assertEquals([], $testClass->getDependencies());
    }

    /**
     * Test abstract bootstrapper is in correct namespace
     */
    public function testAbstractBootstrapperNamespace()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');
        $this->assertEquals('Jankx\Bootstrappers', $reflection->getNamespaceName());
    }

    /**
     * Test abstract bootstrapper class name
     */
    public function testAbstractBootstrapperClassName()
    {
        $this->assertEquals('AbstractBootstrapper', (new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper'))->getShortName());
    }

    /**
     * Test abstract bootstrapper has proper documentation
     */
    public function testAbstractBootstrapperHasDocumentation()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        // Check class documentation
        $docComment = $reflection->getDocComment();
        $this->assertStringContainsString('@package', $docComment);

        // Check property documentation for @var annotations
        $priorityProperty = $reflection->getProperty('priority');
        $priorityDoc = $priorityProperty->getDocComment();
        $this->assertStringContainsString('@var', $priorityDoc);

        $dependenciesProperty = $reflection->getProperty('dependencies');
        $dependenciesDoc = $dependenciesProperty->getDocComment();
        $this->assertStringContainsString('@var', $dependenciesDoc);
    }

    /**
     * Test abstract bootstrapper method signatures
     */
    public function testAbstractBootstrapperMethodSignatures()
    {
        $reflection = new \ReflectionClass('Jankx\Bootstrappers\AbstractBootstrapper');

        // Test getPriority method signature
        $getPriorityMethod = $reflection->getMethod('getPriority');
        $this->assertEquals('int', $getPriorityMethod->getReturnType()->getName());

        // Test getDependencies method signature
        $getDependenciesMethod = $reflection->getMethod('getDependencies');
        $this->assertEquals('array', $getDependenciesMethod->getReturnType()->getName());

        // Test getName method signature
        $getNameMethod = $reflection->getMethod('getName');
        $this->assertEquals('string', $getNameMethod->getReturnType()->getName());

        // Test shouldRun method signature
        $shouldRunMethod = $reflection->getMethod('shouldRun');
        $this->assertEquals('bool', $shouldRunMethod->getReturnType()->getName());

        // Test bootstrap method signature
        $bootstrapMethod = $reflection->getMethod('bootstrap');
        $this->assertEquals('void', $bootstrapMethod->getReturnType()->getName());
        $this->assertEquals('Illuminate\Container\Container', $bootstrapMethod->getParameters()[0]->getType()->getName());
    }
}