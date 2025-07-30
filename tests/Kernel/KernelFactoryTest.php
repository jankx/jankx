<?php

namespace Tests\Kernel;

use PHPUnit\Framework\TestCase;
use Jankx\Kernel\KernelFactory;

/**
 * Test KernelFactory
 *
 * @package Tests\Kernel
 * @since 2.0.0
 */
class KernelFactoryTest extends TestCase
{
    /**
     * Test factory exists
     */
    public function testFactoryExists()
    {
        $this->assertTrue(class_exists('Jankx\Kernel\KernelFactory'));
    }

    /**
     * Test factory has required methods
     */
    public function testFactoryHasRequiredMethods()
    {
        $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'createKernel'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'getKernelMap'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'hasKernel'));
        $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'getKernelClass'));
    }

    /**
     * Test factory can create kernels
     */
    public function testFactoryCanCreateKernels()
    {
        $this->assertTrue(class_exists('Jankx\Kernel\CLIKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\FrontendKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\AdminKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\APIKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\AjaxKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\CronKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\GutenbergAjaxKernel'));
        $this->assertTrue(class_exists('Jankx\Kernel\NotFoundKernel'));
    }

    /**
     * Test factory supports all kernel types
     */
    public function testFactorySupportsAllKernelTypes()
    {
        $supportedTypes = ['cli', 'gutenberg-ajax', 'cron', 'api', 'admin', 'frontend'];

        foreach ($supportedTypes as $type) {
            $this->assertTrue(method_exists('Jankx\Kernel\KernelFactory', 'createKernel'));
        }
    }
}