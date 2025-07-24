<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use Jankx\Jankx;

/**
 * Test class for Jankx main class
 */
class JankxTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Reset instance before each test
        $reflection = new \ReflectionClass(Jankx::class);
        $instanceProperty = $reflection->getProperty('instance');
        $instanceProperty->setAccessible(true);
        $instanceProperty->setValue(null, null);
    }

    public function testGetFrameworkName()
    {
        $this->assertEquals('Jankx', Jankx::getFrameworkName());
    }

    public function testGetFrameworkVersion()
    {
        $this->assertEquals('2.0.0', Jankx::getFrameworkVersion());
    }

    public function testGetInstanceReturnsSingleton()
    {
        $instance1 = Jankx::getInstance();
        $instance2 = Jankx::getInstance();

        $this->assertSame($instance1, $instance2);
        $this->assertInstanceOf(Jankx::class, $instance1);
    }

    public function testInstanceIsContainer()
    {
        $instance = Jankx::getInstance();
        $this->assertInstanceOf(\Illuminate\Container\Container::class, $instance);
    }

    public function testConstantsAreDefined()
    {
        $this->assertEquals('Jankx', Jankx::FRAMEWORK_NAME);
        $this->assertEquals('2.0.0', Jankx::FRAMEWORK_VERSION);
    }
}