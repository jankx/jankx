<?php

namespace Tests\Support\Blocks;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Blocks\GutenbergRepository;
use Jankx\Support\Blocks\WidgetRendererBlock;
use Jankx\Support\Blocks\Patterns\GutenbergPattern;
use Jankx\Foundation\Application;

class GutenbergRepositoryTest extends TestCase
{
    protected $repository;
    protected $mockApp;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new GutenbergRepository();

        // Create mock Application with Plates Engine
        $this->mockApp = $this->createMock(Application::class);
        $mockPlatesEngine = $this->createMock(\League\Plates\Engine::class);

        $this->mockApp->method('make')
            ->willReturnCallback(function ($key) use ($mockPlatesEngine) {
                if ($key === 'plates.engine') {
                    return $mockPlatesEngine;
                }
                return null;
            });

        // Create test pattern class
        if (!class_exists('TestPatternClass')) {
            eval('
                class TestPatternClass extends \Jankx\Support\Blocks\Patterns\GutenbergPattern {
                    public function getPatternSlug(): string {
                        return "test-pattern";
                    }

                    public function getPatternData(): array {
                        return ["categories" => ["test"]];
                    }

                    public function getTemplateData(): array {
                        return ["title" => "Test Pattern"];
                    }

                    public function getTemplatePath(): string {
                        return "patterns/test-pattern.php";
                    }
                }
            ');
        }
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(GutenbergRepository::class, $this->repository);
    }

    // ========================================
    // BLOCK TESTS
    // ========================================

    public function testRegisterBlock()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $blocks = $this->repository->getBlocks();
        $this->assertArrayHasKey('jankx/widget-renderer', $blocks);
        $this->assertEquals(WidgetRendererBlock::class, $blocks['jankx/widget-renderer']);
    }

    public function testRegisterBlockWithInvalidClass()
    {
        $this->repository->registerBlock('NonExistentClass');

        $blocks = $this->repository->getBlocks();
        $this->assertEmpty($blocks);
    }

    public function testRegisterBlockWithNonBlockClass()
    {
        $this->repository->registerBlock(\stdClass::class);

        $blocks = $this->repository->getBlocks();
        $this->assertEmpty($blocks);
    }

    public function testRegisterBlockDuplicate()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $blocks = $this->repository->getBlocks();
        $this->assertCount(1, $blocks);
    }

    public function testGetBlock()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $block = $this->repository->getBlock('jankx/widget-renderer');
        $this->assertInstanceOf(WidgetRendererBlock::class, $block);
    }

    public function testGetBlockNonExistent()
    {
        $block = $this->repository->getBlock('non-existent-block');
        $this->assertNull($block);
    }

    public function testGetBlocks()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $blocks = $this->repository->getBlocks();
        $this->assertIsArray($blocks);
        $this->assertArrayHasKey('jankx/widget-renderer', $blocks);
    }

    public function testGetInstances()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $instances = $this->repository->getInstances();
        $this->assertIsArray($instances);
        $this->assertArrayHasKey('jankx/widget-renderer', $instances);
        $this->assertInstanceOf(WidgetRendererBlock::class, $instances['jankx/widget-renderer']);
    }

    public function testHasBlock()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);

        $this->assertTrue($this->repository->hasBlock('jankx/widget-renderer'));
        $this->assertFalse($this->repository->hasBlock('non-existent-block'));
    }

    public function testGetBlockCount()
    {
        $this->assertEquals(0, $this->repository->getBlockCount());

        $this->repository->registerBlock(WidgetRendererBlock::class);
        $this->assertEquals(1, $this->repository->getBlockCount());
    }

    public function testClear()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);
        $this->assertEquals(1, $this->repository->getBlockCount());

        $this->repository->clear();
        $this->assertEquals(0, $this->repository->getBlockCount());
        $this->assertEmpty($this->repository->getBlocks());
        $this->assertEmpty($this->repository->getInstances());
    }

    public function testRemoveBlock()
    {
        $this->repository->registerBlock(WidgetRendererBlock::class);
        $this->assertTrue($this->repository->hasBlock('jankx/widget-renderer'));

        $this->repository->removeBlock('jankx/widget-renderer');
        $this->assertFalse($this->repository->hasBlock('jankx/widget-renderer'));
        $this->assertEquals(0, $this->repository->getBlockCount());
    }

    public function testRemoveBlockNonExistent()
    {
        $this->repository->removeBlock('non-existent-block');
        $this->assertEquals(0, $this->repository->getBlockCount());
    }

    public function testGetBlocksReturnsEmptyArrayInitially()
    {
        $blocks = $this->repository->getBlocks();
        $this->assertIsArray($blocks);
        $this->assertEmpty($blocks);
    }

    public function testGetInstancesReturnsEmptyArrayInitially()
    {
        $instances = $this->repository->getInstances();
        $this->assertIsArray($instances);
        $this->assertEmpty($instances);
    }

    // ========================================
    // PATTERN TESTS
    // ========================================

    public function testRegisterPattern()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $patterns = $this->repository->getPatterns();
        $this->assertArrayHasKey('test-pattern', $patterns);
        $this->assertEquals('TestPatternClass', $patterns['test-pattern']);
    }

    public function testRegisterPatternWithInvalidClass()
    {
        $this->repository->registerPattern('NonExistentClass', $this->mockApp);

        $patterns = $this->repository->getPatterns();
        $this->assertEmpty($patterns);
    }

    public function testRegisterPatternDuplicate()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $patterns = $this->repository->getPatterns();
        $this->assertCount(1, $patterns);
    }

    public function testGetPattern()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $pattern = $this->repository->getPattern('test-pattern');
        $this->assertInstanceOf(GutenbergPattern::class, $pattern);
    }

    public function testGetPatternNonExistent()
    {
        $pattern = $this->repository->getPattern('non-existent-pattern');
        $this->assertNull($pattern);
    }

    public function testGetPatterns()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $patterns = $this->repository->getPatterns();
        $this->assertIsArray($patterns);
        $this->assertArrayHasKey('test-pattern', $patterns);
    }

    public function testGetPatternInstances()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $instances = $this->repository->getPatternInstances();
        $this->assertIsArray($instances);
        $this->assertArrayHasKey('test-pattern', $instances);
        $this->assertInstanceOf(GutenbergPattern::class, $instances['test-pattern']);
    }

    public function testHasPattern()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);

        $this->assertTrue($this->repository->hasPattern('test-pattern'));
        $this->assertFalse($this->repository->hasPattern('non-existent-pattern'));
    }

    public function testGetPatternCount()
    {
        $this->assertEquals(0, $this->repository->getPatternCount());

        $this->repository->registerPattern('TestPatternClass', $this->mockApp);
        $this->assertEquals(1, $this->repository->getPatternCount());
    }

    public function testRemovePattern()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);
        $this->assertTrue($this->repository->hasPattern('test-pattern'));

        $this->repository->removePattern('test-pattern');
        $this->assertFalse($this->repository->hasPattern('test-pattern'));
        $this->assertEquals(0, $this->repository->getPatternCount());
    }

    public function testRemovePatternNonExistent()
    {
        $this->repository->removePattern('non-existent-pattern');
        $this->assertEquals(0, $this->repository->getPatternCount());
    }

    public function testClearPatterns()
    {
        $this->repository->registerPattern('TestPatternClass', $this->mockApp);
        $this->assertEquals(1, $this->repository->getPatternCount());

        $this->repository->clearPatterns();
        $this->assertEquals(0, $this->repository->getPatternCount());
        $this->assertEmpty($this->repository->getPatterns());
        $this->assertEmpty($this->repository->getPatternInstances());
    }

    public function testGetPatternsReturnsEmptyArrayInitially()
    {
        $patterns = $this->repository->getPatterns();
        $this->assertIsArray($patterns);
        $this->assertEmpty($patterns);
    }

    public function testGetPatternInstancesReturnsEmptyArrayInitially()
    {
        $instances = $this->repository->getPatternInstances();
        $this->assertIsArray($instances);
        $this->assertEmpty($instances);
    }
}
