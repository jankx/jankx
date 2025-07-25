<?php

namespace Tests\Kernel;

use PHPUnit\Framework\TestCase;

/**
 * Test all Kernels
 *
 * @package Tests\Kernel
 * @since 2.0.0
 */
class AllKernelsTest extends TestCase
{
    /**
     * Test all kernels exist
     */
    public function testAllKernelsExist()
    {
        $kernels = [
            'Jankx\Kernel\Kernel',
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
            $this->assertTrue(class_exists($kernel), "Kernel {$kernel} does not exist");
        }
    }

    /**
     * Test all kernels implement KernelInterface
     */
    public function testAllKernelsImplementKernelInterface()
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
            $this->assertTrue($reflection->implementsInterface('Jankx\Contracts\KernelInterface'),
                "Kernel {$kernel} does not implement KernelInterface");
        }
    }

    /**
     * Test all kernels extend base Kernel
     */
    public function testAllKernelsExtendBaseKernel()
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
                "Kernel {$kernel} does not extend base Kernel");
        }
    }

    /**
     * Test all kernels have required methods
     */
    public function testAllKernelsHaveRequiredMethods()
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
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('bootstrap', $methodNames,
                "Kernel {$kernel} missing bootstrap method");
            $this->assertContains('shouldRun', $methodNames,
                "Kernel {$kernel} missing shouldRun method");
        }
    }
}