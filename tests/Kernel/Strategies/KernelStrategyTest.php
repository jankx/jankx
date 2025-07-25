<?php

namespace Tests\Kernel\Strategies;

use PHPUnit\Framework\TestCase;

/**
 * Test Kernel Strategies
 *
 * @package Tests\Kernel\Strategies
 * @since 2.0.0
 */
class KernelStrategyTest extends TestCase
{
    /**
     * Test all kernel strategies exist
     */
    public function testAllKernelStrategiesExist()
    {
        $strategies = [
            'Jankx\Kernel\Strategies\CLIKernelStrategy',
            'Jankx\Kernel\Strategies\FrontendKernelStrategy',
            'Jankx\Kernel\Strategies\AdminKernelStrategy',
            'Jankx\Kernel\Strategies\APIKernelStrategy',
            'Jankx\Kernel\Strategies\AjaxKernelStrategy',
            'Jankx\Kernel\Strategies\CronKernelStrategy',
            'Jankx\Kernel\Strategies\GutenbergAjaxKernelStrategy',
            'Jankx\Kernel\Strategies\KernelContextStrategy'
        ];

        foreach ($strategies as $strategy) {
            $this->assertTrue(class_exists($strategy), "Strategy {$strategy} does not exist");
        }
    }

    /**
     * Test strategies have required methods
     */
    public function testStrategiesHaveRequiredMethods()
    {
        $strategies = [
            'Jankx\Kernel\Strategies\CLIKernelStrategy',
            'Jankx\Kernel\Strategies\FrontendKernelStrategy',
            'Jankx\Kernel\Strategies\AdminKernelStrategy',
            'Jankx\Kernel\Strategies\APIKernelStrategy',
            'Jankx\Kernel\Strategies\AjaxKernelStrategy',
            'Jankx\Kernel\Strategies\CronKernelStrategy',
            'Jankx\Kernel\Strategies\GutenbergAjaxKernelStrategy',
            'Jankx\Kernel\Strategies\KernelContextStrategy'
        ];

        foreach ($strategies as $strategy) {
            $reflection = new \ReflectionClass($strategy);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('shouldRun', $methodNames, "Strategy {$strategy} missing shouldRun method");
            $this->assertContains('getKernelClass', $methodNames, "Strategy {$strategy} missing getKernelClass method");
        }
    }

    /**
     * Test strategies implement interface
     */
    public function testStrategiesImplementInterface()
    {
        $this->assertTrue(interface_exists('Jankx\Kernel\Strategies\KernelStrategyInterface'));
    }
}