<?php

namespace Tests\Bootstrappers;

use PHPUnit\Framework\TestCase;

/**
 * Test all Bootstrappers
 *
 * @package Tests\Bootstrappers
 * @since 2.0.0
 */
class AllBootstrappersTest extends TestCase
{
    /**
     * Test all bootstrappers exist
     */
    public function testAllBootstrappersExist()
    {
        $bootstrappers = [
            'Jankx\Bootstrappers\CLI\CLIBootstrapper',
            'Jankx\Bootstrappers\Dashboard\AdminBootstrapper',
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
            'Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper',
            'Jankx\Bootstrappers\API\APIBootstrapper',
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\ThemeBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper'
        ];

        foreach ($bootstrappers as $bootstrapper) {
            $this->assertTrue(class_exists($bootstrapper), "Bootstrapper {$bootstrapper} does not exist");
        }
    }

    /**
     * Test all bootstrappers extend AbstractBootstrapper
     */
    public function testAllBootstrappersExtendAbstractBootstrapper()
    {
        $bootstrappers = [
            'Jankx\Bootstrappers\CLI\CLIBootstrapper',
            'Jankx\Bootstrappers\Dashboard\AdminBootstrapper',
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
            'Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper',
            'Jankx\Bootstrappers\API\APIBootstrapper',
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\ThemeBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper'
        ];

        foreach ($bootstrappers as $bootstrapper) {
            $reflection = new \ReflectionClass($bootstrapper);
            $this->assertTrue($reflection->isSubclassOf('Jankx\Bootstrappers\AbstractBootstrapper'),
                "Bootstrapper {$bootstrapper} does not extend AbstractBootstrapper");
        }
    }

    /**
     * Test all bootstrappers implement BootstrapperInterface
     */
    public function testAllBootstrappersImplementBootstrapperInterface()
    {
        $bootstrappers = [
            'Jankx\Bootstrappers\CLI\CLIBootstrapper',
            'Jankx\Bootstrappers\Dashboard\AdminBootstrapper',
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
            'Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper',
            'Jankx\Bootstrappers\API\APIBootstrapper',
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\ThemeBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper'
        ];

        foreach ($bootstrappers as $bootstrapper) {
            $reflection = new \ReflectionClass($bootstrapper);
            $this->assertTrue($reflection->implementsInterface('Jankx\Contracts\BootstrapperInterface'),
                "Bootstrapper {$bootstrapper} does not implement BootstrapperInterface");
        }
    }

    /**
     * Test all bootstrappers have required methods
     */
    public function testAllBootstrappersHaveRequiredMethods()
    {
        $bootstrappers = [
            'Jankx\Bootstrappers\CLI\CLIBootstrapper',
            'Jankx\Bootstrappers\Dashboard\AdminBootstrapper',
            'Jankx\Bootstrappers\Frontend\FrontendBootstrapper',
            'Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper',
            'Jankx\Bootstrappers\API\APIBootstrapper',
            'Jankx\Bootstrappers\Global\CoreBootstrapper',
            'Jankx\Bootstrappers\Global\ThemeBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper',
            'Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper'
        ];

        foreach ($bootstrappers as $bootstrapper) {
            $reflection = new \ReflectionClass($bootstrapper);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);

            $methodNames = array_map(function($method) {
                return $method->getName();
            }, $methods);

            $this->assertContains('getName', $methodNames,
                "Bootstrapper {$bootstrapper} missing getName method");
            $this->assertContains('shouldRun', $methodNames,
                "Bootstrapper {$bootstrapper} missing shouldRun method");
            $this->assertContains('bootstrap', $methodNames,
                "Bootstrapper {$bootstrapper} missing bootstrap method");
        }
    }
}