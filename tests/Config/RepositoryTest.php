<?php

namespace Tests\Config;

use PHPUnit\Framework\TestCase;
use Jankx\Config\Repository;

class RepositoryTest extends TestCase
{
    private Repository $config;

    protected function setUp(): void
    {
        $this->config = new Repository();
    }

    public function testRepositoryCanBeInstantiated()
    {
        $this->assertInstanceOf(Repository::class, $this->config);
    }

    public function testRepositoryCanSetAndGetValues()
    {
        $this->config->set('app.name', 'Jankx');
        $this->assertEquals('Jankx', $this->config->get('app.name'));
    }

    public function testRepositoryCanGetNestedValues()
    {
        $this->config->set('app', [
            'name' => 'Jankx',
            'version' => '1.0.0'
        ]);

        $this->assertEquals('Jankx', $this->config->get('app.name'));
        $this->assertEquals('1.0.0', $this->config->get('app.version'));
    }

    public function testRepositoryReturnsDefaultValueWhenKeyNotFound()
    {
        $value = $this->config->get('nonexistent.key', 'default');
        $this->assertEquals('default', $value);
    }

    public function testRepositoryCanCheckIfKeyExists()
    {
        $this->config->set('app.name', 'Jankx');

        $this->assertTrue($this->config->has('app.name'));
        $this->assertFalse($this->config->has('app.nonexistent'));
    }



    public function testRepositoryCanGetWithDotNotation()
    {
        $this->config->set('app', [
            'name' => 'Jankx',
            'providers' => [
                'ConfigServiceProvider'
            ]
        ]);

        $this->assertEquals('Jankx', $this->config->get('app.name'));
        $this->assertEquals(['ConfigServiceProvider'], $this->config->get('app.providers'));
    }

    public function testRepositoryCanSetWithDotNotation()
    {
        $this->config->set('app.name', 'Jankx');
        $this->config->set('app.version', '1.0.0');

        $this->assertEquals('Jankx', $this->config->get('app.name'));
        $this->assertEquals('1.0.0', $this->config->get('app.version'));
    }

    public function testRepositoryCanPrependValues()
    {
        $this->config->set('app.providers', ['Provider1', 'Provider2']);
        $this->config->prepend('app.providers', 'Provider0');

        $providers = $this->config->get('app.providers');
        $this->assertEquals('Provider0', $providers[0]);
        $this->assertEquals('Provider1', $providers[1]);
    }

    public function testRepositoryCanPushValues()
    {
        $this->config->set('app.providers', ['Provider1', 'Provider2']);
        $this->config->push('app.providers', 'Provider3');

        $providers = $this->config->get('app.providers');
        $this->assertEquals('Provider3', $providers[2]);
    }

    public function testRepositoryCanUseArrayAccess()
    {
        $this->config['app.name'] = 'Jankx';

        $this->assertTrue(isset($this->config['app.name']));
        $this->assertEquals('Jankx', $this->config['app.name']);

        unset($this->config['app.name']);
        $this->assertFalse(isset($this->config['app.name']));
    }

    public function testRepositoryCanHandleNullKey()
    {
        $this->config->set('app.name', 'Jankx');
        $result = $this->config->get(null);
        $this->assertIsArray($result);
        $this->assertEquals('Jankx', $result['app']['name']);
    }

    public function testRepositoryCanHandleNonExistentKey()
    {
        $result = $this->config->get('non.existent.key', 'default');
        $this->assertEquals('default', $result);
    }

    public function testRepositoryCanHandleNonExistentKeyWithoutDefault()
    {
        $result = $this->config->get('non.existent.key');
        $this->assertNull($result);
    }

    public function testRepositoryCanHandleArrayKey()
    {
        $this->config->set(['app.name' => 'Jankx', 'app.version' => '1.0.0']);
        $this->assertEquals('Jankx', $this->config->get('app.name'));
        $this->assertEquals('1.0.0', $this->config->get('app.version'));
    }

    public function testRepositoryCanHandleNestedArrayCreation()
    {
        $this->config->set('app.database.host', 'localhost');
        $this->assertEquals('localhost', $this->config->get('app.database.host'));
    }

    public function testRepositoryCanHandleUnsetKey()
    {
        $this->config->set('app.name', 'Jankx');
        $this->assertTrue(isset($this->config['app.name']));

        unset($this->config['app.name']);
        $this->assertFalse(isset($this->config['app.name']));
        $this->assertNull($this->config->get('app.name'));
    }
}
