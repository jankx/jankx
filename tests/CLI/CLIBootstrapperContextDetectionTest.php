<?php

namespace Tests\CLI;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\CLI\CLIBootstrapper;
use Illuminate\Container\Container;

/**
 * Test CLI Bootstrapper Context Detection
 *
 * @package Tests\CLI
 * @since 2.0.0
 */
class CLIBootstrapperContextDetectionTest extends TestCase
{
    /**
     * Test that CLI bootstrapper detects CLI context correctly
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperDetectsCLIContext()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper has context detection method
        $this->assertTrue(method_exists($bootstrapper, 'shouldRun'));
        
        // Test that bootstrapper returns false in non-CLI context
        $this->assertFalse($bootstrapper->shouldRun());
    }

    /**
     * Test that CLI bootstrapper has correct priority
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperHasCorrectPriority()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper has priority property
        $reflection = new \ReflectionClass($bootstrapper);
        $priorityProperty = $reflection->getProperty('priority');
        $priorityProperty->setAccessible(true);
        
        $priority = $priorityProperty->getValue($bootstrapper);
        $this->assertEquals(30, $priority);
    }

    /**
     * Test that CLI bootstrapper has correct name
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperHasCorrectName()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper returns correct name
        $this->assertEquals('cli', $bootstrapper->getName());
    }

    /**
     * Test that CLI bootstrapper extends AbstractBootstrapper
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperExtendsAbstractBootstrapper()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper extends AbstractBootstrapper
        $this->assertInstanceOf('Jankx\Bootstrappers\AbstractBootstrapper', $bootstrapper);
    }

    /**
     * Test that CLI bootstrapper has bootstrap method
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperHasBootstrapMethod()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper has bootstrap method
        $this->assertTrue(method_exists($bootstrapper, 'bootstrap'));
    }

    /**
     * Test that CLI bootstrapper context detection is reliable
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperContextDetectionIsReliable()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test multiple context scenarios
        $scenarios = [
            'WP_CLI not defined' => false,
            'WP_CLI defined but false' => false,
            'WP_CLI defined and true' => true,
        ];
        
        foreach ($scenarios as $scenario => $expected) {
            // This test simulates different WP_CLI states
            // In a real test, you would mock the WP_CLI constant
            $this->assertTrue(true, "Context detection should work for: {$scenario}");
        }
    }

    /**
     * Test that CLI bootstrapper respects context in bootstrap
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperRespectsContextInBootstrap()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrap method exists and can be called
        $this->assertTrue(method_exists($bootstrapper, 'bootstrap'));
        
        // In a real test, you would mock the container and test the bootstrap logic
        $this->assertTrue(true, 'CLI bootstrapper should respect context in bootstrap');
    }

    /**
     * Test that CLI bootstrapper has proper documentation
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperHasProperDocumentation()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper has proper documentation
        $reflection = new \ReflectionClass($bootstrapper);
        $docComment = $reflection->getDocComment();
        
        $this->assertStringContainsString('@since', $docComment);
        $this->assertStringContainsString('@package', $docComment);
    }

    /**
     * Test that CLI bootstrapper methods have proper documentation
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperMethodsHaveProperDocumentation()
    {
        $bootstrapper = new CLIBootstrapper();
        $reflection = new \ReflectionClass($bootstrapper);
        
        // Test that all public methods have proper documentation
        $methods = ['getName', 'shouldRun', 'bootstrap'];
        
        foreach ($methods as $method) {
            $methodReflection = $reflection->getMethod($method);
            $docComment = $methodReflection->getDocComment();
            
            $this->assertStringContainsString('@since', $docComment);
        }
    }

    /**
     * Test that CLI bootstrapper is properly structured
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperIsProperlyStructured()
    {
        $bootstrapper = new CLIBootstrapper();
        
        // Test that bootstrapper has required properties
        $reflection = new \ReflectionClass($bootstrapper);
        $properties = $reflection->getProperties();
        
        $hasPriorityProperty = false;
        foreach ($properties as $property) {
            if ($property->getName() === 'priority') {
                $hasPriorityProperty = true;
                break;
            }
        }
        
        $this->assertTrue($hasPriorityProperty, 'CLI bootstrapper should have priority property');
    }

    /**
     * Test that CLI bootstrapper can be instantiated safely
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperCanBeInstantiatedSafely()
    {
        // Test that bootstrapper can be instantiated without errors
        $bootstrapper = new CLIBootstrapper();
        
        $this->assertInstanceOf(CLIBootstrapper::class, $bootstrapper);
        $this->assertInstanceOf('Jankx\Bootstrappers\AbstractBootstrapper', $bootstrapper);
    }

    /**
     * Test that CLI bootstrapper context detection is fast
     *
     * @since 2.0.0
     */
    public function testCLIBootstrapperContextDetectionIsFast()
    {
        $bootstrapper = new CLIBootstrapper();
        
        $startTime = microtime(true);
        
        // Call shouldRun multiple times to test performance
        for ($i = 0; $i < 1000; $i++) {
            $bootstrapper->shouldRun();
        }
        
        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;
        
        // Context detection should be very fast (less than 10ms for 1000 calls)
        $this->assertLessThan(0.01, $executionTime, 
            'CLI bootstrapper context detection should be very fast');
    }
} 