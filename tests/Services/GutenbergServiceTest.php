<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\GutenbergService;
use Jankx\Foundation\Application;
use Jankx\Gutenberg\GutenbergRepository;
use Jankx\Gutenberg\Blocks\WordPressBlock;
use Jankx\Gutenberg\Block;
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
        $this->gutenbergService = new GutenbergService($this->app);

        // Mock repository methods
        $this->mockRepository->method('getInstances')
            ->willReturn([]);
        $this->mockRepository->method('getBlocks')
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

        // init() calls initBlocks() and registers extras
        // Just verify no exception is thrown
        $this->gutenbergService->init();

        $this->assertTrue(true); // Test passes if no exception
    }

    public function testRegisterBlock()
    {
        $this->mockRepository->expects($this->once())
            ->method('registerBlock')
            ->with(WordPressBlock::class);

        $this->gutenbergService->registerBlock(WordPressBlock::class);
    }

    public function testGetBlock()
    {
        $mockBlock = $this->createMock(Block::class);

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

        // Create fresh service with properly configured mock
        $app = $this->createMock(Application::class);
        $mockRepo = $this->createMock(GutenbergRepository::class);
        $mockRepo->method('getBlocks')->willReturn($expectedBlocks);

        $app->method('make')
            ->willReturnCallback(function ($key) use ($mockRepo) {
                return $key === 'gutenberg.repository' ? $mockRepo : null;
            });

        $service = new GutenbergService($app);
        $result = $service->getBlocks();
        $this->assertEquals($expectedBlocks, $result);
    }

    public function testGetInstances()
    {
        $expectedInstances = [
            'test-block' => $this->createMock(Block::class),
        ];

        // Create fresh mocks for this test
        $app = $this->createMock(Application::class);
        $mockRepository = $this->createMock(GutenbergRepository::class);
        $mockRepository->method('getInstances')
            ->willReturn($expectedInstances);

        $app->method('make')
            ->willReturnCallback(function ($key) use ($mockRepository) {
                if ($key === 'gutenberg.repository') {
                    return $mockRepository;
                }
                return null;
            });

        $service = new GutenbergService($app);

        $result = $service->getInstances();
        $this->assertEquals($expectedInstances, $result);
    }

    public function testHasBlock()
    {
        $this->mockRepository->method('getBlock')
            ->with('test-block')
            ->willReturn($this->createMock(Block::class));

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
        // Create fresh service with properly configured mock
        $app = $this->createMock(Application::class);
        $mockRepo = $this->createMock(GutenbergRepository::class);
        $mockRepo->method('getBlocks')->willReturn([
            'block1' => 'Class1',
            'block2' => 'Class2',
        ]);

        $app->method('make')
            ->willReturnCallback(function ($key) use ($mockRepo) {
                return $key === 'gutenberg.repository' ? $mockRepo : null;
            });

        $service = new GutenbergService($app);
        $result = $service->getBlockCount();
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

        $this->mockRepository->expects($this->atLeastOnce())
            ->method('registerBlock');

        $method->invoke($this->gutenbergService);
    }
}
