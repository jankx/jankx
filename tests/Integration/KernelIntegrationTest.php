<?php

namespace Tests\Integration;

use PHPUnit\Framework\TestCase;
use Jankx\Kernel\KernelFactory;
use Jankx\Kernel\KernelManager;

/**
 * Integration Test for Kernel System
 *
 * @package Tests\Integration
 * @since 2.0.0
 */
class KernelIntegrationTest extends TestCase
{
    /**
     * Test kernel factory integration
     */
    public function testKernelFactoryIntegration()
    {
        $this->assertTrue(class_exists('Jankx\Kernel\KernelFactory'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'create'));
    }

    /**
     * Test kernel manager integration
     */
    public function testKernelManagerIntegration()
    {
        $this->assertTrue(class_exists('Jankx\Kernel\KernelManager'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelManager', 'getKernel'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelManager', 'registerKernel'));
    }

    /**
     * Test kernel strategies integration
     */
    public function testKernelStrategiesIntegration()
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
     * Test kernel types integration
     */
    public function testKernelTypesIntegration()
    {
        $kernelTypes = [
            'cli' => 'Jankx\Kernel\CLIKernel',
            'frontend' => 'Jankx\Kernel\FrontendKernel',
            'admin' => 'Jankx\Kernel\AdminKernel',
            'api' => 'Jankx\Kernel\APIKernel',
            'ajax' => 'Jankx\Kernel\AjaxKernel',
            'cron' => 'Jankx\Kernel\CronKernel',
            'gutenberg-ajax' => 'Jankx\Kernel\GutenbergAjaxKernel',
            'not-found' => 'Jankx\Kernel\NotFoundKernel'
        ];

        foreach ($kernelTypes as $type => $class) {
            $this->assertTrue(class_exists($class), "Kernel class {$class} does not exist");
        }
    }

    /**
     * Test kernel inheritance
     */
    public function testKernelInheritance()
    {
        $kernels = [
            'Jankx\Kernel\CLIKernel',
            'Jankx\Kernel\FrontendKernel',
            'Jankx\Kernel\AdminKernel',
            'Jankx\Kernel\APIKernel',
            'Jankx\Kernel\AjaxKernel',
            'Jankx\Kernel\CronKernel',
            'Jankx\Kernel\GutenbergAjaxKernel',
            'Jankx\Kernel\NotFoundKernel'
        ];

        foreach ($kernels as $kernel) {
            $reflection = new \ReflectionClass($kernel);
            $this->assertTrue($reflection->isSubclassOf('Jankx\Kernel\Kernel'),
                "Kernel {$kernel} does not extend base Kernel class");
        }
    }
}