<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Kernel;
use Brain\Monkey\Functions;

class KernelFacadeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testGetInstance()
    {
        $mockInstance = new \stdClass();

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn($mockInstance);

        $result = Kernel::getInstance();

        $this->assertSame($mockInstance, $result);
    }

    public function testGetContainer()
    {
        $mockContainer = new \stdClass();

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => $mockContainer]);

        $result = Kernel::getContainer();

        $this->assertSame($mockContainer, $result);
    }

    public function testResolve()
    {
        $serviceName = 'test.service';
        $expectedResult = 'test-result';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => (object)[
                'make' => function ($name) use ($serviceName, $expectedResult) {
                    if ($name === $serviceName) {
                        return $expectedResult;
                    }
                    return null;
                }
            ]]);

        $result = Kernel::resolve($serviceName);

        $this->assertEquals($expectedResult, $result);
    }

    public function testHas()
    {
        $serviceName = 'test.service';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => (object)[
                'bound' => function ($name) use ($serviceName) {
                    return $name === $serviceName;
                }
            ]]);

        $result = Kernel::has($serviceName);

        $this->assertTrue($result);
    }

    public function testHasWithNonExistentService()
    {
        $serviceName = 'non-existent.service';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => (object)[
                'bound' => function ($name) use ($serviceName) {
                    return $name === $serviceName;
                }
            ]]);

        $result = Kernel::has($serviceName);

        $this->assertFalse($result);
    }

    public function testBind()
    {
        $serviceName = 'test.service';
        $serviceClass = 'TestService';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => (object)[
                'bind' => function ($name, $class) use ($serviceName, $serviceClass) {
                    return $name === $serviceName && $class === $serviceClass;
                }
            ]]);

        $result = Kernel::bind($serviceName, $serviceClass);

        $this->assertTrue($result);
    }

    public function testSingleton()
    {
        $serviceName = 'test.service';
        $serviceClass = 'TestService';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['container' => (object)[
                'singleton' => function ($name, $class) use ($serviceName, $serviceClass) {
                    return $name === $serviceName && $class === $serviceClass;
                }
            ]]);

        $result = Kernel::singleton($serviceName, $serviceClass);

        $this->assertTrue($result);
    }

    public function testIsBooted()
    {
        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['booted' => true]);

        $result = Kernel::isBooted();

        $this->assertTrue($result);
    }

    public function testIsBootedWhenNotBooted()
    {
        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['booted' => false]);

        $result = Kernel::isBooted();

        $this->assertFalse($result);
    }

    public function testGetVersion()
    {
        $expectedVersion = '2.0.0';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['version' => $expectedVersion]);

        $result = Kernel::getVersion();

        $this->assertEquals($expectedVersion, $result);
    }

    public function testGetPath()
    {
        $expectedPath = '/path/to/jankx';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['path' => $expectedPath]);

        $result = Kernel::getPath();

        $this->assertEquals($expectedPath, $result);
    }

    public function testGetUrl()
    {
        $expectedUrl = 'https://example.com/jankx';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['url' => $expectedUrl]);

        $result = Kernel::getUrl();

        $this->assertEquals($expectedUrl, $result);
    }

    public function testGetEnvironment()
    {
        $expectedEnvironment = 'production';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['environment' => $expectedEnvironment]);

        $result = Kernel::getEnvironment();

        $this->assertEquals($expectedEnvironment, $result);
    }

    public function testIsDevelopment()
    {
        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['environment' => 'development']);

        $result = Kernel::isDevelopment();

        $this->assertTrue($result);
    }

    public function testIsProduction()
    {
        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['environment' => 'production']);

        $result = Kernel::isProduction();

        $this->assertTrue($result);
    }

    public function testGetConfig()
    {
        $configKey = 'app.name';
        $expectedValue = 'Jankx';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['config' => (object)[
                'get' => function ($key) use ($configKey, $expectedValue) {
                    return $key === $configKey ? $expectedValue : null;
                }
            ]]);

        $result = Kernel::getConfig($configKey);

        $this->assertEquals($expectedValue, $result);
    }

    public function testSetConfig()
    {
        $configKey = 'app.name';
        $configValue = 'New App Name';

        Functions\expect('Jankx\Jankx::getInstance')
            ->once()
            ->andReturn((object)['config' => (object)[
                'set' => function ($key, $value) use ($configKey, $configValue) {
                    return $key === $configKey && $value === $configValue;
                }
            ]]);

        $result = Kernel::setConfig($configKey, $configValue);

        $this->assertTrue($result);
    }
} 