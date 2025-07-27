<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\GutenbergBlocksService;
use Brain\Monkey\Functions;
use Brain\Monkey\Actions;

class GutenbergBlocksServiceTest extends TestCase
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

    public function testRegisterBlock()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';
        $blockConfig = [
            'title' => 'Test Block',
            'description' => 'A test block',
            'category' => 'common',
            'icon' => 'admin-generic',
        ];

        Functions\expect('register_block_type')
            ->once()
            ->with($blockName, $blockConfig);

        $result = $service->registerBlock($blockName, $blockConfig);

        $this->assertTrue($result);
    }

    public function testRegisterBlockWithInvalidConfig()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';
        $blockConfig = []; // Empty config

        $result = $service->registerBlock($blockName, $blockConfig);

        $this->assertFalse($result);
    }

    public function testUnregisterBlock()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';

        Functions\expect('unregister_block_type')
            ->once()
            ->with($blockName);

        $result = $service->unregisterBlock($blockName);

        $this->assertTrue($result);
    }

    public function testGetRegisteredBlocks()
    {
        $service = new GutenbergBlocksService();
        $expectedBlocks = [
            'jankx/test-block' => ['title' => 'Test Block'],
            'jankx/another-block' => ['title' => 'Another Block'],
        ];

        // Mock the internal blocks property
        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('registeredBlocks');
        $property->setAccessible(true);
        $property->setValue($service, $expectedBlocks);

        $result = $service->getRegisteredBlocks();

        $this->assertEquals($expectedBlocks, $result);
    }

    public function testIsBlockRegistered()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';

        // Mock the internal blocks property
        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('registeredBlocks');
        $property->setAccessible(true);
        $property->setValue($service, [$blockName => []]);

        $result = $service->isBlockRegistered($blockName);

        $this->assertTrue($result);
    }

    public function testIsBlockRegisteredWithNonExistentBlock()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/non-existent-block';

        $result = $service->isBlockRegistered($blockName);

        $this->assertFalse($result);
    }

    public function testGetBlockConfig()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';
        $expectedConfig = [
            'title' => 'Test Block',
            'description' => 'A test block',
        ];

        // Mock the internal blocks property
        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('registeredBlocks');
        $property->setAccessible(true);
        $property->setValue($service, [$blockName => $expectedConfig]);

        $result = $service->getBlockConfig($blockName);

        $this->assertEquals($expectedConfig, $result);
    }

    public function testGetBlockConfigWithNonExistentBlock()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/non-existent-block';

        $result = $service->getBlockConfig($blockName);

        $this->assertNull($result);
    }

    public function testUpdateBlockConfig()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/test-block';
        $originalConfig = ['title' => 'Original Title'];
        $newConfig = ['title' => 'Updated Title'];

        // Mock the internal blocks property
        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('registeredBlocks');
        $property->setAccessible(true);
        $property->setValue($service, [$blockName => $originalConfig]);

        $result = $service->updateBlockConfig($blockName, $newConfig);

        $this->assertTrue($result);
        
        $updatedConfig = $service->getBlockConfig($blockName);
        $this->assertEquals($newConfig, $updatedConfig);
    }

    public function testUpdateBlockConfigWithNonExistentBlock()
    {
        $service = new GutenbergBlocksService();
        $blockName = 'jankx/non-existent-block';
        $newConfig = ['title' => 'Updated Title'];

        $result = $service->updateBlockConfig($blockName, $newConfig);

        $this->assertFalse($result);
    }

    public function testRegisterBlockCategory()
    {
        $service = new GutenbergBlocksService();
        $categorySlug = 'jankx-blocks';
        $categoryConfig = [
            'slug' => $categorySlug,
            'title' => 'Jankx Blocks',
            'icon' => 'admin-generic',
        ];

        Functions\expect('register_block_category')
            ->once()
            ->with($categorySlug, $categoryConfig);

        $result = $service->registerBlockCategory($categorySlug, $categoryConfig);

        $this->assertTrue($result);
    }

    public function testGetBlockCategories()
    {
        $service = new GutenbergBlocksService();
        $expectedCategories = [
            ['slug' => 'common', 'title' => 'Common'],
            ['slug' => 'jankx-blocks', 'title' => 'Jankx Blocks'],
        ];

        Functions\expect('get_block_categories')
            ->once()
            ->andReturn($expectedCategories);

        $result = $service->getBlockCategories();

        $this->assertEquals($expectedCategories, $result);
    }

    public function testValidateBlockName()
    {
        $service = new GutenbergBlocksService();

        $this->assertTrue($service->validateBlockName('jankx/test-block'));
        $this->assertTrue($service->validateBlockName('core/paragraph'));
        $this->assertFalse($service->validateBlockName('invalid-block-name'));
        $this->assertFalse($service->validateBlockName(''));
    }

    public function testValidateBlockConfig()
    {
        $service = new GutenbergBlocksService();

        $validConfig = [
            'title' => 'Test Block',
            'category' => 'common',
        ];

        $invalidConfig = [
            'title' => '', // Empty title
        ];

        $this->assertTrue($service->validateBlockConfig($validConfig));
        $this->assertFalse($service->validateBlockConfig($invalidConfig));
    }
} 