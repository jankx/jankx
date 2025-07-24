<?php

namespace Tests;

use PHPUnit\Framework\TestCase;

/**
 * Test class for Jankx main class (bypass version)
 */
class JankxTestBypass extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Define ABSPATH for testing
        if (!defined('ABSPATH')) {
            define('ABSPATH', __DIR__ . '/../');
        }
    }

    public function testFrameworkConstants()
    {
        $this->assertEquals('Jankx', \Jankx\Jankx::FRAMEWORK_NAME);
        $this->assertEquals('2.0.0', \Jankx\Jankx::FRAMEWORK_VERSION);
    }

    public function testGetFrameworkName()
    {
        $this->assertEquals('Jankx', \Jankx\Jankx::getFrameworkName());
    }

    public function testGetFrameworkVersion()
    {
        $this->assertEquals('2.0.0', \Jankx\Jankx::getFrameworkVersion());
    }

    public function testGetInstanceReturnsSingleton()
    {
        $instance1 = \Jankx\Jankx::getInstance();
        $instance2 = \Jankx\Jankx::getInstance();

        $this->assertSame($instance1, $instance2);
        $this->assertInstanceOf(\Jankx\Jankx::class, $instance1);
    }

    public function testInstanceIsContainer()
    {
        $instance = \Jankx\Jankx::getInstance();
        $this->assertInstanceOf(\Illuminate\Container\Container::class, $instance);
    }
}