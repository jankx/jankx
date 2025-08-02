<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\ErrorSuppressionService;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;

class ErrorSuppressionServiceTest extends TestCase
{
    protected $app;
    protected $service;
    protected $config;

    protected function setUp(): void
    {
        $this->app = $this->createMock(Application::class);
        $this->config = $this->createMock(Repository::class);
        $this->service = new ErrorSuppressionService($this->app);

        // Mock the app to return config
        $this->app->method('make')
            ->with('config')
            ->willReturn($this->config);
    }

    public function testSuppressErrorAddsErrorToList()
    {
        $this->service->suppressError('test_type', 'test error message');

        $result = $this->service->shouldSuppressError('test_type', 'test error message');
        $this->assertTrue($result);
    }

    public function testShouldSuppressErrorReturnsFalseForNonExistentType()
    {
        $result = $this->service->shouldSuppressError('non_existent_type', 'some message');
        $this->assertFalse($result);
    }

    public function testShouldSuppressErrorReturnsFalseForNonMatchingMessage()
    {
        $this->service->suppressError('test_type', 'specific error');

        $result = $this->service->shouldSuppressError('test_type', 'different error');
        $this->assertFalse($result);
    }

    public function testShouldSuppressErrorReturnsTrueForMatchingMessage()
    {
        $this->service->suppressError('test_type', 'specific error message');

        $result = $this->service->shouldSuppressError('test_type', 'this contains specific error message');
        $this->assertTrue($result);
    }

    public function testShouldSuppressErrorWithMultipleSuppressions()
    {
        $this->service->suppressError('test_type', 'first error');
        $this->service->suppressError('test_type', 'second error');

        $result1 = $this->service->shouldSuppressError('test_type', 'first error message');
        $result2 = $this->service->shouldSuppressError('test_type', 'second error message');

        $this->assertTrue($result1);
        $this->assertTrue($result2);
    }

    public function testGetSuppressionConfigReturnsConfig()
    {
        $expectedConfig = ['test' => 'value'];

        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn($expectedConfig);

        $result = $this->service->getSuppressionConfig();
        $this->assertEquals($expectedConfig, $result);
    }

    public function testClearSuppressionsEmptiesSuppressionList()
    {
        $this->service->suppressError('test_type', 'test error');

        // Verify error is suppressed
        $this->assertTrue($this->service->shouldSuppressError('test_type', 'test error'));

        // Clear suppressions
        $this->service->clearSuppressions();

        // Verify error is no longer suppressed
        $this->assertFalse($this->service->shouldSuppressError('test_type', 'test error'));
    }

    public function testMultipleErrorTypes()
    {
        $this->service->suppressError('type1', 'error1');
        $this->service->suppressError('type2', 'error2');

        $result1 = $this->service->shouldSuppressError('type1', 'error1 message');
        $result2 = $this->service->shouldSuppressError('type2', 'error2 message');
        $result3 = $this->service->shouldSuppressError('type1', 'error2 message');

        $this->assertTrue($result1);
        $this->assertTrue($result2);
        $this->assertFalse($result3);
    }

    public function testPartialStringMatching()
    {
        $this->service->suppressError('test_type', 'specific');

        $result1 = $this->service->shouldSuppressError('test_type', 'this is a specific error');
        $result2 = $this->service->shouldSuppressError('test_type', 'specific error message');
        $result3 = $this->service->shouldSuppressError('test_type', 'different error');

        $this->assertTrue($result1);
        $this->assertTrue($result2);
        $this->assertFalse($result3);
    }

    public function testCaseSensitiveMatching()
    {
        $this->service->suppressError('test_type', 'Specific Error');

        $result1 = $this->service->shouldSuppressError('test_type', 'Specific Error message');
        $result2 = $this->service->shouldSuppressError('test_type', 'specific error message');

        $this->assertTrue($result1);
        $this->assertFalse($result2); // Case sensitive
    }

    public function testSuppressionWithEmptyConfig()
    {
        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn([]);

        $result = $this->service->getSuppressionConfig();
        $this->assertEquals([], $result);
    }

    public function testSuppressionWithNestedConfig()
    {
        $nestedConfig = [
            'doing_it_wrong' => [
                'enabled' => true,
                'functions' => ['wp_enqueue_script'],
                'patterns' => ['wp-editor']
            ]
        ];

        $this->config->method('get')
            ->with('error.suppression', [])
            ->willReturn($nestedConfig);

        $result = $this->service->getSuppressionConfig();
        $this->assertEquals($nestedConfig, $result);
    }
}