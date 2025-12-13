<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\GutenbergService;
use Jankx\Foundation\Application;
use Jankx\Support\Blocks\GutenbergRepository;
use Jankx\Support\Blocks\WidgetRendererBlock;
use Jankx\Facades\Log;

class GutenbergServiceTest extends TestCase
{
    protected $app;
    protected $gutenbergService;
    protected $mockRepository;

    protected function setUp(): void
    {
        parent::setUp();

        // Create mock Application
        $this->app = $this->createMock(Application::class);

        // Create mock Repository
        $this->mockRepository = $this->createMock(GutenbergRepository::class);

        // Create mock Logger
        $mockLogger = $this->createMock(\Jankx\Foundation\Log\Logger::class);

        // Set up Application mock to return Repository and Logger
        $this->app->method('make')
            ->willReturnCallback(function ($key) use ($mockLogger) {
                if ($key === 'config') {
                    return $this->createMock(\Jankx\Config\Repository::class);
                }
                if ($key === 'gutenberg.repository') {
                    return $this->mockRepository;
                }
                if ($key === 'log') {
                    return $mockLogger;
                }
                return null;
            });

        // Set up Log facade
        Log::setFacadeApplication($this->app);

        // Create GutenbergService with mocked repository
        $this->gutenbergService = $this->getMockBuilder(GutenbergService::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['discoverBlocks', 'discoverPatterns'])
            ->getMock();

        // Mock repository methods
        $this->mockRepository->method('getPatternInstances')
            ->willReturn([]);
        $this->mockRepository->method('getInstances')
            ->willReturn([]);
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(GutenbergService::class, $this->gutenbergService);
    }

    public function testInit()
    {
        // Ensure Log facade is set
        Log::setFacadeApplication($this->app);

        $this->gutenbergService->expects($this->once())
            ->method('discoverBlocks');

        $this->gutenbergService->expects($this->once())
            ->method('discoverPatterns');

        $this->gutenbergService->init();
    }

    public function testRegisterBlock()
    {
        $this->mockRepository->expects($this->once())
            ->method('registerBlock')
            ->with(WidgetRendererBlock::class);

        $this->gutenbergService->registerBlock(WidgetRendererBlock::class);
    }

    public function testGetBlock()
    {
        $mockBlock = $this->createMock(\Jankx\Support\Blocks\Block::class);

        $this->mockRepository->method('getBlock')
            ->with('test-block')
            ->willReturn($mockBlock);

        $result = $this->gutenbergService->getBlock('test-block');
        $this->assertSame($mockBlock, $result);
    }

    public function testGetBlocks()
    {
        $expectedBlocks = [
            'test-block' => 'TestBlockClass',
        ];

        $this->mockRepository->method('getBlocks')
            ->willReturn($expectedBlocks);

        $result = $this->gutenbergService->getBlocks();
        $this->assertEquals($expectedBlocks, $result);
    }

    public function testGetInstances()
    {
        $expectedInstances = [
            'test-block' => $this->createMock(\Jankx\Support\Blocks\Block::class),
        ];

        // Override the setUp mock for this test
        $this->mockRepository = $this->createMock(GutenbergRepository::class);
        $this->mockRepository->method('getInstances')
            ->willReturn($expectedInstances);

        // Recreate the service with updated repository
        $this->gutenbergService = new GutenbergService($this->app);

        $result = $this->gutenbergService->getInstances();
        $this->assertEquals($expectedInstances, $result);
    }

    public function testHasBlock()
    {
        $this->mockRepository->method('getBlock')
            ->with('test-block')
            ->willReturn($this->createMock(\Jankx\Support\Blocks\Block::class));

        $result = $this->gutenbergService->hasBlock('test-block');
        $this->assertTrue($result);
    }

    public function testHasBlockReturnsFalse()
    {
        $this->mockRepository->method('getBlock')
            ->with('non-existent-block')
            ->willReturn(null);

        $result = $this->gutenbergService->hasBlock('non-existent-block');
        $this->assertFalse($result);
    }

    public function testGetBlockCount()
    {
        $this->mockRepository->method('getBlocks')
            ->willReturn([
                'block1' => 'Class1',
                'block2' => 'Class2',
            ]);

        $result = $this->gutenbergService->getBlockCount();
        $this->assertEquals(2, $result);
    }

    public function testClearCache()
    {
        // Ensure Log facade is set
        Log::setFacadeApplication($this->app);

        $result = $this->gutenbergService->clearCache();
        $this->assertNull($result);
    }

    public function testRegisterDefaultBlocks()
    {
        $reflection = new \ReflectionClass($this->gutenbergService);
        $method = $reflection->getMethod('registerDefaultBlocks');
        $method->setAccessible(true);

        $this->mockRepository->expects($this->once())
            ->method('registerBlock')
            ->with(WidgetRendererBlock::class);

        $method->invoke($this->gutenbergService);
    }
}
