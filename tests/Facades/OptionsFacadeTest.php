<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Options;
use Brain\Monkey\Functions;

class OptionsFacadeTest extends TestCase
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

    public function testGetOption()
    {
        $optionName = 'test_option';
        $expectedValue = 'test_value';

        Functions\expect('get_option')
            ->once()
            ->with($optionName, null)
            ->andReturn($expectedValue);

        $result = Options::get($optionName);

        $this->assertEquals($expectedValue, $result);
    }

    public function testGetOptionWithDefault()
    {
        $optionName = 'test_option';
        $defaultValue = 'default_value';
        $expectedValue = 'test_value';

        Functions\expect('get_option')
            ->once()
            ->with($optionName, $defaultValue)
            ->andReturn($expectedValue);

        $result = Options::get($optionName, $defaultValue);

        $this->assertEquals($expectedValue, $result);
    }

    public function testSetOption()
    {
        $optionName = 'test_option';
        $optionValue = 'test_value';

        Functions\expect('update_option')
            ->once()
            ->with($optionName, $optionValue)
            ->andReturn(true);

        $result = Options::set($optionName, $optionValue);

        $this->assertTrue($result);
    }

    public function testDeleteOption()
    {
        $optionName = 'test_option';

        Functions\expect('delete_option')
            ->once()
            ->with($optionName)
            ->andReturn(true);

        $result = Options::delete($optionName);

        $this->assertTrue($result);
    }

    public function testHasOption()
    {
        $optionName = 'test_option';

        Functions\expect('get_option')
            ->once()
            ->with($optionName, null)
            ->andReturn('some_value');

        $result = Options::has($optionName);

        $this->assertTrue($result);
    }

    public function testHasOptionWithNonExistentOption()
    {
        $optionName = 'non_existent_option';

        Functions\expect('get_option')
            ->once()
            ->with($optionName, null)
            ->andReturn(null);

        $result = Options::has($optionName);

        $this->assertFalse($result);
    }

    public function testGetAllOptions()
    {
        $expectedOptions = [
            'option1' => 'value1',
            'option2' => 'value2',
        ];

        Functions\expect('wp_load_alloptions')
            ->once()
            ->andReturn($expectedOptions);

        $result = Options::all();

        $this->assertEquals($expectedOptions, $result);
    }

    public function testGetMultipleOptions()
    {
        $optionNames = ['option1', 'option2'];
        $expectedValues = [
            'option1' => 'value1',
            'option2' => 'value2',
        ];

        Functions\expect('get_options')
            ->once()
            ->with($optionNames)
            ->andReturn($expectedValues);

        $result = Options::getMultiple($optionNames);

        $this->assertEquals($expectedValues, $result);
    }

    public function testSetMultipleOptions()
    {
        $options = [
            'option1' => 'value1',
            'option2' => 'value2',
        ];

        Functions\expect('update_options')
            ->once()
            ->with($options)
            ->andReturn(true);

        $result = Options::setMultiple($options);

        $this->assertTrue($result);
    }

    public function testGetThemeMod()
    {
        $modName = 'test_mod';
        $expectedValue = 'test_value';

        Functions\expect('get_theme_mod')
            ->once()
            ->with($modName, null)
            ->andReturn($expectedValue);

        $result = Options::getThemeMod($modName);

        $this->assertEquals($expectedValue, $result);
    }

    public function testSetThemeMod()
    {
        $modName = 'test_mod';
        $modValue = 'test_value';

        Functions\expect('set_theme_mod')
            ->once()
            ->with($modName, $modValue)
            ->andReturn(true);

        $result = Options::setThemeMod($modName, $modValue);

        $this->assertTrue($result);
    }

    public function testRemoveThemeMod()
    {
        $modName = 'test_mod';

        Functions\expect('remove_theme_mod')
            ->once()
            ->with($modName)
            ->andReturn(true);

        $result = Options::removeThemeMod($modName);

        $this->assertTrue($result);
    }

    public function testGetCustomizerOption()
    {
        $optionName = 'test_customizer_option';
        $expectedValue = 'test_value';

        Functions\expect('get_theme_mod')
            ->once()
            ->with($optionName, null)
            ->andReturn($expectedValue);

        $result = Options::getCustomizer($optionName);

        $this->assertEquals($expectedValue, $result);
    }

    public function testSetCustomizerOption()
    {
        $optionName = 'test_customizer_option';
        $optionValue = 'test_value';

        Functions\expect('set_theme_mod')
            ->once()
            ->with($optionName, $optionValue)
            ->andReturn(true);

        $result = Options::setCustomizer($optionName, $optionValue);

        $this->assertTrue($result);
    }

    public function testGetTransient()
    {
        $transientName = 'test_transient';
        $expectedValue = 'test_value';

        Functions\expect('get_transient')
            ->once()
            ->with($transientName)
            ->andReturn($expectedValue);

        $result = Options::getTransient($transientName);

        $this->assertEquals($expectedValue, $result);
    }

    public function testSetTransient()
    {
        $transientName = 'test_transient';
        $transientValue = 'test_value';
        $expiration = 3600;

        Functions\expect('set_transient')
            ->once()
            ->with($transientName, $transientValue, $expiration)
            ->andReturn(true);

        $result = Options::setTransient($transientName, $transientValue, $expiration);

        $this->assertTrue($result);
    }

    public function testDeleteTransient()
    {
        $transientName = 'test_transient';

        Functions\expect('delete_transient')
            ->once()
            ->with($transientName)
            ->andReturn(true);

        $result = Options::deleteTransient($transientName);

        $this->assertTrue($result);
    }
} 