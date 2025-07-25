<?php

namespace Tests\Kernel;

use PHPUnit\Framework\TestCase;
use Jankx\Kernel\CLIKernel;

/**
 * Test CLIKernel
 *
 * @package Tests\Kernel
 * @since 2.0.0
 */
class CLIKernelTest extends TestCase
{
    /**
     * @var CLIKernel
     */
    private $kernel;

    protected function setUp(): void
    {
        $this->kernel = new CLIKernel();
    }

    /**
     * Test kernel exists and extends Kernel
     */
    public function testKernelExists()
    {
        $this->assertTrue(class_exists('Jankx\Kernel\CLIKernel'));
        $this->assertInstanceOf('Jankx\Kernel\Kernel', $this->kernel);
    }

    /**
     * Test kernel type
     */
    public function testKernelType()
    {
        $this->assertEquals('cli', $this->kernel->getKernelType());
    }

    /**
     * Test kernel has required methods
     */
    public function testKernelHasRequiredMethods()
    {
        $this->assertTrue(method_exists($this->kernel, 'getKernelType'));
        $this->assertTrue(method_exists($this->kernel, 'registerBootstrappers'));
        $this->assertTrue(method_exists($this->kernel, 'registerServices'));
        $this->assertTrue(method_exists($this->kernel, 'registerHooks'));
        $this->assertTrue(method_exists($this->kernel, 'registerFilters'));
    }

    /**
     * Test CLI initialization
     */
    public function testCLIInitialization()
    {
        $this->assertTrue(method_exists($this->kernel, 'initializeCLI'));
    }

    /**
     * Test WP-CLI command registration
     */
    public function testWPCLICommandRegistration()
    {
        $this->assertTrue(method_exists($this->kernel, 'registerWPCLICommands'));
    }

    /**
     * Test framework info display
     */
    public function testFrameworkInfoDisplay()
    {
        $this->assertTrue(method_exists($this->kernel, 'showFrameworkInfo'));
    }

    /**
     * Test version display
     */
    public function testVersionDisplay()
    {
        $this->assertTrue(method_exists($this->kernel, 'showVersion'));
    }

    /**
     * Test CLI output formatting
     */
    public function testCLIOutputFormatting()
    {
        $this->assertTrue(method_exists($this->kernel, 'formatCLIOutput'));
    }

    /**
     * Test environment info retrieval
     */
    public function testEnvironmentInfoRetrieval()
    {
        $this->assertTrue(method_exists($this->kernel, 'getEnvironmentInfo'));
    }
}