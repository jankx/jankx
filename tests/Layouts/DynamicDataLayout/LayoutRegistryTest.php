<?php

namespace Tests\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\LayoutRegistry;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\GridLayout;
use Jankx\Layouts\DynamicDataLayout\BlockLayouts\ListLayout;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;

class LayoutRegistryTest extends TestCase
{
    protected $app;
    protected $registry;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();
        $this->registry = new LayoutRegistry($this->app);
    }

    public function testConstructorSetsApplication()
    {
        $reflection = new \ReflectionClass($this->registry);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);

        $this->assertSame($this->app, $appProperty->getValue($this->registry));
    }

    public function testCanRegisterLayout()
    {
        $this->registry->register('grid', GridLayout::class);

        $this->assertTrue($this->registry->has('grid'));
        $this->assertEquals(GridLayout::class, $this->registry->get('grid'));
    }

    public function testCanUnregisterLayout()
    {
        $this->registry->register('grid', GridLayout::class);
        $this->assertTrue($this->registry->has('grid'));

        $this->registry->unregister('grid');

        $this->assertFalse($this->registry->has('grid'));
        $this->assertNull($this->registry->get('grid'));
    }

    public function testHasReturnsFalseForNonExistentLayout()
    {
        $this->assertFalse($this->registry->has('nonexistent'));
    }

    public function testGetReturnsNullForNonExistentLayout()
    {
        $this->assertNull($this->registry->get('nonexistent'));
    }

    public function testRegisterThrowsExceptionForNonExistentClass()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Layout class "NonExistentClass" does not exist');

        $this->registry->register('invalid', 'NonExistentClass');
    }

    public function testRegisterThrowsExceptionForClassNotImplementingInterface()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('must implement');

        $this->registry->register('invalid', \stdClass::class);
    }

    public function testCanResolveLayout()
    {
        $this->registry->register('grid', GridLayout::class);

        $layout = $this->registry->resolve('grid');

        $this->assertInstanceOf(GridLayout::class, $layout);
        $this->assertInstanceOf(\Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface::class, $layout);
    }

    public function testResolveThrowsExceptionForNonExistentLayout()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Layout "nonexistent" is not registered');

        $this->registry->resolve('nonexistent');
    }

    public function testResolveSetsOptions()
    {
        $this->registry->register('grid', GridLayout::class);

        $options = ['columns' => 4, 'gap' => 20];
        $layout = $this->registry->resolve('grid', $options);

        $this->assertInstanceOf(GridLayout::class, $layout);
    }

    public function testAllReturnsAllRegisteredLayouts()
    {
        $this->registry->register('grid', GridLayout::class);
        $this->registry->register('list', ListLayout::class);

        $all = $this->registry->all();

        $this->assertCount(2, $all);
        $this->assertArrayHasKey('grid', $all);
        $this->assertArrayHasKey('list', $all);
        $this->assertEquals(GridLayout::class, $all['grid']);
        $this->assertEquals(ListLayout::class, $all['list']);
    }

    public function testAllReturnsEmptyArrayWhenNoLayouts()
    {
        $this->assertEquals([], $this->registry->all());
    }

    public function testGetNamesReturnsAllLayoutNames()
    {
        $this->registry->register('grid', GridLayout::class);
        $this->registry->register('list', ListLayout::class);

        $names = $this->registry->getNames();

        $this->assertCount(2, $names);
        $this->assertContains('grid', $names);
        $this->assertContains('list', $names);
    }

    public function testCanReregisterLayout()
    {
        $this->registry->register('grid', GridLayout::class);
        $this->registry->register('grid', ListLayout::class);

        $this->assertEquals(ListLayout::class, $this->registry->get('grid'));
    }

    public function testUnregisterNonExistentLayoutDoesNotThrowError()
    {
        // Should not throw any exception
        $this->registry->unregister('nonexistent');

        $this->assertTrue(true); // Just verifying no exception is thrown
    }
}
